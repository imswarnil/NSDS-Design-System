# Changelog

Notable changes to NS Design System. The version here is the **design system's**, not
the Ghost theme's — they are released independently.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning is
semver, with one design-system-specific reading of it:

- **major** — a token is removed or renamed, a class name changes, or a visual
  default changes enough to move layout in a consuming product.
- **minor** — new tokens, new components, new variants. Additive only.
- **patch** — a fix that does not change the rendered result in any product
  that was already correct.

A color *value* changing is a **major** even though nothing breaks at build
time: every screen in both products moves.

## [Unreleased]

### Added — Blog, as its own family

The writing half of the product now has a section of its own, sharing
everything it can with the rest of the system: `.ns-prose` is still the
reading surface, `.ns-card` the frame, `.ns-strip` the shelf, and
`.ns-lprogress--article` the reading line — the same control on a lesson and
on a post, so it has one implementation. New stylesheet
`components/css/blog.css`; wiring in `assets/js/blog.js`.

- **Post card** (`.ns-bcard`) — five shapes over one anatomy: default,
  `--row`, `--wide` (the one featured post), `--minimal` (no cover, for a
  sidebar), `--overlay` (title on the image, scrimmed). Cover with the
  category riding it, balanced title, two-line clamped excerpt, and an
  explicit **empty-cover state** — most posts have no art, and saying so with
  the system's glyph beats a grey rectangle pretending an image failed.
- **Post header** (`.ns-posthead`) — five versions, same parts in the same
  order: default/centred, `--cover`, `--wide`, `--minimal`, `--console`. The
  **standfirst** is one sentence saying what the piece argues, not the first
  paragraph repeated.
- **Post meta** (`.ns-postmeta`) — author · date · reading time, identical on
  the card, in the header and in the footer, so a reader learns it once.
- **Post layout** (`.ns-post`) — TOC rail | article | share rail. Both rails
  are droppable (share below 80rem, TOC folds to a `<details>` below 64rem)
  and the article column never widens to fill the space they leave: the
  measure is the point of the page.
- **Table of contents** (`.ns-toc`) — a real `<nav>` of real anchor links
  that works with JS off. `assets/js/blog.js` adds a scroll-spy that marks
  the current section with `aria-current`, and will build the outline from
  the article's own h2/h3 (adding ids where they are missing) when given
  `data-toc-from`. Deliberately a rAF-throttled scroll read rather than an
  IntersectionObserver: the question is "which heading did I last pass",
  which an observer cannot answer when a section is taller than the viewport.
- **Callout** (`.ns-callout`) — note / tip / warn / danger. A 3px leading
  edge and a tint, never a heavy box. The WORD is the signal and the colour
  only agrees with it.
- **Series** (`.ns-series`), **author box** (`.ns-authorbox`), **post nav**
  (`.ns-postnav`, prev/next by title), **listing** (`.ns-blog-listing`,
  `.ns-blog-grid`, `.ns-blog-archive`).

Two page templates: `templates/blog-post.html` and
`templates/blog-listing.html`, both with full-screen demos in the styleguide.

### Changed — the shelf is a shared primitive

`.ns-strip` moved to `components/css/display.css`: the scroll-snapped shelf
is not a course-specific object, and the blog renders the identical one.
`.ns-course-strip` is kept as an alias so existing markup does not break.

### Fixed — a strip no longer widens the column it is dropped into

`grid-auto-columns: minmax(14rem, 1fr)` is a **definite** track minimum, so
four cards gave the shelf a 944px min-content that propagated up through its
ancestors — a related-posts strip inside a 42rem reading column dragged the
author box and the prev/next row out with it, past the share rail. Both
strips now use `minmax(min(14rem, 100%), 1fr)`, the same resolvable-minimum
idiom the card grids already used.

### Changed — the default button is smaller

**Visual change in both products.** The default `.ns-btn` carried a
`--size-body` label at 40px tall, which is visually larger than the card
title it usually sits under — the most common proportion bug in a design
system. The default now carries a **`--size-small`** label with tighter
padding. The touch target is untouched: `min-block-size` is still
`--target-comfy` (40px). Height is the accessibility property, type size is
the typographic one, and they are now set independently.

The size scale is four steps plus one: `--xs` (28px, mono/uppercase, for a
dense inline control with a larger sibling beside it), `--sm` (32px), the
default (40px), `--lg` (44px), and `--xl` (52px) — which exists for exactly
one thing, the single primary action in a hero.

New button variants: `--soft` (a brand tint between outline and primary, for
a secondary action an outline loses), `--pill`, `--block-sm` (full width on a
phone only), `--swap` (two labels in one grid cell, so a toggle does not
change width when it flips), `.ns-btn__arrow` (a trailing arrow may travel
2px — the arrow doing its job, not a lift), `.ns-btn__count`,
`.ns-btn__kbd`, `.ns-btn-group--pill`, `.ns-btn-group--block`, and a generic
`[aria-pressed="true"]` toggle state.

