import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8');
const page = readFileSync(new URL('../app/page.tsx', import.meta.url), 'utf8');
assert.equal((css.match(/--blue\s*:/g) ?? []).length, 1, 'Accent blue must have one shared value across both themes');
assert.match(css, /--blue\s*:\s*#1256ff\s*;/);
assert.match(css, /\.cn-name\s*\{[^}]*writing-mode:horizontal-tb/);
assert.doesNotMatch(css, /\.cn-name[^{}]*\{[^}]*writing-mode:vertical/);
assert.match(page, /className="cn-name hero-layer layer-4"><span>周颖<\/span><small>游戏视觉设计师<\/small>/);
assert.doesNotMatch(css, /filter\s*:[^;{}]*invert\(/);
assert.match(css, /\.symbol-paper\s*\{[^}]*color:white/);
console.log('Horizontal Chinese name and shared blue accent checks passed.');
