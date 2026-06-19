#!/usr/bin/env node
// Adds theme selector to all example HTML files
const fs = require('fs');
const path = require('path');

const EXAMPLES_DIR = path.join(__dirname, '../examples');
const files = fs.readdirSync(EXAMPLES_DIR).filter(f => f.endsWith('.html'));

const CSS_INSERT = `    select.style-select { font:600 13px 'Inter',sans-serif; padding:9px 12px; border-radius:12px; cursor:pointer; border:1px solid var(--border); background:var(--card-bg); color:var(--text-main); outline:none; transition:border-color 0.2s ease; }
    select.style-select:hover { border-color:var(--accent); }`;

const SELECT_HTML = `        <select class="style-select" id="style-select" onchange="setDiagramStyle(this.value)">
          <option value="default">Default</option>
          <option value="minimal">Minimal</option>
          <option value="pastel">Pastel</option>
          <option value="print">Print</option>
        </select>`;

// Uses _md (already defined as the .mermaid element) — works regardless of selector style
const THEMES_JS = `    const THEMES = {
      default: { theme:'base',    vars:{ primaryColor:'#FFFDE7', primaryBorderColor:'#1A1A1A', primaryTextColor:'#1A1A1A', lineColor:'#424242', clusterBkg:'#F8F9FA', clusterBorder:'#1A1A1A' }, classDefs:{ yellow:'fill:#FFFDE7,stroke:#1A1A1A,stroke-width:2px', blue:'fill:#E3F2FD,stroke:#1A1A1A,stroke-width:2px', green:'fill:#E8F5E9,stroke:#1A1A1A,stroke-width:2px', purple:'fill:#F3E5F5,stroke:#1A1A1A,stroke-width:2px', teal:'fill:#E0F7FA,stroke:#1A1A1A,stroke-width:2px', orange:'fill:#FFF3E0,stroke:#1A1A1A,stroke-width:2px', note:'fill:#FFF9C4,stroke:#FBC02D,stroke-dasharray:4' } },
      minimal:  { theme:'neutral', vars:{ primaryColor:'#F8FAFC', primaryBorderColor:'#CBD5E1', primaryTextColor:'#111827', lineColor:'#94A3B8', clusterBkg:'#F8FAFC', clusterBorder:'#E2E8F0' }, classDefs:{ yellow:'fill:#FFFFFF,stroke:#D1D5DB,stroke-width:1.5px', blue:'fill:#F8FAFC,stroke:#CBD5E1,stroke-width:1.5px', green:'fill:#F0FDF4,stroke:#86EFAC,stroke-width:1.5px', purple:'fill:#FAF5FF,stroke:#D8B4FE,stroke-width:1.5px', teal:'fill:#F0FDFA,stroke:#99F6E4,stroke-width:1.5px', orange:'fill:#FFF7ED,stroke:#FED7AA,stroke-width:1.5px', note:'fill:#FEFCE8,stroke:#FDE047,stroke-dasharray:4' } },
      pastel:   { theme:'base',    vars:{ primaryColor:'#FEF3C7', primaryBorderColor:'#F59E0B', primaryTextColor:'#1A1A1A', lineColor:'#6B7280', clusterBkg:'#FFF7ED', clusterBorder:'#FED7AA' }, classDefs:{ yellow:'fill:#FEF3C7,stroke:#F59E0B,stroke-width:2px', blue:'fill:#DBEAFE,stroke:#60A5FA,stroke-width:2px', green:'fill:#D1FAE5,stroke:#34D399,stroke-width:2px', purple:'fill:#EDE9FE,stroke:#A78BFA,stroke-width:2px', teal:'fill:#CFFAFE,stroke:#22D3EE,stroke-width:2px', orange:'fill:#FFE4E6,stroke:#FB7185,stroke-width:2px', note:'fill:#FEF9C3,stroke:#FBBF24,stroke-dasharray:4' } },
      print:    { theme:'base',    vars:{ primaryColor:'#FFFFFF', primaryBorderColor:'#000000', primaryTextColor:'#000000', lineColor:'#333333', clusterBkg:'#F5F5F5', clusterBorder:'#000000' }, classDefs:{ yellow:'fill:#FFFFFF,stroke:#000000,stroke-width:2px', blue:'fill:#F5F5F5,stroke:#000000,stroke-width:2px', green:'fill:#EBEBEB,stroke:#000000,stroke-width:2px', purple:'fill:#E0E0E0,stroke:#000000,stroke-width:2px', teal:'fill:#D6D6D6,stroke:#000000,stroke-width:2px', orange:'fill:#CCCCCC,stroke:#000000,stroke-width:2px', note:'fill:#FFFFE0,stroke:#888,stroke-dasharray:4' } },
    };
    async function applyStyle(name) {
      const t = THEMES[name] || THEMES.default;
      const el = _md;
      let src = el.dataset.source;
      for (const [cn, def] of Object.entries(t.classDefs)) {
        src = src.replace(new RegExp(\`(classDef\\\\s+\${cn}\\\\s+)[^;\\\\n]+\`, 'g'), \`$1\${def}\`);
      }
      el.textContent = src;
      el.removeAttribute('data-processed');
      mermaid.initialize({ startOnLoad:false, theme:t.theme, flowchart:{ htmlLabels:true, useMaxWidth:true, padding:100 }, themeVariables:{ fontFamily:'Inter, sans-serif', ...t.vars } });
      await mermaid.run({ nodes:[el] });
      try { localStorage.setItem('vc-style', name); } catch(e) {}
    }
    const _saved = (() => { try { return localStorage.getItem('vc-style') || 'default'; } catch(e) { return 'default'; } })();
    const _sel = document.getElementById('style-select');
    if (_sel && _saved !== 'default') _sel.value = _saved;
    window.setDiagramStyle = applyStyle;`;

