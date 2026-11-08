import { useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useStore } from '../lib/store'
import type { Perk, StudentRecord, UserStats } from '../lib/types'
import { LESSONS } from '../content/course'
import { uid } from '../lib/dates'
import { Button, Field, inputCls, PageHeader, Section } from '../components/ui'
import { Loading } from '../App'
import { useIsAdminState } from '../lib/admin'


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
const MIN = 60000
const iso = (t: number) => new Date(t).toISOString().slice(0, 10)
const lastNDays = (n: number) => Array.from({ length: n }, (_, i) => iso(Date.now() - (n - 1 - i) * DAY))
const ago = (t?: number) => {
  if (!t) return '—'
  const m = Math.floor((Date.now() - t) / MIN)
  if (m < 1) return 'just now'; if (m < 60) return `${m} min ago`
  const h = Math.floor(m / 60); if (h < 24) return `${h} h ago`
  const d = Math.floor(h / 24); return d === 1 ? 'yesterday' : `${d} days ago`
}
const pct = (a: number, b: number) => (b ? Math.round((a / b) * 100) : 0)
const median = (xs: number[]) => { if (!xs.length) return 0; const s = [...xs].sort((a, b) => a - b); const m = Math.floor(s.length / 2); return s.length % 2 ? s[m] : Math.round((s[m - 1] + s[m]) / 2) }
const method = (s: UserStats) => s.provider === 'google' ? 'Google' : s.provider === 'password' ? (s.emailVerified ? 'School email' : 'School email (unconfirmed)') : 'Unknown'
const SECTION: Record<string, string> = {
  learn: 'Course', 'perfect-casing': 'Perfect casing', frameworks: 'Frameworks', casebook: 'Casebook', case: 'Case player', interviewer: 'Interviewer mode',
  graphs: 'Graph library', drills: 'Drills', 'interview-skills': 'Interview skills', 'case-types': 'Case types', formulas: 'Formulas', glossary: 'Glossary',
  today: 'Dashboard', tracker: 'Tracker', cases: 'Case log', notes: 'My notes', stories: 'Fit stories', partners: 'Partners', perks: 'Student perks',
  home: 'Home', landing: 'Landing', about: 'About', settings: 'Settings', admin: 'Admin',
}

function Kpi({ label, value, sub, delta }: { label: string; value: number | string; sub?: string; delta?: number }) {
  return (
    <div className="rounded-lg border border-line bg-white px-4 py-3">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="flex items-baseline gap-2">
        <span className="font-serif text-[26px] leading-tight text-ink tabular-nums">{value}</span>
        {delta !== undefined && delta !== 0 && <span className={`text-[12.5px] font-medium tabular-nums ${delta > 0 ? 'text-good' : 'text-signal-d'}`}>{delta > 0 ? '▲' : '▼'} {Math.abs(delta)}</span>}
      </div>
      {sub && <div className="text-[12.5px] text-muted">{sub}</div>}
    </div>
  )
}

/** Single-series columns: one hue, thin columns with 2px gaps, hover shows the value. */
function Columns({ days, values, label }: { days: string[]; values: number[]; label: string }) {
  const max = Math.max(1, ...values)
  return (
    <div>
      <div className="flex h-36 items-end gap-[2px] border-b border-line" role="img" aria-label={`${label}: ${values.join(', ')}`}>
        {values.map((v, i) => (
          <div key={days[i]} className="group relative flex h-full flex-1 items-end">
            <div className="w-full rounded-t-[4px] bg-teal transition-colors group-hover:bg-teal-d" style={{ height: `${(v / max) * 100}%`, minHeight: v ? 3 : 0 }} />
            <div className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 hidden -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[12px] text-white group-hover:block">{days[i].slice(5)}: {v}</div>
          </div>
        ))}
      </div>
      <div className="mt-1 flex justify-between text-[11.5px] text-muted"><span>{days[0].slice(5)}</span><span>peak {max}</span><span>{days[days.length - 1].slice(5)}</span></div>
    </div>
  )
}

