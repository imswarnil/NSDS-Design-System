import React from "react";

/* Namaste UI — overlays for the Next.js LMS.
   =========================================================================
   Built on <dialog> and the popover attribute rather than on portals and
   hand-written focus traps. The platform already implements focus trapping,
   background inertness, Esc-to-close, light dismiss and top-layer stacking;
   reimplementing those in React is how a design system ends up shipping a
   modal that a keyboard user can tab out of.

   What React adds here is only the bridge between declarative `open` state
   and the imperative showModal()/close() API, plus focus restoration. */

/** Modal dialog. Opens with showModal(), which is what grants the focus trap,
 *  the inert background and the top layer — toggling a class does not. */
export function Modal({ open, onClose, title, description, size, footer, children, className = "", ...rest }) {
  const ref = React.useRef(null);
  const restoreTo = React.useRef(null);
  const titleId = React.useId();
  const descId = React.useId();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) {
      /* Remember what had focus BEFORE opening. <dialog> restores focus on
         close in modern browsers, but not reliably when the trigger unmounts
         or when close() is called programmatically — so it is done here too,
         and being idempotent costs nothing. */
      restoreTo.current = document.activeElement;
      el.showModal();
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    /* The `cancel` event fires on Esc; `close` fires for every close path.
       Listening to `close` (not just the button) means Esc and the backdrop
       both flow through the same onClose, so parent state never desyncs from
       the dialog's real open state. */
    const handleClose = () => {
      onClose?.();
      const target = restoreTo.current;
      if (target && document.contains(target)) target.focus?.();
    };
    el.addEventListener("close", handleClose);
    return () => el.removeEventListener("close", handleClose);
  }, [onClose]);

  /* Clicking the backdrop closes. The check compares against the dialog
     itself because the ::backdrop pseudo-element is not a real event target —
     clicks on it land on the <dialog> box, outside its content box. */
  const onBackdropClick = (e) => {
    if (e.target === ref.current) ref.current.close();
  };

  return (
    <dialog
      ref={ref}
      className={["ns-modal", size && `ns-modal--${size}`, className].filter(Boolean).join(" ")}
      aria-labelledby={title ? titleId : undefined}
      aria-describedby={description ? descId : undefined}
      onClick={onBackdropClick}
      {...rest}
    >
      {(title || onClose) && (
        <div className="ns-modal__header">
          <div>
            {title && <h2 className="ns-modal__title" id={titleId}>{title}</h2>}
            {description && <p className="ns-field__help" id={descId}>{description}</p>}
          </div>
          {/* aria-label is mandatory on an icon-only button: without it the
              control announces as "button" and nothing else. */}
          <button
            type="button"
            className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm ns-modal__close"
            aria-label="Close dialog"
            onClick={() => ref.current?.close()}
          >
            <i className="ph ph-x" aria-hidden="true" />
          </button>
        </div>
      )}
      <div className="ns-modal__body">{children}</div>
      {footer && <div className="ns-modal__footer">{footer}</div>}
    </dialog>
  );
}

/** Confirmation dialog. Separate from Modal because the destructive case has
 *  a fixed shape that should not be re-decided per call site: the cancel
 *  button comes first and is focused by default, so Enter cancels rather than
 *  destroys. */
export function ConfirmModal({ open, onClose, onConfirm, title, children, confirmLabel = "Confirm", cancelLabel = "Cancel", destructive }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      size="sm"
      footer={
        <>
          {/* autoFocus lands on Cancel deliberately. <dialog> focuses the
              first focusable child otherwise, and for a delete confirmation
              that must never be the destructive action. */}
          <button type="button" className="ns-btn ns-btn--outline" onClick={onClose} autoFocus>{cancelLabel}</button>
          <button
            type="button"
            className={`ns-btn ${destructive ? "ns-btn--danger-solid" : "ns-btn--primary"}`}
            onClick={onConfirm}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      {children}
    </Modal>
  );
}

/** Edge-anchored panel — mobile navigation, the docs sidebar below `lg`, a
 *  filter panel. Same <dialog> semantics as Modal, so it is equally trapped
 *  and equally Esc-dismissible. */
