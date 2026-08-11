The one hero shell used across course/blog/docs/resources/training pages — a hairline-grid dark-navy canvas with 3 layout variants, matching the source theme's own `data-hero` variants.

```jsx
<Hero variant="split" kicker="Apex Masterclass" title="Master server-side Salesforce" subtitle="Apex, SOQL, triggers, async, testing."
  media={<i className="ph ph-code" style={{fontSize:"4rem"}}/>} actions={<Button variant="white">Start</Button>} stats={<CourseStats stats={[...]} />} />
<Hero variant="centered" kicker="Courses" title="Every Salesforce course, in one catalog" />
<Hero variant="compact" title="Documentation" />
```
