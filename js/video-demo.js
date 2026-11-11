/* Video + synced overlay + pitch minimap for the SoccerTrack v2 concept demo. */
(function (root) {
  var NS = 'http://www.w3.org/2000/svg';
  var MINI = 3; // minimap px per metre (105 × 68 m → 315 × 204)
  var TRAIL_S = 3;

  function s(tag, attrs) {
    var e = root.document.createElementNS(NS, tag);
    Object.keys(attrs || {}).forEach(function (k) { e.setAttribute(k, attrs[k]); });
    return e;
  }
  function h(tag, cls, txt) {
    var e = root.document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }
  function reduced() { return !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches); }

  /**
   * @param {HTMLElement} el mount point
   * @param {{src:string, poster:string, tracksUrl:string, label:string, attribution:string, datasetUrl?:string}} opts
   */
  function mountVideoDemo(el, opts) {
    var fig = h('figure', 'demo');
    var head = h('div', 'demo-head');
    head.appendChild(h('span', 'badge demo-badge', opts.label));
    var expand = h('button', 'demo-expand', '크게 보기');
    expand.type = 'button';
    expand.setAttribute('aria-pressed', 'false');
    head.appendChild(expand);
    fig.appendChild(head);

    var stage = h('div', 'demo-stage');
    var video = h('video');
    video.muted = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');
    video.setAttribute('loop', '');
    video.setAttribute('preload', 'metadata');
    video.setAttribute('poster', opts.poster);
    video.setAttribute('aria-label', '아마추어 경기 파노라마 영상 일부와 선수 추적 표시');
    video.src = opts.src;
    stage.appendChild(video);
    var overlay = s('svg', { class: 'overlay', viewBox: '0 0 1280 720', preserveAspectRatio: 'none', 'aria-hidden': 'true' });
    var gAll = s('g', { class: 'ov-all' });
    var hlTrail = s('polyline', { class: 'hl-trail', points: '' });
    var gHl = s('g', { class: 'ov-hl' });
    overlay.appendChild(gAll);
    overlay.appendChild(hlTrail);
    overlay.appendChild(gHl);
    stage.appendChild(overlay);
    var play = h('button', 'play-btn', '▶ 재생');
    play.type = 'button';
    play.hidden = true;
    stage.appendChild(play);
    fig.appendChild(stage);

    var fallback = h('img', 'demo-fallback');
    fallback.src = opts.poster;
    fallback.alt = '데모 영상 대표 장면';
    fallback.loading = 'lazy';
    fig.appendChild(fallback);

    var mini = h('div', 'demo-mini');
    var miniSvg = s('svg', { viewBox: '-6 -6 327 216', role: 'img', 'aria-label': '같은 시점 선수 위치를 피치 좌표로 표시한 미니맵' });
    if (root.VIZKIT) miniSvg.appendChild(root.VIZKIT.pitch(105 * MINI, 68 * MINI));
    var miniTrail = s('polyline', { class: 'mini-trail', points: '' });
    var gMini = s('g', { class: 'mini-dots' });
    miniSvg.appendChild(miniTrail);
    miniSvg.appendChild(gMini);
    mini.appendChild(miniSvg);
    fig.appendChild(mini);

    var cap = h('figcaption', 'demo-cap');
    cap.appendChild(h('span', 'demo-cap-t', '위: 영상 속 선수 위치 · 아래: 같은 순간의 피치 좌표(m). 데이터셋의 추적 주석을 시각화한 것으로, 앞으로 AI로 자동화하려는 결과물의 모습입니다.'));
    var attr = h('a', 'demo-attr', opts.attribution);
    attr.href = opts.datasetUrl || '#';
    attr.target = '_blank';
    attr.rel = 'noopener noreferrer';
    cap.appendChild(attr);
    fig.appendChild(cap);
    el.appendChild(fig);

    var data = null;
    var hlId = null;

    function frameAt(t) {
      if (!data) return null;
      var i = Math.max(0, Math.min(data.frames.length - 1, Math.round(t * data.source.fps)));
      return { i: i, f: data.frames[i] };
    }

    function draw(t) {
      var fr = frameAt(t);
      if (!fr) return;
      var f = fr.f;
      while (gAll.firstChild) gAll.removeChild(gAll.firstChild);
      while (gHl.firstChild) gHl.removeChild(gHl.firstChild);
      while (gMini.firstChild) gMini.removeChild(gMini.firstChild);
      f.p.forEach(function (p) {
        var hot = p[0] === hlId;
        if (p[1] != null && !hot) gAll.appendChild(s('circle', { cx: p[1] * 1280, cy: p[2] * 720, r: 11, class: 'mk' }));
        if (p[5] != null) {
          gMini.appendChild(s('circle', { cx: (p[5] + 52.5) * MINI, cy: (p[6] + 34) * MINI, r: hot ? 5 : 3.6, class: 'mini-dot' + (hot ? ' is-hot' : '') }));
        }
        if (hot && p[1] != null) {
          gHl.appendChild(s('circle', { cx: p[1] * 1280, cy: p[2] * 720, r: 16, class: 'hl-marker' }));
          var tx = Math.min(p[1] * 1280 + 22, 1060);
          var lbl = s('text', { x: tx, y: p[2] * 720 - 18, class: 'hl-label' });
          lbl.textContent = data.highlight.label;
          gHl.appendChild(lbl);
        }
      });
      // trails for the highlighted player
      var from = Math.max(0, fr.i - TRAIL_S * data.source.fps);
      var scr = [], pit = [];
      for (var k = 0; k <= fr.i; k++) {
        var q = data.frames[k].p.filter(function (p) { return p[0] === hlId; })[0];
        if (!q) continue;
        if (k >= from && q[1] != null) scr.push((q[1] * 1280).toFixed(1) + ',' + (q[2] * 720).toFixed(1));
        if (q[5] != null) pit.push(((q[5] + 52.5) * MINI).toFixed(1) + ',' + ((q[6] + 34) * MINI).toFixed(1));
      }
      hlTrail.setAttribute('points', scr.join(' '));
      miniTrail.setAttribute('points', pit.join(' '));
    }

    var looping = false;
    function loop() {
      if (video.paused || video.ended) { looping = false; return; }
      draw(video.currentTime);
      if (video.requestVideoFrameCallback) video.requestVideoFrameCallback(loop);
      else root.requestAnimationFrame(loop);
    }
    function startLoop() { if (!looping) { looping = true; loop(); } }

    video.addEventListener('play', function () { play.hidden = true; startLoop(); });
    video.addEventListener('pause', function () { if (reduced() || fig.classList.contains('is-manual')) play.hidden = false; });
    video.addEventListener('seeked', function () { draw(video.currentTime); });
    video.addEventListener('error', function () {
      fig.classList.add('is-error');
      play.hidden = true;
    });

    function tryPlay() {
      var pr = video.play();
      if (pr && pr.catch) pr.catch(function () { fig.classList.add('is-manual'); play.hidden = false; });
    }

    play.addEventListener('click', function () {
      fig.classList.add('is-manual');
      if (video.paused) tryPlay(); else video.pause();
    });

    if (reduced()) {
      play.hidden = false;
    } else if ('IntersectionObserver' in root) {
      var io = new root.IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (fig.classList.contains('is-error') || fig.classList.contains('is-manual')) return;
          if (e.isIntersecting && e.intersectionRatio >= 0.5) tryPlay();
          else if (!video.paused) video.pause();
        });
      }, { threshold: [0, 0.5, 1] });
      io.observe(stage);
    }

    // The board creates its own stacking context, so the expanded view is moved to <body>
    // (and back) instead of relying on z-index from inside the tile.
    var placeholder = root.document.createComment('demo');
    function resume(wasPlaying) { if (wasPlaying) tryPlay(); }
    function closeExpand() {
      if (!fig.classList.contains('is-expanded')) return;
      var wasPlaying = !video.paused;
      fig.classList.remove('is-expanded');
      if (placeholder.parentNode) placeholder.parentNode.replaceChild(fig, placeholder);
      root.document.body.classList.remove('demo-open');
      expand.setAttribute('aria-pressed', 'false');
      expand.textContent = '크게 보기';
      resume(wasPlaying);
      expand.focus();
    }
    expand.addEventListener('click', function () {
      if (fig.classList.contains('is-expanded')) { closeExpand(); return; }
      var wasPlaying = !video.paused;
      fig.parentNode.replaceChild(placeholder, fig);
      root.document.body.appendChild(fig);
      root.document.body.classList.add('demo-open');
      fig.classList.add('is-expanded');
      expand.setAttribute('aria-pressed', 'true');
      expand.textContent = '닫기';
      resume(wasPlaying);
      expand.focus();
    });
    root.document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeExpand(); });

    root.addEventListener('beforeprint', function () { if (data) draw(data.video.posterT || 0); });

    if (root.fetch) {
      root.fetch(opts.tracksUrl).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (json) {
          data = json;
          hlId = json.highlight.id;
          draw(video.currentTime || json.video.posterT || 0);
        })
        .catch(function () { fig.classList.add('no-tracks'); });
    }

    return {
      destroy: function () { video.pause(); el.removeChild(fig); },
    };
  }

  root.mountVideoDemo = mountVideoDemo;
})(typeof window !== 'undefined' ? window : this);
