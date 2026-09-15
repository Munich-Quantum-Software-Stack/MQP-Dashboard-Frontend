/**
 * keycloak-sync.js - Syncs Keycloak's token state into Redux + localStorage,
 * matching the storage shape the rest of the app already expects
 * (see @store/auth-slice and @utils/auth).
 */
import { authActions } from '@store/auth-slice';
import { setExpiration } from '@utils/auth';

/** Store the current Keycloak access token in Redux + localStorage. */
export function syncKeycloakToken(dispatch, keycloak) {
  dispatch(authActions.logged_in({ access_token: keycloak.token }));
  setExpiration();
}

/** Refresh the token if it's within 30s of expiring; re-sync on success. */
export async function refreshKeycloakToken(dispatch, keycloak) {
  const refreshed = await keycloak.updateToken(30);
  if (refreshed) {
    syncKeycloakToken(dispatch, keycloak);
  }
  return refreshed;
}
