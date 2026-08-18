/* Namaste UI — theme bootstrap. MUST run BLOCKING in <head>, before any
   stylesheet or body content.
   =========================================================================
   The problem this solves: the page paints once before your JavaScript runs.
   If the theme is applied after hydration, a dark-mode user sees a white
   flash on every single navigation. It is the most-reported bug in every
   design system that ships dark mode, and it has exactly one fix — set the
   attribute synchronously, in the head, before first paint.

   That means this file must be INLINED, not linked. A <script src> is
   fetched asynchronously and paints too late.

   Ghost — in default.hbs, inside <head>, before {{ghost_head}}:
     <script>{{! paste this file's contents }}</script>

   Next.js — in app/layout.js, inside <head>:
     <script dangerouslySetInnerHTML={{ __html: themeInit }} />
   where themeInit is this file read at build time.

   Both products must use the SAME storage key, or a reader who switches
   between the marketing site and the app gets a different theme on each. */
(function () {
  var STORAGE_KEY = "ns-theme"; // shared by the Ghost theme and the Next.js LMS
  var root = document.documentElement;

  var stored = null;
  try {
    stored = localStorage.getItem(STORAGE_KEY);
  } catch (e) {
    /* Safari in private mode and embedded webviews throw on localStorage
       access rather than returning null. Swallow it: the OS preference below
       is a perfectly good fallback, and a theme script must never be the
       thing that breaks the page. */
  }

  /* Explicit choice wins over the OS preference. "system" is stored as the
     absence of a value so that a user who has never chosen keeps following
     their OS when they change it. */
  var theme = stored === "light" || stored === "dark"
    ? stored
    : (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

  root.setAttribute("data-theme", theme);
  /* Tells the browser to render form controls, scrollbars and the canvas in
     the matching mode. Without it a dark page still gets a white scrollbar
     and white native selects on first paint. */
  root.style.colorScheme = theme;

  /* Follow the OS live, but only while the user has made no explicit choice. */
  if (window.matchMedia) {
    var mq = window.matchMedia("(prefers-color-scheme: dark)");
    var onChange = function (e) {
      var current = null;
      try { current = localStorage.getItem(STORAGE_KEY); } catch (err) {}
      if (current === "light" || current === "dark") return;
      var next = e.matches ? "dark" : "light";
      root.setAttribute("data-theme", next);
      root.style.colorScheme = next;
    };
    // addListener is the pre-2020 Safari spelling; still needed for iOS 13.
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else if (mq.addListener) mq.addListener(onChange);
  }

  /* Exposed so the toggle component — in either product — flips the theme
     through one implementation rather than two that drift apart. */
  window.nsTheme = {
    key: STORAGE_KEY,
    get: function () { return root.getAttribute("data-theme"); },
    set: function (next) {
      root.setAttribute("data-theme", next);
      root.style.colorScheme = next;
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) {}
    },
    toggle: function () {
      window.nsTheme.set(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
    },
    /* Clear the explicit choice and fall back to the OS preference. */
    useSystem: function () {
      try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
      var next = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      root.setAttribute("data-theme", next);
      root.style.colorScheme = next;
    },
  };

})();
