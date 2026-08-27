/* NS Design System — the tokenizer behind .ns-code.
   =========================================================================
   Plain ESM with no dependencies and no DOM, so ONE implementation serves
   all three consumers: the React <SyntaxHighlighter>, the styleguide
   generator (node, at build time), and any server that wants to ship
   pre-highlighted HTML instead of a grammar.

   It maps a grammar onto the system's SEVEN syntax roles and stops there:

     com  comment    str  string     num  number    kw  keyword
     type type/class fn   call site  punct connective tissue

   That is a deliberate ceiling. A highlighter with thirty scopes needs
   thirty colours, and thirty colours is not a design system — it is a
   screenshot of someone's editor. Adding a language here means writing a
   keyword list, not adding a colour.

   Order matters and is the whole trick: comments and strings are matched
   FIRST, in one alternation with everything else, so a keyword inside a
   string is a string and a URL inside a comment is a comment. */

/* Keyword lists. Apex is the house language, so it leads; the rest are here
   because the docs and lessons genuinely use them. */
const KEYWORDS = {
  apex: "abstract break catch class continue delete do else enum extends final finally for get global if implements insert instanceof interface merge new null override private protected public return set static super switch on this throw transient trigger try undelete update upsert virtual void while with without sharing true false SELECT FROM WHERE LIMIT ORDER BY GROUP HAVING AND OR NOT IN LIKE ASC DESC OFFSET",
  javascript: "async await break case catch class const continue default delete do else export extends finally for from function if import in instanceof let new of return static super switch this throw try typeof var void while yield true false null undefined",
  typescript: "any as async await break case catch class const continue declare default delete do else enum export extends finally for from function if implements import in instanceof interface let new of private protected public readonly return static super switch this throw try type typeof var void while yield true false null undefined",
  html: "DOCTYPE html head body script style link meta",
  css: "important media supports layer container import charset keyframes font-face",
  soql: "SELECT FROM WHERE LIMIT ORDER BY GROUP HAVING AND OR NOT IN LIKE ASC DESC NULLS FIRST LAST OFFSET COUNT",
  bash: "cd cp mv rm ls echo export set if then fi for do done while in function return source sudo npm npx node git",
  json: "true false null",
};
KEYWORDS.js = KEYWORDS.javascript;
KEYWORDS.jsx = KEYWORDS.javascript;
KEYWORDS.ts = KEYWORDS.typescript;
KEYWORDS.tsx = KEYWORDS.typescript;
KEYWORDS.java = KEYWORDS.apex;
KEYWORDS.cls = KEYWORDS.apex;
KEYWORDS.sh = KEYWORDS.bash;
KEYWORDS.shell = KEYWORDS.bash;
KEYWORDS.scss = KEYWORDS.css;

const ROLE_CLASS = {
  com: "ns-tok-com",
  str: "ns-tok-str",
  num: "ns-tok-num",
  kw: "ns-tok-kw",
  type: "ns-tok-type",
  fn: "ns-tok-fn",
  punct: "ns-tok-punct",
};

export function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/* One alternation, one pass. Each branch is a named group, and the group that
   matched IS the role — which is why a keyword can never win over the string
   it is sitting inside: the string branch comes first and consumes it. */
