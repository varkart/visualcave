// Exercises capture.js end-to-end: spawn the CLI, assert a valid PNG lands.
// PNG is the fastest format (single frame); it covers browser resolution,
// page load, and screenshot plumbing shared by all formats.

const { test, expect } = require('@playwright/test');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { PNG } = require('pngjs');

const ROOT = path.join(__dirname, '..');
const OUT = path.join(__dirname, 'screenshots', 'capture-cli-pie.png');

test('capture.js exports a valid PNG', async () => {
  test.setTimeout(120000);
  fs.rmSync(OUT, { force: true });
  execFileSync(process.execPath, ['capture.js', 'examples/pie-chart.html', OUT, '--format=png'], {
    cwd: ROOT,
    stdio: 'pipe',
    timeout: 90000,
  });
  expect(fs.existsSync(OUT), 'output PNG missing').toBe(true);
  const png = PNG.sync.read(fs.readFileSync(OUT));
  expect(png.width).toBeGreaterThan(100);
  expect(png.height).toBeGreaterThan(100);
});
