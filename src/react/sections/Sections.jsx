import React from "react";

/* Namaste UI — reusable page sections.
   =========================================================================
   The bands both products compose full pages from: hero, feature grid,
   stat band, testimonial, CTA, FAQ, logo row. Styling lives in
   components/css/sections.css; templates/sections-home.html is the
   framework-neutral markup contract these renderers emit. */

/** A full-width band. tone: default | "sunken" | "dark"; grid adds the
 *  dissolving hairline-grid motif (dark bands only, per the foundations). */
export function Band({ tone, grid, tight, children, ...props }) {
  const cls = [
    "ns-band",
    tight && "ns-band--tight",
    tone === "sunken" && "ns-band--sunken",
    tone === "dark" && "ns-band--dark",
    grid && "ns-band--grid",
  ].filter(Boolean).join(" ");
  return (
    <section className={cls} {...props}>
      <div className="ns-band__inner">{children}</div>
    </section>
  );
}

/** The code-comment section label: renders `// children`. */
export function Kicker({ children }) {
  return <span className="ns-kicker">{children}</span>;
}

/** A band's opening: kicker + balanced title + lede. */
export function BandHead({ kicker, title, lede, center }) {
  return (
    <header className={`ns-band__head${center ? " ns-band__head--center" : ""}`}>
      {kicker && <Kicker>{kicker}</Kicker>}
      <h2 className="ns-band__title">{title}</h2>
      {lede && <p className="ns-band__lede">{lede}</p>}
    </header>
  );
}

/** The page opener. proof is the one mono fact line under the actions. */
export function HeroSection({ kicker, title, lede, actions, proof, dark, grid = dark }) {
  return (
    <section className={["ns-band", "ns-hero", dark && "ns-band--dark", grid && "ns-band--grid"].filter(Boolean).join(" ")}>
      <div className="ns-band__inner">
        {kicker && <Kicker>{kicker}</Kicker>}
        <h1 className="ns-hero__title">{title}</h1>
        {lede && <p className="ns-hero__lede">{lede}</p>}
        {actions && <div className="ns-hero__actions">{actions}</div>}
        {proof && <span className="ns-hero__proof">{proof}</span>}
      </div>
    </section>
  );
}

/** 3-up hairline feature cards. items: [{ icon, name, text }] — the mono
 *  index is generated, first-class, like every list in the system. */
export function FeatureGrid({ items = [] }) {
  return (
    <div className="ns-features">
      {items.map((f, i) => (
        <article key={f.name} className="ns-feature">
          <div className="ns-feature__top">
            {f.icon}
            <span className="ns-feature__num">{String(i + 1).padStart(2, "0")}</span>
          </div>
          <h3 className="ns-feature__name">{f.name}</h3>
          <p className="ns-feature__text">{f.text}</p>
        </article>
      ))}
    </div>
  );
}

/** Concrete numbers only — every cell must be a real, current figure. */
export function StatBand({ stats = [] }) {
  return (
    <dl className="ns-statband">
      {stats.map((s) => (
        <div key={s.label} className="ns-statband__cell">
          <dd className="ns-statband__value">{s.value}</dd>
          <dt className="ns-statband__label">{s.label}</dt>
        </div>
      ))}
    </dl>
  );
}

/** One voice, set large; attribution is a mono record line. */
export function Quote({ children, by }) {
  return (
    <figure className="ns-quote">
      <blockquote>{children}</blockquote>
      <figcaption>{by}</figcaption>
    </figure>
  );
}

/** The closer: exactly one per page, at the end, on the navy band. */
export function CtaBand({ title, actions, fine }) {
  return (
    <Band tone="dark" grid>
      <div className="ns-cta">
        <h2 className="ns-band__title">{title}</h2>
        <div className="ns-cta__actions">{actions}</div>
        {fine && <span className="ns-cta__fine">{fine}</span>}
      </div>
    </Band>
  );
}

/** Native-details FAQ — find-in-page reaches collapsed answers. */
export function Faq({ items = [] }) {
  return (
    <div className="ns-faq">
      {items.map((it) => (
        <details key={it.q} className="ns-faq__item">
          <summary>{it.q}</summary>
          <div className="ns-faq__body">{typeof it.a === "string" ? <p>{it.a}</p> : it.a}</div>
        </details>
      ))}
    </div>
  );
}

/** "As used by" marks; text placeholders set in mono when no mark exists. */
export function LogoRow({ names = [], children }) {
  return (
    <div className="ns-logorow">
      {children ?? names.map((n) => <span key={n} className="ns-logorow__mark">{n}</span>)}
    </div>
  );
}
