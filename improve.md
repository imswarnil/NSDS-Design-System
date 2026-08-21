# improve.md — audit findings, as runnable instructions

An audit of tokens, foundations, typography and sections (2026-08-22).
Each item below is written as a standalone instruction for a future Claude
Code session: paste one item in, and it carries the evidence, the files and
the acceptance check with it. Items are ordered by severity within each
group. Delete an item when it ships.

Ground rules for whoever executes these: run `npm run build && npm run check`
after every change and judge by **exit code**, not by grepping output; a token
edit is a cross-product change (see `docs/CONTRIBUTING.md` § Changing a token);
adding a token requires its Tailwind emit in `scripts/build-tokens.mjs` in the
same commit.

---

## A — Defects (fix first)

### IMPROVE-01 · 37 icons render as invisible controls

`node scripts/check-icons.mjs` reports 37 icon names used in shipped markup
with no glyph in `icons/phosphor.css` — including `ph-check`, `ph-caret-left`,
`ph-caret-up`, `ph-bell`, `ph-arrow-square-out`, used from `Navbar.jsx`,
`SyntaxHighlighter.jsx`, `ai-chat.html` and others. A missing glyph renders
as empty space the width of a character: an invisible button, not a broken
one. This is DECISIONS.md item B2 and it has been open since the audit.

**Do:** the subset regenerator named in `icons/phosphor.css`'s own header
(`scripts/subset-icons.py`) is not in the repo. Either (a) rebuild the subset
from the full Phosphor woff2 so all 37 resolve, or (b) remap all 37 by hand to
glyphs the subset carries (accepting compromises — there is no bell, check, or
caret-left in the current set) and document each remap. Then flip
`scripts/check-icons.mjs` from warn to **fail**, per the note in its own
header, so this class of defect can never accumulate again.

**Accept:** `node scripts/check-icons.mjs; echo $?` → 0 reported missing, and
the script exits non-zero when a bogus icon name is temporarily added.

### IMPROVE-02 · check-icons false-positives on `ns-ph--sm`

The same report lists `ph--sm` as a missing icon, sourced from
`blog-post.html` and `component-docs.mjs`. That is not an icon — it is the
`ns-ph--sm` placeholder modifier being matched by the checker's `ph-*` regex.
Fix the pattern in `scripts/check-icons.mjs` to require a word boundary before
`ph-` (or to skip classes also matching `ns-*`), so the report only lists real
glyph names. Do this before IMPROVE-01's "flip to fail", or the false positive
blocks the build.

**Accept:** `ph--sm` gone from the report; real missing icons still listed.

### IMPROVE-03 · `--leading-snug` is referenced but does not exist

`scripts/build-preview.mjs` (search `leading-snug`) sets
`line-height: var(--leading-snug, 1.4)` — the token is defined nowhere, so the
styleguide silently runs on the fallback. The leading ramp jumps from 1.3
(`--leading-heading`) to 1.6 (`--leading-body`) with nothing between, and the
styleguide evidently wanted the middle step.

**Do:** either add `--leading-snug: 1.45` to `tokens/typography.css` (with the
`--ns-*` alias pattern and a line saying what it is for: multi-line UI text —
card excerpts, TOC entries, notes — where 1.6 is airy and 1.3 clips), plus its
emit in `build-tokens.mjs`; or replace the reference with an existing token
and delete the fallback. Adding it is the better call: `.ns-bcard__excerpt`,
`.ns-toc` entries and several `line-height: 1.4/1.45`-ish spots in cards want
exactly this step.

**Accept:** no `var(--leading-snug, …)` fallback form remains anywhere;
`npm run build && npm run check` exit 0.

---

## B — Tokens & foundations

### IMPROVE-04 · `--container-prose` and `--measure-prose` disagree since the type fork

