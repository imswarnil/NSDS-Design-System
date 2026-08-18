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

   IT DOES NOT FAIL THE BUILD, and that is a deliberate, temporary choice:
   the repo inherited 40-odd of these, the subsetter named in the generated
   header (scripts/subset-icons.py) is not in the tree, and failing on debt
   nobody can currently fix would just get the check deleted. It prints the
   list, loudly, every build. When the subsetter is restored — or the list
   reaches zero — flip EXIT_ON_MISSING and it becomes a real gate.

   Run: node scripts/check-icons.mjs */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const EXIT_ON_MISSING = false;

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

const used = new Map();
for (const file of walk(".")) {
  const src = readFileSync(join(ROOT, file), "utf8");
  /* Only inside a class attribute or a className string — prose that happens
     to mention a glyph name is not a reference. */
  for (const m of src.matchAll(/\bph-[a-z0-9-]+/g)) {
    const name = m[0];
    /* .ph-fill is the weight modifier, not a glyph. */
    if (name === "ph-fill") continue;
    if (!used.has(name)) used.set(name, new Set());
    used.get(name).add(file);
  }
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
console.error("\n  Fix by using a glyph the subset carries, or by regenerating the subset");
console.error("  (scripts/subset-icons.py, per the header in icons/phosphor.css — not currently in this tree).\n");

process.exit(EXIT_ON_MISSING ? 1 : 0);
