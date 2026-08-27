import * as React from "react";
import type { CourseCardProps } from "../course/CourseCard";

export declare function Attachments(props: {
  /** Says WHY these objects are attached, not just that they are. */
  label?: string;
  single?: boolean;
  children?: React.ReactNode;
}): React.JSX.Element;

/** Delegates to the real CourseCard — a course in chat and the same course on
 *  the catalog page are one component. */
export declare function CourseAttachment(props: {
  courses?: CourseCardProps[];
  label?: string;
}): React.JSX.Element;

export declare function Snippet(props: {
  title: string;
  kicker?: string;
  description?: string;
  image?: string;
  host?: string;
  meta?: string;
  href?: string;
}): React.JSX.Element;

export declare function AnswerImage(props: {
  src: string;
  alt: string;
  caption: string;
  /** Badges the caption. An unlabelled generated diagram is one a student
   *  will cite in an exam. */
  generated?: boolean;
}): React.JSX.Element;

export interface PathStep {
  name: string;
  sub?: string;
  when?: string;
  /** Marked done rather than dropped — seeing what you finished is half the
   *  motivation. Renders data-state="done", so it is never color alone. */
  done?: boolean;
  href?: string;
}
export declare function LearningPath(props: {
  title: string;
  meta?: string;
  steps?: PathStep[];
  onSave?: () => void;
  saveLabel?: string;
  footMeta?: string;
  children?: React.ReactNode;
}): React.JSX.Element;

export declare function Sources(props: {
  label?: string;
  items?: { title: string; href?: string; external?: boolean }[];
}): React.JSX.Element;

export declare function PracticeCheck(props: {
  /** Radio group name — must be unique per check on the page. */
  name: string;
  question: React.ReactNode;
  options?: string[];
  kicker?: string;
  onCheck?: () => void;
  onSkip?: () => void;
}): React.JSX.Element;

export declare function AnswerError(props: {
  /** error — something broke. limit — a quota, fixed by waiting or upgrading,
   *  not by retrying. offline — nothing is wrong with the answer. */
  variant?: "error" | "limit" | "offline";
  icon?: string;
  title: string;
  /** Always say what happened to the input. */
  text?: string;
  /** Mono technical detail — the string a student pastes into a ticket. */
  code?: string;
  children?: React.ReactNode;
}): React.JSX.Element;

export declare function SignInGate(props: {
  title?: string;
  /** The reason for the account, stated before the field. */
  text?: string;
  benefits?: string[];
  children?: React.ReactNode;
  fine?: string;
}): React.JSX.Element;
