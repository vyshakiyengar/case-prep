import { useStore } from '../lib/store'
import { GoogleMark, Logo } from '../components/ui'

function SignInButton({ dark = false }: { dark?: boolean }) {
  const { signIn, backend } = useStore()
  return (
    <button onClick={signIn}
      className={`inline-flex items-center gap-3 rounded-lg px-5 py-3 text-[15px] font-medium shadow-sm transition-colors ${dark ? 'bg-white text-ink hover:bg-paper' : 'bg-ink text-white hover:bg-[#22325A]'}`}>
      <span className="flex h-6 w-6 items-center justify-center rounded bg-white"><GoogleMark /></span>
      {backend?.mode === 'demo' ? 'Try the demo' : 'Continue with Google'}
    </button>
  )
}

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

const TRACK_A = [
  ['Practise real cases', 'With a partner, an expert, or alone out loud.'],
  ['Drill your weak skill', 'Structures, charts or maths, 20 focused minutes at a time.'],
  ['Learn the building blocks', '16 case types and 20 formulas you can test yourself on.'],
  ['Re-read your mistakes', 'Your last five fixes, shown before every case.'],
]
const TRACK_B = [
  ['Speak clearly', 'Voice exercises: a calm pace and no "um" sound senior.'],
  ['Think under pressure', 'Mind exercises, so you hold the numbers without going blank.'],
  ['Sound like an insider', 'Business reading turns a textbook answer into an insight.'],
  ['Have your stories ready', 'A FIT story builder for every "tell me about a time" question.'],
]
const FEATURES = [
  ['Daily tracker', 'Eight habits across both halves of the interview. Tick them off in seconds.'],
  ['Case log', 'Score six stages from 1 to 5 after every case and write the one thing to fix.'],
  ['Dashboard', 'Finds your weakest stage and tells you what to drill next.'],
  ['15 original cases', 'Profitability to private equity, with exhibits, a timer and model answers. Play them alone or as the interviewer.'],
  ['Timed drills', 'Two-minute structuring drills and endless mental-maths questions.'],
  ['Practice partners', 'Invite a partner and see each other’s week. Prep is easier when someone is watching.'],
]

export default function Landing() {
  return (
    <div className="bg-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between px-5 py-5 sm:px-8">
        <Logo />
        <a href="#how" className="text-[14.5px] font-medium text-muted hover:text-ink">How it works</a>
      </header>

      <section className="mx-auto grid max-w-6xl items-center gap-12 px-5 pt-8 pb-20 sm:px-8 lg:grid-cols-[1.05fr_1fr] lg:pt-14">
        <div>
          <h1 className="text-[40px] leading-[1.08] font-semibold tracking-[-0.01em] sm:text-[54px]">
            Case interviews test two things. Practise both, every day.
          </h1>
          <p className="mt-5 max-w-xl text-[17.5px] leading-relaxed text-muted">
            Solve the problem, and come across like someone a client would trust. Track your daily practice, log every case, and fix one mistake at a time.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <SignInButton />
            <span className="text-[14px] text-muted">Free. Your progress is saved to your account.</span>
          </div>
        </div>
        <Notepad />
      </section>

      <section id="how" className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="max-w-2xl text-[32px] leading-tight font-semibold">Interviewers judge how you solve the case, and how you come across while you do it</h2>
          <p className="mt-3 max-w-2xl text-[16.5px] text-muted">Most candidates only practise the first. Case Prep OS gives each half its own daily habits.</p>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {[{ t: 'Solve the case', q: 'Can you crack a business problem?', items: TRACK_A, c: 'teal' }, { t: 'Come across well', q: 'Would a client trust this person?', items: TRACK_B, c: 'violet' }].map((col) => (
              <div key={col.t} className={`overflow-hidden rounded-xl border bg-white ${col.c === 'teal' ? 'border-teal' : 'border-violet'}`}>
                <div className={`px-6 py-4 text-white ${col.c === 'teal' ? 'bg-teal' : 'bg-violet'}`}>
                  <h3 className="text-[24px] font-semibold text-white">{col.t}</h3>
                  <p className="font-serif italic opacity-90">{col.q}</p>
                </div>
                <ul>
                  {col.items.map(([h, d]) => (
                    <li key={h} className="border-t border-line px-6 py-3.5 first:border-t-0">
                      <span className="font-medium text-ink">{h}.</span> <span className="text-muted">{d}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <h2 className="text-[32px] font-semibold">One loop, every day</h2>
        <ol className="mt-8 grid gap-8 md:grid-cols-3">
          {[['Practise', 'Do a case or a drill, plus ten minutes of voice and mind exercises. Tick them off in the tracker.', 'text-teal'],
            ['Log it', 'Straight after each case, score the six stages and write the one thing you’ll do differently.', 'text-violet'],
            ['Fix one thing', 'The dashboard spots your weakest stage. Read your fixes before the next case, and drill the weak spot.', 'text-signal']].map(([t, d, c], i) => (
            <li key={t} className="border-t-2 border-ink pt-4">
              <span className={`font-serif text-[40px] leading-none font-semibold ${c}`}>{i + 1}</span>
              <h3 className="mt-2 text-[22px] font-semibold">{t}</h3>
              <p className="mt-1 text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="border-t border-line bg-canvas">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <h2 className="text-[32px] font-semibold">What you get</h2>
          <dl className="mt-8 grid gap-x-12 md:grid-cols-2">
            {FEATURES.map(([t, d]) => (
              <div key={t} className="border-t border-line py-5">
                <dt className="font-serif text-[20px] font-semibold text-ink">{t}</dt>
                <dd className="mt-1 text-muted">{d}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid items-center gap-6 rounded-2xl border border-violet bg-violet-l/50 p-7 md:grid-cols-[1fr_auto]">
          <div>
            <h2 className="text-[26px] font-semibold">At business school?</h2>
            <p className="mt-1 max-w-2xl text-ink-2">Verify your school email to unlock free downloads, student discounts and early access to new cases. It takes one click from your inbox.</p>
          </div>
          <SignInButton />
        </div>
      </section>

      <section className="bg-ink">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-5 py-14 sm:px-8">
          <div>
            <h2 className="text-[30px] font-semibold text-white">Start with case 1 today</h2>
            <p className="mt-1 text-[#B9C4D3]">It takes about 30 minutes. Your first log will show you exactly where to begin.</p>
          </div>
          <SignInButton dark />
        </div>
      </section>
      <footer className="mx-auto flex max-w-6xl flex-wrap justify-between gap-2 px-5 py-6 text-[13px] text-muted sm:px-8">
        <span>© {new Date().getFullYear()} Case Prep OS</span>
        <span>All cases are original and fictional, written for practice.</span>
      </footer>
    </div>
  )
}
