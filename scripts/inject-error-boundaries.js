#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const EXAMPLES_DIR = path.join(ROOT, 'examples');
const TEMPLATE_PATH = path.join(ROOT, 'references', 'template.html');

const files = fs
  .readdirSync(EXAMPLES_DIR)
  .filter((f) => f.endsWith('.html'))
  .map((f) => path.join(EXAMPLES_DIR, f));
files.push(TEMPLATE_PATH);

const TARGET = /([ \t]+)(await\s+mermaid\.run\(\{\s*nodes:\s*\[el\]\s*\}\);)/;

const REPLACEMENT = `$1try {
$1  await mermaid.run({ nodes:[el] });
$1} catch (err) {
$1  console.error('Mermaid render error:', err);
$1  el.style.opacity = '1';
$1  el.innerHTML = \`<div style="padding: 24px; border: 2px dashed #EF4444; border-radius: 16px; background: rgba(239, 68, 68, 0.08); color: #EF4444; font-family: 'JetBrains Mono', monospace; font-size: 14px; text-align: left; max-width: 800px; margin: 0 auto; box-sizing: border-box;">
          <h3 style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 18px; font-weight: 800;">⚠️ Mermaid Render Error</h3>
          <p style="margin: 0 0 16px 0; font-size: 14px; opacity: 0.9;">Failed to parse or render the diagram. Please review the Mermaid syntax below:</p>
          <pre style="margin: 0; white-space: pre-wrap; word-break: break-all; background: rgba(0, 0, 0, 0.05); padding: 16px; border-radius: 8px; border: 1px solid rgba(239, 68, 68, 0.2); font-size: 13px; color: inherit; overflow-x: auto;">\${err.message || err}</pre>
        </div>\`;
$1}`;

let updated = 0;
let skipped = 0;

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let content = fs.readFileSync(file, 'utf8');

  if (content.includes('Mermaid render error:')) {
    skipped++;
    continue;
  }

  if (TARGET.test(content)) {
    content = content.replace(TARGET, REPLACEMENT);
    fs.writeFileSync(file, content, 'utf8');
    console.log(`Injected error boundary into: ${path.relative(ROOT, file)}`);
    updated++;
  } else {
    skipped++;
  }
}

console.log(`\nInjection finished: ${updated} updated, ${skipped} skipped.`);
