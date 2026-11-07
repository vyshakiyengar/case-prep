import { useEffect, useState } from 'react'

import { loadCases } from '../content'
import type { CaseDef } from '../content'
import { LinkButton, PageHeader, Section } from '../components/ui'

const STEPS = [
  ['Pick a case they haven\'t seen', 'Start easy (one dot), then work up. Open it in interviewer mode below.'],
  ['Read the prompt aloud, once', 'Let them take notes and recap. Don\'t repeat it unless they ask.'],
  ['Give facts only when asked', 'The clarifying answers are on screen. A good candidate asks for them; don\'t volunteer.'],
  ['Show exhibits when they ask for data', 'Share your screen or read the numbers. Stay quiet while they work.'],
  ['Push like a real interviewer', 'Use the interviewer notes: "What else?", "So what?", "What would you recommend?"'],
  ['Give feedback, then swap', 'Score each stage, name one thing to fix, then switch roles for the next case.'],
]

export default function Interviewer() {
  const [cases, setCases] = useState<CaseDef[] | null>(null)
  useEffect(() => { loadCases().then(setCases) }, [])
  return (
    <>
      <PageHeader title="Interviewer mode" intro="Give a case to a friend, then swap. Each case shows you what to read aloud, what to reveal when asked, and the model answers." />
      <Section title="How to run a case for a partner" className="mb-6">
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-lg border border-line p-4">
              <div className="text-[15px] font-semibold text-ink"><span className="mr-1.5 text-teal-d">{i + 1}</span>{t}</div>
              <p className="mt-1 text-[14px] text-muted">{d}</p>
            </li>
          ))}
        </ol>
      </Section>
      <Section title="Pick a case to give">
        {!cases ? <p className="text-muted">Loading cases…</p> : (
          <ul className="divide-y divide-line">
            {cases.map((c) => (
              <li key={c.slug} className="flex flex-wrap items-center justify-between gap-3 py-3">
                <div className="min-w-0">
                  <div className="font-medium text-ink">{c.id}. {c.title} <span className="ml-1 text-[13px] text-muted">{'●'.repeat(c.diff)}{'○'.repeat(3 - c.diff)}</span></div>
                  <div className="text-[14px] text-muted">{c.type} · {c.industry}</div>
                </div>
                <LinkButton to={`/casebook/${c.slug}?mode=interviewer`} variant="secondary">Give this case</LinkButton>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
