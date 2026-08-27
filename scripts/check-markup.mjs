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

   The second direction is a report, not a failure, and it only means anything
   if it is accurate. Three things used to make it lie:

     1. CSS COMMENTS. The regex read `.ns-blog-*` out of a prose header and
        filed `ns-blog-` as an undemoed class. Comments are stripped now.
     2. DYNAMIC CLASSES. The styleguide renders the whole pattern library as
        `ns-pattern--${n}` over a name list. Every one of those 16 is demoed;
        none of them is a literal string. A `ns-foo--${…}` in a demo now marks
        the `ns-foo--` FAMILY as reachable.
     3. CLASSES THIS REPO DOES NOT RENDER. Some blocks exist for the Ghost
        theme or the LMS and have no demo here by design. Put a CSS comment
        reading `used-by: ghost-theme` (any target name) on the rule, and it
        is counted as accounted-for rather than undemoed.

   What is left after those three is the real list: dead code, or a component
   nobody can see. Run with --list to print all of it, grouped by file.

   Run: node scripts/check-markup.mjs [--list] */
import { readFileSync, readdirSync } from "node:fs";
import { cssFiles as cssFilesOf } from "./lib/css-files.mjs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const LIST = process.argv.includes("--list");

/* ---- every class the CSS defines ---------------------------------------- */
const cssFiles = cssFilesOf(ROOT).map((rel) => rel.replace("src/css/", ""));
/* patterns/ is part of the component layer too — it is imported with
   layer(ns-components) rather than living in the folder. */
const cssSources = [
  ...cssFiles.map((f) => ["src/css/" + f, read("src/css/" + f)]),
  ["src/patterns/patterns.css", read("src/patterns/patterns.css")],
];

const definedIn = new Map();   // class -> file that defines it
const declaredExternal = new Set();

