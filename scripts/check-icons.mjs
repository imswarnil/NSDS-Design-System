#!/usr/bin/env node
/* NS Design System — icon subset check.
   =========================================================================
   icons/phosphor.css is a SUBSET: only the glyphs the theme uses are in the
   woff2, which is why it is 20KB rather than 700. The cost of that is a
   failure mode with no symptom in any other check — a `ph-` class the subset
   does not carry renders as NOTHING. Not a fallback glyph, not a box: an
   empty inline element the width of a space.

   That is how a "Collapse curriculum" button shipped as an invisible control,
   and nothing in the build said a word about it: check-markup only looks at
   .ns-* classes, and the CSS, the ARIA and the layout were all correct.

   So this walks every ph-* reference in the markup and the components and
   checks it against the glyphs the stylesheet actually defines.

   IT FAILS THE BUILD. It did not always: the repo inherited 37 of these and
   the subsetter named in the generated header was missing, so failing on debt
   nobody could fix would just have got the check deleted. scripts/subset-icons.py
   is now in the tree and the list is at zero, so this is a real gate again.
   Add a ph-* class, run `python3 scripts/subset-icons.py`, commit the
   regenerated icons/.

   `--list` prints the referenced glyph names, one per line, and exits 0. That
   is how subset-icons.py decides what to keep: the gate and the generator read
   "what is used" from exactly one implementation.

   Run: node scripts/check-icons.mjs */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXIT_ON_MISSING = true;
const LIST_ONLY = process.argv.includes("--list");

/* Weight modifiers, not glyphs — `.ph-fill` selects the filled face the same
   way `.ph` selects the regular one. */
const WEIGHTS = new Set(["ph-fill", "ph-bold", "ph-thin", "ph-light", "ph-duotone"]);

const css = readFileSync(join(ROOT, "icons/phosphor.css"), "utf8");
/* The rules are `.ph.ph-name:before` / `.ph-fill.ph-name:before`; the name we
   want is the SECOND class, not the first. */
const defined = new Set([...css.matchAll(/\.ph(?:-fill)?\.(ph-[a-z0-9-]+):before/g)].map((m) => m[1]));

const walk = (dir) => {
  let out = [];
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (["node_modules", "dist", "preview", "_site", ".git", "icons"].includes(e.name)) continue;
    if (e.isDirectory()) out = out.concat(walk(join(dir, e.name)));
    else if (/\.(html|jsx|mjs)$/.test(e.name)) out.push(join(dir, e.name));
  }
  return out;
};

/* This file documents the `.ph.ph-name` selector shape in its own header and
   prints glyph names in its own error text, so scanning itself reports
   placeholders as missing icons. */
const SELF = "check-icons.mjs";

const used = new Map();
for (const file of walk(".")) {
  if (file.endsWith(SELF)) continue;
  const src = readFileSync(join(ROOT, file), "utf8");
  /* The lookbehind is the whole trick: `ns-ph--sm` is a SIZE MODIFIER on the
     .ns-ph placeholder, not an icon called `ph--sm`. Requiring that nothing
     word-ish or hyphen-ish precedes `ph-` keeps the report to real glyph
     names — every genuine reference is either its own class (`class="ph
     ph-x"`) or its own string (`icon: "ph-x"`), so it always starts clean. */
  for (const m of src.matchAll(/(?<![\w-])ph-[a-z0-9-]+/g)) {
    const name = m[0];
    if (WEIGHTS.has(name)) continue;
    if (!used.has(name)) used.set(name, new Set());
    used.get(name).add(file);
  }
}

if (LIST_ONLY) {
  console.log([...used.keys()].sort().join("\n"));
  process.exit(0);
}

const missing = [...used].filter(([name]) => !defined.has(name)).sort();

if (!missing.length) {
  console.log(`Icon check passed — ${used.size} glyph(s) referenced, all present in the subset.`);
  process.exit(0);
}

console.error(`\n  ${missing.length} icon(s) referenced with NO glyph in icons/phosphor.css.`);
console.error("  These render as empty space — an invisible control, not a broken one.\n");
for (const [name, files] of missing) {
  const where = [...files].map((f) => f.split(/[\\/]/).pop()).sort();
  console.error(`  ${name.padEnd(28)} ${where.slice(0, 4).join(", ")}${where.length > 4 ? ` +${where.length - 4}` : ""}`);
}
console.error("\n  Fix by regenerating the subset — `python3 scripts/subset-icons.py` — or,");
console.error("  if the name is a typo, by using a glyph Phosphor actually carries.\n");

process.exit(EXIT_ON_MISSING ? 1 : 0);
