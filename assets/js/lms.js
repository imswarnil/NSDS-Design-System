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

  var ticking = false;
  window.addEventListener("scroll", function () {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () { reading(); ticking = false; });
  }, { passive: true });

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

  function init(root) {
    ratings(root);
    Array.prototype.forEach.call((root || doc).querySelectorAll(".ns-range"), paint);
    Array.prototype.forEach.call((root || doc).querySelectorAll("[data-filters]"), chips);
    reading();
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", function () { init(doc); });
  } else {
    init(doc);
  }

  window.nsLms = { init: init };
})();
