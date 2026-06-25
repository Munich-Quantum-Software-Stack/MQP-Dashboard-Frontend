/*
  Public QPU visualizer (static page helper).
  - Provides `window.QPUCircuitVisualizer.render(container, components)`.
  - Lightweight renderer for static pages; React host handles richer UI (legend, export).
*/

const QPUCircuitVisualizer = {
  render(container, components) {
    container.innerHTML = '';

    // SVG canvas
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', '400');
    svg.setAttribute('height', '300');
    svg.style.border = '1px solid #ccc';

    // Tooltip element used by node hover handlers
    const tooltip = document.createElement('div');
    tooltip.style.position = 'absolute';
    tooltip.style.background = '#fff';
    tooltip.style.border = '1px solid #888';
    tooltip.style.padding = '4px 8px';
    tooltip.style.display = 'none';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.fontSize = '14px';

    // Compute basic stats: qubit count and unique undirected connections
    const qubitCount = (components || []).filter((c) => c.type === 'qubit').length;
    const connSet = new Set();
    (components || []).forEach((c) => {
      (c.neighbors || []).forEach((nid) => {
        const key = [c.id, nid].sort().join('--');
        connSet.add(key);
      });
    });
    const connectionsCount = connSet.size;

    // Wrapper to keep tooltip positioned relative to the svg
    const wrapper = document.createElement('div');
    wrapper.style.display = 'inline-block';
    wrapper.style.position = 'relative';
    wrapper.style.width = `${svg.getAttribute('width')}px`;
    wrapper.style.height = `${svg.getAttribute('height')}px`;

    // Render nodes (circles) and attach hover handlers
    (components || []).forEach((comp) => {
      const color = comp.type === 'qubit' ? '#4A90E2' : '#E94E77';
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      circle.setAttribute('cx', comp.position[0] * 400);
      circle.setAttribute('cy', comp.position[1] * 300);
      circle.setAttribute('r', 20);
      circle.setAttribute('fill', color);
      circle.setAttribute('stroke', '#333');
      circle.setAttribute('stroke-width', '2');
      circle.addEventListener('mouseenter', () => {
        tooltip.style.display = 'block';
        tooltip.textContent = `${comp.type} (${comp.id})`;
        tooltip.style.left = `${comp.position[0] * 400 + 25}px`;
        tooltip.style.top = `${comp.position[1] * 300 - 10}px`;
      });
      circle.addEventListener('mouseleave', () => {
        tooltip.style.display = 'none';
      });
      svg.appendChild(circle);
    });

    // Render undirected links underneath the nodes
    (components || []).forEach((comp) => {
      (comp.neighbors || []).forEach((nid) => {
        const neighbor = (components || []).find((c) => c.id === nid);
        if (neighbor) {
          const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          line.setAttribute('x1', comp.position[0] * 400);
          line.setAttribute('y1', comp.position[1] * 300);
          line.setAttribute('x2', neighbor.position[0] * 400);
          line.setAttribute('y2', neighbor.position[1] * 300);
          line.setAttribute('stroke', '#888');
          line.setAttribute('stroke-width', '3');
          svg.appendChild(line);
        }
      });
    });

    // Append elements and expose stats on the container node for callers
    wrapper.appendChild(svg);
    wrapper.appendChild(tooltip);
    container.style.position = 'relative';
    container.appendChild(wrapper);
    container.dataset.qpuQubits = String(qubitCount);
    container.dataset.qpuConnections = String(connectionsCount);

    // Create a minimal legend overlay used by static pages (React host will typically render its own)
    let legend = document.getElementById('qpu-legend-overlay');
    if (!legend) {
      legend = document.createElement('div');
      legend.id = 'qpu-legend-overlay';
      legend.style.minWidth = '140px';
      legend.style.background = '#fff';
      legend.style.padding = '10px 12px';
      legend.style.borderRadius = '8px';
      legend.style.boxShadow = '0 2px 8px rgba(0,0,0,0.12)';
      legend.style.border = '1px solid rgba(0,0,0,0.08)';
      legend.style.color = '#000';
      legend.style.fontSize = '13px';
      legend.innerHTML =
        '<div style="font-weight:700;color:#007bff;margin-bottom:8px;font-size:14px">Legend</div>' +
        '<div style="display:flex;align-items:center;gap:8px;color:#000"><div style="width:14px;height:14px;background:#4A90E2;border-radius:50%;border:2px solid #333"></div><div>Qubit</div></div>' +
        '<div style="display:flex;align-items:center;gap:8px;margin-top:8px;color:#000"><div style="width:22px;height:6px;background:#888;border-radius:2px"></div><div>Connection</div></div>';
    }

    // Remove previous overlay then attempt to position legend near the page's info card
    const existing = document.getElementById('qpu-legend-overlay');
    if (existing) existing.remove();

    function positionLegendUnderCard(card) {
      const rect = card.getBoundingClientRect();
      legend.style.position = 'absolute';
      legend.style.visibility = 'hidden';
      legend.style.left = '0px';
      legend.style.top = '0px';
      document.body.appendChild(legend);
      const legendWidth = legend.offsetWidth || 160;
      const vw = window.innerWidth || document.documentElement.clientWidth;
      const cardCenter = rect.left + rect.width / 2 + window.scrollX;
      let left = Math.round(cardCenter - legendWidth / 2);
      const margin = 8;
      if (left < margin + window.scrollX) left = margin + window.scrollX;
      if (left + legendWidth > vw - margin + window.scrollX)
        left = vw - legendWidth - margin + window.scrollX;
      const top = Math.round(rect.bottom + 8 + window.scrollY);
      legend.style.left = `${left}px`;
      legend.style.top = `${top}px`;
      legend.style.visibility = 'visible';
      legend.style.right = 'auto';
      legend.style.zIndex = '10000';
    }

    const findCard = () =>
      Array.from(document.querySelectorAll('div')).find((el) => {
        try {
          const txt = (el.textContent || '').trim();
          const s = (el.getAttribute && el.getAttribute('style')) || '';
          return (
            txt.includes('Qubits') &&
            txt.includes('Connections') &&
            (s.includes('min-width: 140px') || el.style.minWidth === '140px')
          );
        } catch (e) {
          return false;
        }
      });

    const cardNow = findCard();
    if (cardNow) {
      positionLegendUnderCard(cardNow);
    } else {
      const obs = new MutationObserver((mutations, observer) => {
        const card = findCard();
        if (card) {
          positionLegendUnderCard(card);
          observer.disconnect();
        }
      });
      obs.observe(document.body, { childList: true, subtree: true });
      setTimeout(() => {
        if (!document.getElementById('qpu-legend-overlay')) {
          legend.style.position = 'absolute';
          legend.style.left = '50%';
          legend.style.transform = 'translateX(-50%)';
          legend.style.top = 'calc(100% + 12px)';
          wrapper.appendChild(legend);
        }
      }, 3000);
    }
  },
};

window.QPUCircuitVisualizer = QPUCircuitVisualizer;
