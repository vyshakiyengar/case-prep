import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { SchoolLinkError } from '../lib/backend'
import { lookupSchool } from '../lib/schools'
import { PENDING_KEY, readPending, SchoolForm } from './Perks'
import type { Pending } from './Perks'
import { Logo } from '../components/ui'

export default function VerifySchool() {
  const { backend, user, data } = useStore()
  const [state, setState] = useState<'working' | 'need-details' | 'done' | 'error' | 'not-a-link'>('working')
  const [msg, setMsg] = useState('')
  const started = useRef(false)
  const href = window.location.href

  const finish = async (p: Pending) => {
    if (!backend || !user) return
    setState('working')
    try {
      await backend.completeSchoolLink(p.email, href)
      const look = lookupSchool(p.email)
      await backend.saveStudent({
        uid: user.uid, name: data?.profile?.name || user.name, googleEmail: user.email, schoolEmail: p.email.toLowerCase(), domain: look.domain,
        school: p.school, knownSchool: !!look.school, program: p.program, gradYear: p.gradYear, marketing: p.marketing,
        consentAt: Date.now(), verifiedAt: Date.now(),
      })
      localStorage.removeItem(PENDING_KEY)
      window.history.replaceState(null, '', '/verify-school')
      setState('done')
    } catch (e) {
      setMsg(e instanceof SchoolLinkError ? e.message : "Something went wrong while verifying. Send yourself a new link from the Student perks page.")
      setState('error')
    }
  }

  useEffect(() => {
    if (!backend || !user || started.current) return
    started.current = true
    if (!backend.isSchoolLink(href)) { setState('not-a-link'); return }
    const p = readPending()
    if (p?.email) finish(p); else setState('need-details')
  }, [backend, user]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="graph-paper flex min-h-screen items-center justify-center px-4 py-10">
      <div className="w-full max-w-lg rounded-2xl border border-line bg-white p-7">
        <Logo />
        <div className="mt-6">
          {state === 'working' && <p className="text-muted" role="status">Verifying your school email…</p>}
          {state === 'need-details' && (
            <>
              <h1 className="text-[26px] font-semibold">Confirm your details</h1>
              <p className="mt-1 mb-5 text-muted">You opened the link on a different device or browser, so enter the same school email again.</p>
              <SchoolForm submitLabel="Verify" onSubmit={finish} />
            </>
          )}
          {state === 'done' && (
            <>
              <h1 className="text-[26px] font-semibold">You're verified</h1>
              <p className="mt-1 text-muted">Your student perks are unlocked.</p>
              <Link to="/perks" className="mt-5 inline-flex rounded-lg bg-ink px-5 py-2.5 font-medium text-white">See my perks</Link>
            </>
          )}
          {state === 'error' && (
            <>
              <h1 className="text-[26px] font-semibold">Verification didn't work</h1>
              <p className="mt-1 text-ink-2">{msg}</p>
              <Link to="/perks" className="mt-5 inline-flex rounded-lg bg-ink px-5 py-2.5 font-medium text-white">Back to Student perks</Link>
            </>
          )}
          {state === 'not-a-link' && (
            <>
              <h1 className="text-[26px] font-semibold">This isn't a verification link</h1>
              <p className="mt-1 text-muted">Open the link from the email we sent to your school address, or start again.</p>
              <Link to="/perks" className="mt-5 inline-flex rounded-lg bg-ink px-5 py-2.5 font-medium text-white">Go to Student perks</Link>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
