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
    var state = { t: 0, d: 0 };
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
    var seek = host.querySelector(".ns-vplayer__seek");
    var cur = host.querySelector("[data-ns-video-current]");
    var dur = host.querySelector("[data-ns-video-duration]");
    var chapters = [].slice.call(host.querySelectorAll(".ns-vchapters__item"));

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
