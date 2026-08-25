import { useState, useEffect } from 'react'
import { Card } from '../components/ui/Card'
import { Tabs, Segmented } from '../components/ui/Tabs'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Icon from '../components/ui/Icon'
import Logo from '../lib/Logo'
import { THEMES, FONT_SIZES, DENSITIES, MODES } from '../theme/themes'
import { useAppearance } from '../context/AppearanceContext'
import { useAuth } from '../context/AuthContext'
import { getConfig, saveConfig, getBackupStat } from '../lib/db'
import { downloadBackup } from '../lib/backupClient'
import { setCurrency } from '../lib/currency'
import { formatDateTime } from '../lib/format'
import { PageLoading } from '../components/ui/Progress'
import { useToast } from '../components/ui/Toast'

// تصغير صورة إلى data URL (بلا Storage) — أقصى عرض/ارتفاع maxW
function resizeImage(file, maxW, quality) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const img = new Image()
      img.onload = () => {
        const scale = Math.min(1, maxW / Math.max(img.width, img.height))
        const w = Math.round(img.width * scale), h = Math.round(img.height * scale)
        const cvs = document.createElement('canvas'); cvs.width = w; cvs.height = h
        const ctx = cvs.getContext('2d'); ctx.drawImage(img, 0, 0, w, h)
        try { resolve(cvs.toDataURL('image/png')) } catch (e) { reject(e) }
      }
      img.onerror = reject
      img.src = reader.result
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export default function Settings() {
  const { prefs, update } = useAppearance()
  const { user } = useAuth()
  const toast = useToast()
  const [tab, setTab] = useState('appearance')
  const [cfg, setCfg] = useState(null)
  const [backupStat, setBackupStat] = useState(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    (async () => {
      setCfg((await getConfig()) || {})
      setBackupStat(await getBackupStat().catch(() => null))
    })()
  }, [])
  if (!cfg) return <PageLoading />

  const set = (k, v) => setCfg({ ...cfg, [k]: v })
  const saveSection = async (patch) => {
    setBusy(true)
    try { const next = { ...cfg, ...patch }; setCfg(next); await saveConfig(patch, user); toast.ok('حُفظت الإعدادات') }
    catch { toast.error('تعذّر الحفظ') } finally { setBusy(false) }
  }

  // رفع الشعار بلا Firebase Storage: تصغير الصورة وحفظها كـ data URL داخل الإعدادات (Firestore)
  const uploadLogo = async (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) { toast.error('اختر ملف صورة'); return }
    setBusy(true)
    try {
      const dataUrl = await resizeImage(file, 300, 0.85)
      if (dataUrl.length > 900000) { toast.error('الصورة كبيرة — اختر شعارًا أصغر'); setBusy(false); return }
      await saveSection({ companyLogo: dataUrl })
    } catch {
      toast.error('تعذّر معالجة الصورة'); setBusy(false)
    }
  }

  const exportSettings = () => {
    const blob = new Blob([JSON.stringify(cfg, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'settings.json'; a.click()
    toast.ok('صُدّرت الإعدادات')
  }
  const importSettings = async (file) => {
    if (!file) return
    try { const data = JSON.parse(await file.text()); await saveSection(data); toast.ok('استُوردت الإعدادات') }
    catch { toast.error('ملف غير صالح') }
  }

  const TABS = [
    { value: 'appearance', label: 'المظهر' },
    { value: 'company', label: 'الشركة' },
    { value: 'finance', label: 'المالية والإقفال' },
    { value: 'security', label: 'الأمان' },
    { value: 'backup', label: 'النسخ الاحتياطي' },
    { value: 'general', label: 'عام' },
  ]

  return (
    <div>
      <div className="page-title">الإعدادات</div>
      <div className="page-sub" style={{ marginBottom: 16 }}>المظهر، الشركة، المالية، الأمان، النسخ، والعام</div>
      <div style={{ marginBottom: 16 }}><Tabs value={tab} onChange={setTab} items={TABS} /></div>

      {tab === 'appearance' && (
        <div style={{ display: 'grid', gap: 14 }}>
          <Card>
            <div className="card-title" style={{ marginBottom: 4 }}>الثيم</div>
            <div className="card-sub" style={{ marginBottom: 14 }}>يُطبَّق فورًا · لكل مستخدم على حدة</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
              {THEMES.map((t) => {
                const c = prefs.mode === 'dark' ? t.dark : t.light; const on = prefs.theme === t.id
                return (
                  <button key={t.id} onClick={() => update({ theme: t.id })} style={{ textAlign: 'right', border: `2px solid ${on ? 'var(--brand)' : 'var(--line)'}`, borderRadius: 12, padding: 10, background: 'var(--surface)', cursor: 'pointer' }}>
                    <div className="row" style={{ gap: 5, marginBottom: 8 }}>
                      <span style={{ width: 22, height: 22, borderRadius: 6, background: c.brand }} /><span style={{ width: 22, height: 22, borderRadius: 6, background: c.brand2 }} /><span style={{ width: 22, height: 22, borderRadius: 6, background: c.brass }} />
                      {on && <Icon name="check" size={16} style={{ marginInlineStart: 'auto', color: 'var(--brand)' }} />}
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '0.82em' }}>{t.name}</div>
                  </button>
                )
              })}
            </div>
          </Card>
          <Card>
            <div className="card-title" style={{ marginBottom: 14 }}>الوضع والخط والكثافة</div>
            <div style={{ display: 'grid', gap: 14 }}>
              <Row label="الوضع"><Segmented value={prefs.mode} onChange={(v) => update({ mode: v })} items={MODES.map((m) => ({ value: m.id, label: m.name }))} /></Row>
              <Row label="حجم الخط"><Segmented value={prefs.font} onChange={(v) => update({ font: v })} items={FONT_SIZES.map((f) => ({ value: f.id, label: f.name }))} /></Row>
              <Row label="الكثافة"><Segmented value={prefs.density} onChange={(v) => update({ density: v })} items={DENSITIES.map((d) => ({ value: d.id, label: d.name }))} /></Row>
              <Row label="رمز العملة"><Segmented value={prefs.currency === 'riyal-text' ? 'riyal-text' : 'auto'} onChange={(v) => { update({ currency: v }); setCurrency(v) }} items={[{ value: 'auto', label: 'الرمز الرسمي' }, { value: 'riyal-text', label: 'ر.س نصًّا' }]} /></Row>
              <Row label="التقويم"><Segmented value={prefs.calendar || 'greg'} onChange={(v) => update({ calendar: v })} items={[{ value: 'greg', label: 'ميلادي' }, { value: 'hijri', label: 'هجري' }]} /></Row>
            </div>
          </Card>
        </div>
      )}

      {tab === 'company' && (
        <Card>
          <div className="card-title" style={{ marginBottom: 14 }}>بيانات الشركة</div>
          <div className="row"><Field label="اسم الشركة" value={cfg.companyName} onChange={(v) => set('companyName', v)} /><Field label="الوصف" value={cfg.tagline} onChange={(v) => set('tagline', v)} /></div>
          <div className="row"><Field label="السجل التجاري" value={cfg.commercialRegister} onChange={(v) => set('commercialRegister', v)} /><Field label="الرقم الضريبي" value={cfg.taxNumber} onChange={(v) => set('taxNumber', v)} /></div>
          <div className="row"><Field label="هاتف التواصل" value={cfg.companyPhone} onChange={(v) => set('companyPhone', v)} /></div>
          <div className="row"><Field label="العنوان" value={cfg.companyAddress} onChange={(v) => set('companyAddress', v)} /></div>
          <div className="row" style={{ alignItems: 'center', gap: 16, marginTop: 8 }}>
            <div style={{ width: 72, height: 72, border: '1px dashed var(--line)', borderRadius: 12, display: 'grid', placeItems: 'center' }}>{(cfg.companyLogo || cfg.logoUrl) ? <img src={cfg.companyLogo || cfg.logoUrl} alt="" style={{ maxWidth: 64, maxHeight: 64 }} /> : <Logo size={48} />}</div>
            <div>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>رفع شعار<input type="file" accept="image/*" hidden onChange={(e) => uploadLogo(e.target.files?.[0])} /></label>
              {(cfg.companyLogo || cfg.logoUrl) && <button className="btn btn-ghost btn-sm" onClick={() => saveSection({ companyLogo: '', logoUrl: '' })}>إزالة</button>}
              <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>يظهر في الطباعة. عند غيابه يُستخدم شعار التطبيق.</div>
            </div>
          </div>
          <Button style={{ marginTop: 14 }} onClick={() => saveSection({ companyName: cfg.companyName, tagline: cfg.tagline, commercialRegister: cfg.commercialRegister, taxNumber: cfg.taxNumber, companyPhone: cfg.companyPhone, companyAddress: cfg.companyAddress || '' })} disabled={busy}>حفظ</Button>
        </Card>
      )}

      {tab === 'finance' && (
        <Card>
          <div className="card-title" style={{ marginBottom: 14 }}>المالية والإقفال</div>
          <div style={{ display: 'grid', gap: 14 }}>
            <Row label="نمط احتساب الراتب"><Segmented value={cfg.salaryMode || 'display'} onChange={(v) => set('salaryMode', v)} items={[{ value: 'post', label: 'قيد راتب تلقائي' }, { value: 'display', label: 'عرض الصافي فقط' }]} /></Row>
            <div className="row">
              <Field type="number" label="الحد الأقصى الافتراضي للسلفة" value={cfg.advanceMaxDefault} onChange={(v) => set('advanceMaxDefault', v)} />
              <Field type="number" label="حدّ الاعتماد (يتطلب موافقة فوقه)" value={cfg.approvalThreshold} onChange={(v) => set('approvalThreshold', v)} />
            </div>
            <div className="row">
              <Field type="number" label="بداية ترقيم السندات" value={cfg.sanadStart} onChange={(v) => set('sanadStart', v)} />
              <Field label="بادئة السند" value={cfg.sanadPrefix} onChange={(v) => set('sanadPrefix', v)} />
            </div>
            <Toggle label="نظام الاعتماد (Maker-Checker)" value={!!cfg.approvalEnabled} onChange={(v) => set('approvalEnabled', v)} />
            <Toggle label="القفل التسلسلي للفترات" value={!!cfg.sequentialLock} onChange={(v) => set('sequentialLock', v)} />
          </div>
          <Button style={{ marginTop: 14 }} onClick={() => saveSection({ salaryMode: cfg.salaryMode, advanceMaxDefault: Number(cfg.advanceMaxDefault) || 0, approvalThreshold: Number(cfg.approvalThreshold) || 0, sanadStart: Number(cfg.sanadStart) || 0, sanadPrefix: cfg.sanadPrefix || '', approvalEnabled: !!cfg.approvalEnabled, sequentialLock: !!cfg.sequentialLock })} disabled={busy}>حفظ</Button>
        </Card>
      )}

      {tab === 'security' && (
        <Card>
          <div className="card-title" style={{ marginBottom: 14 }}>الأمان والجلسة</div>
          <div className="row">
            <Field type="number" label="مهلة الخمول (دقيقة، 0=معطّل)" value={cfg.idleTimeoutMinutes ?? 20} onChange={(v) => set('idleTimeoutMinutes', v)} />
            <Field type="number" label="عدّاد التحذير (ثانية)" value={cfg.idleWarningSeconds ?? 30} onChange={(v) => set('idleWarningSeconds', v)} />
          </div>
          <div className="row">
            <Field type="number" label="انتهاء كلمة المرور (يوم)" value={cfg.passwordExpiryDays ?? 90} onChange={(v) => set('passwordExpiryDays', v)} />
            <Field type="number" label="أدنى طول لكلمة المرور" value={cfg.passwordMinLength ?? 6} onChange={(v) => set('passwordMinLength', v)} />
          </div>
          <Button style={{ marginTop: 6 }} onClick={() => saveSection({ idleTimeoutMinutes: Number(cfg.idleTimeoutMinutes) || 0, idleWarningSeconds: Number(cfg.idleWarningSeconds) || 30, passwordExpiryDays: Number(cfg.passwordExpiryDays) || 90, passwordMinLength: Math.max(6, Number(cfg.passwordMinLength) || 6) })} disabled={busy}>حفظ</Button>
        </Card>
      )}

      {tab === 'backup' && (
        <Card>
          <div className="card-title" style={{ marginBottom: 8 }}>النسخ الاحتياطي</div>
          <p className="muted" style={{ fontSize: 13, marginBottom: 14 }}>
            آخر نسخة: <b>{backupStat?.lastBackupAt ? formatDateTime(backupStat.lastBackupAt) : 'لا يوجد'}</b>
            {backupStat?.source && <> · المصدر: {backupStat.source === 'daily' ? 'تلقائية يومية' : 'يدوية'}</>}
          </p>
          <div className="row" style={{ gap: 8 }}>
            <Button icon="download" onClick={async () => { setBusy(true); try { await downloadBackup(); toast.ok('نُزّلت النسخة'); setBackupStat(await getBackupStat().catch(() => null)) } catch { toast.error('تعذّر') } finally { setBusy(false) } }} disabled={busy}>نسخة الآن (تنزيل)</Button>
          </div>
          <div className="mt muted" style={{ fontSize: 13 }}>النسخة اليومية التلقائية تُرفع إلى Dropbox عبر GitHub Actions (مضبوطة مسبقًا).</div>
        </Card>
      )}

      {tab === 'general' && (
        <div style={{ display: 'grid', gap: 14 }}>
          <Card>
            <div className="card-title" style={{ marginBottom: 12 }}>وضع الصيانة</div>
            <Toggle label="تفعيل وضع الصيانة (يمنع غير المالك من الدخول)" value={!!cfg.maintenanceMode} onChange={(v) => saveSection({ maintenanceMode: v })} />
          </Card>
          <Card>
            <div className="card-title" style={{ marginBottom: 6 }}>الوسوم / التصنيفات</div>
            <div className="card-sub" style={{ marginBottom: 10 }}>وسوم تُستخدم لتصنيف الموظفين والحركات (مفصولة بفاصلة).</div>
            <Field value={(cfg.tags || []).join('، ')} onChange={(v) => set('tags', v.split(/[،,]/).map((s) => s.trim()).filter(Boolean))} placeholder="سلفة، مكافأة، خصم…" />
            <Button size="sm" onClick={() => saveSection({ tags: cfg.tags || [] })} disabled={busy}>حفظ الوسوم</Button>
          </Card>
          <Card>
            <div className="card-title" style={{ marginBottom: 6 }}>تنبيه الأرصدة</div>
            <Field type="number" label="تنبيه عند تجاوز الرصيد (0=إيقاف)" value={cfg.balanceAlertThreshold} onChange={(v) => set('balanceAlertThreshold', v)} />
            <Button size="sm" onClick={() => saveSection({ balanceAlertThreshold: Number(cfg.balanceAlertThreshold) || 0 })} disabled={busy}>حفظ</Button>
          </Card>
          <Card>
            <div className="card-title" style={{ marginBottom: 10 }}>تصدير/استيراد الإعدادات</div>
            <div className="row" style={{ gap: 8 }}>
              <Button variant="secondary" size="sm" icon="download" onClick={exportSettings}>تصدير</Button>
              <label className="btn btn-secondary btn-sm" style={{ cursor: 'pointer' }}>استيراد<input type="file" accept="application/json" hidden onChange={(e) => importSettings(e.target.files?.[0])} /></label>
            </div>
            <div className="mt muted" style={{ fontSize: 13 }}>تغييرات الإعدادات تُسجَّل في <b>سجل التدقيق</b>.</div>
          </Card>
        </div>
      )}
    </div>
  )
}

function Row({ label, children }) {
  return <div><div className="muted" style={{ fontSize: '0.8em', fontWeight: 800, marginBottom: 6 }}>{label}</div>{children}</div>
}
function Field({ label, value, onChange, type = 'text', placeholder }) {
  return <div className="field" style={{ flex: 1 }}>{label && <label>{label}</label>}<input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} /></div>
}
function Toggle({ label, value, onChange }) {
  return (
    <button type="button" className="row" style={{ background: 'none', border: 'none', gap: 10, cursor: 'pointer', padding: 0 }} onClick={() => onChange(!value)}>
      <span style={{ width: 42, height: 24, borderRadius: 999, background: value ? 'var(--brand)' : 'var(--line)', position: 'relative', flex: 'none', transition: '.2s' }}>
        <span style={{ position: 'absolute', top: 2, insetInlineStart: value ? 20 : 2, width: 20, height: 20, borderRadius: '50%', background: '#fff', transition: '.2s' }} />
      </span>
      <span style={{ fontSize: '0.9em' }}>{label}</span>
    </button>
  )
}
