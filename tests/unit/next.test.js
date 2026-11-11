const test = require('node:test');
const assert = require('node:assert/strict');
const { makeDom, BASE_SCRIPTS } = require('./helpers/dom');

function setup() {
  const w = makeDom(BASE_SCRIPTS, { boot: true });
  return { w, d: w.document, C: w.PORTFOLIO_CONTENT };
}

test('next section keeps its labelled heading', () => {
  const { d } = setup();
  const h2 = d.querySelector('#next h2#next-title');
  assert.ok(h2);
  assert.match(h2.textContent, /Next with AIGEN/);
});

test('gap matrix rows mirror content and use only the three resources', () => {
  const { d, C } = setup();
  const rows = Array.from(d.querySelectorAll('#next table.gap-matrix tbody tr'));
  assert.equal(rows.length, C.next.matrix.length);
  const R = ['현장 전문가 멘토', '동료 교류·협업', 'AI'];
  rows.forEach((tr, i) => {
    const cells = tr.querySelectorAll('td');
    assert.equal(cells.length, 3);
    assert.equal(cells[1].textContent, C.next.matrix[i].gap);
    assert.ok(R.includes(cells[2].textContent.trim()));
  });
  const heads = Array.from(d.querySelectorAll('#next table.gap-matrix thead th')).map((th) => th.textContent);
  assert.deepEqual(heads, ['프로젝트', '갭', '메울 AIGEN 자원']);
});

test('roadmap has four phases in order and is marked as plan', () => {
  const { d } = setup();
  const phases = Array.from(d.querySelectorAll('#next ol.roadmap > li .phase')).map((e) => e.textContent);
  assert.deepEqual(phases, ['YEAR 1 · FIELD', 'YEAR 1 · VALUE CREATION', 'YEAR 2', 'Demo Day']);
  assert.ok(d.querySelector('#next .badge-plan'));
});

test('matrix and roadmap say 프로젝트 1/2 and 1안/2안, never 논문/BONBAB', () => {
  const { d } = setup();
  const tags = Array.from(d.querySelectorAll('#next .proj-tag')).map((e) => e.textContent);
  assert.ok(tags.length > 0);
  for (const t of tags) assert.ok(!/논문|BONBAB/.test(t), t);
  const matrixTags = Array.from(d.querySelectorAll('#next table.gap-matrix .proj-tag')).map((e) => e.textContent);
  assert.ok(matrixTags.every((t) => t === '프로젝트 1' || t === '프로젝트 2'));
  const roadTags = Array.from(d.querySelectorAll('#next ol.roadmap .proj-tag')).map((e) => e.textContent);
  assert.ok(roadTags.includes('1안 · 프로젝트 1') && roadTags.includes('2안 · 프로젝트 2'));
  assert.ok(d.querySelector('#next .proj-sub').textContent.includes('하나'));
});

test('p02 roadmap items only in VALUE CREATION and YEAR 2', () => {
  const { d } = setup();
  const lis = Array.from(d.querySelectorAll('#next ol.roadmap > li'));
  const withP02 = lis.filter((li) => li.querySelector('[data-project="p02"]')).map((li) => li.querySelector('.phase').textContent);
  assert.deepEqual(withP02, ['YEAR 1 · VALUE CREATION', 'YEAR 2']);
});

test('footer has the four links, safe targets, attribution and label', () => {
  const { d, C } = setup();
  const links = Array.from(d.querySelectorAll('#contact .contact-links a'));
  assert.deepEqual(links.map((a) => a.getAttribute('href')), [C.links.linkedin, C.links.github, C.links.repoThesis, C.links.repoBonbab]);
  links.forEach((a) => {
    assert.equal(a.getAttribute('target'), '_blank');
    assert.match(a.getAttribute('rel'), /noopener/);
  });
  const foot = d.getElementById('contact').textContent;
  assert.ok(foot.includes(C.demo.attribution));
  assert.ok(foot.includes('SK AIGEN 1기 지원 포트폴리오'));
});

test('no logo images anywhere', () => {
  const { d } = setup();
  assert.equal(d.querySelectorAll('img').length, 0);
  assert.ok(!d.body.innerHTML.includes('sk.com'));
});
