# MDX / Astro Component Output

When user asks for "MDX component", "Astro component", or "embed in my site", generate an `.astro` file instead of a standalone `.html`.

## When to use

- User wants to embed diagram directly in a blog/learn post
- User's site is Astro, Next.js, or any JSX-based framework
- User says "make it a component", "for my site", "drop it in my post"

## Astro component output (default for Astro sites)

Generate a single `.astro` file. The SVG is inline — no iframe, no image, no external dependency.

```astro
---
// DiagramName.astro
// Usage: import DiagramName from '../components/diagrams/DiagramName.astro'
//        <DiagramName />
---

<figure class="diagram-wrap">
  <!-- FULL SVG GOES HERE — copy the entire <svg>...</svg> block -->
  <svg viewBox="0 0 900 HEIGHT" xmlns="http://www.w3.org/2000/svg">
    <!-- diagram content -->
  </svg>
  <figcaption>Caption describing the diagram</figcaption>
</figure>

<style>
  .diagram-wrap {
    width: 100%;
    margin: 2rem 0;
    overflow-x: auto;
  }
  .diagram-wrap svg {
    width: 100%;
    height: auto;
    display: block;
  }
  .diagram-wrap figcaption {
    font-size: 0.75rem;
    color: #9E9E9E;
    text-align: center;
    margin-top: 0.5rem;
    font-family: 'Inter', sans-serif;
  }
  /* Dark mode — inherits from site theme */
  @media (prefers-color-scheme: dark) {
    .diagram-wrap svg text { fill: #E8E8E8; }
  }
</style>
```

## MDX usage (in content files)

After generating the `.astro` file, the user imports it in their MDX:

```mdx
---
title: How RAG Works
---

import RagDiagram from '../../components/diagrams/RagDiagram.astro';

Here's the full flow:

<RagDiagram />

The key insight is...
```

## File placement

```
src/components/diagrams/        ← put generated .astro files here
content/learn/                  ← MDX files that import them
```

## React component output (Next.js / React)

If user's framework is React/Next.js, generate `.tsx` instead:

```tsx
// RagDiagram.tsx
export function RagDiagram() {
  return (
    <figure style={{ width: '100%', margin: '2rem 0', overflowX: 'auto' }}>
      <svg
        viewBox="0 0 900 HEIGHT"
        xmlns="http://www.w3.org/2000/svg"
        style={{ width: '100%', height: 'auto' }}
      >
        {/* diagram content as JSX — convert SVG attributes to camelCase */}
        {/* stroke-width → strokeWidth, font-family → fontFamily, etc. */}
      </svg>
    </figure>
  );
}
```

## SVG → JSX attribute conversion

When generating React/TSX, convert these SVG attributes:

| SVG                 | JSX                |
| ------------------- | ------------------ |
| `stroke-width`      | `strokeWidth`      |
| `font-family`       | `fontFamily`       |
| `font-size`         | `fontSize`         |
| `font-weight`       | `fontWeight`       |
| `text-anchor`       | `textAnchor`       |
| `marker-end`        | `markerEnd`        |
| `marker-start`      | `markerStart`      |
| `stroke-dasharray`  | `strokeDasharray`  |
| `stroke-dashoffset` | `strokeDashoffset` |
| `letter-spacing`    | `letterSpacing`    |
| `fill-opacity`      | `fillOpacity`      |
| `clip-path`         | `clipPath`         |
| `class`             | `className`        |

## Animated component

For animated Astro components, include the CSS in `<style>` and animation classes on SVG elements as normal — Astro scopes styles to the component automatically.

For React, move CSS to a `.module.css` file or use inline `style` with `@keyframes` injected via `<style>` tag in the component.
