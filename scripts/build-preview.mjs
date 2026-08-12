#!/usr/bin/env node
/* Namaste UI — styleguide generator (multi-page).
   =========================================================================
   Generates a static, self-contained styleguide into preview/ — one HTML
   page PER SECTION, not one endless scroll:

     preview/index.html             home: counts + numbered directory
     preview/<section>.html         one page per foundation section
     preview/c-<component>.html     one page per component
     preview/<doc>.html             one page per brand / content-creation doc

   One page per topic, full stop — there is no gallery. Specimen cards are
   embedded on the page they document, so nothing is shown twice. The sidebar
   is the same numbered index on every page, with the current page marked.

   Everything is derived from the real artifacts — token tables from
   tokens/tokens.json, the class index scraped from components/css/*.css,
   specimens are the actual .card.html files — so the styleguide cannot
   drift from the system.

   Run:  gulp build   (or node scripts/build-preview.mjs) */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENTS, FAMILIES } from "./component-docs.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "preview");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- inputs ------------------------------------------------------------ */
const tokens = JSON.parse(readFileSync(join(ROOT, "tokens/tokens.json"), "utf8"));
const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));

const flat = (node, out = []) => {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && "$value" in v) out.push({ name: v.$extensions["ns.cssVar"], value: v.$value });
    else if (v && typeof v === "object") flat(v, out);
  }
  return out;
};
const all = flat(tokens.light);
const darkNames = new Set(flat(tokens.dark).map((t) => t.name));
const pick = (re) => all.filter((t) => re.test(t.name));

const walk = (dir) => {
  let out = [];
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (["node_modules", "dist", "preview", "_site", ".git"].includes(e.name) || e.name.startsWith(".")) continue;
    if (e.isDirectory()) out = out.concat(walk(join(dir, e.name)));
    else if (e.name.endsWith(".card.html")) out.push(join(dir, e.name));
  }
  return out;
};
const cards = walk(".").map((path) => {
  const head = readFileSync(join(ROOT, path), "utf8").split("\n", 1)[0];
  const at = (k) => (head.match(new RegExp(`${k}="([^"]*)"`)) || [, ""])[1];
  const [w, h] = (at("viewport") || "700x400").split("x").map(Number);
  return { path: path.replace(/\\/g, "/"), group: at("group") || "Components", name: at("name") || path, subtitle: at("subtitle"), w: w || 700, h: h || 400 };
}).sort((a, b) => a.group.localeCompare(b.group) || a.name.localeCompare(b.name));

