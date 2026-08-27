#!/usr/bin/env node
/* NS Design System — the icon pipeline.
   =========================================================================
   src/icons/<style>/<name>.svg  →  icons/nsds-icons.svg + icons/icons.json

   ADDING AN ICON IS DROPPING A FILE IN A FOLDER. That is the whole point of
   this script. Before it, the twenty bespoke glyphs lived inside one
   hand-maintained sprite file, which meant adding one was editing a 300-line
   XML document by hand and hoping the viewBox and stroke width matched its
   neighbours — so in practice nobody added one, and the last person who
   needed a glyph drew it somewhere else.

   THREE STYLES, ONE NAME. A style is a directory:

     src/icons/regular/   1.7px stroke, round caps — the workhorse
     src/icons/fill/      solid, for a selected/active state of the same icon
     src/icons/duotone/   a solid shape at low opacity under a stroke pass

   The same file name in two styles is the same icon, and the build checks
   that: a `fill/course.svg` with no `regular/course.svg` is a typo, not a
   new icon, and it fails rather than shipping a glyph nothing can fall back
   to.

   WHY A SPRITE AND NOT A FONT. An <svg><use> reference is a real image: it
   takes currentColor, it can carry two colours for duotone, it never renders
   as a missing-glyph box while a webfont loads, and a screen reader ignores
   it unless you give it a label. An icon font is glyphs in a text stream —
   it inherits font-size and colour, which is convenient, and it also
   inherits every font-loading failure mode and reads as a private-use
   character to anything that does not know better.

   The system already ships one icon font (a Phosphor subset, for the ~300
   utility glyphs) because subsetting somebody else's 700KB face is worth it.
   For OUR twenty, a 6KB sprite is smaller than any font we could build.
   `npm run build:icons -- --font` is there for when that trade changes.

   Run: node scripts/build-icons.mjs [--font] [--check] */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SRC = join(ROOT, "src/icons");
const STYLES = ["regular", "fill", "duotone"];
const CHECK = process.argv.includes("--check");

/* ---- read the source tree ---------------------------------------------- */
const icons = new Map();          // name → { style → { body, desc } }
for (const style of STYLES) {
  const dir = join(SRC, style);
  if (!existsSync(dir)) continue;
  for (const file of readdirSync(dir).sort()) {
    if (!file.endsWith(".svg")) continue;
    const name = file.replace(/\.svg$/, "");
    const raw = readFileSync(join(dir, file), "utf8");
    /* The header comment carries the description and, optionally, synonyms:

         <!-- certificate — the completion rosette
              keywords: award badge diploma -->

       Synonyms matter more than they look. A drawing's own description is
       written by whoever drew it, in their words — "the completion rosette"
       — and the person searching types the word they arrived with, which is
       "award". Without somewhere to put the second word, the icon is
       unfindable by anyone who did not name it. */
    const head = (raw.match(/<!--([\s\S]*?)-->/) || [])[1] ?? "";
    const keywords = (head.match(/keywords:\s*([^\n>]*)/i) || [])[1]?.trim() ?? "";
    const desc = (head.replace(/keywords:[^\n>]*/i, "").match(/[a-z0-9-]+\s*—\s*([\s\S]*)/) || [])[1]
      ?.replace(/\s+/g, " ").trim() ?? "";
    /* Everything between the <svg> tags. The wrapper's own attributes are
       dropped: the sprite's <symbol> carries them, so a source file with a
       stray width= cannot leak a fixed size into every use of the icon. */
    const body = (raw.match(/<svg[^>]*>([\s\S]*?)<\/svg>/) || [])[1]?.trim() ?? "";
    if (!body) throw new Error(`build-icons: ${style}/${file} has no drawable content`);
    if (!icons.has(name)) icons.set(name, {});
    icons.get(name)[style] = { body, desc, keywords };
  }
}
if (!icons.size) throw new Error("build-icons: src/icons is empty — the source tree moved, or the path is wrong");

