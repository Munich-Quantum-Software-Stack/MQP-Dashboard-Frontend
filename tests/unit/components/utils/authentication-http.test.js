/**
 * authentication-http.test.js - Unit tests for login API helper function with various response scenarios
 */

import { rest } from 'msw';
import { server } from '@test/server';
import { fetchLogin } from '@utils/authentication-http';
import { loginSuccessResponse } from '@test/fixtures/authentication-response';

const API_BASE = 'https://api.test';
const ORIGINAL_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

describe('authentication-http API helper', () => {
  let consoleInfoSpy;

  // Set up test API endpoint and suppress console.info during tests
  beforeAll(() => {
    process.env.REACT_APP_API_ENDPOINT = API_BASE;
    consoleInfoSpy = jest.spyOn(console, 'info').mockImplementation(() => {});
  });

  afterAll(() => {
    process.env.REACT_APP_API_ENDPOINT = ORIGINAL_ENDPOINT;
    consoleInfoSpy.mockRestore();
  });

  // Test successful login: verify credentials are posted and response JSON is returned
  it('fetchLogin posts credentials and returns response JSON', async () => {
    const credentials = {
      identity: 'researcher@example.com',
      secret: 'correct-horse-battery-staple',
    };
    let capturedBody;

    server.use(
      rest.post(`${API_BASE}/login`, async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.status(200), ctx.json(loginSuccessResponse));
      }),
    );

    const result = await fetchLogin(credentials);
    expect(capturedBody).toEqual(credentials);
    expect(result).toEqual(loginSuccessResponse);
  });

  // Test 401 unauthorized: verify friendly authentication error is thrown
  it('fetchLogin throws a friendly message for 401 responses', async () => {
    server.use(
      rest.post(`${API_BASE}/login`, (_req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ error: 'invalid_credentials', error_message: 'Invalid identity or secret.' }),
        );
      }),
    );

    await expect(fetchLogin({ identity: 'user', secret: 'bad' })).rejects.toMatchObject({
      message: 'Authentication failed.',
    });
  });

  // Test 500 server error: verify generic error message is thrown
  it('fetchLogin throws a generic error for other failures', async () => {
    server.use(
      rest.post(`${API_BASE}/login`, (_req, res, ctx) => {
        return res(ctx.status(500), ctx.json({ error: 'internal_error', request_id: 'req-9f2b' }));
      }),
    );

    await expect(fetchLogin({ identity: 'user', secret: 'error' })).rejects.toMatchObject({
      message: 'Internal Server Error! Please try again later.',
    });
  });
});
