// QPU Circuit Visualizer - ES module

const QPUCircuitVisualizer = {
  render: function (container, components) {
    container.innerHTML = '';
    container.style.position = 'relative';
    const width = Math.max(320, container.offsetWidth || 420);
    const height = Math.max(280, container.offsetHeight || 320);
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', width);
    svg.setAttribute('height', height);
    svg.style.display = 'block';
    svg.style.margin = '0 auto';

    const panGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    panGroup.style.transformOrigin = '0 0';
    panGroup.style.willChange = 'transform';
    let scale = 1;
    let tx = 0;
    let ty = 0;
    function applyTransform() {
      panGroup.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
    }
    applyTransform();
    svg.appendChild(panGroup);

    const pad = 18;
    const innerX = pad;
    const innerY = pad;
    const innerW = Math.max(80, width - pad * 2);
    const innerH = Math.max(80, height - pad * 2);

    const chip = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    chip.setAttribute('x', innerX);
    chip.setAttribute('y', innerY);
    chip.setAttribute('width', innerW);
    chip.setAttribute('height', innerH);
    chip.setAttribute('rx', 8);
    chip.setAttribute('ry', 8);
    chip.setAttribute('fill', '#f6f6f6');
    chip.setAttribute('stroke', '#cfcfcf');
    chip.setAttribute('stroke-width', '2');
    panGroup.appendChild(chip);

    const gridGap = Math.round(Math.min(innerW, innerH) / 6);
    for (let gx = innerX; gx <= innerX + innerW; gx += gridGap) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', gx);
      line.setAttribute('y1', innerY);
      line.setAttribute('x2', gx);
      line.setAttribute('y2', innerY + innerH);
      line.setAttribute('stroke', '#eee');
      line.setAttribute('stroke-width', '1');
      panGroup.appendChild(line);
    }
    for (let gy = innerY; gy <= innerY + innerH; gy += gridGap) {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('x1', innerX);
      line.setAttribute('y1', gy);
      line.setAttribute('x2', innerX + innerW);
      line.setAttribute('y2', gy);
      line.setAttribute('stroke', '#eee');
      line.setAttribute('stroke-width', '1');
      panGroup.appendChild(line);
    }

    function toPx(pos) {
      const nx = Math.min(1, Math.max(0, pos[0]));
      const ny = Math.min(1, Math.max(0, pos[1]));
      return [innerX + nx * innerW, innerY + ny * innerH];
    }

    const drawnEdges = new Set();
    const edgeMap = new Map();
    components.forEach((comp) => {
      (comp.neighbors || []).forEach((nid) => {
        const key = [comp.id, nid].sort().join('--');
        if (drawnEdges.has(key)) return;
        drawnEdges.add(key);
        const neighbor = components.find((c) => c.id === nid);
        if (!neighbor) return;
        const [x1, y1] = toPx(comp.position);
        const [x2, y2] = toPx(neighbor.position);
        const edge = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        edge.setAttribute('x1', x1);
        edge.setAttribute('y1', y1);
        edge.setAttribute('x2', x2);
        edge.setAttribute('y2', y2);
        edge.setAttribute('stroke', '#6f6f6f');
        edge.setAttribute('stroke-width', '4');
        edge.setAttribute('stroke-linecap', 'round');
        edge.setAttribute('opacity', '0.95');
        edge.setAttribute('data-edge-key', key);
        panGroup.appendChild(edge);
        edgeMap.set(key, edge);

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2;
        const coupler = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
        coupler.setAttribute('x', mx - 8);
        coupler.setAttribute('y', my - 4);
        coupler.setAttribute('width', 16);
        coupler.setAttribute('height', 8);
        coupler.setAttribute('rx', 2);
        coupler.setAttribute('ry', 2);
        coupler.setAttribute('fill', '#2d2d2d');
        coupler.setAttribute('opacity', '0.95');
        panGroup.appendChild(coupler);
      });
    });

    const nodeGroup = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    const nodeMap = new Map();

    const tooltip = document.createElement('div');
    tooltip.style.cssText =
      'position:fixed;pointer-events:none;background:rgba(255,255,255,0.98);border:1px solid rgba(0,0,0,0.08);padding:6px 8px;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,0.08);font-size:12px;display:none;z-index:9999;';

    components.forEach((comp) => {
      const [cx, cy] = toPx(comp.position);
      const size = 26;
      const fillColor = comp.fill || '#4A90E2';

      const outer = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      outer.setAttribute('x', cx - size / 2);
      outer.setAttribute('y', cy - size / 2);
      outer.setAttribute('width', size);
      outer.setAttribute('height', size);
      outer.setAttribute('rx', 6);
      outer.setAttribute('ry', 6);
      outer.setAttribute('fill', '#ffffff');
      outer.setAttribute('stroke', '#333333');
      outer.setAttribute('stroke-width', '2');
      nodeGroup.appendChild(outer);

      const q = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      q.setAttribute('cx', cx);
      q.setAttribute('cy', cy);
      q.setAttribute('r', 10);
      q.setAttribute('fill', fillColor);
      q.setAttribute('stroke', '#1f3550');
      q.setAttribute('stroke-width', '2');
      nodeGroup.appendChild(q);

      [
        [0, -1],
        [1, 0],
        [0, 1],
        [-1, 0],
      ].forEach((p) => {
        const pin = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        pin.setAttribute('cx', cx + p[0] * (size / 2 + 2));
        pin.setAttribute('cy', cy + p[1] * (size / 2 + 2));
        pin.setAttribute('r', 3);
        pin.setAttribute('fill', '#2d2d2d');
        nodeGroup.appendChild(pin);
      });

      const titleEl = document.createElementNS('http://www.w3.org/2000/svg', 'title');
      titleEl.textContent = comp.id;
      q.appendChild(titleEl);

      nodeMap.set(comp.id, { outer, circle: q, comp });

      const labelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
      labelEl.setAttribute('x', cx + size / 2 + 6);
      labelEl.setAttribute('y', cy + 4);
      labelEl.setAttribute('fill', '#222');
      labelEl.setAttribute('font-size', '12');
      labelEl.setAttribute('font-family', 'Arial, Helvetica, sans-serif');
      labelEl.setAttribute('pointer-events', 'none');
      labelEl.textContent = comp.id;
      nodeGroup.appendChild(labelEl);

      const onEnter = () => {
        outer.setAttribute('stroke', '#0056b3');
        q.setAttribute('fill', '#6fb3ff');
        q.setAttribute('r', 12);
        (comp.neighbors || []).forEach((nid) => {
          const el = edgeMap.get([comp.id, nid].sort().join('--'));
          if (el) {
            el.setAttribute('stroke', '#0056b3');
            el.setAttribute('stroke-width', '6');
          }
        });
        tooltip.style.display = 'block';
        tooltip.innerHTML = `<strong>${comp.id}</strong><div style="font-size:11px;color:#666">${comp.role || 'qubit'} &bull; Connections: ${(comp.neighbors || []).length}</div>`;
      };
      const onLeave = () => {
        outer.setAttribute('stroke', '#333333');
        q.setAttribute('fill', fillColor);
        q.setAttribute('r', 10);
        (comp.neighbors || []).forEach((nid) => {
          const el = edgeMap.get([comp.id, nid].sort().join('--'));
          if (el) {
            el.setAttribute('stroke', '#6f6f6f');
            el.setAttribute('stroke-width', '4');
          }
        });
        tooltip.style.display = 'none';
      };
      const onMove = (ev) => {
        tooltip.style.left = ev.clientX + 14 + 'px';
        tooltip.style.top = ev.clientY + 14 + 'px';
      };
      outer.addEventListener('mouseenter', onEnter);
      outer.addEventListener('mouseleave', onLeave);
      outer.addEventListener('mousemove', onMove);
      q.addEventListener('mouseenter', onEnter);
      q.addEventListener('mouseleave', onLeave);
    });

    panGroup.appendChild(nodeGroup);
    container.appendChild(svg);
    document.body.appendChild(tooltip);
    container.__qpu_tooltip = tooltip;

    (function attachPanZoom() {
      let isPanning = false;
      let lastX = 0;
      let lastY = 0;
      svg.addEventListener(
        'wheel',
        (ev) => {
          ev.preventDefault();
          const rect = svg.getBoundingClientRect();
          const mx = ev.clientX - rect.left;
          const my = ev.clientY - rect.top;
          const delta = ev.deltaY > 0 ? 0.9 : 1.1;
          const newScale = Math.min(3, Math.max(0.4, scale * delta));
          const ratio = newScale / scale;
          tx = mx - (mx - tx) * ratio;
          ty = my - (my - ty) * ratio;
          scale = newScale;
          applyTransform();
        },
        { passive: false },
      );
      svg.addEventListener('pointerdown', (ev) => {
        isPanning = true;
        lastX = ev.clientX;
        lastY = ev.clientY;
        svg.setPointerCapture && svg.setPointerCapture(ev.pointerId);
      });
      svg.addEventListener('pointermove', (ev) => {
        if (!isPanning) return;
        tx += ev.clientX - lastX;
        ty += ev.clientY - lastY;
        lastX = ev.clientX;
        lastY = ev.clientY;
        applyTransform();
      });
      const endPan = (ev) => {
        isPanning = false;
        try {
          svg.releasePointerCapture && svg.releasePointerCapture(ev.pointerId);
        } catch (e) {}
      };
      svg.addEventListener('pointerup', endPan);
      svg.addEventListener('pointercancel', endPan);
      svg.addEventListener('mouseleave', () => {
        isPanning = false;
      });
    })();

    if (container.__qpu_resize_handler) {
      window.removeEventListener('resize', container.__qpu_resize_handler);
    }
    const handler = () => {
      if (container.__qpu_resize_timer) clearTimeout(container.__qpu_resize_timer);
      container.__qpu_resize_timer = setTimeout(() => {
        QPUCircuitVisualizer.render(container, components);
      }, 160);
    };
    container.__qpu_resize_handler = handler;
    window.addEventListener('resize', handler);
  },

  renderFromData: function (container, data, onStats) {
    if (container.__qpu_tooltip) {
      container.__qpu_tooltip.remove();
      container.__qpu_tooltip = null;
    }

    const labels = data.qubit_labels || Array.from({ length: data.num_qubits }, (_, i) => `Q${i}`);
    const positions = data.qubit_positions;
    const roles = data.qubit_roles || [];
    const edges = data.coupling_map || [];

    const adj = new Map();
    labels.forEach((l) => adj.set(l, []));
    edges.forEach(([a, b]) => {
      adj.get(labels[a]).push(labels[b]);
      adj.get(labels[b]).push(labels[a]);
    });

    const components = labels.map((label, i) => ({
      id: label,
      position: positions[i],
      role: roles[i] || 'data',
      fill: roles[i] === 'ancilla' ? '#F5A623' : '#4A90E2',
      neighbors: adj.get(label),
    }));

    this.render(container, components);
    if (onStats) onStats({ qubits: labels.length, connections: edges.length });
  },
};

export default QPUCircuitVisualizer;
