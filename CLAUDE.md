# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm install
npm run dev          # gulp: build → serve at :4322 → watch → SSE live reload
npm run build        # tokens → CSS bundle → styleguide. Run after ANY token or CSS edit.
npm run check        # the seven gates CI runs (npm test is an alias)
npm run site         # build + stage _site/ + link check
npm run serve        # serve an existing build, no watching
```

The seven gates in `npm run check` are: `build-tokens --check`, `lint-principles`, `check-cascade`, `check-components`, `check-icons`, `check-palette`, `build-css --check`. **`check-markup` and `check-links` are not among them** — run those yourself when you touch markup or add pages.

Individual gates, for a fast loop while iterating:

```bash
node scripts/lint-principles.mjs   # raw values in components/css
node scripts/check-cascade.mjs     # layer-order contract
node scripts/check-components.mjs  # .jsx parses; no inline styling
node scripts/check-palette.mjs     # chart hues vs colourblind floors
node scripts/check-markup.mjs      # every .ns-* used is defined
node scripts/check-icons.mjs       # glyphs present in the Phosphor subset (warns, does not fail)
node scripts/check-links.mjs       # needs _site/ — run `npm run site` first
node scripts/build-tokens.mjs --check
```

Every gulp task is a thin wrapper over `scripts/*.mjs`, so `node scripts/<x>.mjs` always works with no gulp.

**Check by exit code, not by grepping output.** The linters print human-readable findings with no `FAIL`/`ERROR` prefix, so `npm run check | grep -i error` reports success on a failing build. Use `npm run check; echo $?`.

## Architecture

### One CSS layer, two products

This system feeds a **Ghost theme** (Handlebars + Tailwind v4) and a **Next.js LMS** (React). The only thing they can genuinely share is CSS, so:

- `components/css/*.css` — the `.ns-*` class layer. **All styling lives here.**
- `components/<domain>/*.jsx` — thin React wrappers. Behaviour only: generated ids, ARIA wiring, roving tabindex, focus restoration. `check-components.mjs` fails the build on inline styling.
- `templates/*.html` — the framework-agnostic HTML contract for full surfaces, which each stack adapts.
- `docs/INTEGRATION.md` — the contract between the two products.

A React component that styles itself is a component the Ghost theme has to reimplement.

### Tokens are generated, and the generation is enforced

`tokens/*.css` is **authored**. `tokens/tokens.json`, `tokens.js`, `tokens.d.ts` and `tokens/tailwind.css` are **generated** by `npm run build`. CI runs `git diff --exit-code` after building, so a hand-edit or a forgotten regeneration fails.

**Adding a token requires a matching Tailwind emit.** `build-tokens.mjs` has a "bridge" check that fails if a `tokens/*.css` variable has no corresponding `--text-*` / `--color-*` / `--space-*` utility. Add the emit line in `build-tokens.mjs` in the same commit, or the build refuses.

### The cascade contract

`styles.css` declares `@layer theme, base, ns-components, components, utilities` before any import. That single line is why a Tailwind utility always beats a `.ns-*` default with no `!important`, and why a consuming app's own `components` layer beats ours regardless of import order. Two things silently revoke it — a rule outside any layer, and a changed order — so `check-cascade.mjs` parses the `@import` graph and guards it.

Consequence: specificity inside `components/css/` only decides DS-vs-DS conflicts. A `:has()` chain still loses to `.p-4`.

### The styleguide generates itself from the real artifacts

- `scripts/component-docs.mjs` — a single `COMPONENTS` array is the **source** for every per-component page. One entry → `preview/c-<id>.html`. The `html` string in a variant both renders the demo and prints as the code sample, so they cannot disagree.
- `scripts/build-preview.mjs` — renders those into pages, plus the foundation sections, chart docs and content-creation docs, plus the full-page demos (a `DEMOS` array maps a `templates/*.html` to `preview/demo-*.html`).
- `**/*.card.html` — standalone specimens, discovered by walking the tree. Config lives in an HTML comment on **line 1**: `<!-- @dsCard group="…" viewport="760x1200" name="…" subtitle="…" -->`. The `viewport` height must match what the card actually renders to, or the styleguide frames it with a scrollbar or dead space — measure it in a browser rather than guessing.
- `preview/pages.json` — a manifest `build-preview.mjs` writes; `build-site.mjs` reads it to generate the homepage's link index and `sitemap.xml`. A new page appears in both automatically or in neither.

`preview/` and `_site/` are git-ignored (both are one command away). `dist/` **is** committed on purpose — the Ghost theme's own gulp pipeline consumes the flat bundle directly, and `build-css.mjs --check` proves it matches source.

### The type scale forks

`--size-body` (14px) is the **UI** base — rails, tables, admin, player chrome. `--size-prose` (17px) / `--size-prose-lead` (20px) / `--size-prose-small` (15px) are the **reading** scale, used by `.ns-prose` and the surfaces built on it. The axis is scanned-versus-read. Do not set an article at `--size-body` or a table row at `--size-prose`.

## Rules the build enforces

`lint-principles.mjs` fails on any raw color, radius, `z-index`, transition duration, `font-family` or padding/margin/gap literal inside `components/css/`, plus any border wider than 3px.

**It also catches raw values inside `var()` fallbacks** — `var(--duration-slow, 240ms)` fails. Use the token with no fallback.

If a value genuinely cannot be a token, append `/* lint-ok: <reason> */` on that line, so the exception is argued for in the diff rather than buried in a config.

`check-markup.mjs` requires every `.ns-*` class appearing in any `.html`, `.jsx` or `.mjs` to have a rule in the component layer. Inventing a class name in a doc entry or a template without adding the CSS fails the build.

Before adding a component, `docs/CONTRIBUTING.md` asks three questions in order: does the platform already do this (restyle `<dialog>`/`<details>`/`<progress>`, do not reimplement); do **both** products need it; does it pass the five Design Principles in `readme.md`. The accessibility floor in that file is a requirement list, not aspirations.

Do not hand-tune chart hues. The palette was solved against six computable checks and a "slightly warmer" nudge can drop deuteranopia separation below the floor with no visible change — re-step the hue until `check-palette.mjs` passes.

## Deploy

`main` → GitHub Actions → GitHub Pages at <https://nsds.imswarnil.com/>. `gulp site` stages `_site/`, and `build-site.mjs` writes the homepage, `robots.txt`, `sitemap.xml` and **`CNAME`** — on an Actions deploy Pages reads the custom domain out of the artifact, so a build that ships no CNAME drops the domain on the next publish. `SITE_URL` overrides the host for canonicals, sitemap and CNAME.

`LIVE.md` covers the URLs, the DNS records and troubleshooting. `OBS.md` covers building the documented lesson and live-stream scenes in OBS Studio.
