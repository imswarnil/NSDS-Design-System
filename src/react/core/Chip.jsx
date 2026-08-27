import React from "react";
/** Icon tile — sharp radius, hairline border, quiet tint. No soft glow.
 *  Styling lives in components/css/display.css as .ns-chip; templates/chip.html
 *  is the Handlebars-side equivalent. */
export function Chip({ icon, variant = "brand", size = "md", className = "", ...rest }) {
  const classes = [
    "ns-chip",
    variant !== "brand" && `ns-chip--${variant}`,
    size !== "md" && `ns-chip--${size}`,
    className,
  ].filter(Boolean).join(" ");
  return (
    <span className={classes} {...rest}>
      <i className={`ph ${icon}`} aria-hidden="true" />
    </span>
  );
}
