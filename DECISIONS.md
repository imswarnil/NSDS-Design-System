# Open decisions — design-system reorganization

**Status: five of the nine questions below are now closed, because the work
that answered them has shipped.** What is left is genuinely open and is
recorded here rather than in `improve.md`, because these are *decisions to
make*, not *tasks to do*. `improve.md` is the task list; this file is the
question list. Nothing in here blocks anything in there.

Full evidence for the original claims is in [`report.md`](./report.md).

**How to use this:** fill in the `**Decision:**` line under each open item.

---

## Closed

These were the three blockers. All three are resolved and the reasoning is
recorded so the answers do not get re-litigated.

### B1. 62 uncommitted files on `main` — **CLOSED**

Resolved as option (a): the session work was committed to `main` first. The
working tree is clean apart from work in progress, and reorganization diffs
will read as reorganization diffs.

### B2. `scripts/subset-icons.py` is missing — **CLOSED**

Resolved better than either option on offer. `@phosphor-icons/web@2.1.2` is now
a devDependency and `scripts/subset-icons.py` is back in the tree, so the
subset is regenerable by anyone who runs `npm install`. All 37 previously
missing glyphs resolve from the real font — no hand-remapping and no
compromises. `icons/icons-gap.css`, the 31 hand-drawn SVG masks that were
covering for the missing subsetter, is deleted: one source for icons again.

`scripts/check-icons.mjs` now **fails the build** on a `ph-` class with no
glyph, and `--list` makes it the single definition of "which glyphs are used",
which the subsetter reads. The gate and the generator cannot disagree.

### B3. Generated directories are committed — **CLOSED**

Resolved as option (a): `preview/` and `_site/` are git-ignored, `dist/` stays
tracked because the Ghost theme's own pipeline consumes the flat bundle
directly and `build-css.mjs --check` proves it matches source.

### E. Dead code — 171 classes, 28 templates — **CLOSED as to the classes**

Resolved as option (i), triage-first. The undemoed count is down from 169 to
**37**, and the reduction is mostly *documentation* rather than deletion:

- The checker was wrong about a third of them. `check-markup.mjs` was reading
  class names out of CSS comments, could not see classes composed in a
  template literal (`ns-pattern--${n}`), could not see classes composed in a
  React expression (`className={["ns-trackcard", …]}`), could not see classes
  built in a `.js` helper, and called a block root with no declarations of its
  own a typo. All five are fixed, and the header explains each one.
- Nine real components had CSS and no page. They have pages now — the training
  hero, the learning path, tiers, the content gate, contributors, the pager,
  curriculum position, the thumbnail and the training layout.
- Layout primitives the two products write on every template but this repo
  never renders are annotated `used-by: ghost-theme, lms`, which the checker
  now understands.

The half-built features named in the original item are still half-built and
still documented rather than deleted: `.ns-gate` (the paywall) now has a
component page, and `.ns-calendar` (the date picker) is documented as the
anatomy of the popup its script builds.

**Still open:** the 28 unreferenced templates. Nobody has triaged those.

### F. Layering model for `components/css/` — **CLOSED as recommended**

Option (ii): the flat list stays and the layering is expressed by import
order in `index.css`. No lint rule for dependency direction has been written
yet — see the open item below.

---

## Still open

### A. Source of truth for documentation markup

`scripts/component-docs.mjs` re-types HTML that also lives in `templates/`, and
**41 of 52 templates overlap verbatim**. Change a template and the docs quietly
keep showing the old version.

This got *worse*, not better, in the process of closing item E: nine new
component entries were written by hand rather than extracted from templates,
because there is still no extraction mechanism.

- **(i)** The docs generator **reads** `templates/` and extracts named regions.
  One copy, permanently. The templates need region markers and the docs entries
  need rewriting to reference them. *Recommended.*
- **(ii)** Keep both copies, add a check that fails the build when they
  diverge. Much cheaper, and you maintain two copies forever.

**Decision:** _______

---

### B. React file granularity

Two conventions in use at once: one file per component (`core`, `course`) and
one file per family (`navigation`, `ai`, `admin`). So `Button` is where you
would guess and `CourseNav` is not.

- **(i)** One file per component everywhere. Guessable paths, honest
  tree-shaking. Touches ~8 families. *Recommended.*
- **(ii)** One file per family everywhere.
- **(iii)** Leave it; document the rule as "families ≤5 components share a file".

**Decision:** _______

---

### C. Canonical documentation format

Components are documented three ways — a `.prompt.md` beside the component (34
of 49), an entry in `component-docs.mjs` (now 153), and a prose header in the
CSS, frequently the most detailed of the three. Nothing says which wins.

- **(i)** CSS header = design rationale, `component-docs.mjs` = rendered docs,
  `.prompt.md` becomes mandatory and *generated* from the other two.
  *Recommended.*
- **(ii)** `.prompt.md` becomes canonical and the docs generator reads it.
- **(iii)** Pick one and delete the other two.

**Decision:** _______

---

### D. Terse block names

`.ns-ccard` · `.ns-chero` · `.ns-thero` · `.ns-tpager` · `.ns-bcard` ·
`.ns-ltype` · `.ns-laccess` · `.ns-tthumb` · `.ns-pframe` · `.ns-aiset` are
contractions you have to already know, in a codebase that otherwise uses full
words.

One thing has changed since this was written: `.ns-blog-`, listed here as
looking like a bug, **was** a bug — in the checker, not the CSS. It was a
class name read out of a comment. There is no `.ns-blog-` class.

- **(i)** Rename to full words, keep the old names as aliases for one release.
- **(ii)** Leave them, document the contraction list in `ARCHITECTURE.md`.
  *Recommended — the cost/benefit here is poor.*
- **(iii)** Rename only `.ns-tthumb`.

**Decision:** _______

---

### G. A dependency-direction lint rule (new)

Item F chose "encode the layering in import order plus a lint rule that fails
if a domain stylesheet defines a core block". The import order half is done;
the lint rule is not written, and the violations it was meant to catch are
still there — `lms.css` extends `.ns-card`, `admin.css` defines the generic
`.ns-taginput`.

- **(i)** Write the rule and fix the violations it finds.
- **(ii)** Write the rule, grandfather the existing violations with an
  annotation, fail on new ones. *Recommended — same guarantee, ships today.*
- **(iii)** Leave it documented and unenforced, which is where it has been.

**Decision:** _______

---

### Scope check

**Does "the design system" mean the whole repo, or the LMS surfaces?**
`deck`, `helpdesk`, `ai`, `admin`, `blog` and `ads` are substantial subsystems
carrying risk that is hard to assess from a read.

- **(a)** Whole repo.
- **(b)** LMS + shared core only, leaving other domains until their turn.
- **(c)** Shared core only.

**Decision:** _______

---

## My default, if you would rather not decide item by item

**A(i) · B(i) · C(i) · D(ii) · G(ii) · Scope(b)**

That kills the one real duplication, makes import paths guessable, adds the
missing guardrail without a migration, and deliberately avoids churn that buys
only tidiness.
