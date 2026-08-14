import React from "react";
/** Responsive wordmark lockup — icon (favicon.svg) + text, or icon-only when compact.
 *  Never invent a pictorial mark beyond the source's own favicon asset.
 *  Styling lives in components/css/display.css as .ns-logo, so the Ghost theme
 *  renders the identical lockup from templates/logo.html. */
export function Logo({
  iconSrc = "assets/logo/favicon.svg",
  text = "Namaste Salesforce",
  compact = false,
  light = false,
  size = "md",
  as: Tag = "span",
  className = "",
  ...rest
}) {
  const classes = [
    "ns-logo",
    size !== "md" && `ns-logo--${size}`,
    compact && "ns-logo--compact",
    light && "ns-logo--light",
    className,
  ].filter(Boolean).join(" ");
  return (
    <Tag className={classes} {...rest}>
      <img className="ns-logo__mark" src={iconSrc} alt="" />
      <span className="ns-logo__text">{text}</span>
    </Tag>
  );
}
