#!/usr/bin/env node
/* NSDS — Model Context Protocol server.
   =========================================================================
   Exposes this design system to any MCP client (Claude Desktop, Claude Code,
   an editor, an agent) so a model building a UI in another project can ask
   what exists instead of guessing at class names.

   NO DEPENDENCIES, ON PURPOSE. MCP is JSON-RPC 2.0 over stdio, which is a
   few hundred lines to speak correctly — and a design system that ships CSS
   should not make every consumer install an SDK, a transport and their
   transitive tree to read its own component list. `npm install
   nsds-design-system` stays a zero-runtime-dependency install.

   THE DATA IS READ FROM THE REAL ARTIFACTS, never from a copy: components
   from the COMPONENTS array the styleguide renders from, tokens from the
   generated tokens.json, classes by walking components/css/. A rename
   reaches this server in the commit that made it, because there is nothing
   here to update.

   Run:      npx nsds-mcp
   Wire up:  {"mcpServers":{"nsds":{"command":"npx","args":["-y","nsds-design-system","nsds-mcp"]}}}
   Debug:    echo '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' | node mcp/server.mjs
*/
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createInterface } from "node:readline";
import { COMPONENTS } from "../scripts/component-docs.mjs";
import { cssFiles, cssGroup } from "../scripts/lib/css-files.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (p) => readFileSync(join(ROOT, p), "utf8");
const pkg = JSON.parse(read("package.json"));

/* ---- the data, read once ------------------------------------------------ */
const strip = (s) => String(s ?? "")
  .replace(/<[^>]+>/g, "")
  .replace(/&mdash;/g, "—").replace(/&ndash;/g, "–").replace(/&rsquo;/g, "’")
  .replace(/&ldquo;|&rdquo;/g, '"').replace(/&amp;/g, "&").replace(/&middot;/g, "·")
  .replace(/&times;/g, "×").replace(/&nbsp;/g, " ").replace(/&pound;/g, "£");

const rootClass = (c) => {
  const seen = [];
  for (const v of c.variants ?? [])
    for (const m of (v.html ?? "").matchAll(/class="([^"]*)"/g))
      for (const cls of m[1].split(/\s+/))
        if (cls.startsWith("ns-") && !seen.includes(cls)) seen.push(cls);
  const id = c.id.replace(/-/g, "");
  const norm = (x) => x.slice(3).replace(/[-_]/g, "");
  return seen.find((x) => norm(x) === id)
      ?? seen.find((x) => norm(x).startsWith(id) || id.startsWith(norm(x)))
      ?? seen.find((x) => !x.includes("__") && !x.includes("--"))
      ?? seen[0] ?? null;
};

/* Every class, with the file and family it belongs to — the answer to
   "where does the button live", which is the question this whole folder
   structure exists to make answerable. */
