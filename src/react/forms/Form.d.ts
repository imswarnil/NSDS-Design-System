import * as React from "react";

/** Wraps a control with its label, help text and error, and wires the ARIA
 *  relationships between them. Always wrap a control in one of these — it is
 *  what guarantees the control has a real label and that its error is
 *  announced rather than merely displayed. */
export interface FieldProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  label?: React.ReactNode;
  /** Persistent guidance. Linked with aria-describedby. */
  help?: React.ReactNode;
  /** Validation failure. Sets aria-invalid on the control and announces via role="alert". */
  error?: React.ReactNode;
  required?: boolean;
  /** Override the generated id. Leave unset — useId is SSR-safe. */
  id?: string;
  children?: React.ReactNode;
  className?: string;
}
export declare function Field(props: FieldProps): React.JSX.Element;

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Phosphor icon class, e.g. "ph-magnifying-glass". */
  icon?: string;
  /** Keyboard hint rendered at the end, e.g. "⌘K". Decorative; aria-hidden. */
  hint?: string;
  /** Monospace input — for data (org IDs, codes, keys) rather than prose. */
  mono?: boolean;
}
export declare function Input(props: InputProps): React.JSX.Element;

export interface SelectOption { value: string; label: string; disabled?: boolean }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options?: Array<SelectOption | string>;
  /** Rendered as a disabled first option so it cannot be submitted as a value. */
  placeholder?: string;
}
export declare function Select(props: SelectProps): React.JSX.Element;

export declare function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>): React.JSX.Element;

export interface ChoiceProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label: React.ReactNode;
  help?: React.ReactNode;
}
export interface CheckboxProps extends ChoiceProps {
  /** Mixed state — "some lessons complete". A DOM property, applied via ref. */
  indeterminate?: boolean;
}
export declare function Checkbox(props: CheckboxProps): React.JSX.Element;
export declare function Radio(props: ChoiceProps): React.JSX.Element;

/** For a setting that takes effect IMMEDIATELY. If it only applies on submit,
 *  use Checkbox — the control shape is a promise about when the change lands. */
export declare function Switch(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, "type">): React.JSX.Element;

export interface FieldsetProps extends React.FieldsetHTMLAttributes<HTMLFieldSetElement> {
  /** Required for a group of choices — this is what tells a screen reader that
   *  four radios are one question rather than four. */
  legend?: React.ReactNode;
}
export declare function Fieldset(props: FieldsetProps): React.JSX.Element;