/** One line with a hover crosshair. */
function Line({ days, values, label }: { days: string[]; values: number[]; label: string }) {
  const [hover, setHover] = useState<number | null>(null)
  const W = 600, H = 150, max = Math.max(1, ...values)
  const x = (i: number) => (i / Math.max(1, values.length - 1)) * W
  const y = (v: number) => H - (v / max) * (H - 8) - 2
  const d = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)},${y(v).toFixed(1)}`).join('')
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-36 w-full overflow-visible" preserveAspectRatio="none" role="img" aria-label={`${label}: ${values[values.length - 1]} now`}
        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); setHover(Math.round(((e.clientX - r.left) / r.width) * (values.length - 1))) }} onMouseLeave={() => setHover(null)}>
        <line x1="0" x2={W} y1={H} y2={H} stroke="var(--color-line)" />
        <path d={`${d}L${W},${H}L0,${H}Z`} fill="var(--color-teal)" opacity=".08" />
        <path d={d} fill="none" stroke="var(--color-teal)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
        {hover !== null && <line x1={x(hover)} x2={x(hover)} y1="0" y2={H} stroke="var(--color-faint)" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />}
      </svg>
      {hover !== null && (
        <div className="pointer-events-none absolute top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded bg-ink px-2 py-1 text-[12px] text-white" style={{ left: `${(hover / Math.max(1, values.length - 1)) * 100}%` }}>
          {days[hover].slice(5)}: {values[hover]}
        </div>
      )}
      <div className="mt-1 flex justify-between text-[11.5px] text-muted"><span>{days[0].slice(5)}</span><span>now {values[values.length - 1]}</span></div>
    </div>
  )
}

function HBars({ rows, empty = 'No data yet.' }: { rows: { label: string; v: number; of?: number }[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.of ?? r.v))
  if (!rows.length) return <p className="text-[14px] text-muted">{empty}</p>
  return (
    <ul className="space-y-2">
      {rows.map((r) => (
        <li key={r.label} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1" title={`${r.label}: ${r.v}`}>
          <span className="truncate text-[14px] text-ink">{r.label}</span>
          <span className="text-[14px] font-semibold tabular-nums text-ink">{r.v}{r.of ? <span className="ml-1 font-normal text-muted">({pct(r.v, r.of)}%)</span> : null}</span>
          <div className="col-span-2 h-2 rounded-full bg-canvas"><div className="h-full rounded-full bg-teal" style={{ width: `${(r.v / max) * 100}%` }} /></div>
        </li>
      ))}
    </ul>
  )
}

const top = (m: Map<string, number>, n = 8) => [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, n).map(([label, v]) => ({ label, v }))
const countBy = (xs: UserStats[], f: (s: UserStats) => string | undefined) => { const m = new Map<string, number>(); xs.forEach((s) => { const k = f(s); if (k) m.set(k, (m.get(k) || 0) + 1) }); return m }

/** Weekly sign-up cohorts: share of each cohort active in week k after joining. */
function Retention({ stats }: { stats: UserStats[] }) {
  const WEEKS = 8
  const now = Date.now()
  const startOfWeek = (t: number) => { const d = new Date(t); d.setUTCHours(0, 0, 0, 0); d.setUTCDate(d.getUTCDate() - ((d.getUTCDay() + 6) % 7)); return d.getTime() }
  const thisWeek = startOfWeek(now)
  const rows = Array.from({ length: WEEKS }, (_, i) => {
    const start = thisWeek - (WEEKS - 1 - i) * 7 * DAY
    const users = stats.filter((s) => s.createdAt >= start && s.createdAt < start + 7 * DAY)
    const cells = Array.from({ length: WEEKS }, (_, k) => {
      if (start + k * 7 * DAY > now) return null // not happened yet
      const active = users.filter((u) => {
        const j = iso(u.createdAt), from = Date.parse(j) + k * 7 * DAY, to = from + 7 * DAY
        return (u.activeDays || []).some((d) => { const t = Date.parse(d); return t >= from && t < to })
      }).length
      return users.length ? { n: active, p: pct(active, users.length) } : { n: 0, p: -1 }
    })
    return { label: iso(start).slice(5), size: users.length, cells }
  })
  const shade = (p: number) => p < 0 ? 'transparent' : `color-mix(in oklab, var(--color-teal) ${Math.max(6, p)}%, white)`
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-separate border-spacing-[2px] text-[12.5px]">
        <thead><tr className="text-muted"><th className="text-left font-medium">Week joined</th><th className="text-right font-medium">Users</th>{Array.from({ length: WEEKS }, (_, k) => <th key={k} className="font-medium">W{k}</th>)}</tr></thead>
        <tbody>{rows.map((r) => (
          <tr key={r.label}>
            <td className="pr-2 text-ink">{r.label}</td><td className="pr-2 text-right tabular-nums text-ink-2">{r.size}</td>
            {r.cells.map((c, k) => (
              <td key={k} title={c && c.p >= 0 ? `${c.n} of ${r.size} active in week ${k}` : ''} className="h-8 rounded-[4px] text-center tabular-nums"
                style={{ background: c ? shade(c.p) : 'transparent', color: c && c.p >= 55 ? 'white' : 'var(--color-ink)' }}>
                {c && c.p >= 0 ? `${c.p}%` : ''}
              </td>
            ))}
          </tr>
        ))}</tbody>
      </table>
      <p className="mt-2 text-[12.5px] text-muted">Each row is the people who signed up that week (Monday start). W1 = active again 7 to 13 days after joining. Darker = more of them came back.</p>
    </div>
  )
}

type SortKey = 'name' | 'method' | 'createdAt' | 'lastActive' | 'days' | 'sessions' | 'minutes' | 'lessons' | 'cases' | 'drills' | 'notes'

function Analytics({ stats, students, updated }: { stats: UserStats[]; students: StudentRecord[]; updated: number }) {
  const days30 = lastNDays(30)
  const now = Date.now()
  const n = stats.length
  const today = iso(now)
  const activeOn = (d: string) => stats.filter((s) => s.activeDays?.includes(d)).length
  const activeWithin = (days: number) => stats.filter((s) => (s.activeDays || []).some((d) => now - Date.parse(d) < days * DAY)).length
  const dau = activeOn(today), wau = activeWithin(7), mau = activeWithin(30)
  const online = stats.filter((s) => now - (s.lastActive || 0) < 5 * MIN).sort((a, b) => b.lastActive - a.lastActive)
  const new7 = stats.filter((s) => now - s.createdAt < 7 * DAY).length
  const prev7 = stats.filter((s) => now - s.createdAt >= 7 * DAY && now - s.createdAt < 14 * DAY).length
  const signups = days30.map((d) => stats.filter((s) => iso(s.createdAt) === d).length)
  const cumulative = days30.map((d) => stats.filter((s) => iso(s.createdAt) <= d).length)
  const daily = days30.map(activeOn)
  const minutes = stats.map((s) => s.minutes || 0)

  const funnel = [
    { label: 'Signed up', v: n, of: n },
    { label: 'Opened the course', v: stats.filter((s) => (s.views?.learn || 0) > 0 || s.lessons > 0).length, of: n },
    { label: 'Finished 1+ lesson', v: stats.filter((s) => s.lessons >= 1).length, of: n },
    { label: 'Finished 5+ lessons', v: stats.filter((s) => s.lessons >= 5).length, of: n },
    { label: 'Finished the course', v: stats.filter((s) => s.lessons >= LESSONS.length).length, of: n },
    { label: 'Took notes', v: stats.filter((s) => (s.notes || 0) > 0).length, of: n },
    { label: 'Trained phrases', v: stats.filter((s) => s.trainerCards > 0).length, of: n },
    { label: 'Practised a casebook case', v: stats.filter((s) => (s.practised || 0) >= 1).length, of: n },
    { label: 'Logged a case', v: stats.filter((s) => s.cases >= 1).length, of: n },
    { label: 'Came back on 3+ days', v: stats.filter((s) => (s.activeDays?.length || 0) >= 3).length, of: n },
  ]
  const byLesson = LESSONS.map((l, i) => ({ label: `${i + 1}. ${l.title.split(':')[0]}`, v: stats.filter((s) => s.learned?.includes(l.slug)).length, of: n }))
  const viewTotals = new Map<string, number>(); const viewUsers = new Map<string, number>()
  stats.forEach((s) => Object.entries(s.views || {}).forEach(([k, v]) => { const name = SECTION[k] || k; viewTotals.set(name, (viewTotals.get(name) || 0) + v); viewUsers.set(name, (viewUsers.get(name) || 0) + 1) }))
  const features = top(viewUsers, 14).map((r) => ({ ...r, of: n, label: `${r.label} · ${viewTotals.get(r.label)} view${viewTotals.get(r.label) === 1 ? '' : 's'}` }))
  const buckets = [['1 day', 1, 1], ['2-3 days', 2, 3], ['4-7 days', 4, 7], ['8-14 days', 8, 14], ['15+ days', 15, 9999]] as const
  const engagement = buckets.map(([label, lo, hi]) => ({ label, v: stats.filter((s) => { const k = s.activeDays?.length || 0; return k >= lo && k <= hi }).length, of: n }))

  const [q, setQ] = useState('')
  const [sort, setSort] = useState<{ k: SortKey; desc: boolean }>({ k: 'lastActive', desc: true })
  const val = (s: UserStats, k: SortKey): number | string => k === 'name' ? s.name.toLowerCase() : k === 'method' ? method(s) : k === 'days' ? (s.activeDays?.length || 0) : Number(s[k as keyof UserStats] || 0)
  const users = stats.filter((s) => !q || `${s.name} ${s.email} ${s.schoolDomain || ''} ${s.source || ''}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => { const x = val(a, sort.k), y = val(b, sort.k); return (x < y ? -1 : x > y ? 1 : 0) * (sort.desc ? -1 : 1) })
  const Th = ({ k, children, right }: { k: SortKey; children: string; right?: boolean }) => (
    <th className={`py-2 font-medium ${right ? 'text-right' : ''}`} aria-sort={sort.k === k ? (sort.desc ? 'descending' : 'ascending') : undefined}>
      <button className={`hover:text-ink ${sort.k === k ? 'text-ink' : ''}`} onClick={() => setSort((s) => ({ k, desc: s.k === k ? !s.desc : true }))}>{children}{sort.k === k ? (sort.desc ? ' ↓' : ' ↑') : ''}</button>
    </th>
  )
  const exportUsers = () => {
    const head = ['Name', 'Email', 'Sign-in', 'School domain', 'Joined', 'Last active', 'Active days', 'Visits', 'Engaged minutes', 'Lessons', 'Cases', 'Drills', 'Notes', 'Phrases trained', 'Source', 'Device', 'Time zone', 'Last page', 'Interview date', 'Section views']
    const lines = stats.map((s) => [s.name, s.email, method(s), s.schoolDomain, iso(s.createdAt), new Date(s.lastActive).toISOString(), s.activeDays?.length || 0, s.sessions || 0, s.minutes || 0, s.lessons, s.cases, s.drills, s.notes || 0, s.trainerCards, s.source, s.device, s.tz, s.lastPath, s.interviewDate || '',
      Object.entries(s.views || {}).map(([k, v]) => `${k}:${v}`).join(' ')].map(csvCell).join(','))
    const blob = new Blob([[head.map(csvCell).join(','), ...lines].join('\n')], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `prepforcase-users-${iso(now)}.csv`; a.click()
  }
  const recent = [...stats].sort((a, b) => b.createdAt - a.createdAt).slice(0, 8)
  return (
    <>
      <div className="mb-4 flex items-center gap-2 text-[13px] text-muted" role="status">
        <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-good opacity-60 motion-reduce:animate-none" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-good" /></span>
        Live · updated {new Date(updated).toLocaleTimeString()}
      </div>
      <div className="mb-3 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        <Kpi label="Users" value={n} sub={`${students.length} verified students`} />
        <Kpi label="New, last 7 days" value={new7} delta={new7 - prev7} sub={`vs ${prev7} the week before`} />
        <Kpi label="Online now" value={online.length} sub="active in the last 5 min" />
        <Kpi label="Active today" value={dau} sub={`DAU / MAU ${pct(dau, mau)}%`} />
        <Kpi label="Active 7 / 30 days" value={`${wau} / ${mau}`} sub={`${pct(wau, n)}% of users this week`} />
      </div>
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-5">
        <Kpi label="Engaged minutes" value={minutes.reduce((a, b) => a + b, 0)} sub={`median ${median(minutes)} per user`} />
        <Kpi label="Visits" value={stats.reduce((a, s) => a + (s.sessions || 0), 0)} sub={`${n ? (stats.reduce((a, s) => a + (s.sessions || 0), 0) / n).toFixed(1) : 0} per user`} />
        <Kpi label="Lessons completed" value={stats.reduce((a, s) => a + s.lessons, 0)} sub={`${pct(stats.filter((s) => s.lessons >= 1).length, n)}% finished one`} />
        <Kpi label="Cases logged" value={stats.reduce((a, s) => a + s.cases, 0)} sub={`${stats.reduce((a, s) => a + s.drills, 0)} drills`} />
        <Kpi label="Came back" value={`${pct(stats.filter((s) => (s.activeDays?.length || 0) >= 2).length, n)}%`} sub="active on 2+ days" />
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Section title="Online now">
          {online.length ? <ul className="space-y-2">{online.map((s) => (
            <li key={s.uid} className="flex items-center justify-between gap-3 text-[14px]"><span className="flex min-w-0 items-center gap-2"><span className="h-2 w-2 shrink-0 rounded-full bg-good" /><span className="truncate text-ink">{s.name}</span></span><span className="shrink-0 text-[12.5px] text-muted">{SECTION[(s.lastPath || '').split('/')[1]] || s.lastPath || ''}</span></li>
          ))}</ul> : <p className="text-[14px] text-muted">Nobody right now.</p>}
        </Section>
        <Section title="Latest sign-ups" className="lg:col-span-2">
          <ul className="divide-y divide-line">{recent.map((s) => (
            <li key={s.uid} className="flex flex-wrap items-center justify-between gap-x-4 gap-y-0.5 py-2 text-[14px]">
              <span className="min-w-0 truncate"><span className="text-ink">{s.name}</span> <span className="text-muted">{s.email}</span></span>
              <span className="text-[12.5px] text-muted">{method(s)}{s.source ? ` · from ${s.source}` : ''} · {ago(s.createdAt)}</span>
            </li>))}</ul>
          {!recent.length && <p className="text-[14px] text-muted">No sign-ups yet.</p>}
        </Section>
      </div>

      <div className="mb-5 grid gap-5 lg:grid-cols-3">
        <Section title="Total users"><Line days={days30} values={cumulative} label="Total users" /></Section>
        <Section title="New sign-ups per day"><Columns days={days30} values={signups} label="New sign-ups per day" /></Section>
        <Section title="Active users per day"><Columns days={days30} values={daily} label="Active users per day" /></Section>
      </div>

      <Section title="Retention by sign-up week" className="mb-5"><Retention stats={stats} /></Section>

      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Section title="Activation funnel" aside={<span className="text-[13px] text-muted">% of all users</span>}><HBars rows={funnel} /></Section>
        <Section title="Which sections people use" aside={<span className="text-[13px] text-muted">% of users who opened it</span>}><HBars rows={features} empty="Section views appear once people browse." /></Section>
      </div>
      <div className="mb-5 grid gap-5 lg:grid-cols-2">
        <Section title="How far people get in the course"><HBars rows={byLesson} /></Section>
        <Section title="How often people come back" aside={<span className="text-[13px] text-muted">days active</span>}><HBars rows={engagement} /></Section>
      </div>
      <div className="mb-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
        <Section title="Sign-in method"><HBars rows={top(countBy(stats, method)).map((r) => ({ ...r, of: n }))} /></Section>
        <Section title="Where they came from"><HBars rows={top(countBy(stats, (s) => s.source)).map((r) => ({ ...r, of: n }))} /></Section>
        <Section title="Schools (email sign-in)"><HBars rows={top(countBy(stats, (s) => s.schoolDomain))} empty="No school email sign-ups yet." /></Section>
        <Section title="Device and time zone"><HBars rows={[...top(countBy(stats, (s) => s.device && (s.device === 'mobile' ? 'Phone' : 'Computer')), 2), ...top(countBy(stats, (s) => s.tz?.replace('_', ' ')), 4)].map((r) => ({ ...r, of: n }))} /></Section>
      </div>

      <Section title={`Users (${users.length})`} className="mb-5" aside={<span className="flex gap-2"><input className={`${inputCls} max-w-48 py-1.5`} placeholder="Search name, email, school" value={q} onChange={(e) => setQ(e.target.value)} /><Button variant="secondary" onClick={exportUsers}>Export CSV</Button></span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1040px] text-[13.5px]">
            <thead><tr className="border-b border-line text-left text-[12.5px] text-muted">
              <Th k="name">Name</Th><Th k="method">Sign-in</Th><Th k="createdAt">Joined</Th><Th k="lastActive">Last active</Th>
              <Th k="days" right>Days</Th><Th k="sessions" right>Visits</Th><Th k="minutes" right>Minutes</Th><Th k="lessons" right>Lessons</Th><Th k="cases" right>Cases</Th><Th k="drills" right>Drills</Th><Th k="notes" right>Notes</Th>
              <th className="pl-3 font-medium">Source</th><th className="font-medium">Last page</th>
            </tr></thead>
            <tbody>{users.slice(0, 300).map((s) => (
              <tr key={s.uid} className="border-b border-line last:border-0 hover:bg-canvas/60">
                <td className="py-2"><div className="text-ink">{s.name}</div><div className="text-[12px] text-muted">{s.email}</div></td>
                <td className="text-ink-2">{method(s)}</td><td className="tabular-nums">{iso(s.createdAt)}</td><td>{ago(s.lastActive)}</td>
                <td className="text-right tabular-nums">{s.activeDays?.length || 0}</td><td className="text-right tabular-nums">{s.sessions || 0}</td><td className="text-right tabular-nums">{s.minutes || 0}</td>
                <td className="text-right tabular-nums">{s.lessons}</td><td className="text-right tabular-nums">{s.cases}</td><td className="text-right tabular-nums">{s.drills}</td><td className="text-right tabular-nums">{s.notes || 0}</td>
                <td className="pl-3 text-ink-2">{s.source || '—'}</td><td className="text-muted">{s.lastPath || '—'}</td>
              </tr>))}</tbody>
          </table>
          {!users.length && <p className="py-4 text-muted">No users yet.</p>}
        </div>
      </Section>
      <Section title="Visitors who don't sign in" className="mb-6">
        <p className="text-ink-2">Anonymous visits, top pages, countries and referrers are counted by Vercel Web Analytics (no cookies). Open the project in Vercel and choose the <b className="font-semibold">Analytics</b> tab.</p>
        <a href="https://vercel.com/dashboard" target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-[14px] font-medium text-violet-d hover:underline">Open Vercel ↗</a>
      </Section>
    </>
  )
}

