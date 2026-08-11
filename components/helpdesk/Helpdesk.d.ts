import * as React from "react";

export type TicketStatusValue = "open" | "in-progress" | "waiting" | "resolved" | "closed";
export type TicketPriority = "low" | "normal" | "high" | "urgent";

export declare function TicketStatus(props: { status: TicketStatusValue }): React.JSX.Element;

export interface Ticket {
  id: string | number;
  subject: string;
  excerpt?: string;
  status: TicketStatusValue;
  priority?: TicketPriority;
  updatedAt?: string;
  /** Human form of updatedAt ("2d ago"); updatedAt still carries the real datetime. */
  updatedLabel?: string;
}
export declare function TicketList(props: {
  tickets?: Ticket[];
  hrefFor?: (t: Ticket) => string;
  emptyAction?: React.ReactNode;
}): React.JSX.Element;

export interface TicketMessage {
  id?: string | number;
  author: string;
  /** "agent" gets the brand leading edge, "note" the warning edge — and both
   *  say what they are in the head row, because color is never the message. */
  role?: "reporter" | "agent" | "note";
  at?: string;
  atLabel?: string;
  body: React.ReactNode;
}
export declare function TicketThread(props: { messages?: TicketMessage[] }): React.JSX.Element;

export interface TicketFormProps {
  onSubmit?: (v: { subject: string; category: string; priority: TicketPriority; body: string; file: File | null; context?: string }) => void;
  categories?: Array<{ value: string; label: string }>;
  /** Pre-filled provenance (course/lesson the reporter came from). Tickets
   *  missing this cost a support round-trip every time. */
  context?: string;
  busy?: boolean;
  error?: React.ReactNode;
}
export declare function TicketForm(props: TicketFormProps): React.JSX.Element;

export declare function HelpHub(props: {
  onSearch?: (query: string) => void;
  cards?: Array<{ icon: string; title: string; text: string; href: string }>;
}): React.JSX.Element;
