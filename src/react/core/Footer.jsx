import React from "react";
import { Logo } from "./Logo.jsx";
/** Site footer — logo, link columns, mono legal bar. Hairline top border, no
 *  dark band: the footer is the end of the page, not a second hero.
 *  Styling lives in components/css/sections.css as .ns-footer;
 *  templates/footer.html is the Handlebars-side equivalent. */
export function Footer({ columns = [], socialIcons = [], blurb, children, className = "", ...rest }) {
  return (
    <footer className={["ns-footer", className].filter(Boolean).join(" ")} {...rest}>
      <div className="ns-footer__grid">
        <div className="ns-footer__col">
          <Logo />
          {blurb && <p className="ns-footer__blurb">{blurb}</p>}
          {socialIcons.length > 0 && (
            <ul className="ns-footer__social">
              {socialIcons.map((icon) => (
                <li key={icon}><a href="#"><i className={`ph ${icon}`} aria-hidden="true" /></a></li>
              ))}
            </ul>
          )}
        </div>
        {columns.map((col) => (
          <div className="ns-footer__col" key={col.title}>
            <div className="ns-footer__head">{col.title}</div>
            <ul>{col.links.map((l) => <li key={l.label || l}><a href={l.href || "#"}>{l.label || l}</a></li>)}</ul>
          </div>
        ))}
      </div>
      <div className="ns-footer__bar">{children}</div>
    </footer>
  );
}
