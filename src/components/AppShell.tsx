import { PAGES } from '../lib/seo'
import { useCallback, useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom'
import { SignInWall } from './SignInWall'
import { useStore } from '../lib/store'
import { Avatar, Logo } from './ui'
import { useIsAdmin } from '../lib/admin'

type Item = { to: string; label: string; icon: string; end?: boolean }
export const HOME: Item = { to: '/home', label: 'Home', icon: 'M3 11l9-7 9 7M5 10v10h5v-6h4v6h5V10' }
export const ABOUT: Item = { to: '/about', label: 'About PrepForCase', icon: 'M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM12 11v5M12 8h.01' }
export const LEARN: Item[] = [
  { to: '/learn', label: 'Course', icon: 'M12 6c-2-1.5-5-2-8-1.5v13c3-.5 6 0 8 1.5 2-1.5 5-2 8-1.5v-13c-3-.5-6 0-8 1.5zM12 6v13' },
  { to: '/perfect-casing', label: 'Perfect casing', icon: 'M4 17l4-4 3 3 6-7 3 3M4 20h16' },
  { to: '/frameworks', label: 'Frameworks', icon: 'M12 4v5M5 9h14M5 9v4M12 9v4M19 9v4M3 13h4v6H3zM10 13h4v6h-4zM17 13h4v6h-4z' },
]
export const PRACTISE: Item[] = [
  { to: '/casebook', label: 'Casebook', icon: 'M5 4h9a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM17 7h2v13' },
  { to: '/interviewer', label: 'Interviewer mode', icon: 'M9 8a3 3 0 1 0 0-.01M3 20c0-3 3-5 6-5s6 2 6 5M17 7h4M17 11h4M19 15h2' },
  { to: '/interview-skills', label: 'Interview skills', icon: 'M8 8a4 4 0 0 1 8 0c0 3-4 4-4 7M12 19h.01M4 21h16' },
]
export const DRILLS: Item[] = [
  { to: '/drills', label: 'All drills', icon: 'M12 7v5l3 2M12 21a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM10 2h4', end: true },
  { to: '/drills/maths', label: 'Case maths', icon: 'M5 7h6M8 4v6M14 7h5M5 17l4 4M9 17l-4 4M14 16h5M14 20h5' },
  { to: '/drills/structure', label: 'Structuring', icon: 'M12 4v5M5 9h14M5 9v4M12 9v4M19 9v4M3 13h4v6H3zM10 13h4v6h-4zM17 13h4v6h-4z' },
  { to: '/drills/charts', label: 'Reading charts', icon: 'M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6' },
  { to: '/drills/sizing', label: 'Market sizing', icon: 'M7 8a2 2 0 1 0 0-.01M17 8a2 2 0 1 0 0-.01M3 16c0-2 2-3.5 4-3.5s4 1.5 4 3.5M13 16c0-2 2-3.5 4-3.5s4 1.5 4 3.5M5 20h14' },
  { to: '/graphs', label: 'Graph library', icon: 'M4 20V4M4 20h16M7 16l4-6 3 3 5-8' },
]
export const REFERENCE: Item[] = [
  { to: '/case-types', label: 'Case types', icon: 'M4 5h16M4 12h16M4 19h10' },
  { to: '/formulas', label: 'Formulas', icon: 'M5 7h6M8 4v6M14 7h5M5 17l4 4M9 17l-4 4M14 16h5M14 20h5' },
  { to: '/glossary', label: 'Glossary', icon: 'M5 4h11a3 3 0 0 1 3 3v13H8a3 3 0 0 1-3-3zM9 9h6M9 13h4' },
]
const ADMIN: Item = { to: '/admin', label: 'Admin', icon: 'M4 20V10M10 20V4M16 20v-7M22 20H2' }
export const PREP: Item[] = [
  { to: '/today', label: 'Dashboard', icon: 'M4 12h4l2-6 4 12 2-6h4' },
  { to: '/tracker', label: 'Tracker', icon: 'M4 5h16v14H4zM4 10h16M9 5v14' },
  { to: '/cases', label: 'Case log', icon: 'M6 4h12v16H6zM9 8h6M9 12h6M9 16h3' },
  { to: '/notes', label: 'My notes', icon: 'M6 3h9l3 3v15H6zM9 9h6M9 13h6M9 17h4' },
  { to: '/stories', label: 'Fit stories', icon: 'M5 5h14v10H9l-4 4zM9 9h6M9 12h4' },
  { to: '/partners', label: 'Partners', icon: 'M9 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM3 19c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M18 14c2 .6 3 2.4 3 5' },
  { to: '/perks', label: 'Student perks', icon: 'M3 9l9-5 9 5-9 5-9-5zM7 11.5V16c0 1.5 2.5 3 5 3s5-1.5 5-3v-4.5M21 9v6' },
]

export function Icon({ d }: { d: string }) {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d={d} /></svg>
}

function NavGroup({ title, items }: { title: string; items: Item[] }) {
  return (
    <div className={title ? 'mt-4' : 'mt-3'}>
      {title && <div className="flex items-center gap-2 px-2.5 pb-1 text-[11.5px] font-medium tracking-[0.02em] text-[#8C98AE]"><span aria-hidden className="h-[7px] w-[7px] rounded-[2px] border border-[#8C98AE]/70" />{title}</div>}
      <div className={title ? 'nav-branch ml-[15px] pl-[11px]' : ''}>
        {items.map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => `${title ? 'nav-twig' : ''} relative flex items-center gap-2.5 rounded-md px-2.5 py-[5px] text-[13.5px] transition-colors ${isActive ? 'is-active bg-white/[0.07] text-white' : 'text-[#B8C2D3] hover:bg-white/[0.05] hover:text-white'}`}>
            <span className="opacity-75 [&_svg]:h-[16px] [&_svg]:w-[16px]"><Icon d={n.icon} /></span>{n.label}
          </NavLink>
        ))}
      </div>
    </div>
  )
}

