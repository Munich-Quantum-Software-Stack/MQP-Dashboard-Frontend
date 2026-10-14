import React from 'react';

const DAYS = 4;
const GREEN = '#2e9e4f';
const RED = '#d93a3a';
const W = 150;
const H = 80;
const PAD_L = 52;
const PAD_R = 8;
const PAD_B = 16;
const Y_AVAILABLE = 14;
const Y_MAINTENANCE = H - PAD_B - 12;
const Y_BASE = H - PAD_B;

// Last DAYS dates ending today, oldest first (e.g. 11, 12, 13, 14)
export function getLastDays(days = DAYS, today = new Date()) {
  return Array.from({ length: days }, (_, i) => {
    const d = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (days - 1 - i));
    return d;
  });
}

/**
 * Tiny chart: y axis = Available (top) | Maintenance (bottom), x axis = last 4 days.
 * A horizontal line starts at the y axis, drops to Maintenance and rises back to Available.
 * `history` is an optional array of booleans (oldest first) to show real per-day data.
 */
const AvailabilityChart = ({ available, history }) => {
  const days = getLastDays();
  const states = history && history.length === DAYS ? history : days.map(() => available);
  const points = days.map((date, i) => ({
    date,
    isAvailable: states.at(i),
    prev: i === 0 ? null : states.at(i - 1),
  }));
  const colW = (W - PAD_L - PAD_R) / DAYS;
  const yOf = (isAvailable) => (isAvailable ? Y_AVAILABLE : Y_MAINTENANCE);
  const xOf = (i) => PAD_L + colW * i + colW / 2;
  const label = states.every(Boolean)
    ? 'Available'
    : states.some(Boolean)
      ? 'Mixed'
      : 'Maintenance';

  return (
    <svg
      className="status_chart"
      viewBox={`0 0 ${W} ${H}`}
      role="img"
      aria-label={`${label} for the last ${DAYS} days`}
    >
      <text x={PAD_L - 6} y={Y_AVAILABLE + 3} textAnchor="end" fontSize="7" fill="currentColor">
        Available
      </text>
      <text x={PAD_L - 6} y={Y_MAINTENANCE + 3} textAnchor="end" fontSize="7" fill="currentColor">
        Maintenance
      </text>
      <line
        x1={PAD_L + 3}
        y1={Y_BASE}
        x2={W - PAD_R}
        y2={Y_BASE}
        stroke="currentColor"
        opacity="0.3"
      />
      <line
        x1={PAD_L}
        y1={4}
        x2={PAD_L}
        y2={Y_BASE}
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.7"
      />
      {points.map(({ date, isAvailable, prev }, i) => {
        const y = yOf(isAvailable);
        const xFrom = i === 0 ? PAD_L : xOf(i - 1);
        const color = isAvailable ? GREEN : RED;
        return (
          <g key={date.toDateString()}>
            {prev !== null && prev !== isAvailable && (
              <line x1={xFrom} y1={yOf(prev)} x2={xFrom} y2={y} stroke={color} strokeWidth="2.5" />
            )}
            <line
              x1={xFrom}
              y1={y}
              x2={xOf(i)}
              y2={y}
              stroke={color}
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx={xOf(i)} cy={y} r="2.5" fill={color} />
            <text x={xOf(i)} y={H - 3} textAnchor="middle" fontSize="8" fill="currentColor">
              {date.getDate()}
            </text>
          </g>
        );
      })}
    </svg>
  );
};

export default AvailabilityChart;
