import React from "react";

/* Namaste UI — the top bar, for the Next.js LMS.
   =========================================================================
   Thin renderers over components/css/navbar.css. Same rule as everywhere
   else in this system: no component here decides what anything LOOKS like —
   it renders the .ns-* classes the Ghost theme also renders, and contributes
   only the behaviour markup cannot express.

   For the navbar that behaviour is exactly three things, and they are the
   three that hand-rolled navbars get wrong:

     1. The panel's open state lives on the TRIGGER's aria-expanded, never on
        a wrapper class. The CSS shows the panel by reading that attribute
        (:has([aria-expanded="true"])), so what a screen reader announces and
        what the eye sees are one fact.
     2. Esc closes and RETURNS FOCUS to the trigger; tabbing out closes.
        Without the focus return, Esc silently drops a keyboard user at the
        top of the document.
     3. The mobile sheet is a real <dialog> opened with showModal(), so the
        focus trap, the inert background and the top layer come from the
        platform rather than from us.

   The Ghost theme gets the same three from assets/js/nav.js over the same
   markup. Two renderers, one component. */

/* ---- shared disclosure behaviour --------------------------------------- */

/** Open/close state plus the keyboard and pointer contract every panel in
 *  the bar shares. Returns the props to spread on the wrapper and trigger,
 *  so a new kind of panel cannot accidentally ship without Esc handling. */
function useDisclosure() {
  const [open, setOpen] = React.useState(false);
  const wrap = React.useRef(null);
  const trigger = React.useRef(null);

  React.useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      trigger.current?.focus();
    };
    /* pointerdown, not click: closing on the way DOWN means the click that
       dismissed the menu does not also activate whatever was underneath. */
    const onDown = (e) => { if (!wrap.current?.contains(e.target)) setOpen(false); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  /* Focus leaving the wrapper closes it — a panel that is open but off-screen
     swallows the next Esc and confuses the tab order. */
  const onBlur = (e) => {
    if (!e.relatedTarget || !wrap.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return {
    open, setOpen,
    wrapProps: { ref: wrap, onBlur },
    triggerProps: {
      ref: trigger,
      "aria-expanded": open,
      onClick: () => setOpen((v) => !v),
      /* ArrowDown opens without selecting — the disclosure pattern's one
         extra keyboard affordance. */
      onKeyDown: (e) => { if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); } },
    },
  };
}

/* ---- the bar ------------------------------------------------------------ */

/** The bar itself.
 *
 *  `variant` picks the surface (dark / transparent / floating / sunken), and
 *  `contained` adds the width-capping inner so the brand lines up with the
 *  first column of a width-capped page.
 *
 *  `transparent` rides a hero and goes solid on scroll. The scroll listener
 *  is here rather than in CSS because there is no CSS for "the page has
 *  moved"; it is passive and writes only on change. */
