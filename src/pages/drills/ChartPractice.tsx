import { ArtCharts } from '../../components/Art'
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { todayIso, uid } from '../../lib/dates'
import { FAMILIES, makeChartQ } from '../../lib/chartDrills'
import type { ChartQ } from '../../lib/chartDrills'
import { parseAnswer } from '../../lib/speedMaths'
import { loadCases } from '../../content'
import type { CaseDef, CaseQuestion } from '../../content'
import { ExhibitView, Rich } from '../../components/CaseParts'
import { DrillChart } from '../../components/DrillChart'
import { Button, PageHeader, ScorePicker, Section } from '../../components/ui'
import { Countdown } from '../../components/Timer'
import { DrillCrumbs, StartCard, readBest, writeBest, Tally } from './shared'

const SET = 8, SECS = 60
type Fam = ChartQ['family'] | 'All'

function mark(q: ChartQ, raw: string): boolean {
  if (q.answer === undefined) return false
  const v = parseAnswer(raw, { label: q.unit || '', scale: q.unit === '$M' ? 1e6 : 1, pct: q.unit === '%' })
  if (v === null) return false
  if (Math.abs(v - q.answer) <= (q.tol ?? 0.01) + 1e-9) return true
  return q.unit === '%' && Math.abs(v) <= 1.5 && !raw.includes('%') && Math.abs(v * 100 - q.answer) <= (q.tol ?? 0.01)
}

