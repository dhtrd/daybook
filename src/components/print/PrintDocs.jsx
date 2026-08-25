import Logo from '../../lib/Logo'
import { formatMoney } from '../../lib/currency'
import { fmtDate, ar } from '../../lib/hijri'
import './print.css'

// شعار الطباعة: شعار الشركة إن رُفع، وإلا شعار التطبيق (قرار ٥)
function PrintHead({ org }) {
  return (
    <div className="pr-head">
      <div className="pr-logo">
        {org?.logoUrl ? <img src={org.logoUrl} alt="شعار الشركة" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          : <Logo size={52} ag="#1c2b26" ag2="#2d443b" coin="#AF8228" plus="#fff" />}
      </div>
      <div>
        <div className="pr-name">{org?.name || 'شركة الضبيبي التجارية'}</div>
        <div className="pr-sub">{org?.tagline || 'حسابات الموظفين خارج الكفالة'}{org?.cr ? ` · س.ت ${org.cr}` : ''}</div>
        {org?.address && <div className="pr-sub">{org.address}{org?.phone ? ` · ${org.phone}` : ''}</div>}
      </div>
    </div>
  )
}

// سند صرف (المعتمد) — مع QR وتوقيع (مرشّح)
export function Voucher({ org, voucher, currencyPref = 'auto' }) {
  const v = voucher || {}
  const isReceipt = v.type === 'credit'
  return (
    <div className="print-doc">
      <div className="print-paper">
        <PrintHead org={org} />
        <div className="pr-title"><span className="chip">{isReceipt ? 'سند قبض' : 'سند صرف'}</span></div>
        <div className="pr-meta">
          <span>رقم السند: {v.no || '—'}</span>
          <span>التاريخ: {v.date ? fmtDate(v.date, org?.calendar) : '—'}</span>
        </div>
        <div className="pr-row"><span>{isReceipt ? 'استُلم من' : 'صُرف إلى'}</span><b>{v.employeeName || '—'}</b></div>
        <div className="pr-row"><span>وذلك مقابل</span><b>{v.note || v.reason || '—'}</b></div>
        <div className="pr-row"><span>طريقة {isReceipt ? 'الاستلام' : 'الصرف'}</span><b>{v.method || 'نقدًا'}</b></div>
        <div className="pr-total"><span>المبلغ</span><span className="num">{formatMoney(v.amount, { pref: currencyPref })}</span></div>
        <div className="pr-sign">
          <div><QR /><div style={{ marginTop: 4 }}>رمز التحقّق</div></div>
          <div><div className="ln" /> {isReceipt ? 'المستلم' : 'المستلم'}</div>
          <div><div className="ln" /> المحاسب</div>
        </div>
        <div className="pr-foot"><span>{org?.name || 'الضبيبي التجارية'} · نظام الحسابات</span><span>نسخة أصلية</span></div>
      </div>
    </div>
  )
}

// كشف حساب للطباعة
export function StatementPrint({ org, employee, statement, period, currencyPref = 'auto' }) {
  const s = statement || {}
  const rows = s.rows || []
  return (
    <div className="print-doc">
      <div className="print-paper">
        <PrintHead org={org} />
        <div className="pr-title">كشف حساب موظف</div>
        <div className="pr-meta">
          <span>الموظف: {employee?.name}</span>
          <span>الفترة: {period || 'الكل'}</span>
        </div>
        <table className="pr-table">
          <thead><tr><th>التاريخ</th><th>البيان</th><th>مدين</th><th>دائن</th><th>الرصيد</th></tr></thead>
          <tbody>
            <tr><td colSpan={4}><b>رصيد افتتاحي مُرحّل</b></td><td className="num">{formatMoney(s.opening, { pref: currencyPref, symbol: false })}</td></tr>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{fmtDate(r.date instanceof Date ? r.date : new Date(r.date), org?.calendar)}</td>
                <td>{r.note || (r.type === 'debit' ? 'سلفة' : 'سداد')}</td>
                <td className="pr-neg num">{r.type === 'debit' ? formatMoney(r.amount, { pref: currencyPref, symbol: false }) : '—'}</td>
                <td className="pr-pos num">{r.type === 'credit' ? formatMoney(r.amount, { pref: currencyPref, symbol: false }) : '—'}</td>
                <td className="num">{formatMoney(r.balance, { pref: currencyPref, symbol: false })}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pr-total dark"><span>الرصيد الختامي</span><span className="num">{formatMoney(s.closing, { pref: currencyPref })}</span></div>
        <div className="pr-foot"><span>{org?.name || 'الضبيبي التجارية'}</span><span>عدد الحركات: {ar(s.count || 0)}</span></div>
      </div>
    </div>
  )
}

// تقرير إجمالي للطباعة
export function ReportPrint({ org, title = 'تقرير إجمالي الأرصدة', rows = [], total, period, currencyPref = 'auto' }) {
  return (
    <div className="print-doc">
      <div className="print-paper">
        <PrintHead org={org} />
        <div className="pr-title">{title}</div>
        <div className="pr-meta"><span>الفترة: {period || '—'}</span><span>عدد الموظفين: {ar(rows.length)}</span></div>
        <table className="pr-table">
          <thead><tr><th>الموظف</th><th>القسم</th><th>الرصيد</th><th>الحالة</th></tr></thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={i}>
                <td>{r.name}</td><td>{r.dept || '—'}</td>
                <td className={`num ${r.balance > 0 ? 'pr-neg' : r.balance < 0 ? 'pr-pos' : ''}`}>{formatMoney(Math.abs(r.balance), { pref: currencyPref, symbol: false })}</td>
                <td>{r.balance > 0 ? 'عليه' : r.balance < 0 ? 'له' : 'صفر'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="pr-total dark"><span>صافي الإجمالي</span><span className="num">{formatMoney(total, { pref: currencyPref })}</span></div>
      </div>
    </div>
  )
}

function QR() {
  // نمط QR توضيحي (رمز فعلي يُنشأ من رابط الخادم)
  return (
    <svg className="pr-qr" viewBox="0 0 10 10" shapeRendering="crispEdges">
      {Array.from({ length: 100 }).map((_, i) => {
        const x = i % 10, y = Math.floor(i / 10)
        const on = (x * 7 + y * 3 + x * y) % 3 === 0
        return on ? <rect key={i} x={x} y={y} width="1" height="1" fill="#1c2b26" /> : null
      })}
    </svg>
  )
}
