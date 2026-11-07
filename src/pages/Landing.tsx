import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'
import { MODULES, lessonBySlug, LESSONS, totalMinutes } from '../content/course'

function Notepad() {
  // the candidate's page, drawn as it would be in an interview: prompt, objective, issue tree, where to start
  const L = (d: string, len: number, delay: number, color = 'rgba(255,255,255,.55)') =>
    <path className="tree-line" d={d} stroke={color} strokeWidth="1.6" fill="none" strokeLinecap="round" style={{ ['--len' as string]: len, animationDelay: `${delay}s` }} />
  const N = (x: number, y: number, w: number, label: string, delay: number, tone: 'root' | 'focus' | 'plain' = 'plain') => (
    <g className="tree-node" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={w} height="34" rx="5" fill={tone === 'root' ? '#FFFFFF' : tone === 'focus' ? '#0E8C96' : 'transparent'} stroke={tone === 'plain' ? 'rgba(255,255,255,.35)' : 'none'} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="13.5" fontFamily="IBM Plex Sans, sans-serif" fontWeight={tone === 'plain' ? 400 : 500} fill={tone === 'root' ? '#0F1B33' : '#FFFFFF'}>{label}</text>
    </g>
  )
  return (
    <div className="relative">
      <p className="font-serif text-[18px] italic leading-relaxed text-[#D5DCE7]">
        "Our client runs 120 coffee shops. Revenue grew slightly, but operating profit fell from £12M to £4.5M in two years. Why, and what should they do?"
      </p>
      <p className="mt-3 text-[13.5px] text-[#8C98AE]">Objective: back to £10M profit within two years</p>
      <svg viewBox="0 0 480 250" className="mt-6 w-full" role="img" aria-label="An issue tree: profit decline split into revenue, costs and market, with app commissions under costs marked as the place to start">
        {N(150, 6, 160, 'Why is profit down?', 0.15, 'root')}
        {L('M230 40 V62 M70 62 H390 M70 62 V80 M230 62 V80 M390 62 V80', 520, 0.45)}
        {N(10, 80, 120, 'Revenue', 0.9)}
        {N(170, 80, 120, 'Costs', 1.0, 'focus')}
        {N(330, 80, 120, 'Market', 1.1)}
        {L('M70 114 V196 M70 140 H84 M70 168 H84 M70 196 H84', 160, 1.3, 'rgba(255,255,255,.3)')}
        {L('M230 114 V196 M230 140 H244 M230 168 H244 M230 196 H244', 160, 1.4, '#3FB3BC')}
        {L('M390 114 V168 M390 140 H404 M390 168 H404', 120, 1.5, 'rgba(255,255,255,.3)')}
        <g className="tree-node" style={{ animationDelay: '1.6s' }} fontFamily="IBM Plex Sans, sans-serif" fontSize="12.5" fill="#B8C2D3">
          <text x="90" y="144">Volume</text><text x="90" y="172">Price</text><text x="90" y="200">Channel mix</text>
          <text x="250" y="144">Ingredients</text><text x="250" y="172">Staff, rent</text><text x="250" y="200" fontWeight="500" fill="#FFFFFF">App commissions</text>
          <line x1="250" y1="206" x2="366" y2="206" stroke="#3FB3BC" strokeWidth="1.6" />
          <text x="410" y="144">Rivals</text><text x="410" y="172">Industry?</text>
        </g>
        <g className="tree-node" style={{ animationDelay: '2s' }}>
          <path d="M300 228 q20 10 40 2" stroke="#7FD8DF" strokeWidth="1.4" fill="none" />
          <text x="346" y="238" fontSize="14" fontFamily="Newsreader Variable, Georgia, serif" fontStyle="italic" fill="#7FD8DF">start here</text>
        </g>
      </svg>
    </div>
  )
}

const PATH = [
  { t: 'Learn', d: 'The map of a case, 11 short lessons, perfect casing and 10 core frameworks.', to: '/learn', cta: 'Start the course' },
  { t: 'Practise', d: '15 cases, 64 charts, timed drills, and cases to give a friend.', to: '/casebook', cta: 'Open the casebook' },
  { t: 'Look things up', d: 'Case types, formulas and a plain-English glossary.', to: '/glossary', cta: 'Open the glossary' },
  { t: 'Track and improve', d: 'Log each case, find your weakest stage, fix one thing at a time.', to: '/signin', cta: 'Start tracking' },
]

