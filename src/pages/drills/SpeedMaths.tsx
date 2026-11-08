import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { todayIso, uid } from '../../lib/dates'
import { drillStats } from '../../lib/stats'
import { isCorrect, LEVELS, makeQuestion, SKILLS } from '../../lib/speedMaths'
import type { Level, Skill, SpeedQ } from '../../lib/speedMaths'
import { Button, PageHeader } from '../../components/ui'
import { mmss } from '../../components/Timer'
import { DrillCrumbs, ModeCard, Seg, readBest, writeBest } from './shared'

type Mode = 'sprint' | 'set' | 'practice'
const MODES: { key: Mode; title: string; body: string }[] = [
  { key: 'sprint', title: 'Sprint: 2 minutes', body: 'As many as you can. Wrong answers cost time, not points.' },
  { key: 'set', title: 'Ten questions, 30 seconds each', body: 'Interview pace. Run out of time and it counts as a miss.' },
  { key: 'practice', title: 'Practice, no clock', body: 'Learn the method. The shortcut shows after every answer.' },
]
const SPRINT = 120, PER_Q = 30
type Done = { q: SpeedQ; given: string; ok: boolean; secs: number }

function useTick(active: boolean) {
  const [, set] = useState(0)
  useEffect(() => { if (!active) return; const t = setInterval(() => set((x) => x + 1), 250); return () => clearInterval(t) }, [active])
}

