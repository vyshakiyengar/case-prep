import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { FRAMEWORKS, frameworkBySlug } from '../content/frameworks'
import { loadCases, playbook } from '../content'
import type { CaseDef } from '../content'
import { Button, LinkButton, PageHeader } from '../components/ui'
import { useStore } from '../lib/store'
import { TREES, SPLITS, FIND_OUT, BUILD_PARTNER_BUY } from '../content/frameworkTrees'
import { FrameworkBlock } from '../components/FrameworkTree'
import { Gate, StickyNav, useScrollToTarget } from '../components/Learning'
import { StructureTree } from '../components/CaseParts'
import { GLOSSARY } from '../content/glossary'

function Formulas() {
  const [hide, setHide] = useState(false)
  const [open, setOpen] = useState<Record<number, boolean>>({})
  return (
    <>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <p className="text-muted">Test yourself: hide the formulas, say each one out loud, then reveal it.</p>
        <Button variant="secondary" onClick={() => { setHide((h) => !h); setOpen({}) }}>{hide ? 'Show all formulas' : 'Hide formulas to test myself'}</Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {playbook.formulas.map((f, i) => (
          <div key={f.term} className="grid gap-1 border-b border-line px-5 py-3 last:border-0 sm:grid-cols-[180px_1fr_1fr] sm:gap-4">
            <div className="font-medium text-ink">{f.term}</div>
            <div>{hide && !open[i]
              ? <button onClick={() => setOpen((o) => ({ ...o, [i]: true }))} className="text-[14px] font-medium text-violet-d hover:underline">Reveal</button>
              : <span className="font-serif text-[16px] font-semibold text-ink">{f.formula}</span>}</div>
            <div className="text-[14px] text-muted">{f.note}</div>
          </div>
        ))}
      </div>
    </>
  )
}

const GUIDE = [
  ['Read the question', 'Is the client trying to fix something or decide something?'],
  ['Pick the closest tree', 'Use it as a starting point, not a script.'],
  ['Make it specific', 'Rename every branch for this client, product and market.'],
  ['Say where you\'d start', 'Name the branch you\'d test first, and why.'],
]

