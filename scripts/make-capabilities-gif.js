#!/usr/bin/env node
// Generates assets/capabilities.gif — showcases the capability filter on the index page
// Usage: node scripts/make-capabilities-gif.js
// Requires: puppeteer, gif-encoder-2, pngjs (all in package.json)

const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder-2');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'capabilities.gif');
const W = 1200;
const H = 680;
const FPS = 10;

// ── Sequence: [action, holdSeconds, label]
// action: null = initial, string = data-filter value to click, 'deselect' = click active cap
const SEQUENCE = [
  { action: null, hold: 2.0, label: 'All examples' },
  { action: 'step-through', hold: 2.5, label: 'Step-through reveal' },
  { action: 'deselect', hold: 0.6, label: '' },
  { action: 'animated', hold: 2.5, label: 'CSS flow animation' },
  { action: 'deselect', hold: 0.6, label: '' },
  { action: 'canvas', hold: 2.5, label: 'Canvas animation' },
  { action: 'deselect', hold: 0.6, label: '' },
  { action: 'mermaid', hold: 2.0, label: 'Mermaid diagrams' },
  { action: 'deselect', hold: 1.0, label: '' },
];

// ── Simple static file server ─────────────────────────────────────────────────
function startServer() {
  const mime = {
    html: 'text/html',
    js: 'application/javascript',
    css: 'text/css',
    png: 'image/png',
    svg: 'image/svg+xml',
    gif: 'image/gif',
    woff2: 'font/woff2',
    ico: 'image/x-icon',
  };
  const srv = http.createServer((req, res) => {
    const fp = path.join(ROOT, req.url.split('?')[0]);
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404);
      res.end();
      return;
    }
    const ext = path.extname(fp).slice(1);
    res.writeHead(200, { 'Content-Type': mime[ext] || 'application/octet-stream' });
    fs.createReadStream(fp).pipe(res);
  });
  // Pass 0 so the OS picks a free port — avoids Chrome's unsafe-port blocklist
  return new Promise((resolve) =>
    srv.listen(0, () => resolve({ srv, port: srv.address().port }))
  );
}

// ── PNG frame → raw RGBA buffer ──────────────────────────────────────────────
function pngToRgba(buf) {
  const png = PNG.sync.read(buf);
  return { data: png.data, width: png.width, height: png.height };
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  console.log('Starting server...');
  const { srv, port } = await startServer();
  console.log(`  listening on http://localhost:${port}`);

  console.log('Launching browser...');
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  console.log('Loading page...');
  await page.goto(`http://localhost:${port}/index.html`, { waitUntil: 'networkidle2' });

  // Scroll slightly so caps strip + first row of cards are fully visible
  await page.evaluate(() => window.scrollTo(0, 80));
  await new Promise((r) => setTimeout(r, 600));

  // ── GIF encoder ─────────────────────────────────────────────────────────────
  const encoder = new GIFEncoder(W, H, 'neuquant', true);
  const writeStream = fs.createWriteStream(OUT);
  encoder.createReadStream().pipe(writeStream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setQuality(10);
  encoder.setDelay(Math.round(1000 / FPS));

  async function captureFrames(count) {
    for (let i = 0; i < count; i++) {
      const raw = await page.screenshot({ type: 'png' });
      const { data } = pngToRgba(Buffer.from(raw)); // Uint8Array → Buffer for pngjs
      encoder.addFrame(data);
    }
  }

  // ── Run sequence ──────────────────────────────────────────────────────────
  let lastActive = null;

  for (const step of SEQUENCE) {
    if (step.label) console.log(`  → ${step.label}`);

    if (step.action === null) {
      // Initial state — just capture
    } else if (step.action === 'deselect') {
      // Click the currently active cap to deselect
      if (lastActive) {
        await page.click(`.cap[data-filter="${lastActive}"]`);
        await new Promise((r) => setTimeout(r, 280));
        lastActive = null;
      }
    } else {
      // Click a capability
      await page.click(`.cap[data-filter="${step.action}"]`);
      await new Promise((r) => setTimeout(r, 320));
      lastActive = step.action;
    }

    await captureFrames(Math.round(FPS * step.hold));
  }

  encoder.finish();

  await new Promise((resolve) => writeStream.on('finish', resolve));
  await browser.close();
  srv.close(() => {});

  const size = (fs.statSync(OUT).size / 1024).toFixed(0);
  console.log(`\nDone → ${OUT}  (${size} KB)`);
  console.log(`Dimensions: ${W}×${H}  FPS: ${FPS}`);
  console.log('\nTo compress further:');
  console.log('  gifsicle -O3 --lossy=80 -o assets/capabilities-opt.gif assets/capabilities.gif');
})();
