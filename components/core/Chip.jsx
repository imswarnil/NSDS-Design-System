import React from "react";
/** Icon tile — sharp radius, hairline border, quiet tint. No soft glow. */
export function Chip({ icon, variant = "brand", size = 40 }) {
  const isAccent = variant === "accent";
  const color = isAccent ? "var(--color-accent-500)" : "var(--color-brand-500)";
  return (
    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", height: size, width: size, borderRadius: "var(--radius-sm)", fontSize: size * 0.42, color, background: "color-mix(in srgb, " + color + " 8%, transparent)", boxShadow: "inset 0 0 0 1px color-mix(in srgb, " + color + " 30%, transparent)" }}>
      <i className={`ph ${icon}`} aria-hidden="true" />
    </span>
  );
}
