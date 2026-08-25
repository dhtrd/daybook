import { useState } from 'react'
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth'
import { auth } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { usePrefs } from '../context/PrefsContext'
import { useLock } from '../context/LockContext'
import { Link } from 'react-router-dom'
import Modal from '../components/Modal'
import { markPasswordChanged, updateOwnName } from '../lib/db'
import {
  hasPin, hasBiometric, setPin as savePin, clearPin,
  biometricSupported, registerBiometric, clearBiometric,
} from '../lib/deviceLock'

const ROLE_LABEL = { owner: 'المالك', accountant: 'محاسب أول', data_entry: 'مدخل بيانات', auditor: 'مدقق مالي', limited_viewer: 'مشاهد محدود' }

// تنزيل بيانات المستخدم الشخصية (ملفه ودوره وصلاحياته) كملف JSON
function downloadMyData(user) {
  const data = {
    generatedAt: new Date().toISOString(),
    profile: { name: user?.name, email: user?.email, role: user?.role, status: user?.status },
    effectivePermissions: user?.effectivePermissions || [],
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'my-data.json'; a.click()
}

function Seg({ value, options, onChange }) {
  return (
    <div style={{ display: 'inline-flex', gap: 6, background: '#eef1f4', padding: 4, borderRadius: 12 }}>
      {options.map((o) => (
        <button key={o.v} onClick={() => onChange(o.v)}
          className="btn btn-sm" style={{
            border: 'none', background: value === o.v ? 'var(--brand)' : 'transparent',
            color: value === o.v ? '#fff' : 'var(--text)', minWidth: 64,
          }}>{o.label}</button>
      ))}
    </div>
  )
}

export default function Account() {
  const { user, firebaseUser, logout } = useAuth()
  const { prefs, update } = usePrefs()
  const { lockNow } = useLock()
  const uid = firebaseUser?.uid
  const [modal, setModal] = useState(null)
  const [, force] = useState(0)
  const refresh = () => force((n) => n + 1)

  return (
    <div style={{ maxWidth: 640 }}>
      {/* بطاقة المستخدم */}
      <div className="card card-pad mb" style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <label style={{ cursor: 'pointer' }} title="تغيير الصورة الرمزية">
          {prefs.avatar
            ? <img src={prefs.avatar} alt="" style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover' }} />
            : <div style={{ width: 54, height: 54, borderRadius: '50%', background: 'var(--brand-light)', color: 'var(--brand)', display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 800 }}>{(user?.name || '؟').trim().charAt(0)}</div>}
          <input type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files?.[0]; if (!file) return
            if (file.size > 200000) { alert('اختر صورة أصغر من 200KB'); return }
            const r = new FileReader(); r.onload = () => update({ avatar: r.result }); r.readAsDataURL(file)
          }} />
        </label>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 18 }}>{user?.name}</div>
          <div className="muted" style={{ fontSize: 13 }} dir="ltr">{user?.email} · {ROLE_LABEL[user?.role] || user?.role}</div>
        </div>
        <div className="row" style={{ gap: 6 }}>
          <button className="btn btn-sm" onClick={() => downloadMyData(user)}>تنزيل بياناتي</button>
          <button className="btn btn-sm" onClick={() => setModal('name')}>تعديل الاسم</button>
        </div>
      </div>

      {/* المظهر */}
      <div className="card card-pad mb">
        <FieldRow label="المظهر">
          <Seg value={prefs.theme} onChange={(v) => update({ theme: v })}
            options={[{ v: 'light', label: '☀️ نهاري' }, { v: 'dark', label: '🌙 ليلي' }]} />
        </FieldRow>
        <FieldRow label="حجم الخط">
          <Seg value={prefs.fontSize} onChange={(v) => update({ fontSize: v })}
            options={[{ v: 'normal', label: 'عادي' }, { v: 'large', label: 'كبير' }, { v: 'xlarge', label: 'أكبر' }]} />
        </FieldRow>
        <FieldRow label="التباين">
          <Seg value={prefs.contrast} onChange={(v) => update({ contrast: v })}
            options={[{ v: 'normal', label: 'عادي' }, { v: 'high', label: 'عالٍ' }]} />
        </FieldRow>
        <FieldRow label="الصفحة الافتراضية عند الدخول">
          <select value={prefs.defaultPage || '/'} onChange={(e) => update({ defaultPage: e.target.value })} style={{ maxWidth: 200 }}>
            <option value="/">لوحة التحكم</option>
            <option value="/employees">الموظفون</option>
            <option value="/transactions">الحركات</option>
            <option value="/reports">التقارير</option>
          </select>
        </FieldRow>
        <div className="muted" style={{ fontSize: 13, marginTop: 8 }}>✓ تفضيلاتك تُحفظ في حسابك وتتبعك على كل أجهزتك.</div>
      </div>

      {/* كلمة المرور */}
      <div className="card card-pad mb" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <strong>🔑 تغيير كلمة المرور</strong>
        <button className="btn" onClick={() => setModal('pw')}>تغيير</button>
      </div>

      {/* الأمان والدخول السريع */}
      <div className="card card-pad">
        <h3 className="card-title mb">🔐 الأمان والدخول السريع (هذا الجهاز)</h3>

        <div className="card" style={{ padding: 14, marginBottom: 12, background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>🔢 قفل الجهاز السريع (رمز)</div>
              <div className="muted" style={{ fontSize: 13 }}>اقفل الشاشة برمز من 4 أرقام دون تسجيل خروج — مناسب للأجهزة المشتركة.</div>
            </div>
            <span className={`badge ${hasPin(uid) ? 'badge-ok' : 'badge-muted'}`}>{hasPin(uid) ? 'مُفعّل ✓' : 'غير مُفعّل'}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {hasPin(uid) ? <>
              <button className="btn btn-primary btn-sm" onClick={lockNow}>🔒 اقفل الآن</button>
              <button className="btn btn-sm" onClick={() => setModal('pin')}>تغيير الرمز</button>
              <button className="btn btn-danger btn-sm" onClick={() => { clearPin(uid); refresh() }}>إلغاء</button>
            </> : <button className="btn btn-primary btn-sm" onClick={() => setModal('pin')}>+ تعيين رمز</button>}
          </div>
        </div>

        <div className="card" style={{ padding: 14, background: '#f8fafc' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 700 }}>👆 الدخول السريع (بصمة / Face ID)</div>
              <div className="muted" style={{ fontSize: 13 }}>افتح القفل بالبصمة أو الوجه بدل كتابة الرمز/كلمة المرور.</div>
            </div>
            <span className={`badge ${hasBiometric(uid) ? 'badge-ok' : 'badge-muted'}`}>{hasBiometric(uid) ? 'مُفعّل ✓' : 'غير مُفعّل'}</span>
          </div>
          <div style={{ marginTop: 10 }}>
            {!biometricSupported() ? <span className="muted" style={{ fontSize: 13 }}>هذا الجهاز/المتصفح لا يدعم البصمة.</span>
              : hasBiometric(uid)
                ? <button className="btn btn-danger btn-sm" onClick={() => { clearBiometric(uid); refresh() }}>إلغاء البصمة</button>
                : <button className="btn btn-primary btn-sm" onClick={async () => {
                    try { await registerBiometric(uid, user?.name); refresh() }
                    catch (e) { alert(e.message) }
                  }}>+ تفعيل البصمة / الوجه</button>}
          </div>
        </div>

        <div className="muted" style={{ fontSize: 12, marginTop: 12 }}>
          🔒 رمز القفل والبصمة محفوظان على هذا الجهاز فقط ولا يُزامنان على كل جهاز تستخدمه.
        </div>
      </div>

      {modal === 'pw' && <PasswordModal onClose={() => setModal(null)} />}
      {modal === 'pin' && <PinModal uid={uid} onClose={() => setModal(null)} onDone={() => { setModal(null); refresh() }} />}
      {modal === 'name' && <NameModal uid={uid} current={user?.name} onClose={() => setModal(null)} />}
    </div>
  )
}

