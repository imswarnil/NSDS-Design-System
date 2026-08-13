/* NS Design System — code block wiring.
   =========================================================================
   Everything .ns-code needs that CSS cannot do, and nothing else. Delegated
   from the document, so blocks rendered after load (a lesson body, a docs
   route change) work with no re-init.

   Deliberately NOT here:
   - The Ask AI and Share menus. They are native popovers — popovertarget
     gives light-dismiss, Esc and top-layer placement for free, and every
     line of JS that reimplements that is a focus-trap bug waiting to happen.
   - Syntax highlighting. The markup arrives already tokenised (server-side,
     or by the React component). Highlighting on the client means shipping a
     grammar to every reader to re-derive something the build already knew.

   Include with: <script src="assets/js/code.js" defer></script> */
(function () {
  "use strict";

  var doc = document;

  /* The source of truth for "what is in this block" is the rendered text, not
     a data attribute — a copy button that copies a stale attribute instead of
     what is on screen is worse than no copy button. Line numbers live in a
     separate aria-hidden gutter, so they cannot end up in the clipboard. */
  function sourceOf(block) {
    var pre = block.querySelector(".ns-code__pre");
    return pre ? pre.innerText.replace(/\n$/, "") : "";
  }

  function flash(btn, ms) {
    btn.setAttribute("data-copied", "true");
    window.setTimeout(function () { btn.removeAttribute("data-copied"); }, ms || 1600);
  }

  function copy(text, btn) {
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () { flash(btn); });
      return;
    }
    /* http:// and older Safari. A hidden textarea + execCommand is the only
       fallback that still works, and it has to be visible-ish to be
       selectable, hence the off-screen position rather than display:none. */
    var ta = doc.createElement("textarea");
    ta.value = text;
    ta.setAttribute("readonly", "");
    ta.style.cssText = "position:fixed;top:-9999px;opacity:0";
    doc.body.appendChild(ta);
    ta.select();
    try { doc.execCommand("copy"); flash(btn); } catch (e) { /* nothing sane left to try */ }
    doc.body.removeChild(ta);
  }

  doc.addEventListener("click", function (e) {
    var el = e.target.closest ? e.target.closest("[data-code]") : null;
    if (!el) return;
    var block = el.closest(".ns-code");
    if (!block) return;
    var action = el.getAttribute("data-code");

    if (action === "copy") {
      copy(sourceOf(block), el);
      return;
    }

    if (action === "wrap") {
      var wrapped = block.getAttribute("data-wrap") === "true";
      block.setAttribute("data-wrap", wrapped ? "false" : "true");
      el.setAttribute("aria-pressed", wrapped ? "false" : "true");
      return;
    }

    if (action === "expand") {
      var collapsed = block.getAttribute("data-collapsed") === "true";
      block.setAttribute("data-collapsed", collapsed ? "false" : "true");
      el.setAttribute("aria-expanded", collapsed ? "true" : "false");
      var label = el.querySelector("[data-code-label]");
      if (label) label.textContent = collapsed ? "Collapse" : "Expand";
      return;
    }

    if (action === "run") {
      run(block, el);
      return;
    }

    if (action === "share") {
      var url = el.getAttribute("data-share-url") || window.location.href;
      if (el.getAttribute("data-share") === "native" && navigator.share) {
        navigator.share({ title: doc.title, url: url }).catch(function () {});
      } else {
        copy(url, el);
      }
      var menu = el.closest("[popover]");
      if (menu && menu.hidePopover) menu.hidePopover();
      return;
    }

    if (action === "ask") {
      /* The AI menu items are LINKS in the markup, carrying a real href to
         the chosen assistant with the code prefilled. This branch exists only
         for the in-app case, where the host page listens for the event and
         opens its own panel instead of navigating away. */
      block.dispatchEvent(new CustomEvent("ns:code-ask", {
        bubbles: true,
        detail: { provider: el.getAttribute("data-provider") || "", code: sourceOf(block), language: block.getAttribute("data-lang") || "" },
      }));
      var m = el.closest("[popover]");
      if (m && m.hidePopover) m.hidePopover();
    }
  });

  /* Run is a HOST responsibility — this system does not ship a sandbox, and
     a design system that quietly evaluates the code in its own docs would be
     a remarkable security decision. The button emits an event the product
     handles; the demo path (data-output) just prints a canned result so the
     component can be documented honestly. */
  function run(block, btn) {
    var out = block.querySelector(".ns-code__out");
    var canned = block.getAttribute("data-output");

    btn.setAttribute("data-state", "running");
    block.dispatchEvent(new CustomEvent("ns:code-run", {
      bubbles: true,
      detail: {
        code: sourceOf(block),
        language: block.getAttribute("data-lang") || "",
        /* The host calls this when it has a result. Until it does, the button
           stays in its running state — no fake completion. */
        done: function (result, ok) { finish(block, btn, result, ok !== false); },
      },
    }));

    if (canned !== null && out) {
      window.setTimeout(function () { finish(block, btn, canned, block.getAttribute("data-output-ok") !== "false"); }, 550);
    }
  }

  function finish(block, btn, result, ok) {
    var out = block.querySelector(".ns-code__out");
    btn.removeAttribute("data-state");
    if (!out) return;
    out.hidden = false;
    out.textContent = result == null ? "" : String(result);
    var status = block.querySelector("[data-code-status]");
    if (status) {
      status.innerHTML = '<i class="ph ' + (ok ? "ph-check-circle" : "ph-warning-circle") + '" aria-hidden="true"></i>' + (ok ? "Success" : "Failed");
    }
  }

  /* Tabs — a real tablist, so arrow keys move between files the way they do
     in every other tabbed thing on the page. */
  doc.addEventListener("click", function (e) {
    var tab = e.target.closest ? e.target.closest(".ns-code__tab") : null;
    if (tab) select(tab);
  });

  doc.addEventListener("keydown", function (e) {
    var tab = e.target.closest ? e.target.closest(".ns-code__tab") : null;
    if (!tab) return;
    var keys = { ArrowRight: 1, ArrowLeft: -1, Home: "first", End: "last" };
    if (!(e.key in keys)) return;
    var tabs = Array.prototype.slice.call(tab.parentNode.querySelectorAll(".ns-code__tab"));
    var i = tabs.indexOf(tab);
    var next = keys[e.key] === "first" ? tabs[0]
      : keys[e.key] === "last" ? tabs[tabs.length - 1]
      : tabs[(i + keys[e.key] + tabs.length) % tabs.length];
    e.preventDefault();
    select(next);
    next.focus();
  });

  function select(tab) {
    var strip = tab.parentNode;
    var block = tab.closest(".ns-code");
    if (!block) return;
    Array.prototype.forEach.call(strip.querySelectorAll(".ns-code__tab"), function (t) {
      var on = t === tab;
      t.setAttribute("aria-selected", on ? "true" : "false");
      t.tabIndex = on ? 0 : -1;
    });
    var panelId = tab.getAttribute("aria-controls");
    Array.prototype.forEach.call(block.querySelectorAll("[role='tabpanel']"), function (p) {
      p.hidden = p.id !== panelId;
    });
    var file = block.querySelector(".ns-code__file span");
    if (file) file.textContent = tab.textContent.trim();
  }
})();
