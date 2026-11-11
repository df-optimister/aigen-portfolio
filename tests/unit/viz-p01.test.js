const test = require('node:test');
const assert = require('node:assert/strict');
const { makeDom, BASE_SCRIPTS } = require('./helpers/dom');

const IDS = ['p01-pitch', 'p01-pipeline', 'p01-results', 'p01-snapshot', 'p01-roadmap', 'p01-service'];

function draw(id) {
  const w = makeDom([...BASE_SCRIPTS, 'js/viz/p01.js']);
  const el = w.document.createElement('div');
  w.document.body.appendChild(el);
  w.VIZ[id](el);
  return { w, el };
}

test('all six p01 builders registered', () => {
  const w = makeDom([...BASE_SCRIPTS, 'js/viz/p01.js']);
  for (const id of IDS) assert.equal(typeof w.VIZ[id], 'function', id);
});

test('VIZKIT helpers exist', () => {
  const w = makeDom([...BASE_SCRIPTS, 'js/viz/p01.js']);
  assert.equal(typeof w.VIZKIT.svg, 'function');
  const g = w.VIZKIT.pitch(210, 136);
  assert.equal(g.tagName.toLowerCase(), 'g');
  assert.ok(g.querySelectorAll('rect, line, circle, path').length >= 5);
});

for (const id of IDS) {
  test(`${id} draws an accessible svg`, () => {
    const { el } = draw(id);
    const svg = el.querySelector('svg[role="img"]');
    assert.ok(svg, 'svg[role=img] missing');
    assert.ok((svg.getAttribute('aria-label') || '').length > 5);
    assert.ok(svg.getAttribute('viewBox'));
  });
}

test('p01-results shows exact numbers and lower-is-better note', () => {
  const { el } = draw('p01-results');
  const t = el.textContent;
  for (const v of ['0.847', '0.812', '0.0481', '0.0574', '0.0707', '낮을수록 좋음', '76']) assert.ok(t.includes(v), v);
  assert.ok(!t.includes('xG'));
});

test('p01-results bars start at zero and are proportional', () => {
  const { el } = draw('p01-results');
  const bars = Array.from(el.querySelectorAll('rect.bar'));
  assert.equal(bars.length, 3);
  const x0 = Number(el.querySelector('[data-axis-zero]').getAttribute('data-axis-zero'));
  const data = bars.map((b) => ({ v: Number(b.dataset.value), x: Number(b.getAttribute('x')), w: Number(b.getAttribute('width')) }));
  data.forEach((d) => assert.equal(d.x, x0));
  const k = data[0].w / data[0].v;
  data.forEach((d) => assert.ok(Math.abs(d.w / d.v - k) / k < 0.01, `bar ${d.v} not proportional`));
  assert.deepEqual(data.map((d) => d.v), [0.0481, 0.0574, 0.0707]);
  assert.ok(bars[0].classList.contains('is-chosen'));
});

test('p01-pitch toggle lights off-ball players', () => {
  const { el } = draw('p01-pitch');
  const btn = el.querySelector('button.viz-toggle');
  assert.equal(btn.getAttribute('aria-pressed'), 'false');
  const offBefore = el.querySelectorAll('.dot-off').length;
  assert.ok(offBefore >= 8);
  assert.equal(el.querySelectorAll('.dot-ball').length, 1);
  assert.ok(el.textContent.includes('평가 밖'));
  btn.click();
  assert.equal(btn.getAttribute('aria-pressed'), 'true');
  assert.equal(el.querySelectorAll('.dot-off').length, 0);
  assert.equal(el.querySelectorAll('.dot-on').length, offBefore);
  btn.click();
  assert.equal(el.querySelectorAll('.dot-off').length, offBefore);
});

test('p01-pipeline names every stage', () => {
  const { el } = draw('p01-pipeline');
  for (const s of ['이벤트 데이터', 'StatsBomb 360', '무결성 검사', '공간 변수', 'CatBoost', 'VAEP']) assert.ok(el.textContent.includes(s), s);
});

test('p01-snapshot contrasts snapshot and continuous tracking', () => {
  const { el } = draw('p01-snapshot');
  assert.ok(el.textContent.includes('스냅샷'));
  assert.ok(el.textContent.includes('연속'));
  assert.ok(el.querySelector('polygon.visible-area'));
  assert.ok(el.querySelectorAll('polyline.trail').length >= 3);
});

test('p01-roadmap has stages, AI marks, gap table and video mount', () => {
  const { w, el } = draw('p01-roadmap');
  for (const s of ['영상', '탐지·추적', '카메라 보정', '움직임 분류', '지표·스카우팅 리포트']) assert.ok(el.textContent.includes(s), s);
  assert.ok(el.querySelectorAll('.ai-mark').length >= 4);
  assert.ok(el.querySelector('.video-demo-mount'));
  const rows = el.querySelectorAll('table.gap-table tbody tr');
  assert.equal(rows.length, w.PORTFOLIO_CONTENT.next.matrix.filter((m) => m.project === 'p01').length);
});

test('p01-roadmap classifies attacking and defensive off-ball movement', () => {
  const { el } = draw('p01-roadmap');
  assert.ok(el.textContent.includes('수비'));
});

test('p01-service shows attack and defence off-ball evaluation and outputs', () => {
  const { el } = draw('p01-service');
  const t = el.textContent;
  for (const s of ['공격', '수비', '침투', '공간 창출', '수비 커버', '방향 제한', '스카우팅 리포트']) assert.ok(t.includes(s), s);
  assert.ok(el.querySelectorAll('.atk-arrow').length >= 2);
  assert.ok(el.querySelectorAll('.def-arrow').length >= 2);
});

test('p01-service is labelled as a SaaS and not as an unbuilt idea', () => {
  const { el } = draw('p01-service');
  assert.ok(el.textContent.includes('SaaS'));
  assert.ok(!el.textContent.includes('아직 만들지 않은'));
});
