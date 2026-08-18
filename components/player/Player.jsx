import React from "react";
import { LessonType, LessonAccess, LESSON_TYPES } from "../course/LessonType.jsx";
import { TableOfContents } from "../core/TableOfContents.jsx";

/* Namaste UI — course player for the Next.js LMS.
   =========================================================================
   The screen a learner lives in. Layout and all styling are in
   components/css/player.css, shared with the Ghost lesson template; this
   layer adds the wiring markup cannot express: keyboard shortcuts, the
   media element's callbacks, and auto-scrolling the rail to the current
   lesson.

   This file is the React half of templates/course-player.html and
   templates/course-player-article.html. When one changes, so does the other —
   they are one component with two renderers, and the moment they disagree the
   Ghost lesson page and the app lesson page stop being the same room.

   The video element itself is the CALLER'S: pass a <video>, a YouTube
   <iframe>, the system's own .ns-vplayer — anything. Owning playback here
   would chain the design system to one video vendor, and the Ghost theme
   already embeds whatever the lesson's HTML carries. Pass `stageWired` when
   what you hand over is a full player with its own control bar, so the 16:9
   box moves down to it and the bar is not nailed inside a box that is already
   exactly 16:9. */

/** The whole player screen. Compose:
 *
 *    <CoursePlayer
 *      variant="video"                        // or "article"
 *      stage={<VideoPlayer … />} stageWired
 *      kind="video"
 *      kicker="lesson 07 of 12"
 *      title="SOQL joins"
 *      meta={["21:15", "5 chapters", "Updated Jan 2026"]}
 *      nav={{ prevHref, prevTitle, nextHref, nextTitle, index: 7, total: 12 }}
 *      details={<Tabs … />}                   // chapters / transcript / files
 *      rail={<LessonRail … />}
 *    />
 *
 *  For variant="article" pass the prose as children and the outline as
 *  tocItems — the reading column and its outline are sized together, so the
 *  header and the docked nav line up on the same left edge as the text.
 */