export function FrameworksIndex() {
  const { user } = useStore()
  useScrollToTarget()
  const free = TREES.slice(0, 2), locked = TREES.slice(2)
  const nav = [
    ...TREES.map((t, i) => ({ id: t.id, label: t.title.replace(/ \(.*\)/, ''), locked: !user && i >= 2 })),
    { id: 'toolkit', label: 'Brainstorming toolkit' }, { id: 'case-types', label: 'All 16 case types' },
    { id: 'formulas', label: 'Formulas' }, { id: 'glossary', label: 'Glossary' },
  ]
  return (
    <>
      <PageHeader title="Frameworks" intro="Ten tree diagrams for the cases you'll meet most, then a brainstorming toolkit, the formulas and a glossary. Learn the shape of each tree, then build your own version for the client in front of you. Never recite one word for word." />
      <ol className="mb-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {GUIDE.map(([t, d], i) => (
          <li key={t} className="rounded-lg border border-line bg-white px-4 py-3">
            <div className="text-[14px] font-semibold text-ink"><span className="mr-1.5 text-teal-d">{i + 1}</span>{t}</div>
            <p className="mt-0.5 text-[13.5px] text-muted">{d}</p>
          </li>
        ))}
      </ol>
      <StickyNav items={nav} gateId="frameworks-gate" />
      <div className="space-y-14">
        {free.map((f, i) => <FrameworkBlock key={f.id} f={f} n={i + 1} />)}
        <Gate id="frameworks-gate" title="Sign in to see all ten trees" body="Market entry, new products, acquisitions, competitive response, cost reduction, pricing, investment and market sizing. Free.">
          <div className="space-y-14">{locked.map((f, i) => <FrameworkBlock key={f.id} f={f} n={i + 3} />)}</div>
        </Gate>

        <section id="toolkit" className="scroll-mt-32">
          <h2 className="text-[26px] font-semibold">Brainstorming toolkit</h2>
          <p className="mt-1 text-muted">When the interviewer asks "what else could they do?", you still need buckets. These simple splits work for almost any question.</p>
          <ul className="mt-4 flex flex-wrap gap-2">{SPLITS.map((s) => <li key={s} className="rounded-full border border-teal bg-white px-3 py-1.5 text-[14px] text-ink">{s}</li>)}</ul>
          <h3 className="mt-7 text-[19px] font-semibold">"How would you find that out?"</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-3">
            {FIND_OUT.map((b) => (
              <div key={b.head} className="rounded-lg border border-line bg-white p-4">
                <div className="text-[14.5px] font-semibold text-ink">{b.head}</div>
                <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[14px] text-ink-2">{b.c.map((x) => <li key={x}>{x}</li>)}</ul>
              </div>
            ))}
          </div>
          <h3 className="mt-7 text-[19px] font-semibold">Build, partner or buy?</h3>
          <div className="mt-3 overflow-x-auto rounded-xl border border-line bg-white">
            <table className="w-full min-w-[560px] text-left text-[14px]">
              <thead><tr className="border-b border-line text-[12.5px] text-muted"><th className="px-4 py-2 font-medium">Route</th><th className="px-4 py-2 font-medium">Good because</th><th className="px-4 py-2 font-medium">Watch out for</th></tr></thead>
              <tbody>{BUILD_PARTNER_BUY.map((r) => <tr key={r.way} className="border-b border-line last:border-0"><td className="px-4 py-2.5 font-semibold text-ink">{r.way}</td><td className="px-4 py-2.5 text-ink-2">{r.pros}</td><td className="px-4 py-2.5 text-ink-2">{r.cons}</td></tr>)}</tbody>
            </table>
          </div>
        </section>

        <section id="case-types" className="scroll-mt-32">
          <h2 className="text-[26px] font-semibold">All 16 case types: what to ask first</h2>
          <p className="mt-1 mb-4 text-muted">Open any one for its skeleton, the same skeleton tailored to a real case, and the trap to avoid.</p>
          <ul className="grid gap-3 md:grid-cols-2">
            {FRAMEWORKS.map((f) => (
              <li key={f.slug}>
                <Link to={`/frameworks/${f.slug}`} className="block h-full rounded-xl border border-line bg-white p-4 hover:border-faint">
                  <h3 className="font-sans text-[16px] font-semibold text-ink">{f.type}</h3>
                  <p className="mt-0.5 text-[14px] text-muted">{f.when}</p>
                  <p className="mt-1.5 text-[14px] text-ink-2"><span className="text-muted">Ask first:</span> {f.ask}</p>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section id="formulas" className="scroll-mt-32">
          <h2 className="mb-3 text-[26px] font-semibold">Formulas</h2>
          <Formulas />
        </section>

        <section id="glossary" className="scroll-mt-32">
          <h2 className="mb-3 text-[26px] font-semibold">Glossary</h2>
          <dl className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
            {GLOSSARY.map((g) => (
              <div key={g.term} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[190px_1fr] sm:gap-4">
                <dt className="font-serif text-[17px] font-semibold text-ink">{g.term}</dt>
                <dd><span className="text-ink-2">{g.plain}</span> <span className="block text-[14px] text-muted">For example: {g.example}</span></dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </>
  )
}

export default function Framework() {
  const { slug } = useParams()
  const f = frameworkBySlug(slug || '')
  const [cases, setCases] = useState<CaseDef[] | null>(null)
  useEffect(() => { loadCases().then(setCases) }, [])
  if (!f) return <Navigate to="/frameworks" replace />
  const linked = (cases || []).filter((c) => f.cases.includes(c.slug))
  const tailored = linked[0]
  const i = FRAMEWORKS.indexOf(f)
  return (
    <div className="max-w-4xl">
      <Link to="/frameworks#case-types" className="text-[13.5px] text-muted hover:text-ink">Frameworks</Link>
      <h1 className="mt-1 text-[34px] leading-tight font-semibold">{f.type}</h1>
      <p className="mt-1 text-[17px] text-muted">{f.when}</p>

      <section className="mt-7">
        <h2 className="text-[22px] font-semibold">1. Ask this first</h2>
        <p className="mt-1 rounded-lg bg-violet-l px-4 py-3 font-serif text-[17px] text-ink">"{f.ask}"</p>
        <p className="mt-2 text-[14.5px] text-muted">The answer usually decides which branch of your structure matters most.</p>
      </section>

      <section className="mt-8">
        <h2 className="text-[22px] font-semibold">2. The skeleton</h2>
        <p className="mt-1 mb-3 text-muted">These are the raw building blocks. In an interview, rename every branch for the client in front of you.</p>
        {f.mode === 'steps' ? (
          <ol className="flex flex-wrap items-center gap-2">
            {f.steps.map((s, k) => (
              <li key={k} className="flex items-center gap-2">
                <span className="rounded-lg border border-teal bg-white px-3 py-2 text-[14.5px] text-ink"><span className="mr-1.5 font-semibold text-teal-d">{k + 1}</span>{s}</span>
                {k < f.steps.length - 1 && <span className="text-faint" aria-hidden>→</span>}
              </li>
            ))}
          </ol>
        ) : <StructureTree s={{ root: `${f.type}: the generic skeleton`, branches: f.branches }} />}
      </section>

      {tailored && (
        <section className="mt-8">
          <h2 className="text-[22px] font-semibold">3. The same skeleton, tailored to a real case</h2>
          <p className="mt-1 text-muted">From case {tailored.id}, {tailored.title}: <i>{tailored.sub.replace(/[?.]$/, '')}</i>. Compare the branch names with the skeleton above: each one now says something about this client.</p>
          <div className="mt-3"><StructureTree s={tailored.structure} /></div>
          <p className="mt-3 rounded-lg bg-violet-l px-4 py-3 text-[14.5px] text-ink"><b className="font-semibold">Then a hypothesis:</b> {tailored.hypothesis}</p>
        </section>
      )}

      <section className="mt-8">
        <h2 className="text-[22px] font-semibold">{tailored ? '4' : '3'}. The trap to avoid</h2>
        <p className="mt-1 rounded-lg border border-signal bg-signal-l px-4 py-3 text-[16px] text-signal-d">{f.trap}</p>
      </section>

      <section className="mt-8 flex flex-wrap gap-3 border-t border-line pt-6">
        {linked.map((c) => <LinkButton key={c.slug} to={`/casebook/${c.slug}`}>Practise: case {c.id}, {c.title}</LinkButton>)}
        <LinkButton to="/drills?tab=structure" variant="secondary">Structuring drills</LinkButton>
      </section>
      <nav className="mt-8 flex justify-between gap-4 text-[14.5px]">
        {FRAMEWORKS[i - 1] ? <Link className="text-muted hover:text-ink" to={`/frameworks/${FRAMEWORKS[i - 1].slug}`}>Previous: {FRAMEWORKS[i - 1].type}</Link> : <span />}
        {FRAMEWORKS[i + 1] && <Link className="font-medium text-ink hover:underline" to={`/frameworks/${FRAMEWORKS[i + 1].slug}`}>Next: {FRAMEWORKS[i + 1].type}</Link>}
      </nav>
    </div>
  )
}
