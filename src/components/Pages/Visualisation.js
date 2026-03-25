// Visualisation tab component
import React, { useEffect, useRef, useState } from 'react';
import ContentCard from '@components/UI/Card/ContentCard';
import QPUCircuitVisualizer from '@utils/qpuCircuitVisualizer';
import couplingMapData from '@data/coupling-map.json';
import './Visualisation.scss';

/** QPU Visualisation Tab — renders QPU coupling-map circuit visualizer */
function Visualisation() {
  const containerRef = useRef(null);
  const [stats, setStats] = useState({ qubits: 0, connections: 0 });

  useEffect(() => {
    const containerEl = containerRef.current;
    if (!containerEl) return;

    QPUCircuitVisualizer.renderFromData(containerEl, couplingMapData, (s) => setStats(s));

    return () => {
      if (containerEl) containerEl.innerHTML = '';
      if (containerEl && containerEl.__qpu_resize_handler) {
        window.removeEventListener('resize', containerEl.__qpu_resize_handler);
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
          width: '100%',
          margin: '0 auto',
          background: '#fff',
          border: '2px solid #888',
          borderRadius: 8,
          position: 'relative',
          overflowX: 'auto',
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
