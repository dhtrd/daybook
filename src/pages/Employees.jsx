import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { listEmployees, listBalances, addEmployee, updateEmployee, setEmployeeStatus, addTransaction } from '../lib/db'
import { exportToExcel } from '../lib/excel'
import { formatMoney, formatDate, todayISO } from '../lib/format'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/ui/Toast'
import { Card } from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Avatar from '../components/ui/Avatar'
import Icon from '../components/ui/Icon'
import { Menu } from '../components/ui/Menu'
import { Chips } from '../components/ui/Tabs'
import Modal from '../components/Modal'
import { ConfirmDialog } from '../components/ui/Dialog'
import ShareModal from '../components/ShareModal'
import { shareState } from '../lib/share'

const OPT_COLS = [
  { key: 'code', label: 'رقم وظيفي' },
  { key: 'sponsor', label: 'الكفيل' },
  { key: 'monthlySalary', label: 'الراتب الشهري' },
  { key: 'hireDate', label: 'المباشرة' },
]

export default function Employees() {
  const navigate = useNavigate()
  const { can, user, config } = useAuth()
  const toast = useToast()
  const [emps, setEmps] = useState(null)
  const [bal, setBal] = useState({})
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('active')
  const [balType, setBalType] = useState('all')
  const [sortBy, setSortBy] = useState('name')
  const [sortDir, setSortDir] = useState('asc')
  const [cols, setCols] = useState({ code: false, sponsor: false, monthlySalary: false, hireDate: false })
  const [sel, setSel] = useState(new Set())
  const [editing, setEditing] = useState(null)
  const [confirmStop, setConfirmStop] = useState(null)
  const [transfer, setTransfer] = useState(false)
  const [shareEmp, setShareEmp] = useState(null)

  const load = async () => { const [e, b] = await Promise.all([listEmployees(), listBalances()]); setEmps(e); setBal(b); setSel(new Set()) }
  useEffect(() => { load().catch(console.error) }, [])

  const rows = useMemo(() => {
    if (!emps) return []
    let list = emps.map((e) => ({ ...e, balance: bal[e.id]?.balance || 0, over: e.advanceLimit > 0 && (bal[e.id]?.balance || 0) > e.advanceLimit }))
    if (q) list = list.filter((e) => (e.name || '').includes(q) || (e.code || '').includes(q) || (e.phone || '').includes(q) || (e.sponsor || '').includes(q))
    if (status !== 'all') list = list.filter((e) => (status === 'active' ? e.status !== 'stopped' : e.status === 'stopped'))
    if (balType === 'owe') list = list.filter((e) => e.balance > 0)
    else if (balType === 'owed') list = list.filter((e) => e.balance < 0)
    else if (balType === 'over') list = list.filter((e) => e.over)
    list.sort((a, b) => {
      let r
      if (sortBy === 'balance') r = a.balance - b.balance
      else if (sortBy === 'code') r = (a.code || '').localeCompare(b.code || '')
      else r = (a.name || '').localeCompare(b.name || '')
      return sortDir === 'asc' ? r : -r
    })
    return list
  }, [emps, bal, q, status, balType, sortBy, sortDir])

  if (!emps) return <div className="loading">جارٍ التحميل…</div>

  const toggleSort = (k) => { if (sortBy === k) setSortDir((d) => d === 'asc' ? 'desc' : 'asc'); else { setSortBy(k); setSortDir('asc') } }
  const arrow = (k) => sortBy === k ? (sortDir === 'asc' ? ' ▲' : ' ▼') : ''
  const toggleSel = (id) => { const s = new Set(sel); s.has(id) ? s.delete(id) : s.add(id); setSel(s) }

  const doExport = (only) => {
    const src = only ? rows.filter((e) => sel.has(e.id)) : rows
    exportToExcel(src.map((e) => ({
      'الاسم': e.name, 'رقم وظيفي': e.code || '', 'الهاتف': e.phone || '', 'الكفيل': e.sponsor || '',
      'الراتب الشهري': e.monthlySalary || 0, 'حد السلفة': e.advanceLimit || 0, 'الرصيد': e.balance,
      'الحالة': e.status === 'stopped' ? 'موقوف' : 'نشط',
    })), 'الموظفون', `الموظفون_${todayISO()}.xlsx`)
    toast.ok('صُدّر الملف')
  }

  const save = async (form) => {
    if (editing?.id) { await updateEmployee(editing.id, form, user); toast.ok('حُفظت التعديلات') }
    else { await addEmployee(form, user); toast.ok('أُضيف الموظف') }
    setEditing(null); load()
  }
  const doStop = async () => {
    const e = confirmStop
    await setEmployeeStatus(e.id, e.status === 'stopped' ? 'active' : 'stopped', e.name, user, '')
    toast.ok(e.status === 'stopped' ? 'أُعيد تفعيله' : 'أُوقف الموظف'); setConfirmStop(null); load()
  }

  return (
    <div>
      <div className="row" style={{ justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
        <div><div className="page-title">الموظفون</div><div className="page-sub">{rows.length.toLocaleString('ar-SA')} موظف</div></div>
        <div className="row no-print" style={{ gap: 8, flexWrap: 'wrap' }}>
          {can('add_transaction') && <Button variant="secondary" size="sm" onClick={() => setTransfer(true)}>⇄ تحويل رصيد</Button>}
          {can('export_reports') && <Button variant="secondary" size="sm" icon="download" onClick={() => doExport(false)}>Excel</Button>}
          <Button variant="secondary" size="sm" icon="print" onClick={() => window.print()}>طباعة الدليل</Button>
          {can('add_employee') && <Button size="sm" icon="plus" onClick={() => setEditing({})}>إضافة موظف</Button>}
        </div>
      </div>

      <Card style={{ marginBottom: 12 }} className="no-print">
        <div className="toolbar">
          <div className="search" style={{ flex: 1, minWidth: 180, display: 'flex', alignItems: 'center', gap: 7, background: 'var(--field)', border: '1px solid var(--line)', borderRadius: 999, padding: '8px 14px' }}>
            <Icon name="search" size={16} /><input value={q} onChange={(e) => setQ(e.target.value)} placeholder="اسم/رقم وظيفي/جوال/كفيل" style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text)' }} />
          </div>
          <Chips value={status} onChange={setStatus} items={[{ value: 'active', label: 'النشطون' }, { value: 'stopped', label: 'الموقوفون' }, { value: 'all', label: 'الكل' }]} />
          <Chips value={balType} onChange={setBalType} items={[{ value: 'all', label: 'كل الأرصدة' }, { value: 'owe', label: 'عليهم' }, { value: 'owed', label: 'لهم' }, { value: 'over', label: 'تجاوز الحدّ' }]} />
        </div>
        <div className="row" style={{ gap: 12, marginTop: 8, flexWrap: 'wrap', fontSize: '0.82em' }}>
          <span className="muted" style={{ fontWeight: 700 }}>أعمدة:</span>
          {OPT_COLS.map((c) => (
            <label key={c.key} className="row" style={{ gap: 5, cursor: 'pointer' }}>
              <input type="checkbox" checked={cols[c.key]} onChange={(e) => setCols({ ...cols, [c.key]: e.target.checked })} style={{ width: 'auto' }} /> {c.label}
            </label>
          ))}
        </div>
      </Card>

      <Card pad={false}>
        <div className="table-wrap">
          <table className="data">
            <thead><tr>
              <th className="no-print" style={{ width: 30 }}></th>
              <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>الموظف{arrow('name')}</th>
              {cols.code && <th onClick={() => toggleSort('code')} style={{ cursor: 'pointer' }}>رقم وظيفي{arrow('code')}</th>}
              <th>الجوال</th>
              {cols.sponsor && <th>الكفيل</th>}
              {cols.monthlySalary && <th>الراتب</th>}
              {cols.hireDate && <th>المباشرة</th>}
              <th onClick={() => toggleSort('balance')} style={{ cursor: 'pointer' }}>الرصيد{arrow('balance')}</th>
              <th>الحالة</th>
              <th className="no-print"></th>
            </tr></thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={10} className="empty">لا موظفين مطابقين</td></tr>}
              {rows.map((e) => (
                <tr key={e.id}>
                  <td className="no-print"><input type="checkbox" checked={sel.has(e.id)} onChange={() => toggleSel(e.id)} style={{ width: 'auto' }} /></td>
                  <td><span className="row" style={{ gap: 8 }}><Avatar name={e.name} size={30} status={e.status === 'stopped' ? 'off' : 'on'} /><span style={{ display: 'grid', gap: 2 }}><span style={{ cursor: 'pointer' }} onClick={() => navigate(`/employees/${e.id}`)}>{e.name}</span>{Array.isArray(e.tags) && e.tags.length > 0 && <span className="row" style={{ gap: 4, flexWrap: 'wrap' }}>{e.tags.map((t) => <Badge key={t} tone="muted">{t}</Badge>)}</span>}</span></span></td>
                  {cols.code && <td className="muted num">{e.code || '—'}</td>}
                  <td className="num muted" dir="ltr" style={{ textAlign: 'right' }}>{e.phone || '—'}</td>
                  {cols.sponsor && <td className="muted">{e.sponsor || '—'}</td>}
                  {cols.monthlySalary && <td className="num">{e.monthlySalary ? formatMoney(e.monthlySalary) : '—'}</td>}
                  {cols.hireDate && <td className="num muted">{e.hireDate ? formatDate(e.hireDate) : '—'}</td>}
                  <td><span className="row" style={{ gap: 6 }}><b className={`num ${e.balance > 0 ? 'debit' : e.balance < 0 ? 'credit' : ''}`}>{formatMoney(Math.abs(e.balance))}</b>{e.over && <Badge tone="neg">تجاوز الحدّ</Badge>}</span></td>
                  <td>{e.status === 'stopped' ? <Badge tone="muted">موقوف</Badge> : <Badge tone="ok">نشط</Badge>}</td>
                  <td className="no-print">
                    <Menu align="start" trigger={<button className="btn btn-sm btn-ghost" onClick={(ev) => ev.stopPropagation()}><Icon name="menu" size={16} /></button>}
                      items={[
                        { icon: 'doc', label: 'كشف الحساب', onClick: () => navigate(`/employees/${e.id}`) },
                        ...(can('share_statement') ? [{ icon: 'qr', label: shareState(e).active ? 'رابط QR (مُفعّل)' : 'مشاركة / QR', onClick: () => setShareEmp(e) }] : []),
                        ...(can('add_transaction') ? [{ icon: 'plus', label: 'حركة جديدة', onClick: () => navigate(`/transactions/new?emp=${e.id}`) }] : []),
                        ...(can('edit_employee') ? [{ icon: 'edit', label: 'تعديل', onClick: () => setEditing(e) }] : []),
                        ...(can('delete_employee') ? [{ type: 'sep' }, { icon: 'trash', label: e.status === 'stopped' ? 'إعادة تفعيل' : 'إيقاف الموظف', danger: e.status !== 'stopped', onClick: () => setConfirmStop(e) }] : []),
                      ]} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {sel.size > 0 && can('export_reports') && (
          <div className="card-pad no-print"><Button variant="secondary" size="sm" icon="download" onClick={() => doExport(true)}>تصدير المحدّدين ({sel.size})</Button></div>
        )}
      </Card>

      {editing && <EmployeeForm employee={editing} availTags={config?.tags || []} onClose={() => setEditing(null)} onSave={save} />}
      <ConfirmDialog open={!!confirmStop} onClose={() => setConfirmStop(null)} onConfirm={doStop}
        tone={confirmStop?.status === 'stopped' ? 'ok' : 'neg'}
        title={confirmStop?.status === 'stopped' ? 'إعادة تفعيل الموظف' : 'إيقاف الموظف'}
        message={confirmStop?.status === 'stopped' ? `سيعود «${confirmStop?.name}» للقوائم النشطة.` : `سيُوقَف «${confirmStop?.name}» مع الاحتفاظ بكل حركاته وسجلّه. يمكن إعادة تفعيله لاحقًا.`}
        confirmText={confirmStop?.status === 'stopped' ? 'تفعيل' : 'إيقاف'} />
      {transfer && <TransferModal employees={emps} user={user} onClose={() => setTransfer(false)} onSaved={() => { setTransfer(false); load() }} toast={toast} />}
      {shareEmp && <ShareModal employee={shareEmp} defaultDuration={config?.shareDefaultDuration || '30d'} user={user} onClose={() => setShareEmp(null)} onChanged={load} />}
    </div>
  )
}

function EmployeeForm({ employee, availTags = [], onClose, onSave }) {
  const [f, setF] = useState(() => ({
    name: employee.name || '', code: employee.code || '', phone: employee.phone || '', nationalId: employee.nationalId || '',
    sponsor: employee.sponsor || '', hireDate: employee.hireDate || '', monthlySalary: employee.monthlySalary || '', advanceLimit: employee.advanceLimit || '',
    tags: employee.tags || [],
  }))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  const toggleTag = (t) => setF({ ...f, tags: f.tags.includes(t) ? f.tags.filter((x) => x !== t) : [...f.tags, t] })
  const submit = () => {
    if (!f.name.trim()) return
    onSave({ ...f, name: f.name.trim(), monthlySalary: Number(f.monthlySalary) || 0, advanceLimit: Number(f.advanceLimit) || 0, tags: f.tags })
  }
  return (
    <Modal wide title={employee.id ? 'تعديل موظف' : 'إضافة موظف'} onClose={onClose}
      footer={<><button className="btn btn-primary" onClick={submit} disabled={!f.name.trim()}>حفظ</button><button className="btn" onClick={onClose}>إلغاء</button></>}>
      <div className="row">
        <div className="field" style={{ flex: 2 }}><label>الاسم *</label><input value={f.name} onChange={set('name')} autoFocus /></div>
        <div className="field"><label>رقم وظيفي</label><input value={f.code} onChange={set('code')} /></div>
      </div>
      <div className="row">
        <div className="field"><label>الجوال</label><input value={f.phone} onChange={set('phone')} dir="ltr" style={{ textAlign: 'right' }} /></div>
        <div className="field"><label>الهوية / الإقامة</label><input value={f.nationalId} onChange={set('nationalId')} dir="ltr" style={{ textAlign: 'right' }} /></div>
      </div>
      <div className="row">
        <div className="field"><label>الكفيل</label><input value={f.sponsor} onChange={set('sponsor')} /></div>
        <div className="field"><label>تاريخ المباشرة</label><input type="date" value={f.hireDate} onChange={set('hireDate')} dir="ltr" /></div>
      </div>
      <div className="row">
        <div className="field"><label>الراتب الشهري</label><input type="number" value={f.monthlySalary} onChange={set('monthlySalary')} /></div>
        <div className="field"><label>الحد الأقصى للسلفة (اختياري)</label><input type="number" value={f.advanceLimit} onChange={set('advanceLimit')} /></div>
      </div>
      {availTags.length > 0 && (
        <div className="field">
          <label>الوسوم</label>
          <div className="row" style={{ flexWrap: 'wrap', gap: 6 }}>
            {availTags.map((t) => (
              <button type="button" key={t} className={`btn btn-sm ${f.tags.includes(t) ? 'btn-primary' : 'btn-ghost'}`} onClick={() => toggleTag(t)}>{t}</button>
            ))}
          </div>
        </div>
      )}
    </Modal>
  )
}

function TransferModal({ employees, user, onClose, onSaved, toast }) {
  const [from, setFrom] = useState('')
  const [to, setTo] = useState('')
  const [amount, setAmount] = useState('')
  const [note, setNote] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const active = employees.filter((e) => e.status !== 'stopped')
  const fromE = employees.find((e) => e.id === from)
  const toE = employees.find((e) => e.id === to)

  const submit = async () => {
    setErr('')
    const amt = Number(amount)
    if (!fromE || !toE) { setErr('اختر الموظفين'); return }
    if (from === to) { setErr('لا يمكن التحويل لنفس الموظف'); return }
    if (!(amt > 0)) { setErr('أدخل مبلغًا صحيحًا'); return }
    setBusy(true)
    try {
      const d = new Date().toISOString().slice(0, 10)
      const base = note ? ` — ${note}` : ''
      await addTransaction({ employeeId: from, employeeName: fromE.name, type: 'credit', amount: amt, date: d, details: `تحويل رصيد إلى ${toE.name}${base}`, deliveredBy: '' }, user)
      await addTransaction({ employeeId: to, employeeName: toE.name, type: 'debit', amount: amt, date: d, details: `تحويل رصيد من ${fromE.name}${base}`, deliveredBy: '' }, user)
      toast.ok('تمّ تحويل الرصيد')
      onSaved()
    } catch (e) { setErr('تعذّر: ' + e.message); setBusy(false) }
  }

  return (
    <Modal title="تحويل رصيد بين موظفين" onClose={onClose}
      footer={<><button className="btn btn-primary" onClick={submit} disabled={busy}>{busy ? 'جارٍ…' : 'تحويل'}</button><button className="btn" onClick={onClose}>إلغاء</button></>}>
      {err && <div className="error-box">{err}</div>}
      <p className="muted" style={{ fontSize: 13, marginBottom: 10 }}>يُنشئ قيدًا دائنًا على «مِن» ومدينًا على «إلى» بنفس المبلغ (قيدان مترابطان).</p>
      <div className="field"><label>مِن (يُخصم من مديونيته)</label><select value={from} onChange={(e) => setFrom(e.target.value)} autoFocus><option value="">— اختر —</option>{active.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
      <div className="field"><label>إلى (تُضاف لمديونيته)</label><select value={to} onChange={(e) => setTo(e.target.value)}><option value="">— اختر —</option>{active.map((e) => <option key={e.id} value={e.id}>{e.name}</option>)}</select></div>
      <div className="field"><label>المبلغ</label><input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} /></div>
      <div className="field"><label>ملاحظة (اختياري)</label><input value={note} onChange={(e) => setNote(e.target.value)} /></div>
    </Modal>
  )
}