export function Topnav({
  variant, contained, wide, center, className = "", children, ...rest
}) {
  const [scrolled, setScrolled] = React.useState(false);
  const watching = variant === "transparent";

  React.useEffect(() => {
    if (!watching) return undefined;
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [watching]);

  const classes = [
    "ns-topnav",
    variant ? `ns-topnav--${variant}` : "",
    wide ? "ns-topnav--wide" : "",
    center ? "ns-topnav--center" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <nav className={classes} aria-label="Main" data-scrolled={watching ? String(scrolled) : undefined} {...rest}>
      {contained ? <div className="ns-topnav__inner">{children}</div> : children}
    </nav>
  );
}

/** Brand lockup. The mono `tag` is a real element, not a slash in the text,
 *  because it has to be able to disappear below lg. */
export function NavBrand({ href = "/", logo, name, tag }) {
  return (
    <a className="ns-topnav__brand" href={href}>
      {logo}
      {name && <span className="ns-topnav__brand-name">{name}</span>}
      {tag && <span className="ns-topnav__brand-tag">{tag}</span>}
    </a>
  );
}

/** The path picker — the control that sits beside the brand, names the
 *  training path you are in, and switches you to another one.
 *
 *  It stands where the mono `tag` used to ("Namaste Salesforce | Learn"). The
 *  tag printed the same word on every page of a section and could not be
 *  clicked; this reports the same fact and acts on it.
 *
 *  @param paths   [{ id, label, desc?, icon?, href? }] — the training sections
 *  @param activeId the path the current page belongs to; its row gets
 *                  aria-current and its glyph rides the trigger.
 *  @param footer   optional node for the panel's foot bar ("All paths →").
 */
export function PathPicker({ paths = [], activeId, onSelect, footer, id }) {
  const { setOpen, wrapProps, triggerProps } = useDisclosure();
  const panelId = `${React.useId().replace(/:/g, "")}-path`;
  const active = paths.find((p) => p.id === activeId) ?? paths[0];
  if (!active) return null;

  return (
    <div className="ns-navitem ns-pathpick" {...wrapProps}>
      <button
        type="button"
        className="ns-pathpick__trigger"
        aria-controls={id || panelId}
        /* The label names the CURRENT path before it offers the action, so the
           announcement carries the same fact the glyph does. */
        aria-label={`Training path: ${active.label}. Change path`}
        {...triggerProps}
      >
        {active.icon && <i className={`ph ${active.icon}`} aria-hidden="true" />}
        <span className="ns-pathpick__label">{active.label}</span>
      </button>
      <div className="ns-navmenu" id={id || panelId}>
        <p className="ns-navmenu__label">Training paths</p>
        {paths.map((path) => (
          <a
            className="ns-navmenu__item"
            key={path.id}
            href={path.href || `#${path.id}`}
            aria-current={path.id === active.id ? "page" : undefined}
            onClick={onSelect ? (e) => { e.preventDefault(); setOpen(false); onSelect(path.id); } : () => setOpen(false)}
          >
            {path.icon && <span className="ns-navmenu__icon"><i className={`ph ${path.icon}`} aria-hidden="true" /></span>}
            <span>
              <span className="ns-navmenu__title">{path.label}</span>
              {path.desc && <span className="ns-navmenu__desc">{path.desc}</span>}
            </span>
          </a>
        ))}
        {/* No separator above it — .ns-navmenu__foot draws its own top rule,
            and an <hr> as well is two hairlines a few pixels apart. */}
        {footer && <div className="ns-navmenu__foot">{footer}</div>}
      </div>
    </div>
  );
}

/** The link row. Children are <NavLink>, <NavMenu>, <MegaMenu>. */
export function NavLinks({ children }) {
  return <ul className="ns-topnav__links">{children}</ul>;
}

/** One link. `current` is the page you are on — it must be true for exactly
 *  one link in the bar, and it both paints the underline and announces the
 *  location. */
export function NavLink({ href, current, flag, children, ...rest }) {
  return (
    <li>
      <a href={href} aria-current={current ? "page" : undefined} {...rest}>
        {children}
        {flag && <span className="ns-topnav__flag">{flag}</span>}
      </a>
    </li>
  );
}

/** A dropdown: a column of rows, each an icon, a title and one line of
 *  description. The description is not decoration — it is what makes the
 *  menu usable by someone who does not already know the product. */
export function NavMenu({ label, items = [], align = "start", footer, id }) {
  const { setOpen, wrapProps, triggerProps } = useDisclosure();
  const panelId = `${React.useId().replace(/:/g, "")}-menu`;

  return (
    <li className="ns-navitem" {...wrapProps}>
      <button type="button" className="ns-topnav__trigger" aria-controls={id || panelId} {...triggerProps}>
        {label}
      </button>
      <div className={`ns-navmenu${align === "end" ? " ns-navmenu--end" : ""}`} id={id || panelId}>
        {items.map((item, i) => (
          item.separator
            ? <hr className="ns-navmenu__sep" key={`sep-${i}`} />
            : item.label
              ? <p className="ns-navmenu__label" key={`label-${i}`}>{item.label}</p>
              : (
                <a
                  className="ns-navmenu__item"
                  key={item.href ?? item.title}
                  href={item.href}
                  aria-current={item.current ? "page" : undefined}
                  onClick={() => setOpen(false)}
                >
                  {item.icon && <span className="ns-navmenu__icon">{item.icon}</span>}
                  <span>
                    <span className="ns-navmenu__title">{item.title}</span>
                    {item.desc && <span className="ns-navmenu__desc">{item.desc}</span>}
                  </span>
                </a>
              )
        ))}
        {/* Nothing here needs `hidden`: the closed panel is visibility:hidden
            in CSS, which already takes its contents out of the tab order. */}
        {footer && <div className="ns-navmenu__foot">{footer}</div>}
      </div>
    </li>
  );
}

/** The mega panel: the same rows in columns, spanning the bar, with at most
 *  ONE promo. Two promos is an ad break, and a mega menu that is mostly
 *  marketing stops being navigation. */
export function MegaMenu({ label, columns = [], feature, footLinks = [], wide, id }) {
  const { setOpen, wrapProps, triggerProps } = useDisclosure();
  const panelId = `${React.useId().replace(/:/g, "")}-mega`;

  return (
    <li className="ns-navitem ns-navitem--mega" {...wrapProps}>
      <button type="button" className="ns-topnav__trigger" aria-controls={id || panelId} {...triggerProps}>
        {label}
      </button>
      <div className={`ns-megamenu${wide ? " ns-megamenu--wide" : ""}`} id={id || panelId}>
        <div className="ns-megamenu__inner">
          {columns.map((col) => (
            <div className="ns-megamenu__col" key={col.label}>
              <p className="ns-megamenu__label">{col.label}</p>
              {col.items.map((item) => (
                <a className="ns-navmenu__item" key={item.href ?? item.title} href={item.href} onClick={() => setOpen(false)}>
                  {item.icon && <span className="ns-navmenu__icon">{item.icon}</span>}
                  <span>
                    <span className="ns-navmenu__title">{item.title}</span>
                    {item.desc && <span className="ns-navmenu__desc">{item.desc}</span>}
                  </span>
                </a>
              ))}
            </div>
          ))}
          {feature && (
            <div className="ns-megamenu__feature">
              {feature.kicker && <span className="ns-megamenu__feature-kicker">{feature.kicker}</span>}
              <p className="ns-megamenu__feature-title">{feature.title}</p>
              {feature.text && <p className="ns-megamenu__feature-text">{feature.text}</p>}
              {feature.href && <a className="ns-btn ns-btn--outline ns-btn--sm" href={feature.href}>{feature.cta || "Learn more"}</a>}
            </div>
          )}
        </div>
        {footLinks.length > 0 && (
          <div className="ns-megamenu__foot">
            {footLinks.map((l) => <a key={l.href} href={l.href}>{l.icon}{l.label}</a>)}
          </div>
        )}
      </div>
    </li>
  );
}

/** The search affordance: a BUTTON shaped like a field. It opens the search
 *  modal, where results have room. Shaping it like an input is honest about
 *  what it will feel like; wiring an actual input here and then teleporting
 *  the text into a dialog is not. */
export function NavSearch({ onOpen, placeholder = "Search courses…", shortcut = "⌘K", iconOnly }) {
  React.useEffect(() => {
    if (!onOpen) return undefined;
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); onOpen(); }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onOpen]);

  return (
    <button
      type="button"
      className={`ns-navsearch${iconOnly ? " ns-navsearch--icon" : ""}`}
      onClick={onOpen}
      aria-label={iconOnly ? placeholder : undefined}
    >
      <i className="ph ph-magnifying-glass" aria-hidden="true" />
      {!iconOnly && <span className="ns-navsearch__text">{placeholder}</span>}
      {!iconOnly && shortcut && <kbd className="ns-navsearch__kbd">{shortcut}</kbd>}
    </button>
  );
}

