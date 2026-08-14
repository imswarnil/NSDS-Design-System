/* NS Design System — navigation rail.
   =========================================================================
   One job, shared by every long scrolling nav in the system: the training
   curriculum (.ns-trainingnav) and the docs sidebar (.ns-sidebar).

   On load it finds the link marked aria-current="page", opens the <details>
   section containing it, closes the others, and scrolls it into view INSIDE
   THE RAIL. That last part is the whole trick: scrollIntoView on a sticky rail
   scrolls the nearest scrollable ancestor, which is usually the document, so
   the page jumps and the reader loses their place.

   Everything is progressive. The markup ships every section `open`, so with
   JS off nothing is hidden — the rail is only longer. Building it the other
   way round means a JS failure hides the entire navigation.

   And once the reader opens a section themselves we stop managing state. A nav
   that re-collapses what you just opened is a nav that is fighting you. */
(function () {
  var rails = document.querySelectorAll("[data-ns-rail], [data-ns-trainingnav]");
  if (!rails.length) return;

  rails.forEach(function (rail) {
    var current = rail.querySelector('[aria-current="page"]');
    var sections = rail.querySelectorAll("details");
    if (!current) return;

    var active = current.closest("details");
    var userDriven = false;

    if (sections.length && active) {
      sections.forEach(function (s) { s.open = s === active; });
      sections.forEach(function (s) {
        s.addEventListener("toggle", function () { userDriven = true; });
      });
    }

    /* The element carrying [data-ns-rail] is not necessarily the one that
       scrolls — in the styleguide the marker sits on the <nav> while the
       overflow lives on its .side wrapper, so scrolling the nav did precisely
       nothing. Walk up to whatever actually has a scrollbar. */
    var scroller = rail;
    while (scroller && scroller !== document.body) {
      var oy = getComputedStyle(scroller).overflowY;
      if ((oy === "auto" || oy === "scroll") && scroller.scrollHeight > scroller.clientHeight) break;
      scroller = scroller.parentElement;
    }
    if (!scroller || scroller === document.body) return;

    /* Only scroll when the active link is actually out of view — moving a rail
       whose current item was already visible reads as a glitch, not a help. */
    requestAnimationFrame(function () {
      if (userDriven) return;
      var boxRect = scroller.getBoundingClientRect();
      var linkRect = current.getBoundingClientRect();
      if (linkRect.top >= boxRect.top && linkRect.bottom <= boxRect.bottom) return;
      /* Centre it: context above and below is what makes a long list
         navigable. Landing it flush at the top hides everything before it. */
      scroller.scrollTop += (linkRect.top - boxRect.top) - (boxRect.height / 2) + (linkRect.height / 2);
    });
  });
})();
