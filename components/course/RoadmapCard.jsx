import React from "react";
/** A stop on a roadmap. Related to the Training module but not the same: a
 *  module belongs to one track's spine, a roadmap stop is a milestone on a
 *  longer journey and alternates sides on wide screens.
 *  Styling: .ns-roadmap in components/css/training.css. */
export function RoadmapCard({ n, title, desc, icon = "ph-flag", duration, lessons, side = "start", href = "#", className = "", ...rest }) {
  const wrap = ["ns-roadmap", side === "end" && "ns-roadmap--end", className].filter(Boolean).join(" ");
  return (
    <div className={wrap} {...rest}>
      <a className="ns-roadmap__card" href={href}>
        <span className="ns-roadmap__rail">
          <span className="ns-roadmap__index">{String(n).padStart(2, "0")}</span>
          <span className="ns-roadmap__icon"><i className={`ph ${icon}`} aria-hidden="true" /></span>
        </span>
        <span className="ns-roadmap__body">
          <span className="ns-roadmap__title">{title}</span>
          <span className="ns-roadmap__text">{desc}</span>
          <span className="ns-roadmap__meta">
            {typeof lessons !== "undefined" && <span>{String(lessons).padStart(2, "0")} lessons</span>}
            {duration && <span>{duration}</span>}
          </span>
        </span>
      </a>
    </div>
  );
}
