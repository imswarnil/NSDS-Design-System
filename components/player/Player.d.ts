import * as React from "react";

export interface PlayerNav {
  prevHref?: string; nextHref?: string;
  onPrev?: () => void; onNext?: () => void;
}

/** The course-player screen. The video element is YOURS — pass a <video>, a
 *  YouTube iframe, a Mux player — so the design system is not chained to a
 *  video vendor. ←/→ move between lessons (space/k is left to the player). */
export declare function CoursePlayer(props: {
  /** The media element, filling a 16:9 stage on brand-900 in both themes. */
  stage: React.ReactNode;
  kicker?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode[];
  nav?: PlayerNav;
  progress?: { value: number; max: number };
  /** Usually a <LessonRail>. */
  rail?: React.ReactNode;
  /** Content under the header — notes/transcript tabs, prose. */
  children?: React.ReactNode;
}): React.JSX.Element;

export interface Lesson {
  href: string;
  title: string;
  duration?: string;
  done?: boolean;
  /** Members-only lesson ahead of the paywall. Stays a link (to upgradeHref
   *  when given) — a dead row explains nothing. */
  locked?: boolean;
  upgradeHref?: string;
}
export interface LessonSection { title: string; lessons: Lesson[] }

/** The curriculum rail. Scrolls the current lesson into view on mount. */
export declare function LessonRail(props: {
  courseTitle: React.ReactNode;
  done?: number;
  total?: number;
  sections?: LessonSection[];
  currentHref?: string;
  hrefFor?: (l: Lesson) => string;
  label?: string;
}): React.JSX.Element;
