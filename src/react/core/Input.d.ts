export interface InputProps {
  placeholder?: string;
  /** Phosphor icon class shown left-inset, e.g. "ph-magnifying-glass" */
  icon?: string;
  /** Optional mono keyboard-shortcut hint shown right-inset, e.g. "⌘K" */
  hint?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  style?: React.CSSProperties;
}
