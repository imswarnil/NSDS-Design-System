Scroll-spy table of contents for long docs/blog posts — hairline rail, active heading gets a brand-blue left bar. `level: 3` items indent for sub-headings.

```jsx
<TableOfContents activeId="objects" onNavigate={scrollTo} items={[
  {id:"intro", label:"Introduction"},
  {id:"objects", label:"Objects & Records"},
  {id:"fields", label:"Field types", level:3},
]} />
```
