import * as React from "react";

export interface ProgressBarProps {
  value: number;
  max?: number;
  /** Accessible name. Without it a screen reader announces a bare percentage
   *  with no idea what it measures. */
  label?: string;
  showValue?: boolean;
  size?: "lg";
  className?: string;
}
export declare function ProgressBar(props: ProgressBarProps): React.JSX.Element;

/** Discrete lesson ticks. The ticks are aria-hidden; the count is carried by
 *  one visually-hidden sentence. */
export declare function Steps(props: { total: number; current: number; className?: string }): React.JSX.Element;

/** A score against a threshold. <meter>, not <progress> — progress answers
 *  "how far along", meter answers "how good", and they announce differently. */
export declare function ScoreMeter(props: {
  value: number; max?: number; low?: number; high?: number; optimum?: number;
  label?: string; className?: string;
}): React.JSX.Element;

export interface Column<Row = any> {
  key: string;
  label: React.ReactNode;
  /** Tabular figures, end-aligned, so digits stack into a scannable column. */
  numeric?: boolean;
  sortable?: boolean;
  render?: (row: Row) => React.ReactNode;
}
export interface DataTableProps<Row = any> {
  columns: Column<Row>[];
  rows: Row[];
  /** Also the scroll region's accessible name. */
  caption?: string;
  sticky?: boolean;
  sort?: { key: string; direction: "ascending" | "descending" };
  onSort?: (key: string, direction: "ascending" | "descending") => void;
  className?: string;
}
export declare function DataTable<Row = any>(props: DataTableProps<Row>): React.JSX.Element;