### Fixed — `[hidden]` now actually hides

The attribute's `display: none` lives in the UA stylesheet and loses to any
author rule, so every component that set its own display (`.ns-btn` is
`inline-flex`, `.ns-filters__applied` is `flex`) silently ignored it — a
"hidden" button sat there fully visible. `tokens/base.css` now declares
`[hidden] { display: none !important }`. This is the one place `!important`
is correct: it is not a style preference, it is the meaning of the attribute.

### Added — the LMS layer, properly

**Course card** (`.ns-ccard`) — five shapes over one anatomy (default,
`--row`, `--compact`, `--featured`, `--minimal`), plus corner flags, the
runtime chip on the media, a play affordance, and the **lesson peek**: the
first few lessons expand on hover *and on keyboard focus*, as real DOM
content collapsed with a `grid-template-rows` transition rather than
`display: none`, so find-in-page reaches it — and simply open where hover
does not exist.

**Small parts** — `.ns-rating` (the number is the content, the stars are a
clipped overlay), `.ns-authors` (an avatar stack capped at four then a
count), `.ns-price` (current and struck prices at deliberately different
sizes), and `.ns-ltype`, the lesson-type identifier: video, article, quiz,
lab, live, download, always icon **plus word**.

**Curriculum** — rebuilt on native `<details>`, so collapse, keyboard
operation and in-page find come from the platform. Adds a toolbar with
totals and expand/collapse-all, per-section completion, and three looks:
`--timeline` (a connector with state dots), `--compact`, and rows carrying
stills. Lesson rows gained `__body`/`__sub` (a second line for the type and
duration), `__thumb`, `__badge` ("Preview"), and `--compact` / `--roomy`.

**Lesson navigation** — prev/next by NAME, with a still or the type glyph, a
locked state that still navigates (to the upgrade page), and a way back to
the full list. Below 48rem the thumbs and progress row are dropped, not
shrunk: the two named buttons *are* the navigation on a phone.

**Course player** — `.ns-player--fixed` locks the player to one viewport: the
page stops scrolling and the two columns scroll independently, with the
stage sticky and capped at `62dvh` so the lesson title never lands below the
fold. Padding through the column dropped from `--pad-card-lg` to
`--pad-card`. Below lg it reverts to the scrolling variant automatically.

**Per-type lesson progress** (`.ns-lprogress`) — `--video` (elapsed/total
with chapter ticks), `--article` (a 2px reading hairline, no widget),
`--quiz` (pips plus the score). One bar for all three is how a quiz ends up
claiming you are 60% *correct* when you are 60% *finished*.

**Course hero** (`.ns-chero`) — five versions over one anatomy: `--split`,
`--cover`, `--video` (a muted loop, hidden under `prefers-reduced-motion`,
which leaves exactly `--cover`), `--minimal`, `--console`. The scrim on the
image versions is not optional: text over an arbitrary photograph has no
contrast guarantee.

**Enrol card** (`.ns-buybox`) — sticky in the rail, and `--bar` as a fixed
bottom bar on a phone with `env(safe-area-inset-bottom)` respected.

**Filter rail** (`.ns-filters`, `.ns-range`) — facet groups as `<details>`, a
dual-thumb price range built from two real `<input type="range">` (clamped,
never swapped), and the applied set echoed as removable chips. Everything is
a native form control, so the page filters with JavaScript off.

**Also**: `.ns-testimonials`, `.ns-instructor`/`.ns-instructors`,
`.ns-outcomes`, `.ns-share`, `.ns-course-strip` (scroll-snapped related
courses), `.ns-course-listing` (rail + grid), and `.ns-panelbar__line`.

New stylesheet `components/css/catalog.css`; `components/css/lms.css` and
`player.css` substantially extended. Wiring in `assets/js/lms.js` — all of
it progressive enhancement.

### Added — sections leave room for the action

`.ns-band__actions` is a slot: a band no longer defines its own button, the
page puts one in it at whatever variant and size that page needs. Baking the
action into the section is how a system ends up with six section components
that each hard-code a differently-sized button — and why buttons drift out
of proportion with the cards beside them. `--between` puts the head and the
actions on one line. `.ns-band--collapsible` folds a secondary section on
native `<details>`.

### Changed — body copy is 450, and the reading ink is darker

**Visual change in both products.** N&M Text's true Regular renders *grey*
rather than black at 16px, which is the single most common complaint about a
Nunito-derived face. Three changes fix it together:

- **`--weight-body: 450`** ("Book") is the new reading weight, applied on
  `body` in `tokens/base.css`. `--weight-regular` (400) survives for dense UI
  furniture — table cells, meta rows — where light *is* the intent.
  `--weight-body-strong: 600` is the new inline `<strong>`: against Book,
  700 is a shout.
