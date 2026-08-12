import * as React from "react";

/** A row in a dropdown or a mega-menu column. `desc` is not optional garnish:
 *  it is what makes a menu navigable by someone who does not already know the
 *  product. */
export interface NavMenuItem {
  href?: string;
  title?: React.ReactNode;
  desc?: React.ReactNode;
  icon?: React.ReactNode;
  current?: boolean;
  /** Render a mono section label instead of a row. */
  label?: React.ReactNode;
  /** Render a hairline instead of a row. */
  separator?: boolean;
}

export type TopnavVariant = "dark" | "transparent" | "floating" | "sunken" | "compact";

export interface TopnavProps {
  /** dark / transparent ride a hero; transparent goes solid on scroll. */
  variant?: TopnavVariant;
  /** Wrap the children in the width-capping inner, so the brand lines up with
   *  the first column of a width-capped page. */
  contained?: boolean;
  wide?: boolean;
  center?: boolean;
  className?: string;
  children?: React.ReactNode;
}
export declare function Topnav(props: TopnavProps): React.JSX.Element;

export declare function NavBrand(props: {
  href?: string; logo?: React.ReactNode; name?: React.ReactNode; tag?: React.ReactNode;
}): React.JSX.Element;

export declare function NavLinks(props: { children?: React.ReactNode }): React.JSX.Element;

export declare function NavLink(props: {
  href?: string;
  /** True for exactly one link in the bar. Paints the underline AND announces
   *  the location — one attribute, both jobs. */
  current?: boolean;
  flag?: React.ReactNode;
  children?: React.ReactNode;
}): React.JSX.Element;

export declare function NavMenu(props: {
  label: React.ReactNode;
  items: NavMenuItem[];
  align?: "start" | "end";
  footer?: React.ReactNode;
  id?: string;
}): React.JSX.Element;

export interface MegaColumn { label: React.ReactNode; items: NavMenuItem[] }
export declare function MegaMenu(props: {
  label: React.ReactNode;
  columns: MegaColumn[];
  /** At most one promo per panel; two is an ad break. */
  feature?: { kicker?: React.ReactNode; title: React.ReactNode; text?: React.ReactNode; href?: string; cta?: string };
  footLinks?: { href: string; label: React.ReactNode; icon?: React.ReactNode }[];
  wide?: boolean;
  id?: string;
}): React.JSX.Element;

/** A button shaped like a field. Opens the search modal, where results have
 *  room; also binds ⌘K / Ctrl-K when `onOpen` is given. */
export declare function NavSearch(props: {
  onOpen?: () => void; placeholder?: string; shortcut?: string; iconOnly?: boolean;
}): React.JSX.Element;

export interface NavUser {
  name: string;
  email?: string;
  /** Shown beside the avatar above lg. */
  short?: string;
  initials?: string;
  avatar?: string;
  plan?: string;
}
export declare function UserMenu(props: {
  user: NavUser;
  items?: { href?: string; label: React.ReactNode; icon?: React.ReactNode; separator?: boolean }[];
  progress?: { label: string; value: number };
  onSignOut?: () => void;
  id?: string;
}): React.JSX.Element;

export declare function AuthActions(props?: {
  signInHref?: string; signUpHref?: string; signInLabel?: string; signUpLabel?: string;
}): React.JSX.Element;

export declare function Burger(props: {
  expanded?: boolean; onClick?: () => void; controls?: string;
}): React.JSX.Element;

export interface NavSheetGroup {
  title?: React.ReactNode;
  href?: string;
  current?: boolean;
  /** Present ⇒ renders as a <details> section rather than a link. */
  items?: { href: string; title: React.ReactNode }[];
  /** Alone (no items, no href) ⇒ renders as a mono section label. */
  label?: React.ReactNode;
}
export declare function NavSheet(props: {
  open: boolean;
  onClose?: () => void;
  id?: string;
  brand?: React.ReactNode;
  groups?: NavSheetGroup[];
  footer?: React.ReactNode;
  label?: string;
}): React.JSX.Element;

export declare function AnnounceBar(props: {
  kicker?: React.ReactNode;
  children?: React.ReactNode;
  link?: { href: string; label: React.ReactNode };
  onDismiss?: () => void;
  quiet?: boolean;
}): React.JSX.Element;

/** Decorative reading-progress line for the bottom edge of the bar. */
export declare function ReadingProgress(): React.JSX.Element;

export declare function NavIcon(props: {
  icon: React.ReactNode;
  /** Required: this control has no visible text. */
  label: string;
  /** A count, never a bare dot — it goes in the badge AND the label. */
  count?: number | string;
  href?: string;
  onClick?: () => void;
}): React.JSX.Element;

export declare function NavStat(props: {
  icon?: React.ReactNode; value?: React.ReactNode; children?: React.ReactNode;
}): React.JSX.Element;

/** Chrome for a page you are inside: where am I, how far through, what next.
 *  Carries no site navigation on purpose. */
export declare function CourseNav(props: {
  backHref?: string;
  backLabel: React.ReactNode;
  /** Mono position line — "Module 02 · Lesson 07 / 24". */
  kicker?: React.ReactNode;
  title: React.ReactNode;
  /** Course completion; labelled and announced, unlike the reading line. */
  percent?: number;
  position?: React.ReactNode;
  dark?: boolean;
  onPrev?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  actions?: React.ReactNode;
  children?: React.ReactNode;
}): React.JSX.Element;

/** GitHub star pill — a link to the repo with the count rendered mono. */
export declare function NavStar(props: {
  href: string; count?: React.ReactNode; label?: string;
}): React.JSX.Element;