const classIndex = {};
for (const f of readdirSync(join(ROOT, "components/css")).filter((f) => f.endsWith(".css") && f !== "index.css")) {
  const css = readFileSync(join(ROOT, "components/css", f), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const found = new Set();
  for (const m of css.matchAll(/\.(ns-[a-z0-9_-]+)/g)) found.add(m[1]);
  classIndex[f.replace(".css", "")] = [...found].sort();
}

/* ---- shared renderers --------------------------------------------------- */
const swatches = (list) => `<div class="sw-grid">${list.map((t) => `
  <div class="sw">
    <div class="sw__chip" style="background:var(${t.name})"></div>
    <code class="sw__name">${esc(t.name)}</code>
    <span class="sw__val">${esc(t.value)}${darkNames.has(t.name) ? ' <em title="This token changes under dark mode">flips</em>' : ""}</span>
  </div>`).join("")}</div>`;

const rows = (list, render) => `<table class="tbl"><tbody>${list.map(render).join("")}</tbody></table>`;
const spacingRows = (list) => rows(list, (t) => `<tr>
  <td><code>${esc(t.name)}</code></td><td class="num">${esc(t.value)}</td>
  <td class="fill"><span class="bar" style="inline-size:var(${t.name})"></span></td></tr>`);
const plainRows = (list) => rows(list, (t) => `<tr>
  <td><code>${esc(t.name)}</code></td><td class="num">${esc(t.value)}</td>
  <td class="fill">${darkNames.has(t.name) ? '<span class="flips">flips in dark</span>' : ""}</td></tr>`);
const typeRows = (list) => rows(list, (t) => `<tr>
  <td><code>${esc(t.name)}</code></td><td class="num">${esc(t.value)}</td>
  <td class="fill"><span style="font-size:var(${t.name});line-height:1.2">Namaste Salesforce</span></td></tr>`);

/* There is no gallery. Every specimen card is embedded ON the doc page it
   belongs to, by path — so a topic has exactly one page. */
const cardBy = (p) => cards.find((c) => c.path === p) || null;
const spec = (paths) => paths.map(cardBy).filter(Boolean).map((c) => `
  <article class="spec">
    <header class="spec__head">
      <div>
        <h2>${esc(c.name)}</h2>
        ${c.subtitle ? `<p>${esc(c.subtitle)}</p>` : ""}
      </div>
      <a class="spec__src" href="../${c.path}" target="_blank" rel="noopener">open&nbsp;↗</a>
    </header>
    <div class="spec__frame" style="block-size:${c.h + 2}px">
      <iframe src="../${c.path}" title="${esc(c.name)}" loading="lazy" data-theme-frame style="inline-size:${c.w}px"></iframe>
    </div>
  </article>`).join("");

/* Light + dark value per token, for the Colors page's dual chips. A chip half
   stamped data-theme="dark" re-resolves the token inside it, because the dark
   override selector matches any element carrying the attribute. */
const darkVals = new Map(flat(tokens.dark).map((t) => [t.name, t.value]));
const dualSwatches = (list) => `<div class="sw-grid">${list.map((t) => `
  <div class="sw">
    <div class="sw__chip sw__chip--dual">
      <span style="background:var(${t.name})" title="light"></span>
      <span data-theme="dark" style="background:var(${t.name})" title="dark"></span>
    </div>
    <code class="sw__name">${esc(t.name)}</code>
    <span class="sw__val">${esc(t.value)}${darkVals.has(t.name) ? ` <em title="dark value">⇄ ${esc(darkVals.get(t.name))}</em>` : ""}</span>
  </div>`).join("")}</div>`;

/* ---- the page inventory -------------------------------------------------
   Foundation sections first, then specimen groups, one running mono index
   across both — the numbering IS the navigation model. */
const SECTIONS = [
  { id: "intro", title: "Introduction", lede: "Why this design system exists, and the five rules every component obeys.", body: () => `
    <p class="sub">Why</p>
    <p style="max-inline-size:46rem;margin-block-end:var(--space-4)">One brand, two codebases: the Ghost theme (Handlebars + Tailwind) and the Next.js LMS (React). Without a shared system they drift apart within weeks — two blues, two card radii, two ideas of &ldquo;small text.&rdquo; This system is the single source both render: one set of tokens, one portable <code>.ns-*</code> class layer, checked in CI so drift is a build failure, not a design review finding.</p>
    <p style="max-inline-size:46rem;margin-block-end:var(--space-4)">The identity is a developer console, not a marketing site — Apex is Salesforce's own language, and the whole visual voice (mono indices, code-comment kickers, hairline borders, terminal-row lists) is built to feel like a precise tool. Calm, flat, reading-first.</p>
    <p class="sub">The five principles</p>
    <div class="use-grid"><div><ul>
      <li><strong>The hairline is the structure, not the shadow.</strong> Cards, inputs and tags are built from a single 1px border; elevation is a border brightening to brand blue, never a floating lift.</li>
      <li><strong>Monospace is a structural material.</strong> JetBrains Mono renders every index, duration, timestamp, status and kicker — that split is what makes a list read as data and a paragraph read as writing.</li>
      <li><strong>One signal color.</strong> Brand blue is the only hue that means &ldquo;interactive&rdquo; — so a screen with one solid blue button has exactly one obvious next action.</li>
      <li><strong>Sharp, specific geometry.</strong> 6px cards, 4px buttons, pills only for true pills. Nothing is rounded because rounding is the default.</li>
      <li><strong>Motion is instant, not springy.</strong> 120–180ms plain ease-out; no bounce, no scale-pop, no hover-lift.</li>
    </ul></div></div>
    ${spec(["guidelines/principles.card.html"])}` },
  { id: "color", title: "Colors", lede: "The complete palette, end to end: primary blue and its ten shades, the secondary navy, the neutral reading layer, status, and how every role flips in dark mode. Each dual chip shows light on the left, dark on the right.", body: () => `
    <p class="sub">Primary — brand blue, ten shades</p>
    <p class="variant-note">The one signal color. 500 is the working blue for fills and active states; 600 is interactive text on light; 300 is interactive text on dark; 50–100 are wash-free — they exist for charts and rare tint borders, never for status washes.</p>
    ${swatches(pick(/^--color-brand-/))}
    <p class="sub">Secondary — the navy console</p>
    <p class="variant-note">The dark end of the same scale is the brand's second color: hero bands, the admin rail, dark mode's canvas. It is a surface family, not a second signal — nothing navy is clickable by virtue of being navy.</p>
    ${swatches(pick(/^--color-brand-(700|800|900)$/))}${swatches(pick(/^--color-on-(brand|dark)$/))}
    <p class="sub">Neutrals — the reading layer, light ⇄ dark</p>
    <p class="variant-note">Product code reaches for these roles, never raw hex: surfaces, hairline, ink for prose, muted for secondary text, label for mono labels. Every one re-resolves under <code>[data-theme="dark"]</code> to the navy scale — dark mode is this brand's console, not a gray reskin.</p>
    ${dualSwatches(pick(/^--color-(surface|surface-raised|surface-sunken|border|ink|muted|label|grid|scrim)$/))}
    <p class="sub">Status — raw hues, for dots, borders and icons only</p>
    ${swatches(all.filter((t) => ["--color-success", "--color-warning", "--color-error"].includes(t.name)))}
    <p class="sub">Status ink — the only tokens allowed under status text, light ⇄ dark</p>
    ${dualSwatches(pick(/^--color-(success|warning|error|info)-ink$/))}
    <p class="sub">Everything else</p>
    <p class="variant-note">Chart colors live in the <a href="./chart-intro.html">Charts section</a> — seven categorical slots plus sequential and diverging ramps, CI-checked for colorblind separation and contrast in both modes. <code>--color-accent-*</code> is a deprecated alias of brand blue; new code never references it.</p>
    ${spec(["guidelines/colors-brand.card.html", "guidelines/colors-semantic.card.html", "guidelines/colors-status.card.html", "guidelines/colors-dark-mode.card.html"])}` },
  { id: "surfaces", title: "Status & surfaces", lede: 'Semantic roles flip under <code>[data-theme="dark"]</code>. These are what product code should reach for — never a raw brand step for a surface.', body: () => `
    ${swatches(pick(/^--color-(surface|surface-raised|surface-sunken|border|ink|muted|label|grid|scrim|on-brand|on-dark)$/))}
    <p class="sub">Live</p>
    <div class="row">
      <span class="ns-status ns-status--idle">Not started</span>
      <span class="ns-status ns-status--info">In progress</span>
      <span class="ns-status ns-status--success">Complete</span>
      <span class="ns-status ns-status--warning">Expiring</span>
      <span class="ns-status ns-status--error">Failed</span>
    </div>` },
  { id: "spacing", title: "Spacing", lede: "4px base, index-matched to Tailwind so <code>p-4</code> and <code>var(--space-4)</code> are the same 16px in both products.", body: () => `
    ${spacingRows(pick(/^--space-/))}
    <p class="sub">Semantic aliases — reach for these first</p>
    ${spacingRows(pick(/^--(pad|gap|stack)-/))}
    <p class="sub">Applied — the same tokens doing real work</p>
    <div class="demo demo--stack" style="gap:var(--gap-grid)">
      <div style="display:flex;gap:var(--gap-grid)">
        <div style="flex:1;border:1px solid var(--color-border);border-radius:var(--radius-card);padding:var(--pad-card)">
          <span style="font-family:var(--font-mono);font-size:var(--size-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--color-label)">--pad-card</span>
          <p style="margin-block-start:var(--space-2);font-size:var(--size-small);color:var(--color-muted)">Card padding is one token — change it once, every card follows.</p>
        </div>
        <div style="flex:1;border:1px solid var(--color-border);border-radius:var(--radius-card);padding:var(--pad-card)">
          <span style="font-family:var(--font-mono);font-size:var(--size-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--color-label)">--gap-grid</span>
          <p style="margin-block-start:var(--space-2);font-size:var(--size-small);color:var(--color-muted)">The gap between these two cards is the grid gap token.</p>
        </div>
      </div>
      <div style="display:flex;flex-direction:column;gap:var(--stack-lg)">
        <span style="font-size:var(--size-small);color:var(--color-muted)">Stacked blocks separated by <code>--stack-lg</code> —</span>
        <span style="font-size:var(--size-small);color:var(--color-muted)">— the rhythm between sections, not a hand-picked margin.</span>
      </div>
    </div>
    ${spec(["guidelines/spacing-layout.card.html"])}` },
  { id: "layout", title: "Layout & elevation", lede: "Containers, breakpoints, fixed chrome, and the six-layer elevation order.", body: () => `
    <p class="sub">Containers &amp; breakpoints</p>
    ${plainRows(pick(/^--(container|breakpoint|gutter|navbar|sidebar|toc|player|target)/))}
    <p class="sub">Elevation order — six layers, no more</p>
    ${plainRows(pick(/^--z-/))}` },
  { id: "type", title: "Type", lede: "Three faces, three volumes: <strong>Space Grotesk</strong> for headings, <strong>Inter</strong> for prose, <strong>JetBrains Mono</strong> for every index, label, timestamp and status. Grotesk's squared terminals echo the mono's, so display type and data read as one voice — Inter stays neutral in between for long reading.", body: () => `
    <p class="sub">The pairing</p>
    <div class="demo demo--stack" style="gap:var(--space-2)">
      <span style="font-family:var(--font-mono);font-size:var(--size-label);font-weight:var(--weight-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--color-label)">// Space Grotesk · heading</span>
      <span style="font-family:var(--font-heading);font-size:var(--size-h1);font-weight:var(--weight-semibold);letter-spacing:var(--tracking-display);line-height:var(--leading-tight)">Build on the platform, not around it</span>
      <span style="font-family:var(--font-sans);font-size:var(--size-body);color:var(--color-muted);max-inline-size:42rem">Inter carries the reading layer — lesson copy, descriptions, and every sentence longer than a label. Neutral on purpose: the heading and the data do the talking.</span>
      <span style="font-family:var(--font-mono);font-size:var(--size-mono)">01 · APEX BASICS · 12:40 · <span style="color:var(--color-success-ink)">COMPLETE</span></span>
    </div>
    ${typeRows(pick(/^--size-/))}
    <p class="sub">Weight, leading, tracking</p>
    ${plainRows(pick(/^--(weight|leading|tracking)-/))}
    ${spec(["guidelines/type-headings.card.html", "guidelines/type-body.card.html", "guidelines/type-kicker.card.html", "guidelines/type-mono-code.card.html"])}` },
  { id: "geometry", title: "Geometry & motion", lede: "Four radii exist and no more — Tailwind's <code>rounded-lg</code>/<code>-xl</code> are deliberately left undefined so reaching for one is a build error. One easing curve, no springs.", body: () => `
    ${plainRows(pick(/^--(radius|shadow|duration|ease)-/))}
    <p class="sub">Interaction — focus ring, press/disabled/loading dim, hairline</p>
    ${plainRows(pick(/^--(focus-ring|opacity)-|^--border-hairline/))}
    ${spec(["guidelines/radii-shadows.card.html", "guidelines/motion.card.html", "guidelines/states.card.html"])}` },
  { id: "icons", title: "Icons", lede: "Two sets, one optical weight. <strong>Phosphor</strong> (subsetted icon font) covers the generic vocabulary; the <strong>bespoke sprite</strong> covers the LMS-specific glyphs Phosphor has no word for — drawn on the same 24px grid at the same stroke weight, so the sets mix in one row. Every Phosphor glyph also ships a filled variant (<code>ph-fill</code>). Grouped by what the glyph is for; the search filters every group at once. Click a name to copy it.", body: () => {
    const svg = readFileSync(join(ROOT, "icons/namaste-icons.svg"), "utf8");
    const spriteIds = [...svg.matchAll(/<symbol id="ns-i-([a-z0-9-]+)"/g)].map((m) => m[1]).sort();
    const phCss = readFileSync(join(ROOT, "icons/phosphor.css"), "utf8");
    const phNames = [...new Set([...phCss.matchAll(/\.ph\.ph-([a-z0-9-]+):before/g)].map((m) => m[1]))].sort();
    /* First matching rule wins; anything unmatched lands in the last group. */
    const CATEGORIES = [
      ["Arrows & navigation", /^(arrow|caret)|^(compass|map-pin|map-trifold|crosshair|target|sidebar|list$|list-checks|rows|squares-four|funnel|steps|flow-arrow)$/],
      ["Learning & achievement", /^(book|exam|graduation|article|newspaper|note$|presentation|projector|medal|seal-check|star|crown|flag|barbell|flask|lightbulb|strategy|sparkle|infinity)$|^books$/],
      ["Media & broadcast", /^(play|video|film|image|microphone|megaphone|headset|rss)/],
      ["Charts & data", /^(chart|gauge|database|stack$|cube)/],
      ["Code & tools", /^(code$|brackets|terminal|git-|robot|plugs|wrench|toolbox|gear|cloud|globe)/],
      ["Communication", /^(chat|envelope|paper-plane|phone|share|question|quotes|hash|link-simple|bell)/],
      ["People & places", /^(user|users|handshake|heart|buildings|briefcase|house|coffee)/],
      ["Status & security", /^(check-circle|circle|info$|warning|x$|x-circle|shield|lock|eye|magnifying-glass|lightning|fire)/],
      ["Time", /^(clock|calendar|timer|arrows-clockwise)/],
      ["Commerce", /^(credit-card|currency|gift|tag$)/],
      ["Social logos", /-logo$/],
      ["Objects & misc", /./],
    ];
    const grouped = new Map(CATEGORIES.map(([g]) => [g, []]));
    for (const n of phNames) grouped.get(CATEGORIES.find(([, re]) => re.test(n))[0]).push(n);
    const cell = (name, glyph) => `
      <div class="sw icon-cell" data-icon="${name}" style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3)">
        ${glyph}<code class="sw__name" style="padding:0">${name}</code>
      </div>`;
    const spriteCells = spriteIds.map((id) => cell(`ns-i-${id}`,
      `<svg class="ns-icon ns-icon--lg" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-${id}"/></svg>`)).join("");
    const phGroups = [...grouped].filter(([, list]) => list.length).map(([g, list]) => `
    <p class="sub icon-group-head">${esc(g)} · ${list.length}</p>
    <div class="sw-grid icon-group">${list.map((n) => cell(`ph-${n}`, `<i class="ph ph-${n}" aria-hidden="true" style="font-size:var(--size-h3)"></i>`)).join("")}</div>`).join("");
    return `
    <div class="row" style="margin-block-start:var(--space-4)">
      <input class="ns-input" type="search" id="icon-q" placeholder="Search ${spriteIds.length + phNames.length} icons…" aria-label="Search icons" style="max-inline-size:20rem">
      <button type="button" class="ns-btn ns-btn--outline ns-btn--sm" id="icon-fill" aria-pressed="false">Fill style</button>
      <span id="icon-count" style="font-family:var(--font-mono);font-size:var(--size-label);color:var(--color-muted)"></span>
    </div>
    <p class="sub icon-group-head">Bespoke sprite — LMS vocabulary · ${spriteIds.length} · icons/namaste-icons.svg</p>
    <div class="sw-grid icon-group">${spriteCells}</div>
    ${phGroups}
    <p class="sub">Mixing the sets — same row, same color rules</p>
    <div class="row">
      <button class="ns-btn ns-btn--primary"><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-publish"/></svg> Publish</button>
      <button class="ns-btn ns-btn--outline"><i class="ph ph-play" aria-hidden="true"></i> Resume lesson</button>
      <span class="ns-status ns-status--success">Complete</span>
      <svg class="ns-icon ns-icon--lg" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-roadmap"/></svg>
      <svg class="ns-icon ns-icon--lg" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-apex"/></svg>
      <i class="ph ph-gear-six" aria-hidden="true" style="font-size:var(--size-h3)"></i>
    </div>
    <script>
    (function () {
      var q = document.getElementById('icon-q');
      var fill = document.getElementById('icon-fill');
      var count = document.getElementById('icon-count');
      var cells = [].slice.call(document.querySelectorAll('.icon-cell'));
      var total = cells.length;
      function apply() {
        var t = q.value.trim().toLowerCase();
        var shown = 0;
        cells.forEach(function (c) {
          var hit = !t || c.getAttribute('data-icon').indexOf(t) !== -1;
          c.style.display = hit ? '' : 'none';
          if (hit) shown++;
        });
        document.querySelectorAll('.icon-group').forEach(function (g) {
          var any = [].some.call(g.querySelectorAll('.icon-cell'), function (c) { return c.style.display !== 'none'; });
          g.style.display = any ? '' : 'none';
          if (g.previousElementSibling && g.previousElementSibling.classList.contains('icon-group-head'))
            g.previousElementSibling.style.display = any ? '' : 'none';
        });
        count.textContent = t ? shown + ' / ' + total : total + ' icons';
      }
      q.addEventListener('input', apply);
      apply();
      fill.addEventListener('click', function () {
        var on = fill.getAttribute('aria-pressed') !== 'true';
        fill.setAttribute('aria-pressed', String(on));
        document.querySelectorAll('.icon-cell i.ph, .icon-cell i.ph-fill').forEach(function (i) {
          i.className = i.className.replace(on ? /\\bph\\b/ : /\\bph-fill\\b/, on ? 'ph-fill' : 'ph');
        });
      });
    })();
    </script>` } },
  { id: "patterns", title: "Patterns", lede: "Nine abstract, hairline-only background canvases — pure CSS gradients from <code>patterns/patterns.css</code>, for hero bands and collection thumbnails. Put <code>ns-pattern ns-pattern--&lt;name&gt;</code> on a container; add <code>ns-pattern--on-light</code> on light surfaces. Click a name to copy it.", body: () => {
    const names = ["grid", "dots", "diagonal", "hex", "concentric", "chevron-grid", "blueprint", "topographic", "dashed-path"];
    const tile = (n, i, light) => `
      <div class="sw">
        <div class="ns-pattern ns-pattern--${n}${light ? " ns-pattern--on-light" : ""}" style="aspect-ratio:16/10;background:${light ? "#fff" : "var(--color-brand-900)"}"></div>
        <code class="sw__name">ns-pattern--${n}</code>
        <span class="sw__val">${String(i + 1).padStart(2, "0")}${light ? " · + ns-pattern--on-light" : ""}</span>
      </div>`;
    return `
    <p class="sub">On dark bands — the default ink</p>
    <div class="sw-grid">${names.map((n, i) => tile(n, i, false)).join("")}</div>
    <p class="sub">On light surfaces</p>
    <div class="sw-grid">${names.map((n, i) => tile(n, i, true)).join("")}</div>`;
  } },
  { id: "accessibility", title: "Accessibility", lede: "The contract every component ships with: focus is always visible, motion collapses under reduced-motion, status never relies on color alone, and every icon-only control has a name.", body: () => spec(["guidelines/accessibility.card.html"]) },
  { id: "content-design", title: "Content design", lede: "How the product speaks: plain-English, encouraging, practical. Sentence case everywhere except mono kickers; no emoji in UI; numbers only when concrete.", body: () => spec(["guidelines/content-design.card.html"]) },
  { id: "classes", title: "Class index", lede: "Scraped from <code>components/css/</code>. These are the class names the Ghost theme and the Next.js app both render — the actual shared surface between the two products.", body: () => Object.entries(classIndex).map(([file, list]) => `
    <p class="sub">${esc(file)}.css — ${list.length}</p>
    <div class="cls">${list.map((c) => `<code>.${esc(c)}</code>`).join("")}</div>`).join("") },
];

/* Foundations in teaching order: what it looks like (color, surfaces),
   what it reads as (type), how it is spaced and laid out, its shape and
   motion, its glyphs, its data — and the class index as the appendix. */
const SECTION_ORDER = ["intro", "color", "surfaces", "type", "spacing", "layout", "geometry", "icons", "patterns", "accessibility", "content-design", "classes"];
SECTIONS.sort((a, b) => SECTION_ORDER.indexOf(a.id) - SECTION_ORDER.indexOf(b.id));

/* ---- Brand & Content creation docs --------------------------------------
   Same model as components: one page per topic, cards embedded where they
   belong. `body` is authored guidance; `cards` are the live specimens. */
const beat = (t, say, show) => `<tr><td><code>${t}</code></td><td style="inline-size:45%">${say}</td><td class="fill">${show}</td></tr>`;
const SCHEDULE_BODY = `
  <p class="sub">The weekly cadence</p>
  <table class="tbl"><tbody>
    <tr><td><code>MON</code></td><td style="inline-size:45%">YouTube lesson (7–12 min) — one concept from the current course</td><td class="fill">course thumbnail style · intro sting · end screen</td></tr>
    <tr><td><code>WED</code></td><td style="inline-size:45%">Short / Reel (under 60s) — the single best moment of Monday's lesson</td><td class="fill">lesson thumbnail · hook caption card</td></tr>
    <tr><td><code>FRI</code></td><td style="inline-side:45%">Instagram carousel or LinkedIn post — the lesson as 5 swipeable steps</td><td class="fill">instagram post styles · social action icons</td></tr>
    <tr><td><code>SUN</code></td><td style="inline-size:45%">Community touch — poll, Q&amp;A, or next-week teaser</td><td class="fill">story style · promo card</td></tr>
  </tbody></table>
  <p class="variant-note" style="margin-block-start:var(--space-3)">One lesson feeds the whole week. Never create Wednesday's short from scratch — cut it from Monday's video. The system's thumbnail styles exist so a series is recognizable in the feed before the title is read.</p>

  <p class="sub">The video template — every video, same skeleton</p>
  <table class="tbl"><tbody>
    ${beat("0–3s", "<strong>Cold hook.</strong> The payoff shown or said first — the finished flow running, the exam passing, the error disappearing. No logo yet, no &ldquo;hey guys.&rdquo;", "raw screen recording, full bleed")}
    ${beat("3–10s", "<strong>The promise.</strong> One sentence: what they will be able to DO by the end — &ldquo;By the end of this you'll deploy your first Apex trigger.&rdquo; Then the sting.", "logo sting (Preloader &middot; flip, ~1.8s) + title lower-third")}
    ${beat("10–40s", "<strong>Context.</strong> Why this matters and where it sits in the roadmap — &ldquo;this is lesson 03 of Apex Basics; last time we built X.&rdquo; Show the roadmap, name the prerequisite.", "roadmap card · mono index 01/02/03 overlay")}
    ${beat("40s–", "<strong>The teaching.</strong> Numbered steps, one concept per step, said then shown then said again. Every step gets its mono index on screen — the numbering IS the structure.", "live screen + step lower-thirds · code panels for snippets")}
    ${beat("last 30s", "<strong>Recap + bridge.</strong> The three things they can now do, then the bridge to the next lesson — &ldquo;next, we turn this data into insight.&rdquo; One CTA only.", "recap card (3 mono-indexed lines) → end screen")}
    ${beat("end 10s", "<strong>End screen.</strong> Next lesson thumbnail + subscribe. Silence is fine; no outro music ramp.", "youtube end screen template")}
  </tbody></table>

  <p class="sub">Hook line formulas — write three, keep the best</p>
  <div class="use-grid"><div><ul>
    <li><strong>Payoff-first:</strong> &ldquo;This is a working approval flow — built in eleven minutes, no code.&rdquo;</li>
    <li><strong>Mistake-first:</strong> &ldquo;Most admins set up validation rules exactly wrong. Here's the tell.&rdquo;</li>
    <li><strong>Stakes-first:</strong> &ldquo;This one topic is 12% of the exam — and it fits in one screen.&rdquo;</li>
  </ul></div><div><ul>
    <li>Say the hook over the result, never over your face or a logo.</li>
    <li>Numbers only when concrete (Principle: never decorative stats).</li>
    <li>If the hook needs two sentences, the video is about two things — cut one.</li>
  </ul></div></div>

  <p class="sub">Ending lines — the bridge, not a beg</p>
  <div class="use-grid"><div><ul>
    <li>&ldquo;You can now ___, ___ and ___. Next, we ___.&rdquo; — the recap IS the CTA.</li>
    <li>One ask per video: next lesson OR subscribe OR the roadmap link. Never all three.</li>
    <li>Last frame is always the end-screen template — muscle memory for the viewer.</li>
  </ul></div></div>`;

const LINKEDIN_BODY = `
  <p class="sub">Post anatomy</p>
  <table class="tbl"><tbody>
    <tr><td><code>LINE 1–2</code></td><td class="fill">The hook — these are all that shows before &ldquo;…see more.&rdquo; Payoff or mistake first, exactly like a video hook. No hashtags here.</td></tr>
    <tr><td><code>BODY</code></td><td class="fill">3–7 short lines, one idea per line, blank line between each. Numbered steps use the mono-index voice: 01, 02, 03.</td></tr>
    <tr><td><code>IMAGE</code></td><td class="fill">One branded visual: a thumbnail-style card (1200&times;627) or a carousel PDF reusing the Instagram post styles at 1080&times;1350.</td></tr>
    <tr><td><code>CLOSE</code></td><td class="fill">One link (lesson or roadmap), then at most 3 hashtags.</td></tr>
  </tbody></table>
  <p class="sub">Rules</p>
  <div class="use-grid"><div><ul>
    <li>Same weekly slot as the Friday carousel — one asset, two crops.</li>
    <li>Sentence case, no emoji walls — one glyph max, and only as a bullet.</li>
    <li>Carousel = the lesson's numbered steps, one step per slide, brand card style.</li>
  </ul></div><div><ul>
    <li>Never post a bare external link with no visual — the branded card is the point.</li>
    <li>Don't restyle per post: the templates on the Thumbnails and Instagram pages are the only looks.</li>
  </ul></div></div>`;

/* ---- Charts docs --------------------------------------------------------
   Live demos built from the .ns-chart layer (components/css/chart.css) and
   the dataviz tokens — the markup under each demo IS the demo, so sample
   and rendering cannot disagree. */
const demoBlock = (name, note, html) => `
  <p class="sub">${esc(name)}</p>
  ${note ? `<p class="variant-note">${note}</p>` : ""}
  <div class="demo demo--stack">
${html}
  </div>
  <details class="code"><summary>markup</summary><pre><code>${esc(html)}</code></pre></details>`;

const chartCols = (data) => data.map(([v, lab, val]) => `    <div class="ns-chart__col" tabindex="0" style="--v:${v}%">
      <span class="ns-chart__tip">${lab} · ${val}</span>
      <div class="ns-chart__bar"></div>
    </div>`).join("\n");
const chartX = (labels) => `  <div class="ns-chart__x">${labels.map((l) => `<span>${l}</span>`).join("")}</div>`;
const WEEKS = ["W1", "W2", "W3", "W4", "W5", "W6"];
const COMPLETIONS = [[38, "W1", "38"], [52, "W2", "52"], [46, "W3", "46"], [64, "W4", "64"], [58, "W5", "58"], [82, "W6", "82"]];

const CHART_ANATOMY = `<figure class="ns-chart">
  <div class="ns-chart__head">
    <span class="ns-chart__title">Course completions</span>
    <span class="ns-chart__sub">weekly · last 6 weeks</span>
  </div>
  <ul class="ns-chart__legend">
    <li class="ns-chart__key" data-c="1"><span class="ns-chart__swatch"></span>Admin track</li>
    <li class="ns-chart__key" data-c="2"><span class="ns-chart__swatch"></span>Developer track</li>
  </ul>
  <div class="ns-chart__frame">
    <div class="ns-chart__y"><span>0</span><span>25</span><span>50</span><span>75</span><span>100</span></div>
    <div class="ns-chart__plot">
${[[38, 24], [52, 30], [46, 41], [64, 38], [58, 52], [82, 61]].map(([a, b], i) => `      <div class="ns-chart__col ns-chart__col--group" tabindex="0">
        <span class="ns-chart__tip" style="--v:${a}%">${WEEKS[i]} · admin ${a} · dev ${b}</span>
        <div class="ns-chart__bar" data-c="1" style="--v:${a}%"></div>
        <div class="ns-chart__bar" data-c="2" style="--v:${b}%"></div>
      </div>`).join("\n")}
    </div>
${chartX(WEEKS)}
  </div>
</figure>`;

const CHART_DOCS = [
  { id: "chart-intro", title: "Introduction", lede: "Data visualization in this system: what earns a chart, the anatomy every chart shares, and the machine-verified palette. One rule above all — the data is the only thing allowed to be loud.", body: `
  <p class="sub">Form first — is it even a chart?</p>
  <div class="use-grid"><div><p class="sub k-do">Chart it when</p><ul>
    <li>Change over time — line or column</li>
    <li>Comparison across entities — bars</li>
    <li>Parts of one whole (≤ 5 parts) — donut or stacked bar</li>
    <li>Magnitude across a scale — sequential fills</li>
  </ul></div><div><p class="sub k-dont">Not a chart</p><ul>
    <li>One headline number — a stat tile (see Stat), not a one-bar chart</li>
    <li>Two values — write them in a sentence</li>
    <li>Eight-plus series — fold into &ldquo;Other&rdquo;, facet, or rethink the question</li>
  </ul></div></div>
  <p class="sub">Anatomy — every chart is these parts</p>
  <p class="variant-note">Frame with title + mono subtitle · legend (always, for two or more series; never for one) · recessive hairline gridlines · mono axis labels · thin marks in slot colors · tooltip on hover/focus. Hover a column below — the whole column is the hit target, not just the bar.</p>
  <div class="demo demo--stack">
${CHART_ANATOMY}
  </div>
  <details class="code"><summary>markup</summary><pre><code>${esc(CHART_ANATOMY)}</code></pre></details>
  <p class="sub">Color has four jobs — and only four</p>
  <p class="variant-note"><strong>Categorical</strong> answers &ldquo;which series is this?&rdquo; — seven fixed slots, assigned 1→7 in order, never cycled or reordered; slot 1 is always brand blue. Filtering a series out never repaints the survivors: color follows the entity.</p>
  ${swatches(pick(/^--chart-cat-/))}
  <p class="variant-note" style="margin-block-start:var(--space-4)"><strong>Sequential</strong> answers &ldquo;how much?&rdquo; — one hue, light→dark, four honest steps.</p>
  ${swatches(pick(/^--chart-seq-/))}
  <p class="variant-note" style="margin-block-start:var(--space-4)"><strong>Diverging</strong> answers &ldquo;which side of the baseline?&rdquo; — cool arm above, warm arm below, a true neutral at the midpoint (never a hue).</p>
  ${swatches(pick(/^--chart-div-/))}
  <p class="variant-note" style="margin-block-start:var(--space-4)"><strong>Status is reserved.</strong> Success/warning/error never paint a series, and a series color never means &ldquo;bad&rdquo;. Conditional formatting happens on TEXT with status ink — a delta beside the value — never by recoloring the mark:</p>
  <div class="demo">
<dl class="ns-statband" style="background:var(--color-surface)">
  <div class="ns-statband__cell"><dd class="ns-statband__value">1,284</dd><dt class="ns-statband__label">Enrollments <span class="ns-chart__delta" data-dir="up">▲ 12%</span></dt></div>
  <div class="ns-statband__cell"><dd class="ns-statband__value">64%</dd><dt class="ns-statband__label">Completion <span class="ns-chart__delta" data-dir="down">▼ 3%</span></dt></div>
</dl>
  </div>
  <p class="sub">The six rules, verified in CI</p>
  <div class="use-grid"><div><ul>
    <li>Slots 1→7 in fixed order — never cycled, never generated</li>
    <li>No 8th hue — fold into &ldquo;Other&rdquo; or facet</li>
    <li>Status colors never paint a series</li>
  </ul></div><div><ul>
    <li>Text wears ink tokens, never the series color</li>
    <li>Sequential = one hue; diverging = neutral midpoint</li>
    <li>Dark mode is re-picked steps, not a mechanical flip — <code>npm run check:palette</code> proves all of it</li>
  </ul></div></div>
  ${spec(["guidelines/data-visualization.card.html"])}` },

  { id: "chart-bar", title: "Bar charts", lede: "The workhorse: comparison and time. Bars are ≤24px thick with a rounded data-end and a square baseline, grow from zero on load, and the whole column is the tooltip's hit target.", body: `
${demoBlock("Column — single series", "One series needs no legend: the title names it. Hover for the tooltip; bars animate up on load (and hold still under reduced motion).", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Course completions</span><span class="ns-chart__sub">weekly</span></div>
  <div class="ns-chart__plot">
${chartCols(COMPLETIONS)}
  </div>
${chartX(WEEKS)}
</figure>`)}
${demoBlock("Sizes", "Three plot heights: sm for cards and rails, md default, lg for a dashboard's lead chart.", `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(min(14rem,100%),1fr));gap:var(--gap-grid);inline-size:100%">
  <figure class="ns-chart ns-chart--sm">
    <div class="ns-chart__head"><span class="ns-chart__title">Small</span><span class="ns-chart__sub">6rem</span></div>
    <div class="ns-chart__plot">
${chartCols(COMPLETIONS.slice(0, 4))}
    </div>
  </figure>
  <figure class="ns-chart">
    <div class="ns-chart__head"><span class="ns-chart__title">Medium</span><span class="ns-chart__sub">10rem · default</span></div>
    <div class="ns-chart__plot">
${chartCols(COMPLETIONS.slice(0, 4))}
    </div>
  </figure>
  <figure class="ns-chart ns-chart--lg">
    <div class="ns-chart__head"><span class="ns-chart__title">Large</span><span class="ns-chart__sub">15rem</span></div>
    <div class="ns-chart__plot">
${chartCols(COMPLETIONS.slice(0, 4))}
    </div>
  </figure>
</div>`)}
${demoBlock("Grouped", "Two series per band, separated by the 2px surface gap — never a stroke. Legend is mandatory from the second series on.", CHART_ANATOMY)}
${demoBlock("Stacked", "Parts of a whole over time. Segments stack bottom-up in slot order with the surface gap between them; only the top segment gets the rounded end.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Lessons completed by type</span><span class="ns-chart__sub">weekly</span></div>
  <ul class="ns-chart__legend">
    <li class="ns-chart__key" data-c="1"><span class="ns-chart__swatch"></span>Video</li>
    <li class="ns-chart__key" data-c="2"><span class="ns-chart__swatch"></span>Reading</li>
    <li class="ns-chart__key" data-c="3"><span class="ns-chart__swatch"></span>Lab</li>
  </ul>
  <div class="ns-chart__plot">
${[[30, 18, 12], [36, 22, 10], [28, 16, 18], [44, 20, 14]].map(([a, b, c], i) => `    <div class="ns-chart__col" tabindex="0">
      <span class="ns-chart__tip" style="--v:${a + b + c}%">W${i + 1} · ${a + b + c} total</span>
      <div class="ns-chart__stack">
        <div class="ns-chart__seg" data-c="1" style="--v:${a}%"></div>
        <div class="ns-chart__seg" data-c="2" style="--v:${b}%"></div>
        <div class="ns-chart__seg" data-c="3" style="--v:${c}%"></div>
      </div>
    </div>`).join("\n")}
  </div>
${chartX(["W1", "W2", "W3", "W4"])}
</figure>`)}
${demoBlock("Horizontal", "For ranked entities with real names — the label column keeps them readable. Bars slide in from the left; hover a row for its tooltip.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Enrollments by course</span><span class="ns-chart__sub">this quarter</span></div>
  <div class="ns-chart__rows">
${[[92, "Apex basics", "460"], [74, "Admin cert", "371"], [58, "Flows", "290"], [41, "LWC", "205"], [26, "SOQL", "131"]].map(([v, lab, val]) => `    <div class="ns-chart__row" tabindex="0">
      <span class="ns-chart__tip" style="--v:${v}%">${lab} · ${val}</span>
      <span class="ns-chart__row-label">${lab}</span>
      <div><div class="ns-chart__hbar" data-c="1" style="--v:${v}%"></div></div>
      <span class="ns-chart__row-value">${val}</span>
    </div>`).join("\n")}
  </div>
</figure>`)}
${demoBlock("Diverging", "Above/below a baseline — cool arm up, warm arm down, from the diverging ramp. Never status red/green: polarity is not health.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Enrollment change vs last month</span><span class="ns-chart__sub">by course</span></div>
  <div class="ns-chart__rows">
${[[64, "up", "Apex basics", "+32%"], [38, "up", "Flows", "+19%"], [22, "down", "Admin cert", "−11%"], [46, "down", "SOQL", "−23%"]].map(([v, pole, lab, val]) => `    <div class="ns-chart__row" tabindex="0">
      <span class="ns-chart__tip" style="--v:${v}%">${lab} · ${val}</span>
      <span class="ns-chart__row-label">${lab}</span>
      <div><div class="ns-chart__hbar" data-pole="${pole}" style="--v:${v}%"></div></div>
      <span class="ns-chart__row-value">${val}</span>
    </div>`).join("\n")}
  </div>
</figure>`)}
${demoBlock("With trend line", "A 2px line over the columns carries the trend; vector-effect keeps it 2px at any width. The line draws itself on load.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Completions + 3-week trend</span><span class="ns-chart__sub">weekly</span></div>
  <ul class="ns-chart__legend">
    <li class="ns-chart__key" data-c="1"><span class="ns-chart__swatch"></span>Completions</li>
    <li class="ns-chart__key" data-c="2"><span class="ns-chart__swatch ns-chart__swatch--line"></span>Trend</li>
  </ul>
  <div class="ns-chart__plot">
${chartCols(COMPLETIONS)}
    <svg class="ns-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="position:absolute;inset:0;block-size:100%">
      <polyline class="ns-chart__line ns-chart__line--draw" data-c="2" vector-effect="non-scaling-stroke" pathLength="1" points="8,60 25,50 41,53 58,40 75,44 92,22"/>
    </svg>
  </div>
${chartX(WEEKS)}
</figure>`)}` },

  { id: "chart-line", title: "Line & area", lede: "Change over time. Lines are 2px with round joins, markers are ≥8px dots ringed in surface color, and the area fill is the hue at 10% — a wash, never a block.", body: `
${demoBlock("Line — single series", "End-dot + end-label carry the latest value; the y-axis carries the rest. The line draws itself on load.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Active learners</span><span class="ns-chart__sub">last 8 weeks</span></div>
  <svg class="ns-chart__svg" viewBox="0 0 320 120" role="img" aria-label="Active learners, rising from 40 to 96 over 8 weeks">
    <line class="ns-chart__gridline" x1="0" y1="10" x2="320" y2="10"/>
    <line class="ns-chart__gridline" x1="0" y1="55" x2="320" y2="55"/>
    <line class="ns-chart__baseline" x1="0" y1="100" x2="320" y2="100"/>
    <polyline class="ns-chart__line ns-chart__line--draw" data-c="1" pathLength="1" points="10,80 52,70 94,74 136,58 178,62 220,44 262,38 300,22"/>
    <circle class="ns-chart__dot" data-c="1" cx="300" cy="22" r="4"><title>W8 · 96</title></circle>
    <text class="ns-chart__ref-label" x="308" y="25">96</text>
  </svg>
${chartX(["W1", "W2", "W3", "W4", "W5", "W6", "W7", "W8"])}
</figure>`)}
${demoBlock("Multi-series", "Slots 1 and 2, legend mandatory. Dots mark real data points; the surface ring keeps them legible where lines cross.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Track progress</span><span class="ns-chart__sub">avg % complete</span></div>
  <ul class="ns-chart__legend">
    <li class="ns-chart__key" data-c="1"><span class="ns-chart__swatch ns-chart__swatch--line"></span>Admin</li>
    <li class="ns-chart__key" data-c="2"><span class="ns-chart__swatch ns-chart__swatch--line"></span>Developer</li>
  </ul>
  <svg class="ns-chart__svg" viewBox="0 0 320 120" role="img" aria-label="Admin track ahead of developer track for most of the period">
    <line class="ns-chart__gridline" x1="0" y1="10" x2="320" y2="10"/>
    <line class="ns-chart__gridline" x1="0" y1="55" x2="320" y2="55"/>
    <line class="ns-chart__baseline" x1="0" y1="100" x2="320" y2="100"/>
    <polyline class="ns-chart__line" data-c="1" points="10,90 70,72 130,60 190,42 250,38 300,26"/>
    <polyline class="ns-chart__line" data-c="2" points="10,95 70,88 130,70 190,64 250,48 300,44"/>
    <circle class="ns-chart__dot" data-c="1" cx="300" cy="26" r="4"><title>Admin · 78%</title></circle>
    <circle class="ns-chart__dot" data-c="2" cx="300" cy="44" r="4"><title>Developer · 62%</title></circle>
  </svg>
${chartX(["Jan", "Feb", "Mar", "Apr", "May", "Jun"])}
</figure>`)}
${demoBlock("Area", "The fill is the series hue at 10% opacity — enough to read \\u201cvolume\\u201d, never enough to shout.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Watch time</span><span class="ns-chart__sub">hours / week</span></div>
  <svg class="ns-chart__svg" viewBox="0 0 320 120" role="img" aria-label="Watch time rising over the period">
    <line class="ns-chart__gridline" x1="0" y1="10" x2="320" y2="10"/>
    <line class="ns-chart__gridline" x1="0" y1="55" x2="320" y2="55"/>
    <polygon class="ns-chart__area" data-c="1" points="10,84 70,72 130,78 190,50 250,46 300,24 300,100 10,100"/>
    <polyline class="ns-chart__line" data-c="1" points="10,84 70,72 130,78 190,50 250,46 300,24"/>
    <line class="ns-chart__baseline" x1="0" y1="100" x2="320" y2="100"/>
  </svg>
${chartX(WEEKS)}
</figure>`)}
${demoBlock("Target line", "A dashed reference in muted ink — the one legal dashed line. The mark colors never change because of the target; distance from the line IS the story.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Weekly completions vs target</span><span class="ns-chart__sub">target 60</span></div>
  <svg class="ns-chart__svg" viewBox="0 0 320 120" role="img" aria-label="Completions crossing the target of 60 in week 5">
    <line class="ns-chart__baseline" x1="0" y1="100" x2="320" y2="100"/>
    <line class="ns-chart__ref" x1="0" y1="46" x2="320" y2="46"/>
    <text class="ns-chart__ref-label" x="2" y="41">target 60</text>
    <polyline class="ns-chart__line ns-chart__line--draw" data-c="1" pathLength="1" points="10,88 68,76 126,80 184,58 242,40 300,28"/>
    <circle class="ns-chart__dot" data-c="1" cx="300" cy="28" r="4"><title>W6 · 82</title></circle>
  </svg>
${chartX(WEEKS)}
</figure>`)}` },

  { id: "chart-donut", title: "Donut & rings", lede: "Parts of one whole — five parts at most, assembled from pathLength-100 arcs with a surface gap between segments. The center is the one place a chart carries its own headline number.", body: `
${demoBlock("Donut with center stat", "Segments in slot order from 12 o'clock, legend beside it, the total in the hole. Arcs sweep in on load.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Lessons by type</span><span class="ns-chart__sub">this course</span></div>
  <div class="ns-chart__donut">
    <div class="ns-chart__ring-wrap">
      <svg class="ns-chart__ring ns-chart__svg" viewBox="0 0 36 36" role="img" aria-label="42 lessons: 21 video, 11 reading, 6 lab, 4 quiz">
        <circle class="ns-chart__arc" data-c="1" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:50;--off:0"/>
        <circle class="ns-chart__arc" data-c="2" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:26;--off:50"/>
        <circle class="ns-chart__arc" data-c="3" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:14;--off:76"/>
        <circle class="ns-chart__arc" data-c="4" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:10;--off:90"/>
      </svg>
      <div class="ns-chart__center"><strong>42</strong><span>lessons</span></div>
    </div>
    <ul class="ns-chart__legend" style="flex-direction:column;gap:var(--space-2)">
      <li class="ns-chart__key" data-c="1"><span class="ns-chart__swatch"></span>Video · 21</li>
      <li class="ns-chart__key" data-c="2"><span class="ns-chart__swatch"></span>Reading · 11</li>
      <li class="ns-chart__key" data-c="3"><span class="ns-chart__swatch"></span>Lab · 6</li>
      <li class="ns-chart__key" data-c="4"><span class="ns-chart__swatch"></span>Quiz · 4</li>
    </ul>
  </div>
</figure>`)}
${demoBlock("Progress ring", "One value against a track — the track is the grid gray, the fill is slot 1. This is the donut's single-series form, so no legend.", `<figure class="ns-chart ns-chart--sm" style="max-inline-size:14rem">
  <div class="ns-chart__head"><span class="ns-chart__title">Course progress</span></div>
  <div class="ns-chart__ring-wrap" style="inline-size:6rem">
    <svg class="ns-chart__ring ns-chart__svg" viewBox="0 0 36 36" role="img" aria-label="64% complete">
      <circle class="ns-chart__track" cx="18" cy="18" r="15.9"/>
      <circle class="ns-chart__arc" data-c="1" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:65.5;--off:0"/>
    </svg>
    <div class="ns-chart__center"><strong>64%</strong></div>
  </div>
</figure>`)}
${demoBlock("Ring weights", "Thin for inline/compact placements, default, thick where the ring is the hero. Weight is a modifier, never a new component.", `<div style="display:flex;gap:var(--gap-grid);flex-wrap:wrap">
  <div class="ns-chart__ring-wrap ns-chart" style="inline-size:8rem;padding:var(--space-4)">
    <svg class="ns-chart__ring ns-chart__svg" viewBox="0 0 36 36" aria-hidden="true">
      <circle class="ns-chart__track ns-chart__arc--thin" cx="18" cy="18" r="15.9"/>
      <circle class="ns-chart__arc ns-chart__arc--thin" data-c="1" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:73.5;--off:0"/>
    </svg>
    <div class="ns-chart__center"><span>thin · 72%</span></div>
  </div>
  <div class="ns-chart__ring-wrap ns-chart" style="inline-size:8rem;padding:var(--space-4)">
    <svg class="ns-chart__ring ns-chart__svg" viewBox="0 0 36 36" aria-hidden="true">
      <circle class="ns-chart__track" cx="18" cy="18" r="15.9"/>
      <circle class="ns-chart__arc" data-c="1" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:73.5;--off:0"/>
    </svg>
    <div class="ns-chart__center"><span>default</span></div>
  </div>
  <div class="ns-chart__ring-wrap ns-chart" style="inline-size:8rem;padding:var(--space-4)">
    <svg class="ns-chart__ring ns-chart__svg" viewBox="0 0 36 36" aria-hidden="true">
      <circle class="ns-chart__track ns-chart__arc--thick" cx="18" cy="18" r="15.9"/>
      <circle class="ns-chart__arc ns-chart__arc--thick" data-c="1" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:73.5;--off:0"/>
    </svg>
    <div class="ns-chart__center"><span>thick</span></div>
  </div>
</div>`)}
${demoBlock("Gauge (semi-donut)", "Half a donut for a score against a scale. The unfilled half of the scale stays visible — a gauge with no track is just an arc.", `<figure class="ns-chart ns-chart--sm" style="max-inline-size:14rem">
  <div class="ns-chart__head"><span class="ns-chart__title">Quiz average</span></div>
  <div class="ns-chart__ring-wrap" style="inline-size:8rem">
    <svg class="ns-chart__ring ns-chart__svg" viewBox="0 0 36 36" role="img" aria-label="Average score 71 out of 100" style="transform:rotate(180deg)">
      <circle class="ns-chart__track" cx="18" cy="18" r="15.9" pathLength="100" stroke-dasharray="50 100"/>
      <circle class="ns-chart__arc" data-c="1" cx="18" cy="18" r="15.9" pathLength="100" style="--seg:37;--off:0"/>
    </svg>
    <div class="ns-chart__center" style="place-content:end center;padding-block-end:var(--space-4)"><strong>71</strong><span>/ 100</span></div>
  </div>
</figure>`)}
  <p class="sub">When NOT a donut</p>
  <div class="use-grid"><div><ul>
    <li>More than five parts — a horizontal bar chart ranks them honestly</li>
    <li>Comparing two wholes side by side — humans cannot compare angles; use stacked bars</li>
    <li>Change over time — donuts have no time axis; use a stacked column</li>
  </ul></div></div>` },
  { id: "chart-lms", title: "LMS charts", lede: "The forms an LMS dashboard actually needs: engagement heatmap, score distribution, the enrollment funnel, and sparkline stat tiles. All from the same layer and the same slots.", body: `
${demoBlock("Engagement heatmap", "Activity by weekday and week — magnitude, so SEQUENTIAL fills, one hue. Empty cells stay grid-gray: zero is data. Hover or tab to a cell for its value.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Learning activity</span><span class="ns-chart__sub">lessons completed · by weekday</span></div>
  <div class="ns-chart__heat" style="--cols:12">
${[["MON", [2, 3, 1, 4, 2, 3, 4, 2, 3, 4, 3, 4]], ["TUE", [1, 2, 3, 2, 4, 2, 3, 4, 2, 3, 4, 3]], ["WED", [3, 4, 2, 3, 1, 4, 2, 3, 4, 2, 3, 4]], ["THU", [2, 1, 4, 2, 3, 2, 4, 1, 2, 4, 2, 3]], ["FRI", [1, 2, 2, 3, 2, 3, 1, 2, 3, 2, 4, 2]], ["SAT", [0, 1, 0, 2, 1, 0, 2, 1, 0, 1, 2, 1]], ["SUN", [0, 0, 1, 0, 1, 2, 0, 0, 1, 0, 1, 2]]].map(([day, vals]) => `    <div class="ns-chart__heat-row" style="--cols:12">
      <span class="ns-chart__heat-label">${day}</span>
${vals.map((v, i) => `      <div class="ns-chart__cell"${v ? ` data-seq="${v}"` : ""} tabindex="0"><span class="ns-chart__tip">${day} W${i + 1} · ${v ? v * 12 : 0} lessons</span></div>`).join("\n")}
    </div>`).join("\n")}
  </div>
</figure>`)}
${demoBlock("Score distribution", "Quiz scores in ten-point bins — a histogram is a column chart whose x-axis is a scale. One series, slot 1, values in tooltips.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Quiz score distribution</span><span class="ns-chart__sub">final assessment · n=412</span></div>
  <div class="ns-chart__plot">
${chartCols([[4, "0–10", "8"], [6, "11–20", "12"], [10, "21–30", "21"], [16, "31–40", "33"], [26, "41–50", "54"], [42, "51–60", "87"], [58, "61–70", "120"], [72, "71–80", "148"], [52, "81–90", "107"], [28, "91–100", "58"]])}
  </div>
${chartX(["0", "", "", "", "", "50", "", "", "", "100"])}
</figure>`)}
${demoBlock("Enrollment funnel", "Enrolled → started → completed → certified. Centered stages, sequential fills, and the drop-off named beside each stage — the loss IS the story.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Course funnel</span><span class="ns-chart__sub">Apex basics · this quarter</span></div>
  <div class="ns-chart__funnel">
${[[100, 1, "Enrolled", "460", ""], [76, 2, "Started", "350", "−24%"], [52, 3, "Completed", "239", "−32%"], [31, 4, "Certified", "143", "−40%"]].map(([v, s, lab, val, drop]) => `    <div class="ns-chart__fstage" tabindex="0">
      <span class="ns-chart__tip">${lab} · ${val}${drop ? ` · ${drop} vs previous` : ""}</span>
      <span class="ns-chart__row-label">${lab}</span>
      <div class="ns-chart__ftrack"><div class="ns-chart__fbar" data-seq="${s}" style="--v:${v}%"></div></div>
      <span class="ns-chart__row-value">${val}</span>
    </div>`).join("\n")}
  </div>
</figure>`)}
${demoBlock("Stat tiles with sparklines", "The dashboard's first row: label, value, delta in status ink, and a 12-point sparkline — no axes, no grid; the tile's job is the number.", `<dl class="ns-statband" style="background:var(--color-surface)">
${[["Active learners", "1,284", "up", "▲ 12%", "0,26 29,22 58,24 87,18 116,20 145,14 174,16 203,10 232,12 261,8 290,9 320,4"], ["Completions / wk", "82", "up", "▲ 9%", "0,22 29,24 58,20 87,22 116,16 145,18 174,14 203,16 232,10 261,14 290,8 320,6"], ["Avg quiz score", "71", "down", "▼ 2%", "0,10 29,12 58,8 87,14 116,12 145,16 174,14 203,18 232,16 261,20 290,18 320,22"]].map(([lab, val, dir, delta, pts]) => `  <div class="ns-statband__cell">
    <dd class="ns-statband__value">${val} <span class="ns-chart__delta" data-dir="${dir}">${delta}</span></dd>
    <dt class="ns-statband__label">${lab}</dt>
    <svg class="ns-chart__spark" viewBox="0 0 320 30" preserveAspectRatio="none" aria-hidden="true">
      <polyline class="ns-chart__line" data-c="1" vector-effect="non-scaling-stroke" points="${pts}"/>
    </svg>
  </div>`).join("\n")}
</dl>`)}` },

  { id: "chart-controls", title: "Filters & controls", lede: "The interactive layer, working end to end: a range toggle re-scaling the data, legend keys that hide a series without repainting the rest, and a crosshair tooltip tracking the pointer. This demo is live — click things.", body: `
  <p class="sub">The working module</p>
  <p class="variant-note">Range segments re-render the columns; the legend keys toggle line series (a hidden series never shifts the survivors' colors — color follows the entity); the line plot carries a crosshair tooltip on hover. In product this wiring is React state; here it is the same markup driven by demo JS.</p>
  <div class="demo demo--stack">
<figure class="ns-chart" id="mod-bars">
  <div class="ns-chart__filters">
    <div class="ns-btn-group" role="group" aria-label="Range">
      <button class="ns-btn ns-btn--outline ns-btn--sm" data-range="7d" aria-pressed="true">7d</button>
      <button class="ns-btn ns-btn--outline ns-btn--sm" data-range="30d" aria-pressed="false">30d</button>
      <button class="ns-btn ns-btn--outline ns-btn--sm" data-range="90d" aria-pressed="false">90d</button>
    </div>
    <span class="ns-chart__sub" data-hook="range-sub">completions · last 7 days</span>
  </div>
  <div class="ns-chart__plot" data-hook="bars"></div>
  <div class="ns-chart__x" data-hook="x"></div>
</figure>
<figure class="ns-chart" id="mod-lines">
  <div class="ns-chart__filters">
    <span class="ns-chart__title">Track progress</span>
    <ul class="ns-chart__legend">
      <li><button type="button" class="ns-chart__key ns-chart__key--toggle" data-c="1" data-toggle="admin" aria-pressed="true"><span class="ns-chart__swatch ns-chart__swatch--line"></span>Admin</button></li>
      <li><button type="button" class="ns-chart__key ns-chart__key--toggle" data-c="2" data-toggle="dev" aria-pressed="true"><span class="ns-chart__swatch ns-chart__swatch--line"></span>Developer</button></li>
    </ul>
  </div>
  <div style="position:relative">
    <svg class="ns-chart__svg" viewBox="0 0 320 120" role="img" aria-label="Track progress, two toggleable series">
      <line class="ns-chart__gridline" x1="0" y1="10" x2="320" y2="10"/>
      <line class="ns-chart__gridline" x1="0" y1="55" x2="320" y2="55"/>
      <line class="ns-chart__baseline" x1="0" y1="100" x2="320" y2="100"/>
      <g data-series="admin">
        <polyline class="ns-chart__line" data-c="1" points="10,90 68,72 126,60 184,42 242,38 300,26"/>
        <circle class="ns-chart__dot" data-c="1" cx="300" cy="26" r="4"></circle>
      </g>
      <g data-series="dev">
        <polyline class="ns-chart__line" data-c="2" points="10,95 68,88 126,70 184,64 242,48 300,44"/>
        <circle class="ns-chart__dot" data-c="2" cx="300" cy="44" r="4"></circle>
      </g>
    </svg>
    <div class="ns-chart__hover" data-hook="hover">
      <div class="ns-chart__xhair" data-hook="xhair"></div>
      <span class="ns-chart__tip" data-hook="linetip"></span>
    </div>
  </div>
  <div class="ns-chart__x"><span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span></div>
</figure>
  </div>
  <script>
  (function () {
    /* Range toggle → re-render columns. */
    var DATA = {
      "7d":  { sub: "completions · last 7 days",  x: ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"], v: [34,52,46,64,58,22,18] },
      "30d": { sub: "completions · weekly",       x: ["W1","W2","W3","W4"],                        v: [48,61,55,72] },
      "90d": { sub: "completions · monthly",      x: ["Apr","May","Jun"],                          v: [62,78,84] }
    };
    var plot = document.querySelector('[data-hook="bars"]');
    var xrow = document.querySelector('[data-hook="x"]');
    var sub = document.querySelector('[data-hook="range-sub"]');
    function render(key) {
      var d = DATA[key], max = Math.max.apply(null, d.v);
      sub.textContent = d.sub;
      plot.innerHTML = d.v.map(function (v, i) {
        var pct = Math.round(v / max * 90);
        return '<div class="ns-chart__col" tabindex="0" style="--v:' + pct + '%">' +
          '<span class="ns-chart__tip">' + d.x[i] + ' · ' + v + '</span>' +
          '<div class="ns-chart__bar" data-c="1"></div></div>';
      }).join('');
      xrow.innerHTML = d.x.map(function (l) { return '<span>' + l + '</span>'; }).join('');
    }
    document.querySelectorAll('[data-range]').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('[data-range]').forEach(function (b) { b.setAttribute('aria-pressed', String(b === btn)); });
        render(btn.getAttribute('data-range'));
      });
    });
    render('7d');

    /* Legend toggles → hide the series, never recolor the rest. */
    document.querySelectorAll('[data-toggle]').forEach(function (key) {
      key.addEventListener('click', function () {
        var on = key.getAttribute('aria-pressed') !== 'true';
        key.setAttribute('aria-pressed', String(on));
        var series = document.querySelector('[data-series="' + key.getAttribute('data-toggle') + '"]');
        if (series) series.toggleAttribute('hidden', !on);
      });
    });

    /* Crosshair tooltip — snap to the nearest data point. */
    var POINTS = { x: [10, 68, 126, 184, 242, 300], labels: ["Jan","Feb","Mar","Apr","May","Jun"], admin: [12, 31, 44, 62, 66, 78], dev: [7, 14, 33, 39, 55, 62] };
    var hover = document.querySelector('[data-hook="hover"]');
    var xhair = document.querySelector('[data-hook="xhair"]');
    var tip = document.querySelector('[data-hook="linetip"]');
    hover.addEventListener('mousemove', function (e) {
      var r = hover.getBoundingClientRect();
      var vx = (e.clientX - r.left) / r.width * 320;
      var best = 0;
      POINTS.x.forEach(function (px, i) { if (Math.abs(px - vx) < Math.abs(POINTS.x[best] - vx)) best = i; });
      var left = POINTS.x[best] / 320 * 100;
      xhair.style.insetInlineStart = left + '%';
      xhair.style.opacity = 1;
      var parts = [];
      if (document.querySelector('[data-toggle="admin"]').getAttribute('aria-pressed') === 'true') parts.push('admin ' + POINTS.admin[best] + '%');
      if (document.querySelector('[data-toggle="dev"]').getAttribute('aria-pressed') === 'true') parts.push('dev ' + POINTS.dev[best] + '%');
      tip.textContent = POINTS.labels[best] + (parts.length ? ' · ' + parts.join(' · ') : '');
      tip.style.insetInlineStart = Math.min(Math.max(left, 12), 88) + '%';
      tip.style.opacity = 1;
    });
    hover.addEventListener('mouseleave', function () { xhair.style.opacity = 0; tip.style.opacity = 0; });
  })();
  </script>
  <p class="sub">The rules the module obeys</p>
  <div class="use-grid"><div><ul>
    <li>Filters sit in ONE row above the chart — never scattered around it</li>
    <li>A range change re-scales the data, not the palette</li>
    <li>A hidden series leaves its slot color unused — survivors never repaint</li>
  </ul></div><div><ul>
    <li>The crosshair snaps to real data points — never interpolates a lie</li>
    <li>Tooltips list only visible series, in slot order</li>
    <li>Keyboard: every control is a real button; columns are tabbable and show their tooltip on focus</li>
  </ul></div></div>` },
];

const CONTENT_DOCS = [
  { id: "cc-approach", title: "Approach", lede: "What content creation is in this system: every public asset — thumbnail, post, video frame — is built from the same tokens and voice as the product, so the feed is recognizably one brand.", cards: ["brand-content-creation/README.card.html", "brand-content-creation/training/training-pair.card.html", "brand-content-creation/course-lesson-pairs/pairs.card.html"] },
  { id: "cc-schedule", title: "Video series & schedule", lede: "The publishing plan: what ships on which day, and the second-by-second template every video follows — hook, promise, sting, teaching, bridge.", body: SCHEDULE_BODY, cards: ["brand-content-creation/video-structure/first-60-seconds.card.html"] },
  { id: "cc-video", title: "Video structure & motion", lede: "Hooks, closures and the motion rules for moving brand assets — how the intro sting and scene transitions behave.", cards: ["brand-content-creation/video-structure/hooks-and-closures.card.html", "brand-content-creation/motion-guidelines.card.html", "brand-content-creation/motion-demo-intro.card.html", "brand-content-creation/motion-demo-transition.card.html"] },
  { id: "cc-thumbnails", title: "Thumbnails", lede: "Every thumbnail surface — course, lesson, blog, YouTube — from one style family, so a row of them reads as a series.", cards: ["brand-content-creation/thumbnails/15-thumbnail-styles.card.html", "brand-content-creation/course-thumbnail.card.html", "brand-content-creation/lesson-thumbnail.card.html", "brand-content-creation/blog/10-blog-thumbnail-styles.card.html", "brand-content-creation/youtube-thumbnail.card.html"] },
  { id: "cc-instagram", title: "Instagram", lede: "Post and story templates. Same tokens, same mono indices — the feed is the product's voice at 1080px.", cards: ["brand-content-creation/instagram-post.card.html", "brand-content-creation/instagram-story.card.html", "brand-content-creation/instagram/instagram-post-styles.card.html"] },
  { id: "cc-linkedin", title: "LinkedIn", lede: "The professional-feed variant: hook-first text posts and carousel PDFs cut from the same weekly asset as the Instagram carousel.", body: LINKEDIN_BODY, cards: [] },
  { id: "cc-promo", title: "Promo & end screens", lede: "Website promo cards, social action icons, and the YouTube end screen every video closes on.", cards: ["brand-content-creation/promo/website-promo-card.card.html", "brand-content-creation/promo/social-action-icons.card.html", "brand-content-creation/promo/youtube-end-screen.card.html"] },
];

const PAGES = [
  { file: "index.html", title: "Overview", kind: "home" },
  ...SECTIONS.map((s) => ({ file: `${s.id}.html`, title: s.title, kind: "section", section: s })),
  ...FAMILIES.flatMap((fam) =>
    COMPONENTS.filter((c) => c.family === fam)
      .map((c) => ({ file: `c-${c.id}.html`, title: c.title, kind: "component", comp: c, family: fam }))),
  ...CHART_DOCS.map((d) => ({ file: `${d.id}.html`, title: d.title, kind: "doc", doc: d, side: "Charts" })),
  ...CONTENT_DOCS.map((d) => ({ file: `${d.id}.html`, title: d.title, kind: "doc", doc: d, side: "Content creation" })),
];
const nn = (i) => String(i).padStart(2, "0");
PAGES.forEach((p, i) => { p.num = nn(i + 1); });

/* ---- shared chrome ------------------------------------------------------ */
const CSS = `
  body { display: flex; min-block-size: 100dvh; }
  .side {
    position: sticky; inset-block-start: 0; align-self: flex-start;
    inline-size: 15rem; flex: none; block-size: 100dvh; overflow-y: auto;
    border-inline-end: 1px solid var(--color-border);
    padding: var(--space-6) var(--space-4);
    background: var(--color-surface);
  }
  .side__brand { display: flex; align-items: center; gap: var(--space-2); margin-block-end: var(--space-1); }
  .side__brand img { inline-size: 1.5rem; block-size: 1.5rem; }
  .side__brand a { color: inherit; text-decoration: none; }
  .side__ver { font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-muted); margin-block-end: var(--space-5); display: block; }
  .side__sep { font-family: var(--font-mono); font-size: var(--size-label); font-weight: var(--weight-label);
               letter-spacing: var(--tracking-label); text-transform: uppercase; color: var(--color-label);
               margin: var(--space-5) 0 var(--space-2); padding-inline-start: var(--space-3); }
  .side nav a { display: block; padding: var(--space-1-5) var(--space-3); font-size: var(--size-small);
            color: var(--color-muted); text-decoration: none;
            border-inline-start: 2px solid var(--color-border);
            transition: color var(--duration-fast) var(--ease-out),
                        border-color var(--duration-fast) var(--ease-out); }
  .side nav a:hover { color: var(--color-ink); border-inline-start-color: var(--color-brand-300); }
  .side nav a[aria-current="page"] { color: var(--color-brand-600); border-inline-start-color: var(--color-brand-500); font-weight: var(--weight-medium); }
  [data-theme="dark"] .side nav a[aria-current="page"] { color: var(--color-brand-300); }
  .side__num { font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-label); margin-inline-end: var(--space-2); }

  main { flex: 1; min-inline-size: 0; padding: var(--space-8) var(--space-10) var(--space-24); max-inline-size: 86rem; }
  .side__search { margin-block-end: var(--space-4); inline-size: 100%; font-size: var(--size-small); }

  /* Two-column body: content + a sticky on-this-page rail. The page header
     and any hero band above .cols stay full width. */
  .cols { display: grid; grid-template-columns: minmax(0, 1fr) 13rem; gap: var(--space-10); align-items: start; }
  .cols--full { grid-template-columns: minmax(0, 1fr); }
  .colmain { min-inline-size: 0; max-inline-size: 68rem; }
  .toc {
    position: sticky; inset-block-start: var(--space-8);
    border: 1px solid var(--color-border); border-radius: var(--radius-card);
    padding: var(--space-5) var(--space-5) var(--space-6); background: var(--color-surface);
    max-block-size: calc(100dvh - var(--space-16)); overflow-y: auto;
    transition: border-color var(--duration-fast) var(--ease-out);
  }
  .toc:hover { border-color: var(--color-brand-300); }
  .toc__title { font-family: var(--font-mono); font-size: var(--size-label); font-weight: var(--weight-label);
                letter-spacing: var(--tracking-label); text-transform: uppercase; color: var(--color-label);
                margin-block-end: var(--space-4); padding-block-end: var(--space-3);
                border-block-end: 1px solid var(--color-border); }
  .toc nav { display: flex; flex-direction: column; gap: var(--space-1); }
  .toc nav a { display: block; padding: var(--space-1-5) 0 var(--space-1-5) var(--space-3);
               font-size: var(--size-small); line-height: var(--leading-snug, 1.4);
               color: var(--color-muted); text-decoration: none;
               border-inline-start: 2px solid var(--color-border);
               overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
               transition: color var(--duration-fast) var(--ease-out),
                           border-color var(--duration-fast) var(--ease-out),
                           padding-inline-start var(--duration-fast) var(--ease-out); }
  .toc nav a:hover { color: var(--color-ink); border-inline-start-color: var(--color-brand-300); padding-inline-start: var(--space-4); }
  .toc nav a[aria-current="true"] { color: var(--color-brand-600); border-inline-start-color: var(--color-brand-500); font-weight: var(--weight-medium); }
  [data-theme="dark"] .toc nav a[aria-current="true"] { color: var(--color-brand-300); }
  /* Anchor targets land clear of the viewport edge. */
  .sub[id] { scroll-margin-block-start: var(--space-8); }
  @media (max-width: 74.999rem) { .cols { grid-template-columns: minmax(0, 1fr); } .toc { display: none; } }
  .top { display: flex; align-items: flex-start; gap: var(--space-4); margin-block-end: var(--space-6); }
  .top h1 { font-size: var(--size-h2); line-height: var(--leading-tight); }
  .top p { color: var(--color-muted); max-inline-size: 46rem; margin-block-start: var(--space-2); font-size: var(--size-small); }
  .top .ns-btn { margin-inline-start: auto; flex: none; }
  .sec__num { font-family: var(--font-mono); font-size: var(--size-mono); font-weight: var(--weight-label);
              letter-spacing: var(--tracking-label); color: var(--color-label);
              margin-inline-end: var(--space-3); vertical-align: 0.2em; }
  .sub { font-family: var(--font-mono); font-size: var(--size-label); font-weight: var(--weight-label);
         letter-spacing: var(--tracking-label); text-transform: uppercase; color: var(--color-label);
         margin: var(--space-6) 0 var(--space-3); }
  .row { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; margin-block-end: var(--space-4); }

  /* Entrance: one quiet fade-up per page block, lightly staggered. The
     bundle's prefers-reduced-motion guard collapses it to nothing. */
  .colmain > *, main > .top, main > .ns-band, main > .ns-statband { animation: fade-up var(--duration-base) var(--ease-out) both; }
  .colmain > *:nth-child(2) { animation-delay: 40ms; }
  .colmain > *:nth-child(3) { animation-delay: 80ms; }
  .colmain > *:nth-child(4) { animation-delay: 120ms; }
  .colmain > *:nth-child(n+5) { animation-delay: 160ms; }

  .home-hero { border-radius: var(--radius-card); overflow: hidden;
               padding-block: var(--space-10); margin-block-end: var(--space-4); }
  .home-hero .ns-band__title { font-size: var(--size-h3); }
  .home-stats { margin-block-end: var(--space-2); background: var(--color-surface); }

  .sw-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(11rem,100%),1fr)); gap: var(--space-3); }
  .sw { border: 1px solid var(--color-border); border-radius: var(--radius-card); overflow: hidden;
        transition: border-color var(--duration-fast) var(--ease-out); }
  .sw:hover { border-color: var(--color-brand-500); }
  /* Any token name is one click from the clipboard. */
  .copyable { cursor: copy; transition: color var(--duration-fast) var(--ease-out); }
  .copyable:hover { color: var(--color-brand-600); }
  [data-theme="dark"] .copyable:hover { color: var(--color-brand-300); }
  .copyable[data-copied] { color: var(--color-success-ink); }
  .sw__chip { block-size: 3rem; border-block-end: 1px solid var(--color-border); }
  .sw__chip--dual { display: flex; }
  .sw__chip--dual > span { flex: 1; }
  .sw__name { display: block; padding: var(--space-2) var(--space-2-5) 0; font-family: var(--font-mono); font-size: 0.7rem; }
  .sw__val { display: block; padding: 0 var(--space-2-5) var(--space-2); font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-muted); }
  .sw__val em { color: var(--color-brand-600); font-style: normal; }

  .tbl { inline-size: 100%; border-collapse: collapse; font-size: var(--size-small); }
  .tbl td { padding: var(--space-2) var(--space-3); border-block-end: 1px solid var(--color-border); vertical-align: middle; }
  .tbl code { font-family: var(--font-mono); font-size: 0.72rem; }
  .tbl .num { font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-muted); white-space: nowrap; }
  .tbl .fill { inline-size: 55%; }
  .bar { display: block; block-size: 0.6rem; background: var(--color-brand-500); border-radius: 2px; }
  .flips { font-family: var(--font-mono); font-size: 0.65rem; color: var(--color-brand-600); }

  .spec { border: 1px solid var(--color-border); border-radius: var(--radius-card); margin-block-end: var(--space-5); overflow: hidden;
          transition: border-color var(--duration-fast) var(--ease-out); }
  .spec:hover { border-color: var(--color-brand-300); }
  .spec__head { display: flex; align-items: flex-start; gap: var(--space-4); padding: var(--space-3) var(--space-4);
                border-block-end: 1px solid var(--color-border); background: var(--color-surface-sunken); }
  .spec__head h2 { font-size: var(--size-body); }
  .spec__head p { font-size: var(--size-small); color: var(--color-muted); margin-block-start: 2px; }
  .spec__src { margin-inline-start: auto; flex: none; font-family: var(--font-mono); font-size: var(--size-label);
               letter-spacing: var(--tracking-label); text-transform: uppercase; text-decoration: none; }
  .spec__frame { overflow: auto; background: var(--color-surface); }
  .spec__frame iframe { border: 0; display: block; block-size: 100%; }

  .cls { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(13rem,100%),1fr)); gap: var(--space-1) var(--space-4); }
  .cls code { font-family: var(--font-mono); font-size: 0.72rem; color: var(--color-muted); }

  .dir { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(15rem,100%),1fr)); gap: var(--space-3); }
  .dir a { display: flex; align-items: baseline; gap: var(--space-2);
           padding: var(--space-4) var(--space-5);
           border: 1px solid var(--color-border); border-radius: var(--radius-card);
           text-decoration: none; color: var(--color-ink);
           box-shadow: inset 0 2px 0 transparent;
           transition: border-color var(--duration-fast) var(--ease-out), box-shadow var(--duration-fast) var(--ease-out); }
  .dir a:hover { border-color: var(--color-brand-500); box-shadow: inset 0 2px 0 var(--color-brand-500); }
  .dir strong { font-weight: var(--weight-semibold); font-size: var(--size-small); }
  .dir span:last-child:not(.side__num) { margin-inline-start: auto; font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-muted); }

  .demo { border: 1px solid var(--color-border); border-radius: var(--radius-card);
          padding: var(--space-6); display: flex; flex-wrap: wrap; gap: var(--space-3); align-items: center; }
  .demo--dark { background: var(--color-brand-900); border-color: var(--color-brand-900); }
  .demo--stack { flex-direction: column; align-items: stretch; }
  .code { margin-block-start: var(--space-2); }
  .code > summary { cursor: pointer; list-style: none; display: inline-flex; align-items: center; gap: var(--space-1-5);
                    font-family: var(--font-mono); font-size: var(--size-label); font-weight: var(--weight-label);
                    letter-spacing: var(--tracking-label); text-transform: uppercase; color: var(--color-label); }
  .code > summary::-webkit-details-marker { display: none; }
  .code > summary::before { content: "\\3C\\3E"; }
  .code[open] > summary { color: var(--color-brand-600); }
  .code pre { margin-block-start: var(--space-2); padding: var(--space-4);
              background: var(--color-surface-sunken); border: 1px solid var(--color-border);
              border-radius: var(--radius-card); overflow-x: auto;
              font-family: var(--font-mono); font-size: 0.75rem; line-height: 1.6; color: var(--color-ink); }
  .use-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(16rem,100%),1fr)); gap: var(--space-5); margin-block-end: var(--space-2); }
  .use-grid ul { margin: 0; padding-inline-start: var(--space-4); font-size: var(--size-small); color: var(--color-muted); }
  .use-grid li { margin-block-end: var(--space-1); }
  .use-grid .k-do { color: var(--color-success-ink); }
  .use-grid .k-dont { color: var(--color-error-ink); }
  .variant-note { font-size: var(--size-small); color: var(--color-muted); margin: calc(-1 * var(--space-2)) 0 var(--space-2); max-inline-size: 46rem; }

  .pagenav { display: flex; justify-content: space-between; gap: var(--space-3); margin-block-start: var(--space-12);
             padding-block-start: var(--space-5); border-block-start: 1px solid var(--color-border); }

  @media (max-width: 63.999rem) {
    body { display: block; }
    .side { position: static; inline-size: auto; block-size: auto; border-inline-end: 0; border-block-end: 1px solid var(--color-border); }
    main { padding: var(--space-6) var(--space-4) var(--space-16); }
  }
