export interface CurriculumLesson {
  title: string;
  /** Decides the glyph and the type label. Defaults to "article". */
  type?: "video" | "article" | "quiz" | "exercise";
  duration?: string;
  href?: string;
  done?: boolean;
  /** The lesson the reader is on — renders aria-current. */
  current?: boolean;
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