/** The account menu. Identity first, actions second — the top of this panel
 *  answers "who am I signed in as", which is the question that makes people
 *  open it in the first place. */
export function UserMenu({ user, items = [], progress, onSignOut, id }) {
  const { setOpen, wrapProps, triggerProps } = useDisclosure();
  const panelId = `${React.useId().replace(/:/g, "")}-account`;
  const initials = user?.initials || (user?.name || "?").split(" ").map((w) => w[0]).slice(0, 2).join("");

  return (
    <div className="ns-usermenu" {...wrapProps}>
      <button
        type="button"
        className="ns-usermenu__trigger"
        aria-controls={id || panelId}
        aria-label={`Account menu for ${user?.name || "your account"}`}
        {...triggerProps}
      >
        <span className="ns-avatar ns-avatar--sm" aria-hidden="true">
          {user?.avatar ? <img src={user.avatar} alt="" /> : initials}
        </span>
        {user?.short && <span className="ns-usermenu__name">{user.short}</span>}
      </button>

      <div className="ns-usermenu__panel" id={id || panelId}>
        <div className="ns-usermenu__head">
          <span className="ns-avatar" aria-hidden="true">
            {user?.avatar ? <img src={user.avatar} alt="" /> : initials}
          </span>
          <span className="ns-usermenu__identity">
            <span className="ns-usermenu__fullname">{user?.name}</span>
            <span className="ns-usermenu__email">{user?.email}</span>
          </span>
          {user?.plan && <span className="ns-usermenu__plan">{user.plan}</span>}
        </div>

        {progress && (
          <div className="ns-usermenu__progress">
            <span className="ns-usermenu__progress-label">
              <span>{progress.label}</span><span>{progress.value}%</span>
            </span>
            <progress className="ns-progress" value={progress.value} max="100" aria-label={`${progress.label} progress`}>
              {progress.value}%
            </progress>
          </div>
        )}

        <hr className="ns-menu__sep" />
        {items.map((item, i) => (
          item.separator
            ? <hr className="ns-menu__sep" key={`sep-${i}`} />
            : (
              <a className="ns-menu__item" key={item.href ?? item.label} href={item.href} onClick={() => setOpen(false)}>
                {item.icon}{item.label}
              </a>
            )
        ))}
        {onSignOut && (
          <>
            <hr className="ns-menu__sep" />
            <button type="button" className="ns-menu__item ns-menu__item--danger" onClick={onSignOut}>
              <i className="ph ph-arrow-square-out" aria-hidden="true" /> Sign out
            </button>
          </>
        )}
      </div>
    </div>
  );
}

