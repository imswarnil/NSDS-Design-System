export interface TocItem {
  id: string;
  label: string;
  level?: 2 | 3;
}
export interface TableOfContentsProps {
  items: TocItem[];
  activeId?: string;
  onNavigate?: (id: string) => void;
  /** Heading above the rail. Pass "" to omit. */
  title?: string;
  className?: string;
}
