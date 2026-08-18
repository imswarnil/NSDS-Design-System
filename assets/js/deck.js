/* NS Design System — deck runtime.
   =========================================================================
   Turns a stack of .ns-slide elements into a presentation. Progressive
   enhancement, in the strong sense: the markup with this script REMOVED is a
   scrolling handout of readable 16:9 cards, which is a genuinely useful
   document and not a broken deck. Nothing here creates content; it only
   decides which slide is current and which fragments have been revealed.

   What it does
     - keyboard, the way every presenter's clicker already speaks
       (→ ↓ space PgDn = advance, ← ↑ PgUp = back, Home/End, number + Enter)
     - progressive reveal of [data-fragment] within a slide, in document
       order, with [data-fragment-group] revealing several at once
     - the overview grid (G), speaker notes (N), shortcut card (?),
       fullscreen (F), and blackout (B) — the one every presenter uses when
       the room should look at them instead of the wall
     - a countdown for [data-deck-timer] hands-on slides
     - deep links: #/7 is slide 7, so a link into a talk lands on the slide
       being talked about, and reload keeps your place mid-session

   What it deliberately does NOT do
     - no scaling transform. The slide sizes itself in container units, in
       CSS — so there is no resize listener, no layout thrash when a projector
       renegotiates resolution mid-talk, and no stale scale after a rotate.
     - no second window. A presenter view that needs popups needs popup
       permission on someone else's machine ten seconds before a talk. The
       notes drawer is on the same screen and works everywhere.
     - no slide content. If it is on the slide it is in the HTML.

   Markup contract
     <div class="ns-deck" data-ns-deck data-mode="present"> …slides… </div>
     Chrome elements are found by data attribute and are all optional:
       [data-deck-prev] [data-deck-next]  buttons
       [data-deck-count]                  "03 / 24" — filled in here
       [data-deck-rail]                   sets --p
       [data-deck-overview]               the thumbnail overlay
       [data-deck-notes] / -body / -next  the notes drawer
       [data-deck-help]                   the shortcut card
       [data-deck-toggle="overview|notes|help|fullscreen|mode"]
     Per slide:
       data-title="…"   the label used in the overview and the notes drawer;
                        falls back to the slide's own .ns-slide__title text.
       .ns-slide__note  what to say. Never rendered on the slide.

   Include with: <script src="assets/js/deck.js" defer></script> */
