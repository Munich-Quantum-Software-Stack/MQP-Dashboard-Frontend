import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ContentCard from '@components/UI/Card/ContentCard';
import PaneCard from '@components/UI/Card/PaneCard';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import IQM_logo from '@assets/images/IQM_logo.png';
import GrafanaPanel from './components/GrafanaPanel';
import ChipVisualisation from '@components/Shared/ChipVisualisation/ChipVisualisation';
import { getRoomData } from './telemetryService';
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
    <div className="resource_item_wrap" style={{ padding: 0, height: '100%' }}>
      <PaneCard className={`resource_item resource_bg_1`} style={{ height: '100%' }}>
        <div className="resource_item_body">
          <div className="d-flex justify-content-between">
            <div className="resource_item_title">
              <h5 className="pane_title resource_title" style={{ fontSize: resource_name_fs }}>
                {device.name}
              </h5>
              <div className="short_divider"></div>
            </div>
            <div className="resource_item_logo">
              <div className="resource_log_wrap">
                <img src={IQM_logo} alt={device.vendor} />
              </div>
            </div>
          </div>
          <div className="pane_desc">
            <div className="my-2" style={{ fontSize: resource_text_fs }}>
              {device.vendor} {device.name}
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
      </PaneCard>
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

  const flattenedSensors = useMemo(
    () => flattenSensorsWithCategory(environmentSensors),
    [environmentSensors],
  );

  useEffect(() => {
    if (flattenedSensors.length > 0) {
      setActiveSensor(flattenedSensors[0]);
    }
  }, [flattenedSensors]);

  const handleSensorChange = (e) => {
    const found = flattenedSensors.find((s) => s.id === e.target.value);
    if (found) setActiveSensor(found);
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
        <div className="room_chip_layout_panel">
          <div className="room_panel_title">QPU Topology</div>
          <ChipVisualisation
            couplingData={roomData.quantumDevices?.[0]?.coupling_data}
            darkmode={darkmode}
          />
        </div>
      </div>

      {/* ROW 3: Maintenance Calendar (30%) | Telemetry Widget (70%) */}
      <div className="room_detail_cal_row">
        <RoomMaintenanceCalendar darkmode={darkmode} events={[]} />
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
              {/*
              <button
                className={`btn-open-grafana${!panelViewUrl ? ' btn-disabled' : ''}`}
                disabled={!panelViewUrl}
                title={
                  panelViewUrl
                    ? `Open ${selectedSensor?.name} panel in Grafana`
                    : 'No Grafana panel configured for this sensor'
                }
                onClick={() => {
                  if (panelViewUrl) {
                    window.open(panelViewUrl, '_blank', 'noopener,noreferrer');
                  }
                }}
                style={{
                  padding: '8px 16px',
                  borderRadius: '6px',
                  background: panelViewUrl ? '#3b82f6' : '#9ca3af',
                  color: '#ffffff',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: panelViewUrl ? 'pointer' : 'not-allowed',
                  opacity: panelViewUrl ? 1 : 0.6,
                }}
              >
                Open in Grafana ↗
              </button>
              */}
            </div>
          </div>
        </div>
      )}
    </ContentCard>
  );
};

export default TelemetryRoomDetail;
