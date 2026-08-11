import React from "react";
/** Blog post collection card — same visual grammar as CourseCard (mono index, hover accent line) minus price/level; tag pill + author/date/read-time meta instead. */
export function BlogCard({ index, title, excerpt, image, tag, authorName, date, readTime, href = "#", onClick }) {
  const [hover, setHover] = React.useState(false);
  return (
    <a href={href} onClick={onClick} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ textDecoration: "none", color: "inherit", position: "relative", display: "flex", flexDirection: "column", height: "100%", overflow: "hidden", border: "1px solid " + (hover ? "var(--color-brand-500)" : "var(--color-border)"), borderRadius: "var(--radius-card)", background: "var(--color-surface-raised)", transition: "border-color var(--duration-base) var(--ease-out)" }}>
      <span style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "var(--color-brand-500)", transform: hover ? "scaleX(1)" : "scaleX(0)", transformOrigin: "left", transition: "transform var(--duration-base) var(--ease-out)" }} />
      <div style={{ position: "relative", aspectRatio: "16/9", overflow: "hidden", background: "var(--color-surface-sunken)", borderBottom: "1px solid var(--color-border)" }}>
        {image ? <img src={image} alt="" style={{ height: "100%", width: "100%", objectFit: "cover" }} /> : <div style={{ display: "flex", height: "100%", width: "100%", alignItems: "center", justifyContent: "center", color: "var(--color-brand-300)", fontSize: "2.25rem" }}><i className="ph ph-article" /></div>}
        {typeof index !== "undefined" && <span style={{ position: "absolute", top: "0.6rem", left: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: "#fff", background: "rgb(0 0 0 / 0.55)", borderRadius: "var(--radius-sm)", padding: "0.15rem 0.4rem" }}>{String(index).padStart(2, "0")}</span>}
      </div>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", padding: "1rem", gap: "0.6rem" }}>
        {tag && <span style={{ alignSelf: "flex-start", fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--color-brand-600)" }}>{tag}</span>}
        <h3 style={{ fontSize: "1.05rem", fontWeight: 700, lineHeight: 1.3, fontFamily: "var(--font-heading)" }}>{title}</h3>
        <p style={{ fontSize: "0.875rem", color: "var(--color-muted)", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", margin: 0 }}>{excerpt}</p>
        <div style={{ marginTop: "auto", paddingTop: "0.6rem", borderTop: "1px solid var(--color-border)", display: "flex", alignItems: "center", gap: "0.5rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--color-label)" }}>
          <span>{authorName}</span><span>·</span><span>{date}</span><span>·</span><span>{readTime}</span>
        </div>
      </div>
    </a>
  );
}
