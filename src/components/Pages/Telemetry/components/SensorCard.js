/**
 * SensorCard.js
 *
 * Individual sensor card that shows the sensor name, a live-updating value
 * (via useLiveSensor), and a live badge. Clicking opens the graph modal.
 */

import React from 'react';
import { useLiveSensor } from '@components/Pages/Telemetry/hooks/useLiveSensor';

function getTypeColor(type) {
  switch (type) {
    case 'temperature':
      return '#ea580c';
    case 'humidity':
      return '#2563eb';
    case 'pressure':
      return '#7c3aed';
    case 'magnetometer':
      return '#ec4899';
    case 'lightIntensity':
      return '#f59e0b';
    case 'loudness':
      return '#8b5cf6';
    case 'helium':
      return '#059669';
    case 'power':
      return '#ca8a04';
    case 'network':
      return '#16a34a';
    default:
      return '#6b7280';
  }
}

/**
 * @param {Object}   props
 * @param {Object}   props.sensor     Sensor descriptor from telemetryService.
 * @param {string}   props.type       Sensor category key (temperature, humidity…).
 * @param {boolean}  props.darkmode
 * @param {Function} props.onClick    Called with the enriched sensor object.
 */
const SensorCard = ({ sensor, type, darkmode, onClick }) => {
  const { display, isLive } = useLiveSensor(sensor.id, sensor.value);
  const valueColor = getTypeColor(type);

  return (
    <div
      className="sensor-card"
      role="button"
      tabIndex={0}
      aria-label={`${sensor.name}: ${display}. Click to view graph.`}
      onClick={() => onClick({ ...sensor, type, value: display })}
      onKeyDown={(e) => e.key === 'Enter' && onClick({ ...sensor, type, value: display })}
      style={{
        background: darkmode ? '#111827' : '#ffffff',
        padding: '14px 16px',
        borderRadius: '10px',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        border: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
        flex: '1',
        minWidth: '120px',
        boxShadow: darkmode ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            fontWeight: '600',
            color: darkmode ? '#f3f4f6' : '#374151',
            fontSize: '13px',
          }}
        >
          {sensor.name}
        </div>
        {isLive && (
          <span
            className="live-badge"
            title="Live data"
            style={{
              background: '#10b981',
              color: '#fff',
              fontSize: '9px',
              fontWeight: '700',
              padding: '1px 5px',
              borderRadius: '4px',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            LIVE
          </span>
        )}
      </div>

      <div
        style={{
          color: valueColor,
          fontSize: '20px',
          fontWeight: 'bold',
          margin: '6px 0 4px',
        }}
      >
        {display}
      </div>

      <div style={{ fontSize: '11px', color: darkmode ? '#6b7280' : '#9ca3af' }}>
        Click for graph →
      </div>
    </div>
  );
};

export default SensorCard;
