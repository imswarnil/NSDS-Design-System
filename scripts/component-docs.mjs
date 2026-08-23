/* NS Design System — component documentation registry.
   =========================================================================
   One entry per component. This is the SOURCE for the per-component doc
   pages the styleguide generates: each entry becomes preview/c-<id>.html
   with the summary, usage guidance, every variant rendered live, and the
   exact markup shown under each demo (the demo IS the code sample — one
   string, so they cannot disagree).

   Entry shape:
     id        page slug
     title     display name
     family    sidebar grouping
     summary   one short paragraph — what it is, in this system's terms
     use / not arrays — when to reach for it, when not to
     a11y      array — the accessibility contract this component ships with
     variants  [{ name, note?, html, script?, dark? }]
               html renders inside the demo box AND prints as the sample.
               script: demo-only wiring (dialogs need showModal).
               dark: render this demo on a forced dark navy band. */

import { highlightLines, gutter } from "../components/core/highlight.js";

/* The code-block demos are tokenised HERE, at build time, by the same module
   the React component uses — so the markup printed under each demo is
   literally the markup a server would render, spans and all. Nothing on the
   styleguide highlights on the client. */
const codeBody = (src, lang, marks) => `  <div class="ns-code__body">
    <pre class="ns-code__gutter" aria-hidden="true">${gutter(src)}</pre>
    <pre class="ns-code__pre"><code>${highlightLines(src, lang, marks)}</code></pre>
  </div>`;
const codeBodyPlain = (src, lang, marks) => `  <div class="ns-code__body">
    <pre class="ns-code__pre"><code>${highlightLines(src, lang, marks)}</code></pre>
  </div>`;

export const FAMILIES = ["Components", "Forms", "Form patterns", "Feedback", "Progress & data", "Navigation", "Overlays", "Surfaces", "Media", "LMS", "Teaching", "Training", "Blog", "AI", "Content blocks", "Monetization", "CMS", "Sections"];

export const COMPONENTS = [

  /* ======================================================== Actions ==== */
  {
    id: "button", title: "Button", family: "Components",
    summary: "The action primitive. Solid brand fill is reserved for <code>primary</code> — the one thing to click on a screen. Everything else is a hairline. Press is an instant opacity dim: no bounce, no lift.",
    use: ["Submitting, confirming, starting — real actions", "One primary per screen; outline for the secondary", "quiet for the lowest-stakes action beside a confirm"],
    not: ["Navigation that just goes somewhere — use a link; a button that navigates lies to screen readers", "Two primaries side by side — one of them is wrong", "Toggling state — use Switch or a pressed button-group member"],
    a11y: ["Icon-only buttons need aria-label", "Loading keeps the label in the DOM (dimmed) so width and accessible name survive the wait", "disabled removes it from the tab order; aria-disabled keeps link-shaped buttons announceable"],
    variants: [
      { name: "Emphasis", note: "primary → outline → quiet is the whole emphasis scale.", html: `<button class="ns-btn ns-btn--primary">Start learning</button>
<button class="ns-btn ns-btn--outline">View syllabus</button>
<button class="ns-btn ns-btn--quiet">Cancel</button>` },
      { name: "Sizes", html: `<button class="ns-btn ns-btn--primary ns-btn--sm">Small</button>
<button class="ns-btn ns-btn--primary">Medium</button>
<button class="ns-btn ns-btn--primary ns-btn--lg">Large</button>` },
      { name: "With icon", note: "Phosphor glyphs; icon-only needs aria-label.", html: `<button class="ns-btn ns-btn--primary"><i class="ph ph-play" aria-hidden="true"></i> Resume lesson</button>
<button class="ns-btn ns-btn--outline ns-btn--icon" aria-label="Settings"><i class="ph ph-gear" aria-hidden="true"></i></button>` },
      { name: "States", html: `<button class="ns-btn ns-btn--primary" disabled>Disabled</button>
<button class="ns-btn ns-btn--primary" data-loading="true">Saving</button>` },
      { name: "Destructive", note: "Outline by default — delete is almost never the primary action. The solid variant exists only for the confirm button inside a delete dialog.", html: `<button class="ns-btn ns-btn--danger">Delete course</button>
<button class="ns-btn ns-btn--danger-solid">Yes, delete it</button>` },
      { name: "On dark surfaces", note: "white/ghost are for hero bands only — invisible on light, on purpose.", dark: true, html: `<button class="ns-btn ns-btn--white">Start learning</button>
<button class="ns-btn ns-btn--ghost">Watch demo</button>` },
      { name: "Button group", note: "A segmented control; aria-pressed marks the active member.", html: `<div class="ns-btn-group">
  <button class="ns-btn ns-btn--outline ns-btn--sm" aria-pressed="true">List</button>
  <button class="ns-btn ns-btn--outline ns-btn--sm">Cards</button>
  <button class="ns-btn ns-btn--outline ns-btn--sm">Timeline</button>
</div>` },
      { name: "Accent", note: "The warm accent, and it is not a second primary. It marks the one action that is about MONEY or membership — go Pro, buy, upgrade — so that a page can have a primary action and a commercial one without the two competing. Two accent buttons on a screen means neither is the commercial action.", html: `<button class="ns-btn ns-btn--accent">Go Pro</button>
<button class="ns-btn ns-btn--primary">Start lesson</button>` },
      { name: "Full width", note: "<code>--block</code> fills its container; <code>--block-sm</code> does it only below the md breakpoint, which is the honest default for a form's submit — full width on a phone, natural width on a desktop where a 900px-wide button is absurd. <code>.ns-btn-group--block</code> does the same for a group, splitting the row evenly.", html: `<div style="max-inline-size:22rem;display:grid;gap:var(--space-3)">
  <button class="ns-btn ns-btn--primary ns-btn--block">Create account</button>
  <button class="ns-btn ns-btn--block-sm">Full width on phones only</button>
  <div class="ns-btn-group ns-btn-group--block">
    <button class="ns-btn ns-btn--outline ns-btn--sm" aria-pressed="true">Monthly</button>
    <button class="ns-btn ns-btn--outline ns-btn--sm">Yearly</button>
  </div>
</div>` },
          { name: "Size scale", note: "Four steps, and the default is deliberately not the biggest one. A button lives INSIDE something — a card, a row, a toolbar — and the most common design-system bug is a default button set at body size and 44px tall, which is visually larger than the card title above it. The default carries a <code>--size-small</code> label at <code>--target-comfy</code> (40px): the touch target is untouched, the visual bulk is not. Height and type size are set independently on purpose — height is the accessibility property, size is the typographic one.", html: `<button class="ns-btn ns-btn--primary ns-btn--xl">Extra large</button>
<button class="ns-btn ns-btn--primary ns-btn--lg">Large</button>
<button class="ns-btn ns-btn--primary">Default</button>
<button class="ns-btn ns-btn--primary ns-btn--sm">Small</button>
<button class="ns-btn ns-btn--primary ns-btn--xs">Extra small</button>` },
      { name: "In proportion", note: "The same three buttons inside a card, which is where the sizing question actually gets decided. <code>--xl</code> exists for exactly one thing: the single primary action in a hero. Anywhere else it means the screen has a hierarchy problem.", html: `<div class="ns-card" style="max-inline-size:20rem">
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <span class="ns-card__title">Apex basics</span>
    <p class="ns-card__text">The platform's own language, from zero to first deploy.</p>
    <div style="display:flex;gap:var(--space-2);margin-block-start:var(--space-2)">
      <button class="ns-btn ns-btn--primary ns-btn--sm">Start</button>
      <button class="ns-btn ns-btn--outline ns-btn--sm">Syllabus</button>
      <button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Save"><i class="ph ph-bookmark-simple" aria-hidden="true"></i></button>
    </div>
  </div>
</div>` },
      { name: "Soft", note: "The step between outline and primary: a brand tint, no solid fill. For a secondary action that still has to be found — <em>Preview</em>, <em>Add to list</em> — where an outline disappears in a busy card. It does not break the one-solid-button rule, because it is not solid.", html: `<button class="ns-btn ns-btn--primary">Enrol now</button>
<button class="ns-btn ns-btn--soft">Preview this course</button>
<button class="ns-btn ns-btn--outline">Syllabus</button>
<button class="ns-btn ns-btn--quiet">Not now</button>` },
      { name: "Full width", note: "<code>--block</code> is always full width; <code>--block-sm</code> is full width on a phone and intrinsic above it, which is the right default for a form's submit and a buy box's CTA — and the media query every product ends up writing by hand.", html: `<div style="max-inline-size:18rem;display:grid;gap:var(--space-2)">
  <button class="ns-btn ns-btn--primary ns-btn--block">Enrol — $49</button>
  <button class="ns-btn ns-btn--outline ns-btn--block">Add to wishlist</button>
</div>` },
      { name: "Pill & segmented", note: "Pill geometry is a deliberate exception — Principle 4 reserves it for true pills — allowed where the button IS a chip: filter and toggle rows. <code>--block</code> on a group makes the members share the width equally.", html: `<button class="ns-btn ns-btn--outline ns-btn--sm ns-btn--pill" aria-pressed="true">All</button>
<button class="ns-btn ns-btn--outline ns-btn--sm ns-btn--pill" aria-pressed="false">Admin</button>
<button class="ns-btn ns-btn--outline ns-btn--sm ns-btn--pill" aria-pressed="false">Developer</button>
<div class="ns-btn-group ns-btn-group--pill" style="margin-inline-start:var(--space-4)">
  <button class="ns-btn ns-btn--outline ns-btn--sm" aria-pressed="true">Grid</button>
  <button class="ns-btn ns-btn--outline ns-btn--sm" aria-pressed="false">List</button>
</div>` },
      { name: "Toggle & swap", note: "<code>aria-pressed</code> is the state, so the visual and the announced state cannot drift apart. <code>--swap</code> stacks both labels in one grid cell, so the button does not change width when it flips — which is what stops a toolbar twitching.", html: `<button class="ns-btn ns-btn--outline ns-btn--swap" aria-pressed="false" onclick="this.setAttribute('aria-pressed', this.getAttribute('aria-pressed')==='true'?'false':'true')">
  <span data-when="off"><i class="ph ph-heart" aria-hidden="true"></i> Save</span>
  <span data-when="on"><i class="ph ph-heart" aria-hidden="true"></i> Saved</span>
</button>
<button class="ns-btn ns-btn--outline" aria-pressed="true"><i class="ph ph-bookmark-simple" aria-hidden="true"></i> Bookmarked</button>` },
      { name: "Motion, count, shortcut", note: "The one piece of motion a button is allowed: a trailing arrow may travel two pixels in the direction it points. That is the arrow doing its job — not the button pretending to be a physical object, which Principle 5 rules out. The count and the ⌘K hint are mono and dimmed, so they read as metadata rather than part of the action's name.", html: `<a class="ns-btn ns-btn--primary" href="#0">Browse courses <i class="ph ph-arrow-right ns-btn__arrow" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--back" href="#0"><i class="ph ph-arrow-left ns-btn__arrow" aria-hidden="true"></i> Back</a>
<button class="ns-btn ns-btn--outline">Filters <span class="ns-btn__count">3</span></button>
<button class="ns-btn ns-btn--quiet">Search <kbd class="ns-btn__kbd">⌘K</kbd></button>` },
    ],
  },

  /* ========================================================== Forms ==== */
  {
    id: "field", title: "Field", family: "Forms",
    summary: "The wrapper that makes a control a form field: label above, help or error below, all wired with aria-describedby. Every control on a real form sits inside one.",
    use: ["Around every Input/Select/Textarea in a form", "Error display — the message replaces the help text and is announced via role=\"alert\""],
    not: ["Checkbox/radio/switch — their label wraps the control instead (see those pages)"],
    a11y: ["The label is a real <label for>, never a placeholder", "aria-invalid drives the error styling, so seen and announced state cannot drift", "The error is announced immediately (role=\"alert\") because the user has already left the field when validation lands"],
    variants: [
      { name: "Label + help", html: `<div class="ns-field" style="max-inline-size:20rem">
  <label class="ns-field__label" for="f-email">Email address<span class="ns-field__required" aria-hidden="true">*</span></label>
  <input class="ns-input" id="f-email" type="email" aria-describedby="f-email-h" required>
  <p class="ns-field__help" id="f-email-h">We send lesson updates here.</p>
</div>` },
      { name: "Error state", note: "Name what is wrong and what to do — never just \"invalid\".", html: `<div class="ns-field" style="max-inline-size:20rem">
  <label class="ns-field__label" for="f-org">Org ID</label>
  <input class="ns-input ns-input--mono" id="f-org" value="00D5g0000" aria-invalid="true" aria-describedby="f-org-e">
  <p class="ns-field__error" id="f-org-e" role="alert">That ID is 18 characters. This one has 9.</p>
</div>` },
    ],
  },
  {
    id: "input", title: "Input", family: "Forms",
    summary: "Single-line text entry. Hairline border, 40px target, focus ring via :focus-visible. The mono variant is for data — org IDs, codes, keys — Principle 2 applied to input.",
    use: ["Free text, email, password, search", "mono for anything that is a value rather than a sentence"],
    not: ["Choosing from a known list — Select", "Multi-line prose — Textarea"],
    a11y: ["Always inside a Field (or with an explicit label) — placeholder is never a label", "The ⌘K hint is aria-hidden: a keyboard user tabbing in does not need it read out"],
    variants: [
      { name: "Types", note: "One class, every HTML type — the type attribute buys the right keyboard, autofill and native pickers for free.", html: `<div style="display:grid;gap:var(--space-3);max-inline-size:20rem;inline-size:100%">
  <input class="ns-input" type="text" placeholder="Text — a sentence or a name">
  <input class="ns-input" type="email" placeholder="you@example.com" autocomplete="email">
  <input class="ns-input" type="password" value="hunter2hunter" autocomplete="current-password">
  <input class="ns-input" type="number" placeholder="Number — 42" min="0">
  <input class="ns-input" type="date">
  <input class="ns-input" type="url" placeholder="https://…">
</div>` },
      { name: "States", note: "Hover brightens the hairline; focus draws the 2px brand ring (click into one); active/filled is just the value present — no floating labels. Disabled leaves the tab order; readonly stays readable and copyable.", html: `<div style="display:grid;gap:var(--space-3);max-inline-size:20rem;inline-size:100%">
  <input class="ns-input" placeholder="Rest — hover me, then click in">
  <input class="ns-input" value="Filled — the quiet state">
  <input class="ns-input" value="Read-only value" readonly>
  <input class="ns-input" value="Disabled" disabled>
</div>` },
      { name: "Validation", note: "aria-invalid drives the red hairline; the Field's error names what is wrong AND what to do, and role=\"alert\" announces it. Never color alone, never just \"invalid\".", html: `<div class="ns-field" style="max-inline-size:20rem">
  <label class="ns-field__label" for="in-v1">Email address</label>
  <input class="ns-input" id="in-v1" type="email" value="swarnil@gmail" aria-invalid="true" aria-describedby="in-v1-e">
  <p class="ns-field__error" id="in-v1-e" role="alert">That address is missing its domain — like .com</p>
</div>
<div class="ns-field" style="max-inline-size:20rem">
  <label class="ns-field__label" for="in-v2">Org ID</label>
  <input class="ns-input ns-input--mono" id="in-v2" value="00D5g000004abcEAA" aria-describedby="in-v2-h">
  <p class="ns-field__help" id="in-v2-h"><span class="ns-status ns-status--success">Valid</span></p>
</div>` },
      { name: "Mono — for data", note: "Org IDs, codes, keys — a value, not a sentence (Principle 2).", html: `<input class="ns-input ns-input--mono" value="00D5g000004abcEAA" style="max-inline-size:16rem">` },
      { name: "Icon and shortcut hint", html: `<span class="ns-input-wrap" style="max-inline-size:20rem">
  <i class="ph ph-magnifying-glass ns-input-wrap__icon" aria-hidden="true"></i>
  <input class="ns-input ns-input--has-icon ns-input--has-hint" type="search" placeholder="Search courses…">
  <kbd class="ns-input-wrap__hint" aria-hidden="true">⌘K</kbd>
</span>` },
    ],
  },
  {
    id: "select", title: "Select", family: "Forms",
    summary: "The native <select>, restyled — chevron drawn as a background so the markup stays a bare element. Deliberately not a custom listbox: the native control is already right on every platform, including mobile.",
    use: ["Choosing one of 4–15 known options"],
    not: ["2–4 options all worth seeing — Radio shows them at once", "Type-ahead over hundreds of options — that is a combobox, which this system does not ship yet"],
    a11y: ["The placeholder option is disabled so it cannot be submitted as a value"],
    variants: [
      { name: "Default", html: `<select class="ns-select" style="max-inline-size:16rem">
  <option value="" disabled selected>Choose a level</option>
  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
</select>` },
      { name: "Disabled", html: `<select class="ns-select" disabled style="max-inline-size:16rem"><option>Beginner</option></select>` },
    ],
  },
  {
    id: "textarea", title: "Textarea", family: "Forms",
    summary: "Multi-line text. Vertical resize only, body line-height for comfortable reading while writing.",
    use: ["Ticket descriptions, lesson notes, any prose"],
    not: ["Single values — Input"],
    a11y: ["Same Field wiring as Input — label, help, aria-invalid"],
    variants: [
      { name: "Default", html: `<textarea class="ns-textarea" rows="4" placeholder="What you did, what you expected, what happened instead…" style="max-inline-size:26rem"></textarea>` },
    ],
  },
  {
    id: "checkbox", title: "Checkbox", family: "Forms",
    summary: "Native input with appearance:none — real semantics, keyboard behaviour and form participation kept; only the paint is ours. The input sits inside the label, so the whole row is the click target.",
    use: ["Independent yes/no choices; multi-select lists", "Indeterminate for \"some children checked\" (curriculum trees)"],
    not: ["A setting that applies instantly — Switch", "Mutually exclusive options — Radio"],
    a11y: ["Indeterminate is a DOM property, not an attribute — set it in JS (the React Checkbox handles this)", "Forced-colors mode re-anchors the check to system colors"],
    variants: [
      { name: "States", html: `<label class="ns-choice"><input type="checkbox" class="ns-checkbox" checked>
  <span class="ns-choice__text"><span class="ns-choice__label">New courses</span>
  <span class="ns-choice__help">About one a month.</span></span></label>
<label class="ns-choice"><input type="checkbox" class="ns-checkbox">
  <span class="ns-choice__text"><span class="ns-choice__label">Blog posts</span></span></label>
<label class="ns-choice"><input type="checkbox" class="ns-checkbox" disabled>
  <span class="ns-choice__text"><span class="ns-choice__label">Disabled</span></span></label>` },
      { name: "Indeterminate", script: `document.currentScript.previousElementSibling.querySelector('input').indeterminate = true;`, html: `<label class="ns-choice"><input type="checkbox" class="ns-checkbox">
  <span class="ns-choice__text"><span class="ns-choice__label">Section 2 — 3 of 5 lessons</span></span></label>` },
    ],
  },
  {
    id: "radio", title: "Radio", family: "Forms",
    summary: "One choice from a visible set. Always grouped in a Fieldset so the question is announced with the options.",
    use: ["2–4 mutually exclusive options that are all worth seeing"],
    not: ["More options than fit comfortably — Select"],
    a11y: ["Arrow keys move within the group natively — nothing to wire"],
    variants: [
      { name: "In a fieldset", html: `<fieldset class="ns-fieldset">
  <legend class="ns-fieldset__legend">Difficulty</legend>
  <label class="ns-choice"><input type="radio" name="d1" class="ns-radio" checked>
    <span class="ns-choice__text"><span class="ns-choice__label">Beginner</span></span></label>
  <label class="ns-choice"><input type="radio" name="d1" class="ns-radio">
    <span class="ns-choice__text"><span class="ns-choice__label">Advanced</span></span></label>
</fieldset>` },
    ],
  },
  {
    id: "switch", title: "Switch", family: "Forms",
    summary: "A checkbox underneath, role=\"switch\" on top. The shape is a promise: the change applies the moment you flip it. If it only applies on submit, that promise is broken — use Checkbox.",
    use: ["Dark mode, email digest, autoplay — instant settings"],
    not: ["Anything inside a form that submits"],
    a11y: ["role=\"switch\" announces on/off rather than checked/unchecked", "The knob slide is the one transform animation allowed, inside the 120ms budget"],
    variants: [
      { name: "States", html: `<label class="ns-choice"><input type="checkbox" role="switch" class="ns-switch" checked>
  <span class="ns-choice__text"><span class="ns-choice__label">Dark mode</span></span></label>
<label class="ns-choice"><input type="checkbox" role="switch" class="ns-switch">
  <span class="ns-choice__text"><span class="ns-choice__label">Weekly digest</span></span></label>
<label class="ns-choice"><input type="checkbox" role="switch" class="ns-switch" disabled>
  <span class="ns-choice__text"><span class="ns-choice__label">Disabled</span></span></label>` },
    ],
  },

  /* ======================================================= Feedback ==== */
  {
    id: "status", title: "Status", family: "Feedback",
    summary: "The status atom: a dot, a mono word, colour third. Never a background wash (Principle 3) — so it survives grayscale, colourblindness, and never competes with the primary button.",
    use: ["Course/lesson/ticket state in lists, cells, headers"],
    not: ["A message with a body — Alert", "Series colour in a chart — status hues are reserved"],
    a11y: ["The word carries the meaning; the dot and colour reinforce it"],
    variants: [
      { name: "The five states", note: "idle is a hollow dot — \"not started\" is legible as a shape, not just a grey.", html: `<span class="ns-status ns-status--idle">Not started</span>
<span class="ns-status ns-status--info">In progress</span>
<span class="ns-status ns-status--success">Complete</span>
<span class="ns-status ns-status--warning">Expiring</span>
<span class="ns-status ns-status--error">Failed</span>` },
    ],
  },
  {
    id: "alert", title: "Alert", family: "Feedback",
    summary: "A block message tied to a region of the page. Hairline all round, the leading edge thickened in the status colour — the same accent-line device cards use, so a warning introduces no new visual language.",
    use: ["Anything the user must act on — it stays on screen and sits next to what failed", "Context worth keeping visible (trial expiry, saved state)"],
    not: ["Transient confirmations — Toast", "A one-word state — Status"],
    a11y: ["role=\"status\" (polite) for info/success; role=\"alert\" (assertive) only for errors", "Never role=\"alert\" on content present at page load — it announces nothing"],
    variants: [
      { name: "Tones", html: `<div class="ns-alert ns-alert--info" role="status">
  <i class="ph ph-info ns-alert__icon" aria-hidden="true"></i>
  <div class="ns-alert__body"><strong class="ns-alert__title">Draft saved</strong>
  <div class="ns-alert__text">Your progress is stored locally.</div></div>
</div>
<div class="ns-alert ns-alert--warning" role="status">
  <i class="ph ph-warning ns-alert__icon" aria-hidden="true"></i>
  <div class="ns-alert__body"><strong class="ns-alert__title">Trial org expires in 3 days</strong>
  <div class="ns-alert__text">Finish the data-loader lesson before it locks.</div></div>
</div>
<div class="ns-alert ns-alert--error" role="alert">
  <i class="ph ph-warning-circle ns-alert__icon" aria-hidden="true"></i>
  <div class="ns-alert__body"><strong class="ns-alert__title">Deployment failed</strong>
  <div class="ns-alert__text">Two test classes are below 75% coverage.</div>
  <div class="ns-alert__actions"><button class="ns-btn ns-btn--outline ns-btn--sm">View log</button></div></div>
</div>
<div class="ns-alert ns-alert--success" role="status">
  <i class="ph ph-check-circle ns-alert__icon" aria-hidden="true"></i>
  <div class="ns-alert__body"><strong class="ns-alert__title">Deployment succeeded</strong>
  <div class="ns-alert__text">All 214 tests passed at 81% coverage.</div></div>
</div>` },
    ],
  },
  {
    id: "toast", title: "Toast", family: "Feedback",
    summary: "Transient confirmation. Success auto-dismisses; errors never do — a message that vanishes before it is read is worse than none. Actionable errors do not belong here at all: a toast is unreachable once gone.",
    use: ["\"Progress saved\", \"Link copied\" — confirmations of success"],
    not: ["Errors the user must fix — Alert, next to the thing that failed"],
    a11y: ["The live region mounts empty at app start; messages are inserted later — a region created with its message announces nothing (ToastProvider handles this)"],
    variants: [
      { name: "Tones", html: `<div class="ns-toast ns-toast--success" style="position:static">
  <span class="ns-toast__text">Progress saved</span>
  <button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Dismiss"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>
<div class="ns-toast" style="position:static">
  <span class="ns-toast__text">Link copied to clipboard</span>
  <button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Dismiss"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>
<div class="ns-toast ns-toast--error" style="position:static">
  <span class="ns-toast__text">Could not reach the server &mdash; nothing was saved</span>
  <button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Dismiss"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>` },
    ],
  },
  {
    id: "skeleton", title: "Skeleton", family: "Feedback",
    summary: "Loading placeholder for waits over ~1s. The shimmer flattens to a static block under prefers-reduced-motion rather than freezing mid-sweep.",
    use: ["Content whose shape is known while it loads — cards, text, avatars"],
    not: ["Sub-second waits — Spinner, or nothing"],
    a11y: ["Shapes are aria-hidden; one visually-hidden \"Loading\" announces instead of eight shimmering bars"],
    variants: [
      { name: "Text / title / avatar / card", html: `<div style="max-inline-size:22rem">
  <span class="ns-skeleton ns-skeleton--avatar" style="display:inline-block"></span>
  <div class="ns-skeleton ns-skeleton--title" style="margin-block:10px"></div>
  <div class="ns-skeleton ns-skeleton--text"></div>
  <div class="ns-skeleton ns-skeleton--text" style="inline-size:70%"></div>
</div>` },
      { name: "Card", note: "The whole card shape in one element, for a grid that loads as a grid. Four stacked bars in a card outline is four things arriving; this is one, which is what the reader is actually waiting for.", html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(12rem,1fr));gap:var(--space-4);max-inline-size:32rem">
  <div class="ns-skeleton ns-skeleton--card"></div>
  <div class="ns-skeleton ns-skeleton--card"></div>
</div>
<span class="ns-visually-hidden">Loading courses</span>` },
    ],
  },
  {
    id: "spinner", title: "Spinner", family: "Feedback",
    summary: "Indeterminate wait under about a second, where a skeleton would flash. Longer than that, a spinner tells the user nothing — use Skeleton.",
    use: ["Inline busy state on a small control or fetch"],
    not: ["Page-level loading — Skeleton"],
    a11y: ["Pair with a visually-hidden role=\"status\" label"],
    variants: [
      { name: "Sizes", html: `<span class="ns-spinner" aria-hidden="true"></span>
<span class="ns-spinner ns-spinner--lg" aria-hidden="true"></span>
<span class="ns-visually-hidden" role="status">Loading</span>` },
    ],
  },
  {
    id: "preloader", title: "Preloader", family: "Feedback",
    summary: "The brand mark loading — for app boot, route changes and video stings. Five styles, all hairline-and-opacity; under reduced motion every one collapses to the static logo. A page-level wait shows the mark, never a generic spinner.",
    use: ["App boot and route transitions", "Video intro stings — flip is drawn for exactly that", "Anywhere the wait is the whole screen, not one control"],
    not: ["Inline busy state on a control — Spinner", "Content that is arriving in a known shape — Skeleton"],
    a11y: ["role=\"status\" on the wrapper announces the wait once", "The label is real text, not only animation — the wait is legible with motion off"],
    variants: [
      { name: "Pulse", note: "The default. The logo breathing — calmest, for app boot.", html: `<div class="ns-preloader ns-preloader--pulse" role="status">
  <span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span>
  <span class="ns-preloader__label">Loading</span>
</div>` },
      { name: "Ring", note: "A brand arc circles the mark; the logo holds still.", html: `<div class="ns-preloader ns-preloader--ring" role="status">
  <span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span>
  <span class="ns-preloader__label">Loading</span>
</div>` },
      { name: "Orbit", note: "One dot orbiting — the quietest of the five.", html: `<div class="ns-preloader ns-preloader--orbit" role="status">
  <span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span>
  <span class="ns-preloader__label">Loading</span>
</div>` },
      { name: "Flip", note: "The video sting: one clean turn, then a beat of rest.", html: `<div class="ns-preloader ns-preloader--flip" role="status">
  <span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span>
  <span class="ns-preloader__label">Namaste Salesforce</span>
</div>` },
      { name: "Bar", note: "Logo over an indeterminate hairline — reads as measurable progress coming.", html: `<div class="ns-preloader" role="status">
  <span class="ns-preloader__mark"><img class="ns-preloader__logo" src="../assets/logo/favicon.svg" alt=""></span>
  <span class="ns-preloader__bar" aria-hidden="true"></span>
  <span class="ns-preloader__label">Loading</span>
</div>` },
    ],
  },
  {
    id: "empty-state", title: "Empty state", family: "Feedback",
    summary: "Three required parts: what is not here, why, and the one thing to do about it. Dashed border = \"nothing here yet\". An empty state with no action is a dead end.",
    use: ["First-run screens, filtered-to-nothing lists, empty dashboards"],
    not: ["Failures — Error state (solid border, status code)"],
    a11y: ["If there is genuinely nothing to do, say so in the description — never leave the user to guess"],
    variants: [
      { name: "Default", html: `<div class="ns-empty" style="max-inline-size:26rem">
  <i class="ph ph-folder-open ns-empty__icon" aria-hidden="true"></i>
  <p class="ns-empty__title">No courses yet</p>
  <p class="ns-empty__text">Courses you start appear here so you can pick up where you left off.</p>
  <div class="ns-empty__action"><button class="ns-btn ns-btn--primary ns-btn--sm">Browse courses</button></div>
</div>` },
    ],
  },
  {
    id: "error-state", title: "Error state", family: "Feedback",
    summary: "Whole-page failure. Same shape as the empty state but a solid border and a mono status code as a first-class element — the console motif applied to the failure page.",
    use: ["404, 500, a route that threw"],
    not: ["Field or region errors — Field error / Alert"],
    a11y: ["Always offer a route onward — a dead end is a bounce"],
    variants: [
      { name: "404", html: `<div class="ns-empty ns-error-state" role="alert" style="max-inline-size:26rem">
  <p class="ns-empty__code">404</p>
  <p class="ns-empty__title">Page not found</p>
  <p class="ns-empty__text">That page has moved or never existed.</p>
  <div class="ns-empty__action"><a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Browse courses</a></div>
</div>` },
    ],
  },

  /* ================================================ Progress & data ==== */
  {
    id: "progress-bar", title: "Progress bar", family: "Progress & data",
    summary: "Native <progress> — the value reaches assistive tech with zero ARIA. The percentage prints as mono text beside it: a bar alone encodes the value only as length, unreadable at 6px tall.",
    use: ["Course completion, uploads — \"how far along\""],
    not: ["A score against a threshold — Meter (\"how good\" is a different question)"],
    a11y: ["aria-label names what the bar measures — a bare percentage means nothing announced alone"],
    variants: [
      { name: "Indeterminate", stack: true, note: "A different claim from a determinate bar: “something is happening, duration unknown”. The only looping animation here — a determinate bar animates because the number changed, which is feedback.", html: `<progress class="ns-progress ns-progress--indeterminate" aria-label="Loading"></progress>` },
      { name: "In progress / complete", note: "Complete runs green: \"done\" is a status, not the interactive signal.", html: `<div class="ns-progress-row" style="max-inline-size:20rem">
  <progress class="ns-progress" value="35" max="100" aria-label="35% complete"></progress>
  <span class="ns-progress-row__value">35%</span>
</div>
<div class="ns-progress-row" style="max-inline-size:20rem">
  <progress class="ns-progress ns-progress--complete" value="100" max="100" aria-label="Complete"></progress>
  <span class="ns-progress-row__value">100%</span>
</div>` },
    ],
  },
  {
    id: "steps", title: "Steps", family: "Progress & data",
    summary: "Discrete lesson ticks — for a curriculum, where the unit is a lesson, not a percentage. The current tick carries a soft ring.",
    use: ["\"Lesson 3 of 12\" on cards and headers"],
    not: ["Continuous values — Progress bar"],
    a11y: ["Ticks are aria-hidden; one visually-hidden sentence carries the count"],
    variants: [
      { name: "Default", html: `<span class="ns-visually-hidden">Lesson 3 of 6</span>
<ol class="ns-steps" aria-hidden="true" style="max-inline-size:14rem">
  <li class="ns-steps__tick" data-state="done"></li>
  <li class="ns-steps__tick" data-state="done"></li>
  <li class="ns-steps__tick" data-state="current"></li>
  <li class="ns-steps__tick"></li>
  <li class="ns-steps__tick"></li>
  <li class="ns-steps__tick"></li>
</ol>` },
    ],
  },
  {
    id: "meter", title: "Meter", family: "Progress & data",
    summary: "Native <meter> for a score against a threshold — quiz results, code coverage. Carries low/high/optimum semantics <progress> lacks; the fill colour follows the band the value lands in.",
    use: ["\"78/100, and is that good?\""],
    not: ["\"How far along\" — Progress bar. They announce differently; swapping them makes the announcement wrong"],
    a11y: ["aria-label names the measurement"],
    variants: [
      { name: "Bands", html: `<div class="ns-progress-row" style="max-inline-size:20rem">
  <meter class="ns-meter" value="88" max="100" low="50" high="80" optimum="100" aria-label="Score 88 of 100"></meter>
  <span class="ns-progress-row__value">88/100</span>
</div>
<div class="ns-progress-row" style="max-inline-size:20rem">
  <meter class="ns-meter" value="62" max="100" low="50" high="80" optimum="100" aria-label="Score 62 of 100"></meter>
  <span class="ns-progress-row__value">62/100</span>
</div>
<div class="ns-progress-row" style="max-inline-size:20rem">
  <meter class="ns-meter" value="34" max="100" low="50" high="80" optimum="100" aria-label="Score 34 of 100"></meter>
  <span class="ns-progress-row__value">34/100</span>
</div>` },
    ],
  },
  {
    id: "table", title: "Table", family: "Progress & data",
    summary: "Hairlines only. Numeric columns are tabular and end-aligned so digits stack; the wrapper is mandatory, because it is what makes a wide table scroll inside itself on a phone. Everything past the base is an opt-in modifier — four header treatments, three densities, row state, cell tone, data bars and a heat ramp — and state is always an <code>attribute</code> a server can print from a value, never a class a template has to map.",
    use: ["Lesson lists, scores, gradebooks, storage reports — anything genuinely tabular", "Admin lists, where <code>--compact</code> plus row actions is the working shape", "A matrix (activity by week, coverage by module) with <code>--matrix</code> and the heat ramp"],
    not: ["Card-shaped content forced into rows", "A layout — the wrapper and a grid do that job without lying to a screen reader", "A chart. A data bar in a cell annotates a number; a cell with only a bar in it is a chart that lost its axis"],
    a11y: [
      "tabindex=\"0\" on the wrapper — a scroll region must be keyboard-reachable",
      "Sortable headers put aria-sort on the &lt;th&gt; and a real &lt;button&gt; inside it",
      "Every tone, state and heat level is a wash PLUS an edge, a glyph or a printed value — colour is never the only signal, and every wash is dropped under forced-colors and in print",
      "Row actions reveal on :hover AND :focus-within; on touch they are simply always visible",
      "--stacked hides the header visually but keeps it in the DOM, so the table is still a table to a screen reader",
    ],
    variants: [
      { name: "Header treatments", stack: true, note: "The default — mono, uppercase, label ink — is right for almost every table in the product. <code>--head-filled</code> is for a header that scrolls (it re-announces itself as chrome), <code>--head-strong</code> brackets a table that has a <code>tfoot</code> total, <code>--head-plain</code> is for a table inside an <em>article</em>, where mono uppercase reads as product chrome dropped into the writing, and <code>--head-brand</code> is the report header — at most one per screen, because it is a filled band and two of them compete.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--compact ns-table--head-filled">
  <thead><tr><th scope="col">Filled</th><th scope="col" class="ns-table__num">Records</th></tr></thead>
  <tbody><tr><td>Account</td><td class="ns-table__num">12,480</td></tr></tbody>
</table></div>
<div class="ns-table-wrap"><table class="ns-table ns-table--compact ns-table--head-strong">
  <thead><tr><th scope="col">Strong</th><th scope="col" class="ns-table__num">Records</th></tr></thead>
  <tbody><tr><td>Account</td><td class="ns-table__num">12,480</td></tr></tbody>
</table></div>
<div class="ns-table-wrap"><table class="ns-table ns-table--compact ns-table--head-plain">
  <thead><tr><th scope="col">Plain</th><th scope="col" class="ns-table__num">Records</th></tr></thead>
  <tbody><tr><td>Account</td><td class="ns-table__num">12,480</td></tr></tbody>
</table></div>
<div class="ns-table-wrap"><table class="ns-table ns-table--compact ns-table--head-brand">
  <thead><tr><th scope="col">Brand</th><th scope="col" class="ns-table__num">Records</th></tr></thead>
  <tbody><tr><td>Account</td><td class="ns-table__num">12,480</td></tr></tbody>
</table></div>` },
      { name: "Density and rules", stack: true, note: "<code>--compact</code> for an admin list the reader is scanning for one row; <code>--roomy</code> for a short table that is the main content of the screen. <code>--bordered</code> adds the vertical hairline, for a grid where the column is a real unit; <code>--open</code> drops the horizontal one, for a table short enough that the header rule alone holds it.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--compact ns-table--bordered">
  <thead><tr><th scope="col">Object</th><th scope="col" class="ns-table__num">Records</th><th scope="col" class="ns-table__num">Storage</th></tr></thead>
  <tbody>
    <tr><td>Account</td><td class="ns-table__num">12,480</td><td class="ns-table__num">24 MB</td></tr>
    <tr><td>Contact</td><td class="ns-table__num">38,102</td><td class="ns-table__num">71 MB</td></tr>
  </tbody>
</table></div>
<div class="ns-table-wrap"><table class="ns-table ns-table--roomy ns-table--open">
  <thead><tr><th scope="col">Object</th><th scope="col" class="ns-table__num">Records</th><th scope="col" class="ns-table__num">Storage</th></tr></thead>
  <tbody>
    <tr><td>Account</td><td class="ns-table__num">12,480</td><td class="ns-table__num">24 MB</td></tr>
    <tr><td>Contact</td><td class="ns-table__num">38,102</td><td class="ns-table__num">71 MB</td></tr>
  </tbody>
</table></div>` },
      { name: "Row state", stack: true, note: "<code>data-state</code> on the <code>&lt;tr&gt;</code> — an attribute a server prints from a value, so Handlebars and React produce the same markup without either owning a mapping. Every state is a 3px leading edge <em>plus</em> a wash, so it survives grayscale and forced-colors. Use it when the whole row is the story; use cell tone below when one value is.", html: `<div class="ns-table-wrap"><table class="ns-table">
  <thead><tr><th scope="col">Learner</th><th scope="col">Status</th><th scope="col" class="ns-table__num">Score</th></tr></thead>
  <tbody>
    <tr data-state="current"><td class="ns-table__strong">Priya Nair</td><td><span class="ns-status ns-status--info">In progress</span></td><td class="ns-table__num">—</td></tr>
    <tr data-state="success"><td>Arun Menon</td><td><span class="ns-status ns-status--success">Passed</span></td><td class="ns-table__num">94</td></tr>
    <tr data-state="warning"><td>Kavya Rao</td><td><span class="ns-status ns-status--warning">At risk</span></td><td class="ns-table__num">61</td></tr>
    <tr data-state="danger"><td>Dev Sharma</td><td><span class="ns-status ns-status--error">Failed</span></td><td class="ns-table__num">38</td></tr>
    <tr data-state="muted"><td>Meera Iyer</td><td><span class="ns-status ns-status--idle">Withdrawn</span></td><td class="ns-table__num">—</td></tr>
  </tbody>
</table></div>` },
      { name: "Cell tone and delta", stack: true, note: "<code>data-tone</code> tints one cell when one value in an otherwise fine row is the story. The wash is deliberately weak and the ink carries the signal — a saturated fill behind body text fails contrast on the first long value. <code>.ns-table__delta</code> is a caret <em>and</em> a sign <em>and</em> a colour; <code>data-polarity=\"inverse\"</code> flips it for a metric where up is bad.", html: `<div class="ns-table-wrap"><table class="ns-table">
  <thead><tr><th scope="col">Module</th><th scope="col" class="ns-table__num">Completion</th><th scope="col" class="ns-table__num">Drop-off</th></tr></thead>
  <tbody>
    <tr><td>Objects &amp; fields</td><td class="ns-table__num" data-tone="success">96% pass</td><td class="ns-table__num"><span class="ns-table__delta" data-dir="down" data-polarity="inverse">2.1%</span></td></tr>
    <tr><td>SOQL basics</td><td class="ns-table__num" data-tone="warning">64% pass</td><td class="ns-table__num"><span class="ns-table__delta" data-dir="up" data-polarity="inverse">8.4%</span></td></tr>
    <tr><td>Apex triggers</td><td class="ns-table__num" data-tone="danger">31% pass</td><td class="ns-table__num"><span class="ns-table__delta" data-dir="up" data-polarity="inverse">14.9%</span></td></tr>
    <tr><td>Flow builder</td><td class="ns-table__num" data-tone="neutral">not run</td><td class="ns-table__num"><span class="ns-table__delta">0.0%</span></td></tr>
  </tbody>
</table></div>` },
      { name: "Data bars", stack: true, note: "Magnitude encoded in <em>length</em>, which reads pre-attentively and survives every colour condition there is. The percentage arrives as a custom property — <code>style=\"--ns-bar:62%\"</code> — which is the one inline style this system allows, because it is a datum rather than a style choice. The number stays printed in the cell.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--compact">
  <thead><tr><th scope="col">Module</th><th scope="col">Cohort completion</th></tr></thead>
  <tbody>
    <tr><td>Objects &amp; fields</td><td><span class="ns-table__bar" style="--ns-bar:96%" data-tone="success">96%</span></td></tr>
    <tr><td>SOQL basics</td><td><span class="ns-table__bar" style="--ns-bar:64%">64%</span></td></tr>
    <tr><td>Apex triggers</td><td><span class="ns-table__bar" style="--ns-bar:31%" data-tone="warning">31%</span></td></tr>
    <tr><td>Integration</td><td><span class="ns-table__bar" style="--ns-bar:8%" data-tone="danger">8%</span></td></tr>
  </tbody>
</table></div>` },
      { name: "Heat matrix", stack: true, note: "<code>data-heat=\"0\"</code>–<code>\"4\"</code> against the sequential dataviz ramp — four steps, because that is the honest resolution of the ramp. The wash is capped low enough that the cell's own value stays readable on both themes, which is the point: heat is an <em>accent on a printed number</em>, never a replacement for it. A grid of empty coloured squares is unreadable to anyone who cannot see the hue and unprintable for everyone.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--matrix ns-table--bordered ns-table--stickycol">
  <thead><tr><th scope="col">Module</th><th scope="col">W1</th><th scope="col">W2</th><th scope="col">W3</th><th scope="col">W4</th><th scope="col">W5</th></tr></thead>
  <tbody>
    <tr><th scope="row">Objects</th><td data-heat="4">41</td><td data-heat="3">28</td><td data-heat="2">12</td><td data-heat="1">4</td><td data-heat="0">0</td></tr>
    <tr><th scope="row">SOQL</th><td data-heat="1">6</td><td data-heat="4">39</td><td data-heat="3">22</td><td data-heat="2">11</td><td data-heat="1">3</td></tr>
    <tr><th scope="row">Apex</th><td data-heat="0">0</td><td data-heat="1">5</td><td data-heat="3">26</td><td data-heat="4">44</td><td data-heat="2">14</td></tr>
  </tbody>
</table></div>` },
      { name: "Sortable and sticky", stack: true, note: "The sort control is a real <code>&lt;button&gt;</code> inside the <code>&lt;th&gt;</code>, so it is keyboard reachable; the <code>&lt;th&gt;</code> carries <code>aria-sort</code>, which is what gets announced. <code>--sticky</code> pins the header to the wrapper's scroll — sorting is a property of the column, and a reader three hundred rows down has no header on screen to remind them which one it was.", html: `<div class="ns-table-wrap" tabindex="0" style="max-block-size:12rem"><table class="ns-table ns-table--compact ns-table--sticky ns-table--head-filled">
  <thead><tr>
    <th scope="col">Lesson</th>
    <th scope="col">Duration</th>
    <th scope="col" class="ns-table__num" aria-sort="descending"><button type="button" class="ns-table__sort">Score</button></th>
  </tr></thead>
  <tbody>
    <tr><td>Your first org</td><td>12:04</td><td class="ns-table__num">100</td></tr>
    <tr><td>Objects &amp; fields</td><td>18:30</td><td class="ns-table__num">92</td></tr>
    <tr><td>SOQL basics</td><td>21:15</td><td class="ns-table__num">78</td></tr>
    <tr><td>Apex triggers</td><td>26:40</td><td class="ns-table__num">64</td></tr>
    <tr><td>Flow builder</td><td>19:02</td><td class="ns-table__num">55</td></tr>
    <tr><td>Integration</td><td>31:18</td><td class="ns-table__num">41</td></tr>
  </tbody>
</table></div>` },
      { name: "The full data table", stack: true, note: "Toolbar, selection column, row actions, totals and a footer count — all inside the wrapper, so the box frames the whole apparatus as one object instead of leaving three loose elements stacked on the page. The actions reveal on hover <em>and</em> focus-within, at a reserved width so revealing them does not reflow the table.", html: `<div class="ns-table-wrap">
  <div class="ns-table__toolbar">
    <span class="ns-table__toolbar-title">Enrolments</span>
    <span class="ns-table__count">2 selected</span>
    <span class="ns-table__toolbar-end">
      <button class="ns-btn ns-btn--outline ns-btn--xs">Export</button>
      <button class="ns-btn ns-btn--primary ns-btn--xs">Invite</button>
    </span>
  </div>
  <table class="ns-table ns-table--compact">
    <thead><tr>
      <th scope="col" class="ns-table__select"><input type="checkbox" class="ns-checkbox" aria-label="Select all rows"></th>
      <th scope="col">Learner</th>
      <th scope="col">Track</th>
      <th scope="col" class="ns-table__num">Progress</th>
      <th scope="col"><span class="ns-visually-hidden">Actions</span></th>
    </tr></thead>
    <tbody>
      <tr aria-selected="true">
        <td class="ns-table__select"><input type="checkbox" class="ns-checkbox" checked aria-label="Select Priya Nair"></td>
        <td><span class="ns-table__stack"><span class="ns-table__strong">Priya Nair</span><span class="ns-table__sub">priya@example.com</span></span></td>
        <td class="ns-table__code">ADMIN-201</td>
        <td class="ns-table__num">82%</td>
        <td class="ns-table__actions"><button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--xs" aria-label="Edit Priya Nair"><i class="ph ph-pen-nib" aria-hidden="true"></i></button></td>
      </tr>
      <tr aria-selected="true">
        <td class="ns-table__select"><input type="checkbox" class="ns-checkbox" checked aria-label="Select Arun Menon"></td>
        <td><span class="ns-table__stack"><span class="ns-table__strong">Arun Menon</span><span class="ns-table__sub">arun@example.com</span></span></td>
        <td class="ns-table__code">DEV-101</td>
        <td class="ns-table__num">100%</td>
        <td class="ns-table__actions"><button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--xs" aria-label="Edit Arun Menon"><i class="ph ph-pen-nib" aria-hidden="true"></i></button></td>
      </tr>
      <tr>
        <td class="ns-table__select"><input type="checkbox" class="ns-checkbox" aria-label="Select Kavya Rao"></td>
        <td><span class="ns-table__stack"><span class="ns-table__strong">Kavya Rao</span><span class="ns-table__sub">kavya@example.com</span></span></td>
        <td class="ns-table__code">DEV-101</td>
        <td class="ns-table__num">47%</td>
        <td class="ns-table__actions"><button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--xs" aria-label="Edit Kavya Rao"><i class="ph ph-pen-nib" aria-hidden="true"></i></button></td>
      </tr>
    </tbody>
    <tfoot><tr><td colspan="3">3 learners</td><td class="ns-table__num">76%</td><td></td></tr></tfoot>
  </table>
  <div class="ns-table__footer">
    <span class="ns-table__count">1–3 of 128</span>
    <span class="ns-table__toolbar-end">
      <button class="ns-btn ns-btn--outline ns-btn--xs" disabled>Previous</button>
      <button class="ns-btn ns-btn--outline ns-btn--xs">Next</button>
    </span>
  </div>
</div>` },
      { name: "Rows as links", stack: true, note: "The clickable thing stays a real <code>&lt;a&gt;</code> in the first cell, stretched over its row — a row-level click handler is invisible to the keyboard and to a screen reader, and cannot be opened in a new tab. The caret in the last cell appears on hover and on focus-within, so the affordance reaches both.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--rowlink">
  <thead><tr><th scope="col">Course</th><th scope="col">Lessons</th><th scope="col" class="ns-table__num">Enrolled</th></tr></thead>
  <tbody>
    <tr><td><a class="ns-table__link ns-table__link--stretch" href="#">Salesforce Admin 201</a></td><td>34</td><td class="ns-table__num">1,204</td></tr>
    <tr><td><a class="ns-table__link ns-table__link--stretch" href="#">Apex Development 101</a></td><td>28</td><td class="ns-table__num">862</td></tr>
  </tbody>
</table></div>` },
      { name: "Empty", stack: true, note: "An empty table keeps its header — the columns are information about what <em>would</em> be here, and a table that collapses to a bare sentence has thrown that away.", html: `<div class="ns-table-wrap"><table class="ns-table">
  <thead><tr><th scope="col">Learner</th><th scope="col">Track</th><th scope="col" class="ns-table__num">Progress</th></tr></thead>
  <tbody><tr><td class="ns-table__empty" colspan="3">
    <span class="ns-table__empty-title">No enrolments yet</span>
    Invite your first learner and they will appear here.
  </td></tr></tbody>
</table></div>` },
      { name: "Stacked on small screens", stack: true, note: "The default answer for a wide table on a phone is the scrolling wrapper. This is the other one: below 48rem each row becomes a small card and each cell prints its own column label from <code>data-label</code>. Right when a row is an <em>entity</em> the reader acts on; wrong when the table is a grid of figures compared down the column, because stacking destroys the column, which was the comparison. Narrow the window to see it.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--stacked">
  <thead><tr><th scope="col">Invoice</th><th scope="col">Date</th><th scope="col">Status</th><th scope="col" class="ns-table__num">Amount</th></tr></thead>
  <tbody>
    <tr><td data-label="Invoice" class="ns-table__code">INV-20841</td><td data-label="Date">12 Aug 2026</td><td data-label="Status"><span class="ns-status ns-status--success">Paid</span></td><td data-label="Amount" class="ns-table__num">₹4,999</td></tr>
    <tr data-state="warning"><td data-label="Invoice" class="ns-table__code">INV-20842</td><td data-label="Date">19 Aug 2026</td><td data-label="Status"><span class="ns-status ns-status--warning">Due</span></td><td data-label="Amount" class="ns-table__num">₹9,499</td></tr>
  </tbody>
</table></div>` },
      { name: "Zebra — opt-in only", stack: true, note: "The base does not stripe: striping is a second structuring device competing with the hairline, and with mono numerals the rows already read as rows. <code>--zebra</code> exists for the one case that argument does not cover — a wide table that scrolls sideways, where the eye travels a long way from the row label to the cell. If the table fits on screen without scrolling, the answer is no. Scroll this one to see why.", html: `<div class="ns-table-wrap" tabindex="0"><table class="ns-table ns-table--compact ns-table--zebra ns-table--stickycol" style="min-inline-size:52rem">
  <thead><tr><th scope="col">Learner</th><th scope="col">W1</th><th scope="col">W2</th><th scope="col">W3</th><th scope="col">W4</th><th scope="col">W5</th><th scope="col">W6</th><th scope="col">W7</th><th scope="col" class="ns-table__num">Total</th></tr></thead>
  <tbody>
    <tr><th scope="row">Priya Nair</th><td>8</td><td>9</td><td>7</td><td>10</td><td>9</td><td>8</td><td>10</td><td class="ns-table__num">61</td></tr>
    <tr><th scope="row">Arun Menon</th><td>10</td><td>10</td><td>9</td><td>9</td><td>10</td><td>10</td><td>9</td><td class="ns-table__num">67</td></tr>
    <tr><th scope="row">Kavya Rao</th><td>6</td><td>5</td><td>7</td><td>4</td><td>6</td><td>5</td><td>7</td><td class="ns-table__num">40</td></tr>
    <tr><th scope="row">Dev Sharma</th><td>4</td><td>6</td><td>3</td><td>5</td><td>4</td><td>6</td><td>5</td><td class="ns-table__num">33</td></tr>
  </tbody>
</table></div>` },
      { name: "Key / value", stack: true, note: "A spec table whose first column is the label. Related to Definition list — use this when the rest of the page is already tabular.", html: `<div class="ns-table-wrap"><table class="ns-table ns-table--keyvalue">
  <tbody>
    <tr><th scope="row">API version</th><td>v62.0</td></tr>
    <tr><th scope="row">Edition</th><td>Enterprise</td></tr>
    <tr><th scope="row">Org ID</th><td>00D5j000000abcAAA</td></tr>
  </tbody>
</table></div>` },
      { name: "Cell utilities", stack: true, note: "The per-cell classes, all in one table. <code>__lede</code> is a cell holding an avatar beside its label; <code>__trunc</code> caps a free-text column at 18rem and ellipses it — the class exists so the PRODUCT decides which column is worth the width, because only the product knows; <code>__center</code> and <code>__quiet</code> are alignment and de-emphasis. <code>--fixed</code> is the one that matters on a live list: with <code>table-layout: fixed</code> the columns are decided by the header rather than by the widest cell, so a row arriving from the server does not shift every column and lose the reader their place.", html: `<div class="ns-table-wrap ns-table-wrap--flush"><table class="ns-table ns-table--compact ns-table--fixed ns-table--bordered">
  <thead>
    <tr>
      <th scope="col" rowspan="2">Member</th>
      <th class="ns-table__group" scope="colgroup" colspan="2">This month</th>
      <th class="ns-table__center" scope="col" rowspan="2">Plan</th>
    </tr>
    <tr>
      <th class="ns-table__num" scope="col">Lessons</th>
      <th class="ns-table__num" scope="col">Hours</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><span class="ns-table__lede"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">RK</span><span class="ns-table__trunc">Ravi Kulkarni — Technical Architect, Bengaluru</span></span></td>
      <td class="ns-table__num">31</td>
      <td class="ns-table__num ns-table__quiet">12.4</td>
      <td class="ns-table__center">Pro</td>
    </tr>
    <tr>
      <td><span class="ns-table__lede"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">AM</span><span class="ns-table__trunc">Anita Menon — Platform Developer, Kochi</span></span></td>
      <td class="ns-table__num">18</td>
      <td class="ns-table__num ns-table__quiet">7.1</td>
      <td class="ns-table__center ns-table__quiet">Free</td>
    </tr>
  </tbody>
</table></div>` },
      { name: "Default", html: `<div class="ns-table-wrap" tabindex="0" style="max-inline-size:28rem">
  <table class="ns-table">
    <thead><tr><th scope="col">Lesson</th><th scope="col">Duration</th><th scope="col" class="ns-table__num">Score</th></tr></thead>
    <tbody>
      <tr><td>Your first org</td><td>12:04</td><td class="ns-table__num">100</td></tr>
      <tr><td>Objects &amp; fields</td><td>18:30</td><td class="ns-table__num">92</td></tr>
      <tr><td>SOQL basics</td><td>21:15</td><td class="ns-table__num">78</td></tr>
    </tbody>
  </table>
</div>` },
    ],
  },

  /* ===================================================== Navigation ==== */
  {
    id: "tabs", title: "Tabs", family: "Navigation",
    summary: "Hairline underline, never a filled pill — the current tab is not an action, you are already there. The 2px underline is drawn transparent at rest so selecting never shifts the row.",
    use: ["Peer views of one thing: Overview / Curriculum / Resources"],
    not: ["Steps in a sequence — Steps or a wizard", "Navigation between pages — links"],
    a11y: ["Roving tabindex: only the selected tab is tabbable; arrows move between tabs, Tab leaves to the panel (the React Tabs wires this)"],
    variants: [
      { name: "Vertical", stack: true, note: "aria-orientation=\"vertical\" is not decoration — tabs.js reads it to swap the arrow keys, and a vertical tablist answering to Left/Right is a keyboard trap in slow motion.", html: `<div class="ns-tabs-layout">
  <div class="ns-tabs ns-tabs--vertical" role="tablist" aria-orientation="vertical" aria-label="Settings">
    <button class="ns-tab" role="tab" aria-selected="true" aria-controls="vt-1" id="vtab-1">Profile</button>
    <button class="ns-tab" role="tab" aria-selected="false" aria-controls="vt-2" id="vtab-2">Security</button>
    <button class="ns-tab" role="tab" aria-selected="false" aria-controls="vt-3" id="vtab-3">Billing</button>
  </div>
  <div role="tabpanel" id="vt-1" aria-labelledby="vtab-1" tabindex="0"><p class="ns-card__text">Name, avatar and the public bits.</p></div>
  <div role="tabpanel" id="vt-2" aria-labelledby="vtab-2" tabindex="0"><p class="ns-card__text">Password, sessions, two-factor.</p></div>
  <div role="tabpanel" id="vt-3" aria-labelledby="vtab-3" tabindex="0"><p class="ns-card__text">Plan and invoices.</p></div>
</div>` },
      { name: "Pill", stack: true, note: "For switching a RENDERING rather than a section of content. If the thing being switched is a view, consider Segmented control instead.", html: `<div class="ns-tabs ns-tabs--pill" role="tablist" aria-label="View">
  <button class="ns-tab" role="tab" aria-selected="true" aria-controls="pt-1" id="ptab-1">Grid</button>
  <button class="ns-tab" role="tab" aria-selected="false" aria-controls="pt-2" id="ptab-2">List</button>
</div>
<div role="tabpanel" id="pt-1" aria-labelledby="ptab-1" tabindex="0"><p class="ns-card__text">Cards in a grid.</p></div>
<div role="tabpanel" id="pt-2" aria-labelledby="ptab-2" tabindex="0"><p class="ns-card__text">Rows in a list.</p></div>` },
      { name: "Icons and counts", stack: true, note: "The label always stays — an icon-only tab row is a memory test. A count is the one extra thing a tab can carry without becoming a menu.", html: `<div class="ns-tabs" role="tablist" aria-label="Inbox">
  <button class="ns-tab" role="tab" aria-selected="true" aria-controls="it-1" id="itab-1"><i class="ph ph-chat-circle ns-tab__icon" aria-hidden="true"></i>Comments<span class="ns-tab__count">12</span></button>
  <button class="ns-tab" role="tab" aria-selected="false" aria-controls="it-2" id="itab-2"><i class="ph ph-flag ns-tab__icon" aria-hidden="true"></i>Flagged<span class="ns-tab__count">3</span></button>
</div>
<div role="tabpanel" id="it-1" aria-labelledby="itab-1" tabindex="0"><p class="ns-card__text">Twelve comments.</p></div>
<div role="tabpanel" id="it-2" aria-labelledby="itab-2" tabindex="0"><p class="ns-card__text">Three flagged.</p></div>` },
      { name: "Default", html: `<div class="ns-tabs" role="tablist" style="max-inline-size:26rem">
  <button class="ns-tab" role="tab" aria-selected="true">Overview</button>
  <button class="ns-tab" role="tab" aria-selected="false" tabindex="-1">Curriculum</button>
  <button class="ns-tab" role="tab" aria-selected="false" tabindex="-1">Resources</button>
</div>` },
    ],
  },
  {
    id: "accordion", title: "Accordion", family: "Navigation",
    summary: "Native <details>/<summary> — open state, keyboard toggle and find-in-page expansion come from the platform. A button+div rebuild loses Ctrl+F reaching collapsed content, which on a docs site is a real loss.",
    use: ["FAQs, curriculum sections, progressive disclosure"],
    not: ["Content everyone needs — just show it"],
    a11y: ["Give items the same name attribute for native exclusive-open behaviour"],
    variants: [
      { name: "Flush", stack: true, note: "No outer box, rules only — for a FAQ inside prose, where a boxed accordion reads as a widget dropped into the article.", html: `<div class="ns-accordion ns-accordion--flush">
  <details class="ns-accordion__item" open><summary class="ns-accordion__summary">Do I need a developer org?<i class="ph ph-caret-down ns-accordion__marker" aria-hidden="true"></i></summary><div class="ns-accordion__content">Yes, and it is free. Sign up before the first lesson.</div></details>
  <details class="ns-accordion__item"><summary class="ns-accordion__summary">Is there a certificate?<i class="ph ph-caret-down ns-accordion__marker" aria-hidden="true"></i></summary><div class="ns-accordion__content">On track completion, with a verifiable credential ID.</div></details>
</div>` },
      { name: "Separated, plus marker", stack: true, note: "--plus rotates a plus into a cross: it reads as “expand” rather than “reveal below”, which is better when the panel is long enough that the reader scrolls away from the trigger.", html: `<div class="ns-accordion ns-accordion--separated ns-accordion--plus">
  <details class="ns-accordion__item"><summary class="ns-accordion__summary">Module 1 — Objects and fields<i class="ph ph-plus ns-accordion__marker" aria-hidden="true"></i></summary><div class="ns-accordion__content">Six units covering the data model.</div></details>
  <details class="ns-accordion__item" open><summary class="ns-accordion__summary">Module 2 — Security<i class="ph ph-plus ns-accordion__marker" aria-hidden="true"></i></summary><div class="ns-accordion__content">Profiles, permission sets, sharing.</div></details>
</div>` },
      { name: "Numbered", note: "The mono index motif on the summary row.", html: `<div class="ns-accordion" style="max-inline-size:28rem">
  <details class="ns-accordion__item" open>
    <summary class="ns-accordion__summary"><span class="ns-accordion__index">01</span>What is an org?</summary>
    <div class="ns-accordion__content">Your own Salesforce instance — data, users, and code, isolated from everyone else's.</div>
  </details>
  <details class="ns-accordion__item">
    <summary class="ns-accordion__summary"><span class="ns-accordion__index">02</span>Objects and fields</summary>
    <div class="ns-accordion__content">Standard and custom objects.</div>
  </details>
</div>` },
    ],
  },
  {
    id: "breadcrumb", title: "Breadcrumb", family: "Navigation",
    summary: "Where you are, as mono kicker links. The separator is a pseudo-element so it is never read aloud; the last crumb is text with aria-current, not a link to where you already are.",
    use: ["Course > section > lesson depth"],
    not: ["Single-level sites"],
    a11y: ["Wrapped in <nav aria-label=\"Breadcrumb\">"],
    variants: [
      { name: "Default", html: `<nav aria-label="Breadcrumb">
  <ol class="ns-breadcrumb">
    <li class="ns-breadcrumb__item"><a class="ns-breadcrumb__link" href="#">Courses</a></li>
    <li class="ns-breadcrumb__item"><a class="ns-breadcrumb__link" href="#">Apex</a></li>
    <li class="ns-breadcrumb__item"><span class="ns-breadcrumb__link" aria-current="page">Triggers</span></li>
  </ol>
</nav>` },
    ],
  },
  {
    id: "pagination", title: "Pagination", family: "Navigation",
    summary: "Real links — Ghost paginates server-side, and links stay crawlable and middle-clickable. First, last, current ±1; the rest elides.",
    use: ["Blog and catalog pages"],
    not: ["Infinite feeds"],
    a11y: ["aria-current=\"page\" on the current number; icon links carry visually-hidden names"],
    variants: [
      { name: "With prev and next", stack: true, note: "Labelled controls, not bare arrows: “‹ ›” alone is unreadable to a screen reader and ambiguous in RTL. The disabled end stays in the DOM so the row does not reflow.", html: `<nav class="ns-pagination" aria-label="Pages">
  <a class="ns-pagination__step" href="#0" aria-disabled="true"><i class="ph ph-caret-left" aria-hidden="true"></i>Prev</a>
  <a class="ns-pagination__link" href="#0" aria-current="page">1</a>
  <a class="ns-pagination__link" href="#0">2</a>
  <a class="ns-pagination__link" href="#0">3</a>
  <span class="ns-pagination__ellipsis">&hellip;</span>
  <a class="ns-pagination__link" href="#0">24</a>
  <a class="ns-pagination__step" href="#0">Next<i class="ph ph-caret-right" aria-hidden="true"></i></a>
</nav>` },
      { name: "Compact", stack: true, note: "For mobile, and for any set where numbered links would wrap to two rows.", html: `<nav class="ns-pagination ns-pagination--compact" aria-label="Pages">
  <a class="ns-pagination__step" href="#0"><i class="ph ph-caret-left" aria-hidden="true"></i>Prev</a>
  <span class="ns-pagination__status">Page 3 of 24</span>
  <a class="ns-pagination__step" href="#0">Next<i class="ph ph-caret-right" aria-hidden="true"></i></a>
</nav>` },
      { name: "Default", html: `<nav aria-label="Pagination">
  <ul class="ns-pagination">
    <li><a class="ns-pagination__link" href="#" rel="prev"><i class="ph ph-caret-left" aria-hidden="true"></i><span class="ns-visually-hidden">Previous page</span></a></li>
    <li><a class="ns-pagination__link" href="#" aria-label="Page 1">1</a></li>
    <li><a class="ns-pagination__link" href="#" aria-current="page" aria-label="Page 2">2</a></li>
    <li><a class="ns-pagination__link" href="#" aria-label="Page 3">3</a></li>
    <li><span class="ns-pagination__ellipsis" aria-hidden="true">…</span></li>
    <li><a class="ns-pagination__link" href="#" aria-label="Page 9">9</a></li>
    <li><a class="ns-pagination__link" href="#" rel="next"><span class="ns-visually-hidden">Next page</span><i class="ph ph-caret-right" aria-hidden="true"></i></a></li>
  </ul>
</nav>` },
    ],
  },
  {
    id: "sidebar", title: "Docs sidebar", family: "Navigation",
    summary: "Grouped links under mono kickers; the active page gets the left accent line — the row equivalent of the card's top accent. Sticky beside content ≥ lg, a drawer below.",
    use: ["Documentation hubs, settings sections"],
    not: ["3–4 links — Tabs"],
    a11y: ["aria-current=\"page\" is both the style hook and the announcement"],
    variants: [
      { name: "Default", html: `<nav class="ns-sidebar" aria-label="Documentation" style="position:static; max-inline-size:14rem">
  <div class="ns-sidebar__group">
    <span class="ns-sidebar__label">Getting started</span>
    <a class="ns-sidebar__link" href="#">Your first org</a>
    <a class="ns-sidebar__link" href="#" aria-current="page">Objects &amp; fields</a>
    <a class="ns-sidebar__link" href="#">Relationships</a>
  </div>
  <div class="ns-sidebar__group">
    <span class="ns-sidebar__label">Apex</span>
    <a class="ns-sidebar__link" href="#">Triggers</a>
    <a class="ns-sidebar__link" href="#">Testing</a>
  </div>
</nav>` },
    ],
  },

  /* ======================================================= Overlays ==== */
  {
    id: "modal", title: "Modal", family: "Overlays",
    summary: "Built on <dialog> and opened with showModal() — the focus trap, inert background, Esc handling and top layer come from the platform, not from hand-written JS. Footer actions end-aligned, confirm last.",
    use: ["A decision that blocks the flow; a focused sub-task"],
    not: ["Content that could be a page — modals are where content goes to be lost", "Non-blocking panels — Drawer"],
    a11y: ["aria-labelledby ties the title to the dialog; focus returns to the trigger on close", "In a destructive confirm, Cancel is focused first — Enter must never destroy"],
    variants: [
      { name: "Live demo", note: "Click to open — Esc, the ✕ and the backdrop all close it.", script: `(function(){var w=document.currentScript.previousElementSibling;var d=w.querySelector('dialog');w.querySelector('[data-open]').addEventListener('click',function(){d.showModal()});d.addEventListener('click',function(e){if(e.target===d)d.close()});w.querySelector('[data-close]').addEventListener('click',function(){d.close()});})();`, html: `<div>
<button class="ns-btn ns-btn--outline" data-open>Open modal</button>
<dialog class="ns-modal" aria-labelledby="dm-t">
  <div class="ns-modal__header">
    <div><h2 class="ns-modal__title" id="dm-t">Reset this lesson?</h2></div>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm ns-modal__close" aria-label="Close dialog" data-close>
      <i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <div class="ns-modal__body"><p style="padding-block-end:var(--space-4)">Your quiz score and notes for this lesson will be cleared. Course progress is kept.</p></div>
  <div class="ns-modal__footer">
    <button class="ns-btn ns-btn--outline" data-close autofocus>Cancel</button>
    <button class="ns-btn ns-btn--danger-solid">Reset lesson</button>
  </div>
</dialog>
</div>` },
    ],
  },
  {
    id: "drawer", title: "Drawer", family: "Overlays",
    summary: "An edge-anchored <dialog> — same trap, Esc and top layer as Modal. Mobile navigation and the docs sidebar below lg live here.",
    use: ["Mobile nav, filter panels, secondary detail"],
    not: ["Blocking decisions — Modal, centered"],
    a11y: ["Identical dialog semantics to Modal — nothing extra to wire"],
    variants: [
      { name: "Live demo", script: `(function(){var w=document.currentScript.previousElementSibling;var d=w.querySelector('dialog');w.querySelector('[data-open]').addEventListener('click',function(){d.showModal()});d.addEventListener('click',function(e){if(e.target===d)d.close()});w.querySelector('[data-close]').addEventListener('click',function(){d.close()});})();`, html: `<div>
<button class="ns-btn ns-btn--outline" data-open><i class="ph ph-list" aria-hidden="true"></i> Open drawer</button>
<dialog class="ns-drawer ns-drawer--start" aria-label="Menu">
  <div class="ns-drawer__header">
    <strong>Menu</strong>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" style="margin-inline-start:auto" aria-label="Close menu" data-close>
      <i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <div class="ns-drawer__body">
    <a class="ns-menu__item" href="#">Courses</a>
    <a class="ns-menu__item" href="#">Training</a>
    <a class="ns-menu__item" href="#">Docs</a>
  </div>
</dialog>
</div>` },
    ],
  },
  {
    id: "menu", title: "Menu", family: "Overlays",
    summary: "Dropdown on the popover attribute — light dismiss (outside click / Esc) and top layer from the browser, no document-level listener to leak. Items are real buttons/links, so Enter and Space already work.",
    use: ["Overflow actions (⋯), account menus"],
    not: ["Choosing a form value — Select", "More than ~8 actions — rethink the screen"],
    a11y: ["role=\"menu\"/\"menuitem\"; arrows move focus (the React Menu wires roving focus)", "A destructive item uses the error ink AND says what it does"],
    variants: [
      { name: "Live demo", note: "Pure HTML — popovertarget needs no script at all.", html: `<button class="ns-btn ns-btn--outline ns-btn--sm" popovertarget="demo-menu">Actions <i class="ph ph-caret-down" aria-hidden="true"></i></button>
<div id="demo-menu" popover="auto" role="menu" class="ns-popover ns-menu">
  <div class="ns-menu__label">Lesson</div>
  <button class="ns-menu__item" role="menuitem"><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i> Restart</button>
  <button class="ns-menu__item" role="menuitem"><i class="ph ph-arrow-down" aria-hidden="true"></i> Download notes</button>
  <hr class="ns-menu__sep">
  <button class="ns-menu__item ns-menu__item--danger" role="menuitem"><i class="ph ph-trash" aria-hidden="true"></i> Clear progress</button>
</div>` },
    ],
  },
  {
    id: "tooltip", title: "Tooltip", family: "Overlays",
    summary: "Supplementary hover/focus text in the mono label voice. It may never carry a control's only name — hover-only content is unreachable by touch. No visible label means the control needs aria-label, not a tooltip.",
    use: ["A detail on top of a visible label (\"Saved 2 min ago\")"],
    not: ["The only label of an icon button"],
    a11y: ["Shows on focus-within as well as hover — keyboard users never hover", "aria-describedby links it to the trigger"],
    variants: [
      { name: "Hover or focus the button", html: `<span class="ns-tooltip-host">
  <button class="ns-btn ns-btn--outline ns-btn--sm" aria-describedby="tt-1">Saved</button>
  <span class="ns-tooltip" id="tt-1" role="tooltip" style="inset-block-start:calc(100% + 6px)">2 minutes ago</span>
</span>` },
    ],
  },

  /* ======================================================= Surfaces ==== */
  {
    id: "signin", title: "Sign in", family: "Form patterns",
    summary: "The sign-in card in the .ns-auth shell: password plus a magic-link alternative under one divider. Ghost is passwordless (templates/signin-form.html); the Next.js app renders the password form — same markup, one brand.",
    use: ["The one screen whose single job is signing in"],
    not: ["In-page account settings — the account panel", "Sign up — its own page, its own promises"],
    a11y: ["Sign-in errors never say WHICH field was wrong — that confirms account existence to a guesser", "autocomplete=\"current-password\" is what makes password managers work"],
    variants: [
      { name: "Sign-in card", html: `<div class="ns-auth__card" style="max-inline-size:22rem">
  <p class="ns-auth__kicker">sign in</p>
  <h2 class="ns-auth__title" style="font-size:var(--size-h3)">Welcome back</h2>
  <form class="ns-auth__form" onsubmit="return false">
    <div class="ns-field">
      <label class="ns-field__label" for="au-e">Email address</label>
      <input class="ns-input" id="au-e" type="email" autocomplete="email">
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="au-p">Password</label>
      <input class="ns-input" id="au-p" type="password" autocomplete="current-password">
    </div>
    <div class="ns-auth__meta">
      <label class="ns-choice" style="padding:0"><input type="checkbox" class="ns-checkbox" checked>
        <span class="ns-choice__text"><span class="ns-choice__label">Remember me</span></span></label>
      <a href="#">Forgot password?</a>
    </div>
    <button class="ns-btn ns-btn--primary ns-btn--block" type="submit">Sign in</button>
    <div class="ns-auth__divider" aria-hidden="true">or</div>
    <button class="ns-btn ns-btn--outline ns-btn--block" type="button">Email me a sign-in link</button>
  </form>
  <p class="ns-auth__alt">New here? <a href="#">Create an account</a></p>
</div>` },
      { name: "Error state", note: "One message above the fields, deliberately vague about which half was wrong.", html: `<div class="ns-auth__card" style="max-inline-size:22rem">
  <p class="ns-auth__kicker">sign in</p>
  <h2 class="ns-auth__title" style="font-size:var(--size-h3)">Welcome back</h2>
  <div class="ns-alert ns-alert--error" role="alert" style="margin-block-end:var(--space-4)">
    <i class="ph ph-warning-circle ns-alert__icon" aria-hidden="true"></i>
    <div class="ns-alert__body"><p class="ns-alert__text">That email and password combination did not match. Try again or use a sign-in link.</p></div>
  </div>
  <form class="ns-auth__form" onsubmit="return false">
    <div class="ns-field">
      <label class="ns-field__label" for="aue-e">Email address</label>
      <input class="ns-input" id="aue-e" type="email" value="swarnil@example.com" autocomplete="email">
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="aue-p">Password</label>
      <input class="ns-input" id="aue-p" type="password" autocomplete="current-password">
    </div>
    <button class="ns-btn ns-btn--primary ns-btn--block" type="submit">Sign in</button>
  </form>
</div>` },
    ],
  },
  {
    id: "signup", title: "Sign up", family: "Form patterns",
    summary: "Create-account card: the shortest form that can honestly create an account — name, email, password with LIVE rules (not a strength bar), and the legal line. Every extra field costs signups; ask later, in the app.",
    use: ["The one create-account screen"],
    not: ["Collecting profile details — onboarding, after the account exists"],
    a11y: ["autocomplete=\"new-password\" tells password managers to OFFER a password", "Password rules are a live list the user can satisfy one by one — announced as they flip"],
    variants: [
      { name: "Sign-up card", html: `<div class="ns-auth__card" style="max-inline-size:22rem">
  <p class="ns-auth__kicker">create account</p>
  <h2 class="ns-auth__title" style="font-size:var(--size-h3)">Start learning free</h2>
  <form class="ns-auth__form" onsubmit="return false">
    <div class="ns-field">
      <label class="ns-field__label" for="su-n">Name</label>
      <input class="ns-input" id="su-n" type="text" autocomplete="name">
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="su-e">Email address</label>
      <input class="ns-input" id="su-e" type="email" autocomplete="email">
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="su-p">Password</label>
      <input class="ns-input" id="su-p" type="password" autocomplete="new-password" aria-describedby="su-rules">
    </div>
    <ul class="ns-auth__rules" id="su-rules" style="list-style:none;padding:0;margin:0">
      <li><span class="ns-status ns-status--success">At least 8 characters</span></li>
      <li><span class="ns-status ns-status--success">Contains a number</span></li>
      <li><span class="ns-status ns-status--idle">Contains a symbol</span></li>
    </ul>
    <button class="ns-btn ns-btn--primary ns-btn--block" type="submit">Create account</button>
  </form>
  <p class="ns-auth__alt">By continuing you agree to the <a href="#">terms</a>. Already learning? <a href="#">Sign in</a></p>
</div>` },
      { name: "Live password rules", note: "Not a strength bar — \"add a symbol\" is actionable, a yellow bar is a mood.", html: `<ul class="ns-auth__rules" style="list-style:none;padding:0;margin:0">
  <li><span class="ns-status ns-status--success">At least 8 characters</span></li>
  <li><span class="ns-status ns-status--success">Contains a number</span></li>
  <li><span class="ns-status ns-status--idle">Contains a symbol</span></li>
</ul>` },
    ],
  },
  {
    id: "reset-password", title: "Reset password", family: "Form patterns",
    summary: "Two tiny screens: request (email only) and set-new-password. The confirmation reads identically whether or not the account exists — the reset flow must never be an account-existence oracle.",
    use: ["Forgot-password request and the link's landing screen"],
    not: ["Changing a known password — account settings, with the current password asked"],
    a11y: ["The confirmation is role=\"status\" and echoes the typed address in mono so the user can catch their own typo", "autocomplete=\"new-password\" on both fields of the set screen"],
    variants: [
      { name: "Request", html: `<div class="ns-auth__card" style="max-inline-size:22rem">
  <p class="ns-auth__kicker">reset password</p>
  <h2 class="ns-auth__title" style="font-size:var(--size-h3)">Forgot your password?</h2>
  <form class="ns-auth__form" onsubmit="return false">
    <div class="ns-field">
      <label class="ns-field__label" for="rp-e">Email address</label>
      <input class="ns-input" id="rp-e" type="email" autocomplete="email">
      <p class="ns-field__help">We'll send a reset link — it expires in one hour.</p>
    </div>
    <button class="ns-btn ns-btn--primary ns-btn--block" type="submit">Send reset link</button>
  </form>
  <p class="ns-auth__alt">Remembered it? <a href="#">Back to sign in</a></p>
</div>` },
      { name: "Sent confirmation", note: "Replaces the form; identical wording whether or not the account exists.", html: `<div class="ns-auth__sent" role="status" style="max-inline-size:22rem">
  <p class="ns-auth__sent-title"><i class="ph ph-check-circle" aria-hidden="true"></i> Check your inbox</p>
  <p>If an account exists for <code>you@example.com</code>, a reset link is on its way. It expires in one hour.</p>
</div>` },
      { name: "Set new password", html: `<div class="ns-auth__card" style="max-inline-size:22rem">
  <p class="ns-auth__kicker">reset password</p>
  <h2 class="ns-auth__title" style="font-size:var(--size-h3)">Choose a new password</h2>
  <form class="ns-auth__form" onsubmit="return false">
    <div class="ns-field">
      <label class="ns-field__label" for="np-1">New password</label>
      <input class="ns-input" id="np-1" type="password" autocomplete="new-password">
    </div>
    <div class="ns-field">
      <label class="ns-field__label" for="np-2">Repeat it</label>
      <input class="ns-input" id="np-2" type="password" autocomplete="new-password">
    </div>
    <button class="ns-btn ns-btn--primary ns-btn--block" type="submit">Set password &amp; sign in</button>
  </form>
</div>` },
    ],
  },
  {
    id: "newsletter", title: "Newsletter", family: "Form patterns",
    summary: "The subscribe pattern: one email field, one button, the promise in the help line. Both response messages exist in the DOM from the start (hidden) — a live region created together with its message announces nothing. Ghost's data-members-* hooks work as-is.",
    use: ["Blog footers, article ends, the CTA band's form variant"],
    not: ["Multi-field lead capture — that is a real form with its own page"],
    a11y: ["The label is real; the placeholder is an example, not the label", "Success is role=\"status\", failure role=\"alert\" — pre-rendered, then unhidden"],
    variants: [
      { name: "Inline", note: "The one-liner for article feet and footers.", html: `<form class="ns-field" style="max-inline-size:26rem;inline-size:100%" onsubmit="return false">
  <label class="ns-field__label" for="nl-e">Email address</label>
  <div style="display:flex;gap:var(--space-2);flex-wrap:wrap">
    <input class="ns-input" id="nl-e" type="email" autocomplete="email" placeholder="you@example.com" style="flex:1;min-inline-size:12rem">
    <button class="ns-btn ns-btn--primary" type="submit">Subscribe</button>
  </div>
  <p class="ns-field__help">Weekly Salesforce lessons. Unsubscribe any time.</p>
</form>` },
      { name: "In the CTA band", note: "The dark band closing a page, with the form as its action.", dark: true, html: `<div style="text-align:center;inline-size:100%;max-inline-size:30rem;margin-inline:auto">
  <span class="ns-kicker">// newsletter</span>
  <h2 style="color:var(--color-on-brand);font-size:var(--size-h3);margin-block:var(--space-2) var(--space-4)">One lesson a week, in your inbox</h2>
  <form style="display:flex;gap:var(--space-2);flex-wrap:wrap;justify-content:center" onsubmit="return false">
    <input class="ns-input" type="email" aria-label="Email address" placeholder="you@example.com" style="flex:1;min-inline-size:12rem">
    <button class="ns-btn ns-btn--white" type="submit">Subscribe</button>
  </form>
</div>` },
      { name: "Success / failure messages", note: "Rendered hidden from the start; JS only flips the hidden attribute.", html: `<p class="ns-field__help" role="status">Check your inbox — the confirmation link is on its way.</p>
<p class="ns-field__error" role="alert">That did not work. Check the address and try again.</p>` },
    ],
  },
  {
    id: "ticket", title: "Helpdesk tickets", family: "Surfaces",
    summary: "Raise-a-ticket, ticket list and thread. The console voice doing its native job — a ticket IS a record, so the mono #0042, the status dot and the terminal rows are structure, not decoration.",
    use: ["Support for the LMS: broken lessons, org trouble, billing"],
    not: ["Live chat — this is an asynchronous record"],
    a11y: ["Priority is a real radio fieldset — arrows work natively, the group announces as one question", "Urgent alone may wear the error hue, and only once selected"],
    variants: [
      { name: "Ticket list", note: "Real links; urgent carries the 3px leading edge.", html: `<div class="ns-tickets" style="max-inline-size:34rem">
  <a class="ns-ticket ns-ticket--urgent" href="#">
    <span class="ns-ticket__id">#0042</span>
    <span class="ns-ticket__body">
      <span class="ns-ticket__subject">Lesson 07 video will not load</span>
      <span class="ns-ticket__excerpt">Player spins forever, tried two browsers…</span>
    </span>
    <span class="ns-status ns-status--info">In progress</span>
    <time class="ns-ticket__when">2h ago</time>
  </a>
  <a class="ns-ticket" href="#">
    <span class="ns-ticket__id">#0038</span>
    <span class="ns-ticket__body"><span class="ns-ticket__subject">Certificate name spelled wrong</span></span>
    <span class="ns-status ns-status--success">Resolved</span>
    <time class="ns-ticket__when">4d ago</time>
  </a>
</div>` },
      { name: "Priority picker", html: `<div class="ns-priority-row" style="max-inline-size:24rem">
  <label class="ns-priority"><input type="radio" name="pr-d" value="low"><span>Low</span></label>
  <label class="ns-priority"><input type="radio" name="pr-d" value="normal" checked><span>Normal</span></label>
  <label class="ns-priority"><input type="radio" name="pr-d" value="high"><span>High</span></label>
  <label class="ns-priority ns-priority--urgent"><input type="radio" name="pr-d" value="urgent"><span>Urgent</span></label>
</div>` },
      { name: "Thread", note: "Agent = brand edge, note = warning edge — and both say what they are in words.", html: `<div class="ns-thread" style="max-inline-size:30rem">
  <article class="ns-msg">
    <header class="ns-msg__head"><span>Priya</span><time>2h ago</time></header>
    <div class="ns-msg__body">Console shows a 403 on the manifest.</div>
  </article>
  <article class="ns-msg ns-msg--agent">
    <header class="ns-msg__head"><span>Dev</span><span>· support</span><time>1h ago</time></header>
    <div class="ns-msg__body">That URL rotated this morning — hard-refresh and try again?</div>
  </article>
</div>` },
      { name: "Attachment target", html: `<label class="ns-attach" style="max-inline-size:24rem">
  <i class="ph ph-folder-open" aria-hidden="true"></i> Attach a screenshot (optional)
  <input type="file">
</label>` },
    ],
  },
  {
    id: "course-card", title: "Course card", family: "LMS",
    summary: "The Card with course anatomy: level tag riding the media, mono meta row, and a progress foot with the real <progress> element. A row of these is the catalog; one with progress is \"continue learning\".",
    use: ["Catalog grids, related-course shelves, continue-learning rows"],
    not: ["The course detail hero — that page IS the course, no card around it"],
    a11y: ["The title link is stretched over the card — one real link", "progress carries an aria-label with the human numbers"],
    variants: [
      { name: "Default", html: `<div class="ns-card ns-ccard" style="max-inline-size:18rem">
  <span class="ns-ccard__mediawrap">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-tag ns-ccard__level">Beginner</span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Apex basics</span></a>
    <p class="ns-card__text">The platform's own language, from zero to first deploy.</p>
    <span class="ns-ccard__meta"><span>12 lessons</span><span>3h 40m</span></span>
  </div>
</div>` },
      { name: "With progress", note: "Continue learning: the foot swaps meta for the real progress element.", html: `<div class="ns-card ns-ccard" style="max-inline-size:18rem">
  <span class="ns-ccard__mediawrap">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-tag ns-ccard__level">Intermediate</span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Flows, end to end</span></a>
    <span class="ns-ccard__meta"><span>Next: 07 · Approval flows</span></span>
  </div>
  <div class="ns-ccard__progress">
    <progress class="ns-progress" value="6" max="12" aria-label="6 of 12 lessons complete"></progress>
    <span class="ns-ccard__pct">6/12</span>
  </div>
</div>` },
      { name: "Row — continue learning", note: "The horizontal form for the dashboard's resume shelf.", html: `<div class="ns-card ns-card--row ns-ccard" style="max-inline-size:30rem">
  <span class="ns-card__media ns-ph" aria-hidden="true"></span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Continue</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Admin certification path</span></a>
    <span class="ns-ccard__meta"><span>Lesson 08 of 14</span><span>21:15 left</span></span>
    <progress class="ns-progress" value="8" max="14" aria-label="8 of 14 lessons complete"></progress>
  </div>
</div>` },
      { name: "Members-only", note: "Locked stays a real link — to the join page; the lock is a tag, never an overlay wash.", html: `<div class="ns-card ns-ccard" style="max-inline-size:18rem">
  <span class="ns-ccard__mediawrap">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-tag ns-ccard__level"><i class="ph ph-lock-simple" aria-hidden="true"></i> Members</span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Bulk-safe Apex patterns</span></a>
    <span class="ns-ccard__meta"><span>9 lessons</span><span>2h 10m</span></span>
  </div>
</div>` },
          { name: "Full meta", note: "Everything a card can carry, so the parts are visible in one place: a corner flag, the runtime chip on the media, the play affordance, rating, learner count, level, authors and price. A real card picks three or four of these — this is the vocabulary, not a recommendation. The rating's NUMBER comes first in the DOM; the stars are decoration over it.", html: `<div class="ns-card ns-ccard" style="max-inline-size:19rem">
  <span class="ns-ccard__mediawrap">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-tag ns-ccard__level">Beginner</span>
    <span class="ns-ccard__badge">Bestseller</span>
    <span class="ns-ccard__dur">3h 40m</span>
    <span class="ns-ccard__play" aria-hidden="true"><i class="ph ph-play-circle"></i></span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Apex basics, end to end</span></a>
    <p class="ns-card__text">The platform's own language, from zero to first deploy.</p>
    <span class="ns-rating" data-value="4.8" data-of="5">
      <span class="ns-rating__value">4.8</span>
      <span class="ns-rating__stars" aria-hidden="true">
        <span><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i></span>
        <span class="ns-rating__fill"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></span>
      </span>
      <span class="ns-rating__count">(1,240)</span>
    </span>
    <span class="ns-ccard__meta">
      <span><i class="ph ph-list" aria-hidden="true"></i>12 lessons</span>
      <span><i class="ph ph-users-three" aria-hidden="true"></i>8,410</span>
      <span><i class="ph ph-globe" aria-hidden="true"></i>English</span>
    </span>
    <span class="ns-authors ns-authors--sm">
      <span class="ns-authors__stack" aria-hidden="true">
        <img class="ns-authors__avatar" src="../assets/logo/favicon.svg" alt="">
        <img class="ns-authors__avatar" src="../assets/logo/favicon.svg" alt="">
        <span class="ns-authors__more">+2</span>
      </span>
      <span class="ns-authors__names"><b>Swarnil Singhai</b> and 3 others</span>
    </span>
    <span class="ns-price ns-price--sm">
      <span class="ns-price__now">$49</span>
      <span class="ns-price__was">$129</span>
      <span class="ns-price__off">62% off</span>
    </span>
  </div>
</div>` },
      { name: "Lesson peek", note: "What is actually IN the course, without leaving the grid. <strong>Hover or tab into the card.</strong> It is real content in the DOM at all times — collapsed with a <code>grid-template-rows</code> transition rather than <code>display:none</code>, so in-page find reaches it and a screen reader reads it whether or not a pointer is over the card. Where hover does not exist it is simply open, because the alternative is content no touch user can reach. Show three or four rows: a peek listing twenty is the syllabus in the wrong place.", html: `<div class="ns-card ns-ccard" style="max-inline-size:19rem">
  <span class="ns-ccard__mediawrap">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-tag ns-ccard__level">Intermediate</span>
    <span class="ns-ccard__dur">2h 10m</span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Bulk-safe Apex patterns</span></a>
    <span class="ns-ccard__meta"><span>9 lessons</span><span>Updated Aug 2026</span></span>
  </div>
  <div class="ns-ccard__peek">
    <div>
      <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">01</span><span class="ns-lesson__title">Why one record at a time fails</span><span class="ns-lesson__time">08:12</span></a>
      <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">02</span><span class="ns-lesson__title">Collections, maps and sets</span><span class="ns-lesson__time">14:40</span></a>
      <a class="ns-lesson" href="#" data-state="locked"><span class="ns-lesson__index" aria-hidden="true">03</span><span class="ns-lesson__title">Governor limits in practice</span><span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span></a>
      <a class="ns-ccard__peek-more" href="#">See all 9 lessons →</a>
    </div>
  </div>
</div>` },
      { name: "Shapes", note: "Five shapes, one anatomy — a course in a grid, in a search result, in a rail and in a related strip is the same object at four sizes, and four bespoke cards is how the meta rows drift apart. <code>--row</code> for lists, <code>--compact</code> for dense rails, <code>--minimal</code> for a card inside another card.", html: `<div style="display:grid;gap:var(--space-4);max-inline-size:32rem">
  <div class="ns-card ns-ccard ns-ccard--row">
    <span class="ns-ccard__mediawrap"><span class="ns-card__media ns-ph" aria-hidden="true"></span></span>
    <div class="ns-card__body">
      <span class="ns-card__kicker">// Continue</span>
      <a class="ns-card__link" href="#"><span class="ns-card__title">Admin certification path</span></a>
      <span class="ns-ccard__meta"><span>Lesson 08 of 14</span><span>21:15 left</span></span>
      <progress class="ns-progress" value="8" max="14" aria-label="8 of 14 lessons complete"></progress>
    </div>
  </div>
  <div class="ns-card ns-ccard ns-ccard--compact" style="max-inline-size:14rem">
    <div class="ns-card__body">
      <span class="ns-card__kicker">// Related</span>
      <a class="ns-card__link" href="#"><span class="ns-card__title">SOQL, properly</span></a>
      <span class="ns-ccard__meta"><span>6 lessons</span><span>1h 05m</span></span>
    </div>
  </div>
  <div class="ns-card ns-ccard ns-ccard--minimal">
    <div class="ns-card__body">
      <a class="ns-card__link" href="#"><span class="ns-card__title">Integration patterns</span></a>
      <span class="ns-ccard__meta"><span>11 lessons</span><span>Advanced</span></span>
    </div>
  </div>
</div>` },
      { name: "Featured", note: "The one promoted course. Two columns, more meta, a larger title — and exactly one of these per screen, or it is not featured.", html: `<div class="ns-card ns-ccard ns-ccard--featured" style="max-inline-size:38rem">
  <span class="ns-ccard__mediawrap">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-ccard__badge ns-ccard__badge--new">New</span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Featured path</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">The Salesforce developer track</span></a>
    <p class="ns-card__text">Six courses, one order: the data model, Apex, LWC, integration, testing and deployment.</p>
    <span class="ns-ccard__meta">
      <span><i class="ph ph-books" aria-hidden="true"></i>6 courses</span>
      <span><i class="ph ph-clock" aria-hidden="true"></i>24h</span>
      <span><i class="ph ph-medal" aria-hidden="true"></i>Certificate</span>
    </span>
    <div style="display:flex;gap:var(--space-2);margin-block-start:var(--space-2)">
      <a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Start the track</a>
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="#">What's inside</a>
    </div>
  </div>
</div>` },
    ],
  },
  {
    id: "curriculum", title: "Curriculum", family: "LMS",
    summary: "The course's table of contents: mono-indexed section heads over the SAME <code>.ns-lesson</code> rows the player rail uses, so a lesson looks identical before and during the course. Sections are native <code>&lt;details&gt;</code> — collapse, keyboard operation and in-page find all come from the platform, and the section holding the current lesson simply ships with <code>open</code>. Four looks over one markup: hairline rows, <code>--timeline</code>, <code>--compact</code>, and rows carrying stills.",
    use: ["The course detail page, below the description", "Anywhere the full course structure is promised", "--compact in a narrow rail or a long syllabus", "--timeline where the ORDER is the point — a path or a certification track"],
    not: ["Inside the player — that is the player's own rail", "Editing — Curriculum builder (CMS)", "A two-item list. A curriculum with one section is a list"],
    a11y: [
      "Sections are &lt;details&gt;/&lt;summary&gt;: open state, keyboard operation and find-in-page are the platform's, not a re-implementation",
      "Rows are links; state is spelled in visually-hidden text, not only drawn",
      "The lesson TYPE is an icon whose word is deferred, not deleted: it stays in the DOM for assistive tech and returns on hover OR keyboard focus, so it is never a mouse-only affordance",
      "Locked rows are dimmed and carry a lock glyph plus a word — never opacity alone",
      "Locked rows stay links (to the join page) and their lock is a glyph, not only 0.7 opacity",
      "Expand-all is labelled with the ACTION and flips once the sections do",
    ],
    variants: [
      { name: "Collapsible", note: "The default. The toolbar carries the totals and one control that expands or collapses everything; each head carries its own lesson count, runtime and completed fraction. Live — open the sections, or use the toolbar.", html: `<div class="ns-curriculum" style="max-inline-size:30rem;inline-size:100%">
  <div class="ns-curriculum__bar">
    <span class="ns-curriculum__totals">5 sections · 24 lessons · 6h 20m</span>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs" data-curriculum-toggle aria-expanded="false">
      <span data-curriculum-label>Expand all</span>
    </button>
  </div>
  <details class="ns-curriculum__section" open>
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__index">01</span>
      <h3 class="ns-curriculum__title">Getting oriented</h3>
      <span class="ns-curriculum__meta">
        <span class="ns-curriculum__done">2/3 done</span>
        <span>32m</span>
        <i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i>
      </span>
    </summary>
    <a class="ns-lesson" href="#" data-state="done">
      <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
      <span class="ns-lesson__body">
        <span class="ns-lesson__title">What is an org?<span class="ns-visually-hidden"> (completed)</span></span>
      <span class="ns-tooltip">What is an org?</span>
        <span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--video"><i class="ph ph-video" aria-hidden="true"></i>Video</span></span>
      </span>
      <span class="ns-lesson__time">08:12</span>
    </a>
    <a class="ns-lesson" href="#" data-state="done">
      <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
      <span class="ns-lesson__body">
        <span class="ns-lesson__title">Objects &amp; fields<span class="ns-visually-hidden"> (completed)</span></span>
        <span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--article"><i class="ph ph-article" aria-hidden="true"></i>Article</span></span>
      </span>
      <span class="ns-lesson__time">12:40</span>
    </a>
    <a class="ns-lesson" href="#" aria-current="true">
      <span class="ns-lesson__index" aria-hidden="true">03</span>
      <span class="ns-lesson__body">
        <span class="ns-lesson__title">Navigation that sticks</span>
        <span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--video"><i class="ph ph-video" aria-hidden="true"></i>Video</span><span class="ns-lesson__badge">Now playing</span></span>
      </span>
      <span class="ns-lesson__time">11:08</span>
    </a>
  </details>
  <details class="ns-curriculum__section">
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__index">02</span>
      <h3 class="ns-curriculum__title">Your first automation</h3>
      <span class="ns-curriculum__meta"><span>4 lessons</span><span>1h 02m</span><i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i></span>
    </summary>
    <a class="ns-lesson" href="#">
      <span class="ns-lesson__index" aria-hidden="true">04</span>
      <span class="ns-lesson__body">
        <span class="ns-lesson__title">Flow builder basics</span>
        <span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--video"><i class="ph ph-video" aria-hidden="true"></i>Video</span><span class="ns-lesson__badge">Preview</span></span>
      </span>
      <span class="ns-lesson__time">20:00</span>
    </a>
    <a class="ns-lesson" href="#">
      <span class="ns-lesson__index" aria-hidden="true">05</span>
      <span class="ns-lesson__body">
        <span class="ns-lesson__title">Build it: an approval flow</span>
        <span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--lab"><i class="ph ph-flask" aria-hidden="true"></i>Hands-on lab</span></span>
      </span>
      <span class="ns-lesson__time">25:00</span>
    </a>
    <a class="ns-lesson" href="#" data-state="locked">
      <span class="ns-lesson__index" aria-hidden="true">06</span>
      <span class="ns-lesson__body">
        <span class="ns-lesson__title">Section quiz<span class="ns-visually-hidden"> (locked — members only)</span></span>
        <span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--quiz"><i class="ph ph-question" aria-hidden="true"></i>Quiz</span><span>8 questions</span></span>
      </span>
      <span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span>
    </a>
  </details>
</div>` },
      { name: "Lesson types", note: "Every row says what KIND of thing it is before you open it: a 14-minute video and a 14-minute lab are not interchangeable. Icon plus word — the icon carries it at a glance, the word carries it for anyone the icon fails, and the two never appear apart.", html: `<div style="display:flex;flex-wrap:wrap;gap:var(--space-5)">
  <span class="ns-ltype ns-ltype--video"><i class="ph ph-video" aria-hidden="true"></i>Video</span>
  <span class="ns-ltype ns-ltype--article"><i class="ph ph-article" aria-hidden="true"></i>Article</span>
  <span class="ns-ltype ns-ltype--quiz"><i class="ph ph-question" aria-hidden="true"></i>Quiz</span>
  <span class="ns-ltype ns-ltype--lab"><i class="ph ph-flask" aria-hidden="true"></i>Lab</span>
  <span class="ns-ltype ns-ltype--live"><i class="ph ph-video-camera" aria-hidden="true"></i>Live</span>
  <span class="ns-ltype"><i class="ph ph-arrow-down" aria-hidden="true"></i>Download</span>
</div>` },
      { name: "Timeline", note: "The connector runs behind the index column and stops at the last section, so it reads as a path with an end rather than a rule that ran off the card. The section dot carries the state — done, current, or ahead. For a certification track or a roadmap, where the ORDER is the point.", html: `<div class="ns-curriculum ns-curriculum--timeline" style="max-inline-size:30rem;inline-size:100%">
  <details class="ns-curriculum__section" data-state="done" open>
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__index"><i class="ph ph-check-circle" aria-hidden="true"></i></span>
      <h3 class="ns-curriculum__title">Foundations</h3>
      <span class="ns-curriculum__meta"><span class="ns-curriculum__done">Complete</span><i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i></span>
    </summary>
    <a class="ns-lesson" href="#" data-state="done"><span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span><span class="ns-lesson__title">The data model</span><span class="ns-lesson__time">18:00</span></a>
  </details>
  <details class="ns-curriculum__section" data-state="current" open>
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__index">02</span>
      <h3 class="ns-curriculum__title">Apex</h3>
      <span class="ns-curriculum__meta"><span>1/4 done</span><i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i></span>
    </summary>
    <a class="ns-lesson" href="#" aria-current="true"><span class="ns-lesson__index" aria-hidden="true">02</span><span class="ns-lesson__title">Classes and triggers</span><span class="ns-lesson__time">22:15</span></a>
    <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">03</span><span class="ns-lesson__title">Bulkification</span><span class="ns-lesson__time">19:30</span></a>
  </details>
  <details class="ns-curriculum__section">
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__index">03</span>
      <h3 class="ns-curriculum__title">Deployment</h3>
      <span class="ns-curriculum__meta"><span>3 lessons</span><i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i></span>
    </summary>
    <a class="ns-lesson" href="#" data-state="locked"><span class="ns-lesson__index" aria-hidden="true">04</span><span class="ns-lesson__title">Change sets vs SFDX</span><span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span></a>
  </details>
</div>` },
      { name: "Compact, with stills", note: "<code>--compact</code> drops a size and tightens the rows — for a long syllabus or a narrow rail. A still where there is one, the lesson-type glyph where there is not: never an empty box.", html: `<div class="ns-curriculum ns-curriculum--compact" style="max-inline-size:26rem;inline-size:100%">
  <details class="ns-curriculum__section" open>
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__index">01</span>
      <h3 class="ns-curriculum__title">Start here</h3>
      <span class="ns-curriculum__meta"><span>2 free</span><i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i></span>
    </summary>
    <a class="ns-lesson ns-lesson--compact" href="#">
      <span class="ns-lesson__thumb ns-ph ns-ph--sm" aria-hidden="true"></span>
      <span class="ns-lesson__body"><span class="ns-lesson__title">Welcome &amp; setup</span><span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--video"><i class="ph ph-video" aria-hidden="true"></i>Video</span><span class="ns-lesson__badge">Preview</span></span></span>
      <span class="ns-lesson__time">04:20</span>
    </a>
    <a class="ns-lesson ns-lesson--compact" href="#">
      <span class="ns-lesson__thumb" aria-hidden="true"><i class="ph ph-article"></i></span>
      <span class="ns-lesson__body"><span class="ns-lesson__title">The data model tour</span><span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--article"><i class="ph ph-article" aria-hidden="true"></i>Article</span><span>6 min read</span></span></span>
      <span class="ns-lesson__time">06:00</span>
    </a>
    <a class="ns-lesson ns-lesson--compact" href="#" data-state="locked">
      <span class="ns-lesson__thumb" aria-hidden="true"><i class="ph ph-lock"></i></span>
      <span class="ns-lesson__body"><span class="ns-lesson__title">Security model<span class="ns-visually-hidden"> (locked)</span></span><span class="ns-lesson__sub"><span class="ns-ltype ns-ltype--video"><i class="ph ph-video" aria-hidden="true"></i>Video</span></span></span>
      <span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span>
    </a>
  </details>
</div>` },
      { name: "Flat — a course", note: "THE SHAPE A COURSE USES. Courses here do not have sections: a course is one arc of eight to fourteen lessons, and wrapping that in a single collapsible “Section 1” is a disclosure control that discloses everything. Sections belong to training, where a module really does contain several posts. Note the kind: an icon, not the word — hover or tab to it and the word comes back.", html: `<div class="ns-curriculum ns-curriculum--flat" style="max-inline-size:32rem;inline-size:100%">
  <div class="ns-curriculum__bar">
    <span class="ns-curriculum__totals">12 lessons · 3h 40m</span>
    <span class="ns-curriculum__totals ns-curriculum__done">3 done</span>
  </div>
  <a class="ns-lesson" href="#0" data-state="done">
    <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
    <span class="ns-lesson__body">
      <span class="ns-lesson__title">What is an org?</span>
    </span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0">
      <i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span>
    </span>
    <span class="ns-lesson__time">08:12</span>
  </a>
  <a class="ns-lesson" href="#0" data-state="done">
    <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
    <span class="ns-lesson__body"><span class="ns-lesson__title">Objects &amp; fields</span></span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--article ns-tooltip-host" tabindex="0">
      <i class="ph ph-article" aria-hidden="true"></i><span class="ns-tooltip">Article</span>
    </span>
    <span class="ns-lesson__time">12:40</span>
  </a>
  <a class="ns-lesson" href="#0" aria-current="true">
    <span class="ns-lesson__index">03</span>
    <span class="ns-lesson__body"><span class="ns-lesson__title">Navigation that sticks</span></span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0">
      <i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span>
    </span>
    <span class="ns-lesson__time">11:08</span>
  </a>
  <a class="ns-lesson" href="#0">
    <span class="ns-lesson__index">04</span>
    <span class="ns-lesson__body"><span class="ns-lesson__title">Your first automation</span></span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--lab ns-tooltip-host" tabindex="0">
      <i class="ph ph-flask" aria-hidden="true"></i><span class="ns-tooltip">Lab</span>
    </span>
    <span class="ns-lesson__time">18:22</span>
  </a>
  <a class="ns-lesson" href="#0">
    <span class="ns-lesson__index">05</span>
    <span class="ns-lesson__body"><span class="ns-lesson__title">Check what you know</span></span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--quiz ns-tooltip-host" tabindex="0">
      <i class="ph ph-exam" aria-hidden="true"></i><span class="ns-tooltip">Quiz</span>
    </span>
    <span class="ns-lesson__time">6 q</span>
  </a>
</div>` },
      { name: "Free and members-only", note: "A curriculum a visitor cannot open yet still has to sell the course, so locked rows are DIMMED, never hidden — the titles are the argument. Free rows keep full contrast and the one green chip on the screen, because in a locked list they are the reason to sign up.", html: `<div class="ns-curriculum ns-curriculum--flat" style="max-inline-size:32rem;inline-size:100%">
  <a class="ns-lesson" href="#0" data-access="free">
    <span class="ns-lesson__index">01</span>
    <span class="ns-lesson__body">
      <span class="ns-lesson__title">What is an org?</span>
      <span class="ns-lesson__sub"><span class="ns-laccess ns-laccess--free"><i class="ph ph-lock-simple-open" aria-hidden="true"></i>Free</span></span>
    </span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0">
      <i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span>
    </span>
    <span class="ns-lesson__time">08:12</span>
  </a>
  <a class="ns-lesson" href="#0" data-access="free">
    <span class="ns-lesson__index">02</span>
    <span class="ns-lesson__body">
      <span class="ns-lesson__title">Objects &amp; fields</span>
      <span class="ns-lesson__sub"><span class="ns-laccess ns-laccess--free"><i class="ph ph-lock-simple-open" aria-hidden="true"></i>Free preview</span></span>
    </span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--article ns-tooltip-host" tabindex="0">
      <i class="ph ph-article" aria-hidden="true"></i><span class="ns-tooltip">Article</span>
    </span>
    <span class="ns-lesson__time">12:40</span>
  </a>
  <a class="ns-lesson" href="#0" data-access="members">
    <span class="ns-lesson__index">03</span>
    <span class="ns-lesson__body">
      <span class="ns-lesson__title">Navigation that sticks</span>
      <span class="ns-lesson__sub"><span class="ns-laccess ns-laccess--members"><i class="ph ph-lock-simple" aria-hidden="true"></i>Members</span></span>
    </span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0">
      <i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span>
    </span>
    <span class="ns-lesson__time"><i class="ph ph-lock-simple" aria-hidden="true"></i></span>
  </a>
  <a class="ns-lesson" href="#0" data-access="members">
    <span class="ns-lesson__index">04</span>
    <span class="ns-lesson__body">
      <span class="ns-lesson__title">Your first automation</span>
      <span class="ns-lesson__sub"><span class="ns-laccess ns-laccess--soon"><i class="ph ph-clock" aria-hidden="true"></i>Recording soon</span></span>
    </span>
    <span class="ns-ltype ns-ltype--icon ns-ltype--lab ns-tooltip-host" tabindex="0">
      <i class="ph ph-flask" aria-hidden="true"></i><span class="ns-tooltip">Lab</span>
    </span>
    <span class="ns-lesson__time"><i class="ph ph-lock-simple" aria-hidden="true"></i></span>
  </a>
</div>` },
      { name: "Modules — training", note: "The OTHER shape, and the only one that keeps sections. A training module carries a still, a sentence saying what it is for, and its own progress, because a module is a thing you choose to start — a course lesson is not. Courses never render this.", html: `<div class="ns-curriculum ns-curriculum--modules" style="max-inline-size:34rem;inline-size:100%">
  <details class="ns-curriculum__section" open>
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__cover ns-ph ns-ph--sm" aria-hidden="true"></span>
      <span class="ns-curriculum__headbody">
        <span class="ns-curriculum__title"><span class="ns-curriculum__index">01</span> Security and access</span>
        <span class="ns-curriculum__desc">Profiles, permission sets and the sharing model — who can see which record, and why the answer is almost never “profiles”.</span>
        <span class="ns-curriculum__meta"><span>4 posts</span><span>1h 02m</span><span class="ns-curriculum__done">2 done</span></span>
      </span>
      <i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i>
    </summary>
    <a class="ns-lesson" href="#0" data-state="done">
      <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
      <span class="ns-lesson__body"><span class="ns-lesson__title">The permission set model</span></span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--article ns-tooltip-host" tabindex="0">
        <i class="ph ph-article" aria-hidden="true"></i><span class="ns-tooltip">Article</span>
      </span>
      <span class="ns-lesson__time">09:30</span>
    </a>
    <a class="ns-lesson" href="#0" aria-current="true">
      <span class="ns-lesson__index">02</span>
      <span class="ns-lesson__body"><span class="ns-lesson__title">The role hierarchy</span></span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0">
        <i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span>
      </span>
      <span class="ns-lesson__time">14:05</span>
    </a>
  </details>
  <details class="ns-curriculum__section">
    <summary class="ns-curriculum__head">
      <span class="ns-curriculum__cover ns-ph ns-ph--sm" aria-hidden="true"></span>
      <span class="ns-curriculum__headbody">
        <span class="ns-curriculum__title"><span class="ns-curriculum__index">02</span> Automation</span>
        <span class="ns-curriculum__desc">Flow first, Apex when flow runs out — and how to tell which situation you are in before you build.</span>
        <span class="ns-curriculum__meta"><span>6 posts</span><span>1h 48m</span></span>
      </span>
      <i class="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true"></i>
    </summary>
    <a class="ns-lesson" href="#0">
      <span class="ns-lesson__index">01</span>
      <span class="ns-lesson__body"><span class="ns-lesson__title">Record-triggered flow</span></span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0">
        <i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span>
      </span>
      <span class="ns-lesson__time">16:20</span>
    </a>
  </details>
</div>` },
    ],
  },
  {
    id: "lesson-nav", title: "Lesson navigation", family: "LMS",
    summary: "Prev / next by NAME, and by as little else as possible. An arrow pair with no titles makes the learner click to find out where they are going — so the name is the control and the arrow is the decoration. The default draws nothing around them: no box, no fill, no still, and the only motion is the arrow travelling two pixels in the direction it points.",
    use: ["The end of every lesson, video or article", "--split at the end of a video, where there is exactly one thing to do next", "--minimal in a rail or a dense column", "--cards at the end of a COURSE, where the next thing is a decision", "--sticky on a long article lesson, so the way out is always one reach away"],
    not: ["Inside the player's stage — the player has its own bar", "Paging a table or a search result — that is Pagination"],
    a11y: [
      "Each control is a link with the lesson's real name in its accessible name — \"Next\" alone tells a screen-reader user nothing",
      "A locked next lesson stays a link, to the upgrade page: a dead button at the end of a lesson explains nothing",
      "The progress element carries the human numbers in its aria-label",
      "Below 48rem the stills and the progress row are dropped, not shrunk — the two named links ARE the navigation on a phone",
      "The arrow's 2px travel is the only motion, and it is dropped under prefers-reduced-motion",
    ],
    variants: [
      { name: "Minimal — the default", note: "An arrow, the direction in mono, the name. No box, no fill, no still. This replaced two bordered cards carrying a label, a title and a 16:9 thumbnail each, with a progress row between them: five objects competing at the exact moment the reader wants one thing.", html: `<nav class="ns-lesson-nav" aria-label="Lesson navigation" style="inline-size:100%">
  <a class="ns-lesson-nav__btn" href="#0">
    <i class="ph ph-arrow-left ns-lesson-nav__arrow" aria-hidden="true"></i>
    <span class="ns-lesson-nav__dir">Previous</span>
    <span class="ns-lesson-nav__name">Objects &amp; fields</span>
  </a>
  <div class="ns-progress-row">
    <progress class="ns-progress" value="8" max="24" aria-label="8 of 24 lessons complete"></progress>
    <span class="ns-progress-row__value">8/24</span>
  </div>
  <a class="ns-lesson-nav__btn ns-lesson-nav__btn--next" href="#0">
    <span class="ns-lesson-nav__dir">Next</span>
    <span class="ns-lesson-nav__name">Flow builder basics</span>
    <i class="ph ph-arrow-right ns-lesson-nav__arrow" aria-hidden="true"></i>
  </a>
</nav>` },
      { name: "Split — one obvious next action", note: "At the end of a video there is exactly one thing to do, so it looks like one thing to do: prev stays a quiet link, next becomes the solid control. This is the shape the player uses.", html: `<nav class="ns-lesson-nav ns-lesson-nav--split" aria-label="Lesson navigation" style="inline-size:100%">
  <a class="ns-lesson-nav__btn" href="#0">
    <i class="ph ph-arrow-left ns-lesson-nav__arrow" aria-hidden="true"></i>
    <span class="ns-lesson-nav__dir">Previous</span>
    <span class="ns-lesson-nav__name">Objects &amp; fields</span>
  </a>
  <a class="ns-lesson-nav__up" href="#0"><i class="ph ph-list" aria-hidden="true"></i> All 24 lessons</a>
  <a class="ns-lesson-nav__btn ns-lesson-nav__btn--next" href="#0">
    <span class="ns-lesson-nav__dir">Next</span>
    <span class="ns-lesson-nav__name">Flow builder basics</span>
    <i class="ph ph-arrow-right ns-lesson-nav__arrow" aria-hidden="true"></i>
  </a>
</nav>` },
      { name: "Minimal one-line", note: "Names only, no direction labels — for a rail, a dense player column, or an article whose footer is already busy.", html: `<nav class="ns-lesson-nav ns-lesson-nav--minimal" aria-label="Lesson navigation" style="inline-size:100%">
  <a class="ns-lesson-nav__btn" href="#0">
    <i class="ph ph-arrow-left ns-lesson-nav__arrow" aria-hidden="true"></i>
    <span class="ns-lesson-nav__dir">Previous lesson:</span>
    <span class="ns-lesson-nav__name">Objects &amp; fields</span>
  </a>
  <a class="ns-lesson-nav__btn ns-lesson-nav__btn--next" href="#0">
    <span class="ns-lesson-nav__dir">Next lesson:</span>
    <span class="ns-lesson-nav__name">Flow builder basics</span>
    <i class="ph ph-arrow-right ns-lesson-nav__arrow" aria-hidden="true"></i>
  </a>
</nav>` },
      { name: "Locked next, and the way back", note: "The locked control still navigates — to the join page. <code>__up</code> is the way back to the curriculum, which on a phone is the only way back to it.", html: `<nav class="ns-lesson-nav" aria-label="Lesson navigation" style="inline-size:100%">
  <a class="ns-lesson-nav__btn" href="#0">
    <i class="ph ph-arrow-left ns-lesson-nav__arrow" aria-hidden="true"></i>
    <span class="ns-lesson-nav__dir">Previous</span>
    <span class="ns-lesson-nav__name">Bulkification, properly</span>
  </a>
  <a class="ns-lesson-nav__up" href="#0"><i class="ph ph-list" aria-hidden="true"></i> All 24 lessons</a>
  <a class="ns-lesson-nav__btn ns-lesson-nav__btn--next" href="#0" data-state="locked">
    <span class="ns-lesson-nav__dir">Members only</span>
    <span class="ns-lesson-nav__name">Governor limits in practice</span>
    <i class="ph ph-lock-simple ns-lesson-nav__arrow" aria-hidden="true"></i>
  </a>
</nav>` },
      { name: "Cards — the end of a course", note: "The boxed pair WITH the still, now opt-in. Correct where the next thing is a decision rather than a continuation: the last lesson, or a course-complete screen.", html: `<nav class="ns-lesson-nav ns-lesson-nav--cards" aria-label="Lesson navigation" style="inline-size:100%">
  <a class="ns-lesson-nav__btn" href="#0">
    <i class="ph ph-arrow-left ns-lesson-nav__arrow" aria-hidden="true"></i>
    <span class="ns-lesson-nav__thumb" aria-hidden="true"><i class="ph ph-video"></i></span>
    <span class="ns-lesson-nav__dir">Previous</span>
    <span class="ns-lesson-nav__name">Testing and deployment</span>
  </a>
  <a class="ns-lesson-nav__btn ns-lesson-nav__btn--next" href="#0">
    <span class="ns-lesson-nav__dir">Next course</span>
    <span class="ns-lesson-nav__name">Bulk-safe Apex patterns</span>
    <span class="ns-lesson-nav__thumb ns-ph ns-ph--sm" aria-hidden="true"></span>
    <i class="ph ph-arrow-right ns-lesson-nav__arrow" aria-hidden="true"></i>
  </a>
</nav>` },
    ],
  },
  {
    id: "lesson-panel", title: "Lesson panel (mobile)", family: "LMS",
    summary: "Below lg the player's curriculum rail becomes this: a bottom bar naming where you are, opening the full lesson list in a Drawer. The bar is the rail's handle — always visible, one tap from any lesson.",
    use: ["The player below the lg breakpoint", "Any lesson page where the rail has collapsed"],
    not: ["Desktop — the rail is already on screen"],
    a11y: ["The bar's button names its job: \"Lessons — 6 of 12 complete\"", "The drawer is a dialog: focus moves in, Esc closes, focus returns to the bar"],
    variants: [
      { name: "Bottom bar", note: "Sticky at the viewport bottom in product (--fixed); static here.", html: `<div class="ns-panelbar" style="max-inline-size:26rem;inline-size:100%">
  <span class="ns-panelbar__now">
    <span class="ns-panelbar__kicker">lesson 07 of 12</span>
    <span class="ns-panelbar__title">SOQL joins: relationships</span>
  </span>
  <button class="ns-btn ns-btn--outline ns-btn--sm" data-open-panel><i class="ph ph-list" aria-hidden="true"></i> Lessons</button>
</div>` },
      { name: "Opened panel", note: "The system Drawer with the same lesson rows — nothing new to learn.", script: `document.querySelectorAll('[data-open-panel]').forEach(function (b) {
  var dlg = document.getElementById('lesson-panel-demo');
  if (dlg) b.addEventListener('click', function () { dlg.showModal(); });
});`, html: `<div class="ns-panelbar" style="max-inline-size:26rem;inline-size:100%">
  <span class="ns-panelbar__now">
    <span class="ns-panelbar__kicker">lesson 07 of 12</span>
    <span class="ns-panelbar__title">SOQL joins: relationships</span>
  </span>
  <button class="ns-btn ns-btn--outline ns-btn--sm" data-open-panel><i class="ph ph-list" aria-hidden="true"></i> Lessons</button>
</div>
<dialog class="ns-modal" id="lesson-panel-demo" aria-label="Lessons" style="max-inline-size:22rem;inline-size:90%;padding:0">
  <header class="ns-curriculum__head" style="border-block-start:0">
    <span class="ns-curriculum__index">02</span>
    <h3 class="ns-curriculum__title">SOQL &amp; data</h3>
    <form method="dialog" style="margin-inline-start:auto"><button class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button></form>
  </header>
  <a class="ns-lesson" href="#" data-state="done"><span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span><span class="ns-lesson__title">SELECT and WHERE</span><span class="ns-lesson__time">14:02</span></a>
  <a class="ns-lesson" href="#" aria-current="true"><span class="ns-lesson__index" aria-hidden="true">07</span><span class="ns-lesson__title">SOQL joins: relationships</span><span class="ns-lesson__time">21:15</span></a>
  <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">08</span><span class="ns-lesson__title">Aggregate queries</span><span class="ns-lesson__time">18:40</span></a>
</dialog>` },
      { name: "Centred modal", note: "The desktop shape, and the one that was missing: the lesson list is a thing you are CHOOSING from, so it gets the middle of the screen and a scrim rather than sliding in from an edge. Below 40rem the same dialog becomes a bottom sheet with a grab handle, because a centred box on a phone is a centred box with a keyboard-sized margin round it.", script: `document.querySelectorAll('[data-open-lessonmodal]').forEach(function (b) {
  var dlg = document.getElementById('lessonmodal-demo');
  if (dlg) b.addEventListener('click', function () { dlg.showModal(); });
});`, html: `<button class="ns-btn ns-btn--outline ns-btn--sm" data-open-lessonmodal><i class="ph ph-list" aria-hidden="true"></i> Open the lesson list</button>
<dialog class="ns-lessonmodal" id="lessonmodal-demo">
  <div class="ns-lessonmodal__head">
    <span class="ns-lessonmodal__title">Apex fundamentals</span>
    <span class="ns-lessonmodal__count">6 / 12 done</span>
    <form method="dialog"><button class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Close"><i class="ph ph-x" aria-hidden="true"></i></button></form>
  </div>
  <div class="ns-lessonmodal__list">
    <a class="ns-lesson" href="#0" data-state="done">
      <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
      <span class="ns-lesson__title">SELECT and WHERE</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0"><i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span></span>
      <span class="ns-lesson__time">14:02</span></a>
    <a class="ns-lesson" href="#0" aria-current="true">
      <span class="ns-lesson__index">07</span>
      <span class="ns-lesson__title">SOQL joins: relationships</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0"><i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span></span>
      <span class="ns-lesson__time">21:15</span></a>
    <a class="ns-lesson" href="#0">
      <span class="ns-lesson__index">08</span>
      <span class="ns-lesson__title">Aggregate queries</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--article ns-tooltip-host" tabindex="0"><i class="ph ph-article" aria-hidden="true"></i><span class="ns-tooltip">Article</span></span>
      <span class="ns-lesson__time">18:40</span></a>
    <a class="ns-lesson" href="#0" data-access="members">
      <span class="ns-lesson__index">09</span>
      <span class="ns-lesson__title">Bulk-safe triggers</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--lab ns-tooltip-host" tabindex="0"><i class="ph ph-flask" aria-hidden="true"></i><span class="ns-tooltip">Lab</span></span>
      <span class="ns-lesson__time"><i class="ph ph-lock-simple" aria-hidden="true"></i></span></a>
  </div>
  <div class="ns-lessonmodal__foot">
    <progress class="ns-progress" value="6" max="12" aria-label="6 of 12 lessons complete"></progress>
    <span class="ns-lessonmodal__count">50%</span>
  </div>
</dialog>` },
    ],
  },
  {
    id: "course-detail", title: "Course detail page", family: "LMS",
    summary: "The course's landing: hero (title, meta, the one primary action), the stat band, the outcomes, and then the five arguments — overview, curriculum, instructors, reviews, FAQ — as TABS in the content column, with the enrol card sticky in the rail beside them. One primary button on the whole page.",
    use: ["Every course's public page, both products"],
    not: ["The lesson experience — Course player"],
    a11y: ["The hero's enroll button and the rail's are the same action — one label, both reachable", "The curriculum is the real component, so its row semantics come along", "Tabs are the real ARIA pattern via assets/js/tabs.js — and with no JS every panel is visible, so the stacked page is the fallback rather than a page with four sections missing"],
    variants: [
      { name: "Anatomy — content + sticky rail", note: "The grid at documentation scale; open the full-screen demo for the real thing.", html: `<div class="ns-course-detail" style="inline-size:100%">
  <div>
    <span class="ns-kicker">// Course · Beginner</span>
    <h2 style="font-size:var(--size-h3);margin-block:var(--space-2) var(--space-3)">Apex basics</h2>
    <p style="color:var(--color-muted);font-size:var(--size-small);max-inline-size:34rem">Objects, triggers and your first deploy — the platform's own language from zero. Concept, concrete example, bridge to the next step: every lesson, same shape.</p>
    <div class="ns-curriculum" style="margin-block-start:var(--space-5)">
      <section class="ns-curriculum__section">
        <header class="ns-curriculum__head"><span class="ns-curriculum__index">01</span><h3 class="ns-curriculum__title">Getting oriented</h3><span class="ns-curriculum__meta">3 lessons</span></header>
        <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">01</span><span class="ns-lesson__title">What is an org?</span><span class="ns-lesson__time"><span class="ns-tag">Free</span></span></a>
        <a class="ns-lesson" href="#" data-state="locked"><span class="ns-lesson__index" aria-hidden="true">02</span><span class="ns-lesson__title">Objects &amp; fields</span><span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span></a>
      </section>
    </div>
  </div>
  <aside class="ns-course-detail__rail">
    <div class="ns-railbox">
      <p class="ns-railbox__title">This course</p>
      <p style="font-size:var(--size-small);color:var(--color-muted)">12 lessons · 3h 40m · certificate</p>
      <button class="ns-btn ns-btn--primary ns-btn--block" style="margin-block-start:var(--space-3)">Start learning free</button>
    </div>
    <div class="ns-railbox">
      <p class="ns-railbox__title">Instructor</p>
      <div style="display:flex;align-items:center;gap:var(--space-3)">
        <span class="ns-avatar">SW</span>
        <span style="font-size:var(--size-small)">Swarnil Singhai<br><span style="color:var(--color-muted)">Salesforce architect</span></span>
      </div>
    </div>
  </aside>
</div>` },
      { name: "Full page", note: "Three decisions worth knowing before you copy it. <strong>Tabs, not eight stacked bands</strong> — a course page carries five separate arguments, and stacked they make a page nobody reaches the bottom of, with the curriculum (the thing people came to read) buried three screens down. <strong>Outcomes above the tabs, never inside one</strong> — \"what will I be able to do\" is the question every visitor arrives with, and it decides whether they read anything else; each promise takes the icon of the thing it produces rather than a fifth identical tick, because five ticks is a list that has to be read and five glyphs is one that can be scanned. <strong>The lesson kind is an icon</strong> — twenty-four rows that each spell out VIDEO turn a curriculum into a spreadsheet; the word stays in the DOM and returns as a tooltip, which frees the row's second line for what the glyph cannot say: whether the row is open to you.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-course-detail.html" target="_blank" rel="noopener">Open the full-screen demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
      { name: "The five shapes", note: "Same content, same components, five arrangements — because a $9 course, a certification track and a free tutorial are not the same sale. <code>--wide</code> puts the rail LEFT for a course whose curriculum is the product; <code>--stacked</code> drops the rail entirely (free courses: a sticky price rail advertising nothing); <code>--syllabus</code> leads with the curriculum for a returning learner; <code>--compact</code> is one prose column, the documentation-page look.", html: `<div style="display:grid;gap:var(--space-6);inline-size:100%">
  <div class="ns-course-detail ns-course-detail--wide" style="border:1px solid var(--color-border);border-radius:var(--radius-card);padding:var(--pad-card)">
    <aside class="ns-course-detail__rail"><div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Rail left</span><span class="ns-card__title">$49</span></div></div></aside>
    <div class="ns-course-detail__main"><p class="ns-kicker">--wide</p><p>The curriculum is the product, so it gets the wide column and the price follows it down.</p></div>
  </div>
  <div class="ns-course-detail ns-course-detail--stacked" style="border:1px solid var(--color-border);border-radius:var(--radius-card);padding:var(--pad-card)">
    <div class="ns-course-detail__main"><p class="ns-kicker">--stacked</p><p>No rail at all — the buy box sits after the outcomes, in the reading column.</p></div>
    <aside class="ns-course-detail__rail"><div class="ns-card"><div class="ns-card__body"><span class="ns-card__title">Free</span></div></div></aside>
  </div>
  <div class="ns-course-detail ns-course-detail--compact" style="border:1px solid var(--color-border);border-radius:var(--radius-card);padding:var(--pad-card)">
    <div class="ns-course-detail__main"><p class="ns-kicker">--compact</p><p>One column at the prose measure, no media: a course documented rather than sold.</p></div>
  </div>
</div>` },
    ],
  },
  {
    id: "course-listing", title: "Course listing", family: "LMS",
    summary: "The catalog: a filter row (tags with aria-pressed + a sort Select) over the course-card grid. This demo is LIVE — the tags actually filter the grid; hidden cards keep their colors and order when they return.",
    use: ["The /courses page, tag archives, search results"],
    not: ["A shelf of 4 on the home page — Carousel or a plain grid"],
    a11y: ["Filters are real buttons; the result count is a live region so the change is announced", "An emptied grid shows the Empty state with the one obvious fix — clear filters"],
    variants: [
      { name: "Live filter + grid", script: `(function () {
  var wrap = document.getElementById('cl-demo');
  if (!wrap) return;
  var tags = wrap.querySelectorAll('[data-filter]');
  var count = wrap.querySelector('[data-count]');
  function apply(val) {
    var shown = 0;
    wrap.querySelectorAll('[data-topic]').forEach(function (c) {
      var hit = val === 'all' || c.getAttribute('data-topic') === val;
      c.style.display = hit ? '' : 'none';
      if (hit) shown++;
    });
    count.textContent = shown + ' course' + (shown === 1 ? '' : 's');
  }
  tags.forEach(function (t) {
    t.addEventListener('click', function () {
      tags.forEach(function (o) { o.setAttribute('aria-pressed', String(o === t)); });
      apply(t.getAttribute('data-filter'));
    });
  });
  apply('all');
})();`, html: `<div id="cl-demo" style="inline-size:100%">
  <div class="ns-course-filters">
    <button class="ns-tag" data-filter="all" aria-pressed="true">All</button>
    <button class="ns-tag" data-filter="admin" aria-pressed="false">Admin</button>
    <button class="ns-tag" data-filter="dev" aria-pressed="false">Developer</button>
    <span class="ns-ccard__meta" data-count role="status" style="margin-inline-start:var(--space-2)"></span>
    <select class="ns-select" aria-label="Sort">
      <option>Newest</option><option>Most popular</option><option>Shortest first</option>
    </select>
  </div>
  <div class="ns-course-grid">
    <div class="ns-card ns-ccard" data-topic="dev"><span class="ns-ccard__mediawrap"><span class="ns-card__media ns-ph" aria-hidden="true"></span><span class="ns-tag ns-ccard__level">Beginner</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Apex basics</span></a><span class="ns-ccard__meta"><span>12 lessons</span></span></div></div>
    <div class="ns-card ns-ccard" data-topic="admin"><span class="ns-ccard__mediawrap"><span class="ns-card__media ns-ph" aria-hidden="true"></span><span class="ns-tag ns-ccard__level">Beginner</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Admin fundamentals</span></a><span class="ns-ccard__meta"><span>14 lessons</span></span></div></div>
    <div class="ns-card ns-ccard" data-topic="admin"><span class="ns-ccard__mediawrap"><span class="ns-card__media ns-ph" aria-hidden="true"></span><span class="ns-tag ns-ccard__level">Intermediate</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Flows, end to end</span></a><span class="ns-ccard__meta"><span>9 lessons</span></span></div></div>
    <div class="ns-card ns-ccard" data-topic="dev"><span class="ns-ccard__mediawrap"><span class="ns-card__media ns-ph" aria-hidden="true"></span><span class="ns-tag ns-ccard__level">Advanced</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Bulk-safe Apex</span></a><span class="ns-ccard__meta"><span>9 lessons</span></span></div></div>
  </div>
</div>` },
      { name: "Full page", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-course-listing.html" target="_blank" rel="noopener">Open the full-screen demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },

  /* ====================================================== Catalog ==== */
  {
    id: "course-hero", title: "Course hero", family: "LMS",
    summary: "The top of a course page, in five versions — because a course page has five honest situations, not because five looked like a good number. All five carry the same parts in the same order (kicker, title, lede, meta strip, actions, media), so the page does not re-teach itself when the art direction changes. The meta strip is where a stranger decides: rating, learners, runtime, level, language, last updated.",
    use: ["The top of every course detail page", "--minimal for a course with no good art, which is most of them", "--console where there are no assets at all — it needs none"],
    not: ["A catalog card — that is Course card", "A marketing page opener — that is Hero, in Sections", "Carrying the enrol action alone: the buy box repeats it, because a hero scrolls away"],
    a11y: [
      "The scrim on --cover / --video is not optional: text over an arbitrary photograph has no contrast guarantee, and a hero whose legibility depends on which image the editor picked is broken by design",
      "The background clip is decoration — muted, loop, playsinline, and hidden entirely under prefers-reduced-motion, which leaves exactly the --cover version",
      "The play control over the preview is a real button with a name, never a decorative triangle",
      "The title is the page's h1; the kicker above it is not a heading",
    ],
    variants: [
      { name: "Split — the default", flush: true, note: "Content beside a media card. The workhorse: the preview video has somewhere to live above the fold. Below 64rem the media moves FIRST — on a phone the preview is the strongest argument, and it should not be the fourth thing.", html: `<section class="ns-chero">
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <span class="ns-chero__kicker">// Course · Developer track</span>
        <h1 class="ns-chero__title">Apex, from zero to first deploy</h1>
        <p class="ns-chero__lede">The platform's own language, taught in the order you actually need it: the data model first, then classes, then the deploy that puts it live.</p>
        <div class="ns-chero__meta">
          <span class="ns-rating" data-value="4.8" data-of="5">
            <span class="ns-rating__value">4.8</span>
            <span class="ns-rating__stars" aria-hidden="true"><span><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i></span><span class="ns-rating__fill"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></span></span>
            <span class="ns-rating__count">(1,240)</span>
          </span>
          <span><i class="ph ph-users-three" aria-hidden="true"></i>8,410 learners</span>
          <span><i class="ph ph-clock" aria-hidden="true"></i>6h 20m</span>
          <span><i class="ph ph-list" aria-hidden="true"></i>24 lessons</span>
          <span><i class="ph ph-globe" aria-hidden="true"></i>English</span>
          <span><i class="ph ph-arrows-clockwise" aria-hidden="true"></i>Updated Aug 2026</span>
        </div>
        <div class="ns-chero__actions">
          <a class="ns-btn ns-btn--primary ns-btn--lg" href="#">Enrol — $49</a>
          <a class="ns-btn ns-btn--soft ns-btn--lg" href="#"><i class="ph ph-play" aria-hidden="true"></i> Preview 2 lessons</a>
        </div>
      </div>
      <div class="ns-chero__media">
        <span class="ns-ph" aria-hidden="true"></span>
        <button type="button" class="ns-chero__play" aria-label="Play the course preview"><i class="ph ph-play-circle" aria-hidden="true"></i></button>
        <span class="ns-chero__caption">Preview · 02:14</span>
      </div>
    </div>
  </div>
</section>` },
      { name: "Cover", flush: true, note: "A photographic still behind the content, scrimmed to the brand navy. For a course whose subject is visual. The scrim runs from 92% to 62% across the inline axis, so the text edge is always the dark end whatever the image does.", html: `<section class="ns-chero ns-chero--cover">
  <div class="ns-chero__bg"><span class="ns-ph" aria-hidden="true"></span></div>
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <div class="ns-chero__badges">
          <span class="ns-tag">Bestseller</span>
          <span class="ns-tag">Certificate</span>
        </div>
        <span class="ns-chero__kicker">// Learning path</span>
        <h1 class="ns-chero__title">The Salesforce admin trail</h1>
        <p class="ns-chero__lede">Six courses in one order, from your first org to a passing score on the ADM-201.</p>
        <div class="ns-chero__meta">
          <span><i class="ph ph-books" aria-hidden="true"></i>6 courses</span>
          <span><i class="ph ph-clock" aria-hidden="true"></i>24h</span>
          <span><i class="ph ph-medal" aria-hidden="true"></i>Certificate on completion</span>
        </div>
        <div class="ns-chero__actions">
          <a class="ns-btn ns-btn--white ns-btn--lg" href="#">Start the trail</a>
          <a class="ns-btn ns-btn--ghost ns-btn--lg" href="#">See the six courses</a>
        </div>
      </div>
    </div>
  </div>
</section>` },
      { name: "Video loop", flush: true, note: "The same as --cover, with a muted looping clip instead of a still. It is decoration with a bandwidth cost, so: <code>muted loop playsinline</code>, a <code>poster</code> that stands alone, and hidden entirely under <code>prefers-reduced-motion</code> — which leaves exactly the cover version, correctly. (The demo below uses the poster; the markup is what ships.)", html: `<section class="ns-chero ns-chero--video">
  <div class="ns-chero__bg">
    <video autoplay muted loop playsinline aria-hidden="true">
      <source src="/media/course-loop.mp4" type="video/mp4">
    </video>
  </div>
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <span class="ns-chero__kicker">// Live cohort · starts 14 Sep</span>
        <h1 class="ns-chero__title">Integration patterns, live</h1>
        <p class="ns-chero__lede">Four weeks, four live builds, one recording of each — with the whole cohort in the same room.</p>
        <div class="ns-chero__meta">
          <span><i class="ph ph-video-camera" aria-hidden="true"></i>4 live sessions</span>
          <span><i class="ph ph-users-three" aria-hidden="true"></i>30 seats</span>
          <span><i class="ph ph-calendar" aria-hidden="true"></i>Thursdays, 19:00 IST</span>
        </div>
        <div class="ns-chero__actions">
          <a class="ns-btn ns-btn--white ns-btn--lg" href="#">Reserve a seat</a>
          <a class="ns-btn ns-btn--ghost ns-btn--lg" href="#">Syllabus</a>
        </div>
      </div>
    </div>
  </div>
</section>` },
      { name: "Minimal", flush: true, note: "Hairline and type only. For a course with no good art — which is most of them, and a blank grey box is worse than no box. This is the version to reach for when someone asks \"what image should go here\" and there is no honest answer.", html: `<section class="ns-chero ns-chero--minimal">
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <span class="ns-chero__kicker">// Course</span>
        <h1 class="ns-chero__title">SOQL, properly</h1>
        <p class="ns-chero__lede">Selective queries, relationship traversal, and the index behaviour that decides whether your report loads or times out.</p>
        <div class="ns-chero__meta">
          <span><i class="ph ph-list" aria-hidden="true"></i>6 lessons</span>
          <span><i class="ph ph-clock" aria-hidden="true"></i>1h 05m</span>
          <span><i class="ph ph-gauge" aria-hidden="true"></i>Intermediate</span>
        </div>
        <div class="ns-chero__actions">
          <a class="ns-btn ns-btn--primary" href="#">Start free</a>
          <a class="ns-btn ns-btn--outline" href="#">Syllabus</a>
        </div>
      </div>
    </div>
  </div>
</section>` },
      { name: "Console", flush: true, note: "The brand navy plus the hairline grid — the house style, and the one that needs no assets at all. Composes <code>ns-pattern</code> from the patterns layer rather than inventing a background.", html: `<section class="ns-chero ns-chero--console ns-pattern ns-pattern--blueprint">
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <span class="ns-chero__kicker">// Free · 4 lessons</span>
        <h1 class="ns-chero__title">Your first org, in an afternoon</h1>
        <p class="ns-chero__lede">Sign up, find your way around, build one object and one automation. Nothing to install.</p>
        <div class="ns-chero__meta">
          <span><i class="ph ph-rocket-launch" aria-hidden="true"></i>No setup</span>
          <span><i class="ph ph-clock" aria-hidden="true"></i>48m</span>
        </div>
        <div class="ns-chero__actions">
          <a class="ns-btn ns-btn--white ns-btn--lg" href="#">Start now — free</a>
        </div>
      </div>
      <div class="ns-chero__media">
        <span class="ns-ph" aria-hidden="true"></span>
      </div>
    </div>
  </div>
</section>` },
      { name: "Split", note: "Copy one side, the cover art the other, both on the page surface. The other heroes put the media BEHIND the copy, which is why they all need on-dark ink — this is the one to use when the artwork matters as artwork.", html: `<header class="ns-chero ns-chero--split" style="inline-size:100%">
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <span class="ns-chero__kicker">// Developer track</span>
        <h1 class="ns-chero__title">Bulk-safe Apex patterns</h1>
        <p class="ns-chero__lede">Triggers that survive the 200-record data load — the one skill that separates code that works on your desk from code that works in production.</p>
        <div class="ns-chero__meta"><span>9 lessons</span><span>2h 10m</span><span>Intermediate</span></div>
        <div class="ns-chero__actions">
          <a class="ns-btn ns-btn--primary" href="#0">Start the course</a>
          <a class="ns-btn ns-btn--outline" href="#0">Syllabus</a>
        </div>
      </div>
      <span class="ns-chero__media ns-ph" aria-hidden="true"></span>
    </div>
  </div>
</header>` },
      { name: "Certification", note: "For a course whose end state is an exam. The badge sits beside the title at display size rather than being mentioned in the meta row, because for this reader the badge IS the product.", html: `<header class="ns-chero ns-chero--cert" style="inline-size:100%">
  <div class="ns-chero__inner">
    <div class="ns-chero__grid">
      <div class="ns-chero__body">
        <span class="ns-chero__kicker">// Certification track</span>
        <h1 class="ns-chero__title">Platform Developer I</h1>
        <p class="ns-chero__lede">Six weeks, five courses, one exam. Every objective on the outline, in the order the exam asks them.</p>
        <div class="ns-chero__meta"><span>5 courses</span><span>18h 40m</span><span>Exam-aligned</span></div>
        <div class="ns-chero__actions"><a class="ns-btn ns-btn--primary" href="#0">Start the track</a></div>
      </div>
      <span class="ns-certbadge ns-certbadge--specialist">
        <span class="ns-certbadge__plate" aria-hidden="true"></span>
        <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
        <span class="ns-certbadge__inner">
          <i class="ph ph-cloud ns-certbadge__mark" aria-hidden="true"></i>
          <span class="ns-certbadge__rule" aria-hidden="true"></span>
          <span class="ns-certbadge__word">Certified</span>
          <span class="ns-certbadge__name">Platform Developer</span>
        </span>
      </span>
    </div>
  </div>
</header>` },
    ],
  },

  {
    id: "buybox", title: "Enrol card", family: "LMS",
    summary: "The card that carries the one action the course page exists for: price, enrol, what is included, and the fine print under it. Sticky in the rail on desktop; a fixed bottom bar on a phone (<code>--bar</code>), because the action must never be scrolled past. The price block is deliberately two different sizes — a discount that renders as two equal numbers makes the reader do arithmetic to find out which one they pay.",
    use: ["The course detail rail, sticky", "--bar as the phone counterpart of the same card", "A path or bundle page, with the bundle's price"],
    not: ["Repeating every fact from the hero — it carries the DECISION, not the description", "More than one primary button. \"Enrol\" and \"Buy now\" are the same action wearing two hats"],
    a11y: [
      "The old price is inside &lt;s&gt;, so it is announced as struck rather than read as the current price",
      "The bar variant respects env(safe-area-inset-bottom) — without it the button lands under the home indicator",
      "The includes list is a real &lt;ul&gt;; its icons are aria-hidden and each item reads as a sentence",
    ],
    variants: [
      { name: "In the rail", html: `<aside class="ns-buybox" style="max-inline-size:20rem">
  <span class="ns-buybox__media ns-ph" aria-hidden="true"></span>
  <div class="ns-buybox__body">
    <span class="ns-price">
      <span class="ns-price__now">$49</span>
      <s class="ns-price__was">$129</s>
      <span class="ns-price__off">62% off</span>
    </span>
    <div class="ns-buybox__actions">
      <a class="ns-btn ns-btn--primary ns-btn--lg ns-btn--block" href="#">Enrol now</a>
      <a class="ns-btn ns-btn--outline ns-btn--block" href="#"><i class="ph ph-play" aria-hidden="true"></i> Preview 2 lessons</a>
    </div>
    <p class="ns-buybox__note">30-day refund, no questions asked.</p>
    <ul class="ns-buybox__list">
      <li><i class="ph ph-video" aria-hidden="true"></i>6h 20m of video</li>
      <li><i class="ph ph-article" aria-hidden="true"></i>12 written lessons</li>
      <li><i class="ph ph-flask" aria-hidden="true"></i>5 hands-on labs</li>
      <li><i class="ph ph-arrow-down" aria-hidden="true"></i>Downloadable source</li>
      <li><i class="ph ph-infinity" aria-hidden="true"></i>Lifetime access</li>
      <li><i class="ph ph-medal" aria-hidden="true"></i>Certificate of completion</li>
    </ul>
    <div class="ns-share">
      <span class="ns-share__label">Share</span>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Copy link"><i class="ph ph-link-simple" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share on LinkedIn"><i class="ph ph-linkedin-logo" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share on X"><i class="ph ph-x-logo" aria-hidden="true"></i></button>
    </div>
  </div>
  <p class="ns-buybox__foot">142 enrolled in the last 30 days</p>
</aside>` },
      { name: "Free course", note: "No price theatre. A free course says free once, in the success ink, and the button says what happens next.", html: `<aside class="ns-buybox" style="max-inline-size:20rem">
  <div class="ns-buybox__body">
    <span class="ns-price ns-price--free"><span class="ns-price__now">Free</span></span>
    <div class="ns-buybox__actions">
      <a class="ns-btn ns-btn--primary ns-btn--lg ns-btn--block" href="#">Start lesson 01</a>
    </div>
    <p class="ns-buybox__note">No card. Sign in to keep your progress.</p>
    <ul class="ns-buybox__list">
      <li><i class="ph ph-video" aria-hidden="true"></i>48m of video</li>
      <li><i class="ph ph-infinity" aria-hidden="true"></i>Yours forever</li>
    </ul>
  </div>
</aside>` },
      { name: "Phone bar", flush: true, note: "The same card as a fixed bottom bar below 64rem. It is <code>display:none</code> above that breakpoint — the rail card is already there, and two enrol buttons on one screen is one too many.", html: `<div style="position:relative;block-size:6rem;border:1px dashed var(--color-border);border-radius:var(--radius-card);display:grid;place-items:center;color:var(--color-muted);font-size:var(--size-fine)">
  page content
  <div class="ns-buybox ns-buybox--bar" style="position:absolute;inset-inline:0;inset-block-end:0">
    <span class="ns-price ns-price--sm"><span class="ns-price__now">$49</span><s class="ns-price__was">$129</s></span>
    <a class="ns-btn ns-btn--primary" href="#">Enrol now</a>
  </div>
</div>` },
    ],
  },

  {
    id: "filters", title: "Filter rail", family: "LMS",
    summary: "The course listing's rail: facet groups as native <code>&lt;details&gt;</code>, a dual-thumb price range built from two real <code>&lt;input type=\"range\"&gt;</code>, and the applied set echoed as removable chips above the grid — a filter you cannot see is a filter you forget you set. Everything is a real form control, so the page filters with JavaScript off and the form submits.",
    use: ["The course listing, as a sticky rail ≥ lg and a drawer below it", "Any catalog with more than about a dozen items"],
    not: ["Fewer than three facets — that is a row of filter chips, not a rail", "Search. A filter narrows a set; search queries it"],
    a11y: [
      "The price range is TWO named sliders, not one custom widget: keyboard, screen reader and mobile all work because the controls are native",
      "Dragging clamps rather than swaps — swapping makes the thumb jump out from under the pointer",
      "Each chip's accessible name is \"Remove filter: <em>name</em>\"; removing one unchecks its checkbox and fires a real change event",
      "Counts sit inside the label, so they are announced with the option they belong to",
    ],
    variants: [
      { name: "The rail", note: "Live — check a facet to see the applied chips appear, drag either price thumb, or clear everything.", html: `<div data-filters style="display:grid;grid-template-columns:16rem minmax(0,1fr);gap:var(--space-8);inline-size:100%;align-items:start">
  <form class="ns-filters">
    <div class="ns-filters__head">
      <span class="ns-filters__title">Filters</span>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs ns-filters__clear" data-clear-filters hidden>Clear all</button>
    </div>
    <details class="ns-filters__group" open>
      <summary class="ns-filters__legend">Level <i class="ph ph-caret-down" aria-hidden="true"></i></summary>
      <div class="ns-filters__list">
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="level" value="beginner"><span>Beginner</span><span class="ns-filters__count">24</span></label>
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="level" value="intermediate"><span>Intermediate</span><span class="ns-filters__count">18</span></label>
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="level" value="advanced"><span>Advanced</span><span class="ns-filters__count">9</span></label>
      </div>
    </details>
    <details class="ns-filters__group" open>
      <summary class="ns-filters__legend">Price <i class="ph ph-caret-down" aria-hidden="true"></i></summary>
      <div class="ns-range">
        <div class="ns-range__track">
          <span class="ns-range__fill"></span>
          <input type="range" data-range="from" min="0" max="200" value="0" step="5" aria-label="Minimum price">
          <input type="range" data-range="to" min="0" max="200" value="120" step="5" aria-label="Maximum price">
        </div>
        <div class="ns-range__values">
          <input class="ns-input" type="number" data-range-out value="0" min="0" max="200" aria-label="Minimum price, exact">
          <span class="ns-range__sep">—</span>
          <input class="ns-input" type="number" data-range-out value="120" min="0" max="200" aria-label="Maximum price, exact">
        </div>
      </div>
    </details>
    <details class="ns-filters__group" open>
      <summary class="ns-filters__legend">Lesson type <i class="ph ph-caret-down" aria-hidden="true"></i></summary>
      <div class="ns-filters__list">
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="type" value="video"><span>Video</span><span class="ns-filters__count">31</span></label>
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="type" value="lab"><span>Hands-on labs</span><span class="ns-filters__count">14</span></label>
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="type" value="live"><span>Live sessions</span><span class="ns-filters__count">3</span></label>
      </div>
    </details>
    <details class="ns-filters__group">
      <summary class="ns-filters__legend">Duration <i class="ph ph-caret-down" aria-hidden="true"></i></summary>
      <div class="ns-filters__list">
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="len" value="short"><span>Under 2 hours</span><span class="ns-filters__count">12</span></label>
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="len" value="mid"><span>2 – 6 hours</span><span class="ns-filters__count">26</span></label>
        <label class="ns-choice"><input class="ns-checkbox" type="checkbox" name="len" value="long"><span>Over 6 hours</span><span class="ns-filters__count">13</span></label>
      </div>
    </details>
  </form>
  <div>
    <div class="ns-filters__applied" data-applied hidden></div>
    <div class="ns-course-filters">
      <span class="ns-filters__title">51 courses</span>
      <select class="ns-select" aria-label="Sort by"><option>Most popular</option><option>Newest</option><option>Highest rated</option></select>
    </div>
    <div class="ns-course-grid">
      <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Apex basics</span></a><span class="ns-ccard__meta"><span>12 lessons</span></span></div></div>
      <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">SOQL, properly</span></a><span class="ns-ccard__meta"><span>6 lessons</span></span></div></div>
    </div>
  </div>
</div>` },
    ],
  },

  {
    id: "testimonials", title: "Learner testimonials", family: "LMS",
    summary: "Quotes with the rating the person actually gave, and a real attribution. A testimonial with no name and no source is a sentence the marketing team wrote, and readers know it. The featured one is a pull-quote and uses the pull-quote's own device rather than inventing a second one.",
    use: ["Below the curriculum on a course page", "A dark band on the marketing home"],
    not: ["Invented quotes, or quotes with an initial and a first name only", "More than about six — a wall of praise reads as none"],
    a11y: ["Each quote is a real &lt;blockquote&gt; with a &lt;cite&gt;-carrying footer", "The rating's number is text; the stars are aria-hidden decoration over it"],
    variants: [
      { name: "Grid, with a featured quote", html: `<div class="ns-testimonials" style="inline-size:100%">
  <blockquote class="ns-testimonial ns-testimonial--featured">
    <p class="ns-testimonial__quote">I had done three other Apex courses and still could not explain bulkification. This one spent twenty minutes on why one record at a time fails, and it finally landed.</p>
    <footer class="ns-testimonial__who">
      <img class="ns-testimonial__avatar" src="../assets/logo/favicon.svg" alt="">
      <span>
        <span class="ns-testimonial__name">Priya Raman</span>
        <span class="ns-testimonial__role">Salesforce Developer · Bengaluru</span>
      </span>
    </footer>
  </blockquote>
  <blockquote class="ns-testimonial">
    <span class="ns-rating" data-value="5" data-of="5">
      <span class="ns-rating__value">5.0</span>
      <span class="ns-rating__stars" aria-hidden="true"><span><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i></span><span class="ns-rating__fill"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></span></span>
    </span>
    <p class="ns-testimonial__quote">The labs are the difference. Watching someone build a trigger is not the same as building one, and this course knows it.</p>
    <footer class="ns-testimonial__who">
      <img class="ns-testimonial__avatar" src="../assets/logo/favicon.svg" alt="">
      <span><span class="ns-testimonial__name">Marcus Ellery</span><span class="ns-testimonial__role">Admin → Developer</span></span>
    </footer>
  </blockquote>
  <blockquote class="ns-testimonial">
    <span class="ns-rating" data-value="4" data-of="5">
      <span class="ns-rating__value">4.0</span>
      <span class="ns-rating__stars" aria-hidden="true"><span><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i><i class="ph ph-star"></i></span><span class="ns-rating__fill"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i></span></span>
    </span>
    <p class="ns-testimonial__quote">Wanted more on integration, but everything that is here is taught properly. Passed the ADM-201 four weeks later.</p>
    <footer class="ns-testimonial__who">
      <img class="ns-testimonial__avatar" src="../assets/logo/favicon.svg" alt="">
      <span><span class="ns-testimonial__name">Anita Fernandes</span><span class="ns-testimonial__role">Consultant</span></span>
    </footer>
  </blockquote>
</div>` },
      { name: "With the result", note: "The claim a learner is actually shopping for, in mono above the quote. A testimonial that says “great course” proves nothing; one that says “passed PD1 in nine weeks” is the whole argument.", html: `<figure class="ns-testimonial" style="max-inline-size:32rem">
  <span class="ns-testimonial__result"><i class="ph ph-seal-check" aria-hidden="true"></i>Passed PD1 in 9 weeks</span>
  <blockquote class="ns-testimonial__quote">I had written Apex for a year and still could not say why my triggers broke on data loads. The bulk lesson fixed that in an afternoon.</blockquote>
  <figcaption class="ns-testimonial__who">
    <span class="ns-avatar ns-testimonial__avatar">AM</span>
    <span><span class="ns-testimonial__name">Anita M.</span><span class="ns-testimonial__role">Admin → developer, Pune</span></span>
  </figcaption>
</figure>` },
      { name: "Compact strip", note: "<code>--compact</code>: one line each, three under a hero. The quote drops to the sans face because at this size the serif is a texture rather than a voice.", html: `<div class="ns-testimonials" style="inline-size:100%">
  <figure class="ns-testimonial ns-testimonial--compact">
    <blockquote class="ns-testimonial__quote">The labs are the reason it stuck.</blockquote>
    <figcaption class="ns-testimonial__who"><span class="ns-avatar ns-avatar--sm ns-testimonial__avatar">RK</span><span class="ns-testimonial__name">Ravi K.</span></figcaption>
  </figure>
  <figure class="ns-testimonial ns-testimonial--compact">
    <blockquote class="ns-testimonial__quote">First course that explained governor limits like a budget.</blockquote>
    <figcaption class="ns-testimonial__who"><span class="ns-avatar ns-avatar--sm ns-testimonial__avatar">PJ</span><span class="ns-testimonial__name">Priya J.</span></figcaption>
  </figure>
  <figure class="ns-testimonial ns-testimonial--compact">
    <blockquote class="ns-testimonial__quote">Short lessons, no filler, no intro music.</blockquote>
    <figcaption class="ns-testimonial__who"><span class="ns-avatar ns-avatar--sm ns-testimonial__avatar">DN</span><span class="ns-testimonial__name">Dev N.</span></figcaption>
  </figure>
</div>` },
      { name: "With a portrait", note: "<code>--media</code>: the one testimonial a page leads with, using the taped print from Picture frames so the person reads as a person rather than as a stock avatar.", html: `<figure class="ns-testimonial ns-testimonial--media" style="max-inline-size:36rem">
  <span class="ns-pframe ns-pframe--photo"><span class="ns-ph" aria-hidden="true"></span></span>
  <span>
    <span class="ns-testimonial__result"><i class="ph ph-seal-check" aria-hidden="true"></i>Hired as a junior developer</span>
    <blockquote class="ns-testimonial__quote">I built the volunteer-shift project from the course and talked through it in the interview. That was the interview.</blockquote>
    <figcaption class="ns-testimonial__who"><span><span class="ns-testimonial__name">Sana R.</span><span class="ns-testimonial__role">Bengaluru</span></span></figcaption>
  </span>
</figure>` },
      { name: "Marquee", note: "A continuous strip of short testimonials, for the band above a footer. Uses the shared Marquee — same track, same pause-on-hover, same reduced-motion stop — so this is a placement of testimonials rather than a second component. Keep the quotes to one line each: a marquee is read in passing, and a paragraph in motion is unreadable by design.", html: `<div class="ns-marquee ns-marquee--slow" style="inline-size:100%">
  <div class="ns-marquee__track">
    <span class="ns-marquee__item">“The labs are the reason it stuck.” <b>Ravi K.</b></span>
    <span class="ns-marquee__item">“Passed PD1 in nine weeks.” <b>Anita M.</b></span>
    <span class="ns-marquee__item">“Short lessons, no filler, no intro music.” <b>Dev N.</b></span>
    <span class="ns-marquee__item">“Explained governor limits like a budget.” <b>Priya J.</b></span>
    <span class="ns-marquee__item">“The labs are the reason it stuck.” <b>Ravi K.</b></span>
    <span class="ns-marquee__item">“Passed PD1 in nine weeks.” <b>Anita M.</b></span>
    <span class="ns-marquee__item">“Short lessons, no filler, no intro music.” <b>Dev N.</b></span>
    <span class="ns-marquee__item">“Explained governor limits like a budget.” <b>Priya J.</b></span>
  </div>
</div>` },
    ],
  },

  {
    id: "instructor", title: "Instructor", family: "LMS",
    summary: "The author module — one instructor or several. With several, each gets the same block: a course with two instructors has two instructors, and shrinking the second one is an editorial claim the layout should not be making. The stats line is the credential — courses taught, learners, rating — in mono, because it is data.",
    use: ["Below the curriculum on a course page", "An instructor's own profile page"],
    not: ["A byline on a blog post — that is Author box (CMS)", "A team page — that is a card grid"],
    a11y: ["The avatar is decorative (alt=\"\"); the name beside it is the content", "Stat glyphs are aria-hidden and every figure is also a word"],
    variants: [
      { name: "One instructor", html: `<div class="ns-instructor" style="max-inline-size:40rem">
  <img class="ns-instructor__avatar" src="../assets/logo/favicon.svg" alt="">
  <div>
    <p class="ns-instructor__name">Swarnil Singhai</p>
    <p class="ns-instructor__role">Salesforce Architect · 11× certified</p>
    <div class="ns-instructor__stats">
      <span><i class="ph ph-star" aria-hidden="true"></i>4.8 instructor rating</span>
      <span><i class="ph ph-users-three" aria-hidden="true"></i>24,100 learners</span>
      <span><i class="ph ph-books" aria-hidden="true"></i>9 courses</span>
    </div>
    <p class="ns-instructor__bio">Eleven years building on the platform, most of them cleaning up other people's triggers. Teaches the way he wishes it had been taught to him: the model first, the syntax second.</p>
    <div style="margin-block-start:var(--space-4);display:flex;gap:var(--space-2)">
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="#">All 9 courses</a>
      <a class="ns-btn ns-btn--quiet ns-btn--sm" href="#">Profile</a>
    </div>
  </div>
</div>` },
      { name: "Two instructors", note: "Equal blocks. Ranking co-instructors by layout is a claim about them that the page should not be making silently.", html: `<div class="ns-instructors" style="inline-size:100%">
  <div class="ns-instructor">
    <img class="ns-instructor__avatar" src="../assets/logo/favicon.svg" alt="">
    <div>
      <p class="ns-instructor__name">Swarnil Singhai</p>
      <p class="ns-instructor__role">Architecture &amp; Apex</p>
      <div class="ns-instructor__stats"><span><i class="ph ph-books" aria-hidden="true"></i>9 courses</span><span><i class="ph ph-users-three" aria-hidden="true"></i>24,100</span></div>
    </div>
  </div>
  <div class="ns-instructor">
    <img class="ns-instructor__avatar" src="../assets/logo/favicon.svg" alt="">
    <div>
      <p class="ns-instructor__name">Priya Raman</p>
      <p class="ns-instructor__role">Flows &amp; automation</p>
      <div class="ns-instructor__stats"><span><i class="ph ph-books" aria-hidden="true"></i>4 courses</span><span><i class="ph ph-users-three" aria-hidden="true"></i>9,300</span></div>
    </div>
  </div>
</div>` },
      { name: "Outcomes & includes", note: "\"What you'll learn\" and \"Requirements\" are the same list at two tones — two columns where there is room, because a single column of eight one-line items is a very tall list of very short lines.", html: `<div style="display:grid;gap:var(--space-8);inline-size:100%">
  <div>
    <p class="ns-kicker">What you'll learn</p>
    <ul class="ns-outcomes">
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Write a trigger that survives a 200-record data load.</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Read a governor-limit error and know which line caused it.</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Query selectively, and know when an index is being used.</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Deploy with SFDX, with 75%+ coverage that means something.</span></li>
    </ul>
  </div>
  <div>
    <p class="ns-kicker">Requirements</p>
    <ul class="ns-outcomes ns-outcomes--plain ns-outcomes--single">
      <li><i class="ph ph-circle" aria-hidden="true"></i><span>A free Developer org — we set one up in lesson 01.</span></li>
      <li><i class="ph ph-circle" aria-hidden="true"></i><span>No prior Apex. Experience with any programming language helps.</span></li>
    </ul>
  </div>
</div>` },
      { name: "Two instructors", note: "<code>--pair</code>: equal blocks. A course written by two people has two authors, and shrinking the second one is an editorial claim the layout should not be making.", html: `<div class="ns-instructors ns-instructors--pair" style="inline-size:100%">
  <div class="ns-instructor">
    <span class="ns-avatar ns-avatar--lg ns-instructor__avatar">SW</span>
    <div>
      <p class="ns-instructor__name">Swarnil Singhai</p>
      <p class="ns-instructor__role">Platform architect · 9 years</p>
      <p class="ns-instructor__bio">Writes the Apex and integration tracks. Has deployed to orgs with more triggers than tests, and would like that to stop.</p>
    </div>
  </div>
  <div class="ns-instructor">
    <span class="ns-avatar ns-avatar--lg ns-instructor__avatar">RS</span>
    <div>
      <p class="ns-instructor__name">Rahul Sharma</p>
      <p class="ns-instructor__role">Admin lead · 6 years</p>
      <p class="ns-instructor__bio">Writes the admin and flow tracks, and the labs that make you build the thing rather than watch it.</p>
    </div>
  </div>
</div>` },
      { name: "Byline", note: "Attribution rather than biography: the avatar stack plus names that read as a sentence. For a card foot, a lesson header, a blog post — anywhere the authors are a credit rather than a section.", html: `<div style="display:flex;flex-direction:column;gap:var(--space-4)">
  <span class="ns-byline">
    <span class="ns-avatar-stack">
      <span class="ns-avatar ns-avatar--sm">SW</span>
      <span class="ns-avatar ns-avatar--sm">RS</span>
    </span>
    <span class="ns-byline__names"><b>Swarnil</b> and <b>Rahul</b></span>
  </span>
  <span class="ns-byline">
    <span class="ns-avatar-stack">
      <span class="ns-avatar ns-avatar--sm">SW</span>
      <span class="ns-avatar ns-avatar--sm">RS</span>
      <span class="ns-avatar ns-avatar--sm ns-avatar--more">+2</span>
    </span>
    <span class="ns-byline__names"><b>Swarnil</b>, <b>Rahul</b> and two more</span>
  </span>
  <span class="ns-byline ns-byline--stack">
    <span class="ns-avatar-stack">
      <span class="ns-avatar ns-avatar--sm">SW</span>
      <span class="ns-avatar ns-avatar--sm">RS</span>
    </span>
    <span class="ns-byline__names">Written by <b>Swarnil</b> and <b>Rahul</b> · updated Jan 2026</span>
  </span>
</div>` },
    ],
  },
  {
    id: "player", title: "Course player", family: "LMS",
    summary: "The screen a learner lives in: a 16:9 stage on brand-900 in both themes, the lesson header, the lesson's own detail tabs (chapters, transcript, resources, notes, Q&amp;A), a docked prev/next carrying the position, and a FIXED curriculum rail ending in the course's standing action. One viewport, one scrollbar — only the content column moves. Two columns &ge; lg; below, a single column with the stage always first, the CTA above the list, and the rail replaced by the panel bar and its popover.",
    use: ["Lesson pages in both products — Ghost via templates/course-player.html, Next.js via CoursePlayer/LessonRail", "--article for a lesson that is mostly reading: no stage, prose at the measure with the lesson's outline in the space beside it", "--scroll where the document scroll is genuinely the right one"],
    not: ["Marketing pages with one embedded video — that is just a video in prose"],
    a11y: ["←/→ move lessons; space/k is left to the media element — stealing it breaks the player's own controls", "Row state is spelled for assistive tech (\"completed\", \"locked — members only\"), not only drawn", "Locked rows stay links (to the upgrade page) — a dead row explains nothing", "The rail toggle carries aria-expanded and lives in the lesson header, so it is still reachable once the rail is gone"],
    variants: [
      { name: "Lesson rows", note: "done replaces the index with a check — the number has done its job; current gets the accent line; locked dims but stays a link.", html: `<div style="max-inline-size:22rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <a class="ns-lesson" href="#" data-state="done">
    <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
    <span class="ns-lesson__title">SELECT and WHERE<span class="ns-visually-hidden"> (completed)</span></span>
    <span class="ns-lesson__time">14:02</span></a>
  <a class="ns-lesson" href="#" aria-current="true">
    <span class="ns-lesson__index" aria-hidden="true">07</span>
    <span class="ns-lesson__title">SOQL joins: relationships</span>
    <span class="ns-lesson__time">21:15</span></a>
  <a class="ns-lesson" href="#">
    <span class="ns-lesson__index" aria-hidden="true">08</span>
    <span class="ns-lesson__title">Aggregate queries</span>
    <span class="ns-lesson__time">18:40</span></a>
  <a class="ns-lesson" href="#" data-state="locked">
    <span class="ns-lesson__index" aria-hidden="true">09</span>
    <span class="ns-lesson__title">Bulk-safe triggers<span class="ns-visually-hidden"> (locked)</span></span>
    <span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span></a>
</div>` },
      { name: "Lesson header + nav", html: `<div style="max-inline-size:34rem">
  <header class="ns-player__head" style="padding-inline:0">
    <p class="ns-player__kicker">section 2 · lesson 07</p>
    <h2 class="ns-player__title">SOQL joins: relationships in queries</h2>
    <p class="ns-player__meta"><span>21:15</span><span>updated Jan 2026</span></p>
  </header>
  <div class="ns-player__nav" style="padding-inline:0">
    <a class="ns-btn ns-btn--outline ns-btn--sm" href="#"><i class="ph ph-caret-left" aria-hidden="true"></i> Previous</a>
    <div class="ns-progress-row">
      <progress class="ns-progress" value="6" max="12" aria-label="6 of 12 lessons"></progress>
      <span class="ns-progress-row__value">6/12</span>
    </div>
    <a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Next lesson <i class="ph ph-caret-right" aria-hidden="true"></i></a>
  </div>
</div>` },
      { name: "The rail as a timeline", note: "Opt-in: add <code>ns-player__list--timeline</code> to the list and nothing else changes. A hairline runs down the index column and each lesson number becomes a node on it — the claim being that a course is a <strong>path</strong>, which a flat list of rows implies but never draws.<br><br><strong>Only the current node is filled.</strong> An earlier version put every finished lesson in a green disc and ran the line green behind it, which meant a learner nine lessons in got a column of green coins and one blue one — the thing you were looking for was the quietest mark on the rail. Completion is already said by the check that replaced the number and by the muted title; the fill is reserved for where you ARE, because that is the one question the rail exists to answer. A members-only node goes dashed: the path continues, but it is not yours yet.<br><br>The node keeps the index cell's existing width. The first grid column is <code>auto</code>, so shrinking the node shrinks the column and the line no longer passes through the middle of anything — which is exactly how it went off-centre the first time. The line's position is derived from the row's own tokens (leading border + inline padding + half the index cell), so it follows if any of them change, and it stops half-way at the first and last rows so the path has a beginning and an end.", html: `<div style="max-inline-size:17rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-player__list ns-player__list--timeline">
    <a class="ns-lesson" href="#0" data-state="done">
      <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
      <span class="ns-lesson__title">What is an org?<span class="ns-visually-hidden"> (completed)</span></span>
      <span class="ns-tooltip">What is an org?</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0"><i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip ns-tooltip--below">Video</span></span>
      <span class="ns-lesson__time">08:12</span></a>
    <a class="ns-lesson" href="#0" data-state="done">
      <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
      <span class="ns-lesson__title">Objects &amp; fields<span class="ns-visually-hidden"> (completed)</span></span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--article ns-tooltip-host" tabindex="0"><i class="ph ph-article" aria-hidden="true"></i><span class="ns-tooltip">Article</span></span>
      <span class="ns-lesson__time">12:40</span></a>
    <a class="ns-lesson" href="#0" aria-current="true">
      <span class="ns-lesson__index" aria-hidden="true">03</span>
      <span class="ns-lesson__title">SOQL joins: relationships</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--video ns-tooltip-host" tabindex="0"><i class="ph ph-video" aria-hidden="true"></i><span class="ns-tooltip">Video</span></span>
      <span class="ns-lesson__time">21:15</span></a>
    <a class="ns-lesson" href="#0">
      <span class="ns-lesson__index" aria-hidden="true">04</span>
      <span class="ns-lesson__title">Aggregate queries</span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--quiz ns-tooltip-host" tabindex="0"><i class="ph ph-exam" aria-hidden="true"></i><span class="ns-tooltip">Quiz</span></span>
      <span class="ns-lesson__time">05:00</span></a>
    <a class="ns-lesson" href="#0" data-access="members">
      <span class="ns-lesson__index" aria-hidden="true">05</span>
      <span class="ns-lesson__title">Bulk-safe triggers<span class="ns-visually-hidden"> (locked \u2014 members only)</span></span>
      <span class="ns-ltype ns-ltype--icon ns-ltype--lab ns-tooltip-host" tabindex="0"><i class="ph ph-flask" aria-hidden="true"></i><span class="ns-tooltip">Hands-on lab</span></span>
      <span class="ns-lesson__time"><i class="ph ph-lock-simple" aria-hidden="true"></i></span></a>
  </div>
</div>` },
      { name: "The rail's foot — an action", note: "For the surfaces that still have a standing action: a locked course (enrol), a finished one (download the certificate). The LESSON player's rail does not — its progress is the full-width line on the course bar and its next action is the docked bar, so its foot is share and Ask AI instead (below). One primary and one line of fine print: a rail that ends in three buttons is an upsell.", html: `<div style="max-inline-size:20rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-player__side-cta">
    <span class="ns-player__side-cta-meta">Your progress <b>8 / 24</b></span>
    <progress class="ns-progress" value="8" max="24" aria-label="8 of 24 lessons complete"></progress>
    <button type="button" class="ns-btn ns-btn--primary ns-btn--block ns-btn--sm"><i class="ph ph-play" aria-hidden="true"></i> Resume lesson 09</button>
    <span class="ns-player__side-cta-meta">Certificate at 100%</span>
  </div>
</div>` },
      { name: "Locked-course foot", note: "The same slot doing the other job: this course is not bought yet, so the action is enrol and the fine print is what that buys.", html: `<div style="max-inline-size:20rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-player__side-cta">
    <span class="ns-player__side-cta-meta">Free preview <b>2 / 24</b></span>
    <button type="button" class="ns-btn ns-btn--primary ns-btn--block ns-btn--sm">Enrol — $49</button>
    <span class="ns-player__side-cta-meta">Lifetime access · certificate</span>
  </div>
</div>` },
      { name: "Detail tabs", note: "Everything the lesson carries besides the media, in one strip rather than stacked down the column. Stacked, the chapter list, the transcript, the files and the discussion push the next-lesson control below three screens of scroll; as tabs the column stays one screen deep and each is one click from the video. <code>.ns-player__body--wide</code> lets the strip take the column's full width — a chapter list squeezed to the reading measure wastes the half of the column the video already established — while prose inside a panel keeps its own measure.", html: `<div class="ns-player__body ns-player__body--wide" style="padding-inline:0">
  <div class="ns-tabs" role="tablist" aria-label="Lesson details">
    <button class="ns-tab" type="button" role="tab" id="pd-t1" aria-controls="pd-p1" aria-selected="true"><i class="ph ph-list ns-tab__icon" aria-hidden="true"></i> Chapters <span class="ns-tab__count">5</span></button>
    <button class="ns-tab" type="button" role="tab" id="pd-t2" aria-controls="pd-p2" aria-selected="false"><i class="ph ph-article ns-tab__icon" aria-hidden="true"></i> Transcript</button>
    <button class="ns-tab" type="button" role="tab" id="pd-t3" aria-controls="pd-p3" aria-selected="false"><i class="ph ph-folder-open ns-tab__icon" aria-hidden="true"></i> Resources <span class="ns-tab__count">3</span></button>
  </div>
  <div class="ns-tabpanel" role="tabpanel" id="pd-p1" aria-labelledby="pd-t1" tabindex="0">
    <ol class="ns-vchapters">
      <li class="ns-vchapters__item" data-start="0" data-state="done"><button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__title">What a relationship field stores</span><span class="ns-vchapters__time">00:00</span><span class="ns-vchapters__meta">3 min · watched</span></button></li>
      <li class="ns-vchapters__item" data-start="483" aria-current="true"><button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__title">Subqueries: down to the children</span><span class="ns-vchapters__time">08:03</span><span class="ns-vchapters__meta">6 min · playing</span></button></li>
      <li class="ns-vchapters__item" data-start="845"><button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__title">Where the two count against the limits</span><span class="ns-vchapters__time">14:05</span><span class="ns-vchapters__meta">4 min</span></button></li>
    </ol>
  </div>
  <div class="ns-tabpanel" role="tabpanel" id="pd-p2" aria-labelledby="pd-t2" tabindex="0">
    <dl class="ns-deflist">
      <dt>00:12</dt><dd>A lookup field does not store the record. It stores an id.</dd>
      <dt>08:03</dt><dd>Going down is a subquery, and it is a different shape.</dd>
    </dl>
  </div>
  <div class="ns-tabpanel" role="tabpanel" id="pd-p3" aria-labelledby="pd-t3" tabindex="0">
    <a class="ns-resource" href="#0"><span class="ns-resource__icon"><i class="ph ph-file-text" aria-hidden="true"></i></span><span class="ns-resource__body"><span class="ns-resource__title">Relationship queries cheat sheet</span><span class="ns-resource__type">PDF · 2 pages</span></span><i class="ph ph-arrow-down ns-resource__cue" aria-hidden="true"></i></a>
  </div>
</div>` },
      { name: "The wired stage", note: "The bare <code>.ns-player__stage</code> is a slot you drop an <code>&lt;iframe&gt;</code> into and leave the vendor's controls on. <code>--player</code> is the slot holding the system's OWN player: the 16:9 box moves down to <code>.ns-vplayer__stage</code> and the stage becomes a plain container, because a control bar nailed inside a box that is already exactly 16:9 either covers the last inch of the picture or overflows. <code>data-chapters</code> points the player at the chapter list in the tab panel below — the list is content, so it lives in the page where it can be read without pressing play, and one player still drives it.", html: `<pre class="ns-code__pre"><code>&lt;div class="ns-player__stage ns-player__stage--player"&gt;
  &lt;div class="ns-vplayer" data-ns-video data-youtube="VIDEO_ID"
       data-chapters="#lesson-chapters" data-state="paused"&gt;
    &lt;div class="ns-vplayer__stage"&gt;
      &lt;button class="ns-vplayer__big" type="button" aria-label="Play"&gt;…&lt;/button&gt;
    &lt;/div&gt;
    &lt;div class="ns-vplayer__bar"&gt;…&lt;/div&gt;
  &lt;/div&gt;
&lt;/div&gt;</code></pre>` },
      { name: "The rail's foot — the lesson player", note: "What you do WITH a lesson rather than where you go next: pass it on, or get help with it. Both secondary, so both quiet and neither ever the solid blue.<br><br>The AI rows are ordinary links with <code>target=\"_blank\" rel=\"noopener\"</code> — no key, no proxy, no request from us. <code>assets/js/lms.js</code> composes each href from ONE prompt written on the container (<code>data-ns-ask-prompt</code>) rather than repeating the same sentence in three hrefs that then drift apart, and appends the video's current timestamp when there is one, because \"explain what is happening at 08:03\" is a better question than \"explain this lesson\". The reader can see exactly what is being sent before they click: it is in the URL, and Copy puts it on the clipboard verbatim.", html: `<div style="max-inline-size:17rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-player__side-foot">
    <div class="ns-share">
      <span class="ns-share__label">Share</span>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Copy link"><i class="ph ph-link-simple" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share on LinkedIn"><i class="ph ph-linkedin-logo" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share on X"><i class="ph ph-x-logo" aria-hidden="true"></i></button>
    </div>
    <div class="ns-usermenu">
      <button type="button" class="ns-btn ns-btn--outline ns-btn--sm" data-ns-menu aria-expanded="false" aria-controls="ask-doc"><i class="ph ph-sparkle" aria-hidden="true"></i> Ask AI</button>
      <div class="ns-usermenu__panel" id="ask-doc" role="menu">
        <span class="ns-menu__label">Open this lesson in</span>
        <a class="ns-menu__item" role="menuitem" href="#0"><i class="ph ph-sparkle" aria-hidden="true"></i> Claude</a>
        <a class="ns-menu__item" role="menuitem" href="#0"><i class="ph ph-chat-circle-text" aria-hidden="true"></i> ChatGPT</a>
        <a class="ns-menu__item" role="menuitem" href="#0"><i class="ph ph-magnifying-glass" aria-hidden="true"></i> Perplexity</a>
        <hr class="ns-menu__sep">
        <button type="button" class="ns-menu__item" role="menuitem"><i class="ph ph-file-text" aria-hidden="true"></i> Copy the prompt</button>
      </div>
    </div>
  </div>
</div>` },
      { name: "Article lesson", note: "The same player, the other kind of lesson: no 16:9 stage at all, and the content column becomes a two-part reading block — prose at the measure, with the lesson's OUTLINE in the space beside it. The pair is sized together, so the header and the docked nav line up on the same left edge as the text; below lg the rail becomes the horizontal <code>.ns-toc--inline</code> strip, which has somewhere to go where a sticky rail does not. Progress is a 2px hairline driven by scroll rather than a time code. A written lesson that keeps a black video box at the top is a video page with the video missing — and one that leaves a third of the screen empty on each side, with its own contents list nowhere on the page, is a document you navigate by scrolling and hoping.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player-article.html" target="_blank" rel="noopener">Open the article-lesson demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
      { name: "Full layout", note: "The complete three-column screen — curriculum, lesson, chapters — rendered from the framework-agnostic template with the real stylesheet. The two lesson kinds link to each other, so prev/next walks between them with the cross-document view transition from motion.css: a cross-fade, no slide, because the rail and the docked bar did not move and should not look like they did.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player.html" target="_blank" rel="noopener">Video lesson <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player-article.html" target="_blank" rel="noopener">Written lesson <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
      { name: "At three widths", note: "The real pages in real iframes at 390, 768 and 1180 — because media queries answer to the VIEWPORT, and a narrow div would keep rendering the desktop layout at phone width and prove the opposite of what it looked like it was proving.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player-responsive.html" target="_blank" rel="noopener">Open the responsive proof <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
          { name: "Per-type progress", note: "\"How far through this lesson am I\" has three different honest answers, so it has three different controls. One bar for all three is how a quiz ends up claiming you are 60% <em>correct</em> when you are 60% <em>finished</em>. Video counts time and marks chapters; article counts scroll and is a hairline, never a widget; a quiz has TWO numbers — answered and score — and pips can say what a length cannot.", html: `<div style="display:grid;gap:var(--space-6);inline-size:100%;max-inline-size:34rem">
  <div class="ns-lprogress ns-lprogress--video" style="--fx-progress:38%">
    <span class="ns-lprogress__label">Video</span>
    <span class="ns-lprogress__track">
      <span class="ns-lprogress__fill"></span>
      <span class="ns-lprogress__chapter" style="--fx-at:22%"></span>
      <span class="ns-lprogress__chapter" style="--fx-at:55%"></span>
      <span class="ns-lprogress__chapter" style="--fx-at:78%"></span>
    </span>
    <span class="ns-lprogress__time">04:38 / 12:10</span>
  </div>
  <div>
    <span class="ns-lprogress ns-lprogress--article" style="--fx-progress:64%" role="progressbar" aria-label="Reading progress" aria-valuenow="64" aria-valuemin="0" aria-valuemax="100"></span>
    <p style="margin-block-start:var(--space-2);font-size:var(--size-fine);color:var(--color-muted)">Article — the hairline above is the whole control. A reading-progress widget with a percentage label is a distraction from the thing it measures.</p>
  </div>
  <div class="ns-lprogress ns-lprogress--quiz">
    <span class="ns-lprogress__label">Quiz</span>
    <span class="ns-lprogress__pips">
      <span class="ns-lprogress__pip" data-state="correct"></span>
      <span class="ns-lprogress__pip" data-state="correct"></span>
      <span class="ns-lprogress__pip" data-state="wrong"></span>
      <span class="ns-lprogress__pip" data-state="correct"></span>
      <span class="ns-lprogress__pip" data-state="current"></span>
      <span class="ns-lprogress__pip"></span>
      <span class="ns-lprogress__pip"></span>
      <span class="ns-lprogress__pip"></span>
    </span>
    <span class="ns-lprogress__score">3/4 correct</span>
  </div>
</div>` },
    ],
  },

  /* ======================================================= Teaching ==== */
  {
    id: "deck", title: "Slide deck", family: "Teaching",
    summary: "A presentation built out of the product's own parts. Six geometries — <code>lead</code>, <code>center</code>, <code>stack</code>, <code>split</code>, <code>aside</code>, <code>full</code> — and four tones, and that is the whole vocabulary; everything INSIDE a slide is a component that already exists (<code>.ns-code</code>, <code>.ns-compare</code>, <code>.ns-statblock</code>, <code>.ns-checklist</code>, <code>.ns-timeline</code>, <code>.ns-card</code>). A slide sizes itself in container units, so the same markup is legible on a projector, correct in a 15rem overview thumbnail, and readable on a phone — no scale transform, no resize listener. Light by default, because a projector in a lit room is a light surface; dark mode is the same deck under <code>[data-theme=\"dark\"]</code>.",
    use: ["Teaching a course session, a workshop or a lunch-and-learn", "Walking a room through a POC or a project you are building", "A conference or meetup talk that has to be shared afterwards as a link", "Embedding the session's slides inside the written lesson — <code>data-mode=\"scroll\"</code>"],
    not: ["A document — that is a lesson, and a lesson does not fit in 16:9", "A dashboard on a wall — the deck is driven, not ambient", "Anything where the audience reads at their own pace: the fragment reveal is a teaching device and becomes an obstacle the moment nobody is presenting"],
    a11y: [
      "The current slide carries aria-current — the state the room sees and the state a screen reader hears are the same attribute, and the CSS hides the rest from that one fact",
      "→ ↓ Space PgDn advance, ← ↑ PgUp go back, Home/End jump, G overview, N notes, F fullscreen, B blackout, ? shortcuts, Esc closes. Typing in a field is never intercepted",
      "Fragments dim rather than unmount, so nothing reflows on reveal and nothing is missing from the accessibility tree",
      "Overview thumbnails are inert clones — forty cloned slides full of links would otherwise be forty extra tab stops behind the deck",
      "Diagrams are boxes of real text, never a PNG: a screen reader reads the architecture slide and a translator translates it",
      "With no JS every slide is on the page and every fragment is visible — the handout, which is also what prints",
    ],
    variants: [
      { name: "The frame", note: "The three-row canvas every slide shares: head, body, running foot. The layout modifier changes what the BODY does and never where the head and the foot sit — which is what makes a 40-slide deck feel like one document instead of 40 posters. The 3px leading edge is the brand mark; it is on every slide so that none of them needs a logo.", stack: true, html: `<div class="ns-deck" data-mode="scroll" style="inline-size:100%;background:none">
  <section class="ns-slide">
    <div class="ns-slide__inner">
      <div class="ns-slide__head">
        <span class="ns-kicker">Consequences</span>
        <h2 class="ns-slide__title">Three things that follow from that</h2>
        <span class="ns-slide__rule"></span>
      </div>
      <div class="ns-slide__body">
        <ul class="ns-slide__points">
          <li class="ns-slide__point"><span class="ns-slide__point-index">01</span><span><b class="ns-slide__point-title">Never query inside a loop</b><span class="ns-slide__point-note">200 records × one SOQL each is 200 queries against a limit of 100.</span></span></li>
          <li class="ns-slide__point"><span class="ns-slide__point-index">02</span><span><b class="ns-slide__point-title">Trigger.new is a list, always</b><span class="ns-slide__point-note">Even when a user saved one record.</span></span></li>
          <li class="ns-slide__point"><span class="ns-slide__point-index">03</span><span><b class="ns-slide__point-title">One trigger per object</b><span class="ns-slide__point-note">Two run in an order the platform does not promise.</span></span></li>
        </ul>
      </div>
      <div class="ns-slide__foot">
        <span class="ns-slide__where">Module 01</span>
        <span class="ns-slide__num">06 / 25</span>
      </div>
    </div>
  </section>
</div>` },
      { name: "Tones", note: "<code>--sunken</code> flips with the theme; <code>--dark</code> and <code>--brand</code> do NOT — they are the brand's own surfaces, identical in both themes, and they exist to mark a gear change in the talk. Use one dark slide per module and no more: a deck where every third slide is navy has no gear changes left. <code>--grid</code> adds the dissolving hairline motif, the same one the hero band carries.", stack: true, html: `<div class="ns-deck" data-mode="scroll" style="inline-size:100%;background:none">
  <section class="ns-slide ns-slide--lead ns-slide--dark ns-slide--grid">
    <div class="ns-slide__inner">
      <div class="ns-slide__head">
        <span class="ns-kicker">Module 01</span>
        <h2 class="ns-slide__title">What a trigger actually is</h2>
        <p class="ns-slide__lede">Ten minutes. One idea, and then we look at real code.</p>
      </div>
      <div class="ns-slide__foot"><span class="ns-slide__where">Apex fundamentals</span><span class="ns-slide__num">04 / 25</span></div>
    </div>
  </section>
  <section class="ns-slide ns-slide--center ns-slide--brand ns-slide--grid">
    <div class="ns-slide__inner">
      <div class="ns-slide__head">
        <span class="ns-kicker">The limit that shapes everything</span>
        <span class="ns-slide__figure-value">100</span>
        <p class="ns-slide__lede">SOQL queries per synchronous transaction.</p>
        <span class="ns-slide__caption">Apex Developer Guide · Execution Governors</span>
      </div>
      <div class="ns-slide__foot"><span class="ns-slide__where">Module 03</span><span class="ns-slide__num">10 / 25</span></div>
    </div>
  </section>
</div>` },
      { name: "Explain, then show", note: "<code>--split</code>: the claim on the left, the code that proves it on the right. This is the shape most technical teaching wants and the one most decks skip, putting the code on its own slide where nobody can see what it was supposed to demonstrate. The code block is <code>.ns-code</code> — the same component the lesson pages use, re-tuned to the slide's type scale and nothing else.", stack: true, html: `<div class="ns-deck" data-mode="scroll" style="inline-size:100%;background:none">
  <section class="ns-slide ns-slide--split ns-slide--split-figure">
    <div class="ns-slide__inner">
      <div class="ns-slide__head">
        <span class="ns-kicker">The pattern</span>
        <h2 class="ns-slide__title">Collect the ids, query once, map, then act</h2>
      </div>
      <div class="ns-slide__body">
        <div class="ns-slide__col">
          <ul class="ns-slide__points ns-slide__points--tight">
            <li class="ns-slide__point"><span class="ns-slide__point-index">01</span><span class="ns-slide__point-title">Walk the batch, collect the ids</span></li>
            <li class="ns-slide__point"><span class="ns-slide__point-index">02</span><span class="ns-slide__point-title">One SOQL, outside the loop</span></li>
            <li class="ns-slide__point"><span class="ns-slide__point-index">03</span><span class="ns-slide__point-title">Index it into a Map</span></li>
          </ul>
        </div>
        <div class="ns-slide__col ns-slide__col--fill">
          <figure class="ns-code ns-code--dark" data-lang="apex">
            <figcaption class="ns-code__bar"><span class="ns-code__file"><i class="ph ph-code" aria-hidden="true"></i><span>CaseRouter.cls</span></span></figcaption>
${codeBody(`Set<Id> ids = new Set<Id>();
for (Case c : Trigger.new) ids.add(c.AccountId);

// one query, outside the loop
Map<Id, Account> byId = new Map<Id, Account>(
  [SELECT Id, Tier__c FROM Account WHERE Id IN :ids]);`, "apex")}
          </figure>
        </div>
      </div>
      <div class="ns-slide__foot"><span class="ns-slide__where">Module 03</span><span class="ns-slide__num">07 / 25</span></div>
    </div>
  </section>
</div>` },
      { name: "The architecture slide", note: "Boxes and arrows as TEXT, never a picture. A PNG of a diagram cannot restyle for dark mode, cannot be read by a screen reader, cannot be translated, and cannot be edited next year by the person who inherits the deck. <code>aria-current</code> marks the box you are talking about — its border brightens to brand, because elevation here is a border and never a lift.", stack: true, html: `<div class="ns-deck" data-mode="scroll" style="inline-size:100%;background:none">
  <section class="ns-slide">
    <div class="ns-slide__inner">
      <div class="ns-slide__head">
        <span class="ns-kicker">Where your code runs</span>
        <h2 class="ns-slide__title">The order of execution, abridged</h2>
        <span class="ns-slide__rule"></span>
      </div>
      <div class="ns-slide__body">
        <div class="ns-slide__flow">
          <div class="ns-slide__node"><span class="ns-slide__node-label">01 · load</span><span class="ns-slide__node-title">Record loaded</span><span class="ns-slide__node-note">From the DB, or initialised for an insert.</span></div>
          <i class="ph ph-arrow-right ns-slide__arrow" aria-hidden="true"></i>
          <div class="ns-slide__node" aria-current="true"><span class="ns-slide__node-label">02 · before</span><span class="ns-slide__node-title">Before triggers</span><span class="ns-slide__node-note">You are here. No DML needed to change the record.</span></div>
          <i class="ph ph-arrow-right ns-slide__arrow" aria-hidden="true"></i>
          <div class="ns-slide__node"><span class="ns-slide__node-label">03 · rules</span><span class="ns-slide__node-title">Validation rules</span><span class="ns-slide__node-note">Which is why a before trigger can fix data a rule would reject.</span></div>
          <i class="ph ph-arrow-right ns-slide__arrow" aria-hidden="true"></i>
          <div class="ns-slide__node"><span class="ns-slide__node-label">04 · after</span><span class="ns-slide__node-title">After triggers</span><span class="ns-slide__node-note">The record has an Id.</span></div>
        </div>
      </div>
      <div class="ns-slide__foot"><span class="ns-slide__where">Module 02</span><span class="ns-slide__num">12 / 25</span></div>
    </div>
  </section>
</div>` },
      { name: "Hands on, and the check", note: "Two slides teaching needs and no general presentation tool ships: an exercise with a countdown THE ROOM can see — so it ends because time ran out rather than because the presenter got bored — and a question whose options are LABELLED, because a room answering out loud needs a handle and “the third one” is not one. The timer runs past zero on purpose; an exercise four minutes over is a fact worth showing, and a clock frozen at 00:00 hides it. The answer is a <code>&lt;details&gt;</code>, so opening it in the room also puts it in the handout. Live — press the timer, open the answer.", stack: true, html: `<div class="ns-deck" data-mode="scroll" style="inline-size:100%;background:none">
  <section class="ns-slide ns-slide--split">
    <span class="ns-slide__badge"><i class="ph ph-barbell" aria-hidden="true"></i> Hands on</span>
    <div class="ns-slide__inner">
      <div class="ns-slide__head"><span class="ns-kicker">Your turn</span><h2 class="ns-slide__title">Build the router in your own org</h2></div>
      <div class="ns-slide__body">
        <div class="ns-slide__col">
          <ol class="ns-slide__points ns-slide__points--tight">
            <li class="ns-slide__point"><span class="ns-slide__point-index">01</span><span class="ns-slide__point-title">Create <code class="ns-code-inline">CaseRouter.cls</code></span></li>
            <li class="ns-slide__point"><span class="ns-slide__point-index">02</span><span class="ns-slide__point-title">Wire it to a before-insert trigger</span></li>
            <li class="ns-slide__point"><span class="ns-slide__point-index">03</span><span class="ns-slide__point-title">Insert 200 cases and read the log</span></li>
          </ol>
        </div>
        <div class="ns-slide__col">
          <p class="ns-slide__caption">Time remaining — click to start</p>
          <button type="button" class="ns-slide__timer" data-deck-timer="1500" data-state="idle" aria-label="Exercise timer, 25 minutes. Press to start."><span data-deck-timer-value>25:00</span><span class="ns-slide__timer-unit">min</span></button>
        </div>
      </div>
      <div class="ns-slide__foot"><span class="ns-slide__where">Module 04</span><span class="ns-slide__num">16 / 25</span></div>
    </div>
  </section>
  <section class="ns-slide">
    <span class="ns-slide__badge"><i class="ph ph-question" aria-hidden="true"></i> Quick check</span>
    <div class="ns-slide__inner">
      <div class="ns-slide__head"><span class="ns-kicker">Everyone answer</span><h2 class="ns-slide__title">A user imports 500 cases. How many times does your trigger run?</h2></div>
      <div class="ns-slide__body">
        <div class="ns-slide__options">
          <div class="ns-slide__option"><span class="ns-slide__option-key">A</span><span>Once — one import, one transaction</span></div>
          <div class="ns-slide__option" data-state="correct"><span class="ns-slide__option-key">B</span><span>Three times — 200, 200, 100</span></div>
          <div class="ns-slide__option"><span class="ns-slide__option-key">C</span><span>500 times — once per record</span></div>
        </div>
        <details class="ns-slide__answer">
          <summary><i class="ph ph-caret-right" aria-hidden="true"></i> Show the answer</summary>
          <p><b>B.</b> A bulk load is chunked into batches of 200, and each batch is its own transaction with its own governor limits — which is why “it worked on my one test record” proves nothing.</p>
        </details>
      </div>
      <div class="ns-slide__foot"><span class="ns-slide__where">Check</span><span class="ns-slide__num">17 / 25</span></div>
    </div>
  </section>
</div>` },
      { name: "The presenter chrome", note: "All of it lives OUTSIDE the slides, so none of it appears in a printed handout, a PDF export or an overview thumbnail. The count and the 2px progress hairline are the same mono/rail pair the course bar uses for a course — here for a talk. The theme switch is the system's own: a deck is not a place for a second theme control.", stack: true, html: `<div style="inline-size:100%;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-deck__rail" aria-hidden="true"><span style="--p:24%"></span></div>
  <div class="ns-deck__bar">
    <span class="ns-deck__deckname"><i class="ph ph-presentation-chart" aria-hidden="true"></i> Apex fundamentals · module 01</span>
    <span class="ns-deck__count"><b>06</b> / 25</span>
    <div class="ns-deck__tools">
      <button type="button" class="ns-navicon" aria-label="Previous slide"><i class="ph ph-arrow-left" aria-hidden="true"></i></button>
      <button type="button" class="ns-navicon" aria-label="Next slide"><i class="ph ph-arrow-right" aria-hidden="true"></i></button>
      <button type="button" class="ns-navicon" aria-label="All slides"><i class="ph ph-squares-four" aria-hidden="true"></i></button>
      <button type="button" class="ns-navicon" aria-label="Speaker notes"><i class="ph ph-note" aria-hidden="true"></i></button>
      <button type="button" class="ns-navicon" aria-label="Switch between presenting and the handout"><i class="ph ph-rows" aria-hidden="true"></i></button>
      <button type="button" class="ns-navicon" aria-label="Full screen"><i class="ph ph-projector-screen" aria-hidden="true"></i></button>
      <button type="button" class="ns-navicon" aria-label="Keyboard shortcuts"><i class="ph ph-question" aria-hidden="true"></i></button>
    </div>
  </div>
</div>` },
      { name: "Keyboard", note: "The set a presenter's clicker already sends, plus the panels. Advance reveals the next fragment before it moves to the next slide, and going BACK lands on a slide with everything already revealed — re-walking six fragments to reach the previous slide is how a presenter loses the room while pressing left arrow nine times.", stack: true, html: `<div class="ns-deck__help-card" style="inline-size:min(28rem,100%)">
  <div class="ns-deck__help-row"><span>Next, or reveal the next point</span><span class="ns-kbd-seq"><kbd class="ns-kbd">→</kbd><span class="ns-kbd-seq__sep">or</span><kbd class="ns-kbd">Space</kbd></span></div>
  <div class="ns-deck__help-row"><span>Back</span><span class="ns-kbd-seq"><kbd class="ns-kbd">←</kbd></span></div>
  <div class="ns-deck__help-row"><span>Go to slide 12</span><span class="ns-kbd-seq"><kbd class="ns-kbd">1</kbd><kbd class="ns-kbd">2</kbd></span></div>
  <div class="ns-deck__help-row"><span>All slides</span><span class="ns-kbd-seq"><kbd class="ns-kbd">G</kbd></span></div>
  <div class="ns-deck__help-row"><span>Speaker notes</span><span class="ns-kbd-seq"><kbd class="ns-kbd">N</kbd></span></div>
  <div class="ns-deck__help-row"><span>Full screen</span><span class="ns-kbd-seq"><kbd class="ns-kbd">F</kbd></span></div>
  <div class="ns-deck__help-row"><span>Blackout — look at me, not the wall</span><span class="ns-kbd-seq"><kbd class="ns-kbd">B</kbd></span></div>
  <div class="ns-deck__help-row"><span>Close anything</span><span class="ns-kbd-seq"><kbd class="ns-kbd">Esc</kbd></span></div>
</div>` },
      { name: "The whole deck", note: "Twenty-five slides, each a DIFFERENT shape, in the order a real course session uses them: open → agenda → teach → show → do → check → close. It is a pattern library rather than a talk — delete the ones you do not need and duplicate the ones you do. Press <kbd class=\"ns-kbd\">G</kbd> for the overview, <kbd class=\"ns-kbd\">N</kbd> for the notes, and the bar's rows icon to switch to the handout.", html: `<p><a class="ns-btn ns-btn--primary ns-btn--sm" href="./demo-deck.html" target="_blank" rel="noopener">Present it <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },

  /* ======================================================= Sections ==== */
  {
    id: "band", title: "Band", family: "Sections",
    summary: "The full-width page section every other section is built on: an inner container, an optional kicker/title/lede head, and three tones — plain, sunken, dark navy. A page is a stack of bands.",
    use: ["Wrapping any full-width section of a marketing or landing page", "The dark navy tone for the hero and the closing CTA", "sunken for quiet in-between bands (logos, testimonial)"],
    not: ["App screens inside the admin shell — those use .ns-pagehead + content, not bands", "Nesting a band inside a band"],
    a11y: ["Each band is a <section>; the band title is the section's heading in document order", "The hairline-grid motif is decorative and pointer-transparent"],
    variants: [
      { name: "Head grammar", note: "Kicker (the code-comment label), balanced title, lede.", html: `<div class="ns-band ns-band--tight"><div class="ns-band__inner">
  <header class="ns-band__head">
    <span class="ns-kicker">Why this works</span>
    <h2 class="ns-band__title">A curriculum, not a pile of videos</h2>
    <p class="ns-band__lede">Every course follows the same shape: concept, concrete example, bridge to the next step.</p>
  </header>
</div></div>` },
      { name: "Dark + grid", note: "The navy console band with the dissolving hairline grid — hero and CTA only.", html: `<div class="ns-band ns-band--dark ns-band--grid ns-band--tight"><div class="ns-band__inner">
  <span class="ns-kicker">Learn Salesforce, properly</span>
  <h2 class="ns-band__title">One roadmap, admin to developer</h2>
</div></div>` },
          { name: "Actions slot", note: "A band does NOT define its own action. It leaves <code>.ns-band__actions</code> and the page puts a Button in it, at whatever variant and size that page needs. Baking the action into the section is how a system ends up with six section components that each hard-code a differently-sized button — and why buttons drift out of proportion with the cards beside them. <code>--between</code> puts the head and the actions on one line, which is the shape a \"Latest courses … View all\" band wants.", html: `<section class="ns-band ns-band--tight">
  <div class="ns-band__inner">
    <div class="ns-band__head ns-band__head--between">
      <div>
        <span class="ns-kicker">Catalog</span>
        <h2 class="ns-band__title">Latest courses</h2>
      </div>
      <div class="ns-band__actions">
        <a class="ns-btn ns-btn--outline ns-btn--sm" href="#">Browse all <i class="ph ph-arrow-right ns-btn__arrow" aria-hidden="true"></i></a>
      </div>
    </div>
    <div class="ns-course-grid">
      <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Apex basics</span></a><span class="ns-ccard__meta"><span>12 lessons</span></span></div></div>
      <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">SOQL, properly</span></a><span class="ns-ccard__meta"><span>6 lessons</span></span></div></div>
      <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">LWC from scratch</span></a><span class="ns-ccard__meta"><span>14 lessons</span></span></div></div>
    </div>
  </div>
</section>` },
      { name: "Collapsible band", note: "A section that folds — native <code>&lt;details&gt;</code>, so keyboard operation, in-page find and the open state are the platform's. For SECONDARY sections on a long page: requirements, the full syllabus, an FAQ group. The band that answers \"what is this\" never folds, because a collapsed section is one a reader has to decide to open, and most will not. Live — click the heading.", html: `<details class="ns-band ns-band--tight ns-band--collapsible" open>
  <div class="ns-band__inner">
    <summary class="ns-band__toggle">
      <h2 class="ns-band__title">Requirements</h2>
      <span class="ns-band__toggle-hint">
        <span class="ns-band__toggle-open">Show</span><span class="ns-band__toggle-close">Hide</span>
        <i class="ph ph-caret-down" aria-hidden="true"></i>
      </span>
    </summary>
    <div class="ns-band__panel">
      <ul class="ns-outcomes ns-outcomes--plain">
        <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>A free Salesforce Developer org — we set one up in lesson 01.</span></li>
        <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Any browser. Nothing to install.</span></li>
        <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>No prior Apex. Some experience with any programming language helps.</span></li>
      </ul>
    </div>
  </div>
</details>` },
    ],
  },
  {
    id: "assembly", title: "Assembly", family: "Sections",
    summary: "The hero illustration, told in two acts on one loop: five component <em>files</em> — <code>nav.cmp</code>, <code>hero.cmp</code>, <code>button.cmp</code>, <code>card.cmp</code>, <code>chart.cmp</code> — scattered and then gathered, cross-fading into what they render: a miniature Namaste Salesforce homepage built from those very parts. The argument of the whole system, drawn with the system.",
    use: ["The media slot of a <code>--split</code> hero, on the navy band", "A page whose argument IS the system — either homepage's front door", "Anywhere a screenshot would be used to say &ldquo;this is what it builds&rdquo;"],
    not: ["A product marketing hero — there the media slot wants the real artifact, not a diagram of one", "Anything a reader is expected to read: it is <code>aria-hidden</code> texture, and its labels are chosen for length, not meaning", "A light surface. Every part is drawn in the on-dark palette"],
    a11y: [
      "<code>aria-hidden=\"true\"</code> on the stage: it is decoration, and the file names inside it are texture rather than content — announcing them would read as a broken UI",
      "Each keyframe's 0% is its RESTING state, so under prefers-reduced-motion the global guard leaves the finished homepage with the files at rest beside it — a legible still, not a blank stage",
      "Both acts run on one shared 11s timeline, so they cannot drift out of phase with each other",
      "The stage is a fixed 4:3 with percentage slots, so it scales with the hero and never reflows the words next to it",
    ],
    variants: [
      { name: "Files, then render", stack: true, note: "Each label sits in <strong>the slot its component will render into</strong> — <code>nav.cmp</code> where the navbar goes, <code>card.cmp</code> where the cards go — and cross-fades into that component in place. A version where the files drift in from the corners says &ldquo;components exist&rdquo;; this one says &ldquo;<em>this</em> component becomes <em>that</em> part of the page&rdquo;, which is the actual claim. The window is deliberately light on the navy band: it is a picture of a website, and <code>--color-on-dark</code> is a fixed white in both themes, so it does not quietly become a navy website in dark mode.", html: `<div class="ns-band ns-band--dark" style="padding:var(--space-6);border-radius:var(--radius-card)">
  <div style="max-inline-size:26rem;margin-inline:auto">
  <div class="ns-assembly" aria-hidden="true">
    <div class="ns-assembly__window">
      <div class="ns-assembly__chrome">
        <span class="ns-assembly__dot"></span>
        <span class="ns-assembly__dot"></span>
        <span class="ns-assembly__dot"></span>
        <span class="ns-assembly__url">namastesalesforce.com</span>
      </div>

      <!-- Every slot holds TWO layers in the same box: the component's
           file name, and the thing that file renders. They cross-fade on
           one shared timeline, so each label becomes its own component in
           the exact place that component lives on the page. -->
      <div class="ns-assembly__page">
        <div class="ns-assembly__slot ns-assembly__slot--nav">
          <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>nav.cmp</span>
          <div class="ns-assembly__render">
            <span class="ns-assembly__bar">
              <span class="ns-assembly__mark"></span>
              <span class="ns-assembly__line ns-assembly__line--short"></span>
              <span class="ns-assembly__line"></span>
            </span>
          </div>
        </div>

        <div class="ns-assembly__slot ns-assembly__slot--hero">
          <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>hero.cmp</span>
          <div class="ns-assembly__render">
            <span class="ns-assembly__stack">
              <span class="ns-assembly__line ns-assembly__line--wide"></span>
              <span class="ns-assembly__line ns-assembly__line--mid"></span>
            </span>
          </div>
        </div>

        <div class="ns-assembly__slot ns-assembly__slot--image">
          <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>image.cmp</span>
          <div class="ns-assembly__render">
            <span class="ns-assembly__media"><i class="ph ph-image" aria-hidden="true"></i></span>
          </div>
        </div>

        <div class="ns-assembly__slot ns-assembly__slot--button">
          <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>button.cmp</span>
          <div class="ns-assembly__render">
            <span class="ns-assembly__actions">
              <span class="ns-assembly__chip">Start</span>
              <span class="ns-assembly__chip ns-assembly__chip--quiet">Browse</span>
            </span>
          </div>
        </div>

        <div class="ns-assembly__slot ns-assembly__slot--card">
          <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>card.cmp</span>
          <div class="ns-assembly__render">
            <span class="ns-assembly__cards">
              <span class="ns-assembly__mini-card">
                <span class="ns-assembly__line ns-assembly__line--short"></span>
                <span class="ns-assembly__line"></span>
              </span>
              <span class="ns-assembly__mini-card">
                <span class="ns-assembly__line ns-assembly__line--short"></span>
                <span class="ns-assembly__line"></span>
              </span>
            </span>
          </div>
        </div>

        <div class="ns-assembly__slot ns-assembly__slot--chart">
          <span class="ns-assembly__cmp"><i class="ph ph-brackets-curly"></i>chart.cmp</span>
          <div class="ns-assembly__render">
            <span class="ns-assembly__bars"><i style="block-size:40%"></i><i style="block-size:70%"></i><i style="block-size:52%"></i><i style="block-size:90%"></i><i style="block-size:64%"></i></span>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</div>` },
    ],
  },
  {
    id: "hero-section", title: "Hero", family: "Sections",
    summary: "The page opener: kicker, display-size balanced title, lede, two actions and one mono proof line. Three variants and no more, differing only in where the eye enters — a fourth hero is a page that has not decided what it is for.",
    use: ["The top of the home page and major landing pages", "The proof line for one concrete fact — course count, price, cohort date", "--center for a launch page where the headline IS the event", "--split for the one page where showing beats telling"],
    not: ["Interior pages — a PageHead or a plain h1 opens those", "More than two actions; the second is already optional", "--split with decoration in the media slot — the picture must be proof (a real screenshot, the actual artifact), or the default hero says it better in fewer pixels"],
    a11y: ["The title is the page's h1", "Proof line is real text, not an image", "In --split the media slot is aria-hidden when decorative; below lg it drops UNDER the words, so the headline never leaves the first screen"],
    variants: [
      { name: "Dark hero", html: `<div class="ns-band ns-hero ns-band--dark ns-band--grid" style="padding-block:var(--space-10)"><div class="ns-band__inner">
  <span class="ns-kicker">Learn Salesforce, properly</span>
  <h1 class="ns-hero__title" style="font-size:var(--size-h1)">The training roadmap for people who build on Salesforce</h1>
  <p class="ns-hero__lede">Courses, a step-by-step roadmap and working code.</p>
  <div class="ns-hero__actions">
    <a class="ns-btn ns-btn--white" href="#">Start learning</a>
    <a class="ns-btn ns-btn--ghost" href="#">Browse the roadmap</a>
  </div>
  <span class="ns-hero__proof">12 courses · 214 lessons · free while in beta</span>
</div></div>` },
      { name: "Centred", flush: true, note: "For a LAUNCH surface — a campaign page, a cohort announcement. The title cap widens to 24ch (centred lines tolerate more length than ragged-right ones) and the lede narrows to the callout measure, so the block reads as one column rather than a heap.", html: `<div class="ns-band ns-hero ns-hero--center" style="padding-block:var(--space-10)"><div class="ns-band__inner">
  <span class="ns-kicker">Cohort 4 · starts 6 October</span>
  <h1 class="ns-hero__title" style="font-size:var(--size-h1)">Platform Developer I, in nine weeks</h1>
  <p class="ns-hero__lede">A paced cohort through the whole certification path — with a finish date you pick before you start.</p>
  <div class="ns-hero__actions">
    <a class="ns-btn ns-btn--primary ns-btn--lg" href="#">Reserve a seat</a>
    <a class="ns-btn" href="#">See the syllabus</a>
  </div>
  <span class="ns-hero__proof">42 hours · 8 modules · 30 seats</span>
</div></div>` },
      { name: "Split", flush: true, note: "Body beside a media slot, for the homepage — the one page where a real artifact is the proof the words claim. The words set the height and the picture fits; below lg the media drops under the headline and shrinks.", html: `<div class="ns-band ns-hero ns-hero--split ns-band--dark ns-band--grid" style="padding-block:var(--space-10)"><div class="ns-band__inner">
  <div>
    <span class="ns-kicker">Learn Salesforce, properly</span>
    <h1 class="ns-hero__title" style="font-size:var(--size-h1)">From first org to defensible Apex</h1>
    <p class="ns-hero__lede">One roadmap through courses, labs and working code.</p>
    <div class="ns-hero__actions">
      <a class="ns-btn ns-btn--white" href="#">Start learning</a>
      <a class="ns-btn ns-btn--ghost" href="#">Browse courses</a>
    </div>
    <span class="ns-hero__proof">12 courses · 214 lessons</span>
  </div>
  <div class="ns-hero__media" aria-hidden="true">
    <div class="ns-tthumb ns-tthumb--glyph" style="font-size:var(--size-display)"><i class="ph ph-code"></i></div>
  </div>
</div></div>` },
      { name: "Full page", note: "All seven bands composed in canonical order — the framework-agnostic template rendered with the real stylesheet.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-sections.html" target="_blank" rel="noopener">Open the full-page demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },
  {
    id: "feature-grid", title: "Feature grid", family: "Sections",
    summary: "3-up hairline cards: an icon, the mono index, a name, two lines of why. The standard “what you get” band — hover is the top accent line, same as every card.",
    use: ["3–6 reasons/capabilities on a landing page", "Bespoke .ns-icon glyphs or Phosphor — same size, same color rules"],
    not: ["Feature lists longer than 6 — that is documentation, use a docs page", "Cards that link somewhere — use CourseCard/ResourceCard grammar instead"],
    variants: [
      { name: "Three up", html: `<div class="ns-features">
  <article class="ns-feature">
    <div class="ns-feature__top"><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-roadmap"/></svg><span class="ns-feature__num">01</span></div>
    <h3 class="ns-feature__name">One roadmap</h3>
    <p class="ns-feature__text">Admin to developer in an explicit order.</p>
  </article>
  <article class="ns-feature">
    <div class="ns-feature__top"><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-lesson-lab"/></svg><span class="ns-feature__num">02</span></div>
    <h3 class="ns-feature__name">Hands-on labs</h3>
    <p class="ns-feature__text">Every section ends in your own org.</p>
  </article>
  <article class="ns-feature">
    <div class="ns-feature__top"><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-certificate"/></svg><span class="ns-feature__num">03</span></div>
    <h3 class="ns-feature__name">Cert-aligned</h3>
    <p class="ns-feature__text">Studying here counts twice.</p>
  </article>
</div>` },
    ],
  },
  {
    id: "stat-band", title: "Stat band", family: "Sections",
    summary: "A hairline-celled row of concrete numbers — mono, tabular. Use it only when every number is real and current; a decorative stat is a lie in monospace.",
    use: ["Course/lesson/learner counts on the home page", "Cohort or outcomes numbers that are actually measured"],
    not: ["“99% satisfaction”-style decoration", "More than 5 cells"],
    variants: [
      { name: "Four cells", html: `<dl class="ns-statband">
  <div class="ns-statband__cell"><dd class="ns-statband__value">12</dd><dt class="ns-statband__label">Courses</dt></div>
  <div class="ns-statband__cell"><dd class="ns-statband__value">214</dd><dt class="ns-statband__label">Lessons</dt></div>
  <div class="ns-statband__cell"><dd class="ns-statband__value">1,482</dd><dt class="ns-statband__label">Learners</dt></div>
  <div class="ns-statband__cell"><dd class="ns-statband__value">74%</dd><dt class="ns-statband__label">Completion</dt></div>
</dl>` },
    ],
  },
  {
    id: "quote", title: "Testimonial", family: "Sections",
    summary: "One voice, set large, centered; the attribution is a mono record line. Deliberately singular — never a three-up wall of star ratings.",
    use: ["One earned quote per page, in a sunken band"],
    not: ["Carousels of quotes", "Star ratings — this system has no rating visual"],
    variants: [
      { name: "Quote", html: `<figure class="ns-quote">
  <blockquote>I passed Platform Developer I after the Apex course — but the real win is that my triggers stopped scaring me.</blockquote>
  <figcaption>Priya S. · Salesforce Developer · batch 2025</figcaption>
</figure>` },
    ],
  },
  {
    id: "cta-band", title: "CTA band", family: "Sections",
    summary: "The closer: navy band, one heading, one primary action, one mono fine-print line. Exactly one per page, at the end — it is the page's single obvious next step.",
    use: ["The last band of every marketing page"],
    not: ["Mid-page “buy now” interruptions", "Two CTAs — if there are two actions, one belongs in the hero"],
    variants: [
      { name: "Closer", html: `<div class="ns-band ns-band--dark ns-band--grid ns-band--tight"><div class="ns-band__inner"><div class="ns-cta">
  <h2 class="ns-band__title">Create your free org. Start lesson one.</h2>
  <div class="ns-cta__actions"><a class="ns-btn ns-btn--white ns-btn--lg" href="#">Start the roadmap</a></div>
  <span class="ns-cta__fine">No card. No install. A browser is enough.</span>
</div></div></div>` },
    ],
  },
  {
    id: "faq", title: "FAQ", family: "Sections",
    summary: "Hairline question rows on native <details> — find-in-page still reaches collapsed answers. The marker is a mono +/− drawn by CSS, flipping to brand when open.",
    use: ["3–8 real questions people actually ask, near the end of a page"],
    not: ["Documentation disguised as questions — that belongs in the docs hub", "Accordion navigation — use the Accordion component in app surfaces"],
    a11y: ["Native disclosure semantics for free; summary is a real button to AT", "Answers are in the DOM when closed — searchable, indexable"],
    variants: [
      { name: "Three items", html: `<div class="ns-faq">
  <details class="ns-faq__item">
    <summary>Do I need a Salesforce license?</summary>
    <div class="ns-faq__body"><p>No — every lab runs in a free Developer Edition org.</p></div>
  </details>
  <details class="ns-faq__item" open>
    <summary>Where should I start?</summary>
    <div class="ns-faq__body"><p>The roadmap. It tells you which course is next at every step.</p></div>
  </details>
  <details class="ns-faq__item">
    <summary>Is this aligned with the certifications?</summary>
    <div class="ns-faq__body"><p>Each course maps to the relevant certification outline.</p></div>
  </details>
</div>` },
    ],
  },
  {
    id: "logo-row", title: "Logo row", family: "Components",
    summary: "The quiet trust band: partner or “as used by” marks, label-gray at rest, ink on hover. Mono text placeholders until real marks exist.",
    use: ["Employers/partners under the hero, in a tight sunken band"],
    not: ["Badges, award seals, app-store buttons"],
    variants: [
      { name: "Text marks", html: `<div class="ns-logorow">
  <span class="ns-logorow__mark">Acme Cloud</span>
  <span class="ns-logorow__mark">Northwind</span>
  <span class="ns-logorow__mark">Globex</span>
  <span class="ns-logorow__mark">Initech</span>
</div>` },
    ],
  },

  /* ========================================================== Admin ==== */
  /* ========================================================= Blog ==== */
  {
    id: "blog-card", title: "Post card", family: "Blog",
    summary: "The post, as a card. Composes <code>.ns-card</code> and adds the blog's own parts: a cover with the category riding it, a balanced title, a two-line clamped excerpt, and the meta line every post carries. Five shapes over one anatomy — a post in the index, in a related shelf, in a sidebar and as the one featured piece is the same object at four sizes, and four bespoke cards is how the meta rows drift apart.",
    use: ["The blog index grid", "A related-posts shelf (compose into .ns-strip)", "--minimal in a sidebar or a dense archive list", "--wide for the ONE featured post at the top of an index"],
    not: ["A course — that is Course card, which carries price and level", "An index of twenty --wide cards. Featured means one"],
    a11y: [
      "The title link is stretched over the whole card, so there is exactly one link and the whole surface is its target",
      "The cover is decorative (alt=\"\") — the title beside it is the content, and describing the same thing twice is noise",
      "The excerpt is clamped with -webkit-line-clamp, which hides overflow visually but keeps the full text in the accessible name of nothing — it is not the link's name, the title is",
      "--overlay carries a scrim that is not optional: a title over an arbitrary photograph has no contrast guarantee",
    ],
    variants: [
      { name: "Default", html: `<article class="ns-card ns-bcard" style="max-inline-size:19rem">
  <span class="ns-bcard__cover">
    <span class="ns-card__media ns-ph" aria-hidden="true"></span>
    <span class="ns-tag ns-bcard__cat">Apex</span>
  </span>
  <div class="ns-card__body">
    <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Why your trigger fails at 201 records</h3></a>
    <p class="ns-bcard__excerpt">Governor limits are per transaction, not per record — and the fix is a pattern, not a setting.</p>
    <div class="ns-postmeta">
      <span><img class="ns-postmeta__avatar" src="../assets/logo/favicon.svg" alt=""><span class="ns-postmeta__author">Swarnil Singhai</span></span>
      <span><time datetime="2026-08-04">4 Aug 2026</time></span>
      <span>6 min read</span>
    </div>
  </div>
</article>` },
      { name: "Featured, row and minimal", note: "<code>--wide</code> is the one featured piece: two columns, a display-scale title, three lines of excerpt. <code>--row</code> is the archive and search-result shape. <code>--minimal</code> drops the cover and the frame entirely — for a sidebar, where a column of small cover images is texture rather than information.", html: `<div style="display:grid;gap:var(--space-6);inline-size:100%">
  <article class="ns-card ns-bcard ns-bcard--wide">
    <span class="ns-bcard__cover">
      <span class="ns-ph" aria-hidden="true"></span>
      <span class="ns-tag ns-bcard__cat">Architecture</span>
    </span>
    <div class="ns-card__body">
      <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">The data model is the product</h3></a>
      <p class="ns-bcard__excerpt">Every automation problem I have been called in to fix was a schema problem wearing a costume. Here is how to tell the difference before you write a line of Apex.</p>
      <div class="ns-postmeta">
        <span><img class="ns-postmeta__avatar" src="../assets/logo/favicon.svg" alt=""><span class="ns-postmeta__author">Swarnil Singhai</span></span>
        <span><time datetime="2026-07-28">28 Jul 2026</time></span>
        <span>12 min read</span>
      </div>
    </div>
  </article>

  <article class="ns-card ns-bcard ns-bcard--row" style="max-inline-size:34rem">
    <span class="ns-bcard__cover"><span class="ns-ph" aria-hidden="true"></span></span>
    <div class="ns-card__body">
      <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">SOQL: what the query planner actually does</h3></a>
      <p class="ns-bcard__excerpt">Selectivity, indexes, and why your report times out at 50,000 rows.</p>
      <div class="ns-postmeta"><span><time datetime="2026-07-14">14 Jul 2026</time></span><span>9 min read</span></div>
    </div>
  </article>

  <div style="max-inline-size:20rem">
    <article class="ns-card ns-bcard ns-bcard--minimal">
      <div class="ns-card__body">
        <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Flow or Apex? A decision table</h3></a>
        <div class="ns-postmeta"><span><time datetime="2026-07-02">2 Jul 2026</time></span><span>5 min</span></div>
      </div>
    </article>
    <article class="ns-card ns-bcard ns-bcard--minimal">
      <div class="ns-card__body">
        <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Test data factories that survive a refactor</h3></a>
        <div class="ns-postmeta"><span><time datetime="2026-06-19">19 Jun 2026</time></span><span>7 min</span></div>
      </div>
    </article>
  </div>
</div>` },
      { name: "Overlay, and no cover art", note: "<code>--overlay</code> sets the title on the image, scrimmed to the brand navy. The empty-cover state is the honest alternative to a grey rectangle pretending an image failed to load — most posts have no art, and saying so with the system's own glyph is better than faking one.", html: `<div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:var(--space-4);max-inline-size:38rem">
  <article class="ns-card ns-bcard ns-bcard--overlay">
    <span class="ns-bcard__cover"><span class="ns-ph" aria-hidden="true"></span></span>
    <div class="ns-card__body">
      <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Five orgs, one deployment pipeline</h3></a>
      <div class="ns-postmeta"><span><time datetime="2026-06-30">30 Jun 2026</time></span><span>11 min read</span></div>
    </div>
  </article>
  <article class="ns-card ns-bcard">
    <span class="ns-bcard__cover ns-bcard__cover--empty" aria-hidden="true"><i class="ph ph-article"></i></span>
    <div class="ns-card__body">
      <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Notes on naming things</h3></a>
      <p class="ns-bcard__excerpt">A short argument for boring, predictable API names.</p>
      <div class="ns-postmeta"><span><time datetime="2026-06-11">11 Jun 2026</time></span><span>3 min read</span></div>
    </div>
  </article>
</div>` },
    ],
  },

  {
    id: "post-header", title: "Post header", family: "Blog",
    summary: "The top of a post, in five versions. Same parts in the same order every time — category, title, standfirst, meta, cover — so the page does not re-teach itself when the art direction changes. The <strong>standfirst</strong> is one sentence saying what the piece argues; it is not the first paragraph repeated, which is the most common way this element is wasted.",
    use: ["The top of every post", "--minimal for a post with no art, which is most of them", "--console where there are no assets at all — it needs none"],
    not: ["A page hero — that is Hero, in Sections", "Repeating the standfirst as the opening paragraph"],
    a11y: [
      "The title is the page's h1; the category above it is a link, not a heading",
      "The scrim on --cover is not optional: a title over an arbitrary photograph has no contrast guarantee",
      "The date is a real <time datetime> so it is machine-readable and localisable",
      "The cover's credit is a caption, not alt text — it describes the source, not the picture",
    ],
    variants: [
      { name: "Default", flush: true, note: "Centred, cover below, capped at <code>--container-narrow</code>. The workhorse.", html: `<header class="ns-posthead ns-posthead--center">
  <div class="ns-posthead__inner">
    <a class="ns-tag ns-posthead__cat" href="#">Apex</a>
    <h1 class="ns-posthead__title">Why your trigger fails at 201 records</h1>
    <p class="ns-posthead__standfirst">Governor limits are per transaction, not per record. Once that lands, bulkification stops being a rule you follow and becomes the only design that makes sense.</p>
    <div class="ns-postmeta">
      <span><img class="ns-postmeta__avatar" src="../assets/logo/favicon.svg" alt=""><a class="ns-postmeta__author" href="#">Swarnil Singhai</a></span>
      <span><time datetime="2026-08-04">4 August 2026</time></span>
      <span>6 min read</span>
      <span>Updated 12 Aug</span>
    </div>
    <span class="ns-posthead__cover ns-ph ns-ph--sm" aria-hidden="true"></span>
    <span class="ns-posthead__credit">Illustration · Namaste Salesforce</span>
  </div>
</header>` },
      { name: "Cover", flush: true, note: "Full-bleed image behind the text, scrimmed bottom-up to the brand navy so the meta line sits on the darkest part.", html: `<header class="ns-posthead ns-posthead--cover">
  <div class="ns-posthead__bg"><span class="ns-ph" aria-hidden="true"></span></div>
  <div class="ns-posthead__inner">
    <a class="ns-tag ns-posthead__cat" href="#">Architecture</a>
    <h1 class="ns-posthead__title">The data model is the product</h1>
    <p class="ns-posthead__standfirst">Every automation problem I have been called in to fix was a schema problem wearing a costume.</p>
    <div class="ns-postmeta">
      <span><img class="ns-postmeta__avatar" src="../assets/logo/favicon.svg" alt=""><span class="ns-postmeta__author">Swarnil Singhai</span></span>
      <span><time datetime="2026-07-28">28 July 2026</time></span>
      <span>12 min read</span>
    </div>
  </div>
</header>` },
      { name: "Wide", flush: true, note: "Left-aligned at the page container with the cover beside the text — for a post whose image is an argument rather than a decoration.", html: `<header class="ns-posthead ns-posthead--wide">
  <div class="ns-posthead__inner">
    <div class="ns-posthead__grid">
      <div>
        <a class="ns-tag ns-posthead__cat" href="#">SOQL</a>
        <h1 class="ns-posthead__title">What the query planner actually does</h1>
        <p class="ns-posthead__standfirst">Selectivity, indexes, and why your report times out at 50,000 rows.</p>
        <div class="ns-postmeta">
          <span><img class="ns-postmeta__avatar" src="../assets/logo/favicon.svg" alt=""><span class="ns-postmeta__author">Priya Raman</span></span>
          <span><time datetime="2026-07-14">14 July 2026</time></span>
          <span>9 min read</span>
        </div>
      </div>
      <span class="ns-posthead__cover ns-ph ns-ph--sm" aria-hidden="true"></span>
    </div>
  </div>
</header>` },
      { name: "Minimal and console", flush: true, note: "Type only, hairline under — the version to reach for when someone asks what image should go here and there is no honest answer. <code>--console</code> is the same anatomy on the brand navy with the hairline grid, and needs no assets at all.", html: `<div>
  <header class="ns-posthead ns-posthead--minimal">
    <div class="ns-posthead__inner">
      <a class="ns-tag ns-posthead__cat" href="#">Notes</a>
      <h1 class="ns-posthead__title">Notes on naming things</h1>
      <div class="ns-postmeta">
        <span><span class="ns-postmeta__author">Swarnil Singhai</span></span>
        <span><time datetime="2026-06-11">11 June 2026</time></span>
        <span>3 min read</span>
      </div>
    </div>
  </header>
  <header class="ns-posthead ns-posthead--console ns-pattern ns-pattern--blueprint">
    <div class="ns-posthead__inner">
      <a class="ns-tag ns-posthead__cat" href="#">Release</a>
      <h1 class="ns-posthead__title">What shipped in Winter '27</h1>
      <p class="ns-posthead__standfirst">The four changes that affect code you have already written.</p>
      <div class="ns-postmeta">
        <span><span class="ns-postmeta__author">Namaste Salesforce</span></span>
        <span><time datetime="2026-08-12">12 August 2026</time></span>
      </div>
    </div>
  </header>
</div>` },
    ],
  },

  {
    id: "post-layout", title: "Post layout & TOC", family: "Blog",
    summary: "TOC rail | article | share rail. Three columns is a claim that both rails earn their width, so they are narrow, sticky, and the first things dropped — the share rail below 80rem, the TOC folding into a disclosure below 64rem. The article column <strong>never widens</strong> to fill the space they leave: the measure is the point of the page. The TOC is a real nav of real anchor links that works with JS off; the scroll-spy only adds <code>aria-current</code>.",
    use: ["Any post longer than about four screens", "Documentation pages with the same shape"],
    not: ["A short post — a TOC with three entries is chrome", "Three levels of heading in the outline. Two is the limit; a page needing three needs splitting"],
    a11y: [
      "The TOC is a &lt;nav&gt; with an accessible name, containing ordinary anchor links — it works, and is announced, with JavaScript off",
      "The current section is marked with aria-current, the same attribute the navbar and the lesson row use",
      "Headings without ids get one derived from their text, because an anchor link to nothing is worse than no anchor link",
      "The share rail's buttons are icon-only and every one carries an aria-label",
      "Reading progress (.ns-lprogress--article) is a role=\"progressbar\" with a live aria-valuenow",
    ],
    variants: [
      { name: "The three-column page", flush: true, note: "Live — scroll the demo and watch the TOC mark the section you are in. The outline here is hand-authored; pass <code>data-toc-from=\"#post-body\"</code> instead and <code>assets/js/toc.js</code> builds it from the article's own h2/h3.", html: `<div class="ns-post" style="padding-block:var(--space-6)">
  <nav class="ns-post__rail ns-toc" aria-label="On this page">
    <p class="ns-toc__title">On this page</p>
    <a class="ns-toc__link" href="#s-limits" aria-current="true">The limit is the transaction</a>
    <a class="ns-toc__link ns-toc__link--sub" href="#s-count">Counting the wrong thing</a>
    <a class="ns-toc__link" href="#s-fix">The fix is a pattern</a>
    <a class="ns-toc__link" href="#s-test">Testing it honestly</a>
  </nav>

  <article class="ns-post__body ns-prose" id="post-body">
    <h2 id="s-limits">The limit is the transaction</h2>
    <p>Governor limits are counted per transaction, not per record. A trigger that runs one query per record does not use one query — it uses as many queries as the data load has rows, and the platform stops it at 101.</p>
    <div class="ns-callout">
      <i class="ph ph-info" aria-hidden="true"></i>
      <div><span class="ns-callout__label">Note</span>The 101 is not a typo. The hundredth query succeeds; the hundred-and-first is what raises the exception.</div>
    </div>
    <h3 id="s-count">Counting the wrong thing</h3>
    <p>The instinct is to count records. The platform counts statements, and the difference is the entire lesson.</p>
    <h2 id="s-fix">The fix is a pattern</h2>
    <p>Collect the ids first, query once, put the results in a map, then loop. It is three lines longer and it does not care whether the load is one record or two hundred.</p>
    <div class="ns-callout ns-callout--warn">
      <i class="ph ph-warning" aria-hidden="true"></i>
      <div><span class="ns-callout__label">Watch out</span>A map keyed on a field that is not unique silently drops records. Key on the id unless you can prove otherwise.</div>
    </div>
    <h2 id="s-test">Testing it honestly</h2>
    <p>A test that inserts one record proves nothing about the case that broke. Insert two hundred.</p>
    <div class="ns-callout ns-callout--tip">
      <i class="ph ph-lightbulb" aria-hidden="true"></i>
      <div><span class="ns-callout__label">Tip</span>Put the 200 in a constant your factory reads. When the limit changes, one edit fixes every test.</div>
    </div>
  </article>

  <aside class="ns-post__aside ns-share ns-share--rail">
    <span class="ns-share__label">Share</span>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Copy link"><i class="ph ph-link-simple" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share on LinkedIn"><i class="ph ph-linkedin-logo" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share on X"><i class="ph ph-x-logo" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Save for later"><i class="ph ph-bookmark-simple" aria-hidden="true"></i></button>
  </aside>
</div>` },
      { name: "Collapsed TOC", note: "Below 64rem the rail has nowhere to stick, so the outline folds into a native <code>&lt;details&gt;</code> above the text. Same links, same markup, no second implementation.", html: `<details class="ns-toc ns-toc--collapsible" style="max-inline-size:26rem;inline-size:100%">
  <summary>On this page <i class="ph ph-caret-down" aria-hidden="true"></i></summary>
  <a class="ns-toc__link" href="#s-limits">The limit is the transaction</a>
  <a class="ns-toc__link ns-toc__link--sub" href="#s-count">Counting the wrong thing</a>
  <a class="ns-toc__link" href="#s-fix">The fix is a pattern</a>
</details>` },
      { name: "Without a sidebar", flush: true, note: "<code>--wide</code>: no rails at all, the measure centred, nothing beside it. For an essay. A TOC on a piece with four headings is furniture pretending to be navigation, and a share rail beside 900 words is a request the reader has not earned yet. Note what does <em>not</em> happen — the article column is exactly the width it is in the three-column page.", html: `<div class="ns-post ns-post--wide" style="padding-block:var(--space-6)">
  <div class="ns-post__body ns-prose">
    <h2>The data model is the product</h2>
    <p>Everything downstream — the sharing rules, the reports, the integrations someone writes in two years — is a consequence of the objects you draw in the first week. It is the one decision on a Salesforce project that is genuinely expensive to reverse.</p>
    <p>Which is why the instinct to &ldquo;start with the UI and see what data we need&rdquo; is backwards, and why the first workshop should be a whiteboard rather than a mockup.</p>
  </div>
</div>` },
      { name: "With a sidebar", flush: true, note: "<code>--sidebar</code>: prose plus a real 18rem column on the end side, for a post carrying a newsletter box, a popular shelf or an ad. The TOC rail goes — a page cannot put navigation on both sides of the text and still read as text. Below 64rem the sidebar moves under the article rather than vanishing: a newsletter box and a related shelf are content.", html: `<div class="ns-post ns-post--sidebar" style="padding-block:var(--space-6)">
  <div class="ns-post__body ns-prose">
    <h2>Counting the wrong thing</h2>
    <p>The 101-query error almost never means you wrote 101 queries. It means you wrote one, inside a loop, and the loop ran 101 times.</p>
    <p>Tests hide it, because a test with one record spends one query. The same code meets a data load and spends two hundred.</p>
  </div>
  <aside class="ns-post__side">
    <div class="ns-card">
      <div class="ns-card__body">
        <span class="ns-kicker">Newsletter</span>
        <p style="font-size:var(--size-small);color:var(--color-muted);margin-block:var(--space-2)">One Salesforce lesson a week. No spam, unsubscribe whenever.</p>
        <form><input class="ns-input" type="email" placeholder="you@work.com" aria-label="Email"><button class="ns-btn ns-btn--primary ns-btn--block ns-btn--sm" type="submit" style="margin-block-start:var(--space-2)">Subscribe</button></form>
      </div>
    </div>
    <div>
      <span class="ns-kicker">Most read</span>
      <div class="ns-blog-list" style="margin-block-start:var(--space-3)">
        <article class="ns-card ns-bcard ns-bcard--minimal"><div class="ns-card__body"><a class="ns-card__link" href="#0"><h3 class="ns-bcard__title">Profiles vs permission sets</h3></a><span class="ns-postmeta"><span>6 min</span></span></div></article>
        <article class="ns-card ns-bcard ns-bcard--minimal"><div class="ns-card__body"><a class="ns-card__link" href="#0"><h3 class="ns-bcard__title">What the query planner actually does</h3></a><span class="ns-postmeta"><span>9 min</span></span></div></article>
      </div>
    </div>
  </aside>
</div>` },
      { name: "With ads", flush: true, note: "The sidebar layout carrying the two placements worth keeping: a half-page in the rail and one in-article unit after the second section. Both are <code>.ns-ad</code> from the Monetization family, reserved at their real size so nothing reflows when the slot fills. Every other placement lives on the Ad unit page — it is a catalogue, not a recommendation.", html: `<div class="ns-post ns-post--sidebar" style="padding-block:var(--space-6)">
  <div class="ns-post__body ns-prose">
    <h2>The fix is a pattern</h2>
    <p>Collect the ids first, query once outside the loop, then work from the map. It is the same three lines in every language that has ever had this problem.</p>
    <div class="ns-ad ns-ad--article" data-state="filled" role="complementary" aria-label="Advertisement">
      <span class="ns-ad__label">Advertisement</span>
      <div class="ns-ad__frame"><span class="ns-ad__dummy"><span class="ns-ad__dummy-name">In-article</span><span class="ns-ad__dummy-size">fluid</span></span></div>
    </div>
    <p>The only judgement left is where the map lives, and that is a readability question rather than a limits one.</p>
  </div>
  <aside class="ns-post__side">
    <div class="ns-ad ns-ad--halfpage" data-state="filled" role="complementary" aria-label="Advertisement">
      <span class="ns-ad__label">Advertisement</span>
      <div class="ns-ad__frame"><span class="ns-ad__dummy"><span class="ns-ad__dummy-name">Half page</span><span class="ns-ad__dummy-size">300&times;600</span></span></div>
    </div>
  </aside>
</div>` },
      { name: "Callouts", note: "The aside inside prose. A 3px leading edge and a tint — never a heavy full box, which stops the eye at the top of the paragraph instead of carrying it through. The WORD in the label is the signal and the colour only agrees with it: a warning that is only orange is not a warning to a monochromat.", html: `<div style="display:grid;gap:var(--space-3);max-inline-size:34rem;inline-size:100%">
  <div class="ns-callout"><i class="ph ph-info" aria-hidden="true"></i><div><span class="ns-callout__label">Note</span>Context the reader needs but did not ask for.</div></div>
  <div class="ns-callout ns-callout--tip"><i class="ph ph-lightbulb" aria-hidden="true"></i><div><span class="ns-callout__label">Tip</span>Something that makes the task easier, which they can safely skip.</div></div>
  <div class="ns-callout ns-callout--warn"><i class="ph ph-warning" aria-hidden="true"></i><div><span class="ns-callout__label">Watch out</span>A mistake that is easy to make and annoying to undo.</div></div>
  <div class="ns-callout ns-callout--danger"><i class="ph ph-warning-circle" aria-hidden="true"></i><div><span class="ns-callout__label">Don't</span>A mistake that loses data. Reserve this one — four danger callouts in a post means none of them is read.</div></div>
</div>` },
    ],
  },

  {
    id: "post-footer", title: "Post footer", family: "Blog",
    summary: "What closes a post: the author bio, the series it belongs to, prev/next by title, and the related shelf. Prev/next carries the real title for the same reason the lesson nav does — an arrow pair with no titles makes the reader click to find out where they are going.",
    use: ["The end of every post", "Series box near the TOP as well, when the post is part of one — a reader landing on part 3 from search needs to know parts 1 and 2 exist"],
    not: ["A wall of twelve related posts. Four is a shelf; twelve is an index"],
    a11y: [
      "Prev and next are ordinary links whose accessible name is the post's title",
      "A one-sided nav keeps both columns with the empty half visibility:hidden, so \"next\" does not slide under \"previous\" at the end of an archive",
      "The series list marks the current entry with aria-current and completed ones with data-state, not colour alone",
    ],
    variants: [
      { name: "Author box", html: `<div class="ns-authorbox" style="max-inline-size:38rem">
  <img class="ns-authorbox__avatar" src="../assets/logo/favicon.svg" alt="">
  <div>
    <p class="ns-authorbox__name"><a href="#">Swarnil Singhai</a></p>
    <p class="ns-authorbox__role">Salesforce Architect · 11× certified</p>
    <p class="ns-authorbox__bio">Eleven years building on the platform, most of them cleaning up other people's triggers. Writes about the model first and the syntax second.</p>
    <div class="ns-authorbox__links">
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="#">All posts</a>
      <a class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" href="#" aria-label="LinkedIn"><i class="ph ph-linkedin-logo" aria-hidden="true"></i></a>
      <a class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" href="#" aria-label="X"><i class="ph ph-x-logo" aria-hidden="true"></i></a>
    </div>
  </div>
</div>` },
      { name: "Series", note: "\"Part 3 of 6\". A reader who lands on part 3 from a search result has no idea parts 1 and 2 exist unless the post says so — so it says so, and links both directions.", html: `<div class="ns-series" style="max-inline-size:26rem">
  <span class="ns-series__label">Part 3 of 6 · Bulk-safe Apex</span>
  <div class="ns-series__list">
    <a class="ns-series__item" href="#" data-state="done">Triggers, and when not to write one</a>
    <a class="ns-series__item" href="#" data-state="done">Collections, maps and sets</a>
    <span class="ns-series__item" aria-current="true">Why your trigger fails at 201 records</span>
    <a class="ns-series__item" href="#">Governor limits in practice</a>
    <a class="ns-series__item" href="#">Testing at scale</a>
    <a class="ns-series__item" href="#">Deploying without fear</a>
  </div>
</div>` },
      { name: "Prev / next", html: `<nav class="ns-postnav" aria-label="More posts" style="inline-size:100%;max-inline-size:38rem">
  <a class="ns-postnav__link" href="#">
    <span class="ns-postnav__dir"><i class="ph ph-caret-left" aria-hidden="true"></i> Previous</span>
    <span class="ns-postnav__title">Collections, maps and sets</span>
  </a>
  <a class="ns-postnav__link ns-postnav__link--next" href="#">
    <span class="ns-postnav__dir">Next <i class="ph ph-caret-right" aria-hidden="true"></i></span>
    <span class="ns-postnav__title">Governor limits in practice</span>
  </a>
</nav>` },
      { name: "Related shelf", note: "Composes <code>.ns-strip</code> — the same scroll-snapped shelf the course pages use, because it is the same object. Four cards, not twelve.", html: `<div class="ns-strip" style="inline-size:100%">
  <article class="ns-card ns-bcard ns-bcard--minimal"><div class="ns-card__body"><a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Flow or Apex? A decision table</h3></a><div class="ns-postmeta"><span>5 min</span></div></div></article>
  <article class="ns-card ns-bcard ns-bcard--minimal"><div class="ns-card__body"><a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Test data factories that survive a refactor</h3></a><div class="ns-postmeta"><span>7 min</span></div></div></article>
  <article class="ns-card ns-bcard ns-bcard--minimal"><div class="ns-card__body"><a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Notes on naming things</h3></a><div class="ns-postmeta"><span>3 min</span></div></div></article>
  <article class="ns-card ns-bcard ns-bcard--minimal"><div class="ns-card__body"><a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Five orgs, one pipeline</h3></a><div class="ns-postmeta"><span>11 min</span></div></div></article>
</div>` },
    ],
  },

  {
    id: "blog-listing", title: "Blog index", family: "Blog",
    summary: "The index: one featured post, a grid of the rest, and a rail carrying categories, an archive and the newsletter form. There is no masonry variant on purpose — a masonry index puts the second post below the fold to make the first one taller, which is a layout serving itself rather than the reader.",
    use: ["The blog home", "A category or tag archive, with the featured card dropped", "An author's post list"],
    not: ["Infinite scroll without a real Pagination fallback — a footer nobody can reach is a footer that does not exist"],
    a11y: ["Each card has exactly one stretched link", "The archive rows put the date first in the DOM, so the list is scannable by date with a screen reader", "The category rail is a nav with an accessible name"],
    variants: [
      { name: "Index with rail", flush: true, html: `<div class="ns-blog-listing" style="padding:var(--space-6)">
  <div>
    <article class="ns-card ns-bcard ns-bcard--wide" style="margin-block-end:var(--space-8)">
      <span class="ns-bcard__cover">
        <span class="ns-ph" aria-hidden="true"></span>
        <span class="ns-tag ns-bcard__cat">Architecture</span>
      </span>
      <div class="ns-card__body">
        <a class="ns-card__link" href="#"><h2 class="ns-bcard__title">The data model is the product</h2></a>
        <p class="ns-bcard__excerpt">Every automation problem I have been called in to fix was a schema problem wearing a costume. Here is how to tell the difference before you write a line of Apex.</p>
        <div class="ns-postmeta">
          <span><img class="ns-postmeta__avatar" src="../assets/logo/favicon.svg" alt=""><span class="ns-postmeta__author">Swarnil Singhai</span></span>
          <span><time datetime="2026-07-28">28 Jul 2026</time></span>
          <span>12 min read</span>
        </div>
      </div>
    </article>

    <div class="ns-blog-grid">
      <article class="ns-card ns-bcard">
        <span class="ns-bcard__cover"><span class="ns-card__media ns-ph" aria-hidden="true"></span><span class="ns-tag ns-bcard__cat">Apex</span></span>
        <div class="ns-card__body">
          <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Why your trigger fails at 201 records</h3></a>
          <p class="ns-bcard__excerpt">Governor limits are per transaction, not per record.</p>
          <div class="ns-postmeta"><span><time datetime="2026-08-04">4 Aug</time></span><span>6 min</span></div>
        </div>
      </article>
      <article class="ns-card ns-bcard">
        <span class="ns-bcard__cover ns-bcard__cover--empty" aria-hidden="true"><i class="ph ph-article"></i></span>
        <div class="ns-card__body">
          <a class="ns-card__link" href="#"><h3 class="ns-bcard__title">Notes on naming things</h3></a>
          <p class="ns-bcard__excerpt">A short argument for boring, predictable API names.</p>
          <div class="ns-postmeta"><span><time datetime="2026-06-11">11 Jun</time></span><span>3 min</span></div>
        </div>
      </article>
    </div>
  </div>

  <aside class="ns-blog-listing__rail">
    <nav aria-label="Categories">
      <p class="ns-toc__title" style="padding-inline:0">Categories</p>
      <div style="display:flex;flex-wrap:wrap;gap:var(--space-2)">
        <a class="ns-tag ns-tag--pill" href="#">Apex <span class="ns-tag__count">24</span></a>
        <a class="ns-tag ns-tag--pill" href="#">Flows <span class="ns-tag__count">18</span></a>
        <a class="ns-tag ns-tag--pill" href="#">SOQL <span class="ns-tag__count">9</span></a>
        <a class="ns-tag ns-tag--pill" href="#">Architecture <span class="ns-tag__count">7</span></a>
      </div>
    </nav>
    <div>
      <p class="ns-toc__title" style="padding-inline:0">Recent</p>
      <div class="ns-blog-archive">
        <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">04 Aug</span><span class="ns-blog-archive__title">Why your trigger fails at 201</span><span class="ns-blog-archive__read">6m</span></a>
        <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">28 Jul</span><span class="ns-blog-archive__title">The data model is the product</span><span class="ns-blog-archive__read">12m</span></a>
        <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">14 Jul</span><span class="ns-blog-archive__title">What the query planner does</span><span class="ns-blog-archive__read">9m</span></a>
      </div>
    </div>
  </aside>
</div>` },
      { name: "Archive", note: "The dense, coverless list where the DATE is the index — for a year page or a tag with two hundred entries. Below 48rem the date moves to its own line rather than squeezing the title.", html: `<div class="ns-blog-archive" style="max-inline-size:34rem;inline-size:100%">
  <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">04 Aug 2026</span><span class="ns-blog-archive__title">Why your trigger fails at 201 records</span><span class="ns-blog-archive__read">6 min</span></a>
  <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">28 Jul 2026</span><span class="ns-blog-archive__title">The data model is the product</span><span class="ns-blog-archive__read">12 min</span></a>
  <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">14 Jul 2026</span><span class="ns-blog-archive__title">What the query planner actually does</span><span class="ns-blog-archive__read">9 min</span></a>
  <a class="ns-blog-archive__row" href="#"><span class="ns-blog-archive__date">02 Jul 2026</span><span class="ns-blog-archive__title">Flow or Apex? A decision table</span><span class="ns-blog-archive__read">5 min</span></a>
</div>` },
    ],
  },
  {
    id: "post-actions", title: "Share & Ask AI", family: "Blog",
    summary: "The two things a reader does with a post that are not reading it: send it to someone, or ask a model about it. Both are dropdowns composed from <code>.ns-usermenu</code> and <code>.ns-menu__item</code> — there is no bespoke share widget and no bespoke AI panel, because a menu of links is a menu of links.",
    use: ["A post header or footer bar", "Beside a section heading, seeded with that section rather than the whole article", "--down anywhere that is not the foot of the lesson rail"],
    not: ["A row of eight network icons. Every one you add makes the whole row less likely to be used — three destinations and a copy-link is the whole set", "Share counts. A post showing &ldquo;2 shares&rdquo; is arguing against itself", "Anything that talks to a model from the page. Each row is a plain link that opens the reader's own assistant with the question pre-written; nothing here has an API key"],
    a11y: [
      "The trigger carries aria-expanded and aria-controls; the panel is a real menu of real links",
      "Every row that leaves the site says so with the out-arrow, before it is clicked rather than after",
      "The question field has a real label — visually hidden, because the button beside it already says Ask AI, but present, because a bare textarea is unusable to a screen reader",
      "Copy-link reports success in text, not only by swapping an icon: an icon flip is invisible to a screen reader and to anyone not looking at the button they just pressed",
    ],
    variants: [
      { name: "The actions bar", note: "Share, Ask AI, and the reading time. Sits under the post header or above the footer — one row, three affordances, and it composes the same <code>.ns-usermenu</code> the navbar account menu uses.", script: `document.querySelectorAll('[data-ns-copylink]').forEach(function (btn) {
  btn.addEventListener('click', function () {
    var out = btn.querySelector('[data-label]');
    var was = out.textContent;
    if (navigator.clipboard) navigator.clipboard.writeText(location.href);
    out.textContent = 'Link copied';
    setTimeout(function () { out.textContent = was; }, 1600);
  });
});`, html: `<div style="display:flex;flex-wrap:wrap;gap:var(--space-3);align-items:center;max-inline-size:42rem;inline-size:100%">
  <div class="ns-usermenu">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm" data-ns-menu aria-expanded="false" aria-controls="share-menu">
      <i class="ph ph-share-network" aria-hidden="true"></i> Share
    </button>
    <div class="ns-usermenu__panel ns-askai--down" id="share-menu" style="inline-size:14rem">
      <span class="ns-menu__label">Send this post to</span>
      <a class="ns-menu__item" href="#0" target="_blank" rel="noopener"><i class="ph ph-linkedin-logo" aria-hidden="true"></i> LinkedIn <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <a class="ns-menu__item" href="#0" target="_blank" rel="noopener"><i class="ph ph-x-logo" aria-hidden="true"></i> X <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <a class="ns-menu__item" href="#0"><i class="ph ph-envelope-simple" aria-hidden="true"></i> Email <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <hr class="ns-menu__sep">
      <button type="button" class="ns-menu__item" data-ns-copylink><i class="ph ph-link-simple" aria-hidden="true"></i> <span data-label>Copy link</span></button>
    </div>
  </div>

  <div class="ns-usermenu" data-ns-ask-prompt="%s">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm" data-ns-menu aria-expanded="false" aria-controls="post-ask">
      <i class="ph ph-sparkle" aria-hidden="true"></i> Ask AI
    </button>
    <div class="ns-usermenu__panel ns-askai ns-askai--down" id="post-ask">
      <label class="ns-visually-hidden" for="post-ask-q">Your question about this post</label>
      <textarea class="ns-textarea ns-askai__field" id="post-ask-q" rows="3" data-ns-ask-input>Explain "Why your trigger fails at 201 records" to me like I have never written Apex.</textarea>
      <span class="ns-menu__label">Open this post in</span>
      <a class="ns-menu__item" href="https://claude.ai/new" target="_blank" rel="noopener" data-ns-ask="https://claude.ai/new?q="><i class="ph ph-sparkle" aria-hidden="true"></i> Claude <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <a class="ns-menu__item" href="https://chatgpt.com/" target="_blank" rel="noopener" data-ns-ask="https://chatgpt.com/?q="><i class="ph ph-chat-circle-text" aria-hidden="true"></i> ChatGPT <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <a class="ns-menu__item" href="https://www.perplexity.ai/" target="_blank" rel="noopener" data-ns-ask="https://www.perplexity.ai/search?q="><i class="ph ph-magnifying-glass" aria-hidden="true"></i> Perplexity <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <hr class="ns-menu__sep">
      <button type="button" class="ns-menu__item" data-ns-ask-copy><i class="ph ph-file-text" aria-hidden="true"></i> Copy the prompt</button>
    </div>
  </div>

  <span class="ns-postmeta" style="margin-inline-start:auto"><span>6 min read</span></span>
</div>` },
      { name: "Inline, beside a section", note: "The same menu seeded with ONE section instead of the whole post — the question a reader actually has is about the paragraph in front of them, not about the article. Sits in the prose flow as a quiet row after the passage, so it never interrupts the reading line.", html: `<div class="ns-prose" style="max-inline-size:38rem;inline-size:100%">
  <h3>Counting the wrong thing</h3>
  <p>The 101-query error almost never means you wrote 101 queries. It means you wrote one, inside a loop, and the loop ran 101 times.</p>
  <div class="ns-usermenu" data-ns-ask-prompt="%s" style="margin-block-start:var(--space-3)">
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs" data-ns-menu aria-expanded="false" aria-controls="sec-ask">
      <i class="ph ph-sparkle" aria-hidden="true"></i> Explain this section
    </button>
    <div class="ns-usermenu__panel ns-askai ns-askai--down" id="sec-ask">
      <label class="ns-visually-hidden" for="sec-ask-q">Your question about this section</label>
      <textarea class="ns-textarea ns-askai__field" id="sec-ask-q" rows="3" data-ns-ask-input>Explain "Counting the wrong thing" — why does one query inside a loop become 101?</textarea>
      <span class="ns-menu__label">Open this section in</span>
      <a class="ns-menu__item" href="https://claude.ai/new" target="_blank" rel="noopener" data-ns-ask="https://claude.ai/new?q="><i class="ph ph-sparkle" aria-hidden="true"></i> Claude <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <a class="ns-menu__item" href="https://chatgpt.com/" target="_blank" rel="noopener" data-ns-ask="https://chatgpt.com/?q="><i class="ph ph-chat-circle-text" aria-hidden="true"></i> ChatGPT <i class="ph ph-arrow-up-right ns-askai__cue" aria-hidden="true"></i></a>
      <hr class="ns-menu__sep">
      <button type="button" class="ns-menu__item" data-ns-ask-copy><i class="ph ph-file-text" aria-hidden="true"></i> Copy the prompt</button>
    </div>
  </div>
</div>` },
      { name: "The share rail", note: "The vertical column beside a long post, for the reader who decides to share at paragraph forty rather than at the end. Same set, no menu — at this size the icons are the menu. It is the first thing dropped below 80rem.", html: `<div class="ns-share ns-share--rail" style="inline-size:3.5rem">
  <span class="ns-share__label">Share</span>
  <a class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" href="#0" aria-label="Share on LinkedIn"><i class="ph ph-linkedin-logo" aria-hidden="true"></i></a>
  <a class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" href="#0" aria-label="Share on X"><i class="ph ph-x-logo" aria-hidden="true"></i></a>
  <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Copy link"><i class="ph ph-link-simple" aria-hidden="true"></i></button>
  <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Save for later"><i class="ph ph-bookmark-simple" aria-hidden="true"></i></button>
</div>` },
    ],
  },
  {
    id: "comments", title: "Comments", family: "Blog",
    summary: "The thread under a post. The hard part is not the list — it is restraint: comments are user-generated, arrive at any length, and will out-scroll the article if the page lets them. So there are no cards, no shadows and no per-comment borders, just a hairline between siblings and one level of indentation for a reply.",
    use: ["Discussion under a post or a lesson", "--op to mark the author answering, so a reader can find the authoritative reply"],
    not: ["Threading deeper than one level. A reply to a reply is a conversation two people are having while everyone watches — it belongs in the reply, addressed by name, and on a 360px screen a third level has nowhere to go but a 40-character column", "Vote scores, awards, share-this-comment. Engagement machinery, not reading", "Making the section look heavier than the article. That says the comments matter more, and they do not"],
    a11y: ["Each comment is an <code>&lt;article&gt;</code> with a real <code>&lt;time datetime&gt;</code>, so &ldquo;2 days ago&rdquo; is also a machine-readable date", "Every marker is a WORD — <em>author</em>, <em>moderator</em>, <em>pinned</em> — never a coloured ring or a bare rule, which is a private joke between the design and the people who already know what it means. <code>--pinned</code>'s brand edge agrees with the badge; it does not replace it", "Replies are a nested list inside the comment they answer, so the structure survives with CSS off", "A removed comment leaves a tombstone rather than vanishing: a thread that silently loses its third reply reads as broken, and the replies that answered it are still there", "The like button carries <code>aria-pressed</code> and the count is in the accessible name, so it is not announced as a bare number"],
    variants: [
      { name: "The thread", note: "One level of replies, enforced in CSS: a third level flattens back to the second rather than indenting again.", html: `<section class="ns-comments" style="max-inline-size:42rem;inline-size:100%">
  <div class="ns-comments__head">
    <h2 class="ns-comments__count"><b>24</b> comments</h2>
    <label class="ns-commentform__hint">Sort
      <select class="ns-select" style="margin-inline-start:var(--space-2)">
        <option>Newest</option><option>Oldest</option><option>Most liked</option>
      </select>
    </label>
  </div>

  <div class="ns-comments__list">
    <article class="ns-comment ns-comment--pinned">
      <span class="ns-comment__avatar ns-ph ns-ph--sm" aria-hidden="true"></span>
      <div class="ns-comment__main">
        <div class="ns-comment__head">
          <a class="ns-comment__author" href="#0">Priya Nair</a>
          <span class="ns-comment__badge">moderator</span>
          <span class="ns-comment__badge"><i class="ph ph-bookmark-simple" aria-hidden="true"></i> pinned</span>
          <time class="ns-comment__time" datetime="2026-08-14">3 days ago</time>
        </div>
        <div class="ns-comment__text"><p>Worth adding: the 101-query error usually shows up in a test long before production, because tests run with a fresh limit counter per method. If your test passes with one record and fails with 200, this is why.</p></div>
        <div class="ns-comment__actions">
          <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs" aria-pressed="false" aria-label="Like, 12 likes"><i class="ph ph-heart" aria-hidden="true"></i> 12</button>
          <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs">Reply</button>
        </div>
      </div>
    </article>

    <article class="ns-comment">
      <span class="ns-comment__avatar ns-ph ns-ph--sm" aria-hidden="true"></span>
      <div class="ns-comment__main">
        <div class="ns-comment__head">
          <a class="ns-comment__author" href="#0">dev_arun</a>
          <time class="ns-comment__time" datetime="2026-08-15">2 days ago</time>
        </div>
        <div class="ns-comment__text"><p>Does a Flow element count against the same SOQL limit as an Apex query, or does it get its own budget?</p></div>
        <div class="ns-comment__actions">
          <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs" aria-pressed="false" aria-label="Like, 3 likes"><i class="ph ph-heart" aria-hidden="true"></i> 3</button>
          <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs">Reply</button>
        </div>

        <div class="ns-comment__replies">
          <article class="ns-comment ns-comment--op">
            <span class="ns-comment__avatar ns-ph ns-ph--sm" aria-hidden="true"></span>
            <div class="ns-comment__main">
              <div class="ns-comment__head">
                <a class="ns-comment__author" href="#0">Swarnil Singhai</a>
                <span class="ns-comment__badge">author</span>
                <time class="ns-comment__time" datetime="2026-08-15">2 days ago</time>
              </div>
              <div class="ns-comment__text"><p>Same budget. Everything in one transaction shares the 100, whichever tool spent it — which is exactly why a Flow looping over records hits it as fast as a trigger does.</p></div>
              <div class="ns-comment__actions">
                <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs" aria-pressed="true" aria-label="Liked, 8 likes"><i class="ph ph-heart" aria-hidden="true"></i> 8</button>
                <button type="button" class="ns-btn ns-btn--quiet ns-btn--xs">Reply</button>
              </div>
            </div>
          </article>
          <article class="ns-comment ns-comment--removed">
            <span class="ns-comment__avatar ns-ph ns-ph--sm" aria-hidden="true"></span>
            <div class="ns-comment__main">
              <div class="ns-comment__head"><span class="ns-comment__author">Removed</span><time class="ns-comment__time" datetime="2026-08-16">1 day ago</time></div>
              <div class="ns-comment__text"><p>This comment was removed for breaking the house rules.</p></div>
            </div>
          </article>
        </div>
      </div>
    </article>
  </div>

  <button type="button" class="ns-btn ns-btn--outline ns-btn--block">Load 21 more comments</button>
</section>` },
      { name: "Leave a comment", note: "Reuses the form layer wholesale — <code>.ns-field</code>, <code>.ns-textarea</code>, <code>.ns-btn</code>. There is no bespoke comment input, because a comment box is a textarea and pretending otherwise is how a design system grows a second form system.", html: `<form class="ns-commentform" style="max-inline-size:42rem;inline-size:100%">
  <div class="ns-field">
    <label class="ns-field__label" for="c-body">Leave a comment</label>
    <textarea class="ns-textarea" id="c-body" rows="4" placeholder="Add to the discussion&hellip;"></textarea>
    <span class="ns-field__help">Markdown is supported. Be useful or be brief.</span>
  </div>
  <div class="ns-commentform__row">
    <span class="ns-commentform__hint">Posting as <strong>dev_arun</strong></span>
    <button type="submit" class="ns-btn ns-btn--primary">Post comment</button>
  </div>
</form>` },
      { name: "Signed out, closed, and empty", note: "Three states that are not errors, so none of them is a warning: a hairline note for the first two, the system's own empty state for the third.", html: `<div style="display:grid;gap:var(--space-6);max-inline-size:42rem;inline-size:100%">
  <div class="ns-comments__note">
    <i class="ph ph-user-circle" aria-hidden="true"></i>
    <p>Sign in to join the discussion. Comments are open to anyone with an account &mdash; free or paid.</p>
    <a class="ns-btn ns-btn--outline ns-btn--sm" href="#0">Sign in</a>
  </div>
  <div class="ns-comments__note">
    <i class="ph ph-lock-simple" aria-hidden="true"></i>
    <p>Comments closed. This post is over a year old and the thread has stopped being useful &mdash; the replies are still here.</p>
  </div>
  <div class="ns-empty">
    <i class="ns-empty__icon ph ph-chats-circle" aria-hidden="true"></i>
    <p class="ns-empty__title">No comments yet</p>
    <p class="ns-empty__text">Be the first. Questions get answered here more reliably than anywhere else.</p>
  </div>
</div>` },
    ],
  },
  {
    id: "tag-page", title: "Tag pages", family: "Blog",
    summary: "Two surfaces answering different questions: the top of ONE tag's page, and the page that lists every tag. A tag page arrived at from search is otherwise a list of posts with no statement of what connects them — which is why the description is not decoration here, it is the only thing that says what the tag means.",
    use: ["A tag or category archive — the header, then a Blog index with the featured card dropped", "An all-tags page", "--compact when the tag header sits above a rail-and-grid listing rather than alone"],
    not: ["A tag cloud. Encoding count as type size makes the biggest tag the most legible and buries the specific one somebody is hunting for. A sorted grid of equal cards is duller and works", "A tag page with no description. If you cannot write one sentence about what the tag collects, the tag is not a tag — it is a typo with twelve posts in it"],
    a11y: ["The <code>#</code> is generated in CSS, never typed: a hash in the DOM is read aloud as &ldquo;number sign&rdquo; before every tag name on the page", "The count is real text beside the title, so &ldquo;12 posts&rdquo; is announced rather than inferred from the length of a list", "The tag row is a <code>&lt;nav&gt;</code> with an accessible name — it is navigation, not a set of decorative chips"],
    variants: [
      { name: "One tag", note: "Header, then the listing. The count sets an expectation before the reader starts scrolling: 12 posts and 300 posts are different promises about how long they are about to be here.", html: `<div style="max-inline-size:52rem;inline-size:100%">
  <header class="ns-taghead">
    <h1 class="ns-taghead__title">apex <span class="ns-taghead__count">42 posts</span></h1>
    <p class="ns-taghead__desc">Everything about Salesforce&rsquo;s own language: triggers, governor limits, testing, and the patterns that survive a real org.</p>
    <div class="ns-taghead__actions">
      <a class="ns-btn ns-btn--outline ns-btn--sm" href="#0"><i class="ph ph-rss-simple" aria-hidden="true"></i> Subscribe</a>
      <a class="ns-btn ns-btn--quiet ns-btn--sm" href="#0">All tags</a>
    </div>
  </header>
  <nav class="ns-tagrow" aria-label="Related tags" style="margin-block-start:var(--space-5)">
    <a class="ns-tag" href="#0">triggers</a>
    <a class="ns-tag" href="#0">soql</a>
    <a class="ns-tag" href="#0">testing</a>
    <a class="ns-tag" href="#0">governor-limits</a>
  </nav>
</div>` },
      { name: "Compact", note: "For a tag header that sits above the rail-and-grid listing, where the page already has a lot to say.", html: `<header class="ns-taghead ns-taghead--compact" style="max-inline-size:52rem;inline-size:100%">
  <h1 class="ns-taghead__title">flow <span class="ns-taghead__count">18 posts</span></h1>
  <p class="ns-taghead__desc">Declarative automation, and where it stops being the right tool.</p>
</header>` },
      { name: "Every tag", note: "Sorted, equal weight, count on the right. The description is what makes this page navigable rather than a wall of nouns.", html: `<div class="ns-tagindex">
  <a class="ns-tagcard" href="#0">
    <span class="ns-tagcard__name">apex <span class="ns-tagcard__count">42</span></span>
    <span class="ns-tagcard__desc">Triggers, governor limits, testing, and the patterns that survive a real org.</span>
  </a>
  <a class="ns-tagcard" href="#0">
    <span class="ns-tagcard__name">flow <span class="ns-tagcard__count">18</span></span>
    <span class="ns-tagcard__desc">Declarative automation, and where it stops being the right tool.</span>
  </a>
  <a class="ns-tagcard" href="#0">
    <span class="ns-tagcard__name">architecture <span class="ns-tagcard__count">11</span></span>
    <span class="ns-tagcard__desc">Data models, sharing, and decisions that are expensive to reverse.</span>
  </a>
  <a class="ns-tagcard" href="#0">
    <span class="ns-tagcard__name">careers <span class="ns-tagcard__count">7</span></span>
    <span class="ns-tagcard__desc">Certifications, interviews, and what actually gets people hired.</span>
  </a>
</div>` },
      { name: "Both, full page", note: "The tag page is the blog index with its header swapped and the featured card dropped — worth checking side by side rather than taking on trust. Resize either one: the rail drops below the grid at 64rem, and the tag cards reflow from four columns to one.", html: `<p style="display:flex;flex-wrap:wrap;gap:var(--space-3)">
  <a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-tag-page.html" target="_blank" rel="noopener">Open the tag page <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
  <a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-tag-index.html" target="_blank" rel="noopener">Open the all-tags page <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
  <a class="ns-btn ns-btn--quiet ns-btn--sm" href="./demo-blog-listing.html" target="_blank" rel="noopener">Compare with the index <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
</p>` },
    ],
  },

  {
    id: "admin-shell", title: "Admin shell", family: "CMS",
    summary: "The builder's console: fixed topbar, side nav, scrolling main — one CSS grid, no JS. Below lg the nav becomes a top strip. The mono env tag says which site this console edits.",
    use: ["Every admin screen — dashboard, lists, editors all render inside it"],
    not: ["The learner-facing app — that uses the marketing navbar + page layouts"],
    a11y: ["Topbar is a <header>, nav an <aside>+<nav>, content a <main> — landmark navigation works out of the box"],
    variants: [
      { name: "Topbar fragment", html: `<div style="border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden;inline-size:100%">
  <header class="ns-admin__topbar" style="position:static">
    <strong>Namaste Salesforce</strong>
    <span class="ns-admin__env">admin · production</span>
    <span class="ns-admin__spacer"></span>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon" aria-label="Notifications"><i class="ph ph-bell" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm">swarnil@…</button>
  </header>
</div>` },
      { name: "Full screens", note: "The three admin surfaces as full-screen demos — the framework-agnostic templates rendered with the real stylesheet.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-dashboard.html" target="_blank" rel="noopener">Dashboard <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-course-new.html" target="_blank" rel="noopener">Create a course <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-lesson-editor.html" target="_blank" rel="noopener">Lesson editor <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },
  {
    id: "admin-nav", title: "Admin nav", family: "CMS",
    summary: "The console's side navigation: mono indices, section separators, counts at the row end. The current page carries the 2px leading edge — aria-current, never an .active class.",
    use: ["Inside the admin shell's side slot", "Counts for things waiting on the admin (drafts, open tickets)"],
    not: ["Learner-facing docs — DocsSidebar is that component"],
    variants: [
      { name: "Grouped", html: `<nav class="ns-admin-nav" aria-label="Admin" style="inline-size:14rem">
  <p class="ns-admin-nav__sep">Content</p>
  <a href="#" aria-current="page"><span class="ns-admin-nav__num">01</span><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-dashboard"/></svg>Dashboard</a>
  <a href="#"><span class="ns-admin-nav__num">02</span><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-course"/></svg>Courses<span class="ns-admin-nav__count">12</span></a>
  <a href="#"><span class="ns-admin-nav__num">03</span><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-draft"/></svg>Drafts<span class="ns-admin-nav__count">3</span></a>
  <p class="ns-admin-nav__sep">People</p>
  <a href="#"><span class="ns-admin-nav__num">04</span><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-students"/></svg>Students</a>
</nav>` },
    ],
  },
  {
    id: "pagehead", title: "Page head", family: "CMS",
    summary: "Every admin screen opens with one: code-comment kicker, the h1, a meta line, and the screen's actions on the trailing edge. The one primary button per screen lives here.",
    use: ["The top of every screen inside the admin shell"],
    not: ["Marketing pages — bands have their own head grammar"],
    variants: [
      { name: "With actions", html: `<div class="ns-pagehead" style="inline-size:100%">
  <div>
    <span class="ns-pagehead__kicker">// Courses</span>
    <h1>All courses</h1>
    <p class="ns-pagehead__meta">12 published · 3 drafts</p>
  </div>
  <div class="ns-pagehead__actions">
    <a class="ns-btn ns-btn--outline" href="#">New lesson</a>
    <a class="ns-btn ns-btn--primary" href="#">New course</a>
  </div>
</div>` },
    ],
  },
  {
    id: "stat", title: "Stat card", family: "CMS",
    summary: "The dashboard number: uppercase mono label, big tabular mono value, a worded delta in status ink. The word (“↑ 2 this month”) carries the meaning; the color reinforces it.",
    use: ["4-up dashboard summary rows", "Deltas only when the comparison is real"],
    not: ["Marketing pages — the Stat band section is that surface", "Charts — this is one number, not a trend"],
    variants: [
      { name: "Grid", html: `<div class="ns-stat-grid" style="inline-size:100%">
  <div class="ns-stat"><span class="ns-stat__label">Published courses</span><div class="ns-stat__value">12</div><span class="ns-stat__delta ns-stat__delta--up">↑ 2 this month</span></div>
  <div class="ns-stat"><span class="ns-stat__label">Active students</span><div class="ns-stat__value">1,482</div><span class="ns-stat__delta ns-stat__delta--up">↑ 6.1%</span></div>
  <div class="ns-stat"><span class="ns-stat__label">Completion</span><div class="ns-stat__value">74%</div><span class="ns-stat__delta ns-stat__delta--down">↓ 1.2 pts</span></div>
  <div class="ns-stat"><span class="ns-stat__label">Open tickets</span><div class="ns-stat__value">7</div><span class="ns-stat__delta">3 waiting on you</span></div>
</div>` },
    ],
  },
  {
    id: "toolbar", title: "Toolbar", family: "CMS",
    summary: "The row above every list screen: search, filter selects, the mono result count, and the view toggle on the trailing edge. Wraps on narrow screens — never becomes a second navbar.",
    use: ["Above tables and record lists in the admin"],
    not: ["Global navigation or actions that belong in the page head"],
    variants: [
      { name: "Search + filters + toggle", html: `<div class="ns-toolbar" style="inline-size:100%">
  <span class="ns-input-wrap ns-toolbar__search">
    <i class="ph ph-magnifying-glass ns-input-wrap__icon" aria-hidden="true"></i>
    <input class="ns-input ns-input--has-icon" type="search" placeholder="Search courses…">
  </span>
  <select class="ns-select" aria-label="Status"><option>All statuses</option><option>Published</option><option>Draft</option></select>
  <select class="ns-select" aria-label="Level"><option>All levels</option><option>Beginner</option></select>
  <span class="ns-toolbar__count">12 results</span>
  <span class="ns-toolbar__spacer"></span>
  <div class="ns-btn-group">
    <button class="ns-btn ns-btn--outline ns-btn--sm" aria-pressed="true">List</button>
    <button class="ns-btn ns-btn--outline ns-btn--sm">Cards</button>
  </div>
</div>` },
    ],
  },
  {
    id: "editor-layout", title: "Editor layout", family: "CMS",
    summary: "The creation screen's two panes: the record on the left, everything ABOUT the record in a sticky rail of hairline RailBox groups — status, thumbnail, tags, visibility. Collapses to one column below lg.",
    use: ["Course creation, lesson editing, any record-with-settings screen"],
    not: ["Simple settings forms — a narrow single column is enough"],
    variants: [
      { name: "Rail boxes", html: `<div class="ns-editor__rail" style="position:static;inline-size:17rem">
  <section class="ns-railbox">
    <h2 class="ns-railbox__title">Status</h2>
    <span class="ns-status ns-status--idle">Draft</span>
  </section>
  <section class="ns-railbox">
    <h2 class="ns-railbox__title">Thumbnail</h2>
    <label class="ns-dropzone ns-dropzone--compact">
      <i class="ph ph-upload-simple ns-dropzone__icon" aria-hidden="true"></i>
      <span>Drop an image, or browse</span>
      <input type="file" accept="image/*">
    </label>
  </section>
</div>` },
    ],
  },
  {
    id: "publishbar", title: "Publish bar", family: "CMS",
    summary: "The sticky strip at the foot of a creation screen: the mono save state on the left (a timestamp, not a toast), draft/publish actions on the right. role=status announces saves quietly.",
    use: ["Course and lesson editors — anywhere work can be lost"],
    not: ["List screens — nothing to save there"],
    variants: [
      { name: "Draft state", html: `<div class="ns-publishbar" style="position:static;margin-inline:0;inline-size:100%">
  <span class="ns-publishbar__state" role="status"><span class="ns-status ns-status--idle">Draft</span> saved 14:32:07</span>
  <div class="ns-publishbar__actions">
    <button class="ns-btn ns-btn--outline">Save draft</button>
    <button class="ns-btn ns-btn--primary"><svg class="ns-icon" aria-hidden="true"><use href="../icons/namaste-icons.svg#ns-i-publish"/></svg> Publish</button>
  </div>
</div>` },
    ],
  },
  {
    id: "titlebox", title: "Title box & slug", family: "CMS",
    summary: "A lesson is written, not filled in — so the title is a big borderless input at heading size; the hairline appears under it only on focus. The slug pairs the fixed mono prefix with a mono input.",
    use: ["The title position of every creation screen", "Slugs, IDs — URL parts are data, so they are mono"],
    not: ["Ordinary form fields — those use Field + Input"],
    variants: [
      { name: "Title", html: `<input class="ns-titlebox" type="text" placeholder="Lesson title…" aria-label="Title" style="max-inline-size:30rem">` },
      { name: "Slug", html: `<span class="ns-slug" style="max-inline-size:30rem">
  <span class="ns-slug__prefix" aria-hidden="true">namaste.dev/courses/</span>
  <input class="ns-input ns-input--mono" value="admin-fundamentals" aria-label="URL slug">
</span>` },
    ],
  },
  {
    id: "rte", title: "Rich text", family: "CMS",
    summary: "Writing chrome: a quiet icon toolbar over the writing area. Active marks are aria-pressed with the standard brand-tint treatment; the area reads with body type, because lesson prose should look like lesson prose while being written.",
    use: ["Lesson bodies, course descriptions — anywhere an author writes prose"],
    not: ["Single-line values or plain textareas", "Code editing — CodeBlock renders code, your editor edits it"],
    a11y: ["role=toolbar groups the buttons; every button has a label", "Active formatting is aria-pressed — seen and announced state agree"],
    variants: [
      { name: "Toolbar + area", html: `<div class="ns-rte" style="inline-size:100%">
  <div class="ns-rte__bar" role="toolbar" aria-label="Formatting">
    <button type="button" class="ns-rte__btn" aria-label="Bold" aria-pressed="false"><i class="ph ph-text-b" aria-hidden="true"></i></button>
    <button type="button" class="ns-rte__btn" aria-label="Italic" aria-pressed="false"><i class="ph ph-text-italic" aria-hidden="true"></i></button>
    <span class="ns-rte__gap" aria-hidden="true"></span>
    <button type="button" class="ns-rte__btn" aria-label="Heading 2" aria-pressed="true"><i class="ph ph-text-h-two" aria-hidden="true"></i></button>
    <button type="button" class="ns-rte__btn" aria-label="Bulleted list" aria-pressed="false"><i class="ph ph-list-bullets" aria-hidden="true"></i></button>
    <span class="ns-rte__gap" aria-hidden="true"></span>
    <button type="button" class="ns-rte__btn" aria-label="Code block" aria-pressed="false"><i class="ph ph-code" aria-hidden="true"></i></button>
    <button type="button" class="ns-rte__btn" aria-label="Link" aria-pressed="false"><i class="ph ph-link" aria-hidden="true"></i></button>
  </div>
  <div class="ns-rte__area" contenteditable="true" role="textbox" aria-multiline="true" aria-label="Lesson body" style="min-block-size:8rem">
    <p>Lightning Experience organizes everything you do into apps — a named collection of tabs.</p>
  </div>
</div>` },
    ],
  },
  {
    id: "builder", title: "Curriculum builder", family: "CMS",
    summary: "The course's structure, editable: section blocks with in-place titles and mono lesson-count meta, lesson rows with grip, index, type badge, duration and hover-revealed actions, and the dashed add rows. The learner curriculum is this, read-only.",
    use: ["Building and reordering a course's sections and lessons", "The grip button reorders with ArrowUp/ArrowDown — keyboard first, drag layered on by the app"],
    not: ["Displaying a curriculum to learners — CurriculumList is the read-only twin"],
    a11y: ["Every grip and row action is a labelled button", "The section title is an input with an explicit aria-label", "Row actions appear on hover AND focus-within — keyboard users get them too"],
    variants: [
      { name: "One section", html: `<div class="ns-builder" style="inline-size:100%">
  <section class="ns-builder__section">
    <header class="ns-builder__head">
      <span class="ns-builder__index">01</span>
      <input class="ns-builder__title" value="Getting around" aria-label="Section 1 title">
      <span class="ns-builder__meta">2 lessons · 26 min</span>
    </header>
    <div class="ns-builder__row">
      <button type="button" class="ns-builder__grip" aria-label="Reorder What is an org?"><i class="ph ph-dots-six-vertical" aria-hidden="true"></i></button>
      <span class="ns-builder__index">01</span>
      <span class="ns-builder__name">What is an org?</span>
      <span class="ns-builder__type">video</span>
      <span class="ns-builder__dur">12:04</span>
      <span class="ns-builder__rowactions">
        <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Edit"><i class="ph ph-pencil-simple" aria-hidden="true"></i></button>
        <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Remove"><i class="ph ph-x" aria-hidden="true"></i></button>
      </span>
    </div>
    <div class="ns-builder__row">
      <button type="button" class="ns-builder__grip" aria-label="Reorder Lightning navigation"><i class="ph ph-dots-six-vertical" aria-hidden="true"></i></button>
      <span class="ns-builder__index">02</span>
      <span class="ns-builder__name">Lightning navigation</span>
      <span class="ns-builder__type">video</span>
      <span class="ns-builder__dur">14:31</span>
      <span class="ns-builder__rowactions">
        <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Edit"><i class="ph ph-pencil-simple" aria-hidden="true"></i></button>
        <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label="Remove"><i class="ph ph-x" aria-hidden="true"></i></button>
      </span>
    </div>
    <button type="button" class="ns-builder__add"><i class="ph ph-plus" aria-hidden="true"></i> Add lesson</button>
  </section>
  <button type="button" class="ns-builder__add"><i class="ph ph-plus" aria-hidden="true"></i> Add section</button>
</div>` },
    ],
  },
  {
    id: "dropzone", title: "Dropzone & file row", family: "CMS",
    summary: "The upload target: dashed border (the “nothing here yet” device) resolving to brand on hover, focus or drag-over; the real file input covers the zone. Uploaded files are mono terminal rows with a status chip.",
    use: ["Video, thumbnail and attachment uploads", "compact for the settings rail"],
    not: ["Tiny “change avatar” spots — a plain outline button is enough"],
    a11y: ["The zone is a <label> wrapping the real input — click, keyboard and screen reader all reach it", "Drag state is data-state=“over”, styling only; drop is a convenience, never the only path"],
    variants: [
      { name: "Zone", html: `<label class="ns-dropzone" style="inline-size:100%">
  <i class="ph ph-upload-simple ns-dropzone__icon" aria-hidden="true"></i>
  <span>Drop the lesson video here, or browse</span>
  <span class="ns-dropzone__hint">mp4 · up to 4 GB · 16:9</span>
  <input type="file" accept="video/mp4">
</label>` },
      { name: "File rows", html: `<div style="inline-size:100%">
  <div class="ns-file">
    <i class="ph ph-file-video" aria-hidden="true"></i>
    <span class="ns-file__name">02-lightning-navigation-v3.mp4</span>
    <span class="ns-file__size">612 MB</span>
    <span class="ns-status ns-status--success">Processed</span>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon ns-file__remove" aria-label="Remove"><i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <div class="ns-file">
    <i class="ph ph-file" aria-hidden="true"></i>
    <span class="ns-file__name">navigation-cheatsheet.pdf</span>
    <span class="ns-file__size">1.2 MB</span>
    <span class="ns-status ns-status--info">Uploading</span>
  </div>
</div>` },
    ],
  },
  {
    id: "taginput", title: "Tag input", family: "CMS",
    summary: "Chips inside an input-shaped box; the entry is a bare input at the end. Enter or comma commits, Backspace on empty removes the last tag, and every chip's remove is a real labelled button.",
    use: ["Course tags, lesson topics — small free-vocabulary sets"],
    not: ["Choosing from a fixed list — Select or checkboxes", "Dozens of tags — curate the vocabulary instead"],
    variants: [
      { name: "With tags", html: `<div class="ns-taginput" style="max-inline-size:26rem">
  <span class="ns-taginput__tag">admin<button type="button" class="ns-taginput__x" aria-label="Remove admin"><i class="ph ph-x" aria-hidden="true"></i></button></span>
  <span class="ns-taginput__tag">beginner<button type="button" class="ns-taginput__x" aria-label="Remove beginner"><i class="ph ph-x" aria-hidden="true"></i></button></span>
  <span class="ns-taginput__tag">lightning<button type="button" class="ns-taginput__x" aria-label="Remove lightning"><i class="ph ph-x" aria-hidden="true"></i></button></span>
  <input aria-label="Tags" placeholder="">
</div>` },
    ],
  },

  /* ======================================================= Surfaces ==== */
  {
    id: "card", title: "Card", family: "Surfaces",
    summary: "The generic surface: hairline border, 6px radius, no shadow at rest. Hover brightens the border to brand blue and draws the 2px top accent — elevation by line, never by lift. Course/blog/resource cards are compositions of this.",
    use: ["Any self-contained unit in a collection — courses, posts, resources", "Clickable cards — one stretched link, whole card is the target"],
    not: ["A wrapper around a whole page section — use Band", "Nesting cards in cards — flatten to a List inside one card"],
    a11y: ["Clickable cards use ONE real link (the title) stretched over the card — never a click handler on the div", "Media images are content: alt text or empty alt if decorative"],
    variants: [
      { name: "Default", html: `<div class="ns-card" style="max-inline-size:20rem">
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <span class="ns-card__title">Apex basics</span>
    <p class="ns-card__text">Objects, triggers and your first deploy — the platform's own language from zero.</p>
  </div>
  <div class="ns-card__foot">12 lessons · 3h 40m</div>
</div>` },
      { name: "With media", note: "16:9 media on top; the frame crops, the caption never overlays.", html: `<div class="ns-card" style="max-inline-size:20rem">
  <span class="ns-card__media ns-ph" aria-hidden="true"></span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Blog</span>
    <span class="ns-card__title">Why flows beat process builder</span>
    <p class="ns-card__text">Every automation you should migrate, in order.</p>
  </div>
</div>` },
      { name: "Clickable", note: "One stretched link on the title; the whole card is its hit area.", html: `<div class="ns-card" style="max-inline-size:20rem">
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Roadmap</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Admin certification path</span></a>
    <p class="ns-card__text">Six courses, one exam — the whole track in order.</p>
  </div>
  <div class="ns-card__foot">Step 01 of 06</div>
</div>` },
      { name: "Horizontal", note: "Media beside body — the list-like form for dense collections.", html: `<div class="ns-card ns-card--row" style="max-inline-size:28rem">
  <span class="ns-card__media ns-ph" aria-hidden="true"></span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Training</span>
    <span class="ns-card__title">Trailhead in a weekend</span>
    <p class="ns-card__text">The 12 badges that matter, nothing else.</p>
  </div>
</div>` },
      { name: "Hover without a link", note: "The hover treatment normally fires from <code>:has(.ns-card__link)</code> — the card reacts because it CONTAINS a link, which is the honest trigger. <code>--hover</code> is the opt-in for the case that rule cannot see: a card made interactive by something else, like a whole-card click handler in the LMS or a card wrapped in a router <code>&lt;Link&gt;</code> that renders no <code>.ns-card__link</code> inside. Do not put it on a card that does nothing — a surface that lights up and then ignores the click is worse than one that never moved.", html: `<div class="ns-card ns-card--hover" style="max-inline-size:20rem">
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Wrapped</span>
    <span class="ns-card__title">The parent is the link</span>
    <p class="ns-card__text">Hover me — the accent line and border fire without a <code>.ns-card__link</code> anywhere inside.</p>
  </div>
</div>` },
      { name: "Shelf", stack: true, note: "<code>.ns-strip</code> is the scroll-snapped horizontal shelf any card composes into — related posts, &ldquo;continue learning&rdquo;, more from this author. <code>--wide</code> raises the track from 14rem to 20rem for cards that carry media. The <code>min()</code> around the track minimum is load-bearing: a bare <code>14rem</code> is a definite minimum that propagates up and silently widens whatever column the shelf was dropped into.", html: `<div class="ns-strip ns-strip--wide">
  <div class="ns-card"><span class="ns-card__media ns-ph" aria-hidden="true"></span><div class="ns-card__body"><span class="ns-card__title">Governor limits as a budget</span></div></div>
  <div class="ns-card"><span class="ns-card__media ns-ph" aria-hidden="true"></span><div class="ns-card__body"><span class="ns-card__title">Bulkify every trigger</span></div></div>
  <div class="ns-card"><span class="ns-card__media ns-ph" aria-hidden="true"></span><div class="ns-card__body"><span class="ns-card__title">Sharing recalculation</span></div></div>
</div>` },
    ],
  },
  {
    id: "tag", title: "Tag & pill", family: "Surfaces",
    summary: "A tag names a taxonomy — topic, level, lesson type — in the mono label voice with a hairline border. The pill SHAPE is reserved for true pills (filters, counts); the default tag stays sharp (Principle 4).",
    use: ["Topics and levels on cards and pages", "Filter rows — aria-pressed marks the active tag", "Counts — the pill form with a mono count"],
    not: ["Status — that is Status (dot + text), never a tag", "Actions — a tag that performs an action is a Button"],
    a11y: ["Filter tags are real buttons with aria-pressed", "Removable tags name their target: aria-label=\"Remove Apex\""],
    variants: [
      { name: "Tags", html: `<span class="ns-tag">Apex</span>
<span class="ns-tag"><i class="ph ph-graduation-cap" aria-hidden="true"></i> Beginner</span>
<span class="ns-tag">Flow</span>` },
      { name: "Filter row", note: "Real buttons; the pressed one wears the brand border.", html: `<button class="ns-tag" aria-pressed="true">All</button>
<button class="ns-tag" aria-pressed="false">Admin</button>
<button class="ns-tag" aria-pressed="false">Developer</button>` },
      { name: "Pills", note: "The pill radius is earned by being a true pill — counts and filters.", html: `<span class="ns-tag ns-tag--pill">Apex <span class="ns-tag__count">24</span></span>
<span class="ns-tag ns-tag--pill">Flows <span class="ns-tag__count">11</span></span>` },
      { name: "Removable", html: `<span class="ns-tag">Apex <button class="ns-tag__x" aria-label="Remove Apex"><i class="ph ph-x" aria-hidden="true"></i></button></span>
<span class="ns-tag">SOQL <button class="ns-tag__x" aria-label="Remove SOQL"><i class="ph ph-x" aria-hidden="true"></i></button></span>` },
    ],
  },
  {
    id: "combobox", title: "Combobox", family: "Forms",
    summary: "Type-ahead over a known list — a course, a tag, an org. A <code>&lt;select&gt;</code> cannot be searched and a bare text input cannot be trusted; this is the third thing.",
    use: ["A list too long to scan but closed enough to validate against", "Where the reader knows roughly what they want and can type it faster than they can find it"],
    not: ["Under about seven options — use a Select; searching five things is friction, not help", "Free text — if any value is allowed it is an Input, not a combobox", "Multi-select — use Tag input"],
    a11y: ["A real &lt;input&gt;, so autofill, IME, mobile keyboards and paste all behave", "aria-expanded on the input; role=listbox / role=option on the list", "aria-activedescendant points at the highlighted option, so the highlight is never a class the assistive layer cannot see", "Without JS the input still submits its value — a search box that types beats a combobox that does nothing"],
    variants: [
      { name: "Open, filtering", note: "The matched run is emphasised inside each option so the reader can see WHY a row matched.", html: `<div class="ns-combobox">
  <input class="ns-input" type="text" role="combobox" aria-expanded="true" aria-controls="cb-list" aria-autocomplete="list" value="apex" autocomplete="off">
  <ul class="ns-combobox__list" id="cb-list" role="listbox">
    <li class="ns-combobox__option" role="option" aria-selected="true"><span><span class="ns-combobox__match">Apex</span> fundamentals</span><span class="ns-combobox__meta">12 lessons</span></li>
    <li class="ns-combobox__option" role="option" aria-selected="false"><span><span class="ns-combobox__match">Apex</span> triggers in depth</span><span class="ns-combobox__meta">8 lessons</span></li>
    <li class="ns-combobox__option" role="option" aria-selected="false"><span>Testing <span class="ns-combobox__match">Apex</span></span><span class="ns-combobox__meta">6 lessons</span></li>
  </ul>
</div>` },
      { name: "No matches", note: "Say what was searched. “No results” alone leaves the reader unsure whether the query or the data is wrong.", html: `<div class="ns-combobox">
  <input class="ns-input" type="text" role="combobox" aria-expanded="true" aria-controls="cb-empty" value="vlocity" autocomplete="off">
  <ul class="ns-combobox__list" id="cb-empty" role="listbox">
    <li class="ns-combobox__empty" role="option" aria-selected="false">No course matches <strong>vlocity</strong>.</li>
  </ul>
</div>` },
    ],
  },
  {
    id: "segmented", title: "Segmented control", family: "Forms",
    summary: "One choice from two to four, where the options are a <em>view</em> rather than data: grid or list, week or month, all or mine. The whole set is visible at once — that is the difference from a Select.",
    use: ["Switching how the same content is displayed", "Two to four options with short, parallel labels"],
    not: ["More than four — the labels get too short to read and it wants to be a Select", "Multi-select filtering — that is Filter rail's choice chips", "An action — a segment changes a view, it does not do a thing"],
    a11y: ["Real radios inside a fieldset with a legend, so arrow-key navigation, form submission and grouping all come from the platform", "No JS required for the control itself", "The legend names what is being switched; the labels name the options"],
    variants: [
      { name: "Two and three up", html: `<fieldset class="ns-segmented">
  <label class="ns-segmented__option"><input type="radio" name="view" checked><span><i class="ph ph-squares-four" aria-hidden="true"></i>Grid</span></label>
  <label class="ns-segmented__option"><input type="radio" name="view"><span><i class="ph ph-rows" aria-hidden="true"></i>List</span></label>
</fieldset>
<fieldset class="ns-segmented">
  <label class="ns-segmented__option"><input type="radio" name="scope" checked><span>All</span></label>
  <label class="ns-segmented__option"><input type="radio" name="scope"><span>In progress</span></label>
  <label class="ns-segmented__option"><input type="radio" name="scope"><span>Complete</span></label>
</fieldset>` },
      { name: "Disabled option", note: "Disable the segment, not the whole control — the reader can still see the option exists.", html: `<fieldset class="ns-segmented">
  <label class="ns-segmented__option"><input type="radio" name="plan" checked><span>Monthly</span></label>
  <label class="ns-segmented__option"><input type="radio" name="plan"><span>Yearly</span></label>
  <label class="ns-segmented__option"><input type="radio" name="plan" disabled><span>Lifetime</span></label>
</fieldset>` },
    ],
  },
  {
    id: "datefield", title: "Date field", family: "Forms",
    summary: "A themed date picker over a native <code>&lt;input type=\"date\"&gt;</code>. The input keeps its type, so the value stays a valid ISO date, form submission is unchanged, and a script failure returns the platform picker.",
    use: ["Publish scheduling, cohort start dates, deadlines", "Anywhere a single date is the answer"],
    not: ["A date RANGE — use two fields with a real relationship between them", "A date the reader must not change — that is text", "Times — a date picker that also picks minutes is two controls in one"],
    a11y: ["Month and weekday names come from Intl, never a hard-coded array — that array is wrong in most of the world, and silently so. The first day of the week follows the locale too", "A roving tabindex, not aria-activedescendant: exactly one day is tabbable and arrows move real focus, so the focused cell is announced with no live region", "A real &lt;table&gt; with &lt;th scope=\"col\"&gt;, so the day/column relationship is announced rather than implied by position", "Esc closes and returns focus to the field, from anywhere inside", "Today is a ring and selected is a fill — two different claims, so they coexist on the same cell without either winning"],
    variants: [
      { name: "Themed picker", stack: true, note: "data-ns-calendar replaces the native popup with the system's own. Click the field or press Down/Enter; arrows move by day, PageUp/Down by month, Esc closes and returns focus.", html: `<div class="ns-datefield" data-ns-calendar><input class="ns-input" type="date" value="2026-09-14" aria-label="Publish date"></div>` },
      { name: "Native fallback", note: "Without data-ns-calendar — and this is also exactly what the reader gets if the script never loads, which is why the input keeps type=\"date\".", html: `<div class="ns-datefield"><input class="ns-input" type="date" aria-label="Publish date"></div>` },
      { name: "In a field", html: `<div class="ns-field">
  <label class="ns-field__label" for="d-pub">Publish date</label>
  <div class="ns-datefield"><input class="ns-input" id="d-pub" type="date" value="2026-09-14"></div>
  <p class="ns-field__help">Scheduled posts go live at 09:00 in the site timezone.</p>
</div>` },
      { name: "The popup's anatomy", stack: true, note: "The script builds this; it is printed here because a structure that only exists at runtime is a structure nobody can review. Note what it is made of: a real <code>&lt;table&gt;</code> with <code>&lt;th scope=\"col\"&gt;</code>, real <code>&lt;button&gt;</code> days, and a month heading that is a live region because arrow-keying across a boundary changes it and the only other feedback would be visual. Today is a ring, selected is a fill — two claims that have to be able to coexist on one cell.", html: `<div class="ns-datefield" style="margin-block-end:19rem">
  <input class="ns-input" type="date" value="2026-09-14" aria-label="Publish date">
  <div class="ns-calendar">
    <div class="ns-calendar__head">
      <button class="ns-calendar__nav" type="button" aria-label="Previous month"><i class="ph ph-caret-left" aria-hidden="true"></i></button>
      <span class="ns-calendar__month" role="status">September 2026</span>
      <button class="ns-calendar__nav" type="button" aria-label="Next month"><i class="ph ph-caret-right" aria-hidden="true"></i></button>
    </div>
    <table class="ns-calendar__grid">
      <thead><tr>
        <th class="ns-calendar__dow" scope="col">Mo</th><th class="ns-calendar__dow" scope="col">Tu</th><th class="ns-calendar__dow" scope="col">We</th>
        <th class="ns-calendar__dow" scope="col">Th</th><th class="ns-calendar__dow" scope="col">Fr</th><th class="ns-calendar__dow" scope="col">Sa</th><th class="ns-calendar__dow" scope="col">Su</th>
      </tr></thead>
      <tbody>
        <tr>
          <td><button class="ns-calendar__day" type="button" data-outside tabindex="-1">31</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">1</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">2</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">3</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">4</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">5</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">6</button></td>
        </tr>
        <tr>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">7</button></td>
          <td><button class="ns-calendar__day" type="button" data-today tabindex="-1">8</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">9</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">10</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">11</button></td>
          <td><button class="ns-calendar__day" type="button" disabled tabindex="-1">12</button></td>
          <td><button class="ns-calendar__day" type="button" disabled tabindex="-1">13</button></td>
        </tr>
        <tr>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">14</button></td>
          <td><button class="ns-calendar__day" type="button" aria-selected="true" tabindex="0">15</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">16</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">17</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">18</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">19</button></td>
          <td><button class="ns-calendar__day" type="button" tabindex="-1">20</button></td>
        </tr>
      </tbody>
    </table>
    <div class="ns-calendar__foot">
      <button class="ns-btn ns-btn--xs" type="button">Today</button>
      <button class="ns-btn ns-btn--xs" type="button">Clear</button>
    </div>
  </div>
</div>` },
    ],
  },
  {
    id: "divider", title: "Divider", family: "Surfaces",
    summary: "A rule between things. Principle&nbsp;1 says the hairline <em>is</em> the structure, so this is the one component that is nothing but the hairline.",
    use: ["Separating groups that a heading would over-announce", "--labelled for an OR between two routes, or a date break in a feed"],
    not: ["Between every item in a list — List already rules its own rows", "As decoration — a rule with nothing on either side of it is noise"],
    a11y: ["A bare rule is a real &lt;hr&gt;", "The labelled form's text is real text between two rules, so it survives selection and copy — not a background trick"],
    variants: [
      { name: "Plain", html: `<p class="ns-card__text">Above the rule.</p>
<hr class="ns-divider">
<p class="ns-card__text">Below it.</p>` },
      { name: "Labelled", html: `<div class="ns-divider ns-divider--labelled">or</div>` },
      { name: "Tight", note: "Inside a card or a menu, where the default rhythm is too much air.", html: `<p class="ns-card__text">Above.</p>
<hr class="ns-divider ns-divider--tight">
<p class="ns-card__text">Below.</p>` },
    ],
  },
  {
    id: "kbd", title: "Kbd", family: "Surfaces",
    summary: "A key, and sequences of keys. The key affordance is a 2px bottom border rather than a shadow — the same borders-not-depth rule as everything else, and it reads as a keycap because keycaps are lit from above.",
    use: ["Documenting a shortcut in help, a menu or a tooltip", "The editor and admin toolbars, which both have shortcuts and had no way to print one"],
    not: ["Code — that is <code>&lt;code&gt;</code>; a kbd is a key the reader presses", "Inventing shortcuts in docs that the product does not implement"],
    a11y: ["Real &lt;kbd&gt; elements, so the meaning survives with CSS off", "The separator is content, not a ::before — it says whether keys are pressed together or in sequence, which is not decoration"],
    variants: [
      { name: "Chord — pressed together", html: `<span class="ns-kbd-seq"><kbd class="ns-kbd">⌘</kbd><span class="ns-kbd-seq__sep">+</span><kbd class="ns-kbd">K</kbd></span>
<span class="ns-kbd-seq"><kbd class="ns-kbd">Ctrl</kbd><span class="ns-kbd-seq__sep">+</span><kbd class="ns-kbd">Shift</kbd><span class="ns-kbd-seq__sep">+</span><kbd class="ns-kbd">P</kbd></span>` },
      { name: "Sequence — pressed in turn", note: "“then”, not “+”. The two are different instructions and must not look the same.", html: `<span class="ns-kbd-seq"><kbd class="ns-kbd">G</kbd><span class="ns-kbd-seq__sep">then</span><kbd class="ns-kbd">D</kbd></span>` },
    ],
  },
  {
    id: "copy", title: "Copy", family: "Surfaces",
    summary: "Copy one short string: an org ID, an API key, a token name, a share link. The code block has its own copy button because it copies a whole file; this is the inline one for a value in a table or a spec row.",
    use: ["A value the reader will paste somewhere else", "Beside an ID, key, endpoint or token name"],
    not: ["A whole code block — Syntax highlighter has copy built in", "A value short enough to retype, like a two-digit number"],
    a11y: ["data-copied is an attribute, not a class, so the same hook can carry aria-live text — a copy button that only changes colour tells a screen-reader user nothing", "A real &lt;button&gt; with an accessible name that includes what is being copied"],
    variants: [
      { name: "Default and confirmed", note: "The right-hand one shows the state JS sets after a successful copy.", html: `<button class="ns-copy" type="button"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-copy__value">00D5j000000abcAAA</span></button>
<button class="ns-copy" type="button" data-copied><i class="ph ph-check-circle" aria-hidden="true"></i><span class="ns-copy__value">00D5j000000abcAAA</span></button>` },
      { name: "In a spec row", html: `<dl class="ns-deflist">
  <dt>Org ID</dt><dd><button class="ns-copy" type="button" aria-label="Copy org ID"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-copy__value">00D5j000000abcAAA</span></button></dd>
  <dt>API version</dt><dd>v62.0</dd>
</dl>` },
    ],
  },
  {
    id: "deflist", title: "Definition list", family: "Surfaces",
    summary: "Term and value pairs: course specs, Salesforce metadata attributes, an order summary. Terms are mono — Principle&nbsp;2 doing its job, so the eye separates key from content without a rule between them.",
    use: ["Specs, attributes, metadata — anything shaped like key: value", "Where a two-column Table would be overkill"],
    not: ["Tabular data with more than two columns — that is a Table", "A form — values here are read-only"],
    a11y: ["A real &lt;dl&gt;, because that is exactly what a &lt;dl&gt; is for and screen readers announce the pairing", "Stacks to one column below 48rem — a 12rem term column is unreadable on a phone"],
    variants: [
      { name: "Two column", html: `<dl class="ns-deflist">
  <dt>Level</dt><dd>Beginner</dd>
  <dt>Duration</dt><dd>6 hours 40 minutes</dd>
  <dt>Last updated</dt><dd>January 2026</dd>
  <dt>Includes</dt><dd>12 lessons, 4 exercises, a certificate</dd>
</dl>` },
      { name: "Stacked", note: "For a narrow rail, where even a short term column costs more than it explains.", html: `<dl class="ns-deflist ns-deflist--stack">
  <dt>Object</dt><dd>Opportunity</dd>
  <dt>Field</dt><dd>StageName</dd>
</dl>` },
    ],
  },
  {
    id: "timeline", title: "Timeline", family: "Progress & data",
    summary: "A vertical feed of things that happened: course activity, a changelog, a learner's history. Every entry is stamped with a mono time — the time is data, the title is writing.",
    use: ["Activity, history, audit trails, changelogs", "Reverse-chronological by convention"],
    not: ["A flow the reader is inside and can finish — that is Stepper", "A list they can act on — that is Curriculum or List", "Anything where every entry is 'current'"],
    a11y: ["An ordered list, because the order is the meaning", "data-state drives the dot; only the entry still happening takes the signal colour — a feed where every dot is brand blue has no emphasis at all", "Times are tabular-nums so a column of them aligns"],
    variants: [
      { name: "With icons", stack: true, note: "An icon in place of the dot, when the KIND of event matters as much as the fact of it. The icon sits on the surface so the rail appears to pass behind it.", html: `<ol class="ns-timeline ns-timeline--icons">
  <li class="ns-timeline__item" data-state="current"><span class="ns-timeline__icon" aria-hidden="true"><i class="ph ph-rocket-launch"></i></span><span class="ns-timeline__time">Today 09:14</span><div class="ns-timeline__title">Deployed v3.0.0</div></li>
  <li class="ns-timeline__item" data-state="done"><span class="ns-timeline__icon" aria-hidden="true"><i class="ph ph-check-circle"></i></span><span class="ns-timeline__time">12 Jan</span><div class="ns-timeline__title">Review approved</div></li>
  <li class="ns-timeline__item"><span class="ns-timeline__icon" aria-hidden="true"><i class="ph ph-chat-circle"></i></span><span class="ns-timeline__time">04 Jan</span><div class="ns-timeline__title">Comment from Priya</div></li>
</ol>` },
      { name: "Horizontal", stack: true, note: "A run of milestones on one rail. Scrolls rather than wraps — a wrapped timeline stops being a timeline. Takes a time and a title, nothing longer.", html: `<ol class="ns-timeline ns-timeline--horizontal">
  <li class="ns-timeline__item" data-state="done"><span class="ns-timeline__dot" aria-hidden="true"></span><span class="ns-timeline__time">Q1</span><div class="ns-timeline__title">Admin track live</div></li>
  <li class="ns-timeline__item" data-state="done"><span class="ns-timeline__dot" aria-hidden="true"></span><span class="ns-timeline__time">Q2</span><div class="ns-timeline__title">Developer track</div></li>
  <li class="ns-timeline__item" data-state="current"><span class="ns-timeline__dot" aria-hidden="true"></span><span class="ns-timeline__time">Q3</span><div class="ns-timeline__title">Certification prep</div></li>
  <li class="ns-timeline__item"><span class="ns-timeline__dot" aria-hidden="true"></span><span class="ns-timeline__time">Q4</span><div class="ns-timeline__title">Architect track</div></li>
</ol>` },
      { name: "Activity", html: `<ol class="ns-timeline">
  <li class="ns-timeline__item" data-state="current">
    <span class="ns-timeline__dot" aria-hidden="true"></span>
    <span class="ns-timeline__time">Today 09:14</span>
    <div class="ns-timeline__title">Started “Testing Apex”</div>
    <p class="ns-timeline__text">Lesson 1 of 6.</p>
  </li>
  <li class="ns-timeline__item" data-state="done">
    <span class="ns-timeline__dot" aria-hidden="true"></span>
    <span class="ns-timeline__time">12 Jan 16:02</span>
    <div class="ns-timeline__title">Completed “Apex triggers in depth”</div>
    <p class="ns-timeline__text">Certificate issued.</p>
  </li>
  <li class="ns-timeline__item">
    <span class="ns-timeline__dot" aria-hidden="true"></span>
    <span class="ns-timeline__time">04 Jan 11:30</span>
    <div class="ns-timeline__title">Enrolled</div>
  </li>
</ol>` },
    ],
  },
  {
    id: "tree", title: "Tree", family: "Navigation",
    summary: "Nested, expandable structure — a metadata explorer, a repo of examples, nested categories. Every branch is a native <code>&lt;details&gt;</code>, so the component ships no JS at all.",
    use: ["Hierarchy the reader browses rather than searches", "Two or three levels; a file or metadata explorer"],
    not: ["Flat navigation — use Docs sidebar", "Deeper than three levels — the indent eats the label and it wants to be a search box", "A curriculum — that has its own component with progress"],
    a11y: ["Open/closed state, keyboard operation and in-page find all come from &lt;details&gt;", "aria-current marks the active node — one attribute for both the highlight and the announcement", "Indentation is padding on the nested list, so a node's hover and focus ring still span the full rail; an indented hit area that starts 2rem in is one people miss"],
    variants: [
      { name: "Metadata explorer", html: `<ul class="ns-tree">
  <li><details class="ns-tree__branch" open>
    <summary><i class="ph ph-caret-right ns-tree__twist" aria-hidden="true"></i><i class="ph ph-folder-open ns-tree__icon" aria-hidden="true"></i><span class="ns-tree__label">objects</span><span class="ns-tree__meta">3</span></summary>
    <ul>
      <li><a class="ns-tree__node" href="#0" aria-current="true"><i class="ph ph-file-text ns-tree__icon" aria-hidden="true"></i><span class="ns-tree__label">Opportunity.object</span></a></li>
      <li><a class="ns-tree__node" href="#0"><i class="ph ph-file-text ns-tree__icon" aria-hidden="true"></i><span class="ns-tree__label">Account.object</span></a></li>
    </ul>
  </details></li>
  <li><details class="ns-tree__branch">
    <summary><i class="ph ph-caret-right ns-tree__twist" aria-hidden="true"></i><i class="ph ph-folder-open ns-tree__icon" aria-hidden="true"></i><span class="ns-tree__label">classes</span><span class="ns-tree__meta">12</span></summary>
    <ul><li><a class="ns-tree__node" href="#0"><i class="ph ph-brackets-curly ns-tree__icon" aria-hidden="true"></i><span class="ns-tree__label">GreetingService.cls</span></a></li></ul>
  </details></li>
</ul>` },
    ],
  },
  {
    id: "banner", title: "Banner", family: "Feedback",
    summary: "An <em>app-level</em> notice: trial ending, scheduled maintenance, “you are viewing a draft”. Full-bleed, above the content, persistent until dismissed.",
    use: ["Something true regardless of which page the reader is on", "State that stays true until something external changes it"],
    not: ["Feedback about a form or a lesson — that is an Alert, inline and next to the thing", "Confirming an action just taken — that is a Toast", "Two at once: stacked banners is a product telling the reader it has lost track of what matters"],
    a11y: ["Not a live region — it is present on load, so announcing it would interrupt", "The action is a link because a banner's action always goes somewhere (billing, the schedule, the published version)", "Dismiss has a real accessible name"],
    variants: [
      { name: "Info and warning", note: "Status recolours the leading EDGE, not the whole strip. A full-width warning wash is the loudest thing a page can do, and this is ambient information.", html: `<div class="ns-banner ns-banner--info">
  <i class="ph ph-info ns-banner__icon" aria-hidden="true"></i>
  <span class="ns-banner__text">You are viewing an unpublished draft.</span>
  <a class="ns-btn ns-btn--outline ns-btn--sm ns-banner__action" href="#0">View published</a>
  <button class="ns-banner__dismiss" type="button" aria-label="Dismiss"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>
<div class="ns-banner ns-banner--warning">
  <i class="ph ph-warning ns-banner__icon" aria-hidden="true"></i>
  <span class="ns-banner__text">Scheduled maintenance on 14 September, 02:00–04:00 UTC.</span>
  <button class="ns-banner__dismiss" type="button" aria-label="Dismiss"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>
<div class="ns-banner ns-banner--error">
  <i class="ph ph-warning-circle ns-banner__icon" aria-hidden="true"></i>
  <span class="ns-banner__text">Your subscription payment failed. Access ends on 21 September.</span>
  <a class="ns-btn ns-btn--outline ns-btn--sm ns-banner__action" href="#0">Update card</a>
</div>
<div class="ns-banner ns-banner--success">
  <i class="ph ph-check-circle ns-banner__icon" aria-hidden="true"></i>
  <span class="ns-banner__text">Your certificate for Platform Developer I is ready.</span>
  <a class="ns-btn ns-btn--outline ns-btn--sm ns-banner__action" href="#0">Download</a>
  <button class="ns-banner__dismiss" type="button" aria-label="Dismiss"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>` },
      { name: "Dark", dark: true, html: `<div class="ns-banner ns-banner--dark">
  <i class="ph ph-megaphone ns-banner__icon" aria-hidden="true"></i>
  <span class="ns-banner__text">New: the Apex testing track is live.</span>
  <a class="ns-btn ns-btn--primary ns-btn--sm ns-banner__action" href="#0">Start</a>
</div>` },
    ],
  },
  {
    id: "track", title: "Track", family: "Training",
    summary: "The header of a curriculum: what it is, and how far in you are. Progress is over <strong>modules</strong>, not units — a learner thinks in “3 of 8 modules”, and a percentage over 60 units is a number nobody can act on.",
    use: ["The top of a training track — Salesforce Administrator, Developer", "Where the reader decides whether to start or resume"],
    not: ["A course — a course is a playlist and uses Course hero", "A single module's page — that is Module head"],
    a11y: ["The stat figures are real text, so the numbers are selectable and announced", "Mono numerals are tabular so the stat row does not jitter as values change"],
    variants: [
      { name: "Track header", stack: true, html: `<header class="ns-track">
  <div class="ns-track__body">
    <span class="ns-track__kicker">// Training track</span>
    <h1 class="ns-track__title">Salesforce Administrator</h1>
    <p class="ns-track__lede">Everything an admin is expected to know, in the order the platform actually teaches it — objects and fields before automation, security before sharing.</p>
  </div>
  <div class="ns-track__meta">
    <div class="ns-track__stat"><b>3/8</b>Modules</div>
    <div class="ns-track__stat"><b>62%</b>Complete</div>
    <div class="ns-track__stat"><b>14h</b>Remaining</div>
  </div>
</header>` },
    ],
  },
  {
    id: "modules", title: "Connected modules", family: "Training",
    summary: "The spine of a track. Modules hang off a vertical rail with a node each, so the eye reads <em>dependency and progress in one pass</em> — a flat list of cards would say these are alternatives, which is a lie about the content.",
    use: ["The body of a track page", "Any curriculum where one unit earns the next"],
    not: ["A course curriculum — that is a playlist, and Curriculum renders it as a list because a playlist IS a list", "Unordered collections — if the order does not matter, the spine is a false claim"],
    a11y: ["An ordered list, because the sequence is the meaning", "data-state carries done / current / locked; locked dims the whole row so the reader sees it is unreachable rather than discovering it on click", "Locked modules are not links — an unreachable link is a trap"],
    variants: [
      { name: "A track's modules", stack: true, html: `<ol class="ns-modules">
  <li class="ns-module" data-state="done">
    <span class="ns-module__node" aria-hidden="true"><i class="ph ph-check-circle"></i></span>
    <a class="ns-module__card" href="#0">
      <div class="ns-module__head"><span class="ns-module__title">Objects, fields and relationships</span><span class="ns-module__meta">6 units · 2h</span></div>
      <p class="ns-module__text">The data model first: everything else on the platform is a consequence of it.</p>
    </a>
  </li>
  <li class="ns-module" data-state="current">
    <span class="ns-module__node" aria-hidden="true">02</span>
    <a class="ns-module__card" href="#0">
      <div class="ns-module__head"><span class="ns-module__title">Security and access</span><span class="ns-module__meta">8 units · 3h</span></div>
      <p class="ns-module__text">Profiles, permission sets, roles and sharing — in that order, because each one only makes sense given the last.</p>
      <ul class="ns-units">
        <li class="ns-unit" data-state="done"><i class="ph ph-check-circle ns-unit__check" aria-hidden="true"></i><span class="ns-unit__title">Profiles vs permission sets</span><span class="ns-unit__type">Reading</span><span class="ns-unit__time">12 min</span></li>
        <li class="ns-unit"><i class="ph ph-circle ns-unit__check" aria-hidden="true"></i><span class="ns-unit__title">The role hierarchy</span><span class="ns-unit__type">Video</span><span class="ns-unit__time">18 min</span></li>
        <li class="ns-unit"><i class="ph ph-circle ns-unit__check" aria-hidden="true"></i><span class="ns-unit__title">Sharing rules in practice</span><span class="ns-unit__type">Exercise</span><span class="ns-unit__time">25 min</span></li>
      </ul>
    </a>
  </li>
  <li class="ns-module" data-state="locked">
    <span class="ns-module__node" aria-hidden="true">03</span>
    <div class="ns-module__card">
      <div class="ns-module__head"><span class="ns-module__title">Automation: Flow</span><span class="ns-module__meta">9 units · 4h</span></div>
      <p class="ns-module__text">Finish Security and access to unlock.</p>
    </div>
  </li>
</ol>` },
    ],
  },
  {
    id: "trainingnav", title: "Training nav", family: "Training",
    summary: "The curriculum rail: track → module → unit, as nested <code>&lt;details&gt;</code>. On load it opens the module holding the current unit, closes the rest, and scrolls it into view <em>inside the rail</em>.",
    use: ["Any track or module page", "Curricula long enough that scrolling to find your place is the main cost"],
    not: ["Flat documentation — use Docs sidebar", "A course player — that has its own rail with a playlist"],
    a11y: ["Open/closed, keyboard operation and in-page find all come from &lt;details&gt;", "aria-current=\"page\" marks the unit AND is what the script reads to decide which module to open — one attribute, so highlight and announcement cannot drift", "Progressive: the markup ships every module <code>open</code>, so with JS off nothing is hidden — the rail is only longer", "Once the reader opens a module themselves the script stops managing state; a nav that re-collapses what you just opened is fighting you"],
    variants: [
      { name: "Rail with the current module open", stack: true, html: `<nav class="ns-trainingnav" data-ns-trainingnav aria-label="Curriculum" style="position:static;max-block-size:22rem;inline-size:100%">
  <a class="ns-trainingnav__track" href="#0">Salesforce Administrator</a>
  <details class="ns-trainingnav__module" open>
    <summary><i class="ph ph-caret-right ns-trainingnav__twist" aria-hidden="true"></i>Objects and fields<span class="ns-trainingnav__count">6</span></summary>
    <ul class="ns-trainingnav__list">
      <li><a class="ns-trainingnav__link" data-state="done" href="#0">Standard vs custom objects</a></li>
      <li><a class="ns-trainingnav__link" data-state="done" href="#0">Field types</a></li>
    </ul>
  </details>
  <details class="ns-trainingnav__module" open>
    <summary><i class="ph ph-caret-right ns-trainingnav__twist" aria-hidden="true"></i>Security and access<span class="ns-trainingnav__count">8</span></summary>
    <ul class="ns-trainingnav__list">
      <li><a class="ns-trainingnav__link" data-state="done" href="#0">Profiles vs permission sets</a></li>
      <li><a class="ns-trainingnav__link" href="#0" aria-current="page">The role hierarchy</a></li>
      <li><a class="ns-trainingnav__link" href="#0">Sharing rules in practice</a></li>
    </ul>
  </details>
  <details class="ns-trainingnav__module" open>
    <summary><i class="ph ph-caret-right ns-trainingnav__twist" aria-hidden="true"></i>Automation: Flow<span class="ns-trainingnav__count">9</span></summary>
    <ul class="ns-trainingnav__list"><li><a class="ns-trainingnav__link" href="#0">Record-triggered flows</a></li></ul>
  </details>
</nav>` },
      { name: "Modules, sections and posts", note: "THE STRUCTURAL DIFFERENCE BETWEEN TRAINING AND A COURSE. A course is a flat list of lessons; a training module is a body of writing with parts, so its posts group under section labels. One sidebar, three levels — track → module → section → post. Any deeper and it is a file tree, which is what this is designed not to be. Every row carries its kind as an icon, with the word on hover or focus.", html: `<nav class="ns-trainingnav" style="position:static;max-block-size:none;inline-size:100%;max-inline-size:19rem" aria-label="Training">
  <a class="ns-trainingnav__track" href="#0">// Admin track</a>
  <details class="ns-trainingnav__module" open>
    <summary>
      <i class="ph ph-caret-right ns-trainingnav__twist" aria-hidden="true"></i>
      <span>Security and access</span>
      <span class="ns-trainingnav__count">4</span>
    </summary>
    <div class="ns-trainingnav__bar"><progress class="ns-progress" value="2" max="4" aria-label="2 of 4 posts read"></progress></div>
    <p class="ns-trainingnav__section">Concepts</p>
    <ul class="ns-trainingnav__list">
      <li><a class="ns-trainingnav__link" href="#0" data-state="done">
        <i class="ph ph-article ns-trainingnav__icon" aria-hidden="true"></i>
        <span>The permission set model</span><span class="ns-trainingnav__time">9m</span></a></li>
      <li><a class="ns-trainingnav__link" href="#0" aria-current="page">
        <i class="ph ph-video ns-trainingnav__icon" aria-hidden="true"></i>
        <span>The role hierarchy</span><span class="ns-trainingnav__time">14m</span></a></li>
    </ul>
    <p class="ns-trainingnav__section">Practice</p>
    <ul class="ns-trainingnav__list">
      <li><a class="ns-trainingnav__link" href="#0">
        <i class="ph ph-flask ns-trainingnav__icon" aria-hidden="true"></i>
        <span>Build a sharing rule</span><span class="ns-trainingnav__time">22m</span></a></li>
      <li><a class="ns-trainingnav__link" href="#0">
        <i class="ph ph-exam ns-trainingnav__icon" aria-hidden="true"></i>
        <span>Check what you know</span><span class="ns-trainingnav__time">6q</span></a></li>
    </ul>
  </details>
  <details class="ns-trainingnav__module">
    <summary>
      <i class="ph ph-caret-right ns-trainingnav__twist" aria-hidden="true"></i>
      <span>Automation</span>
      <span class="ns-trainingnav__count">6</span>
    </summary>
    <ul class="ns-trainingnav__list">
      <li><a class="ns-trainingnav__link" href="#0"><i class="ph ph-video ns-trainingnav__icon" aria-hidden="true"></i><span>Record-triggered flow</span><span class="ns-trainingnav__time">16m</span></a></li>
    </ul>
  </details>
</nav>` },
    ],
  },
  {
    id: "modulehead", title: "Module head", family: "Training",
    summary: "The header of a single module's page: which module of how many, its title, and what it covers.",
    use: ["The top of a module page, above its units"],
    not: ["The track page — that is Track", "A lesson — units inside a module use the unit row"],
    a11y: ["The crumb states position in words (“Module 2 of 8”), not just a number, so it is meaningful read aloud out of context"],
    variants: [
      { name: "Module head", stack: true, html: `<header class="ns-modulehead">
  <span class="ns-modulehead__crumb">Salesforce Administrator · Module 2 of 8</span>
  <h1 class="ns-modulehead__title">Security and access</h1>
  <p class="ns-modulehead__lede">Profiles, permission sets, roles and sharing — in that order, because each one only makes sense given the last.</p>
</header>` },
    ],
  },
  {
    id: "pace", title: "Pace planner", family: "Training",
    summary: "&ldquo;At 30 minutes a day you finish on 12 September.&rdquo; A track page states hours, modules and lessons — and none of those is the question the learner actually has. Forty-two hours is not a number anybody can convert into a decision. A date is.",
    use: ["The top of a track or course page, before the curriculum", "A track sidebar, where --inline keeps it to one row", "Anywhere the commitment is large enough that a learner hesitates"],
    not: ["A short course. &ldquo;At 30 minutes a day you finish tomorrow&rdquo; is noise", "A progress bar — this is a projection about the future, not a report on the past", "A slider. Three named options is a choice; a continuous control invites a precision this estimate does not have, which is why it composes <code>.ns-segmented</code>"],
    a11y: [
      "The control is a real radio group with a legend, so it is announced as one choice with three options rather than three unrelated buttons",
      "The date is text in a <code>&lt;time datetime&gt;</code>, not a rendered image or a bare string — it gets localised and it is readable out of context",
      "The meta line always states the assumption. A finish date with no stated pace is a promise rather than a projection, and the design does not let you ship one without it",
      "Tabular numerals, so the date does not reflow the block as it changes under the radio",
    ],
    variants: [
      { name: "On a track page", note: "The date is the loud thing and the hours are the small print — deliberately the reverse of how every course page does it. Change the pace and watch the date move.", script: `document.querySelectorAll('[data-pace]').forEach(function (el) {
  var out = el.querySelector('[data-pace-date]');
  var meta = el.querySelector('[data-pace-rate]');
  var hours = Number(el.getAttribute('data-pace'));
  function render(mins) {
    var days = Math.ceil((hours * 60) / mins);
    var d = new Date();
    d.setDate(d.getDate() + days);
    out.textContent = d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
    out.setAttribute('datetime', d.toISOString().slice(0, 10));
    meta.textContent = days + ' days at ' + (mins < 60 ? mins + ' min' : (mins / 60) + ' hr') + ' a day';
  }
  el.querySelectorAll('input[type=radio]').forEach(function (r) {
    r.addEventListener('change', function () { render(Number(r.value)); });
  });
  render(Number(el.querySelector('input[type=radio]:checked').value));
});`, html: `<div class="ns-pace" data-pace="42" style="max-inline-size:22rem;inline-size:100%">
  <span class="ns-pace__label">Finish by</span>
  <time class="ns-pace__date" data-pace-date>&mdash;</time>
  <span class="ns-pace__meta"><b data-pace-rate>&mdash;</b><span>42 hours &middot; 8 modules</span></span>
  <fieldset class="ns-pace__control" style="border:0;padding:0;margin:0">
    <legend class="ns-visually-hidden">How much time per day</legend>
    <div class="ns-segmented">
      <label class="ns-segmented__option"><input type="radio" name="pace-a" value="15"><span>15 min</span></label>
      <label class="ns-segmented__option"><input type="radio" name="pace-a" value="30" checked><span>30 min</span></label>
      <label class="ns-segmented__option"><input type="radio" name="pace-a" value="60"><span>1 hr</span></label>
    </div>
  </fieldset>
</div>` },
      { name: "Inline", note: "For a sidebar or a band where the page has already spent its vertical budget. Same parts, one row, smaller date.", script: `document.querySelectorAll('[data-pace-inline]').forEach(function (el) {
  var out = el.querySelector('[data-pace-date]');
  var meta = el.querySelector('[data-pace-rate]');
  var hours = Number(el.getAttribute('data-pace-inline'));
  function render(mins) {
    var days = Math.ceil((hours * 60) / mins);
    var d = new Date(); d.setDate(d.getDate() + days);
    out.textContent = d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
    out.setAttribute('datetime', d.toISOString().slice(0, 10));
    meta.textContent = days + ' days';
  }
  el.querySelectorAll('input[type=radio]').forEach(function (r) {
    r.addEventListener('change', function () { render(Number(r.value)); });
  });
  render(Number(el.querySelector('input[type=radio]:checked').value));
});`, html: `<div class="ns-pace ns-pace--inline" data-pace-inline="18" style="inline-size:100%">
  <div>
    <span class="ns-pace__label">Finish by</span>
    <time class="ns-pace__date" data-pace-date>&mdash;</time>
    <span class="ns-pace__meta"><b data-pace-rate>&mdash;</b><span>18 hours</span></span>
  </div>
  <fieldset class="ns-pace__control" style="border:0;padding:0;margin:0;max-inline-size:16rem">
    <legend class="ns-visually-hidden">How much time per day</legend>
    <div class="ns-segmented">
      <label class="ns-segmented__option"><input type="radio" name="pace-b" value="15"><span>15 min</span></label>
      <label class="ns-segmented__option"><input type="radio" name="pace-b" value="30" checked><span>30 min</span></label>
      <label class="ns-segmented__option"><input type="radio" name="pace-b" value="60"><span>1 hr</span></label>
    </div>
  </fieldset>
</div>` },
    ],
  },
  {
    id: "training-hero", title: "Training hero", family: "Training",
    summary: "The opener for a curriculum index. <code>.ns-hero</code>&rsquo;s sibling, not a copy: the extra job is the SEARCH, because a reader arriving at a 150-module curriculum has a question (&ldquo;sharing rules&rdquo;) far more often than they have a place to start.",
    use: ["The top of /training, once", "Any index whose size is the thing the reader has to be reassured about", "With the stats — a curriculum that will not say how big it is reads as smaller than it is"],
    not: ["A marketing page. Use .ns-hero: it has no search and does not owe the reader a module count", "A module page. .ns-modulehead is the in-content header", "Two per page"],
    a11y: [
      "The search is a real <code>&lt;form&gt;</code> around a real <code>&lt;input type=\"search\"&gt;</code> pointed at the site search, so it works with JS off and is announced as a search landmark",
      "The corner grids are drawn on <code>::before</code>/<code>::after</code> from <code>--color-grid</code> — decoration with no DOM, so nothing is read out and nothing shifts layout",
      "The art slot is <code>aria-hidden</code> in the template: it supports the headline, it does not add information",
      "Below lg the art moves BELOW the words and shrinks. A decorative panel that pushes the headline off the first screen has inverted its own job",
    ],
    variants: [
      { name: "With search and stats", flush: true, note: "Title, lede, actions, the search field, then the three numbers. The search is a full-width field UNDER the buttons rather than beside them, because it is the wider target and the one a returning reader goes straight to.", html: `<section class="ns-thero">
  <div class="ns-thero__inner">
    <div class="ns-thero__body">
      <span class="ns-kicker">Training</span>
      <h1 class="ns-thero__title">Every Salesforce skill, in the order you need it</h1>
      <p class="ns-thero__lede">150 modules, 900 posts, and a path through them. Most of it is free.</p>
      <div class="ns-thero__actions">
        <a class="ns-btn ns-btn--primary" href="#0">Start at the beginning</a>
        <a class="ns-btn" href="#0">Browse all modules</a>
      </div>
      <form class="ns-thero__search" role="search" action="#0">
        <div class="ns-input-wrap">
          <i class="ns-input-wrap__icon ph ph-magnifying-glass" aria-hidden="true"></i>
          <input class="ns-input" type="search" name="q" placeholder="Search 900 posts — try &ldquo;sharing rules&rdquo;" aria-label="Search the training">
        </div>
      </form>
      <div class="ns-thero__stats">
        <span><b>150</b>Modules</span>
        <span><b>900</b>Posts</span>
        <span><b>42h</b>Reading</span>
      </div>
    </div>
    <div class="ns-thero__art" aria-hidden="true">
      <div class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-graduation-cap"></i></div>
    </div>
  </div>
</section>` },
    ],
  },
  {
    id: "learning-path", title: "Learning path", family: "Training",
    summary: "Foundation &rarr; advanced &rarr; AI, as a numbered journey with real connectors. A level above the module spine: the stops are whole STAGES of a 100-module curriculum, and the reader is choosing where to <em>enter</em> rather than tracking where they are.",
    use: ["A curriculum index, as the centrepiece", "Three to five stops — more and the connector stops meaning anything", "When the stages are genuinely sequential"],
    not: ["One track's modules. That is <code>.ns-modules</code>, the connected spine — same idea, different altitude, and merging them would give one component two jobs", "A set of unordered categories: a connector between them claims an order that does not exist", "More than five stops"],
    a11y: [
      "The connector is a <code>::after</code> on each stop, so it is decoration with no DOM — a screen reader hears an ordered list of links, which is what this is",
      "The node number is real text, not a background image, so &ldquo;02&rdquo; is announced with its stop",
      "State lives on <code>data-state</code> (<code>done</code> / <code>current</code>), and done/current are also carried by the node's colour AND its position in the list — never colour alone",
      "Below lg it becomes a vertical timeline. Four cards side by side on a phone is four cards nobody can read and a connector that means nothing",
    ],
    variants: [
      { name: "Four stops", stack: true, note: "Stop 1 done, stop 2 current. The connector after a done stop turns green, so the completed run reads as one continuous line rather than four separate ticks.", html: `<ol class="ns-path" style="list-style:none;margin:0;padding:0">
  <li class="ns-path__stop" data-state="done">
    <span class="ns-path__node">01</span>
    <a class="ns-path__card" href="#0">
      <span class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-cube" aria-hidden="true"></i></span>
      <span class="ns-path__title">Foundations</span>
      <span class="ns-path__text">Objects, fields, relationships and the data model everything else sits on.</span>
      <span class="ns-path__meta"><span>18 modules</span><span>Free</span></span>
    </a>
  </li>
  <li class="ns-path__stop" data-state="current">
    <span class="ns-path__node">02</span>
    <a class="ns-path__card" href="#0">
      <span class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-flow-arrow" aria-hidden="true"></i></span>
      <span class="ns-path__title">Automation</span>
      <span class="ns-path__text">Flow, validation, approvals — and when to reach for code instead.</span>
      <span class="ns-path__meta"><span>24 modules</span><span>Free</span></span>
    </a>
  </li>
  <li class="ns-path__stop">
    <span class="ns-path__node">03</span>
    <a class="ns-path__card" href="#0">
      <span class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-code" aria-hidden="true"></i></span>
      <span class="ns-path__title">Development</span>
      <span class="ns-path__text">Apex, LWC, testing and the governor limits that shape all of it.</span>
      <span class="ns-path__meta"><span>31 modules</span><span>Mixed</span></span>
    </a>
  </li>
  <li class="ns-path__stop">
    <span class="ns-path__node">04</span>
    <a class="ns-path__card" href="#0">
      <span class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-sparkle" aria-hidden="true"></i></span>
      <span class="ns-path__title">AI on the platform</span>
      <span class="ns-path__text">Prompt templates, grounding, and what Agentforce actually does.</span>
      <span class="ns-path__meta"><span>12 modules</span><span>Pro</span></span>
    </a>
  </li>
</ol>` },
    ],
  },
  {
    id: "tiers", title: "Free vs Pro", family: "Training",
    summary: "The page has to answer &ldquo;what do I get for nothing&rdquo; before it asks for anything. Two columns, both concrete, <strong>the free one first</strong> — leading with the paid column reads as a price list, and the honest claim here is that most of the training is open.",
    use: ["Once per page, near the curriculum it describes", "Exactly two columns", "When both columns can be stated concretely"],
    not: ["Three or four tiers — that is a pricing page, and it belongs on one", "Leading with Pro", "A feature matrix. Two short lists the reader finishes; a 30-row table is one they scroll past"],
    a11y: [
      "The Pro column is marked by its leading edge — the system's standing &ldquo;this one&rdquo; device — not by a fill, a shadow or a scale-up, so it survives forced-colours and does not rely on hue",
      "Each column's label is real text (<code>FREE</code> / <code>PRO</code>), so the distinction is announced and not inferred from a border",
      "The ticks are decorative <code>aria-hidden</code> icons; the item text carries the meaning",
      "Both columns are the same markup in the same order in the DOM as on screen",
    ],
    variants: [
      { name: "Free first", stack: true, note: "The free column carries no ornament at all. If it needed a badge to look like a real offer, it would not be one.", html: `<div class="ns-tiers">
  <div class="ns-tier">
    <span class="ns-tier__label">Free</span>
    <span class="ns-tier__title">The training</span>
    <span class="ns-tier__price">&pound;0 &middot; no account</span>
    <ul class="ns-tier__list">
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>120 of 150 modules, in full</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Every code sample and lab file</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Search across all 900 posts</span></li>
    </ul>
    <div class="ns-tier__foot"><a class="ns-btn" href="#0">Start reading</a></div>
  </div>
  <div class="ns-tier ns-tier--pro">
    <span class="ns-tier__label"><i class="ph ph-crown-simple" aria-hidden="true"></i>Pro</span>
    <span class="ns-tier__title">Everything, plus the hard parts</span>
    <span class="ns-tier__price">&pound;9 / month</span>
    <ul class="ns-tier__list">
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>The 30 architecture and AI modules</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Certification practice sets</span></li>
      <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Downloadable orgs for every lab</span></li>
    </ul>
    <div class="ns-tier__foot"><a class="ns-btn ns-btn--primary" href="#0">Go Pro</a></div>
  </div>
</div>` },
    ],
  },
  {
    id: "gate", title: "Content gate", family: "Training",
    summary: "A locked post shows the BEGINNING of the real thing rather than a wall. The mask is on the teaser, not an overlay on top of it, so the text underneath is genuinely truncated in the DOM rather than covered by a div a reader can delete in devtools.",
    use: ["A Pro post, below the fold of its own opening", "--inline inside a card or a rail", "Where the titles around it stay visible — a curriculum that hides its Pro posts cannot be evaluated before you pay for it"],
    not: ["An overlay over full content. That is not a gate, it is a paywall with the answer in the page source", "The top of a post. Let them start it", "A benefits list. A gate that lists nine things is a pricing page that appeared in the middle of a sentence"],
    a11y: [
      "The teaser is really truncated: the gated text is not in the DOM at all, so a screen reader is not read content the page is refusing to show",
      "The mask is a <code>mask-image</code> alpha ramp on the teaser, so it fades to the page whatever the surface colour is and inverts correctly in dark mode",
      "The panel is ordinary flow content with a real link — it is reachable by keyboard in reading order, immediately after the text it interrupts",
      "One primary action. A gate with three competing buttons is a decision the reader will not make",
    ],
    variants: [
      { name: "On a post", stack: true, note: "Real content, faded under the mask, then one panel with one action and one line of what you get.", html: `<div class="ns-gate">
  <div class="ns-gate__teaser">
    <div class="ns-prose">
      <h2>Why the sharing model bites here</h2>
      <p>Role hierarchy grants access upward, and that is the part everyone remembers. The part that causes the incident is what happens when a record is reparented: the recalculation is asynchronous, it is queued behind every other recalculation in the org, and until it finishes the old sharing rows are still live.</p>
      <p>Which means a report run in that window is correct according to the database and wrong according to your compliance team. The fix is not a better sharing rule.</p>
    </div>
  </div>
  <div class="ns-gate__panel">
    <span class="ns-gate__icon"><i class="ph ph-crown-simple" aria-hidden="true"></i></span>
    <span class="ns-gate__title">The rest of this post is for Pro members</span>
    <span class="ns-gate__text">Nine more modules on the sharing model, including the recalculation timeline and how to test for it.</span>
    <a class="ns-btn ns-btn--primary" href="#0">Go Pro &mdash; &pound;9 / month</a>
    <span class="ns-gate__note">120 of 150 modules are free</span>
  </div>
</div>` },
      { name: "Inline", note: "The compact form, for a card or a rail rather than a page body: smaller icon, smaller title, tighter panel. Same parts — a second component here would drift.", html: `<div class="ns-gate ns-gate--inline" style="max-inline-size:20rem">
  <div class="ns-gate__panel">
    <span class="ns-gate__icon"><i class="ph ph-crown-simple" aria-hidden="true"></i></span>
    <span class="ns-gate__title">Pro module</span>
    <span class="ns-gate__text">Certification practice sets and the architecture track.</span>
    <a class="ns-btn ns-btn--primary ns-btn--sm" href="#0">Go Pro</a>
  </div>
</div>` },
    ],
  },
  {
    id: "training-people", title: "Contributors", family: "Training",
    summary: "Everyone who wrote a module. Distinct from the instructor block: that is a marketing bio for the one or two people who authored a course; this is a GRID of forty people who each wrote three posts, so it is a face, a name, a role and a count — not a paragraph each.",
    use: ["A curriculum's contributors page", "Anywhere the count of authors is itself the point", "As links to each person's posts"],
    not: ["One or two people. Use the instructor block and give them a paragraph", "A team page with bios — this row has no room for one and adding it breaks the grid", "Decoration. If the names do not link anywhere, leave them out"],
    a11y: [
      "Each card is one link wrapping the whole row, so there is one tab stop per person rather than three",
      "The avatar is decorative — the name beside it is the accessible text, so the image carries an empty alt",
      "The post count is a real number in text, tabular-figured so a column of them lines up",
      "Auto-fill grid at a 13rem minimum: it reflows to one column on a phone without a media query",
    ],
    variants: [
      { name: "Grid", stack: true, note: "Face, name, role, count. Four facts is what fits at this size, and the fourth is the one that says the curriculum is maintained.", html: `<div class="ns-people">
  <a class="ns-person" href="#0">
    <span class="ns-avatar ns-avatar--sm" aria-hidden="true">RK</span>
    <span class="ns-person__body">
      <span class="ns-person__name">Ravi Kulkarni</span>
      <span class="ns-person__role">Technical Architect</span>
    </span>
    <span class="ns-person__count">31</span>
  </a>
  <a class="ns-person" href="#0">
    <span class="ns-avatar ns-avatar--sm" aria-hidden="true">AM</span>
    <span class="ns-person__body">
      <span class="ns-person__name">Anita Menon</span>
      <span class="ns-person__role">Platform Developer</span>
    </span>
    <span class="ns-person__count">18</span>
  </a>
  <a class="ns-person" href="#0">
    <span class="ns-avatar ns-avatar--sm" aria-hidden="true">DN</span>
    <span class="ns-person__body">
      <span class="ns-person__name">Dev Nair</span>
      <span class="ns-person__role">Admin &amp; Ops</span>
    </span>
    <span class="ns-person__count">12</span>
  </a>
  <a class="ns-person" href="#0">
    <span class="ns-avatar ns-avatar--sm" aria-hidden="true">PJ</span>
    <span class="ns-person__body">
      <span class="ns-person__name">Priya Joshi</span>
      <span class="ns-person__role">Consultant</span>
    </span>
    <span class="ns-person__count">9</span>
  </a>
</div>` },
    ],
  },
  {
    id: "training-pager", title: "Training pager", family: "Training",
    summary: "Prev / next across a 900-post curriculum, where &ldquo;next&rdquo; frequently means <em>the first post of a different module</em>. So every direction carries its MODULE as well as its title — and where the next post is in another module, that is the more important of the two facts.",
    use: ["The foot of every training post", "With the module named above the title, always", "With aria-disabled at the two ends"],
    not: ["A blog post. <code>.ns-postnav</code> is the two-title version and has no module to name", "Numbered pagination — this is a sequence, not a set of pages", "Hiding the disabled end: a dead arrow at the last post of a 150-module curriculum reads as a bug, and so does a missing one"],
    a11y: [
      "<code>aria-disabled=\"true\"</code> plus <code>pointer-events: none</code> at the ends: the link stays in the DOM and is announced as unavailable, rather than vanishing and moving everything one place left",
      "The direction word (&ldquo;Previous&rdquo; / &ldquo;Next&rdquo;) is real text, not conveyed by the arrow glyph alone",
      "The arrows are <code>aria-hidden</code> — they repeat the direction word",
      "Below md the two collapse to one column in reading order, previous first",
    ],
    variants: [
      { name: "Across a module boundary", stack: true, note: "The next post is in a different module, so the module is set in the mono label voice above the title. Reading it, you know you are about to leave where you are.", html: `<nav class="ns-tpager" aria-label="Post navigation">
  <a class="ns-tpager__btn" href="#0">
    <span class="ns-tpager__dir"><i class="ph ph-arrow-left" aria-hidden="true"></i>Previous</span>
    <span class="ns-tpager__where">Sharing &amp; visibility</span>
    <span class="ns-tpager__title">Recalculation, and why it is asynchronous</span>
  </a>
  <a class="ns-tpager__btn ns-tpager__btn--next" href="#0">
    <span class="ns-tpager__dir">Next<i class="ph ph-arrow-right" aria-hidden="true"></i></span>
    <span class="ns-tpager__where">Apex fundamentals</span>
    <span class="ns-tpager__title">Governor limits as a budget</span>
  </a>
</nav>` },
      { name: "The last post", stack: true, note: "An end that says it is the end, dimmed and unclickable but still there.", html: `<nav class="ns-tpager" aria-label="Post navigation">
  <a class="ns-tpager__btn" href="#0">
    <span class="ns-tpager__dir"><i class="ph ph-arrow-left" aria-hidden="true"></i>Previous</span>
    <span class="ns-tpager__where">AI on the platform</span>
    <span class="ns-tpager__title">Grounding a prompt template</span>
  </a>
  <a class="ns-tpager__btn ns-tpager__btn--next" href="#0" aria-disabled="true">
    <span class="ns-tpager__dir">Next<i class="ph ph-arrow-right" aria-hidden="true"></i></span>
    <span class="ns-tpager__where">End of curriculum</span>
    <span class="ns-tpager__title">You have reached the last post</span>
  </a>
</nav>` },
    ],
  },
  {
    id: "training-position", title: "Curriculum position", family: "Training",
    summary: "&ldquo;Post 4 of 6 &middot; Module 12 of 150&rdquo;. Two numbers because they answer two different questions — how much of <em>this sitting</em> is left, and how much of <em>the whole thing</em> — and a reader working through a long curriculum asks both.",
    use: ["Under a training post's title, or in the rail head", "Both numbers, always", "Where the curriculum is large enough that the second number is reassuring rather than daunting"],
    not: ["A progress bar. This is a location, not an achievement", "One number — either alone answers half the question", "A course with eight lessons, where the second number is noise"],
    a11y: [
      "Plain text in reading order, so it is announced as a sentence rather than as two orphaned numbers",
      "Tabular figures, so the row does not reflow as the numbers change from post to post",
      "The separator is a decorative span at border colour — it is punctuation, and it is not read as content",
      "The current values are wrapped in <code>&lt;b&gt;</code> for the ink shift, which is emphasis the mono label voice cannot express by weight alone",
    ],
    variants: [
      { name: "Both numbers", note: "The local number first, because it is the one that decides whether the reader keeps going right now.", html: `<p class="ns-tposition">
  <span>Post <b>4</b> of <b>6</b></span>
  <span class="ns-tposition__sep">&middot;</span>
  <span>Module <b>12</b> of <b>150</b></span>
</p>` },
    ],
  },
  {
    id: "training-thumb", title: "Training thumbnail", family: "Training",
    summary: "The 16:9 image box shared by the path stop, the module card and the track card — because they are the same object at three sizes, and three implementations of an image box is three chances for one of them to letterbox differently.",
    use: ["Any training surface that shows an image", "--glyph where there is no artwork", "With a badge for a one-word state (Pro, New)"],
    not: ["A course card. That is <code>.ns-card__media</code>, which is the generic one", "A non-16:9 source without cropping it first", "Two badges. One corner, one fact"],
    a11y: [
      "A sunken ground and a fixed ratio, so a missing image is a quiet empty frame rather than a broken-image glyph or a collapsed row",
      "The <code>--glyph</code> fallback is a decorative icon on the hairline grid — cheaper than commissioning 200 thumbnails, and it never looks like a failure",
      "The badge is real text in the flow, not a background image, so &ldquo;Pro&rdquo; is announced with the item",
      "<code>object-fit: cover</code> on the image, so a wrongly-sized source crops rather than distorting a face",
    ],
    variants: [
      { name: "Glyph fallback and badge", note: "The default state for a module with no artwork yet, which is most of them for most of a curriculum's life.", html: `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(11rem,1fr));gap:var(--space-4)">
  <div class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-cube" aria-hidden="true"></i></div>
  <div class="ns-tthumb ns-tthumb--glyph">
    <i class="ph ph-flow-arrow" aria-hidden="true"></i>
    <span class="ns-tthumb__badge"><span class="ns-label">Pro</span></span>
  </div>
  <div class="ns-tthumb ns-tthumb--glyph"><i class="ph ph-code" aria-hidden="true"></i></div>
</div>` },
    ],
  },
  {
    id: "training-layout", title: "Training layout", family: "Training",
    summary: "The reading shell for a curriculum: the post at <strong>full width</strong>, the curriculum beside it on the trailing edge. The rail goes there — not on the leading edge like the course player — because a training post is a document you landed on, so the edge where the eye starts every line belongs to the writing, and the curriculum is the place you go <em>next</em>.",
    use: ["A training post, where the rail has 150 modules in it", "--doc for the document layout: content full width, curriculum on the trailing edge", "--fixed for the older two-column form with the rail sticky rather than pinned"],
    not: ["A short course. A rail that fits on screen does not need to scroll on its own", "A marketing page", "A third column of in-page outline — a post carries its structure in its headings, and that column cost the tables, code and video stage the width they actually needed"],
    a11y: [
      "The reading column keeps its measure INSIDE the scrolling cell, so the scrollbar stays at the edge of the screen and the text stays at the measure",
      "Every section of a module opens with its own OVERVIEW row — the page that introduces the section before its posts — set apart by a quieter icon and no time, since &ldquo;how long is the introduction&rdquo; is not a question anybody has",
      "Each level of the rail carries a mark: a tile on the track, a glyph on the module, an icon on the section divider, a KIND icon on the post",
      "Below lg the rail becomes a drawer from the TRAILING edge — the edge its column lives on — closed by the ✕, the scrim and Escape",
      "The drawer's slide is dropped under prefers-reduced-motion; the rail still opens, it just arrives",
    ],
    variants: [
      { name: "The post head", stack: true, note: "What a training post opens with. The old head was a crumb, a title, a lede and a rule — correct, and completely silent about the three things a reader wants before committing eleven minutes: what KIND of post this is, how long, and where it sits. Every chip is a fact they were otherwise going to infer from the body, and the kind chip is the only one allowed to carry brand.", html: `<header class="ns-modulehead">
  <p class="ns-modulehead__crumb">
    <a href="#0"><i class="ph ph-graduation-cap" aria-hidden="true"></i> Training</a>
    <i class="ph ph-caret-right" aria-hidden="true"></i>
    <a href="#0">Security and access</a>
  </p>
  <h1 class="ns-modulehead__title">Recalculation is asynchronous</h1>
  <p class="ns-modulehead__lede">Role hierarchy grants access upward, and that is the part everyone remembers. The part that causes the incident is what happens when a record moves.</p>
  <div class="ns-tmeta">
    <span class="ns-tmeta__item ns-tmeta__item--kind"><i class="ph ph-video" aria-hidden="true"></i>Video + notes</span>
    <span class="ns-tmeta__item"><i class="ph ph-clock" aria-hidden="true"></i>11 min</span>
    <span class="ns-tmeta__item"><i class="ph ph-stack" aria-hidden="true"></i>Post 2 of 6</span>
    <span class="ns-tmeta__item"><i class="ph ph-barbell" aria-hidden="true"></i>Intermediate</span>
    <span class="ns-tmeta__item ns-tmeta__item--done"><i class="ph ph-check-circle" aria-hidden="true"></i>Read</span>
  </div>
</header>` },
      { name: "Video or article", stack: true, note: "A training post is one or the other, and the difference is <strong>one block</strong>: <code>.ns-tstage</code> at the top. A video post keeps the full written version underneath — a training video that is not also written is not searchable, not skimmable and not linkable to a line, which is why the bar carries a real anchor down to the text. Delete the stage and the same template is the article version; the styleguide proves it by rendering <a href=\"./demo-training-article.html\">both demos from one file</a>.", html: `<div class="ns-tstage">
  <div class="ns-video">
    <button class="ns-video__play" type="button" aria-label="Play"><i class="ph ph-play" aria-hidden="true"></i></button>
    <span class="ns-video__dur">11:04</span>
    <span class="ns-video__tag">Training</span>
  </div>
  <p class="ns-tstage__bar">
    <span><i class="ph ph-closed-captioning" aria-hidden="true"></i>Captions</span>
    <span><i class="ph ph-file-text" aria-hidden="true"></i>Transcript below</span>
    <a class="ns-btn ns-btn--sm ns-tstage__skip" href="#0"><i class="ph ph-arrow-down" aria-hidden="true"></i> Read instead</a>
  </p>
</div>` },
      { name: "Rail and reading column", flush: true, note: "Shown static here — <code>--fixed</code> pins both columns to the viewport height in a real page, which a documentation frame cannot show honestly. The three-column <code>--doc</code> form is best seen whole: <a href=\"./demo-training-post.html\">open the full-page demo</a>.", html: `<div class="ns-training" style="border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <nav class="ns-trainingnav" aria-label="Curriculum">
    <div class="ns-trainingnav__head">
      <div class="ns-trainingnav__search">
        <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
        <input class="ns-input" type="search" placeholder="Filter modules" aria-label="Filter modules">
        <button class="ns-btn ns-btn--icon ns-trainingnav__close" type="button" aria-label="Close curriculum"><i class="ph ph-x" aria-hidden="true"></i></button>
      </div>
      <p class="ns-trainingnav__result" role="status">150 modules</p>
    </div>
    <details class="ns-trainingnav__module" open>
      <summary><i class="ph ph-caret-right ns-trainingnav__twist" aria-hidden="true"></i>Sharing &amp; visibility<span class="ns-trainingnav__count">6</span></summary>
      <ul class="ns-trainingnav__list">
        <li><a class="ns-trainingnav__link" href="#0" data-state="done"><i class="ph ph-check-circle ns-trainingnav__icon" aria-hidden="true"></i>The sharing model, end to end<span class="ns-trainingnav__time">8 min</span></a></li>
        <li><a class="ns-trainingnav__link" href="#0" aria-current="page"><i class="ph ph-article ns-trainingnav__icon" aria-hidden="true"></i>Recalculation is asynchronous<span class="ns-trainingnav__time">11 min</span></a></li>
        <li><a class="ns-trainingnav__link" href="#0"><i class="ph ph-article ns-trainingnav__icon" aria-hidden="true"></i>Testing for the window<span class="ns-trainingnav__time">6 min</span></a></li>
      </ul>
    </details>
  </nav>
  <div class="ns-training__main">
    <div class="ns-training__reading">
      <header class="ns-modulehead">
        <p class="ns-modulehead__crumb"><a href="#0">Training</a> / <a href="#0">Sharing &amp; visibility</a></p>
        <h1 class="ns-modulehead__title">Recalculation is asynchronous</h1>
        <p class="ns-modulehead__lede">And the window between reparenting a record and the sharing rows catching up is where the incident lives.</p>
      </header>
      <div class="ns-prose">
        <p>Role hierarchy grants access upward, and that is the part everyone remembers. The part that causes the incident is what happens when a record is reparented.</p>
      </div>
    </div>
  </div>
  <div class="ns-training__scrim" data-ns-training-close></div>
</div>` },
    ],
  },
  {
    id: "motion", title: "Page motion", family: "Progress & data",
    summary: "Nine entrance animations, and a hard limit on what they are for. Principle&nbsp;5 governs <em>interaction</em> — 120–180ms, no bounce. Entrance is the one place a longer curve is allowed, because nobody is waiting on it: its job is to tell the eye what order to read a page in.",
    use: ["One entrance per BLOCK — a section, a card grid, a band", "--onview for content below the fold", "--stagger on a container whose children arrive together"],
    not: ["One animation per element — a page where twelve things fly in individually is a page nobody can read while it assembles", "Anything travelling further than half a rem; past that it reads as a slide deck", "Interaction feedback — a hover or a press is 120ms and lives on the component"],
    a11y: ["All nine are off under prefers-reduced-motion: the global guard in tokens/effects.css collapses every animation to 0.001ms, so none of these carries its own media query", "That is deliberate — a per-component opt-out is a per-component chance to forget", "Nothing here gates content: every element is readable if the animation never runs"],
    variants: [
      { name: "The nine", stack: true, note: "Reload the page to replay. rise is the workhorse; fall is only for things that belong to what is above them.", html: `<div class="ns-anim-stagger" style="display:grid;gap:var(--space-2)">
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">01 · fade</span><span class="ns-card__text">Already in place, just arrives.</span></div></div>
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">02 · rise</span><span class="ns-card__text">The workhorse — cards, sections, list blocks.</span></div></div>
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">03 · fall</span><span class="ns-card__text">Only for things belonging to what is above them.</span></div></div>
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">04/05 · enter-start / enter-end</span><span class="ns-card__text">Logical edges, so they flip in RTL.</span></div></div>
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">06 · expand</span><span class="ns-card__text">Uncovered rather than moved.</span></div></div>
</div>` },
      { name: "Individually", stack: true, html: `<div class="ns-anim ns-card"><div class="ns-card__body"><span class="ns-card__kicker">fade</span></div></div>
<div class="ns-anim ns-anim--rise ns-card"><div class="ns-card__body"><span class="ns-card__kicker">rise</span></div></div>
<div class="ns-anim ns-anim--fall ns-card"><div class="ns-card__body"><span class="ns-card__kicker">fall</span></div></div>
<div class="ns-anim ns-anim--enter-start ns-card"><div class="ns-card__body"><span class="ns-card__kicker">enter-start</span></div></div>
<div class="ns-anim ns-anim--enter-end ns-card"><div class="ns-card__body"><span class="ns-card__kicker">enter-end</span></div></div>
<div class="ns-anim ns-anim--expand ns-card"><div class="ns-card__body"><span class="ns-card__kicker">expand</span></div></div>
<div class="ns-anim ns-anim--settle ns-card"><div class="ns-card__body"><span class="ns-card__kicker">settle — scales DOWN onto the mark; scaling up is the pop P5 forbids</span></div></div>
<div><span class="ns-anim ns-anim--draw" style="display:block;block-size:2px;background:var(--color-brand-500)"></span><span class="ns-card__kicker">draw — the one animation slow enough to read as a gesture</span></div>` },
      { name: "Stagger, capped", stack: true, note: "40ms apart, capped at the fifth child. Past ~200ms of accumulated delay the last item feels broken rather than choreographed — every stagger that hurts is one that multiplied the index without a ceiling.", html: `<ul class="ns-anim-stagger ns-list">
  <li class="ns-list__row"><span class="ns-list__index">01</span><span class="ns-list__title">Arrives first</span></li>
  <li class="ns-list__row"><span class="ns-list__index">02</span><span class="ns-list__title">+40ms</span></li>
  <li class="ns-list__row"><span class="ns-list__index">03</span><span class="ns-list__title">+80ms</span></li>
  <li class="ns-list__row"><span class="ns-list__index">04</span><span class="ns-list__title">+120ms</span></li>
  <li class="ns-list__row"><span class="ns-list__index">05</span><span class="ns-list__title">+160ms</span></li>
  <li class="ns-list__row"><span class="ns-list__index">06</span><span class="ns-list__title">+200ms — and everything after</span></li>
  <li class="ns-list__row"><span class="ns-list__index">07</span><span class="ns-list__title">+200ms</span></li>
</ul>` },
      { name: "Rows with a second line", stack: true, note: "<code>.ns-list__text</code> is the muted line beside or under the title — what the row IS, where the title is what it is called. One line only: a list row that needs a paragraph is a card.", html: `<ul class="ns-list" style="max-inline-size:26rem">
  <li class="ns-list__row"><span class="ns-list__index">01</span><span class="ns-list__title">Objects and fields</span><span class="ns-list__text">The data model everything sits on</span></li>
  <li class="ns-list__row"><span class="ns-list__index">02</span><span class="ns-list__title">Relationships</span><span class="ns-list__text">Lookup, master-detail, and the cascade</span></li>
  <li class="ns-list__row"><span class="ns-list__index">03</span><span class="ns-list__title">Sharing</span><span class="ns-list__text">Who sees what, and when it recalculates</span></li>
</ul>` },
      { name: "Scroll-triggered", stack: true, note: "--onview uses native animation-timeline: view() — no observer, no JS. Where unsupported the declaration is dropped and it runs on load, which is visible either way.", html: `<div class="ns-anim ns-anim--rise ns-anim--onview ns-card"><div class="ns-card__body"><span class="ns-card__kicker">onview</span><span class="ns-card__text">Completes before the block is centred, so a fast scroll never shows content assembling.</span></div></div>` },
    ],
  },
  {
    id: "marquee", title: "Marquee", family: "Components",
    summary: "A continuously scrolling strip — logos, credentials, certifications. Two identical tracks translated 50%, which is the only implementation that loops without a visible seam.",
    use: ["Ambient content: partner logos, certifications, “now teaching”", "A band that needs motion without asking for attention"],
    not: ["Anything the reader NEEDS. It is infinite — look away and it is gone, with no way back", "Navigation or actions as the only route to them", "More than one per page: two strips moving at once is a fairground"],
    a11y: ["The duplicate track is aria-hidden, so nothing is announced twice — the second track is the wrap, not decoration", "Pauses on hover AND focus-within, so a keyboard user can reach a link inside it without chasing a moving target", "Stops entirely under prefers-reduced-motion via the global guard", "Speed is a distance-per-second, not a UI timing — Principle 5 governs response to input, and nothing here responds to anything"],
    variants: [
      { name: "Logos, windowed", stack: true, note: "--window fades both edges with a mask rather than clipping, so it reads as a view onto something longer. A mask works over any background; a gradient overlay would have to know the surface colour and would be wrong on a dark band.", html: `<div class="ns-marquee ns-marquee--window">
  <div class="ns-marquee__track">
    <a class="ns-marquee__item" href="#0">Acme Cloud</a><a class="ns-marquee__item" href="#0">Northwind</a><a class="ns-marquee__item" href="#0">Globex</a><a class="ns-marquee__item" href="#0">Initech</a><a class="ns-marquee__item" href="#0">Umbrella Ops</a>
  </div>
  <div class="ns-marquee__track" aria-hidden="true">
    <span class="ns-marquee__item">Acme Cloud</span><span class="ns-marquee__item">Northwind</span><span class="ns-marquee__item">Globex</span><span class="ns-marquee__item">Initech</span><span class="ns-marquee__item">Umbrella Ops</span>
  </div>
</div>` },
      { name: "Logo wall, fast", stack: true, note: "<code>.ns-marquee__logo</code> caps a real logo image at 1.5rem and holds it at 65% opacity until hover — a row of client marks at full strength competes with everything on the page, and a row of them at different heights reads as a mistake. <code>--fast</code> (22s) is for a short list: speed here is distance per second, so a four-item track at the default 40s looks stalled.", html: `<div class="ns-marquee ns-marquee--window ns-marquee--fast">
  <div class="ns-marquee__track">
    <a class="ns-marquee__item" href="#0"><img class="ns-marquee__logo" src="../assets/logo/favicon.svg" alt="Acme Cloud"></a>
    <a class="ns-marquee__item" href="#0"><img class="ns-marquee__logo" src="../assets/logo/favicon.svg" alt="Northwind"></a>
    <a class="ns-marquee__item" href="#0"><img class="ns-marquee__logo" src="../assets/logo/favicon.svg" alt="Globex"></a>
  </div>
  <div class="ns-marquee__track" aria-hidden="true">
    <span class="ns-marquee__item"><img class="ns-marquee__logo" src="../assets/logo/favicon.svg" alt=""></span>
    <span class="ns-marquee__item"><img class="ns-marquee__logo" src="../assets/logo/favicon.svg" alt=""></span>
    <span class="ns-marquee__item"><img class="ns-marquee__logo" src="../assets/logo/favicon.svg" alt=""></span>
  </div>
</div>` },
      { name: "Reverse and slow", stack: true, note: "A second strip running the other way is the one case for two — stacked, they read as a texture rather than a race.", html: `<div class="ns-marquee ns-marquee--window ns-marquee--slow ns-marquee--reverse">
  <div class="ns-marquee__track">
    <span class="ns-marquee__item">Administrator</span><span class="ns-marquee__item">Platform Developer I</span><span class="ns-marquee__item">Sales Cloud Consultant</span><span class="ns-marquee__item">Data Architect</span>
  </div>
  <div class="ns-marquee__track" aria-hidden="true">
    <span class="ns-marquee__item">Administrator</span><span class="ns-marquee__item">Platform Developer I</span><span class="ns-marquee__item">Sales Cloud Consultant</span><span class="ns-marquee__item">Data Architect</span>
  </div>
</div>` },
      { name: "Display scale", stack: true, dark: true, note: "The poster band. Type-fx's .ns-kinetic stays separate — that one is a typographic effect with its own outline treatment; this is the general-purpose strip.", html: `<div class="ns-marquee ns-marquee--window ns-marquee--display ns-marquee--tight">
  <div class="ns-marquee__track">
    <span class="ns-marquee__item">APEX</span><span class="ns-marquee__item ns-marquee__item--outline">LWC</span><span class="ns-marquee__item">FLOW</span><span class="ns-marquee__item ns-marquee__item--outline">SOQL</span>
  </div>
  <div class="ns-marquee__track" aria-hidden="true">
    <span class="ns-marquee__item">APEX</span><span class="ns-marquee__item ns-marquee__item--outline">LWC</span><span class="ns-marquee__item">FLOW</span><span class="ns-marquee__item ns-marquee__item--outline">SOQL</span>
  </div>
</div>` },
    ],
  },
  {
    id: "toc", title: "Table of contents", family: "Navigation",
    summary: "Where you are in a long piece. Its own module rather than a blog feature — a post, a lesson, a doc page and a training unit all need the same outline, and three copies is three places for the scroll-spy to drift.",
    use: ["Any prose over about four headings", "--inline or --float on narrow screens, where a sticky rail has nowhere to stick"],
    not: ["Three levels — a TOC that needs h4 is a TOC for a page that needs splitting", "Short pages: an outline of two items is longer than the shortcut it offers", "As the only navigation — it is an outline of one page, not a site map"],
    a11y: ["A real &lt;nav&gt; of real anchor links: it works with JS off, and the scroll-spy only adds [aria-current] on top", "[data-toc-from] builds the list from the article's own headings for a CMS that emits a body but no outline; a hand-authored TOC is left exactly as it is", "The progress bar is aria-hidden and never the only indicator — the marked link already says where you are"],
    variants: [
      { name: "Rail — the default", note: "The hairline is the rail and the active item takes the 2px brand edge, the same current-item device the navbar and lesson row use.", html: `<nav class="ns-toc" aria-label="On this page">
  <span class="ns-toc__title">On this page</span>
  <a class="ns-toc__link" href="#0" aria-current="true">What is Apex</a>
  <a class="ns-toc__link ns-toc__link--sub" href="#0">Governor limits</a>
  <a class="ns-toc__link ns-toc__link--sub" href="#0">Bulkification</a>
  <a class="ns-toc__link" href="#0">Testing</a>
</nav>` },
      { name: "Card, with reading progress", html: `<nav class="ns-toc ns-toc--card" aria-label="On this page" style="--ns-toc-progress:38%">
  <span class="ns-toc__progress" aria-hidden="true"></span>
  <span class="ns-toc__title">On this page</span>
  <a class="ns-toc__link" href="#0">What is Apex</a>
  <a class="ns-toc__link" href="#0" aria-current="true">Governor limits</a>
  <a class="ns-toc__link" href="#0">Testing</a>
</nav>` },
      { name: "Numbered", note: "For a procedure where the order IS the content. A CSS counter, so the numbers cannot get out of step with the list.", html: `<nav class="ns-toc ns-toc--numbered" aria-label="Steps">
  <a class="ns-toc__link" href="#0">Create the sandbox</a>
  <a class="ns-toc__link" href="#0" aria-current="true">Deploy metadata</a>
  <a class="ns-toc__link" href="#0">Run the test suite</a>
</nav>` },
      { name: "Inline — the mobile strip", stack: true, note: "Scrolls sideways rather than wrapping: a wrapped strip changes where the article starts depending on how many headings it has.", html: `<nav class="ns-toc ns-toc--inline" aria-label="On this page">
  <a class="ns-toc__link" href="#0" aria-current="true">What is Apex</a>
  <a class="ns-toc__link" href="#0">Governor limits</a>
  <a class="ns-toc__link" href="#0">Bulkification</a>
  <a class="ns-toc__link" href="#0">Testing</a>
</nav>` },
      { name: "Collapsible", stack: true, html: `<details class="ns-toc ns-toc--collapsible">
  <summary>On this page<i class="ph ph-caret-down" aria-hidden="true"></i></summary>
  <a class="ns-toc__link" href="#0" aria-current="true">What is Apex</a>
  <a class="ns-toc__link" href="#0">Governor limits</a>
</details>` },
      { name: "Float — the other mobile answer", stack: true, note: "In situ this is <code>position: fixed</code> at the bottom-right and the panel opens <em>upward</em>; the specimen is pinned in place and opened downward so it can be seen. Reach for it over <code>--collapsible</code> on a long reference page where the reader jumps around — a disclosure at the very top is four screens behind them by the time they want it. One or the other, never both: a page with two tables of contents has none.", html: `<details class="ns-toc ns-toc--float" open style="position:relative;inset:auto;margin-block-end:11rem">
  <summary>On this page<i class="ph ph-caret-down" aria-hidden="true"></i></summary>
  <div class="ns-toc--float__panel" style="inset-block:calc(100% + var(--space-2)) auto;inset-inline:0 auto">
    <a class="ns-toc__link" href="#0" aria-current="true">What is Apex</a>
    <a class="ns-toc__link" href="#0">Governor limits</a>
    <a class="ns-toc__link ns-toc__link--sub" href="#0">Counting the wrong thing</a>
    <a class="ns-toc__link" href="#0">Testing</a>
  </div>
</details>` },
    ],
  },
  {
    id: "takeaway", title: "Takeaway", family: "Content blocks",
    summary: "“In short” — the argument compressed. Near the top for a reader who will not finish, or at the end for one who did.",
    use: ["A long post whose thesis is worth stating on its own", "The summary a reader would screenshot"],
    not: ["A callout — that is an aside about the paragraph beside it; this is the whole argument said faster", "More than one per post"],
    a11y: ["A leading rule and a mono label rather than a tinted panel — it reads as a change of register, not a different kind of content"],
    variants: [
      { name: "In short", stack: true, html: `<aside class="ns-takeaway">
  <span class="ns-takeaway__label">In short</span>
  <p class="ns-takeaway__text">Profiles say what a user can do to an object. The role hierarchy and sharing rules say which records they can see. Almost every access bug is someone solving one half with the other half&rsquo;s tool.</p>
</aside>` },
    ],
  },
  {
    id: "statblock", title: "Stat block", family: "Content blocks",
    summary: "One number at display scale, with what it measures and where it came from. The source line is structural, not optional — a stat with no attribution visibly collides with the next paragraph.",
    use: ["A figure the argument turns on", "Benchmark results, survey findings, limits"],
    not: ["Several numbers — that is a Stat band or a Table", "A number you cannot source. The design will make that obvious, which is the point"],
    a11y: ["Tabular numerals, so a column of these aligns", "The figure and its label are separate elements, so the number is never read without its unit"],
    variants: [
      { name: "Inline", stack: true, html: `<figure class="ns-statblock">
  <span class="ns-statblock__figure">100</span>
  <div class="ns-statblock__body">
    <span class="ns-statblock__label">SOQL queries per synchronous transaction — the limit that shapes every trigger you will write.</span>
    <cite class="ns-statblock__source">Apex Developer Guide · Execution Governors</cite>
  </div>
</figure>` },
      { name: "Stacked", stack: true, html: `<figure class="ns-statblock ns-statblock--stack">
  <span class="ns-statblock__figure">6MB</span>
  <div class="ns-statblock__body">
    <span class="ns-statblock__label">Heap size in a synchronous transaction.</span>
    <cite class="ns-statblock__source">Apex Developer Guide</cite>
  </div>
</figure>` },
    ],
  },
  {
    id: "compare", title: "Compare", family: "Content blocks",
    summary: "Two options side by side — Flow vs Apex, profiles vs permission sets. The shape a technical post reaches for constantly and has to hand-build every time.",
    use: ["Two legitimate choices with different trade-offs", "--verdict when you ARE recommending one"],
    not: ["Do and don't — colouring one green and one red makes an editorial judgement the content may not be making. That is why this is neutral by default", "Three or more options — use a Table"],
    a11y: ["Each side has a real heading, so the comparison is navigable by heading rather than by reading order", "--verdict marks the recommendation with the same 2px brand edge used for every current-item in the system"],
    variants: [
      { name: "Neutral", stack: true, html: `<div class="ns-compare">
  <div class="ns-compare__side"><p class="ns-compare__title">Flow</p><ul><li>No deployment for small changes</li><li>Admins can maintain it</li><li>Harder to unit test</li></ul></div>
  <div class="ns-compare__side"><p class="ns-compare__title">Apex</p><ul><li>Real tests and version control</li><li>Handles bulk cleanly</li><li>Needs a developer</li></ul></div>
</div>` },
      { name: "With a verdict", stack: true, html: `<div class="ns-compare">
  <div class="ns-compare__side"><p class="ns-compare__title">Workflow rules</p><ul><li>Retired for new automation</li></ul></div>
  <div class="ns-compare__side ns-compare__side--verdict"><p class="ns-compare__title">Record-triggered flow</p><ul><li>The supported path</li><li>Before-save updates are fast</li></ul></div>
</div>` },
    ],
  },
  {
    id: "checklist", title: "Checklist", family: "Content blocks",
    summary: "Things to verify. Real checkboxes, disabled in an article — the reader is reading, not filling a form, and an enabled checkbox promises persistence the page cannot deliver.",
    use: ["Pre-flight checks before a deployment", "A lesson task list, where dropping `disabled` makes it interactive with no other change"],
    not: ["Ordered steps — that is Procedure", "A form"],
    a11y: ["data-state drives both the mark and the muted text, so completion is not colour alone", "In an article the marks are decorative and the text carries the meaning"],
    variants: [
      { name: "Pre-deployment", stack: true, html: `<ul class="ns-checklist">
  <li data-state="done"><i class="ph ph-check-circle ns-checklist__mark" aria-hidden="true"></i><span class="ns-checklist__text">All tests pass in the sandbox</span></li>
  <li data-state="done"><i class="ph ph-check-circle ns-checklist__mark" aria-hidden="true"></i><span class="ns-checklist__text">Code coverage above 75%</span></li>
  <li><i class="ph ph-circle ns-checklist__mark" aria-hidden="true"></i><span class="ns-checklist__text">Permission sets assigned in production</span></li>
  <li><i class="ph ph-circle ns-checklist__mark" aria-hidden="true"></i><span class="ns-checklist__text">Rollback plan written down</span></li>
</ul>` },
    ],
  },
  {
    id: "procedure", title: "Procedure", family: "Content blocks",
    summary: "Numbered steps for a how-to. A mono index in the margin with a connecting rail, so a step containing a code block does not push its own number out of alignment — the failure of every <code>list-style</code> version of this.",
    use: ["Setup guides, migrations, anything with an order", "Steps that contain code, images or callouts"],
    not: ["Unordered checks — that is Checklist", "A flow the reader is inside — that is Stepper"],
    a11y: ["A real ordered list; the visible numbers come from a CSS counter so they can never drift from the list order"],
    variants: [
      { name: "With a code step", stack: true, html: `<ol class="ns-procedure">
  <li><span class="ns-procedure__title">Authorise the org</span><p class="ns-card__text">Use the alias you will reference later.</p></li>
  <li><span class="ns-procedure__title">Retrieve the metadata</span><p class="ns-card__text">The number stays aligned even with a block below it.</p></li>
  <li><span class="ns-procedure__title">Run the tests</span><p class="ns-card__text">Local tests only, so a failure is yours.</p></li>
</ol>` },
    ],
  },
  {
    id: "terms", title: "Terms", family: "Content blocks",
    summary: "An inline glossary. Salesforce writing is dense with terms a newcomer has not met, and sending them to a separate glossary page loses them.",
    use: ["The first time a cluster of jargon appears", "Object and field names a reader will meet again"],
    not: ["A single definition — define that inline, in the sentence", "Long explanations — a term entry is a sentence"],
    a11y: ["A real &lt;dl&gt;, so the term/definition pairing is announced", "Stacks to one column below 48rem"],
    variants: [
      { name: "Glossary", stack: true, html: `<aside class="ns-terms">
  <span class="ns-terms__label">Terms in this section</span>
  <dl>
    <dt>Profile</dt><dd>What a user can do to an object — create, read, edit, delete.</dd>
    <dt>Permission set</dt><dd>Additive grants on top of a profile. Never subtractive.</dd>
    <dt>Role</dt><dd>Position in the hierarchy, which decides record visibility upward.</dd>
  </dl>
</aside>` },
    ],
  },
  {
    id: "related", title: "Related", family: "Content blocks",
    summary: "Further reading, placed where the tangent actually comes up rather than piled at the end — which is where links go to be ignored.",
    use: ["Mid-article, at the moment the reader might want the detour", "Linking a lesson from a post, or a post from a lesson"],
    not: ["A list of everything you have written", "The end of the article — the post footer already does that"],
    a11y: ["The kind (LESSON, DOC, POST) is text, so the destination type is announced rather than guessed from an icon"],
    variants: [
      { name: "Mid-article", stack: true, html: `<aside class="ns-related">
  <span class="ns-related__label">Related</span>
  <ul>
    <li><a href="#0"><span class="ns-related__kind">Lesson</span>Profiles vs permission sets</a></li>
    <li><a href="#0"><span class="ns-related__kind">Doc</span>Sharing rules reference</a></li>
  </ul>
</aside>` },
    ],
  },
  {
    id: "notice", title: "Notice", family: "Content blocks",
    summary: "The dated line at the top of a post that has changed since it was published. Technical writing rots — a post about a platform that ships three releases a year is wrong within eighteen months, and the reader has no way to know unless the page says so.",
    use: ["A post you have revised: what changed, and when", "--archive for a piece kept for its inbound links but no longer true"],
    not: ["A callout — that is an aside about the paragraph beside it; this is a statement about the whole document, so it spans the measure above the prose", "A correction. A correction is a sentence saying what was wrong, and it belongs in the text", "&ldquo;Recently updated&rdquo;. Either you have the date or you do not have the claim"],
    a11y: ["A real <code>&lt;time datetime&gt;</code>, so the date is machine-readable and gets localised rather than being a string that says August to everyone", "The amber on --archive is a border and a label colour, never the only signal: the word <em>Superseded</em> carries it"],
    variants: [
      { name: "Updated", stack: true, html: `<aside class="ns-notice">
  <i class="ph ph-clock-clockwise" aria-hidden="true"></i>
  <div>
    <time class="ns-notice__date" datetime="2026-08-12">Updated 12 August 2026</time>
    <p class="ns-notice__text">Rewritten for API v62. The <code>Database.Stateful</code> workaround in the original is no longer needed — batch context now survives the callout.</p>
  </div>
</aside>` },
      { name: "Superseded", stack: true, note: "Kept because other people linked to it. The reader deserves to know that before they act on it, not after.", html: `<aside class="ns-notice ns-notice--archive">
  <i class="ph ph-warning" aria-hidden="true"></i>
  <div>
    <time class="ns-notice__date" datetime="2024-03-01">Superseded &middot; March 2024</time>
    <p class="ns-notice__text">This describes the old Process Builder migration path. Start from <a href="#0">the Flow migration guide</a> instead.</p>
  </div>
</aside>` },
    ],
  },
  {
    id: "ghost-product", title: "Product card", family: "Content blocks",
    summary: "Koenig's product card: a thing being recommended, with a rating and a way to get it. Ghost ships this with its own default styling — a rounded, shadowed object that lands in a Namaste post like a visitor from another design system. This is the same card, rebuilt on the hairline.",
    use: ["A book, a tool or a course a post recommends", "A review that ends in a verdict the reader can act on", "Without the image — a recommendation with no cover should not render a grey hole"],
    not: ["A shop. Three product cards in a row is a catalogue, and a catalogue is a page, not a block", "Anything the publication sells itself — that is the members CTA", "A comparison. Two products side by side is <code>.ns-compare</code>"],
    a11y: [
      "The rating is stars <em>plus</em> the number, and the number is real text — five glyphs alone is a value nobody can read out, and &ldquo;star star star&rdquo; is not what a screen reader should say",
      "Empty stars are a different glyph, not a lighter colour, so the score survives grayscale and forced-colours",
      "The button is the only interactive thing in the card: one action, one tab stop",
      "Below md the media goes full width above the body rather than shrinking to a thumbnail",
    ],
    variants: [
      { name: "With cover", stack: true, html: `<div class="ns-product">
  <span class="ns-product__media ns-ph" aria-hidden="true"></span>
  <div class="ns-product__body">
    <span class="ns-product__title">Advanced Apex Patterns</span>
    <div class="ns-product__rating">
      <span class="ns-product__stars" aria-hidden="true"><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph-fill ph-star"></i><i class="ph ph-star"></i></span>
      <span class="ns-product__score">4.0 / 5 &middot; 218 ratings</span>
    </div>
    <p class="ns-product__text">The one book that treats governor limits as an architecture problem rather than a list of numbers to memorise. Chapter 4 is worth the price on its own.</p>
    <div class="ns-product__foot">
      <span class="ns-product__price">&pound;38</span>
      <a class="ns-btn ns-btn--primary ns-btn--sm" href="#0">Get the book</a>
    </div>
  </div>
</div>` },
      { name: "No cover", stack: true, note: "<code>:has()</code> drops the media column when there is no image, so the card reflows to one column instead of leaving an empty slot.", html: `<div class="ns-product">
  <div class="ns-product__body">
    <span class="ns-product__title">Salesforce CLI</span>
    <p class="ns-product__text">Free, first-party, and the thing every deployment lesson assumes you have installed.</p>
    <div class="ns-product__foot">
      <span class="ns-product__price">Free</span>
      <a class="ns-btn ns-btn--sm" href="#0">Install</a>
    </div>
  </div>
</div>` },
    ],
  },
  {
    id: "ghost-bookmark", title: "Bookmark card", family: "Content blocks",
    summary: "Koenig's bookmark card: a link, previewed. Ghost fetches the title, description, publisher and thumbnail; this restyles the result so an embedded link reads as a signpost in the hairline vocabulary rather than as a floating panel.",
    use: ["A source worth showing rather than footnoting", "A related post, mid-article", "A doc page the reader is about to need"],
    not: ["Every link in a post — an inline link the reader should follow now stays inline", "A stack of five. Two bookmarks in a row is a reading list, and a reading list is <code>.ns-related</code>", "A link with no preview data — that is a plain link"],
    a11y: [
      "The WHOLE card is one <code>&lt;a&gt;</code>. A bookmark with a separately clickable title and thumbnail is two tab stops to the same URL",
      "The publisher line carries a favicon because that is the fastest way a reader answers &ldquo;do I trust this domain&rdquo; — the domain text is there either way",
      "The excerpt is clamped to two lines: a bookmark is a signpost, and a four-line excerpt is the article arriving early",
      "Below md the thumbnail moves above the body with <code>order</code>, so the DOM order stays title-first",
    ],
    variants: [
      { name: "With thumbnail", stack: true, html: `<a class="ns-bookmark" href="#0">
  <span class="ns-bookmark__body">
    <span class="ns-bookmark__title">Record Access at Scale</span>
    <span class="ns-bookmark__text">How the sharing model is materialised, why recalculation is asynchronous, and what that means for an org mid-migration.</span>
    <span class="ns-bookmark__meta">
      <span class="ns-bookmark__icon" aria-hidden="true"></span>
      <span>architect.salesforce.com</span>
    </span>
  </span>
  <span class="ns-bookmark__media ns-ph" aria-hidden="true"></span>
</a>` },
      { name: "No thumbnail", stack: true, html: `<a class="ns-bookmark" href="#0">
  <span class="ns-bookmark__body">
    <span class="ns-bookmark__title">Defer Sharing Calculations</span>
    <span class="ns-bookmark__text">The admin-facing control for the same queue — and the reason a Friday org-chart tidy-up is not quick.</span>
    <span class="ns-bookmark__meta"><span class="ns-bookmark__icon" aria-hidden="true"></span><span>help.salesforce.com</span></span>
  </span>
</a>` },
    ],
  },
  {
    id: "ghost-file", title: "File card", family: "Content blocks",
    summary: "Koenig's file card: a download. The size and the extension are printed rather than hidden, because those two facts are what decide whether somebody taps a link on a phone — and Ghost already collects both.",
    use: ["A lab file, a cheat sheet, a sample org", "Anything the post asks the reader to open in another application"],
    not: ["An image — that is a figure", "A link to a page. A file card promises a download, and a reader who gets a web page instead has been lied to"],
    a11y: [
      "One link, wrapping the whole row, with the file name as its accessible text",
      "Size and type are real text in the mono voice, tabular-figured so a column of files lines up",
      "The glyph is decorative: the extension beside it carries the same fact in words",
    ],
    variants: [
      { name: "Download", stack: true, html: `<a class="ns-file" href="#0" download>
  <span class="ns-file__icon"><i class="ph ph-file-text" aria-hidden="true"></i></span>
  <span class="ns-file__body">
    <span class="ns-file__name">sharing-model-cheat-sheet.pdf</span>
    <span class="ns-file__meta"><span>PDF</span><span>412 KB</span><span>2 pages</span></span>
  </span>
  <span class="ns-btn ns-btn--outline ns-btn--sm ns-file__action"><i class="ph ph-download-simple" aria-hidden="true"></i> Download</span>
</a>` },
    ],
  },
  {
    id: "ghost-header", title: "Header card", family: "Content blocks",
    summary: "Koenig's header card: a full-width statement inside a post. It is the one block allowed to break the reading measure, because that <em>is</em> its job — it is a chapter break, not a paragraph.",
    use: ["The break between two halves of a long post", "The opening statement of a series instalment", "--dark for the one that closes a post"],
    not: ["More than one per post. Two chapter breaks in a 1,500-word article is a page that cannot decide what it is", "A heading — <code>&lt;h2&gt;</code> is a heading, and prose styles it", "Carrying the post's own title"],
    a11y: [
      "The title inside is a real heading at the right level for its place in the document — the card styles it, it does not replace it",
      "--dark uses the same console navy as a section band, so a header card in a post and a band on a marketing page are visibly one object",
      "Centred text is capped at <code>--measure-narrow</code>: centred lines are harder to return from, so they get a shorter measure, not the full one",
    ],
    variants: [
      { name: "On the page surface", stack: true, html: `<div class="ns-headercard">
  <span class="ns-headercard__kicker">Part two</span>
  <h2 class="ns-headercard__title">Now the part that breaks in production</h2>
  <p class="ns-headercard__text">Everything above holds in a quiet org. What follows is what happens when the queue is not empty.</p>
</div>` },
      { name: "Dark, with an action", stack: true, html: `<div class="ns-headercard ns-headercard--dark">
  <span class="ns-headercard__kicker">Keep going</span>
  <h2 class="ns-headercard__title">The sharing model, end to end</h2>
  <p class="ns-headercard__text">Nine more posts on recalculation, implicit access and the tests that catch them.</p>
  <div class="ns-headercard__actions">
    <a class="ns-btn ns-btn--white" href="#0">Open the module</a>
    <a class="ns-btn ns-btn--ghost" href="#0">Browse training</a>
  </div>
</div>` },
    ],
  },
  {
    id: "ghost-cta", title: "Members CTA", family: "Content blocks",
    summary: "Koenig's email-CTA card: the members prompt that interrupts a post. A leading-edge block rather than a boxed panel — it is an aside from the <em>publication</em> rather than part of the argument, so it uses the same device as the takeaway in the accent that means membership.",
    use: ["Once per post, after the first real section", "The point where a free reader has had enough value to believe the paid half exists"],
    not: ["The top of a post. Asking before giving is how a reader leaves", "Two per post", "A paywall — that is <code>.ns-gate</code>, and it has content behind it"],
    a11y: [
      "A real <code>&lt;form&gt;</code> with a real labelled <code>&lt;input type=\"email\"&gt;</code>, so autofill and password managers work",
      "The fine print is next to the button, not behind a link: a consent line the reader has to go and find is not consent",
      "The leading edge is the accent that means membership everywhere else in the system, so the block is recognisable before it is read",
    ],
    variants: [
      { name: "Subscribe", stack: true, html: `<div class="ns-cta-card">
  <span class="ns-cta-card__label"><i class="ph ph-envelope-simple" aria-hidden="true"></i>Get the next one</span>
  <p class="ns-cta-card__text">One post a week on the parts of the platform that bite. No course pitches, no digest, unsubscribe in one click.</p>
  <form class="ns-cta-card__form" action="#0">
    <label class="ns-visually-hidden" for="cta-email">Email address</label>
    <input class="ns-input" id="cta-email" type="email" name="email" placeholder="you@company.com" autocomplete="email">
    <button class="ns-btn ns-btn--primary" type="submit">Subscribe</button>
  </form>
  <span class="ns-cta-card__fine">1,482 readers &middot; no spam, ever</span>
</div>` },
    ],
  },
  {
    id: "refs", title: "References", family: "Content blocks",
    summary: "Numbered sources at the foot of a post, and the markers in the text that point at them. A link inside a sentence is a reference the reader must follow now or lose; a numbered marker is one they can finish the paragraph and then check.",
    use: ["A post that cites a release note, a governor limit and a doc page", "Any claim a reader might reasonably want to verify"],
    not: ["Every link in the post — an inline link the reader should follow now stays inline", "A generated list. A references list a script built is a references list nobody has read"],
    a11y: ["The marker is a real anchor to a real <code>id</code> and the entry links back, so it works with JS off and both directions are keyboard-reachable", "The visible link text is the source, never &ldquo;here&rdquo; — a screen reader's link list of six &ldquo;here&rdquo;s is unusable", "Tabular numerals and <code>vertical-align: super</code> rather than <code>&lt;sup&gt;</code> alone, so the marker never changes the line height of the paragraph it sits in"],
    variants: [
      { name: "Markers and list", stack: true, html: `<div class="ns-prose">
  <p>A synchronous transaction gets 100 SOQL queries<a class="ns-ref" id="r1-mark" href="#r1" aria-label="Reference 1">1</a> and 6&nbsp;MB of heap. Batch Apex raises the query limit but not the heap<a class="ns-ref" id="r2-mark" href="#r2" aria-label="Reference 2">2</a>.</p>
</div>
<section class="ns-refs">
  <span class="ns-refs__label">References</span>
  <ol>
    <li id="r1"><a href="#r1-mark">Apex Developer Guide — Execution Governors and Limits</a><span class="ns-refs__src">developer.salesforce.com/docs/atlas.en-us.apexcode.meta</span></li>
    <li id="r2"><a href="#r2-mark">Apex Developer Guide — Using Batch Apex</a><span class="ns-refs__src">developer.salesforce.com/docs/atlas.en-us.apexcode.meta</span></li>
  </ol>
</section>` },
    ],
  },
  {
    id: "certificate", title: "Certificate", family: "LMS",
    summary: "Proof of completion in the Salesforce register: the navy console ground, a hairline frame, mono for every piece of data, and a credential ID that can actually be verified.",
    use: ["Course and track completion", "An account page, a share card, a print"],
    not: ["A badge for finishing one lesson — a certificate that is cheap to earn is worth nothing to show", "A rendered image. See below"],
    a11y: ["The seal is aria-hidden and the verify URL is real text beside it — a credential whose only proof is a graphic proves nothing to anyone not looking at it", "It is a real document, not a picture of one: name, course, date and ID are TEXT, so they are selectable, translatable, searchable and readable by a screen reader. A PNG is none of those", "The credential ID is mono and prominent — it is the only part that proves anything, and treating it as small print says the opposite", "Container query units, so it scales inside an account card and when printed full width; a vw-based size would be wrong in one of them", "@media print inverts to ink-on-paper — the navy ground would empty a cartridge, and a certificate is meant to be printed"],
    variants: [
      { name: "Completion", html: `<div class="ns-certificate">
  <div class="ns-certificate__inner">
    <div class="ns-certificate__head">
      <img class="ns-certificate__mark" src="../assets/logo/favicon.svg" alt="">
      <span class="ns-certificate__issuer">Namaste Salesforce &middot; Authorised Training</span>
    </div>

    <div class="ns-certificate__body">
      <div class="ns-certificate__award">
        <span class="ns-certificate__kicker">// This certifies that</span>
        <span class="ns-certificate__name">Swarnil Singhai</span>
        <span class="ns-certificate__course">has successfully completed <strong>Salesforce Administrator</strong> &mdash; eight modules and 62 units covering the data model, security and sharing, declarative automation, and reporting &mdash; and demonstrated competence in the assessed exercises.</span>
        <div class="ns-certificate__tags">
          <span class="ns-certificate__tag">Track &middot; Administrator</span>
          <span class="ns-certificate__tag">Level &middot; Foundation</span>
          <span class="ns-certificate__tag">Assessed</span>
        </div>
      </div>
      <div class="ns-certificate__proof">
        <span class="ns-certificate__seal" aria-hidden="true"><i class="ph ph-seal-check"></i></span>
        <span class="ns-certificate__verify">Verify at<br>nmst.dev/v/0F3A91</span>
      </div>
    </div>

    <div class="ns-certificate__foot">
      <span class="ns-certificate__field">Issued<b>14 Aug 2026</b></span>
      <span class="ns-certificate__field">Valid to<b>14 Aug 2028</b></span>
      <span class="ns-certificate__field">Hours<b>41.5</b></span>
      <span class="ns-certificate__field">Score<b>92%</b></span>
      <span class="ns-certificate__sign">Swarnil Singhai<b>Lead Instructor</b></span>
      <span class="ns-certificate__field ns-certificate__id">Credential ID<b>NS-ADM-2026-0F3A91</b></span>
    </div>
  </div>
</div>` },
    ],
  },
  {
    id: "leaderboard", title: "Leaderboard", family: "Progress & data",
    summary: "Ranked standing for a cohort or a challenge. Mostly an exercise in restraint: a leaderboard is the one component in a learning product that can actively demotivate.",
    use: ["A cohort with a shared goal and a defined period", "Where the reader can see their own position"],
    not: ["A podium with gold, silver and bronze — rank is a mono number, which is what it is", "A top ten that cuts the reader off. If they are 340th, show them 340th", "Anything with no end date: a permanent ranking is a permanent judgement"],
    a11y: ["An ordered list, because the ordering is the entire content", "Movement is an arrow AND a number — colour is the third signal, never the first", "The reader's own row is aria-current and carries the same 2px brand edge as every other current-item in the system", "Scores are tabular-nums and end-aligned, which is the one thing a leaderboard has to get right"],
    variants: [
      { name: "Cohort standing", stack: true, note: "The top three get a stronger ink and nothing else. The reader's row is pinned below the gap rather than hidden.", html: `<ol class="ns-leaderboard">
  <li class="ns-leaderboard__row" data-rank="1"><span class="ns-leaderboard__rank">01</span><span class="ns-leaderboard__name">Priya Raghavan</span><span class="ns-leaderboard__meta">12 modules</span><span class="ns-leaderboard__score">4,820</span><span class="ns-leaderboard__move" data-dir="up">&uarr;2</span></li>
  <li class="ns-leaderboard__row" data-rank="2"><span class="ns-leaderboard__rank">02</span><span class="ns-leaderboard__name">Marcus Bell</span><span class="ns-leaderboard__meta">11 modules</span><span class="ns-leaderboard__score">4,610</span><span class="ns-leaderboard__move" data-dir="down">&darr;1</span></li>
  <li class="ns-leaderboard__row" data-rank="3"><span class="ns-leaderboard__rank">03</span><span class="ns-leaderboard__name">Aiko Tanaka</span><span class="ns-leaderboard__meta">11 modules</span><span class="ns-leaderboard__score">4,455</span><span class="ns-leaderboard__move">&mdash;</span></li>
  <li class="ns-leaderboard__gap">&middot; &middot; &middot;</li>
  <li class="ns-leaderboard__row" aria-current="true" data-rank="47"><span class="ns-leaderboard__rank">47</span><span class="ns-leaderboard__name">You</span><span class="ns-leaderboard__meta">6 modules</span><span class="ns-leaderboard__score">1,940</span><span class="ns-leaderboard__move" data-dir="up">&uarr;9</span></li>
</ol>` },
    ],
  },
  {
    id: "video-player", title: "Video player", family: "LMS",
    summary: "One themed control surface over three sources that are not alike: a self-hosted file, a Mux HLS stream, and a YouTube embed. The differences are documented rather than papered over.",
    use: ["Lesson video, wherever it is hosted", "Anywhere chapters matter as much as the video"],
    not: ["Background or decorative video — that is a poster with no controls", "Replacing the native controls when you have nothing to add: the browser's own player is good, and a worse copy of it is a regression"],
    a11y: ["The scrubber is a real &lt;input type=\"range\"&gt;: keyboard seeking, screen-reader announcement and touch behaviour all come free, and every div-based scrubber reimplements them worse", "Progressive: the markup contains a real &lt;video&gt; and the chapter list is server-rendered text, so with JS off the video plays in the browser's own controls and the chapters are still readable", "The playing chapter is aria-current — the highlighted row and the announced row are one thing", "YouTube's player is a cross-origin iframe and cannot be restyled. These controls DRIVE it via the IFrame API, which is why the chrome sits outside the frame: an overlay would sit on top of YouTube's own controls and fight them"],
    variants: [
      { name: "Self-hosted, with chapters", stack: true, note: "Chapters live BELOW the player as a real list, not hovering over it. A chapter list is content: it is how a reader decides whether to watch at all, it should be readable without playing, and it should be in the page for search. Hiding it inside the video is the common mistake.", html: `<div class="ns-vplayer" data-ns-video data-state="paused">
  <div class="ns-vplayer__stage">
    <video preload="metadata" playsinline></video>
    <button class="ns-vplayer__big" type="button" aria-label="Play"><i class="ph ph-play" aria-hidden="true"></i></button>
  </div>
  <div class="ns-vplayer__bar">
    <button class="ns-vplayer__btn" type="button" data-ns-video-play aria-label="Play"><i class="ph ph-play" aria-hidden="true"></i></button>
    <span class="ns-vplayer__time" data-ns-video-current>0:00</span>
    <input class="ns-vplayer__seek" type="range" min="0" max="100" value="0" aria-label="Seek">
    <span class="ns-vplayer__time" data-ns-video-duration>0:00</span>
    <details class="ns-vplayer__menu">
      <summary class="ns-vplayer__btn" aria-label="Settings"><i class="ph ph-gear-six" aria-hidden="true"></i></summary>
      <div class="ns-vplayer__panel" role="group" aria-label="Playback speed">
        <button class="ns-vplayer__opt" type="button" role="radio" aria-checked="false" data-rate="0.75">0.75&times;</button>
        <button class="ns-vplayer__opt" type="button" role="radio" aria-checked="true" data-rate="1">Normal</button>
        <button class="ns-vplayer__opt" type="button" role="radio" aria-checked="false" data-rate="1.5">1.5&times;</button>
        <button class="ns-vplayer__opt" type="button" role="radio" aria-checked="false" data-rate="2">2&times;</button>
      </div>
    </details>
  </div>
  <ol class="ns-vchapters">
    <li class="ns-vchapters__item" data-start="0" aria-current="true"><button class="ns-vchapters__btn" type="button"><span class="ns-vchapters__time">0:00</span><span class="ns-vchapters__title">What an org actually is</span></button></li>
    <li class="ns-vchapters__item" data-start="95"><button class="ns-vchapters__btn" type="button"><span class="ns-vchapters__time">1:35</span><span class="ns-vchapters__title">Objects, fields and records</span></button></li>
    <li class="ns-vchapters__item" data-start="240"><button class="ns-vchapters__btn" type="button"><span class="ns-vchapters__time">4:00</span><span class="ns-vchapters__title">Where metadata lives</span></button></li>
  </ol>
</div>` },
      { name: "Mux and YouTube", stack: true, note: "Same markup, one attribute different. Mux serves HLS: Safari plays it natively, and elsewhere the player uses window.Hls if you have loaded it — this system does not bundle hls.js, because it is 40KB+ and most pages never play a video. If neither is available the player says so rather than showing a dead frame.", html: `<!-- Mux -->
<div class="ns-vplayer" data-ns-video data-mux="PLAYBACK_ID" data-state="paused">
  <div class="ns-vplayer__stage"><video preload="metadata" playsinline></video></div>
  <div class="ns-vplayer__bar">
    <button class="ns-vplayer__btn" type="button" data-ns-video-play aria-label="Play"><i class="ph ph-play" aria-hidden="true"></i></button>
    <span class="ns-vplayer__time" data-ns-video-current>0:00</span>
    <input class="ns-vplayer__seek" type="range" min="0" max="100" value="0" aria-label="Seek">
    <span class="ns-vplayer__time" data-ns-video-duration>0:00</span>
  </div>
</div>

<!-- YouTube: the iframe is injected, and these controls drive it via the IFrame API -->
<div class="ns-vplayer" data-ns-video data-youtube="VIDEO_ID" data-title="Lesson 1" data-state="paused">
  <div class="ns-vplayer__stage"></div>
  <div class="ns-vplayer__bar">
    <button class="ns-vplayer__btn" type="button" data-ns-video-play aria-label="Play"><i class="ph ph-play" aria-hidden="true"></i></button>
    <span class="ns-vplayer__time" data-ns-video-current>0:00</span>
    <input class="ns-vplayer__seek" type="range" min="0" max="100" value="0" aria-label="Seek">
    <span class="ns-vplayer__time" data-ns-video-duration>0:00</span>
  </div>
</div>` },
      { name: "Chapters", note: "A contents page for a video, not a log file. The old list set a mono timestamp and a title on one baseline in a bordered row, fifteen times — a table of numbers, when the reader is scanning TITLES and using time only to decide whether to commit. So the title leads, time is metadata under it, and the row's leading edge carries watched / playing / ahead — the same device the lesson rail uses.", html: `<ol class="ns-vchapters ns-vchapters--notes" style="max-inline-size:26rem;inline-size:100%;border:1px solid var(--color-border);border-radius:var(--radius-card)">
  <li class="ns-vchapters__item" data-state="done">
    <button type="button" class="ns-vchapters__btn">
      <span class="ns-vchapters__title">What a trigger actually receives</span>
      <span class="ns-vchapters__time">00:00</span>
      <span class="ns-vchapters__meta">4 min · watched</span>
    </button>
  </li>
  <li class="ns-vchapters__item" aria-current="true">
    <button type="button" class="ns-vchapters__btn">
      <span class="ns-vchapters__title">Why 200 records breaks it</span>
      <span class="ns-vchapters__time">04:12</span>
      <span class="ns-vchapters__meta">6 min · playing</span>
    </button>
  </li>
  <li class="ns-vchapters__item">
    <button type="button" class="ns-vchapters__btn">
      <span class="ns-vchapters__title">The Map, and one query</span>
      <span class="ns-vchapters__time">10:40</span>
      <span class="ns-vchapters__meta">7 min</span>
    </button>
  </li>
  <li class="ns-vchapters__item">
    <button type="button" class="ns-vchapters__btn">
      <span class="ns-vchapters__title">Testing the bulk case</span>
      <span class="ns-vchapters__time">17:55</span>
      <span class="ns-vchapters__meta">3 min</span>
    </button>
  </li>
</ol>` },
      { name: "Inline chapters", note: "<code>--inline</code> for a player with no rail: one line each, time first, because in this shape the reader IS seeking rather than choosing.", html: `<ol class="ns-vchapters ns-vchapters--inline" style="max-inline-size:26rem;inline-size:100%;border:1px solid var(--color-border);border-radius:var(--radius-card)">
  <li class="ns-vchapters__item" data-state="done"><button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">00:00</span><span class="ns-vchapters__title">What a trigger receives</span></button></li>
  <li class="ns-vchapters__item" aria-current="true"><button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">04:12</span><span class="ns-vchapters__title">Why 200 records breaks it</span></button></li>
  <li class="ns-vchapters__item"><button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">10:40</span><span class="ns-vchapters__title">The Map, and one query</span></button></li>
</ol>` },
    ],
  },
  {
    id: "badge", title: "Badge", family: "Surfaces",
    summary: "Status as a hairline box and a coloured <strong>dot</strong> — never a pastel fill. Principle 3: the dot carries the colour and the text stays ink, so five badges in a row are one signal colour apart rather than five competing washes.",
    use: ["A state the reader cannot change — draft, published, failed", "A short mono word, not a sentence"],
    not: ["Anything clickable — a tag is a noun you can click, a badge is a state you cannot. Use Tag", "A tinted background per status — that is the pastel-pill pattern this replaces", "Long text — if it wraps it is not a badge"],
    a11y: ["The dot is decorative and aria-hidden; the word carries the meaning", "Colour is never the only signal — the label always says the state in words"],
    variants: [
      { name: "Statuses", note: "Only the dot changes hue. The ink stays --color-ink in all five.", html: `<span class="ns-badge"><span class="ns-badge__dot" aria-hidden="true"></span>Draft</span>
<span class="ns-badge ns-badge--success"><span class="ns-badge__dot" aria-hidden="true"></span>Published</span>
<span class="ns-badge ns-badge--warning"><span class="ns-badge__dot" aria-hidden="true"></span>Review</span>
<span class="ns-badge ns-badge--error"><span class="ns-badge__dot" aria-hidden="true"></span>Failed</span>
<span class="ns-badge ns-badge--accent"><span class="ns-badge__dot" aria-hidden="true"></span>Beta</span>` },
      { name: "With an icon", note: "An icon REPLACES the dot; it never joins it. Two status marks on one badge is two claims about the same state.", html: `<span class="ns-badge ns-badge--success"><i class="ph ph-seal-check ns-badge__icon" aria-hidden="true"></i>Certified</span>
<span class="ns-badge ns-badge--error"><i class="ph ph-warning ns-badge__icon" aria-hidden="true"></i>Deprecated</span>` },
      { name: "Overridden by a utility", note: "The badge sits in @layer ns-components, so a Tailwind utility wins with no !important — this is the override contract, rendered.", html: `<span class="ns-badge">Default</span>
<span class="ns-badge rounded-pill px-card">Utilities applied</span>` },
    ],
  },
  {
    id: "chip", title: "Chip", family: "Surfaces",
    summary: "The icon tile that fronts a feature row or an empty state. The fill and its hairline are <code>color-mix</code>ed from one hue at two strengths, so they are provably the same colour — no second token, no soft glow.",
    use: ["Leading a feature row, a benefit list or an empty state", "Where an icon needs weight without becoming a button"],
    not: ["As a button — it has no action and no focus state. Use an icon Button", "Carrying meaning alone — the icon decorates the text beside it"],
    a11y: ["The icon is aria-hidden: the adjacent heading is the real label", "Never the only way to tell two rows apart"],
    variants: [
      { name: "Sizes", note: "Three fixed steps. The glyph scales from the tile, so the ratio holds at every size.", html: `<span class="ns-chip ns-chip--sm"><i class="ph ph-code" aria-hidden="true"></i></span>
<span class="ns-chip"><i class="ph ph-lightning" aria-hidden="true"></i></span>
<span class="ns-chip ns-chip--lg"><i class="ph ph-graduation-cap" aria-hidden="true"></i></span>` },
      { name: "Accent", html: `<span class="ns-chip"><i class="ph ph-cube" aria-hidden="true"></i></span>
<span class="ns-chip ns-chip--accent"><i class="ph ph-sparkle" aria-hidden="true"></i></span>` },
    ],
  },
  {
    id: "logo", title: "Logo", family: "Surfaces",
    summary: "The wordmark lockup: the favicon asset plus the name. Three fixed sizes rather than a free pixel value — a lockup that can be any height is one neither product can match.",
    use: ["Site header, footer, and any on-dark band", "Compact in a narrow header, where the name still needs announcing"],
    not: ["A pictorial mark invented beyond the favicon asset — see the Brand guidelines", "Recoloured, stretched or shadowed"],
    a11y: ["Compact hides the name visually but keeps it in the DOM, so an icon-only header is still a named link", "The mark itself is alt=\"\" — the text beside it is the accessible name"],
    variants: [
      { name: "Sizes", html: `<span class="ns-logo ns-logo--sm"><img class="ns-logo__mark" src="../assets/logo/favicon.svg" alt=""><span class="ns-logo__text">Namaste Salesforce</span></span>
<span class="ns-logo"><img class="ns-logo__mark" src="../assets/logo/favicon.svg" alt=""><span class="ns-logo__text">Namaste Salesforce</span></span>
<span class="ns-logo ns-logo--lg"><img class="ns-logo__mark" src="../assets/logo/favicon.svg" alt=""><span class="ns-logo__text">Namaste Salesforce</span></span>` },
      { name: "Compact", note: "Icon only — the name is still announced.", html: `<span class="ns-logo ns-logo--compact"><img class="ns-logo__mark" src="../assets/logo/favicon.svg" alt=""><span class="ns-logo__text">Namaste Salesforce</span></span>` },
      { name: "On dark", dark: true, html: `<span class="ns-logo ns-logo--light"><img class="ns-logo__mark" src="../assets/logo/favicon.svg" alt=""><span class="ns-logo__text">Namaste Salesforce</span></span>` },
    ],
  },
  {
    id: "stepper", title: "Stepper", family: "Progress & data",
    summary: "A short <strong>labelled</strong> flow the reader is currently inside — checkout, onboarding, a quiz. Mono-numbered nodes on a connecting hairline.",
    use: ["Three to five labelled steps with a clear current position", "Where the reader needs to know what comes next, not just how far along"],
    not: ["A long curriculum — use the Curriculum list", "An anonymous how-far bar — use Steps", "More than about five steps: it stops being readable"],
    a11y: ["An &lt;ol&gt;, because it is an ordered list of steps", "aria-current=\"step\" marks position; data-state drives the paint from the same source", "A done step shows a check instead of its number — the number is no longer the useful information"],
    variants: [
      { name: "Vertical", stack: true, note: "The same flow on its side, for a narrow rail or a checkout summary where the labels are too long to sit side by side.", html: `<ol class="ns-stepper ns-stepper--vertical">
  <li class="ns-stepper__step" data-state="done"><span class="ns-stepper__node"><i class="ph ph-check-circle" aria-hidden="true"></i></span><span class="ns-stepper__label">Account created</span></li>
  <li class="ns-stepper__line" data-state="done" aria-hidden="true"></li>
  <li class="ns-stepper__step" data-state="current" aria-current="step"><span class="ns-stepper__node">02</span><span class="ns-stepper__label">Payment details</span></li>
  <li class="ns-stepper__line" aria-hidden="true"></li>
  <li class="ns-stepper__step"><span class="ns-stepper__node">03</span><span class="ns-stepper__label">Confirm and enrol</span></li>
</ol>` },
      { name: "In progress", html: `<ol class="ns-stepper">
  <li class="ns-stepper__step" data-state="done"><span class="ns-stepper__node"><i class="ph ph-check-circle" aria-hidden="true"></i></span><span class="ns-stepper__label">Account</span></li>
  <li class="ns-stepper__line" data-state="done" aria-hidden="true"></li>
  <li class="ns-stepper__step" data-state="current" aria-current="step"><span class="ns-stepper__node">02</span><span class="ns-stepper__label">Payment</span></li>
  <li class="ns-stepper__line" aria-hidden="true"></li>
  <li class="ns-stepper__step"><span class="ns-stepper__node">03</span><span class="ns-stepper__label">Confirm</span></li>
</ol>` },
      { name: "First step", html: `<ol class="ns-stepper">
  <li class="ns-stepper__step" data-state="current" aria-current="step"><span class="ns-stepper__node">01</span><span class="ns-stepper__label">Details</span></li>
  <li class="ns-stepper__line" aria-hidden="true"></li>
  <li class="ns-stepper__step"><span class="ns-stepper__node">02</span><span class="ns-stepper__label">Review</span></li>
  <li class="ns-stepper__line" aria-hidden="true"></li>
  <li class="ns-stepper__step"><span class="ns-stepper__node">03</span><span class="ns-stepper__label">Done</span></li>
</ol>` },
    ],
  },
  {
    id: "avatar", title: "Avatar", family: "Surfaces",
    summary: "People: image or mono initials on a sunken disc. The ring wrapper draws course progress as a conic arc; stacks overlap with a surface ring so faces stay separable.",
    use: ["Instructors, students, authors — wherever a person appears", "Progress ring — a learner's completion on their own avatar"],
    not: ["Logos or course art — use Image", "Decoration — an avatar always stands for a real person"],
    a11y: ["Image avatars carry the person's name as alt", "Initials avatars pair with the visible name or an aria-label — initials alone are not a name"],
    variants: [
      { name: "Sizes", html: `<span class="ns-avatar ns-avatar--sm">NS</span>
<span class="ns-avatar">SW</span>
<span class="ns-avatar ns-avatar--lg">AR</span>
<span class="ns-avatar ns-avatar--xl">PK</span>` },
      { name: "Image", html: `<span class="ns-avatar ns-avatar--lg"><img src="../assets/logo/icon-512.png" alt="Namaste Salesforce"></span>` },
      { name: "Progress ring", note: "--p is percent complete; the arc is the same conic device as the chart ring.", html: `<span class="ns-avatar-ring" style="--p:25"><span class="ns-avatar">25</span></span>
<span class="ns-avatar-ring" style="--p:64"><span class="ns-avatar">64</span></span>
<span class="ns-avatar-ring" style="--p:100"><span class="ns-avatar"><i class="ph ph-check-circle" aria-hidden="true"></i></span></span>` },
      { name: "Stack", note: "Overlapped with a surface ring; the last disc counts the rest.", html: `<span class="ns-avatar-stack">
  <span class="ns-avatar">AK</span>
  <span class="ns-avatar">RS</span>
  <span class="ns-avatar">MJ</span>
  <span class="ns-avatar ns-avatar--more">+9</span>
</span>` },
    ],
  },
  {
    id: "list", title: "List", family: "Surfaces",
    summary: "The terminal-row list — this system's way of rendering any collection: mono index, title, meta on the right, one hairline rule per row. Hover draws the 2px left accent. Curriculum, search results, drafts — all this one component.",
    use: ["Any ordered collection — lessons, results, files, students", "Linked rows — the whole row is the link"],
    not: ["Prose bullet points — that is ul/ol inside .ns-prose (see Elements)", "Two-dimensional data — Table"],
    a11y: ["Linked rows are real <a> elements, one per row", "The index is content, not decoration — screen readers read the order too"],
    variants: [
      { name: "Indexed", note: "The mono index is a first-class element — the numbering IS the design.", html: `<div class="ns-list" style="inline-size:100%;max-inline-size:30rem">
  <div class="ns-list__row"><span class="ns-list__index">01</span><span class="ns-list__title">What is an org?</span><span class="ns-list__meta">video · 08:12</span></div>
  <div class="ns-list__row"><span class="ns-list__index">02</span><span class="ns-list__title">Objects &amp; fields</span><span class="ns-list__meta">video · 12:40</span></div>
  <div class="ns-list__row"><span class="ns-list__index">03</span><span class="ns-list__title">Your first automation</span><span class="ns-list__meta">lab · 20:00</span></div>
</div>` },
      { name: "Linked rows", note: "Real anchors; hover shows the left accent line.", html: `<div class="ns-list" style="inline-size:100%;max-inline-size:30rem">
  <a class="ns-list__row" href="#"><span class="ns-list__index">01</span><span class="ns-list__title">Apex basics</span><span class="ns-list__meta">12 lessons</span><i class="ph ph-caret-right ns-list__chev" aria-hidden="true"></i></a>
  <a class="ns-list__row" href="#"><span class="ns-list__index">02</span><span class="ns-list__title">Flows</span><span class="ns-list__meta">9 lessons</span><i class="ph ph-caret-right ns-list__chev" aria-hidden="true"></i></a>
</div>` },
      { name: "With status", html: `<div class="ns-list" style="inline-size:100%;max-inline-size:30rem">
  <div class="ns-list__row"><span class="ns-list__index">01</span><span class="ns-list__title">Setup &amp; navigation</span><span class="ns-list__meta"><span class="ns-status ns-status--success">Complete</span></span></div>
  <div class="ns-list__row"><span class="ns-list__index">02</span><span class="ns-list__title">Data modeling</span><span class="ns-list__meta"><span class="ns-status ns-status--info">In progress</span></span></div>
  <div class="ns-list__row"><span class="ns-list__index">03</span><span class="ns-list__title">Security model</span><span class="ns-list__meta"><span class="ns-status ns-status--idle">Not started</span></span></div>
</div>` },
      { name: "Boxed", note: "The same list inside the card frame, for placement on sunken pages.", html: `<div class="ns-list ns-list--boxed" style="inline-size:100%;max-inline-size:30rem">
  <div class="ns-list__row"><span class="ns-list__index">01</span><span class="ns-list__title">Intro to Lightning</span><span class="ns-list__meta">08:12</span></div>
  <div class="ns-list__row"><span class="ns-list__index">02</span><span class="ns-list__title">App builder</span><span class="ns-list__meta">14:03</span></div>
</div>` },
    ],
  },

  /* ===================================================== Navigation ==== */
  {
    id: "topnav", title: "Navbar", family: "Navigation",
    summary: "The one piece of chrome on every page: brand, links, actions, one hairline below, <code>--navbar-h</code> (3.5rem) tall — chrome, and every row it takes is a row of content the reader does not get. The current page wears the 2px brand underline — the accent-line device, horizontal — because the page you are already on is not an action and must not look like a button. Sticky by default; the surface variants ride a hero, float, or go quiet.",
    use: ["The single global bar at the top of every page", "aria-current=\"page\" on exactly one link", "Pair it with the mobile sheet below lg — the bar is one component with two link surfaces"],
    not: ["Secondary navigation inside a page — Tabs or Sidebar", "A second bar under the first — if the page needs two rows of navigation, the information architecture is the problem", "Hiding the bar on scroll-down: it saves 3.5rem and costs everyone the ability to predict where navigation is"],
    a11y: ["A &lt;nav&gt; landmark with a label, so \"skip to navigation\" lands somewhere", "aria-current=\"page\" marks location for assistive tech AND paints the underline — one attribute, both jobs", "The bar is the first thing in the tab order after the skip link, and the skip link's target carries tabindex=\"-1\""],
    variants: [
      { name: "Anatomy", flush: true, note: "Brand · link row · divider · search · theme · action, in that order (the signed-in and signed-out ends of the bar are on the <a href=\"./c-usermenu.html\">Account menu</a> page). Everything after the link row sits in <code>.ns-topnav__actions</code>, which takes the remaining space with <code>margin-inline-start:auto</code> — so adding an action never re-centres the links. Live: the whole bar on this page is operable.", html: `<nav class="ns-topnav" aria-label="Anatomy example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span><span class="ns-topnav__brand-tag">Learn</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page">Courses</a></li>
    <li><a href="#">Docs <span class="ns-topnav__flag">New</span></a></li>
  </ul>
  <div class="ns-topnav__actions">
    <button type="button" class="ns-navsearch">
      <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
      <span class="ns-navsearch__text">Search courses…</span>
      <kbd class="ns-navsearch__kbd">⌘K</kbd>
    </button>
    <span class="ns-topnav__divider" aria-hidden="true"></span>
    <button type="button" class="ns-themeswitch" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
      <span class="ns-themeswitch__mark" aria-hidden="true"></span>
    </button>
    <a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Sign up</a>
  </div>
</nav>` },
      { name: "Contained", flush: true, note: "<code>.ns-topnav__inner</code> caps the contents at the page container so the brand sits exactly above the page's first column. Without it the bar is edge-to-edge — right for an app, wrong for a 72rem marketing page. <code>--wide</code> switches the cap to the wide container.", html: `<nav class="ns-topnav" aria-label="Contained example">
  <div class="ns-topnav__inner">
    <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
    <ul class="ns-topnav__links">
      <li><a href="#" aria-current="page">Courses</a></li>
      <li><a href="#">Pricing</a></li>
    </ul>
    <div class="ns-topnav__actions"><a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Start learning</a></div>
  </div>
</nav>` },
      { name: "Signed in — app bar", flush: true, note: "Compact height, search first, account menu last. No sign-up button: the member already signed up, and leaving it there is how a product tells a paying customer it has not noticed them.", html: `<nav class="ns-topnav ns-topnav--compact" aria-label="App bar example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page">My learning</a></li>
    <li><a href="#">Catalog</a></li>
  </ul>
  <div class="ns-topnav__actions">
    <button type="button" class="ns-navsearch ns-navsearch--icon" aria-label="Search"><i class="ph ph-magnifying-glass" aria-hidden="true"></i></button>
    <button type="button" class="ns-themetoggle-icon" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
      <i class="ph ph-sun" aria-hidden="true"></i><i class="ph ph-moon" aria-hidden="true"></i>
    </button>
    <span class="ns-topnav__divider" aria-hidden="true"></span>
    <div class="ns-usermenu">
      <button type="button" class="ns-usermenu__trigger" data-ns-menu aria-expanded="false" aria-controls="app-account" aria-label="Account menu for Aarti Kulkarni">
        <span class="ns-avatar ns-avatar--sm" aria-hidden="true">AK</span><span class="ns-usermenu__name">Aarti K.</span>
      </button>
      <div class="ns-usermenu__panel" id="app-account">
        <div class="ns-usermenu__head">
          <span class="ns-avatar" aria-hidden="true">AK</span>
          <span class="ns-usermenu__identity"><span class="ns-usermenu__fullname">Aarti Kulkarni</span><span class="ns-usermenu__email">aarti@example.com</span></span>
          <span class="ns-usermenu__plan">Pro</span>
        </div>
        <hr class="ns-menu__sep">
        <a class="ns-menu__item" href="#"><i class="ph ph-user" aria-hidden="true"></i> My learning</a>
        <a class="ns-menu__item" href="#"><i class="ph ph-gear" aria-hidden="true"></i> Settings</a>
      </div>
    </div>
  </div>
</nav>` },
      { name: "With icons", flush: true, note: "Icons in the link row are OFF by default and this is the case they exist for: an app bar, where the links are PLACES in a product rather than pages of a site and the shape helps someone find the row again. On a marketing bar, where every link is a page, a glyph on each one means nothing. The icon rides the link's colour, so current and hover need no extra rule.", html: `<nav class="ns-topnav ns-topnav--compact" aria-label="Icon links example">
  BRAND
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page"><i class="ph ph-squares-four" aria-hidden="true"></i> Dashboard</a></li>
    <li><a href="#"><i class="ph ph-books" aria-hidden="true"></i> My courses</a></li>
    <li><a href="#"><i class="ph ph-seal-check" aria-hidden="true"></i> Certificates</a></li>
  </ul>
  <div class="ns-topnav__actions">
    <span class="ns-navstat"><i class="ph ph-lightning" aria-hidden="true"></i> <strong>12</strong> day streak</span>
    <a class="ns-navicon" href="#" aria-label="Notifications — 3 unread"><i class="ph ph-bell" aria-hidden="true"></i><span class="ns-navicon__badge" aria-hidden="true">3</span></a>
    <button type="button" class="ns-themeswitch" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
      <span class="ns-themeswitch__mark" aria-hidden="true"></span>
    </button>
  </div>
</nav>` },
      { name: "Search panel", note: "The bar's search is a BUTTON shaped like a field, and this is what it opens: the shared search dialog (<code>templates/search-modal.html</code>), where results have room and ⌘K reaches it from anywhere. Live — click it or press ⌘K/Ctrl-K. Typing in the bar itself would mean teleporting the text into a dialog on the first keystroke, which is the version of this that feels broken.", script: `(function () {
  var dlg = document.getElementById('doc-search');
  if (!dlg) return;
  var open = function () { if (!dlg.open) dlg.showModal(); dlg.querySelector('input').focus(); };
  document.querySelectorAll('[data-ns-search]').forEach(function (b) { b.addEventListener('click', open); });
  dlg.querySelector('[data-ns-search-close]').addEventListener('click', function () { dlg.close(); });
  document.addEventListener('keydown', function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); open(); }
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
})();`, html: `<button type="button" class="ns-navsearch" data-ns-search>
  <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
  <span class="ns-navsearch__text">Search courses…</span>
  <kbd class="ns-navsearch__kbd">⌘K</kbd>
</button>
<button type="button" class="ns-navsearch ns-navsearch--icon" aria-label="Search" data-ns-search>
  <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
</button>
<dialog class="ns-modal ns-modal--lg" id="doc-search" aria-label="Search">
  <div class="ns-modal__header">
    <div style="flex:1">
      <label class="ns-visually-hidden" for="doc-search-input">Search courses and documentation</label>
      <input id="doc-search-input" class="ns-input ns-input--has-icon" type="search" placeholder="Search courses, lessons, docs…" autocomplete="off">
    </div>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Close search" data-ns-search-close><i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <div class="ns-modal__body" role="status" aria-live="polite">
    <div class="ns-empty" style="border:0">
      <i class="ph ph-magnifying-glass ns-empty__icon" aria-hidden="true"></i>
      <p class="ns-empty__text">Start typing to search.</p>
    </div>
  </div>
</dialog>` },
      { name: "GitHub star", note: "For an open-source product this is the bar's one piece of social proof, and it is a <em>link to the repo</em> rather than a widget: the count is a number, rendered mono like every other number here, and it is divided by a hairline so the pill reads as one control. One per bar. Below lg the words drop and the mark stands alone. The mark itself is filled rather than restroked — a logo has to be itself.", html: `<a class="ns-navstar" href="#" aria-label="Star Namaste Salesforce on GitHub — 1.2k stars">
  <span class="ns-navstar__label"><i class="ph ph-github-logo" aria-hidden="true"></i> <span>Star</span></span>
  <span class="ns-navstar__count" aria-hidden="true">1.2k</span>
</a>
<a class="ns-navicon" href="#" aria-label="GitHub repository"><i class="ph ph-github-logo" aria-hidden="true"></i></a>` },
      { name: "Blog bar", flush: true, note: "Centred links, a reading-progress line along the bottom edge, and tags instead of products — on a blog the useful navigation is by subject. The progress line is set here to 38% for the specimen; in product <code>assets/js/nav.js</code> drives it from scroll. Full page: <a href=\"./demo-navbar-blog.html\">open the blog bar demo ↗</a>", html: `<nav class="ns-topnav ns-topnav--center" aria-label="Blog bar example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span><span class="ns-topnav__brand-tag">Blog</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page">Latest</a></li>
    <li><a href="#">Admin</a></li>
    <li><a href="#">Developer</a></li>
    <li><a href="#">Architect</a></li>
  </ul>
  <div class="ns-topnav__actions">
    <button type="button" class="ns-navsearch ns-navsearch--icon" aria-label="Search the blog"><i class="ph ph-magnifying-glass" aria-hidden="true"></i></button>
    <a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Subscribe</a>
  </div>
  <div class="ns-topnav__progress" style="--p:38" aria-hidden="true"></div>
</nav>` },
      { name: "On a hero", dark: true, flush: true, note: "<code>--dark</code> is the navy bar; <code>--transparent</code> is the same anatomy with no background at all, for sitting on a hero image — it swaps to this navy once the page scrolls (<code>data-scrolled</code>, one passive listener). Deliberately NOT a translucent blur: backdrop-filter costs real repaint budget on mid-range Android, and \"calm and fast\" is a product value, not a slogan.", html: `<nav class="ns-topnav ns-topnav--dark" aria-label="Dark bar example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span><span class="ns-topnav__brand-tag">Learn</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page">Courses</a></li>
    <li><a href="#">Training</a></li>
    <li><a href="#">Docs</a></li>
  </ul>
  <div class="ns-topnav__actions">
    <button type="button" class="ns-navsearch">
      <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
      <span class="ns-navsearch__text">Search courses…</span>
      <kbd class="ns-navsearch__kbd">⌘K</kbd>
    </button>
    <a class="ns-btn ns-btn--white ns-btn--sm" href="#">Start learning</a>
  </div>
</nav>` },
      { name: "Floating and sunken", flush: true, note: "<code>--floating</code> detaches the bar with a gutter and a raised shadow — marketing pages that want air. <code>--sunken</code> drops it onto the sunken surface, which is how it should look above a white content column. Neither belongs in app chrome, where a bar that does not touch the edges wastes the one row of height it costs.", html: `<div style="background:var(--color-surface-sunken);padding-block:var(--space-4)">
  <nav class="ns-topnav ns-topnav--floating" aria-label="Floating example">
    <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
    <ul class="ns-topnav__links"><li><a href="#" aria-current="page">Courses</a></li><li><a href="#">Pricing</a></li></ul>
    <div class="ns-topnav__actions"><a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Start learning</a></div>
  </nav>
</div>
<nav class="ns-topnav ns-topnav--sunken" aria-label="Sunken example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <ul class="ns-topnav__links"><li><a href="#" aria-current="page">Courses</a></li><li><a href="#">Pricing</a></li></ul>
  <div class="ns-topnav__actions"><a class="ns-btn ns-btn--outline ns-btn--sm" href="#">Sign in</a></div>
</nav>` },
      { name: "Announcement above", flush: true, note: "News, not chrome — so it sits ABOVE the sticky bar and scrolls away with the page. Pinning it to the viewport is how a banner becomes an ad. <code>--quiet</code> is the same bar on the sunken surface, for a notice that is useful rather than promotional.", html: `<div class="ns-announce">
  <span class="ns-announce__kicker">New</span>
  <span class="ns-announce__text">Flow Builder deep-dive — 14 lessons, free this month.</span>
  <a class="ns-announce__link" href="#">Start the course</a>
  <button type="button" class="ns-announce__close" aria-label="Dismiss announcement"><i class="ph ph-x" aria-hidden="true"></i></button>
</div>
<nav class="ns-topnav" aria-label="Announcement example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <ul class="ns-topnav__links"><li><a href="#" aria-current="page">Courses</a></li><li><a href="#">Docs</a></li></ul>
  <div class="ns-topnav__actions"><a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Start learning</a></div>
</nav>` },
      { name: "The whole thing", note: "Announcement, mega menu, dropdown, search, theme, auth, hamburger and sheet — assembled, at full page width, from <code>templates/navbar.html</code>: <a href=\"./demo-navbar.html\">open the full navbar demo ↗</a>. Resize below 64rem to get the hamburger and the mobile sheet.", html: `<a class="ns-btn ns-btn--outline" href="./demo-navbar.html">Open the full navbar demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline" href="./demo-navbar-blog.html">Open the blog navbar demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>` },
    ],
  },
  {
    id: "navmenu", title: "Nav menu", family: "Navigation",
    summary: "The panels that hang off a navbar link: a dropdown for a handful of destinations, a mega panel for a section of the site. Both are DISCLOSURES, not ARIA menus — the rows are links to pages, so they behave like links, and the only state is <code>aria-expanded</code> on the trigger, which is exactly what the CSS reads to show the panel.",
    use: ["A link that leads to four or more related pages", "Destinations that need a line of explanation — \"Architect · patterns, scale, governance\"", "The mega panel when one section has three columns' worth of pages and a thing worth featuring"],
    not: ["An actions menu (Duplicate, Delete…) — that is Menu in Overlays, with role=\"menu\" and its own keyboard rules", "Hover-only opening: it is unreachable by touch and fires by accident with a passing cursor", "More than one promo per mega panel — two is an ad break, and a mega menu that is mostly marketing has stopped being navigation"],
    a11y: ["The trigger is a &lt;button&gt; with aria-expanded and aria-controls; the state attribute and the visual state are the same fact", "Esc closes and RETURNS FOCUS to the trigger — without that, Esc silently drops a keyboard user at the top of the document", "ArrowDown opens and moves into the panel; Tab out of the panel closes it", "The rows are &lt;a&gt; elements, so they are crawlable, middle-clickable, and announced as links because that is what they are"],
    variants: [
      { name: "Dropdown", flush: true, note: "Icon tile, title, one line of description. The description is not garnish — it is the whole reason a menu is navigable by someone who does not already know the product. Live: click <strong>Resources</strong>.", html: `<nav class="ns-topnav" aria-label="Dropdown example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page">Courses</a></li>
    <li class="ns-navitem">
      <button type="button" class="ns-topnav__trigger" data-ns-menu aria-expanded="false" aria-controls="doc-resources">Resources</button>
      <div class="ns-navmenu" id="doc-resources">
        <p class="ns-navmenu__label">Read</p>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-article" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">Blog</span><span class="ns-navmenu__desc">Release notes, deep dives, opinions</span></span>
        </a>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-book-open-text" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">Docs</span><span class="ns-navmenu__desc">The theme and the design system</span></span>
        </a>
        <hr class="ns-navmenu__sep">
        <p class="ns-navmenu__label">Watch</p>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-video" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">YouTube</span><span class="ns-navmenu__desc">Two videos a week, Hindi and English</span></span>
        </a>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-github-logo" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">GitHub</span><span class="ns-navmenu__desc">The theme and this system, MIT</span></span>
        </a>
        <div class="ns-navmenu__foot">
          <span>New this week</span>
          <a href="#">Winter release →</a>
        </div>
      </div>
    </li>
    <li><a href="#">Pricing</a></li>
  </ul>
</nav>` },
      { name: "Mega panel", flush: true, note: "<code>.ns-navitem--mega</code> makes the wrapper <code>static</code>, so the panel's containing block is the BAR and it spans the full width. Columns of the same rows, one promo, and a hairline foot bar for the odds and ends. Live: click <strong>Learn</strong>.", html: `<nav class="ns-topnav" aria-label="Mega menu example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#">Courses</a></li>
    <li class="ns-navitem ns-navitem--mega">
      <button type="button" class="ns-topnav__trigger" data-ns-menu aria-expanded="false" aria-controls="doc-learn">Learn</button>
      <div class="ns-megamenu" id="doc-learn">
        <div class="ns-megamenu__inner">
          <div class="ns-megamenu__col">
            <p class="ns-megamenu__label">By role</p>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-user" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Administrator</span><span class="ns-navmenu__desc">Setup, security, data model</span></span></a>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-code" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Developer</span><span class="ns-navmenu__desc">Apex, LWC, integrations</span></span></a>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-strategy" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Architect</span><span class="ns-navmenu__desc">Patterns, scale, governance</span></span></a>
          </div>
          <div class="ns-megamenu__col">
            <p class="ns-megamenu__label">By product</p>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-flow-arrow" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Flow</span><span class="ns-navmenu__desc">Automation without code</span></span></a>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-lightning" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Lightning</span><span class="ns-navmenu__desc">App Builder and components</span></span></a>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-database" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Data Cloud</span><span class="ns-navmenu__desc">Ingest, unify, activate</span></span></a>
          </div>
          <div class="ns-megamenu__col">
            <p class="ns-megamenu__label">Free</p>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-map-trifold" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Roadmaps</span><span class="ns-navmenu__desc">What to learn, in order</span></span></a>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-exam" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Practice exams</span><span class="ns-navmenu__desc">Timed, with explanations</span></span></a>
            <a class="ns-navmenu__item" href="#"><span class="ns-navmenu__icon"><i class="ph ph-terminal-window" aria-hidden="true"></i></span><span><span class="ns-navmenu__title">Code snippets</span><span class="ns-navmenu__desc">Copy-paste Apex and LWC</span></span></a>
          </div>
          <div class="ns-megamenu__feature">
            <span class="ns-megamenu__feature-kicker">Featured</span>
            <p class="ns-megamenu__feature-title">Admin → Developer in 12 weeks</p>
            <p class="ns-megamenu__feature-text">The full trail: Apex, testing, deployment, and the interview prep at the end.</p>
            <a class="ns-btn ns-btn--outline ns-btn--sm" href="#">See the trail</a>
          </div>
        </div>
        <div class="ns-megamenu__foot">
          <a href="#"><i class="ph ph-play-circle" aria-hidden="true"></i> Latest lesson</a>
          <a href="#"><i class="ph ph-users-three" aria-hidden="true"></i> Community</a>
          <a href="#"><i class="ph ph-question" aria-hidden="true"></i> Help centre</a>
        </div>
      </div>
    </li>
    <li><a href="#">Pricing</a></li>
  </ul>
</nav>` },
      { name: "Panel, open", flush: true, note: "The panel on its own, held open so the parts are readable: label, rows, hairline, foot. This specimen's trigger deliberately omits <code>data-ns-menu</code>, which is why clicking elsewhere does not close it.", html: `<nav class="ns-topnav" aria-label="Open panel example" style="block-size:auto;padding-block-end:14rem">
  <ul class="ns-topnav__links">
    <li class="ns-navitem">
      <button type="button" class="ns-topnav__trigger" aria-expanded="true">Resources</button>
      <div class="ns-navmenu">
        <p class="ns-navmenu__label">Read</p>
        <a class="ns-navmenu__item" href="#" aria-current="page">
          <span class="ns-navmenu__icon"><i class="ph ph-article" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">Blog</span><span class="ns-navmenu__desc">You are here — the row shows it with the left accent</span></span>
        </a>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-book-open-text" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">Docs</span><span class="ns-navmenu__desc">The theme and the design system</span></span>
        </a>
      </div>
    </li>
  </ul>
</nav>` },
    ],
  },
  {
    id: "usermenu", title: "Account menu", family: "Navigation",
    summary: "The signed-in end of the navbar: an avatar trigger opening a panel that states WHO you are before it offers anything to do. Signed out, the same slot is two buttons — quiet sign-in beside the one solid blue thing on the page.",
    use: ["Every signed-in surface — the panel is where account, progress and sign-out live", "Ghost Members: wrap it in {{#if @member}} and the signed-out pair in the {{else}}"],
    not: ["A bare avatar with no name anywhere — an avatar is not an accessible name", "Burying sign-out three levels deep; it is the one item people go looking for", "Duplicating the whole site map inside it — that is the navbar's job"],
    a11y: ["The trigger names the account: aria-label=\"Account menu for Aarti Kulkarni\", because the initials disc is aria-hidden", "The identity block is real text, so a screen reader reads the account before the actions", "Sign out is a &lt;button&gt; — it changes state, it does not navigate", "Below lg the name is hidden visually; the accessible name on the trigger keeps it announced"],
    variants: [
      { name: "Signed out", note: "Sign in is quiet, sign up is THE primary. Two primaries here is the most common navbar mistake in the wild — it makes the user choose between two equally loud things at the exact moment they know least.", html: `<div class="ns-topnav__auth">
  <a class="ns-btn ns-btn--quiet ns-btn--sm" href="#">Sign in</a>
  <a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Start learning</a>
</div>` },
      { name: "Signed in", flush: true, note: "Live: click the avatar. Identity, then progress, then actions, then sign out behind a hairline — the order is the order people look for them.", html: `<nav class="ns-topnav" aria-label="Account menu example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <div class="ns-topnav__actions">
    <div class="ns-usermenu">
      <button type="button" class="ns-usermenu__trigger" data-ns-menu aria-expanded="false" aria-controls="doc-account" aria-label="Account menu for Aarti Kulkarni">
        <span class="ns-avatar ns-avatar--sm" aria-hidden="true">AK</span>
        <span class="ns-usermenu__name">Aarti K.</span>
      </button>
      <div class="ns-usermenu__panel" id="doc-account">
        <div class="ns-usermenu__head">
          <span class="ns-avatar" aria-hidden="true">AK</span>
          <span class="ns-usermenu__identity">
            <span class="ns-usermenu__fullname">Aarti Kulkarni</span>
            <span class="ns-usermenu__email">aarti@example.com</span>
          </span>
          <span class="ns-usermenu__plan">Pro</span>
        </div>
        <div class="ns-usermenu__progress">
          <span class="ns-usermenu__progress-label"><span>Admin trail</span><span>64%</span></span>
          <progress class="ns-progress" value="64" max="100" aria-label="Admin trail progress">64%</progress>
        </div>
        <hr class="ns-menu__sep">
        <a class="ns-menu__item" href="#"><i class="ph ph-user" aria-hidden="true"></i> My learning</a>
        <a class="ns-menu__item" href="#"><i class="ph ph-bookmark-simple" aria-hidden="true"></i> Bookmarks</a>
        <a class="ns-menu__item" href="#"><i class="ph ph-seal-check" aria-hidden="true"></i> Certificates</a>
        <hr class="ns-menu__sep">
        <a class="ns-menu__item" href="#"><i class="ph ph-gear" aria-hidden="true"></i> Settings</a>
        <a class="ns-menu__item" href="#"><i class="ph ph-question" aria-hidden="true"></i> Help</a>
        <hr class="ns-menu__sep">
        <button type="button" class="ns-menu__item ns-menu__item--danger"><i class="ph ph-arrow-up-right" aria-hidden="true"></i> Sign out</button>
      </div>
    </div>
  </div>
</nav>` },
      { name: "Triggers", note: "Avatar only for a dense app bar; avatar plus short name where there is room — the name is what tells a shared-computer household which account they are about to post from. Photo, initials and a progress ring all fit the same disc (see Avatar).", html: `<div class="ns-usermenu">
  <button type="button" class="ns-usermenu__trigger" aria-expanded="false" aria-label="Account menu for Aarti Kulkarni">
    <span class="ns-avatar ns-avatar--sm" aria-hidden="true">AK</span>
  </button>
</div>
<div class="ns-usermenu">
  <button type="button" class="ns-usermenu__trigger" aria-expanded="false" aria-label="Account menu for Aarti Kulkarni">
    <span class="ns-avatar ns-avatar--sm" aria-hidden="true">AK</span>
    <span class="ns-usermenu__name">Aarti K.</span>
  </button>
</div>
<div class="ns-usermenu">
  <button type="button" class="ns-usermenu__trigger" aria-expanded="true" aria-label="Account menu for Ravi Sharma — expanded">
    <span class="ns-avatar-ring" style="--p:64"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">RS</span></span>
    <span class="ns-usermenu__name">Ravi S.</span>
  </button>
</div>` },
    ],
  },
  {
    id: "mobilenav", title: "Mobile nav", family: "Navigation",
    summary: "Below 64rem the link row is replaced by a hamburger and a full-screen sheet. Not a 20rem side drawer: on a phone a drawer leaves a useless strip of page behind it and forces the links to be small. The sheet is a real <code>&lt;dialog&gt;</code>, so the focus trap, Esc and the inert background come from the platform.",
    use: ["Every navbar — the bar is one component with two link surfaces, not two bars", "Sections with more than four children, as native &lt;details&gt; so the sheet stays one thumb-reach", "A pinned foot for the action the sheet exists to make possible"],
    not: ["A hamburger on desktop when there is room for the links — hiding navigation that fits is a cost with no benefit", "A hand-rolled &lt;div class=\"drawer\"&gt; — you would be reimplementing focus trapping, scroll locking, inert and Esc, and shipping three of the four", "A bottom tab bar: this is a content site, not an app shell"],
    a11y: ["The burger is a &lt;button aria-expanded aria-haspopup=\"dialog\" aria-controls&gt; — the arrow and the announcement can never disagree because they read the same attribute", "Opened with showModal(), so focus is trapped and the page behind is inert", "Every way of closing it runs through the dialog's close event, which returns focus to the burger", "Rows are large: font-size steps up to --size-h4 and the hit area is the full width"],
    variants: [
      { name: "Hamburger", note: "Three hairline rules — the system's own vocabulary, not an icon-font glyph — rotating into the close X. One control for both states, so the user can see where the thing they opened went. Live: click either (the second is held open).", html: `<button type="button" class="ns-burger" aria-expanded="false" aria-label="Menu" style="display:inline-flex" onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') !== 'true')">
  <span class="ns-burger__bar"></span><span class="ns-burger__bar"></span><span class="ns-burger__bar"></span>
</button>
<button type="button" class="ns-burger" aria-expanded="true" aria-label="Close menu" style="display:inline-flex" onclick="this.setAttribute('aria-expanded', this.getAttribute('aria-expanded') !== 'true')">
  <span class="ns-burger__bar"></span><span class="ns-burger__bar"></span><span class="ns-burger__bar"></span>
</button>` },
      { name: "The sheet", note: "Shown here in the page flow (a non-modal <code>&lt;dialog open&gt;</code>) so the anatomy is readable: head with brand and close, mono-indexed rows, &lt;details&gt; groups, and the pinned foot. In product it is opened with showModal() and covers the viewport.", html: `<dialog class="ns-navsheet" open aria-label="Site menu specimen" style="position:static;inline-size:24rem;max-inline-size:100%;block-size:auto;max-block-size:none;border:1px solid var(--color-border);border-radius:var(--radius-card)">
  <div class="ns-navsheet__head">
    <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-navsheet__close" aria-label="Close menu"><i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <div class="ns-navsheet__body">
    <a class="ns-navsheet__link" href="#" aria-current="page"><span class="ns-navsheet__index">01</span> Courses <i class="ph ph-caret-right" aria-hidden="true"></i></a>
    <details class="ns-navsheet__group">
      <summary class="ns-navsheet__link"><span class="ns-navsheet__index">02</span> Learn <i class="ph ph-caret-down" aria-hidden="true"></i></summary>
      <div class="ns-navsheet__sub">
        <a class="ns-navsheet__link" href="#">Administrator</a>
        <a class="ns-navsheet__link" href="#">Developer</a>
        <a class="ns-navsheet__link" href="#">Architect</a>
      </div>
    </details>
    <a class="ns-navsheet__link" href="#"><span class="ns-navsheet__index">03</span> Pricing <i class="ph ph-caret-right" aria-hidden="true"></i></a>
    <p class="ns-navsheet__label">Theme</p>
    <div class="ns-themetoggle" role="radiogroup" aria-label="Colour theme">
      <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Light">Light</button>
      <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="true" aria-label="Match the system setting">Auto</button>
      <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Dark">Dark</button>
    </div>
  </div>
  <div class="ns-navsheet__foot">
    <a class="ns-btn ns-btn--primary" href="#">Start learning</a>
    <a class="ns-btn ns-btn--outline" href="#">Sign in</a>
    <p class="ns-navsheet__meta"><span>Free · no card</span><span>12,400 learners</span></p>
  </div>
</dialog>` },
      { name: "At phone width", phone: true, note: "The real thing, in a 24rem frame — an iframe rather than a narrow div, because media queries answer to the viewport and a narrow div would keep showing the desktop bar. Tap the hamburger.", html: `<iframe src="./demo-navbar.html" title="Navbar at phone width" loading="lazy"></iframe>` },
    ],
  },
  {
    id: "coursenav", title: "Course & dashboard bars", family: "Navigation",
    summary: "Two bars for the signed-in product. The <strong>course bar</strong> is chrome for a page you are <em>inside</em>: where am I in this course, how far through, what is next — and no site navigation at all, because a link row in a lesson is an invitation to leave halfway through. The <strong>dashboard bar</strong> is the site bar with the marketing removed: places instead of pages, a Continue menu instead of a mega panel, and no sign-up anything, because they already did.",
    use: ["The course bar above the lesson player (templates/course-player.html)", "The dashboard bar on every signed-in app screen", "Icons in the link row here — this is the case they exist for"],
    not: ["The marketing bar's mega menu on either — a learner mid-course does not need the catalog's information architecture", "A second row of tabs under the course bar; the curriculum rail is the course's navigation", "Three metrics in the chrome — that is a stat band, and it belongs on the page"],
    a11y: ["Course progress is a real progressbar with aria-valuenow: unlike the blog's reading line it is a number the learner acts on, so it is labelled and announced", "The back control names its destination — a bare chevron sends people to the browser's back button, and out of the video", "Every icon-only control (previous, notes, curriculum, notifications) carries an aria-label, and the notification badge is a count that appears in that label too", "Below md the bar sheds in a fixed order — the back label, then the inline meter, then the button labels. The lesson title and Next never go"],
    variants: [
      { name: "Course bar", flush: true, note: "Back · lesson · completion · account — and no primary action, because finishing a lesson belongs to the player\u2019s docked prev/next and a second solid button here would compete for the one click a screen is allowed. Full page: <a href=\"./demo-navbar-course.html\">open the course bar demo ↗</a>", html: `<nav class="ns-coursenav" aria-label="Course example">
  <a class="ns-coursenav__back" href="#"><i class="ph ph-arrow-left" aria-hidden="true"></i> <span>Salesforce Admin</span></a>
  <span class="ns-topnav__divider" aria-hidden="true"></span>
  <span class="ns-coursenav__id">
    <span class="ns-coursenav__title">Objects, fields &amp; relationships</span>
  </span>
  <div class="ns-coursenav__progress">
    <span class="ns-coursenav__pct">29%</span>
    <div class="ns-coursenav__bar" role="progressbar" aria-label="Course progress" aria-valuenow="29" aria-valuemin="0" aria-valuemax="100" style="--p:29"><span></span></div>
  </div>
  <div class="ns-coursenav__actions">
    <button type="button" class="ns-navicon" aria-label="Previous lesson"><i class="ph ph-caret-left" aria-hidden="true"></i></button>
    <button type="button" class="ns-navicon" aria-label="Notes"><i class="ph ph-note" aria-hidden="true"></i></button>
    <button type="button" class="ns-navicon" aria-label="Toggle curriculum" aria-expanded="true"><i class="ph ph-sidebar" aria-hidden="true"></i></button>
    <a class="ns-navicon" href="#0" aria-label="Search the site"><i class="ph ph-magnifying-glass" aria-hidden="true"></i></a>
  </div>
</nav>` },
      { name: "Course bar on the stage", dark: true, flush: true, note: "<code>--dark</code> for a player whose video stage stays navy in both themes — the bar meets the stage rather than framing it in white.", html: `<nav class="ns-coursenav ns-coursenav--dark" aria-label="Dark course example">
  <a class="ns-coursenav__back" href="#"><i class="ph ph-arrow-left" aria-hidden="true"></i> <span>Apex for Admins</span></a>
  <span class="ns-topnav__divider" aria-hidden="true"></span>
  <span class="ns-coursenav__id">
    <span class="ns-coursenav__title">Writing your first trigger</span>
  </span>
  <div class="ns-coursenav__progress">
    <span class="ns-coursenav__pct">38%</span>
    <div class="ns-coursenav__bar" role="progressbar" aria-label="Course progress" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100" style="--p:38"><span></span></div>
  </div>
  <div class="ns-coursenav__actions">
    <button type="button" class="ns-navicon" aria-label="Previous lesson"><i class="ph ph-caret-left" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--white ns-btn--sm"><i class="ph ph-check-circle" aria-hidden="true"></i> Complete</button>
  </div>
</nav>` },
      { name: "Dashboard bar", flush: true, note: "Places, not pages: icons earn their space, the trigger opens what you were last in, and the avatar wears the trail's progress ring. Live: click <strong>Continue</strong> or the avatar. Full page: <a href=\"./demo-navbar-dashboard.html\">open the dashboard bar demo ↗</a>", html: `<nav class="ns-topnav ns-topnav--compact" aria-label="Dashboard example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <ul class="ns-topnav__links">
    <li><a href="#" aria-current="page"><i class="ph ph-squares-four" aria-hidden="true"></i> Dashboard</a></li>
    <li class="ns-navitem">
      <button type="button" class="ns-topnav__trigger" data-ns-menu aria-expanded="false" aria-controls="doc-continue"><i class="ph ph-play-circle" aria-hidden="true"></i> Continue</button>
      <div class="ns-navmenu" id="doc-continue">
        <p class="ns-navmenu__label">Pick up where you left off</p>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-play" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">Objects &amp; fields</span><span class="ns-navmenu__desc">Salesforce Admin · lesson 07 of 24</span></span>
        </a>
        <a class="ns-navmenu__item" href="#">
          <span class="ns-navmenu__icon"><i class="ph ph-code" aria-hidden="true"></i></span>
          <span><span class="ns-navmenu__title">Apex triggers</span><span class="ns-navmenu__desc">Developer trail · lesson 03 of 31</span></span>
        </a>
        <div class="ns-navmenu__foot"><span>2 in progress</span><a href="#">All courses →</a></div>
      </div>
    </li>
  </ul>
  <div class="ns-topnav__actions">
    <span class="ns-navstat"><i class="ph ph-lightning" aria-hidden="true"></i> <strong>12</strong> day streak</span>
    <a class="ns-navicon" href="#" aria-label="Notifications — 3 unread"><i class="ph ph-bell" aria-hidden="true"></i><span class="ns-navicon__badge" aria-hidden="true">3</span></a>
    <button type="button" class="ns-themeswitch" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
      <span class="ns-themeswitch__mark" aria-hidden="true"></span>
    </button>
    <span class="ns-topnav__divider" aria-hidden="true"></span>
    <div class="ns-usermenu">
      <button type="button" class="ns-usermenu__trigger" data-ns-menu aria-expanded="false" aria-controls="doc-dash-account" aria-label="Account menu for Aarti Kulkarni">
        <span class="ns-avatar-ring" style="--p:29"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">AK</span></span>
      </button>
      <div class="ns-usermenu__panel" id="doc-dash-account">
        <div class="ns-usermenu__head">
          <span class="ns-avatar" aria-hidden="true">AK</span>
          <span class="ns-usermenu__identity"><span class="ns-usermenu__fullname">Aarti Kulkarni</span><span class="ns-usermenu__email">aarti@example.com</span></span>
          <span class="ns-usermenu__plan">Pro</span>
        </div>
        <div class="ns-usermenu__progress">
          <span class="ns-usermenu__progress-label"><span>Admin trail</span><span>29%</span></span>
          <progress class="ns-progress" value="29" max="100" aria-label="Admin trail progress">29%</progress>
        </div>
        <hr class="ns-menu__sep">
        <a class="ns-menu__item" href="#"><i class="ph ph-user" aria-hidden="true"></i> Profile</a>
        <a class="ns-menu__item" href="#"><i class="ph ph-gear" aria-hidden="true"></i> Settings</a>
      </div>
    </div>
  </div>
</nav>` },
      { name: "Bar pieces", note: "The two parts these bars add to the vocabulary. <code>.ns-navicon</code> is the icon-only action — square, hairline on hover, an aria-label always, and a badge that is a COUNT rather than a bare dot, because a dot tells a screen-reader user nothing. <code>.ns-navstat</code> is one mono metric; two at most.", html: `<button type="button" class="ns-navicon" aria-label="Notifications"><i class="ph ph-bell" aria-hidden="true"></i></button>
<button type="button" class="ns-navicon" aria-label="Notifications — 3 unread"><i class="ph ph-bell" aria-hidden="true"></i><span class="ns-navicon__badge" aria-hidden="true">3</span></button>
<button type="button" class="ns-navicon" aria-label="Toggle curriculum" aria-expanded="true"><i class="ph ph-sidebar" aria-hidden="true"></i></button>
<button type="button" class="ns-navicon" aria-label="Notes"><i class="ph ph-note" aria-hidden="true"></i></button>
<span class="ns-navstat"><i class="ph ph-lightning" aria-hidden="true"></i> <strong>12</strong> day streak</span>
<span class="ns-navstat"><i class="ph ph-timer" aria-hidden="true"></i> <strong>48</strong> min today</span>` },
    ],
  },
  {
    id: "themetoggle", title: "Theme toggle", family: "Navigation",
    summary: "Two forms of one control — a quiet square and a bordered one, both a sun that morphs into a moon — plus the segmented Light · Auto · Dark. All flip the theme through <code>window.nsTheme</code> so the Ghost theme and the app can never disagree about what dark means. The segmented form offers Light · Auto · Dark, and <strong>Auto is the default</strong> — a two-state toggle silently converts every visitor into someone with an explicit preference, after which their OS switching at sunset does nothing.",
    use: ["The switch in the navbar actions cluster — the default", "The segmented form where Auto matters: settings pages, and the mobile sheet", "The icon square in a bar with nothing left to give — the course bar on a phone"],
    not: ["Deciding the initial theme in the component — assets/js/theme-init.js sets it before first paint, and doing it after hydration IS the white flash everyone complains about", "An unlabelled icon button — aria-label or it is a mystery control", "Animating the whole page on switch: the swap is instant, only the mark morphs"],
    a11y: ["Segmented is a real radiogroup: one tab stop, arrow keys inside, aria-checked on the selected option", "The icon form is role=\"switch\" with aria-checked and an accessible name", "The state is decided in CSS from data-theme, so it is correct in the first painted frame with no JavaScript having run", "prefers-reduced-motion drops the morph to instant"],
    variants: [
      { name: "Switch", note: "Live — it drives this page, and the default in a bar. ONE button, and the sun <strong>morphs into the moon in place</strong>.<br><br>It used to be a knob sliding along a track. Two problems, and the second is the one that mattered: the knob carried <code>ph-sun</code> / <code>ph-moon</code>, neither of which is in the icon subset, so it was empty in both states — a switch with no indicator at all. And a sliding track is the wrong metaphor anyway; it says \"setting with two positions\" when what the reader wants to know is which mode they are in and how to leave it. A sun that becomes a moon says both in one shape.<br><br>Drawn, not set: one disc; <strong>eight tapered rays</strong> from a repeating conic gradient masked to an annulus; and a second disc the colour of the surface sliding across to bite the crescent. The rays were four box-shadows to begin with, which are round dots — a sun drawn with dots reads as a loading spinner. Going dark, the rays turn as they retract, the disc tips and grows, and the crescent closes: one movement, one element, no font. The state is read from <code>data-theme</code> in CSS, so it is right in the first painted frame.", html: `<button type="button" class="ns-themeswitch" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
  <span class="ns-themeswitch__mark" aria-hidden="true"></span>
</button>` },
      { name: "Segmented", note: "Live — it drives this page. Mono words rather than glyphs: every product draws the \"auto\" icon differently and none of them is read correctly, while a mono label is this system's own material. The thumb is a pseudo-element positioned by :has() reading aria-checked, so there is no state class and no JavaScript in the animation.", html: `<div class="ns-themetoggle" role="radiogroup" aria-label="Colour theme" data-ns-theme>
  <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Light" data-ns-theme-value="light">Light</button>
  <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="true" aria-label="Match the system setting" data-ns-theme-value="system">Auto</button>
  <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Dark" data-ns-theme-value="dark">Dark</button>
</div>` },
      { name: "Icon switch", note: "Live. The same mark and the same morph, in a bordered square — for a bar where the control needs to read as a button among buttons rather than as a quiet affordance.", html: `<button type="button" class="ns-themetoggle-icon" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
  <span class="ns-themeswitch__mark" aria-hidden="true"></span>
</button>` },
      { name: "The mark, enlarged", note: "The indicator on its own, enlarged. Click either control above and watch it.<br><br>The sun and the moon are <strong>drawn, not set</strong>: the icon font is a subset and carries neither, so the glyph pair this used to be rendered as two empty elements — a control with no indicator in either state. One disc; eight tapered rays from a conic gradient masked to a ring; a second disc the colour of the surface sliding across to bite the crescent. The rays turn as they retract, so the change is a rotation rather than a fade, and it costs no font at all. <code>prefers-reduced-motion</code> drops it to instant.", html: `<span style="display:inline-flex;align-items:center;gap:var(--space-6)">
  <span class="ns-themeswitch__mark" style="inline-size:var(--space-6);block-size:var(--space-6)"></span>
  <span style="font-size:var(--size-small);color:var(--color-muted);max-inline-size:22rem">The mark on its own, enlarged. Flip the page theme and the rays retract, the disc turns and the crescent closes — one movement, no glyph swap.</span>
</span>` },
      { name: "On a navy bar", dark: true, flush: true, note: "Both forms pick up the on-dark inks from the bar, so neither needs a variant of its own.", html: `<nav class="ns-topnav ns-topnav--dark" aria-label="Theme on dark example">
  <a class="ns-topnav__brand" href="#"><img src="../assets/logo/favicon.svg" alt=""><span class="ns-topnav__brand-name">Namaste Salesforce</span></a>
  <div class="ns-topnav__actions">
    <div class="ns-themetoggle" role="radiogroup" aria-label="Colour theme">
      <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Light">Light</button>
      <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="true" aria-label="Match the system setting">Auto</button>
      <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Dark">Dark</button>
    </div>
    <button type="button" class="ns-themetoggle-icon" role="switch" aria-checked="false" aria-label="Dark mode">
      <i class="ph ph-sun" aria-hidden="true"></i><i class="ph ph-moon" aria-hidden="true"></i>
    </button>
  </div>
</nav>` },
    ],
  },

  /* ============================================================ Code ==== */
  {
    id: "code", title: "Syntax highlighter", family: "CMS",
    summary: "The system's code surface — a title bar with the file name, copy / ask-AI / share / wrap actions, line numbers, diff-marked lines, and a footer whose one job is Run. Three chromes (block, mac, vscode) differ ONLY in the bar: the body, the palette, the footer and every interaction are identical, because a code block whose copy button moves depending on its skin is two components pretending to be one. Highlighting happens at build time via <code>components/core/highlight.js</code>, which maps any grammar onto seven roles — adding a language means adding a keyword list, never a colour.",
    use: ["Lesson and docs code samples — anything longer than a term", "A multi-file sample, as vscode tabs", "Showing a change: added, removed and called-out lines", "A runnable snippet, where the product supplies the runner"],
    not: ["A single term inside a sentence — that is <code>.ns-code-inline</code>", "An editor. This renders code; it does not edit it", "Highlighting on the client — the markup arrives tokenised, so readers do not download a grammar to re-derive what the build already knew"],
    a11y: [
      "Line numbers live in a separate aria-hidden gutter, so they are never announced and never land in the clipboard",
      "The Ask-AI and Share menus are native popovers: light-dismiss, Esc and focus return come from the platform, not from a re-implementation",
      "The tab strip is a real tablist — arrow keys, Home/End, and one tab stop for the whole strip",
      "Run's result renders into an aria-live=\"polite\" output, so the outcome of the button you pressed is announced",
      "Every icon-only control (wrap, share) carries an aria-label; the copy confirmation is a text change, not a colour change",
      "The seven syntax roles all clear 4.5:1 on their own surface in both themes — syntax colour is decoration on top of code that reads without it",
    ],
    variants: [
      { name: "Anatomy", note: "Bar, body, and the four chrome actions. The file name is always mono and always present — a code block without a name is a code block you cannot refer to. Live: copy, wrap, and both menus work on this page.", html: `<figure class="ns-code" data-lang="apex">
  <figcaption class="ns-code__bar">
    <span class="ns-code__file"><i class="ph ph-code" aria-hidden="true"></i><span>CaseRouter.cls</span></span>
    <span class="ns-code__actions">
      <span class="ns-code__lang">apex</span>
      <button type="button" class="ns-code__btn ns-code__btn--icon" data-code="wrap" aria-pressed="false" aria-label="Wrap long lines"><i class="ph ph-text-align-justify" aria-hidden="true"></i></button>
      <button type="button" class="ns-code__btn" popovertarget="ai-anatomy"><i class="ph ph-sparkle" aria-hidden="true"></i><span class="ns-code__btn-label">Ask AI</span></button>
      <div id="ai-anatomy" popover="auto" class="ns-popover ns-menu ns-code__menu">
        <p class="ns-menu__label">Ask about this code</p>
        <a class="ns-menu__item" href="https://claude.ai/new" target="_blank" rel="noopener"><i class="ph ph-sparkle" aria-hidden="true"></i>Ask Claude</a>
        <button type="button" class="ns-menu__item" data-code="ask" data-provider="explain"><i class="ph ph-lightbulb" aria-hidden="true"></i>Explain this code</button>
        <button type="button" class="ns-menu__item" data-code="ask" data-provider="tests"><i class="ph ph-list-checks" aria-hidden="true"></i>Write tests for it</button>
        <button type="button" class="ns-menu__item" data-code="ask" data-provider="review"><i class="ph ph-magnifying-glass" aria-hidden="true"></i>Review for bugs</button>
        <p class="ns-code__menu-note">The code and its language go to the assistant you pick. Nothing leaves the page until you choose one.</p>
      </div>
      <button type="button" class="ns-code__btn ns-code__btn--icon" popovertarget="share-anatomy" aria-label="Share this snippet"><i class="ph ph-share-network" aria-hidden="true"></i></button>
      <div id="share-anatomy" popover="auto" class="ns-popover ns-menu ns-code__menu">
        <p class="ns-menu__label">Share</p>
        <button type="button" class="ns-menu__item" data-code="share"><i class="ph ph-link-simple" aria-hidden="true"></i>Copy link</button>
        <button type="button" class="ns-menu__item" data-code="share" data-share="native"><i class="ph ph-arrow-up-right" aria-hidden="true"></i>Share via&hellip;</button>
      </div>
      <button type="button" class="ns-code__btn" data-code="copy"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-code__btn-label"><span>Copy</span></span></button>
    </span>
  </figcaption>
${codeBody(`public with sharing class CaseRouter {
  // Route new cases to the right queue.
  public static void route(List<Case> cases) {
    for (Case c : cases) c.OwnerId = queueFor(c.Origin);
  }
}`, "apex")}
</figure>` },

      { name: "mac window", note: "Traffic lights and a centred title. The dots are drawn from the STATUS tokens, not from literal red/amber/green — the shape quotes macOS, the palette stays this system's. They carry no behaviour and are aria-hidden: a window control that does not control a window must not be a button.", html: `<figure class="ns-code ns-code--mac" data-lang="javascript">
  <figcaption class="ns-code__bar">
    <span class="ns-code__dots" aria-hidden="true"><i></i><i></i><i></i></span>
    <span class="ns-code__file"><span>useCourseProgress.js</span></span>
    <span class="ns-code__actions">
      <button type="button" class="ns-code__btn" data-code="copy"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-code__btn-label"><span>Copy</span></span></button>
    </span>
  </figcaption>
${codeBody(`export function useCourseProgress(id) {
  const [done, setDone] = useState(0);
  useEffect(() => { fetchProgress(id).then(setDone); }, [id]);
  return done;
}`, "javascript")}
</figure>` },

      { name: "vscode window", note: "A tab strip above and a brand status bar below. The active tab is the one whose background matches the code underneath it — a tab is a piece cut out of the editor surface, which is the whole visual idea. The 2px top accent is the same current-item device the navbar uses. Live: click the tabs, or use arrow keys.", html: `<figure class="ns-code ns-code--vscode" data-lang="apex">
  <div class="ns-code__tabs" role="tablist" aria-label="Sample files">
    <button type="button" role="tab" class="ns-code__tab" aria-selected="true" tabindex="0" aria-controls="vs-p1" id="vs-t1"><i class="ph ph-code" aria-hidden="true"></i>CaseRouter.cls</button>
    <button type="button" role="tab" class="ns-code__tab" aria-selected="false" tabindex="-1" aria-controls="vs-p2" id="vs-t2"><i class="ph ph-code" aria-hidden="true"></i>CaseRouterTest.cls</button>
    <button type="button" role="tab" class="ns-code__tab" aria-selected="false" tabindex="-1" aria-controls="vs-p3" id="vs-t3"><i class="ph ph-code" aria-hidden="true"></i>queues.soql</button>
  </div>
  <div role="tabpanel" id="vs-p1" aria-labelledby="vs-t1">
${codeBody(`public with sharing class CaseRouter {
  public static void route(List<Case> cases) {
    for (Case c : cases) c.OwnerId = queueFor(c.Origin);
  }
}`, "apex")}
  </div>
  <div role="tabpanel" id="vs-p2" aria-labelledby="vs-t2" hidden>
${codeBody(`@isTest
private class CaseRouterTest {
  @isTest static void routesWebCases() {
    System.assertEquals(1, 1, 'placeholder');
  }
}`, "apex")}
  </div>
  <div role="tabpanel" id="vs-p3" aria-labelledby="vs-t3" hidden>
${codeBody(`SELECT Id, Name FROM Group
WHERE Type = 'Queue'
ORDER BY Name ASC`, "soql")}
  </div>
  <div class="ns-code__foot">
    <span class="ns-code__status"><i class="ph ph-check-circle" aria-hidden="true"></i>Saved</span>
    <span class="ns-code__meta">apex &middot; UTF-8 &middot; LF</span>
  </div>
</figure>` },

      { name: "Run", note: "Run lives in the footer and nowhere else — it is the one action here that changes something, and putting it beside Copy would set a state-changing button one pixel from a harmless one. It does NOT execute anything: it raises <code>ns:code-run</code> and waits for the host to call <code>done()</code>. A design system that evaluated the code in its own docs would be a security hole with a play button on it. This demo carries <code>data-output</code>, which is the documented stand-in.", html: `<figure class="ns-code" data-lang="soql" data-output="Rows: 3
Support Queue        &middot; 00G5g000004bYtR
Escalations Queue    &middot; 00G5g000004bYtS
Partner Queue        &middot; 00G5g000004bYtT

Completed in 0.42s">
  <figcaption class="ns-code__bar">
    <span class="ns-code__file"><i class="ph ph-database" aria-hidden="true"></i><span>queues.soql</span></span>
    <span class="ns-code__actions">
      <span class="ns-code__lang">soql</span>
      <button type="button" class="ns-code__btn" data-code="copy"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-code__btn-label"><span>Copy</span></span></button>
    </span>
  </figcaption>
${codeBody(`SELECT Id, Name, DeveloperName
FROM Group
WHERE Type = 'Queue'
ORDER BY Name ASC LIMIT 200`, "soql")}
  <div class="ns-code__foot">
    <button type="button" class="ns-code__run" data-code="run"><i class="ph ph-play" aria-hidden="true"></i>Run</button>
    <span class="ns-code__status" data-code-status></span>
    <span class="ns-code__meta">4 lines &middot; 118 B</span>
  </div>
  <output class="ns-code__out" aria-live="polite" hidden></output>
</figure>` },

      { name: "Marked lines", note: "Added, removed and called-out lines — a 2px leading edge plus a wash, the same accent-line device the rest of the system uses. Diff colour is never the only signal: the sample is introduced in prose, because a red line and a green line are one colour to a monochromat.", html: `<figure class="ns-code" data-lang="apex">
  <figcaption class="ns-code__bar">
    <span class="ns-code__file"><i class="ph ph-git-branch" aria-hidden="true"></i><span>CaseRouter.cls &mdash; the bulkification fix</span></span>
    <span class="ns-code__actions"><button type="button" class="ns-code__btn" data-code="copy"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-code__btn-label"><span>Copy</span></span></button></span>
  </figcaption>
${codeBody(`public static void route(List<Case> cases) {
  Map<String, Id> queues = queueMap();
  for (Case c : cases) {
    c.OwnerId = [SELECT Id FROM Group WHERE DeveloperName = :c.Origin].Id;
    c.OwnerId = queues.get(c.Origin);
  }
}`, "apex", { del: [4], add: [5], mark: [2] })}
</figure>` },

      { name: "On the console surface", note: "<code>--dark</code> forces the navy console on a light page, which is what a docs body wants: code should look like code, not like an indented paragraph. Under <code>[data-theme=\"dark\"]</code> every block goes here automatically, so this modifier is only for the light-page case.", dark: true, html: `<figure class="ns-code ns-code--dark" data-lang="bash">
  <figcaption class="ns-code__bar">
    <span class="ns-code__file"><i class="ph ph-terminal-window" aria-hidden="true"></i><span>deploy.sh</span></span>
    <span class="ns-code__actions"><button type="button" class="ns-code__btn" data-code="copy"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-code__btn-label"><span>Copy</span></span></button></span>
  </figcaption>
${codeBody(`# Deploy the metadata, then run the local tests only.
sf project deploy start --source-dir force-app --test-level RunLocalTests --wait 30`, "bash")}
</figure>` },

      { name: "Compact, no gutter, inline", note: "<code>--compact</code> tightens leading and drops a size, for a sample set beside prose rather than under a heading. Dropping the gutter is right whenever the lines are not going to be referred to by number. The inline chip is the one-liner sibling: same mono, same sunken chip, no chrome.", html: `<figure class="ns-code ns-code--compact" data-lang="javascript">
  <figcaption class="ns-code__bar">
    <span class="ns-code__file"><span>tokens.js</span></span>
    <span class="ns-code__actions"><button type="button" class="ns-code__btn" data-code="copy"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-code__btn-label"><span>Copy</span></span></button></span>
  </figcaption>
${codeBodyPlain(`import { tokens } from "@namaste-salesforce/design-system";`, "javascript")}
</figure>
<p>Set the reading weight with <code class="ns-code-inline">--weight-body</code>, never with <code class="ns-code-inline">font-weight: 400</code>.</p>` },
    ],
  },

  /* ========================================================== Media ==== */
  {
    id: "image", title: "Image", family: "Media",
    summary: "A picture in the card frame: hairline, 6px radius, predictable crops via aspect modifiers. The caption is mono, below the frame — never overlaid on the image.",
    use: ["Screenshots, diagrams, course art in content", "Anything that needs a caption or a fixed aspect"],
    not: ["People — Avatar", "Video posters — Video"],
    a11y: ["alt describes what the image shows; empty alt only if truly decorative", "The caption supplements alt, it does not replace it"],
    variants: [
      { name: "Aspect ratios", html: `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap-grid);inline-size:100%">
  <figure class="ns-figure ns-figure--16x9"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>16 : 9</figcaption></figure>
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>4 : 3</figcaption></figure>
  <figure class="ns-figure ns-figure--square"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>1 : 1</figcaption></figure>
</div>` },
      { name: "With caption", html: `<figure class="ns-figure ns-figure--16x9" style="max-inline-size:24rem">
  <span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span>
  <figcaption>Fig 01 · The training trail</figcaption>
</figure>` },
      { name: "Plain", note: "No frame — for transparent illustrations that carry their own shape.", html: `<figure class="ns-figure ns-figure--plain" style="max-inline-size:16rem">
  <span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span>
</figure>` },
    ],
  },
  {
    id: "video", title: "Video", family: "Media",
    summary: "The frame for an embed or a poster — 16:9 by default, vertical for a Short, square for a feed clip. The play control is the system's one allowed scale-pop; duration sits mono in one corner and the kind of clip in the other. Everything past the frame — chapters, the modal, the strip — is composed from parts that already exist rather than reinvented here.",
    use: ["Lesson videos, promo embeds, an article's explainer", "Poster + play where the player loads on demand", "A chapter list under a long embed, so a reader can enter at the part they came for"],
    not: ["Ambient autoplay background video — this system does not do that", "Letterboxing a 9:16 source into a 16:9 box to keep a grid tidy. That wastes two thirds of the frame and is the single most common way an embedded Short looks broken — use --9x16", "A carousel that auto-advances. The shorts strip scrolls when the reader scrolls it"],
    a11y: [
      "The play button names its video: aria-label=\"Play: What is an org?\"",
      "Embedded players keep captions on by default where the platform allows",
      "Chapter buttons are real buttons carrying a real timecode in text — a chapter list whose times are only visual is unusable to anyone who cannot see the scrubber",
      "The hover preview also fires on :focus-within, so a keyboard user gets the same answer to \"is this the clip I mean\" that a mouse user gets",
      "prefers-reduced-motion stops the preview and the zoom outright. A video that starts playing because a pointer passed over it is exactly the motion that setting exists to stop",
    ],
    variants: [
      { name: "Poster + play", html: `<div class="ns-video" style="max-inline-size:26rem">
  <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
  <button class="ns-video__play" aria-label="Play: What is an org?"><i class="ph ph-play" aria-hidden="true"></i></button>
  <span class="ns-video__tag">Lesson</span>
  <span class="ns-video__dur">08:12</span>
</div>` },
      { name: "Embed frame", note: "Drop any iframe in — the frame owns ratio, border and radius.", html: `<div class="ns-video" style="max-inline-size:26rem">
  <iframe src="about:blank" title="Lesson video"></iframe>
</div>` },
      { name: "With a caption", note: "No caption element of its own: a captioned video is <code>.ns-figure</code> with a <code>.ns-video</code> inside it. The mono caption, the stacking and the spacing are already solved there, and a second implementation would drift from the one under every image on the site.", html: `<figure class="ns-figure" style="max-inline-size:26rem;inline-size:100%">
  <div class="ns-video">
    <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Apex basics — lesson 01"
            allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>
  </div>
  <figcaption>Lesson 01 · What is an org? · 08:12</figcaption>
</figure>` },
      { name: "Chapters and timestamps", note: "Composes <code>.ns-vchapters</code> — the same list the lesson player uses, which was never player-only CSS. A long embed without one makes a reader who came for the SOQL bit at 6:40 scrub for it, and a chapter list is also what a platform reads to draw markers on its own scrubber. Click a row: in the styleguide it just moves the mark and the readout; in product it sets <code>video.currentTime</code>, or appends <code>&amp;start=</code> to the embed URL.", script: `document.querySelectorAll('[data-chapters]').forEach(function (list) {
  var out = document.querySelector(list.getAttribute('data-chapters'));
  list.querySelectorAll('.ns-vchapters__btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      list.querySelectorAll('.ns-vchapters__item').forEach(function (i) { i.removeAttribute('aria-current'); });
      btn.closest('.ns-vchapters__item').setAttribute('aria-current', 'true');
      if (out) out.textContent = btn.querySelector('.ns-vchapters__time').textContent;
    });
  });
});`, html: `<figure class="ns-figure" style="max-inline-size:30rem;inline-size:100%">
  <div class="ns-video">
    <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
    <button class="ns-video__play" aria-label="Play: Governor limits"><i class="ph ph-play" aria-hidden="true"></i></button>
    <span class="ns-video__dur">12:30</span>
  </div>
  <figcaption>Seeking to <span data-hook="at">00:00</span></figcaption>
  <ul class="ns-vchapters" data-chapters="[data-hook='at']">
    <li class="ns-vchapters__item" aria-current="true">
      <button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">00:00</span><span class="ns-vchapters__title">What a governor limit is</span></button>
    </li>
    <li class="ns-vchapters__item">
      <button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">02:14</span><span class="ns-vchapters__title">Per transaction, not per record</span></button>
    </li>
    <li class="ns-vchapters__item">
      <button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">06:40</span><span class="ns-vchapters__title">The SOQL-in-a-loop failure</span></button>
    </li>
    <li class="ns-vchapters__item">
      <button type="button" class="ns-vchapters__btn"><span class="ns-vchapters__time">09:58</span><span class="ns-vchapters__title">Bulkifying it</span></button>
    </li>
  </ul>
</figure>` },
      { name: "Ratios", note: "A video is 16:9 until the platform says otherwise, and the two that say otherwise are vertical and square. <code>--9x16</code> caps its own width at 22rem — about a phone at arm's length — because an uncapped vertical video is a two-metre column on a desktop.", html: `<div style="display:flex;flex-wrap:wrap;gap:var(--space-4);align-items:flex-start">
  <div class="ns-video ns-video--9x16" style="inline-size:9rem">
    <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
    <span class="ns-video__tag">Short</span><span class="ns-video__dur">0:42</span>
  </div>
  <div class="ns-video ns-video--1x1" style="inline-size:11rem">
    <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
    <span class="ns-video__tag">Clip</span><span class="ns-video__dur">1:05</span>
  </div>
  <div class="ns-video ns-video--21x9" style="inline-size:20rem">
    <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
    <span class="ns-video__dur">02:18</span>
  </div>
</div>` },
      { name: "Effects", note: "Two, and both act on the POSTER — the frame and the controls stay still. Hover or tab to the left one and a muted loop crossfades in, which is the one genuinely useful motion on a thumbnail: it answers &ldquo;is this the clip I mean&rdquo; without a page load. The right one is a slow scale, clipped by the frame. Both stop dead under <code>prefers-reduced-motion</code>. With no <code>__preview</code> element the modifier does nothing, which is the correct failure.", html: `<div style="display:flex;flex-wrap:wrap;gap:var(--space-4)">
  <div class="ns-video ns-video--hover" tabindex="0" style="inline-size:14rem">
    <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
    <span class="ns-video__preview" aria-hidden="true" style="background:var(--color-brand-600);display:grid;place-items:center;color:var(--color-on-dark);font-family:var(--font-mono);font-size:var(--size-label)">PREVIEW LOOP</span>
    <span class="ns-video__dur">0:42</span>
  </div>
  <div class="ns-video ns-video--zoom" style="inline-size:14rem">
    <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
    <span class="ns-video__dur">1:05</span>
  </div>
</div>` },
      { name: "Shorts strip", note: "Vertical video is the one format where a strip beats a grid: the clips are short, the decision is fast, and a grid of 9:16 tiles pushes everything else below two screens of thumbnails. Same scroll-snap mechanics as Carousel — a shaped instance of it, not a second scroller, so swipe, snap and scrollbar handling are inherited and cannot drift.", html: `<div class="ns-shorts" style="inline-size:100%">
  <div class="ns-shorts__track" tabindex="0" aria-label="Shorts">
    <a class="ns-shorts__item" href="#0">
      <div class="ns-video ns-video--9x16"><span class="ns-video__poster ns-ph" aria-hidden="true"></span><span class="ns-video__tag">Short</span><span class="ns-video__dur">0:42</span></div>
      <span class="ns-shorts__cap">The one SOQL mistake that crashes 40k records</span>
      <span class="ns-shorts__meta">18k views</span>
    </a>
    <a class="ns-shorts__item" href="#0">
      <div class="ns-video ns-video--9x16"><span class="ns-video__poster ns-ph" aria-hidden="true"></span><span class="ns-video__tag">Short</span><span class="ns-video__dur">0:55</span></div>
      <span class="ns-shorts__cap">Profiles vs permission sets in 55 seconds</span>
      <span class="ns-shorts__meta">31k views</span>
    </a>
    <a class="ns-shorts__item" href="#0">
      <div class="ns-video ns-video--9x16"><span class="ns-video__poster ns-ph" aria-hidden="true"></span><span class="ns-video__tag">Short</span><span class="ns-video__dur">0:38</span></div>
      <span class="ns-shorts__cap">Why your test passes and production fails</span>
      <span class="ns-shorts__meta">9k views</span>
    </a>
    <a class="ns-shorts__item" href="#0">
      <div class="ns-video ns-video--9x16"><span class="ns-video__poster ns-ph" aria-hidden="true"></span><span class="ns-video__tag">Short</span><span class="ns-video__dur">1:02</span></div>
      <span class="ns-shorts__cap">Flow or Apex? Six questions</span>
      <span class="ns-shorts__meta">24k views</span>
    </a>
  </div>
</div>` },
      { name: "Video modal", note: "A poster on the page; the player loads only inside the dialog when it opens, so the page never carries a hidden playing embed. <code>--video</code> widens the dialog to the video's shape and drops the card padding — a 16:9 embed inside a 32rem column with padding on both sides is a postage stamp with a title over it. Esc and the scrim close it, and closing empties the iframe to stop playback.", script: `document.querySelectorAll('[data-video-modal]').forEach(function (btn) {
  var dlg = document.getElementById(btn.getAttribute('data-video-modal'));
  var frame = dlg.querySelector('iframe');
  btn.addEventListener('click', function () { frame.src = frame.getAttribute('data-src'); dlg.showModal(); });
  dlg.addEventListener('close', function () { frame.src = 'about:blank'; });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
});`, html: `<p style="display:flex;flex-wrap:wrap;gap:var(--space-3);align-items:center">
  <button type="button" class="ns-btn ns-btn--outline ns-btn--sm" data-video-modal="vm-demo"><i class="ph ph-play-circle" aria-hidden="true"></i> Watch the walkthrough</button>
  <span class="ns-shorts__meta">or the poster below — either opens it</span>
</p>
<div class="ns-video" style="max-inline-size:26rem">
  <span class="ns-video__poster ns-ph" aria-hidden="true"></span>
  <button class="ns-video__play" data-video-modal="vm-demo" aria-label="Play: What is an org?"><i class="ph ph-play" aria-hidden="true"></i></button>
  <span class="ns-video__dur">08:12</span>
</div>
<dialog class="ns-modal ns-modal--video" id="vm-demo" aria-label="What is an org? — video">
  <div class="ns-modal__header">
    <h2 class="ns-modal__title">What is an org?</h2>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm ns-modal__close" aria-label="Close" onclick="this.closest('dialog').close()"><i class="ph ph-x" aria-hidden="true"></i></button>
  </div>
  <div class="ns-modal__body">
    <div class="ns-video">
      <iframe src="about:blank" data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1" title="What is an org?"
              allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
    </div>
  </div>
</dialog>` },
    ],
  },
  {
    id: "gallery", title: "Gallery", family: "Media",
    summary: "A grid of figures. Auto-fills to the space; --two and --three lock counts for curated sets. Captions stay under each frame — a gallery is figures, not a mosaic wall.",
    use: ["Screenshot sets in docs and lessons", "Curated pairs/trios of course art"],
    not: ["A feed of cards — Card grid", "One image — Image"],
    a11y: ["Each image keeps its own alt; the gallery adds nothing to announce"],
    variants: [
      { name: "Auto grid", html: `<div class="ns-gallery" style="inline-size:100%">
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>Setup</figcaption></figure>
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>Trail</figcaption></figure>
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>Deploy</figcaption></figure>
</div>` },
      { name: "Two-up", note: "Locked pair — before/after, light/dark.", html: `<div class="ns-gallery ns-gallery--two" style="inline-size:100%">
  <figure class="ns-figure ns-figure--16x9"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>Before</figcaption></figure>
  <figure class="ns-figure ns-figure--16x9"><span class="ns-figure__frame"><span class="ns-ph" aria-hidden="true"></span></span><figcaption>After</figcaption></figure>
</div>` },
    ],
  },
  {
    id: "carousel", title: "Carousel", family: "Media",
    summary: "Scroll-snap, no JS required: slides swipe on touch and scroll-wheel on desktop; prev/next are the system's own outline icon buttons wired to scrollBy. Slides hold cards, figures, quotes — the carousel is only the rail.",
    use: ["A shelf of courses/resources wider than the viewport", "Testimonials, related lessons at an article's foot"],
    not: ["Hero carousels that auto-rotate — nothing in this system moves uninvited", "Content users must not miss — a carousel hides everything after slide two"],
    a11y: ["The track is keyboard-scrollable (tabindex on the region, arrow keys native)", "Prev/next buttons are real buttons with labels; no dots-only navigation"],
    variants: [
      { name: "Card shelf", note: "Snap-start slides; the nav buttons scroll one viewport.", script: `document.querySelectorAll('.ns-carousel').forEach(function (c) {
  var track = c.querySelector('.ns-carousel__track');
  c.querySelectorAll('[data-dir]').forEach(function (b) {
    b.addEventListener('click', function () {
      track.scrollBy({ left: (b.getAttribute('data-dir') === 'next' ? 1 : -1) * track.clientWidth * 0.9, behavior: 'smooth' });
    });
  });
});`, html: `<div class="ns-carousel" style="inline-size:100%">
  <div class="ns-carousel__track" tabindex="0" role="region" aria-label="Popular courses">
    <div class="ns-carousel__slide ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><span class="ns-card__title">Apex basics</span><p class="ns-card__text">The platform's own language from zero.</p></div><div class="ns-card__foot">12 lessons</div></div>
    <div class="ns-carousel__slide ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><span class="ns-card__title">Flows</span><p class="ns-card__text">Declarative automation, end to end.</p></div><div class="ns-card__foot">9 lessons</div></div>
    <div class="ns-carousel__slide ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><span class="ns-card__title">Admin cert</span><p class="ns-card__text">The exam path, in order.</p></div><div class="ns-card__foot">14 lessons</div></div>
    <div class="ns-carousel__slide ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><span class="ns-card__title">LWC</span><p class="ns-card__text">Components the platform way.</p></div><div class="ns-card__foot">11 lessons</div></div>
  </div>
  <div class="ns-carousel__nav">
    <button class="ns-btn ns-btn--outline ns-btn--sm ns-btn--icon" data-dir="prev" aria-label="Previous"><i class="ph ph-caret-left" aria-hidden="true"></i></button>
    <button class="ns-btn ns-btn--outline ns-btn--sm ns-btn--icon" data-dir="next" aria-label="Next"><i class="ph ph-caret-right" aria-hidden="true"></i></button>
  </div>
</div>` },
    ],
  },

  /* ======================================================= Sections ==== */
  {
    id: "footer", title: "Footer", family: "Sections",
    summary: "Link columns over a mono bottom bar, one hairline on top. Column heads speak the kicker voice; --slim keeps only the bar for app screens; --dark closes a navy page.",
    use: ["The site footer — columns for product, learn, company", "App screens — the slim bar alone"],
    not: ["A CTA — that is CTA band, directly above the footer"],
    a11y: ["A <footer> landmark; column heads are real headings for rotor navigation"],
    variants: [
      { name: "Default", html: `<footer class="ns-footer" style="inline-size:100%">
  <div class="ns-footer__grid">
    <div class="ns-footer__col"><p class="ns-footer__head">Learn</p><ul><li><a href="#">Courses</a></li><li><a href="#">Training roadmap</a></li><li><a href="#">Docs</a></li></ul></div>
    <div class="ns-footer__col"><p class="ns-footer__head">Content</p><ul><li><a href="#">Blog</a></li><li><a href="#">YouTube</a></li><li><a href="#">Newsletter</a></li></ul></div>
    <div class="ns-footer__col"><p class="ns-footer__head">Project</p><ul><li><a href="#">GitHub</a></li><li><a href="#">Design system</a></li><li><a href="#">License</a></li></ul></div>
  </div>
  <div class="ns-footer__bar"><span>© 2026 Namaste Salesforce</span><span class="ns-footer__spacer"></span><a href="#">Privacy</a><a href="#">Terms</a></div>
</footer>` },
      { name: "Slim", note: "The bar alone — app screens where the page owns the space.", html: `<footer class="ns-footer" style="inline-size:100%">
  <div class="ns-footer__bar"><span>© 2026 Namaste Salesforce</span><span class="ns-footer__spacer"></span><a href="#">Privacy</a><a href="#">Terms</a></div>
</footer>` },
    ],
  },
  /* ============================================ Course page blocks ==== */
  {
    id: "outcomes", title: "What you'll learn", family: "LMS",
    summary: "The promise list. Ticked outcomes in two columns, each one a thing the learner can DO afterwards — not a topic the course covers. The single most-read block on a course page after the title, and the one most often written as a syllabus by mistake.",
    use: ["Every course detail page, directly under the hero", "A module page, scoped to that module", "<code>--single</code> in a narrow rail"],
    not: ["A syllabus — that is Curriculum, and it lists lessons rather than abilities", "Marketing claims. \"Become a Salesforce expert\" is not an outcome; \"write a trigger that survives a 200-record load\" is"],
    a11y: ["A real <code>&lt;ul&gt;</code>, so the count is announced — a grid of divs is a paragraph to a screen reader", "The tick is decorative and aria-hidden; the outcome is the text"],
    variants: [
      { name: "Two columns", note: "The default. Outcomes start with a verb, because the reader is buying an ability.", html: `<ul class="ns-outcomes" style="inline-size:100%">
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Write a trigger that survives a 200-record data load</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Query with SOQL and know when a query stops being selective</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Move logic out of a flow and into Apex — and say why</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Write tests that prove the bulk case, not the happy one</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Deploy with confidence from a scratch org</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Read a debug log without guessing</span></li>
</ul>` },
      { name: "Single column, quiet ticks", note: "<code>--single</code> for a rail; <code>--plain</code> drops the success colour where the list is informational rather than a promise.", html: `<ul class="ns-outcomes ns-outcomes--single ns-outcomes--plain" style="max-inline-size:22rem">
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Covers the Platform Developer I exam outline</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Includes the practice org and sample data</span></li>
  <li><i class="ph ph-check-circle" aria-hidden="true"></i><span>Certificate on completion</span></li>
</ul>` },
    ],
  },

  {
    id: "prerequisites", title: "Prerequisites", family: "LMS",
    summary: "The other half of the promise, and the half that gets left out: what you need BEFORE this course. Each row states the condition and — this is the whole point — where to go if you do not meet it. A prerequisite with no route to meeting it is a wall, not a warning.",
    use: ["Course and training-module pages, directly after What you'll learn", "Anywhere a course assumes earlier work"],
    not: ["Selling. This block exists to let people leave, which is what makes the ones who stay finish", "Rendering as ticked outcomes — a promise and a condition must not look alike"],
    a11y: ["Met / unmet is <code>data-met</code> plus a different glyph and word, never colour alone", "The escape link names its destination — \"Start Apex basics\", not \"here\""],
    variants: [
      { name: "With a route out", note: "The default: condition, one line of why, and the fix. Deliberately not ticked and not green — outcomes are promises, prerequisites are conditions, and rendering them alike is how entry requirements read as features.", html: `<div class="ns-prereq" style="max-inline-size:34rem;inline-size:100%">
  <div class="ns-prereq__item">
    <i class="ph ph-circle ns-prereq__icon" aria-hidden="true"></i>
    <span>
      <span class="ns-prereq__title">Comfortable in Lightning Experience</span>
      <span class="ns-prereq__note">You can find setup, create a custom object and add a field without following a screenshot.</span>
    </span>
    <a class="ns-prereq__fix" href="#0">Admin fundamentals</a>
  </div>
  <div class="ns-prereq__item">
    <i class="ph ph-circle ns-prereq__icon" aria-hidden="true"></i>
    <span>
      <span class="ns-prereq__title">Any programming language, at all</span>
      <span class="ns-prereq__note">Variables, loops and if-statements. It does not have to be Apex — JavaScript or Python is plenty.</span>
    </span>
    <a class="ns-prereq__fix" href="#0">Free primer</a>
  </div>
  <div class="ns-prereq__item">
    <i class="ph ph-circle ns-prereq__icon" aria-hidden="true"></i>
    <span>
      <span class="ns-prereq__title">A developer org</span>
      <span class="ns-prereq__note">Free, takes two minutes, and every lab in this course runs in it.</span>
    </span>
    <a class="ns-prereq__fix" href="#0">Sign up</a>
  </div>
</div>` },
      { name: "Known state", note: "When the product already knows — a signed-in learner who finished the earlier course should not be asked to check. Met and unmet differ by glyph AND word, not by colour.", html: `<div class="ns-prereq" style="max-inline-size:34rem;inline-size:100%">
  <div class="ns-prereq__item" data-met="true">
    <i class="ph ph-check-circle ns-prereq__icon" aria-hidden="true"></i>
    <span>
      <span class="ns-prereq__title">Admin fundamentals <span class="ns-laccess ns-laccess--free">Completed</span></span>
      <span class="ns-prereq__note">Finished in March. Nothing to do here.</span>
    </span>
  </div>
  <div class="ns-prereq__item" data-met="false">
    <i class="ph ph-warning-circle ns-prereq__icon" aria-hidden="true"></i>
    <span>
      <span class="ns-prereq__title">Apex basics <span class="ns-laccess ns-laccess--soon">4 lessons left</span></span>
      <span class="ns-prereq__note">You can start this course now, but lesson 05 assumes the collections lesson.</span>
    </span>
    <a class="ns-prereq__fix" href="#0">Resume</a>
  </div>
</div>` },
    ],
  },

  {
    id: "course-share", title: "Course share & footer CTA", family: "LMS",
    summary: "The two blocks that close a course page. Share is a row of real links with the network named, never an icon soup. The footer CTA is the page's last argument — one action, one line of fine print, and nothing else competing with it.",
    use: ["The end of a course, module or lesson page", "Share on anything a learner might send to a colleague"],
    not: ["A share dialog with twelve networks — ship the three people actually use here, and a copy-link", "Two CTAs. A page with two last arguments has none"],
    a11y: ["Each share control names the destination (\"Share on LinkedIn\"), because the glyph is not a label", "Copy-link confirms in text, not only by changing colour", "The CTA is one <code>&lt;a&gt;</code> — a div that navigates is not a link"],
    variants: [
      { name: "Share row", html: `<div class="ns-share" style="inline-size:100%">
  <span class="ns-share__label">Share this course</span>
  <a class="ns-btn ns-btn--outline ns-btn--sm" href="#0"><i class="ph ph-linkedin-logo" aria-hidden="true"></i> LinkedIn</a>
  <a class="ns-btn ns-btn--outline ns-btn--sm" href="#0"><i class="ph ph-x-logo" aria-hidden="true"></i> X</a>
  <a class="ns-btn ns-btn--outline ns-btn--sm" href="#0"><i class="ph ph-envelope-simple" aria-hidden="true"></i> Email</a>
  <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm" data-copy><i class="ph ph-link-simple" aria-hidden="true"></i> Copy link</button>
</div>` },
      { name: "Footer CTA", note: "The last thing on the page. One action, and the fine print answers the question that stops people clicking it.", html: `<section class="ns-band ns-band--sunken" style="inline-size:100%">
  <div class="ns-band__inner">
    <div class="ns-cta">
      <span class="ns-kicker">Ready when you are</span>
      <h2 class="ns-band__title">Start Apex basics</h2>
      <p class="ns-band__lede">Twelve lessons, three hours forty, and a bulk-safe trigger you wrote yourself at the end of it.</p>
      <div class="ns-cta__actions">
        <a class="ns-btn ns-btn--primary ns-btn--lg" href="#0">Enrol — $49</a>
        <a class="ns-btn ns-btn--outline ns-btn--lg" href="#0">Watch a free lesson</a>
      </div>
      <p class="ns-cta__fine">Lifetime access · certificate on completion · 14-day refund, no questions</p>
    </div>
  </div>
</section>` },
    ],
  },

  {
    id: "certbadge", title: "Certification badge", family: "LMS",
    summary: "The heptagon-and-ribbon badge a certification ships as, rebuilt as one element so a course page, a profile or a certificate can render any credential at any size. Drawn with <code>clip-path</code> — no image files, so it scales, prints and flips with the theme.",
    use: ["A certification track's hero and its course cards", "A learner profile — earned badges, and the next one greyed", "The certificate document"],
    not: ["Reproducing Salesforce's own badges. Those are their trademark and belong to the credential THEY issue — this is the shape family in this brand's colours, for this product's own tracks", "Anything that is not a credential. A badge means an exam was passed"],
    a11y: ["The badge is one element with a text name inside it, so it is read rather than described", "Locked badges keep their name in the DOM and add \"not yet earned\" — greyscale is not an announcement"],
    variants: [
      { name: "The three levels", note: "Only the ribbon changes between levels, because the ribbon is what a wall of badges is scanned by. Colours are ours — brand navy plate, brand-400 mark, brand→accent ribbon — not the official palette.", html: `<div class="ns-certbadges">
  <span class="ns-certbadge ns-certbadge--associate">
    <span class="ns-certbadge__plate" aria-hidden="true"></span>
    <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
    <span class="ns-certbadge__inner">
      <i class="ph ph-cloud ns-certbadge__mark" aria-hidden="true"></i>
      <span class="ns-certbadge__rule" aria-hidden="true"></span>
      <span class="ns-certbadge__word">Certified</span>
      <span class="ns-certbadge__name">Associate</span>
    </span>
  </span>
  <span class="ns-certbadge ns-certbadge--specialist">
    <span class="ns-certbadge__plate" aria-hidden="true"></span>
    <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
    <span class="ns-certbadge__inner">
      <i class="ph ph-cloud ns-certbadge__mark" aria-hidden="true"></i>
      <span class="ns-certbadge__rule" aria-hidden="true"></span>
      <span class="ns-certbadge__word">Certified</span>
      <span class="ns-certbadge__name">Platform Developer</span>
    </span>
  </span>
  <span class="ns-certbadge ns-certbadge--architect">
    <span class="ns-certbadge__plate" aria-hidden="true"></span>
    <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
    <span class="ns-certbadge__inner">
      <i class="ph ph-cube ns-certbadge__mark" aria-hidden="true"></i>
      <span class="ns-certbadge__word">Certified</span>
      <span class="ns-certbadge__name">Architect</span>
    </span>
  </span>
</div>` },
      { name: "Sizes and locked", note: "Set <code>inline-size</code> and everything inside scales from it. A badge you have not earned is drained rather than hidden — a track should show what is ahead of you.", html: `<div class="ns-certbadges" style="align-items:center">
  <span class="ns-certbadge ns-certbadge--specialist" style="inline-size:5rem">
    <span class="ns-certbadge__plate" aria-hidden="true"></span>
    <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
    <span class="ns-certbadge__inner">
      <i class="ph ph-cloud ns-certbadge__mark" aria-hidden="true"></i>
      <span class="ns-certbadge__rule" aria-hidden="true"></span>
      <span class="ns-certbadge__word">Certified</span>
      <span class="ns-certbadge__name">Admin</span>
    </span>
  </span>
  <span class="ns-certbadge ns-certbadge--specialist" style="inline-size:7rem">
    <span class="ns-certbadge__plate" aria-hidden="true"></span>
    <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
    <span class="ns-certbadge__inner">
      <i class="ph ph-cloud ns-certbadge__mark" aria-hidden="true"></i>
      <span class="ns-certbadge__rule" aria-hidden="true"></span>
      <span class="ns-certbadge__word">Certified</span>
      <span class="ns-certbadge__name">Admin</span>
    </span>
  </span>
  <span class="ns-certbadge ns-certbadge--architect ns-certbadge--locked" style="inline-size:7rem">
    <span class="ns-certbadge__plate" aria-hidden="true"></span>
    <span class="ns-certbadge__ribbon" aria-hidden="true"></span>
    <span class="ns-certbadge__inner">
      <i class="ph ph-cube ns-certbadge__mark" aria-hidden="true"></i>
      <span class="ns-certbadge__word">Certified</span>
      <span class="ns-certbadge__name">Architect<span class="ns-visually-hidden"> — not yet earned</span></span>
    </span>
  </span>
</div>` },
    ],
  },

  {
    id: "pframe", title: "Picture frames", family: "Media",
    summary: "Four print treatments for the places an image is an OBJECT rather than a document — an instructor's desk, a meetup, a certificate on a wall. Everywhere else, a photo is a hairline box (see Image); these are for when the photograph is the content.",
    use: ["Instructor and community photography", "A testimonial that leads with a face", "<code>--tape</code> for meetup and event galleries"],
    not: ["Course stills, screenshots, diagrams — those are documents and want the plain frame", "Mixing three styles on one page. Pick one per surface"],
    a11y: ["A real <code>&lt;figure&gt;</code>/<code>&lt;figcaption&gt;</code>, so the caption is tied to the image", "The tape and the tilt are decorative and drop under prefers-reduced-motion"],
    variants: [
      { name: "The four", note: "<code>--photo</code> a print in an album · <code>--polaroid</code> the deep bottom margin, caption in the reader's own voice (Sentient) · <code>--matted</code> a museum mat, for something being presented · <code>--tape</code> stuck down at two corners, the only rotation in the system.", html: `<div class="ns-pframes">
  <figure class="ns-pframe ns-pframe--photo" style="inline-size:12rem">
    <span class="ns-ph" aria-hidden="true"></span>
    <figcaption>Bengaluru meetup, 2026</figcaption>
  </figure>
  <figure class="ns-pframe ns-pframe--polaroid" style="inline-size:12rem">
    <span class="ns-ph" aria-hidden="true"></span>
    <figcaption>First trigger that survived the load</figcaption>
  </figure>
  <figure class="ns-pframe ns-pframe--matted" style="inline-size:14rem">
    <span class="ns-ph" aria-hidden="true"></span>
    <figcaption>Certificate 0042</figcaption>
  </figure>
  <figure class="ns-pframe ns-pframe--tape" style="inline-size:12rem">
    <span class="ns-ph" aria-hidden="true"></span>
    <figcaption>Study group, week 6</figcaption>
  </figure>
</div>` },
    ],
  },

  /* ============================================================= AI ==== */
  {
    id: "ai-shell", title: "Assistant shell", family: "AI",
    summary: "The room the assistant lives in: conversation rail, thread, docked composer, one locked viewport. The page behind it does not scroll — a chat where the document scrolls is a chat whose composer walks off the screen mid-sentence.",
    use: ["The assistant's own route — the full-screen learning tutor", "<code>--docked</code> under the product navbar, so the student can still navigate", "<code>--embedded</code> for a chat panel inside a lesson, where the page owns the scroll"],
    not: ["A support ticket thread — that is Ticket thread, and it is a record with a status, not a conversation", "A comment section — a chat shell implies a reply is coming"],
    a11y: ["The rail is an <code>&lt;aside aria-label&gt;</code>; the toggle carries aria-controls and aria-expanded, so the announced state cannot drift from the CSS collapse", "Below 64rem the rail is an overlay and Escape closes it — a sheet you can only dismiss with a small button is a trap on a phone", "The transcript is a list of <code>&lt;article&gt;</code>s, so a screen reader can move turn by turn"],
    variants: [
      { name: "Full screen", note: "The whole screen at once — rail, thread, composer, and every state a real assistant has. This is the visual test for the family.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-ai-chat.html" target="_blank" rel="noopener">Open the full-screen demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
      { name: "Embedded", note: "The same shell with the viewport lock dropped, for a panel beside a lesson. The scroll region caps at 60vh and the surrounding page keeps its own scroll.", html: `<div class="ns-ai ns-ai--embedded">
  <div class="ns-ai__main">
    <header class="ns-ai__bar">
      <span class="ns-ai__bar-title">Ask about this lesson</span>
      <span class="ns-ai__bar-meta">Apex basics · 03</span>
    </header>
    <div class="ns-ai__scroll">
      <div class="ns-ai__inner">
        <article class="ns-aiturn ns-aiturn--user">
          <header class="ns-aiturn__head"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">RS</span>You</header>
          <div class="ns-aiturn__body"><p>What does "bulkified" actually mean here?</p></div>
        </article>
        <article class="ns-aiturn ns-aiturn--agent">
          <header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant</header>
          <div class="ns-aiturn__body"><p>It means the code handles 200 records in one call as cheaply as it handles one — no query and no DML inside the loop.</p></div>
        </article>
      </div>
    </div>
    <div class="ns-ai__foot">
      <form class="ns-aicomposer">
        <label class="ns-visually-hidden" for="ai-embed-in">Ask about this lesson</label>
        <textarea class="ns-aicomposer__area" id="ai-embed-in" rows="1" placeholder="Ask about this lesson…"></textarea>
        <div class="ns-aicomposer__bar">
          <span class="ns-aicomposer__spacer"></span>
          <button type="submit" class="ns-btn ns-btn--primary ns-btn--icon ns-btn--sm" aria-label="Send"><i class="ph ph-paper-plane-tilt" aria-hidden="true"></i></button>
        </div>
      </form>
    </div>
  </div>
</div>` },
      { name: "Top bar", note: "The conversation's identity plus the course it belongs to. The course is the mono half: a student's history is mostly “the one from the Apex module”, so the anchor matters as much as the question.", html: `<header class="ns-ai__bar" style="border:1px solid var(--color-border);border-radius:var(--radius-card)">
  <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Toggle conversations" aria-expanded="true"><i class="ph ph-sidebar" aria-hidden="true"></i></button>
  <span class="ns-ai__bar-title">Why does my trigger hit governor limits?</span>
  <span class="ns-ai__bar-meta">Apex basics · lesson 03</span>
  <span class="ns-ai__bar-actions">
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Share this chat"><i class="ph ph-share-network" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Assistant settings"><i class="ph ph-gear" aria-hidden="true"></i></button>
  </span>
</header>` },
      { name: "The standing note", note: "Present on every assistant screen, never dismissible. An LMS assistant talks to people who cannot yet tell when it is wrong — which is the entire reason they are here.", html: `<p class="ns-ai__note">The assistant can be wrong. Check anything it says against the lesson it cites.</p>` },
    ],
  },

  {
    id: "ai-rail", title: "Conversation rail", family: "AI",
    summary: "History, grouped by recency, in the terminal-row idiom the rest of the system uses for lists. The course a conversation belongs to is the mono line above the question — a student's chat history is organised by module, not by date.",
    use: ["The assistant's history sidebar", "Grouping by <em>Today / Earlier this week / Earlier</em> — a date stamp per row is noise", "The quota meter at the foot, where it is information rather than a warning"],
    not: ["A navigation menu — this is a list of documents, use Sidebar nav for routes", "An icon-only collapsed strip: there is no glyph for “the one about triggers”, so the rail collapses to nothing instead"],
    a11y: ["The current conversation is aria-current=\"true\", not a class", "Rows are real links — a conversation is a page, and middle-click must work"],
    variants: [
      { name: "Anatomy", html: `<aside class="ns-ai__side" style="block-size:26rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-aiside__head">
    <span class="ns-aiside__brand"><i class="ph ph-sparkle" aria-hidden="true"></i>Namaste AI</span>
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm ns-btn--block"><i class="ph ph-plus" aria-hidden="true"></i> New chat</button>
    <span class="ns-input-wrap">
      <i class="ph ph-magnifying-glass ns-input-wrap__icon" aria-hidden="true"></i>
      <input class="ns-input ns-input--has-icon" type="search" placeholder="Search chats" aria-label="Search conversations">
    </span>
  </div>
  <div class="ns-aiside__list">
    <div class="ns-aiside__group">
      <p class="ns-aiside__label">Today</p>
      <a class="ns-aiside__item" href="#0" aria-current="true">
        <span><span class="ns-aiside__course">Apex basics</span><span class="ns-aiside__title">Why does my trigger hit governor limits?</span></span>
        <span class="ns-aiside__when">09:12</span>
      </a>
      <a class="ns-aiside__item" href="#0">
        <span><span class="ns-aiside__course">Career</span><span class="ns-aiside__title">Resume review for admin roles</span></span>
        <span class="ns-aiside__when">08:40</span>
      </a>
    </div>
    <div class="ns-aiside__group">
      <p class="ns-aiside__label">Earlier this week</p>
      <a class="ns-aiside__item" href="#0">
        <span><span class="ns-aiside__course">Flows, end to end</span><span class="ns-aiside__title">Record-triggered vs scheduled flow</span></span>
        <span class="ns-aiside__when">Tue</span>
      </a>
    </div>
  </div>
  <div class="ns-aiside__foot">
    <div class="ns-aiside__quota">
      <span class="ns-aiside__quota-row">Questions today <b>12 / 30</b></span>
      <progress class="ns-progress" value="12" max="30" aria-label="12 of 30 questions used today"></progress>
      <a class="ns-link" href="#0">Go unlimited with Pro</a>
    </div>
  </div>
</aside>` },
      { name: "Empty history", note: "Told honestly, not as a skeleton pretending to load. It says where the chats will go and what groups them.", html: `<aside class="ns-ai__side" style="block-size:14rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <div class="ns-aiside__list">
    <div class="ns-empty">
      <i class="ph ph-chats-circle ns-empty__icon" aria-hidden="true"></i>
      <p class="ns-empty__title">No conversations yet</p>
      <p class="ns-empty__text">Your chats appear here, grouped by the course they belong to.</p>
    </div>
  </div>
</aside>` },
    ],
  },

  {
    id: "ai-turn", title: "Message turn", family: "AI",
    summary: "One entry in the transcript. The student and the assistant are told apart by structure — measure, surface, the mono role label — never by a tinted bubble. A question is short and sits in a narrow sunken card; an answer is reading, and gets the reading measure on the page surface.",
    use: ["Every message in a transcript, both sides", "Per-response actions — copy, regenerate, feedback — in the turn's footer"],
    not: ["Colored speech balloons per speaker: that spends the whole color budget (Principle 3) on what the role label already says", "A photo-real avatar for the assistant — the product is not pretending to be a person, so it gets a hairline mark"],
    a11y: ["Each turn is an <code>&lt;article&gt;</code> with a heading-ish mono head, so turn-by-turn navigation works", "Actions are visible on hover AND focus, and always visible on touch — a control revealed only by a hover that cannot happen is a missing control", "State is data-state (thinking / streaming / done / error), never a class"],
    variants: [
      { name: "The pair", note: "The whole visual argument in two turns: narrow sunken card vs full-measure prose.", html: `<div style="max-inline-size:44rem">
  <article class="ns-aiturn ns-aiturn--user">
    <header class="ns-aiturn__head"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">RS</span>You<time datetime="2026-03-04T09:12">09:12</time></header>
    <div class="ns-aiturn__body"><p>My trigger works on one record but fails when I data-load 200. What is going on?</p></div>
  </article>
  <article class="ns-aiturn ns-aiturn--agent" data-state="done">
    <header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant<time datetime="2026-03-04T09:12">09:12</time></header>
    <div class="ns-aiturn__body">
      <p>Your trigger is written for one record at a time. Salesforce hands a trigger up to 200 records in a single call, so a query inside the loop runs 200 times and blows the per-transaction limit.</p>
      <p>Query once before the loop into a Map; collect changes into a List and insert once after it.</p>
    </div>
    <footer class="ns-aiturn__actions">
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Copy answer"><i class="ph ph-file-text" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Regenerate answer"><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Helpful"><i class="ph ph-heart" aria-hidden="true"></i></button>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Report a problem with this answer"><i class="ph ph-flag" aria-hidden="true"></i></button>
    </footer>
  </article>
</div>` },
      { name: "In dark mode", note: "The same two turns, and nothing about them is re-specified for dark: every surface here is a role token, so the transcript flips when the page does. Use the theme toggle at the top of this styleguide to see it — dark mode is set by <code>data-theme</code> on <code>&lt;html&gt;</code>, page-wide, because the role tokens resolve at the root. A navy band painted behind light components is the thing this system does not do.", html: `<div style="max-inline-size:40rem">
  <article class="ns-aiturn ns-aiturn--user">
    <header class="ns-aiturn__head"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">RS</span>You</header>
    <div class="ns-aiturn__body"><p>Explain SOQL selectivity like I have never seen an index.</p></div>
  </article>
  <article class="ns-aiturn ns-aiturn--agent">
    <header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant</header>
    <div class="ns-aiturn__body"><p>A query is selective when the filter can find its rows without reading the whole table. Below roughly 10% of the object's records, the platform will use the index; above it, it scans.</p></div>
  </article>
</div>` },
      { name: "Regenerated", note: "A replaced answer says so, in mono. Silently swapping what someone read a moment ago is how a tutor loses trust.", html: `<article class="ns-aiturn ns-aiturn--agent" style="max-inline-size:40rem">
  <header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant<time datetime="2026-03-04T09:20">09:20</time></header>
  <p class="ns-aiturn__note">Rewritten at your request — the earlier answer assumed you had finished the Collections lesson.</p>
  <div class="ns-aiturn__body"><p>Start with the Map. A Map is a lookup table keyed by Id, and it is the one data structure that turns 200 queries into one.</p></div>
</article>` },
    ],
  },

  {
    id: "ai-thinking", title: "Thinking & streaming", family: "AI",
    summary: "The wait, made legible. Three squares fading on a 1.2s loop beside a mono label that says what is actually happening, a disclosable trace of the steps taken, tool chips for what was read, and a block caret while tokens arrive.",
    use: ["Between send and first token — with a label that names the stage, not a generic “Thinking…”", "Tool chips whenever the assistant reads something the student could check themselves", "The trace on any answer that consulted more than one source"],
    not: ["A bouncing three-dot indicator: Principle 5 rules out springy motion, and opacity carries the same meaning", "Hiding the tools it used — the difference between a tutor and an oracle is that you can see what it looked at"],
    a11y: ["The thinking block is role=\"status\" aria-live=\"polite\", so the wait is announced once instead of being a silent pause", "Under prefers-reduced-motion the dots, spinner and caret all stop and the label alone carries the state", "The trace is a real <code>&lt;details&gt;</code> — it discloses with no JavaScript"],
    variants: [
      { name: "Thinking", note: "The label is the status; the dots are decoration. Name the stage — “Reading your progress” tells a waiting student more than a spinner ever will.", html: `<p class="ns-aithinking" role="status" aria-live="polite"><span class="ns-aithinking__dots" aria-hidden="true"><i></i><i></i><i></i></span>Reading your progress</p>` },
      { name: "Streaming", note: "A mono block caret on a 1.1s step timing — a cursor is a discrete thing, so it steps rather than fades.", html: `<div class="ns-aiturn__body" style="max-inline-size:36rem"><p>Three project ideas that map to what you have already built, hardest last<span class="ns-aistream" aria-hidden="true"></span></p></div>` },
      { name: "Tool calls", note: "What it read, as chips. Running spins, done checks, failed carries the error border — and a failed tool does not silently become an unsourced answer.", html: `<p>
  <span class="ns-aitool" data-state="done"><i class="ph ph-check-circle" aria-hidden="true"></i>Read your progress</span>
  <span class="ns-aitool" data-state="done"><i class="ph ph-check-circle" aria-hidden="true"></i>Searched catalog<span class="ns-aitool__count">6</span></span>
  <span class="ns-aitool" data-state="running"><i class="ph ph-circle-notch" aria-hidden="true"></i>Checking exam outline</span>
  <span class="ns-aitool" data-state="failed"><i class="ph ph-x" aria-hidden="true"></i>Trailhead lookup</span>
</p>` },
      { name: "Reasoning trace", note: "Collapsed by default. A beginner asking “what is a trigger” does not want a plan; a student debugging their own prompt very much does.", html: `<details class="ns-aitrace" open>
  <summary><i class="ph ph-caret-right" aria-hidden="true"></i> How I answered this <span class="ns-aisource__num">3 steps</span></summary>
  <div class="ns-aitrace__steps">
    <p class="ns-aitrace__step"><i class="ph ph-check-circle" aria-hidden="true"></i><span><b>Read</b> your progress — Apex basics, lesson 03 of 12.</span></p>
    <p class="ns-aitrace__step"><i class="ph ph-check-circle" aria-hidden="true"></i><span><b>Searched</b> the catalog for bulk-safe Apex material.</span></p>
    <p class="ns-aitrace__step"><i class="ph ph-check-circle" aria-hidden="true"></i><span><b>Checked</b> the Platform Developer I outline against what you have finished.</span></p>
  </div>
</details>` },
    ],
  },

  {
    id: "ai-composer", title: "Composer", family: "AI",
    summary: "The input. One hairline box that grows with the textarea rather than a fixed field with a scrollbar — a student pasting an Apex class needs to see it. Focus moves the ring to the whole composer, so the toolbar reads as part of the control it belongs to.",
    use: ["The assistant's input, docked at the foot of the thread", "The context pill for what is in scope — the lesson, the file, the org", "Attachments: Apex classes, flow screenshots, error logs"],
    not: ["A search field — a search box returns results, this one starts a conversation", "Hiding the Enter/Shift+Enter contract: the wrong guess posts half a question to a class"],
    a11y: ["The textarea has a real label, visually hidden — a placeholder is not a label", "The focus ring is on the wrapper, so the whole control shows focus rather than an inner box", "aria-disabled on the wrapper for the signed-out state, with the reason in the bar rather than a dead control"],
    variants: [
      { name: "Default", html: `<form class="ns-aicomposer">
  <label class="ns-visually-hidden" for="ai-doc-in">Ask the assistant</label>
  <textarea class="ns-aicomposer__area" id="ai-doc-in" rows="2" placeholder="Ask about this lesson, paste your Apex, or ask for a project…"></textarea>
  <div class="ns-aicomposer__bar">
    <button type="button" class="ns-aimode" aria-haspopup="true" aria-expanded="false"><i class="ph ph-graduation-cap" aria-hidden="true"></i> Tutor <i class="ph ph-caret-down" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Attach a file"><i class="ph ph-folder-open" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Dictate"><i class="ph ph-microphone" aria-hidden="true"></i></button>
    <span class="ns-aicomposer__spacer"></span>
    <span class="ns-aicomposer__hint">Enter to send · Shift+Enter for a new line</span>
    <button type="submit" class="ns-btn ns-btn--primary ns-btn--icon ns-btn--sm" aria-label="Send message"><i class="ph ph-paper-plane-tilt" aria-hidden="true"></i></button>
  </div>
</form>` },
      { name: "Context & attachments", note: "What the assistant can see is <em>stated</em>, not inferred. “Explain this bit” only means the paragraph in front of you if the lesson is genuinely in scope — and the student must be able to take it out.", html: `<form class="ns-aicomposer">
  <div class="ns-aifiles">
    <span class="ns-aicontext"><i class="ph ph-book-open-text" aria-hidden="true"></i> Apex basics · lesson 03
      <button type="button" class="ns-aicontext__x" aria-label="Remove this lesson from context"><i class="ph ph-x" aria-hidden="true"></i></button></span>
    <span class="ns-aifile"><i class="ph ph-file-text" aria-hidden="true"></i><span class="ns-aifile__name">AccountTrigger.cls</span><span class="ns-aifile__size">4 KB</span>
      <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--xs" aria-label="Remove AccountTrigger.cls"><i class="ph ph-x" aria-hidden="true"></i></button></span>
    <span class="ns-aifile" data-state="uploading"><i class="ph ph-circle-notch" aria-hidden="true"></i><span class="ns-aifile__name">error-log.txt</span><span class="ns-aifile__size">uploading</span></span>
    <span class="ns-aifile" data-state="failed"><i class="ph ph-warning" aria-hidden="true"></i><span class="ns-aifile__name">flow-screenshot.png</span><span class="ns-aifile__size">too large</span></span>
  </div>
  <label class="ns-visually-hidden" for="ai-doc-in2">Ask the assistant</label>
  <textarea class="ns-aicomposer__area" id="ai-doc-in2" rows="2" placeholder="What is wrong with this trigger?"></textarea>
  <div class="ns-aicomposer__bar">
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Attach a file"><i class="ph ph-folder-open" aria-hidden="true"></i></button>
    <span class="ns-aicomposer__spacer"></span>
    <span class="ns-aicomposer__count" data-state="near">3620 / 4000</span>
    <button type="submit" class="ns-btn ns-btn--primary ns-btn--icon ns-btn--sm" aria-label="Send message"><i class="ph ph-paper-plane-tilt" aria-hidden="true"></i></button>
  </div>
</form>` },
      { name: "Mode picker", note: "Which teacher you are talking to. Tutor explains, Coach answers with a question first, Reviewer marks the code you paste. The trigger is mono because it is a label; the menu is the shared ns-menu.", html: `<div style="display:flex;gap:var(--space-4);align-items:flex-start">
  <button type="button" class="ns-aimode" aria-expanded="true" aria-haspopup="true"><i class="ph ph-graduation-cap" aria-hidden="true"></i> Tutor <i class="ph ph-caret-down" aria-hidden="true"></i></button>
  <div class="ns-menu" style="position:static;display:block;inline-size:17rem">
    <p class="ns-menu__label">Mode</p>
    <button type="button" class="ns-menu__item" aria-current="true"><i class="ph ph-graduation-cap" aria-hidden="true"></i> Tutor <span>explains, then shows</span></button>
    <button type="button" class="ns-menu__item"><i class="ph ph-question" aria-hidden="true"></i> Coach <span>asks you first</span></button>
    <button type="button" class="ns-menu__item"><i class="ph ph-code" aria-hidden="true"></i> Reviewer <span>marks your Apex</span></button>
  </div>
</div>` },
      { name: "Signed out", note: "Visible but disabled, with the reason on it. A composer that is simply gone reads as a broken page.", html: `<div class="ns-aicomposer" aria-disabled="true">
  <label class="ns-visually-hidden" for="ai-doc-in3">Ask the assistant</label>
  <textarea class="ns-aicomposer__area" id="ai-doc-in3" rows="2" disabled placeholder="Sign in to ask a question…"></textarea>
  <div class="ns-aicomposer__bar">
    <span class="ns-aicomposer__hint"><i class="ph ph-lock-simple" aria-hidden="true"></i> Sign in to send</span>
    <span class="ns-aicomposer__spacer"></span>
    <button type="button" class="ns-btn ns-btn--primary ns-btn--sm">Sign in</button>
  </div>
</div>` },
    ],
  },

  {
    id: "ai-attachments", title: "Answer attachments", family: "AI",
    summary: "What makes this an LMS assistant rather than a chat box: an answer can carry the product's own objects. The course it recommends is the same <code>.ns-card.ns-ccard</code> the catalog renders — one component with two placements, not two cards that drift apart.",
    use: ["Course and lesson cards, when the answer's real conclusion is “go and do this course”", "A rich snippet for a blog post, doc page or external reference", "An image the assistant produced — always labelled as generated"],
    not: ["Decorating every answer with a card — an attachment is a recommendation, and four of them is none", "A bespoke mini course card: use the catalog's <code>--compact</code> shape"],
    a11y: ["The mono caption above the grid says <em>why</em> these are here, not just that they are", "Generated images carry a badge in the caption — an unlabelled generated diagram is one a student will cite in an exam"],
    variants: [
      { name: "Course cards", note: "The catalog's own compact card, dropped into a message. Same anatomy, same meta row, same hover.", html: `<div style="max-inline-size:40rem">
  <p class="ns-aiattach__label">Covers this, in order</p>
  <div class="ns-aiattach">
    <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body">
      <span class="ns-card__kicker">// Course</span>
      <a class="ns-card__link" href="#0"><span class="ns-card__title">Bulk-safe Apex patterns</span></a>
      <p class="ns-card__text">Triggers that survive the 200-record data load.</p>
      <span class="ns-ccard__meta"><span>9 lessons</span><span>2h 10m</span></span>
    </div></div>
    <div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body">
      <span class="ns-card__kicker">// Lesson</span>
      <a class="ns-card__link" href="#0"><span class="ns-card__title">Collections, maps and sets</span></a>
      <p class="ns-card__text">The data structure that makes one query enough.</p>
      <span class="ns-ccard__meta"><span>14:40</span><span>Beginner</span></span>
    </div></div>
  </div>
</div>` },
      { name: "Rich snippet", note: "A link, unfurled: thumbnail, title, one line, host. For a blog post or an external doc — anything that is not a catalog object.", html: `<div style="max-inline-size:36rem;display:grid;gap:var(--space-3)">
  <a class="ns-aisnippet" href="#0">
    <span class="ns-aisnippet__thumb ns-ph ns-ph--sm" aria-hidden="true"></span>
    <span>
      <span class="ns-aisnippet__kicker">// Blog</span>
      <span class="ns-aisnippet__title">The trigger that survived a 200-record load</span>
      <span class="ns-aisnippet__desc">A walk through one real bulkification bug, from the debug log to the pattern that fixes it for good.</span>
      <span class="ns-aisnippet__meta"><i class="ph ph-globe" aria-hidden="true"></i> namastesalesforce.com · 8 min read</span>
    </span>
  </a>
  <a class="ns-aisnippet" href="#0">
    <span class="ns-aisnippet__thumb ns-ph ns-ph--sm" aria-hidden="true"></span>
    <span>
      <span class="ns-aisnippet__kicker">// Reference</span>
      <span class="ns-aisnippet__title">Execution governors and limits</span>
      <span class="ns-aisnippet__desc">The per-transaction table: 100 SOQL queries, 150 DML statements, 50,000 rows retrieved.</span>
      <span class="ns-aisnippet__meta"><i class="ph ph-arrow-up-right" aria-hidden="true"></i> developer.salesforce.com</span>
    </span>
  </a>
</div>` },
      { name: "Image", note: "Framed, captioned, and labelled when it was generated. The badge is not decoration — it is the difference between a diagram and a source.", html: `<figure class="ns-aiimage" style="max-inline-size:28rem">
  <span class="ns-ph" aria-hidden="true"></span>
  <figcaption class="ns-aiimage__cap">Trigger execution order, simplified <span class="ns-badge ns-badge--warning"><span class="ns-badge__dot" aria-hidden="true"></span>Generated</span></figcaption>
</figure>` },
      { name: "Downloadable", note: "For a cheat sheet or a starter repo the assistant hands over, the catalog's resource row is already the right object.", html: `<div style="max-inline-size:36rem">
  <p class="ns-aiattach__label">Take this with you</p>
  <div class="ns-aiattach ns-aiattach--single">
  <a class="ns-resource" href="#0">
    <span class="ns-resource__icon"><i class="ph ph-file-text" aria-hidden="true"></i></span>
    <span class="ns-resource__body">
      <span class="ns-resource__title">Governor limits cheat sheet</span>
      <span class="ns-resource__type">PDF · 1 page</span>
    </span>
    <i class="ph ph-arrow-down ns-resource__cue" aria-hidden="true"></i>
  </a>
  </div>
</div>` },
    ],
  },

  {
    id: "ai-path", title: "Generated learning path", family: "AI",
    summary: "The assistant's most product-specific output: “here is a six-week route from where you actually are to a Platform Developer I attempt.” Numbered steps on a rail, each pointing at a real course or lesson, with what the student has already finished marked done — and a save action that turns the answer into an object on their dashboard.",
    use: ["Any answer whose real conclusion is a sequence — certification routes, “where do I start”, catching up after a gap", "Marking completed steps done rather than dropping them: seeing what you have finished is half the motivation"],
    not: ["The marketing roadmap — that is Roadmap card, with illustrations and lede copy; this is a compact plan inside a message", "A path made of steps that are not real courses. Every row must be a link to something that exists"],
    a11y: ["Steps are real links with the state on data-state, so “done” is not carried by color alone — the index turns green AND the row reads <em>done</em>", "The save action is a button, not a link: it changes data"],
    variants: [
      { name: "In an answer", html: `<div class="ns-aipath" style="max-inline-size:38rem">
  <div class="ns-aipath__head">
    <span class="ns-aipath__title">Route to Platform Developer I</span>
    <span class="ns-aipath__meta">6 weeks · 5 steps</span>
  </div>
  <div class="ns-aipath__steps">
    <a class="ns-aipath__step" href="#0" data-state="done">
      <span class="ns-aipath__index">01</span>
      <span><span class="ns-aipath__name">Apex basics</span><span class="ns-aipath__sub">Lessons 01–03 · already done</span></span>
      <span class="ns-aipath__when">done</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">02</span>
      <span><span class="ns-aipath__name">Collections, maps and sets</span><span class="ns-aipath__sub">Apex basics · lesson 09</span></span>
      <span class="ns-aipath__when">this week</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">03</span>
      <span><span class="ns-aipath__name">Bulk-safe Apex patterns</span><span class="ns-aipath__sub">9 lessons · the fix, properly</span></span>
      <span class="ns-aipath__when">week 2</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">04</span>
      <span><span class="ns-aipath__name">SOQL, properly</span><span class="ns-aipath__sub">Relationships and selective queries</span></span>
      <span class="ns-aipath__when">week 3</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">05</span>
      <span><span class="ns-aipath__name">Testing and deployment</span><span class="ns-aipath__sub">75%+ coverage, and what it is for</span></span>
      <span class="ns-aipath__when">weeks 4–6</span>
    </a>
  </div>
  <div class="ns-aipath__foot">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm"><i class="ph ph-bookmark-simple" aria-hidden="true"></i> Save as my path</button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm">Adjust pace</button>
    <span class="ns-aipath__meta">~4h / week</span>
  </div>
</div>` },
      { name: "Project plan", note: "The same object doing career work: a portfolio project broken into build steps, which is what a student asking “what do I put on my resume” actually needs.", html: `<div class="ns-aipath" style="max-inline-size:38rem">
  <div class="ns-aipath__head">
    <span class="ns-aipath__title">Project: a volunteer-shift manager</span>
    <span class="ns-aipath__meta">portfolio · 4 steps</span>
  </div>
  <div class="ns-aipath__steps">
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">01</span>
      <span><span class="ns-aipath__name">Model it</span><span class="ns-aipath__sub">Volunteer, Shift, Signup — two lookups, one rollup</span></span>
      <span class="ns-aipath__when">2h</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">02</span>
      <span><span class="ns-aipath__name">Automate the double-booking check</span><span class="ns-aipath__sub">Record-triggered flow, then the same rule in Apex</span></span>
      <span class="ns-aipath__when">3h</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">03</span>
      <span><span class="ns-aipath__name">Build the signup screen</span><span class="ns-aipath__sub">One LWC, wire adapter, no imperative Apex</span></span>
      <span class="ns-aipath__when">4h</span>
    </a>
    <a class="ns-aipath__step" href="#0">
      <span class="ns-aipath__index">04</span>
      <span><span class="ns-aipath__name">Test it honestly</span><span class="ns-aipath__sub">Insert 200 signups, not one</span></span>
      <span class="ns-aipath__when">2h</span>
    </a>
  </div>
  <div class="ns-aipath__foot">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm"><i class="ph ph-bookmark-simple" aria-hidden="true"></i> Save this project</button>
    <span class="ns-aipath__meta">talks well in an interview</span>
  </div>
</div>` },
    ],
  },

  {
    id: "ai-sources", title: "Sources & practice check", family: "AI",
    summary: "The two things that separate a tutor from an answer machine: where it got this, and one question back. Sources are numbered mono chips so the prose can reference [1] inline the way an article cites; the check is a real fieldset of radios, asked after an explanation.",
    use: ["Every answer built from lesson content — the citation is the student's way of verifying", "One check question after an explanation, when the mode is Coach or the setting is on"],
    not: ["More than about four sources — a citation list longer than the answer is not attribution, it is noise", "A quiz: this is one question in a conversation, not a graded assessment (see Quiz for that)"],
    a11y: ["Source chips are links with visible numbers, not superscript-only markers", "The check is a real radio group inside a fieldset — arrow keys work, and the options are labels, not clickable divs"],
    variants: [
      { name: "Sources", html: `<div class="ns-aisource" style="max-inline-size:40rem">
  <span class="ns-aisource__label">Sources</span>
  <a class="ns-aisource__item" href="#0"><span class="ns-aisource__num">1</span> Bulk-safe Apex patterns · lesson 04</a>
  <a class="ns-aisource__item" href="#0"><span class="ns-aisource__num">2</span> Apex basics · lesson 09</a>
  <a class="ns-aisource__item" href="#0"><span class="ns-aisource__num">3</span> Execution governors and limits <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
</div>` },
      { name: "Practice check", note: "The teaching move. After explaining governor limits it asks one question and waits — which is the whole difference between reading an answer and knowing it.", html: `<div class="ns-aicheck" style="max-inline-size:36rem">
  <span class="ns-aicheck__kicker">// Quick check</span>
  <p class="ns-aicheck__q">Your trigger queries Account inside a <code class="ns-code-inline">for</code> loop over 200 Contacts. How many SOQL queries does the transaction use?</p>
  <div class="ns-aicheck__options">
    <label class="ns-choice"><input class="ns-radio" type="radio" name="ai-doc-check"><span class="ns-choice__text"><span class="ns-choice__label">1 — the loop is compiled away</span></span></label>
    <label class="ns-choice"><input class="ns-radio" type="radio" name="ai-doc-check"><span class="ns-choice__text"><span class="ns-choice__label">200 — one per record, and the limit is 100</span></span></label>
    <label class="ns-choice"><input class="ns-radio" type="radio" name="ai-doc-check"><span class="ns-choice__text"><span class="ns-choice__label">100 — it stops at the limit and continues</span></span></label>
  </div>
  <div class="ns-aicheck__foot">
    <button type="button" class="ns-btn ns-btn--primary ns-btn--sm">Check answer</button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm">Skip</button>
  </div>
</div>` },
    ],
  },

  {
    id: "ai-error", title: "Errors & limits", family: "AI",
    summary: "Failures render inside the transcript, in the assistant's own slot, because that is where the student is already looking and because a failed turn must stay in the record. The 3px leading edge is the system's error device; the retry is an outline button — the primary action on the screen is still the composer.",
    use: ["A tool or model failure, in the turn it happened in", "<code>--limit</code> for a quota the student fixes by waiting or upgrading, not by retrying", "<code>--offline</code> for a lost connection, where nothing is wrong with the question"],
    not: ["A toast — a toast disappears, and the student needs to see which question failed", "Blaming the student: “something went wrong” with no state about what survived is worse than the error"],
    a11y: ["role=\"alert\" on the block, so the failure is announced when it lands", "The technical code is present, in mono — a student pasting <code>ERR_TOOL_TIMEOUT</code> into a ticket is doing support's job for them", "Always says what happened to the input: “nothing you typed was lost” is the sentence people are looking for"],
    variants: [
      { name: "Tool failure", html: `<article class="ns-aiturn ns-aiturn--agent" data-state="error" style="max-inline-size:40rem">
  <header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant<time datetime="2026-03-04T09:19">09:19</time></header>
  <div class="ns-aierror" role="alert">
    <p class="ns-aierror__head"><i class="ph ph-warning-circle" aria-hidden="true"></i> Could not reach the catalog</p>
    <p class="ns-aierror__text">The explanation above is written from what I already know about your progress; the course list needs the catalog and it did not respond. Nothing you typed was lost.</p>
    <div class="ns-aierror__actions">
      <button type="button" class="ns-btn ns-btn--outline ns-btn--sm"><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i> Try again</button>
      <a class="ns-btn ns-btn--quiet ns-btn--sm" href="#0">Report this</a>
      <span class="ns-aierror__code">ERR_TOOL_TIMEOUT · 09:19:04</span>
    </div>
  </div>
</article>` },
      { name: "Daily limit", note: "Warning, not error: nothing is broken and retrying will not help. The upgrade is an outline button beside a plain “comes back at midnight”, because a paywall that shouts is a paywall people resent.", html: `<div class="ns-aierror ns-aierror--limit" role="alert" style="max-inline-size:40rem">
  <p class="ns-aierror__head"><i class="ph ph-timer" aria-hidden="true"></i> That is your 30th question today</p>
  <p class="ns-aierror__text">The free plan resets at midnight — your history, saved paths and this conversation are all still here. Pro removes the cap.</p>
  <div class="ns-aierror__actions">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm">See Pro</button>
    <span class="ns-aierror__code">resets in 6h 12m</span>
  </div>
</div>` },
      { name: "Offline", note: "Muted, not red. A dropped connection is not a failure of the answer, and colouring it like one teaches students to ignore the colour.", html: `<div class="ns-aierror ns-aierror--offline" role="alert" style="max-inline-size:40rem">
  <p class="ns-aierror__head"><i class="ph ph-plugs" aria-hidden="true"></i> You are offline</p>
  <p class="ns-aierror__text">Your question is saved in the box and will send when the connection is back.</p>
  <div class="ns-aierror__actions">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm"><i class="ph ph-arrows-clockwise" aria-hidden="true"></i> Retry now</button>
  </div>
</div>` },
      { name: "Refused", note: "The one the LMS actually needs: a student asking for the graded assignment's answers. It says no, says why once, and offers the thing it CAN do — no lecture.", html: `<div class="ns-aierror ns-aierror--limit" role="alert" style="max-inline-size:40rem">
  <p class="ns-aierror__head"><i class="ph ph-shield-check" aria-hidden="true"></i> I will not answer the graded assessment</p>
  <p class="ns-aierror__text">This one is marked, and handing you the answer is the one thing that would not help. I can walk you through the concept it tests, or review an attempt you have written.</p>
  <div class="ns-aierror__actions">
    <button type="button" class="ns-btn ns-btn--outline ns-btn--sm">Explain the concept</button>
    <button type="button" class="ns-btn ns-btn--quiet ns-btn--sm">Review my attempt</button>
  </div>
</div>` },
    ],
  },

  {
    id: "ai-welcome", title: "Empty state & starters", family: "AI",
    summary: "The first screen. A blank composer with a blinking cursor tells a beginner nothing about what this thing can do, so the empty state is the capability list: four things a student actually wants, phrased the way a student would say them, each one a real prompt that fills the composer on click.",
    use: ["A new conversation, and the signed-out gate — the promise and the product should match", "Starters that span the four jobs: explain, review my code, plan my learning, help with my career"],
    not: ["Filling the composer AND sending: the student almost always edits a word first, and a question they did not finish reading is a wasted turn", "Cute example prompts nobody would type. “Write a haiku about Apex” teaches a student the tool is a toy"],
    a11y: ["Starters are real buttons, so they are reachable and announced as actions", "The heading is a real heading — this is the page's title when the thread is empty"],
    variants: [
      { name: "New conversation", html: `<div class="ns-aiwelcome" style="max-inline-size:44rem;margin-inline:auto">
  <span class="ns-aiwelcome__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>
  <div>
    <h2 class="ns-aiwelcome__title">What are we working on?</h2>
    <p class="ns-aiwelcome__lede">Ask about a lesson, paste code that will not deploy, or get a route to your next certification.</p>
  </div>
  <div class="ns-aisuggest">
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-book-open-text" aria-hidden="true"></i>Explain</span>
      <span class="ns-aisuggest__text">What is the difference between a workflow rule and a record-triggered flow?</span>
    </button>
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-code" aria-hidden="true"></i>Review</span>
      <span class="ns-aisuggest__text">Here is my trigger — why does it fail on a 200-record load?</span>
    </button>
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-flag-banner-fold" aria-hidden="true"></i>Plan</span>
      <span class="ns-aisuggest__text">Give me a six-week route to Platform Developer I.</span>
    </button>
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-briefcase" aria-hidden="true"></i>Career</span>
      <span class="ns-aisuggest__text">What should a junior admin have on their resume?</span>
    </button>
  </div>
</div>` },
      { name: "In a lesson", note: "The embedded panel's version: three starters, all about the paragraph in front of the student, because that is the only thing they can be about.", html: `<div class="ns-aiwelcome" style="max-inline-size:32rem">
  <div>
    <p class="ns-aiwelcome__lede">Stuck on this lesson? Start here.</p>
  </div>
  <div class="ns-aisuggest">
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-lightbulb" aria-hidden="true"></i>Simplify</span>
      <span class="ns-aisuggest__text">Explain this section as if I have never written a line of Apex.</span>
    </button>
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-terminal-window" aria-hidden="true"></i>Example</span>
      <span class="ns-aisuggest__text">Show me the same thing with real field names.</span>
    </button>
    <button type="button" class="ns-aisuggest__item">
      <span class="ns-aisuggest__kicker"><i class="ph ph-exam" aria-hidden="true"></i>Test me</span>
      <span class="ns-aisuggest__text">Ask me three questions on this lesson.</span>
    </button>
  </div>
</div>` },
    ],
  },

  {
    id: "ai-settings", title: "Settings & sign-in", family: "AI",
    summary: "The assistant's own preferences — how it teaches, what it may read, what it remembers — as rows rather than cards, because a settings screen is a list of decisions. Plus the sign-in gate, which states the reason for the account instead of just blocking the composer.",
    use: ["The assistant settings page; group in the order a student cares — teaching, reading, memory, deletion", "The gate wherever an anonymous visitor meets the assistant"],
    not: ["A modal over a blurred fake transcript — show the real empty state and gate the send", "Hiding what it remembers. If memory is on, the facts it holds are printed on this screen"],
    a11y: ["Each group is a section with a real heading; each row's control has its own label or aria-label", "Destructive rows are marked in text, not by color alone, and their buttons are outline (see Button)"],
    variants: [
      { name: "Settings rows", html: `<div style="max-inline-size:42rem">
  <section class="ns-aiset">
    <h3 class="ns-aiset__legend">How it teaches</h3>
    <div class="ns-aiset__row">
      <div>
        <p class="ns-aiset__name">Default mode</p>
        <p class="ns-aiset__desc">Tutor explains and shows an example. Coach answers with a question first. Reviewer marks the code you paste.</p>
      </div>
      <div class="ns-aiset__control">
        <fieldset class="ns-segmented" aria-label="Default mode">
          <label class="ns-segmented__option"><input type="radio" name="ai-doc-mode" checked><span>Tutor</span></label>
          <label class="ns-segmented__option"><input type="radio" name="ai-doc-mode"><span>Coach</span></label>
          <label class="ns-segmented__option"><input type="radio" name="ai-doc-mode"><span>Reviewer</span></label>
        </fieldset>
      </div>
    </div>
    <div class="ns-aiset__row">
      <div>
        <p class="ns-aiset__name">Always show sources</p>
        <p class="ns-aiset__desc">Every answer cites the lesson it came from. An uncited answer is one you cannot check.</p>
      </div>
      <div class="ns-aiset__control">
        <label class="ns-choice"><input type="checkbox" role="switch" class="ns-switch" checked><span class="ns-choice__text"><span class="ns-choice__label">On</span></span></label>
      </div>
    </div>
    <div class="ns-aiset__row ns-aiset__row--danger">
      <div>
        <p class="ns-aiset__name">Forget what it remembers</p>
        <p class="ns-aiset__desc">Clears the facts it holds about your goals. History and saved paths are kept.</p>
      </div>
      <div class="ns-aiset__control">
        <button type="button" class="ns-btn ns-btn--danger ns-btn--sm">Forget memory</button>
      </div>
    </div>
  </section>
  <p style="margin-block-start:var(--space-4)"><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-ai-settings.html" target="_blank" rel="noopener">Open the full settings screen <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>
</div>` },
      { name: "Sign-in gate", note: "The reason first: the answers are built from this student's own progress, which an anonymous session does not have. Then what signing in buys, then the field.", html: `<div class="ns-aigate">
  <div>
    <h3 class="ns-aigate__title">Sign in to ask</h3>
    <p class="ns-aigate__text">Answers are built from your own progress — which lessons you have finished, where you got stuck, what you are working towards. That needs an account.</p>
  </div>
  <ul class="ns-aigate__list">
    <li><i class="ph ph-check-circle" aria-hidden="true"></i> Answers that cite the lesson you are on</li>
    <li><i class="ph ph-check-circle" aria-hidden="true"></i> Learning paths saved to your dashboard</li>
    <li><i class="ph ph-check-circle" aria-hidden="true"></i> 30 questions a day on the free plan</li>
  </ul>
  <form class="ns-auth__form" action="#">
    <div class="ns-field">
      <label class="ns-field__label" for="ai-doc-email">Email address</label>
      <input id="ai-doc-email" class="ns-input" type="email" autocomplete="email" required>
    </div>
    <div class="ns-aigate__actions">
      <button class="ns-btn ns-btn--primary ns-btn--block" type="submit">Send sign-in link</button>
      <a class="ns-btn ns-btn--quiet ns-btn--block" href="#0">Browse the courses instead</a>
    </div>
  </form>
  <p class="ns-aigate__text">Free, no card. We do not train on your conversations.</p>
</div>` },
      { name: "The signed-out screen", note: "Gate, empty state and disabled composer in one room — what a visitor sees before they hand over an email address.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-ai-signin.html" target="_blank" rel="noopener">Open the signed-out demo <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },

  {
    id: "extcard", title: "External resource card", family: "LMS",
    summary: "A card that LEAVES the site: a Trailhead module, a vendor doc page, someone else's tutorial. Names its destination first, carries what the trip will cost, and says it is leaving before it is clicked rather than after.",
    use: ["\"Go deeper\" at the end of a lesson, where the deeper material is somebody else's and there is no point paraphrasing it", "A prerequisite that lives on another site", "A row of them as a departures board — the destination is what is being chosen between"],
    not: ["A file you take with you — that is Resource card, and it promises something different", "An internal link. Inside the site a card that announces it is leaving is a lie", "More than three or four. A lesson that ends in a wall of other people's material is a lesson that did not finish its own argument"],
    a11y: [
      "Pair the out-arrow with target=\"_blank\" rel=\"noopener\" — the arrow is the visible half of the same promise",
      "The whole card is the &lt;a&gt;, so the accessible name is source + title + meta read as one thing",
      "The arrow is aria-hidden: \"opens in a new tab\" belongs in the link text or its label, not in a glyph",
    ],
    variants: [
      { name: "A departures board", stack: true, note: "The SOURCE leads. A row of these is a row of departures, and where it goes is the thing being chosen between; the title is what it is called once you get there. The meta says what it costs — kind, time, and whatever the destination counts in.", html: `<div class="ns-extcards" style="inline-size:100%">
  <a class="ns-extcard" href="#0">
    <span class="ns-extcard__icon"><i class="ph ph-graduation-cap" aria-hidden="true"></i></span>
    <span class="ns-extcard__body">
      <span class="ns-extcard__source">Trailhead · Salesforce</span>
      <span class="ns-extcard__title">Salesforce Platform Basics</span>
      <span class="ns-extcard__meta"><span>Module</span><span><i class="ph ph-clock" aria-hidden="true"></i>45 min</span><span>700 pts</span></span>
    </span>
    <i class="ph ph-arrow-up-right ns-extcard__cue" aria-hidden="true"></i>
  </a>
  <a class="ns-extcard" href="#0">
    <span class="ns-extcard__icon"><i class="ph ph-book-open-text" aria-hidden="true"></i></span>
    <span class="ns-extcard__body">
      <span class="ns-extcard__source">Developer docs · Salesforce</span>
      <span class="ns-extcard__title">Execution governors and limits</span>
      <span class="ns-extcard__meta"><span>Reference</span><span><i class="ph ph-clock" aria-hidden="true"></i>10 min</span></span>
    </span>
    <i class="ph ph-arrow-up-right ns-extcard__cue" aria-hidden="true"></i>
  </a>
</div>` },
      { name: "In a lesson", note: "One column, at the foot of the written lesson — where \"and now go and do the official module\" belongs.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player-article.html" target="_blank" rel="noopener">See it in place <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },

  /* =================================================== Monetization ==== */
  {
    id: "sponsor", title: "Sponsor card", family: "Monetization",
    summary: "The paid surface, in four shapes. Logo, name, one-line tagline, a sentence and an outline CTA — and a mono <strong>Sponsored</strong> label that is never optional. It is drawn in the system's own hairline vocabulary rather than a louder one, because a sponsor styled to shout is a sponsor that trains the reader to scroll past that style.",
    use: [
      "--skyscraper in a content rail: the one shape with room for the whole pitch stacked",
      "--square in a narrow rail or a grid; the description is dropped, not clamped",
      "--leaderboard under an article or above a footer, where a wide strip fits",
      "--article INSIDE the reading flow, where a card would read as an endorsement",
    ],
    not: [
      "A button for the CTA — it would compete with the one real action on the page. It is a text link with an arrow, the same shape “read more” takes everywhere else",
      "More than one per surface. Two sponsors in a rail is a rail nobody looks at",
      "Above the fold of a paid lesson: a learner who bought the course is not the audience for a second sale",
      "Dropping the label because the design “looks better without it”. It is not decoration",
    ],
    a11y: [
      "The Sponsored label is real text in the DOM, not a background image or a ::before — it must be readable, translatable and announced",
      "The whole card is the &lt;a&gt;; the CTA inside it is a &lt;span&gt;, because a link inside a link is invalid and unnavigable",
      "The logo takes the sponsor's name as its alt, so the card announces WHO it is for before what it says",
    ],
    variants: [
      { name: "Skyscraper", note: "The rail shape, and the only one with room for the label, the mark, the tagline, the description and the action all stacked. Reach for it when the sponsor actually has something to say.", html: `<a class="ns-sponsor ns-sponsor--skyscraper" href="#0" style="max-inline-size:15rem">
  <span class="ns-sponsor__label">Sponsor</span>
  <img class="ns-sponsor__logo" src="../assets/logo/favicon.svg" alt="Orgforce">
  <span class="ns-sponsor__body">
    <span class="ns-sponsor__name">Orgforce</span>
    <span class="ns-sponsor__tagline">Deploy without the change set</span>
    <span class="ns-sponsor__text">CI for Salesforce orgs: a scratch org per pull request, a deploy per merge, and nobody clicking through Setup at midnight.</span>
  </span>
  <span class="ns-sponsor__cta">Try it free <i class="ph ph-arrow-right" aria-hidden="true"></i></span>
</a>` },
      { name: "Square", note: "The compact rail or grid unit. The description is DROPPED rather than clamped: two words of a sentence followed by an ellipsis is worse than no sentence, and the tagline already exists to be the short version.", html: `<a class="ns-sponsor ns-sponsor--square" href="#0" style="max-inline-size:15rem">
  <span class="ns-sponsor__label">Sponsor</span>
  <img class="ns-sponsor__logo" src="../assets/logo/favicon.svg" alt="Orgforce">
  <span class="ns-sponsor__body">
    <span class="ns-sponsor__name">Orgforce</span>
    <span class="ns-sponsor__tagline">Deploy without the change set</span>
    <span class="ns-sponsor__text">Hidden at this size — the headline is the short version.</span>
  </span>
  <span class="ns-sponsor__cta">Try it free <i class="ph ph-arrow-right" aria-hidden="true"></i></span>
</a>` },
      { name: "Leaderboard", stack: true, note: "One line: mark, text, action. For the full width of a content column — under an article, above a footer, between two bands. Stacks below 48rem, because three cells in a phone's width is a logo, four words and a truncated button.", html: `<a class="ns-sponsor ns-sponsor--leaderboard" href="#0" style="inline-size:100%">
  <span class="ns-sponsor__label">Sponsored</span>
  <img class="ns-sponsor__logo" src="../assets/logo/favicon.svg" alt="Orgforce">
  <span class="ns-sponsor__body">
    <span class="ns-sponsor__name">Orgforce</span>
    <span class="ns-sponsor__tagline">Deploy without the change set</span>
    <span class="ns-sponsor__text">A scratch org per pull request. A deploy per merge.</span>
  </span>
  <span class="ns-sponsor__cta">Try it free <i class="ph ph-arrow-right" aria-hidden="true"></i></span>
</a>` },
      { name: "In the article", stack: true, note: "Deliberately NOT a card. A boxed object in a column of prose reads as a pull-quote — something the writer endorsed — and this is not that. Hairline rules top and bottom, no fill, no radius: the visual grammar of an interruption rather than of an inclusion. It is also the only shape set at the prose measure, so it sits inside the text block instead of spanning past it and announcing itself as chrome.", html: `<div class="ns-prose" style="inline-size:100%">
  <p>An aggregate query still returns rows, and those rows still count: 50,000 of them, same as any other query.</p>
</div>
<a class="ns-sponsor ns-sponsor--article" href="#0" style="inline-size:100%">
  <span class="ns-sponsor__label">Sponsored</span>
  <img class="ns-sponsor__logo" src="../assets/logo/favicon.svg" alt="Orgforce">
  <span class="ns-sponsor__body">
    <span class="ns-sponsor__name">Orgforce</span>
    <span class="ns-sponsor__tagline">Deploy without the change set</span>
    <span class="ns-sponsor__text">Every pull request gets a scratch org — including the aggregate queries you just wrote.</span>
  </span>
  <span class="ns-sponsor__cta">Try it free <i class="ph ph-arrow-right" aria-hidden="true"></i></span>
</a>
<div class="ns-prose" style="inline-size:100%">
  <p>A <code>GROUP BY</code> on a field with high cardinality will hit that ceiling on a real org.</p>
</div>` },
      { name: "The empty slot", note: "Before a sponsor is sold. Dashed and plainly unfinished on purpose: it is the one surface in the system allowed to look like a placeholder, because that is exactly what it is. Never ship it to a reader — it is for the layout stage and for the sales page.", html: `<div class="ns-adslot" style="inline-size:100%;max-inline-size:26rem">
  <span class="ns-adslot__label"><i class="ph ph-megaphone" aria-hidden="true"></i>Advertise with us</span>
</div>` },
      { name: "In place", note: "Both player surfaces carry one: <code>--skyscraper</code> or <code>--square</code> under the page rail's list, and <code>--article</code> once inside the lesson, below the fold.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player-article.html" target="_blank" rel="noopener">Article lesson <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player.html" target="_blank" rel="noopener">Video lesson <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
    ],
  },
  {
    id: "adunit", title: "Ad unit", family: "Monetization",
    summary: "The third-party slot — AdSense or any other network. This component is not the ad, it is everything around it: it reserves the creative's exact height at every breakpoint so nothing shifts when the fill lands, discloses that it is an ad in real DOM text, holds a skeleton while the network thinks, and collapses honestly when no fill comes back. Every format is <em>one</em> class that changes size by breakpoint — 320&times;100 on a phone becomes 728&times;90 on a tablet becomes 970&times;90 on a desktop — so a page has one slot in one place in the markup rather than three with two of them <code>display:none</code>, which is how a page ends up requesting three ads and rendering one.",
    use: [
      "Any network slot: the frame goes here, the <code>&lt;ins&gt;</code> or iframe goes inside it",
      "--leaderboard above the content, --halfpage or --skyscraper in a rail, --article between paragraphs",
      "--fluid and --article below the fold, where a responsive unit that grows on render shifts only what the reader has already passed",
      "The dummy creative during layout and local development, so a slot that never fills is still visible in a screenshot",
    ],
    not: [
      "The Sponsor card. That one is a native placement we design, write and control; this is a box for someone else's artwork",
      "A frame with no reserved height. <code>min-height:0</code> plus a late creative is the single largest source of layout shift on an ad-funded page",
      "A slot above the reader's current line that can grow. Growing downward still moves the sentence they are reading",
      "Chrome around a live creative — a border on a filled display unit makes it look native, which is the one thing it must not look",
      "An interstitial on entry, or an anchor with no close button. Both are policy violations on every network that sells the format, and both are dark patterns before they are that",
    ],
    a11y: [
      "The disclosure is the visible label, in the DOM, as real text — never an aria-label and never a background image. A screen reader user gets the same warning from the same node, so the two cannot drift",
      "The interstitial is a real &lt;dialog&gt;, so focus trapping, Esc-to-close and inertness of the page behind come from the platform rather than from a script that gets it 80% right",
      "The anchor's close button is a full --target-min touch target, present from the first frame",
      "--parallax is motion tied to scroll, so it is switched off under prefers-reduced-motion rather than slowed down",
      "Ads are removed in print — a reserved empty frame prints as a blank box in the middle of the article",
    ],
    variants: [
      { name: "The responsive leaderboard", stack: true, note: "One class, three sizes. The phone step is not a scaled-down 728 — it is the 320&times;100 mobile leaderboard, a unit the networks sell separately, because a 728px creative squeezed into a phone is unreadable and a phone showing nothing is unsold inventory. Resize the window: the frame changes size, the markup does not.", html: `<div class="ns-ad ns-ad--leaderboard" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame">
    <span class="ns-ad__dummy" aria-hidden="true">
      <span class="ns-ad__dummy-name">Leaderboard</span>
      <span class="ns-ad__dummy-size">320x100 &middot; 728x90 &middot; 970x90</span>
    </span>
  </div>
</div>
<div class="ns-ad ns-ad--billboard" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame">
    <span class="ns-ad__dummy" aria-hidden="true">
      <span class="ns-ad__dummy-name">Billboard</span>
      <span class="ns-ad__dummy-size">300x250 &middot; 728x90 &middot; 970x250</span>
    </span>
  </div>
</div>` },
      { name: "Skeleton while it loads", stack: true, note: "<code>data-state=\"loading\"</code> is the default, and the space is already held at full height before a single byte of the creative has arrived — which is the entire job. The mono size stamp is a development aid that costs nothing in production: a slot that never fills is invisible in a screenshot unless it says what it was waiting for.", html: `<div class="ns-ad ns-ad--leaderboard" data-state="loading">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame">
    <span class="ns-ad__skeleton ns-skeleton" aria-hidden="true">728x90</span>
  </div>
</div>
<div class="ns-ad ns-ad--rectangle" data-state="loading">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame">
    <span class="ns-ad__skeleton ns-skeleton" aria-hidden="true">300x250</span>
  </div>
</div>` },
      { name: "Rectangles and squares", stack: true, note: "The in-content workhorses. <code>--rectangle</code> (300&times;250) is the most-sold display size on the internet; <code>--rectangle-lg</code> (336&times;280) is the same shape given a rail that can afford it; <code>--square</code> steps 250&times;250 → 300&times;250 at tablet.", html: `<div class="ns-ad ns-ad--rectangle" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Medium rectangle</span><span class="ns-ad__dummy-size">300x250</span></span></div>
</div>
<div class="ns-ad ns-ad--rectangle-lg" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Large rectangle</span><span class="ns-ad__dummy-size">336x280</span></span></div>
</div>
<div class="ns-ad ns-ad--square" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Square</span><span class="ns-ad__dummy-size">250x250 &middot; 300x250</span></span></div>
</div>` },
      { name: "The tall rail units", stack: true, note: "<code>--halfpage</code> (300&times;600), <code>--skyscraper</code> (160&times;600) and <code>--skyscraper-sm</code> (120&times;600). Wrap any of them in <code>.ns-ad-rail</code> and the unit sticks as the reader goes down a long article — sticky rather than fixed, so it stops at the end of its own column instead of floating over the footer.", html: `<div style="display:flex;gap:var(--space-5);align-items:flex-start">
  <div class="ns-ad ns-ad--halfpage" data-state="filled">
    <span class="ns-ad__label">Advertisement</span>
    <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Half page</span><span class="ns-ad__dummy-size">300x600</span></span></div>
  </div>
  <div class="ns-ad ns-ad--skyscraper ns-ad-rail" data-state="filled">
    <span class="ns-ad__label">Advertisement</span>
    <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Skyscraper</span><span class="ns-ad__dummy-size">160x600</span></span></div>
  </div>
  <div class="ns-ad ns-ad--skyscraper-sm" data-state="filled">
    <span class="ns-ad__label">Advertisement</span>
    <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Narrow</span><span class="ns-ad__dummy-size">120x600</span></span></div>
  </div>
</div>` },
      { name: "Phone-only banners", stack: true, note: "<code>--banner</code> (320&times;50) and <code>--banner-lg</code> (320&times;100) are hidden above 48rem, deliberately: a 320&times;50 banner on a desktop is not a small ad, it is a broken one. On this page they disappear when the window is wide — that is the component working.", html: `<div class="ns-ad ns-ad--banner" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-size">320x50</span></span></div>
</div>
<div class="ns-ad ns-ad--banner-lg" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-size">320x100</span></span></div>
</div>` },
      { name: "In-article", stack: true, note: "The native unit inside the prose, set at the reading measure with rules above and below — the same “this is an aside” device the article sponsor uses, so a reader who has learned one has learned both. Highest revenue and highest risk: an in-article unit that is not clearly labelled reads as a paragraph the writer wrote.", html: `<div class="ns-prose" style="inline-size:100%">
  <p>A <code>GROUP BY</code> on a field with high cardinality will hit the query ceiling on a real org, and the governor limit is not negotiable from Apex.</p>
</div>
<div class="ns-ad ns-ad--article" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">In-article</span><span class="ns-ad__dummy-size">fluid</span></span></div>
</div>
<div class="ns-prose" style="inline-size:100%">
  <p>The way around it is to aggregate in the database rather than in the loop, which is the whole reason aggregate functions exist.</p>
</div>` },
      { name: "In-feed", stack: true, note: "Between the cards in a listing, so it has to be card-shaped without being mistakable for a card. It keeps the dashed edge <em>even when filled</em>: in a grid of eight real courses, the one that is an ad has to be findable at a glance.", html: `<div class="ns-grid" style="grid-template-columns:repeat(auto-fill,minmax(13rem,1fr));gap:var(--gap-grid);inline-size:100%">
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><span class="ns-card__title">Apex basics</span></div></div>
  <div class="ns-ad ns-ad--feed" data-state="filled">
    <span class="ns-ad__label">Advertisement</span>
    <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">In-feed</span><span class="ns-ad__dummy-size">fluid</span></span></div>
  </div>
  <div class="ns-card"><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><span class="ns-card__title">Flow builder</span></div></div>
</div>` },
      { name: "Multiplex", stack: true, note: "The grid of native recommendations — several ads in one block, so it is labelled <em>once</em>, at the top, for the whole thing.", html: `<div class="ns-ad ns-ad--multiplex" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame">
    <div class="ns-ad__grid">
      <span class="ns-ad__tile"><span class="ns-ad__tile-thumb"></span><span class="ns-ad__tile-title">Ship your first managed package</span><span class="ns-ad__tile-src">orgforce.dev</span></span>
      <span class="ns-ad__tile"><span class="ns-ad__tile-thumb"></span><span class="ns-ad__tile-title">Static analysis for Apex, free tier</span><span class="ns-ad__tile-src">lintforce.io</span></span>
      <span class="ns-ad__tile"><span class="ns-ad__tile-thumb"></span><span class="ns-ad__tile-title">Sandbox seeding in ninety seconds</span><span class="ns-ad__tile-src">seedbox.app</span></span>
    </div>
  </div>
</div>` },
      { name: "Parallax", stack: true, note: "A creative held still while the page scrolls over it, done with <code>background-attachment: fixed</code> on a clipped frame rather than a scroll listener — no JavaScript, nothing to jank. iOS Safari ignores it and falls back to a normal scrolling background, which is a graceful degradation rather than a bug to fight with a transform hack. Off entirely under reduced motion. Scroll the page to see it.", html: `<div class="ns-ad ns-ad--parallax" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame" style="background-image:linear-gradient(135deg,var(--color-brand-700),var(--color-brand-400))">
    <span class="ns-ad__dummy" aria-hidden="true" style="background-color:transparent;background-image:none;border:0"><span class="ns-ad__dummy-name" style="color:var(--color-on-dark)">Parallax</span><span class="ns-ad__dummy-size" style="color:var(--color-on-dark)">fluid x 320</span></span>
  </div>
</div>` },
      { name: "Anchor — the floating bottom strip", stack: true, note: "The most intrusive format still defensible, and only because of what is attached to it: a real close button at a full touch target, <code>.ns-ad-anchored</code> on the page shell so the last paragraph clears it, and <code>--z-sticky</code> rather than <code>--z-overlay</code> so the player bar or a save bar is never covered by an ad. Shown here in place rather than fixed, so it does not follow you around the styleguide — the page shell around it carries <code>.ns-ad-anchored</code>, which is what reserves the clearance.", html: `<div class="ns-ad-anchored" style="position:relative;inline-size:100%;padding-block-start:var(--space-8)">
  <div class="ns-ad ns-ad--anchor" data-state="filled" style="position:static">
    <button type="button" class="ns-ad__dismiss" aria-label="Close advertisement"><i class="ph ph-x" aria-hidden="true"></i></button>
    <span class="ns-ad__label">Advertisement</span>
    <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-size">320x100 &middot; 728x90</span></span></div>
  </div>
</div>` },
      { name: "Interstitial", stack: true, note: "Inside the system's real <code>&lt;dialog&gt;</code>, so focus trapping, Esc and the backdrop come from the platform. The close button is present from the first frame at full size — an interstitial whose close control is a 12px grey &times; after a three-second delay is a dark pattern before it is a policy violation, and it is both.", script: `document.getElementById('ad-interstitial-open').addEventListener('click', function () { document.getElementById('ad-interstitial').showModal(); });
document.getElementById('ad-interstitial-close').addEventListener('click', function () { document.getElementById('ad-interstitial').close(); });`, html: `<button class="ns-btn ns-btn--outline" id="ad-interstitial-open">Show interstitial</button>
<dialog class="ns-modal ns-ad-modal" id="ad-interstitial" aria-label="Advertisement">
  <button class="ns-btn ns-btn--quiet ns-btn--icon ns-ad-modal__close" id="ad-interstitial-close" aria-label="Close advertisement"><i class="ph ph-x" aria-hidden="true"></i></button>
  <div class="ns-ad" data-state="filled">
    <span class="ns-ad__label">Advertisement</span>
    <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Interstitial</span><span class="ns-ad__dummy-size">336x280 &middot; 300x600</span></span></div>
  </div>
</dialog>` },
      { name: "Empty and blocked", stack: true, note: "The two states everyone forgets. <code>empty</code> means no fill came back — add <code>data-collapse</code> and the slot removes itself entirely, because the reservation existed to stop a shift while the ad was in flight and once the answer is “there is no ad” the honest thing is to give the space back. <code>blocked</code> says so once, quietly, and never nags: “please disable your ad blocker” is a demand, and a line about membership is an offer.", html: `<div class="ns-ad ns-ad--rectangle" data-state="empty">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__note"><span class="ns-ad__note-title">No fill</span>This slot collapses in production.</span></div>
</div>
<div class="ns-ad ns-ad--rectangle" data-state="blocked">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__note"><span class="ns-ad__note-title">Ads are off</span>Members read without them &mdash; and so do you, right now.</span></div>
</div>` },
      { name: "Fluid / responsive auto", stack: true, note: "The network sizes this one itself, which means its height is unknown until it renders — the exact thing the reservation exists to prevent. The compromise the whole industry landed on: reserve the minimum the unit can serve and let it grow downward only. Which is why a fluid unit belongs below the fold, never above the reader's current line.", html: `<div class="ns-ad ns-ad--fluid" data-state="filled" style="max-inline-size:40rem">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame"><span class="ns-ad__dummy" aria-hidden="true"><span class="ns-ad__dummy-name">Responsive</span><span class="ns-ad__dummy-size">100% x min 250</span></span></div>
</div>` },
      { name: "In place, on a real page", note: "Every placement wired into an actual blog post: leaderboard above the masthead, skyscraper in the rail, in-article after the first section, parallax deep in the scroll, fluid at the end of the body, multiplex and in-feed at the foot, a dismissible anchor and an interstitial behind a button. The skeletons are live — the slots start in <code>loading</code> and flip to <code>filled</code> after a beat, so you can watch the reservation hold. <strong>It carries every format at once and no real page should</strong>; the template says so at the top and names the three worth keeping. The responsive page is the same post in three real iframes, which is the only honest way to show a size ladder — media queries answer to the viewport, so a narrow <code>div</code> would keep serving the desktop unit.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-blog-ads.html" target="_blank" rel="noopener">Blog post with ads <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-blog-ads-responsive.html" target="_blank" rel="noopener">The ladder at three widths <i class="ph ph-arrow-up-right" aria-hidden="true"></i></a></p>` },
      { name: "The dummy creative", note: "Deliberately hatched and stamped with its own dimensions, so nobody screenshots a page for a client and ships a placeholder believing it was a live unit. Use it for layout work and local development where no network is wired up.", html: `<div class="ns-ad ns-ad--rectangle" data-state="filled">
  <span class="ns-ad__label">Advertisement</span>
  <div class="ns-ad__frame">
    <span class="ns-ad__dummy" aria-hidden="true">
      <span class="ns-ad__dummy-name">Your ad here</span>
      <span class="ns-ad__dummy-size">300x250</span>
    </span>
  </div>
</div>` },
    ],
  },
];
