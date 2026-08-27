/* NS Design System — site-wide search.
   =========================================================================
   A command palette over preview/search.json: every styleguide page, every
   full-page template, and every documented component including the classes
   it defines — because "where is .ns-btn--ghost" is the question people
   actually arrive with.

   NO DEPENDENCY AND NO INDEX FORMAT. A few hundred rows filtered with
   `includes` is instant at this size, and a design system that shipped a
   search bundle bigger than its own stylesheet would have lost the plot.

   The dialog is a real <dialog>, so the backdrop, Escape, focus trapping
   and inertness of the page behind all come from the platform. What is left
   is: fetch once, filter, and move a highlight with the arrow keys.

   Degrades honestly. No JS → the trigger button is not rendered at all, so
   nothing on the page promises a search that cannot run. Fetch fails → the
   dialog says so rather than showing an empty list that looks like "no
   results". */
(() => {
  "use strict";

  const BASE = document.documentElement.dataset.nsBase ?? "";
  let rows = null;
  let active = 0;
  let results = [];

  /* ---- the dialog, built once, lazily ---------------------------------- */
  let dlg, input, list, status;

  function build() {
    dlg = document.createElement("dialog");
    dlg.className = "ns-palette";
    dlg.innerHTML = `
      <form class="ns-palette__box" method="dialog">
        <div class="ns-palette__field">
          <i class="ph ph-magnifying-glass" aria-hidden="true"></i>
          <input class="ns-palette__input" type="search" placeholder="Search components, tokens, templates, classes…"
                 aria-label="Search the design system" autocomplete="off" spellcheck="false">
          <kbd class="ns-kbd">Esc</kbd>
        </div>
        <div class="ns-palette__status" role="status" aria-live="polite"></div>
        <ul class="ns-palette__list" role="listbox" aria-label="Results"></ul>
      </form>`;
    document.body.appendChild(dlg);
    input = dlg.querySelector(".ns-palette__input");
    list = dlg.querySelector(".ns-palette__list");
    status = dlg.querySelector(".ns-palette__status");

    input.addEventListener("input", () => { active = 0; render(input.value); });
    input.addEventListener("keydown", onKey);
    /* Clicking the backdrop closes it. The dialog element is the backdrop —
       a click whose target IS the dialog landed outside the box. */
    dlg.addEventListener("click", (e) => { if (e.target === dlg) dlg.close(); });
  }

  function onKey(e) {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (!results.length) return;
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length;
      paint();
    } else if (e.key === "Enter") {
      e.preventDefault();
      const hit = results[active];
      if (hit) location.href = BASE + hit.u;
    }
  }

  /* ---- filtering -------------------------------------------------------
     Scored, but only just: a title match beats a body match, and an exact
     prefix beats a match in the middle. Anything more elaborate would be
     guessing at intent on a corpus of 237 rows. */
  function score(row, q) {
    const t = row.t.toLowerCase();
    if (t === q) return 0;
    if (t.startsWith(q)) return 1;
    if (t.includes(q)) return 2;
    const x = (row.x || "").toLowerCase();
    /* A WHOLE-WORD keyword match beats a substring, and the difference is
       not academic: "links" appears inside `.ns-topnav__links` on four
       navigation components and as its own word only on the Link page
       template — which is the page somebody typing "links" wants. Without
       the distinction every one of them ties and array order decides. */
    if (x.split(/[\s.]+/).includes(q)) return 2.5;
    if (x.includes(q)) return 3;
    if ((row.d || "").toLowerCase().includes(q)) return 4;
    return -1;
  }

  function render(query) {
    const q = query.trim().toLowerCase();
    if (!rows) { status.textContent = "Loading…"; list.innerHTML = ""; return; }
    if (!q) {
      results = rows.filter((r) => r.k === "Template").slice(0, 8);
      status.textContent = "Full-page templates — start typing to search everything";
      return paint();
    }
    results = rows
      .map((r) => ({ r, s: score(r, q) }))
      .filter((x) => x.s >= 0)
      .sort((a, b) => a.s - b.s)
      .slice(0, 40)
      .map((x) => x.r);
    status.textContent = results.length ? `${results.length} result${results.length === 1 ? "" : "s"}` : `Nothing matches “${query.trim()}”`;
    paint();
  }

  function paint() {
    list.innerHTML = results.map((r, i) => `
      <li>
        <a class="ns-palette__hit" href="${BASE}${r.u}" role="option" aria-selected="${i === active}" data-i="${i}">
          <span class="ns-palette__kind">${r.k}</span>
          <span class="ns-palette__t">${r.t}</span>
          <span class="ns-palette__d">${(r.d || "").slice(0, 90)}</span>
        </a>
      </li>`).join("");
    const on = list.querySelector('[aria-selected="true"]');
    if (on) on.scrollIntoView({ block: "nearest" });
  }

  async function load() {
    if (rows) return;
    try {
      const res = await fetch(BASE + "search.json");
      rows = await res.json();
    } catch {
      rows = [];
      /* Say what happened. An empty list here would read as "no results",
         which is a different and much more confusing statement. */
      status.textContent = "Search index could not be loaded.";
      return;
    }
    render(input.value);
  }

  function open() {
    if (!dlg) build();
    dlg.showModal();
    input.value = "";
    active = 0;
    render("");
    load();
    input.focus();
  }

  /* ---- triggers --------------------------------------------------------
     The button is created by script rather than sitting in the markup, so a
     page with JS off never shows a control that cannot work. */
  for (const slot of document.querySelectorAll("[data-ns-search]")) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "ns-searchbtn";
    btn.innerHTML = `<i class="ph ph-magnifying-glass" aria-hidden="true"></i><span>Search</span><kbd class="ns-kbd">/</kbd>`;
    btn.addEventListener("click", open);
    slot.appendChild(btn);
  }

  document.addEventListener("keydown", (e) => {
    const typing = /^(INPUT|TEXTAREA|SELECT)$/.test(e.target.tagName) || e.target.isContentEditable;
    if (typing) return;
    if (e.key === "/" || ((e.metaKey || e.ctrlKey) && e.key === "k")) { e.preventDefault(); open(); }
  });
})();
