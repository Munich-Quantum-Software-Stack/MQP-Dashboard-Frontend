import React, { useState, useEffect, useRef } from 'react';
import { buildPanelUrl } from '@components/Pages/Telemetry/grafanaConfig';
import { getConfig } from '@components/Pages/Telemetry/runtimeConfig';
import { parseSensorValue } from '@components/Pages/Telemetry/telemetryService';

const GRACE_MS = 3000;

const PanelSkeleton = ({ darkmode }) => (
  <div
    className="grafana-skeleton"
    style={{
      background: darkmode
        ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
        : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
      backgroundSize: '200% 100%',
      animation: 'shimmer 1.4s infinite',
      height: '300px',
      borderRadius: '8px',
      margin: '20px',
    }}
    aria-label="Loading panel…"
  />
);

function LiveValueFallback({ sensor, darkmode }) {
  const { num, unit } = parseSensorValue(sensor?.value || '0');
  const W = 560;
  const H = 180;
  const pts = 32;

  // Deterministic noise seeded from sensor id so it is stable across renders.
  const seed = (sensor?.id || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const points = Array.from({ length: pts }, (_, i) => {
    const noise = Math.sin(seed + i * 0.8) * 0.15 + Math.sin(i * 0.3 + seed * 0.1) * 0.05;
    const y = H / 2 - noise * H * 0.6;
    return `${(i / (pts - 1)) * W},${y}`;
  }).join(' ');

  const color = darkmode ? '#60a5fa' : '#2563eb';
  const subColor = darkmode ? '#9ca3af' : '#6b7280';

  return (
    <div style={{ padding: '16px 20px' }}>
      {/* Current value badge */}
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 12 }}>
        <span style={{ fontSize: 36, fontWeight: 700, color, lineHeight: 1 }}>{num}</span>
        <span style={{ fontSize: 16, color: subColor }}>{unit}</span>
        <span
          style={{
            marginLeft: 'auto',
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            background: '#10b981',
            color: '#fff',
            borderRadius: 4,
            letterSpacing: '0.5px',
          }}
        >
          LIVE
        </span>
      </div>

      {/* Sparkline */}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        width="100%"
        height={H}
        style={{ display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={`sg-${sensor?.id || 'default'}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polyline
          fill="none"
          stroke={color}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>

      <p
        style={{
          margin: '8px 0 0',
          fontSize: 12,
          color: subColor,
          textAlign: 'center',
        }}
      >
        {sensor?.name} — live telemetry (connect Grafana for historical charts)
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// NoPanelNotice — shown when grafanaPanelRef is null or GRAFANA_URL is blank
// ---------------------------------------------------------------------------

const NoPanelNotice = ({ darkmode, sensor }) => (
  <LiveValueFallback sensor={sensor} darkmode={darkmode} />
);

// ---------------------------------------------------------------------------
// GrafanaPanel — iframe when panel ref is set, fallback otherwise
// ---------------------------------------------------------------------------

/**
 * @param {Object}  props.sensor     Full sensor object (carries grafanaPanelRef, id, name, value).
 * @param {Date}    props.from       Range start.
 * @param {Date}    props.to         Range end.
 * @param {boolean} props.isDarkMode
 */
const GrafanaPanel = ({ sensor, from, to, isDarkMode }) => {
  const { GRAFANA_URL } = getConfig();
  const theme = isDarkMode ? 'dark' : 'light';
  const url = buildPanelUrl(sensor?.grafanaPanelRef, from, to, theme);

  const [phase, setPhase] = useState(() => (url && GRAFANA_URL ? 'loading' : 'fallback'));
  const timerRef = useRef(null);

  // Reset phase when the URL changes (sensor or time range changed).
  useEffect(() => {
    clearTimeout(timerRef.current);
    if (!url || !GRAFANA_URL) {
      setPhase('fallback');
    } else {
      setPhase('loading');
    }
    return () => clearTimeout(timerRef.current);
  }, [url, GRAFANA_URL]);

  const handleLoad = () => {
    timerRef.current = setTimeout(() => setPhase('grafana'), GRACE_MS);
  };

  if (!url || !GRAFANA_URL) {
    return <NoPanelNotice darkmode={isDarkMode} sensor={sensor} />;
  }

  return (
    <div className="grafana-panel-wrapper" style={{ position: 'relative', minHeight: '300px' }}>
      {/* Always render the iframe so it starts loading immediately */}
      <iframe
        src={url}
        title={`Grafana: ${sensor?.name || 'panel'}`}
        frameBorder="0"
        onLoad={handleLoad}
        sandbox="allow-scripts allow-same-origin"
        style={{
          width: '100%',
          height: '300px',
          border: 'none',
          display: phase === 'grafana' ? 'block' : 'none',
        }}
      />

      {/* Skeleton while waiting for the grace period to elapse */}
      {phase === 'loading' && <PanelSkeleton darkmode={isDarkMode} />}

      {/* Fallback when url is null (should not reach here due to early return above) */}
      {phase === 'fallback' && <NoPanelNotice darkmode={isDarkMode} sensor={sensor} />}
    </div>
  );
};

export default GrafanaPanel;
