import React from "react";
/** Post card. Renders .ns-card + .ns-bcard from components/css/blog.css, which
 *  is the same anatomy the Ghost theme renders from templates/blog-listing.html. */
export function BlogCard({ title, excerpt, image, tag, meta, href = "#", className = "", ...rest }) {
  return (
    <article className={["ns-card", "ns-bcard", className].filter(Boolean).join(" ")} {...rest}>
      <span className="ns-bcard__cover">
        {image
          ? <img className="ns-card__media" src={image} alt="" />
          : <span className="ns-card__media ns-bcard__cover--empty" aria-hidden="true"><i className="ph ph-article" /></span>}
        {tag && <span className="ns-tag ns-bcard__cat">{tag}</span>}
      </span>
      <div className="ns-card__body">
        <a className="ns-card__link" href={href}><h3 className="ns-bcard__title">{title}</h3></a>
        {excerpt && <p className="ns-bcard__excerpt">{excerpt}</p>}
        {meta && <div className="ns-card__foot">{meta}</div>}
      </div>
    </article>
  );
}
