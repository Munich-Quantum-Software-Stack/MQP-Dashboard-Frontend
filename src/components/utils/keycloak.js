/**
 * keycloak.js - Singleton Keycloak client instance for SSO login.
 *
 * Configuration comes from REACT_APP_KEYCLOAK_* env vars, which are public
 * (baked into the JS bundle) - never put a client secret here. The
 * mqp-frontend Keycloak client is a public client (no secret), using the
 * Authorization Code + PKCE flow.
 */
import Keycloak from 'keycloak-js';

const keycloak = new Keycloak({
  url: process.env.REACT_APP_KEYCLOAK_URL,
  realm: process.env.REACT_APP_KEYCLOAK_REALM,
  clientId: process.env.REACT_APP_KEYCLOAK_CLIENT_ID,
});

export default keycloak;
