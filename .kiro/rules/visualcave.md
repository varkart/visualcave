# VisualCave

Trigger: use when the user asks to create a diagram, chart, infographic, flowchart, architecture illustration, or any technical visualization. Covers flowcharts, sequence diagrams, ER diagrams, class diagrams, state machines, timelines, mind maps, git graphs, pie charts, and quadrant charts.

Output a **single self-contained `.html` file**. No markdown wrapper unless the user asks.

**Style rules:**
- Thick strokes (2px), 4px drop shadow, rounded nodes.
- Warm/cool subgraph alternation: yellow → blue → green → purple → teal → orange.
- Inter font for UI; JetBrains Mono for code/math labels.
- Pick the right Mermaid keyword for the diagram type.

## Diagram Type Quick Reference

| User says… | Use |
|---|---|
| flow, pipeline, architecture | `graph TD` / `graph LR` |
| sequence, API calls, who calls who | `sequenceDiagram` |
| class, OOP, domain model | `classDiagram` |
| state, lifecycle, FSM | `stateDiagram-v2` |
| database, schema, ER | `erDiagram` |
| priority matrix, 2×2 | `quadrantChart` |
| timeline, history, milestones | `timeline` |
| mind map, brainstorm | `mindmap` |
| git branching, gitflow | `gitGraph` |
| pie chart, distribution | `pie` |

## HTML Template

See full template and color reference at: https://github.com/varkart/visualcave/blob/main/SKILL.md
