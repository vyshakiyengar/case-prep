import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Perk, StudentRecord, UserStats } from '../lib/types'
import { LESSONS } from '../content/course'
import { uid } from '../lib/dates'
import { Button, Field, inputCls, PageHeader, Section } from '../components/ui'
import { Loading } from '../App'
import { useIsAdmin } from '../lib/admin'


const csvCell = (v: unknown) => `"${String(v ?? '').replace(/"/g, '""')}"`

function PerkManager() {
  const { backend } = useStore()
  const [perks, setPerks] = useState<Perk[]>([])
  const blank: Perk = { id: '', title: '', description: '', kind: 'download', url: '', code: '', order: 1 }
  const [p, setP] = useState<Perk>(blank)
  const load = () => backend!.listPerks().then((x) => setPerks(x.sort((a, b) => (a.order ?? 99) - (b.order ?? 99))))
  useEffect(() => { load() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <Section title="Perks" aside={<span className="text-[13.5px] text-muted">Only verified students can see these</span>}>
      <ul className="divide-y divide-line">
        {perks.map((x) => (
          <li key={x.id} className="flex flex-wrap items-center justify-between gap-2 py-2.5">
            <span><b className="font-medium text-ink">{x.title}</b> <span className="text-[13px] text-muted">{x.kind}{x.code ? `, code ${x.code}` : ''}</span></span>
            <span className="flex gap-1">
              <Button variant="quiet" onClick={() => setP(x)}>Edit</Button>
              <Button variant="danger" onClick={async () => { if (confirm(`Delete "${x.title}"?`)) { await backend!.deletePerk(x.id); load() } }}>Delete</Button>
            </span>
          </li>
        ))}
      </ul>
      <form className="mt-4 grid gap-3 rounded-lg border border-line p-4 sm:grid-cols-2" onSubmit={async (e) => { e.preventDefault(); await backend!.savePerk({ ...p, id: p.id || uid() }); setP(blank); load() }}>
        <div className="sm:col-span-2 text-[14.5px] font-semibold text-ink">{p.id ? 'Edit perk' : 'Add a perk'}</div>
        <Field label="Title"><input required className={inputCls} value={p.title} onChange={(e) => setP({ ...p, title: e.target.value })} /></Field>
        <Field label="Type"><select className={inputCls} value={p.kind} onChange={(e) => setP({ ...p, kind: e.target.value as Perk['kind'] })}><option value="download">Download</option><option value="code">Discount code</option><option value="link">Link</option></select></Field>
        <div className="sm:col-span-2"><Field label="Description"><input className={inputCls} value={p.description} onChange={(e) => setP({ ...p, description: e.target.value })} /></Field></div>
        <Field label="Link" hint="Download file, Payhip product page, etc."><input className={inputCls} value={p.url || ''} onChange={(e) => setP({ ...p, url: e.target.value })} placeholder="https://" /></Field>
        <Field label="Discount code" hint="Only for discount perks"><input className={inputCls} value={p.code || ''} onChange={(e) => setP({ ...p, code: e.target.value })} /></Field>
        <Field label="Order"><input type="number" className={inputCls} value={p.order ?? 1} onChange={(e) => setP({ ...p, order: Number(e.target.value) })} /></Field>
        <div className="flex items-end gap-2"><Button type="submit">{p.id ? 'Save perk' : 'Add perk'}</Button>{p.id && <Button type="button" variant="secondary" onClick={() => setP(blank)}>Cancel</Button>}</div>
      </form>
    </Section>
  )
}

const DAY = 86400000
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const lastNDays = (n: number) => Array.from({ length: n }, (_, i) => iso(Date.now() - (n - 1 - i) * DAY))
const ago = (t: number) => { const d = Math.floor((Date.now() - t) / DAY); return d <= 0 ? 'today' : d === 1 ? 'yesterday' : `${d} days ago` }

function Kpi({ label, value, sub }: { label: string; value: number | string; sub?: string }) {
  return (
    <div className="rounded-xl border border-line bg-white px-4 py-3">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="font-serif text-[30px] leading-tight font-semibold text-ink tabular-nums">{value}</div>
      {sub && <div className="text-[12.5px] text-muted">{sub}</div>}
    </div>
  )
}

/** Single-series column chart: one hue, thin columns, hover shows the value. */
function Columns({ days, values, label }: { days: string[]; values: number[]; label: string }) {
  const max = Math.max(1, ...values)
  return (
    <div>
      <div className="flex h-36 items-end gap-[2px] border-b border-line" role="img" aria-label={label}>
        {values.map((v, i) => (
          <div key={days[i]} className="group relative flex h-full flex-1 items-end">
            <div className="w-full rounded-t-[4px] bg-teal group-hover:bg-teal-d" style={{ height: `${(v / max) * 100}%`, minHeight: v ? 3 : 0 }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[12px] text-white group-hover:block">{days[i].slice(5)}: {v}</div>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11.5px] text-muted"><span>{days[0].slice(5)}</span><span>max {max}</span><span>{days[days.length - 1].slice(5)}</span></div>
    </div>
  )
}

function HBars({ rows }: { rows: { label: string; v: number; of?: number }[] }) {
  const max = Math.max(1, ...rows.map((r) => r.of ?? r.v))
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1" title={`${r.label}: ${r.v}`}>
          <span className="truncate text-[14px] text-ink">{r.label}</span>
          <span className="text-[14px] font-semibold tabular-nums text-ink">{r.v}{r.of ? <span className="ml-1 font-normal text-muted">({Math.round((r.v / r.of) * 100)}%)</span> : null}</span>
          <div className="col-span-2 h-2 rounded-full bg-canvas"><div className="h-full rounded-full bg-teal" style={{ width: `${(r.v / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  )
}

function Analytics({ stats, students }: { stats: UserStats[]; students: StudentRecord[] }) {
  const days30 = lastNDays(30)
  const now = Date.now()
  const signups = days30.map((d) => stats.filter((s) => iso(s.createdAt) === d).length)
  const active = days30.map((d) => stats.filter((s) => s.activeDays?.includes(d)).length)
  const activeIn = (n: number) => stats.filter((s) => now - s.lastActive < n * DAY).length
  const n = stats.length
  const funnel = [
    { label: 'Signed up', v: n, of: n },
    { label: 'Finished 1+ lesson', v: stats.filter((s) => s.lessons >= 1).length, of: n },
    { label: 'Finished 5+ lessons', v: stats.filter((s) => s.lessons >= 5).length, of: n },
    { label: 'Finished the course', v: stats.filter((s) => s.lessons >= LESSONS.length).length, of: n },
    { label: 'Trained phrases', v: stats.filter((s) => s.trainerCards > 0).length, of: n },
    { label: 'Logged a case', v: stats.filter((s) => s.cases >= 1).length, of: n },
    { label: 'Logged 5+ cases', v: stats.filter((s) => s.cases >= 5).length, of: n },
    { label: 'Verified student', v: students.length, of: n },
  ]
  const byLesson = LESSONS.map((l, i) => ({ label: `${i + 1}. ${l.title.split(':')[0]}`, v: stats.filter((s) => s.learned?.includes(l.slug)).length }))
  const [q, setQ] = useState('')
  const users = stats.filter((s) => !q || `${s.name} ${s.email}`.toLowerCase().includes(q.toLowerCase())).sort((a, b) => b.lastActive - a.lastActive)
  const sum = (k: keyof UserStats) => stats.reduce((a, s) => a + (Number(s[k]) || 0), 0)
  const exportUsers = () => {
    const head = ['Name', 'Email', 'Joined', 'Last active', 'Active days', 'Lessons', 'Cases', 'Drills', 'Phrases trained', 'Interview date']
    const lines = stats.map((s) => [s.name, s.email, iso(s.createdAt), iso(s.lastActive), s.activeDays?.length || 0, s.lessons, s.cases, s.drills, s.trainerCards, s.interviewDate || ''].map(csvCell).join(','))
    const blob = new Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `prepforcase-users-${iso(now)}.csv`; a.click()
  }
  return (
    <>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
        <Kpi label="Users" value={n} sub={`+${stats.filter((s) => now - s.createdAt < 7 * DAY).length} this week`} />
        <Kpi label="Active today" value={activeIn(1)} />
        <Kpi label="Active, 7 days" value={activeIn(7)} sub={n ? `${Math.round((activeIn(7) / n) * 100)}% of users` : undefined} />
        <Kpi label="Active, 30 days" value={activeIn(30)} />
        <Kpi label="Verified students" value={students.length} sub={`${students.filter((s) => s.marketing).length} agreed to marketing`} />
        <Kpi label="Cases logged" value={sum('cases')} sub={`${sum('lessons')} lesson${sum('lessons') === 1 ? '' : 's'} completed`} />
      </div>
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Section title="New sign-ups, last 30 days"><Columns days={days30} values={signups} label="New sign-ups per day" /></Section>
        <Section title="Active users, last 30 days"><Columns days={days30} values={active} label="Active users per day" /></Section>
      </div>
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Section title="Activation funnel" aside={<span className="text-[13px] text-muted">% of all users</span>}><HBars rows={funnel} /></Section>
        <Section title="Lessons completed"><HBars rows={byLesson} /></Section>
      </div>
      <Section title="Users" className="mb-5" aside={<span className="flex gap-2"><input className={`${inputCls} max-w-48 py-1.5`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} /><Button variant="secondary" onClick={exportUsers}>Export CSV</Button></span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-[14px]">
            <thead><tr className="border-b border-line text-left text-[12.5px] text-muted"><th className="py-2 font-medium">Name</th><th className="font-medium">Email</th><th className="font-medium">Joined</th><th className="font-medium">Last active</th><th className="text-right font-medium">Lessons</th><th className="text-right font-medium">Cases</th><th className="text-right font-medium">Drills</th><th className="text-right font-medium">Phrases</th></tr></thead>
            <tbody>{users.slice(0, 200).map((s) => (
              <tr key={s.uid} className="border-b border-line last:border-0">
                <td className="py-2 text-ink">{s.name}</td><td className="text-muted">{s.email}</td><td>{iso(s.createdAt)}</td><td>{ago(s.lastActive)}</td>
                <td className="text-right tabular-nums">{s.lessons}</td><td className="text-right tabular-nums">{s.cases}</td><td className="text-right tabular-nums">{s.drills}</td><td className="text-right tabular-nums">{s.trainerCards}</td>
              </tr>))}</tbody>
          </table>
          {!users.length && <p className="py-4 text-muted">No users yet.</p>}
        </div>
      </Section>
      <Section title="Page views and visitors" className="mb-8">
        <p className="text-ink-2">Visits, top pages, countries and referrers (including people who never sign in) are counted by Vercel Web Analytics. Open your project in Vercel and go to the <b className="font-semibold">Analytics</b> tab. The first time, click <b className="font-semibold">Enable</b> there.</p>
        <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[14px] font-medium text-violet-d hover:underline">Open Vercel ↗</a>
      </Section>
    </>
  )
}

export default function Admin() {
  const { backend } = useStore()
  const isAdmin = useIsAdmin()
  const [rows, setRows] = useState<StudentRecord[] | null>(null)
  const [stats, setStats] = useState<UserStats[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  useEffect(() => {
    if (!isAdmin || !backend) return
    const refused = () => setErr('The database refused access. Check firestore.rules has been published with your email as admin.')
    backend.listStudents().then(setRows).catch(refused)
    backend.listStats().then(setStats).catch(refused)
  }, [isAdmin, backend])
  const bySchool = useMemo(() => {
    const m = new Map<string, number>(); (rows || []).forEach((r) => m.set(r.school, (m.get(r.school) || 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [rows])
  if (!isAdmin) return <Navigate to="/today" replace />
  if (err) return <p className="text-signal-d">{err}</p>
  if (!rows || !stats) return <Loading />
  const shown = rows.filter((r) => !q || `${r.name} ${r.school} ${r.schoolEmail} ${r.program}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.verifiedAt - a.verifiedAt)
  const exportCsv = () => {
    const head = ['Name', 'School email', 'Google email', 'School', 'Known school', 'Programme', 'Graduation year', 'Marketing consent', 'Verified at']
    const lines = rows.map((r) => [r.name, r.schoolEmail, r.googleEmail, r.school, r.knownSchool ? 'yes' : 'no', r.program, r.gradYear, r.marketing ? 'yes' : 'no', new Date(r.verifiedAt).toISOString()].map(csvCell).join(','))
    const blob = new Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `prepforcase-students-${new Date().toISOString().slice(0, 10)}.csv`; a.click()
  }
  const optIn = rows.filter((r) => r.marketing).length
  return (
    <>
      <PageHeader title="Admin" intro="How people use PrepForCase: sign-ups, activity, learning progress and verified students. Only you can see this page." />
      <Analytics stats={stats} students={rows} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-[24px] font-semibold">Verified students</h2><Button onClick={exportCsv}>Export students CSV</Button></div>
      <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-3">
        <div><dt className="text-[13px] text-muted">Verified students</dt><dd className="font-serif text-[30px] font-semibold text-ink">{rows.length}</dd></div>
        <div><dt className="text-[13px] text-muted">Agreed to marketing</dt><dd className="font-serif text-[30px] font-semibold text-ink">{optIn}</dd></div>
        <div><dt className="text-[13px] text-muted">Schools</dt><dd className="font-serif text-[30px] font-semibold text-ink">{bySchool.length}</dd></div>
      </dl>
      <div className="grid gap-5 lg:grid-cols-[1fr_2fr]">
        <Section title="By school">
          <ul className="space-y-2">{bySchool.map(([s, n]) => (
            <li key={s} className="grid grid-cols-[1fr_auto] items-center gap-3">
              <span className="text-[14px] text-ink">{s}</span><span className="text-[14px] font-semibold tabular-nums">{n}</span>
              <div className="col-span-2 h-1.5 rounded-full bg-canvas"><div className="h-full rounded-full bg-teal" style={{ width: `${(n / bySchool[0][1]) * 100}%` }} /></div>
            </li>))}
          </ul>
        </Section>
        <Section title="Students" aside={<input className={`${inputCls} max-w-56 py-1.5`} placeholder="Search" value={q} onChange={(e) => setQ(e.target.value)} />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-[14px]">
              <thead><tr className="border-b border-line text-left text-[12.5px] text-muted"><th className="py-2 font-medium">Name</th><th className="font-medium">School</th><th className="font-medium">Programme</th><th className="font-medium">School email</th><th className="font-medium">Marketing</th></tr></thead>
              <tbody>{shown.map((r) => (
                <tr key={r.uid} className="border-b border-line last:border-0">
                  <td className="py-2 text-ink">{r.name}</td><td>{r.school}{!r.knownSchool && <span className="ml-1 text-[12px] text-signal-d">check</span>}</td>
                  <td>{r.program} {r.gradYear}</td><td className="text-muted">{r.schoolEmail}</td><td>{r.marketing ? 'Yes' : 'No'}</td>
                </tr>))}</tbody>
            </table>
          </div>
          <p className="mt-3 text-[13px] text-muted">"Check" marks a domain that isn't on the known business school list. It was verified as a real inbox, but may not be a business school.</p>
        </Section>
      </div>
      <div className="mt-5"><PerkManager /></div>
    </>
  )
}
