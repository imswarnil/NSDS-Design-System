export interface CourseCardProps {
  title: string;
  excerpt?: string;
  image?: string;
  level?: "beginner" | "intermediate" | "advanced";
  /** Display string — "Free", "$17.00". The card does not format money. */
  price?: string;
  lessons?: number;
  duration?: string;
  /** Corner flag over the media — "OWNED", "NEW". */
  badge?: string;
  /** 0-100. Renders a <progress> under the excerpt when present. */
  progress?: number;
  href?: string;
  className?: string;
}
