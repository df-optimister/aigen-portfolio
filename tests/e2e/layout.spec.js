// @ts-check
const { test, expect } = require('@playwright/test');

const tile = (page, pid, i) => page.locator(`#${pid} article.step`).nth(i);
const box = async (loc) => /** @type {{x:number,y:number,width:number,height:number}} */ (await loc.boundingBox());

test('3+2 at desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const b = [];
  for (let i = 0; i < 5; i++) b.push(await box(tile(page, 'p01', i)));
  expect(Math.abs(b[0].y - b[1].y)).toBeLessThan(1);
  expect(Math.abs(b[0].y - b[2].y)).toBeLessThan(1);
  expect(Math.abs(b[3].y - b[4].y)).toBeLessThan(1);
  expect(b[3].y).toBeGreaterThan(b[0].y + b[0].height - 1);
  expect(b[3].x).toBeGreaterThan(b[0].x);
  expect(Math.abs(b[3].width - b[0].width)).toBeLessThan(2);
  // bottom row centred
  const left = b[3].x - b[0].x;
  const right = (b[2].x + b[2].width) - (b[4].x + b[4].width);
  expect(Math.abs(left - right)).toBeLessThan(2);
});

test('panel opens directly under its own tile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/');
  const h0 = (await box(tile(page, 'p01', 0))).height;
  const h2 = (await box(tile(page, 'p01', 2))).height;
  await tile(page, 'p01', 1).locator('button.step-head').click();
  const t1 = await box(tile(page, 'p01', 1));
  const head = await box(tile(page, 'p01', 1).locator('button.step-head'));
  const panel = await box(tile(page, 'p01', 1).locator('.step-panel'));
  expect(panel.y).toBeGreaterThanOrEqual(head.y + head.height - 1);
  expect(panel.x).toBeGreaterThanOrEqual(t1.x - 1);
  expect(panel.x + panel.width).toBeLessThanOrEqual(t1.x + t1.width + 1);
  expect((await box(tile(page, 'p01', 0))).height).toBeCloseTo(h0, 0);
  expect((await box(tile(page, 'p01', 2))).height).toBeCloseTo(h2, 0);
});

test('single column on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/');
  const xs = [];
  for (let i = 0; i < 5; i++) xs.push((await box(tile(page, 'p02', i))).x);
  expect(new Set(xs.map((x) => Math.round(x))).size).toBe(1);
});

for (const width of [360, 1024, 1280]) {
  test(`no horizontal overflow at ${width} with all open`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await page.locator('#p01 button.expand-all').click();
    await page.locator('#p02 button.expand-all').click();
    const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(sw).toBeLessThanOrEqual(iw);
  });
}
