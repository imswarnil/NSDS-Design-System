The blocks a written lesson is made of, besides its prose: what it is for, the one thing to remember, the files, what you just learned, the words it used, and the paid slot. Every one of these was being hand-assembled per lesson out of raw `.ns-*` classes, which is how three lessons end up with three different ideas of what a summary looks like.

None of them owns styling — each renders classes that already exist in `components/css` — so the Ghost lesson template renders the same markup.

**The one rule worth stating:** none of these belongs *inside* `.ns-prose`. Prose styles bare `ul` / `dt` / `dd`, so a checklist nested in it grows square markers and a glossary grows a rule down its left edge. Pass them as `CoursePlayer`'s `appendix`.

```jsx
<CoursePlayer variant="article" …
  appendix={<>
    <LessonAd />
    <LessonSummary items={[
      "What an aggregate query asks the database for.",
      "Where GROUP BY stops scaling, and which field types get you there fastest.",
    ]} />
    <LessonGlossary terms={[
      { term: "Governor limit", definition: "The per-transaction ceiling the platform enforces." },
      { term: "Cardinality", definition: "How many distinct values a field has." },
    ]} />
  </>}
  aside={<SponsorSlot />}          {/* under the outline, sticky with it */}
>
  {prose /* LessonTakeaway is safe in here — it styles nothing prose styles */}
</CoursePlayer>
```

`LessonObjectives` opens a lesson with the same success ticks the course page made its promises in; `LessonSummary` closes it with a checklist, deliberately not the same shape — a tick that means "achieved" should not look like one that means "promised".

`LessonAd` and `SponsorSlot` are the `AdSlot`, named for where they go, so the decision that matters — one per lesson, never above the fold — is countable in a grep rather than a matter of taste.
