// @ts-check
const { test, expect } = require('@playwright/test');

const navHeight = (page) => page.locator('nav.toc').evaluate((el) => el.getBoundingClientRect().height);

test('toc links scroll to section', async ({ page }) => {
  await page.goto('/');
  await page.locator('a.toc-link[href="#p02"]').click();
  const h = await navHeight(page);
  await expect.poll(async () => (await page.locator('#p02').boundingBox()).y).toBeGreaterThanOrEqual(-1);
  await expect.poll(async () => (await page.locator('#p02').boundingBox()).y).toBeLessThanOrEqual(h + 8);
});

test('scroll-spy marks current section', async ({ page }) => {
  await page.goto('/');
  await page.locator('#p01').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await expect(page.locator('a.toc-link[href="#p01"]')).toHaveClass(/is-active/);
  for (const id of ['hero', 'p02', 'next', 'contact']) {
    await expect(page.locator(`a.toc-link[href="#${id}"]`)).not.toHaveClass(/is-active/);
  }
});

test('hash target not hidden under sticky nav', async ({ page }) => {
  await page.goto('/#p02');
  const h = await navHeight(page);
  await expect.poll(async () => (await page.locator('#p02 h2').first().boundingBox()).y).toBeGreaterThanOrEqual(h);
});

test('reduced motion: sections visible without animation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  const ops = await page.locator('.reveal').evaluateAll((els) => els.map((e) => getComputedStyle(e).opacity));
  expect(ops.length).toBeGreaterThan(0);
  expect(ops.every((o) => o === '1')).toBe(true);
});

for (const width of [360, 1280]) {
  test(`no horizontal overflow (shell) at ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 800 });
    await page.goto('/');
    const [sw, iw] = await page.evaluate(() => [document.documentElement.scrollWidth, window.innerWidth]);
    expect(sw).toBeLessThanOrEqual(iw);
  });
}
