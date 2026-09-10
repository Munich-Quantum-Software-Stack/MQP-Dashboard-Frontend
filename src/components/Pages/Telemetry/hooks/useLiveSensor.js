import { useState, useEffect, useRef } from 'react';
import { getConfig } from '@components/Pages/Telemetry/runtimeConfig';
import { parseSensorValue } from '@components/Pages/Telemetry/telemetryService';
import { subscribeToSensor } from './useSensorSocket';

/**
 * @param {string} sensorId   Unique sensor id (from room data).
 * @param {string} initialValue  Static value string from service (e.g. "22.4°C").
 * @returns {{ display: string, numeric: number, unit: string, isLive: boolean }}
 */
export function useLiveSensor(sensorId, initialValue) {
  const parsed = parseSensorValue(initialValue || '0');
  const [state, setState] = useState({
    display: initialValue,
    numeric: parsed.num,
    unit: parsed.unit,
    isLive: false,
  });

  // Stable ref avoids stale closure in interval/ws handler
  const baseRef = useRef(parsed.num);

  useEffect(() => {
    const { WS_URL } = getConfig();
    let cleanup;

    if (!WS_URL) {
      // Mock mode — random walk every 3 s
      const id = setInterval(() => {
        const delta = (Math.random() - 0.5) * 0.4;
        const next = +(baseRef.current + delta).toFixed(2);
        baseRef.current = next;
        setState({
          display: `${next}${parsed.unit}`,
          numeric: next,
          unit: parsed.unit,
          isLive: true,
        });
      }, 3000);
      cleanup = () => clearInterval(id);
    } else {
      // Real WebSocket mode — shared connection via singleton multiplexer
      const unsubscribe = subscribeToSensor(
        sensorId,
        ({ value, unit }) => {
          const u = unit || parsed.unit;
          setState({
            display: `${value}${u}`,
            numeric: value,
            unit: u,
            isLive: true,
          });
        },
        WS_URL,
      );
      cleanup = unsubscribe;
    }

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sensorId]);

  return state;
}
