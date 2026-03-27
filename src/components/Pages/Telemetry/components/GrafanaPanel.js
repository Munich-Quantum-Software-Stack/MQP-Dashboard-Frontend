/**
 * GrafanaPanel.js
 *
 * Renders a live Grafana iframe when the sensor has a grafanaPanelRef.
 * Shows a skeleton while the iframe loads.
 * When grafanaPanelRef is null, renders a simple "no panel configured" notice.
 */

import React, { useState } from 'react';
import { buildPanelUrl } from '@components/Pages/Telemetry/grafanaConfig';

// ---------------------------------------------------------------------------
// Skeleton loader — shown while the iframe is loading
// ---------------------------------------------------------------------------

const PanelSkeleton = ({ darkmode }) => (
  <div
    className="grafana-skeleton"
    style={{
      background: darkmode
        ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
        : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
      height: '300px',
      borderRadius: '8px',
      margin: '20px',
    }}
    aria-label="Loading panel…"
  />
);

// ---------------------------------------------------------------------------
// NoPanelNotice — shown when grafanaPanelRef is null
// ---------------------------------------------------------------------------

const NoPanelNotice = ({ darkmode }) => (
  <div
    style={{
      padding: '40px 20px',
      textAlign: 'center',
      color: darkmode ? '#6b7280' : '#9ca3af',
      fontSize: '14px',
    }}
  >
    No Grafana panel configured for this sensor.
  </div>
);

// ---------------------------------------------------------------------------
// GrafanaPanel — iframe when panel ref is set, notice otherwise
// ---------------------------------------------------------------------------

/**
 * @param {Object}  props.sensor    Full sensor object (carries grafanaPanelRef).
 * @param {Date}    props.from      Range start.
 * @param {Date}    props.to        Range end.
 * @param {boolean} props.isDarkMode
 */
const GrafanaPanel = ({ sensor, from, to, isDarkMode }) => {
  const [loaded, setLoaded] = useState(false);
  const theme = isDarkMode ? 'dark' : 'light';
  const url = buildPanelUrl(sensor?.grafanaPanelRef, from, to, theme);

  if (!url) {
    return <NoPanelNotice darkmode={isDarkMode} />;
  }

  return (
    <div className="grafana-panel-wrapper" style={{ position: 'relative', minHeight: '300px' }}>
      {!loaded && <PanelSkeleton darkmode={isDarkMode} />}
      <iframe
        src={url}
        title={`Grafana: ${sensor?.name || 'panel'}`}
        frameBorder="0"
        onLoad={() => setLoaded(true)}
        style={{
          width: '100%',
          height: '300px',
          border: 'none',
          display: loaded ? 'block' : 'none',
        }}
      />
    </div>
  );
};

export default GrafanaPanel;
