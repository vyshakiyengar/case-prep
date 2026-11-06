import { useEffect, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { LESSONS, lessonBySlug } from '../content/course'
import type { Lesson as L } from '../content/course'
import { playbook } from '../content'
import { useStore } from '../lib/store'
import { Button, LinkButton } from '../components/ui'
import { Rich, StructureTree } from '../components/CaseParts'
import { Countdown } from '../components/Timer'
import { inputCls } from '../components/ui'

function TryIt({ t }: { t: NonNullable<L['tryIt']> }) {
  const [shown, setShown] = useState(false)
  const [mine, setMine] = useState('')
  return (
    <section className="rounded-xl border-2 border-violet bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h2 className="text-[22px] font-semibold">Try it now</h2>
        <Countdown seconds={t.seconds} label="Suggested time" />
      </div>
      <p className="mt-2 text-[16px] leading-relaxed text-ink">{t.prompt}</p>
      <textarea className={`${inputCls} mt-3`} rows={4} value={mine} onChange={(e) => setMine(e.target.value)} placeholder="Write or say your answer before you look. Typing is optional." />
      {shown ? (
        <div className="mt-3 rounded-lg bg-good-l/60 p-4">
          <div className="text-[13px] font-semibold text-good">One strong answer</div>
          <p className="mt-1 text-[15.5px] leading-relaxed text-ink">{t.model}</p>
          <p className="mt-2 text-[13.5px] text-muted">Yours doesn't need to match. Check it has the same shape.</p>
        </div>
      ) : <Button className="mt-3" variant="secondary" onClick={() => setShown(true)}>Compare with a strong answer</Button>}
    </section>
  )
}

function Quiz({ items }: { items: L['quiz'] }) {
  const [picked, setPicked] = useState<Record<number, number>>({})
  return (
    <ol className="space-y-5">
      {items.map((it, qi) => {
        const p = picked[qi]
        return (
          <li key={qi}>
            <p className="font-medium text-ink">{qi + 1}. {it.q}</p>
            <div className="mt-2 grid gap-2">
              {it.options.map((o, oi) => {
                const chosen = p === oi, correct = oi === it.answer, revealed = p !== undefined
                const tone = !revealed ? 'border-line bg-white hover:border-faint' : correct ? 'border-good bg-good-l' : chosen ? 'border-signal bg-signal-l' : 'border-line bg-white opacity-70'
                return (
                  <button key={oi} disabled={revealed} onClick={() => setPicked((x) => ({ ...x, [qi]: oi }))}
                    className={`rounded-lg border px-3 py-2.5 text-left text-[14.5px] text-ink ${tone}`}>
                    {o}{revealed && correct && <span className="ml-2 text-[13px] font-medium text-good">Correct</span>}
                  </button>
                )
              })}
            </div>
            {p !== undefined && <p className={`mt-2 text-[14px] ${p === it.answer ? 'text-good' : 'text-signal-d'}`}>{p === it.answer ? 'Right. ' : 'Not quite. '}<span className="text-ink-2">{it.why}</span></p>}
          </li>
        )
      })}
    </ol>
  )
}

export default function Lesson() {
  const { slug } = useParams()
  const { user, data, markLesson } = useStore()
  const l = lessonBySlug(slug || '')
  useEffect(() => { if (window.location.hash) document.getElementById(window.location.hash.slice(1))?.scrollIntoView() }, [slug])
  if (!l) return <Navigate to="/learn" replace />
  const i = LESSONS.indexOf(l)
  const prev = LESSONS[i - 1], next = LESSONS[i + 1]
  const done = !!data?.profile?.learned?.includes(l.slug)
  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_220px]">
      <article className="min-w-0">
        <Link to="/learn" className="text-[13.5px] text-muted hover:text-ink">Course</Link>
        <p className="mt-2 text-[14px] text-muted">Lesson {i + 1} of {LESSONS.length}, {l.minutes} minutes</p>
        <h1 className="mt-1 text-[34px] leading-tight font-semibold sm:text-[40px]">{l.title}</h1>
        <p className="mt-2 max-w-2xl text-[17px] text-muted">{l.summary}</p>

        <div className="mt-8 max-w-[68ch] space-y-8">
          {l.sections.map((s) => (
            <section key={s.h}>
              <h2 className="text-[23px] font-semibold">{s.h}</h2>
              <div className="rich mt-2 text-[16.5px] leading-[1.7] [&_p]:mb-3"><Rich html={s.body} /></div>
            </section>
          ))}

          {l.example && (
            <section className="graph-paper rounded-xl border border-line p-5 sm:p-6">
              <h2 className="text-[20px] font-semibold">Worked example: {l.example.title.charAt(0).toLowerCase() + l.example.title.slice(1)}</h2>
              <div className="mt-2 text-[16px] leading-[1.7]"><Rich html={l.example.body} /></div>
              {l.example.tree && <div className="mt-3"><StructureTree s={l.example.tree} /></div>}
            </section>
          )}

          {l.slug === 'how-you-come-across' && (
            <section id="exercises">
              <h2 className="text-[23px] font-semibold">The daily exercise menu</h2>
              <p className="mt-1 text-muted">Pick 2-3 a day. Tick them off in the tracker under mind, voice and reading.</p>
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

          {l.tryIt && <TryIt key={l.slug} t={l.tryIt} />}

          <section className="rounded-xl border border-teal bg-teal-l/50 p-5">
            <h2 className="text-[20px] font-semibold">Remember</h2>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-[16px] text-ink">{l.takeaways.map((t) => <li key={t}>{t}</li>)}</ul>
          </section>

          <section>
            <h2 className="text-[23px] font-semibold">Check yourself</h2>
            <div className="mt-3"><Quiz key={l.slug} items={l.quiz} /></div>
          </section>

          <section className="flex flex-wrap items-center gap-3 border-t border-line pt-6">
            <LinkButton to={l.practice.to}>{l.practice.label}</LinkButton>
            {user
              ? <Button variant={done ? 'secondary' : 'secondary'} onClick={() => markLesson(l.slug, !done)}>{done ? 'Completed ✓' : 'Mark as complete'}</Button>
              : <Link to={`/signin?next=/learn/${l.slug}`} className="text-[14px] font-medium text-violet-d hover:underline">Sign in to track your progress</Link>}
          </section>

          <nav className="flex justify-between gap-4 pb-4" aria-label="Lessons">
            {prev ? <Link to={`/learn/${prev.slug}`} className="text-[14.5px] text-muted hover:text-ink">Previous: {prev.title}</Link> : <span />}
            {next && <Link to={`/learn/${next.slug}`} className="text-right text-[14.5px] font-medium text-ink hover:underline">Next: {next.title}</Link>}
          </nav>
        </div>
      </article>

      <aside className="hidden lg:block">
        <div className="sticky top-8">
          <div className="text-[13px] font-medium text-faint">In this course</div>
          <ol className="mt-2 space-y-0.5">
            {LESSONS.map((x, k) => (
              <li key={x.slug}>
                <Link to={`/learn/${x.slug}`} className={`block rounded-md px-2 py-1.5 text-[13.5px] ${x.slug === l.slug ? 'bg-white font-medium text-ink shadow-[inset_0_0_0_1px_var(--color-line)]' : 'text-muted hover:text-ink'}`}>
                  <span className="mr-1.5 tabular-nums text-faint">{k + 1}</span>{x.title}{data?.profile?.learned?.includes(x.slug) && <span className="ml-1 text-teal">✓</span>}
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  )
}