const CLASS_INDEX = [];
for (const rel of cssFiles(ROOT)) {
  const src = read(rel).replace(/\/\*[\s\S]*?\*\//g, "");
  for (const name of new Set([...src.matchAll(/\.(ns-[a-zA-Z0-9_-]+)/g)].map((m) => m[1]))) {
    CLASS_INDEX.push({ name, file: rel, family: cssGroup(rel) });
  }
}

const tokenJson = JSON.parse(read("tokens/tokens.json"));
const TOKENS = [];
(function flatten(node) {
  for (const [k, v] of Object.entries(node)) {
    if (k.startsWith("$")) continue;
    if (v && typeof v === "object" && v.$value !== undefined) {
      const name = v.$extensions?.["ns.cssVar"] ?? `--${k}`;
      if (!name.startsWith("--ns-")) {
        TOKENS.push({ name, value: String(v.$value), group: (v.$extensions?.["ns.definedIn"] ?? "").replace("tokens/", "").replace(".css", "") });
      }
    } else if (v && typeof v === "object") flatten(v);
  }
})(tokenJson.light ?? {});

const REFERENCE = (name) => {
  try { return read(`.claude/skills/namaste-ui/references/${name}.md`); }
  catch { return `No reference "${name}". Available: rules, patterns, tokens, classes, components.`; }
};

/* ---- tools -------------------------------------------------------------- */
const TOOLS = [
  {
    name: "list_components",
    description: "List the design system's components — id, title, family and root class. Start here: the system is wide, and most of what a page needs already has a name. Optionally filter by family or a search term.",
    inputSchema: {
      type: "object",
      properties: {
        family: { type: "string", description: "Filter to one family, e.g. Sections, Blog, LMS, Forms." },
        query: { type: "string", description: "Free-text match against title, id and summary." },
      },
    },
    run: ({ family, query }) => {
      let list = COMPONENTS;
      if (family) list = list.filter((c) => c.family.toLowerCase() === String(family).toLowerCase());
      if (query) {
        const q = String(query).toLowerCase();
        list = list.filter((c) => `${c.id} ${c.title} ${strip(c.summary)}`.toLowerCase().includes(q));
      }
      if (!list.length) return "No components matched. Families: " + [...new Set(COMPONENTS.map((c) => c.family))].join(", ");
      const byFamily = new Map();
      for (const c of list) {
        if (!byFamily.has(c.family)) byFamily.set(c.family, []);
        byFamily.get(c.family).push(c);
      }
      return [...byFamily].map(([f, cs]) =>
        `## ${f}\n` + cs.map((c) => {
          const r = rootClass(c);
          return `- ${c.id} — ${c.title}${r ? ` (.${r})` : ""}`;
        }).join("\n")).join("\n\n");
    },
  },
  {
    name: "get_component",
    description: "Everything about one component: what it is for, what it is NOT for (the more useful half — most misuse is a component doing a neighbour's job), its accessibility contract, and copy-pasteable markup for every variant.",
    inputSchema: {
      type: "object",
      properties: { id: { type: "string", description: "Component id, e.g. button, shero, widget, post-layout." } },
      required: ["id"],
    },
    run: ({ id }) => {
      const c = COMPONENTS.find((x) => x.id === id)
             ?? COMPONENTS.find((x) => x.id.toLowerCase() === String(id ?? "").toLowerCase());
      if (!c) {
        const near = COMPONENTS.filter((x) => x.id.includes(String(id ?? "").toLowerCase())).slice(0, 8).map((x) => x.id);
        return `No component "${id}".` + (near.length ? ` Did you mean: ${near.join(", ")}?` : " Call list_components.");
      }
      const r = rootClass(c);
      const out = [`# ${c.title}${r ? ` \`.${r}\`` : ""}`, `Family: ${c.family} · id: ${c.id}`, "", strip(c.summary)];
      if (c.use?.length) out.push("", "## Use it for", ...c.use.map((u) => `- ${strip(u)}`));
      if (c.not?.length) out.push("", "## Not for", ...c.not.map((u) => `- ${strip(u)}`));
      if (c.a11y?.length) out.push("", "## Accessibility contract", ...c.a11y.map((u) => `- ${strip(u)}`));
      for (const v of c.variants ?? []) {
        out.push("", `## Variant — ${v.name}`);
        if (v.note) out.push(strip(v.note));
        out.push("```html", v.html.trim(), "```");
      }
      return out.join("\n");
    },
  },
  {
    name: "search_classes",
    description: "Find .ns-* classes by name fragment, and see which stylesheet and family each lives in. Use before inventing a class name — the build rejects any .ns-* class that has no rule.",
    inputSchema: {
      type: "object",
      properties: {
        query: { type: "string", description: "Fragment, e.g. btn, card, widget, marquee." },
        limit: { type: "number", description: "Max results (default 60)." },
      },
      required: ["query"],
    },
    run: ({ query, limit }) => {
      const q = String(query).toLowerCase().replace(/^\./, "");
      const hits = CLASS_INDEX.filter((c) => c.name.toLowerCase().includes(q));
      if (!hits.length) return `No class matches "${query}".`;
      const cap = Math.max(1, Math.min(Number(limit) || 60, 300));
      const shown = hits.slice(0, cap);
      const byFile = new Map();
      for (const h of shown) {
        if (!byFile.has(h.file)) byFile.set(h.file, []);
        byFile.get(h.file).push(h.name);
      }
      const head = `${hits.length} class(es) matching "${query}"` + (hits.length > cap ? ` — showing ${cap}` : "");
      return head + "\n\n" + [...byFile].map(([f, names]) => `${f}\n  ${names.sort().map((n) => "." + n).join(" ")}`).join("\n\n");
    },
  },
  {
    name: "list_tokens",
    description: "The design tokens — colours, type scale, spacing, radii, timings — with their values. Never hard-code a value the system has a token for; the tokens flip under [data-theme=\"dark\"], and a literal is a bug in exactly one theme.",
    inputSchema: {
      type: "object",
      properties: {
        group: { type: "string", description: "colors, typography, spacing, layout, effects, dataviz, base." },
        query: { type: "string", description: "Fragment of a token name, e.g. brand, prose, space." },
      },
    },
    run: ({ group, query }) => {
      let list = TOKENS;
      if (group) list = list.filter((t) => t.group.toLowerCase() === String(group).toLowerCase());
      if (query) list = list.filter((t) => t.name.toLowerCase().includes(String(query).toLowerCase()));
      if (!list.length) return "Nothing matched. Groups: " + [...new Set(TOKENS.map((t) => t.group))].join(", ");
      const byGroup = new Map();
      for (const t of list) {
        if (!byGroup.has(t.group)) byGroup.set(t.group, []);
        byGroup.get(t.group).push(t);
      }
      return [...byGroup].map(([g, ts]) => `## ${g}\n` + ts.map((t) => `${t.name}: ${t.value}`).join("\n")).join("\n\n");
    },
  },
  {
    name: "get_guide",
    description: "The judgement, not the inventory: the five principles, the rules the build enforces, the scanned-versus-read type fork, 'mono is for values', the traps that fail silently, and the band grammar for composing a page. Read this before writing any CSS.",
    inputSchema: {
      type: "object",
      properties: { topic: { type: "string", enum: ["rules", "patterns"], description: "rules = principles, enforced rules and traps. patterns = band grammar and page composition." } },
    },
    run: ({ topic }) => REFERENCE(topic === "patterns" ? "patterns" : "rules"),
  },
  {
    name: "get_setup",
    description: "How to consume this design system in another project — which stylesheet to take, how to link it, and what NOT to do (re-implement the CSS from the class list).",
    inputSchema: { type: "object", properties: {} },
    run: () => [
      `# Using ${pkg.name} v${pkg.version}`,
      "",
      "## 1. Install",
      "```bash",
      `npm install ${pkg.name}`,
      "```",
      "",
      "## 2. Take ONE stylesheet",
      "",
      "| Import | Use |",
      "| --- | --- |",
      `| \`${pkg.name}/dist/namaste-ui.css\` | plain CSS, everything, no build step |`,
      `| \`${pkg.name}/dist/namaste-ui.min.css\` | the same, minified |`,
      `| \`${pkg.name}/dist/namaste-ui.tailwind.css\` | a project already on Tailwind v4 |`,
      `| \`${pkg.name}/dist/namaste-ui.tailwind.min.css\` | the same, minified |`,
      "",
      "```js",
      `import "${pkg.name}/dist/namaste-ui.css";`,
      "```",
      "",
      "Tokens are also importable as JS/TS:",
      "```js",
      `import tokens from "${pkg.name}";`,
      "```",
      "",
      "## 3. Compose with classes, never with new CSS",
      "",
      "Call `search_classes` and `list_components` first. Write new CSS only when",
      "nothing fits, and then follow `get_guide`.",
      "",
      "**Do not re-implement the look from the class list.** The value of the",
      "system is that one layer feeds every surface; a second copy diverges on the",
      "first change. If the target project genuinely cannot take the bundle, say",
      "so plainly rather than approximating — an approximation looks close enough",
      "that nobody ever fixes it.",
      "",
      "Dark mode is automatic: the tokens flip under `[data-theme=\"dark\"]`. Use",
      "the semantic names (`--color-ink`, `--color-surface`, `--color-border`) and",
      "both themes are correct with no second stylesheet.",
    ].join("\n"),
  },
];

