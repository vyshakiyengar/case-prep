import { Link, Navigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { drillStats } from '../lib/stats'
import { SKILLS } from '../lib/speedMaths'
import { FAMILIES } from '../lib/chartDrills'
import { STRUCTURE_PICKS, STRUCTURE_PROMPTS } from '../content/structureDrills'
import { PageHeader } from '../components/ui'

const LEGACY: Record<string, string> = { maths: '/drills/maths', structure: '/drills/structure', charts: '/drills/charts' }

export default function Drills() {
  const [params] = useSearchParams()
  const { data, user } = useStore()
  const legacy = params.get('tab')
  if (legacy && LEGACY[legacy]) return <Navigate to={LEGACY[legacy]} replace />
  const s = drillStats(data?.drills || [])
  const pct = (x: number | null) => (x === null ? null : `${Math.round(x * 100)}%`)
  const CARDS = [
    { to: '/drills/maths', title: 'Speed maths', what: `${SKILLS.length} skills of case maths at three levels: percentages, big numbers, breakevens, growth, valuation. Typed answers, marked instantly.`,
      modes: 'Two-minute sprint · ten questions at interview pace · untimed practice', stat: s.mathsQuestions ? `${s.mathsQuestions} questions, ${pct(s.mathsAccuracy)} right` : null },
    { to: '/drills/structure', title: 'Structuring', what: `${STRUCTURE_PROMPTS.length} prompts with a model structure, where to start and the usual trap, plus ${STRUCTURE_PICKS.length} spot-the-flaw questions.`,
      modes: 'Build one in two minutes · spot the flaw', stat: s.structureCount ? `${s.structureCount} done${s.structureAvg ? `, average ${s.structureAvg.toFixed(1)} / 5` : ''}` : null },
    { to: '/drills/charts', title: 'Chart reading', what: `New exhibits every time in ${FAMILIES.length} formats (bar, line, stacked, waterfall, Mekko), one question each, plus real exhibits from the casebook.`,
      modes: 'Quick reads in 60 seconds · find the insight in 90', stat: s.chartsCount ? `${s.chartsCount} rounds${s.chartAccuracy !== null ? `, ${pct(s.chartAccuracy)} right` : ''}` : null },
  ]
  return (
    <>
      <PageHeader title="Drills" intro="Cases test three skills over and over: maths under pressure, structuring on the spot and reading exhibits. Drill them separately, a few minutes at a time, until they are automatic." />
      <div className="grid max-w-5xl gap-4 md:grid-cols-3">
        {CARDS.map((c) => (
          <Link key={c.to} to={c.to} className="group flex flex-col rounded-xl border border-line bg-white p-5 transition-[border-color,box-shadow] hover:border-ink hover:shadow-[0_0_0_1px_#0F1B33]">
            <h2 className="text-[22px] group-hover:underline">{c.title}</h2>
            <p className="mt-2 text-[14.5px] text-ink-2">{c.what}</p>
            <p className="mt-3 text-[13.5px] text-muted">{c.modes}</p>
            {c.stat && <p className="mt-auto pt-4 text-[13.5px] font-medium text-teal-d">You: {c.stat}</p>}
          </Link>
        ))}
      </div>
      <section className="mt-10 max-w-3xl">
        <h2 className="text-[24px]">A 10-minute daily routine</h2>
        <p className="mt-1 text-[15px] text-ink-2">Short and daily beats long and weekly. Do this before your first case of the day.</p>
        <ol className="mt-4 space-y-3">
          {[
            ['/drills/maths', 'Two speed-maths sprints', '4 minutes. Write down your score; beat it tomorrow.'],
            ['/drills/structure', 'Two structuring prompts', '4 minutes. Say the structure out loud, then mark it honestly.'],
            ['/drills/charts', 'One round of chart quick reads', '2 to 3 minutes. Units and the base of every % are where marks go.'],
          ].map(([to, title, body], i) => (
            <li key={to} className="flex gap-4 rounded-lg border border-line bg-white p-4">
              <span className="font-serif text-[22px] leading-none font-semibold text-teal-d">{i + 1}</span>
              <span><Link to={to} className="font-medium text-ink hover:underline">{title}</Link><span className="block text-[14px] text-muted">{body}</span></span>
            </li>
          ))}
        </ol>
        {!user && <p className="mt-4 text-[14px] text-muted"><Link to="/signin?next=/drills" className="font-medium text-violet-d hover:underline">Sign in</Link> to save your scores and see accuracy by skill.</p>}
      </section>
    </>
  )
}
