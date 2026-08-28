import React, { useId, useRef, useState } from "react";

/* Namaste UI — course & lesson creation primitives.
   =========================================================================
   The curriculum builder, title box, rich-text chrome, tag input, slug
   field and upload dropzone. Styling: components/css/admin.css. Behaviour
   here is only what markup cannot express — ids, keyboard reordering,
   controlled tag state; the classes carry everything visual. */

/** The big borderless title input — a lesson is written, not filled in. */
export function TitleBox({ placeholder = "Lesson title…", ...props }) {
  return <input className="ns-titlebox" type="text" placeholder={placeholder} aria-label="Title" {...props} />;
}

/** URL slug with its fixed mono prefix. */
export function SlugField({ prefix = "namaste.dev/courses/", id, ...props }) {
  const auto = useId();
  return (
    <span className="ns-slug">
      <span className="ns-slug__prefix" aria-hidden="true">{prefix}</span>
      <input className="ns-input ns-input--mono" id={id ?? auto} aria-label="URL slug" {...props} />
    </span>
  );
}

/** Rich-text chrome: quiet icon toolbar over a contenteditable writing area.
 *  Active marks are aria-pressed — the same grammar as every toggle here. */
export function RichText({ tools = DEFAULT_TOOLS, value, onCommand, children }) {
  return (
    <div className="ns-rte">
      <div className="ns-rte__bar" role="toolbar" aria-label="Formatting">
        {tools.map((t, i) =>
          t === "|" ? (
            <span key={`gap-${i}`} className="ns-rte__gap" aria-hidden="true" />
          ) : (
            <button
              key={t.cmd}
              type="button"
              className="ns-rte__btn"
              aria-label={t.label}
              aria-pressed={t.pressed ?? false}
              onClick={() => onCommand?.(t.cmd)}
            >
              <i className={`ph ${t.icon}`} aria-hidden="true" />
            </button>
          )
        )}
      </div>
      <div className="ns-rte__area" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Lesson body">
        {children ?? value}
      </div>
    </div>
  );
}

const DEFAULT_TOOLS = [
  { cmd: "bold", icon: "ph-text-b", label: "Bold" },
  { cmd: "italic", icon: "ph-text-italic", label: "Italic" },
  "|",
  { cmd: "h2", icon: "ph-text-h-two", label: "Heading 2" },
  { cmd: "h3", icon: "ph-text-h-three", label: "Heading 3" },
  "|",
  { cmd: "ul", icon: "ph-list-bullets", label: "Bulleted list" },
  { cmd: "ol", icon: "ph-list-numbers", label: "Numbered list" },
  { cmd: "quote", icon: "ph-quotes", label: "Quote" },
  "|",
  { cmd: "code", icon: "ph-code", label: "Code block" },
  { cmd: "link", icon: "ph-link", label: "Link" },
  { cmd: "image", icon: "ph-image", label: "Image" },
];

/** The curriculum builder — the course's structure, editable.
 *  sections: [{ id, title, lessons: [{ id, title, type, duration }] }]
 *  Reordering is keyboard-first: the grip button moves the focused row with
 *  ArrowUp/ArrowDown; pointer drag can be layered on by the host app. */