- **`-webkit-font-smoothing: antialiased` is now dark-mode only.** Forcing
  greyscale antialiasing globally strips roughly a quarter-step of apparent
  weight off every glyph on macOS. On the navy console surface the trade
  flips and it stays.
- **`--color-muted` darkened** `#706e6b` → `#5c5a57`: 4.93:1 → 6.87:1 on
  white, 4.6:1 → 6.34:1 on the sunken surface.

Also added: `--size-mega`, `--size-fine`, `--tracking-mega`, `--tracking-wide`,
`--leading-mega`, `--measure-prose` (68ch), `--measure-narrow` (46ch),
`--duration-slow`, `--duration-draw`, `--ease-draw`, and the nine
`--color-code-*` syntax roles (light + dark). `h1`–`h6` now carry a default
weight and leading in the base layer, and `time`/`output`/`.ns-num`/
`[data-numeric]` get `tabular-nums` automatically.

### Added — SyntaxHighlighter, the code surface

A real code block: title bar with the file name, copy / ask-AI / share / wrap
actions, line numbers, diff-marked lines, and a footer whose one job is Run.
Three chromes — `block`, `--mac` (traffic lights, centred title), `--vscode`
(tab strip + brand status bar) — differ **only** in the bar.

- `components/css/code.css`, `components/core/SyntaxHighlighter.jsx`,
  `components/core/highlight.js` (the shared tokenizer — one implementation
  for React, the styleguide generator and any server), `assets/js/code.js`.
- Highlighting happens at **build time** and maps any grammar onto seven
  roles. Adding a language is a keyword list, never a colour.
- Run does not execute anything: it raises `ns:code-run` / calls `onRun` and
  waits for the host to call `done()`.
- The Ask-AI and Share menus are native popovers — light-dismiss, Esc and
  top-layer placement come from the platform, and `position-area` hangs each
  off its own button via the implicit popover anchor.
- **Deprecates `CodeBlock` and `CodePanel`.** Both style themselves inline and
  cannot be rendered by the Ghost theme. They still work; new code should not
  use them.

### Added — typographic effects (`components/css/type-fx.css`)

Highlight, strike, circle, frame, scan line, matrix scramble, line reveals,
display/poster type, drop cap, pull-quote, kinetic strip, circular text
(`<textPath>`), the three link treatments, citations and heading anchors —
plus `.ns-measure`, `.ns-balance`, `.ns-caps`, `.ns-label` and the numeral
utilities. Wired by `assets/js/type-fx.js`, all of it progressive enhancement.

Three rules hold the file together: the effect is never the meaning (struck
text is `<s>`, a highlight is `<mark>`, a citation links to a real footnote);
it draws once; and every "start hidden" state sits inside
`@media (scripting: enabled)` so nothing is invisible when the script is not
there.

### Added — the fonts are an open-source package

`fonts/` is now redistributable on its own: `OFL.txt`, and a full static
family in `fonts/static/` (21 named cuts × woff2 + ttf, plus a ready
`@font-face` sheet) generated from the variable files by
`scripts/build-fonts.py` (`npm run build:fonts`). The script instances each
weight off the `wght` axis and fixes the name table and `OS/2` bits so
installers show a real family menu.

### Removed

- **`typography/`** — the retired first-generation faces (Inter, Space
  Grotesk, JetBrains Mono). Nothing referenced them; `fonts/` is the only
  font directory now. Consumers copying assets into a Ghost theme should copy
  `fonts/` and `icons/` (see `docs/INTEGRATION.md`).
- **The Content design styleguide page** — folded into **Typography**, where
  voice and casing belong. The specimen card (`guidelines/content-design.card.html`)
  is unchanged and now renders on the Typography page.

### Added — Typography is now the whole typographic contract

One page carrying the scale, the reading weight and why it is 450, measure,
numerals, the effects, display/poster type, circular text, links, citations,
anchors, content design, and the typographic accessibility floor — plus a
full-page specimen at `templates/type-specimen.html`
(`preview/demo-type-specimen.html`).

### Added — the navbar, as a family of documented components

The bar had one page and two variants. It is the piece of chrome every
visitor meets first, so it now has its own stylesheet
(`components/css/navbar.css`, split out of `navigation.css`) and five
styleguide pages — Navbar, Nav menu, Account menu, Mobile nav, Theme toggle.

- **The bar** — `.ns-topnav__inner` (width-capped contents), brand lockup with
  a mono tag, `__flag`, `__divider`, `__progress` (reading progress), and the
  surface variants `--transparent` (over a hero, solid on scroll via
  `data-scrolled`, no backdrop blur), `--floating`, `--sunken`, `--compact`,
  `--center`, `--wide`.
- **Announcement bar** (`.ns-announce`) — above the sticky bar, scrolls away
  with the page; `--quiet` for notices rather than promotions.
