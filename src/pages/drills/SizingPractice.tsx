import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArtSizing } from '../../components/Art'
import { Button, PageHeader, inputCls } from '../../components/ui'
import { Countdown } from '../../components/Timer'
import { useStore } from '../../lib/store'
import { todayIso, uid } from '../../lib/dates'
import { SIZING, fmtAnswer, fmtStep, parseEstimate, sizingAnswer } from '../../content/sizingDrills'
import type { SizingQ } from '../../content/sizingDrills'
import { DrillCrumbs, Seg } from './shared'

const shuffle = <T,>(a: T[]) => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]] } return b }
type Level = 0 | 1 | 2 | 3

function verdict(ratio: number) {
  const r = ratio >= 1 ? ratio : 1 / ratio
  if (r <= 1.5) return { ok: true, tone: 'good', head: 'Close to the model answer', body: 'Within 50% of one reasonable estimate. In an interview, a clear structure and sensible assumptions matter more than the exact number.' }
  if (r <= 2) return { ok: true, tone: 'amber', head: 'Same ballpark', body: 'Within a factor of two. Compare your assumptions with the model line by line and see which one moved the answer most.' }
  return { ok: false, tone: 'signal', head: `Off by about ${r >= 10 ? Math.round(r) : r.toFixed(1)}×`, body: 'Go through the model line by line. One assumption is probably much bigger or smaller than it should be, or a step is missing.' }
}

export default function SizingPractice() {
  const { user, addDrill } = useStore()
  const [level, setLevel] = useState<Level>(0)
  const order = useMemo(() => shuffle(SIZING.filter((q) => !level || q.level === level)), [level])
  const [n, setN] = useState(0)
  const [plan, setPlan] = useState('')
  const [raw, setRaw] = useState('')
  const [shown, setShown] = useState(false)
  const [started, setStarted] = useState(Date.now())
  const [score, setScore] = useState({ close: 0, total: 0 })
  const q: SizingQ = order[n % order.length]
  const model = sizingAnswer(q)
  const est = parseEstimate(raw)
  const v = est !== null && est > 0 ? verdict(est / model) : null

  const check = () => {
    if (est === null || est <= 0) return
    setShown(true)
    const ok = verdict(est / model).ok
    setScore((s) => ({ close: s.close + (ok ? 1 : 0), total: s.total + 1 }))
    if (user) addDrill({ id: uid(), kind: 'sizing', prompt: q.q, seconds: Math.round((Date.now() - started) / 1000), correct: ok, total: 1, right: ok ? 1 : 0, date: todayIso(), createdAt: Date.now() }).catch(() => {})
  }
  const next = () => { setN((x) => x + 1); setPlan(''); setRaw(''); setShown(false); setStarted(Date.now()); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <>
      <DrillCrumbs here="Market sizing" />
      <PageHeader title="Market sizing" art={<ArtSizing />} intro="Build an estimate from scratch, then compare your logic with a model answer." />
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <Seg label="Difficulty" value={level} onChange={(x) => { setLevel(x); setN(0); setShown(false); setRaw(''); setPlan('') }}
          items={[{ value: 0, label: 'All' }, { value: 1, label: 'Easy' }, { value: 2, label: 'Medium' }, { value: 3, label: 'Hard' }]} />
        {score.total > 0 && <p className="text-[14px] text-ink">{score.close} of {score.total} within 2× of the model</p>}
      </div>

      <section className="max-w-3xl rounded-lg border border-line bg-white p-4 sm:p-6">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <p className="text-[13.5px] text-muted">Question {n + 1} of {order.length}, {['', 'easy', 'medium', 'hard'][q.level]}</p>
          {!shown && <Countdown key={q.id + n} seconds={180} label="Thinking time" />}
        </div>
        <h2 className="mt-1 font-serif text-[22px] leading-snug font-semibold">{q.q}</h2>

        <label className="mt-5 block text-[14px] font-medium text-ink" htmlFor="sz-plan">Your structure <span className="font-normal text-muted">(optional, but say it out loud)</span></label>
        <textarea id="sz-plan" value={plan} onChange={(e) => setPlan(e.target.value)} disabled={shown} rows={3} className={`${inputCls} mt-1.5`} placeholder="For example: people × share who buy × how often × price" />

        <label className="mt-4 block text-[14px] font-medium text-ink" htmlFor="sz-est">Your estimate{q.cur ? ` in ${q.cur}` : ''}, {q.unit}</label>
        <div className="mt-1.5 flex flex-wrap items-center gap-2">
          <input id="sz-est" value={raw} onChange={(e) => setRaw(e.target.value)} disabled={shown} inputMode="text" autoComplete="off"
            onKeyDown={(e) => { if (e.key === 'Enter' && !shown) check() }}
            className={`${inputCls} w-48`} placeholder={q.cur ? `${q.cur}1.2M` : 'e.g. 3.5M or 40k'} />
          {!shown && <Button onClick={check} disabled={est === null || est <= 0}>Check</Button>}
          {raw && est !== null && !shown && <span className="text-[13px] text-muted">Read as {q.cur ?? ''}{est.toLocaleString('en-GB')}</span>}
        </div>

        {shown && v && (
          <div className="mt-6">
            <div className={`rounded-lg border-l-4 p-4 ${v.tone === 'good' ? 'border-good bg-good-l' : v.tone === 'amber' ? 'border-[#B7791F] bg-[#FBF3E2]' : 'border-signal bg-signal-l'}`}>
              <p className="font-semibold text-ink">{v.head}</p>
              <p className="mt-1 text-[14.5px] text-ink-2">You said {q.cur ?? ''}{est!.toLocaleString('en-GB')}. One reasonable estimate is <b className="font-semibold">{fmtAnswer(q)}</b> {q.unit}.</p>
              <p className="mt-1 text-[14px] text-ink-2">{v.body}</p>
            </div>

            <h3 className="mt-6 font-sans text-[15px] font-semibold">How the model answer is built</h3>
            <p className="mt-1 text-[14px] text-muted">{q.approach}</p>
            <ol className="mt-3 divide-y divide-line rounded-lg border border-line font-[tabular-nums]">
              {q.steps.map((s, i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 px-4 py-2.5 text-[14.5px]">
                  <span className="text-ink-2"><span className="mr-2 inline-block w-5 text-center text-[17px] leading-none font-semibold text-teal-d">{i === 0 ? '' : s.op}</span>{s.t}</span>
                  <span className="shrink-0 font-semibold text-ink tabular-nums">{fmtStep(s, q.cur)}</span>
                </li>
              ))}
              <li className="flex items-baseline justify-between gap-4 bg-canvas px-4 py-3 text-[15px]">
                <span className="font-semibold text-ink"><span className="mr-2 inline-block w-4 text-center text-teal-d">=</span>{q.unit.charAt(0).toUpperCase() + q.unit.slice(1)}</span>
                <span className="font-serif text-[19px] font-semibold text-ink">{fmtAnswer(q)}</span>
              </li>
            </ol>
            <p className="mt-3 text-[14px] text-ink-2"><b className="font-semibold text-ink">Sanity check:</b> {q.check}</p>
            {plan.trim() && <p className="mt-3 rounded-lg bg-canvas px-4 py-3 text-[14px] text-ink-2"><b className="font-semibold text-ink">Your structure:</b> {plan}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Button onClick={next}>Next question</Button>
              <Link to="/learn/market-sizing" className="text-[14px] font-medium text-violet-d hover:underline">Lesson: market sizing</Link>
            </div>
          </div>
        )}
      </section>

    </>
  )
}
