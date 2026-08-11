import React from "react";
/** Instructor byline — hairline card, mono "INSTRUCTOR" role tag instead of decorative framing. */
export function AuthorBox({ name, bio, avatar }) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start", padding: "1.1rem 1.25rem", border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)" }}>
      <span style={{ display: "inline-flex", position: "relative", flexShrink: 0, width: 44, height: 44 }}>
        {avatar ? <img src={avatar} alt={name} style={{ width: 44, height: 44, borderRadius: 9999, display: "block", objectFit: "cover" }} /> : <span style={{ width: 44, height: 44, borderRadius: 9999, boxShadow: "inset 0 0 0 1px var(--color-border)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-brand-600)", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{name?.[0]}</span>}
        <span style={{ position: "absolute", inset: -3, borderRadius: "9999px", boxShadow: "0 0 0 1.5px var(--color-brand-500)" }} />
      </span>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.55rem" }}>
          <span style={{ fontWeight: 700, fontFamily: "var(--font-heading)" }}>{name}</span>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--color-label)", boxShadow: "inset 0 0 0 1px var(--color-border)", borderRadius: "var(--radius-sm)", padding: "0.1rem 0.35rem" }}>Instructor</span>
        </div>
        <p style={{ marginTop: "0.35rem", fontSize: "0.9rem", color: "var(--color-muted)", lineHeight: 1.55 }}>{bio}</p>
      </div>
    </div>
  );
}
