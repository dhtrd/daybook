/* اختبارات هيكل المرحلة 0: RTL، البيان (manifest)، غياب الأسرار، سلامة وحدات الهوية. */
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { execSync } from 'node:child_process';

const root = new URL('..', import.meta.url).pathname;
const APPS = ['yawmiya', 'iqfaliyat', 'sales-report', 'settings'];

test('كل تطبيق له صفحة RTL عربية وبيان تثبيت صالح', () => {
  for (const a of APPS) {
    const html = readFileSync(join(root, 'apps', a, 'index.html'), 'utf8');
    assert.match(html, /<html lang="ar" dir="rtl">/, a + ': لا RTL');
    assert.match(html, /name="viewport"/, a + ': لا viewport');
    const m = JSON.parse(readFileSync(join(root, 'apps', a, 'manifest.webmanifest'), 'utf8'));
    assert.equal(m.dir, 'rtl'); assert.equal(m.lang, 'ar');
    assert.equal(m.start_url, './'); assert.equal(m.scope, './');
    assert.match(m.name, /^حصاد · /, a + ': اسم التثبيت');
  }
});

test('صفحة المعاينة تعرض التطبيقات الأربعة وتعلن أنها بيئة تجريبية', () => {
  const html = readFileSync(join(root, 'apps', 'index.html'), 'utf8');
  assert.match(html, /لا شيء هنا حقيقي/);
  assert.match(html, /noindex/);
});

test('وحدة الهوية: شعار كل تطبيق يُولَّد، وتطبيق مجهول يُرفض (لا صمت)', async () => {
  const ui = await import(join(root, 'shared', 'ui.js'));
  for (const id of Object.keys(ui.APPS)) {
    const svg = ui.appMark(id, { dark: false, size: 48 });
    assert.match(svg, /^<svg /); assert.match(svg, new RegExp(ui.APPS[id].name));
    assert.ok(ui.appMark(id, { dark: true }).includes('#8CC4A9'));
  }
  assert.throws(() => ui.appMark('nope'), /تطبيق غير معروف/);
  assert.throws(() => ui.money('abc'), /مبلغ غير صالح/);
  assert.match(ui.money(-165), /−/);
});

test('الهوية: المتغيرات المعتمدة موجودة بقيمها', () => {
  const css = readFileSync(join(root, 'shared', 'identity.css'), 'utf8');
  for (const v of ['--bg:#F2F4F2', '--acc:#3F6E5A', '--bg:#111513', '--acc:#8CC4A9']) assert.ok(css.includes(v), v);
});

test('لا أسرار ولا مفاتيح خاصة في الملفات الجديدة', () => {
  const bad = [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, /AKIA[0-9A-Z]{16}/, /ghp_[A-Za-z0-9]{30,}/, /"private_key"\s*:/, /refresh_token\s*[:=]\s*["'][^"']{10,}/i, /client_secret\s*[:=]\s*["'][^"']{6,}/i, /api[_-]?key["']?\s*[:=]\s*["'][A-Za-z0-9_\-]{20,}/i];
  const walk = (d) => readdirSync(d).flatMap(n => {
    if (['node_modules', '.git', 'dist'].includes(n)) return [];
    const p = join(d, n); return statSync(p).isDirectory() ? walk(p) : [p];
  });
  const scope = ['apps', 'shared', 'scripts', 'tests', 'workers', 'docs', '.github'].map(x => join(root, x)).filter(existsSync);
  const hits = [];
  for (const dir of scope) for (const f of walk(dir)) {
    if (!['.js', '.mjs', '.html', '.css', '.json', '.yml', '.md', '.webmanifest'].includes(extname(f))) continue;
    if (f.endsWith('structure.test.mjs')) continue; // هذا الملف يحوي أنماط الفحص نفسها
    const t = readFileSync(f, 'utf8');
    for (const re of bad) if (re.test(t)) hits.push(f + ' ~ ' + re);
  }
  assert.deepEqual(hits, [], 'أسرار محتملة:\n' + hits.join('\n'));
});

test('البناء ينتج dist بكل التطبيقات ووحدات shared', () => {
  execSync('node scripts/build.mjs', { cwd: root, stdio: 'pipe' });
  for (const p of ['index.html', 'shared/ui.js', 'shared/identity.css', ...APPS.map(a => a + '/index.html')]) assert.ok(existsSync(join(root, 'dist', p)), p);
});
