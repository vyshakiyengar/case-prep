import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { LEARN, PRACTISE, REFERENCE, PREP, Icon } from '../components/AppShell'
import { LESSONS } from '../content/course'
import { CARDS } from '../content/perfectCasing'
import { dayScore, streak } from '../lib/stats'
import { todayIso } from '../lib/dates'
import { LinkButton, Meter } from '../components/ui'
import { SignInButton } from './SignIn'

type Item = { to: string; label: string; icon: string }
const ABOUT: Record<string, string> = {
  '/learn': 'Start here. The map of a case interview, then 11 short lessons.',
  '/perfect-casing': 'What a perfect case sounds like, stage by stage, plus a daily phrase trainer.',
  '/frameworks': '10 core frameworks as trees, the drivers to dig into, and others to remember.',
  '/casebook': '15 original cases with a step-by-step player and coaching at each step.',
  '/interviewer': 'Give a case to a partner: what to read, what to reveal, what to push on.',
  '/graphs': '64 chart exercises: read the chart, find the insight, say the "so what".',
  '/drills': 'Short timed drills: structuring, chart reading, mental maths.',
  '/interview-skills': 'Thinking, speaking and sounding commercial: a daily 30-minute routine.',
  '/case-types': 'The 16 kinds of case: what to ask first and the trap to avoid.',
  '/formulas': 'The 20 formulas for case maths, with a test-yourself mode.',
  '/glossary': 'Business terms in plain English, with examples.',
  '/today': 'Your day at a glance: habits, next focus, scores.',
  '/tracker': 'Daily habits across six weeks, so you can see your consistency.',
  '/cases': 'Every case you practise: scores by stage, the mistake, and one fix.',
  '/stories': 'Build your FIT stories: leadership, teamwork, failure, why consulting.',
  '/partners': 'Invite practice partners and see each other\'s progress.',
  '/perks': 'Verify your business school email for free downloads and discounts.',
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
  const casebookDone = new Set(cases.filter((c) => /^Casebook #/.test(c.source)).map((c) => c.source)).size
  const today = data ? dayScore(data.days[todayIso()]) : 0
  const st = data ? streak(data.days) : 0
  const g = graphsDone()

  const progress: Record<string, { v: number; max?: number; text: string } | undefined> = user ? {
    '/learn': { v: lessonsDone, max: LESSONS.length, text: `${lessonsDone} of ${LESSONS.length} lessons` },
    '/perfect-casing': { v: mastered, max: CARDS.length, text: `${mastered} of ${CARDS.length} phrases mastered` },
    '/casebook': { v: casebookDone, max: 15, text: `${casebookDone} of 15 cases done` },
    '/graphs': { v: g, max: 64, text: `${g} of 64 charts done` },
    '/drills': { v: data?.drills.length || 0, text: `${data?.drills.length || 0} drills done` },
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
    { n: 2, title: 'Practise', sub: 'Build the skill until it is automatic', items: PRACTISE, tone: 'bg-violet' },
    { n: 3, title: 'Look things up', sub: 'Quick reference, any time', items: REFERENCE, tone: 'bg-ink' },
    { n: 4, title: 'Track and improve', sub: 'Log it, find the weak spot, fix one thing', items: PREP, tone: 'bg-signal' },
  ]
  const name = data?.profile?.name && data.profile.name !== 'You' ? data.profile.name.split(' ')[0] : ''

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[34px] leading-tight font-semibold">{user ? `Welcome back${name ? `, ${name}` : ''}` : 'Welcome to Case Prep OS'}</h1>
        <p className="mt-1 max-w-2xl text-[16.5px] text-muted">Everything on the site, in the order to use it. Learn a skill, practise it, look things up when you need to, and track what to fix next.</p>
      </header>

      <section className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-ink p-5 text-white sm:p-6">
        <div>
          <p className="text-[13px] font-semibold text-teal-l">Your next step</p>
          <p className="mt-0.5 font-serif text-[22px] leading-snug font-semibold">{next.label}</p>
          {user && <p className="mt-1 text-[14px] text-white/75">{lessonsDone} of {LESSONS.length} lessons · {mastered} phrases mastered · {cases.length} cases logged · {today} of 8 habits today</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to={next.to} className="rounded-lg bg-white px-4 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-teal-l">Go</Link>
          {!user && <SignInButton label="Sign in to track progress" />}
        </div>
      </section>

      <h2 className="mb-1 text-[24px] font-semibold">Site map</h2>
      <p className="mb-4 text-muted">Four parts. Work left to right, then loop: every case you log tells you what to learn or practise next.</p>
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
            <ul className="space-y-2">
              {col.items.map((it) => {
                const pr = progress[it.to]
                const locked = !user && col.n === 4
                return (
                  <li key={it.to}>
                    <Link to={it.to} className="block rounded-xl border border-line px-3 py-2.5 hover:border-faint hover:bg-canvas/60">
                      <div className="flex items-center gap-2 text-ink"><Icon d={it.icon} /><span className="text-[15px] font-semibold">{it.label}</span>{locked && <span className="ml-auto text-[11.5px] text-faint">sign in</span>}</div>
                      <p className="mt-0.5 text-[13px] leading-snug text-muted">{ABOUT[it.to]}</p>
                      {pr && (
                        <div className="mt-1.5 flex items-center gap-2">
                          {pr.max ? <Meter value={pr.v} max={pr.max} color="bg-teal" /> : null}
                          <span className="shrink-0 text-[12px] font-medium text-teal-d tabular-nums">{pr.text}</span>
                        </div>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {[
          ['New to case interviews?', 'Read the map of a case interview, then the first three lessons. About 35 minutes.', '/learn#case-map', 'Open the map'],
          ['Interview in a few weeks?', 'Follow the 6-week plan: lessons in week 1, then a case a day with a partner.', '/learn#case-map', 'See the course'],
          ['Practising with a friend?', 'Take turns: one of you runs the case in interviewer mode, then swap.', '/interviewer', 'Interviewer mode'],
        ].map(([t, d, to, cta]) => (
          <div key={t} className="flex flex-col rounded-xl border border-line bg-white p-4">
            <h3 className="font-sans text-[16px] font-semibold text-ink">{t}</h3>
            <p className="mt-1 mb-3 text-[14px] text-muted">{d}</p>
            <div className="mt-auto"><LinkButton to={to} variant="secondary">{cta}</LinkButton></div>
          </div>
        ))}
      </section>
    </>
  )
}
