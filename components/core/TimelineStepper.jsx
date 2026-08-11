import React from "react";
/** Horizontal step progress — mono-numbered nodes on a connecting hairline, distinct from CurriculumList (lesson rows) and RoadmapCard (section stop). For course/lesson players and multi-step flows. */
export function TimelineStepper({ steps = [], activeIndex = 0 }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start" }}>
      {steps.map((s, i) => {
        const done = i < activeIndex, active = i === activeIndex;
        return (
          <React.Fragment key={i}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", minWidth: 64 }}>
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: "9999px", fontFamily: "var(--font-mono)", fontSize: "0.7rem", fontWeight: 700, color: done || active ? "#fff" : "var(--color-muted)", background: done || active ? "var(--color-brand-500)" : "transparent", boxShadow: done || active ? "none" : "inset 0 0 0 1px var(--color-border)" }}>
                {done ? <i className="ph ph-check-circle" /> : String(i + 1).padStart(2, "0")}
              </span>
              <span style={{ fontSize: "0.7rem", fontWeight: active ? 700 : 500, color: active ? "var(--color-ink)" : "var(--color-muted)", textAlign: "center" }}>{s}</span>
            </div>
            {i < steps.length - 1 && <span style={{ flex: 1, height: 2, marginTop: 13, background: i < activeIndex ? "var(--color-brand-500)" : "var(--color-border)" }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}
