import React from "react";
import { Button } from "./Button.jsx";
/** Site header — logo, nav links with active-state hairline underline, theme toggle, primary CTA. */
export function Navbar({ links = [], activeId, onNavigate, dark, onToggleDark, ctaLabel = "Sign up", onCta, logo }) {
  return (
    <header style={{ position: "sticky", top: 0, zIndex: 40, borderBottom: "1px solid var(--color-border)", background: "color-mix(in srgb, var(--color-surface) 94%, transparent)", backdropFilter: "blur(8px)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.85rem 1.5rem", gap: "1.5rem" }}>
        {logo}
        <nav style={{ display: "flex", gap: "0.35rem", flex: 1, justifyContent: "center", fontFamily: "var(--font-sans)" }}>
          {links.map((l) => (
            <button key={l.id} onClick={() => onNavigate?.(l.id)} style={{ all: "unset", cursor: "pointer", display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.4rem 0.75rem", borderRadius: "var(--radius-sm)", fontSize: "0.9rem", fontWeight: activeId === l.id ? 600 : 450, letterSpacing: "-0.005em", color: activeId === l.id ? "var(--color-brand-600)" : "var(--color-label)", background: activeId === l.id ? "color-mix(in srgb, var(--color-brand-500) 9%, transparent)" : "transparent" }}>{l.icon && <i className={`ph ${l.icon}`} style={{ fontSize: "1rem", opacity: 0.8 }} />}{l.label}</button>
          ))}
        </nav>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {onToggleDark && (
            <button onClick={onToggleDark} aria-label="Toggle dark mode" style={{ all: "unset", cursor: "pointer", display: "inline-flex", height: 32, alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", padding: "0 0.55rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", color: "var(--color-label)", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
              {dark ? "LIGHT" : "DARK"}
            </button>
          )}
          <Button size="sm" onClick={onCta}>{ctaLabel}</Button>
        </div>
      </div>
    </header>
  );
}