/** Signed-out pair. Sign in is quiet, sign up is THE primary — one solid
 *  blue thing per screen (Principle 3), and in the bar this is it. */
export function AuthActions({ signInHref = "#", signUpHref = "#", signInLabel = "Sign in", signUpLabel = "Start learning" }) {
  return (
    <div className="ns-topnav__auth">
      <a className="ns-btn ns-btn--quiet ns-btn--sm" href={signInHref}>{signInLabel}</a>
      <a className="ns-btn ns-btn--primary ns-btn--sm" href={signUpHref}>{signUpLabel}</a>
    </div>
  );
}

/** The hamburger. Three hairline rules that rotate into the close X, so open
 *  and closed are one control rather than two icons swapping — the user can
 *  see where the thing they opened went. */
export function Burger({ expanded, onClick, controls }) {
  return (
    <button
      type="button"
      className="ns-burger"
      aria-expanded={expanded}
      aria-haspopup="dialog"
      aria-controls={controls}
      aria-label="Menu"
      onClick={onClick}
    >
      <span className="ns-burger__bar" /><span className="ns-burger__bar" /><span className="ns-burger__bar" />
    </button>
  );
}

/** The mobile sheet. Full-viewport rather than a side drawer: on a phone a
 *  20rem drawer leaves a strip of unusable page and forces the links to be
 *  small. Sections are native <details>, so a long site map stays one
 *  thumb-reach and find-in-page can still reach collapsed entries. */
