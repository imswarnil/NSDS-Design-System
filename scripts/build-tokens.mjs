#!/usr/bin/env node
/* NS Design System — token export build.
   =========================================================================
   The CSS files in tokens/ are the SOURCE OF TRUTH. Everything else — the
   JSON token file, the JS/TS module the Next.js app imports, the docs table —
   is generated from them by this script. That direction is deliberate: a
   hand-maintained JSON mirror of a CSS file drifts within a week, and then
   the Ghost theme and the Next app disagree about what --space-4 means.

   Run:  node scripts/build-tokens.mjs
   CI:   node scripts/build-tokens.mjs --check   (exits 1 if outputs are stale)

   Outputs:
     dist/tokens.json  — W3C DTCG-shaped token document (Figma, Style
                           Dictionary, any downstream tooling)
     tokens/tokens.js    — plain ESM export for the Next.js app
     tokens/tokens.d.ts  — types for the above
*/
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Order matters: later files may reference earlier ones, and this is also the
   order the docs table renders in. */
const SOURCES = [
  "src/tokens/colors.css",
  "src/tokens/dataviz.css",
  "src/tokens/spacing.css",
  "src/tokens/layout.css",
  "src/tokens/fonts.css",
  "src/tokens/typography.css",
  "src/tokens/effects.css",
];

/* Classify a token by name + value so downstream tools (Figma especially)
   know whether `--space-4` is a dimension or a string. The `@kind` trailing
   comment in effects.css wins over inference when present. */
function classify(name, value, kindHint) {
  if (kindHint) return kindHint;
  if (/^#|^rgb|^rgba|^color-mix|^oklch|^hsl/.test(value)) return "color";
  if (/^--color-|^--chart-(cat|seq|div)|^--ns-/.test(name)) return "color";
  if (/^--(space|pad|gap|stack|radius|container|gutter|breakpoint|target|navbar-h|sidebar-w|toc-w)/.test(name)) return "dimension";
  if (/^--z-/.test(name)) return "number";
  if (/^--font-/.test(name)) return "fontFamily";
  if (/^--weight-/.test(name)) return "fontWeight";
  if (/^--size-/.test(name)) return "dimension";
  if (/^--leading-|^--tracking-/.test(name)) return "number";
  if (/^--duration-/.test(name)) return "duration";
  if (/^--ease-/.test(name)) return "cubicBezier";
  if (/^--shadow-/.test(name)) return "shadow";
  if (/rem$|px$|em$|%$/.test(value)) return "dimension";
  return "other";
}

/* Extract custom properties from the :root block and the [data-theme="dark"]
   block separately — the dark values are an override layer, not new tokens. */
function parseBlocks(css, file) {
  const out = { light: [], dark: [] };
  /* A token may be REDECLARED inside a media query — --gutter steps up at 48rem
     and 64rem, which is correct responsive CSS. The exports must still describe
     the BASE value: tokens.js is a flat object, so a second entry silently
     overwrote the first (and emitted a duplicate key, which is invalid), and
     tokens.json ended up reporting --gutter as its desktop value.
     First declaration wins; the breakpoint variants are their own tokens
     (--gutter-md, --gutter-lg) and are exported on their own. */
  const already = { light: new Set(), dark: new Set() };
  // Match a selector plus its brace body, non-greedy, one nesting level deep
  // is all these token files use.
  const blockRe = /(:root|\[data-theme="dark"\])\s*\{([\s\S]*?)\n\}/g;
  let m;
  while ((m = blockRe.exec(css))) {
    const mode = m[1] === ":root" ? "light" : "dark";
    const body = m[2];
    const declRe = /^\s*(--[\w-]+)\s*:\s*([^;]+);(?:\s*\/\*\s*@kind\s+(\w+)\s*\*\/)?/gm;
    let d;
    while ((d = declRe.exec(body))) {
      const name = d[1];
      const value = d[2].trim();
      if (already[mode].has(name)) continue;
      already[mode].add(name);
      out[mode].push({ name, value, kind: classify(name, value, d[3]), definedIn: file });
    }
  }
  return out;
}

const light = [];
const dark = [];
for (const rel of SOURCES) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) { console.error(`missing source: ${rel}`); process.exit(2); }
  const parsed = parseBlocks(readFileSync(path, "utf8"), rel);
  light.push(...parsed.light);
  dark.push(...parsed.dark);
}

