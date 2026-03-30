

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
  }

  if (!_config.TELEMETRY_API_URL) {
    _config.TELEMETRY_API_URL = process.env.REACT_APP_TELEMETRY_API_URL || '';
  }
  if (!_config.GRAFANA_URL) {
    _config.GRAFANA_URL = process.env.REACT_APP_GRAFANA_URL || '';
  }
  if (!_config.WS_URL) {
    _config.WS_URL = process.env.REACT_APP_WS_URL || '';
  }

  // If the app is served over HTTPS, upgrade any http:// service URLs to
  // https:// so the browser doesn't block them as Mixed Content.
  if (typeof window !== 'undefined' && window.location.protocol === 'https:') {
    ['GRAFANA_URL', 'TELEMETRY_API_URL', 'WS_URL'].forEach((key) => {
      if (_config[key] && _config[key].startsWith('http:')) {
        _config[key] = _config[key].replace(/^http:/, 'https:');
      }
    });
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
