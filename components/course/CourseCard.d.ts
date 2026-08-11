export interface CourseCardProps {
  /** 1-based position in the catalog — rendered as a mono "01" chip over the media */
  index?: number;
  title: string;
  excerpt?: string;
  image?: string;
  level?: "beginner" | "intermediate" | "advanced";
  price?: "free" | "paid";
  priceLabel?: string;
  lessons?: number;
  duration?: string;
  authorName?: string;
  featured?: boolean;
  sponsored?: boolean;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
}
