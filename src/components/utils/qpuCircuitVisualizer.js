// QPU Circuit Visualizer — coupling-map layout edition
// Public API:
//   window.QPUCircuitVisualizer.renderFromJson(container, jsonPath)
//   window.QPUCircuitVisualizer.render(container, components)   ← legacy shim kept for back-compat

// ─── layout constants ───────────────────────────────────────────────────────
const CELL_SIZE = 80; // px between adjacent grid positions
const PADDING = 60; // px margin around the grid
const NODE_RADIUS = 18; // px qubit circle radius
const DEFAULT_NODE_COLOR = '#1a1a2e';
const DEFAULT_EDGE_COLOR = '#4a90d9';
const EDGE_OPACITY_DEFAULT = 0.55;
const EDGE_OPACITY_SELECTED = 1.0;
const EDGE_OPACITY_DIMMED = 0.15;
const EDGE_WIDTH_DEFAULT = 2.5;
const EDGE_WIDTH_SELECTED = 4;
const HOVER_RADIUS = 22;
const HOVER_COLOR = '#4a90d9';

// ─── helpers ────────────────────────────────────────────────────────────────

/** Fetch + parse JSON; throws on network/parse error. */
async function loadCircuitData(jsonPath) {
  const res = await fetch(jsonPath, { cache: 'no-store' });
  if (!res.ok) throw new Error(`HTTP ${res.status} loading ${jsonPath}`);
  return res.json();
}

/**
 * Convert qubit_coordinates [[row,col]…] into pixel positions [{x,y}…].
 * Canvas size is determined automatically from the max row/col.
 */
function computeLayout(data) {
  const coords = data.qubit_coordinates || [];
  const positions = coords.map((coord) => ({
    x: PADDING + coord[1] * CELL_SIZE,
    y: PADDING + coord[0] * CELL_SIZE,
  }));
  const maxCol = Math.max(0, ...coords.map((c) => c[1]));
  const maxRow = Math.max(0, ...coords.map((c) => c[0]));
  const svgWidth = PADDING * 2 + maxCol * CELL_SIZE;
  const svgHeight = PADDING * 2 + maxRow * CELL_SIZE;
  return { positions, svgWidth, svgHeight };
}

/**
 * Resolve a per-element color array that may be shorter than needed.
 * Falls back to `defaultColor` when the array is absent or exhausted.
 */
function resolveColor(arr, index, defaultColor) {
  if (!arr || arr.length === 0) return defaultColor;
  return arr[index % arr.length];
}

// ─── SVG render ─────────────────────────────────────────────────────────────

/**
 * Full rendering function — pure w.r.t. state.
 * state = { hoveredNode: number|null, selectedNode: number|null }
 */
