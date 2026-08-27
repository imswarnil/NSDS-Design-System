# Build the same UI

Everything needed to make another project look like this one. Three ways in,
depending on whether a person or an agent is doing the building.

---

## 1. Install

```bash
npm install nsds-design-system
```

Zero runtime dependencies. Tailwind is an *optional* peer — you only need it
if you want the Tailwind-flavoured bundle.

### Take one stylesheet

| Import | Use |
| --- | --- |
| `nsds-design-system/dist/namaste-ui.css` | plain CSS, everything, no build step |
| `nsds-design-system/dist/namaste-ui.min.css` | the same, minified |
| `nsds-design-system/dist/namaste-ui.tailwind.css` | a project already on Tailwind v4 |
| `nsds-design-system/dist/namaste-ui.tailwind.min.css` | the same, minified |

```js
// any bundler
import "nsds-design-system/dist/namaste-ui.css";
```

```html
<!-- or plain HTML -->
<link rel="stylesheet" href="/node_modules/nsds-design-system/dist/namaste-ui.min.css">
```

Tokens are importable as JS/TS too, with types:

```js
import tokens from "nsds-design-system";
```

**Dark mode is automatic.** The tokens flip under `[data-theme="dark"]`. Use
the semantic names — `--color-ink`, `--color-surface`, `--color-border` — and
both themes are correct with no second stylesheet and no `@media` block of
your own. A hard-coded hex is a bug in exactly one theme, and nobody notices
which.

---

## 2. Build a page

A marketing page here is a stack of full-width **bands**. Each is one section
with one job.

```html
<section class="ns-band ns-band--sunken">
  <div class="ns-band__inner">
    <header class="ns-band__head">
      <span class="ns-kicker">Kicker</span>
      <h2 class="ns-band__title">The heading</h2>
      <p class="ns-band__lede">The framing sentence.</p>
    </header>
    <!-- the band's content -->
  </div>
</section>
```

- `.ns-band__inner` owns the container width and the gutters. Never put a page
  width on the band itself.
- `--sunken` alternates the ground so consecutive bands read as separate.
  `--tight` is thinner. `--dark` is the navy console surface.
- Vertical rhythm comes from the semantic spacing scale (`--stack-lg` between
  page sections), not from raw `--space-N`.

### The admission test for a section

**A band must answer a question no other band on the page answers.** That is
the whole test, and it is what stops a page becoming a brochure. A section
that restates an existing one in a different arrangement is a variant, not a
section.

Two rules follow from it: **cut from the bottom, never the middle** — a page
without testimonials still works, a page without the merchandise is a
brochure — and **one closer per page**, because a second call to action at the
end is competing with the first and one of them loses.

### Where to look things up

Every component has a page in the styleguide at
<https://nsds.imswarnil.com/>, generated from the same source the CSS is. Each
one carries what the component is for and — more useful — what it is **not**
for, since most misuse is a component doing a neighbour's job.

---

## 3. The two rules that make work look like it belongs

Most of what separates work that fits from work that does not comes down to
these. Both are enforced by the build in this repo.

### The type scale forks on scanned-versus-read

`--size-body` (14px) is the **UI** size: rails, tables, admin, catalogue
cards — anything scanned.

`--size-prose` (17px) / `--size-prose-lead` (20px) / `--size-prose-small`
(15px) are the **reading** scale: articles, and every marketing band. Nobody
scans a homepage; they read it once, deciding. Marketing copy at 13px sits one
step *below* the UI base and level with a table caption.

Leading forks with it: `--leading-prose` (1.7) for prose paragraphs only,
`--leading-body` (1.6) for UI, `--leading-snug` (1.45) for multi-line text
that is scanned rather than read.

### Mono is for values; sans is for words

The monospace voice belongs on an index, a duration, a count, a price, a
timestamp, a status. It does **not** belong on a person's name, a stat's
label, a call to action or a sentence of fine print.

The test: would you say it aloud as a word, or read it off as a figure?
"Priya S." is a word. "4h 05m" is a figure.

---

## 4. Let an agent do it

Two ways, and they are complementary.

### The skill — for Claude Code

A self-contained pack: the tokens, the class inventory, the component list,
the rules and the page patterns, written for an agent working in a repo that
does **not** contain this design system.

```bash
# project-scoped — commit it so the whole team's agents get it
cp -R node_modules/nsds-design-system/.claude/skills/namaste-ui .claude/skills/

# or user-scoped — every project you work on
cp -R node_modules/nsds-design-system/.claude/skills/namaste-ui ~/.claude/skills/
```

Then ask for what you want: *"Build a pricing page in the Namaste UI language
— three tiers, the free one first."*

See [PORTABLE-SKILL.md](./PORTABLE-SKILL.md) for what is in it and how it
stays current.

### The MCP server — for any MCP client

Where the skill is a document an agent reads, the MCP server is a set of
tools it can *query* — better when you want the current answer rather than a
snapshot, and it works in any MCP client, not just Claude Code.

```jsonc
// claude_desktop_config.json, .mcp.json, or your client's equivalent
{
  "mcpServers": {
    "nsds": {
      "command": "npx",
      "args": ["-y", "nsds-design-system", "nsds-mcp"]
    }
  }
}
```

| Tool | Answers |
| --- | --- |
| `list_components` | what exists, by family |
| `get_component` | what one component is for, what it is not for, and its markup |
| `search_classes` | does a class exist, and which stylesheet owns it |
| `list_tokens` | the tokens and their values |
| `get_guide` | the principles, the enforced rules, the traps |
| `get_setup` | how to install and link the CSS |

It has no dependencies of its own — it speaks JSON-RPC over stdio directly,
so adding it does not pull an SDK and its tree into your install.

Check it by hand:

```bash
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | npx nsds-mcp
```

---

## 5. What not to do

**Do not re-implement the look from the class list.** The entire value of the
system is that one layer feeds every surface; a second copy diverges on the
first change and the two are never reconciled.

If a project genuinely cannot take the bundle, the honest answer is "this
project is not on the design system yet" — not an approximation in new CSS.
An approximation is worse than nothing, because it looks close enough that
nobody ever fixes it.

**Do not hard-code a value the system has a token for.** Colours, radii,
spacing, durations and font stacks are all tokens; a literal is a bug in one
theme.

**Do not style a React component inline.** The CSS layer is the portable
part. A component that styles itself is a component every other renderer has
to reimplement.
