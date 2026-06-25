import React, { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { useSelector } from 'react-redux';
import couplingMapDataDefault from '@data/coupling-map.json';
import './ChipVisualisation.scss';

const DATA_COLOR = '#4a9eff';
const ANCILLA_COLOR = '#a855f7';
const EDGE_COLOR = '#1e3a5f';
const EDGE_HIGHLIGHT = '#4a9eff';
const CHIP_BG_DARK = '#0a0a0a';
const CHIP_INNER_DARK = '#111111';
const CHIP_BG_LIGHT = '#f8fafc';
const CHIP_INNER_LIGHT = '#ffffff';
const QUBIT_R = 9;
const TRACK_W = 12;

function toPx(pos, w, h, pad) {
  return [pad + pos[0] * (w - pad * 2), pad + pos[1] * (h - pad * 2)];
}

export default function ChipVisualisation({
  couplingData,
  width = 700,
  height = 420,
  pad = 52,
  darkmode: darkmodeProp,
  onQubitClick,
}) {
  const darkmodeFromStore = useSelector((s) => s.accessibilities?.darkmode);
  const darkmode = typeof darkmodeProp === 'boolean' ? darkmodeProp : !!darkmodeFromStore;

  const data = couplingData || couplingMapDataDefault || {};
  const labels = useMemo(() => data.qubit_labels || [], [data.qubit_labels]);
  const positions = useMemo(() => data.qubit_positions || [], [data.qubit_positions]);
  const roles = data.qubit_roles || [];
  const edges = useMemo(() => data.coupling_map || [], [data.coupling_map]);

  const [hovered, setHovered] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });

  // Zoom/pan state — viewBox rectangle in SVG coordinates
  const [vb, setVb] = useState({ x: 0, y: 0, w: width, h: height });
  const svgRef = useRef(null);
  const isPanning = useRef(false);
  const panStart = useRef({ mx: 0, my: 0, vbx: 0, vby: 0 });

  // Clamp viewBox so it never shows area outside the SVG
  const clampVb = useCallback(
    ({ x, y, w, h }) => {
      const cw = Math.min(w, width);
      const ch = Math.min(h, height);
      const cx = Math.max(0, Math.min(x, width - cw));
      const cy = Math.max(0, Math.min(y, height - ch));
      return { x: cx, y: cy, w: cw, h: ch };
    },
    [width, height],
  );

  // Convert client mouse coords → SVG coords
  const clientToSvg = useCallback(
    (clientX, clientY) => {
      const el = svgRef.current;
      if (!el) return { sx: 0, sy: 0 };
      const rect = el.getBoundingClientRect();
      const rx = (clientX - rect.left) / rect.width;
      const ry = (clientY - rect.top) / rect.height;
      return { sx: vb.x + rx * vb.w, sy: vb.y + ry * vb.h };
    },
    [vb],
  );

  const handleWheel = useCallback(
    (e) => {
      e.preventDefault();
      const ZOOM_SPEED = 0.001;
      const factor = 1 + e.deltaY * ZOOM_SPEED;
      const { sx, sy } = clientToSvg(e.clientX, e.clientY);
      setVb((prev) => {
        const newW = prev.w * factor;
        const newH = prev.h * factor;
        const newX = sx - (sx - prev.x) * (newW / prev.w);
        const newY = sy - (sy - prev.y) * (newH / prev.h);
        return clampVb({ x: newX, y: newY, w: newW, h: newH });
      });
    },
    [clientToSvg, clampVb],
  );

  // Attach wheel listener with { passive: false } to allow preventDefault
  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleMouseDown = useCallback(
    (e) => {
      if (e.button !== 0) return;
      isPanning.current = true;
      panStart.current = { mx: e.clientX, my: e.clientY, vbx: vb.x, vby: vb.y };
    },
    [vb],
  );

  const handleMouseMove = useCallback(
    (e) => {
      if (!isPanning.current) return;
      const el = svgRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scaleX = vb.w / rect.width;
      const scaleY = vb.h / rect.height;
      const dx = (panStart.current.mx - e.clientX) * scaleX;
      const dy = (panStart.current.my - e.clientY) * scaleY;
      setVb((prev) =>
        clampVb({
          x: panStart.current.vbx + dx,
          y: panStart.current.vby + dy,
          w: prev.w,
          h: prev.h,
        }),
      );
    },
    [vb.w, vb.h, clampVb],
  );

  const handleMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const resetZoom = useCallback(() => {
    setVb({ x: 0, y: 0, w: width, h: height });
  }, [width, height]);

  const isZoomedIn = vb.w < width - 0.5;

  const adj = useMemo(() => {
    const map = {};
    labels.forEach((l) => (map[l] = []));
    edges.forEach(([a, b]) => {
      map[labels[a]]?.push(labels[b]);
      map[labels[b]]?.push(labels[a]);
    });
    return map;
  }, [labels, edges]);

  const px = useMemo(() => {
    const p = {};
    labels.forEach((label, i) => {
      p[label] = toPx(positions[i], width, height, pad);
    });
    return p;
  }, [labels, positions, width, height, pad]);

  const edgeList = useMemo(() => {
    const drawnEdges = new Set();
    const list = [];
    edges.forEach(([a, b]) => {
      const key = [labels[a], labels[b]].sort().join('--');
      if (drawnEdges.has(key)) return;
      drawnEdges.add(key);
      list.push([labels[a], labels[b], key]);
    });
    return list;
  }, [edges, labels]);

  const hoveredNeighborKeys = hovered
    ? new Set(adj[hovered]?.map((n) => [hovered, n].sort().join('--')))
    : new Set();

  const CHIP_BG = darkmode ? CHIP_BG_DARK : CHIP_BG_LIGHT;
  const CHIP_INNER = darkmode ? CHIP_INNER_DARK : CHIP_INNER_LIGHT;
  const textColor = darkmode ? '#cdd6f4' : '#1f2937';

  useEffect(() => {
    // nothing for now
  }, [darkmode]);

  const viewBoxStr = `${vb.x} ${vb.y} ${vb.w} ${vb.h}`;

  return (
    <div className="chip-visualisation" style={{ position: 'relative' }}>
      {/* Legend */}
      <div
        className="chip-legend"
        style={{
          color: textColor,
          background: darkmode ? 'rgba(31, 41, 55, 0.92)' : 'rgba(255, 255, 255, 0.92)',
          borderColor: darkmode ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)',
        }}
      >
        <div className="chip-legend-title">Legend</div>
        {[['Data qubit', DATA_COLOR]].map(([name, color]) => (
          <div className="chip-legend-row" key={name}>
            <div className="chip-legend-dot" style={{ background: color }} />
            <span>{name}</span>
          </div>
        ))}
        <div className="chip-legend-row">
          <div
            className="chip-legend-edge"
            style={{ background: darkmode ? '#4a9eff' : '#1e3a5f' }}
          />{' '}
          <span>Connection</span>
        </div>
        {isZoomedIn && (
          <button
            onClick={resetZoom}
            style={{
              marginLeft: 'auto',
              background: 'none',
              border: `1px solid ${darkmode ? '#4b9eff' : '#6cacde'}`,
              color: darkmode ? '#4b9eff' : '#6cacde',
              borderRadius: 6,
              padding: '2px 10px',
              fontSize: '0.75rem',
              cursor: 'pointer',
              fontWeight: 600,
            }}
          >
            Reset zoom
          </button>
        )}
      </div>

      <div className="chip-stats">
        <span>
          {labels.length} qubits · {edges.length} connections
        </span>
        {isZoomedIn ? (
          <span style={{ marginLeft: 8 }}>Scroll to zoom · Drag to pan</span>
        ) : (
          <span style={{ marginLeft: 8 }}>Scroll to zoom in</span>
        )}
      </div>

      {hovered && (
        <div
          className="chip-tooltip"
          style={{
            left: tooltipPos.x + 14,
            top: tooltipPos.y + 14,
            background: CHIP_BG,
            color: textColor,
          }}
        >
          <strong style={{ color: DATA_COLOR }}>{hovered}</strong>
          <div className="chip-tooltip-sub">
            {roles[labels.indexOf(hovered)] || 'qubit'} • Connections: {(adj[hovered] || []).length}
          </div>
        </div>
      )}

      <div
        className="chip-canvas"
        style={{
          borderRadius: 8,
          background: CHIP_BG,
          cursor: isPanning.current ? 'grabbing' : isZoomedIn ? 'grab' : 'default',
          userSelect: 'none',
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          viewBox={viewBoxStr}
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <rect x={0} y={0} width={width} height={height} fill={CHIP_BG} />
          <rect
            x={pad / 2}
            y={pad / 2}
            width={width - pad}
            height={height - pad}
            rx={10}
            fill={CHIP_INNER}
          />

          {edgeList.map(([a, b, key]) => {
            const [x1, y1] = px[a] || [0, 0];
            const [x2, y2] = px[b] || [0, 0];
            const highlighted = hoveredNeighborKeys.has(key);
            const dx = x2 - x1;
            const dy = y2 - y1;
            const len = Math.sqrt(dx * dx + dy * dy);
            if (len === 0) return null;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
            return (
              <rect
                key={key}
                x={mx - len / 2}
                y={my - TRACK_W / 2}
                width={len}
                height={TRACK_W}
                rx={TRACK_W / 2}
                fill={highlighted ? EDGE_HIGHLIGHT : EDGE_COLOR}
                opacity={highlighted ? 1 : 0.9}
                transform={`rotate(${angleDeg}, ${mx}, ${my})`}
              />
            );
          })}

          {labels.map((label, i) => {
            const [cx, cy] = px[label] || [0, 0];
            const role = roles[i] || 'data';
            const fill = role === 'ancilla' ? ANCILLA_COLOR : DATA_COLOR;
            const isHovered = hovered === label;
            const r = isHovered ? QUBIT_R + 2 : QUBIT_R;
            return (
              <g
                key={label}
                style={{ cursor: 'pointer' }}
                onMouseEnter={(e) => {
                  setHovered(label);
                  setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onMouseLeave={() => setHovered(null)}
                onMouseMove={(e) => {
                  if (!isPanning.current) setTooltipPos({ x: e.clientX, y: e.clientY });
                }}
                onClick={() => onQubitClick && onQubitClick(label)}
              >
                <circle cx={cx} cy={cy} r={r + 3} fill={isHovered ? '#ffffff33' : '#00000066'} />
                <circle cx={cx} cy={cy} r={r} fill={fill} />
                <text
                  x={cx + r + 5}
                  y={cy + 4}
                  fill={fill}
                  fontSize={10}
                  fontFamily="monospace"
                  opacity={0.85}
                  pointerEvents="none"
                >
                  {label}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
