# Changelog

Notable changes to NS Design System. The version here is the **design system's**, not
the Ghost theme's — they are released independently.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versioning is
semver, with one design-system-specific reading of it:

- **major** — a token is removed or renamed, a class name changes, or a visual
  default changes enough to move layout in a consuming product.
- **minor** — new tokens, new components, new variants. Additive only.
- **patch** — a fix that does not change the rendered result in any product
  that was already correct.

A color *value* changing is a **major** even though nothing breaks at build
time: every screen in both products moves.

## [Unreleased]

### Changed — BREAKING: one face. Figtree, self-hosted, and nothing else shipped

The system shipped two fonts — Switzer for words, Roboto Mono for data — and
now ships **one**: Figtree (Erik Kennedy, SIL OFL), a variable 300–900 in four
woff2s (~62 KB: normal + italic, latin + latin-ext, loaded on demand via
`unicode-range`). The insight is that the label voice was never really
"monospace" — it was **uppercase, tracked, bold, small and tabular**, and the
family was merely the loudest of those five signals. The data voice is now a
recipe any face can wear, applied by the same classes as before.

- `--font-sans` / `--font-heading` / `--font-mono` all resolve to Figtree.
  `--font-mono` **survives as a name** so the 300+ "this is data" call sites
  did not change — and the voice can be re-pointed at a real mono in one line.
- **New `--font-code`** — `pre`, `code`, `samp` and `.ns-code` resolve to the
  platform's own mono at zero bytes (indentation *is* the syntax there), the
  exact trade `--font-serif` already made for quotations.
- **Tabular figures became opt-in, and the system opts in.** Roboto Mono
  aligned digit columns for free; Figtree's default figures are proportional.
  `tokens/base.css`, `.ns-label` and `.ns-record` apply `tnum` (verified
  present in the shipped file — resubset with `--layout-features='*'` or
  every digit column in the product un-aligns).
- `--measure-prose` recomputed **68ch → 62ch**: Figtree's "0" advances
  0.638em against Switzer's 0.576, and the measure is arithmetic, not taste
  (672px / (0.638 × 17px)). The comment in `tokens/layout.css` now shows the
  formula because this number had already gone stale twice.
- The weight ramp (400/500/600/700) fits inside Figtree's drawn range; the
  type specimen now shows the real 300–900 axis instead of a 200 and an 800
  the ramp never used.
- Switzer, Roboto Mono and the Fontshare EULA are removed; `fonts/README.md`
  rewritten around the one-face argument.

### Fixed — two components wearing one class name, and a gate so it stays fixed

`check-markup.mjs` now fails when the same block-level class is **defined in
two files** — two components, one name, and whichever file loads later
silently restyles the other. It found (and this release fixes):

- **`.ns-compare` was two components.** An article comparison block
  (`content.css`) and the marketing before/after band (`sections.css`).
  sections.css loads later, so every article's Flow-vs-Apex table was
  rendering on the band's three-column before/seam/after grid. The band is
  now **`.ns-delta`**; the article block keeps the name.
- **`.ns-file` was two components.** An admin upload row (`admin.css`) and
  Ghost's reader-facing download card (`ghost.css`), whose card padding was
  restyling every upload row. The upload row is now **`.ns-upload`**.
- Both components also shared a styleguide id, so one doc page silently
  overwrote the other — `c-compare.html` was whichever was rendered last.

### Changed — the homepage argues once per question

- The two adjacent author bands — "About the author" (the story) and "Who
  wrote it" (the profile cards) — **merged into one**: the story is the
  credential, the cards close it. The story's stat strip duplicated the
  cards' fields (24,100 learners and 11 years each appeared twice on one
  screen); the cards keep the numbers.
- **Ground rhythm restored**: strict sunken/plain alternation. Three sunken
  bands in a row stack their borders; two plain bands in a row get no
  separation at all — `--sunken` exists precisely to alternate.
- **`.ns-plans` (the price table) moved** from `integrations/ghost.css` to
  `content/sections.css`: a pricing band is a marketing section both products
  render; Ghost only populates it. Same wrong-drawer bug `.ns-stack` had.

### Fixed

- `docs/CHANGELOG.md` carried a second `## [Unreleased]` heading stranded
  between 3.0.0 and 2.3.0 — entries that shipped in 3.0.0 but were never
  folded in when it was cut.


### Added — the layout contract, and a gate that keeps it

Three nested levels, one rule: **a level never does another level's job.** A
`.ns-band` owns the ground and the space between sections, a
`.ns-band__inner` owns the width and the gutters, a `.ns-stack` owns the
rhythm between the children. An element does not set its own top margin.

New `src/css/foundation/layout.css` is the primitives' home. `.ns-stack`
**moved out of `foundation/a11y.css`** — it was a layout utility filed under
accessibility, with no doc page and no demo, which is why nothing used it and
every template hand-wrote the margin instead. Joining it: `.ns-cluster` (the
horizontal counterpart, with `__end` and `__fill`), `.ns-center` (the
container level for anything not inside a band) and `.ns-bare` (the
user-agent box removed — a reset, kept separate from layout on purpose).

`scripts/check-layout.mjs` is a new gate. It fails on a margin, padding, gap
or `display` inside a `style=` attribute in `templates/`. Per-instance data
(`--v`, `--x`, `--seg`) stays legal, as does anything carrying
`<!-- layout-ok: reason -->`. **133 → 0** across 61 templates.

Roughly half of those 133 were a missing class rather than a stray margin, so
each became one: `.ns-bare`, `.ns-cluster__fill`, `.ns-center--compact` /
`--flush`, `.ns-page--pad`, `.ns-grid--xs` / `--fit`, `.ns-band--nested`,
`.ns-band__inner--continued`, `.ns-card__body--center`, `.ns-record`,
`.ns-certbadge--lg`, `.ns-profile__avatar--xl`, `.ns-sponsor--full`,
`.ns-deck__overview-head--flush`, `.ns-deck__help-close`,
`.ns-pagehead__kicker--section`, and a `.ns-field .ns-btn--block` rule that
four templates had been writing inline.

The blog rail's three widgets were the finding: `.ns-widget` **already
existed**, built for exactly that job, and two templates plus a doc entry had
gone on hand-rolling it out of `.ns-toc__title` and an inline
`padding-inline: 0`. A component nobody can find is a component nobody uses.

`docs/LAYOUT.md` is the guide. The styleguide's **Layout & elevation** page is
the live demo — the four stack steps are drawn by the real classes, so a
picture of the scale cannot disagree with the scale.

### Fixed — three spacing bugs the conversion surfaced

- **`.ns-prose h2` set a 96px top margin even as the first child**, so a tab
  panel or card that opened on a heading opened 96px down from its own top
  edge. `.ns-prose > :is(h2, h3, h4):first-child` now zeroes it — the same
  guarantee `.ns-stack` gives with `> * + *`.
- **`.ns-course-detail__rail` shrank its own cards.** The rail is capped to
  the viewport with `overflow-y: auto`, but its flex children kept the default
  `flex-shrink: 1`, so each card gave up height to fit the cap instead of the
  rail scrolling — the certificate badge was cut in half. A shrunk flex item
  is not an overflow anyone warns about, which is how it survived.
- **`.ns-blog-listing__rail` set spacing its widgets also set** — a `gap` on
  the rail and a margin-plus-rule on `.ns-widget + .ns-widget`, so which one
  applied depended on the template. The rail is now sticky and nothing else.

### Changed — spacing normalised to the scale

Where an ad-hoc value was replaced by the nearest scale step, the pixels
moved: `--space-10` (40) and `--space-12` (48) between subsections became
`--stack-md` (32), and a `--space-8` (32) cluster gap became `--space-6` (24).
That is the normalisation, not a side effect of it — eight spacings where the
scale has four is the thing being fixed.


### Added — an icon pipeline: `src/icons/<style>/<name>.svg`

**Adding an icon is dropping a file in a folder.** That is the entire point.
Before this, the twenty bespoke glyphs lived inside one hand-maintained
sprite, so adding one meant editing a 300-line XML document by hand and
hoping the viewBox and stroke width matched its neighbours — which is why
nobody did, and the last person who needed a glyph drew it somewhere else.

`scripts/build-icons.mjs` reads the tree and writes `icons/nsds-icons.svg`
plus `icons/icons.json`. It runs in `gulp build` and `--check` is a gate, so
editing a drawing without rebuilding fails rather than silently rendering the
old one.

**Three styles, one name.** A style is a directory — `regular` (1.7px
stroke), `fill` (the active state of the same icon), `duotone` (a solid shape
at low opacity under a stroke pass). The same file name in two directories is
the same icon, and **every icon must exist in `regular`**: a `fill/corse.svg`
is a typo, not a new icon, and the build refuses it rather than shipping a
glyph nothing can fall back to. Verified by planting one.

Five `fill` and five `duotone` variants are drawn, so the multi-style claim is
exercised rather than asserted by empty folders.

**Duotone uses `currentColor` for both passes**, with the tint in the drawing
rather than the CSS — the right ratio differs per icon, because a large solid
area needs less tint than a thin one to read at the same weight.
`.ns-icon--duotone-strong` lifts the lot where 0.22 disappears.

### Added — icon search that matches what people type

The grid at `/preview/icons.html` now searches descriptions and synonyms, not
just names.

This started as a bug in my own copy: the lede claimed "award finds the
certificate", and it did not — the drawing's description is "the completion
rosette", written by whoever drew it, and the person searching types the word
they arrived with. So the source header takes a `keywords:` line, all twenty
icons have one, and `award`, `automation`, `teacher`, `percent` and `deploy`
now each land on the right glyph. Verified in the browser.

### Note — no icon font, and why

An `<svg><use>` is a real image: it takes `currentColor`, carries two colours
for duotone, never renders as a missing-glyph box while a webfont loads, and
is ignored by a screen reader unless labelled. An icon font is glyphs in a
text stream — convenient, and it inherits every font-loading failure mode and
reads as a private-use character to anything that does not know better.

The system still ships one font: a Phosphor subset, because cutting somebody
else's 700KB face down to the ~300 glyphs used here is worth a build step. For
our twenty, a 6KB sprite is smaller than any font we could build.

If that trade changes, `src/icons/<style>/` is already the shape every font
builder wants — `fantasticon` and `svgtofont` both take a directory of SVGs.
It would be a devDependency and a script, and none of the drawings would move.
`docs/ICONS.md` records that.

### Fixed — the templates were unfindable

31 full-page templates existed and were reachable only from a **Demos
dropdown** in the homepage's nav bar, which is not where anybody looks for a
template. They are now a card shelf under their own heading, above the page
index, with the one-line note from each demo entry as the description.

A menu is where you put things people already know exist.

### Added — site-wide search

A command palette over a generated `preview/search.json`: 237 rows covering
every styleguide page, every full-page template, and every documented
component **including the class names it defines** — because "where is
`.ns-btn--ghost`" is the question people actually arrive with, and a
title-only index cannot answer it.

`/` or `⌘K` from anywhere; the trigger sits in the homepage bar and in the
styleguide rail. It is a real `<dialog>`, so the backdrop, Escape, focus
trapping and inertness of the page behind all come from the platform.

**No dependency and no index format.** A few hundred rows filtered with
`includes` is instant at this size, and a design system shipping a search
bundle larger than its own stylesheet would have lost the plot.

Two things it deliberately does:

- **The trigger is created by script**, not written into the markup, so a
  page with JS off never shows a search control that cannot run.
- **A failed fetch says so.** An empty list there would read as "no results",
  which is a different and much more confusing statement.

The rail keeps its own "Filter pages" input alongside. They are different
tools: the palette searches everything, the filter narrows *this rail*, needs
no fetch, and is faster when you already know roughly where you are going.

Ranking is four rules and stops there, but one of them earns its place: a
**whole-word** keyword match beats a substring. Without it, searching "links"
tied the Link page template with four navigation components whose class names
contain `__links`, and array order decided — so the page somebody typing
"links" actually wants came fifth.

### Note — the chart widgets were already there

Checked rather than assumed, since the question was whether the common
dashboard widgets exist. They do: sparkline stat tiles (six on the LMS chart
page), donut with a centre figure, rings, progress, heatmap, funnel,
horizontal bar rows, stacked and grouped bars, plus the scatter, waterfall,
bullet and slope added in the last change.

The one common widget deliberately **absent** is a gauge, and the bullet
chart's own documentation says why: a needle at an angle is hard to compare
between rows, and a dial spends most of its pixels on the part of the range
nobody is in. Adding one now would contradict an argument this system already
makes in writing.

### Added — four chart types the bar and the line cannot cover

`chart-more` documents them, and the admin dashboard now uses three:

- **Scatter / bubble** — the only chart here about a *relationship* rather
  than an amount, and the only one where the reader looks at the shape of
  the cloud rather than any single mark. Dots are semi-transparent so
  overlap reads as density instead of hiding records.
- **Waterfall** — how a total got from one number to another. Every bar is a
  delta except the first and last, which are totals on the baseline; a
  waterfall drawn with every bar from zero is a bar chart that has lost its
  argument. Up and down take the status hues, because direction is the
  meaning here rather than a category.
- **Bullet** — actual against target, in a row. It replaces a gauge in a
  fraction of the space and without a gauge's two problems: a needle at an
  angle is hard to compare between rows, and a dial spends most of its
  pixels on the part of the range nobody is in. The target is a rule in ink,
  not a hue — it is a threshold, not a series.
- **Slope** — what changed between two moments. It beats a grouped bar
  because crossing lines make a *reordering* visible, which is usually the
  finding.

### Fixed — an append that landed inside a `@keyframes`

Worth recording because the failure was invisible. `chart.css` ends with its
keyframes **outside** the `@layer` block, and the last one is a one-liner —
so "strip the file's final brace and append inside the layer" put the four
new chart types *inside* `@keyframes ns-chart-arc`, and closed the keyframe
at the end.

Brace count stayed balanced, `lint-principles` passed, `check-cascade`
passed, and `grep` found every new selector in `dist/`. The only thing that
caught it was reading `position` back off a rendered element and getting
`static`. It had also silently broken the donut's arc animation.

New CSS now goes in *before* the layer's closing brace rather than by
stripping the last one in the file.

### Added — three light templates

Small, self-contained pages anyone can preview and lift:

- **`personal-site.html`** — a one-page personal site, and the interesting
  thing about it is that it needed **zero new classes**. It is the product
  homepage's own bands with one person as the subject, which is the argument
  for the band grammar made in one file.
- **`docs.html`** — nav | article | outline. The one shape that genuinely
  wants navigation on *both* sides of the text, and the exception that proves
  the rule `blog-post.html` follows: a post gets one rail because a reader
  arrives to READ, a docs page gets two because they arrive to FIND, and the
  rails answer different questions. It is its own grid rather than a
  `.ns-post` modifier, because reusing a layout whose leading rail is 3.5rem
  of icon buttons for a 15rem section tree would have been a modifier that
  overrides two of three columns.
- **`links.html`** — the one-link-in-a-bio page. `.ns-linkpage` is the only
  layout in the system that does not widen on a desktop: it is built for a
  thumb arriving from a phone, and a 60rem column of buttons on a laptop
  looks like a settings screen. Exactly one row carries the brand fill —
  two filled rows is a page with no first choice.

The measure is 672px on the docs page, same as every other reading surface.

### Changed — the admin dashboard has charts

It was 98 lines of stat tiles and draft rows. The tiles say *what* a number
is; the four charts added say how it got there, whether it is on target, and
what changed.

### Removed — 696 KB of YouTube channel art from the npm package

`assets/social/youtube/` is banner and avatar PNGs used only by the
brand-content cards, which are not in the package at all — so every consumer
was downloading them for nothing. Excluded via a `!` pattern in `files`.
2.6 MB → 2.0 MB packed. Stray `.DS_Store` files deleted.

### Changed — the component layer is grouped into folders

34 flat stylesheets became six folders: `foundation/` (a11y, icon, motion,
type-fx), `primitives/` (button, form, display, media, feedback, progress,
overlay, table, code), `navigation/`, `content/` (prose, content, sections,
blog), `product/` (lms, training, catalog, player, deck, ai, admin,
helpdesk, auth, chart) and `integrations/` (ghost, ads, monetization).

**The output is byte-identical.** `dist/nsds.css` diffed clean against
the pre-move build, which is the only proof that matters for a refactor whose
entire promise is that it changes nothing.

The `@import` order in `index.css` is preserved exactly, because inside one
cascade layer source order decides ties.

**What did NOT move, and why.** `.ns-btn` appears in seven files, but only
`primitives/button.css` styles the button; the rest are contextual rules like
`.ns-topnav__actions .ns-btn`. Those stay with their container. A component
owns its own file; a container owns how a component looks *inside* it —
pulling them into a button folder would make the button know about the
navbar, the player, the deck and the LMS, which is worse than a grep. The
problem this solves was discoverability, not scattering.

Keyframes also stay together in `foundation/motion.css`: a keyframe name is
global and unlayered, and one file with one prefix is what stands between
this system and a silent collision with a consuming app's own `float`.

### Added — `scripts/lib/css-files.mjs`, and the failure it guards

Six scripts read `components/css`, and four did a flat `readdirSync` that
returns **nothing** once files move down a level — no error, no warning, just
a linter that checks zero files and reports success. So the shared walker
throws when the walk comes back empty: a checker that finds no input has to
be loud, or a green build starts meaning "nothing was examined".

`check-cascade.mjs` caught the move for real. Its `!important` allowlist was
keyed on `components/css/a11y.css`, and the moment that became
`foundation/a11y.css` the entries stopped matching — which did not report a
stale allowlist, it reported two brand-new cascade violations in a file
nobody had touched. It matches on the basename now.

### Added — an MCP server, with no dependencies

`mcp/server.mjs`, exposed as `npx nsds-mcp`. Six tools: `list_components`,
`get_component`, `search_classes`, `list_tokens`, `get_guide`, `get_setup` —
so an agent building in another repo can ask what exists instead of guessing
at class names.

It speaks JSON-RPC over stdio directly rather than importing an SDK. A
package whose job is to ship CSS should not make every consumer install a
transport and its transitive tree to read its own component list; `npm
install nsds-design-system` stays a zero-runtime-dependency install.

