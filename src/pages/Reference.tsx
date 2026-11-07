import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FRAMEWORKS } from '../content/frameworks'
import { CORE } from '../content/frameworkTrees'
import { playbook } from '../content'
import { GLOSSARY } from '../content/glossary'
import { Button, PageHeader } from '../components/ui'
import { useScrollToTarget } from '../components/Learning'

export function CaseTypes() {
  return (
    <>
      <PageHeader title="Case types" intro="The 16 kinds of case you can get. For each: the question to ask first, the skeleton, the same skeleton tailored to a real case, and the trap to avoid. If you're new, learn the ten core frameworks first." />
      <p className="mb-5 text-[14.5px] text-ink-2">Not sure which type you're facing? Read the prompt, then ask: is the client trying to <b>fix</b> something (profits, costs, a process) or <b>decide</b> something (enter, launch, buy, invest, price)?</p>
      <ul className="grid gap-3 md:grid-cols-2">
        {FRAMEWORKS.map((f) => (
          <li key={f.slug}>
            <Link to={`/frameworks/${f.slug}`} className="block h-full rounded-xl border border-line bg-white p-4 hover:border-faint">
              <h2 className="font-sans text-[16px] font-semibold text-ink">{f.type}</h2>
              <p className="mt-0.5 text-[14px] text-muted">{f.when}</p>
              <p className="mt-1.5 text-[14px] text-ink-2"><span className="text-muted">Ask first:</span> {f.ask}</p>
              {f.core && <p className="mt-1.5 text-[13px] text-teal-d">Core tree: {CORE.find((c) => c.id === f.core)?.title}</p>}
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}

export function Formulas() {
  const [hide, setHide] = useState(false)
  const [open, setOpen] = useState<Record<number, boolean>>({})
  return (
    <>
      <PageHeader title="Formulas" intro="The 20 formulas that come up again and again in case maths. Learn them until you can say each one without thinking, then test yourself." action={<Button variant="secondary" onClick={() => { setHide((h) => !h); setOpen({}) }}>{hide ? 'Show all formulas' : 'Hide formulas to test myself'}</Button>} />
      {hide && <p className="mb-3 text-muted">Say each formula out loud, then click Reveal to check.</p>}
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {playbook.formulas.map((f, i) => (
          <div key={f.term} className="grid gap-1 border-b border-line px-5 py-3 last:border-0 sm:grid-cols-[200px_1fr_1fr] sm:gap-4">
            <div className="font-medium text-ink">{f.term}</div>
            <div>{hide && !open[i]
              ? <button onClick={() => setOpen((o) => ({ ...o, [i]: true }))} className="text-[14px] font-medium text-violet-d hover:underline">Reveal</button>
              : <span className="font-serif text-[16px] font-semibold text-ink">{f.formula}</span>}</div>
            <div className="text-[14px] text-muted">{f.note}</div>
          </div>
        ))}
      </div>
      <p className="mt-5 text-[14.5px] text-ink-2">Use them: <Link to="/drills?tab=maths" className="font-medium text-violet-d hover:underline">mental maths drill</Link> · <Link to="/learn/case-maths" className="font-medium text-violet-d hover:underline">case maths lesson</Link> · <Link to="/glossary" className="font-medium text-violet-d hover:underline">glossary</Link></p>
    </>
  )
}

export function Glossary() {
  useScrollToTarget()
  const [q, setQ] = useState('')
  const items = GLOSSARY.filter((g) => !q || `${g.term} ${g.plain}`.toLowerCase().includes(q.toLowerCase()))
  return (
    <>
      <PageHeader title="Glossary" intro="Business terms you'll meet in cases, in plain English, each with an example." />
      <input className="mb-4 w-full max-w-sm rounded-lg border border-line bg-white px-3 py-2 text-[15px]" placeholder="Search terms" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search the glossary" />
      <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
        {items.map((g) => (
          <div key={g.term} id={g.term.toLowerCase().replace(/[^a-z0-9]+/g, '-')} className="grid scroll-mt-24 gap-1 px-5 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-4">
            <dt className="font-serif text-[17px] font-semibold text-ink">{g.term}</dt>
            <dd><span className="text-ink-2">{g.plain}</span> <span className="block text-[14px] text-muted">For example: {g.example}</span></dd>
          </div>
        ))}
        {!items.length && <p className="px-5 py-4 text-muted">No match. Try a shorter word.</p>}
      </dl>
      <p className="mt-5 text-[14.5px] text-ink-2">See also: <Link to="/formulas" className="font-medium text-violet-d hover:underline">formulas</Link></p>
    </>
  )
}
