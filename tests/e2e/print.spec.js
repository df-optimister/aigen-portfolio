// @ts-check
const { test, expect } = require('@playwright/test');

async function goPrint(page) {
  await page.goto('/');
  // leave the grids in a mixed state first
  await page.locator('#p01 article.step').nth(1).locator('button.step-head').click();
  await page.locator('#p02 button.expand-all').click();
  await page.locator('#p02 article.step').nth(3).locator('button.step-head').click();
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
}

test('print shows all panels and all viz', async ({ page }) => {
  await goPrint(page);
  const panels = page.locator('.step-panel');
  await expect(panels).toHaveCount(10);
  for (let i = 0; i < 10; i++) await expect(panels.nth(i)).toBeVisible();
  const rendered = await page.locator('.board').evaluateAll((els) => els.map((e) => e.dataset.rendered));
  expect(rendered.length).toBe(10);
  expect(rendered.every((r) => r === '1')).toBe(true);
});

test('print hides chrome', async ({ page }) => {
  await goPrint(page);
  await expect(page.locator('nav.toc')).toBeHidden();
  for (const sel of ['.expand-all', '.step-next', '.viz-toggle']) {
    const vis = await page.locator(sel).evaluateAll((els) => els.filter((e) => e.offsetParent !== null).length);
    expect(vis, sel).toBe(0);
  }
});

test('pdf under 20MB', async ({ page, isMobile }) => {
  test.skip(isMobile, 'pdf generated once on desktop');
  await page.goto('/');
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  const pdf = await page.pdf({ format: 'A4', printBackground: true });
  expect(pdf.length).toBeLessThan(20 * 1024 * 1024);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) || []).length;
  expect(pages).toBeGreaterThanOrEqual(4);
});
