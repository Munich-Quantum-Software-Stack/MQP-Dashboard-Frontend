import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import PaneCard from '@components/UI/Card/PaneCard';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import GrafanaPanel from './components/GrafanaPanel';
import ChipVisualisation from '@components/Shared/ChipVisualisation/ChipVisualisation';
import {
  clearTelemetrySensorsCache,
  downloadTelemetryExportFile,
  getRoomData,
  getTelemetrySensors,
  requestTelemetryExport,
  VALID_GROUP_BY_BUCKETS,
} from './telemetryService';
import { buildPanelViewUrl } from '@components/Pages/Telemetry/grafanaConfig';
import './Telemetry.scss';
import '@components/Pages/Resources/Resources.scss';
import './TelemetryResources.scss';
import './TelemetryRoomDetail.scss';

// ── Helper: flatten all environment sensors with category metadata ───────────
function flattenSensorsWithCategory(environmentSensors) {
  if (!environmentSensors) return [];
  const result = [];
  const categoryMeta = {
    temperature: { label: 'Temperature', emoji: '🌡️' },
    humidity: { label: 'Humidity', emoji: '💧' },
    pressure: { label: 'Pressure', emoji: '🔵' },
    magnetometer: { label: 'Magnetometer', emoji: '🧲' },
    lightIntensity: { label: 'Light Intensity', emoji: '💡' },
    loudness: { label: 'Loudness', emoji: '🔊' },
    helium: { label: 'Helium', emoji: '🧪' },
    power: { label: 'Power', emoji: '⚡' },
    network: { label: 'Network', emoji: '🌐' },
  };
  const order = [
    'temperature',
    'humidity',
    'pressure',
    'magnetometer',
    'lightIntensity',
    'loudness',
    'helium',
    'power',
    'network',
  ];
  for (const key of order) {
    const meta = categoryMeta[key];
    let sensors = [];
    if (key === 'temperature') {
      const t = environmentSensors.temperature || {};
      sensors = [...(t.floor || []), ...(t.wall || []), ...(t.roof || [])];
    } else {
      sensors = environmentSensors[key] || [];
    }
    for (const s of sensors) {
      result.push({ ...s, categoryKey: key, categoryLabel: meta.label, categoryEmoji: meta.emoji });
    }
  }
  return result;
}

function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) return 'Unknown size';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB', 'TB'];
  let value = bytes / 1024;
  let idx = 0;
  while (value >= 1024 && idx < units.length - 1) {
    value /= 1024;
    idx += 1;
  }
  return `${value.toFixed(value < 10 ? 2 : 1)} ${units[idx]}`;
}

