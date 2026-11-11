/* Project 01 (thesis) visualizations + shared SVG helpers (VIZKIT). */
(function (root) {
  var NS = 'http://www.w3.org/2000/svg';

  function svg(tag, attrs, children) {
    var el = root.document.createElementNS(NS, tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { if (attrs[k] != null) el.setAttribute(k, attrs[k]); });
    (children || []).forEach(function (c) {
      if (c == null) return;
      el.appendChild(typeof c === 'string' ? root.document.createTextNode(c) : c);
    });
    return el;
  }

  function rootSvg(w, h, label) {
    return svg('svg', { viewBox: '0 0 ' + w + ' ' + h, role: 'img', 'aria-label': label, focusable: 'false' });
  }

  function text(x, y, str, cls, extra) {
    var a = { x: x, y: y, class: cls };
    if (extra) Object.keys(extra).forEach(function (k) { a[k] = extra[k]; });
    return svg('text', a, [str]);
  }

  /** Football pitch (105 × 68 m) drawn into a w × h box. */
  function pitch(w, h) {
    var sx = w / 105, sy = h / 68;
    var g = svg('g', { class: 'pitch' });
    g.appendChild(svg('rect', { x: 0, y: 0, width: w, height: h, class: 'pitch-turf' }));
    var L = 'pitch-line';
    g.appendChild(svg('rect', { x: 0, y: 0, width: w, height: h, class: L }));
    g.appendChild(svg('line', { x1: w / 2, y1: 0, x2: w / 2, y2: h, class: L }));
    g.appendChild(svg('circle', { cx: w / 2, cy: h / 2, r: 9.15 * sx, class: L }));
    g.appendChild(svg('circle', { cx: w / 2, cy: h / 2, r: 1.2, class: 'pitch-spot' }));
    [[0, 1], [105, -1]].forEach(function (side) {
      var x = side[0] * sx, d = side[1];
      var pbW = 16.5 * sx, pbH = 40.32 * sy, gaW = 5.5 * sx, gaH = 18.32 * sy;
      g.appendChild(svg('rect', { x: d > 0 ? x : x - pbW, y: (h - pbH) / 2, width: pbW, height: pbH, class: L }));
      g.appendChild(svg('rect', { x: d > 0 ? x : x - gaW, y: (h - gaH) / 2, width: gaW, height: gaH, class: L }));
    });
    return g;
  }

  /** metres → box coordinates */
  function m2p(w, h) { return function (mx, my) { return [mx / 105 * w, my / 68 * h]; }; }

  function el(tag, cls, txt) {
    var e = root.document.createElement(tag);
    if (cls) e.className = cls;
    if (txt != null) e.textContent = txt;
    return e;
  }

  /** Gap ↔ AIGEN resource table for one project, from content.next.matrix. */
  function gapTable(projectId, gapHeading) {
    var rows = root.PORTFOLIO_CONTENT.next.matrix.filter(function (m) { return m.project === projectId; });
    var table = el('table', 'gap-table');
    var thead = el('thead');
    var trh = el('tr');
    trh.appendChild(el('th', null, gapHeading));
    trh.appendChild(el('th', null, '메울 AIGEN 자원'));
    thead.appendChild(trh);
    table.appendChild(thead);
    var tb = el('tbody');
    rows.forEach(function (r) {
      var tr = el('tr');
      tr.appendChild(el('td', null, r.gap));
      var td = el('td');
      td.appendChild(el('span', 'res-chip', r.resource));
      tr.appendChild(td);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    return table;
  }

  root.VIZKIT = { svg: svg, rootSvg: rootSvg, text: text, pitch: pitch, m2p: m2p, el: el, gapTable: gapTable };

  var VIZ = root.VIZ = root.VIZ || {};

  // ---------------------------------------------------------------- 01 pitch
  VIZ['p01-pitch'] = function (box) {
    var W = 300, H = 212, PW = 280, PH = 181;
    var s = rootSvg(W, H, '피치 개념도: 기존 지표는 공을 가진 선수만 평가하고, 나머지 선수는 평가 밖에 있음');
    var g = svg('g', { transform: 'translate(10,10)' });
    g.appendChild(pitch(PW, PH));
    var P = m2p(PW, PH);
    var teamA = [[55, 12], [70, 52], [79, 22], [47, 44], [38, 26]];
    var teamB = [[83, 29], [85, 41], [81, 15], [89, 52], [73, 35], [101, 34]];
    var runs = [[[79, 22], [91, 18]], [[70, 52], [84, 58]]];
    runs.forEach(function (r) {
      var a = P(r[0][0], r[0][1]), b = P(r[1][0], r[1][1]);
      g.appendChild(svg('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], class: 'run', 'marker-end': 'url(#p01-arrow)' }));
    });
    teamA.forEach(function (p) { var q = P(p[0], p[1]); g.appendChild(svg('circle', { cx: q[0], cy: q[1], r: 5, class: 'dot dot-off team-a' })); });
    teamB.forEach(function (p) { var q = P(p[0], p[1]); g.appendChild(svg('circle', { cx: q[0], cy: q[1], r: 5, class: 'dot dot-off team-b' })); });
    var c = P(62, 30);
    g.appendChild(svg('circle', { cx: c[0], cy: c[1], r: 11, class: 'ball-halo' }));
    g.appendChild(svg('circle', { cx: c[0], cy: c[1], r: 6, class: 'dot dot-ball' }));
    g.appendChild(svg('circle', { cx: c[0] + 8, cy: c[1] + 6, r: 2.6, class: 'ball' }));
    g.appendChild(text(c[0], c[1] - 16, '공 가진 선수만 평가', 'lbl lbl-hot', { 'text-anchor': 'middle' }));
    g.appendChild(text(PW - 8, PH - 10, '평가 밖', 'lbl lbl-off', { 'text-anchor': 'end' }));
    g.appendChild(text(PW - 8, PH - 10, '오프더볼까지 공간 맥락으로', 'lbl lbl-on', { 'text-anchor': 'end' }));
    var defs = svg('defs', null, [svg('marker', { id: 'p01-arrow', viewBox: '0 0 8 8', refX: 6, refY: 4, markerWidth: 6, markerHeight: 6, orient: 'auto' },
      [svg('path', { d: 'M0,0 L8,4 L0,8 z', class: 'arrow-head' })])]);
    s.appendChild(defs);
    s.appendChild(g);
    s.classList.add('pitch-viz');
    box.appendChild(s);

    var btn = el('button', 'viz-toggle', '오프더볼 선수 보기');
    btn.type = 'button';
    btn.setAttribute('aria-pressed', 'false');
    btn.addEventListener('click', function () {
      var on = btn.getAttribute('aria-pressed') !== 'true';
      btn.setAttribute('aria-pressed', on ? 'true' : 'false');
      btn.textContent = on ? '기존 지표 시점으로' : '오프더볼 선수 보기';
      s.classList.toggle('is-on', on);
      Array.prototype.forEach.call(s.querySelectorAll(on ? '.dot-off' : '.dot-on'), function (d) {
        d.classList.remove(on ? 'dot-off' : 'dot-on');
        d.classList.add(on ? 'dot-on' : 'dot-off');
      });
    });
    box.appendChild(btn);
  };

  // ---------------------------------------------------------------- 02 pipeline
  VIZ['p01-pipeline'] = function (box) {
    var s = rootSvg(300, 300, '파이프라인: 이벤트 데이터와 StatsBomb 360을 통합해 무결성 검사, 공간 변수, 모델을 거쳐 VAEP 값을 계산');
    function node(x, y, w, title, sub, hot) {
      return svg('g', { class: 'node' + (hot ? ' is-hot' : '') }, [
        svg('rect', { x: x, y: y, width: w, height: 40, rx: 7 }),
        text(x + w / 2, y + 17, title, 'node-t', { 'text-anchor': 'middle' }),
        text(x + w / 2, y + 31, sub, 'node-s', { 'text-anchor': 'middle' }),
      ]);
    }
    function arrow(x1, y1, x2, y2) {
      return svg('path', { d: 'M' + x1 + ',' + y1 + ' C' + x1 + ',' + (y1 + 10) + ' ' + x2 + ',' + (y2 - 12) + ' ' + x2 + ',' + y2, class: 'flow', 'marker-end': 'url(#p01-flow)' });
    }
    s.appendChild(svg('defs', null, [svg('marker', { id: 'p01-flow', viewBox: '0 0 8 8', refX: 6, refY: 4, markerWidth: 6, markerHeight: 6, orient: 'auto' },
      [svg('path', { d: 'M0,0 L8,4 L0,8 z', class: 'arrow-head' })])]));
    s.appendChild(node(6, 6, 138, '이벤트 데이터', '경기 기록 (패스·슈팅…)'));
    s.appendChild(node(156, 6, 138, 'StatsBomb 360', '이벤트 순간 선수 위치'));
    s.appendChild(arrow(75, 46, 150, 70));
    s.appendChild(arrow(225, 46, 150, 70));
    s.appendChild(node(40, 72, 220, '무결성 검사', '경기 단위로 두 데이터 통합'));
    s.appendChild(arrow(150, 112, 150, 132));
    s.appendChild(node(40, 132, 220, '공간 변수', '수비라인 위치 · 오프더볼 움직임'));
    s.appendChild(arrow(150, 172, 150, 192));
    s.appendChild(node(40, 192, 220, '모델 (CatBoost 선정)', 'XGBoost · 로지스틱 회귀와 비교'));
    s.appendChild(arrow(150, 232, 150, 252));
    s.appendChild(node(40, 252, 220, 'VAEP 값', '행동마다 득점·실점 확률 변화', true));
    box.appendChild(s);
  };

  // ---------------------------------------------------------------- 03 results
  VIZ['p01-results'] = function (box) {
    var kpis = el('div', 'kpis');
    [['0.847', 'AUC · 득점'], ['0.812', 'AUC · 실점'], ['76', '논문 · First Class']].forEach(function (k) {
      var d = el('div', 'kpi');
      d.appendChild(el('span', 'kpi-v', k[0]));
      d.appendChild(el('span', 'kpi-l', k[1]));
      kpis.appendChild(d);
    });
    box.appendChild(kpis);
    box.appendChild(el('p', 'viz-note', 'AUC = 미공개 토너먼트 검증'));

    var models = [['CatBoost', 0.0481], ['로지스틱 회귀', 0.0574], ['XGBoost', 0.0707]];
    var X0 = 96, MAXV = 0.08, MAXW = 168, K = MAXW / MAXV;
    var s = rootSvg(300, 136, '모델 비교 막대: 로그손실 CatBoost 0.0481, 로지스틱 회귀 0.0574, XGBoost 0.0707, 낮을수록 좋음');
    s.appendChild(text(0, 12, '모델 비교 · 득점 예측', 'cap-t'));
    models.forEach(function (m, i) {
      var y = 26 + i * 28;
      s.appendChild(text(X0 - 8, y + 13, m[0], 'bar-l', { 'text-anchor': 'end' }));
      var r = svg('rect', { x: X0, y: y, width: +(m[1] * K).toFixed(3), height: 18, rx: 3, class: 'bar' + (i === 0 ? ' is-chosen' : '') });
      r.dataset.value = String(m[1]);
      s.appendChild(r);
      s.appendChild(text(X0 + m[1] * K + 6, y + 13, m[1].toFixed(4), 'bar-v'));
    });
    var axis = svg('line', { x1: X0, y1: 22, x2: X0, y2: 112, class: 'axis' });
    axis.setAttribute('data-axis-zero', String(X0));
    s.appendChild(axis);
    [0, 0.04, 0.08].forEach(function (t) {
      s.appendChild(text(X0 + t * K, 124, String(t), 'tick', { 'text-anchor': 'middle' }));
    });
    s.appendChild(text(300, 12, '로그손실 · 낮을수록 좋음', 'cap-s', { 'text-anchor': 'end' }));
    box.appendChild(s);
  };

  // ---------------------------------------------------------------- 04 snapshot vs continuous
  VIZ['p01-snapshot'] = function (box) {
    var W = 300, PW = 196, PH = 127, PX = (W - PW) / 2;
    var s = rootSvg(W, 316, '비교: StatsBomb 360 스냅샷은 이벤트 순간 카메라에 보이는 선수만 담고, 연속 추적은 전체 선수의 움직임 궤적을 담음');
    var P = m2p(PW, PH);

    s.appendChild(text(W / 2, 13, '스냅샷 · StatsBomb 360', 'cap-t', { 'text-anchor': 'middle' }));
    s.appendChild(text(W / 2, 27, '이벤트 순간, 카메라에 보이는 선수만', 'cap-s', { 'text-anchor': 'middle' }));
    var g1 = svg('g', { transform: 'translate(' + PX + ',34)' });
    g1.appendChild(pitch(PW, PH));
    var poly = [[44, 2], [92, 2], [104, 66], [34, 66]].map(function (p) { return P(p[0], p[1]).join(','); }).join(' ');
    g1.appendChild(svg('polygon', { points: poly, class: 'visible-area' }));
    [[60, 30, 1], [70, 18, 0], [78, 40, 0], [66, 50, 0], [84, 28, 0], [56, 42, 0]].forEach(function (p) {
      var q = P(p[0], p[1]);
      g1.appendChild(svg('circle', { cx: q[0], cy: q[1], r: 4, class: p[2] ? 'dot dot-ball' : 'dot dot-on team-a' }));
    });
    s.appendChild(g1);

    s.appendChild(text(W / 2, 185, '연속 추적 · 앞으로의 목표', 'cap-t', { 'text-anchor': 'middle' }));
    s.appendChild(text(W / 2, 199, '모든 선수의 움직임을 프레임마다', 'cap-s', { 'text-anchor': 'middle' }));
    var g2 = svg('g', { transform: 'translate(' + PX + ',206)' });
    g2.appendChild(pitch(PW, PH));
    var trails = [
      [[30, 20], [38, 22], [46, 20], [55, 16], [64, 14]],
      [[40, 50], [48, 47], [56, 46], [62, 40], [70, 37]],
      [[22, 34], [30, 35], [38, 33], [47, 31], [54, 30]],
      [[60, 58], [67, 55], [73, 50], [80, 49], [88, 46]],
    ];
    trails.forEach(function (t, i) {
      var pts = t.map(function (p) { return P(p[0], p[1]).join(','); }).join(' ');
      g2.appendChild(svg('polyline', { points: pts, class: 'trail' + (i === 0 ? ' is-hot' : '') }));
      var end = P(t[t.length - 1][0], t[t.length - 1][1]);
      g2.appendChild(svg('circle', { cx: end[0], cy: end[1], r: 4, class: 'dot ' + (i === 0 ? 'dot-ball' : 'dot-on team-a') }));
    });
    s.appendChild(g2);
    box.appendChild(s);
  };

  // ---------------------------------------------------------------- 05 roadmap
  VIZ['p01-roadmap'] = function (box) {
    var mount = el('div', 'video-demo-mount');
    box.appendChild(mount);

    var stages = [
      ['영상', '경기 영상 입력', false],
      ['탐지·추적', '선수·공 탐지, 같은 선수 이어 붙이기', true],
      ['카메라 보정', '화면 좌표 → 피치 좌표(m)', true],
      ['움직임 분류', '침투·공간 창출 유형, 현장 전문가와 정의', true],
      ['지표·스카우팅 리포트', '선수 평가 자동화 · 고객 검증', true],
    ];
    var STEP = 46, H = stages.length * STEP;
    var s = rootSvg(300, H, '발전 로드맵: 영상, 탐지·추적, 카메라 보정, 움직임 분류, 지표·스카우팅 리포트 순서로 AI가 자동화');
    s.appendChild(svg('line', { x1: 14, y1: 16, x2: 14, y2: H - 18, class: 'road' }));
    stages.forEach(function (st, i) {
      var y = 16 + i * STEP;
      s.appendChild(svg('circle', { cx: 14, cy: y, r: 7, class: 'road-node' + (i === stages.length - 1 ? ' is-hot' : '') }));
      s.appendChild(text(32, y + 4, st[0], 'road-t'));
      s.appendChild(text(32, y + 20, st[1], 'road-s'));
      if (st[2]) {
        s.appendChild(svg('g', { class: 'ai-mark', transform: 'translate(270,' + (y - 9) + ')' }, [
          svg('rect', { x: 0, y: 0, width: 28, height: 17, rx: 8.5 }),
          text(14, 12.5, 'AI', 'ai-t', { 'text-anchor': 'middle' }),
        ]));
      }
    });
    box.appendChild(s);

    box.appendChild(gapTable('p01', '논문이 남긴 갭'));
  };
})(typeof window !== 'undefined' ? window : this);
