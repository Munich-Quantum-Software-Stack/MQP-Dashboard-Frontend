/**
 * DownloadBar.js
 *
 * Sticky bottom bar that appears when ≥1 sensor is selected.
 * Shows the selection count and a "Download CSV" button.
 * Displays per-sensor export progress while the download is running.
 */

import React, { useState } from 'react';
import { exportCSV } from '@components/Pages/Telemetry/telemetryService';

// Maps sensor ID prefixes to short label abbreviations used in CSV filenames.
const SENSOR_ABBREV_MAP = [
  [/^(temp|cold-temp|cc-temp|cloud-temp)/, 'temp'],
  [/^(humid|cc-humid)/, 'hum'],
  [/^pressure|cloud-pressure|cold-pressure/, 'pres'],
  [/^(magnetometer|cold-magnetometer|cc-magnetometer|cloud-magnetometer)/, 'mag'],
  [/^(light|cold-light|cc-light|cloud-light)/, 'light'],
  [/^(loudness|cold-loudness|cc-loudness|cloud-loudness)/, 'loud'],
  [/^he-/, 'he'],
  [/^cc-power/, 'power'],
  [/^cloud-network/, 'net'],
];

/**
 * @param {Object}   props
 * @param {string[]} props.selectedIds  Array of selected sensor IDs.
 * @param {Date}     props.from         Range start.
 * @param {Date}     props.to           Range end.
 * @param {boolean}  props.darkmode
 */
const DownloadBar = ({ selectedIds, from, to, darkmode }) => {
  const [downloading, setDownloading] = useState(false);
  // { done: number, total: number } | null
  const [progress, setProgress] = useState(null);
  const count = selectedIds.length;

  if (count === 0) return null;

  const handleDownload = async () => {
    setDownloading(true);
    setProgress(null);
    try {
      const blob = await exportCSV(selectedIds, from, to, ({ done, total }) => {
        setProgress({ done, total });
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;

      // Build a short label from the categories present in selectedIds
      const seen = new Set();
      selectedIds.forEach((id) => {
        for (const [pattern, abbrev] of SENSOR_ABBREV_MAP) {
          if (pattern.test(id)) {
            seen.add(abbrev);
            break;
          }
        }
      });
      const label = seen.size > 0 ? Array.from(seen).join('') : 'data';
      a.download = `telemetry-export-${label}.csv`;

      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('CSV export failed:', err);
    } finally {
      setDownloading(false);
      setProgress(null);
    }
  };

  return (
    <div
      className="download-bar"
      role="status"
      aria-live="polite"
      style={{
        position: 'sticky',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        background: darkmode
          ? 'linear-gradient(135deg, #1e3a5f 0%, #1e40af 100%)'
          : 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
        borderTop: `1px solid ${darkmode ? '#2563eb' : '#bfdbfe'}`,
        borderRadius: '0 0 12px 12px',
        padding: '14px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        boxShadow: darkmode ? '0 -4px 20px rgba(0,0,0,0.4)' : '0 -4px 20px rgba(59,130,246,0.15)',
      }}
    >
      <span
        style={{
          fontWeight: '600',
          color: darkmode ? '#93c5fd' : '#1d4ed8',
          fontSize: '14px',
        }}
      >
        {downloading && progress
          ? `Exporting ${progress.done} / ${progress.total} sensor${progress.total !== 1 ? 's' : ''}…`
          : `${count} sensor${count !== 1 ? 's' : ''} selected`}
      </span>

      <button
        onClick={handleDownload}
        disabled={downloading}
        style={{
          padding: '10px 24px',
          borderRadius: '8px',
          border: 'none',
          background: downloading ? '#6b7280' : '#2563eb',
          color: '#ffffff',
          fontWeight: '700',
          fontSize: '14px',
          cursor: downloading ? 'not-allowed' : 'pointer',
          transition: 'background 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
        aria-busy={downloading}
      >
        {downloading ? (
          <>
            <span
              style={{
                width: '14px',
                height: '14px',
                border: '2px solid rgba(255,255,255,0.3)',
                borderTopColor: '#fff',
                borderRadius: '50%',
                display: 'inline-block',
                animation: 'spin 0.8s linear infinite',
              }}
            />
            {progress ? `${progress.done} / ${progress.total}` : 'Exporting…'}
          </>
        ) : (
          <>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 12l-4-4h2.5V3h3v5H12L8 12z" />
              <rect x="2" y="13" width="12" height="1.5" rx="0.75" />
            </svg>
            Download CSV
          </>
        )}
      </button>
    </div>
  );
};

export default DownloadBar;