`;

/* Theme control, shared by every page. localStorage keeps the choice across
   pages, so navigating the styleguide never flips you back to light. */
const JS = `
(function () {
  var root = document.documentElement;
  var btn = document.getElementById('theme');
  var KEY = 'ns-theme';
  function paintFrames(theme) {
    document.querySelectorAll('iframe[data-theme-frame]').forEach(function (f) {
      try { var d = f.contentDocument;
        if (d && d.documentElement) { d.documentElement.setAttribute('data-theme', theme); d.documentElement.style.colorScheme = theme; }
      } catch (e) {}
    });
  }
  function apply(theme) {
    root.setAttribute('data-theme', theme); root.style.colorScheme = theme;
    if (btn) {
      btn.setAttribute('aria-checked', String(theme === 'dark'));
      btn.querySelector('i').className = 'ph ' + (theme === 'dark' ? 'ph-sun' : 'ph-moon');
    }
    paintFrames(theme);
    try { localStorage.setItem(KEY, theme); } catch (e) {}
  }
  var stored = null; try { stored = localStorage.getItem(KEY); } catch (e) {}
  apply(stored === 'dark' || stored === 'light' ? stored
    : (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
  if (btn) btn.addEventListener('click', function () {
    apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
  });
  document.querySelectorAll('iframe[data-theme-frame]').forEach(function (f) {
    f.addEventListener('load', function () { paintFrames(root.getAttribute('data-theme')); });
  });
})();
/* Click-to-copy on every token/class name — the styleguide's one job is
   getting names into code. */
(function () {
  document.querySelectorAll('.sw__name, .tbl code, .cls code').forEach(function (el) {
    el.classList.add('copyable');
    el.title = 'Click to copy';
    el.addEventListener('click', function () {
      var text = el.textContent.trim();
      var done = function () {
        var was = el.textContent;
        el.setAttribute('data-copied', ''); el.textContent = 'copied';
        setTimeout(function () { el.removeAttribute('data-copied'); el.textContent = was; }, 900);
      };
      if (navigator.clipboard) navigator.clipboard.writeText(text).then(done);
    });
  });
})();
/* Sidebar search — filters page links and hides emptied groups. */
(function () {
  var q = document.getElementById('side-search');
  if (!q) return;
  var links = [].slice.call(document.querySelectorAll('.side nav a'));
  q.addEventListener('input', function () {
    var t = q.value.trim().toLowerCase();
    links.forEach(function (a) {
      a.style.display = !t || a.textContent.toLowerCase().indexOf(t) !== -1 ? '' : 'none';
    });
    document.querySelectorAll('.side nav .side__sep').forEach(function (sep) {
      var el = sep.nextElementSibling, any = false;
      while (el && !el.classList.contains('side__sep')) {
        if (el.tagName === 'A' && el.style.display !== 'none') { any = true; break; }
        el = el.nextElementSibling;
      }
      sep.style.display = any ? '' : 'none';
    });
  });
})();
/* Scrollspy — the TOC marks the section in view. */
(function () {
  var toc = document.querySelector('.toc');
  if (!toc || !('IntersectionObserver' in window)) return;
  var byId = {};
  toc.querySelectorAll('a[href^="#"]').forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
  var current = null;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (!en.isIntersecting) return;
      if (current) current.removeAttribute('aria-current');
      current = byId[en.target.id];
      if (current) current.setAttribute('aria-current', 'true');
    });
  }, { rootMargin: '0px 0px -70% 0px' });
  Object.keys(byId).forEach(function (id) {
    var el = document.getElementById(id);
    if (el) io.observe(el);
  });
})();`;

const sidebar = (current) => {
  const link = (p) => `<a href="./${p.file}"${p.file === current ? ' aria-current="page"' : ""}><span class="side__num">${p.num}</span>${esc(p.title)}</a>`;
  const foundations = PAGES.filter((p) => p.kind === "home" || p.kind === "section");
  const componentNav = FAMILIES.map((fam) => {
    const pages = PAGES.filter((p) => p.kind === "component" && p.family === fam);
    return `<p class="side__sep">${esc(fam)}</p>\n  ` + pages.map(link).join("\n  ");
  }).join("\n  ");
  const docNav = ["Charts", "Content creation"].map((side) => {
    const pages = PAGES.filter((p) => p.kind === "doc" && p.side === side);
    return `<p class="side__sep">${esc(side)}</p>\n  ` + pages.map(link).join("\n  ");
  }).join("\n  ");
  return `<div class="side">
  <div class="side__brand"><img src="../assets/logo/favicon.svg" alt=""><strong><a href="./index.html">Namaste UI</a></strong></div>
  <span class="side__ver">v${esc(pkg.version)} · ${all.length} tokens</span>
  <input class="ns-input side__search" type="search" id="side-search" placeholder="Filter pages…" aria-label="Filter pages">
  <nav aria-label="Pages">
  ${foundations.map(link).join("\n  ")}
  ${componentNav}
  ${docNav}
  </nav>
