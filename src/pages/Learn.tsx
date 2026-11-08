import { useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { LESSONS, lessonBySlug, totalMinutes } from '../content/course'
import type { Lesson } from '../content/course'
import { playbook } from '../content'
import { useStore } from '../lib/store'
import { LinkButton, PageHeader, Section } from '../components/ui'
import { Rich, StructureTree } from '../components/CaseParts'
import { Gate, Quiz, TryIt } from '../components/Learning'
import { CoreFrameworksMini } from '../components/FrameworkTree'
import { CaseMap } from '../components/CaseMap'
import { CORE } from '../content/frameworkTrees'
import { PAGES, pageTitle } from '../content/coursePages'
import { NotesBox } from '../components/NotesBox'


function SectionBody({ s }: { s: Lesson['sections'][number] }) {
  return (
    <section>
      <h3 className="text-[21px] font-semibold">{s.h}</h3>
      <div className="rich mt-2 text-[16.5px] leading-[1.7] [&_p]:mb-3"><Rich html={s.body} /></div>
    </section>
  )
}

function LessonChapter({ l, n }: { l: Lesson; n: number }) {
  const { data } = useStore()
  const done = !!data?.profile?.learned?.includes(l.slug)
  const freeCount = l.sections.length > 2 ? 2 : 1
  return (
    <article id={l.slug} className="scroll-mt-32 rounded-2xl border border-line bg-white p-5 shadow-[0_1px_0_#E3E7ED,0_24px_48px_-36px_rgba(15,27,51,.4)] sm:p-9">
      <p className="text-[13.5px] text-muted">Lesson {n} of {LESSONS.length}, {l.minutes} min{done && <span className="ml-2 font-medium text-teal-d">Completed ✓</span>}</p>
      <h2 className="mt-1 text-[30px] leading-tight font-semibold">{l.title}</h2>
      <p className="mt-1 max-w-2xl text-[16.5px] text-muted">{l.summary}</p>

      <div className="mt-6 max-w-[68ch] space-y-7">
        {l.sections.slice(0, freeCount).map((s) => <SectionBody key={s.h} s={s} />)}
        <Gate title="Sign in to finish this lesson" body="The rest of the lesson, the worked example, the timed exercise and the quiz. Free.">
          <div className="space-y-7">
            {l.sections.slice(freeCount).map((s) => <SectionBody key={s.h} s={s} />)}

            {l.example && (
              <section className="graph-paper rounded-xl border border-line p-5 sm:p-6">
                <h3 className="text-[19px] font-semibold">Worked example: {l.example.title.charAt(0).toLowerCase() + l.example.title.slice(1)}</h3>
                <div className="mt-2 text-[16px] leading-[1.7]"><Rich html={l.example.body} /></div>
                {l.example.tree && <div className="mt-3"><StructureTree s={l.example.tree} /></div>}
              </section>
            )}

            {l.slug === 'structuring' && (
              <section id="core-frameworks" className="scroll-mt-32">
                <h3 className="text-[21px] font-semibold">The eleven core frameworks</h3>
                <p className="mt-1 mb-3 text-[16px] leading-relaxed text-ink-2">These eleven trees cover most cases you will get. Here is the first level of each. Learn them well enough to sketch from memory, then always rename the branches for your client. Each opens as a full tree on the frameworks page.</p>
                <CoreFrameworksMini items={CORE} />
                <p className="mt-3 text-[14.5px] text-ink-2">Inside any branch, dig into the <Link to="/frameworks#drivers" className="font-medium text-violet-d hover:underline">second-order drivers</Link> (market, customers, competition, industry, execution, macro).</p>
              </section>
            )}

            {l.slug === 'charts-and-exhibits' && (
              <section className="flex flex-wrap items-center justify-between gap-4 rounded-xl border-2 border-violet bg-white p-5">
                <div className="max-w-xl">
                  <h3 className="text-[19px] font-semibold">Practise on 64 charts</h3>
                  <p className="mt-1 text-ink-2">The graph library has bar, line, waterfall, scatter, Marimekko and more, each with a question, a model answer and the "so what". Do one of each type first.</p>
                </div>
                <LinkButton to="/graphs">Open the graph library</LinkButton>
              </section>
            )}

            {l.slug === 'how-you-come-across' && (
              <section id="exercises" className="scroll-mt-32">
                <h3 className="text-[21px] font-semibold">The daily exercise menu</h3>
                <p className="mt-1 text-muted">Pick 2-3 a day. Tick them off in the tracker under mind, voice and reading. <Link to="/interview-skills" className="font-medium text-violet-d hover:underline">Full interview skills guide</Link></p>
                <ul className="mt-3 divide-y divide-line rounded-xl border border-line bg-white">
                  {playbook.skills.map((s) => (
                    <li key={s.name} className="px-4 py-3">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-ink">{s.name.replace(/^(\w+) · /, (_, k: string) => `${k[0]}${k.slice(1).toLowerCase()}: `)}</span>
                        <span className="text-[13px] text-muted">{s.dose}</span>
                      </div>
                      <p className="text-[14.5px] text-ink-2">{s.how}</p>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {l.tryIt && <TryIt t={l.tryIt} />}

            <section className="rounded-xl border border-teal bg-teal-l/50 p-5">
              <h3 className="text-[19px] font-semibold">Remember</h3>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] text-ink">{l.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>

            <section>
              <h3 className="text-[21px] font-semibold">Check yourself</h3>
              <div className="mt-3"><Quiz items={l.quiz} /></div>
            </section>

            <div className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
              <span className="text-[14.5px] text-ink-2">Now practise it:</span>
              <LinkButton to={l.practice.to} variant="secondary">{l.practice.label}</LinkButton>
            </div>
          </div>
        </Gate>
      </div>
    </article>
  )
}

/** Small previous / next controls, shown at the start and end of each page. */
function PageTurner({ i, onTurn, top = false }: { i: number; onTurn: (to: number) => void; top?: boolean }) {
  const prev = PAGES[i - 1], next = PAGES[i + 1]
  const pill = 'group inline-flex max-w-[48%] items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13.5px] text-ink-2 transition-[border-color,color,transform] duration-200 hover:border-teal hover:text-ink active:scale-[.98]'
  return (
    <nav aria-label={top ? 'Course pages (top)' : 'Course pages'} className={`flex items-center justify-between gap-3 ${top ? 'mb-5' : 'mt-8'}`}>
      {prev ? (
        <button onClick={() => onTurn(i - 1)} className={pill}>
          <span aria-hidden className="text-teal-d transition-transform group-hover:-translate-x-0.5">←</span>
          <span className="truncate"><span className="text-muted">Previous: </span>{prev.label}</span>
        </button>
      ) : <span />}
      {next && (
        i === 0 && !top
          ? <button onClick={() => onTurn(1)} className="btn-primary inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[14.5px] font-medium text-white transition-transform hover:-translate-y-px">Start the course <span aria-hidden>→</span></button>
          : <button onClick={() => onTurn(i + 1)} className={pill}>
              <span className="truncate"><span className="text-muted">Next: </span>{next.label}</span>
              <span aria-hidden className="text-teal-d transition-transform group-hover:translate-x-0.5">→</span>
            </button>
      )}
    </nav>
  )
}

function CourseBar({ i, onTurn, done }: { i: number; onTurn: (to: number) => void; done?: string }) {
  const bar = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    let raf = 0
    const tick = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      bar.current?.style.setProperty('--p', String(max > 0 ? Math.min(1, window.scrollY / max) : 0))
    }
    const on = () => { if (!raf) raf = requestAnimationFrame(tick) }
    tick(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); cancelAnimationFrame(raf) }
  }, [i])
  const arrow = 'flex h-8 w-8 items-center justify-center rounded-lg border border-line bg-white text-ink transition-colors hover:border-teal disabled:opacity-35 disabled:hover:border-line'
  return (
    <nav aria-label="Course" className="sticky top-[57px] z-10 -mx-4 mb-6 border-b border-line bg-canvas/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
      <div className="flex items-center justify-between gap-3">
        <label className="flex min-w-0 items-center gap-2 text-[14px] text-muted">
          <span className="shrink-0">Jump to</span>
          <select value={PAGES[i].id} onChange={(e) => onTurn(PAGES.findIndex((p) => p.id === e.target.value))}
            className="min-w-0 max-w-[13rem] truncate rounded-lg border border-line bg-white px-2.5 py-1.5 text-[14px] font-medium text-ink sm:max-w-sm">
            {PAGES.map((p, pi) => <option key={p.id} value={p.id}>{pageTitle(p.id, pi)}</option>)}
          </select>
        </label>
        <div className="flex shrink-0 items-center gap-2 text-[13.5px] text-muted">
          <span className="hidden sm:inline">{done ? `${done} · ` : ''}Page {i + 1} of {PAGES.length}</span>
          <span className="sm:hidden">{i + 1}/{PAGES.length}</span>
          <button className={arrow} disabled={i === 0} onClick={() => onTurn(i - 1)} aria-label="Previous page">‹</button>
          <button className={arrow} disabled={i === PAGES.length - 1} onClick={() => onTurn(i + 1)} aria-label="Next page">›</button>
        </div>
      </div>
      <span aria-hidden className="absolute inset-x-0 -bottom-px h-[2px] overflow-hidden"><span ref={bar} className="read-progress block h-full bg-teal" /></span>
    </nav>
  )
}

export default function Learn() {
  const { slug } = useParams()
  const loc = useLocation()
  const navigate = useNavigate()
  const { user, data, markLesson } = useStore()
  const found = PAGES.findIndex((p) => p.id === (slug || 'case-map'))
  const i = found < 0 ? 0 : found
  const page = PAGES[i]
  const learned = new Set(data?.profile?.learned || [])
  const done = LESSONS.filter((l) => learned.has(l.slug)).length
  const nextLesson = LESSONS.find((l) => !learned.has(l.slug)) || LESSONS[0]

  // which way did we turn? forward pages come in from the right
  const last = useRef(i)
  const dir = useRef<'next' | 'prev'>('next')
  if (i !== last.current) dir.current = i > last.current ? 'next' : 'prev'
  useEffect(() => { last.current = i }, [i])

  // deep links like /learn/structuring#core-frameworks
  useEffect(() => {
    if (!loc.hash) return
    const t = setTimeout(() => document.getElementById(decodeURIComponent(loc.hash.slice(1)))?.scrollIntoView({ block: 'start' }), 120)
    return () => clearTimeout(t)
  }, [loc.hash, i])

  const turn = (to: number) => {
    if (to < 0 || to >= PAGES.length || to === i) return
    // finishing a lesson by moving forward counts it as read
    if (to > i && user && LESSONS.some((l) => l.slug === page.id) && !learned.has(page.id)) markLesson(page.id, true)
    navigate(PAGES[to].to)
  }

  // arrow keys turn the page, like an e-reader
  const turnRef = useRef(turn); turnRef.current = turn
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement
      if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey || t.closest('input, textarea, select, [contenteditable="true"]')) return
      if (e.key === 'ArrowRight') turnRef.current(last.current + 1)
      if (e.key === 'ArrowLeft') turnRef.current(last.current - 1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const lessonN = LESSONS.findIndex((l) => l.slug === page.id) + 1
  return (
    <>
      {i === 0 && (
        <PageHeader title="The case interview course"
          intro={`${LESSONS.length} short lessons, about ${Math.round(totalMinutes / 5) * 5} minutes in total. One lesson per page: turn with the buttons or your arrow keys.`}
          action={<LinkButton to={`/learn/${nextLesson.slug}`}>{done ? 'Continue where I left off' : 'Start lesson 1'}</LinkButton>} />
      )}

      <CourseBar i={i} onTurn={turn} done={user ? `${done} of ${LESSONS.length} done` : undefined} />

      <div key={page.id} className={dir.current === 'prev' ? 'turn-prev' : 'turn-next'}>
        {i > 0 && <PageTurner i={i} onTurn={turn} top />}
        {page.id === 'case-map' && (
          <section id="case-map" className="scroll-mt-32">
            <h2 className="text-[28px] leading-tight">First, the map: how a case interview flows</h2>
            <p className="mt-1 mb-5 max-w-2xl text-[16px] text-ink-2">Every case has the same six steps and takes 30 to 40 minutes. Read these six lines, then turn the page to start lesson 1.</p>
            <CaseMap />
            <p className="mt-4 text-[15px] text-ink-2">Want to see a whole case done well? <Link to="/perfect-casing" className="font-medium text-violet-d hover:underline">See the perfect case</Link></p>
          </section>
        )}

        {lessonN > 0 && (
          <>
            {page.module && <p className="mb-2 text-[13.5px] font-medium text-teal-d">{page.module}</p>}
            <LessonChapter l={lessonBySlug(page.id)!} n={lessonN} />
          </>
        )}

        {page.id === 'whats-next' && (
          <>
            <section className="grid items-center gap-5 rounded-2xl border-2 border-teal bg-white p-6 md:grid-cols-[1fr_auto]">
              <div>
                <h2 className="text-[24px] leading-tight">Next: perfect casing</h2>
                <p className="mt-1 text-ink-2">The course teaches each skill. Perfect casing puts them in order: the 10 stages of a strong case, the exact words to use at each, and a 5-minute daily trainer that makes those words automatic.</p>
              </div>
              <LinkButton to="/perfect-casing">Open perfect casing</LinkButton>
            </section>
            <Section title="Then: a 6-week practice plan" className="mt-6">
              <p className="mb-4 text-muted">This is how to turn the course into an offer. The tracker in My prep follows the same plan.</p>
              <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {playbook.plan.map((p, pi) => (
                  <li key={p.week} className="rounded-lg border border-line p-4">
                    <div className={`font-serif text-[15px] font-semibold ${pi < 2 ? 'text-teal-d' : pi < 4 ? 'text-violet-d' : 'text-signal-d'}`}>{p.week}</div>
                    <p className="mt-1 text-[14.5px] text-ink">{p.focus}</p>
                    <p className="mt-1.5 text-[13.5px] text-muted">Target: {p.volume}</p>
                  </li>
                ))}
              </ol>
            </Section>
          </>
        )}

        {user && <NotesBox pageId={page.id} title={pageTitle(page.id, i)} />}

        <PageTurner i={i} onTurn={turn} />
      </div>
    </>
  )
}
