import React from "react";

/* NS Design System — the AI assistant surface, React side.
   =========================================================================
   Every component here renders the .ns-ai* classes from
   components/css/ai.css — the same markup templates/ai-chat.html carries, so
   the Ghost theme and the Next.js LMS render one assistant with two
   renderers rather than two that look alike until someone changes one.

   Nothing in this file styles itself: no style objects, no CSS-in-JS. State
   is expressed as ARIA or data-* attributes for the same reason it is in the
   stylesheet — the visual state and the announced state come from one
   source and cannot drift. */

const cx = (...parts) => parts.filter(Boolean).join(" ");

/* --- Shell ---------------------------------------------------------------
   Controlled: the parent owns `railOpen` so the same collapse can be driven
   from a keyboard shortcut, a route change or the bar's toggle. */
export function Assistant({ rail, children, railOpen = true, variant, className = "", ...rest }) {
  return (
    <div
      className={cx("ns-ai", variant && `ns-ai--${variant}`, className)}
      data-collapsed={railOpen ? "false" : "true"}
      {...rest}
    >
      {rail}
      <div className="ns-ai__main">{children}</div>
    </div>
  );
}

/* The top bar. `meta` is the course the conversation is anchored to — the
   mono half, because a student's history is organised by module. */
export function AssistantBar({ title, meta, onToggleRail, railOpen = true, actions }) {
  return (
    <header className="ns-ai__bar">
      {onToggleRail && (
        <button
          type="button" className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm"
          aria-label="Toggle conversations" aria-controls="ns-ai-rail"
          aria-expanded={railOpen ? "true" : "false"} onClick={onToggleRail}
        >
          <i className="ph ph-sidebar" aria-hidden="true" />
        </button>
      )}
      <span className="ns-ai__bar-title">{title}</span>
      {meta && <span className="ns-ai__bar-meta">{meta}</span>}
      {actions && <span className="ns-ai__bar-actions">{actions}</span>}
    </header>
  );
}

/* The scrolling transcript. The ref is exposed because autoscroll is the
   caller's decision: yanking a reader back to the bottom while they are
   re-reading the code block above is the most-hated behaviour in chat UI, so
   the app scrolls only when it was already near the end. */
export const AssistantThread = React.forwardRef(function AssistantThread({ children }, ref) {
  return (
    <div className="ns-ai__scroll" ref={ref}>
      <div className="ns-ai__inner">{children}</div>
    </div>
  );
});

/* The composer dock. The note is not optional and takes no prop to hide it:
   an LMS assistant talks to people who cannot yet tell when it is wrong. */
export function AssistantFoot({ children, note = "The assistant can be wrong. Check anything it says against the lesson it cites." }) {
  return (
    <div className="ns-ai__foot">
      {children}
      <p className="ns-ai__note">{note}</p>
    </div>
  );
}

/* --- Conversation rail ---------------------------------------------------
   `groups` is [{ label, items: [{ id, title, course, when }] }] — grouping is
   the caller's job because "Today" depends on a clock the component should
   not read. */
