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
                         one (dist/namaste-ui.tailwind.css) so utilities work
     styles.css + tokens/ + components/css/   the un-bundled source, shipped so
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

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "_site");

for (const rel of ["preview/index.html", "preview/pages.json", "dist/namaste-ui.css", "dist/namaste-ui.tailwind.css"]) {
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

/* The four numbers the styleguide's own home page states. Lifted from the
   generated markup rather than recomputed here, so the homepage cannot
   advertise a token count the styleguide disagrees with. */
const home = readFileSync(join(ROOT, "preview/index.html"), "utf8");
const stats = [...home.matchAll(/ns-statband__value">(\d+)<\/dd><dt class="ns-statband__label">([^<]+)</g)]
  .map((m) => ({ value: m[1], label: m[2] }));

/* Group the manifest the way the styleguide's rail groups it: foundations
   first, then component families, then the doc sides. Insertion order of the
   manifest is the page order, so a Map preserves it for free. */
const groups = new Map();
for (const p of pages) {
  if (p.kind === "home") continue;
  const key = p.kind === "section" ? "Foundations" : (p.group || "Documentation");
  if (!groups.has(key)) groups.set(key, []);
  groups.get(key).push(p);
}

const indexBlocks = [...groups].map(([name, list]) => `      <section class="idx">
        <h3 class="idx__head">${esc(name)} <span>${list.length}</span></h3>
        <ul class="idx__list">
${list.map((p) => `          <li><a href="./preview/${p.file}"><span class="idx__num">${p.num}</span>${esc(p.title)}</a></li>`).join("\n")}
        </ul>
      </section>`).join("\n");

/* Structured data. Modest and true: a software project with a name, an
   author and a documentation URL. Nothing invented. */
const jsonLd = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "NSDS — NS Design System",
  alternateName: "NSDS",
  description: "The design system behind Namaste Salesforce: one set of design tokens and one portable component layer, rendered by both a Ghost theme and a Next.js LMS.",
  url: `${SITE}/`,
  codeRepository: pkg.repository?.url?.replace(/^git\+|\.git$/g, "") || undefined,
  license: "https://opensource.org/licenses/MIT",
  programmingLanguage: "CSS",
  version: pkg.version,
  author: { "@type": "Person", name: pkg.author?.name, url: pkg.author?.url },
}, null, 2);

const DESCRIPTION = `NSDS is the design system behind Namaste Salesforce — ${stats[0]?.value || "250+"} design tokens, a portable .ns-* component layer, and a generated styleguide covering colour, type, spacing, components, charts and content creation.`;

writeFileSync(join(OUT, "index.html"), `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NSDS — NS Design System</title>
<meta name="description" content="${esc(DESCRIPTION)}">
<link rel="canonical" href="${SITE}/">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NSDS — NS Design System">
<meta property="og:title" content="NSDS — NS Design System">
<meta property="og:description" content="${esc(DESCRIPTION)}">
<meta property="og:url" content="${SITE}/">
<meta property="og:image" content="${SITE}/assets/logo/icon-512.png">
<meta name="twitter:card" content="summary">
<link rel="icon" href="./assets/logo/favicon.svg">
<script>${themeInit}</script>
<link rel="stylesheet" href="./dist/namaste-ui.tailwind.css">
<script type="application/ld+json">${jsonLd}</script>
<style>
  .wrap { max-inline-size: 72rem; margin-inline: auto; padding-inline: var(--space-6); }
  .bar { display: flex; align-items: center; justify-content: space-between; gap: var(--space-4);
         padding-block: var(--space-4); border-block-end: 1px solid var(--color-border); }
  .bar__name { font-family: var(--font-heading); font-weight: var(--weight-bold); letter-spacing: -.01em; }
  .bar__name span { color: var(--color-muted); font-weight: var(--weight-regular); }
  .bar__links { display: flex; gap: var(--space-3); align-items: center; }
  .hero { margin-block-start: var(--space-8); }
  .hero .ns-band__title { max-inline-size: 22ch; }
  .cta { display: flex; flex-wrap: wrap; gap: var(--space-3); margin-block-start: var(--space-6); }
  .lede { font-size: var(--size-body-lg); color: var(--color-muted); max-inline-size: 62ch;
          margin-block: 0 var(--space-8); line-height: var(--leading-body); }
  h2 { font-family: var(--font-heading); font-size: var(--size-h3); font-weight: var(--weight-semibold);
       margin-block: var(--space-12) var(--space-4); letter-spacing: -.01em; }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: var(--space-4); }
  .tile { border: 1px solid var(--color-border); padding: var(--space-5); display: block;
          color: inherit; text-decoration: none; background: var(--color-surface); }
  .tile:hover { border-color: var(--color-brand-500); }
  .tile h3 { font-family: var(--font-heading); font-size: var(--size-h4); font-weight: var(--weight-semibold);
             margin: 0 0 var(--space-2); }
  .tile p { margin: 0; color: var(--color-muted); font-size: var(--size-small); line-height: var(--leading-body); }
  .idx { margin-block-end: var(--space-8); break-inside: avoid; }
  .idx__head { font-family: var(--font-mono); font-size: var(--size-fine); text-transform: uppercase;
               letter-spacing: .08em; color: var(--color-muted); margin: 0 0 var(--space-2);
               padding-block-end: var(--space-2); border-block-end: 1px solid var(--color-border); }
  .idx__head span { color: var(--color-brand-500); }
  .idx__list { list-style: none; margin: 0; padding: 0;
               columns: 3 14rem; column-gap: var(--space-6); }
  .idx__list li { break-inside: avoid; }
  .idx__list a { display: flex; gap: var(--space-2); padding-block: var(--space-1);
                 font-size: var(--size-small); color: var(--color-ink); text-decoration: none; }
  .idx__list a:hover { color: var(--color-brand-600); }
  .idx__num { font-family: var(--font-mono); font-size: var(--size-fine); color: var(--color-muted); flex: none; }
  .foot { margin-block: var(--space-12) var(--space-8); padding-block-start: var(--space-6);
          border-block-start: 1px solid var(--color-border); display: flex; flex-wrap: wrap;
          gap: var(--space-4); justify-content: space-between; color: var(--color-muted);
          font-size: var(--size-small); }
  .foot a { color: var(--color-muted); }
</style>
</head>
<body>
<div class="wrap">

  <header class="bar">
    <span class="bar__name">NSDS <span>— NS Design System</span></span>
    <nav class="bar__links" aria-label="Primary">
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="./preview/index.html">Styleguide</a>
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="${esc(pkg.repository?.url?.replace(/^git\+|\.git$/g, "") || "#")}">GitHub</a>
    </nav>
  </header>

  <div class="ns-band ns-band--dark ns-band--grid hero">
    <div class="ns-band__inner">
      <span class="ns-kicker">The design system behind Namaste Salesforce</span>
      <h1 class="ns-band__title">Calm, flat, reading-first.<br>One blue. Hairlines. Mono for data.</h1>
      <p class="ns-band__lede">NSDS is one set of design tokens and one portable component layer, rendered by both the Ghost theme (Handlebars&nbsp;+&nbsp;Tailwind&nbsp;v4) and the Next.js LMS (React). Every page of its styleguide is generated from the real artifacts, so the documentation cannot drift from the system.</p>
      <div class="cta">
        <a class="ns-btn ns-btn--primary" href="./preview/index.html">Open the styleguide</a>
        <a class="ns-btn ns-btn--white" href="./preview/intro.html">Read the principles</a>
      </div>
    </div>
  </div>

  <dl class="ns-statband">
${stats.map((s) => `    <div class="ns-statband__cell"><dd class="ns-statband__value">${esc(s.value)}</dd><dt class="ns-statband__label">${esc(s.label)}</dt></div>`).join("\n")}
  </dl>

  <h2>What is in here</h2>
  <div class="cards">
    <a class="tile" href="./preview/color.html"><h3>Foundations</h3><p>Colour, typography, spacing, geometry, motion and elevation — every value a token, every token exported to CSS, JSON, JS and Tailwind.</p></a>
    <a class="tile" href="./preview/classes.html"><h3>Components</h3><p>A portable <code>.ns-*</code> class layer: navigation, forms, overlays, the course player, the admin console and the AI surfaces. No framework required.</p></a>
    <a class="tile" href="./preview/chart-intro.html"><h3>Charts</h3><p>A data-visualization layer with a machine-verified palette — the hues are checked against the colourblind simulations on every build.</p></a>
    <a class="tile" href="./preview/cc-approach.html"><h3>Content creation</h3><p>Thumbnails, social templates, video structure and the live-stream scene system — the public assets built from the same tokens as the product.</p></a>
  </div>

  <h2>Use it</h2>
  <div class="ns-prose">
    <p>The flat bundle is a single stylesheet with no build step: link it and every <code>.ns-*</code> class works, in light and dark, with the fonts and icons self-hosted alongside.</p>
    <pre><code>&lt;link rel="stylesheet" href="dist/namaste-ui.css"&gt;</code></pre>
    <p>Consuming it from a project instead — tokens as JavaScript, the Tailwind v4 theme, or the component CSS on its own — is covered in <a href="${esc(pkg.repository?.url?.replace(/^git\+|\.git$/g, "") || "#")}/blob/main/docs/INTEGRATION.md">the integration guide</a>.</p>
  </div>

  <h2>Every page</h2>
  <p class="lede">${pages.length} generated pages. Each one is built from the artifact it documents, and each is a stable, linkable URL.</p>
  <div>
${indexBlocks}
  </div>

  <footer class="foot">
    <span>NSDS v${esc(pkg.version)} — MIT licensed. Built by <a href="${esc(pkg.author?.url || "#")}">${esc(pkg.author?.name || "")}</a>.</span>
    <span><a href="${esc(pkg.repository?.url?.replace(/^git\+|\.git$/g, "") || "#")}">Source</a> · <a href="./preview/index.html">Styleguide</a> · <a href="./sitemap.xml">Sitemap</a></span>
  </footer>

</div>
</body>
</html>
`);

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
