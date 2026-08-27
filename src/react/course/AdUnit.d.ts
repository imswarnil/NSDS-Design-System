export type AdFormat =
  | "leaderboard"
  | "billboard"
  | "rectangle"
  | "rectangle-lg"
  | "square"
  | "halfpage"
  | "skyscraper"
  | "skyscraper-sm"
  | "banner"
  | "banner-lg"
  | "fluid"
  | "article"
  | "feed"
  | "multiplex"
  | "parallax"
  | "anchor";

export type AdState = "loading" | "filled" | "empty" | "blocked";

export interface AdUnitProps {
  format?: AdFormat;
  state?: AdState;
  label?: string;
  /** Size stamp shown in the skeleton, e.g. "728x90". Development aid. */
  size?: string;
  /** Remove the slot entirely when it comes back unfilled, rather than
   *  leaving a reserved grey rectangle for the rest of the session. */
  collapse?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export interface AdDummyProps {
  size?: string;
  name?: string;
}

export interface AdNoteProps {
  title?: string;
  children?: React.ReactNode;
}

export interface AdAnchorProps extends Omit<AdUnitProps, "format" | "collapse"> {
  onDismiss: () => void;
}
