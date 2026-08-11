import React from "react";
/* Principle: kickers render as a code comment, not a pastel eyebrow pill —
   the theme's own content is full of Apex/SOQL comments, so this borrows that
   voice for section labels instead of inventing a decorative motif. */
export function Kicker({ children, align = "left", light = false }) {
  const commentColor = light ? "rgb(255 255 255 / 0.4)" : "var(--color-muted)";
  const textColor = light ? "#fff" : "var(--color-ink)";
  return (
    <span style={{ display: "flex", alignItems: "baseline", justifyContent: align === "center" ? "center" : "flex-start", gap: "0.4em", fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: "var(--weight-label)", letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}>
      <span style={{ color: commentColor }}>//</span>
      <span style={{ color: textColor }}>{children}</span>
    </span>
  );
}
