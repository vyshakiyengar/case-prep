import { CASE_COUNT } from '../content/caseCount'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { LEARN, PRACTISE, DRILLS, REFERENCE, PREP, Icon } from '../components/AppShell'
import { LESSONS } from '../content/course'
import { CARDS } from '../content/perfectCasing'
import { dayScore, drillStats, streak } from '../lib/stats'
import { todayIso } from '../lib/dates'
import { SignInButton } from './SignIn'

type Item = { to: string; label: string; icon: string }
const ABOUT: Record<string, string> = {
  '/learn': 'Start here: 11 short lessons',
  '/perfect-casing': 'What to say at every stage',
  '/frameworks': '11 trees to structure any case',
  '/casebook': `${CASE_COUNT} cases to practise`,
  '/interviewer': 'Give a case to a friend',
  '/graphs': '64 charts to read',
  '/drills': 'A 10-minute daily routine',
  '/drills/maths': 'Timed case maths, marked instantly',
  '/drills/structure': '30 prompts with model answers',
  '/drills/charts': 'Read exhibits against the clock',
  '/interview-skills': 'Think and speak clearly',
  '/case-types': 'The 16 kinds of case',
  '/formulas': '20 formulas for case maths',
  '/glossary': 'Business terms, plain English',
  '/today': 'Your day at a glance',
  '/tracker': 'Daily habits',
  '/cases': 'Every case, and one fix',
  '/stories': 'Your behavioural stories',
  '/partners': 'Practise with friends',
  '/perks': 'Verify your school email',
}

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

  const COLS: { n: number; title: string; sub: string; items: Item[]; tone: string }[] = [
    { n: 1, title: 'Learn', sub: 'Understand how a case works', items: LEARN, tone: 'bg-teal' },
    { n: 2, title: 'Practise', sub: 'Build the skill until it is automatic', items: [...PRACTISE, ...DRILLS.filter((d) => d.to !== '/drills')], tone: 'bg-violet' },
    { n: 3, title: 'Look things up', sub: 'Quick reference, any time', items: REFERENCE, tone: 'bg-ink' },
    { n: 4, title: 'Track and improve', sub: 'Log it, find the weak spot, fix one thing', items: PREP, tone: 'bg-signal' },
  ]
  const name = data?.profile?.name && data.profile.name !== 'You' ? data.profile.name.split(' ')[0] : ''

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[34px] leading-tight font-semibold">{user ? `Welcome back${name ? `, ${name}` : ''}` : 'Welcome to PrepForCase'}</h1>
        <p className="mt-1 max-w-2xl text-[16.5px] text-muted">Learn it, practise it, look it up, track it. Start with your next step below.</p>
      </header>

      <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-5 text-white sm:p-6">
        <div>
          <p className="text-[13px] font-semibold text-teal-l">Your next step</p>
          <p className="mt-0.5 font-serif text-[22px] leading-snug font-semibold">{next.label}</p>

        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={next.to} className="rounded-lg bg-white px-4 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-teal-l">Go</Link>
          {!user && <SignInButton label="Sign in to track progress" />}
        </div>
      </section>

      <h2 className="mb-3 text-[22px] font-semibold">Everything on the site</h2>
      <div className="grid gap-4 lg:grid-cols-4">
        {COLS.map((col, ci) => (
          <section key={col.n} className="relative flex flex-col rounded-2xl border border-line bg-white p-4">
            {ci < COLS.length - 1 && <span aria-hidden className="absolute top-7 -right-[15px] z-10 hidden h-6 w-6 items-center justify-center rounded-full border border-line bg-white text-[13px] text-faint lg:flex">→</span>}
            <div className="mb-3 flex items-center gap-2.5">
              <span className={`flex h-8 w-8 items-center justify-center rounded-full font-serif text-[16px] font-semibold text-white ${col.tone}`}>{col.n}</span>
              <div>
                <h3 className="font-sans text-[17px] font-semibold text-ink">{col.title}</h3>
                <p className="text-[12.5px] text-muted">{col.sub}</p>
              </div>
            </div>
            <ul className="space-y-0.5">
              {col.items.map((it) => {
                const pr = progress[it.to]
                const locked = !user && col.n === 4
                return (
                  <li key={it.to}>
                    <Link to={it.to} className="flex items-start gap-2.5 rounded-lg px-2 py-2 hover:bg-canvas">
                      <span className="mt-0.5 text-muted"><Icon d={it.icon} /></span>
                      <span className="min-w-0">
                        <span className="block text-[15px] font-semibold text-ink">{it.label}{locked && <span className="ml-2 text-[11.5px] font-normal text-faint">sign in</span>}</span>
                        <span className="block text-[13px] text-muted">{pr && pr.v > 0 ? <span className="font-medium text-teal-d">{pr.text}</span> : ABOUT[it.to]}</span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

    </>
  )
}
