import React from "react";
/** Training-section collection card — for a /training/ overview grid (distinct from RoadmapCard, which is the spine-connected version used on the roadmap page itself). */
export function TrainingCard({ n, title, desc, icon = "ph-flag", lessons, duration, progress, href = "#" }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", color: "inherit", position: "relative", display: "flex", flexDirection: "column", gap: "0.75rem", padding: "1.25rem", border: "1px solid " + (hover ? "var(--color-brand-500)" : "var(--color-border)"), borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)", transition: "border-color var(--duration-base) var(--ease-out)" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: "2.75rem", height: "2.75rem", borderRadius: "var(--radius-sm)", boxShadow: "inset 0 0 0 1px var(--color-border)", color: "var(--color-brand-500)", fontSize: "1.35rem" }}><i className={`ph ${icon}`} /></span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "var(--color-label)" }}>{String(n).padStart(2, "0")}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-heading)", fontWeight: 800, fontSize: "1.05rem" }}>{title}</h3>
      <p style={{ fontSize: "0.85rem", color: "var(--color-muted)", lineHeight: 1.55, margin: 0 }}>{desc}</p>
      <div style={{ display: "flex", gap: "0.8rem", fontFamily: "var(--font-mono)", fontSize: "0.68rem", fontWeight: 700, color: "var(--color-label)" }}>
        {typeof lessons !== "undefined" && <span>{String(lessons).padStart(2, "0")} LESSONS</span>}
        {duration && <span>{duration.toUpperCase()}</span>}
      </div>
      {typeof progress === "number" && (
        <div style={{ height: 3, borderRadius: 2, background: "var(--color-surface-sunken)", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${progress}%`, background: "var(--color-brand-500)" }} />
        </div>
      )}
    </a>
  );
}
