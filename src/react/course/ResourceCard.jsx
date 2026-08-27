import React from "react";
/** A downloadable or external resource. The TYPE is a word (PDF, XLSX, TOOL),
 *  not an icon alone — a reader deciding whether to click needs to know what
 *  lands on their machine. Styling: .ns-resource in components/css/catalog.css. */
export function ResourceCard({ title, type = "PDF", icon = "ph-file-text", href = "#", className = "", ...rest }) {
  return (
    <a className={["ns-resource", className].filter(Boolean).join(" ")} href={href} {...rest}>
      <span className="ns-resource__icon"><i className={`ph ${icon}`} aria-hidden="true" /></span>
      <span className="ns-resource__body">
        <span className="ns-resource__title">{title}</span>
        <span className="ns-resource__type">{type}</span>
      </span>
      <i className="ph ph-arrow-up-right ns-resource__cue" aria-hidden="true" />
    </a>
  );
}
