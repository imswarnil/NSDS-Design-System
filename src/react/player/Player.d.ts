import * as React from "react";
import type { LessonKind, LessonAccessKind } from "../course/LessonType";

export interface PlayerNav {
  prevHref?: string; nextHref?: string;
  onPrev?: () => void; onNext?: () => void;
  /** Prev/next by NAME. An arrow pair with no titles makes the learner click
   *  to find out where they are going. */
  prevTitle?: React.ReactNode; nextTitle?: React.ReactNode;
  /** A still for each, where the lesson has one. */
  prevThumb?: string; nextThumb?: string;
  /** Falls back to the lesson's kind glyph where there is no still — never an
   *  empty box. */
  prevKind?: LessonKind; nextKind?: LessonKind;
  /** A locked next lesson still navigates — to the upgrade page. A dead button
   *  at the end of a lesson explains nothing. */
  prevLocked?: boolean; nextLocked?: boolean;
  /** This lesson's position. Used to DERIVE the number on each control —
   *  index-1 on prev, index+1 on next — because the lesson either side of this
   *  one is the lesson either side of this one. Override either with
   *  prevIndex / nextIndex where the course does not number sequentially. */
  index?: number;
  prevIndex?: number; nextIndex?: number;
}

export interface TocItem { id: string; label: React.ReactNode; level?: 2 | 3 }

/** The course-player screen. The video element is YOURS — pass a <video>, a
 *  YouTube iframe, the system's own .ns-vplayer — so the design system is not
 *  chained to a video vendor. ←/→ move between lessons (space/k is left to the
 *  player).
 *
 *  This is the React half of templates/course-player.html and
 *  templates/course-player-article.html. Change one and change the other. */