/* ---- tokens.json (DTCG-shaped) ------------------------------------------
   Grouped by the leading name segment so Figma/Style Dictionary see
   color.brand.500 rather than one flat 200-entry list. */
const groupOf = (name) => {
  const n = name.replace(/^--/, "");
  if (n.startsWith("chart-")) return ["chart", ...n.slice(6).split("-").slice(0, 1)];
  if (n.startsWith("color-")) return ["color", n.slice(6).split("-")[0]];
  if (n.startsWith("ns-")) return ["color", "semantic"];
  const head = n.split("-")[0];
  return [head];
};

const doc = { $schema: "https://design-tokens.org/schema.json", $description: "NS Design System design tokens — generated from tokens/*.css by scripts/build-tokens.mjs. Do not edit by hand.", light: {}, dark: {} };
for (const [mode, list] of [["light", light], ["dark", dark]]) {
  for (const t of list) {
    let node = doc[mode];
    for (const seg of groupOf(t.name)) node = (node[seg] ??= {});
    node[t.name.replace(/^--/, "")] = { $type: t.kind, $value: t.value, $extensions: { "ns.cssVar": t.name, "ns.definedIn": t.definedIn } };
  }
}

/* ---- tokens.js ----------------------------------------------------------
   Two shapes, because the Next.js app needs both: `cssVar` for writing
   `style={{ color: cssVar.colorBrand500 }}` (which stays theme-reactive and
   flips with dark mode automatically), and `value` for the rare case where
   JS needs the literal — chart libraries that cannot resolve a custom
   property, canvas rendering, meta theme-color. Prefer cssVar. */
const camel = (n) => n.replace(/^--/, "").replace(/-(\w)/g, (_, c) => c.toUpperCase());
const jsLines = [
  "/* GENERATED by scripts/build-tokens.mjs — do not edit. */",
  "",
  "/** Reference a token as a live CSS custom property. Prefer this: it flips",
  " *  with [data-theme=\"dark\"] automatically, where a literal value cannot. */",
  "export const cssVar = {",
  ...light.map((t) => `  ${camel(t.name)}: "var(${t.name})",`),
  "};",
  "",
  "/** Literal light-mode values. Use ONLY where a custom property cannot be",
  " *  resolved (canvas, <meta name=\"theme-color\">, some chart runtimes). */",
  "export const light = {",
  ...light.map((t) => `  ${camel(t.name)}: ${JSON.stringify(t.value)},`),
  "};",
  "",
  "/** Literal dark-mode overrides. Only tokens that actually change appear. */",
  "export const dark = {",
  ...dark.map((t) => `  ${camel(t.name)}: ${JSON.stringify(t.value)},`),
  "};",
  "",
  "/** Resolve a literal for a mode, falling back to the light value. */",
  "export function token(name, mode = \"light\") {",
  "  return (mode === \"dark\" && dark[name] !== undefined) ? dark[name] : light[name];",
  "}",
  "",
  "/** Ordered categorical chart slots. Assign 1→7 in order; never cycle. */",
  "export const chartCategorical = [",
  ...[1, 2, 3, 4, 5, 6, 7].map((i) => `  "var(--chart-cat-${i})",`),
  "];",
  "",
];

const dtsLines = [
  "/* GENERATED by scripts/build-tokens.mjs — do not edit. */",
  "export type TokenName =",
  ...light.map((t, i) => `  ${i === 0 ? "" : "| "}${JSON.stringify(camel(t.name))}`),
  "  ;",
  "export declare const cssVar: Record<TokenName, string>;",
  "export declare const light: Record<TokenName, string>;",
  "export declare const dark: Partial<Record<TokenName, string>>;",
  "export declare function token(name: TokenName, mode?: \"light\" | \"dark\"): string;",
  "export declare const chartCategorical: string[];",
  "",
];

