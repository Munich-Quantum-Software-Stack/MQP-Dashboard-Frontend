/**
 * runtimeConfig.js - Provides runtime configuration for the Telemetry module.
 *
 * Reads from window.__config (populated by public/config.json at deployment)
 * with a fallback to REACT_APP_* environment variables for local development.
 */

export function getConfig() {
  const windowConfig = typeof window !== 'undefined' && window.__config ? window.__config : {};

  return {
    TELEMETRY_API_URL:
      windowConfig.TELEMETRY_API_URL || process.env.REACT_APP_TELEMETRY_API_URL || null,
    GRAFANA_URL: windowConfig.GRAFANA_URL || process.env.REACT_APP_GRAFANA_URL || null,
    WS_URL: windowConfig.WS_URL || process.env.REACT_APP_WS_URL || null,
    GRAFANA_PANEL_TIMEOUT_MS:
      windowConfig.GRAFANA_PANEL_TIMEOUT_MS ||
      Number(process.env.REACT_APP_GRAFANA_PANEL_TIMEOUT_MS) ||
      10000,
  };
}
