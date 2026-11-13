import { CaseOfTheDay, Readiness } from '../components/Daily'
import { ArtMaths, ArtStructure, ArtCharts, ArtSkills, IndustryCardBody, INDUSTRY_CARD } from '../components/Art'
import { CASE_PICKS, DIFF_WORD } from '../content/casePicks'
import { TryOne } from './Landing'
import { useState } from 'react'
import { CORE } from '../content/frameworkTrees'
import { GLOSSARY } from '../content/glossary'
import { CASE_COUNT } from '../content/caseCount'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { LESSONS } from '../content/course'
import { CARDS } from '../content/perfectCasing'
import { dayScore, drillStats, streak } from '../lib/stats'
import { todayIso } from '../lib/dates'

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

  // The road to an offer, ticked off from what this person has actually done
  const practisedAny = casebookDone > 0 || cases.length > 0
  const drilled = (data?.drills || []).length > 0
  const total = Math.max(casebookDone, cases.length)
  const withFriend = cases.some((c) => c.with !== 'Self')
  const road = [
    { t: 'Lesson 1', d: 'How case interviews work', done: learned.has('how-case-interviews-work'), to: '/learn/how-case-interviews-work' },
    { t: 'Your first case', d: practisedAny ? 'Done' : 'Coastal Brew, 25 minutes', done: practisedAny, to: '/casebook/coastal-brew' },
    { t: 'A drill', d: drilled ? 'Done' : 'Ten minutes of case maths', done: drilled, to: '/drills/maths?go=1' },
    { t: 'Ten cases in', d: `${Math.min(total, 10)} of 10`, done: total >= 10, to: '/casebook' },
    { t: 'Case with a friend', d: withFriend ? 'Done' : 'Swap with interviewer mode', done: withFriend, to: '/interviewer' },
  ]
  const at = road.findIndex((r) => !r.done)
  const toGo = data?.profile?.interviewDate ? Math.round((Date.parse(data.profile.interviewDate) - Date.parse(todayIso())) / 86400000) : null
  const sub = [toGo !== null && toGo > 0 ? `${toGo} day${toGo === 1 ? '' : 's'} to your interview.` : null, st > 1 ? `${st}-day streak.` : null].filter(Boolean).join(' ')

  return (
    <>
      <header className="mb-6">
        <h1 className="text-[25px] leading-[1.12] font-semibold sm:text-[30px]">{user ? `Welcome back${name ? `, ${name}` : ''}` : 'Welcome to PrepForCase'}</h1>
        {sub && <p className="mt-1 text-[15px] text-muted">{sub}</p>}
      </header>

      <section className="relative mb-6 overflow-hidden rounded-xl bg-ink p-5 text-white sm:p-6">
        <div aria-hidden className="pointer-events-none absolute -top-20 right-[8%] h-60 w-60 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,.22),transparent)] blur-2xl" />
        <div className="relative flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-semibold text-teal-l">Your next step</p>
            <p className="mt-0.5 font-serif text-[21px] leading-snug font-semibold">{next.label}</p>
          </div>
          <Link to={next.to} className="lp-cta inline-flex items-center rounded-lg bg-white px-4 py-2.5 text-[14.5px] font-semibold text-ink hover:bg-teal-l">Go</Link>
        </div>
        <ol className="relative mt-6 grid gap-4 md:grid-cols-6 md:gap-3">
          <span aria-hidden className="absolute top-[9px] right-[9px] left-[9px] hidden h-[2px] bg-white/15 md:block" />
          <span aria-hidden className="absolute top-[9px] left-[9px] hidden h-[2px] bg-teal-l transition-[width] duration-700 md:block" style={{ width: `calc(${((at < 0 ? road.length : at) / road.length) * 100}% - 18px)` }} />
          {road.map((r, k) => (
            <li key={r.t} className="relative flex gap-3 md:block">
              <span aria-hidden className={`relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${r.done ? 'border-teal-l bg-teal-l' : k === at ? 'border-teal-l bg-ink ring-4 ring-teal-l/25' : 'border-white/30 bg-ink'}`}>
                {r.done && <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-ink stroke-[2.5]"><path d="M3.5 8.5l3 3 6-7" /></svg>}
              </span>
              <Link to={r.to} className="group block md:mt-3">
                <span className={`block text-[14.5px] font-medium group-hover:underline ${r.done ? 'text-white/60' : 'text-white'}`}>{r.t}</span>
                <span className="block text-[12.5px] leading-snug text-[#9FB0C6]">{r.d}</span>
              </Link>
            </li>
          ))}
          <li className="relative flex gap-3 md:block">
            <span aria-hidden className="relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 border-white/30 bg-ink">
              <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-teal-l stroke-2"><path d="M4 14V2.5M4 3h7l-1.5 2.5L11 8H4" /></svg>
            </span>
            <div className="md:mt-3"><span className="block font-serif text-[16px] text-teal-l italic">The offer</span></div>
          </li>
        </ol>
      </section>

      <div className="mb-8 grid gap-4 xl:grid-cols-[1.15fr_1fr]">
        <CaseOfTheDay />
        <Readiness />
      </div>

      <TodaysThree />

      <div className="mb-8 grid gap-6 lg:grid-cols-[320px_1fr]">
        <section>
          <h2 className="mb-3 text-[19px] font-semibold">A quick one</h2>
          <TryOne />
        </section>
        <section>
          <h2 className="mb-3 text-[19px] font-semibold">Ten-minute warm-ups</h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { to: '/drills/maths?go=1', t: 'Case maths', d: '10 quick sums, marked as you go', A: ArtMaths },
              { to: '/drills/structure?mode=pick', t: 'Structuring', d: 'Spot the flaw in a structure', A: ArtStructure },
              { to: '/drills/charts?mode=quick', t: 'Reading charts', d: '8 charts, 60 seconds each', A: ArtCharts },
              { to: '/interview-skills', t: 'Think and speak', d: 'Exercises for how you come across', A: ArtSkills },
            ].map(({ to, t, d, A }) => (
              <Link key={to} to={to} className="group flex items-center gap-3 overflow-hidden rounded-xl border border-line bg-white p-2 pr-4 transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink/40 motion-reduce:hover:translate-y-0">
                <div aria-hidden className="w-24 shrink-0 rounded-lg bg-canvas px-1"><A /></div>
                <div className="min-w-0">
                  <h3 className="font-sans text-[15px] font-semibold text-ink group-hover:text-violet-d">{t}</h3>
                  <p className="text-[13px] leading-snug text-muted">{d}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      <section className="mb-8">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[19px] font-semibold">Cases for you</h2>
          <Link to="/casebook" className="text-[14px] font-medium text-violet-d hover:underline">All {CASE_COUNT} cases</Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {picks(data?.profile?.practised || []).map((c) => (
            <Link key={c.slug} to={`/casebook/${c.slug}`} className={INDUSTRY_CARD}>
              <IndustryCardBody label={c.label} title={c.title} sub={c.sub} industry={c.industry} meta={DIFF_WORD[c.diff]} />
            </Link>
          ))}
        </div>
      </section>

      {done.length > 0 && (
        <section>
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


/** Three small things to learn today, rotating daily: a framework, a phrase, a term. */
function TodaysThree() {
  const day = Math.floor(Date.now() / 86400000)
  const fw = CORE[day % CORE.length]
  const card = CARDS[(day * 7) % CARDS.length]
  const term = GLOSSARY[(day * 13) % GLOSSARY.length]
  const [show, setShow] = useState(false)
  const box = 'flex flex-col rounded-xl border border-line bg-white p-4 sm:p-5'
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-[19px] font-semibold">Learn three things today</h2>
      <div className="grid gap-4 lg:grid-cols-3">
        <div className={box}>
          <p className="text-[12.5px] font-medium text-teal-d">Framework</p>
          <h3 className="mt-1 text-[17px]">{fw.title}</h3>
          <p className="mt-1.5 text-[14px] text-ink-2"><span className="text-muted">Ask first:</span> {fw.ask}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {fw.branches.map((b) => <li key={b.t} className="rounded-md bg-teal-l px-2 py-1 text-[12.5px] font-medium text-teal-d">{b.t}</li>)}
          </ul>
          <Link to={`/frameworks#${fw.id}`} className="mt-auto pt-4 text-[14px] font-medium text-violet-d hover:underline">See the full tree</Link>
        </div>
        <div className={box}>
          <p className="text-[12.5px] font-medium text-teal-d">What would you say?</p>
          <p className="mt-1 text-[14.5px] leading-snug text-ink">{card.situation}</p>
          {show
            ? <div className="mt-3 rounded-lg bg-canvas p-3 text-[14px] leading-snug"><p className="text-ink">{card.model}</p><p className="mt-1.5 text-muted">{card.why}</p></div>
            : <button type="button" onClick={() => setShow(true)} className="mt-3 self-start rounded-lg border border-line px-3 py-1.5 text-[13.5px] font-medium text-ink hover:border-ink/40">Show a strong answer</button>}
          <Link to="/perfect-casing#trainer" className="mt-auto pt-4 text-[14px] font-medium text-violet-d hover:underline">Train more phrases</Link>
        </div>
        <div className={box}>
          <p className="text-[12.5px] font-medium text-teal-d">Term</p>
          <h3 className="mt-1 text-[17px]">{term.term}</h3>
          <p className="mt-1.5 text-[14px] text-ink-2">{term.plain}</p>
          <p className="mt-2 text-[13.5px] text-muted">For example: {term.example}</p>
          <Link to="/glossary" className="mt-auto pt-4 text-[14px] font-medium text-violet-d hover:underline">Open the glossary</Link>
        </div>
      </div>
    </section>
  )
}

/** Four unpractised cases from different industries, changing each day. */
function picks(practised: string[]) {
  const day = Math.floor(Date.now() / 86400000)
  const rotated = CASE_PICKS.map((_, i) => CASE_PICKS[(i + day * 4) % CASE_PICKS.length])
  return [...rotated.filter((c) => !practised.includes(c.slug)), ...rotated.filter((c) => practised.includes(c.slug))].slice(0, 4)
}
