#!/usr/bin/env node
/* NS Design System — markup/CSS agreement check.
   =========================================================================
   Every .ns-* class used in a styleguide demo, a template or a card must have
   a rule in the component layer, and every class in the component layer should
   be reachable from at least one of them.

   Both directions matter and they fail differently:

     A class in markup with NO rule   is a typo. It renders as an unstyled div
                                      and nobody notices until a screenshot.
     A rule with NO markup            is either dead code or a component with
                                      no documentation — which, as this repo
                                      found the hard way, means a component
                                      nobody can see.

   Run: node scripts/check-markup.mjs */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");

/* ---- every class the CSS defines ---------------------------------------- */
const cssFiles = readdirSync(join(ROOT, "components/css")).filter((f) => f.endsWith(".css") && f !== "index.css");
/* patterns/ is part of the component layer too — it is imported with
   layer(ns-components) rather than living in the folder. */
const css = cssFiles.map((f) => read("components/css/" + f)).join("\n") + "\n" + read("patterns/patterns.css");
const defined = new Set([...css.matchAll(/\.(ns-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]));

/* ---- every class the markup uses ---------------------------------------- */
const sources = [];
const walk = (dir) => {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (["node_modules", "dist", "preview", "_site", ".git"].includes(e.name)) continue;
    if (e.isDirectory()) walk(join(dir, e.name));
    else if (/\.(html|jsx|mjs)$/.test(e.name)) sources.push(join(dir, e.name));
  }
};
walk(".");

const used = new Map();
for (const rel of sources) {
  for (const m of read(rel).matchAll(/class(?:Name)?="([^"]*)"/g)) {
    for (const c of m[1].split(/\s+/)) {
      /* Skip template-literal interpolation: `ns-pattern--${n}` is a dynamic
         class, and the real names it produces are checked on their own. */
      if (c.includes("${")) continue;
      if (c.startsWith("ns-") && !used.has(c)) used.set(c, rel);
    }
  }
}

const missing = [...used].filter(([c]) => !defined.has(c));
/* Utility/state classes that are applied by JS or documented in prose rather
   than rendered in a demo — real, just not present in static markup. */
const JS_APPLIED = /^ns-(visually-hidden|motion-safe|num|label|prose|measure|balance|pretty|caps|nums)/;
const unused = [...defined].filter((c) => !used.has(c) && !JS_APPLIED.test(c));

let bad = 0;
if (missing.length) {
  bad += missing.length;
  console.error(`${missing.length} class(es) used in markup with no rule in the component layer:\n`);
  for (const [c, where] of missing) console.error(`  .${c.padEnd(30)} ${where}`);
  console.error("");
}
if (bad) {
  console.error("A class with no rule renders as an unstyled element — fix the typo or add the rule.");
  process.exit(1);
}
console.log(`Markup check passed — ${used.size} .ns-* classes used, all defined. ${unused.length} defined but undemoed.`);
if (unused.length) console.log("  undemoed: " + unused.slice(0, 12).join(" ") + (unused.length > 12 ? ` …+${unused.length - 12}` : ""));
