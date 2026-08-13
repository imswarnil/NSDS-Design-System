# NS Design System

**Live styleguide → <https://dev.imswarnil.com/NS-Design-System/>** — published
from `main` on every push. See **[`LIVE.md`](LIVE.md)** for the URLs, what is on
the site, how the deploy works, and how to fix it when it breaks.

A design system for **Namaste Salesforce**, an open-source Ghost theme (`imswarnil/Namaste-Salesforce`) for Salesforce learning communities: courses, a training roadmap, developer documentation, and a blog, all in one calm, fast, accessible package.

*Why "Console" styling?* Apex is Salesforce's own programming language — and the whole visual language here (mono indices, code-comment kickers, hairline borders, terminal-row lists) is built to feel like a developer console, not a marketing site. See **Design Principles** below.

**Sources used to build this system** (not attached to this project — explore them yourself for deeper context or to extend this system):
- GitHub repo: [imswarnil/Namaste-Salesforce](https://github.com/imswarnil/Namaste-Salesforce) — the Ghost theme itself. Read `assets/css/screen.css` (Tailwind v4 `@theme` tokens), `assets/css/theme/*.css` (the LMS component layer: `tokens.css`, `base.css`, `components.css`, `navbar.css`, `course.css`), `training-docs.md` (how the training roadmap's tags/routes fit together), `dummy-content/*.json` (real sample course & lesson copy), and `prompt.md` (the brand's own image-generation style guide — useful for commissioning matching illustrations).

**Important caveat:** the repository as attached contains no `.hbs` template files — only the compiled design tokens, CSS, self-hosted fonts/icons, and dummy content JSON. The theme's actual page layouts (`home.hbs`, `courses.hbs`, `training.hbs`, partials, etc.) described in its own README were not present to read. Everything here — the components and the LMS UI kit — was reconstructed from the CSS component classes (`.ns-ccard`, `.ns-curriculum`, `.ns-road__*`, `.ns-course-hero`, etc.), their extensive inline comments, and the dummy content copy. If you have the missing `.hbs`/`partials/` files, attach them and this system can be tightened to match exactly.

## Design Principles

This system is not "brand blue on white Tailwind cards." It follows **five explicit rules**, borrowed from developer-tool product design (Mux, Vercel, Linear) rather than marketing-site conventions — every component in `components/` inherits them, and any new component should be checked against this list before it ships.

1. **The hairline is the structure, not the shadow.** Cards, inputs, and tags are built from a single `1px` border (`--color-border`). Soft drop-shadows are almost entirely retired (`--shadow-card` is nearly flat) — elevation comes from a border brightening to brand-blue on hover, never a floating lift.
2. **Monospace is a structural material, not a code-block accessory.** N&M Mono renders every index, duration, timestamp, status tag and section kicker — N&M Text is reserved for prose, N&M Display for headings. This is what makes a list of lessons read as *data* and a paragraph read as *writing*, without touching color.
3. **One signal color.** Brand blue (`#0176D3`) is the only color that means "interactive" or "active." Status (success/warning/error) shows as a small dot + mono text, never a background wash — so a screen with a solid blue button on it has exactly one obvious next action.
4. **Sharp, specific geometry.** `--radius-card` (6px) and `--radius-btn` (4px) replace the generic "12px + pill-everywhere" look; `--radius-pill` is reserved for true pills (tags). Nothing is rounded just because rounding is the default.
5. **Motion is instant, not springy.** State changes (hover, press, active) resolve in 120–180ms with a plain ease-out — no bounce, no scale-pop, no translateY lift on hover. The one exception is the small float loop on decorative illustrations. This is what makes the UI feel like a precise tool, not a marketing page.

Two supporting motifs worth naming: **the code-comment kicker** (`// Getting started`, borrowed from the theme's own Apex/SOQL comment voice) replaces a pastel eyebrow pill everywhere a section label is needed, and **the mono index** (`01`, `02`…) appears on every list/card/roadmap item as a first-class visual element, not a hidden a11y label.

## Product

One product: **Namaste Salesforce**, a Ghost LMS theme with five page families — a marketing home, a course catalog + course/lesson pages, a training roadmap, a documentation hub, and a blog. The identity: *calm, flat, reading-first* — one working blue, hairline borders, small shadows, generous white space, flash-free dark mode. Explicitly no gradients, glassmorphism, glow, or neon.

## Content fundamentals

- **Voice:** plain-English, encouraging, practical. Explains *why*, not just *what* — e.g. lesson copy walks from "an org is..." to a concrete next action ("try creating a custom object called Project…").
- **Person:** second person for instruction ("You'll learn to navigate Lightning Experience…"), third person for the product/ecosystem itself.
- **Structure:** every lesson follows the same shape — a plain-English concept, a concrete example or code block, then a bridge to the next lesson ("Next, we'll turn this data into insight…").
- **Casing:** sentence case everywhere (headings, buttons, nav) except short uppercase kickers/eyebrows and lesson-type badges, which are intentionally all-caps with wide letter-spacing.
- **No emoji** in product copy or UI (the source repo's own README uses a few emoji as bullet markers, but this is a maintainer-doc convention, not a UI pattern — the app itself carries none).
- **Numbers used sparingly and only when concrete**: "75%+ coverage", "200-record data load", "five sections" — never decorative stats.

## Visual foundations

Governed by the five Design Principles above. In short:

- **Color:** one working blue (`#0176D3`) carries every interactive/active signal. Status colors show as a dot + mono text, never a tinted background fill.
- **Dark mode:** semantic role tokens (`--color-surface`, `--color-ink`, `--color-muted`, `--color-border`) flip under `[data-theme="dark"]` on `<html>`, resolving to the brand navy scale (`--color-brand-800`/`900`) rather than a generic slate — dark mode is *this brand's* console, not a GitHub reskin.
- **Type:** N&M Display for headings (800), N&M Text for prose at **450 — "Book", not Regular** (`--weight-body`; see *Font pairing* for why 400 reads grey in this face); N&M Mono for every index, label, timestamp and status tag, uppercase and letter-spaced (`--tracking-label`). Reading copy caps at `--measure-prose` (68ch).
- **Geometry:** `--radius-card` 6px, `--radius-btn` 4px — sharp and specific, not "rounded because rounded." `--radius-pill` only for true pill tags.
- **Elevation:** a `1px` hairline border is the primary structuring device; hover brightens the border to brand-blue (or draws a left/top accent line), it never lifts on a shadow.
- **Spacing:** a 4px scale (`--space-*`) whose index matches Tailwind's 1:1, so `p-4` in a Handlebars template and `var(--space-4)` in a React component are the same 16px. Semantic aliases (`--pad-card`, `--gap-grid`, `--stack-lg`) carry the repeated structural relationships.
- **Backgrounds:** a faint hairline grid dissolving via a radial mask, used behind dark hero sections only. No photography, no gradients, no hand-drawn illustration.
- **Motion:** fade-up entrance + one gentle float loop (illustrations only); everything else is a 120–180ms plain ease-out. No springs, no bounce, no hover-lift.
- **Hover/press:** hover = border brightens to brand-blue + an accent line (top on cards, left on rows); press = instant opacity dim. No color-lightening, no scale-pop except the video-poster play ring and card-media zoom (1.03–1.05x).
- **Buttons:** the default is a `--size-small` label at a 40px target — a control lives *inside* something, and a default button set at body size is visually larger than the card title above it. Height is the accessibility property, type size the typographic one, and they are set independently. Sections never define their own action; they leave `.ns-band__actions` and the page puts a button in it.
- **Cards:** `1px` hairline border + `6px` radius, no shadow at rest; brand-blue border + top accent line on hover.

## Iconography

- **Phosphor icons**, self-hosted and **subsetted** to the ~130 glyphs the theme actually uses (`icons/phosphor-subset.woff2` + `phosphor-fill-subset.woff2`, generated by the source repo's `scripts/subset-icons.py`). Use via `<i class="ph ph-name">`; filled variants use `ph-fill`. See `icons/phosphor.css` for the full generated class list.
- **A bespoke sprite** (`icons/namaste-icons.svg`) carries the ~20 LMS-specific glyphs Phosphor has no word for — course, lesson types, roadmap, org, Apex, flow, publish… — drawn on the same 24px grid at the same 1.7 stroke, so the two sets mix in one row. Use via `<svg class="ns-icon"><use href="icons/namaste-icons.svg#ns-i-name"/></svg>` (or the `Icon` React component): 1em square, currentColor, baseline-aligned like a letter. The full vocabulary is on the styleguide's **Icons** page.
- **`icons/icons-gap.css`** fills the subset's gaps: ~31 `ph-*` classes the component layer references but the upstream subset lacks (carets, plus, pencil, upload, the text-formatting set…), each drawn as a currentColor SVG mask to the same spec. Delete a block there if the real subset ever gains the glyph.
- No PNG icon library, no unicode-symbol icons, no emoji as icons.
- A handful of inline-SVG *chrome* icons (nav, theme toggle) exist in the original theme's `partials/icons/` — not present in the attached repo, so this system uses Phosphor for those spots too (a reasonable substitution: same stroke weight, same visual family).

## Two products, one system

This system is consumed by **two** products, and that constraint shapes it more
than anything else:

- the **Ghost theme** (`imswarnil/Namaste-Salesforce`) — Handlebars + Tailwind v4
- the **Next.js LMS** — React

So the component layer is **portable `.ns-*` CSS classes**, and React components
and `.hbs` partials are two thin renderers over the same classes. A course card
is one component with two renderers, not two components that look alike until
someone edits one of them.

The three things that must match — the 4px spacing base, the `data-theme`
attribute, and the `ns-theme` storage key — are documented and enforced in
**`docs/INTEGRATION.md`**. Read that before wiring either product up.

## Preview it

The current `main` is always live at
**<https://dev.imswarnil.com/NS-Design-System/>** — nothing to install if you
only want to look. To run it locally, the design system stands on its own — no
Ghost, no Next.js, nothing but Node:

```bash
npm install
npm run dev        # gulp: build → serve → watch → live reload
```

That builds the tokens and the CSS bundle, generates the styleguide, serves it
and opens it at `http://127.0.0.1:4322/preview/index.html`.

The styleguide is **multi-page**: a numbered home directory, one page per
foundation section (color, spacing, type, …) and one page per specimen group —
each page loads only its own content, each URL is shareable, and prev/next
links walk the whole system in order.

Every page is **generated from the real artifacts**, so it cannot drift from
the system: token tables come from `tokens/tokens.json`, the class index is
scraped out of `components/css/*.css`, and every specimen is the actual
`.card.html` file in an iframe. The theme switch flips the page *and* its
specimens together, and the choice persists across pages.

The server deliberately serves the **repository root**, not a copied build
folder, so what you are looking at is what actually ships.

The build is orchestrated by **gulp** — the same tool the Ghost theme builds
with — and every task is a thin wrapper over `scripts/*.mjs`, so plain
`node scripts/…` and CI work with no gulp at all:

```bash
gulp          # dev loop: build, serve, watch, live reload   (npm run dev)
gulp build    # tokens → css bundle → preview page           (npm run build)
gulp check    # the five CI checks                           (npm run check)
gulp site     # stage the deployable styleguide into _site/  (npm run site)
gulp serve    # serve an existing build, no watching
```

`npm run dev` is how you work on the system: save any token, component CSS,
specimen card or script, and within ~400ms the tokens, bundle and preview
regenerate and every open browser tab reloads (SSE, no dependency). A broken
save prints the error and keeps watching — fixing the file triggers the next
rebuild.

`preview/` is generated and git-ignored — it is a view of the system, not part
of it, and it is one command away at any time.

**Hosting the preview on a server:** `gulp site` stages a fully self-contained
static site into `_site/` (~4 MB — the 98-page styleguide, the CSS closure,
fonts and all 38 specimen cards, plus a root redirect and `.nojekyll`). Every
reference in it
is relative, so it hosts correctly under a subpath. CI already publishes it to
GitHub Pages on every push to `main`; the same bundle drops onto Netlify, S3,
or plain nginx (`rsync -a _site/ server:/var/www/design`). Full detail in
[`LIVE.md`](LIVE.md).

## CI/CD

`.github/workflows/ci.yml` runs two jobs:

- **check** — every push and PR: `gulp build`, then `gulp check` (token-export
  drift, principle violations, component parsing/self-styling, chart-palette
  colorblind checks, stale `dist/`), then `git diff --exit-code` to prove no
  generated file was hand-edited.
- **deploy** — pushes to `main`: `gulp site` → publish `_site/` to GitHub
  Pages at <https://dev.imswarnil.com/NS-Design-System/>, so the team always
  has a hosted preview of exactly what `main` ships. Already configured
  (Settings → Pages → Source: "GitHub Actions"); a failing check blocks the
  deploy. See [`LIVE.md`](LIVE.md) for the full pipeline and troubleshooting.

## Repository layout

```
NS-Design-System/
├── LIVE.md            the hosted site: URLs, contents, deploy pipeline, fixes
├── tokens/            authored token CSS + generated JSON/JS/Tailwind exports
├── components/
│   ├── css/           the portable .ns-* layer BOTH products render
│   ├── core/          shared React components
│   ├── course/        LMS-specific React components
│   └── forms/ overlays/ navigation/ feedback/ progress/
├── icons/             both icon sets: Phosphor subset (font + classes) + bespoke sprite
├── fonts/             the N&M family (Display, Text, Mono) — variable woff2s, the
│                   static OFL package in fonts/static/, weight docs in its README
├── patterns/          nine hairline background patterns (pure CSS)
├── templates/         framework-agnostic HTML for full surfaces
├── assets/            logo, images, theme-init.js
├── scripts/           build + the five checks + the preview generator
├── docs/              INTEGRATION.md, CONTRIBUTING.md, CHANGELOG.md
├── .github/workflows/ CI (checks on every PR) + CD (Pages deploy from main)
├── gulpfile.mjs       gulp orchestration over scripts/
├── dist/              generated flat CSS bundle (committed — gulp consumes it)
├── preview/           generated styleguide (git-ignored)
├── _site/             deployable static site from `gulp site` (git-ignored)
├── guidelines/        foundation specimen cards (colors, type, a11y, motion…)
├── brand-content-creation/  brand + content specimen cards
└── styles.css         the single entry point
```

**Why `tokens/`, `components/`, `assets/` and `styles.css` sit at the root
rather than under a tidier `src/`:** every specimen card links `../styles.css`
by relative path, and `docs/INTEGRATION.md` publishes these as the package's
public import paths — moving them would break every consumer's imports for the
sake of a neater tree.

## Build

The design system has its own build and its own CI checks:

```bash
npm install
npm run build     # regenerate token exports + dist/
npm run check     # what CI runs
```

| Command | Proves |
|---|---|
| `check:tokens` | `tokens.json` / `.js` / `.d.ts` / `tailwind.css` still match `tokens/*.css` |
| `check:principles` | No raw color, radius, z-index, timing, font or spacing in the component layer |
| `check:palette` | The chart palette still clears its lightness, chroma, CVD, normal-vision and contrast checks |
| `check:css` | `dist/` is not stale |

`tokens/*.css` is the **source of truth**. `tokens/tokens.json` (W3C DTCG),
`tokens/tokens.js`, `tokens/tokens.d.ts` and `tokens/tailwind.css` are all
generated from it by `scripts/build-tokens.mjs`; editing them by hand will be
overwritten, and CI will say so.

The principles linter deserves a note: it turns the checkable part of the five
principles into a build failure. A raw hex in a component is how dark mode
quietly breaks for one rule; a raw `z-index` is how the scale becomes 9999; a
raw duration is how a 300ms spring appears. Those are now errors, not
conventions someone has to remember.

## What's in this project

- `styles.css` — the single entry point; imports tokens, base, icons and the
  component layer. `dist/namaste-ui.css` is the same thing flattened, for
  pipelines that cannot resolve `@import` across `node_modules`.
- `tokens/` — `colors.css`, `dataviz.css`, `spacing.css`, `layout.css`,
  `fonts.css`, `typography.css`, `effects.css`, `base.css`, plus the generated
  `tokens.json` / `tokens.js` / `tokens.d.ts` / `tailwind.css` exports.
- `components/css/` — the portable component layer both products render:
  `button`, `form`, `overlay`, `navigation`, `navbar`, `feedback`, `progress`,
  `icon`, `sections`, `admin`, `a11y`, **`code`** (the syntax highlighter),
  **`type-fx`** (the typographic effects), `lms` (course card, curriculum,
  lesson chrome), **`catalog`** (course hero, enrol card, filter rail,
  testimonials) and **`blog`** (post card, post header, post layout, TOC,
  callouts, author box).
- `components/core/` — Button, Kicker, Chip, Badge, Input, AvatarRing, Logo,
  Navbar, Footer, Hero, TableOfContents, TimelineStepper,
  **SyntaxHighlighter** (+ `highlight.js`, the shared tokenizer),
  **ThemeToggle**, **ThemeSwitcher**, **SkipLink**. `CodeBlock` and
  `CodePanel` are **deprecated** — both style themselves inline, so the Ghost
  theme cannot render either; SyntaxHighlighter replaces both.
- `components/forms/` — **Field**, Input, **Select**, **Textarea**,
  **Checkbox**, **Radio**, **Switch**, **Fieldset**.
- `components/overlays/` — **Modal**, **ConfirmModal**, **Drawer**, **Menu**,
  **Tooltip**.
- `components/navigation/` — **Tabs**, **Accordion**, **Breadcrumb**,
  **Pagination**, **DocsSidebar**, and the navbar family: **Topnav**,
  **NavBrand**, **NavLinks**, **NavLink**, **NavMenu**, **MegaMenu**,
  **NavSearch**, **UserMenu**, **AuthActions**, **Burger**, **NavSheet**,
  **AnnounceBar**, **ReadingProgress**, **NavIcon**, **NavStat**, **CourseNav**.
- `components/feedback/` — **Alert**, **ToastProvider**/`useToast`,
  **Skeleton**, **Spinner**, **EmptyState**, **ErrorState**, **Status**.
- `components/progress/` — **ProgressBar**, **Steps**, **ScoreMeter**,
  **DataTable**.
- `components/auth/` — **AuthLayout** (centered + split variants), **LoginForm**,
  **SignupForm** (live password rules), **ForgotPasswordForm**,
  **ResetPasswordForm**.
- `components/helpdesk/` — **HelpHub**, **TicketForm** (priority fieldset,
  attachment, context capture), **TicketList**, **TicketThread**, **TicketStatus**.
- `components/player/` — **CoursePlayer** (16:9 stage, ←/→ lesson keys,
  prev/next, progress), **LessonRail** (sections, done/current/locked states,
  auto-scroll to current). Responsive: two columns ≥ lg, stage-first single
  column below.
- `components/course/` — CourseCard, LevelBadge, CurriculumList, VideoPoster,
  CourseStats, RoadmapCard, AuthorBox, AdSlot, BlogCard, TrainingCard,
  ResourceCard.
- `components/admin/` — the builder's console: **AdminShell**, **AdminNav**,
  **PageHead**, **Stat**/**StatGrid**, **Toolbar**, **EditorLayout**,
  **RailBox**, **PublishBar** (Admin.jsx); **TitleBox**, **SlugField**,
  **RichText**, **CurriculumBuilder** (keyboard reordering), **TagInput**,
  **Dropzone**, **FileRow** (Builder.jsx).
- `components/sections/` — the reusable page bands: **Band**, **BandHead**,
  **Kicker**, **HeroSection**, **FeatureGrid**, **StatBand**, **Quote**,
  **CtaBand**, **Faq** (native `<details>`), **LogoRow**.
- `components/core/Icon.jsx` — the bespoke-sprite icon renderer +
  `ICON_NAMES`.
- `templates/` — framework-agnostic HTML for the full surfaces: sign-in,
  sign-up, subscribe, search dialog, account, error page, ticket form, course
  player, blog post, blog index, pagination, skip link, theme toggle, and the four bars —
  **navbar**, **blog navbar**, **course navbar**, **dashboard navbar** —
  plus the admin surfaces
  (`admin-dashboard`, `admin-course-new`, `admin-lesson-editor`), the composed
  marketing page (`sections-home`) and the full **type specimen**
  (`type-specimen`). Each has a full-screen demo in
  the styleguide (`preview/demo-*.html`).
- `assets/js/theme-init.js` — the shared no-flash theme bootstrap. Inlined
  verbatim by both products, using one storage key so a reader keeps their
  theme moving between the marketing site and the app.
- `assets/js/code.js` — the code block's wiring: copy, wrap, expand, Run and
  the tab strip, all delegated from the document so blocks added after load
  work with no re-init. The Ask-AI and Share menus use the native popover API
  and need no JS at all.
- `assets/js/blog.js` — the post page's wiring: the table of contents'
  scroll-spy, and building that outline from the article's own headings when
  a CMS emits a body but no outline. The TOC is real anchor links either way.
- `assets/js/lms.js` — the learner layer's wiring: curriculum expand-all, the
  price range's clamp and fill, applied-filter chips, article reading
  progress and the star fills. Entirely progressive enhancement — without it
  the curriculum still collapses (native `<details>`), the filters still
  filter (native form controls), and the range is still two working sliders.
- `assets/js/type-fx.js` — the effects wiring: the IntersectionObserver that
  sets `[data-fx-in]`, the matrix-style scrambler (which also re-fires on a
  responsive re-wrap), the circular-text `<textPath>` builder, and the exact
  path lengths the drawn circles need. Entirely progressive enhancement.
- `assets/js/nav.js` — the navbar's progressive enhancement for the Ghost
  theme: it flips `aria-expanded` / `aria-checked` / `data-scrolled` and adds
  the disclosure keyboard contract; the CSS does everything visual, and the
  React components set the same attributes from state. Deferred, optional —
  with it absent the bar still navigates.
- `guidelines/` — foundation specimen cards, including **Spacing & Layout**,
  **Interaction States**, **Accessibility**, **Data Visualization**,
  **Content Design**, and the four type cards: **Text Effects**, **Display
  Typography**, **Circular Text / Links / Citations** and **Typographic
  Accessibility**.
- `fonts/` — the N&M family: three variable woff2s, `OFL.txt`, and the static
  OFL package in `fonts/static/`. `scripts/build-fonts.py` regenerates the
  statics; `fonts/README.md` is the weight and optical-rules reference.
- `scripts/` — the build, the five checks, and the preview generator + server.
- `docs/` — `INTEGRATION.md` (wiring both products), `CONTRIBUTING.md`, `CHANGELOG.md`. `LICENSE` at the root.

## Templates — the generic markup layer

`templates/` holds framework-agnostic HTML for every full surface (sign-in,
sign-up, subscribe, search dialog, account, error page, ticket form, course
player…). Each file is the **markup contract**: the same `.ns-*` classes the
React components render, with the stack-specific slots marked in comments.

- **Ghost theme** — paste a template into `partials/`, swap the marked hrefs
  and text for Ghost helpers (`{{@site.url}}`, `{{title}}`, …). The
  `data-members-*` attributes are Ghost Members hooks and work unchanged.
- **Next.js LMS** — use the React components in `components/`; the templates
  are what those components emit, so they double as a reference.
- **Anything else** — use them directly; they are plain HTML.

Why not ship ready-made `.hbs` files? Handlebars-flavoured copies are one
find-replace away from these, but they would be a *third* renderer to keep in
sync and would look framework-specific when the point of this layer is that
it is not. One neutral copy, adapted at the edge, keeps the contract single.

## Font pairing

The **N&M type system** — three custom-named cuts, one per role. The files
are OFL-licensed faces renamed into the brand's own family (the same move as
Airbnb Cereal): N&M Display is a Manrope cut, N&M Text a Nunito Sans cut,
N&M Mono a Red Hat Mono cut. The OFL credit is embedded in each woff2's name
table.

| Role | Face | Weights | Why |
|---|---|---|---|
| Headings & display | **N&M Display** (variable 200–800) | 800 headings, 700 sub-heads | Tight, geometric, but warm — reads "product", not "marketing". |
| Prose & UI copy | **N&M Text** (variable 200–1000) | **450 body**, 600 bold | The friendliest reading face that still holds a grid. |
| Structure: indexes, labels, timestamps, kickers, code | **N&M Mono** (variable 300–700) | 400 code, 700 labels | Open, legible mono — the "developer console" identity without the terminal chill. |

The pairing works because the three faces **never compete for a job**: if it
is display, it is N&M Display; if it is a sentence, it is N&M Text; if it is
data, it is N&M Mono, uppercase and tracked (`--tracking-label`). That hard
rule is Principle 2. All three share open, rounded counters, so the system
reads as one family at three volumes rather than three fonts negotiating.

Optical corrections applied (the part generic deployments miss):

- **`--tracking-tight` (-0.022em) on h1–h3.** N&M Display, like most
  geometric grotesques, sets loose at display sizes; large headings tighten.
  Body text is never tightened — negative tracking at reading sizes hurts
  legibility.
- **`text-wrap: balance` on headings**, so a two-line title breaks evenly
  instead of leaving one orphaned word.
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) on every
  duration, count and score, so digits align in columns.
- **Body copy is 450, not 400.** N&M Text's true Regular renders *grey*
  rather than black at 16px — the one real complaint about a Nunito-derived
  face. The system's reading regular is **Book (450)**, one interpolation
  step up the `wght` axis: free on a variable font, and a named weight rather
  than an ad-hoc value, so the static package ships it too. Two changes travel
  with it — greyscale antialiasing is now **dark-mode only** (forcing it
  globally strips about a quarter-step of apparent weight off every glyph),
  and `--color-muted` was darkened from 4.93:1 to 6.87:1 on white.
- All three cuts are **self-hosted variable woff2s** with metric-matched
  fallbacks (`N&M Text Fallback`) — no FOUT jump, no third-party font host.

`fonts/` is a complete, redistributable **OFL package**: the three variable
files, `OFL.txt`, and a full static family in `fonts/static/` (21 cuts × woff2
+ ttf, plus a ready `@font-face` sheet) generated by
`python3 scripts/build-fonts.py`. Nothing in the system loads the static
files — they exist so the family can be installed, printed with, or
open-sourced on its own. Weight tables and optical rules: `fonts/README.md`.

## Dark mode

Dark mode is a **first-class theme, not a filter**: every semantic token is
re-picked against the navy console surface (`#051222`, from the brand's own
navy scale — deliberately not a generic slate).

- Driven by `data-theme="dark"` on `<html>`, set before first paint by the
  shared `assets/js/theme-init.js` (both products inline it; one `ns-theme`
  storage key, so the reader's choice follows them between the site and app).
- **Status inks lighten** (7.5–10.5:1 on the navy) where the light-mode inks
  would be unreadable; the **chart palette is a separately-solved set**, not
  a mechanical lightening; the **focus ring brightens** to `brand-300`
  because a safety feature outranks staying on-brand; the **scrim darkens**
  so the page still recedes behind a modal.
- The player's video stage stays `brand-900` in both themes — video looks
  wrong on white letterboxing, and the frame never flashes on theme switch.

## Interactive behaviour: use the platform

Overlays are built on `<dialog>` and the popover attribute; the accordion on
`<details>`; progress on `<progress>` and `<meter>`; every form control on its
native element. This is a deliberate constraint, not laziness.

A hand-rolled `<div class="modal">` has to reimplement focus trapping, scroll
locking, Esc handling, `inert` on the rest of the page and top-layer stacking —
five things that are individually easy to get 90% right and collectively the
reason most design systems ship a modal a keyboard user can tab out of. Native
`<details>` keeps browser find-in-page able to reach collapsed content, which on
a documentation site is a feature readers rely on without ever naming it.

React and Handlebars contribute only what markup cannot express: generated ids,
ARIA wiring, roving tabindex, focus restoration.

## Accessibility

The contract every component is held to is specimened in
`guidelines/accessibility.card.html`. The parts worth stating here:

- **Status text uses the `-ink` token pair.** The raw SLDS status hues are
  unsafe as text — `--color-warning` measures 2.22:1 on white and fails AA
  outright; `--color-error` clears it with no headroom at 4.65:1. The raw hue
  is for dots, borders and icons; `--color-warning-ink` is for words.
- **Never color alone.** Status is a dot, a word, and colour third.
- **State lives on an ARIA attribute**, not a CSS class, so what is seen and
  what is announced cannot drift apart.
- **The chart palette is CVD-verified in CI**, not by eye.

### Intentional additions
No component inventory was defined by an attached codebase's actual component library (no `.jsx`/`.tsx`/Figma component set) — only CSS classes and their usage comments. The component list above was authored to cover every distinct visual pattern documented in `assets/css/theme/{components,course}.css`; nothing beyond that was invented.

## Caveats & how to help

- No `.hbs` templates were available, so exact page structure (header/footer chrome, homepage sections beyond the hero, the docs sidebar's real content) is a reconstruction from CSS + dummy content, not a byte-for-byte recreation. **Attach the theme's `partials/` and top-level `.hbs` files** if you have them, and this system can be corrected against the real markup.
- The two `screenshot-*.jpg` assets in this repo are the *generic Ghost Casper* preview images, not this theme's actual screens — don't use them as ground truth for the LMS layouts.
- No real logo mark exists beyond `assets/logo/favicon.svg` (a generic Ghost-style icon) — if Namaste Salesforce has since designed a proper wordmark/logo, please attach it.
- Icons inside Ghost post *content* (vs. template chrome) are icon-font glyphs from a `CONTENT_SAFELIST` we don't have visibility into — if specific lesson pages use icons not in the subset shipped here, re-run `scripts/subset-icons.py` upstream and re-copy the woff2s.
