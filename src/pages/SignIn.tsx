import { Link, Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { Logo } from '../components/ui'
import { SignInPanel } from '../components/SignInPanel'

/** A button that takes people to the sign-in page and brings them back afterwards. */
export function SignInButton({ dark = false, label = 'Sign in' }: { dark?: boolean; label?: string }) {
  const loc = useLocation()
  return (
    <Link to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`}
      className={`inline-flex items-center gap-2 rounded-lg px-5 py-3 text-[15px] font-medium transition-colors ${dark ? 'bg-white text-ink hover:bg-teal-l' : 'bg-ink text-white hover:bg-[#1C2B4A]'}`}>
      {label}
    </Link>
  )
}

export default function SignIn() {
  const { ready, user } = useStore()
  const loc = useLocation()
  const next = new URLSearchParams(loc.search).get('next')
  if (ready && user) return <Navigate to={next && next.startsWith('/') && !next.startsWith('//') && next !== '/signin' ? next : '/home'} replace />
  return (
    <div className="graph-paper flex min-h-screen items-center justify-center px-4 py-10">
      <div className="rise w-full max-w-[420px] rounded-2xl border border-line bg-white p-7 shadow-[0_30px_60px_-30px_rgba(15,27,51,.45)]">
        <Link to="/" aria-label="PrepForCase home"><Logo /></Link>
        <h1 className="mt-7 text-[30px] leading-tight">Sign in to get started</h1>
        <p className="mt-1.5 mb-6 text-[15px] text-muted">Free. Every lesson, framework, case and drill, with your progress saved.</p>
        <SignInPanel />
      </div>
    </div>
  )
}
