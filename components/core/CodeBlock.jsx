import React from "react";
/* Formalizes the theme's own .ns-code motif: a navy console bar with a mono
   filename tab + copy button, flush white/surface code area, all-blue token
   palette (never a rainbow highlighter) — matches prompt.md's brand voice. */
const RULES = [
  [/(\/\/.*$)/gm, "var(--color-muted)", "italic"],
  [/\b(public|private|static|class|return|if|else|for|while|new|trigger|on|insert|update|delete|SELECT|FROM|WHERE|GROUP BY)\b/g, "var(--color-brand-600)", "700"],
  [/'([^']*)'/g, "var(--color-brand-500)", "400"],
];
function highlight(code) {
  let html = code.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  RULES.forEach(([re, color, weight]) => { html = html.replace(re, (m) => `<span style="color:${color};font-weight:${weight}">${m}</span>`); });
  return html;
}
export function CodeBlock({ code, filename = "apex", copyable = true }) {
  const [copied, setCopied] = React.useState(false);
  return (
    <div style={{ borderRadius: "var(--radius-sm)", overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
      <div style={{ background: "var(--color-brand-900)", padding: "0.5rem 0.75rem 0", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
        <span style={{ background: "var(--color-surface)", color: "var(--color-brand-600)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", fontWeight: 700, borderRadius: "4px 4px 0 0", padding: "0.4rem 0.75rem" }}>{filename}</span>
        {copyable && (
          <button onClick={() => { navigator.clipboard?.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 1200); }}
            style={{ all: "unset", cursor: "pointer", marginBottom: 6, fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: copied ? "#9ee8b0" : "rgb(255 255 255 / 0.75)", padding: "0.3rem 0.5rem" }}>
            {copied ? "COPIED" : "COPY"}
          </button>
        )}
      </div>
      <pre style={{ margin: 0, background: "var(--color-surface)", padding: "1rem", fontFamily: "var(--font-mono)", fontSize: "0.85rem", lineHeight: 1.6, color: "var(--color-ink)", overflowX: "auto" }}>
        <code dangerouslySetInnerHTML={{ __html: highlight(code) }} />
      </pre>
    </div>
  );
}