/* ---- tokens/tailwind.css ------------------------------------------------
   The bridge that makes `bg-brand-500` in the Ghost theme and `bg-brand-500`
   in the Next.js app mean the same thing.

   Two subtleties this generator exists to get right:

   1. SELF-REFERENCE. Tailwind's `@theme` DECLARES the variable it names, so
      writing `--color-brand-500: var(--color-brand-500)` is a cycle, not an
      alias. Anything Tailwind owns the name of must therefore be emitted as
      a literal — which is only safe because this file is generated and CI
      re-checks it (`--check`), so it cannot silently drift from colors.css.

   2. DARK MODE. A literal would freeze `bg-surface` to #ffffff and kill dark
      mode. So every token that has a [data-theme="dark"] override is emitted
      as `var(--ns-…)` under `@theme inline` instead, which re-resolves at
      render time. The DARK_SOURCED map below is exactly that set, and it is
      derived from the parsed dark block rather than typed by hand. */
const byName = (list) => Object.fromEntries(list.map((t) => [t.name, t.value]));
const lightMap = byName(light);
const darkNames = new Set(dark.map((t) => t.name));

/* Public Tailwind name → the private --ns-* / --chart-* source it should
   follow. Present only for tokens that actually flip between modes. */
const themed = {};
for (const [tw, src] of [
  ["--color-surface", "--ns-surface"], ["--color-surface-raised", "--ns-surface-raised"],
  ["--color-surface-sunken", "--ns-surface-sunken"], ["--color-border", "--ns-border"],
  ["--color-ink", "--ns-ink"], ["--color-muted", "--ns-muted"],
  /* label-ink, not label. Tailwind resolves `text-*` against BOTH --text-*
     and --color-*, and the colour wins — so while this was called
     --color-label, `text-label` silently produced the label COLOUR instead of
     the label TYPE, and the kicker arrived without its tracking or weight.
     That is precisely the half-applied kicker the --text-label token exists to
     prevent. The -ink suffix is this file's own convention for "the text
     colour of X" (see --color-success-ink et al), so this reads the same way.
     The CSS custom property --color-label in tokens/colors.css is unchanged;
     only the Tailwind alias moves. */
  ["--color-label-ink", "--ns-label"], ["--color-grid", "--ns-grid"],
  ["--color-success-ink", "--ns-success-ink"], ["--color-warning-ink", "--ns-warning-ink"],
  ["--color-error-ink", "--ns-error-ink"], ["--color-info-ink", "--ns-info-ink"],
  ["--color-chart-1", "--chart-cat-1"], ["--color-chart-2", "--chart-cat-2"],
  ["--color-chart-3", "--chart-cat-3"], ["--color-chart-4", "--chart-cat-4"],
  ["--color-chart-5", "--chart-cat-5"], ["--color-chart-6", "--chart-cat-6"],
  ["--color-chart-7", "--chart-cat-7"],
]) {
  if (!darkNames.has(src)) {
    console.error(`bridge: ${src} has no dark override — remove it from the themed map or add the override`);
    process.exit(2);
  }
  themed[tw] = src;
}

/* Static tokens: emitted as literals resolved from the light block. */
const lit = (name) => {
  const v = lightMap[name];
  if (v === undefined) { console.error(`bridge: unknown token ${name}`); process.exit(2); }
  if (darkNames.has(name)) { console.error(`bridge: ${name} flips in dark mode but is emitted as a literal — move it to the themed map`); process.exit(2); }
  return v;
};

