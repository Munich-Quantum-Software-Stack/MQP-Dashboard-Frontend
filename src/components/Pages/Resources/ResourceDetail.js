import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import BlankCard from '@components/UI/Card/BlankCard';
import Button from '@components/UI/Button/Button';
import GrafanaPanel from '@components/Pages/Telemetry/components/GrafanaPanel';
import {
  findRoomByResourceName,
  getAvailableCategories,
} from '@components/Pages/Telemetry/telemetryService';

// Human-readable labels for each telemetry category.
const TELEMETRY_CATEGORY_LABELS = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  pressure: 'Pressure',
  magnetometer: 'Magnetometer',
  lightIntensity: 'Light Intensity',
  loudness: 'Loudness',
  helium: 'Helium',
  power: 'Power',
  network: 'Network',
};

// ---------------------------------------------------------------------------
// ResourceTelemetryWidget
// ---------------------------------------------------------------------------

function ResourceTelemetryWidget({ resourceName, isDarkMode }) {
  const room = findRoomByResourceName(resourceName);
  const categories = room ? getAvailableCategories(room.environmentSensors) : [];

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');

  // Widen the default window to 7 days to increase likelihood of real InfluxDB data.
  const [timeRange] = useState(() => ({
    from: new Date(Date.now() - 7 * 24 * 3600 * 1000),
    to: new Date(),
  }));

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  // Find the first sensor in the selected category for the GrafanaPanel fallback value.
  const firstSensor = (() => {
    if (!room || !selectedCategory) return null;
    const sensors = room.environmentSensors;
    if (selectedCategory === 'temperature') {
      const t = sensors.temperature || {};
      return t.floor?.[0] || t.wall?.[0] || t.roof?.[0] || null;
    }
    const arr = sensors[selectedCategory];
    return Array.isArray(arr) && arr.length > 0 ? arr[0] : null;
  })();

  if (!room) {
    return (
      <div
        style={{
          marginTop: '24px',
          padding: '16px',
          borderRadius: '8px',
          background: isDarkMode ? '#1f2937' : '#f3f4f6',
        }}
      >
        <div
          style={{
            fontWeight: 600,
            marginBottom: '8px',
            color: isDarkMode ? '#f3f4f6' : '#1f2937',
          }}
        >
          Telemetry
        </div>
        <p style={{ fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280', margin: 0 }}>
          Live telemetry not yet linked to this resource. Connect a Grafana instance in config.json.
        </p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '24px' }}>
      <div
        style={{
          fontWeight: 600,
          fontSize: '16px',
          marginBottom: '12px',
          color: isDarkMode ? '#f3f4f6' : '#1f2937',
        }}
      >
        Telemetry — {room.name}
      </div>

      {categories.length > 1 && (
        <div style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label
            htmlFor={`telemetry-group-${resourceName}`}
            style={{ fontSize: '14px', color: isDarkMode ? '#9ca3af' : '#6b7280' }}
          >
            Sensor group:
          </label>
          <select
            id={`telemetry-group-${resourceName}`}
            value={selectedCategory}
            onChange={handleCategoryChange}
            aria-label="Select telemetry sensor group"
            style={{ fontSize: '14px', padding: '4px 8px', borderRadius: '4px' }}
          >
            {categories.map((cat) => {
              const label = TELEMETRY_CATEGORY_LABELS[cat] || cat;
              return (
                <option key={cat} value={cat}>
                  {label}
                </option>
              );
            })}
          </select>
        </div>
      )}

      <GrafanaPanel
        sensor={firstSensor}
        from={timeRange.from}
        to={timeRange.to}
        isDarkMode={isDarkMode}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// ResourceDetail
// ---------------------------------------------------------------------------

const ResourceDetail = () => {
  const params = useParams();
  const navigate = useNavigate();
  const isDarkMode = useSelector((state) => state.accessibilities.darkmode);

  const backToHandler = () => {
    navigate('..');
  };

  return (
    <BlankCard>
      <h1>Resource Detail of {params.resourceId}</h1>

      <ResourceTelemetryWidget resourceName={params.resourceId} isDarkMode={isDarkMode} />

      <div className="resource_detail_actions mt-5">
        <Button className="resource_detail_btn back_btn" onClick={backToHandler}>
          &lt;&lt; Back
        </Button>
      </div>
    </BlankCard>
  );
};

export default ResourceDetail;
