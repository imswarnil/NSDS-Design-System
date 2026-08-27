import React from "react";
import { highlightLines, gutter } from "./highlight.js";

/* NS Design System — SyntaxHighlighter / code block.
   =========================================================================
   The system's code surface. Replaces CodeBlock (the all-blue inline motif)
   and CodePanel (the console panel) with one component that carries the whole
   anatomy: a title bar with the file name, copy / ask-AI / share / wrap
   actions, an optional tab strip, line numbers, diff-marked lines, and a
   footer whose one job is Run.

   Styling is entirely .ns-* classes from components/css/code.css — no style
   objects — so the Ghost theme renders the identical markup from Handlebars
   and the two products cannot drift.

   Three chromes, one component:
     block    the default — a card with a title bar
     mac      traffic lights and a centred title
     vscode   a tab strip above and a brand status bar below

   Run does NOT execute anything. It raises onRun (and a DOM event) and waits
   for the host to hand back a result; a design system that evaluated the code
   in its own docs would be a security hole with a play button on it. */

const AI_DEFAULTS = [
  { id: "claude", label: "Ask Claude", icon: "ph-sparkle", href: "https://claude.ai/new?q=" },
  { id: "chatgpt", label: "Ask ChatGPT", icon: "ph-chat-circle-text", href: "https://chatgpt.com/?q=" },
  { id: "explain", label: "Explain this code", icon: "ph-lightbulb" },
  { id: "tests", label: "Write tests for it", icon: "ph-list-checks" },
  { id: "review", label: "Review for bugs", icon: "ph-magnifying-glass" },
];

function prompt(intent, language, code) {
  const verb = intent === "tests" ? "Write unit tests for" : intent === "review" ? "Review this for bugs and edge cases" : "Explain";
  return `${verb} this ${language || "code"}:\n\n\`\`\`${language || ""}\n${code}\n\`\`\``;
}

