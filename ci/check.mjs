// فحص ما قبل النشر — يمنع وصول نسخة مكسورة إلى الموقع
import {readFileSync,writeFileSync} from 'fs';
import {execSync} from 'child_process';
let fails=0;
const fail=m=>{console.error("✗ "+m);fails++};
const ok=m=>console.log("✓ "+m);

// 1) صياغة سكربتات index.html
const html=readFileSync('index.html','utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(t=>t.trim());
writeFileSync('/tmp/_app.js',scripts.join('\n'));
try{execSync('node --check /tmp/_app.js',{stdio:'pipe'});ok('index.html: صياغة JavaScript سليمة')}
catch(e){fail('index.html: خطأ صياغة\n'+e.stderr)}

// 2) صياغة sw.js
try{execSync('node --check sw.js',{stdio:'pipe'});ok('sw.js: صياغة سليمة')}
catch(e){fail('sw.js: خطأ صياغة\n'+e.stderr)}

// 3) تطابق الإصدارات الثلاثة
const v1=(html.match(/APP_VERSION="([^"]+)"/)||[])[1];
const sw=readFileSync('sw.js','utf8');
const v2=(sw.match(/APP_VERSION\s*=\s*"([^"]+)"/)||[])[1];
const v3=JSON.parse(readFileSync('version.json','utf8')).version;
if(v1&&v1===v2&&v2===v3)ok('الإصدارات متطابقة: '+v1);
else fail(`الإصدارات غير متطابقة: index=${v1} sw=${v2} version.json=${v3}`);

// 4) تدقيق معالجات App: كل App.x() المستدعى نصياً يجب أن يكون معرّفاً
const js=scripts.join('\n');
const called=new Set([...js.matchAll(/App\.([a-zA-Z0-9_]+)\s*\(/g)].map(m=>m[1]));
const body=(js.match(/window\.App=\{([\s\S]*?)\n\};/)||[])[1]||'';
const defined=new Set([...body.matchAll(/([a-zA-Z0-9_]+)\s*:\s*(?:async\s+)?function/g)].map(m=>m[1]));
const dyn=new Set(['dashFrom','dashTo','rfFrom','rfTo','setDateTo','itFrom','itTo','bScope','cmp','itType','rMonth','rfBrToggle','yr','yrHide','yrShow','moveDayTo']);
const missing=[...called].filter(x=>!defined.has(x));
if(missing.length)fail('معالجات مستدعاة غير معرّفة: '+missing.join(', '));
else ok('تدقيق المعالجات: لا استدعاءات مكسورة ('+called.size+' معالجاً)');
const unused=[...defined].filter(x=>!called.has(x)&&!dyn.has(x)&&x!=='onOk');
if(unused.length)console.log('ℹ معالجات غير مستدعاة نصياً (قد تكون ديناميكية): '+unused.join(', '));

process.exit(fails?1:0);
