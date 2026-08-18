The assistant's input: one hairline box that grows with the textarea, with the context pill, attachments, mode picker and send in a bar beneath it. Enter sends, Shift+Enter breaks the line — and the hint says so, because the wrong guess posts half a question to a class.

```jsx
<Composer
  value={draft} onChange={setDraft} onSend={send}
  context={[{ id: "l3", label: "Apex basics · lesson 03", icon: "book-open-text" }]}
  files={[{ id: "f1", name: "AccountTrigger.cls", size: "4 KB" }]}
  onRemoveContext={dropContext} onRemoveFile={dropFile}
  mode={{ label: "Tutor", icon: "graduation-cap" }} onModeClick={openModes}
  onAttach={pickFile} max={4000} />
```

The context pill is the point: "explain this bit" only means the paragraph in front of the student if the lesson is genuinely in scope, so what the assistant can see is stated on the control and removable — never inferred silently.

`<Welcome>` is the empty state, and its starters FILL the composer rather than sending: the student almost always edits a word first.

```jsx
<Welcome lede="Ask about a lesson, paste code that will not deploy, or get a route to your next certification."
  starters={[{ kicker: "Review", icon: "code", text: "Here is my trigger — why does it fail on a 200-record load?" }]}
  onPick={setDraft} />
```
