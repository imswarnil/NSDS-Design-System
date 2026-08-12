/* Namaste UI — navbar behaviour.
   =========================================================================
   The progressive-enhancement half of components/css/navbar.css. Everything
   VISUAL is already handled by CSS reading aria-expanded / aria-checked /
   data-scrolled through :has(). This file's entire job is to put the right
   value in those attributes, plus the keyboard behaviour the WAI-ARIA
   disclosure pattern requires and markup alone cannot express.

   That division matters: it means a menu is never half-open because a class
   and an attribute disagreed, and the Next.js app can skip this file
   entirely — components/navigation/Navbar.jsx sets the same attributes from
   React state and gets the same CSS for free.

   Drop-in for the Ghost theme:
     <script src="{{asset "js/nav.js"}}" defer></script>

   Nothing here is required for the bar to WORK — with JS off the links,
   the brand and the buttons are all still real links and buttons, the
   dropdowns simply do not open, and every destination in them is also
   reachable from the footer sitemap. That is the deal: JS makes it nicer,
   never possible.

   Hooks it looks for:
     [data-ns-menu]        a <button aria-expanded aria-controls> inside a
                           .ns-navitem / .ns-usermenu wrapper
     [data-ns-sheet="id"]  the hamburger; toggles <dialog id> (.ns-navsheet)
     [data-ns-theme]       the segmented theme radiogroup
     [data-ns-theme-toggle] the one-button theme switch
     [data-ns-scrolled]    a bar that goes solid once the page moves
     [data-ns-progress]    the reading-progress line, gets --p */
