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

export const FAMILIES = ["Actions", "Forms", "Form patterns", "Feedback", "Progress & data", "Navigation", "Overlays", "Surfaces", "Media", "LMS", "CMS", "Sections"];

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
  <i class="ph ph-paperclip" aria-hidden="true"></i> Attach a screenshot (optional)
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
    <img class="ns-card__media" src="../assets/img/publication-cover.svg" alt="">
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
    <img class="ns-card__media" src="../assets/img/publication-cover.svg" alt="">
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
  <img class="ns-card__media" src="../assets/img/training-trail.svg" alt="">
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Continue</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Admin certification path</span></a>
    <span class="ns-ccard__meta"><span>Lesson 08 of 14</span><span>21:15 left</span></span>
    <progress class="ns-progress" value="8" max="14" aria-label="8 of 14 lessons complete"></progress>
  </div>
</div>` },
      { name: "Members-only", note: "Locked stays a real link — to the join page; the lock is a tag, never an overlay wash.", html: `<div class="ns-card ns-ccard" style="max-inline-size:18rem">
  <span class="ns-ccard__mediawrap">
    <img class="ns-card__media" src="../assets/img/publication-cover.svg" alt="">
    <span class="ns-tag ns-ccard__level"><i class="ph ph-lock-simple" aria-hidden="true"></i> Members</span>
  </span>
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Course</span>
    <a class="ns-card__link" href="#"><span class="ns-card__title">Bulk-safe Apex patterns</span></a>
    <span class="ns-ccard__meta"><span>9 lessons</span><span>2h 10m</span></span>
  </div>
</div>` },
    ],
  },
  {
    id: "curriculum", title: "Curriculum", family: "LMS",
    summary: "The course's table of contents on the detail page: mono-indexed section heads over the SAME .ns-lesson rows the player rail uses — a lesson looks identical before and during the course. Free-preview rows say so; locked rows link to joining.",
    use: ["The course detail page, below the description", "Anywhere the full course structure is promised"],
    not: ["Inside the player — that is the player's own rail", "Editing — Curriculum builder (CMS)"],
    a11y: ["Rows are links; state is spelled in visually-hidden text, not only drawn", "Section heads are headings, so the rotor jumps section to section"],
    variants: [
      { name: "Two sections", html: `<div class="ns-curriculum" style="max-inline-size:26rem;inline-size:100%">
  <section class="ns-curriculum__section">
    <header class="ns-curriculum__head">
      <span class="ns-curriculum__index">01</span>
      <h3 class="ns-curriculum__title">Getting oriented</h3>
      <span class="ns-curriculum__meta">3 lessons · 32m</span>
    </header>
    <a class="ns-lesson" href="#" data-state="done"><span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check"></i></span><span class="ns-lesson__title">What is an org?<span class="ns-visually-hidden"> (completed)</span></span><span class="ns-lesson__time">08:12</span></a>
    <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">02</span><span class="ns-lesson__title">Objects &amp; fields</span><span class="ns-lesson__time">12:40</span></a>
    <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">03</span><span class="ns-lesson__title">Navigation that sticks</span><span class="ns-lesson__time">11:08</span></a>
  </section>
  <section class="ns-curriculum__section">
    <header class="ns-curriculum__head">
      <span class="ns-curriculum__index">02</span>
      <h3 class="ns-curriculum__title">Your first automation</h3>
      <span class="ns-curriculum__meta">2 lessons · 41m</span>
    </header>
    <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">04</span><span class="ns-lesson__title">Flow builder basics</span><span class="ns-lesson__time">20:00</span></a>
    <a class="ns-lesson" href="#" data-state="locked"><span class="ns-lesson__index" aria-hidden="true">05</span><span class="ns-lesson__title">Approval flows<span class="ns-visually-hidden"> (locked — members only)</span></span><span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span></a>
  </section>
