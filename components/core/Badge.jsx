import React from "react";
/* Principle: status reads as a bordered mono tag with a dot, not a solid
   pastel-tint pill — the same information, told through a status dot + text
   color instead of a background wash, so a row of badges reads like a status
   line in a build log rather than a marketing chip. */
const colors = {
  default: "var(--color-brand-500)",
  accent: "var(--color-accent-500)",
  success: "var(--color-success)",
  warning: "var(--color-warning)",
  error: "var(--color-error)",
};
export function Badge({ children, variant = "default", icon, dot = true }) {
  const c = colors[variant] || colors.default;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", borderRadius: "var(--radius-sm)", padding: "0.2rem 0.55rem", fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-ink)", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
      {icon ? <i className={`ph ${icon}`} style={{ color: c, fontSize: "0.9rem" }} /> : dot && <span style={{ width: 6, height: 6, borderRadius: 9999, background: c, flexShrink: 0 }} />}
      {children}
    </span>
  );
}
