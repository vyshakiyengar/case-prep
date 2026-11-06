import { useEffect } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Avatar, Logo } from './ui'

type Item = { to: string; label: string; icon: string }
export const LEARN: Item[] = [
  { to: '/learn', label: 'Course', icon: 'M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 6v13' },
  { to: '/perfect-casing', label: 'Perfect casing', icon: 'M4 17l4-4 3 3 6-7 3 3M4 20h16' },
  { to: '/frameworks', label: 'Frameworks', icon: 'M12 4v5M5 9h14M5 9v4M12 9v4M19 9v4M3 13h4v6H3zM10 13h4v6h-4zM17 13h4v6h-4z' },
  { to: '/casebook', label: 'Casebook', icon: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM17 7h2v13' },
  { to: '/drills', label: 'Drills', icon: 'M12 7v5l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 2h4' },
]
export const PREP: Item[] = [
  { to: '/today', label: 'Dashboard', icon: 'M4 12h4l2-6 4 12 2-6h4' },
  { to: '/tracker', label: 'Tracker', icon: 'M4 5h16v14H4zM4 10h16M9 5v14' },
  { to: '/cases', label: 'Case log', icon: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h3' },
  { to: '/stories', label: 'FIT stories', icon: 'M5 5h14v10H9l-4 4zM9 9h6M9 12h4' },
  { to: '/partners', label: 'Partners', icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5' },
  { to: '/perks', label: 'Student perks', icon: 'M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c0 1.5 2.5 3 5 3s5-1.5 5-3v-4.5M21 9v6' },
]

function Icon({ d }: { d: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
}

function NavGroup({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className="mt-6">
      <div className="px-3 pb-1 text-[12.5px] font-medium text-faint">{title}</div>
      {items.map((n) => (
        <NavLink key={n.to} to={n.to}
          className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2 text-[14.5px] font-medium ${isActive ? 'bg-canvas text-ink' : 'text-muted hover:bg-canvas hover:text-ink'}`}>
          <Icon d={n.icon} />{n.label}
        </NavLink>
      ))}
    </div>
  )
}

export function SignInLink({ className = '' }: { className?: string }) {
  const loc = useLocation()
  return <Link to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} className={`rounded-lg bg-ink px-3.5 py-2 text-[14px] font-medium text-white hover:bg-[#22325A] ${className}`}>Sign in</Link>
}

export default function AppShell() {
  const { user, data, error, setError } = useStore()
  const loc = useLocation()
  useEffect(() => { if (!loc.hash) window.scrollTo(0, 0) }, [loc.pathname, loc.hash])
  const name = data?.profile?.name || user?.name || ''
  return (
    <div className="min-h-screen lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col overflow-y-auto border-r border-line bg-white px-4 py-5 lg:flex">
        <Link to={user ? '/today' : '/'} className="px-2"><Logo /></Link>
        <nav aria-label="Main" className="mt-2">
          <NavGroup title="Learn and practise" items={LEARN} />
          <NavGroup title="My prep" items={PREP} />
        </nav>
        <div className="mt-auto pt-6">
          {user ? (
            <NavLink to="/settings" className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-canvas">
              <Avatar name={name} photo={user.photoURL} />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium text-ink">{name}</span>
                <span className="block text-[12.5px] text-muted">Settings</span>
              </span>
            </NavLink>
          ) : (
            <div className="rounded-lg bg-canvas p-3">
              <p className="text-[13px] text-muted">Sign in to track your progress, log cases and practise with a partner.</p>
              <SignInLink className="mt-2 inline-block" />
            </div>
          )}
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to={user ? '/today' : '/'}><Logo /></Link>
        {user ? <NavLink to="/settings" aria-label="Settings"><Avatar name={name} photo={user.photoURL} /></NavLink> : <SignInLink />}
      </header>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 border-b border-signal bg-signal-l px-4 py-2 text-[14px] text-signal-d lg:px-10">
          {error}<button onClick={() => setError(null)} className="font-medium underline">Dismiss</button>
        </div>
      )}

      <main className="mx-auto max-w-6xl px-4 pt-6 pb-28 sm:px-6 lg:px-10 lg:pt-10 lg:pb-16"><Outlet /></main>

      <nav aria-label="Main" className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-5 border-t border-line bg-white lg:hidden">
        {[...LEARN.filter((n) => n.to !== '/frameworks'), user ? PREP[0] : { to: '/signin', label: 'Sign in', icon: 'M15 3h4v18h-4M10 17l5-5-5-5M15 12H3' }].map((n) => (
          <NavLink key={n.to} to={n.to}
            className={({ isActive }) => `flex flex-col items-center gap-0.5 py-2 text-[10.5px] font-medium ${isActive ? 'text-ink' : 'text-faint'}`}>
            <Icon d={n.icon} /><span className="truncate">{n.label}</span>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}
