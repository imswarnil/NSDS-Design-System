import React from "react";
/** Difficulty as a status badge — the dot carries the colour, the ink stays
 *  neutral. This is Badge with a fixed vocabulary rather than a second
 *  component: three levels, one of which is always true.
 *  Styling: .ns-badge in components/css/display.css. */
const LEVELS = {
  beginner: ["success", "Beginner"],
  intermediate: ["warning", "Intermediate"],
  advanced: ["default", "Advanced"],
};
export function LevelBadge({ level = "beginner", className = "", ...rest }) {
  const [variant, label] = LEVELS[level] || LEVELS.beginner;
  const classes = ["ns-badge", variant !== "default" && `ns-badge--${variant}`, className]
    .filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      <span className="ns-badge__dot" aria-hidden="true" />{label}
    </span>
  );
}
