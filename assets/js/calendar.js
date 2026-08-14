/* NS Design System — date picker.
   =========================================================================
   Replaces the native picker on every device, on any
   .ns-datefield[data-ns-calendar] wrapping an <input type="date">.

   The native control is localised, keyboard-operable and free. Replacing it
   means owning all of that, so this does:

     - Intl for month and weekday names, and for the first day of the week.
       Never a hard-coded ["Sun","Mon",…]: that array is wrong in most of the
       world and silently so.
     - A roving tabindex. Exactly one day is tabbable; arrows move real focus,
       so a screen reader announces the cell it lands on with no live region.
     - A real <table> with <th scope="col">, so the day/column relationship is
       announced instead of implied by position.
     - Esc closes and returns focus to the field. Always, from anywhere inside.

   The input keeps type="date", so the value stays a valid ISO date, form
   submission is unchanged, and if this script never runs the reader gets the
   platform picker back. That is the fallback, and it is a good one. */
(function () {
  var ISO = function (d) {
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  };
  var parse = function (v) {
    var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v || "");
    return m ? new Date(+m[1], +m[2] - 1, +m[3]) : null;
  };
  var same = function (a, b) { return a && b && ISO(a) === ISO(b); };

  /* Intl gives the locale's own first day of week where supported; Sunday is
     the fallback because it is the more common default, not because it is
     right everywhere. */
  function firstDay(locale) {
    try {
      var info = new Intl.Locale(locale).weekInfo || new Intl.Locale(locale).getWeekInfo();
      return info && info.firstDay === 7 ? 0 : (info ? info.firstDay : 0);
    } catch (e) { return 0; }
  }

  function build(field) {
    var input = field.querySelector('input[type="date"]');
    if (!input) return;

    var locale = document.documentElement.lang || navigator.language || "en";
    var fdow = firstDay(locale);
    var monthFmt = new Intl.DateTimeFormat(locale, { month: "long", year: "numeric" });
    var dowFmt = new Intl.DateTimeFormat(locale, { weekday: "short" });
    var fullFmt = new Intl.DateTimeFormat(locale, { weekday: "long", day: "numeric", month: "long", year: "numeric" });

    var pop = document.createElement("div");
    pop.className = "ns-calendar";
    pop.hidden = true;
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", "Choose date");
    field.appendChild(pop);

    var view = parse(input.value) || new Date();
    var focused = parse(input.value) || new Date();

    function render() {
      var y = view.getFullYear(), m = view.getMonth();
      var selected = parse(input.value);
      var today = new Date();
      var start = new Date(y, m, 1);
      start.setDate(1 - ((start.getDay() - fdow + 7) % 7));

      var dows = "";
      for (var i = 0; i < 7; i++) {
        var d = new Date(start.getTime() + i * 864e5);
        dows += '<th class="ns-calendar__dow" scope="col" abbr="' + fullFmt.formatToParts(d).find(function (p) { return p.type === "weekday"; }).value + '">' + dowFmt.format(d) + "</th>";
      }

      var rows = "", cur = new Date(start);
      for (var w = 0; w < 6; w++) {
        var cells = "";
        for (var c = 0; c < 7; c++) {
          var outside = cur.getMonth() !== m;
          cells += '<td><button type="button" class="ns-calendar__day"' +
            ' data-date="' + ISO(cur) + '"' +
            (outside ? " data-outside" : "") +
            (same(cur, today) ? " data-today" : "") +
            ' aria-selected="' + (same(cur, selected) ? "true" : "false") + '"' +
            ' tabindex="' + (same(cur, focused) ? "0" : "-1") + '"' +
            ' aria-label="' + fullFmt.format(cur) + '">' + cur.getDate() + "</button></td>";
          cur = new Date(cur.getTime() + 864e5);
        }
        rows += "<tr>" + cells + "</tr>";
      }

      pop.innerHTML =
        '<div class="ns-calendar__head">' +
          '<button type="button" class="ns-calendar__nav" data-move="-1" aria-label="Previous month"><i class="ph ph-caret-left" aria-hidden="true"></i></button>' +
          '<span class="ns-calendar__month" aria-live="polite">' + monthFmt.format(view) + "</span>" +
          '<button type="button" class="ns-calendar__nav" data-move="1" aria-label="Next month"><i class="ph ph-caret-right" aria-hidden="true"></i></button>' +
        "</div>" +
        '<table class="ns-calendar__grid"><thead><tr>' + dows + "</tr></thead><tbody>" + rows + "</tbody></table>";
    }

    function open() {
      focused = parse(input.value) || new Date();
      view = new Date(focused);
      render();
      pop.hidden = false;
      var f = pop.querySelector('[tabindex="0"]');
      if (f) f.focus();
    }
    function close(returnFocus) {
      if (pop.hidden) return;
      pop.hidden = true;
      if (returnFocus) input.focus();
    }

    /* The native picker must not also open — two pickers for one field is the
       worst possible outcome. showPicker() is suppressed by preventing the
       default on the events that trigger it. */
    input.addEventListener("click", function (e) { e.preventDefault(); pop.hidden ? open() : close(true); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown" || e.key === " " || e.key === "Enter") { e.preventDefault(); open(); }
    });

    pop.addEventListener("click", function (e) {
      var nav = e.target.closest("[data-move]");
      if (nav) { view.setMonth(view.getMonth() + (+nav.getAttribute("data-move"))); render(); return; }
      var day = e.target.closest(".ns-calendar__day");
      if (!day) return;
      input.value = day.getAttribute("data-date");
      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
      close(true);
    });

    pop.addEventListener("keydown", function (e) {
      if (e.key === "Escape") { e.preventDefault(); close(true); return; }
      var step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      var d = new Date(focused);
      if (step) d.setDate(d.getDate() + step);
      else if (e.key === "Home") d.setDate(d.getDate() - ((d.getDay() - fdow + 7) % 7));
      else if (e.key === "End") d.setDate(d.getDate() + (6 - ((d.getDay() - fdow + 7) % 7)));
      else if (e.key === "PageUp") d.setMonth(d.getMonth() - 1);
      else if (e.key === "PageDown") d.setMonth(d.getMonth() + 1);
      else return;
      e.preventDefault();
      focused = d;
      /* Follow focus across the month boundary, which is what makes arrowing
         off the end of a month feel continuous rather than blocked. */
      if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()) view = new Date(d);
      render();
      var f = pop.querySelector('[tabindex="0"]');
      if (f) f.focus();
    });

    document.addEventListener("click", function (e) {
      if (!field.contains(e.target)) close(false);
    });
  }

  Array.prototype.forEach.call(
    document.querySelectorAll(".ns-datefield[data-ns-calendar]"),
    build
  );
})();
