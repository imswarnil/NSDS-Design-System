# Integrating NSDS

One design system, two renderers: the **Ghost theme** (Handlebars + Tailwind v4)
and the **Next.js LMS** (React). Both consume the same tokens and the same
`.ns-*` class layer, so a course card is *one component with two renderers*
rather than two components that look alike until someone edits one of them.

This document is the contract. If the two products ever disagree visually, the
cause is almost always a step on this page that one of them skipped.

---

## The three things that MUST match

Everything else is detail. These three are what keep the products aligned:

| | Value | Why it cannot drift |
|---|---|---|
| **Spacing base** | `--spacing: 0.25rem` in Tailwind, `--space-*` in CSS | `p-4` and `var(--space-4)` must both be 16px |
| **Theme attribute** | `data-theme="dark"` on `<html>` | Tokens listen to it; Tailwind's `dark:` variant is remapped to it |
| **Theme storage key** | `ns-theme` in `localStorage` | A reader moving between marketing site and app keeps their theme |
| **Layer order** | `@layer theme, base, ns-components, components, utilities;` | It is what makes a utility beat a `.ns-*` default without `!important` |

`npm run check` in this package re-proves the first one on every CI run. The
other two are set in one shared file, `assets/js/theme-init.js`, which both
products inline verbatim.

### The layer order, and why it is the whole override contract

`styles.css` opens with a bare `@layer` statement (legal before `@import`) that
declares the order once:

```css
@layer theme, base, ns-components, components, utilities;
```

Read it as a precedence list, lowest first:

| layer | holds |
|---|---|
| `theme` | Tailwind's `@theme` variables |
| `base` | preflight and `tokens/base.css` — bare element defaults |
| `ns-components` | **this design system** |
| `components` | **your** component classes — they beat ours |
| `utilities` | Tailwind utilities — they beat everything |

Two consequences worth knowing:

- **A utility always wins.** `<button class="ns-btn ns-btn--primary p-8 bg-error">`
  is red with 2rem padding, no `!important` anywhere. Specificity inside
  `components/css/` no longer competes with anything outside it — a `:has()`
  chain scoring (0,5,0) still loses to a plain `.p-4`.
- **Nothing may sit outside a layer.** An unlayered rule beats every layered
  rule regardless of specificity, so a single stray one silently revokes the
  above. `npm run check` fails on it, and on any `!important` that is not in the
  argued-for allowlist in `scripts/check-cascade.mjs`.

If you write your own component CSS, put it in `@layer components` and it will
override the design system while still losing to utilities — which is almost
always what you want.

---

## Ghost theme

### 1. Install

```bash
npm install @namaste-salesforce/design-system
```

Or, if the design system lives in the same repo, point at the folder:

```json
"dependencies": {
  "@namaste-salesforce/design-system": "file:./design-system"
}
```

### 2. CSS

In `assets/css/screen.css`, replacing the theme's own `@theme` block:

```css
@import "tailwindcss";
@import "@namaste-salesforce/design-system/styles.css";
@import "@namaste-salesforce/design-system/tokens/tailwind.css";

/* Theme-only styles below. Anything reusable belongs in the design system's
   component layer, not here — that is the boundary that keeps the two
   products from drifting. */
```

The existing gulp + `@tailwindcss/postcss` pipeline handles this unchanged.
`postcss-import` resolves the package paths; no gulp config change is needed.

> **Do not import `dist/namaste-ui.tailwind.css` here.** That bundle is
> Tailwind *plus* the design system, built for this repo's own styleguide. In a
> product that already runs Tailwind it would add a second preflight and a
> second copy of every utility. The three imports above are the supported path.


> **If the gulp pipeline cannot resolve `@import` across `node_modules`**, use
> the prebuilt flat bundle instead — same bytes, no import graph:
> ```css
> @import "tailwindcss";
> @import "@namaste-salesforce/design-system/dist/namaste-ui.css";
> @import "@namaste-salesforce/design-system/tokens/tailwind.css";
> ```

### 3. Fonts and icons

Copy the self-hosted assets into the theme's `assets/` so Ghost serves them
from its own origin (Ghost does not serve files out of `node_modules`):

```bash
cp -R node_modules/@namaste-salesforce/design-system/fonts assets/
cp -R node_modules/@namaste-salesforce/design-system/icons assets/
```

The `@font-face` URLs in the bundle resolve relative to the stylesheet, so
`fonts/` and `icons/` must sit next to the compiled CSS.

### 4. Theme bootstrap — before anything else

In `default.hbs`, inside `<head>`, **before `{{ghost_head}}` and before the
stylesheet link**:

```hbs
<script>
  {{!-- Paste the contents of assets/js/theme-init.js here, INLINE.
        A <script src> is fetched asynchronously and paints too late, which is
        the white-flash-on-every-navigation bug this exists to prevent. --}}
</script>
```

Then, immediately inside `<body>`:

```hbs
{{> "ns/skip-link"}}
```

and give the main landmark the matching id and tabindex:

```hbs
<main id="main" tabindex="-1">
```

