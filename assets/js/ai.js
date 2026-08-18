/* NS Design System — AI assistant surface.
   =========================================================================
   The behaviour the assistant screen needs on any stack, over the markup in
   templates/ai-chat.html. In the Next.js LMS this lives in the React
   components; here it is vanilla JS over the same classes, so the styleguide
   demo is a working screen rather than a screenshot — and so the Ghost side
   gets the same conveniences without a framework.

   What it does, and why each one is here rather than in the app:

     - The rail toggle. One attribute flip on .ns-ai (data-collapsed) plus
       aria-expanded on the trigger, because the collapse is CSS and the
       announced state must not drift from it.
     - Enter sends, Shift+Enter breaks. Stated on the composer, and wrong
       either way round: a chat where Enter inserts a newline strands people
       who never find the button, and one where Shift+Enter sends posts half
       a question to a class.
     - The character count, with the near/over states the CSS styles.
     - Send: appends the student's turn, a thinking turn, then a canned
       answer. The canned reply is DEMO ONLY — the real one streams from the
       assistant endpoint. Everything else here is production behaviour.
     - Autoscroll that respects a reader who has scrolled UP. Yanking someone
       back to the bottom while they are re-reading the code block above is
       the single most-hated behaviour in every chat UI.

   Progressive: with no JS the transcript still renders, the composer is a
   real form and the rail is open. Nothing here hides content. */
