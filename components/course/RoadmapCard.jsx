import React from "react";
/** Roadmap stop — mono index tile, hairline border, left accent bar on hover (no lift/shadow). */
export function RoadmapCard({ n, title, desc, icon = "ph-flag", duration, lessons, side = "left", href = "#" }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div style={{ position: "relative", maxWidth: 420, marginLeft: side === "right" ? "auto" : 0 }}>
      <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
        style={{ position: "relative", display: "flex", gap: "1.1rem", padding: "1.1rem 1.25rem", textDecoration: "none", minHeight: "9rem", border: "1px solid " + (hover ? "var(--color-brand-500)" : "var(--color-border)"), borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)", color: "inherit", transition: "border-color var(--duration-fast) var(--ease-out)" }}>
        <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "var(--color-brand-500)", transform: hover ? "scaleY(1)" : "scaleY(0)", transformOrigin: "top", transition: "transform var(--duration-fast) var(--ease-out)" }} />
        <span style={{ flex: "none", width: "3.25rem", alignSelf: "flex-start", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-label)" }}>{String(n).padStart(2, "0")}</span>
          <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-sm)", boxShadow: "inset 0 0 0 1px var(--color-border)", color: "var(--color-brand-500)", fontSize: "1.35rem" }}><i className={`ph ${icon}`} /></span>
        </span>
        <span style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
          <span style={{ fontFamily: "var(--font-heading)", fontSize: "1.1rem", fontWeight: 800, lineHeight: 1.25, color: "var(--color-ink)" }}>{title}</span>
          <span style={{ display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden", marginTop: "0.35rem", fontSize: "0.85rem", lineHeight: 1.55, color: "var(--color-muted)" }}>{desc}</span>
          <span style={{ display: "flex", gap: "0.8rem", marginTop: "0.65rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, color: "var(--color-label)" }}>
            {typeof lessons !== "undefined" && <span>{String(lessons).padStart(2, "0")} LESSONS</span>}
            {duration && <span>{duration.toUpperCase()}</span>}
          </span>
        </span>
      </a>
    </div>
  );
}
