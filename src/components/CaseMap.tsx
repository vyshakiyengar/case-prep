import { Link } from 'react-router-dom'

type L = { label: string; to: string }
interface Stage { n: number; name: string; short: string; time: string; what: string; good: string; learn: L[]; practise: L[] }

export const CASE_FLOW: Stage[] = [
  { n: 1, name: 'Prompt', short: 'Prompt', time: '1-2 min', what: 'The interviewer reads the case. You listen and take notes.', good: 'Write the client, the problem and the goal (with a number and a deadline) at the top of your page, boxed.',
    learn: [{ label: 'Lesson: the opening', to: '/learn/the-opening' }, { label: 'Perfect casing 1', to: '/perfect-casing#stage-1' }], practise: [{ label: 'Read prompts from the casebook', to: '/casebook' }] },
  { n: 2, name: 'Recap and clarifying questions', short: 'Recap + questions', time: '2-3 min', what: 'Play back the problem in two or three sentences, then ask up to three questions.', good: 'Recap the goal, not the whole paragraph. Ask about the goal, the business model and scope; skip anything you could assume.',
    learn: [{ label: 'Lesson: the opening', to: '/learn/the-opening' }, { label: 'Perfect casing 2-3', to: '/perfect-casing#stage-2' }], practise: [{ label: 'Openings in any case', to: '/casebook' }] },
  { n: 3, name: 'Structure', short: 'Structure', time: '3-4 min', what: 'Ask for a minute, draw your issue tree, then walk the interviewer through it.', good: '3-4 branches that are specific to this client and cover the problem without overlap. Talk top-down.',
    learn: [{ label: 'Lesson: structuring', to: '/learn/structuring' }, { label: 'Core frameworks', to: '/frameworks' }, { label: 'Perfect casing 4', to: '/perfect-casing#stage-4' }], practise: [{ label: 'Structuring drill (2 min)', to: '/drills?tab=structure' }] },
  { n: 4, name: 'Hypothesis and leading the case', short: 'Hypothesis + lead', time: '15-20 min', what: 'Say where you think the answer lies and which branch to test first, then drive the analysis.', good: 'State a hypothesis, ask for the data that would prove or kill it, and say the next step after every answer.',
    learn: [{ label: 'Lesson: driving the case', to: '/learn/driving-the-case' }, { label: 'Perfect casing 5', to: '/perfect-casing#stage-5' }], practise: [{ label: 'Live cases with a partner', to: '/interviewer' }] },
  { n: 5, name: 'Analysis: charts, maths, ideas', short: 'Analysis', time: 'within the 15-20 min', what: 'Read exhibits, run the numbers, brainstorm options when asked.', good: 'Headline before details. Talk through the maths. Brainstorm in buckets, not lists. Always say the "so what".',
    learn: [{ label: 'Charts', to: '/learn/charts-and-exhibits' }, { label: 'Maths', to: '/learn/case-maths' }, { label: 'Brainstorming', to: '/learn/brainstorming' }, { label: 'Perfect casing 6-8', to: '/perfect-casing#stage-6' }],
    practise: [{ label: 'Graph library', to: '/graphs' }, { label: 'Maths drill', to: '/drills?tab=maths' }, { label: 'Formulas', to: '/formulas' }] },
  { n: 6, name: 'Recommendation (the CEO answer)', short: 'CEO answer', time: 'final 1-2 min', what: 'The CEO walks in: "What should I do?" You give the answer.', good: 'Answer first, then two or three reasons with numbers, the main risk, and the next steps. Under a minute.',
    learn: [{ label: 'Lesson: the recommendation', to: '/learn/recommendation' }, { label: 'Perfect casing 9', to: '/perfect-casing#stage-9' }], practise: [{ label: 'Record a 60-second answer after each case', to: '/casebook' }] },
]

export function CaseMap() {
  return (
    <div>
      <ol className="mb-5 grid grid-cols-2 gap-1.5 sm:grid-cols-3 xl:grid-cols-6" aria-label="The flow of a case interview">
        {CASE_FLOW.map((s, i) => (
          <li key={s.n}>
            <a href={`#map-${s.n}`} onClick={(e) => { e.preventDefault(); document.getElementById(`map-${s.n}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }) }}
              className={`flex h-full flex-col rounded-lg px-3 py-2.5 text-white hover:opacity-90 ${i === CASE_FLOW.length - 1 ? 'bg-signal' : i === 0 ? 'bg-ink' : 'bg-teal'} ${i < CASE_FLOW.length - 1 ? 'xl:[clip-path:polygon(0_0,calc(100%-10px)_0,100%_50%,calc(100%-10px)_100%,0_100%)] xl:pr-5' : ''}`}>
              <span className="text-[14px] leading-tight font-semibold">{s.n}. {s.short}</span>
              <span className="text-[12px] text-white/80">{s.time}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="mb-4 text-[14.5px] text-muted">Throughout: keep it a conversation, think out loud, and link every finding back to the goal. <Link to="/learn/how-you-come-across" className="font-medium text-violet-d hover:underline">How you come across</Link> · <Link to="/interview-skills" className="font-medium text-violet-d hover:underline">Interview skills</Link></p>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {CASE_FLOW.map((s) => (
          <article key={s.n} id={`map-${s.n}`} className="flex flex-col rounded-xl border border-line bg-white p-4">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-sans text-[16px] font-semibold text-ink"><span className="mr-1.5 text-teal-d">{s.n}</span>{s.name}</h3>
              <span className="shrink-0 text-[12.5px] text-muted">{s.time}</span>
            </div>
            <p className="mt-1 text-[14.5px] text-ink-2">{s.what}</p>
            <p className="mt-2 rounded-md bg-teal-l/50 px-3 py-2 text-[14px] text-ink"><b className="font-semibold text-teal-d">Good looks like: </b>{s.good}</p>
            <div className="mt-auto pt-3 text-[13.5px]">
              <p><span className="text-muted">Learn: </span>{s.learn.map((l, i) => <span key={l.to}>{i > 0 && ' · '}<Link to={l.to} className="font-medium text-violet-d hover:underline">{l.label}</Link></span>)}</p>
              <p className="mt-0.5"><span className="text-muted">Practise: </span>{s.practise.map((l, i) => <span key={l.label}>{i > 0 && ' · '}<Link to={l.to} className="font-medium text-violet-d hover:underline">{l.label}</Link></span>)}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
