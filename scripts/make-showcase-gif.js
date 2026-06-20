#!/usr/bin/env node
// One-off script — generates assets/showcase.gif from multiple examples
// Usage: node scripts/make-showcase-gif.js
// Requires: puppeteer, gif-encoder-2, pngjs (all in package.json)

const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder-2');
const { PNG } = require('pngjs');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(ROOT, 'assets', 'showcase.gif');
const PORT = 3099;
const W = 800;
const H = 460;
const FPS = 8;
const HOLD_S = 2.5; // seconds per slide
const FRAMES = Math.round(FPS * HOLD_S);

const SLIDES = [
  { file: 'examples/transformer-deep-dive.html', label: 'Flowchart + step-through' },
  { file: 'examples/oauth-flow.html', label: 'Sequence diagram' },
  { file: 'examples/state-machine.html', label: 'State machine' },
  { file: 'examples/git-graph.html', label: 'Git graph' },
  { file: 'examples/er-diagram.html', label: 'ER diagram' },
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
  return new Promise((resolve) => srv.listen(PORT, () => resolve(srv)));
}

// ── Main ──────────────────────────────────────────────────────────────────────
(async () => {
  const srv = await startServer();
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });

  const encoder = new GIFEncoder(W, H, 'neuquant', true);
  const outStream = fs.createWriteStream(OUT);
  encoder.createReadStream().pipe(outStream);
  encoder.start();
  encoder.setRepeat(0);
  encoder.setDelay(Math.round(1000 / FPS));
  encoder.setQuality(12);

  console.log(`Generating ${SLIDES.length}-slide showcase GIF → ${OUT}`);

  for (const slide of SLIDES) {
    console.log(`  Capturing: ${slide.file}`);
    await page.goto(`http://localhost:${PORT}/${slide.file}`, {
      waitUntil: 'networkidle2',
      timeout: 20000,
    });

    // Wait for Mermaid SVG
    try {
      await page.waitForSelector('.mermaid svg', { timeout: 15000 });
      await new Promise((r) => setTimeout(r, 800));
    } catch {
      await new Promise((r) => setTimeout(r, 2000));
    }

    const raw = await page.screenshot({ encoding: 'binary' });
    const png = PNG.sync.read(Buffer.from(raw));

    for (let f = 0; f < FRAMES; f++) {
      encoder.addFrame(png.data);
    }
  }

  encoder.finish();
  await new Promise((r) => outStream.on('finish', r));
  await browser.close();
  srv.close();

  const size = (fs.statSync(OUT).size / 1024 / 1024).toFixed(1);
  console.log(`Done. ${size}MB → ${OUT}`);
})();