`tokens/layout.css` says `--container-prose: 42rem` is "~68 characters of
**Inter** at `--size-body`". Both halves are stale: the face is Switzer, and
`.ns-prose` now reads at `--size-prose` (17px), not 14. At 17px, 42rem is
roughly **60ch**, while `tokens/typography.css` still ships
`--measure-prose: 68ch` — so the container caps every article narrower than
the measure token claims, and the two tokens now describe different lines.

**Do:** decide the reading measure once (60–66ch at 17px is the defensible
range), then reconcile: either widen `--container-prose` to ~46rem to honour
68ch, or (simpler, safer) keep 42rem, restate `--measure-prose` to the true
value, and rewrite both comments to name Switzer and `--size-prose`. Check
call sites of `--measure-prose`/`--measure-narrow` (callouts, standfirsts,
authorbox bio) still look right at whatever you pick. This moves every
article's line length in both products — treat as a visual change and
screenshot `demo-blog-post.html` before/after.

**Accept:** the two tokens and their comments agree with each other and with
the 17px reading size; build and checks exit 0.

### IMPROVE-05 · Unnamespaced keyframes in tokens/effects.css

`tokens/effects.css` declares `@keyframes fade-up` and `@keyframes marquee`
with no `ns-` prefix. Keyframe names are global and unlayered — a consuming
app with its own `fade-up` collides silently, and the codebase already has the
properly-namespaced `ns-fade-up` in `overlay.css` doing almost the same thing.
Today `fade-up` is only used by the styleguide's own chrome
(`build-preview.mjs`) and `marquee` by `display.css`/`type-fx.css`.

**Do:** rename `marquee` → `ns-marquee` (three call sites), delete `fade-up`
from effects.css entirely and point the styleguide's one usage at the existing
`ns-fade-up`. Also delete `ns-float` from effects.css **or** move all three to
the component layer — token files should carry custom properties, not
animations; `tokens/base.css`'s header makes exactly this argument for
`color-scheme`.

**Accept:** `grep -rn "@keyframes" tokens/` returns nothing;
`grep -rn "fade-up\|marquee" components scripts` shows only `ns-` names;
build + checks exit 0.

### IMPROVE-06 · Dead `var()` fallbacks for tokens that exist

Seven call sites write `var(--space-0-5, 2px)` (media.css, blog.css, prose.css
among them) — but `--space-0-5` is defined in `tokens/spacing.css`, so the
fallback is dead weight and a second place for the value to drift. Same
pattern: `var(--navbar-h, 3.5rem)` ×3, `var(--gap-grid, var(--space-4))`,
`var(--container-prose, 42rem)` in prose.css. Sweep `components/css` for
`var(--x, fallback)` where `--x` is a defined token and delete the fallbacks.
Leave the genuinely dynamic ones alone (`--v`, `--p`, `--fx-*`, `--ns-bar*`,
`--ns-toc-progress` are per-instance inline variables, not tokens).

**Accept:** `grep -rE 'var\(--(space|navbar|gap|container|pad|stack|size|color|radius|duration)[a-z0-9-]*, ' components/css` returns nothing; build + checks exit 0.

### IMPROVE-07 · `.ns-video--zoom` breaks the stated contract of `--duration-slow`

`tokens/effects.css` says the two long durations exist for one job — a
typographic effect that draws itself — and "**nothing interactive may use
these**". `components/css/media.css` (`.ns-video--zoom`) uses
`--duration-slow` (420ms) on a hover transition. Either the contract or the
call site is wrong.

**Do:** decide. If a poster zoom is decorative enough to earn 420ms, amend the
effects.css comment to say hover-triggered *decoration* on non-interactive
surfaces may also use `--duration-slow`, and note the exception at the call
site. If not, drop the zoom to `--duration-base` (180ms). Do not leave the
comment claiming a rule the codebase visibly breaks — a contract with one
silent exception is not a contract.

**Accept:** comment and call sites agree; build + checks exit 0.

---

## C — Typography

### IMPROVE-08 · base.css cites the old reading-weight argument, inverted

