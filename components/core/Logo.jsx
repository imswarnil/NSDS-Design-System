import React from "react";
/** Responsive wordmark lockup — icon (favicon.svg) + text, or icon-only when compact. Never invent a pictorial mark beyond the source's own favicon asset. */
export function Logo({ iconSrc = "assets/logo/favicon.svg", text = "Namaste Salesforce", compact = false, light = false, size = 24 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: size * 0.66, color: light ? "#fff" : "var(--color-ink)", whiteSpace: "nowrap" }}>
      <img src={iconSrc} alt="" style={{ width: size, height: size, flexShrink: 0 }} />
      {!compact && <span>{text}</span>}
    </span>
  );
}
