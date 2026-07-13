/* =====================================================================
   Daybook Sync — Cloudflare Worker (وسيط آمن لـ Dropbox)
   ---------------------------------------------------------------------
   - يحتفظ بكل أسرار Dropbox (App Key / App Secret / Refresh Token) داخل
     الخادم فقط، ولا تصل إطلاقاً إلى المتصفح.
   - يوفّر مسارين فقط:
       GET  /data   → ينزّل أحدث نسخة من قاعدة البيانات من Dropbox.
       POST /data   → يرفع أحدث نسخة إلى Dropbox (استبدال).
     (اختياري) POST /backup → يحفظ نسخة مؤرّخة في مجلد backups.
   - يقيّد الوصول عبر CORS إلى نطاق موقعك، ويدعم رمز حماية اختياري APP_TOKEN.

   المتغيّرات/الأسرار المطلوبة (تُضبط في Cloudflare، لا في الكود):
       DROPBOX_APP_KEY        (سر)
       DROPBOX_APP_SECRET     (سر)
       DROPBOX_REFRESH_TOKEN  (سر)
       ALLOWED_ORIGIN         (متغيّر) مثال: https://dhtrd.github.io
       DATA_PATH              (متغيّر، اختياري) الافتراضي: /DailyReport/data.json
       APP_TOKEN              (سر، اختياري) لو ضُبط، يجب أن يرسله المتصفح كـ Bearer
   ===================================================================== */

const DROPBOX_TOKEN_URL = "https://api.dropboxapi.com/oauth2/token";
const DROPBOX_DOWNLOAD_URL = "https://content.dropboxapi.com/2/files/download";
const DROPBOX_UPLOAD_URL = "https://content.dropboxapi.com/2/files/upload";

// كاش لرمز الوصول داخل الـ isolate الدافئ (يقلّل النداءات)
let _tok = { access: null, exp: 0 };

function corsHeaders(env) {
  const origin = env.ALLOWED_ORIGIN || "*";
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Base-Rev, X-Sovereign",
    "Access-Control-Max-Age": "86400",
    "Access-Control-Expose-Headers": "X-Data-Rev",
    "Vary": "Origin",
  };
}

function json(body, status, env) {
  return new Response(JSON.stringify(body), {
    status: status || 200,
    headers: { "Content-Type": "application/json", ...corsHeaders(env) },
  });
}

function authorized(request, env) {
  if (!env.APP_TOKEN) return true; // الحماية بالرمز اختيارية
  const h = request.headers.get("Authorization") || "";
  return h === "Bearer " + env.APP_TOKEN;
}

async function getAccessToken(env) {
  if (_tok.access && Date.now() < _tok.exp) return _tok.access;
  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: env.DROPBOX_REFRESH_TOKEN,
    client_id: env.DROPBOX_APP_KEY,
    client_secret: env.DROPBOX_APP_SECRET,
  });
  const r = await fetch(DROPBOX_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
  if (!r.ok) throw new Error("token " + r.status + " " + (await r.text()));
  const j = await r.json();
  _tok.access = j.access_token;
  _tok.exp = Date.now() + ((j.expires_in || 14400) - 120) * 1000;
  return _tok.access;
}

function dataPath(env) {
  return env.DATA_PATH || "/DailyReport/data.json";
}

async function dropboxDownload(env, path) {
  const t = await getAccessToken(env);
  const r = await fetch(DROPBOX_DOWNLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + t,
      "Dropbox-API-Arg": JSON.stringify({ path }),
    },
  });
  if (r.status === 409) return { content: null, rev: "" }; // الملف غير موجود بعد
  if (!r.ok) throw new Error("download " + r.status + " " + (await r.text()));
  let rev = "";
  const meta = r.headers.get("Dropbox-API-Result");
  if (meta) { try { rev = JSON.parse(meta).rev || ""; } catch (e) {} }
  const content = await r.text();
  return { content, rev };
}

