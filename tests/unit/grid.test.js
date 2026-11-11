const test = require('node:test');
const assert = require('node:assert/strict');
const { makeDom, BASE_SCRIPTS } = require('./helpers/dom');

function setup() {
  const w = makeDom(BASE_SCRIPTS, { boot: true });
  const d = w.document;
  const steps = (pid) => Array.from(d.querySelectorAll(`#${pid} article.step`));
  const head = (pid, i) => steps(pid)[i].querySelector('button.step-head');
  const panel = (pid, i) => steps(pid)[i].querySelector('.step-panel');
  const openIdx = (pid) => steps(pid).map((s, i) => (s.querySelector('.step-panel').hidden ? null : i)).filter((i) => i !== null);
  return { w, d, steps, head, panel, openIdx, grids: w.__app.grids };
}

test('initially all closed', () => {
  const { d } = setup();
  const panels = d.querySelectorAll('.step-panel');
  assert.equal(panels.length, 12);
  panels.forEach((p) => assert.equal(p.hidden, true));
  d.querySelectorAll('button.step-head').forEach((b) => assert.equal(b.getAttribute('aria-expanded'), 'false'));
});

test('head is linked to its panel', () => {
  const { head, panel } = setup();
  assert.equal(head('p01', 2).getAttribute('aria-controls'), panel('p01', 2).id);
});

test('3+3 row structure', () => {
  const { d } = setup();
  for (const pid of ['p01', 'p02']) {
    const rows = d.querySelectorAll(`#${pid} .step-row.r3`);
    assert.equal(rows.length, 2);
    rows.forEach((r) => assert.equal(r.querySelectorAll(':scope > article.step').length, 3));
    assert.equal(d.querySelectorAll(`#${pid} .step-row.r2`).length, 0);
  }
});

test('toggle opens only that step and stays open', () => {
  const { grids, openIdx } = setup();
  grids.p01.toggle(1);
  assert.deepEqual(openIdx('p01'), [1]);
  grids.p01.toggle(2);
  assert.deepEqual(openIdx('p01'), [1, 2]);
  assert.deepEqual(openIdx('p02'), []);
});

test('click same head again closes', () => {
  const { head, openIdx } = setup();
  head('p02', 3).click();
  assert.deepEqual(openIdx('p02'), [3]);
  assert.equal(head('p02', 3).getAttribute('aria-expanded'), 'true');
  head('p02', 3).click();
  assert.deepEqual(openIdx('p02'), []);
  assert.equal(head('p02', 3).getAttribute('aria-expanded'), 'false');
});

test('next opens following without closing current', () => {
  const { head, panel, openIdx } = setup();
  head('p01', 0).click();
  panel('p01', 0).querySelector('button.step-next').click();
  assert.deepEqual(openIdx('p01'), [0, 1]);
});

test('next button names the following step', () => {
  const { panel } = setup();
  assert.match(panel('p01', 0).querySelector('button.step-next').textContent, /도전 과정과 부여한 가치/);
});

test('last next calls onLastNext target', () => {
  const { w, d, panel } = setup();
  let target = null;
  w.HTMLElement.prototype.scrollIntoView = function () { target = this.id; };
  panel('p01', 5).querySelector('button.step-next').click();
  assert.equal(target, 'p02');
  panel('p02', 5).querySelector('button.step-next').click();
  assert.equal(target, 'next');
  assert.ok(d);
});

test('expand-all toggles all six and relabels', () => {
  const { d, openIdx } = setup();
  const btn = d.querySelector('#p01 button.expand-all');
  assert.equal(btn.textContent.trim(), '6단계 모두 펼치기');
  btn.click();
  assert.deepEqual(openIdx('p01'), [0, 1, 2, 3, 4, 5]);
  assert.equal(btn.textContent.trim(), '모두 접기');
  btn.click();
  assert.deepEqual(openIdx('p01'), []);
  assert.equal(btn.textContent.trim(), '6단계 모두 펼치기');
});

test('expand-all label follows manual toggles', () => {
  const { d, grids } = setup();
  [0, 1, 2, 3, 4, 5].forEach((i) => grids.p02.toggle(i));
  assert.equal(d.querySelector('#p02 button.expand-all').textContent.trim(), '모두 접기');
});

test('heads are real buttons (keyboard Enter/Space)', () => {
  const { d } = setup();
  d.querySelectorAll('.step-head').forEach((b) => {
    assert.equal(b.tagName, 'BUTTON');
    assert.equal(b.getAttribute('type'), 'button');
  });
});

test('viz rendered lazily once', () => {
  const { w, panel, grids } = setup();
  let calls = 0;
  w.VIZ['p01-pipeline'] = (el) => { calls++; el.appendChild(w.document.createElement('svg')); };
  const board = panel('p01', 1).querySelector('.board');
  assert.equal(board.children.length, 0);
  grids.p01.toggle(1);
  assert.equal(board.dataset.rendered, '1');
  grids.p01.toggle(1);
  grids.p01.toggle(1);
  assert.equal(calls, 1);
  assert.equal(board.children.length, 1);
});

test('unregistered viz gets placeholder, no throw', () => {
  const { panel, grids } = setup();
  grids.p02.toggle(0);
  const board = panel('p02', 0).querySelector('.board');
  assert.equal(board.dataset.vizMissing, 'p02-loop');
});

test('renderAllViz renders every board', () => {
  const { d, grids } = setup();
  grids.p01.renderAllViz();
  d.querySelectorAll('#p01 .board').forEach((b) => assert.equal(b.dataset.rendered, '1'));
});

test('plan badge only on steps 05 and 06', () => {
  const { steps } = setup();
  for (const pid of ['p01', 'p02']) {
    const badges = steps(pid).map((s) => !!s.querySelector('.step-head .badge-plan'));
    assert.deepEqual(badges, [false, false, false, false, true, true]);
  }
});

test('tile shows number, name, impact and all keywords', () => {
  const { w, steps } = setup();
  const s = w.PORTFOLIO_CONTENT.projects[0].steps[2];
  const h = steps('p01')[2].querySelector('.step-head');
  assert.match(h.textContent, /03/);
  assert.match(h.textContent, new RegExp(s.name));
  assert.ok(h.textContent.includes(s.impact));
  assert.equal(h.querySelectorAll('.chip').length, s.keywords.length);
});

test('panel lists every bullet', () => {
  const { w, panel } = setup();
  const s = w.PORTFOLIO_CONTENT.projects[1].steps[2];
  const lis = Array.from(panel('p02', 2).querySelectorAll('ul.bullets li')).map((li) => li.textContent);
  assert.deepEqual(lis, Array.from(s.bullets));
});
