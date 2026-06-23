## Mermaid CSS Flow

Target Mermaid's rendered SVG classes after `mermaid.run()` completes. Use `<script type="module">` with ESM import.

**Key selectors:**

- Edges: `.edgePath path`, `path.flowchart-link`
- Nodes: `.node rect`, `.node circle`, `.node polygon`
- Clusters: `.cluster rect`

**Flowing edge animation:**

```css
.mermaid svg .edgePath path,
.mermaid svg path.flowchart-link {
  stroke-dasharray: 10 7 !important;
  stroke-dashoffset: 0;
  animation: edge-flow 1.8s linear infinite;
}
@keyframes edge-flow {
  from {
    stroke-dashoffset: 0;
  }
  to {
    stroke-dashoffset: -51;
  }
}
```

**Node glow + staggered reveal — must be triggered by JS after render** (CSS alone fires too early):

```javascript
import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
mermaid.initialize({ startOnLoad: false, theme: 'default' });
await mermaid.run({ nodes: [el] });

el.querySelectorAll('.node').forEach((n, i) => {
  n.style.setProperty('--reveal-delay', `${i * 0.12}s`);
  n.classList.add('revealed');
  if (i === 0) n.classList.add('is-entry');
});
```

```css
.mermaid svg .node.revealed {
  animation: node-reveal 0.55s ease forwards;
  animation-delay: var(--reveal-delay, 0s);
  opacity: 0;
}
@keyframes node-reveal {
  from {
    opacity: 0;
    transform: translateY(7px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.mermaid svg .node.is-entry rect {
  animation: breathe 3s ease-in-out infinite;
}
@keyframes breathe {
  0%,
  100% {
    filter: drop-shadow(0 0 0px rgba(251, 191, 36, 0));
  }
  50% {
    filter: drop-shadow(0 0 14px rgba(251, 191, 36, 0.8));
  }
}
```

Always include `@media (prefers-reduced-motion: reduce)` fallback (already in file below).

---

# Animated Variant

> **Scope note:** The CSS animation classes below (`draw`, `fade`, `fade-up`, `slide-in`, `pop`, `pulse`, `flow-dot`) are for **manual SVG diagrams only** — they require hand-authored `<g>` elements with class and `--delay` attributes. They do **not** work on Mermaid-generated output.
>
> For Mermaid diagrams, use the step-through reveal system (`[data-step]` + `setupSteps()` pattern from `examples/transformer-ultra.html`) or CSS targeting Mermaid's generated classes (`.node rect`, `.edgePath .path`). The marching-ants pattern in `examples/transformer-animated.html` is the Mermaid-native animation example.

Add CSS animations to make diagrams come alive. No JS required for the animated variant — pure CSS `@keyframes`. For step-through (click to advance), see the JS block at the bottom.

## When to use

- User says "animated", "animate it", "make it move"
- User says "step by step", "step-through", "interactive"
- User says "GIF" → generate animated HTML + tell them to run `capture.js`

---

## CSS to add inside `<style>`

