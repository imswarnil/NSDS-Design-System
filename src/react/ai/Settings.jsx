import React from "react";

/* NS Design System — assistant settings.
   =========================================================================
   Renders .ns-aiset from components/css/ai.css. Rows, not cards: a settings
   screen is a list of decisions, and a card grid turns it into a shopping
   page.

   Presentational on purpose — every control is a real form element and the
   value/handler pair belongs to the app, so this file never holds a
   preference that also lives on a server. */

const cx = (...parts) => parts.filter(Boolean).join(" ");

export function SettingsGroup({ legend, children }) {
  return (
    <section className="ns-aiset">
      <h2 className="ns-aiset__legend">{legend}</h2>
      {children}
    </section>
  );
}

/* One decision. `danger` marks a row that destroys something — stated in
   text as well as color, because color alone is not a signal here. */
export function SettingsRow({ name, description, danger = false, children }) {
  return (
    <div className={cx("ns-aiset__row", danger && "ns-aiset__row--danger")}>
      <div>
        <p className="ns-aiset__name">{name}</p>
        {description && <p className="ns-aiset__desc">{description}</p>}
      </div>
      <div className="ns-aiset__control">{children}</div>
    </div>
  );
}

/* The mode picker: which teacher you are talking to. Three, mutually
   exclusive, so a segmented radiogroup rather than a select. */
export function ModeChoice({ name = "ns-ai-mode", value, onChange, options = [
  { value: "tutor", label: "Tutor" },
  { value: "coach", label: "Coach" },
  { value: "reviewer", label: "Reviewer" },
], label = "Default mode" }) {
  return (
    <fieldset className="ns-segmented" aria-label={label}>
      {options.map((o) => (
        <label className="ns-segmented__option" key={o.value}>
          <input
            type="radio" name={name} value={o.value}
            checked={value === o.value}
            onChange={onChange && (() => onChange(o.value))}
          />
          <span>{o.label}</span>
        </label>
      ))}
    </fieldset>
  );
}

/* A switch row's control. role="switch" on a checkbox: one control, one
   announced state, no divs pretending to toggle. */
export function SettingSwitch({ checked, onChange, label = "On", disabled = false }) {
  return (
    <label className="ns-choice">
      <input
        type="checkbox" role="switch" className="ns-switch"
        checked={checked} disabled={disabled}
        onChange={onChange && ((e) => onChange(e.target.checked))}
      />
      <span className="ns-choice__text"><span className="ns-choice__label">{label}</span></span>
    </label>
  );
}
