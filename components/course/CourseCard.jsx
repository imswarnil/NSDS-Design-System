import React from "react";
/** The course card. Renders .ns-card + .ns-ccard from components/css/lms.css,
 *  which is the same anatomy the Ghost theme renders from
 *  templates/course-listing.html — one component, two renderers.
 *
 *  Data-forward by design: the level, duration and lesson count are mono
 *  metadata on the face of the card, not a tooltip. Hover is a border brighten
 *  and a 2px top accent, never a lift. */
export function CourseCard({
  title, excerpt, image, level, price, lessons, duration, badge,
  progress, href = "#", className = "", ...rest
}) {
  return (
    <div className={["ns-card", "ns-ccard", className].filter(Boolean).join(" ")} {...rest}>
      <span className="ns-ccard__mediawrap">
        {image
          ? <img className="ns-card__media" src={image} alt="" />
          : <span className="ns-card__media" aria-hidden="true"><i className="ph ph-graduation-cap" /></span>}
        {level && <span className="ns-tag ns-ccard__level">{level}</span>}
        {badge && <span className="ns-ccard__badge">{badge}</span>}
      </span>
      <div className="ns-card__body">
        <span className="ns-card__kicker">// Course</span>
        <a className="ns-card__link" href={href}><span className="ns-card__title">{title}</span></a>
        {excerpt && <p className="ns-card__text">{excerpt}</p>}
        {typeof progress === "number" && (
          <progress className="ns-progress ns-ccard__progress" value={progress} max="100" aria-label={`${title} progress`} />
        )}
      </div>
      <div className="ns-card__foot">
        {typeof lessons !== "undefined" && <span>{lessons} lessons</span>}
        {duration && <span className="ns-ccard__dur">{duration}</span>}
        {price && <span className="ns-ccard__meta">{price}</span>}
      </div>
    </div>
  );
}