// ── Sub-component: RoomResourceCard ─────────────────────────────────────────
const RoomResourceCard = ({ device, darkmode, fs }) => {
  const resource_name_fs = +fs * 1.5;
  const resource_subtitle_fs = +fs * 1.05;
  const resource_text_fs = +fs;

  if (!device) {
    return (
      <div className="room_detail_panel_card" style={{ padding: '20px' }}>
        <p>No device data available.</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      {/* Blurred card */}
      <div
        className="resource_item_wrap"
        style={{
          padding: 0,
          height: '100%',
          filter: 'blur(4px)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <PaneCard className={`resource_item resource_bg_1`} style={{ height: '100%' }}>
          <div className="resource_item_body">
            <div className="d-flex justify-content-between">
              <div className="resource_item_title">
                <h5 className="pane_title resource_title" style={{ fontSize: resource_name_fs }}>
                  &nbsp;
                </h5>
                <div className="short_divider"></div>
              </div>
              <div className="resource_item_logo"></div>
            </div>
            <div className="pane_desc">
              <div className="my-2" style={{ fontSize: resource_text_fs }}>
                &nbsp;
              </div>
            </div>
            <div className="resource_status mb-2">
              <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
                Status:
              </div>
              <div className="status_icon_wrap d-flex justify-content-start">
                <div className="status_icon">
                  <span className="online_icon"></span>
                </div>
                <div className="mx-2" style={{ fontSize: resource_text_fs }}>
                  Online
                </div>
              </div>
            </div>
            <div className="resource_qubit mb-2">
              <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
                Qubits: <b>{device.qubits}</b>
              </div>
            </div>
            <div className="resource_technology mb-2">
              <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
                Quantum Technology:
              </div>
              <div className="resource_value" style={{ fontSize: resource_text_fs }}>
                <i>{device.topology}</i>
              </div>
            </div>
          </div>
        </PaneCard>{' '}
      </div>
      {/* Unblurred label overlaid on top */}
      <div
        style={{
          position: 'absolute',
          top: '16px',
          left: '50%',
          transform: 'translateX(-50%)',
          pointerEvents: 'none',
          zIndex: 2,
        }}
      >
        <span className="room_metadata_coming_soon_badge" style={{ whiteSpace: 'nowrap' }}>
          Quantum Resources coming soon
        </span>
      </div>{' '}
    </div>
  );
};

// ── Sub-component: RoomMaintenanceCalendar ───────────────────────────────────
const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const RoomMaintenanceCalendar = ({ darkmode, events = [] }) => {
  const today = new Date();
  const [displayDate, setDisplayDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const prevMonth = () => setDisplayDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDisplayDate(new Date(year, month + 1, 1));

  const firstDayOfWeek = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const todayDay =
    today.getFullYear() === year && today.getMonth() === month ? today.getDate() : null;

  // Build event overlap map: dayNumber → dot color
  const eventMap = {};
  for (const ev of events) {
    const start = new Date(ev.start_at);
    const end = new Date(ev.end_at);
    const dotColor = ev.type === 'maintenance' ? 'orange' : ev.type === 'offline' ? 'red' : 'green';
    const cursor = new Date(year, month, 1);
    while (cursor <= new Date(year, month, daysInMonth)) {
      if (cursor >= start && cursor <= end) {
        const d = cursor.getDate();
        if (!eventMap[d] || dotColor === 'red') {
          eventMap[d] = { color: dotColor, title: ev.description || ev.type };
        }
      }
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  // Build cells array: leading empty cells + day cells
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({ empty: true, key: `empty-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const evInfo = eventMap[d];
    cells.push({
      empty: false,
      day: d,
      dotColor: evInfo ? evInfo.color : 'green',
      title: evInfo ? evInfo.title : null,
      isToday: d === todayDay,
      key: `day-${d}`,
    });
  }

  const monthName = MONTH_NAMES[month];

  return (
    <div className="room_maintenance_calendar">
      <div className="room_panel_title">Maintenance Schedule</div>

      {/* Legend */}
      <div className="room_calendar_legend">
        {[
          { color: '#22c55e', label: 'Operational' },
          { color: '#f59e0b', label: 'Maintenance' },
          { color: '#ef4444', label: 'Offline' },
        ].map(({ color, label }) => (
          <div key={label} className="room_calendar_legend_item">
            <span
              style={{
                display: 'inline-block',
                width: 10,
                height: 10,
                borderRadius: '50%',
                background: color,
                flexShrink: 0,
              }}
            />
            {label}
          </div>
        ))}
      </div>
      <div className="room_calendar_nav">
        <button className="room_calendar_nav_btn" onClick={prevMonth} aria-label="Previous month">
          ‹
        </button>
        <span className="room_calendar_month_label">
          {monthName} {year}
        </span>
        <button className="room_calendar_nav_btn" onClick={nextMonth} aria-label="Next month">
          ›
        </button>
      </div>
      <div className="room_calendar_weekdays">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
          <span key={d}>{d}</span>
        ))}
      </div>
      <div className="room_calendar_grid">
        {cells.map((cell) =>
          cell.empty ? (
            <div key={cell.key} className="room_calendar_day_cell empty" />
          ) : (
            <div
              key={cell.key}
              className={`room_calendar_day_cell${cell.isToday ? ' today' : ''}`}
              title={cell.title || undefined}
            >
              {cell.day}
              <span className={`room_calendar_dot ${cell.dotColor}`} />
            </div>
          ),
        )}
      </div>
    </div>
  );
};

// ── Sub-component: RoomChipLayoutPlaceholder ─────────────────────────────────
// eslint-disable-next-line no-unused-vars
const RoomChipLayoutPlaceholder = ({ darkmode }) => {
  const stroke = darkmode ? '#4b5563' : '#9ca3af';
  const fill = darkmode ? '#374151' : '#e5e7eb';

  // 3×3 grid positions
  const positions = [
    [40, 40],
    [100, 40],
    [160, 40],
    [40, 80],
    [100, 80],
    [160, 80],
    [40, 120],
    [100, 120],
    [160, 120],
  ];

  // Horizontal and vertical adjacent connections
  const lines = [
    // horizontal
    [0, 1],
    [1, 2],
    [3, 4],
    [4, 5],
    [6, 7],
    [7, 8],
    // vertical
    [0, 3],
    [3, 6],
    [1, 4],
    [4, 7],
    [2, 5],
    [5, 8],
  ];

  return (
    <div className="room_chip_layout_panel">
      <div className="room_panel_title">Chip Layout</div>
      <div className="room_chip_placeholder_body">
        <svg viewBox="0 0 200 160" width={200} height={160} aria-hidden="true">
          {lines.map(([a, b], idx) => {
            const [x1, y1] = positions[a];
            const [x2, y2] = positions[b];
            return (
              <line key={idx} x1={x1} y1={y1} x2={x2} y2={y2} stroke={stroke} strokeWidth={1.5} />
            );
          })}
          {positions.map(([cx, cy], idx) => (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={10}
              fill={fill}
              stroke={stroke}
              strokeWidth={1.5}
            />
          ))}
        </svg>
        <div className="room_chip_placeholder_text">Interactive chip topology — coming soon</div>
      </div>
    </div>
  );
};

// ── Sub-component: RoomMetadataPanel ─────────────────────────────────────────
const RoomMetadataPanel = ({ device, darkmode, compressed }) => {
  const rows = [
    { label: 'Status', value: <span className="room_status_pill">Online</span> },
    { label: 'Qubits', value: device?.qubits ?? '—' },
    { label: 'QPU Version', value: '—' },
    { label: 'Native Gates', value: '—' },
    { label: 'T1 (µs)', value: '—' },
    { label: 'T2 (µs)', value: '—' },
    { label: '2-Q Gate Error', value: '—' },
    { label: 'Measurement Error', value: '—' },
    { label: 'Avg Compilation', value: device?.times?.avg_compilation ?? '—' },
    { label: 'Avg Execution', value: device?.times?.avg_execution ?? '—' },
    { label: 'Uptime', value: device?.times?.uptime ?? '—' },
    { label: 'Pending Jobs', value: '—' },
  ];

  return (
    <div className={`room_metadata_panel ${compressed ? 'room_metadata_compressed' : ''}`}>
      <div className="room_panel_title">Device Metadata</div>
      <table className="room_metadata_table">
        <tbody>
          {rows.map(({ label, value }) => (
            <tr key={label} className="room_metadata_row">
              <td className="room_metadata_label">{label}</td>
              <td className="room_metadata_value">{value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// ── Sub-component: RoomGrafanaSensorWidget ────────────────────────────────────
const RoomGrafanaSensorWidget = ({ environmentSensors, darkmode }) => {
  const [activeSensor, setActiveSensor] = useState(null);
  const [telemetrySensorsState, setTelemetrySensorsState] = useState({
    status: 'idle',
    data: [],
    error: null,
  });
  const [selectedMeasurement, setSelectedMeasurement] = useState('');
  const [selectedMeasurementSensors, setSelectedMeasurementSensors] = useState([]);
  const [groupBy, setGroupBy] = useState('1h');
  const [fromDateTime, setFromDateTime] = useState('');
  const [toDateTime, setToDateTime] = useState('');
  const [queryState, setQueryState] = useState({ status: 'idle', error: null, file: null });
  const [downloadState, setDownloadState] = useState({ status: 'idle', error: null });

  const flattenedSensors = useMemo(
    () => flattenSensorsWithCategory(environmentSensors),
    [environmentSensors],
  );

  useEffect(() => {
    if (flattenedSensors.length > 0) {
      setActiveSensor(flattenedSensors[0]);
    }
  }, [flattenedSensors]);

  useEffect(() => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    setFromDateTime(oneDayAgo.toISOString().slice(0, 16));
    setToDateTime(now.toISOString().slice(0, 16));
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadTelemetrySensors = async () => {
      setTelemetrySensorsState({ status: 'loading', data: [], error: null });
      try {
        const discovered = await getTelemetrySensors();
        if (cancelled) return;
        setTelemetrySensorsState({ status: 'ready', data: discovered, error: null });
      } catch (err) {
        if (cancelled) return;
        setTelemetrySensorsState({
          status: 'error',
          data: [],
          error: err?.message || 'Failed to discover telemetry sensors',
        });
      }
    };

    loadTelemetrySensors();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (telemetrySensorsState.status !== 'ready' || telemetrySensorsState.data.length === 0) {
      setSelectedMeasurement('');
      setSelectedMeasurementSensors([]);
      return;
    }

    const exists = telemetrySensorsState.data.some((m) => m.measurement === selectedMeasurement);
    const fallbackMeasurement = exists
      ? selectedMeasurement
      : telemetrySensorsState.data[0].measurement;
    setSelectedMeasurement(fallbackMeasurement);

    const selected = telemetrySensorsState.data.find((m) => m.measurement === fallbackMeasurement);
    const availableSensors = selected?.sensors || [];
    setSelectedMeasurementSensors((prev) =>
      prev.length ? prev.filter((sensor) => availableSensors.includes(sensor)) : availableSensors,
    );
  }, [telemetrySensorsState, selectedMeasurement]);

  const handleSensorChange = (e) => {
    const found = flattenedSensors.find((s) => s.id === e.target.value);
    if (found) setActiveSensor(found);
  };

  const handleMeasurementChange = (e) => {
    const measurementName = e.target.value;
    setSelectedMeasurement(measurementName);
    const selected = telemetrySensorsState.data.find((m) => m.measurement === measurementName);
    setSelectedMeasurementSensors(selected?.sensors || []);
    setQueryState({ status: 'idle', error: null, file: null });
    setDownloadState({ status: 'idle', error: null });
  };

  const handleMeasurementSensorsChange = (e) => {
    const values = Array.from(e.target.selectedOptions).map((option) => option.value);
    setSelectedMeasurementSensors(values);
    setQueryState({ status: 'idle', error: null, file: null });
    setDownloadState({ status: 'idle', error: null });
  };

  const handleSubmitTelemetryQuery = async () => {
    const fromTimestamp = new Date(fromDateTime).getTime();
    const toTimestamp = new Date(toDateTime).getTime();

    if (!selectedMeasurement) {
      setQueryState({ status: 'error', error: 'Select a measurement.', file: null });
      return;
    }

    if (!selectedMeasurementSensors.length) {
      setQueryState({ status: 'error', error: 'Select at least one sensor.', file: null });
      return;
    }

    if (!Number.isFinite(fromTimestamp) || !Number.isFinite(toTimestamp)) {
      setQueryState({ status: 'error', error: 'Provide a valid date range.', file: null });
      return;
    }

    if (fromTimestamp >= toTimestamp) {
      setQueryState({ status: 'error', error: 'Start time must be before end time.', file: null });
      return;
    }

    setQueryState({ status: 'loading', error: null, file: null });
    setDownloadState({ status: 'idle', error: null });

    try {
      const fileMeta = await requestTelemetryExport(
        [{ measurement: selectedMeasurement, sensors: selectedMeasurementSensors }],
        fromTimestamp,
        toTimestamp,
        groupBy,
      );
      if (!fileMeta.filename && fileMeta.filesize === 0) {
        setQueryState({
          status: 'ready',
          error: null,
          file: fileMeta,
        });
        return;
      }

      setQueryState({ status: 'ready', error: null, file: fileMeta });
    } catch (err) {
      setQueryState({
        status: 'error',
        error: err?.message || 'Telemetry query failed.',
        file: null,
      });
    }
  };

  const handleDownloadTelemetryFile = async () => {
    if (!queryState.file?.filename) return;

    setDownloadState({ status: 'loading', error: null });
    try {
      const blob = await downloadTelemetryExportFile(queryState.file.filename);
      const href = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = href;
      anchor.download = queryState.file.filename;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      URL.revokeObjectURL(href);
      setDownloadState({ status: 'ready', error: null });
    } catch (err) {
      setDownloadState({
        status: 'error',
        error: err?.message || 'Failed to download telemetry file.',
      });
    }
  };

  if (!flattenedSensors.length) {
    return (
      <div className="room_grafana_sensor_widget">
        <div className="room_panel_title">Telemetry Monitoring</div>
        <p>No sensors available for this room.</p>
      </div>
    );
  }

  // Build groupMap for <optgroup> rendering
  const groupMap = {};
  for (const s of flattenedSensors) {
    if (!groupMap[s.categoryKey]) {
      groupMap[s.categoryKey] = { label: s.categoryLabel, emoji: s.categoryEmoji, sensors: [] };
    }
    groupMap[s.categoryKey].sensors.push(s);
  }

  const from = new Date('2026-01-01T00:00:00Z');
  const to = new Date('2026-04-15T23:59:59Z');

  const selectedMeasurementRecord =
    telemetrySensorsState.data.find(
      (measurement) => measurement.measurement === selectedMeasurement,
    ) || null;

  return (
    <div className="room_grafana_sensor_widget">
      <div className="room_panel_title">Telemetry Monitoring</div>
      <div className="room_grafana_controls">
        <label htmlFor="room-sensor-select">Sensor:</label>
        <select
          id="room-sensor-select"
          value={activeSensor?.id || ''}
          onChange={handleSensorChange}
        >
          {Object.entries(groupMap).map(([key, grp]) => (
            <optgroup key={key} label={`${grp.emoji} ${grp.label}`}>
              {grp.sensors.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div className={`telemetry_export_section${darkmode ? ' dark' : ''}`}>
        <div className="telemetry_export_title_row">
          <h4 className="telemetry_export_title">Backend Telemetry Export</h4>
          <button
            type="button"
            className="telemetry_export_refresh_btn"
            onClick={async () => {
              clearTelemetrySensorsCache();
              setTelemetrySensorsState({ status: 'loading', data: [], error: null });
              setQueryState({ status: 'idle', error: null, file: null });
              setDownloadState({ status: 'idle', error: null });
              try {
                const discovered = await getTelemetrySensors();
                setTelemetrySensorsState({ status: 'ready', data: discovered, error: null });
              } catch (err) {
                setTelemetrySensorsState({
                  status: 'error',
                  data: [],
                  error: err?.message || 'Failed to discover telemetry sensors',
                });
              }
            }}
          >
            Refresh sensors
          </button>
        </div>

        {telemetrySensorsState.status === 'loading' && (
          <p className="telemetry_export_info">Loading available measurements and sensors...</p>
        )}

        {telemetrySensorsState.status === 'error' && (
          <p className="telemetry_export_error">{telemetrySensorsState.error}</p>
        )}

        {telemetrySensorsState.status === 'ready' && telemetrySensorsState.data.length > 0 && (
          <>
            <div className="telemetry_export_fields">
              <label htmlFor="telemetry-measurement-select">Measurement</label>
              <select
                id="telemetry-measurement-select"
                value={selectedMeasurement}
                onChange={handleMeasurementChange}
              >
                {telemetrySensorsState.data.map((measurement) => (
                  <option key={measurement.measurement} value={measurement.measurement}>
                    {measurement.measurement}
                  </option>
                ))}
              </select>

              <label htmlFor="telemetry-sensor-select">Sensors</label>
              <select
                id="telemetry-sensor-select"
                multiple
                value={selectedMeasurementSensors}
                onChange={handleMeasurementSensorsChange}
                className="telemetry_export_multiselect"
              >
                {(selectedMeasurementRecord?.sensors || []).map((sensorName) => (
                  <option key={sensorName} value={sensorName}>
                    {sensorName}
                  </option>
                ))}
              </select>

              <label htmlFor="telemetry-from-input">From</label>
              <input
                id="telemetry-from-input"
                type="datetime-local"
                value={fromDateTime}
                onChange={(e) => setFromDateTime(e.target.value)}
              />

              <label htmlFor="telemetry-to-input">To</label>
              <input
                id="telemetry-to-input"
                type="datetime-local"
                value={toDateTime}
                onChange={(e) => setToDateTime(e.target.value)}
              />

              <label htmlFor="telemetry-groupby-select">Group by</label>
              <select
                id="telemetry-groupby-select"
                value={groupBy}
                onChange={(e) => setGroupBy(e.target.value)}
              >
                {VALID_GROUP_BY_BUCKETS.map((bucket) => (
                  <option key={bucket} value={bucket}>
                    {bucket}
                  </option>
                ))}
              </select>
            </div>

            <p className="telemetry_export_info">
              Selected: {selectedMeasurement || 'None'} / {selectedMeasurementSensors.length}{' '}
              sensors
            </p>

            <div className="telemetry_export_actions">
              <button
                type="button"
                className="telemetry_export_action_btn"
                onClick={handleSubmitTelemetryQuery}
                disabled={
                  queryState.status === 'loading' || telemetrySensorsState.status !== 'ready'
                }
              >
                {queryState.status === 'loading' ? 'Preparing export...' : 'Prepare export'}
              </button>

              <button
                type="button"
                className="telemetry_export_action_btn secondary"
                onClick={handleDownloadTelemetryFile}
                disabled={!queryState.file?.filename || downloadState.status === 'loading'}
              >
                {downloadState.status === 'loading' ? 'Downloading...' : 'Download .json.gz'}
              </button>
            </div>

            {queryState.file?.filename && (
              <p className="telemetry_export_success">
                Export ready: {queryState.file.filename} ({formatBytes(queryState.file.filesize)})
              </p>
            )}

            {queryState.file && !queryState.file.filename && queryState.file.filesize === 0 && (
              <p className="telemetry_export_info">
                No telemetry data available for this selection. Try a wider time range or different
                sensors.
              </p>
            )}

            {queryState.status === 'error' && (
              <p className="telemetry_export_error">{queryState.error}</p>
            )}

            {downloadState.status === 'ready' && (
              <p className="telemetry_export_success">Download started successfully.</p>
            )}

            {downloadState.status === 'error' && (
              <p className="telemetry_export_error">{downloadState.error}</p>
            )}
          </>
        )}
      </div>

      {/* GrafanaPanel handles loading skeleton, iframe, and LiveValueFallback automatically. */}
      <GrafanaPanel sensor={activeSensor} from={from} to={to} isDarkMode={darkmode} />
    </div>
  );
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
const RoomDetailSkeleton = ({ darkmode }) => {
  const shimmer = {
    background: darkmode
      ? 'linear-gradient(90deg, #1f2937 25%, #374151 50%, #1f2937 75%)'
      : 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
    backgroundSize: '200% 100%',
    animation: 'shimmer 1.4s infinite',
    borderRadius: '6px',
  };
  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      {/* Room header */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '20px', gap: '12px' }}>
        <div style={{ ...shimmer, width: '32px', height: '32px', borderRadius: '50%' }} />
        <div style={{ ...shimmer, width: '240px', height: '28px' }} />
      </div>
      {/* Device cards */}
      <div style={{ ...shimmer, width: '160px', height: '22px', marginBottom: '16px' }} />
      <div className="resources_list" style={{ marginBottom: '32px' }}>
        {[0, 1, 2].map((i) => (
          <div key={i} className="col-12 col-md-6 col-lg-6 col-xl-4 col-xxl-3 resource_item_wrap">
            <div style={{ ...shimmer, height: '180px', borderRadius: '10px' }} />
          </div>
        ))}
      </div>
      {/* Sensor selector placeholder */}
      <div style={{ ...shimmer, width: '200px', height: '22px', marginBottom: '16px' }} />
      <div style={{ ...shimmer, height: '120px', borderRadius: '10px' }} />
    </ContentCard>
  );
};

const TelemetryRoomDetail = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const fs = useSelector((state) => state.accessibilities.font_size);
  const page_header_fs = +fs * 1.5;
  // resource_name_fs, resource_subtitle_fs, resource_text_fs are used in RoomResourceCard

  const [roomState, setRoomState] = useState({ status: 'loading', data: null, error: null });
  const [selectedSensor, setSelectedSensor] = useState(null);
  const [showGraphModal, setShowGraphModal] = useState(false);

  const loadRoom = useCallback(() => {
    setRoomState({ status: 'loading', data: null, error: null });
    getRoomData(roomId)
      .then((room) => setRoomState({ status: 'ready', data: room, error: null }))
      .catch((err) =>
        setRoomState({ status: 'error', data: null, error: err.message || 'Failed to load room' }),
      );
  }, [roomId]);

  useEffect(() => {
    loadRoom();
  }, [loadRoom]);

  const handleBackClick = () => navigate('/telemetry');

  const closeModal = () => {
    setShowGraphModal(false);
    setSelectedSensor(null);
  };

  if (roomState.status === 'loading') {
    return <RoomDetailSkeleton darkmode={darkmode} />;
  }

  if (roomState.status === 'error') {
    return (
      <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
        <ErrorBlock
          title="Failed to load room details"
          message={roomState.error || 'Room not found'}
        />
        <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
          <button onClick={loadRoom} className="btn btn-primary">
            ↺ Retry
          </button>
          <button onClick={handleBackClick} className="btn btn-secondary">
            ← Back to Telemetry
          </button>
        </div>
      </ContentCard>
    );
  }

  const roomData = roomState.data;

  const modalFrom = new Date('2026-01-01T00:00:00Z');
  const modalTo = new Date('2026-04-15T23:59:59Z');

  // Keep this variable for future Grafana button restore. ESLint: it may be unused while the
  // button is commented out — suppress the unused-vars warning so commits pass linting.
  // eslint-disable-next-line no-unused-vars
  const panelViewUrl =
    showGraphModal && selectedSensor
      ? buildPanelViewUrl(selectedSensor.grafanaPanelRef, modalFrom, modalTo)
      : null;

  return (
    <ContentCard className={`${darkmode ? 'dark_bg' : 'white_bg'}`}>
      {/* Back button */}
      <div style={{ marginBottom: '16px' }}>
        <button
          onClick={handleBackClick}
          className={`inst-detail__back-btn${darkmode ? ' inst-detail__back-btn--dark' : ''}`}
          aria-label="Back to Rooms"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '7px 18px',
            fontSize: '0.875rem',
            fontWeight: 600,
            backgroundColor: '#f8c129',
            border: 'none',
            borderRadius: '8px',
            color: '#000',
            cursor: 'pointer',
            boxShadow: '0 1px 4px rgba(0,0,0,0.12)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#f0b30c';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = '#f8c129';
          }}
        >
          ← Back to Rooms
        </button>
      </div>

      {/* Room header */}
      <div
        className="room-header"
        style={{ display: 'flex', alignItems: 'center', marginBottom: '28px' }}
      >
        <h2 style={{ fontSize: page_header_fs, margin: 0 }}>
          <span className="room-icon" style={{ marginRight: '10px' }}>
            {roomData.icon}
          </span>
          {roomData.name}
        </h2>
      </div>

      {/* ROW 1: Resource Card (full width top) */}
      <div className="room_detail_top_row">
        <div className="room_detail_card_col">
          <RoomResourceCard device={roomData.quantumDevices?.[0]} darkmode={darkmode} fs={fs} />
        </div>
      </div>

      {/* ROW 2: Metadata (left, compressed) | Chip Layout (right) */}
      <div className="room_detail_bottom_row">
        <div className="room_metadata_coming_soon_wrap">
          <RoomMetadataPanel device={roomData.quantumDevices?.[0]} darkmode={darkmode} compressed />
          <div className="room_metadata_coming_soon_overlay">
            <span className="room_metadata_coming_soon_badge">Coming soon</span>
          </div>
        </div>
        <div className="room_metadata_coming_soon_wrap">
          <div className="room_chip_layout_panel">
            <div className="room_panel_title">QPU Topology</div>
            <ChipVisualisation
              couplingData={roomData.quantumDevices?.[0]?.coupling_data}
              darkmode={darkmode}
            />
          </div>
          <div className="room_metadata_coming_soon_overlay">
            <span className="room_metadata_coming_soon_badge">Coming soon</span>
          </div>
        </div>
      </div>

      {/* ROW 3: Maintenance Calendar (30%) | Telemetry Widget (70%) */}
      <div className="room_detail_cal_row">
        <div className="room_metadata_coming_soon_wrap">
          <RoomMaintenanceCalendar darkmode={darkmode} events={[]} />
          <div className="room_metadata_coming_soon_overlay">
            <span className="room_metadata_coming_soon_badge">Coming soon</span>
          </div>
        </div>
        <RoomGrafanaSensorWidget
          environmentSensors={roomData.environmentSensors}
          darkmode={darkmode}
        />
      </div>

      {/* Environment Monitoring removed (SensorSelector + DownloadBar) */}

      {/* Graph modal */}
      {showGraphModal && selectedSensor && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
          onClick={closeModal}
        >
          <div
            style={{
              background: darkmode ? '#111827' : '#ffffff',
              borderRadius: '12px',
              width: '90%',
              maxWidth: '700px',
              maxHeight: '90vh',
              overflow: 'auto',
              boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px 20px',
                borderBottom: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
              }}
            >
              <h3 style={{ margin: 0, color: darkmode ? '#f3f4f6' : '#1f2937' }}>
                📊 {selectedSensor.name} — Live Data
              </h3>
              <button
                onClick={closeModal}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: darkmode ? '#9ca3af' : '#6b7280',
                }}
                aria-label="Close graph"
              >
                ×
              </button>
            </div>

            <GrafanaPanel
              sensor={selectedSensor}
              from={modalFrom}
              to={modalTo}
              isDarkMode={darkmode}
            />

            <div
              style={{
                padding: '16px 20px',
                borderTop: `1px solid ${darkmode ? '#374151' : '#e5e7eb'}`,
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span style={{ fontSize: '12px', color: darkmode ? '#9ca3af' : '#6b7280' }}>
                Last updated: {new Date().toLocaleTimeString()}
              </span>
            </div>
          </div>
        </div>
      )}
    </ContentCard>
  );
};

export default TelemetryRoomDetail;
