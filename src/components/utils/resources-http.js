/**
 * resources-http.js - HTTP utility for fetching quantum computing resources from the API
 */

// ---------------------------------------------------------------------------
// Mock data — used when REACT_APP_API_ENDPOINT is not configured
// ---------------------------------------------------------------------------

/** @type {Object.<string, Object>} */
const MOCK_RESOURCE_DETAIL = {
  qexa20: {
    name: 'QExa20',
    status: 'Online',
    qubits: 20,
    qpu_version: 'Garnet v2.1',
    fabrication_round: 'FR-24Q2',
    pending_jobs: 3,
    t1_us: 112.4,
    t2_us: 87.6,
    last_calibrated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    grafana_panel_ref: {
      dashboardUid: '55b99d46-9e7d-4b1c-b5dc-592592f60031',
      slug: 'warmlab',
      panelId: 5,
    },
  },
  aqt20: {
    name: 'AQT20',
    status: 'Maintenance',
    qubits: 20,
    qpu_version: 'PINE v1.0',
    fabrication_round: null,
    pending_jobs: 0,
    t1_us: 500.0,
    t2_us: 310.5,
    last_calibrated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    grafana_panel_ref: null,
  },
  qlm: {
    name: 'QLM',
    status: 'Online',
    qubits: 38,
    qpu_version: 'Qaptiva 800 v3.0',
    fabrication_round: null,
    pending_jobs: 1,
    t1_us: null,
    t2_us: null,
    last_calibrated_at: null,
    grafana_panel_ref: null,
  },
  'muniqc-atoms20': {
    name: 'MUNIQC-Atoms20',
    status: 'Online',
    qubits: 20,
    qpu_version: 'MPA v1.0',
    fabrication_round: 'FR-25Q1',
    pending_jobs: 0,
    t1_us: 1200.0,
    t2_us: 880.0,
    last_calibrated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    grafana_panel_ref: null,
  },
  wmi3: {
    name: 'WMI3',
    status: 'Online',
    qubits: 3,
    qpu_version: 'WMI-SC v0.9',
    fabrication_round: 'FR-24Q4',
    pending_jobs: 0,
    t1_us: 45.2,
    t2_us: 31.8,
    last_calibrated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    grafana_panel_ref: null,
  },
  maqcs: {
    name: 'MAQCS',
    status: 'Online',
    qubits: null,
    qpu_version: null,
    fabrication_round: null,
    pending_jobs: null,
    t1_us: null,
    t2_us: null,
    last_calibrated_at: null,
    grafana_panel_ref: null,
  },
  eqe1: {
    name: 'EQE1',
    status: 'Online',
    qubits: null,
    qpu_version: 'EQE v1.0-beta',
    fabrication_round: null,
    pending_jobs: null,
    t1_us: null,
    t2_us: null,
    last_calibrated_at: null,
    grafana_panel_ref: null,
  },
  q20: {
    name: 'Q20',
    status: 'Maintenance',
    qubits: 19,
    qpu_version: null,
    fabrication_round: null,
    pending_jobs: 0,
    t1_us: 98.1,
    t2_us: 74.3,
    last_calibrated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    grafana_panel_ref: null,
  },
  q5: {
    name: 'Q5',
    status: 'Maintenance',
    qubits: 5,
    qpu_version: null,
    fabrication_round: null,
    pending_jobs: 0,
    t1_us: 85.0,
    t2_us: 62.4,
    last_calibrated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    grafana_panel_ref: null,
  },
};

