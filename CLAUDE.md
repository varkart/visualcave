# Contributing to panel-diagram

## Before You Open a PR

1. **Test your change renders.** Run `npm test` — all 15 Playwright tests must pass. Each test opens an HTML file in a real browser and asserts the Mermaid SVG renders without error.

2. **Keep SKILL.md under 700 words.** Every word loads on every invocation. Move reference material to `references/`.

3. **One thing per PR.** A fix, a new example, or a SKILL.md change — not all three.

4. **New diagram type?** Add an example file in `examples/` and a row in `references/diagram-types.md`. Add the example to the Playwright test list in `tests/validate-examples.spec.js`.

5. **New feature in capture.js / step-through.js / hover.js?** Include a before/after test showing it works. These files run in the browser or via Node — prose alone isn't enough.

## What Won't Be Accepted

- **Third-party npm dependencies** in production code. `capture.js` uses puppeteer — that's already a debt. Don't add more.
- **Hardcoded SVG coordinates.** Everything must use Mermaid — no `<rect x="..." y="...">`.
- **Breaking the template.** The HTML template in SKILL.md is the core output format. Changes must keep: `data-source` snapshot before `mermaid.initialize()`, `prefers-reduced-motion`, dark mode CSS vars, and the `copyMermaid` / `toggleTheme` pattern.
- **Renaming classDef colors.** Other files depend on `:::yellow`, `:::blue`, etc.

## Running Tests

```bash
npm install
npx playwright install chromium
npm test              # headless
npm run test:ui       # Playwright UI mode
npm run test:headed   # visible browser
```

Screenshots are saved to `tests/screenshots/` (gitignored) after each run.

## File Map

```
SKILL.md                  ← core skill (loaded on every invocation)
references/               ← loaded on demand
  diagram-types.md        ← type → keyword → example lookup
  dark-mode.md            ← dark mode token reference
  theming.md              ← custom brand theming guide
  animated.md             ← SVG animation classes (non-Mermaid only)
  mdx-component.md        ← MDX/React component wrapper
examples/                 ← live rendered output files
capture.js                ← PNG/SVG/PDF/GIF/OG export (Node + puppeteer)
step-through.js           ← sequential reveal UI
hover.js                  ← hover dim/highlight
tests/                    ← Playwright validation suite
```