Everything is read from the real artifacts — components from the `COMPONENTS`
array the styleguide renders from, tokens from the generated `tokens.json`,
classes by walking the component layer — so a rename reaches the server in
the commit that made it. `search_classes` reports the folder each class lives
in, which is the question the reorganisation above exists to answer.

### Changed — published as `nsds-design-system`

Renamed from `@namaste-salesforce/design-system`, so the install line is
`npm install nsds-design-system`. The package now also ships `mcp/` and the
agent skill in `.claude/`.

Verified end to end rather than assumed: `npm pack`, install the tarball into
a clean project, then confirm the tokens import, the CSS subpath resolves,
the skill is present, and `./node_modules/.bin/nsds-mcp` answers a
`tools/call`. 2.5 MB packed.

### Added — `docs/GETTING-STARTED.md`

The consumer guide: install, take one stylesheet, compose with bands, the two
rules that make work look like it belongs (the scanned-versus-read type fork,
and mono-is-for-values), then how to hand the job to an agent via either the
skill or the MCP server. Ends with what not to do — chiefly, do not
re-implement the look from the class list.

### Added — a header-style switcher on both post templates

A segmented control that swaps the modifier on `.ns-posthead`, so all five
header variants can be compared on real content instead of five screenshots
that go stale separately. The parts stay in the same order in every variant
(category, title, standfirst, meta, cover), which is the thing worth seeing.

**It is a preview affordance, not a feature**, and it is built to be
deleted: an `@strip:preview` region carrying its own inline script, so
removing it is one cut that leaves nothing dangling. A real post picks one
header and hard-codes it — a page that lets a reader restyle its own
masthead is a page with no art direction.

The first version bound to `document.querySelector(".ns-posthead")` at load,
and the control sits directly *above* the header it drives, so the parser had
not reached it yet: it silently bound to null and did nothing. It resolves
the header on change instead, which also survives a framework replacing the
header after hydration. Caught by driving all five radios and reading the
class back, not by looking at it.

### Added — `.ns-widget__item`, the browsing list

A link row with a thumbnail, for related posts, videos and lessons. The
thumb draws the same glyph ground the video shelf and card covers use, so a
rail with no artwork yet still looks built; add a play badge and a runtime
and the same item is a video.

It exists beside `.ns-blog-archive` rather than replacing it because the two
are opposite arrangements: the archive is a DATED list where the date is the
scanning key and a thumbnail would push it out; this is a browsing list where
the picture is the key and the date is a footnote. A rail can carry one of
each without reading as the same widget twice.

5.5rem of thumbnail is the constraint — wide enough for a legible 16:9 crop,
narrow enough that two lines of title still fit beside it at 18rem. That is
why it is not `.ns-bcard--row`, whose 12rem of media would leave about four
characters a line here.

### Added — ad placements across the post

One in-article unit per page, below the fold, after the reader has had
something: `--article` is hairlines top and bottom with no fill and no
radius — the grammar of an interruption rather than an inclusion, so it
cannot be mistaken for a pull-quote the writer endorsed.

The rail takes a `--halfpage`, not a skyscraper: at 18rem a 160×600 leaves a
column of dead margin either side. Both reserve their height, so nothing
below them shifts when a fill lands.

### Changed — two post templates, not three

`blog-post-wide.html` is gone. It was a template, a demo and a doc entry
standing for one CSS modifier, and "with a sidebar or without one" is a
distinction a reader can hold where "rails, sidebar, or neither" is not.
`.ns-post--wide` still exists for a page that wants the measure and nothing
beside it; it did not need a page of its own to say so.

### Changed — share on the leading edge, the outline on the trailing one

`.ns-post` is now `share rail | article | TOC rail`. The two rails do
opposite jobs: the outline is about *this* page and belongs beside the text
it indexes, on the side the eye returns to after a line; the share rail is
about what you do with the page afterwards and belongs out of the reading
path. The share rail is also the narrower of the two, so putting it first
keeps the gap between the page edge and the text small.

**The DOM follows the visual order** — aside, article, nav — rather than
being reordered with grid placement. A share rail drawn on the leading edge
but written last hands a keyboard user a focus order that jumps across the
page and back; four labelled buttons ahead of the article is the smaller
cost. Verified: DOM order and left-to-right position agree.

### Changed — the post hero, and what belongs in a sidebar

Both templates carry a real 16:9 hero slot. It holds `.ns-ph` with a label
until there is an image, which is right *here* even though it is wrong on a
card cover: a post hero is a photograph or an illustration somebody has to
make, and the slot should look unfinished until they do.

**The author is out of the sidebar.** A bio in the rail and a bio under the
article is the same block twice, and the one under the article is the one
that belongs — a reader wants to know who wrote it after reading it, not
while deciding whether to. The rail is for what to do next, ordered by how
much each thing asks: related reading, then courses, then the training CTA,
then the newsletter, then categories, with the paid slot last.

`.ns-widget__facts` was added for the two checkable lines under the training
widget's paragraph.

The series box moved from the rail to above the article, where a reader
landing on part 2 from search needs it — telling them after they have read
it is telling them too late.

### Fixed — a name set as a serial number, and a doubled hairline

`.ns-postmeta` set the whole line in tracked uppercase monospace, including
the author's **name**. A date, a reading time and a word count are values
and belong in that voice; a person's name is not one, and beside them it
read exactly like a serial number. The container keeps the value voice and
`.ns-postmeta__author` opts out — one line, two registers, each half set as
what it is. Same defect already pulled out of `.ns-quote`'s attribution, the
CTA fine print and the stat labels.

`.ns-blog-archive` ends in a rule, and the widget stack draws one between
siblings, so a recent-posts widget put two hairlines a few pixels apart with
nothing between them — which reads as a rendering fault rather than a
separator. The last row drops its rule inside a widget only.

### Added — the single post at all three widths, and `.ns-widget`

`.ns-post--sidebar` and `.ns-post--wide` have existed in the stylesheet for a
while with no template and no demo, which meant two thirds of the post layout
were undocumented. Both now have a full page:

| Template | Layout | For |
| --- | --- | --- |
| `blog-post.html` | TOC rail \| article \| share rail | reference material |
| `blog-post-sidebar.html` | article \| sidebar | a post carrying a newsletter, a shelf or a sponsor |
| `blog-post-wide.html` | article alone | an essay |

**The measure is identical in all three** — verified at 672px in each. That
is the whole reason they are variants of one layout: the rails come and go,
the reading line does not move. A longer line does not become more readable
because there is room for it.

The sidebar layout drops the TOC rail and moves the outline into the article
as a disclosure. A page cannot put navigation on both sides of the text and
still read as text. The wide layout has no outline at all: four headings is
furniture pretending to be navigation, and a post that genuinely needs an
outline is reference material and wants the rail layout.

### Added — `.ns-widget`

A titled block in a sidebar: categories, recent posts, a newsletter, the
author, a sponsor.

**Not `.ns-railbox`**, which is the admin editor's rail box — a raised card
with a mono uppercase title, right for "PUBLISH SETTINGS" beside a form
where the title is a field label. A blog sidebar's headings are words a
reader reads. Mono is for values.

**Not nothing, either.** The listing rail was hand-rolling each block out of
`.ns-toc__title` plus an inline `padding-inline: 0` to cancel padding the
TOC needs and a sidebar does not — three widgets, three copies of the same
override. An override repeated is a component asking to exist.

Most widgets are unboxed; `--boxed` is for the one with an action in it. A
sidebar of five bordered cards competes with the article for attention, and
the article has to win.

`.ns-postfoot` came out of the same observation: the stack of tags, bio,
pager and comments was an inline `display:grid;gap:…;margin-block-start:…`
about to be copied into a third template.

### Fixed — three things the build and the browser caught

- **Six invented class names.** `check-markup` rejected `.ns-toc__list`,
  `.ns-toc__item`, `.ns-prose__lead`, `.ns-code__head`, `.ns-code__name` and
  `.ns-postfoot` on the first pass. The TOC is flat anchors, the lede is
  `.ns-lead`, the code header is `.ns-code__bar` / `.ns-code__file`. This is
  exactly the gate's job and it did it before anything rendered.
- **The widget stack cancelled its own gap.** `.ns-widgets` had a `gap` and
  each unboxed widget added a matching `padding-block-start`, so the first
  version subtracted the gap back off with a negative margin — and the boxed
  widget, which takes no padding, lost its spacing entirely. Cancelling a gap
  you set yourself is a sign the gap was wrong. There is no gap now; the
  following widget owns the margin.
- **A template comment that described behaviour the CSS does not have.**
  `.ns-postnav__link--empty` is `visibility: hidden` — a spacer that keeps
  "Next" on the right rather than letting it slide over and read as a
  previous. The comment claimed the slot announced itself. It is now
  `aria-hidden` with the correct explanation.

### Added — `.claude/skills/namaste-ui/`, the portable skill bundle

A self-contained knowledge pack that lets an agent build in this design
language from a **different repository**, with this one nowhere in sight.
`docs/PORTABLE-SKILL.md` is the full explanation; the short version:

- `SKILL.md` plus five reference files — rules, tokens, classes, components,
  patterns. The agent loads the entry point and pulls a reference only when
  it needs that specific thing, which matters at ~2,900 lines: loading the
  whole pack to style a button would crowd out the actual work.
- It is **separate from the `SKILL.md` at the repo root**, and that is the
  point. The root skill is for working *inside* here and says so in its first
  line — "read `readme.md` first, then explore the other files". Every
  pointer in it dangles the moment it is copied somewhere else. This one
  assumes nothing is present but itself.

**Generated, for the same reason the styleguide is.** A hand-written
knowledge pack is a snapshot, and a snapshot of a design system is wrong
within a week — quietly, in the direction of whatever the author remembered.
`tokens.md` comes from `tokens/tokens.json`, `classes.md` from parsing
`components/css/`, `components.md` from the same `COMPONENTS` array the
styleguide renders from. A renamed class reaches the pack in the commit that
renamed it.

`rules.md` and `patterns.md` are written by hand and live as string constants
in the generator. They are judgement — the five principles, the
scanned-versus-read fork, "mono is for values", and the list of traps this
month produced — and judgement does not come out of a parser.

`build-skill.mjs` runs in `gulp build`; `--check` is now one of the gates.
Verified by appending a line to a generated file: exit 1, naming the file.
The failure it prevents is the nastiest kind — an agent confidently teaching
a version of this system that no longer exists, in somebody else's repo,
where nobody here would ever see it.

One detail worth recording: the component reference derives each entry's root
class from its own demo markup rather than from its id, because the two
diverge often enough that guessing is worse than useless. The Button entry
has id `button` and renders `.ns-btn`; a reference telling an agent to write
`.ns-button` sends it to a class that does not exist.

### Changed — the hero and the logo band are one screen

`.ns-hero--tall` is 68svh, not 86. The hero and the trust band under it are
one argument — the logos are the first evidence for the claim directly above
them — and at 86svh the marquee started below the fold, so the two halves
never appeared together. Measured at 557px hero + logo band ending at 763px
in a 772px viewport.

The line over the logo wall is gone. "Teams learning here — 1,482 people, at
their own desks and on their employers' time" is a sentence with a
subordinate clause in it, over a row that is scanned in about a second.
`.ns-logorow__title` replaces `.ns-logorow__caption`: a few words naming what
the row is.

### Added — `.ns-profile`, and the author cards become records

`.ns-maker` led with a first-person sentence, which is a good testimonial
shape and a poor **profile** shape: a reader asking who is teaching them had
to read a paragraph before reaching a name. `.ns-profile` answers the
identity question in the first glance — cover, face, name, title, fields —
and puts the voice underneath.

The avatar overlapping the cover is the only element in the card allowed to
break a boundary, which is what makes it the first thing the eye lands on.
The cover is the brand's console ground rather than a photograph: a cover
image at this size is forty pixels of an unrecognisable picture.

One bug worth recording: the cover was `position: relative`, and a positioned
element paints above non-positioned in-flow content — so the cover rendered
**on top of** the avatar pulled into it by a negative margin, and the top
half of every face disappeared behind the navy. The cover needs no
positioning at all.

### Added — `.ns-bubble` and the testimonial deck

Three rows, alternating direction, at three speeds (40s, 52s reversed, 88s).
The alternation is what turns a strip into a crowd: three rows travelling the
same way at the same rate is one sheet sliding, and the eye locks onto it and
stops reading. Different speeds mean the rows never return to the same
relative position, so there is no repeating frame to latch onto.

`.ns-marquee-deck` supplies the depth — perspective on the container, the
rotation on a **wrapper** and never on the animating track. A rotation on the
track composes with the translate the loop is driving, so the card nearest
the camera changes as it moves and the whole strip appears to swing.

Two things this shook out:

- **`.ns-marquee__item--card`.** The item is the mono credential voice —
  uppercase, tracked, nowrap — which is right for a passing mark in a strip
  and catastrophic for anything with a paragraph in it. Bubbles inherited it
  and rendered as uppercase monospace prose, the single worst setting in the
  system. The modifier hands the typography back to the card inside.
- **Deck padding.** `rotateX` pushes the near edge of the plane below the box
  it was measured in, so a deck sized to its untilted content clipped the
  bottom row's names off. The clip has to stay — `rotateZ` throws the corners
  out sideways and would give the page a horizontal scrollbar — so the room
  goes inside it as padding.

### Added — `.ns-ytstrip`, a sideways lesson shelf with a real scrollbar

**The visible scrollbar is the whole point and it took undoing a global to
get it.** `tokens/base.css` sets `* { scrollbar-width: thin; scrollbar-color:
… }`, which is right everywhere else — but Chrome ignores every
`::-webkit-scrollbar` rule on an element whose `scrollbar-width` or
`scrollbar-color` is anything other than `auto`, and the standard properties
cannot ask for a bar that occupies layout space instead of floating over the
content and fading when idle. On a horizontal shelf that fade *is* the bug: no
affordance on a trackpad, no target for a mouse, nothing for a keyboard until
something inside takes focus. So the two properties are returned to `auto` on
this component and the bar is drawn with the pseudo-elements. It now measures
10px of real layout height.

**Facades, not iframes.** Each card links to YouTube. An embed pulls about a
megabyte and sets third-party cookies before anybody presses play; six embeds
do it six times; and a design-system template that ships a tracker inside it
makes that choice for every product that pastes the markup.

The numeral behind each thumbnail sits **above** the picture, not below.
Below, the visible half of a digit set at `--size-mega` lands exactly where
the title goes, and no amount of tinting makes a 5rem numeral behind a 17px
title anything other than a readability problem. Above, it has the band's own
air to sit in. It works by paint order — the numeral precedes the thumb in
the DOM, both positioned — so no z-index is involved. `overflow-x: auto`
forces the block axis to clip too, so the room for it is padding *inside* the
scroll container, which is the only way to give overflow room to something in
a scroller.

### Changed — the about-the-author section, cut to the bone

Six log lines of forty words each is a bio wearing a costume: the reader
still had to read three hundred words to find out who this is. Four lines of
one clause, four numbers set large, a portrait, a signature.

### Changed — the hero is a fixed two-column again, at marketing height

The sticky scroll hero was the wrong shape for a homepage opener, which has
to say one thing on one screen. It is back to `.ns-hero--split` with the
assembly on the right, plus `--tall`.

`.ns-shero` is not deleted — it keeps its component page. It is the right
shape when a claim genuinely needs four pieces of evidence; it was simply
never the right shape for band 01.

**The min-height is on the band, not on the inner**, and that is the
difference between a number that means what it says and one that does not.
On the inner, the band's own `padding-block` is added on top: 82svh + 128px
is, on a 716px viewport, exactly 100vh — the one outcome the number was
chosen to avoid. On the band it is 86svh, measured at 616px against a 716px
viewport with 51px of the next band visible underneath, which is the
cheapest scroll affordance there is.

`.ns-hero__eyebrow`, `__mark` and `__facts` were promoted out of `.ns-shero`
so both heroes share one vocabulary. `check-markup.mjs` caught the rename
where the styleguide still used the old names, which is what it is for.

### Added — three marketing sections

- **`.ns-showcase`** — alternating full rows: a vector, a step, a title, a
  paragraph, two specifics and one action. It replaced the `.ns-features`
  3-up grid answering the same question. A feature grid is right when each
  claim is a *sentence*; the moment a claim needs a picture and a paragraph
  and somewhere to go next, three cells stop working — the picture is a
  thumbnail, the paragraph is clipped, and there is nowhere for the link.
  The alternation is done with `order` on the art so the DOM keeps reading
  order, and it comes off below `--lg`, where alternating in one column is
  just a picture that is sometimes above and sometimes below.

- **`.ns-videoband`** — one lesson, playable, with its chapters beside it.
  The list is the point: a play button asks for eleven minutes on faith, and
  the chapter list spends ten seconds instead. Timestamps stay in the mono
  voice, because a timestamp is a value — that is what the label voice is
  for, unlike the names and actions that left it this week.

- **`.ns-photoband`** — a photograph held still while the words move over it.
  **The parallax is `position: sticky` and nothing else**, which is the whole
  reason it is verifiable: the media pins at 0 from 200px through 700px of
  scroll and releases at 1200px, measured. Not
  `background-attachment: fixed` — that repaints every frame, is silently
  ignored on iOS Safari, and cannot carry an `<img>`, so no alt text, no
  srcset, no lazy loading.

  **The photographs are missing and the band says so.** Every other empty
  slot in this system takes a glyph cover, because an icon is a finished
  answer for a course or a post. This is the one place that is wrong: there
  is no honest illustration of a person who has not been photographed, so
  the slot carries `.ns-ph` and should look unfinished until somebody
  supplies the picture. Do not substitute stock photography of strangers at
  laptops — a learning site's photo band is a claim about who is actually
  here, and stock makes that claim falsely.

