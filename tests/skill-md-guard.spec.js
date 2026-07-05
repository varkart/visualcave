// Guards the two SKILL.md copies and the word budget.
//
// skills/visualcave/SKILL.md is a deliberate mirror of SKILL.md required by
// the Antigravity CLI (agy) plugin loader. Any edit to one must be applied to
// both. SKILL.md is loaded on every skill invocation, so it must stay within
// the 700-word budget documented in CLAUDE.md.

const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const CANONICAL = path.join(ROOT, 'SKILL.md');
const MIRROR = path.join(ROOT, 'skills', 'visualcave', 'SKILL.md');

test('SKILL.md and skills/visualcave/SKILL.md are byte-identical', () => {
  const canonical = fs.readFileSync(CANONICAL);
  const mirror = fs.readFileSync(MIRROR);
  expect(
    canonical.equals(mirror),
    'skills/visualcave/SKILL.md (agy plugin mirror) is out of sync with SKILL.md — copy the canonical file over it'
  ).toBe(true);
});

test('SKILL.md stays within the 700-word budget', () => {
  const words = fs.readFileSync(CANONICAL, 'utf8').split(/\s+/).filter(Boolean).length;
  expect(words, `SKILL.md is ${words} words; budget is 700`).toBeLessThanOrEqual(700);
});
