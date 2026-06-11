# Diagram Type Reference

Pick the Mermaid keyword that matches the user's intent.

| User says… | Mermaid keyword | Example file |
|---|---|---|
| flow, pipeline, architecture, data flow, system overview | `graph TD` / `graph LR` | `examples/ecommerce-order-flow.html` |
| sequence, API call, interaction between services, who calls who | `sequenceDiagram` | `examples/oauth-flow.html` |
| class, object model, domain model, OOP, UML | `classDiagram` | `examples/class-diagram.html` |
| state, lifecycle, status transitions, FSM | `stateDiagram-v2` | `examples/state-machine.html` |
| database, schema, tables, ER, entity-relationship | `erDiagram` | `examples/er-diagram.html` |
| priority, 2×2 matrix, effort vs impact, scatter | `quadrantChart` | `examples/quadrant-chart.html` |
| timeline, history, milestones, evolution, roadmap dates | `timeline` | `examples/timeline.html` |
| mind map, brainstorm, concept map, topics | `mindmap` | `examples/mindmap.html` |
| git, branching, gitflow, commits, merge | `gitGraph` | `examples/git-graph.html` |
| pie chart, distribution, percentage breakdown, share | `pie` | `examples/pie-chart.html` |
| gantt, schedule, project plan, sprint | `gantt` | — |

## classDef support

`classDef` color classes (`:::yellow`, `:::blue`, etc.) work in: `graph`, `classDiagram`, `stateDiagram-v2`.

For types that don't support `classDef` (`erDiagram`, `sequenceDiagram`, `timeline`, `mindmap`, `gitGraph`, `pie`, `quadrantChart`), control colors via `themeVariables` in `mermaid.initialize()`. See each example file for the relevant `themeVariables` block.
