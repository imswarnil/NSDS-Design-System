#!/usr/bin/env node
/* NS Design System — cascade contract check.
   =========================================================================
   One promise underwrites the whole Tailwind story:

     A Tailwind utility beats a .ns-* default, always, without !important.

   That promise rests entirely on the layer order declared in styles.css
   (theme, base, ns-components, components, utilities). Two things silently
   revoke it, and neither is visible in a diff:

     1. A rule OUTSIDE any layer. Unlayered rules beat every layered rule
        regardless of specificity — so one stray rule outranks all of Tailwind.
        This is exactly how icons/phosphor.css used to make `hidden` a no-op on
        every icon in the system.

     2. An !important. Important declarations invert layer order, so an
        important in ns-components beats a normal declaration in utilities.
        Layering does not save you from it; only deleting it does.

   Neither shows up in a browser as an error. They show up as "I added a class
   and nothing happened", months later, in a downstream product.

   This parses the real @import graph rather than dist/, so it cannot pass on a
   stale bundle. Custom-property-only blocks (:root { --x: y }) are exempt:
   they define the vocabulary and never compete with a utility in the cascade.

   Run: node scripts/check-cascade.mjs */
import { readFileSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import postcss from "postcss";
import atImport from "postcss-import";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const ENTRY = join(ROOT, "styles.css");

/* The layer order every consumer inherits. Asserted rather than assumed —
   dropping a layer from the statement is as breaking as dropping a rule. */
const REQUIRED_ORDER = ["theme", "base", "ns-components", "components", "utilities"];

/* !important is correct in exactly these places, and each is a case where the
   declaration is not a style preference but the meaning of the thing.
   Keyed by source file + selector so "somewhere in a11y.css" is not enough. */
const IMPORTANT_ALLOWLIST = [
  { file: "tokens/base.css", selector: "[hidden]", why: "the attribute's meaning, not a preference — UA display:none loses to any author rule" },
  { file: "tokens/effects.css", selector: "*", why: "prefers-reduced-motion is an accessibility guard and must outrank component motion" },
  /* Matched on the BASENAME, not the full path. The component layer is
     grouped into folders, and an allowlist keyed on "components/css/a11y.css"
     stopped matching the moment that file became "foundation/a11y.css" —
     which did not report a missing entry, it reported two brand-new cascade
     violations in a file nobody had touched. An allowlist that silently
     stops applying is worse than no allowlist. */
  { file: "a11y.css", selector: ".ns-visually-hidden:not(:focus):not(:active)", why: "a visually-hidden element that a component un-hides is a screen-reader bug" },
  { file: "a11y.css", selector: ".ns-motion-safe", why: "same guard as above, opt-in form" },
];

const rel = (node) => {
  const f = node.source?.input?.file;
  return f ? relative(ROOT, f) : "(unknown)";
};

/* Compared on the basename so an entry survives its file being moved into a
   folder — see the note on the allowlist above. */
const base = (p) => p.split("/").pop();
const isAllowed = (decl, rule) => IMPORTANT_ALLOWLIST.some(
  (a) => base(rel(decl)) === base(a.file) && rule.selector.split(",").map((s) => s.trim()).includes(a.selector),
);

const problems = [];
const source = readFileSync(ENTRY, "utf8");
const result = await postcss([atImport()]).process(source, { from: ENTRY });

/* ---- 1. the layer statement --------------------------------------------- */
let declared = null;
result.root.each((n) => {
  if (declared === null && n.type === "atrule" && n.name === "layer" && !n.nodes) {
    declared = n.params.split(",").map((s) => s.trim());
  }
});
if (!declared) {
  problems.push(["styles.css", "no `@layer theme, base, ns-components, components, utilities;` statement — layer order would fall out of import order instead"]);
} else if (declared.join() !== REQUIRED_ORDER.join()) {
  problems.push(["styles.css", `layer order is \`${declared.join(", ")}\`, expected \`${REQUIRED_ORDER.join(", ")}\``]);
}

/* ---- 2. nothing outside a layer ----------------------------------------- */
const propsOnly = (rule) => rule.nodes?.length
  && rule.nodes.every((d) => d.type === "comment" || (d.type === "decl" && d.prop.startsWith("--")));

const scan = (container, layered) => {
  container.each((node) => {
    if (node.type === "rule") {
      if (!layered && !propsOnly(node)) {
        problems.push([`${rel(node)}:${node.source?.start?.line}`,
          `\`${node.selector.slice(0, 60)}\` is outside any @layer — it beats every Tailwind utility regardless of specificity`]);
      }
      node.walkDecls((d) => {
        if (d.important && !isAllowed(d, node)) {
          problems.push([`${rel(d)}:${d.source?.start?.line}`,
            `\`${d.prop}: ${d.value} !important\` on \`${node.selector.slice(0, 40)}\` — an important inverts layer order and beats utilities`]);
        }
      });
    } else if (node.type === "atrule") {
      if (node.name === "layer") scan(node, true);
      else if (["media", "supports", "container"].includes(node.name)) scan(node, layered);
      // @font-face / @keyframes / @property never participate in the cascade.
    }
  });
};
scan(result.root, false);

if (problems.length) {
  for (const [where, msg] of problems) console.error(`${where}  [cascade]  ${msg}`);
  console.error(`\n${problems.length} cascade violation(s). A Tailwind utility can no longer be relied on to win.`);
  console.error("Fix by moving the rule into @layer ns-components (or importing the file with `layer(ns-components)`),");
  console.error("or by deleting the !important. If it is genuinely correct, add it to IMPORTANT_ALLOWLIST with a reason.");
  process.exit(1);
}
console.log(`Cascade check passed — layer order intact, nothing unlayered, ${IMPORTANT_ALLOWLIST.length} argued-for !important(s).`);
