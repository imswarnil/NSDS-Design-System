#!/usr/bin/env node
/* NS Design System — the PORTABLE skill bundle.
   =========================================================================
   Writes .claude/skills/namaste-ui/ : a self-contained pack an agent can
   load in a DIFFERENT repository and build interfaces that look like they
   came from this one.

   WHY THIS EXISTS SEPARATELY FROM ./SKILL.md.
   The skill at the repo root is for working INSIDE this repo, and it is
   written that way — "read readme.md first, then explore the other files".
   Every sentence of it assumes the tokens, the component layer, the
   templates and the styleguide are one `ls` away. Copy it into another
   project and every pointer dangles.

   This bundle assumes the opposite: that nothing is present except the
   bundle itself. So it carries the token values, the class inventory, the
   component list and the rules as TEXT, and it tells the agent how to get
   the stylesheet.

   WHY IT IS GENERATED RATHER THAN WRITTEN.
   The same argument the styleguide rests on. A hand-written knowledge pack
   is a snapshot, and a snapshot of a design system is wrong within a week —
   quietly, in the direction of whatever the author remembered. Every list
   here is read out of the real artifacts at build time: token values from
   tokens/tokens.json, classes by parsing components/css/, components from
   the COMPONENTS array the styleguide already renders from. When a token
   changes, this changes in the same commit or `--check` fails.

   What is NOT generated is the prose: the principles, the traps, the "mono
   is for values" rule. Those are judgement, they live in reference files
   under this script as string constants, and they are the part worth
   reading twice.

   Run: node scripts/build-skill.mjs [--check]
        --check  exits 1 if the bundle on disk differs from what would be
                 written, which is how CI catches a token change that did
                 not regenerate the pack. */
import { readFileSync, writeFileSync, readdirSync, mkdirSync, existsSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { COMPONENTS } from "./component-docs.mjs";
import { cssFiles as cssFilesOf } from "./lib/css-files.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const OUT = join(ROOT, ".claude/skills/namaste-ui");
const CHECK = process.argv.includes("--check");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const pkg = JSON.parse(read("package.json"));

/* ---- tokens, flattened out of the generated design-token file ----------- */
const tokenJson = JSON.parse(read("tokens/tokens.json"));
function flatten(node, out = []) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && v.$value !== undefined) {
      out.push({ name: v.$extensions?.["ns.cssVar"] ?? `--${k}`, value: String(v.$value), file: v.$extensions?.["ns.definedIn"] ?? "" });
    } else if (v && typeof v === "object") flatten(v, out);
  }
  return out;
}
const tokens = flatten(tokenJson.light ?? {});
/* The public names are the ones a consumer writes. The --ns-* privates exist
   so the Tailwind @theme can own --color-* etc. without aliasing itself; a
   consuming project never types one. */
const publicTokens = tokens.filter((t) => !t.name.startsWith("--ns-"));