- **Search affordance** (`.ns-navsearch`) — a button shaped like a field, with
  the ⌘K hint; opens the existing search modal.
- **Dropdown and mega panel** (`.ns-navitem`, `.ns-navmenu`, `.ns-megamenu`) —
  icon/title/description rows, section labels, a foot bar, and at most one
  promo per mega panel. Disclosures, not ARIA menus: the rows are links.
- **Account menu** (`.ns-usermenu`) — avatar trigger, identity block, plan
  chip, trail progress, actions, sign out; `.ns-topnav__auth` for signed out.
- **Mobile** — `.ns-burger` (three hairlines rotating into the close X) and
  `.ns-navsheet`, a full-viewport `<dialog>` with mono-indexed rows, native
  `<details>` groups and a pinned foot.
- **Theme controls** — `.ns-themetoggle` (Light · Auto · Dark radiogroup with
  a `:has()`-positioned thumb, no state class) and `.ns-themetoggle-icon`
  (sun/moon crossfade in place, driven from `data-theme` in CSS).
- `assets/js/nav.js` — the Ghost-side behaviour: it only ever writes
  `aria-expanded` / `aria-checked` / `data-scrolled`, plus Esc-and-return-focus,
  ArrowDown-into-panel, close-on-tab-out, `showModal()` for the sheet, and one
  passive scroll listener. React sets the same attributes from state.
- React renderers in `components/navigation/Navbar.jsx` (+ `.d.ts`) and
  templates `templates/navbar.html`, `templates/navbar-blog.html`, each with a
  full-width styleguide demo (`preview/demo-navbar*.html`).

### Added — the signed-in bars

- **Course bar** (`.ns-coursenav`) — chrome for a page you are *inside*: a
  back control that names its destination, the mono position line, the lesson
  title, a labelled `role="progressbar"` completion meter, and one primary
  ("Complete & next"). No site navigation at all, and a `--dark` twin for a
  player whose stage stays navy. `templates/navbar-course.html`.
- **Dashboard bar** — the site bar with the marketing removed: icons in the
  link row (the case they exist for), a *Continue* menu instead of a mega
  panel, the trail's progress ring on the avatar.
  `templates/navbar-dashboard.html`.
- `.ns-navicon` (+ `__badge`) — the icon-only bar action, with a count badge
  rather than a bare dot, and `.ns-navstat` — one mono metric in the chrome.
- React: `CourseNav`, `NavIcon`, `NavStat`.

### Changed

- **The theme control is a real switch by default** — `.ns-themeswitch`: one
  moving part, a knob sliding along a track carrying the *current* mode's
  glyph. Both the position and the glyph are read from `data-theme` in CSS,
  so they are right in the first painted frame; the visible track is 1.5rem
  and the button around it is a full 2.5rem target. The icon square
  (`ThemeToggle variant="icon"`) and the Light · Auto · Dark segmented form
  both remain.
- **The bars are tighter.** Bar gutter and gap 1.5rem → 1rem, link padding
  and row gaps down a step, dropdown/mega padding and column widths reduced,
  mega columns 13rem → 12rem. Account-menu rows are 2rem with 0.25rem
  padding rather than a 2.5rem touch target each — eight rows at
  `--target-comfy` is a column of air, and these are pointer menus in
  chrome, not a phone keypad.
- **Panels open with a longer, softer move** — `--duration-base` with a
  0.5rem drop and a hair of scale from the top edge; the mobile sheet drops
  in from the bar it belongs to, its backdrop fades with it, and its rows
  arrive in four stagger steps. All of it collapses under
  `prefers-reduced-motion`.
- **GitHub** — `.ns-navstar`, the star pill (a link to the repo; the count is
  mono, divided by a hairline; the words drop below lg leaving the mark), the
  mark itself added to `icons/icons-gap.css` as the one filled glyph in that
  file, and a GitHub row in the resources dropdown and the mobile sheet.
  React: `NavStar`.
- **The bar's search opens the search dialog** —
  `templates/search-modal.html` now answers `[data-ns-search]` as well as
  `[data-ns-search-open]`, and guards against `showModal()` on an already
  open dialog. The navbar demos ship it alongside the bar.
- Marketing bar links carry icons in the shipped template, as an example of
  the option rather than a change to the default.
- **`--navbar-h` is 3.5rem**, down from 4rem — tall enough for a 2.5rem
  control plus its breathing room. Every consumer of the token (sticky
  sidebars, the TOC, the player rail, heading scroll-margin) follows.
- **`ThemeToggle` renders the new icon switch** — default `className` is now
  `ns-themeswitch` and both glyphs are always in the DOM (which one reads as
  current is decided in CSS from `data-theme`). The `showLabel` prop is gone;
  use `ThemeSwitcher` where Auto matters. This moves the control's appearance
  in a consuming product, so releasing it is a **major** bump.
