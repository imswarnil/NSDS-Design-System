export interface CodeBlockProps {
  code: string;
  /** Shown as the mono tab label, e.g. "apex", "routes.yaml" */
  filename?: string;
  copyable?: boolean;
}