export function CoursePlayer({
  variant = "video",
  stage,
  stageWired = false,
  breadcrumb,
  kind,
  kicker,
  title,
  meta = [],
  nav,
  details,
  tocItems = [],
  activeTocId,
  onTocNavigate,
  readingProgressTarget,
  appendix,
  onRailToggle,
  chapters,
  aside,
  rail,
  children,
  className = "",
  ...rest
}) {
  const article = variant === "article";

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

  /* Prev/next by NAME. An arrow pair with no titles makes the learner click to
     find out where they are going. A still where the lesson has one — or its
     kind glyph where it does not; never an empty box. */
  const step = (dir) => {
    const next = dir === "next";
    const href = nav?.[next ? "nextHref" : "prevHref"];
    const onClick = nav?.[next ? "onNext" : "onPrev"];
    const name = nav?.[next ? "nextTitle" : "prevTitle"];
    const thumb = nav?.[next ? "nextThumb" : "prevThumb"];
    const kindOf = nav?.[next ? "nextKind" : "prevKind"];
    /* The lesson NUMBER, on the control it belongs to. "06 SELECT and WHERE"
       says where you are GOING; a counter in the middle of the bar only said
       where you already are, which the rail three inches to the left says
       better. Derived from nav.index unless the caller overrides it — the
       lesson either side of this one is the lesson either side of this one. */
    const at = nav?.[next ? "nextIndex" : "prevIndex"]
      ?? (nav?.index != null ? nav.index + (next ? 1 : -1) : null);
    if (!href && !onClick) return null;
    const Tag = href ? "a" : "button";
    const arrow = <i className={`ph ${next ? "ph-arrow-right" : "ph-arrow-left"} ns-lesson-nav__arrow`} aria-hidden="true" />;
    const still = thumb
      ? <img className="ns-lesson-nav__thumb" src={thumb} alt="" />
      : kindOf
        ? <span className="ns-lesson-nav__thumb" aria-hidden="true"><i className={`ph ${LESSON_TYPES[kindOf]?.[0] || "ph-article"}`} /></span>
        : null;
    return (
      <Tag
        className={`ns-lesson-nav__btn${next ? " ns-lesson-nav__btn--next" : ""}`}
        href={href}
        onClick={onClick}
        data-state={nav?.[next ? "nextLocked" : "prevLocked"] ? "locked" : undefined}
        {...(Tag === "button" ? { type: "button" } : {})}
      >
        {!next && arrow}
        {!next && still}
        {!next && at != null && <span className="ns-lesson-nav__index" aria-hidden="true">{String(at).padStart(2, "0")}</span>}
        <span className="ns-lesson-nav__dir">{next ? "Next" : "Previous"}</span>
        <span className="ns-lesson-nav__name">{name}</span>
        {next && at != null && <span className="ns-lesson-nav__index" aria-hidden="true">{String(at).padStart(2, "0")}</span>}
        {next && still}
        {next && arrow}
        {/* The arrow is the only thing saying "previous" to a sighted reader,
            and an arrow beside a lesson title is ambiguous the first time you
            meet it: is that the lesson before this one, or the one this one
            links to? One hover answers it, and after that nobody needs it
            again — which is exactly what a tooltip is for. */}
        <span className="ns-tooltip">{next ? "Next lesson" : "Previous lesson"}</span>
      </Tag>
    );
  };

  const head = (
    <header className="ns-player__head">
      {(kind || kicker) && (
        <p className="ns-player__kicker">
          {kind && <LessonType kind={kind} />}
          {kicker}
        </p>
      )}
      <h1 className="ns-player__title">{title}</h1>
      {meta.length > 0 && (
        <p className="ns-player__meta">
          {meta.map((m, i) => <span key={i}>{m}</span>)}
        </p>
      )}
    </header>
  );

  /* ONE docked bar, on both lesson kinds: two controls, their stills, their
     numbers, and nothing between them.

     The centre used to carry "Lesson 07 / 12" and an "all lessons" link. Both
     are gone. The number now rides on each control, where it says something
     useful — where you are going, not where you already are — and the whole
     curriculum is a rail three inches to the left rather than a link. A docked
     bar with a third block in the middle is a toolbar. */
  const footer = nav && (
    <nav className="ns-player__nav ns-lesson-nav ns-lesson-nav--thumbs" aria-label="Lesson navigation">
      {step("prev")}
      {step("next")}
    </nav>
  );

  /* The page rail: the list of places inside THIS lesson, plus whatever else
     belongs to the page rather than to the course. On a written lesson that
     list is the headings; on a video lesson it is the chapters. Same column,
     same edge, same behaviour — a learner moving from lesson 7 to lesson 8
     should not have to find the controls again.

     Sticky as a whole, so a sponsor under the list travels with the reader
     instead of scrolling away at the first heading. Below lg the outline
     inside it is hidden — its links move to the horizontal strip above the
     content — and the rest follows the lesson rather than vanishing with the
     layout it happened to be sitting in. */
  const pageRail = (tocItems.length > 0 || chapters || aside) && (
    <aside className="ns-player__toc">
      {tocItems.length > 0 && (
        <TableOfContents
          items={tocItems}
          activeId={activeTocId}
          onNavigate={onTocNavigate}
          aria-label="On this page"
        />
      )}
      {chapters}
      {aside}
    </aside>
  );

  return (
    <div className={["ns-player", article && "ns-player--article", className].filter(Boolean).join(" ")} {...rest}>
      <div className="ns-player__main">
        {/* The way back to a collapsed rail. The control that CLOSED it lives
            inside the rail and goes away with it, so exactly one of the pair is
            ever on screen — they are two halves of one switch, not two
            buttons. Hidden by CSS while the rail is open. */}
        {onRailToggle && (
          <button type="button" className="ns-navicon ns-player__railopen" onClick={onRailToggle}
                  aria-label="Show curriculum" aria-expanded="false" aria-controls="player-rail">
            <i className="ph ph-sidebar" aria-hidden="true" />
          </button>
        )}
        {/* Inside the scrolling column rather than above the player, so it
            scrolls away with the content. The standing way back is the arrow
            on the course name in the rail, which never moves. */}
        {breadcrumb}
        {head && article && head}
        {/* The reading hairline. Driven by assets/js/lms.js from data-target;
            2px and no label, because a reading-progress widget with a
            percentage is a distraction from the thing it is measuring. */}
        {article && readingProgressTarget && (
          <div className="ns-lprogress ns-lprogress--article" data-target={readingProgressTarget} />
        )}

        <div className="ns-player__reading">
          <div>
            {/* The stage sits INSIDE the content grid rather than spanning the
                whole column, and that is what keeps the frame honest: a 16:9
                box across a full-width lesson column is 650px tall and pushes
                the title off the screen. The page rail beside it is the
                constraint, so the video keeps its exact ratio instead of being
                letterboxed into a height cap. */}
            {!article && stage && (
              <div className={`ns-player__stage${stageWired ? " ns-player__stage--player" : ""}`}>{stage}</div>
            )}
            {!article && head}

            {/* The phone shape of the outline: a horizontal strip, scanned
                sideways, above the content. Hidden on the wide layout, which
                already has the rail. */}
            {tocItems.length > 0 && (
              <TableOfContents
                items={tocItems}
                activeId={activeTocId}
                onNavigate={onTocNavigate}
                title={null}
                className="ns-toc--inline ns-player__toc--inline"
                aria-label="On this page"
              />
            )}

            {article ? (
              /* .ns-prose wraps only the PROSE. `appendix` — the "what you
                 learned" summary, the glossary, the in-lesson sponsor — is a
                 sibling of it rather than a child, because prose styles bare
                 ul/dt/dd and would put square markers down the checklist and a
                 rule down the glossary. Both stay inside the article, so the
                 reading hairline still measures the whole lesson. */
              <article className="ns-player__body" id={(readingProgressTarget || "").replace(/^#/, "") || undefined}>
                <div className="ns-prose">{children}</div>
                {appendix}
              </article>
            ) : (
              children && <div className="ns-player__body"><div className="ns-prose">{children}</div></div>
            )}

            {/* Tabs are UI, not prose, so the strip takes the column's whole
                width; prose inside a panel keeps its own measure. */}
            {details && <div className={`ns-player__body${article ? "" : " ns-player__body--wide"}`}>{details}</div>}
            {!article && appendix}
          </div>
          {pageRail}
        </div>

        {footer}
      </div>
      {rail}
    </div>
  );
}

/* One row, rendered the same way in the rail and in the mobile popover —
   because they are the same list, and two spellings of it is how the rail
   ended up showing icons while the panel still showed words. */
function LessonRow({ lesson, index, currentHref, hrefFor, first }) {
  const href = hrefFor(lesson);
  const locked = lesson.access === "members" || lesson.access === "soon";
  const target = locked && lesson.upgradeHref ? lesson.upgradeHref : href;
  return (
    <a
      className="ns-lesson"
      href={target}
      aria-current={href === currentHref ? "true" : undefined}
      data-state={lesson.done ? "done" : undefined}
      data-access={lesson.access}
    >
      <span className="ns-lesson__index" aria-hidden="true">
        {lesson.done ? <i className="ph ph-check-circle" /> : String(index).padStart(2, "0")}
      </span>
      <span className="ns-lesson__title">
        {lesson.title}
        {/* State spelled for assistive tech — the check glyph and the dimming
            are visual-only. */}
        {lesson.done && <span className="ns-visually-hidden"> (completed)</span>}
        {lesson.access === "members" && <span className="ns-visually-hidden"> (locked — members only)</span>}
        {lesson.access === "soon" && <span className="ns-visually-hidden"> (not released yet)</span>}
      </span>
      {/* The list is its own scroll region, so a tooltip opening upward from
          the first row is drawn outside the box and clipped. Every row after
          it has somewhere to go. */}
      <LessonType kind={lesson.type} tooltipBelow={first} />
      <span className="ns-lesson__time">
        {locked ? <i className="ph ph-lock-simple" aria-hidden="true" /> : lesson.duration}
      </span>
    </a>
  );
}

/** The curriculum rail. Scrolls the current lesson into view on mount, because
 *  a learner opening lesson 31 of 40 should not have to find themselves in the
 *  list.
 *
 *  A COURSE IS A FLAT LIST OF LESSONS — pass `lessons`. A course is one arc of
 *  eight to fourteen of them, and wrapping that in a single collapsible
 *  "Section 1" is a disclosure control that discloses everything. `sections`
 *  is still accepted for the surfaces that genuinely have them (training
 *  modules), and renders the mono section kicker between runs of rows.
 *
 *  The id is load-bearing: the course bar's curriculum toggle points
 *  aria-controls at it. Rename it here and you must rename it there, or the
 *  button announces a relationship to nothing. */
export function LessonRail({
  courseTitle,
  courseHref,
  done,
  total,
  lessons,
  sections = [],
  currentHref,
  hrefFor = (l) => l.href,
  foot,
  search = false,
  searchPlaceholder = "Find a lesson",
  onToggle,
  label = "Curriculum",
  id = "player-rail",
}) {
  const listRef = React.useRef(null);
  const searchId = React.useId().replace(/:/g, "");
  /* Filtering is DONE HERE rather than left to the caller: every consumer
     would otherwise write the same lowercase-includes over the same array, and
     the one that got it slightly different would be the one nobody noticed. */
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    /* block:'nearest' — bring it into view without yanking the page itself,
       which matters in the single-column mobile layout. */
    listRef.current?.querySelector('[aria-current="true"]')?.scrollIntoView({ block: "nearest" });
  }, [currentHref]);

  /* The INDEX is the lesson's position in the course, not its position in the
     filtered view — filtering to one lesson must not renumber it to 01. */
  const q = query.trim().toLowerCase();
  const hit = (lesson) => !q || String(lesson.title).toLowerCase().includes(q);

  let n = 0;
  let shown = 0;
  const row = (lesson) => {
    n += 1;
    if (!hit(lesson)) return null;
    shown += 1;
    return <LessonRow key={hrefFor(lesson)} lesson={lesson} index={n} currentHref={currentHref} hrefFor={hrefFor} first={shown === 1} />;
  };
  const rows = lessons
    ? lessons.map(row)
    : sections.map((section) => {
        const kids = section.lessons.map(row).filter(Boolean);
        /* A section heading over nothing is a heading that lies about what is
           under it. */
        if (!kids.length) return null;
        return (
          <React.Fragment key={section.title}>
            <p className="ns-player__section">{section.title}</p>
            {kids}
          </React.Fragment>
        );
      });

  return (
    <nav className="ns-player__side" id={id} aria-label={label}>
      {/* A LABEL and the rail's own collapse control. The course name and its
          back arrow are on the course bar directly above, and the same link
          twice in two inches is duplication that makes a screen feel
          unconsidered. The toggle is here rather than in the bar because a
          control for a panel should be attached to the panel; reopening is
          CoursePlayer's railopen button, outside the rail. */}
      <div className="ns-player__side-head">
        {courseTitle}
        {done != null && total != null && <span>{done}/{total}</span>}
        {onToggle && (
          <button type="button" className="ns-navicon" onClick={onToggle}
                  aria-label="Collapse curriculum" aria-expanded="true" aria-controls={id}>
            <i className="ph ph-sidebar" aria-hidden="true" />
          </button>
        )}
      </div>
      {/* At the head of the thing it filters — where you look before you start
          scrolling rather than after you have given up. type="search" so the
          clear button and the Escape key come from the browser. */}
      {search && (
        <div className="ns-player__side-search">
          <label className="ns-visually-hidden" htmlFor={searchId}>Search lessons</label>
          <span className="ns-input-wrap">
            <i className="ph ph-magnifying-glass ns-input-wrap__icon" aria-hidden="true" />
            <input
              className="ns-input ns-input--has-icon"
              id={searchId}
              type="search"
              autoComplete="off"
              placeholder={searchPlaceholder}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </span>
        </div>
      )}
      <div className="ns-player__list" ref={listRef}>
        {shown === 0 && q ? (
          <div className="ns-empty">
            <p className="ns-empty__title">No lesson matches “{query}”</p>
            <p className="ns-empty__text">Try a word from the lesson's title.</p>
          </div>
        ) : rows}
      </div>
      {/* The foot: what you do WITH the lesson rather than where you go next —
          share it, or ask an AI about it. Secondary by definition, because the
          primary action on this screen is "next lesson" and it is docked at
          the foot of the content. */}
      {foot && <div className="ns-player__side-foot">{foot}</div>}
    </nav>
  );
}

