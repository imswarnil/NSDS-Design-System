import React from "react";
import { Field, Input, Checkbox } from "../forms/Form.jsx";

/* Namaste UI — authentication for the Next.js LMS.
   =========================================================================
   Ghost's side of auth is the magic-link partials in ghost/partials/ns/
   (signin-form.hbs and signup via the subscribe form — Ghost is passwordless,
   so there is no "forgot password" page there at all). These components are
   the Next.js side, where real accounts with passwords may exist, and they
   render the same .ns-auth classes so both products' auth screens are one
   room.

   All of them are controlled forms in the parent's hands: this layer does the
   layout, labels, ARIA wiring and the one-primary-button discipline; the
   product does the actual authentication. */

/** The page shell. `aside` (title/text) switches on the split layout with the
 *  navy brand band; omit it for the plain centered card. */
export function AuthLayout({ kicker, title, sub, aside, brand, children, footer }) {
  const card = (
    <div className="ns-auth__card">
      {brand && (
        <div className="ns-auth__brand">
          {brand.logo && <img src={brand.logo} alt="" />}
          <strong>{brand.name}</strong>
        </div>
      )}
      {kicker && <p className="ns-auth__kicker">{kicker}</p>}
      {/* The h1: an auth page has exactly one job, and this names it. */}
      {title && <h1 className="ns-auth__title">{title}</h1>}
      {sub && <p className="ns-auth__sub">{sub}</p>}
      {children}
      {footer && <p className="ns-auth__alt">{footer}</p>}
    </div>
  );

  if (!aside) return <div className="ns-auth">{card}</div>;
  return (
    <div className="ns-auth ns-auth--split">
      <aside className="ns-auth__aside">
        <p className="ns-auth__kicker">{aside.kicker ?? "namaste salesforce"}</p>
        <h2>{aside.title}</h2>
        {aside.text && <p>{aside.text}</p>}
      </aside>
      <div className="ns-auth__pane">{card}</div>
    </div>
  );
}

/** Email + password sign-in. `onMagicLink` adds the passwordless alternative
 *  under an "or" divider — as a QUIET button, so the screen keeps exactly one
 *  primary action. */
export function LoginForm({ onSubmit, onMagicLink, forgotHref = "/forgot-password", error, busy }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [remember, setRemember] = React.useState(true);

  return (
    <form
      className="ns-auth__form"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ email, password, remember }); }}
    >
      {/* The failure is announced once, at form level, ABOVE the fields —
          "wrong password" must never say which of the two was wrong; that
          would confirm the account exists to whoever is guessing. */}
      {error && (
        <p className="ns-field__error" role="alert">{error}</p>
      )}
      <Field label="Email address">
        <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Password">
        {/* autoComplete="current-password" is what lets a password manager
            fill this — its absence is the #1 auth-form usability bug. */}
        <Input type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <div className="ns-auth__meta">
        <Checkbox label="Remember me" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
        <a href={forgotHref}>Forgot password?</a>
      </div>
      <button type="submit" className="ns-btn ns-btn--primary ns-btn--block" data-loading={busy || undefined}>
        Sign in
      </button>
      {onMagicLink && (
        <>
          <div className="ns-auth__divider" aria-hidden="true">or</div>
          <button type="button" className="ns-btn ns-btn--outline ns-btn--block" onClick={() => onMagicLink(email)}>
            Email me a sign-in link
          </button>
        </>
      )}
    </form>
  );
}

/** Sign-up. Deliberately minimal — email + password only. Every extra field
 *  on a signup form costs completions; ask for the name after the account
 *  exists, not before. */
export function SignupForm({ onSubmit, error, busy, rules }) {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  return (
    <form
      className="ns-auth__form"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ email, password }); }}
    >
      {error && <p className="ns-field__error" role="alert">{error}</p>}
      <Field label="Email address">
        <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <Field label="Password" help={!rules ? "At least 8 characters." : undefined}>
        {/* new-password, not current-password: this is what tells the password
            manager to OFFER a generated password instead of filling an old one. */}
        <Input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      {/* Live rule list, not a strength bar: "add a number" is actionable,
          a yellow bar is a mood. Announced politely as rules pass. */}
      {rules && (
        <ul className="ns-auth__rules" role="status" aria-live="polite">
          {rules.map((r) => (
            <li key={r.label}>
              <span className={`ns-status ${r.test(password) ? "ns-status--success" : "ns-status--idle"}`}>{r.label}</span>
            </li>
          ))}
        </ul>
      )}
      <button type="submit" className="ns-btn ns-btn--primary ns-btn--block" data-loading={busy || undefined}>
        Create account
      </button>
    </form>
  );
}

/** Forgot password. One field, and after submit the form is REPLACED by the
 *  sent-confirmation — the address echoed back in mono so the user can catch
 *  their own typo. The confirmation reads the same whether or not the account
 *  exists; anything else is an account-enumeration oracle. */
export function ForgotPasswordForm({ onSubmit, busy }) {
  const [email, setEmail] = React.useState("");
  const [sent, setSent] = React.useState(false);

  if (sent) {
    return (
      <div className="ns-auth__sent" role="status">
        <p className="ns-auth__sent-title">
          <i className="ph ph-check-circle" aria-hidden="true" /> Check your inbox
        </p>
        <p>If an account exists for <code>{email}</code>, a reset link is on its way. It expires in one hour.</p>
        <p><button type="button" className="ns-btn ns-btn--quiet ns-btn--sm" onClick={() => setSent(false)}>Use a different address</button></p>
      </div>
    );
  }

  return (
    <form
      className="ns-auth__form"
      onSubmit={(e) => { e.preventDefault(); onSubmit?.({ email }); setSent(true); }}
    >
      <Field label="Email address" help="We will send a link to reset your password.">
        <Input type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <button type="submit" className="ns-btn ns-btn--primary ns-btn--block" data-loading={busy || undefined}>
        Send reset link
      </button>
    </form>
  );
}

/** The other half of the loop — the page the emailed link lands on. */
export function ResetPasswordForm({ onSubmit, error, busy }) {
  const [password, setPassword] = React.useState("");
  const [confirm, setConfirm] = React.useState("");
  const mismatch = confirm.length > 0 && password !== confirm;

  return (
    <form
      className="ns-auth__form"
      onSubmit={(e) => { e.preventDefault(); if (!mismatch) onSubmit?.({ password }); }}
    >
      {error && <p className="ns-field__error" role="alert">{error}</p>}
      <Field label="New password">
        <Input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} />
      </Field>
      <Field label="Confirm new password" error={mismatch ? "These passwords do not match." : undefined}>
        <Input type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </Field>
      <button type="submit" className="ns-btn ns-btn--primary ns-btn--block" disabled={mismatch} data-loading={busy || undefined}>
        Set new password
      </button>
    </form>
  );
}
