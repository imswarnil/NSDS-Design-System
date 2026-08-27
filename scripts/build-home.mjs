#!/usr/bin/env node
/* NSDS — the design system's own homepage.
   =========================================================================
   ONE homepage, written to TWO places, because it has two jobs:

     ./index.html    the dev loop's front door. `gulp` builds it and
                     scripts/serve.mjs serves it at http://127.0.0.1:4322/,
                     so the thing you land on while working is the thing
                     visitors land on.
     _site/index.html  the deployed root. scripts/build-site.mjs imports
                     `renderHome` from here rather than keeping a second copy.

   The two are byte-identical, which is only possible because every link is
   relative and both locations have the same neighbours: `./preview/`,
   `./dist/`, `./assets/`. That is the whole reason the file is generated at
   the repo root rather than inside preview/ — from preview/ the link to the
   styleguide would have to climb out and back in, and the deployed copy
   could not share it.

   It is generated, not authored, for the same reason the styleguide is: the
   stat band, the navigation menus and the full page index all come from
   preview/pages.json and preview/demos.json. Add a styleguide page or a
   full-page demo and it appears in the site's navigation with nothing else
   to remember.

   Run:  node scripts/build-home.mjs        (expects build-preview to have run)
*/
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- the page ------------------------------------------------------------ */
export function renderHome({ site, pages, demos, pkg, themeInit }) {
  const repo = pkg.repository?.url?.replace(/^git\+|\.git$/g, "") || "#";

  /* The four numbers the styleguide's own home page states. Lifted from the
     generated markup rather than recomputed, so this page cannot advertise a
     token count the styleguide disagrees with. */
  const home = existsSync(join(ROOT, "preview/index.html"))
    ? readFileSync(join(ROOT, "preview/index.html"), "utf8")
    : "";
  const stats = [...home.matchAll(/ns-statband__value">(\d+)<\/dd><dt class="ns-statband__label">([^<]+)</g)]
    .map((m) => ({ value: m[1], label: m[2] }));

  /* Group the manifest the way the styleguide's rail groups it: foundations
     first, then component families, then the doc sides. Insertion order of
     the manifest is the page order, so a Map preserves it for free. */
  const groups = new Map();
  for (const p of pages) {
    if (p.kind === "home") continue;
    const key = p.kind === "section" ? "Foundations" : (p.group || "Documentation");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(p);
  }
  const foundations = groups.get("Foundations") || [];
  const families = [...groups].filter(([name]) => name !== "Foundations");

  const DESCRIPTION = `NSDS is the design system behind Namaste Salesforce — ${stats[0]?.value || "250+"} design tokens, a portable .ns-* component layer, and a generated styleguide covering colour, type, spacing, components, charts and content creation.`;

  /* A nav menu is a native <details>. No framework, no ARIA to get wrong:
     the summary is the button, the panel is its content, Escape and
     click-outside are eight lines of script at the foot. */
  const menu = (label, items, cols = 1) => `
        <details class="menu">
          <summary>${esc(label)}<i class="ph ph-caret-down" aria-hidden="true"></i></summary>
          <div class="menu__panel"${cols > 1 ? ` style="--cols:${cols}"` : ""}>
${items.map((i) => `            <a href="${esc(i.href)}">${esc(i.label)}${i.meta ? `<span>${esc(i.meta)}</span>` : ""}</a>`).join("\n")}
          </div>
        </details>`;

  const foundationItems = foundations.map((p) => ({ href: `./preview/${p.file}`, label: p.title }));
  const familyItems = families.map(([name, list]) => ({
    href: `./preview/${list[0].file}`,
    label: name,
    meta: String(list.length),
  }));
  const demoItems = demos.map((d) => ({ href: `./preview/${d.file}`, label: d.title }));

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
    url: `${site}/`,
    codeRepository: repo === "#" ? undefined : repo,
    license: "https://opensource.org/licenses/MIT",
    programmingLanguage: "CSS",
    version: pkg.version,
    author: { "@type": "Person", name: pkg.author?.name, url: pkg.author?.url },
  }, null, 2);

  return `<!DOCTYPE html>
<html lang="en" data-ns-base="./preview/" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>NSDS — NS Design System</title>
<meta name="description" content="${esc(DESCRIPTION)}">
<link rel="canonical" href="${site}/">
<meta name="robots" content="index, follow">
<meta property="og:type" content="website">
<meta property="og:site_name" content="NSDS — NS Design System">
<meta property="og:title" content="NSDS — NS Design System">
<meta property="og:description" content="${esc(DESCRIPTION)}">
<meta property="og:url" content="${site}/">
<meta property="og:image" content="${site}/assets/logo/icon-512.png">
<meta name="twitter:card" content="summary">
<link rel="icon" href="./assets/logo/favicon.svg">
<script>${themeInit}</script>
<link rel="stylesheet" href="./dist/namaste-ui.tailwind.css">
<script type="application/ld+json">${jsonLd}</script>
<style>
  .wrap { max-inline-size: 72rem; margin-inline: auto; padding-inline: var(--space-6); }

  /* --- the bar ----------------------------------------------------------
     Sticky, hairline-bottomed, and the only chrome on the page. It is built
     from the page's own <style> rather than .ns-topnav because the site
     navbar is a PRODUCT component with a search dialog and an account menu
     behind it — this is a documentation shell, and borrowing the product's
     bar here would document a relationship that does not exist. */
  .bar { position: sticky; inset-block-start: 0; z-index: var(--z-sticky);
         background: color-mix(in srgb, var(--color-surface) 92%, transparent);
         backdrop-filter: blur(8px); border-block-end: 1px solid var(--color-border); }
  .bar__in { max-inline-size: 72rem; margin-inline: auto; padding: var(--space-3) var(--space-6);
             display: flex; align-items: center; gap: var(--space-2); }
  .bar__name { display: flex; align-items: center; gap: var(--space-2); font-family: var(--font-heading);
               font-weight: var(--weight-heading); letter-spacing: var(--tracking-tight);
               color: var(--color-ink); text-decoration: none; margin-inline-end: var(--space-4); }
  .bar__name span { color: var(--color-muted); font-weight: var(--weight-regular); }
  .bar__name img { inline-size: 1.5rem; block-size: 1.5rem; }
  .bar__nav { display: flex; align-items: center; gap: var(--space-1); flex: 1; flex-wrap: wrap; }
  .bar__end { display: flex; align-items: center; gap: var(--space-2); margin-inline-start: auto; }
  .bar a.navlink { padding: var(--space-2) var(--space-3); border-radius: var(--radius-btn);
                   font-size: var(--size-small); font-weight: var(--weight-medium);
                   color: var(--color-muted); text-decoration: none; }
  .bar a.navlink:hover { color: var(--color-ink); background: var(--color-surface-sunken); }

  /* --- native <details> menus ------------------------------------------- */
  .menu { position: relative; }
  .menu > summary { list-style: none; cursor: pointer; display: inline-flex; align-items: center;
                    gap: var(--space-1-5); padding: var(--space-2) var(--space-3);
                    border-radius: var(--radius-btn); font-size: var(--size-small);
                    font-weight: var(--weight-medium); color: var(--color-muted); }
  .menu > summary::-webkit-details-marker { display: none; }
  .menu > summary:hover { color: var(--color-ink); background: var(--color-surface-sunken); }
  .menu > summary:focus-visible { outline: var(--focus-ring-width) solid var(--color-brand-500);
                                  outline-offset: var(--focus-ring-offset); }
  .menu[open] > summary { color: var(--color-ink); background: var(--color-surface-sunken); }
  .menu[open] > summary i { rotate: 180deg; }
  .menu > summary i { font-size: var(--size-fine); transition: rotate var(--duration-fast) var(--ease-out); }
  .menu__panel { position: absolute; inset-block-start: calc(100% + var(--space-2)); inset-inline-start: 0;
                 z-index: var(--z-dropdown); min-inline-size: 14rem;
                 display: grid; grid-template-columns: repeat(var(--cols, 1), minmax(11rem, 1fr));
                 gap: var(--space-0-5); padding: var(--space-2);
                 border: 1px solid var(--color-border); border-radius: var(--radius-card);
                 background: var(--color-surface); box-shadow: var(--shadow-raised);
                 max-block-size: 70vh; overflow-y: auto; }
  .menu__panel a { display: flex; align-items: baseline; justify-content: space-between; gap: var(--space-3);
                   padding: var(--space-1-5) var(--space-2); border-radius: var(--radius-sm);
                   font-size: var(--size-small); color: var(--color-ink); text-decoration: none;
                   white-space: nowrap; }
  .menu__panel a:hover { background: var(--color-surface-sunken); color: var(--color-brand-600); }
  .menu__panel a span { font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-label); }
  @media (max-width: 47.999rem) {
    .menu__panel { position: static; inset: auto; box-shadow: none; grid-template-columns: 1fr;
                   max-block-size: 18rem; margin-block-start: var(--space-2); }
    .bar__in { flex-wrap: wrap; }
  }

  /* --- page -------------------------------------------------------------- */
  h2 { font-family: var(--font-heading); font-size: var(--size-h3); font-weight: var(--weight-semibold);
       margin-block: var(--space-12) var(--space-2); letter-spacing: var(--tracking-tight); }
  .sub { color: var(--color-muted); max-inline-size: var(--measure-prose); margin-block: 0 var(--space-5);
         line-height: var(--leading-body); }
  .cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(15rem, 1fr)); gap: var(--space-4); }
  .tile { border: 1px solid var(--color-border); border-radius: var(--radius-card); padding: var(--space-5);
          display: block; color: inherit; text-decoration: none; background: var(--color-surface);
          box-shadow: inset 0 2px 0 transparent;
          transition: border-color var(--duration-fast) var(--ease-out),
                      box-shadow var(--duration-fast) var(--ease-out); }
  .tile:hover { border-color: var(--color-brand-500); box-shadow: inset 0 2px 0 var(--color-brand-500); }
  .tile h3 { font-family: var(--font-heading); font-size: var(--size-h4); font-weight: var(--weight-semibold);
             margin: 0 0 var(--space-2); }
  .tile p { margin: 0; color: var(--color-muted); font-size: var(--size-small); line-height: var(--leading-snug); }
  .tile__kicker { display: block; font-family: var(--font-mono); font-size: var(--size-label);
                  font-weight: var(--weight-label); letter-spacing: var(--tracking-label);
                  text-transform: uppercase; color: var(--color-label); margin-block-end: var(--space-2); }
  /* The template shelf. A grid of real cards rather than another index
     list, because these are the thing most visitors actually came for and
     a list item does not look like something you open. */
  .tpl { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(17rem, 100%), 1fr));
         gap: var(--space-3); margin-block-end: var(--space-10); }
  .tpl__item { display: grid; gap: var(--space-1); padding: var(--space-4);
               border: 1px solid var(--color-border); border-radius: var(--radius-card);
               background: var(--color-surface); text-decoration: none; color: inherit;
               box-shadow: inset 0 2px 0 transparent;
               transition: border-color var(--duration-fast) var(--ease-out),
                           box-shadow var(--duration-fast) var(--ease-out); }
  .tpl__item:hover { border-color: var(--color-brand-500); box-shadow: inset 0 2px 0 var(--color-brand-500); }
  .tpl__name { font-size: var(--size-prose); font-weight: var(--weight-semibold); color: var(--color-ink); }
  .tpl__note { font-size: var(--size-prose-small); line-height: var(--leading-snug); color: var(--color-muted); }

  .idx { margin-block-end: var(--space-8); break-inside: avoid; }
  .idx__head { font-family: var(--font-mono); font-size: var(--size-fine); text-transform: uppercase;
               letter-spacing: var(--tracking-label); color: var(--color-muted); margin: 0 0 var(--space-2);
               padding-block-end: var(--space-2); border-block-end: 1px solid var(--color-border); }
  .idx__head span { color: var(--color-brand-500); }
  .idx__list { list-style: none; margin: 0; padding: 0; columns: 3 14rem; column-gap: var(--space-6); }
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

<a class="ns-skip-link" href="#main">Skip to content</a>

<header class="bar">
  <div class="bar__in">
    <a class="bar__name" href="./index.html">
      <img src="./assets/logo/favicon.svg" alt="" width="24" height="24">
      NSDS <span>— NS Design System</span>
    </a>
    <nav class="bar__nav" aria-label="Primary">
      <a class="navlink" href="./preview/index.html">Styleguide</a>
${menu("Foundations", foundationItems)}
${menu("Components", familyItems, 2)}
${menu("Demos", demoItems)}
      <a class="navlink" href="./preview/homepage.html">Page recipes</a>
    </nav>
    <div class="bar__end">
      <!-- The palette's trigger is injected here by assets/js/search.js, so
           a page with JS off never shows a search control that cannot run. -->
      <span data-ns-search></span>
      <button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" type="button" data-theme-toggle aria-label="Toggle dark mode">
        <i class="ph ph-circle-half" aria-hidden="true"></i>
      </button>
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="${esc(repo)}">GitHub</a>
      <a class="ns-btn ns-btn--primary ns-btn--sm" href="./preview/index.html">Open styleguide</a>
    </div>
  </div>
</header>

<main id="main" tabindex="-1">

  <!-- OUTSIDE .wrap on purpose. A band is full-bleed by definition — its own
       __inner does the centring — so nesting it in the page's 72rem wrapper
       gave the navy a white margin on both sides and a gap under the bar,
       which reads as a rendering mistake rather than a design. --flush drops
       the top padding and squares the corners; the content inside still lands
       on the same 72rem column as everything below it. -->
  <div class="ns-band ns-hero ns-hero--split ns-hero--flush ns-band--dark ns-band--grid ns-band--grid-live">
    <div class="ns-band__inner">
      <div>
      <span class="ns-kicker">The design system behind Namaste Salesforce</span>
      <h1 class="ns-hero__title" style="font-size:var(--size-h1)">Calm, flat, reading-first. One blue. Hairlines. Mono for data.</h1>
      <p class="ns-hero__lede">NSDS is one set of design tokens and one portable component layer, rendered by both the Ghost theme (Handlebars&nbsp;+&nbsp;Tailwind&nbsp;v4) and the Next.js LMS (React). Every page of its styleguide is generated from the real artifacts, so the documentation cannot drift from the system.</p>
      <div class="ns-hero__actions">
        <a class="ns-btn ns-btn--white" href="./preview/index.html">Open the styleguide</a>
        <a class="ns-btn ns-btn--ghost" href="./preview/intro.html">Read the principles</a>
      </div>
      <span class="ns-hero__proof">MIT licensed · two products, one source · checked in CI</span>
      </div>
      <!-- The argument of this page, drawn with the thing it argues about:
           the pieces are this system's own primitives, arranged into a
           miniature of the product they build and animated arriving. Nothing
           here is illustration — change a radius token and the picture
           changes with it. -->
      <div class="ns-hero__media">
      <div class="ns-assembly" aria-hidden="true">
        <div class="ns-assembly__window">
          <div class="ns-assembly__chrome">
            <span class="ns-assembly__dot"></span>
            <span class="ns-assembly__dot"></span>
            <span class="ns-assembly__dot"></span>
            <span class="ns-assembly__url">namastesalesforce.com</span>
          </div>

          <!-- Every slot holds TWO layers in the same box: the component's
               file name, and the thing that file renders. They cross-fade on
               one shared timeline, so each label becomes its own component in
               the exact place that component lives on the page. -->
          <div class="ns-assembly__page">
            <div class="ns-assembly__slot ns-assembly__slot--nav">
              <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>nav.cmp</span>
              <div class="ns-assembly__render">
                <span class="ns-assembly__bar">
                  <span class="ns-assembly__mark"></span>
                  <span class="ns-assembly__line ns-assembly__line--short"></span>
                  <span class="ns-assembly__line"></span>
                </span>
              </div>
            </div>

            <div class="ns-assembly__slot ns-assembly__slot--hero">
              <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>hero.cmp</span>
              <div class="ns-assembly__render">
                <span class="ns-assembly__stack">
                  <span class="ns-assembly__line ns-assembly__line--wide"></span>
                  <span class="ns-assembly__line ns-assembly__line--mid"></span>
                </span>
              </div>
            </div>

            <div class="ns-assembly__slot ns-assembly__slot--image">
              <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>image.cmp</span>
              <div class="ns-assembly__render">
                <span class="ns-assembly__media"><i class="ph ph-image" aria-hidden="true"></i></span>
              </div>
            </div>

            <div class="ns-assembly__slot ns-assembly__slot--button">
              <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>button.cmp</span>
              <div class="ns-assembly__render">
                <span class="ns-assembly__actions">
                  <span class="ns-assembly__chip">Start</span>
                  <span class="ns-assembly__chip ns-assembly__chip--quiet">Browse</span>
                </span>
              </div>
            </div>

            <div class="ns-assembly__slot ns-assembly__slot--card">
              <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>card.cmp</span>
              <div class="ns-assembly__render">
                <span class="ns-assembly__cards">
                  <span class="ns-assembly__mini-card">
                    <span class="ns-assembly__line ns-assembly__line--short"></span>
                    <span class="ns-assembly__line"></span>
                  </span>
                  <span class="ns-assembly__mini-card">
                    <span class="ns-assembly__line ns-assembly__line--short"></span>
                    <span class="ns-assembly__line"></span>
                  </span>
                </span>
              </div>
            </div>

            <div class="ns-assembly__slot ns-assembly__slot--chart">
              <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>chart.cmp</span>
              <div class="ns-assembly__render">
                <span class="ns-assembly__bars"><i style="block-size:40%"></i><i style="block-size:70%"></i><i style="block-size:52%"></i><i style="block-size:90%"></i><i style="block-size:64%"></i></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>
    </div>
  </div>

<div class="wrap">

  <dl class="ns-statband" style="margin-block-start:var(--space-10)">
${stats.map((s) => `    <div class="ns-statband__cell"><dd class="ns-statband__value">${esc(s.value)}</dd><dt class="ns-statband__label">${esc(s.label)}</dt></div>`).join("\n")}
  </dl>

  <h2>Start here</h2>
  <p class="sub">Four ways in. The styleguide's own rail has everything; these are the doors most people want.</p>
  <div class="cards">
    <a class="tile" href="./preview/color.html"><span class="tile__kicker">01 · Foundations</span><h3>Tokens</h3><p>Colour, typography, spacing, geometry, motion and elevation — every value a token, every token exported to CSS, JSON, JS and Tailwind.</p></a>
    <a class="tile" href="./preview/classes.html"><span class="tile__kicker">02 · The layer</span><h3>Components</h3><p>A portable <code>.ns-*</code> class layer: navigation, forms, overlays, the course player, the admin console and the AI surfaces. No framework required.</p></a>
    <a class="tile" href="./preview/homepage.html"><span class="tile__kicker">03 · Composition</span><h3>Page recipes</h3><p>How full pages are assembled from the section vocabulary — the canonical band orders, with the question each band answers.</p></a>
    <a class="tile" href="./preview/chart-intro.html"><span class="tile__kicker">04 · Data</span><h3>Charts</h3><p>A data-visualization layer with a machine-verified palette — the hues are checked against the colourblind simulations on every build.</p></a>
  </div>

  <h2>See it whole</h2>
  <p class="sub">${demos.length} templates rendered full-page, with the real stylesheet and the real scripts. This is the system arguing for itself better than any component page can.</p>
  <div class="cards">
${demos.slice(0, 9).map((d) => `    <a class="tile" href="./preview/${esc(d.file)}"><h3>${esc(d.title)}</h3><p>${esc((d.note || "").replace(/^\w/, (c) => c.toUpperCase()))}</p></a>`).join("\n")}
  </div>

  <h2>Use it</h2>
  <div class="ns-prose">
    <p>The flat bundle is a single stylesheet with no build step: link it and every <code>.ns-*</code> class works, in light and dark, with the fonts and icons self-hosted alongside.</p>
    <pre><code>&lt;link rel="stylesheet" href="dist/namaste-ui.css"&gt;</code></pre>
    <p>Consuming it from a project instead — tokens as JavaScript, the Tailwind v4 theme, or the component CSS on its own — is covered in <a href="${esc(repo)}/blob/main/docs/INTEGRATION.md">the integration guide</a>.</p>
  </div>

  <h2>Full-page templates</h2>
  <p class="sub">${demos.length} complete pages, each rendered from the real <code>templates/*.html</code> file it documents &mdash; open one, then copy the markup. These were reachable only from the Demos menu before, which is not where anybody looks for a template.</p>
  <div class="tpl">
${demos.map((d) => `    <a class="tpl__item" href="./preview/${d.file}">
      <span class="tpl__name">${esc(d.title.replace(/ — .*$/, ""))}</span>
      <span class="tpl__note">${esc((d.note || "").split(/[.—]/)[0].trim())}</span>
    </a>`).join("\n")}
  </div>

  <h2>Every page</h2>
  <p class="sub">${pages.length} generated pages. Each one is built from the artifact it documents, and each is a stable, linkable URL.</p>
  <div>
${indexBlocks}
  </div>

  <footer class="foot">
    <span>NSDS v${esc(pkg.version)} — MIT licensed. Built by <a href="${esc(pkg.author?.url || "#")}">${esc(pkg.author?.name || "")}</a>.</span>
    <span><a href="${esc(repo)}">Source</a> · <a href="./preview/index.html">Styleguide</a> · <a href="./sitemap.xml">Sitemap</a></span>
  </footer>

</div>
</main>

<script>
/* Native <details> menus need exactly two behaviours the platform does not
   give them: close when you click elsewhere, and close on Escape. Nine
   lines, no library, and with the script removed the menus still open and
   close — they just stay open until you click the summary again. */
(function () {
  var menus = [].slice.call(document.querySelectorAll('.menu'));
  document.addEventListener('click', function (e) {
    menus.forEach(function (m) { if (!m.contains(e.target)) m.open = false; });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') menus.forEach(function (m) {
      if (m.open) { m.open = false; m.querySelector('summary').focus(); }
    });
  });
  /* Opening one closes the others — two open panels overlap and neither is
     readable. */
  menus.forEach(function (m) {
    m.addEventListener('toggle', function () {
      if (m.open) menus.forEach(function (o) { if (o !== m) o.open = false; });
    });
  });
  var t = document.querySelector('[data-theme-toggle]');
  if (t) t.addEventListener('click', function () {
    var next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('ns-theme', next); } catch (e) {}
  });
})();
</script>
<script src="./assets/js/search.js" defer></script>
</body>
</html>
`;
}

/* ---- standalone: write the dev-loop homepage at the repo root ------------ */
/* pathToFileURL, not a template literal: this repo lives under a directory
   with a space in its name, and `file://${process.argv[1]}` leaves the space
   raw while import.meta.url percent-encodes it — the comparison silently
   fails and the script does nothing at all. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  for (const rel of ["preview/pages.json", "preview/demos.json"]) {
    if (!existsSync(join(ROOT, rel))) {
      console.error(`missing ${rel} — run \`node scripts/build-preview.mjs\` first (gulp build does both)`);
      process.exit(2);
    }
  }
  const html = renderHome({
    site: (process.env.SITE_URL || "https://nsds.imswarnil.com").replace(/\/+$/, ""),
    pages: JSON.parse(readFileSync(join(ROOT, "preview/pages.json"), "utf8")),
    demos: JSON.parse(readFileSync(join(ROOT, "preview/demos.json"), "utf8")),
    pkg: JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8")),
    themeInit: readFileSync(join(ROOT, "assets/js/theme-init.js"), "utf8").replace(/<\/script/g, "<\\/script"),
  });
  writeFileSync(join(ROOT, "index.html"), html);
  console.log("wrote index.html — the homepage, served at / by scripts/serve.mjs");
}
