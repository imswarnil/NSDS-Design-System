import * as React from "react";

export declare function SettingsGroup(props: {
  legend: string;
  children?: React.ReactNode;
}): React.JSX.Element;

export declare function SettingsRow(props: {
  name: string;
  description?: string;
  /** A row that destroys something. Marked in text as well as color. */
  danger?: boolean;
  children?: React.ReactNode;
}): React.JSX.Element;

export declare function ModeChoice(props: {
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  options?: { value: string; label: string }[];
  label?: string;
}): React.JSX.Element;

export declare function SettingSwitch(props: {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}): React.JSX.Element;
