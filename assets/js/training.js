/* NS Design System — training rail: filter and drawer.
   =========================================================================
   Two jobs, both progressive enhancement, both specific to a curriculum with
   a hundred and fifty modules in it. The rail's OTHER behaviour — opening the
   module that contains the current post and scrolling it into view — is in
   assets/js/rail.js and is shared with the docs sidebar; it is not repeated
   here.

     1. FILTER. Type in the rail's search box and the tree reduces to the
        modules and posts that match. This is the whole reason the box exists:
        at fifteen modules a tree is navigable, and at a hundred and fifty it
        is a filing cabinet you have to already know your way around.

        Matching a POST reveals its module. Matching a MODULE keeps all of its
        posts, because "sharing" should show you everything in the Sharing
        module rather than the one post whose title happens to repeat the word.

     2. DRAWER. Below the lg breakpoint the fixed rail becomes an off-canvas
        drawer — the stylesheet does the sliding, this sets the state, traps
        nothing, and closes on Escape, on the scrim, and on choosing a post.

   Both degrade correctly. With this file removed the search box is a real
   input in a real <form> pointed at site search, and the rail is a column
   that is simply always open.

   Markup contract
     <div class="ns-training ns-training--fixed" data-ns-training data-rail="closed">
       <button data-ns-training-open>            the panel bar's handle
       <div class="ns-training__scrim" data-ns-training-close>
       <nav class="ns-trainingnav" data-ns-trainingnav>
         <input data-ns-trainingnav-filter>      the filter box
         <p data-ns-trainingnav-result>          "6 of 150 modules" — written here
         <details class="ns-trainingnav__module"> … </details>

   Include with: <script src="assets/js/training.js" defer></script> */
(function () {
  "use strict";

  var doc = document;

  /* ---- the filter -------------------------------------------------------- */
  function wireFilter(rail) {
    var input = rail.querySelector("[data-ns-trainingnav-filter]");
    if (!input) return;
    var result = rail.querySelector("[data-ns-trainingnav-result]");
    var modules = [].slice.call(rail.querySelectorAll(".ns-trainingnav__module"));
    if (!modules.length) return;

    /* The open/closed state the reader chose, remembered before the first
       search so clearing the box puts the rail back exactly as it was. A
       filter that leaves forty modules expanded behind it has not finished
       the job it started. */
    var restored = null;

    function text(el) {
      return (el.textContent || "").toLowerCase();
    }

    function apply(q) {
      q = q.trim().toLowerCase();

      if (!q) {
        modules.forEach(function (m, i) {
          m.hidden = false;
          [].slice.call(m.querySelectorAll("li")).forEach(function (li) { li.hidden = false; });
          if (restored) m.open = restored[i];
        });
        restored = null;
        if (result) result.textContent = "";
        return;
      }

      if (!restored) restored = modules.map(function (m) { return m.open; });

      var shownModules = 0;
      var shownPosts = 0;

      modules.forEach(function (m) {
        var summary = m.querySelector("summary");
        var moduleHit = summary ? text(summary).indexOf(q) !== -1 : false;
        var posts = [].slice.call(m.querySelectorAll(".ns-trainingnav__list > li"));
        var hits = 0;

        posts.forEach(function (li) {
          /* A module-level match keeps everything under it — "sharing" should
             open the Sharing module, not reduce it to the one post whose
             title repeats the word. */
          var hit = moduleHit || text(li).indexOf(q) !== -1;
          li.hidden = !hit;
          if (hit) hits++;
        });

        var keep = moduleHit || hits > 0;
        m.hidden = !keep;
        /* Everything that survives is opened: the point of searching is to
           see the results, and a match hidden inside a collapsed module is a
           match the reader has to go looking for twice. */
        if (keep) { m.open = true; shownModules++; shownPosts += hits; }
      });

      /* Say what happened. A rail showing three of a hundred and fifty
         modules with no explanation looks broken rather than filtered — and
         zero results has to be a sentence, never an empty column. */
      if (result) {
        result.textContent = shownModules
          ? shownModules + " module" + (shownModules === 1 ? "" : "s") + " · " + shownPosts + " post" + (shownPosts === 1 ? "" : "s")
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

    doc.addEventListener("click", function (e) {
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

  function init(scope) {
    (scope || doc).querySelectorAll("[data-ns-trainingnav]").forEach(function (rail) {
      if (rail.nsTrainingFilter) return;
      rail.nsTrainingFilter = true;
      wireFilter(rail);
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
