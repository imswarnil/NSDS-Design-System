The course's sections and their lessons — tabular mono index numbers, mono durations, and a left accent bar on hover instead of a background tint. Native `<details>` per section, so open/closed state, keyboard operation and in-page find all come from the platform.

The lesson KIND is an icon, never a word: twenty-four rows that each spell out VIDEO turn a curriculum into a spreadsheet. The word stays in the DOM and returns as a tooltip on hover or focus, which frees the row's second line for what the glyph cannot say — whether the row is open to you, and whether it is a free preview.

```jsx
<CurriculumList
  totals="5 sections · 24 lessons · 6h 20m"
  sections={[{
    title: "Getting oriented",
    duration: "32m",
    lessons: [
      { title: "What is an org?", type: "video", duration: "08:12", href: "/lesson/org", access: "free", badge: "Preview" },
      { title: "Objects & fields", type: "article", duration: "12:40", href: "/lesson/objects", access: "free" },
      { title: "Navigation that sticks", type: "video", access: "members", upgradeHref: "/join" },
    ],
  }]}
/>
```
