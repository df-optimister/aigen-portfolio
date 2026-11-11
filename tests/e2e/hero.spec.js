// @ts-check
const { test, expect } = require('@playwright/test');

test('page text uses Playfair Display with Pretendard (as on aigen.sk.com) for Hangul', async ({ page }) => {
  await page.goto('/');
  const ff = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(ff).toMatch(/^"?Playfair Display"?,\s*"?Pretendard Variable"?/);
  await page.evaluate(() => document.fonts.ready);
  const loaded = await page.evaluate(() => [
    document.fonts.check('16px "Playfair Display"', 'Ab1'),
    document.fonts.check('16px "Pretendard Variable"', '한글'),
  ]);
  expect(loaded).toEqual([true, true]);
});

test('clicking a 지망 swaps tagline, highlighted card and hero art', async ({ page }) => {
  await page.goto('/');
  const t2 = page.locator('#hero button.track').nth(1);
  await t2.click();
  await expect(t2).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#hero a.hero-card.is-selected')).toHaveAttribute('href', '#p02');
  await expect(page.locator('#hero .hero-tagline')).toHaveText(/^“.*”$/);
  await expect(page.locator('#hero .hero-art[data-project="p02"]')).toHaveCSS('opacity', '1', { timeout: 3000 });
  await expect(page.locator('#hero .hero-art[data-project="p01"]')).toHaveCSS('opacity', '0', { timeout: 3000 });
});
