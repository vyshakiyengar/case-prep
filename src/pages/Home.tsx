import { CaseOfTheDay, Readiness } from '../components/Daily'
import { ArtMap, ArtMaths, ArtStructure, ArtCharts, ArtSkills } from '../components/Art'
import { CASE_COUNT } from '../content/caseCount'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { LESSONS } from '../content/course'
import { CARDS } from '../content/perfectCasing'
import { dayScore, drillStats, streak } from '../lib/stats'
import { todayIso } from '../lib/dates'
import { SignInButton } from './SignIn'

const GRAPH_KEY = 'case-prep-graph-library-v1'
const graphsDone = () => { try { const v = JSON.parse(localStorage.getItem(GRAPH_KEY) || '[]'); return Array.isArray(v) ? v.length : 0 } catch { return 0 } }

export default function Home() {
  const { user, data } = useStore()
  const learned = new Set(data?.profile?.learned || [])
  const lessonsDone = LESSONS.filter((l) => learned.has(l.slug)).length
  const nextLesson = LESSONS.find((l) => !learned.has(l.slug))
  const boxes = Object.values(data?.profile?.trainer || {})
  const mastered = boxes.filter((b) => b.box >= 3).length
  const cases = data?.cases || []
  const casebookDone = Math.max(new Set(cases.filter((c) => /^Casebook #/.test(c.source)).map((c) => c.source)).size, (data?.profile?.practised || []).length)
  const today = data ? dayScore(data.days[todayIso()]) : 0
  const st = data ? streak(data.days) : 0
  const g = graphsDone()
  const ds = drillStats(data?.drills || [])

  const progress: Record<string, { v: number; max?: number; text: string } | undefined> = user ? {
    '/learn': { v: lessonsDone, max: LESSONS.length, text: `${lessonsDone} of ${LESSONS.length} lessons` },
    '/perfect-casing': { v: mastered, max: CARDS.length, text: `${mastered} of ${CARDS.length} phrases mastered` },
    '/casebook': { v: casebookDone, max: CASE_COUNT, text: `${casebookDone} of ${CASE_COUNT} cases practised` },
    '/graphs': { v: g, max: 64, text: `${g} of 64 charts done` },
    '/drills/maths': ds.mathsQuestions ? { v: ds.mathsQuestions, text: `${ds.mathsQuestions} questions, ${Math.round((ds.mathsAccuracy || 0) * 100)}% right` } : undefined,
    '/drills/structure': ds.structureCount ? { v: ds.structureCount, text: `${ds.structureCount} structures done` } : undefined,
    '/drills/charts': ds.chartsCount ? { v: ds.chartsCount, text: `${ds.chartsCount} chart rounds done` } : undefined,
    '/today': { v: today, max: 8, text: `${today} of 8 habits today${st > 1 ? `, ${st}-day streak` : ''}` },
    '/cases': { v: cases.length, text: `${cases.length} case${cases.length === 1 ? '' : 's'} logged` },
    '/stories': { v: data?.stories.length || 0, text: `${data?.stories.length || 0} stories written` },
  } : { '/graphs': g ? { v: g, max: 64, text: `${g} of 64 charts done` } : undefined }

  const next = !user ? { label: 'Start with the map of a case interview', to: '/learn#case-map' }
    : lessonsDone < 3 && nextLesson ? { label: `Continue: lesson ${LESSONS.indexOf(nextLesson) + 1}, ${nextLesson.title.split(':')[0]}`, to: `/learn/${nextLesson.slug}` }
    : boxes.length < 5 ? { label: 'Train your first perfect-casing phrases (5 min)', to: '/perfect-casing#trainer' }
    : !cases.length ? { label: 'Do case 1: Coastal Brew', to: '/casebook/coastal-brew' }
    : nextLesson ? { label: `Continue: lesson ${LESSONS.indexOf(nextLesson) + 1}, ${nextLesson.title.split(':')[0]}`, to: `/learn/${nextLesson.slug}` }
    : { label: 'Do a case and log it', to: '/casebook' }

  const done = Object.entries(progress).filter(([, p]) => p && p.v > 0)
  const name = data?.profile?.name && data.profile.name !== 'You' ? data.profile.name.split(' ')[0] : ''

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[25px] leading-[1.12] font-semibold sm:text-[30px]">{user ? `Welcome back${name ? `, ${name}` : ''}` : 'Welcome to PrepForCase'}</h1>
      </header>

      <section className="relative mb-6 flex flex-wrap items-center justify-between gap-4 overflow-hidden rounded-xl bg-ink p-5 text-white sm:p-5 md:pr-56">
        <div aria-hidden className="pointer-events-none absolute -right-2 -bottom-6 hidden w-56 opacity-90 md:block [&_path:first-of-type]:opacity-0">{<ArtMap />}</div>
        <div>
          <p className="text-[13px] font-semibold text-teal-l">Your next step</p>
          <p className="mt-0.5 font-serif text-[19px] leading-snug font-semibold">{next.label}</p>

        </div>
        <div className="relative flex flex-wrap gap-2">
          <Link to={next.to} className="rounded-lg bg-white px-4 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-teal-l">Go</Link>
          {!user && <SignInButton label="Sign in to track progress" />}
        </div>
      </section>

      <div className={`mb-8 grid gap-4 ${user ? 'xl:grid-cols-[1.15fr_1fr]' : ''}`}>
        <CaseOfTheDay />
        {user && <Readiness />}
      </div>

      <section>
        <h2 className="mb-3 text-[19px] font-semibold">Ten-minute warm-ups</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { to: '/drills/maths?go=1', t: 'Case maths', d: '10 quick sums, marked as you go', A: ArtMaths },
            { to: '/drills/structure?mode=pick', t: 'Structuring', d: 'Spot the flaw in a structure', A: ArtStructure },
            { to: '/drills/charts?mode=quick', t: 'Reading charts', d: '8 charts, 60 seconds each', A: ArtCharts },
            { to: '/interview-skills', t: 'Think and speak', d: 'Exercises for how you come across', A: ArtSkills },
          ].map(({ to, t, d, A }) => (
            <Link key={to} to={to} className="group flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-white p-2 pr-4 hover:border-ink/40">
              <div aria-hidden className="w-28 shrink-0 rounded-lg bg-canvas px-1"><A /></div>
              <div className="min-w-0">
                <h3 className="font-sans text-[15px] font-semibold text-ink group-hover:text-violet-d">{t}</h3>
                <p className="text-[13px] leading-snug text-muted">{d}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section className="mt-9">
          <h2 className="mb-3 text-[19px] font-semibold">Your progress</h2>
          <ul className="flex flex-wrap gap-2">
            {done.map(([to, p]) => (
              <li key={to}><Link to={to} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13.5px] text-ink-2 hover:border-ink/40 hover:text-ink">{p!.text}</Link></li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
