# Fonts

**One shipped face. ~62 KB total, in four files.**

| role | face | file | axis | size |
|---|---|---|---|---|
| sans — interface, reading **and** the data voice | **Figtree** | `figtree-var-latin.woff2` | `wght 300–900` | 20 KB |
| — latin-extended coverage | Figtree | `figtree-var-latin-ext.woff2` | `wght 300–900` | 10 KB |
| — italic | Figtree | `figtree-italic-var-latin.woff2` | `wght 300–900` | 21 KB |
| — italic, latin-ext | Figtree | `figtree-italic-var-latin-ext.woff2` | `wght 300–900` | 10 KB |
| code — `pre`, `code`, the `.ns-code` component | *platform mono* | — not shipped — | — | 0 KB |
| serif — quotations | *platform serif* | — not shipped — | — | 0 KB |

Figtree is Erik Kennedy's geometric grotesque, under the **SIL Open Font
Licence 1.1** (`licences/OFL-figtree.txt`, which must travel with the files).
Variable woff2, self-hosted — nothing is fetched from a third-party CDN at run
time. Every weight from Light 300 to Black 900 is one file per style; the
latin-ext and italic files load only when a page actually uses those
characters, because the `@font-face` rules carry `unicode-range`.

## Why one face, not two

The system used to ship a pair — Switzer for words, Roboto Mono for data —
and the mono family was doing a job that treatment does better. The label
voice was never really "monospace": it was **uppercase, tracked, bold, small
and tabular**, and the family was merely the loudest of those five signals.

So the data voice is now a **recipe**, not a font:

```
uppercase + letter-spacing (--tracking-label) + weight 600–700
+ --size-label / --size-mono + font-variant-numeric: tabular-nums
```

`--font-mono` survives as a token name — the three-hundred-odd places that say
"this is data, not prose" keep saying it in one word — it simply resolves to
Figtree. If the treatment ever proves too quiet, pointing that one token back
at a real mono restores the old voice with no component changes.

**Tabular figures are now opt-in, and the system opts in.** Roboto Mono
aligned digit columns for free; Figtree's default figures are proportional
(right for prose, wrong for a duration column). Figtree carries the `tnum`
feature, and `tokens/base.css` plus the label classes (`.ns-label`,
`.ns-record`, `time`, `output`, `[data-numeric]`) apply it.

## Why heading and body are the same stack

Heading and body are separated by **weight and size**, not by face — quieter,
one fewer seam to manage, and `--font-heading` still exists as a token so a
future display face is one edit away.

## Why body copy is 400

Figtree's Regular is properly fitted at reading sizes — it does not render
grey, so there is no reason to invent a "Book" interpolation between the drawn
steps. The ramp is `400 / 500 / 600 / 700`, every step a weight the designer
drew; the variable axis (300–900) leaves Light and Black available for display
work without another download.

## Why code is not shipped

Indentation *is* the syntax in a code block, and a proportional face destroys
it — so code is the one surface that stays monospace. `--font-code` resolves
to the platform's own mono (SF Mono, Consolas, …) at zero bytes: the exact
trade `--font-serif` makes for quotations. A code block is a handful of
elements on the pages that have one; the label voice is hundreds of elements
on every screen. Different exposure, different answer — which is the same
argument that used to justify *shipping* the mono, inverted by the label voice
no longer needing a mono at all.

## Why no serif is shipped

Pull-quotes, drop caps and section quotations resolve to the platform's serif
(Georgia, then Iowan Old Style, then Times). A quotation still reads as a
quotation without a download. If the quoting voice should be Figtree instead,
point `--ns-font-serif` at `var(--ns-font-sans)` — one line in
`tokens/typography.css`.

## Sources and re-cutting

The four woff2s are Google Fonts' own latin / latin-ext splits of the variable
cut (v9), fetched from `fonts.gstatic.com` and committed here; `OFL.txt` comes
from [google/fonts](https://github.com/google/fonts) at `ofl/figtree/`. For a
different subset, start from `Figtree[wght].ttf` in that repo:

```sh
pyftsubset "Figtree[wght].ttf" \
  --output-file=figtree-var-latin.woff2 --flavor=woff2 \
  --layout-features='*' --no-hinting --desubroutinize \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

Keep `--layout-features='*'` — dropping it strips `tnum`, and with it every
aligned digit column in the product.

`@font-face` declarations live in `src/tokens/fonts.css`; the stacks and the
scale live in `src/tokens/typography.css`.
