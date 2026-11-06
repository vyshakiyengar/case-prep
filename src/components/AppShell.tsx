import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Avatar, Logo } from './ui'
import { useEffect } from 'react'

const NAV = [
  { to: '/today', label: 'Today', icon: 'M4 12h4l2-6 4 12 2-6h4' },
  { to: '/tracker', label: 'Tracker', icon: 'M4 5h16v14H4zM4 10h16M9 5v14' },
  { to: '/cases', label: 'Case log', icon: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h3' },
  { to: '/casebook', label: 'Casebook', icon: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM17 7h2v13' },
  { to: '/drills', label: 'Drills', icon: 'M12 7v5l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 2h4' },
  { to: '/partners', label: 'Partners', icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5' },
  { to: '/playbook', label: 'Playbook', icon: 'M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 6v13' },
  { to: '/perks', label: 'Student perks', icon: 'M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c0 1.5 2.5 3 5 3s5-1.5 5-3v-4.5M21 9v6' },
]
const MOBILE = ['/today', '/tracker', '/cases', '/casebook', '/drills']

function Icon({ d }: { d: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
}

export default function AppShell() {
  const { user, data, backend, error, setError } = useStore()
  const loc = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [loc.pathname])
  const name = data?.profile?.name || user?.name || ''
  return (
    <div className="min-h-screen lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-line bg-white px-4 py-5 lg:flex">
        <NavLink to="/today" className="px-2"><Logo /></NavLink>
        <nav className="mt-8 flex flex-col gap-0.5" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to}
              className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-[14.5px] font-medium ${isActive ? 'bg-canvas text-ink' : 'text-muted hover:bg-canvas hover:text-ink'}`}>
              <Icon d={n.icon} />{n.label}
            </NavLink>
          ))}
        </nav>
        <NavLink to="/settings" className="mt-auto flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-canvas">
          <Avatar name={name} photo={user?.photoURL} />
          <span className="min-w-0">
            <span className="block truncate text-[14px] font-medium text-ink">{name}</span>
            <span className="block text-[12.5px] text-muted">Settings</span>
          </span>
        </NavLink>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <NavLink to="/today"><Logo /></NavLink>
        <NavLink to="/settings" aria-label="Settings"><Avatar name={name} photo={user?.photoURL} /></NavLink>
      </header>

      {backend?.mode === 'demo' && (
        <div className="border-b border-marker bg-marker-l px-4 py-2 text-[13.5px] text-ink lg:px-10">
          Demo mode: your data stays in this browser. Add your Firebase keys (see the README) to switch on Google sign-in and cloud sync.
        </div>
      )}
      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 border-b border-signal bg-signal-l px-4 py-2 text-[14px] text-signal-d lg:px-10">
          {error}<button onClick={() => setError(null)} className="font-medium underline">Dismiss</button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16"><Outlet /></main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-6 border-t border-line bg-white lg:hidden">
        {[...NAV.filter((n) => MOBILE.includes(n.to)), { to: '/settings', label: 'More', icon: 'M5 12h.01M12 12h.01M19 12h.01' }].map((n) => (
          <NavLink key={n.to} to={n.to}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium ${isActive ? 'text-ink' : 'text-faint'}`}>
            <Icon d={n.icon} /><span className="truncate">{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
