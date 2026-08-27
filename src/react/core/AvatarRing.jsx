import React from "react";
/** Avatar with a thin hairline brand ring — precise, not decorative.
 *  The ring doubles as a progress arc: pass `progress` (0–100) and the
 *  conic-gradient in .ns-avatar-ring fills to that point. Styling lives in
 *  components/css/display.css, which is what templates/avatar.html renders. */
export function AvatarRing({ src, alt = "", size = "md", progress = 100, initials, className = "", ...rest }) {
  const avatar = ["ns-avatar", size !== "md" && `ns-avatar--${size}`].filter(Boolean).join(" ");
  return (
    <span className={["ns-avatar-ring", className].filter(Boolean).join(" ")}
          style={{ "--p": progress }} {...rest}>
      <span className={avatar}>
        {src ? <img src={src} alt={alt} /> : initials}
      </span>
    </span>
  );
}
