/* NS Design System — tabs.
   =========================================================================
   The CSS documented the ARIA contract from the start and nothing implemented
   it, so tabs looked selectable and were not. This is that implementation.

     - Click or arrow to select. ArrowLeft/Right for a horizontal tablist,
       ArrowUp/Down for aria-orientation="vertical", Home/End to the ends.
     - Roving tabindex: only the selected tab is in the tab order, so Tab moves
       OUT of the tablist and into the panel, which is the whole point of the
       pattern. Landing on eight tabs one at a time is the bug it avoids.
     - Selection is aria-selected plus [hidden] on the panels. No classes, so
       the CSS, the assistive layer and this script read one source.

   Progressive: with no JS every panel is visible, which is worse to scroll but
   never hides content. That is why the panels are NOT hidden in the markup —
   this script hides the inactive ones on init. Building it the other way round
   means a JS failure hides everything but the first panel. */
(function () {
  function wire(list) {
    var tabs = [].slice.call(list.querySelectorAll('[role="tab"]'));
    if (!tabs.length) return;
    var vertical = list.getAttribute("aria-orientation") === "vertical";

    var panels = tabs.map(function (t) {
      var id = t.getAttribute("aria-controls");
      return id ? document.getElementById(id) : null;
    });

    function select(i, focus) {
      tabs.forEach(function (t, n) {
        var on = n === i;
        t.setAttribute("aria-selected", on ? "true" : "false");
        t.tabIndex = on ? 0 : -1;
        if (panels[n]) panels[n].hidden = !on;
      });
      if (focus && tabs[i]) tabs[i].focus();
    }

    var start = tabs.findIndex(function (t) { return t.getAttribute("aria-selected") === "true"; });
    select(start < 0 ? 0 : start, false);

    list.addEventListener("click", function (e) {
      var tab = e.target.closest('[role="tab"]');
      if (tab) select(tabs.indexOf(tab), true);
    });

    list.addEventListener("keydown", function (e) {
      var i = tabs.indexOf(document.activeElement);
      if (i < 0) return;
      var prev = vertical ? "ArrowUp" : "ArrowLeft";
      var next = vertical ? "ArrowDown" : "ArrowRight";
      var to = null;
      if (e.key === prev) to = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === next) to = (i + 1) % tabs.length;
      else if (e.key === "Home") to = 0;
      else if (e.key === "End") to = tabs.length - 1;
      if (to === null) return;
      e.preventDefault();
      select(to, true);
    });
  }

  [].forEach.call(document.querySelectorAll('[role="tablist"]'), wire);
})();
