import * as React from "react";

export interface NavLink {
  id: string;
  label: string;
  /** Optional Phosphor icon class shown left of the label, e.g. "ph-house" */
  icon?: string;
  /** Real href. Omitted, the link falls back to `#${id}` and onNavigate. */
  href?: string;
}

/** The common arrangement — brand, links, theme, one CTA, hamburger + sheet
 *  below lg. For dropdowns, mega panels or the account menu, compose the
 *  parts in components/navigation/Navbar.jsx directly. */
export interface NavbarProps {
  links: NavLink[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  ctaLabel?: string;
  onCta?: () => void;
  /** Pass a <Logo/> element */
  logo?: React.ReactNode;
  brandName?: React.ReactNode;
  /** Mono tagline beside the brand — "Learn", "Blog", "Docs". */
  brandTag?: React.ReactNode;
  /** Given, the CTA pair becomes Sign in + Sign up instead of one button. */
  signInHref?: string;
  variant?: "dark" | "transparent" | "floating" | "sunken" | "compact";
  /** Width-cap the bar's contents to the page container. Default true. */
  contained?: boolean;
}
export declare function Navbar(props: NavbarProps): React.JSX.Element;
