---
name: visualcave
description: Generate interactive Mermaid diagrams as self-contained HTML files with dark mode, step-through reveal, hover highlighting, and one-click SVG/PNG/PDF export
keywords:
  - diagram
  - flowchart
  - mermaid
  - architecture diagram
  - sequence diagram
  - ER diagram
  - class diagram
  - state machine
  - timeline
  - mind map
  - git graph
  - infographic
  - visualization
  - chart
  - technical illustration
---

# VisualCave

Output a **single self-contained `.html` file**. No markdown wrapper unless asked.

Invoke with `/visualcave` or when the user asks to create a diagram, chart, flowchart, architecture illustration, or any technical visualization.

Full instructions and HTML template: see `SKILL.md` in this directory, or at https://github.com/varkart/visualcave/blob/main/SKILL.md

## Diagram Type Quick Reference

| User says…                         | Mermaid keyword         |
| ---------------------------------- | ----------------------- |
| flow, pipeline, architecture       | `graph TD` / `graph LR` |
| sequence, API calls, actors        | `sequenceDiagram`       |
| class, OOP, domain model           | `classDiagram`          |
| state, lifecycle, FSM              | `stateDiagram-v2`       |
| database, schema, ER               | `erDiagram`             |
| priority matrix, 2×2               | `quadrantChart`         |
| timeline, history, milestones      | `timeline`              |
| mind map, brainstorm               | `mindmap`               |
| git branching, gitflow             | `gitGraph`              |
| pie chart, distribution            | `pie`                   |
