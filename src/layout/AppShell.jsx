import { useState, useEffect, useCallback } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import Icon from '../components/ui/Icon'
import Logo from '../lib/Logo'
import Avatar from '../components/ui/Avatar'
import { Menu } from '../components/ui/Menu'
import CommandPalette from '../components/ui/CommandPalette'
import NotificationsPopup from './NotificationsPopup'
import { useAuth } from '../context/AuthContext'
import { buildNotifications } from '../lib/notifications'
import './layout.css'

const NAV = [
  { to: '/', icon: 'dashboard', label: 'لوحة التحكم', end: true, perm: 'view_reports' },
  { to: '/employees', icon: 'users', label: 'الموظفون', perm: 'view_employees' },
  { to: '/transactions', icon: 'money', label: 'الحركات', perm: 'view_transactions' },
  { to: '/reports', icon: 'chart', label: 'التقارير', perm: 'view_reports' },
  { to: '/periods', icon: 'clock', label: 'إقفال الفترات', perm: 'lock_period' },
  { to: '/audit', icon: 'shield', label: 'سجل التدقيق', perm: 'view_audit_log' },
  { to: '/trash', icon: 'trash', label: 'سلة المحذوفات', perm: 'delete_transaction' },
  { to: '/users', icon: 'user', label: 'المستخدمون', perm: 'manage_users' },
  { to: '/settings', icon: 'gear', label: 'الإعدادات', perm: 'manage_settings' },
]

const TITLES = {
  '/': 'لوحة التحكم', '/employees': 'الموظفون', '/transactions': 'الحركات', '/transactions/new': 'حركة جديدة',
  '/reports': 'التقارير', '/periods': 'إقفال الفترات', '/audit': 'سجل التدقيق', '/users': 'المستخدمون',
  '/settings': 'الإعدادات', '/account': 'حسابي', '/notifications': 'الإشعارات', '/search': 'البحث',
  '/trash': 'سلة المحذوفات', '/guide': 'دليل الاستخدام',
}

export default function AppShell({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, can } = useAuth()
  const [drawer, setDrawer] = useState(false)
  const [cmdOpen, setCmdOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [notifs, setNotifs] = useState([])
  const [sq, setSq] = useState('')

  const loadNotifs = useCallback(async () => { try { setNotifs(await buildNotifications()) } catch { setNotifs([]) } }, [])
  useEffect(() => { loadNotifs() }, [loadNotifs])
  useEffect(() => { setDrawer(false); setNotifOpen(false) }, [location.pathname])

  useEffect(() => {
    const onKey = (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setCmdOpen(true) } }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const unread = notifs.length
  const title = TITLES[location.pathname] || 'الضبيبي'

  const submitSearch = (e) => {
    e.preventDefault()
    const q = sq.trim()
    if (q) { navigate('/search?q=' + encodeURIComponent(q)); setSq('') }
  }

  const commands = [
    { id: 'c1', group: 'التنقّل', icon: 'dashboard', label: 'لوحة التحكم', onRun: () => navigate('/') },
    { id: 'c2', group: 'التنقّل', icon: 'users', label: 'الموظفون', onRun: () => navigate('/employees') },
    { id: 'c3', group: 'إجراءات', icon: 'plus', label: 'إضافة حركة جديدة', onRun: () => navigate('/transactions/new') },
    { id: 'c4', group: 'إجراءات', icon: 'chart', label: 'فتح التقارير', onRun: () => navigate('/reports') },
    { id: 'c5', group: 'النظام', icon: 'shield', label: 'سجل التدقيق', onRun: () => navigate('/audit') },
    { id: 'c6', group: 'النظام', icon: 'gear', label: 'الإعدادات', onRun: () => navigate('/settings') },
  ]

  return (
    <div className="shell">
      {drawer && <div className="drawer-backdrop" onClick={() => setDrawer(false)} />}
      <aside className={`sidebar ${drawer ? 'open' : ''}`}>
        <div className="brand">
          <Logo size={36} />
          <div><div className="bn">الضبيبي التجارية</div><div className="bs">حسابات الموظفين خارج الكفالة</div></div>
        </div>
        <nav>
          {NAV.filter((n) => !n.perm || can(n.perm)).map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end} className={({ isActive }) => (isActive ? 'active' : '')}>
              <Icon name={n.icon} size={19} />{n.label}
            </NavLink>
          ))}
        </nav>
        <div className="foot">الإصدار ١٫٠ · {new Date().getFullYear()}</div>
      </aside>

      <div className="main-area">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setDrawer(true)} aria-label="القائمة"><Icon name="menu" size={20} /></button>
          {location.pathname !== '/' && (
            <button className="icon-btn" onClick={() => navigate(-1)} aria-label="رجوع" title="رجوع"><Icon name="chevronR" size={20} /></button>
          )}
          <h2 className="hide-mobile">{title}</h2>
          {can('view_transactions') && (
            <form className="tb-search" onSubmit={submitSearch}>
              <Icon name="search" size={16} />
              <input value={sq} onChange={(e) => setSq(e.target.value)} placeholder="بحث في الموظفين والحركات…"
                style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', color: 'var(--text)', fontFamily: 'inherit', minWidth: 0 }} />
            </form>
          )}
          <div className="sp" />
          <div style={{ position: 'relative' }}>
            <button className="icon-btn" onClick={() => setNotifOpen((o) => !o)} aria-label="الإشعارات">
              <Icon name="bell" size={19} />
              {unread > 0 && <span className="dot" />}
            </button>
            <NotificationsPopup open={notifOpen} onClose={() => setNotifOpen(false)} items={notifs} />
          </div>
          <Menu
            trigger={<button className="icon-btn" style={{ padding: 0, overflow: 'hidden' }} aria-label="حسابي"><Avatar name={user?.name} size={38} /></button>}
            items={[
              { type: 'group', label: user?.name },
              { icon: 'user', label: 'حسابي', onClick: () => navigate('/account') },
              { icon: 'doc', label: 'دليل الاستخدام', onClick: () => navigate('/guide') },
              { type: 'sep' },
              { icon: 'logout', label: 'تسجيل الخروج', danger: true, onClick: logout },
            ]}
          />
        </header>

        <main className="content">{children}</main>
        <footer className="page-foot">نظام حسابات الموظفين خارج الكفالة · شركة الضبيبي التجارية</footer>
      </div>

      <CommandPalette open={cmdOpen} onClose={() => setCmdOpen(false)} commands={commands} />
    </div>
  )
}
