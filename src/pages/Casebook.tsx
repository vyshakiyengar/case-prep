import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadCases, DIFF_LABEL } from '../content'
import type { CaseDef } from '../content'
import { useStore } from '../lib/store'
import { PageHeader } from '../components/ui'
import { Loading } from '../App'

const DIFF_TONE = { 1: 'bg-teal-l text-teal-d', 2: 'bg-marker-l text-[#8A6A12]', 3: 'bg-signal-l text-signal-d' } as const

/** Difficulty as a small coloured tag: Easy, Medium or Hard. */
export function Difficulty({ d }: { d: 1 | 2 | 3 }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[12px] font-medium ${DIFF_TONE[d]}`}>
      <span className="flex gap-[2px]" aria-hidden>{[1, 2, 3].map((i) => <span key={i} className={`h-1.5 w-1.5 rounded-full ${i <= d ? 'bg-current' : 'bg-current opacity-25'}`} />)}</span>
      {DIFF_LABEL[d]}
    </span>
  )
}

function Chips<T extends string | number>({ label, value, options, onChange }: { label: string; value: T; options: { v: T; label: string; n?: number }[]; onChange: (v: T) => void }) {
  return (
    <div className="-mx-1 flex items-center gap-1.5 overflow-x-auto px-1 pb-0.5 [scrollbar-width:none] sm:flex-wrap sm:overflow-visible" role="group" aria-label={label}>
      <span className="mr-1 shrink-0 text-[13px] text-muted">{label}</span>
      {options.map((o) => (
        <button key={String(o.v)} onClick={() => onChange(o.v)} aria-pressed={value === o.v}
          className={`shrink-0 rounded-full border px-3 py-1 text-[13px] transition-colors ${value === o.v ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-faint'}`}>
          {o.label}{o.n !== undefined && <span className={`ml-1.5 tabular-nums ${value === o.v ? 'text-white/80' : 'text-muted'}`}>{o.n}</span>}
        </button>
      ))}
    </div>
  )
}

type Diff = 0 | 1 | 2 | 3
type Status = 'all' | 'todo' | 'done'

