#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const WARN_FILES = [
  'architecture-api-gateway.html',
  'oauth-flow.html',
  'pipeline-cicd.html',
  'transformer-animated.html',
  'transformer-architecture.html',
  'transformer-pro.html',
];

// Matches: mermaid.initialize({ startOnLoad: true, ... }); — handles any content between
const OLD_INIT_RE = /\s*mermaid\.initialize\(\{[\s\S]*?startOnLoad:\s*true[\s\S]*?\}\);\s*/g;
const NEW_INIT = '\n    document.fonts.ready.then(() => applyStyle(_saved));\n    ';

const dir = path.join(__dirname, '../examples');
for (const file of WARN_FILES) {
  const fp = path.join(dir, file);
  let html = fs.readFileSync(fp, 'utf8');

  if (!OLD_INIT_RE.test(html)) {
    console.log(`SKIP (no match): ${file}`);
    OLD_INIT_RE.lastIndex = 0;
    continue;
  }
  OLD_INIT_RE.lastIndex = 0;

  html = html.replace(OLD_INIT_RE, NEW_INIT);
  fs.writeFileSync(fp, html, 'utf8');
  console.log(`FIXED: ${file}`);
}
