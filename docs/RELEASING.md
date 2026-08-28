# Releasing to npm

The package is `nsds-design-system`. Everything below is verified working
except the last step, which needs credentials only you have.

## One-time account setup

**npm will refuse to publish until 2FA is enabled.** This is the thing that
wastes an afternoon if you have forgotten it: with 2FA off there is no
authenticator app, so no `--otp` value exists and every code you try fails
with a 403 that *sounds* like it is about the code being wrong.

Check first:

```bash
npm profile get          # look for: two-factor auth
```

- `disabled` → you cannot publish. Enable it at
  <https://www.npmjs.com/settings/imswarnil/profile> → Two-Factor
  Authentication → **Authorization and writes**. Save the recovery codes.
- `auth-and-writes` → ready.

The alternative — a granular access token with "bypass 2FA" — works today but
npm has announced it is being restricted for direct publishing, so 2FA is the
one that will still be here next year.

## Releasing

```bash
cd "/Users/swarnil/Namaste Salesforce/NS-Design-System"

npm whoami                       # expect: imswarnil
npm run check                    # the ten gates
npm publish --dry-run            # read the WARNINGS, not just the file list

npm version <patch|minor|major>  # or edit the version by hand
npm publish --otp=<6 digits>
```

`prepublishOnly` runs `gulp build && gulp check`, so a broken build blocks the
publish rather than shipping.

## Then verify it actually took

```bash
npm view nsds-design-system version
cd /tmp && npx -y nsds-design-system nsds-mcp <<< '{"jsonrpc":"2.0","id":1,"method":"tools/list"}'
```

The second one is the real test: it proves a stranger can install the package
and that the `nsds-mcp` bin survived packing.

## Things that have already bitten, so check them

The publish dry run is the only place these show up, and each one is a
*warning* rather than an error — the publish would have succeeded with the
package silently broken.

- **`bin` paths must not start with `./`.** `"./mcp/server.mjs"` made npm drop
  the entry with a warning, which would have shipped a package where
  `npx nsds-mcp` did not exist.
- **`files: [".claude"]` swept in `settings.local.json`** — machine-local
  agent config headed for a public tarball. It is `.claude/skills` now.
- **Publishing from the wrong directory.** Running `npm publish` inside a
  throwaway test project publishes *that* project. Check `npm pack --dry-run`
  names `nsds-design-system` before you publish.

## Version numbers are permanent

`npm unpublish` only works within 72 hours, and after that the exact
name+version is burned forever — you cannot republish `3.0.0`, only move to
`3.0.1`. So the dry run matters more here than in most workflows.

**Open decision:** the package is currently at `3.0.0`, inherited from the
internal versioning, but it has never been published under any name. A new
package starting at 3.0.0 implies a 1.x and 2.x that never existed. If you
want to start clean, do it *before* the first publish:

```bash
npm version 1.0.0 --no-git-tag-version
```

## What ships

308 files, 2.6 MB packed, 8 MB unpacked: the built CSS bundles, the tokens
(CSS, JSON, JS, d.ts), the component layer source, the React wrappers, the
HTML templates, the fonts, the agent skill and the MCP server.

Zero runtime dependencies. Tailwind is an optional peer.
