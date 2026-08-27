import * as React from "react";
import type { Sponsor, SponsorShape } from "./Sponsor";

type SponsorProps = Parameters<typeof Sponsor>[0];

/** None of these belongs INSIDE .ns-prose: prose styles bare ul / dt / dd, so
 *  a checklist nested in it grows square markers and a glossary grows a rule
 *  down its left edge. Pass them as CoursePlayer's `appendix`, or place them
 *  as siblings of the prose block. */

export interface LessonObjective {
  text: React.ReactNode;
  /** Phosphor class, e.g. "ph-lightning". Defaults to "ph-check". An icon per
   *  outcome beats a column of identical ticks: five ticks is a list that has
   *  to be read, five glyphs is one that can be scanned. */
  icon?: string;
}

/** What this lesson is for, at the top. Promises, so they take the outcome
 *  list's success ticks. */
export declare function LessonObjectives(props: {
  title?: React.ReactNode;
  items?: (LessonObjective | string)[];
  id?: string;
}): React.JSX.Element | null;

/** What you just learned, at the bottom. A checklist, NOT the objectives list
 *  moved — a tick that means "achieved" should not look like one that means
 *  "promised". */
export declare function LessonSummary(props: {
  title?: React.ReactNode;
  items?: React.ReactNode[];
  id?: string;
}): React.JSX.Element | null;

export interface GlossaryTerm { term: React.ReactNode; definition: React.ReactNode }

/** The words the lesson used as if you already knew them. At the END: before
 *  the text it is a vocabulary test, after it a reference. */
export declare function LessonGlossary(props: {
  title?: React.ReactNode;
  terms?: GlossaryTerm[];
  id?: string;
}): React.JSX.Element | null;

/** The one thing to remember. Safe inside prose — it styles nothing prose
 *  also styles. */
export declare function LessonTakeaway(props: {
  label?: React.ReactNode;
  children?: React.ReactNode;
}): React.JSX.Element;

export interface LessonResource {
  title: React.ReactNode;
  /** What it is and what it costs to open, e.g. "PDF · 2 pages". */
  meta?: React.ReactNode;
  href?: string;
  /** Phosphor class. Defaults to "ph-file-text". */
  icon?: string;
  /** Swaps the download cue for an open-out arrow. */
  external?: boolean;
}

export declare function LessonResources(props: {
  title?: React.ReactNode;
  items?: LessonResource[];
  id?: string;
}): React.JSX.Element | null;

/** A paid slot inside the lesson — the Sponsor card in its --article shape,
 *  which is deliberately not a card. ONE per lesson, and never above the fold:
 *  a learner who paid for the course is not the audience for a second sale.
 *  Takes every Sponsor prop. */
export declare function LessonAd(props: Omit<SponsorProps, "shape">): React.JSX.Element;

/** The rail's version, under the page rail's list and sticky with it.
 *  --skyscraper by default; pass shape="square" for a short rail. */
export declare function SponsorSlot(props: SponsorProps): React.JSX.Element;
