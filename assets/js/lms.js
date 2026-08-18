/* NS Design System — LMS wiring.
   =========================================================================
   The five things the learner-facing layer needs that CSS cannot do. All of
   it is progressive enhancement: with this file absent the curriculum still
   collapses (native <details>), the filters still filter (native form
   controls), and the price range is still two working sliders — you just
   lose the conveniences.

     1. Expand / collapse all curriculum sections.
     2. The dual price range: keep the two thumbs from crossing, and paint
        the selected band on the track.
     3. Applied-filter chips, mirrored from the checkboxes.
     4. Article reading progress.
     5. Star-rating fills, from the numeric value that is already in the DOM.

   Include with: <script src="assets/js/lms.js" defer></script> */
(function () {
  "use strict";

  var doc = document;
  var pct = function (n) { return Math.max(0, Math.min(100, n)) + "%"; };

  /* ---- 1. Curriculum expand / collapse all ------------------------------
     The button's label is the ACTION, not the state, and it flips once the
     sections do — a control reading "Collapse all" while everything is
     already collapsed is the classic version of this bug. */
  doc.addEventListener("click", function (e) {
    var btn = e.target.closest ? e.target.closest("[data-curriculum-toggle]") : null;
    if (!btn) return;
    var root = btn.closest(".ns-curriculum") || doc;
    var sections = root.querySelectorAll(".ns-curriculum__section");
    if (!sections.length) return;
    var anyClosed = Array.prototype.some.call(sections, function (d) { return !d.open; });
    Array.prototype.forEach.call(sections, function (d) { d.open = anyClosed; });
    btn.setAttribute("aria-expanded", anyClosed ? "true" : "false");
    var label = btn.querySelector("[data-curriculum-label]");
    if (label) label.textContent = anyClosed ? "Collapse all" : "Expand all";
  });

  /* ---- 2. Price range ---------------------------------------------------
     Two native sliders on one track. The clamp is the whole job: without it
     the "from" thumb walks past the "to" thumb and the filter silently
     inverts. Each input keeps its own value — they are two real form
     controls, so the form submits, the keyboard works, and a screen reader
     announces two named sliders rather than one mystery widget. */
  function paint(range) {
    var from = range.querySelector("[data-range=from]");
    var to = range.querySelector("[data-range=to]");
    var fill = range.querySelector(".ns-range__fill");
    if (!from || !to) return;

    var min = Number(from.min || 0);
    var max = Number(from.max || 100);
    var span = max - min || 1;
    var a = Number(from.value);
    var b = Number(to.value);

    /* Clamp rather than swap. Swapping means the thumb you are dragging
       jumps out from under the pointer, which feels broken even though the
       numbers end up right. */
    if (a > b) { if (doc.activeElement === from) { a = b; from.value = a; } else { b = a; to.value = b; } }

    if (fill) {
      range.style.setProperty("--fx-from", pct(((a - min) / span) * 100));
      range.style.setProperty("--fx-to", pct(((b - min) / span) * 100));
    }
    var out = range.querySelectorAll("[data-range-out]");
    if (out[0]) out[0].value = a;
    if (out[1]) out[1].value = b;
  }

  doc.addEventListener("input", function (e) {
    var range = e.target.closest ? e.target.closest(".ns-range") : null;
    if (!range) return;
    /* Typing an exact figure writes back to the slider, so the two halves of
       the control can never disagree about what is filtered. */
    if (e.target.hasAttribute("data-range-out")) {
      var inputs = range.querySelectorAll("[data-range]");
      var i = Array.prototype.indexOf.call(range.querySelectorAll("[data-range-out]"), e.target);
      if (inputs[i]) inputs[i].value = e.target.value;
    }
    paint(range);
  });

  /* ---- 3. Applied-filter chips -----------------------------------------
     Mirrors the checked facets above the grid. The chip is the same control
     as the checkbox, so removing one unchecks the other and fires a real
     change event — whatever listens for filtering does not need to know
     chips exist. */
  function chips(root) {
    var box = root.querySelector("[data-applied]");
    if (!box) return;
    var checked = root.querySelectorAll(".ns-filters input[type=checkbox]:checked");
    box.innerHTML = "";
    Array.prototype.forEach.call(checked, function (input) {
      /* The facet's NAME, not everything in its label: the count sits in the
         same element and would arrive glued to the end ("Beginner24"). A
         clone with the count removed is exact, and survives any markup the
         label happens to carry — a regex on the text does not. */
      var label = input.closest("label");
      var name = input.value;
      if (label) {
        var clone = label.cloneNode(true);
        Array.prototype.forEach.call(clone.querySelectorAll(".ns-filters__count, input"), function (n) { n.remove(); });
        name = clone.textContent.trim() || input.value;
      }
      var chip = doc.createElement("button");
      chip.type = "button";
      chip.className = "ns-tag ns-tag--pill";
      chip.innerHTML = name + ' <i class="ph ph-x" aria-hidden="true"></i>';
      chip.setAttribute("aria-label", "Remove filter: " + name);
      chip.addEventListener("click", function () {
        input.checked = false;
        input.dispatchEvent(new Event("change", { bubbles: true }));
      });
      box.appendChild(chip);
    });
    var clear = root.querySelector("[data-clear-filters]");
    if (clear) clear.hidden = checked.length === 0;
    box.hidden = checked.length === 0;
  }

  doc.addEventListener("change", function (e) {
    var root = e.target.closest ? e.target.closest("[data-filters]") : null;
    if (root) chips(root);
  });

  doc.addEventListener("click", function (e) {
    var clear = e.target.closest ? e.target.closest("[data-clear-filters]") : null;
    if (!clear) return;
    var root = clear.closest("[data-filters]") || doc;
    Array.prototype.forEach.call(root.querySelectorAll(".ns-filters input[type=checkbox]:checked"), function (input) {
      input.checked = false;
      input.dispatchEvent(new Event("change", { bubbles: true }));
    });
  });

  /* ---- 4. Article reading progress --------------------------------------
     Measured against the ARTICLE, not the document: a lesson page with a
     long footer would otherwise report 70% at the end of the text. Read in
     a passive scroll listener and written as one custom property, so the
     work per frame is a single style mutation. */
  function reading() {
    Array.prototype.forEach.call(doc.querySelectorAll(".ns-lprogress--article[data-target]"), function (bar) {
      var article = doc.querySelector(bar.getAttribute("data-target"));
      if (!article) return;
      var box = article.getBoundingClientRect();
      var scrolled = -box.top;
      var scrollable = box.height - window.innerHeight;
      var value = scrollable <= 0 ? 100 : (scrolled / scrollable) * 100;
      bar.style.setProperty("--fx-progress", pct(value));
      bar.setAttribute("aria-valuenow", String(Math.round(Math.max(0, Math.min(100, value)))));
    });
  }

  /* Listened for in the CAPTURE phase on the document rather than on window.
     `scroll` does not bubble, so a window listener never hears the course
     player — whose lesson column is its own scroll region — and the reading
     hairline sat at its server-rendered value for the whole lesson. Capture
     catches the event from any scroller on the page, and the maths above is
     already viewport-relative, so nothing else has to change. */
  var ticking = false;
  document.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { reading(); ticking = false; });
  }, { passive: true, capture: true });

  /* ---- 5. Star fills ----------------------------------------------------
     The number is already in the DOM as text — this only turns it into the
     width of the overlay. Nothing here is the source of the rating. */
  function ratings(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll(".ns-rating[data-value]"), function (el) {
      var value = parseFloat(el.getAttribute("data-value"));
      var outOf = parseFloat(el.getAttribute("data-of") || "5");
      if (isNaN(value) || !outOf) return;
      el.style.setProperty("--fx-rating", pct((value / outOf) * 100));
    });
  }

  /* ---- 6. Lesson rail filter --------------------------------------------
     The answer to the forty-lesson course, where scrolling to find "the one
     about governor limits" is the rail's whole problem.

     It hides ROWS, it does not rebuild the list: the indices, the completion
     states and the current row are all already correct in the markup, and a
     filter that re-renders them is a filter that can get them wrong. Nothing
     here runs until someone types, so the rail is fully usable with the script
     blocked — the input is then a search box that does nothing, which is why
     it is the only part of the rail that is progressive rather than required.

     Section headings go with their rows: a heading left standing over an empty
     section is a heading that lies about what is under it. */
  function railFilter(box) {
    var input = box.querySelector('input[type="search"], input');
    /* The rail and the mobile panel are the same list in two containers, so
       this drives both rather than shipping a second copy of it for the one
       that happens to be a popover. */
    var host = box.closest(".ns-player__side, .ns-lessonmodal");
    var list = host && host.querySelector(".ns-player__list, .ns-lessonmodal__list");
    if (!input || !list) return;

    var empty = doc.createElement("div");
    empty.className = "ns-empty";
    empty.hidden = true;
    empty.innerHTML = '<p class="ns-empty__title"></p><p class="ns-empty__text">Try a word from the lesson’s title.</p>';
    list.appendChild(empty);

    input.addEventListener("input", function () {
      var q = input.value.trim().toLowerCase();
      var shown = 0;

      Array.prototype.forEach.call(list.querySelectorAll(".ns-lesson"), function (row) {
        var title = row.querySelector(".ns-lesson__title");
        var match = !q || (title ? title.textContent.toLowerCase().indexOf(q) > -1 : false);
        row.hidden = !match;
        if (match) shown++;
      });

      /* A section heading is visible only while something under it is. */
      Array.prototype.forEach.call(list.querySelectorAll(".ns-player__section"), function (head) {
        var any = false, el = head.nextElementSibling;
        while (el && !el.classList.contains("ns-player__section")) {
          if (el.classList.contains("ns-lesson") && !el.hidden) { any = true; break; }
          el = el.nextElementSibling;
        }
        head.hidden = !any;
      });

      empty.hidden = !(q && shown === 0);
      if (!empty.hidden) empty.firstChild.textContent = "No lesson matches “" + input.value.trim() + "”";
    });
  }

  /* ---- 7. The curriculum toggle -----------------------------------------
     The course bar's sidebar button, and it had none of this: it shipped
     aria-expanded and aria-controls and nothing listened, so the one control
     named "toggle curriculum" did nothing at any width.

     TWO behaviours, one control, chosen by whether the rail is on screen:

       ≥ lg   collapse and expand the rail in place (data-rail on .ns-player).
       < lg   there IS no rail — it is display:none and the lesson list lives
              in the panel — so the same button opens that panel instead.

     Deciding on computed display rather than on a matchMedia breakpoint means
     the button follows the stylesheet: change where the rail disappears and
     this follows it, with no second copy of the number to keep in step. */
  function curriculumToggle(root) {
    Array.prototype.forEach.call(
      (root || doc).querySelectorAll('[aria-controls="player-rail"]'),
      function (btn) {
        if (btn.hasAttribute("data-ns-rail-wired")) return;
        btn.setAttribute("data-ns-rail-wired", "");
        btn.addEventListener("click", function () {
          var player = doc.querySelector(".ns-player");
          var rail = doc.getElementById("player-rail");
          if (!player || !rail) return;

          if (getComputedStyle(rail).display === "none") {
            var panel = doc.getElementById("lesson-drawer");
            /* showPopover throws if it is already open — which is exactly what
               a second click means, so that is the toggle. */
            if (panel && panel.showPopover) {
              if (panel.matches(":popover-open")) panel.hidePopover();
              else panel.showPopover();
            }
            return;
          }

          var open = player.getAttribute("data-rail") !== "collapsed";
          player.setAttribute("data-rail", open ? "collapsed" : "open");
          /* EVERY control pointed at the rail is updated, not just the one
             that was clicked: the collapse button lives inside the rail and
             the reopen button lives outside it, so exactly one of them is on
             screen at a time and both have to agree about the state. */
          Array.prototype.forEach.call(doc.querySelectorAll('[aria-controls="player-rail"]'), function (other) {
            other.setAttribute("aria-expanded", String(!open));
          });
        });
      }
    );
  }

  /* ---- 8. Ask AI ---------------------------------------------------------
     The lesson's "open this in Claude / ChatGPT / Perplexity" menu.

     What this does NOT do is send anything anywhere. There is no key, no
     proxy and no request from us: each row is an ordinary link with
     target="_blank" rel="noopener", and all this does is compose its href
     from ONE prompt written once on the container, rather than repeating the
     same sentence in three hrefs that then drift apart.

     The prompt carries the lesson's title — the site's own text — and nothing
     about the learner. Where a video is playing it also carries the timestamp,
     because "explain what is happening at 08:03" is a better question than
     "explain this lesson", and the reader can see exactly what is being sent
     before they click: it is in the URL, and the Copy row puts it on the
     clipboard verbatim.

     Composed on OPEN rather than on load, so the timestamp is the one the
     learner is looking at rather than the one the page rendered with. */
  function askAi(menu) {
    var base = menu.getAttribute("data-ns-ask-prompt");
    var field = menu.querySelector("[data-ns-ask-input]");
    if (!base) return;

    /* The prompt the page suggests. The learner's edits win over it — this is
       only what the field starts as, and it is recomputed when the panel opens
       so the timestamp is the one they are looking at rather than the one the
       page rendered with. */
    function suggested() {
      var cur = doc.querySelector("[data-ns-video-current]");
      var at = cur && cur.textContent.trim();
      /* 0:00 means "has not started", which is not a useful thing to ask about. */
      return at && at !== "0:00" ? base + " I am at " + at + " in the video." : base;
    }
    function prompt() {
      return (field && field.value.trim()) || suggested();
    }

    function compose() {
      var q = encodeURIComponent(prompt());
      Array.prototype.forEach.call(menu.querySelectorAll("[data-ns-ask]"), function (a) {
        a.href = a.getAttribute("data-ns-ask") + q;
      });
    }

    var trigger = menu.querySelector("[data-ns-menu]");
    if (trigger) {
      trigger.addEventListener("click", function () {
        /* Refill only while untouched: a reader who has written their own
           question does not want it replaced because they closed the panel to
           check the video. */
        if (field && !field.dataset.touched) field.value = suggested();
        compose();
      });
    }
    if (field) {
      field.value = suggested();
      field.addEventListener("input", function () {
        field.dataset.touched = "1";
        compose();
      });
    }
    compose();

    var copy = menu.querySelector("[data-ns-ask-copy]");
    if (copy) {
      copy.addEventListener("click", function () {
        var text = prompt();
        var done = function () {
          copy.setAttribute("data-copied", "");
          setTimeout(function () { copy.removeAttribute("data-copied"); }, 1200);
        };
        if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, function () {});
        else done();
      });
    }
  }

  function init(root) {
    ratings(root);
    Array.prototype.forEach.call((root || doc).querySelectorAll(".ns-range"), paint);
    Array.prototype.forEach.call((root || doc).querySelectorAll("[data-filters]"), chips);
    Array.prototype.forEach.call((root || doc).querySelectorAll(".ns-player__side-search"), railFilter);
    curriculumToggle(root);
    Array.prototype.forEach.call((root || doc).querySelectorAll("[data-ns-ask-prompt]"), askAi);
    reading();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", function () { init(doc); });
  } else {
    init(doc);
  }

  window.nsLms = { init: init };
})();
