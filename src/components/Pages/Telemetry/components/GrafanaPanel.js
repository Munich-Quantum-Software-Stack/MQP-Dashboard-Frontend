/**
 * GrafanaPanel.js
 *
 * Single-responsibility component that renders:
 *  • A live Grafana iframe  — when GRAFANA_URL is in runtime config AND the
 *    sensor carries a grafanaPanelRef.
 *  • A DummyGraph (SVG)     — when no Grafana URL / panel ref is available.
 *
 * Iframe lifecycle state machine:
 *   'loading' → iframe mounted, 8-second timeout started
 *   'ready'   → iframe fired onLoad before timeout
 *   'error'   → timeout elapsed OR iframe fired onError → falls back to DummyGraph
 *
 * Also exposes DummyGraph as a named export so callers can use it standalone.
 */

import React, { useState, useEffect, useRef } from 'react';
import { buildPanelUrl } from '@components/Pages/Telemetry/grafanaConfig';
import { getConfig } from '@components/Pages/Telemetry/runtimeConfig';

// ---------------------------------------------------------------------------
// DummyGraph — Grafana-style SVG chart with generated sample points
// ---------------------------------------------------------------------------

export const DummyGraph = ({ sensor, darkmode, error }) => {
  // Seeded random walk so the same sensor always looks visually consistent
  const generatePoints = (seed = 0) => {
    let v = 100 + (seed % 30);
    return Array.from({ length: 21 }, (_, i) => {
      v += Math.sin(i * 0.6 + seed) * 12 + (((i * seed * 7) % 17) - 8) * 0.5;
      return `${(i / 20) * 400},${Math.max(20, Math.min(180, v))}`;
    }).join(' ');
  };

  const seed = sensor?.sensorKey
    ? sensor.sensorKey.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
    : 0;
  const points = generatePoints(seed);

  const valueDisplay = (() => {
    const t = sensor?.type;
    if (t === 'temperature') return sensor?.value || '22.4°C';
    if (t === 'humidity') return sensor?.value || '45%';
    if (t === 'pressure') return sensor?.value || '1013 hPa';
    if (t === 'helium') return sensor?.value || '88%';
    if (t === 'power') return sensor?.value || '42 kW';
    if (t === 'network') return sensor?.value || '12ms';
    return sensor?.value || '0.02 µg/m³';
  })();

  return (
    <div style={{ padding: '20px' }}>
      {error && (
        <div
          style={{
            marginBottom: '10px',
            padding: '8px 12px',
            background: darkmode ? '#2d1b1b' : '#fef2f2',
            border: `1px solid ${darkmode ? '#7f1d1d' : '#fca5a5'}`,
            borderRadius: '6px',
            fontSize: '12px',
            color: darkmode ? '#fca5a5' : '#b91c1c',
          }}
          role="alert"
        >
          Grafana panel unavailable — showing sample data
        </div>
      )}
      <div
        style={{
          background: darkmode ? '#1f2937' : '#f9fafb',
          borderRadius: '8px',
          padding: '20px',
          border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
        }}
      >
        <div
          style={{
            marginBottom: '15px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span style={{ color: darkmode ? '#9ca3af' : '#6b7280', fontSize: '12px' }}>
              SENSOR DATA
            </span>
            <h4 style={{ margin: '5px 0', color: darkmode ? '#f3f4f6' : '#1f2937' }}>
              {sensor?.name}
            </h4>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ color: '#10b981', fontSize: '24px', fontWeight: 'bold' }}>
              {valueDisplay}
            </span>
            <div style={{ color: '#10b981', fontSize: '12px' }}>▲ 2.1% from last hour</div>
          </div>
        </div>

        <svg width="100%" height="200" viewBox="0 0 420 200" style={{ overflow: 'visible' }}>
          <defs>
            <linearGradient id={`grad-${seed}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="0"
              y1={40 + i * 40}
              x2="400"
              y2={40 + i * 40}
              stroke={darkmode ? '#374151' : '#e5e7eb'}
              strokeWidth="1"
            />
          ))}
          {[100, 75, 50, 25, 10].map((label, i) => (
            <text
              key={label}
              x="-5"
              y={45 + i * 40}
              fill={darkmode ? '#9ca3af' : '#6b7280'}
              fontSize="10"
              textAnchor="end"
            >
              {label}
            </text>
          ))}
          <polygon points={`0,180 ${points} 400,180`} fill={`url(#grad-${seed})`} />
          <polyline points={points} fill="none" stroke="#3b82f6" strokeWidth="2" />
          {['00:00', '06:00', '12:00', '18:00', 'Now'].map((label, i) => (
            <text
              key={label}
              x={i === 4 ? 380 : i * 100}
              y="195"
              fill={darkmode ? '#9ca3af' : '#6b7280'}
              fontSize="10"
            >
              {label}
            </text>
          ))}
        </svg>

        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '20px',
            marginTop: '15px',
            fontSize: '12px',
            color: darkmode ? '#9ca3af' : '#6b7280',
          }}
        >
          <span>Min: —</span>
          <span>Max: —</span>
          <span>Avg: {valueDisplay}</span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------------------------
// Skeleton loader — shown while an iframe is loading
// ---------------------------------------------------------------------------

const PanelSkeleton = ({ darkmode }) => (
  <div
    className="grafana-skeleton"
    style={{
      background: darkmode
        ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
        : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    }}
    aria-label="Loading panel…"
  />
);

// ---------------------------------------------------------------------------
// GrafanaPanel — iframe when configured, DummyGraph otherwise
// ---------------------------------------------------------------------------

/**
 * @param {Object}                                          props
 * @param {{ dashboardUid: string, panelId: number } | null} props.panelRef
 *   The grafanaPanelRef from the sensor object. Null → DummyGraph.
 * @param {Object}  props.sensor    Full sensor object (passed to DummyGraph).
 * @param {Date}    props.from      Range start.
 * @param {Date}    props.to        Range end.
 * @param {boolean} props.darkmode  Dark mode flag from Redux.
 */
const GrafanaPanel = ({ sensor, from, to, isDarkMode }) => {
  // 'loading' | 'ready' | 'error'
  const [status, setStatus] = useState('loading');
  const timeoutRef = useRef(null);
  const { GRAFANA_URL, GRAFANA_PANEL_TIMEOUT_MS } = getConfig();
  const theme = isDarkMode ? 'dark' : 'light';
  const url = buildPanelUrl(sensor?.grafanaPanelRef, from, to, theme);

  useEffect(() => {
    if (!url) return;

    // Reset to loading state whenever the URL changes (date range / panel change)
    setStatus('loading');

    timeoutRef.current = setTimeout(() => {
      setStatus('error');
    }, GRAFANA_PANEL_TIMEOUT_MS || 10000);

    return () => clearTimeout(timeoutRef.current);
  }, [url, GRAFANA_PANEL_TIMEOUT_MS]);

  if (!url) {
    return <DummyGraph sensor={sensor} darkmode={isDarkMode} error={false} />;
  }

  if (status === 'error') {
    return (
      <>
        <DummyGraph sensor={sensor} darkmode={isDarkMode} error={true} />
        <p
          className="grafana-unavailable-notice"
          style={{
            margin: '8px 16px',
            fontSize: '12px',
            color: isDarkMode ? '#fca5a5' : '#b91c1c',
          }}
        >
          ⚠ Grafana panel unavailable — showing simulated data. Check that Grafana is running at{' '}
          {GRAFANA_URL || 'localhost:3000'}.
        </p>
      </>
    );
  }

  return (
    <div className="grafana-panel-wrapper" style={{ position: 'relative', minHeight: '220px' }}>
      {status === 'loading' && <PanelSkeleton darkmode={isDarkMode} />}
      <iframe
        src={url}
        title={`Grafana: ${sensor?.name || 'panel'}`}
        frameBorder="0"
        loading="lazy"
        className={`grafana-panel-iframe${status === 'ready' ? ' loaded' : ''}`}
        onLoad={() => {
          clearTimeout(timeoutRef.current);
          setStatus('ready');
        }}
        onError={() => {
          clearTimeout(timeoutRef.current);
          setStatus('error');
        }}
        style={{
          width: '100%',
          height: '220px',
          border: 'none',
          display: status === 'ready' ? 'block' : 'none',
        }}
      />
    </div>
  );
};

export default GrafanaPanel;
