import { Menu } from 'lucide-react'
import { useState } from 'react'
import type { ReactNode } from 'react'
import { Offcanvas } from 'react-bootstrap'
import { Link, NavLink, Navigate, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { homePathFor, useAuth } from '../../store/auth'
import type { Role } from '../../types'
import { confirmAction } from '../../utils/dialogs'
import Logo from '../Logo/Logo'
import './AppLayout.css'

export function RootRedirect() {
  const token = useAuth((s) => s.token)
  const user = useAuth((s) => s.user)
  return <Navigate to={token && user ? homePathFor(user) : '/login'} replace />
}

export function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const token = useAuth((s) => s.token)
  const user = useAuth((s) => s.user)
  const location = useLocation()

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (user.role !== role) {
    return <Navigate to={homePathFor(user)} replace />
  }
  return <>{children}</>
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const token = useAuth((s) => s.token)
  const user = useAuth((s) => s.user)
  if (token && user) {
    return <Navigate to={homePathFor(user)} replace />
  }
  return <>{children}</>
}

export interface NavItem {
  to: string
  label: string
  icon: string
  end?: boolean
}

interface Props {
  items: NavItem[]
  section: string
  note: string
  home: string
}

function Sidebar({ items, section, note, home, onNavigate }: Props & { onNavigate?: () => void }) {
  return (
    <nav className="sidebar" aria-label="Main">
      <Link to={home} className="sidebar-brand" onClick={onNavigate}>
        <Logo size={38} />
        <span>
          <span className="name">Tabunok DRRM</span>
          <span className="sub">Talisay City, Cebu</span>
        </span>
      </Link>
      <div className="sidebar-section">{section}</div>
      {items.map(({ to, label, icon, end }) => (
        <NavLink key={to} to={to} end={end} className="side-link" onClick={onNavigate}>
          <span className="ico" aria-hidden="true">
            {icon}
          </span>
          {label}
        </NavLink>
      ))}
      <div className="sidebar-foot">
        {note}
        <br />
        In a real emergency, follow official barangay channels.
      </div>
    </nav>
  )
}

export default function AppLayout(props: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const user = useAuth((s) => s.user)
  const signOut = useAuth((s) => s.signOut)
  const navigate = useNavigate()

  const logout = async () => {
    const ok = await confirmAction({ title: 'Log out?', text: 'You will need to sign in again to continue.', confirmText: 'Logout' })
    if (!ok) return
    signOut()
    navigate('/login', { replace: true })
  }

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <div className="shell">
        <aside className="sidebar-rail">
          <Sidebar {...props} />
        </aside>
        <Offcanvas show={menuOpen} onHide={() => setMenuOpen(false)} className="sidebar-offcanvas">
          <Sidebar {...props} onNavigate={() => setMenuOpen(false)} />
        </Offcanvas>
        <div className="main">
          <header className="topbar">
            <button type="button" className="menu-btn" onClick={() => setMenuOpen(true)} aria-label="Open menu">
              <Menu size={18} />
            </button>
            <span className="sep" aria-hidden="true" />
            <span className="who">
              {user?.fullName} <span aria-hidden="true">👤</span>
            </span>
            <button type="button" className="btn btn-outline-primary btn-sm logout" onClick={logout}>
              Logout
            </button>
          </header>
          <main id="main" className="content">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  )
}
