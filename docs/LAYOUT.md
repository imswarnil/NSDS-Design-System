# Layout: section → container → stack

Every page in this system is the same three nested things. Getting them
consistent is the difference between a design system and a folder of CSS.

```
SECTION      .ns-band            full-bleed. Owns the ground and the
                                 vertical padding between page sections.
  CONTAINER  .ns-band__inner     owns the max width and the gutters.
    STACK    .ns-stack           owns the rhythm BETWEEN the elements
                                 inside. This is the level that was missing.
```

The rule: **a level never does another level's job.** A band does not set a
width. A container does not set a background. An element inside does not set
its own top margin — its parent's stack does.

---

## The three levels

### 1. Section — `.ns-band`

```html
<section class="ns-band ns-band--sunken">…</section>
```

Owns the **ground** and the **outer rhythm**. `padding-block: var(--stack-lg)`
— the semantic step named "between page sections", not a raw `--space-N`.

| Modifier | Effect |
| --- | --- |
| `--sunken` | alternate ground, so consecutive sections read as separate |
| `--tight` | a thinner band |
| `--dark` | the navy console surface (clips with `overflow: clip`) |
| `--grid` | the dissolving hairline motif |

### 2. Container — `.ns-band__inner`

```html
<div class="ns-band__inner">…</div>
```

Owns the **measure** and the **gutters**: `max-inline-size: var(--container-page)`,
`margin-inline: auto`, `padding-inline: var(--gutter)`.

Never put a page width on the band itself — a band is full-bleed by
definition, and a width on it means the ground stops where the text stops.

| Token | Width | For |
| --- | --- | --- |
| `--container-page` | widest | grids, dashboards, full sections |
| `--container-narrow` | medium | a band head, a centred intro |
| `--container-prose` | 42rem | anything read continuously |

### 3. Stack — `.ns-stack`

```html
<div class="ns-stack ns-stack--md">
  <h2>…</h2>
  <p>…</p>
  <div class="ns-grid">…</div>
</div>
```

Owns the rhythm **between siblings**. One rule — `> * + *` — so the first
child never carries a stray top margin and the spacing cannot double up
against a section's own padding.

| Class | Step | Between |
| --- | --- | --- |
| `.ns-stack--xs` | `--stack-xs` (8) | tight rows, form fields |
| `.ns-stack` | `--stack-sm` (16) | default: paragraphs, list blocks |
| `.ns-stack--md` | `--stack-md` (32) | subsections inside one band |
| `.ns-stack--lg` | `--stack-lg` (64) | between page sections |

### And across — `.ns-cluster`

The horizontal counterpart: things in a row that wrap, with one gap in both
axes.

```html
<div class="ns-cluster">
  <a class="ns-btn ns-btn--primary">Start</a>
  <a class="ns-btn">Browse</a>
</div>
```

| Class | Gap | For |
| --- | --- | --- |
| `.ns-cluster--xs` | `--space-1-5` (6) | icon runs, dense chips |
| `.ns-cluster` | `--gap-inline` (8) | default: buttons, tags |
| `.ns-cluster--md` | `--space-4` (16) | a row of controls with labels |
| `.ns-cluster--lg` | `--space-6` (24) | two blocks side by side |

`--baseline` aligns text of two sizes on one line. `.ns-cluster__end` pushes
everything after it to the far edge; `.ns-cluster__fill` takes the leftover
width but stops wrapping before it is too narrow to read.

### The container with no band — `.ns-center`

For things that are *not* inside a band: a bare page, a demo, an email body.
One element, deliberately — a band is two because its ground is full-bleed,
and a wrapper has no ground.

`--narrow` / `--prose` / `--compact` set the measure; `--gutter` adds the side
padding; `--pad` / `--pad-t` / `--pad-b` add the block padding a band would
otherwise have spent; `--flush` keeps the left edge instead of centring.

### The reset that is not a decision — `.ns-bare`

Strips the user-agent margin, padding, border and marker from a `fieldset`,
`ul`, `ol` or `dd`. It is a reset, not a layout choice, and keeping the two
apart is the point: put `.ns-bare` on the semantic element, then put the real
layout on the same node with a stack or a cluster.

---

## Why this needed a plan

An audit of `templates/` found **174 inline `style=` attributes**, of which
**133 were layout**. The single most common declaration was
`margin-block-start` — **44 of them**, across eight different values.

That is the third level being hand-written every time, and it is how a system
drifts: eight spacings where the scale has four, none of them reviewable,
none of them changeable from one place.

The primitive already existed. `.ns-stack` was defined in
`src/css/foundation/a11y.css` — a layout utility filed under accessibility —
with no documentation page and no demo, marked `used-by: ghost-theme, lms`.
It was invisible, so nobody used it, so everyone wrote the margin by hand.

**Unused and undiscoverable are the same bug.**

---

## The plan

1. **Give the primitives a home.** New `src/css/foundation/layout.css`.
   `.ns-stack` moves out of `a11y.css`; `.ns-cluster` and `.ns-center` join it.
