export interface RoadmapCardProps {
  n: string | number;
  title: string;
  desc?: string;
  /** Phosphor icon class */
  icon?: string;
  duration?: string;
  lessons?: number;
  side?: "left" | "right";
  href?: string;
}