</div>`;
};

/* Give every .sub heading an id and collect them, so the page can carry a
   sticky on-this-page TOC in the right rail. */
const tocify = (inner) => {
  let n = 0;
  const items = [];
  const body = inner.replace(/<p class="sub([^"]*)"([^>]*)>([\s\S]*?)<\/p>/g, (m, cls, attrs, text) => {
    if (/k-do|k-dont/.test(cls)) return m;
    n += 1;
    const id = `sec-${n}`;
    items.push({ id, label: text.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim() });
    return `<p class="sub${cls}" id="${id}"${attrs}>${text}</p>`;
  });
  const toc = items.length >= 2 ? `<aside class="toc" aria-label="On this page">
    <p class="toc__title">On this page</p>
    <nav>
      ${items.map((it) => `<a href="#${it.id}">${esc(it.label)}</a>`).join("\n      ")}
    </nav>
  </aside>` : "";
  return { body, toc };
};

const shell = (page, inner) => {
  const i = PAGES.indexOf(page);
  const prev = PAGES[i - 1], next = PAGES[i + 1];
  const { body, toc } = tocify(inner);
  return `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(page.title)} — Namaste UI</title>
<link rel="icon" href="../assets/logo/favicon.svg">
<link rel="stylesheet" href="../dist/namaste-ui.css">
<style>${CSS}</style>
</head>
<body>
${sidebar(page.file)}
<main>
  <div class="top">
    <div>
      <h1><span class="sec__num">${page.num}</span>${esc(page.title)}</h1>
      ${page.lede ? `<p>${page.lede}</p>` : ""}
    </div>
    <button type="button" class="ns-btn ns-btn--outline ns-btn--icon" id="theme" role="switch" aria-checked="false" aria-label="Dark mode">
      <i class="ph ph-moon" aria-hidden="true"></i>
    </button>
  </div>
  ${page.pre || ""}
  <div class="cols${toc ? "" : " cols--full"}">
    <div class="colmain">
      ${body}
      <nav class="pagenav" aria-label="Adjacent pages">
        ${prev ? `<a class="ns-btn ns-btn--outline ns-btn--sm" href="./${prev.file}"><i class="ph ph-caret-left" aria-hidden="true"></i> ${prev.num} ${esc(prev.title)}</a>` : "<span></span>"}
        ${next ? `<a class="ns-btn ns-btn--outline ns-btn--sm" href="./${next.file}">${next.num} ${esc(next.title)} <i class="ph ph-caret-right" aria-hidden="true"></i></a>` : "<span></span>"}
      </nav>
    </div>
    ${toc}
  </div>
