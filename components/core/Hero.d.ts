export interface HeroProps {
  /** split = 2-col text+media (default); centered = text over the grid pattern; compact = short bar (no media) */
  variant?: "split" | "centered" | "compact";
  kicker?: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  /** Right-column media (image, icon, VideoPoster) — ignored in centered/compact */
  media?: React.ReactNode;
  /** One concrete mono fact under the actions — never a stat wall. */
  proof?: React.ReactNode;
  /** Button(s) */
  actions?: React.ReactNode;
}
