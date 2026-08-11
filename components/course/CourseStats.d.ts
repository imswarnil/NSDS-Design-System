export interface CourseStat {
  icon: string;
  value: string;
  label: string;
}
export interface CourseStatsProps {
  stats: CourseStat[];
  /** true when placed on the dark-navy course hero (default) */
  onDark?: boolean;
}
