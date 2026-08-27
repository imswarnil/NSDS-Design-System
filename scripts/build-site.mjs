#!/usr/bin/env node
/* NSDS — deployable static site build.
   =========================================================================
   Stages everything the preview needs into `_site/`, ready for any static
   host (GitHub Pages, Netlify, S3, nginx). The dev server serves the repo
   root directly; a deploy must NOT ship the whole repo (node_modules, docs,
   scripts), so this copies exactly the closure of files the preview page and
   the specimen cards actually reference:

     preview/            the generated styleguide
     dist/               the CSS bundles — pages and cards link the Tailwind
                         one (dist/nsds.tailwind.css) so utilities work
     styles.css + tokens/ + src/css/   the un-bundled source, shipped so
                         the site doubles as a readable reference
     assets/             icons, logo, theme-init, the runtime scripts
     fonts/              Switzer + Roboto Mono (latin-subset variable woff2)
                         and the Fontshare EULA that must travel with them
     * / *.card.html     every specimen, at its real path (iframe srcs)

   Plus a real, indexable homepage at the root (see below), robots.txt,
   sitemap.xml and the CNAME that pins the custom domain.

   Run:  node scripts/build-site.mjs        (expects build + build-preview done)
   CI:   the pages workflow runs the full chain then uploads _site/. */
import { cpSync, mkdirSync, rmSync, writeFileSync, readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { renderHome } from "./build-home.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");

for (const rel of ["preview/index.html", "preview/pages.json", "preview/demos.json", "dist/nsds.css", "dist/nsds.tailwind.css"]) {
  if (!existsSync(join(ROOT, rel))) {
    console.error(`missing ${rel} — run \`npm run build && npm run build:preview\` first (gulp site does all of it)`);
    process.exit(2);
  }
}

/* maxRetries: a recursive delete of a directory the dev server is actively
   serving intermittently fails on macOS (ENOTEMPTY/EBUSY) when a request is
   in flight — the build then dies with a bare exit code and no explanation,
   which reads like a code error and is not one. Node retries the unlink for
   us; three attempts 100ms apart has been enough every time. */
rmSync(OUT, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
mkdirSync(OUT, { recursive: true });

/* Whole directories the preview references. */
const DIRS = ["preview", "dist", "assets", "icons", "fonts", "templates", "src"];
for (const d of DIRS) cpSync(join(ROOT, d), join(OUT, d), { recursive: true });

/* Nothing links this any more — the pages and cards all load
   dist/nsds.tailwind.css. It ships because tokens/ and src/css/
   are copied above and styles.css is the file that explains how they fit
   together, including the @layer order the whole override contract rests on. */
cpSync(join(ROOT, "src/styles.css"), join(OUT, "src/styles.css"));

/* Every specimen card, preserving its repo-relative path — the preview's
   iframe srcs are ../<path>, so the structure must match exactly. */
const walk = (dir) => {
  let out = [];
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (["node_modules", "dist", "preview", "_site", ".git"].includes(e.name) || e.name.startsWith(".")) continue;
    if (e.isDirectory()) out = out.concat(walk(join(dir, e.name)));
    else if (e.name.endsWith(".card.html")) out.push(join(dir, e.name));
  }
  return out;
};
let cardCount = 0;
for (const rel of walk(".")) {
  mkdirSync(join(OUT, dirname(rel)), { recursive: true });
  cpSync(join(ROOT, rel), join(OUT, rel));
  cardCount++;
}

/* ---- the homepage -------------------------------------------------------
   This used to be a meta-refresh into preview/index.html. A redirect is not a
   page: a crawler follows it, indexes the target, and the domain itself has
   no entry in any index — nsds.imswarnil.com would be a URL nothing links to
   and nothing describes.

   So the root is now a real document with its own content: what the system
   is, what is in it, and a complete link list to all 165 generated pages.
   That link list is the important part — it is the only route a crawler has
   into the styleguide, whose own navigation it reaches through no other
   page. It is generated from preview/pages.json, so a page added to the
   generator appears here and in sitemap.xml without anyone maintaining a
   second list by hand. */
const SITE = (process.env.SITE_URL || "https://nsds.imswarnil.com").replace(/\/+$/, "");
const pages = JSON.parse(readFileSync(join(ROOT, "preview/pages.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
const themeInit = readFileSync(join(ROOT, "assets/js/theme-init.js"), "utf8").replace(/<\/script/g, "<\\/script");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* The homepage itself is rendered by scripts/build-home.mjs, which also
   writes the identical file to the repo root for the dev server. One
   implementation: the page you develop against and the page that deploys
   cannot drift apart, because they are the same function call. */
writeFileSync(join(OUT, "index.html"), renderHome({
  site: SITE,
  pages,
  demos: JSON.parse(readFileSync(join(ROOT, "preview/demos.json"), "utf8")),
  pkg,
  themeInit,
}));

/* ---- crawl surface ------------------------------------------------------
   robots.txt names the sitemap (the only reliable way to hand a crawler a
   165-page list), and sitemap.xml lists the homepage plus every generated
   page. Specimen cards are deliberately absent: they are fragments meant to
   be iframed, and indexing them would put contextless snippets in results
   ahead of the pages that explain them. */
writeFileSync(join(OUT, "robots.txt"), `User-agent: *
Allow: /

Sitemap: ${SITE}/sitemap.xml
`);

const urls = [`${SITE}/`, ...pages.map((p) => `${SITE}/preview/${p.file}`)];
writeFileSync(join(OUT, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u, i) => `  <url><loc>${u}</loc><priority>${i === 0 ? "1.0" : "0.7"}</priority></url>`).join("\n")}
</urlset>
`);

/* The custom domain. GitHub Pages reads this file out of the deployed
   artifact, so it must be written by the build, not just set in the repo's
   settings — an Actions deploy that ships no CNAME drops the domain back to
   the *.github.io default on the next publish. */
writeFileSync(join(OUT, "CNAME"), `${SITE.replace(/^https?:\/\//, "")}\n`);

/* Tell GitHub Pages not to run Jekyll — it would ignore files/dirs it
   considers special and quietly break asset paths. */
writeFileSync(join(OUT, ".nojekyll"), "");

const size = (dir) => {
  let n = 0;
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    n += e.isDirectory() ? size(p) : statSync(p).size;
  }
  return n;
};
console.log(`wrote _site/ — ${cardCount} specimen cards, ${(size(OUT) / 1024 / 1024).toFixed(1)} MB total, ready for any static host`);
