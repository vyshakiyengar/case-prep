import type { CSSProperties } from 'react'
import { useReveal } from './motion'
import { Link } from 'react-router-dom'

type L = { label: string; to: string }
interface Stage { n: number; name: string; short: string; time: string; what: string; good: string; learn: L[]; practise: L[] }

export const CASE_FLOW: Stage[] = [
  { n: 1, name: 'Prompt', short: 'Prompt', time: '1-2 min', what: 'The interviewer reads the case. You listen and take notes.', good: 'Write the client, the problem and the goal (with a number and a deadline) at the top of your page, boxed.',
    learn: [{ label: 'Lesson: the opening', to: '/learn/the-opening' }, { label: 'Perfect casing 1', to: '/perfect-casing#stage-1' }], practise: [{ label: 'Read prompts from the casebook', to: '/casebook' }] },
  { n: 2, name: 'Recap and clarifying questions', short: 'Recap + questions', time: '2-3 min', what: 'Play back the problem in two or three sentences, then ask up to three questions.', good: 'Recap the goal, not the whole paragraph. Ask about the goal, the business model and scope; skip anything you could assume.',
    learn: [{ label: 'Lesson: the opening', to: '/learn/the-opening' }, { label: 'Perfect casing 2-3', to: '/perfect-casing#stage-2' }], practise: [{ label: 'Openings in any case', to: '/casebook' }] },
  { n: 3, name: 'Structure', short: 'Structure', time: '3-4 min', what: 'Ask for a minute, draw your issue tree, then walk the interviewer through it.', good: '3-4 branches that are specific to this client and cover the problem without overlap. Talk top-down.',
    learn: [{ label: 'Lesson: structuring', to: '/learn/structuring' }, { label: 'Core frameworks', to: '/frameworks' }, { label: 'Perfect casing 4', to: '/perfect-casing#stage-4' }], practise: [{ label: 'Structuring drill (2 min)', to: '/drills/structure' }] },
  { n: 4, name: 'Hypothesis and leading the case', short: 'Hypothesis + lead', time: '15-20 min', what: 'Say where you think the answer lies and which branch to test first, then drive the analysis.', good: 'State a hypothesis, ask for the data that would prove or kill it, and say the next step after every answer.',
    learn: [{ label: 'Lesson: driving the case', to: '/learn/driving-the-case' }, { label: 'Perfect casing 5', to: '/perfect-casing#stage-5' }], practise: [{ label: 'Live cases with a partner', to: '/interviewer' }] },
  { n: 5, name: 'Analysis: charts, maths, ideas', short: 'Analysis', time: 'within the 15-20 min', what: 'Read exhibits, run the numbers, brainstorm options when asked.', good: 'Headline before details. Talk through the maths. Brainstorm in buckets, not lists. Always say the "so what".',
    learn: [{ label: 'Charts', to: '/learn/charts-and-exhibits' }, { label: 'Maths', to: '/learn/case-maths' }, { label: 'Brainstorming', to: '/learn/brainstorming' }, { label: 'Perfect casing 6-8', to: '/perfect-casing#stage-6' }],
    practise: [{ label: 'Graph library', to: '/graphs' }, { label: 'Maths drill', to: '/drills/maths' }, { label: 'Formulas', to: '/formulas' }] },
  { n: 6, name: 'Recommendation (the CEO answer)', short: 'CEO answer', time: 'final 1-2 min', what: 'The CEO walks in: "What should I do?" You give the answer.', good: 'Answer first, then two or three reasons with numbers, the main risk, and the next steps. Under a minute.',
    learn: [{ label: 'Lesson: the recommendation', to: '/learn/recommendation' }, { label: 'Perfect casing 9', to: '/perfect-casing#stage-9' }], practise: [{ label: 'Record a 60-second answer after each case', to: '/casebook' }] },
]

const dot = (i: number) => (i === CASE_FLOW.length - 1 ? 'bg-signal' : i === 0 ? 'bg-ink' : 'bg-teal')

/** The six steps of a case: a rail that fills in order (wide screens), then a card per step. */
export function CaseMap() {
  const ref = useReveal<HTMLDivElement>(0.25)
  return (
    <div ref={ref}>
      <ol aria-hidden className="mb-5 hidden grid-cols-6 md:grid">
        {CASE_FLOW.map((s, i) => (
          <li key={s.n} className="relative flex flex-col items-center px-1 text-center" style={{ '--i': i } as CSSProperties}>
            {i > 0 && <span className="rail-seg absolute top-[15px] right-1/2 h-[2px] w-full" />}
            <span className={`rail-node relative z-10 flex h-8 w-8 items-center justify-center rounded-full font-serif text-[14.5px] font-semibold text-white ring-4 ring-canvas ${dot(i)}`}>{s.n}</span>
            <span className="mt-2 text-[13.5px] font-semibold leading-tight text-ink">{s.short}</span>
            <span className="text-[12px] leading-tight text-muted">{s.time}</span>
          </li>
        ))}
      </ol>
      <ol className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {CASE_FLOW.map((s, i) => (
          <li key={s.n} className="flow-card flex gap-3 rounded-lg border border-line bg-white p-4" style={{ '--i': i } as CSSProperties}>
            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-serif text-[14.5px] font-semibold text-white ${dot(i)}`}>{s.n}</span>
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-2">
                <h3 className="font-sans text-[15px] font-semibold text-ink">{s.short}</h3>
                <span className="text-[12.5px] text-muted">{s.time}</span>
              </div>
              <p className="mt-0.5 text-[14.5px] text-ink-2">{s.what}</p>
              <Link to={s.learn[0].to} className="mt-1 inline-block text-[13.5px] font-medium text-violet-d hover:underline">{s.learn[0].label}</Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
