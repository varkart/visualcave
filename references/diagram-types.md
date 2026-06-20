# Diagram Type Reference

Pick the Mermaid keyword that matches the user's intent.

| User says…                                                      | Mermaid keyword         | Example file                         |
| --------------------------------------------------------------- | ----------------------- | ------------------------------------ |
| flow, pipeline, architecture, data flow, system overview        | `graph TD` / `graph LR` | `examples/ecommerce-order-flow.html` |
| sequence, API call, interaction between services, who calls who | `sequenceDiagram`       | `examples/oauth-flow.html`           |
| class, object model, domain model, OOP, UML                     | `classDiagram`          | `examples/class-diagram.html`        |
| state, lifecycle, status transitions, FSM                       | `stateDiagram-v2`       | `examples/state-machine.html`        |
| database, schema, tables, ER, entity-relationship               | `erDiagram`             | `examples/er-diagram.html`           |
| priority, 2×2 matrix, effort vs impact, scatter                 | `quadrantChart`         | `examples/quadrant-chart.html`       |
| timeline, history, milestones, evolution, roadmap dates         | `timeline`              | `examples/timeline.html`             |
| mind map, brainstorm, concept map, topics                       | `mindmap`               | `examples/mindmap.html`              |
| git, branching, gitflow, commits, merge                         | `gitGraph`              | `examples/git-graph.html`            |
| pie chart, distribution, percentage breakdown, share            | `pie`                   | `examples/pie-chart.html`            |
| gantt, schedule, project plan, sprint                           | `gantt`                 | —                                    |

## Mermaid vs Custom CSS — routing rules

Default to Mermaid. It generates ~10× fewer tokens (compact syntax vs verbose HTML) and the runtime handles layout.

Switch to custom CSS only when the user explicitly asks for visual richness that Mermaid cannot deliver:

| Type                | Mermaid limit                                                        | Use CSS when user asks for…                                                 |
| ------------------- | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `timeline`          | Flat list, no colors, no hover, no card descriptions                 | color-coded eras, milestone highlights, hover cards, descriptions per entry |
| `graph TD` pipeline | Generic boxes, no phase badges, no step numbers, no output artifacts | phase badges, numbered steps, technique tags, output artifacts              |
| comparison table    | No native support                                                    | side-by-side feature matrix, checkmarks, numeric values                     |

**CSS token cost:** ~10× more tokens generated (each entry requires ~8 lines of HTML vs ~1 line of Mermaid syntax). Never generate CSS from scratch — read `references/template.html` for the page shell, then use the stored component patterns below.

### CSS component patterns

**Timeline** (spine + dots + cards): grid `60px 24px 1fr`, colored dot + card per entry, hover `translateX(3px)`. See `examples/software-engineering-timeline.html` for a working example — read it and adapt, do not regenerate from scratch.

**Pipeline** (phase cards + step badges): centered column, `.vc-pl-num` circle badge, `.vc-pl-phase` label, `.vc-pl-out` artifact line. No working example yet in this repo — use the pattern from `~/.claude/skills/panel-diagram/BRIEF.md` if available.

**Comparison table**: `<table class="vc-cmp">` with `✓` / `✗` / `Partial` cells. No dedicated example yet.

## classDef support

`classDef` color classes (`:::yellow`, `:::blue`, etc.) work in: `graph`, `classDiagram`, `stateDiagram-v2`.

For types that don't support `classDef` (`erDiagram`, `sequenceDiagram`, `timeline`, `mindmap`, `gitGraph`, `pie`, `quadrantChart`), control colors via `themeVariables` in `mermaid.initialize()`. See each example file for the relevant `themeVariables` block.
