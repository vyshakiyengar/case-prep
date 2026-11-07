import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Perk, StudentRecord } from '../lib/types'
import { lookupSchool, PROGRAMS } from '../lib/schools'
import { Button, Field, inputCls, PageHeader, Section } from '../components/ui'
import { Loading } from '../App'

export const PENDING_KEY = 'cpos-school-pending'
export interface Pending { email: string; school: string; program: string; gradYear: string; marketing: boolean }
export const readPending = (): Pending | null => { try { return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null') } catch { return null } }

const years = Array.from({ length: 8 }, (_, i) => `${new Date().getFullYear() - 2 + i}`)

export function SchoolForm({ initial, submitLabel, onSubmit, busy }: { initial?: Partial<Pending>; submitLabel: string; onSubmit: (p: Pending) => void; busy?: boolean }) {
  const [p, setP] = useState<Pending>({ email: '', school: '', program: 'MBA', gradYear: `${new Date().getFullYear() + 1}`, marketing: false, ...initial })
  const look = lookupSchool(p.email)
  const valid = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(p.email.trim())
  useEffect(() => { if (look.school) setP((x) => ({ ...x, school: look.school! })) }, [look.school])
  const problem = valid && look.personal ? 'Use your school email address, not a personal one.' : null
  return (
    <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); if (!problem && p.school.trim()) onSubmit({ ...p, email: p.email.trim().toLowerCase(), school: p.school.trim() }) }}>
      <Field label="Business school email" hint="We send a one-click link to this address to confirm it's yours.">
        <input type="email" required className={inputCls} value={p.email} onChange={(e) => setP({ ...p, email: e.target.value })} placeholder="name@london.edu" autoComplete="email" />
      </Field>
      {problem && <p className="text-[13.5px] text-signal-d">{problem}</p>}
      <Field label="School" hint={look.school ? 'Recognised from your email' : valid ? "We don't recognise this domain yet. Type your school's name." : undefined}>
        <input required className={inputCls} value={p.school} onChange={(e) => setP({ ...p, school: e.target.value })} placeholder="e.g. London Business School" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Programme"><select className={inputCls} value={p.program} onChange={(e) => setP({ ...p, program: e.target.value })}>{PROGRAMS.map((x) => <option key={x}>{x}</option>)}</select></Field>
        <Field label="Graduation year"><select className={inputCls} value={p.gradYear} onChange={(e) => setP({ ...p, gradYear: e.target.value })}>{years.map((y) => <option key={y}>{y}</option>)}</select></Field>
      </div>
      <label className="flex items-start gap-3 rounded-lg border border-line bg-canvas/60 p-3 text-[14px]">
        <input type="checkbox" className="mt-1 h-4 w-4 accent-[#6C5CE7]" checked={p.marketing} onChange={(e) => setP({ ...p, marketing: e.target.checked })} />
        <span>Email me new free materials and student offers from PrepForCase. <span className="text-muted">Optional. You can unsubscribe at any time.</span></span>
      </label>
      <p className="text-[13px] text-muted">We store your school email, school, programme and graduation year to confirm student status and run student offers. See our <Link to="/privacy" className="underline">privacy notice</Link>.</p>
      <Button type="submit" disabled={busy || !valid || !!problem} className="py-2.5">{busy ? 'Sending…' : submitLabel}</Button>
    </form>
  )
}

function PerkItem({ p }: { p: Perk }) {
  const [copied, setCopied] = useState(false)
  return (
    <li className="grid gap-3 py-4 sm:grid-cols-[1fr_auto] sm:items-center">
      <div>
        <h3 className="text-[18px] font-semibold">{p.title}</h3>
        <p className="text-ink-2">{p.description}</p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {p.kind === 'code' && p.code && (
          <button onClick={async () => { try { await navigator.clipboard.writeText(p.code!); setCopied(true); setTimeout(() => setCopied(false), 2000) } catch { /* ignore */ } }}
            className="rounded-lg border-2 border-dashed border-violet bg-violet-l px-3 py-1.5 font-mono text-[15px] font-semibold tracking-wide text-violet-d" title="Copy code">
            {copied ? 'Copied' : p.code}
          </button>
        )}
        {p.url && <a href={p.url} target="_blank" rel="noreferrer" className="rounded-lg bg-ink px-4 py-2 text-[14px] font-medium text-white hover:bg-[#22325A]">{p.kind === 'download' ? 'Download' : p.kind === 'code' ? 'Use the code' : 'Open'}</a>}
      </div>
    </li>
  )
}

