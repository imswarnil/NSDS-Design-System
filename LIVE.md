# NS Design System — live site

Everything about where this design system is published, what is on it, how it
gets there, and how to fix it when it breaks.

---

## 1. The URLs

| What | URL |
| --- | --- |
| **Live styleguide** | **<https://dev.imswarnil.com/NS-Design-System/>** |
| Styleguide home (canonical) | <https://dev.imswarnil.com/NS-Design-System/preview/index.html> |
| GitHub Pages fallback host | <https://imswarnil.github.io/NS-Design-System/> |
| Repository | <https://github.com/imswarnil/NS-Design-System> |
| Issues | <https://github.com/imswarnil/NS-Design-System/issues> |
| CI / deploy runs | <https://github.com/imswarnil/NS-Design-System/actions> |
| Clone (HTTPS) | `git clone https://github.com/imswarnil/NS-Design-System.git` |
| Clone (SSH) | `git clone git@github.com:imswarnil/NS-Design-System.git` |

**Why `dev.imswarnil.com` and not `imswarnil.github.io`?** The GitHub account
`imswarnil` has an *account-level* custom domain (`dev.imswarnil.com`) with a
GitHub-managed TLS certificate. An account-level domain applies to **every**
Pages site on the account, so this repo is served under it at the repo path
`/NS-Design-System/`. Requests to `imswarnil.github.io/NS-Design-System/`
redirect to the custom domain. HTTPS is enforced — plain `http://` 301s to
`https://`.

**Everything is served under a subpath** (`/NS-Design-System/`), so every asset
reference in the built site is *relative*. Never introduce a root-absolute
`/assets/...` path in a card, the preview generator, or a CSS `url()` — it
would resolve against the domain root and 404. `scripts/build-site.mjs` copies
files at their repo-relative paths precisely so relative links keep working.

Deep links are shareable: the styleguide is multi-page (one URL per foundation
section and per specimen group), e.g.
`https://dev.imswarnil.com/NS-Design-System/preview/color.html`.

---

## 2. What is on the live site

`gulp site` stages a fully self-contained static bundle (~4 MB — 98 styleguide
pages, 38 specimen cards, the CSS closure and self-hosted fonts) into `_site/`.
It is **not** the repo — `node_modules/`, `docs/`, `scripts/`, and the git
history are all excluded. What ships:

| Path on the live site | Contents |
| --- | --- |
| `/` | `index.html` — a meta-refresh redirect into `preview/index.html` |
| `/preview/` | the generated multi-page styleguide (home, one page per foundation, one per specimen group) |
| `/dist/` | the flat CSS bundle `namaste-ui.css` + `.min.css` the preview links |
| `/styles.css` | the entry stylesheet the specimen cards link as `../styles.css` |
| `/tokens/` | authored token CSS + generated `tokens.json` / `tokens.js` / `tailwind.css` |
| `/components/css/` | the portable `.ns-*` component layer both products render |
| `/fonts/` | Switzer + Roboto Mono — latin-subset variable woff2s + both licences |
| `/assets/` | icon fonts, logo, images, `theme-init` |
| `/icons/`, `/patterns/`, `/templates/` | specimen source directories |
| `/**/*.card.html` | every specimen, at its real repo-relative path (the preview iframes them) |
| `/.nojekyll` | tells Pages to serve `_`-prefixed paths verbatim, no Jekyll pass |

The styleguide is generated **from the real artifacts**, so the live site
cannot drift from the system: token tables are read out of
`tokens/tokens.json`, the class index is scraped from `components/css/*.css`,
and each specimen is the actual `.card.html` file in an iframe. The light/dark
switch flips the page and its iframed specimens together, and the choice
persists across pages.

---

## 3. How it gets there

`.github/workflows/ci.yml`, two jobs, in order:

```
push / PR ──▶ check ──▶ (main only) deploy ──▶ GitHub Pages
```

**`check`** — every push and every pull request:

1. `npm ci`
2. `npx gulp build` — regenerate token exports and the CSS bundle
3. `npx gulp check` — the five gates: token-export drift, principle violations
   (raw hex in the component layer), component parsing/self-styling,
   chart-palette colorblind checks, stale `dist/`
4. `git diff --exit-code --stat` — proves no generated file was hand-edited and
   nothing was left uncommitted after a regeneration

**`deploy`** — only on pushes to `main`, and only if `check` passed:

1. `npx gulp site` — build + preview + stage `_site/`
2. `actions/upload-pages-artifact@v3` with `path: _site`
3. `actions/deploy-pages@v4`

A failing check blocks the deploy, so the live site is always a build that
passed every gate.

**Timing.** Roughly 1–2 minutes end to end. GitHub's CDN can take another
minute to purge, so hard-reload (⌘⇧R) before concluding a change didn't ship.

**Publish source.** Repo → Settings → Pages → Source is **"GitHub Actions"**
(not "Deploy from a branch"). There is no `gh-pages` branch and none should be
created — `_site/` is git-ignored and exists only inside the CI runner.

---

