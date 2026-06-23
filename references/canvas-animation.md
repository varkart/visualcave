# Canvas Animation

Use when user chooses **Canvas** animation mode: full custom animation, no Mermaid. Output a standalone `.html` file using `Canvas 2D` + `requestAnimationFrame`.

## When to use

- "particles", "neural network", "physics simulation", "signal propagation"
- "living visual", "canvas animation"  
- Subject doesn't map to a Mermaid diagram type (narratives, abstract systems, scientific viz)

## HTML shell

```html
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>[Title]</title>
<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #0A0A0F; color: #E8E8F0; font-family: system-ui, sans-serif; overflow: hidden; }
canvas { display: block; width: 100vw; height: 100vh; }
.ui { position: fixed; top: 24px; left: 50%; transform: translateX(-50%);
      background: rgba(17,17,24,0.85); border: 1px solid #1e1e2a; border-radius: 12px;
      padding: 14px 24px; backdrop-filter: blur(8px); text-align: center; }
.ui h1 { font-size: 1rem; font-weight: 600; margin-bottom: 4px; }
.ui p  { font-size: 0.78rem; color: #555; }
</style>
</head>
<body>
<canvas id="c"></canvas>
<div class="ui"><h1>[Title]</h1><p>[Subtitle]</p></div>
<script>
const canvas = document.getElementById('c');
const ctx    = canvas.getContext('2d');
let W, H;

function resize() {
  W = canvas.width  = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// ── Your drawing logic here ──────────────────────
// Use requestAnimationFrame for the loop:

let last = 0;
function frame(ts) {
  const dt = Math.min((ts - last) / 1000, 0.05);
  last = ts;

  ctx.clearRect(0, 0, W, H);

  // draw here

  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
</script>
</body>
</html>
```

## Patterns

**Particle system:**
```javascript
const particles = Array.from({ length: 120 }, () => ({
  x: Math.random() * W, y: Math.random() * H,
  vx: (Math.random() - 0.5) * 60, vy: (Math.random() - 0.5) * 60,
  r: 2 + Math.random() * 2,
}));

function updateParticles(dt) {
  particles.forEach(p => {
    p.x += p.vx * dt; p.y += p.vy * dt;
    if (p.x < 0 || p.x > W) p.vx *= -1;
    if (p.y < 0 || p.y > H) p.vy *= -1;
  });
}

function drawParticles() {
  particles.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = '#60a5fa';
    ctx.fill();
  });
}

// Connection lines between nearby particles
function drawConnections(maxDist = 90) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < maxDist) {
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(96,165,250,${1 - d/maxDist})`;
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }
    }
  }
}
```

**Signal propagation (layer → layer):**
```javascript
// signals = [{ x, y, tx, ty, t, color, strength }]
// t goes 0→1 over `dur` seconds; on arrival, activate target node

function stepSignals(dt) {
  signals = signals.filter(s => {
    s.t = Math.min(1, s.t + dt / s.dur);
    if (s.t >= 1) { activateNode(s.targetIdx, s.strength); return false; }
    return true;
  });
}

function drawSignals() {
  signals.forEach(s => {
    const x = s.x + (s.tx - s.x) * s.t;
    const y = s.y + (s.ty - s.y) * s.t;
    ctx.beginPath();
    ctx.arc(x, y, 4 * s.strength, 0, Math.PI * 2);
    ctx.fillStyle = s.color;
    ctx.shadowColor = s.color;
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;
  });
}
```

**Glow effect:**
```javascript
// Before drawing glowing element:
ctx.shadowColor = '#60a5fa';
ctx.shadowBlur  = 16;
// ... draw shape ...
ctx.shadowBlur  = 0; // always reset after
```

## Rules

- No hardcoded pixel coordinates tied to fixed canvas size — derive from `W` and `H`.
- Always call `resize()` on `window.resize`.
- Cap `dt` at `0.05` to prevent spiral-of-death on tab hide/show.
- Always reset `ctx.shadowBlur = 0` after glowing elements.
- Include `@media (prefers-reduced-motion)` — set animation speed to 0 or show static frame.
