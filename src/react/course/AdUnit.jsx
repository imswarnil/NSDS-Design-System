import React from "react";

/** A third-party ad slot — AdSense or any other network.
 *
 *  This component renders the BOX, never the ad. It reserves the exact space
 *  the creative will take, discloses that it is an ad, and holds a skeleton
 *  until the network calls back. Whatever actually requests and injects the
 *  creative belongs in the product, and is passed in as `children`.
 *
 *  The reservation is the point: an unreserved slot is the single largest
 *  source of layout shift on an ad-funded page. Pass the format and the frame
 *  holds its height at every breakpoint whether or not a fill arrives.
 *
 *  The disclosure is the visible label, in the DOM, as real text — not an
 *  aria-label. A screen reader user gets the same four syllables of warning a
 *  sighted reader does, from the same node, so the two cannot drift apart.
 *
 *  Styling lives in components/css/ads.css, so the Ghost theme renders the
 *  same classes from Handlebars.
 */
export function AdUnit({
  format = "rectangle",
  state = "loading",
  label = "Advertisement",
  size,
  collapse = false,
  className = "",
  children,
  ...rest
}) {
  return (
    <div
      className={["ns-ad", `ns-ad--${format}`, className].filter(Boolean).join(" ")}
      data-state={state}
      data-collapse={collapse ? "" : undefined}
      {...rest}
    >
      <span className="ns-ad__label">{label}</span>
      <div className="ns-ad__frame">
        {children}
        {state === "loading" && (
          <div className="ns-ad__skeleton ns-skeleton" aria-hidden="true">{size}</div>
        )}
      </div>
    </div>
  );
}

/** The dummy creative, for local development and the styleguide. Deliberately
 *  hatched and stamped with its own dimensions: a placeholder that could pass
 *  for a live unit is a placeholder that ships to production one day. */
export function AdDummy({ size, name = "Your ad here" }) {
  return (
    <div className="ns-ad__dummy" aria-hidden="true">
      <span className="ns-ad__dummy-name">{name}</span>
      <span className="ns-ad__dummy-size">{size}</span>
    </div>
  );
}

/** The message shown when a slot comes back with no fill, or when a blocker
 *  removed it. Never a demand — see the note in ads.css. */
export function AdNote({ title, children }) {
  return (
    <div className="ns-ad__note">
      {title && <span className="ns-ad__note-title">{title}</span>}
      {children}
    </div>
  );
}

/** The floating bottom strip.
 *
 *  Dismissal is not optional and therefore not a prop to forget: onDismiss is
 *  required and the close button always renders, at a full touch target,
 *  from the first frame. The button is a sibling of the frame rather than a
 *  child of it, because it has to sit on the strip's own edge — inside the
 *  frame it would be positioned against the creative and, on a real network
 *  unit, covered by the iframe.
 */
export function AdAnchor({ onDismiss, label = "Advertisement", state = "loading", size, children, className = "", ...rest }) {
  return (
    <div
      className={["ns-ad", "ns-ad--anchor", className].filter(Boolean).join(" ")}
      data-state={state}
      {...rest}
    >
      <button
        type="button"
        className="ns-ad__dismiss"
        onClick={onDismiss}
        aria-label="Close advertisement"
      >
        <i className="ph ph-x" aria-hidden="true" />
      </button>
      <span className="ns-ad__label">{label}</span>
      <div className="ns-ad__frame">
        {children}
        {state === "loading" && (
          <div className="ns-ad__skeleton ns-skeleton" aria-hidden="true">{size}</div>
        )}
      </div>
    </div>
  );
}