export function SyntaxHighlighter({
  code = "",
  language = "apex",
  filename,
  chrome = "block",
  theme = "auto",
  lineNumbers = true,
  wrap = false,
  compact = false,
  collapsible = false,
  marks,
  tabs,
  actions = {},
  aiOptions = AI_DEFAULTS,
  shareUrl,
  output,
  onRun,
  onAsk,
  className = "",
}) {
  const uid = React.useId();
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  const [wrapped, setWrapped] = React.useState(wrap);
  const [collapsed, setCollapsed] = React.useState(collapsible);
  const [running, setRunning] = React.useState(false);
  const [result, setResult] = React.useState(output ?? null);
  const [ok, setOk] = React.useState(true);

  const files = tabs && tabs.length ? tabs : [{ name: filename || language, code, language }];
  const file = files[Math.min(active, files.length - 1)];
  const source = file.code;
  const lang = file.language || language;

  const { copy = true, ask = true, share = true, run = false, wrapToggle = true } = actions;

  const html = React.useMemo(() => highlightLines(source, lang, marks || {}), [source, lang, marks]);
  const lines = React.useMemo(() => gutter(source), [source]);
  const lineCount = lines.split("\n").length;
  const bytes = React.useMemo(() => new TextEncoder().encode(source).length, [source]);

  const doCopy = () => {
    navigator.clipboard?.writeText(source);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  };

  const doAsk = (option) => {
    onAsk?.({ option: option.id, code: source, language: lang });
    if (option.href) {
      window.open(option.href + encodeURIComponent(prompt(option.id, lang, source)), "_blank", "noopener");
    }
  };

  const doRun = () => {
    setRunning(true);
    const done = (value, ok = true) => {
      setRunning(false);
      setResult(value == null ? "" : String(value));
      setOk(ok);
    };
    if (onRun) onRun({ code: source, language: lang, done });
    else done(output ?? "No runner attached — pass onRun to execute this.", false);
  };

  const cls = [
    "ns-code",
    chrome === "mac" ? "ns-code--mac" : chrome === "vscode" ? "ns-code--vscode" : "",
    theme === "dark" ? "ns-code--dark" : "",
    compact ? "ns-code--compact" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <figure className={cls} data-lang={lang} data-wrap={wrapped ? "true" : "false"} data-collapsed={collapsed ? "true" : "false"}>
      {chrome === "vscode" && files.length > 1 && (
        <div className="ns-code__tabs" role="tablist" aria-label={`${file.name} files`}>
          {files.map((f, i) => (
            <button key={f.name} type="button" role="tab" className="ns-code__tab"
              aria-selected={i === active} tabIndex={i === active ? 0 : -1}
              onClick={() => setActive(i)}>
              <i className="ph ph-code" aria-hidden="true" />{f.name}
            </button>
          ))}
        </div>
      )}

      <figcaption className="ns-code__bar">
        {chrome === "mac" && (
          <span className="ns-code__dots" aria-hidden="true"><i /><i /><i /></span>
        )}
        {!(chrome === "vscode" && files.length > 1) && (
          <span className="ns-code__file">
            <i className="ph ph-code" aria-hidden="true" /><span>{file.name}</span>
          </span>
        )}
        <span className="ns-code__actions">
          <span className="ns-code__lang">{lang}</span>

          {wrapToggle && (
            <button type="button" className="ns-code__btn ns-code__btn--icon" aria-pressed={wrapped}
              aria-label="Wrap long lines" onClick={() => setWrapped(!wrapped)}>
              <i className="ph ph-text-align-justify" aria-hidden="true" />
            </button>
          )}

          {ask && (
            <>
              <button type="button" className="ns-code__btn" popoverTarget={`${uid}-ai`}>
                <i className="ph ph-sparkle" aria-hidden="true" />
                <span className="ns-code__btn-label">Ask AI</span>
              </button>
              <div id={`${uid}-ai`} popover="auto" className="ns-popover ns-menu ns-code__menu">
                <p className="ns-menu__label">Ask about this code</p>
                {aiOptions.map((o) => (
                  <button key={o.id} type="button" className="ns-menu__item" onClick={() => doAsk(o)}>
                    <i className={`ph ${o.icon}`} aria-hidden="true" />{o.label}
                  </button>
                ))}
                <p className="ns-code__menu-note">The code and its language are sent to the assistant you pick. Nothing leaves the page until you choose one.</p>
              </div>
            </>
          )}

          {share && (
            <>
              <button type="button" className="ns-code__btn ns-code__btn--icon" popoverTarget={`${uid}-share`} aria-label="Share this snippet">
                <i className="ph ph-share-network" aria-hidden="true" />
              </button>
              <div id={`${uid}-share`} popover="auto" className="ns-popover ns-menu ns-code__menu">
                <p className="ns-menu__label">Share</p>
                <button type="button" className="ns-menu__item" onClick={() => navigator.clipboard?.writeText(shareUrl || (typeof window !== "undefined" ? window.location.href : ""))}>
                  <i className="ph ph-link-simple" aria-hidden="true" />Copy link
                </button>
                <button type="button" className="ns-menu__item" onClick={doCopy}>
                  <i className="ph ph-file-text" aria-hidden="true" />Copy as markdown
                </button>
                {typeof navigator !== "undefined" && navigator.share && (
                  <button type="button" className="ns-menu__item" onClick={() => navigator.share({ url: shareUrl || window.location.href })}>
                    <i className="ph ph-arrow-square-out" aria-hidden="true" />Share via…
                  </button>
                )}
              </div>
            </>
          )}

          {copy && (
            <button type="button" className="ns-code__btn" data-copied={copied || undefined} onClick={doCopy}>
              <i className={`ph ${copied ? "ph-check" : "ph-stack"}`} aria-hidden="true" />
              <span className="ns-code__btn-label"><span>Copy</span></span>
            </button>
          )}
        </span>
      </figcaption>

      <div className="ns-code__body">
        {lineNumbers && !wrapped && (
          <pre className="ns-code__gutter" aria-hidden="true">{lines}</pre>
        )}
        <pre className="ns-code__pre"><code dangerouslySetInnerHTML={{ __html: html }} /></pre>
      </div>

      {(run || collapsible) && (
        <div className="ns-code__foot">
          {run && (
            <button type="button" className="ns-code__run" data-state={running ? "running" : undefined} onClick={doRun}>
              <i className="ph ph-play" aria-hidden="true" />{running ? "Running" : "Run"}
            </button>
          )}
          {collapsible && (
            <button type="button" className="ns-code__btn" aria-expanded={!collapsed} onClick={() => setCollapsed(!collapsed)}>
              <i className={`ph ${collapsed ? "ph-caret-down" : "ph-caret-up"}`} aria-hidden="true" />
              {collapsed ? "Expand" : "Collapse"}
            </button>
          )}
          {result !== null && (
            <span className="ns-code__status">
              <i className={`ph ${ok ? "ph-check-circle" : "ph-warning-circle"}`} aria-hidden="true" />{ok ? "Success" : "Failed"}
            </span>
          )}
          <span className="ns-code__meta">{lineCount} lines · {bytes} B</span>
        </div>
      )}

      {result !== null && (
        <output className="ns-code__out" aria-live="polite">{result}</output>
      )}
    </figure>
  );
}

export default SyntaxHighlighter;