</div>` },
      { name: "Free preview", note: "The free rows carry the tag; everything else reads as it will after joining.", html: `<div class="ns-curriculum" style="max-inline-size:26rem;inline-size:100%">
  <section class="ns-curriculum__section">
    <header class="ns-curriculum__head">
      <span class="ns-curriculum__index">01</span>
      <h3 class="ns-curriculum__title">Start here</h3>
      <span class="ns-curriculum__meta">2 free · 4 total</span>
    </header>
    <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">01</span><span class="ns-lesson__title">Welcome &amp; setup</span><span class="ns-lesson__time"><span class="ns-tag">Free</span></span></a>
    <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">02</span><span class="ns-lesson__title">The data model tour</span><span class="ns-lesson__time"><span class="ns-tag">Free</span></span></a>
    <a class="ns-lesson" href="#" data-state="locked"><span class="ns-lesson__index" aria-hidden="true">03</span><span class="ns-lesson__title">Security model<span class="ns-visually-hidden"> (locked)</span></span><span class="ns-lesson__time"><i class="ph ph-lock" aria-hidden="true"></i></span></a>
  </section>
</div>` },
    ],
  },
  {
    id: "lesson-nav", title: "Lesson navigation", family: "LMS",
    summary: "Prev / progress / next, plus the mono \"up to course\" crumb. The standalone version of the player's bar, so an article-type lesson gets identical chrome; --sticky pins it on long reads.",
    use: ["The foot of every lesson — video, article or lab", "--sticky on long article lessons"],
    not: ["Course-to-course navigation — that is the catalog"],
    a11y: ["Prev/next are links with real names; ←/→ shortcuts mirror them in the player", "The progress element carries the human numbers in aria-label"],
    variants: [
      { name: "Default", html: `<div style="max-inline-size:34rem;inline-size:100%">
  <a class="ns-lesson-nav__up" href="#"><i class="ph ph-caret-up" aria-hidden="true"></i> apex basics · section 2</a>
  <div class="ns-lesson-nav">
    <a class="ns-btn ns-btn--outline ns-btn--sm" href="#"><i class="ph ph-caret-left" aria-hidden="true"></i> Previous</a>
    <div class="ns-progress-row">
      <progress class="ns-progress" value="6" max="12" aria-label="6 of 12 lessons"></progress>
      <span class="ns-progress-row__value">6/12</span>
    </div>
    <a class="ns-btn ns-btn--primary ns-btn--sm" href="#">Next lesson <i class="ph ph-caret-right" aria-hidden="true"></i></a>
  </div>
</div>` },
      { name: "End of course", note: "The last lesson's next action is the completion, not a dead arrow.", html: `<div class="ns-lesson-nav" style="max-inline-size:34rem;inline-size:100%">
  <a class="ns-btn ns-btn--outline ns-btn--sm" href="#"><i class="ph ph-caret-left" aria-hidden="true"></i> Previous</a>
  <div class="ns-progress-row">
    <progress class="ns-progress" value="12" max="12" aria-label="12 of 12 lessons"></progress>
    <span class="ns-progress-row__value">12/12</span>
  </div>
  <a class="ns-btn ns-btn--primary ns-btn--sm" href="#"><i class="ph ph-seal-check" aria-hidden="true"></i> Finish course</a>
