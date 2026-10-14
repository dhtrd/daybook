# حصاد — هيكل البناء (فرع التطوير `hasad/dev`)

> الإنتاج (daybook على GitHub Pages من `main`) لا يُمس حتى النشر الواحد. كل ما هنا يُبنى ويُعاين على بيئة تجريبية منفصلة.
> المستودع **عام** (public): لا بيانات أعمال ولا أسرار ولا قرارات داخلية هنا — الأسرار في GitHub Secrets / أسرار الـ Workers فقط.

## البنية
```
apps/            تطبيقات حصاد الأربعة (مجلد لكل تطبيق: index.html + manifest.webmanifest) + index.html (مُشغّل المعاينة)
  yawmiya/       اليومية (الفرع)
  iqfaliyat/     الإقفاليات (مدخل البيانات والإدارة)
  sales-report/  تقرير المبيعات (قسمان: التقرير اليومي + تحليل الفروع)
  settings/      الإعدادات والمستخدمون
shared/          identity.css (الهوية v3) · ui.js (الشعار وشعارات التطبيقات والمبالغ والسمة) · app.css (هيكل متجاوب)
workers/         Workers الربط (تُبنى في المرحلتين 2 و7)
scripts/build.mjs  ينسخ apps + shared إلى dist/ لاستضافة المعاينة
tests/           اختبارات الهيكل (node:test)
ci/check-hasad-pages.mjs  فحص صياغة سكربتات الصفحات
firebase.json    استضافة المعاينة (dist) + ترويسات أساسية
.github/workflows/hasad-ci.yml  صياغة + اختبارات + قواعد الأمان + فحص الأسرار + بناء + معاينة
```
الملفات القديمة (`index.html` و`worker/` و`firestore.rules` …) تبقى كما هي (daybook الحالي).

## التشغيل محلياً
```
node scripts/build.mjs
node --test tests/*.test.mjs
node ci/check-hasad-pages.mjs
```
للمعاينة المحلية: قدّم مجلد `dist/` بأي خادم ساكن ثم افتح الصفحة الرئيسية.

## المعاينة على Firebase Hosting
تعمل على طلبات الدمج إلى `main` فقط، وتتخطى بهدوء إن لم تُضبط:
- سر المستودع `FIREBASE_SERVICE_ACCOUNT_HASAD_STAGING` (حساب خدمة للمشروع **التجريبي** وحده — صلاحية Hosting فقط).
- متغير المستودع `FIREBASE_STAGING_PROJECT_ID`.

## قواعد
- الهوية: لا تُعدَّل `shared/identity.css` يدوياً — المرجع `hasad_identity_v3.html` ثم يُعاد الاستخراج.
- لا اتجاه من اليسار لليمين؛ لا عناصر افتراضية من المتصفح؛ الأرقام بالخانات الغربية؛ رمز الريال المعتمد.
