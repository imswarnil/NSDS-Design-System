A presentation built from the product's own parts. Six geometries (`lead`, `center`, `stack`, `split`, `aside`, `full`) and four tones (default, `sunken`, `dark`, `brand`); everything inside a slide is a component that already exists — `.ns-code`, `.ns-compare`, `.ns-statblock`, `.ns-checklist`, `.ns-timeline`, `.ns-card`, `.ns-quote`, `.ns-takeaway`. Light by default because a projector in a lit room is a light surface; the deck flips with the rest of the system under `[data-theme="dark"]`. The React half of `templates/deck.html`; change one and change the other.

With no JS it is a scrolling stack of readable 16:9 cards — the handout. That is the intended failure mode, and the reason nothing on a slide is drawn by script.

```jsx
<Deck title="Apex fundamentals · module 01">
  <Slide layout="lead" tone="dark" grid rule
    kicker="Apex fundamentals · module 01"
    title="Write your first trigger, and know why it is a trigger"
    lede="Ninety minutes, one org, one working automation you keep."
    where="Swarnil Singhai · Namaste Salesforce" label="Cover"
    note="Don't read the title. Ask who has written Apex before." />

  {/* The workhorse: points revealed one press at a time, so the room hears
      the one you are on instead of reading the one you are not. */}
  <Slide title="Three things that follow" kicker="Consequences" rule fragments={3}
         where="Module 01" note="Point 03 is the one they will argue with — let them.">
    <SlidePoints items={[
      { at: 1, title: "Never query inside a loop", note: "200 records × one SOQL each is 200 queries against a limit of 100." },
      { at: 2, title: "Trigger.new is a list, always", note: "Even when a user saved one record." },
      { at: 3, title: "One trigger per object", note: "Two run in an order the platform does not promise." },
    ]} />
  </Slide>

  {/* Explain and show, side by side — the shape most technical teaching wants
      and the one most decks skip, putting the code where nobody can see what
      it was meant to demonstrate. */}
  <Slide layout="split" className="ns-slide--split-figure" title="Collect the ids, query once, map, then act">
    <SlideColumn><SlidePoints tight items={["Walk the batch", "One SOQL, outside the loop", "Index it into a Map"]} /></SlideColumn>
    <SlideColumn fill><CodeBlock file="CaseRouter.cls" lang="apex">{src}</CodeBlock></SlideColumn>
  </Slide>
</Deck>
```

The architecture slide is boxes and arrows as text, never a PNG — it restyles with the theme and a screen reader can read it. The hands-on slide carries a countdown the room can see; the check slide labels its options so a room answering out loud has a handle.

```jsx
<Slide title="The order of execution, abridged" rule where="Module 02">
  <SlideFlow nodes={[
    { label: "01 · load", title: "Record loaded" },
    { label: "02 · before", title: "Before triggers", note: "You are here.", current: true },
    { label: "03 · rules", title: "Validation rules" },
    { label: "04 · after", title: "After triggers", note: "The record has an Id." },
  ]} />
</Slide>

<Slide layout="split" badge="Hands on" badgeIcon="ph-barbell" title="Build the router in your own org">
  <SlideColumn><SlidePoints tight ordered items={steps} /></SlideColumn>
  <SlideColumn><SlideTimer seconds={1500} /></SlideColumn>
</Slide>

<Slide title="A user imports 500 cases. How many times does your trigger run?" badge="Quick check" badgeIcon="ph-question">
  <SlideOptions reveal={voted}
    options={["Once — one import, one transaction", { text: "Three times — 200, 200, 100", correct: true }, "500 times — once per record"]}
    answer={<p><b>B.</b> A bulk load is chunked into batches of 200, each its own transaction with its own limits.</p>} />
</Slide>
```

The same deck embedded in a lesson is `mode="scroll"` with `bar={false}`: every slide stacked as a card, nothing hidden, no chrome — the written record of the session beside the video of it.
