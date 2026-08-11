SLDS-themed syntax highlighter with a live in-panel light/dark toggle, line numbers, and a copy button — for docs and lesson code blocks.

```jsx
<CodePanel
  filename="CaseTrigger.cls"
  language="apex"
  defaultTheme="dark"
  code={`public class CaseTrigger {\n  // route new cases\n  public static void run(List<Case> cases) {\n    update cases;\n  }\n}`}
/>
```

Tokens colored: keywords, strings, comments, numbers, function calls — the palette is tuned for both the navy (dark) and white (light) backgrounds, which the header toggle flips live. Pass `defaultTheme="light"` to open light, `showLineNumbers={false}` to drop the gutter. For the lighter inline all-blue treatment use `CodeBlock` instead.
