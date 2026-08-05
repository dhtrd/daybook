/* ===== Service Worker — نظام تقارير اليومية =====
   عند إصدار تحديث جديد: غيّر الرقم في APP_VERSION فقط (هنا وفي index.html/version.json).
   الكاش يتجدّد تلقائياً، ولا يمسّ بيانات المستخدم إطلاقاً (البيانات في IndexedDB/localStorage). */
const APP_VERSION = "1.7.1";
const CACHE = "dsr-cache-v" + APP_VERSION;

/* ملفات الواجهة الأساسية (App Shell) — مسارات نسبية لتعمل على أي نطاق أو مجلد فرعي */
const SHELL = [
  "./",
  "./index.html",
  "./config.js",
  "./manifest.webmanifest",
  "./icon.svg",
  "./icon-192.png",
  "./icon-512.png",
  "./icon-180.png"
];

/* المضيفات الخارجية المسموح تخزينها مؤقتاً (خطوط + مكتبة الإكسل فقط) */
const CACHEABLE_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com", "cdnjs.cloudflare.com", "www.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(SHELL)).catch(() => {})
  );
  // لا نستدعي skipWaiting تلقائياً — ننتظر موافقة المستخدم من داخل التطبيق
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (e) => {
  if (e.data && e.data.type === "SKIP_WAITING") self.skipWaiting();
});

function isHTML(req) {
  return req.mode === "navigate" ||
    (req.headers.get("accept") || "").includes("text/html");
}

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;                    // POST (Worker/Dropbox…) يمرّ للشبكة مباشرة
  const url = new URL(req.url);

  const sameOrigin = url.origin === self.location.origin;

  // الواجهة (HTML): الكاش فوراً ثم تحديث بالخلفية (stale-while-revalidate)
  // يعرض الشاشة لحظياً من الكاش دون انتظار تنزيل الصفحة كاملة، ويجلب أحدث نسخة بالخلفية
  // فتظهر عند الزيارة التالية (مع شريط «تحديث متاح» عند تغيّر الإصدار).
  if (sameOrigin && isHTML(req)) {
    e.respondWith(
      caches.open(CACHE).then((c) =>
        c.match("./index.html").then((cached) => {
          const net = fetch(req)
            .then((res) => { c.put("./index.html", res.clone()); return res; })
            .catch(() => cached);
          return cached || net;   // كاش فوري إن وُجد، وإلا الشبكة (أول زيارة)
        })
      )
    );
    return;
  }

  // ملفات محلية ثابتة (أيقونات/manifest/config): الكاش أولاً مع تحديث بالخلفية
  if (sameOrigin) {
    e.respondWith(
      caches.match(req).then((cached) => {
        const net = fetch(req).then((res) => {
          if (res && res.status === 200) {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        }).catch(() => cached);
        return cached || net;
      })
    );
    return;
  }

  // خارجي: نخزّن مؤقتاً الخطوط ومكتبة الإكسل فقط. أي شيء آخر (Worker/Dropbox) يمرّ للشبكة دون تدخّل أو تخزين.
  if (CACHEABLE_HOSTS.indexOf(url.hostname) === -1) return;
  e.respondWith(
    caches.match(req).then((cached) => {
      const net = fetch(req).then((res) => {
        if (res && (res.status === 200 || res.type === "opaque")) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => cached);
      return cached || net;
    })
  );
});
