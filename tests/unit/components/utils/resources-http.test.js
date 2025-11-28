/**
 * resources-http.test.js - Unit tests for resources API helper (fetchResources)
 */

import { rest } from 'msw';
import { server } from '@test/server';
import { fetchResources } from '@utils/resources-http';
import { resourcesResponse } from '@test/fixtures/resources-response';

const API_BASE = 'https://api.test';
const ORIGINAL_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

describe('resources-http API helper', () => {
  // Set up and restore test API endpoint environment variable
  beforeAll(() => {
    process.env.REACT_APP_API_ENDPOINT = API_BASE;
  });

  afterAll(() => {
    process.env.REACT_APP_API_ENDPOINT = ORIGINAL_ENDPOINT;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test successful fetch: verify auth header is sent and JSON payload is returned
  it('fetchResources returns JSON payload', async () => {
    server.use(
      rest.get(`${API_BASE}/resources`, (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe('Bearer token');
        return res(ctx.status(200), ctx.json(resourcesResponse));
      }),
    );

    const data = await fetchResources({ access_token: 'token', signal: undefined });
    expect(data).toEqual(resourcesResponse);
  });

  // Test error handling: verify descriptive error with code and backend details is thrown
  it('fetchResources throws descriptive error when backend fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    server.use(
      rest.get(`${API_BASE}/resources`, (_req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error_message: 'Inventory service unavailable – please retry.' }),
        );
      }),
    );

    await expect(
      fetchResources({ access_token: 'token', signal: undefined }),
    ).rejects.toMatchObject({
      message: 'Could not fetch resources!',
      code: 500,
      details: 'Inventory service unavailable – please retry.',
    });

    consoleSpy.mockRestore();
  });
});
