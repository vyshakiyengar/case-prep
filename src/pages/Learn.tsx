import { Link, useParams } from 'react-router-dom'
import { LESSONS, MODULES, lessonBySlug, totalMinutes } from '../content/course'
import type { Lesson } from '../content/course'
import { playbook } from '../content'
import { useStore } from '../lib/store'
import { Button, LinkButton, Meter, PageHeader, Section } from '../components/ui'
import { Rich, StructureTree } from '../components/CaseParts'
import { Gate, Quiz, StickyNav, TryIt, useScrollToTarget } from '../components/Learning'

const STEPS = [
  ['Learn', 'One idea, in plain English.'],
  ['Compare', 'A weak answer next to a strong one.'],
  ['Try it', 'A timed exercise. Say it out loud.'],
  ['Check', 'A short quiz, then a link to practise.'],
]

function SectionBody({ s }: { s: Lesson['sections'][number] }) {
  return (
    <section>
      <h3 className="text-[21px] font-semibold">{s.h}</h3>
      <div className="rich mt-2 text-[16.5px] leading-[1.7] [&_p]:mb-3"><Rich html={s.body} /></div>
    </section>
  )
}

function LessonChapter({ l, n }: { l: Lesson; n: number }) {
  const { user, data, markLesson } = useStore()
  const done = !!data?.profile?.learned?.includes(l.slug)
  const freeCount = l.sections.length > 2 ? 2 : 1
  return (
    <article id={l.slug} className="scroll-mt-32 rounded-2xl border border-line bg-white p-5 sm:p-8">
      <p className="text-[13.5px] text-muted">Lesson {n} of {LESSONS.length} · {l.minutes} min{done && <span className="ml-2 font-medium text-teal-d">Completed ✓</span>}</p>
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
              <LinkButton to={l.practice.to}>{l.practice.label}</LinkButton>
              {user && <Button variant="secondary" onClick={() => markLesson(l.slug, !done)}>{done ? 'Completed ✓' : 'Mark as complete'}</Button>}
            </div>
          </div>
        </Gate>
      </div>
    </article>
  )
}

export default function Learn() {
  const { slug } = useParams()
  const { user, data } = useStore()
  useScrollToTarget(slug && lessonBySlug(slug) ? slug : undefined)
  const learned = new Set(data?.profile?.learned || [])
  const done = LESSONS.filter((l) => learned.has(l.slug)).length
  const nextLesson = LESSONS.find((l) => !learned.has(l.slug)) || LESSONS[0]
  const nav = LESSONS.map((l, i) => ({ id: l.slug, label: `${i + 1}. ${l.title.split(':')[0]}` }))
  let n = 0
  return (
    <>
      <PageHeader title="The case interview course"
        intro={`${LESSONS.length} short lessons on one page, about ${Math.round(totalMinutes / 5) * 5} minutes in total. Read top to bottom, or jump to a lesson from the bar below.`}
        action={<LinkButton to={`/learn/${nextLesson.slug}`}>{done ? 'Continue where I left off' : 'Start lesson 1'}</LinkButton>} />

      <div className="mb-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <ol className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[14px]" aria-label="How each lesson works">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex items-center gap-2" title={d}>
              <span className="rounded-full bg-white px-2.5 py-1 font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)]"><span className="mr-1 text-teal-d">{i + 1}</span>{t}</span>
              {i < STEPS.length - 1 && <span className="text-faint" aria-hidden>→</span>}
            </li>
          ))}
        </ol>
        {user && (
          <div className="flex min-w-60 flex-1 items-center gap-3">
            <Meter value={done} max={LESSONS.length} color="bg-teal" />
            <span className="shrink-0 text-[14px] text-muted tabular-nums">{done} of {LESSONS.length} done</span>
          </div>
        )}
      </div>

      <StickyNav items={nav} />

      <div className="space-y-10">
        {MODULES.map((m, mi) => (
          <div key={m.title} className="space-y-6">
            <div className="border-b border-line pb-2">
              <p className="text-[13px] font-semibold text-teal-d">Module {mi + 1}</p>
              <h2 className="text-[24px] font-semibold">{m.title}</h2>
              <p className="text-muted">{m.blurb}</p>
            </div>
            {m.slugs.map((s) => { n++; return <LessonChapter key={s} l={lessonBySlug(s)!} n={n} /> })}
          </div>
        ))}
      </div>

      <section className="mt-12 grid items-center gap-5 rounded-xl border-2 border-teal bg-white p-6 md:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-[22px] font-semibold">Next: perfect casing</h2>
          <p className="mt-1 text-ink-2">The course teaches each skill. Perfect casing puts them in order: the 10 stages of a strong case, the exact words to use at each, and a 5-minute daily trainer that makes those words automatic.</p>
        </div>
        <LinkButton to="/perfect-casing">Open perfect casing</LinkButton>
      </section>

      <Section title="Then: a 6-week practice plan" className="mt-6">
        <p className="mb-4 text-muted">Once you've done the course, this is how to turn it into an offer. The tracker in My prep follows the same plan.</p>
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {playbook.plan.map((p, i) => (
            <li key={p.week} className="rounded-lg border border-line p-4">
              <div className={`font-serif text-[15px] font-semibold ${i < 2 ? 'text-teal-d' : i < 4 ? 'text-violet-d' : 'text-signal-d'}`}>{p.week}</div>
              <p className="mt-1 text-[14.5px] text-ink">{p.focus}</p>
              <p className="mt-1.5 text-[13.5px] text-muted">Target: {p.volume}</p>
            </li>
          ))}
        </ol>
      </Section>
    </>
  )
}
