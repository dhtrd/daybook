/* حصاد — مكوّنات الهوية المشتركة (v3). بلا اعتماديات خارجية.
   المصدر: hasad_identity_v3.html (شعار منجل الحاء + شعارات التطبيقات بأسلوب «شارة على الشعار» M3-N59 و). */

export const APPS = {
  yawmiya:  { key: 'dbk', name: 'اليومية',        color: '#3F6E5A', desc: 'للفرع: يومياته ورصيده' },
  iqfaliyat:{ key: 'cls', name: 'الإقفاليات',     color: '#2F6F86', desc: 'الاستلام والترحيل وتقرير اليومية' },
  'sales-report': { key: 'sal', name: 'تقرير المبيعات', color: '#A8641A', desc: 'التقرير اليومي وتحليل الفروع' },
  settings: { key: 'set', name: 'الإعدادات',      color: '#5F6B66', desc: 'المستخدمون والفروع والدفع' },
};

const GLYPH = {
  dbk: 'M20 20h12M20 25h12M20 30h7',
  cls: 'M19 24.5l2.5-5.5h9l2.5 5.5v6.5H19zM19 24.5h4.5l1.5 2.5h4l1.5-2.5H33',
  sal: 'M21 31v-4M26 31v-7M31 31v-5M20 23l5-3.5 4 2 5-4.5',
  set: 'M19 21h14M19 26h14M19 31h14',
};
const KNOB = {
  set: '<circle cx="23" cy="21" r="1.8"/><circle cx="29" cy="26" r="1.8"/><circle cx="25" cy="31" r="1.8"/>',
  sal: '<circle cx="34" cy="17" r="1.5"/>',
};
const SICKLE = 'M41 7.5Q41 13 35 13H19Q8 13 8 26Q8 39 22 39Q29 39 33 36';

export const SAR_SYMBOL = `<symbol id="sar" viewBox="40 0 1145 1270"><path fill="currentColor" d="M750,1119 C730,1163,716,1211,711,1262 C711,1262,1136,1172,1136,1172 C1156,1127,1169,1079,1174,1028 C1174,1028,750,1119,750,1119Z M1136,901 C1136,901,1136,901,1136,901 C1156,857,1169,809,1174,758 C1174,758,843,828,843,828 C843,828,843,693,843,693 C843,693,1136,631,1136,631 C1156,587,1169,538,1174,488 C1174,488,843,558,843,558 C843,558,843,72,843,72 C793,100,748,138,711,183 C711,183,711,586,711,586 C711,586,579,614,579,614 C579,614,579,6,579,6 C528,34,483,72,447,117 C447,117,447,642,447,642 C447,642,151,705,151,705 C131,750,117,798,112,849 C112,849,447,777,447,777 C447,777,447,948,447,948 C447,948,88,1024,88,1024 C68,1068,55,1117,50,1167 C50,1167,425,1088,425,1088 C456,1081,482,1063,499,1038 C499,1038,568,936,568,936 C568,936,568,936,568,936 C575,926,579,913,579,899 C579,899,579,749,579,749 C579,749,711,721,711,721 C711,721,711,992,711,992 C711,992,1136,901,1136,901Z"/></symbol>`;

/** شعار «منجل الحاء» الأساسي. الألوان تأتي من --la/--lb (انظر logoVars). */
export function logo(size = 30) {
  return `<svg class="hlg hlg8" width="${size}" height="${size}" viewBox="0 0 48 48" aria-hidden="true"><path class="p-h" d="${SICKLE}" pathLength="1" fill="none" style="stroke:var(--la)" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"></path><g class="p-g"><ellipse cx="26" cy="25" rx="3.6" ry="6" transform="rotate(30 26 25)" style="fill:var(--lb)"></ellipse></g></svg>`;
}
export function logoVars(dark) {
  return dark ? '--la:#8CC4A9;--lb:#E0C27A;--lc:#0D1A14' : '--la:#3F6E5A;--lb:#C9A44C;--lc:#FFFFFF';
}

/** شعار تطبيق بأسلوب «شارة على الشعار» المعتمد. appId أحد مفاتيح APPS. */
export function appMark(appId, { dark = false, size = 56 } = {}) {
  const a = APPS[appId];
  if (!a) throw new Error('تطبيق غير معروف: ' + appId);
  const la = dark ? '#8CC4A9' : '#3F6E5A';
  const lb = dark ? '#E0C27A' : '#C9A44C';
  const col = dark ? `color-mix(in srgb,${a.color} 55%,#fff)` : a.color;
  const g = GLYPH[a.key];
  const kn = KNOB[a.key] || '';
  return `<svg class="hlg hlg8 play amk" width="${size}" height="${size}" viewBox="0 0 48 48" role="img" aria-label="${a.name}"><path class="p-h" d="${SICKLE}" pathLength="1" fill="none" stroke="${la}" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/><g class="p-g"><ellipse cx="26" cy="25" rx="3.6" ry="6" transform="rotate(30 26 25)" fill="${lb}"/><circle cx="37" cy="37" r="9.5" fill="${col}" stroke="${dark ? '#1B211E' : '#fff'}" stroke-width="2"/><g fill="none" stroke="#fff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" transform="translate(23.4 23.6) scale(.56)"><path d="${g}"/><g fill="#fff" stroke="none">${kn}</g></g></g></svg>`;
}

/** يحقن رمز الريال مرة واحدة ويعيد وسم المبلغ المعتمد. */
export function injectSprite(doc = document) {
  if (doc.getElementById('hasad-sprite')) return;
  const s = doc.createElement('div');
  s.id = 'hasad-sprite';
  s.setAttribute('aria-hidden', 'true');
  s.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  s.innerHTML = `<svg width="0" height="0" focusable="false">${SAR_SYMBOL}</svg>`;
  doc.body.prepend(s);
}
export function money(amount, { sign = false } = {}) {
  const n = Number(amount);
  if (!Number.isFinite(n)) throw new Error('مبلغ غير صالح');
  const txt = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  const s = n < 0 ? '−' : sign && n > 0 ? '+' : '';
  return `<span class="mny">${s ? `<span>${s}</span>` : ''}<svg class="sar2" aria-hidden="true"><use href="#sar"/></svg><span>${txt}</span></span>`;
}

/** الوضع الفاتح/الداكن: يتبع الجهاز، ويتذكر الاختيار إن أمكن (التخزين قد يتعذر). */
export function initTheme(root, btn) {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  let saved = null;
  try { saved = localStorage.getItem('hasad-theme'); } catch { /* التخزين غير متاح — نتجاهل */ }
  const apply = (mode) => { root.dataset.m = mode; document.documentElement.style.colorScheme = mode; };
  apply(saved || (mq.matches ? 'dark' : 'light'));
  if (btn) btn.addEventListener('click', () => {
    const next = root.dataset.m === 'dark' ? 'light' : 'dark';
    apply(next);
    try { localStorage.setItem('hasad-theme', next); } catch { /* غير متاح */ }
    btn.dispatchEvent(new CustomEvent('hasad:theme', { detail: next, bubbles: true }));
  });
  return () => root.dataset.m === 'dark';
}