Two layout bugs found and fixed while building the photo band: `margin-inline:
auto` on a grid item removes the stretch, so the frame shrank to its content
width and — with an aspect-ratio deriving height from width — collapsed to
123px (`justify-self: center` instead); and giving `.ns-ph` `display: block`
overrode the `display: grid` it uses to centre its own label, stranding it in
the top-left corner where an empty slot stops reading as "a picture goes
here" and starts reading as a broken image.

The homepage is 23 bands. Doc pages for all three: 174 components.

### Added — `.ns-shero`, and the homepage hero becomes a section

The old hero was one screen with one picture carrying a claim that needs
four, so it showed an abstraction that meant nothing to a stranger. The new
one pins the pitch on the left and scrolls the evidence past on the right,
and the band ends when the evidence runs out — four panels: a lesson
playing, the data model, governor limits as a budget, and the system
assembling itself.

**The mechanism is `position: sticky` and nothing else** — no scroll
listener, no observer, no timeline. That is a deliberate choice after last
week: sticky is *layout*, so it works in every engine, survives a
backgrounded tab, and cannot fall out of sync with what it is pinned to. It
was verified here by measurement (the stage holds at `top: 0` from 400px
through 1500px of scroll, then releases as the band ends), which is exactly
what could not be done for the scroll-driven motion.

Two conditions break it from a distance and both are now written down:
no ancestor may be a scroll container, and the sticky element's *parent*
must be the tall one (`align-self: start` on the stage, or it absorbs the
row height it was supposed to travel through).

### Fixed — `.ns-band--dark` clipped with `overflow: hidden`

`overflow: clip` now. Both crop the grid motif; only `hidden` makes the band
a **scroll container**, and everything inside one that depends on the page
scrolling then breaks in silence — `position: sticky` pins to a box that
never scrolls, and `view()` timelines freeze at 50% progress. The dark band
had been quietly disabling both for anything placed on it. There was never a
reason to prefer `hidden` for a box that was not going to scroll.

### Changed — mono is for values, sans is for words

The label voice had spread from data to language. A person's name, a stat's
label, a call to action and a line of fine print were all set in tracked
uppercase monospace, which is a bad way to set any of them — a name in the
label voice reads as a serial number.

The test is whether you would say it aloud as a word or read it off as a
figure. "Priya S." is a word; "4h 05m" is a figure. Moved to the sans:

| | was | now |
| --- | --- | --- |
| `.ns-quote figcaption` — a person | 11px tracked mono caps | 15px sans |
| `.ns-cta__fine` — a sentence | 11px tracked mono caps | 15px sans |
| `.ns-statband__label` — a word labelling a number | 11px tracked mono caps | 15px sans |
| `.ns-router__go` — an action | 11px tracked mono caps | 15px sans, semibold |
| `.ns-plan__name` / `.ns-tier__label` — names | 11px tracked mono caps | 17px heading |

Nothing that is genuinely a figure moved: durations, counts, indexes,
prices, timestamps and the `01 / 04` panel step all keep the mono voice.
The hero's proof line was the worst case and is now three facts on three
lines rather than one tracked string — `12 COURSES · 150 TRAINING MODULES ·
MOST OF IT FREE` is three separate claims wearing the grammar of a serial
number.

### Added — `.ns-screencast`, a lesson playing with no video file

A marketing page has to show the product moving. The honest options for a
design system are a real recording or nothing: a recording is a binary
nobody can diff, it is wrong in one of the two themes, it goes stale the
first time the UI changes, and it costs megabytes to make a point about a
layout. A stock clip of somebody at a laptop is worse — it shows a person,
not the product.

So the footage is built from the same primitives as the thing it is showing:
an editor tab strip, code lines that type themselves in on a loop with a
caret that follows the last one, and a runtime bar that fills. It weighs
nothing, it is correct in both themes because it is drawn in tokens, and it
cannot go stale. A product page swaps it for `<video src poster muted loop
playsinline>` in the same frame and nothing around it changes.

The take length is a local custom property, not a duration token, for the
same reason `.ns-marquee`'s speed is: it is the length of a piece of
footage, not the response time of a control.

### Added — `icons/hero-scenes.svg`, illustration-scale vectors

Four 400×300 scenes, against the icon set's twenty 24px glyphs. `currentColor`
and two opacity levels only, so they are right in both themes with no second
asset and no filter; 1.7px strokes matching the icon set's optical weight so
the two never read as two libraries.

Every one is a diagram of something the curriculum teaches — a schema, order
of execution, governor limits as a budget, sharing recalculation — because an
illustration a reader can learn something from is the only kind that survives
being looked at twice. `.ns-vec__draw` strokes draw themselves in, which needs
`pathLength="100"` so one duration fits every path length.

### Added — a styleguide page for the scroll hero

`c-shero`, with the sticky mechanism's two breakable conditions, the
screencast, and all four scene vectors. 171 components, 201 pages.

### Added — `check-markup.mjs` fails on an inert class pairing

Some components are a **pair**: one class does nothing unless another is
present above it, and when the partner is missing there is no error, no
warning, and no visual difference from not using the effect at all. That is
the worst failure mode this system has, because it survives review — the
page looks exactly like a page where somebody chose not to use it.

`.ns-parallax` without `.ns-parallax-frame` is the motivating case, and it
cost real time this week before it was understood. The check is per file
rather than per DOM ancestry: a true ancestor test needs a parser, and in
practice the frame and its layers are authored together, so a file that uses
one and not the other is the bug. Verified by deleting every
`ns-parallax-frame` from the homepage — exit 1 with the reason — and
restoring it.

`PAIRS` at the top of the check is the place to add the next one.

### Added — styleguide pages for everything added this week

Five components existed in CSS and in one template and nowhere in the
styleguide, which by this repo's own standard means five components nobody
can see. `component-docs.mjs` is the source for every per-component page, so
they are entries there now:

- **Author card** (`c-maker`) — new page. Cross-links to Instructor and
  Testimonial in its *not for* list, because the whole point of the
  component is the distinction between the three.
- **Logo row** — rewritten. `.ns-brandmark` real marks, the `--lg` row with
  `.ns-logorow__caption`, and the text-mark fallback, with the fabricated-
  endorsement rule stated in *not for* rather than buried in an SVG comment.
- **Card** — the glyph cover, with the `.ns-ph`-versus-`--glyph` argument.
- **Page motion** — parallax, and why it needs a frame.
- **Sponsor card** — the ask, and why it is neither the empty slot nor a CTA.

200 pages now (was 199); `check-links` passes across all 348.

### Changed — the band kicker was set at the mono label floor

`--size-label` (11px) is where an index, a duration, a table caption and a
status chip belong: glanced at, never sentences. `.ns-kicker` is not one of
those. It is the first thing on every band and it is a phrase a person
reads — and at 11px, uppercased and tracked, it was the smallest text on the
page. Every band effectively opened on its heading with the framing line
lost. It is now `--size-mono` (13): the same voice one step up, still
visibly data rather than prose. Nothing else on the mono scale moved.

The line over the logo marquee is no longer a kicker at all. A kicker frames
a heading; a logo wall has no heading, so it was a row of tracked capitals
doing an ordinary sentence's job. It is now `.ns-logorow__caption` — a plain
muted sentence at the band's own body size.

### Added — `.ns-maker`, and the homepage's authors stop being a byline

The "who wrote it" band was `.ns-instructor`, which is a catalogue block: an
avatar, a name, a role and two counts, built to sit in a course page's
sidebar next to the buy button, where the reader has already decided. On a
homepage it produced a byline, and nobody has ever been persuaded by one.

A homepage asks a different question — not "who is this" but "why would I
listen" — so `.ns-maker` leads with the person **speaking**: one first-person
sentence at `--size-prose-lead`, the largest thing in the card, with the
identity underneath as attribution. That is the shape of a testimonial, and
it works here for the same reason it works there.

Two columns, never three: three would cut each sentence to a phrase, and a
phrase in quotation marks is a pull-quote, not a voice.

`.ns-maker__who` is a grid rather than a flex row, and that is load-bearing.
"Salesforce Architect · 11× certified" wraps in a card this wide while
"Flows & automation" does not, so in a flex row the stat chips landed at
different heights in the two cards and the pair read as a bug. The old
`max-width: 47.999rem` guard never fired, because the problem is the
**card's** width (~580px) inside a 1440px page — a container-width problem
with a viewport-width answer.

### Added — `.ns-sponsorask`, and the sponsors band asks

The band now has an inbound half: one hairline row, a sentence with two real
numbers in it, and an outline button. It is deliberately not `.ns-adslot`
(dashed scaffolding whose own docs say never to ship it to a reader) and not
`.ns-cta` (the page gets one closer, and spending it on "sponsor us" sells
the wrong thing to the 99% who came to learn).

The sponsor card's logo is now the **mark-only** symbol. `.ns-sponsor__name`
sets the company name as real text beside it and the docs are explicit that
it is not optional — so a full lockup rendered "Orgforce / Orgforce".

### Changed — "Shipped recently" is a timeline

`.ns-shipped` is a list of changes: four independent facts that happen to be
sorted, and it read as one. The whole argument of the band is that they are
**consecutive** — the work did not stop between July and August — and a
timeline says that with its spine and its dots, in the geometry the training
rail and the account activity feed already use. `--icons`, because the kind
of change is what is being scanned; the newest entry takes
`data-state="current"`, so the coloured dot marks the live end of the spine.

### Fixed — the marquee dragged a hole across the trust band

`.ns-marquee__track` is translated by exactly half its own width, which only
lands on an identical frame if the track already tiles its content. Six logo
marks do not fill a desktop row, so once per lap a gap the width of the
shortfall crossed the band. Each track now carries the set twice, with the
repeat `aria-hidden` so the row still announces six companies rather than
twelve.

### Added — `.ns-parallax`, and the frame it needs

Scroll-scrubbed depth for **decoration only** — a cover glyph, a band's
illustration. It never moves content and never changes layout.

It comes in two parts, and that is not an API mistake:
`animation-timeline: view()` resolves against the subject's nearest **scroll
container**, and `overflow: hidden` makes an element one even though nothing
in it will ever scroll. So a layer parallaxing inside a clipped box — which
is every sane use of the technique, since it depends on the overflow being
hidden — resolves its timeline against a box that never moves and sits
frozen at 50% progress. It looks like it works: the element is exactly where
an un-animated element would be.

Hence `.ns-parallax-frame`, which declares a named view timeline and must be
an element whose *own* nearest scroll container is the page (the card, the
band — not the clipped media slot inside it). `.ns-parallax` layers anywhere
below it consume that timeline by name.

### Added — scroll-driven entrances wired into the homepage

Every band head takes `.ns-anim--rise.ns-anim--onview`; every grid,
timeline, price table and FAQ takes `.ns-anim-stagger--onview`. All of it is
the motion layer the system already shipped and the homepage had never used
— native scroll-driven animation, no observer, no script.

**Not verified in a browser.** The automation window reports
`document.visibilityState === "hidden"`, and a hidden document deactivates
scroll timelines (and stops IntersectionObserver delivering), so every
`view()` timeline on the page reads as inactive there regardless of whether
the CSS is right. The declarations are correct and the degradation is safe —
an inactive timeline leaves content at its natural, visible state, which is
what the screenshots show — but the motion itself needs a look in a real
window.

### Changed — the marketing bands were set one step below the UI base

`components/css/sections.css` set its body copy at `--size-small` (13px):
the feature paragraph, the router's "when", the compare panels, the fit
list, the FAQ answer, the sample note, the shipped row. The scope chips were
at `--size-label` (11px) — the mono label floor — while carrying running
words rather than labels.

That is one step **below** `--size-body`, which makes a homepage paragraph
smaller than a table row. The fork in `tokens/typography.css` is not
article-versus-not, it is **scanned versus read**, and nobody scans a
homepage; they read it once, deciding. The band layer had reasoned itself
onto the wrong side of a fork it was supposed to be an example of.

The band layer now takes the reading scale:

| | was | now |
| --- | --- | --- |
| `.ns-band__lede`, `.ns-hero__lede` | 17 | **20** `--size-prose-lead` |
| `.ns-feature__name`, `.ns-faq summary` | 14 | **17** `--size-prose` |
| feature / router / compare / fit / FAQ / sample / shipped copy | 13 | **15** `--size-prose-small` |
| `.ns-scope__items` | 11 | **13** `--size-small` |
| every mono label, kicker, index, stat label | 11 | **11** — unchanged |

The mono voice does not move. A kicker, an index, a duration and a stat
label are data, not prose, and the label scale is where they belong on
either side of the fork.

**Cards composed into a band follow the band.** A new rule at the foot of
`sections.css` lifts `.ns-card__title` / `.ns-trackcard__title` /
`.ns-path__title` to 17 and their body copy plus `.ns-bcard__excerpt` to 15
— but only inside `.ns-band`. The same course card in a catalogue grid or a
rail keeps the UI scale, because a catalogue of forty is scanned and three
on a homepage are read. The component does not change; only the register it
is read in does, which is the tell that this is the fork applied rather than
an exception carved out of it.

`.ns-lesson` is deliberately excluded. "A lesson row looks the same in the
syllabus, the rail and the drawer" is a promise `lms.css` makes, and a
lesson row inside a band is still a list of lessons.

### Added — `.ns-brandmark` and `icons/brand-marks.svg`

A real logo lockup in a trust row or a marquee, as opposed to
`.ns-logorow__mark`, which is a company's *name* set in our mono face
because no mark exists.

Sized by **height**, never by width. Logos come at wildly different aspect
ratios, and a row that sets a common width shrinks the wordmark and inflates
the monogram; optical evenness comes from a shared cap height. Every symbol
in the sprite therefore carries its own viewBox width, and the host `<svg>`
has to repeat it — an externally-referenced `<use>` gives the host no
intrinsic size, so `inline-size: auto` has nothing to resolve against and
the element collapses to the CSS default 300×150 with the mark letterboxed
inside it. (Found the hard way: at a shared 132-wide box, "UMBRELLA OPS"
measured 144 and lost its S.)

Colour is `currentColor`, so the row's grayscale-at-rest → ink-on-hover is a
colour change rather than a filter. That is not only tidier: `filter:
grayscale(1)` on a dark logo over a dark band leaves a black rectangle, so a
filtered logo wall needs a second set of assets for the dark theme and this
one does not. The trade, stated plainly in the CSS: it only works for
monochrome marks, and a partner who requires their two colours gets an
`<img>` and a second asset.

**Every company in the sprite is fictional** — Acme, Northwind, Globex,
Initech, Umbrella, Orgforce, Contoso, Initrode — and the file says so at the
top in the strongest terms available. They exist so the row can be built,
reviewed and screenshotted against real *marks* instead of five words in our
own mono. A logo wall showing a mark its owner never granted is a fabricated
endorsement, and it is worse than the quiet text row it replaced.

### Changed — the homepage: membership, sponsors, and marks instead of names

Now 21 bands. Three changes on top of the nine added above:

- **02, the trust marquee**, carries logo lockups rather than names set in
  mono. The band reads as a logo wall for the first time, which is what it
  was always describing itself as.
- **12 is a membership band** (`.ns-plans`) — three columns, real prices, the
  advantages listed per column, the yearly saving stated as a number. It
  *replaced* the two-column `.ns-tiers` free-vs-Pro band rather than joining
  it: both answered "what does it cost", and two price bands on one page is
  one price band and a rehearsal of it.
  **No billing switch.** `.ns-plans` ships a monthly/yearly control and it
  belongs on the pricing page where flipping it recomputes the prices.
  Nothing on this page recomputes anything, and a control that moves a dot
  and changes no number is the dead affordance the pace band was cut for one
  commit ago.
- **18 is the sponsors band** — the full row of marks, plus exactly one
  `--leaderboard` card for the headline sponsor, because `.ns-sponsor`'s own
  argument is that two sponsors on a surface is a surface nobody looks at.
  It sits at the bottom and not beside the trust marquee on purpose: band 02
  is other people's logos vouching for us, band 18 is us disclosing who pays
  us, and putting a paid placement in the credibility slot spends trust that
  was not ours to spend. The card's logo is the sprite mark rather than our
  own favicon, so it is no longer labelled Orgforce while showing somebody
  else's icon.

### Changed — the learning-site homepage, from eleven bands to twenty

`templates/homepage.html` showed the merchandise and then stopped. Eleven
bands is enough to describe a product and not enough to answer a visitor:
nothing on the page let a reader check the writing, find out whether their
own subject was covered, see the price, learn who wrote it, or tell whether
the curriculum was still alive. Nine bands were added, each admitted on the
same test the section catalogue uses — **it answers a question no other band
on the page answers**:

| # | Band | The question |
| --- | --- | --- |
| 03 | `.ns-router` | which of these am I (admin / developer / architect) |
| 09 | `.ns-sample` | is the writing any good — a real lesson, mid-flow |
| 10 | `.ns-scope` | is the thing MY job needs in here |
| 11 | `.ns-compare` | what changes about me, eight weeks apart |
| 12 | `.ns-tiers` | what does it cost |
| 13 | `.ns-instructors` | who is actually teaching me |
| 15 | `.ns-bcard` | what does a normal week here look like |
| 16 | `.ns-shipped` | is this thing still being written |
| 17 | `.ns-fit` | should I **not** buy this |
| 18 | `.ns-field` | the exit for a reader who is not starting today |

No new markup was invented for any of them — every band composes classes the
system already ships, which is what the section catalogue was for.

The FAQ's "What is free and what is Pro?" row was replaced with a question
about elapsed time. An FAQ row is where a question goes when it does **not**
deserve a section; free-vs-Pro now has band 12, so it had to leave rather
than be answered twice on one page.

### Removed — the pace band from the homepage

The finish-date band (`.ns-pace`) is gone from `templates/homepage.html`. On
the training index it is wired: the segmented control recomputes the date, so
picking "15 min" does something. On the homepage it was static — three radio
buttons that moved a dot and changed nothing, above a date they did not
compute. A control that does not control is worse than the sentence it
replaced. `.ns-pace` itself is unchanged and still ships on
`templates/training-index.html` and on its own component page.

### Added — `.ns-card__media--glyph`, the big-icon cover

A card whose subject has no photograph and never will — a course, a track, a
post, a topic — now takes its own glyph at cover size on the hairline grid,
instead of `.ns-ph`.

