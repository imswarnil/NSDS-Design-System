import * as React from "react";

/** Pairs with assets/js/theme-init.js, which must be inlined in <head> before
 *  any stylesheet. This component never decides the initial theme — doing so
 *  after hydration is exactly the white flash the init script prevents. */
export declare function ThemeToggle(props: { className?: string; showLabel?: boolean }): React.JSX.Element;

/** First focusable element on the page. The target MUST carry tabindex="-1",
 *  or focus stays at the top of the document in Safari and Chrome. */
export declare function SkipLink(props: { href?: string; children?: React.ReactNode }): React.JSX.Element;

declare global {
  interface Window {
    nsTheme?: {
      key: string;
      get: () => "light" | "dark";
      set: (theme: "light" | "dark") => void;
      toggle: () => void;
      /** Clear the explicit choice and follow the OS preference again. */
      useSystem: () => void;
    };
  }
}
