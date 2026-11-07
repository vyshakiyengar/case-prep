import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { CARDS, STAGES_PC, stageByN } from '../content/perfectCasing'
import type { Card } from '../content/perfectCasing'
import { lessonBySlug } from '../content/course'
import { useStore } from '../lib/store'
import { addDays, todayIso } from '../lib/dates'
import { Button, Meter, PageHeader, Section } from '../components/ui'
import { Gate, StickyNav, useScrollToTarget } from '../components/Learning'
import { SignInButton } from './SignIn'
import { Countdown } from '../components/Timer'

type Boxes = Record<string, { box: number; due: string }>
const LS = 'cpos-trainer'
const GAP = [0, 0, 1, 3, 7, 14] // days until a card is due again, by box

function useBoxes(): [Boxes, (b: Boxes) => void] {
  const { user, data, saveProfile } = useStore()
  const [local, setLocal] = useState<Boxes>(() => { try { return JSON.parse(localStorage.getItem(LS) || '{}') } catch { return {} } })
  if (user && data?.profile) return [data.profile.trainer || {}, (b) => { saveProfile({ trainer: b }) }]
  return [local, (b) => { setLocal(b); try { localStorage.setItem(LS, JSON.stringify(b)) } catch { /* ignore */ } }]
}

const TOOLS: Record<number, { label: string; to: string }[]> = {
  3: [{ label: 'Casebook: practise openings', to: '/casebook' }],
  4: [{ label: 'Core frameworks', to: '/frameworks' }, { label: 'Structuring drill', to: '/drills?tab=structure' }],
  5: [{ label: 'Second-order drivers', to: '/frameworks#drivers' }],
  6: [{ label: 'Graph library', to: '/graphs' }, { label: 'Chart drill', to: '/drills?tab=charts' }],
  7: [{ label: 'Maths drill', to: '/drills?tab=maths' }, { label: 'Formulas', to: '/formulas' }],
  8: [{ label: 'Brainstorming frameworks', to: '/frameworks#other' }],
  10: [{ label: 'Interview skills', to: '/interview-skills' }],
}

function Stage({ s, onTrain }: { s: ReturnType<typeof stageByN>; onTrain: (n: number) => void }) {
  const lesson = lessonBySlug(s.lesson)
  return (
    <article id={`stage-${s.n}`} className="scroll-mt-32 rounded-2xl border border-line bg-white p-5 sm:p-7">
      <div className="flex items-baseline gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ink font-serif text-[16px] font-semibold text-white">{s.n}</span>
        <div>
          <h2 className="text-[26px] leading-tight font-semibold">{s.title}</h2>
          <p className="mt-1 text-[16px] text-ink-2">{s.why}</p>
        </div>
      </div>
      <ol className="mt-6 space-y-5">
        {s.moments.map((m) => (
          <li key={m.name} className="grid gap-2 border-t border-line pt-5 first:border-t-0 first:pt-0 md:grid-cols-[1fr_1.1fr] md:gap-6">
            <div>
              <h3 className="font-sans text-[16px] font-semibold text-ink">{m.name}</h3>
              <p className="mt-1 text-[15px] text-ink-2">{m.do}</p>
            </div>
            {m.say && (
              <blockquote className="graph-paper rounded-lg border-l-4 border-teal px-4 py-3 font-serif text-[17px] leading-relaxed text-ink">
                <span className="mb-1 block font-sans text-[12.5px] font-medium text-teal-d">Say this</span>{m.say}
              </blockquote>
            )}
          </li>
        ))}
      </ol>
      <p className="mt-6 rounded-lg bg-signal-l px-4 py-3 text-[15px] text-signal-d"><b className="font-semibold">Common mistake:</b> {s.mistake}</p>
      <div className="mt-5 flex flex-wrap gap-2">
        <Button onClick={() => onTrain(s.n)}>Train these phrases</Button>
        {lesson && <Link to={`/learn/${lesson.slug}`} className="inline-flex items-center rounded-lg border border-line bg-white px-4 py-2 text-[14px] font-medium text-ink hover:border-faint">Lesson: {lesson.title}</Link>}
        {(TOOLS[s.n] || []).map((t) => <Link key={t.to} to={t.to} className="inline-flex items-center rounded-lg border border-line bg-white px-4 py-2 text-[14px] font-medium text-violet-d hover:border-faint">{t.label} →</Link>)}
      </div>
    </article>
  )
}

