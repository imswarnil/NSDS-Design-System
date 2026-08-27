The system's code block: a title bar with the file name, copy / ask-AI / share / wrap actions, line numbers, diff-marked lines, and a footer whose one job is Run. Three chromes — `block` (default card), `mac` (traffic lights, centred title), `vscode` (tab strip + brand status bar) — differ only in the bar; the body, palette and every interaction are identical.

```jsx
<SyntaxHighlighter
  chrome="mac"
  filename="CaseTrigger.cls"
  language="apex"
  marks={{ add: [4], mark: [7] }}
  actions={{ run: true }}
  onRun={({ code, done }) => execute(code).then((r) => done(r))}
  code={`trigger CaseTrigger on Case (before insert) {\n  CaseHandler.route(Trigger.new);\n}`}
/>
```

Styled entirely by `.ns-*` classes in `components/css/code.css`, so the Ghost theme renders the same markup from Handlebars. Highlighting comes from `components/core/highlight.js`, which maps any grammar onto **seven** roles (comment, string, number, keyword, type, call, punctuation) — adding a language means adding a keyword list, never a colour. The palette lives in `--color-code-*` and flips with the theme.

`Run` never executes anything: it calls `onRun` and waits for `done(result, ok)`. Without a handler the footer button is off. The Ask-AI menu names the assistant before it sends anything.

Supersedes `CodeBlock` and `CodePanel` — both style themselves inline and cannot be rendered by the Ghost theme. Use `.ns-code-inline` for a single term inside a sentence.
