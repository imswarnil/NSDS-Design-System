import * as React from "react";

export interface ModalProps extends Omit<React.DialogHTMLAttributes<HTMLDialogElement>, "title"> {
  open: boolean;
  /** Called for EVERY close path — button, Esc, backdrop click. Keep parent
   *  state in sync here, not only in your button handler. */
  onClose?: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: "sm" | "lg";
  footer?: React.ReactNode;
}
export declare function Modal(props: ModalProps): React.JSX.Element;

export interface ConfirmModalProps {
  open: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title?: React.ReactNode;
  children?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  /** Renders the confirm button as a solid red. Cancel is still focused first,
   *  so Enter cancels rather than destroys. */
  destructive?: boolean;
}
export declare function ConfirmModal(props: ConfirmModalProps): React.JSX.Element;

export interface DrawerProps extends React.DialogHTMLAttributes<HTMLDialogElement> {
  open: boolean;
  onClose?: () => void;
  /** "start" for navigation, "end" for filters and detail panels. */
  side?: "start" | "end";
  title?: React.ReactNode;
}
export declare function Drawer(props: DrawerProps): React.JSX.Element;

export interface MenuItem {
  key?: string;
  label?: React.ReactNode;
  icon?: string;
  onClick?: (e: React.MouseEvent) => void;
  href?: string;
  danger?: boolean;
  current?: boolean;
  /** Renders a hairline divider instead of an item. */
  separator?: boolean;
}
export interface MenuProps {
  /** Omit for an icon-only trigger; a visually-hidden name is supplied. */
  label?: React.ReactNode;
  icon?: string;
  items?: MenuItem[];
  align?: "start" | "end";
  buttonClassName?: string;
}
export declare function Menu(props: MenuProps): React.JSX.Element;

export interface TooltipProps {
  /** SUPPLEMENTARY text only. Never the control's only accessible name —
   *  hover-only content is unreachable by touch. */
  text: React.ReactNode;
  children: React.ReactElement;
}
export declare function Tooltip(props: TooltipProps): React.JSX.Element;