export default function SpeedMaths() {
  const { addDrill, data, user } = useStore()
  const [mode, setMode] = useState<Mode>('sprint')
  const [level, setLevel] = useState<Level>(2)
  const [skills, setSkills] = useState<Skill[]>([])
  const [phase, setPhase] = useState<'setup' | 'run' | 'done'>('setup')
  const [q, setQ] = useState<SpeedQ | null>(null)
  const [guess, setGuess] = useState('')
  const [fb, setFb] = useState<null | { ok: boolean; timeout?: boolean }>(null)
  const [log, setLog] = useState<Done[]>([])
  const [best, setBest] = useState<number | null>(null)
  const [newBest, setNewBest] = useState(false)
  const roundStart = useRef(0), qStart = useRef(0)
  const input = useRef<HTMLInputElement>(null)
  const saved = useRef(false)
  const seen = useRef(new Set<string>())

  // Weight weak skills up, using this person's history
  const weights = useMemo(() => {
    const by = drillStats(data?.drills || []).mathsBySkill
    const w: Partial<Record<Skill, number>> = {}
    for (const [k, [r, t]] of Object.entries(by)) if (t >= 4) w[k as Skill] = 0.6 + 1.6 * (1 - r / t)
    return w
  }, [data?.drills])
  const bestKey = `${mode}-${level}`
  useEffect(() => { setBest(readBest('maths', bestKey)) }, [bestKey])

  const running = phase === 'run'
  useTick(running && mode !== 'practice')
  const now = Date.now()
  const sprintLeft = Math.max(0, SPRINT - (now - roundStart.current) / 1000)
  const qLeft = Math.max(0, PER_Q - (now - qStart.current) / 1000)

  const next = useCallback(() => {
    let nq = makeQuestion(skills, level, weights)
    for (let i = 0; i < 12 && seen.current.has(nq.q); i++) nq = makeQuestion(skills, level, weights)
    seen.current.add(nq.q)
    setQ(nq); setGuess(''); setFb(null); qStart.current = Date.now()
    setTimeout(() => input.current?.focus(), 0)
  }, [skills, level, weights])

  const start = () => {
    setLog([]); saved.current = false; seen.current.clear(); setNewBest(false); roundStart.current = Date.now(); setPhase('run'); next()
  }
  const finish = useCallback((final: Done[]) => {
    setPhase('done')
    if (saved.current || !final.length) return
    saved.current = true
    const right = final.filter((d) => d.ok).length
    if (mode !== 'practice') {
      const prev = readBest('maths', bestKey)
      if (prev === null || right > prev) { writeBest('maths', bestKey, right); setBest(right); setNewBest(prev !== null || right > 0) }
    }
    const breakdown: Record<string, [number, number]> = {}
    for (const d of final) { const b = breakdown[d.q.skill] || [0, 0]; breakdown[d.q.skill] = [b[0] + (d.ok ? 1 : 0), b[1] + 1] }
    if (user) addDrill({ id: uid(), kind: 'maths', prompt: `Speed maths: ${MODES.find((m) => m.key === mode)!.title}`, mode, level, total: final.length, right, breakdown,
      seconds: Math.round(final.reduce((a, d) => a + d.secs, 0)), date: todayIso(), createdAt: Date.now() }).catch(() => {})
  }, [addDrill, bestKey, mode, level, user])

  const record = (ok: boolean, given: string, timeout = false) => {
    if (!q) return
    const entry = { q, given, ok, secs: (Date.now() - qStart.current) / 1000 }
    const nl = [...log, entry]; setLog(nl); setFb({ ok, timeout })
    if (ok && mode !== 'practice') setTimeout(() => (mode === 'set' && nl.length >= 10 ? finish(nl) : next()), mode === 'sprint' ? 350 : 600)
  }
  const submit = () => {
    if (!q) return
    if (fb) { if (fb.ok && mode !== 'practice') return; if (mode === 'set' && log.length >= 10) finish(log); else next(); return }
    if (!guess.trim()) return
    record(isCorrect(q, guess), guess)
  }
  // clocks
  useEffect(() => { if (running && mode === 'sprint' && sprintLeft <= 0) finish(log) }, [running, mode, sprintLeft, log, finish])
  useEffect(() => { if (running && mode === 'set' && !fb && q && qLeft <= 0) record(false, '', true) })

  const toggle = (s: Skill) => setSkills((xs) => (xs.includes(s) ? xs.filter((x) => x !== s) : [...xs, s]))
  const right = log.filter((d) => d.ok).length
  const st = drillStats(data?.drills || [])

  return (
    <>
      <DrillCrumbs here="Speed maths" />
      <PageHeader title="Speed maths" intro="Case maths against the clock: percentages, big numbers, breakevens, growth and valuation. Type the answer; it's marked instantly." />

      {phase === 'setup' && (
        <div className="max-w-4xl space-y-6">
          <div className="grid gap-3 sm:grid-cols-3" role="group" aria-label="Mode">
            {MODES.map((m) => <ModeCard key={m.key} active={mode === m.key} onClick={() => setMode(m.key)} title={m.title} body={m.body} />)}
          </div>
          <div>
            <p className="mb-2 text-[14px] font-medium text-ink">Level</p>
            <Seg value={level} onChange={(v) => setLevel(v as Level)} items={LEVELS.map((l) => ({ value: l.key, label: l.label, sub: l.blurb }))} />
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-[14px] font-medium text-ink">Skills <span className="font-normal text-muted">{skills.length ? `${skills.length} chosen` : 'all twelve, weighted to your weak spots'}</span></p>
              {skills.length > 0 && <button onClick={() => setSkills([])} className="text-[13.5px] font-medium text-violet-d hover:underline">Use all</button>}
            </div>
            <div className="flex flex-wrap gap-2">
              {SKILLS.map((s) => {
                const on = skills.includes(s.key); const acc = st.mathsBySkill[s.key]
                return (
                  <button key={s.key} onClick={() => toggle(s.key)} aria-pressed={on} title={s.blurb}
                    className={`rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-faint'}`}>
                    {s.label}{acc && acc[1] >= 4 ? <span className={`ml-1.5 tabular-nums ${on ? 'text-white/75' : 'text-muted'}`}>{Math.round((acc[0] / acc[1]) * 100)}%</span> : null}
                  </button>
                )
              })}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <Button className="px-6 py-3 text-[15.5px]" onClick={start}>Start</Button>
            {mode !== 'practice' && best !== null && <span className="text-[14px] text-muted">Your best at this level: <b className="font-semibold text-ink">{best}</b> right</span>}
          </div>
          {!user && <p className="text-[13.5px] text-muted"><Link to="/signin?next=/drills/maths" className="font-medium text-violet-d hover:underline">Sign in</Link> to track accuracy by skill. Your best scores are kept in this browser either way.</p>}
          <details className="rounded-xl border border-line bg-white px-5 py-3">
            <summary className="cursor-pointer text-[15px] font-medium text-ink">How to type answers</summary>
            <ul className="mt-2 list-disc space-y-1 pb-2 pl-5 text-[14px] text-ink-2">
              <li>Answer in the unit shown next to the box. "1.2B" or "1,200M" both work where it says million.</li>
              <li>Percentages: type 37.5 or 37.5%. Small rounding is fine: you're marked within a sensible tolerance.</li>
              <li>Press Enter to submit, and Enter again for the next question.</li>
            </ul>
          </details>
        </div>
      )}

      {phase === 'run' && q && (
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-[14px]">
            <span className="text-muted">{mode === 'set' ? `Question ${Math.min(log.length + (fb ? 0 : 1), 10)} of 10` : `${right} right · ${log.length - right} missed`}</span>
            {mode === 'sprint' && <Clock left={sprintLeft} total={SPRINT} />}
            {mode === 'set' && !fb && <Clock left={qLeft} total={PER_Q} />}
            {mode === 'practice' && <button className="font-medium text-violet-d hover:underline" onClick={() => finish(log)}>Finish</button>}
          </div>
          <div className={`graph-paper rounded-xl border p-6 transition-colors sm:p-8 ${fb ? (fb.ok ? 'border-good' : 'border-signal') : 'border-line'}`}>
            <p className="text-[13px] text-muted">{SKILLS.find((s) => s.key === q.skill)!.label}</p>
            <p className="mt-1 font-serif text-[26px] leading-snug font-semibold text-ink sm:text-[30px]" aria-live="polite">{q.q}</p>
            <form className="mt-5 flex flex-wrap items-center gap-2" onSubmit={(e) => { e.preventDefault(); submit() }}>
              <label className="sr-only" htmlFor="sm-answer">Your answer</label>
              <div className="flex items-center rounded-lg border border-line bg-white focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
                <input id="sm-answer" ref={input} value={guess} onChange={(e) => setGuess(e.target.value)} readOnly={!!fb} inputMode="decimal" autoComplete="off"
                  className="w-44 rounded-lg bg-transparent px-3 py-2.5 text-[18px] text-ink tabular-nums outline-none sm:w-56" placeholder="Answer" />
                {q.unit.label && <span className="pr-3 text-[15px] text-muted">{q.unit.label}</span>}
              </div>
              <Button type="submit" className="py-2.5">{fb ? (mode === 'set' && log.length >= 10 ? 'See results' : 'Next') : 'Check'}</Button>
              {!fb && mode !== 'set' && <button type="button" onClick={() => record(false, '')} className="px-2 text-[14px] text-muted hover:text-ink">Skip</button>}
            </form>
            {fb && (
              <div className="mt-4 rounded-lg bg-white/90 p-4" role="status">
                <p className={`text-[15.5px] font-semibold ${fb.ok ? 'text-good' : 'text-signal'}`}>{fb.ok ? 'Right.' : fb.timeout ? 'Out of time.' : 'Not quite.'} <span className="font-normal text-ink">Answer: <b className="font-semibold">{q.show}</b></span></p>
                {(!fb.ok || mode === 'practice') && <p className="mt-1 text-[14.5px] text-ink-2">{q.method}</p>}
              </div>
            )}
          </div>
          <button className="mt-4 text-[13.5px] text-muted hover:text-ink" onClick={() => { setPhase('setup'); setLog([]) }}>Stop and change settings</button>
        </div>
      )}

      {phase === 'done' && (
        <div className="max-w-3xl">
          <div className="graph-paper rounded-xl border border-line p-6 text-center sm:p-8">
            <p className="font-serif text-[48px] leading-none font-semibold text-ink">{right}<span className="text-[26px] text-muted"> / {log.length}</span></p>
            <p className="mt-2 text-ink-2">{newBest ? 'A new personal best at this level.' : log.length ? `${Math.round((right / log.length) * 100)}% right, about ${Math.max(1, Math.round(log.reduce((a, d) => a + d.secs, 0) / log.length))} second${Math.round(log.reduce((a, d) => a + d.secs, 0) / log.length) > 1 ? 's' : ''} a question.` : 'No questions answered.'}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button onClick={start}>Go again</Button>
              <Button variant="secondary" onClick={() => setPhase('setup')}>Change settings</Button>
            </div>
          </div>
          {log.some((d) => !d.ok) && (
            <section className="mt-6">
              <h2 className="text-[20px]">Redo these out loud</h2>
              <ul className="mt-3 space-y-3">
                {log.filter((d) => !d.ok).map((d) => (
                  <li key={d.q.id} className="rounded-lg border border-line bg-white p-4">
                    <p className="font-medium text-ink">{d.q.q}</p>
                    <p className="mt-1 text-[14px] text-ink-2">{d.given ? <>You said {d.given}. </> : null}Answer: <b className="font-semibold text-ink">{d.q.show}</b>. {d.q.method}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </>
  )
}

function Clock({ left, total }: { left: number; total: number }) {
  const low = left <= Math.min(10, total / 4)
  return (
    <span className="inline-flex items-center gap-2" role="timer" aria-label={`${Math.ceil(left)} seconds left`}>
      <span className="h-1.5 w-28 overflow-hidden rounded-full bg-line"><span className={`block h-full rounded-full ${low ? 'bg-signal' : 'bg-teal'}`} style={{ width: `${(left / total) * 100}%`, transition: 'width .25s linear' }} /></span>
      <span className={`w-11 text-right font-medium tabular-nums ${low ? 'text-signal' : 'text-ink'}`}>{mmss(Math.ceil(left))}</span>
    </span>
  )
}