/** The phone counterpart of the rail: a docked bar saying where you are and
 *  how far in, plus the full lesson list in a popover.
 *
 *  A POPOVER rather than a scripted dialog — the button is declarative, so the
 *  top layer, light dismiss and Esc are the platform's and this component
 *  ships no open/close state at all. Below 40rem the panel becomes a bottom
 *  sheet with a grab handle (overlay.css), because a centred box on a phone is
 *  a centred box with a keyboard-sized margin round it.
 *
 *  Hidden above lg by the stylesheet: up there the rail is already on screen,
 *  and a second "where you are, open the list" bar is a duplicate of the pane
 *  sitting next to it. */
export function LessonPanelBar({
  courseTitle,
  kicker,
  title,
  percent,
  done,
  total,
  lessons = [],
  currentHref,
  hrefFor = (l) => l.href,
  cta,
  search = false,
  searchPlaceholder = "Find a lesson",
  id = "lesson-drawer",
}) {
  const searchId = React.useId().replace(/:/g, "");
  const [query, setQuery] = React.useState("");
  /* Below lg this panel is the ONLY lesson list — the rail is display:none —
     so it carries the filter too. A forty-lesson course does not get easier to
     scan because the viewport got smaller. */
  const q = query.trim().toLowerCase();
  let n = 0;
  let shown = 0;
  return (
    <>
      <div className="ns-panelbar ns-panelbar--fixed">
        {percent != null && (
          <span className="ns-panelbar__line" style={{ "--fx-progress": `${percent}%` }} />
        )}
        <span className="ns-panelbar__now">
          <span className="ns-panelbar__kicker">{kicker}</span>
          <span className="ns-panelbar__title">{title}</span>
        </span>
        <button
          type="button"
          className="ns-btn ns-btn--outline ns-btn--sm"
          popoverTarget={id}
          aria-label={done != null && total != null ? `Lessons — ${done} of ${total} complete` : "Lessons"}
        >
          <i className="ph ph-list" aria-hidden="true" /> Lessons
        </button>
      </div>

      <div className="ns-lessonmodal" id={id} popover="">
        <div className="ns-lessonmodal__head">
          <span className="ns-lessonmodal__title">{courseTitle}</span>
          {done != null && total != null && <span className="ns-lessonmodal__count">{done} / {total} done</span>}
          <button
            type="button"
            className="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm"
            popoverTarget={id}
            popoverTargetAction="hide"
            aria-label="Close"
          >
            <i className="ph ph-x" aria-hidden="true" />
          </button>
        </div>
        {search && (
          <div className="ns-player__side-search">
            <label className="ns-visually-hidden" htmlFor={searchId}>Search lessons</label>
            <span className="ns-input-wrap">
              <i className="ph ph-magnifying-glass ns-input-wrap__icon" aria-hidden="true" />
              <input
                className="ns-input ns-input--has-icon"
                id={searchId}
                type="search"
                autoComplete="off"
                placeholder={searchPlaceholder}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </span>
          </div>
        )}
        <div className="ns-lessonmodal__list">
          {lessons.map((lesson) => {
            n += 1;
            /* The index is the lesson's position in the COURSE, not in the
               filtered view — filtering to one lesson must not renumber it. */
            if (q && !String(lesson.title).toLowerCase().includes(q)) return null;
            shown += 1;
            return <LessonRow key={hrefFor(lesson)} lesson={lesson} index={n} currentHref={currentHref} hrefFor={hrefFor} first={shown === 1} />;
          })}
          {q && shown === 0 && (
            <div className="ns-empty">
              <p className="ns-empty__title">No lesson matches “{query}”</p>
              <p className="ns-empty__text">Try a word from the lesson's title.</p>
            </div>
          )}
        </div>
        {cta && (
          <div className="ns-lessonmodal__foot">
            {done != null && total != null && (
              <progress className="ns-progress" value={done} max={total} aria-label={`${done} of ${total} lessons complete`} />
            )}
            <a className="ns-btn ns-btn--primary ns-btn--sm" href={cta.href}>
              <i className="ph ph-play" aria-hidden="true" /> {cta.label}
            </a>
          </div>
        )}
      </div>
    </>
  );
}
