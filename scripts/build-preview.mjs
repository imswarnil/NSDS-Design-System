#!/usr/bin/env node
/* NS Design System — styleguide generator (multi-page).
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
   dist/tokens.json, the class index scraped from src/css/*.css,
   specimens are the actual .card.html files — so the styleguide cannot
   drift from the system.

   Run:  gulp build   (or node scripts/build-preview.mjs) */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { cssFiles as cssFilesOf } from "./lib/css-files.mjs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENTS, FAMILIES } from "./component-docs.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, "preview");
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/* ---- inputs ------------------------------------------------------------ */
const tokens = JSON.parse(readFileSync(join(ROOT, "dist/tokens.json"), "utf8"));
/* The two runtime scripts the system actually ships. theme-init is INLINED
   in the head — that is its documented requirement and the styleguide should
   demonstrate the correct usage, not a convenient one. nav.js is deferred,
   and makes the navbar demos on the component pages genuinely operable. */
/* Its header comment contains a literal </script> (the Ghost snippet it tells
   you to paste), which would end the inline block early and dump the rest of
   the file into the page as text. Escaping the slash is the standard fix. */
const THEME_INIT = readFileSync(join(ROOT, "assets/js/theme-init.js"), "utf8").replace(/<\/script/g, "<\\/script");
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
for (const rel of cssFilesOf(ROOT)) {
  /* Keyed by the path under src/css/ — "primitives/button.css" rather
     than "button.css" — so the class index shows which family a class belongs
     to, which is the question the index is usually being asked. */
  const f = rel.replace("src/css/", "");
  const css = readFileSync(join(ROOT, rel), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
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
      <li><strong>Monospace is a structural material.</strong> The mono face renders every index, duration, timestamp, status and kicker — that split is what makes a list read as data and a paragraph read as writing.</li>
      <li><strong>One signal color.</strong> Brand blue is the only hue that means &ldquo;interactive&rdquo; — so a screen with one solid blue button has exactly one obvious next action.</li>
      <li><strong>Sharp, specific geometry.</strong> 6px cards, 4px buttons, pills only for true pills. Nothing is rounded because rounding is the default.</li>
      <li><strong>Motion is instant, not springy.</strong> 120–180ms plain ease-out; no bounce, no scale-pop, no hover-lift.</li>
    </ul></div></div>
    ${spec(["guidelines/principles.card.html"])}` },
  { id: "elements", title: "Elements", lede: "The styled content primitives. Put <code>.ns-prose</code> on any reading surface — a lesson body, a blog post, CMS output — and the bare elements inside it (headings, lists, blockquotes, code, tables…) render in the system's voice with no further classes.", body: () => {
    const PROSE = `<div class="ns-prose">
  <h2>Working with objects</h2>
  <p class="ns-lead">Everything in Salesforce is a record on an object — master this and the rest of the platform follows.</p>
  <p>An <a href="#">object</a> is a table with superpowers. Standard objects like <code>Account</code> ship with the org; custom objects end in <code>__c</code> and belong to you.</p>
  <h3>The rules that matter</h3>
  <ul>
    <li>One object per real-world concept — resist the mega-object</li>
    <li>Relationships over duplicate fields
      <ul><li>Lookup when parents are optional</li><li>Master-detail when the child cannot exist alone</li></ul>
    </li>
    <li>Name fields for the reader, not the API</li>
  </ul>
  <h3>Deploy in three steps</h3>
  <ol>
    <li>Create the object in a sandbox</li>
    <li>Add it to a change set</li>
    <li>Validate, then deploy on a quiet Friday morning</li>
  </ol>
  <blockquote>
    <p>The best data model is the one the next admin understands without asking you.</p>
    <footer>— Every senior architect, eventually</footer>
  </blockquote>
  <p>Query it with SOQL — press <kbd>Cmd</kbd> <kbd>Enter</kbd> to run:</p>
  <pre><code>SELECT Id, Name, Industry
FROM Account
WHERE AnnualRevenue &gt; 1000000
ORDER BY Name</code></pre>
  <dl>
    <dt>Object</dt><dd>A table: Account, Course__c.</dd>
    <dt>Record</dt><dd>A row: one account, one enrolled student.</dd>
    <dt>Field</dt><dd>A column: Name, Level__c, <mark>the part you design</mark>.</dd>
  </dl>
  <hr>
  <table>
    <thead><tr><th>Relationship</th><th>Child required?</th><th>Rollups</th></tr></thead>
    <tbody>
      <tr><td>Lookup</td><td>No</td><td>No</td></tr>
      <tr><td>Master-detail</td><td>Yes</td><td>Yes</td></tr>
    </tbody>
  </table>
  <p><small>Standard and custom objects share the same query language — the skills transfer 1:1.</small></p>
</div>`;
    return `
    <p class="sub">The reading surface — everything below is bare HTML inside .ns-prose</p>
    <div class="demo demo--stack">
${PROSE}
    </div>
    <details class="code"><summary>markup</summary><pre><code>${esc(PROSE)}</code></pre></details>
    <p class="sub">What each element does</p>
    <div class="use-grid"><div><ul>
      <li><strong>Headings</strong> — Switzer at 700, air above, little below: a heading belongs to what follows</li>
      <li><strong>Links</strong> — brand blue, hairline underline solidifying on hover</li>
      <li><strong>ul</strong> — square markers (sharp geometry, not the default disc); <strong>ol</strong> — mono numerals</li>
      <li><strong>blockquote</strong> — the 2px brand edge, mono attribution; never an italic wash</li>
    </ul></div><div><ul>
      <li><strong>code / pre / kbd</strong> — sunken chips and card-framed blocks in the mono face</li>
      <li><strong>dl</strong> — mono terms, hairline-edged definitions</li>
      <li><strong>table / hr</strong> — hairlines only, mono headers</li>
      <li><strong>img / figure</strong> — card frame, mono caption below (see Image for the full component)</li>
    </ul></div></div>`; } },
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
  { id: "type", title: "Typography", lede: "Two self-hosted faces. <strong>Switzer</strong> is the whole interface AND the reading layer \u2014 one grotesque separated by weight and size rather than a display/text pair, and it sets the quotations too; <strong>Roboto Mono</strong> is the data voice, and it is shipped rather than borrowed from the OS because it sets every index, duration, tag and status on every screen. Switzer is an Indian Type Foundry cut from <a href=\"https://www.fontshare.com\">Fontshare</a>, Roboto Mono is under the SIL OFL \u2014 <strong>67&thinsp;KB for the pair</strong>, licences in <code>fonts/</code>. The scale <strong>forks</strong> on the axis that matters: scanned versus read. UI copy \u2014 rails, tables, admin, player chrome \u2014 is <strong>14&nbsp;px</strong> on the compact scale after <a href=\"https://github.com/openclaw/carapace\">openclaw/carapace</a>, because this is a product with an app inside it; an <em>article</em> reads at <strong>17&nbsp;px</strong> with its own 1.7 leading, because a 2,000-word essay is not a table row. This page is the whole typographic contract: the scale, the reading weight, the effects, the voice, and the accessibility floor. <a href=\"./demo-type-specimen.html\">Open the full specimen \u2197</a>", body: () => `
    <p class="sub">The pairing</p>
    <div class="demo demo--stack" style="gap:var(--space-2)">
      <span class="ns-label">// Switzer 700 &middot; heading</span>
      <span style="font-family:var(--font-heading);font-size:var(--size-h1);font-weight:var(--weight-heading);letter-spacing:var(--tracking-tight);line-height:var(--leading-tight)">Build on the platform, not around it</span>
      <span style="font-family:var(--font-sans);font-size:var(--size-body);color:var(--color-muted);max-inline-size:var(--measure-prose)">The same face carries the reading layer — lesson copy, descriptions, and every sentence longer than a label. Nothing changes but weight and size, which is why the page reads as one voice rather than two negotiating.</span>
      <span style="font-family:var(--font-mono);font-size:var(--size-mono)">01 &middot; APEX BASICS &middot; 12:40 &middot; <span style="color:var(--color-success-ink)">COMPLETE</span></span>
    </div>

    <p class="sub">The fourth voice — and the one font this system does not ship</p>
    <div class="demo demo--stack" style="gap:var(--space-4)">
      <div>
        <span class="ns-label">--font-serif &middot; font-serif &middot; no binary shipped</span>
        <blockquote class="ns-pullquote" style="margin-block-start:var(--space-3)">The hairline is the structure. Everything else is negotiable.</blockquote>
      </div>
      <p style="font-size:var(--size-small);color:var(--color-muted);max-inline-size:var(--measure-prose)">
        Display speaks, Text explains, Mono keeps the records — and Serif <em>quotes</em>. A pull-quote,
        a drop cap and a section quotation are the places a page stops arguing and starts citing; set in
        the same grotesque as the argument, they never quite read as a different speaker, they read as a
        bigger heading. Compare the two above.
      </p>
      <p style="font-size:var(--size-small);color:var(--color-muted);max-inline-size:var(--measure-prose)">
        <strong>No font file is shipped for it.</strong> The N&amp;M family is self-hosted because it is the
        brand; a face used on three devices per page does not earn another download, and this system ships
        no licence for one. <code>--font-serif</code> resolves to the reader&rsquo;s own Georgia — a genuinely
        good screen serif present on essentially every device — and a product that <em>has</em> licensed a
        display serif overrides exactly one token to get it. The pattern is borrowed from
        <a href="https://github.com/openclaw/carapace">openclaw/carapace</a>, which ships font stacks and no
        font files at all.
      </p>
    </div>

    <p class="sub">The three voices</p>
    <div class="demo demo--stack" style="gap:var(--space-4)">
      <div>
        <span class="ns-label">Switzer &middot; wght 100&ndash;900 &middot; shipped, 29&thinsp;KB</span>
        <div style="font-family:var(--font-heading);font-size:var(--size-h2);font-weight:700;letter-spacing:var(--tracking-tight)">700 — hero and h1&ndash;h3</div>
        <div style="font-family:var(--font-heading);font-size:var(--size-h3);font-weight:600">600 — h4, card titles, buttons, inline emphasis</div>
        <div style="font-family:var(--font-heading);font-size:var(--size-h4);font-weight:500">500 — nav links, tab labels</div>
        <div style="font-family:var(--font-sans);font-size:var(--size-body);font-weight:400">400 — body copy, the reading default</div>
      </div>
      <div>
        <span class="ns-label">quotations &middot; the platform serif &middot; NOT shipped</span>
        <blockquote class="ns-pullquote" style="margin-block-start:var(--space-2)">The hairline is the structure. Everything else is negotiable.</blockquote>
      </div>
      <div>
        <span class="ns-label">Roboto Mono &middot; wght 100&ndash;700 &middot; shipped, 37&thinsp;KB &middot; the data voice</span>
        <div style="font-family:var(--font-mono);font-size:var(--size-mono);font-weight:400">400 — code blocks, inline code, timestamps</div>
        <div class="ns-label" style="font-size:var(--size-label)">700 — kickers &middot; indexes &middot; status labels</div>
      </div>
    </div>
    <p class="variant-note">Mono is the material Principle&nbsp;2 is made of — every index, duration, timestamp and status runs through it — and it is still the one face this system does not ship. Those runs are short, tracked and uppercase, and the reader&rsquo;s own console face is not merely adequate there, it is more familiar than anything we could send them. The consequence to know: mono is SF&nbsp;Mono on macOS, Consolas on Windows, and whatever the distro sets on Linux, so a mono run is <em>not</em> an identical width across platforms. The <code>tabular-nums</code> in <code>tokens/base.css</code> is what keeps digits aligned.</p>

    <p class="sub">Why body copy is 400</p>
    <p class="variant-note">The previous family was a Nunito-derived cut whose true Regular rendered <em>grey</em> rather than black, so this system set reading copy at <strong>450 (&ldquo;Book&rdquo;)</strong> — an interpolation step invented to fix that face&rsquo;s problem. Switzer does not have it: its Regular is properly fitted, and carrying 450 across would have been cargo — half a step heavier than the designer drew, for no reason anyone could still state. Body is <strong>400</strong>. Switzer also has a real <strong>500</strong>, which the old family lacked, so the ramp is 400&thinsp;/&thinsp;500&thinsp;/&thinsp;600&thinsp;/&thinsp;700 and every step is a weight that was actually drawn.</p>

    <p class="sub">The scale</p>
    ${typeRows(pick(/^--size-/).filter((t) => t.name !== "--size-mega"))}
    <p class="variant-note"><code>--size-mega</code> is left out of this table on purpose &mdash; at <code>clamp(2.75rem, 1.9rem + 4.2vw, 5.5rem)</code> its preview row would be taller than everything above it put together. It is shown in place under <em>Display &amp; poster typography</em> below, which is the only context it belongs in.</p>
    <p class="variant-note">Compact, after <a href="https://github.com/openclaw/carapace">carapace</a>: 12&thinsp;/&thinsp;13&thinsp;/&thinsp;14&thinsp;/&thinsp;17&thinsp;/&thinsp;20&thinsp;/&thinsp;24&thinsp;/&thinsp;32, then the ratio opens back up above 32 because a hero is a different job from a heading. Reading copy is 14&nbsp;px because this is a product with an app inside it — at 16 the player, admin and tables all had to fight the base size with <code>--size-small</code>, which is the tell that the base was wrong for most of the screens being built. Only the top two steps clamp: a hero has to survive a 360&nbsp;px phone, a paragraph does not. Everything is <code>rem</code>, because one <code>px</code> font-size is one piece of text that stops responding to browser zoom.</p>

    <p class="sub">Weight, leading, tracking</p>
    ${plainRows(pick(/^--(weight|leading|tracking)-/))}

    <p class="sub">Measure — the most common typographic mistake in a product</p>
    <div class="demo demo--stack" style="gap:var(--space-5)">
      <div>
        <span class="ns-label">--measure-prose &middot; 68ch &middot; correct</span>
        <p class="ns-measure">The reading measure is a character count, not a width — the constraint IS characters per line, which makes <code>ch</code> the one honest unit for it. Past roughly eighty characters the eye starts losing the line return, and reading speed measurably drops.</p>
      </div>
      <div>
        <span class="ns-label">no cap &middot; what a full-width paragraph does</span>
        <p style="color:var(--color-muted)">The reading measure is a character count, not a width — the constraint IS characters per line, which makes <code>ch</code> the one honest unit for it. Past roughly eighty characters the eye starts losing the line return, and reading speed measurably drops. This paragraph is set with no cap at all, and the difference is not subtle at this width.</p>
      </div>
      <div>
        <span class="ns-label">--measure-narrow &middot; 46ch &middot; ledes, quotes, callouts</span>
        <p class="ns-measure--narrow" style="font-size:var(--size-body-lg)">Short-measure text can afford a larger size, because the line is short enough to return from.</p>
      </div>
    </div>

    <p class="sub">Numerals — data is never proportional</p>
    <div class="demo demo--stack" style="gap:var(--space-4)">
      <div>
        <span class="ns-label">tabular &middot; what a column of data uses</span>
        <div style="font-family:var(--font-mono);font-variant-numeric:tabular-nums;font-size:var(--size-body-lg);line-height:1.5">11:04<br>18:41<br>09:15</div>
      </div>
      <div>
        <span class="ns-label">proportional &middot; the same three values, not lining up</span>
        <div style="font-family:var(--font-mono);font-variant-numeric:proportional-nums;font-size:var(--size-body-lg);line-height:1.5;color:var(--color-muted)">11:04<br>18:41<br>09:15</div>
      </div>
    </div>
    <p class="variant-note">Alignment in a column of figures is a typographic property, not a table one — so <code>time</code>, <code>output</code>, <code>.ns-num</code> and anything carrying <code>[data-numeric]</code> get <code>tabular-nums</code> in the base layer, everywhere, automatically.</p>

    ${spec(["guidelines/type-headings.card.html", "guidelines/type-body.card.html", "guidelines/type-kicker.card.html", "guidelines/type-mono-code.card.html"])}

    <p class="sub">Text effects — the three rules</p>
    <p class="variant-note">Everything below is decoration over text that already reads correctly without it. <strong>1. The effect is never the meaning</strong> — struck text is a real <code>&lt;s&gt;</code>, a highlight is a real <code>&lt;mark&gt;</code>, a citation is a real link to a footnote that exists. <strong>2. It draws once</strong> — these fire when scrolled into view and then stop; a thing that loops forever mid-paragraph is an ad. <strong>3. It collapses under reduced motion</strong> — each effect's <em>final</em> state is the correct rendering, so flattening leaves a drawn highlight rather than an invisible one. Source: <code>src/css/type-fx.css</code> + <code>assets/js/type-fx.js</code>.</p>
    <div class="demo demo--stack" style="gap:var(--space-4);font-size:var(--size-body-lg)">
      <p><mark class="ns-mark">Highlight</mark> marks a phrase, never a paragraph — and four tints exist so one page can mark two different things: <mark class="ns-mark ns-mark--success">shipped</mark>, <mark class="ns-mark ns-mark--warning">deprecated</mark>, <mark class="ns-mark ns-mark--error">removed</mark>, <mark class="ns-mark ns-mark--solid">or filled solid</mark>.</p>
      <p><s class="ns-strike ns-strike--muted">One record at a time</s> <strong>collections, always</strong> — the correction pattern: struck text goes muted so the eye lands on the live value.</p>
      <p>Bulkify <span class="ns-circle">every trigger<svg viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true"><path d="M28,10 C90,-2 200,2 210,22 C216,42 150,54 92,52 C40,50 4,42 8,28 C11,16 60,6 130,8"/></svg></span> &mdash; one circled phrase per screen.</p>
      <p><span class="ns-frame">Governor limits</span> &nbsp; <span class="ns-frame ns-frame--brackets">RunLocalTests</span> &nbsp; <span class="ns-frame ns-frame--quiet">optional</span></p>
      <p class="ns-scan ns-scan--lines" style="font-family:var(--font-heading);font-size:var(--size-h2);font-weight:var(--weight-heading)">Developer Console</p>
      <p class="ns-scramble" style="font-family:var(--font-heading);font-size:var(--size-h2);font-weight:var(--weight-heading)">Metadata deploy complete</p>
      <p>The second colour on each device, for when a page has to mark two different kinds of wrong: <s class="ns-strike ns-strike--error">hard delete the records</s> is a mistake, and <span class="ns-circle ns-circle--accent">check the recycle bin<svg viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true"><path d="M28,10 C90,-2 200,2 210,22 C216,42 150,54 92,52 C40,50 4,42 8,28 C11,16 60,6 130,8"/></svg></span> is the caution.</p>
      <p class="ns-hanging">&ldquo;<code>.ns-hanging</code> turns on <code>hanging-punctuation</code>, so an opening quote sits in the margin and the first real letter lines up with the paragraph below it. It is one property and it is the difference between a pull-quote that looks set and one that looks indented.&rdquo;</p>
    </div>
    <details class="code"><summary>markup</summary><pre><code>${esc(`<mark class="ns-mark ns-mark--animate">a highlighter marks a phrase</mark>
<s class="ns-strike ns-strike--animate ns-strike--muted">one record at a time</s>
<span class="ns-circle ns-circle--animate">every trigger<svg viewBox="0 0 220 60" preserveAspectRatio="none" aria-hidden="true"><path d="M28,10 C90,-2 200,2 210,22 …"/></svg></span>
<span class="ns-frame ns-frame--animate">Governor limits</span>
<h2 class="ns-scan ns-scan--lines">Developer Console</h2>
<h2 class="ns-scramble">Metadata deploy complete</h2>

<!-- The one looping variant, and it is printed rather than rendered on this
     page on purpose: rule 2 above says an effect draws once. .ns-scan--loop
     is for a standalone poster or an OBS scene title, where the type IS the
     content and nobody is trying to read a paragraph beside it. -->
<h2 class="ns-scan ns-scan--lines ns-scan--loop">Live in 5</h2>`)}</code></pre></details>

    <p class="sub">Responsive shift — why the scramble exists</p>
    <p class="variant-note">The scrambler's real job is not the entrance; it is the <strong>break</strong>. When a breakpoint re-wraps a heading, the text normally teleports to its new position. <code>assets/js/type-fx.js</code> listens to the breakpoint media queries — not to <code>resize</code>, which would fire on every frame — and re-settles the characters, so a reflow reads as deliberate rather than as a jump. For the layout half of the same problem, <code>.ns-shift-group</code> hands the browser <code>interpolate-size</code> and transitions on <code>font-size</code>, <code>line-height</code>, <code>letter-spacing</code> and <code>max-inline-size</code>, and <code>.ns-shift</code> takes a <code>view-transition-name</code>. Both degrade to nothing where unsupported, which is the right failure mode for a nicety. <em>Resize this page across 40rem or 64rem to watch the heading above re-settle.</em></p>

    <div class="demo demo--stack ns-shift-group" style="gap:var(--space-4)">
      <p class="ns-shift" style="--fx-shift-name:fx-shift-demo;font-family:var(--font-heading);font-size:var(--size-h3);font-weight:var(--weight-heading);margin:0">This heading re-settles rather than teleporting when the layout breaks.</p>
      <p class="variant-note" style="margin:0">Above: <code>.ns-shift-group</code> on the container, <code>.ns-shift</code> plus a <code>--fx-shift-name</code> on the element that should keep its identity across the change. Both are inert where the features are unsupported.</p>
    </div>

    ${spec(["guidelines/type-effects.card.html"])}

    <p class="sub">Display and poster typography</p>
    <p class="variant-note">Type at <code>--size-mega</code> is a graphic element, not a heading: it sets solid (<code>--leading-mega</code>, 0.94), tightens to <code>--tracking-mega</code> because tracking scales with the size it is set at, and is laid out against the viewport rather than a container.</p>
    <div class="demo demo--stack" style="gap:var(--space-4)">
      <p class="ns-display ns-display--mega ns-display--stack" style="font-size:clamp(2.5rem,1.5rem+4vw,4.5rem)">
        <span>Build on</span><span class="ns-display--outline ns-display--outline-brand">the platform</span>
      </p>
      <p class="ns-display ns-display--gradient" style="font-size:var(--size-display)">One signal colour, two steps of it</p>
      <p class="ns-display ns-display--stack ns-display--center" style="font-size:var(--size-h2)">
        <span>Centred</span><span>with <code>--center</code></span>
      </p>
      <p style="font-size:var(--size-h3);font-weight:var(--weight-heading)">Hover this: <a class="ns-link--fill" href="#0">the text fills</a> — display sizes only, because at 16px the half-filled state is unreadable.</p>
      <blockquote class="ns-pullquote">The hairline is the structure. Everything else is negotiable.</blockquote>
    </div>
    ${spec(["guidelines/type-display.card.html"])}

    <p class="sub">Circular text, links, citations, anchors</p>
    ${spec(["guidelines/type-curve.card.html"])}

    <p class="sub">Content design — how the product speaks</p>
    <p class="variant-note">Voice is a typographic decision, which is why it lives here rather than on a page of its own: plain English, encouraging, practical; explain <em>why</em>, not just <em>what</em>; second person for instruction, third for the product. <strong>Sentence case everywhere</strong> except uppercase mono kickers and lesson-type badges — and uppercase is a two-or-three-word device, because a tracked uppercase sentence is measurably slower to read. No emoji in product copy. Numbers only when they are concrete.</p>
    <div class="use-grid">
      <div><p class="sub k-do">Do</p><ul>
        <li><strong>Buttons name the action</strong> — “Start learning”, “Send sign-in link”, “Browse courses”.</li>
        <li><strong>Errors say what happened and what to do</strong> — “We could not find an account for that address. Create one instead.”</li>
        <li><strong>Empty states have three parts</strong> — what is missing, why it is empty, and one way out.</li>
        <li><strong>Labels are nouns, actions are verbs.</strong> A control that reads as a noun is not a control.</li>
      </ul></div>
      <div><p class="sub k-dont">Don't</p><ul>
        <li>“Submit”, “Click here”, “OK” — a mechanism, not an action.</li>
        <li>“Error: authentication failed (code 401)” — a status code is never the whole message.</li>
        <li>Blaming the reader: “you entered an invalid…”.</li>
        <li>Title Case On Every Heading. It reads as a brochure, and it breaks the sentence-case rule the whole system runs on.</li>
      </ul></div>
    </div>
    ${spec(["guidelines/content-design.card.html"])}

    <p class="sub">Accessibility — the typographic floor</p>
    <p class="variant-note">Weight, measure and leading are accessibility properties before they are aesthetic ones. Reading copy is <code>--weight-body</code> (450) and never lighter; body leading is 1.65, above the 1.5 that WCAG 1.4.12 needs to survive a reader's own text-spacing overrides; every size is <code>rem</code> so browser zoom works; secondary ink clears 6.87:1 rather than sitting at the 4.5:1 line. The general component contract — focus, targets, motion, status colour — is on the <a href="./accessibility.html">Accessibility page</a>.</p>
    ${spec(["guidelines/type-accessibility.card.html"])}` },
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
  { id: "geometry", title: "Geometry & motion", lede: "Four radii exist and no more — Tailwind's <code>rounded-lg</code>/<code>-xl</code> are deliberately left undefined so reaching for one is a build error. One easing curve, no springs.", body: () => `
    ${plainRows(pick(/^--(radius|shadow|duration|ease)-/))}
    <p class="sub">Interaction — focus ring, press/disabled/loading dim, hairline</p>
    ${plainRows(pick(/^--(focus-ring|opacity)-|^--border-hairline/))}
    ${spec(["guidelines/radii-shadows.card.html", "guidelines/motion.card.html", "guidelines/states.card.html"])}` },
  { id: "icons", title: "Icons", lede: "Two sets, one optical weight. The <strong>NSDS set</strong> is ours — drawn in <code>src/icons/&lt;style&gt;/</code>, one SVG per icon per style, built into a sprite by <code>npm run build</code>; adding one is dropping a file in a folder. <strong>Phosphor</strong> (a subsetted icon font) covers the generic vocabulary Phosphor already has a word for, on the same 24px grid at the same stroke weight so the two sets mix in one row. Search filters every group at once, and matches descriptions as well as names — &ldquo;award&rdquo; finds the certificate. Click a name to copy it.", body: () => {
    /* The bespoke set comes from the generated manifest rather than by
       scraping the sprite: the manifest knows which STYLES each icon has and
       what it is a picture of, and both are things the grid should show. */
    const nsIcons = JSON.parse(readFileSync(join(ROOT, "icons/icons.json"), "utf8"));
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
    /* One cell per icon, showing every style it has. The search matches the
       manifest's own terms — the name, its parts, and the description — so
       "quiz" finds lesson-quiz and "award" finds certificate by its prose
       rather than only by an exact name match. */
    const spriteCells = nsIcons.map((ic) => `
      <div class="sw icon-cell" data-icon="nsds-${ic.name}" data-terms="${esc(ic.terms)}"
           style="display:flex;align-items:center;gap:var(--space-3);padding:var(--space-3)">
        ${ic.styles.map((st) => `<svg class="ns-icon ns-icon--lg${st === "duotone" ? " ns-icon--duotone" : ""}" aria-hidden="true"><use href="../icons/nsds-icons.svg#nsds-${ic.name}${st === "regular" ? "" : `-${st}`}"/></svg>`).join("")}
        <span style="display:grid;gap:2px;min-inline-size:0">
          <code class="sw__name" style="padding:0">nsds-${ic.name}</code>
          <span style="font-size:var(--size-label);color:var(--color-label)">${ic.styles.join(" · ")}</span>
        </span>
      </div>`).join("");
    const phGroups = [...grouped].filter(([, list]) => list.length).map(([g, list]) => `
    <p class="sub icon-group-head">${esc(g)} · ${list.length}</p>
    <div class="sw-grid icon-group">${list.map((n) => cell(`ph-${n}`, `<i class="ph ph-${n}" aria-hidden="true" style="font-size:var(--size-h3)"></i>`)).join("")}</div>`).join("");
    return `
    <div class="row" style="margin-block-start:var(--space-4)">
      <input class="ns-input" type="search" id="icon-q" placeholder="Search ${nsIcons.length + phNames.length} icons…" aria-label="Search icons" style="max-inline-size:20rem">
      <button type="button" class="ns-btn ns-btn--outline ns-btn--sm" id="icon-fill" aria-pressed="false">Fill style</button>
      <span id="icon-count" style="font-family:var(--font-mono);font-size:var(--size-label);color:var(--color-muted)"></span>
    </div>
    <p class="sub icon-group-head">NSDS set — ours, drawn in <code>src/icons/</code> · ${nsIcons.length} icons, ${nsIcons.reduce((n, i) => n + i.styles.length, 0)} styles · built to <code>icons/nsds-icons.svg</code></p>
    <div class="sw-grid icon-group">${spriteCells}</div>
    ${phGroups}
    <p class="sub">Sprite size steps — the type scale, not an icon scale</p>
    <div class="row" style="align-items:baseline">
      <svg class="ns-icon ns-icon--sm" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-roadmap"/></svg>
      <svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-roadmap"/></svg>
      <svg class="ns-icon ns-icon--lg" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-roadmap"/></svg>
      <svg class="ns-icon ns-icon--xl" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-roadmap"/></svg>
      <code class="sw__name" style="padding:0">--sm · (default, 1em) · --lg · --xl</code>
    </div>
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
          /* Match the name AND the description terms, so "award" finds the
             certificate and "quiz" finds lesson-quiz. Phosphor cells carry
             no data-terms and fall back to the name, as before. */
          var hay = c.getAttribute('data-icon') + ' ' + (c.getAttribute('data-terms') || '');
          var hit = !t || hay.toLowerCase().indexOf(t) !== -1;
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
  { id: "patterns", title: "Patterns", lede: "Thirteen abstract, hairline-only background canvases, plus the platform\u2019s own shapes — pure CSS gradients from <code>patterns/patterns.css</code>, for hero bands and collection thumbnails. Put <code>ns-pattern ns-pattern--&lt;name&gt;</code> on a container; add <code>ns-pattern--on-light</code> on light surfaces. Click a name to copy it.", body: () => {
    const names = ["grid", "dots", "diagonal", "hex", "concentric", "chevron-grid", "blueprint", "topographic", "dashed-path", "circuit", "stagger", "arc", "mesh"];
    const shapes = [
      ["cloud", "the mark the certification badge carries"],
      ["plate", "the badge's heptagon, on its own"],
      ["bolt", "automation, in one polygon"],
      ["orbit", "a ring and a satellite — integration, sync"],
    ];
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
    <div class="sw-grid">${names.map((n, i) => tile(n, i, true)).join("")}</div>

    <p class="sub">The hairline grid, on its own</p>
    <p class="variant-note">The house motif is also exposed as raw material, because most of the places that want it are drawing it in a <code>::before</code> — and you cannot put a class on a pseudo element. <code>--ns-gridlines-image</code> composes <code>--ns-gridlines-ink</code>, and custom-property substitution resolves against the element that <em>uses</em> the value, so overriding the ink or the cell locally re-tints or re-scales the grid with nothing else changed. <code>.ns-gridlines</code> is the convenience class for the common case; <code>--cols</code> drops the horizontal rules for a column guide. Distinct from <code>ns-pattern--grid</code>, which is a full-bleed band treatment with a vignette mask.</p>
    <div class="sw-grid">
      <div class="sw">
        <div class="ns-gridlines" style="aspect-ratio:16/10;background:var(--color-brand-900)"></div>
        <code class="sw__name">ns-gridlines</code>
        <span class="sw__val">default ink · 22px cell</span>
      </div>
      <div class="sw">
        <div class="ns-gridlines ns-gridlines--on-light" style="aspect-ratio:16/10;background:#fff;--ns-gridlines-cell:14px">
        </div>
        <code class="sw__name">ns-gridlines--on-light</code>
        <span class="sw__val">+ --ns-gridlines-cell: 14px</span>
      </div>
      <div class="sw">
        <div class="ns-gridlines ns-gridlines--cols" style="aspect-ratio:16/10;background:var(--color-brand-900);--ns-gridlines-cell:32px"></div>
        <code class="sw__name">ns-gridlines--cols</code>
        <span class="sw__val">vertical rules only</span>
      </div>
    </div>
    <details class="code"><summary>markup</summary><pre><code>${esc(`<!-- as a class -->
<div class="ns-gridlines" style="--ns-gridlines-cell: 16px"></div>

<!-- as a value, which is what most call sites need -->
.tile::before {
  --ns-gridlines-cell: 16px;
  background-image: var(--ns-gridlines-image);
  background-size: var(--ns-gridlines-cell) var(--ns-gridlines-cell);
}`)}</code></pre></details>

    <p class="sub">Shapes</p>
    <p style="max-inline-size:46rem;margin-block-end:var(--space-4)">The platform's own marks as CSS rather than image files, so a band, a card or an empty state can carry a piece of the brand's geometry without commissioning art — and so the same shape can be animated or blended rather than pasted. Size with <code>inline-size</code>; colour comes from <code>background</code>, so a shape inherits whatever the surface wants.</p>
    <div class="sw-grid">${shapes.map(([n, why]) => `
      <div class="sw">
        <div style="aspect-ratio:16/10;display:grid;place-items:center;background:var(--color-surface-sunken);border-radius:var(--radius-sm)">
          <span class="ns-shape ns-shape--${n}" style="inline-size:4rem"></span>
        </div>
        <code class="sw__name">ns-shape--${n}</code>
        <span class="sw__val">${why}</span>
      </div>`).join("")}</div>

    <p class="sub">Blended, behind content</p>
    <p style="max-inline-size:46rem;margin-block-end:var(--space-4)">This is what the shapes are for. <code>--blend</code> puts a shape in <code>soft-light</code> over a band so it tints what is under it instead of covering it; <code>--wash</code> drops it to 8% for a light surface; <code>--behind</code> takes it out of the flow. Keep them under about 12% on content surfaces — a shape you notice while reading is a shape that failed. <code>--drift</code> adds a 24s rotation, and stops entirely under <code>prefers-reduced-motion</code>.</p>
    <div class="ns-band ns-band--dark ns-pattern ns-pattern--circuit" style="position:relative;overflow:hidden;border-radius:var(--radius-card)">
      <span class="ns-shape ns-shape--cloud ns-shape--blend ns-shape--behind ns-shape--drift" style="inline-size:18rem;background:var(--color-brand-300)"></span>
      <div class="ns-band__inner">
        <span class="ns-kicker ns-kicker--light">// Certification track</span>
        <h3 class="ns-band__title">Platform Developer I</h3>
        <p class="ns-band__lede">A circuit pattern, and one blended cloud drifting behind the copy. Neither is legible as an object, which is the test.</p>
      </div>
    </div>`;
  } },
  { id: "homepage", title: "Homepage & pages", lede: "How full pages are composed from the section vocabulary — the canonical band orders for the learning site's front doors, with every band linked to its component contract and every composition rendered as a real full-page demo. A page here is an <em>argument</em>: each band answers the next question a visitor actually has, and the order is the argument's structure.", body: () => `
    <p class="sub">The three front doors, rendered whole</p>
    <div class="row" style="margin-block-end:var(--space-6)">
      <a class="ns-btn ns-btn--primary" href="./demo-homepage.html">Learning-site homepage ↗</a>
      <a class="ns-btn" href="./demo-training-index.html">Training index ↗</a>
      <a class="ns-btn" href="./demo-course-listing.html">Course listing ↗</a>
      <a class="ns-btn ns-btn--quiet" href="./demo-sections.html">Generic band catalogue ↗</a>
    </div>

    <p class="sub">Three heroes, one rule</p>
    <p class="variant-note">A hero answers exactly one question — <em>what is this page and what do I do first</em> — and the three variants differ only in where the eye enters: the <strong>default</strong> is left-aligned and text-first (the reader is here on purpose), <strong>--center</strong> is for a launch surface where the headline is the event, <strong>--split</strong> is for the one page where showing beats telling and the media slot holds real proof. A fourth hero is a page that has not decided what it is for. All three are rendered with their markup on the <a href="./c-hero-section.html">Hero page</a>.</p>

    <p class="sub">The homepage, band by band</p>
    <p class="variant-note">This is the composition <code>templates/homepage.html</code> ships and <a href="./demo-homepage.html">demo-homepage</a> renders. Cut from the bottom, never the middle — a homepage without testimonials still works; a homepage without the merchandise is a brochure.</p>
    <div class="ns-table-wrap"><table class="ns-table ns-table--compact">
      <thead><tr><th scope="col" class="ns-table__num">#</th><th scope="col">Band</th><th scope="col">The question it answers</th><th scope="col">Component</th></tr></thead>
      <tbody>
        <tr><td class="ns-table__num">01</td><td class="ns-table__strong">Hero, split</td><td class="ns-table__quiet">What is this, and what do I do first</td><td><a href="./c-hero-section.html">Hero</a></td></tr>
        <tr><td class="ns-table__num">02</td><td class="ns-table__strong">Trust marquee</td><td class="ns-table__quiet">Who else trusts it</td><td><a href="./c-marquee.html">Marquee</a></td></tr>
        <tr><td class="ns-table__num">03</td><td class="ns-table__strong">Feature grid</td><td class="ns-table__quiet">Why this instead of YouTube</td><td><a href="./c-feature-grid.html">Feature grid</a></td></tr>
        <tr><td class="ns-table__num">04</td><td class="ns-table__strong">Learning path</td><td class="ns-table__quiet">Where do I enter</td><td><a href="./c-learning-path.html">Learning path</a></td></tr>
        <tr><td class="ns-table__num">05</td><td class="ns-table__strong">Course grid</td><td class="ns-table__quiet">What exactly do I get</td><td><a href="./c-course-card.html">Course card</a></td></tr>
        <tr><td class="ns-table__num">06</td><td class="ns-table__strong">Training tracks</td><td class="ns-table__quiet">What is free</td><td><a href="./c-training-hero.html">Training family</a></td></tr>
        <tr><td class="ns-table__num">07</td><td class="ns-table__strong">Stat band</td><td class="ns-table__quiet">How big, how real</td><td><a href="./c-stat-band.html">Stat band</a></td></tr>
        <tr><td class="ns-table__num">08</td><td class="ns-table__strong">Pace planner</td><td class="ns-table__quiet">How long will it take</td><td><a href="./c-pace.html">Pace planner</a></td></tr>
        <tr><td class="ns-table__num">09</td><td class="ns-table__strong">Quote + voices</td><td class="ns-table__quiet">Did it work for someone like me</td><td><a href="./c-testimonials.html">Testimonials</a></td></tr>
        <tr><td class="ns-table__num">10</td><td class="ns-table__strong">FAQ</td><td class="ns-table__quiet">The last three objections</td><td><a href="./c-faq.html">FAQ</a></td></tr>
        <tr><td class="ns-table__num">11</td><td class="ns-table__strong">CTA band</td><td class="ns-table__quiet">The one closer</td><td><a href="./c-cta-band.html">CTA band</a></td></tr>
      </tbody>
    </table></div>

    <p class="sub">The training index, band by band</p>
    <p class="variant-note"><code>templates/training-index.html</code> → <a href="./demo-training-index.html">demo-training-index</a>. The search is the most important control on the page — a visitor arriving at a 150-module curriculum has a <em>question</em> far more often than a place to start, and every band below the hero is for the visitor the search did not satisfy. The reading itself happens one level down: the <a href="./demo-training.html">module page</a> lists a module's posts, and the <a href="./demo-training-post.html">post page</a> is the article — the post at full width with the curriculum beside it on the trailing edge. Resize it below 64rem to watch the rail become a drawer.</p>
    <div class="ns-table-wrap"><table class="ns-table ns-table--compact">
      <thead><tr><th scope="col" class="ns-table__num">#</th><th scope="col">Band</th><th scope="col">The question it answers</th><th scope="col">Component</th></tr></thead>
      <tbody>
        <tr><td class="ns-table__num">01</td><td class="ns-table__strong">Training hero + search</td><td class="ns-table__quiet">What is this, and how big</td><td><a href="./c-training-hero.html">Training hero</a></td></tr>
        <tr><td class="ns-table__num">02</td><td class="ns-table__strong">Learning path</td><td class="ns-table__quiet">What shape is it</td><td><a href="./c-learning-path.html">Learning path</a></td></tr>
        <tr><td class="ns-table__num">03</td><td class="ns-table__strong">Track cards</td><td class="ns-table__quiet">What is in each stage</td><td><a href="./c-tiers.html">Training family</a></td></tr>
        <tr><td class="ns-table__num">04</td><td class="ns-table__strong">Free vs Pro</td><td class="ns-table__quiet">What does it cost</td><td><a href="./c-tiers.html">Free vs Pro</a></td></tr>
        <tr><td class="ns-table__num">05</td><td class="ns-table__strong">Pace planner</td><td class="ns-table__quiet">How long will it take</td><td><a href="./c-pace.html">Pace planner</a></td></tr>
        <tr><td class="ns-table__num">06</td><td class="ns-table__strong">Contributors</td><td class="ns-table__quiet">Who maintains this</td><td><a href="./c-training-people.html">Contributors</a></td></tr>
        <tr><td class="ns-table__num">07</td><td class="ns-table__strong">CTA band</td><td class="ns-table__quiet">The one closer — into module 01</td><td><a href="./c-cta-band.html">CTA band</a></td></tr>
      </tbody>
    </table></div>

    <p class="sub">Rules of composition</p>
    <div class="use-grid"><div><ul>
      <li><strong>One dark band opens, one dark band closes.</strong> The console navy is the brand's strongest material; hero and CTA get it, and everything between alternates surface and sunken so bands separate without borders.</li>
      <li><strong>The middle is merchandise.</strong> Between hero and closer, show the actual thing — path, courses, tracks, a date — not adjectives about it. Feature copy earns at most one band.</li>
      <li><strong>Every stat is checkable.</strong> A number a visitor could verify (courses, modules, learners) earns a cell; a marketing number (&ldquo;10x faster&rdquo;) does not.</li>
      <li><strong>One CTA band per page, always last.</strong> A page with two closers has none. Section-level actions live in band heads (<code>--between</code>), sized quiet.</li>
      <li><strong>Cut from the bottom.</strong> A shorter page drops voices, then FAQ, then stats — never the path or the merchandise.</li>
    </ul></div></div>` },
  { id: "accessibility", title: "Accessibility", lede: "The contract every component ships with: focus is always visible, motion collapses under reduced-motion, status never relies on color alone, and every icon-only control has a name.", body: () => spec(["guidelines/accessibility.card.html"]) },
  { id: "classes", title: "Class index", lede: "Scraped from <code>src/css/</code>. These are the class names the Ghost theme and the Next.js app both render — the actual shared surface between the two products.", body: () => Object.entries(classIndex).map(([file, list]) => `
    <p class="sub">${esc(file)}.css — ${list.length}</p>
    <div class="cls">${list.map((c) => `<code>.${esc(c)}</code>`).join("")}</div>`).join("") },
];

/* Foundations in teaching order: what it looks like (color, surfaces),
   what it reads as (type), how it is spaced and laid out, its shape and
   motion, its glyphs, its data — and the class index as the appendix. */
const SECTION_ORDER = ["intro", "elements", "color", "type", "surfaces", "spacing", "layout", "geometry", "icons", "patterns", "homepage", "accessibility", "classes"];
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

/* ---- Lesson video --------------------------------------------------------
   The recorded counterpart to the live page below. Same 16:9 canvas and the
   same brand furniture, minus everything that only makes sense while a
   broadcast is running — no live badge, no ticker, no chat, no countdown. A
   lesson is a file: it gets embedded, clipped and watched two years later, so
   its frame must not advertise a moment that has passed.

   Seventeen scenes in four families, every one drawn in BOTH themes, because
   light/dark parity here is a real constraint and not a nicety: the same
   lesson gets recorded against a bright office wall and a dark studio, and
   the layout may not change between them — only the palette. */
const LESSON_VIDEO_BODY = `
  <p class="sub">The frame</p>
  <p class="variant-note">Fixed before the first take and never touched again. Of the six zones, exactly one — the stage — changes between scenes; the kicker, the lesson index and the mark stay on the same pixels for the whole lesson, which is what lets someone who joins at minute nine know what they are watching.</p>
  ${spec(["brand-content-creation/lesson-video/frame.card.html"])}

  <p class="sub">Pick the scene by what you are doing</p>
  <p class="variant-note">Not by what you feel like cutting to. Every row below is a thing a teacher is actually doing at a moment in a lesson, and the scene that serves it. If your situation is not in this table, the answer is almost always scene 02 or scene 07.</p>
  <table class="tbl"><tbody>
    <tr><td><code>01</code></td><td style="inline-size:45%">Clicking through the org, running a query, watching a deploy — your hands matter, your face does not</td><td class="fill">Screen, full frame</td></tr>
    <tr><td><code>02</code></td><td style="inline-size:45%">Screen-share teaching where reactions carry meaning — the default for most lessons</td><td class="fill">Screen + camera, corner</td></tr>
    <tr><td><code>03</code></td><td style="inline-size:45%">The shared window is narrow (a form, a record) and you are explaining rather than demonstrating</td><td class="fill">Screen + camera, column</td></tr>
    <tr><td><code>04</code></td><td style="inline-size:45%">A procedure with more than three steps</td><td class="fill">Screen + step rail</td></tr>
    <tr><td><code>05</code></td><td style="inline-size:45%">One error, one field, one line of a debug log</td><td class="fill">Screen detail, zoomed</td></tr>
    <tr><td><code>06</code></td><td style="inline-size:45%">The first fifteen seconds — hook, promise, who you are</td><td class="fill">The open</td></tr>
    <tr><td><code>07</code></td><td style="inline-size:45%">The why, the caveat, the common mistake — argument, not demonstration</td><td class="fill">Camera, full frame</td></tr>
    <tr><td><code>08</code></td><td style="inline-size:45%">The one sentence you want them to remember</td><td class="fill">Camera + point card</td></tr>
    <tr><td><code>09</code></td><td style="inline-size:45%">Walking a diagram while gesturing at it</td><td class="fill">Camera + slide, two-up</td></tr>
    <tr><td><code>10</code></td><td style="inline-size:45%">Structure, definitions, a list — anything you cannot demonstrate</td><td class="fill">Slide, full frame</td></tr>
    <tr><td><code>11</code></td><td style="inline-size:45%">The same slide, but the explanation runs long</td><td class="fill">Slide + camera, corner</td></tr>
    <tr><td><code>12</code></td><td style="inline-size:45%">Reading a prepared snippet line by line</td><td class="fill">Code, full frame</td></tr>
    <tr><td><code>13</code></td><td style="inline-size:45%">Showing a mistake and the error it produces</td><td class="fill">Code + result</td></tr>
    <tr><td><code>14</code></td><td style="inline-size:45%">Two seconds after the hook</td><td class="fill">Title card</td></tr>
    <tr><td><code>15</code></td><td style="inline-size:45%">Crossing from one section to the next</td><td class="fill">Chapter card</td></tr>
    <tr><td><code>16</code></td><td style="inline-size:45%">The last minute — what they can now do</td><td class="fill">Recap card</td></tr>
    <tr><td><code>17</code></td><td style="inline-size:45%">The last ten seconds — the only CTA in the lesson</td><td class="fill">End card</td></tr>
  </tbody></table>

  <p class="sub">Sharing your screen</p>
  <p class="variant-note">The five scenes that carry most of a technical lesson. All of them assume the shared source is already 16:9 at native 1080p — a stretched or letterboxed screen is the fastest way to make good teaching look cheap, and the rules for getting that right are on the Live stream page, where they apply identically.</p>
  ${spec(["brand-content-creation/lesson-video/scenes-screen.card.html"])}

  <p class="sub">On camera</p>
  <p class="variant-note">Four scenes for the parts of a lesson that are an argument rather than a demonstration. Eyes on the upper-third line, a hand's width of headroom, the same crop the course thumbnails use — and the camera keeps one size and one corner for the entire lesson.</p>
  ${spec(["brand-content-creation/lesson-video/scenes-camera.card.html"])}

  <p class="sub">Slides and code</p>
  <p class="variant-note">A deck built at 1920&times;1080 needs no scaling at all, which is the sharpest possible path to the viewer — and it inherits the system's kicker, heading and mono-index voice, so a slide is recognizably the same brand as the course page it sits inside.</p>
  ${spec(["brand-content-creation/lesson-video/scenes-deck.card.html"])}

  <p class="sub">The cards between the teaching</p>
  <p class="variant-note">Four full-frame cards with no camera and no screen. They are the lesson's punctuation: they give the viewer somewhere to breathe, they give the platform its chapter marks, and they are geometrically the same assets as the thumbnails, so a course reads as one thing from the grid all the way into the video.</p>
  ${spec(["brand-content-creation/lesson-video/scenes-cards.card.html"])}

  <p class="sub">Light or dark?</p>
  <p class="variant-note">Both ship. The rule is that one lesson picks one and holds it — never switch themes mid-lesson, and never mix a dark card with a light stage. Within a course, a whole module may differ from another; a single lesson may not.</p>
  <div class="use-grid"><div><p class="sub k-do">Record dark when</p><ul>
    <li>You are in a dark editor or a dark-mode org — the frame and the stage agree instead of fighting.</li>
    <li>The lesson is code-heavy: a bright frame around a dark code panel is a glare box on a phone at night.</li>
    <li>You want the default. Dark is this brand's home, and the thumbnails are navy.</li>
  </ul></div><div><p class="sub k-do">Record light when</p><ul>
    <li>The shared screen is a light org, a document or a whiteboard — chasing it with a dark frame just outlines it.</li>
    <li>You are on camera in a bright room and cannot control the background.</li>
    <li>The lesson is conceptual and diagram-led; hairlines read better on white at low bitrates.</li>
  </ul></div></div>
  <p class="variant-note">Whichever you pick, the geometry is identical: every scene above is one layout with a swapped palette, driven by the same seven variables. If the light version needs a different arrangement, the arrangement was wrong.</p>

  <p class="sub">Cutting rhythm</p>
  <table class="tbl"><tbody>
    <tr><td><code>2s</code></td><td style="inline-size:45%">Title card &middot; chapter card</td><td class="fill">Hard cut in, hard cut out. Long enough to read, short enough not to be skipped.</td></tr>
    <tr><td><code>6–8s</code></td><td style="inline-size:45%">Lesson title and name plate on the open</td><td class="fill">They leave together, once, and never return.</td></tr>
    <tr><td><code>10–40s</code></td><td style="inline-size:45%">Camera, full frame</td><td class="fill">A punctuation mark. Past about 40 seconds it stops reading as emphasis and starts reading as a webcam recording.</td></tr>
    <tr><td><code>as long as it takes</code></td><td style="inline-size:45%">Screen scenes</td><td class="fill">The stage may hold for minutes — as long as something on it is changing. A still screen with narration over it is a slide, so cut to one.</td></tr>
    <tr><td><code>320ms</code></td><td style="inline-size:45%">Every transition</td><td class="fill">The brand-bar wipe, or a hard cut. No crossfades, no zooms, no stingers with sound effects.</td></tr>
    <tr><td><code>10s</code></td><td style="inline-size:45%">End card</td><td class="fill">Held in silence. Do not talk over it and do not cut it short — the platform's own end-screen elements need the room.</td></tr>
  </tbody></table>

  <p class="sub">Recording settings</p>
  <div class="use-grid"><div><ul>
    <li><strong>1920&times;1080, 16:9</strong> — canvas, capture and export. 30 fps for teaching; 60 only if something genuinely moves.</li>
    <li><strong>Shared display at native 1080p, scaling 100%.</strong> A HiDPI screen at default scaling sends a 2&times; frame the encoder downsamples, and every hairline in the org UI turns to mush.</li>
    <li><strong>Share one window, never the desktop</strong> — notifications, calendar popups, the other tab.</li>
  </ul></div><div><ul>
    <li><strong>Browser at 125–150%, editor at 18–20pt.</strong> Set it before you record, not mid-demo.</li>
    <li><strong>Mono audio, about &minus;16 LUFS, one mic.</strong> Half the audience has one earbud in.</li>
    <li><strong>The phone test.</strong> If you cannot read it on your own phone from the couch, it is not on screen yet.</li>
  </ul></div></div>

  <p class="sub">The failure modes</p>
  <div class="use-grid"><div><p class="sub k-dont">What makes a lesson look improvised</p><ul>
    <li>The camera in a different corner or a different size in every scene.</li>
    <li>A layout invented mid-lesson because the content did not fit one of the seventeen.</li>
    <li>A theme switch partway through, or a light card against a dark stage.</li>
    <li>Two overlays on screen at once, neither of them expiring.</li>
  </ul></div><div><p class="sub k-dont">What belongs to a live stream and never here</p><ul>
    <li>A LIVE badge on a file.</li>
    <li>A ticker, a chat panel or a comment strip.</li>
    <li>A countdown or a &ldquo;starting soon&rdquo; frame.</li>
    <li>A rotating handle bug. One CTA, once, on the end card.</li>
  </ul></div></div>`;

/* ---- Live stream ---------------------------------------------------------
   A live teaching session is the one place where the brand is assembled in
   real time, under pressure, by one person who is also teaching. So the rules
   here are deliberately fewer and harder than the ones for edited video: a
   fixed canvas, a fixed set of scenes, and a frame where only ONE zone is
   allowed to change. Everything that can be decided in advance is decided
   here, so that nothing has to be decided at 19:04 with 300 people watching. */
const LIVESTREAM_BODY = `
  <p class="sub">The canvas contract</p>
  <p class="variant-note">Non-negotiable, and set once in the encoder before the first stream — not per session. Every scene, overlay and shared source is authored against these numbers.</p>
  <table class="tbl"><tbody>
    <tr><td><code>CANVAS</code></td><td style="inline-size:45%">1920 &times; 1080, <strong>16:9, always</strong></td><td class="fill">Base canvas AND output resolution. 1280&times;720 is the only permitted fallback, and only when upload bandwidth forces it — the ratio never changes.</td></tr>
    <tr><td><code>SAFE AREA</code></td><td style="inline-size:45%">Title-safe 90%, action-safe 93%</td><td class="fill">All readable text inside 90%. The platform's own chrome, the chat panel and a phone's rounded corners all eat the outer band.</td></tr>
    <tr><td><code>GRID</code></td><td style="inline-size:45%">12 columns &times; 8 rows, ten named zones</td><td class="fill">Every zone snaps to it, in every scene. This is what makes eighteen different scenes feel like one broadcast.</td></tr>
    <tr><td><code>THEME</code></td><td style="inline-size:45%">Dark or light, chosen before the stream</td><td class="fill">Identical geometry either way — seven swapped variables, no rearrangement. Chosen once and never changed mid-session.</td></tr>
    <tr><td><code>FRAME RATE</code></td><td style="inline-size:45%">30 fps for teaching, 60 only for motion</td><td class="fill">A screen share at 30 fps looks identical and leaves the bitrate for detail instead of duplicate frames.</td></tr>
    <tr><td><code>BITRATE</code></td><td style="inline-size:45%">4500–6000 kbps video, 128 kbps audio</td><td class="fill">Text-heavy screen shares need the top of that range: hairlines and 1px borders are the first thing compression eats.</td></tr>
    <tr><td><code>AUDIO</code></td><td style="inline-size:45%">Mono, &minus;16 LUFS, one mic</td><td class="fill">Mono, because half the audience has one earbud in. Audio is the only part of a stream a viewer will not forgive.</td></tr>
    <tr><td><code>SCENES</code></td><td style="inline-size:45%">Eighteen, built and named before the stream</td><td class="fill">If a moment needs a nineteenth, it needs an edited video instead.</td></tr>
  </tbody></table>

  <p class="sub">One canvas, ten zones</p>
  <p class="variant-note">The frame is built once and then held still. Of the ten zones, exactly one — the stage — is allowed to change during a session. The kicker, live badge, watermark and handle stay nailed to the same pixels from the first second to the last, which is what lets a viewer who joins at minute 40 orient in under a second. Three of the ten only appear when the audience is on screen: the comment rail, the chip lane and the toast lane.</p>
  ${spec(["brand-content-creation/livestream/scene-grid.card.html"])}

  <p class="sub">Dark or light</p>
  <p class="variant-note">Every scene below is drawn in both. The choice is made once, before the stream, and it is a property of what you are sharing rather than a mood.</p>
  <div class="use-grid"><div><p class="sub k-do">Stream dark when</p><ul>
    <li>You are in a dark editor or a dark-mode org — the frame and the stage agree instead of fighting.</li>
    <li>The session is code-heavy: a bright frame around a dark code panel is a glare box on a phone at night.</li>
    <li>You want the default. Dark is this brand's home, and every thumbnail the session is promoted with is navy.</li>
  </ul></div><div><p class="sub k-do">Stream light when</p><ul>
    <li>The shared screen is a light org, a document or a whiteboard — chasing it with a dark frame just outlines it.</li>
    <li>You are on camera in a bright room and cannot control the background.</li>
    <li>The session is conceptual and diagram-led; hairlines read better on white at low bitrates.</li>
  </ul></div></div>
  <p class="variant-note">Whichever you pick, the geometry is identical: every scene is one layout with a swapped palette, driven by seven variables. If the light version needs a different arrangement, the arrangement was wrong. The one exception is the title strip, which stays dark in both themes because it is broadcast furniture rather than part of your desktop.</p>

  <p class="sub">The eighteen scenes</p>
  <p class="variant-note">Built and named in the encoder before you go live, in this order, so the hotkeys are muscle memory. A stream that improvises a layout is a stream that spends its first ten seconds looking broken. They fall into three groups, and the grouping is also the build order.</p>
  <table class="tbl"><tbody>
    <tr><td><code>01–04</code></td><td style="inline-size:45%"><strong>Open &amp; close.</strong> Countdown, welcome slide, intermission, ending.</td><td class="fill">The four scenes nobody is being taught in — and the only ones allowed to carry an ask.</td></tr>
    <tr><td><code>05–11</code></td><td style="inline-size:45%"><strong>Teaching.</strong> Camera, screen, screen + title, screen + camera, slide, slide + camera, code.</td><td class="fill">Where the hour actually goes. Scene 08 is the workhorse; 06 and 11 are for the minutes a face would be in the way.</td></tr>
    <tr><td><code>12–18</code></td><td style="inline-size:45%"><strong>Comments &amp; guests.</strong> Camera + comments, screen + comments, screen + camera + comments, comment wall, Q&amp;A, guest two-up, guest + screen.</td><td class="fill">The scenes where somebody other than you is on the frame. Every one of them narrows the stage rather than covering it.</td></tr>
  </tbody></table>
  ${spec([
    "brand-content-creation/livestream/scenes-open-close.card.html",
    "brand-content-creation/livestream/scenes-teaching.card.html",
    "brand-content-creation/livestream/scenes-community.card.html",
  ])}

  <p class="sub">The camera is not always 16:9</p>
  <p class="variant-note">A 16:9 camera in a 16:9 corner is the default, not the law. What a camera crop has to do is fill the block the layout gives it without leaving dead space and without covering the work — and a comment rail, a stacked guest gutter or a vertical-clip segment each give it a different block. Eight crops are sanctioned; one crop per session, chosen in the starting-soon scene and never changed.</p>
  ${spec(["brand-content-creation/livestream/camera-shapes.card.html"])}

  <p class="sub">Name plates</p>
  <p class="variant-note">A stream is watched in the middle. Somebody arriving at minute 40 sees a face and hears an opinion, and the name plate is the only thing on the frame that tells them whose opinion it is and why it is worth anything — icon, name, job title, in that order of size.</p>
  ${spec(["brand-content-creation/livestream/name-plates.card.html"])}

  <p class="sub">Live comments on screen</p>
  <p class="variant-note">Chat is the reason a live session is worth doing live, and a scrolling chat panel is the fastest way to make one unwatchable. The rule that resolves it: comments appear as a <strong>column that narrows the stage</strong>, never as a panel over it, and never faster than a viewer can read.</p>
  <table class="tbl"><tbody>
    <tr><td><code>RAIL</code></td><td style="inline-size:45%">Right column, 23.5% of canvas — 451px at 1080p</td><td class="fill">The stage scales uniformly to 67–74% to make room. Never stretch the screen capture back out to reclaim the width.</td></tr>
    <tr><td><code>ROWS</code></td><td style="inline-size:45%">Four maximum, newest at the bottom</td><td class="fill">Bottom, because that is how every chat client on earth reads. A fifth row means the type has to shrink, and 19px is already the floor at broadcast size.</td></tr>
    <tr><td><code>PROMOTION</code></td><td style="inline-size:45%">One comment filled at a time</td><td class="fill">A rail with two highlights has highlighted nothing. The promoted row is the one you are answering right now.</td></tr>
    <tr><td><code>SPEED</code></td><td style="inline-size:45%">Moderated in, never mirrored live</td><td class="fill">A raw feed at 400 concurrent viewers is unreadable and unmoderatable. Somebody pushes comments to the rail — you, between demos, or a moderator.</td></tr>
    <tr><td><code>READ ALOUD</code></td><td style="inline-size:45%">Every promoted comment, verbatim</td><td class="fill">Chat is not in the VOD. An unread comment is a silence the replay cannot explain, and the reply makes no sense without it.</td></tr>
    <tr><td><code>THE WALL</code></td><td style="inline-size:45%">Scene 15 — six curated questions, frozen, 60–90s</td><td class="fill">The honest way to give chat the whole frame: hand-picked, at reading size, answered in order.</td></tr>
    <tr><td><code>NEVER</code></td><td style="inline-size:45%">A live-scrolling panel over the stage</td><td class="fill">It competes with the thing you are teaching, it is illegible on a phone, and it puts an unmoderated stranger's words on your recording forever.</td></tr>
  </tbody></table>

  <p class="sub">Asks and notifications</p>
  <p class="variant-note">Two families that look similar and behave oppositely. A <strong>chip</strong> is an ask — you want something from the viewer, so it belongs only where nobody is being taught. A <strong>toast</strong> is an event — a viewer did something, and the frame acknowledges it. Both are reusable components with fixed positions, fixed sizes and, the part that is always forgotten, fixed durations.</p>
  ${spec([
    "brand-content-creation/livestream/action-chips.card.html",
    "brand-content-creation/livestream/notification-toasts.card.html",
  ])}

  <p class="sub">The overlay kit</p>
  <p class="variant-note">Fifteen graphics, and nothing else may go on a live frame. Each one has a fixed position, a fixed size and a fixed duration. An overlay with no exit rule becomes furniture, and furniture is what makes a frame look busy.</p>
  ${spec(["brand-content-creation/livestream/overlay-kit.card.html"])}

  <p class="sub">Screen share, slides and the 16:9 discipline</p>
  <p class="variant-note">The single most common way a teaching stream looks amateur is a source that does not match the canvas — a 4:3 org window stretched wide, or a deck exported at 4:3 and letterboxed by the platform. Neither is ever acceptable: match the ratio, or pillarbox on brand navy.</p>
  ${spec(["brand-content-creation/livestream/screen-share.card.html"])}

  <p class="sub">Camera &amp; framing</p>
  <div class="use-grid"><div><p class="sub k-do">Do</p><ul>
    <li>Eyes on the upper third line, a hand's width of headroom — the same crop the course thumbnails use.</li>
    <li>Hard corners and a 1px accent edge, whatever the ratio. The border is what separates a dark shirt from a navy canvas.</li>
    <li>Key light slightly off-axis, background two stops darker so the cam separates from the stage behind it.</li>
    <li>Look at the lens for the open, the promise and the close. Look at the screen while demonstrating — pretending otherwise reads as shifty.</li>
  </ul></div><div><p class="sub k-dont">Never</p><ul>
    <li>A circular or pill-shaped cam. Sharp geometry is Principle 4, and a round cam is the tell of a stock template.</li>
    <li>Two ratios in one session, or moving the cam between scenes to &ldquo;make room&rdquo; — re-park the content instead.</li>
    <li>A blurred or virtual background: it eats fingers when you gesture, and gestures are half of teaching.</li>
    <li>Cam over the shared screen's left navigation or over the record you are editing.</li>
  </ul></div></div>

  <p class="sub">The mark in the frame</p>
  <div class="use-grid"><div><ul>
    <li><strong>Bottom-right, 55–65% opacity, always on.</strong> The one graphic with no exit rule — a clip of your stream travels without a title, and the watermark is what still names the teacher.</li>
    <li><strong>Mark + wordmark</strong> on wide scenes; <strong>mark alone</strong> when the camera occupies that corner.</li>
    <li>Height about 3.5% of canvas — roughly 38px at 1080p. Large enough to survive a vertical crop for Shorts.</li>
  </ul></div><div><ul>
    <li>It animates once, in the intro sting, and never again. A pulsing logo is a distraction the viewer cannot dismiss.</li>
    <li>It never sits on a busy region of the shared screen — that is why the bottom-right 22% is kept clear.</li>
    <li>It is never recolored per session, per topic, or for a festival. See Brand &rarr; The mark.</li>
  </ul></div></div>

  <p class="sub">Run of show</p>
  <table class="tbl"><tbody>
    <tr><td><code>T&minus;10 min</code></td><td style="inline-size:45%"><strong>Starting soon.</strong> Countdown, session title, subscribe and bell. Music optional and quiet; no talking over it.</td><td class="fill">scene 01</td></tr>
    <tr><td><code>0:00</code></td><td style="inline-size:45%"><strong>Open on camera.</strong> The payoff first — what will exist by the end of the hour. No &ldquo;can everyone hear me.&rdquo;</td><td class="fill">scene 05 + name plate, 8s</td></tr>
    <tr><td><code>0:01</code></td><td style="inline-size:45%"><strong>The promise and the map.</strong> Three to five steps, numbered, with honest durations, stated aloud and left on screen.</td><td class="fill">scene 02</td></tr>
    <tr><td><code>0:05</code></td><td style="inline-size:45%"><strong>Teaching blocks.</strong> One step per block, each closed by doing the thing. Update the topic bar at every boundary.</td><td class="fill">scenes 06–11</td></tr>
    <tr><td><code>every ~15 min</code></td><td style="inline-size:45%"><strong>Re-orient.</strong> Name where you are for the people who just joined, take one question, fire the CTA sting if a demo just landed.</td><td class="fill">scene 16 + question card</td></tr>
    <tr><td><code>mid-session</code></td><td style="inline-size:45%"><strong>Bring the room in.</strong> Switch to a comment scene while people are following along, or take a two-minute break on the intermission.</td><td class="fill">scenes 12–14 &middot; scene 03</td></tr>
    <tr><td><code>last 10 min</code></td><td style="inline-size:45%"><strong>Q&amp;A proper.</strong> The wall first, so the room sees what is coming; then one question at a time. Unanswered ones become next week's cold open.</td><td class="fill">scenes 15 then 16</td></tr>
    <tr><td><code>last 2 min</code></td><td style="inline-size:45%"><strong>Close.</strong> Recap the promise in three lines, name and date the next session, one CTA.</td><td class="fill">scene 04</td></tr>
    <tr><td><code>after</code></td><td style="inline-size:45%"><strong>Hold the end card 60s</strong> before you stop the stream — the platform's replay opens on it and clip-grabbers land on it.</td><td class="fill">scene 04</td></tr>
  </tbody></table>

  <p class="sub">Social — before, during, after</p>
  <table class="tbl"><tbody>
    <tr><td><code>BEFORE</code></td><td style="inline-size:45%">One announcement asset, 24h out, reusing the <strong>course thumbnail</strong> frame with a <code>// LIVE &middot; THU 19:00 IST</code> kicker.</td><td class="fill">thumbnails page &middot; story template</td></tr>
    <tr><td><code>DURING</code></td><td style="inline-size:45%">The handle bug rotates one destination at a time — site, YouTube, LinkedIn — roughly every 10 minutes. Never a row of five icons.</td><td class="fill">overlay 06</td></tr>
    <tr><td><code>DURING</code></td><td style="inline-size:45%">The CTA sting fires at most twice an hour, after a completed demo, never mid-explanation. Chips only on the open, the break and the close.</td><td class="fill">overlays 11 &amp; 14</td></tr>
    <tr><td><code>END</code></td><td style="inline-size:45%">The ending scene is geometrically the same asset as the YouTube end screen, so the VOD and the stream close identically.</td><td class="fill">promo page &middot; end screen</td></tr>
    <tr><td><code>AFTER</code></td><td style="inline-size:45%">Two or three vertical clips cut from the recording — the watermark and the 90% safe area are what make a 9:16 crop survive. Stream with the 9:16 camera crop and your face needs no re-crop at all.</td><td class="fill">video page &middot; instagram page</td></tr>
    <tr><td><code>AFTER</code></td><td style="inline-size:45%">The session becomes the week's Monday lesson: same title, same thumbnail family, tighter edit.</td><td class="fill">video series &amp; schedule</td></tr>
  </tbody></table>

  <p class="sub">Accessibility, live</p>
  <div class="use-grid"><div><ul>
    <li>Platform auto-captions on, always. They are imperfect and still better than nothing for the third of viewers watching muted.</li>
    <li>Say what you are doing as you do it — &ldquo;I'm clicking Setup, then Object Manager.&rdquo; The narration is the audio description.</li>
    <li>Never point with color alone: &ldquo;the red one&rdquo; excludes; &ldquo;the Delete button, top right&rdquo; does not.</li>
    <li>Read every promoted comment and every question aloud. The rail is not in the VOD, and a reply to an unread question is nonsense on replay.</li>
  </ul></div><div><ul>
    <li>Question cards, name plates and the topic bar carry the same contrast floor as the product — 4.5:1 for body-size text on the navy canvas.</li>
    <li>No flashing transitions and no blinking LIVE dot. The scene wipe is 320ms linear, once, and that is the whole motion vocabulary.</li>
    <li>Toasts enter and leave, they never pulse or loop — motion that repeats cannot be dismissed and cannot be ignored.</li>
  </ul></div></div>

  <p class="sub">The failure modes</p>
  <div class="use-grid"><div><p class="sub k-dont">What makes a stream look improvised</p><ul>
    <li>A scene built live, on air, because the moment needed one.</li>
    <li>The camera in a different corner, or a different shape, in every scene.</li>
    <li>A stretched or letterboxed shared source.</li>
    <li>Three overlays on screen at once, none of them expiring.</li>
  </ul></div><div><p class="sub k-dont">What loses the viewer outright</p><ul>
    <li>Type below 16px on a shared screen — most of the audience is on a phone.</li>
    <li>Silence during a long operation. Narrate the wait or cut to camera.</li>
    <li>Chat scrolling live in a panel, competing with the thing you are teaching.</li>
    <li>A subscribe prompt over a live demo, or a toast over somebody else's answer.</li>
    <li>Stopping the stream the instant you stop talking, with no end card.</li>
  </ul></div></div>`;

/* ---- Charts docs --------------------------------------------------------
   Live demos built from the .ns-chart layer (src/css/chart.css) and
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

  { id: "chart-more", title: "Scatter, waterfall, bullet, slope", lede: "Four shapes for questions the bar and the line cannot answer: is there a relationship, how did the total get here, are we hitting target, and what changed between two moments.", body: `
${demoBlock("Scatter — is there a relationship", "The one chart here where the reader is meant to look at the SHAPE of the cloud rather than read any single mark. Dots are semi-transparent, so overlap reads as density instead of hiding records — five points on one spot is a darker dot, and that is information.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Hours studied vs score</span><span class="ns-chart__sub">128 learners</span></div>
  <div class="ns-chart__scatter">
    <span class="ns-chart__point" data-c="1" style="--x:12%;--y:22%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:18%;--y:31%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:24%;--y:28%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:31%;--y:44%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:34%;--y:39%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:42%;--y:52%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:46%;--y:47%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:53%;--y:61%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:58%;--y:58%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:64%;--y:71%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:69%;--y:66%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:76%;--y:79%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:82%;--y:74%"></span>
    <span class="ns-chart__point" data-c="1" style="--x:88%;--y:86%"></span>
  </div>
  <div class="ns-chart__x"><span>0h</span><span>20h</span><span>40h</span></div>
</figure>`)}
${demoBlock("Bubble — a third measure as area", "Radius carries a third number. Capped deliberately: past about 40px a bubble stops being a mark and becomes a region the reader tries to read boundaries into. Two series at most, or the cloud is unreadable.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Modules by traffic and completion</span><span class="ns-chart__sub">area = enrolments</span></div>
  <div class="ns-chart__scatter">
    <span class="ns-chart__point ns-chart__point--bubble" data-c="1" style="--x:18%;--y:30%;--_r:22px"></span>
    <span class="ns-chart__point ns-chart__point--bubble" data-c="1" style="--x:36%;--y:52%;--_r:34px"></span>
    <span class="ns-chart__point ns-chart__point--bubble" data-c="1" style="--x:55%;--y:44%;--_r:16px"></span>
    <span class="ns-chart__point ns-chart__point--bubble" data-c="2" style="--x:68%;--y:72%;--_r:40px"></span>
    <span class="ns-chart__point ns-chart__point--bubble" data-c="2" style="--x:84%;--y:63%;--_r:24px"></span>
  </div>
</figure>`)}
${demoBlock("Waterfall — how the total got here", "Every bar is a DELTA except the first and last, which are totals sitting on the baseline. That distinction is the whole chart: a waterfall drawn with every bar from zero is a bar chart that has lost its argument. Up and down take the status hues because direction is the meaning, not a category.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Active learners, Q3 to Q4</span><span class="ns-chart__sub">net +410</span></div>
  <div class="ns-chart__plot">
    <div class="ns-chart__wcol"><span class="ns-chart__wbar" style="--v:52%;--base:0%"></span><span class="ns-chart__wlink" style="--link:52%"></span></div>
    <div class="ns-chart__wcol"><span class="ns-chart__wbar ns-chart__wbar--up" style="--v:24%;--base:52%"></span><span class="ns-chart__wlink" style="--link:76%"></span></div>
    <div class="ns-chart__wcol"><span class="ns-chart__wbar ns-chart__wbar--up" style="--v:11%;--base:76%"></span><span class="ns-chart__wlink" style="--link:87%"></span></div>
    <div class="ns-chart__wcol"><span class="ns-chart__wbar ns-chart__wbar--down" style="--v:14%;--base:73%"></span><span class="ns-chart__wlink" style="--link:73%"></span></div>
    <div class="ns-chart__wcol"><span class="ns-chart__wbar" style="--v:73%;--base:0%"></span></div>
  </div>
  <div class="ns-chart__x"><span>Q3</span><span>New</span><span>Won back</span><span>Churn</span><span>Q4</span></div>
</figure>`)}
${demoBlock("Bullet — actual against target", "One measure against its target, in a row. It replaces a gauge for the same job in a fraction of the space and without the two problems a gauge has: a needle at an angle is hard to compare between rows, and a dial spends most of its pixels on the part of the range nobody is in. The target is a rule in ink, not a hue — it is a threshold, not a series, and a category colour would send the reader to the legend.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Against quarterly target</span><span class="ns-chart__sub">tick = target</span></div>
  <div class="ns-chart__bullet">
    <span class="ns-chart__row-label">Completions</span>
    <span class="ns-chart__btrack"><span class="ns-chart__bfill" data-c="1" style="--v:88%"></span><span class="ns-chart__btarget" style="--t:75%"></span></span>
    <span class="ns-chart__bvalue">88%</span>
  </div>
  <div class="ns-chart__bullet">
    <span class="ns-chart__row-label">Certifications</span>
    <span class="ns-chart__btrack"><span class="ns-chart__bfill" data-c="2" style="--v:61%"></span><span class="ns-chart__btarget" style="--t:80%"></span></span>
    <span class="ns-chart__bvalue">61%</span>
  </div>
  <div class="ns-chart__bullet">
    <span class="ns-chart__row-label">Labs finished</span>
    <span class="ns-chart__btrack"><span class="ns-chart__bfill" data-c="3" style="--v:94%"></span><span class="ns-chart__btarget" style="--t:70%"></span></span>
    <span class="ns-chart__bvalue">94%</span>
  </div>
</figure>`)}
${demoBlock("Slope — what changed between two moments", "Two points in time, one line per series. It beats a grouped bar at that job because crossing lines make a REORDERING visible, which is usually the finding. Four or five series at most: past that the middle is a knot, the labels collide, and the honest chart is a table.", `<figure class="ns-chart">
  <div class="ns-chart__head"><span class="ns-chart__title">Track popularity</span><span class="ns-chart__sub">2025 → 2026</span></div>
  <div class="ns-chart__slope">
    <div class="ns-chart__slope-side">
      <span class="ns-chart__slope-label">Apex 41%</span>
      <span class="ns-chart__slope-label">Flows 28%</span>
      <span class="ns-chart__slope-label">SOQL 19%</span>
      <span class="ns-chart__slope-label">LWC 12%</span>
    </div>
    <div class="ns-chart__slope-plot">
      <svg class="ns-chart__svg" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true" style="block-size:100%">
        <line class="ns-chart__line" data-c="1" x1="0" y1="8" x2="100" y2="30" vector-effect="non-scaling-stroke"/>
        <line class="ns-chart__line" data-c="2" x1="0" y1="34" x2="100" y2="12" vector-effect="non-scaling-stroke"/>
        <line class="ns-chart__line" data-c="3" x1="0" y1="60" x2="100" y2="64" vector-effect="non-scaling-stroke"/>
        <line class="ns-chart__line" data-c="4" x1="0" y1="86" x2="100" y2="78" vector-effect="non-scaling-stroke"/>
      </svg>
    </div>
    <div class="ns-chart__slope-side">
      <span class="ns-chart__slope-label">Flows 37%</span>
      <span class="ns-chart__slope-label">Apex 30%</span>
      <span class="ns-chart__slope-label">SOQL 18%</span>
      <span class="ns-chart__slope-label">LWC 15%</span>
    </div>
  </div>
</figure>`)}
` },
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

/* ---- YouTube channel ------------------------------------------------------
   The channel's own furniture — banner, avatar, watermark, playlist covers.
   Distinct from the Thumbnails and Promo pages, which are about individual
   VIDEOS: this is the page a stranger lands on before they have watched
   anything, and it has about four seconds to say what the channel is. */
const YOUTUBE_BODY = `
  <p class="sub">The finished assets</p>
  <p class="variant-note">Not mockups — the real files, rendered at true size from HTML artboards in <code>brand-content-creation/youtube/export/</code> that use the system's own tokens, fonts and glyph subset. The light banner is derived from the dark one by palette substitution, so the two cannot drift in geometry. Regeneration is one headless-Chrome command per file, documented in the export README.</p>
  ${spec(["brand-content-creation/youtube/finished-assets.card.html"])}

  <p class="sub">The banner, and the only part of it anyone sees</p>
  <p class="variant-note">A YouTube banner is one 2560&times;1440 file cropped four different ways, and only the middle 1546&times;423 survives all of them. Design that rectangle first and extend the background outward — the common failure is the reverse, a composition laid across the full canvas that looks right in the design tool and arrives on a phone with its title half gone.</p>
  ${spec(["brand-content-creation/youtube/banner-safe-areas.card.html"])}

  <p class="sub">The banners</p>
  <p class="variant-note">Three, each shown with the phone crop directly underneath so the claim is checkable rather than asserted. The default answers the only two questions a first-time visitor has — what is this channel, and how often does it publish.</p>
  ${spec(["brand-content-creation/youtube/banner-designs.card.html"])}

  <p class="sub">The profile photo</p>
  <p class="variant-note">Square in, circle out, and it spends most of its life at 24 pixels in a comment thread. That, not the 800&times;800 upload, is the size it has to be designed for.</p>
  ${spec(["brand-content-creation/youtube/profile-photo.card.html"])}

  <p class="sub">Icons — playlists, watermark, links</p>
  <p class="variant-note">One tile with the glyph and the words swapped, so a shelf of eight playlists reads as one channel rather than eight decisions. Glyphs come from the system's own Phosphor subset — a cover using an icon the site does not ship is a cover nobody can rebuild.</p>
  ${spec(["brand-content-creation/youtube/channel-icons.card.html"])}

  <p class="sub">Every asset, and its real size</p>
  <table class="tbl"><tbody>
    <tr><td><code>BANNER</code></td><td style="inline-size:45%">2560 &times; 1440, 16:9, under 6&nbsp;MB</td><td class="fill">Safe area 1546 &times; 423, centred. Keep the bottom-left of it clear — the avatar overlaps that corner.</td></tr>
    <tr><td><code>AVATAR</code></td><td style="inline-size:45%">800 &times; 800, square, under 4&nbsp;MB</td><td class="fill">Rendered as a circle. Solid navy ground, mark only, no text, no transparency.</td></tr>
    <tr><td><code>WATERMARK</code></td><td style="inline-size:45%">150 &times; 150 PNG, transparent</td><td class="fill">Bottom-right of every video at about 70% opacity, for the whole runtime.</td></tr>
    <tr><td><code>PLAYLIST</code></td><td style="inline-size:45%">1280 &times; 720</td><td class="fill">Same tile every time: index top-left, glyph top-right, name and count bottom-left.</td></tr>
    <tr><td><code>THUMBNAIL</code></td><td style="inline-size:45%">1280 &times; 720, under 2&nbsp;MB</td><td class="fill">On the Thumbnails page &mdash; it belongs to a video, not to the channel.</td></tr>
    <tr><td><code>END SCREEN</code></td><td style="inline-size:45%">last 20 seconds</td><td class="fill">On the Promo page. Same geometry as the lesson end card.</td></tr>
  </tbody></table>

  <p class="sub">What goes wrong</p>
  <div class="use-grid"><div><p class="sub k-dont">On the banner</p><ul>
    <li>Anything readable outside the middle 1546&times;423. It exists on your monitor and nowhere else.</li>
    <li>A launch banner left up after the launch. Nothing says &ldquo;abandoned&rdquo; more clearly than an enrolment that closed in March.</li>
    <li>Content in the bottom-left of the safe box, where the avatar lands on top of it.</li>
    <li>A subscriber count. It is stale the day you upload it, and it is already on the page.</li>
  </ul></div><div><p class="sub k-dont">On the avatar and icons</p><ul>
    <li>The wordmark in the circle. Legible in the design tool, a grey smudge in a comment.</li>
    <li>A transparent avatar — it becomes a white disc on one theme and a black one on the other.</li>
    <li>A second accent colour across the playlist shelf. Brand blue is the only saturated colour; eight hues is eight brands.</li>
    <li>Emoji or stock icons anywhere. The Phosphor subset is the icon set.</li>
  </ul></div></div>`;

const CONTENT_DOCS = [
  { id: "cc-approach", title: "Approach", lede: "What content creation is in this system: every public asset — thumbnail, post, video frame — is built from the same tokens and voice as the product, so the feed is recognizably one brand.", cards: ["brand-content-creation/README.card.html", "brand-content-creation/training/training-pair.card.html", "brand-content-creation/course-lesson-pairs/pairs.card.html"] },
  { id: "cc-schedule", title: "Video series & schedule", lede: "The publishing plan: what ships on which day, and the second-by-second template every video follows — hook, promise, sting, teaching, bridge.", body: SCHEDULE_BODY, cards: ["brand-content-creation/video-structure/first-60-seconds.card.html"] },
  { id: "cc-video", title: "Video structure & motion", lede: "Hooks, closures and the motion rules for moving brand assets — how the intro sting and scene transitions behave.", cards: ["brand-content-creation/video-structure/hooks-and-closures.card.html", "brand-content-creation/motion-guidelines.card.html", "brand-content-creation/motion-demo-intro.card.html", "brand-content-creation/motion-demo-transition.card.html"] },
  { id: "cc-lesson-scenes", title: "Lesson video scenes", lede: "Seventeen recording layouts on one 16:9 frame, each drawn in light and dark: sharing your screen, on camera, slides and code, and the four cards a lesson cuts to. No live badge, no ticker, no chat — a lesson is a file, not a moment.", body: LESSON_VIDEO_BODY, cards: [] },
  { id: "cc-livestream", title: "Live stream scenes", lede: "The 16:9 broadcast frame, in dark and light: one canvas, ten zones, eighteen prebuilt scenes and fifteen overlays. Where the camera, the shared screen, the live comments, the name plate, the asks and the notification toasts sit — and how long each one stays on screen.", body: LIVESTREAM_BODY, cards: [] },
  { id: "cc-thumbnails", title: "Thumbnails", lede: "Every thumbnail surface — course, lesson, blog, YouTube — from one style family, so a row of them reads as a series.", cards: ["brand-content-creation/thumbnails/15-thumbnail-styles.card.html", "brand-content-creation/course-thumbnail.card.html", "brand-content-creation/lesson-thumbnail.card.html", "brand-content-creation/blog/10-blog-thumbnail-styles.card.html", "brand-content-creation/youtube-thumbnail.card.html"] },
  { id: "cc-instagram", title: "Instagram", lede: "Post and story templates. Same tokens, same mono indices — the feed is the product's voice at 1080px.", cards: ["brand-content-creation/instagram-post.card.html", "brand-content-creation/instagram-story.card.html", "brand-content-creation/instagram/instagram-post-styles.card.html"] },
  { id: "cc-linkedin", title: "LinkedIn", lede: "The professional-feed variant: hook-first text posts and carousel PDFs cut from the same weekly asset as the Instagram carousel.", body: LINKEDIN_BODY, cards: [] },
  { id: "cc-youtube", title: "YouTube banner & logo", lede: "The channel's own furniture, as opposed to any one video's: the 2560\u00d71440 banner and the 1546\u00d7423 rectangle inside it that is the only part every device shows, the profile photo that has to survive being 24 pixels wide, the video watermark, and the playlist covers.", body: YOUTUBE_BODY, cards: [] },
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
  .side__find { margin-block: var(--space-3) var(--space-2); }
  .side__brand img { inline-size: 1.5rem; block-size: 1.5rem; }
  .side__brand a { color: inherit; text-decoration: none; }
  .side__ver { font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-muted); margin-block-end: var(--space-5); display: block; }
  .side__group { border: 0; }
  .side__group > summary { list-style: none; cursor: pointer; display: flex; align-items: center; }
  .side__group > summary::-webkit-details-marker { display: none; }
  .side__twist { margin-inline-start: auto; color: var(--color-label); transition: rotate var(--duration-fast) var(--ease-out); }
  .side__group[open] > summary .side__twist { rotate: 90deg; }
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
  .side__num { font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-label); margin-inline-end: var(--space-2); }

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
               font-size: var(--size-small); line-height: var(--leading-snug);
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
  .top p { color: var(--color-muted); max-inline-size: 46rem; margin-block-start: var(--space-2); font-size: var(--size-body); line-height: var(--leading-body); }
  .top .ns-btn { margin-inline-start: auto; flex: none; }
  .sec__num { font-family: var(--font-mono); font-size: var(--size-mono); font-weight: var(--weight-label);
              letter-spacing: var(--tracking-label); color: var(--color-label);
              margin-inline-end: var(--space-3); vertical-align: 0.2em; }
  .sub { font-family: var(--font-mono); font-size: var(--size-label); font-weight: var(--weight-label);
         letter-spacing: var(--tracking-label); text-transform: uppercase; color: var(--color-label);
         margin: var(--space-6) 0 var(--space-3); }
  .row { display: flex; gap: var(--space-3); flex-wrap: wrap; align-items: center; margin-block-end: var(--space-4); }

  /* Entrance: one quiet rise per page block, lightly staggered. The
     bundle's prefers-reduced-motion guard collapses it to nothing. */
  .colmain > *, main > .top, main > .ns-band, main > .ns-statband { animation: ns-anim-rise var(--duration-base) var(--ease-out) both; }
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
  .sw__name { display: block; padding: var(--space-2) var(--space-2-5) 0; font-family: var(--font-mono); font-size: var(--size-fine); }
  .sw__val { display: block; padding: 0 var(--space-2-5) var(--space-2); font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-muted); }
  .sw__val em { color: var(--color-brand-600); font-style: normal; }

  .tbl { inline-size: 100%; border-collapse: collapse; font-size: var(--size-body); }
  .tbl td { padding: var(--space-2) var(--space-3); border-block-end: 1px solid var(--color-border); vertical-align: middle; }
  .tbl code { font-family: var(--font-mono); font-size: var(--size-fine); }
  .tbl .num { font-family: var(--font-mono); font-size: var(--size-fine); color: var(--color-muted); white-space: nowrap; }
  .tbl .fill { inline-size: 55%; }
  .bar { display: block; block-size: 0.6rem; background: var(--color-brand-500); border-radius: 2px; }
  .flips { font-family: var(--font-mono); font-size: var(--size-label); color: var(--color-brand-600); }

  .spec { border: 1px solid var(--color-border); border-radius: var(--radius-card); margin-block-end: var(--space-5); overflow: hidden;
          transition: border-color var(--duration-fast) var(--ease-out); }
  .spec:hover { border-color: var(--color-brand-300); }
  .spec__head { display: flex; align-items: flex-start; gap: var(--space-4); padding: var(--space-3) var(--space-4);
                border-block-end: 1px solid var(--color-border); background: var(--color-surface-sunken); }
  .spec__head h2 { font-size: var(--size-body-lg); }
  .spec__head p { font-size: var(--size-body); color: var(--color-muted); margin-block-start: 2px; }
  .spec__src { margin-inline-start: auto; flex: none; font-family: var(--font-mono); font-size: var(--size-label);
               letter-spacing: var(--tracking-label); text-transform: uppercase; text-decoration: none; }
  .spec__frame { overflow: auto; background: var(--color-surface); }
  .spec__frame iframe { border: 0; display: block; block-size: 100%; }

  .cls { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(13rem,100%),1fr)); gap: var(--space-1) var(--space-4); }
  .cls code { font-family: var(--font-mono); font-size: var(--size-fine); color: var(--color-muted); }

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
  /* Chrome demos — a navbar is edge-to-edge or it is not a navbar. The bar is
     unstuck inside the demo box (it would otherwise pin itself to the top of
     the styleguide while its box scrolled away) and the corners are rounded
     to the frame so the demo still reads as one card. */
  /* A bar wider than the doc column scrolls rather than spilling over the
     rail — except when it carries a panel, which must be free to overhang. */
  .demo--flush { padding: 0; display: block; overflow-x: auto; }
  /* The rise entrance leaves an identity transform on every .colmain
     child, and that is a stacking context — so an open panel would be
     trapped under the next block. Lift the whole demo instead. */
  .demo--flush:has(.ns-navmenu, .ns-megamenu, .ns-usermenu__panel) {
    overflow: visible; position: relative; z-index: var(--z-raised);
  }
  /* Only one LIVE menu is ever open at a time, so the demo holding it takes
     the dropdown layer and its panel clears the demos that follow. Keyed on
     data-ns-menu so the held-open anatomy specimens do not also claim it. */
  .demo--flush:has([data-ns-menu][aria-expanded="true"]) { z-index: var(--z-dropdown); }
  .demo--flush > :first-child { border-start-start-radius: var(--radius-card); border-start-end-radius: var(--radius-card); }
  .demo--flush > :last-child { border-end-start-radius: var(--radius-card); border-end-end-radius: var(--radius-card); }
  .demo--flush .ns-topnav { position: static; }
  /* Phone-width demos really are an iframe: media queries answer to the
     VIEWPORT, so a narrow div would keep showing the desktop bar. */
  .demo--phone { padding: var(--space-6); justify-content: center; background: var(--color-surface-sunken); }
  .demo--phone iframe { inline-size: 24rem; max-inline-size: 100%; block-size: 34rem;
                        border: 1px solid var(--color-border); border-radius: var(--radius-card);
                        background: var(--color-surface); }
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
              font-family: var(--font-mono); font-size: var(--size-fine); line-height: 1.6; color: var(--color-ink); }
  .use-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(16rem,100%),1fr)); gap: var(--space-5); margin-block-end: var(--space-2); }
  .use-grid ul { margin: 0; padding-inline-start: var(--space-4); font-size: var(--size-body); line-height: var(--leading-body); color: var(--color-muted); }
  .use-grid li { margin-block-end: var(--space-1); }
  .use-grid .k-do { color: var(--color-success-ink); }
  .use-grid .k-dont { color: var(--color-error-ink); }
  .variant-note { font-size: var(--size-body); line-height: var(--leading-body); color: var(--color-muted); margin: calc(-1 * var(--space-2)) 0 var(--space-2); max-inline-size: 46rem; }

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
  /* Every section ships OPEN. assets/js/rail.js then collapses down to the one
     holding aria-current and scrolls it into view inside the rail. Built this
     way round so a JS failure leaves the nav long rather than unnavigable. */
  const section = (label, pages) => pages.length ? `<details class="side__group" open>
    <summary class="side__sep">${esc(label)}<i class="ph ph-caret-right side__twist" aria-hidden="true"></i></summary>
    ${pages.map(link).join("\n    ")}
  </details>` : "";
  const componentNav = FAMILIES
    .map((fam) => section(fam, PAGES.filter((p) => p.kind === "component" && p.family === fam)))
    .filter(Boolean).join("\n  ");
  const docNav = ["Charts", "Content creation"]
    .map((side) => section(side, PAGES.filter((p) => p.kind === "doc" && p.side === side)))
    .join("\n  ");
  return `<div class="side">
  <div class="side__brand"><img src="../assets/logo/favicon.svg" alt=""><strong><a href="./index.html">NS Design System</a></strong></div>
  <span class="side__ver">v${esc(pkg.version)} · ${all.length} tokens</span>
  <!-- Two different things, deliberately both here. The palette searches the
       whole site — pages, templates, component summaries and class names.
       The input under it only narrows THIS rail, needs no fetch, and is the
       faster tool when you already know roughly where you are going. -->
  <div class="side__find" data-ns-search></div>
  <input class="ns-input side__search" type="search" id="side-search" placeholder="Filter pages…" aria-label="Filter pages">
  <nav aria-label="Pages" data-ns-rail>
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
      ${/* Already-escaped: the label was cut out of the heading's HTML with only
            its tags stripped, so its entities are intact. Running esc() over it
            again turned every "&amp;" into "&amp;amp;" and printed a literal
            "&amp;" in the rail. */ ""}${items.map((it) => `<a href="#${it.id}">${it.label}</a>`).join("\n      ")}
    </nav>
  </aside>` : "";
  return { body, toc };
};

/* Where the built site lives. Every page carries a canonical URL pointing at
   it, so the same bundle served from a preview host or a branch deploy never
   competes with the real one in an index. Override with SITE_URL to publish
   the same build somewhere else. */
const SITE = (process.env.SITE_URL || "https://nsds.imswarnil.com").replace(/\/+$/, "");

/* A page's meta description: its lede, stripped of markup and clipped to the
   ~160 characters a search result actually shows, cut at a word boundary so
   it never ends mid-word. Falls back to naming the page, which is still a
   truthful description and better than an empty tag. */
const summary = (page) => {
  const raw = (page.lede || page.doc?.lede || page.comp?.lede || "")
    .replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  const text = raw || `${page.title} in NSDS — the design system behind Namaste Salesforce.`;
  if (text.length <= 160) return text;
  return `${text.slice(0, 157).replace(/\s+\S*$/, "")}…`;
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
<title>${esc(page.title)} — NSDS</title>
<meta name="description" content="${esc(summary(page))}">
<link rel="canonical" href="${SITE}/preview/${page.file}">
<meta property="og:type" content="article">
<meta property="og:site_name" content="NSDS — NS Design System">
<meta property="og:title" content="${esc(page.title)} — NSDS">
<meta property="og:description" content="${esc(summary(page))}">
<meta property="og:url" content="${SITE}/preview/${page.file}">
<meta property="og:image" content="${SITE}/assets/logo/icon-512.png">
<meta name="twitter:card" content="summary">
<link rel="icon" href="../assets/logo/favicon.svg">
<script>${THEME_INIT}</script>
<link rel="stylesheet" href="../dist/nsds.tailwind.css">
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
<script src="../assets/js/nav.js" defer></script>
<script src="../assets/js/search.js" defer></script>
<script src="../assets/js/code.js" defer></script>
<script src="../assets/js/type-fx.js" defer></script>
<script src="../assets/js/lms.js" defer></script>
<script src="../assets/js/rail.js" defer></script>
<script src="../assets/js/training.js" defer></script>
<script src="../assets/js/calendar.js" defer></script>
<script src="../assets/js/tabs.js" defer></script>
<script src="../assets/js/video.js" defer></script>
<script src="../assets/js/toc.js" defer></script>
<script src="../assets/js/ai.js" defer></script>
<script src="../assets/js/deck.js" defer></script>
</body>
</html>
`;
};

/* ---- render every page --------------------------------------------------
   The output directory is rebuilt from scratch so a renamed section cannot
   leave a stale orphan page behind. */
/* maxRetries: a recursive delete of a directory the dev server is actively
   serving intermittently fails on macOS (ENOTEMPTY/EBUSY) when a request is
   in flight — the build then dies with a bare exit code and no explanation,
   which reads like a code error and is not one. Node retries the unlink for
   us; three attempts 100ms apart has been enough every time. */
rmSync(OUT, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
mkdirSync(OUT, { recursive: true });

/* Declared above the page loop, not beside the demo writer: component pages
   read this to render their own "see it whole" link, so the list has to
   exist before the first page is written. */
const DEMOS = [
  /* The two lesson kinds LINK TO EACH OTHER: the prev/next controls in these
     two files point at the other demo, so the pair is walkable and the
     cross-document view transition (motion.css) is visible in place. */
  { out: "demo-player.html", tpl: "course-player.html", title: "Course player — full layout demo", back: "c-player.html", note: "curriculum · lesson · chapters — press next to cross-fade to the written lesson", lock: true, realHeader: { back: "Apex fundamentals", kicker: "Lesson 07 / 12", title: "SOQL joins: relationships in queries", pct: 50, done: "6 / 12" },
    links: { prev: "./demo-player-article.html", next: "./demo-player-article.html" } },
  { out: "demo-player-article.html", tpl: "course-player-article.html", title: "Course player, article lesson — full layout demo", back: "c-player.html", note: "the same three columns with no stage — press prev to cross-fade back to the video", lock: true, realHeader: { back: "Apex fundamentals", kicker: "Lesson 08 / 12", title: "What is Salesforce?", pct: 58, done: "7 / 12" },
    links: { prev: "./demo-player.html", next: "./demo-player.html" } },
  { out: "demo-admin-dashboard.html", tpl: "admin-dashboard.html", title: "Admin dashboard — full screen demo", back: "c-admin-shell.html", note: "shell + nav + stats + drafts" },
  /* The two editor surfaces are the CONTENT of an admin screen — in product
     they render inside the shell's <main>, so the demo wraps them in one.
     `interactive` layers on the demo-only wiring (add/reorder/remove
     lessons, tags, uploads, publish state) so the flows are testable with
     no backend — in product this behaviour comes from the React components. */
  { out: "demo-admin-course-new.html", tpl: "admin-course-new.html", title: "Create a course — full screen demo", back: "c-admin-shell.html", note: "interactive — build the curriculum, tag it, publish", wrap: "ns-admin__main", interactive: true },
  { out: "demo-admin-lesson-editor.html", tpl: "admin-lesson-editor.html", title: "Lesson editor — full screen demo", back: "c-admin-shell.html", note: "interactive — write, format, upload, publish", wrap: "ns-admin__main", interactive: true },
  { out: "demo-navbar.html", tpl: "navbar.html", title: "Site navbar — full width demo", back: "c-topnav.html", note: "open the menus; resize below 64rem for the hamburger and the sheet", extras: ["search-modal.html"] },
  { out: "demo-navbar-blog.html", tpl: "navbar-blog.html", title: "Blog navbar — full width demo", back: "c-topnav.html", note: "signed-in bar: account menu, reading progress on scroll", extras: ["search-modal.html"] },
  /* The player comes along because the bar's curriculum toggle targets
     aria-controls="player-rail", which lives in course-player.html. Rendered
     alone the button announces a relationship to nothing — same reason the
     navbars above pull in search-modal.html. */
  { out: "demo-training.html", tpl: "training-module.html", wrap: "ns-page ns-page--demo", title: "Training module — full page", back: "c-trainingnav.html", note: "the rail collapses to the active module on load and scrolls it into view; open the others freely" },
  { out: "demo-navbar-course.html", tpl: "navbar-course.html", title: "Course bar — full width demo", back: "c-coursenav.html", note: "the lesson player's chrome; resize below 48rem to watch it shed", extras: ["course-player.html"] },
  { out: "demo-navbar-dashboard.html", tpl: "navbar-dashboard.html", title: "Dashboard bar — full width demo", back: "c-coursenav.html", note: "signed-in app bar: continue menu, streak, notifications, account", extras: ["search-modal.html"] },
  { out: "demo-blog-post.html", tpl: "blog-post.html", title: "Blog post, no sidebar — full page", back: "c-post-layout.html", note: "share on the leading edge, outline on the trailing one. Scroll: the outline marks the section you are in, the hairline tracks the article" },
  /* The same post page at its three widths. They are one layout with the
     rails added and removed, and the demos exist side by side because the
     thing worth seeing is what does NOT change: the measure is identical in
     all three. */
  /* The light templates — small, self-contained pages anybody can preview
     and lift. Between them they use almost nothing that is not already on
     a product page: the point is that the same band grammar, the same
     cards and the same rails build a personal site, a docs page and a link
     page without a component being added for any of them. */
  { out: "demo-personal-site.html", tpl: "personal-site.html", title: "Personal site — full page", back: "c-shero.html", note: "a one-page personal site, built from the product homepage's own bands — ZERO new classes were needed for this page" },
  { out: "demo-docs.html", tpl: "docs.html", title: "Documentation page — full page", back: "c-post-layout.html", note: "nav | article | outline. The one shape that genuinely wants navigation on both sides: the left is what else exists, the right is what is on this page" },
  { out: "demo-links.html", tpl: "links.html", title: "Link page — full page", back: "c-button.html", note: "the one-link-in-a-bio page. Narrow on every screen, exactly one filled row, and the links are a real nav rather than cards" },
  { out: "demo-blog-post-sidebar.html", tpl: "blog-post-sidebar.html", title: "Blog post, sidebar — full page", back: "c-post-layout.html", note: "article + a real sidebar: related, courses, the training CTA, newsletter, categories, sponsor. The author is NOT in the rail — a bio belongs after the piece, not beside it" },
  { out: "demo-blog-listing.html", tpl: "blog-listing.html", title: "Blog index — full page", back: "c-blog-listing.html", note: "one featured post, a grid, and the category / archive / newsletter rail" },
  /* The tag pages are the index with its header swapped and its featured
     card dropped — which is the claim worth being able to check side by
     side, so they get their own demos rather than a note saying so. */
  { out: "demo-tag-page.html", tpl: "tag-page.html", title: "Tag page — full page", back: "c-tag-page.html", note: "the index with a tag header and no featured card; resize to watch the rail drop below the grid" },
  { out: "demo-tag-index.html", tpl: "tag-index.html", title: "All tags — full page", back: "c-tag-page.html", note: "sorted, equal weight, count on the right — deliberately not a tag cloud" },
  /* The same post, monetized. It carries EVERY ad format at once, which no
     real page should — it is a catalogue of placements, and the template says
     so at the top and names the three worth keeping. The slots start in
     `loading` and flip to `filled` after a beat, so the skeleton is visible
     instead of being gone before the page paints. */
  { out: "demo-blog-ads.html", tpl: "blog-post-ads.html", title: "Blog post with ads — full page", back: "c-adunit.html", note: "every placement in situ — watch the skeletons fill, scroll for the parallax, dismiss the anchor, open the interstitial" },
  { out: "demo-type-specimen.html", tpl: "type-specimen.html", title: "Type specimen — full page", back: "type.html", note: "the whole family in place: scale, weights, measure, effects" },
  { out: "demo-sections.html", tpl: "sections-home.html", title: "Page sections — full page demo", back: "c-hero-section.html", note: "the canonical marketing order — hero → logos → features → router → compare → stats → sample → scope → quote → fit → shipped → FAQ → CTA. The six middle bands each answer a question none of the others do" },
  /* The two landing pages. sections-home above is the generic band CATALOGUE;
     these are the product's own front doors, and the difference is the
     middle — both show the actual merchandise (path, courses, tracks, tiers)
     where the catalogue shows abstract feature copy. */
  { out: "demo-homepage.html", tpl: "homepage.html", title: "Learning-site homepage — full page demo", back: "homepage.html", note: "24 bands, each answering a question none of the others do — tall split hero → logos → router → showcase → path → courses → video → training → stats → sample → scope → compare → membership → the story → authors → voices → photo band → writing → shipped → fit → sponsors → newsletter → FAQ → CTA" },
  { out: "demo-training-index.html", tpl: "training-index.html", title: "Training index — full page demo", back: "homepage.html", note: "the curriculum's front door: hero + search → path → tracks → free vs Pro → pace → contributors → CTA" },
  /* The single-post reading page — the third training surface, after the
     index (orient) and the module page (list). `lock` because --fixed pins
     the layout to the viewport and both columns scroll inside it, exactly
     like the course player. training.js wires the rail filter and the
     below-lg drawer; resize under 64rem and use the Curriculum handle. */
  { out: "demo-training-post.html", tpl: "training-post.html", strip: "kind-article", title: "Training post, video — full page demo", back: "c-training-layout.html", note: "the post at full width, the curriculum beside it. Two levels — sections hold lessons. The outline is a disclosure in the article, so it survives a phone. Resize below 64rem for the drawer", lock: true },
  /* The SAME template with its stage cut. This is the article-based post, and
     rendering it from one file is the point: the claim "a training post is
     video or article, and the difference is one block" is either true of the
     markup or it is a sentence in a comment. */
  { out: "demo-training-article.html", tpl: "training-post.html", strip: ["stage", "kind-video"], title: "Training post, article — full page demo", back: "c-training-layout.html", note: "the same template with the video stage stripped — the article-based post, straight into the lede", lock: true },
  { out: "demo-course-detail.html", tpl: "course-detail.html", title: "Course detail — full page demo", back: "c-course-detail.html", note: "hero → description → curriculum + sticky rail" },
  { out: "demo-course-listing.html", tpl: "course-listing.html", title: "Course listing — full page demo", back: "c-course-listing.html", note: "live filters — the tags actually filter the grid" },
  /* The assistant. `lock` sets overflow:hidden on <html>: the shell is one
     locked viewport and the document behind it must not scroll too, exactly
     as the fixed course player does. The chat demo is interactive through
     assets/js/ai.js — send a question and a canned answer comes back with
     the real thinking, tool-chip, attachment and error states. */
  { out: "demo-ai-chat.html", tpl: "ai-chat.html", title: "AI assistant — full screen demo", back: "c-ai-shell.html", note: "interactive — ask something; every third answer fails on purpose", lock: true },
  { out: "demo-ai-signin.html", tpl: "ai-signin.html", title: "AI assistant, signed out — full screen demo", back: "c-ai-settings.html", note: "gate + empty state + disabled composer", lock: true },
  { out: "demo-ai-settings.html", tpl: "ai-settings.html", title: "AI assistant settings — full page demo", back: "c-ai-settings.html", note: "how it teaches, what it reads, what it remembers" },
  /* The deck. No `lock` — unlike the player, the deck locks the viewport from
     assets/js/deck.js, because its own toggle switches to the scrolling
     handout and a lock stamped into the page could not be undone. `bare`
     because a demo strip would be a second bar competing with the presenter
     bar the deck already ships; the docs link rides in the corner instead. */
  { out: "demo-deck.html", tpl: "deck.html", title: "Teaching deck — 25 reusable slides", back: "c-deck.html", note: "arrow keys, G for the overview, N for the notes, F for full screen", bare: true },
];

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
    /* THE WAY OUT TO THE REAL THING, derived rather than written. Every DEMOS
       entry already names the component page it belongs to (`back`), so the
       forward link is that relationship read the other way round — and it
       therefore exists on EVERY page that has a demo, not just the three
       where somebody remembered to hand-write one. Add a DEMOS entry and the
       link appears; delete it and the link goes. */
    const demos = DEMOS.filter((d) => d.back === page.file);
    inner = `
  ${demos.length ? `<p class="sub">See it whole</p>
  <p class="variant-note">The component below, rendered in place at full size from <code>templates/${esc(demos[0].tpl)}</code> — the same markup the two products adapt, with the real stylesheet and the real scripts.</p>
  <div class="row" style="margin-block-end:var(--space-6)">
    ${demos.map((d) => `<a class="ns-btn ns-btn--outline ns-btn--sm" href="./${d.out}" target="_blank" rel="noopener">${esc(d.title.replace(/ — .*$/, ""))} <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>`).join("\n    ")}
  </div>` : ""}
  ${(c.use || c.not) ? `<div class="use-grid">
    ${c.use ? `<div><p class="sub k-do">Use it for</p><ul>${list(c.use)}</ul></div>` : ""}
    ${c.not ? `<div><p class="sub k-dont">Not for</p><ul>${list(c.not)}</ul></div>` : ""}
  </div>` : ""}
  ${c.variants.map((v) => `
  <p class="sub">${esc(v.name)}</p>
  ${v.note ? `<p class="variant-note">${v.note}</p>` : ""}
  <div class="demo${v.dark ? " demo--dark" : ""}${v.flush ? " demo--flush" : ""}${v.phone ? " demo--phone" : ""}${v.stack ? " demo--stack" : ""}${/ns-(alert|toast|thread|tickets|auth__|accordion|field|fieldset|table-wrap|empty|band|builder|statband|features|faq|quote|rte|dropzone|publishbar|toolbar|pagehead|stat-grid|editor__rail|file|combobox|deflist|timeline|tree|banner|divider)/.test(v.html) ? " demo--stack" : ""}">
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

/* Read one templates/*.html fragment and make it renderable as part of a page
   here. Templates are written for a Ghost site served at ITS root, so
   /assets/logo/favicon.svg is correct where they ship and wrong here — this
   styleguide's pages live under /preview/, one directory deep. Rewriting at
   render time keeps the shipped fragment honest for its real consumer while
   the demo page still shows every image. Used for the main template AND its
   extras: a fragment pulled in as an extra needs exactly the same treatment,
   which is the bug that put a broken cover image on demo-navbar-course. */
const fragment = (name, strip) => {
  let src = readFileSync(join(ROOT, `templates/${name}`), "utf8")
    .replace(/<!--[\s\S]*?-->\n?/, "")                     // adaptation header
    .replace(/(\s(?:src|href|poster)=")\/assets\//g, "$1../assets/");
  /* An OPTIONAL region, cut by name. templates/training-post.html says a
     training post is video or article and that the difference is one block;
     `strip: "stage"` is how the styleguide renders the second version from
     the first template rather than shipping a near-duplicate of 250 lines
     that would immediately start drifting. The markers are HTML comments, so
     the template still reads as one file. */
  for (const region of [strip].flat().filter(Boolean)) {
    const re = new RegExp(`[ \\t]*<!--\\s*@strip:${region}\\s*-->[\\s\\S]*?<!--\\s*/@strip:${region}\\s*-->\\n?`, "g");
    const out = src.replace(re, "");
    if (out === src) throw new Error(`fragment("${name}"): no @strip:${region} region found`);
    src = out;
  }
  return src;
};

/* ---- the responsive proof ------------------------------------------------
   Every layout claim in this system is a claim about a viewport, and the only
   honest way to show one is at that viewport. Media queries answer to the
   VIEWPORT, so a narrow <div> would keep rendering the desktop layout at 380
   pixels wide and prove the opposite of what it looked like it was proving —
   which is why these are iframes of the real pages rather than scaled
   screenshots or resized boxes. */
const RESPONSIVE = [
  { w: 390, h: 720, label: "Phone · 390", note: "One column. The lesson first, the curriculum after it, the chapter list following the video, and the panel bar docked at the foot." },
  { w: 768, h: 720, label: "Tablet · 768", note: "Still one column — the three-column layout needs 64rem before the rails earn their width." },
  { w: 1180, h: 720, label: "Laptop · 1180", note: "Three columns: curriculum, lesson, chapters. The narrowest width the full layout runs at." },
];
writeFileSync(join(OUT, "demo-player-responsive.html"), `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Course player — responsive</title>
<link rel="icon" href="../assets/logo/favicon.svg">
<link rel="stylesheet" href="../dist/nsds.tailwind.css">
<style>
  body { padding: var(--space-8) var(--gutter) var(--space-16); }
  .rgrid { display: flex; gap: var(--space-8); align-items: flex-start; overflow-x: auto; padding-block-end: var(--space-4); }
  .rcol { flex: none; display: flex; flex-direction: column; gap: var(--space-3); }
  .rcol h2 { font-size: var(--size-small); font-weight: var(--weight-semibold); }
  .rcol p { font-size: var(--size-label); color: var(--color-muted); max-inline-size: 24rem; line-height: var(--leading-body); }
  .rframe { border: 1px solid var(--color-border); border-radius: var(--radius-card); overflow: hidden; background: var(--color-surface); }
  .rframe iframe { display: block; border: 0; }
</style>
</head>
<body>
<header style="margin-block-end:var(--space-8)">
  <p class="ns-kicker">Responsive</p>
  <h1 style="font-size:var(--size-h2);line-height:var(--leading-tight)">The course player at three widths</h1>
  <p style="color:var(--color-muted);max-inline-size:46rem;margin-block-start:var(--space-2)">The real pages in real iframes, because media queries answer to the viewport — a narrow div would keep rendering the desktop layout and prove the opposite of what it looked like it was proving. Scroll each frame; they are live.</p>
  <p style="margin-block-start:var(--space-4)"><a class="ns-btn ns-btn--outline ns-btn--sm" href="./c-player.html">&larr; back to docs</a></p>
</header>

${["demo-player.html", "demo-player-article.html"].map((src, i) => `
<section style="margin-block-end:var(--space-16)">
  <h2 style="font-size:var(--size-h3);margin-block-end:var(--space-5)">${i === 0 ? "Video lesson" : "Written lesson"}</h2>
  <div class="rgrid">
    ${RESPONSIVE.map((r) => `<div class="rcol" style="inline-size:${r.w}px;max-inline-size:100%">
      <h2>${r.label}</h2>
      <div class="rframe"><iframe src="./${src}" title="${esc(r.label)} — ${i === 0 ? "video" : "written"} lesson" width="${r.w}" height="${r.h}" loading="lazy"></iframe></div>
      <p>${r.note}</p>
    </div>`).join("\n    ")}
  </div>
</section>`).join("")}

<script>document.documentElement.setAttribute('data-theme', (function(){try{return localStorage.getItem('ns-theme')}catch(e){return null}})() || 'light');</script>
</body>
</html>
`);

/* ---- the ad ladder, at three widths --------------------------------------
   Same device as the player proof above, and for the ad slots it is not a
   nicety — it is the only way to show the thing the component actually
   claims. "One class, three sizes" is a claim about media queries, and media
   queries answer to the VIEWPORT: a 390px <div> would keep serving the 970px
   leaderboard and prove the exact opposite. These are iframes of the real
   monetized post, so what you see is what a reader at that width gets. */
const AD_RESPONSIVE = [
  { w: 390, h: 760, label: "Phone · 390", note: "The leaderboard serves 320&times;100 &mdash; the mobile unit, not a squeezed 728. The rail has collapsed into the content column, and <code>.ns-ad-rail</code> has taken the skyscraper out with it: ns-post <em>stacks</em> its rail rather than hiding it, so without that class this reader would meet 600 pixels of ad before the first paragraph. The anchor is pinned at the foot, serving 320&times;100, and the page reserves its clearance." },
  { w: 768, h: 760, label: "Tablet · 768", note: "The leaderboard and the anchor both step to 728&times;90, the size that fits a 768 viewport with the page gutters intact. Still one column, so the rail unit is still out. The phone-only 320-wide banners are hidden from here up." },
  { w: 1180, h: 760, label: "Laptop · 1180", note: "970&times;90 across the top, and past 64rem the rail becomes a real column so the 160&times;600 skyscraper comes back, sticky against the article. Three placements, one set of markup &mdash; nothing was duplicated to get here." },
];
writeFileSync(join(OUT, "demo-blog-ads-responsive.html"), `<!DOCTYPE html>
<html lang="en" data-theme="light">
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Ad units — responsive</title>
<link rel="icon" href="../assets/logo/favicon.svg">
<link rel="stylesheet" href="../dist/nsds.tailwind.css">
<style>
  body { padding: var(--space-8) var(--gutter) var(--space-16); }
  .rgrid { display: flex; gap: var(--space-8); align-items: flex-start; overflow-x: auto; padding-block-end: var(--space-4); }
  .rcol { flex: none; display: flex; flex-direction: column; gap: var(--space-3); }
  .rcol h2 { font-size: var(--size-small); font-weight: var(--weight-semibold); }
  .rcol p { font-size: var(--size-label); color: var(--color-muted); max-inline-size: 24rem; line-height: var(--leading-body); }
  .rframe { border: 1px solid var(--color-border); border-radius: var(--radius-card); overflow: hidden; background: var(--color-surface); }
  .rframe iframe { display: block; border: 0; }
</style>
</head>
<body>
<header style="margin-block-end:var(--space-8)">
  <p class="ns-kicker">Responsive</p>
  <h1 style="font-size:var(--size-h2);line-height:var(--leading-tight)">The ad ladder at three widths</h1>
  <p style="color:var(--color-muted);max-inline-size:46rem;margin-block-start:var(--space-2)">One slot in one place in the markup, three different creatives served. The frames below are the real monetized post at real viewport widths &mdash; media queries answer to the viewport, so a narrow div would keep serving the desktop unit and prove the opposite of what it looked like it was proving. Scroll each frame; they are live.</p>
  <p style="margin-block-start:var(--space-4)"><a class="ns-btn ns-btn--outline ns-btn--sm" href="./c-adunit.html">&larr; back to docs</a> <a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-blog-ads.html">open the full page &rarr;</a></p>
</header>

<section style="margin-block-end:var(--space-12)">
  <div class="rgrid">
    ${AD_RESPONSIVE.map((r) => `<div class="rcol" style="inline-size:${r.w}px;max-inline-size:100%">
      <h2>${r.label}</h2>
      <div class="rframe"><iframe src="./demo-blog-ads.html" title="${esc(r.label)} — monetized blog post" width="${r.w}" height="${r.h}" loading="lazy"></iframe></div>
      <p>${r.note}</p>
    </div>`).join("\n    ")}
  </div>
</section>

<section>
  <h2 style="font-size:var(--size-h3);margin-block-end:var(--space-4)">What each format serves, by width</h2>
  <div class="ns-table-wrap" tabindex="0">
    <table class="ns-table ns-table--compact ns-table--bordered ns-table--head-filled">
      <thead><tr>
        <th scope="col">Format</th>
        <th scope="col">Phone &lt; 48rem</th>
        <th scope="col">Tablet &ge; 48rem</th>
        <th scope="col">Desktop &ge; 64rem</th>
      </tr></thead>
      <tbody>
        <tr><th scope="row"><code>--leaderboard</code></th><td class="ns-table__code">320&times;100</td><td class="ns-table__code">728&times;90</td><td class="ns-table__code">970&times;90</td></tr>
        <tr><th scope="row"><code>--billboard</code></th><td class="ns-table__code">300&times;250</td><td class="ns-table__code">728&times;90</td><td class="ns-table__code">970&times;250</td></tr>
        <tr><th scope="row"><code>--square</code></th><td class="ns-table__code">250&times;250</td><td class="ns-table__code">300&times;250</td><td class="ns-table__code">300&times;250</td></tr>
        <tr><th scope="row"><code>--rectangle</code></th><td class="ns-table__code">300&times;250</td><td class="ns-table__code">300&times;250</td><td class="ns-table__code">300&times;250</td></tr>
        <tr><th scope="row"><code>--rectangle-lg</code></th><td class="ns-table__code">336&times;280</td><td class="ns-table__code">336&times;280</td><td class="ns-table__code">336&times;280</td></tr>
        <tr><th scope="row"><code>--halfpage</code></th><td class="ns-table__code">300&times;600</td><td class="ns-table__code">300&times;600</td><td class="ns-table__code">300&times;600</td></tr>
        <tr><th scope="row"><code>--skyscraper</code></th><td class="ns-table__code">160&times;600</td><td class="ns-table__code">160&times;600</td><td class="ns-table__code">160&times;600</td></tr>
        <tr><th scope="row"><code>--skyscraper-sm</code></th><td class="ns-table__code">120&times;600</td><td class="ns-table__code">120&times;600</td><td class="ns-table__code">120&times;600</td></tr>
        <tr><th scope="row"><code>--banner</code></th><td class="ns-table__code">320&times;50</td><td data-tone="neutral">hidden</td><td data-tone="neutral">hidden</td></tr>
        <tr><th scope="row"><code>--banner-lg</code></th><td class="ns-table__code">320&times;100</td><td data-tone="neutral">hidden</td><td data-tone="neutral">hidden</td></tr>
        <tr><th scope="row"><code>--article</code></th><td class="ns-table__code">fluid, min 250</td><td class="ns-table__code">fluid, min 250</td><td class="ns-table__code">fluid, min 250</td></tr>
        <tr><th scope="row"><code>--interstitial</code></th><td class="ns-table__code">336&times;280</td><td class="ns-table__code">336&times;280</td><td class="ns-table__code">300&times;600 if the viewport is &ge; 52rem tall</td></tr>
      </tbody>
    </table>
  </div>
  <p style="color:var(--color-muted);font-size:var(--size-small);margin-block-start:var(--space-3);max-inline-size:46rem">The fixed sizes are fixed on purpose: a 300&times;250 is 300&times;250 everywhere because that is the creative the ad server has. Only the four formats with a real alternate unit at another width step, and the interstitial steps on viewport <em>height</em> rather than width &mdash; a wide-but-short laptop cannot hold a 600px creative inside a dialog that is capped to the screen.</p>
</section>

<script>document.documentElement.setAttribute('data-theme', (function(){try{return localStorage.getItem('ns-theme')}catch(e){return null}})() || 'light');</script>
</body>
</html>
`);

/* The demo chrome. Most demos get the plain mono strip — they are fragments,
   and a fake product bar over a fragment is a lie about what you are looking
   at. The PLAYER demos get the real thing instead: .ns-coursenav, the bar this
   layout is designed to sit under, because the player's height is literally
   calc(100dvh - var(--navbar-h)) and a demo without a navbar is a demo of a
   layout that is one bar too tall. The docs link rides in its actions, where a
   product would put an account menu — the one concession, and it is a button
   rather than a fake feature. */
const realHeader = (d) => `<nav class="ns-coursenav" aria-label="Course">
  <a class="ns-coursenav__back" href="./${d.back}">
    <i class="ph ph-arrow-left" aria-hidden="true"></i>
    <span>${esc(d.realHeader.back)}</span>
  </a>
  <span class="ns-topnav__divider" aria-hidden="true"></span>
  <span class="ns-coursenav__id">
    <span class="ns-coursenav__title">${esc(d.realHeader.title)}</span>
  </span>
  <div class="ns-coursenav__progress">
    <div class="ns-coursenav__bar" role="progressbar" aria-label="Course progress"
         aria-valuenow="${d.realHeader.pct}" aria-valuemin="0" aria-valuemax="100" style="--p:${d.realHeader.pct}">
      <span></span>
    </div>
    <span class="ns-coursenav__pct">${esc(d.realHeader.done)}</span>
  </div>
  <div class="ns-coursenav__actions">
    <a class="ns-navicon ns-tooltip-host" href="./index.html" aria-label="Search the site">
      <i class="ph ph-magnifying-glass" aria-hidden="true"></i><span class="ns-tooltip ns-tooltip--below">Search</span>
    </a>
    <button type="button" class="ns-themeswitch" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
      <span class="ns-themeswitch__mark" aria-hidden="true"></span>
    </button>
    <div class="ns-usermenu">
      <button type="button" class="ns-usermenu__trigger" data-ns-menu aria-expanded="false" aria-controls="demo-account" aria-label="Account menu for Aarti Kulkarni">
        <span class="ns-avatar-ring" style="--p:${d.realHeader.pct}"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">AK</span></span>
      </button>
      <div class="ns-usermenu__panel" id="demo-account">
        <div class="ns-usermenu__head">
          <span class="ns-avatar" aria-hidden="true">AK</span>
          <span class="ns-usermenu__identity">
            <span class="ns-usermenu__fullname">Aarti Kulkarni</span>
            <span class="ns-usermenu__email">aarti@example.com</span>
          </span>
          <span class="ns-usermenu__plan">Pro</span>
        </div>
        <div class="ns-usermenu__progress">
          <span class="ns-usermenu__progress-label"><span>${esc(d.realHeader.back)}</span><span>${d.realHeader.pct}%</span></span>
          <progress class="ns-progress" value="${d.realHeader.pct}" max="100" aria-label="Course progress">${d.realHeader.pct}%</progress>
        </div>
        <hr class="ns-menu__sep">
        <a class="ns-menu__item" href="/account/"><i class="ph ph-user" aria-hidden="true"></i> Profile</a>
        <a class="ns-menu__item" href="/account/certificates/"><i class="ph ph-medal" aria-hidden="true"></i> Certificates</a>
        <hr class="ns-menu__sep">
        <a class="ns-menu__item" href="./${d.back}"><i class="ph ph-book-open-text" aria-hidden="true"></i> Back to the docs</a>
      </div>
    </div>
  </div>
</nav>`;

for (const d of DEMOS) {
  let body = fragment(d.tpl, d.strip);
  /* The templates ship #prev / #next: they are framework-agnostic markup and
     have no business knowing the name of a styleguide page. The DEMO is what
     knows, so the two lesson pages are wired to each other HERE — which is
     also what makes the cross-document view transition visible in place. */
  if (d.links) {
    if (d.links.prev) body = body.replace(/href="#prev"/g, `href="${d.links.prev}"`);
    if (d.links.next) body = body.replace(/href="#next"/g, `href="${d.links.next}"`);
  }
  /* <div>, not <main>, when the fragment already carries its own <main> —
     two mains in one document is invalid and makes the landmark useless. */
  if (d.wrap) {
    const tag = /<main[\s>]/.test(body) ? "div" : "main";
    body = `<${tag} class="${d.wrap}">\n${body}\n</${tag}>`;
  }
  /* Some bars carry a search affordance that opens the shared search dialog.
     The dialog is its own template — appending it here is what the consuming
     product does too, rather than each bar shipping a copy of it. */
  for (const extra of d.extras || []) {
    body += "\n" + fragment(extra);
  }
  if (d.interactive) body += `\n<script>${ADMIN_DEMO_JS}</script>`;
  writeFileSync(join(OUT, d.out), `<!DOCTYPE html>
<html lang="en" data-theme="light"${d.lock ? ' style="overflow:hidden"' : ""}>
<head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(d.title)}</title>
<link rel="icon" href="../assets/logo/favicon.svg">
<link rel="stylesheet" href="../dist/nsds.tailwind.css">
</head>
<body>
${d.realHeader ? realHeader(d) : d.bare ? `<a class="ns-btn ns-btn--quiet ns-btn--sm" href="./${d.back}" style="position:fixed;inset-block-start:var(--space-3);inset-inline-start:var(--space-3);z-index:var(--z-sticky)">&larr; back to docs</a>` : `<div class="flex items-center gap-row px-card py-inline border-b border-border font-mono text-label uppercase text-label-ink">templates/${esc(d.tpl)} — ${esc(d.note)}
  <a class="ns-btn ns-btn--outline ns-btn--sm ms-auto" href="./${d.back}">&larr; back to docs</a></div>`}
${body}
<script src="../assets/js/nav.js" defer></script>
<script src="../assets/js/search.js" defer></script>
<script src="../assets/js/code.js" defer></script>
<script src="../assets/js/type-fx.js" defer></script>
<script src="../assets/js/lms.js" defer></script>
<script src="../assets/js/rail.js" defer></script>
<script src="../assets/js/training.js" defer></script>
<script src="../assets/js/calendar.js" defer></script>
<script src="../assets/js/tabs.js" defer></script>
<script src="../assets/js/video.js" defer></script>
<script src="../assets/js/toc.js" defer></script>
<script src="../assets/js/ai.js" defer></script>
<script src="../assets/js/deck.js" defer></script>
<script>document.documentElement.setAttribute('data-theme', (function(){try{return localStorage.getItem('ns-theme')}catch(e){return null}})() || 'light');</script>
</body>
</html>
`);
}

/* A machine-readable index of everything that was generated. The deployable
   site build reads it to write the homepage's link list and sitemap.xml — so
   a new page appears in both the moment it appears here, and neither can be
   forgotten in a separate list. */
/* The full-page demos, listed separately from PAGES because they are not
   styleguide pages — they are the templates rendered whole, with no rail and
   no docs chrome. scripts/build-home.mjs reads this to build the homepage's
   "Demos" menu, so adding a DEMOS entry puts it in the site navigation with
   nothing else to remember. */
writeFileSync(join(OUT, "demos.json"), `${JSON.stringify(DEMOS.map((d) => ({
  file: d.out,
  title: d.title.replace(/ — .*$/, ""),
  note: d.note || "",
})), null, 2)}\n`);

writeFileSync(join(OUT, "pages.json"), `${JSON.stringify(PAGES.map((p) => ({
  file: p.file,
  title: p.title,
  num: p.num,
  kind: p.kind,
  group: p.family || p.side || null,
  summary: summary(p),
})), null, 2)}\n`);

/* Every .ns-* class a component's own demos render — used to make the search
   index answer "which page documents this class". */
const classesOf = (c) => {
  const seen = new Set();
  for (const v of c.variants ?? [])
    for (const m of (v.html ?? "").matchAll(/class="([^"]*)"/g))
      for (const cls of m[1].split(/\s+/)) if (cls.startsWith("ns-")) seen.add(cls);
  return [...seen];
};

/* ---- the search index ----------------------------------------------------
   One flat list covering everything a visitor could be looking for: the
   styleguide pages, the full-page templates, and every documented component
   INCLUDING the classes it defines — because "where is .ns-btn--ghost" is
   the question people actually arrive with, and a title-only index cannot
   answer it.

   Deliberately not a search engine. No stemming, no ranking model, no index
   format: a few hundred rows of {title, url, kind, keywords} that the client
   filters with `includes`. At this size that is instant, it needs no
   dependency, and it degrades to a plain list if the fetch fails. A design
   system that shipped a search bundle bigger than its stylesheet would have
   lost the plot. */
const searchRows = [
  ...PAGES.map((p) => ({
    t: p.title,
    u: p.file,
    k: p.kind === "component" ? (p.family || "Component") : p.kind === "section" ? "Foundation" : p.side || "Page",
    d: summary(p) || "",
    /* A component page carries its own class names, so searching for a
       class lands on the page that documents it. */
    x: p.comp ? (classesOf(p.comp) || []).join(" ") : "",
  })),
  /* The template's own filename goes in the keywords, because a page called
     "Link page" is what somebody searches for as "links" — and the file they
     are about to copy is links.html. Matching the artifact's name is more
     useful than matching the prose title. */
  ...DEMOS.map((d) => ({
    t: d.title.replace(/ — .*$/, ""),
    u: d.out,
    k: "Template",
    d: d.note || "",
    x: `template full page ${d.tpl} ${d.tpl.replace(/\.html$/, "").replace(/-/g, " ")}`,
  })),
];
writeFileSync(join(OUT, "search.json"), `${JSON.stringify(searchRows)}\n`);

console.log(`wrote preview/ — ${PAGES.length} pages (home + ${SECTIONS.length} sections + ${COMPONENTS.length} components + ${CHART_DOCS.length + CONTENT_DOCS.length} chart/content docs), ${all.length} tokens, ${cards.length} specimens embedded in place`);