The distinction is what each one *says*. `.ns-ph` says "a picture is missing
here" and should embarrass somebody into supplying one. A glyph cover says
"an icon is the artwork", and is finished. Using placeholders as permanent
card art is how a catalogue ends up looking unbuilt — and how three course
cards end up looking like three copies of the same card, because three
identical placeholder slashes are the largest thing on all of them.

The glyph tracks the card's hover state (colour only — nothing scales,
nothing lifts) because the cover is the biggest part of the target, and it
takes `--color-brand-300` in dark. The homepage's course cards and blog cards
use it; `.ns-tthumb--glyph` remains the same idea at track and path-stop size.

### Added — the live stream system, from eight scenes to eighteen

The eight scenes shipped earlier covered a person teaching at a screen. They
did not cover the two things a live session actually is and a recording is
not: **an audience that talks back**, and **a moment somebody has to be asked
to subscribe to.** Both were missing, so both were being improvised on air —
which is the one thing the rest of this system exists to prevent.

Eighteen scenes now, in three groups, each drawn in **both themes**:

| Group | Scenes |
| --- | --- |
| Open & close | countdown, welcome slide, intermission, ending |
| Teaching | camera, screen, screen + title, screen + camera, slide, slide + camera, code |
| Comments & guests | camera + comments, screen + comments, screen + camera + comments, comment wall, Q&A, guest two-up, guest + screen |

Four new specimen cards carry the components those scenes needed:

- **Camera shapes** — the camera is no longer assumed to be 16:9. Eight
  sanctioned crops (16:9 corner, full bleed, two-up, column, stacked pair,
  4:3 block, 1:1 bust, 9:16 rail), each tied to the layout whose block it
  fills. The rule that replaces "always 16:9" is *fill the block the layout
  gives you without dead space* — which is why a camera beside a wide comment
  rail is 4:3 and a standing shot is 9:16. One crop per session, still.
- **Name plates** — icon, name and job title as one object, with six
  variants: host, guest (which gets a handle line the host does not), compact,
  speaking state, screen driver, and credential. The screen-driver plate is
  the only overlay in the system with no exit rule, because the question it
  answers stays true for the whole demo.
- **Action chips** — subscribe, like, bell, newsletter, visit, share, plus the
  CTA sting. Two on screen at most, one of them filled, and never on a
  teaching scene.
- **Notification toasts** — six events (subscriber, member, tip, milestone,
  resource drop, technical notice) in one lane that queues rather than stacks.
  The edge colour is a category, not decoration: brand for a free action,
  amber for paid support, green for a milestone, red for a problem.

The scene grid grew from seven zones to ten — comment rail, chip lane and
toast lane — and the overlay kit from twelve graphics to fifteen. The eight
old scene tiles were a single card; they are now three, because a card you
have to scroll for a minute is a list, not a specimen.

### Added — `brand-content-creation/livestream/export/`

Seven OBS-ready Browser Sources over one shared `overlay.css`, at true
1920×1080: furniture, starting-soon/intermission, name plate, action chips,
toast lane and comment rail. Everything is configured through the query string
(`?theme=light`, `?variant=guest`, `?kind=member`, `?safe=1`), so one file
serves every session and nobody edits HTML at 19:04. `toast.html` and
`comments.html` also accept `postMessage`.

They are deliberately **not** in `components/css/`: that layer is the contract
between the Ghost theme and the LMS, and a lower third is neither. This is a
third consumer of the same tokens.

Two things the files encode that prose could not: `actions.html` caps the chip
lane at two and refuses a second filled chip, and the comment rail reads a
`.js` file rather than fetching JSON — a page opened from `file://` cannot
fetch a sibling, and OBS fails that silently.

`OBS.md` follows: the 18-scene build list, geometry for every new zone and
crop, a "mute overlays" hotkey, and the four new troubleshooting rows.

### Added — six page sections, each answering a question no other band does

The admission test for a new section is not "is this a different layout" but
"does this answer something none of the others answer". A band that restates
the feature grid in a new arrangement is a variant, not a section. These six
each carry a distinct job:

| Band | The question it answers |
| --- | --- |
| `.ns-router` | Which of these am I? |
| `.ns-compare` | What changes about me? |
| `.ns-sample` | Is the writing any good? |
| `.ns-scope` | Is the thing I need in here? |
| `.ns-fit` | Should I *not* buy this? |
| `.ns-shipped` | Is this still alive? |

**`.ns-router`** — mutually exclusive entry points. The distinction from
`.ns-features` is logical rather than visual: feature cells are
simultaneously true, router cells are a choice, which is why each is a link
with a destination. The `__when` line does the work — "you are here if you
already administer an org" lets a reader rule themselves in or out in one
read, where three role names alone are three job titles and a guess.

**`.ns-compare`** — two panels deliberately *not* peers. The left is a state
to leave, the right is where the training puts you, and styling them
identically would argue the opposite of the copy. The seam is its own grid
column because it belongs to neither panel; below md the panels stack and the
arrow rotates, since an arrow still pointing right at stacked panels points at
the page margin.

**`.ns-sample`** — a genuine excerpt behind a masked fade. The only quality
claim a reader can check from a homepage is one they can read. The fade is a
`mask-image`, not a gradient overlay: an overlay has to know what colour it is
fading to, so it breaks on a sunken band and again in dark mode.

**`.ns-scope`** — breadth at a glance, grouped and counted. `.ns-path` shows
depth, the ordered stages a reader moves through; a buyer is asking something
else entirely — does this cover the thing my job needs. Deliberately dense,
because forty terms scanned in five seconds beats six benefit statements.

**`.ns-fit`** — the band that argues against itself, and the only one that
can. Everything else on a marketing page is advocacy, which readers discount
automatically. Both columns are about the *reader*, not about a competitor.

**`.ns-shipped`** — dated, time-ordered, newest first. The one band that gets
worse if nobody maintains it, which is exactly what makes it credible. If the
newest row is ever three months old, delete the band rather than back-date it.

All six are in `templates/sections-home.html` in canonical page order and
documented in the styleguide.


### Fixed — the curriculum rail had four different left edges

Measured down one 352px column: the search field started at 12px from the
rail's edge, the section rows at 16px, the foot's share buttons at 8px and
the watermark at 12px. Four rules, four inline paddings, none of them wrong
on its own — which is exactly why it survived, since nothing ever compared
them. The rail now declares `--ns-rail-pad` once and its head, list, foot and
byline all use it, so every row starts and ends on the same line. A rail is
a column, and a column has one edge.

### Fixed — the filter head padded 8px above the field and 20px below it

Not the padding, which was symmetric the whole time: the head is a grid with
a `--space-3` gap and two children, and the second — the "3 sections · 12
lessons" result line — is empty until somebody types. An empty grid item is
still an item, so it claimed a 12px gap and contributed 0px of its own.
`:empty { display: none }` takes it out of the grid, and it returns the
moment the filter has something to say.

The head also carried `margin-block-end: var(--space-2)` from the base rail,
where it is the gap before the list. In the `--doc` rail the head is a grid
row with a hairline under it, so that margin sat *below the border* as an 8px
band of nothing — a row with a bottom edge and then some more room after it,
which is what made the block look untidy however the padding was tuned. The
head is 49px now, down from 61px, and the list starts flush against it.


### Added — a question thread on the training post

`.ns-comments` from blog.css, unchanged: a lesson and a post take the same
thread rather than the training surface growing a second comment system. The
wording differs — on a lesson the useful frame is "ask about this lesson",
because what a reader has after eleven minutes on asynchronous recalculation
is a question, not an opinion.

The compose box comes **first**, above the thread. On a blog the form goes at
the bottom because you read the discussion and then join it; on a lesson the
reader is usually stuck on a specific line, and making them scroll a
40-comment thread to reach the box is why those questions end up in email.

### Changed — the filter row is shorter on the desktop rail

40px is right for a thumb and too tall for a filter above a list of forty
rows: it was spending a whole lesson's worth of height on the box you use to
find one. The row is 2rem at &ge;64rem — and only there. Below that this same
rail *is* the phone drawer, where every control is thumb-hit, so the
`--target-comfy` floor `tokens/spacing.css` asks for stays in force. 2rem is
still well above the WCAG 2.2 AA floor of 24px.

### Fixed — the reopen control moved 136px away from the collapse control

You collapsed the rail at y=79 and the button to undo it appeared at y=216,
so the obvious gesture — click again in the same place — hit nothing. The
spine padded itself `--space-4` against the head's `--space-2`, and with two
auto rows in a full-height grid the button was being stretched rather than
seated at the top. It now shares a centre line with the control it replaces,
measured drift 0.

### Fixed — tooltips stayed open after a click

`.ns-tooltip-host` revealed its tooltip on `:focus-within`, which matches
however focus arrived — including a mouse click. Any control that keeps
focus after being pressed was left with its hint hanging open under a
pointer that had already moved on; the training rail's collapse button made
it obvious, since clicking it moves focus to the reopen control, whose
tooltip then sat there permanently.

Now `:focus-visible`, which only matches when the browser judges that focus
should be indicated — keyboard and other non-pointer routes, exactly the
population the focus branch exists for. A mouse user already had `:hover`.
Two selectors, because the host is sometimes the focusable element itself
and sometimes a wrapper around it, and an element is not its own descendant.


### Fixed — the author block and pager began at the ad rail's edge

They sat outside `.ns-tpost-body`, so they ran the full width of the reading
cell while the article ran the width of its column: measured, paragraphs
started at x=240 and the author card at x=32. Two different pages stacked.
The whole reading flow — article, author block, pager — is the second column
now. Nothing is lost to an empty gutter, because the ad rail is sticky and
is still beside them as they scroll past.

### Fixed — 24px of dead space under the rail's watermark

The base `.ns-trainingnav` is a sticky column in a scrolling page and pads
itself `--space-6` at both ends. The `--doc` override zeroed only the start,
so half that padding survived under the last row of a grid whose rows
already fill the column. The watermark is the last thing in the rail, and a
footer floating 24px off the floor reads as a mistake because it is one.

### Changed — tooltip placement at both ends of the rail

The head's and foot's tooltips open **downward**. Everywhere else a tooltip
goes above its host, which is right when there is page above it — at the top
of the rail upward opens into the topbar, over the crumb, and at the bottom
it covers the last lessons in the list, which is exactly what the reader is
pointing at.

The search button lost its tooltip entirely: the field beside it already
says "Filter lessons" in its placeholder, and a hint repeating the label two
centimetres away is noise on the most-used control in the rail. Its
`aria-label` stays — that is the accessible name rather than a hint, and it
carries the one fact the placeholder does not, that submitting searches the
whole catalogue rather than filtering this rail.


### Changed — the lesson filter is a field and a button

The magnifying glass was an absolutely-positioned `<i>` at the leading edge
with `pointer-events: none` — a picture of a control rather than a control,
which is why the row read as cluttered. It is now a real submit button on
the trailing edge, sitting in the row with collapse and close so all three
read as the same kind of object, and squared to the field's height so they
form one control group instead of three things dropped beside a box.

That also makes the no-JS path honest: the box lives in a `<form action>`
pointed at site search, and a search form with no submit is one only a
keyboard can post.

### Changed — the topbar's progress meter fills the row

It was `flex: none` with a 6rem bar pushed to the end by an auto margin, so
a 1500px header showed a 96px meter with ~700px of empty chrome beside it —
the one element whose whole job is to be read at a glance was the smallest
thing on the row. It now grows into whatever the crumb and the controls
leave. A first pass capped it at 32rem, which only moved the dead space; a
progress bar has no width at which it reads worse, so the cap went.

### Changed — provenance closes the lesson

Author and last-updated moved out of the reading rail into `.ns-authorbox`
at the foot of the article — the component blog posts already use for
exactly this, so a lesson and an article close the same way rather than two
surfaces inventing two bios. Who wrote a lesson and when it was last touched
are what a reader wants when they have *finished* and are deciding whether
to trust it; beside the first paragraph they were two more facts competing
with the writing. The stamp carries `<time datetime>` for both published and
updated, because on a platform that moves three times a year "is this still
true?" is the first question after a lesson that surprised you.

That leaves `.ns-tsky` doing one job, which is the honest description of an
ad slot. The `__group` / `__label` / `__meta` / `__who` rules went with the
markup rather than being kept "in case" — a rule with no call site is a rule
nobody is maintaining.

### Added — tooltips on every icon-only control

Twelve of them, each keeping its `aria-label` as well: the tooltip is for
the sighted pointer user, the label for everyone else, and neither
substitutes for the other.

### Fixed — trailing-edge tooltips hung off the screen

`.ns-tooltip` centres on its host with `translate: -50%`, which is only safe
when the host has half the tooltip's width of room on both sides. The rail's
controls sit at the right of a rail at the right of the viewport, so
"Collapse curriculum" overflowed by a measured 8px and "Search all lessons"
was flush to the pixel — and with no scroll container to grow a scrollbar it
clipped silently, which is the worse of the two failures. Anchored to the
trailing edge, as `.ns-tbar__steps` already was. This is now the second
instance of the pattern; the CSS says that a third wants an `--end` modifier
in `overlay.css` rather than another local override.


### Changed — the training post's header, rail head and reading rail

The rail's head is now the **filter and nothing else**. A track header sat
above it saying "Salesforce Administrator · Section 4 of 32 · 128 lessons",
and every one of those facts is already on screen: the topbar's crumb names
the track and the section, its meter carries the position. The rail's job is
the list.

The post header keeps only what gates the decision to read — duration,
position, difficulty, read state. It had grown to eight chips wrapping to
two lines, which is a second lede made of metadata. **Author and
last-updated moved into the reading rail**: nobody checks who wrote a lesson
before starting it and everybody checks after hitting something surprising,
which makes them things you reach for while reading. The **kind** became a
marked line above the title (`.ns-modulehead__mark`) with the same glyph the
rail uses for that lesson, so the row you clicked and the page you landed on
read as one object.

### Changed — the outline is the real TOC component

The training post hand-built a `<details>` that reimplemented what toc.css
already ships as `--collapsible`. `toc.css` opens by warning that three
copies of a TOC is three places for the scroll-spy to drift; this page was
one of the copies. It now composes the variant and keeps only the rules true
of this placement. Its margins are symmetric too — it had `--stack-md` below
and nothing above, so it sat hard against the video stage.

### Changed — paragraphs fill the training column

`.ns-prose` caps paragraphs at `--container-prose` (672px), and the article
column in this layout is ~900px, so every paragraph left ~226px of dead page
down its right while the table beside it ran full width. The cap is lifted
**for this surface only**. The trade is stated in the CSS: ~900px of Switzer
at `--size-prose` is ~92ch, above the 45–90 a column is usually held to —
bought back by the curriculum rail and ad column shortening the line the eye
actually travels, and by `--leading-prose` already being 1.7. If lessons
read too wide, restore the cap there; `--measure-prose` is still right
everywhere else.

### Fixed — the filter hung out of both sides of the sidebar

Two rules described one element. The first set the head's real padding; a
second, twenty lines later, re-added `margin-inline: calc(-1 * var(--space-4))`
and won on source order. That margin dated from when the head was a sticky
child inside the scrolling list and had to span the scroller's padding — the
head is its own grid row now and spans the rail by construction, so the
margin had nothing left to cancel and simply pulled the search box 16px
wider than its column at each edge.

### Fixed — the article scrolled sideways because of a hover hint

`.ns-tooltip` centres on its host with `translate: -50%`. The topbar's
prev/next hosts sit at the right of a sticky bar at the right of the column,
so a 210px tooltip reached ~57px past the column edge — and
`.ns-training__main` is a scroll container, so it grew a horizontal
scrollbar on a page with nothing wide in it. The tooltips are now anchored to
the trailing edge, the same fix `.ns-lesson-nav__btn--next` already carries.
Clipping the bar would have hidden the tooltip; `overflow-x: clip` on the
column would have disarmed the scroll a genuinely wide table still needs.

### Fixed — `.ns-toc--collapsible` shoved a leading icon to the centre

`> summary i` applied `margin-inline-start: auto` to **every** icon on the
assumption the caret is the only one. Give the summary a leading glyph — the
normal way to label a disclosure — and the icon and its label were pushed
into the middle of the box while the caret kept the end, and the open state
rotated both. Now `> summary > i:last-child`, which still matches a
caret-only summary.


### Changed — the training rail, rebuilt for ~100 sections and ~500 lessons

The target curriculum is end-to-end Salesforce: on the order of a hundred
sections and five hundred lessons. That number changes the design rather
than just stressing it, and four rules follow from it.

**Sections are closed by default, current one open.** Five hundred rows in
one scroller is a document, not a navigation aid. Collapsed, the rail is
~100 scannable rows. `assets/js/training.js` opens the section that owns
`[aria-current]` and scrolls it into view on load, so the rail opens already
showing where the reader is — `block: "center"`, because the useful thing is
the lesson *with its neighbours*, and without smooth scrolling, since a rail
that visibly races through 340 rows on load is motion nobody asked for.

**Every section is numbered.** At 32 sections "Security and access" is
recognisable; at 100 it is one phrase among a hundred, and the number is
what makes "I am in 47" a position rather than a vibe. Tabular and
zero-padded, in its own column, so the numbers form a straight edge.

**Section summaries are sticky.** A 40-lesson section is taller than the
viewport, so scrolling through one used to leave you among titles with no
idea which section owned them.

**Deliberately not virtualised.** 500 anchors is a trivial DOM, and
virtualising breaks the browser's own find-in-page — the feature learners
actually use to find a lesson.

### Changed — the track is a header, not a card

It was a bordered, raised card at the top of the scrolling list. A card is
a thing you pick from a set of peers and there is exactly one track, so the
affordance promised a choice that does not exist; it scrolled away by lesson
three, taking with it the one question it existed to answer; and it spent
~64px of the scarcest column on the page. It is now the rail's pinned title
bar — mark, name, position, and a progress meter — and it never leaves.

### Added — the training topbar (`.ns-tbar`)

