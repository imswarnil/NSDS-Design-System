# doc.md — what I need from you, and what to do next

Short version: the design system itself builds, checks and previews clean.
The things you hit are either fixed below, or they live in a repo that is
not attached here. This file is the numbered list of what to do, in order.

## Fixed just now — action needed on your side

**01 · "Skip to content" always visible on your home page.**
The system's skip link needed two classes (`ns-skip-link ns-visually-hidden`)
to hide itself; markup using only `ns-skip-link` showed a permanent blue
pill. The hiding is now baked into `.ns-skip-link` alone.
→ **You:** pull the new `dist/namaste-ui.css` (or rebuild with
`npm run build`) into whatever site shows the bug. No markup change needed —
but if your theme uses its own skip-link markup, switch it to
`templates/skip-link.html`.

**02 · "Can't test course building."**
The admin demos are now interactive — no app, no backend, no login:
run `npm run dev`, open **50 · Admin shell → Create a course / Lesson
editor** (or directly `preview/demo-admin-course-new.html`). You can add,
rename, reorder (grip + arrow keys) and remove sections and lessons, add
and remove tags, upload files (they become file rows and "process"), format
text in the lesson editor, and flip Draft ↔ Published with a live save
timestamp. This is demo wiring over the real markup; in product the same
behaviour comes from the React components in `components/admin/`.

## Payload CMS — read this before debugging login

**03 · Understand the boundary.** This repo is the design system only:
tokens, CSS, React renderers, templates, styleguide. There is **no server,
no auth, no Payload here** — so "can't log in as payloadcms" cannot be
caused or fixed in this repo. Payload runs inside your **Next.js LMS repo**,
which is not attached.

**04 · Debug Payload login in the LMS repo.** The usual causes, in order:
- No admin user yet → visiting `/admin` should offer "create first user";
  if not, check the `users` collection has `auth: true`.
- `PAYLOAD_SECRET` or `DATABASE_URI` missing/changed in `.env` — a changed
  secret invalidates every existing session and password.
- Wrong URL — Payload's admin is served by *your* Next app at `/admin`
  (`npm run dev` in that repo), not by anything in this design system.
- If you want me to actually fix it: **attach the LMS repo** (or at least
  `payload.config.ts`, the `users` collection, and `.env` variable *names*,
  never values).

**05 · Wire this design system into Payload's shape.** When you build the
course editor in the LMS, map Payload collections to the builder components
1:1 so the admin UI here is the admin UI there:

| Payload collection | Design system surface |
|---|---|
| `courses` (title, slug, summary, level, thumbnail, tags) | `EditorLayout` + `TitleBox` + `SlugField` + rail `RailBox`es |
| `courses.sections[]` (array field: title) | `CurriculumBuilder` sections |
| `lessons` (title, type, duration, video, body, attachments, free) | Lesson editor: `TitleBox`, `RichText`, `Dropzone`/`FileRow` |
| `media` (Payload uploads) | `Dropzone` → file rows |
| draft/publish (Payload versions + drafts) | `PublishBar` states |

Two integration routes — pick one:
- **Custom admin screens** in your Next app (recommended): pages under your
  own `/studio` route using `components/admin/*` + Payload's REST
  (`/api/courses`) — full brand control, this system end to end.
- **Payload's built-in admin panel** restyled: import
  `dist/namaste-ui.css` + `tokens/tailwind.css` into Payload's custom CSS
  and override its components selectively. Less work, less control.

## Standing requests (unchanged, still open)

**06 · Attach the Ghost theme's `partials/` and top-level `.hbs` files** —
page structure here is reconstructed from CSS + dummy content; with the
real templates I can correct it exactly.

**07 · Attach the real logo/wordmark** if one exists beyond
`assets/logo/favicon.svg`.

**08 · Regenerate the Phosphor subset upstream** (`scripts/subset-icons.py`
in the theme repo) adding the ~28 glyphs listed in
`assets/css/icons-gap.css`, then delete the matching blocks there. Until
then the gap-fill renders them pixel-identically, so this is cleanup, not
urgency.

**09 · Turn on GitHub Pages** (repo → Settings → Pages → Source: "GitHub
Actions") so every push to `main` publishes the styleguide — then you can
test from a phone or share a link instead of running `npm run dev`.

## Daily commands

```bash
npm run dev     # build + serve + watch → http://127.0.0.1:4322/preview/index.html
npm run build   # regenerate tokens, dist/, preview/
npm run check   # the five CI checks
```