`tokens/base.css` (the `body` font comment) says: "450 (Book) is the reading
weight — see tokens/typography.css and fonts/README.md for why 400 is not."
Both cited files now argue the exact opposite — 400 **is** the reading weight,
450 was cargo from the Nunito-derived cut. The comment survived the font
migration and now sends a reader to two files that contradict it.

**Do:** rewrite that comment to match reality (the shorthand can't carry
weight, so it is its own declaration; the weight is `--weight-body` = 400; see
fonts/README.md § "Why body copy is 400"). While in the file, re-check the
antialiasing comment's "14px reading size" phrasing against the forked scale
(UI is 14, reading is 17) and adjust the wording so it names the UI size.

**Accept:** no comment in `tokens/` contradicts `fonts/README.md` on the
reading weight; grep `450` in tokens/ returns only the historical explanation
in typography.css if any.

### IMPROVE-09 · Reading-surface content still set at `--size-small` (13px)

`--size-small` has 147 call sites in `components/css` — the "everything looks
small" complaint lives here. Most are legitimate dense UI (meta rows, table
cells, rails). But several sit **inside the reading experience**, where the
surrounding prose is now 17px and 13px content is a two-step cliff:

- `.ns-comment__text` (blog.css) — comment bodies under an article
- `.ns-callout` body (blog.css) — asides *inside* prose
- `.ns-refs li` and `.ns-notice` (content.css) — reading blocks by definition
- `.ns-authorbox__bio` (blog.css)

**Do:** promote these to `--size-prose-small` (15px) — the step that exists
precisely for content inside articles — and leave genuine UI (bcard excerpts,
postmeta, archive rows, admin, player chrome) at `--size-small`. Sweep the
rest of the 147 with that one question: is this scanned or read? Screenshot
`c-comments.html` and `c-post-layout.html` before/after.

**Accept:** the four listed components read at 15px; no *scanned* surface was
touched; build + checks exit 0.

### IMPROVE-10 · Phone-width scale inversion: `--size-display` can render smaller than `--size-h1`

`--size-display` clamps `2rem → 3.25rem`. At a 360px viewport it resolves to
~2.1rem (≈34px), **below** the fixed `--size-h1: 2.5rem` (40px). A page that
uses display for its hero (`.ns-posthead__title`) and h1 elsewhere can invert
its own hierarchy on a phone.

**Do:** verify at 360px (posthead, hero band, and any `--size-h1` call site —
there are only ~6). If the inversion is reachable, raise the clamp floor to
`2.5rem` so display never drops below h1, or cap `--size-h1`'s use to pages
that have no display element. Note the decision in typography.css beside the
clamp.

**Accept:** at 360px no rendered display-role heading is smaller than an
h1-role heading on the same page.

### IMPROVE-11 · Specimen cards carry ~200 off-scale font sizes

`guidelines/` and `brand-content-creation/` cards are outside the linter's
scope, and it shows: 31× `font-size:11px`, 31× `10px`, plus `text-[10px]`,
`text-[9px]` arbitrary utilities. **Two different situations, one sweep:**
the scene-diagram cards (livestream, lesson-video, youtube) draw miniature
1920px frames where tiny px values are *correct* — leave those. The guideline
and README-style cards (`content-design`, `spacing-layout`, `states`,
`README.card.html`, thumbnail-styles) use raw px for ordinary UI copy that has
scale tokens — move those onto `text-fine`/`text-label`/`text-small` utilities
or `var(--size-*)`.

**Do:** sweep card-by-card with that distinction; do not blanket-replace.
Consider adding a comment convention at the top of diagram cards
(`<!-- px-ok: miniature of a 1920px frame -->`) so a future sweep knows to
skip them.

**Accept:** guideline-style cards carry no raw px font sizes; diagram cards
are marked; `npm run build` regenerates the styleguide cleanly.

---

## D — Sections & components

### IMPROVE-12 · 169 defined-but-undemoed `.ns-*` classes

