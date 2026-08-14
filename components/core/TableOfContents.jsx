import React from "react";
/** Scroll-spy table of contents — hairline rail, active item gets a brand-blue
 *  leading bar. Styling lives in components/css/blog.css as .ns-toc.
 *
 *  Active state is aria-current, not a class: the CSS keys off the same
 *  attribute a screen reader announces, so the highlighted item and the
 *  announced item cannot drift apart. Two levels only — a TOC that needs
 *  three is a TOC for a page that needs splitting. */
export function TableOfContents({ items = [], activeId, onNavigate, title = "On this page", className = "", ...rest }) {
  return (
    <nav aria-label="Table of contents"
         className={["ns-toc", className].filter(Boolean).join(" ")} {...rest}>
      {title && <span className="ns-toc__title">{title}</span>}
      {items.map((it) => (
        <a key={it.id}
           href={`#${it.id}`}
           className={`ns-toc__link${it.level === 3 ? " ns-toc__link--sub" : ""}`}
           aria-current={it.id === activeId ? "true" : undefined}
           onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(it.id); } : undefined}>
          {it.label}
        </a>
      ))}
    </nav>
  );
}
