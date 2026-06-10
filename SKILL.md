---
name: panel-diagram
description: Use when the user asks to create a diagram, chart, infographic, flowchart, architecture illustration, or any technical visualization. Covers flowcharts, sequence diagrams, ER diagrams, class diagrams, state machines, timelines, mind maps, git graphs, pie charts, and quadrant charts.
license: MIT
---

# Panel Diagram

Output a **single self-contained `.html` file**. No markdown wrapper unless the user asks for it.

**Style rules:**
- Thick strokes (2px), 4px drop shadow, rounded nodes.
- Warm/cool subgraph alternation: yellow → blue → green → purple → teal → orange.
- Inter font for UI; JetBrains Mono for code/math labels.
- Pick the right Mermaid keyword — see `references/diagram-types.md`.

## HTML Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg:#F0F2F5; --card-bg:#FFFFFF; --text-main:#111827; --text-muted:#6B7280;
      --border:#E5E7EB; --accent:#1E88E5; --shadow:0 4px 20px rgba(0,0,0,0.08); --node-stroke:#1A1A1A;
    }
    [data-theme="dark"] {
      --bg:#0F1117; --card-bg:#1A1D27; --text-main:#F9FAFB; --text-muted:#9CA3AF;
      --border:#2A2D3A; --accent:#3B82F6; --shadow:0 4px 24px rgba(0,0,0,0.4); --node-stroke:#3A3D50;
    }
    body { background:var(--bg); color:var(--text-main); display:flex; justify-content:center; padding:40px; font-family:'Inter',sans-serif; margin:0; transition:background 0.3s ease; }
    .page { background:var(--card-bg); border-radius:24px; padding:48px; box-shadow:var(--shadow); width:100%; max-width:1200px; border:1px solid var(--border); transition:background 0.3s ease,border 0.3s ease; }
    header { display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:40px; }
    .title-group h1 { margin:0; font-size:36px; font-weight:900; letter-spacing:-0.02em; display:flex; align-items:center; gap:16px; }
    .title-group h1::before { content:''; display:block; width:8px; height:40px; background:var(--accent); border-radius:4px; }
    .title-group p { margin:8px 0 0 24px; color:var(--text-muted); font-size:16px; font-weight:500; }
    .controls { display:flex; gap:12px; }
    button { font:600 13px 'Inter',sans-serif; padding:10px 20px; border-radius:12px; cursor:pointer; transition:all 0.2s ease; display:flex; align-items:center; gap:8px; }
    .btn-secondary { background:var(--card-bg); border:1px solid var(--border); color:var(--text-main); }
    .btn-secondary:hover { background:var(--bg); border-color:var(--accent); }
    .mermaid svg { max-width:100%; height:auto; }
    .node rect,.node circle,.node polygon,.node path { stroke-width:2.5px !important; stroke:var(--node-stroke) !important; filter:drop-shadow(4px 4px 0px rgba(0,0,0,0.1)); }
    .node text { font-weight:500 !important; font-size:14px !important; fill:var(--text-main) !important; }
    .edgePath .path { stroke-width:2.5px !important; stroke:var(--text-muted) !important; }
    .cluster rect { stroke-width:2.5px !important; stroke:var(--node-stroke) !important; fill:var(--bg) !important; }
    .cluster text { font-weight:600 !important; fill:var(--text-main) !important; }
    @media (prefers-reduced-motion:reduce) { *,*::before,*::after { animation-duration:0.01ms !important; transition-duration:0.01ms !important; } }
  </style>
</head>
<body>
  <div class="page">
    <header>
      <div class="title-group">
        <h1>[Diagram Title]</h1>
        <p>[Subtitle]</p>
      </div>
      <div class="controls">
        <button class="btn-secondary" onclick="toggleTheme()" id="theme-toggle">🌙 Dark Mode</button>
        <button class="btn-secondary" onclick="copyMermaid(this)">📋 Copy Code</button>
      </div>
    </header>
    <div class="mermaid" id="diagram-source">
      graph TD
        classDef yellow fill:#FFFDE7,stroke:#1A1A1A,stroke-width:2px;
        classDef blue   fill:#E3F2FD,stroke:#1A1A1A,stroke-width:2px;
        classDef green  fill:#E8F5E9,stroke:#1A1A1A,stroke-width:2px;
        classDef purple fill:#F3E5F5,stroke:#1A1A1A,stroke-width:2px;
        classDef teal   fill:#E0F7FA,stroke:#1A1A1A,stroke-width:2px;
        classDef orange fill:#FFF3E0,stroke:#1A1A1A,stroke-width:2px;
        classDef note   fill:#FFF9C4,stroke:#FBC02D,stroke-dasharray:4;
        A[Entry]:::yellow --> B[Process]:::blue
    </div>
  </div>
  <script type="module">
    import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs';
    const _md = document.getElementById('diagram-source');
    _md.dataset.source = _md.textContent.trim();
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDark) document.documentElement.setAttribute('data-theme', 'dark');
    document.fonts.ready.then(() => {
      mermaid.initialize({
        startOnLoad: true, theme: 'base',
        flowchart: { htmlLabels: true, useMaxWidth: true, padding: 100 },
        themeVariables: {
          fontFamily: 'Inter, sans-serif',
          primaryColor: '#FFFDE7', primaryBorderColor: '#1A1A1A', primaryTextColor: '#1A1A1A',
          lineColor: '#424242', clusterBkg: '#F8F9FA', clusterBorder: '#1A1A1A'
        }
      });
    });
    window.toggleTheme = () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      document.getElementById('theme-toggle').textContent = next === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode';
    };
    window.copyMermaid = function(btn) {
      navigator.clipboard.writeText(document.getElementById('diagram-source').dataset.source || '').then(() => {
        const orig = btn.textContent; btn.textContent = '✓ Copied'; setTimeout(() => btn.textContent = orig, 2000);
      });
    };
  </script>
</body>
</html>
```

## Colors

`classDef` works in `graph`, `classDiagram`, `stateDiagram-v2`. For other types use `themeVariables`.

| Class | Fill | Use for |
|---|---|---|
| `:::yellow` | `#FFFDE7` | Users, browsers, entry points |
| `:::blue` | `#E3F2FD` | Services, APIs, compute |
| `:::green` | `#E8F5E9` | Databases, storage, success |
| `:::purple` | `#F3E5F5` | Auth, AI models, security |
| `:::teal` | `#E0F7FA` | Caching, CDN, external APIs |
| `:::orange` | `#FFF3E0` | Queues, events, pipelines |
| `:::note` | `#FFF9C4` | Annotations, callouts |

## Interactive Features

**Step-through** (sequential reveal): copy `setupSteps()` pattern from `examples/transformer-ultra.html`, include `<script src="step-through.js"></script>`.

**Hover highlight**: add `data-node` / `data-connects` attributes post-render, include `<script src="hover.js"></script>`.

**Export**: `node capture.js file.html [--format=png|svg|pdf|og]`
