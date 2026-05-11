/**
 * playwright.config.js - Playwright E2E test configuration for cross-browser testing
 */

const { defineConfig, devices } = require('@playwright/test');

// Base URL for E2E tests, defaults to local dev server
const baseURL = process.env.E2E_BASE_URL || 'http://127.0.0.1:3000';

module.exports = defineConfig({
  testDir: '../../tests/e2e',
  // Run tests in parallel for faster execution
  fullyParallel: true,
  // Retry failed tests twice in CI to handle flakiness
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  timeout: 45_000,
  expect: {
    timeout: 7_500,
  },
  // Use HTML + list reporters in CI, list only locally
  reporter: process.env.CI
    ? [['html', { outputFolder: 'playwright-report', open: 'never' }], ['list']]
    : 'list',
  // Shared settings for all browser projects
  use: {
    baseURL,
    headless: true,
    // Capture traces, screenshots, and video only on failures for debugging
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
  },
  // Run tests across Chrome, Firefox, and Safari browsers
  projects: [
    {
      name: 'Chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'Firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'Safari',
      use: { ...devices['Desktop Safari'] },
    },
  ],
  // Auto-start dev server before running tests
  webServer: {
    command: process.env.CI ? 'npm run serve:test' : 'npm run start:test',
    url: baseURL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