`node scripts/check-markup.mjs` reports 169 classes with CSS but no appearance
in any demo, template or card — including whole families:
`ns-docs-layout(__main|__toc)`, `ns-page--prose/--wide/--demo`,
`ns-stack--xs/--md`, `ns-grid--sm`, `ns-ai--docked`, `ns-postmeta--dotted`.
The checker's own header says what this means: dead code, or a component
nobody can see. Each one is either (a) real and undocumented → give it a
variant demo in `scripts/component-docs.mjs`, (b) consumed only by the other
two repos → mark it with a `/* used-by: ghost-theme */`-style comment and
teach the checker to accept that annotation, or (c) dead → delete the CSS.

**Do:** triage the full list (run the checker for the current one), split it
into the three buckets, then work bucket (c) first — deletions are cheap wins —
and bucket (a) in batches of ~10 per session. `ns-blog-` appearing in the list
is a truncated-name artifact worth investigating in the checker while there.

**Accept:** undemoed count under 40, every survivor carrying either a demo or
a used-by annotation the checker understands.

### IMPROVE-13 · Content-creation cards hand-copy the hairline grid ~30 times

Nearly every card in `brand-content-creation/` re-declares the same
`linear-gradient` hairline-grid background inline, with drifting opacities
(.06/.07/.5/.55) and cell sizes (14–24px). `patterns/patterns.css` exists for
exactly this. Extract one `.ns-pattern-grid` (or reuse an existing pattern
class if one fits) with custom-property knobs for line alpha and cell size,
and migrate the cards to it. This is what makes a future "soften the grid"
decision one edit instead of thirty.

**Accept:** `grep -rc "repeating-linear-gradient\|linear-gradient(to right,rgb" brand-content-creation --include="*.card.html"` drops to near zero; cards render identically (spot-check three in the styleguide).

### IMPROVE-14 · Sections family: `--stack-lg/-xl` vs band padding are parallel scales

`sections.css` sets band rhythm with raw `--space-16`/`--space-10` while
`tokens/spacing.css` defines `--stack-lg: var(--space-16)` and `--stack-xl:
var(--space-24)` described as "between page sections / between major page
bands" — the exact same relationships, expressed twice. Point
`.ns-band`/`.ns-band--tight` (and any other band-level padding in the file)
at the `--stack-*` aliases so the semantic scale is the one place page rhythm
lives, and note in spacing.css that bands consume it.

**Accept:** `grep -n "space-16\|space-20\|space-24" components/css/sections.css` shows stack aliases (or a lint-ok reason) instead; visual diff of `demo-sections.html` is nil.

---

## E — Docs hygiene

### IMPROVE-15 · Kill the remaining stale scale claims

After the type fork, sweep every prose claim about the scale so no document
contradicts `tokens/typography.css`: `guidelines/spacing-layout.card.html`
still prints `--container-prose · 42rem · reading measure` (tied to
IMPROVE-04's decision); confirm the styleguide type section, `SKILL.md`, and
`docs/INTEGRATION.md` say "UI 14 / reading 17" wherever they state a body
size; and re-check `LIVE.md`'s "~4 MB — 98 styleguide pages, 38 specimen
cards" table intro, which is now 173 pages / 55 specimens / ~13 MB. Numbers
that drift teach the wrong system.

**Accept:** `grep -rn "reading copy is 14\|98 styleguide\|38 specimen" . --include="*.md" --include="*.html"` (excluding node_modules/_site/preview) returns nothing.

### IMPROVE-16 · DECISIONS.md is stale and still uncommitted

`DECISIONS.md` sits untracked at the root, still phrased as "waiting on you,
nothing will be changed" — but several of its items have since moved (B1's 62
uncommitted files are long since committed; B2's icon problem is IMPROVE-01
here). Reconcile it: mark what is resolved, fold what is still open into this
file or into issues, then either commit the residue or delete the file. An
open-questions doc that is wrong about which questions are open is worse than
none.

**Accept:** `git status --short` shows no untracked DECISIONS.md; anything
still genuinely open lives in exactly one place.
