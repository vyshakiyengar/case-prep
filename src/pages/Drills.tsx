import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { drillStats } from '../lib/stats'
import { PageHeader } from '../components/ui'
import { StartCard } from './drills/shared'
import { ALL_PROMPTS, ALL_SPOT } from '../content/structureBank'

const LEGACY: Record<string, string> = { maths: '/drills/maths', structure: '/drills/structure', charts: '/drills/charts' }

export default function Drills() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { data, user } = useStore()
  const legacy = params.get('tab')
  if (legacy && LEGACY[legacy]) return <Navigate to={LEGACY[legacy]} replace />
  const s = drillStats(data?.drills || [])
  const pct = (x: number | null) => (x === null ? '' : `, ${Math.round(x * 100)}% right`)
  return (
    <>
      <PageHeader title="Drills" intro="Short exercises for three skills almost every case uses. Each takes a few minutes. Pick one and press Start: there's nothing to set up." />
      <div className="grid max-w-6xl gap-4 lg:grid-cols-3">
        <StartCard title="Case maths" onStart={() => nav('/drills/maths?go=1')}
          body="Quick sums like the ones in a case. Type the answer and see straight away if it's right. If not, you see the quickest way to do it."
          example={<>"What is 15% of 240?"</>}
          meta={s.mathsQuestions ? `You: ${s.mathsQuestions} done${pct(s.mathsAccuracy)}` : 'New questions every round · 10 per round'} />
        <StartCard title="Structuring" onStart={() => nav('/drills/structure?mode=pick')}
          body="Break a business problem into a few clear parts. Start with quick spot-the-flaw questions, then write your own."
          example={<>"A clinic's wait for appointments has risen from 5 to 12 days. How would you break this down?"</>}
          meta={s.structureCount ? `You: ${s.structureCount} done` : `${ALL_SPOT.length} quick questions · ${ALL_PROMPTS.length} to write`} />
        <StartCard title="Reading charts" onStart={() => nav('/drills/charts?mode=quick')}
          body="See a chart, answer one question about it. You're told straight away if you're right and how to work it out."
          example={<>"What share of total revenue comes from the North?"</>}
          meta={s.chartsCount ? `You: ${s.chartsCount} rounds${pct(s.chartAccuracy)}` : 'New charts every round · 8 per round'} />
      </div>
      <p className="mt-6 max-w-3xl text-[14.5px] text-ink-2"><b className="font-semibold text-ink">A good habit:</b> one of each a day, before your first practice case. Ten minutes a day does more than an hour once a week.</p>
      <p className="mt-2 max-w-3xl text-[14px] text-muted">Each drill has more ways to practise once you're in: timed rounds and harder levels for maths, writing your own structures, and exhibits from the casebook.{!user && <> <Link to="/signin?next=/drills" className="font-medium text-violet-d hover:underline">Sign in</Link> to keep your scores.</>}</p>
    </>
  )
}
