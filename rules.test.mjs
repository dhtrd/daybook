/**
 * اختبار وحدات لقواعد أمان Firestore — نظام تقارير اليومية (daybook-dhtrd)
 * يعمل ضدّ محاكي Firestore (Firebase Emulator) عبر @firebase/rules-unit-testing.
 * التشغيل محلياً:  npm ci  ثم  npm test
 * التشغيل في CI:  عبر .github/workflows/firestore-rules.yml (يُشغّل المحاكي تلقائياً).
 */
import { test, before, after, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  initializeTestEnvironment,
  assertSucceeds,
  assertFails,
} from '@firebase/rules-unit-testing';
import { doc, getDoc, setDoc, deleteDoc, collection, getDocs } from 'firebase/firestore';

const __dirname = dirname(fileURLToPath(import.meta.url));
const OWNER = 'a2@dhtrd.com';
let env;

// سياق مستخدم مسجّل ببريد معيّن (القواعد تعتمد request.auth.token.email)
const asUser = (email) => env.authenticatedContext(email.replace(/[^a-z0-9]/gi, ''), { email }).firestore();
const asAnon = () => env.unauthenticatedContext().firestore();

before(async () => {
  env = await initializeTestEnvironment({
    projectId: 'daybook-dhtrd',
    firestore: { rules: readFileSync(join(__dirname, '..', 'firestore.rules'), 'utf8') },
  });
});
after(async () => { if (env) await env.cleanup(); });

// قبل كل اختبار: نظّف ثم ابذر مستندات الأدوار + بيانات أساس (بتجاوز القواعد)
beforeEach(async () => {
  await env.clearFirestore();
  await env.withSecurityRulesDisabled(async (ctx) => {
    const db = ctx.firestore();
    await setDoc(doc(db, 'roles', 'entry@dhtrd.com'),     { name: 'مُدخِل',  role: 'مُدخِل اليوميات', active: true });
    await setDoc(doc(db, 'roles', 'fin@dhtrd.com'),       { name: 'مالي',   role: 'المدير المالي',  active: true });
    await setDoc(doc(db, 'roles', 'gen@dhtrd.com'),       { name: 'عام',    role: 'المدير العام',   active: true });
    await setDoc(doc(db, 'roles', 'off@dhtrd.com'),       { name: 'موقوف',  role: 'مُدخِل اليوميات', active: false });
    await setDoc(doc(db, 'roles', 'grant@dhtrd.com'),     { name: 'ممنوح',  role: 'المدير العام',   active: true, perms: { entry: 'allow' } });
    await setDoc(doc(db, 'roles', 'denyu@dhtrd.com'),     { name: 'ممنوع',  role: 'مُدخِل اليوميات', active: true, perms: { entry: 'deny' } });
    await setDoc(doc(db, 'days', '2026-07-30'),           { date: '2026-07-30', updatedTs: 1 });
    await setDoc(doc(db, 'days', '2026-07-31'),           { date: '2026-07-31', status: 'posted', rows: [{ id: 'r1', sales: 100 }], updatedTs: 1 });
    await setDoc(doc(db, 'meta', 'config'),               { businessName: 'الضبيبي', cfgUpdatedTs: 1 });
    await setDoc(doc(db, 'approvals', '2026-07-30'),      { date: '2026-07-30', status: 'pending' });
    await setDoc(doc(db, 'activity', 'seed1'),            { id: 'seed1', ts: 1, type: 'login', actor: OWNER });
  });
});

const day = (db) => doc(db, 'days', '2026-07-30');
const cfg = (db) => doc(db, 'meta', 'config');
const appr = (db) => doc(db, 'approvals', '2026-07-30');

/* ===================== أيام (days) ===================== */
test('days: مجهول ممنوع من القراءة', async () => { await assertFails(getDoc(day(asAnon()))); });
test('days: المالك يقرأ ويكتب', async () => {
  await assertSucceeds(getDoc(day(asUser(OWNER))));
  await assertSucceeds(setDoc(day(asUser(OWNER)), { date: '2026-07-30', updatedTs: 2 }));
});
test('days: مُدخِل اليوميات يقرأ ويكتب', async () => {
  await assertSucceeds(getDoc(day(asUser('entry@dhtrd.com'))));
  await assertSucceeds(setDoc(day(asUser('entry@dhtrd.com')), { date: '2026-07-30', updatedTs: 3 }));
});
test('days: المدير المالي يقرأ لكن لا يكتب', async () => {
  await assertSucceeds(getDoc(day(asUser('fin@dhtrd.com'))));
  await assertFails(setDoc(day(asUser('fin@dhtrd.com')), { date: '2026-07-30', updatedTs: 4 }));
});
test('days: المدير العام يقرأ لكن لا يكتب', async () => {
  await assertSucceeds(getDoc(day(asUser('gen@dhtrd.com'))));
  await assertFails(setDoc(day(asUser('gen@dhtrd.com')), { date: '2026-07-30', updatedTs: 5 }));
});
test('days: مستخدم موقوف (active=false) ممنوع من القراءة والكتابة', async () => {
  await assertFails(getDoc(day(asUser('off@dhtrd.com'))));
  await assertFails(setDoc(day(asUser('off@dhtrd.com')), { date: '2026-07-30', updatedTs: 6 }));
});
test('days: بريد غير معروف (بلا دور) ممنوع', async () => {
  await assertFails(getDoc(day(asUser('stranger@dhtrd.com'))));
});
test('days: استثناء فردي «منح» يتيح الكتابة لدور لا يملكها (المدير العام)', async () => {
  await assertSucceeds(setDoc(day(asUser('grant@dhtrd.com')), { date: '2026-07-30', updatedTs: 7 }));
});
test('days: استثناء فردي «منع» يمنع الكتابة عن دور يملكها (مُدخِل اليوميات)', async () => {
  await assertFails(setDoc(day(asUser('denyu@dhtrd.com')), { date: '2026-07-30', updatedTs: 8 }));
});

