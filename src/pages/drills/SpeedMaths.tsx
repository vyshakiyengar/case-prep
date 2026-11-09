import { ArtMaths } from '../../components/Art'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useStore } from '../../lib/store'
import { todayIso, uid } from '../../lib/dates'
import { drillStats } from '../../lib/stats'
import { isCorrect, LEVELS, makeQuestion, SKILLS } from '../../lib/speedMaths'
import type { Level, Skill, SpeedQ } from '../../lib/speedMaths'
import { Button, PageHeader } from '../../components/ui'
import { mmss } from '../../components/Timer'
import { DrillCrumbs, HowItWorks, Seg, readBest, writeBest, Tally } from './shared'

type Mode = 'ten' | 'pace' | 'sprint'
const MODES: { key: Mode; label: string; long: string }[] = [
  { key: 'ten', label: '10 questions', long: '10 questions, no time limit' },
  { key: 'pace', label: '10 questions, 30 sec each', long: '10 questions, 30 seconds each' },
  { key: 'sprint', label: '2-minute sprint', long: 'as many as you can in 2 minutes' },
]
const SPRINT = 120, PER_Q = 30, ROUND = 10
const SETTINGS = 'prepforcase-maths-settings-v1'
type Done = { q: SpeedQ; given: string; ok: boolean; secs: number }

function loadSettings(): { mode: Mode; level: Level; skills: Skill[] } {
  try {
    const v = JSON.parse(localStorage.getItem(SETTINGS) || '{}')
    return { mode: MODES.some((m) => m.key === v.mode) ? v.mode : 'ten', level: [1, 2, 3].includes(v.level) ? v.level : 1, skills: Array.isArray(v.skills) ? v.skills.filter((s: string) => SKILLS.some((k) => k.key === s)) : [] }
  } catch { return { mode: 'ten', level: 1, skills: [] } }
}
function useTick(active: boolean) {
  const [, set] = useState(0)
  useEffect(() => { if (!active) return; const t = setInterval(() => set((x) => x + 1), 250); return () => clearInterval(t) }, [active])
}

