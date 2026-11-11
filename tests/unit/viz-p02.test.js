const test = require('node:test');
const assert = require('node:assert/strict');
const { makeDom, BASE_SCRIPTS } = require('./helpers/dom');

const IDS = ['p02-loop', 'p02-proposal', 'p02-build', 'p02-timeline', 'p02-flywheel'];
const SCRIPTS = [...BASE_SCRIPTS, 'js/viz/p01.js', 'js/viz/p02.js'];

function draw(id) {
  const w = makeDom(SCRIPTS);
  const el = w.document.createElement('div');
  w.document.body.appendChild(el);
  w.VIZ[id](el);
  return { w, el };
}

test('all five p02 builders registered', () => {
  const w = makeDom(SCRIPTS);
  for (const id of IDS) assert.equal(typeof w.VIZ[id], 'function', id);
});

for (const id of IDS) {
  test(`${id} draws an accessible svg`, () => {
    const { el } = draw(id);
    const svg = el.querySelector('svg[role="img"]');
    assert.ok(svg, 'svg[role=img] missing');
    assert.ok((svg.getAttribute('aria-label') || '').length > 5);
  });
}

test('p02-loop shows the vicious cycle and print cost', () => {
  const { el } = draw('p02-loop');
  for (const s of ['쿠폰 받음', '분실·망각', '재발급·포기', '혜택·로열티 저하', '인쇄 비용']) assert.ok(el.textContent.includes(s), s);
});

test('p02-proposal: core solid, extensions dashed as possibility', () => {
  const { el } = draw('p02-proposal');
  assert.ok(el.querySelector('.core'));
  const ext = Array.from(el.querySelectorAll('.ext')).map((e) => e.textContent);
  assert.deepEqual(ext.map((t) => t.trim()), ['선결제', '공지', '피드백']);
  assert.ok(el.textContent.includes('점선 = 가능성'));
});

test('p02-build uses demo values only and shows 14/14 and GDPR', () => {
  const { el } = draw('p02-build');
  const t = el.textContent;
  for (const s of ['14 / 14', 'DEMO', 'QR 스캔', '서버 검증', '스탬프', '2단계 탈퇴']) assert.ok(t.includes(s), s);
  assert.ok(!t.includes('@'));
  assert.ok(!/http/i.test(t));
  assert.ok(!/\d{3,}-\d{3,}/.test(t));
  assert.equal(el.querySelectorAll('image, img').length, 0);
});

test('p02-timeline is honest about the outcome', () => {
  const { el } = draw('p02-timeline');
  for (const s of ['2026-02', '2026-05', '2026-08', '출시 전', '계약 불발', '개발 ≠ 판매']) assert.ok(el.textContent.includes(s), s);
});

test('p02-flywheel is marked as a plan with no market numbers', () => {
  const { w, el } = draw('p02-flywheel');
  const t = el.textContent;
  for (const s of ['유저', '커뮤니티', '마케팅', '판매자', '전통주', '계획']) assert.ok(t.includes(s), s);
  assert.ok(!/\d+\s*(억|조|%)/.test(t));
  const rows = el.querySelectorAll('table.gap-table tbody tr');
  assert.equal(rows.length, w.PORTFOLIO_CONTENT.next.matrix.filter((m) => m.project === 'p02').length);
});
