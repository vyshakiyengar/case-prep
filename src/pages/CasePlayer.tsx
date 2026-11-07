import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { loadCases } from '../content'
import type { CaseDef } from '../content'
import { Loading } from '../App'
import { Button } from '../components/ui'
import { Countdown, mmss, useStopwatch } from '../components/Timer'
import { ExhibitView, Rich, StructureTree } from '../components/CaseParts'
import { CaseForm } from './CaseLog'
import { Difficulty } from './Casebook'
import { STAGES } from '../lib/types'
import { useStore } from '../lib/store'
import { SignInButton } from './SignIn'
import type { CaseQuestion } from '../content'

type Kind = 'clarify' | 'structure' | 'chart' | 'maths' | 'ideas' | 'reco' | 'judge' | 'sizing'
const PC: Record<Kind, number> = { clarify: 3, structure: 4, chart: 6, maths: 7, sizing: 7, ideas: 8, judge: 5, reco: 9 }
const COACH: Record<Kind, { checks: string[]; lesson: string; lessonTitle: string }> = {
  clarify: { checks: ['Recapped in three sentences or fewer', 'Checked the goal and deadline', 'Asked only questions that change my structure'], lesson: 'the-opening', lessonTitle: 'The opening' },
  structure: { checks: ['3-4 buckets with no overlaps', 'Branch names specific to this client', 'Said where I\u2019d start, and why'], lesson: 'structuring', lessonTitle: 'Structuring' },
  chart: { checks: ['Read the title, axes, units and footnote', 'Led with one insight, with a number', 'Linked it to the client\u2019s goal', 'Said where I\u2019d go next'], lesson: 'charts-and-exhibits', lessonTitle: 'Reading charts and exhibits' },
  maths: { checks: ['Said my approach before calculating', 'Talked through the numbers out loud', 'Sanity-checked the size of the answer', 'Said what it means for the client'], lesson: 'case-maths', lessonTitle: 'Case maths' },
  ideas: { checks: ['Grouped ideas into 2-3 buckets', 'Gave 2-3 ideas in each bucket', 'Picked one to start with, and said why'], lesson: 'brainstorming', lessonTitle: 'Brainstorming' },
  judge: { checks: ['Said clearly whether I agree', 'Explained the logic step by step', 'Said what it means for the decision'], lesson: 'structuring', lessonTitle: 'Structuring and hypotheses' },
  sizing: { checks: ['Clarified units, time period and geography', 'Said a rough guess first', 'Segmented sensibly, with round numbers', 'Sanity-checked another way'], lesson: 'market-sizing', lessonTitle: 'Market sizing' },
  reco: { checks: ['Opened with the answer', 'Gave 2-3 reasons, each with a number', 'Named the main risk', 'Gave next steps'], lesson: 'recommendation', lessonTitle: 'The recommendation' },
}
const kindOf = (q: CaseQuestion): Kind => {
  const t = q.q.toLowerCase()
  if (/do you agree/.test(t)) return 'judge'
  if (/estimate|sanity-check this/.test(t)) return 'sizing'
  if (/economics|which is better|fill the remaining|change the answer/.test(t)) return 'maths'
  if (/^(what could|what else|what risks|what concerns|how would you protect|what should|brainstorm)|risks should|do instead|else should/.test(t)) return 'ideas'
  if (/how much|how many|what ebitda|calculate|worth it|net effect|what is the prize|annual growth|growth rate|value the deal|impact|break even|when does|run out|profit is at risk|is .* worth|which price|change your answer|market share would/.test(t)) return 'maths'
  if (q.exhibit) return 'chart'
  return 'ideas'
}

