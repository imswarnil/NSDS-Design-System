import React from "react";

/* Namaste UI — feedback for the Next.js LMS.
   =========================================================================
   Loading, empty, error and success are states a product spends far more time
   in than anyone designing it expects, and they are the states most often left
   to whoever writes the screen. Shipping them as components is what stops each
   screen inventing its own.

   The recurring accessibility concern in this file is LIVE REGIONS: getting a
   message announced without either shouting over the user or saying nothing at
   all. The rule used throughout: role="status" (polite) for anything
   informational, role="alert" (assertive) only for a failure the user must
   deal with now. */

const STATUS_ICON = {
  success: "ph-check-circle",
  warning: "ph-warning",
  error: "ph-warning-circle",
  info: "ph-info",
};

/** Inline status: a dot, a mono label, and colour third. Never colour alone —
 *  the word is always present, so the state survives grayscale and
 *  colourblindness. */
export function Status({ tone = "info", children, className = "" }) {
  return <span className={`ns-status ns-status--${tone} ${className}`.trim()}>{children}</span>;
}

/** Block-level message tied to a region of the page.
 *
 *  Anything the user must act on belongs here rather than in a Toast: an
 *  alert stays on screen, is reachable by keyboard, and sits next to the thing
 *  that failed. */
export function Alert({ tone = "info", title, children, actions, icon, className = "", ...rest }) {
  return (
    <div
      className={`ns-alert ns-alert--${tone} ${className}`.trim()}
      /* assertive only for errors. A polite "saved" that interrupts what the
         user is reading is worse than one they hear a moment later. */
      role={tone === "error" ? "alert" : "status"}
      {...rest}
    >
      <i className={`ph ${icon ?? STATUS_ICON[tone]} ns-alert__icon`} aria-hidden="true" />
      <div className="ns-alert__body">
        {title && <strong className="ns-alert__title">{title}</strong>}
        {children && <div className="ns-alert__text">{children}</div>}
        {actions && <div className="ns-alert__actions">{actions}</div>}
      </div>
    </div>
  );
}

/* --- Toasts ---------------------------------------------------------------
   The live region is mounted ONCE, empty, at app start; messages are inserted
   into it later. Creating the region and its message in the same render is the
   classic bug that makes screen readers announce nothing — the region has to
   already exist for the insertion to be observed. */
const ToastContext = React.createContext(null);

/** Mount once, near the root of the app. */
export function ToastProvider({ children, duration = 5000 }) {
  const [toasts, setToasts] = React.useState([]);
  const idRef = React.useRef(0);

  const dismiss = React.useCallback((id) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  const toast = React.useCallback((message, { tone = "info", duration: d } = {}) => {
    const id = ++idRef.current;
    setToasts((list) => [...list, { id, message, tone }]);
    /* Errors do NOT auto-dismiss: a message that disappears before it is read
       is worse than no message. They stay until dismissed explicitly. */
    if (tone !== "error") {
      setTimeout(() => dismiss(id), d ?? duration);
    }
    return id;
  }, [dismiss, duration]);

  const value = React.useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="ns-toast-region" role="status" aria-live="polite" aria-atomic="false">
        {toasts.map((t) => (
          <div key={t.id} className={`ns-toast ns-toast--${t.tone}`}>
            <span className="ns-toast__text">{t.message}</span>
            <button
              type="button"
              className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm ns-toast__close"
              aria-label="Dismiss notification"
              onClick={() => dismiss(t.id)}
            >
              <i className="ph ph-x" aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

/** `const { toast } = useToast()` → `toast("Progress saved")`. */
export function useToast() {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
}

/** Loading placeholder.
 *
 *  The shapes are aria-hidden and a single visually-hidden "Loading" is
 *  announced instead: eight shimmering bars announced one by one is noise, not
 *  information. */
export function Skeleton({ variant = "text", count = 1, width, className = "", label = "Loading" }) {
  return (
    <>
      <span className="ns-visually-hidden" role="status">{label}</span>
      <span aria-hidden="true">
        {Array.from({ length: count }, (_, i) => (
          <span
            key={i}
            className={`ns-skeleton ns-skeleton--${variant} ${className}`.trim()}
            style={{
              display: "block",
              /* Last line of a paragraph runs short, which is what makes a
                 text skeleton read as text rather than as a grey block. */
              width: width ?? (variant === "text" && i === count - 1 ? "70%" : undefined),
            }}
          />
        ))}
      </span>
    </>
  );
}

/** Indeterminate spinner, for waits under about a second where a skeleton
 *  would flash. Anything longer should be a Skeleton — a spinner tells the
 *  user nothing about what is arriving. */
export function Spinner({ size, label = "Loading", className = "" }) {
  return (
    <>
      <span className={`ns-spinner ${size === "lg" ? "ns-spinner--lg" : ""} ${className}`.trim()} aria-hidden="true" />
      <span className="ns-visually-hidden" role="status">{label}</span>
    </>
  );
}

/** Empty state. All three parts are required by the signature on purpose:
 *  what is not here, why, and the one thing to do about it. An empty state
 *  with no next step is a dead end — if there genuinely is nothing to do, say
 *  so in `description` rather than leaving the user to work it out. */
export function EmptyState({ icon = "ph-folder-open", title, description, action, className = "" }) {
  return (
    <div className={`ns-empty ${className}`.trim()}>
      <i className={`ph ${icon} ns-empty__icon`} aria-hidden="true" />
      <p className="ns-empty__title">{title}</p>
      {description && <p className="ns-empty__text">{description}</p>}
      {action && <div className="ns-empty__action">{action}</div>}
    </div>
  );
}

/** Whole-page failure: 404, 500, a route that threw. The mono status code is
 *  a first-class element — the console motif applied to the failure page. */
export function ErrorState({ code, title, description, action, className = "" }) {
  return (
    <div className={`ns-empty ns-error-state ${className}`.trim()} role="alert">
      {code && <p className="ns-empty__code">{code}</p>}
      <p className="ns-empty__title">{title}</p>
      {description && <p className="ns-empty__text">{description}</p>}
      {action && <div className="ns-empty__action">{action}</div>}
    </div>
  );
}
