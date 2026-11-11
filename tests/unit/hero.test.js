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
  assert.ok(a.querySelector('.pb-arrow') && a.querySelectorAll('.pb-o, .pb-x').length >= 8, 'playbook needs players and arrows');
  assert.ok(b.querySelectorAll('.net-node').length >= 4, 'network needs nodes');
  for (const svg of [a, b]) assert.equal(svg.getAttribute('aria-hidden'), 'true');
});
