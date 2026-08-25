import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPublicSnapshot } from '../lib/share'
import { formatMoney, formatDate, formatDateTime, setCurrency } from '../lib/format'

// صفحة عامة «اطّلاع فقط» بلا تسجيل دخول — تُفتح من رمز QR الخاص بالموظف.
// تقرأ لقطة واحدة من مجموعة public (get واحدة). الانتهاء مفروض على الخادم في القواعد.
export default function PublicStatement() {
  const { token } = useParams()
  const [snap, setSnap] = useState(undefined) // undefined=تحميل، null=غير متاح

  useEffect(() => {
    let alive = true
    getPublicSnapshot(token)
      .then((s) => { if (!alive) return; if (s) setCurrency(s.currencySymbol); setSnap(s || null) })
      .catch(() => { if (alive) setSnap(null) })
    return () => { alive = false }
  }, [token])

  if (snap === undefined) return <div className="loading">جارٍ التحميل…</div>

  if (snap === null) {
    return (
      <div className="login-wrap">
        <div className="login-card center">
          <h2>الرابط غير متاح</h2>
          <p className="muted" style={{ lineHeight: 1.9 }}>
            هذا الرابط منتهي الصلاحية أو غير صحيح.<br />يرجى طلب رابط جديد من الشركة.
          </p>
        </div>
      </div>
    )
  }

  const rows = snap.rows || []
  const t = snap.totals || { debit: 0, credit: 0, balance: 0 }

  return (
    <div className="public-page">
      <div className="public-actions no-print">
        <button className="btn btn-primary" onClick={() => window.print()}>🖨️ حفظ PDF / طباعة</button>
      </div>

      <div className="card card-pad public-sheet">
        <div className="public-head">
          {snap.companyLogo && <img src={snap.companyLogo} alt="" style={{ height: 54, borderRadius: 8 }} />}
          <div>
            <h2 style={{ margin: 0, color: 'var(--brand)' }}>{snap.companyName}</h2>
            {snap.companyAddress && <div className="muted">{snap.companyAddress}</div>}
            {snap.companyPhone && <div className="muted" dir="ltr" style={{ textAlign: 'right' }}>{snap.companyPhone}</div>}
          </div>
        </div>

        <h3 style={{ margin: '4px 0 2px' }}>
          كشف حساب: {snap.employeeName}
          {snap.employeeCode && <span className="muted" style={{ fontWeight: 400 }}> — رقم {snap.employeeCode}</span>}
          {snap.employeeStatus === 'stopped' && <span className="badge badge-muted" style={{ marginInlineStart: 8 }}>متوقف</span>}
        </h3>
        <div className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
          تاريخ الإصدار: {formatDateTime(snap.generatedAt)}
          {snap.expiresAt ? <> · صالح حتى: {formatDateTime(snap.expiresAt)}</> : <> · نسخة اطّلاع دائمة</>}
        </div>

        <div className="stat-grid" style={{ marginBottom: 16 }}>
          <div className="stat"><div className="label">إجمالي المدين</div><div className="value" style={{ color: 'var(--ok)', fontSize: 20 }}>{formatMoney(t.debit)}</div></div>
          <div className="stat"><div className="label">إجمالي الدائن</div><div className="value" style={{ color: 'var(--danger)', fontSize: 20 }}>{formatMoney(t.credit)}</div></div>
          <div className="stat"><div className="label">الرصيد الحالي</div><div className="value" style={{ color: 'var(--brand)', fontSize: 20 }}>{formatMoney(t.balance)}</div></div>
        </div>

        <div className="table-wrap">
          <table className="data">
            <thead>
              <tr><th>#</th><th>التاريخ</th><th>سند</th><th>التفاصيل</th><th>مدين</th><th>دائن</th><th>الرصيد</th></tr>
            </thead>
            <tbody>
              {rows.length === 0 && <tr><td colSpan={7} className="empty">لا توجد حركات</td></tr>}
              {rows.map((r, i) => (
                <tr key={i}>
                  <td className="muted">{i + 1}</td>
                  <td className="num">{formatDate(r.date)}</td>
                  <td className="num muted">{r.sanad || '—'}</td>
                  <td>{r.details}
                    {r.editedAfterLock && <span className="badge badge-warn" style={{ marginInlineStart: 6 }}>معدّل بعد الإقفال</span>}
                  </td>
                  <td className="num debit">{r.debit ? formatMoney(r.debit) : ''}</td>
                  <td className="num credit">{r.credit ? formatMoney(r.credit) : ''}</td>
                  <td className="num" style={{ fontWeight: 700 }}>{formatMoney(r.running)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr style={{ fontWeight: 800, background: '#f8fafc' }}>
                <td colSpan={4}>الإجمالي</td>
                <td className="num debit">{formatMoney(t.debit)}</td>
                <td className="num credit">{formatMoney(t.credit)}</td>
                <td className="num" style={{ color: 'var(--brand)' }}>{formatMoney(t.balance)}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        <div className="public-foot muted">
          نسخة اطّلاع فقط صادرة من {snap.companyName}. للاستفسار يرجى التواصل مع الشركة.
        </div>
      </div>
    </div>
  )
}