export default function SpeedMaths() {
  const { addDrill, data, user } = useStore()
  const [params, setParams] = useSearchParams()
  const init = useMemo(loadSettings, [])
  const [mode, setMode] = useState<Mode>(init.mode)
  const [level, setLevel] = useState<Level>(init.level)
  const [skills, setSkills] = useState<Skill[]>(init.skills)
  const [phase, setPhase] = useState<'ready' | 'run' | 'done'>('ready')
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

  useEffect(() => { try { localStorage.setItem(SETTINGS, JSON.stringify({ mode, level, skills })) } catch { /* optional */ } }, [mode, level, skills])
  // Weight weak topics up, using this person's history
  const weights = useMemo(() => {
    const by = drillStats(data?.drills || []).mathsBySkill
    const w: Partial<Record<Skill, number>> = {}
    for (const [k, [r, t]] of Object.entries(by)) if (t >= 4) w[k as Skill] = 0.6 + 1.6 * (1 - r / t)
    return w
  }, [data?.drills])
  const bestKey = `${mode}-${level}`
  useEffect(() => { setBest(readBest('maths', bestKey)) }, [bestKey])

  const running = phase === 'run'
  const counted = mode !== 'sprint'
  useTick(running)
  const now = Date.now()
  const sprintLeft = Math.max(0, SPRINT - (now - roundStart.current) / 1000)
  const qLeft = Math.max(0, PER_Q - (now - qStart.current) / 1000)
  const elapsed = (now - roundStart.current) / 1000

  const next = useCallback(() => {
    let nq = makeQuestion(skills, level, weights)
    for (let i = 0; i < 12 && seen.current.has(nq.q); i++) nq = makeQuestion(skills, level, weights)
    seen.current.add(nq.q)
    setQ(nq); setGuess(''); setFb(null); qStart.current = Date.now()
    setTimeout(() => input.current?.focus(), 0)
  }, [skills, level, weights])

  const start = useCallback(() => {
    setLog([]); saved.current = false; seen.current.clear(); setNewBest(false); roundStart.current = Date.now(); setPhase('run'); next()
  }, [next])
  // Started from the drills page: go straight in
  useEffect(() => { if (params.get('go') === '1') { setParams({}, { replace: true }); start() } }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const finish = useCallback((final: Done[]) => {
    setPhase('done')
    if (saved.current || !final.length) return
    saved.current = true
    const right = final.filter((d) => d.ok).length
    const prev = readBest('maths', bestKey)
    if (prev === null || right > prev) { writeBest('maths', bestKey, right); setBest(right); setNewBest(prev !== null) }
    const breakdown: Record<string, [number, number]> = {}
    for (const d of final) { const b = breakdown[d.q.skill] || [0, 0]; breakdown[d.q.skill] = [b[0] + (d.ok ? 1 : 0), b[1] + 1] }
    if (user) addDrill({ id: uid(), kind: 'maths', prompt: `Case maths: ${MODES.find((m) => m.key === mode)!.long}`, mode, level, total: final.length, right, breakdown,
      seconds: Math.round(final.reduce((a, d) => a + d.secs, 0)), date: todayIso(), createdAt: Date.now() }).catch(() => {})
  }, [addDrill, bestKey, mode, level, user])

  const record = (ok: boolean, given: string, timeout = false) => {
    if (!q || fb) return
    const entry = { q, given, ok, secs: (Date.now() - qStart.current) / 1000 }
    const nl = [...log, entry]; setLog(nl); setFb({ ok, timeout })
    if (ok) setTimeout(() => (counted && nl.length >= ROUND ? finish(nl) : next()), mode === 'sprint' ? 350 : 700)
  }
  const submit = () => {
    if (!q) return
    if (fb) { if (fb.ok) return; if (counted && log.length >= ROUND) finish(log); else next(); return }
    if (!guess.trim()) return
    record(isCorrect(q, guess), guess)
  }
  useEffect(() => { if (running && mode === 'sprint' && sprintLeft <= 0) finish(log) }, [running, mode, sprintLeft, log, finish])
  useEffect(() => { if (running && mode === 'pace' && !fb && q && qLeft <= 0) record(false, '', true) })

  const toggle = (s: Skill) => setSkills((xs) => (xs.includes(s) ? xs.filter((x) => x !== s) : [...xs, s]))
  const right = log.filter((d) => d.ok).length
  const st = drillStats(data?.drills || [])
  const avgSecs = log.length ? log.reduce((a, d) => a + d.secs, 0) / log.length : 0
  const summary = `${MODES.find((m) => m.key === mode)!.long} · ${LEVELS.find((l) => l.key === level)!.label.toLowerCase()}${skills.length ? ` · ${skills.length} topic${skills.length > 1 ? 's' : ''}` : ''}`

  return (
    <>
      <DrillCrumbs here="Case maths" />
      {phase === 'run' ? <h1 className="mb-4 text-[22px] leading-tight sm:text-[26px]">Case maths</h1> : <PageHeader title="Case maths" art={<ArtMaths />} intro="Quick sums like the ones in a case: percentages, big numbers, margins, growth. Type your answer and see straight away whether it's right. If not, you see the quickest way to work it out." />}

      {phase === 'ready' && (
        <div className="max-w-3xl">
          <div className="graph-paper rounded-lg border border-line p-4 sm:p-5">
            <p className="text-[13.5px] text-muted">Example question</p>
            <p className="mt-1 font-serif text-[22px] leading-snug font-semibold text-ink">What is 15% of 240?</p>
            <p className="mt-1 text-[14.5px] text-ink-2">You'd type <b className="font-semibold">36</b>. No calculator: work it out in your head or on paper, as you would in an interview.</p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
              <Button className="px-7 py-3 text-[15px]" onClick={start}>Start</Button>
              <span className="text-[14px] text-muted">{summary}</span>
            </div>
            {best !== null && <p className="mt-3 text-[13.5px] text-muted">Your best at this length and difficulty: <b className="font-semibold text-ink">{best}</b> right</p>}
          </div>
          <HowItWorks steps={['Read the question.', 'Type your answer (the unit is shown next to the box) and press Enter.', 'See if you were right. If not, you see the quickest way to do it.']} />
          <details className="mt-4 rounded-lg border border-line bg-white px-5 py-3">
            <summary className="cursor-pointer text-[14.5px] font-medium text-ink">Options: length, difficulty, topics</summary>
            <div className="space-y-5 py-3">
              <div><p className="mb-2 text-[14px] font-medium text-ink">Length</p><Seg label="Length" value={mode} onChange={setMode} items={MODES.map((m) => ({ value: m.key, label: m.label }))} /></div>
              <div><p className="mb-2 text-[14px] font-medium text-ink">Difficulty</p><Seg label="Difficulty" value={level} onChange={(v) => setLevel(v as Level)} items={LEVELS.map((l) => ({ value: l.key, label: l.label, sub: l.blurb }))} /></div>
              <div>
                <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[14px] font-medium text-ink">Topics <span className="font-normal text-muted">{skills.length ? `${skills.length} chosen` : 'a mix of all twelve'}</span></p>
                  {skills.length > 0 && <button onClick={() => setSkills([])} className="text-[13.5px] font-medium text-violet-d hover:underline">Mix of all</button>}
                </div>
                <div className="flex flex-wrap gap-2">
                  {SKILLS.map((s) => {
                    const on = skills.includes(s.key); const acc = st.mathsBySkill[s.key]
                    return (
                      <button key={s.key} onClick={() => toggle(s.key)} aria-pressed={on} title={`For example: ${s.blurb}`}
                        className={`rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ${on ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-faint'}`}>
                        {s.label}{acc && acc[1] >= 4 ? <span className={`ml-1.5 tabular-nums ${on ? 'text-white/75' : 'text-muted'}`}>{Math.round((acc[0] / acc[1]) * 100)}%</span> : null}
                      </button>
                    )
                  })}
                </div>
              </div>
              <p className="text-[13.5px] text-muted">Answers can be typed as 450, 1.2M or 37.5%. Small rounding differences still count as right.</p>
            </div>
          </details>
          {!user && <p className="mt-4 text-[13.5px] text-muted"><Link to="/signin?next=/drills/maths" className="font-medium text-violet-d hover:underline">Sign in</Link> to track your accuracy by topic over time.</p>}
        </div>
      )}

      {phase === 'run' && q && (
        <div className="max-w-3xl">
          <div className="mb-3 flex flex-wrap items-center justify-between gap-3 text-[14px]">
            <span className="text-muted">{counted ? `Question ${Math.min(log.length + (fb ? 0 : 1), ROUND)} of ${ROUND}` : `${right} right so far`}</span>
            {mode === 'sprint' && <Clock left={sprintLeft} total={SPRINT} />}
            {mode === 'pace' && !fb && <Clock left={qLeft} total={PER_Q} />}
            {mode === 'ten' && <span className="font-medium tabular-nums text-ink" aria-label="Time taken">{mmss(Math.floor(elapsed))}</span>}
          </div>
          <div className={`graph-paper rounded-lg border p-5 transition-colors sm:p-5 ${fb ? (fb.ok ? 'border-good' : 'border-signal') : 'border-line'}`}>
            <p className="text-[13px] text-muted">{SKILLS.find((s) => s.key === q.skill)!.label}</p>
            <p className="mt-1 font-serif text-[22px] leading-snug font-semibold text-ink sm:text-[26px]" aria-live="polite">{q.q}</p>
            <form className="mt-5" onSubmit={(e) => { e.preventDefault(); submit() }}>
              <label className="mb-1.5 block text-[13.5px] text-muted" htmlFor="sm-answer">Your answer{q.unit.label ? `, in ${['thousand', 'million', 'billion'].includes(q.unit.label) ? q.unit.label + 's' : q.unit.label}` : ''}</label>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-lg border border-line bg-white focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/15">
                  <input id="sm-answer" ref={input} value={guess} onChange={(e) => setGuess(e.target.value)} readOnly={!!fb} inputMode="decimal" autoComplete="off"
                    className="w-40 rounded-lg bg-transparent px-3 py-2.5 text-[16.5px] text-ink tabular-nums outline-none sm:w-52" />
                  {q.unit.label && <span className="pr-3 text-[14.5px] text-muted">{q.unit.label}</span>}
                </div>
                {!(fb && fb.ok) && <Button type="submit" className="py-2.5">{fb ? (counted && log.length >= ROUND ? 'See my score' : 'Next question') : 'Check'}</Button>}
                {!fb && mode !== 'pace' && <button type="button" onClick={() => record(false, '')} className="px-2 text-[14px] text-muted hover:text-ink">I don't know</button>}
              </div>
            </form>
            {fb && (
              <div className="mt-4 rounded-lg bg-white/90 p-4" role="status">
                <p className={`text-[14.5px] font-semibold ${fb.ok ? 'text-good' : 'text-signal'}`}>{fb.ok ? 'Right!' : fb.timeout ? 'Out of time.' : 'Not quite.'} <span className="font-normal text-ink">The answer is <b className="font-semibold">{q.show}</b>.</span></p>
                {!fb.ok && <p className="mt-1 text-[14.5px] text-ink-2"><b className="font-medium text-ink">Quick way:</b> {q.method}</p>}
              </div>
            )}
          </div>
          <div className="mt-4 flex gap-5 text-[13.5px]">
            {log.length > 0 && <button className="text-muted hover:text-ink" onClick={() => finish(log)}>Finish now</button>}
            <button className="text-muted hover:text-ink" onClick={() => { setPhase('ready'); setLog([]) }}>Stop</button>
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div className="max-w-3xl">
          <div className="graph-paper rounded-lg border border-line p-5 text-center sm:p-5">
            <p className="text-[14px] text-muted">Your score</p>
            <p className="font-serif text-[42px] leading-none font-semibold text-ink">{right}<span className="text-[22px] text-muted"> / {log.length}</span></p>
            {log.length > 0 && <Tally results={log.map((d) => d.ok)} />}
            <p className="mt-2 text-ink-2">{newBest ? 'A new personal best. ' : ''}{log.length ? `About ${Math.max(1, Math.round(avgSecs))} second${Math.round(avgSecs) > 1 ? 's' : ''} a question. ${right === log.length ? 'Try a harder level next.' : 'Go through the ones you missed below.'}` : ''}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-2">
              <Button onClick={start}>Another round</Button>
              <Button variant="secondary" onClick={() => setPhase('ready')}>Change options</Button>
            </div>
          </div>
          {log.some((d) => !d.ok) && (
            <section className="mt-6">
              <h2 className="text-[17.5px]">The ones you missed</h2>
              <p className="text-[14px] text-muted">Redo each one out loud using the quick way.</p>
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