2. **Complete the scale.** An explicit `.ns-stack--sm` so all four steps are
   nameable, not three plus an unnamed default.
3. **Document it.** This file, plus a styleguide page so the primitives are
   discoverable where people actually look.
4. **Convert the templates.** Replace inline layout declarations with the
   primitives, starting with the four worst files.
5. **Gate it.** `scripts/check-layout.mjs` fails on raw layout properties in a
   `style=` attribute in `templates/`. Data attributes (`--v`, `--x`, chart
   values) and genuine one-offs stay legal — with a comment saying why.

Step 5 is the one that matters. Without it this is a tidy-up that decays; with
it, the next hand-written margin fails the build the way a raw colour already
does.

## What shipped

All five steps are done. `check-layout.mjs` is the ninth gate in
`npm run check`, and it reports **61 templates, no inline layout declarations**
— down from 133.

The conversion was not a find-and-replace. Roughly half the inline
declarations turned out to be a **missing class**, and each one was written
where the level that owns it lives:

| Was inline, in N templates | Became | Lives in |
| --- | --- | --- |
| `list-style:none;margin:0;padding:0` on a `ul`/`fieldset`/`dd` | `.ns-bare` | `foundation/layout.css` |
| `display:flex;gap:…;flex-wrap:wrap` | `.ns-cluster` and its steps | `foundation/layout.css` |
| `flex:1;min-inline-size:16rem` | `.ns-cluster__fill` | `foundation/layout.css` |
| `max-inline-size:32rem;margin-inline:auto` on a signup | `.ns-center--compact` | `foundation/layout.css` |
| `padding-block:var(--stack-lg)` on a page shell | `.ns-page--pad` | `foundation/a11y.css` |
| `grid-template-columns:repeat(auto-fill,minmax(13rem,1fr))` | `.ns-grid--xs`, `.ns-grid--fit` | `foundation/a11y.css` |
| a band inside an already-guttered column | `.ns-band--nested` | `content/sections.css` |
| a second container in one band | `.ns-band__inner--continued` | `content/sections.css` |
| `margin-block-start:var(--space-2)` on a form's submit | `.ns-field .ns-btn--block` | `foundation/a11y.css` |
| `margin-block-end` on a series card, in every post template | `.ns-series` itself | `content/blog.css` |
| the blog rail's three hand-rolled widgets | `.ns-widget` — **it already existed** | `content/blog.css` |

That last row is the finding, not a footnote. `blog.css` had already built
`.ns-widget` *specifically* to replace `.ns-toc__title` plus an inline
`padding-inline: 0`, and its own comment predicted the failure: *"three
widgets, three copies of the same override, and a fourth author would have
written a fourth."* Two templates and one doc entry had gone on hand-rolling
it anyway. A component nobody can find is a component nobody uses.

### Three bugs the pass turned up

None of these were caused by the conversion; all three were found by
measuring what the conversion was supposed to preserve.

1. **`.ns-prose h2` set a 96px top margin even as the first child.** A tab
   panel or a card that opened on a heading opened 96px down from its own top
   edge. Fixed with `.ns-prose > :is(h2, h3, h4):first-child` — the guarantee
   `.ns-stack` gives with `> * + *`, restated for the one rule in that file
   that could not be written that way.
2. **The course rail shrank its own cards.** `.ns-course-detail__rail` is
   capped to the viewport with `overflow-y: auto`, but its flex children kept
   the default `flex-shrink: 1`, so each card gave up height to fit the cap
   instead of the rail scrolling — the certificate badge was cut in half.
   Fixed with `.ns-course-detail__rail > * { flex: none; }`. A shrunk flex
   item is not an overflow anyone warns about, which is why it survived.
3. **The blog rail set spacing the widgets also set.** `.ns-blog-listing__rail`
   carried its own `gap`, and `.ns-widget + .ns-widget` carried a margin and a
   rule — two answers to one question, and which one applied depended on which
   template you were in. The rail is now sticky and nothing else.

### The one argued-for exception

`templates/blog-post-ads.html` keeps `style="display:block"` on the
`<ins class="adsbygoogle">`, with a `layout-ok` comment: AdSense's own script
reads that property off the element to decide the unit is responsive.

`.ns-ad` is the one component permitted to set its own block margin, and the
reasoning is written into `integrations/ads.css` rather than assumed: an ad
slot is dropped into a host the page did not plan for, and the hosts that
forget to space it are the ones where an advertisement ends up touching a
paragraph.

---

## What stays legal in `style=`

The gate allows what is genuinely per-instance data rather than layout:

- **Chart and effect values** — `--v`, `--x`, `--y`, `--seg`, `--_i`, `--_w`.
  These are the datum, and a class per value is 100 classes.
- **`--ns-marquee-speed`** and similar per-instance tuning of a documented
  custom property.
- Anything with `/* layout-ok: reason */` immediately before it in the
  markup, so an exception is argued for in the diff rather than assumed.