export function ConversationRail({ groups = [], activeId, onSelect, onNew, quota, brand = "Namaste AI", empty }) {
  return (
    <aside className="ns-ai__side" id="ns-ai-rail" aria-label="Conversations">
      <div className="ns-aiside__head">
        <span className="ns-aiside__brand"><i className="ph ph-sparkle" aria-hidden="true" />{brand}</span>
        <button type="button" className="ns-btn ns-btn--outline ns-btn--sm ns-btn--block" onClick={onNew}>
          <i className="ph ph-plus" aria-hidden="true" /> New chat
        </button>
      </div>

      <div className="ns-aiside__list">
        {groups.length === 0 && empty}
        {groups.map((g) => (
          <div className="ns-aiside__group" key={g.label}>
            <p className="ns-aiside__label">{g.label}</p>
            {g.items.map((c) => (
              <a
                key={c.id} className="ns-aiside__item" href={c.href || "#"}
                aria-current={c.id === activeId ? "true" : undefined}
                onClick={onSelect && ((e) => { e.preventDefault(); onSelect(c.id); })}
              >
                <span>
                  {c.course && <span className="ns-aiside__course">{c.course}</span>}
                  <span className="ns-aiside__title">{c.title}</span>
                </span>
                {c.when && <span className="ns-aiside__when">{c.when}</span>}
              </a>
            ))}
          </div>
        ))}
      </div>

      {quota && (
        <div className="ns-aiside__foot">
          <div className="ns-aiside__quota">
            <span className="ns-aiside__quota-row">{quota.label} <b>{quota.used} / {quota.total}</b></span>
            <progress className="ns-progress" value={quota.used} max={quota.total}
                      aria-label={`${quota.used} of ${quota.total} ${quota.label}`} />
            {quota.href && <a className="ns-link" href={quota.href}>{quota.cta || "Go unlimited with Pro"}</a>}
          </div>
        </div>
      )}
    </aside>
  );
}

/* --- Turns ---------------------------------------------------------------
   One entry in the transcript. The student and the assistant differ by
   structure, not hue: `role` picks the modifier and the CSS does the rest. */
export function Turn({ role = "agent", who, time, actions, children, state, className = "", ...rest }) {
  const user = role === "user";
  return (
    <article className={cx("ns-aiturn", `ns-aiturn--${user ? "user" : "agent"}`, className)} data-state={state} {...rest}>
      <header className="ns-aiturn__head">
        {user
          ? <span className="ns-avatar ns-avatar--sm" aria-hidden="true">{who || "You"}</span>
          : <span className="ns-aiturn__mark" aria-hidden="true"><i className="ph ph-sparkle" /></span>}
        {user ? "You" : "Assistant"}
        {time && <time>{time}</time>}
      </header>
      {children}
      {actions && <footer className="ns-aiturn__actions">{actions}</footer>}
    </article>
  );
}

/* The body. Assistant prose gets .ns-prose so headings, lists and code inside
   a generated answer are typeset like the rest of the reading layer. */
export function TurnBody({ prose = false, children }) {
  return <div className={cx("ns-aiturn__body", prose && "ns-prose")}>{children}</div>;
}

/* --- Waiting -------------------------------------------------------------
   The label is the status; the dots are decoration. Name the stage —
   "Reading your progress" tells a waiting student more than a spinner. */
export function Thinking({ label = "Thinking" }) {
  return (
    <p className="ns-aithinking" role="status" aria-live="polite">
      <span className="ns-aithinking__dots" aria-hidden="true"><i /><i /><i /></span>
      {label}
    </p>
  );
}

/* Appended to the last text node while tokens arrive. */
export function StreamCaret() {
  return <span className="ns-aistream" aria-hidden="true" />;
}

/* What it read, as chips. A failed tool is shown, not swallowed — otherwise
   the answer quietly becomes an unsourced one. */
export function ToolCall({ label, state = "done", count }) {
  const icon = state === "running" ? "circle-notch" : state === "failed" ? "x" : "check";
  return (
    <span className="ns-aitool" data-state={state}>
      <i className={`ph ph-${icon}`} aria-hidden="true" />
      {label}
      {typeof count !== "undefined" && <span className="ns-aitool__count">{count}</span>}
    </span>
  );
}

/* The reasoning trace — a real <details>, collapsed by default. */
export function Trace({ steps = [], open = false, summary = "How I answered this" }) {
  return (
    <details className="ns-aitrace" open={open}>
      <summary>
        <i className="ph ph-caret-right" aria-hidden="true" /> {summary}
        <span className="ns-aisource__num">{steps.length} steps</span>
      </summary>
      <div className="ns-aitrace__steps">
        {steps.map((s, i) => (
          <p className="ns-aitrace__step" key={i}>
            <i className="ph ph-check" aria-hidden="true" />
            <span><b>{s.verb}</b> {s.text}</span>
          </p>
        ))}
      </div>
    </details>
  );
}
