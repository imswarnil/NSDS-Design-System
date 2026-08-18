# Fonts

Two shipped faces. 67 KB total.

| role | face | file | axis | size |
|---|---|---|---|---|
| sans — interface, reading **and** quotations | **Switzer** | `switzer-var-latin.woff2` | `wght 100–900` | 29 KB |
| mono — data, labels, code | **Roboto Mono** | `roboto-mono-var-latin.woff2` | `wght 100–700` | 37 KB |
| serif — quotations | *platform serif* | — not shipped — | — | 0 KB |

Switzer is an [Indian Type Foundry](https://www.indiantypefoundry.com) face
from [Fontshare](https://www.fontshare.com); Roboto Mono is the Roboto Mono
Project Authors', under the SIL Open Font Licence 1.1 (`licences/`). Both are
latin-subset variable woff2, self-hosted — nothing is fetched from a
third-party CDN at run time.

## Licence

**Fontshare Free Font EULA** — `FONTSHARE-EULA.txt`, which must travel with
Switzer. In short: free for personal *and* commercial use,
unlimited time, any medium (print, web, mobile, apps, broadcast), any number of
devices, and self-hosting is explicitly provided for. The fonts remain ITF's
intellectual property; you may not sell or redistribute the font software
itself.

**SIL Open Font Licence 1.1** — `licences/roboto-mono-OFL.txt`, which must
travel with Roboto Mono on the same terms: use and self-host freely, including
commercially, but ship the licence with the file.

That last point is the one that matters here: this repository redistributes
font files as part of a design system, so both licences ship alongside them and
the attribution stays in this file.

## Why one sans, not a display/text pair

The previous family ran two cuts — one to speak, one to explain — and the seam
between them had to be managed at every size: two sets of metrics, two
optical weights that meant different things, and a heading that never quite
sat on the same rhythm as the paragraph under it.

Switzer covers the whole range on its own. Heading and body are separated by
**weight and size**, not by face, which is quieter, one fewer download, and
removes an entire class of "why does this heading look wrong at 20px" bug.

`--font-heading` still exists as a token name — components reference it, and a
future display face is one token away — it simply resolves to the same stack.

## Why body copy is 400

The previous family was a Nunito-derived cut whose true Regular rendered
*grey* rather than black at reading sizes, so this system set body copy at
**450 ("Book")** — one interpolation step up the `wght` axis, invented
specifically to fix that face's problem.

Switzer does not have that problem. Its Regular is properly fitted, and
carrying 450 across would have been cargo: half a step heavier than the
designer drew, justified by a reason nobody could still state.

Switzer also has a real **500**, which the old family lacked. So the ramp is
`400 / 500 / 600 / 700` and every step is a weight that was actually drawn —
no interpolations of our own choosing.

## Why no serif is shipped

The editorial register — pull-quotes, drop caps, section quotations — used to
run on **Sentient**, a 40 KB serif carrying perhaps four elements on a page.
It has been retired. `--font-serif` now resolves to the platform's own serif
(Georgia, then Iowan Old Style, then Times), so a quotation still reads as a
quotation without a download, and the system ships exactly two faces.

The asymmetry with mono below is deliberate and worth being explicit about:
mono is *structural* and appears hundreds of times on every screen, so leaving
it to the reader's machine meant leaving the most-repeated voice in the product
to chance. A blockquote is a handful of elements on a handful of pages, and
Georgia is a perfectly good serif. Different exposure, different answer.

If the quoting voice should be Switzer rather than a serif, point
`--ns-font-serif` at `var(--ns-font-sans)` — one line in
`tokens/typography.css`, no component changes.

## Why mono is shipped

Monospace is structural in this system (Principle 2): every index, duration,
timestamp, status, tag and kicker runs through it, and that split is what makes
a list read as data and a paragraph read as writing.

Which means it is the face the reader sees **most** — far more often than a
code block. Borrowing it from the OS made the most-repeated voice in the
interface SF Mono on a Mac, Consolas on Windows and a lottery on Linux: three
different products, none of them chosen, and each drawn for 13px code rather
than for the 11px tracked uppercase this system actually sets.

**Roboto Mono** is what it runs on: plain, wide-set and unmannered, with none
of the personality a coding face carries — which is the point, because this is
a face doing structural work behind `01`, `21:15` and `// Getting started`
several hundred times a page, not a face anyone is meant to admire. It is also
the mono most readers have already seen ten thousand times, so it disappears.
37 KB — the one download here that earns itself on every screen rather than
only on the pages with code.

The old consequence — that a mono run is a different width on every platform,
so nothing may be laid out against one — no longer applies: the face is the
same everywhere now. The `font-variant-numeric: tabular-nums` in
`tokens/base.css` still keeps digit columns aligned.

## Subsetting

Both files are subset to latin plus the punctuation, arrows and symbols the UI
actually draws. To re-cut with wider coverage:

```sh
pyftsubset Switzer-Variable.woff2 \
  --output-file=switzer-var-latin.woff2 --flavor=woff2 \
  --layout-features='*' --no-hinting --desubroutinize \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

Switzer's source comes from the "Download family" zip on its Fontshare page —
the variable cut is at `Switzer_Complete/Fonts/WEB/fonts/Switzer-Variable.woff2`.
Roboto Mono's is `ofl/robotomono/RobotoMono[wght].ttf` in
[google/fonts](https://github.com/google/fonts), which is also where `OFL.txt`
came from.

`@font-face` declarations live in `tokens/fonts.css`; the stacks and the scale
live in `tokens/typography.css`.
