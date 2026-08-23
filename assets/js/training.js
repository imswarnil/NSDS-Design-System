/* NS Design System — training rail: filter and drawer.
   =========================================================================
   Two jobs, both progressive enhancement, both specific to a curriculum with
   a hundred and fifty sections in it. The rail's OTHER behaviour — opening the
   section that contains the current post and scrolling it into view — is in
   assets/js/rail.js and is shared with the docs sidebar; it is not repeated
   here.

     1. FILTER. Type in the rail's search box and the tree reduces to the
        sections and lessons that match. This is the whole reason the box exists:
        at fifteen sections a tree is navigable, and at a hundred and fifty it
        is a filing cabinet you have to already know your way around.

        Matching a LESSON reveals its section. Matching a SECTION keeps all of its
        lessons, because "sharing" should show you everything in the Sharing
        section rather than the one lesson whose title happens to repeat the word.

     2. DRAWER, and COLLAPSE. One attribute, data-rail, carries three
        states — "closed" (a normal column), "collapsed" (a hairline spine
        with the reopen control on it, desktop only) and "open" (the phone
        drawer). Two attributes would be two things to keep in step.

        Below the lg breakpoint the fixed rail becomes an off-canvas
        drawer — the stylesheet does the sliding, this sets the state, traps
        nothing, and closes on Escape, on the scrim, and on choosing a post.

   Both degrade correctly. With this file removed the search box is a real
   input in a real <form> pointed at site search, and the rail is a column
   that is simply always open.

   Markup contract
     <div class="ns-training ns-training--fixed" data-ns-training data-rail="closed">
       <button data-ns-training-open>            the panel bar's handle
       <button data-ns-training-collapse>        column -> spine (desktop)
       <button data-ns-training-expand>          spine -> column
       <div class="ns-training__scrim" data-ns-training-close>
       <nav class="ns-trainingnav" data-ns-trainingnav>
         <input data-ns-trainingnav-filter>      the filter box
         <p data-ns-trainingnav-result>          "6 sections · 21 lessons" — written here
         <details class="ns-trainingnav__section"> … </details>

   Include with: <script src="assets/js/training.js" defer></script> */
