const _sockets = new Map();

// Map<wsUrl, Map<sensorId, Set<callback>>>
const _subscribers = new Map();

// Map<wsUrl, 'connecting'|'open'|'closed'>
const _socketState = new Map();

/**
 * Returns (creating if necessary) the shared WebSocket for a given URL.
 * Reconnects automatically once if the socket closes unexpectedly.
 *
 * @param {string} wsUrl
 * @returns {WebSocket}
 */
function getOrCreateSocket(wsUrl) {
  const existing = _sockets.get(wsUrl);
  if (existing && existing.readyState < 2) {
    // CONNECTING (0) or OPEN (1)
    return existing;
  }

  const ws = new WebSocket(wsUrl);
  _sockets.set(wsUrl, ws);
  _socketState.set(wsUrl, 'connecting');

  ws.onopen = () => {
    _socketState.set(wsUrl, 'open');
  };

  ws.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      const { sensorId, value, unit } = data;
      if (!sensorId) return;

      const sensorMap = _subscribers.get(wsUrl);
      if (!sensorMap) return;
      const callbacks = sensorMap.get(sensorId);
      if (!callbacks) return;

      const num = typeof value === 'number' ? value : parseFloat(value);
      callbacks.forEach((cb) => cb({ value: num, unit: unit || '' }));
    } catch {
      // Ignore malformed frames
    }
  };

  ws.onerror = () => {
    _socketState.set(wsUrl, 'closed');
  };

  ws.onclose = () => {
    _socketState.set(wsUrl, 'closed');
    _sockets.delete(wsUrl);
    // Attempt reconnect after 5 s if there are still active subscribers
    setTimeout(() => {
      const sensorMap = _subscribers.get(wsUrl);
      if (sensorMap && sensorMap.size > 0) {
        getOrCreateSocket(wsUrl);
      }
    }, 5000);
  };

  return ws;
}

/**
 * Subscribe to live updates for a single sensor over a shared WebSocket.
 *
 * @param {string}   sensorId  Sensor ID from room data.
 * @param {function} callback  Called with `{ value: number, unit: string }`.
 * @param {string}   wsUrl     WebSocket base URL from runtime config.
 * @returns {function}  Call to unsubscribe (safe to call multiple times).
 */
export function subscribeToSensor(sensorId, callback, wsUrl) {
  // Ensure subscriber maps exist for this URL
  if (!_subscribers.has(wsUrl)) {
    _subscribers.set(wsUrl, new Map());
  }
  const sensorMap = _subscribers.get(wsUrl);
  if (!sensorMap.has(sensorId)) {
    sensorMap.set(sensorId, new Set());
  }
  sensorMap.get(sensorId).add(callback);

  // Ensure the socket is running
  try {
    getOrCreateSocket(wsUrl);
  } catch {}

  return function unsubscribe() {
    const sm = _subscribers.get(wsUrl);
    if (!sm) return;
    const cbs = sm.get(sensorId);
    if (!cbs) return;
    cbs.delete(callback);
    if (cbs.size === 0) {
      sm.delete(sensorId);
    }
    if (sm.size === 0) {
      _subscribers.delete(wsUrl);
      const ws = _sockets.get(wsUrl);
      if (ws && ws.readyState < 2) ws.close();
      _sockets.delete(wsUrl);
      _socketState.delete(wsUrl);
    }
  };
}
