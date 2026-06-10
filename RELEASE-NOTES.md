# Release Notes

## 1.0.0 — 2025-06-10

Initial public release.

**Diagram types supported:**
- `graph TD` / `graph LR` — flowcharts, pipelines, architecture
- `sequenceDiagram` — API flows, protocol walkthroughs
- `classDiagram` — OOP / domain models
- `stateDiagram-v2` — lifecycle / state machines
- `erDiagram` — database schemas
- `quadrantChart` — priority matrices
- `timeline` — history, roadmaps
- `mindmap` — concept maps, brainstorming
- `gitGraph` — branching strategy
- `pie` — distribution charts
- `gantt` — project schedules

**Features:**
- Dark/light mode toggle with `prefers-color-scheme` detection
- Step-through sequential reveal (`step-through.js`)
- Hover highlight / dim (`hover.js`)
- Export: PNG, SVG, PDF, animated GIF, OG social card (`capture.js`)
- Copy Mermaid source button (uses `dataset.source` snapshot to avoid garbled SVG text)
- 13 example diagrams across 5 categories
- Playwright CI validating all examples render
- GitHub Pages showcase site

**Known constraints:**
- CSS animation classes (`draw`, `fade`, `fade-up`) apply to hand-authored SVG only — not Mermaid output
- Step-through requires post-render JS to set `data-step` attributes; cannot be set in Mermaid source
- `capture.js` requires Node.js + puppeteer; Playwright tests require Chromium
