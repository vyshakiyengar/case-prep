import { CASE_COUNT } from '../content/caseCount'
import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'
import { ArtCourse, ArtPractise, ArtReference, ArtImprove } from '../components/Art'
import { MODULES, lessonBySlug, LESSONS, totalMinutes } from '../content/course'

/** A phone showing a real screen from the site. */
export function Phone({ src, alt, className = '', eager = false }: { src: string; alt: string; className?: string; eager?: boolean }) {
  return (
    <div className={`rounded-[34px] bg-[#0B1428] p-[7px] shadow-[0_30px_60px_-28px_rgba(0,0,0,.6),0_0_0_1px_rgba(255,255,255,.08)] ${className}`}>
      <div className="relative overflow-hidden rounded-[28px] bg-white">
        <span aria-hidden className="absolute top-[7px] left-1/2 z-10 h-[15px] w-[62px] -translate-x-1/2 rounded-full bg-[#0B1428]" />
        <img src={src} alt={alt} width={585} height={1266} loading={eager ? 'eager' : 'lazy'} decoding="async" className="block h-auto w-full pt-[18px]" />
      </div>
    </div>
  )
}

function HeroPhones() {
  return (
    <div className="relative mx-auto h-[420px] w-full max-w-[440px] sm:h-[520px]">
      <Phone src="/shots/phone-structuring.webp" alt="The structuring drill on a phone: a furniture factory's defect rate, with the overlapping bucket found" className="absolute top-8 right-0 w-[48%] rotate-[5deg] opacity-95" />
      <Phone src="/shots/phone-casebook.webp" alt="The casebook on a phone: 102 practice cases with filters by level and type" className="absolute top-0 left-[6%] w-[52%] -rotate-[3deg]" eager />
      <div className="absolute bottom-6 left-0 rounded-lg bg-white px-3.5 py-2.5 text-ink shadow-[0_18px_40px_-18px_rgba(0,0,0,.55)] sm:bottom-14">
        <p className="font-serif text-[22px] leading-tight font-semibold">{CASE_COUNT} cases</p>
        <p className="text-[12.5px] text-muted">each with a full worked answer</p>
      </div>
    </div>
  )
}

const ART = [ArtCourse, ArtPractise, ArtReference, ArtImprove]

const PATH = [
  { t: 'Learn', d: 'The map of a case, 11 short lessons, what to say at each stage (perfect casing) and 11 core frameworks.', to: '/learn', cta: 'Start the course' },
  { t: 'Practise', d: `${CASE_COUNT} cases, 64 charts, timed drills, and cases to give a friend.`, to: '/casebook', cta: 'Open the casebook' },
  { t: 'Look things up', d: 'Case types, formulas and a plain-English glossary.', to: '/glossary', cta: 'Open the glossary' },
  { t: 'Track and improve', d: 'Log each case, find your weakest stage, fix one thing at a time.', to: '/signin', cta: 'Start tracking' },
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

        <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-10 pb-24 sm:px-6 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-28">
          <div>
            <h1 className="text-[38px] leading-[1.04] text-white text-balance sm:text-[54px]" style={{ fontWeight: 400 }}>
              <span className="block">Learn the case interview.</span>
              <span className="block">Then practise it {CASE_COUNT}&nbsp;times.</span>
            </h1>
            <span aria-hidden className="mt-7 block h-[2px] w-16 bg-teal" />
            <p className="mt-6 max-w-lg text-[16.5px] leading-relaxed text-[#C9D2E0]">
              A free course on how consultants solve cases, {CASE_COUNT} practice cases with full worked answers,
              and drills for maths, structuring and charts. Free with a Google or school-email sign-in. Made by a London Business School and BCG alum.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/learn" className="rounded-lg bg-white px-5 py-3 text-[14.5px] font-medium text-ink hover:bg-teal-l">Start the free course</Link>
              <Link to="/casebook" className="rounded-lg border border-white/25 px-5 py-3 text-[14.5px] font-medium text-white hover:border-white/60">Browse the casebook</Link>
            </div>
          </div>
          <HeroPhones />
        </section>
      </div>


      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <h2 className="text-[30px]">How it works</h2>
          <ol className="mt-8 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {PATH.map((p, i) => (
              <li key={p.t} className="flex flex-col">
                <div className="mb-4 rounded-xl bg-canvas px-4 pt-3 pb-2"><div className="mx-auto max-w-[240px] md:max-w-none">{(() => { const A = ART[i]; return <A /> })()}</div></div>
                <h3 className="text-[19px]"><span className="mr-2 font-serif italic text-teal">{i + 1}</span>{p.t}</h3>
                <p className="mt-1 flex-1 text-[14.5px] text-muted">{p.d}</p>
                <Link to={p.to} className="mt-3 text-[14px] font-medium text-violet-d hover:underline">{p.cta}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6">
          <h2 className="text-[30px]">Drills that take a few minutes</h2>
          <p className="mt-1 max-w-2xl text-muted">Real screens from the site. Each drill tells you straight away whether you were right, and why.</p>
          <div className="mt-10 grid gap-10 sm:grid-cols-3">
            {[
              { src: '/shots/phone-maths.webp', t: 'Case maths', d: 'Percentages, margins, growth and break-even, marked as you go.', alt: 'A case maths question answered correctly on a phone' },
              { src: '/shots/phone-structuring.webp', t: 'Structuring', d: 'Spot the weak structure, or write your own against the clock.', alt: 'A structuring question on a phone' },
              { src: '/shots/phone-charts.webp', t: 'Reading charts', d: 'One chart, one question, sixty seconds.', alt: 'A chart question with a 60-second timer on a phone' },
            ].map((x) => (
              <figure key={x.t} className="flex flex-col items-center text-center">
                <Phone src={x.src} alt={x.alt} className="w-[62%] max-w-[230px]" />
                <figcaption className="mt-5">
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


      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-6">
        <div className="grid items-center gap-5 rounded-xl bg-canvas p-5 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-[26px]">At business school?</h2>
            <p className="mt-1 max-w-2xl text-ink-2">Verify your school email to unlock student downloads and offers when they're available.</p>
          </div>
          <Link to="/signin?next=/perks" className="rounded-lg bg-ink px-5 py-3 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Verify your school email</Link>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-5 px-5 py-14 sm:px-6">
          <div>
            <h2 className="text-[28px] text-white">Start with lesson 1 today</h2>
            <p className="mt-1 text-[#B9C4D3]">It takes eight minutes, and you'll know what interviewers are actually scoring.</p>
          </div>
          <Link to="/learn/how-case-interviews-work" className="rounded-lg bg-white px-5 py-3 text-[14.5px] font-medium text-ink hover:bg-paper">Start lesson 1</Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-[13px] text-muted sm:px-6">
        <span>© {new Date().getFullYear()} PrepForCase · <Link to="/about" className="underline">About</Link> · <Link to="/privacy" className="underline">Privacy</Link> · <Link to="/terms" className="underline">Terms</Link></span>
        <span>All cases are original and fictional, written for practice. Not affiliated with any consulting firm or school.</span>
      </footer>
    </div>
  )
}
