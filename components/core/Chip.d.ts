export interface ChipProps {
  /** Phosphor icon class, e.g. "ph-lightning" */
  icon: string;
  variant?: "brand" | "accent";
  /** Three fixed steps, not a pixel value — a tile that can be any size is
   *  a tile neither product can match. */
  size?: "sm" | "md" | "lg";
  className?: string;
}
