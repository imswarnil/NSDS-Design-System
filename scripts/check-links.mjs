#!/usr/bin/env node
/* NS Design System — static site integrity check.
   =========================================================================
   guidelines/brand-logo-lockups.card.html shipped for months linking
   `../../styles.css` from one directory deep, and `../../_ds_bundle.js` — a
   file that never existed in this repo at all. Both 404'd, so the card
   rendered as unstyled text on the live site. Nothing caught it: the build
   succeeded, the page existed, and no human opens all 42 specimen cards.

   That is the class of bug this closes. It walks the built _site/ and asserts
   every relative href/src resolves to a real file, plus two structural checks
   that fail the same silent way:

     - duplicate id=          breaks every aria-controls/label pointing at it,
                              and getElementById picks the wrong one
     - dangling aria-controls announces a relationship to a screen reader that
                              does not exist

   Two kinds of reference, two rules, because they fail differently:

     RELATIVE (../dist/x.css, ./favicon.svg)  must resolve. Always. This is the
       bug above, and it is always a real defect.

     ROOT-ABSOLUTE (/tag/apex, /media/x.mp4)  checked only when it is an ASSET
       — src=, or href= on a <link>. A specimen card is meant to open on its
       own and the site is meant to survive a move to a subpath, so a
       root-absolute asset path is a latent 404 (see LIVE.md §1). But
       root-absolute <a href> in templates/ and the demo pages is placeholder
       navigation — /join, /tag/apex, /account/ are illustrative markup for a
       Ghost site, not links into this styleguide, and flagging them would bury
       the real failures in noise.

   Absolute URLs (http://, //) and in-page anchors are not checked — this is an
   integrity check on what we ship, not a link rot crawler for the whole web.

   Run: node scripts/check-links.mjs        (expects `gulp site` to have run) */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE = join(ROOT, "_site");

if (!existsSync(SITE)) {
  console.error("missing _site/ — run `npm run site` first");
  process.exit(2);
}

const walk = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
  const p = join(dir, e.name);
  return e.isDirectory() ? walk(p) : (e.name.endsWith(".html") ? [p] : []);
});

const pages = walk(SITE);
const problems = [];

/* Deliberately regex rather than a DOM parser: this runs in `gulp check` on
   every push, the input is our own generated markup, and adding a parser
   dependency to catch malformed HTML we do not produce is not worth it. */
const ATTR = /<\s*([a-z]+)\b[^>]*?\b(href|src)\s*=\s*"([^"]+)"/gi;
const ID = /\bid\s*=\s*"([^"]+)"/gi;
const CONTROLS = /\baria-controls\s*=\s*"([^"]+)"/gi;

for (const page of pages) {
  const raw_html = readFileSync(page, "utf8");
  const where = relative(SITE, page);
  /* Comments are not the DOM. A header comment that quotes the markup it is
     explaining — `id="player-rail" is load-bearing…` — is documentation, and
     counting it as a second element is how a checker teaches people to stop
     writing comments. */
  const html = raw_html.replace(/<!--[\s\S]*?-->/g, "");

  for (const [, tag, attr, raw] of html.matchAll(ATTR)) {
    // Skip absolute, protocol-relative, in-page, and non-file schemes.
    if (/^(?:[a-z][a-z0-9+.-]*:|\/\/|#|$)/i.test(raw)) continue;
    const clean = raw.split("#")[0].split("?")[0];
    if (!clean) continue;
    // A <source> is a candidate the browser may pick, not an asset the page
    // requires — a <video> with a poster degrades to the poster by design, and
    // some of those clips are documentation, not shipped bytes.
    if (tag.toLowerCase() === "source") continue;
    const isAsset = attr === "src" || tag.toLowerCase() === "link";
    if (clean.startsWith("/") && !isAsset) continue;   // placeholder navigation
    // templates/ are FRAGMENTS for a Ghost site served at its own root, where
    // /assets/logo/favicon.svg is the correct path. They are shipped to the
    // styleguide to be read, not rendered as pages — the demo-*.html wrappers
    // that actually render them rewrite these paths (see build-preview.mjs).
    if (clean.startsWith("/") && where.startsWith("templates/")) continue;
    if (clean.startsWith("/")) {
      problems.push([where, `"${raw}" is a root-absolute asset — breaks a card opened on its own and any non-root host (LIVE.md §1); make it relative`]);
      continue;
    }
    const target = resolve(dirname(page), clean);
    // Escaping the site root is always a bug — it 404s on any host.
    if (!target.startsWith(SITE)) {
      problems.push([where, `"${raw}" escapes the site root`]);
      continue;
    }
    if (!existsSync(target) || statSync(target).isDirectory() && !existsSync(join(target, "index.html"))) {
      problems.push([where, `"${raw}" → missing ${relative(SITE, target)}`]);
    }
  }

  /* templates/ are fragments. A fragment's aria-controls legitimately targets
     an element the consuming page supplies — navbar-course.html's curriculum
     toggle points at the player's rail. Only fully rendered pages are held to
     the relationship actually resolving. */
  const isFragment = where.startsWith("templates/");
  const ids = [...html.matchAll(ID)].map((m) => m[1]);
  const dupes = [...new Set(ids.filter((v, i) => ids.indexOf(v) !== i))];
  if (dupes.length) problems.push([where, `duplicate id: ${dupes.slice(0, 5).join(", ")}`]);

  const idSet = new Set(ids);
  const dangling = isFragment ? [] : [...new Set([...html.matchAll(CONTROLS)].map((m) => m[1]).filter((v) => !idSet.has(v)))];
  if (dangling.length) problems.push([where, `aria-controls points at no element: ${dangling.slice(0, 5).join(", ")}`]);
}

if (problems.length) {
  for (const [where, msg] of problems) console.error(`_site/${where}  [links]  ${msg}`);
  console.error(`\n${problems.length} integrity problem(s) across ${pages.length} page(s).`);
  process.exit(1);
}
console.log(`Link check passed — ${pages.length} page(s), every relative href/src resolves, no duplicate ids, no dangling aria-controls.`);
