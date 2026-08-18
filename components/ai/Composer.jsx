import React from "react";

/* NS Design System — the assistant composer.
   =========================================================================
   Renders .ns-aicomposer from components/css/ai.css. Uncontrolled-friendly:
   pass `value`/`onChange` for a controlled box, or leave them off and read
   the form on submit.

   Two contracts this component owns rather than leaving to the app, because
   both are wrong by default in every chat UI:

     Enter sends, Shift+Enter breaks the line — and the hint says so. A chat
     where Enter inserts a newline strands people who never find the button;
     one where Shift+Enter sends posts half a question to a class.

     The context pill is explicit. "Explain this bit" only means the
     paragraph in front of the student if the lesson is genuinely in scope,
     so what the assistant can see is stated on the control and removable. */

const cx = (...parts) => parts.filter(Boolean).join(" ");

export function Composer({
  id = "ns-ai-input",
  value, onChange, onSend,
  placeholder = "Ask about this lesson, paste your Apex, or ask for a project…",
  context = [], files = [], onRemoveContext, onRemoveFile,
  mode, onModeClick, onAttach, onDictate,
  max = 4000, disabled = false, hint = "Enter to send · Shift+Enter for a new line",
  label = "Ask the assistant", className = "",
}) {
  const length = (value || "").length;
  const countState = length > max ? "over" : length > max * 0.9 ? "near" : "ok";

  function keyDown(e) {
    if (e.key !== "Enter" || e.shiftKey) return;
    e.preventDefault();
    if (!disabled && onSend) onSend();
  }

  return (
    <form
      className={cx("ns-aicomposer", className)}
      aria-disabled={disabled ? "true" : undefined}
      onSubmit={(e) => { e.preventDefault(); if (!disabled && onSend) onSend(); }}
    >
      {(context.length > 0 || files.length > 0) && (
        <div className="ns-aifiles">
          {context.map((c) => (
            <span className="ns-aicontext" key={c.id}>
              <i className={`ph ph-${c.icon || "book-open-text"}`} aria-hidden="true" /> {c.label}
              {onRemoveContext && (
                <button type="button" className="ns-aicontext__x" aria-label={`Remove ${c.label} from context`}
                        onClick={() => onRemoveContext(c.id)}>
                  <i className="ph ph-x" aria-hidden="true" />
                </button>
              )}
            </span>
          ))}
          {files.map((f) => (
            <span className="ns-aifile" key={f.id} data-state={f.state}>
              <i className={`ph ph-${f.state === "uploading" ? "circle-notch" : f.state === "failed" ? "warning" : "file-text"}`} aria-hidden="true" />
              <span className="ns-aifile__name">{f.name}</span>
              {f.size && <span className="ns-aifile__size">{f.size}</span>}
              {onRemoveFile && f.state !== "uploading" && (
                <button type="button" className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--xs"
                        aria-label={`Remove ${f.name}`} onClick={() => onRemoveFile(f.id)}>
                  <i className="ph ph-x" aria-hidden="true" />
                </button>
              )}
            </span>
          ))}
        </div>
      )}

      {/* A visually hidden real label. A placeholder is not a label: it is
          gone the moment someone types. */}
      <label className="ns-visually-hidden" htmlFor={id}>{label}</label>
      <textarea
        className="ns-aicomposer__area" id={id} rows={2} placeholder={placeholder}
        value={value} onChange={onChange && ((e) => onChange(e.target.value))}
        onKeyDown={keyDown} disabled={disabled}
      />

      <div className="ns-aicomposer__bar">
        {mode && (
          <button type="button" className="ns-aimode" aria-haspopup="true" aria-expanded="false" onClick={onModeClick}>
            <i className={`ph ph-${mode.icon || "graduation-cap"}`} aria-hidden="true" /> {mode.label}
            <i className="ph ph-caret-down" aria-hidden="true" />
          </button>
        )}
        {onAttach && (
          <button type="button" className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Attach a file" onClick={onAttach}>
            <i className="ph ph-paperclip" aria-hidden="true" />
          </button>
        )}
        {onDictate && (
          <button type="button" className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Dictate" onClick={onDictate}>
            <i className="ph ph-microphone" aria-hidden="true" />
          </button>
        )}
        <span className="ns-aicomposer__spacer" />
        {typeof value === "string" && (
          <span className="ns-aicomposer__count" data-state={countState}>{length} / {max}</span>
        )}
        <span className="ns-aicomposer__hint">{hint}</span>
        <button type="submit" className="ns-btn ns-btn--primary ns-btn--icon ns-btn--sm"
                aria-label="Send message" disabled={disabled || countState === "over"}>
          <i className="ph ph-paper-plane-tilt" aria-hidden="true" />
        </button>
      </div>
    </form>
  );
}

/* The empty state. Starters FILL the composer, they do not send it — the
   student almost always edits a word first, and a question they did not
   finish reading is a wasted turn. */
export function Welcome({ title = "What are we working on?", lede, starters = [], onPick }) {
  return (
    <div className="ns-aiwelcome">
      <span className="ns-aiwelcome__mark" aria-hidden="true"><i className="ph ph-sparkle" /></span>
      <div>
        <h2 className="ns-aiwelcome__title">{title}</h2>
        {lede && <p className="ns-aiwelcome__lede">{lede}</p>}
      </div>
      {starters.length > 0 && (
        <div className="ns-aisuggest">
          {starters.map((s, i) => (
            <button type="button" className="ns-aisuggest__item" key={i} onClick={() => onPick && onPick(s.text)}>
              <span className="ns-aisuggest__kicker">
                <i className={`ph ph-${s.icon || "sparkle"}`} aria-hidden="true" />{s.kicker}
              </span>
              <span className="ns-aisuggest__text">{s.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
