The AI learning assistant — a teacher-shaped LLM inside the LMS. Rail of conversations grouped by course, a transcript where the student's turn is a narrow sunken card and the assistant's is full-measure prose, and a docked composer. No bubbles, no color washes: the role is a mono label, the same one a lesson index or a ticket id uses.

```jsx
<Assistant rail={<ConversationRail groups={groups} activeId={id} onNew={newChat}
             quota={{ label: "Questions today", used: 12, total: 30, href: "/pro" }} />}
           railOpen={railOpen}>
  <AssistantBar title="Why does my trigger hit governor limits?" meta="Apex basics · lesson 03"
                railOpen={railOpen} onToggleRail={() => setRailOpen(v => !v)} />
  <AssistantThread ref={scroller}>
    <Turn role="user" who="RS" time="09:12"><TurnBody><p>{question}</p></TurnBody></Turn>
    <Turn state="streaming">
      <Thinking label="Searching the catalog" />
      <ToolCall label="Read your progress" state="done" />
      <TurnBody prose><p>{text}<StreamCaret /></p></TurnBody>
    </Turn>
  </AssistantThread>
  <AssistantFoot><Composer value={draft} onChange={setDraft} onSend={send} /></AssistantFoot>
</Assistant>
```

`variant="embedded"` drops the viewport lock for a panel beside a lesson; `variant="docked"` sits under the product navbar. `<Trace steps={[{verb: "Read", text: "your progress"}]} />` discloses how the answer was built — collapsed by default, and a real `<details>`, so it works with no JavaScript.

Name the thinking stage. "Reading your progress" tells a waiting student something; "Thinking…" does not.