/* ===================== قفل الحقول + انتقالات الحالة (البند ٦) ===================== */
const pday = (db) => doc(db, 'days', '2026-07-31'); // يومية مرحّلة (posted)
test('قفل: تعديل مالية يومية مسودة مسموح', async () => {
  await assertSucceeds(setDoc(day(asUser(OWNER)), { date: '2026-07-30', rows: [{ id: 'r1', sales: 50 }], updatedTs: 2 }));
});
test('قفل: تعديل المبلغ في يومية مرحّلة (دون إعادتها مسودة) ممنوع', async () => {
  await assertFails(setDoc(pday(asUser(OWNER)), { date: '2026-07-31', status: 'posted', rows: [{ id: 'r1', sales: 999 }], updatedTs: 2 }));
});
test('حالة: مرحّلة → مقفلة (بلا تغيير مالي) مسموح', async () => {
  await assertSucceeds(setDoc(pday(asUser(OWNER)), { date: '2026-07-31', status: 'locked', rows: [{ id: 'r1', sales: 100 }], updatedTs: 2 }));
});
test('حالة: إعادة المرحّلة إلى مسودة مسموح (ثم يجوز التعديل)', async () => {
  await assertSucceeds(setDoc(pday(asUser(OWNER)), { date: '2026-07-31', status: 'draft', rows: [{ id: 'r1', sales: 100 }], updatedTs: 2 }));
});
test('حالة: قفز مسودة → مقفلة (تخطّي الترحيل) ممنوع', async () => {
  await assertFails(setDoc(day(asUser(OWNER)), { date: '2026-07-30', status: 'locked', updatedTs: 2 }));
});

/* ===================== الإعدادات (meta) ===================== */
test('meta: المالك يكتب، والفعّالون يقرأون فقط', async () => {
  await assertSucceeds(setDoc(cfg(asUser(OWNER)), { businessName: 'ج', cfgUpdatedTs: 2 }));
  await assertSucceeds(getDoc(cfg(asUser('fin@dhtrd.com'))));
  await assertFails(setDoc(cfg(asUser('fin@dhtrd.com')), { businessName: 'x', cfgUpdatedTs: 3 }));
  await assertFails(setDoc(cfg(asUser('entry@dhtrd.com')), { businessName: 'y', cfgUpdatedTs: 4 }));
});