export function NavSheet({ open, onClose, id = "site-nav", brand, groups = [], footer, label = "Site menu" }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    /* showModal(), never the `open` attribute: it is what grants the focus
       trap, the inert background and the top layer. */
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  React.useEffect(() => {
    if (!open) return undefined;
    /* Resizing past lg hides the burger, so a sheet left open would be a
       full-screen dialog with no visible way back. */
    const onResize = () => { if (window.innerWidth >= 1024) onClose?.(); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [open, onClose]);

  React.useEffect(() => {
    if (!open) return undefined;
    /* The page behind must not scroll under the sheet. */
    const prev = document.documentElement.style.overflow;
    document.documentElement.style.overflow = "hidden";
    return () => { document.documentElement.style.overflow = prev; };
  }, [open]);

  let n = 0;

  return (
    <dialog
      className="ns-navsheet"
      id={id}
      ref={ref}
      aria-label={label}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose?.(); }}
    >
      <div className="ns-navsheet__head">
        {brand}
        <button type="button" className="ns-btn ns-btn--quiet ns-btn--icon ns-navsheet__close" onClick={onClose} aria-label="Close menu">
          <i className="ph ph-x" aria-hidden="true" />
        </button>
      </div>

      <div className="ns-navsheet__body">
        {groups.map((group) => {
          if (group.label && !group.items) return <p className="ns-navsheet__label" key={group.label}>{group.label}</p>;
          if (group.items) {
            n += 1;
            const index = String(n).padStart(2, "0");
            return (
              <details className="ns-navsheet__group" key={group.title}>
                <summary className="ns-navsheet__link">
                  <span className="ns-navsheet__index">{index}</span>
                  {group.title}
                  <i className="ph ph-caret-down" aria-hidden="true" />
                </summary>
                <div className="ns-navsheet__sub">
                  {group.items.map((item) => (
                    <a className="ns-navsheet__link" key={item.href} href={item.href} onClick={onClose}>{item.title}</a>
                  ))}
                </div>
              </details>
            );
          }
          n += 1;
          return (
            <a
              className="ns-navsheet__link"
              key={group.href}
              href={group.href}
              aria-current={group.current ? "page" : undefined}
              onClick={onClose}
            >
              <span className="ns-navsheet__index">{String(n).padStart(2, "0")}</span>
              {group.title}
              <i className="ph ph-caret-right" aria-hidden="true" />
            </a>
          );
        })}
      </div>

      {footer && <div className="ns-navsheet__foot">{footer}</div>}
    </dialog>
  );
}

/** Announcement bar. Above the navbar and scrolling away with the page —
 *  it is news, not chrome, and pinning news to the viewport is how a banner
 *  becomes an ad. Dismissal is the consumer's to persist. */
