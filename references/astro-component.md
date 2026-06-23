# Astro Component Mode (varkart.dev site)

This reference outlines rules for generating `.astro` component files for integration with `varkart.dev` (`github.com/varkart/personal-site`).

## Trigger phrases

- "for the site", "for the blog", "for the article", "embed this", "Astro component", "MDX component"

## Output rules

1. **File**: `src/components/mdx/ComponentName.astro`
2. **Mermaid diagrams** → use the existing `MermaidDiagram.astro` wrapper component rather than outputting custom wrappers:
   ```mdx
   export const myCode = `flowchart LR
     A --> B`;
   <MermaidDiagram code={myCode} label="Caption here" />
   ```
3. **CSS-based visuals** (cards, timelines, tables) → output a full `.astro` component.

## Dark-first CSS rule (CRITICAL)

Site default = dark (`:root`, no `data-theme` on `<html>`).  
Light = `[data-theme='light']` on `<html>`.  
**Never write `[data-theme="dark"]` selectors — they never fire.**

```css
/* ✓ correct */
.card {
  background: #1e2130;
  color: #e5e7eb;
}
[data-theme='light'] .card {
  background: #ffffff;
  color: #111827;
}
```

## Token reference

| Token           | Dark default         | Light override         |
| --------------- | -------------------- | ---------------------- |
| Page bg         | `#0a0a0a`            | `#fafafa`              |
| Surface/card bg | `#1e2130`            | `#ffffff`              |
| Deeper surface  | `#161925`            | `#f8f9fa`              |
| Code/pre bg     | `#1e2130`            | `#eef0f3 !important`\* |
| Border          | `#2a2d3a`            | `#e5e7eb`              |
| Text primary    | `#e5e7eb`            | `#111827`              |
| Text body       | `#d1d5db`            | `#374151`              |
| Text muted      | `#9ca3af`            | `#6b7280`              |
| Accent          | `oklch(73% 0.15 72)` | `oklch(46% 0.16 68)`   |

\*`!important` needed on `pre` backgrounds — global `.prose pre { background: var(--bg-code) !important }` overrides component styles.

## Role badge palette

| Role      | Dark bg   | Dark text | Light bg  | Light text |
| --------- | --------- | --------- | --------- | ---------- |
| system    | `#2e1065` | `#c4b5fd` | `#ede9fe` | `#7c3aed`  |
| user      | `#1e3a5f` | `#93c5fd` | `#dbeafe` | `#2563eb`  |
| assistant | `#064e3b` | `#6ee7b7` | `#d1fae5` | `#059669`  |
| tool      | `#083344` | `#67e8f9` | `#cffafe` | `#0891b2`  |

## Era/phase accent colors (for timelines, pipelines)

| Name   | Color     | Use for                     |
| ------ | --------- | --------------------------- |
| yellow | `#f59e0b` | Entry points, era 1, inputs |
| blue   | `#3b82f6` | Services, APIs, era 2       |
| green  | `#10b981` | Success, storage, era 3     |
| purple | `#8b5cf6` | AI, auth, era 4             |
| teal   | `#06b6d4` | Cache, external, era 5      |
| orange | `#f97316` | Queues, events, pipelines   |

## Mermaid theme config for embedded diagrams

`MermaidDiagram.astro` already handles dark/light switching automatically. When writing the mermaid source string:

- Use plain labels — no `#` hex colors in node labels
- Avoid special chars in labels: `/ ( ) { }` — strip or rephrase
- Sequence diagram participant aliases keep labels short (≤ 3 words)
- Self-arrows work: `A->>A: note`

## Astro component template

```astro
---
interface Props {
  label?: string;
}
const { label } = Astro.props;
---

<figure class="vc-figure">
  {label && <figcaption class="vc-label">{label}</figcaption>}
  <!-- visual content here -->
</figure>

<style>
  .vc-figure { margin: 1.5rem 0; }

  .vc-label {
    font-size: 0.625rem;
    font-family: var(--font-mono, monospace);
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #888888;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 1rem;
  }
  .vc-label::before {
    content: '';
    display: block;
    width: 1rem;
    height: 2px;
    background: var(--accent, oklch(73% 0.15 72));
    flex-shrink: 0;
  }

  /* dark defaults first, then light overrides */
  .vc-card { background: #1e2130; border: 1.5px solid #2a2d3a; border-radius: 10px; }
  [data-theme='light'] .vc-card { background: #ffffff; border-color: #e5e7eb; }
</style>
```

## What needs custom CSS vs Mermaid

| Visual type                              | Use                                                                                     |
| ---------------------------------------- | --------------------------------------------------------------------------------------- |
| Flow / sequence / timeline diagrams      | Mermaid via `MermaidDiagram.astro`                                                      |
| Static cards, grids, tables              | CSS Astro component                                                                     |
| Annotated thread / conversation views    | CSS Astro component                                                                     |
| Interactive (user input, buttons, state) | CSS + JS Astro component — VisualCave can scaffold the shell but JS logic is hand-coded |

---

## React / Next.js (generic frameworks)

**Triggers**: "React component", "TSX component", "Next.js component"

Generate a `.tsx` file with inline SVG. No `MermaidDiagram.astro` — render the SVG directly.

```tsx
// DiagramName.tsx
export function DiagramName() {
  return (
    <figure style={{ width: '100%', margin: '2rem 0', overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 HEIGHT"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* diagram content — convert SVG attributes to camelCase */}
      </svg>
      <figcaption
        style={{ fontSize: '0.75rem', color: '#9E9E9E', textAlign: 'center', marginTop: '0.5rem' }}
      >
        Caption
      </figcaption>
    </figure>
  );
}
```

### SVG → JSX attribute conversion

| SVG                | JSX               |
| ------------------ | ----------------- |
| `stroke-width`     | `strokeWidth`     |
| `font-family`      | `fontFamily`      |
| `font-size`        | `fontSize`        |
| `text-anchor`      | `textAnchor`      |
| `marker-end`       | `markerEnd`       |
| `stroke-dasharray` | `strokeDasharray` |
| `fill-opacity`     | `fillOpacity`     |
| `clip-path`        | `clipPath`        |
| `class`            | `className`       |

### MDX import (works for both Astro and React)

```mdx
import DiagramName from '../../components/DiagramName';

<DiagramName />
```

For animated React components, move CSS to a `.module.css` file — inline `@keyframes` in a `<style>` tag also works.
