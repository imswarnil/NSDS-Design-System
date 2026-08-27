import React from "react";

/* Namaste UI — progress and tabular data.
   =========================================================================
   "How far through this course am I" is the question the LMS exists to
   answer, so progress is a real primitive rather than a div-with-a-width on
   each screen that needs it. */

/** Course/lesson completion.
 *
 *  Native <progress>, so the value reaches assistive tech with no ARIA at all.
 *  The percentage is ALSO rendered as mono text, because a bar encodes the
 *  value only as length — unreadable at 6px tall and invisible to anyone not
 *  seeing it. */
export function ProgressBar({ value, max = 100, label, showValue = true, size, className = "" }) {
  const complete = value >= max;
  const pct = Math.round((value / max) * 100);
  return (
    <div className={`ns-progress-row ${className}`.trim()}>
      <progress
        className={["ns-progress", size === "lg" && "ns-progress--lg", complete && "ns-progress--complete"].filter(Boolean).join(" ")}
        value={value}
        max={max}
        /* The bar's accessible name. Without it a screen reader announces a
           bare percentage with no idea what it measures. */
        aria-label={label ?? `${pct}% complete`}
      />
      {showValue && <span className="ns-progress-row__value">{pct}%</span>}
    </div>
  );
}

/** Discrete lesson ticks — "lesson 3 of 12" — for a curriculum, where the
 *  unit is a lesson rather than a percentage.
 *
 *  The ticks are aria-hidden and the count is carried by one visually-hidden
 *  sentence: twelve list items announced individually would be far worse than
 *  useless. */
export function Steps({ total, current, className = "" }) {
  return (
    <div className={className}>
      <span className="ns-visually-hidden">Lesson {current} of {total}</span>
      <ol className="ns-steps" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <li
            key={i}
            className="ns-steps__tick"
            data-state={i + 1 < current ? "done" : i + 1 === current ? "current" : "todo"}
          />
        ))}
      </ol>
    </div>
  );
}

/** Score against a threshold — a quiz result, code coverage.
 *
 *  <meter>, not <progress>: meter carries low/high/optimum semantics, and the
 *  two are not interchangeable. Progress answers "how far along", meter
 *  answers "how good". Swapping them makes the announcement wrong. */
export function ScoreMeter({ value, max = 100, low, high, optimum = 100, label, className = "" }) {
  return (
    <div className={`ns-progress-row ${className}`.trim()}>
      <meter
        className="ns-meter"
        value={value} max={max} low={low ?? max * 0.5} high={high ?? max * 0.8} optimum={optimum}
        aria-label={label ?? `Score ${value} out of ${max}`}
      />
      <span className="ns-progress-row__value">{value}/{max}</span>
    </div>
  );
}

/** Tabular data.
 *
 *  The wrapper is not optional and not decorative: it is what makes a wide
 *  table scroll inside itself instead of pushing the whole page sideways on a
 *  phone. Once it scrolls it must also be keyboard-reachable, hence
 *  tabIndex={0} — a scroll region a keyboard user cannot reach is a section of
 *  the table they cannot read. */
export function DataTable({ columns = [], rows = [], caption, sticky, sort, onSort, className = "" }) {
  return (
    <div className={`ns-table-wrap ${className}`.trim()} tabIndex={0} role="region" aria-label={caption}>
      <table className={`ns-table ${sticky ? "ns-table--sticky" : ""}`.trim()}>
        {caption && <caption>{caption}</caption>}
        <thead>
          <tr>
            {columns.map((col) => {
              const active = sort?.key === col.key;
              return (
                <th
                  key={col.key}
                  scope="col"
                  className={col.numeric ? "ns-table__num" : undefined}
                  /* aria-sort belongs on the <th>, not the button — it
                     describes the column, and it is what gets announced. */
                  aria-sort={col.sortable ? (active ? sort.direction : "none") : undefined}
                >
                  {col.sortable
                    ? (
                      <button
                        type="button"
                        className="ns-table__sort"
                        onClick={() => onSort?.(col.key, active && sort.direction === "ascending" ? "descending" : "ascending")}
                      >
                        {col.label}
                      </button>
                    )
                    : col.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.key ?? i}>
              {columns.map((col) => (
                <td key={col.key} className={col.numeric ? "ns-table__num" : undefined}>
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
