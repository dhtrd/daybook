#!/usr/bin/env node
/* يفحص صياغة كل <script> داخل صفحات apps/ (بما فيها type=module) — يخرج برمز 1 عند أي خطأ. */
import { readFileSync, readdirSync, mkdtempSync, writeFileSync, statSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const root = new URL('..', import.meta.url).pathname;
const pages = [];
const walk = (d) => { for (const n of readdirSync(d)) { const p = join(d, n); statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') && pages.push(p); } };
walk(join(root, 'apps'));

const tmp = mkdtempSync(join(tmpdir(), 'hs-'));
let errors = 0, i = 0;
for (const f of pages) {
  const html = readFileSync(f, 'utf8');
  for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
    if (/\bsrc\s*=/.test(m[1]) || !m[2].trim()) continue;
    const out = join(tmp, `s${i++}.mjs`);
    writeFileSync(out, m[2]);
    try { execSync(`node --check ${out}`, { stdio: 'pipe' }); }
    catch (e) { errors++; console.log(`✗ ${f}: ${String(e.stderr || e).split('\n').find(Boolean)}`); }
  }
}
if (errors) process.exit(1);
console.log(`✓ ${pages.length} صفحة — كل السكربتات سليمة`);
