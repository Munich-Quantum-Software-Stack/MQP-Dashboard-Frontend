// Validate `group_by` duration strings (e.g. "5m").
const GROUP_BY_RE = /^\d+[smhdwMy]$/;

// Thrown on HTTP 401 responses.
export class AuthExpiredError extends Error {
  constructor(message = 'Session expired. Please log in again.') {
    super(message);
    this.name = 'AuthExpiredError';
  }
}

// Thrown for invalid telemetry query input.
export class TelemetryValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'TelemetryValidationError';
  }
}

// Resolve telemetry API base URL (env override → api endpoint → localhost).
function getApiBase() {
  return (
    process.env.REACT_APP_TELEMETRY_API_URL ||
    process.env.REACT_APP_API_ENDPOINT ||
    'http://localhost:5000'
  ).replace(/\/$/, '');
}

// Fetch wrapper: maps 401 → AuthExpiredError and surfaces network/JSON errors.
async function apiFetch(url, init = {}) {
  let response;
  try {
    response = await fetch(url, init);
  } catch (err) {
    if (err.name === 'AbortError') throw err;
    throw new Error(`Network error — could not reach the telemetry API: ${err.message}`);
  }

  if (response.status === 401) {
    throw new AuthExpiredError();
  }

  if (!response.ok) {
    let detail = '';
    try {
      const body = await response.json();
      detail = body.error || body.message || body.detail || '';
    } catch {
    }
    throw new Error(`Telemetry request failed (HTTP ${response.status})${detail ? ': ' + detail : ''}`);
  }

  return response;
}

export function validateTelemetryQuery({ fromTs, toTs, groupBy, measurements }) {
  if (fromTs == null || toTs == null) {
    throw new TelemetryValidationError('from_timestamp and to_timestamp are required.');
  }
  if (typeof fromTs !== 'number' || typeof toTs !== 'number') {
    throw new TelemetryValidationError(
      'Timestamps must be numbers in Unix milliseconds.',
    );
  }
  // Sanity-check: timestamps should be milliseconds since epoch.
  if (fromTs < 946684800000 || toTs < 946684800000) {
    throw new TelemetryValidationError(
      'Timestamps appear to be in seconds — expected Unix milliseconds.',
    );
  }
  if (fromTs >= toTs) {
    throw new TelemetryValidationError('from_timestamp must be earlier than to_timestamp.');
  }
  if (!groupBy || !GROUP_BY_RE.test(groupBy)) {
    throw new TelemetryValidationError(
      'group_by must be a valid InfluxQL duration string (e.g. "1m", "5m", "1h").',
    );
  }
  if (measurements !== null && measurements !== undefined) {
    if (!Array.isArray(measurements)) {
      throw new TelemetryValidationError('measurements must be an array or null.');
    }
    for (const m of measurements) {
      if (!m || typeof m.name !== 'string' || !m.name) {
        throw new TelemetryValidationError('Each measurement entry must have a non-empty "name".');
      }
      if (m.sensors !== undefined && m.sensors !== null && !Array.isArray(m.sensors)) {
        throw new TelemetryValidationError(
          `sensors for measurement "${m.name}" must be an array.`,
        );
      }
    }
  }
}
export async function fetchTelemetrySensors(token, signal) {
  const url = `${getApiBase()}/telemetry/sensors`;
  const response = await apiFetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    signal,
  });
  return response.json();
}
export async function requestTelemetryFile(token, params, signal) {
  const { fromTs, toTs, groupBy, measurements } = params;
  const body = {
    measurements: measurements && measurements.length > 0 ? measurements : null,
    from_timestamp: fromTs,
    to_timestamp: toTs,
    group_by: groupBy,
  };

  const url = `${getApiBase()}/telemetry`;
  const response = await apiFetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
    signal,
  });
  return response.json();
}
export async function downloadTelemetryFile(token, filename, signal) {
  const url = `${getApiBase()}/telemetry/download/`;
  const response = await apiFetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ filename }),
    signal,
  });
  return response.blob();
}
// Decompress gzip Blob using `DecompressionStream` (modern browsers only).
export async function decompressGzip(blob) {
  if (typeof DecompressionStream === 'undefined') {
    throw new Error('DecompressionStream is not supported in this browser.');
  }

  const ds = new DecompressionStream('gzip');
  const stream = blob.stream().pipeThrough(ds);
  const reader = stream.getReader();
  const chunks = [];

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }

  const totalLength = chunks.reduce((sum, c) => sum + c.length, 0);
  const combined = new Uint8Array(totalLength);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return new TextDecoder('utf-8').decode(combined);
}
export async function parseTelemetryBlob(blob) {
  const text = await decompressGzip(blob);
  return JSON.parse(text);
}
// Normalize backend telemetry JSON for frontend rendering (preserve nulls).
export function normalizeTelemetry(parsed) {
  if (!parsed || typeof parsed !== 'object') return {};

  const result = {};

  for (const [measurement, sensors] of Object.entries(parsed)) {
    if (!sensors || typeof sensors !== 'object') continue;
    result[measurement] = {};

    for (const [sensor, points] of Object.entries(sensors)) {
      if (!Array.isArray(points)) {
        result[measurement][sensor] = [];
        continue;
      }
      result[measurement][sensor] = points.map((p) => ({
        time: p.time,
        mean: p.mean,
        ts: new Date(p.time).getTime(),
      }));
    }
  }

  return result;
}
export async function fetchTelemetry(token, params, signal) {
  validateTelemetryQuery(params);

  // Step 1 — trigger file generation, get filename + filesize
  const fileInfo = await requestTelemetryFile(token, params, signal);

  // Step 2 — download the .json.gz binary
  const gzipBlob = await downloadTelemetryFile(token, fileInfo.filename, signal);

  // Steps 3–5 — decompress, parse JSON
  const parsed = await parseTelemetryBlob(gzipBlob);

  // Step 6 — normalize for rendering
  return normalizeTelemetry(parsed);
}
