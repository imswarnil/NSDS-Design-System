import * as React from "react";

/** The six geometries. `stack` is the default and should be most of a deck.
 *
 *  lead    the opener, the module divider, the closer — head centred on the
 *          block axis, no body, title at poster size.
 *  center  centred on both axes. The one-sentence slide, the question slide.
 *          Sparingly: centred text is hard to read in quantity, which is
 *          exactly why it is right for one line.
 *  stack   head at the top, body under it, full width. Bullets, a card grid,
 *          a table, a checklist, a timeline.
 *  split   body in two columns — the claim, and the thing that proves it.
 *  aside   a wide content column and a narrow standing rail: the running
 *          example, or "you are here" in a long workshop.
 *  full    the body goes edge to edge and the padding falls away. A
 *          screenshot, a diagram, a code file that needs the whole slide.
 */
export type SlideLayout = "lead" | "center" | "stack" | "split" | "aside" | "full";

/** Surface, independent of geometry.
 *
 *  (none)  the default. Flips with [data-theme].
 *  sunken  the recessed page ground. Also flips.
 *  dark    the brand's navy console — IDENTICAL in both themes, exactly like
 *          .ns-band--dark. It marks a gear change in the talk; a deck where
 *          every third slide is dark has no gear changes left.
 *  brand   the solid brand fill. One per deck, at most.
 */
export type SlideTone = "sunken" | "dark" | "brand";

export interface DeckProps {
  /** Shown in the presenter bar. The talk's name, not the current slide's. */
  title?: React.ReactNode;
  /** Slides. A deck is COMPOSED, not configured — there is no slides array
   *  prop, because the moment a deck is data you need an escape hatch for the
   *  one slide that is different, and then a second one. */
  children?: React.ReactNode;
  /** `present` (default) shows one slide at a time locked to the viewport;
   *  `scroll` stacks every slide down the page as 16:9 cards — the handout,
   *  and what an embed inside a lesson wants. Pass it to lock the mode;
   *  omit it and the presenter bar can switch. */
  mode?: "present" | "scroll";
  /** Controlled position. Pass with onIndexChange to drive the deck from a
   *  router; omit both and it keeps its own place. */
  index?: number;
  onIndexChange?: (index: number) => void;
  defaultIndex?: number;
  /** Set false when the deck is embedded in a lesson and the page already
   *  has its own chrome. Keyboard still works. */
  bar?: boolean;
  className?: string;
}

/** The presentation. Owns which slide is current, which fragments have been
 *  revealed, and the overview / notes / shortcut panels.
 *
 *  Keyboard: → ↓ Space PgDn advance (revealing fragments first), ← ↑ PgUp go
 *  back, Home/End jump, G overview, N notes, F fullscreen, B blackout,
 *  ? shortcuts, Esc closes. Skipped while the user is typing. */
export declare function Deck(props: DeckProps): React.JSX.Element;

export interface SlideProps {
  layout?: SlideLayout;
  tone?: SlideTone;
  /** The dissolving hairline grid — the one decorative background the system
   *  allows, shared with .ns-band--grid. */
  grid?: boolean;
  kicker?: React.ReactNode;
  title?: React.ReactNode;
  lede?: React.ReactNode;
  /** The short brand underline beneath the head. An underline, not a divider:
   *  it says "this heading owns what follows". */
  rule?: boolean;
  /** The corner label: "live demo", "hands on", "10 min". One per slide. */
  badge?: React.ReactNode;
  /** Phosphor class for the badge, e.g. "ph-play". */
  badgeIcon?: string;
  /** The running foot's left half — which module, which section. */
  where?: React.ReactNode;
  /** Overrides the overview/notes label. A cover slide's heading is the
   *  deck's name, and that tells a presenter scanning the overview nothing. */
  label?: string;
  /** What to SAY. Never rendered on the slide — it appears in the notes
   *  drawer and can print under the slide in a handout. */
  note?: React.ReactNode;
  /** How many reveals this slide has, i.e. the highest `at` used by its
   *  Fragments. A slide that does not declare this is one the deck steps
   *  straight past. */
  fragments?: number;
  /** The standing rail, for layout="aside". */
  aside?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}

/** One slide: frame, head, body, running foot. `layout` and `tone` are
 *  separate props because "a centred slide" and "a navy slide" are
 *  independent decisions. */
export declare function Slide(props: SlideProps): React.JSX.Element;

