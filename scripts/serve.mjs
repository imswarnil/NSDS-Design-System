#!/usr/bin/env node
/* NS Design System — preview server, with live reload.
   =========================================================================
   A dependency-free static server, deliberately: the design system should be
   previewable with nothing but Node installed. Pulling in a dev-server package
   would mean the preview stops working the day that package breaks, and this
   is the one thing that must always work.

   Serves from the REPO ROOT, not from preview/, because the generated page
   references ../dist/nsds.css and ../<group>/<name>.card.html — the real
   files, not copies. Serving the real tree is what makes the preview show what
   actually ships.

   Modes:
     node scripts/serve.mjs [port]            serve only
     node scripts/serve.mjs [port] --watch    + rebuild on save, auto-reload

   Watch mode is the working loop: save any token, component CSS, card or
   script → tokens, bundle and preview regenerate → every open browser tab
   reloads via SSE. Edit-to-pixels is one save, no manual step.
*/
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { watch } from "node:fs";
import { join, dirname, extname, normalize, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";
import { spawn, execFile } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const PORT = Number(args.find((a) => /^\d+$/.test(a))) || 4322;
const WATCH = args.includes("--watch");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};

/* ---- live reload --------------------------------------------------------
   Server-Sent Events rather than WebSockets: SSE is one long-lived HTTP
   response, needs no protocol upgrade, no library, and auto-reconnects for
   free via the browser's own EventSource retry. */
const clients = new Set();
const broadcast = (msg) => {
  for (const res of clients) res.write(`data: ${msg}\n\n`);
};

/* Injected into every served .html page in watch mode. Reloads on "reload",
   and because EventSource retries automatically, a page that was open while
   the server restarted reconnects by itself. */
const RELOAD_SNIPPET = `\n<script>/* ns live reload (watch mode only — never in any build artifact) */
(function(){var es=new EventSource("/__events");es.onmessage=function(e){if(e.data==="reload")location.reload();};})();
</script>`;

const server = createServer(async (req, res) => {
  try {
    let path = decodeURIComponent(new URL(req.url, "http://localhost").pathname);

    if (WATCH && path === "/__events") {
      res.writeHead(200, { "Content-Type": "text/event-stream", "Cache-Control": "no-store", Connection: "keep-alive" });
      res.write(": connected\n\n");
      clients.add(res);
      req.on("close", () => clients.delete(res));
      return;
    }

    /* The root is the HOMEPAGE, not the styleguide. index.html is generated
       at the repo root by scripts/build-home.mjs precisely so that the dev
       server and the deployed site serve the same file with the same
       relative links; the styleguide lives one click in, at /preview/. */
    if (path === "/") path = "/index.html";

    /* Contain the served path inside ROOT — path traversal is never
       acceptable, even on a local dev port. */
    const full = join(ROOT, normalize(path).replace(/^(\.\.[/\\])+/, ""));
    if (!full.startsWith(ROOT)) { res.writeHead(403).end("Forbidden"); return; }

    const info = await stat(full).catch(() => null);
    if (!info || info.isDirectory()) { res.writeHead(404).end("Not found: " + path); return; }

    const ext = extname(full).toLowerCase();
    let body = await readFile(full);
    /* The snippet rides only on the HTTP response, so no build artifact or
       source file ever contains it. */
    if (WATCH && ext === ".html") body = Buffer.concat([body, Buffer.from(RELOAD_SNIPPET)]);

    res.writeHead(200, {
      "Content-Type": TYPES[ext] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(body);
  } catch (err) {
    res.writeHead(500).end(String(err));
  }
});

/* ---- watcher ------------------------------------------------------------ */
if (WATCH) {
  /* Output and VCS dirs are ignored, which is also what prevents the loop:
     a rebuild writes dist/ and preview/, and those writes must not retrigger
     the rebuild that produced them. */
  /* index.html at the root is a BUILD OUTPUT (scripts/build-home.mjs) that
     sits in a watched directory — without it here, every rebuild rewrites it,
     the watcher sees the write, and the loop never stops. */
  const IGNORE = /(^|[\\/])(node_modules|dist|preview|_site|\.git)([\\/]|$)|^index\.html$/;
  const RELEVANT = /\.(css|html|mjs|js|jsx|json|hbs|svg|woff2)$/;

  let timer = null;
  let building = false;
  let queued = false;

  const runNode = (script) => new Promise((resolve, reject) => {
    execFile(process.execPath, [join(ROOT, "scripts", script)], { cwd: ROOT }, (err, stdout, stderr) => {
      if (err) reject(new Error(stderr || stdout || err.message));
      else resolve();
    });
  });

  const rebuild = async (reason) => {
    if (building) { queued = true; return; } // collapse bursts into one trailing run
    building = true;
    const t0 = Date.now();
    try {
      await runNode("build-tokens.mjs");
      await runNode("build-css.mjs");
      await runNode("build-preview.mjs");
      await runNode("build-home.mjs");
      console.log(`  rebuilt in ${Date.now() - t0}ms  (${reason}) → reloading ${clients.size} tab(s)`);
      broadcast("reload");
    } catch (err) {
      /* A broken save must NOT kill the loop — report and keep watching, so
         fixing the file triggers the next rebuild normally. */
      console.error(`  build failed (${reason}):\n${String(err.message).trim()}`);
    }
    building = false;
    if (queued) { queued = false; rebuild("queued changes"); }
  };

  /* macOS and Windows support recursive fs.watch natively (this repo's
     platforms). One watcher, debounced — editors emit several events per
     save. */
  watch(ROOT, { recursive: true }, (event, filename) => {
    if (!filename) return;
    const rel = filename.split(sep).join("/");
    if (IGNORE.test(rel) || !RELEVANT.test(rel)) return;
    clearTimeout(timer);
    timer = setTimeout(() => rebuild(rel), 200);
  });
}

let port = PORT;
const onListening = () => {
  /* Open on the HOMEPAGE. It is the front door of the deployed site and it
     carries the navigation into everything else, so landing there while
     working is landing where a visitor lands. */
  const url = `http://127.0.0.1:${port}/`;
  console.log(`\n  NS Design System → ${url}`);
  console.log(`  Homepage      ${url}`);
  console.log(`  Styleguide    ${url}preview/index.html`);
  console.log(`  Serving the real tree, so specimens and dist/ are what actually ships.`);
  if (WATCH) console.log("  Watching: save any token, CSS, card or script and open tabs reload.");
  console.log("  Ctrl-C to stop.\n");

  if (!args.includes("--no-open")) {
    const cmd = process.platform === "darwin" ? "open" : process.platform === "win32" ? "start" : "xdg-open";
    spawn(cmd, [url], { stdio: "ignore", detached: true, shell: process.platform === "win32" }).unref();
  }
};
server.once("listening", onListening);
server.listen(port, "127.0.0.1");

server.on("error", (err) => {
  // A busy port is almost always a forgotten earlier preview — walk to the
  // next free one instead of making the user hunt processes.
  if (err.code === "EADDRINUSE" && port < PORT + 10) {
    console.error(`  Port ${port} is busy (an old preview still running?) — trying ${port + 1}…`);
    port += 1;
    setTimeout(() => server.listen(port, "127.0.0.1"), 100);
    return;
  }
  throw err;
});
