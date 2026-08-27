import React from "react";
/** Instructor byline. Renders .ns-authorbox from components/css/blog.css —
 *  a hairline card with a mono role tag rather than decorative framing. */
export function AuthorBox({ name, bio, avatar, role = "Instructor", links, className = "", ...rest }) {
  return (
    <div className={["ns-authorbox", className].filter(Boolean).join(" ")} {...rest}>
      {avatar
        ? <img className="ns-authorbox__avatar" src={avatar} alt="" />
        : <span className="ns-authorbox__avatar" aria-hidden="true">{name?.[0]}</span>}
      <div>
        <p className="ns-authorbox__name">{name}</p>
        <p className="ns-authorbox__role">{role}</p>
        {bio && <p className="ns-authorbox__bio">{bio}</p>}
        {links && <div className="ns-authorbox__links">{links}</div>}
      </div>
    </div>
  );
}
