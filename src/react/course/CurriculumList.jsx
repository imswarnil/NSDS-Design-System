import React from "react";
import { LessonType, LessonAccess } from "./LessonType.jsx";

/** A course's sections and their lessons. Renders .ns-curriculum from
 *  components/css/lms.css — the same anatomy the Ghost theme renders from
 *  templates/course-detail.html.
 *
 *  Native <details> per section, so open/closed state, keyboard operation and
 *  in-page find all come from the platform; this ships no toggle logic.
 *  Sections default to open, because a curriculum that starts collapsed hides
 *  the one thing a prospective learner is trying to evaluate.
 *
 *  THE KIND IS AN ICON, not a word (see LessonType). This list used to spell
 *  out VIDEO on every row, which is what made a curriculum read as a
 *  spreadsheet; the word now arrives on hover or keyboard focus. That frees
 *  the row's second line to carry what the glyph CANNOT say: whether the row
 *  is open to you, and whether it is a free preview.
 *
 *  A completed lesson carries its state in visually-hidden text as well as the
 *  tick — data-state paints it, but "(completed)" is what a screen reader
 *  actually hears. The same goes for a locked one: data-access dims it, and
 *  the row still says so out loud. */

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
            const locked = it.access === "members" || it.access === "soon";
            /* A locked row stays a LINK — to the upgrade page where there is
               one. A dead row explains nothing, and the titles of the locked
               rows are most of the argument for buying the course. */
            const href = locked && it.upgradeHref ? it.upgradeHref : (it.href || "#");
            const sub = it.access || it.badge;
            return (
              <a className="ns-lesson" key={i} href={href}
                 data-state={it.done ? "done" : undefined}
                 data-access={it.access}
                 aria-current={it.current ? "true" : undefined}>
                <span className="ns-lesson__index" aria-hidden="true">
                  {it.done ? <i className="ph ph-check-circle" /> : String(i + 1).padStart(2, "0")}
                </span>
                <span className="ns-lesson__body">
                  <span className="ns-lesson__title">
                    {it.title}
                    {it.done && <span className="ns-visually-hidden"> (completed)</span>}
                    {it.access === "members" && <span className="ns-visually-hidden"> (locked — members only)</span>}
                    {it.access === "soon" && <span className="ns-visually-hidden"> (not released yet)</span>}
                  </span>
                  {/* Rendered only when there is something to say. An empty
                      second line still costs the row its height. */}
                  {sub && (
                    <span className="ns-lesson__sub">
                      <LessonAccess access={it.access} label={it.accessLabel} />
                      {it.badge && (
                        <span className={`ns-lesson__badge${it.badge === "Preview" ? "" : " ns-lesson__badge--quiet"}`}>
                          {it.badge}
                        </span>
                      )}
                    </span>
                  )}
                </span>
                <LessonType kind={it.type} />
                <span className="ns-lesson__time">
                  {locked ? <i className="ph ph-lock" aria-hidden="true" /> : it.duration}
                </span>
              </a>
            );
          })}
        </details>
      ))}
    </div>
  );
}
