import React from "react";
import { Sponsor } from "./Sponsor.jsx";

/* Namaste UI — the parts a written lesson is made of.
   =========================================================================
   A lesson body is not one blob of prose. It is prose plus a small, FIXED set
   of recurring blocks: what this lesson is for, the one thing to remember, the
   files, what you just learned, the words it used. Every one of those was
   being hand-assembled per lesson out of raw .ns-* classes, which is how three
   lessons end up with three different ideas of what a summary looks like.

   These are those blocks. They own no styling of their own — each renders
   classes that already exist in components/css — so the Ghost lesson template
   renders exactly the same markup from
   templates/course-player-article.html.

   THE ONE RULE WORTH STATING: none of these belongs INSIDE .ns-prose. Prose
   styles bare ul / dt / dd, so a checklist nested in it grows square markers
   and a glossary grows a rule down its left edge. Pass them as the player's
   `appendix`, or place them as siblings of the prose block. */

/** What this lesson is for, at the top. Promises, so they take the outcome
 *  list's success ticks — the same shape the course page made them in, which
 *  is the point: the lesson is delivering on a specific line of that page. */
export function LessonObjectives({ title = "In this lesson", items = [], id }) {
  if (!items.length) return null;
  return (
    <section id={id}>
      <p className="ns-kicker">{title}</p>
      <ul className="ns-outcomes ns-outcomes--single">
        {items.map((it, i) => (
          <li key={i}>
            <i className={`ph ${typeof it === "string" ? "ph-check-circle" : it.icon || "ph-check-circle"}`} aria-hidden="true" />
            <span>{typeof it === "string" ? it : it.text}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** What you just learned, at the bottom. A checklist, NOT the objectives list
 *  in another position: those are things on offer and these are things done,
 *  and a tick that means "achieved" should not look like a tick that means
 *  "promised". */
export function LessonSummary({ title = "What you learned", items = [], id }) {
  if (!items.length) return null;
  return (
    <section id={id}>
      <p className="ns-kicker">{title}</p>
      <ul className="ns-checklist">
        {items.map((it, i) => (
          <li key={i} data-state="done">
            <i className="ph ph-check-circle ns-checklist__mark" aria-hidden="true" />
            <span className="ns-checklist__text">{it}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** The words the lesson used as if you already knew them. It goes at the END:
 *  a glossary before the text is a vocabulary test, and a glossary after it is
 *  a reference. */
export function LessonGlossary({ title = "Glossary", terms = [], id }) {
  if (!terms.length) return null;
  return (
    <aside className="ns-terms" id={id}>
      <span className="ns-terms__label">{title}</span>
      <dl>
        {terms.map((t, i) => (
          <React.Fragment key={i}>
            <dt>{t.term}</dt>
            <dd>{t.definition}</dd>
          </React.Fragment>
        ))}
      </dl>
    </aside>
  );
}

/** The one thing to remember, in the reader's own words rather than the
 *  lesson's. Safe inside prose — it styles nothing prose also styles. */
export function LessonTakeaway({ label = "In short", children }) {
  return (
    <aside className="ns-takeaway">
      <span className="ns-takeaway__label">{label}</span>
      <p className="ns-takeaway__text">{children}</p>
    </aside>
  );
}

/** The files. Named by what they are and what they cost to open — a resource
 *  list that says "Attachment 1" is a filing cabinet. */
export function LessonResources({ title, items = [], id }) {
  if (!items.length) return null;
  return (
    <section id={id}>
      {title && <p className="ns-kicker">{title}</p>}
      {items.map((r, i) => (
        <a className="ns-resource" key={i} href={r.href}>
          <span className="ns-resource__icon"><i className={`ph ${r.icon || "ph-file-text"}`} aria-hidden="true" /></span>
          <span className="ns-resource__body">
            <span className="ns-resource__title">{r.title}</span>
            <span className="ns-resource__type">{r.meta}</span>
          </span>
          <i className={`ph ${r.external ? "ph-arrow-up-right" : "ph-arrow-down"} ns-resource__cue`} aria-hidden="true" />
        </a>
      ))}
    </section>
  );
}

/** A paid slot inside the lesson. It is the Sponsor card in its --article
 *  shape, named for where it goes, so the one decision that matters — how many
 *  a lesson may carry — is countable in a grep rather than a matter of taste.
 *
 *  ONE per lesson, and never above the fold: a learner who paid for the course
 *  is not the audience for a second sale, and an ad before the first paragraph
 *  says the opposite. */
export function LessonAd({ label = "Sponsored", ...rest }) {
  return <Sponsor shape="article" label={label} {...rest} />;
}

/** The rail's version, under the page rail's list. Sticky with it, so it
 *  travels with the reader rather than scrolling away at the first heading. */
export function SponsorSlot({ label = "Sponsor", shape = "skyscraper", ...rest }) {
  return <Sponsor shape={shape} label={label} {...rest} />;
}
