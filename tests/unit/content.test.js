const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const C = require('../../js/content.js');

// Items the user changed on purpose after reviewing the page (Task 10).
// Key format: '<projectId>.<stepNo>.<field>' e.g. 'p01.03.bullets'.
const USER_EDITED = new Set([
  'p01.05.bullets', // 2026-11-11: defensive off-ball (수비 커버·공격수 방향 제한) added at the user's request
]);

const PLAN_MD = path.resolve(__dirname, '../../../SK_AIGEN_포트폴리오_웹페이지_계획.md');

function parsePlanSection4(md) {
  const text = md.replace(/\r\n/g, '\n');
  const start = text.indexOf('\n## 4.');
  const end = text.indexOf('\n## 5.');
  const sec = text.slice(start, end).split('\n');
  const projects = [];
  let proj = null;
  let step = null;
  for (const line of sec) {
    if (line.startsWith('### ')) { proj = { steps: [] }; projects.push(proj); step = null; continue; }
    if (!proj) continue;
    if (line.startsWith('#### ')) { step = { name: line.slice(5).trim(), keywords: null, impact: null, bullets: [] }; proj.steps.push(step); continue; }
    if (!step) continue;
    if (line.startsWith('키워드:')) { step.keywords = line.slice(4).trim().split(' · ').map((s) => s.trim()); continue; }
    if (line.startsWith('- ')) { step.bullets.push(line.slice(2).trim()); continue; }
    if (line.trim() && step.keywords && step.impact === null) step.impact = line.trim();
  }
  return projects;
}

function allStrings(obj, out = []) {
  if (typeof obj === 'string') out.push(obj);
  else if (Array.isArray(obj)) obj.forEach((v) => allStrings(v, out));
  else if (obj && typeof obj === 'object') Object.values(obj).forEach((v) => allStrings(v, out));
  return out;
}

test('two projects, six steps each, fixed order', () => {
  assert.deepEqual(C.projects.map((p) => p.id), ['p01', 'p02']);
  for (const p of C.projects) {
    assert.equal(p.steps.length, 6);
    assert.deepEqual(p.steps.map((s) => s.no), ['01', '02', '03', '04', '05', '06']);
    assert.deepEqual(p.steps.map((s) => s.name), ['도전의 배경', '도전 과정과 부여한 가치', '실행과 결과', '한계와 돌아보기', 'AIGEN과 함께할 발전 방향', '이 프로젝트에서 탄생한 서비스']);
  }
});

test('project 1 step 05 covers attacking and defensive off-ball movement', () => {
  const t = C.projects[0].steps[4].bullets.join('\n');
  for (const s of ['침투', '공간 창출', '수비 커버', '공격수 방향 제한']) assert.ok(t.includes(s), s);
});

test('step 06 describes the service born from each project', () => {
  const [a, b] = C.projects.map((p) => p.steps[5]);
  assert.match(a.impact, /오프더볼/);
  assert.ok(a.bullets.join('\n').includes('수비'));
  assert.match(b.impact, /전통주/);
  for (const s of [a, b]) assert.ok(s.bullets.length >= 4);
});

test('keywords 3-4 per step', () => {
  for (const p of C.projects) for (const s of p.steps) {
    assert.ok(s.keywords.length >= 3 && s.keywords.length <= 4, `${p.id}.${s.no} has ${s.keywords.length} keywords`);
  }
});

test('copy matches plan §4 verbatim', (t) => {
  if (!fs.existsSync(PLAN_MD)) { t.skip('plan markdown not present'); return; }
  const plan = parsePlanSection4(fs.readFileSync(PLAN_MD, 'utf8'));
  assert.equal(plan.length, 2);
  C.projects.forEach((p, pi) => {
    p.steps.slice(0, 5).forEach((s, si) => {
      const ps = plan[pi].steps[si];
      assert.equal(s.name, ps.name);
      for (const field of ['keywords', 'impact', 'bullets']) {
        if (USER_EDITED.has(`${p.id}.${s.no}.${field}`)) continue;
        assert.deepEqual(s[field], ps[field], `${p.id}.${s.no}.${field}`);
      }
    });
  });
});

test('only steps 05 and 06 are plan', () => {
  for (const p of C.projects) assert.deepEqual(p.steps.map((s) => s.plan), [false, false, false, false, true, true]);
});

test('viz ids are fixed', () => {
  assert.deepEqual(C.projects[0].steps.map((s) => s.viz), ['p01-pitch', 'p01-pipeline', 'p01-results', 'p01-snapshot', 'p01-roadmap', 'p01-service']);
  assert.deepEqual(C.projects[1].steps.map((s) => s.viz), ['p02-loop', 'p02-proposal', 'p02-build', 'p02-timeline', 'p02-flywheel', 'p02-service']);
});