export function SignInLink({ className = '' }: { className?: string }) {
  const loc = useLocation()
  return <Link to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} className={`rounded-lg bg-ink px-3.5 py-2 text-[14px] font-medium text-white hover:bg-[#22325A] ${className}`}>Sign in</Link>
}

function VerifyBanner({ email }: { email?: string }) {
  const { resendVerification, refreshUser } = useStore()
  const [sent, setSent] = useState(false)
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b border-marker/60 bg-marker-l px-4 py-2 text-[13.5px] text-ink-2 lg:px-10">
      <span>Confirm your school email: we sent a link to <b className="font-medium text-ink">{email}</b>.</span>
      <span className="flex gap-4">
        <button onClick={() => refreshUser()} className="font-medium text-ink underline-offset-2 hover:underline">I've confirmed it</button>
        <button disabled={sent} onClick={() => resendVerification().then(() => setSent(true)).catch(() => {})} className="text-muted hover:text-ink disabled:no-underline">{sent ? 'Sent again' : 'Resend'}</button>
      </span>
    </div>
  )
}

const MENU = 'M4 7h16M4 12h16M4 17h16'
const CLOSE = 'M6 6l12 12M18 6L6 18'
const SIGN_IN: Item = { to: '/signin', label: 'Sign in', icon: 'M15 3h4v18h-4M10 17l5-5-5-5M15 12H3' }
// The four sections in the phone tab bar; everything else lives behind More
const TABS = (signedIn: boolean): Item[] => [LEARN[0], PRACTISE[0], { to: '/drills', label: 'Drills', icon: DRILLS[0].icon }, signedIn ? PREP[0] : SIGN_IN]

