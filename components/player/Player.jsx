import React from "react";

/* Namaste UI — course player for the Next.js LMS.
   =========================================================================
   The screen a learner lives in. Layout and all styling are in
   components/css/player.css, shared with the Ghost lesson template; this
   layer adds the wiring markup cannot express: keyboard shortcuts, the
   media element's callbacks, and auto-scrolling the rail to the current
   lesson.

   The video element itself is the CALLER'S: pass a <video>, a YouTube
   <iframe>, a Mux player — anything. Owning playback here would chain the
   design system to one video vendor, and the Ghost theme already embeds
   whatever the lesson's HTML carries. */

/** The whole player screen. Compose:
 *
 *    <CoursePlayer
 *      stage={<video … />}
 *      kicker="Section 2 · Lesson 07"
 *      title="SOQL joins"
 *      meta={["21:15", "Updated Jan 2026"]}
 *      nav={{ prevHref, nextHref, onPrev, onNext }}
 *      progress={{ value: 6, max: 12 }}
 *      rail={<LessonRail … />}
 *      children={tabs / notes / transcript}
 *    />
 */
export function CoursePlayer({ stage, kicker, title, meta = [], nav, progress, rail, children }) {
  /* Global shortcuts: ← / → for prev/next lesson. Deliberately NOT space/k
     (play-pause) — that belongs to the media element, and stealing it breaks
     every embedded player's own controls. Skipped while the user is typing. */
  React.useEffect(() => {
    if (!nav) return;
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      if (e.key === "ArrowLeft" && (nav.onPrev || nav.prevHref)) { nav.onPrev ? nav.onPrev() : (location.href = nav.prevHref); }
      if (e.key === "ArrowRight" && (nav.onNext || nav.nextHref)) { nav.onNext ? nav.onNext() : (location.href = nav.nextHref); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [nav]);

  const btn = (dir) => {
    const href = nav?.[`${dir}Href`];
    const onClick = nav?.[`on${dir === "prev" ? "Prev" : "Next"}`];
    const disabled = !href && !onClick;
    const label = dir === "prev" ? "Previous lesson" : "Next lesson";
    const icon = dir === "prev" ? "ph-caret-left" : "ph-caret-right";
    const Tag = href ? "a" : "button";
    return (
      <Tag
        className={`ns-btn ${dir === "next" ? "ns-btn--primary" : "ns-btn--outline"}`}
        href={href}
        onClick={onClick}
        aria-disabled={disabled || undefined}
        {...(Tag === "button" ? { type: "button", disabled } : {})}
      >
        {dir === "prev" && <i className={`ph ${icon}`} aria-hidden="true" />}
        {label}
        {dir === "next" && <i className={`ph ${icon}`} aria-hidden="true" />}
      </Tag>
    );
  };

  return (
    <div className="ns-player">
      <div className="ns-player__main">
        <div className="ns-player__stage">{stage}</div>
        <header className="ns-player__head">
          {kicker && <p className="ns-player__kicker">{kicker}</p>}
          <h1 className="ns-player__title">{title}</h1>
          {meta.length > 0 && (
            <p className="ns-player__meta">
              {meta.map((m, i) => <span key={i}>{m}</span>)}
            </p>
          )}
        </header>
        {children && <div className="ns-player__body">{children}</div>}
        {(nav || progress) && (
          <div className="ns-player__nav">
            {nav && btn("prev")}
            {progress && (
              <div className="ns-progress-row">
                <progress
                  className="ns-progress"
                  value={progress.value}
                  max={progress.max}
                  aria-label={`Course progress: ${progress.value} of ${progress.max} lessons`}
                />
                <span className="ns-progress-row__value">{progress.value}/{progress.max}</span>
              </div>
            )}
            {nav && btn("next")}
          </div>
        )}
      </div>
      {rail}
    </div>
  );
}

/** The curriculum rail. Sections with lesson rows; the current lesson is
 *  scrolled into view on mount, because a learner opening lesson 31 of 40
 *  should not have to find themselves in the list. */
export function LessonRail({ courseTitle, done, total, sections = [], currentHref, hrefFor = (l) => l.href, label = "Curriculum" }) {
  const listRef = React.useRef(null);

  React.useEffect(() => {
    /* block:'nearest' — bring it into view without yanking the page itself,
       which matters in the single-column mobile layout. */
    listRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest" });
  }, [currentHref]);

  let n = 0;
  return (
    <nav className="ns-player__side" aria-label={label}>
      <div className="ns-player__side-head">
        <strong>{courseTitle}</strong>
        {done != null && total != null && <span>{done}/{total} done</span>}
      </div>
      <div className="ns-player__list" ref={listRef}>
        {sections.map((section) => (
          <React.Fragment key={section.title}>
            <p className="ns-player__section">{section.title}</p>
            {section.lessons.map((lesson) => {
              n += 1;
              const href = hrefFor(lesson);
              const current = href === currentHref;
              const state = lesson.locked ? "locked" : lesson.done ? "done" : undefined;
              return (
                <a
                  key={href}
                  className="ns-lesson"
                  href={lesson.locked && lesson.upgradeHref ? lesson.upgradeHref : href}
                  aria-current={current || undefined}
                  data-state={state}
                >
                  <span className="ns-lesson__index" aria-hidden="true">
                    {lesson.done ? <i className="ph ph-check" /> : String(n).padStart(2, "0")}
                  </span>
                  <span className="ns-lesson__title">
                    {lesson.title}
                    {/* State spelled for assistive tech — the check glyph and
                        the dimming are visual-only. */}
                    {lesson.done && <span className="ns-visually-hidden"> (completed)</span>}
                    {lesson.locked && <span className="ns-visually-hidden"> (locked — members only)</span>}
                  </span>
                  <span className="ns-lesson__time">
                    {lesson.locked ? <i className="ph ph-lock" aria-hidden="true" /> : lesson.duration}
                  </span>
                </a>
              );
            })}
          </React.Fragment>
        ))}
      </div>
    </nav>
  );
}
