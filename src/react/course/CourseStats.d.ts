export interface CourseStat {
  /** The figure. A display string, so "1,482" and "74%" both work. */
  value: string;
  label: string;
}
export interface CourseStatsProps {
  stats: CourseStat[];
  className?: string;
}
