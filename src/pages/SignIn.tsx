import { Link, Navigate, useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { firebaseConfigured } from '../lib/backend'
import { GoogleMark, Logo } from '../components/ui'

export function SignInButton({ dark = false, label }: { dark?: boolean; label?: string }) {
  const { signIn } = useStore()
  return (
    <button onClick={signIn}
      className={`inline-flex items-center gap-3 rounded-lg px-5 py-3 text-[15px] font-medium shadow-sm transition-colors ${dark ? 'bg-white text-ink hover:bg-paper' : 'bg-ink text-white hover:bg-[#22325A]'}`}>
      {firebaseConfigured && <span className="flex h-6 w-6 items-center justify-center rounded bg-white"><GoogleMark /></span>}
      {label || (firebaseConfigured ? 'Continue with Google' : 'Start tracking my prep')}
    </button>
  )
}

export default function SignIn() {
  const { ready, user } = useStore()
  const loc = useLocation()
  const next = new URLSearchParams(loc.search).get('next')
  if (ready && user) return <Navigate to={next && next.startsWith('/') && next !== '/signin' ? next : '/home'} replace />
  return (
    <div className="graph-paper flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-line bg-white p-7 shadow-[0_18px_40px_-24px_rgba(20,33,61,.35)]">
        <Link to="/"><Logo /></Link>
        <h1 className="mt-6 text-[28px] font-semibold">Track your prep</h1>
        <p className="mt-1 text-muted">The course, frameworks, casebook and drills are open to everyone. Sign in to save your progress:</p>
        <ul className="mt-4 list-disc space-y-1 pl-5 text-ink-2">
          <li>Daily tracker and dashboard</li>
          <li>Case log that finds your weakest stage</li>
          <li>Course progress and drill scores</li>
          <li>Practice partners and student perks</li>
        </ul>
        <div className="mt-6"><SignInButton /></div>
        {!firebaseConfigured && <p className="mt-3 text-[13px] text-muted">Your progress is saved in this browser on this device.</p>}
        <Link to="/learn" className="mt-6 inline-block text-[14px] text-muted hover:text-ink">Or start the free course</Link>
      </div>
    </div>
  )
}
