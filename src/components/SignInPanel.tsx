import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { AuthError, firebaseConfigured } from '../lib/backend'
import { lookupSchool } from '../lib/schools'
import { GoogleMark, inputCls } from './ui'

type Mode = 'choose' | 'signin' | 'signup' | 'reset'

const SchoolIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M3 9.5 12 5l9 4.5-9 4.5L3 9.5Z" /><path d="M7 11.5V16c1.4 1.3 3.1 2 5 2s3.6-.7 5-2v-4.5" />
  </svg>
)

/** The two ways in: Google, or a business school email with a password. Used by the sign-in page and the page wall. */
export function SignInPanel({ compact = false }: { compact?: boolean }) {
  const { signIn, signInEmail, signUpEmail, resetPassword } = useStore()
  const [mode, setMode] = useState<Mode>('choose')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState('')
  const [note, setNote] = useState('')

  const look = email.includes('@') ? lookupSchool(email) : null
  const go = (m: Mode) => { setMode(m); setErr(''); setNote('') }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setErr(''); setNote('')
    if (mode === 'signup') {
      if (!name.trim()) return setErr('Add your name.')
      if (look?.personal) return setErr('Use your school email, like name@london.edu. For a personal email, use Google instead.')
      if (password.length < 8) return setErr('Use a password of at least 8 characters.')
    }
    setBusy(true)
    try {
      if (mode === 'signin') await signInEmail(email, password)
      else if (mode === 'signup') await signUpEmail(name, email, password)
      else if (mode === 'reset') { await resetPassword(email); setNote('If there is an account for this email, a reset link is on its way. Check your inbox.') }
    } catch (x) {
      setErr(x instanceof AuthError ? x.message : 'Something went wrong. Try again.')
    } finally { setBusy(false) }
  }

  const btn = 'flex w-full items-center justify-center gap-3 rounded-lg px-5 py-3 text-[15px] font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[.99]'

  if (mode === 'choose') return (
    <div className="space-y-2.5">
      <button type="button" onClick={signIn} className={`${btn} bg-ink text-white hover:bg-[#1C2B4A]`}>
        {firebaseConfigured && <span className="flex h-6 w-6 items-center justify-center rounded bg-white"><GoogleMark /></span>}
        {firebaseConfigured ? 'Sign in with Google' : 'Start now (saved in this browser)'}
      </button>
      <button type="button" onClick={() => go('signin')} className={`${btn} border border-line bg-white text-ink hover:border-teal`}>
        <span className="text-teal-d"><SchoolIcon /></span>Sign in with business school email
      </button>
      {!compact && <p className="pt-1 text-center text-[12.5px] text-muted">Free. By continuing you agree to the <Link to="/privacy" className="underline hover:text-ink">privacy policy</Link>.</p>}
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-3 text-left" noValidate>
      <div className="flex items-center justify-between">
        <p className="font-medium text-ink">{mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Business school sign-in'}</p>
        <button type="button" onClick={() => go('choose')} className="text-[13px] text-muted hover:text-ink">Back</button>
      </div>
      {mode === 'signup' && (
        <label className="block text-[13.5px] text-ink-2">Your name
          <input className={`${inputCls} mt-1`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
      )}
      <label className="block text-[13.5px] text-ink-2">School email
        <input className={`${inputCls} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@london.edu" autoComplete="email" required />
        {mode === 'signup' && look?.school && <span className="mt-1 block text-[12.5px] text-teal-d">{look.school}</span>}
      </label>
      {mode !== 'reset' && (
        <label className="block text-[13.5px] text-ink-2">Password
          <input className={`${inputCls} mt-1`} type="password" value={password} onChange={(e) => setPassword(e.target.value)} minLength={8}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} required />
          {mode === 'signup' && <span className="mt-1 block text-[12.5px] text-muted">At least 8 characters.</span>}
        </label>
      )}
      {err && <p role="alert" className="rounded-md bg-signal-l px-3 py-2 text-[13.5px] text-signal-d">{err}</p>}
      {note && <p role="status" className="rounded-md bg-teal-l px-3 py-2 text-[13.5px] text-teal-d">{note}</p>}
      <button type="submit" disabled={busy || !email} className={`${btn} bg-ink text-white hover:bg-[#1C2B4A] disabled:opacity-50`}>
        {busy ? 'One moment…' : mode === 'signup' ? 'Create account' : mode === 'reset' ? 'Send reset link' : 'Sign in'}
      </button>
      <div className="flex flex-wrap justify-between gap-2 text-[13px]">
        {mode === 'signin' && <><button type="button" onClick={() => go('signup')} className="font-medium text-teal-d hover:underline">New here? Create an account</button>
          <button type="button" onClick={() => go('reset')} className="text-muted hover:text-ink">Forgot password?</button></>}
        {mode === 'signup' && <button type="button" onClick={() => go('signin')} className="font-medium text-teal-d hover:underline">Have an account? Sign in</button>}
        {mode === 'reset' && <button type="button" onClick={() => go('signin')} className="font-medium text-teal-d hover:underline">Back to sign in</button>}
      </div>
      {mode === 'signup' && <p className="text-[12px] leading-snug text-muted">We'll email you a link to confirm the address. That also unlocks student perks. See the <Link to="/privacy" className="underline">privacy policy</Link>.</p>}
    </form>
  )
}
