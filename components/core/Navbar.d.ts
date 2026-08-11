export interface NavLink {
  id: string;
  label: string;
  /** Optional Phosphor icon class shown left of the label, e.g. "ph-house" */
  icon?: string;
}
export interface NavbarProps {
  links: NavLink[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  /** Show + wire the theme toggle button */
  dark?: boolean;
  onToggleDark?: () => void;
  ctaLabel?: string;
  onCta?: () => void;
  /** Pass a <Logo/> element */
  logo?: React.ReactNode;
}
