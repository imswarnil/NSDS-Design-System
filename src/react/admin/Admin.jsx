import React from "react";

/* Namaste UI — admin chrome for the Next.js LMS.
   =========================================================================
   The builder's console: shell, side nav, page head, stat cards, list
   toolbar, editor layout and publish bar. Styling lives in
   components/css/admin.css; a Ghost/Handlebars admin surface renders the
   same classes — these are thin renderers, per the two-products rule. */

/** The app shell: topbar / side nav / main as one grid.
 *  `side` receives an <AdminNav>; `topbar` the environment + account chrome. */
export function AdminShell({ topbar, side, children }) {
  return (
    <div className="ns-admin">
      <header className="ns-admin__topbar">{topbar}</header>
      <aside className="ns-admin__side">{side}</aside>
      <main className="ns-admin__main">{children}</main>
    </div>
  );
}

/** The mono environment tag in the topbar — which site this console edits. */
export function AdminEnv({ children }) {
  return <span className="ns-admin__env">{children}</span>;
}

/** Side navigation. items: [{ label, href, icon?, count?, current? }] grouped
 *  under optional section headings: [{ heading, items }]. State is
 *  aria-current, so seen and announced agree. */
export function AdminNav({ groups = [] }) {
  let n = 0;
  return (
    <nav className="ns-admin-nav" aria-label="Admin">
      {groups.map((g) => (
        <React.Fragment key={g.heading ?? "top"}>
          {g.heading && <p className="ns-admin-nav__sep">{g.heading}</p>}
          {g.items.map((it) => {
            n += 1;
            return (
              <a key={it.href} href={it.href} aria-current={it.current ? "page" : undefined}>
                <span className="ns-admin-nav__num">{String(n).padStart(2, "0")}</span>
                {it.icon}
                {it.label}
                {it.count != null && <span className="ns-admin-nav__count">{it.count}</span>}
              </a>
            );
          })}
        </React.Fragment>
      ))}
    </nav>
  );
}

/** Every screen opens with one: kicker, h1, meta line, actions (one primary). */
export function PageHead({ kicker, title, meta, actions }) {
  return (
    <div className="ns-pagehead">
      <div>
        {kicker && <span className="ns-pagehead__kicker">{kicker}</span>}
        <h1>{title}</h1>
        {meta && <p className="ns-pagehead__meta">{meta}</p>}
      </div>
      {actions && <div className="ns-pagehead__actions">{actions}</div>}
    </div>
  );
}

/** Dashboard stat: mono value, uppercase label, worded delta (never color alone). */
export function Stat({ label, value, delta, direction }) {
  const mod = direction === "up" ? " ns-stat__delta--up" : direction === "down" ? " ns-stat__delta--down" : "";
  return (
    <div className="ns-stat">
      <span className="ns-stat__label">{label}</span>
      <div className="ns-stat__value">{value}</div>
      {delta && <span className={`ns-stat__delta${mod}`}>{delta}</span>}
    </div>
  );
}

export function StatGrid({ children }) {
  return <div className="ns-stat-grid">{children}</div>;
}

/** The row above a list: search, filters, count, view toggle. */
export function Toolbar({ search, count, children, end }) {
  return (
    <div className="ns-toolbar">
      {search && <div className="ns-toolbar__search">{search}</div>}
      {children}
      {count != null && <span className="ns-toolbar__count">{count}</span>}
      {end && <><span className="ns-toolbar__spacer" />{end}</>}
    </div>
  );
}

/** Two-pane creation layout: the record on the left, everything ABOUT the
 *  record (status, tags, thumbnail, visibility) in the sticky rail. */
export function EditorLayout({ rail, children }) {
  return (
    <div className="ns-editor">
      <div className="ns-editor__main">{children}</div>
      <div className="ns-editor__rail">{rail}</div>
    </div>
  );
}

/** One hairline group in the settings rail. */
export function RailBox({ title, children }) {
  return (
    <section className="ns-railbox">
      <h2 className="ns-railbox__title">{title}</h2>
      {children}
    </section>
  );
}

/** Sticky save/publish strip. `state` is the mono save line — a timestamp,
 *  not a toast: "Draft · saved 14:32:07". */
export function PublishBar({ state, children }) {
  return (
    <div className="ns-publishbar">
      <span className="ns-publishbar__state" role="status">{state}</span>
      <div className="ns-publishbar__actions">{children}</div>
    </div>
  );
}