/** Progressive reveal. Wraps anything; hidden means DIMMED, not removed — a
 *  reveal that reflows the slide makes everyone find their place again.
 *  Two elements sharing an `at` arrive together, which is what three cards
 *  that are one idea should do. Outside present mode every fragment is
 *  simply there: a handout with half its content invisible is not a handout. */
export declare function Fragment(props: {
  /** Position in the slide's reveal sequence, one-based. */
  at?: number;
  as?: React.ElementType;
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element;

export interface SlidePoint {
  title: React.ReactNode;
  /** The second line: what the first one MEANS. A bullet the presenter has to
   *  explain out loud is a bullet the handout loses. */
  note?: React.ReactNode;
  /** Overrides the auto mono index. */
  index?: React.ReactNode;
  /** A Phosphor class instead of a number, e.g. "ph-lightning". An icon per
   *  outcome beats a column of identical numbers when the points are not a
   *  sequence. */
  icon?: string;
  /** Reveal this point at this position instead of showing it immediately. */
  at?: number;
  current?: boolean;
  done?: boolean;
}

/** The teaching list. Four to six items — a slide with nine is a slide the
 *  room reads instead of listening, and the fix is two slides, not a smaller
 *  type size. */
export declare function SlidePoints(props: {
  items?: (SlidePoint | string)[];
  tight?: boolean;
  /** Two columns. For the agenda, which is the one list that legitimately
   *  runs long — it is a contents page, not an argument. */
  split?: boolean;
  /** Dims what is done and what is ahead. For the agenda you return to
   *  between modules, and nowhere else. */
  current?: boolean;
  ordered?: boolean;
  className?: string;
}): React.JSX.Element;

export interface FlowNode {
  /** The mono step label, e.g. "02 · before". */
  label?: React.ReactNode;
  title: React.ReactNode;
  note?: React.ReactNode;
  /** The box being talked about. Its border brightens to brand — elevation is
   *  a border, never a lift. */
  current?: boolean;
}

/** Boxes and arrows as TEXT, not a PNG: a screen reader reads it, a
 *  translator translates it, and it restyles with the theme instead of being
 *  a picture of last year's colours. Three to five nodes. */
export declare function SlideFlow(props: {
  nodes?: FlowNode[];
  /** Vertical, for a sequence that does not fit across the slide. */
  stack?: boolean;
  className?: string;
}): React.JSX.Element;

export interface SlideOption {
  text: React.ReactNode;
  /** The handle the room answers with. Defaults to A, B, C… */
  key?: string;
  correct?: boolean;
}

/** A question to the room. Options are labelled because "the third one" is
 *  not a handle. The answer is a <details>, so opening it in the room also
 *  puts it in the handout without a second slide. */
export declare function SlideOptions(props: {
  options?: (SlideOption | string)[];
  answer?: React.ReactNode;
  answerLabel?: React.ReactNode;
  /** Marks the correct option once you have taken the vote. */
  reveal?: boolean;
  className?: string;
}): React.JSX.Element;

/** A countdown the ROOM can see, so an exercise ends because time ran out
 *  rather than because the presenter got bored. Press to start, press again
 *  to reset. It runs PAST zero: four minutes over is a fact worth showing,
 *  and a timer frozen at 00:00 hides it. */
export declare function SlideTimer(props: {
  seconds?: number;
  label?: string;
  className?: string;
}): React.JSX.Element;

/** A screenshot, an embedded demo, a chart. contain, never cover — a cropped
 *  screenshot is one with the part you were pointing at cut off. */
export declare function SlideFigure(props: {
  src?: string;
  /** Describe what the slide is POINTING AT. The handout is read by people
   *  who were not in the room. */
  alt?: string;
  /** The full-slide picture: no frame, and the image does fill. */
  bleed?: boolean;
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element;

/** A column inside a layout="split" body. */
export declare function SlideColumn(props: {
  /** Stretch to the foot — for the column holding a code block or a figure. */
  fill?: boolean;
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element;

/** A grid of anything: cards, statblocks, screenshots. Below the tablet
 *  breakpoint every one of them becomes a single column. */
export declare function SlideGrid(props: {
  cols?: 2 | 3 | 4;
  fill?: boolean;
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element;

/** One fact at poster size — the slide that survives a photograph from the
 *  back row, and the only one allowed to reach --size-mega. Give it a source;
 *  an unsourced number on a slide is an opinion in a large font. */
export declare function SlideFigureValue(props: {
  children?: React.ReactNode;
  className?: string;
}): React.JSX.Element;