test('no overclaiming phrases', () => {
  const all = allStrings(C).join('\n');
  for (const bad of ['출시했', '출시 완료', '계약 체결', '실사용자', '매출', 'SK 로고']) {
    assert.ok(!all.includes(bad), `found "${bad}"`);
  }
});

test('demo label and attribution exact', () => {
  assert.equal(C.demo.label, '공개 데이터로 만든 개념 시연 · 논문 범위 아님');
  assert.equal(C.demo.attribution, 'Video & tracking data: SoccerTrack v2 (Scott, Uchida, Kuroda, Kim, Fujii, 2025, arXiv:2508.01802), CC BY 4.0');
});

test('meta, tracks, links', () => {
  assert.equal(C.meta.label, 'SK AIGEN 1기 지원 포트폴리오');
  assert.equal(C.meta.nameKo, '김근우');
  assert.equal(C.meta.nameEn, 'Keunwoo Kim');
  for (const pid of ['p01', 'p02']) {
    const t = C.meta.taglines[pid];
    assert.ok(t.startsWith('“') && t.endsWith('”'), `${pid} tagline must be quoted`);
  }
  assert.notEqual(C.meta.taglines.p01, C.meta.taglines.p02);
  assert.ok(C.meta.choiceNote.includes('하나'));
  assert.deepEqual(C.tracks, [
    { label: '1지망 문화/예술/스포츠', project: 'p01', plan: '1안' },
    { label: '2지망 창업/비즈니스', project: 'p02', plan: '2안' },
  ]);
  assert.deepEqual(C.links, {
    linkedin: 'https://linkedin.com/in/keunwoo-kim-78138820b',
    github: 'https://github.com/df-optimister',
    repoThesis: 'https://github.com/df-optimister/Tracking-enhanced-VAEP',
    repoBonbab: 'https://github.com/df-optimister/bonbab-app',
  });
});

test('next: matrix resources and roadmap', () => {
  const R = ['현장 전문가 멘토', '동료 교류·협업', 'AI'];
  assert.ok(C.next.matrix.length >= 4);
  for (const m of C.next.matrix) {
    assert.ok(['p01', 'p02'].includes(m.project));
    assert.ok(R.includes(m.resource), m.resource);
    assert.ok(m.gap && typeof m.gap === 'string');
  }
  assert.deepEqual(C.next.roadmap.map((r) => r.phase), ['YEAR 1 · FIELD', 'YEAR 1 · VALUE CREATION', 'YEAR 2', 'Demo Day']);
  const p02Phases = C.next.roadmap.filter((r) => r.items.some((i) => i.project === 'p02')).map((r) => r.phase);
  assert.deepEqual(p02Phases, ['YEAR 1 · VALUE CREATION', 'YEAR 2']);
});

test('project 1 service is framed as a SaaS business', () => {
  const s = C.projects[0].steps[5];
  assert.ok((s.impact + s.bullets.join('\n')).includes('SaaS'));
});

test('project 2 service: brewery direct, AI review summary, taste matching', () => {
  const s = C.projects[1].steps[5];
  const t = s.impact + '\n' + s.bullets.join('\n');
  for (const k of ['양조장', '고객', '리뷰', 'AI', '요약', '맛', '취향', '유통', '브랜드']) assert.ok(t.includes(k), k);
});

test('no "아직 만들지 않은 구상" wording anywhere', () => {
  const all = allStrings(C).join('\n');
  for (const bad of ['아직 만들지 않은', '아직 아무것도 만들지', '구상 단계']) assert.ok(!all.includes(bad), bad);
});

test('next matrix wording confirmed by the user', () => {
  const p01 = C.next.matrix.filter((m) => m.project === 'p01');
  assert.ok(p01.some((m) => m.gap === '다른 관점을 통한 보완 및 발전' && m.resource === '동료 교류·협업'));
  assert.ok(p01.some((m) => m.gap === '상용화의 한계' && m.resource === 'AI'));
  assert.ok(!p01.some((m) => m.gap === '서로 다른 배경의 관점'));
});

test('project 1 service lists the three-stage rollout in order, with reasons', () => {
  const b = C.projects[0].steps[5].bullets;
  assert.ok(!b.includes('아래의 분석 서비스를 클라우드에서 제공하는 SaaS 사업'));
  const idx = ['1단계', '2단계', '3단계'].map((k) => b.findIndex((x) => x.startsWith(k)));
  idx.forEach((i) => assert.ok(i >= 0));
  assert.ok(idx[0] < idx[1] && idx[1] < idx[2]);
  idx.forEach((i) => assert.ok(b[i].includes('—'), 'each stage carries its reason after —'));
});