/* ---- the class inventory, parsed from the component layer --------------- */
const classesByFile = new Map();
for (const rel of cssFilesOf(ROOT)) {
  const f = rel.replace("components/css/", "");
  const src = read(rel).replace(/\/\*[\s\S]*?\*\//g, "");
  const found = new Set([...src.matchAll(/\.(ns-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]));
  if (found.size) classesByFile.set(f, [...found].sort());
}
const classCount = [...classesByFile.values()].reduce((n, l) => n + l.length, 0);

/* ---- components, from the array the styleguide renders from ------------- */
const byFamily = new Map();
for (const c of COMPONENTS) {
  if (!byFamily.has(c.family)) byFamily.set(c.family, []);
  byFamily.get(c.family).push(c);
}
/* The component's ROOT CLASS, read out of its own first demo rather than
   guessed from its id. The two diverge often enough that guessing is worse
   than useless — the Button entry has id "button" and renders `.ns-btn`, and
   a reference telling an agent to write `.ns-button` sends it to a class that
   does not exist and a build that fails on it. The first .ns-* in the first
   variant's markup is the block root by construction: the demos are written
   root-first. */
function rootClass(c) {
  const seen = [];
  for (const v of c.variants ?? []) {
    for (const m of (v.html ?? "").matchAll(/class="([^"]*)"/g)) {
      for (const cls of m[1].split(/\s+/)) if (cls.startsWith("ns-") && !seen.includes(cls)) seen.push(cls);
    }
  }
  if (!seen.length) return null;
  /* Prefer the class that shares a stem with the entry's own id over
     whichever happened to come first in the markup: the Author card demo
     opens on its CONTAINER (.ns-makers) and the Scroll hero demo opens on
     the .ns-band it sits in, and naming either of those as the component
     points a reader at the wrong object. Exact match first, then prefix,
     then the block root (no __element, no --modifier), then give up and
     take the first. */
  const id = c.id.replace(/-/g, "");
  const norm = (x) => x.slice(3).replace(/[-_]/g, "");
  return seen.find((x) => norm(x) === id)
      ?? seen.find((x) => norm(x).startsWith(id) || id.startsWith(norm(x)))
      ?? seen.find((x) => !x.includes("__") && !x.includes("--"))
      ?? seen[0];
}

const stamp = "<!-- generated by scripts/build-skill.mjs — do not edit by hand -->";

/* =======================================================================
   The files
   ===================================================================== */
const files = {};

files["SKILL.md"] = `---
name: namaste-ui
description: Build interfaces in the Namaste Salesforce design language — a calm, flat, reading-first system with one blue, hairline structure, and a monospace voice reserved for data. Use when styling any UI, page, prototype or mock that should look like Namaste Salesforce, INCLUDING in projects that do not contain the design system itself. Carries the tokens, the class inventory, the composition patterns and the rules the build enforces.
---

${stamp}

# Namaste UI — building in this design language elsewhere

This bundle is self-contained. It assumes the Namaste Salesforce Design
System repository is **not** present, and it carries what an agent needs to
produce work that belongs to the same system.

Generated from v${pkg.version}: ${publicTokens.length} public tokens,
${classCount} \`.ns-*\` classes, ${COMPONENTS.length} documented components.

## Step 1 — get the stylesheet, do not reimplement it

\`\`\`bash
npm install ${pkg.name}
\`\`\`

Zero runtime dependencies. Then take exactly one bundle:

| Import | Use |
| --- | --- |
| \`${pkg.name}/dist/namaste-ui.css\` | plain CSS, everything, no build step |
| \`${pkg.name}/dist/namaste-ui.min.css\` | the same, minified |
| \`${pkg.name}/dist/namaste-ui.tailwind.css\` | for a project already on Tailwind v4 |
| \`${pkg.name}/dist/namaste-ui.tailwind.min.css\` | the same, minified |

\`\`\`js
import "${pkg.name}/dist/namaste-ui.css";
\`\`\`

If npm is not an option, copy the \`dist/\` file in directly. Either way:
**never hand-copy rules out of the reference files below into a new
stylesheet** — the whole value of the system is that one layer feeds every
surface, and a second copy diverges on the first change.

There is also an MCP server in the package (\`npx nsds-mcp\`) if the client
supports one — it answers the same questions as these reference files, but
live. The files below work with no client at all.

If the target project cannot take the bundle, say so plainly rather than
approximating the look with new CSS. An approximation is worse than an
honest "this project is not on the system yet", because it looks close
enough that nobody fixes it.

## Step 2 — compose with classes, not with new CSS

\`references/classes.md\` is the full inventory. \`references/components.md\`
lists every documented component with what it is FOR and what it is not.
Reach for an existing class first; the system is wide, and most of what a
page needs already has a name.

Write new CSS only when nothing fits, and when you do, follow
\`references/rules.md\` — it is the same set of rules the source repo's build
enforces, and code that breaks them will fail the moment it is upstreamed.

## Step 3 — get the type and the voice right

Two rules account for most of what makes work look like it belongs here, and
both are in \`references/rules.md\` in full:

**The type scale forks on scanned-versus-read.** \`--size-body\` (14px) is the
UI size — rails, tables, admin, cards. \`--size-prose\` (17px) /
\`--size-prose-lead\` (20px) / \`--size-prose-small\` (15px) are the reading
scale — articles, and every marketing band. Setting a homepage paragraph at
the UI size is the most common way work from outside the system reads as
foreign.

**Mono is for values; sans is for words.** The monospace voice belongs on an
index, a duration, a count, a price, a timestamp, a status. It does not
belong on a person's name, a stat's label, a call to action or a sentence.
The test: would you say it aloud as a word, or read it off as a figure?

## Step 4 — compose pages out of bands

\`references/patterns.md\` has the band grammar and the admission test a new
section has to pass. A marketing page in this system is a stack of
full-width bands, each answering a question no other band answers.

## The reference files

| File | What is in it |
| --- | --- |
| \`references/rules.md\` | the five principles, the enforced rules, and the traps that cost real time |
| \`references/tokens.md\` | every public token, with its value |
| \`references/classes.md\` | every \`.ns-*\` class, grouped by source file |
| \`references/components.md\` | every documented component: use it for, not for |
| \`references/patterns.md\` | band grammar, page composition, the admission test |

## What this bundle deliberately does not do

It does not carry the React wrappers, the Handlebars partials or the
templates. Those are adapters for two specific products; the CSS layer is the
portable part, and a third product should write its own thin adapter over the
same classes rather than inherit either one.
`;

files["references/tokens.md"] = `${stamp}

# Tokens

Every public token, generated from \`tokens/tokens.json\`. These are the light
theme's values; ${tokens.length - publicTokens.length} private \`--ns-*\`
sources are omitted because a consuming project never types one — they exist
so Tailwind's \`@theme\` can own the public names without aliasing itself.

**Dark mode is automatic.** The tokens flip under \`[data-theme="dark"]\` in
the bundle. Use the semantic names (\`--color-ink\`, \`--color-surface\`,
\`--color-border\`) and both themes are correct with no second stylesheet. A
hard-coded hex is a bug in exactly one theme and nobody notices which.

${(() => {
  const groups = new Map();
  for (const t of publicTokens) {
    const g = t.file.replace("tokens/", "").replace(".css", "") || "other";
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g).push(t);
  }
  return [...groups].map(([g, list]) =>
    `## ${g}\n\n| Token | Value |\n| --- | --- |\n` +
    list.map((t) => `| \`${t.name}\` | \`${t.value}\` |`).join("\n")).join("\n\n");
})()}
`;

files["references/classes.md"] = `${stamp}