(function () {
  var root = document.querySelector("[data-ai]");
  if (!root) return;

  var scroller = root.querySelector("[data-ai-scroll]");
  var composer = root.querySelector("[data-ai-composer]");
  var input = root.querySelector("[data-ai-input]");
  var count = root.querySelector("[data-ai-count]");
  var MAX = 4000;

  /* --- Rail --------------------------------------------------------------
     Below lg the rail is an overlay, so opening it should also be closable
     with Escape — a sheet you can only dismiss by finding a small button is
     a trap on a phone. */
  var toggle = root.querySelector("[data-ai-toggle]");
  function setRail(open) {
    root.setAttribute("data-collapsed", open ? "false" : "true");
    if (toggle) toggle.setAttribute("aria-expanded", open ? "true" : "false");
  }
  if (toggle) {
    toggle.addEventListener("click", function () {
      setRail(root.getAttribute("data-collapsed") === "true");
    });
  }
  document.addEventListener("keydown", function (e) {
    if (e.key !== "Escape") return;
    if (window.matchMedia("(max-width: 63.999rem)").matches) setRail(false);
  });

  /* --- Scrolling ----------------------------------------------------------
     "Near the bottom" is a 64px tolerance, not equality: a scroll position is
     fractional on a trackpad and an exact comparison is false almost always. */
  function nearBottom() {
    if (!scroller) return true;
    return scroller.scrollHeight - scroller.scrollTop - scroller.clientHeight < 64;
  }
  function toBottom(force) {
    if (!scroller) return;
    if (!force && !nearBottom()) return;
    scroller.scrollTop = scroller.scrollHeight;
  }

  /* --- Composer ----------------------------------------------------------- */
  function updateCount() {
    if (!count || !input) return;
    var n = input.value.length;
    count.textContent = n + " / " + MAX;
    count.setAttribute("data-state", n > MAX ? "over" : n > MAX * 0.9 ? "near" : "ok");
  }

  if (input) {
    input.addEventListener("input", updateCount);
    input.addEventListener("keydown", function (e) {
      if (e.key !== "Enter" || e.shiftKey) return;
      e.preventDefault();
      if (composer) composer.requestSubmit ? composer.requestSubmit() : send();
    });
    updateCount();
  }

  /* Starter prompts fill the composer rather than sending immediately — the
     student almost always wants to edit one word of it first, and a click
     that fires a question they did not finish reading is a wasted turn. */
  root.querySelectorAll(".ns-aisuggest__item").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!input || btn.disabled) return;
      var text = btn.querySelector(".ns-aisuggest__text");
      input.value = text ? text.textContent.trim() : "";
      input.focus();
      updateCount();
    });
  });

  /* Context and attachment chips are removable in place. The X inside a
     .ns-aifile is a real button, so this is one delegated listener rather
     than one per chip — chips arrive after upload. */
  root.addEventListener("click", function (e) {
    var x = e.target.closest(".ns-aicontext__x, .ns-aifile .ns-btn");
    if (!x) return;
    var chip = x.closest(".ns-aicontext, .ns-aifile");
    if (chip) chip.remove();
  });

  /* --- Sending ------------------------------------------------------------
     DEMO ONLY below this line. In product the turn is appended the same way
     and the assistant's body is filled from a stream. */
  var el = function (html) {
    var d = document.createElement("div");
    d.innerHTML = html.trim();
    return d.firstElementChild;
  };
  var esc = function (s) {
    return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  };
  var clock = function () {
    var d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  };

  var inner = root.querySelector(".ns-ai__inner");
  var turn = 0;

  function send() {
    if (!input || !inner) return;
    var text = input.value.trim();
    if (!text) return;

    /* An empty state, if one is showing, is replaced by the conversation it
       was inviting. */
    var welcome = inner.querySelector(".ns-aiwelcome");
    if (welcome) welcome.remove();

    inner.appendChild(el(
      '<article class="ns-aiturn ns-aiturn--user">' +
        '<header class="ns-aiturn__head"><span class="ns-avatar ns-avatar--sm" aria-hidden="true">RS</span>You' +
        '<time>' + clock() + '</time></header>' +
        '<div class="ns-aiturn__body"><p>' + esc(text) + '</p></div>' +
      '</article>'
    ));
    input.value = "";
    updateCount();
    toBottom(true);

    /* The wait is a real turn in the transcript with aria-live on it, so a
       screen-reader user is told the assistant is working instead of sitting
       in a silent pause wondering whether the send failed. */
    var pending = el(
      '<article class="ns-aiturn ns-aiturn--agent" data-state="thinking">' +
        '<header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant</header>' +
        '<p class="ns-aithinking" role="status" aria-live="polite">' +
          '<span class="ns-aithinking__dots" aria-hidden="true"><i></i><i></i><i></i></span>Reading your progress</p>' +
      '</article>'
    );
    inner.appendChild(pending);
    toBottom(true);

    var label = pending.querySelector(".ns-aithinking");
    var stages = ["Reading your progress", "Searching the catalog", "Writing the answer"];
    var i = 0;
    var tick = setInterval(function () {
      i++;
      if (i >= stages.length || !label) return clearInterval(tick);
      label.lastChild.textContent = stages[i];
    }, 700);

    setTimeout(function () {
      clearInterval(tick);
      pending.setAttribute("data-state", "done");
      pending.innerHTML =
        '<header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant' +
        '<time>' + clock() + '</time></header>' +
        '<p><span class="ns-aitool" data-state="done"><i class="ph ph-check" aria-hidden="true"></i>Searched catalog<span class="ns-aitool__count">4</span></span> ' +
        '<span class="ns-aitool" data-state="done"><i class="ph ph-check" aria-hidden="true"></i>Read your progress</span></p>' +
        '<div class="ns-aiturn__body"><p>Here is the short version, then the lesson that covers it properly. ' +
        'This is a canned reply in the styleguide demo — in the product it streams from the assistant, ' +
        'with the same turn, the same tool chips and the same sources.</p></div>' +
        '<div class="ns-aisource"><span class="ns-aisource__label">Sources</span>' +
        '<a class="ns-aisource__item" href="#0"><span class="ns-aisource__num">1</span> Apex basics · lesson 09</a></div>' +
        '<div class="ns-aiattach">' +
          '<div class="ns-card ns-ccard ns-ccard--compact"><div class="ns-card__body">' +
          '<span class="ns-card__kicker">// Course</span>' +
          '<a class="ns-card__link" href="#0"><span class="ns-card__title">Bulk-safe Apex patterns</span></a>' +
          '<span class="ns-ccard__meta"><span>9 lessons</span><span>2h 10m</span></span></div></div>' +
        '</div>' +
        '<footer class="ns-aiturn__actions">' +
          '<button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Copy answer"><i class="ph ph-copy" aria-hidden="true"></i></button>' +
          '<button type="button" class="ns-btn ns-btn--quiet ns-btn--icon ns-btn--sm" aria-label="Regenerate answer"><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i></button>' +
        '</footer>';
      toBottom();

      /* Every third demo answer fails, because a screen whose error state is
         only ever seen in a doc page is a screen whose error state is wrong. */
      turn++;
      if (turn % 3 === 0) {
        inner.appendChild(el(
          '<article class="ns-aiturn ns-aiturn--agent" data-state="error">' +
            '<header class="ns-aiturn__head"><span class="ns-aiturn__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>Assistant' +
            '<time>' + clock() + '</time></header>' +
            '<div class="ns-aierror" role="alert">' +
              '<p class="ns-aierror__head"><i class="ph ph-warning-circle" aria-hidden="true"></i> Could not reach the catalog</p>' +
              '<p class="ns-aierror__text">Nothing you typed was lost. Try again, or ask without the course lookup.</p>' +
              '<div class="ns-aierror__actions">' +
                '<button type="button" class="ns-btn ns-btn--outline ns-btn--sm"><i class="ph ph-arrow-counter-clockwise" aria-hidden="true"></i> Try again</button>' +
                '<span class="ns-aierror__code">ERR_TOOL_TIMEOUT · ' + clock() + '</span>' +
              '</div>' +
            '</div>' +
          '</article>'
        ));
        toBottom();
      }
    }, 2200);
  }

  if (composer) {
    composer.addEventListener("submit", function (e) {
      e.preventDefault();
      send();
    });
  }

  /* New chat clears the transcript back to the empty state — the starters
     are the capability list, so a fresh chat should show them again. */
  var fresh = root.querySelector("[data-ai-new]");
  if (fresh && inner) {
    var STARTERS = [
      ["book-open-text", "Explain", "What is the difference between a workflow rule and a record-triggered flow?"],
      ["code", "Review", "Here is my trigger — why does it fail on a 200-record load?"],
      ["flag-banner-fold", "Plan", "Give me a six-week route to Platform Developer I."],
      ["briefcase", "Career", "What should a junior admin have on their resume?"],
    ];
    fresh.addEventListener("click", function () {
      inner.innerHTML =
        '<div class="ns-aiwelcome">' +
          '<span class="ns-aiwelcome__mark" aria-hidden="true"><i class="ph ph-sparkle"></i></span>' +
          '<div><h1 class="ns-aiwelcome__title">What are we working on?</h1>' +
          '<p class="ns-aiwelcome__lede">Ask about a lesson, paste code that will not deploy, or get a route to your next certification.</p></div>' +
          '<div class="ns-aisuggest">' + STARTERS.map(function (s) {
            return '<button type="button" class="ns-aisuggest__item">' +
              '<span class="ns-aisuggest__kicker"><i class="ph ph-' + s[0] + '" aria-hidden="true"></i>' + s[1] + '</span>' +
              '<span class="ns-aisuggest__text">' + s[2] + '</span></button>';
          }).join("") + '</div>' +
        '</div>';
      /* Re-wire the new starters — they are new nodes, and the listener
         above was bound to the ones that just went away. */
      inner.querySelectorAll(".ns-aisuggest__item").forEach(function (btn) {
        btn.addEventListener("click", function () {
          if (!input) return;
          input.value = btn.querySelector(".ns-aisuggest__text").textContent.trim();
          input.focus();
          updateCount();
        });
      });
      if (input) input.focus();
    });
  }
})();
