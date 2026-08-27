import * as React from "react";

export interface ComposerContext {
  id: string;
  /** "Apex basics · lesson 03" — what the assistant can currently see. */
  label: string;
  /** Phosphor glyph name without the ph- prefix. */
  icon?: string;
}
export interface ComposerFile {
  id: string;
  name: string;
  /** Display string — "4 KB". The composer does not format bytes. */
  size?: string;
  state?: "uploading" | "failed";
}

export interface ComposerProps {
  id?: string;
  /** Controlled when present; the character count only renders with it. */
  value?: string;
  onChange?: (value: string) => void;
  /** Fired by the send button AND by Enter (Shift+Enter breaks the line). */
  onSend?: () => void;
  placeholder?: string;
  context?: ComposerContext[];
  files?: ComposerFile[];
  onRemoveContext?: (id: string) => void;
  onRemoveFile?: (id: string) => void;
  /** Which teacher you are talking to. The menu itself is the shared ns-menu. */
  mode?: { label: string; icon?: string };
  onModeClick?: () => void;
  onAttach?: () => void;
  onDictate?: () => void;
  /** Character ceiling. Past 90% the count reads warning, past it error, and
   *  the send button disables. */
  max?: number;
  disabled?: boolean;
  hint?: string;
  /** Accessible name for the textarea — a placeholder is not a label. */
  label?: string;
  className?: string;
}
export declare function Composer(props: ComposerProps): React.JSX.Element;

export interface Starter {
  /** "Explain", "Review", "Plan", "Career". */
  kicker: string;
  /** The prompt itself, phrased as a student would say it. */
  text: string;
  icon?: string;
}
export interface WelcomeProps {
  title?: string;
  lede?: string;
  starters?: Starter[];
  /** Fills the composer — it does not send. The student edits a word first. */
  onPick?: (text: string) => void;
}
export declare function Welcome(props: WelcomeProps): React.JSX.Element;