const twLines = [
  "/* GENERATED by scripts/build-tokens.mjs — do not edit.",
  "   ========================================================================",
  "   Tailwind v4 bridge. Import in BOTH the Ghost theme and the Next.js LMS:",
  "",
  '     @import "tailwindcss";',
  '     @import ".../styles.css";              (tokens + base layer)',
  '     @import ".../tokens/tailwind.css";     (this file)',
  "",
  "   After that bg-brand-500, p-card, rounded-card, text-label, z-dropdown",
  "   and max-w-page exist in both products and resolve to identical values.",
  "",
  "   Tokens that flip under [data-theme=\"dark\"] are emitted inside",
  "   `@theme inline` as var(--ns-*) so the utility re-resolves per theme;",
  "   static tokens are emitted as literals because Tailwind declares the",
  "   variable it names and a self-reference would be a cycle. Run",
  "   `node scripts/build-tokens.mjs --check` in CI to prove this file still",
  "   matches the token CSS files. */",
  "",
  "@theme inline {",
  "  /* Theme-reactive — follow the private --ns-* / --chart-* source. */",
  ...Object.entries(themed).map(([tw, src]) => `  ${tw}: var(${src});`),
  "}",
  "",
  "@theme {",
  "  /* Static — literals, regenerated from the token CSS files. */",
  ...[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map((s) => `  --color-brand-${s}: ${lit(`--ns-brand-${s}`)};`),
  "",
  "  /* Status dot/border/icon hues. For status TEXT use -ink (above). */",
  `  --color-success: ${lit("--color-success")};`,
  `  --color-warning: ${lit("--color-warning")};`,
  `  --color-error: ${lit("--color-error")};`,
  "",
  "  /* Tailwind derives its entire numeric spacing scale from this one value,",
  "     so p-4 === 4 x 0.25rem === --space-4. That equality is why the two",
  "     products agree on spacing; never change it on one side only. */",
  "  --spacing: 0.25rem;",
  "",
  "  /* Semantic spacing: p-card, gap-grid, gap-field, space-y-section. */",
  `  --spacing-card: ${lit("--pad-card")};`,
  `  --spacing-card-lg: ${lit("--pad-card-lg")};`,
  `  --spacing-row: ${lit("--pad-row")};`,
  `  --spacing-inline: ${lit("--gap-inline")};`,
  `  --spacing-grid: ${lit("--gap-grid")};`,
  `  --spacing-field: ${lit("--gap-field")};`,
  `  --spacing-section: ${lit("--stack-lg")};`,
  `  --spacing-band: ${lit("--stack-xl")};`,
  "",
  `  --font-sans: ${lit("--ns-font-sans")};`,
  `  --font-heading: ${lit("--ns-font-heading")};`,
  `  --font-mono: ${lit("--ns-font-mono")};`,
  /* The editorial voice. Fallback-only by design — see tokens/typography.css. */
  `  --font-serif: ${lit("--ns-font-serif")};`,
  "",
  "  /* text-label carries its tracking and weight so a kicker cannot be",
  "     half-applied — Principle 2 depends on it always arriving whole. */",
  `  --text-display: ${lit("--size-display")};`,
  `  --text-display--line-height: ${lit("--ns-leading-tight")};`,
  `  --text-h1: ${lit("--size-h1")};`,
  `  --text-h1--line-height: ${lit("--ns-leading-tight")};`,
  `  --text-h2: ${lit("--size-h2")};`,
  `  --text-h2--line-height: ${lit("--ns-leading-heading")};`,
  `  --text-h3: ${lit("--size-h3")};`,
  `  --text-h3--line-height: ${lit("--ns-leading-heading")};`,
  `  --text-h4: ${lit("--size-h4")};`,
  `  --text-h4--line-height: ${lit("--ns-leading-heading")};`,
  `  --text-body-lg: ${lit("--size-body-lg")};`,
  `  --text-body-lg--line-height: ${lit("--ns-leading-body")};`,
  `  --text-body: ${lit("--size-body")};`,
  `  --text-body--line-height: ${lit("--ns-leading-body")};`,
  /* The reading scale. Separate from body because they fork on the axis that
     matters — scanned versus read — and a utility that silently gave an
     article the app's size would defeat the point of forking them. */
  `  --text-prose: ${lit("--size-prose")};`,
  `  --text-prose--line-height: ${lit("--ns-leading-prose")};`,
  `  --text-prose-lead: ${lit("--size-prose-lead")};`,
  `  --text-prose-lead--line-height: ${lit("--ns-leading-heading")};`,
  `  --text-prose-small: ${lit("--size-prose-small")};`,
  `  --text-prose-small--line-height: ${lit("--ns-leading-body")};`,
  `  --text-small: ${lit("--size-small")};`,
  `  --text-small--line-height: ${lit("--ns-leading-body")};`,
  `  --text-mono: ${lit("--size-mono")};`,
  /* fine is the caption/legal size, and it is NOT text-label: label carries
     the kicker's 700 weight and 0.09em tracking, so using it for a footnote
     shouts. Its absence from this bridge is why the styleguide had 86
     hand-written `text-[11px]`. */
  `  --text-fine: ${lit("--size-fine")};`,
  `  --text-fine--line-height: ${lit("--ns-leading-body")};`,
  /* Poster scale. Fluid, capped against the viewport, and it sets solid — so
     its leading and tracking travel with it or it is not the mega size. */
  `  --text-mega: ${lit("--size-mega")};`,
  `  --text-mega--line-height: ${lit("--ns-leading-mega")};`,
  `  --text-mega--letter-spacing: ${lit("--ns-tracking-mega")};`,
  `  --text-label: ${lit("--size-label")};`,
  "  --text-label--line-height: 1;",
  `  --text-label--letter-spacing: ${lit("--ns-tracking-label")};`,
  `  --text-label--font-weight: ${lit("--weight-label")};`,
  /* Same 11px as text-label, deliberately WITHOUT the weight and tracking.
     Two roles share one size and they are not interchangeable: a kicker is a
     shouted eyebrow and must arrive whole (Principle 2), while mono DATA — a
     token name, a value, a count, a timestamp — is quiet by definition and
     reads wrong bold and tracked. The component layer has always used
     var(--size-label) plainly for exactly this (.ns-tag, .ns-badge,
     .ns-footer__head); only the bridge forced the two together, which is why
     the styleguide had 117 hand-written `text-[11px]`. */
  `  --text-data: ${lit("--size-label")};`,
  "  --text-data--line-height: 1.4;",
  "",
  /* 400 is the READING weight — Switzer's Regular is properly fitted and does
     not render grey, which is why the 450 ("Book") step the previous cut
     needed did not survive the font migration. See fonts/README.md § "Why
     body copy is 400". Bridged because it was unreachable as a utility, which
     meant any component built in Tailwind fell back to Preflight's own value. */
  `  --font-weight-body: ${lit("--weight-body")};`,
  `  --font-weight-body-strong: ${lit("--weight-body-strong")};`,
  `  --font-weight-label: ${lit("--weight-label")};`,
  `  --font-weight-regular: ${lit("--weight-regular")};`,
  `  --font-weight-medium: ${lit("--weight-medium")};`,
  `  --font-weight-semibold: ${lit("--weight-semibold")};`,
  `  --font-weight-heading: ${lit("--weight-heading")};`,
  `  --leading-tight: ${lit("--ns-leading-tight")};`,
  `  --leading-heading: ${lit("--ns-leading-heading")};`,
  `  --leading-snug: ${lit("--ns-leading-snug")};`,
  `  --leading-body: ${lit("--ns-leading-body")};`,
  `  --leading-prose: ${lit("--ns-leading-prose")};`,
  `  --leading-mega: ${lit("--ns-leading-mega")};`,
  /* The whole tracking scale. Only --label was bridged, so every other
     tracked run in the styleguide was an arbitrary value — tracking-[.06em],
     [.05em], [.08em] — i.e. three undocumented near-duplicates of one token. */
  `  --tracking-tight: ${lit("--ns-tracking-tight")};`,
  `  --tracking-wide: ${lit("--ns-tracking-wide")};`,
  `  --tracking-mega: ${lit("--ns-tracking-mega")};`,
  `  --tracking-label: ${lit("--ns-tracking-label")};`,
  "",
  "  /* Only these four radii exist. Tailwind's rounded-lg / -xl / -2xl are",
  "     deliberately left undefined so reaching for one is a build error",
  "     rather than a quiet violation of Principle 4. */",
  `  --radius-sm: ${lit("--ns-radius-sm")};`,
  `  --radius-btn: ${lit("--ns-radius-btn")};`,
  `  --radius-card: ${lit("--ns-radius-card")};`,
  `  --radius-pill: ${lit("--ns-radius-pill")};`,
  "",
  `  --shadow-card: ${lit("--ns-shadow-card")};`,
  `  --shadow-raised: ${lit("--ns-shadow-raised")};`,
  /* Both are RINGS, not drop shadows — Principle 1, the hairline is the
     structure. shadow-brand is the selected-card edge, shadow-focus the
     focus halo. Named shadow-* because that is the property they set. */
  `  --shadow-brand: ${lit("--shadow-brand")};`,
  `  --shadow-focus: ${lit("--shadow-focus")};`,
  "",
  `  --breakpoint-sm: ${lit("--breakpoint-sm")};`,
  `  --breakpoint-md: ${lit("--breakpoint-md")};`,
  `  --breakpoint-lg: ${lit("--breakpoint-lg")};`,
  `  --breakpoint-xl: ${lit("--breakpoint-xl")};`,
  `  --breakpoint-2xl: ${lit("--breakpoint-2xl")};`,
  "",
  `  --container-prose: ${lit("--container-prose")};`,
  `  --container-narrow: ${lit("--container-narrow")};`,
  `  --container-page: ${lit("--container-page")};`,
  `  --container-wide: ${lit("--container-wide")};`,
  "",
  "  /* One curve only. ease-in / ease-in-out are intentionally absent —",
  "     Principle 5 allows no springy or decelerating alternative. */",
  `  --ease-out: ${lit("--ns-ease-out")};`,
  /* Both name keyframes defined in src/css/motion.css, not in tokens/ —
     a keyframe is not a value, and an unprefixed one is a global name a
     consuming app can collide with. `animate-fade-up` keeps its utility name
     (renaming it would break consumers) but now resolves to the canonical
     ns-anim-rise, which is the same gesture .ns-anim--rise applies. */
  "  --animate-fade-up: ns-anim-rise var(--duration-base) var(--ease-out) both;",
  "  --animate-float: ns-float 6s var(--ease-out) infinite;",
  "}",
  "",
  "/* Tailwind v4 has no z-index theme namespace, so the elevation order ships",
  "   as explicit utilities. Same six layers as tokens/layout.css. */",
  "@utility z-base     { z-index: var(--z-base); }",
  "@utility z-raised   { z-index: var(--z-raised); }",
  "@utility z-sticky   { z-index: var(--z-sticky); }",
  "@utility z-dropdown { z-index: var(--z-dropdown); }",
  "@utility z-overlay  { z-index: var(--z-overlay); }",
  "@utility z-toast    { z-index: var(--z-toast); }",
  "",
  "/* \"Centered, gutter-padded, max-width-page\" appears on nearly every",
  "   template in both products and deserves exactly one definition. */",
  "@utility container-page {",
  "  width: 100%;",
  "  max-width: var(--container-page);",
  "  margin-inline: auto;",
  "  padding-inline: var(--gutter);",
  "}",
  "",
  "/* Both products drive dark mode from [data-theme=\"dark\"] on <html>, not",
  "   Tailwind's default .dark class — so dark: must watch the same attribute",
  "   the tokens listen to, or utilities and tokens disagree. */",
  '@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));',
  "",
];

/* ---- namespace collision guard ------------------------------------------
   Tailwind resolves `text-<name>` against BOTH --text-* (font-size, with its
   --line-height / --letter-spacing / --font-weight companions) and --color-*
   (colour). If the same suffix exists in both, one silently shadows the other
   and the utility does something other than what the token name promises —
   `text-label` gave the label colour and dropped the kicker's tracking and
   weight for as long as --color-label existed.

   Nothing about that fails visibly: the class applies, the page renders, and
   the type is just wrong. So the bridge refuses to emit an ambiguous pair.
   The fix is always to rename the COLOUR with the -ink suffix this file
   already uses for "the text colour of X". */
{
  const suffixes = (prefix) => new Set(
    twLines.flatMap((l) => {
      const m = l.match(new RegExp(`^\\s*--${prefix}-([a-z0-9-]+):`));
      // --text-label--line-height etc. are companions, not separate tokens.
      return m && !m[1].includes("--") ? [m[1]] : [];
    }),
  );
  const colors = suffixes("color");
  const clash = [...suffixes("text")].filter((s) => colors.has(s));
  if (clash.length) {
    for (const c of clash) {
      console.error(`bridge: --text-${c} and --color-${c} both exist — \`text-${c}\` is ambiguous and the colour wins,`);
      console.error(`        so the type token (size, tracking, weight) is silently dropped.`);
      console.error(`        Rename the colour to --color-${c}-ink in the themed map / literal block above.`);
    }
    process.exit(2);
  }
}

/* ---- bridge completeness guard -------------------------------------------
   Every token in the CSS must be reachable as a Tailwind utility.

   This is not pedantry. A token with no utility does not stop anyone using
   the value — it makes them write an arbitrary value instead, and an
   arbitrary value is a token nobody can find, audit or change. The styleguide
   accumulated 86 `text-[11px]` (that is --size-fine), 23 hand-tuned
   `tracking-[…]` (three near-duplicates of --tracking-wide) and a body weight
   that could not be reached at all, purely because those tokens were defined
   in CSS and never bridged.

   `--weight-body: 450` is the sharpest case: 450 (Book) is the reading
   weight, and without `font-body` every component authored in Tailwind
   rendered body copy a half-step light with nothing to show for it in review.

   If this fails, add the emit line above — do not add the token to the
   exemption list unless it genuinely has no utility form. */
{
  const NAMESPACE = { size: "text", tracking: "tracking", leading: "leading", weight: "font-weight", shadow: "shadow", font: "font" };
  /* --font-icon / --font-icon-fill name the icon @font-face that ::before
     glyphs are drawn in. A `font-icon` text utility would only ever be a
     mistake, so they are the one font pair that stays out of the bridge. */
  const NO_UTILITY = new Set(["--font-icon", "--font-icon-fill"]);
  /* Legitimately un-bridgeable: --shadow-card/-raised are already emitted;
     these are the private --ns-* sources, which are never public names. */
  const EXEMPT = /^--ns-|^--chart-|^--color-/;
  const twText = twLines.join("\n");
  const missing = [];
  for (const t of light) {
    if (EXEMPT.test(t.name) || NO_UTILITY.has(t.name)) continue;
    const [, head, tail] = t.name.match(/^--([a-z]+)-(.+)$/) || [];
    const ns = NAMESPACE[head];
    if (!ns || !tail) continue;
    if (!new RegExp(`^\\s*--${ns}-${tail}\\s*:`, "m").test(twText)) missing.push([t.name, `--${ns}-${tail}`]);
  }
  if (missing.length) {
    console.error("bridge: these tokens exist in tokens/*.css but have no Tailwind utility,");
    console.error("        so anyone needing the value has to write an arbitrary one instead:\n");
    for (const [css, want] of missing) console.error(`          ${css.padEnd(24)} → emit ${want}`);
    process.exit(2);
  }
}

/* AUTHORED LIVES IN src/, GENERATED LIVES IN dist/ — with one deliberate
   exception. The three consumer artifacts (a DTCG document for Figma, an ESM
   object for the app, and its types) are build output and go to dist/, which
   is where a consumer of the package looks for them.

   src/tokens/tailwind.css does NOT, and the reason is that it is not a
   consumer artifact at all: it is a link in the SOURCE graph, @imported by
   src/tailwind.css so Tailwind's @theme can see the token names. Writing it
   to dist/ would make a source file import a build output, which is a worse
   wart than a generated file sitting beside the authored ones that produce
   it. It carries a do-not-edit header for the same reason. */
const outputs = [
  ["dist/tokens.json", JSON.stringify(doc, null, 2) + "\n"],
  ["dist/tokens.js", jsLines.join("\n")],
  ["dist/tokens.d.ts", dtsLines.join("\n")],
  ["src/tokens/tailwind.css", twLines.join("\n")],
];

const check = process.argv.includes("--check");
let stale = false;
for (const [rel, content] of outputs) {
  const path = join(ROOT, rel);
  const current = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (current === content) continue;
  if (check) { console.error(`STALE: ${rel} — run \`node scripts/build-tokens.mjs\``); stale = true; continue; }
  writeFileSync(path, content);
  console.log(`wrote ${rel}`);
}
if (check && stale) process.exit(1);
if (check) console.log(`token exports up to date (${light.length} tokens, ${dark.length} dark overrides)`);
