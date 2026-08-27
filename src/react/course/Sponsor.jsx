import React from "react";

/* Namaste UI — the sponsor card.
   =========================================================================
   The paid surface, in four shapes. Styling is in
   components/css/monetization.css, shared with the Ghost theme.

   THE RULES, enforced here rather than left to each caller:

     1. IT SAYS SO. The label is not a prop you can omit — only one you can
        reword ("Sponsored" / "Sponsor" / "Partner"). A paid block that looks
        like editorial is not a design choice, it is a lie, and the first one
        costs the whole site's credibility.

     2. IT NEVER TAKES THE PRIMARY. Solid brand blue is the one action on a
        screen, and on a lesson page that action is "next lesson", not "visit
        our sponsor". There is no prop that makes this louder.

     3. THE CTA IS A <span>, not a button or a link. The whole card is the
        link; a link inside a link is invalid and unnavigable, and a <button>
        inside an <a> swallows the click. It is styled as a text link with an
        arrow — the same shape "read more" takes everywhere else — rather than
        as a button, which would compete with the one real action on the page.

     4. IT IS SET IN THE READING FACE. Mono in this system means data: a
        timestamp, an index, a count. A sponsor is a sentence someone wrote
        about their product, so weight and colour carry the hierarchy the way
        they do in the prose beside it. */

/** shape → what it is for. --square drops the description in CSS rather than
 *  clamping it: two words of a sentence followed by an ellipsis is worse than
 *  no sentence, and the tagline is already the short version. */
export function Sponsor({
  shape = "square",
  label = "Sponsored",
  logo,
  name,
  tagline,
  description,
  cta,
  href,
  className = "",
  ...rest
}) {
  const Tag = href ? "a" : "div";
  return (
    <Tag
      className={["ns-sponsor", `ns-sponsor--${shape}`, className].filter(Boolean).join(" ")}
      href={href}
      {...rest}
    >
      {/* The dot is drawn by CSS, so the label is text and nothing else — it
          has to be readable, translatable and announced. */}
      <span className="ns-sponsor__label">{label}</span>
      {/* The sponsor's NAME as the alt, so the card announces who it is for
          before it announces what it says. */}
      {logo && <img className="ns-sponsor__logo" src={logo} alt={typeof name === "string" ? name : ""} />}
      <span className="ns-sponsor__body">
        {name && <span className="ns-sponsor__name">{name}</span>}
        {tagline && <span className="ns-sponsor__tagline">{tagline}</span>}
        {description && <span className="ns-sponsor__text">{description}</span>}
      </span>
      {cta && (
        <span className="ns-sponsor__cta">
          {cta} <i className="ph ph-arrow-right" aria-hidden="true" />
        </span>
      )}
    </Tag>
  );
}

/** The empty slot, before a sponsor is sold. Dashed and plainly unfinished on
 *  purpose — it is the one surface in the system allowed to look like a
 *  placeholder, because that is exactly what it is. Never ship it to a reader:
 *  it is for the layout stage and for the sales page. */
export function SponsorSlotEmpty({ label = "Advertise with us", className = "", ...rest }) {
  return (
    <div className={["ns-adslot", className].filter(Boolean).join(" ")} {...rest}>
      <span className="ns-adslot__label">
        <i className="ph ph-megaphone" aria-hidden="true" />{label}
      </span>
    </div>
  );
}
