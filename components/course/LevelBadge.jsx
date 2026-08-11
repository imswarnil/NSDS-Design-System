import React from "react";
/** Difficulty as a mono status tag with a color dot — matches Badge's language exactly. */
export function LevelBadge({ level = "beginner" }) {
  const map = {
    beginner: ["var(--color-success)", "Beginner"],
    intermediate: ["var(--color-warning)", "Intermediate"],
    advanced: ["var(--color-brand-500)", "Advanced"],
  };
  const [color, label] = map[level] || map.beginner;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", borderRadius: "var(--radius-sm)", padding: "0.2rem 0.55rem", fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-ink)", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: color, flexShrink: 0 }} />
      {label}
    </span>
  );
}
