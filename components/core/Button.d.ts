import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** primary = the ONE solid-fill action per screen. outline = the default
   *  secondary. quiet = lowest emphasis, for "Cancel" beside a confirm.
   *  white / ghost = for dark hero surfaces only; they are invisible on a
   *  light background, which is intentional. danger = destructive, an outline
   *  so it does not compete with primary. danger-solid = ONLY the confirm
   *  button inside a delete dialog, where it is that screen's primary action.
   *  accent = deprecated alias of the brand ramp. */
  variant?: "primary" | "outline" | "quiet" | "white" | "ghost" | "danger" | "danger-solid" | "accent";
  size?: "sm" | "md" | "lg";
  /** Phosphor icon class, e.g. "ph-arrow-right". With no children this becomes
   *  an icon-only button — supply aria-label, or it announces as just "button". */
  icon?: string;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  /** Dims the label and shows a spinner without removing it, so the button
   *  keeps its width and its accessible name during a submit. */
  loading?: boolean;
  block?: boolean;
  /** Render as another element, e.g. "a" for a link styled as a button. */
  as?: React.ElementType;
  className?: string;
  children?: React.ReactNode;
}
export declare function Button(props: ButtonProps): React.JSX.Element;
