import { ArtPractise, ArtMaths, ArtStructure, ArtCharts, ArtSizing } from '../components/Art'
import { SIZING } from '../content/sizingDrills'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useStore } from '../lib/store'
import { drillStats } from '../lib/stats'
import { PageHeader } from '../components/ui'
import { StartCard } from './drills/shared'
import { ALL_PROMPTS, ALL_SPOT } from '../content/structureBank'

const LEGACY: Record<string, string> = { maths: '/drills/maths', structure: '/drills/structure', charts: '/drills/charts' }

export default function Drills() {
  const [params] = useSearchParams()
  const nav = useNavigate()
  const { data } = useStore()
  const legacy = params.get('tab')
  if (legacy && LEGACY[legacy]) return <Navigate to={LEGACY[legacy]} replace />
  const s = drillStats(data?.drills || [])
  const pct = (x: number | null) => (x === null ? '' : `, ${Math.round(x * 100)}% right`)
  return (
    <>
      <PageHeader title="Drills" art={<ArtPractise />} intro="Four skills every case uses. A few minutes each." />
      <div className="grid max-w-6xl gap-4 md:grid-cols-2 2xl:grid-cols-4">
        <StartCard title="Case maths" art={<ArtMaths />} onStart={() => nav('/drills/maths?go=1')}
          body="Quick sums, marked as you go."
          example={<>"What is 15% of 240?"</>}
          meta={s.mathsQuestions ? `You: ${s.mathsQuestions} done${pct(s.mathsAccuracy)}` : '10 per round'} />
        <StartCard title="Structuring" art={<ArtStructure />} onStart={() => nav('/drills/structure?mode=pick')}
          body="Spot the flaw in a structure, then write your own."
          example={<>"Why has a clinic's wait gone from 5 to 12 days?"</>}
          meta={s.structureCount ? `You: ${s.structureCount} done` : `${ALL_SPOT.length + ALL_PROMPTS.length} questions`} />
        <StartCard title="Reading charts" art={<ArtCharts />} onStart={() => nav('/drills/charts?mode=quick')}
          body="One chart, one question, sixty seconds."
          example={<>"What share of total revenue comes from the North?"</>}
          meta={s.chartsCount ? `You: ${s.chartsCount} rounds${pct(s.chartAccuracy)}` : '8 per round'} />
        <StartCard title="Market sizing" art={<ArtSizing />} onStart={() => nav('/drills/sizing')}
          body="Estimate it, then compare with a model answer."
          example={<>"How many cups of coffee do London cafés sell on a weekday?"</>}
          meta={`${SIZING.length} questions`} />
      </div>
      <p className="mt-6 text-[14px] text-muted">Tip: one of each a day beats an hour once a week.</p>
    </>
  )
}
