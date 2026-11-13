import { ArtInterviewer } from '../components/Art'
import { useEffect, useState } from 'react'

import { loadCases } from '../content'
import type { CaseDef } from '../content'
import { LinkButton, PageHeader, Section } from '../components/ui'

const STEPS = [
  ['Read the prompt aloud, once', 'Give facts and exhibits only when they ask.'],
  ['Push like an interviewer', 'Ask "So what?" and "What would you recommend?"'],
  ['Score it, then swap', 'Name one thing to fix, then switch roles.'],
]

export default function Interviewer() {
  const [cases, setCases] = useState<CaseDef[] | null>(null)
  useEffect(() => { loadCases().then(setCases) }, [])
  return (
    <>
      <PageHeader title="Interviewer mode" art={<ArtInterviewer />} intro="Give a case to a friend: what to read aloud, what to reveal, and the model answers." />
      <Section title="How to run it" className="mb-6">
        <ol className="grid gap-3 md:grid-cols-3">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="rounded-lg border border-line p-4">
              <div className="text-[14.5px] font-semibold text-ink"><span className="mr-1.5 text-teal-d">{i + 1}</span>{t}</div>
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
                <LinkButton to={`/casebook/${c.slug}?mode=interviewer`} variant="secondary">Open</LinkButton>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </>
  )
}