// Patterns for old init blocks (both styles that exist in examples)
// Pattern 1: document.fonts.ready.then(() => { mermaid.initialize({ startOnLoad: true, ... }); });
const OLD_FONTS_PATTERN = /document\.fonts\.ready\.then\(\(\) => \{\s*mermaid\.initialize\(\{[\s\S]*?startOnLoad: true[\s\S]*?\}\);\s*\}\);/;
// Pattern 2: bare mermaid.initialize({ startOnLoad: true, ... }); (no fonts.ready wrapper)
const OLD_BARE_PATTERN = /\s*mermaid\.initialize\(\{\s*startOnLoad: true[\s\S]*?\}\);\s*\n/;

const NEW_INIT = `document.fonts.ready.then(() => applyStyle(_saved));\n`;

// Static files (no mermaid) — skip entirely
const STATIC_FILES = new Set(['ecommerce-order-flow.html', 'architecture-api-gateway.html', 'pipeline-cicd.html']);

let updated = 0;
let skipped = 0;
let errors = 0;

for (const file of files) {
  const filePath = path.join(EXAMPLES_DIR, file);
  let html = fs.readFileSync(filePath, 'utf8');

  if (html.includes('style-select')) {
    console.log(`SKIP (already done): ${file}`);
    skipped++; continue;
  }
  if (STATIC_FILES.has(file)) {
    console.log(`SKIP (static): ${file}`);
    skipped++; continue;
  }
  if (!html.includes('class="mermaid"') && !html.includes("class='mermaid'")) {
    console.log(`SKIP (no mermaid div): ${file}`);
    skipped++; continue;
  }

  // Step 1: Replace OLD init block first (before injecting new code)
  let initReplaced = false;
  if (OLD_FONTS_PATTERN.test(html)) {
    html = html.replace(OLD_FONTS_PATTERN, NEW_INIT);
    initReplaced = true;
  } else if (OLD_BARE_PATTERN.test(html)) {
    html = html.replace(OLD_BARE_PATTERN, `\n    ${NEW_INIT}`);
    initReplaced = true;
  }

  if (!initReplaced) {
    console.log(`WARN: no init pattern found in ${file} — skipping`);
    errors++; continue;
  }

  // Step 2: Add CSS before @media rule
  html = html.replace(
    '    @media (prefers-reduced-motion',
    CSS_INSERT + '\n    @media (prefers-reduced-motion'
  );

  // Step 3: Add select to controls (before first button)
  html = html.replace(
    /(<div class="controls">\s*\n(\s*))<button/,
    (_, pre, indent) => `${pre}${SELECT_HTML}\n${indent}<button`
  );

  // Step 4: Inject THEMES + applyStyle after _md.dataset.source line
  html = html.replace(
    /(_md\.dataset\.source = _md\.textContent\.trim\(\);)/,
    (_, match) => `${match}\n${THEMES_JS}`
  );

  // Step 5: Fix controls flex wrap
  html = html.replace(
    '.controls { display:flex; gap:12px; }',
    '.controls { display:flex; gap:12px; align-items:center; flex-wrap:wrap; }'
  );

  fs.writeFileSync(filePath, html, 'utf8');
  console.log(`UPDATED: ${file}`);
  updated++;
}

console.log(`\nDone: ${updated} updated, ${skipped} skipped, ${errors} errors`);
