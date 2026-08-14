# Fonts

Two shipped faces and one system stack. 69 KB total.

| role | face | file | axis | size |
|---|---|---|---|---|
| sans — interface **and** reading | **Switzer** | `switzer-var-latin.woff2` | `wght 100–900` | 29 KB |
| serif — the editorial voice | **Sentient** | `sentient-var-latin.woff2` | `wght 200–700` | 40 KB |
| mono — data, labels, code | *system stack* | — not shipped — | — | 0 KB |

Both are [Indian Type Foundry](https://www.indiantypefoundry.com) faces from
[Fontshare](https://www.fontshare.com), latin-subset variable woff2.

## Licence

**Fontshare Free Font EULA** — `FONTSHARE-EULA.txt`, which must travel with
these files. In short: free for personal *and* commercial use, unlimited time,
any medium (print, web, mobile, apps, broadcast), any number of devices, and
self-hosting is explicitly provided for. The fonts remain ITF's intellectual
property; you may not sell or redistribute the font software itself.

That last point is the one that matters here: this repository redistributes
the font files as part of a design system, so the EULA ships alongside them
and the attribution stays in this file.

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

## Why mono is not shipped

Monospace is structural in this system (Principle 2): every index, duration,
timestamp, status and kicker runs through it, and that split is what makes a
list read as data and a paragraph read as writing.

It is still not worth a download. Those runs are short, tracked and uppercase,
and in that shape the reader's own console face is not merely adequate — it is
more familiar to them than anything we could send. Spending ~22 KB to make
`12:40` look marginally more on-brand is not a trade this system makes.

**The consequence to know:** mono renders as SF Mono on macOS, Consolas on
Windows, and whatever the distribution sets on Linux. A mono run is therefore
*not* an identical width across platforms — never lay out against one. The
`font-variant-numeric: tabular-nums` in `tokens/base.css` is what keeps digits
in a column aligned, and that works on every one of those faces.

## Subsetting

Both files are subset to latin plus the punctuation, arrows and symbols the UI
actually draws. To re-cut with wider coverage:

```sh
pyftsubset Switzer-Variable.woff2 \
  --output-file=switzer-var-latin.woff2 --flavor=woff2 \
  --layout-features='*' --no-hinting --desubroutinize \
  --unicodes="U+0000-00FF,U+0131,U+0152-0153,U+02BB-02BC,U+02C6,U+02DA,U+02DC,U+0304,U+0308,U+0329,U+2000-206F,U+2074,U+20AC,U+2122,U+2191,U+2193,U+2212,U+2215,U+FEFF,U+FFFD"
```

Source files come from the "Download family" zip on each Fontshare page; the
variable cut is at `<Family>_Complete/Fonts/WEB/fonts/<Family>-Variable.woff2`.

`@font-face` declarations live in `tokens/fonts.css`; the stacks and the scale
live in `tokens/typography.css`.
