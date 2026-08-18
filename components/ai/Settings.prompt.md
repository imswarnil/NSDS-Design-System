The assistant's preferences, as rows rather than cards — a settings screen is a list of decisions, and a card grid turns it into a shopping page. Four groups, in the order a student cares about: how it teaches, what it may read, what it remembers, and how to get rid of it.

```jsx
<SettingsGroup legend="How it teaches">
  <SettingsRow name="Default mode"
    description="Tutor explains and shows an example. Coach answers with a question first. Reviewer marks the code you paste.">
    <ModeChoice value={mode} onChange={setMode} />
  </SettingsRow>
  <SettingsRow name="Always show sources"
    description="Every answer cites the lesson it came from. An uncited answer is one you cannot check.">
    <SettingSwitch checked={cite} onChange={setCite} />
  </SettingsRow>
</SettingsGroup>

<SettingsGroup legend="Your data">
  <SettingsRow danger name="Forget what it remembers"
    description="Clears the facts it holds about your goals. History and saved paths are kept.">
    <button className="ns-btn ns-btn--danger ns-btn--sm">Forget memory</button>
  </SettingsRow>
</SettingsGroup>
```

If memory is on, print the facts it holds in the row's description. A memory the student cannot read is one they cannot correct.
