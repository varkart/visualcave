#!/usr/bin/env node
/**
 * capture.js — Export visualcave HTML to GIF, PNG, SVG, or OG image
 *
 * Usage:
 *   node capture.js diagram.html                         → diagram.gif (animated)
 *   node capture.js diagram.html --format=png            → diagram.png (single frame)
 *   node capture.js diagram.html --format=svg            → diagram.svg (extracted SVG)
 *   node capture.js diagram.html --format=og             → diagram-og.png (1200×630 social card)
 *   node capture.js diagram.html --format=pdf            → diagram.pdf (A4, print-ready)
 *   node capture.js diagram.html out.gif --fps=12 --duration=5 --width=960
 *
 * Install deps first:
 *   npm install puppeteer gif-encoder-2 pngjs
 *
 * GIF tips:
 *   --fps=12       good quality  |  --fps=8 smaller file
 *   --duration=N   match CSS animation total length + 0.5s buffer
 *   --width=960    matches diagram max-width; 1920 for high-res
 */

const puppeteer = require('puppeteer');
const GIFEncoder = require('gif-encoder-2');
const { PNG }    = require('pngjs');
const fs         = require('fs');
const path       = require('path');

// ── Parse CLI args ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);

if (!args.length || args[0] === '--help') {
  console.log([
    '',
    ' Usage: node capture.js <input.html> [output] [options]',
    '',
    ' Formats:',
    '   --format=gif   Animated GIF (default)',
    '   --format=png   Single-frame PNG',
    '   --format=svg   Extracted inline SVG',
    '   --format=og    1200×630 OG/social card PNG',
    '   --format=pdf   A4 PDF, print-ready',
    '',
    ' GIF options:',
    '   --fps=N        Frames per second (default 12)',
    '   --duration=N   Seconds to capture (default 5)',
    '',
    ' Layout:',
    '   --width=N      Viewport width in px (default 960)',
    '',
  ].join('\n'));
  process.exit(0);
}

const inputFile = args.find(a => a.endsWith('.html'));
if (!inputFile) { console.error('Error: no .html input file provided'); process.exit(1); }
if (!fs.existsSync(inputFile)) { console.error(`Error: file not found: ${inputFile}`); process.exit(1); }

const format   = (args.find(a => a.startsWith('--format='))?.split('=')[1] ?? 'gif').toLowerCase();
const fps      = parseInt(args.find(a => a.startsWith('--fps='))?.split('=')[1]      ?? '12');
const duration = parseFloat(args.find(a => a.startsWith('--duration='))?.split('=')[1] ?? '5');
const width    = parseInt(args.find(a => a.startsWith('--width='))?.split('=')[1]    ?? (format === 'og' ? '1200' : '960'));

const extMap   = { gif: '.gif', png: '.png', svg: '.svg', og: '-og.png', pdf: '.pdf' };
const ext      = extMap[format] ?? '.gif';
const outputFile = args.find(a => !a.startsWith('--') && !a.endsWith('.html'))
               ?? inputFile.replace('.html', ext);

// ── Helpers ───────────────────────────────────────────────────────────────────

function pngBufToPixels(buf) {
  return new Promise((resolve, reject) => {
    new PNG().parse(buf, (err, png) => {
      if (err) reject(err);
      else resolve({ data: png.data, width: png.width, height: png.height });
    });
  });
}

function formatSize(bytes) {
  return bytes > 1024 * 1024
    ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
    : `${Math.round(bytes / 1024)} KB`;
}

// Prefer system Chrome — bundled puppeteer headless has screenshot timeout issues on macOS
const SYSTEM_CHROME = [
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium-browser',
].find(p => { try { fs.accessSync(p); return true; } catch { return false; } });

async function launchPage(vpWidth, vpHeight) {
  const browser = await puppeteer.launch({
    headless: true,
    executablePath: SYSTEM_CHROME || undefined,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    protocolTimeout: 60000,
  });
  const page = await browser.newPage();
  page.setDefaultTimeout(60000);
  page.setDefaultNavigationTimeout(30000);

  // Block external fonts to prevent load event hanging
  await page.setRequestInterception(true);
  page.on('request', req => {
    if (req.resourceType() === 'font' && req.url().startsWith('http')) req.abort();
    else req.continue();
  });

  await page.setViewport({ width: vpWidth, height: vpHeight, deviceScaleFactor: 1 });
  return { browser, page };
}

async function loadDiagram(page, url, vpWidth) {
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
  // Wait for Mermaid SVG if present (fonts.ready + mermaid.initialize are async)
  await page.waitForSelector('.mermaid svg', { timeout: 10000 }).catch(() => {});
  const scrollH = await page.evaluate(() => document.body.scrollHeight);
  const h = Math.min(scrollH, 2400);
  await page.setViewport({ width: vpWidth, height: h, deviceScaleFactor: 1 });
  return h;
}

