import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/browser', fullyParallel: false, workers: 1, timeout: 30000,
  use: { baseURL: 'http://localhost:3101', headless: true, launchOptions: { ...(process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE ? { executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE } : {}) } },
  reporter: [['list']],
  webServer: process.env.PLAYWRIGHT_EXTERNAL_SERVER ? undefined : { command: 'npm run dev -- --port 3101', url: 'http://localhost:3101', reuseExistingServer: false, timeout: 120000, env: { NEXT_PUBLIC_SITE_URL: 'http://localhost:3101', NEXT_PUBLIC_TURNSTILE_SITE_KEY: '1x00000000000000000000AA', NEXT_PUBLIC_GA_ID: '', NEXT_PUBLIC_CLARITY_ID: '' } },
});