A lesson has a chrome and the crumb alone was not it. Sticky over the
reading column, one row, label voice: crumb, a meter for how far through the
section, prev/next, and the curriculum handle. Below md the meter goes and
below lg the steps go — on a phone the bar is the crumb and the drawer
handle, not six controls in a 360px row.

### Changed — the reading column has no width cap

It was capped at `--container-narrow`, then at `--container-page`, inside a
cell already ~60rem wide. Each ceiling put the article back in a ribbon with
dead page on both sides — the exact thing removing the third column was
meant to reclaim. There is no cap now, and that is safe because the thing a
cap protects is line length, which `.ns-prose` already handles by capping
its own paragraphs at `--measure-prose`. Everything that is *not* a
paragraph — tables, code, the video stage, the pager — has no business being
clamped to a reading measure. Cap the paragraph, not the page.

### Added — `.ns-askai--end`

The horizontal half of the rule `.ns-askai--down` states for the vertical
axis: a dropdown must open into space that exists. The base panel opens from
its start edge, which is correct in the course player (rail on the left) and
wrong in the training post, where the same foot sits on the trailing edge —
a 22rem panel opening rightward from a button 2rem off the right of the
viewport opened entirely off-screen.

### Fixed — the phone drawer was in the document flow, and the page scrolled sideways

`.ns-training > .ns-trainingnav` set `position: static` below 64rem for the
base layout. A `--doc` page carries **both** classes, so that selector
matched it too — at (0,2,0), exactly the specificity of the
`.ns-training--doc > .ns-trainingnav` rule that makes the drawer
`position: fixed`. Same specificity, later in the file, so it won: the
drawer kept its `translate: 100%` but went back into flow, putting a 22rem
column one full width off the right edge. Every phone scrolled sideways and
the drawer was a strip of empty space instead of an overlay. The base rule
is now `.ns-training:not(.ns-training--doc)` — the two rules describe
different layouts and should never have been able to match the same element.

### Fixed — the `--doc` drawer had no scrim

`.ns-training--doc` ships a scrim element and wires the close handler to it,
but only `.ns-training--fixed` could ever display it. On a phone the
training post's drawer opened over an undimmed page with no tap-outside
target, while the identical drawer on the course player dimmed correctly.
The markup and the JS were both right; the selector had one arm. The scrim
also moved before the rail in the markup, so the rail — also fixed at
`--z-overlay` — paints above it on source order rather than by inventing a
seventh elevation level.

### Fixed — a duplicate breakpoint flipped the drawer to the wrong edge

A second copy of the `max-width: 63.999rem` block, left over from when the
rail was on the leading edge, re-declared the same breakpoint with
`inset-inline-start` and `translate: -100%`. Being later in the file it won,
so below 64rem the drawer flew in from the left — undoing the move to the
trailing edge in the same stylesheet that made it.

### Fixed — the lesson filter ignored anything rendered after init

It read the sections into an array at wire time: correct for a
server-rendered rail, silently wrong for one whose sections arrive from data
— which is the Next.js LMS, and how a 100-section curriculum will actually
be built. Sections added after init were never hidden while the result line
counted only the startup set, so the rail claimed "1 section" above
ninety-two visible ones. It now re-queries per pass and stores each
section's restore state on the element rather than by index into a snapshot.

### Fixed — the track meter clipped its own percentage

`inline-size: 100%` on the `<progress>` claimed the whole flex row, so the
percentage laid out after it was pushed past the rail's padding and clipped
by the column edge. A flex item that should take the remaining space asks
for the remaining space.

### Changed — the pager is two rows, not three

Direction / section / title stacked three deep made each card ~92px tall, so
the pair took a sixth of a laptop viewport to say two lines. Direction and
section are both label-voice one-liners and read as one caption, so they
share a row; the title keeps its own, and now carries the KIND glyph — an
arrow into a 20-minute lab and an arrow into a 6-question check are
different decisions and used to look identical.


### Added — `--leading-prose`, and a real leading ramp for reading

`1.7`, the tallest step, for exactly one surface: continuous prose at
`--size-prose` on the full 68ch measure. Leading grows with the measure —
the eye's return sweep across a long line needs more vertical separation
than a card excerpt — and 1.6 was drawn for the UI's 14px at card widths.
`.ns-prose` paragraphs and comment bodies take it; supporting blocks inside
the article (callouts, refs, the takeaway) deliberately stay at 1.6, so the
register shift is part of what makes an aside read as an aside.

The other direction got fixed too: the prose lede and blockquote (20px)
dropped from heading/body leading to `--leading-snug` (1.45), which advances
29px — the same rhythm as the 17px/1.7 paragraphs, so the deck and the body
read as one column at two volumes.

### Added — hero variants `--center` and `--split`

Three heroes and no more, differing only in where the eye enters: the
default (left, text-first), `--center` for a launch surface where the
headline is the event, `--split` for the one page where showing beats
telling — body beside a `.ns-hero__media` slot that holds real proof.
Below lg the media drops under the words, so the headline never leaves the
first screen.

### Added — a utility skyscraper, and a collapsible curriculum

**The skyscraper** (`.ns-tsky`) is a narrow sticky column on the leading edge
of the article, holding what a reader reaches for *while* reading rather than
before: who wrote it and when, how long it is, share, and an Ask-AI menu whose
prompts are seeded from the lesson rather than opening blank.

It starts **below the header**, not beside it — the header is the page's title
and owns the full width — which is why the split lives inside `.ns-tpost-body`
rather than on the layout grid. The video stage sits inside the split too, so
the column runs beside the media as well as the prose.

11rem wide and no wider: these are tools, and a tool column wide enough to
read paragraphs in invites paragraphs into it. Below xl it stops being a
column and becomes a scrollable row under the header — which is where it was
always going to end up on a phone, so one rule serves both. Measured at 390px:
a 49px row.

**The curriculum collapses.** A 22rem rail is right while you are choosing what
to read and wrong once you have chosen. `data-rail="collapsed"` takes the
column out of the grid and leaves a 40px hairline spine with a vertical
CURRICULUM label and the reopen control — measured: `1088px 352px` →
`1400px 40px`. The rail never leaves the DOM, so the filter text and the scroll
position survive the round trip (verified: type "apex", collapse, reopen, still
filtered).

One attribute carries all three states — column, spine, drawer — deliberately:
two attributes would be two things to keep in step. The collapse control only
exists at ≥64rem, because below that the same rail is a drawer and a drawer
already has a close button.

Also: lesson rows got roomier (`--space-2 --space-2-5`, and a gap between
them) — the icon, a wrapping title and a time collided the moment a title ran
to two lines, which in a 150-lesson curriculum is most of them. And the last
of the module/post vocabulary is gone from `assets/js/training.js`, including
its internal variable names and the filter's own result line, which was still
counting "1 module · 1 post".

### Changed — the training rail is two levels, and the content got its width back

Three problems, all of them about fit rather than looks.

**The nesting was one level too deep.** The rail went track → module →
sub-heading → post, which reads as "a section, and inside it more sections" —
past what anyone holds in their head while reading, and it squeezed every
lesson title into ~11rem of column. It is now **sections holding lessons**,
two levels, and the sub-heading is gone. A section that genuinely needs
grouping is two sections. `.ns-trainingnav__module` is renamed
`__section` throughout — CSS, both templates, the docs demos and
`assets/js/training.js`, whose own prose now says sections and lessons too.

**The content was paying for three constraints at once.** The reading column
was capped at `--container-narrow` (56rem), centred inside a cell already
~60rem wide, *and* padded with `--gutter-lg` on both sides. Measured before:
~150px of dead page on each side. Now the cell is the column —
`--container-page` as a ceiling, ordinary `--gutter` for the inset — and the
dead space is **25px a side**. Body copy is unchanged, because `.ns-prose`
caps its own paragraphs at the measure; what got wider is everything that was
always short of room.

**The table of contents did not exist on the two viewports most people read
on.** It had been a third column, which is the first thing lost on a laptop
and impossible on a phone. It is now a disclosure at the top of the article:
one row closed, in the reading column, so it exists at every width — the same
`<details>` on a phone as on a desktop rather than a column plus a fallback
that drifts. Verified at 390px: 22px closed, 158px open with every heading.

The first version of that shipped `open` with a comment claiming it closed
below md. CSS cannot do that — `open` is an attribute and no media query
removes one — so rather than reach for a script or a `display:none` hack that
leaves the caret lying about its own state, it is closed everywhere and the
comment now says so.

### Added — a Ghost family, in its own file

The CMS-side components now live together in `components/css/ghost.css` and a
new **Ghost** family in the styleguide — ten pages. They were briefly spread
across two files that have nothing to do with the CMS: `content.css` is
"things that interrupt prose" and `training.css` is "a curriculum". The gate
in particular was written as a *training* idea (Pro modules) when it is really
Ghost's members gate wearing a curriculum's clothes; it moved and was retitled
**Members gate**.

New alongside the moved cards:

- **Membership tiers** (`.ns-plans`) — three columns, a monthly/yearly switch,
  and a price that changes when you flip it. Distinct from Training's Free-vs-Pro,
  which is a two-column argument with no prices and no billing period. The
  yearly saving is a *number*, never "save up to 20%" — a percentage the
  reader has to apply to a figure they have not seen is a discount nobody can
  evaluate. A tier the member already holds sets `data-state="current"`, which
  disables its action rather than hiding it.
- **Member status** (`.ns-memberbar`) — who Ghost thinks you are and what that
  gets you. A bar, not a card, because it is chrome *about* the page. Three
  states and no more: signed out, free, paid.
- **Button card** and **Audio card** — the two remaining Koenig cards that had
  no home. The audio card prints its duration rather than making you press
  play to find out, because "is this two minutes or forty" is what decides
  whether anyone presses it.

The trailer gate keeps its argument: the mask is on the teaser, not an overlay
over it, so the withheld text is genuinely absent from the DOM rather than
covered by a div a reader can delete in devtools.

One bug fixed on the way: `.ns-plans__switch` is a flex container, and the
fieldset inside it inherited `align-items: stretch` — which dragged the
segmented control to the full height of the row and rendered the two options
as tall columns.

### Added — the Ghost Koenig card set, restyled

Ghost's editor lets an author drop a **product**, a **bookmark**, a **file**, a
**header** or a **members CTA** into a post. Those cards ship with Ghost's own
default styling — a rounded, shadowed, 16px-radius object that lands in a
Namaste post like a visitor from another design system. These are the same
five cards rebuilt on Principle 1: a 1px border does the structuring, the mono
voice carries every piece of metadata, and one signal colour marks the one
action.

The class names match Koenig's data model rather than inventing new words
(`product`, `bookmark`, `file`, `header`, `cta`), so the Ghost theme's
rendering layer maps card → class with no translation table. Body copy in all
five takes `--size-prose-small`, the same rule every other content block
follows.

Decisions worth naming:

- **Product** — the rating is stars *plus* the number, and the number is real
  text; five glyphs alone is a value nobody can read out. Empty stars are a
  different glyph, not a lighter colour, so the score survives grayscale. With
  no image, `:has()` drops the media column instead of leaving a grey hole.
- **Bookmark** — the whole card is *one* `<a>`. A separately clickable title
  and thumbnail is two tab stops to the same URL. The excerpt clamps to two
  lines: a bookmark is a signpost, and a four-line excerpt is the article
  arriving early.
- **File** — the size and extension are printed, not hidden. They are the two
  facts that decide whether someone taps a download on a phone, and Ghost
  already collects both.
- **Header** — the one card allowed to break the reading measure, because that
  *is* its job: it is a chapter break, not a paragraph. `--dark` uses the same
  console navy as a section band.
- **Members CTA** — a leading-edge block rather than a boxed panel, because it
  is an aside from the *publication* rather than part of the argument.

One bug found while building them: the favicon slot borrowed `.ns-ph`, the
media placeholder, which sets `min-block-size: var(--space-12)` — stretching a
1rem favicon into a 48px bar. A 16px square needs a 16px placeholder.

### Changed — the assembly is a website in a browser window

The illustration now renders inside a light Chrome window with an address bar,
and each component label sits in **the slot its component will render into** —
`nav.cmp` where the navbar goes, `card.cmp` where the cards go — cross-fading
into that component in place. A version where the files drift in from the
corners says "components exist"; this one says "*this* component becomes
*that* part of the page", which is the actual claim.

The window is deliberately light on the navy band: it is a picture of a
website, and `--color-on-dark` is a fixed white in both themes, so it does not
quietly become a navy website in dark mode.

### Changed — full-bleed heroes, flush to the bar

`.ns-hero--flush` drops the top padding to the bar's own breathing room and
squares the corners, and the design system's homepage hero moved **out of**
the page's 72rem `.wrap`. A band is full-bleed by definition — its own
`__inner` does the centring — so nesting it in the wrapper gave the navy a
white margin on both sides and a gap under the sticky bar, which reads as a
rendering mistake rather than a design. Measured after: `gap: 0`,
`left: 0`, width == viewport.

### Changed — the assembly is now two acts: files, then render

The illustration tells the system's argument instead of just showing its
parts. **Act 1**: five component *files* — `nav.cmp`, `hero.cmp`,
`button.cmp`, `card.cmp`, `chart.cmp` — scattered across the stage, each
carrying the vector to the centre it collapses along, so they converge rather
than all sliding the same way. **Act 2**: they cross-fade into what they
render — a miniature homepage with a navbar, a hero carrying two real
buttons, and three cards including a chart.

Both acts share one 11s timeline so they cannot drift out of phase, and each
keyframe's 0% is its resting state, so under prefers-reduced-motion the guard
leaves the finished homepage with the files at rest beside it — a legible
still, not a blank stage.

### Changed — the training post is two columns, not three

The in-page outline column is gone and the content takes the full container.
A post already carries its structure in its headings, and a third column of
navigation-about-navigation cost the tables, code blocks and video stage the
width they actually needed. `.ns-training__aside` and its rules are deleted
rather than left orphaned.

Two more marks in the rail: **the module** now carries a glyph — it was the
last level with none, so "Objects and fields" sat as bare text between a track
with a tile and posts with icons, and read as a gap rather than a top level —
and **every section opens with its own Overview row**, the page that
introduces the section before its posts, set apart by a quieter icon and no
time, since "how long is the introduction" is not a question anybody has.

Caught while removing the aside: a stale `@media (max-width: 79.999rem)` block
still set `grid-template-columns: var(--ns-trail-w) minmax(0, 1fr)`, which
would have flipped the rail back to the **leading** edge on every viewport
under 1280px — the exact opposite of the layout's whole argument.

### Added — `.ns-assembly`, and an animated hero

The hero illustration that is not an illustration. Its pieces are this
system's own primitives — a bar, a rail, a card, a chart, chips, an avatar —
arranged into a miniature of the product they build and animated arriving. A
*drawn* picture of "our components make this" goes stale the first time a
radius changes; this one re-renders itself when the tokens move.

One keyframe, two custom properties per piece (`--_fx`/`--_fy` say where it
comes *from*) and a per-piece delay, so the group assembles as a wave rather
than a snap. The keyframe's **assembled state is its resting state**, which is
why it runs assembled → scattered → assembled: under prefers-reduced-motion
the global guard leaves the finished composition rather than a scattered one.

`.ns-band--grid-live` drifts the hairline motif one cell every twenty seconds
— slow enough that nobody reading the headline notices it moving, fast enough
that the band is not a flat image. Both homepages now use a `--split` hero
with the assembly in the media slot.

One bug worth naming: `.ns-assembly__avatar` collapsed to a 0×0 box because
`inline-size`/`block-size` do not apply to a non-replaced **inline** element,
and it was a bare `<span>`. The dots and lines elsewhere get away with it only
because they are flex items, which the box tree blockifies for them.

### Added — every component page links to its own full-page demo

The forward link is now *derived* rather than written: each `DEMOS` entry
already names the component page it belongs to (`back`), so the link is that
relationship read the other way round. It therefore exists on **every** page
that has a demo, not just the three where somebody hand-wrote one. Add a
`DEMOS` entry and the link appears; delete it and the link goes.

### Changed — the training UI, rebuilt

The rail, the post head and the reading layout were redesigned rather than
adjusted. What changed and why:

- **Three columns, not two.** A post at the reading measure leaves ~14rem of
  empty page beside it on any laptop, and what belongs there is the one piece
  of navigation the old layout had nowhere to put — where you are *inside* the
  post. `.ns-training--doc` is **aside / article / curriculum**: the leading
  edge, where the eye starts every line, goes to the outline of the thing you
  are reading, and the curriculum sits on the trailing edge as the place you go
  *next*. That is the deliberate difference from the course player, which puts
  its playlist on the leading edge because you are working *through* it. The
  rail is 20rem — at 17rem the third level of nesting had ~11rem left and every
  other row wrapped. The aside is built by
  `assets/js/toc.js` from the article's own headings, so the outline cannot
  drift from the text. Below 80rem the aside drops; below 64rem the rail
  becomes a drawer from the same edge it lives on.
- **The rail's spine moved from the rows to the list.** Forty rows each drawing
  the same 2px border meant the current one was distinguished by colour alone.
  Now one hairline per section with the rows tucked against it, which frees the
  current row to take a tinted, rounded slab — a tint *plus* a leading edge
  *plus* the weight change, so it survives grayscale and forced colours.
- **Every level carries a mark.** The track is a card with a tile and its
  position rather than a caption; a module shows a caret, a count and its own
  progress meter; a section label leads with a glyph for its job — concepts,
  practice, reference — and runs a rule out to the rail's edge; a post row
  leads with its KIND icon. A rail where a lab and a two-minute concept note
  look identical is a rail nobody can plan against.
- **The post head answers three questions it used to be silent about.**
  `.ns-tmeta` is a row of icon-led chips — kind, duration, position, level,
  read-state — and the kind chip is the only one allowed to carry brand.

### Added — a training post is video OR article

`.ns-tstage` is the one block that differs between them: a `.ns-video` frame
plus a bar carrying captions, the transcript note and a real anchor down to
the writing. A training video that is not also written is not searchable, not
skimmable and not linkable to a line, so the written version always stays
underneath.

