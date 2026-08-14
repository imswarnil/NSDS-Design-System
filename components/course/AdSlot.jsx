import React from "react";
/** Dashed placeholder ad slot. Deliberately plain: it is the one surface in the
 *  system allowed to look unfinished, because that is what it is until
 *  something fills it. Styling lives in components/css/catalog.css. */
export function AdSlot({ label = "Advertise with us", className = "", ...rest }) {
  return (
    <div className={["ns-adslot", className].filter(Boolean).join(" ")} {...rest}>
      <span className="ns-adslot__label">
        <i className="ph ph-megaphone" aria-hidden="true" />{label}
      </span>
    </div>
  );
}
