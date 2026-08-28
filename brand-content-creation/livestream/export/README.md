# Live overlay sources

Seven files that OBS can point a **Browser Source** at directly. They are the
same components the styleguide documents — not approximations typed into a
Text source — because they load the system's real stylesheet, so
`--color-brand-500`, Figtree and the light/dark token flip are
all the values the product uses.

`overlay.css` is the reusable layer; every file below is a thin page over it.
Design rationale lives on the styleguide's **Live stream scenes** page and the
mechanics live in `OBS.md` — when they disagree, the styleguide wins.

## The files

| File | What it is | Typical Browser Source |
| --- | --- | --- |
| `furniture.html` | accent bar, kicker, LIVE badge, rotating handle bug, watermark | nested in **every** live scene |
| `starting-soon.html` | full-frame countdown scene — also the intermission | scenes 01 and 03 |
| `name-plate.html` | icon + name + job title, six variants | toggled by hotkey |
| `actions.html` | subscribe / like / bell / newsletter / visit chips, and the CTA sting | toggled by hotkey |
| `toast.html` | the notification lane — subscriber, member, tip, milestone, link, notice | always loaded, hidden until fired |
| `comments.html` | the live comment rail | scenes 12–14 |
| `comments.js` | what the rail reads when nothing is pushing to it | edit it, then Refresh the source |

## Adding one in OBS

`+` → **Browser** → **Local file**, width `1920`, height `1080`. Tick
**Shutdown source when not visible** so a hidden card is not burning CPU, and
leave **Refresh browser when scene becomes active** *off* for `toast.html`
(a refresh empties its queue).

All three of these matter and all three are easy to miss:

- **`background: transparent`** is already set on `html, body` in
  `overlay.css`. If you fork a file, keep it — an opaque body hides the
  camera and the screen capture underneath, which is the number one reason a
  browser source "shows a white box".
- **Fixed 1920×1080 with `overflow: hidden`**, so the page *is* the canvas and
  every pixel coordinate in `OBS.md` §4 is literal. Do not resize the source;
  set the width and height on the source itself.
- **The stylesheet path is relative** (`../../../dist/nsds.tailwind.css`).
  Keep these files where they are, or switch the link to
  `https://nsds.imswarnil.com/dist/nsds.tailwind.css` — and download it
  locally if you record somewhere without a connection.

## Parameters

Everything is configured through the query string, so one file serves every
session and you never edit HTML at 19:04.

```
furniture.html?kicker=live%20session%2004&live=1&theme=dark
              &handles=namastesalesforce.com|@namastesalesforce|/in/imswarnil&every=600

starting-soon.html?title=Flows%20that%20don't<br>break%20in%20bulk&mode=start&at=19:00
                  &chips=subscribe,bell&theme=dark
starting-soon.html?mode=break&minutes=5&title=Back%20in&note=next:%20bulkification

name-plate.html?name=Priya%20Nair&role=Flow%20Architect%20·%20guest&variant=guest
               &handle=@priya_dev&hold=10
                # variant: host | guest | speaking | driving | credential
                # hold=0 keeps it up — correct for `driving`, wrong for the rest

actions.html?chips=subscribe,bell&hold=8
actions.html?sting=Full%20course%20%2B%20notes&where=namastesalesforce.com/apex&hold=6

toast.html?kind=member&who=@meera_dt%20joined%20as%20a%20member&msg=month%201
                # kind: subscriber | member | tip | milestone | link | notice
toast.html?demo=1                 # rehearsal: cycles all six

comments.html?rows=4&count=412
```

`?theme=light` on any of them flips the whole overlay; `?safe=1` draws the
title-safe and action-safe boxes while you position the source. **Take
`safe` off before you go live.**

## Driving them from a script

`toast.html` and `comments.html` accept `postMessage`, so a moderator page,
a Stream Deck plugin or an `obs-websocket` script can push to them without a
refresh:

```js
frame.postMessage({ nsdsToast:   { kind: "tip", who: "@rk_dev sent ₹500",
                                   msg: "“this saved my sprint”" } }, "*");
frame.postMessage({ nsdsComment: { who: "@priya_dev",
                                   text: "scheduled Flows too?", promoted: true } }, "*");
```

Toasts queue rather than stack — push six and they play in order, one lane,
one at a time.

## Rules these files encode

- **One ask on screen at a time.** `actions.html` silently caps the chip lane
  at two and refuses a second filled chip, because that is the rule and a
  rule you can break with a typo is not one.
- **Every overlay has an exit rule**, and the defaults are the documented
  ones: 8s host plate, 10s guest, 4s subscriber toast, 10s link, and no timer
  at all on a technical notice.
- **Only glyphs present in `icons/phosphor.css`** may be used. A glyph outside
  the subset renders as empty space — nothing warns you, on air or otherwise.
