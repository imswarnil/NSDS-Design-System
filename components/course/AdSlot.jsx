import React from "react";
/** Dashed placeholder ad slot — mono uppercase label, sharp corners. */
export function AdSlot({ label = "Advertise with us", height = 120 }) {
  return (
    <div style={{ margin: "1.5rem 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "100%", height, border: "1px dashed var(--color-border)", borderRadius: "var(--radius-sm)", background: "var(--color-surface-sunken)" }}>
        <span style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-label)" }}>
          <i className="ph ph-megaphone" style={{ fontFamily: "initial" }} /> {label}
        </span>
      </div>
    </div>
  );
}
