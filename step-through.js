(function () {
  // Mark each step group in SVG with data-step="N" starting at 1.
  // e.g. <g data-step="1">...</g>
  const steps = Array.from(document.querySelectorAll('[data-step]'))
    .sort((a, b) => +a.dataset.step - +b.dataset.step);

  steps.forEach(el => {
    el.style.opacity = '0';
    el.style.transition = 'opacity 0.4s ease';
  });

  let current = 0;

  const hint = document.createElement('div');
  hint.style.cssText = [
    'position:fixed', 'bottom:24px', 'right:24px',
    "font:600 12px 'Inter',sans-serif", 'color:#9E9E9E',
    'background:#FFF', 'border:1px solid #E0E0E0',
    'padding:8px 14px', 'border-radius:20px',
    'box-shadow:0 2px 8px rgba(0,0,0,.08)',
    'cursor:pointer', 'user-select:none', 'z-index:100',
  ].join(';');
  hint.textContent = `Click to start (${steps.length} steps)`;
  document.body.appendChild(hint);

  function advance() {
    if (current >= steps.length) return;
    steps[current].style.opacity = '1';
    current++;
    hint.textContent = current < steps.length
      ? `Step ${current} / ${steps.length} — click to continue`
      : '✓ Complete — click to restart';
  }

  hint.addEventListener('click', () => {
    if (current >= steps.length) {
      steps.forEach(el => { el.style.opacity = '0'; });
      current = 0;
      hint.textContent = `Click to start (${steps.length} steps)`;
      return;
    }
    advance();
  });
})();
