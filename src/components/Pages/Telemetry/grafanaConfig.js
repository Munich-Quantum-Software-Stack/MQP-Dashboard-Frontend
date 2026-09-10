import { getConfig } from './runtimeConfig';

const GRAFANA_ORG_ID = '1';
const GRAFANA_TIMEZONE = 'browser';

/** Convert a Date, number (ms), or ISO string to milliseconds. */
function toMs(v) {
  if (!v) return null;
  return v instanceof Date ? v.getTime() : typeof v === 'number' ? v : new Date(v).getTime();
}

function getPanelSlug(panelRef) {
  return panelRef.slug || panelRef.dashboardUid.replace(/-telemetry$/, '');
}

/** Module-level map of roomId → Grafana dashboard metadata. */
const ROOM_DASHBOARDS = new Map([
  ['warm-lab', { uid: '55b99d46-9e7d-4b1c-b5dc-592592f60031', slug: 'warmlab' }],
]);

/**
 * @param {{ dashboardUid: string, slug?: string, panelId: number } | null} panelRef
 * @param {Date|string|null} from  Start of time range (null → 'now-6h').
 * @param {Date|string|null} to    End of time range (null → 'now').
 * @param {'dark'|'light'} theme
 * @returns {string|null}
 */
export function buildPanelUrl(panelRef, from, to, theme = 'dark') {
  const { GRAFANA_URL } = getConfig();
  if (!GRAFANA_URL || !panelRef?.dashboardUid) return null;

  const fromVal = toMs(from);
  const toVal = toMs(to);
  const slug = getPanelSlug(panelRef);

  const params = new URLSearchParams({
    panelId: String(panelRef.panelId),
    from: fromVal ? String(fromVal) : 'now-6h',
    to: toVal ? String(toVal) : 'now',
    theme,
    orgId: GRAFANA_ORG_ID,
    timezone: GRAFANA_TIMEZONE,
  });

  return `${GRAFANA_URL}/d-solo/${panelRef.dashboardUid}/${slug}?${params.toString()}&__feature.dashboardSceneSolo`;
}

/**
 * Build a Grafana URL that opens a specific panel expanded in its dashboard.
 *
 * @param {{ dashboardUid: string, slug?: string, panelId: number } | null} panelRef
 * @param {Date|string|null} from
 * @param {Date|string|null} to
 * @returns {string|null}
 */
export function buildPanelViewUrl(panelRef, from, to) {
  const { GRAFANA_URL } = getConfig();
  if (!GRAFANA_URL || !panelRef?.dashboardUid) return null;

  const fromVal = toMs(from);
  const toVal = toMs(to);
  const slug = getPanelSlug(panelRef);

  const params = new URLSearchParams({
    panelId: String(panelRef.panelId),
    viewPanel: String(panelRef.panelId),
    from: fromVal ? String(fromVal) : 'now-6h',
    to: toVal ? String(toVal) : 'now',
    orgId: GRAFANA_ORG_ID,
    timezone: GRAFANA_TIMEZONE,
  });

  return `${GRAFANA_URL}/d/${panelRef.dashboardUid}/${slug}?${params.toString()}`;
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

  const dashboard = ROOM_DASHBOARDS.get(roomId) ?? null;
  if (!dashboard) return null;

  const fromVal = toMs(from);
  const toVal = toMs(to);

  const params = new URLSearchParams({
    from: fromVal ? String(fromVal) : 'now-6h',
    to: toVal ? String(toVal) : 'now',
  });

  return `${GRAFANA_URL}/d/${dashboard.uid}/${dashboard.slug}?${params.toString()}`;
}
