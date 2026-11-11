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

  var PITCH_LINES =
    '<svg class="hero-pitch" viewBox="0 0 680 1050" aria-hidden="true" focusable="false">' +
    '<g fill="none" stroke="currentColor" stroke-width="3">' +
    '<rect x="20" y="20" width="640" height="1010" rx="2"/>' +
    '<line x1="20" y1="525" x2="660" y2="525"/>' +
    '<circle cx="340" cy="525" r="91"/>' +
    '<rect x="138" y="20" width="404" height="165"/><rect x="248" y="20" width="184" height="55"/>' +
    '<rect x="138" y="865" width="404" height="165"/><rect x="248" y="975" width="184" height="55"/>' +
    '<path d="M268 185 A91 91 0 0 0 412 185"/><path d="M268 865 A91 91 0 0 1 412 865"/>' +
    '</g></svg>';

  function renderHero(doc, C) {
    var hero = doc.getElementById('hero');
    hero.textContent = '';
    var inner = h(doc, 'div', 'hero-inner');
    inner.insertAdjacentHTML('beforeend', PITCH_LINES);
    inner.appendChild(h(doc, 'p', 'hero-label', C.meta.label));
    var name = h(doc, 'h1', 'hero-name');
    name.appendChild(h(doc, 'span', 'ko', C.meta.nameKo));
    name.appendChild(h(doc, 'span', 'en', C.meta.nameEn));
    inner.appendChild(name);
    inner.appendChild(h(doc, 'p', 'hero-tagline', C.meta.tagline));
    var tracks = h(doc, 'div', 'tracks');
    C.tracks.forEach(function (t) { tracks.appendChild(h(doc, 'span', 'track' + (t.primary ? ' is-primary' : ''), t.label)); });
    inner.appendChild(tracks);
    var cards = h(doc, 'div', 'hero-cards');
    C.projects.forEach(function (p) {
      var a = h(doc, 'a', 'hero-card');
      a.href = '#' + p.id;
      a.appendChild(h(doc, 'span', 'hc-no', 'PROJECT ' + p.no));
      a.appendChild(h(doc, 'span', 'hc-title', p.title));
      a.appendChild(h(doc, 'span', 'hc-sub', p.subtitle));
      var arrow = h(doc, 'span', 'hc-arrow', '→');
      arrow.setAttribute('aria-hidden', 'true');
      a.appendChild(arrow);
      cards.appendChild(a);
    });
    inner.appendChild(cards);
    hero.appendChild(inner);
  }

  var PROJECT_TAG = { p01: '논문', p02: 'BONBAB', all: '공통' };

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
    titles.appendChild(h(doc, 'p', 'proj-sub', '두 프로젝트가 남긴 갭을, AIGEN의 자원으로'));
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
      tdP.appendChild(h(doc, 'span', 'proj-tag tag-' + m.project, PROJECT_TAG[m.project]));
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
    card2.appendChild(h(doc, 'h3', 'next-card-t', '22개월 로드맵'));
    var ol = h(doc, 'ol', 'roadmap');
    C.next.roadmap.forEach(function (r) {
      var li = h(doc, 'li');
      li.appendChild(h(doc, 'span', 'phase', r.phase));
      var items = h(doc, 'ul', 'phase-items');
      r.items.forEach(function (it) {
        var item = h(doc, 'li');
        item.dataset.project = it.project;
        item.appendChild(h(doc, 'span', 'proj-tag tag-' + it.project, PROJECT_TAG[it.project]));
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
    renderHero(doc, C);
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
    return { grids: grids };
  }

  root.renderAll = renderAll;
})(typeof window !== 'undefined' ? window : this);
