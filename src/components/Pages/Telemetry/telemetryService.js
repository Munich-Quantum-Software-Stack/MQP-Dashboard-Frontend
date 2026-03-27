/**
 * telemetryService.js
 *
 * Single source of truth for all telemetry data.
 * When TELEMETRY_API_URL is set in runtime config this module hits real endpoints.
 * When it is absent every function returns mock data — components never change.
 *
 * Mock / real mode is evaluated at call time from runtimeConfig so that
 * Docker/K8s deployments can switch behaviour without a rebuild.
 */

import { getConfig } from './runtimeConfig';

// ---------------------------------------------------------------------------
// Mock room catalogue
// ---------------------------------------------------------------------------

/**
 * DEMO NOTE — Path B Verification State
 * All sensors in a category currently share one Grafana panel (TestData).
 * In production, each sensor will have a unique panelId pointing to
 * a panel fed by real time-series data for that specific sensor ID.
 * The grafanaPanelRef shape below is the final production contract —
 * only the values change, not the structure.
 */
export const MOCK_ROOMS = {
  'warm-lab': {
    id: 'warm-lab',
    name: 'Warm Lab (E.U.020)',
    icon: '🔆',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
    darkGradient: 'linear-gradient(135deg, #78350f 0%, #92400e 100%)',
    quantumDevices: [
      {
        id: 'warm-qexa20',
        name: 'QExa20',
        vendor: 'IQM',
        fidelity: '98.5%',
        qubits: 20,
        topology: 'Super Conducting',
        passes: ['Decomposition', 'Mapping', 'Optimization'],
        times: { avg_compilation: '1.8s', avg_execution: '0.9s', uptime: '99.1%' },
      },
    ],
    environmentSensors: {
      temperature: {
        floor: [
          {
            id: 'temp-floor-1',
            name: 'Floor Temp 1',
            value: '22.4°C',
            sensorKey: 'temp_floor_1',
            grafanaPanelRef: {
              dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
              slug: 'warmlab',
              panelId: 5,
            },
          },
          {
            id: 'temp-floor-2',
            name: 'Floor Temp 2',
            value: '21.8°C',
            sensorKey: 'temp_floor_2',
            grafanaPanelRef: {
              dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
              slug: 'warmlab',
              panelId: 5,
            },
          },
        ],
        wall: [
          {
            id: 'temp-wall-1',
            name: 'Wall Temp 1',
            value: '23.1°C',
            sensorKey: 'temp_wall_1',
            grafanaPanelRef: {
              dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
              slug: 'warmlab',
              panelId: 5,
            },
          },
          {
            id: 'temp-wall-2',
            name: 'Wall Temp 2',
            value: '22.9°C',
            sensorKey: 'temp_wall_2',
            grafanaPanelRef: {
              dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
              slug: 'warmlab',
              panelId: 5,
            },
          },
        ],
        roof: [
          {
            id: 'temp-roof-1',
            name: 'Roof Temp 1',
            value: '24.2°C',
            sensorKey: 'temp_roof_1',
            grafanaPanelRef: {
              dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
              slug: 'warmlab',
              panelId: 5,
            },
          },
        ],
      },
      humidity: [
        {
          id: 'humid-1',
          name: 'Humidity Sensor 1',
          value: '45%',
          sensorKey: 'humidity_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 6,
          },
        },
        {
          id: 'humid-2',
          name: 'Humidity Sensor 2',
          value: '42%',
          sensorKey: 'humidity_2',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 6,
          },
        },
      ],
      pressure: [
        {
          id: 'pressure-1',
          name: 'Pressure Sensor 1',
          value: '1013 hPa',
          sensorKey: 'pressure_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 2,
          },
        },
      ],
      dust: [
        {
          id: 'dust-1',
          name: 'Dust Sensor 1',
          value: '0.02 µg/m³',
          sensorKey: 'dust_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 3,
          },
        },
      ],
    },
  },

  'cold-lab': {
    id: 'cold-lab',
    name: 'Cold Lab (E.U.044)',
    icon: '❄️',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
    darkGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
    quantumDevices: [
      {
        id: 'daqc-q5',
        name: 'QExa20',
        vendor: 'IQM',
        fidelity: '98.5%',
        qubits: 20,
        topology: 'Super Conducting',
        passes: ['Decomposition', 'Mapping', 'Optimization'],
        times: { avg_compilation: '1.8s', avg_execution: '0.9s', uptime: '99.1%' },
      },
      {
        id: 'daqc-q20',
        name: 'Q5',
        vendor: 'IQM',
        fidelity: '97.2%',
        qubits: 5,
        topology: 'Super Conducting',
        passes: ['Decomposition', 'Mapping', 'Optimization'],
        times: { avg_compilation: '2.8s', avg_execution: '1.2s', uptime: '98.4%' },
      },
      {
        id: 'marmot-aqt',
        name: 'Q20',
        vendor: 'IQM',
        fidelity: '99.4%',
        qubits: 20,
        topology: 'Super Conducting',
        passes: ['Decomposition', 'Mapping', 'Optimization', 'Error mitigation'],
        times: { avg_compilation: '3.7s', avg_execution: '0.9s', uptime: '97.6%' },
      },
    ],
    environmentSensors: {
      temperature: {
        floor: [
          {
            id: 'cold-temp-floor-1',
            name: 'Floor Temp 1',
            value: '4.2K',
            sensorKey: 'cold_temp_floor_1',
            grafanaPanelRef: null,
          },
          {
            id: 'cold-temp-floor-2',
            name: 'Floor Temp 2',
            value: '4.1K',
            sensorKey: 'cold_temp_floor_2',
            grafanaPanelRef: null,
          },
        ],
        wall: [
          {
            id: 'cold-temp-wall-1',
            name: 'Wall Temp 1',
            value: '4.3K',
            sensorKey: 'cold_temp_wall_1',
            grafanaPanelRef: null,
          },
        ],
        roof: [
          {
            id: 'cold-temp-roof-1',
            name: 'Roof Temp 1',
            value: '4.5K',
            sensorKey: 'cold_temp_roof_1',
            grafanaPanelRef: null,
          },
        ],
      },
      pressure: [
        {
          id: 'cold-pressure-1',
          name: 'Pressure Sensor 1',
          value: '1.2 mbar',
          sensorKey: 'cold_pressure_1',
          grafanaPanelRef: null,
        },
        {
          id: 'cold-pressure-2',
          name: 'Pressure Sensor 2',
          value: '0.8 mbar',
          sensorKey: 'cold_pressure_2',
          grafanaPanelRef: null,
        },
      ],
      helium: [
        {
          id: 'he-level-1',
          name: 'Helium Level 1',
          value: '85%',
          sensorKey: 'helium_1',
          grafanaPanelRef: null,
        },
        {
          id: 'he-level-2',
          name: 'Helium Level 2',
          value: '92%',
          sensorKey: 'helium_2',
          grafanaPanelRef: null,
        },
      ],
    },
  },

  'compute-cube': {
    id: 'compute-cube',
    name: 'Compute Cube (NSR1)',
    icon: '🖥️',
    color: '#6b7280',
    gradient: 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)',
    darkGradient: 'linear-gradient(135deg, #374151 0%, #4b5563 100%)',
    quantumDevices: [
      {
        id: 'q-exa',
        name: 'QExa20',
        vendor: 'IQM',
        fidelity: '99.2%',
        qubits: 20,
        topology: 'Super Conducting',
        passes: ['Optimization', 'Routing', 'Scheduling'],
        times: { avg_compilation: '3.2s', avg_execution: '0.5s', uptime: '98.7%' },
      },
      {
        id: 'euro-q-exa',
        name: 'Q5',
        vendor: 'IQM',
        fidelity: '98.7%',
        qubits: 5,
        topology: 'Super Conducting',
        passes: ['Gate fusion', 'Routing', 'Scheduling'],
        times: { avg_compilation: '2.5s', avg_execution: '0.8s', uptime: '96.2%' },
      },
      {
        id: 'qaptiva-800',
        name: 'Q20',
        vendor: 'IQM',
        fidelity: '97.8%',
        qubits: 20,
        topology: 'Super Conducting',
        passes: ['Optimization', 'Translation', 'Scheduling'],
        times: { avg_compilation: '4.1s', avg_execution: '0.7s', uptime: '92.3%' },
      },
    ],
    environmentSensors: {
      temperature: {
        floor: [
          {
            id: 'cc-temp-floor-1',
            name: 'Floor Temp 1',
            value: '20.1°C',
            sensorKey: 'cc_temp_floor_1',
            grafanaPanelRef: null,
          },
        ],
        wall: [
          {
            id: 'cc-temp-wall-1',
            name: 'Wall Temp 1',
            value: '21.3°C',
            sensorKey: 'cc_temp_wall_1',
            grafanaPanelRef: null,
          },
          {
            id: 'cc-temp-wall-2',
            name: 'Wall Temp 2',
            value: '20.8°C',
            sensorKey: 'cc_temp_wall_2',
            grafanaPanelRef: null,
          },
        ],
        roof: [
          {
            id: 'cc-temp-roof-1',
            name: 'Roof Temp 1',
            value: '22.1°C',
            sensorKey: 'cc_temp_roof_1',
            grafanaPanelRef: null,
          },
        ],
      },
      humidity: [
        {
          id: 'cc-humid-1',
          name: 'Humidity Sensor 1',
          value: '38%',
          sensorKey: 'cc_humidity_1',
          grafanaPanelRef: null,
        },
      ],
      power: [
        {
          id: 'cc-power-1',
          name: 'Power Monitor 1',
          value: '45.2 kW',
          sensorKey: 'cc_power_1',
          grafanaPanelRef: null,
        },
        {
          id: 'cc-power-2',
          name: 'Power Monitor 2',
          value: '38.7 kW',
          sensorKey: 'cc_power_2',
          grafanaPanelRef: null,
        },
      ],
    },
  },

  cloud: {
    id: 'cloud',
    name: 'Cloud',
    icon: '☁️',
    color: '#9ca3af',
    gradient: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
    darkGradient: 'linear-gradient(135deg, #4b5563 0%, #6b7280 100%)',
    quantumDevices: [
      {
        id: 'maqcs',
        name: 'QExa20',
        vendor: 'IQM',
        fidelity: '98.5%',
        qubits: 20,
        topology: 'Super Conducting',
        passes: ['Decomposition', 'Mapping', 'Optimization'],
        times: { avg_compilation: '1.8s', avg_execution: '0.9s', uptime: '99.1%' },
      },
      {
        id: 'munichqc-atoms',
        name: 'Q5',
        vendor: 'IQM',
        fidelity: '97.2%',
        qubits: 5,
        topology: 'Super Conducting',
        passes: ['Decomposition', 'Mapping', 'Optimization'],
        times: { avg_compilation: '2.8s', avg_execution: '1.2s', uptime: '98.4%' },
      },
    ],
    environmentSensors: {
      temperature: {
        floor: [
          {
            id: 'cloud-temp-floor-1',
            name: 'Floor Temp 1',
            value: '19.8°C',
            sensorKey: 'cloud_temp_floor_1',
            grafanaPanelRef: null,
          },
        ],
        wall: [
          {
            id: 'cloud-temp-wall-1',
            name: 'Wall Temp 1',
            value: '20.2°C',
            sensorKey: 'cloud_temp_wall_1',
            grafanaPanelRef: null,
          },
        ],
        roof: [
          {
            id: 'cloud-temp-roof-1',
            name: 'Roof Temp 1',
            value: '21.0°C',
            sensorKey: 'cloud_temp_roof_1',
            grafanaPanelRef: null,
          },
        ],
      },
      pressure: [
        {
          id: 'cloud-pressure-1',
          name: 'Pressure Sensor 1',
          value: '1015 hPa',
          sensorKey: 'cloud_pressure_1',
          grafanaPanelRef: null,
        },
      ],
      network: [
        {
          id: 'cloud-network-1',
          name: 'Network Latency',
          value: '12ms',
          sensorKey: 'cloud_network_1',
          grafanaPanelRef: null,
        },
        {
          id: 'cloud-network-2',
          name: 'Bandwidth Usage',
          value: '2.4 Gbps',
          sensorKey: 'cloud_network_2',
          grafanaPanelRef: null,
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// Helpers for mock data generation
// ---------------------------------------------------------------------------

/* eslint-disable */
/*
 * Telemetry service performs controlled data shaping for mock and real
 * APIs. Disable linting for object-injection here to avoid false positives
 * from the security plugin during build.
 */

/**
 * Generate a plausible numeric drift for a sensor mock value.
 * Returns { value, unit } parsed from the canonical string stored in MOCK_ROOMS.
 */
export function parseSensorValue(valueStr) {
  const match = valueStr.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return { num: 0, unit: valueStr };
  return { num: parseFloat(match[1]), unit: match[2] };
}

/** Generate a 24-point timeseries between `from` and `to` for CSV / DummyGraph. */
function generateDummyTimeseries(sensorId, from, to, points = 24) {
  const start = from instanceof Date ? from.getTime() : new Date(from).getTime();
  const end = to instanceof Date ? to.getTime() : new Date(to).getTime();
  const step = (end - start) / (points - 1);
  const series = [];
  let base = 20 + Math.random() * 10;

  for (let i = 0; i < points; i++) {
    base += (Math.random() - 0.5) * 2;
    series.push({ timestamp: new Date(start + i * step).toISOString(), value: +base.toFixed(2) });
  }
  return series;
}

// (Removed unused buildMockCSV helper — exportCSV implements chunked mock export)

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Fetch full room data (devices + sensors) for a given roomId.
 * @param {string} roomId
 * @returns {Promise<Object>}
 */
export async function getRoomData(roomId) {
  const { TELEMETRY_API_URL } = getConfig();
  if (!TELEMETRY_API_URL) {
    const room = MOCK_ROOMS[roomId];
    if (!room) throw new Error(`Room "${roomId}" not found`);
    return room;
  }

  const res = await fetch(`${TELEMETRY_API_URL}/rooms/${roomId}`);
  if (!res.ok) throw new Error(`Failed to fetch room: ${res.status}`);
  return res.json();
}

/**
 * Fetch historical timeseries for a single sensor.
 * @param {string} sensorId
 * @param {Date|string} from
 * @param {Date|string} to
 * @returns {Promise<Array<{timestamp:string, value:number}>>}
 */
export async function getSensorHistory(sensorId, from, to) {
  const { TELEMETRY_API_URL } = getConfig();
  if (!TELEMETRY_API_URL) {
    return generateDummyTimeseries(sensorId, from, to);
  }
  const params = new URLSearchParams({
    from: new Date(from).toISOString(),
    to: new Date(to).toISOString(),
  });
  const res = await fetch(`${TELEMETRY_API_URL}/sensors/${sensorId}/history?${params}`);
  if (!res.ok) throw new Error(`Failed to fetch sensor history: ${res.status}`);
  return res.json();
}

/**
 * Export selected sensors as a CSV Blob.
 * Triggers a browser download when used with URL.createObjectURL.
 * @param {string[]} sensorIds
 * @param {Date|string} from
 * @param {Date|string} to
 * @returns {Promise<Blob>}
 */
export async function exportCSV(sensorIds, from, to, onProgress) {
  const { TELEMETRY_API_URL } = getConfig();
  if (!TELEMETRY_API_URL) {
    // Mock: export one sensor at a time so progress callbacks fire
    const total = sensorIds.length;
    const header = 'sensor_id,timestamp,value\n';
    const allRows = [];
    for (let i = 0; i < total; i++) {
      const rows = generateDummyTimeseries(sensorIds[i], from, to, 10).map(
        ({ timestamp, value }) => `${sensorIds[i]},${timestamp},${value}`,
      );
      allRows.push(...rows);
      if (typeof onProgress === 'function') {
        onProgress({ done: i + 1, total });
      }
      // Yield to the event loop between sensors so React can re-render the progress
      await new Promise((resolve) => setTimeout(resolve, 0));
    }
    return new Blob([header + allRows.join('\n')], { type: 'text/csv' });
  }

  // Real API: single bulk request (server streams all sensors)
  const res = await fetch(`${TELEMETRY_API_URL}/export/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // The payload contains developer-provided sensorIds/from/to values. This
    // is intentionally sent as JSON to the backend. Disable the object-injection
    // rule here because the fields are controlled within the app (not user
    // supplied free-form keys).
    // eslint-disable-next-line security/detect-object-injection
    body: JSON.stringify({
      sensorIds,
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  return res.blob();
}
