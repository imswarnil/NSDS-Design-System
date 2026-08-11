#!/usr/bin/env node
/* Namaste UI — design-principle linter.
   =========================================================================
   readme.md states five principles and then relies on everyone remembering
   them. This turns the checkable subset into a build failure.

   It does NOT try to judge taste. It checks the small number of things that
   are objectively true or false in a stylesheet, and that are exactly how
   these principles erode in practice:

     1. A raw color literal      — the moment one appears, dark mode is broken
                                   for that rule and nobody notices until a
                                   user with dark mode on files a bug.
     2. A raw radius             — this is how "12px everywhere" comes back
                                   (Principle 4).
     3. A raw z-index            — this is how the z-scale becomes 9999.
     4. A raw transition timing  — this is how a 400ms springy hover appears
                                   (Principle 5).
     5. A raw font-family        — this is how prose font ends up on a label
                                   and the mono/prose distinction that carries
                                   Principle 2 quietly dies.
     6. Raw padding/margin/gap   — this is how spacing drifts between the
                                   Ghost theme and the Next.js app.

   Anything genuinely un-tokenizable is allowlisted INLINE, at the line, by
   appending a CSS comment beginning "lint-ok:" followed by the reason — so an
   exception has to be argued for in the diff rather than added silently to a
   config file.

   Run: node scripts/lint-principles.mjs */
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

/* Only the component layer is linted. tokens/ is where literals are SUPPOSED
   to live — that is the entire point of a token file — and assets/css is
   generated icon-font output. */
const TARGET_DIRS = ["components/css"];

const walk = (dir) => readdirSync(join(ROOT, dir), { withFileTypes: true })
  .flatMap((e) => e.isDirectory() ? walk(join(dir, e.name)) : (e.name.endsWith(".css") ? [join(dir, e.name)] : []));

const RULES = [
  {
    id: "raw-color",
    principle: "P1/P3 — one signal color, and dark mode must flip",
    // Hex, rgb()/hsl() with numeric channels, and the named colors people reach
    // for. color-mix() and var() are fine; so is `transparent` and `currentColor`.
    test: /#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\s*\(\s*\d|\b(?:red|blue|green|black|white|grey|gray|orange|purple)\b\s*[;,)]/,
    hint: "use a --color-* token; if the value must be literal, it belongs in tokens/",
  },
  {
    id: "raw-radius",
    principle: "P4 — sharp, specific geometry",
    test: /border(?:-[a-z-]+)?-radius\s*:\s*(?![^;]*var\()(?![^;]*\b0\b\s*;)/,
    hint: "use --radius-sm / --radius-btn / --radius-card / --radius-pill",
  },
  {
    id: "raw-z-index",
    principle: "elevation order — six layers, no more",
    test: /z-index\s*:\s*(?![^;]*var\()/,
    hint: "use --z-base / -raised / -sticky / -dropdown / -overlay / -toast / -max",
  },
  {
    id: "raw-timing",
    principle: "P5 — motion is instant, not springy",
    test: /transition(?:-duration)?\s*:[^;]*?\b\d+(?:\.\d+)?m?s\b/,
    hint: "use --duration-fast / --duration-base and --ease-out",
  },
  {
    id: "raw-font",
    principle: "P2 — monospace is a structural material",
    test: /font-family\s*:\s*(?![^;]*var\()(?![^;]*inherit)/,
    hint: "use --font-sans / --font-heading / --font-mono",
  },
  {
    id: "raw-spacing",
    principle: "spacing parity between the Ghost theme and the Next.js app",
    // Only padding/margin/gap, and only rem/em values — px is caught by the
    // hairline rule below, and a bare 0 is always fine.
    test: /(?:^|[\s;{])(?:padding|margin|gap|row-gap|column-gap)(?:-[a-z-]+)?\s*:\s*(?![^;]*var\()[^;]*\d(?:\.\d+)?r?em/,
    hint: "use --space-* or a semantic --pad-* / --gap-* / --stack-* alias",
  },
  {
    id: "thick-border",
    principle: "P1 — the hairline is the structure",
    // 1px hairline, 2px underline/accent and 3px leading edge are the system's
    // vocabulary. 4px+ is a slab, and always a mistake here.
    test: /border(?:-[a-z-]+)?(?:-width)?\s*:\s*(?:[^;]*\s)?([4-9]|\d{2,})px/,
    hint: "the hairline is 1px; accents are 2-3px. Nothing here is thicker",
  },
];

let problems = 0;
let scanned = 0;

for (const dir of TARGET_DIRS) {
  for (const file of walk(dir)) {
    const lines = readFileSync(join(ROOT, file), "utf8").split("\n");
    scanned++;
    let inComment = false;
    lines.forEach((line, i) => {
      /* Track block comments so the long explanatory headers at the top of
         each file — which mention hex values and durations in prose — are not
         linted as if they were declarations. */
      const opens = (line.match(/\/\*/g) || []).length;
      const closes = (line.match(/\*\//g) || []).length;
      const startedInComment = inComment;
      inComment = inComment ? closes < opens + 1 : opens > closes;
      if (startedInComment) return;

      // Strip comments before testing, but keep the allowlist marker. Both
      // forms matter: a closed comment mid-line, and the opening line of a
      // multi-line comment, whose tail is prose and must not be linted.
      const allowed = /\/\*\s*lint-ok:/.test(line);
      const code = line.replace(/\/\*[\s\S]*?\*\//g, "").replace(/\/\*.*$/, "");
      if (!code.trim() || allowed) return;
      // url() payloads (data-URI SVGs) cannot take a custom property.
      if (/url\(/.test(code)) return;

      for (const rule of RULES) {
        if (!rule.test.test(code)) continue;
        problems++;
        console.error(`${relative(ROOT, join(ROOT, file))}:${i + 1}  [${rule.id}]  ${rule.principle}`);
        console.error(`    ${code.trim()}`);
        console.error(`    → ${rule.hint}\n`);
      }
    });
  }
}

if (problems) {
  console.error(`${problems} principle violation(s) across ${scanned} file(s).`);
  console.error("If a value genuinely cannot be a token, append  /* lint-ok: why */  to that line.");
  process.exit(1);
}
console.log(`Principles check passed — ${scanned} component stylesheet(s), no raw colors, radii, z-indexes, timings, fonts or spacing.`);
