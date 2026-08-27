export interface FooterColumn {
  title: string;
  /** A bare string uses "#" as the href. */
  links: (string | { label: string; href?: string })[];
}
export interface FooterProps {
  columns?: FooterColumn[];
  /** Phosphor icon classes, e.g. ["ph-link-simple","ph-twitter-logo"] */
  socialIcons?: string[];
  /** One sentence under the mark, capped at the reading measure. */
  blurb?: React.ReactNode;
  /** Contents of the mono legal bar. */
  children?: React.ReactNode;
  className?: string;
}
