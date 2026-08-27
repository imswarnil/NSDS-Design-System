The third-party ad slot — AdSense or any other network. Renders the box, never the ad: it reserves the creative's exact height at every breakpoint so nothing shifts when the fill lands, carries the disclosure label as real DOM text, and holds a skeleton until the network calls back. The product supplies the `<ins>`/iframe as children.

Not the Sponsor card — that one is a native placement we design and control.

```jsx
<AdUnit format="leaderboard" size="728x90" state="loading" />

<AdUnit format="rectangle" state="filled">
  <ins className="adsbygoogle" data-ad-slot="1234567890" />
</AdUnit>

<AdUnit format="article" state="empty" collapse />

<AdAnchor size="320x100" onDismiss={close} />
```

Formats: `leaderboard` `billboard` `rectangle` `rectangle-lg` `square` `halfpage` `skyscraper` `skyscraper-sm` `banner` `banner-lg` `fluid` `article` `feed` `multiplex` `parallax` `anchor`. States: `loading` `filled` `empty` `blocked`.
