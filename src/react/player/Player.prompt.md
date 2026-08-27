The screen a learner lives in: stage, lesson header, the lesson's detail tabs, a docked prev/next carrying the position, and a fixed curriculum rail ending in the course's standing action. One viewport, one scrollbar — only the content column moves. The React half of `templates/course-player.html`; change one and change the other.

The media element is yours. Pass `stageWired` when what you hand over is a full player with its own control bar, so the 16:9 box moves down to it.

```jsx
<CoursePlayer
  stage={<div className="ns-vplayer" data-ns-video data-youtube="ID" data-chapters="#chapters">…</div>}
  stageWired
  kind="video"
  kicker="lesson 07 of 12"
  title="SOQL joins: relationships in queries"
  meta={["21:15", "5 chapters", "Intermediate"]}
  nav={{ prevHref: "/l6", prevTitle: "SELECT and WHERE",
         nextHref: "/l8", nextTitle: "Aggregate queries",
         index: 7, total: 12, upHref: "#curriculum" }}
  details={<Tabs tabs={[{ value: "chapters", label: "Chapters", content: <Chapters /> }]} value={tab} onChange={setTab} />}
  rail={<LessonRail
    courseTitle="Apex fundamentals" done={6} total={12}
    lessons={lessons} currentHref="/l7"
    cta={{ note: "Your progress 6 / 12", progress: { value: 6, max: 12 },
           label: "Resume lesson 07", href: "/l7", foot: "Certificate at 100%" }} />}
/>

{/* The phone counterpart of the rail — declarative popover, no open state. */}
<LessonPanelBar courseTitle="Apex fundamentals" kicker="Lesson 07 of 12"
  title="SOQL joins" percent={50} done={6} total={12}
  lessons={lessons} currentHref="/l7" cta={{ label: "Resume", href: "/l7" }} />
```

A written lesson is the same player with `variant="article"`: no stage, prose at the reading measure, and the lesson's outline in the space beside it.

```jsx
<CoursePlayer variant="article" kind="article" title="Aggregate queries"
  readingProgressTarget="#lesson-body"
  tocItems={[{ id: "agg-what", label: "What it is" }, { id: "agg-limits", label: "Where it stops" }]}
  activeTocId={activeId} nav={nav} rail={rail}>
  {prose}
</CoursePlayer>
```
