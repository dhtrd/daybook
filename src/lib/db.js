// طبقة الوصول لقاعدة البيانات Firestore — كل التعاملات تمر من هنا.
import {
  collection, doc, getDoc, getDocs, addDoc, updateDoc, setDoc,
  query, where, orderBy, serverTimestamp, runTransaction, writeBatch,
} from 'firebase/firestore'
import { db } from '../firebase'

/* ============ الموظفون ============ */
export async function listEmployees() {
  const snap = await getDocs(query(collection(db, 'employees'), orderBy('name')))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

export async function getEmployee(id) {
  const s = await getDoc(doc(db, 'employees', id))
  return s.exists() ? { id: s.id, ...s.data() } : null
}

export async function addEmployee(data, user) {
  const ref = await addDoc(collection(db, 'employees'), {
    name: data.name.trim(),
    status: data.status || 'active',
    code: data.code || '',                       // رقم وظيفي
    hireDate: data.hireDate || null,             // تاريخ المباشرة
    monthlySalary: Number(data.monthlySalary) || 0, // الراتب الشهري
    advanceLimit: Number(data.advanceLimit) || 0,   // حد أقصى للسلفة (اختياري)
    phone: data.phone || '',
    nationalId: data.nationalId || '',
    sponsor: data.sponsor || '',
    notes: data.notes || '',
    tags: Array.isArray(data.tags) ? data.tags : [],
    createdAt: serverTimestamp(),
    createdBy: user?.uid || null,
  })
  await writeAudit({ action: 'add', entity: 'employee', entityId: ref.id, entityLabel: data.name, user })
  return ref.id
}

export async function updateEmployee(id, data, user, reason) {
  await updateDoc(doc(db, 'employees', id), {
    ...data,
    updatedAt: serverTimestamp(),
    updatedBy: user?.uid || null,
  })
  await writeAudit({ action: 'edit', entity: 'employee', entityId: id, entityLabel: data.name, user, reason })
}

export async function setEmployeeStatus(id, status, name, user, reason) {
  await updateDoc(doc(db, 'employees', id), { status, updatedAt: serverTimestamp(), updatedBy: user?.uid || null })
  await writeAudit({ action: status === 'stopped' ? 'stop' : 'activate', entity: 'employee', entityId: id, entityLabel: name, user, reason })
}

/* ============ الحركات ============ */
export async function listTransactions(employeeId) {
  const snap = await getDocs(
    query(collection(db, 'transactions'), where('employeeId', '==', employeeId))
  )
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((t) => !t.deleted)
}

// أحدث الحركات (للصفحة الشاملة) — محدودة لتقليل القراءات
export async function listRecentTransactions(max = 500) {
  const snap = await getDocs(query(collection(db, 'transactions'), orderBy('date', 'desc')))
  return snap.docs.slice(0, max).map((d) => ({ id: d.id, ...d.data() })).filter((t) => !t.deleted)
}

// دالة متوافقة قديمًا (تقرأ الكل) — تُستخدم فقط عند الحاجة الفعلية
export async function listAllTransactions() {
  const snap = await getDocs(collection(db, 'transactions'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((t) => !t.deleted)
}

/* ===== أرصدة مجمّعة (denormalized) لتقليل القراءات ===== */
// balances/{employeeId} = { name, debit, credit, balance, txnCount }
// stats/global = { totalDebit, totalCredit, monthly:{ 'YYYY-MM': {debit,credit} } }
export async function listBalances() {
  const snap = await getDocs(collection(db, 'balances'))
  const map = {}
  snap.docs.forEach((d) => { map[d.id] = d.data() })
  return map
}

export async function getGlobalStats() {
  const s = await getDoc(doc(db, 'stats', 'global'))
  return s.exists() ? s.data() : { totalDebit: 0, totalCredit: 0, monthly: {} }
}

export async function getBackupStat() {
  const s = await getDoc(doc(db, 'stats', 'backup'))
  return s.exists() ? s.data() : null
}

function ym(dateStr) { return (dateStr || '').slice(0, 7) }

// يقبل فقط توقيعًا كصورة data URL صالحة وبحجم معقول (≤ 200KB)، وإلا null
function safeSignature(url) {
  const s = typeof url === 'string' ? url : ''
  if (!/^data:image\/(png|jpeg|jpg|webp);base64,[A-Za-z0-9+/=]+$/.test(s)) return null
  if (s.length > 200000) return null
  return s
}

// إضافة حركة: رقم سند تسلسلي + تحديث الأرصدة المجمّعة، كلها في معاملة ذرية واحدة
export async function addTransaction(data, user) {
  const configRef = doc(db, 'settings', 'config')
  const balRef = doc(db, 'balances', data.employeeId)
  const statsRef = doc(db, 'stats', 'global')
  const month = ym(data.date)
  const debit = data.type === 'debit' ? Number(data.amount) : 0
  const credit = data.type === 'credit' ? Number(data.amount) : 0
  let newId = null, sanadNo = null
  await runTransaction(db, async (tx) => {
    const cfg = await tx.get(configRef)
    const bal = await tx.get(balRef)
    const st = await tx.get(statsRef)
    sanadNo = (cfg.exists() ? cfg.data().sanadCounter || 0 : 0) + 1
    const ref = doc(collection(db, 'transactions'))
    newId = ref.id
    tx.set(ref, {
      employeeId: data.employeeId, employeeName: data.employeeName, date: data.date, type: data.type,
      debit, credit, details: data.details || '', deliveredBy: data.deliveredBy || '',
      sanad: String(sanadNo),
      signatureStatus: data.type === 'debit' ? (safeSignature(data.signatureUrl) ? 'signed' : 'pending') : 'na',
      signatureUrl: safeSignature(data.signatureUrl), attachmentUrl: null,
      tags: Array.isArray(data.tags) ? data.tags : [],
      approvalStatus: data.approvalStatus || 'approved', deleted: false,
      createdAt: serverTimestamp(), createdBy: user?.uid || null,
    })
    tx.set(configRef, { sanadCounter: sanadNo }, { merge: true })
    const b = bal.exists() ? bal.data() : { debit: 0, credit: 0, txnCount: 0 }
    const nd = (b.debit || 0) + debit, nc = (b.credit || 0) + credit
    tx.set(balRef, { employeeId: data.employeeId, name: data.employeeName, debit: nd, credit: nc, balance: nd - nc, txnCount: (b.txnCount || 0) + 1, updatedAt: serverTimestamp() }, { merge: true })
    applyStats(tx, statsRef, st, { debit, credit, month })
  })
  await writeAudit({ action: 'add', entity: 'transaction', entityId: newId, entityLabel: `${data.employeeName} — سند ${sanadNo}`, user })
  return { id: newId, sanad: sanadNo }
}

export async function updateTransaction(id, data, user, reason, editedAfterLock) {
  const txRef = doc(db, 'transactions', id)
  const statsRef = doc(db, 'stats', 'global')
  await runTransaction(db, async (tx) => {
    const snap = await tx.get(txRef)
    if (!snap.exists()) throw new Error('الحركة غير موجودة')
    const old = snap.data()
    const balRef = doc(db, 'balances', old.employeeId)
    const bal = await tx.get(balRef)
    const st = await tx.get(statsRef)
    const oldDebit = old.debit || 0, oldCredit = old.credit || 0, oldM = ym(old.date)
    const newDebit = data.debit || 0, newCredit = data.credit || 0, newM = ym(data.date)
    tx.update(txRef, { ...data, updatedAt: serverTimestamp(), updatedBy: user?.uid || null, editReason: reason || null, editedAfterLock: !!editedAfterLock })
    const b = bal.exists() ? bal.data() : { debit: 0, credit: 0 }
    const nd = (b.debit || 0) - oldDebit + newDebit, nc = (b.credit || 0) - oldCredit + newCredit
    tx.set(balRef, { debit: nd, credit: nc, balance: nd - nc, updatedAt: serverTimestamp() }, { merge: true })
    // إزالة القديم ثم إضافة الجديد من الإحصائيات
    let s = applyStatsCompute(st, { debit: -oldDebit, credit: -oldCredit, month: oldM })
    s = applyStatsCompute({ data: () => s, exists: () => true }, { debit: newDebit, credit: newCredit, month: newM })
    tx.set(statsRef, { ...s, updatedAt: serverTimestamp() }, { merge: true })
  })
  await writeAudit({ action: editedAfterLock ? 'edit_locked' : 'edit', entity: 'transaction', entityId: id, entityLabel: data.employeeName, user, reason })
}

export async function softDeleteTransaction(t, user, reason) {
  const txRef = doc(db, 'transactions', t.id)
  const balRef = doc(db, 'balances', t.employeeId)
  const statsRef = doc(db, 'stats', 'global')
  await runTransaction(db, async (tx) => {
    const bal = await tx.get(balRef)
    const st = await tx.get(statsRef)
    tx.update(txRef, { deleted: true, deletedAt: serverTimestamp(), deletedBy: user?.uid || null, deleteReason: reason || null })
    const b = bal.exists() ? bal.data() : { debit: 0, credit: 0, txnCount: 0 }
    const nd = (b.debit || 0) - (t.debit || 0), nc = (b.credit || 0) - (t.credit || 0)
    tx.set(balRef, { debit: nd, credit: nc, balance: nd - nc, txnCount: Math.max(0, (b.txnCount || 0) - 1), updatedAt: serverTimestamp() }, { merge: true })
    applyStats(tx, statsRef, st, { debit: -(t.debit || 0), credit: -(t.credit || 0), month: ym(t.date) })
  })
  await writeAudit({ action: 'delete', entity: 'transaction', entityId: t.id, entityLabel: `${t.employeeName} — سند ${t.sanad}`, user, reason })
}

// اعتماد حركة معلّقة
export async function approveTransaction(id, employeeName, user) {
  await updateDoc(doc(db, 'transactions', id), { approvalStatus: 'approved', updatedAt: serverTimestamp(), updatedBy: user?.uid || null })
  await writeAudit({ action: 'approve', entity: 'transaction', entityId: id, entityLabel: employeeName, user })
}

// استعادة حركة محذوفة (عكس الحذف الناعم)
export async function restoreTransaction(t, user) {
  const txRef = doc(db, 'transactions', t.id)
  const balRef = doc(db, 'balances', t.employeeId)
  const statsRef = doc(db, 'stats', 'global')
  await runTransaction(db, async (tx) => {
    const bal = await tx.get(balRef)
    const st = await tx.get(statsRef)
    tx.update(txRef, { deleted: false, restoredAt: serverTimestamp(), restoredBy: user?.uid || null })
    const b = bal.exists() ? bal.data() : { debit: 0, credit: 0, txnCount: 0 }
    const nd = (b.debit || 0) + (t.debit || 0), nc = (b.credit || 0) + (t.credit || 0)
    tx.set(balRef, { debit: nd, credit: nc, balance: nd - nc, txnCount: (b.txnCount || 0) + 1, updatedAt: serverTimestamp() }, { merge: true })
    applyStats(tx, statsRef, st, { debit: t.debit || 0, credit: t.credit || 0, month: ym(t.date) })
  })
  await writeAudit({ action: 'restore', entity: 'transaction', entityId: t.id, entityLabel: `${t.employeeName} — سند ${t.sanad}`, user })
}

// الحركات المحذوفة
export async function listDeletedTransactions() {
  const snap = await getDocs(collection(db, 'transactions'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((t) => t.deleted)
}

function applyStatsCompute(st, { debit, credit, month }) {
  const s = st.exists() ? st.data() : { totalDebit: 0, totalCredit: 0, monthly: {} }
  const monthly = { ...(s.monthly || {}) }
  if (month) {
    const m = monthly[month] || { debit: 0, credit: 0 }
    monthly[month] = { debit: (m.debit || 0) + debit, credit: (m.credit || 0) + credit }
  }
  return { totalDebit: (s.totalDebit || 0) + debit, totalCredit: (s.totalCredit || 0) + credit, monthly }
}

function applyStats(tx, statsRef, st, delta) {
  tx.set(statsRef, { ...applyStatsCompute(st, delta), updatedAt: serverTimestamp() }, { merge: true })
}

/* ============ إقفال الفترات ============ */
export async function listLockedPeriods() {
  const snap = await getDocs(collection(db, 'lockedPeriods'))
  return snap.docs.map((d) => ({ key: d.id, ...d.data() }))
}

export async function lockPeriod(key, user) {
  await setDoc(doc(db, 'lockedPeriods', key), { key, lockedBy: user?.uid || null, lockedByName: user?.name || '', lockedAt: serverTimestamp() })
  await writeAudit({ action: 'lock_period', entity: 'period', entityId: key, entityLabel: key, user })
}

export async function unlockPeriod(key, user, reason) {
  const batch = writeBatch(db)
  batch.delete(doc(db, 'lockedPeriods', key))
  await batch.commit()
  await writeAudit({ action: 'unlock_period', entity: 'period', entityId: key, entityLabel: key, user, reason })
}

// إقفال شهر مع خيار ترحيل قيود الرواتب (mode='post') أو الاكتفاء بالإقفال (mode='display')
// postings = [{ employeeId, employeeName, amount, prorated }] — لِوضع القيود
// snapshot = [{ employeeId, name, balance, salary }] — لقطة للأرشفة
export async function closePeriod(month, mode, postings, snapshot, user) {
  const date = `${month}-${String(new Date(Number(month.slice(0,4)), Number(month.slice(5,7)), 0).getDate()).padStart(2,'0')}`
  let totalSalary = 0
  if (mode === 'post' && postings.length) {
    const configRef = doc(db, 'settings', 'config')
    const cfg = await getDoc(configRef)
    let sanad = cfg.exists() ? cfg.data().sanadCounter || 0 : 0
    const st = await getDoc(doc(db, 'stats', 'global'))
    let stats = st.exists() ? st.data() : { totalDebit: 0, totalCredit: 0, monthly: {} }
    const monthly = { ...(stats.monthly || {}) }
    let batch = writeBatch(db); let n = 0
    for (const p of postings) {
      if (!(p.amount > 0)) continue
      sanad += 1; totalSalary += p.amount
      const txRef = doc(collection(db, 'transactions'))
      batch.set(txRef, {
        employeeId: p.employeeId, employeeName: p.employeeName, date,
        type: 'credit', debit: 0, credit: p.amount,
        details: `قيد راتب ${month}${p.prorated ? ' (نسبي)' : ''}`,
        deliveredBy: '', sanad: String(sanad), salaryPosting: true, period: month,
        signatureStatus: 'na', approvalStatus: 'approved', deleted: false,
        createdAt: serverTimestamp(), createdBy: user?.uid || null,
      })
      const balRef = doc(db, 'balances', p.employeeId)
      const b = await getDoc(balRef)
      const bd = b.exists() ? b.data() : { debit: 0, credit: 0, txnCount: 0 }
      const nc = (bd.credit || 0) + p.amount
      batch.set(balRef, { credit: nc, balance: (bd.debit || 0) - nc, txnCount: (bd.txnCount || 0) + 1, updatedAt: serverTimestamp() }, { merge: true })
      const mm = monthly[month] || { debit: 0, credit: 0 }
      monthly[month] = { debit: mm.debit || 0, credit: (mm.credit || 0) + p.amount }
      n++
      if (n % 100 === 0) { await batch.commit(); batch = writeBatch(db) }
    }
    batch.set(configRef, { sanadCounter: sanad }, { merge: true })
    batch.set(doc(db, 'stats', 'global'), { totalCredit: (stats.totalCredit || 0) + totalSalary, monthly, updatedAt: serverTimestamp() }, { merge: true })
    await batch.commit()
  }
  // إقفال + لقطة
  await setDoc(doc(db, 'lockedPeriods', month), { key: month, mode, totalSalary, lockedBy: user?.uid || null, lockedByName: user?.name || '', lockedAt: serverTimestamp() })
  await setDoc(doc(db, 'closingReports', month), { month, mode, totalSalary, snapshot: snapshot || [], closedBy: user?.uid || null, closedByName: user?.name || '', closedAt: serverTimestamp() })
  await writeAudit({ action: 'lock_period', entity: 'period', entityId: month, entityLabel: `${month} (${mode === 'post' ? 'قيد رواتب' : 'عرض'})`, user })
}

// إعادة فتح شهر: يعكس قيود الرواتب المرحّلة (حذف ناعم) ويصحّح الأرصدة، ثم يفتح
export async function reopenPeriod(month, user, reason) {
  const snap = await getDocs(query(collection(db, 'transactions'), where('period', '==', month)))
  const postings = snap.docs.map((d) => ({ id: d.id, ...d.data() })).filter((t) => t.salaryPosting && !t.deleted)
  for (const t of postings) {
    await softDeleteTransaction(t, user, 'عكس قيد راتب عند إعادة فتح ' + month)
  }
  const batch = writeBatch(db)
  batch.delete(doc(db, 'lockedPeriods', month))
  await batch.commit()
  await writeAudit({ action: 'unlock_period', entity: 'period', entityId: month, entityLabel: `${month} (عُكس ${postings.length} قيد راتب)`, user, reason })
}

export async function listClosingReports() {
  const snap = await getDocs(collection(db, 'closingReports'))
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
}

/* ============ المستخدمون ============ */
export async function listUsers() {
  const snap = await getDocs(collection(db, 'users'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}

export async function getUserDoc(uid) {
  const s = await getDoc(doc(db, 'users', uid))
  return s.exists() ? { uid: s.id, ...s.data() } : null
}

// خدمة ذاتية: تعديل الاسم الشخصي (مسموح في القواعد)
export async function updateOwnName(uid, name) {
  await setDoc(doc(db, 'users', uid), { name: name.trim(), updatedAt: serverTimestamp() }, { merge: true })
}

// خدمة ذاتية: تسجيل تغيير كلمة المرور (يُسمح بها في القواعد لصاحب الحساب)
export async function markPasswordChanged(uid) {
  await setDoc(doc(db, 'users', uid), {
    mustChangePassword: false,
    passwordChangedAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export async function saveUserDoc(uid, data, actor) {
  await setDoc(doc(db, 'users', uid), { ...data, updatedAt: serverTimestamp() }, { merge: true })
  await writeAudit({ action: 'edit', entity: 'user', entityId: uid, entityLabel: data.name || uid, user: actor })
}

/* ============ الإعدادات ============ */
export async function getConfig() {
  const s = await getDoc(doc(db, 'settings', 'config'))
  return s.exists() ? s.data() : {}
}

export async function saveConfig(data, user) {
  await setDoc(doc(db, 'settings', 'config'), data, { merge: true })
  await writeAudit({ action: 'edit', entity: 'settings', entityId: 'config', entityLabel: 'إعدادات النظام', user })
}

/* ============ سجل التدقيق ============ */
export async function writeAudit({ action, entity, entityId, entityLabel, user, reason }) {
  try {
    await addDoc(collection(db, 'auditLog'), {
      action, entity, entityId: entityId || null, entityLabel: entityLabel || '',
      userId: user?.uid || null, userName: user?.name || user?.email || 'غير معروف',
      reason: reason || null, at: serverTimestamp(),
    })
  } catch (e) {
    console.error('audit write failed', e)
  }
}

export async function listAudit(max = 1000) {
  const snap = await getDocs(query(collection(db, 'auditLog'), orderBy('at', 'desc')))
  return snap.docs.slice(0, max).map((d) => ({ id: d.id, ...d.data() }))
}

export async function listLoginLog(max = 500) {
  const snap = await getDocs(query(collection(db, 'loginLog'), orderBy('at', 'desc')))
  return snap.docs.slice(0, max).map((d) => ({ id: d.id, ...d.data() }))
}

export async function listSessions() {
  const snap = await getDocs(collection(db, 'sessions'))
  return snap.docs.map((d) => ({ uid: d.id, ...d.data() }))
}
