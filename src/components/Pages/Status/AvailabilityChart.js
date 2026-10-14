import React from 'react';

const DAYS = 4;
const GREEN = '#2e9e4f';
const RED = '#d93a3a';
const W = 120;
const H = 80;
const PAD_L = 44;
const PAD_B = 14;
const Y_AVAILABLE = H - PAD_B - 14;
const Y_MAINTENANCE = 12;
const Y_BASE = H - PAD_B;

// Last DAYS dates ending today, oldest first (e.g. 11, 12, 13, 14)
export function getLastDays(days = DAYS, today = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i));
    return d;
  });
}

/**
 * Tiny chart: y axis = Available (lower) | Maintenance (upper), x axis = last 4 days.
 * One vertical line per day, drawn up to the state of that day.
 */
const AvailabilityChart = ({ available }) => {
  const days = getLastDays();
  const state = available ? 'Available' : 'Maintenance';
  const color = available ? GREEN : RED;
  const y = available ? Y_AVAILABLE : Y_MAINTENANCE;
  const colW = (W - PAD_L - 6) / DAYS;

  return (
    <svg
      className="status_chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${state} for the last ${DAYS} days`}
    >
      <text x={PAD_L - 4} y={Y_AVAILABLE + 3} textAnchor="end" fontSize="7" fill="currentColor">
        Available
      </text>
      <text x={PAD_L - 4} y={Y_MAINTENANCE + 3} textAnchor="end" fontSize="7" fill="currentColor">
        Maintenance
      </text>
      <line x1={PAD_L} y1={Y_BASE} x2={W - 2} y2={Y_BASE} stroke="currentColor" opacity="0.3" />
      {days.map((d, i) => {
        const x = PAD_L + colW * i + colW / 2;
        return (
          <g key={d.toDateString()}>
            <line
              x1={x}
              y1={Y_BASE}
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={x} cy={y} r="2.5" fill={color} />
            <text x={x} y={H - 3} textAnchor="middle" fontSize="8" fill="currentColor">
              {d.getDate()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default AvailabilityChart;