export default function Admin() {
  const { backend } = useStore()
  const adminState = useIsAdminState()
  const isAdmin = adminState === true
  const [rows, setRows] = useState<StudentRecord[] | null>(null)
  const [stats, setStats] = useState<UserStats[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [updated, setUpdated] = useState(Date.now())
  useEffect(() => {
    if (!isAdmin || !backend) return
    const refused = () => setErr('The database refused access. Check firestore.rules has been published with your email as admin.')
    backend.listStudents().then(setRows).catch(refused)
    const stop = backend.watchStats((r) => { setStats(r); setUpdated(Date.now()) }, refused)
    return stop
  }, [isAdmin, backend])
  // re-render every 30s so "online now" and "x min ago" stay current
  const [, tick] = useState(0)
  useEffect(() => { const t = setInterval(() => tick((x) => x + 1), 30000); return () => clearInterval(t) }, [])
  const bySchool = useMemo(() => {
    const m = new Map<string, number>(); (rows || []).forEach((r) => m.set(r.school, (m.get(r.school) || 0) + 1))
    return [...m.entries()].sort((a, b) => b[1] - a[1])
  }, [rows])
  if (adminState === undefined) return <p className="text-muted">Checking access…</p>
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
      <PageHeader title="Admin" intro="Who signs up, how they use PrepForCase, and whether they come back. Updates live. Only you can see this page." />
      <Analytics stats={stats} students={rows} updated={updated} />
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3"><h2 className="text-[21px] font-semibold">Verified students</h2><Button onClick={exportCsv}>Export students CSV</Button></div>
      <dl className="mb-6 flex flex-wrap gap-x-10 gap-y-3">
        <div><dt className="text-[13px] text-muted">Verified students</dt><dd className="font-serif text-[26px] font-semibold text-ink">{rows.length}</dd></div>
        <div><dt className="text-[13px] text-muted">Agreed to marketing</dt><dd className="font-serif text-[26px] font-semibold text-ink">{optIn}</dd></div>
        <div><dt className="text-[13px] text-muted">Schools</dt><dd className="font-serif text-[26px] font-semibold text-ink">{bySchool.length}</dd></div>
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
