import React from "react";
/* Principle: reuse the hairline-grid dark canvas everywhere a hero appears —
   course, blog, docs and resources all share this one hero language; only the
   content composition changes.

   The hero is not its own canvas: it is .ns-hero INSIDE a .ns-band. That is
   why the dark ground and the dissolving grid are --dark and --grid modifiers
   on the band rather than baked in here — the same band carries a CTA or a
   stat row, and a hero that painted its own background could not sit in one.
   Styling lives in components/css/sections.css; templates/hero.html is the
   Handlebars-side equivalent. */
export function Hero({
  variant = "split", kicker, title, subtitle, media, proof, actions,
  className = "", ...rest
}) {
  const centered = variant === "centered";
  const classes = [
    "ns-band", "ns-band--dark", "ns-band--grid", "ns-hero",
    variant === "compact" && "ns-band--tight",
    className,
  ].filter(Boolean).join(" ");
  return (
    <section className={classes} {...rest}>
      <div className={`ns-band__inner${centered ? " ns-band__head--center" : ""}`}>
        {kicker && <span className="ns-kicker">{kicker}</span>}
        <h1 className="ns-hero__title">{title}</h1>
        {subtitle && <p className="ns-hero__lede">{subtitle}</p>}
        {actions && <div className="ns-hero__actions">{actions}</div>}
        {proof && <span className="ns-hero__proof">{proof}</span>}
        {!centered && variant !== "compact" && media}
      </div>
    </section>
  );
}
