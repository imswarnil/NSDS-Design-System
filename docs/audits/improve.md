# improve.md — audit findings, as runnable instructions

An audit of tokens, foundations, typography and sections (2026-08-22).
Each item below is written as a standalone instruction for a future Claude
Code session: paste one item in, and it carries the evidence, the files and
the acceptance check with it. Items are ordered by severity within each
group. **Delete an item when it ships.**

Ground rules for whoever executes these: run `npm run build && npm run check`
after every change and judge by **exit code**, not by grepping output; a token
edit is a cross-product change (see `docs/CONTRIBUTING.md` § Changing a token);
adding a token requires its Tailwind emit in `scripts/build-tokens.mjs` in the
same commit.

---

## Shipped 2026-08-22

IMPROVE-01 through IMPROVE-16 are done and have been deleted from this file
per the rule above. In summary, so the next reader knows what changed under
them:

- **Icons.** `scripts/subset-icons.py` is back, driven by an
  `@phosphor-icons/web` devDependency and by `check-icons.mjs --list` — one
  definition of "what is used", shared by the gate and the generator. All 37
  missing glyphs resolve from the real font; `icons/icons-gap.css` and its 31
  hand-drawn SVG masks are deleted; the checker **fails the build** now.
- **Typography.** `--leading-snug` (1.45) exists and is used where 1.6 was
  airy and 1.3 clipped. `--size-display`'s clamp floor is `--size-h1`, so a
  hero can no longer render smaller than a heading on a phone. Callouts,
  comments, references, notices, author bios, checklists, comparisons,
  glossaries and code blocks inside prose read at `--size-prose-small` (15)
  instead of `--size-small` (13). Every mono run is on `--size-mono` rather
  than borrowing `--size-small`.
- **The measure.** `--container-prose` and `--measure-prose` agree and both
  comments carry the measured arithmetic (42rem at 17px in Switzer = 68.6ch),
  plus the caveat that 68ch is ~88 real characters.
- **Keyframes.** None in `tokens/`. All `ns-`-prefixed, all in
  `components/css/motion.css`, and the byte-identical duplicate pairs
  (`fade-up`/`ns-fade-up`, `ns-fade-in`/`ns-anim-fade`) are collapsed.
- **Checkers.** `check-markup.mjs` had five blind spots (CSS comments,
  template-literal classes, React-expression classes, `.js` helpers, block
  roots with no declarations of their own). All five fixed, plus a `--list`
  mode and a `used-by:` annotation. Undemoed count: 169 → 37.
- **Cards.** The hairline grid is one value (`--ns-gridlines-image`) instead of
  ~21 hand-copied gradients; guideline cards are on the scale; diagram cards
  carry a `px-ok` marker; and 30 stale `viewport="WxH"` values were measured
  and corrected.

---

## Still open

### IMPROVE-17 · The undemoed tail — 37 classes

`node scripts/check-markup.mjs --list` prints the current list. It is under
the 40 the original item asked for and every entry is now *real* — the
checker's own false positives are gone. What is left is almost entirely
**modifiers of components that already have a page**: `ns-table--fixed` has a
demo, `ns-lesson--roomy` does not; `ns-banner--error` has one,
`ns-toast--error` did not until this pass.

**Do:** work the list file by file. For each class, the question is only ever
one of three: (a) it is real and a variant demo in
`scripts/component-docs.mjs` should exercise it, (b) it is rendered by the
Ghost theme or the LMS and never here, so annotate the rule `used-by:`, or
(c) it is dead and the CSS should go. Prefer (a) — a modifier with no demo is
a modifier the next person reimplements.

**Accept:** undemoed count in single digits, every survivor carrying either a
demo or a `used-by:` annotation.

### IMPROVE-18 · 28 templates referenced by no build

`report.md` found 28 files in `templates/` that no demo, no doc entry and no
build step reads, yet all of them ship in the npm package. This is the half
of DECISIONS.md item E that the class triage did not touch.

**Do:** for each, decide whether it is (a) the framework-agnostic contract for
a surface that genuinely exists, in which case a `DEMOS` entry in
`scripts/build-preview.mjs` should render it, or (b) a leftover, in which case
delete it. Note that `templates/` is in `package.json`'s `files`, so a
leftover is not free — consumers download it.

**Accept:** every file in `templates/` is either rendered by a demo, named by
a component doc entry, or gone.

### IMPROVE-19 · The reading measure is at the loose end

Not a defect, a decision, and it is written up in full beside
`--container-prose` in `tokens/layout.css`. 42rem at `--size-prose` is 68.6ch,
which is ~88 real characters of running English — inside the 45–90 a single
column can hold, but at the top of it. 40rem would be ~84.

**Do:** look at `demo-blog-post.html` at a desktop width and decide. If it
narrows, `--container-prose` is the token, `--measure-prose` follows it, and
both comments carry the arithmetic already. This moves every article in both
products, so screenshot before and after.

**Accept:** a decision, recorded in the comment either way.
