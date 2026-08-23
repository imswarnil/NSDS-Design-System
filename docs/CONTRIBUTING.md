# Contributing to NSDS

## Before you add a component

Three questions, in order:

1. **Does the platform already do this?** `<dialog>`, `<details>`,
   `<progress>`, `<meter>`, `<select>` and the popover attribute already
   implement focus trapping, find-in-page, keyboard handling and correct
   announcements. Restyle them; do not reimplement them. Most accessibility
   bugs in design systems are a native element that was replaced by a `<div>`.

2. **Do both products need it?** If only the Ghost theme needs it, or only the
   Next.js app, it belongs in that product. A design system that absorbs
   one-product requirements becomes a third codebase to maintain.

3. **Does it pass the five principles?** They are in `readme.md`. A new
   component that needs a shadow to read as elevated, or a second solid color,
   or a 300ms spring, is not a new component — it is a request to change a
   principle, which is a separate and much larger conversation.

## The shape of a component

Every component is up to four files, and which ones you need depends on who
renders it:

```
components/<domain>/Thing.jsx        React wrapper — behaviour only, no styling
components/<domain>/Thing.d.ts       types, with the WHY in the doc comments
components/css/<domain>.css          the actual styling, as .ns-* classes
templates/thing.html                 generic HTML contract, if it is a full surface
```

The split is the point. **All styling lives in the CSS layer**, because that is
the only part Handlebars and React can genuinely share. A React component that
styles itself inline is a component the Ghost theme has to reimplement, and two
implementations of one thing is how a design system dies.

React contributes only what markup cannot express: generated ids, ARIA wiring,
roving tabindex, focus restoration.

## Rules the linter enforces

`npm run check:principles` fails the build on any of these inside
`components/css/`:

| Not allowed | Use instead |
|---|---|
| A color literal | `--color-*` |
| A radius literal | `--radius-sm/-btn/-card/-pill` |
| A `z-index` literal | `--z-*` (six layers; a seventh means the layout is wrong) |
| A transition duration literal | `--duration-fast/-base` + `--ease-out` |
| A `font-family` literal | `--font-sans/-heading/-mono/-icon` |
| A padding/margin/gap literal | `--space-*` or a `--pad-*`/`--gap-*`/`--stack-*` alias |
| A border wider than 3px | the hairline is 1px; accents are 2–3px |

If a value genuinely cannot be a token, append a CSS comment starting
`lint-ok:` and the reason, on that line. The exception then has to be argued
for in the diff rather than buried in a config file.

**Do not write a `var()` fallback for a token that exists.** `var(--space-0-5,
2px)` is a second place for the value to drift and the linter reads inside the
fallback anyway. Use the token bare. Fallbacks are only for genuinely
per-instance variables the component receives from markup — `--ns-bar`,
`--fx-progress`, `--ns-toc-progress`.

### Two more annotations the checks understand

| Annotation | Where | What it means |
|---|---|---|
| `lint-ok: <reason>` | `components/css/` | this raw value cannot be a token, and here is why |
| `used-by: <product>` | `components/css/`, on the rule | this class is rendered by the Ghost theme or the LMS, not by anything here, so `check-markup.mjs` should not report it as undemoed |
| `px-ok: <reason>` | line 2 of a `.card.html` | this card draws miniatures of real 1920px frames, so the px font sizes inside its tiles are scaled artwork rather than UI copy |

`used-by:` is not a way to silence the undemoed report. If the class is
rendered anywhere in this repo, give it a demo instead — a component with no
demo is a component nobody can see, which is the failure the check exists to
catch.

### The icon subset

`icons/phosphor.css` and both `.woff2` files are **generated** by
`scripts/subset-icons.py` from the `@phosphor-icons/web` devDependency. Adding
an icon is: write the class, run `python3 scripts/subset-icons.py` (needs
`pip install fonttools brotli`), commit the regenerated `icons/`.

`check-icons.mjs` fails the build on a `ph-` class with no glyph, because a
missing glyph does not render a box — it renders empty space the width of a
character, which ships as an invisible control.

## Accessibility floor

Not aspirations — a component missing any of these is unfinished:

- Every interactive element reachable and operable by keyboard alone.
- Focus is visible. `:focus-visible`, never `outline: none` without a
  replacement.
- Icon-only controls have `aria-label`. This is the most common defect in every
  component library, including the ones you have used.
- State lives on an ARIA attribute (`aria-selected`, `aria-current`,
  `aria-invalid`, `aria-expanded`), not a CSS class — so what is seen and what
  is announced cannot drift apart.
- Never color alone. Status pairs a dot and a word with the hue.
- Interactive targets meet `--target-comfy` (40px), or `--target-min` (24px)
  only for dense inline controls beside a larger target.
- Overlays close on Esc and return focus to their trigger.
- Something is stated for `prefers-reduced-motion` and `forced-colors: active`.

## Changing a token

Token values are load-bearing across two products.

- **Adding** a token: additive, a minor release.
- **Changing a value**: a major, even though nothing breaks at build time —
  every screen in both products moves.
- **Removing or renaming**: a major, and deprecate first. Look at how
  `--color-accent-*` was retired: kept as an alias, marked deprecated in a
  comment, call sites left working.

After any token edit:

```bash
npm run build && npm run check
```

`tokens/*.css` is the source of truth. `tokens.json`, `tokens.js`,
`tokens.d.ts` and `tokens/tailwind.css` are **generated** — editing them
directly will be overwritten and CI will catch it.

## Touching the chart palette

Do not hand-pick a hue. The palette was solved against six computable checks,
and a well-meaning "slightly warmer" nudge can drop adjacent-pair separation
under deuteranopia below the readable floor with no visible change to you.

```bash
npm run check:palette
```

If it fails, re-step the offending hue until it passes. Do not lower the bar.

## Pull request checklist

- [ ] `npm run build && npm run check` passes
- [ ] Styling is in the CSS layer, not in the `.jsx`
- [ ] If it is a full surface, `templates/` has the generic HTML for it
- [ ] Keyboard-tested: Tab, Shift+Tab, Enter, Space, arrows, Esc
- [ ] Checked in dark mode
- [ ] Checked at 320px wide
- [ ] `.d.ts` doc comments say *why*, not just *what*
- [ ] `docs/CHANGELOG.md` updated
- [ ] `node scripts/check-markup.mjs` and `node scripts/check-icons.mjs` pass —
      neither is in the seven gates' fast path but both fail on real defects
- [ ] If you touched a `.card.html`, its `viewport="WxH"` still matches what it
      renders to. Measure it; a card framed at the wrong height gets a
      scrollbar or a band of dead space, and nothing else will tell you
