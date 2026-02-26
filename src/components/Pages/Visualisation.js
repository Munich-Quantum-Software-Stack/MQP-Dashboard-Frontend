// Visualisation tab component already created
import React, { useLayoutEffect, useRef, useState } from 'react';
import ContentCard from '@components/UI/Card/ContentCard';
import './Visualisation.scss';
// allow dynamic object access in this helper/visualizer glue code
// prefer project alias imports, but tests resolve relative paths; use relative import
// eslint-disable-next-line import/no-unresolved, no-restricted-imports
// allow dynamic object access in this helper/visualizer glue code
// eslint-disable-next-line import/no-unresolved, no-restricted-imports
import '../../utils/qpuCircuitVisualizer';

/** QPU Visualisation Tab - renders QPU circuit visualizer */
function Visualisation() {
  const containerRef = useRef(null);
  const [stats, setStats] = useState({ qubits: 0, connections: 0 });

  useLayoutEffect(() => {
    // Remove duplicate QPU visualizer containers
    const allContainers = document.querySelectorAll('#qpu-visualizer-container');
    if (allContainers.length > 1) {
      for (let i = 1; i < allContainers.length; i++) {
        allContainers[i].parentNode && allContainers[i].parentNode.removeChild(allContainers[i]);
      }
    }
    let didRender = false;
    let renderAttempts = 0;
    async function renderQPU() {
      // Try the ref first, then fallback to querying by id. Retry a few times if not found.
      let containerEl = containerRef.current || document.getElementById('qpu-visualizer-container');
      if (!containerEl && renderAttempts < 10) {
        renderAttempts += 1;
        setTimeout(renderQPU, 50);
        return;
      }
      if (!containerEl) {
        console.warn('[QPU DEBUG] could not find visualizer container after retries');
        return;
      }
      // Try to load an IQM-style layout from `public/data/iqm-layout.json`.
      // If present, convert to the visualiser `components` format (positions normalized to 0..1).
      // Otherwise fall back to generating a 5x4 grid with random links (as before).
      let components = [];
      async function loadLayoutOrFallback() {
        // helper: normalize absolute coordinates to 0..1
        function normalizePoints(nodes) {
          const xs = nodes.map((n) => n.x);
          const ys = nodes.map((n) => n.y);
          const xmin = Math.min(...xs);
          const xmax = Math.max(...xs);
          const ymin = Math.min(...ys);
          const ymax = Math.max(...ys);
          const dx = xmax - xmin || 1;
          const dy = ymax - ymin || 1;
          return nodes.map((n) => ({
            id: String(n.id),
            x: (n.x - xmin) / dx,
            y: (n.y - ymin) / dy,
          }));
        }

        try {
          // Try several locations to avoid dev-server proxy collisions (some servers proxy /data/* paths)
          const tryUrls = [
            '/data/iqm-layout.json',
            '/iqm-layout.json',
            '/public/data/iqm-layout.json',
          ];
          let res = null;
          for (const url of tryUrls) {
            try {
              res = await fetch(url, { cache: 'no-store' });
              if (res && res.ok) {
                break;
              }
            } catch (_) {
              // ignore and try next
            }
            res = null;
          }
          if (res && res.ok) {
            const iqm = await res.json();
            // common field names fallback handling
            const nodes = iqm.qubits || iqm.nodes || iqm.points || [];
            const couplers = iqm.couplers || iqm.edges || iqm.connections || [];
            if (nodes.length > 0) {
              const norm = normalizePoints(
                nodes.map((n) => ({
                  id: n.id ?? n.name ?? n.index ?? n.label ?? n.qubitId,
                  x: n.x ?? n.coord_x ?? n.cx ?? n[0],
                  y: n.y ?? n.coord_y ?? n.cy ?? n[1],
                })),
              );
              // create components with neighbors from couplers
              const compById = new Map(
                norm.map((p) => [
                  String(p.id),
                  { id: String(p.id), type: 'qubit', position: [p.x, p.y], neighbors: [] },
                ]),
              );
              for (const e of couplers) {
                const a = String(e[0]);
                const b = String(e[1]);
                if (compById.has(a) && compById.has(b)) {
                  const ca = compById.get(a);
                  const cb = compById.get(b);
                  if (!ca.neighbors.includes(b)) ca.neighbors.push(b);
                  if (!cb.neighbors.includes(a)) cb.neighbors.push(a);
                }
              }
              components = Array.from(compById.values());
              // IQM layout loaded; components prepared
              return;
            }
          }
        } catch (e) {
          console.warn('[QPU DEBUG] Could not load /data/iqm-layout.json:', e.message);
        }

        // Fallback: generate 20 qubits arranged in a square grid (5 rows x 4 cols)
        const rows = 5;
        const cols = 4;
        const margin = 0.1; // keep nodes away from edges
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            const x = cols > 1 ? margin + (c / (cols - 1)) * (1 - 2 * margin) : 0.5;
            const y = rows > 1 ? margin + (r / (rows - 1)) * (1 - 2 * margin) : 0.5;
            components.push({
              id: `q${i + 1}`,
              type: 'qubit',
              position: [x, y],
              neighbors: [],
            });
          }
        }
        // Add random connections (1-3 neighbors per node), undirected
        function addUndirected(aId, bId) {
          const a = components.find((c) => c.id === aId);
          const b = components.find((c) => c.id === bId);
          if (!a || !b || aId === bId) return;
          if (!a.neighbors.includes(bId)) a.neighbors.push(bId);
          if (!b.neighbors.includes(aId)) b.neighbors.push(aId);
        }
        for (let i = 0; i < components.length; i++) {
          const comp = components[i];
          const want = 1 + Math.floor(Math.random() * 3); // 1..3 neighbors
          let attempts = 0;
          while (comp.neighbors.length < want && attempts < 20) {
            const targetIdx = Math.floor(Math.random() * components.length);
            const targetId = components[targetIdx].id;
            addUndirected(comp.id, targetId);
            attempts += 1;
          }
        }
      }

      // load layout (async) then render
      await loadLayoutOrFallback();

      // Defensive: if layout failed to produce components, ensure we have a fallback set
      if (!components || components.length === 0) {
        console.warn('[QPU DEBUG] components empty after layout load — generating fallback grid');
        components = [];
        const rows = 5;
        const cols = 4;
        const margin = 0.1;
        for (let r = 0; r < rows; r++) {
          for (let c = 0; c < cols; c++) {
            const i = r * cols + c;
            const x = cols > 1 ? margin + (c / (cols - 1)) * (1 - 2 * margin) : 0.5;
            const y = rows > 1 ? margin + (r / (rows - 1)) * (1 - 2 * margin) : 0.5;
            components.push({ id: `q${i + 1}`, type: 'qubit', position: [x, y], neighbors: [] });
          }
        }
        function addUndirectedFallback(aId, bId) {
          const a = components.find((c) => c.id === aId);
          const b = components.find((c) => c.id === bId);
          if (!a || !b || aId === bId) return;
          if (!a.neighbors.includes(bId)) a.neighbors.push(bId);
          if (!b.neighbors.includes(aId)) b.neighbors.push(aId);
        }
        for (let i = 0; i < components.length; i++) {
          const comp = components[i];
          const want = 1 + Math.floor(Math.random() * 3);
          let attempts = 0;
          while (comp.neighbors.length < want && attempts < 20) {
            const targetIdx = Math.floor(Math.random() * components.length);
            addUndirectedFallback(comp.id, components[targetIdx].id);
            attempts += 1;
          }
        }
      }
      // 1. Check that the visualizer script is loaded
      // Visualizer loaded and data ready
      // cleanup any legacy legend overlays injected by older visualizer builds
      try {
        const containerNode = containerEl;
        const legacyLegend =
          containerNode &&
          containerNode.querySelector &&
          containerNode.querySelector('[data-qpu-legend]');
        if (legacyLegend && legacyLegend.remove) legacyLegend.remove();
        // remove any global overlay id from previous scripts
        const globalLegend = document.getElementById('qpu-legend-overlay');
        if (globalLegend && globalLegend.remove) globalLegend.remove();
      } catch (e) {
        /* ignore */
      }
      // 4. Manually test SVG rendering if visualizer not ready
      if (window.QPUCircuitVisualizer) {
        try {
          window.QPUCircuitVisualizer.render(containerEl, components);
          didRender = true;
        } catch (e) {
          containerEl.innerHTML =
            '<span style="color:red">QPU visualizer render error: ' + e.message + '</span>';
          console.error('[QPU DEBUG] QPU visualizer render error:', e);
        }
      } else if (containerEl) {
        // Fallback: render a simple SVG to confirm container is visible
        containerEl.innerHTML =
          '<svg width="100" height="100"><circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" /></svg><div style="color:red">QPU visualizer not ready. Fallback SVG rendered.</div>';
        console.warn('[QPU DEBUG] QPU visualizer not ready. Fallback SVG rendered.');
      }
      // 5. Check CSS
      // update stat counts: qubits and unique connections
      const qubits = components.length;
      // connections counted as undirected edges: sum neighbor counts / 2
      const totalNeighborRefs = components.reduce(
        (s, c) => s + (c.neighbors ? c.neighbors.length : 0),
        0,
      );
      const connections = Math.floor(totalNeighborRefs / 2);
      setStats({ qubits, connections });
      // stats updated

      // 5. Check CSS
      if (containerRef.current) {
        const style = window.getComputedStyle(containerRef.current);
        if (
          style.display === 'none' ||
          style.opacity === '0' ||
          style.width === '0px' ||
          style.height === '0px'
        ) {
          console.warn('[QPU DEBUG] Container may be hidden or have zero size.');
        }
        // Ensure default background (don't overwrite site styling)
        containerRef.current.style.background = '';
      }
    }
    if (window.QPUCircuitVisualizer) {
      renderQPU();
    } else {
      // The visualizer module is bundled and imported above.
      // If it's not present here, show a helpful message.
      if (containerRef.current) {
        containerRef.current.innerHTML =
          '<span style="color:red">QPU visualizer not available.</span>';
      }
    }
    // Fix: copy ref to variable for cleanup (may be null)
    const container = containerRef.current || document.getElementById('qpu-visualizer-container');
    return () => {
      if (container && !didRender) {
        container.innerHTML = '';
      }
    };
  }, []);

  return (
    <ContentCard className="visualisation_container h-100" style={{ position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start' }}>
        <h2 style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>QPU Circuit Visualisation</h2>
      </div>
      {/* Simple top-right legend */}
      <div style={{ position: 'absolute', top: 12, right: 16, zIndex: 40 }}>
        <div
          style={{
            minWidth: 140,
            background: '#fff',
            padding: '10px 12px',
            borderRadius: 8,
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            border: '1px solid rgba(0,0,0,0.08)',
            color: '#000',
            fontSize: 13,
          }}
        >
          <div style={{ fontWeight: 700, marginBottom: 8, color: '#007bff', fontSize: 14 }}>
            Legend
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#000' }}>
            <div
              style={{
                width: 14,
                height: 14,
                background: '#4A90E2',
                borderRadius: '50%',
                border: '2px solid #333',
              }}
            />
            <div style={{ color: '#000' }}>Qubit</div>
          </div>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, color: '#000' }}
          >
            <div style={{ width: 22, height: 6, background: '#888', borderRadius: 2 }} />
            <div style={{ color: '#000' }}>Connection</div>
          </div>
        </div>
      </div>
      {/* ...existing FAQ and QPU image rendering here... */}
      <hr style={{ margin: '1.25rem 0', border: 0, borderTop: '2px solid #eee' }} />
      <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Interactive QPU Visualizer</div>
      <div
        id="qpu-visualizer-container"
        ref={containerRef}
        style={{
          minHeight: 320,
          maxWidth: 420,
          margin: '0 auto',
          background: '#fff',
          border: '2px solid #888',
          borderRadius: 8,
          position: 'relative',
        }}
      />
      {/* Render qubit and connection counts below the diagram (simple text) */}
      <div style={{ textAlign: 'center', marginTop: 12, color: '#000', fontSize: 15 }}>
        <span style={{ fontWeight: 600, color: '#000' }}>Qubits:</span>&nbsp;{stats.qubits}
        &nbsp;&nbsp;•&nbsp;&nbsp;
        <span style={{ fontWeight: 600, color: '#000' }}>Connections:</span>&nbsp;
        {stats.connections}
      </div>
    </ContentCard>
  );
}

export default Visualisation;
