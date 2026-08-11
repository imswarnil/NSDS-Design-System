import React from "react";
/* Principle: data-forward. The card's corner carries a large mono index/
   duration readout — a spec-sheet number, not a hidden tooltip — and the
   whole card's hover state is a 1px top accent line + border brighten, never
   a shadow lift. This is the single most "console" component in the kit. */
export function CourseCard({ index, title, excerpt, image, level = "beginner", price = "free", priceLabel, lessons, duration, authorName, featured, sponsored, href = "#", onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", color: "inherit", position: "relative", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", border: "1px solid " + (hover ? "var(--color-brand-500)" : "var(--color-border)"), borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)", transition: "border-color var(--duration-base) var(--ease-out)" }}>
      <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--color-brand-500)", transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform var(--duration-base) var(--ease-out)" }} />
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "var(--color-surface-sunken)", borderBottom: "1px solid var(--color-border)" }}>
        {image ? <img src={image} alt="" style={{ height: "100%", width: "100%", objectFit: "cover" }} /> : (
          <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", color: "var(--color-brand-300)", fontSize: "2.25rem" }}><i className="ph ph-graduation-cap" /></div>
        )}
        {typeof index !== "undefined" && (
          <span style={{ position: "absolute", top: "0.6rem", left: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "#fff", background: "rgb(0 0 0 / 0.55)", borderRadius: "var(--radius-sm)", padding: "0.15rem 0.4rem", letterSpacing: "0.04em" }}>{String(index).padStart(2, "0")}</span>
        )}
        {(featured || sponsored) && (
          <span style={{ position: "absolute", top: "0.6rem", right: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#fff", background: sponsored ? "var(--color-brand-700)" : "var(--color-warning)", borderRadius: "var(--radius-sm)", padding: "0.15rem 0.45rem" }}>
            {sponsored ? "Sponsored" : "Featured"}
          </span>
        )}
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "1rem", gap: "0.6rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <LevelBadgeInline level={level} />
          <span style={{ marginLeft: "auto", fontFamily: "var(--font-mono)", fontSize: "0.75rem", fontWeight: 700, color: price === "free" ? "var(--color-success)" : "var(--color-ink)" }}>{priceLabel || (price === "free" ? "FREE" : "PAID")}</span>
        </div>
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3, fontFamily: "var(--font-heading)" }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>{excerpt}</p>
        <div style={{ display: "flex", gap: "0.9rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--color-label)", letterSpacing: "0.02em", borderTop: "1px solid var(--color-border)", paddingTop: "0.6rem" }}>
          {typeof lessons !== "undefined" && <span>{String(lessons).padStart(2, "0")} LESSONS</span>}
          {duration && <span>{duration.toUpperCase()}</span>}
        </div>
        <div style={{ marginTop: "auto", paddingTop: "0.4rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--color-muted)" }}>{authorName}</span>
          <span style={{ display: "inline-flex", alignItems: "center", gap: hover ? "0.5rem" : "0.3rem", fontSize: "0.8rem", fontWeight: 700, color: "var(--color-brand-600)", transition: "gap var(--duration-fast) var(--ease-out)" }}>
            View <i className="ph ph-arrow-right" />
          </span>
        </div>
      </div>
    </a>
  );
}

function LevelBadgeInline({ level }) {
  const map = { beginner: ["var(--color-success)", "Beginner"], intermediate: ["var(--color-warning)", "Intermediate"], advanced: ["var(--color-brand-500)", "Advanced"] };
  const [color, label] = map[level] || map.beginner;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-muted)" }}>
      <span style={{ width: 6, height: 6, borderRadius: 9999, background: color }} />{label}
    </span>
  );
}
