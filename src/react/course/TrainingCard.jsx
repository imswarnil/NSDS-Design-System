import React from "react";
/** A track in an overview grid — a peer among peers, so it is a card with no
 *  connector: nothing here claims one earns the next. That is what the
 *  connected module spine is for. Styling: .ns-trackcard in training.css. */
export function TrainingCard({ n, title, desc, icon = "ph-flag", lessons, duration, progress, href = "#", className = "", ...rest }) {
  return (
    <a className={["ns-trackcard", className].filter(Boolean).join(" ")} href={href} {...rest}>
      <span className="ns-trackcard__head">
        <span className="ns-trackcard__icon"><i className={`ph ${icon}`} aria-hidden="true" /></span>
        <span className="ns-trackcard__index">{String(n).padStart(2, "0")}</span>
      </span>
      <span className="ns-trackcard__title">{title}</span>
      <span className="ns-trackcard__text">{desc}</span>
      <span className="ns-trackcard__meta">
        {typeof lessons !== "undefined" && <span>{String(lessons).padStart(2, "0")} lessons</span>}
        {duration && <span>{duration}</span>}
      </span>
      {typeof progress === "number" && (
        <progress className="ns-progress" value={progress} max="100" aria-label={`${title} progress`} />
      )}
    </a>
  );
}
