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
