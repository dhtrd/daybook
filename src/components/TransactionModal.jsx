import { useState } from 'react'
import Modal from './Modal'
import SignaturePad from './SignaturePad'
import { addTransaction, updateTransaction } from '../lib/db'
import { periodKey } from '../lib/balance'
import { todayISO } from '../lib/format'
import { useAuth } from '../context/AuthContext'

// نموذج إضافة/تعديل حركة. يفرض: التاريخ إجباري، والسبب إجباري عند التعديل أو داخل فترة مقفلة.
export default function TransactionModal({ employee, txn, lockedPeriods, user, can, onClose, onSaved }) {
  const { config } = useAuth()
  const editing = !!txn
  const [form, setForm] = useState({
    type: txn?.type || 'debit',
    amount: txn ? (txn.debit || txn.credit) : '',
    date: txn?.date || todayISO(),
    details: txn?.details || '',
    deliveredBy: txn?.deliveredBy || '',
    tags: txn?.tags || [],
  })
  const availTags = config?.tags || []
  const toggleTag = (t) => setForm((s) => ({ ...s, tags: s.tags.includes(t) ? s.tags.filter((x) => x !== t) : [...s.tags, t] }))
  const [signature, setSignature] = useState(null)
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value })

  const lockedSet = new Set((lockedPeriods || []).map((p) => p.key))
  const targetPeriod = periodKey(form.date)
  const inLocked = targetPeriod && lockedSet.has(targetPeriod)

  const save = async () => {
    setErr('')
    if (!form.date) { setErr('التاريخ مطلوب'); return }
    const amt = Number(form.amount)
    if (!amt || amt <= 0) { setErr('المبلغ يجب أن يكون أكبر من صفر'); return }
    if (inLocked && !can('edit_locked_period')) {
      setErr('هذه الفترة مقفلة، وتحتاج صلاحية «فتح/تعديل فترة مقفلة».'); return
    }
    if ((editing || inLocked) && !reason.trim()) {
      setErr('سبب ' + (inLocked ? 'التعديل داخل فترة مقفلة' : 'التعديل') + ' إجباري.'); return
    }
    setBusy(true)
    try {
      if (editing) {
        await updateTransaction(txn.id, {
          type: form.type,
          debit: form.type === 'debit' ? amt : 0,
          credit: form.type === 'credit' ? amt : 0,
          date: form.date, details: form.details, deliveredBy: form.deliveredBy,
          tags: form.tags, employeeName: employee.name,
        }, user, reason, inLocked)
      } else {
        // نظام الموافقة (Maker-Checker)
        let approvalStatus = 'approved'
        if (config?.approvalEnabled && amt > Number(config?.approvalThreshold || 0) && !can('approve_transactions')) {
          approvalStatus = 'pending'
        }
        await addTransaction({
          employeeId: employee.id, employeeName: employee.name,
          type: form.type, amount: amt, date: form.date,
          details: form.details, deliveredBy: form.deliveredBy,
          tags: form.tags,
          signatureUrl: form.type === 'debit' ? signature : null,
          approvalStatus,
        }, user)
      }
      onSaved()
    } catch (e) { setErr('تعذّر الحفظ: ' + e.message); setBusy(false) }
  }

  return (
    <Modal
      title={editing ? 'تعديل حركة' : `حركة جديدة — ${employee.name}`}
      onClose={onClose}
      footer={<>
        <button className="btn btn-primary" onClick={save} disabled={busy}>{busy ? 'جارٍ الحفظ…' : 'حفظ'}</button>
        <button className="btn" onClick={onClose}>إلغاء</button>
      </>}
    >
      {err && <div className="error-box">{err}</div>}
      {inLocked && <div className="error-box" style={{ background: 'var(--warn-light)', color: 'var(--warn)' }}>
        ⚠️ الفترة {targetPeriod} مقفلة. أي تعديل سيُوسم كـ«معدّل بعد الإقفال» ويتطلب ذكر السبب.
      </div>}
      <div className="row">
        <div className="field">
          <label>نوع الحركة</label>
          <select value={form.type} onChange={set('type')}>
            <option value="debit">مدين (صرف/سلفة على الموظف)</option>
            <option value="credit">دائن (سداد/إقفال)</option>
          </select>
        </div>
        <div className="field">
          <label>المبلغ *</label>
          <input type="number" value={form.amount} onChange={set('amount')} min="0" step="any" />
        </div>
      </div>
      <div className="row">
        <div className="field">
          <label>التاريخ *</label>
          <input type="date" value={form.date} onChange={set('date')} dir="ltr" style={{ textAlign: 'right' }} />
        </div>
        {form.type === 'debit' && (
          <div className="field">
            <label>اسم المُسلِّم</label>
            <input value={form.deliveredBy} onChange={set('deliveredBy')} placeholder="من سلّم المبلغ فعليًا" />
          </div>
        )}
      </div>
      <div className="field">
        <label>التفاصيل / البيان</label>
        <textarea rows={2} value={form.details} onChange={set('details')} placeholder="مثال: نقدي من أبو خالد بالعمرة" />
      </div>
      {availTags.length > 0 && (
        <div className="field">
          <label>الوسوم</label>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
            {availTags.map((t) => (
              <button type="button" key={t} className={`btn btn-sm ${form.tags.includes(t) ? 'btn-primary' : 'btn-ghost'}`} onClick={() => toggleTag(t)}>{t}</button>
            ))}
          </div>
        </div>
      )}
      {!editing && form.type === 'debit' && (
        <div className="field">
          <label>توقيع المستلم (اختياري — عند التسليم المباشر)</label>
          <SignaturePad onChange={setSignature} />
        </div>
      )}
      {(editing || inLocked) && (
        <div className="field">
          <label>سبب التعديل *</label>
          <input value={reason} onChange={(e) => setReason(e.target.value)} placeholder="إجباري — يُسجَّل في سجل التدقيق" />
        </div>
      )}
    </Modal>
  )
}
