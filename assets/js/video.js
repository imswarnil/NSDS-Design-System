/* NS Design System — video player.
   =========================================================================
   One themed control surface over three sources that are not alike:

     data-src="…mp4"        a self-hosted file      → <video>, driven directly
     data-mux="PLAYBACK_ID" a Mux HLS stream        → <video>, see the note
     data-youtube="ID"      a YouTube embed         → iframe + IFrame API

   The differences are documented rather than papered over:

   MUX serves HLS. Safari plays that natively; Chrome and Firefox do not, and
   this system deliberately does not bundle hls.js — it is 40KB+ and most pages
   never play a video. If window.Hls is present we use it; if not, and the
   browser cannot play HLS, we surface that instead of showing a dead frame.

   YOUTUBE cannot be restyled: it is a cross-origin iframe. These controls do
   not decorate YouTube's player, they DRIVE it through the IFrame API, which
   is why the chrome sits outside the frame. An overlay would sit on top of
   YouTube's own controls and fight them.

   Everything here is progressive. The markup contains a real <video> (or a
   real link to the YouTube page) and the chapter list is server-rendered text,
   so with JS off the video still plays in the browser's own controls and the
   chapters are still readable. */
(function () {
  var fmt = function (t) {
    if (!isFinite(t) || t < 0) t = 0;
    var m = Math.floor(t / 60), s = Math.floor(t % 60);
    return m + ":" + String(s).padStart(2, "0");
  };

  /* ---- source adapters ---------------------------------------------------
     Each returns the same shape, so the control code below never branches on
     which kind of video it is driving. */
  function nativeAdapter(video) {
    return {
      play: function () { video.play(); },
      pause: function () { video.pause(); },
      seek: function (t) { video.currentTime = t; },
      time: function () { return video.currentTime; },
      duration: function () { return video.duration || 0; },
      rate: function (r) { video.playbackRate = r; },
      volume: function (v) { video.volume = v; video.muted = v === 0; },
      muted: function () { return video.muted || video.volume === 0; },
      captions: function (on) {
        var tracks = video.textTracks || [];
        for (var i = 0; i < tracks.length; i++) tracks[i].mode = on ? "showing" : "disabled";
      },
      onTick: function (cb) {
        video.addEventListener("timeupdate", cb);
        video.addEventListener("loadedmetadata", cb);
      },
      onState: function (cb) {
        video.addEventListener("play", function () { cb("playing"); });
        video.addEventListener("pause", function () { cb("paused"); });
        video.addEventListener("ended", function () { cb("ended"); });
      },
    };
  }

  function youtubeAdapter(host, id) {
    var frame = document.createElement("iframe");
    frame.src = "https://www.youtube-nocookie.com/embed/" + id + "?enablejsapi=1&controls=0&rel=0&modestbranding=1";
    frame.title = host.getAttribute("data-title") || "Video";
    frame.allow = "accelerometer; autoplay; encrypted-media; picture-in-picture";
    frame.allowFullscreen = true;
    host.querySelector(".ns-vplayer__stage").appendChild(frame);

    var post = function (func, args) {
      frame.contentWindow.postMessage(JSON.stringify({ event: "command", func: func, args: args || [] }), "*");
    };
    /* The IFrame API only reports state by postMessage, and only after the
       page subscribes. Duration and time are therefore polled — there is no
       timeupdate event to listen to across the origin boundary. */
    var state = { t: 0, d: 0, muted: false };
    window.addEventListener("message", function (e) {
      if (!/youtube(-nocookie)?\.com/.test(e.origin)) return;
      try {
        var d = JSON.parse(e.data);
        if (d.info && typeof d.info.currentTime === "number") { state.t = d.info.currentTime; state.d = d.info.duration || state.d; }
      } catch (err) { /* not ours */ }
    });
    frame.addEventListener("load", function () {
      post("addEventListener", ["onStateChange"]);
      setInterval(function () { post("getCurrentTime"); }, 500);
    });
    return {
      play: function () { post("playVideo"); },
      pause: function () { post("pauseVideo"); },
      seek: function (t) { post("seekTo", [t, true]); state.t = t; },
      time: function () { return state.t; },
      duration: function () { return state.d; },
      rate: function (r) { post("setPlaybackRate", [r]); },
      /* The IFrame API takes 0–100 where the media element takes 0–1. The
         adapters normalise on the media element's scale, so every caller
         speaks one language. */
      volume: function (v) { post(v === 0 ? "mute" : "unMute"); post("setVolume", [Math.round(v * 100)]); },
      muted: function () { return state.muted; },
      /* YouTube owns its own caption track and its own button for it; driving
         it from here would fight the player rather than decorate it. */
      captions: null,
      onTick: function (cb) { setInterval(cb, 250); },
      onState: function () { /* cross-origin: driven by the buttons themselves */ },
    };
  }

  function build(host) {
    var stage = host.querySelector(".ns-vplayer__stage");
    var video = stage.querySelector("video");
    var yt = host.getAttribute("data-youtube");
    var mux = host.getAttribute("data-mux");
    var api;

    if (yt) {
      api = youtubeAdapter(host, yt);
    } else {
      if (mux && video) {
        var src = "https://stream.mux.com/" + mux + ".m3u8";
        if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = src;
        } else if (window.Hls && window.Hls.isSupported()) {
          var hls = new window.Hls();
          hls.loadSource(src);
          hls.attachMedia(video);
        } else {
          /* Say so, rather than showing a frame that will never play. */
          host.setAttribute("data-unsupported", "");
          return;
        }
      }
      if (!video) return;
      api = nativeAdapter(video);
    }

    var playBtn = host.querySelector("[data-ns-video-play]");
    var bigBtn = host.querySelector(".ns-vplayer__big");
    /* Explicitly the SCRUBBER. The volume slider is the same class — both are
       real range inputs, which is the point — so a bare querySelector here
       works only by DOM order, and would silently start driving the volume the
       day someone puts it first. */
    var seek = host.querySelector(".ns-vplayer__scrub .ns-vplayer__seek")
      || host.querySelector(".ns-vplayer__seek:not([data-ns-video-volume])");
    var cur = host.querySelector("[data-ns-video-current]");
    var dur = host.querySelector("[data-ns-video-duration]");
    /* Chapters usually sit under the player, inside it. In the course player
       they do not: the frame is sticky at the top of the lesson column and the
       chapter list lives in a tab panel much further down, which is the right
       place for it — it is content, and it should be readable by someone who
       never presses play. data-chapters points at that list so one player can
       still drive it. */
    var chapterHost = host.getAttribute("data-chapters");
    chapterHost = (chapterHost && document.querySelector(chapterHost)) || host;
    var chapters = [].slice.call(chapterHost.querySelectorAll(".ns-vchapters__item"));

    var playing = false;
    function setPlaying(on) {
      playing = on;
      host.setAttribute("data-state", on ? "playing" : "paused");
      if (playBtn) {
        playBtn.querySelector("i").className = "ph " + (on ? "ph-pause" : "ph-play");
        playBtn.setAttribute("aria-label", on ? "Pause" : "Play");
      }
    }
    function toggle() { playing ? api.pause() : api.play(); setPlaying(!playing); }

    if (playBtn) playBtn.addEventListener("click", toggle);
    if (bigBtn) bigBtn.addEventListener("click", toggle);
    api.onState(function (s) { setPlaying(s === "playing"); });

    api.onTick(function () {
      var t = api.time(), d = api.duration();
      if (cur) cur.textContent = fmt(t);
      if (dur) dur.textContent = fmt(d);
      if (seek && d) {
        seek.max = String(Math.floor(d));
        if (document.activeElement !== seek) seek.value = String(Math.floor(t));
        seek.style.setProperty("--p", (t / d) * 100 + "%");
      }
      placeTicks();
      /* Mark the chapter containing the playhead. aria-current, so the
         highlighted row and the announced row are one thing. */
      var active = -1;
      chapters.forEach(function (li, i) {
        if (t >= Number(li.getAttribute("data-start") || 0)) active = i;
      });
      chapters.forEach(function (li, i) {
        if (i === active) li.setAttribute("aria-current", "true");
        else li.removeAttribute("aria-current");
      });
    });

    if (seek) {
      seek.addEventListener("input", function () {
        api.seek(Number(seek.value));
        seek.style.setProperty("--p", (seek.value / (api.duration() || 1)) * 100 + "%");
      });
    }

    chapters.forEach(function (li) {
      var btn = li.querySelector(".ns-vchapters__btn");
      if (!btn) return;
      btn.addEventListener("click", function () {
        api.seek(Number(li.getAttribute("data-start") || 0));
        api.play(); setPlaying(true);
      });
    });

    /* ---- volume, captions, fullscreen ---------------------------------- */
    var vol = host.querySelector("[data-ns-video-volume]");
    var muteBtn = host.querySelector("[data-ns-video-mute]");
    var lastVolume = 1;

    function paintMute(on) {
      if (!muteBtn) return;
      muteBtn.querySelector("i").className = "ph " + (on ? "ph-speaker-slash" : "ph-speaker-high");
      muteBtn.setAttribute("aria-label", on ? "Unmute" : "Mute");
      if (vol) vol.style.setProperty("--p", (on ? 0 : lastVolume * 100) + "%");
    }
    if (vol) {
      vol.addEventListener("input", function () {
        var v = Number(vol.value) / 100;
        lastVolume = v || lastVolume;
        api.volume(v);
        paintMute(v === 0);
      });
      vol.style.setProperty("--p", "100%");
    }
    if (muteBtn) {
      muteBtn.addEventListener("click", function () {
        var on = !api.muted();
        api.volume(on ? 0 : lastVolume);
        if (vol) vol.value = String(on ? 0 : lastVolume * 100);
        paintMute(on);
      });
    }

    /* Captions are the source's, not ours: a <video> has text tracks we can
       switch, and a YouTube embed has its own button for it. Where the adapter
       cannot drive them the control is REMOVED rather than left inert — a
       button that does nothing is worse than one that is not there. */
    var ccBtn = host.querySelector("[data-ns-video-cc]");
    if (ccBtn) {
      if (!api.captions) ccBtn.remove();
      else ccBtn.addEventListener("click", function () {
        var on = ccBtn.getAttribute("aria-pressed") !== "true";
        api.captions(on);
        ccBtn.setAttribute("aria-pressed", String(on));
      });
    }

    var fsBtn = host.querySelector("[data-ns-video-fullscreen]");
    if (fsBtn) {
      fsBtn.addEventListener("click", function () {
        if (document.fullscreenElement) document.exitFullscreen();
        else if (host.requestFullscreen) host.requestFullscreen();
      });
      document.addEventListener("fullscreenchange", function () {
        var on = document.fullscreenElement === host;
        fsBtn.querySelector("i").className = "ph " + (on ? "ph-corners-in" : "ph-corners-out");
        fsBtn.setAttribute("aria-label", on ? "Exit full screen" : "Full screen");
      });
    }

    /* ---- chapter ticks --------------------------------------------------
       Positioned from the chapter list's own data-start values once the
       duration is known, so the marks and the list cannot disagree. Where the
       markup already carries --fx-at those values are simply overwritten with
       the real ones. */
    var ticks = [].slice.call(host.querySelectorAll(".ns-vplayer__tick"));
    var ticksPlaced = false;
    function placeTicks() {
      if (ticksPlaced || !ticks.length || !chapters.length) return;
      var d = api.duration();
      if (!d) return;
      ticksPlaced = true;
      ticks.forEach(function (tick, i) {
        var li = chapters[i + 1]; /* the first chapter starts at 0 — no mark */
        if (!li) { tick.remove(); return; }
        tick.style.setProperty("--fx-at", (Number(li.getAttribute("data-start") || 0) / d) * 100 + "%");
      });
    }

    host.querySelectorAll("[data-rate]").forEach(function (opt) {
      opt.addEventListener("click", function () {
        api.rate(Number(opt.getAttribute("data-rate")));
        host.querySelectorAll("[data-rate]").forEach(function (o) {
          o.setAttribute("aria-checked", o === opt ? "true" : "false");
        });
        var menu = opt.closest("details");
        if (menu) menu.open = false;
      });
    });
  }

  [].forEach.call(document.querySelectorAll("[data-ns-video]"), build);
})();
