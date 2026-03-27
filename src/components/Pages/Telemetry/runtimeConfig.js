/**
 * runtimeConfig.js
 *
 * Loads runtime configuration from /config.json at application startup.
 *
 * This means Docker/K8s deployments can volume-mount a config.json with real
 * values (API URLs, Grafana URL, WS URL) without rebuilding the React bundle —
 * the file is a plain static asset served by the same web server.
 *
 * Loading order (first non-empty value wins):
 *   1. /config.json values (runtime — set by deployment)
 *   2. REACT_APP_* environment variables (build-time — for local dev convenience)
 *   3. Empty string → isMock() returns true → mock/offline mode
 *
 * Typical usage
 * -------------
 *   // App.js (once, before first render):
 *   await loadRuntimeConfig();
 *
 *   // Anywhere else (always synchronous after load):
 *   const { GRAFANA_URL } = getConfig();
 *   if (isMock('TELEMETRY_API_URL')) { ... use mock data ... }
 */

let _config = {
  TELEMETRY_API_URL: '',
  GRAFANA_URL: '',
  WS_URL: '',
};

let _loaded = false;

/**
 * Fetches /config.json and merges values into the in-memory config.
 * Safe to call multiple times — only performs a network request on the first call.
 *
 * @returns {Promise<{TELEMETRY_API_URL:string, GRAFANA_URL:string, WS_URL:string}>}
 */
export async function loadRuntimeConfig() {
  if (_loaded) return _config;

  try {
    const res = await fetch('/config.json', { cache: 'no-store' });
    if (res.ok) {
      const json = await res.json();
      _config = { ..._config, ...json };
    }
  } catch {
    // config.json may not exist in some local dev setups — fall through to env vars
  }

  // Fallback: build-time env vars (useful for `npm start` without a config.json)
  if (!_config.TELEMETRY_API_URL) {
    _config.TELEMETRY_API_URL = process.env.REACT_APP_TELEMETRY_API_URL || '';
  }
  if (!_config.GRAFANA_URL) {
    _config.GRAFANA_URL = process.env.REACT_APP_GRAFANA_URL || '';
  }
  if (!_config.WS_URL) {
    _config.WS_URL = process.env.REACT_APP_WS_URL || '';
  }

  _loaded = true;
  return _config;
}

/**
 * Returns the current runtime config. Always synchronous — assumes
 * loadRuntimeConfig() has already resolved before any component mounts.
 *
 * @returns {{TELEMETRY_API_URL:string, GRAFANA_URL:string, WS_URL:string}}
 */
export function getConfig() {
  return _config;
}

/**
 * Returns true when the given URL key is blank → use mock/offline data.
 *
 * @param {'TELEMETRY_API_URL'|'GRAFANA_URL'|'WS_URL'} key
 * @returns {boolean}
 */
export function isMock(key) {
  switch (key) {
    case 'TELEMETRY_API_URL':
      return !_config.TELEMETRY_API_URL;
    case 'GRAFANA_URL':
      return !_config.GRAFANA_URL;
    case 'WS_URL':
      return !_config.WS_URL;
    default:
      return true;
  }
}
