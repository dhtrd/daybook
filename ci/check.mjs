#!/usr/bin/env node
/* فحص ما قبل النشر — تدقيق ثابت سريع بلا متصفح (ثوانٍ بدل دقائق):
   (1) صياغة JavaScript لكل سكربت داخل index.html + sw.js
   (2) تدقيق المعالجات: كل App.xxx المُشار إليه في الواجهة معرّف فعلاً (كسر = خطأ)
   (3) اتساق الإصدار: معلومة فقط — يُزامَن تلقائياً عند النشر، فلا يوقف الرفع بملف واحد
   يخرج برمز 1 عند خطأ فعلي (صياغة أو معالج مكسور) فقط. */
import { readFileSync, writeFileSync, mkdtempSync, existsSync } from 'node:fs';
import { execSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

let errors = 0;
const ok   = (m) => console.log('✓ ' + m);
const bad  = (m) => { console.log('✗ ' + m); errors++; };
const info = (m) => console.log('i ' + m);

if (!existsSync('index.html')) { bad('لا يوجد index.html'); process.exit(1); }
const html = readFileSync('index.html', 'utf8');

/* (1) صياغة السكربتات الداخلية */
const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
  .filter(m => !/\bsrc\s*=/.test(m[1]) && m[2].trim())
  .map(m => m[2]);
const dir = mkdtempSync(join(tmpdir(), 'chk-'));
let synErr = 0, i = 0;
for (const s of scripts) {
  const f = join(dir, 's' + (i++) + '.js');
  writeFileSync(f, s);
  try { execSync('node --check ' + f, { stdio: 'pipe' }); }
  catch (e) { synErr++; bad('صياغة سكربت #' + i + ' في index.html: ' + String(e.stderr || e).split('\n').find(Boolean)); }
}
if (!synErr) ok('index.html: صياغة JavaScript سليمة (' + scripts.length + ' سكربت)');

if (existsSync('sw.js')) {
  try { execSync('node --check sw.js', { stdio: 'pipe' }); ok('sw.js: صياغة سليمة'); }
  catch (e) { bad('sw.js: خطأ صياغة'); }
}

/* (2) تدقيق المعالجات */
const referenced = new Set([...html.matchAll(/App\.([a-zA-Z_$][\w$]*)\s*\(/g)].map(m => m[1]));
const defined = new Set([...html.matchAll(/([a-zA-Z_$][\w$]*)\s*:\s*(?:async\s+)?function\b/g)].map(m => m[1]));
[...html.matchAll(/App\.([a-zA-Z_$][\w$]*)\s*=\s*(?:async\s+)?function/g)].forEach(m => defined.add(m[1]));
const missing = [...referenced].filter(n => !defined.has(n));
if (missing.length) bad('معالجات مكسورة (مُشار إليها وغير معرّفة): ' + missing.join(', '));
else ok('تدقيق المعالجات: لا استدعاءات مكسورة (' + referenced.size + ' معالجاً)');

/* معالجات معرّفة لكنها غير مُستدعاة نصياً (قد تُستدعى ديناميكياً) — معلومة فقط */
function appBlock() {
  const s = html.indexOf('var App=');
  if (s < 0) return '';
  let d = 0, j = html.indexOf('{', s);
  const start = j;
  for (; j < html.length; j++) { const c = html[j]; if (c === '{') d++; else if (c === '}') { d--; if (!d) return html.slice(start, j + 1); } }
  return '';
}
const appMethods = new Set([...appBlock().matchAll(/(?:^|[{,\s])([a-zA-Z_$][\w$]*)\s*:\s*(?:async\s+)?function\b/g)].map(m => m[1]));
const uninvoked = [...appMethods].filter(n => !referenced.has(n));
if (uninvoked.length) info('معالجات غير مُستدعاة نصياً (قد تكون ديناميكية): ' + uninvoked.join(', '));

/* (3) اتساق الإصدار — معلومة فقط */
const grabV = (s, re) => { const m = s && s.match(re); return m ? m[1] : '?'; };
const vI = grabV(html, /APP_VERSION\s*=\s*"([^"]+)"/);
let vS = '?', vJ = '?';
try { vS = grabV(readFileSync('sw.js', 'utf8'), /APP_VERSION\s*=\s*"([^"]+)"/); } catch {}
try { vJ = JSON.parse(readFileSync('version.json', 'utf8')).version; } catch {}
if (vI === vS && vI === vJ) ok('الإصدارات متطابقة: ' + vI);
else info('الإصدارات ستُزامَن تلقائياً عند النشر: index=' + vI + ' sw=' + vS + ' version.json=' + vJ);

console.log('');
console.log(errors ? ('✗ فشل الفحص: ' + errors + ' خطأ') : '✓ نجح الفحص — جاهز للنشر');
process.exit(errors ? 1 : 0);
