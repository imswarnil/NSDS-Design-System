import React from "react";
/* Principle 3: status reads as a bordered mono tag with a DOT, not a solid
   pastel-tint pill — the same information told through a status dot + mono
   text instead of a background wash, so a row of badges reads like a status
   line in a build log rather than a row of marketing chips.

   Styling lives in components/css/display.css as .ns-badge, so the Ghost
   theme renders the identical badge from templates/badge.html. */
export function Badge({ children, variant = "default", icon, dot = true, className = "", ...rest }) {
  const classes = ["ns-badge", variant !== "default" && `ns-badge--${variant}`, className]
    .filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      {icon
        ? <i className={`ph ${icon} ns-badge__icon`} aria-hidden="true" />
        : dot && <span className="ns-badge__dot" aria-hidden="true" />}
      {children}
    </span>
  );
}
