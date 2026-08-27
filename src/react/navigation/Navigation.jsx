import React from "react";

/* Namaste UI — navigation for the Next.js LMS.
   =========================================================================
   Same rule as everywhere else in this system: the styling lives in
   components/css/navigation.css and is shared with the Ghost theme. These
   components contribute the keyboard behaviour the WAI-ARIA patterns require
   and that markup alone cannot express. */

/** Tabs implementing the ARIA tabs pattern.
 *
 *  The part that is easy to get wrong and is handled here: ROVING TABINDEX.
 *  Only the selected tab is in the tab order, so pressing Tab moves out of
 *  the tablist and into the panel rather than walking through every tab. Arrow
 *  keys move between tabs; Home/End jump to the ends.
 *
 *  `activation="automatic"` selects on arrow (right for short, cheap panels);
 *  "manual" requires Enter/Space, which is correct when selecting a tab
 *  triggers a fetch — otherwise arrowing across five tabs fires five requests. */
export function Tabs({ tabs = [], value, onChange, activation = "automatic", className = "" }) {
  const baseId = React.useId().replace(/:/g, "");
  const refs = React.useRef([]);
  const selectedIndex = Math.max(0, tabs.findIndex((t) => t.value === value));

  const focusTab = (i) => {
    const next = (i + tabs.length) % tabs.length;
    refs.current[next]?.focus();
    if (activation === "automatic") onChange?.(tabs[next].value);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") { e.preventDefault(); focusTab(selectedIndex + 1); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); focusTab(selectedIndex - 1); }
    else if (e.key === "Home") { e.preventDefault(); focusTab(0); }
    else if (e.key === "End") { e.preventDefault(); focusTab(tabs.length - 1); }
  };

  return (
    <div className={className}>
      <div role="tablist" className="ns-tabs" onKeyDown={onKeyDown}>
        {tabs.map((tab, i) => {
          const selected = tab.value === value;
          return (
            <button
              type="button"
              key={tab.value}
              ref={(el) => { refs.current[i] = el; }}
              role="tab"
              id={`${baseId}-tab-${i}`}
              className="ns-tab"
              aria-selected={selected}
              aria-controls={`${baseId}-panel-${i}`}
              /* The roving part: -1 keeps unselected tabs out of the tab
                 order while leaving them reachable by arrow key. */
              tabIndex={selected ? 0 : -1}
              onClick={() => onChange?.(tab.value)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      {tabs.map((tab, i) => (
        <div
          key={tab.value}
          role="tabpanel"
          id={`${baseId}-panel-${i}`}
          aria-labelledby={`${baseId}-tab-${i}`}
          className="ns-tabpanel"
          hidden={tab.value !== value}
          /* The panel is focusable so that Tab from the selected tab lands on
             the content. Required by the pattern when the panel has no
             focusable children of its own. */
          tabIndex={0}
        >
          {tab.content}
        </div>
      ))}
    </div>
  );
}

/** Accordion built on native <details>. Deliberately not a button+div
 *  reimplementation: <details> keeps browser find-in-page able to reach and
 *  expand collapsed content, which on a documentation site is a feature users
 *  rely on without ever naming it.
 *
 *  `exclusive` gives every item the same `name`, which makes the browser close
 *  the others — no state management at all. */
export function Accordion({ items = [], exclusive, numbered, className = "" }) {
  const groupName = React.useId().replace(/:/g, "");
  return (
    <div className={`ns-accordion ${className}`.trim()}>
      {items.map((item, i) => (
        <details
          key={item.key ?? item.title}
          className="ns-accordion__item"
          name={exclusive ? groupName : undefined}
          open={item.defaultOpen}
        >
          <summary className="ns-accordion__summary">
            {numbered && <span className="ns-accordion__index">{String(i + 1).padStart(2, "0")}</span>}
            {item.title}
          </summary>
          <div className="ns-accordion__content">{item.content}</div>
        </details>
      ))}
    </div>
  );
}

/** Breadcrumb trail. The final crumb is plain text with aria-current="page",
 *  not a link to where you already are. */
export function Breadcrumb({ items = [], className = "" }) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="ns-breadcrumb">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li className="ns-breadcrumb__item" key={item.href ?? item.label}>
              {last || !item.href
                ? <span className="ns-breadcrumb__link" aria-current="page">{item.label}</span>
                : <a className="ns-breadcrumb__link" href={item.href}>{item.label}</a>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Pagination for the blog and course catalog.
 *
 *  Renders real <a> elements: Ghost paginates server-side, and links are
 *  crawlable, middle-clickable and openable in a new tab in a way that
 *  onClick handlers are not. */
export function Pagination({ page, totalPages, hrefFor = (p) => `?page=${p}`, className = "" }) {
  if (totalPages <= 1) return null;

  /* Show first, last, current and one neighbour each side; elide the rest.
     Beyond ~7 visible numbers the control stops being scannable and starts
     being a wall of digits. */
  const pages = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) pages.push(p);
    else if (pages.at(-1) !== "…") pages.push("…");
  }

  return (
    <nav aria-label="Pagination" className={className}>
      <ul className="ns-pagination">
        <li>
          <a
            className="ns-pagination__link"
            href={page > 1 ? hrefFor(page - 1) : undefined}
            aria-disabled={page === 1 || undefined}
            rel="prev"
          >
            <i className="ph ph-caret-left" aria-hidden="true" />
            <span className="ns-visually-hidden">Previous page</span>
          </a>
        </li>
        {pages.map((p, i) =>
          p === "…"
            ? <li key={`gap-${i}`} className="ns-pagination__ellipsis" aria-hidden="true">…</li>
            : (
              <li key={p}>
                <a
                  className="ns-pagination__link"
                  href={hrefFor(p)}
                  aria-current={p === page ? "page" : undefined}
                  /* The number alone is ambiguous out of context, so the
                     accessible name spells it out. */
                  aria-label={`Page ${p}`}
                >
                  {p}
                </a>
              </li>
            )
        )}
        <li>
          <a
            className="ns-pagination__link"
            href={page < totalPages ? hrefFor(page + 1) : undefined}
            aria-disabled={page === totalPages || undefined}
            rel="next"
          >
            <i className="ph ph-caret-right" aria-hidden="true" />
            <span className="ns-visually-hidden">Next page</span>
          </a>
        </li>
      </ul>
    </nav>
  );
}

/** Documentation sidebar. Grouped links with the active page marked by
 *  aria-current, which is both the styling hook and the announcement. */
export function DocsSidebar({ groups = [], currentHref, label = "Documentation", className = "" }) {
  return (
    <nav className={`ns-sidebar ${className}`.trim()} aria-label={label}>
      {groups.map((group) => (
        <div className="ns-sidebar__group" key={group.label}>
          <span className="ns-sidebar__label">{group.label}</span>
          {group.items.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="ns-sidebar__link"
              aria-current={item.href === currentHref ? "page" : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>
      ))}
    </nav>
  );
}