export default function Perks() {
  const { backend, user } = useStore()
  const [student, setStudent] = useState<StudentRecord | null | undefined>(undefined)
  const [perks, setPerks] = useState<Perk[]>([])
  const [sent, setSent] = useState<string | null>(readPending()?.email || null)
  const [busy, setBusy] = useState(false)
  const [err, setErr] = useState<string | null>(null)
  useEffect(() => {
    if (!backend || !user) return
    backend.getStudent(user.uid).then(async (s) => { setStudent(s); if (s) setPerks((await backend.listPerks()).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))) })
  }, [backend, user])
  if (backend?.mode === 'demo') return (
    <>
      <PageHeader title="Student perks" />
      <div className="max-w-xl rounded-xl border border-line bg-white p-6">
        <h2 className="text-[20px] font-semibold">Coming with Google sign-in</h2>
        <p className="mt-1 text-ink-2">Verifying your business school email needs an account in the cloud, so it switches on together with Google sign-in. Everything else works now, and your progress is saved in this browser.</p>
      </div>
    </>
  )
  if (student === undefined) return <Loading />

  const send = async (p: Pending) => {
    setBusy(true); setErr(null)
    try {
      await backend!.sendSchoolLink(p.email)
      localStorage.setItem(PENDING_KEY, JSON.stringify(p)); setSent(p.email)
    } catch { setErr("Couldn't send the link. Check the address and try again.") }
    setBusy(false)
  }

  if (student) return (
    <>
      <PageHeader title="Student perks" intro="Free materials and offers for verified business school students." />
      <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl border border-good/40 bg-good-l px-5 py-3">
        <svg width="22" height="22" viewBox="0 0 24 24" aria-hidden><circle cx="12" cy="12" r="11" fill="#1E8E3E" /><path d="M7 12.5l3.2 3L17 9" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" /></svg>
        <span className="text-ink"><b className="font-semibold">Verified student:</b> {student.school}, {student.program} {student.gradYear}</span>
        <span className="text-[13.5px] text-muted">{student.schoolEmail}</span>
      </div>
      <Section>
        {perks.length ? <ul className="divide-y divide-line">{perks.map((p) => <PerkItem key={p.id} p={p} />)}</ul>
          : <p className="text-muted">New perks are on their way. You'll see them here first.</p>}
      </Section>
    </>
  )

  return (
    <>
      <PageHeader title="Student perks" intro="Business school student? Verify your school email to unlock free downloads and student offers." />
      <div className="grid items-start gap-5 lg:grid-cols-[1.2fr_1fr]">
        <Section title={sent ? 'Check your school inbox' : 'Verify your school email'}>
          {sent ? (
            <>
              <p className="text-ink-2">We sent a verification link to <b className="font-semibold">{sent}</b>. Open it on this device to finish. It can take a minute to arrive; check junk or quarantine folders too.</p>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => send(readPending()!)} disabled={busy || !readPending()}>Send it again</Button>
                <Button variant="quiet" onClick={() => { localStorage.removeItem(PENDING_KEY); setSent(null) }}>Use a different email</Button>
              </div>
            </>
          ) : <SchoolForm submitLabel="Send verification link" onSubmit={send} busy={busy} />}
          {err && <p className="mt-3 text-[14px] text-signal-d" role="alert">{err}</p>}
        </Section>
        <Section title="What you unlock">
          <ul className="list-disc space-y-2 pl-5 text-ink-2">
            <li>Free downloads, such as the PrepForCase spreadsheet</li>
            <li>Student discounts on the casebook and new materials</li>
            <li>Early access to new cases</li>
          </ul>
          <p className="mt-4 text-[13.5px] text-muted">Your school email is only used to confirm you're a student. We never show it to practice partners.</p>
        </Section>
      </div>
    </>
  )
}
