import React from "react";
/** Scroll-spy table of contents — hairline left rail, active item gets a brand-blue left bar (mono index optional). */
export function TableOfContents({ items = [], activeId, onNavigate }) {
  return (
    <nav aria-label="Table of contents" style={{ display: "flex", flexDirection: "column", borderLeft: "1px solid var(--color-border)" }}>
      {items.map((it) => {
        const active = it.id === activeId;
        return (
          <a key={it.id} href={`#${it.id}`} onClick={(e) => { e.preventDefault(); onNavigate?.(it.id); }}
            style={{ padding: it.level === 3 ? "0.35rem 0.9rem 0.35rem 1.6rem" : "0.35rem 0.9rem", marginLeft: -1, borderLeft: "2px solid " + (active ? "var(--color-brand-500)" : "transparent"), fontSize: it.level === 3 ? "0.78rem" : "0.85rem", fontWeight: active ? 700 : 500, color: active ? "var(--color-brand-600)" : "var(--color-muted)", textDecoration: "none" }}>
            {it.label}
          </a>
        );
      })}
    </nav>
  );
}
