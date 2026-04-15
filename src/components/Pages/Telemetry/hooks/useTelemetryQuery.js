/**
 * useTelemetryQuery.js
 *
 * React hook that manages the complete telemetry fetch lifecycle:
 *   1. Reads the bearer token from Redux state
 *   2. Accepts query parameters (measurements, fromTs, toTs, groupBy)
 *   3. Executes the 2-step backend flow via telemetry-http.js
 *   4. Tracks loading / success / error state
 *   5. Handles token expiry by dispatching set_expired
 *   6. Prevents duplicate overlapping requests
 *
 * Optional: call loadSensors() first to populate the sensor list for
 * driving the selection UI (GET /telemetry/sensors).
 *
 * Returns:
 *   data          — normalized telemetry ({ [measurement]: { [sensor]: [{time, mean, ts}] } }) | null
 *   sensors       — available sensors from /telemetry/sensors | null
 *   status        — 'idle' | 'loading' | 'success' | 'error'
 *   error         — human-readable error string | null
 *   execute(params) — fire a telemetry fetch; no-ops if one is already in flight
 *   loadSensors() — optionally fetch /telemetry/sensors once
 *   reset()       — cancel any in-flight request and return to idle
 */

import { useState, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { authActions } from '@store/auth-slice';
import {
  fetchTelemetry,
  fetchTelemetrySensors,
  AuthExpiredError,
  TelemetryValidationError,
} from '@components/utils/telemetry-http';

export function useTelemetryQuery() {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.authentication.access_token);

  const [data, setData] = useState(null);
  const [sensors, setSensors] = useState(null);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);

  // Holds the AbortController for any in-flight request so it can be cancelled.
  const abortRef = useRef(null);

  const handleAuthExpired = useCallback(() => {
    dispatch(authActions.set_expired());
  }, [dispatch]);

  /** Cancel any in-flight request and reset all state to initial values. */
  const reset = useCallback(() => {
    if (abortRef.current) {
      abortRef.current.abort();
      abortRef.current = null;
    }
    setData(null);
    setError(null);
    setStatus('idle');
  }, []);

  /**
   * Optionally fetch the list of available measurements + sensors from
   * GET /telemetry/sensors. Non-fatal on failure — the picker stays empty
   * and the user can still submit a query with measurements = null.
   */
  const loadSensors = useCallback(async () => {
    if (!token) {
      return;
    }
    try {
      const result = await fetchTelemetrySensors(token);
      setSensors(result);
    } catch (err) {
      if (err instanceof AuthExpiredError) {
        handleAuthExpired();
      }
      // Non-fatal; the sensor picker falls back to manual input
    }
  }, [token, handleAuthExpired]);

  /**
   * Execute the full 2-step telemetry fetch.
   *
   * No-ops if a request is already in flight. Cancels a previous AbortController
   * if called again while idle (shouldn't happen, but defensive).
   *
   * @param {{
   *   measurements?: Array<{name:string, sensors?:string[]}> | null,
   *   fromTs: number,
   *   toTs:   number,
   *   groupBy: string
   * }} params
   */
  const execute = useCallback(
    async (params) => {
      // Deduplicate: ignore calls while a request is in flight
      if (status === 'loading') return;

      if (!token) {
        setError('Not authenticated. Please log in before querying telemetry.');
        setStatus('error');
        return;
      }

      // Cancel any lingering previous controller (defensive)
      if (abortRef.current) abortRef.current.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStatus('loading');
      setError(null);

      try {
        const result = await fetchTelemetry(token, params, controller.signal);
        setData(result);
        setStatus('success');
      } catch (err) {
        // Request was cancelled — component unmounted or superseded; don't update state
        if (err.name === 'AbortError') return;

        if (err instanceof AuthExpiredError) {
          handleAuthExpired();
          setError('Your session has expired. Please log in again.');
        } else if (err instanceof TelemetryValidationError) {
          setError(err.message);
        } else {
          setError(err.message || 'Failed to retrieve telemetry data. Please try again.');
        }

        setStatus('error');
      } finally {
        // Only clear the ref if this controller is still current
        if (abortRef.current === controller) {
          abortRef.current = null;
        }
      }
    },
    [token, status, handleAuthExpired],
  );

  return { data, sensors, status, error, execute, loadSensors, reset };
}