The claim "the difference is one block" is now *proved* rather than asserted:
`fragment()` in `build-preview.mjs` takes a `strip` list of named regions, and
the two demos — `demo-training-post` and `demo-training-article` — are rendered
from **one** template with the other version's stage and kind chip cut. A
near-duplicate 250-line template would have started drifting the day it landed.

### Added — the training post page, and three real bugs it surfaced

`templates/training-post.html` is the third training surface — the index
orients, the module page lists, and this one *reads*: a fixed rail with a
working filter beside one article at the reading scale, with position,
references and a module-aware pager. It is the first template to exercise
`.ns-training--fixed` and `assets/js/training.js` end to end, and doing so
found three defects that had never been rendered before:

- **The fixed grid never scrolled.** Its single row was implicit, so it grew
  to the tallest item — a 3,000px article stretched the row past the grid's
  own fixed height and the grid clipped it, instead of the columns scrolling
  inside. Now `grid-template-rows: minmax(0, 1fr)`, with both cells pinned to
  row 1 (auto-placement was putting the rail and the main column on separate
  rows), and the main cell carries `block-size: 100%; min-block-size: 0` —
  relying on `overflow: auto` to zero a grid item's automatic minimum size
  does not survive contact with a browser.
- **The drawer never opened below lg.** The off-canvas `translate` was
  declared in a selector list alongside a `.ns-training--nav-start` branch,
  and a list is weighed by its most specific branch — so the off-canvas state
  tied the `[data-rail="open"]` rule meant to undo it and won on source
  order. The translate pair now stands on its own.
- **The sticky filter head had a see-through slot above it.** A sticky child
  pins to its scroller's content edge, so the rail's top padding became a gap
  with rows scrolling visibly through it. The rail's block-start padding is
  gone and the head spans the full width, gutters included.

Also new: `.ns-training__handle`, the drawer's open control, for a training
page whose bar carries no `.ns-panelbar` — hidden wherever the rail is
already a visible column. `assets/js/training.js` now loads on the generated
pages, so the filter and drawer are live in the styleguide rather than
documented and inert.

### Added — two front-door templates and a "Homepage & pages" section

`templates/homepage.html` is the learning site's canonical homepage — split
hero → trust → method → path → courses → training tracks → stats → pace →
voices → FAQ → CTA — and `templates/training-index.html` is the
curriculum's front door, led by search. Both render as full-page demos
(`demo-homepage`, `demo-training-index`), and a new styleguide section
documents the compositions band-by-band with the question each band
answers, plus the rules of composition (one dark band opens, one closes;
the middle is merchandise; every stat is checkable; one CTA, always last;
cut from the bottom, never the middle).

### Fixed — the deployed homepage's wordmark rendered at 400

`build-site.mjs` set `font-weight: var(--weight-bold)` — a token that does
not exist in the ramp, so the declaration silently resolved to nothing. It
is `--weight-heading` now, the hero speaks in the hero component's own
classes, the tiles carry the system's card radius, and a "See it whole" row
links the six full-page demos.

### Fixed — 37 icons were rendering as empty space

`scripts/subset-icons.py` is back in the tree, driven by a new
`@phosphor-icons/web@2.1.2` devDependency, and it takes its glyph list from
`node scripts/check-icons.mjs --list` — so the gate that fails the build and
the generator that satisfies it read "what is used" from one implementation.
All 37 previously missing glyphs now come from the real font.

`icons/icons-gap.css` is **deleted**: 31 of those glyphs were being covered by
hand-drawn inline-SVG masks kept in sync with Phosphor's grid by eye. One
source for icons again, and the subset got *smaller* (14.5KB → 13KB) because
the old one carried glyphs nothing referenced.

`check-icons.mjs` now fails the build, and no longer reports `ns-ph--sm` — a
size modifier on the placeholder — as a missing icon.

### Added — `--leading-snug`

`1.45`, the step the ramp was missing between `--leading-heading` (1.3) and
`--leading-body` (1.6). For multi-line UI text that is scanned rather than
read: card excerpts, TOC entries, clamped descriptions. `--animate-*` and the
`leading-snug` Tailwind utility are emitted with it.

### Changed — reading surfaces read at the reading size

Callouts, comment bodies, references, notices, author bios, checklists,
comparisons, glossaries and `.ns-code` blocks *inside* `.ns-prose` moved from
`--size-small` (13px) to `--size-prose-small` (15px). All of them sit inside a
17px reading column, where 13px is two steps down and reads as a footnote the
eye skips. Scanned surfaces — card excerpts, post meta, archive rows, admin,
player chrome — are untouched.

Every mono run that was borrowing `--size-small` now uses `--size-mono`. Same
computed value, correct name.

### Fixed — a hero could render smaller than a heading on a phone

`--size-display`'s clamp floor was `2rem`. Below a 690px viewport the fluid
term fell under 40px, so a 360px phone rendered a display heading at 32.7px —
smaller than the fixed `--size-h1` beside it and level with `h2`. The floor is
now `2.5rem`, which is `--size-h1`.

### Changed — no `@keyframes` in `tokens/`

`fade-up`, `marquee` and `ns-float` moved to `components/css/motion.css`. Two
of the three carried no `ns-` prefix, and a keyframe name is global and
unlayered — a consuming app with its own `fade-up` won or lost on source
order. `marquee` is now `ns-marquee-scroll`. Two byte-identical duplicate
pairs collapsed: `fade-up`/`ns-fade-up` → `ns-anim-rise`, and
`ns-fade-in`/`ns-anim-fade` → `ns-anim-fade`.

`--animate-fade-up` keeps its utility name and now resolves to `ns-anim-rise`.

### Fixed — `check-markup.mjs` had five blind spots

It read class names out of CSS comments (which is where the phantom
`.ns-blog-` came from), could not see classes composed in a template literal,
in a React expression, or in a `.js` rendering helper, and called a block root
with no declarations of its own a typo. The undemoed count went 169 → 37, and
every remaining entry is real. New: `--list` mode, and a `used-by: <product>`
annotation for classes the other two products render and this repo does not.

### Added — nine training component pages

The training hero, learning path, tiers, content gate, contributors, pager,
curriculum position, thumbnail and layout all shipped CSS with no page. Plus
the date picker's popup anatomy, and variants for the modifiers that had none
(`--accent` and `--block-sm` buttons, success/error banners and toasts, the
skeleton card, table cell utilities, the card shelf, the logo marquee).

### Changed — the hairline grid is one value

`--ns-gridlines-image` / `--ns-gridlines-ink` / `--ns-gridlines-cell` in
`patterns/patterns.css` replace ~21 hand-copied gradient declarations across
the specimen cards, which had drifted to four alphas and six cell sizes for
what everyone believed was one grid. Exposed as a value rather than only a
class because most copies live in a `::before`.

### Fixed — 30 specimen cards were framed at the wrong height

`@dsCard viewport="WxH"` had drifted badly in both directions — one card
declared 1180 and rendered 2498. Every card was measured and corrected, so the
styleguide no longer frames specimens with a scrollbar or a band of dead
space.

### Fixed — comments that contradicted the code

`tokens/base.css` and `scripts/build-tokens.mjs` both said 450 was the reading
weight and pointed at two files that argue the opposite; it is 400.
`tokens/layout.css` described `--container-prose` as 68 characters of *Inter*
at `--size-body`, a face this system does not ship and a size articles no
longer use. `tokens/effects.css` claimed nothing interactive may use
`--duration-slow` while `.ns-video--zoom` did; the contract now draws the line
where it actually falls, between a gesture and a response.

### Changed — bands consume the semantic spacing scale

`.ns-band` and `.ns-hero` take `--stack-lg` rather than raw `--space-16`. The
two variants that sit off the scale say so at the call site.

## [3.0.0]

### Changed — BREAKING: the component layer is `ns-components`, not `components`

Every rule in `components/css/**` moved from `@layer components` to
`@layer ns-components`, and `styles.css` now opens with an explicit order:

```css
@layer theme, base, ns-components, components, utilities;
```

Two things this fixes, both of which were silent:

- A consuming app's own `components` layer used to collide with ours, so which
  one won depended on import order rather than on intent. Now the app's layer
  is above ours by declaration.
- There was no `utilities` layer at all for a standalone consumer, so "a
  utility always beats a component default" was true only by accident.

**If you consume `dist/nsds.css` and never wrote `@layer` yourself,
nothing changes.** If you did put your own CSS in `@layer components`, it now
beats the design system where it did not before — which is what you wanted.

### Fixed — a Tailwind utility now actually beats a `.ns-*` default

Three stylesheets sat outside any layer, and an unlayered rule beats *every*
layered rule regardless of specificity — so each of these outranked the whole
of Tailwind:

- `icons/phosphor.css` — `.ph { font-family: "Phosphor" !important }` and
  `display: inline-block` made `font-*`, `flex` and `hidden` no-ops on every
  icon in the system. The `!important`s are deleted (`.ph` and `.ph-fill` are
  never used on the same element, so they never competed) and the file is
  imported with `layer(ns-components)` rather than edited, since it is
  generated.
- `icons/icons-gap.css` — layered alongside it, in the *same* layer, because
  it overrides `phosphor.css` purely by source order.
- `patterns/patterns.css` — `.ns-pattern > * { position: relative }` blocked
  `absolute` and `sticky` on every child of a pattern container.

Also moved: the `prefers-reduced-motion` guard in `tokens/effects.css` into
`@layer base` (an `!important` still beats any normal declaration from any
layer, so the guard is unchanged in effect), and `color-scheme` out of
`tokens/colors.css` into `tokens/base.css` — it is a real declaration, and
unlayered it outranked Tailwind's `scheme-*` utilities.

`scripts/check-cascade.mjs` now fails the build on any unlayered rule or any
undeclared `!important`, so this cannot come back.

### Fixed — BREAKING: `text-label` is the label TYPE again; the colour is `text-label-ink`

Tailwind resolves `text-*` against both `--text-*` and `--color-*`, and the
colour wins. So while the bridge exported `--color-label`, writing
`text-label` produced the label *colour* and silently dropped the kicker's
tracking and weight — exactly the half-applied kicker that the `--text-label`
token, with its `--letter-spacing` and `--font-weight` companions, exists to
prevent.

The Tailwind alias is now `--color-label-ink`, matching the `-ink` suffix this
file already uses for status text colours. **The CSS custom property
`--color-label` is unchanged**; only the utility name moved:

| before | after |
|---|---|
| `text-label` (gave a colour) | `text-label-ink` |
| `text-label` (wanted the type) | `text-label` — now correct |

`scripts/build-tokens.mjs` refuses to emit any `--text-x` / `--color-x` pair
from now on.

### Added — the token bridge is complete; 12 tokens had no utility at all

Eleven tokens were defined in `tokens/*.css` and never emitted into
`tokens/tailwind.css`, so from Tailwind they simply did not exist. That does
not stop anyone using the value — it makes them write an arbitrary value
instead, and **an arbitrary value is a token nobody can find, audit or
change**. The styleguide had accumulated 117 `text-[11px]`, 23 hand-tuned
`tracking-[…]` in three near-duplicate flavours, and a body weight that could
not be reached at all.

Now bridged: `text-fine`, `text-mega` (with its solid leading and tracking),
`tracking-tight`, `tracking-wide`, `tracking-mega`, `leading-mega`,
`font-body`, `font-body-strong`, `font-label`, `shadow-brand`, `shadow-focus`.

`--weight-body: 450` is the one worth calling out. 450 (Book) is the *reading*
weight — `fonts/README.md` explains why 400 is not — and it had no utility, so
any component authored in Tailwind rendered body copy a half-step light with
nothing in review to show for it.

Also added, and it is a genuine second token rather than an oversight:

- **`text-data`** — the same 11px as `text-label`, deliberately *without* the
  weight and tracking. Two roles share one size and are not interchangeable: a
  kicker is a shouted eyebrow that must arrive whole (Principle 2), while mono
  data — a token name, a value, a count, a timestamp — is quiet by definition
  and reads wrong bold and tracked. The component layer had always used
  `var(--size-label)` plainly for exactly this (`.ns-tag`, `.ns-badge`,
  `.ns-footer__head`); only the bridge forced the two together.

`scripts/build-tokens.mjs` now fails the build if any `--size-*`,
`--tracking-*`, `--leading-*`, `--weight-*` or `--shadow-*` token has no
matching Tailwind key, so the bridge cannot fall behind the tokens again.

### Not adopted — SLDS ink values, and why

The SLDS neutrals and status inks were evaluated against this system's actual
surfaces and **rejected on contrast**. Every candidate is worse than what is
already here, and two fail WCAG AA on `--color-surface-sunken`:

| token | current | SLDS candidate | on sunken |
|---|---|---|---|
| `muted` | 6.87:1 | `#706E6B` — 5.08:1 | 4.69 |
| `success-ink` | 6.57:1 | `#04844B` — 4.76:1 | **4.40 — fails** |
| `warning-ink` | 6.80:1 | `#B25E00` — 4.67:1 | **4.31 — fails** |
| `error-ink` | 6.77:1 | `#BA0517` — 6.73:1 | no gain |

The reasoning already in `tokens/colors.css` — that `#5c5a57` is "the exact
grey people mean when they say a page looks washed out", at 6.87:1 — holds.
Shadow-based elevation, pastel status fills, additional hue families and
300–500ms motion were likewise not adopted: they revoke Principles 1, 3 and 5.

### Added — `dist/nsds.tailwind.css`

A second bundle: Tailwind v4 + the design system, correctly layered, built
from the new `tailwind.entry.css`. Every page in this repo loads it, which is
why a Tailwind class now works on the styleguide.

**Ghost and the Next.js LMS should NOT switch to it** — they bring their own
Tailwind and their own content globs, and this bundle would give them a second
preflight and a second copy of every utility. Keep importing the three pieces
separately as documented in INTEGRATION.md.

The token bridge is safelisted in it, so `bg-brand-700` and `p-card` exist
whether or not this repo happens to use them yet.

### Added — components that were inline-styled are now real classes

Nine components stopped styling themselves with `style={{}}` objects and now
render `.ns-*` classes, which means the Ghost theme can render them for the
first time. The debt count in `npm run check` went from 22 to 11.

- New CSS: `.ns-badge`, `.ns-chip`, `.ns-logo`, `.ns-stepper`,
  `.ns-footer__blurb`, `.ns-footer__social`, `.ns-kicker--center/--light`.
