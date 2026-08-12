import React from "react";

/* Namaste UI — theme controls.
   =========================================================================
   Pairs with assets/js/theme-init.js, which has already set data-theme before
   first paint. Neither control here decides the initial theme itself — that
   would be a state update after hydration, which is precisely the white flash
   the init script exists to prevent. They read what is already there and flip
   it through the shared window.nsTheme helper, so the Ghost theme's toggle
   and this one cannot drift apart.

   Three forms:
     ThemeToggle                  the switch: a track with both glyphs and a
                                  knob that slides between them. The default
                                  in a bar, because it shows both states AND
                                  which is current, rather than asking you to
                                  infer the mode from the icon of the other
                                  one.
     ThemeToggle variant="icon"   one square button, sun ⇄ moon crossfading in
                                  place. For a bar with no room left.
     ThemeSwitcher                Light / Auto / Dark. For anywhere with room
                                  — and the honest one, because SYSTEM IS A
                                  CHOICE and it is the default. A two-state
                                  control silently converts every visitor into
                                  someone with an explicit preference, after
                                  which their OS switching at sunset does
                                  nothing.

   Which icon shows is decided in CSS from data-theme on <html>, not from
   React state. That is not a micro-optimisation: it means the glyph is
   correct in the very first painted frame, server-rendered, with no effect
   having run. React is only responsible for aria-checked. */

/** One-button theme switch. A real <button role="switch"> — `aria-checked` is
 *  what tells a screen reader the current mode, and the accessible name is
 *  what stops it being an unlabelled icon, the usual version of this
 *  component and the usual bug. */
export function ThemeToggle({ variant = "switch", className, label = "Dark mode" }) {
  /* null until the effect runs: on the server there is no document, and
     rendering a definite value the client then contradicts is a hydration
     mismatch. The ICON does not depend on this — only the announcement does,
     so nothing visible waits for it. */
  const [theme, setTheme] = React.useState(null);

  React.useEffect(() => {
    const read = () => setTheme(document.documentElement.getAttribute("data-theme"));
    read();
    /* The OS can change underneath us while the page is open (macOS auto
       light/dark at sunset). theme-init.js updates the attribute; this keeps
       the announced state in sync with it. */
    const observer = new MutationObserver(read);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => observer.disconnect();
  }, []);

  const onClick = () => {
    /* Delegate so persistence and color-scheme are handled in exactly one
       place. The fallback covers a page where the init script was not
       inlined — the toggle still works, it just cannot remember, which is a
       better failure than a dead button. */
    if (typeof window !== "undefined" && window.nsTheme) window.nsTheme.toggle();
    else document.documentElement.setAttribute("data-theme", theme === "dark" ? "light" : "dark");
  };

  return (
    <button
      type="button"
      className={className || (variant === "icon" ? "ns-themetoggle-icon" : "ns-themeswitch")}
      onClick={onClick}
      role="switch"
      aria-checked={theme === "dark"}
      aria-label={label}
      suppressHydrationWarning
    >
      {/* One moving part: a knob carrying the CURRENT mode's glyph. Its
          position and its glyph are both decided by CSS from data-theme on
          <html> — not from `theme` — so they are right in the first painted
          frame, server-rendered, before this component's effect has run. */}
      {variant === "icon" ? (
        <>
          <i className="ph ph-sun" aria-hidden="true" />
          <i className="ph ph-moon" aria-hidden="true" />
        </>
      ) : (
        <span className="ns-themeswitch__knob" aria-hidden="true">
          <i className="ph ph-sun" />
          <i className="ph ph-moon" />
        </span>
      )}
    </button>
  );
}

/* Mono words, not glyphs: every product draws the "auto" icon differently
   and none of them is read correctly, while a mono label is this system's
   own material. `label` is the accessible name; `text` is what is drawn. */
const CHOICES = [
  { value: "light", text: "Light", label: "Light" },
  { value: "system", text: "Auto", label: "Match the system setting" },
  { value: "dark", text: "Dark", label: "Dark" },
];

/** Light / System / Dark, as a real radiogroup.
 *
 *  "system" is stored as the ABSENCE of a stored value (see theme-init.js),
 *  so a reader who has never chosen keeps following their OS — and choosing
 *  System again genuinely un-chooses rather than pinning today's OS value.
 *
 *  Roving tabindex: the group is one tab stop and arrow keys move within it,
 *  which is the radiogroup pattern and the reason this is three buttons with
 *  role="radio" rather than three independent toggles. */
export function ThemeSwitcher({ className = "", label = "Colour theme" }) {
  const [choice, setChoice] = React.useState(null);

  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(window.nsTheme?.key || "ns-theme");
      setChoice(stored === "light" || stored === "dark" ? stored : "system");
    } catch (e) {
      /* Safari in private mode throws rather than returning null. Following
         the OS is a perfectly good answer, and a theme control must never be
         the thing that breaks the page. */
      setChoice("system");
    }
  }, []);

  const select = (value) => {
    setChoice(value);
    if (typeof window === "undefined" || !window.nsTheme) return;
    if (value === "system") window.nsTheme.useSystem();
    else window.nsTheme.set(value);
  };

  const onKeyDown = (e) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = CHOICES.findIndex((c) => c.value === choice);
    const next = CHOICES[(i + (e.key === "ArrowRight" ? 1 : -1) + CHOICES.length) % CHOICES.length];
    select(next.value);
    e.currentTarget.querySelector(`[data-ns-theme-value="${next.value}"]`)?.focus();
  };

  return (
    <div className={`ns-themetoggle ${className}`.trim()} role="radiogroup" aria-label={label} onKeyDown={onKeyDown}>
      {CHOICES.map((c) => (
        <button
          key={c.value}
          type="button"
          className="ns-themetoggle__opt"
          role="radio"
          aria-checked={choice === c.value}
          aria-label={c.label}
          data-ns-theme-value={c.value}
          tabIndex={choice === c.value ? 0 : -1}
          onClick={() => select(c.value)}
          suppressHydrationWarning
        >
          {c.text}
        </button>
      ))}
    </div>
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
