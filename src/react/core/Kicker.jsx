import React from "react";
/* Principle: kickers render as a code comment, not a pastel eyebrow pill —
   the theme's own content is full of Apex/SOQL comments, so this borrows that
   voice for section labels instead of inventing a decorative motif.

   The "// " is a ::before in components/css/sections.css, not markup: it is
   punctuation, so it must not land in the accessible name or the clipboard. */
export function Kicker({ children, align = "left", light = false, className = "", ...rest }) {
  const classes = [
    "ns-kicker",
    align === "center" && "ns-kicker--center",
    light && "ns-kicker--light",
    className,
  ].filter(Boolean).join(" ");
  return <span className={classes} {...rest}>{children}</span>;
}