export declare function CoursePlayer(props: {
  /** "video" keeps the 16:9 stage; "article" drops it. Everything else — the
   *  curriculum rail on the left, the content grid, the page rail on the
   *  right, the docked bar — is the same on both, on purpose: a learner moving
   *  from lesson 7 to lesson 8 should not have to find the controls again. */
  variant?: "video" | "article";
  /** The media element, filling a 16:9 stage on brand-900 in both themes. */
  stage?: React.ReactNode;
  /** Set when `stage` is a full player with its own control bar. The 16:9 box
   *  moves down to it, because a bar nailed inside a box that is already
   *  exactly 16:9 either covers the last inch of the picture or overflows. */
  stageWired?: boolean;
  /** Renders the button that reopens a collapsed rail, pinned at the leading
   *  edge of the lesson column and shown only while data-rail="collapsed".
   *  Pair it with LessonRail's onToggle. */
  onRailToggle?: () => void;
  /** Where this lesson sits — usually a <Breadcrumb>. Rendered inside the
   *  scrolling column, so it scrolls away with the content; the standing way
   *  back is LessonRail's courseHref, which never moves. */
  breadcrumb?: React.ReactNode;
  /** The lesson kind, rendered as the icon in front of the kicker. */
  kind?: LessonKind;
  kicker?: React.ReactNode;
  title: React.ReactNode;
  meta?: React.ReactNode[];
  nav?: PlayerNav;
  /** The lesson's detail tabs — chapters, transcript, resources, notes, Q&A.
   *  Usually a <Tabs> from components/navigation. Stacked instead of tabbed,
   *  these push the next-lesson control below three screens of scroll. */
  details?: React.ReactNode;
  /** The lesson's outline, rendered as the sticky page rail beside the content
   *  and as the horizontal strip above it below lg. */
  tocItems?: TocItem[];
  activeTocId?: string;
  onTocNavigate?: (id: string) => void;
  /** variant="article": selector for the reading hairline, e.g. "#lesson-body".
   *  Also becomes the article element's id. */
  readingProgressTarget?: string;
  /** What closes the lesson — the "what you learned" summary, the glossary,
   *  the in-lesson sponsor. Rendered inside the article but OUTSIDE .ns-prose,
   *  which styles bare ul/dt/dd and would put square markers down a checklist
   *  and a rule down a glossary. */
  appendix?: React.ReactNode;
  /** The chapter list for a VIDEO lesson — the page rail's version of the
   *  outline. Server-render it (it is content: readable and indexable without
   *  pressing play) and point the player's data-chapters at it. */
  chapters?: React.ReactNode;
  /** What sits UNDER the list in the page rail — a <SponsorSlot>, a related
   *  link. Sticky with it, and it survives below lg where the outline itself
   *  is replaced by the horizontal strip. */
  aside?: React.ReactNode;
  /** Usually a <LessonRail>. */
  rail?: React.ReactNode;
  /** The lesson's own words: the prose on a written lesson, the description
   *  under the frame on a video one. Both are wrapped in .ns-prose. */
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element;

export interface Lesson {
  href: string;
  title: string;
  duration?: string;
  /** Decides the glyph and the tooltip word. The kind is an ICON — the word is
   *  deferred to hover/focus, never spelled out down forty rows. */
  type?: LessonKind;
  done?: boolean;
  /** Whether the row is open to you. "members" and "soon" dim it, swap the
   *  duration for a lock, and add the state to the accessible name. The row
   *  stays a link either way — a dead row explains nothing. */
  access?: LessonAccessKind;
  upgradeHref?: string;
}
export interface LessonSection { title: string; lessons: Lesson[] }

/** The curriculum rail. Scrolls the current lesson into view on mount.
 *
 *  Pass `lessons`: a course is a FLAT list of eight to fourteen, and wrapping
 *  that in one collapsible section is a disclosure control that discloses
 *  everything. `sections` remains for training modules, which genuinely have
 *  them. */
export declare function LessonRail(props: {
  courseTitle: React.ReactNode;
  /** Makes the course name a link back to the course, with the arrow that says
   *  so — the rail's standing way out. Omit it and the name is plain text
   *  rather than a dead link. */
  courseHref?: string;
  done?: number;
  total?: number;
  lessons?: Lesson[];
  sections?: LessonSection[];
  currentHref?: string;
  hrefFor?: (l: Lesson) => string;
  /** The foot: what you do WITH the lesson rather than where you go next —
   *  share it, ask an AI about it. Secondary by definition, because the
   *  primary action on this screen is "next lesson" and it is docked at the
   *  foot of the content. Progress does NOT go here: it is the full-width line
   *  on the course bar, and saying it twice on one screen is saying it once
   *  too often. */
  foot?: React.ReactNode;
  /** Renders the collapse button in the rail's head. Pair it with
   *  CoursePlayer's onRailToggle, which renders the button that brings the
   *  rail back — the two are halves of one switch. */
  onToggle?: () => void;
  /** A filter over the lesson titles, in the rail's own head. For the
   *  forty-lesson course, where scrolling to find "the one about governor
   *  limits" is the rail's whole problem. Filtering happens here, so every
   *  consumer does not write the same lowercase-includes. */
  search?: boolean;
  searchPlaceholder?: string;
  label?: string;
  /** Load-bearing: the course bar's curriculum toggle points aria-controls
   *  here. Change it in both places or neither. */
  id?: string;
}): React.JSX.Element;

/** The phone counterpart of the rail: a docked bar plus the lesson list in a
 *  popover. Declarative — no open/close state, and the stylesheet hides it
 *  above lg where the rail is already on screen. */
export declare function LessonPanelBar(props: {
  courseTitle: React.ReactNode;
  /** e.g. "Lesson 07 of 12". */
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  /** 0–100, drawn as the hairline along the bar's own top edge — so the
   *  progress costs no extra height. */
  percent?: number;
  done?: number;
  total?: number;
  lessons?: Lesson[];
  currentHref?: string;
  hrefFor?: (l: Lesson) => string;
  cta?: { label: React.ReactNode; href?: string };
  /** Below lg this panel is the ONLY lesson list — the rail is display:none —
   *  so it carries the filter too. A forty-lesson course does not get easier
   *  to scan because the viewport got smaller. */
  search?: boolean;
  searchPlaceholder?: string;
  /** Must match the button's popovertarget, and the id the course bar's
   *  curriculum toggle falls back to below lg. Defaults to "lesson-drawer". */
  id?: string;
}): React.JSX.Element;