- `components/core/Navbar.jsx` no longer styles itself inline — it composes
  the `.ns-topnav` parts, so the Ghost theme can render it. One entry off the
  known-debt list in `scripts/check-components.mjs` (23 → 22).
- The styleguide inlines `assets/js/theme-init.js` and loads `nav.js`, so the
  navbar demos are operable and the theme controls really drive the page.

### Fixed

- **A closed `.ns-modal` / `.ns-drawer` was rendered in the page flow** —
  same root cause as the sheet below: an author `display: flex` on the base
  rule beats the UA's `dialog:not([open]) { display: none }`, so every page
  that included the search dialog showed it inline, unfocusable, wherever it
  happened to sit in the document. The display switch is now on `[open]`.
- **The link-row rule reached inside the panels** —
  `.ns-topnav__links a` also matched every `<a>` in a dropdown or mega panel,
  giving each row the bar's own 3.5rem height. Scoped to
  `.ns-topnav__links > li > a`.
- A closed `.ns-navsheet` is no longer rendered in the page flow: the
  `display` switch is on `[open]`, since an author `display` beats the UA's
  `dialog:not([open]) { display: none }` whatever the specificity.

## [2.3.0] — 2026-08-11

### Added — the builder's console (admin & creation surfaces)

The system covered the learner side only; there was no vocabulary for the
screens where courses get *made*. `components/css/admin.css` adds it, with
React renderers in `components/admin/` and framework-neutral templates:

- **App shell** (`.ns-admin`) — topbar / side nav / main as one grid, with
  the mono environment tag and a nav of terminal rows (mono indices,
  `aria-current`, counts at the row end).
- **Page head, stat cards, toolbar** — every screen opens with a kicker +
  h1 + actions; dashboard numbers are mono/tabular with worded deltas.
- **Editor layout** — the record on the left, everything *about* the record
  in a sticky rail of hairline boxes; **publish bar** pinned below with the
  save state as a mono timestamp.
- **Creation primitives** — the borderless heading-size **title box**, the
  mono **slug** group, **rich-text chrome** (quiet icon toolbar,
  `aria-pressed` marks), the **curriculum builder** (editable section
  blocks, lesson rows with grip/type/duration, keyboard-first reordering,
  dashed add rows), **dropzone + file rows**, and the chips-in-a-field
  **tag input**.
- Templates + full-screen styleguide demos: `admin-dashboard`,
  `admin-course-new`, `admin-lesson-editor`.

### Added — reusable page sections

`components/css/sections.css` + `components/sections/`: the bands both
products compose pages from — **Band/BandHead/Kicker** (the `//` kicker is
now a component, not a convention), **Hero** with the dissolving hairline
grid, **FeatureGrid**, **StatBand**, **Quote**, **CtaBand**, **Faq** (native
`<details>`), **LogoRow**. `templates/sections-home.html` composes all of
them in canonical order, with a full-page demo in the styleguide.

### Added — bespoke icon set

`assets/icons/namaste-icons.svg`: 20 LMS-specific glyphs Phosphor has no
word for (course, lesson types, roadmap, org, Apex, flow, publish…), drawn
on Phosphor's 24px/1.7-stroke grid so the sets mix in one row. Rendered via
`.ns-icon` (1em, currentColor) or the new `Icon` React component; the
styleguide gains an **Icons** foundations page enumerating the set.

### Fixed — skip link no longer needs a second class

`.ns-skip-link` relied on being paired with `.ns-visually-hidden` to hide
itself; markup using the class alone showed a permanent blue pill in the
page corner. The hidden-until-focus state is now baked into
`.ns-skip-link` itself; the old pairing keeps working.

### Added — interactive admin demos

`demo-admin-course-new.html` and `demo-admin-lesson-editor.html` now carry
demo-only vanilla JS over the real markup: add/rename/reorder/remove
sections and lessons (grip + arrow keys), tag entry and removal, file
uploads that become processed file rows, working rich-text formatting, and
Draft ↔ Published with a live save timestamp. The course-building flow is
testable from the styleguide with no app and no backend; in product the
same behaviour comes from `components/admin/`. A new root **`doc.md`**
lists the owner's action items (Ghost partials, Payload CMS wiring, icon
subset regeneration, Pages deploy).

### Changed — styleguide restructured and polished

- **Pruned:** the four generic "Learn Design System" cards (`learn/`) are
  deleted — education about design systems in general is not part of this
  system's contract.
- **Ordered, not alphabetized:** foundations now read in teaching order
  (Color → Surfaces → Type → Spacing → Layout → Geometry & motion → Icons →
  Charts → Class index) and gallery groups in reading order (Foundations →
  Colors → Type → Brand → Content Creation → Legacy components last). The
  "Z. " / "1. " alphabetical-sort prefixes in card group names are gone.
- **Home page** opens with the system's own vocabulary: a navy `.ns-band`
  hero with the hairline-grid motif and a mono proof line, then a
  `.ns-statband` of the real counts — the styleguide now demos the section
  components by being built from them.
