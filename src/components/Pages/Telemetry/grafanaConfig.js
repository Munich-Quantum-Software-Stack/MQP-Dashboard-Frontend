/**
 * grafanaConfig.js
 *
 * Grafana URL helper for embedded panel iframes.
 *
 * Panel identity (dashboardUid + panelId) is stored directly on each sensor
 * object as `grafanaPanelRef: { dashboardUid: string, panelId: number } | null`.
 * This means the backend API (or mock data) is the single source of truth for
 * which panel maps to which sensor — no static table to keep in sync here.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * Grafana Authentication Strategy
 * ─────────────────────────────────────────────────────────────────────────────
 * Three options, choose one before production deployment:
 *
 *   Option A — Anonymous access (Grafana ≥ 9.x, simplest)
 *     • Enable `auth.anonymous` in grafana.ini / env vars
 *     • Grant the anonymous org "Viewer" role
 *     • Risk: anyone who can reach the Grafana host can view all dashboards
 *     • Acceptable only on a private, firewalled network
 *
 *   Option B — Embedding via Grafana service account + proxy
 *     • Create a read-only service account token in Grafana
 *     • Add a backend proxy route (nginx/express) that appends the token to
 *       every iframe request: `Authorization: Bearer <token>`
 *     • iframes point to the proxy URL, never to Grafana directly
 *     • Grafana never needs to be internet-reachable
 *     • Token stays server-side — NOT in config.json or the JS bundle
 *
 *   Option C — Grafana SSO via the platform's existing OIDC provider ← RECOMMENDED
 *     • Configure Grafana's built-in OAuth support to use the same IdP as MQP
 *     • Users who are already logged in to MQP are automatically authenticated
 *       by Grafana (same session cookie / token flow)
 *     • No anonymous access; no service-account token leakage
 *     • Works correctly for internet-facing deployments
 *     • Requires: Grafana ≥ 9.x, `allow_embedding = true` in grafana.ini,
 *       and `SameSite=None; Secure` cookies on the Grafana domain
 *     • Reference: https://grafana.com/docs/grafana/latest/setup-grafana/configure-security/configure-authentication/jwt/
 *
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { getConfig } from './runtimeConfig';

/**
 * Build an embeddable Grafana panel URL (d-solo — panel-only, no nav chrome).
 *
 * @param {{ dashboardUid: string, panelId: number } | null} panelRef
 * @param {Date|string|null} from  Start of time range (null → 'now-6h').
 * @param {Date|string|null} to    End of time range (null → 'now').
 * @param {'dark'|'light'} theme
 * @returns {string|null}
 */
export function buildPanelUrl(panelRef, from, to, theme = 'dark') {
  const { GRAFANA_URL } = getConfig();
  if (!GRAFANA_URL || !panelRef?.dashboardUid) return null;

  const toMs = (v) => {
    if (!v) return null;
    return v instanceof Date ? v.getTime() : typeof v === 'number' ? v : new Date(v).getTime();
  };

  const fromVal = toMs(from);
  const toVal = toMs(to);

  const params = new URLSearchParams({
    panelId: String(panelRef.panelId),
    from: fromVal ? String(fromVal) : 'now-6h',
    to: toVal ? String(toVal) : 'now',
    theme,
    orgId: '1',
    timezone: 'browser',
  });

  // Grafana 12.x requires a slug segment in d-solo URLs and the dashboardSceneSolo
  // feature flag appended without a value (e.g. &__feature.dashboardSceneSolo).
  // The slug is cosmetic — Grafana routes by UID.
  // Convention: slug = dashboardUid with '-telemetry' suffix removed.
  // An explicit panelRef.slug overrides this.
  const slug = panelRef.slug || panelRef.dashboardUid.replace(/-telemetry$/, '');
  return `${GRAFANA_URL}/d-solo/${panelRef.dashboardUid}/${slug}?${params.toString()}&__feature.dashboardSceneSolo`;
}

/**
 * Build a link to the full room dashboard in Grafana (opens in new tab).
 *
 * @param {string} roomId  Matches the keys in MOCK_ROOMS (e.g. 'warm-lab').
 * @param {Date|string|null} from
 * @param {Date|string|null} to
 * @returns {string|null}
 */
export function buildRoomDashboardUrl(roomId, from, to) {
  const { GRAFANA_URL } = getConfig();
  if (!GRAFANA_URL) return null;

  const ROOM_DASHBOARDS = {
    'warm-lab': { uid: '55b99d46-9e7d-4b1c-b5dc-592592f60031', slug: 'warmlab' },
    'cold-lab': null,
    'compute-cube': null,
    cloud: null,
  };

  // eslint-disable-next-line security/detect-object-injection
  const dashboard = ROOM_DASHBOARDS[roomId];
  if (!dashboard) return null;
  const { uid, slug } = dashboard;

  const toMs = (v) => {
    if (!v) return null;
    return v instanceof Date ? v.getTime() : typeof v === 'number' ? v : new Date(v).getTime();
  };

  const fromVal = toMs(from);
  const toVal = toMs(to);

  const params = new URLSearchParams({
    from: fromVal ? String(fromVal) : 'now-6h',
    to: toVal ? String(toVal) : 'now',
  });

  return `${GRAFANA_URL}/d/${uid}/${slug}?${params.toString()}`;
}
