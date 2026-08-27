import * as React from "react";

export interface AuthBrand { name: string; logo?: string }
export interface AuthAside { kicker?: string; title: React.ReactNode; text?: React.ReactNode }

/** The auth page shell. Pass `aside` for the split layout with the navy brand
 *  band (collapses away below lg); omit it for the plain centered card. */
export declare function AuthLayout(props: {
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  sub?: React.ReactNode;
  aside?: AuthAside;
  brand?: AuthBrand;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}): React.JSX.Element;

export interface LoginFormProps {
  onSubmit?: (v: { email: string; password: string; remember: boolean }) => void;
  /** Adds the passwordless alternative under an "or" divider — as a quiet
   *  button, keeping exactly one primary action on the screen. */
  onMagicLink?: (email: string) => void;
  forgotHref?: string;
  /** Form-level failure. Never says WHICH of email/password was wrong —
   *  that would confirm account existence to whoever is guessing. */
  error?: React.ReactNode;
  busy?: boolean;
}
export declare function LoginForm(props: LoginFormProps): React.JSX.Element;

export interface PasswordRule { label: string; test: (password: string) => boolean }
export declare function SignupForm(props: {
  onSubmit?: (v: { email: string; password: string }) => void;
  error?: React.ReactNode;
  busy?: boolean;
  /** Live rule list instead of a strength bar — "add a number" is actionable,
   *  a yellow bar is a mood. */
  rules?: PasswordRule[];
}): React.JSX.Element;

/** After submit the form is replaced by a sent-confirmation that reads the
 *  same whether or not the account exists (no enumeration oracle). */
export declare function ForgotPasswordForm(props: {
  onSubmit?: (v: { email: string }) => void;
  busy?: boolean;
}): React.JSX.Element;

export declare function ResetPasswordForm(props: {
  onSubmit?: (v: { password: string }) => void;
  error?: React.ReactNode;
  busy?: boolean;
}): React.JSX.Element;
