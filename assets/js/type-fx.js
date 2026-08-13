/* NS Design System — typographic effect wiring.
   =========================================================================
   Four small jobs, none of which CSS can do alone:

     1. [data-fx-in]      an IntersectionObserver flag, so an effect draws
                          when it is read rather than while it is off-screen.
     2. --fx-len          the real path length of a hand-drawn circle, so the
                          stroke-dasharray draw is exact instead of guessed.
     3. .ns-scramble      the matrix-style character settle, on entry and on
                          responsive re-wrap.
     4. .ns-curve         builds the SVG <textPath> for circular text from
                          plain text in the markup.

   The whole file is a progressive enhancement. With JS off: highlights are
   already drawn, circles are already closed, scrambled text is just text,
   and circular text falls back to a readable straight line. Nothing here is
   load-bearing.

   Reduced motion is checked ONCE and honoured by skipping the animation
   entirely rather than by racing it to its end state.

   Include with: <script src="assets/js/type-fx.js" defer></script> */
(function () {
  "use strict";

  var reduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---- 1. In-view flag -------------------------------------------------- */
  var FX = "[data-fx], .ns-mark--animate, .ns-strike--animate, .ns-circle--animate, .ns-frame--animate, .ns-scan, .ns-reveal, .ns-scramble";

  function observe(root) {
    var targets = (root || document).querySelectorAll(FX);
    if (!targets.length) return;

    if (reduced || !("IntersectionObserver" in window)) {
      /* No observer, or the reader asked for stillness: mark everything in
         immediately. The CSS end states are the correct rendering, so this
         produces the finished effect with no motion. */
      Array.prototype.forEach.call(targets, function (el) { el.setAttribute("data-fx-in", ""); settle(el); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-fx-in", "");
        scramble(entry.target);
        /* Once drawn, done. An effect that re-fires every time you scroll
           past it stops being punctuation and becomes a distraction. */
        io.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -12% 0px", threshold: 0.25 });

    Array.prototype.forEach.call(targets, function (el) { io.observe(el); });
  }

  /* ---- 2. Circle path length ------------------------------------------- */
  /* stroke-dasharray needs the path's own length or the "draw" either stalls
     short or finishes early. getTotalLength is exact and cheap; the CSS
     fallback (1000) only ever applies before this runs. */
  function measure(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(".ns-circle svg path"), function (path) {
      try {
        var len = Math.ceil(path.getTotalLength());
        path.closest(".ns-circle").style.setProperty("--fx-len", len);
      } catch (e) { /* detached or display:none — it keeps the fallback */ }
    });
  }

  /* ---- 3. Scramble ------------------------------------------------------ */
  var GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#$%&/<>*+=-";

  function settle(el) {
    if (!el.classList.contains("ns-scramble")) return;
    el.setAttribute("data-fx-settled", "");
    if (el.dataset.fxText) el.textContent = el.dataset.fxText;
  }

  function scramble(el) {
    if (!el.classList.contains("ns-scramble")) return;
    if (reduced) return settle(el);

    var final = el.dataset.fxText || (el.dataset.fxText = el.textContent);
    var chars = final.split("");

    /* Driven by ELAPSED TIME, not by a frame counter. rAF is throttled hard
       in a backgrounded tab and in an iframe that is only partly on screen —
       and a frame-counted scramble in that situation does not slow down, it
       stops, leaving a heading reading "D9#M/" indefinitely. Time-based, a
       throttled frame rate costs smoothness and nothing else, and the run
       always finishes in DURATION. */
    var DURATION = 700;
    var STAGGER = 0.55;  /* share of the run spent handing off left→right */
    var start = performance.now();
    /* Each character settles inside its own window; the windows overlap, so
       the reveal has a soft leading edge rather than a hard wipe. The jitter
       is per-character and fixed up front, so a character cannot be re-rolled
       into an earlier finish by a later frame. */
    var n = Math.max(chars.length - 1, 1);
    var plan = chars.map(function (_, i) {
      var from = (i / n) * STAGGER;
      return { from: from, to: from + (1 - STAGGER) * (0.55 + Math.random() * 0.45) };
    });
    el.removeAttribute("data-fx-settled");

    (function tick(now) {
      var t = Math.min((( now || performance.now()) - start) / DURATION, 1);
      var html = "";
      for (var i = 0; i < chars.length; i++) {
        var c = chars[i];
        if (c === " " || t >= plan[i].to) { html += escapeHtml(c); continue; }
        if (t < plan[i].from) { html += '<span data-fx-char>&nbsp;</span>'; continue; }
        html += '<span data-fx-char>' + GLYPHS[Math.floor(Math.random() * GLYPHS.length)] + "</span>";
      }
      el.innerHTML = html;
      if (t < 1) {
        window.requestAnimationFrame(tick);
      } else {
        el.textContent = final;
        el.setAttribute("data-fx-settled", "");
      }
    })();
  }

  function escapeHtml(s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  /* Re-scramble on a genuine layout break. This is the responsive half of the
     effect: when a breakpoint re-wraps a heading, the text re-settles instead
     of teleporting, so the reflow reads as deliberate. Bound to the
     breakpoint list rather than to resize — firing on every resize frame
     would be both useless and expensive. */
  ["(max-width: 40rem)", "(max-width: 64rem)"].forEach(function (q) {
    var mq = window.matchMedia(q);
    var on = mq.addEventListener ? "addEventListener" : "addListener";
    mq[on].call(mq, "change", function () {
      if (reduced) return;
      Array.prototype.forEach.call(document.querySelectorAll(".ns-scramble[data-fx-in]"), scramble);
    });
  });

  /* ---- 4. Circular text ------------------------------------------------- */
  /* <textPath> is the only correct way to set type on a curve — it rotates
     each glyph to the tangent, which no amount of per-character CSS rotation
     reproduces. The markup carries plain text; this replaces it with the SVG
     and keeps the original string as the accessible name. */
  var uid = 0;

  function curve(root) {
    Array.prototype.forEach.call((root || document).querySelectorAll(".ns-curve:not([data-fx-built])"), function (el) {
      var text = (el.dataset.fxCurveText || el.textContent || "").trim();
      if (!text) return;
      var center = el.querySelector(".ns-curve__center");
      var repeat = parseInt(el.dataset.fxRepeat || "1", 10);
      var id = "ns-curve-" + ++uid;
      var label = text;

      /* A circle traced from the top, clockwise. r=38 in a 100-unit box
         leaves room for the cap height plus the centre content. */
      var d = "M 50,50 m -38,0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0";
      var body = new Array(repeat + 1).join(text + " · ");

      el.dataset.fxCurveText = text;
      el.textContent = "";
      el.insertAdjacentHTML("afterbegin",
        '<svg viewBox="0 0 100 100" aria-hidden="true" focusable="false">' +
        '<defs><path id="' + id + '" d="' + d + '"></path></defs>' +
        '<text><textPath href="#' + id + '" startOffset="0">' + escapeHtml(body) + "</textPath></text>" +
        "</svg>");
      if (center) el.appendChild(center);
      /* The ring is decorative once it is a curve — the readable copy is the
         label, announced once, in order. */
      if (!el.hasAttribute("aria-label")) el.setAttribute("aria-label", label);
      el.setAttribute("role", "img");
      el.setAttribute("data-fx-built", "");
    });
  }

  function init(root) {
    curve(root);
    measure(root);
    observe(root);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", function () { init(document); });
  } else {
    init(document);
  }

  /* Exposed for apps that render effects after load (a route change, a lesson
     body arriving over the wire). Idempotent — everything it touches is
     guarded by a flag or an unobserve. */
  window.nsTypeFx = { init: init, scramble: scramble };
})();
