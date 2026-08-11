export interface BadgeProps {
  children?: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning" | "error";
  /** Phosphor icon class — replaces the default status dot */
  icon?: string;
  /** Show the small colored status dot (default true; ignored if icon is set) */
  dot?: boolean;
}
