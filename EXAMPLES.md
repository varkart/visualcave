# Examples — Good Prompts & Patterns

Real prompts and the patterns they produce. Use these as a reference for what to ask for and what to expect.

---

## Flowchart / Architecture

**Prompt:**
```
/panel-diagram — microservices architecture for an e-commerce platform
showing API gateway, auth service, product catalog, order service, and
payment service with a message queue between order and payment
```

**What you get:** `graph TD` with warm/cool panel alternation, subgraphs grouping related services, edge labels on arrows, classDef colors per layer.

**Good pattern — subgraph zones:**
```
subgraph "Edge"
  GW[API Gateway]:::blue
end
subgraph "Services"
  Auth[Auth Service]:::purple
  Orders[Order Service]:::orange
end
```

**Bad — no zones, flat list:** All nodes at the same level with no grouping makes complex architectures unreadable.

---

## Sequence Diagram

**Prompt:**
```
/panel-diagram — OAuth 2.0 Authorization Code flow with all actors:
browser, client app, auth server, resource server. Number each step.
Show the authorization code exchange and token issuance.
```

**What you get:** `sequenceDiagram` with numbered `Note` annotations, `activate`/`deactivate` blocks on the auth server, all 8 steps labeled.

**Good pattern — numbered notes:**
```
Note over Browser,Client: 1. User clicks Login
Browser->>AuthServer: GET /authorize?response_type=code
```

**Bad — omitting participants:** Declaring only the ones that send messages loses the visual alignment that makes sequence diagrams readable.

---

## Step-Through / Interactive

**Prompt:**
```
/panel-diagram — Transformer architecture "Attention Is All You Need"
with a step-through guide (4 phases: input encoding → encoder stack →
decoder stack → output projection). Annotate positional encoding and
the attention formula. Dark mode supported.
```

**What you get:** Full HTML with `setupSteps()` mapping nodes to phases, a floating status pill, `data-step` reveal, dark mode toggle.

**Good pattern — phase mapping:**
```js
const stepConfig = [
  { label: 'Phase 1: Input', nodes: ['Embed', 'PosEnc'] },
  { label: 'Phase 2: Encoder', nodes: ['MHA', 'FFN', 'Norm1'] },
  ...
];
```

**Bad — putting all nodes visible at load:** Defeats the teaching purpose. Step-through is specifically for walkthroughs where revealing all at once is overwhelming.

---

## Class Diagram

**Prompt:**
```
/panel-diagram — UML class diagram for a blog platform: User, Post,
Comment, Tag, Category. Show methods, field types, and multiplicity.
Color-code by layer (user-facing vs content vs metadata).
```

**What you get:** `classDiagram` with `+type field` syntax, `+method() returnType`, relationship arrows with multiplicity labels, `style` overrides per class.

**Good pattern — typed fields with visibility:**
```
class Post {
  +int id
  +string slug
  +string status
  +datetime publishedAt
  +publish() void
  +getComments() Comment[]
}
```

**Bad — generic field names:** `+field1`, `+field2` wastes the diagram. Always use real domain names and types.

---

## State Machine

**Prompt:**
```
/panel-diagram — order lifecycle state machine. States: Pending,
Confirmed, Processing, Shipped, Delivered, Cancelled, Refunded.
Color-code by status category (pending=yellow, active=blue,
success=green, terminal=red).
```

**What you get:** `stateDiagram-v2` with `classDef` for each status category, labeled transitions, `[*]` start and end markers.

**Good pattern — semantic color coding:**
```
classDef active fill:#E3F2FD,stroke:#1E88E5
classDef success fill:#E8F5E9,stroke:#43A047
class Confirmed,Processing active
class Delivered,Refunded success
```

**Bad — all states the same color:** Loses the at-a-glance understanding of which states are terminal vs active.

---

## ER Diagram

**Prompt:**
```
/panel-diagram — database schema for a SaaS app: users, organizations,
memberships, subscriptions, invoices. Show PK/FK/UK constraints and
cardinality on all relationships.
```

**What you get:** `erDiagram` with `PK`, `FK`, `UK` annotation columns, crow's-foot cardinality notation (`||--o{`), relationship labels as quoted strings.

**Good pattern — constraint annotations:**
```
USER {
  int    id    PK
  string email UK
  int    orgId FK
}
```

**Bad — no PK/FK markers:** ER diagrams without constraint annotations are just boxes with lists. The PK/FK columns are what makes them useful.

---

## Quadrant / Priority Matrix

**Prompt:**
```
/panel-diagram — feature priority matrix for Q3. X-axis: effort (low→high).
Y-axis: impact (low→high). Plot: dark mode, SSO, GraphQL API, search
autocomplete, offline mode, AI summaries, CSV export, audit logs.
Label quadrants: Quick Wins, Major Projects, Fill-ins, Reconsider.
```

**What you get:** `quadrantChart` with labeled quadrants, 8 plotted points at `[x, y]` coordinates (0–1 scale), colored backgrounds per quadrant.

**Good pattern — spread points across all four quadrants:** If all points cluster in one area the chart loses meaning. Assign coordinates that reflect real relative effort/impact.

---

## Tips

- **Be specific about actors/entities.** "Show 5 services" → vague. "Show API gateway, auth, product catalog, order service, payment service" → precise output.
- **Name the diagram type if you know it.** "sequence diagram" or "state machine" gives Claude the right Mermaid keyword immediately.
- **Ask for step-through** when the diagram is complex and meant for teaching.
- **Ask for dark mode** when the output will be embedded in a dark-themed doc or presentation.
- **Ask for export format** at generation time: "also export as PNG" → Claude will include `capture.js` instructions.
