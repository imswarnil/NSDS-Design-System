import React from "react";

/* Namaste UI — form controls for the Next.js LMS.
   =========================================================================
   These components own NO styling. Every visual decision lives in
   components/css/form.css, which the Ghost theme also renders. What they own
   is the WIRING that a Handlebars template cannot express: generating unique
   ids, connecting aria-describedby to the right help and error nodes, and
   keeping aria-invalid in sync with whether an error is actually present.

   That wiring is the part teams get wrong. A field with a visible error and
   no aria-describedby is a field where a screen-reader user hears "Email,
   edit text" and no reason why the form refused to submit. */

/* useId is React's SSR-safe id generator — important here because Next.js
   renders these on the server first, and a random id would mismatch on
   hydration and silently break the label→control association. */
function useFieldIds(id) {
  const auto = React.useId();
  const base = id || auto;
  return { id: base, helpId: `${base}-help`, errorId: `${base}-error` };
}

/** Label + control + help/error, wired together. Wrap every control in one —
 *  it is what guarantees the control has a real label and that its error is
 *  announced rather than merely displayed. */
export function Field({ label, help, error, required, id, children, className = "", ...rest }) {
  const ids = useFieldIds(id);
  /* Only reference describedby targets that will actually be rendered.
     Pointing at a missing id makes some screen readers announce nothing at
     all rather than skipping the missing node. */
  const describedBy = [help ? ids.helpId : null, error ? ids.errorId : null].filter(Boolean).join(" ") || undefined;

  return (
    <div className={`ns-field ${className}`.trim()} {...rest}>
      {label && (
        <label className="ns-field__label" htmlFor={ids.id}>
          {label}
          {required && <span className="ns-field__required" aria-hidden="true">*</span>}
        </label>
      )}
      {/* The control is cloned rather than rendered blind so the caller writes
          <Field label="Email"><Input type="email" /></Field> and the id,
          aria-describedby, aria-invalid and required all attach themselves. */}
      {React.isValidElement(children)
        ? React.cloneElement(children, {
            id: ids.id,
            "aria-describedby": describedBy,
            "aria-invalid": error ? true : undefined,
            required: required || children.props.required,
          })
        : children}
      {help && <p className="ns-field__help" id={ids.helpId}>{help}</p>}
      {/* role="alert" so a validation failure arriving after submit is spoken
          immediately — the user has already left this field by then. */}
      {error && <p className="ns-field__error" id={ids.errorId} role="alert">{error}</p>}
    </div>
  );
}

/** Text input. `icon` takes a Phosphor class; `hint` renders the ⌘K-style key
 *  hint on the right. Both adjust padding via modifier classes, never inline
 *  style, so the Handlebars version is byte-identical. */
export function Input({ icon, hint, className = "", mono, ...rest }) {
  const classes = ["ns-input", mono && "ns-input--mono", icon && "ns-input--has-icon", hint && "ns-input--has-hint", className]
    .filter(Boolean).join(" ");
  const input = <input className={classes} {...rest} />;
  if (!icon && !hint) return input;
  return (
    <span className="ns-input-wrap">
      {icon && <i className={`ph ${icon} ns-input-wrap__icon`} aria-hidden="true" />}
      {input}
      {/* aria-hidden: the shortcut is a visual affordance. A keyboard user
          reaching this field by Tab does not need "Command K" read out. */}
      {hint && <kbd className="ns-input-wrap__hint" aria-hidden="true">{hint}</kbd>}
    </span>
  );
}

/** Native <select>. Deliberately not a custom listbox: the native control is
 *  already correct for keyboard, screen readers and mobile, and reimplementing
 *  it buys nothing this product needs. */
export function Select({ options = [], placeholder, className = "", children, ...rest }) {
  return (
    <select className={`ns-select ${className}`.trim()} {...rest}>
      {/* A disabled placeholder option rather than an empty selectable one, so
          "Choose a level" cannot be submitted as a value. */}
      {placeholder && <option value="" disabled>{placeholder}</option>}
      {children ?? options.map((o) => {
        const opt = typeof o === "string" ? { value: o, label: o } : o;
        return <option key={opt.value} value={opt.value} disabled={opt.disabled}>{opt.label}</option>;
      })}
    </select>
  );
}

export function Textarea({ className = "", rows = 4, ...rest }) {
  return <textarea className={`ns-textarea ${className}`.trim()} rows={rows} {...rest} />;
}

/* Checkbox and radio share a wrapper. The <input> sits INSIDE the <label>, so
   the whole row is a click target with no `for`/`id` pairing to get wrong —
   and the label text is the accessible name automatically. */
function Choice({ type, label, help, className = "", id, inputRef, ...rest }) {
  const auto = React.useId();
  const base = id || auto;
  const helpId = help ? `${base}-help` : undefined;
  return (
    <label className={`ns-choice ${className}`.trim()} htmlFor={base}>
      <input
        type={type}
        id={base}
        className={type === "checkbox" ? "ns-checkbox" : "ns-radio"}
        aria-describedby={helpId}
        ref={inputRef}
        {...rest}
      />
      <span className="ns-choice__text">
        <span className="ns-choice__label">{label}</span>
        {help && <span className="ns-choice__help" id={helpId}>{help}</span>}
      </span>
    </label>
  );
}

/** `indeterminate` is a DOM property, not an attribute — React cannot set it
 *  declaratively, so it is applied through a ref. Without this the "some
 *  lessons complete" state in a curriculum tree is unreachable. */
export function Checkbox({ indeterminate, ...rest }) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    if (ref.current) ref.current.indeterminate = Boolean(indeterminate);
  }, [indeterminate]);
  /* inputRef, not ref: Choice is a plain function component, so a bare `ref`
     would not reach the <input> and indeterminate would silently never set. */
  return <Choice type="checkbox" inputRef={ref} {...rest} />;
}

export function Radio(props) {
  return <Choice type="radio" {...props} />;
}

/** Use for a setting that applies IMMEDIATELY (theme, email digest). If the
 *  change only lands on submit, use Checkbox — the control shape is a promise
 *  about when the change takes effect, and breaking it is a real usability
 *  bug, not a stylistic one. */
export function Switch({ className = "", ...rest }) {
  return <input type="checkbox" role="switch" className={`ns-switch ${className}`.trim()} {...rest} />;
}

/** Groups related choices. Real <fieldset>/<legend> — this is what tells a
 *  screen reader that four radios are one question rather than four. */
export function Fieldset({ legend, children, className = "", ...rest }) {
  return (
    <fieldset className={`ns-fieldset ${className}`.trim()} {...rest}>
      {legend && <legend className="ns-fieldset__legend">{legend}</legend>}
      {children}
    </fieldset>
  );
}
