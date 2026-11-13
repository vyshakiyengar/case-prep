import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { AuthError, firebaseConfigured } from '../lib/backend'
import { lookupSchool } from '../lib/schools'
import { GoogleMark, inputCls } from './ui'
import { track } from '../lib/funnel'
import { chromeIntent, inAppName, isAndroid } from '../lib/inapp'

type Mode = 'choose' | 'signin' | 'signup' | 'reset'

const MailIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <rect x="3" y="5" width="18" height="14" rx="2" /><path d="m4 7 8 6 8-6" />
  </svg>
)

/**
 * Inside Instagram, LinkedIn and similar apps, Google refuses to sign anyone in. Say so
 * plainly and offer the way out: open the page in a real browser, or use email here.
 */
function InAppNote() {
  const [copied, setCopied] = useState(false)
  useEffect(() => { track('inapp_signin_seen') }, [])
  const href = window.location.href.replace(/[?&]inapp=1/, '')
  const copy = async () => {
    track('inapp_copy_link')
    try { await navigator.clipboard.writeText(href); setCopied(true) } catch { window.prompt('Copy this link, then open it in Safari or Chrome:', href) }
  }
  return (
    <div className="rounded-lg border border-line bg-canvas p-3.5 text-left text-[13.5px] leading-snug text-ink-2">
      <p className="font-medium text-ink">You're in {inAppName === 'this app' ? 'an app' : `${inAppName}`}'s built-in browser</p>
      <p className="mt-1">Google sign-in doesn't work here. {isAndroid ? 'Open this page in Chrome to use Google,' : <>Tap <b className="font-semibold">⋯</b> and choose <b className="font-semibold">Open in browser</b> to use Google,</>} or sign in with your email below.</p>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {isAndroid && <a href={chromeIntent(href)} onClick={() => track('inapp_open_chrome')} className="rounded-md bg-ink px-3 py-1.5 font-medium text-white">Open in Chrome</a>}
        <button type="button" onClick={copy} className="rounded-md border border-line bg-white px-3 py-1.5 font-medium text-ink">{copied ? 'Link copied' : 'Copy link'}</button>
      </div>
      {copied && <p className="mt-1.5 text-[12.5px] text-muted">Paste it into Safari or Chrome.</p>}
    </div>
  )
}

/** The ways in: Google, or any email with a password. Used by the sign-in page and every lock. */
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
      if (password.length < 8) return setErr('Use a password of at least 8 characters.')
    }
    setBusy(true)
    try {
      if (mode === 'signin') await signInEmail(email, password)
      else if (mode === 'signup') await signUpEmail(name, email, password)
      else if (mode === 'reset') { await resetPassword(email); setNote('If there is an account for this email, a reset link is on its way. Check your inbox.') }
    } catch (x) {
      track(`err_email_${x instanceof AuthError && x.code ? x.code.replace('auth/', '') : 'other'}`, false)
      setErr(x instanceof AuthError ? x.message : 'Something went wrong. Try again.')
    } finally { setBusy(false) }
  }

  const google = async () => {
    track('click_any'); track('click_google')
    try { await signIn() } catch (x) {
      track(`err_google_${x instanceof AuthError && x.code ? x.code.replace('auth/', '') : 'other'}`, false)
      setErr(x instanceof AuthError ? x.message : 'Sign-in didn\'t work. Try again.')
    }
  }
  const useEmail = () => { track('click_any'); track('click_email'); go('signin') }

  const btn = 'flex w-full items-center justify-center gap-3 rounded-lg px-5 py-3 text-[14.5px] font-medium transition-[transform,background-color,border-color] duration-150 active:scale-[.99]'

  if (mode === 'choose') return (
    <div className="space-y-2.5">
      {inAppName && firebaseConfigured && <InAppNote />}
      {!(inAppName && firebaseConfigured) && (
        <button type="button" onClick={google} className={`${btn} bg-ink text-white hover:bg-[#1C2B4A]`}>
          {firebaseConfigured && <span className="flex h-6 w-6 items-center justify-center rounded bg-white"><GoogleMark /></span>}
          {firebaseConfigured ? 'Sign in with Google' : 'Start now (saved in this browser)'}
        </button>
      )}
      <button type="button" onClick={useEmail} className={`${btn} ${inAppName && firebaseConfigured ? 'bg-ink text-white hover:bg-[#1C2B4A]' : 'border border-line bg-white text-ink hover:border-teal'}`}>
        <span className={inAppName && firebaseConfigured ? 'text-white' : 'text-teal-d'}><MailIcon /></span>Sign in with email
      </button>
      {err && <p role="alert" className="rounded-md bg-signal-l px-3 py-2 text-left text-[13.5px] text-signal-d">{err}</p>}
      {!compact && <p className="pt-1 text-center text-[12.5px] text-muted">Free. By continuing you agree to the <Link to="/terms" className="underline hover:text-ink">terms</Link> and <Link to="/privacy" className="underline hover:text-ink">privacy notice</Link>.</p>}
    </div>
  )

  return (
    <form onSubmit={submit} className="space-y-3 text-left" noValidate>
      <div className="flex items-center justify-between">
        <p className="font-medium text-ink">{mode === 'signup' ? 'Create your account' : mode === 'reset' ? 'Reset your password' : 'Sign in with email'}</p>
        <button type="button" onClick={() => go('choose')} className="text-[13px] text-muted hover:text-ink">Back</button>
      </div>
      {mode === 'signup' && (
        <label className="block text-[13.5px] text-ink-2">Your name
          <input className={`${inputCls} mt-1`} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" required />
        </label>
      )}
      <label className="block text-[13.5px] text-ink-2">Email
        <input className={`${inputCls} mt-1`} type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required />
        {mode === 'signup' && look?.school && <span className="mt-1 block text-[12.5px] text-teal-d">{look.school}: student perks will unlock once you confirm it</span>}
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
      {mode === 'signup' && <p className="text-[12px] leading-snug text-muted">We'll email you a link to confirm the address. A school email also unlocks student perks. See the <Link to="/privacy" className="underline">privacy policy</Link>.</p>}
    </form>
  )
}
