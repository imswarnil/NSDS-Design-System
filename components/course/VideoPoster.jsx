import React from "react";
/** Video poster with a play affordance. Styling lives in components/css/media.css
 *  as .ns-video, which the Ghost theme renders from templates/. */
export function VideoPoster({ image, alt = "", duration, onPlay, label = "Play video", className = "", ...rest }) {
  return (
    <div className={["ns-video", className].filter(Boolean).join(" ")} {...rest}>
      {image ? <img className="ns-video__poster" src={image} alt={alt} /> : <span className="ns-video__poster" />}
      <button className="ns-video__play" type="button" onClick={onPlay} aria-label={label}>
        <i className="ph ph-play" aria-hidden="true" />
      </button>
      {duration && <span className="ns-video__dur">{duration}</span>}
    </div>
  );
}
