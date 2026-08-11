import React from "react";

/* Namaste UI — theme toggle.
   =========================================================================
   Pairs with assets/js/theme-init.js, which has already set data-theme before
   first paint. This component never decides the initial theme itself — that
   would be a state update after hydration, which is precisely the white flash
   the init script exists to prevent. It only reads what is already there and
   flips it through the shared window.nsTheme helper, so the Ghost theme's
   Alpine-driven toggle and this one cannot drift apart. */

/** A real <button> with role="switch" — `aria-checked` is what tells a screen
 *  reader the current mode, and the visible label reinforces it for everyone
 *  else. An icon-only toggle with no accessible name is the usual version of
 *  this component and the usual bug. */
export function ThemeToggle({ className = "ns-btn ns-btn--outline ns-btn--icon ns-btn--sm", showLabel = false }) {
  /* Start as null rather than guessing "light". On the server there is no
     document, and rendering a definite value that the client then contradicts
     is a hydration mismatch — React would warn and, worse, the toggle would
     briefly show the wrong state. */
  const [theme, setTheme] = React.useState(null);

  React.useEffect(() => {
    setTheme(document.documentElement.getAttribute("data-theme"));

    /* The OS can change underneath us while the page is open (macOS auto
       light/dark at sunset). theme-init.js already updates the attribute in
       that case; this keeps the button's label in sync with it. */
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.getAttribute("data-theme"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const isDark = theme === "dark";

  const onClick = () => {
    /* Delegate to the shared helper so persistence and color-scheme are
       handled in exactly one place. The fallback covers the case where the
       init script was not inlined — the toggle still works, it just cannot
       remember the choice, which is a better failure than a dead button. */
    if (typeof window !== "undefined" && window.nsTheme) window.nsTheme.toggle();
    else document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
      role="switch"
      aria-checked={isDark}
      aria-label="Dark mode"
      /* Until the effect has run there is no truthful value to show, so the
         icon is suppressed rather than guessed. One frame, no flash. */
      suppressHydrationWarning
    >
      {theme && <i className={`ph ${isDark ? "ph-sun" : "ph-moon"}`} aria-hidden="true" />}
      {showLabel && <span>{isDark ? "Light" : "Dark"}</span>}
    </button>
  );
}

/** First focusable element on the page, pointing at the main landmark.
 *
 *  The target MUST carry tabindex="-1" — without it, following the link moves
 *  the viewport but leaves focus at the top of the document in Safari and
 *  Chrome, so the next Tab goes back into the navigation and the skip link
 *  achieves nothing. */
export function SkipLink({ href = "#main", children = "Skip to content" }) {
  return <a className="ns-skip-link ns-visually-hidden" href={href}>{children}</a>;
}
