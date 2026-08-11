import React from "react";
/** Avatar with a thin hairline brand ring (offset, not a solid color wrap) — precise, not decorative. */
export function AvatarRing({ src, alt = "", size = 40 }) {
  return (
    <span style={{ display: "inline-flex", position: "relative", width: size, height: size }}>
      <img src={src} alt={alt} style={{ width: size, height: size, borderRadius: "9999px", display: "block", objectFit: "cover" }} />
      <span style={{ position: "absolute", inset: -3, borderRadius: "9999px", boxShadow: "0 0 0 1.5px var(--color-brand-500)" }} />
    </span>
  );
}
