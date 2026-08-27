The one solid-fill action per screen — everything else on the page should be an `outline`/`ghost` button so the single `primary` reads as the one thing to click. Sharp `--radius-btn` corners, instant press (opacity dim, no bounce/lift).

```jsx
<Button variant="primary" icon="ph-arrow-right" iconPosition="right">Start learning</Button>
<Button variant="outline" size="sm">Cancel</Button>
```
`white`/`ghost` are for dark hero surfaces. Never use two `primary` buttons side by side.