function Coach({ kind }: { kind: Kind }) {
  const c = COACH[kind]
  const [on, setOn] = useState<Record<number, boolean>>({})
  return (
    <div className="mt-4 rounded-lg border border-line bg-canvas/60 p-4">
      <div className="text-[13.5px] font-semibold text-ink">Before you look, did you…</div>
      <ul className="mt-2 grid gap-1.5 sm:grid-cols-2">
        {c.checks.map((x, k) => (
          <li key={x}>
            <label className="flex cursor-pointer items-start gap-2 text-[14px] text-ink-2">
              <input type="checkbox" className="mt-1 h-4 w-4 accent-[#0E9AA7]" checked={!!on[k]} onChange={(e) => setOn((o) => ({ ...o, [k]: e.target.checked }))} />{x}
            </label>
          </li>
        ))}
      </ul>
      <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] font-medium">
        <Link to={`/perfect-casing#stage-${PC[kind]}`} className="text-teal-d hover:underline">What to say here (perfect casing)</Link>
        <Link to={`/learn/${c.lesson}`} className="text-violet-d hover:underline">Stuck? Lesson: {c.lessonTitle}</Link>
      </div>
    </div>
  )
}

type Step = { key: string; label: string }

function Reveal({ shown, onShow, label, children }: { shown: boolean; onShow: () => void; label: string; children: React.ReactNode }) {
  return shown ? <div className="mt-4">{children}</div> : (
    <button onClick={onShow} className="mt-4 w-full rounded-lg border-2 border-dashed border-line bg-white py-4 text-[14.5px] font-medium text-violet-d hover:border-violet hover:bg-violet-l">{label}</button>
  )
}

function Answer({ html, note, interviewer }: { html: string; note?: string; interviewer: boolean }) {
  return (
    <div className="rounded-lg border border-good/40 bg-white p-4">
      <div className="mb-1 text-[13px] font-semibold text-good">Strong answer</div>
      <Rich html={html} />
      {interviewer && note && <p className="mt-2 rounded-md bg-signal-l px-3 py-2 text-[13.5px] text-signal-d"><b className="font-semibold">Interviewer note:</b> {note}</p>}
    </div>
  )
}

