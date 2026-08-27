import React from "react";

/* Namaste UI — the bespoke sprite icon.
   =========================================================================
   Renders one glyph from icons/namaste-icons.svg — the ~20
   LMS-specific symbols Phosphor has no word for (roadmap, org, Apex, flow,
   publish…). Same contract as a Phosphor glyph: 1em square, currentColor,
   baseline-aligned, so both sets mix in one button.

   Decorative by default (aria-hidden); pass `label` when the icon IS the
   meaning (an icon-only spot with no visible text). */
export function Icon({ name, label, size, spriteHref = "/icons/namaste-icons.svg", className = "" }) {
  const sizeCls = size === "sm" ? " ns-icon--sm" : size === "lg" ? " ns-icon--lg" : size === "xl" ? " ns-icon--xl" : "";
  return (
    <svg
      className={`ns-icon${sizeCls}${className ? ` ${className}` : ""}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <use href={`${spriteHref}#ns-i-${name}`} />
    </svg>
  );
}

/** The full glyph vocabulary — kept here so a picker or a docs page can
 *  enumerate the set without parsing the sprite. */
export const ICON_NAMES = [
  "course", "lesson-video", "lesson-reading", "lesson-quiz", "lesson-lab",
  "certificate", "roadmap", "module", "dashboard", "students", "instructor",
  "org", "apex", "flow", "data", "publish", "draft", "analytics",
  "progress-ring", "trailhead",
];