(function () {
  "use strict";

  var doc = document;
  var ITEM = ".ns-navmenu__item, .ns-menu__item";

  /* ---- Disclosure menus (dropdown, mega, account) ---------------------- */

  /* One place that writes the state, so "open" is a single fact. */
  function setOpen(trigger, open) {
    trigger.setAttribute("aria-expanded", String(open));
  }

  function panelOf(trigger) {
    var id = trigger.getAttribute("aria-controls");
    return id ? doc.getElementById(id) : trigger.parentElement.querySelector(".ns-navmenu, .ns-megamenu, .ns-usermenu__panel");
  }

  function closeAll(except) {
    doc.querySelectorAll('[data-ns-menu][aria-expanded="true"]').forEach(function (t) {
      if (t !== except) setOpen(t, false);
    });
  }

  doc.addEventListener("click", function (e) {
    var trigger = e.target.closest("[data-ns-menu]");
    if (!trigger) {
      /* Outside click closes everything. A click INSIDE a panel also closes
         it — every row in these menus navigates, and leaving the panel open
         over the new page is the classic "did my click register?" bug. */
      var inPanel = e.target.closest(".ns-navmenu, .ns-megamenu, .ns-usermenu__panel");
      if (!inPanel || e.target.closest(ITEM)) closeAll();
      return;
    }
    e.preventDefault();
    var open = trigger.getAttribute("aria-expanded") === "true";
    closeAll(trigger);
    setOpen(trigger, !open);
  });

  doc.addEventListener("keydown", function (e) {
    var open = doc.querySelector('[data-ns-menu][aria-expanded="true"]');

    if (e.key === "Escape" && open) {
      setOpen(open, false);
      /* Focus MUST come back to the trigger. Without this, Esc drops the
         keyboard user at the top of the document and they have to tab the
         whole bar again. */
      open.focus();
      return;
    }

    var trigger = e.target.closest && e.target.closest("[data-ns-menu]");
    if (trigger && (e.key === "ArrowDown" || e.key === "Enter" || e.key === " ")) {
      /* ArrowDown opens and moves into the panel — the disclosure pattern's
         one keyboard affordance beyond Enter. */
      if (e.key === "ArrowDown") {
        e.preventDefault();
        closeAll(trigger);
        setOpen(trigger, true);
        var panel = panelOf(trigger);
        var first = panel && panel.querySelector(ITEM);
        if (first) first.focus();
      }
      return;
    }

    /* Arrow keys walk the rows once inside a panel. */
    if (!open || (e.key !== "ArrowDown" && e.key !== "ArrowUp")) return;
    var host = panelOf(open);
    if (!host || !host.contains(e.target)) return;
    var rows = Array.prototype.slice.call(host.querySelectorAll(ITEM));
    var i = rows.indexOf(e.target);
    if (i < 0) return;
    e.preventDefault();
    rows[(i + (e.key === "ArrowDown" ? 1 : -1) + rows.length) % rows.length].focus();
  });

  /* Tabbing past the last row closes the menu, because the panel is
     visually gone the moment focus leaves it and a menu that is open but
     invisible steals the next Esc. */
  doc.addEventListener("focusout", function (e) {
    var wrap = e.target.closest && e.target.closest(".ns-navitem, .ns-usermenu");
    if (!wrap) return;
    /* relatedTarget is where focus is GOING; null means it left the page. */
    if (e.relatedTarget && wrap.contains(e.relatedTarget)) return;
    var trigger = wrap.querySelector("[data-ns-menu]");
    if (trigger) setOpen(trigger, false);
  });

  /* ---- Mobile sheet ----------------------------------------------------- */

  doc.querySelectorAll("[data-ns-sheet]").forEach(function (burger) {
    var sheet = doc.getElementById(burger.getAttribute("data-ns-sheet"));
    if (!sheet) return;

    burger.addEventListener("click", function () {
      if (sheet.open) { sheet.close(); return; }
      closeAll();
      /* showModal(), never a class or the open attribute: it is what grants
         the focus trap, the inert background and the top layer. */
      sheet.showModal();
      burger.setAttribute("aria-expanded", "true");
      /* The page behind must not scroll under the sheet. */
      doc.documentElement.style.overflow = "hidden";
    });

    /* One handler for every way it can close — Esc, the X, the backdrop,
       a link — so the burger's arrow can never be left pointing the wrong
       way. */
    sheet.addEventListener("close", function () {
      burger.setAttribute("aria-expanded", "false");
      doc.documentElement.style.overflow = "";
      burger.focus();
    });
    sheet.addEventListener("click", function (e) {
      if (e.target === sheet) sheet.close();           // backdrop
      if (e.target.closest("a[href]") || e.target.closest("[data-ns-sheet-close]")) sheet.close();
    });
  });

  /* Resizing past lg hides the burger, so a sheet left open would be a
     full-screen dialog with no visible way back. Close it instead of hiding
     it: a display:none'd modal still traps focus. */
  if (doc.querySelector(".ns-navsheet[open]") || doc.querySelector("[data-ns-sheet]")) {
    window.addEventListener("resize", function () {
      if (window.innerWidth < 1024) return;
      doc.querySelectorAll(".ns-navsheet[open]").forEach(function (sheet) { sheet.close(); });
    });
  }

  /* ---- Theme ------------------------------------------------------------
     Both forms delegate to window.nsTheme (assets/js/theme-init.js) so
     persistence and color-scheme are decided in exactly one place. If the
     init script was not inlined, the toggles still flip the attribute —
     they just cannot remember, which is a better failure than a dead
     button. */

  function currentChoice() {
    /* "system" is stored as the ABSENCE of a value, so that a reader who
       never chose keeps following their OS. */
    try {
      var stored = localStorage.getItem((window.nsTheme && window.nsTheme.key) || "ns-theme");
      return stored === "light" || stored === "dark" ? stored : "system";
    } catch (e) { return "system"; }
  }

  var groups = doc.querySelectorAll("[data-ns-theme]");
  var singles = doc.querySelectorAll("[data-ns-theme-toggle]");

  function syncTheme() {
    var choice = currentChoice();
    groups.forEach(function (group) {
      group.querySelectorAll("[data-ns-theme-value]").forEach(function (opt) {
        opt.setAttribute("aria-checked", String(opt.getAttribute("data-ns-theme-value") === choice));
        /* Roving tabindex: the group is one tab stop, arrows move inside. */
        opt.tabIndex = opt.getAttribute("data-ns-theme-value") === choice ? 0 : -1;
      });
    });
    var dark = doc.documentElement.getAttribute("data-theme") === "dark";
    singles.forEach(function (btn) { btn.setAttribute("aria-checked", String(dark)); });
  }

  groups.forEach(function (group) {
    group.addEventListener("click", function (e) {
      var opt = e.target.closest("[data-ns-theme-value]");
      if (!opt) return;
      var value = opt.getAttribute("data-ns-theme-value");
      if (!window.nsTheme) { doc.documentElement.setAttribute("data-theme", value === "system" ? "light" : value); syncTheme(); return; }
      if (value === "system") window.nsTheme.useSystem();
      else window.nsTheme.set(value);
      syncTheme();
    });
    group.addEventListener("keydown", function (e) {
      if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
      var opts = Array.prototype.slice.call(group.querySelectorAll("[data-ns-theme-value]"));
      var i = opts.indexOf(doc.activeElement);
      if (i < 0) return;
      e.preventDefault();
      var next = opts[(i + (e.key === "ArrowRight" ? 1 : -1) + opts.length) % opts.length];
      next.focus();
      next.click();
    });
  });

  singles.forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (window.nsTheme) window.nsTheme.toggle();
      else doc.documentElement.setAttribute("data-theme", doc.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark");
    });
  });

  if (groups.length || singles.length) {
    syncTheme();
    /* The OS can flip underneath us (macOS at sunset) and theme-init.js
       updates the attribute when it does; this keeps the controls honest. */
    new MutationObserver(syncTheme).observe(doc.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  }

  /* ---- Scroll state & reading progress ---------------------------------
     One listener for both, passive, and it only ever writes when the value
     actually changed — a scroll handler that touches the DOM on every frame
     is how a calm page starts to feel expensive. */
  var scrollBars = doc.querySelectorAll("[data-ns-scrolled]");
  var progressBars = doc.querySelectorAll("[data-ns-progress]");

  if (scrollBars.length || progressBars.length) {
    var lastScrolled = null;
    var lastPercent = -1;
    var ticking = false;

    var measure = function () {
      ticking = false;
      var y = window.scrollY || 0;

      var scrolled = y > 8;
      if (scrolled !== lastScrolled) {
        lastScrolled = scrolled;
        scrollBars.forEach(function (bar) { bar.setAttribute("data-scrolled", String(scrolled)); });
      }

      if (progressBars.length) {
        var max = doc.documentElement.scrollHeight - window.innerHeight;
        var pct = max > 0 ? Math.min(100, Math.round((y / max) * 100)) : 0;
        if (pct !== lastPercent) {
          lastPercent = pct;
          progressBars.forEach(function (bar) {
            bar.style.setProperty("--p", pct);
            /* The bar is decorative chrome, but the number is real
               information — expose it once, on the element that has it. */
            if (bar.hasAttribute("aria-valuenow")) bar.setAttribute("aria-valuenow", String(pct));
          });
        }
      }
    };

    window.addEventListener("scroll", function () {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    }, { passive: true });
    measure();
  }
})();
