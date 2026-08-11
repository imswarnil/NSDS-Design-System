import React from "react";
import { Logo } from "./Logo.jsx";
/** Site footer — logo, link columns, mono copyright line. Hairline top border, no dark band. */
export function Footer({ columns = [], socialIcons = [] }) {
  return (
    <footer style={{ borderTop: "1px solid var(--color-border)", padding: "3rem 1.5rem 2rem" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", flexWrap: "wrap", gap: "3rem", justifyContent: "space-between" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", maxWidth: 260 }}>
          <Logo />
          <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.6 }}>An open-source Salesforce learning platform — courses, a training roadmap, and developer docs.</p>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            {socialIcons.map((icon) => (
              <span key={icon} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 30, height: 30, borderRadius: "var(--radius-sm)", boxShadow: "inset 0 0 0 1px var(--color-border)", color: "var(--color-muted)" }}><i className={`ph ${icon}`} /></span>
            ))}
          </div>
        </div>
        {columns.map((col) => (
          <div key={col.title} style={{ display: "flex", flexDirection: "column", gap: "0.6rem", minWidth: 140 }}>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, letterSpacing: "var(--tracking-label)", textTransform: "uppercase", color: "var(--color-label)" }}>{col.title}</div>
            {col.links.map((l) => <a key={l} href="#" style={{ fontSize: "0.85rem", color: "var(--color-muted)", textDecoration: "none" }}>{l}</a>)}
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 1280, margin: "2.5rem auto 0", paddingTop: "1.25rem", borderTop: "1px solid var(--color-border)", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--color-label)" }}>
        © {new Date().getFullYear()} Namaste Salesforce — MIT licensed, forked from Ghost Casper.
      </div>
    </footer>
  );
}
