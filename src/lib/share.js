// منطق الروابط العامة (QR) — رابط «اطّلاع فقط» بلا تسجيل دخول.
// لا وصول لأي بيانات أخرى: تُكتب لقطة (snapshot) لكشف موظف واحد في مجموعة public
// برمز عشوائي لا يُخمَّن. الانتهاء يُفرَض على الخادم في firestore.rules.
import { doc, getDoc, setDoc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { listTransactions, getConfig, writeAudit } from './db'
import { withRunningBalance, totals } from './balance'
import { DEFAULT_CURRENCY } from './format'

// خيارات المدة (كما اعتُمد مع المستخدم: مدد جاهزة + ساعات مخصّصة + تاريخ مخصّص + دائم)
export const DURATION_OPTIONS = [
  { key: '24h', label: '24 ساعة', hours: 24 },
  { key: '7d', label: '7 أيام', hours: 24 * 7 },
  { key: '30d', label: '30 يومًا', hours: 24 * 30 },
  { key: '90d', label: '90 يومًا', hours: 24 * 90 },
  { key: '1y', label: 'سنة كاملة', hours: 24 * 365 },
  { key: 'custom_hours', label: 'عدد ساعات مخصّص…', hours: null },
  { key: 'custom_date', label: 'تاريخ ووقت انتهاء مخصّص…', hours: null },
  { key: 'never', label: 'دائم حتى الإلغاء اليدوي', hours: null },
]

// المدد الصالحة كافتراضي في الإعدادات (بلا الخيارات التي تحتاج إدخالًا)
export const DEFAULT_DURATION_OPTIONS = DURATION_OPTIONS.filter(
  (o) => o.key !== 'custom_hours' && o.key !== 'custom_date'
)

// يحسب تاريخ الانتهاء (Date) أو null للدائم
export function computeExpiresAt(choice, { customHours, customDate } = {}) {
  if (choice === 'never') return null
  if (choice === 'custom_date') {
    if (!customDate) return null
    const d = new Date(customDate)
    return isNaN(d.getTime()) ? null : d
  }
  if (choice === 'custom_hours') {
    const h = Number(customHours)
    if (!Number.isFinite(h) || h <= 0) return null
    return new Date(Date.now() + h * 3600 * 1000)
  }
  const opt = DURATION_OPTIONS.find((o) => o.key === choice)
  if (opt && opt.hours) return new Date(Date.now() + opt.hours * 3600 * 1000)
  return null
}

// رمز عشوائي غير قابل للتخمين (24 بايت → ~32 حرفًا base64url) عبر Web Crypto
function randomToken() {
  const c = window.crypto || window.msCrypto
  const bytes = new Uint8Array(24)
  c.getRandomValues(bytes)
  let s = ''
  for (const b of bytes) s += String.fromCharCode(b)
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function publicUrl(token) {
  return `${window.location.origin}/p/${token}`
}

function toDate(v) {
  if (!v) return null
  if (v.toDate) return v.toDate()
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

// الحالة الحية لمشاركة موظف (تُحسب من حقوله) — active / expired / none
export function shareState(emp) {
  if (!emp || !emp.shareToken || !emp.shareActive) return { active: false }
  const exp = toDate(emp.shareExpiresAt)
  if (exp && exp.getTime() < Date.now()) {
    return { active: false, expired: true, token: emp.shareToken, expiresAt: exp }
  }
  return { active: true, token: emp.shareToken, expiresAt: exp, url: publicUrl(emp.shareToken) }
}

// إنشاء (أو تجديد) رابط عام: يبني لقطة الكشف كاملة ويكتبها في public/{token}
// ثم يعلّم موظفه ويسجّل في التدقيق. prevToken = الرمز السابق ليُبطَل فورًا.
export async function createShareLink({ employee, expiresAt, user, prevToken }) {
  const [txns, cfg] = await Promise.all([listTransactions(employee.id), getConfig()])
  const rows = withRunningBalance(txns).map((t) => ({
    date: t.date || '',
    sanad: t.sanad || '',
    details: t.details || '',
    deliveredBy: t.deliveredBy || '',
    debit: Number(t.debit) || 0,
    credit: Number(t.credit) || 0,
    running: Number(t.running) || 0,
    editedAfterLock: !!t.editedAfterLock,
  }))
  const tot = totals(txns)
  const token = randomToken()

  // إبطال أي رابط سابق لهذا الموظف (يمنع تسرّب لقطة قديمة)
  const old = prevToken || employee.shareToken
  if (old && old !== token) {
    try { await deleteDoc(doc(db, 'public', old)) } catch (e) { /* قد يكون منتهيًا/محذوفًا */ }
  }

  await setDoc(doc(db, 'public', token), {
    employeeId: employee.id,
    employeeName: employee.name || '',
    employeeCode: employee.code || '',
    employeeStatus: employee.status || 'active',
    companyName: cfg?.companyName || 'شركة الضبيبي التجارية',
    companyPhone: cfg?.companyPhone || '',
    companyAddress: cfg?.companyAddress || '',
    companyLogo: cfg?.companyLogo || '',
    currencySymbol: cfg?.currencySymbol || DEFAULT_CURRENCY,
    rows,
    totals: { debit: tot.debit, credit: tot.credit, balance: tot.balance },
    generatedAt: serverTimestamp(),
    generatedBy: user?.name || user?.email || '',
    expiresAt: expiresAt || null,
  })

  await updateDoc(doc(db, 'employees', employee.id), {
    shareActive: true,
    shareToken: token,
    shareExpiresAt: expiresAt || null,
    shareCreatedAt: serverTimestamp(),
    shareCreatedBy: user?.uid || null,
    updatedAt: serverTimestamp(),
  })

  await writeAudit({
    action: 'share_create', entity: 'employee', entityId: employee.id, entityLabel: employee.name, user,
    reason: expiresAt ? `رابط عام صالح حتى ${expiresAt.toISOString()}` : 'رابط عام دائم حتى الإلغاء',
  })

  return { token, url: publicUrl(token), expiresAt: expiresAt || null }
}

// إلغاء رابط عام: حذف اللقطة وتصفير حقول الموظف + تدقيق
export async function revokeShareLink({ employee, user }) {
  if (employee.shareToken) {
    try { await deleteDoc(doc(db, 'public', employee.shareToken)) } catch (e) { /* تجاهل */ }
  }
  await updateDoc(doc(db, 'employees', employee.id), {
    shareActive: false,
    shareToken: null,
    shareExpiresAt: null,
    shareRevokedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  await writeAudit({ action: 'share_revoke', entity: 'employee', entityId: employee.id, entityLabel: employee.name, user })
}

// قراءة اللقطة للصفحة العامة (get واحدة فقط)
export async function getPublicSnapshot(token) {
  const s = await getDoc(doc(db, 'public', token))
  return s.exists() ? s.data() : null
}
