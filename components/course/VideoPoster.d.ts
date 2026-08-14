export interface VideoPosterProps {
  image?: string;
  /** Poster alt text. Empty by default — a poster is usually decorative
   *  because the title sits beside it. */
  alt?: string;
  /** Display string shown in the corner, e.g. "08:12". */
  duration?: string;
  /** Accessible name for the play button. Include the lesson title. */
  label?: string;
  onPlay?: () => void;
  className?: string;
}
