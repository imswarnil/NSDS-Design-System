import React from "react";

/* Namaste UI — the lesson KIND, as one part rather than three copies.
   =========================================================================
   Every surface that lists lessons has to say what kind of thing each one is:
   the curriculum on the course page, the rail in the player, the popover on a
   phone. They were three separate spellings of the same idea, which is how the
   rail ended up showing icons while the curriculum still spelled out VIDEO
   twenty-four times.

   The rule, stated once here and rendered everywhere:

     The kind is an ICON. The WORD is deferred, not deleted — it stays in the
     DOM for assistive tech and returns as a tooltip on hover or keyboard
     focus. Twenty-four rows that each say VIDEO are twenty-four repeats of
     what the glyph already said, and they turn a curriculum into a
     spreadsheet.

   Pass `withLabel` for the one case that wants the word inline: a single
   lesson on a card, where there is no column of repeats to compress.

   Markup contract: templates/course-detail.html and
   templates/course-player.html render exactly this. */

/** glyph + word for every lesson kind the system knows. The keys ARE the
 *  .ns-ltype--* modifiers, so a kind with no colour rule cannot be invented
 *  by passing a string. */
export const LESSON_TYPES = {
  video: ["ph-video", "Video"],
  article: ["ph-article", "Article"],
  quiz: ["ph-exam", "Quiz"],
  lab: ["ph-flask", "Hands-on lab"],
  live: ["ph-video-camera", "Live session"],
};

/** Whether the row is open to you — a DIFFERENT question from what kind of
 *  thing it is, so it is a different chip and it never replaces the kind. */
export const LESSON_ACCESS = {
  free: ["ph-lock-simple-open", "Free"],
  members: ["ph-lock-simple", "Members"],
  soon: ["ph-clock", "Soon"],
};

export function LessonType({ kind = "article", withLabel = false, tooltipBelow = false, className = "" }) {
  const [icon, word] = LESSON_TYPES[kind] || LESSON_TYPES.article;

  if (withLabel) {
    return (
      <span className={["ns-ltype", `ns-ltype--${kind}`, className].filter(Boolean).join(" ")}>
        <i className={`ph ${icon}`} aria-hidden="true" />{word}
      </span>
    );
  }

  /* tabIndex on the host, not on the glyph: the tooltip has to be reachable
     by keyboard as well as by pointer, and a hover-only affordance is a
     mouse-only affordance.

     The tooltip opens ABOVE the glyph. Pass tooltipBelow for a row at the top
     of a scroll region — the first lesson in the rail — where "above" is
     outside the box and gets clipped. */
  return (
    <span
      className={["ns-ltype", "ns-ltype--icon", `ns-ltype--${kind}`, "ns-tooltip-host", className].filter(Boolean).join(" ")}
      tabIndex={0}
    >
      <i className={`ph ${icon}`} aria-hidden="true" />
      <span className={`ns-tooltip${tooltipBelow ? " ns-tooltip--below" : ""}`}>{word}</span>
    </span>
  );
}

/** The access chip. `label` overrides the word — "Sept 12" says more than
 *  "Soon" when the date is known. */
export function LessonAccess({ access, label, className = "" }) {
  const entry = LESSON_ACCESS[access];
  if (!entry) return null;
  const [icon, word] = entry;
  return (
    <span className={["ns-laccess", `ns-laccess--${access}`, className].filter(Boolean).join(" ")}>
      <i className={`ph ${icon}`} aria-hidden="true" />{label || word}
    </span>
  );
}