export function AnnounceBar({ kicker, children, link, onDismiss, quiet }) {
  return (
    <div className={`ns-announce${quiet ? " ns-announce--quiet" : ""}`}>
      {kicker && <span className="ns-announce__kicker">{kicker}</span>}
      <span className="ns-announce__text">{children}</span>
      {link && <a className="ns-announce__link" href={link.href}>{link.label}</a>}
      {onDismiss && (
        <button type="button" className="ns-announce__close" onClick={onDismiss} aria-label="Dismiss announcement">
          <i className="ph ph-x" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}

/** Reading progress along the bottom edge of the bar. Decorative: the
 *  percentage is not information a reader can act on, and a live region
 *  announcing "37%" on every scroll frame is actively hostile. */
export function ReadingProgress() {
  const [pct, setPct] = React.useState(0);

  React.useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setPct(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="ns-topnav__progress" style={{ "--p": pct }} aria-hidden="true" />;
}

/** An icon-only bar action — notifications, help, fullscreen, the curriculum
 *  toggle. Always carries an accessible name, and the badge is a COUNT: a
 *  bare dot tells a screen-reader user nothing, and `count` is what goes in
 *  the label too. */
export function NavIcon({ icon, label, count, href, onClick, ...rest }) {
  const Tag = href ? "a" : "button";
  return (
    <Tag
      className="ns-navicon"
      href={href}
      type={href ? undefined : "button"}
      onClick={onClick}
      aria-label={count ? `${label} — ${count} unread` : label}
      {...rest}
    >
      {icon}
      {count ? <span className="ns-navicon__badge" aria-hidden="true">{count}</span> : null}
    </Tag>
  );
}

/** One mono metric in a bar — streak, minutes today, seats left. Two at most:
 *  three is a stat band, and that belongs on the page, not in the chrome. */
export function NavStat({ icon, value, children }) {
  return (
    <span className="ns-navstat">
      {icon}
      {value != null && <strong>{value}</strong>}
      {children}
    </span>
  );
}

/** The course bar — chrome for a page you are INSIDE.
 *
 *  It answers the three questions the site bar never has to: where am I in
 *  this course, how far through am I, and what is next. It deliberately
 *  carries no site navigation: a link row here is an invitation to leave in
 *  the middle of a lesson.
 *
 *  Unlike the blog's reading line, `percent` is labelled and announced —
 *  this is a number the learner acts on, not decoration. */
export function CourseNav({
  backHref = "#", backLabel, title,
  percent = 0, position, dark,
  onPrev, searchHref,
  actions, children,
}) {
  return (
    <nav className={`ns-coursenav${dark ? " ns-coursenav--dark" : ""}`} aria-label="Course">
      <a className="ns-coursenav__back" href={backHref}>
        <i className="ph ph-arrow-left" aria-hidden="true" />
        <span>{backLabel}</span>
      </a>

      <span className="ns-topnav__divider" aria-hidden="true" />

      {/* The LESSON, and only the lesson: the back button and the divider to
          its left already say the course, so the bar reads "Course | Lesson"
          across the two. */}
      <span className="ns-coursenav__id">
        <span className="ns-coursenav__title">{title}</span>
      </span>

      <div className="ns-coursenav__progress">
        <div
          className="ns-coursenav__bar"
          role="progressbar"
          aria-label="Course progress"
          aria-valuenow={percent}
          aria-valuemin={0}
          aria-valuemax={100}
          style={{ "--p": percent }}
        >
          <span />
        </div>
        {position && <span className="ns-coursenav__pct">{position}</span>}
      </div>

      <div className="ns-coursenav__actions">
        {onPrev && <NavIcon label="Previous lesson" onClick={onPrev} icon={<i className="ph ph-caret-left" aria-hidden="true" />} />}
        {actions}
        {children}
        {/* NO primary action. "Complete & next" used to live here, which put
            the same action in two places — the docked prev/next at the foot of
            the lesson is where you finish one, and a second solid blue button
            in the chrome competes for the single click the screen is allowed.
            searchHref renders a LINK, not a dialog trigger: search here is a
            way out to the rest of the site, and middle-click should work. */}
        {searchHref && (
          <a className="ns-navicon ns-tooltip-host" href={searchHref} aria-label="Search the site">
            <i className="ph ph-magnifying-glass" aria-hidden="true" />
            <span className="ns-tooltip ns-tooltip--below">Search</span>
          </a>
        )}
      </div>
    </nav>
  );
}

/** The GitHub star pill. A LINK — it goes to the repo — with the count in
 *  mono like every other number in this system. One per bar: a row of social
 *  proof is an ad, and the count is the first thing to drop when the bar gets
 *  tight (below lg the words go and the mark stands alone). */
export function NavStar({ href, count, label = "Star" }) {
  return (
    <a className="ns-navstar" href={href} aria-label={count ? `${label} on GitHub — ${count} stars` : `${label} on GitHub`}>
      <span className="ns-navstar__label">
        <i className="ph ph-github-logo" aria-hidden="true" />
        <span>{label}</span>
      </span>
      {count && <span className="ns-navstar__count" aria-hidden="true">{count}</span>}
    </a>
  );
}