`tabindex="-1"` is not optional — without it, Safari and Chrome move the
viewport but leave focus at the top of the document, and the skip link
accomplishes nothing.

### 5. Templates → partials

The design system ships framework-agnostic HTML in `templates/` — the same
`.ns-*` markup the React components render, with stack-specific slots marked
in comments. To use one in the theme:

1. Copy it into `partials/` and rename to `.hbs`
   (`templates/signin-form.html` → `partials/ns-signin-form.hbs`).
2. Swap the marked slots for Ghost helpers — hrefs to `{{@site.url}}/…`,
   titles to `{{title}}`, the brand name to `{{@site.title}}`.
3. The `data-members-*` attributes are Ghost Members hooks and work as-is.

```hbs
{{> "ns-signin-form"}}   {{!-- members.hbs / signin.hbs --}}
{{> "ns-ticket-form"}}   {{!-- support page --}}
{{> "ns-error-page"}}    {{!-- error-404.hbs, error.hbs --}}
```

### 6. Verify

```bash
npm run build && npx gscan .
```

`gscan` should report no new errors — the design system adds no Ghost API
usage of its own beyond the members data attributes, which are standard.

---

## Next.js LMS

### 1. Install

```bash
npm install @namaste-salesforce/design-system
```

### 2. CSS

In `app/globals.css`:

```css
@import "tailwindcss";
@import "@namaste-salesforce/design-system/styles.css";
@import "@namaste-salesforce/design-system/tokens/tailwind.css";
```

Fonts resolve from the package automatically — Next's bundler rewrites the
`url()` paths, so no copying is needed here.

### 3. Theme bootstrap

In `app/layout.js` — read the shared script at build time so the two products
literally cannot diverge:

```jsx
import fs from "node:fs";
import { createRequire } from "node:module";
import "./globals.css";

const require = createRequire(import.meta.url);
const themeInit = fs.readFileSync(
  require.resolve("@namaste-salesforce/design-system/assets/js/theme-init.js"),
  "utf8",
);

export default function RootLayout({ children }) {
  return (
    /* suppressHydrationWarning because the script mutates this element before
       React hydrates — which is the entire point, and not a mismatch to fix. */
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <SkipLink />
        <main id="main" tabIndex={-1}>{children}</main>
      </body>
    </html>
  );
}
```

### 4. Components

```jsx
import { Field, Input, Select, Switch } from "@namaste-salesforce/design-system/components/forms/Form";
import { Modal, ConfirmModal, Menu }    from "@namaste-salesforce/design-system/components/overlays/Overlay";
import { Tabs, Pagination, Breadcrumb } from "@namaste-salesforce/design-system/components/navigation/Navigation";
import { Topnav, NavBrand, NavLinks, NavLink, MegaMenu, UserMenu, Burger, NavSheet }
                                       from "@namaste-salesforce/design-system/components/navigation/Navbar";
import { Alert, ToastProvider, useToast, EmptyState } from "@namaste-salesforce/design-system/components/feedback/Feedback";
import { ProgressBar, Steps, DataTable } from "@namaste-salesforce/design-system/components/progress/Progress";
import { ThemeToggle, ThemeSwitcher, SkipLink }
                                       from "@namaste-salesforce/design-system/components/core/ThemeToggle";
```

Wrap the app once in `<ToastProvider>` — the live region has to exist before
any message is inserted into it, or screen readers announce nothing.

### 5. Tokens in JavaScript

```js
import { cssVar, chartCategorical, token } from "@namaste-salesforce/design-system";

<div style={{ color: cssVar.colorBrand500 }} />   // preferred — flips with the theme
token("colorSurface", "dark")                      // literal, for canvas or <meta theme-color>
chartCategorical[0]                                // ordered chart slots, never cycled
```

Prefer `cssVar`. A literal is frozen at the value it had when JS read it and
will not follow a theme change.

---

## Working on the design system

```bash
npm run build          # regenerate token exports + dist/
npm run check          # everything CI runs
```

| Command | Proves |
|---|---|
| `check:tokens` | `tokens.json` / `.js` / `.d.ts` / `tailwind.css` match `tokens/*.css` |
| `check:principles` | No raw colors, radii, z-indexes, timings, fonts or spacing in the component layer |
| `check:palette` | The chart palette still clears the lightness, chroma, CVD, normal-vision and contrast checks |
| `check:css` | `dist/` is not stale |

Wire it into both products' CI:

```yaml
- run: npm --prefix design-system ci
- run: npm --prefix design-system run check
```

---

## Where a change belongs

| Change | Goes in |
|---|---|
| A color, size, radius, duration | `tokens/*.css` — never in a component |
| A visual style used by both products | `components/css/*.css` |
| Keyboard/ARIA behaviour for React | the `.jsx` in `components/<domain>/` |
| The same markup for Ghost / static | the matching `templates/*.html` |
| Something only one product needs | that product's repo, not here |

The last row matters most. A design system that absorbs one-product
requirements stops being shared infrastructure and becomes a third codebase
to maintain.
