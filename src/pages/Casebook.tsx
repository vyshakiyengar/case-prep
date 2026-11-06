import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { loadCases, DIFF_LABEL } from '../content'
import type { CaseDef } from '../content'
import { useStore } from '../lib/store'
import { PageHeader } from '../components/ui'
import { Loading } from '../App'

export function Difficulty({ d }: { d: 1 | 2 | 3 }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[13px] text-muted" title={DIFF_LABEL[d]}>
      <span className="flex gap-0.5" aria-hidden>{[1, 2, 3].map((i) => <span key={i} className={`h-2 w-2 rounded-full ${i <= d ? 'bg-ink' : 'bg-line'}`} />)}</span>
      {DIFF_LABEL[d]}
    </span>
  )
}

export default function Casebook() {
  const { data } = useStore()
  const [cases, setCases] = useState<CaseDef[] | null>(null)
  const [filter, setFilter] = useState('All')
  useEffect(() => { loadCases().then(setCases) }, [])
  if (!cases) return <Loading label="Loading cases…" />
  const types = ['All', ...Array.from(new Set(cases.map((c) => c.type)))]
  const done = new Set(data!.cases.map((c) => c.name.toLowerCase()))
  const shown = cases.filter((c) => filter === 'All' || c.type === filter)
  return (
    <>
      <PageHeader title="Casebook" intro="15 original cases with exhibits and model answers. Practise alone with a timer, or play the interviewer for a partner and then swap." />
      <div className="mb-4 flex flex-wrap gap-1.5" role="group" aria-label="Filter by case type">
        {types.map((t) => (
          <button key={t} onClick={() => setFilter(t)} aria-pressed={filter === t}
            className={`rounded-full border px-3 py-1 text-[13px] ${filter === t ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted hover:text-ink'}`}>{t}</button>
        ))}
      </div>
      <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {shown.map((c) => (
          <li key={c.slug} className="grid gap-3 px-5 py-4 sm:grid-cols-[44px_1fr_auto] sm:items-center">
            <span className="font-serif text-[22px] font-semibold text-faint tabular-nums">{c.id}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3">
                <h2 className="text-[19px] font-semibold">{c.title}</h2>
                {done.has(c.title.toLowerCase()) && <span className="rounded-full bg-good-l px-2 py-0.5 text-[12px] font-medium text-good">Logged</span>}
              </div>
              <p className="text-ink-2">{c.sub}</p>
              <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
                <span>{c.type}</span><span>{c.industry}</span><Difficulty d={c.diff} /><span>{c.time}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <Link to={`/casebook/${c.slug}`} className="rounded-lg bg-ink px-3.5 py-2 text-[14px] font-medium text-white hover:bg-[#22325A]">Practise</Link>
              <Link to={`/casebook/${c.slug}?mode=interviewer`} className="rounded-lg border border-line bg-white px-3.5 py-2 text-[14px] font-medium text-ink hover:border-faint">Give this case</Link>
            </div>
          </li>
        ))}
      </ol>
    </>
  )
}