function scanner(language) {
  const lang = String(language || "").toLowerCase();
  const words = KEYWORDS[lang] || KEYWORDS.javascript;
  const kw = words.split(/\s+/).filter(Boolean).sort((a, b) => b.length - a.length).join("|");
  /* The comment syntax is per-language and cannot be a union of all of them:
     `#` is a comment in bash and a colour in CSS, and a highlighter that
     greys out the rest of the line after `#fff` is worse than none. */
  const HASH = ["bash", "sh", "shell", "yaml", "yml", "python", "py", "ruby"];
  const com = [
    "\\/\\/[^\\n]*",
    "\\/\\*[\\s\\S]*?\\*\\/",
    ...(HASH.includes(lang) ? ["#[^\\n]*"] : []),
    ...(lang === "html" || lang === "xml" ? ["<!--[\\s\\S]*?-->"] : []),
  ].join("|");
  return new RegExp(
    [
      `(?<com>${com})`,
      "(?<str>'(?:[^'\\\\\\n]|\\\\.)*'|\"(?:[^\"\\\\\\n]|\\\\.)*\"|`(?:[^`\\\\]|\\\\.)*`)",
      "(?<num>\\b\\d[\\d_]*(?:\\.\\d+)?(?:[eE][+-]?\\d+)?\\b)",
      `(?<kw>\\b(?:${kw})\\b)`,
      // A capitalised identifier is a type in every language here. It is also
      // the one heuristic in this file, and it is right far more often than a
      // full parser is worth in a docs code block.
      "(?<type>\\b[A-Z][A-Za-z0-9_]*\\b)",
      "(?<fn>\\b[a-z_$][\\w$]*(?=\\s*\\())",
      "(?<punct>[{}()\\[\\];,.:=+\\-*/<>!&|?%]+)",
    ].join("|"),
    "g",
  );
}

/* Returns highlighted HTML — escaped, with one <span class="ns-tok-*"> per
   token and everything else passed through untouched. */
export function highlight(code, language) {
  const re = scanner(language);
  const src = String(code);
  let out = "";
  let last = 0;
  let m;
  while ((m = re.exec(src))) {
    out += escapeHtml(src.slice(last, m.index));
    const role = Object.keys(m.groups).find((k) => m.groups[k] !== undefined);
    out += `<span class="${ROLE_CLASS[role]}">${escapeHtml(m[0])}</span>`;
    last = m.index + m[0].length;
  }
  return out + escapeHtml(src.slice(last));
}

/* Wraps each line in its own element so a line can be marked, added or
   removed. Splitting AFTER highlighting would cut a multi-line comment's
   span in half, so the split happens on the source and each line is
   highlighted on its own — which is correct for every construct in these
   languages except a multi-line block comment, handled explicitly below. */
export function highlightLines(code, language, marks = {}) {
  const lines = String(code).replace(/\n$/, "").split("\n");
  const add = new Set(marks.add || []);
  const del = new Set(marks.del || []);
  const mark = new Set(marks.mark || []);

  /* Block comments are the one construct that spans lines. Tracking whether
     we are inside one lets each line be tokenised independently without the
     comment losing its role halfway down. */
  let inBlock = false;
  return lines
    .map((line, i) => {
      let html;
      if (inBlock) {
        const end = line.indexOf("*/");
        if (end === -1) {
          html = `<span class="ns-tok-com">${escapeHtml(line)}</span>`;
        } else {
          inBlock = false;
          html = `<span class="ns-tok-com">${escapeHtml(line.slice(0, end + 2))}</span>` + highlight(line.slice(end + 2), language);
        }
      } else {
        const open = line.lastIndexOf("/*");
        if (open !== -1 && line.indexOf("*/", open) === -1) {
          inBlock = true;
          html = highlight(line.slice(0, open), language) + `<span class="ns-tok-com">${escapeHtml(line.slice(open))}</span>`;
        } else {
          html = highlight(line, language);
        }
      }
      const n = i + 1;
      const mod = add.has(n) ? " ns-code__line--add" : del.has(n) ? " ns-code__line--del" : mark.has(n) ? " ns-code__line--mark" : "";
      // A blank line still has to occupy a row, hence the zero-width filler.
      return `<span class="ns-code__line${mod}">${html || "​"}</span>`;
    })
    /* Joined with NOTHING, not with "\n": each line is already a block-level
       span, so a newline inside a <pre> would render a second, empty line
       between every row and throw the gutter out of alignment. innerText
       still yields one newline per block, so Copy is unaffected. */
    .join("");
}

export function gutter(code) {
  const n = String(code).replace(/\n$/, "").split("\n").length;
  return Array.from({ length: n }, (_, i) => i + 1).join("\n");
}

export const LANGUAGES = Object.keys(KEYWORDS).sort();