```css
/* ─── SVG transform fix ─────────────────────────── */
svg * {
  transform-box: fill-box;
  transform-origin: center;
}

/* ─── 1. Arrow draw-on ──────────────────────────── */
/* Add class="draw" + style="--len:NNN; --delay:Xs" to every <line> or <path> */
/* --len: estimate pixel length. Straight line: sqrt((x2-x1)²+(y2-y1)²). Safe default: 600 */
.draw {
  stroke-dasharray: var(--len, 600);
  stroke-dashoffset: var(--len, 600);
  animation: draw var(--dur, 0.5s) ease forwards;
  animation-delay: var(--delay, 0s);
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* ─── 2. Node fade + lift ───────────────────────── */
/* Add class="fade" + style="--delay:Xs" to each node <g> or <rect> pair */
.fade {
  opacity: 0;
  animation: fade var(--dur, 0.4s) ease forwards;
  animation-delay: var(--delay, 0s);
}
@keyframes fade {
  to {
    opacity: 1;
  }
}

.fade-up {
  opacity: 0;
  transform: translateY(10px);
  animation: fadeup var(--dur, 0.4s) ease forwards;
  animation-delay: var(--delay, 0s);
}
@keyframes fadeup {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ─── 3. Panel slide in ─────────────────────────── */
/* Wrap panel rect + label in <g class="slide-in" style="--delay:Xs"> */
.slide-in {
  opacity: 0;
  transform: translateX(-12px);
  animation: slidein 0.5s ease forwards;
  animation-delay: var(--delay, 0s);
}
@keyframes slidein {
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* ─── 4. Step circle pop ────────────────────────── */
/* Add class="pop" + style="--delay:Xs" to step circle <g> */
.pop {
  transform: scale(0);
  animation: pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
  animation-delay: var(--delay, 0s);
}
@keyframes pop {
  to {
    transform: scale(1);
  }
}

/* ─── 5. Focal node pulse ───────────────────────── */
/* Add class="pulse" to focal node rect after all other animations complete */
.pulse {
  animation: pulse 2.5s ease-in-out infinite;
  animation-delay: var(--start, 3s);
}
@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

/* ─── 6. Flow dot along arrow ───────────────────── */
/* Creates a moving dot that travels along an arrow path */
/* Add a <circle class="flow-dot" r="4" fill="COLOR"> inside a <g> with offset-path */
.flow-dot {
  offset-path: path('M X1,Y1 L X2,Y2'); /* match your arrow path exactly */
  offset-distance: 0%;
  animation: flowdot var(--dur, 1.8s) linear infinite;
  animation-delay: var(--delay, 0s);
}
@keyframes flowdot {
  to {
    offset-distance: 100%;
  }
}

/* ─── Reduced motion fallback ───────────────────── */
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-delay: 0ms !important;
  }
}
```

---

## Stagger timing formula

Assign `--delay` to each element based on its logical order in the diagram:

```
Panel 1:            delay = 0s
Panel 2:            delay = 0.2s
Panel 3:            delay = 0.4s
Node in panel N:    delay = (panel_index * 0.2) + (node_index * 0.3)s
Arrow after node:   delay = node_delay + 0.25s
Step circle:        delay = arrow_delay + 0.1s
Focal pulse:        starts after all reveals complete (sum of all delays + 0.5s)
```

Aim for total animation under **4 seconds**. If more than 10 elements, use 0.2s stagger instead of 0.3s.

---

## Grouping elements for animation

Wrap related SVG elements in a `<g>` to animate as a unit:

```svg
<!-- Animate whole node as one unit -->
<g class="fade-up" style="--delay:0.6s">
  <rect x="X" y="Y" width="W" height="H" rx="8" fill="#FFF"/>
  <rect x="X" y="Y" width="W" height="H" rx="8" fill="#FFF" stroke="#BDBDBD" stroke-width="1.5"/>
  <text ...>Node Label</text>
</g>

<!-- Animate arrow separately, slightly after its source node -->
<g class="fade" style="--delay:0.9s">
  <line class="draw" style="--len:180; --delay:0.9s" .../>
  <!-- arrow label -->
</g>

<!-- Step circle pops in after arrow -->
<g class="pop" style="--delay:1.1s">
  <circle cx="..." cy="..." r="11" fill="#1A1A1A"/>
  <text ...>1</text>
</g>
```

---

## Step-through mode

Add `data-step="N"` to each `<g>` in the SVG (starting at 1). Then include the script:

```html
<script>
  // Inline content of step-through.js (from visualcave/step-through.js)
</script>
```

Read `../step-through.js` and inline its content verbatim between the script tags.

To use: mark step groups with `data-step="N"`. Don't use animation CSS classes — step-through handles reveal via opacity.

---

## Hover interactions

Add `data-node="id"` to node `<g>` elements and `data-connects="id1,id2"` to arrow `<g>` elements. Then include:

```html
<script>
  // Inline content of hover.js (from visualcave/hover.js)
</script>
```

Read `../hover.js` and inline its content verbatim between the script tags.

---

## Animated template structure

When generating animated diagrams:

1. Add CSS block above to `<style>`
2. Wrap every panel, node, arrow, step circle in `<g class="..." style="--delay:Xs">`
3. Set `--len` on every `.draw` arrow (estimate from coordinates)
4. If step-through: add `data-step="N"` + inline `step-through.js`
5. If hover: add `data-node` / `data-connects` + inline `hover.js`
6. Tell user: "Open in browser to see animation. For GIF: `node capture.js diagram.html`"
