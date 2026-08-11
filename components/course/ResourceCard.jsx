import React from "react";
/** Downloadable/external resource card — icon, type tag, title, external-link cue. For a /resources/ page (cheat sheets, templates, tools). */
export function ResourceCard({ title, type = "PDF", icon = "ph-file-text", href = "#" }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "0.9rem", padding: "1rem 1.1rem", border: "1px solid " + (hover ? "var(--color-brand-500)" : "var(--color-border)"), borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)", transition: "border-color var(--duration-fast) var(--ease-out)" }}>
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-sm)", boxShadow: "inset 0 0 0 1px var(--color-border)", color: "var(--color-brand-500)", fontSize: "1.35rem" }}><i className={`ph ${icon}`} /></span>
      <span style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600 }}>{title}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-label)" }}>{type}</span>
      </span>
      <i className="ph ph-arrow-up-right" style={{ flexShrink: 0, color: hover ? "var(--color-brand-600)" : "var(--color-muted)", fontSize: "1.1rem" }} />
    </a>
  );
}