export default function CasePlayer() {
  const { slug } = useParams()
  const [params, setParams] = useSearchParams()
  const nav = useNavigate()
  const { user } = useStore()
  const interviewer = params.get('mode') === 'interviewer'
  const [cases, setCases] = useState<CaseDef[] | null>(null)
  const [i, setI] = useState(0)
  const [revealed, setRevealed] = useState<Record<string, boolean>>({})
  const watch = useStopwatch(true)
  useEffect(() => { loadCases().then(setCases) }, [])
  useEffect(() => { setI(0); setRevealed({}); watch.reset() }, [slug, interviewer]) // eslint-disable-line react-hooks/exhaustive-deps
  if (!cases) return <Loading label="Loading case…" />
  const c = cases.find((x) => x.slug === slug)
  if (!c) return <p>That case doesn't exist. <Link className="underline" to="/casebook">Back to the casebook</Link></p>

  const steps: Step[] = [
    { key: 'prompt', label: 'The prompt' },
    { key: 'clarify', label: 'Clarifying questions' },
    { key: 'structure', label: 'Structure' },
    ...c.questions.map((_, k) => ({ key: `q${k}`, label: `Question ${k + 1}` })),
    { key: 'reco', label: 'Recommendation' },
    { key: 'score', label: interviewer ? 'Give feedback' : 'Score yourself' },
  ]
  const step = steps[i]
  const show = (k: string) => setRevealed((r) => ({ ...r, [k]: true }))
  const isOpen = (k: string) => interviewer || !!revealed[k]
  const go = (n: number) => { setI(n); window.scrollTo({ top: 0, behavior: 'smooth' }) }

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link to="/casebook" className="text-[13.5px] text-muted hover:text-ink">Casebook</Link>
          <h1 className="mt-1 text-[30px] leading-tight font-semibold">Case {c.id}: {c.title}</h1>
          <p className="text-ink-2">{c.sub}</p>
          <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[13px] text-muted">
            <span>{c.type}</span><span>{c.industry}, {c.geo}</span><Difficulty d={c.diff} /><span>{c.fmt}</span>
            <Link to="/glossary" className="text-violet-d hover:underline">Unfamiliar term? Glossary</Link>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          <div className="inline-flex overflow-hidden rounded-lg border border-line bg-white text-[13.5px]">
            <button onClick={() => setParams({})} aria-pressed={!interviewer} className={`px-3 py-1.5 ${!interviewer ? 'bg-ink font-medium text-white' : 'text-muted'}`}>Practise alone</button>
            <button onClick={() => setParams({ mode: 'interviewer' })} aria-pressed={interviewer} className={`px-3 py-1.5 ${interviewer ? 'bg-ink font-medium text-white' : 'text-muted'}`}>I'm the interviewer</button>
          </div>
          <div className="flex items-center gap-2 text-[13.5px] text-muted">
            <span className="tabular-nums">Elapsed <b className="font-serif text-[17px] text-ink">{mmss(watch.secs)}</b> of {c.time}</span>
            <button onClick={watch.toggle} className="rounded-md px-2 py-0.5 font-medium text-violet-d hover:bg-violet-l">{watch.running ? 'Pause' : 'Resume'}</button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-[210px_minmax(0,1fr)]">
        <nav aria-label="Case steps" className="min-w-0 lg:sticky lg:top-6 lg:self-start">
          <ol className="flex gap-1 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible">
            {steps.map((s, k) => (
              <li key={s.key} className="shrink-0">
                <button onClick={() => go(k)} aria-current={k === i ? 'step' : undefined}
                  className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-[14px] ${k === i ? 'bg-white font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)]' : k < i ? 'text-ink-2 hover:bg-white/70' : 'text-muted hover:bg-white/70'}`}>
                  <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${k < i ? 'bg-teal text-white' : k === i ? 'bg-ink text-white' : 'bg-line text-muted'}`}>{k < i ? '✓' : k + 1}</span>
                  <span className="whitespace-nowrap">{s.label}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>

        <article className="min-w-0 rounded-xl border border-line bg-white p-5 sm:p-7">
          {step.key === 'prompt' && (
            <>
              <h2 className="text-[22px] font-semibold">{interviewer ? 'Read this aloud to your candidate' : 'Read the prompt'}</h2>
              <blockquote className="graph-paper mt-4 rounded-lg border-l-4 border-teal p-5 font-serif text-[18px] leading-relaxed text-ink">{c.prompt}</blockquote>
              <p className="mt-4 text-muted">
                {interviewer ? 'Let them recap it. A strong recap covers the key points only, then checks it understood the goal.' : 'Now recap it out loud in a few sentences: the client, the problem, and what success looks like. Then move on to your clarifying questions.'}
              </p>
            </>
          )}

          {step.key === 'clarify' && (
            <>
              <h2 className="text-[22px] font-semibold">{interviewer ? 'Give these facts only if asked' : 'Ask up to three clarifying questions'}</h2>
              {!interviewer && <Coach key={`${c.slug}-clarify`} kind="clarify" />}
              <p className="mt-1 text-muted">{interviewer ? 'Good questions change the structure. Note which ones your candidate asks.' : 'Decide what you would ask before you look. Then open the answers to the questions you chose.'}</p>
              <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                {c.clarify.map((f) => (
                  <li key={f.q} className="px-4 py-3">
                    <div className="font-medium text-ink">{f.q}</div>
                    {isOpen(`c-${f.q}`) ? <div className="mt-0.5 text-ink-2">{f.a}</div>
                      : <button onClick={() => show(`c-${f.q}`)} className="mt-0.5 text-[14px] font-medium text-violet-d hover:underline">Show the answer</button>}
                  </li>
                ))}
              </ul>
            </>
          )}

          {step.key === 'structure' && (
            <>
              <h2 className="text-[22px] font-semibold">{interviewer ? 'What a strong structure looks like' : 'Draw your structure on paper'}</h2>
              {!interviewer && (
                <>
                  <p className="mt-1 text-muted">Take up to two minutes. Aim for 3-4 buckets specific to this case, then say which one you'd start with, and why.</p>
                  <div className="mt-4"><Countdown seconds={120} label="Structuring time" /></div>
                  {!isOpen('structure') && <Coach key={`${c.slug}-structure`} kind="structure" />}
                </>
              )}
              <Reveal shown={isOpen('structure')} onShow={() => show('structure')} label="Compare with a strong structure">
                <StructureTree s={c.structure} />
                <p className="mt-3 rounded-lg bg-violet-l px-4 py-3 text-[14.5px] text-ink"><b className="font-semibold">Hypothesis to look for:</b> {c.hypothesis}</p>
                {interviewer && <p className="mt-3 text-[14px] text-muted">Their structure doesn't have to match. It does have to be MECE, specific to this client, and come with a hypothesis.</p>}
              </Reveal>
            </>
          )}

          {step.key.startsWith('q') && (() => {
            const q = c.questions[Number(step.key.slice(1))]
            return (
              <>
                <h2 className="text-[21px] leading-snug font-semibold">{q.q}</h2>
                {q.exhibit && <ExhibitView ex={q.exhibit} />}
                {!interviewer && !isOpen(step.key) && <Coach key={`${c.slug}-${step.key}`} kind={kindOf(q)} />}
                <Reveal shown={isOpen(step.key)} onShow={() => show(step.key)} label="Show the strong answer">
                  <Answer html={q.answer} note={q.note} interviewer={interviewer} />
                </Reveal>
              </>
            )
          })()}

          {step.key === 'reco' && (
            <>
              <h2 className="text-[22px] font-semibold">{interviewer ? 'Ask for the recommendation' : 'Give your recommendation'}</h2>
              <p className="mt-1 text-muted">Start with the answer. Then 2-3 reasons with numbers, the main risk, and next steps. About 60 seconds.</p>
              {!interviewer && <div className="mt-4"><Countdown seconds={60} label="Recommendation" /></div>}
              {!interviewer && !isOpen('reco') && <Coach key={`${c.slug}-reco`} kind="reco" />}
              <Reveal shown={isOpen('reco')} onShow={() => show('reco')} label="Show the model recommendation">
                <div className="rounded-lg bg-ink p-5 text-[15.5px] leading-relaxed text-white">{c.reco}</div>
                <h3 className="mt-5 text-[17px] font-semibold">What separates a 5 from a 3</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-2">{c.great.map((g) => <li key={g}>{g}</li>)}</ul>
              </Reveal>
            </>
          )}

          {step.key === 'score' && (interviewer ? (
            <>
              <h2 className="text-[22px] font-semibold">Give feedback</h2>
              <p className="mt-1 text-muted">Score each stage 1-5 out loud, then agree on one fix together. Your candidate logs it in their own case log.</p>
              <ul className="mt-4 divide-y divide-line rounded-lg border border-line">
                {STAGES.map((s) => <li key={s.key} className="px-4 py-3"><div className="font-medium text-ink">{s.label}</div><div className="text-[14px] text-muted">{s.great}</div></li>)}
              </ul>
              <h3 className="mt-5 text-[17px] font-semibold">For this case, a 5 looks like</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-ink-2">{c.great.map((g) => <li key={g}>{g}</li>)}</ul>
              <Button className="mt-5" variant="secondary" onClick={() => setParams({})}>Swap: practise this case yourself</Button>
            </>
          ) : (
            <>
              <h2 className="text-[22px] font-semibold">Score yourself and pick one fix</h2>
              <p className="mt-1 mb-5 text-muted">Do it now, while the case is fresh. It goes straight into your case log.</p>
              {user ? <CaseForm initial={{ name: c.title, source: `Casebook #${c.id}`, type: c.type, with: 'Self' }} onDone={() => nav('/cases')} />
                : <div className="rounded-lg border border-line bg-canvas/60 p-5">
                    <p className="text-ink-2">Sign in to save your scores to a case log. It tracks your six stage scores across cases and tells you which one to work on next.</p>
                    <div className="mt-4"><SignInButton label="Sign in to save this case" /></div>
                  </div>}
            </>
          ))}

          {step.key !== 'score' && (
            <div className="mt-8 flex items-center justify-between border-t border-line pt-4">
              <Button variant="quiet" disabled={i === 0} onClick={() => go(i - 1)}>Back</Button>
              <Button onClick={() => go(i + 1)}>Next: {steps[i + 1].label.toLowerCase()}</Button>
            </div>
          )}
        </article>
      </div>
    </div>
  )
}