- **Micro-interactions**, all inside the motion principles (120–180ms,
  ease-out, no lift): staggered fade-up page entrance (collapses under
  `prefers-reduced-motion`), hover border-brighten on swatches and specimen
  frames, transitions on sidebar links, and **click-to-copy on every token
  and class name** with a brief "copied" state in success ink.
- Dark `.ns-band--grid` bands draw their hairlines from
  `--color-on-dark-wash` — `--color-grid` is picked against the light
  surface and vanished on navy.

### Fixed — icons were broken almost everywhere

Two real bugs, both long-standing:

- `dist/namaste-ui.css` shipped the Phosphor `@font-face` URLs un-rebased
  (`../../fonts/…` resolves outside the repo), so **no icon-font glyph
  rendered at all** for any dist consumer — including the styleguide
  itself. `scripts/build-css.mjs` now rebases both relative depths.
- The component layer references ~28 `ph-*` glyphs the upstream subset
  never contained (carets, plus, pencil, upload, moon/sun, the
  text-formatting set…). `assets/css/icons-gap.css` fills each gap with a
  currentColor SVG mask drawn to the same spec — no markup changes; delete
  a block when the real subset gains the glyph.

## [2.2.0] — 2026-08-11

### Changed — real per-component documentation

The old "Form Controls" / "Alerts, Toasts & States" specimen cards lumped
three or four components into one frame — a collage, not documentation. They
are deleted, replaced by **31 per-component doc pages** generated from a new
registry (`scripts/component-docs.mjs`). Every page carries:

- a summary in the system's own terms;
- **Use it for / Not for** guidance;
- every variant rendered live, with a `<>markup` disclosure under each demo —
  the demo and the sample are one string, so they cannot disagree;
- the accessibility contract;
- **working live demos** where the component is interactive: the Modal page
  opens a real `showModal()` dialog (verified: top-layer trap, Esc, backdrop,
  Cancel autofocused), the Menu page a real popover, the Checkbox page a real
  indeterminate state.

The sidebar now groups components by family (Actions, Forms, Feedback,
Progress & data, Navigation, Overlays, Surfaces) under the numbered
foundations; the remaining card gallery (legacy components, brand, content
creation) moves under "Gallery", with the unmigrated component cards labelled
"Legacy components". 47 pages total.

## [2.1.0] — 2026-08-11

### Changed — styleguide is multi-page

One endless scroll became 16 pages: a numbered home directory, one page per
foundation section, one page per specimen group. Each page loads only its own
content (the specimen page for Components carries its 31 iframes; the home
page carries none), every URL is shareable, prev/next links walk the system in
order, the sidebar marks the current page with `aria-current`, and the theme
choice persists across pages via the shared `ns-theme` key. `preview/` is
rebuilt from scratch on each generate so a renamed section cannot leave a
stale orphan page.

### Removed — Claude-viewer harness files

`Home.dc.html`, `thumbnail.html`, `.thumbnail`, `support.js`, `_ds_bundle.js`
(110 kB), `_ds_manifest.json` (53 kB) and `_adherence.oxlintrc.json` (18 kB)
— ~250 kB of generated harness for the Claude design-system viewer, which the
standalone multi-page styleguide replaces. The system is now fully
self-describing through its own build.

## [2.0.0] — 2026-08-11

Major because `ghost/` is removed (a published path). No consumer migration
pain expected — the products had not yet vendored the partials — but removal
is removal.

### Changed — BREAKING: `ghost/` → `templates/`

The Handlebars partials are replaced by **framework-agnostic HTML** in
`templates/` (same `.ns-*` markup, stack-specific slots marked in comments).
Ghost consumes them by copying into `partials/` and swapping the marked slots
for helpers — `data-members-*` hooks work unchanged; the recipe is in
docs/INTEGRATION.md. One neutral copy replaces a third renderer that would
drift. Package export `./ghost/*` is now `./templates/*`.

### Added — gulp build orchestration

`gulpfile.mjs` — the same tool the Ghost theme builds with, as thin
orchestration over `scripts/*.mjs` (gulp owns the workflow, the scripts own
the work, so plain `node scripts/…` and CI still work with no gulp):
`gulp` (dev loop) · `gulp build` · `gulp check` · `gulp site` · `gulp serve`.

### Added — deployable preview (`gulp site`)

`scripts/build-site.mjs` stages a self-contained ~1 MB static site into
`_site/`: the styleguide, the full CSS/font closure, all 75 specimens at
their real paths, a root redirect and `.nojekyll`. Deployable to any static
host; verified standalone (every referenced path resolves inside `_site/`).

### Added — CI/CD

`.github/workflows/ci.yml`: **check** on every push/PR (`gulp build`,
`gulp check`, then `git diff --exit-code` so a hand-edited generated file
fails the build) and **deploy** on pushes to main (`gulp site` → GitHub
Pages), giving the team a permanently hosted preview of what main ships.

