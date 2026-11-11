/* content → DOM for hero, projects, next, footer. */
(function (root) {
  function h(doc, tag, cls, text) {
    var el = doc.createElement(tag);
    if (cls) el.className = cls;
    if (text != null) el.textContent = text;
    return el;
  }

  function scrollToId(id) {
    var el = root.document.getElementById(id);
    if (!el || !el.scrollIntoView) return;
    var reduce = !!(root.matchMedia && root.matchMedia('(prefers-reduced-motion: reduce)').matches);
    el.scrollIntoView({ block: 'start', behavior: reduce ? 'auto' : 'smooth' });
  }

  function pbO(x, y, n, gk) {
    return '<g class="pb-o' + (gk ? ' pb-gk' : '') + '" data-y="' + y + '"><circle cx="' + x + '" cy="' + y + '" r="22"/>' +
      '<text x="' + x + '" y="' + (y + 8) + '">' + n + '</text></g>';
  }
  function pbX(x, y, gk) {
    return '<g class="pb-x' + (gk ? ' pb-gk' : '') + '" data-y="' + y + '"><path d="M' + (x - 13) + ' ' + (y - 13) + ' l26 26 m0 -26 l-26 26"/></g>';
  }

  // Hero illustrations — static, author-written SVG (no user input), so insertAdjacentHTML is safe here.
  // 1지망: tactics playbook (O = attack, X = defence, dashed = off-ball runs, solid = pass).
  var ART_PLAYBOOK =
    '<svg class="hero-art" data-project="p01" viewBox="0 0 680 1050" aria-hidden="true" focusable="false">' +
    '<defs>' +
    '<marker id="pb-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="pb-head"/></marker>' +
    '<marker id="pb-head-def" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="pb-head-def"/></marker>' +
    '</defs>' +
    '<g class="pb-lines" fill="none" stroke-width="3">' +
    '<rect x="20" y="20" width="640" height="1010" rx="2"/><line x1="20" y1="525" x2="660" y2="525"/>' +
    '<circle cx="340" cy="525" r="91"/><rect x="138" y="20" width="404" height="165"/><rect x="248" y="20" width="184" height="55"/>' +
    '<rect x="138" y="865" width="404" height="165"/><rect x="248" y="975" width="184" height="55"/>' +
    '<path d="M268 185 A91 91 0 0 0 412 185"/><path d="M268 865 A91 91 0 0 1 412 865"/></g>' +
    // defensive off-ball (X): covering + forcing the attacker's direction
    '<path class="pb-arrow def" d="M392 246 Q376 262 356 272" marker-end="url(#pb-head-def)"/>' +
    '<path class="pb-arrow def" d="M420 386 Q440 410 452 440" marker-end="url(#pb-head-def)"/>' +
    '<path class="pb-arrow def" d="M286 386 Q300 400 318 412" marker-end="url(#pb-head-def)"/>' +
    '<path class="pb-arrow def" d="M310 576 Q318 592 322 604" marker-end="url(#pb-head-def)"/>' +
    // attacking: pass (solid) + off-ball runs (dashed)
    '<path class="pb-arrow pass" d="M362 616 L456 554" marker-end="url(#pb-head)"/>' +
    '<path class="pb-arrow run" d="M344 404 C352 350 338 300 330 252" marker-end="url(#pb-head)"/>' +
    '<path class="pb-arrow run" d="M566 366 C590 320 600 280 596 230" marker-end="url(#pb-head)"/>' +
    '<path class="pb-arrow run" d="M128 376 C140 330 150 300 166 272" marker-end="url(#pb-head)"/>' +
    // attacking team (O), 4-3-3, attacking upwards; goalkeeper in its own goal area
    pbO(340, 990, 1, true) + pbO(130, 700, 2) + pbO(270, 760, 4) + pbO(410, 760, 5) + pbO(550, 690, 3) +
    pbO(200, 560, 6) + pbO(340, 628, 10) + pbO(480, 540, 8) +
    pbO(120, 400, 11) + pbO(344, 430, 9) + pbO(560, 390, 7) +
    // defending team (X), 4-4-2; goalkeeper near the top goal
    pbX(340, 62, true) + pbX(170, 250) + pbX(290, 230) + pbX(400, 230) + pbX(520, 260) +
    pbX(178, 446) + pbX(280, 370) + pbX(410, 370) + pbX(500, 446) +
    pbX(300, 560) + pbX(420, 556) +
    '</svg>';

  // 2지망: brewery-direct marketplace in the same line style (breweries → AI matching → customers, reviews loop back).
  var ART_NETWORK =
    '<svg class="hero-art" data-project="p02" viewBox="0 0 680 1050" aria-hidden="true" focusable="false">' +
    '<defs><marker id="net-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" class="pb-head"/></marker></defs>' +
    '<g class="net-grid" fill="none" stroke-width="1.5"><circle cx="340" cy="525" r="300"/><circle cx="340" cy="525" r="190"/></g>' +
    '<g class="net-links" fill="none">' +
    '<path d="M192 300 Q250 380 296 468" marker-end="url(#net-head)"/><path d="M136 522 L262 525" marker-end="url(#net-head)"/>' +
    '<path d="M192 756 Q250 680 296 582" marker-end="url(#net-head)"/>' +
    '<path d="M396 468 Q450 380 524 300" marker-end="url(#net-head)"/><path d="M414 525 L568 525" marker-end="url(#net-head)"/>' +
    '<path d="M396 582 Q450 680 524 752" marker-end="url(#net-head)"/>' +
    '<path class="loop" d="M552 808 C500 900 460 900 432 892" marker-end="url(#net-head)"/>' +
    '<path class="loop" d="M300 852 C300 780 316 700 330 602" marker-end="url(#net-head)"/></g>' +
    '<g class="net-node hub"><circle cx="340" cy="525" r="74"/>' +
    '<path class="bottle" d="M330 476 h20 v24 q14 10 14 30 v34 h-48 v-34 q0 -20 14 -30 z"/></g>' +
    '<text class="net-t hub-t" x="340" y="630">전통주</text>' +
    '<g class="net-node seller"><rect x="96" y="262" width="96" height="64" rx="10"/><text class="net-t" x="144" y="302">양조장</text></g>' +
    '<g class="net-node seller"><rect x="40" y="490" width="96" height="64" rx="10"/><text class="net-t" x="88" y="530">양조장</text></g>' +
    '<g class="net-node seller"><rect x="96" y="724" width="96" height="64" rx="10"/><text class="net-t" x="144" y="764">양조장</text></g>' +
    '<g class="net-node user"><circle cx="560" cy="282" r="38"/><text class="net-t" x="560" y="290">고객</text></g>' +
    '<g class="net-node user"><circle cx="610" cy="525" r="38"/><text class="net-t" x="610" y="533">고객</text></g>' +
    '<g class="net-node user"><circle cx="560" cy="770" r="38"/><text class="net-t" x="560" y="778">고객</text></g>' +
    '<g class="net-node loopnode"><rect x="240" y="852" width="200" height="56" rx="28"/><text class="net-t" x="340" y="888">리뷰 · AI 요약</text></g>' +
    '</svg>';

  function renderHero(doc, C) {
    var hero = doc.getElementById('hero');
    hero.textContent = '';
    var inner = h(doc, 'div', 'hero-inner');
    var art = h(doc, 'div', 'hero-art-wrap');
    art.insertAdjacentHTML('beforeend', ART_PLAYBOOK + ART_NETWORK);
    inner.appendChild(art);
    inner.appendChild(h(doc, 'p', 'hero-label', C.meta.label));
    var name = h(doc, 'h1', 'hero-name');
    name.appendChild(h(doc, 'span', 'ko', C.meta.nameKo));
    name.appendChild(h(doc, 'span', 'en', C.meta.nameEn));
    inner.appendChild(name);
    var tagline = h(doc, 'p', 'hero-tagline');
    tagline.setAttribute('aria-live', 'polite');
    inner.appendChild(tagline);

    var tracks = h(doc, 'div', 'tracks');
    tracks.setAttribute('role', 'group');
    tracks.setAttribute('aria-label', '지망 선택');
    var buttons = C.tracks.map(function (t) {
      var b = h(doc, 'button', 'track', t.label);
      b.type = 'button';
      b.dataset.project = t.project;
      tracks.appendChild(b);
      return b;
    });
    inner.appendChild(tracks);
    inner.appendChild(h(doc, 'p', 'hero-note', C.meta.choiceNote));

    var cards = h(doc, 'div', 'hero-cards');
    var cardEls = C.projects.map(function (p, i) {
      var a = h(doc, 'a', 'hero-card');
      a.href = '#' + p.id;
      a.dataset.project = p.id;
      a.appendChild(h(doc, 'span', 'hc-no', 'PROJECT ' + p.no + ' · ' + C.tracks[i].plan));
      a.appendChild(h(doc, 'span', 'hc-title', p.title));
      a.appendChild(h(doc, 'span', 'hc-sub', p.subtitle));
      var arrow = h(doc, 'span', 'hc-arrow', '→');
      arrow.setAttribute('aria-hidden', 'true');
      a.appendChild(arrow);
      cards.appendChild(a);
      return a;
    });
    inner.appendChild(cards);
    hero.appendChild(inner);

    var arts = Array.prototype.slice.call(art.querySelectorAll('.hero-art'));
    function select(pid) {
      buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.project === pid ? 'true' : 'false'); });
      cardEls.forEach(function (c) { c.classList.toggle('is-selected', c.dataset.project === pid); });
      arts.forEach(function (s) { s.classList.toggle('is-active', s.dataset.project === pid); });
      tagline.textContent = C.meta.taglines[pid];
      hero.dataset.selected = pid;
    }
    buttons.forEach(function (b) { b.addEventListener('click', function () { select(b.dataset.project); }); });
    select(C.tracks[0].project);
    return { select: select };
  }

  var MATRIX_TAG = { p01: '프로젝트 1', p02: '프로젝트 2' };
  var ROAD_TAG = { p01: '1안 · 프로젝트 1', p02: '2안 · 프로젝트 2', all: '1안·2안 공통' };

  function renderNext(doc, C) {
    var sec = doc.getElementById('next');
    sec.textContent = '';
    var head = h(doc, 'header', 'proj-head');
    var titles = h(doc, 'div', 'proj-titles');
    var label = h(doc, 'p', 'proj-label', 'NEXT ');
    label.appendChild(h(doc, 'span', 'badge badge-plan', '계획'));
    titles.appendChild(label);
    var h2 = h(doc, 'h2', 'proj-title', 'Next with AIGEN');
    h2.id = 'next-title';
    titles.appendChild(h2);
    titles.appendChild(h(doc, 'p', 'proj-sub', '지망에 따라 1안 또는 2안 중 하나를 선택해, 남은 갭을 AIGEN의 자원으로 메웁니다'));
    head.appendChild(titles);
    sec.appendChild(head);

    var wrap = h(doc, 'div', 'next-grid');

    var card1 = h(doc, 'div', 'next-card');
    card1.appendChild(h(doc, 'h3', 'next-card-t', '갭 ↔ AIGEN 자원'));
    var table = h(doc, 'table', 'gap-matrix');
    var thead = h(doc, 'thead');
    var trh = h(doc, 'tr');
    ['프로젝트', '갭', '메울 AIGEN 자원'].forEach(function (t) { trh.appendChild(h(doc, 'th', null, t)); });
    thead.appendChild(trh);
    table.appendChild(thead);
    var tb = h(doc, 'tbody');
    C.next.matrix.forEach(function (m) {
      var tr = h(doc, 'tr');
      var tdP = h(doc, 'td');
      tdP.appendChild(h(doc, 'span', 'proj-tag tag-' + m.project, MATRIX_TAG[m.project]));
      tr.appendChild(tdP);
      tr.appendChild(h(doc, 'td', null, m.gap));
      var tdR = h(doc, 'td');
      tdR.appendChild(h(doc, 'span', 'res-chip light', m.resource));
      tr.appendChild(tdR);
      tb.appendChild(tr);
    });
    table.appendChild(tb);
    card1.appendChild(table);
    wrap.appendChild(card1);

    var card2 = h(doc, 'div', 'next-card');
    card2.appendChild(h(doc, 'h3', 'next-card-t', '22개월 로드맵 · 1안 / 2안'));
    var ol = h(doc, 'ol', 'roadmap');
    C.next.roadmap.forEach(function (r) {
      var li = h(doc, 'li');
      li.appendChild(h(doc, 'span', 'phase', r.phase));
      var items = h(doc, 'ul', 'phase-items');
      r.items.forEach(function (it) {
        var item = h(doc, 'li');
        item.dataset.project = it.project;
        item.appendChild(h(doc, 'span', 'proj-tag tag-' + it.project, ROAD_TAG[it.project]));
        item.appendChild(h(doc, 'span', 'phase-text', it.text));
        items.appendChild(item);
      });
      li.appendChild(items);
      ol.appendChild(li);
    });
    card2.appendChild(ol);
    wrap.appendChild(card2);
    sec.appendChild(wrap);
  }

  function renderFooter(doc, C) {
    var f = doc.getElementById('contact');
    f.textContent = '';
    var inner = h(doc, 'div', 'contact-inner');
    var who = h(doc, 'div', 'contact-who');
    who.appendChild(h(doc, 'p', 'contact-name', C.meta.nameKo + ' · ' + C.meta.nameEn));
    who.appendChild(h(doc, 'p', 'contact-label', C.meta.label));
    inner.appendChild(who);
    var ul = h(doc, 'ul', 'contact-links');
    [['LinkedIn', C.links.linkedin], ['GitHub', C.links.github], ['석사 논문 코드', C.links.repoThesis], ['BONBAB 앱 코드', C.links.repoBonbab]].forEach(function (l) {
      var li = h(doc, 'li');
      var a = h(doc, 'a', null, l[0] + ' ↗');
      a.href = l[1];
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      li.appendChild(a);
      ul.appendChild(li);
    });
    inner.appendChild(ul);
    var attr = h(doc, 'p', 'contact-attr');
    var src = h(doc, 'a', null, C.demo.attribution);
    src.href = C.demo.datasetUrl;
    src.target = '_blank';
    src.rel = 'noopener noreferrer';
    attr.appendChild(src);
    inner.appendChild(attr);
    f.appendChild(inner);
  }

  root.renderNext = renderNext;
  root.renderFooter = renderFooter;

  function renderAll(C) {
    var doc = root.document;
    var hero = renderHero(doc, C);
    var grids = {};
    var lastTargets = { p01: 'p02', p02: 'next' };
    var lastLabels = { p01: 'Project 02 · ' + C.projects[1].title + ' →', p02: 'Next with AIGEN →' };
    C.projects.forEach(function (p) {
      var section = doc.getElementById(p.id);
      grids[p.id] = root.createStepGrid(section, p, {
        lastNextLabel: lastLabels[p.id],
        onLastNext: function () { scrollToId(lastTargets[p.id]); },
      });
    });
    if (root.renderNext) root.renderNext(doc, C);
    if (root.renderFooter) root.renderFooter(doc, C);
    return { grids: grids, hero: hero };
  }

  root.renderAll = renderAll;
})(typeof window !== 'undefined' ? window : this);
