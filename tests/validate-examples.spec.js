const { test, expect } = require('@playwright/test');
const { mkdirSync } = require('fs');
const path = require('path');

mkdirSync('tests/screenshots', { recursive: true });

const MERMAID_DIST = path.resolve(__dirname, '../node_modules/mermaid/dist');

const DIAGRAMS = [
  { file: 'examples/transformer-ultra.html', type: 'graph', stepThrough: true },
  { file: 'examples/transformer-pro.html', type: 'graph', stepThrough: true },
  { file: 'examples/transformer-animated.html', type: 'graph', stepThrough: false },
  { file: 'examples/transformer-architecture.html', type: 'graph', stepThrough: false },
  { file: 'examples/class-diagram.html', type: 'classDiagram', stepThrough: false },
  { file: 'examples/er-diagram.html', type: 'erDiagram', stepThrough: false },
  { file: 'examples/state-machine.html', type: 'stateDiagram', stepThrough: false },
  { file: 'examples/quadrant-chart.html', type: 'quadrant', stepThrough: false },
  { file: 'examples/pie-chart.html', type: 'pie', stepThrough: false },
  { file: 'examples/timeline.html', type: 'timeline', stepThrough: false },
  { file: 'examples/mindmap.html', type: 'mindmap', stepThrough: false },
  { file: 'examples/git-graph.html', type: 'gitGraph', stepThrough: false },
  { file: 'examples/oauth-flow.html', type: 'sequence', stepThrough: false },
  { file: 'examples/transformer-deep-dive.html', type: 'graph', stepThrough: true },
  { file: 'examples/ecommerce-order-flow.html', type: 'static', stepThrough: false },
  { file: 'examples/api-lifecycle.html', type: 'graph', stepThrough: false },
  { file: 'examples/rag-pipeline.html', type: 'graph', stepThrough: false },
  { file: 'examples/kubernetes-deployment.html', type: 'graph', stepThrough: false },
  { file: 'examples/event-driven-microservices.html', type: 'graph', stepThrough: false },
  { file: 'examples/multi-region-failover.html', type: 'graph', stepThrough: false },
  { file: 'examples/agentic-horizon.html', type: 'graph', stepThrough: false },
  { file: 'examples/ai-evolution-timeline.html', type: 'static', stepThrough: false },
  { file: 'examples/llm-training-pipeline.html', type: 'static', stepThrough: false },
  { file: 'references/template.html', type: 'graph', stepThrough: false },
];

for (const diagram of DIAGRAMS) {
  test(`renders: ${diagram.file}`, async ({ page }) => {
    await page.route('**/cdn.jsdelivr.net/npm/mermaid@10/dist/**', (route) => {
      const filename = route.request().url().split('/dist/').pop();
      route.fulfill({ path: path.join(MERMAID_DIST, filename) });
    });

    await page.goto(`/${diagram.file}`);

    if (diagram.type === 'static') {
      await page.waitForLoadState('networkidle');
    } else {
      await page.waitForSelector('.mermaid svg', { timeout: 45000 });

      const svgRole = await page.locator('.mermaid svg').getAttribute('aria-roledescription');
      expect(svgRole, `${diagram.file}: Mermaid parse error`).not.toBe('error');

      if (['graph', 'classDiagram'].includes(diagram.type)) {
        await page.waitForFunction(
          () =>
            document.querySelector('.mermaid svg')?.querySelectorAll('g.node, g.cluster').length >
            0,
          { timeout: 30000 }
        );
      }

      if (diagram.type === 'sequence') {
        await page.waitForFunction(
          () =>
            document.querySelector('.mermaid svg')?.querySelectorAll('[class*="actor"]').length > 0,
          { timeout: 15000 }
        );
      }
    }

    const toggle = page.locator('#theme-toggle');
    if ((await toggle.count()) > 0) {
      await toggle.click();
      const theme = await page.locator('html').getAttribute('data-theme');
      expect(['dark', 'light']).toContain(theme);
      await toggle.click();
    }

    const styleSelect = page.locator('#style-select');
    if (diagram.type !== 'static' && (await styleSelect.count()) > 0) {
      await styleSelect.selectOption('minimal');
      await page.waitForSelector('.mermaid svg', { timeout: 30000 });
      const svgRoleAfter = await page.locator('.mermaid svg').getAttribute('aria-roledescription');
      expect(svgRoleAfter, `${diagram.file}: style switch caused parse error`).not.toBe('error');
      await styleSelect.selectOption('default');
      await page.waitForSelector('.mermaid svg', { timeout: 30000 });
    }

    const screenshotName = diagram.file.replace(/\//g, '-').replace('.html', '.png');
    await page.screenshot({ path: `tests/screenshots/${screenshotName}`, fullPage: true });
  });
}
