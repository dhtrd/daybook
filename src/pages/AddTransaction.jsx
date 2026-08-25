import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import { Segmented } from '../components/ui/Tabs'
import { AmountField, SelectField, DateField, TextField, TextArea } from '../components/fields/Fields'
import { Stepper } from '../components/ui/Progress'
import { PageLoading } from '../components/ui/Progress'
import { Voucher } from '../components/print/PrintDocs'
import store from '../data/store'
import { useAppearance } from '../context/AppearanceContext'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'

// إضافة حركة — نموذج + سند جنبًا · نوع انزلاقي · مبلغ كبير · سند حيّ
export default function AddTransaction() {
  const navigate = useNavigate()
  const [sp] = useSearchParams()
  const { prefs } = useAppearance()
  const { config } = useAuth()
  const toast = useToast()
  const availTags = config?.tags || []
  const [emps, setEmps] = useState(null)
  const [org, setOrg] = useState(null)
  const [form, setForm] = useState({
    employeeId: sp.get('emp') || '', type: 'debit', amount: '', date: new Date(), method: 'نقدًا', note: '', tags: [],
  })
  const [busy, setBusy] = useState(false)

  useEffect(() => { (async () => { setEmps(await store.listEmployees()); setOrg(await store.getOrg()) })() }, [])

  if (!emps) return <PageLoading />
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const emp = emps.find((e) => e.id === form.employeeId)
  const step = !form.employeeId ? 0 : !form.amount ? 1 : 2

  const submit = async () => {
    if (!form.employeeId || !form.amount) { toast.error('اختر الموظف وأدخل المبلغ'); return }
    setBusy(true)
    try {
      await store.addTransaction({ ...form, amount: Number(form.amount), employeeName: emp?.name })
      toast.ok(form.type === 'debit' ? 'سُجّل الصرف' : 'سُجّل القبض')
      navigate(`/employees/${form.employeeId}`)
    } catch { toast.error('تعذّر الحفظ') } finally { setBusy(false) }
  }

  const voucher = {
    no: (form.type === 'credit' ? 'RC-' : 'SR-') + '____', type: form.type, date: form.date,
    employeeName: emp?.name || '—', amount: Number(form.amount) || 0, method: form.method, note: form.note,
  }

  return (
    <div>
      <div className="page-title">حركة جديدة</div>
      <div className="page-sub" style={{ marginBottom: 18 }}>سجّل صرفًا أو قبضًا — يظهر السند مباشرة على اليسار</div>

      <div style={{ marginBottom: 18 }}><Stepper steps={['الموظف', 'المبلغ', 'الحفظ']} current={step} /></div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 16 }} className="addtxn-grid">
        {/* النموذج */}
        <Card>
          <div className="field">
            <label>نوع الحركة</label>
            <Segmented value={form.type} onChange={(v) => set('type', v)}
              items={[{ value: 'debit', label: 'صرف (مدين)' }, { value: 'credit', label: 'قبض (دائن)' }]} />
          </div>
          <AmountField value={form.amount} onChange={(v) => set('amount', v)} currencyPref={prefs.currency} />
          <SelectField label="الموظف" required value={form.employeeId} onChange={(v) => set('employeeId', v)}
            options={emps.map((e) => ({ value: e.id, label: `${e.name} — ${e.dept}` }))} placeholder="اختر الموظف" />
          <DateField label="التاريخ" value={form.date} onChange={(d) => set('date', d)} calendar={prefs.calendar} />
          <SelectField label="طريقة الصرف" value={form.method} onChange={(v) => set('method', v)}
            options={['نقدًا', 'تحويل بنكي', 'شيك', 'محفظة'].map((m) => ({ value: m, label: m }))} searchable={false} />
          <TextArea label="البيان / الملاحظة" value={form.note} onChange={(e) => set('note', e.target.value)} placeholder="سبب الصرف أو ملاحظة…" />
          {availTags.length > 0 && (
            <div className="field">
              <label>الوسوم</label>
              <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
                {availTags.map((t) => (
                  <button type="button" key={t} className={`btn btn-sm ${form.tags.includes(t) ? 'btn-primary' : 'btn-ghost'}`}
                    onClick={() => set('tags', form.tags.includes(t) ? form.tags.filter((x) => x !== t) : [...form.tags, t])}>{t}</button>
                ))}
              </div>
            </div>
          )}
        </Card>

        {/* السند الحيّ */}
        <div>
          <div className="muted" style={{ fontSize: '0.78em', fontWeight: 800, marginBottom: 8 }}>معاينة السند</div>
          <div style={{ transition: 'box-shadow .2s', borderRadius: 10, overflow: 'hidden', border: `2px solid ${form.type === 'debit' ? 'var(--neg)' : 'var(--ok)'}` }}>
            <Voucher org={org} voucher={voucher} currencyPref={prefs.currency} />
          </div>
        </div>
      </div>

      {/* شريط الحفظ في بطاقة */}
      <Card style={{ marginTop: 16, position: 'sticky', bottom: 12 }}>
        <div className="row" style={{ justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div className="muted" style={{ fontSize: '0.85em' }}>
            {emp ? <>الموظف: <b style={{ color: 'var(--ink)' }}>{emp.name}</b></> : 'لم يُختَر موظف بعد'}
          </div>
          <div className="row" style={{ gap: 8 }}>
            <Button variant="secondary" onClick={() => navigate(-1)}>إلغاء</Button>
            <Button icon="check" onClick={submit} disabled={busy || !form.employeeId || !form.amount}>{busy ? 'جارٍ الحفظ…' : 'حفظ الحركة'}</Button>
          </div>
        </div>
      </Card>

      <style>{`@media(max-width:820px){.addtxn-grid{grid-template-columns:minmax(0,1fr)!important}}`}</style>
    </div>
  )
}
