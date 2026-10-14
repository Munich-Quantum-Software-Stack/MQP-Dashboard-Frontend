/**
 * user-flows.spec.js - End-to-end Playwright tests for critical user journeys (login, tokens, access request)
 */

const { test, expect } = require('@playwright/test');

// Mock API response data for login, tokens list, and user limits
const tokensResponse = {
  tokens: [
    {
      token_name: 'alpha-token',
      revoked: false,
    },
  ],
};

const userLimitsResponse = {
  total_allowed: 5,
  active: 1,
  remaining: 4,
};

// The app renders only after the Keycloak silent SSO check settles (up to ~10s when blocked)
const APP_READY_TIMEOUT = 25_000;

// Fail Keycloak requests fast so the silent SSO check ends and the app renders
async function blockKeycloak(page) {
  await page.route('https://test.quantumpathway.eu/**', (route) => route.abort());
}

// Seed a session as if Keycloak had already authenticated the user
async function mockAuthenticatedSession(page) {
  const expiration = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  await page.addInitScript((exp) => {
    window.localStorage.setItem('token', 'test-access-token');
    window.localStorage.setItem('expiration', exp);
  }, expiration);
}

// Intercept token-related API calls (user limits and token list) with mock data
async function mockTokenQueries(page) {
  await page.route('**/tokens/user_limits', async (route) => {
    if (route.request().resourceType() === 'document') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(userLimitsResponse),
    });
  });

  await page.route('**/tokens', async (route) => {
    if (route.request().resourceType() === 'document') {
      await route.continue();
      return;
    }
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(tokensResponse),
      });
      return;
    }

    await route.continue();
  });
}

// Reusable helper that opens the app with an authenticated session and verifies the status page
async function performLogin(page) {
  await blockKeycloak(page);
  await mockAuthenticatedSession(page);
  await page.goto('/status');
  await expect(page).toHaveURL(/\/status$/);
  await expect(
    page.getByRole('heading', { name: /Welcome to Quantum Pathway Program/i }),
  ).toBeVisible({
    timeout: APP_READY_TIMEOUT,
  });
}

// Test suite covering main user journeys: login, token viewing, and access request
test.describe('End-to-End user journeys', () => {
  test('visitor sees the SSO login button', async ({ page }) => {
    await blockKeycloak(page);
    await page.goto('/login');
    await expect(page.getByRole('button', { name: 'Login with Single Sign on' })).toBeVisible({
      timeout: APP_READY_TIMEOUT,
    });
  });

  test('authenticated user can reach the status page', async ({ page }) => {
    await performLogin(page);
  });

  // Test authenticated navigation to tokens page and verify token list display
  test('authenticated user can navigate to tokens and view active tokens', async ({ page }) => {
    await mockTokenQueries(page);
    await performLogin(page);

    await page.getByRole('link', { name: 'Tokens' }).click();
    await expect(page).toHaveURL(/\/tokens$/);
    await expect(page.getByRole('link', { name: 'Create Token' })).toBeVisible();
    await expect(page.getByText('Activated Tokens')).toBeVisible();
    await expect(page.getByText('alpha-token')).toBeVisible();
  });

  // Test unauthenticated visitor filling and submitting the access request form
  test('visitor can request portal access', async ({ page }) => {
    await blockKeycloak(page);
    await page.route('**/request_access', async (route) => {
      if (route.request().resourceType() === 'document') {
        await route.continue();
        return;
      }
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'ok' }),
      });
    });

    await page.goto('/request_access');
    await page.getByLabel('Title').selectOption({ label: 'Dr.' });
    await page.getByLabel('Name (*)', { exact: true }).fill('Ada Lovelace');
    await page.getByLabel('Email Address (*)').fill('ada@example.com');
    await page.getByLabel('Project Name (*)', { exact: true }).fill('Analytical Engine');
    await page
      .getByRole('combobox', { name: 'Country Selection' })
      .selectOption({ label: 'Germany' });
    await page.getByLabel('Organization/Institute (*)').fill('Royal Society');
    await page.getByLabel('Message').fill('Looking forward to collaborating.');

    const sendButton = page.getByRole('button', { name: 'Send' });
    await sendButton.waitFor({ state: 'visible' });

    const [response] = await Promise.all([
      page.waitForResponse('**/request_access'),
      sendButton.click({ force: true }),
    ]);

    await expect(response.status()).toBe(200);
  });
});