</div>` },
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
  <a class="ns-lesson" href="#" data-state="done"><span class="ns-lesson__index" aria-hidden="true"><i class="ph ph-check"></i></span><span class="ns-lesson__title">SELECT and WHERE</span><span class="ns-lesson__time">14:02</span></a>
  <a class="ns-lesson" href="#" aria-current="true"><span class="ns-lesson__index" aria-hidden="true">07</span><span class="ns-lesson__title">SOQL joins: relationships</span><span class="ns-lesson__time">21:15</span></a>
  <a class="ns-lesson" href="#"><span class="ns-lesson__index" aria-hidden="true">08</span><span class="ns-lesson__title">Aggregate queries</span><span class="ns-lesson__time">18:40</span></a>
</dialog>` },
    ],
  },
  {
    id: "course-detail", title: "Course detail page", family: "LMS",
    summary: "The course's landing: dark hero (title, meta, the one primary action), then description + curriculum in the content column with a sticky rail — includes, instructor, the enroll card. One primary button on the whole page.",
    use: ["Every course's public page, both products"],
    not: ["The lesson experience — Course player"],
    a11y: ["The hero's enroll button and the rail's are the same action — one label, both reachable", "The curriculum is the real component, so its row semantics come along"],
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
      <p class="ns-railbox__head">This course</p>
      <p style="font-size:var(--size-small);color:var(--color-muted)">12 lessons · 3h 40m · certificate</p>
      <button class="ns-btn ns-btn--primary ns-btn--block" style="margin-block-start:var(--space-3)">Start learning free</button>
    </div>
    <div class="ns-railbox">
      <p class="ns-railbox__head">Instructor</p>
      <div style="display:flex;align-items:center;gap:var(--space-3)">
        <span class="ns-avatar">SW</span>
        <span style="font-size:var(--size-small)">Swarnil Singhai<br><span style="color:var(--color-muted)">Salesforce architect</span></span>
      </div>
    </div>
  </aside>
</div>` },
      { name: "Full page", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-course-detail.html" target="_blank" rel="noopener">Open the full-screen demo <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a></p>` },
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
    <div class="ns-card ns-ccard" data-topic="dev"><span class="ns-ccard__mediawrap"><img class="ns-card__media" src="../assets/img/publication-cover.svg" alt=""><span class="ns-tag ns-ccard__level">Beginner</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Apex basics</span></a><span class="ns-ccard__meta"><span>12 lessons</span></span></div></div>
    <div class="ns-card ns-ccard" data-topic="admin"><span class="ns-ccard__mediawrap"><img class="ns-card__media" src="../assets/img/training-trail.svg" alt=""><span class="ns-tag ns-ccard__level">Beginner</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Admin fundamentals</span></a><span class="ns-ccard__meta"><span>14 lessons</span></span></div></div>
    <div class="ns-card ns-ccard" data-topic="admin"><span class="ns-ccard__mediawrap"><img class="ns-card__media" src="../assets/img/publication-cover.svg" alt=""><span class="ns-tag ns-ccard__level">Intermediate</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Flows, end to end</span></a><span class="ns-ccard__meta"><span>9 lessons</span></span></div></div>
    <div class="ns-card ns-ccard" data-topic="dev"><span class="ns-ccard__mediawrap"><img class="ns-card__media" src="../assets/img/training-trail.svg" alt=""><span class="ns-tag ns-ccard__level">Advanced</span></span><div class="ns-card__body"><span class="ns-card__kicker">// Course</span><a class="ns-card__link" href="#"><span class="ns-card__title">Bulk-safe Apex</span></a><span class="ns-ccard__meta"><span>9 lessons</span></span></div></div>
  </div>
