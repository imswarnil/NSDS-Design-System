import React from "react";
/** Big tabular-mono stat readout — reads like a metrics panel, not a marketing counter. */
export function CourseStats({ stats = [], onDark = true }) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "0" }}>
      {stats.map((s, i) => (
        <div key={i} style={{ display: "flex", flexDirection: "column", gap: "0.2rem", padding: "0 1.5rem", borderLeft: i > 0 ? "1px solid " + (onDark ? "rgb(255 255 255 / 0.15)" : "var(--color-border)") : "none" }}>
          <b style={{ fontFamily: "var(--font-mono)", fontVariantNumeric: "tabular-nums", fontSize: "1.5rem", fontWeight: 700, lineHeight: 1, color: onDark ? "#fff" : "var(--color-ink)" }}>{s.value}</b>
          <span style={{ display: "flex", alignItems: "center", gap: "0.3rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: onDark ? "rgb(255 255 255 / 0.55)" : "var(--color-label)" }}>
            <i className={`ph ${s.icon}`} /> {s.label}
          </span>
        </div>
      ))}
    </div>
  );
}
