import React from "react";

/* Namaste UI — action button.
   =========================================================================
   This component used to carry its own inline styles. It no longer does, and
   that change is the whole architecture in miniature: Handlebars cannot use a
   JavaScript style object, so an inline-styled React button meant the Ghost
   theme had to reimplement the same button — and two implementations of one
   thing is how a design system quietly dies.

   All styling now lives in components/css/button.css as .ns-btn classes,
   which BOTH products render. This file only maps props to those classes.

   Principle 3 in practice: `primary` is the only solid fill. If a screen has
   two solid buttons, one of them is wrong — not "a bit loud", wrong, because
   the entire color system rests on solid blue meaning "the one action here". */

/** Sharp corners, hairline border by default, solid fill reserved for
 *  `primary`. Press is an instant opacity dim — no bounce, no lift. */
export function Button({
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "left",
  disabled,
  loading,
  block,
  as: Tag = "button",
  className = "",
  children,
  ...rest
}) {
  const classes = [
    "ns-btn",
    `ns-btn--${variant}`,
    size !== "md" && `ns-btn--${size}`,
    block && "ns-btn--block",
    /* An icon with no children is an icon-only button, which needs a square
       target — and an aria-label from the caller, or it announces as nothing
       but "button". */
    icon && !children && "ns-btn--icon",
    className,
  ].filter(Boolean).join(" ");

  return (
    <Tag
      className={classes}
      /* A real <button> takes `disabled`; an <a> rendered via `as` cannot, so
         it gets aria-disabled and the CSS handles the rest. */
      disabled={Tag === "button" ? disabled || loading : undefined}
      aria-disabled={Tag !== "button" && (disabled || loading) ? true : undefined}
      /* The label stays in the DOM while loading (dimmed by CSS) rather than
         being swapped for a spinner, so the button does not change width
         mid-submit and its accessible name does not vanish while the user is
         waiting on it. */
      data-loading={loading ? "true" : undefined}
      {...rest}
    >
      {icon && iconPosition === "left" && <i className={`ph ${icon}`} aria-hidden="true" />}
      {children}
      {icon && iconPosition === "right" && <i className={`ph ${icon}`} aria-hidden="true" />}
    </Tag>
  );
}
