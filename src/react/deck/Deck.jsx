import React from "react";

/* Namaste UI — teaching deck for the Next.js LMS.
   =========================================================================
   The React half of templates/deck.html. Layout and all styling are in
   components/css/deck.css, shared with the Ghost/static template; this layer
   adds the wiring markup cannot express — which slide is current, which
   fragments have been revealed, the overview, the notes and the timer.

   When one changes, so does the other. They are one component with two
   renderers, and the moment they disagree a deck embedded in a lesson and a
   deck served as a page stop being the same thing.

   WHY THIS OWNS ITS RUNTIME rather than importing assets/js/deck.js: the
   vanilla script drives the DOM directly, and a React tree that also owns
   that DOM will fight it on every re-render. The two implementations share a
   contract (the class names, data-fragment, aria-current) and nothing else,
   which is exactly the arrangement the player already uses.

   A DECK IS COMPOSED, NOT CONFIGURED. There is no `slides={[...]}` array
   prop: a slide is JSX, because the moment a deck is data you need an
   escape hatch for the one slide that is different, and then a second one,
   and eventually a template language nobody asked for. Slides are children:

     <Deck title="Apex fundamentals · module 01">
       <Slide layout="lead" tone="dark" grid title="…" kicker="…" note="…" />
       <Slide title="…"><SlidePoints items={…} /></Slide>
     </Deck>

   Everything INSIDE a slide is a component that already exists — the code
   block, the compare, the statblock, the checklist, the card. This file adds
   only what is genuinely projector-specific. */

const DeckContext = React.createContext(null);

/* ------------------------------------------------------------------ Deck --
   The presentation. Uncontrolled by default (it keeps its own place);
   pass `index` + `onIndexChange` to drive it from a router or a lesson. */