for (const [file, src] of cssSources) {
  /* `used-by:` has to be read BEFORE comments are stripped — it lives in one.
     The annotation covers every class named in its own rule, so it goes on
     the line above the selector or at the end of it. */
  for (const m of src.matchAll(/([^\n]*)\/\*\s*used-by:[^*]*\*\/([^\n]*)/g)) {
    for (const c of `${m[1]} ${m[2]}`.matchAll(/\.(ns-[a-zA-Z0-9_-]+)/g)) declaredExternal.add(c[1]);
  }
  const stripped = src.replace(/\/\*[\s\S]*?\*\//g, "");
  for (const m of stripped.matchAll(/\.(ns-[a-zA-Z0-9_-]+)/g)) {
    if (!definedIn.has(m[1])) definedIn.set(m[1], file);
  }
}

/* A BLOCK ROOT with no declarations of its own is still defined. .ns-ccard and
   .ns-bcard are the two: both compose .ns-card for their looks and exist only
   as a namespace for __elements and --modifiers, so markup writes
   `class="ns-card ns-ccard"` and every rule that fires is real. Without this
   the checker calls the root a typo, which is the opposite of true.

   Derived roots are held separately so an unused one never lands in the
   undemoed list — a root is not a second piece of dead code beside the
   children that already report. */
const derivedRoots = new Set();
for (const c of [...definedIn.keys()]) {
  const root = c.replace(/(__|--).*$/, "");
  if (root !== c && !definedIn.has(root)) derivedRoots.add(root);
}

/* ---- every class the markup uses ---------------------------------------- */
const sources = [];
const walk = (dir) => {
  for (const e of readdirSync(join(ROOT, dir), { withFileTypes: true })) {
    if (["node_modules", "dist", "preview", "_site", ".git"].includes(e.name)) continue;
    if (e.isDirectory()) walk(join(dir, e.name));
    /* .js as well as .jsx/.mjs: components/core/highlight.js builds the diff
       line classes, and a class that only exists inside a rendering helper is
       still a class that ships. */
    else if (/\.(html|jsx|mjs|js)$/.test(e.name)) sources.push(join(dir, e.name));
  }
};
walk(".");

const used = new Map();
const perFile = new Map();
const dynamicPrefixes = new Set();
for (const rel of sources) {
  /* This file's own header spells out the attribute shapes it looks for, so
     scanning itself files the examples as real class usage. */
  if (rel.endsWith("check-markup.mjs")) continue;
  const src = read(rel);
  /* Two shapes, because the React wrappers use both:
       className="ns-x ns-y"                              a plain attribute
       className={["ns-x", className].filter(Boolean)…}   composed in JS
     Only the second was invisible, and it is where the BLOCK ROOT usually
     lives — .ns-trackcard is composed with an incoming className while every
     one of its __elements is a plain string, so the root read as dead code and
     the component around it did not. */
  const attrs = [
    ...[...src.matchAll(/class(?:Name)?="([^"]*)"/g)].map((m) => m[1]),
    ...[...src.matchAll(/className=\{([^}]*)\}/g)]
      .flatMap((m) => [...m[1].matchAll(/["'`]([^"'`]*)["'`]/g)].map((s) => s[1])),
    /* A class FRAGMENT being concatenated onto a class attribute, which is how
       highlight.js writes its diff modifiers:
         add.has(n) ? " ns-code__line--add" : …
       then `class="ns-code__line${mod}"` on the next line. The LEADING SPACE
       is the whole signal and it has to stay required — without it this also
       matches `id="ns-c-slug"`, a querySelector argument and a layer name,
       none of which is a class. */
    ...[...src.matchAll(/["'`](\s+ns-[a-zA-Z0-9_-]+(?:\s+ns-[a-zA-Z0-9_-]+)*)\s*["'`]/g)].map((m) => m[1]),
  ];
  for (const attr of attrs) {
    for (const c of attr.split(/\s+/)) {
      if (!c.startsWith("ns-")) continue;
      /* `<span class="ns-tok-*">` in a doc comment is a pattern, not a class.
         Anything with a character a class name cannot contain is prose. */
      if (!/^ns-[a-zA-Z0-9_-]+$/.test(c) && !c.includes("${")) continue;
      /* `ns-pattern--${n}` demoes the family, not one member. Keep the literal
         head; anything defined under it is reachable from that demo. */
      if (c.includes("${")) {
        const head = c.slice(0, c.indexOf("${"));
        if (head.length > "ns-".length) dynamicPrefixes.add(head);
        continue;
      }
      if (!used.has(c)) used.set(c, rel);
      if (!perFile.has(rel)) perFile.set(rel, new Set());
      perFile.get(rel).add(c);
    }
  }
}

const coveredByDynamic = (c) => [...dynamicPrefixes].some((p) => c.startsWith(p) && c !== p);

/* ---- classes that are inert without a partner --------------------------
   A handful of components are a PAIR: one class does nothing at all unless
   another is present above it, and when the partner is missing there is no
   error, no warning and no visual difference from the un-styled case. That
   is the worst failure mode a design system has, because it survives review
   — the page looks exactly like a page where somebody chose not to use the
   effect.

   .ns-parallax is the motivating case and it is worth spelling out.
   `animation-timeline: view()` resolves against the subject's nearest SCROLL
   CONTAINER, and `overflow: hidden` makes an element one even though nothing
   in it will ever scroll. So a parallax layer inside a clipped box — which
   is every real use of the technique — binds to a container that never
   moves and freezes at 50% progress, which is precisely where an element
   with no animation sits. .ns-parallax-frame exists to give it a subject
   whose own nearest scroll container is the page.

   The check is per FILE, not per DOM ancestry: a real ancestor test would
   need a parser, and in practice the frame and its layers are authored
   together. A file that uses one and not the other is the bug. */
const PAIRS = [
  {
    child: "ns-parallax",
    ancestor: "ns-parallax-frame",
    why: "a parallax layer with no .ns-parallax-frame above it binds to the nearest clipped box, freezes at 50% progress, and renders identically to no animation",
  },
];
const unpaired = [];
for (const [rel, classes] of perFile) {
  for (const { child, ancestor, why } of PAIRS) {
    if (classes.has(child) && !classes.has(ancestor)) unpaired.push({ rel, child, ancestor, why });
  }
}
if (unpaired.length) {
  console.error(`${unpaired.length} inert class pairing(s):\n`);
  for (const u of unpaired) {
    console.error(`  .${u.child} in ${u.rel} has no .${u.ancestor}`);
    console.error(`     ${u.why}\n`);
  }
  process.exit(1);
}

const missing = [...used].filter(([c]) => !definedIn.has(c) && !derivedRoots.has(c));
/* Utility/state classes that are applied by JS or documented in prose rather
   than rendered in a demo — real, just not present in static markup. */
const JS_APPLIED = /^ns-(visually-hidden|motion-safe|num|label|prose|measure|balance|pretty|caps|nums)/;
const undemoed = [...definedIn.keys()].filter(
  (c) => !used.has(c) && !JS_APPLIED.test(c) && !declaredExternal.has(c) && !coveredByDynamic(c),
);

if (missing.length) {
  console.error(`${missing.length} class(es) used in markup with no rule in the component layer:\n`);
  for (const [c, where] of missing) console.error(`  .${c.padEnd(30)} ${where}`);
  console.error("\nA class with no rule renders as an unstyled element — fix the typo or add the rule.");
  process.exit(1);
}

const accounted = [
  dynamicPrefixes.size ? `${[...definedIn.keys()].filter(coveredByDynamic).length} via dynamic demos` : "",
  declaredExternal.size ? `${declaredExternal.size} used-by another product` : "",
].filter(Boolean).join(", ");

console.log(
  `Markup check passed — ${used.size} .ns-* classes used, all defined. ` +
  `${undemoed.length} defined but undemoed${accounted ? ` (${accounted})` : ""}.`,
);

if (!undemoed.length) process.exit(0);

if (!LIST) {
  console.log("  undemoed: " + undemoed.slice(0, 12).join(" ") + (undemoed.length > 12 ? ` …+${undemoed.length - 12}` : ""));
  console.log("  run with --list for the full list, grouped by file");
  process.exit(0);
}

const byFile = new Map();
for (const c of undemoed) {
  const f = definedIn.get(c);
  if (!byFile.has(f)) byFile.set(f, []);
  byFile.get(f).push(c);
}
for (const [f, list] of [...byFile].sort((a, b) => b[1].length - a[1].length)) {
  console.log(`\n  ${f} (${list.length})`);
  console.log("    " + list.sort().join(" "));
}