## 4. Deploying

### The normal path

```bash
git add -A && git commit -m "…" && git push origin main
```

That is the whole deploy. Nothing else is needed.

### Verify before you push

CI will reject anything the local checks reject, so run them first:

```bash
npm run build     # regenerate token exports + dist/
npm run check     # the five gates CI runs
git status        # must be clean — a dirty tree here fails CI's diff gate
```

### Preview the exact bytes that will be published

```bash
npm run site      # stage _site/ locally (gulp build → preview → site)
npx serve _site   # or: python3 -m http.server -d _site 8080
```

Note the local server serves `_site/` at the **root**, whereas production
serves it at `/NS-Design-System/`. Relative links behave the same in both, which
is why the site must stay relative-only.

### Watch a deploy

```bash
gh run watch                                    # follow the latest run
gh run list --workflow=ci.yml --limit 5         # recent runs
gh api repos/imswarnil/NS-Design-System/pages --jq '.status, .html_url'
```

### Re-deploy without a code change

```bash
gh workflow run ci.yml --ref main   # (requires a workflow_dispatch trigger)
git commit --allow-empty -m "redeploy" && git push
```

---

## 5. Local development

```bash
npm install
npm run dev        # gulp: build → serve → watch → live reload
```

Opens `http://127.0.0.1:4322/preview/index.html`. The dev server serves the
**repository root**, not a copied build folder, so what you see is what ships.
Save any token, component CSS, specimen card or script and within ~400ms the
tokens, bundle and preview regenerate and every open tab reloads (SSE, no
dependency). A broken save prints the error and keeps watching.

| Command | Does |
| --- | --- |
| `npm run dev` / `gulp` | dev loop: build, serve, watch, live reload |
| `npm run build` / `gulp build` | tokens → CSS bundle → preview page |
| `npm run check` / `gulp check` | the five CI checks |
| `npm run site` / `gulp site` | stage the deployable styleguide into `_site/` |
| `npm run serve` / `gulp serve` | serve an existing build, no watching |

Every gulp task is a thin wrapper over `scripts/*.mjs`, so `node scripts/…`
works with no gulp at all.

`preview/` and `_site/` are git-ignored — both are views of the system, not
part of it, and both are one command away. `dist/` **is** committed on purpose:
the Ghost theme's gulp pipeline consumes the flat bundle directly, and
`npm run check:css` proves it matches source.

---

## 6. Consuming the published system

The live site is documentation. Products consume the package, not the site.

```bash
npm i github:imswarnil/NS-Design-System
```

```js
import tokens from "@namaste-salesforce/design-system";           // tokens.js
import "@namaste-salesforce/design-system/styles.css";            // full layer
import "@namaste-salesforce/design-system/dist/namaste-ui.min.css"; // flat bundle
import "@namaste-salesforce/design-system/tokens/tailwind.css";   // Tailwind v4 @theme
```

The three things that must match across both consumers — the 4px spacing base,
the `data-theme` attribute, and the `ns-theme` storage key — are documented and
enforced in **`docs/INTEGRATION.md`**. Read that before wiring up the Ghost
theme or the Next.js LMS.

---

## 7. Troubleshooting

| Symptom | Cause | Fix |
| --- | --- | --- |
| Site 404s entirely | Pages source not set to "GitHub Actions", or no successful `deploy` run yet | Settings → Pages → Source: GitHub Actions; then push to `main` |
| Page loads, all CSS missing | a root-absolute `/…` path crept in — it resolves against the domain root, not `/NS-Design-System/` | make the reference relative; re-run `npm run site` and check locally |
| Icons render as empty boxes | `dist/` font `url()` paths weren't rebased for the bundle's location | check the woff2 paths inside `dist/namaste-ui.css` and rebuild |
| Specimen iframes are blank | the `.card.html` wasn't copied — `build-site.mjs` only walks `*.card.html` and skips dot-dirs, `node_modules`, `dist`, `preview`, `_site` | confirm the filename ends in `.card.html` and sits outside those dirs |
| `check` fails on `git diff --exit-code` | a generated file was hand-edited, or a regeneration wasn't committed | `npm run build && git add -A && git commit` |
| Deploy skipped | the job only runs on `push` to `main`; PR events never deploy | merge to `main` |
| Old content after a green deploy | CDN cache | hard-reload (⌘⇧R), or check the run actually finished |
| Custom domain shows a cert warning | account-level domain cert lapsed | Account → Settings → Pages → verify domain; cert re-issues automatically |

---

## 8. Ownership

- **Maintainer:** Swarnil Singhai — <swarnilsinghaicse@gmail.com> — <https://github.com/imswarnil>
- **License:** MIT (see `LICENSE`)
- **Package:** `@namaste-salesforce/design-system`
- **History:** the repo was renamed from `imswarnil/design-system` to
  `imswarnil/NS-Design-System`. GitHub permanently redirects the old repo URL
  and old git remotes, but update any hardcoded links you own:
  `git remote set-url origin https://github.com/imswarnil/NS-Design-System.git`
