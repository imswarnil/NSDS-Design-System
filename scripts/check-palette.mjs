#!/usr/bin/env node
/* Namaste UI — chart palette regression check.
   =========================================================================
   The data-viz palette in tokens/dataviz.css was not chosen by eye; it was
   solved for. Every hue sits inside an OKLCH lightness band, clears a chroma
   floor, is separable from its neighbour under three kinds of colorblindness
   AND under normal vision, and clears 3:1 against its surface.

   Those are properties a well-meaning edit destroys silently — nudging one
   hue "slightly warmer" can drop the adjacent-pair separation under deutan
   below the readable floor with no visible change to the person making the
   edit. So the properties are re-proved on every CI run rather than trusted.

   The palette is read from the CSS, not duplicated here: the check tests what
   actually ships.

   Run: node scripts/check-palette.mjs */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { validate, validateOrdinal } from "./validate-palette.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const css = readFileSync(join(ROOT, "tokens/dataviz.css"), "utf8");

/* Split :root from [data-theme="dark"] so each mode is checked against its
   own surface — a dark palette validated against white proves nothing. */
const block = (selector) => {
  const m = css.match(new RegExp(`${selector}\\s*\\{([\\s\\S]*?)\\n\\}`));
  if (!m) { console.error(`check-palette: could not find ${selector} block`); process.exit(2); }
  return m[1];
};
const readVars = (body, prefix, count) =>
  Array.from({ length: count }, (_, i) => {
    const name = `${prefix}${i + 1}`;
    const m = body.match(new RegExp(`${name}\\s*:\\s*(#[0-9a-fA-F]{6})`));
    if (!m) { console.error(`check-palette: ${name} missing or not a literal hex`); process.exit(2); }
    return m[1];
  });

const SURFACE = { light: "#ffffff", dark: "#051222" };

const suites = [
  { label: "categorical (light)", mode: "light", kind: "categorical", colors: readVars(block(":root"), "--chart-cat-", 7) },
  { label: "categorical (dark)", mode: "dark", kind: "categorical", colors: readVars(block('\\[data-theme="dark"\\]'), "--chart-cat-", 7) },
  { label: "sequential (light)", mode: "light", kind: "ordinal", colors: readVars(block(":root"), "--chart-seq-", 4) },
  /* The dark sequential ramp runs dim→bright against navy, so it is reversed
     before checking: the validator asserts monotonic light→dark, and the
     property we care about is that the steps are ordered and separated, not
     which end of the array the light one sits at. */
  { label: "sequential (dark)", mode: "dark", kind: "ordinal", colors: readVars(block('\\[data-theme="dark"\\]'), "--chart-seq-", 4) },
];

let failed = false;
for (const suite of suites) {
  const surface = SURFACE[suite.mode];
  const run = suite.kind === "ordinal" ? validateOrdinal : validate;
  const { ok, report } = run(suite.colors, { mode: suite.mode, surface });
  console.log(`\n${suite.label}  [${suite.colors.join(", ")}]`);
  for (const [name, pass, detail] of report) {
    console.log(`  ${pass ? "PASS" : "FAIL"}  ${name.padEnd(22)} ${detail}`);
  }
  if (!ok) failed = true;
}

if (failed) {
  console.error("\nPalette check FAILED. tokens/dataviz.css no longer satisfies the checks it was solved for.");
  console.error("Re-step the offending hue rather than lowering the bar — see the rules at the top of that file.");
  process.exit(1);
}
console.log("\nPalette check passed — all suites satisfy the lightness, chroma, CVD, normal-vision and contrast checks.");
