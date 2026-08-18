import type { LessonKind, LessonAccessKind } from "./LessonType";

export interface CurriculumLesson {
  title: string;
  /** Decides the glyph and the tooltip word. Defaults to "article". The kind
   *  renders as an ICON — the word is deferred to hover/focus, never spelled
   *  out down every row. */
  type?: LessonKind;
  duration?: string;
  href?: string;
  done?: boolean;
  /** The lesson the reader is on — renders aria-current. */
  current?: boolean;
  /** Whether this row is open to you. "members" and "soon" dim the row, swap
   *  the duration for a lock, and add the state to the accessible name. The
   *  row stays a link either way. */
  access?: LessonAccessKind;
  /** Overrides the access chip's word — "Sept 12" beats "Soon". */
  accessLabel?: string;
  /** Where a locked row goes. Without it the row still links to href. */
  upgradeHref?: string;
  /** The row's badge. "Preview" gets the brand outline — in a locked
   *  curriculum it is the row that turns a browser into a learner; anything
   *  else renders quiet. */
  badge?: string;
}
export interface CurriculumSection {
  title: string;
  /** Right-hand summary, e.g. "32m". */
  duration?: string;
  /** Completion string, e.g. "2/3 done". */
  done?: string;
  /** Sections are open by default: a collapsed curriculum hides the one thing
   *  a prospective learner is trying to evaluate. Pass false to start closed. */
  open?: boolean;
  lessons?: CurriculumLesson[];
}
export interface CurriculumListProps {
  sections: CurriculumSection[];
  /** The bar above the sections, e.g. "5 sections · 24 lessons · 6h 20m". */
  totals?: string;
  className?: string;
}