function QuickReads({ fam }: { fam: Fam }) {
  const { addDrill, user } = useStore()
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>('setup')
  const [q, setQ] = useState<ChartQ | null>(null)
  const [log, setLog] = useState<{ q: ChartQ; ok: boolean; given: string }[]>([])
  const [guess, setGuess] = useState('')
  const [picked, setPicked] = useState<number | null>(null)
  const [fb, setFb] = useState<null | { ok: boolean; timeout?: boolean }>(null)
  const [best, setBest] = useState<number | null>(null)
  const saved = useRef(false)
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => { setBest(readBest('charts', fam)) }, [fam])
  const next = () => {
    setQ(makeChartQ(fam === 'All' ? undefined : fam)); setGuess(''); setPicked(null); setFb(null)
    setTimeout(() => input.current?.focus(), 0)
  }
  const start = () => { setLog([]); saved.current = false; setPhase('run'); next() }
  useEffect(() => { start() }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const record = useCallback((ok: boolean, given: string, timeout = false) => {
    if (!q || fb) return
    setFb({ ok, timeout }); setLog((l) => [...l, { q, ok, given }])
  }, [q, fb])
  const finish = () => {
    setPhase('done')
    if (saved.current) return
    saved.current = true
    const right = log.filter((d) => d.ok).length
    const prev = readBest('charts', fam)
    if (prev === null || right > prev) { writeBest('charts', fam, right); setBest(right) }
    const breakdown: Record<string, [number, number]> = {}
    for (const d of log) { const b = breakdown[d.q.family] || [0, 0]; breakdown[d.q.family] = [b[0] + (d.ok ? 1 : 0), b[1] + 1] }
    if (user) addDrill({ id: uid(), kind: 'charts', mode: 'quick', prompt: `Chart quick reads (${fam})`, total: log.length, right, breakdown, seconds: 0, date: todayIso(), createdAt: Date.now() }).catch(() => {})
  }
  const onTimeout = useCallback(() => record(false, '', true), [record])

  if (phase === 'setup') return null

  if (phase === 'done') {
    const right = log.filter((d) => d.ok).length
    return (
      <div className="max-w-3xl">
        <div className="graph-paper rounded-lg border border-line p-5 text-center sm:p-5">
          <p className="text-[14px] text-muted">Your score</p>
          <p className="font-serif text-[40px] leading-none font-semibold text-ink">{right}<span className="text-[22px] text-muted"> / {log.length}</span></p>
          {log.length > 0 && <Tally results={log.map((d) => d.ok)} />}
          <p className="mt-2 text-ink-2">{right === log.length ? 'Every one right.' : right >= log.length * 0.75 ? 'Strong. Check the ones you missed below.' : 'Check the units, and what each percentage is a percentage of.'}</p>
          <div className="mt-5 flex flex-wrap justify-center gap-2"><Button onClick={start}>Another round</Button></div>
          {best !== null && <p className="mt-3 text-[13.5px] text-muted">Your best: {best} of {SET}</p>}
        </div>
        {log.some((d) => !d.ok) && <section className="mt-6"><h2 className="text-[17.5px]">The ones you missed</h2><ul className="mt-3 space-y-3">{log.filter((d) => !d.ok).map((d) => <li key={d.q.id} className="rounded-lg border border-line bg-white p-4"><p className="font-medium text-ink">{d.q.chart.title}: {d.q.q}</p><p className="mt-1 text-[14px] text-ink-2">Answer: <b className="font-semibold text-ink">{d.q.show}</b>. {d.q.why}</p></li>)}</ul></section>}
      </div>
    )
  }

  if (!q) return null
  const last = log.length >= SET
  return (
    <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
      <div className="min-w-0 rounded-lg border border-line bg-white p-4 sm:p-5">
        <p className="mb-3 text-[13px] text-muted">Exhibit {Math.min(log.length + (fb ? 0 : 1), SET)} of {SET} · {q.family}</p>
        <DrillChart spec={q.chart} />
        <p className="mt-2 text-[12.5px] text-muted">Fictional data, generated for practice.</p>
      </div>
      <div className="space-y-4">
        {!fb && <Countdown key={q.id} seconds={SECS} label="Time left" autoStart onEnd={onTimeout} />}
        <div className={`rounded-lg border p-4 ${fb ? (fb.ok ? 'border-good' : 'border-signal') : 'border-line'} bg-white`}>
          <p className="text-[13.5px] text-muted">{q.context}</p>
          <p className="mt-1 text-[16px] font-medium text-ink">{q.q}</p>
          {q.options ? (
            <div className="mt-3 grid gap-2">
              {q.options.map((o, i) => (
                <button key={o} type="button" disabled={!!fb} onClick={() => { setPicked(i); record(i === q.correct, o) }}
                  className={`rounded-lg border px-3 py-2 text-left text-[14.5px] transition-colors ${!fb ? 'border-line hover:border-ink' : i === q.correct ? 'border-good bg-good-l/50 font-medium' : picked === i ? 'border-signal' : 'border-line opacity-70'}`}>{o}</button>
              ))}
            </div>
          ) : (
            <form className="mt-3 flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); if (fb) { if (last) finish(); else next() } else if (guess.trim()) record(mark(q, guess), guess) }}>
              <div className="flex items-center rounded-lg border border-line bg-white focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
                <input ref={input} aria-label="Your answer" value={guess} onChange={(e) => setGuess(e.target.value)} readOnly={!!fb} inputMode="decimal" autoComplete="off" className="w-32 rounded-lg bg-transparent px-3 py-2 text-[16px] tabular-nums outline-none" placeholder="Answer" />
                <span className="pr-3 text-[14px] text-muted">{q.unit}</span>
              </div>
              {!fb && <Button type="submit">Check</Button>}
            </form>
          )}
          {fb && (
            <div className="mt-3 border-t border-line pt-3" role="status">
              <p className={`text-[14.5px] font-semibold ${fb.ok ? 'text-good' : 'text-signal'}`}>{fb.ok ? 'Right.' : fb.timeout ? 'Out of time.' : 'Not quite.'} <span className="font-normal text-ink">Answer: <b className="font-semibold">{q.show}</b></span></p>
              <p className="mt-1 text-[14px] text-ink-2">{q.why}</p>
              <Button className="mt-3" onClick={() => (last ? finish() : next())}>{last ? 'See results' : 'Next exhibit'}</Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

/** Real exhibits from the casebook: find the insight in 90 seconds, then compare. */
function Insight() {
  const { addDrill, user } = useStore()
  const [items, setItems] = useState<{ c: CaseDef; q: CaseQuestion }[] | null>(null)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'running' | 'review'>('running')
  const [score, setScore] = useState<number>()
  useEffect(() => {
    loadCases().then((cs) => setItems(cs.flatMap((c) => c.questions.filter((q) => q.exhibit).map((q) => ({ c, q }))).sort(() => Math.random() - 0.5)))
  }, [])
  const end = useCallback(() => setPhase('review'), [])
  if (!items) return <p className="text-muted">Loading exhibits…</p>
  const it = items[n % items.length]
  const save = async () => {
    if (user && score) await addDrill({ id: uid(), kind: 'charts', mode: 'insight', prompt: `${it.c.title}: ${it.q.q}`, seconds: 90, score, date: todayIso(), createdAt: Date.now() }).catch(() => {})
    setN((x) => x + 1); setPhase('running'); setScore(undefined)
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0 rounded-lg border border-line bg-white p-5">
        <p className="text-[13px] text-muted">Exhibit {n + 1} of {items.length}, from case {it.c.id}: {it.c.title}</p>
        <p className="mt-2 text-[14.5px] text-ink-2"><span className="font-medium text-ink">Context:</span> {it.c.sub} {it.q.q}</p>
        {it.q.exhibit && <ExhibitView ex={it.q.exhibit} />}
        {phase === 'review' && (
          <div className="mt-2 rounded-lg border border-good/40 p-4">
            <p className="mb-1 text-[13px] font-semibold text-good">A strong answer</p>
            <Rich html={it.q.answer} />
            <div className="mt-4 flex flex-wrap items-center gap-3"><span className="text-[14px] font-medium text-ink">How close was yours? (optional)</span><ScorePicker label="Self score" value={score} onChange={setScore} /></div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {phase === 'running' && <><Countdown key={n} seconds={90} label="Time left" autoStart onEnd={end} /><Button className="w-full py-3" onClick={() => setPhase('review')}>I'm done: show the answer</Button></>}
        {phase === 'review' && <Button className="w-full py-3" onClick={save}>Next exhibit</Button>}
        <Section title="What to say">
          <ol className="list-decimal space-y-1 pl-5 text-[14px] text-ink-2">
            <li>Read the title, axes, units and footnote.</li>
            <li>Find the one thing that matters: the biggest number, the biggest change, the outlier.</li>
            <li>Put a number on it.</li>
            <li>Link it to the client's goal.</li>
            <li>Say where you'd go next.</li>
          </ol>
          <Link to="/learn/charts-and-exhibits" className="mt-3 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Lesson: reading charts and exhibits</Link>
        </Section>
      </div>
    </div>
  )
}

export default function ChartPractice() {
  const [params, setParams] = useSearchParams()
  const m = params.get('mode')
  const mode = m === 'quick' ? 'quick' : m === 'insight' ? 'insight' : null
  const [fam, setFam] = useState<Fam>('All')
  const go = (x: 'quick' | 'insight' | null) => setParams(x ? { mode: x } : {})
  return (
    <>
      <DrillCrumbs here="Reading charts" />
      {mode === null && <PageHeader title="Reading charts" art={<ArtCharts />} intro="Read a chart fast and find the number that matters." />}
      {mode === null && (
        <>
          <div className="grid max-w-5xl gap-4 md:grid-cols-2">
            <StartCard title="Quick chart questions" tag="Start here" onStart={() => go('quick')}
              body="One chart, one question, marked straight away."
              example={<>"What share of revenue comes from the North?"</>}
              meta={`${SET} charts · 60 seconds each`} />
            <StartCard title="Exhibits from the casebook" onStart={() => go('insight')}
              body="Say the so-what of a casebook exhibit out loud, then compare."
              meta="90 seconds each" />
          </div>
          <details className="mt-4 max-w-5xl rounded-lg border border-line bg-white px-5 py-3">
            <summary className="cursor-pointer text-[14.5px] font-medium text-ink">Options: practise one chart type</summary>
            <div className="flex flex-wrap gap-2 py-3" role="group" aria-label="Chart type">
              {(['All', ...FAMILIES] as Fam[]).map((f) => <button key={f} onClick={() => setFam(f)} aria-pressed={fam === f}
                className={`rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${fam === f ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-faint'}`}>{f === 'All' ? 'All types' : f}</button>)}
            </div>
            <p className="pb-2 text-[13.5px] text-muted">For a slower look at every kind of chart, with an explanation of each, use the <Link to="/graphs" className="font-medium text-violet-d hover:underline">graph library</Link>.</p>
          </details>
        </>
      )}
      {mode !== null && (
        <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line pb-3">
          <h1 className="text-[22px] leading-tight sm:text-[26px]">{mode === 'quick' ? `Quick chart questions${fam !== 'All' ? `: ${fam}` : ''}` : 'Exhibits from the casebook'}</h1>
          <button className="text-[14px] font-medium text-violet-d hover:underline" onClick={() => go(mode === 'quick' ? 'insight' : 'quick')}>{mode === 'quick' ? 'Switch to: exhibits from the casebook' : 'Switch to: quick chart questions'}</button>
          <button className="text-[14px] text-muted hover:text-ink" onClick={() => go(null)}>Back</button>
        </div>
      )}
      {mode === 'quick' && <QuickReads fam={fam} />}
      {mode === 'insight' && <Insight />}
    </>
  )
}
