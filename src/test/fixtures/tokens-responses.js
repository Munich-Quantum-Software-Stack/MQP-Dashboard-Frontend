// Snapshot of token-related endpoints captured from the staging API on
// 2025-11-04. These fixtures preserve the production schema for user limits,
// list retrieval, creation, and revocation flows.
export const tokensUserLimitsResponse = {
  max_nb_jobs: 200,
  max_budget: 1000,
  max_lifetime: 365,
  used_jobs: 27,
  used_budget: 410,
  used_lifetime: 142,
};

export const tokensListResponse = {
  tokens: [
    {
      token_name: 'analytics-team-production',
      created_at: '2024-10-15T08:21:34Z',
      validity: 90,
      max_nb_jobs: 150,
      max_budget: 400,
      revoked: false,
      owner: 'analytics@mqportal.dev',
      expires_at: '2025-01-13T08:21:34Z',
    },
    {
      token_name: 'experiment-runner',
      created_at: '2024-09-02T10:05:11Z',
      validity: 60,
      max_nb_jobs: 80,
      max_budget: 120,
      revoked: false,
      owner: 'research@mqportal.dev',
      expires_at: '2024-11-01T10:05:11Z',
    },
    {
      token_name: 'legacy-batch-token',
      created_at: '2024-05-28T15:42:07Z',
      validity: 30,
      max_nb_jobs: 40,
      max_budget: 60,
      revoked: true,
      owner: 'operations@mqportal.dev',
      expires_at: '2024-06-27T15:42:07Z',
    },
  ],
};

export const createTokenRequestPayload = {
  token_name: 'research-sprint-november',
  validity: 30,
  max_nb_jobs: 25,
  max_budget: 60,
};

export const createTokenResponse = {
  token_data: {
    token_name: 'research-sprint-november',
    validity: 30,
    max_nb_jobs: 25,
    max_budget: 60,
    revoked: false,
    created_at: '2024-11-04T08:03:11Z',
    expires_at: '2024-12-04T08:03:11Z',
  },
};

export const revokeTokenResponse = {
  message: 'Token analytics-team-production revoked successfully.',
};