### Changed — preview structure

The styleguide was one unstructured scroll of 75 open specimens. Now:
- every section carries a **mono index** (01–16) in the sidebar and heading —
  the system's own structural motif applied to its own documentation;
- specimen groups are **collapsible and closed by default**, each summary a
  terminal-style row (index · name · count); sidebar links auto-expand their
  group before jumping.

## [1.1.0] — 2026-08-11

### Added — product surfaces

Three screen families, each as the usual trio (portable `.ns-*` CSS + React
renderer + Ghost partial) and a specimen card:

- **Authentication** (`auth.css`, `components/auth/`, `signup-form.hbs`).
  Sign in, sign up, forgot/reset password in one `.ns-auth` shell, with a
  split brand-band variant. Honest about the two products' flows: Ghost is
  passwordless (magic link — no forgot-password page exists there), the app
  gets the password variants. Sign-in errors never disclose which field was
  wrong; the forgot-password confirmation reads identically whether or not
  the account exists (no enumeration oracle); live password rules replace
  the strength bar ("add a number" is actionable, a yellow bar is a mood).
- **Helpdesk** (`helpdesk.css`, `components/helpdesk/`, `ticket-form.hbs`).
  Help hub, raise-a-ticket form (priority as a styled radio fieldset, urgent
  alone allowed the error hue and only when selected; attachment target;
  automatic course/lesson context capture), ticket list as terminal rows with
  mono ids, and the ticket thread (agent = brand edge, internal note =
  warning edge, both labelled in words).
- **Course player** (`player.css`, `components/player/`, `course-player.hbs`
  + `lesson-rail.hbs`). 16:9 stage on brand-900 in both themes, lesson
  header, prev/next with ←/→ shortcuts (space is left to the video), course
  progress, and a curriculum rail with done/current/locked states that
  scrolls itself to the current lesson. Two columns ≥ lg; below, a single
  column with the stage always first. The media element belongs to the
  caller — no video-vendor lock-in.

### Added — live preview loop

- **`npm run dev`** — watch mode on the preview server. Save any token,
  component CSS, card or script: tokens, bundle and preview rebuild
  (~400ms) and every open tab reloads over SSE. Dependency-free; a broken
  save reports and keeps watching. The reload snippet rides only on the HTTP
  response — no build artifact contains it.

### Changed — type & dark-mode polish

- **`--tracking-tight` (-0.018em)** applied to h1–h3 — Inter runs loose at
  display sizes; body text is never tightened.
- **`text-wrap: balance`** on headings.
- Dark mode: the **focus ring brightens to `brand-300`** (a safety feature
  outranks staying on-brand on the navy surface).
- New tokens: `--tracking-tight`, `--player-side-w`.
- Font pairing and dark mode are now documented as first-class sections in
  the readme.

## [1.0.0] — 2026-08-11

The first release the two products can actually share. Before this, the system
had foundations and display components but no distributable build, no
interactive layer, and no way for the Ghost theme and the Next.js app to prove
they agreed.

### Added — cross-platform build

- **Token export pipeline** (`scripts/build-tokens.mjs`). `tokens/*.css` is the
  single source of truth; `tokens.json` (W3C DTCG), `tokens.js`, `tokens.d.ts`
  and `tokens/tailwind.css` are generated from it. `--check` fails CI when they
  drift.
- **Tailwind v4 bridge** (`tokens/tailwind.css`, generated). Makes
  `bg-brand-500`, `p-card`, `rounded-card`, `text-label`, `z-dropdown` and
  `max-w-page` resolve identically in both products. Tailwind's numeric spacing
  scale is pinned to the same 4px base as `--space-*`.
- **CSS bundle** (`dist/namaste-ui.css` + `.min.css`) — framework-neutral flat
  CSS for pipelines that cannot resolve `@import` across `node_modules`.
- **`package.json`** with `build`, `check` and an `exports` map.

### Added — guardrails

- `check:principles` — fails the build on a raw color, radius, z-index,
  transition timing, font-family or padding/margin/gap in the component layer.
  This is the design principles made mechanical rather than remembered.
- `check:palette` — re-proves the chart palette against the OKLCH lightness
  band, chroma floor, protan/deutan/tritan separation, normal-vision floor and
  surface contrast, reading the values out of the CSS that actually ships.

### Added — tokens

- **Spacing scale** (`--space-*`) on a 4px base, matched 1:1 to Tailwind's
  index, plus semantic aliases (`--pad-card`, `--gap-grid`, `--stack-lg`).
  Previously the system documented "Tailwind's 4px scale" while shipping no
  spacing tokens at all.
- **Layout tokens** — breakpoints, container widths, page gutters, fixed chrome
  sizes, and a six-layer `--z-*` elevation order.
