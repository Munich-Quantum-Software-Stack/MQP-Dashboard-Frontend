import { rest } from 'msw';
import { server } from 'src/test/server';
import { fetchResources } from '@utils/resources-http';
import { resourcesResponse } from 'src/test/fixtures/resources-response';

const API_BASE = 'https://api.test';
const ORIGINAL_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

describe('resources-http API helper', () => {
  beforeAll(() => {
    process.env.REACT_APP_API_ENDPOINT = API_BASE;
  });

  afterAll(() => {
    process.env.REACT_APP_API_ENDPOINT = ORIGINAL_ENDPOINT;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

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
