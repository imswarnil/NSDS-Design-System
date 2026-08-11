/* Namaste UI — component documentation registry.
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

export const FAMILIES = ["Actions", "Forms", "Feedback", "Progress & data", "Navigation", "Overlays", "Surfaces", "Sections", "Admin"];

export const COMPONENTS = [

  /* ======================================================== Actions ==== */
  {
    id: "button", title: "Button", family: "Actions",
    summary: "The action primitive. Solid brand fill is reserved for `primary` — the one thing to click on a screen. Everything else is a hairline. Press is an instant opacity dim: no bounce, no lift.",
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
      { name: "Default / disabled", html: `<input class="ns-input" placeholder="you@example.com" style="max-inline-size:16rem">
<input class="ns-input" value="Not editable" disabled style="max-inline-size:16rem">` },
      { name: "Mono — for data", html: `<input class="ns-input ns-input--mono" value="00D5g000004abcEAA" style="max-inline-size:16rem">` },
      { name: "Icon and shortcut hint", html: `<span class="ns-input-wrap" style="max-inline-size:20rem">
  <i class="ph ph-magnifying-glass ns-input-wrap__icon" aria-hidden="true"></i>
  <input class="ns-input ns-input--has-icon ns-input--has-hint" type="search" placeholder="Search courses…">
  <kbd class="ns-input-wrap__hint" aria-hidden="true">⌘K</kbd>
</span>` },
      { name: "Invalid", html: `<input class="ns-input" value="not-an-email" aria-invalid="true" style="max-inline-size:16rem">` },
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
    summary: "Hairlines only, no zebra — mono numerals already make rows read as rows. Numeric columns are tabular and end-aligned so digits stack. The wrapper is mandatory: it is what makes a wide table scroll inside itself on a phone.",
    use: ["Lesson lists, scores, anything genuinely tabular"],
    not: ["Card-shaped content forced into rows"],
    a11y: ["tabindex=\"0\" on the wrapper — a scroll region must be keyboard-reachable", "Sortable headers put aria-sort on the <th> and a real <button> inside it"],
    variants: [
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
  <button class="ns-menu__item" role="menuitem"><i class="ph ph-download-simple" aria-hidden="true"></i> Download notes</button>
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
    id: "auth", title: "Auth screens", family: "Surfaces",
    summary: "Sign in, sign up, forgot/reset in one .ns-auth shell. Ghost is passwordless (magic link — templates/signin-form.html); the Next.js app renders the password variants (components/auth). The code-comment kicker makes the screen unmistakably this brand.",
    use: ["Any screen whose single job is an identity action"],
    not: ["In-page account settings — the account panel"],
    a11y: ["Sign-in errors never say WHICH field was wrong — that confirms account existence to a guesser", "The forgot-password confirmation reads the same whether or not the account exists", "autocomplete attributes are what make password managers work — current-password vs new-password matters"],
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
      { name: "Sent confirmation", note: "Replaces the form; echoes the address in mono so the user can catch their own typo.", html: `<div class="ns-auth__sent" role="status" style="max-inline-size:22rem">
  <p class="ns-auth__sent-title"><i class="ph ph-check-circle" aria-hidden="true"></i> Check your inbox</p>
  <p>If an account exists for <code>you@example.com</code>, a reset link is on its way. It expires in one hour.</p>
</div>` },
      { name: "Live password rules", note: "Not a strength bar — \"add a symbol\" is actionable, a yellow bar is a mood.", html: `<ul class="ns-auth__rules" style="list-style:none;padding:0;margin:0">
  <li><span class="ns-status ns-status--success">At least 8 characters</span></li>
  <li><span class="ns-status ns-status--success">Contains a number</span></li>
  <li><span class="ns-status ns-status--idle">Contains a symbol</span></li>
</ul>` },
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
  <i class="ph ph-paperclip" aria-hidden="true"></i> Attach a screenshot (optional)
  <input type="file">
</label>` },
    ],
  },
  {
    id: "player", title: "Course player", family: "Surfaces",
    summary: "The screen a learner lives in: 16:9 stage on brand-900 in both themes, lesson header, prev/next with ←/→ shortcuts, and the curriculum rail with done / current / locked rows. Two columns ≥ lg; below, a single column with the stage always first.",
    use: ["Lesson pages in both products — Ghost via templates/course-player.html, Next.js via CoursePlayer/LessonRail"],
    not: ["Marketing pages with one embedded video — that is just a video in prose"],
    a11y: ["←/→ move lessons; space/k is left to the media element — stealing it breaks the player's own controls", "Row state is spelled for assistive tech (\"completed\", \"locked — members only\"), not only drawn", "Locked rows stay links (to the upgrade page) — a dead row explains nothing"],
    variants: [
      { name: "Lesson rows", note: "done replaces the index with a check — the number has done its job; current gets the accent line; locked dims but stays a link.", html: `<div style="max-inline-size:22rem;border:1px solid var(--color-border);border-radius:var(--radius-card);overflow:hidden">
  <a class="ns-lesson" href="#" data-state="done">
    <span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check"></i></span>
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
      { name: "Full layout", note: "The complete two-column screen — the framework-agnostic template rendered with the real stylesheet. Resize it to see the single-column collapse.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-player.html" target="_blank" rel="noopener">Open the full-screen demo <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a></p>` },
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
    ],
  },
  {
    id: "hero-section", title: "Hero", family: "Sections",
    summary: "The page opener: kicker, display-size balanced title, lede, two actions and one mono proof line. Text-first — no screenshot collage, no illustration required.",
    use: ["The top of the home page and major landing pages", "The proof line for one concrete fact — course count, price, cohort date"],
    not: ["Interior pages — a PageHead or a plain h1 opens those", "More than two actions; the second is already optional"],
    a11y: ["The title is the page's h1", "Proof line is real text, not an image"],
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
      { name: "Full page", note: "All seven bands composed in canonical order — the framework-agnostic template rendered with the real stylesheet.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-sections.html" target="_blank" rel="noopener">Open the full-page demo <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a></p>` },
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
    id: "logo-row", title: "Logo row", family: "Sections",
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
  {
    id: "admin-shell", title: "Admin shell", family: "Admin",
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
      { name: "Full screens", note: "The three admin surfaces as full-screen demos — the framework-agnostic templates rendered with the real stylesheet.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-dashboard.html" target="_blank" rel="noopener">Dashboard <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-course-new.html" target="_blank" rel="noopener">Create a course <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-lesson-editor.html" target="_blank" rel="noopener">Lesson editor <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a></p>` },
    ],
  },
  {
    id: "admin-nav", title: "Admin nav", family: "Admin",
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
    id: "pagehead", title: "Page head", family: "Admin",
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
    id: "stat", title: "Stat card", family: "Admin",
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
    id: "toolbar", title: "Toolbar", family: "Admin",
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
    id: "editor-layout", title: "Editor layout", family: "Admin",
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
    id: "publishbar", title: "Publish bar", family: "Admin",
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
    id: "titlebox", title: "Title box & slug", family: "Admin",
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
    id: "rte", title: "Rich text", family: "Admin",
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
    id: "builder", title: "Curriculum builder", family: "Admin",
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
    id: "dropzone", title: "Dropzone & file row", family: "Admin",
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
    id: "taginput", title: "Tag input", family: "Admin",
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
];
