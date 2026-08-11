export interface FooterColumn {
  title: string;
  links: string[];
}
export interface FooterProps {
  columns?: FooterColumn[];
  /** Phosphor icon classes, e.g. ["ph-link-simple","ph-twitter-logo"] */
  socialIcons?: string[];
}
