import React from "react";
/** A course's sections and their lessons. Renders .ns-curriculum from
 *  components/css/lms.css — the same anatomy the Ghost theme renders from
 *  templates/course-detail.html.
 *
 *  Native <details> per section, so open/closed state, keyboard operation and
 *  in-page find all come from the platform; this ships no toggle logic.
 *  Sections default to open, because a curriculum that starts collapsed hides
 *  the one thing a prospective learner is trying to evaluate.
 *
 *  A completed lesson carries its state in visually-hidden text as well as the
 *  tick — data-state paints it, but "(completed)" is what a screen reader
 *  actually hears. */
const TYPES = {
  video: ["ph-video", "Video"],
  article: ["ph-article", "Article"],
  quiz: ["ph-exam", "Quiz"],
  exercise: ["ph-barbell", "Exercise"],
};

export function CurriculumList({ sections = [], totals, className = "", ...rest }) {
  return (
    <div className={["ns-curriculum", className].filter(Boolean).join(" ")} {...rest}>
      {totals && (
        <div className="ns-curriculum__bar">
          <span className="ns-curriculum__totals">{totals}</span>
        </div>
      )}
      {sections.map((section, s) => (
        <details className="ns-curriculum__section" key={s} open={section.open !== false}>
          <summary className="ns-curriculum__head">
            <span className="ns-curriculum__index">{String(s + 1).padStart(2, "0")}</span>
            <h3 className="ns-curriculum__title">{section.title}</h3>
            <span className="ns-curriculum__meta">
              {section.done && <span className="ns-curriculum__done">{section.done}</span>}
              {section.duration && <span>{section.duration}</span>}
              <i className="ph ph-caret-down ns-curriculum__toggle" aria-hidden="true" />
            </span>
          </summary>
          {(section.lessons || []).map((it, i) => {
            const [icon, label] = TYPES[it.type] || TYPES.article;
            return (
              <a className="ns-lesson" key={i} href={it.href || "#"}
                 data-state={it.done ? "done" : undefined}
                 aria-current={it.current ? "true" : undefined}>
                <span className="ns-lesson__index" aria-hidden="true">
                  {it.done ? <i className="ph ph-check" /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className="ns-lesson__body">
                  <span className="ns-lesson__title">
                    {it.title}
                    {it.done && <span className="ns-visually-hidden"> (completed)</span>}
                  </span>
                  <span className="ns-lesson__sub">
                    <span className={`ns-ltype ns-ltype--${it.type || "article"}`}>
                      <i className={`ph ${icon}`} aria-hidden="true" />{label}
                    </span>
                  </span>
                </span>
                {it.duration && <span className="ns-lesson__time">{it.duration}</span>}
              </a>
            );
          })}
        </details>
      ))}
    </div>
  );
}
