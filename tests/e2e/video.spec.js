// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('node:fs');
const path = require('node:path');

const TRACKS = JSON.parse(fs.readFileSync(path.join(__dirname, '../../assets/demo/tracks.json'), 'utf8'));
const LABEL = '공개 데이터로 만든 개념 시연 · 논문 범위 아님';
const ATTR = 'Video & tracking data: SoccerTrack v2 (Scott, Uchida, Kuroda, Kim, Fujii, 2025, arXiv:2508.01802), CC BY 4.0';

async function openDemo(page) {
  await page.locator('#p01 article.step').nth(4).locator('button.step-head').click();
  const video = page.locator('#p01 .demo video');
  await expect(video).toHaveCount(1);
  return video;
}

test('video has inline-safe attributes', async ({ page }) => {
  await page.goto('./');
  const v = await openDemo(page);
  for (const a of ['muted', 'playsinline', 'loop', 'poster']) await expect(v).toHaveAttribute(a, /.*/);
  expect(await v.evaluate((el) => el.muted)).toBe(true);
});

test('plays only when in view', async ({ page }) => {
  await page.goto('./');
  const v = await openDemo(page);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  expect(await v.evaluate((el) => el.paused)).toBe(true);
  await v.scrollIntoViewIfNeeded();
  await expect.poll(() => v.evaluate((el) => el.paused), { timeout: 8000 }).toBe(false);
});

test('overlay follows time', async ({ page }) => {
  await page.goto('./');
  const v = await openDemo(page);
  await v.scrollIntoViewIfNeeded();
  await expect.poll(() => v.evaluate((el) => el.readyState), { timeout: 8000 }).toBeGreaterThanOrEqual(2);
  const t = TRACKS.highlight.t0 + 1;
  await v.evaluate(async (el, tt) => {
    el.pause();
    el.currentTime = tt;
    await new Promise((r) => el.addEventListener('seeked', r, { once: true }));
  }, t);
  const frame = TRACKS.frames.reduce((a, b) => (Math.abs(b.t - t) < Math.abs(a.t - t) ? b : a));
  const p = frame.p.find((q) => q[0] === TRACKS.highlight.id);
  const marker = page.locator('#p01 .demo svg.overlay .hl-marker');
  await expect(marker).toHaveCount(1);
  await expect.poll(async () => Math.abs(Number(await marker.getAttribute('cx')) - p[1] * 1280)).toBeLessThan(1280 * 0.02);
  await expect.poll(async () => Math.abs(Number(await marker.getAttribute('cy')) - p[2] * 720)).toBeLessThan(720 * 0.02);
  // minimap dot for every tracked player in that frame
  await expect(page.locator('#p01 .demo .demo-mini circle.mini-dot')).toHaveCount(frame.p.length);
});

test('reduced motion: no autoplay', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const v = await openDemo(page);
  await v.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  expect(await v.evaluate((el) => el.paused)).toBe(true);
  await expect(page.locator('#p01 .demo .play-btn')).toBeVisible();
});

test('video 404 keeps poster and page usable', async ({ page }) => {
  const errors = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.route('**/clip.mp4', (r) => r.abort());
  await page.goto('./');
  await openDemo(page);
  await page.locator('#p01 .demo').scrollIntoViewIfNeeded();
  await expect(page.locator('#p01 .demo')).toHaveClass(/is-error/, { timeout: 8000 });
  await expect(page.locator('#p01 .demo img.demo-fallback')).toBeVisible();
  await expect(page.locator('#p01 .demo .demo-badge')).toBeVisible();
  await expect(page.locator('#p01 .demo .demo-attr')).toBeVisible();
  await page.locator('#p02 article.step').nth(0).locator('button.step-head').click();
  await expect(page.locator('#p02 article.step').nth(0).locator('.step-panel')).toBeVisible();
  expect(errors).toEqual([]);
});

