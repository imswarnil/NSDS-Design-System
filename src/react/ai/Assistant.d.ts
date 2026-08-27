import * as React from "react";

export interface AssistantProps {
  /** The <ConversationRail>. Omit for the embedded, rail-less variant. */
  rail?: React.ReactNode;
  /** Controlled: the parent owns the collapse so a shortcut, a route change
   *  and the bar toggle can all drive it. Below 64rem the rail is an overlay
   *  and this is its open state. */
  railOpen?: boolean;
  /** docked — under the product navbar. embedded — in-page panel, no
   *  viewport lock; the surrounding page keeps its scroll. */
  variant?: "docked" | "embedded";
  className?: string;
  children?: React.ReactNode;
}
export declare function Assistant(props: AssistantProps): React.JSX.Element;

export interface AssistantBarProps {
  title: string;
  /** The course the conversation is anchored to — renders mono. */
  meta?: string;
  railOpen?: boolean;
  onToggleRail?: () => void;
  actions?: React.ReactNode;
}
export declare function AssistantBar(props: AssistantBarProps): React.JSX.Element;

/** The scroll region. Forwards a ref so the app can autoscroll only when the
 *  reader was already near the bottom. */
export declare const AssistantThread: React.ForwardRefExoticComponent<
  { children?: React.ReactNode } & React.RefAttributes<HTMLDivElement>
>;

export interface AssistantFootProps {
  children?: React.ReactNode;
  /** The standing disclaimer. It has a default and no way to hide it. */
  note?: string;
}
export declare function AssistantFoot(props: AssistantFootProps): React.JSX.Element;

export interface Conversation {
  id: string;
  title: string;
  /** The course it belongs to — the mono line above the question. */
  course?: string;
  when?: string;
  href?: string;
}
export interface ConversationGroup {
  /** "Today", "Earlier this week" — grouping is the caller's job. */
  label: string;
  items: Conversation[];
}
export interface ConversationRailProps {
  groups?: ConversationGroup[];
  activeId?: string;
  onSelect?: (id: string) => void;
  onNew?: () => void;
  brand?: string;
  quota?: { label: string; used: number; total: number; href?: string; cta?: string };
  /** Rendered when groups is empty — an honest empty state, not a skeleton. */
  empty?: React.ReactNode;
}
export declare function ConversationRail(props: ConversationRailProps): React.JSX.Element;

export interface TurnProps {
  role?: "user" | "agent";
  /** Initials for the student's avatar. */
  who?: string;
  time?: string;
  state?: "thinking" | "streaming" | "done" | "error";
  actions?: React.ReactNode;
  className?: string;
  children?: React.ReactNode;
}
export declare function Turn(props: TurnProps): React.JSX.Element;

export declare function TurnBody(props: { prose?: boolean; children?: React.ReactNode }): React.JSX.Element;

/** aria-live="polite". Name the stage — "Reading your progress", not
 *  "Thinking…". */
export declare function Thinking(props: { label?: string }): React.JSX.Element;

export declare function StreamCaret(): React.JSX.Element;

export declare function ToolCall(props: {
  label: string;
  state?: "running" | "done" | "failed";
  count?: number;
}): React.JSX.Element;

export declare function Trace(props: {
  steps?: { verb: string; text: string }[];
  open?: boolean;
  summary?: string;
}): React.JSX.Element;
