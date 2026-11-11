const test = require('node:test');
const assert = require('node:assert/strict');
const { makeDom, BASE_SCRIPTS } = require('./helpers/dom');

function setup() {
  const w = makeDom(BASE_SCRIPTS, { boot: true });
  const d = w.document;
  const hero = d.getElementById('hero');
  return {
    w, d, hero, C: w.PORTFOLIO_CONTENT,
    tracks: () => Array.from(hero.querySelectorAll('button.track')),
    cards: () => Array.from(hero.querySelectorAll('a.hero-card')),
    tagline: () => hero.querySelector('.hero-tagline').textContent,
    art: () => Array.from(hero.querySelectorAll('.hero-art')),
  };
}

test('hero renders name, label, choice note and two project cards', () => {
  const { hero, C, cards } = setup();
  for (const t of [C.meta.label, C.meta.nameKo, C.meta.nameEn, C.meta.choiceNote]) assert.ok(hero.textContent.includes(t), t);
  assert.deepEqual(cards().map((a) => a.getAttribute('href')), ['#p01', '#p02']);
});

test('track badges are toggle buttons, 1지망 selected by default', () => {
  const { tracks, cards, tagline, art, C } = setup();
  const t = tracks();
  assert.equal(t.length, 2);
  t.forEach((b) => assert.equal(b.getAttribute('type'), 'button'));
  assert.deepEqual(t.map((b) => b.getAttribute('aria-pressed')), ['true', 'false']);
  assert.deepEqual(cards().map((c) => c.classList.contains('is-selected')), [true, false]);
  assert.equal(tagline(), C.meta.taglines.p01);
  assert.deepEqual(art().map((a) => a.classList.contains('is-active')), [true, false]);
});

test('clicking 2지망 switches badge, card, tagline and art', () => {
  const { tracks, cards, tagline, art, C } = setup();
  tracks()[1].click();
  assert.deepEqual(tracks().map((b) => b.getAttribute('aria-pressed')), ['false', 'true']);
  assert.deepEqual(cards().map((c) => c.classList.contains('is-selected')), [false, true]);
  assert.equal(tagline(), C.meta.taglines.p02);
  assert.deepEqual(art().map((a) => a.dataset.project), ['p01', 'p02']);
  assert.deepEqual(art().map((a) => a.classList.contains('is-active')), [false, true]);
  tracks()[0].click();
  assert.equal(tagline(), C.meta.taglines.p01);
  assert.deepEqual(art().map((a) => a.classList.contains('is-active')), [true, false]);
});

test('tagline is announced politely when it changes', () => {
  const { hero } = setup();
  assert.equal(hero.querySelector('.hero-tagline').getAttribute('aria-live'), 'polite');
});

test('hero art: playbook pitch for 1지망, platform network for 2지망', () => {
  const { art } = setup();
  const [a, b] = art();
  assert.ok(a.querySelector('.pb-arrow'), 'playbook needs arrows');
  assert.ok(b.querySelectorAll('.net-node').length >= 4, 'network needs nodes');
  for (const svg of [a, b]) assert.equal(svg.getAttribute('aria-hidden'), 'true');
});

test('playbook shows 11 players per team, goalkeepers coloured apart near their goals', () => {
  const { art } = setup();
  const pb = art()[0];
  assert.equal(pb.querySelectorAll('g.pb-o').length, 11);
  assert.equal(pb.querySelectorAll('g.pb-x').length, 11);
  const gk = Array.from(pb.querySelectorAll('g.pb-gk'));
  assert.equal(gk.length, 2);
  assert.equal(gk.filter((g) => g.classList.contains('pb-o')).length, 1);
  assert.equal(gk.filter((g) => g.classList.contains('pb-x')).length, 1);
  // pitch box spans y 20..1030 in the viewBox; goal areas end at 75 / 975
  gk.forEach((g) => {
    const y = Number(g.dataset.y);
    assert.ok(y < 120 || y > 930, `goalkeeper at y=${y} is not near a goal`);
  });
});

test('2지망 network: breweries, customers, AI review summary', () => {
  const { art } = setup();
  const t = art()[1].textContent;
  for (const s of ['양조장', '고객', 'AI', '리뷰']) assert.ok(t.includes(s), s);
});
