import { CASE_COUNT } from '../content/caseCount'
import { Link } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import CASE_INDEX from '../content/caseIndex.json'
import { Logo } from '../components/ui'
import { ArtCourse, ArtCasebook, ArtMaths, ArtReference, ArtImprove, ArtMap, ArtStructure, ArtVoice, ArtPerks, IndustryCardBody, INDUSTRY_CARD } from '../components/Art'
import { CASE_PICKS, DIFF_WORD } from '../content/casePicks'
import { MODULES, lessonBySlug, LESSONS, totalMinutes } from '../content/course'


const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Counts up to a number once, after a short delay. */
function CountUp({ to, delay = 0 }: { to: number; delay?: number }) {
  const [n, setN] = useState(() => (reducedMotion() ? to : 0))
  useEffect(() => {
    if (reducedMotion()) return
    let raf = 0
    const t = setTimeout(() => {
      const start = performance.now()
      const step = (now: number) => {
        const p = Math.min(1, (now - start) / 1300)
        setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
        if (p < 1) raf = requestAnimationFrame(step)
      }
      raf = requestAnimationFrame(step)
    }, delay)
    return () => { clearTimeout(t); cancelAnimationFrame(raf) }
  }, [to, delay])
  return <>{n}</>
}

const TRY = [
  { topic: 'Break-even', q: 'Fixed costs are $400k. Each unit sold adds $20 of profit. Break-even volume?', unit: 'thousand', a: 20, say: '20k units', how: 'Fixed costs ÷ profit per unit = $400k ÷ $20.' },
  { topic: 'Margin', q: 'Price $50, cost $20. What is the gross margin?', unit: '%', a: 60, say: '60%', how: 'Margin = (price − cost) ÷ price = 30 ÷ 50.' },
  { topic: 'Growth', q: 'Revenue grew from $100M to $121M over two years. Growth per year?', unit: '%', a: 10, say: '10% a year', how: '1.1 × 1.1 = 1.21, so 10% each year.' },
  { topic: 'Fractions', q: 'What is 1/8 as a percentage?', unit: '%', a: 12.5, say: '12.5%', how: 'Learn the anchors: 1/8 = 12.5%, 1/6 ≈ 16.7%.' },
]

/**
 * A real question to try on the spot. Until someone taps it, it plays itself: an answer is
 * typed, checked and marked right. Then it's theirs to answer.
 */
