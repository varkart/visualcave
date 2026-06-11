# Brand Theming

Extract the user's brand colors and apply them to the panel palette before generating any diagram.

## When to trigger

User says any of:
- "match my site", "use my colors", "brand it"
- "themed", "on-brand"
- Provides a URL alongside a diagram request

## Onboarding flow

**Step 1 — Ask (first time only):**

> "Want to theme this to match your site? Give me your URL and I'll extract your colors."

If user provides URL → proceed to Step 2.
If user skips → use default palette, note they can theme later.

**Step 2 — Fetch and extract:**

Use WebFetch on their URL. Extract:
- Primary brand color (buttons, links, CTAs)
- Background color
- Text color
- Accent/highlight color
- Font family (if Google Font or system font)

**Step 3 — Map to panel palette:**

Map extracted colors to panel roles:

```
Primary brand color  → Accent (pill highlight, step circles, focal nodes)
Background color     → Page bg + card bg
Text color           → Node labels, title
Secondary/muted      → Sublabels, arrow labels
```

For panel zone colors — generate tints of the brand primary:
- Warm yellow zone  → brand primary at 10% opacity on warm white
- Cool blue zone    → brand primary at 15% opacity on cool white  
- Other zones       → adjacent hues on the color wheel, same lightness

If site uses a dark background → auto-apply dark mode variant first, then brand colors.

**Step 4 — Propose diff:**

Show the user what changed before generating:

```
Extracted from yourdomain.com:
  Primary:    #6366F1  (indigo)
  Background: #FFFFFF
  Text:       #111827

Applying to panel palette:
  Accent (pill, circles):   #6366F1
  Focal panel border:       #6366F1
  Focal panel bg:           #EEF2FF
  Title bar:                #6366F1
  Step circles:             #6366F1

Zones stay warm/cool — only accent changes.
Proceed? (y/n)
```

**Step 5 — Write to style-guide.md (optional):**

If user confirms, save their brand tokens to `references/style-guide.md` so future diagrams auto-apply:

```markdown
# style-guide.md — User brand tokens
## Source: https://yourdomain.com
accent:     #6366F1
accent-tint: #EEF2FF
page-bg:    #FFFFFF
card-bg:    #FFFFFF
text:       #111827
font:       Inter (matches site)
```

On subsequent invocations, check if `style-guide.md` exists. If it does, load tokens automatically without asking again.

## CSS overrides for branded output

When brand tokens are active, add to `<style>`:

```css
/* Brand overrides — replace default accent with brand primary */
:root {
  --brand:       #6366F1;
  --brand-tint:  #EEF2FF;
  --brand-dark:  #4338CA;
}
.title-bar  { background: var(--brand); }
.hl         { background: var(--brand); }
```

And in SVG, replace `#7B1FA2` (default purple accent) with `var(--brand)` on:
- Step circles fill
- Focal node stroke
- Accent arrow markers
- Title accent bar

## Palette generation from single color

If only one brand color is available, generate a full palette:

```
Given:  #6366F1 (hue 239°)

Warm yellow zone:  hsl(239, 20%, 97%)  bg  |  hsl(239, 60%, 75%)  border
Cool blue zone:    hsl(239, 30%, 95%)  bg  |  hsl(239, 70%, 60%)  border  ← primary hue
Soft green zone:   hsl(159, 25%, 95%)  bg  |  hsl(159, 50%, 45%)  border  ← +120° hue
Soft purple zone:  hsl(279, 25%, 95%)  bg  |  hsl(279, 50%, 50%)  border  ← +40° hue
Soft teal zone:    hsl(199, 25%, 95%)  bg  |  hsl(199, 50%, 45%)  border  ← -40° hue
```

This gives a coherent, on-brand palette while keeping the warm/cool visual rhythm.
