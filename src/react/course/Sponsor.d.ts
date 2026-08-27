import * as React from "react";

/** Where it goes, not how loud it is.
 *
 *   skyscraper   a content rail — the one shape with room for the whole pitch
 *   square       a narrow rail or a grid; the description is dropped, not clamped
 *   leaderboard  a wide strip under an article or above a footer
 *   article      INSIDE the reading flow, and therefore deliberately not a card
 */
export type SponsorShape = "skyscraper" | "square" | "leaderboard" | "article";

export declare function Sponsor(props: {
  shape?: SponsorShape;
  /** Rewordable ("Sponsored" / "Sponsor" / "Partner"), never omittable. A paid
   *  block that looks like editorial is not a design choice. Rendered as plain
   *  text with the flag dot drawn in CSS, so it stays readable, translatable
   *  and announced. */
  label?: string;
  /** Constrained by height, not width — sponsor logos arrive in every aspect
   *  ratio there is. The sponsor's name becomes its alt. */
  logo?: string;
  name?: React.ReactNode;
  /** THE HEADLINE — the one line the sponsor makes their case with, and the
   *  only thing on the card set at reading size. A tagline that wraps to three
   *  lines is a description. */
  tagline?: React.ReactNode;
  /** Hidden by CSS on --square. */
  description?: React.ReactNode;
  /** Rendered as a <span> styled as a text link with a travelling arrow: the
   *  whole card is the link, and a link inside a link is invalid. There is no
   *  prop that turns it into a button — that would compete with the one real
   *  action on the page. */
  cta?: React.ReactNode;
  href?: string;
  className?: string;
}): React.JSX.Element;

/** The empty slot, before a sponsor is sold. For the layout stage and the
 *  sales page — never for a reader. */
export declare function SponsorSlotEmpty(props: {
  label?: string;
  className?: string;
}): React.JSX.Element;