export function CurriculumBuilder({ sections = [], onChange, onAddLesson, onAddSection, onEditLesson, onRemoveLesson }) {
  const move = (si, li, dir) => {
    const next = sections.map((s) => ({ ...s, lessons: [...s.lessons] }));
    const arr = next[si].lessons;
    const to = li + dir;
    if (to < 0 || to >= arr.length) return;
    [arr[li], arr[to]] = [arr[to], arr[li]];
    onChange?.(next);
  };
  return (
    <div className="ns-builder">
      {sections.map((s, si) => (
        <section key={s.id} className="ns-builder__section">
          <header className="ns-builder__head">
            <span className="ns-builder__index">{String(si + 1).padStart(2, "0")}</span>
            <input
              className="ns-builder__title"
              defaultValue={s.title}
              aria-label={`Section ${si + 1} title`}
              onBlur={(e) => {
                const next = sections.map((x, i) => (i === si ? { ...x, title: e.target.value } : x));
                onChange?.(next);
              }}
            />
            <span className="ns-builder__meta">
              {s.lessons.length} lessons · {s.lessons.reduce((m, l) => m + (l.minutes ?? 0), 0)} min
            </span>
          </header>
          {s.lessons.map((l, li) => (
            <div key={l.id} className="ns-builder__row">
              <button
                type="button"
                className="ns-builder__grip"
                aria-label={`Reorder ${l.title} — arrow keys move it`}
                onKeyDown={(e) => {
                  if (e.key === "ArrowUp") { e.preventDefault(); move(si, li, -1); }
                  if (e.key === "ArrowDown") { e.preventDefault(); move(si, li, 1); }
                }}
              >
                <i className="ph ph-dots-six-vertical" aria-hidden="true" />
              </button>
              <span className="ns-builder__index">{String(li + 1).padStart(2, "0")}</span>
              <span className="ns-builder__name">{l.title}</span>
              <span className="ns-builder__type">{l.type}</span>
              {l.duration && <span className="ns-builder__dur">{l.duration}</span>}
              <span className="ns-builder__rowactions">
                <button type="button" className="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label={`Edit ${l.title}`} onClick={() => onEditLesson?.(s, l)}>
                  <i className="ph ph-pencil-simple" aria-hidden="true" />
                </button>
                <button type="button" className="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon" aria-label={`Remove ${l.title}`} onClick={() => onRemoveLesson?.(s, l)}>
                  <i className="ph ph-x" aria-hidden="true" />
                </button>
              </span>
            </div>
          ))}
          <button type="button" className="ns-builder__add" onClick={() => onAddLesson?.(s)}>
            <i className="ph ph-plus" aria-hidden="true" /> Add lesson
          </button>
        </section>
      ))}
      <button type="button" className="ns-builder__add" onClick={() => onAddSection?.()}>
        <i className="ph ph-plus" aria-hidden="true" /> Add section
      </button>
    </div>
  );
}

/** Chips-in-a-field tag entry. Controlled: value=[...tags]. Enter or comma
 *  commits; Backspace on an empty input removes the last tag. */
export function TagInput({ value = [], onChange, placeholder = "Add a tag…", label = "Tags" }) {
  const [draft, setDraft] = useState("");
  const inputRef = useRef(null);
  const commit = () => {
    const t = draft.trim().replace(/,+$/, "");
    if (t && !value.includes(t)) onChange?.([...value, t]);
    setDraft("");
  };
  return (
    <div className="ns-taginput" onClick={() => inputRef.current?.focus()}>
      {value.map((t) => (
        <span key={t} className="ns-taginput__tag">
          {t}
          <button type="button" className="ns-taginput__x" aria-label={`Remove ${t}`} onClick={() => onChange?.(value.filter((x) => x !== t))}>
            <i className="ph ph-x" aria-hidden="true" />
          </button>
        </span>
      ))}
      <input
        ref={inputRef}
        value={draft}
        aria-label={label}
        placeholder={value.length ? "" : placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") { e.preventDefault(); commit(); }
          if (e.key === "Backspace" && !draft && value.length) onChange?.(value.slice(0, -1));
        }}
        onBlur={commit}
      />
    </div>
  );
}

/** Upload target. The real input covers the zone; data-state="over" is set
 *  while a file is dragged across, resolving the dashed border to brand. */
export function Dropzone({ hint, accept, multiple, onFiles, compact, children }) {
  const [over, setOver] = useState(false);
  return (
    <label
      className={`ns-dropzone${compact ? " ns-dropzone--compact" : ""}`}
      data-state={over ? "over" : undefined}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={() => setOver(false)}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles?.([...e.dataTransfer.files]); }}
    >
      <i className="ph ph-upload-simple ns-dropzone__icon" aria-hidden="true" />
      <span>{children ?? "Drop a file here, or browse"}</span>
      {hint && <span className="ns-dropzone__hint">{hint}</span>}
      <input type="file" accept={accept} multiple={multiple} onChange={(e) => onFiles?.([...e.target.files])} />
    </label>
  );
}

/** One uploaded file as a terminal row: mono name, mono size, remove. */
export function FileRow({ name, size, onRemove }) {
  return (
    <div className="ns-upload">
      <i className="ph ph-file" aria-hidden="true" />
      <span className="ns-upload__name">{name}</span>
      <span className="ns-upload__size">{size}</span>
      {onRemove && (
        <button type="button" className="ns-btn ns-btn--quiet ns-btn--sm ns-btn--icon ns-upload__remove" aria-label={`Remove ${name}`} onClick={onRemove}>
          <i className="ph ph-x" aria-hidden="true" />
        </button>
      )}
    </div>
  );
}
