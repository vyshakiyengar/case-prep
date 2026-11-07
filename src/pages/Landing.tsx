import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'
import { MODULES, lessonBySlug, LESSONS, totalMinutes } from '../content/course'

function Notepad() {
  // the case candidate's page: prompt, objective, issue tree, hypothesis
  const L = (d: string, len: number, delay: number, color = '#14213D') =>
    <path className="tree-line" d={d} stroke={color} strokeWidth="2" fill="none" strokeLinecap="round" style={{ ['--len' as string]: len, animationDelay: `${delay}s` }} />
  const N = (x: number, y: number, w: number, label: string, delay: number, tone: 'ink' | 'teal' | 'plain' = 'plain') => (
    <g className="tree-node" style={{ animationDelay: `${delay}s` }}>
      <rect x={x} y={y} width={w} height="34" rx="6" fill={tone === 'ink' ? '#14213D' : tone === 'teal' ? '#DDF2F4' : '#fff'} stroke={tone === 'plain' ? '#B9C4D3' : 'none'} />
      <text x={x + w / 2} y={y + 22} textAnchor="middle" fontSize="13.5" fontFamily="IBM Plex Sans, sans-serif" fontWeight={tone === 'plain' ? 400 : 600} fill={tone === 'ink' ? '#fff' : '#14213D'}>{label}</text>
    </g>
  )
  return (
    <div className="graph-paper relative rounded-2xl border border-line p-5 shadow-[0_18px_40px_-24px_rgba(20,33,61,.35)] sm:p-7">
      <p className="font-serif text-[15px] italic leading-relaxed text-ink-2">
        "Our client runs 120 coffee shops. Revenue grew slightly, but operating profit fell from £12M to £4.5M in two years. Why, and what should they do?"
      </p>
      <p className="mt-3 text-[13px] text-muted">Objective: back to £10M profit within two years</p>
      <svg viewBox="0 0 460 250" className="mt-3 w-full" role="img" aria-label="An issue tree: profit decline split into revenue, costs and market, with costs highlighted as the hypothesis">
        {N(150, 6, 160, 'Why is profit down?', 0.05, 'ink')}
        {L('M230 40 V62 M70 62 H390 M70 62 V80 M230 62 V80 M390 62 V80', 520, 0.35)}
        {N(10, 80, 120, 'Revenue', 0.8)}
        {N(170, 80, 120, 'Costs', 0.9, 'teal')}
        {N(330, 80, 120, 'Market', 1.0)}
        {L('M70 114 V196 M70 140 H84 M70 168 H84 M70 196 H84', 160, 1.2, '#94A0B2')}
        {L('M230 114 V196 M230 140 H244 M230 168 H244 M230 196 H244', 160, 1.3, '#0E9AA7')}
        {L('M390 114 V168 M390 140 H404 M390 168 H404', 120, 1.4, '#94A0B2')}
        <g className="tree-node" style={{ animationDelay: '1.5s' }} fontFamily="IBM Plex Sans, sans-serif" fontSize="12.5" fill="#2D3748">
          <text x="90" y="144">Volume</text><text x="90" y="172">Price</text><text x="90" y="200">Channel mix</text>
          <rect x="246" y="186" width="122" height="20" rx="3" fill="#FFE066" opacity=".85" />
          <text x="250" y="144">Ingredients</text><text x="250" y="172">Staff, rent</text><text x="250" y="200" fontWeight="600" fill="#14213D">App commissions</text>
          <text x="410" y="144">Rivals</text><text x="410" y="172">Industry?</text>
        </g>
        <g className="tree-node" style={{ animationDelay: '1.9s' }}>
          <path d="M300 226 q20 10 40 2" stroke="#E8505B" strokeWidth="1.8" fill="none" />
          <text x="346" y="236" fontSize="13" fontFamily="Source Serif 4 Variable, Georgia, serif" fontStyle="italic" fill="#B9343F">start here</text>
        </g>
      </svg>
    </div>
  )
}

