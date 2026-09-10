// Minimal, safe public copy of QPUCircuitVisualizer used only by static pages.
(function () {
  if (!window.QPUCircuitVisualizer) {
    window.QPUCircuitVisualizer = {
      render(container /* components */) {
        if (!container) return;
        // Ensure container is present; render a harmless placeholder SVG if needed
        container.innerHTML = '';
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('width', container.offsetWidth || 200);
        svg.setAttribute('height', container.offsetHeight || 120);
        svg.setAttribute('aria-hidden', 'true');
        container.appendChild(svg);
      },
    };
  }
})();