/** Phone menu: a panel that slides up from the tab bar with every section, grouped. */
function MobileSheet({ open, onClose, user, isAdmin }: { open: boolean; onClose: () => void; user: boolean; isAdmin: boolean }) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow; document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = prev }
  }, [open, onClose])
  if (!open) return null
  const groups: [string, Item[]][] = [['Learn', LEARN], ['Practise', PRACTISE], ['Drills', DRILLS], ['Reference', REFERENCE], ...(user ? [['My prep', isAdmin ? [...PREP, ADMIN] : PREP] as [string, Item[]]] : [])]
  return (
    <div className="lg:hidden">
      <button type="button" aria-label="Close menu" onClick={onClose} className="sheet-fade fixed inset-0 z-30 bg-ink/40" />
      <nav id="mobile-sections" aria-label="All sections" className="sheet-up fixed inset-x-0 bottom-[calc(57px+env(safe-area-inset-bottom))] z-30 max-h-[calc(100svh-140px)] overflow-y-auto rounded-t-2xl border-t border-line bg-white px-4 pt-3 pb-4 shadow-[0_-12px_40px_rgba(15,27,51,.18)]">
        <div aria-hidden className="mx-auto mb-3 h-1 w-10 rounded-full bg-line" />
        <NavLink to="/home" onClick={onClose} className="mb-1 flex items-center gap-3 rounded-lg px-2 py-2 text-[14.5px] font-medium text-ink hover:bg-canvas"><Icon d={HOME.icon} />Home</NavLink>
        {groups.map(([title, items]) => (
          <div key={title} className="mt-3">
            <p className="px-2 pb-1 font-serif text-[13.5px] italic text-muted">{title}</p>
            <div className="grid grid-cols-2 gap-x-2">
              {items.map((n) => (
                <NavLink key={n.to} to={n.to} end={n.end} onClick={onClose}
                  className={({ isActive }) => `flex items-center gap-2.5 rounded-lg px-2 py-2.5 text-[14px] font-medium ${isActive ? 'bg-canvas text-ink' : 'text-ink-2 hover:bg-canvas'}`}>
                  <span className="text-teal-d"><Icon d={n.icon} /></span>{n.label}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
        <NavLink to="/about" onClick={onClose}
          className={({ isActive }) => `mt-4 flex items-center gap-3 rounded-lg border border-line px-3 py-2.5 text-[14px] font-medium ${isActive ? 'bg-canvas text-ink' : 'text-ink-2 hover:bg-canvas'}`}>
          <span className="text-teal-d"><Icon d={ABOUT.icon} /></span>About PrepForCase
        </NavLink>
        <div className="mt-3 flex gap-5 border-t border-line px-2 pt-3 text-[13.5px] text-muted">
          <NavLink to="/privacy" onClick={onClose} className="hover:text-ink">Privacy</NavLink>
          <NavLink to="/terms" onClick={onClose} className="hover:text-ink">Terms</NavLink>
          {user && <NavLink to="/settings" onClick={onClose} className="hover:text-ink">Settings</NavLink>}
        </div>
      </nav>
    </div>
  )
}

export default function AppShell() {
  const { user, data, error, setError } = useStore()
  const loc = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)
  const closeMenu = useCallback(() => setMobileOpen(false), [])
  const isAdmin = useIsAdmin()
  useEffect(() => { if (!loc.hash) window.scrollTo(0, 0); setMobileOpen(false) }, [loc.pathname, loc.hash])
  useEffect(() => { const m = PAGES[loc.pathname]; if (m) document.title = m.title }, [loc.pathname])
  const name = data?.profile?.name || user?.name || ''
  return (
    <div className="min-h-screen lg:pl-60">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col overflow-y-auto bg-ink px-4 py-6 lg:flex">
        <Link to="/home" className="px-3"><Logo light height={28} /></Link>
        <nav aria-label="Main" className="mt-2">
          <NavGroup title="" items={[HOME]} />
          <NavGroup title="Learn" items={LEARN} />
          <NavGroup title="Practise" items={PRACTISE} />
          <NavGroup title="Drills" items={DRILLS} />
          <NavGroup title="Reference" items={REFERENCE} />
          <NavGroup title="My prep" items={isAdmin ? [...PREP, ADMIN] : PREP} />
          <div className="mt-4 border-t border-white/10 pt-3"><NavGroup title="" items={[ABOUT]} /></div>
        </nav>
        <div className="mt-auto pt-6">
          <div className="mb-3 flex gap-4 px-3 text-[12.5px] text-[#8C98AE]">
            <Link to="/privacy" className="hover:text-white">Privacy</Link>
            <Link to="/terms" className="hover:text-white">Terms</Link>
          </div>
          {user ? (
            <NavLink to="/settings" className="flex items-center gap-3 rounded-lg border-t border-white/10 px-2 pt-4 pb-1 hover:text-white">
              <Avatar name={name} photo={user.photoURL} />
              <span className="min-w-0">
                <span className="block truncate text-[14px] font-medium text-white">{name}</span>
                <span className="block text-[12.5px] text-[#8C98AE]">Settings</span>
              </span>
            </NavLink>
          ) : (
            <div className="rounded-lg border border-white/10 p-3.5">
              <p className="text-[13px] leading-snug text-[#B8C2D3]">Sign in to unlock every lesson and track your progress.</p>
              <SignInLink className="mt-3 inline-block !bg-white !text-ink hover:!bg-teal-l" />
            </div>
          )}
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex items-center justify-between border-b border-line/80 bg-white/85 px-4 py-2 backdrop-blur-xl lg:hidden">
        <Link to="/home"><Logo height={24} /></Link>
        <div className="flex items-center gap-3">
          <button type="button" onClick={() => setMobileOpen((o) => !o)} aria-expanded={mobileOpen} aria-controls="mobile-sections" aria-label={mobileOpen ? 'Close menu' : 'Open menu: all sections'}
            className="grid h-9 w-9 place-items-center rounded-lg text-ink hover:bg-canvas"><Icon d={mobileOpen ? CLOSE : MENU} /></button>
          {user ? <NavLink to="/settings" aria-label="Settings"><Avatar name={name} photo={user.photoURL} /></NavLink> : <SignInLink />}
        </div>
      </header>

      {error && (
        <div role="alert" className="flex items-center justify-between gap-4 border-b border-signal bg-signal-l px-4 py-2 text-[14px] text-signal-d lg:px-10">
          {error}<button onClick={() => setError(null)} className="font-medium underline">Dismiss</button>
        </div>
      )}

      {user?.provider === 'password' && !user.emailVerified && <VerifyBanner email={user.email} />}

      <main className="mx-auto max-w-6xl px-4 pt-4 pb-28 sm:px-6 lg:px-9 lg:pt-7 lg:pb-14"><SignInWall><Outlet /></SignInWall></main>

      <MobileSheet open={mobileOpen} onClose={closeMenu} user={!!user} isAdmin={isAdmin} />

      <nav aria-label="Main" className="tabbar fixed inset-x-2.5 bottom-[calc(8px+env(safe-area-inset-bottom))] z-40 grid grid-cols-5 rounded-2xl p-1 lg:hidden">
        {(() => {
          const tabs = TABS(!!user)
          const idx = mobileOpen ? 4 : tabs.findIndex((t) => loc.pathname === t.to || loc.pathname.startsWith(t.to + '/'))
          const at = idx < 0 ? 4 : idx
          return <span aria-hidden className="tab-pill" style={{ transform: `translateX(${at * 100}%)` }} />
        })()}
        {TABS(!!user).map((n) => (
          <NavLink key={n.to} to={n.to} end={n.end}
            className={({ isActive }) => `relative z-[1] flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10.5px] font-medium transition-colors ${isActive && !mobileOpen ? 'text-white' : 'text-muted'}`}>
            <Icon d={n.icon} /><span className="truncate">{n.label}</span>
          </NavLink>
        ))}
        <button type="button" onClick={() => setMobileOpen((o) => !o)} aria-expanded={mobileOpen} aria-controls="mobile-sections"
          className={`relative z-[1] flex flex-col items-center gap-0.5 rounded-lg py-1.5 text-[10.5px] font-medium transition-colors ${mobileOpen || !TABS(!!user).some((t) => loc.pathname === t.to || loc.pathname.startsWith(t.to + '/')) ? 'text-white' : 'text-muted'}`}>
          <Icon d={mobileOpen ? CLOSE : MENU} /><span>More</span>
        </button>
      </nav>
    </div>
  )
}