</main>
<script>${JS}</script>
</body>
</html>
`;
};

/* ---- render every page --------------------------------------------------
   The output directory is rebuilt from scratch so a renamed section cannot
   leave a stale orphan page behind. */
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });

for (const page of PAGES) {
  let inner = "";
  if (page.kind === "home") {
    page.lede = "One set of tokens, one portable component layer — rendered by both the Ghost theme (Handlebars + Tailwind v4) and the Next.js LMS (React). Every page here is generated from the real artifacts, so the styleguide cannot drift from the system.";
    page.pre = `
  <div class="ns-band ns-band--dark ns-band--grid home-hero">
    <div class="ns-band__inner">
      <span class="ns-kicker">The design system behind Namaste Salesforce</span>
      <h2 class="ns-band__title">Calm, flat, reading-first.<br>One blue. Hairlines. Mono for data.</h2>
      <span class="ns-hero__proof">${all.length} tokens · ${Object.values(classIndex).flat().length} classes · ${COMPONENTS.length} components · ${cards.length} specimens</span>
    </div>
  </div>
  <dl class="ns-statband home-stats">
    <div class="ns-statband__cell"><dd class="ns-statband__value">${all.length}</dd><dt class="ns-statband__label">Tokens</dt></div>
    <div class="ns-statband__cell"><dd class="ns-statband__value">${darkNames.size}</dd><dt class="ns-statband__label">Flip in dark</dt></div>
    <div class="ns-statband__cell"><dd class="ns-statband__value">${Object.values(classIndex).flat().length}</dd><dt class="ns-statband__label">.ns-* classes</dt></div>
    <div class="ns-statband__cell"><dd class="ns-statband__value">${COMPONENTS.length}</dd><dt class="ns-statband__label">Doc pages</dt></div>
  </dl>`;
    inner = `
  <p class="sub">The mark</p>
  <p class="variant-note">The logo, its lockups, and the favicon set — clear space, minimum sizes, and what never happens to it (no stretching, no recoloring, no shadows).</p>
  ${spec(["guidelines/brand-logo.card.html", "guidelines/brand-logo-lockups.card.html", "guidelines/brand-favicon.card.html"])}
  <p class="sub">The mark in motion — five sting / loading styles</p>
  <p class="variant-note">Live below: pulse, ring, orbit, flip and bar — the only animated uses of the logo. Markup and usage rules on the <a href="./c-preloader.html">Preloader page</a>.</p>
  <div class="demo" style="justify-content:space-between">
    <div class="ns-preloader ns-preloader--pulse" role="status"><span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span><span class="ns-preloader__label">pulse</span></div>
    <div class="ns-preloader ns-preloader--ring" role="status"><span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span><span class="ns-preloader__label">ring</span></div>
    <div class="ns-preloader ns-preloader--orbit" role="status"><span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span><span class="ns-preloader__label">orbit</span></div>
    <div class="ns-preloader ns-preloader--flip" role="status"><span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span><span class="ns-preloader__label">flip</span></div>
    <div class="ns-preloader" role="status"><span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span><span class="ns-preloader__bar" aria-hidden="true"></span><span class="ns-preloader__label">bar</span></div>
  </div>
  <p class="sub">Foundations</p>
  <div class="dir">
    ${PAGES.filter((p) => p.kind === "section").map((p) => `<a href="./${p.file}"><span class="side__num">${p.num}</span><strong>${esc(p.title)}</strong></a>`).join("\n    ")}
  </div>
  <p class="sub">Components — one page each: usage, variants, markup</p>
  <div class="dir">
    ${PAGES.filter((p) => p.kind === "component").map((p) => `<a href="./${p.file}"><span class="side__num">${p.num}</span><strong>${esc(p.title)}</strong><span>${esc(p.family)}</span></a>`).join("\n    ")}
  </div>
  <p class="sub">Charts</p>
  <div class="dir">
    ${PAGES.filter((p) => p.kind === "doc" && p.side === "Charts").map((p) => `<a href="./${p.file}"><span class="side__num">${p.num}</span><strong>${esc(p.title)}</strong></a>`).join("\n    ")}
  </div>
  <p class="sub">Content creation</p>
  <div class="dir">
    ${PAGES.filter((p) => p.kind === "doc" && p.side === "Content creation").map((p) => `<a href="./${p.file}"><span class="side__num">${p.num}</span><strong>${esc(p.title)}</strong></a>`).join("\n    ")}
  </div>`;
  } else if (page.kind === "section") {
    page.lede = page.section.lede;
    inner = page.section.body();
  } else if (page.kind === "component") {
    const c = page.comp;
    page.lede = c.summary;
    const list = (items, cls) => items.map((x) => `<li>${x}</li>`).join("");
    inner = `
  ${(c.use || c.not) ? `<div class="use-grid">
    ${c.use ? `<div><p class="sub k-do">Use it for</p><ul>${list(c.use)}</ul></div>` : ""}
    ${c.not ? `<div><p class="sub k-dont">Not for</p><ul>${list(c.not)}</ul></div>` : ""}
  </div>` : ""}
  ${c.variants.map((v) => `
  <p class="sub">${esc(v.name)}</p>
  ${v.note ? `<p class="variant-note">${v.note}</p>` : ""}
  <div class="demo${v.dark ? " demo--dark" : ""}${/ns-(alert|toast|thread|tickets|auth__|accordion|field|fieldset|table-wrap|empty|band|builder|statband|features|faq|quote|rte|dropzone|publishbar|toolbar|pagehead|stat-grid|editor__rail|file)/.test(v.html) ? " demo--stack" : ""}">
${v.html}
  </div>
  ${v.script ? `<script>${v.script}</script>` : ""}
  <details class="code"><summary>markup</summary><pre><code>${esc(v.html)}</code></pre></details>`).join("")}
  ${c.a11y ? `<p class="sub">Accessibility contract</p><div class="use-grid"><div><ul>${list(c.a11y)}</ul></div></div>` : ""}`;
  } else {
    const d = page.doc;
    page.lede = d.lede;
    inner = `${d.body || ""}${spec(d.cards || [])}`;
  }
  writeFileSync(join(OUT, page.file), shell(page, inner));
}

/* Full-screen template demos. templates/*.html are copy-paste SNIPPETS with
   no stylesheet of their own — correct for their job, but opened bare they
   render unstyled. The docs links point here instead: the real template
   body, wrapped with the real stylesheet. */
const DEMOS = [
  { out: "demo-player.html", tpl: "course-player.html", title: "Course player — full layout demo", back: "c-player.html", note: "resize to see the < lg single-column collapse" },
  { out: "demo-admin-dashboard.html", tpl: "admin-dashboard.html", title: "Admin dashboard — full screen demo", back: "c-admin-shell.html", note: "shell + nav + stats + drafts" },
  /* The two editor surfaces are the CONTENT of an admin screen — in product
     they render inside the shell's <main>, so the demo wraps them in one.
     `interactive` layers on the demo-only wiring (add/reorder/remove
     lessons, tags, uploads, publish state) so the flows are testable with
     no backend — in product this behaviour comes from the React components. */
  { out: "demo-admin-course-new.html", tpl: "admin-course-new.html", title: "Create a course — full screen demo", back: "c-admin-shell.html", note: "interactive — build the curriculum, tag it, publish", wrap: "ns-admin__main", interactive: true },
  { out: "demo-admin-lesson-editor.html", tpl: "admin-lesson-editor.html", title: "Lesson editor — full screen demo", back: "c-admin-shell.html", note: "interactive — write, format, upload, publish", wrap: "ns-admin__main", interactive: true },
  { out: "demo-sections.html", tpl: "sections-home.html", title: "Page sections — full page demo", back: "c-hero-section.html", note: "hero → logos → features → stats → quote → FAQ → CTA" },
];
/* Demo-only wiring for the admin editors. In product this behaviour lives in
   the React components (components/admin/); here it is vanilla JS over the
   same markup, so the flows — build a curriculum, tag, upload, publish —
   are testable straight from the styleguide with no app and no backend. */
const ADMIN_DEMO_JS = `
(function () {
  var pad = function (n) { return String(n).padStart(2, '0'); };
  var now = function () { return new Date().toTimeString().slice(0, 8); };

  /* Save state: any edit marks "saving…", then stamps the time. */
  var stateEl = document.querySelector('.ns-publishbar__state');
  var saveTimer;
  function touched() {
    if (!stateEl) return;
    var chip = stateEl.querySelector('.ns-status');
    stateEl.lastChild.textContent = ' saving\\u2026';
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () { stateEl.lastChild.textContent = ' saved ' + now(); }, 500);
  }
  document.addEventListener('input', touched);

  /* Publish / draft actions. */
  document.addEventListener('submit', function (e) { e.preventDefault(); });
  document.querySelectorAll('.ns-publishbar__actions .ns-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var chip = stateEl && stateEl.querySelector('.ns-status');
      if (!chip) return;
      var publishes = /publish|update/i.test(btn.textContent);
      chip.className = 'ns-status ' + (publishes ? 'ns-status--success' : 'ns-status--idle');
      chip.textContent = publishes ? 'Published' : 'Draft';
      stateEl.lastChild.textContent = ' saved ' + now();
    });
  });

  /* Curriculum builder: renumber, add, remove, reorder. */
  function renumber() {
    document.querySelectorAll('.ns-builder__section').forEach(function (sec, si) {
      sec.querySelector('.ns-builder__head .ns-builder__index').textContent = pad(si + 1);
      var rows = sec.querySelectorAll('.ns-builder__row');
      rows.forEach(function (row, li) { row.querySelector('.ns-builder__index').textContent = pad(li + 1); });
      var meta = sec.querySelector('.ns-builder__meta');
      if (meta) meta.textContent = rows.length + ' lesson' + (rows.length === 1 ? '' : 's');
    });
  }
  function lessonRow(name) {
    var row = document.createElement('div');
    row.className = 'ns-builder__row';
    row.innerHTML = '<button type="button" class="ns-builder__grip" aria-label="Reorder ' + name + ' \\u2014 arrow keys move it"><i class="ph ph-dots-six-vertical" aria-hidden="true"></i></button>' +
      '<span class="ns-builder__index">00</span>' +
      '<span class="ns-builder__name" contenteditable="true">' + name + '</span>' +
      '<span class="ns-builder__type">video</span><span class="ns-builder__dur">00:00</span>' +
      '<span class="ns-builder__rowactions">' +
      '<button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Edit"><i class="ph ph-pencil-simple" aria-hidden="true"></i></button>' +
      '<button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Remove"><i class="ph ph-x" aria-hidden="true"></i></button></span>';
    return row;
  }
  /* Editing lesson names in place is part of the demo. */
  document.querySelectorAll('.ns-builder__name').forEach(function (n) { n.setAttribute('contenteditable', 'true'); });

  document.addEventListener('click', function (e) {
    var add = e.target.closest('.ns-builder__add');
    var remove = e.target.closest('.ns-builder__rowactions .ns-btn[aria-label^="Remove"]');
    if (add && add.closest('.ns-builder__section')) {
      var section = add.closest('.ns-builder__section');
      var row = lessonRow('New lesson');
      section.insertBefore(row, add);
      renumber(); touched();
      var name = row.querySelector('.ns-builder__name');
      name.focus(); document.getSelection().selectAllChildren(name);
    } else if (add) {
      var builder = add.closest('.ns-builder');
      var sec = document.createElement('section');
      sec.className = 'ns-builder__section';
      sec.innerHTML = '<header class="ns-builder__head"><span class="ns-builder__index">00</span>' +
        '<input class="ns-builder__title" value="New section" aria-label="Section title">' +
        '<span class="ns-builder__meta">0 lessons</span></header>' +
        '<button type="button" class="ns-builder__add"><i class="ph ph-plus" aria-hidden="true"></i> Add lesson</button>';
      builder.insertBefore(sec, add);
      renumber(); touched();
      sec.querySelector('.ns-builder__title').select();
    }
    if (remove) {
      var target = remove.closest('.ns-builder__row') || remove.closest('.ns-file');
      if (target) { target.remove(); renumber(); touched(); }
    }
  });
  /* Keyboard reordering on the grip — same contract as the React component. */
  document.addEventListener('keydown', function (e) {
    var grip = e.target.closest && e.target.closest('.ns-builder__grip');
    if (!grip || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return;
    e.preventDefault();
    var row = grip.closest('.ns-builder__row');
    var sib = e.key === 'ArrowUp' ? row.previousElementSibling : row.nextElementSibling;
    if (sib && sib.classList.contains('ns-builder__row')) {
      row.parentNode.insertBefore(row, e.key === 'ArrowUp' ? sib : sib.nextSibling);
      renumber(); touched(); grip.focus();
    }
  });

  /* Tag input: Enter/comma adds, Backspace-on-empty and the x remove. */
  document.querySelectorAll('.ns-taginput').forEach(function (box) {
    var input = box.querySelector('input');
    function chip(text) {
      var s = document.createElement('span');
      s.className = 'ns-taginput__tag';
      s.innerHTML = text + '<button type="button" class="ns-taginput__x" aria-label="Remove ' + text + '"><i class="ph ph-x" aria-hidden="true"></i></button>';
      return s;
    }
    box.addEventListener('click', function (e) {
      var x = e.target.closest('.ns-taginput__x');
      if (x) { x.closest('.ns-taginput__tag').remove(); touched(); } else input.focus();
    });
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        var t = input.value.trim().replace(/,+$/, '');
        if (t) { box.insertBefore(chip(t), input); input.value = ''; touched(); }
      }
      if (e.key === 'Backspace' && !input.value) {
        var last = box.querySelector('.ns-taginput__tag:last-of-type');
        if (last) { last.remove(); touched(); }
      }
    });
  });

  /* Dropzone: choosing/dropping a file appends a real file row. */
  document.querySelectorAll('.ns-dropzone input[type=file]').forEach(function (input) {
    input.addEventListener('change', function () {
      var zone = input.closest('.ns-dropzone');
      Array.prototype.forEach.call(input.files, function (f) {
        var row = document.createElement('div');
        row.className = 'ns-file';
        var mb = (f.size / 1048576).toFixed(1);
        row.innerHTML = '<i class="ph ph-file" aria-hidden="true"></i>' +
          '<span class="ns-file__name">' + f.name + '</span>' +
          '<span class="ns-file__size">' + (mb < 0.1 ? (f.size / 1024).toFixed(0) + ' KB' : mb + ' MB') + '</span>' +
          '<span class="ns-status ns-status--info">Uploading</span>' +
          '<button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon ns-file__remove" aria-label="Remove ' + f.name + '"><i class="ph ph-x" aria-hidden="true"></i></button>';
        zone.parentNode.insertBefore(row, zone.nextSibling);
        setTimeout(function () {
          var st = row.querySelector('.ns-status');
          st.className = 'ns-status ns-status--success'; st.textContent = 'Processed';
        }, 1200);
      });
      touched();
    });
  });
  document.addEventListener('click', function (e) {
    var rm = e.target.closest('.ns-file__remove');
    if (rm) { rm.closest('.ns-file').remove(); touched(); }
  });

  /* Rich text: real formatting on the contenteditable area. */
  var RTE_CMDS = { 'Bold': 'bold', 'Italic': 'italic', 'Bulleted list': 'insertUnorderedList', 'Numbered list': 'insertOrderedList' };
  var RTE_BLOCKS = { 'Heading 2': 'h2', 'Heading 3': 'h3', 'Quote': 'blockquote', 'Code block': 'pre' };
  document.querySelectorAll('.ns-rte__btn').forEach(function (btn) {
    btn.addEventListener('mousedown', function (e) { e.preventDefault(); }); // keep the text selection
    btn.addEventListener('click', function () {
      var label = btn.getAttribute('aria-label');
      if (RTE_CMDS[label]) document.execCommand(RTE_CMDS[label]);
      else if (RTE_BLOCKS[label]) document.execCommand('formatBlock', false, RTE_BLOCKS[label]);
      btn.setAttribute('aria-pressed', String(btn.getAttribute('aria-pressed') !== 'true'));
      touched();
    });
  });
})();`;

for (const d of DEMOS) {
  let body = readFileSync(join(ROOT, `templates/${d.tpl}`), "utf8")
    .replace(/<!--[\s\S]*?-->\n?/, ""); // strip the adaptation header comment
  if (d.wrap) body = `<main class="${d.wrap}">\n${body}\n</main>`;
  if (d.interactive) body += `\n<script>${ADMIN_DEMO_JS}</script>`;
  writeFileSync(join(OUT, d.out), `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.title)}</title>
<link rel="icon" href="../assets/logo/favicon.svg">
<link rel="stylesheet" href="../dist/namaste-ui.css">
<style>body{margin:0} .demo-bar{display:flex;align-items:center;gap:var(--space-3);padding:var(--space-2) var(--space-4);border-block-end:1px solid var(--color-border);font-family:var(--font-mono);font-size:var(--size-label);letter-spacing:var(--tracking-label);text-transform:uppercase;color:var(--color-label)}</style>
</head>
<body>
<div class="demo-bar">templates/${esc(d.tpl)} — ${esc(d.note)}
  <a class="ns-btn ns-btn--outline ns-btn--sm" style="margin-inline-start:auto" href="./${d.back}">&larr; back to docs</a></div>
${body}
<script>document.documentElement.setAttribute('data-theme', (function(){try{return localStorage.getItem('ns-theme')}catch(e){return null}})() || 'light');</script>
</body>
</html>
`);
}

console.log(`wrote preview/ — ${PAGES.length} pages (home + ${SECTIONS.length} sections + ${COMPONENTS.length} components + ${CHART_DOCS.length + CONTENT_DOCS.length} chart/content docs), ${all.length} tokens, ${cards.length} specimens embedded in place`);
