# VisualCave — Interactive Diagram Generator for AI Agents

![Validate Diagrams](https://github.com/varkart/visualcave/actions/workflows/ci.yml/badge.svg)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

VisualCave is an agentic custom skill and plugin that enables AI assistants (**Claude Code**, **Cursor**, **Codex CLI**, and **Gemini CLI**) to design and render gorgeous, fully-interactive technical diagrams as standalone HTML files or embeddable Astro/MDX components.

Powered by **[Mermaid.js](https://mermaid.js.org)**, it supports 11 diagram types including flowcharts, sequence diagrams, ER diagrams, class diagrams, git graphs, mind maps, and more.

Every output automatically includes:

- **Presentation Tools:** Step-through reveal for guided slideshow walkthroughs and dynamic hover-highlighting.
- **Design Customization:** Smooth dark/light mode toggle and four distinct theme presets (Default, Minimal, Pastel, Print).
- **One-Click Client Export:** Direct SVG, PNG, and PDF downloads right from the browser controls bar — with absolutely no server or local build step required.

**[View Showcase Site →](https://varkart.github.io/visualcave)**

![VisualCave demo](assets/visual-cave.gif)

---

## Installation

**Claude Code (global)**

```bash
git clone https://github.com/varkart/visualcave ~/.claude/skills/visualcave
```

**Claude Code (per-project)**

```bash
git clone https://github.com/varkart/visualcave .claude/skills/visualcave
```

**Cursor — global skill**

```bash
git clone https://github.com/varkart/visualcave ~/.cursor/skills-cursor/visualcave
```

**Cursor — project rules only**

Copy `.cursor/rules/visualcave.mdc` into your project's `.cursor/rules/` directory.

**Codex CLI — skill (git)**

```bash
git clone https://github.com/varkart/visualcave ~/.codex/skills/visualcave
```

**Codex CLI — plugin (marketplace)**

```bash
codex plugin marketplace add varkart/visualcave
codex plugin add visualcave
```

**Gemini CLI — extension (git)**

```bash
git clone https://github.com/varkart/visualcave ~/.gemini/extensions/visualcave
```

**Gemini CLI — extension (install command)**

```bash
gemini extensions install https://github.com/varkart/visualcave
```

**Google Antigravity CLI (`agy`) — skill (git)**

```bash
git clone https://github.com/varkart/visualcave ~/.gemini/antigravity-cli/skills/visualcave
```

**Google Antigravity CLI (`agy`) — plugin (git)**

```bash
git clone https://github.com/varkart/visualcave ~/.gemini/antigravity-cli/plugins/visualcave
agy plugin install ~/.gemini/antigravity-cli/plugins/visualcave
```

**Kiro — skill (git)**

```bash
git clone https://github.com/varkart/visualcave ~/.kiro/skills/visualcave
```

**Kiro — Power**

Add as a Power in Kiro settings using the GitHub URL `https://github.com/varkart/visualcave`. For project-level steering, copy `.kiro/steering/visualcave.md` into your project's `.kiro/steering/` directory.

No restart required after installation.

---

## Usage

See **[EXAMPLES.md](EXAMPLES.md)** for real prompts and patterns showing what to ask for and what output to expect.

Invoke with `/visualcave` in your AI assistant, then describe your diagram:

```text
/visualcave — how OAuth 2.0 works
/visualcave — interactive walkthrough of a RAG pipeline
/visualcave — Transformer architecture "Attention Is All You Need"
/visualcave — order lifecycle state machine with all edge cases
/visualcave — GitFlow branching strategy with release and hotfix branches
```

Outputs a single self-contained `.html` file. Open it in any browser — no build step, no server.

---

## Quick Start

1. Install (Claude Code global): `git clone https://github.com/varkart/visualcave ~/.claude/skills/visualcave`
2. In your Claude Code session, type `/visualcave` followed by what you want:
   ```text
   /visualcave — how OAuth 2.0 works
   ```
3. Claude generates a `.html` file. Open it in any browser.
4. Use the controls bar in the diagram to switch themes, toggle dark mode, step through phases, or export as SVG/PNG/PDF.

---

## Key Features

- **11 diagram types** — flowchart, sequence, class, ER, state machine, quadrant, timeline, mind map, git graph, pie, gantt
- **Interactive step-through** — click to reveal phases one by one; ideal for architecture walkthroughs and presentations
- **Hover highlight** — mousing over a node dims unrelated nodes to focus attention
- **Design theme selector** — four themes (Default, Minimal, Pastel, Print) switchable from the controls bar; each theme adjusts both Mermaid's color scheme and all `classDef` node colors simultaneously; selection persisted to `localStorage`
- **Dark / light mode toggle** — smooth CSS transition, respects `prefers-color-scheme` on first load
- **Copy Mermaid source** — one-click copy of the raw diagram source for reuse or editing
- **In-page export** — SVG, PNG, and PDF download buttons in every diagram's controls bar; fully client-side, no server or Node.js required
- **CLI export** — animated GIF, OG social card (1200×630), and headless batch export via `capture.js` (requires Node.js 18+)
- **Astro / React component output** — generate site-ready `.astro` or `.tsx` components for embedding diagrams into blog posts and articles, with full dark/light token alignment
- **Living diagram animation** — two modes on request: CSS flow (flowing edges + node glow on any Mermaid diagram, zero deps) or Canvas (full custom particles, physics, signal propagation — no Mermaid needed)
- **Zero runtime dependencies** — Mermaid loaded from CDN; all other logic is inlined in the HTML file

---

## Diagram Type Reference

| Intent                                        | Mermaid keyword         |
| --------------------------------------------- | ----------------------- |
| Flow, pipeline, architecture, system overview | `graph TD` / `graph LR` |
| Sequence, API calls, actor interactions       | `sequenceDiagram`       |
| Class / object / domain model (UML)           | `classDiagram`          |
| State machine, lifecycle, status transitions  | `stateDiagram-v2`       |
| Database schema, tables, entity relationships | `erDiagram`             |
| 2×2 priority / effort-impact matrix           | `quadrantChart`         |
| History, milestones, roadmap dates            | `timeline`              |
| Brainstorm, concept map, topic overview       | `mindmap`               |
| Git branching, commits, merges                | `gitGraph`              |
| Distribution, percentage breakdown            | `pie`                   |
| Project schedule, sprint plan                 | `gantt`                 |

---

## Examples

All examples are in [`examples/`](examples/) and live at the [showcase site](https://varkart.github.io/visualcave).

**Architecture & Flow**

- [Transformer Architecture (step-through)](examples/transformer-deep-dive.html) — step-through reveal, dark mode
- [OAuth 2.0 Flow](examples/oauth-flow.html) — sequence diagram
- [API Gateway Architecture](examples/architecture-api-gateway.html)
- [CI/CD Pipeline](examples/pipeline-cicd.html)
- [E-commerce Order Flow](examples/ecommerce-order-flow.html)
- [Event-Driven Microservices](examples/event-driven-microservices.html)
- [Kubernetes Deployment](examples/kubernetes-deployment.html)
- [Multi-Region Failover](examples/multi-region-failover.html)
- [RAG Pipeline](examples/rag-pipeline.html)
- [API Lifecycle](examples/api-lifecycle.html)

**Object & Data Models**

- [E-Commerce Domain Model](examples/class-diagram.html) — `classDiagram`
- [Blog Database Schema](examples/er-diagram.html) — `erDiagram`
- [Order Lifecycle](examples/state-machine.html) — `stateDiagram-v2`

**Planning & Analysis**

- [Feature Priority Matrix](examples/quadrant-chart.html) — `quadrantChart`
- [API Traffic Distribution](examples/pie-chart.html) — `pie`

**Knowledge & History**

- [Evolution of the Web](examples/timeline.html) — `timeline`
- [Software Engineering Timeline](examples/software-engineering-timeline.html) — `timeline`
- [System Design Topics](examples/mindmap.html) — `mindmap`
- [GitFlow Strategy](examples/git-graph.html) — `gitGraph`

**Transformer Architecture Variants**

- [Transformer Animated](examples/transformer-animated.html)
- [Transformer Architecture](examples/transformer-architecture.html)
- [Transformer Pro](examples/transformer-pro.html)
- [Transformer Ultra](examples/transformer-ultra.html)

---

## Color Palette

Apply these `classDef` classes in `graph` and `classDiagram` diagrams:

| Class       | Use for                            |
| ----------- | ---------------------------------- |
| `:::yellow` | Users, browsers, entry points      |
| `:::blue`   | Services, APIs, compute            |
| `:::green`  | Databases, storage, success states |
| `:::purple` | Auth, AI models, security          |
| `:::orange` | Queues, events, pipelines          |
| `:::teal`   | Caching, CDN, external APIs        |
| `:::note`   | Annotations, callouts              |

---

## Export

### In-page buttons (no install required)

Every diagram includes **SVG**, **PNG**, and **PDF** download buttons in the controls bar alongside Dark Mode and Copy Code. All client-side:

- **SVG** — serializes the rendered inline SVG with a white background
- **PNG** — renders at 2x canvas resolution for crisp screenshots
- **PDF** — triggers `window.print()` with print CSS that hides the controls

### CLI export (`capture.js`)

For headless/batch use, animated GIFs, and OG social cards (requires Node.js 18+):

```bash
node capture.js diagram.html                    # animated GIF
node capture.js diagram.html --format=png       # PNG screenshot
node capture.js diagram.html --format=svg       # extracted SVG
node capture.js diagram.html --format=pdf       # A4 PDF
node capture.js diagram.html --format=og        # 1200×630 OG image
```

---

## Development

Requires **Node.js 18+** (for `capture.js` / puppeteer).

```bash
npm install
npx playwright install chromium
npm test             # run all diagram validation tests
npm run test:ui      # Playwright UI mode
npm run test:headed  # headed browser
```

---

## Contributing

See [CLAUDE.md](CLAUDE.md) for contribution guidelines — what's accepted, what won't be merged, and how to run tests.

---

## License

MIT — see [LICENSE](LICENSE).
