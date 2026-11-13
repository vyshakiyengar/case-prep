import { useEffect, useMemo, type ReactNode } from 'react'
import { claimPage, FREE_PAGES } from '../lib/taste'
import { track } from '../lib/funnel'
import { FreeNote } from './Learning'
import { useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { SignInPanel } from './SignInPanel'
import { LogoMark } from './ui'

// Pages a signed-out visitor (and a search engine) can read. Pages with a members-only part
// mark it themselves with <Gate>, or lock it (case steps after the clarifying questions).
const OPEN = ['/home', '/about', '/casebook', '/learn', '/frameworks', '/perfect-casing', '/glossary', '/interview-formats']
const OPEN_PREFIX = ['/casebook/', '/learn/']
// Pages that need an account to work at all (they send people to sign in), so they never use a free page
const MEMBERS = ['/today', '/tracker', '/cases', '/stories', '/notes', '/partners', '/perks', '/settings', '/admin', '/welcome', '/invite', '/verify-school']

/**
 * Signed-out visitors see the first screen of a page. Below that the page blurs out
 * and a card asks them to sign in. Signed-in people see everything.
 */
export function SignInWall({ children }: { children: ReactNode }) {
  const { user, ready } = useStore()
  const { pathname } = useLocation()
  const open = OPEN.includes(pathname) || OPEN_PREFIX.some((p) => pathname.startsWith(p)) || MEMBERS.some((p) => pathname.startsWith(p))
  // Two pages are fully open for anyone; this takes a free slot if one is left
  const taste = useMemo(() => (!user && ready && !open ? claimPage(pathname) : null), [user, ready, open, pathname])
  const locked = !user && ready && !open && !taste?.free
  useEffect(() => { if (locked) { track('lock_any'); track('lock_page') } }, [locked])
  if (taste?.free) return <><FreeNote t={taste} kind="page" />{children}</>
  if (!locked) return <>{children}</>
  return (
    <div>
      <div className="relative">
        {/* overflow-clip (not hidden) keeps sticky bars working */}
        <div className="max-h-[calc(100svh+80px)] overflow-clip">{children}</div>
        <div aria-hidden className="wall-veil pointer-events-none absolute inset-x-[-1rem] bottom-0 h-[min(360px,60%)]" />
      </div>
      <div className="relative z-[1] -mt-48 flex justify-center px-1 pb-4">
        <section aria-labelledby="wall-title" className="w-full max-w-[420px] rounded-xl border border-line bg-white p-5 text-center shadow-[0_30px_60px_-30px_rgba(15,27,51,.55)] sm:p-7">
          <div className="flex justify-center"><LogoMark size={36} /></div>
          <h2 id="wall-title" className="mt-3 text-[22px] leading-tight">Sign in to see it all, free</h2>
          <p className="mt-1.5 mb-5 text-[14.5px] text-muted">{taste && taste.used >= FREE_PAGES ? `You've seen your ${FREE_PAGES} free pages. ` : ''}Only a sign-in is needed. No payment, no trial. You'll get every lesson, framework, case and drill, and your progress is saved.</p>
          <SignInPanel />
        </section>
      </div>
    </div>
  )
}
