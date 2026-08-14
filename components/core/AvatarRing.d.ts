export interface AvatarRingProps {
  /** Omit to render `initials` instead. */
  src?: string;
  alt?: string;
  size?: "sm" | "md" | "lg" | "xl";
  /** 0–100. The ring is a conic progress arc, not just a decorative edge. */
  progress?: number;
  /** Fallback when there is no image. Real text, so it stays legible at every size. */
  initials?: string;
  className?: string;
}
