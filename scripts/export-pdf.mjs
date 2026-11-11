// Export the page to dist/portfolio.pdf (A4, backgrounds on). Fails if > 20 MB.
// Usage: npm run pdf            → serves this folder on :4174 and prints it
//        PDF_URL=https://... npm run pdf → prints a deployed URL instead
import { spawn } from 'node:child_process';
import { mkdirSync, statSync } from 'node:fs';
import { setTimeout as wait } from 'node:timers/promises';
import { chromium } from '@playwright/test';

const LIMIT = 20 * 1024 * 1024;
const OUT = 'dist/portfolio.pdf';
let server = null;
let url = process.env.PDF_URL;

if (!url) {
  server = spawn(process.execPath, ['node_modules/http-server/bin/http-server', '-p', '4174', '-c-1', '-s', '.'], { stdio: 'ignore' });
  url = 'http://localhost:4174/';
  await wait(1200);
}

try {
  const browser = await chromium.launch({ channel: 'chrome' });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => window.dispatchEvent(new Event('beforeprint')));
  await page.waitForTimeout(300);
  mkdirSync('dist', { recursive: true });
  await page.pdf({ path: OUT, format: 'A4', printBackground: true, preferCSSPageSize: true });
  await browser.close();
  const size = statSync(OUT).size;
  console.log(`${OUT}: ${(size / 1024 / 1024).toFixed(2)} MB`);
  if (size > LIMIT) { console.error('PDF exceeds 20 MB'); process.exitCode = 1; }
} finally {
  if (server) server.kill();
}
