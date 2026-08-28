#!/usr/bin/env node
/* NS Design System — layout hygiene in templates.
   =========================================================================
   Fails on a raw LAYOUT declaration inside a `style=` attribute in
   templates/. Spacing, width and flow belong to the three layout levels —
   .ns-band, .ns-band__inner, .ns-stack / .ns-cluster / .ns-center — and a
   margin written by hand in markup is a spacing the design system cannot
   see, cannot review and cannot change from one place.

   WHY THIS GATE EARNS ITS PLACE. The rule it enforces already existed and was
   already believed; it just had nothing checking it. An audit of templates/
   found 174 inline `style=` attributes, the most common declaration being
   `margin-block-start` — 44 of them across EIGHT different values, where the
   spacing scale has four steps. Nobody chose eight. They accumulated, one
   reasonable-looking decision at a time, because writing the margin was
   easier than finding the class.

   lint-principles.mjs does exactly this for components/css and it is the
   reason that layer has no raw colours. This is the same idea pointed at
   markup.

   WHAT STAYS LEGAL, and the distinction is data-versus-layout:

     --v --x --y --seg --off --link --base --t --_i --_w --_d --fx-at
        A chart datum, a parallax shift, a stagger index. These ARE the
        content; a class per value is a hundred classes.
     --ns-*
        Per-instance tuning of a documented custom property, e.g. a
        marquee's speed.
     anything preceded by <!-- layout-ok: reason -->
        A genuine one-off, argued for in the diff rather than assumed.

   Run: node scripts/check-layout.mjs */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Properties that belong to a layout level rather than to an element. */
const BANNED = /(^|;)\s*(margin|margin-block|margin-block-start|margin-block-end|margin-inline|margin-inline-start|margin-inline-end|margin-top|margin-bottom|margin-left|margin-right|padding|padding-block|padding-inline|gap|row-gap|column-gap|display|flex-direction|grid-template-columns|max-inline-size|max-width|inline-size|width)\s*:/i;

const files = readdirSync(join(ROOT, "templates")).filter((f) => f.endsWith(".html"));
const problems = [];

for (const file of files) {
  const src = readFileSync(join(ROOT, "templates", file), "utf8");
  const lines = src.split("\n");
  lines.forEach((line, i) => {
    /* An explicit exception on the line before, or on the same line. */
    const prev = lines[i - 1] ?? "";
    if (/layout-ok:/.test(line) || /layout-ok:/.test(prev)) return;
    for (const m of line.matchAll(/style="([^"]*)"/g)) {
      const decls = m[1].split(";").map((d) => d.trim()).filter(Boolean);
      for (const decl of decls) {
        /* Custom properties are data, not layout — see the header. */
        if (decl.startsWith("--")) continue;
        if (!BANNED.test(";" + decl)) continue;
        problems.push({ file, line: i + 1, decl });
      }
    }
  });
}

if (problems.length) {
  const byFile = new Map();
  for (const p of problems) {
    if (!byFile.has(p.file)) byFile.set(p.file, []);
    byFile.get(p.file).push(p);
  }
  console.error(`${problems.length} inline layout declaration(s) in templates/:\n`);
  for (const [file, list] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
    console.error(`  templates/${file}  (${list.length})`);
    for (const p of list.slice(0, 6)) console.error(`    :${String(p.line).padEnd(5)} ${p.decl}`);
    if (list.length > 6) console.error(`    … and ${list.length - 6} more`);
  }
  console.error(`
Spacing, width and flow belong to a layout level, not to an element:
  vertical rhythm   .ns-stack / --xs --sm --md --lg
  horizontal row    .ns-cluster / --xs --md --lg, .ns-cluster__end
  a measure         .ns-center / --narrow --prose --gutter
  a section         .ns-band + .ns-band__inner
See docs/LAYOUT.md. For a genuine one-off, put <!-- layout-ok: why --> above the line.`);
  process.exit(1);
}

console.log(`Layout check passed — ${files.length} templates, no inline layout declarations.`);
