#!/usr/bin/env node
/* Namaste UI — deployable static site build.
   =========================================================================
   Stages everything the preview needs into `_site/`, ready for any static
   host (GitHub Pages, Netlify, S3, nginx). The dev server serves the repo
   root directly; a deploy must NOT ship the whole repo (node_modules, docs,
   scripts), so this copies exactly the closure of files the preview page and
   the specimen cards actually reference:

     preview/            the generated styleguide
     dist/               the flat CSS bundle the preview links
     styles.css + tokens/ + components/css/   what the cards link (../styles.css)
     assets/             fonts, icons, logo, theme-init
     * / *.card.html     every specimen, at its real path (iframe srcs)

   Plus an index.html redirect at the root, so the site opens on the preview.

   Run:  node scripts/build-site.mjs        (expects build + build-preview done)
   CI:   the pages workflow runs the full chain then uploads _site/. */
import { cpSync, mkdirSync, rmSync, writeFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");

for (const rel of ["preview/index.html", "dist/namaste-ui.css"]) {
  if (!existsSync(join(ROOT, rel))) {
    console.error(`missing ${rel} — run \`npm run build && npm run build:preview\` first (gulp site does all of it)`);
    process.exit(2);
  }
}

rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

/* Whole directories the preview references. */
const DIRS = ["preview", "dist", "assets", "tokens", "components/css", "templates"];
for (const d of DIRS) cpSync(join(ROOT, d), join(OUT, d), { recursive: true });

/* styles.css imports tokens/ + components/css/ (copied above), so the cards'
   ../styles.css link resolves inside the site exactly as in the repo. */
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
<title>Namaste UI</title>
<a href="./preview/index.html">Namaste UI design system</a>
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