export function Deck({
  title,
  children,
  mode: modeProp,
  index: indexProp,
  onIndexChange,
  defaultIndex = 0,
  bar = true,
  className = "",
  ...rest
}) {
  const slides = React.Children.toArray(children).filter(Boolean);
  const total = slides.length;

  const [modeState, setMode] = React.useState(modeProp || "present");
  const mode = modeProp || modeState;
  const [indexState, setIndexState] = React.useState(defaultIndex);
  const index = indexProp === undefined ? indexState : indexProp;

  /* Fragment counts are reported UP by each slide as it mounts. The deck
     cannot count them itself — a slide's fragments live inside arbitrary
     children, and walking the element tree to find them would break the
     moment someone wraps one in their own component. */
  const [counts, setCounts] = React.useState({});
  const [revealed, setRevealed] = React.useState(0);
  const register = React.useCallback((i, n) => {
    setCounts((prev) => (prev[i] === n ? prev : { ...prev, [i]: n }));
  }, []);

  const [overview, setOverview] = React.useState(false);
  const [notes, setNotes] = React.useState(false);
  const [help, setHelp] = React.useState(false);
  const [black, setBlack] = React.useState(false);
  const rootRef = React.useRef(null);

  const go = React.useCallback((to, atStart) => {
    const next = Math.max(0, Math.min(total - 1, to));
    /* Stepping BACK lands on a slide with everything already revealed.
       Re-walking six fragments to reach the previous slide is how a presenter
       loses the room while pressing the left arrow nine times. */
    setRevealed(atStart ? 0 : counts[next] || 0);
    if (indexProp === undefined) setIndexState(next);
    onIndexChange && onIndexChange(next);
  }, [total, counts, indexProp, onIndexChange]);

  const next = React.useCallback(() => {
    const n = counts[index] || 0;
    if (revealed < n) { setRevealed(revealed + 1); return; }
    if (index < total - 1) go(index + 1, true);
  }, [counts, index, revealed, total, go]);

  const prev = React.useCallback(() => {
    if (revealed > 0) { setRevealed(revealed - 1); return; }
    if (index > 0) go(index - 1, false);
  }, [revealed, index, go]);

  /* Keyboard. The same set a presenter's clicker already sends, plus the
     panels. Skipped while the user is typing — a deck embedded in a lesson
     sits on a page with a comment box on it. */
  React.useEffect(() => {
    const onKey = (e) => {
      const t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.altKey || e.metaKey || e.ctrlKey) return;
      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case "PageDown": case " ":
          e.preventDefault(); next(); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp":
          e.preventDefault(); prev(); break;
        case "Home": e.preventDefault(); go(0, true); break;
        case "End": e.preventDefault(); go(total - 1, false); break;
        case "g": case "G": setOverview((v) => !v); break;
        case "n": case "N": case "s": case "S": setNotes((v) => !v); break;
        case "?": setHelp((v) => !v); break;
        case "f": case "F":
          if (document.fullscreenElement) document.exitFullscreen();
          else rootRef.current && rootRef.current.requestFullscreen && rootRef.current.requestFullscreen();
          break;
        /* Blackout: the oldest presenter control there is — the room looks at
           you instead of the wall. */
        case "b": case "B": case ".": setBlack((v) => !v); break;
        case "Escape": setOverview(false); setNotes(false); setHelp(false); setBlack(false); break;
        default: break;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [next, prev, go, total]);

  const ctx = { index, revealed, register, mode };
  const numbered = slides.map((slide, i) =>
    React.cloneElement(slide, { key: slide.key || i, _deckIndex: i, _deckTotal: total })
  );

  const current = slides[index];
  const noteOf = (s) => (s && s.props && s.props.note) || null;
  const titleOf = (s, i) => (s && s.props && (s.props.label || s.props.title)) || `Slide ${i + 1}`;

  return (
    <DeckContext.Provider value={ctx}>
      <div
        ref={rootRef}
        className={`ns-deck ${className}`.trim()}
        data-mode={mode}
        data-black={black ? "true" : undefined}
        {...rest}
      >
        <div className="ns-deck__stage">{numbered}</div>

        <div className="ns-deck__rail" aria-hidden="true">
          <span style={{ "--p": `${Math.round(((index + 1) / Math.max(total, 1)) * 100)}%` }} />
        </div>

        {bar && (
          <div className="ns-deck__bar">
            <span className="ns-deck__deckname">
              <i className="ph ph-presentation-chart" aria-hidden="true" /> {title}
            </span>
            <span className="ns-deck__count">
              <b>{pad(index + 1)}</b> / {pad(total)}
            </span>
            <div className="ns-deck__tools">
              <button type="button" className="ns-navicon" onClick={prev} disabled={index === 0 && revealed === 0} aria-label="Previous slide">
                <i className="ph ph-arrow-left" aria-hidden="true" />
              </button>
              <button type="button" className="ns-navicon" onClick={next} disabled={index === total - 1 && revealed >= (counts[index] || 0)} aria-label="Next slide">
                <i className="ph ph-arrow-right" aria-hidden="true" />
              </button>
              <button type="button" className="ns-navicon" onClick={() => setOverview((v) => !v)} aria-expanded={overview} aria-label="All slides">
                <i className="ph ph-squares-four" aria-hidden="true" />
              </button>
              <button type="button" className="ns-navicon" onClick={() => setNotes((v) => !v)} aria-expanded={notes} aria-label="Speaker notes">
                <i className="ph ph-note" aria-hidden="true" />
              </button>
              <button type="button" className="ns-navicon" onClick={() => setMode(mode === "present" ? "scroll" : "present")} aria-pressed={mode === "scroll"} aria-label="Switch between presenting and the handout">
                <i className="ph ph-rows" aria-hidden="true" />
              </button>
              <button type="button" className="ns-navicon" onClick={() => setHelp((v) => !v)} aria-expanded={help} aria-label="Keyboard shortcuts">
                <i className="ph ph-question" aria-hidden="true" />
              </button>
            </div>
          </div>
        )}

        {/* The overview. Real slides at thumbnail size — a slide sizes itself
            from its container, so a copy in a 15rem box simply IS the slide,
            and cannot go stale the way a rendered image would. inert, because
            a miniature slide is not something anyone clicks inside. */}
        <div className="ns-deck__overview" hidden={!overview}>
          <div className="ns-deck__overview-head">
            <span>All slides</span>
            <span className="ns-deck__tools">
              <button type="button" className="ns-btn ns-btn--quiet ns-btn--sm" onClick={() => setOverview(false)}>
                <i className="ph ph-x" aria-hidden="true" /> Close
              </button>
            </span>
          </div>
          <div className="ns-deck__thumbs">
            {slides.map((slide, i) => (
              <button
                key={i}
                type="button"
                className="ns-deck__thumb"
                aria-current={i === index ? "true" : undefined}
                onClick={() => { go(i, true); setOverview(false); }}
              >
                <span className="ns-deck__thumb-frame" aria-hidden="true" inert="">
                  {React.cloneElement(slide, { _deckIndex: i, _deckTotal: total, _thumb: true })}
                </span>
                <span className="ns-deck__thumb-meta">
                  {pad(i + 1)} <span className="ns-deck__thumb-title">{titleOf(slide, i)}</span>
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Notes: what to say, and the NAME of the next slide — the single
            most useful line on any presenter display. */}
        <aside className="ns-deck__notes" hidden={!notes} aria-label="Speaker notes">
          <div className="ns-deck__notes-head">
            <span><i className="ph ph-note" aria-hidden="true" /> Notes</span>
            <span className="ns-deck__tools">
              <button type="button" className="ns-btn ns-btn--quiet ns-btn--sm" onClick={() => setNotes(false)}>
                <i className="ph ph-x" aria-hidden="true" /> Close
              </button>
            </span>
          </div>
          <div className="ns-deck__notes-body">
            {noteOf(current) || <span className="ns-slide__caption">No note for this slide</span>}
          </div>
          <div className="ns-deck__notes-next">
            <b>Next</b>
            {slides[index + 1] ? titleOf(slides[index + 1], index + 1) : "End of the deck"}
          </div>
        </aside>

        <div className="ns-deck__help" hidden={!help}>
          <div className="ns-deck__help-card">
            {SHORTCUTS.map(([what, keys]) => (
              <div className="ns-deck__help-row" key={what}>
                <span>{what}</span>
                <span className="ns-kbd-seq">
                  {keys.map((k) => <kbd className="ns-kbd" key={k}>{k}</kbd>)}
                </span>
              </div>
            ))}
            <p>
              <button type="button" className="ns-btn ns-btn--outline ns-btn--sm" onClick={() => setHelp(false)}>Close</button>
            </p>
          </div>
        </div>
      </div>
    </DeckContext.Provider>
  );
}

const pad = (n) => String(n).padStart(2, "0");

const SHORTCUTS = [
  ["Next, or reveal the next point", ["→", "Space"]],
  ["Back", ["←"]],
  ["First / last slide", ["Home", "End"]],
  ["All slides", ["G"]],
  ["Speaker notes", ["N"]],
  ["Full screen", ["F"]],
  ["Blackout — look at me, not the wall", ["B"]],
  ["Close anything", ["Esc"]],
];

/* ----------------------------------------------------------------- Slide --
   One slide: the frame, the head, the body, the running foot.

   `layout` is geometry and `tone` is surface, and they are separate props on
   purpose — "a centred slide" and "a navy slide" are independent decisions,
   and a single `variant="dark-centred"` prop would need one name per
   combination. */
export function Slide({
  layout = "stack",
  tone,
  grid = false,
  kicker,
  title,
  lede,
  rule = false,
  badge,
  badgeIcon,
  where,
  /** Overrides the overview/notes label. A cover slide's heading is the
   *  deck's name, and "Namaste Salesforce" tells a presenter scanning the
   *  overview nothing about what is on slide 1. */
  label,
  /** What to SAY. Never rendered on the slide; it appears in the notes
   *  drawer and can be printed under the slide in a handout. */
  note,
  fragments = 0,
  aside,
  children,
  className = "",
  _deckIndex = 0,
  _deckTotal = 0,
  _thumb = false,
  ...rest
}) {
  const ctx = React.useContext(DeckContext);
  const isCurrent = ctx && ctx.index === _deckIndex;

  /* Report the fragment count up. A slide that does not say how many it has
     is a slide the deck steps straight past. */
  const register = ctx && ctx.register;
  React.useEffect(() => {
    if (register && !_thumb) register(_deckIndex, fragments);
  }, [register, _deckIndex, fragments, _thumb]);

  const classes = [
    "ns-slide",
    layout && layout !== "stack" ? `ns-slide--${layout}` : "",
    tone ? `ns-slide--${tone}` : "",
    grid ? "ns-slide--grid" : "",
    className,
  ].filter(Boolean).join(" ");

  const head = (kicker || title || lede || rule) && (
    <div className="ns-slide__head">
      {kicker && <span className="ns-kicker">{kicker}</span>}
      {title && <h2 className="ns-slide__title">{title}</h2>}
      {rule && <span className="ns-slide__rule" />}
      {lede && <p className="ns-slide__lede">{lede}</p>}
    </div>
  );

  return (
    <section
      className={classes}
      aria-current={!_thumb && isCurrent ? "true" : undefined}
      aria-hidden={_thumb ? "true" : undefined}
      {...rest}
    >
      {badge && (
        <span className="ns-slide__badge">
          {badgeIcon && <i className={`ph ${badgeIcon}`} aria-hidden="true" />} {badge}
        </span>
      )}
      <div className="ns-slide__inner">
        {head}
        {(children || aside) && (
          <div className="ns-slide__body">
            {children}
            {aside && <aside className="ns-slide__aside">{aside}</aside>}
          </div>
        )}
        <div className="ns-slide__foot">
          {where && <span className="ns-slide__where">{where}</span>}
          <span className="ns-slide__num">{pad(_deckIndex + 1)} / {pad(_deckTotal)}</span>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- Fragment --
   Progressive reveal. Wraps anything; the deck decides whether it has been
   revealed yet. Hidden means DIMMED, not removed — a reveal that reflows the
   slide makes everyone find their place again.

   `at` is the reveal's position in the slide's sequence, one-based, so two
   elements sharing an `at` arrive together (three cards that are one idea
   should not land one at a time). */
export function Fragment({ at = 1, as: As = "div", children, ...rest }) {
  const ctx = React.useContext(DeckContext);
  const shown = !ctx || ctx.mode !== "present" || ctx.revealed >= at;
  return (
    <As data-fragment="" data-shown={shown ? "" : undefined} {...rest}>
      {children}
    </As>
  );
}

/* --------------------------------------------------------- SlidePoints --
   The teaching list: a mono index, a line, and an optional second line that
   says what the first one MEANS — because a bullet the presenter has to
   explain out loud is a bullet the handout loses.

   Four to six. A slide with nine points is a slide the room reads instead of
   listening, and the fix is two slides, not a smaller type size. */
export function SlidePoints({
  items = [],
  tight = false,
  split = false,
  /** Dims what is done and what is still ahead, so the item being started is
   *  the only thing at full contrast. For the agenda you return to between
   *  modules — nowhere else: a list where five of six items are dimmed is a
   *  list nobody reads. */
  current = false,
  ordered = false,
  className = "",
  ...rest
}) {
  const List = ordered ? "ol" : "ul";
  const classes = [
    "ns-slide__points",
    tight ? "ns-slide__points--tight" : "",
    split ? "ns-slide__points--split" : "",
    current ? "ns-slide__points--current" : "",
    className,
  ].filter(Boolean).join(" ");

  return (
    <List className={classes} {...rest}>
      {items.map((item, i) => {
        const p = typeof item === "string" ? { title: item } : item;
        /* The reveal is on the <li> ITSELF, not on its contents: the row is
           laid out from the first frame and only its opacity changes, so
           nothing below it moves when it arrives. */
        const Row = p.at ? Fragment : "li";
        const rowProps = p.at ? { as: "li", at: p.at } : {};
        return (
          <Row
            key={i}
            className="ns-slide__point"
            aria-current={p.current ? "true" : undefined}
            data-state={p.done ? "done" : undefined}
            {...rowProps}
          >
            <span className="ns-slide__point-index">
              {p.icon ? <i className={`ph ${p.icon}`} aria-hidden="true" /> : (p.index || pad(i + 1))}
            </span>
            <span>
              <b className="ns-slide__point-title">{p.title}</b>
              {p.note && <span className="ns-slide__point-note">{p.note}</span>}
            </span>
          </Row>
        );
      })}
    </List>
  );
}

/* ----------------------------------------------------------- SlideFlow --
   Three to five boxes and the arrows between them: the architecture slide,
   the "request goes here then here" slide, the POC diagram.

   Boxes, not a picture — so a screen reader reads it, a translator translates
   it, and it restyles with the theme instead of being a PNG of last year's
   colours. The arrows are aria-hidden: "right arrow right arrow" read aloud
   is noise. */
export function SlideFlow({ nodes = [], stack = false, className = "", ...rest }) {
  return (
    <div className={`ns-slide__flow${stack ? " ns-slide__flow--stack" : ""} ${className}`.trim()} {...rest}>
      {nodes.map((n, i) => (
        <React.Fragment key={i}>
          {i > 0 && <i className="ph ph-arrow-right ns-slide__arrow" aria-hidden="true" />}
          <div className="ns-slide__node" aria-current={n.current ? "true" : undefined}>
            {n.label && <span className="ns-slide__node-label">{n.label}</span>}
            <span className="ns-slide__node-title">{n.title}</span>
            {n.note && <span className="ns-slide__node-note">{n.note}</span>}
          </div>
        </React.Fragment>
      ))}
    </div>
  );
}

/* -------------------------------------------------------- SlideOptions --
   A question to the room. The options are LABELLED (A/B/C) because a room
   answering out loud needs a handle, and "the third one" is not one. The
   answer is a <details>: you open it, and the handout has it without a
   second slide. */
export function SlideOptions({ options = [], answer, answerLabel = "Show the answer", reveal = false, className = "", ...rest }) {
  return (
    <div className={className} {...rest}>
      <div className="ns-slide__options">
        {options.map((o, i) => {
          const opt = typeof o === "string" ? { text: o } : o;
          return (
            <div
              className="ns-slide__option"
              key={i}
              data-state={reveal && opt.correct ? "correct" : undefined}
            >
              <span className="ns-slide__option-key">{opt.key || String.fromCharCode(65 + i)}</span>
              <span>{opt.text}</span>
            </div>
          );
        })}
      </div>
      {answer && (
        <details className="ns-slide__answer">
          <summary><i className="ph ph-caret-right" aria-hidden="true" /> {answerLabel}</summary>
          {answer}
        </details>
      )}
    </div>
  );
}

/* ---------------------------------------------------------- SlideTimer --
   "Try this for ten minutes." A countdown the ROOM can see, so the exercise
   ends because time ran out rather than because the presenter got bored.

   Started by the presenter, not by arriving on the slide: you introduce the
   exercise, answer a question, and THEN say go. It runs past zero rather than
   stopping at it — an exercise four minutes over is a fact worth showing, and
   a timer frozen at 00:00 hides it. */
export function SlideTimer({ seconds = 600, label = "Exercise timer", className = "", ...rest }) {
  const [startedAt, setStartedAt] = React.useState(null);
  const [now, setNow] = React.useState(null);

  React.useEffect(() => {
    if (startedAt === null) return undefined;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [startedAt]);

  const left = startedAt === null ? seconds : seconds - Math.floor(((now || startedAt) - startedAt) / 1000);
  const abs = Math.abs(left);
  const state = startedAt === null ? "idle" : left < 0 ? "over" : "running";

  return (
    <button
      type="button"
      className={`ns-slide__timer ${className}`.trim()}
      data-state={state}
      onClick={() => { setStartedAt(startedAt === null ? Date.now() : null); setNow(Date.now()); }}
      aria-label={`${label}. Press to ${startedAt === null ? "start" : "reset"}.`}
      {...rest}
    >
      <span>{left < 0 ? "-" : ""}{pad(Math.floor(abs / 60))}:{pad(abs % 60)}</span>
      <span className="ns-slide__timer-unit">min</span>
    </button>
  );
}

/* --------------------------------------------------------- SlideFigure --
   A screenshot, an embedded demo, a chart. contain, never cover — a cropped
   screenshot is a screenshot with the part you were pointing at cut off.
   --bleed is the other case: the full-slide picture, which does fill. */
export function SlideFigure({ src, alt = "", bleed = false, children, className = "", ...rest }) {
  return (
    <figure className={`ns-slide__figure${bleed ? " ns-slide__figure--bleed" : ""} ${className}`.trim()} {...rest}>
      {children || <img src={src} alt={alt} />}
    </figure>
  );
}

/** A column inside a --split body. --fill makes it stretch, for the column
 *  holding a code block or a figure that should reach the foot. */
export function SlideColumn({ fill = false, children, className = "", ...rest }) {
  return (
    <div className={`ns-slide__col${fill ? " ns-slide__col--fill" : ""} ${className}`.trim()} {...rest}>
      {children}
    </div>
  );
}

/** A grid of anything — cards, statblocks, screenshots. `cols` is the only
 *  knob; below the tablet breakpoint every one of them becomes one column,
 *  because a four-up grid rendered 90px wide is four unreadable columns. */
export function SlideGrid({ cols = 3, fill = false, children, className = "", ...rest }) {
  return (
    <div className={`ns-slide__grid${fill ? " ns-slide__grid--fill" : ""} ${className}`.trim()} data-cols={String(cols)} {...rest}>
      {children}
    </div>
  );
}

/** One fact at poster size. The slide that survives a photograph from the
 *  back row, and the only one allowed to reach --size-mega. */
export function SlideFigureValue({ children, className = "", ...rest }) {
  return <span className={`ns-slide__figure-value ${className}`.trim()} {...rest}>{children}</span>;
}
