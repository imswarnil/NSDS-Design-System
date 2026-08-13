# The N&M type family

The system's three custom cuts, self-hosted as latin-subset variable woff2s
(~77 KB for the whole family). Declared in `tokens/fonts.css`, exposed as
`--font-heading` / `--font-sans` / `--font-mono` in `tokens/typography.css`.

Each file is a renamed derivative of a SIL OFL 1.1 face — the same approach
as Airbnb Cereal. The source credit is embedded in each font's own name
table (nameID 3), and the OFL travels with the derivative (`fonts/OFL.txt`).

| File | Family | Source cut | Axis | Role |
|---|---|---|---|---|
| `nmdisplay-var-latin.woff2` | **N&M Display** | Manrope | `wght` 200–800 | Headings & display |
| `nmtext-var-latin.woff2` | **N&M Text** | Nunito Sans | `wght` 200–1000 | Prose & UI copy |
| `nmmono-var-latin.woff2` | **N&M Mono** | Red Hat Mono | `wght` 300–700 | Indexes, labels, timestamps, kickers, code |

## Named weights

Only these weights are part of the system — anything else is off-scale.

| Cut | Weight | Name | Token | Used for |
|---|---|---|---|---|
| Display | 800 | ExtraBold | `--weight-heading` | Hero, h1–h3 |
| Display | 700 | Bold | `--weight-semibold` | h4, card titles, buttons |
| Display | 600 | SemiBold | `--weight-medium` | Nav links, tab labels |
| Text | 450 | **Book** | `--weight-body` | **Body copy — the reading default** |
| Text | 400 | Regular | `--weight-regular` | Dense UI text, table cells, meta |
| Text | 600 | SemiBold | `--weight-body-strong` | Inline `<strong>`, definition terms |
| Text | 700 | Bold | — | Lead-ins, stat labels |
| Text | 900 | Black | — | Reserved — pull-quotes and big stats only |
| Mono | 400 | Regular | — | Code blocks, inline code, timestamps |
| Mono | 700 | Bold | `--weight-label` | Uppercase tracked labels |

### Why body copy is 450, not 400

Nunito Sans — and therefore N&M Text — has a genuinely light Regular. At
16 px on white, with `-webkit-font-smoothing: antialiased`, 400 renders
thinner than the same nominal weight in Inter or Helvetica and reads as grey
rather than black. The system's reading regular is therefore **Book, 450** —
one interpolation step up the `wght` axis, which is free on a variable font
and costs nothing in bytes. It is a named weight here, not an ad-hoc value:
it ships as a static cut too, so print and desktop match the web.

Two changes travel with it: `-webkit-font-smoothing: antialiased` now applies
only in dark mode (where it is a genuine improvement on a navy surface, and
where thinning is wanted rather than a bug), and `--color-muted` was darkened
to clear 7:1 rather than sit at 4.9:1.

## Optical rules

- h1–h3 tighten to `--tracking-tight` (-0.022em); body is never tightened.
- Mono labels are uppercase + `--tracking-label` (+0.09em).
- Digits in data always set `font-variant-numeric: tabular-nums`.
- `N&M Text Fallback` (in `tokens/fonts.css`) is a metric-matched local
  fallback so text does not reflow when the webfont arrives.
- Reading measure is capped at `--container-prose` (42rem, ~72 characters).

## The open-source package

`fonts/` is a complete, redistributable OFL package — the variable files, the
license, and a full static family generated from them:

```
fonts/
├── nmdisplay-var-latin.woff2   variable — what the web loads
├── nmtext-var-latin.woff2
├── nmmono-var-latin.woff2
├── OFL.txt                     SIL Open Font License 1.1 + upstream credits
└── static/
    ├── nm-static.css           @font-face sheet for the static family
    ├── woff2/                  21 cuts — web use without variable support
    └── ttf/                    21 cuts — desktop install (Figma, Word, print)
```

Regenerate the static family after changing a variable file:

```bash
pip install "fonttools[woff]" brotli
python3 scripts/build-fonts.py
```

The script instances each named weight off the `wght` axis, then fixes the
name table and `OS/2` bits so installers show a real family menu rather than
21 fonts all called "Regular" (non-RIBBI styles become their own Windows
family, which is the only way the full range is reachable from a font menu).

### Using the family outside this system

```html
<link rel="stylesheet" href="fonts/static/nm-static.css">
<style>body { font-family: "N&M Text", system-ui, sans-serif; font-weight: 450; }</style>
```

Redistribution terms are the OFL's: use it, modify it, bundle it, sell it
with software — just never sell the fonts by themselves, and keep derivatives
under the same license with `OFL.txt` alongside.
