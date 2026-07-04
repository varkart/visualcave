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

test('capture.js PNG is not clipped at 2400px for tall pages', async () => {
  test.setTimeout(120000);
  const tallHtml = path.join(__dirname, 'screenshots', 'capture-tall.html');
  const tallOut = path.join(__dirname, 'screenshots', 'capture-tall.png');
  fs.writeFileSync(
    tallHtml,
    '<!DOCTYPE html><html><body style="margin:0">' +
      '<div class="page" style="height:3200px;background:linear-gradient(#fff,#ccc)">tall</div>' +
      '</body></html>'
  );
  fs.rmSync(tallOut, { force: true });
  execFileSync(process.execPath, ['capture.js', tallHtml, tallOut, '--format=png'], {
    cwd: ROOT,
    stdio: 'pipe',
    timeout: 90000,
  });
  const png = PNG.sync.read(fs.readFileSync(tallOut));
  expect(png.height, 'tall page should not be clipped to 2400px').toBeGreaterThan(2400);
});

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