/* ---- JSON-RPC over stdio ------------------------------------------------ */
const send = (msg) => process.stdout.write(JSON.stringify(msg) + "\n");
const ok = (id, result) => send({ jsonrpc: "2.0", id, result });
const fail = (id, code, message) => send({ jsonrpc: "2.0", id, error: { code, message } });

const HANDLERS = {
  initialize: (id) => ok(id, {
    protocolVersion: "2024-11-05",
    capabilities: { tools: {} },
    serverInfo: { name: "nsds", version: pkg.version },
  }),
  ping: (id) => ok(id, {}),
  "tools/list": (id) => ok(id, {
    tools: TOOLS.map(({ name, description, inputSchema }) => ({ name, description, inputSchema })),
  }),
  "tools/call": (id, params) => {
    const tool = TOOLS.find((t) => t.name === params?.name);
    if (!tool) return fail(id, -32602, `Unknown tool: ${params?.name}`);
    try {
      return ok(id, { content: [{ type: "text", text: tool.run(params.arguments ?? {}) }] });
    } catch (err) {
      /* Reported as a tool RESULT with isError, not as a protocol error: the
         model should see what went wrong and adjust, rather than the client
         treating a bad argument as a broken server. */
      return ok(id, { content: [{ type: "text", text: `Tool failed: ${err.message}` }], isError: true });
    }
  },
};

createInterface({ input: process.stdin }).on("line", (line) => {
  const text = line.trim();
  if (!text) return;
  let msg;
  try { msg = JSON.parse(text); } catch { return fail(null, -32700, "Parse error"); }
  /* Notifications carry no id and take no reply — answering one is a protocol
     violation that some clients treat as fatal. */
  if (msg.id === undefined || msg.id === null) return;
  const handler = HANDLERS[msg.method];
  if (!handler) return fail(msg.id, -32601, `Method not found: ${msg.method}`);
  handler(msg.id, msg.params);
});
