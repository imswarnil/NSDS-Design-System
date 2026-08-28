# The build, end to end

Everything in this repository is either **authored** or **generated**, and the
build is the one-way street between them. `src/` is authored. `dist/`, the
styleguide, the icon sprite, the skill bundle and the homepage are generated.
CI rebuilds everything and runs `git diff --exit-code`, so a hand-edited
output or a forgotten regeneration fails the build rather than shipping.

```
npm run dev     build → serve at :4322 → watch → live reload
npm run build   the full pipeline below
npm run check   the ten gates (what CI runs; npm test is an alias)
npm run site    build + stage _site/ + link check   (deploy preview)
```

Every gulp task is a thin wrapper over a script in `scripts/`, so
`node scripts/<x>.mjs` always works with no gulp.

## The pipeline, in order

```
1  build-tokens.mjs    src/tokens/*.css  ──►  dist/tokens.json / .js / .d.ts
                                              src/tokens/tailwind.css
2  build-icons.mjs     src/icons/<style>/*.svg ──► icons/nsds-icons.svg
                                                   icons/icons.json
3  build-css.mjs       src/styles.css   ──►  dist/nsds.css (+ .min)
                       src/tailwind.css ──►  dist/nsds.tailwind.css (+ .min)
4  build-preview.mjs   component-docs.mjs + templates/ + **/*.card.html
                                        ──►  preview/*.html, search.json,
                                             pages.json
5  build-home.mjs      renderHome()     ──►  index.html (root AND _site/)
6  build-skill.mjs     tokens + classes + COMPONENTS
                                        ──►  .claude/skills/namaste-ui/
```

Each step reads the REAL artifact the step before it wrote — the styleguide
scrapes the actual CSS, the skill bundle reads the actual tokens — which is
why none of them can drift from the source: there is nothing to keep in sync
by hand.

### 1. Tokens

`src/tokens/*.css` is the source of truth — plain CSS custom properties,
grouped by definition: `colors`, `typography`, `spacing`, `layout`,
`effects`, `fonts` (the `@font-face` rules), `base` (element defaults).
`build-tokens.mjs` parses them and emits:

- `dist/tokens.json` / `tokens.js` / `tokens.d.ts` — for JS consumers.
- `src/tokens/tailwind.css` — the `@theme` bridge, generated INTO src on
  purpose: `src/tailwind.css` imports it, and a source file may not import a
  build output.

The **bridge check** fails the build if a token has no matching Tailwind
utility emit — adding a token and forgetting the emit line is a build error,
not a silent gap.

### 2. Icons

One SVG per icon per style under `src/icons/{regular,fill,duotone}/`. The
build concatenates them into a single `<symbol>` sprite and a JSON manifest
(name, style, keywords — the keywords come from each file's header comment).
Every icon must exist in `regular`; a variant with no default fails.

### 3. CSS

`src/styles.css` declares the layer order — `theme, base, ns-components,
components, utilities` — then imports tokens, base and the component layer.
`build-css.mjs` flattens the whole `@import` graph into `dist/nsds.css`
(plus a minified twin, plus the Tailwind pair from `src/tailwind.css`).
The flat bundle exists because the Ghost theme's own gulp pipeline
concatenates plain CSS and cannot resolve imports across node_modules.

**Import order is cascade order.** Inside one `@layer`, source order decides
ties, so `src/css/index.css` is not a directory listing — it is the
tiebreaker table. The folder a file lives in and the position it is imported
at are independent decisions.

### 4–6. Styleguide, homepage, skill

`component-docs.mjs` holds one `COMPONENTS` array; each entry's `html`
string both renders the demo and prints as the code sample, so they cannot
disagree. `build-preview.mjs` renders those plus the foundation pages and
full-page demos, and writes `search.json` (the command palette's index) and
`pages.json` (which `build-site.mjs` reads for the homepage link index and
sitemap). `build-skill.mjs` packs the tokens, the class inventory and the
component contracts into `.claude/skills/namaste-ui/` for use from other
repositories.

## The ten gates

`npm run check` = `build-tokens --check`, `lint-principles`, `check-cascade`,
`check-components`, `check-layout`, `check-icons`, `check-palette`,
`build-css --check`, `build-skill --check`, `build-icons --check`.
`check-markup` and `check-links` run outside the fast path — use them when
you touch markup or pages. Check by **exit code**, not by grepping output.

## Where a rule lives — the src/css tree

The layout contract (see `docs/LAYOUT.md`) is the map:

```
src/css/
  foundation/        the invisible groundwork — no component owns it
    a11y.css           visually-hidden, skip link, reduced-motion opt-out
    typography.css     the type voices and effects (.ns-label, .ns-record,
                       marks, reveals, scramble)
    motion.css         the entrance vocabulary (.ns-anim-*, .ns-parallax)
    icon.css           icon sizing and the duotone treatment
    print.css          the paper contract — imported LAST, wins every tie
  layout/            the three levels, one file per level
    section.css        SECTION   .ns-band — the ground + space between sections
    container.css      CONTAINER .ns-page, .ns-center, the docs shell
    grid.css           the auto-fitting card grid
    stack.css          STACK     .ns-stack, .ns-cluster, .ns-bare
  components/        one folder per component — the reusable parts
    button/ form/ card/ tag/ badge/ chip/ avatar/ list/ table/ code/
    overlay/ feedback/ progress/ media/ strip/ marquee/ divider/ kbd/
    copy/ deflist/ logo/
  navigation/        navbar, menus/tabs/breadcrumb/pagination, toc
  content/           reading surfaces — prose, content blocks, the marketing
                     bands built ON the section level, blog
  product/           whole product surfaces — lms, training, catalog,
                     player, deck, ai, admin, helpdesk, auth, chart
  integrations/      third-party seams — ghost, ads, monetization
  index.css          the import manifest — ITS ORDER IS THE CASCADE ORDER
```

The test for where a new rule goes, in order: is it invisible groundwork
(foundation), is it one of the three layout levels (layout), is it a
reusable part (components — new folder, one file), is it read continuously
(content), does only one product surface use it (product), does it exist
because of a third party (integrations)?

A *container* owns how a component looks inside it — `.ns-topnav__actions
.ns-btn` belongs in `navigation/navbar.css`, not in
`components/button/button.css`.

## Deploy

`main` → GitHub Actions → `gulp site` stages `_site/` (homepage, styleguide,
sitemap, robots, **CNAME** — dropping CNAME drops the custom domain) →
GitHub Pages at nsds.imswarnil.com.