function TryOne() {
  const [live, setLive] = useState(false)
  const [qi, setQi] = useState(0)
  const [val, setVal] = useState('')
  const [fb, setFb] = useState<null | boolean>(null)
  const [phase, setPhase] = useState(() => (reducedMotion() ? 4 : 0)) // demo: 0 empty, 1-2 typing, 3 checking, 4 right
  const input = useRef<HTMLInputElement>(null)
  useEffect(() => {
    if (live || reducedMotion()) return
    const times = [1500, 260, 500, 700, 3200]
    const t = setTimeout(() => setPhase((p) => (p + 1) % 5), times[phase])
    return () => clearTimeout(t)
  }, [phase, live])
  const q = TRY[qi]
  const take = () => { if (!live) { setLive(true); setVal(''); setFb(null); requestAnimationFrame(() => input.current?.focus()) } }
  const check = (e: React.FormEvent) => {
    e.preventDefault()
    if (!live) return take()
    if (fb !== null) { setQi((i) => (i + 1) % TRY.length); setVal(''); setFb(null); input.current?.focus(); return }
    const n = parseFloat(val.replace(/[^0-9.]/g, ''))
    if (Number.isNaN(n)) return
    setFb(Math.abs(n - q.a) < 0.051)
  }
  const shown = live ? val : phase >= 2 ? String(q.a) : phase === 1 ? String(q.a)[0] : ''
  const right = live ? fb === true : phase === 4
  return (
    <form onSubmit={check} onPointerDown={take} className="w-full max-w-[300px] rounded-xl border border-line bg-white p-4 text-left text-ink shadow-[0_24px_50px_-20px_rgba(0,0,0,.55)]">
      <p className="flex items-center justify-between text-[12px] text-muted"><span>{q.topic}</span><span className="font-medium text-teal-d">{live ? `Question ${qi + 1} of ${TRY.length}` : 'Try one'}</span></p>
      <p className="mt-1 font-serif text-[16px] leading-snug font-semibold">{q.q}</p>
      <div className="mt-3 flex items-center gap-2">
        <label className={`flex h-9 flex-1 items-center rounded-md border px-2.5 text-[14px] transition-colors ${right ? 'border-teal' : fb === false ? 'border-signal' : 'border-line'} ${live ? 'focus-within:border-ink' : ''}`}>
          <span className="sr-only">Your answer</span>
          <input ref={input} value={shown} onChange={(e) => { setVal(e.target.value); setFb(null) }} onFocus={take} inputMode="decimal" readOnly={!live}
            placeholder={live ? 'Your answer' : ''} className="w-full min-w-0 bg-transparent outline-none placeholder:text-faint" />
          <span className="ml-1 shrink-0 text-[12px] text-faint">{q.unit}</span>
        </label>
        <button type="submit" className={`rounded-md px-3 py-2 text-[13px] font-medium text-white transition-colors ${!live && phase === 3 ? 'bg-teal-d' : 'bg-ink hover:bg-[#1C2B4A]'}`}>{live && fb !== null ? 'Next' : 'Check'}</button>
      </div>
      <div className="mt-2 min-h-[38px] text-[13px] leading-snug" aria-live="polite">
        {right && <p className="flex items-start gap-1.5"><svg aria-hidden viewBox="0 0 24 24" className="mt-px h-4 w-4 shrink-0 fill-none stroke-teal-d stroke-[2.5]"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg><span><b className="font-semibold text-teal-d">Right.</b> {q.say}.{live && <> {q.how}</>}</span></p>}
        {live && fb === false && <p><b className="font-semibold text-signal-d">Not quite.</b> It's {q.say}. {q.how}</p>}
        {!live && !right && <p className="text-muted">Tap to answer it yourself.</p>}
        {live && fb === null && <p className="text-muted">Type a number, then Check. <Link to="/drills/maths" className="font-medium text-violet-d hover:underline">More in the maths drill</Link></p>}
      </div>
    </form>
  )
}

type CaseRow = { id: number; slug: string; title: string; type: string }
/** Every case in the casebook, in two rows you can swipe or scroll sideways. Nothing moves on its own. */
function CaseTicker() {
  const rows = [CASE_INDEX.slice(0, 51), CASE_INDEX.slice(51)] as CaseRow[][]
  return (
    <div className="lp-band overflow-x-auto py-6 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" aria-label={`All ${CASE_COUNT} cases`}>
      <div className="w-max space-y-2.5 px-5 sm:px-6">
        {rows.map((row, r) => (
          <div key={r} className="flex">
            {row.map((c) => (
              <Link key={c.slug} to={`/casebook/${c.slug}`}
                className="mr-2.5 flex shrink-0 items-baseline gap-2 rounded-full border border-white/12 px-4 py-1.5 text-[13.5px] text-white/85 hover:border-white/40 hover:text-white">
                <span className="font-serif text-[12px] text-teal-l italic">{c.id}</span>{c.title}<span className="text-[12px] text-white/45">{c.type}</span>
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

const CASE_STEPS = [
  { t: 'The prompt', d: "Read the client's problem the way you'd hear it." },
  { t: 'Clarifying questions', d: 'Ask, and get the facts an interviewer would give.' },
  { t: 'Structure', d: 'Draw your issue tree, then compare it with a strong one.' },
  { t: 'Maths and exhibits', d: 'Work the numbers and read the charts.' },
  { t: 'Recommendation', d: 'Lead with the answer, then the reasons and the risks.' },
  { t: 'Score yourself', d: 'Mark each stage and note one thing to fix.' },
]
/** The stages of a case, lit up one after another while the section is on screen. */
function CaseSteps() {
  const [at, setAt] = useState(0)
  const ref = useRef<HTMLOListElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    if (!seen) return
    const t = setInterval(() => setAt((a) => (a + 1) % CASE_STEPS.length), 2200)
    return () => clearInterval(t)
  }, [seen])
  return (
    <ol ref={ref} className="relative mt-6 border-l border-line pl-5">
      <span aria-hidden className="absolute -left-px top-0 w-[2px] bg-teal transition-[height] duration-700 ease-out" style={{ height: `${((at + 1) / CASE_STEPS.length) * 100}%` }} />
      {CASE_STEPS.map((s, k) => (
        <li key={s.t} className="relative py-1.5">
          <span aria-hidden className={`absolute top-[13px] -left-[25px] h-2.5 w-2.5 rounded-full border-2 transition-colors duration-500 ${k <= at ? 'border-teal bg-teal' : 'border-line bg-white'}`} />
          <button type="button" onClick={() => setAt(k)} className={`text-left text-[15px] transition-colors duration-300 ${k === at ? 'font-medium text-ink' : 'text-muted hover:text-ink'}`}>{s.t}</button>
          <p className={`grid text-[14px] text-ink-2 transition-[grid-template-rows,opacity] duration-500 ${k === at ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}><span className="overflow-hidden">{s.d}</span></p>
        </li>
      ))}
    </ol>
  )
}

const Arrow = () => <svg aria-hidden viewBox="0 0 16 16" className="lp-arrow ml-1.5 h-3.5 w-3.5 fill-none stroke-current stroke-2"><path d="M3 8h9M8.5 4.5 12 8l-3.5 3.5" /></svg>

/** True once the element has scrolled into view (stays true). */
function useSeen<T extends Element>(threshold = 0.35) {
  const ref = useRef<T>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (reducedMotion() || !('IntersectionObserver' in window)) { setSeen(true); return }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return [ref, seen] as const
}

const PATH_STOPS = [
  { t: 'Lesson 1', d: 'How case interviews work', to: '/learn/how-case-interviews-work' },
  { t: 'Your first case', d: 'Coastal Brew, about 25 minutes', to: '/casebook/coastal-brew' },
  { t: 'A ten-minute drill', d: 'Case maths, marked as you go', to: '/drills/maths' },
  { t: 'Ten cases in', d: 'Your weakest stage is clear', to: '/casebook' },
  { t: 'Case with a friend', d: 'They get the interviewer script', to: '/interviewer' },
]
/** The road from here to an offer: the line draws itself and each stop appears in turn, once. */
function PathToOffer() {
  const [ref, seen] = useSeen<HTMLOListElement>(0.3)
  return (
    <ol ref={ref} className={`lp-path relative mt-9 grid gap-5 md:grid-cols-6 md:gap-3 ${seen ? 'is-in' : ''}`}>
      <svg aria-hidden className="pointer-events-none absolute top-[9px] left-[9px] hidden h-[2px] w-[calc(100%-18px)] md:block" preserveAspectRatio="none" viewBox="0 0 1000 2">
        <line className="lp-line" x1="0" y1="1" x2="1000" y2="1" stroke="#2DD4BF" strokeWidth="2" style={{ ['--len' as string]: 1000 }} />
      </svg>
      <svg aria-hidden className="pointer-events-none absolute top-[9px] left-[9px] h-[calc(100%-18px)] w-[2px] md:hidden" preserveAspectRatio="none" viewBox="0 0 2 1000">
        <line className="lp-line" x1="1" y1="0" x2="1" y2="1000" stroke="#2DD4BF" strokeWidth="2" style={{ ['--len' as string]: 1000 }} />
      </svg>
      {PATH_STOPS.map((p, k) => (
        <li key={p.t} className="lp-stop relative flex gap-3 md:block" style={{ ['--d' as string]: `${0.3 + k * 0.4}s` }}>
          <span aria-hidden className="relative z-[1] mt-0.5 block h-5 w-5 shrink-0 rounded-full border-2 border-teal-l bg-ink md:mt-0" />
          <Link to={p.to} className="group block md:mt-3">
            <span className="block text-[15px] font-medium text-white group-hover:underline">{p.t}</span>
            <span className="block text-[13px] leading-snug text-[#9FB0C6]">{p.d}</span>
          </Link>
        </li>
      ))}
      <li className="lp-stop relative flex gap-3 md:block" style={{ ['--d' as string]: `${0.3 + PATH_STOPS.length * 0.4}s` }}>
        <span aria-hidden className="relative z-[1] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-teal-l md:mt-0">
          <svg viewBox="0 0 16 16" className="h-3 w-3 fill-none stroke-ink stroke-2"><path d="M4 14V2.5M4 3h7l-1.5 2.5L11 8H4" /></svg>
        </span>
        <div className="md:mt-3">
          <span className="block font-serif text-[18px] leading-tight text-teal-l italic">The offer</span>
          <span className="block text-[13px] leading-snug text-[#9FB0C6]">Then pass it on</span>
        </div>
      </li>
    </ol>
  )
}

/** A small bar that offers the first case once the hero has scrolled away. It slides in once and can be closed. */
function StartDock() {
  const [show, setShow] = useState(false)
  const [closed, setClosed] = useState(false)
  useEffect(() => {
    const end = () => document.getElementById('start-now')
    const on = () => {
      const e = end()
      const nearEnd = e ? e.getBoundingClientRect().top < window.innerHeight : false
      setShow(window.scrollY > 900 && !nearEnd)
    }
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])
  if (closed) return null
  return (
    <div className={`lp-dock fixed inset-x-3 bottom-3 z-40 mx-auto max-w-[520px] ${show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-[140%] opacity-0'}`} aria-hidden={!show}>
      <div className="flex items-center gap-3 rounded-xl bg-ink px-4 py-3 text-white shadow-[0_24px_50px_-18px_rgba(0,0,0,.6)]">
        <p className="min-w-0 flex-1 text-[14px] leading-snug"><span className="font-medium">Try a case now.</span> <span className="text-[#B9C4D3]">Free, no sign-up.</span></p>
        <Link to="/casebook/coastal-brew" tabIndex={show ? undefined : -1} className="lp-cta inline-flex shrink-0 items-center rounded-lg bg-white px-3.5 py-2 text-[14px] font-medium text-ink hover:bg-teal-l">Start Coastal Brew<Arrow /></Link>
        <button type="button" onClick={() => setClosed(true)} tabIndex={show ? undefined : -1} aria-label="Close" className="-mr-1 shrink-0 rounded p-1 text-[#9FB0C6] hover:text-white">
          <svg aria-hidden viewBox="0 0 16 16" className="h-4 w-4 fill-none stroke-current stroke-2"><path d="M4 4l8 8M12 4l-8 8" /></svg>
        </button>
      </div>
    </div>
  )
}

function HeroScreens() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] pb-10 sm:pb-16 lg:mr-[-60px]">
      <div aria-hidden className="pointer-events-none absolute -inset-16 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,.22),transparent)] blur-2xl" />
      <div className="lp-window" style={{ ['--d' as string]: '.35s' }}>
        <div><Browser src="/shots/desktop-home.webp" path="home" eager alt="The PrepForCase home page in a browser: the next lesson, the case of the day and a readiness score" /></div>
      </div>
      <div className="lp-slide absolute bottom-0 left-[-8%] hidden w-[44%] sm:block" style={{ ['--d' as string]: '.75s' }}>
        <div><Browser src="/shots/desktop-charts.webp" path="drills/charts" alt="The chart drill: a stacked bar exhibit with a question and a 60-second timer" /></div>
      </div>
      <div className="lp-pop absolute top-[-40px] right-[-24px] z-[1] hidden w-[300px] lg:block" style={{ ['--d' as string]: '1.2s' }}>
        <TryOne />
      </div>
      <div className="lp-pop absolute right-3 bottom-1 rounded-lg bg-white px-3.5 py-2.5 text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,.55)] sm:bottom-6" style={{ ['--d' as string]: '1s' }}>
        <p className="font-serif text-[22px] leading-tight font-semibold tabular-nums"><CountUp to={CASE_COUNT} delay={1000} /> cases</p>
        <p className="text-[12.5px] text-muted">each with a full worked answer</p>
      </div>
    </div>
  )
}

const MODULE_ART = [ArtMap, ArtStructure, ArtVoice]

/** A desktop browser window showing a real screen from the site. `crop` trims empty space below the content. */
function Browser({ src, alt, path = '', className = '', eager = false, crop = false }: { src: string; alt: string; path?: string; className?: string; eager?: boolean; crop?: boolean }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-line bg-white shadow-[0_30px_60px_-30px_rgba(15,27,51,.45)] ${className}`}>
      <div className="flex items-center gap-1.5 border-b border-line bg-canvas px-3 py-2">
        <span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" /><span className="h-2.5 w-2.5 rounded-full bg-[#E5E7EB]" />
        <span className="ml-3 truncate rounded-md bg-white px-3 py-0.5 text-[11.5px] text-muted">prepforcase.com{path && `/${path}`}</span>
      </div>
      <img src={src} alt={alt} width={1440} height={900} loading={eager ? 'eager' : 'lazy'} decoding="async"
        className={`block w-full ${crop ? 'aspect-[1440/720] object-cover object-left-top' : 'h-auto'}`} />
    </div>
  )
}

type Feature = { t: string; d: string; to: string }
const GROUPS: { t: string; art: (p: { className?: string }) => React.ReactElement; note?: string; items: Feature[] }[] = [
  { t: 'Learn the method', art: ArtCourse, items: [
    { t: 'Course', d: `${LESSONS.length} short lessons, each with a worked example, an exercise and a quiz.`, to: '/learn' },
    { t: 'Perfect casing', d: 'What to say at each of the 10 stages of a case, with a phrase trainer.', to: '/perfect-casing' },
    { t: 'Frameworks', d: '11 core issue trees, with when to use each and what to ask first.', to: '/frameworks' },
    { t: 'Interview skills', d: 'Exercises for thinking clearly and speaking calmly under pressure.', to: '/interview-skills' },
  ] },
  { t: 'Practise cases', art: ArtCasebook, items: [
    { t: 'Casebook', d: `${CASE_COUNT} original cases across every industry, each with a full worked answer.`, to: '/casebook' },
    { t: 'Case of the day', d: 'One case for everyone each day. Keep a streak going.', to: '/home' },
    { t: 'Interviewer mode', d: 'Give a case to a friend, with the script and the facts to share.', to: '/interviewer' },
    { t: 'Graph library', d: '64 exhibit charts, each with the insight to look for.', to: '/graphs' },
  ] },
  { t: 'Drill the skills', art: ArtMaths, items: [
    { t: 'Case maths', d: 'Percentages, margins, growth and break-even, marked as you go.', to: '/drills/maths' },
    { t: 'Structuring', d: 'Spot the flaw in a structure, or write your own against the clock.', to: '/drills/structure' },
    { t: 'Reading charts', d: 'One chart, one question, sixty seconds.', to: '/drills/charts' },
    { t: 'Market sizing', d: 'Build an estimate, then compare your logic with a model answer.', to: '/drills/sizing' },
  ] },
  { t: 'Look things up', art: ArtReference, items: [
    { t: 'Case types', d: 'Every kind of case, the question to ask first and the usual trap.', to: '/case-types' },
    { t: 'Formulas', d: 'Profit, margin, break-even, CAGR, payback and the rest.', to: '/formulas' },
    { t: 'Glossary', d: 'Business terms in plain English, with an example each.', to: '/glossary' },
  ] },
  { t: 'Track your prep', art: ArtImprove, note: 'Needs a free sign-in', items: [
    { t: 'Dashboard', d: 'Your readiness score and the step that will help most next.', to: '/today' },
    { t: 'Case log and tracker', d: 'Score each case by stage, find your weakest, keep a daily habit.', to: '/cases' },
    { t: 'Fit stories and notes', d: 'Build your stories once and keep notes from every lesson.', to: '/stories' },
    { t: 'Practice partners', d: 'Pair up with a friend and see each other\'s weekly progress.', to: '/partners' },
  ] },
]

export default function Landing() {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:22px_22px]" />
        <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-6">
          <Logo light height={30} />
          <nav className="flex items-center gap-5 text-[14.5px] text-[#B8C2D3]" aria-label="Main">
            <Link to="/learn" className="hidden hover:text-white sm:inline">Course</Link>
            <Link to="/perfect-casing" className="hidden hover:text-white md:inline">Perfect casing</Link>
            <Link to="/frameworks" className="hidden hover:text-white sm:inline">Frameworks</Link>
            <Link to="/casebook" className="hidden hover:text-white sm:inline">Casebook</Link>
            <Link to="/signin" className="rounded-lg border border-white/25 px-4 py-2 text-white hover:border-white/60">Sign in</Link>
          </nav>
        </header>

        <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-10 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-20">
          <div>
            <h1 className="text-[38px] leading-[1.04] text-white text-balance sm:text-[54px]" style={{ fontWeight: 400 }}>
              <span className="lp-in block">Learn the case interview.</span>
              <span className="lp-in block" style={{ ['--d' as string]: '.12s' }}>Then practise it {CASE_COUNT}&nbsp;times.</span>
            </h1>
            <span aria-hidden className="lp-rule mt-7 block h-[2px] w-16 bg-teal" style={{ ['--d' as string]: '.45s' }} />
            <p className="lp-in mt-6 max-w-lg text-[16.5px] leading-relaxed text-[#C9D2E0]" style={{ ['--d' as string]: '.3s' }}>
              Got a case interview coming up? Start here. A short course on how consultants solve cases,{' '}
              {CASE_COUNT} practice cases with full worked answers, and quick drills for maths, structuring, charts and market sizing. All free.
            </p>
            <div className="lp-in mt-9 flex flex-wrap items-center gap-3" style={{ ['--d' as string]: '.45s' }}>
              <Link to="/casebook/coastal-brew" className="lp-cta inline-flex items-center rounded-lg bg-white px-5 py-3 text-[14.5px] font-medium text-ink hover:bg-teal-l">Try a free case<Arrow /></Link>
              <Link to="/learn" className="rounded-lg border border-white/25 px-5 py-3 text-[14.5px] font-medium text-white hover:border-white/60">Start the course</Link>
            </div>
            <div className="lp-in mt-8 lg:hidden" style={{ ['--d' as string]: '.55s' }}><TryOne /></div>
            <p className="lp-in mt-6 flex max-w-lg items-start gap-2.5 text-[14px] leading-snug text-[#B8C2D3]" style={{ ['--d' as string]: '.6s' }}>
              <svg aria-hidden viewBox="0 0 24 24" className="mt-px h-[18px] w-[18px] shrink-0 fill-none stroke-teal-l stroke-2"><rect x="3" y="4" width="18" height="13" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
              <span>No sign-up for your first two cases. It all works in your browser on a laptop or phone, with nothing to download. Sign in free with Google or any email when you want to save your progress.</span>
            </p>
          </div>
          <HeroScreens />
        </section>
        <div className="relative border-t border-white/10"><CaseTicker /></div>
      </div>


      <section id="everything">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <h2 className="text-[30px]">Everything on PrepForCase</h2>
          <p className="mt-1 max-w-2xl text-muted">The whole site at a glance. Open any of it right now in this browser tab.</p>
          <div className="mt-9 grid gap-x-8 gap-y-11 md:grid-cols-2 lg:grid-cols-3">
            {GROUPS.map((g) => (
              <div key={g.t}>
                <div aria-hidden className="mb-4 flex h-[120px] items-center justify-center rounded-xl bg-canvas px-6 md:h-[150px]"><div className="w-full max-w-[160px] md:max-w-[200px]"><g.art /></div></div>
                <h3 className="flex items-baseline justify-between gap-3 text-[19px]">{g.t}{g.note && <span className="text-[12.5px] font-normal text-faint">{g.note}</span>}</h3>
                <ul className="mt-2 divide-y divide-line border-y border-line">
                  {g.items.map((f) => (
                    <li key={f.t}>
                      <Link to={f.to} className="group block py-2.5">
                        <span className="text-[15px] font-medium text-ink group-hover:text-violet-d">{f.t}</span>
                        <span className="mt-0.5 block text-[13.5px] leading-snug text-muted">{f.d}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <div aria-hidden className="mb-4 flex h-[120px] items-center justify-center rounded-xl bg-ink md:h-[150px]">
                <p className="font-serif text-[44px] leading-none text-white italic">Free</p>
              </div>
              <h3 className="text-[19px]">No app, no card, no trial</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">The course, frameworks and casebook open straight away. A free sign-in with Google or any email unlocks every step of every case and saves your progress on any device.</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link to="/signin" className="rounded-lg bg-ink px-4 py-2.5 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Sign in free</Link>
                <Link to="/learn" className="rounded-lg border border-line px-4 py-2.5 text-[14.5px] font-medium text-ink hover:border-ink/40">Start the course</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-20 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.35fr]">
          <div>
            <h2 className="text-[30px]">Practise it like the real interview</h2>
            <p className="mt-2 text-[15.5px] leading-relaxed text-ink-2">Every case runs the way an interviewer would run it, one stage at a time, with a strong answer waiting at each step so you always know what good looks like.</p>
            <CaseSteps />
            <p className="mt-5 text-[15.5px] leading-relaxed text-ink-2">Practising with a friend? Switch to interviewer mode and they get the script.</p>
            <Link to="/casebook" className="mt-6 inline-block rounded-lg bg-ink px-4 py-2.5 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Open the casebook</Link>
          </div>
          <div className="relative pb-16 sm:pb-24">
            <Browser src="/shots/desktop-case.webp" path="casebook/coastal-brew" alt="A case on the site: the Coastal Brew prompt, with the steps of the case listed on the left" />
            <Browser src="/shots/desktop-fw.webp" path="frameworks" alt="The frameworks page: an issue tree for how a client can make more profit" className="absolute right-[-4%] bottom-0 w-[58%] sm:right-[-6%]" />
          </div>
        </div>
      </section>

      <section className="border-y border-line bg-white">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h2 className="text-[30px]">Cases from every industry</h2>
              <p className="mt-1 max-w-2xl text-muted">Coffee chains to hospitals, airlines to city councils. Every case is original, with a full worked answer.</p>
            </div>
            <Link to="/casebook" className="text-[14.5px] font-medium text-violet-d hover:underline">See all {CASE_COUNT} cases</Link>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {CASE_PICKS.slice(0, 8).map((c) => (
              <Link key={c.slug} to={`/casebook/${c.slug}`} className={INDUSTRY_CARD}>
                <IndustryCardBody label={c.label} title={c.title} sub={c.sub} industry={c.industry} meta={DIFF_WORD[c.diff]} />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <h2 className="text-[30px]">Drills that take a few minutes</h2>
          <p className="mt-1 max-w-2xl text-muted">Real screens from the site. Each drill tells you straight away whether you were right, and why.</p>
          <div className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2">
            {[
              { src: '/shots/desktop-maths.webp', path: 'drills/maths', to: '/drills/maths', t: 'Case maths', d: 'Percentages, margins, growth and break-even, marked as you go.', alt: 'A break-even question in the case maths drill, answered correctly' },
              { src: '/shots/desktop-structure.webp', path: 'drills/structure', to: '/drills/structure', t: 'Structuring', d: 'Spot the bucket that overlaps another, or write your own structure against the clock.', alt: 'A structuring question: the overlapping bucket found, with the explanation' },
              { src: '/shots/desktop-charts.webp', path: 'drills/charts', to: '/drills/charts', t: 'Reading charts', d: 'One chart, one question, sixty seconds.', alt: 'A stacked bar chart question with a 60-second timer' },
              { src: '/shots/desktop-sizing.webp', path: 'drills/sizing', to: '/drills/sizing', t: 'Market sizing', d: 'Build the estimate, then see how a model answer is put together.', alt: 'A market sizing question on coffee sales, with the estimate compared to a model answer' },
            ].map((x) => (
              <figure key={x.t}>
                <Link to={x.to} className="block transition-transform hover:-translate-y-0.5"><Browser src={x.src} path={x.path} alt={x.alt} crop /></Link>
                <figcaption className="mt-4">
                  <h3 className="text-[19px]">{x.t}</h3>
                  <p className="mt-1 text-[14.5px] text-muted">{x.d}</p>
                </figcaption>
              </figure>
            ))}
          </div>
          <Link to="/drills" className="mt-10 inline-block rounded-lg bg-ink px-4 py-2.5 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Try a drill</Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[30px]">The course</h2>
            <p className="mt-1 text-muted">{LESSONS.length} lessons, about {Math.round(totalMinutes / 5) * 5} minutes. Each one teaches a skill, shows a weak and a strong answer, and makes you try it.</p>
          </div>
          <Link to="/learn/how-case-interviews-work" className="rounded-lg bg-ink px-4 py-2.5 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Start lesson 1</Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {MODULES.map((m, mi) => (
            <div key={m.title}>
              <div aria-hidden className="mb-4 rounded-xl bg-canvas px-6 pt-2"><div className="mx-auto max-w-[240px]">{(() => { const A = MODULE_ART[mi] ?? ArtMap; return <A /> })()}</div></div>
              <h3 className="text-[17.5px]"><span className="mr-2 italic text-teal">{mi + 1}</span>{m.title}</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {m.slugs.map((s) => { const l = lessonBySlug(s)!; return (
                  <li key={s}><Link to={`/learn/${s}`} className="flex justify-between gap-3 py-2.5 text-[14.5px] text-ink hover:text-violet-d"><span>{l.title}</span><span className="text-[13px] text-faint">{l.minutes} min</span></Link></li>
                ) })}
              </ul>
            </div>
          ))}
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-5 pt-6 pb-4 sm:px-6">
        <figure className="grid items-center gap-6 border-y border-line py-10 md:grid-cols-[150px_1fr] md:gap-10">
          <img src="/vyshak.jpg" alt="Vyshak K Iyengar" width={150} height={150} loading="lazy" decoding="async" className="h-28 w-28 rounded-[8px] object-cover md:h-[150px] md:w-[150px]" />
          <div>
            <blockquote className="max-w-3xl font-serif text-[21px] leading-[1.45] text-ink sm:text-[24px]">
              “I built PrepForCase from what helped me: classmates who practised cases with me late into the evening, and consultants who told me honestly what wasn't working. It's free because this is my way of giving back. If it moves you one step closer to an offer, it has done its job.”
            </blockquote>
            <figcaption className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 text-[14.5px]">
              <span className="text-ink">Vyshak K Iyengar, London Business School and BCG alum</span>
              <Link to="/about" className="font-medium text-violet-d hover:underline">Read the story</Link>
              <a href="https://www.linkedin.com/in/vyshakiyengar/" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d hover:underline">Say hello on LinkedIn</a>
            </figcaption>
          </div>
        </figure>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid items-center gap-5 rounded-xl bg-canvas p-5 md:grid-cols-[140px_1fr_auto]">
          <div aria-hidden className="hidden md:block"><ArtPerks /></div>
          <div>
            <h2 className="text-[26px]">At business school?</h2>
            <p className="mt-1 max-w-2xl text-ink-2">Verify your school email to unlock student downloads and offers when they're available.</p>
          </div>
          <Link to="/signin?next=/perks" className="rounded-lg bg-ink px-5 py-3 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Verify your school email</Link>
        </div>
      </section>

      <section id="start-now" className="relative overflow-hidden bg-ink">
        <div aria-hidden className="pointer-events-none absolute -top-24 right-[10%] h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(45,212,191,.25),transparent)] blur-2xl" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-6">
          <h2 className="text-[30px] text-white sm:text-[34px]">Your road to an offer starts with one case</h2>
          <p className="mt-1 max-w-2xl text-[#B9C4D3]">Coastal Brew is a friendly first case: a coffee chain that's growing but making less money. About 25 minutes, every step open, no sign-up.</p>
          <PathToOffer />
          <div className="mt-10 flex flex-wrap gap-3">
            <Link to="/casebook/coastal-brew" className="lp-cta inline-flex items-center rounded-lg bg-white px-5 py-3 text-[14.5px] font-medium text-ink hover:bg-teal-l">Start Coastal Brew<Arrow /></Link>
            <Link to="/learn/how-case-interviews-work" className="rounded-lg border border-white/25 px-5 py-3 text-[14.5px] font-medium text-white hover:border-white/60">Or start with lesson 1</Link>
          </div>
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-[13px] text-muted sm:px-6">
        <span>© {new Date().getFullYear()} PrepForCase · <Link to="/about" className="underline">About</Link> · <Link to="/privacy" className="underline">Privacy</Link> · <Link to="/terms" className="underline">Terms</Link></span>
        <span>All cases are original and fictional, written for practice. Not affiliated with any consulting firm or school.</span>
      </footer>
      <StartDock />
    </div>
  )
}
