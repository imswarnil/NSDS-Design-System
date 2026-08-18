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

    /* Collapse to the section holding the current page.
       When the current page is NOT inside a section — the foundations links at
       the top of the docs rail — every section closes, which is the same
       promise kept: exactly the part of the tree you are in is open, and
       nothing else. Scoped to the docs rail, because a curriculum whose
       current lesson somehow sits outside a module must not collapse to
       nothing; there the old behaviour (leave it alone) is the safe one. */
    if (sections.length && (active || rail.hasAttribute("data-ns-rail"))) {
      sections.forEach(function (s) { s.open = s === active; });
    }

    /* User intent is a CLICK on a summary — never the `toggle` event.
       <details> queues `toggle` asynchronously, so the collapse above fires
       one per section AFTER this task and BEFORE the rAF below. Reading those
       as "the reader opened something" is what silently disabled the
       scroll-into-view on every page for the entire life of this file: the
       rail collapsed correctly and then never moved. A programmatic .open
       cannot produce a click, so this cannot make the same mistake. */
    var userDriven = false;
    sections.forEach(function (s) {
      var summary = s.querySelector("summary");
      if (summary) summary.addEventListener("click", function () { userDriven = true; });
    });

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
    function centre() {
      if (userDriven) return;
      var boxRect = scroller.getBoundingClientRect();
      var linkRect = current.getBoundingClientRect();
      if (linkRect.top >= boxRect.top && linkRect.bottom <= boxRect.bottom) return;
      /* Centre it: context above and below is what makes a long list
         navigable. Landing it flush at the top hides everything before it. */
      scroller.scrollTop += (linkRect.top - boxRect.top) - (boxRect.height / 2) + (linkRect.height / 2);
    }

    /* Synchronously, NOT in a requestAnimationFrame. Reading
       getBoundingClientRect above flushes layout, so the geometry is already
       correct the moment the sections have been collapsed — and rAF does not
       fire at all in a background tab, so a styleguide page opened with
       cmd-click used to load with its rail parked at the top until something
       else forced a frame. Doing the work synchronously means the rail is
       already in the right place in the first painted frame, on every tab. */
    centre();

    /* Then once more after the first frame. Switzer and Roboto Mono load with
       font-display: swap, and a swap above the active link changes every
       offset below it — this is the pass that catches that. Harmless when
       nothing moved (the in-view test above short-circuits), and it cannot
       fight the reader: a summary click sets userDriven, and no human clicks
       inside the 16ms before it runs. */
    requestAnimationFrame(centre);
  });
})();
