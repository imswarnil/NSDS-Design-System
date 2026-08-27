# NSDS in OBS — building the scenes

How to turn the scene systems documented on the site into a working OBS Studio
setup: what to configure once, how to build the shared furniture so you edit it
in one place, the exact pixel geometry at 1920×1080, and a build recipe for
every scene.

The design intent lives on the site and is not repeated here:

- **[Lesson video scenes](https://nsds.imswarnil.com/preview/cc-lesson-scenes.html)** — 17 recording layouts, light and dark
- **[Live stream scenes](https://nsds.imswarnil.com/preview/cc-livestream.html)** — 18 broadcast scenes, the camera crops, the comment rail, the action chips and the notification toasts

This file is the mechanics. When the two disagree, the site wins.

---

## 1. The one decision that makes this manageable

Most OBS setups become unmaintainable at about scene six, for one reason:
the furniture — kicker, index, watermark — is copy-pasted into every scene, so
changing a course name means editing it fifteen times and missing two.

**Do not copy furniture between scenes. Nest it.**

OBS lets a scene be a *source* inside another scene. So you build one scene
called `_furniture`, put the kicker, the lesson index and the watermark in it,
and then add `_furniture` as a source in all seventeen teaching scenes. Edit it
once, every scene updates.

Three mechanisms, and it is worth knowing which does what:

| Mechanism | What it is | Use it for |
| --- | --- | --- |
| **Nested scene** | a whole scene added as one source inside another | the furniture, and any cluster you want to edit in one place |
| **Add Existing** | the *same* source instance appearing in several scenes | the camera, the mic, the display capture |
| **Group** | a folder inside one scene; moving the group moves its contents | tidying a single complex scene; **not** a reuse mechanism — a group copied to another scene is a separate copy |

**Always add your camera with `+` → Video Capture Device → "Add Existing".**
A second *new* capture of the same physical camera will fail to open the device
on most machines, and on the ones where it works you now have two sources
drifting out of alignment. One camera source, referenced everywhere.

The same goes for the display/window capture and the mic.

---

## 2. Two scene collections, not one

`Scene Collection → New`. Make two:

| Collection | For | Carries |
| --- | --- | --- |
| `NSDS Lesson` | recorded course videos | kicker, lesson index, camera, watermark |
| `NSDS Live` | live sessions on YouTube | the above **plus** the live badge, question card, comment rail, action chips, notification toasts, CTA sting, handle bug |

They are separate because the difference is a rule, not a preference: a
recorded lesson must never carry a LIVE badge, a ticker, a comment rail, a
subscribe chip, a notification toast or a countdown. A file has no live moment to acknowledge, and that furniture dates
the video the instant the stream ends. Two collections make the mistake
impossible rather than merely discouraged.

Switch with `Scene Collection` in the menu bar. Hotkeys, sources and layouts
are all remembered per collection.

---

## 3. Settings that must match the canvas contract

`Settings → Video`

| Field | Value |
| --- | --- |
| Base (Canvas) Resolution | `1920x1080` |
| Output (Scaled) Resolution | `1920x1080` |
| Downscale Filter | Lanczos |
| Common FPS Values | `30` |

Never a non-16:9 canvas, and never a base and output that differ — scaling in
OBS costs you exactly the hairline detail this design system is made of. Use 60
fps only if something genuinely moves; a screen share at 30 looks identical and
leaves the bitrate for detail instead of duplicate frames.

`Settings → Output` (Advanced mode)

| Field | Streaming | Recording |
| --- | --- | --- |
| Encoder | hardware (NVENC / Apple VT / AMF) if you have it | same |
| Rate Control | CBR | CQP / CRF |
| Bitrate | `6000` Kbps | — |
| CQP / CRF | — | `18–20` |
| Keyframe Interval | `2` s | `2` s |
| Profile | high | high |
| Recording Format | — | `mkv`, remux to mp4 after |

6000 is the top of YouTube's 1080p30 range and text-heavy screen shares need
it: hairlines and 1px borders are the first thing compression eats. Record to
`mkv` — a crashed `mp4` recording is unrecoverable, a crashed `mkv` is not.

`Settings → Audio`

| Field | Value |
| --- | --- |
| Sample Rate | `48 kHz` |
| Channels | **Mono** |

Mono, because half the audience has one earbud in. On the mic source add
`Filters → Noise Suppression (RNNoise)` → `Compressor` (ratio 4:1) →
`Limiter` (−6 dB), and aim for about −16 LUFS.

`Settings → General → Enable Studio Mode` — preview a scene before it goes
live. On a recording it is the difference between a clean cut and a
four-second fumble you have to edit out.

---

## 4. Geometry at 1920×1080

Every percentage on the site, resolved to pixels. Set these in
`Edit Transform` (`Ctrl/Cmd+E`) rather than dragging — dragging is how a
camera ends up three pixels off in one scene out of seventeen.

| Element | Position (x, y) | Size | Notes |
| --- | --- | --- | --- |
| Canvas | 0, 0 | 1920 × 1080 | |
| Title-safe box | 96, 54 | 1728 × 972 | **all readable text inside this** |
| Action-safe box | 67, 38 | 1786 × 1004 | graphics may touch it |
| Grid unit | — | 160 × 135 | 12 columns × 8 rows |
| Top accent bar | 0, 0 | 1920 × 4 | brand-500 `#0176d3`, full bleed |
| Kicker | 96, 78 | — | Roboto Mono 20px, uppercase, `.1em` tracking |
| Lesson index / live badge | right edge 1824, y 78 | — | Roboto Mono 20px, right-aligned |
| Topic / step bar | 96, 205 | 1728 × 40 | 1px rule under it |
| Camera C1, standard 16:9 | 1440, 748 | **384 × 216** | 20% of width, exactly 16:9 |
| Camera C1, small 16:9 | 1498, 780 | **326 × 184** | 17%, when the corner is tight |
| Camera C4, column 16:9 | 1459, 162 | 384 × 216 | right column / slide layouts |
| Camera C3, two-up 16:9 | 96 / 979 , 300 | 845 × 475 | two equal cams, guest scenes |
| Camera C5, stacked 16:9 | 1459, 173 / 394 | 365 × 205 | guest + screen |
| Camera C6, block 4:3 | 96, 173 | **1070 × 802** | beside a 33% comment rail |
| Camera C7, bust 1:1 | 1524, 654 | 300 × 300 | narrow gutters |
| Camera C8, rail 9:16 | 1520, 97 | 304 × 540 | standing shot; survives a Shorts crop |
| Name plate | 96, 878 | ~700 × 86 | 8 seconds, then off |
| Chip lane | 96, 806 | — | two chips, one filled, open/break/close only |
| Toast lane | right edge 1824, bottom edge 966 | ~460 × 78 | one at a time, they queue |
| Comment rail, standard | 1373, 238 | **451 × 734** | 23.5%, scenes 13–14 |
| Comment rail, wide | 1190, 173 | **634 × 799** | 33%, scene 12 only |
| Watermark | right edge 1824, bottom edge 1026 | height 38 | 55–65% opacity |
| Question card (live) | 96, 280 | 900 × 200 | |
| Title strip | 0, 1000 | 1920 × 80 | full bleed, dark in **both** themes |

**The screen capture is full-bleed.** A 16:9 source inset on all four sides of
a 16:9 canvas cannot stay 16:9 — so in the scenes where the screen "fills the
stage" it is simply `0, 0, 1920 × 1080`. Right-click the source →
`Transform → Fit to screen` (`Ctrl/Cmd+F`). The diagrams on the site inset it
for legibility; OBS does not.

When the screen genuinely shrinks (the column and rail layouts), scale it
**uniformly** and position it — never stretch it to fill a non-16:9 box:

| Layout | Screen scale | Result | Position |
| --- | --- | --- | --- |
| Screen + camera column | 67% | 1286 × 723 | 77, 179 |
| Screen + step rail | 65% | 1248 × 702 | 77, 189 |
| Code + result split | 48% | 922 × 519 | 77, 281 |
| Screen + comments (13) | 74% | 1421 × 799 | 96, 173 |
| Screen + cam + comments (14) | 67% | 1286 × 723 | 96, 173 |
| Guest + screen (18) | 69% | 1325 × 745 | 96, 173 |
| Screen + title strip (07) | 93% | 1786 × 1004 | 67, 0 |

---

## 5. Build order

Do this once per collection. It takes about twenty minutes and you never do it
again.

**1. Sources you will reuse.** In a throwaway scene, create each of these once
so they exist for `Add Existing` later:

- `CAM` — Video Capture Device, 1920×1080, 30fps. Filters: `Color Correction`
  only. **No chroma key and no virtual background** — they eat fingers when you
  gesture, and gestures are half of teaching.
- `SCREEN` — Display Capture (whole display) or Window Capture (one window).
  Prefer the window: it is also a 16:9 crop you control, and it cannot leak a
  notification or the tab with your credentials in it.
- `MIC` — Audio Input Capture, with the filter chain from §3.

**2. The `_furniture` scene.** New scene, name it `_furniture`. Add:

- Colour Source, 1920×4 at (0,0), `#0176d3` — the top accent bar
- Text (GDI+/FreeType) — the kicker, at (96, 78)
- Text — the lesson index, right edge 1824
- Image Source — the logo watermark, right edge 1824, bottom edge 1026, with
  a `Color Correction` filter at 60% opacity

Or replace all four with a single Browser Source (§7), which is less fiddly and
gets you the real fonts.

**3. The `_backdrop` scene.** New scene. Add a Colour Source filling the canvas
— `#001a3e` for dark, `#ffffff` for light — plus, optionally, a Browser Source
carrying one of the nine hairline patterns at 6–10% opacity. This is what shows
behind a pillarboxed 4:3 source and behind every full-frame card.

**4. Every real scene** is then: `_backdrop` → content → `_furniture`, in that
stacking order (bottom to top in the Sources list is back to front... in OBS,
**the top of the list renders on top**). So `_furniture` sits at the top of the
list, `_backdrop` at the bottom.

**5. Lock everything.** Click the padlock beside each source once positioned.
The single most common OBS accident is nudging the camera 40px mid-recording.

---

## 6. The scene list

Prefix the utility scenes with `_` so they sort to the top and are visibly not
for broadcast.

### `NSDS Lesson` — 17 scenes

| # | Scene name | Sources, top to bottom |
| --- | --- | --- |
| 01 | `01 Screen` | `_furniture` · `SCREEN` (fit) · `_backdrop` |
| 02 | `02 Screen + Cam` | `_furniture` · `CAM` (1440, 748) · `SCREEN` (fit) · `_backdrop` |
| 03 | `03 Screen + Cam column` | `_furniture` · note text · `CAM` (1459, 162) · `SCREEN` (67%, at 77/179) · `_backdrop` |
| 04 | `04 Screen + Steps` | `_furniture` · step Text/Browser source · `SCREEN` (65%, at 77/189) · `_backdrop` |
| 05 | `05 Screen detail` | `_furniture` · locator · `SCREEN` duplicate with `Crop/Pad` filter, scaled 200% · `_backdrop` |
| 06 | `06 Open` | `_furniture` · lower third · title text · `CAM` (fit) · `_backdrop` |
| 07 | `07 Camera` | `_furniture` · `CAM` (fit) · `_backdrop` |
| 08 | `08 Camera + Point` | `_furniture` · point card · `CAM` (96, 130, 845×475) · `_backdrop` |
| 09 | `09 Camera + Slide` | `_furniture` · `CAM` (1459, 280, 384×216) · `SLIDE` (67%) · `_backdrop` |
| 10 | `10 Slide` | `_furniture` · `SLIDE` (fit) · `_backdrop` |
| 11 | `11 Slide + Cam` | `_furniture` · `CAM` (1440, 748) · `SLIDE` (fit) · `_backdrop` |
| 12 | `12 Code` | `_furniture` · title · `CODE` window capture (fit) · `_backdrop` |
| 13 | `13 Code + Result` | `_furniture` · result panel · `CODE` (48%, at 77/281) · `_backdrop` |
| 14 | `14 Title card` | `_furniture` · title Browser Source · `_backdrop` |
| 15 | `15 Chapter card` | `_furniture` · chapter Browser Source · `_backdrop` |
| 16 | `16 Recap card` | `_furniture` · recap Browser Source · `_backdrop` |
| 17 | `17 End card` | `_furniture` · end-card Browser Source · `_backdrop` |

Scene 05 is worth a note: **do the zoom in the editor, not live.** Changing
browser zoom mid-recording reflows the page and the viewer loses their place.
If you must do it in OBS, duplicate `SCREEN` with `Add Existing`, put a
`Crop/Pad` filter on the copy, and scale it — the original stays untouched.

`SLIDE` is a Window Capture of your deck in presenter mode, or a Browser Source
pointed at an HTML deck. `CODE` is a window capture of a prepared snippet at
18–20pt — not your working editor.

### `NSDS Live` — 18 scenes

Grouped by purpose; the grouping is also the build order, because every scene
in a group shares its furniture with the others.

**Open & close** — the four scenes nobody is being taught in, and the only
ones allowed to carry an ask.

| # | Scene name | Sources, top to bottom |
| --- | --- | --- |
| 01 | `01 Starting soon` | `starting-soon.html` (Browser, `?mode=start&at=19:00&chips=subscribe,bell`) · `_backdrop` |
| 02 | `02 Welcome` | `_furniture-live` · `name-plate.html` · agenda Browser Source · `CAM` (1440, 748) · `_backdrop` |
| 03 | `03 Intermission` | `starting-soon.html` (`?mode=break&minutes=5`) · `_backdrop` — **mic muted at the switcher** |
| 04 | `04 Ending` | `_furniture-live` (badge off) · end-card Browser Source · `actions.html` (`?chips=subscribe,newsletter`) · `_backdrop` |

**Teaching** — where the hour actually goes.

| # | Scene name | Sources, top to bottom |
| --- | --- | --- |
| 05 | `05 Camera` | `_furniture-live` · `CAM` (fit) · `_backdrop` |
| 06 | `06 Screen` | LIVE badge · mark · `SCREEN` (fit) · `_backdrop` — no kicker, no cam |
| 07 | `07 Screen + Title` | title strip Browser Source · LIVE badge · `SCREEN` (fit) · `_backdrop` |
| 08 | `08 Screen + Cam` | `_furniture-live` · `CAM` (1440, 748) · `SCREEN` (fit) · `_backdrop` |
| 09 | `09 Slide` | `_furniture-live` · `SLIDE` (fit) · `_backdrop` |
| 10 | `10 Slide + Cam` | `_furniture-live` · topic bar · `CAM` (1459, 291) · `SLIDE` (67%, at 96/291) · `_backdrop` |
| 11 | `11 Code` | title strip · LIVE badge · `CODE` (fit) · `_backdrop` |

**Comments & guests** — the scenes where somebody other than you is on the
frame. Every one of them *narrows* the stage rather than covering it.

| # | Scene name | Sources, top to bottom |
| --- | --- | --- |
| 12 | `12 Cam + Comments` | `_furniture-live` · `comments.html` (wide, 1190/173, 634×799) · `CAM` **4:3** (96, 173, 1070×802) · `_backdrop` |
| 13 | `13 Screen + Comments` | LIVE badge · mark · `comments.html` (1373, 238) · `SCREEN` (74%, at 96/173) · `_backdrop` |
| 14 | `14 Screen + Cam + Comments` | `_furniture-live` · `comments.html` (1373, 238) · `CAM` (1373, 700, 451×254) · `SCREEN` (67%, at 96/173) · `_backdrop` |
| 15 | `15 Comment wall` | `_furniture-live` · wall Browser Source (six curated questions) · `_backdrop` |
| 16 | `16 Q&A` | `_furniture-live` · question card · `CAM` (1180, 280, 634×357) · `_backdrop` |
| 17 | `17 Guest` | `_furniture-live` · two `name-plate.html` · `CAM` (96, 300) · `GUEST` (979, 300) · `_backdrop` |
| 18 | `18 Guest + Screen` | `_furniture-live` · `name-plate.html?variant=driving&hold=0` · `CAM` (1459, 173) · `GUEST` (1459, 394) · `SCREEN` (69%, at 96/173) · `_backdrop` |

`_furniture-live` is `_furniture` plus the LIVE badge and the handle bug —
which is exactly what `export/furniture.html` renders, so build it as one
Browser Source and nest it.

Three things are **not** scenes, because they appear over whatever is already
on screen and then leave. Build them as sources inside `_furniture-live` and
toggle each with a hotkey:

| Source | File | Exit rule |
| --- | --- | --- |
| Name plate | `export/name-plate.html` | 8s host, 10s guest, never for `variant=driving` |
| Action chips / CTA sting | `export/actions.html` | 8s chips, 6s sting, twice an hour maximum |
| Notification toasts | `export/toast.html` | 4–10s each, one lane, they queue |

Give each one an exit rule and honour it. An overlay with no timer becomes
furniture, and furniture is what makes a frame look busy.

**One hotkey you will not regret binding: &ldquo;mute overlays.&rdquo;** Put the
plate, the chips and the toast lane in a single OBS *group* inside
`_furniture-live` and bind the group's visibility. Code focus, Q&A and a
guest's answer all want everything off, and remembering three toggles at 19:40
is not a plan.

### Choosing the theme

Both collections are built once per theme, not switched mid-session. Every
overlay in `export/` takes `?theme=light`, and `_backdrop`'s colour source
goes from `#001a3e` to `#ffffff` — that is the whole change. The geometry is
identical, so a duplicated scene collection with the theme flipped is a
five-minute job and there is never a reason to redesign a scene for light.

The one exception is the **title strip**: it stays dark in both themes,
because it is broadcast furniture rather than part of your desktop.

## 7. Overlays as Browser Sources

The overlays in this system are HTML, and OBS renders HTML. That means the
kicker, the cards and the lower thirds can be the *real* thing — correct fonts,
correct tokens, correct light/dark — rather than an approximation typed into a
Text source.

`+` → Browser → `Local file`, width `1920`, height `1080`, and tick
**Shutdown source when not visible** so a card is not burning CPU in the
background.

**Seven of them are already written.** `brand-content-creation/livestream/export/`
contains `furniture.html`, `starting-soon.html`, `name-plate.html`,
`actions.html`, `toast.html`, `comments.html` and the `overlay.css` they all
share — configured entirely through the query string, so one file serves every
session and you never edit HTML at 19:04:

```
furniture.html?kicker=live%20session%2004&live=1&theme=dark
starting-soon.html?mode=break&minutes=5&title=Back%20in
name-plate.html?name=Priya%20Nair&role=Flow%20Architect%20·%20guest&variant=guest
actions.html?chips=subscribe,bell&hold=8
toast.html?kind=member&who=@meera_dt%20joined%20as%20a%20member
comments.html?rows=4&count=412
```

`?safe=1` on any of them draws the title-safe and action-safe boxes while you
position the source — take it off before you go live. `toast.html` and
`comments.html` also accept `postMessage`, so a moderator page or an
`obs-websocket` script can push to them without a refresh. Read
`export/README.md` for the full parameter list.

If you would rather start from scratch, this is the minimum that works. Save
it as `furniture.html` anywhere on disk and point a Browser Source at it:

```html
<!DOCTYPE html><html><head><meta charset="utf-8">
<link rel="stylesheet" href="https://nsds.imswarnil.com/dist/namaste-ui.tailwind.css">
<style>
  html,body{margin:0;width:1920px;height:1080px;background:transparent;overflow:hidden}
  .bar{position:absolute;inset-inline:0;top:0;height:4px;background:var(--color-brand-500)}
  .kick{position:absolute;left:96px;top:78px;font-family:var(--font-mono);font-size:20px;
        letter-spacing:.1em;text-transform:uppercase;color:var(--color-brand-300)}
  .idx{position:absolute;right:96px;top:78px;font-family:var(--font-mono);font-size:20px;
       letter-spacing:.06em;color:rgb(255 255 255/.6)}
  .mark{position:absolute;right:96px;bottom:54px;display:flex;align-items:center;gap:10px;
        opacity:.6;color:#fff;font-family:var(--font-heading);font-size:22px;font-weight:700}
  .mark img{width:38px;height:38px}
</style></head><body>
  <div class="bar"></div>
  <div class="kick">// apex fundamentals</div>
  <div class="idx">07 / 12</div>
  <div class="mark">
    <img src="https://nsds.imswarnil.com/assets/logo/favicon.svg" alt="">Namaste Salesforce
  </div>
</body></html>
```

Three things make this work:

- **`background: transparent`** on `html, body`. OBS composites the page over
  whatever is beneath it; a white body would hide your screen share.
- **Fixed 1920×1080** with `overflow: hidden`, so the page is the canvas and
  every pixel coordinate in §4 is literal.
- **The real stylesheet**, loaded from the live site, so `--color-brand-500`,
  Switzer and Roboto Mono are the same values the product uses. Download it
  locally if you record somewhere without a connection.

For a light-theme lesson, add `data-theme="light"` to the `<html>` tag and swap
the two hard-coded whites — every token flips underneath you.

To change the course name or lesson number, edit the file and hit **Refresh**
on the Browser Source. To make it changeable without editing HTML, read the
values from the URL: `file:///…/furniture.html?course=APEX&n=07&of=12`, and
parse `location.search` in a `<script>`.

The same file, with different markup, gives you the title card, the chapter
card, the recap and the end card. Take the geometry straight from the specimen
cards in `brand-content-creation/lesson-video/` — they are ordinary HTML and
you can copy out of them.

---

## 8. Transitions and hotkeys

`Scene Transitions` → set the default to **Cut**, duration irrelevant.

The system's only transition is a hard cut or the 320ms brand-bar wipe. No
crossfades, no zooms, no stingers with sound effects. If you want the wipe,
render a 320ms clip of a brand-500 bar sweeping across and add it as a
`Stinger` transition with the transition point at 160ms.

`Settings → Hotkeys`, and bind the scenes you actually switch between mid-flow:

| Key | Scene |
| --- | --- |
| `F1` | Screen |
| `F2` | Screen + Cam |
| `F3` | Camera |
| `F4` | Slide |
| `F5` | Code |
| `F6` | Screen + Comments |
| `F7` | Comment wall |
| `F8` | Q&A |
| `F9` | toggle the CTA sting / chips (live only) |
| `F10` | toggle the name plate |
| `F11` | fire the queued toast |
| `F12` | **mute overlays** — hides the plate, chips and toast group at once |

Bind them to **Preview** in Studio Mode, not Program, and use one key for the
actual cut. You get to line the next scene up while still talking over the
current one.

---

## 9. Before you hit record

- Canvas and output both `1920x1080`; FPS `30`.
- Shared display set to **native 1080p, scaling 100%**. A HiDPI screen at
  default scaling sends a 2× frame OBS downsamples, and every hairline in the
  org UI turns to mush.
- Sharing **one window**, not the desktop.
- Browser at **125–150%**, editor at **18–20pt** — set now, not mid-demo.
- Notifications off (macOS Focus / Windows Focus Assist).
- Camera locked, one corner, one size, for the whole session.
- Kicker and lesson index say the right course and the right number.
- Theme chosen — dark *or* light — and it does not change mid-lesson. Every
  Browser Source carries the same `?theme=`.
- Camera crop chosen — one of the eight — and the same one in every scene.
- `?safe=1` removed from every Browser Source.
- The comment rail has something in it, and a plan for who pushes to it.
- Audio: mic peaking around −12 dB, mono, no other app holding the device.
- Disk space for `1080p30 ≈ 1 GB per 10 minutes`.
- Record a 20-second throwaway and **watch it back** before recording the real
  thing. Half of all wasted takes are a muted mic.

---

## 10. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Camera black in one scene, fine in another | you added a *second* Video Capture Device instead of `Add Existing` | delete it; re-add with `Add Existing` |
| Browser Source shows a white box over the screen | the page has an opaque background | `background: transparent` on `html, body` |
| Browser Source is blank | wrong path, or the page needs a moment | use `Local file`, then `Refresh cache of current page` |
| Overlay fonts are wrong | the stylesheet did not load | check the URL, or download `namaste-ui.tailwind.css` and link it locally |
| Screen share looks soft | base ≠ output, or HiDPI scaling | make both `1920x1080`; set the shared display to native 1080p |
| Screen looks stretched | the source was resized non-uniformly | `Transform → Reset Transform`, then `Fit to screen` |
| A 4:3 source has black bars | nothing is behind it | put `_backdrop` under it — the gap becomes brand navy, not letterbox black |
| Text cut off on a phone | it crossed the title-safe box | move it inside `96, 54 → 1728 × 972` |
| Recording has no audio | desktop audio not captured, or the mic is held by another app | check `Audio Mixer`; quit the other app |
| Everything drifts a few pixels between scenes | sources were dragged, not transformed | `Edit Transform`, set the numbers from §4, then lock |
| Toasts pile up on top of each other | the source was refreshed, or two toast sources exist | one `toast.html` only; untick "Refresh when scene becomes active" — a refresh empties the queue |
| The comment rail overlaps the camera | the rail was placed at the standard 23.5% in scene 12 | scene 12 uses the **wide** rail (33%) and a 4:3 camera; the two are one decision |
| The camera looks a different size scene to scene | more than one crop in use | pick one of the eight in §4 and set every scene's camera to it by number |
| A face is stretched | the camera was scaled non-uniformly into a block it does not match | pick the crop first, then let the block follow it — `Reset Transform`, then set the size from §4 |

---

## 11. Ownership

- Scene geometry and design rules: the two styleguide pages linked at the top.
  Change them there first; this file follows.
- OBS specifics verified against OBS Studio 30.x.
