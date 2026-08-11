A terminal-style lesson rail — tabular mono index numbers, mono duration/status readouts, and a left accent bar on hover instead of a background tint. 4 layout variants matching the theme's `data-style` (`list` default, `cards`, `detailed`, `timeline`).

```jsx
<CurriculumList variant="timeline" items={[
  { title: "What is Salesforce?", type: "video", duration: "8 min", done: true },
  { title: "Editions & Orgs", type: "article", duration: "10 min", preview: true },
  { title: "Quiz: Foundations", type: "quiz", locked: true },
]} />
```