export function Drawer({ open, onClose, side = "start", title, children, className = "", ...rest }) {
  const ref = React.useRef(null);
  const titleId = React.useId();

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (open && !el.open) el.showModal();
    else if (!open && el.open) el.close();
  }, [open]);

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handle = () => onClose?.();
    el.addEventListener("close", handle);
    return () => el.removeEventListener("close", handle);
  }, [onClose]);

  return (
    <dialog
      ref={ref}
      className={`ns-drawer ns-drawer--${side} ${className}`.trim()}
      aria-labelledby={title ? titleId : undefined}
      onClick={(e) => { if (e.target === ref.current) ref.current.close(); }}
      {...rest}
    >
      <div className="ns-drawer__header">
        {title && <strong id={titleId}>{title}</strong>}
        <button
          type="button"
          className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm"
          style={{ marginInlineStart: "auto" }}
          aria-label="Close menu"
          onClick={() => ref.current?.close()}
        >
          <i className="ph ph-x" aria-hidden="true" />
        </button>
      </div>
      <div className="ns-drawer__body">{children}</div>
    </dialog>
  );
}

/** Dropdown menu. Uses the popover attribute, so light dismiss (click outside
 *  or Esc) is handled by the browser — no document-level click listener to
 *  register, leak, or fight with React's synthetic event ordering.
 *
 *  Keyboard: arrows move between items, Home/End jump to the ends, Esc closes.
 *  Items are real <button>/<a> elements, so Enter and Space already work. */
export function Menu({ label, icon = "ph-dots-three", items = [], align = "end", buttonClassName = "ns-btn ns-btn--outline ns-btn--sm" }) {
  const id = React.useId().replace(/:/g, "");
  const popoverId = `menu-${id}`;
  const ref = React.useRef(null);

  const onKeyDown = (e) => {
    const focusables = Array.from(ref.current?.querySelectorAll("[data-menu-item]") ?? []);
    if (!focusables.length) return;
    const index = focusables.indexOf(document.activeElement);
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const delta = e.key === "ArrowDown" ? 1 : -1;
      /* Wraps at both ends — from the last item ArrowDown returns to the
         first, which is what every native menu does. */
      const next = (index + delta + focusables.length) % focusables.length;
      focusables[next].focus();
    } else if (e.key === "Home") { e.preventDefault(); focusables[0].focus(); }
    else if (e.key === "End") { e.preventDefault(); focusables.at(-1).focus(); }
  };

  return (
    <>
      <button type="button" className={buttonClassName} popoverTarget={popoverId} aria-haspopup="menu">
        {label ?? <i className={`ph ${icon}`} aria-hidden="true" />}
        {!label && <span className="ns-visually-hidden">Open menu</span>}
      </button>
      <div
        ref={ref}
        id={popoverId}
        popover="auto"
        role="menu"
        className="ns-popover ns-menu"
        onKeyDown={onKeyDown}
        style={{ [align === "end" ? "insetInlineEnd" : "insetInlineStart"]: 0 }}
      >
        {items.map((item, i) =>
          item.separator ? <hr className="ns-menu__sep" key={`sep-${i}`} />
          : item.label && !item.onClick && !item.href ? <div className="ns-menu__label" key={`lbl-${i}`}>{item.label}</div>
          : (
            <button
              type="button"
              key={item.key ?? item.label}
              data-menu-item
              role="menuitem"
              className={`ns-menu__item ${item.danger ? "ns-menu__item--danger" : ""}`.trim()}
              aria-current={item.current || undefined}
              onClick={(e) => { item.onClick?.(e); ref.current?.hidePopover(); }}
            >
              {item.icon && <i className={`ph ${item.icon}`} aria-hidden="true" />}
              {item.label}
            </button>
          )
        )}
      </div>
    </>
  );
}

/** Supplementary hover/focus text. It may NEVER carry the control's only
 *  label — content that exists solely on hover is unreachable by touch. If
 *  the trigger has no visible text, give it aria-label and use this for the
 *  extra detail only. */
export function Tooltip({ text, children }) {
  const id = React.useId();
  return (
    <span className="ns-tooltip-host">
      {React.isValidElement(children)
        ? React.cloneElement(children, { "aria-describedby": id })
        : children}
      <span className="ns-tooltip" id={id} role="tooltip">{text}</span>
    </span>
  );
}
