# Changelog

Notable changes to Namaste UI. The version here is the **design system's**, not
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
