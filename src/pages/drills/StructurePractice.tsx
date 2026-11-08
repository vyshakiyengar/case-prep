import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { todayIso, uid } from '../../lib/dates'
import { FLAW_LABEL } from '../../content/structureDrills'
import { ALL_PICKS as STRUCTURE_PICKS, ALL_PROMPTS as STRUCTURE_PROMPTS } from '../../content/structureBank'
import type { StructPrompt } from '../../content/structureDrills'
import { Button, inputCls, PageHeader, Section } from '../../components/ui'
import { Countdown } from '../../components/Timer'
import { DrillCrumbs, StartCard } from './shared'

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
const CHECKS = [
  'Three or four buckets, each a different part of the problem (no overlaps)',
  'Nothing big missing: together the buckets cover the question',
  'Specific to this client and industry, not a generic list',
  'Each bucket can be measured or tested with data',
  'I said where I would start, and why',
]

function Tree({ p }: { p: StructPrompt }) {
  return (
    <div className="overflow-x-auto">
      <div className="grid min-w-[520px] gap-2" style={{ gridTemplateColumns: `repeat(${p.tree.length}, minmax(0,1fr))` }}>
        {p.tree.map((b) => (
          <div key={b.head} className="rounded-lg border border-line bg-white p-3">
            <p className="text-[14.5px] font-semibold text-ink">{b.head}</p>
            <ul className="mt-1.5 space-y-1 text-[13.5px] text-ink-2">{b.items.map((i) => <li key={i} className="border-l-2 border-teal/40 pl-2">{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </div>
  )
}

function Build() {
  const { addDrill, user } = useStore()
  const order = useMemo(() => shuffle(STRUCTURE_PROMPTS), [])
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'running' | 'review'>('running')
  const [notes, setNotes] = useState('')
  const [ticks, setTicks] = useState<boolean[]>(CHECKS.map(() => false))
  const left = useRef(120)
  const p = order[n % order.length]
  const end = useCallback(() => setPhase('review'), [])
  const tick = useCallback((l: number) => { left.current = l }, [])
  const score = ticks.filter(Boolean).length
  const nextPrompt = async () => {
    if (user && score) await addDrill({ id: uid(), kind: 'structure', mode: 'build', prompt: p.prompt, seconds: 120 - Math.max(0, left.current), score, date: todayIso(), createdAt: Date.now() }).catch(() => {})
    setN((x) => x + 1); setPhase('running'); setNotes(''); setTicks(CHECKS.map(() => false)); left.current = 120
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0 graph-paper rounded-xl border border-line p-5 sm:p-6">
        <p className="text-[13px] text-muted">Problem {n + 1} · {p.type}</p>
        <p className="mt-1 font-serif text-[24px] leading-snug font-semibold text-ink">{p.prompt}</p>
        <label className="mt-5 mb-1.5 block text-[13.5px] text-muted" htmlFor="st-notes">Your structure: 3 or 4 main buckets, then a line or two under each</label>
        <textarea id="st-notes" className={`${inputCls} bg-white/90`} rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={phase === 'review'}
          placeholder={'1. …\n2. …\n3. …\nI would start with … because …'} />
        {phase === 'review' && (
          <div className="mt-5 space-y-4">
            <div>
              <p className="mb-2 text-[13.5px] font-semibold text-teal-d">A strong answer</p>
              <Tree p={p} />
            </div>
            <p className="text-[14.5px] text-ink-2"><b className="font-semibold text-ink">Where to start:</b> {p.start}</p>
            <p className="text-[14.5px] text-ink-2"><b className="font-semibold text-ink">The usual mistake:</b> {p.trap}</p>
            {p.framework && <Link to={`/frameworks/${p.framework}`} className="inline-block text-[14px] font-medium text-violet-d hover:underline">See the framework this builds on</Link>}
            <fieldset className="rounded-lg border border-line bg-white p-4">
              <legend className="px-1 text-[14px] font-medium text-ink">Now mark yours: tick what's true</legend>
              <ul className="space-y-2">
                {CHECKS.map((c, i) => (
                  <li key={c}><label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-ink-2">
                    <input type="checkbox" className="mt-0.5 h-4 w-4 accent-teal" checked={ticks[i]} onChange={() => setTicks((t) => t.map((x, j) => (j === i ? !x : x)))} />{c}
                  </label></li>
                ))}
              </ul>
              <p className="mt-3 text-[14px] text-ink">Your score: <b className="font-semibold">{score} / 5</b></p>
            </fieldset>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {phase === 'running' ? <>
          <Countdown key={n} seconds={120} label="Time left" autoStart onEnd={end} onTick={tick} />
          <Button className="w-full py-3" onClick={() => setPhase('review')}>I'm done: show a strong answer</Button>
        </> : <Button className="w-full py-3" onClick={nextPrompt}>Next problem</Button>}
        <Section title="Tips">
          <ul className="list-disc space-y-1 pl-5 text-[14px] text-ink-2">
            <li>It's fine to think quietly for 30 seconds first.</li>
            <li>Buckets shouldn't overlap, and together they should cover the whole question.</li>
            <li>Make them about this client, not a generic list.</li>
            <li>Finish with: "I'd start with … because …"</li>
          </ul>
        </Section>
      </div>
    </div>
  )
}

function Spot() {
  const { addDrill, user } = useStore()
  const order = useMemo(() => shuffle(STRUCTURE_PICKS).map((p) => ({ ...p, options: shuffle(p.options) })), [])
  const [n, setN] = useState(0)
  const [chosen, setChosen] = useState<number | null>(null)
  const [score, setScore] = useState({ right: 0, total: 0 })
  const p = order[n % order.length]
  const choose = (i: number) => {
    if (chosen !== null) return
    setChosen(i)
    const ok = p.options[i].flaw === 'good'
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }))
    if (user) addDrill({ id: uid(), kind: 'structure', mode: 'spot', prompt: p.prompt, seconds: 0, correct: ok, total: 1, right: ok ? 1 : 0, date: todayIso(), createdAt: Date.now() }).catch(() => {})
  }
  return (
    <div className="max-w-4xl">
      <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
        <p className="text-[13.5px] text-muted">Problem {n + 1} of {order.length}</p>
        {score.total > 0 && <p className="text-[14px] text-ink">{score.right} of {score.total} right</p>}
      </div>
      <p className="font-serif text-[24px] leading-snug font-semibold text-ink">{p.prompt}</p>
      <p className="mt-1 text-[14.5px] text-muted">Four ways to break this problem down. Tap the best one. The other three each have one flaw.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {p.options.map((o, i) => {
          const good = o.flaw === 'good', picked = chosen === i, shown = chosen !== null
          return (
            <button key={i} type="button" onClick={() => choose(i)} disabled={shown}
              className={`flex flex-col justify-start rounded-xl border bg-white p-4 text-left transition-colors ${!shown ? 'border-line hover:border-ink' : good ? 'border-good ring-1 ring-good' : picked ? 'border-signal' : 'border-line opacity-80'}`}>
              <ol className="list-decimal space-y-0.5 pl-5 text-[14.5px] text-ink">{o.buckets.map((b) => <li key={b}>{b}</li>)}</ol>
              {shown && (
                <div className="mt-3 border-t border-line pt-2">
                  <p className={`text-[13.5px] font-semibold ${good ? 'text-good' : 'text-signal'}`}>{picked ? 'Your pick: ' : ''}{FLAW_LABEL[o.flaw]}</p>
                  <p className="mt-0.5 text-[13.5px] text-ink-2">{o.why}</p>
                </div>
              )}
            </button>
          )
        })}
      </div>
      {chosen !== null && <Button className="mt-5" onClick={() => { setN((x) => x + 1); setChosen(null) }}>Next problem</Button>}
    </div>
  )
}

export default function StructurePractice() {
  const [params, setParams] = useSearchParams()
  const mode = params.get('mode') === 'spot' || params.get('mode') === 'pick' ? 'pick' : params.get('mode') === 'write' || params.get('mode') === 'build' ? 'write' : null
  const go = (m: 'pick' | 'write' | null) => setParams(m ? { mode: m } : {}, { replace: false })
  return (
    <>
      <DrillCrumbs here="Structuring" />
      {mode === null && <PageHeader title="Structuring" intro="In a case you're asked to break a problem into a few clear parts before you dive in. This is the skill interviewers watch most closely. Practise it here in two ways." />}
      {mode === null && (
        <div className="grid max-w-5xl gap-4 md:grid-cols-2">
          <StartCard title="Pick the best structure" tag="Start here" onStart={() => go('pick')}
            body="You see a problem and four ways to break it down. Tap the best one. You're told straight away which is right and what's wrong with the others."
            example={<>Example: "A clinic's wait for appointments has risen from 5 to 12 days." Which is better: <i>Doctors / Nurses / Rooms</i>, or <i>More demand / Less capacity / Less efficient use</i>?</>}
            meta={`${STRUCTURE_PICKS.length} problems · about 1 minute each`} />
          <StartCard title="Write your own" onStart={() => go('write')}
            body="You get a problem and 2 minutes to write your main buckets. Then you see a strong answer, the usual mistake, and mark yourself with a short checklist."
            example={<>Example: "Should a luxury hotel group launch a budget brand?"</>}
            meta={`${STRUCTURE_PROMPTS.length} problems · 2 minutes each`} />
        </div>
      )}
      {mode !== null && (
        <div className="mb-5 flex flex-wrap items-baseline gap-x-4 gap-y-2 border-b border-line pb-3">
          <h1 className="text-[26px] leading-tight sm:text-[30px]">{mode === 'pick' ? 'Pick the best structure' : 'Write your own structure'}</h1>
          <button className="text-[14px] font-medium text-violet-d hover:underline" onClick={() => go(mode === 'pick' ? 'write' : 'pick')}>{mode === 'pick' ? 'Switch to: write your own' : 'Switch to: pick the best'}</button>
          <button className="text-[14px] text-muted hover:text-ink" onClick={() => go(null)}>Back</button>
        </div>
      )}
      {mode === 'pick' && <Spot />}
      {mode === 'write' && <Build />}
    </>
  )
}
