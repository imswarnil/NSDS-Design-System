import React from "react";
import { CourseCard } from "../course/CourseCard.jsx";

/* NS Design System — what an answer can carry.
   =========================================================================
   This file is the reason the assistant is a component family and not a chat
   box: an answer renders the product's own objects. Attachments delegate to
   the REAL CourseCard from components/course — a course recommended in chat
   and the same course on the catalog page are one component, not two that
   drift apart the first time someone edits a meta row.

   Renders .ns-aiattach / .ns-aisnippet / .ns-aipath / .ns-aisource /
   .ns-aicheck / .ns-aierror from components/css/ai.css. */

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* The grid an answer drops objects into. `label` says WHY these are here,
   which is the part a bare card grid leaves out. */
export function Attachments({ label, single = false, children }) {
  return (
    <div>
      {label && <p className="ns-aiattach__label">{label}</p>}
      <div className={cx("ns-aiattach", single && "ns-aiattach--single")}>{children}</div>
    </div>
  );
}

/* Course recommendations. The compact shape, because a card inside a message
   is a reference, not a shop window. */
export function CourseAttachment({ courses = [], label = "Covers this, in order" }) {
  return (
    <Attachments label={label}>
      {courses.map((c) => (
        <CourseCard key={c.href || c.title} className="ns-ccard--compact" {...c} />
      ))}
    </Attachments>
  );
}

/* A link, unfurled: blog post, doc page, external reference. */
export function Snippet({ kicker, title, description, meta, image, host, href = "#" }) {
  return (
    <a className="ns-aisnippet" href={href}>
      {image && <img className="ns-aisnippet__thumb" src={image} alt="" />}
      <span>
        {kicker && <span className="ns-aisnippet__kicker">{kicker}</span>}
        <span className="ns-aisnippet__title">{title}</span>
        {description && <span className="ns-aisnippet__desc">{description}</span>}
        {(host || meta) && (
          <span className="ns-aisnippet__meta">
            <i className="ph ph-globe" aria-hidden="true" />
            {[host, meta].filter(Boolean).join(" · ")}
          </span>
        )}
      </span>
    </a>
  );
}

/* An image, always captioned — and badged when it was generated. An
   unlabelled generated diagram is one a student will cite in an exam. */
export function AnswerImage({ src, alt, caption, generated = false }) {
  return (
    <figure className="ns-aiimage">
      <img src={src} alt={alt} />
      <figcaption className="ns-aiimage__cap">
        {caption}
        {generated && (
          <span className="ns-badge ns-badge--warning">
            <span className="ns-badge__dot" aria-hidden="true" />Generated
          </span>
        )}
      </figcaption>
    </figure>
  );
}

/* --- Learning path -------------------------------------------------------
   The assistant's most product-specific output. Steps a student has already
   finished are marked done rather than dropped: seeing what you have
   finished is half the motivation, and data-state carries it so "done" is
   never color alone. */
export function LearningPath({ title, meta, steps = [], onSave, saveLabel = "Save as my path", footMeta, children }) {
  return (
    <div className="ns-aipath">
      <div className="ns-aipath__head">
        <span className="ns-aipath__title">{title}</span>
        {meta && <span className="ns-aipath__meta">{meta}</span>}
      </div>
      <div className="ns-aipath__steps">
        {steps.map((s, i) => (
          <a className="ns-aipath__step" href={s.href || "#"} key={i} data-state={s.done ? "done" : undefined}>
            <span className="ns-aipath__index">{String(i + 1).padStart(2, "0")}</span>
            <span>
              <span className="ns-aipath__name">{s.name}</span>
              {s.sub && <span className="ns-aipath__sub">{s.sub}</span>}
            </span>
            {s.when && <span className="ns-aipath__when">{s.done ? "done" : s.when}</span>}
          </a>
        ))}
      </div>
      {(onSave || footMeta || children) && (
        <div className="ns-aipath__foot">
          {onSave && (
            <button type="button" className="ns-btn ns-btn--outline ns-btn--sm" onClick={onSave}>
              <i className="ph ph-bookmark-simple" aria-hidden="true" /> {saveLabel}
            </button>
          )}
          {children}
          {footMeta && <span className="ns-aipath__meta">{footMeta}</span>}
        </div>
      )}
    </div>
  );
}

/* Attribution. Numbered so the prose can reference [1] inline. */
export function Sources({ label = "Sources", items = [] }) {
  if (!items.length) return null;
  return (
    <div className="ns-aisource">
      <span className="ns-aisource__label">{label}</span>
      {items.map((s, i) => (
        <a className="ns-aisource__item" href={s.href || "#"} key={i}>
          <span className="ns-aisource__num">{i + 1}</span> {s.title}
          {s.external && <i className="ph ph-arrow-square-out" aria-hidden="true" />}
        </a>
      ))}
    </div>
  );
}

/* The teaching move: one question back, as a real radio group. */
export function PracticeCheck({ name, question, options = [], kicker = "// Quick check", onCheck, onSkip }) {
  return (
    <div className="ns-aicheck">
      <span className="ns-aicheck__kicker">{kicker}</span>
      <p className="ns-aicheck__q">{question}</p>
      <div className="ns-aicheck__options">
        {options.map((o, i) => (
          <label className="ns-choice" key={i}>
            <input className="ns-radio" type="radio" name={name} value={i} />
            <span className="ns-choice__text"><span className="ns-choice__label">{o}</span></span>
          </label>
        ))}
      </div>
      <div className="ns-aicheck__foot">
        <button type="button" className="ns-btn ns-btn--primary ns-btn--sm" onClick={onCheck}>Check answer</button>
        {onSkip && <button type="button" className="ns-btn ns-btn--quiet ns-btn--sm" onClick={onSkip}>Skip</button>}
      </div>
    </div>
  );
}

/* --- Failures ------------------------------------------------------------
   Rendered inside the transcript, in the assistant's slot, because that is
   where the student is looking and because a failed turn must stay in the
   record. `variant`: error (default) | limit | offline.

   `text` should always say what happened to the input. "Nothing you typed
   was lost" is the sentence people are actually looking for. */
export function AnswerError({ variant = "error", icon, title, text, code, children }) {
  const glyph = icon || (variant === "limit" ? "timer" : variant === "offline" ? "plugs" : "warning-circle");
  return (
    <div className={cx("ns-aierror", variant !== "error" && `ns-aierror--${variant}`)} role="alert">
      <p className="ns-aierror__head"><i className={`ph ph-${glyph}`} aria-hidden="true" /> {title}</p>
      {text && <p className="ns-aierror__text">{text}</p>}
      {(children || code) && (
        <div className="ns-aierror__actions">
          {children}
          {code && <span className="ns-aierror__code">{code}</span>}
        </div>
      )}
    </div>
  );
}

/* The sign-in gate. The reason comes first: answers are built from this
   student's own progress, which an anonymous session does not have. */
export function SignInGate({ title = "Sign in to ask", text, benefits = [], children, fine }) {
  return (
    <div className="ns-aigate">
      <div>
        <h2 className="ns-aigate__title">{title}</h2>
        {text && <p className="ns-aigate__text">{text}</p>}
      </div>
      {benefits.length > 0 && (
        <ul className="ns-aigate__list">
          {benefits.map((b, i) => (
            <li key={i}><i className="ph ph-check" aria-hidden="true" /> {b}</li>
          ))}
        </ul>
      )}
      {children}
      {fine && <p className="ns-aigate__text">{fine}</p>}
    </div>
  );
}