- Adopted existing CSS that had been written for them and never used:
  `AvatarRing` → `.ns-avatar-ring` (whose comment already said "the AvatarRing
  React component renders this markup"), `Hero` → `.ns-band` + `.ns-hero`,
  `Footer` → `.ns-footer`, `TableOfContents` → `.ns-toc`.
- New Handlebars snippets: `templates/{badge,chip,kicker,avatar,logo,stepper,table-of-contents}.html`.
- `CodeBlock` and `CodePanel` are now thin shims over `SyntaxHighlighter`,
  which is what their own deprecation notice had said to use since they were
  written. `CodePanel`'s per-panel light/dark toggle is gone: the code surface
  follows the page theme, because a panel that stays light on a dark page is
  the one thing on screen ignoring the reader's setting. `defaultTheme="dark"`
  still forces the navy console.

Prop changes on the converted components: `Chip.size` and `AvatarRing.size`
take `"sm" | "md" | "lg"` instead of a pixel number (a lockup that can be any
height is one neither product can match); `AvatarRing` gains `progress`;
`Hero.stats` is replaced by `proof`.

### Fixed — site integrity

- `guidelines/brand-logo-lockups.card.html` rendered completely unstyled on
  the live site: it linked `../../styles.css` from one directory deep, and
  loaded `../../_ds_bundle.js`, a file that does not exist anywhere in this
  repo. Rewritten as static markup like the other 41 cards, with no React,
  Babel or CDN dependency.
- `templates/*.html` are fragments for a Ghost site served at *its* root, so
  their `/assets/...` paths 404'd on every `demo-*.html` page. The demo writer
  now rewrites them at render time; the shipped fragment stays correct for its
  real consumer.
- `templates/navbar-course.html`'s curriculum toggle pointed
  `aria-controls="player-rail"` at nothing. The rail in
  `templates/course-player.html` now carries that id, and the demo composes
  the two.
- `scripts/check-links.mjs` walks the built `_site/` and fails on a broken
  relative path, a root-absolute *asset*, a duplicate id or a dangling
  `aria-controls`. Wired into `gulp site`.

### Changed — the styleguide is authored in utilities

All 23 `guidelines/*.card.html` specimens dropped their local `<style>` blocks
in favour of Tailwind utilities (~430 lines of CSS deleted). Literal hex in the
palette cards stays inline — those values *are* the documentation.

`brand-content-creation/`'s poster cards keep their CSS on purpose: keyframe
animations and `.dark`/`.light` variant descendants where the CSS is the
artwork, not a layout helper.

<!-- The entries below were written under a second [Unreleased] heading and
     shipped in 3.0.0 — the heading was never folded in when 3.0.0 was cut.
     They are part of [3.0.0] above. -->

### Added — Blog, as its own family

The writing half of the product now has a section of its own, sharing
everything it can with the rest of the system: `.ns-prose` is still the
reading surface, `.ns-card` the frame, `.ns-strip` the shelf, and
`.ns-lprogress--article` the reading line — the same control on a lesson and
on a post, so it has one implementation. New stylesheet
`components/css/blog.css`; wiring in `assets/js/blog.js`.

- **Post card** (`.ns-bcard`) — five shapes over one anatomy: default,
  `--row`, `--wide` (the one featured post), `--minimal` (no cover, for a
  sidebar), `--overlay` (title on the image, scrimmed). Cover with the
  category riding it, balanced title, two-line clamped excerpt, and an
  explicit **empty-cover state** — most posts have no art, and saying so with
  the system's glyph beats a grey rectangle pretending an image failed.
- **Post header** (`.ns-posthead`) — five versions, same parts in the same
  order: default/centred, `--cover`, `--wide`, `--minimal`, `--console`. The
  **standfirst** is one sentence saying what the piece argues, not the first
  paragraph repeated.
- **Post meta** (`.ns-postmeta`) — author · date · reading time, identical on
  the card, in the header and in the footer, so a reader learns it once.
- **Post layout** (`.ns-post`) — TOC rail | article | share rail. Both rails
  are droppable (share below 80rem, TOC folds to a `<details>` below 64rem)
  and the article column never widens to fill the space they leave: the
  measure is the point of the page.
- **Table of contents** (`.ns-toc`) — a real `<nav>` of real anchor links
  that works with JS off. `assets/js/blog.js` adds a scroll-spy that marks
  the current section with `aria-current`, and will build the outline from
  the article's own h2/h3 (adding ids where they are missing) when given
  `data-toc-from`. Deliberately a rAF-throttled scroll read rather than an
  IntersectionObserver: the question is "which heading did I last pass",
  which an observer cannot answer when a section is taller than the viewport.
- **Callout** (`.ns-callout`) — note / tip / warn / danger. A 3px leading
  edge and a tint, never a heavy box. The WORD is the signal and the colour
  only agrees with it.
- **Series** (`.ns-series`), **author box** (`.ns-authorbox`), **post nav**
  (`.ns-postnav`, prev/next by title), **listing** (`.ns-blog-listing`,
  `.ns-blog-grid`, `.ns-blog-archive`).

Two page templates: `templates/blog-post.html` and
`templates/blog-listing.html`, both with full-screen demos in the styleguide.

### Changed — the shelf is a shared primitive

`.ns-strip` moved to `components/css/display.css`: the scroll-snapped shelf
is not a course-specific object, and the blog renders the identical one.
`.ns-course-strip` is kept as an alias so existing markup does not break.

### Fixed — a strip no longer widens the column it is dropped into

`grid-auto-columns: minmax(14rem, 1fr)` is a **definite** track minimum, so
four cards gave the shelf a 944px min-content that propagated up through its
ancestors — a related-posts strip inside a 42rem reading column dragged the
author box and the prev/next row out with it, past the share rail. Both
strips now use `minmax(min(14rem, 100%), 1fr)`, the same resolvable-minimum
idiom the card grids already used.

### Changed — the default button is smaller

**Visual change in both products.** The default `.ns-btn` carried a
`--size-body` label at 40px tall, which is visually larger than the card
title it usually sits under — the most common proportion bug in a design
system. The default now carries a **`--size-small`** label with tighter
padding. The touch target is untouched: `min-block-size` is still
`--target-comfy` (40px). Height is the accessibility property, type size is
the typographic one, and they are now set independently.

The size scale is four steps plus one: `--xs` (28px, mono/uppercase, for a
dense inline control with a larger sibling beside it), `--sm` (32px), the
default (40px), `--lg` (44px), and `--xl` (52px) — which exists for exactly
one thing, the single primary action in a hero.

New button variants: `--soft` (a brand tint between outline and primary, for
a secondary action an outline loses), `--pill`, `--block-sm` (full width on a
phone only), `--swap` (two labels in one grid cell, so a toggle does not
change width when it flips), `.ns-btn__arrow` (a trailing arrow may travel
2px — the arrow doing its job, not a lift), `.ns-btn__count`,
`.ns-btn__kbd`, `.ns-btn-group--pill`, `.ns-btn-group--block`, and a generic
`[aria-pressed="true"]` toggle state.

### Fixed — `[hidden]` now actually hides

The attribute's `display: none` lives in the UA stylesheet and loses to any
author rule, so every component that set its own display (`.ns-btn` is
`inline-flex`, `.ns-filters__applied` is `flex`) silently ignored it — a
"hidden" button sat there fully visible. `tokens/base.css` now declares
`[hidden] { display: none !important }`. This is the one place `!important`
is correct: it is not a style preference, it is the meaning of the attribute.

### Added — the LMS layer, properly

**Course card** (`.ns-ccard`) — five shapes over one anatomy (default,
`--row`, `--compact`, `--featured`, `--minimal`), plus corner flags, the
runtime chip on the media, a play affordance, and the **lesson peek**: the
first few lessons expand on hover *and on keyboard focus*, as real DOM
content collapsed with a `grid-template-rows` transition rather than
`display: none`, so find-in-page reaches it — and simply open where hover
does not exist.

**Small parts** — `.ns-rating` (the number is the content, the stars are a
clipped overlay), `.ns-authors` (an avatar stack capped at four then a
count), `.ns-price` (current and struck prices at deliberately different
sizes), and `.ns-ltype`, the lesson-type identifier: video, article, quiz,
lab, live, download, always icon **plus word**.

**Curriculum** — rebuilt on native `<details>`, so collapse, keyboard
operation and in-page find come from the platform. Adds a toolbar with
totals and expand/collapse-all, per-section completion, and three looks:
`--timeline` (a connector with state dots), `--compact`, and rows carrying
stills. Lesson rows gained `__body`/`__sub` (a second line for the type and
duration), `__thumb`, `__badge` ("Preview"), and `--compact` / `--roomy`.

**Lesson navigation** — prev/next by NAME, with a still or the type glyph, a
locked state that still navigates (to the upgrade page), and a way back to
the full list. Below 48rem the thumbs and progress row are dropped, not
shrunk: the two named buttons *are* the navigation on a phone.

**Course player** — `.ns-player--fixed` locks the player to one viewport: the
page stops scrolling and the two columns scroll independently, with the
stage sticky and capped at `62dvh` so the lesson title never lands below the
fold. Padding through the column dropped from `--pad-card-lg` to
`--pad-card`. Below lg it reverts to the scrolling variant automatically.

**Per-type lesson progress** (`.ns-lprogress`) — `--video` (elapsed/total
with chapter ticks), `--article` (a 2px reading hairline, no widget),
`--quiz` (pips plus the score). One bar for all three is how a quiz ends up
claiming you are 60% *correct* when you are 60% *finished*.

**Course hero** (`.ns-chero`) — five versions over one anatomy: `--split`,
`--cover`, `--video` (a muted loop, hidden under `prefers-reduced-motion`,
which leaves exactly `--cover`), `--minimal`, `--console`. The scrim on the
image versions is not optional: text over an arbitrary photograph has no
contrast guarantee.

**Enrol card** (`.ns-buybox`) — sticky in the rail, and `--bar` as a fixed
bottom bar on a phone with `env(safe-area-inset-bottom)` respected.

**Filter rail** (`.ns-filters`, `.ns-range`) — facet groups as `<details>`, a
dual-thumb price range built from two real `<input type="range">` (clamped,
never swapped), and the applied set echoed as removable chips. Everything is
a native form control, so the page filters with JavaScript off.

**Also**: `.ns-testimonials`, `.ns-instructor`/`.ns-instructors`,
`.ns-outcomes`, `.ns-share`, `.ns-course-strip` (scroll-snapped related
courses), `.ns-course-listing` (rail + grid), and `.ns-panelbar__line`.

New stylesheet `components/css/catalog.css`; `components/css/lms.css` and
`player.css` substantially extended. Wiring in `assets/js/lms.js` — all of
it progressive enhancement.

### Added — sections leave room for the action

`.ns-band__actions` is a slot: a band no longer defines its own button, the
page puts one in it at whatever variant and size that page needs. Baking the
action into the section is how a system ends up with six section components
that each hard-code a differently-sized button — and why buttons drift out
of proportion with the cards beside them. `--between` puts the head and the
actions on one line. `.ns-band--collapsible` folds a secondary section on
native `<details>`.

### Changed — body copy is 450, and the reading ink is darker

**Visual change in both products.** N&M Text's true Regular renders *grey*
rather than black at 16px, which is the single most common complaint about a
Nunito-derived face. Three changes fix it together:

- **`--weight-body: 450`** ("Book") is the new reading weight, applied on
  `body` in `tokens/base.css`. `--weight-regular` (400) survives for dense UI
  furniture — table cells, meta rows — where light *is* the intent.
  `--weight-body-strong: 600` is the new inline `<strong>`: against Book,
  700 is a shout.
- **`-webkit-font-smoothing: antialiased` is now dark-mode only.** Forcing
  greyscale antialiasing globally strips roughly a quarter-step of apparent
  weight off every glyph on macOS. On the navy console surface the trade
  flips and it stays.
- **`--color-muted` darkened** `#706e6b` → `#5c5a57`: 4.93:1 → 6.87:1 on
  white, 4.6:1 → 6.34:1 on the sunken surface.

Also added: `--size-mega`, `--size-fine`, `--tracking-mega`, `--tracking-wide`,
`--leading-mega`, `--measure-prose` (68ch), `--measure-narrow` (46ch),
`--duration-slow`, `--duration-draw`, `--ease-draw`, and the nine
`--color-code-*` syntax roles (light + dark). `h1`–`h6` now carry a default
weight and leading in the base layer, and `time`/`output`/`.ns-num`/
`[data-numeric]` get `tabular-nums` automatically.

### Added — SyntaxHighlighter, the code surface

A real code block: title bar with the file name, copy / ask-AI / share / wrap
actions, line numbers, diff-marked lines, and a footer whose one job is Run.
Three chromes — `block`, `--mac` (traffic lights, centred title), `--vscode`
(tab strip + brand status bar) — differ **only** in the bar.

- `components/css/code.css`, `components/core/SyntaxHighlighter.jsx`,
  `components/core/highlight.js` (the shared tokenizer — one implementation
  for React, the styleguide generator and any server), `assets/js/code.js`.
- Highlighting happens at **build time** and maps any grammar onto seven
  roles. Adding a language is a keyword list, never a colour.
- Run does not execute anything: it raises `ns:code-run` / calls `onRun` and
  waits for the host to call `done()`.
- The Ask-AI and Share menus are native popovers — light-dismiss, Esc and
  top-layer placement come from the platform, and `position-area` hangs each
  off its own button via the implicit popover anchor.
- **Deprecates `CodeBlock` and `CodePanel`.** Both style themselves inline and
  cannot be rendered by the Ghost theme. They still work; new code should not
  use them.

### Added — typographic effects (`components/css/type-fx.css`)

Highlight, strike, circle, frame, scan line, matrix scramble, line reveals,
display/poster type, drop cap, pull-quote, kinetic strip, circular text
(`<textPath>`), the three link treatments, citations and heading anchors —
plus `.ns-measure`, `.ns-balance`, `.ns-caps`, `.ns-label` and the numeral
utilities. Wired by `assets/js/type-fx.js`, all of it progressive enhancement.

Three rules hold the file together: the effect is never the meaning (struck
text is `<s>`, a highlight is `<mark>`, a citation links to a real footnote);
it draws once; and every "start hidden" state sits inside
`@media (scripting: enabled)` so nothing is invisible when the script is not
there.

### Added — the fonts are an open-source package

`fonts/` is now redistributable on its own: `OFL.txt`, and a full static
family in `fonts/static/` (21 named cuts × woff2 + ttf, plus a ready
`@font-face` sheet) generated from the variable files by
`scripts/build-fonts.py` (`npm run build:fonts`). The script instances each
weight off the `wght` axis and fixes the name table and `OS/2` bits so
installers show a real family menu.

### Removed

- **`typography/`** — the retired first-generation faces (Inter, Space
  Grotesk, JetBrains Mono). Nothing referenced them; `fonts/` is the only
  font directory now. Consumers copying assets into a Ghost theme should copy
  `fonts/` and `icons/` (see `docs/INTEGRATION.md`).
- **The Content design styleguide page** — folded into **Typography**, where
  voice and casing belong. The specimen card (`guidelines/content-design.card.html`)
  is unchanged and now renders on the Typography page.

### Added — Typography is now the whole typographic contract

One page carrying the scale, the reading weight and why it is 450, measure,
numerals, the effects, display/poster type, circular text, links, citations,
anchors, content design, and the typographic accessibility floor — plus a
full-page specimen at `templates/type-specimen.html`
(`preview/demo-type-specimen.html`).

### Added — the navbar, as a family of documented components

The bar had one page and two variants. It is the piece of chrome every
visitor meets first, so it now has its own stylesheet
(`components/css/navbar.css`, split out of `navigation.css`) and five
styleguide pages — Navbar, Nav menu, Account menu, Mobile nav, Theme toggle.

- **The bar** — `.ns-topnav__inner` (width-capped contents), brand lockup with
  a mono tag, `__flag`, `__divider`, `__progress` (reading progress), and the
  surface variants `--transparent` (over a hero, solid on scroll via
  `data-scrolled`, no backdrop blur), `--floating`, `--sunken`, `--compact`,
  `--center`, `--wide`.
- **Announcement bar** (`.ns-announce`) — above the sticky bar, scrolls away
  with the page; `--quiet` for notices rather than promotions.
- **Search affordance** (`.ns-navsearch`) — a button shaped like a field, with
  the ⌘K hint; opens the existing search modal.
- **Dropdown and mega panel** (`.ns-navitem`, `.ns-navmenu`, `.ns-megamenu`) —
  icon/title/description rows, section labels, a foot bar, and at most one
  promo per mega panel. Disclosures, not ARIA menus: the rows are links.
- **Account menu** (`.ns-usermenu`) — avatar trigger, identity block, plan
  chip, trail progress, actions, sign out; `.ns-topnav__auth` for signed out.
- **Mobile** — `.ns-burger` (three hairlines rotating into the close X) and
  `.ns-navsheet`, a full-viewport `<dialog>` with mono-indexed rows, native
  `<details>` groups and a pinned foot.
- **Theme controls** — `.ns-themetoggle` (Light · Auto · Dark radiogroup with
  a `:has()`-positioned thumb, no state class) and `.ns-themetoggle-icon`
  (sun/moon crossfade in place, driven from `data-theme` in CSS).
- `assets/js/nav.js` — the Ghost-side behaviour: it only ever writes
  `aria-expanded` / `aria-checked` / `data-scrolled`, plus Esc-and-return-focus,
  ArrowDown-into-panel, close-on-tab-out, `showModal()` for the sheet, and one
  passive scroll listener. React sets the same attributes from state.
- React renderers in `components/navigation/Navbar.jsx` (+ `.d.ts`) and
  templates `templates/navbar.html`, `templates/navbar-blog.html`, each with a
  full-width styleguide demo (`preview/demo-navbar*.html`).

### Added — the signed-in bars

- **Course bar** (`.ns-coursenav`) — chrome for a page you are *inside*: a
  back control that names its destination, the mono position line, the lesson
  title, a labelled `role="progressbar"` completion meter, and one primary
  ("Complete & next"). No site navigation at all, and a `--dark` twin for a
  player whose stage stays navy. `templates/navbar-course.html`.
- **Dashboard bar** — the site bar with the marketing removed: icons in the
  link row (the case they exist for), a *Continue* menu instead of a mega
  panel, the trail's progress ring on the avatar.
  `templates/navbar-dashboard.html`.
- `.ns-navicon` (+ `__badge`) — the icon-only bar action, with a count badge
  rather than a bare dot, and `.ns-navstat` — one mono metric in the chrome.
- React: `CourseNav`, `NavIcon`, `NavStat`.

### Changed

- **The theme control is a real switch by default** — `.ns-themeswitch`: one
  moving part, a knob sliding along a track carrying the *current* mode's
  glyph. Both the position and the glyph are read from `data-theme` in CSS,
  so they are right in the first painted frame; the visible track is 1.5rem
  and the button around it is a full 2.5rem target. The icon square
  (`ThemeToggle variant="icon"`) and the Light · Auto · Dark segmented form
  both remain.
- **The bars are tighter.** Bar gutter and gap 1.5rem → 1rem, link padding
  and row gaps down a step, dropdown/mega padding and column widths reduced,
  mega columns 13rem → 12rem. Account-menu rows are 2rem with 0.25rem
  padding rather than a 2.5rem touch target each — eight rows at
  `--target-comfy` is a column of air, and these are pointer menus in
  chrome, not a phone keypad.
- **Panels open with a longer, softer move** — `--duration-base` with a
  0.5rem drop and a hair of scale from the top edge; the mobile sheet drops
  in from the bar it belongs to, its backdrop fades with it, and its rows
  arrive in four stagger steps. All of it collapses under
  `prefers-reduced-motion`.
- **GitHub** — `.ns-navstar`, the star pill (a link to the repo; the count is
  mono, divided by a hairline; the words drop below lg leaving the mark), the
  mark itself added to `icons/icons-gap.css` as the one filled glyph in that
  file, and a GitHub row in the resources dropdown and the mobile sheet.
  React: `NavStar`.
- **The bar's search opens the search dialog** —
  `templates/search-modal.html` now answers `[data-ns-search]` as well as
  `[data-ns-search-open]`, and guards against `showModal()` on an already
  open dialog. The navbar demos ship it alongside the bar.
- Marketing bar links carry icons in the shipped template, as an example of
  the option rather than a change to the default.
- **`--navbar-h` is 3.5rem**, down from 4rem — tall enough for a 2.5rem
  control plus its breathing room. Every consumer of the token (sticky
  sidebars, the TOC, the player rail, heading scroll-margin) follows.
- **`ThemeToggle` renders the new icon switch** — default `className` is now
  `ns-themeswitch` and both glyphs are always in the DOM (which one reads as
  current is decided in CSS from `data-theme`). The `showLabel` prop is gone;
  use `ThemeSwitcher` where Auto matters. This moves the control's appearance
  in a consuming product, so releasing it is a **major** bump.
- `components/core/Navbar.jsx` no longer styles itself inline — it composes
  the `.ns-topnav` parts, so the Ghost theme can render it. One entry off the
  known-debt list in `scripts/check-components.mjs` (23 → 22).
- The styleguide inlines `assets/js/theme-init.js` and loads `nav.js`, so the
  navbar demos are operable and the theme controls really drive the page.

### Fixed

- **A closed `.ns-modal` / `.ns-drawer` was rendered in the page flow** —
  same root cause as the sheet below: an author `display: flex` on the base
  rule beats the UA's `dialog:not([open]) { display: none }`, so every page
  that included the search dialog showed it inline, unfocusable, wherever it
  happened to sit in the document. The display switch is now on `[open]`.
- **The link-row rule reached inside the panels** —
  `.ns-topnav__links a` also matched every `<a>` in a dropdown or mega panel,
  giving each row the bar's own 3.5rem height. Scoped to
  `.ns-topnav__links > li > a`.
- A closed `.ns-navsheet` is no longer rendered in the page flow: the
  `display` switch is on `[open]`, since an author `display` beats the UA's
  `dialog:not([open]) { display: none }` whatever the specificity.

## [2.3.0] — 2026-08-11

### Added — the builder's console (admin & creation surfaces)

The system covered the learner side only; there was no vocabulary for the
screens where courses get *made*. `components/css/admin.css` adds it, with
React renderers in `components/admin/` and framework-neutral templates:

- **App shell** (`.ns-admin`) — topbar / side nav / main as one grid, with
  the mono environment tag and a nav of terminal rows (mono indices,
  `aria-current`, counts at the row end).
- **Page head, stat cards, toolbar** — every screen opens with a kicker +
  h1 + actions; dashboard numbers are mono/tabular with worded deltas.
- **Editor layout** — the record on the left, everything *about* the record
  in a sticky rail of hairline boxes; **publish bar** pinned below with the
  save state as a mono timestamp.
- **Creation primitives** — the borderless heading-size **title box**, the
  mono **slug** group, **rich-text chrome** (quiet icon toolbar,
  `aria-pressed` marks), the **curriculum builder** (editable section
  blocks, lesson rows with grip/type/duration, keyboard-first reordering,
  dashed add rows), **dropzone + file rows**, and the chips-in-a-field
  **tag input**.
- Templates + full-screen styleguide demos: `admin-dashboard`,
  `admin-course-new`, `admin-lesson-editor`.

### Added — reusable page sections

`components/css/sections.css` + `components/sections/`: the bands both
products compose pages from — **Band/BandHead/Kicker** (the `//` kicker is
now a component, not a convention), **Hero** with the dissolving hairline
grid, **FeatureGrid**, **StatBand**, **Quote**, **CtaBand**, **Faq** (native
`<details>`), **LogoRow**. `templates/sections-home.html` composes all of
them in canonical order, with a full-page demo in the styleguide.

### Added — bespoke icon set

`assets/icons/namaste-icons.svg`: 20 LMS-specific glyphs Phosphor has no
word for (course, lesson types, roadmap, org, Apex, flow, publish…), drawn
on Phosphor's 24px/1.7-stroke grid so the sets mix in one row. Rendered via
`.ns-icon` (1em, currentColor) or the new `Icon` React component; the
styleguide gains an **Icons** foundations page enumerating the set.

### Fixed — skip link no longer needs a second class

`.ns-skip-link` relied on being paired with `.ns-visually-hidden` to hide
itself; markup using the class alone showed a permanent blue pill in the
page corner. The hidden-until-focus state is now baked into
`.ns-skip-link` itself; the old pairing keeps working.

### Added — interactive admin demos

`demo-admin-course-new.html` and `demo-admin-lesson-editor.html` now carry
demo-only vanilla JS over the real markup: add/rename/reorder/remove
sections and lessons (grip + arrow keys), tag entry and removal, file
uploads that become processed file rows, working rich-text formatting, and
Draft ↔ Published with a live save timestamp. The course-building flow is
testable from the styleguide with no app and no backend; in product the
same behaviour comes from `components/admin/`. A new root **`doc.md`**
lists the owner's action items (Ghost partials, Payload CMS wiring, icon
subset regeneration, Pages deploy).

