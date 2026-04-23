import { getConfig } from './runtimeConfig';

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
        resourceNames: ['qexa20'],
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
            id: 'temp-1',
            name: 'Temp 1',
            value: '22.4°C',
            sensorKey: 'temp_1',
            grafanaPanelRef: {
              dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
              slug: 'warmlab',
              panelId: 5,
            },
          },
        ],
        wall: [],
        roof: [],
      },
      humidity: [
        {
          id: 'humid-1',
          name: 'Humidity 1',
          value: '45%',
          sensorKey: 'humidity_1',
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
          name: 'Pressure 1',
          value: '1013 hPa',
          sensorKey: 'pressure_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 2,
          },
        },
      ],
      magnetometer: [
        {
          id: 'magnetometer-1',
          name: 'Magnetometer 1',
          value: '48 µT',
          sensorKey: 'magnetometer_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 1,
          },
        },
      ],
      lightIntensity: [
        {
          id: 'light-1',
          name: 'Light Intensity 1',
          value: '320 lux',
          sensorKey: 'light_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 3,
          },
        },
      ],
      loudness: [
        {
          id: 'loudness-1',
          name: 'Loudness 1',
          value: '42 dB',
          sensorKey: 'loudness_1',
          grafanaPanelRef: {
            dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
            slug: 'warmlab',
            panelId: 4,
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
        resourceNames: ['q5'],
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
        resourceNames: ['q20'],
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
        resourceNames: ['aqt20'],
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
            id: 'cold-temp-1',
            name: 'Temp 1',
            value: '4.2K',
            sensorKey: 'cold_temp_1',
            grafanaPanelRef: null,
          },
        ],
        wall: [],
        roof: [],
      },
      pressure: [
        {
          id: 'cold-pressure-1',
          name: 'Pressure 1',
          value: '1.2 mbar',
          sensorKey: 'cold_pressure_1',
          grafanaPanelRef: null,
        },
      ],
      helium: [
        {
          id: 'he-level-1',
          name: 'Helium 1',
          value: '85%',
          sensorKey: 'helium_1',
          grafanaPanelRef: null,
        },
      ],
      magnetometer: [
        {
          id: 'cold-magnetometer-1',
          name: 'Magnetometer 1',
          value: '48 µT',
          sensorKey: 'cold_magnetometer_1',
          grafanaPanelRef: null,
        },
      ],
      lightIntensity: [
        {
          id: 'cold-light-1',
          name: 'Light Intensity 1',
          value: '320 lux',
          sensorKey: 'cold_light_1',
          grafanaPanelRef: null,
        },
      ],
      loudness: [
        {
          id: 'cold-loudness-1',
          name: 'Loudness 1',
          value: '42 dB',
          sensorKey: 'cold_loudness_1',
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
        resourceNames: ['qexa20'],
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
        resourceNames: ['q5'],
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
        resourceNames: ['q20'],
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
            id: 'cc-temp-1',
            name: 'Temp 1',
            value: '20.1°C',
            sensorKey: 'cc_temp_1',
            grafanaPanelRef: null,
          },
        ],
        wall: [],
        roof: [],
      },
      humidity: [
        {
          id: 'cc-humid-1',
          name: 'Humidity 1',
          value: '38%',
          sensorKey: 'cc_humidity_1',
          grafanaPanelRef: null,
        },
      ],
      power: [
        {
          id: 'cc-power-1',
          name: 'Power 1',
          value: '45.2 kW',
          sensorKey: 'cc_power_1',
          grafanaPanelRef: null,
        },
      ],
      magnetometer: [
        {
          id: 'cc-magnetometer-1',
          name: 'Magnetometer 1',
          value: '48 µT',
          sensorKey: 'cc_magnetometer_1',
          grafanaPanelRef: null,
        },
      ],
      lightIntensity: [
        {
          id: 'cc-light-1',
          name: 'Light Intensity 1',
          value: '320 lux',
          sensorKey: 'cc_light_1',
          grafanaPanelRef: null,
        },
      ],
      loudness: [
        {
          id: 'cc-loudness-1',
          name: 'Loudness 1',
          value: '42 dB',
          sensorKey: 'cc_loudness_1',
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
        resourceNames: ['maqcs'],
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
        resourceNames: ['muniqc-atoms20'],
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
            id: 'cloud-temp-1',
            name: 'Temp 1',
            value: '19.8°C',
            sensorKey: 'cloud_temp_1',
            grafanaPanelRef: null,
          },
        ],
        wall: [],
        roof: [],
      },
      pressure: [
        {
          id: 'cloud-pressure-1',
          name: 'Pressure 1',
          value: '1015 hPa',
          sensorKey: 'cloud_pressure_1',
          grafanaPanelRef: null,
        },
      ],
      network: [
        {
          id: 'cloud-network-1',
          name: 'Network 1',
          value: '12ms',
          sensorKey: 'cloud_network_1',
          grafanaPanelRef: null,
        },
      ],
      magnetometer: [
        {
          id: 'cloud-magnetometer-1',
          name: 'Magnetometer 1',
          value: '48 µT',
          sensorKey: 'cloud_magnetometer_1',
          grafanaPanelRef: null,
        },
      ],
      lightIntensity: [
        {
          id: 'cloud-light-1',
          name: 'Light Intensity 1',
          value: '320 lux',
          sensorKey: 'cloud_light_1',
          grafanaPanelRef: null,
        },
      ],
      loudness: [
        {
          id: 'cloud-loudness-1',
          name: 'Loudness 1',
          value: '42 dB',
          sensorKey: 'cloud_loudness_1',
          grafanaPanelRef: null,
        },
      ],
    },
  },
};

