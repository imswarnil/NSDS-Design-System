import React from "react";
/* Principle: terminal-row list. The index is a real mono tabular number
   (00, 01, 02…), hover is a left accent bar (not a background tint or lift),
   and every row prints its metadata in mono on the right — reads like `ls -l`
   for a course, not a stock "lesson card". */
export function CurriculumList({ items = [], variant = "list" }) {
  const isCard = variant === "cards" || variant === "detailed";
  const wrap = isCard
    ? { display: "grid", gap: "0.6rem" }
    : { border: "1px solid var(--color-border)", borderRadius: "var(--radius-card)", overflow: "hidden", background: "var(--color-surface-raised)" };
  return <div style={wrap}>{items.map((it, i) => <Row key={i} item={it} index={i} variant={variant} isLast={i === items.length - 1} />)}</div>;
}

function Row({ item, index, variant, isLast }) {
  const [hover, setHover] = React.useState(false);
  const isCard = variant === "cards" || variant === "detailed";
  const isTimeline = variant === "timeline";
  return (
    <div onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}
      style={{ position: "relative", display: "flex", alignItems: isCard ? "flex-start" : "center", gap: "0.9rem", padding: "0.85rem 1rem", paddingLeft: isTimeline ? "2rem" : "1.35rem", borderBottom: !isCard && !isLast ? "1px solid var(--color-border)" : "none", border: isCard ? "1px solid " + (hover ? "var(--color-brand-500)" : "var(--color-border)") : "none", borderRadius: isCard ? "var(--radius-card)" : 0, background: isCard ? "var(--color-surface-raised)" : "transparent", transition: "border-color var(--duration-fast) var(--ease-out)" }}>
      <span style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 2, background: "var(--color-brand-500)", transform: hover ? "scaleY(1)" : "scaleY(0)", transformOrigin: "top", transition: "transform var(--duration-fast) var(--ease-out)" }} />
      {isTimeline && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 8, height: 8, borderRadius: 9999, background: item.done ? "var(--color-brand-500)" : "transparent", boxShadow: "0 0 0 1.5px " + (item.done ? "var(--color-brand-500)" : "var(--color-border)") }} />}
      {!isTimeline && <span style={{ flexShrink: 0, width: "1.8rem", fontFamily: "var(--font-mono)", fontSize: "0.85rem", fontWeight: 700, color: "var(--color-label)", fontVariantNumeric: "tabular-nums" }}>{String(index).padStart(2, "0")}</span>}
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", height: variant === "detailed" ? "4rem" : "2.1rem", width: variant === "detailed" ? "6.5rem" : "2.1rem", borderRadius: "var(--radius-sm)", boxShadow: "inset 0 0 0 1px var(--color-border)", color: "var(--color-brand-500)", fontSize: variant === "detailed" ? "1.5rem" : "1rem" }}>
        <i className={`ph ${item.icon || (item.type === "video" ? "ph-play" : item.type === "quiz" ? "ph-exam" : item.type === "exercise" ? "ph-barbell" : "ph-file-text")}`} />
      </span>
      <span style={{ minWidth: 0, flex: 1, display: "flex", flexDirection: "column" }}>
        <span style={{ fontWeight: 600 }}>{item.title}</span>
        {(variant === "cards" || variant === "detailed") && item.type && <span style={{ marginTop: 2, fontFamily: "var(--font-mono)", fontSize: "0.65rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--color-label)" }}>{item.type}</span>}
        {variant === "detailed" && item.desc && <span style={{ fontSize: "0.8125rem", color: "var(--color-muted)", marginTop: 3 }}>{item.desc}</span>}
      </span>
      <span style={{ flexShrink: 0, display: "flex", alignItems: "center", gap: "0.6rem", fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--color-label)" }}>
        {item.duration && <span>{item.duration.toUpperCase()}</span>}
        {item.locked ? <i className="ph ph-lock-simple" style={{ color: "var(--color-muted)", fontFamily: "initial" }} /> : item.preview && <span style={{ color: "var(--color-brand-600)", fontWeight: 700 }}>PREVIEW</span>}
      </span>
    </div>
  );
}