export default function Landing() {
  return (
    <div className="bg-white">
      <div className="relative overflow-hidden bg-ink text-white">
        <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.07] [background-image:radial-gradient(circle_at_1px_1px,#fff_1px,transparent_1.2px)] [background-size:22px_22px]" />
        <header className="relative mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-6 sm:px-8">
          <Logo light height={30} />
          <nav className="flex items-center gap-6 text-[14.5px] text-[#B8C2D3]" aria-label="Main">
            <Link to="/learn" className="hidden hover:text-white sm:inline">Course</Link>
            <Link to="/perfect-casing" className="hidden hover:text-white md:inline">Perfect casing</Link>
            <Link to="/frameworks" className="hidden hover:text-white sm:inline">Frameworks</Link>
            <Link to="/casebook" className="hidden hover:text-white sm:inline">Casebook</Link>
            <Link to="/signin" className="rounded-lg border border-white/25 px-4 py-2 text-white hover:border-white/60">Sign in</Link>
          </nav>
        </header>

        <section className="relative mx-auto grid max-w-6xl items-center gap-14 px-5 pt-10 pb-24 sm:px-8 lg:grid-cols-[1.1fr_1fr] lg:pt-16 lg:pb-28">
          <div>
            <h1 className="text-[44px] leading-[1.04] text-white sm:text-[64px]" style={{ fontWeight: 400 }}>
              Know the case interview before you walk in.
            </h1>
            <span aria-hidden className="mt-7 block h-[2px] w-16 bg-teal" />
            <p className="mt-6 max-w-lg text-[18px] leading-relaxed text-[#C9D2E0]">
              A free course, a casebook of practice cases and daily drills for consulting interviews.
              Made by a London Business School alum who went through BCG's case rounds.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link to="/learn" className="rounded-lg bg-white px-5 py-3 text-[15px] font-medium text-ink hover:bg-teal-l">Start the free course</Link>
              <Link to="/casebook" className="rounded-lg border border-white/25 px-5 py-3 text-[15px] font-medium text-white hover:border-white/60">Browse the casebook</Link>
            </div>
          </div>
          <Notepad />
        </section>
      </div>


      <section>
        <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8">
          <h2 className="text-[36px]">How it works</h2>
          <ol className="mt-8 grid gap-x-8 gap-y-8 md:grid-cols-2 lg:grid-cols-4">
            {PATH.map((p, i) => (
              <li key={p.t} className="flex flex-col border-t border-ink/70 pt-5">
                <span className="font-serif text-[40px] leading-none italic text-teal">{i + 1}</span>
                <h3 className="mt-3 text-[22px]">{p.t}</h3>
                <p className="mt-1 flex-1 text-[14.5px] text-muted">{p.d}</p>
                <Link to={p.to} className="mt-3 text-[14px] font-medium text-violet-d hover:underline">{p.cta}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl border-t border-line px-5 py-20 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[36px]">The course</h2>
            <p className="mt-1 text-muted">{LESSONS.length} lessons, about {Math.round(totalMinutes / 5) * 5} minutes. Each one teaches a skill, shows a weak and a strong answer, and makes you try it.</p>
          </div>
          <Link to="/learn" className="rounded-lg bg-ink px-4 py-2.5 text-[14.5px] font-medium text-white hover:bg-[#1C2B4A]">Start lesson 1</Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {MODULES.map((m, mi) => (
            <div key={m.title}>
              <h3 className="text-[20px]"><span className="mr-2 italic text-teal">{mi + 1}</span>{m.title}</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {m.slugs.map((s) => { const l = lessonBySlug(s)!; return (
                  <li key={s}><Link to={`/learn/${s}`} className="flex justify-between gap-3 py-2.5 text-[15px] text-ink hover:text-violet-d"><span>{l.title}</span><span className="text-[13px] text-faint">{l.minutes} min</span></Link></li>
                ) })}
              </ul>
            </div>
          ))}
        </div>
      </section>


      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid items-center gap-6 rounded-2xl bg-canvas p-8 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-[30px]">At business school?</h2>
            <p className="mt-1 max-w-2xl text-ink-2">Verify your school email to unlock free downloads, student discounts and early access to new cases.</p>
          </div>
          <Link to="/signin?next=/perks" className="rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white hover:bg-[#1C2B4A]">Unlock student perks</Link>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14 sm:px-8">
          <div>
            <h2 className="text-[34px] text-white">Start with lesson 1 today</h2>
            <p className="mt-1 text-[#B9C4D3]">It takes eight minutes, and you'll know what interviewers are actually scoring.</p>
          </div>
          <Link to="/learn/how-case-interviews-work" className="rounded-lg bg-white px-5 py-3 text-[15px] font-medium text-ink hover:bg-paper">Start lesson 1</Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-[13px] text-muted sm:px-8">
        <span>© {new Date().getFullYear()} PrepForCase · <Link to="/about" className="underline">About</Link> · <Link to="/privacy" className="underline">Privacy</Link></span>
        <span>All cases are original and fictional, written for practice.</span>
      </footer>
    </div>
  )
}