function FieldRow({ label, children }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
      <span style={{ fontWeight: 700 }}>{label}</span>
      {children}
    </div>
  )
}

function NameModal({ uid, current, onClose }) {
  const [name, setName] = useState(current || '')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const go = async () => {
    if (!name.trim()) { setErr('الاسم مطلوب'); return }
    setBusy(true)
    try { await updateOwnName(uid, name); window.location.reload() } catch (e) { setErr('تعذّر الحفظ: ' + e.message); setBusy(false) }
  }
  return (
    <Modal title="تعديل الاسم" onClose={onClose} footer={<><button className="btn btn-primary" onClick={go} disabled={busy}>حفظ</button><button className="btn" onClick={onClose}>إلغاء</button></>}>
      {err && <div className="error-box">{err}</div>}
      <div className="field"><label>الاسم</label><input value={name} onChange={(e) => setName(e.target.value)} autoFocus /></div>
    </Modal>
  )
}

function PinModal({ uid, onClose, onDone }) {
  const [pin, setPin] = useState('')
  const [pin2, setPin2] = useState('')
  const [err, setErr] = useState('')
  const go = async () => {
    if (!/^\d{4}$/.test(pin)) { setErr('الرمز يجب أن يكون 4 أرقام'); return }
    if (pin !== pin2) { setErr('الرمزان غير متطابقين'); return }
    await savePin(uid, pin); onDone()
  }
  return (
    <Modal title="تعيين رمز القفل" onClose={onClose}
      footer={<><button className="btn btn-primary" onClick={go}>حفظ</button><button className="btn" onClick={onClose}>إلغاء</button></>}>
      {err && <div className="error-box">{err}</div>}
      <div className="field"><label>رمز جديد (4 أرقام)</label>
        <input type="password" inputMode="numeric" maxLength={4} value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} style={{ textAlign: 'center', letterSpacing: 10, fontSize: 22 }} autoFocus /></div>
      <div className="field"><label>تأكيد الرمز</label>
        <input type="password" inputMode="numeric" maxLength={4} value={pin2} onChange={(e) => setPin2(e.target.value.replace(/\D/g, ''))} style={{ textAlign: 'center', letterSpacing: 10, fontSize: 22 }} /></div>
    </Modal>
  )
}

