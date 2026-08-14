import React from "react";
import { SyntaxHighlighter } from "./SyntaxHighlighter.jsx";
/* DEPRECATED — use SyntaxHighlighter directly.
   =========================================================================
   A prop-mapping shim. It used to ship its own tokenizer plus two hard-coded
   colour THEMES as inline styles — a second, divergent copy of the token
   palette that components/css/code.css already owns as .ns-tok-* classes, and
   one the Ghost theme could not render at all.

   The old `defaultTheme` prop mapped to a per-panel light/dark toggle. That
   toggle is gone on purpose: the code surface follows the PAGE theme
   (theme="auto"), because a panel that stays light on a dark page is the one
   thing on screen that ignores the reader's own setting. Pass theme="dark" to
   force the navy console regardless, which is what defaultTheme="dark" meant.

   Kept only so existing imports keep working. */
export function CodePanel({
  code = "", filename = "apex", language, copyable = true,
  defaultTheme = "dark", showLineNumbers = true, ...rest
}) {
  return (
    <SyntaxHighlighter
      code={code}
      filename={filename}
      language={language || filename}
      chrome="vscode"
      theme={defaultTheme === "light" ? "auto" : "dark"}
      lineNumbers={showLineNumbers}
      actions={{ copy: copyable }}
      {...rest}
    />
  );
}
