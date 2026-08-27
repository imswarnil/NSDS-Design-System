The lesson kind and the lesson's access, as one part rather than three copies — used by the curriculum on the course page, the rail in the player, and the popover on a phone.

The kind is an icon; the word is deferred, not deleted. It stays in the DOM for assistive tech and comes back as a tooltip on hover or keyboard focus. Pass `withLabel` for the one case that wants the word inline: a single lesson on a card, where there is no column of repeats to compress.

Access is a separate chip and never replaces the kind — "what is it" and "can I open it" are different questions.

```jsx
<LessonType kind="lab" />                        {/* icon + tooltip */}
<LessonType kind="video" withLabel />            {/* icon + the word inline */}

<LessonAccess access="free" />                   {/* Free */}
<LessonAccess access="soon" label="Sept 12" />   {/* the date beats "Soon" */}
```