# Class inventory

Every \`.ns-*\` class in the component layer, grouped by the file that defines
it. ${classCount} classes across ${classesByFile.size} stylesheets.

A class here is available the moment \`dist/namaste-ui.css\` is linked. If you
find yourself about to invent a class name, search this list first — the
odds are the thing already exists under a name you did not guess.

${[...classesByFile].sort().map(([f, list]) =>
  `## ${f}\n\n${list.map((c) => `\`.${c}\``).join(" · ")}`).join("\n\n")}
`;

files["references/components.md"] = `${stamp}

# Components

${COMPONENTS.length} documented components. Each entry carries what the
component is for and — more usefully — what it is NOT for, because most
misuse in a design system is a component doing a job a neighbouring one does
better.

${[...byFamily].map(([family, list]) => `## ${family}\n\n` + list.map((c) => {
  const strip = (s) => String(s).replace(/<[^>]+>/g, "").replace(/&mdash;/g, "—").replace(/&rsquo;/g, "’").replace(/&ldquo;|&rdquo;/g, '"').replace(/&amp;/g, "&").replace(/&middot;/g, "·").replace(/&times;/g, "×").replace(/&nbsp;/g, " ");
  const root = rootClass(c);
  const lines = [`### ${c.title}${root ? ` \`.${root}\`` : ""}`];
  if (c.summary) lines.push("", strip(c.summary));
  if (c.use?.length) lines.push("", "**Use it for**", ...c.use.map((u) => `- ${strip(u)}`));
  if (c.not?.length) lines.push("", "**Not for**", ...c.not.map((u) => `- ${strip(u)}`));
  return lines.join("\n");
}).join("\n\n")).join("\n\n")}
`;

/* The judgement files. Written by hand, versioned here, and the part of the
   bundle worth reading twice. */
files["references/rules.md"] = `${stamp}

# Rules

## The five principles

1. **The hairline is the structure.** A card is a 1px border, a tag is a 1px
   border, a list row is a 1px rule. Hover brightens a border to brand blue.
   Nothing lifts, nothing casts a shadow at rest. Elevation is drawn as line,
   never as depth.
2. **One blue.** There is a single brand hue with a 50–900 ramp. A second
   accent colour is a decision to have no accent colour.
3. **Status is never a background wash.** Success, warning and error are an
   edge, an icon and a word — never a tinted row. A wash is unreadable in
   forced colours, fights whatever surface it lands on, and makes a failed
   row look like a selected one.
4. **Mono is the data voice.** Uppercase, tracked, small: indexes,
   durations, counts, prices, timestamps, statuses. It is what separates a
   row of data from a sentence on sight, without colour.
5. **Motion is instant.** Interaction is 120–180ms, plain ease-out, no
   spring, no bounce, no scale-pop. Entrance may run longer because nobody
   is waiting on it, but it moves at most half a rem — anything further
   reads as a slide deck.

## Enforced by the build

These fail \`npm run check\` in the source repo, so code that breaks them
cannot be upstreamed:

- **No raw values in the component layer.** No literal colour, radius,
  z-index, transition duration, font-family, or padding/margin/gap. Use the
  token. This includes values inside \`var()\` fallbacks —
  \`var(--duration-slow, 240ms)\` fails. Use the token with no fallback.
- **No border wider than 3px.**
- If a value genuinely cannot be a token, append
  \`/* lint-ok: <reason> */\` on that line, so the exception is argued for in
  the diff rather than buried in a config.
- **Every \`.ns-*\` class used in markup must have a rule.** Inventing a class
  name in a template without adding the CSS fails the build.
- **No inline styling in React components.** The React layer is a thin
  renderer over the CSS classes; a component that styles itself is a
  component the other product has to reimplement.

## The type scale forks

\`--size-body\` (14px) is the **UI** base: rails, tables, admin, player
chrome, catalogue cards — anything SCANNED.

\`--size-prose\` (17px) / \`--size-prose-lead\` (20px) /
\`--size-prose-small\` (15px) are the **reading** scale: \`.ns-prose\`,
articles, and **every marketing band**. Nobody scans a homepage; they read it
once, deciding. Marketing copy set at 13px is one step BELOW the UI base and
level with a table caption, which is the same category error the fork exists
to prevent, pointing the other way.

Leading forks with it: \`--leading-prose\` (1.7) for prose paragraphs only,
\`--leading-body\` (1.6) for UI, \`--leading-snug\` (1.45) for multi-line text
that is scanned rather than read. Leading grows with the measure and shrinks
with the size — never 1.7 on a table row, never 1.3 on a wrapping sentence.

A card composed INTO a marketing band follows the band; the same card in a
catalogue grid keeps the UI scale. Three courses on a homepage are read;
forty in a catalogue are scanned. That is the fork applied, not an exception
to it.

## Mono is for values; sans is for words

The label voice earns its place on things read as DATA: an index, a
duration, a count, a price, a timestamp, a status. It does **not** belong on
a person's name, a stat's label, a call to action, or a sentence of fine
print — tracked uppercase monospace is a bad way to set any of those, and a
name in the label voice reads as a serial number.

The test: would you say it aloud as a word, or read it off as a figure?
"Priya S." is a word. "4h 05m" is a figure.

## Traps that cost real time

Each of these produces something that looks fine and is silently broken.

**\`overflow: hidden\` makes an element a scroll container.** Everything
inside that depends on the PAGE scrolling then breaks without an error:
\`position: sticky\` pins to a box that never scrolls (so it never sticks),
and \`animation-timeline: view()\` resolves against it and freezes at 50%
progress — which looks exactly like no animation at all. Use
\`overflow: clip\` for any box that was never going to scroll. It crops
identically with none of that.

**Scroll-driven animation needs a subject outside the clip.** A parallax
layer inside a clipped frame binds to the frame. Give the timeline a subject
whose own nearest scroll container is the page, and have the layer consume
it by name.

**A hidden document deactivates scroll timelines and IntersectionObserver.**
Before debugging "the motion is dead", check \`document.visibilityState\` — a
background tab or an automation window reports \`hidden\`, and every
scroll-driven animation on the page reads as inactive regardless of whether
the CSS is right.

**\`scrollbar-width\` disables \`::-webkit-scrollbar\` in Chrome.** Setting
either standard property to anything but \`auto\` makes Chrome ignore every
pseudo-element rule on that element. You cannot use both APIs; pick one. The
standard properties cannot ask for a bar that takes layout space rather than
floating and fading, so a shelf that needs a permanently visible scrollbar
has to reset them to \`auto\` and draw the bar with the pseudo-elements.

**\`margin-inline: auto\` on a grid item removes the stretch.** The item
shrinks to its content width — and if an \`aspect-ratio\` is deriving the
height from that width, the whole box collapses. Use \`justify-self: center\`.

**A positioned element paints above non-positioned in-flow content.** A
\`position: relative\` cover strip renders on top of an avatar pulled into it
with a negative margin. Remove the positioning rather than reaching for a
z-index.

**Each row of a log or table needs shared tracks.** If every row is its own
grid, \`auto\` columns size per row and nothing lines up. Use \`subgrid\` on the
rows with the tracks declared on the container.

## Accessibility floor

- Clickable cards use ONE real link stretched over the card, never a click
  handler on a div.
- Status is text first: the word is the fact, colour is decoration on top.
- A logo or mark carries \`role="img"\` and the company name as
  \`aria-label\` — a logo is a name written down.
- Motion respects \`prefers-reduced-motion\`. Note that the usual global guard
  (collapsing \`animation-duration\`) does **not** stop a scroll-driven
  animation, because a progress-based timeline ignores declared duration.
  Those need switching off at the timeline.
- Never hide a horizontal shelf's scrollbar. It is the only affordance most
  people get, and hiding it hides content from the people least able to find
  it another way.
`;

files["references/patterns.md"] = `${stamp}

# Page patterns

## Bands

A marketing page in this system is a stack of full-width **bands**. Each is
one section with one job.

\`\`\`html
<section class="ns-band ns-band--sunken">
  <div class="ns-band__inner">
    <header class="ns-band__head">
      <span class="ns-kicker">Kicker</span>
      <h2 class="ns-band__title">The heading</h2>
      <p class="ns-band__lede">The framing sentence.</p>
    </header>
    <!-- the band's content -->
  </div>
</section>
\`\`\`

Shared grammar:

- \`.ns-band__inner\` is the container and the gutters; never set a page width
  on the band itself.
- \`--sunken\` alternates the ground so consecutive bands read as separate.
  \`--tight\` is a thinner band. \`--dark\` is the navy console surface, which
  clips with \`overflow: clip\` so sticky and scroll timelines still work
  inside it.
- Vertical rhythm comes from the semantic spacing scale (\`--stack-lg\`
  between page sections), not from raw \`--space-N\`.

## The admission test for a new section

**A band must answer a question no other band on the page answers.** That is
the whole test, and it is what stops a page becoming a brochure. A section
that restates an existing one in a different arrangement is a variant, not a
section, and belongs as a modifier or not at all.

Worked example — a learning-site homepage, in the order a visitor actually
asks:

| Band | The question |
| --- | --- |
| hero | what is this, and what do I do first |
| logo wall | who else trusts it |
| router | which of these am I |
| showcase | why this instead of the free alternative |
| path | where do I enter |
| catalogue | what exactly do I get |
| video | show me one |
| stats | how big, how real |
| sample | is the writing any good |
| scope | is the thing MY job needs in here |
| compare | what changes about me |
| pricing | what does it cost |
| author | who is behind this |
| testimonials | did it work for someone like me |
| shipped | is this thing still alive |
| fit | should I NOT buy this |
| FAQ | the last objections |
| CTA | the one closer |

Two rules that follow from it:

- **Cut from the bottom, never the middle.** A page without testimonials
  still works; a page without the merchandise is a brochure.
- **One closer per page.** If a second call to action wants the end of the
  page, it is competing with the first, and one of them is going to lose.

## Choosing between similar components

Most misuse is a component doing a job its neighbour does better:

- **Feature grid vs showcase rows.** A grid is right when each claim is a
  SENTENCE. The moment a claim needs a picture, a paragraph and somewhere to
  go next, three cells stop working — the picture is a thumbnail, the
  paragraph is clipped, and there is nowhere for the link.
- **One quote vs a wall of them.** A single quotation set large is an
  argument. A crowd is evidence there are many. They are different claims;
  a page can carry both, and neither substitutes for the other.
- **Profile vs testimonial.** A profile answers "who is this" in the first
  glance — cover, face, name, title, fields. A testimonial leads with the
  person SPEAKING. Leading a profile with a paragraph makes the reader work
  for the name.
- **Glyph cover vs placeholder.** A placeholder says "a picture is MISSING
  here" and should embarrass somebody into supplying one. A glyph cover says
  "an icon is the artwork" and is finished. Shipping placeholders as
  permanent card art is how a catalogue ends up looking unbuilt.

## Motion

One entrance per BLOCK, never per element. A page where twelve things fly in
individually is a page nobody can read while it assembles itself. Put the
animation on the container and let the children inherit a staggered index,
capped — every stagger that hurts is one that multiplied the index without a
ceiling.
`;

/* =======================================================================
   Write or check
   ===================================================================== */
let stale = [];
for (const [rel, body] of Object.entries(files)) {
  const abs = join(OUT, rel);
  const current = existsSync(abs) ? readFileSync(abs, "utf8") : null;
  if (current === body) continue;
  if (CHECK) { stale.push(rel); continue; }
  mkdirSync(dirname(abs), { recursive: true });
  writeFileSync(abs, body);
}

if (CHECK) {
  if (stale.length) {
    console.error(`The portable skill bundle is stale — ${stale.length} file(s) differ:\n`);
    for (const f of stale) console.error(`  .claude/skills/namaste-ui/${f}`);
    console.error("\nIt is generated from the tokens, the component layer and the COMPONENTS array,");
    console.error("so a token or class that changed without regenerating it means the pack now");
    console.error("teaches a version of this system that no longer exists.");
    console.error("\nRun: node scripts/build-skill.mjs");
    process.exit(1);
  }
  console.log(`Skill bundle check passed — ${Object.keys(files).length} file(s) current.`);
} else {
  console.log(
    `wrote .claude/skills/namaste-ui/ — ${Object.keys(files).length} files, ` +
    `${publicTokens.length} tokens, ${classCount} classes, ${COMPONENTS.length} components`,
  );
}
