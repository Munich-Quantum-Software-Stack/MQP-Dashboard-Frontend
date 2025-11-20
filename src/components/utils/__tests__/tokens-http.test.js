import { rest } from 'msw';
import { server } from 'src/test/server';
import { fetchUserLimits, fetchTokens, createNewToken, revokeToken } from '../tokens-http';
import {
  tokensUserLimitsResponse,
  tokensListResponse,
  createTokenRequestPayload,
  createTokenResponse,
  revokeTokenResponse,
} from 'src/test/fixtures/tokens-responses';

const API_BASE = 'https://api.test';
const ORIGINAL_ENDPOINT = process.env.REACT_APP_API_ENDPOINT;

describe('tokens-http API helpers', () => {
  beforeAll(() => {
    process.env.REACT_APP_API_ENDPOINT = API_BASE;
  });

  afterAll(() => {
    process.env.REACT_APP_API_ENDPOINT = ORIGINAL_ENDPOINT;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('fetchUserLimits returns parsed data when response is OK', async () => {
    let capturedAuth;

    server.use(
      rest.get(`${API_BASE}/tokens/user_limits`, (req, res, ctx) => {
        capturedAuth = req.headers.get('authorization');
        return res(ctx.status(200), ctx.json(tokensUserLimitsResponse));
      }),
    );

    const result = await fetchUserLimits({ access_token: 'test-token', signal: undefined });

    expect(capturedAuth).toBe('Bearer test-token');
    expect(result).toEqual(tokensUserLimitsResponse);
  });

  it('fetchUserLimits throws with status attached on failure', async () => {
    server.use(
      rest.get(`${API_BASE}/tokens/user_limits`, (_req, res, ctx) => {
        return res(ctx.status(503));
      }),
    );

    await expect(
      fetchUserLimits({ access_token: 'test-token', signal: undefined }),
    ).rejects.toMatchObject({ message: 'Could not fetch user limits!', code: 503 });
  });

  it('fetchTokens returns token list and sends auth header', async () => {
    server.use(
      rest.get(`${API_BASE}/tokens`, (req, res, ctx) => {
        expect(req.headers.get('authorization')).toBe('Bearer token-123');
        return res(ctx.status(200), ctx.json(tokensListResponse));
      }),
    );

    const result = await fetchTokens({ access_token: 'token-123', signal: undefined });
    expect(result).toEqual(tokensListResponse.tokens);
  });

  it('fetchTokens throws when backend rejects request', async () => {
    server.use(
      rest.get(`${API_BASE}/tokens`, (_req, res, ctx) => {
        return res(
          ctx.status(401),
          ctx.json({ error: 'unauthorized', error_message: 'Access token expired.' }),
        );
      }),
    );

    await expect(
      fetchTokens({ access_token: 'token-123', signal: undefined }),
    ).rejects.toMatchObject({ message: 'Could not fetch tokens.', code: 401 });
  });

  it('createNewToken posts payload and returns created token data', async () => {
    let capturedBody;
    let capturedAuth;

    server.use(
      rest.post(`${API_BASE}/tokens/new`, async (req, res, ctx) => {
        capturedAuth = req.headers.get('authorization');
        capturedBody = await req.json();
        return res(ctx.status(200), ctx.json(createTokenResponse));
      }),
    );

    const result = await createNewToken({
      tokenData: createTokenRequestPayload,
      access_token: 'token-abc',
    });

    expect(capturedAuth).toBe('Bearer token-abc');
    expect(capturedBody).toEqual(createTokenRequestPayload);
    expect(result).toEqual(createTokenResponse.token_data);
  });

  it('createNewToken maps 403 to friendly error', async () => {
    server.use(
      rest.post(`${API_BASE}/tokens/new`, (_req, res, ctx) => {
        return res(
          ctx.status(403),
          ctx.json({ error_message: 'Token name already exists for this project.' }),
        );
      }),
    );

    await expect(
      createNewToken({ tokenData: { token_name: 'dupe' }, access_token: 'token-abc' }),
    ).rejects.toMatchObject({ message: 'Token Name is invalid. Please try another one.' });
  });

  it('revokeToken sends token payload and returns message', async () => {
    let capturedBody;
    const tokenToRevoke = tokensListResponse.tokens[0].token_name;

    server.use(
      rest.delete(`${API_BASE}/tokens`, async (req, res, ctx) => {
        capturedBody = await req.json();
        return res(ctx.status(200), ctx.json(revokeTokenResponse));
      }),
    );

    const result = await revokeToken({ tokenName: tokenToRevoke, access_token: 'token-abc' });

    expect(capturedBody).toEqual({ token_name: tokenToRevoke });
    expect(result).toBe(revokeTokenResponse.message);
  });

  it('revokeToken throws with backend message when deletion fails', async () => {
    server.use(
      rest.delete(`${API_BASE}/tokens`, (_req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({ error_message: 'Revocation failed: token still active in queue.' }),
        );
      }),
    );

    await expect(
      revokeToken({ tokenName: 'alpha', access_token: 'token-abc' }),
    ).rejects.toMatchObject({ message: expect.stringContaining('Revocation failed'), code: 500 });
  });
});