test('label and attribution exact', async ({ page }) => {
  await page.goto('./');
  await openDemo(page);
  await expect(page.locator('#p01 .demo .demo-badge')).toHaveText(LABEL);
  await expect(page.locator('#p01 .demo .demo-attr')).toHaveText(ATTR);
});

test('expanded view covers the page and closes with Escape', async ({ page }) => {
  await page.goto('./');
  await openDemo(page);
  await page.locator('#p01 .demo').scrollIntoViewIfNeeded();
  await page.locator('.demo-expand').click();
  const covered = await page.evaluate(() => {
    const pts = [[0.5, 0.5], [0.9, 0.85], [0.1, 0.15], [0.5, 0.03]];
    return pts.every(([x, y]) => {
      const el = document.elementFromPoint(innerWidth * x, innerHeight * y);
      return !!(el && el.closest('.demo.is-expanded'));
    });
  });
  expect(covered).toBe(true);
  await page.keyboard.press('Escape');
  await expect(page.locator('.demo.is-expanded')).toHaveCount(0);
  await expect(page.locator('#p01 article.step').nth(4).locator('.demo')).toHaveCount(1);
});

test('an interrupted play() (AbortError) does not disable autoplay', async ({ page }) => {
  await page.addInitScript(() => {
    const real = HTMLMediaElement.prototype.play;
    let first = true;
    HTMLMediaElement.prototype.play = function () {
      if (first) { first = false; return Promise.reject(new DOMException('interrupted by pause()', 'AbortError')); }
      return real.call(this);
    };
  });
  await page.goto('./');
  const v = await openDemo(page);
  await v.scrollIntoViewIfNeeded();           // 1st play() → AbortError
  await page.waitForTimeout(300);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await v.scrollIntoViewIfNeeded();           // must autoplay again
  await expect(page.locator('#p01 .demo')).not.toHaveClass(/is-manual/);
  await expect.poll(() => v.evaluate((el) => el.paused), { timeout: 8000 }).toBe(false);
});

test('user can pause autoplay and it stays paused', async ({ page }) => {
  await page.goto('./');
  const v = await openDemo(page);
  await v.scrollIntoViewIfNeeded();
  await expect.poll(() => v.evaluate((el) => el.paused), { timeout: 8000 }).toBe(false);
  const btn = page.locator('#p01 .demo .play-btn');
  await expect(btn).toBeVisible();
  await btn.click();
  expect(await v.evaluate((el) => el.paused)).toBe(true);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(300);
  await v.scrollIntoViewIfNeeded();
  await page.waitForTimeout(800);
  expect(await v.evaluate((el) => el.paused)).toBe(true);
});

test('manually started video pauses when scrolled away', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('./');
  const v = await openDemo(page);
  await v.scrollIntoViewIfNeeded();
  await page.locator('#p01 .demo .play-btn').click();
  await expect.poll(() => v.evaluate((el) => el.paused), { timeout: 8000 }).toBe(false);
  await expect(page.locator('#p01 .demo .play-btn')).toBeVisible();
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect.poll(() => v.evaluate((el) => el.paused), { timeout: 4000 }).toBe(true);
});

test('highlight label stays inside the video frame near the right edge', async ({ page }) => {
  await page.goto('./');
  const v = await openDemo(page);
  await v.scrollIntoViewIfNeeded();
  await expect.poll(() => v.evaluate((el) => el.readyState), { timeout: 8000 }).toBeGreaterThanOrEqual(2);
  await v.evaluate(async (el, tt) => {
    el.pause();
    el.currentTime = tt;
    await new Promise((r) => el.addEventListener('seeked', r, { once: true }));
  }, TRACKS.highlight.t1 - 0.2);
  const label = page.locator('#p01 .demo svg.overlay .hl-label');
  await expect(label).toHaveCount(1);
  const bb = await label.evaluate((el) => { const b = el.getBBox(); return { x: b.x, w: b.width }; });
  expect(bb.x).toBeGreaterThanOrEqual(0);
  expect(bb.x + bb.w).toBeLessThanOrEqual(1280);
});
