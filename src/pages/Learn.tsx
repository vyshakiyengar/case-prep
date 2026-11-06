import { Link } from 'react-router-dom'
import { LESSONS, MODULES, lessonBySlug, totalMinutes } from '../content/course'
import { playbook } from '../content'
import { useStore } from '../lib/store'
import { LinkButton, Meter, PageHeader, Section } from '../components/ui'

export default function Learn() {
  const { user, data } = useStore()
  const learned = new Set(data?.profile?.learned || [])
  const done = LESSONS.filter((l) => learned.has(l.slug)).length
  const nextLesson = LESSONS.find((l) => !learned.has(l.slug)) || LESSONS[0]
  let n = 0
  return (
    <>
      <PageHeader title="The case interview course"
        intro={`${LESSONS.length} short lessons, about ${Math.round(totalMinutes / 5) * 5} minutes in total. Start here, then use the frameworks, casebook and drills to practise what you learnt.`}
        action={<LinkButton to={`/learn/${nextLesson.slug}`}>{done ? 'Continue the course' : 'Start lesson 1'}</LinkButton>} />

      {user ? (
        <div className="mb-6 flex max-w-xl items-center gap-4">
          <Meter value={done} max={LESSONS.length} color="bg-teal" />
          <span className="shrink-0 text-[14px] text-muted tabular-nums">{done} of {LESSONS.length} done</span>
        </div>
      ) : (
        <p className="mb-6 text-[14px] text-muted"><Link to="/signin?next=/learn" className="font-medium text-violet-d hover:underline">Sign in</Link> to tick off lessons as you finish them.</p>
      )}

      <div className="space-y-8">
        {MODULES.map((m, mi) => (
          <section key={m.title}>
            <div className="mb-3">
              <h2 className="text-[22px] font-semibold">Module {mi + 1}: {m.title}</h2>
              <p className="text-muted">{m.blurb}</p>
            </div>
            <ol className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-white">
              {m.slugs.map((s) => {
                const l = lessonBySlug(s)!; n++
                const isDone = learned.has(s)
                return (
                  <li key={s}>
                    <Link to={`/learn/${s}`} className="grid grid-cols-[40px_1fr_auto] items-center gap-3 px-5 py-4 hover:bg-canvas/60">
                      <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold ${isDone ? 'bg-teal text-white' : 'bg-canvas text-muted'}`}>{isDone ? '✓' : n}</span>
                      <span className="min-w-0">
                        <span className="block font-serif text-[18px] font-semibold text-ink">{l.title}</span>
                        <span className="block text-[14px] text-muted">{l.summary}</span>
                      </span>
                      <span className="text-[13px] text-faint tabular-nums">{l.minutes} min</span>
                    </Link>
                  </li>
                )
              })}
            </ol>
          </section>
        ))}
      </div>

      <section className="mt-10 grid items-center gap-5 rounded-xl border-2 border-teal bg-white p-6 md:grid-cols-[1fr_auto]">
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