// القفل التفاؤلي: عند وجود baseRev نستخدم وضع update الذرّي في Dropbox،
// فلا يكتب إلا إذا كانت نسخة الملف على الخادم ما تزال هي نفسها. غير ذلك → تعارض.
async function dropboxUpload(env, path, content, baseRev) {
  const t = await getAccessToken(env);
  const mode = baseRev
    ? { ".tag": "update", "update": baseRev }   // اكتب فقط إذا لم تتغيّر نسخة الخادم
    : "add";                                     // أول كتابة: أنشئ الملف (يفشل لو أنشأه غيرك)
  const r = await fetch(DROPBOX_UPLOAD_URL, {
    method: "POST",
    headers: {
      Authorization: "Bearer " + t,
      "Content-Type": "application/octet-stream",
      "Dropbox-API-Arg": JSON.stringify({ path, mode, autorename: false, mute: true }),
    },
    body: content,
  });
  if (r.status === 409) {
    // تعارض: تغيّرت نسخة الخادم (أو الملف موجود مسبقاً في وضع add)
    return { conflict: true, detail: await r.text() };
  }
  if (!r.ok) throw new Error("upload " + r.status + " " + (await r.text()));
  const meta = await r.json();
  return { conflict: false, rev: meta.rev || "" };
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders(env) });
    }

    if (!authorized(request, env)) {
      return json({ error: "unauthorized" }, 401, env);
    }

    try {
      // GET /data  → أحدث نسخة + نسخة الملف (rev) في ترويسة X-Data-Rev
      if (request.method === "GET" && (url.pathname === "/data" || url.pathname === "/")) {
        const { content, rev } = await dropboxDownload(env, dataPath(env));
        if (content == null) {
          return new Response("", { status: 204, headers: { ...corsHeaders(env), "X-Data-Rev": "" } });
        }
        return new Response(content, {
          status: 200,
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store", "X-Data-Rev": rev, ...corsHeaders(env) },
        });
      }

      // POST /data → رفع بقفل تفاؤلي + «درع العهد»:
      //   لكل نسخة سحابية رقم عهد (epoch). الفرض السيادي (استعادة/إنقاذ) يرفعه بترويسة X-Sovereign.
      //   أي كتابة عادية من عهدٍ أقدم تُرفض — فالجهاز العالق «يُغلق عليه» ثم يعتمد الجديد عند سحبه التالي.
      if (request.method === "POST" && url.pathname === "/data") {
        const bodyText = await request.text();
        if (!bodyText) return json({ error: "empty body" }, 400, env);
        const baseRev = request.headers.get("X-Base-Rev") || "";
        const sovereign = request.headers.get("X-Sovereign") === "1";

        let incoming = null;
        try { incoming = JSON.parse(bodyText); } catch (e) { return json({ error: "bad json" }, 400, env); }
        const inEpoch = Number(incoming && incoming.epoch) || 0;
        const inDays  = incoming && incoming.data ? Object.keys(incoming.data) : [];

        // اقرأ الحالة الحالية (للعهد والمقارنة)
        let curEpoch = 0, curDays = [];
        try {
          const cur = await dropboxDownload(env, dataPath(env));
          if (cur.content) {
            const c = JSON.parse(cur.content);
            curEpoch = Number(c && c.epoch) || 0;
            curDays  = c && c.data ? Object.keys(c.data) : [];
          }
        } catch (e) {}

        if (sovereign) {
          // فرض متعمد: يجب أن يرفع العهد فعلاً (يمنع تصادم فرضَين متزامنين)
          if (inEpoch <= curEpoch) {
            return json({ error: "conflict", sovereign: true, serverEpoch: curEpoch,
              message: "فرض متزامن آخر سبقك — أعد الفحص ثم الفرض." }, 409, env);
          }
        } else {
          // كتابة عادية: يجب أن تكون من نفس العهد الحالي
          if (inEpoch !== curEpoch) {
            let serverRev = ""; try { serverRev = (await dropboxDownload(env, dataPath(env))).rev; } catch (e) {}
            return json({ error: "conflict", stale: true, serverEpoch: curEpoch, serverRev,
              message: "أُعيد ضبط البيانات مركزياً — سيعتمد جهازك النسخة الجديدة تلقائياً." }, 409, env);
          }
          // درع الفقد الجماعي: أولاً محو سنة قائمة (رسالة أدق)، ثم الفقد العددي
          const inYears = new Set(inDays.map(d => d.slice(0, 4)));
          const yearCount = {};
          for (const d of curDays) { const y = d.slice(0, 4); yearCount[y] = (yearCount[y] || 0) + 1; }
          for (const y in yearCount) {
            if (yearCount[y] >= 20 && !inYears.has(y)) {
              return json({ error: "conflict", guard: true, serverEpoch: curEpoch,
                message: "حُجبت كتابة تمحو سنة " + y + " كاملة (" + yearCount[y] + " يوماً)." }, 409, env);
            }
          }
          const LOSS_LIMIT = 15;
          if (curDays.length - inDays.length > LOSS_LIMIT) {
            return json({ error: "conflict", guard: true, serverEpoch: curEpoch,
              message: "حُجبت كتابة تحذف " + (curDays.length - inDays.length) + " يوماً — حدّث التطبيق أو استخدم الاستعادة الرسمية." }, 409, env);
          }
        }

        const res = await dropboxUpload(env, dataPath(env), bodyText, baseRev);
        if (res.conflict) {
          // تغيّرت نسخة الخادم منذ آخر تنزيل للعميل → ارفض الرفع ولا تكتب فوق عمل الآخرين
          let serverRev = "";
          try { serverRev = (await dropboxDownload(env, dataPath(env))).rev; } catch (e) {}
          return json({ error: "conflict", message: "Newer cloud data is available. Please refresh and try again.", serverRev }, 409, env);
        }
        return json({ ok: true, rev: res.rev, savedAt: new Date().toISOString() }, 200, env);
      }

      // POST /backup → نسخة مؤرّخة (اختياري) — دائماً إضافة جديدة
      if (request.method === "POST" && url.pathname === "/backup") {
        const bodyText = await request.text();
        if (!bodyText) return json({ error: "empty body" }, 400, env);
        const stamp = new Date().toISOString().replace(/[:.]/g, "-");
        await dropboxUpload(env, "/DailyReport/backups/backup-" + stamp + ".json", bodyText, "");
        return json({ ok: true }, 200, env);
      }

      return json({ error: "not found" }, 404, env);
    } catch (e) {
      return json({ error: String(e && e.message || e) }, 502, env);
    }
  },
};