</div>` },
      { name: "Full page", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-course-listing.html" target="_blank" rel="noopener">Open the full-screen demo <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a></p>` },
    ],
  },
  {
    id: "player", title: "Course player", family: "LMS",
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
      { name: "Full screens", note: "The three admin surfaces as full-screen demos — the framework-agnostic templates rendered with the real stylesheet.", html: `<p><a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-dashboard.html" target="_blank" rel="noopener">Dashboard <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-course-new.html" target="_blank" rel="noopener">Create a course <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline ns-btn--sm" href="./demo-admin-lesson-editor.html" target="_blank" rel="noopener">Lesson editor <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a></p>` },
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
  <img class="ns-card__media" src="../assets/img/publication-cover.svg" alt="">
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
  <img class="ns-card__media" src="../assets/img/training-trail.svg" alt="">
  <div class="ns-card__body">
    <span class="ns-card__kicker">// Training</span>
    <span class="ns-card__title">Trailhead in a weekend</span>
    <p class="ns-card__text">The 12 badges that matter, nothing else.</p>
  </div>
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
<span class="ns-avatar-ring" style="--p:100"><span class="ns-avatar"><i class="ph ph-check" aria-hidden="true"></i></span></span>` },
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
      <span class="ns-themeswitch__knob" aria-hidden="true"><i class="ph ph-sun"></i><i class="ph ph-moon"></i></span>
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
      <span class="ns-themeswitch__knob" aria-hidden="true"><i class="ph ph-sun"></i><i class="ph ph-moon"></i></span>
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
      { name: "The whole thing", note: "Announcement, mega menu, dropdown, search, theme, auth, hamburger and sheet — assembled, at full page width, from <code>templates/navbar.html</code>: <a href=\"./demo-navbar.html\">open the full navbar demo ↗</a>. Resize below 64rem to get the hamburger and the mobile sheet.", html: `<a class="ns-btn ns-btn--outline" href="./demo-navbar.html">Open the full navbar demo <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a>
<a class="ns-btn ns-btn--outline" href="./demo-navbar-blog.html">Open the blog navbar demo <i class="ph ph-arrow-square-out" aria-hidden="true"></i></a>` },
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
        <button type="button" class="ns-menu__item ns-menu__item--danger"><i class="ph ph-arrow-square-out" aria-hidden="true"></i> Sign out</button>
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
      { name: "Course bar", flush: true, note: "Back · position · title · completion · the one primary. Full page: <a href=\"./demo-navbar-course.html\">open the course bar demo ↗</a>", html: `<nav class="ns-coursenav" aria-label="Course example">
  <a class="ns-coursenav__back" href="#"><i class="ph ph-arrow-left" aria-hidden="true"></i> <span>Salesforce Admin</span></a>
  <span class="ns-topnav__divider" aria-hidden="true"></span>
  <span class="ns-coursenav__id">
    <span class="ns-coursenav__kicker">Module 02 · Lesson 07 / 24</span>
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
    <button type="button" class="ns-btn ns-btn--primary ns-btn--sm"><i class="ph ph-check" aria-hidden="true"></i> <span class="ns-coursenav__next-label">Complete &amp; next</span></button>
  </div>
</nav>` },
      { name: "Course bar on the stage", dark: true, flush: true, note: "<code>--dark</code> for a player whose video stage stays navy in both themes — the bar meets the stage rather than framing it in white.", html: `<nav class="ns-coursenav ns-coursenav--dark" aria-label="Dark course example">
  <a class="ns-coursenav__back" href="#"><i class="ph ph-arrow-left" aria-hidden="true"></i> <span>Apex for Admins</span></a>
  <span class="ns-topnav__divider" aria-hidden="true"></span>
  <span class="ns-coursenav__id">
    <span class="ns-coursenav__kicker">Lesson 12 / 31</span>
    <span class="ns-coursenav__title">Writing your first trigger</span>
  </span>
  <div class="ns-coursenav__progress">
    <span class="ns-coursenav__pct">38%</span>
    <div class="ns-coursenav__bar" role="progressbar" aria-label="Course progress" aria-valuenow="38" aria-valuemin="0" aria-valuemax="100" style="--p:38"><span></span></div>
  </div>
  <div class="ns-coursenav__actions">
    <button type="button" class="ns-navicon" aria-label="Previous lesson"><i class="ph ph-caret-left" aria-hidden="true"></i></button>
    <button type="button" class="ns-btn ns-btn--white ns-btn--sm"><i class="ph ph-check" aria-hidden="true"></i> Complete</button>
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
      <span class="ns-themeswitch__knob" aria-hidden="true"><i class="ph ph-sun"></i><i class="ph ph-moon"></i></span>
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
    summary: "Three forms of one control, all flipping the theme through <code>window.nsTheme</code> so the Ghost theme and the app can never disagree about what dark means. The segmented form offers Light · Auto · Dark, and <strong>Auto is the default</strong> — a two-state toggle silently converts every visitor into someone with an explicit preference, after which their OS switching at sunset does nothing.",
    use: ["The switch in the navbar actions cluster — the default", "The segmented form where Auto matters: settings pages, and the mobile sheet", "The icon square in a bar with nothing left to give — the course bar on a phone"],
    not: ["Deciding the initial theme in the component — assets/js/theme-init.js sets it before first paint, and doing it after hydration IS the white flash everyone complains about", "An unlabelled icon button — aria-label or it is a mystery control", "Animating the whole page on switch: the swap is instant, only the glyph turns"],
    a11y: ["Segmented is a real radiogroup: one tab stop, arrow keys inside, aria-checked on the selected option", "The icon form is role=\"switch\" with aria-checked and an accessible name", "Which glyph shows is decided in CSS from data-theme, so it is correct in the first painted frame with no JavaScript having run", "prefers-reduced-motion drops the crossfade and the thumb slide to instant"],
    variants: [
      { name: "Switch", note: "Live — it drives this page. The default in a bar, and a real switch: one moving part, a knob that slides along a track carrying the <em>current</em> mode's glyph. Both the position and the glyph are read from <code>data-theme</code> in CSS rather than from JavaScript state, so they are right in the first painted frame, before any script runs. The visible track is 1.5rem; the button around it is a full 2.5rem target.", html: `<button type="button" class="ns-themeswitch" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
  <span class="ns-themeswitch__knob" aria-hidden="true"><i class="ph ph-sun"></i><i class="ph ph-moon"></i></span>
</button>` },
      { name: "Segmented", note: "Live — it drives this page. Mono words rather than glyphs: every product draws the \"auto\" icon differently and none of them is read correctly, while a mono label is this system's own material. The thumb is a pseudo-element positioned by :has() reading aria-checked, so there is no state class and no JavaScript in the animation.", html: `<div class="ns-themetoggle" role="radiogroup" aria-label="Colour theme" data-ns-theme>
  <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Light" data-ns-theme-value="light">Light</button>
  <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="true" aria-label="Match the system setting" data-ns-theme-value="system">Auto</button>
  <button type="button" class="ns-themetoggle__opt" role="radio" aria-checked="false" aria-label="Dark" data-ns-theme-value="dark">Dark</button>
</div>` },
      { name: "Icon switch", note: "Live. Both glyphs are always in the DOM, stacked in the same box, so the swap is a crossfade-and-turn in place rather than a substitution that jumps the layout.", html: `<button type="button" class="ns-themetoggle-icon" role="switch" aria-checked="false" aria-label="Dark mode" data-ns-theme-toggle>
  <i class="ph ph-sun" aria-hidden="true"></i>
  <i class="ph ph-moon" aria-hidden="true"></i>
</button>` },
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

  /* ========================================================== Media ==== */
  {
    id: "image", title: "Image", family: "Media",
    summary: "A picture in the card frame: hairline, 6px radius, predictable crops via aspect modifiers. The caption is mono, below the frame — never overlaid on the image.",
    use: ["Screenshots, diagrams, course art in content", "Anything that needs a caption or a fixed aspect"],
    not: ["People — Avatar", "Video posters — Video"],
    a11y: ["alt describes what the image shows; empty alt only if truly decorative", "The caption supplements alt, it does not replace it"],
    variants: [
      { name: "Aspect ratios", html: `<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:var(--gap-grid);inline-size:100%">
  <figure class="ns-figure ns-figure--16x9"><span class="ns-figure__frame"><img src="../assets/img/publication-cover.svg" alt=""></span><figcaption>16 : 9</figcaption></figure>
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><img src="../assets/img/publication-cover.svg" alt=""></span><figcaption>4 : 3</figcaption></figure>
  <figure class="ns-figure ns-figure--square"><span class="ns-figure__frame"><img src="../assets/img/publication-cover.svg" alt=""></span><figcaption>1 : 1</figcaption></figure>
</div>` },
      { name: "With caption", html: `<figure class="ns-figure ns-figure--16x9" style="max-inline-size:24rem">
  <span class="ns-figure__frame"><img src="../assets/img/training-trail.svg" alt="The training trail illustration"></span>
  <figcaption>Fig 01 · The training trail</figcaption>
</figure>` },
      { name: "Plain", note: "No frame — for transparent illustrations that carry their own shape.", html: `<figure class="ns-figure ns-figure--plain" style="max-inline-size:16rem">
  <span class="ns-figure__frame"><img src="../assets/img/training-trail.svg" alt=""></span>
</figure>` },
    ],
  },
  {
    id: "video", title: "Video", family: "Media",
    summary: "The 16:9 frame for an embed or a poster. The play control is the system's one allowed scale-pop; duration sits mono in the corner on a scrim.",
    use: ["Lesson videos, promo embeds", "Poster + play where the player loads on demand"],
    not: ["Ambient autoplay background video — this system does not do that"],
    a11y: ["The play button names its video: aria-label=\"Play: What is an org?\"", "Embedded players keep captions on by default where the platform allows"],
    variants: [
      { name: "Poster + play", html: `<div class="ns-video" style="max-inline-size:26rem">
  <img class="ns-video__poster" src="../assets/img/publication-cover.svg" alt="">
  <button class="ns-video__play" aria-label="Play: What is an org?"><i class="ph ph-play" aria-hidden="true"></i></button>
  <span class="ns-video__dur">08:12</span>
</div>` },
      { name: "Embed frame", note: "Drop any iframe in — the frame owns ratio, border and radius.", html: `<div class="ns-video" style="max-inline-size:26rem">
  <iframe src="about:blank" title="Lesson video"></iframe>
</div>` },
      { name: "YouTube", note: "youtube-nocookie, no autoplay, title on the iframe. In content, pair it with a mono caption via Figure.", html: `<figure class="ns-figure" style="max-inline-size:26rem;inline-size:100%">
  <div class="ns-video">
    <iframe src="https://www.youtube-nocookie.com/embed/VIDEO_ID" title="Apex basics — lesson 01"
            allow="encrypted-media; picture-in-picture" allowfullscreen loading="lazy"></iframe>
  </div>
  <figcaption>Lesson 01 · What is an org? · 08:12</figcaption>
</figure>` },
      { name: "Video modal", note: "A poster on the page; the player loads only inside the dialog when opened — the page never carries a hidden playing embed. Esc and the scrim close it, and closing empties the iframe to stop playback.", script: `document.querySelectorAll('[data-video-modal]').forEach(function (btn) {
  var dlg = document.getElementById(btn.getAttribute('data-video-modal'));
  var frame = dlg.querySelector('iframe');
  btn.addEventListener('click', function () { frame.src = frame.getAttribute('data-src'); dlg.showModal(); });
  dlg.addEventListener('close', function () { frame.src = 'about:blank'; });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) dlg.close(); });
});`, html: `<div class="ns-video" style="max-inline-size:26rem">
  <img class="ns-video__poster" src="../assets/img/publication-cover.svg" alt="">
  <button class="ns-video__play" data-video-modal="vm-demo" aria-label="Play: What is an org?"><i class="ph ph-play" aria-hidden="true"></i></button>
  <span class="ns-video__dur">08:12</span>
</div>
<dialog class="ns-modal" id="vm-demo" aria-label="What is an org? — video" style="max-inline-size:44rem;inline-size:90%">
  <div class="ns-video" style="border:0;border-radius:0">
    <iframe src="about:blank" data-src="https://www.youtube-nocookie.com/embed/VIDEO_ID?autoplay=1" title="What is an org?"
            allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>
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
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><img src="../assets/img/publication-cover.svg" alt=""></span><figcaption>Setup</figcaption></figure>
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><img src="../assets/img/training-trail.svg" alt=""></span><figcaption>Trail</figcaption></figure>
  <figure class="ns-figure ns-figure--4x3"><span class="ns-figure__frame"><img src="../assets/img/publication-cover.svg" alt=""></span><figcaption>Deploy</figcaption></figure>
</div>` },
      { name: "Two-up", note: "Locked pair — before/after, light/dark.", html: `<div class="ns-gallery ns-gallery--two" style="inline-size:100%">
  <figure class="ns-figure ns-figure--16x9"><span class="ns-figure__frame"><img src="../assets/img/publication-cover.svg" alt=""></span><figcaption>Before</figcaption></figure>
  <figure class="ns-figure ns-figure--16x9"><span class="ns-figure__frame"><img src="../assets/img/training-trail.svg" alt=""></span><figcaption>After</figcaption></figure>
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
];
