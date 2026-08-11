import React from "react";
/* Principle: reuse the hairline-grid dark canvas everywhere a hero appears —
   course, blog, docs, resources all share this one hero language, only the
   content composition changes (matches the source's own data-hero 1–5). */
export function Hero({ variant = "split", kicker, title, subtitle, media, stats, actions }) {
  const isCentered = variant === "centered";
  const isCompact = variant === "compact";
  return (
    <section style={{ position: "relative", overflow: "hidden", background: "var(--color-brand-900)", color: "#fff", padding: isCompact ? "2rem 1.5rem" : "4rem 1.5rem" }}>
      <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(to right, rgb(255 255 255 / 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.05) 1px, transparent 1px)", backgroundSize: "44px 44px", WebkitMaskImage: "radial-gradient(ellipse 100% 100% at 50% 20%, #000 20%, transparent 72%)", maskImage: "radial-gradient(ellipse 100% 100% at 50% 20%, #000 20%, transparent 72%)" }} />
      <div style={{ position: "relative", maxWidth: 1120, margin: "0 auto", display: isCentered || isCompact || !media ? "block" : "grid", gridTemplateColumns: !isCentered && !isCompact && media ? "1.3fr 1fr" : undefined, gap: "3rem", alignItems: "center", textAlign: isCentered ? "center" : "left" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: isCentered ? "center" : "flex-start", gap: "1rem", maxWidth: isCentered ? 720 : undefined, margin: isCentered ? "0 auto" : undefined }}>
          {kicker && <span style={{ display: "flex", alignItems: "baseline", gap: "0.4em", fontFamily: "var(--font-mono)", fontSize: "var(--size-label)", fontWeight: 700, letterSpacing: "var(--tracking-label)", textTransform: "uppercase" }}><span style={{ color: "rgb(255 255 255 / 0.4)" }}>//</span>{kicker}</span>}
          <h1 style={{ fontFamily: "var(--font-heading)", fontSize: isCompact ? "1.75rem" : "var(--size-display)", fontWeight: 800, lineHeight: 1.12 }}>{title}</h1>
          {subtitle && <p style={{ fontSize: "1.05rem", color: "rgb(255 255 255 / 0.72)", maxWidth: 560 }}>{subtitle}</p>}
          {actions && <div style={{ display: "flex", gap: "0.75rem" }}>{actions}</div>}
          {stats && <div style={{ marginTop: "0.5rem", borderTop: "1px solid rgb(255 255 255 / 0.12)", paddingTop: "1.1rem" }}>{stats}</div>}
        </div>
        {!isCentered && !isCompact && media && (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", aspectRatio: "4/3", borderRadius: "var(--radius-card)", background: "rgb(255 255 255 / 0.04)", boxShadow: "inset 0 0 0 1px rgb(255 255 255 / 0.14)" }}>{media}</div>
        )}
      </div>
    </section>
  );
}
