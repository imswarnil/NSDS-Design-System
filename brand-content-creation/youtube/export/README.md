# YouTube export artboards

Each `.html` here is a 1:1-pixel artboard for one channel asset, styled with
the system's own tokens, fonts and Phosphor subset. The finished PNGs live in
`assets/social/youtube/` (so the styleguide can show them) — **edit the
artboard, re-render, never touch the PNGs.**

Render all four from the repo root:

```bash
C="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
OUT=assets/social/youtube SRC=brand-content-creation/youtube/export

"$C" --headless=new --force-device-scale-factor=1 --hide-scrollbars --disable-gpu \
     --screenshot=$OUT/banner-dark.png  --window-size=2560,1440 "file://$PWD/$SRC/banner-dark.html"
"$C" --headless=new --force-device-scale-factor=1 --hide-scrollbars --disable-gpu \
     --screenshot=$OUT/banner-light.png --window-size=2560,1440 "file://$PWD/$SRC/banner-light.html"
"$C" --headless=new --force-device-scale-factor=1 --hide-scrollbars --disable-gpu \
     --default-background-color=00000000 \
     --screenshot=$OUT/avatar.png    --window-size=800,800 "file://$PWD/$SRC/avatar.html"
"$C" --headless=new --force-device-scale-factor=1 --hide-scrollbars --disable-gpu \
     --default-background-color=00000000 \
     --screenshot=$OUT/watermark.png --window-size=150,150 "file://$PWD/$SRC/watermark.html"
```

Upload map (YouTube Studio → Customisation → Branding):

| File | Slot | Limit |
| --- | --- | --- |
| `banner-dark.png` or `banner-light.png` | Banner image | 6 MB, min 2048×1152 |
| `avatar.png` | Picture | 4 MB |
| `watermark.png` | Video watermark | 1 MB — set display time to **Entire video** |

Rules the artboards encode (full rationale on the styleguide's
*YouTube banner & logo* page):

- Everything readable sits in the centred **1546×423** safe box; the wings are
  texture only. The registration ticks mark the box; there is deliberately no
  bottom-left tick because the avatar overlaps that corner on mobile.
- `banner-light.html` is **generated from** `banner-dark.html` by palette
  substitution (see the git history for the mapping) — if you redesign the
  dark one, re-derive the light one rather than editing it by hand, so the two
  never drift in geometry.
- Only glyphs present in `icons/phosphor.css` may be used; a glyph outside the
  subset renders as empty space when the card is rebuilt.