export default function Casebook() {
  const { data, user, markCase } = useStore()
  const [cases, setCases] = useState<CaseDef[] | null>(null)
  const [type, setType] = useState('All')
  const [diff, setDiff] = useState<Diff>(0)
  const [status, setStatus] = useState<Status>('all')
  const [q, setQ] = useState('')
  useEffect(() => { loadCases().then(setCases) }, [])
  if (!cases) return <Loading label="Loading cases…" />
  const logged = new Set((data?.cases || []).map((c) => c.name.toLowerCase()))
  const marked = new Set(data?.profile?.practised || [])
  const isDone = (c: CaseDef) => marked.has(c.slug) || logged.has(c.title.toLowerCase())
  const types = ['All', ...Array.from(new Set(cases.map((c) => c.type))).sort()]
  const match = (c: CaseDef, ignore?: 'diff' | 'status') =>
    (type === 'All' || c.type === type) && (ignore === 'diff' || !diff || c.diff === diff) &&
    (ignore === 'status' || status === 'all' || (status === 'done') === isDone(c)) &&
    (!q || `${c.title} ${c.sub} ${c.industry} ${c.geo}`.toLowerCase().includes(q.toLowerCase()))
  const shown = cases.filter((c) => match(c))
  const doneCount = cases.filter(isDone).length
  return (
    <>
      <PageHeader title="Casebook" intro={`${cases.length} original practice cases. Do one alone with the timer, or give one to a friend and swap.`}
        action={user ? <span className="text-[14px] text-muted"><b className="font-serif text-[19px] font-normal text-ink">{doneCount}</b> of {cases.length} practised</span> : undefined} />
      <p className="mb-5 rounded-lg border border-teal bg-teal-l/50 px-4 py-3 text-[14.5px] text-ink">New to cases? Do the first three lessons of the course, then pick an <button onClick={() => { setDiff(1); setStatus('todo') }} className="font-medium underline">easy case you haven't done</button>.</p>

      <div className="mb-5 space-y-3 rounded-lg border border-line bg-white p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Chips label="Level" value={diff} onChange={setDiff} options={[
            { v: 0, label: 'All' }, ...([1, 2, 3] as const).map((d) => ({ v: d as Diff, label: DIFF_LABEL[d], n: cases.filter((c) => c.diff === d && match(c, 'diff')).length }))]} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search company or industry" aria-label="Search cases"
            className="w-full max-w-60 rounded-lg border border-line bg-white px-3 py-1.5 text-[14px] focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15" />
        </div>
        {user && <Chips label="Status" value={status} onChange={setStatus} options={[
          { v: 'all', label: 'All' }, { v: 'todo', label: 'Not practised', n: cases.filter((c) => !isDone(c) && match(c, 'status')).length },
          { v: 'done', label: 'Practised', n: cases.filter((c) => isDone(c) && match(c, 'status')).length }]} />}
        <div className="flex flex-wrap items-center gap-2">
          <label htmlFor="case-type" className="text-[13px] text-muted">Type</label>
          <select id="case-type" value={type} onChange={(e) => setType(e.target.value)} className="rounded-lg border border-line bg-white px-2.5 py-1.5 text-[14px] text-ink">
            {types.map((t) => <option key={t} value={t}>{t === 'All' ? 'All types' : `${t} (${cases.filter((c) => c.type === t).length})`}</option>)}
          </select>
          {(type !== 'All' || diff || status !== 'all' || q) ? <button onClick={() => { setType('All'); setDiff(0); setStatus('all'); setQ('') }} className="text-[13px] text-muted underline hover:text-ink">Clear filters</button> : null}
          <span className="ml-auto text-[13px] text-muted">{shown.length} case{shown.length === 1 ? '' : 's'}</span>
        </div>
      </div>

      <ol className="divide-y divide-line overflow-hidden rounded-lg border border-line bg-white">
        {shown.map((c) => {
          const done = isDone(c)
          return (
            <li key={c.slug} className="grid grid-cols-[36px_1fr] items-start gap-x-3 gap-y-2.5 px-4 py-3.5 sm:grid-cols-[44px_1fr_auto] sm:items-center sm:px-5 sm:py-4">
              {user ? (
                <button onClick={() => markCase(c.slug, !marked.has(c.slug))} aria-pressed={done} aria-label={done ? `${c.title}: practised (click to unmark)` : `Mark ${c.title} as practised`} title={done ? 'Practised. Click to unmark.' : 'Mark as practised'}
                  className={`flex h-8 w-8 items-center justify-center rounded-full border transition-colors sm:h-9 sm:w-9 ${done ? 'border-good bg-good text-white' : 'border-line text-muted hover:border-good hover:text-good'}`}>
                  {done ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12 5 5 9-10" /></svg>
                    : <span className="font-serif text-[14.5px] tabular-nums">{c.id}</span>}
                </button>
              ) : <span className="pt-0.5 font-serif text-[17px] text-muted tabular-nums">{c.id}</span>}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <h2 className="text-[16.5px]">{c.title}</h2>
                  <Difficulty d={c.diff} />
                  {done && <span className="rounded-full bg-good-l px-2 py-0.5 text-[12px] font-medium text-good">Practised</span>}
                </div>
                <p className="text-[14.5px] leading-snug text-ink-2">{c.sub}</p>
                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                  <span>{c.type}</span><span>{c.industry}</span><span>{c.geo}</span><span>{c.time}</span>
                </div>
              </div>
              <div className="col-start-2 flex gap-2 sm:col-start-auto">
                <Link to={`/casebook/${c.slug}`} className="btn-primary rounded-lg px-3.5 py-2 text-[14px] font-medium text-white">Practise</Link>
                <Link to={`/casebook/${c.slug}?mode=interviewer`} className="rounded-lg border border-line bg-white px-3.5 py-2 text-[14px] font-medium text-ink hover:border-faint">Be the interviewer</Link>
              </div>
            </li>
          )
        })}
      </ol>
      {!shown.length && <p className="mt-4 text-muted">No cases match. <button className="underline" onClick={() => { setType('All'); setDiff(0); setStatus('all'); setQ('') }}>Clear filters</button></p>}
    </>
  )
}
