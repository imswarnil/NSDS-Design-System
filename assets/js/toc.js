/* NS Design System — table of contents.
   =========================================================================
   Two jobs, both progressive enhancement:

     Used by the blog, the docs pages and any long prose surface — the TOC is
     its own module, not a blog feature, because a lesson and a doc page need
     exactly the same outline.

     1. The table of contents' scroll-spy. The TOC is a real <nav> of real
        anchor links that works with JS off; this only marks which heading is
        currently on screen with [aria-current], which is the same attribute
        the CSS already styles for the navbar and the lesson row.

     2. Building that TOC from the article's own headings, for a CMS that
        emits a post body but no outline. Opt in with [data-toc-from]; a
        hand-authored TOC is left exactly as it is.

   Reading progress lives in assets/js/lms.js (.ns-lprogress--article) — it
   is the same control on a lesson and on a post, so it has one
   implementation.

   Include with: <script src="assets/js/blog.js" defer></script> */
(function () {
  "use strict";

  var doc = document;

  /* ---- Build a TOC from the article -------------------------------------
     Only h2 and h3. Two levels is the limit: an outline that needs three is
     an outline for a page that needs splitting. A heading with no id gets
     one derived from its text, because an anchor link to nothing is worse
     than no anchor link. */
  function slug(text, taken) {
    var base = text.toLowerCase().trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-") || "section";
    var id = base, n = 2;
    while (taken[id]) { id = base + "-" + n++; }
    taken[id] = true;
    return id;
  }

  /* data-toc-from must point at the PROSE, not at the whole article: a post
     footer carrying "Related" and four card titles will otherwise put five
     entries in the outline that are not sections of the post. */
  function build(nav) {
    var article = doc.querySelector(nav.getAttribute("data-toc-from"));
    if (!article) return;
    var headings = article.querySelectorAll("h2, h3");
    if (!headings.length) { nav.hidden = true; return; }

    var taken = {};
    Array.prototype.forEach.call(doc.querySelectorAll("[id]"), function (el) { taken[el.id] = true; });

    var list = doc.createElement("div");
    Array.prototype.forEach.call(headings, function (h) {
      if (!h.id) h.id = slug(h.textContent, taken);
      var a = doc.createElement("a");
      a.className = "ns-toc__link" + (h.tagName === "H3" ? " ns-toc__link--sub" : "");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      list.appendChild(a);
    });
    nav.appendChild(list);
  }

  /* ---- Scroll-spy -------------------------------------------------------
     A rAF-throttled scroll read rather than an IntersectionObserver, and
     deliberately so: the question is not "which headings are visible" but
     "which was the LAST one to cross the line", and a section taller than
     the viewport has NO heading on screen at all. An observer answers the
     first question; this answers the one a reader is actually asking.

     The line sits at 30% of the viewport height — high enough that the
     marked item changes as a heading settles into reading position, not the
     moment it appears at the bottom edge. */
  function spy(nav) {
    /* init() is exposed for apps that render a post after load, so it can be
       called more than once on the same TOC — without this guard each call
       adds another scroll listener that never comes off. */
    if (nav.hasAttribute("data-toc-spied")) return;
    var links = nav.querySelectorAll(".ns-toc__link");
    if (!links.length) return;
    nav.setAttribute("data-toc-spied", "");

    var targets = [];
    Array.prototype.forEach.call(links, function (a) {
      var id = decodeURIComponent((a.getAttribute("href") || "").slice(1));
      var el = id && doc.getElementById(id);
      if (el) targets.push({ el: el, link: a, seen: false });
    });
    if (!targets.length) return;

    function mark() {
      var current = null;
      for (var i = 0; i < targets.length; i++) {
        /* Above the line, or the first one when the reader is still above
           all of them — a TOC with nothing marked reads as broken. */
        if (targets[i].el.getBoundingClientRect().top <= window.innerHeight * 0.3) current = targets[i];
      }
      if (!current) current = targets[0];
      targets.forEach(function (t) {
        if (t.link === current.link) t.link.setAttribute("aria-current", "true");
        else t.link.removeAttribute("aria-current");
      });
      /* Keep the marked item inside a scrolling rail. Only when the rail
         actually scrolls — otherwise this fights the page. */
      var rail = nav.closest(".ns-post__rail") || nav;
      if (rail.scrollHeight > rail.clientHeight + 4) {
        var r = current.link.getBoundingClientRect(), b = rail.getBoundingClientRect();
        if (r.top < b.top || r.bottom > b.bottom) current.link.scrollIntoView({ block: "nearest" });
      }
    }

    var ticking = false;
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(function () { mark(); ticking = false; });
    }
    /* Capture on the document, not a listener on window: `scroll` does not
       bubble, so on any surface whose text scrolls inside its own pane rather
       than with the page — the course player's lesson column — a window
       listener never fires and the outline marks nothing for the whole
       lesson. mark() is viewport-relative already, so catching the event from
       whichever element scrolled is the entire fix. */
    document.addEventListener("scroll", onScroll, { passive: true, capture: true });
    window.addEventListener("resize", onScroll, { passive: true });
    mark();
  }

  function init(root) {
    Array.prototype.forEach.call((root || doc).querySelectorAll(".ns-toc[data-toc-from]:not([data-toc-built])"), function (nav) {
      build(nav);
      nav.setAttribute("data-toc-built", "");
    });
    Array.prototype.forEach.call((root || doc).querySelectorAll(".ns-toc"), spy);
  }

  if (doc.readyState === "loading") {
    doc.addEventListener("DOMContentLoaded", function () { init(doc); });
  } else {
    init(doc);
  }

  window.nsBlog = { init: init };
})();