/**
 * Returns the first MOCK_ROOM whose quantumDevices list contains a device
 * with the given resource name in its resourceNames array.
 * Falls back to case-insensitive name matching if resourceNames is absent.
 *
 * @param {string} resourceName  e.g. 'qexa20'
 * @returns {Object|null}
 */
export function findRoomByResourceName(resourceName) {
  const needle = (resourceName || '').trim().toLowerCase();
  for (const room of Object.values(MOCK_ROOMS)) {
    if (!Array.isArray(room.quantumDevices)) continue;
    const match = room.quantumDevices.some((d) => {
      if (Array.isArray(d.resourceNames)) {
        return d.resourceNames.some((n) => n.toLowerCase() === needle);
      }
      return (d.name || '').trim().toLowerCase() === needle;
    });
    if (match) return room;
  }
  return null;
}

/**
 * Returns an ordered list of category keys that have at least one sensor.
 *
 * @param {Object} environmentSensors
 * @returns {string[]}
 */
export function getAvailableCategories(environmentSensors) {
  if (!environmentSensors) return [];
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
  return order.filter((key) => {
    if (key === 'temperature') {
      const t = environmentSensors.temperature || {};
      return (t.floor?.length || 0) + (t.wall?.length || 0) + (t.roof?.length || 0) > 0;
    }
    return (environmentSensors[key]?.length || 0) > 0;
  });
}

/**
 * Returns the first grafanaPanelRef found among sensors in the given category,
 * or null if none is configured.
 *
 * @param {Object} environmentSensors
 * @param {string} category
 * @returns {Object|null}
 */
export function findPanelRefForCategory(environmentSensors, category) {
  if (!environmentSensors || !category) return null;
  let sensors = [];
  if (category === 'temperature') {
    const t = environmentSensors.temperature || {};
    sensors = [...(t.floor || []), ...(t.wall || []), ...(t.roof || [])];
  } else {
    sensors = environmentSensors[category] || [];
  }
  for (const s of sensors) {
    if (s.grafanaPanelRef) return s.grafanaPanelRef;
  }
  return null;
}

export function parseSensorValue(valueStr) {
  const match = valueStr.match(/^([\d.]+)\s*(.*)$/);
  if (!match) return { num: 0, unit: valueStr };
  return { num: parseFloat(match[1]), unit: match[2] };
}

/** Generate a 24-point timeseries between `from` and `to` for CSV export. */
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
  const res = await fetch(`${TELEMETRY_API_URL}/export/csv`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      sensorIds,
      from: new Date(from).toISOString(),
      to: new Date(to).toISOString(),
    }),
  });
  if (!res.ok) throw new Error(`Export failed: ${res.status}`);
  return res.blob();
}