function render(container, data, positions, state) {
  const { svgWidth, svgHeight } = computeLayout(data);
  const labels = data.qubit_labels || data.qubit_coordinates.map((_, i) => String(i));
  const couplingMap = data.coupling_map || [];
  const directed = !!data.plot_directed;

  container.innerHTML = '';
  container.style.position = 'relative';

  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('width', svgWidth);
  svg.setAttribute('height', svgHeight);
  svg.style.display = 'block';
  svg.style.overflow = 'visible';

  // ── arrowhead marker for directed mode ──────────────────────────────────
  if (directed) {
    const defs = document.createElementNS(svgNS, 'defs');
    const marker = document.createElementNS(svgNS, 'marker');
    marker.setAttribute('id', 'arrowhead');
    marker.setAttribute('markerWidth', '8');
    marker.setAttribute('markerHeight', '8');
    marker.setAttribute('refX', '6');
    marker.setAttribute('refY', '3');
    marker.setAttribute('orient', 'auto');
    const arrow = document.createElementNS(svgNS, 'path');
    arrow.setAttribute('d', 'M0,0 L0,6 L8,3 z');
    arrow.setAttribute('fill', DEFAULT_EDGE_COLOR);
    marker.appendChild(arrow);
    defs.appendChild(marker);
    svg.appendChild(defs);
  }

  // ── edges (drawn before nodes so nodes sit on top) ──────────────────────
  const edgeEls = []; // parallel to couplingMap
  couplingMap.forEach(([a, b], i) => {
    const pa = positions.at(a);
    const pb = positions.at(b);
    if (!pa || !pb) return;

    // compute endpoint offset so line ends at circle perimeter, not centre
    const dx = pb.x - pa.x;
    const dy = pb.y - pa.y;
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / dist;
    const uy = dy / dist;
    const r = NODE_RADIUS + 1;

    const isSelected =
      state.selectedNode !== null && (state.selectedNode === a || state.selectedNode === b);
    const isDimmed = state.selectedNode !== null && !isSelected;

    const x1 = pa.x + ux * r;
    const y1 = pa.y + uy * r;
    const x2 = pb.x - ux * r;
    const y2 = pb.y - uy * r;

    const edgeColor = resolveColor(data.line_color, i, DEFAULT_EDGE_COLOR);
    const opacity = isDimmed
      ? EDGE_OPACITY_DIMMED
      : isSelected
        ? EDGE_OPACITY_SELECTED
        : EDGE_OPACITY_DEFAULT;
    const strokeWidth = isSelected ? EDGE_WIDTH_SELECTED : EDGE_WIDTH_DEFAULT;

    const line = document.createElementNS(svgNS, 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', isSelected ? '#f0a500' : edgeColor);
    line.setAttribute('stroke-width', strokeWidth);
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('opacity', opacity);
    if (directed) line.setAttribute('marker-end', 'url(#arrowhead)');
    svg.appendChild(line);
    edgeEls.push(line);
  });

  // ── nodes ────────────────────────────────────────────────────────────────
  positions.forEach((pos, i) => {
    const isHovered = state.hoveredNode === i;
    const isSelected = state.selectedNode === i;
    const nodeColor = resolveColor(data.qubit_color, i, DEFAULT_NODE_COLOR);
    const r = isHovered ? HOVER_RADIUS : NODE_RADIUS;
    const fill = isHovered || isSelected ? HOVER_COLOR : nodeColor;

    const circle = document.createElementNS(svgNS, 'circle');
    circle.setAttribute('cx', pos.x);
    circle.setAttribute('cy', pos.y);
    circle.setAttribute('r', r);
    circle.setAttribute('fill', fill);
    circle.setAttribute('stroke', isSelected ? '#f0a500' : '#ffffff');
    circle.setAttribute('stroke-width', isSelected ? 3 : 1.5);
    circle.style.cursor = 'pointer';
    svg.appendChild(circle);

    const label = document.createElementNS(svgNS, 'text');
    label.setAttribute('x', pos.x);
    label.setAttribute('y', pos.y + 4); // approx vertical center
    label.setAttribute('text-anchor', 'middle');
    label.setAttribute('fill', '#ffffff');
    label.setAttribute('font-size', '11');
    label.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
    label.setAttribute('font-weight', 'bold');
    label.setAttribute('pointer-events', 'none');
    label.textContent = labels.at(i) !== undefined ? labels.at(i) : String(i);
    svg.appendChild(label);
  });

  container.appendChild(svg);
  return { svg, edgeEls };
}

// ─── interaction wiring ──────────────────────────────────────────────────────

function attachInteractions(container, data, positions, onStatsUpdate) {
  const state = { hoveredNode: null, selectedNode: null };

  function redraw() {
    render(container, data, positions, state);
    // re-attach after every redraw (innerHTML was replaced)
    attachSvgEvents();
  }

  function attachSvgEvents() {
    const svg = container.querySelector('svg');
    if (!svg) return;
    const circles = svg.querySelectorAll('circle');

    circles.forEach((circle, i) => {
      circle.addEventListener('mouseenter', () => {
        state.hoveredNode = i;
        redraw();
      });
      circle.addEventListener('mouseleave', () => {
        state.hoveredNode = null;
        redraw();
      });
      circle.addEventListener('click', (ev) => {
        ev.stopPropagation();
        state.selectedNode = state.selectedNode === i ? null : i;
        redraw();
      });
    });

    // click on empty SVG background deselects
    svg.addEventListener('click', () => {
      state.selectedNode = null;
      redraw();
    });
  }

  // initial draw
  render(container, data, positions, state);
  attachSvgEvents();

  if (onStatsUpdate) {
    onStatsUpdate({
      qubits: (data.qubit_coordinates || []).length,
      connections: (data.coupling_map || []).length,
    });
  }

  // responsive resize
  if (typeof window !== 'undefined') {
    if (container.__qpu_resize_handler) {
      window.removeEventListener('resize', container.__qpu_resize_handler);
    }
    const handler = () => {
      if (container.__qpu_resize_timer) clearTimeout(container.__qpu_resize_timer);
      container.__qpu_resize_timer = setTimeout(redraw, 160);
    };
    container.__qpu_resize_handler = handler;
    window.addEventListener('resize', handler);
  }
}

// ─── public API ─────────────────────────────────────────────────────────────

const QPUCircuitVisualizer = {
  /**
   * Primary entry point.
   * Loads JSON from `jsonPath`, computes the coupling-map layout, renders SVG,
   * and attaches hover + click interactions.
   * Calls onStatsUpdate({ qubits, connections }) when data is ready.
   */
  renderFromJson: async function (container, jsonPath, onStatsUpdate) {
    try {
      const data = await loadCircuitData(jsonPath);
      const { positions } = computeLayout(data);
      attachInteractions(container, data, positions, onStatsUpdate);
    } catch (e) {
      container.innerHTML = `<span style="color:red">QPU visualizer error: ${e.message}</span>`;
    }
  },

  /**
   * Synchronous alternative — accepts a pre-loaded data object.
   * Use this when the JSON is bundled via import to avoid proxy issues.
   */
  renderFromData: function (container, data, onStatsUpdate) {
    try {
      const { positions } = computeLayout(data);
      attachInteractions(container, data, positions, onStatsUpdate);
    } catch (e) {
      container.innerHTML = `<span style="color:red">QPU visualizer error: ${e.message}</span>`;
    }
  },

  /**
   * Legacy shim — kept so any existing callers of render(container, components) still work.
   * Converts the old `components` format (id, position[0..1], neighbors) into the JSON schema
   * and delegates to the new renderer.
   */
  render: function (container, components) {
    // Build a minimal JSON-shaped object from the legacy components array
    const numQubits = components.length;
    // positions were normalised 0..1; spread to a grid approximation for display
    const qubitCoordinates = components.map((c) => {
      // convert normalised [x,y] back to approximate integer grid
      const col = Math.round((c.position[0] || 0) * 10);
      const row = Math.round((c.position[1] || 0) * 10);
      return [row, col];
    });
    const seenEdges = new Set();
    const couplingMap = [];
    components.forEach((c, i) => {
      (c.neighbors || []).forEach((nid) => {
        const j = components.findIndex((x) => x.id === nid);
        if (j === -1) return;
        const key = [Math.min(i, j), Math.max(i, j)].join('-');
        if (!seenEdges.has(key)) {
          seenEdges.add(key);
          couplingMap.push([i, j]);
        }
      });
    });
    const data = {
      num_qubits: numQubits,
      qubit_labels: components.map((c) => String(c.id)),
      qubit_coordinates: qubitCoordinates,
      coupling_map: couplingMap,
      qubit_color: [],
      line_color: [],
      plot_directed: false,
    };
    const { positions } = computeLayout(data);
    attachInteractions(container, data, positions, null);
  },
};

if (typeof window !== 'undefined') {
  window.QPUCircuitVisualizer = QPUCircuitVisualizer;
}

export default QPUCircuitVisualizer;
