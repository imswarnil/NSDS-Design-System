export type CodeChrome = "block" | "mac" | "vscode";

export interface CodeTab {
  /** Tab label — the file name. */
  name: string;
  /** That file's source. */
  code: string;
  /** Per-file language; falls back to the component's `language`. */
  language?: string;
}

export interface CodeMarks {
  /** 1-based line numbers rendered as added (green edge + tint). */
  add?: number[];
  /** 1-based line numbers rendered as removed. */
  del?: number[];
  /** 1-based line numbers rendered as called-out (brand edge + tint). */
  mark?: number[];
}

export interface CodeActions {
  /** Copy-to-clipboard button. Default true. */
  copy?: boolean;
  /** "Ask AI" menu. Default true. */
  ask?: boolean;
  /** Share menu. Default true. */
  share?: boolean;
  /** Run button in the footer. Default false — only pass it with `onRun`. */
  run?: boolean;
  /** Soft-wrap toggle. Default true. */
  wrapToggle?: boolean;
}

export interface AiOption {
  id: string;
  label: string;
  /** Phosphor class, e.g. "ph-sparkle". */
  icon: string;
  /** If present, the option opens this URL with the prompt appended. */
  href?: string;
}

export interface RunContext {
  code: string;
  language: string;
  /** Call with the result when the host has one. Nothing renders until you do. */
  done: (result: string, ok?: boolean) => void;
}

export interface SyntaxHighlighterProps {
  /** Source code. Ignored when `tabs` is passed. */
  code?: string;
  /** Grammar for the tokenizer and the label in the bar. Default "apex". */
  language?: string;
  /** File name shown in the title bar. Defaults to the language. */
  filename?: string;
  /** Which window chrome to wear. Default "block". */
  chrome?: CodeChrome;
  /** "auto" follows the page theme; "dark" forces the navy console. Default "auto". */
  theme?: "auto" | "dark";
  /** Line-number gutter. Default true; hidden automatically while wrapped. */
  lineNumbers?: boolean;
  /** Start soft-wrapped. Default false. */
  wrap?: boolean;
  /** Tighter leading and a smaller size, for a sample beside prose. */
  compact?: boolean;
  /** Start collapsed to a fixed height with an expander in the footer. */
  collapsible?: boolean;
  /** Diff / call-out line marking. */
  marks?: CodeMarks;
  /** Multi-file sample. With `chrome="vscode"` these render as a tab strip. */
  tabs?: CodeTab[];
  /** Which chrome actions to show. */
  actions?: CodeActions;
  /** Override the "Ask AI" menu contents. */
  aiOptions?: AiOption[];
  /** URL the share menu copies. Defaults to the current page. */
  shareUrl?: string;
  /** Pre-rendered output pane content (also the fallback when `onRun` is absent). */
  output?: string;
  /** Called when Run is pressed. Execution is the host's job — call `done()`. */
  onRun?: (ctx: RunContext) => void;
  /** Called when an "Ask AI" option is chosen, before any navigation. */
  onAsk?: (ctx: { option: string; code: string; language: string }) => void;
  className?: string;
}

/**
 * The system's code surface: title bar, copy / ask-AI / share / wrap actions,
 * optional tabs, line numbers, diff marking, and a footer whose one job is
 * Run. Three chromes — block, mac, vscode — differ only in the bar.
 *
 * Supersedes CodeBlock and CodePanel, both of which style themselves inline
 * and therefore cannot be rendered by the Ghost theme.
 * @dsCard group="Components" viewport="760x420" name="Syntax Highlighter"
 */
export function SyntaxHighlighter(props: SyntaxHighlighterProps): JSX.Element;
export default SyntaxHighlighter;
