#!/usr/bin/env node
/* NS Design System — component parse & convention check.
   =========================================================================
   Two things, both cheap and both worth a build failure:

   1. Every .jsx parses. Without this the React components are shipped
      completely unverified — a stray brace is found by whoever imports them,
      in the other repo, at a bad moment.

   2. No component styles itself inline. This is the architectural rule the
      whole system rests on: Handlebars cannot use a JavaScript style object,
      so an inline-styled React component is one the Ghost theme has to
      reimplement, and two implementations of one thing drift. Styling belongs
      in components/css/*.css as .ns-* classes that both products render.

   A small number of one-off layout nudges inside demo/wrapper markup are
   legitimate; the rule targets style objects carrying COLOR, SIZE, RADIUS or
   FONT, which are exactly the ones that must come from tokens.

   Run: node scripts/check-components.mjs */
import { readFileSync, readdirSync, rmSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const walk = (dir) => {
  let out = [];
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (e.name === "node_modules" || e.name.startsWith(".")) continue;
    if (e.isDirectory()) out = out.concat(walk(join(dir, e.name)));
    else if (e.name.endsWith(".jsx")) out.push(join(dir, e.name));
  }
  return out;
};

const files = walk("components");
let problems = 0;

/* --- 1. Parse ---------------------------------------------------------- */
const tmp = join(ROOT, "node_modules/.cache/ns-jsx-check");
try {
  execFileSync("npx", ["--yes", "esbuild", ...files, "--loader:.jsx=jsx", `--outdir=${tmp}`, "--format=esm", "--log-level=warning"],
    { cwd: ROOT, stdio: "pipe" });
} catch (err) {
  console.error(err.stderr?.toString() || err.message);
  console.error("JSX failed to parse.");
  process.exit(1);
} finally {
  try { rmSync(tmp, { recursive: true, force: true }); } catch {}
}

/* --- 2. No self-styling -------------------------------------------------

   LEGACY DEBT, stated rather than hidden. Every component written before the
   shared CSS layer existed styles itself with inline style objects, which
   means the Ghost theme cannot render ANY of them — it would have to
   reimplement each one, and the two copies would drift.

   Converting them is a real migration, not a rename: each needs its styles
   lifted into components/css/ as .ns-* classes and a .hbs partial written.
   Until that happens they are listed here so that:
     - new components are held to the rule from day one, and
     - the size of the debt is a number in the build output rather than a
       vague feeling.

   Remove a file from this list as you convert it. The list should only ever
   get shorter; a new entry means someone added to the debt.

   TRACKED: see CHANGELOG "Known debt". */
/* Empty, and it should stay that way. Every component now renders .ns-*
   classes that both products share; a new entry here means someone reintroduced
   a component the Ghost theme cannot render. */
const LEGACY = new Set([]);

const STYLING_PROP = /\b(background|backgroundColor|color|borderRadius|borderColor|fontFamily|fontSize|fontWeight|boxShadow|padding|letterSpacing)\s*:/;

let legacyHits = 0;
for (const file of files) {
  if (LEGACY.has(file.split("\\").join("/"))) { legacyHits++; continue; }
  readFileSync(join(ROOT, file), "utf8").split("\n").forEach((line, i) => {
    if (!/style=\{\{/.test(line)) return;
    if (!STYLING_PROP.test(line)) return;         // layout-only nudge, allowed
    if (/\/\*\s*style-ok:/.test(line)) return;    // argued-for exception
    problems++;
    console.error(`${relative(ROOT, join(ROOT, file))}:${i + 1}  [inline-styling]`);
    console.error(`    ${line.trim()}`);
    console.error("    → move it to components/css/*.css as an .ns-* class, or the Ghost theme cannot render it\n");
  });
}

if (problems) {
  console.error(`${problems} inline-styling violation(s) in non-legacy components.`);
  console.error("Move the styling into components/css/*.css as .ns-* classes so the Ghost theme can render it too.");
  process.exit(1);
}
console.log(`Components check passed — ${files.length} .jsx files parse, ${files.length - legacyHits} hold the no-self-styling rule.`);
if (legacyHits) {
  console.log(`  ${legacyHits} legacy component(s) still style themselves inline and cannot be rendered by the Ghost theme.`);
  console.log("  They are listed in scripts/check-components.mjs; convert them and shorten the list.");
}