(function () {
  "use strict";

  var doc = document;
  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* Below the tablet breakpoint the stylesheet turns present mode into the
     scrolling handout — see the media query in components/css/deck.css. The
     runtime has to agree, or it will be hiding slides that CSS is showing and
     tracking a "current" nobody can see. One source for the number: the
     --breakpoint-md token, read off the page rather than duplicated here. */
  function handheld() {
    var bp = getComputedStyle(doc.documentElement).getPropertyValue("--breakpoint-md").trim() || "48rem";
    return window.matchMedia("(max-width: " + bp + ")").matches;
  }

  /* ---- the hands-on timer ------------------------------------------------
     [data-deck-timer="1500"] is twenty-five minutes counted down where the
     ROOM can see it, so an exercise ends because time ran out rather than
     because the presenter got bored.

     State lives ON the element rather than in a closure: the click handler is
     bound once for the life of the page while the ticking interval is rebuilt
     every time the slide changes, and the two have to read the same
     startedAt or the button and the countdown drift apart.

     It runs PAST zero on purpose. An exercise four minutes over is a fact
     worth showing the presenter; a clock frozen at 00:00 hides it. */
  function renderTimer(el) {
    var total = parseInt(el.getAttribute("data-deck-timer"), 10) || 0;
    var out = el.querySelector("[data-deck-timer-value]") || el;
    var left = el.nsStartedAt ? total - Math.floor((Date.now() - el.nsStartedAt) / 1000) : total;
    var abs = Math.abs(left);
    out.textContent = (left < 0 ? "-" : "") + String(Math.floor(abs / 60)).padStart(2, "0") + ":" + String(abs % 60).padStart(2, "0");
    el.setAttribute("data-state", !el.nsStartedAt ? "idle" : left < 0 ? "over" : "running");
  }

  /* Started by the presenter, not by arriving on the slide: you introduce the
     exercise, answer a question, and THEN say go. A second press resets it. */
  function bindTimer(el) {
    renderTimer(el);
    if (el.nsTimerBound) return;
    el.nsTimerBound = true;
    el.addEventListener("click", function () {
      el.nsStartedAt = el.nsStartedAt ? 0 : Date.now();
      renderTimer(el);
    });
  }

  function Deck(root) {
    var slides = [].slice.call(root.querySelectorAll(".ns-slide"));
    if (!slides.length) return;

    var index = 0;
    var revealed = 0;      /* fragments shown on the current slide */
    var blackout = false;
    var self = {};

    var $ = function (sel) { return root.querySelector(sel); };
    var chrome = {
      prev: $("[data-deck-prev]"),
      next: $("[data-deck-next]"),
      count: $("[data-deck-count]"),
      rail: $("[data-deck-rail]"),
      overview: $("[data-deck-overview]"),
      thumbs: $("[data-deck-thumbs]"),
      notes: $("[data-deck-notes]"),
      notesBody: $("[data-deck-notes-body]"),
      notesNext: $("[data-deck-notes-next]"),
      help: $("[data-deck-help]"),
    };

    /* The slide's name, for the overview and the notes. An explicit
       data-title wins — a title slide's heading is the deck's name, and
       "Namaste Salesforce" as the label of slide 1 tells a presenter
       scanning the overview nothing. */
    function titleOf(slide, i) {
      var t = slide.getAttribute("data-title");
      if (t) return t;
      var el = slide.querySelector(".ns-slide__title");
      return (el && el.textContent.trim()) || "Slide " + (i + 1);
    }

    /* ---- fragments ------------------------------------------------------
       Document order, and a group reveals together: three cards that are one
       idea should not arrive one at a time. */
    function fragmentsOf(slide) {
      var nodes = [].slice.call(slide.querySelectorAll("[data-fragment]"));
      var groups = [];
      var seen = {};
      nodes.forEach(function (n) {
        var g = n.getAttribute("data-fragment-group");
        if (g) {
          if (seen[g] === undefined) { seen[g] = groups.length; groups.push([]); }
          groups[seen[g]].push(n);
        } else {
          groups.push([n]);
        }
      });
      return groups;
    }

    function paintFragments() {
      var groups = fragmentsOf(slides[index]);
      groups.forEach(function (group, i) {
        group.forEach(function (n) {
          if (i < revealed) n.setAttribute("data-shown", "");
          else n.removeAttribute("data-shown");
        });
      });
      return groups.length;
    }

    /* ---- the current slide ---------------------------------------------- */
    function paint() {
      slides.forEach(function (s, i) {
        if (i === index) s.setAttribute("aria-current", "true");
        else s.removeAttribute("aria-current");
      });
      paintFragments();

      var n = index + 1;
      var total = slides.length;
      if (chrome.count) chrome.count.innerHTML = "<b>" + String(n).padStart(2, "0") + "</b> / " + String(total).padStart(2, "0");
      if (chrome.rail) chrome.rail.style.setProperty("--p", Math.round((n / total) * 100) + "%");
      if (chrome.prev) chrome.prev.disabled = index === 0 && revealed === 0;
      if (chrome.next) chrome.next.disabled = index === total - 1 && revealed >= fragmentsOf(slides[index]).length;

      /* The number in the running foot. A slide numbers itself if it wants
         to — this only fills the ones that left it to us, so a deck can
         still hard-code "00" on a title slide that should not be numbered. */
      var foot = slides[index].querySelector("[data-deck-slide-num]");
      if (foot) foot.textContent = String(n).padStart(2, "0") + " / " + String(total).padStart(2, "0");

      paintNotes();
      paintThumbs();
      startTimers();

      /* Deep link. replaceState, not push: a talk is not forty history
         entries, and Back should leave the deck rather than crawl it. */
      try { history.replaceState(null, "", "#/" + n); } catch (e) { /* file:// */ }
    }

    function go(i, opts) {
      var to = Math.max(0, Math.min(slides.length - 1, i));
      if (to === index && !(opts && opts.force)) return;
      index = to;
      /* Stepping BACK lands on a slide with everything already revealed —
         re-walking six fragments to get to the previous slide is how a
         presenter loses the room while pressing left arrow nine times. */
      revealed = opts && opts.atStart ? 0 : fragmentsOf(slides[index]).length;
      paint();
      if (handheld()) slides[index].scrollIntoView({ block: "start", behavior: reduced ? "auto" : "smooth" });
    }

    function next() {
      var total = fragmentsOf(slides[index]).length;
      if (revealed < total) { revealed++; paint(); return; }
      if (index < slides.length - 1) go(index + 1, { atStart: true });
    }

    function prev() {
      if (revealed > 0) { revealed--; paint(); return; }
      if (index > 0) go(index - 1);
    }

    /* ---- notes ----------------------------------------------------------
       The current slide's note, and the NAME of the next one. "Next: governor
       limits" is the single most useful line on a presenter display, and the
       reason speaker notes exist at all. */
    function paintNotes() {
      if (!chrome.notesBody) return;
      var note = slides[index].querySelector(".ns-slide__note");
      chrome.notesBody.innerHTML = "";
      var p = doc.createElement("div");
      p.innerHTML = note ? note.innerHTML : "<span class=\"ns-slide__caption\">No note for this slide</span>";
      chrome.notesBody.appendChild(p);
      if (chrome.notesNext) {
        var after = slides[index + 1];
        chrome.notesNext.innerHTML = after
          ? "<b>Next</b>" + escapeHtml(titleOf(after, index + 1))
          : "<b>Next</b>End of the deck";
      }
    }

    function escapeHtml(s) {
      return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
    }

    /* ---- the overview ---------------------------------------------------
       Live clones at thumbnail size, not screenshots — the slide sizes itself
       from its container, so a copy in a 15rem box simply IS the slide, and
       cannot go stale the way a rendered image would. Built once, lazily, the
       first time the overview is opened: cloning forty slides on page load to
       populate a panel most talks never open is work for nothing.

       inert on the clone, because a cloned slide full of links and <details>
       is forty extra tab stops sitting behind the deck. */
    var thumbsBuilt = false;
    function buildThumbs() {
      if (thumbsBuilt || !chrome.thumbs) return;
      thumbsBuilt = true;
      slides.forEach(function (s, i) {
        var btn = doc.createElement("button");
        btn.type = "button";
        btn.className = "ns-deck__thumb";
        btn.setAttribute("data-deck-goto", String(i));

        var frame = doc.createElement("div");
        frame.className = "ns-deck__thumb-frame";
        var clone = s.cloneNode(true);
        clone.removeAttribute("id");
        clone.removeAttribute("aria-current");
        clone.setAttribute("aria-hidden", "true");
        clone.inert = true;
        [].slice.call(clone.querySelectorAll("[data-fragment]")).forEach(function (n) { n.setAttribute("data-shown", ""); });
        frame.appendChild(clone);

        var meta = doc.createElement("span");
        meta.className = "ns-deck__thumb-meta";
        meta.innerHTML = String(i + 1).padStart(2, "0") +
          " <span class=\"ns-deck__thumb-title\">" + escapeHtml(titleOf(s, i)) + "</span>";

        btn.appendChild(frame);
        btn.appendChild(meta);
        chrome.thumbs.appendChild(btn);
      });
    }

    function paintThumbs() {
      if (!chrome.thumbs) return;
      [].slice.call(chrome.thumbs.children).forEach(function (b, i) {
        if (i === index) b.setAttribute("aria-current", "true");
        else b.removeAttribute("aria-current");
      });
    }

    /* ---- panels ---------------------------------------------------------- */
    function toggle(which, force) {
      var el = chrome[which];
      if (!el) return;
      if (which === "overview") buildThumbs();
      var open = force !== undefined ? force : el.hidden;
      el.hidden = !open;
      root.querySelectorAll('[data-deck-toggle="' + which + '"]').forEach(function (b) {
        b.setAttribute("aria-expanded", open ? "true" : "false");
      });
      if (open && which === "overview") {
        var cur = chrome.thumbs && chrome.thumbs.children[index];
        if (cur) { cur.scrollIntoView({ block: "nearest" }); cur.focus(); }
      }
    }

    function closeAll() {
      ["overview", "notes", "help"].forEach(function (k) { if (chrome[k] && !chrome[k].hidden) toggle(k, false); });
    }

    /* ---- the hands-on timer ---------------------------------------------
       [data-deck-timer="600"] counts ten minutes down, starting when the
       slide becomes current and stopping when it stops being current — a
       timer that keeps running behind four other slides is a timer that says
       -04:12 when you come back to it.

       It goes past zero rather than stopping at it: an exercise that ran four
       minutes over is a fact worth showing the presenter, and a timer frozen
       at 00:00 hides it. */
    var ticking = null;
    function startTimers() {
      if (ticking) { clearInterval(ticking); ticking = null; }
      var el = slides[index].querySelector("[data-deck-timer]");
      if (!el) return;
      bindTimer(el);
      /* The interval belongs to the CURRENT slide and is torn down when the
         slide changes — a timer still ticking behind four other slides is a
         timer that reads -04:12 when you come back to it. */
      ticking = setInterval(function () { if (el.nsStartedAt) renderTimer(el); }, 1000);
    }

    /* ---- the viewport lock ------------------------------------------------
       Present mode is one viewport; the document behind it must not scroll
       too. Stamped on <html> from here rather than written into the page's
       markup, because a lock in the markup is one the mode toggle cannot
       undo — and taken off on a phone, where the stylesheet has already
       turned present mode back into the scrolling handout. */
    function applyLock() {
      var presenting = root.getAttribute("data-mode") === "present" && !handheld();
      if (presenting) doc.documentElement.setAttribute("data-ns-deck-fixed", "");
      else doc.documentElement.removeAttribute("data-ns-deck-fixed");
    }
    window.addEventListener("resize", applyLock);

    /* ---- wiring ---------------------------------------------------------- */
    if (chrome.prev) chrome.prev.addEventListener("click", prev);
    if (chrome.next) chrome.next.addEventListener("click", next);

    root.addEventListener("click", function (e) {
      var goto = e.target.closest("[data-deck-goto]");
      if (goto) {
        go(parseInt(goto.getAttribute("data-deck-goto"), 10), { force: true });
        closeAll();
        return;
      }
      var t = e.target.closest("[data-deck-toggle]");
      if (!t) return;
      var which = t.getAttribute("data-deck-toggle");
      if (which === "fullscreen") {
        if (doc.fullscreenElement) doc.exitFullscreen();
        else if (root.requestFullscreen) root.requestFullscreen();
      } else if (which === "mode") {
        var to = root.getAttribute("data-mode") === "present" ? "scroll" : "present";
        root.setAttribute("data-mode", to);
        t.setAttribute("aria-pressed", to === "scroll" ? "true" : "false");
        applyLock();
        if (to === "present") paint();
        /* Next frame: the switch to the handout changes every slide from
           "hidden" to "in the flow", and scrolling before that layout exists
           lands on the position slide 1 used to occupy. */
        else requestAnimationFrame(function () { slides[index].scrollIntoView({ block: "start" }); });
      } else {
        toggle(which);
      }
    });

    /* Advance by clicking the slide itself — the way a trackpad-only
       presenter drives a deck. Never when the click landed on something
       interactive: a link, a <details>, a code block's copy button. */
    root.addEventListener("click", function (e) {
      if (root.getAttribute("data-mode") !== "present" || handheld()) return;
      if (!e.target.closest(".ns-slide")) return;
      /* The overview's thumbnails CONTAIN cloned slides, so "clicked inside a
         slide" is true there too — and a jump that also advanced one would
         land you on the slide after the one you picked. */
      if (e.target.closest(".ns-deck__overview, [data-deck-goto]")) return;
      if (e.target.closest("a, button, summary, input, select, textarea, [data-deck-timer], [contenteditable]")) return;
      next();
    });

    doc.addEventListener("keydown", function (e) {
      var t = e.target;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) return;
      if (e.altKey || e.metaKey || e.ctrlKey) return;

      switch (e.key) {
        case "ArrowRight": case "ArrowDown": case "PageDown": case " ": case "Enter":
          e.preventDefault(); next(); break;
        case "ArrowLeft": case "ArrowUp": case "PageUp":
          e.preventDefault(); prev(); break;
        case "Home": e.preventDefault(); go(0, { atStart: true }); break;
        case "End": e.preventDefault(); go(slides.length - 1); break;
        case "g": case "G": toggle("overview"); break;
        case "n": case "N": case "s": case "S": toggle("notes"); break;
        case "?": toggle("help"); break;
        case "f": case "F":
          if (doc.fullscreenElement) doc.exitFullscreen();
          else if (root.requestFullscreen) root.requestFullscreen();
          break;
        case "b": case "B": case ".":
          /* Blackout. The oldest presenter control there is: the room looks
             at you instead of the wall. */
          blackout = !blackout;
          root.style.visibility = blackout ? "hidden" : "";
          break;
        case "Escape":
          if (blackout) { blackout = false; root.style.visibility = ""; }
          closeAll();
          break;
        default:
          /* Type a number, press Enter — "go to 23" without opening the
             overview, which is what a presenter answering "can you go back to
             the architecture slide" actually needs. */
          if (/^[0-9]$/.test(e.key)) {
            buffer += e.key;
            clearTimeout(bufferTimer);
            bufferTimer = setTimeout(function () {
              var n = parseInt(buffer, 10);
              buffer = "";
              if (n >= 1 && n <= slides.length) go(n - 1, { force: true });
            }, 700);
          }
      }
    });
    var buffer = "";
    var bufferTimer = null;

    /* Touch: swipe the stage. Threshold is deliberately generous — a deck read
       on a phone is being SCROLLED, and a twitchy horizontal handler that
       eats vertical drags makes the handout unusable. */
    var x0 = null, y0 = null;
    root.addEventListener("touchstart", function (e) {
      x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
    }, { passive: true });
    root.addEventListener("touchend", function (e) {
      if (x0 === null || handheld()) return;
      var dx = e.changedTouches[0].clientX - x0;
      var dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 2) { dx < 0 ? next() : prev(); }
      x0 = y0 = null;
    }, { passive: true });

    /* Open on the slide the URL names. */
    var fromHash = (location.hash.match(/^#\/(\d+)$/) || [])[1];
    if (fromHash) index = Math.max(0, Math.min(slides.length - 1, parseInt(fromHash, 10) - 1));
    window.addEventListener("hashchange", function () {
      var m = (location.hash.match(/^#\/(\d+)$/) || [])[1];
      if (m) go(parseInt(m, 10) - 1, { force: true });
    });

    /* A slide printed or exported has to be complete, so everything is
       revealed before the print dialog opens and restored after it. */
    window.addEventListener("beforeprint", function () {
      slides.forEach(function (s) {
        [].slice.call(s.querySelectorAll("[data-fragment]")).forEach(function (n) { n.setAttribute("data-shown", ""); });
      });
    });
    window.addEventListener("afterprint", paintFragments);

    self.go = go;
    root.nsDeck = self;
    applyLock();
    paint();
  }

  function init(scope) {
    var where = scope || doc;
    where.querySelectorAll("[data-ns-deck]").forEach(function (el) {
      if (!el.nsDeck) Deck(el);
    });
    /* A timer OUTSIDE a deck still works — on a lesson page, in a workshop
       handout, in the styleguide's own demo. A deck drives the one on its
       current slide; everything else ticks on its own from the moment it is
       pressed. */
    where.querySelectorAll("[data-deck-timer]").forEach(function (el) {
      if (el.closest("[data-ns-deck]") || el.nsTimerBound) return;
      bindTimer(el);
      setInterval(function () { if (el.nsStartedAt) renderTimer(el); }, 1000);
    });
  }

  if (doc.readyState === "loading") doc.addEventListener("DOMContentLoaded", function () { init(); });
  else init();
  /* For an app that mounts a deck after load (the LMS renders one inside a
     lesson). Same idiom the other runtimes in assets/js use. */
  window.nsDeckInit = init;
})();
