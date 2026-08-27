# Customising and overriding

Three levels, from a one-line brand change to forking a component. Take the
cheapest one that does the job — each level down is more you have to maintain
when the system updates.

---

## Level 1 — retheme with tokens

**This is where almost everything belongs.** Every colour, size, radius and
duration is a custom property. Redefine the ones you want *after* the
stylesheet loads and the whole system follows, in both themes, with no
build step.

```css
@import "nsds-design-system/css";

:root {
  /* the brand ramp — one hue, 50 → 900 */
  --ns-brand-500: #7c3aed;
  --ns-brand-600: #6d28d9;
  --ns-brand-900: #2e1065;

  /* the type scale forks: UI vs reading */
  --ns-font-sans: "Inter", system-ui, sans-serif;
}
```

### Why `--ns-*` and not `--color-*`

There are two layers of names on purpose:

| Layer | Example | Redefine it? |
| --- | --- | --- |
| **private source** | `--ns-brand-500` | **yes** — this is the theming surface |
| **public semantic** | `--color-brand-500`, `--color-ink` | no — these alias the private ones |

The public names are what components consume, and several of them are owned
by Tailwind's `@theme`. Setting `--ns-brand-500` changes every place the
system resolves that hue, in light and dark, including the ones you have not
thought of. Setting `--color-brand-500` changes it in exactly one theme and
leaves the other wrong — and nobody notices which until a user with the other
setting complains.

### Dark mode comes free

The tokens flip under `[data-theme="dark"]`. If you only override the `--ns-*`
sources, both themes stay correct with no second stylesheet and no media
query of your own. Overriding a resolved value like `--color-surface`
directly is the one reliable way to break that.

---

## Level 2 — override a component

The cascade is set up so you win without `!important`. `styles.css` declares:

```css
@layer theme, base, ns-components, components, utilities;
```

Everything in this system lives in `ns-components`. Your app's own
`components` layer comes **after** it, so your rule beats ours regardless of
import order and regardless of specificity:

```css
@layer components {
  .ns-card { border-radius: 0; }   /* wins — no !important needed */
}
```

A Tailwind utility beats both, which is also deliberate: `class="ns-card p-8"`
gives you the padding you asked for.

**Consequence worth knowing:** specificity *inside* the system only decides
system-vs-system conflicts. A `:has()` chain in `navbar.css` still loses to a
plain `.p-4`.

---

## Level 3 — fork a component

If you need markup the system does not have, copy the class into your own
stylesheet under a **different name**. Do not redefine `.ns-*` wholesale.

```css
@layer components {
  .app-card { /* started from .ns-card, then diverged */ }
}
```

The rule of thumb: if you are changing *values*, that is Level 1. If you are
changing *rules*, that is Level 2. If you are changing the *structure*, fork
it and give it your own name — a `.ns-card` that no longer behaves like a
`.ns-card` is a trap for the next person who reads the class name and assumes
the documentation applies.

---

## What not to do

**Do not re-implement the look from the class list.** The value of the system
is that one layer feeds every surface; a second copy diverges on the first
change and the two are never reconciled. If a project genuinely cannot take
the bundle, the honest answer is "this project is not on the design system
yet" — an approximation looks close enough that nobody ever fixes it.

**Do not hard-code a value the system has a token for.** A literal is a bug
in exactly one theme.

**Do not style a React component inline.** The CSS layer is the portable
part; a component that styles itself is a component every other renderer has
to reimplement.

---

## Where things live

```
src/
  tokens/      authored token CSS — the theming surface
  css/         the .ns-* layer, grouped
    foundation/    a11y, icon, motion, type-fx
    primitives/    button, form, display, media, feedback, progress,
                   overlay, table, code
    navigation/    navigation, navbar, toc
    content/       prose, content, sections, blog
    product/       lms, training, catalog, player, deck, ai, admin,
                   helpdesk, auth, chart
    integrations/  ghost, ads, monetization
  react/       thin React wrappers over the classes — behaviour only
  patterns/    background patterns
  styles.css   the entry: tokens + base + the layer
  tailwind.css the Tailwind v4 entry

dist/          build output — nsds.css, nsds.min.css, the Tailwind pair,
               and tokens.json / tokens.js / tokens.d.ts
```

A component owns its own file; a **container** owns how a component looks
inside it. `.ns-topnav__actions .ns-btn` belongs in `navigation/navbar.css`,
not in `primitives/button.css` — otherwise the button has to know about the
navbar, the player and the deck.