/* Every icon must exist in `regular`: it is the fallback every other style
   degrades to, and a style-only icon is a name with no default. */
const orphans = [...icons].filter(([, s]) => !s.regular).map(([n]) => n);
if (orphans.length) {
  console.error(`build-icons: ${orphans.length} icon(s) with no regular style:\n`);
  for (const o of orphans) console.error(`  ${o} — add src/icons/regular/${o}.svg, or rename the variant`);
  process.exit(1);
}

/* ---- the sprite --------------------------------------------------------- */
const ATTRS = {
  regular: 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"',
  fill:    'fill="currentColor" stroke="none"',
  duotone: 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"',
};
const symbols = [];
for (const [name, styles] of [...icons].sort()) {
  for (const style of STYLES) {
    const icon = styles[style];
    if (!icon) continue;
    /* One id per style. `nsds-course` is the regular one — the common case
       gets the short name — and the variants are suffixed. */
    const id = style === "regular" ? `nsds-${name}` : `nsds-${name}-${style}`;
    symbols.push(
      `  <!-- ${name}${icon.desc ? ` · ${style} — ${icon.desc}` : ` · ${style}`} -->\n` +
      `  <symbol id="${id}" viewBox="0 0 24 24" ${ATTRS[style]}>\n    ${icon.body.replace(/\n\s*/g, "\n    ")}\n  </symbol>`
    );
  }
}
const sprite = `<svg xmlns="http://www.w3.org/2000/svg" style="display:none" aria-hidden="true">
  <!-- NS Design System — icon sprite.
       ==================================================================
       GENERATED by scripts/build-icons.mjs from src/icons/. Do not edit:
       add or change the SVG in src/icons/<style>/ and run \`npm run build\`.

       Use:  <svg class="ns-icon" aria-hidden="true">
               <use href="/icons/nsds-icons.svg#nsds-course"/>
             </svg>

       Sizing and colour come from .ns-icon — 1em square, currentColor, so an
       icon inherits like a letter. -->
${symbols.join("\n")}
</svg>
`;

/* ---- the manifest, for the searchable preview --------------------------- */
const manifest = [...icons].sort().map(([name, styles]) => ({
  name,
  styles: STYLES.filter((s) => styles[s]),
  desc: styles.regular.desc,
  /* Search terms. The name split on hyphens, plus the description, so
     "quiz" finds lesson-quiz and "certificate" finds it by its prose. */
  terms: [...new Set([
    name,
    ...name.split("-"),
    ...(styles.regular.desc || "").toLowerCase().split(/[^a-z0-9]+/),
    ...(styles.regular.keywords || "").toLowerCase().split(/[^a-z0-9]+/),
  ])].filter((t) => t.length > 1).join(" "),
}));

const outputs = [
  ["icons/nsds-icons.svg", sprite],
  ["icons/icons.json", JSON.stringify(manifest, null, 2) + "\n"],
];

let stale = [];
for (const [rel, content] of outputs) {
  const path = join(ROOT, rel);
  const current = existsSync(path) ? readFileSync(path, "utf8") : null;
  if (current === content) continue;
  if (CHECK) { stale.push(rel); continue; }
  writeFileSync(path, content);
}

if (CHECK) {
  if (stale.length) {
    console.error(`The icon sprite is stale — ${stale.length} file(s) differ:\n`);
    for (const f of stale) console.error(`  ${f}`);
    console.error("\nsrc/icons/ changed without regenerating. Run: node scripts/build-icons.mjs");
    process.exit(1);
  }
  console.log(`Icon sprite check passed — ${icons.size} icons, ${symbols.length} symbols current.`);
} else {
  const byStyle = STYLES.map((s) => `${manifest.filter((m) => m.styles.includes(s)).length} ${s}`).join(", ");
  console.log(`wrote icons/nsds-icons.svg — ${icons.size} icons (${byStyle}), ${symbols.length} symbols`);
}
