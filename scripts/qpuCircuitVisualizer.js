// QPU Circuit Visualizer Module
// This module renders a QPU circuit visualization in a container element.
// Usage: QPUCircuitVisualizer.render(container, components)

if (!window.QPUCircuitVisualizer) {
  const QPUCircuitVisualizer = {
    render: function (container, components) {
      // Clear container
      container.innerHTML = '';
      // Create SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '400');
      svg.setAttribute('height', '300');
      svg.style.border = '1px solid #ccc';
      // Render components
      components.forEach((comp) => {
        let color = comp.type === 'qubit' ? '#4A90E2' : '#E94E77';
        // Draw node
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', comp.position[0] * 400);
        circle.setAttribute('cy', comp.position[1] * 300);
        circle.setAttribute('r', 20);
        circle.setAttribute('fill', color);
        circle.setAttribute('stroke', '#333');
        circle.setAttribute('stroke-width', '2');
        // Tooltip
        circle.addEventListener('mouseenter', () => {
          tooltip.style.display = 'block';
          tooltip.textContent = `${comp.type} (${comp.id})`;
          tooltip.style.left = comp.position[0] * 400 + 25 + 'px';
          tooltip.style.top = comp.position[1] * 300 - 10 + 'px';
        });
        circle.addEventListener('mouseleave', () => {
          tooltip.style.display = 'none';
        });
        svg.appendChild(circle);
      });
      // Draw edges
      components.forEach((comp) => {
        comp.neighbors.forEach((nid) => {
          const neighbor = components.find((c) => c.id === nid);
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
      // Tooltip
      const tooltip = document.createElement('div');
      tooltip.style.position = 'absolute';
      tooltip.style.background = '#fff';
      tooltip.style.border = '1px solid #888';
      tooltip.style.padding = '4px 8px';
      tooltip.style.display = 'none';
      tooltip.style.pointerEvents = 'none';
      tooltip.style.fontSize = '14px';
      container.style.position = 'relative';
      container.appendChild(svg);
      container.appendChild(tooltip);
    },
  };

  window.QPUCircuitVisualizer = QPUCircuitVisualizer;
} else {
  console.warn('QPUCircuitVisualizer already defined — skipping duplicate load.');
}