/* ===================== الأدوار (roles) ===================== */
test('roles: المالك ينشئ ويحذف الأدوار', async () => {
  await assertSucceeds(setDoc(doc(asUser(OWNER), 'roles', 'new@dhtrd.com'), { name: 'ن', role: 'المدير العام', active: true }));
  await assertSucceeds(deleteDoc(doc(asUser(OWNER), 'roles', 'gen@dhtrd.com')));
});
test('roles: غير المالك لا ينشئ ولا يحذف الأدوار', async () => {
  // مُدخِل اليوميات (فعّال) لا يستطيع إنشاء دور جديد لمستخدم آخر
  await assertFails(setDoc(doc(asUser('entry@dhtrd.com'), 'roles', 'new2@dhtrd.com'), { name: 'ن2', role: 'المدير العام', active: true }));
  // ولا يستطيع حذف دور قائم
  await assertFails(deleteDoc(doc(asUser('fin@dhtrd.com'), 'roles', 'gen@dhtrd.com')));
});
test('roles: كل مسجّل يقرأ الأدوار (لجلب دوره)', async () => {
  await assertSucceeds(getDoc(doc(asUser('entry@dhtrd.com'), 'roles', 'entry@dhtrd.com')));
  await assertFails(getDoc(doc(asAnon(), 'roles', 'entry@dhtrd.com')));
});
test('roles: المستخدم يحدّث آخر دخوله فقط (لا يرفع دوره)', async () => {
  const db = asUser('entry@dhtrd.com');
  // تحديث lastLogin مع إبقاء role/active/name = مسموح
  await assertSucceeds(setDoc(doc(db, 'roles', 'entry@dhtrd.com'),
    { name: 'مُدخِل', role: 'مُدخِل اليوميات', active: true, lastLogin: 'الآن', updatedTs: 2 }, { merge: true }));
  // محاولة ترقية الدور = ممنوعة
  await assertFails(setDoc(doc(db, 'roles', 'entry@dhtrd.com'),
    { name: 'مُدخِل', role: 'المالك', active: true }, { merge: true }));
  // محاولة تعديل دور مستخدم آخر = ممنوعة
  await assertFails(setDoc(doc(db, 'roles', 'fin@dhtrd.com'),
    { name: 'مالي', role: 'مُدخِل اليوميات', active: true }, { merge: true }));
});
test('roles: المستخدم يحفظ تفضيلاته (prefs) في وثيقته', async () => {
  const db = asUser('entry@dhtrd.com');
  await assertSucceeds(setDoc(doc(db, 'roles', 'entry@dhtrd.com'),
    { prefs: { mode: 'dark', fs: 'xl', contrast: '1' }, updatedTs: 9 }, { merge: true }));
});
test('roles: المستخدم لا يمنح نفسه صلاحيات (perms) ولا يغيّر نطاق فروعه (branches)', async () => {
  const db = asUser('entry@dhtrd.com');
  // تصعيد صلاحية ذاتي = ممنوع
  await assertFails(setDoc(doc(db, 'roles', 'entry@dhtrd.com'),
    { perms: { users: 'allow' }, updatedTs: 10 }, { merge: true }));
  // تغيير نطاق فروعه بنفسه = ممنوع
  await assertFails(setDoc(doc(db, 'roles', 'entry@dhtrd.com'),
    { branches: ['b1'], updatedTs: 11 }, { merge: true }));
});

/* ===================== سجل النشاط (activity) ===================== */
test('activity: كل فعّال يقرأ وينشئ؛ الموقوف ممنوع', async () => {
  await assertSucceeds(getDocs(collection(asUser('gen@dhtrd.com'), 'activity')));
  await assertSucceeds(setDoc(doc(asUser('entry@dhtrd.com'), 'activity', 'e1'), { id: 'e1', ts: 2, type: 'send', actor: 'entry@dhtrd.com' }));
  await assertSucceeds(setDoc(doc(asUser('fin@dhtrd.com'), 'activity', 'f1'), { id: 'f1', ts: 3, type: 'approve', actor: 'fin@dhtrd.com' }));
  await assertFails(setDoc(doc(asUser('off@dhtrd.com'), 'activity', 'o1'), { id: 'o1', ts: 4, type: 'x', actor: 'off@dhtrd.com' }));
});
test('activity: سجل إلحاقي — لا يُعدَّل حدثٌ مسجّل (حتى المالك)', async () => {
  // تحريف حدثٍ قائم ممنوع للجميع بمن فيهم المالك (منع إعادة كتابة التاريخ)
  await assertFails(setDoc(doc(asUser(OWNER), 'activity', 'seed1'), { detail: 'مُحرَّف' }, { merge: true }));
  await assertFails(setDoc(doc(asUser('entry@dhtrd.com'), 'activity', 'seed1'), { detail: 'x' }, { merge: true }));
});
test('activity: غير المالك لا يحذف؛ المالك يحذف (للاحتفاظ/الصيانة)', async () => {
  await assertFails(deleteDoc(doc(asUser('entry@dhtrd.com'), 'activity', 'seed1')));
  await assertSucceeds(deleteDoc(doc(asUser(OWNER), 'activity', 'seed1')));
});

/* ===================== الاعتمادات (approvals) ===================== */
test('approvals: المالك/المالي/المُدخِل يكتبون؛ العام لا يكتب', async () => {
  await assertSucceeds(getDoc(appr(asUser('gen@dhtrd.com'))));
  await assertSucceeds(setDoc(appr(asUser('entry@dhtrd.com')), { date: '2026-07-30', status: 'pending' }));
  await assertSucceeds(setDoc(appr(asUser('fin@dhtrd.com')), { date: '2026-07-30', status: 'approved' }));
  await assertSucceeds(setDoc(appr(asUser(OWNER)), { date: '2026-07-30', status: 'approved' }));
  await assertFails(setDoc(appr(asUser('gen@dhtrd.com')), { date: '2026-07-30', status: 'returned' }));
});

/* ===================== منع أي شيء آخر ===================== */
test('catch-all: أي مجموعة أخرى ممنوعة تماماً', async () => {
  await assertFails(getDoc(doc(asUser(OWNER), 'secretStuff', 'x')));
  await assertFails(setDoc(doc(asUser(OWNER), 'secretStuff', 'x'), { a: 1 }));
});
