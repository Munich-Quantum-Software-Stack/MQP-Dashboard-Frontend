// Snapshot of a successful /login response from the staging API captured on
// 2025-11-04. Token strings are shortened to avoid leaking secrets while the
// payload structure remains identical to production.
export const loginSuccessResponse = {
  access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stage-access-token',
  refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.stage-refresh-token',
  token_type: 'bearer',
  expires_in: 3600,
  force_secret_reset: false,
  user: {
    id: 'c6d20409-1d11-4c9e-9e50-0f42a7e7c9bb',
    email: 'researcher@example.com',
    roles: ['researcher'],
    full_name: 'Researcher Example',
  },
};
