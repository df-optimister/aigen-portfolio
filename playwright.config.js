// @ts-check
const { defineConfig } = require('@playwright/test');

const baseURL = process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:4173';

module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  reporter: [['list']],
  use: { channel: 'chrome', baseURL },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1280, height: 800 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true } },
  ],
  webServer: process.env.PLAYWRIGHT_BASE_URL ? undefined : {
    command: 'npm run serve',
    port: 4173,
    reuseExistingServer: true,
  },
});
