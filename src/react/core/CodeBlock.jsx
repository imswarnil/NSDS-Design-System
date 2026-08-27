import React from "react";
import { SyntaxHighlighter } from "./SyntaxHighlighter.jsx";
/* DEPRECATED — use SyntaxHighlighter directly.
   =========================================================================
   This is now a prop-mapping shim, nothing more. It used to carry its own
   three-rule highlighter and a full set of inline style objects, which meant
   the Ghost theme could not render it: Handlebars has no style objects, so
   the same code block existed twice and drifted. SyntaxHighlighter carries
   the whole anatomy (title, copy, ask-AI, share, run, tabs, diff marking) as
   .ns-* classes from components/css/code.css, which BOTH products render.

   Kept only so existing imports keep working. New code should import
   SyntaxHighlighter — it takes every prop this does and considerably more. */
export function CodeBlock({ code, filename = "apex", copyable = true, ...rest }) {
  return (
    <SyntaxHighlighter
      code={code}
      filename={filename}
      language={filename}
      lineNumbers={false}
      actions={{ copy: copyable, ask: false, share: false, wrapToggle: false }}
      {...rest}
    />
  );
}
