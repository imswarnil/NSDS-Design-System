# The portable skill

`.claude/skills/namaste-ui/` is a self-contained knowledge pack. Drop it into
**any other project** and an AI agent working there can build interfaces in
this design language without the design system repository being present.

It is generated. Do not edit it by hand — `npm run check` will fail.

---

## What it is

A [Claude Code skill](https://docs.claude.com/en/docs/claude-code/skills): a
directory with a `SKILL.md` carrying YAML frontmatter, plus reference files
the agent reads on demand.

```
.claude/skills/namaste-ui/
├── SKILL.md                  the entry point — how to work in this language
└── references/
    ├── rules.md              principles, enforced rules, and the traps
    ├── tokens.md             every public token, with its value
    ├── classes.md            every .ns-* class, grouped by source file
    ├── components.md         every component: what it is for, what it is not
    └── patterns.md           band grammar, page composition, admission test
```

The agent loads `SKILL.md` when a task looks like it needs this design
language, and pulls in a reference file only when it needs that specific
thing. That split matters: the whole pack is ~2,900 lines, and loading all of
it for a task that just needs a button would crowd out the actual work.

### Why this is separate from the `SKILL.md` at the repo root

The root skill is for working **inside** this repository, and every sentence
of it assumes that — "read `readme.md` first, then explore the other files".
Copy it into another project and every pointer dangles.

This bundle assumes the opposite: that nothing is present except the bundle.
So it carries the token values, the class inventory, the component list and
the rules as text, and it tells the agent how to obtain the stylesheet.

Two skills, two jobs. Keep both.

---

## Using it in another project

### 1. Copy the skill

```bash
# project-scoped — commit it, so the whole team's agents get it
cp -R /path/to/NS-Design-System/.claude/skills/namaste-ui \
      /path/to/other-project/.claude/skills/

# or user-scoped — available in every project you work on
cp -R /path/to/NS-Design-System/.claude/skills/namaste-ui \
      ~/.claude/skills/
```

### 2. Copy the stylesheet

The skill deliberately does **not** carry the CSS — a 1MB stylesheet pasted
into a knowledge pack is a copy that silently goes stale. Take the build
artifact instead:

| File | Use |
| --- | --- |
| `dist/namaste-ui.css` | plain CSS, everything, no build step |
| `dist/namaste-ui.min.css` | the same, minified |
| `dist/namaste-ui.tailwind.css` | for a project already on Tailwind v4 |
| `dist/namaste-ui.tailwind.min.css` | the same, minified |

```bash
cp /path/to/NS-Design-System/dist/namaste-ui.min.css other-project/public/
```

Then link it, and the `.ns-*` classes in the reference files all work.

### 3. Ask for what you want

The agent has the vocabulary now:

> Build a pricing page in the Namaste UI language — three tiers, the free
> one first.

It should reach for `.ns-band`, `.ns-plans`, `.ns-plan`, set the copy at the
reading scale, and keep the mono voice on the prices and off the plan names.

---

## How it stays true

Every list in the bundle is read out of the real artifacts at build time:

| Reference | Generated from |
| --- | --- |
| `tokens.md` | `tokens/tokens.json` — itself generated from `tokens/*.css` |
| `classes.md` | parsing every file in `components/css/` |
| `components.md` | the `COMPONENTS` array in `scripts/component-docs.mjs` — the same array the styleguide renders from |

So a token that changes value, a class that gets renamed, or a component
that gains a "not for" line all reach the pack in the same commit that made
the change. There is no separate step anybody can forget.

**`rules.md` and `patterns.md` are written by hand** and live as string
constants in `scripts/build-skill.mjs`. They are judgement — the five
principles, the scanned-versus-read fork, "mono is for values", the list of
traps — and judgement does not come out of a parser. They are the part of the
bundle worth reading twice.

### The gate

```bash
node scripts/build-skill.mjs           # regenerate
node scripts/build-skill.mjs --check   # exit 1 if the bundle on disk is stale
```

`--check` runs inside `npm run check`, and the generator runs inside
`npm run build`. A stale bundle fails CI, because the failure mode it
prevents is the nastiest kind: an agent confidently teaching a version of
this system that no longer exists, in somebody else's repository, where
nobody here will see it.

---

## What it deliberately leaves out

- **The React wrappers and Handlebars partials.** Those are adapters for two
  specific products. The CSS layer is the portable part; a third product
  should write its own thin adapter over the same classes rather than
  inherit either one.
- **The templates.** Same reason — `templates/*.html` is the contract those
  two stacks adapt, not a thing to paste into a third.
- **The stylesheet itself.** See above: copy the build artifact, do not
  embed it.

## When it is the wrong tool

If the target project genuinely cannot take the bundle, the honest answer is
"this project is not on the design system yet" — not an approximation in new
CSS. An approximation is worse than nothing, because it looks close enough
that nobody ever fixes it, and the two drift apart from the first change
onward.
