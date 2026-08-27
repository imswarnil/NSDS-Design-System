export interface CodePanelProps {
  /** Source code to render. Newlines split into numbered lines. */
  code: string;
  /** Filename shown in the tab (e.g. "TriggerHandler.cls"). */
  filename?: string;
  /** Optional language label shown right of the tab (e.g. "apex", "soql"). */
  language?: string;
  /** Show the copy button. Default true. */
  copyable?: boolean;
  /** Initial theme; a toggle in the panel header flips it live. Default "dark". */
  defaultTheme?: "dark" | "light";
  /** Show the left line-number gutter. Default true. */
  showLineNumbers?: boolean;
}

/**
 * SLDS-flavored code panel with a multi-token syntax highlighter and an
 * in-panel light/dark toggle. Use for docs pages and lesson code where a full
 * highlighted, line-numbered block is wanted; use CodeBlock for the lighter
 * inline all-blue motif.
 * @dsCard group="Components" viewport="700x360" name="Code Panel"
 */
export function CodePanel(props: CodePanelProps): JSX.Element;
