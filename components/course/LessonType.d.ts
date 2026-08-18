import * as React from "react";

/** The lesson kinds the system has a glyph and a colour rule for. The keys are
 *  the .ns-ltype--* modifiers, so an unknown kind cannot be invented. */
export type LessonKind = "video" | "article" | "quiz" | "lab" | "live";
/** Whether the row is open to you — a different question from what kind of
 *  thing it is, and never a replacement for it. */
export type LessonAccessKind = "free" | "members" | "soon";

export declare const LESSON_TYPES: Record<LessonKind, [icon: string, word: string]>;
export declare const LESSON_ACCESS: Record<LessonAccessKind, [icon: string, word: string]>;

/** The kind, as an icon with the word deferred to a tooltip. This is the
 *  default in every dense surface — a rail, a curriculum row, a card's lesson
 *  peek — because repeating the word down forty rows repeats what the glyph
 *  already said. The word stays in the DOM for assistive tech. */
export declare function LessonType(props: {
  kind?: LessonKind;
  /** Render the word inline instead. For a SINGLE lesson on a card, where
   *  there is no column of repeats to compress. */
  withLabel?: boolean;
  /** Open the tooltip below the glyph rather than above it. For the first row
   *  of a scroll region, where "above" is outside the box and gets clipped. */
  tooltipBelow?: boolean;
  className?: string;
}): React.JSX.Element;

/** The access chip. Returns null for an unknown access, so a row with nothing
 *  to say about access renders nothing rather than an empty chip. */
export declare function LessonAccess(props: {
  access?: LessonAccessKind;
  /** Overrides the word — "Sept 12" says more than "Soon" when the date is
   *  known. */
  label?: React.ReactNode;
  className?: string;
}): React.JSX.Element | null;
