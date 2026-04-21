/**
 * ResourceDetailPage.js
 *
 * Full-page detail view for a single quantum resource.
 * Route: /resources/:resourceId
 *
 * Layout:
 *   [Back button]
 *   [Resource Card (static)] | [Maintenance Calendar]
 *   [Chip Layout]            | [Metadata Panel]
 *   [Telemetry Grafana Widget — full width]
 */

import React, { useState } from 'react';
import { useLoaderData, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { getAuthToken } from '@utils/auth';
import { queryClient } from '@utils/query';
import { fetchResources, fetchResourceDetail, fetchMaintenanceEvents } from '@utils/resources-http';
import { buildPanelUrl } from '@components/Pages/Telemetry/grafanaConfig';
import { MOCK_ROOMS } from '@components/Pages/Telemetry/telemetryService';
import {
  getResourceBgClass,
  getResourceLogo,
  getLogoSizeHint,
} from '@utils/vendorConfig';
import ErrorBlock from '@components/UI/MessageBox/ErrorBlock';
import PaneCard from '@components/UI/Card/PaneCard';
import './ResourceDetailPage.scss';

// ---------------------------------------------------------------------------
// Module-level constants
// ---------------------------------------------------------------------------

/** Maps an environmentSensors category key → human-readable label for dropdown */
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

/** Ordered list of sensor categories to display in the dropdown */
const SENSOR_CATEGORY_ORDER = [
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

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Return a human-readable relative time string. */
function relativeTime(isoString) {
  if (!isoString) return '—';
  const diffMs = Date.now() - new Date(isoString).getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 30) return `${diffDays} days ago`;
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffMonths / 12)} year${Math.floor(diffMonths / 12) > 1 ? 's' : ''} ago`;
}

/** Convert a status string to a CSS pill modifier class. */
function statusPillClass(status) {
  if (!status) return '';
  const s = status.toLowerCase();
  if (s === 'online') return 'online';
  if (s === 'offline') return 'offline';
  return 'maintenance';
}

/**
 * Find the room in MOCK_ROOMS that contains a device matching the resource name.
 * Returns the room object or null.
 */
function findRoomForResource(resourceName) {
  const needle = (resourceName || '').trim().toLowerCase();
  for (const room of Object.values(MOCK_ROOMS)) {
    if (
      Array.isArray(room.quantumDevices) &&
      room.quantumDevices.some((d) => (d.name || '').trim().toLowerCase() === needle)
    ) {
      return room;
    }
  }
  return null;
}

/**
 * From the room's environmentSensors, return all sensor category keys that
 * actually have at least one sensor entry.
 */
function getAvailableCategories(environmentSensors) {
  if (!environmentSensors) return [];
  return SENSOR_CATEGORY_ORDER.filter((key) => {
    const val = environmentSensors[key];
    if (!val) return false;
    // temperature is nested: { floor: [...], wall: [...], roof: [...] }
    if (key === 'temperature') {
      return (
        (val.floor && val.floor.length > 0) ||
        (val.wall && val.wall.length > 0) ||
        (val.roof && val.roof.length > 0)
      );
    }
    return Array.isArray(val) && val.length > 0;
  });
}

/**
 * Find the first grafanaPanelRef for the given category in the room's
 * environmentSensors. Returns null if no panel is configured.
 */
function findPanelRefForCategory(environmentSensors, category) {
  if (!environmentSensors) return null;
  const val = environmentSensors[category];
  if (!val) return null;

  let sensors = [];
  if (category === 'temperature') {
    sensors = [
      ...(val.floor || []),
      ...(val.wall || []),
      ...(val.roof || []),
    ];
  } else if (Array.isArray(val)) {
    sensors = val;
  }

  const withPanel = sensors.find((s) => s.grafanaPanelRef != null);
  return withPanel ? withPanel.grafanaPanelRef : null;
}

// ---------------------------------------------------------------------------
// Sub-component: ResourceMaintenanceCalendar
// ---------------------------------------------------------------------------

/**
 * ResourceMaintenanceCalendar — Renders a monthly calendar grid highlighting
 * days with scheduled maintenance events for a resource.
 */
function ResourceMaintenanceCalendar({ resourceName }) {
  const access_token = getAuthToken();
  const today = new Date();

  const [displayDate, setDisplayDate] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  );

  const { data: events, isPending, isError } = useQuery({
    queryKey: ['maintenance-events', resourceName],
    queryFn: ({ signal }) =>
      fetchMaintenanceEvents({ signal, access_token, resourceName }),
    staleTime: 300_000,
  });

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const prevMonth = () => setDisplayDate(new Date(year, month - 1, 1));
  const nextMonth = () => setDisplayDate(new Date(year, month + 1, 1));

  const monthLabel = displayDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Build a Set of day-numbers that have at least one event in the current month
  const eventsByDay = {};
  if (Array.isArray(events)) {
    events.forEach((evt) => {
      const start = new Date(evt.start_at);
      const end = new Date(evt.end_at);
      // Mark every day in the event's range within the current month
      const cursor = new Date(year, month, 1);
      while (cursor <= new Date(year, month + 1, 0)) {
        if (cursor >= new Date(start.getFullYear(), start.getMonth(), start.getDate()) &&
            cursor <= new Date(end.getFullYear(), end.getMonth(), end.getDate())) {
          const day = cursor.getDate();
          if (!eventsByDay[day]) eventsByDay[day] = [];
          eventsByDay[day].push(evt);
        }
        cursor.setDate(cursor.getDate() + 1);
      }
    });
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay(); // 0=Sun
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Build grid cells: empty padding + numbered days
  const cells = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push({ empty: true, key: `e-${i}` });
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, key: `d-${d}` });
  }

  const todayDay =
    today.getFullYear() === year && today.getMonth() === month ? today.getDate() : null;

  return (
    <div className="resource_maintenance_calendar">
      <div className="calendar_title">Maintenance Calendar</div>

      {isPending && <div className="calendar_skeleton" aria-label="Loading calendar" />}

      {isError && (
        <ErrorBlock title="Calendar unavailable" message="Could not load maintenance schedule." />
      )}

      {!isPending && !isError && (
        <>
          <div className="calendar_nav">
            <button
              className="calendar_nav_btn"
              onClick={prevMonth}
              aria-label="Previous month"
            >
              ‹
            </button>
            <span className="calendar_month_label">{monthLabel}</span>
            <button
              className="calendar_nav_btn"
              onClick={nextMonth}
              aria-label="Next month"
            >
              ›
            </button>
          </div>

          <div className="calendar_weekdays" aria-hidden="true">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>

          <div className="calendar_grid" role="grid" aria-label={`Calendar for ${monthLabel}`}>
            {cells.map((cell) => {
              if (cell.empty) {
                return <div key={cell.key} className="calendar_day_cell empty" aria-hidden="true" />;
              }
              const dayEvents = eventsByDay[cell.day] || [];
              const hasEvent = dayEvents.length > 0;
              const isToday = cell.day === todayDay;
              const tooltipText = hasEvent
                ? dayEvents.map((e) => `${e.title}: ${e.description}`).join('\n')
                : undefined;
              const cellDate = new Date(year, month, cell.day).toLocaleDateString('default', {
                weekday: 'short', day: 'numeric', month: 'short',
              });
              return (
                <div
                  key={cell.key}
                  role="gridcell"
                  className={[
                    'calendar_day_cell',
                    isToday ? 'today' : '',
                    hasEvent ? 'has_event' : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  title={tooltipText}
                  aria-label={
                    hasEvent
                      ? `Maintenance on ${cellDate}: ${dayEvents.map((e) => e.title).join(', ')}`
                      : cellDate
                  }
                  tabIndex={hasEvent ? 0 : -1}
                >
                  {cell.day}
                </div>
              );
            })}
          </div>

          {Object.keys(eventsByDay).length === 0 && (
            <p className="calendar_empty_state">No maintenance scheduled this month.</p>
          )}
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: ResourceChipLayout
// ---------------------------------------------------------------------------

/**
 * Generates qubit positions for a linear topology — a row of N circles.
 * Returns an array of { cx, cy } centre coordinates.
 */
function linearPositions(n, svgW, svgH) {
  const positions = [];
  const spacing = svgW / (n + 1);
  const cy = svgH / 2;
  for (let i = 0; i < n; i++) {
    positions.push({ cx: spacing * (i + 1), cy });
  }
  return positions;
}

/**
 * Generates qubit positions for a grid topology — approximately √N × √N.
 */
function gridPositions(n, svgW, svgH) {
  const cols = Math.ceil(Math.sqrt(n));
  const rows = Math.ceil(n / cols);
  const padX = 30;
  const padY = 30;
  const spacingX = (svgW - padX * 2) / Math.max(cols - 1, 1);
  const spacingY = (svgH - padY * 2) / Math.max(rows - 1, 1);
  const positions = [];
  for (let i = 0; i < n; i++) {
    const col = i % cols;
    const row = Math.floor(i / cols);
    positions.push({
      cx: cols === 1 ? svgW / 2 : padX + col * spacingX,
      cy: rows === 1 ? svgH / 2 : padY + row * spacingY,
    });
  }
  return positions;
}

/**
 * Generates qubit positions for an all-to-all topology — N circles on a ring.
 */
function allToAllPositions(n, svgW, svgH) {
  const cx = svgW / 2;
  const cy = svgH / 2;
  const r = Math.min(svgW, svgH) / 2 - 20;
  const positions = [];
  for (let i = 0; i < n; i++) {
    const angle = (2 * Math.PI * i) / n - Math.PI / 2;
    positions.push({ cx: cx + r * Math.cos(angle), cy: cy + r * Math.sin(angle) });
  }
  return positions;
}

/**
 * ResourceChipLayout — Renders a static SVG topology diagram for the resource.
 * Phase 2 (dynamic): see TODO below.
 */
function ResourceChipLayout({ resourceName, connectivity, qubits }) {
  const n = qubits || 5;
  const SVG_W = 300;
  const SVG_H = 200;

  // TODO Phase 2: when REACT_APP_API_ENDPOINT provides GET /resources/:name/chip-layout,
  // replace static SVG with a fetched layout JSON and render dynamically.

  const conn = (connectivity || '').toLowerCase();
  let positions = [];
  let edges = [];

  if (conn === 'linear') {
    positions = linearPositions(n, SVG_W, SVG_H);
    // Connect each qubit to the next
    for (let i = 0; i < positions.length - 1; i++) {
      edges.push([i, i + 1]);
    }
  } else if (conn === 'grid') {
    positions = gridPositions(n, SVG_W, SVG_H);
    const cols = Math.ceil(Math.sqrt(n));
    for (let i = 0; i < n; i++) {
      // Right neighbour
      if ((i + 1) % cols !== 0 && i + 1 < n) edges.push([i, i + 1]);
      // Down neighbour
      if (i + cols < n) edges.push([i, i + cols]);
    }
  } else if (conn === 'all-to-all') {
    positions = allToAllPositions(n, SVG_W, SVG_H);
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        edges.push([i, j]);
      }
    }
  }

  const hasTopology = positions.length > 0;

  return (
    <div className="resource_chip_layout_panel">
      <div className="chip_layout_title">Chip Topology</div>
      {hasTopology ? (
        <svg
          viewBox={`0 0 ${SVG_W} ${SVG_H}`}
          width={SVG_W}
          height={SVG_H}
          role="img"
          aria-label={`Chip topology for ${resourceName}`}
        >
          {/* Edges */}
          {edges.map(([a, b], idx) => (
            <line
              key={`edge-${idx}`}
              x1={positions[a].cx}
              y1={positions[a].cy}
              x2={positions[b].cx}
              y2={positions[b].cy}
              stroke="#9ca3af"
              strokeWidth={1.5}
            />
          ))}
          {/* Qubit circles */}
          {positions.map((pos, idx) => (
            <circle
              key={`q-${idx}`}
              cx={pos.cx}
              cy={pos.cy}
              r={10}
              fill="#6cacde"
              stroke="white"
              strokeWidth={1.5}
            />
          ))}
        </svg>
      ) : (
        <p className="chip_placeholder">Topology diagram coming soon.</p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: ResourceMetadataPanel
// ---------------------------------------------------------------------------

/**
 * ResourceMetadataPanel — Renders a key-value table of live resource metadata.
 * Reuses the same React Query cache entry as the card flip back face.
 */
function ResourceMetadataPanel({ resourceName }) {
  const access_token = getAuthToken();

  const { data, isPending, isError } = useQuery({
    queryKey: ['resource-detail', resourceName],
    queryFn: ({ signal }) => fetchResourceDetail({ signal, access_token, resourceName }),
    staleTime: 60_000,
  });

  const rows = [
    { label: 'Status', render: (d) => (
      <span className={`status_pill ${statusPillClass(d.status)}`}>{d.status || '—'}</span>
    )},
    { label: 'QPU Version', render: (d) => d.qpu_version || '—' },
    { label: 'Fabrication Round', render: (d) => d.fabrication_round || '—' },
    { label: 'Pending Jobs', render: (d) => d.pending_jobs ?? '—' },
    { label: 'T1 (µs)', render: (d) => d.t1_us ?? '—' },
    { label: 'T2 (µs)', render: (d) => d.t2_us ?? '—' },
    { label: 'Last Calibrated', render: (d) => relativeTime(d.last_calibrated_at) },
    { label: 'Qubits', render: (d) => d.qubits ?? '—' },
  ];

  return (
    <div className="resource_metadata_panel">
      <div className="metadata_panel_title">Resource Metadata</div>

      {isPending && (
        <div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="metadata_skeleton_row" />
          ))}
        </div>
      )}

      {isError && (
        <ErrorBlock title="Metadata unavailable" message="Could not load resource metadata." />
      )}

      {!isPending && !isError && data && (
        <table>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="metadata_row">
                <td className="metadata_label">{row.label}</td>
                <td className="metadata_value">{row.render(data)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: ResourceTelemetryWidget
// ---------------------------------------------------------------------------

/**
 * ResourceTelemetryWidget — Embeds a Grafana panel iframe for the selected
 * sensor category, cross-referenced via MOCK_ROOMS.
 */
function ResourceTelemetryWidget({ resourceName, isDarkMode }) {
  const room = findRoomForResource(resourceName);
  const categories = room ? getAvailableCategories(room.environmentSensors) : [];

  const [selectedCategory, setSelectedCategory] = useState(categories[0] || '');
  const [iframeLoading, setIframeLoading] = useState(true);

  // Reset iframe loading state whenever the category changes
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
    setIframeLoading(true);
  };

  const panelRef = room && selectedCategory
    ? findPanelRefForCategory(room.environmentSensors, selectedCategory)
    : null;

  const grafanaUrl = panelRef
    ? buildPanelUrl(
        panelRef,
        new Date(Date.now() - 6 * 3600 * 1000),
        new Date(),
        isDarkMode ? 'dark' : 'light',
      )
    : null;

  if (!room) {
    return (
      <div className="resource_telemetry_widget">
        <div className="telemetry_widget_title">Telemetry</div>
        <div className="telemetry_not_linked">
          Telemetry data not yet linked to this resource.
        </div>
      </div>
    );
  }

  return (
    <div className="resource_telemetry_widget">
      <div className="telemetry_widget_title">Telemetry</div>

      <div className="telemetry_widget_controls">
        <label htmlFor={`telemetry-group-${resourceName}`}>Telemetry Group:</label>
        <select
          id={`telemetry-group-${resourceName}`}
          value={selectedCategory}
          onChange={handleCategoryChange}
          aria-label="Select telemetry sensor group"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {TELEMETRY_CATEGORY_LABELS[cat] || cat}
            </option>
          ))}
        </select>
      </div>

      {grafanaUrl ? (
        <div className="grafana_iframe_wrapper">
          {iframeLoading && (
            <div className="grafana_skeleton" aria-label="Loading Grafana panel" />
          )}
          <iframe
            src={grafanaUrl}
            title={`Telemetry panel: ${TELEMETRY_CATEGORY_LABELS[selectedCategory] || selectedCategory}`}
            onLoad={() => setIframeLoading(false)}
            style={{ display: iframeLoading ? 'none' : 'block' }}
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      ) : (
        <div className="no_panel_notice">
          No Grafana panel configured for{' '}
          <strong>{TELEMETRY_CATEGORY_LABELS[selectedCategory] || selectedCategory}</strong>.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Sub-component: StaticResourceCard (front face only, no flip)
// ---------------------------------------------------------------------------

/**
 * StaticResourceCard — Renders the front face of a resource card without
 * any flip interaction. Used in the detail page top-left column.
 */
function StaticResourceCard({ resource, fontSize }) {
  const resource_name_fs = +fontSize * 1.5;
  const resource_subtitle_fs = +fontSize * 1.05;
  const resource_text_fs = +fontSize;

  const resource_logo_src = getResourceLogo(resource.name) || '';
  const resource_bg = getResourceBgClass(resource.name);
  const logoSizeHint = getLogoSizeHint(resource.name);
  const resource_name_lower = (resource.name || '').trim().toLowerCase();

  return (
    <div className="resource_item_wrap" style={{ padding: 0 }}>
      <PaneCard className={`resource_item ${resource_bg}`}>
        <div className="resource_item_body">
          <div className="d-flex justify-content-between">
            <div className="resource_item_title">
              <h5 className="pane_title resource_title" style={{ fontSize: resource_name_fs }}>
                {resource.name}
                {resource_name_lower === 'eqe1' && (
                  <span className="beta_badge">BETA</span>
                )}
              </h5>
              <div className="short_divider"></div>
            </div>
            {resource_logo_src && (
              <div className="resource_item_logo">
                <div className="resource_log_wrap">
                  <img
                    src={resource_logo_src}
                    alt={resource.name}
                    style={logoSizeHint.height ? { height: logoSizeHint.height } : {}}
                  />
                </div>
              </div>
            )}
          </div>

          {resource.note && (
            <div className="pane_desc">
              <div className="my-2" style={{ fontSize: resource_text_fs }}>
                {resource.note}
              </div>
            </div>
          )}

          <div className="resource_status mb-2">
            <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
              Status:
            </div>
            {resource.status ? (
              <div className="status_icon_wrap d-flex justify-content-start">
                <div className="status_icon"><span className="offline_icon"></span></div>
                <div className="mx-2" style={{ fontSize: resource_text_fs }}>Offline</div>
              </div>
            ) : (
              <div className="status_icon_wrap d-flex justify-content-start">
                <div className="status_icon"><span className="online_icon"></span></div>
                <div className="mx-2" style={{ fontSize: resource_text_fs }}>Online</div>
              </div>
            )}
          </div>

          <div className="resource_qubit mb-2">
            <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
              Qubits: <b>{resource.qubits}</b>
            </div>
          </div>

          <div className="resource_technology mb-2">
            <div className="pane_subtitle" style={{ fontSize: resource_subtitle_fs }}>
              Quantum Technology:
            </div>
            <div className="resource_value" style={{ fontSize: resource_text_fs }}>
              <i>{resource.quantum_technology}</i>
            </div>
          </div>
        </div>
      </PaneCard>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component: ResourceDetailPage
// ---------------------------------------------------------------------------

/**
 * ResourceDetailPage — Full detail view for a single quantum resource.
 * Data comes from the React Router loader for the static resource object;
 * live metadata, maintenance events, and Grafana panels are fetched in parallel
 * by independent sub-components so a failure in one section is isolated.
 */
function ResourceDetailPage() {
  const { resource } = useLoaderData();
  const navigate = useNavigate();

  const fs = useSelector((state) => state.accessibilities.font_size);
  const darkmode = useSelector((state) => state.accessibilities.darkmode);
  const darkmode_class = darkmode ? 'dark_bg' : 'white_bg';

  return (
    <div className={`resource_detail_page ${darkmode_class}`}>
      {/* Section 0 — Back navigation */}
      <button
        className="resource_detail_back_btn"
        onClick={() => navigate(-1)}
        aria-label="Back to resources list"
      >
        ← Back to Resources
      </button>

      {/* Section 1 + 2 — Top row: static card & maintenance calendar */}
      <div className="resource_detail_layout">
        <div className="resource_detail_card_col">
          <StaticResourceCard resource={resource} fontSize={fs} />
        </div>

        <div className="resource_detail_calendar_col">
          <ResourceMaintenanceCalendar resourceName={resource.name} />
        </div>
      </div>

      {/* Section 3 + 4 — Bottom row: chip layout & metadata */}
      <div className="resource_detail_bottom_row">
        <ResourceChipLayout
          resourceName={resource.name}
          connectivity={resource.connectivity}
          qubits={resource.qubits}
        />
        <ResourceMetadataPanel resourceName={resource.name} />
      </div>

      {/* Section 5 — Telemetry Grafana widget */}
      <ResourceTelemetryWidget resourceName={resource.name} isDarkMode={darkmode} />
    </div>
  );
}

export default ResourceDetailPage;

// ---------------------------------------------------------------------------
// React Router loader
// ---------------------------------------------------------------------------

/**
 * loader — Prefetches the resource list and resolves the matching resource
 * object by name. Throws a 404 Response if not found.
 *
 * @param {{ params: { resourceId: string } }} loaderArgs
 * @returns {Promise<{ resource: Object }>}
 */
export async function loader({ params }) {
  const access_token = getAuthToken();
  const resourceId = decodeURIComponent(params.resourceId || '');

  // Reuse the cached resources list (staleTime 5 min, same as Resources.js)
  let resourcesData;
  try {
    resourcesData = await queryClient.fetchQuery({
      queryKey: ['resources'],
      queryFn: ({ signal }) => fetchResources({ signal, access_token }),
      staleTime: 5 * 60_000,
    });
  } catch {
    throw new Response('Could not load resources', { status: 502 });
  }

  // Flatten all status buckets into one list to search by name
  const allResources = [
    ...(resourcesData?.online || []),
    ...(resourcesData?.offline || []),
    ...(resourcesData?.maintenance || []),
    // Also support a flat array response shape
    ...(Array.isArray(resourcesData) ? resourcesData : []),
  ];

  const resource = allResources.find(
    (r) => (r.name || '').trim().toLowerCase() === resourceId.trim().toLowerCase(),
  );

  if (!resource) {
    throw new Response('Resource not found', { status: 404 });
  }

  return { resource };
}
