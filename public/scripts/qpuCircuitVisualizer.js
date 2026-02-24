// QPU Circuit Visualizer Module
// This module renders a QPU circuit visualization in a container element.
// Usage: QPUCircuitVisualizer.render(container, components)

const QPUCircuitVisualizer = {
  // QPU Circuit Visualizer Module (public copy)
  // This module renders a QPU circuit visualization in a container element.
  // Usage: QPUCircuitVisualizer.render(container, components)

  if (!window.QPUCircuitVisualizer) {
    const QPUCircuitVisualizer = {
      render: function(container, components) {
        container.innerHTML = '';
        container.style.position = 'relative';
        const width = container.offsetWidth || 400;
        const height = container.offsetHeight || 320;
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', width);
        svg.setAttribute('height', height);
        svg.style.display = 'block';
        svg.style.margin = '0 auto';
        svg.style.border = 'none';
        let rendered = false;
        const tooltip = document.createElement('div');
        tooltip.style.position = 'absolute';
        tooltip.style.background = '#fff';
        tooltip.style.border = '1px solid #888';
        tooltip.style.padding = '4px 8px';
        tooltip.style.display = 'none';
        tooltip.style.pointerEvents = 'none';
        tooltip.style.fontSize = '14px';
        tooltip.style.zIndex = 10;
        // Draw a faint grid for reference
        for (let gx = 0; gx <= width; gx += 40) {
          const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
          gridLine.setAttribute('x1', gx);
          gridLine.setAttribute('y1', 0);
          gridLine.setAttribute('x2', gx);
          gridLine.setAttribute('y2', height);
          // QPU Circuit Visualizer Module (public copy)
          // This module renders a QPU circuit visualization in a container element.
          // Usage: QPUCircuitVisualizer.render(container, components)

          if (!window.QPUCircuitVisualizer) {
            const QPUCircuitVisualizer = {
              render: function(container, components) {
                container.innerHTML = '';
                container.style.position = 'relative';
                const width = container.offsetWidth || 400;
                const height = container.offsetHeight || 320;
                const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
                svg.setAttribute('width', width);
                svg.setAttribute('height', height);
                svg.style.display = 'block';
                svg.style.margin = '0 auto';
                svg.style.border = 'none';
                let rendered = false;
                const tooltip = document.createElement('div');
                tooltip.style.position = 'absolute';
                tooltip.style.background = '#fff';
                tooltip.style.border = '1px solid #888';
                tooltip.style.padding = '4px 8px';
                tooltip.style.display = 'none';
                tooltip.style.pointerEvents = 'none';
                tooltip.style.fontSize = '14px';
                tooltip.style.zIndex = 10;
                // Draw a faint grid for reference
                for (let gx = 0; gx <= width; gx += 40) {
                  const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                  gridLine.setAttribute('x1', gx);
                  gridLine.setAttribute('y1', 0);
                  gridLine.setAttribute('x2', gx);
                  gridLine.setAttribute('y2', height);
                  gridLine.setAttribute('stroke', '#eee');
                  gridLine.setAttribute('stroke-width', '1');
                  svg.appendChild(gridLine);
                }
                for (let gy = 0; gy <= height; gy += 40) {
                  const gridLine = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                  gridLine.setAttribute('x1', 0);
                  gridLine.setAttribute('y1', gy);
                  gridLine.setAttribute('x2', width);
                  gridLine.setAttribute('y2', gy);
                  gridLine.setAttribute('stroke', '#eee');
                  gridLine.setAttribute('stroke-width', '1');
                  svg.appendChild(gridLine);
                }
                // Draw lines first (so they appear under circles)
                components.forEach(comp => {
                  comp.neighbors.forEach(nid => {
                    const neighbor = components.find(c => c.id === nid);
                    if (neighbor) {
                      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                      line.setAttribute('x1', comp.position[0] * width);
                      line.setAttribute('y1', comp.position[1] * height);
                      line.setAttribute('x2', neighbor.position[0] * width);
                      line.setAttribute('y2', neighbor.position[1] * height);
                      line.setAttribute('stroke', '#888');
                      line.setAttribute('stroke-width', '3');
                      svg.appendChild(line);
                    }
                  });
                });
                // Draw circles on top
                components.forEach(comp => {
                  let color = comp.type === 'qubit' ? '#4A90E2' : '#E94E77';
                  const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                  circle.setAttribute('cx', comp.position[0] * width);
                  circle.setAttribute('cy', comp.position[1] * height);
                  circle.setAttribute('r', 20);
                  circle.setAttribute('fill', color);
                  circle.setAttribute('stroke', '#333');
                  circle.setAttribute('stroke-width', '2');
                  circle.addEventListener('mouseenter', () => {
                    tooltip.style.display = 'block';
                    tooltip.textContent = `${comp.type} (${comp.id})`;
                    tooltip.style.left = (comp.position[0] * width + 25) + 'px';
                    tooltip.style.top = (comp.position[1] * height - 10) + 'px';
                  });
                  circle.addEventListener('mouseleave', () => {
                    tooltip.style.display = 'none';
                  });
                  svg.appendChild(circle);
                  rendered = true;
                });
                container.appendChild(svg);
                container.appendChild(tooltip);
                if (!rendered) {
                  container.innerHTML = '<span style="color:red">QPU visualizer failed to render any components.</span>';
                }
              }
            };

            window.QPUCircuitVisualizer = QPUCircuitVisualizer;
          } else {
            console.warn('QPUCircuitVisualizer already defined — skipping duplicate load.');
          }
