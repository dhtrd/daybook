import { useState } from 'react'
import { updatePassword } from 'firebase/auth'
import { auth, COMPANY_NAME } from '../firebase'
import { useAuth } from '../context/AuthContext'
import { markPasswordChanged } from '../lib/db'

// إجبار المستخدم الجديد على تعيين كلمة مروره الخاصة عند أول دخول.
export default function ForceSetPassword() {
  const { firebaseUser, logout, config } = useAuth()
  const minLen = Math.max(6, Number(config?.passwordMinLength) || 6)
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')

  const go = async () => {
    setErr('')
    if (pw.length < minLen) { setErr(`كلمة المرور ${minLen} أحرف على الأقل`); return }
    if (pw !== pw2) { setErr('الكلمتان غير متطابقتين'); return }
    setBusy(true)
    try {
      await updatePassword(auth.currentUser, pw)
      await markPasswordChanged(firebaseUser.uid)
      window.location.reload()
    } catch (e) {
      setErr(e.code === 'auth/requires-recent-login'
        ? 'لأسباب أمنية، سجّل الخروج وادخل مجددًا ثم عيّن كلمة المرور.'
        : 'تعذّر الحفظ: ' + e.message)
      setBusy(false)
    }
  }

  return (
    <div className="login-wrap">
      <div className="login-card">
        <h2>{COMPANY_NAME}</h2>
        <p className="sub">أول دخول — عيّن كلمة مرورك الخاصة</p>
        <div className="error-box" style={{ background: 'var(--warn-light)', color: 'var(--warn)' }}>
          لأمانك، يجب تعيين كلمة مرور خاصة بك قبل استخدام النظام.
        </div>
        {err && <div className="error-box">{err}</div>}
        <div className="field"><label>كلمة المرور الجديدة</label>
          <input type="password" value={pw} onChange={(e) => setPw(e.target.value)} autoFocus /></div>
        <div className="field"><label>تأكيد كلمة المرور</label>
          <input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} /></div>
        <button className="btn btn-primary" style={{ width: '100%' }} onClick={go} disabled={busy}>
          {busy ? 'جارٍ الحفظ…' : 'حفظ والمتابعة'}
        </button>
        <button className="btn btn-ghost" style={{ width: '100%', marginTop: 8 }} onClick={logout}>تسجيل الخروج</button>
      </div>
    </div>
  )
}
