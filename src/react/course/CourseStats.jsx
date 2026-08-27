import React from "react";
/** A metrics readout, not a marketing counter. Renders .ns-statband from
 *  components/css/sections.css.
 *
 *  A <dl>: each cell is a value and its label, and that pairing is what a
 *  definition list is for — a row of <div>s says nothing about the relationship. */
export function CourseStats({ stats = [], className = "", ...rest }) {
  return (
    <dl className={["ns-statband", className].filter(Boolean).join(" ")} {...rest}>
      {stats.map((s, i) => (
        <div className="ns-statband__cell" key={i}>
          <dd className="ns-statband__value">{s.value}</dd>
          <dt className="ns-statband__label">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}
