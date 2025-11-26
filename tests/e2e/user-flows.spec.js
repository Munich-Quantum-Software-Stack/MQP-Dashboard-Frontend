const { test, expect } = require('@playwright/test');

const loginResponse = {
  access_token: 'test-access-token',
  force_secret_reset: false,
};

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

async function mockLogin(page) {
  await page.route('**/login', async (route) => {
    if (route.request().resourceType() === 'document') {
      await route.continue();
      return;
    }
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(loginResponse),
    });
  });
}

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

async function performLogin(page) {
  await mockLogin(page);
  await page.goto('/login');
  await page.getByLabel('Identity *').fill('user@example.com');
  await page.getByLabel('Password *').fill('super-secret');

  const loginButton = page.getByRole('button', { name: 'Login' });
  await loginButton.waitFor({ state: 'visible' });

  await Promise.all([page.waitForURL(/\/status$/), loginButton.click({ force: true })]);
  await expect(page).toHaveURL(/\/status$/);
  await expect(page.getByRole('heading', { name: /Munich Quantum Portal/i })).toBeVisible();
}

test.describe('End-to-End user journeys', () => {
  test('user can log in and reach the status page', async ({ page }) => {
    await performLogin(page);
  });

  test('authenticated user can navigate to tokens and view active tokens', async ({ page }) => {
    await mockTokenQueries(page);
    await performLogin(page);

    await page.getByRole('link', { name: 'Tokens' }).click();
    await expect(page).toHaveURL(/\/tokens$/);
    await expect(page.getByRole('link', { name: 'Create Token' })).toBeVisible();
    await expect(page.getByText('Activated Tokens')).toBeVisible();
    await expect(page.getByText('alpha-token')).toBeVisible();
  });

  test('visitor can request portal access', async ({ page }) => {
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
