export interface TrainingCardProps {
  n: string | number;
  title: string;
  desc?: string;
  icon?: string;
  lessons?: number;
  duration?: string;
  /** 0–100, renders a thin progress bar when set */
  progress?: number;
  href?: string;
}
