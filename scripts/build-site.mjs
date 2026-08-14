#!/usr/bin/env node
/* NS Design System — deployable static site build.
   =========================================================================
   Stages everything the preview needs into `_site/`, ready for any static
   host (GitHub Pages, Netlify, S3, nginx). The dev server serves the repo
   root directly; a deploy must NOT ship the whole repo (node_modules, docs,
   scripts), so this copies exactly the closure of files the preview page and
   the specimen cards actually reference:

     preview/            the generated styleguide
     dist/               the CSS bundles — pages and cards link the Tailwind
                         one (dist/namaste-ui.tailwind.css) so utilities work
     styles.css + tokens/ + components/css/   the un-bundled source, shipped so
                         the site doubles as a readable reference
     assets/             icons, logo, theme-init, the runtime scripts
     fonts/              Switzer + Sentient (latin-subset variable woff2)
                         and the Fontshare EULA that must travel with them
     * / *.card.html     every specimen, at its real path (iframe srcs)

   Plus an index.html redirect at the root, so the site opens on the preview.

   Run:  node scripts/build-site.mjs        (expects build + build-preview done)
   CI:   the pages workflow runs the full chain then uploads _site/. */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");

for (const rel of ["preview/index.html", "dist/namaste-ui.css", "dist/namaste-ui.tailwind.css"]) {
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
const DIRS = ["preview", "dist", "assets", "icons", "fonts", "patterns", "tokens", "components/css", "templates"];
for (const d of DIRS) cpSync(join(ROOT, d), join(OUT, d), { recursive: true });

/* Nothing links this any more — the pages and cards all load
   dist/namaste-ui.tailwind.css. It ships because tokens/ and components/css/
   are copied above and styles.css is the file that explains how they fit
   together, including the @layer order the whole override contract rests on. */
cpSync(join(ROOT, "styles.css"), join(OUT, "styles.css"));

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

/* Root redirect → the styleguide. A meta refresh, so it works on hosts that
   do not support server-side redirects (plain S3, Pages). */
writeFileSync(join(OUT, "index.html"), `<!DOCTYPE html>
<meta charset="utf-8">
<meta http-equiv="refresh" content="0; url=./preview/index.html">
<title>NS Design System</title>
<a href="./preview/index.html">NS Design System design system</a>
`);

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