const PATH = [
  { t: 'Learn the basics', d: `A ${LESSONS.length}-lesson course: how cases work, structuring, maths, charts, sizing, the recommendation, and how you come across. Each lesson ends with a timed exercise and a quiz.`, to: '/learn', cta: 'Start the course' },
  { t: 'Learn the flow', d: 'Perfect casing: the 10 stages of a strong case with the exact words to use, plus a daily phrase trainer. And 16 frameworks, each shown generic and tailored.', to: '/perfect-casing', cta: 'Open perfect casing' },
  { t: 'Practise full cases', d: '15 original cases with exhibits and model answers. A checklist at every step tells you what a strong answer includes before you look.', to: '/casebook', cta: 'Open the casebook' },
  { t: 'Drill your weak spots', d: 'Two-minute structuring prompts, 90-second chart reads, and endless mental-maths questions.', to: '/drills', cta: 'Try a drill' },
  { t: 'Track and fix one thing', d: 'Log every case against the six things interviewers score. The dashboard names your weakest stage and the lesson and drill that fix it.', to: '/signin', cta: 'Start tracking' },
]

export default function Landing() {
  return (
    <div className="bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Logo />
        <nav className="flex items-center gap-5 text-[14.5px] font-medium text-muted" aria-label="Main">
          <Link to="/learn" className="hidden hover:text-ink sm:inline">Course</Link>
          <Link to="/perfect-casing" className="hidden hover:text-ink md:inline">Perfect casing</Link>
          <Link to="/frameworks" className="hidden hover:text-ink sm:inline">Frameworks</Link>
          <Link to="/casebook" className="hidden hover:text-ink sm:inline">Casebook</Link>
          <Link to="/drills" className="hidden hover:text-ink sm:inline">Drills</Link>
          <Link to="/signin" className="rounded-lg border border-line px-3.5 py-2 text-ink hover:border-faint">Sign in</Link>
        </nav>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-14">
        <div>
          <h1 className="text-[40px] leading-[1.08] font-semibold tracking-[-0.01em] sm:text-[52px]">
            Learn case interviews properly, then practise until they feel easy.
          </h1>
          <p className="mt-5 max-w-xl text-[17.5px] leading-relaxed text-muted">
            A free course, a perfect-casing playbook with a phrase trainer, 16 visual frameworks, 15 original cases, 64 graph-reading exercises, timed drills, and daily habits for clearer thinking and communication. Built for business school students heading into consulting interviews.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/learn" className="rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white shadow-sm hover:bg-[#22325A]">Start the free course</Link>
            <Link to="/casebook" className="rounded-lg border border-line bg-white px-5 py-3 text-[15px] font-medium text-ink hover:border-faint">Browse the casebook</Link>
          </div>
          <p className="mt-3 text-[14px] text-muted">No sign-up needed to learn. Sign in when you want to track your progress.</p>
        </div>
        <Notepad />
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <p className="text-[13px] font-semibold uppercase tracking-wide text-violet-d">The method behind this website</p>
          <h2 className="mt-2 text-[32px] font-semibold">Case preparation is two different jobs.</h2>
          <p className="mt-2 max-w-3xl text-[16px] text-muted">First, learn how to solve business cases. Second, build the thinking, communication and business judgement that help you perform well in the interview. You need both. This programme gives you a way to practise each one.</p>
          <div className="mt-7 grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-line border-t-4 border-t-teal bg-white p-6">
              <span className="text-[13px] font-semibold text-teal-d">PILLAR 1</span>
              <h3 className="mt-2 text-[24px] font-semibold">Master case mechanics</h3>
              <p className="mt-2 text-[15px] text-muted">Learn how to open a case, ask good questions, build a tailored structure, read graphs, calculate quickly and make a recommendation. Then practise full cases and learn from every mistake.</p>
              <div className="mt-4 flex flex-wrap gap-3 text-[14px] font-medium text-violet-d"><Link to="/perfect-casing" className="hover:underline">Perfect casing →</Link><Link to="/frameworks" className="hover:underline">Frameworks →</Link><Link to="/graphs" className="hover:underline">64 graph exercises →</Link></div>
            </div>
            <div className="rounded-xl border border-line border-t-4 border-t-violet bg-white p-6">
              <span className="text-[13px] font-semibold text-violet-d">PILLAR 2</span>
              <h3 className="mt-2 text-[24px] font-semibold">Master interview skills</h3>
              <p className="mt-2 text-[15px] text-muted">Improve your ability to recall information, speak clearly and think commercially. Use practical exercises, SpeechOn, optional brain games, CEO interviews, Shark Tank and business books to prepare.</p>
              <Link to="/interview-skills" className="mt-4 inline-block text-[14px] font-medium text-violet-d hover:underline">See the complete daily routine →</Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-[32px] font-semibold">Your path to the offer</h2>
          <p className="mt-2 max-w-2xl text-[16.5px] text-muted">Five steps, in this order. Most candidates jump straight to cases; learning the basics first makes every case you practise count for more.</p>
          <ol className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-5">
            {PATH.map((p, i) => (
              <li key={p.t} className="flex flex-col border-t-2 border-ink pt-4">
                <span className="font-serif text-[36px] leading-none font-semibold text-teal">{i + 1}</span>
                <h3 className="mt-2 text-[20px] font-semibold">{p.t}</h3>
                <p className="mt-1 flex-1 text-[14.5px] text-muted">{p.d}</p>
                <Link to={p.to} className="mt-3 text-[14px] font-medium text-violet-d hover:underline">{p.cta}</Link>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-[32px] font-semibold">The course</h2>
            <p className="mt-1 text-muted">{LESSONS.length} lessons, about {Math.round(totalMinutes / 5) * 5} minutes. Each one teaches a skill, shows a weak and a strong answer, and makes you try it.</p>
          </div>
          <Link to="/learn" className="rounded-lg bg-ink px-4 py-2.5 text-[14.5px] font-medium text-white hover:bg-[#22325A]">Start lesson 1</Link>
        </div>
        <div className="mt-8 grid gap-8 md:grid-cols-3">
          {MODULES.map((m, mi) => (
            <div key={m.title}>
              <h3 className="text-[19px] font-semibold">Module {mi + 1}: {m.title}</h3>
              <ul className="mt-2 divide-y divide-line border-y border-line">
                {m.slugs.map((s) => { const l = lessonBySlug(s)!; return (
                  <li key={s}><Link to={`/learn/${s}`} className="flex justify-between gap-3 py-2.5 text-[15px] text-ink hover:text-violet-d"><span>{l.title}</span><span className="text-[13px] text-faint">{l.minutes} min</span></Link></li>
                ) })}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="max-w-2xl text-[32px] leading-tight font-semibold">Coaching built into every case</h2>
          <div className="mt-8 grid gap-8 md:grid-cols-3">
            {[['Before you look', 'At each question, a short checklist of what a strong answer includes, so you mark your own work like an interviewer would.'],
              ['Stuck? Go back a step', 'Every step links to the lesson that teaches that skill: structuring, maths, charts or the recommendation.'],
              ['Swap seats', 'Switch to interviewer mode to give the case to a friend, with the facts to share only if asked and notes on where to push.']].map(([t, d]) => (
              <div key={t} className="border-t border-line pt-4">
                <h3 className="text-[20px] font-semibold">{t}</h3>
                <p className="mt-1 text-muted">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-violet bg-violet-l/50 p-7 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-[26px] font-semibold">At business school?</h2>
            <p className="mt-1 max-w-2xl text-ink-2">Verify your school email to unlock free downloads, student discounts and early access to new cases.</p>
          </div>
          <Link to="/signin?next=/perks" className="rounded-lg bg-ink px-5 py-3 text-[15px] font-medium text-white hover:bg-[#22325A]">Unlock student perks</Link>
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14 sm:px-8">
          <div>
            <h2 className="text-[30px] font-semibold text-white">Start with lesson 1 today</h2>
            <p className="mt-1 text-[#B9C4D3]">It takes eight minutes, and you'll know what interviewers are actually scoring.</p>
          </div>
          <Link to="/learn/how-case-interviews-work" className="rounded-lg bg-white px-5 py-3 text-[15px] font-medium text-ink hover:bg-paper">Start lesson 1</Link>
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-[13px] text-muted sm:px-8">
        <span>© {new Date().getFullYear()} Case Prep OS. <Link to="/privacy" className="underline">Privacy</Link></span>
        <span>All cases are original and fictional, written for practice.</span>
      </footer>
    </div>
  )
}