- **Data-viz palette** — 7 categorical slots, a 4-step sequential ramp and a
  diverging pair, verified in both modes.
- **Status ink pair** (`--color-*-ink`). The raw status hues are unsafe as
  text — `--color-warning` measures 2.22:1 on white and fails AA outright, and
  `--color-error` at 4.65:1 clears AA with no headroom. The ink variants sit at
  6.5–6.8:1 in light mode and 7.5–10.5:1 in dark, and are now the only tokens
  allowed under status text.
- **`--color-on-brand` / `--color-on-dark` / `--color-scrim`** — replacing the
  hard-coded whites and scrim colors that broke dark mode locally.
- **Private `--ns-*` source layer** under the public `--color-*` API, so
  Tailwind's `@theme` can alias tokens without a self-referential cycle.

### Added — components

Interactive layer, previously absent entirely. Each ships as portable `.ns-*`
CSS plus a React wrapper plus, where Ghost needs it, a Handlebars partial.

- **Forms** — Field (label/help/error wiring), Input, Select, Textarea,
  Checkbox (with indeterminate), Radio, Switch, Fieldset.
- **Overlays** — Modal, ConfirmModal, Drawer, Menu, Tooltip. Built on `<dialog>`
  and the popover attribute, so focus trapping, Esc, inert background and top
  layer come from the platform rather than from hand-written JS.
- **Navigation** — Tabs (roving tabindex), Accordion (native `<details>`),
  Breadcrumb, Pagination, DocsSidebar.
- **Feedback** — Alert, ToastProvider/useToast, Skeleton, Spinner, EmptyState,
  ErrorState, Status.
- **Progress** — ProgressBar, Steps, ScoreMeter, DataTable. Native `<progress>`
  and `<meter>`, which are not interchangeable.
- **Theme** — ThemeToggle, SkipLink, and `assets/js/theme-init.js`: a shared
  no-flash bootstrap both products inline verbatim, using one `ns-theme`
  storage key so a reader keeps their theme across the two.

### Added — Ghost surfaces

Previously undesigned, though Ghost renders them regardless: sign-in, account,
subscribe form, search dialog, pagination, skip link, theme toggle, error page.

### Added — preview

- **A standalone styleguide** (`npm run preview`). The system previously had no
  way to look at itself: the specimen cards only rendered inside the Claude
  viewer, and `dist/` is just bytes, so "does the switch look right in dark
  mode" had no answer short of building one of the two consuming products.
  `scripts/build-preview.mjs` generates the page from the real artifacts —
  token tables from `tokens.json`, the class index scraped from
  `components/css/`, and all 72 specimens in iframes — and
  `scripts/serve.mjs` is a dependency-free server that serves the repository
  root, so the preview shows what actually ships. One theme switch flips the
  page and every specimen together.

### Added — documentation

- `docs/INTEGRATION.md` — the wiring contract for both products.
- `docs/CONTRIBUTING.md`, `LICENSE`, this changelog. Loose docs moved into `docs/`.
- Five foundation cards: Spacing & Layout, Interaction States, Accessibility,
  Data Visualization, Content Design.
- Four component cards: Forms, Feedback, Navigation, Progress.

### Changed

- `--color-accent-*` is now an explicit alias of `--color-brand-*`. It was a
  byte-for-byte duplicate — ten tokens that looked like a second brand color
  and were not one. Existing `variant="accent"` call sites keep working and can
  no longer drift apart. **Deprecated**; use `--color-brand-*` in new work.
- `styles.css` now imports the spacing, layout, data-viz and component layers.

### Fixed

- Anchored headings no longer hide under the sticky navbar (`scroll-margin-top`
  keyed to `--navbar-h`).
- `Button` and `Input` no longer style themselves inline; they render the
  shared `.ns-btn` / `.ns-input` classes, so the Ghost theme can render them.
- `components/core/Input.jsx` was a second, separately-drifting Input. It is now
  a re-export of the canonical one in `components/forms/Form.jsx`.
- `--color-scrim`, `--color-on-brand` and `--color-on-dark` replace hard-coded
  white and scrim literals that did not respond to the theme.

### Known debt

**23 of the pre-existing components still style themselves with inline style
objects**, which means the Ghost theme cannot render them — it would have to
reimplement each one. They are: AvatarRing, Badge, Chip, CodeBlock, CodePanel,
Footer, Hero, Kicker, Logo, Navbar, TableOfContents, TimelineStepper, AdSlot,
AuthorBox, BlogCard, CourseCard, CourseStats, CurriculumList, LevelBadge,
ResourceCard, RoadmapCard, TrainingCard, VideoPoster.

Converting each means lifting its styling into `components/css/` as `.ns-*`
classes and writing the matching `.hbs` partial. The list is enumerated in
`scripts/check-components.mjs`; `npm run check:components` holds all new
components to the rule and prints the outstanding count on every run, so the
debt shrinks visibly instead of being rediscovered later.
