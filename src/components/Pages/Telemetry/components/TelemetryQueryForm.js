import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useTelemetryQuery } from '@components/Pages/Telemetry/hooks/useTelemetryQuery';

// InfluxQL duration strings accepted by the backend group_by parameter.
const GROUP_BY_OPTIONS = ['1m', '5m', '15m', '30m', '1h', '6h', '1d'];

// One day in milliseconds — used to seed the default "from" timestamp.
const ONE_DAY_MS = 24 * 60 * 60 * 1000;

// Format a Date object as the string expected by <input type="datetime-local">.
function toDatetimeLocal(date) {
  const pad = (n) => String(n).padStart(2, '0');
  return (
    `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
    `T${pad(date.getHours())}:${pad(date.getMinutes())}`
  );
}

/**
 * TelemetryQueryForm
 *
 * Drives the full telemetry retrieval flow:
 *
 *   1. On mount: GET /telemetry/sensors → populates measurement + sensor checkboxes.
 *   2. On submit: POST /telemetry { measurements, from_timestamp, to_timestamp, group_by }
 *                 → { filename, filesize }
 *   3. POST /telemetry/download/ { filename } → .json.gz blob
 *   4. Decompress (DecompressionStream) + parse + normalise
 *   5. Call onResult(data) with the normalised result.
 *
 * See telemetry-http.js for the full HTTP contract and telemetry-http.js → normalizeTelemetry
 * for the shape of the data passed to onResult.
 *
 * Props:
 *   onResult(data)  — called with normalised telemetry on success; shape:
 *                     { [measurementName]: { [sensorKey]: [{time, mean, ts}] } }
 *   darkmode        — boolean
 */
const TelemetryQueryForm = ({ onResult, darkmode }) => {
  const { data, sensors, status, error, execute, loadSensors, reset } = useTelemetryQuery();
  const fontSize = useSelector((state) => state.accessibilities.font_size) || 14;

  // Lazy-initialise timestamps so they are computed once, not on every render.
  const [from, setFrom] = useState(() => toDatetimeLocal(new Date(Date.now() - ONE_DAY_MS)));
  const [to, setTo] = useState(() => toDatetimeLocal(new Date()));
  const [groupBy, setGroupBy] = useState('5m');
  // { [measurementName]: Set<sensorKey> } — tracks checkbox selection state.
  const [selected, setSelected] = useState({});

  // Fetch available sensors from GET /telemetry/sensors once on mount.
  useEffect(() => {
    loadSensors();
  }, [loadSensors]);

  // Call onResult when the query succeeds. Use a ref so stale closures aren't an issue.
  const onResultRef = useRef(onResult);
  onResultRef.current = onResult;
  useEffect(() => {
    if (status === 'success' && data && onResultRef.current) {
      onResultRef.current(data);
    }
  }, [status, data]);

  const toggleSensor = (measurementName, sensorKey) => {
    setSelected((prev) => {
      const next = new Set(prev[measurementName] || []);
      next.has(sensorKey) ? next.delete(sensorKey) : next.add(sensorKey);
      return { ...prev, [measurementName]: next };
    });
  };

  const toggleMeasurement = (measurementName, allSensorKeys) => {
    setSelected((prev) => {
      const current = prev[measurementName] || new Set();
      const allChecked = allSensorKeys.every((k) => current.has(k));
      return { ...prev, [measurementName]: allChecked ? new Set() : new Set(allSensorKeys) };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Build the measurements array from checkbox state.
    // Passing null tells the backend to query all available sensors.
    const measurements = Object.entries(selected)
      .filter(([, sensorSet]) => sensorSet.size > 0)
      .map(([name, sensorSet]) => ({ name, sensors: Array.from(sensorSet) }));

    // reset() clears previous data/error before starting a new request.
    reset();
    execute({
      measurements: measurements.length > 0 ? measurements : null,
      fromTs: new Date(from).getTime(),
      toTs: new Date(to).getTime(),
      groupBy,
    });
  };

  const isLoading = status === 'loading';

  // ── Shared style tokens ──────────────────────────────────────────────────────
  const color = {
    text:        darkmode ? '#f3f4f6' : '#1f2937',
    textMuted:   darkmode ? '#d1d5db' : '#374151',
    textFaint:   darkmode ? '#9ca3af' : '#6b7280',
    bg:          darkmode ? '#1f2937' : '#f9fafb',
    bgInput:     darkmode ? '#111827' : '#ffffff',
    bgCard:      darkmode ? '#111827' : '#ffffff',
    border:      darkmode ? '#374151' : '#e5e7eb',
    borderInput: darkmode ? '#374151' : '#d1d5db',
  };

  const styles = {
    form: {
      background: color.bg,
      border: `1px solid ${color.border}`,
      borderRadius: 12,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
    },
    heading: {
      margin: 0,
      color: color.text,
      fontSize: Math.round(fontSize * 1.3),
    },
    label: {
      display: 'block',
      fontWeight: 600,
      fontSize,
      color: color.textMuted,
      marginBottom: 4,
    },
    input: {
      display: 'block',
      width: '100%',
      background: color.bgInput,
      color: color.text,
      border: `1px solid ${color.borderInput}`,
      borderRadius: 6,
      padding: '6px 10px',
      fontSize,
      boxSizing: 'border-box',
    },
    measurementCard: {
      background: color.bgCard,
      border: `1px solid ${color.border}`,
      borderRadius: 8,
      padding: '12px 16px',
    },
    measurementHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      cursor: 'pointer',
      marginBottom: 8,
    },
    measurementName: {
      fontWeight: 600,
      fontSize,
      color: color.text,
    },
    sensorRow: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      paddingLeft: 24,
    },
    sensorLabel: {
      display: 'flex',
      alignItems: 'center',
      gap: 6,
      fontSize: 13,
      color: color.textMuted,
      cursor: 'pointer',
    },
    alertError: {
      background: darkmode ? '#450a0a' : '#fef2f2',
      border: `1px solid ${darkmode ? '#991b1b' : '#fca5a5'}`,
      color: darkmode ? '#fca5a5' : '#b91c1c',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
    },
    alertSuccess: {
      background: darkmode ? '#052e16' : '#f0fdf4',
      border: `1px solid ${darkmode ? '#166534' : '#86efac'}`,
      color: darkmode ? '#86efac' : '#15803d',
      borderRadius: 8,
      padding: '10px 14px',
      fontSize: 13,
    },
    btnPrimary: {
      padding: '10px 24px',
      borderRadius: 8,
      border: 'none',
      background: isLoading ? '#6b7280' : '#2563eb',
      color: '#ffffff',
      fontWeight: 700,
      fontSize: 14,
      cursor: isLoading ? 'not-allowed' : 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
    },
    btnSecondary: {
      padding: '10px 16px',
      borderRadius: 8,
      border: `1px solid ${color.borderInput}`,
      background: 'transparent',
      color: color.textFaint,
      fontWeight: 600,
      fontSize: 14,
      cursor: 'pointer',
    },
  };

  return (
    <>
      {/* @keyframes for the submit-button spinner */}
      <style>{`@keyframes tq-spin { to { transform: rotate(360deg); } }`}</style>

      <form onSubmit={handleSubmit} style={styles.form} aria-label="Telemetry query form">
        <h3 style={styles.heading}>Query Telemetry Data</h3>

        {/* ── Time range + group_by ─────────────────────────────────────── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="tq-from" style={styles.label}>From</label>
            <input
              id="tq-from"
              type="datetime-local"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="tq-to" style={styles.label}>To</label>
            <input
              id="tq-to"
              type="datetime-local"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              required
              style={styles.input}
            />
          </div>
          <div style={{ minWidth: 110 }}>
            <label htmlFor="tq-groupby" style={styles.label}>Group by</label>
            <select
              id="tq-groupby"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
              style={styles.input}
            >
              {GROUP_BY_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        </div>

        {/* ── Measurement + sensor picker (populated from /telemetry/sensors) ── */}
        {sensors && sensors.length > 0 && (
          <div>
            <label style={styles.label}>Measurements &amp; Sensors</label>
            <p style={{ fontSize: 12, color: color.textFaint, margin: '0 0 10px' }}>
              Leave all unchecked to query every available sensor.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {sensors.map(({ name: measurementName, sensors: sensorKeys }) => {
                const currentSet = selected[measurementName] || new Set();
                const allChecked = sensorKeys.length > 0 && sensorKeys.every((k) => currentSet.has(k));
                const someChecked = sensorKeys.some((k) => currentSet.has(k));
                return (
                  <div key={measurementName} style={styles.measurementCard}>
                    {/* Select-all toggle for the measurement */}
                    <label style={styles.measurementHeader}>
                      <input
                        type="checkbox"
                        checked={allChecked}
                        ref={(el) => { if (el) el.indeterminate = someChecked && !allChecked; }}
                        onChange={() => toggleMeasurement(measurementName, sensorKeys)}
                      />
                      <span style={styles.measurementName}>{measurementName}</span>
                    </label>
                    {/* Individual sensor checkboxes — keys match InfluxDB field keys */}
                    <div style={styles.sensorRow}>
                      {sensorKeys.map((sensorKey) => (
                        <label key={sensorKey} style={styles.sensorLabel}>
                          <input
                            type="checkbox"
                            checked={currentSet.has(sensorKey)}
                            onChange={() => toggleSensor(measurementName, sensorKey)}
                          />
                          {sensorKey}
                        </label>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Status feedback ───────────────────────────────────────────── */}
        {status === 'error' && error && (
          <div role="alert" style={styles.alertError}>{error}</div>
        )}
        {status === 'success' && (
          <div role="status" style={styles.alertSuccess}>
            Telemetry data loaded successfully.
          </div>
        )}

        {/* ── Actions ───────────────────────────────────────────────────── */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button type="submit" disabled={isLoading} style={styles.btnPrimary} aria-busy={isLoading}>
            {isLoading && (
              <span style={{
                width: 14, height: 14,
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'tq-spin 0.8s linear infinite',
              }} />
            )}
            {isLoading ? 'Fetching…' : 'Fetch Telemetry'}
          </button>
          {status !== 'idle' && (
            <button type="button" onClick={reset} style={styles.btnSecondary}>
              Reset
            </button>
          )}
        </div>
      </form>
    </>
  );
};

export default TelemetryQueryForm;
