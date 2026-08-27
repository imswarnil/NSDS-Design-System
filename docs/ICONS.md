# Icons

Two sets, one optical weight.

| Set | What it is | Where it lives |
| --- | --- | --- |
| **NSDS** | ours — the vocabulary Phosphor has no word for | `src/icons/<style>/<name>.svg` |
| **Phosphor** | a subsetted icon font, ~300 generic glyphs | `icons/phosphor.css` + two `.woff2` |

Both are drawn on a 24px grid at a 1.7px stroke, so the two mix in one row
without reading as two libraries.

---

## Adding an icon

Drop an SVG in a folder. That is the whole workflow.

```
src/icons/regular/my-icon.svg
```

```html
<!-- my-icon — what the drawing shows, in a few words
     keywords: synonym other-word people-might-type -->
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none"
     stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">
  <path d="…"/>
</svg>
```

Then `npm run build` (or `npm run build:icons`). It regenerates
`icons/nsds-icons.svg` and `icons/icons.json`, and the searchable grid at
`/preview/icons.html` picks it up.

**Write the `keywords:` line.** A drawing's description is written by whoever
drew it, in their words — "the completion rosette" — and the person searching
types the word they arrived with, which is "award". Without the synonyms the
icon is unfindable by anyone who did not name it.

### Using one

```html
<svg class="ns-icon" aria-hidden="true">
  <use href="/icons/nsds-icons.svg#nsds-my-icon"/>
</svg>
```

`.ns-icon` makes it 1em square in `currentColor`, so it inherits like a
letter. Give it `role="img"` and an `aria-label` instead of `aria-hidden`
when the icon is the only thing carrying the meaning.

---

## Styles

A style is a directory. The same file name in two of them is the same icon.

| Style | Folder | For |
| --- | --- | --- |
| `regular` | `src/icons/regular/` | the workhorse — 1.7px stroke |
| `fill` | `src/icons/fill/` | the selected/active state of the same icon |
| `duotone` | `src/icons/duotone/` | a solid shape at low opacity under a stroke pass |

Ids: `#nsds-<name>` for regular, `#nsds-<name>-fill`, `#nsds-<name>-duotone`.

**Every icon must exist in `regular`.** It is the fallback every other style
degrades to, and the build fails on a variant with no default — a
`fill/corse.svg` is a typo, not a new icon, and shipping it would put a glyph
in the sprite that nothing can fall back to.

### Duotone

One symbol, two passes: a filled group at low opacity beneath the stroke.

```html
<g fill="currentColor" stroke="none" opacity=".22">…the solid shape…</g>
<path d="…the stroke pass…"/>
```

Both use `currentColor`, so the pair stays in one hue at any colour and needs
no second variable — which is what stops a duotone icon being the one thing
on a page that ignores the ink. The tint lives in the drawing rather than in
the CSS because the right ratio differs per icon: a large solid area needs
less than a thin one to read at the same weight. `.ns-icon--duotone-strong`
lifts the whole tint where 0.22 disappears, such as on a dark band.

---

## Why a sprite and not a font

An `<svg><use>` reference is a real image: it takes `currentColor`, it can
carry two colours for duotone, it never renders as a missing-glyph box while
a webfont loads, and a screen reader ignores it unless you label it. An icon
font is glyphs in a text stream — convenient, and it inherits every
font-loading failure mode and reads as a private-use character to anything
that does not know better.

The system *does* ship one icon font: a Phosphor subset, because subsetting
somebody else's 700KB face down to the ~300 glyphs used here is worth the
build step. For our twenty, a 6KB sprite is smaller than any font we could
build.

**If that trade changes** — hundreds of icons, or a consumer who needs a font
specifically — the source folder is already the right shape for it. Any of
`fantasticon`, `svgtofont` or `fontello` takes a directory of SVGs, and
`src/icons/<style>/` is exactly that. It would be a devDependency and a
script; nothing about the drawings would move.

---

## Regenerating the Phosphor subset

`scripts/subset-icons.py` reads every `ph-*` this repo references and rebuilds
`icons/phosphor.css` plus the two `.woff2` files from the upstream package.
Run it after adding a Phosphor glyph, or `check-icons` will tell you the glyph
renders as empty space.
