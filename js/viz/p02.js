/* Project 02 (BONBAB) visualizations. Demo values only — no real store data. */
(function (root) {
  var K = root.VIZKIT;
  var svg = K.svg, text = K.text, rootSvg = K.rootSvg, el = K.el;
  var VIZ = root.VIZ;

  function pill(cx, cy, w, label, cls) {
    return svg('g', { class: 'pill ' + (cls || '') }, [
      svg('rect', { x: cx - w / 2, y: cy - 14, width: w, height: 28, rx: 14 }),
      text(cx, cy + 4.5, label, 'pill-t', { 'text-anchor': 'middle' }),
    ]);
  }

  function arrowDefs(id) {
    return svg('defs', null, [svg('marker', { id: id, viewBox: '0 0 8 8', refX: 6, refY: 4, markerWidth: 6, markerHeight: 6, orient: 'auto' },
      [svg('path', { d: 'M0,0 L8,4 L0,8 z', class: 'arrow-head' })])]);
  }

  /** clockwise arc on a circle (cx,cy,r) between two angles in degrees (0 = top). */
  function arc(cx, cy, r, a0, a1) {
    function pt(a) { var t = (a - 90) * Math.PI / 180; return [cx + r * Math.cos(t), cy + r * Math.sin(t)]; }
    var p0 = pt(a0), p1 = pt(a1);
    return 'M' + p0[0].toFixed(1) + ',' + p0[1].toFixed(1) + ' A' + r + ',' + r + ' 0 0 1 ' + p1[0].toFixed(1) + ',' + p1[1].toFixed(1);
  }

  function cycle(s, cx, cy, r, labels, markerId, widths) {
    var pos = [[cx, cy - r], [cx + r, cy], [cx, cy + r], [cx - r, cy]];
    [[24, 66], [114, 156], [204, 246], [294, 336]].forEach(function (a) {
      s.appendChild(svg('path', { d: arc(cx, cy, r, a[0], a[1]), class: 'cycle-arc', 'marker-end': 'url(#' + markerId + ')' }));
    });
    labels.forEach(function (l, i) { s.appendChild(pill(pos[i][0], pos[i][1], widths[i], l)); });
  }

  // ---------------------------------------------------------------- 01 loop
  VIZ['p02-loop'] = function (box) {
    var s = rootSvg(300, 262, '악순환 루프: 쿠폰 받음, 분실·망각, 재발급·포기, 혜택·로열티 저하가 반복되고 인쇄 비용이 계속 발생');
    s.appendChild(arrowDefs('p02-loop-arrow'));
    cycle(s, 150, 112, 82, ['쿠폰 받음', '분실·망각', '재발급·포기', '혜택·로열티 저하'], 'p02-loop-arrow', [92, 86, 92, 118]);
    s.appendChild(text(150, 108, '종이 쿠폰의', 'cap-s', { 'text-anchor': 'middle' }));
    s.appendChild(text(150, 124, '악순환', 'cap-t', { 'text-anchor': 'middle' }));
    var coin = svg('g', { class: 'coin', transform: 'translate(96,236)' }, [
      svg('circle', { cx: 0, cy: 0, r: 10 }),
      text(0, 4, '£', 'coin-t', { 'text-anchor': 'middle' }),
    ]);
    s.appendChild(coin);
    s.appendChild(text(114, 240, '인쇄 비용 반복 발생', 'lbl lbl-hot'));
    box.appendChild(s);
  };

  // ---------------------------------------------------------------- 02 proposal
  VIZ['p02-proposal'] = function (box) {
    var s = rootSvg(300, 236, '제안 카드: 핵심 기능 적립에 선결제, 공지, 피드백으로 확장할 가능성을 함께 제시');
    var cx = 150, cy = 108;
    var ext = [['선결제', 150, 26], ['공지', 254, 160], ['피드백', 46, 160]];
    ext.forEach(function (e) {
      s.appendChild(svg('line', { x1: cx, y1: cy, x2: e[1], y2: e[2], class: 'ext-link' }));
    });
    s.appendChild(svg('g', { class: 'core' }, [
      svg('circle', { cx: cx, cy: cy, r: 40 }),
      text(cx, cy + 6, '적립', 'core-t', { 'text-anchor': 'middle' }),
    ]));
    ext.forEach(function (e) {
      s.appendChild(svg('g', { class: 'ext' }, [
        svg('rect', { x: e[1] - 38, y: e[2] - 15, width: 76, height: 30, rx: 15 }),
        text(e[1], e[2] + 5, e[0], 'ext-t', { 'text-anchor': 'middle' }),
      ]));
    });
    s.appendChild(text(150, 222, '실선 = 개발한 핵심 · 점선 = 가능성', 'cap-s', { 'text-anchor': 'middle' }));
    box.appendChild(s);
  };

  // ---------------------------------------------------------------- 03 build
  function phone(x, title, body) {
    var g = svg('g', { class: 'phone', transform: 'translate(' + x + ',6)' });
    g.appendChild(svg('rect', { x: 0, y: 0, width: 96, height: 184, rx: 14, class: 'phone-body' }));
    g.appendChild(svg('rect', { x: 6, y: 16, width: 84, height: 160, rx: 6, class: 'phone-screen' }));
    g.appendChild(svg('rect', { x: 36, y: 6, width: 24, height: 4, rx: 2, class: 'phone-notch' }));
    g.appendChild(text(48, 32, title, 'phone-h', { 'text-anchor': 'middle' }));
    body(g);
    return g;
  }

  VIZ['p02-build'] = function (box) {
    var s = rootSvg(300, 196, '데모 앱 화면: 스탬프 카드 7/10과 QR 스캔 화면, QR 스캔 후 서버 검증을 거쳐 스탬프가 적립되는 흐름');
    s.appendChild(arrowDefs('p02-build-arrow'));
    s.appendChild(phone(4, 'DEMO 적립', function (g) {
      g.appendChild(text(48, 50, '스탬프 7 / 10', 'phone-s', { 'text-anchor': 'middle' }));
      for (var i = 0; i < 10; i++) {
        var col = i % 2, row = Math.floor(i / 2);
        g.appendChild(svg('circle', { cx: 34 + col * 28, cy: 70 + row * 20, r: 7.5, class: 'stamp' + (i < 7 ? ' is-on' : '') }));
      }
      g.appendChild(svg('rect', { x: 14, y: 160, width: 68, height: 10, rx: 5, class: 'phone-btn' }));
    }));
    s.appendChild(phone(106, 'QR 스캔', function (g) {
      g.appendChild(svg('rect', { x: 18, y: 50, width: 60, height: 60, rx: 4, class: 'qr-frame' }));
      var bits = '1110111100101101110010101101011011100101011101101110111';
      var n = 0;
      for (var r = 0; r < 7; r++) for (var c = 0; c < 7; c++) {
        var corner = (r < 2 && c < 2) || (r < 2 && c > 4) || (r > 4 && c < 2);
        if (corner || bits[n++ % bits.length] === '1') {
          g.appendChild(svg('rect', { x: 24 + c * 7, y: 56 + r * 7, width: 6, height: 6, class: 'qr-bit' }));
        }
      }
      g.appendChild(text(48, 130, '매장 QR을 비추세요', 'phone-s', { 'text-anchor': 'middle' }));
      g.appendChild(text(48, 146, '(데모 화면)', 'phone-s dim', { 'text-anchor': 'middle' }));
    }));
    var fx = 254;
    [['QR 스캔', 28], ['서버 검증', 92], ['스탬프 +1', 156]].forEach(function (f, i) {
      s.appendChild(pill(fx, f[1], 86, f[0], i === 1 ? 'is-hot' : ''));
      if (i < 2) s.appendChild(svg('line', { x1: fx, y1: f[1] + 16, x2: fx, y2: f[1] + 46, class: 'flow', 'marker-end': 'url(#p02-build-arrow)' }));
    });
    s.appendChild(text(fx, 186, '스탬프(10개) 목표', 'cap-s', { 'text-anchor': 'middle' }));
    box.appendChild(s);

    var row = el('div', 'build-facts');
    var sec = el('div', 'fact-tile');
    sec.appendChild(el('span', 'fact-v', '14 / 14'));
    sec.appendChild(el('span', 'fact-l', '보안 점검 확인 건 전부 수정'));
    row.appendChild(sec);
    var g = el('ul', 'gdpr');
    g.appendChild(el('li', 'gdpr-h', 'GDPR 설계'));
    ['민감정보(민족) 수집 안 함', '2단계 탈퇴', '분석 동의 기본값 꺼짐'].forEach(function (t) { g.appendChild(el('li', null, t)); });
    row.appendChild(g);
    box.appendChild(row);
    box.appendChild(el('p', 'viz-note', '화면은 실제 앱이 아닌 데모 도식입니다.'));
  };

  // ---------------------------------------------------------------- 04 timeline
  VIZ['p02-timeline'] = function (box) {
    var items = [
      ['2026-02', '홀 아르바이트 시작', ''],
      ['2026-05', '앱 개발 시작', ''],
      ['2026-08', '개발 완료 · 계약 불발', 'is-hot'],
      ['', '앱스토어 출시', 'is-ghost'],
    ];
    var s = rootSvg(300, 196, '타임라인: 2026-02 홀 아르바이트, 2026-05 개발 시작, 2026-08 개발 완료 후 계약 불발, 앱스토어 출시 전 단계');
    s.appendChild(svg('line', { x1: 16, y1: 18, x2: 16, y2: 132, class: 'road' }));
    s.appendChild(svg('line', { x1: 16, y1: 132, x2: 16, y2: 174, class: 'road ghost' }));
    items.forEach(function (it, i) {
      var y = 18 + i * 52;
      s.appendChild(svg('circle', { cx: 16, cy: y, r: 7, class: 'road-node ' + it[2] }));
      if (it[0]) s.appendChild(text(34, y - 2, it[0], 'tl-date'));
      s.appendChild(text(34, y + (it[0] ? 15 : 5), it[1], 'road-t' + (it[2] === 'is-ghost' ? ' ghost-t' : '')));
    });
    s.appendChild(svg('g', { class: 'badge-svg', transform: 'translate(130,161)' }, [
      svg('rect', { x: 0, y: 0, width: 58, height: 22, rx: 11 }),
      text(29, 15, '출시 전', 'badge-svg-t', { 'text-anchor': 'middle' }),
    ]));
    box.appendChild(s);
    var lesson = el('div', 'lesson');
    lesson.appendChild(el('span', 'lesson-v', '개발 ≠ 판매'));
    lesson.appendChild(el('span', 'lesson-l', '제품을 만드는 것과 채택·판매되는 것은 다른 문제'));
    box.appendChild(lesson);
  };

  // ---------------------------------------------------------------- 05 flywheel
  VIZ['p02-flywheel'] = function (box) {
    var head = el('div', 'viz-head');
    head.appendChild(el('span', 'badge badge-plan-dark', '계획'));
    head.appendChild(el('span', 'viz-head-t', '다음 도전 · 전통주 거래 플랫폼'));
    box.appendChild(head);
    var s = rootSvg(300, 240, '플랫폼 플라이휠 구상: 유저, 커뮤니티, 마케팅, 판매자가 서로를 키우는 전통주 거래 플랫폼');
    s.appendChild(arrowDefs('p02-fly-arrow'));
    cycle(s, 150, 118, 86, ['유저', '커뮤니티', '마케팅', '판매자'], 'p02-fly-arrow', [70, 84, 76, 76]);
    s.appendChild(text(150, 108, '전통주', 'cap-t', { 'text-anchor': 'middle' }));
    s.appendChild(text(150, 126, '거래 플랫폼', 'cap-s', { 'text-anchor': 'middle' }));
    box.appendChild(s);
    box.appendChild(K.gapTable('p02', 'BONBAB 다음의 갭'));
  };

  // ---------------------------------------------------------------- 06 service (plan)
  VIZ['p02-service'] = function (box) {
    var head = el('div', 'viz-head');
    head.appendChild(el('span', 'badge badge-plan-dark', '계획'));
    head.appendChild(el('span', 'viz-head-t', '전통주 직거래 플랫폼 · 양조장 ↔ 고객'));
    box.appendChild(head);

    var s = rootSvg(300, 262, '구상한 플랫폼: 소규모 양조장과 고객을 유통 단계 없이 잇고, 생생한 리뷰와 쉬운 리뷰를 AI가 요약해 고객 취향과 매칭');
    s.appendChild(arrowDefs('p02s-arrow'));
    function link(d, cls) { s.appendChild(svg('path', { d: d, class: 'svc-link' + (cls ? ' ' + cls : ''), 'marker-end': 'url(#p02s-arrow)' })); }

    // the middlemen this platform skips
    s.appendChild(svg('g', { class: 'svc-skip' }, [
      svg('rect', { x: 92, y: 4, width: 116, height: 22, rx: 4 }),
      text(150, 19, '여러 유통 단계', 'svc-t small skip-t', { 'text-anchor': 'middle' }),
      svg('line', { x1: 96, y1: 15, x2: 204, y2: 15, class: 'svc-strike' }),
    ]));
    s.appendChild(text(150, 42, '직거래', 'lbl lbl-hot', { 'text-anchor': 'middle' }));

    [44, 104, 164].forEach(function (y) {
      s.appendChild(svg('g', { class: 'svc-node seller' }, [
        svg('rect', { x: 6, y: y - 14, width: 68, height: 28, rx: 6 }),
        text(40, y + 4.5, '양조장', 'svc-t small', { 'text-anchor': 'middle' }),
      ]));
    });
    [70, 150].forEach(function (y) {
      s.appendChild(svg('g', { class: 'svc-node user' }, [
        svg('circle', { cx: 268, cy: y, r: 24 }),
        text(268, y + 4.5, '고객', 'svc-t', { 'text-anchor': 'middle' }),
      ]));
    });
    link('M74,44 Q108,52 122,84');
    link('M74,104 L116,106');
    link('M74,164 Q108,156 122,128');
    link('M198,92 Q222,74 242,72');
    link('M198,122 Q222,140 242,146');
    s.appendChild(svg('g', { class: 'svc-node hub' }, [
      svg('circle', { cx: 158, cy: 106, r: 42 }),
      text(158, 98, 'AI', 'svc-t hub-t', { 'text-anchor': 'middle' }),
      text(158, 113, '리뷰 요약', 'cap-s', { 'text-anchor': 'middle' }),
      text(158, 127, '취향 매칭', 'cap-s', { 'text-anchor': 'middle' }),
    ]));

    // reviews flow back into the AI
    [['생생한 리뷰', 104], ['쉬운 리뷰', 206]].forEach(function (r) {
      s.appendChild(svg('g', { class: 'svc-pill' }, [
        svg('rect', { x: r[1] - 42, y: 198, width: 84, height: 24, rx: 12 }),
        text(r[1], 214, r[0], 'svc-t small', { 'text-anchor': 'middle' }),
      ]));
    });
    link('M256,174 Q258,200 250,208', 'loop');
    link('M110,196 Q118,170 134,144', 'loop');
    link('M200,196 Q192,170 180,144', 'loop');
    s.appendChild(text(150, 244, 'AI가 전체 리뷰 반응·평가와 맛 특징을 요약', 'cap-s', { 'text-anchor': 'middle' }));
    box.appendChild(s);

    var dl = el('dl', 'svc-values');
    [['양조장', '브랜드가 아니라 맛으로 승부'],
     ['고객', '유통 단계를 줄여 저렴하게, 취향에 딱 맞는 전통주'],
     ['AI', '리뷰를 일일이 읽지 않아도 전체 반응과 맛 특징을 한눈에']].forEach(function (v) {
      dl.appendChild(el('dt', null, v[0]));
      dl.appendChild(el('dd', null, v[1]));
    });
    box.appendChild(dl);
  };
})(typeof window !== 'undefined' ? window : this);
