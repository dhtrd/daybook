// محوّل البيانات — يقدّم نفس واجهة صفحات التصميم الجديد، لكنه موصول بطبقة بياناتك الحقيقية (lib/db).
// لا وضع تجريبي بعد الآن — كل شيء على Firestore الحقيقي عبر lib/db.
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import * as DB from '../lib/db'

export const isDemo = false

// المستخدم الحالي (للكتابات التي تحتاج user في سجل التدقيق) — يضبطه AuthContext
let sessionUser = null
export function setSessionUser(u) { sessionUser = u }
export function setActor() { /* توافق قديم */ }

// ---------- محوّلات الشكل ----------
function mapEmployee(e) {
  return {
    ...e,
    active: e.status ? e.status === 'active' : e.active !== false,
    dept: e.sponsor || e.department || e.code || '',
  }
}
function toDate(d) {
  if (!d) return new Date(0)
  if (d instanceof Date) return d
  if (d.toDate) return d.toDate()
  return new Date(d)
}
// حركة حقيقية (debit/credit) → شكل صفحات التصميم (type/amount)
function mapTxn(t) {
  const debit = Number(t.debit || 0), credit = Number(t.credit || 0)
  return {
    ...t,
    type: debit > 0 ? 'debit' : 'credit',
    amount: debit > 0 ? debit : credit,
    note: t.details || '',
    no: t.sanad || t.id,
    date: toDate(t.date),
    method: t.deliveredBy || '',
  }
}
function ymd(d) {
  const x = d instanceof Date ? d : new Date(d)
  if (Number.isNaN(x.getTime())) return new Date().toISOString().slice(0, 10)
  return x.toISOString().slice(0, 10)
}

const store = {
  // ===== الموظفون =====
  async listEmployees() { return (await DB.listEmployees()).map(mapEmployee) },
  async getEmployee(id) { const e = await DB.getEmployee(id); return e ? mapEmployee(e) : null },
  async addEmployee(data) {
    return DB.addEmployee({
      name: data.name,
      phone: data.phone || '',
      sponsor: data.dept || '',
      nationalId: data.nationalId || data.iban || '',
      status: data.active === false ? 'stopped' : 'active',
      monthlySalary: Number(data.salary || data.monthlySalary || 0),
    }, sessionUser)
  },
  async updateEmployee(id, data) {
    const patch = { name: data.name, phone: data.phone }
    if (data.dept != null) patch.sponsor = data.dept
    if (data.salary != null) patch.monthlySalary = Number(data.salary)
    return DB.updateEmployee(id, patch, sessionUser)
  },
  // «حذف» في الواجهة = إيقاف الموظف (النظام لا يحذف فعليًّا)
  async deleteEmployee(id) {
    const e = await DB.getEmployee(id)
    return DB.setEmployeeStatus(id, 'stopped', e?.name || '', sessionUser, 'إيقاف من قائمة الموظفين')
  },

  // ===== الحركات =====
  async listTransactions(employeeId) {
    const raw = employeeId ? await DB.listTransactions(employeeId) : await DB.listRecentTransactions(1000)
    return raw.map(mapTxn).sort((a, b) => a.date - b.date)
  },
  async addTransaction(data) {
    return DB.addTransaction({
      employeeId: data.employeeId,
      employeeName: data.employeeName || '',
      date: ymd(data.date),
      type: data.type,
      amount: Number(data.amount),
      details: data.note || data.details || '',
      deliveredBy: data.method || data.deliveredBy || '',
      tags: Array.isArray(data.tags) ? data.tags : [],
      signatureUrl: data.signatureUrl || null,
    }, sessionUser)
  },
  async deleteTransaction(id) {
    const snap = await getDoc(doc(db, 'transactions', id))
    if (!snap.exists()) return
    const t = { id: snap.id, ...snap.data() }
    return DB.softDeleteTransaction(t, sessionUser, 'حذف من كشف الحساب')
  },

  // ===== الأرصدة/الإحصاءات (مساعدة للوحة والتقارير) =====
  async listBalances() { return DB.listBalances() },
  async getGlobalStats() { return DB.getGlobalStats() },

  // ===== التدقيق =====
  async listAudit() {
    return (await DB.listAudit()).map((a) => ({
      id: a.id,
      at: toDate(a.at),
      actor: a.userName || 'غير معروف',
      action: a.action,
      entity: a.entity,
      target: a.entityLabel || '',
      detail: `${a.entityLabel || ''}${a.reason ? ' — ' + a.reason : ''}`.trim() || a.action,
    }))
  },

  // ===== المستخدمون =====
  async listUsers() {
    return (await DB.listUsers()).map((u) => ({
      id: u.uid, ...u, active: u.status ? u.status === 'active' : u.active !== false,
    }))
  },
  async updateUser() { /* تُدار من صفحة المستخدمين الحقيقية */ return null },

  // ===== الإعدادات (settings/config) =====
  async getOrg() {
    const c = (await DB.getConfig()) || {}
    return {
      name: c.companyName || c.name || 'شركة الضبيبي التجارية',
      tagline: c.tagline || 'حسابات الموظفين خارج الكفالة',
      cr: c.cr || c.commercialRegister || '',
      vat: c.vat || c.taxNumber || '',
      phone: c.companyPhone || '',
      address: c.companyAddress || '',
      logoUrl: c.companyLogo || c.logoUrl || '',
      calendar: c.calendar || 'greg',
      currency: c.currency || 'auto',
      maintenanceMode: !!c.maintenanceMode,
    }
  },
  async saveOrg(patch) {
    const map = {}
    if (patch.name != null) map.companyName = patch.name
    if (patch.tagline != null) map.tagline = patch.tagline
    if (patch.cr != null) map.cr = patch.cr
    if (patch.vat != null) map.vat = patch.vat
    if (patch.logoUrl != null) map.companyLogo = patch.logoUrl
    if (patch.calendar != null) map.calendar = patch.calendar
    if (patch.currency != null) map.currency = patch.currency
    return DB.saveConfig(map, sessionUser)
  },

  // ===== الإشعارات (اختياري — يُطوّر لاحقًا) =====
  async listNotifications() { return [] },
  async markNotificationRead() { return true },
  async markAllRead() { return true },
}

export default store
