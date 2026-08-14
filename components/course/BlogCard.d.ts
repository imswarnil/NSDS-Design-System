export interface BlogCardProps {
  title: string;
  excerpt?: string;
  image?: string;
  tag?: string;
  /** One line of byline/date/read-time, already joined by the caller. */
  meta?: string;
  href?: string;
  className?: string;
}
