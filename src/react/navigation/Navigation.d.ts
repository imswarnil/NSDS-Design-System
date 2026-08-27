import * as React from "react";

export interface TabItem { value: string; label: React.ReactNode; content?: React.ReactNode }
export interface TabsProps {
  tabs: TabItem[];
  value: string;
  onChange?: (value: string) => void;
  /** "automatic" selects on arrow key. Use "manual" when selecting a tab
   *  triggers a fetch, or arrowing across five tabs fires five requests. */
  activation?: "automatic" | "manual";
  className?: string;
}
export declare function Tabs(props: TabsProps): React.JSX.Element;

export interface AccordionItem {
  key?: string;
  title: React.ReactNode;
  content?: React.ReactNode;
  defaultOpen?: boolean;
}
export interface AccordionProps {
  items: AccordionItem[];
  /** Only one open at a time, via the native `name` attribute — no state. */
  exclusive?: boolean;
  /** Prefix each item with a zero-padded mono index. */
  numbered?: boolean;
  className?: string;
}
export declare function Accordion(props: AccordionProps): React.JSX.Element;

export interface BreadcrumbItem { label: React.ReactNode; href?: string }
export declare function Breadcrumb(props: { items: BreadcrumbItem[]; className?: string }): React.JSX.Element;

export interface PaginationProps {
  page: number;
  totalPages: number;
  /** Build the href for a page number. Real links, so they stay crawlable. */
  hrefFor?: (page: number) => string;
  className?: string;
}
export declare function Pagination(props: PaginationProps): React.JSX.Element | null;

export interface SidebarGroup { label: string; items: Array<{ href: string; label: React.ReactNode }> }
export declare function DocsSidebar(props: {
  groups: SidebarGroup[];
  currentHref?: string;
  label?: string;
  className?: string;
}): React.JSX.Element;
