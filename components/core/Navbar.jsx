import React from "react";
import { Topnav, NavBrand, NavLinks, Burger, NavSheet, AuthActions } from "../navigation/Navbar.jsx";
import { ThemeToggle } from "./ThemeToggle.jsx";

/* Namaste UI — the assembled site header.
   =========================================================================
   One opinionated arrangement of the parts in components/navigation/Navbar.jsx:
   brand · links · theme · one call to action, plus the hamburger and mobile
   sheet below lg. Reach for the parts directly when you need a dropdown, a
   mega panel or the account menu; this is the common case pre-assembled.

   It used to style itself with inline style objects, which meant the Ghost
   theme could not render it — it would have had to reimplement the same bar
   in Handlebars, and the two copies would drift the first time a padding
   changed. Now both products render the same .ns-topnav markup. */

/** @param links   [{ id, label, icon? }] — `icon` is a Phosphor class.
 *  @param activeId the current page's id; exactly one, and it both paints the
 *                  underline and announces the location via aria-current. */
export function Navbar({
  links = [], activeId, onNavigate, ctaLabel = "Sign up", onCta, logo,
  brandName = "Namaste Salesforce", brandTag, signInHref, variant, contained = true,
}) {
  const [sheet, setSheet] = React.useState(false);

  const item = (l) => (
    <li key={l.id}>
      <a
        href={l.href || `#${l.id}`}
        aria-current={activeId === l.id ? "page" : undefined}
        onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(l.id); } : undefined}
      >
        {l.icon && <i className={`ph ${l.icon}`} aria-hidden="true" />}
        {l.label}
      </a>
    </li>
  );

  return (
    <>
      <Topnav variant={variant} contained={contained}>
        <NavBrand logo={logo} name={brandName} tag={brandTag} />
        <NavLinks>{links.map(item)}</NavLinks>
        <div className="ns-topnav__actions">
          <ThemeToggle />
          {signInHref
            ? <AuthActions signInHref={signInHref} signUpLabel={ctaLabel} />
            : <button type="button" className="ns-btn ns-btn--primary ns-btn--sm" onClick={onCta}>{ctaLabel}</button>}
          <Burger expanded={sheet} controls="site-nav" onClick={() => setSheet(true)} />
        </div>
      </Topnav>

      <NavSheet
        open={sheet}
        onClose={() => setSheet(false)}
        brand={<NavBrand logo={logo} name={brandName} />}
        groups={links.map((l) => ({ title: l.label, href: l.href || `#${l.id}`, current: activeId === l.id }))}
        footer={<button type="button" className="ns-btn ns-btn--primary" onClick={onCta}>{ctaLabel}</button>}
      />
    </>
  );
}