// ── Main ──────────────────────────────────────────────────────────────────────

(async () => {
  const absPath = path.resolve(inputFile);
  const url     = `file://${absPath}`;

  console.log(`\n visualcave → ${format.toUpperCase()}`);
  console.log(` Input:  ${inputFile}`);
  console.log(` Output: ${outputFile}\n`);

  // ════════════════════════════════════════════════════════
  // SVG — extract inline SVG from HTML, no browser needed
  // ════════════════════════════════════════════════════════
  if (format === 'svg') {
    const html = fs.readFileSync(inputFile, 'utf8');
    const match = html.match(/<svg[\s\S]*?<\/svg>/i);
    if (!match) { console.error('Error: no <svg> found in HTML'); process.exit(1); }
    fs.writeFileSync(outputFile, match[0]);
    console.log(` ✓ Saved ${outputFile} (${formatSize(Buffer.byteLength(match[0]))})\n`);
    return;
  }

  // ════════════════════════════════════════════════════════
  // PNG — single screenshot at full content height
  // ════════════════════════════════════════════════════════
  if (format === 'png') {
    const { browser, page } = await launchPage(width, 900);
    await loadDiagram(page, url, width);
    const buf = await page.screenshot({ type: 'png', timeout: 60000 });
    await browser.close();
    fs.writeFileSync(outputFile, buf);
    console.log(` ✓ Saved ${outputFile} (${formatSize(buf.length)})\n`);
    return;
  }

  // ════════════════════════════════════════════════════════
  // OG image — 1200×630, clips to card top area
  // ════════════════════════════════════════════════════════
  if (format === 'og') {
    const ogH = 630;
    const { browser, page } = await launchPage(1200, ogH);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    await page.waitForSelector('.mermaid svg', { timeout: 10000 }).catch(() => {});
    const buf = await page.screenshot({
      type: 'png',
      clip: { x: 0, y: 0, width: 1200, height: ogH },
      timeout: 60000,
    });
    await browser.close();
    fs.writeFileSync(outputFile, buf);
    console.log(` ✓ Saved ${outputFile} (1200×630, ${formatSize(buf.length)})\n`);
    return;
  }

  // ════════════════════════════════════════════════════════
  // PDF — A4 print-ready, full content height
  // ════════════════════════════════════════════════════════
  if (format === 'pdf') {
    const { browser, page } = await launchPage(960, 900);
    await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 });
    // Wait for Mermaid SVG to render (fonts.ready + mermaid.initialize are async)
    await page.waitForSelector('.mermaid svg', { timeout: 15000 }).catch(() => {});
    await page.pdf({
      path: outputFile,
      format: 'A4',
      printBackground: true,
      margin: { top: '16px', bottom: '16px', left: '16px', right: '16px' },
    });
    await browser.close();
    const size = fs.statSync(outputFile).size;
    console.log(` ✓ Saved ${outputFile} (${formatSize(size)})\n`);
    return;
  }

  // ════════════════════════════════════════════════════════
  // GIF — multi-frame animated capture
  // ════════════════════════════════════════════════════════
  const frameCount    = Math.round(fps * duration);
  const frameInterval = Math.round(1000 / fps);

  console.log(` Settings: ${fps}fps × ${duration}s = ${frameCount} frames`);

  const { browser, page } = await launchPage(width, 900);
  await loadDiagram(page, url, width);

  const firstShot = await page.screenshot({ type: 'png', timeout: 60000 });
  const { width: imgW, height: imgH } = await pngBufToPixels(firstShot);
  console.log(` Canvas:   ${imgW}×${imgH}px\n`);

  const encoder = new GIFEncoder(imgW, imgH, 'neuquant', true);
  const chunks  = [];
  const readStream = encoder.createReadStream();
  readStream.on('data', chunk => chunks.push(chunk));
  const streamDone = new Promise(resolve => readStream.on('end', resolve));

  encoder.start();
  encoder.setFrameRate(fps);
  encoder.setQuality(10);
  encoder.setRepeat(0);

  const { data: firstData } = await pngBufToPixels(firstShot);
  encoder.addFrame(firstData);

  for (let i = 1; i < frameCount; i++) {
    await new Promise(r => setTimeout(r, frameInterval));
    const shot = await page.screenshot({ type: 'png', timeout: 60000 });
    const { data } = await pngBufToPixels(shot);
    encoder.addFrame(data);
    process.stdout.write(`\r Capturing frame ${i + 1}/${frameCount}...`);
  }

  encoder.finish();
  await streamDone;
  await browser.close();

  const gifBuffer = Buffer.concat(chunks);
  fs.writeFileSync(outputFile, gifBuffer);
  console.log(`\n\n ✓ Saved ${outputFile} (${formatSize(gifBuffer.length)})\n`);

})().catch(err => {
  console.error('\n Error:', err.message);
  process.exit(1);
});