/** @type {Object.<string, Array>} */
const MOCK_MAINTENANCE_EVENTS = {
  qexa20: [
    {
      id: 'me-qexa20-1',
      title: 'Quarterly Calibration',
      description: 'Full QPU calibration and gate fidelity benchmarking. Downtime expected: ~4h.',
      start_at: (() => { const d = new Date(); d.setDate(22); d.setHours(8, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setDate(22); d.setHours(12, 0, 0, 0); return d.toISOString(); })(),
    },
  ],
  aqt20: [
    {
      id: 'me-aqt20-1',
      title: 'Ion Trap Maintenance',
      description: 'Scheduled ion trap realignment and laser recalibration.',
      start_at: (() => { const d = new Date(); d.setDate(18); d.setHours(9, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setDate(20); d.setHours(17, 0, 0, 0); return d.toISOString(); })(),
    },
    {
      id: 'me-aqt20-2',
      title: 'Firmware Update',
      description: 'Control electronics firmware upgrade to version 3.1.',
      start_at: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(5); d.setHours(7, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(5); d.setHours(10, 0, 0, 0); return d.toISOString(); })(),
    },
  ],
  qlm: [
    {
      id: 'me-qlm-1',
      title: 'Software Maintenance',
      description: 'Qaptiva software stack upgrade and dependency refresh.',
      start_at: (() => { const d = new Date(); d.setDate(25); d.setHours(10, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setDate(25); d.setHours(14, 0, 0, 0); return d.toISOString(); })(),
    },
  ],
  'muniqc-atoms20': [
    {
      id: 'me-muniqc-1',
      title: 'Optical Tweezer Alignment',
      description: 'Periodic realignment of the optical tweezer array.',
      start_at: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(10); d.setHours(8, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setMonth(d.getMonth() + 1); d.setDate(11); d.setHours(18, 0, 0, 0); return d.toISOString(); })(),
    },
  ],
  wmi3: [],
  maqcs: [],
  eqe1: [],
  q20: [
    {
      id: 'me-q20-1',
      title: 'Cryostat Servicing',
      description: 'Cryostat maintenance and helium refill.',
      start_at: (() => { const d = new Date(); d.setDate(17); d.setHours(8, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setDate(19); d.setHours(20, 0, 0, 0); return d.toISOString(); })(),
    },
  ],
  q5: [
    {
      id: 'me-q5-1',
      title: 'Cryostat Servicing',
      description: 'Cryostat maintenance and helium refill.',
      start_at: (() => { const d = new Date(); d.setDate(17); d.setHours(8, 0, 0, 0); return d.toISOString(); })(),
      end_at: (() => { const d = new Date(); d.setDate(19); d.setHours(20, 0, 0, 0); return d.toISOString(); })(),
    },
  ],
};

// ---------------------------------------------------------------------------
// HTTP functions
// ---------------------------------------------------------------------------

// Fetch all available quantum resources with their status and specifications
export async function fetchResources({ signal, access_token }) {
  const url = process.env.REACT_APP_API_ENDPOINT + '/resources';
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    // Extract error details from response body if available
    let errorMessage = 'Could not fetch resources!';
    let errorDetails;

    try {
      const errorBody = await response.json();
      if (errorBody && typeof errorBody.error_message === 'string') {
        errorDetails = errorBody.error_message;
      }
    } catch (parseError) {
      // Swallow JSON parsing issues and fallback to default error message.
    }

    const error = new Error(errorMessage);
    error.code = response.status;
    if (errorDetails) {
      error.details = errorDetails;
    }
    console.error('Resource request failed:', response);
    throw error;
  }

  const data = await response.json();

  return data;
}

/**
 * Fetch extended live/calibration metadata for a single quantum resource.
 * Falls back to MOCK_RESOURCE_DETAIL when REACT_APP_API_ENDPOINT is not set.
 *
 * @param {{ signal: AbortSignal, access_token: string, resourceName: string }} params
 * @returns {Promise<Object>}
 */
export async function fetchResourceDetail({ signal, access_token, resourceName }) {
  const key = (resourceName || '').trim().toLowerCase();

  if (!process.env.REACT_APP_API_ENDPOINT) {
    // Return mock data — provides a full UI without a live backend
    const mock = MOCK_RESOURCE_DETAIL[key];
    return mock || {
      name: resourceName,
      status: null,
      qubits: null,
      qpu_version: null,
      fabrication_round: null,
      pending_jobs: null,
      t1_us: null,
      t2_us: null,
      last_calibrated_at: null,
      grafana_panel_ref: null,
    };
  }

  const url = `${process.env.REACT_APP_API_ENDPOINT}/resources/${encodeURIComponent(resourceName)}/detail`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error('Could not fetch resource detail!');
    error.code = response.status;
    throw error;
  }

  return response.json();
}

/**
 * Fetch scheduled maintenance events for a single quantum resource.
 * Falls back to MOCK_MAINTENANCE_EVENTS when REACT_APP_API_ENDPOINT is not set.
 *
 * @param {{ signal: AbortSignal, access_token: string, resourceName: string }} params
 * @returns {Promise<Array>}
 */
export async function fetchMaintenanceEvents({ signal, access_token, resourceName }) {
  const key = (resourceName || '').trim().toLowerCase();

  if (!process.env.REACT_APP_API_ENDPOINT) {
    return MOCK_MAINTENANCE_EVENTS[key] || [];
  }

  const url = `${process.env.REACT_APP_API_ENDPOINT}/resources/${encodeURIComponent(resourceName)}/maintenance`;
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
      'Content-Type': 'application/json',
    },
    signal,
  });

  if (!response.ok) {
    const error = new Error('Could not fetch maintenance events!');
    error.code = response.status;
    throw error;
  }

  const data = await response.json();
  return data.events || [];
}
