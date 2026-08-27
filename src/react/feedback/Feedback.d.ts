import * as React from "react";

export type Tone = "info" | "success" | "warning" | "error";

/** Inline status: dot + mono word + colour third. Never colour alone. */
export declare function Status(props: { tone?: Tone; children?: React.ReactNode; className?: string }): React.JSX.Element;

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: Tone;
  title?: React.ReactNode;
  actions?: React.ReactNode;
  /** Override the tone's default Phosphor icon. */
  icon?: string;
}
/** Anything the user must ACT on belongs here rather than in a toast: it stays
 *  on screen, is keyboard-reachable, and sits next to what failed. */
export declare function Alert(props: AlertProps): React.JSX.Element;

export interface ToastOptions { tone?: Tone; duration?: number }
export interface ToastApi {
  /** Errors never auto-dismiss — a message that vanishes unread is worse than none. */
  toast: (message: React.ReactNode, options?: ToastOptions) => number;
  dismiss: (id: number) => void;
}
/** Mount once near the app root. The live region must exist before any message
 *  is inserted, or nothing is announced. */
export declare function ToastProvider(props: { children?: React.ReactNode; duration?: number }): React.JSX.Element;
export declare function useToast(): ToastApi;

export declare function Skeleton(props: {
  variant?: "text" | "title" | "card" | "avatar";
  count?: number;
  width?: string;
  className?: string;
  label?: string;
}): React.JSX.Element;

/** Under ~1s only. Longer waits should be a Skeleton — a spinner says nothing
 *  about what is arriving. */
export declare function Spinner(props: { size?: "lg"; label?: string; className?: string }): React.JSX.Element;

export interface EmptyStateProps {
  icon?: string;
  /** What is not here. */
  title: React.ReactNode;
  /** Why. If there is genuinely nothing to do, say so here. */
  description?: React.ReactNode;
  /** The one thing to do about it. */
  action?: React.ReactNode;
  className?: string;
}
export declare function EmptyState(props: EmptyStateProps): React.JSX.Element;

export declare function ErrorState(props: EmptyStateProps & { code?: React.ReactNode }): React.JSX.Element;
