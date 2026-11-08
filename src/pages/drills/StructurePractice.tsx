import { useCallback, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { todayIso, uid } from '../../lib/dates'
import { FLAW_LABEL, STRUCTURE_PICKS, STRUCTURE_PROMPTS } from '../../content/structureDrills'
import type { StructFamily, StructPrompt } from '../../content/structureDrills'
import { Button, inputCls, PageHeader, Section, Tabs } from '../../components/ui'
import { Countdown } from '../../components/Timer'
import { DrillCrumbs, Seg } from './shared'

const shuffle = <T,>(a: T[]) => [...a].sort(() => Math.random() - 0.5)
const FAMILY_NAME: Record<StructFamily, string> = { diagnose: 'Diagnose: why is this happening?', decide: 'Decide: should we do it?', generate: 'Generate: how can we do it?' }
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
  const [fam, setFam] = useState<'all' | StructFamily>('all')
  const order = useMemo(() => shuffle(STRUCTURE_PROMPTS.filter((p) => fam === 'all' || p.family === fam)), [fam])
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'running' | 'review'>('ready')
  const [notes, setNotes] = useState('')
  const [ticks, setTicks] = useState<boolean[]>(CHECKS.map(() => false))
  const left = useRef(120)
  const p = order[n % order.length]
  const end = useCallback(() => setPhase('review'), [])
  const tick = useCallback((l: number) => { left.current = l }, [])
  const reset = () => { setPhase('ready'); setNotes(''); setTicks(CHECKS.map(() => false)); left.current = 120 }
  const score = ticks.filter(Boolean).length
  const save = async () => {
    if (user) await addDrill({ id: uid(), kind: 'structure', mode: 'build', prompt: p.prompt, seconds: 120 - Math.max(0, left.current), score: Math.max(1, score), date: todayIso(), createdAt: Date.now() }).catch(() => {})
    setN((x) => x + 1); reset()
  }
  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Seg label="Kind of question" value={fam} onChange={(v) => { setFam(v); setN(0); reset() }}
          items={[{ value: 'all', label: 'All' }, { value: 'diagnose', label: 'Diagnose' }, { value: 'decide', label: 'Decide' }, { value: 'generate', label: 'Generate' }]} />
        <span className="text-[13.5px] text-muted">{order.length} prompts</span>
      </div>
      <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
        <div className="min-w-0 graph-paper rounded-xl border border-line p-5 sm:p-6">
          <p className="text-[13px] text-muted">Prompt {n + 1}{phase !== 'ready' ? ` · ${p.type}` : ''}</p>
          <p className="mt-1 font-serif text-[24px] leading-snug font-semibold text-ink">{phase === 'ready' ? 'Press start to see your prompt. You have two minutes.' : p.prompt}</p>
          {phase !== 'ready' && (
            <textarea aria-label="Your structure" className={`${inputCls} mt-5 bg-white/90`} rows={6} value={notes} onChange={(e) => setNotes(e.target.value)} disabled={phase === 'review'}
              placeholder={'Your first-level buckets, then a line or two under each.\n1. …\n2. …\n3. …\nI would start with … because …'} />
          )}
          {phase === 'review' && (
            <div className="mt-5 space-y-4">
              <div>
                <p className="mb-2 text-[13.5px] font-semibold text-teal-d">One strong structure · {FAMILY_NAME[p.family]}</p>
                <Tree p={p} />
              </div>
              <p className="text-[14.5px] text-ink-2"><b className="font-semibold text-ink">Where to start:</b> {p.start}</p>
              <p className="text-[14.5px] text-ink-2"><b className="font-semibold text-ink">The usual trap:</b> {p.trap}</p>
              {p.framework && <Link to={`/frameworks/${p.framework}`} className="inline-block text-[14px] font-medium text-violet-d hover:underline">See the core framework this builds on</Link>}
              <fieldset className="rounded-lg border border-line bg-white p-4">
                <legend className="px-1 text-[14px] font-medium text-ink">Mark yours honestly</legend>
                <ul className="space-y-2">
                  {CHECKS.map((c, i) => (
                    <li key={c}><label className="flex cursor-pointer items-start gap-2.5 text-[14px] text-ink-2">
                      <input type="checkbox" className="mt-0.5 h-4 w-4 accent-teal" checked={ticks[i]} onChange={() => setTicks((t) => t.map((x, j) => (j === i ? !x : x)))} />{c}
                    </label></li>
                  ))}
                </ul>
                <p className="mt-3 text-[14px] text-ink">Score: <b className="font-semibold">{score} / 5</b></p>
              </fieldset>
            </div>
          )}
        </div>
        <div className="space-y-4">
          {phase === 'ready' && <Button className="w-full py-3" onClick={() => setPhase('running')}>Start the 2-minute drill</Button>}
          {phase === 'running' && <><Countdown seconds={120} label="Time left" autoStart onEnd={end} onTick={tick} /><Button className="w-full" variant="secondary" onClick={() => setPhase('review')}>I'm done, show the answer</Button></>}
          {phase === 'review' && <Button className="w-full py-3" onClick={save}>{user ? 'Save and next prompt' : 'Next prompt'}</Button>}
          <Section title="How to do it">
            <ul className="list-disc space-y-1 pl-5 text-[14px] text-ink-2">
              <li>Take 30 seconds of silence. Interviewers expect it.</li>
              <li>Say three or four buckets out loud, then one line under each.</li>
              <li>Make the buckets add up to the question, with no overlaps.</li>
              <li>End with: "I'd start with … because …"</li>
            </ul>
          </Section>
        </div>
      </div>
    </>
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
        <p className="text-[13.5px] text-muted">Question {n + 1} of {order.length}</p>
        {score.total > 0 && <p className="text-[14px] text-ink">{score.right} of {score.total} right</p>}
      </div>
      <p className="font-serif text-[24px] leading-snug font-semibold text-ink">{p.prompt}</p>
      <p className="mt-1 text-[14.5px] text-muted">Pick the structure you would say to the interviewer. Three of these have one flaw each.</p>
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
      {chosen !== null && <Button className="mt-5" onClick={() => { setN((x) => x + 1); setChosen(null) }}>Next question</Button>}
    </div>
  )
}

export default function StructurePractice() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('mode') === 'spot' ? 'spot' : 'build'
  return (
    <>
      <DrillCrumbs here="Structuring" />
      <PageHeader title="Structuring drills" intro={`Build a structure in two minutes and compare it with a strong one (${STRUCTURE_PROMPTS.length} prompts), or spot the flaw in four structures (${STRUCTURE_PICKS.length} questions, marked instantly).`} />
      <Tabs value={tab} onChange={(v) => setParams({ mode: v }, { replace: true })} items={[{ value: 'build', label: 'Build a structure, 2 min' }, { value: 'spot', label: 'Spot the flaw' }]} />
      {tab === 'build' ? <Build /> : <Spot />}
    </>
  )
}
