import React from "react";
/** 4:3 video poster — hairline ring play button (not a soft drop shadow), sharp corners. */
export function VideoPoster({ image, onPlay }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button onClick={onPlay} onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)} style={{ all: "unset", cursor: "pointer", position: "relative", display: "block", width: "100%", borderRadius: "var(--radius-card)", overflow: "hidden", boxShadow: "inset 0 0 0 1px var(--color-border)" }}>
      {image ? <img src={image} alt="" style={{ display: "block", width: "100%", aspectRatio: "4/3", objectFit: "cover", transform: hover ? "scale(1.03)" : "none", transition: "transform var(--duration-base) var(--ease-out)" }} /> : <div style={{ width: "100%", aspectRatio: "4/3", background: "var(--color-brand-800)" }} />}
      <span style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgb(0 0 0 / 0.5), transparent 55%)" }} />
      <span style={{ position: "absolute", left: "1rem", bottom: "1rem", display: "flex", alignItems: "center", justifyContent: "center", height: "3.25rem", width: "3.25rem", borderRadius: "9999px", background: "rgb(255 255 255 / 0.95)", color: "var(--color-brand-700)", fontSize: "1.2rem", boxShadow: hover ? "0 0 0 4px rgb(255 255 255 / 0.25)" : "0 0 0 0px rgb(255 255 255 / 0)", transition: "box-shadow var(--duration-base) var(--ease-out)" }}>
        <i className="ph-fill ph-play" />
      </span>
    </button>
  );
}
