import React from "react";
/* SLDS-flavored code panel: a proper multi-token syntax highlighter (keywords,
   strings, comments, numbers, functions) with an in-panel light/dark toggle.
   Unlike CodeBlock (the restrained all-blue inline motif), this is the full
   developer-console treatment for docs and lesson code — the palette is tuned
   to read cleanly on both a navy SLDS background and a white one. */

const THEMES = {
  dark: {
    bg: "var(--color-brand-900)",
    barBg: "#001127",
    text: "#e6eefc",
    keyword: "#78b0ff",
    string: "#7ce3b0",
    comment: "#6f89a8",
    number: "#f6a4c0",
    func: "#ffd479",
    punct: "#b8c7dc",
    tab: "rgba(255,255,255,0.08)",
    tabText: "#cfe0f7",
    lineNo: "rgba(255,255,255,0.28)",
  },
  light: {
    bg: "#ffffff",
    barBg: "var(--color-surface-sunken)",
    text: "#0b1b34",
    keyword: "#0b5cab",
    string: "#0a7d4f",
    comment: "#6b7a90",
    number: "#b02a6f",
    func: "#9a5b00",
    punct: "#46546b",
    tab: "var(--color-brand-50, #eef4fc)",
    tabText: "var(--color-brand-700)",
    lineNo: "rgba(0,0,30,0.26)",
  },
};

const KEYWORDS = /\b(public|private|protected|global|static|final|virtual|abstract|override|class|interface|extends|implements|return|if|else|for|while|do|switch|case|break|continue|new|this|super|try|catch|finally|throw|void|null|true|false|const|var|let|function|import|export|trigger|on|insert|update|upsert|delete|undelete|SELECT|FROM|WHERE|LIMIT|ORDER\s+BY|GROUP\s+BY|with|sharing|without)\b/g;

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function highlight(code, t) {
  const store = [];
  const stash = (html) => { store.push(html); return `\u0000${store.length - 1}\u0000`; };
  let s = escapeHtml(code);
  // comments (line + block) and strings first — protected from keyword matching
  s = s.replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/)/g, (m) => stash(`<span style="color:${t.comment};font-style:italic">${m}</span>`));
  s = s.replace(/('[^']*'|"[^"]*")/g, (m) => stash(`<span style="color:${t.string}">${m}</span>`));
  // numbers
  s = s.replace(/\b(\d+\.?\d*)\b/g, (m) => `<span style="color:${t.number}">${m}</span>`);
  // function calls
  s = s.replace(/\b([A-Za-z_]\w*)(\s*\()/g, (m, name, paren) => `<span style="color:${t.func}">${name}</span>${paren}`);
  // keywords
  s = s.replace(KEYWORDS, (m) => `<span style="color:${t.keyword};font-weight:700">${m}</span>`);
  // restore protected spans
  s = s.replace(/\u0000(\d+)\u0000/g, (_, i) => store[+i]);
  return s;
}

export function CodePanel({ code = "", filename = "apex", language, copyable = true, defaultTheme = "dark", showLineNumbers = true }) {
  const [theme, setTheme] = React.useState(defaultTheme === "light" ? "light" : "dark");
  const [copied, setCopied] = React.useState(false);
  const t = THEMES[theme];
  const lines = code.replace(/\n$/, "").split("\n");
  const gutterW = String(lines.length).length;
  return (
    <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--color-border)", fontFamily: "var(--font-mono)" }}>
      <div style={{ background: t.barBg, padding: "0.5rem 0.65rem 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "0.5rem" }}>
        <span style={{ background: t.bg, color: t.tabText, fontSize: "0.72rem", fontWeight: 700, borderRadius: "5px 5px 0 0", padding: "0.4rem 0.8rem", boxShadow: theme === "light" ? "inset 0 0 0 1px var(--color-border)" : "none", borderBottom: "none" }}>
          {filename}
        </span>
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: 6 }}>
          {language && <span style={{ color: t.lineNo, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", padding: "0 0.4rem" }}>{language}</span>}
          <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} aria-label="Toggle code theme"
            title="Toggle light / dark"
            style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem", height: 22, padding: "0 0.5rem", borderRadius: 4, fontSize: "0.66rem", fontWeight: 700, letterSpacing: "0.06em", color: t.tabText, boxShadow: `inset 0 0 0 1px ${theme === "dark" ? "rgba(255,255,255,0.18)" : "var(--color-border)"}` }}>
            <i className="ph ph-lightbulb" style={{ fontSize: "0.8rem" }} />{theme === "dark" ? "LIGHT" : "DARK"}
          </button>
          {copyable && (
            <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
              style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.3rem", height: 22, padding: "0 0.5rem", borderRadius: 4, fontSize: "0.68rem", fontWeight: 700, color: copied ? (theme === "dark" ? "#9ee8b0" : "#0a7d4f") : t.tabText, boxShadow: `inset 0 0 0 1px ${theme === "dark" ? "rgba(255,255,255,0.18)" : "var(--color-border)"}` }}>
              {copied && <i className="ph ph-check-circle" style={{ fontSize: "0.8rem" }} />}{copied ? "COPIED" : "COPY"}
            </button>
          )}
        </div>
      </div>
      <div style={{ background: t.bg, display: "flex", overflowX: "auto" }}>
        {showLineNumbers && (
          <pre aria-hidden="true" style={{ margin: 0, padding: "1rem 0.5rem 1rem 0.9rem", textAlign: "right", color: t.lineNo, fontSize: "0.82rem", lineHeight: 1.6, userSelect: "none", background: theme === "dark" ? "rgba(0,0,0,0.18)" : "rgba(0,0,30,0.03)", minWidth: `${gutterW + 1}ch` }}>
            {lines.map((_, i) => `${i + 1}\n`).join("")}
          </pre>
        )}
        <pre style={{ margin: 0, padding: "1rem 1.1rem", fontSize: "0.82rem", lineHeight: 1.6, color: t.text, flex: 1 }}>
          <code dangerouslySetInnerHTML={{ __html: highlight(code, t) }} />
        </pre>
      </div>
    </div>
  );
}
