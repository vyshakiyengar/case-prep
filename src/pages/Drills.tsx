import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useSearchParams } from 'react-router-dom'
import { drills, loadCases } from '../content'
import type { CaseDef, CaseQuestion } from '../content'
import { ExhibitView, Rich } from '../components/CaseParts'
import { useStore } from '../lib/store'
import { todayIso, uid } from '../lib/dates'
import { drillStats } from '../lib/stats'
import { nextMathQ } from '../lib/maths'
import type { MathQ } from '../lib/maths'
import { Button, inputCls, PageHeader, ScorePicker, Section, Tabs } from '../components/ui'
import { Countdown } from '../components/Timer'

function StructureDrill() {
  const { addDrill } = useStore()
  const order = useMemo(() => [...drills.structure.keys()].sort(() => Math.random() - 0.5), [])
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'running' | 'review'>('ready')
  const [notes, setNotes] = useState('')
  const [score, setScore] = useState<number>()
  const left = useRef(120)
  const d = drills.structure[order[n % order.length]]
  const end = useCallback(() => setPhase('review'), [])
  const tick = useCallback((l: number) => { left.current = l }, [])
  const save = async () => {
    await addDrill({ id: uid(), kind: 'structure', prompt: d.prompt, seconds: 120 - Math.max(0, left.current), score, date: todayIso(), createdAt: Date.now() })
    setN((x) => x + 1); setPhase('ready'); setNotes(''); setScore(undefined); left.current = 120
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
      <div className="graph-paper rounded-xl border border-line p-6">
        <div className="text-[13px] text-muted">Prompt {n + 1}</div>
        <p className="mt-1 font-serif text-[24px] leading-snug font-semibold text-ink">{phase === 'ready' ? 'Press start to see your prompt.' : d.prompt}</p>
        {phase !== 'ready' && (
          <textarea className={`${inputCls} mt-5 bg-white/90`} rows={6} value={notes} onChange={(e) => setNotes(e.target.value)}
            placeholder={'Jot your buckets here, or use paper.\n1. …\n2. …\n3. …'} disabled={phase === 'review'} />
        )}
        {phase === 'review' && (
          <div className="mt-4 rounded-lg border border-teal bg-white p-4">
            <div className="text-[13px] font-semibold text-teal-d">One good set of first-level buckets</div>
            <p className="mt-1 text-ink">{d.buckets}</p>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-medium text-ink">How did yours compare?</span>
              <ScorePicker label="Self score" value={score} onChange={setScore} />
            </div>
            <p className="mt-2 text-[13px] text-muted">5 = MECE, specific to this case, with a hypothesis. 3 = sensible but generic.</p>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {phase === 'ready' && <Button className="w-full py-3" onClick={() => setPhase('running')}>Start a 2-minute drill</Button>}
        {phase === 'running' && (
          <>
            <Countdown seconds={120} label="Time left" autoStart onEnd={end} onTick={tick} />
            <Button className="w-full" variant="secondary" onClick={() => setPhase('review')}>I'm done, compare</Button>
          </>
        )}
        {phase === 'review' && <Button className="w-full py-3" disabled={!score} onClick={save}>{score ? 'Save and next prompt' : 'Score yourself to save'}</Button>}
        <Section title="How to do it">
          <ul className="list-disc space-y-1 pl-5 text-[14px] text-ink-2">
            <li>Say the structure out loud as you would to an interviewer.</li>
            <li>3-4 buckets, no overlaps, nothing big missing.</li>
            <li>End with: "I'd start with… because…"</li>
            <li>Five a day for five days fixes most structuring problems.</li>
          </ul>
        </Section>
      </div>
    </div>
  )
}

function ChartDrill() {
  const { addDrill } = useStore()
  const [items, setItems] = useState<{ c: CaseDef; q: CaseQuestion }[] | null>(null)
  const [n, setN] = useState(0)
  const [phase, setPhase] = useState<'ready' | 'running' | 'review'>('ready')
  const [score, setScore] = useState<number>()
  useEffect(() => {
    loadCases().then((cs) => {
      const all = cs.flatMap((c) => c.questions.filter((q) => q.exhibit).map((q) => ({ c, q })))
      setItems(all.sort(() => Math.random() - 0.5))
    })
  }, [])
  const end = useCallback(() => setPhase('review'), [])
  if (!items) return <p className="text-muted">Loading exhibits…</p>
  const it = items[n % items.length]
  const save = async () => {
    await addDrill({ id: uid(), kind: 'charts', prompt: `${it.c.title}: ${it.q.q}`, seconds: 90, score, date: todayIso(), createdAt: Date.now() })
    setN((x) => x + 1); setPhase('ready'); setScore(undefined)
  }
  return (
    <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr]">
      <div className="min-w-0 rounded-xl border border-line bg-white p-5">
        <div className="text-[13px] text-muted">Exhibit {n + 1} of {items.length}, from case {it.c.id}: {it.c.title}</div>
        {phase === 'ready' ? (
          <p className="mt-2 font-serif text-[22px] font-semibold text-ink">Press start. You'll get one exhibit and 90 seconds to find the insight.</p>
        ) : (
          <>
            <p className="mt-2 text-[15px] text-ink-2"><span className="font-medium text-ink">Context:</span> {it.c.sub} {it.q.q}</p>
            {it.q.exhibit && <ExhibitView ex={it.q.exhibit} />}
          </>
        )}
        {phase === 'review' && (
          <div className="mt-2 rounded-lg border border-good/40 p-4">
            <div className="mb-1 text-[13px] font-semibold text-good">Strong answer</div>
            <Rich html={it.q.answer} />
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <span className="text-[14px] font-medium text-ink">How did yours compare?</span>
              <ScorePicker label="Self score" value={score} onChange={setScore} />
            </div>
          </div>
        )}
      </div>
      <div className="space-y-4">
        {phase === 'ready' && <Button className="w-full py-3" onClick={() => setPhase('running')}>Start a 90-second chart drill</Button>}
        {phase === 'running' && <><Countdown seconds={90} label="Time left" autoStart onEnd={end} /><Button className="w-full" variant="secondary" onClick={() => setPhase('review')}>I'm done, compare</Button></>}
        {phase === 'review' && <Button className="w-full py-3" disabled={!score} onClick={save}>{score ? 'Save and next exhibit' : 'Score yourself to save'}</Button>}
        <Section title="The routine">
          <ol className="list-decimal space-y-1 pl-5 text-[14px] text-ink-2">
            <li>Read the title, axes, units and footnote.</li>
            <li>Find the one thing that matters: the biggest number, the biggest change, the outlier.</li>
            <li>Quantify it.</li>
            <li>Link it to the client's goal.</li>
            <li>Say where you'd go next.</li>
          </ol>
          <Link to="/learn/charts-and-exhibits" className="mt-3 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Lesson: reading charts and exhibits</Link>
        </Section>
      </div>
    </div>
  )
}

function MathsDrill() {
  const { addDrill } = useStore()
  const fixed = useMemo<MathQ[]>(() => drills.maths.map((m) => ({ q: m.q, a: m.a })), [])
  const make = useCallback((k: number): MathQ => (k < 3 ? fixed[Math.floor(Math.random() * fixed.length)] : nextMathQ()), [fixed])
  const [round, setRound] = useState<{ q: MathQ; result?: boolean }[]>([])
  const [cur, setCur] = useState<MathQ | null>(null)
  const [shown, setShown] = useState(false)
  const [guess, setGuess] = useState('')
  const started = useRef(Date.now())
  const start = () => { setRound([]); setCur(make(0)); setShown(false); setGuess(''); started.current = Date.now() }
  const mark = async (ok: boolean) => {
    if (!cur) return
    await addDrill({ id: uid(), kind: 'maths', prompt: cur.q, seconds: Math.round((Date.now() - started.current) / 1000), correct: ok, date: todayIso(), createdAt: Date.now() })
    const r = [...round, { q: cur, result: ok }]
    setRound(r)
    if (r.length >= 10) { setCur(null); return }
    setCur(make(r.length)); setShown(false); setGuess(''); started.current = Date.now()
  }
  const reveal = useCallback(() => setShown(true), [])
  if (!cur) {
    const right = round.filter((r) => r.result).length
    return (
      <div className="graph-paper rounded-xl border border-line p-8 text-center">
        {round.length ? (
          <>
            <p className="font-serif text-[40px] font-semibold text-ink">{right} / {round.length}</p>
            <p className="text-muted">{right >= 8 ? 'Sharp. Keep the streak going tomorrow.' : right >= 5 ? 'Solid. Redo the ones you missed out loud.' : 'Slow down: write the formula first, then the numbers.'}</p>
          </>
        ) : (
          <>
            <p className="font-serif text-[26px] font-semibold text-ink">10 questions, 30 seconds each</p>
            <p className="mx-auto mt-1 max-w-md text-muted">Percentages, big multiplications, breakevens, margins and growth. Do them in your head, out loud.</p>
          </>
        )}
        <Button className="mt-5 px-6 py-3" onClick={start}>{round.length ? 'Another round' : 'Start'}</Button>
      </div>
    )
  }
  return (
    <div className="graph-paper rounded-xl border border-line p-6 sm:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-[13.5px] text-muted">Question {round.length + 1} of 10</span>
        {!shown && <Countdown key={cur.q + round.length} seconds={30} label="Time left" autoStart onEnd={reveal} />}
      </div>
      <p className="mt-4 font-serif text-[28px] leading-snug font-semibold text-ink">{cur.q}</p>
      {!shown ? (
        <form className="mt-5 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); setShown(true) }}>
          <input className={`${inputCls} max-w-xs bg-white`} value={guess} onChange={(e) => setGuess(e.target.value)} placeholder="Your answer (optional)" autoFocus />
          <Button type="submit">Check</Button>
        </form>
      ) : (
        <div className="mt-5 rounded-lg border border-line bg-white p-4">
          {guess && <p className="text-[14px] text-muted">You said: <span className="text-ink">{guess}</span></p>}
          <p className="text-[18px] text-ink">Answer: <b className="font-semibold">{cur.a}</b></p>
          {cur.hint && <p className="text-[14px] text-muted">{cur.hint}</p>}
          <div className="mt-4 flex gap-2">
            <Button onClick={() => mark(true)}>I got it right</Button>
            <Button variant="secondary" onClick={() => mark(false)}>I got it wrong</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Drills() {
  const { data } = useStore()
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as 'structure' | 'charts' | 'maths') || 'structure'
  const { user } = useStore()
  const s = drillStats(data?.drills || [])
  return (
    <>
      <PageHeader title="Drills" intro="Short, timed reps on one skill: structuring, charts or mental maths. Pick your weakest one." />
      {s.structureCount + s.mathsCount > 0 && <dl className="mb-6 grid grid-cols-2 gap-x-8 gap-y-3 sm:flex sm:flex-wrap">
        <div><dt className="text-[13px] text-muted">Drills this week</dt><dd className="font-serif text-[26px] font-semibold text-ink">{s.thisWeek}</dd></div>
        <div><dt className="text-[13px] text-muted">Structure and chart self-score</dt><dd className="font-serif text-[26px] font-semibold text-ink">{s.structureAvg?.toFixed(1) ?? '–'}</dd></div>
        <div><dt className="text-[13px] text-muted">Maths accuracy</dt><dd className="font-serif text-[26px] font-semibold text-ink">{s.mathsAccuracy === null ? '–' : `${Math.round(s.mathsAccuracy * 100)}%`}</dd></div>
        <div><dt className="text-[13px] text-muted">Total drills</dt><dd className="font-serif text-[26px] font-semibold text-ink">{s.structureCount + s.mathsCount}</dd></div>
      </dl>}
      <Tabs value={tab} onChange={(v) => setParams({ tab: v })} items={[{ value: 'structure', label: 'Structuring, 2 min' }, { value: 'charts', label: 'Charts, 90 sec' }, { value: 'maths', label: 'Mental maths, 30 sec' }]} />
      {!user && <p className="mb-4 rounded-lg bg-canvas px-4 py-2.5 text-[14px] text-muted"><Link to="/signin?next=/drills" className="font-medium text-violet-d hover:underline">Sign in</Link> to save your drill scores and see your progress.</p>}
      {tab === 'structure' ? <StructureDrill /> : tab === 'charts' ? <ChartDrill /> : <MathsDrill />}
    </>
  )
}
