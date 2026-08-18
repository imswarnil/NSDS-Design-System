What an answer can carry beyond prose — the reason this is an LMS assistant and not a chat box. Course recommendations delegate to the real `CourseCard`, so a course in chat and the same course in the catalog are one component.

```jsx
<CourseAttachment label="Covers this, in order" courses={[
  { title: "Bulk-safe Apex patterns", excerpt: "Triggers that survive the 200-record data load.", lessons: 9, duration: "2h 10m" },
]} />

<Snippet kicker="// Blog" title="The trigger that survived a 200-record load"
  description="One real bulkification bug, from the debug log to the pattern that fixes it."
  host="namastesalesforce.com" meta="8 min read" image="/assets/img/publication-cover.svg" />

<LearningPath title="Route to Platform Developer I" meta="6 weeks · 5 steps" onSave={save}
  steps={[
    { name: "Apex basics", sub: "Lessons 01–03", done: true },
    { name: "Bulk-safe Apex patterns", sub: "9 lessons", when: "week 2" },
  ]} />

<Sources items={[{ title: "Apex basics · lesson 09" }, { title: "Execution governors and limits", external: true }]} />
<PracticeCheck name="q1" question="How many SOQL queries does the transaction use?" options={["1", "200", "100"]} />
```

Failures render inside the transcript, in the assistant's slot — a toast disappears and the student needs to see which question failed. `variant="limit"` is a quota (waiting or upgrading fixes it, retrying does not); `variant="offline"` is muted, not red, because nothing is wrong with the answer.

```jsx
<AnswerError title="Could not reach the catalog" code="ERR_TOOL_TIMEOUT · 09:19:04"
  text="Nothing you typed was lost.">
  <button className="ns-btn ns-btn--outline ns-btn--sm">Try again</button>
</AnswerError>
```

Generated images take `generated` — an unlabelled generated diagram is one a student will cite in an exam.
