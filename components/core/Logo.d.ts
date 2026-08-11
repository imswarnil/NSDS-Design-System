export interface LogoProps {
  /** Path to the source favicon/mark asset */
  iconSrc?: string;
  text?: string;
  /** Icon-only (for narrow navbars/favicons) */
  compact?: boolean;
  /** Use on dark surfaces */
  light?: boolean;
  size?: number;
}
