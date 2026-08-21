# NSDS — NS Design System

**Live → <https://nsds.imswarnil.com/>** — published from `main` on every push.
See **[`LIVE.md`](LIVE.md)** for the URLs, what is on the site, how the deploy
works, and how to fix it when it breaks, and **[`OBS.md`](OBS.md)** for building
the lesson and live-stream scenes in OBS Studio.

*NSDS* is the short name; *NS Design System* is the full one. Both refer to this
repository. The CSS bundle keeps its `namaste-ui` filenames — renaming a file
two products link by URL buys nothing and breaks both.

A design system for **Namaste Salesforce**, an open-source Ghost theme (`imswarnil/Namaste-Salesforce`) for Salesforce learning communities: courses, a training roadmap, developer documentation, and a blog, all in one calm, fast, accessible package.

*Why "Console" styling?* Apex is Salesforce's own programming language — and the whole visual language here (mono indices, code-comment kickers, hairline borders, terminal-row lists) is built to feel like a developer console, not a marketing site. See **Design Principles** below.

**Sources used to build this system** (not attached to this project — explore them yourself for deeper context or to extend this system):
- GitHub repo: [imswarnil/Namaste-Salesforce](https://github.com/imswarnil/Namaste-Salesforce) — the Ghost theme itself. Read `assets/css/screen.css` (Tailwind v4 `@theme` tokens), `assets/css/theme/*.css` (the LMS component layer: `tokens.css`, `base.css`, `components.css`, `navbar.css`, `course.css`), `training-docs.md` (how the training roadmap's tags/routes fit together), `dummy-content/*.json` (real sample course & lesson copy), and `prompt.md` (the brand's own image-generation style guide — useful for commissioning matching illustrations).

**On provenance:** this system was originally reconstructed from the Ghost
theme's compiled CSS, its inline comments and its dummy content, without the
`.hbs` templates to read. It has since grown well past that: `templates/`
now holds the framework-agnostic markup for every component, and the
`.ns-*` layer here is the source of truth rather than a reconstruction of one.
If you are wiring the Ghost side up, start from `docs/INTEGRATION.md`.

## What it looks like

Every page below is generated from the real artifacts — the same tokens and the
same `.ns-*` classes both products render — so the styleguide cannot drift from
the system it documents.

### The styleguide

[![Overview](docs/images/overview.jpg)](https://nsds.imswarnil.com/)

257 tokens, 1,629 classes, 138 components. The sidebar collapses to the section
you are in and scrolls it into view; every component page carries its own
use / not-for / accessibility contract beside the demos.

### Color

![Colors](docs/images/colors.jpg)

One working blue and a neutral reading layer. Each chip shows the public token
and the private `--ns-*` source it follows.

### Typography

![Typography](docs/images/typography.jpg)

Two shipped faces. Reading copy is 14px.

### Dark mode

![Dark mode](docs/images/dark-mode.jpg)

Semantic roles flip under `[data-theme="dark"]` to the brand navy — not a
generic slate. Product code reaches for `--color-surface`, never a raw brand
step.

### A component page

![Component page](docs/images/component-page.jpg)

### The certificate, and the training family

![Certificate](docs/images/certificate.jpg)

![Training](docs/images/training.jpg)

The training rail collapses to the active module on load and scrolls it into
view — but ships every section `open`, so a JS failure leaves the curriculum
long rather than hidden.

## Design Principles

This system is not "brand blue on white Tailwind cards." It follows **five explicit rules**, borrowed from developer-tool product design (Mux, Vercel, Linear) rather than marketing-site conventions — every component in `components/` inherits them, and any new component should be checked against this list before it ships.

1. **The hairline is the structure, not the shadow.** Cards, inputs, and tags are built from a single `1px` border (`--color-border`). Soft drop-shadows are almost entirely retired (`--shadow-card` is nearly flat) — elevation comes from a border brightening to brand-blue on hover, never a floating lift.
2. **Monospace is a structural material, not a code-block accessory.** The mono face renders every index, duration, timestamp, status tag and section kicker — Switzer is reserved for prose, headings and quotations. This is what makes a list of lessons read as *data* and a paragraph read as *writing*, without touching color.
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
- **Type:** Switzer for headings (700) and prose (**400 at 14px** — the compact scale, after [carapace](https://github.com/openclaw/carapace)); Roboto Mono for every index, label, timestamp and status tag, uppercase and letter-spaced (`--tracking-label`). Reading copy caps at `--measure-prose` (68ch).
- **Geometry:** `--radius-card` 6px, `--radius-btn` 4px — sharp and specific, not "rounded because rounded." `--radius-pill` only for true pill tags.
- **Elevation:** a `1px` hairline border is the primary structuring device; hover brightens the border to brand-blue (or draws a left/top accent line), it never lifts on a shadow.
- **Spacing:** a 4px scale (`--space-*`) whose index matches Tailwind's 1:1, so `p-4` in a Handlebars template and `var(--space-4)` in a React component are the same 16px. Semantic aliases (`--pad-card`, `--gap-grid`, `--stack-lg`) carry the repeated structural relationships.
- **Backgrounds:** a faint hairline grid dissolving via a radial mask, used behind dark hero sections only. No photography, no gradients, no hand-drawn illustration.
- **Motion:** fade-up entrance + one gentle float loop (illustrations only); everything else is a 120–180ms plain ease-out. No springs, no bounce, no hover-lift.
- **Hover/press:** hover = border brightens to brand-blue + an accent line (top on cards, left on rows); press = instant opacity dim. No color-lightening, no scale-pop except the video-poster play ring and card-media zoom (1.03–1.05x).
- **Buttons:** the default is a `--size-small` label at a 40px target — a control lives *inside* something, and a default button set at body size is visually larger than the card title above it. Height is the accessibility property, type size the typographic one, and they are set independently. Sections never define their own action; they leave `.ns-band__actions` and the page puts a button in it.
- **Cards:** `1px` hairline border + `6px` radius, no shadow at rest; brand-blue border + top accent line on hover.

## Color reference

The full palette lives on the styleguide's **Colors** page, generated from the
token files. This is the working subset.

**Brand — the one signal colour.** 500 is the working blue for fills and active
states; 600 is interactive text on light, 300 on dark. 50–100 are wash-free —
they exist for charts and rare tint borders, never for status washes.

| | 50 | 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 |
|---|---|---|---|---|---|---|---|---|---|---|
| hex | `#eef6ff` | `#d8edff` | `#b0d7ff` | `#7cbeff` | `#1b96ff` | `#0176d3` | `#0b5cab` | `#03386b` | `#032d60` | `#001a3e` |

**Semantic roles.** These are what product code reaches for. They flip under
`[data-theme="dark"]`; a raw brand step for a surface is always a bug.

| token | light | dark | role |
|---|---|---|---|
| `--color-surface` | `#ffffff` | `#051222` | the page |
| `--color-surface-raised` | `#ffffff` | `#081a30` | cards, menus |
| `--color-surface-sunken` | `#f4f6f8` | `#02080f` | wells, code, inset rows |
| `--color-border` | `#dddbda` | `rgba(124,190,255,.16)` | **the hairline — the primary structuring device** |
| `--color-ink` | `#181818` | `#eaf2fb` | body text |
| `--color-muted` | `#5c5a57` | `#7fa0c2` | secondary text — 6.87:1 on white |
| `--color-label` | `#45566b` | `#8fb3d9` | mono/uppercase structural labels |

**Status.** The hue is for the dot, the border, the icon. For status *text* use
the `-ink` pair, which is darkened to clear 4.5:1 on both surface and sunken —
the raw hues do not.

| | hue | ink (light) | contrast on white |
|---|---|---|---|
| success | `#2e844a` | `#1a6b34` | 6.57:1 |
| warning | `#fe9339` | `#8a4b00` | 6.80:1 |
| error | `#ea001e` | `#ba0017` | 6.77:1 |

Chart colours are validated separately: `npm run check:palette` asserts an
OKLCH lightness band, a chroma floor, adjacent-pair separability under three
CVD types *and* normal vision, and ≥3:1 against the surface.

## Type scale

Compact, after [openclaw/carapace](https://github.com/openclaw/carapace).
Reading copy is **14px**, not 16 — this is a product with an app inside it, and
at 16 the player, admin and tables all had to fight the base size with
`--size-small` everywhere, which is the tell that the base was wrong for most
of the screens being built.

| token | size | for |
|---|---|---|
| `--size-mega` | `clamp(2.75rem, 1.9rem + 4.2vw, 5.5rem)` | poster / campaign only |
| `--size-display` | `clamp(2rem, 1.55rem + 2.2vw, 3.25rem)` | hero |
| `--size-h1` | 2.5rem / 40px | |
| `--size-h2` | 2rem / 32px | |
| `--size-h3` | 1.5rem / 24px | |
| `--size-h4` | 1.25rem / 20px | |
| `--size-body-lg` | 1.0625rem / 17px | ledes, standfirsts |
| `--size-body` | **0.875rem / 14px** | **reading copy** |
| `--size-small` | 0.8125rem / 13px | dense UI, meta |
| `--size-fine` | 0.75rem / 12px | legal, captions |
| `--size-label` | 0.6875rem / 11px | mono kickers and labels |
| `--size-mono` | 0.8125rem / 13px | code, timestamps |

Only the top two steps clamp: a hero has to survive a 360px phone, a paragraph
does not. Everything is `rem`, because one `px` font-size is one piece of text
that stops responding to browser zoom.

**Weights** are `400 / 500 / 600 / 700` — every step a weight Switzer's
designer actually drew, no interpolations of our own. Body is 400.

Two Tailwind utilities worth knowing apart:

- `text-label` is the **kicker**: 11px, 700, `0.09em` tracking, arriving whole
  so it cannot be half-applied.
- `text-data` is the same 11px **without** the weight and tracking — for mono
  data, which is quiet by definition and reads wrong bold.

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
**<https://nsds.imswarnil.com/>** — nothing to install if you
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
gulp check    # the seven CI checks                          (npm run check)
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

## The checks

`npm run check` runs seven gates. Each exists because the thing it catches
shipped broken at least once and nothing noticed:

| check | catches |
|---|---|
| `check:tokens` | `tokens.json` / `.js` / `.d.ts` / `tailwind.css` drifting from the token CSS — and any `--text-x`/`--color-x` name collision, or a token with no utility |
| `check:principles` | a raw hex, radius, z-index, timing, font or spacing literal in the component layer |
| `check:cascade` | **a rule outside a layer, or an undeclared `!important`** — either one silently revokes "a utility always wins" |
| `check:components` | a `.jsx` that styles itself with a `style={{}}` object, which the Ghost theme cannot render |
| `check:markup` | **a `.ns-*` class used in markup with no rule** — it renders as an unstyled element and nobody notices until a screenshot |
| `check:palette` | a chart hue failing the OKLCH band, chroma floor, CVD separability or contrast |
| `check:css` | a stale `dist/` bundle |

`gulp site` additionally runs `check:links`, which walks the built `_site/` for
broken relative paths, root-absolute assets, duplicate ids and dangling
`aria-controls`.

## CI/CD

`.github/workflows/ci.yml` runs two jobs:

- **check** — every push and PR: `gulp build`, then `gulp check` (token-export
  drift, principle violations, component parsing/self-styling, chart-palette
  colorblind checks, stale `dist/`), then `git diff --exit-code` to prove no
  generated file was hand-edited.
- **deploy** — pushes to `main`: `gulp site` → publish `_site/` to GitHub
  Pages at <https://nsds.imswarnil.com/>, so the team always has a hosted
  preview of exactly what `main` ships. Already configured (Settings → Pages →
  Source: "GitHub Actions"); a failing check blocks the deploy. The build
  writes `_site/CNAME`, `robots.txt` and `sitemap.xml`, and a real indexable
  homepage at `/`. See [`LIVE.md`](LIVE.md) for the pipeline, the DNS records
  and troubleshooting.

## Repository layout

```
NSDS-Design-System/
├── LIVE.md            the hosted site: URLs, contents, deploy pipeline, fixes
├── OBS.md             building the lesson and live scenes in OBS Studio
├── tokens/            authored token CSS + generated JSON/JS/Tailwind exports
├── components/
│   ├── css/           the portable .ns-* layer BOTH products render
│   ├── core/          shared React components
│   ├── course/        LMS-specific React components
│   └── forms/ overlays/ navigation/ feedback/ progress/
├── icons/             both icon sets: Phosphor subset (font + classes) + bespoke sprite
├── fonts/             Switzer + Roboto Mono — latin-subset variable woff2s
│                   (67 KB), both licences, and the weight docs in its README
├── patterns/          nine hairline background patterns (pure CSS)
├── templates/         framework-agnostic HTML for full surfaces
├── assets/            logo, images, theme-init.js
├── scripts/           build + the seven checks + the preview generator
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
- `components/ai/` — the learning assistant: **Assistant** (shell, docked and
  embedded), **AssistantBar**, **AssistantThread**, **AssistantFoot**,
  **ConversationRail**, **Turn**/**TurnBody**, **Thinking**, **StreamCaret**,
  **ToolCall**, **Trace** (Assistant.jsx); **Composer** (context pills,
  attachments, Enter-sends), **Welcome** (Composer.jsx); **Attachments**,
  **CourseAttachment**, **Snippet**, **AnswerImage**, **LearningPath**,
  **Sources**, **PracticeCheck**, **AnswerError**, **SignInGate**
  (AnswerBlocks.jsx); **SettingsGroup**, **SettingsRow**, **ModeChoice**,
  **SettingSwitch** (Settings.jsx). An answer renders the product's own
  objects — the course it recommends is the same `CourseCard` the catalog
  renders.
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
  marketing page (`sections-home`), the full **type specimen**
  (`type-specimen`) and the three assistant screens (`ai-chat`,
  `ai-signin`, `ai-settings`). Each has a full-screen demo in
  the styleguide (`preview/demo-*.html`).
- `assets/js/ai.js` — the assistant screen's wiring: the rail toggle
  (attribute + aria-expanded, Escape closes the phone sheet), Enter-sends /
  Shift+Enter-breaks, the character count, removable context and file chips,
  and autoscroll that leaves a reader alone when they have scrolled up. The
  canned reply is demo-only; everything else is production behaviour.
- `assets/js/theme-init.js` — the shared no-flash theme bootstrap. Inlined
  verbatim by both products, using one storage key so a reader keeps their
  theme moving between the marketing site and the app.
- `assets/js/code.js` — the code block's wiring: copy, wrap, expand, Run and
  the tab strip, all delegated from the document so blocks added after load
  work with no re-init. The Ask-AI and Share menus use the native popover API
  and need no JS at all.
- `assets/js/toc.js` — the post page's wiring: the table of contents'
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
- `fonts/` — Switzer + Roboto Mono variable woff2s, `FONTSHARE-EULA.txt` and `licences/`,
  which must travel with them. No static package is generated: the EULA
  permits self-hosting but not redistributing the font software, and shipping
  a derived static family is redistribution. `fonts/README.md` holds the
  weight tables, the optical rules and the subsetting recipe.
- `scripts/` — the build, the seven checks, and the preview generator + server.
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

Two shipped faces — **67 KB**, latin-subset variable woff2, both
self-hosted. Switzer is an [Indian Type
Foundry](https://www.indiantypefoundry.com) cut from
[Fontshare](https://www.fontshare.com) under the Fontshare Free Font EULA
(`fonts/FONTSHARE-EULA.txt`); Roboto Mono is under the SIL Open Font Licence
1.1 (`fonts/licences/`). Both licences permit self-hosting and commercial use
and require the licence text to travel with the files.

| Role | Face | Weights | Why |
|---|---|---|---|
| Headings, display **and** prose | **Switzer** (variable 100–900) | 700 headings, 600 sub-heads, 500 nav, **400 body** | One grotesque across the whole range. Neutral, tightly drawn, reads "product" rather than "marketing". |
| Quotations — the editorial voice | *platform serif* — **not shipped** | 400 | Georgia / Iowan Old Style / Times. A quotation still reads as a quotation, and a handful of blockquotes per page does not earn a 40 KB face the way the mono voice on every label does. |
| Structure: indexes, labels, timestamps, kickers, code | **Roboto Mono** (variable 100–700) | 400 code, 700 labels | The face the reader sees most — every index, duration, tag and status. Plain, wide-set and unmannered on purpose: it does structural work behind `01` and `21:15` hundreds of times a page rather than asking to be admired. Shipped rather than borrowed, so the most-repeated voice in the UI is the same on every platform. |

**One sans, not a display/text pair.** The previous system ran two cuts — one
to speak, one to explain — and the seam between them had to be managed at
every size: two sets of metrics, two optical weights meaning different things,
a heading never quite on the same rhythm as the paragraph under it. Switzer
covers the range alone, separated by **weight and size** rather than by face.
`--font-heading` survives as a token name (components reference it, and a
future display face is one token away); it resolves to the same stack.

The faces still **never compete for a job** — that hard rule is Principle 2.
If it is a sentence it is Switzer; if it is a quotation it is the platform serif; if it
is data it is mono, uppercase and tracked (`--tracking-label`).

Optical corrections applied (the part generic deployments miss):

- **`--tracking-tight` (-0.022em) on h1–h3.** Switzer sets fairly tight
  already, so this is a smaller correction than the previous cut needed — but
  large sizes still want closing up, because tracking is drawn for text sizes
  and does not scale down on its own. Body text is never tightened.
- **`text-wrap: balance` on headings**, so a two-line title breaks evenly
  instead of leaving one orphaned word.
- **Tabular numerals** (`font-variant-numeric: tabular-nums`) on every
  duration, count and score — this is also what keeps digits aligned across
  the three different platform mono faces.
- **Body copy is 400, not 450.** The previous Nunito-derived cut rendered
  *grey* rather than black at reading sizes, so this system used **450
  ("Book")** — an interpolation step invented for that face's problem.
  Switzer's Regular is properly fitted and does not have it; carrying 450
  across would have been cargo. Switzer also has a real **500**, which the old
  family lacked, so the ramp is 400 / 500 / 600 / 700 and every step is a
  weight that was actually drawn.
- Both shipped faces are **self-hosted variable woff2s** with a metric-matched
  fallback (`Switzer Fallback`) — no FOUT jump, no third-party font host.

Weight tables, the subsetting recipe and the reasoning: `fonts/README.md`.

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