(function () {
  "use strict";

  var doc = document;

  /* ---- the filter -------------------------------------------------------- */
  function wireFilter(rail) {
    var input = rail.querySelector("[data-ns-trainingnav-filter]");
    if (!input) return;
    var result = rail.querySelector("[data-ns-trainingnav-result]");

    /* QUERIED ON EVERY PASS, NOT CACHED ONCE.
       This used to read the sections into an array at wire time. That is
       correct for a server-rendered rail and silently wrong for a rail whose
       sections arrive from data — which is the Next.js LMS, and which is how
       a 100-section curriculum is actually going to be built. Sections added
       after init were unknown to the filter, so they were never hidden, while
       the result line counted only the ones present at startup: the rail
       claimed "1 section" above ninety-two visible ones.

       Re-querying costs one querySelectorAll per keystroke against a debounce
       that already exists. At 100 sections that is not measurable, and it
       removes a whole class of "works in the styleguide, breaks in the app". */
    function all() {
      return [].slice.call(rail.querySelectorAll(".ns-trainingnav__section"));
    }
    if (!all().length) return;

    /* The open/closed state the reader chose, remembered before the first
       search so clearing the box puts the rail back exactly as it was. A
       filter that leaves forty sections expanded behind it has not finished
       the job it started.

       Stored ON each section rather than in a positional array, because the
       set is no longer fixed: an index into a snapshot points at the wrong
       section the moment one is inserted. */
    var restoring = false;

    function text(el) {
      return (el.textContent || "").toLowerCase();
    }

    function apply(q) {
      q = q.trim().toLowerCase();
      var sections = all();

      if (!q) {
        sections.forEach(function (m) {
          m.hidden = false;
          [].slice.call(m.querySelectorAll("li")).forEach(function (li) { li.hidden = false; });
          if (restoring && m.nsWasOpen !== undefined) { m.open = m.nsWasOpen; }
          delete m.nsWasOpen;
        });
        restoring = false;
        if (result) result.textContent = "";
        return;
      }

      if (!restoring) {
        restoring = true;
        sections.forEach(function (m) { m.nsWasOpen = m.open; });
      }

      var shownSections = 0;
      var shownLessons = 0;

      sections.forEach(function (m) {
        var summary = m.querySelector("summary");
        var sectionHit = summary ? text(summary).indexOf(q) !== -1 : false;
        var lessons = [].slice.call(m.querySelectorAll(".ns-trainingnav__list > li"));
        var hits = 0;

        lessons.forEach(function (li) {
          /* A section-level match keeps everything under it — "sharing" should
             open the Sharing section, not reduce it to the one post whose
             title repeats the word. */
          var hit = sectionHit || text(li).indexOf(q) !== -1;
          li.hidden = !hit;
          if (hit) hits++;
        });

        var keep = sectionHit || hits > 0;
        m.hidden = !keep;
        /* Everything that survives is opened: the point of searching is to
           see the results, and a match hidden inside a collapsed section is a
           match the reader has to go looking for twice. */
        if (keep) { m.open = true; shownSections++; shownLessons += hits; }
      });

      /* Say what happened. A rail showing three of a hundred and fifty
         sections with no explanation looks broken rather than filtered — and
         zero results has to be a sentence, never an empty column. */
      if (result) {
        result.textContent = shownSections
          ? shownSections + " section" + (shownSections === 1 ? "" : "s") + " · " + shownLessons + " lesson" + (shownLessons === 1 ? "" : "s")
          : "Nothing matches “" + input.value.trim() + "”";
      }
    }

    var timer = null;
    input.addEventListener("input", function () {
      /* A hundred and fifty <details> re-laid-out on every keystroke is a
         rail that stutters while you type. One frame's worth of debounce is
         invisible to a person and removes the thrash entirely. */
      clearTimeout(timer);
      timer = setTimeout(function () { apply(input.value); }, 120);
    });
    /* Escape clears the filter before it closes the drawer — the innermost
       thing first, which is what Escape means everywhere else in the system. */
    input.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && input.value) {
        e.stopPropagation();
        input.value = "";
        apply("");
      }
    });
    /* The box lives in a <form> so it works with no JS. With JS it must not
       navigate. */
    var form = input.closest("form");
    if (form) form.addEventListener("submit", function (e) { e.preventDefault(); });
  }

  /* ---- the drawer -------------------------------------------------------- */
  function wireDrawer(root) {
    var rail = root.querySelector(".ns-trainingnav");
    if (!rail) return;

    function set(open) {
      root.setAttribute("data-rail", open ? "open" : "closed");
      root.querySelectorAll("[data-ns-training-open]").forEach(function (b) {
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      if (open) {
        var first = rail.querySelector("[data-ns-trainingnav-filter], a, button");
        if (first) first.focus();
      }
    }

    /* COLLAPSE is the desktop state and OPEN is the phone state, and they are
       the same attribute on purpose: a rail is a column, a spine or a drawer,
       never two of those at once. Collapsing keeps the rail in the DOM, so
       the filter text and the scroll position survive the round trip. */
    function collapse(on) {
      root.setAttribute("data-rail", on ? "collapsed" : "closed");
      var reopen = root.querySelector("[data-ns-training-expand]");
      if (on && reopen) reopen.focus();
      else {
        var back = root.querySelector("[data-ns-training-collapse]");
        if (back) back.focus();
      }
    }

    doc.addEventListener("click", function (e) {
      if (e.target.closest("[data-ns-training-collapse]")) { collapse(true); return; }
      if (e.target.closest("[data-ns-training-expand]")) { collapse(false); return; }
      if (e.target.closest("[data-ns-training-open]")) { set(root.getAttribute("data-rail") !== "open"); return; }
      if (e.target.closest("[data-ns-training-close]")) { set(false); return; }
      /* Choosing a post closes the drawer: the reader asked to go somewhere,
         and leaving the navigation covering the thing they just chose is the
         classic mobile-drawer bug. Only inside the rail, and only for a real
         link — the filter box and the twisties are not navigation. */
      var link = e.target.closest(".ns-trainingnav__link");
      if (link && rail.contains(link)) set(false);
    });

    doc.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && root.getAttribute("data-rail") === "open") set(false);
    });
  }

  /* SHOW THE READER WHERE THEY ARE, on load.
     The curriculum this rail is built for runs to ~100 sections and ~500
     lessons, and every section but the current one is shut — which is what
     keeps it a list rather than a document. The cost is that the rail can
     open scrolled to row 1 while the lesson being read is row 340, so it
     opens on somebody else's curriculum.

     So: open the section that owns [aria-current], then bring the current
     lesson into view. Two details matter.

     `block: "center"` rather than the default, because the useful thing is
     the lesson WITH ITS NEIGHBOURS — what comes next is half the reason to
     look at a curriculum, and a row scrolled to the top edge has no next.

     `behavior: "auto"`, never smooth. This fires on load; a rail that visibly
     races through 340 rows before settling is motion nobody asked for, and
     tokens/effects.css is explicit that a response is not a gesture. It also
     means prefers-reduced-motion needs no special case here — there is no
     motion to reduce.

     If the markup ships no [aria-current] — an index page, a preview — this
     does nothing at all, which is the correct amount. */
  function revealCurrent(rail) {
    var current = rail.querySelector("[aria-current='page']");
    if (!current) return;
    var section = current.closest("details");
    if (section) section.open = true;
    var scroller = rail.querySelector(".ns-trainingnav__scroll") || rail;
    /* Only scroll the RAIL, not the page. scrollIntoView walks every
       scrollable ancestor, so on a phone — where the rail is a fixed drawer
       over the article — it would drag the article down behind the drawer
       too. Compute the offset against the scroller and set scrollTop. */
    if (!scroller.scrollHeight || scroller.scrollHeight <= scroller.clientHeight) return;
    var top = current.offsetTop - scroller.offsetTop;
    scroller.scrollTop = Math.max(0, top - (scroller.clientHeight / 2) + (current.offsetHeight / 2));
  }

  function init(scope) {
    (scope || doc).querySelectorAll("[data-ns-trainingnav]").forEach(function (rail) {
      if (rail.nsTrainingFilter) return;
      rail.nsTrainingFilter = true;
      wireFilter(rail);
      revealCurrent(rail);
    });
    (scope || doc).querySelectorAll("[data-ns-training]").forEach(function (root) {
      if (root.nsTrainingDrawer) return;
      root.nsTrainingDrawer = true;
      wireDrawer(root);
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
  window.nsTrainingInit = init;
})();