function Trainer({ stage }: { stage: number | null }) {
  const [boxes, setBoxes] = useBoxes()
  const t = todayIso()
  const build = () => {
    const pool = CARDS.filter((c) => !stage || c.stage === stage)
    const due = pool.filter((c) => boxes[c.id] && boxes[c.id].due <= t).sort((a, b) => boxes[a.id].box - boxes[b.id].box)
    const fresh = pool.filter((c) => !boxes[c.id]).slice(0, stage ? 99 : 8)
    return [...due, ...fresh].slice(0, stage ? 99 : 10)
  }
  const [queue, setQueue] = useState<Card[] | null>(null)
  const [i, setI] = useState(0)
  const [shown, setShown] = useState(false)
  const [tally, setTally] = useState({ nailed: 0, almost: 0, missed: 0 })
  const mastery = useMemo(() => STAGES_PC.map((s) => {
    const cs = CARDS.filter((c) => c.stage === s.n)
    return { s, pct: cs.filter((c) => (boxes[c.id]?.box || 0) >= 3).length / cs.length }
  }), [boxes])
  const dueCount = CARDS.filter((c) => !boxes[c.id] || boxes[c.id].due <= t).length

  const rate = (r: 'nailed' | 'almost' | 'missed') => {
    const c = queue![i]
    const cur = boxes[c.id]?.box || 1
    const box = r === 'nailed' ? Math.min(5, cur + 1) : r === 'almost' ? cur : 1
    setBoxes({ ...boxes, [c.id]: { box, due: addDays(t, r === 'missed' ? 0 : GAP[box]) } })
    setTally((x) => ({ ...x, [r]: x[r] + 1 }))
    const q = r === 'missed' && queue!.filter((x) => x.id === c.id).length < 2 ? [...queue!, c] : queue!
    setQueue(q); setShown(false); setI((x) => x + 1)
  }

  if (!queue) return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
      <Section title={stage ? `Train stage ${stage}: ${stageByN(stage).title}` : 'Today’s phrase training'}>
        <p className="text-ink-2">You'll see a moment from a real interview. Say your line <b className="font-semibold">out loud</b> within 10 seconds, then compare it with a model answer and repeat that out loud. Cards you miss come back sooner; cards you nail come back later.</p>
        <p className="mt-3 text-[14px] text-muted">{stage ? `${CARDS.filter((c) => c.stage === stage).length} cards in this stage.` : `${dueCount} cards are due. A session is up to 10 cards, about 5 minutes.`}</p>
        <Button className="mt-4 px-6 py-3" onClick={() => { setQueue(build()); setI(0); setTally({ nailed: 0, almost: 0, missed: 0 }) }}>Start training</Button>
      </Section>
      <Section title="Your mastery by stage">
        <ul className="space-y-2.5">
          {mastery.map(({ s, pct }) => (
            <li key={s.n} className="grid grid-cols-[1fr_90px_36px] items-center gap-3 text-[14px]">
              <span className="truncate text-ink">{s.n}. {s.title}</span><Meter value={pct} max={1} color="bg-teal" /><span className="text-right tabular-nums text-muted">{Math.round(pct * 100)}%</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-[13px] text-muted">A phrase counts as mastered once you've nailed it on two separate days.</p>
      </Section>
    </div>
  )

  if (i >= queue.length) return (
    <div className="graph-paper rounded-xl border border-line p-8 text-center">
      <p className="font-serif text-[32px] font-semibold text-ink">{queue.length ? 'Session done' : 'Nothing due right now'}</p>
      {queue.length > 0 && <p className="mt-1 text-ink-2">Nailed {tally.nailed}, almost {tally.almost}, missed {tally.missed}. Missed cards come back first next time.</p>}
      <div className="mt-5 flex justify-center gap-2">
        <Button onClick={() => setQueue(null)}>Back to training</Button>
        <Link to="/casebook" className="inline-flex items-center rounded-lg border border-line bg-white px-4 py-2 text-[14px] font-medium text-ink">Use them in a full case</Link>
      </div>
    </div>
  )

  const c = queue[i]
  const s = stageByN(c.stage)
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-3 flex items-center justify-between text-[13.5px] text-muted">
        <span>Card {i + 1} of {queue.length}, stage {s.n}: {s.title}</span>
        <button onClick={() => setQueue(null)} className="hover:text-ink">End session</button>
      </div>
      <div className="graph-paper rounded-xl border border-line p-6 sm:p-8">
        <p className="text-[13px] font-medium text-muted">The moment</p>
        <p className="mt-1 font-serif text-[22px] leading-snug font-semibold text-ink">{c.situation}</p>
        {!shown ? (
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Countdown key={c.id + i} seconds={10} label="Say it out loud" autoStart onEnd={() => setShown(true)} />
            <Button variant="secondary" onClick={() => setShown(true)}>Show the model line</Button>
          </div>
        ) : (
          <>
            <blockquote className="mt-5 rounded-lg border-l-4 border-teal bg-white px-4 py-3 font-serif text-[18px] leading-relaxed text-ink">{c.model}</blockquote>
            <p className="mt-2 text-[14px] text-muted">{c.why}</p>
            <p className="mt-3 rounded-md bg-marker-l px-3 py-2 text-[14px] text-ink">Now say the model line out loud twice, then once in your own words.</p>
            <div className="mt-5">
              <p className="mb-2 text-[14px] font-medium text-ink">How close was your first attempt?</p>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => rate('missed')} className="rounded-lg border border-signal bg-signal-l px-4 py-2 text-[14px] font-medium text-signal-d">Missed it</button>
                <button onClick={() => rate('almost')} className="rounded-lg border border-[#E9C46A] bg-marker-l px-4 py-2 text-[14px] font-medium text-[#8A6A00]">Almost</button>
                <button onClick={() => rate('nailed')} className="rounded-lg border border-good bg-good-l px-4 py-2 text-[14px] font-medium text-good">Nailed it</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const HOW = [
  ['Read the flow', 'Ten stages, in the order they happen in a real interview. Each has the exact words to use.'],
  ['Say the lines out loud', 'Reading isn\'t enough. Under pressure you only say what you\'ve already said many times.'],
  ['Train for 5 minutes a day', 'The trainer at the bottom tests you on the phrases. Ones you miss come back sooner.'],
]

export default function PerfectCasing() {
  const { user } = useStore()
  const [stage, setStage] = useState<number | null>(null)
  useScrollToTarget()
  const train = (n: number | null) => { setStage(n); setTimeout(() => document.getElementById('trainer')?.scrollIntoView({ behavior: 'smooth' }), 30) }
  const nav = [...STAGES_PC.map((x) => ({ id: `stage-${x.n}`, label: `${x.n}. ${x.title.replace(/ \(.*\)/, "")}`, locked: !user && x.n > 2 })), { id: 'trainer', label: 'Phrase trainer', locked: !user }]
  return (
    <>
      <PageHeader title="Perfect casing" intro="The choreography of a strong case, from the first sentence to the recommendation, with the exact words to use at each moment. Read it top to bottom once, then train the phrases daily until they come out on their own." />
      <ol className="mb-5 grid gap-2 sm:grid-cols-3">
        {HOW.map(([t, d], i) => (
          <li key={t} className="rounded-lg border border-line bg-white px-4 py-3">
            <div className="text-[14px] font-semibold text-ink"><span className="mr-1.5 text-teal-d">{i + 1}</span>{t}</div>
            <p className="mt-0.5 text-[13.5px] text-muted">{d}</p>
          </li>
        ))}
      </ol>
      <StickyNav items={nav} gateId="pc-gate" />
      <div className="space-y-6">
        {STAGES_PC.slice(0, 2).map((s) => <Stage key={s.n} s={s} onTrain={train} />)}
        <Gate id="pc-gate" title="Sign in to see all 10 stages" body="Stages 3 to 10 cover clarifying, structuring, driving the case, charts, maths, brainstorming, the recommendation, and habits that matter throughout. Free.">
          <div className="space-y-6">{STAGES_PC.slice(2).map((s) => <Stage key={s.n} s={s} onTrain={train} />)}</div>
        </Gate>
        <section id="trainer" className="scroll-mt-32 pt-4">
          <h2 className="mb-1 text-[28px] font-semibold">Phrase trainer</h2>
          <p className="mb-4 text-muted">Five minutes a day. You see a moment from an interview, say your line out loud, then compare it with a model answer.</p>
          {user ? (
            <>
              {stage && <p className="mb-3 text-[14px] text-muted">Training stage {stage} only. <button className="font-medium text-violet-d hover:underline" onClick={() => setStage(null)}>Train all stages instead</button></p>}
              <Trainer key={stage ?? 'all'} stage={stage} />
            </>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-line bg-white p-5">
              <p className="max-w-xl text-ink-2">The trainer remembers which phrases you've nailed and which you keep missing, so it needs you to sign in.</p>
              <SignInButton label="Sign in to train" />
            </div>
          )}
        </section>
      </div>
    </>
  )
}
