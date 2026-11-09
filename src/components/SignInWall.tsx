import type { ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { SignInPanel } from './SignInPanel'
import { LogoMark } from './ui'

// Pages a signed-out visitor (and a search engine) can read. Pages with a members-only part
// mark it themselves with <Gate>, or lock it (case steps after the clarifying questions).
const OPEN = ['/home', '/about', '/casebook', '/learn', '/frameworks', '/perfect-casing', '/glossary', '/interview-formats']
const OPEN_PREFIX = ['/casebook/', '/learn/']

/**
 * Signed-out visitors see the first screen of a page. Below that the page blurs out
 * and a card asks them to sign in. Signed-in people see everything.
 */
export function SignInWall({ children }: { children: ReactNode }) {
  const { user, ready } = useStore()
  const { pathname } = useLocation()
  if (user || !ready || OPEN.includes(pathname) || OPEN_PREFIX.some((p) => pathname.startsWith(p))) return <>{children}</>
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
          <h2 id="wall-title" className="mt-3 text-[22px] leading-tight">Sign in to get started</h2>
          <p className="mt-1.5 mb-5 text-[14.5px] text-muted">It's free. You get every lesson, framework, case and drill, and your progress is saved.</p>
          <SignInPanel />
        </section>
      </div>
    </div>
  )
}