function PasswordModal({ onClose }) {
  const { config } = useAuth()
  const minLen = Math.max(6, Number(config?.passwordMinLength) || 6)
  const [cur, setCur] = useState('')
  const [nw, setNw] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [ok, setOk] = useState(false)
  const go = async () => {
    setErr('')
    if (nw.length < minLen) { setErr(`كلمة المرور الجديدة ${minLen} أحرف على الأقل`); return }
    setBusy(true)
    try {
      const cred = EmailAuthProvider.credential(auth.currentUser.email, cur)
      await reauthenticateWithCredential(auth.currentUser, cred)
      await updatePassword(auth.currentUser, nw)
      try { await markPasswordChanged(auth.currentUser.uid) } catch { /* ignore */ }
      setOk(true); setTimeout(onClose, 1200)
    } catch (e) {
      setErr(e.code === 'auth/wrong-password' || e.code === 'auth/invalid-credential' ? 'كلمة المرور الحالية غير صحيحة' : 'تعذّر التغيير: ' + e.message)
      setBusy(false)
    }
  }
  return (
    <Modal title="تغيير كلمة المرور" onClose={onClose}
      footer={<><button className="btn btn-primary" onClick={go} disabled={busy || ok}>{ok ? 'تم ✓' : 'حفظ'}</button><button className="btn" onClick={onClose}>إلغاء</button></>}>
      {err && <div className="error-box">{err}</div>}
      {ok && <div className="badge badge-ok" style={{ marginBottom: 10 }}>تم تغيير كلمة المرور ✓</div>}
      <div className="field"><label>كلمة المرور الحالية</label><input type="password" value={cur} onChange={(e) => setCur(e.target.value)} autoFocus /></div>
      <div className="field"><label>كلمة المرور الجديدة</label><input type="password" value={nw} onChange={(e) => setNw(e.target.value)} /></div>
    </Modal>
  )
}
