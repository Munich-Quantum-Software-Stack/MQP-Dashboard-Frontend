/**
 * telemetryInstitutionService.js
 *
 * API-ready data service for institution/resource data.
 *
 * Phase 1 (current): serves data directly from the INSTITUTION_MANIFEST mock.
 * Phase 2 (backend integration): when TELEMETRY_API_URL is set, fetches from
 *   GET /institutions          → list of all institutions
 *   GET /institutions/:id      → single institution with resources
 *
 * All fetch calls accept an AbortSignal to prevent memory leaks on unmount.
 */

import { getConfig } from './runtimeConfig';
import { getInstitutions, getInstitutionById } from './institutionData';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getApiBase() {
  return (getConfig().TELEMETRY_API_URL || '').replace(/\/$/, '');
}

/**
 * Safely fetches JSON from a URL with abort signal support.
 * Throws an Error with a user-readable message on failure.
 *
 * @param {string} url
 * @param {AbortSignal} signal
 * @returns {Promise<unknown>}
 */
async function apiFetch(url, signal) {
  let response;
  try {
    response = await fetch(url, { signal });
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error(`Network error: ${err.message}`);
  }
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} from ${url}`);
  }
  return response.json();
}

// ---------------------------------------------------------------------------
// Public service functions
// ---------------------------------------------------------------------------

/**
 * Returns all institutions.
 * Uses the API if TELEMETRY_API_URL is configured, otherwise falls back to mock.
 *
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<import('./institutionData').INSTITUTION_MANIFEST_TYPE>}
 */
export async function fetchInstitutions({ signal } = {}) {
  const base = getApiBase();
  if (base) {
    const data = await apiFetch(`${base}/institutions`, signal);
    return data.institutions ?? data;
  }
  // Mock fallback — return a resolved promise so callers are always async
  return Promise.resolve(getInstitutions());
}

/**
 * Returns a single institution by ID (with its resources).
 * Uses the API if TELEMETRY_API_URL is configured, otherwise falls back to mock.
 *
 * @param {string} id
 * @param {{ signal?: AbortSignal }} options
 * @returns {Promise<import('./institutionData').INSTITUTION_MANIFEST_TYPE[number]>}
 */
export async function fetchInstitutionById(id, { signal } = {}) {
  const base = getApiBase();
  if (base) {
    const data = await apiFetch(`${base}/institutions/${encodeURIComponent(id)}`, signal);
    return data.institution ?? data;
  }
  return Promise.resolve(getInstitutionById(id));
}