### Changed — styleguide restructured and polished

- **Pruned:** the four generic "Learn Design System" cards (`learn/`) are
  deleted — education about design systems in general is not part of this
  system's contract.
- **Ordered, not alphabetized:** foundations now read in teaching order
  (Color → Surfaces → Type → Spacing → Layout → Geometry & motion → Icons →
  Charts → Class index) and gallery groups in reading order (Foundations →
  Colors → Type → Brand → Content Creation → Legacy components last). The
  "Z. " / "1. " alphabetical-sort prefixes in card group names are gone.
- **Home page** opens with the system's own vocabulary: a navy `.ns-band`
  hero with the hairline-grid motif and a mono proof line, then a
  `.ns-statband` of the real counts — the styleguide now demos the section
  components by being built from them.
- **Micro-interactions**, all inside the motion principles (120–180ms,
  ease-out, no lift): staggered fade-up page entrance (collapses under
  `prefers-reduced-motion`), hover border-brighten on swatches and specimen
  frames, transitions on sidebar links, and **click-to-copy on every token
  and class name** with a brief "copied" state in success ink.
- Dark `.ns-band--grid` bands draw their hairlines from
  `--color-on-dark-wash` — `--color-grid` is picked against the light
  surface and vanished on navy.

### Fixed — icons were broken almost everywhere

Two real bugs, both long-standing:

- `dist/nsds.css` shipped the Phosphor `@font-face` URLs un-rebased
  (`../../fonts/…` resolves outside the repo), so **no icon-font glyph
  rendered at all** for any dist consumer — including the styleguide
  itself. `scripts/build-css.mjs` now rebases both relative depths.
- The component layer references ~28 `ph-*` glyphs the upstream subset
  never contained (carets, plus, pencil, upload, moon/sun, the
  text-formatting set…). `assets/css/icons-gap.css` fills each gap with a
  currentColor SVG mask drawn to the same spec — no markup changes; delete
  a block when the real subset gains the glyph.

## [2.2.0] — 2026-08-11

### Changed — real per-component documentation

The old "Form Controls" / "Alerts, Toasts & States" specimen cards lumped
three or four components into one frame — a collage, not documentation. They
are deleted, replaced by **31 per-component doc pages** generated from a new
registry (`scripts/component-docs.mjs`). Every page carries:

- a summary in the system's own terms;
- **Use it for / Not for** guidance;
- every variant rendered live, with a `<>markup` disclosure under each demo —
  the demo and the sample are one string, so they cannot disagree;
- the accessibility contract;
- **working live demos** where the component is interactive: the Modal page
  opens a real `showModal()` dialog (verified: top-layer trap, Esc, backdrop,
  Cancel autofocused), the Menu page a real popover, the Checkbox page a real
  indeterminate state.

The sidebar now groups components by family (Actions, Forms, Feedback,
Progress & data, Navigation, Overlays, Surfaces) under the numbered
foundations; the remaining card gallery (legacy components, brand, content
creation) moves under "Gallery", with the unmigrated component cards labelled
"Legacy components". 47 pages total.

## [2.1.0] — 2026-08-11

### Changed — styleguide is multi-page

One endless scroll became 16 pages: a numbered home directory, one page per
foundation section, one page per specimen group. Each page loads only its own
content (the specimen page for Components carries its 31 iframes; the home
page carries none), every URL is shareable, prev/next links walk the system in
order, the sidebar marks the current page with `aria-current`, and the theme
choice persists across pages via the shared `ns-theme` key. `preview/` is
rebuilt from scratch on each generate so a renamed section cannot leave a
stale orphan page.

### Removed — Claude-viewer harness files

`Home.dc.html`, `thumbnail.html`, `.thumbnail`, `support.js`, `_ds_bundle.js`
(110 kB), `_ds_manifest.json` (53 kB) and `_adherence.oxlintrc.json` (18 kB)
— ~250 kB of generated harness for the Claude design-system viewer, which the
standalone multi-page styleguide replaces. The system is now fully
self-describing through its own build.

## [2.0.0] — 2026-08-11

Major because `ghost/` is removed (a published path). No consumer migration
pain expected — the products had not yet vendored the partials — but removal
is removal.

### Changed — BREAKING: `ghost/` → `templates/`

The Handlebars partials are replaced by **framework-agnostic HTML** in
`templates/` (same `.ns-*` markup, stack-specific slots marked in comments).
Ghost consumes them by copying into `partials/` and swapping the marked slots
for helpers — `data-members-*` hooks work unchanged; the recipe is in
docs/INTEGRATION.md. One neutral copy replaces a third renderer that would
drift. Package export `./ghost/*` is now `./templates/*`.

### Added — gulp build orchestration

`gulpfile.mjs` — the same tool the Ghost theme builds with, as thin
orchestration over `scripts/*.mjs` (gulp owns the workflow, the scripts own
the work, so plain `node scripts/…` and CI still work with no gulp):
`gulp` (dev loop) · `gulp build` · `gulp check` · `gulp site` · `gulp serve`.

### Added — deployable preview (`gulp site`)

`scripts/build-site.mjs` stages a self-contained ~1 MB static site into
`_site/`: the styleguide, the full CSS/font closure, all 75 specimens at
their real paths, a root redirect and `.nojekyll`. Deployable to any static
host; verified standalone (every referenced path resolves inside `_site/`).

### Added — CI/CD

`.github/workflows/ci.yml`: **check** on every push/PR (`gulp build`,
`gulp check`, then `git diff --exit-code` so a hand-edited generated file
fails the build) and **deploy** on pushes to main (`gulp site` → GitHub
Pages), giving the team a permanently hosted preview of what main ships.

### Changed — preview structure

The styleguide was one unstructured scroll of 75 open specimens. Now:
- every section carries a **mono index** (01–16) in the sidebar and heading —
  the system's own structural motif applied to its own documentation;
- specimen groups are **collapsible and closed by default**, each summary a
  terminal-style row (index · name · count); sidebar links auto-expand their
  group before jumping.

## [1.1.0] — 2026-08-11

### Added — product surfaces

Three screen families, each as the usual trio (portable `.ns-*` CSS + React
renderer + Ghost partial) and a specimen card:

- **Authentication** (`auth.css`, `components/auth/`, `signup-form.hbs`).
  Sign in, sign up, forgot/reset password in one `.ns-auth` shell, with a
  split brand-band variant. Honest about the two products' flows: Ghost is
  passwordless (magic link — no forgot-password page exists there), the app
  gets the password variants. Sign-in errors never disclose which field was
  wrong; the forgot-password confirmation reads identically whether or not
  the account exists (no enumeration oracle); live password rules replace
  the strength bar ("add a number" is actionable, a yellow bar is a mood).
- **Helpdesk** (`helpdesk.css`, `components/helpdesk/`, `ticket-form.hbs`).
  Help hub, raise-a-ticket form (priority as a styled radio fieldset, urgent
  alone allowed the error hue and only when selected; attachment target;
  automatic course/lesson context capture), ticket list as terminal rows with
  mono ids, and the ticket thread (agent = brand edge, internal note =
  warning edge, both labelled in words).
- **Course player** (`player.css`, `components/player/`, `course-player.hbs`
  + `lesson-rail.hbs`). 16:9 stage on brand-900 in both themes, lesson
  header, prev/next with ←/→ shortcuts (space is left to the video), course
  progress, and a curriculum rail with done/current/locked states that
  scrolls itself to the current lesson. Two columns ≥ lg; below, a single
  column with the stage always first. The media element belongs to the
  caller — no video-vendor lock-in.

### Added — live preview loop

- **`npm run dev`** — watch mode on the preview server. Save any token,
  component CSS, card or script: tokens, bundle and preview rebuild
  (~400ms) and every open tab reloads over SSE. Dependency-free; a broken
  save reports and keeps watching. The reload snippet rides only on the HTTP
  response — no build artifact contains it.

### Changed — type & dark-mode polish

- **`--tracking-tight` (-0.018em)** applied to h1–h3 — Inter runs loose at
  display sizes; body text is never tightened.
- **`text-wrap: balance`** on headings.
- Dark mode: the **focus ring brightens to `brand-300`** (a safety feature
  outranks staying on-brand on the navy surface).
- New tokens: `--tracking-tight`, `--player-side-w`.
- Font pairing and dark mode are now documented as first-class sections in
  the readme.

## [1.0.0] — 2026-08-11

The first release the two products can actually share. Before this, the system
had foundations and display components but no distributable build, no
interactive layer, and no way for the Ghost theme and the Next.js app to prove
they agreed.

### Added — cross-platform build

- **Token export pipeline** (`scripts/build-tokens.mjs`). `tokens/*.css` is the
  single source of truth; `tokens.json` (W3C DTCG), `tokens.js`, `tokens.d.ts`
  and `tokens/tailwind.css` are generated from it. `--check` fails CI when they
  drift.
- **Tailwind v4 bridge** (`tokens/tailwind.css`, generated). Makes
  `bg-brand-500`, `p-card`, `rounded-card`, `text-label`, `z-dropdown` and
  `max-w-page` resolve identically in both products. Tailwind's numeric spacing
  scale is pinned to the same 4px base as `--space-*`.
- **CSS bundle** (`dist/nsds.css` + `.min.css`) — framework-neutral flat
  CSS for pipelines that cannot resolve `@import` across `node_modules`.
- **`package.json`** with `build`, `check` and an `exports` map.

### Added — guardrails

- `check:principles` — fails the build on a raw color, radius, z-index,
  transition timing, font-family or padding/margin/gap in the component layer.
  This is the design principles made mechanical rather than remembered.
- `check:palette` — re-proves the chart palette against the OKLCH lightness
  band, chroma floor, protan/deutan/tritan separation, normal-vision floor and
  surface contrast, reading the values out of the CSS that actually ships.

### Added — tokens

- **Spacing scale** (`--space-*`) on a 4px base, matched 1:1 to Tailwind's
  index, plus semantic aliases (`--pad-card`, `--gap-grid`, `--stack-lg`).
  Previously the system documented "Tailwind's 4px scale" while shipping no
  spacing tokens at all.
- **Layout tokens** — breakpoints, container widths, page gutters, fixed chrome
  sizes, and a six-layer `--z-*` elevation order.
- **Data-viz palette** — 7 categorical slots, a 4-step sequential ramp and a
  diverging pair, verified in both modes.
- **Status ink pair** (`--color-*-ink`). The raw status hues are unsafe as
  text — `--color-warning` measures 2.22:1 on white and fails AA outright, and
  `--color-error` at 4.65:1 clears AA with no headroom. The ink variants sit at
  6.5–6.8:1 in light mode and 7.5–10.5:1 in dark, and are now the only tokens
  allowed under status text.
- **`--color-on-brand` / `--color-on-dark` / `--color-scrim`** — replacing the
  hard-coded whites and scrim colors that broke dark mode locally.
- **Private `--ns-*` source layer** under the public `--color-*` API, so
  Tailwind's `@theme` can alias tokens without a self-referential cycle.

### Added — components

Interactive layer, previously absent entirely. Each ships as portable `.ns-*`
CSS plus a React wrapper plus, where Ghost needs it, a Handlebars partial.

- **Forms** — Field (label/help/error wiring), Input, Select, Textarea,
  Checkbox (with indeterminate), Radio, Switch, Fieldset.
- **Overlays** — Modal, ConfirmModal, Drawer, Menu, Tooltip. Built on `<dialog>`
  and the popover attribute, so focus trapping, Esc, inert background and top
  layer come from the platform rather than from hand-written JS.
- **Navigation** — Tabs (roving tabindex), Accordion (native `<details>`),
  Breadcrumb, Pagination, DocsSidebar.
- **Feedback** — Alert, ToastProvider/useToast, Skeleton, Spinner, EmptyState,
  ErrorState, Status.
- **Progress** — ProgressBar, Steps, ScoreMeter, DataTable. Native `<progress>`
  and `<meter>`, which are not interchangeable.
- **Theme** — ThemeToggle, SkipLink, and `assets/js/theme-init.js`: a shared
  no-flash bootstrap both products inline verbatim, using one `ns-theme`
  storage key so a reader keeps their theme across the two.

### Added — Ghost surfaces

Previously undesigned, though Ghost renders them regardless: sign-in, account,
subscribe form, search dialog, pagination, skip link, theme toggle, error page.

### Added — preview

- **A standalone styleguide** (`npm run preview`). The system previously had no
  way to look at itself: the specimen cards only rendered inside the Claude
  viewer, and `dist/` is just bytes, so "does the switch look right in dark
  mode" had no answer short of building one of the two consuming products.
  `scripts/build-preview.mjs` generates the page from the real artifacts —
  token tables from `tokens.json`, the class index scraped from
  `components/css/`, and all 72 specimens in iframes — and
  `scripts/serve.mjs` is a dependency-free server that serves the repository
  root, so the preview shows what actually ships. One theme switch flips the
  page and every specimen together.

### Added — documentation

- `docs/INTEGRATION.md` — the wiring contract for both products.
- `docs/CONTRIBUTING.md`, `LICENSE`, this changelog. Loose docs moved into `docs/`.
- Five foundation cards: Spacing & Layout, Interaction States, Accessibility,
  Data Visualization, Content Design.
- Four component cards: Forms, Feedback, Navigation, Progress.

### Changed

- `--color-accent-*` is now an explicit alias of `--color-brand-*`. It was a
  byte-for-byte duplicate — ten tokens that looked like a second brand color
  and were not one. Existing `variant="accent"` call sites keep working and can
  no longer drift apart. **Deprecated**; use `--color-brand-*` in new work.
- `styles.css` now imports the spacing, layout, data-viz and component layers.

### Fixed

- Anchored headings no longer hide under the sticky navbar (`scroll-margin-top`
  keyed to `--navbar-h`).
- `Button` and `Input` no longer style themselves inline; they render the
  shared `.ns-btn` / `.ns-input` classes, so the Ghost theme can render them.
- `components/core/Input.jsx` was a second, separately-drifting Input. It is now
  a re-export of the canonical one in `components/forms/Form.jsx`.
- `--color-scrim`, `--color-on-brand` and `--color-on-dark` replace hard-coded
  white and scrim literals that did not respond to the theme.

### Known debt

**23 of the pre-existing components still style themselves with inline style
objects**, which means the Ghost theme cannot render them — it would have to
reimplement each one. They are: AvatarRing, Badge, Chip, CodeBlock, CodePanel,
Footer, Hero, Kicker, Logo, Navbar, TableOfContents, TimelineStepper, AdSlot,
AuthorBox, BlogCard, CourseCard, CourseStats, CurriculumList, LevelBadge,
ResourceCard, RoadmapCard, TrainingCard, VideoPoster.

Converting each means lifting its styling into `components/css/` as `.ns-*`
classes and writing the matching `.hbs` partial. The list is enumerated in
`scripts/check-components.mjs`; `npm run check:components` holds all new
components to the rule and prints the outstanding count on every run, so the
debt shrinks visibly instead of being rediscovered later.
