import React from "react";
/** Horizontal step progress — mono-numbered nodes on a connecting hairline.
 *
 *  Distinct from CurriculumList (many lesson rows) and .ns-steps (an anonymous
 *  tick bar): this is a short LABELLED flow the reader is currently inside —
 *  checkout, onboarding, a quiz. Styling lives in components/css/progress.css
 *  as .ns-stepper; templates/stepper.html is the Handlebars-side equivalent.
 *
 *  It renders an <ol>, because the thing being described is an ordered list of
 *  steps, and aria-current marks where the reader is. */
export function TimelineStepper({ steps = [], activeIndex = 0, className = "", ...rest }) {
  return (
    <ol className={["ns-stepper", className].filter(Boolean).join(" ")} {...rest}>
      {steps.map((s, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "current" : undefined;
        return (
          <React.Fragment key={i}>
            <li className="ns-stepper__step" data-state={state}
                aria-current={state === "current" ? "step" : undefined}>
              <span className="ns-stepper__node">
                {state === "done"
                  ? <i className="ph ph-check-circle" aria-hidden="true" />
                  : String(i + 1).padStart(2, "0")}
              </span>
              <span className="ns-stepper__label">{s}</span>
            </li>
            {i < steps.length - 1 && (
              <li className="ns-stepper__line" aria-hidden="true"
                  data-state={i < activeIndex ? "done" : undefined} />
            )}
          </React.Fragment>
        );
      })}
    </ol>
  );
}
