import React from 'react';

const DAYS = 4;
const GREEN = '#2e9e4f';
const RED = '#d93a3a';
const W = 120;
const H = 64;
const PAD_L = 22;
const X_AVAILABLE = 38;
const X_MAINTENANCE = W - 18;

// Last DAYS dates ending today, oldest first (e.g. 11, 12, 13, 14)
export function getLastDays(days = DAYS, today = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i));
    return d;
  });
}

/**
 * Tiny chart: x axis = Available | Maintenance, y axis = last 4 days.
 * One line per day, drawn to the state of that day.
 */
const AvailabilityChart = ({ available }) => {
  const days = getLastDays();
  const state = available ? 'Available' : 'Maintenance';
  const color = available ? GREEN : RED;
  const x = available ? X_AVAILABLE : X_MAINTENANCE;
  const rowH = (H - 6) / DAYS;

  return (
    <svg
      className="status_chart"
      viewBox={`0 0 ${W} ${H + 12}`}
      role="img"
      aria-label={`${state} for the last ${DAYS} days`}
    >
      {days.map((d, i) => {
        const y = 6 + rowH * i + rowH / 2;
        return (
          <g key={d.toDateString()}>
            <text x={PAD_L - 4} y={y + 3} textAnchor="end" fontSize="8" fill="currentColor">
              {d.getDate()}
            </text>
            <line
              x1={PAD_L}
              y1={y}
              x2={x}
              y2={y}
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={x} cy={y} r="2.5" fill={color} />
          </g>
        );
      })}
      <line x1={PAD_L} y1={H} x2={W - 4} y2={H} stroke="currentColor" opacity="0.3" />
      <text x={X_AVAILABLE} y={H + 10} textAnchor="middle" fontSize="7" fill="currentColor">
        Available
      </text>
      <text x={X_MAINTENANCE} y={H + 10} textAnchor="middle" fontSize="7" fill="currentColor">
        Maintenance
      </text>
    </svg>
  );
};

export default AvailabilityChart;
