import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { HABITS, CASE_TYPES } from '../lib/types'
import { diffDays, todayIso, fmtShort } from '../lib/dates'
import { byDate, caseOverall, dayScore, improvement, LESSON_FOR, SPRINT_FOR, stageAverages, streak, weakestStage, weekly } from '../lib/stats'
import { LinkButton, Meter, PageHeader, ScoreChip, Section } from '../components/ui'

export function HabitChecklist({ date }: { date: string }) {
  const { data, toggleHabit } = useStore()
  const day = data!.days[date]
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {(['A', 'B'] as const).map((t) => (
        <div key={t}>
          <h3 className={`mb-2 font-sans text-[13.5px] font-semibold ${t === 'A' ? 'text-teal-d' : 'text-violet-d'}`}>{t === 'A' ? 'Solve the case' : 'Come across well'}</h3>
          <ul className="space-y-1.5">
            {HABITS.filter((h) => h.track === t).map((h) => {
              const on = !!day?.habits[h.key]
              return (
                <li key={h.key}>
                  <button onClick={() => toggleHabit(date, h.key)} aria-pressed={on}
                    className={`flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors ${on ? (t === 'A' ? 'border-teal bg-teal-l' : 'border-violet bg-violet-l') : 'border-line bg-white hover:border-faint'}`}>
                    <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 ${on ? (t === 'A' ? 'border-teal bg-teal' : 'border-violet bg-violet') : 'border-faint'}`}>
                      {on && <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden><path d="M2.5 6.2 5 8.5l4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[14.5px] font-medium text-ink">{h.label}</span>
                      <span className="block text-[12.5px] text-muted">{h.hint}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}

function FirstSteps() {
  const { data } = useStore()
  const learned = new Set(data!.profile?.learned || [])
  const trained = Object.keys(data!.profile?.trainer || {}).length
  const hasCase = data!.cases.length > 0
  const steps = [
    { t: 'Do the first three lessons', d: 'How cases work, the opening, and structuring (with the eleven core frameworks). About 35 minutes.', done: ['how-case-interviews-work', 'the-opening', 'structuring'].every((s) => learned.has(s)), to: '/learn/how-case-interviews-work' },
    { t: 'Train your first perfect-casing phrases', d: 'A 5-minute session. Say each line out loud.', done: trained >= 5, to: '/perfect-casing#trainer' },
    { t: 'Do case 1 alone, with the timer', d: 'Coastal Brew, an easy profitability case. Talk out loud.', done: hasCase, to: '/casebook/coastal-brew' },
    { t: 'Score it and write one fix', d: 'The last step of the case saves it to your case log.', done: hasCase && data!.cases.some((c) => c.fix), to: '/cases' },
  ]
  const n = steps.filter((s) => s.done).length
  return (
    <Section title="Your first steps" aside={<span className="text-[14px] text-muted tabular-nums">{n} of {steps.length} done</span>}>
      <ol className="space-y-2">
        {steps.map((s, i) => (
          <li key={s.t}>
            <Link to={s.to} className={`flex items-start gap-3 rounded-lg border px-4 py-3 ${s.done ? 'border-good/40 bg-good-l/40' : 'border-line bg-white hover:border-faint'}`}>
              <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] font-semibold ${s.done ? 'bg-good text-white' : 'bg-canvas text-muted'}`}>{s.done ? '✓' : i + 1}</span>
              <span><span className={`block font-medium ${s.done ? 'text-muted line-through' : 'text-ink'}`}>{s.t}</span><span className="block text-[13.5px] text-muted">{s.d}</span></span>
            </Link>
          </li>
        ))}
      </ol>
      <p className="mt-3 text-[13.5px] text-muted">After your first case, this space shows your weakest stage and what to do about it.</p>
    </Section>
  )
}

export default function Today() {
  const { data } = useStore()
  const p = data!.profile
  const t = todayIso()
  const dayN = p?.startDate ? diffDays(p.startDate, t) + 1 : 1
  const toGo = p?.interviewDate ? diffDays(t, p.interviewDate) : null
  const score = dayScore(data!.days[t])
  const st = streak(data!.days)
  const cases = data!.cases
  const weak = weakestStage(cases)
  const stages = stageAverages(cases)
  const imp = improvement(cases)
  const weeks = weekly(p, data!.days, cases)
  const maxWeek = Math.max(8, ...weeks.map((w) => w.total))
  const fixes = byDate(cases).reverse().filter((c) => c.fix).slice(0, 5)
  const typeCount = Object.fromEntries(CASE_TYPES.map((ty) => [ty, cases.filter((c) => c.type === ty).length]))

  const title = dayN < 1 ? `Your prep starts in ${-dayN + 1} day${-dayN + 1 === 1 ? '' : 's'}` : `Day ${dayN} of your prep`
  const sub = [
    toGo !== null && (toGo > 0 ? `${toGo} days until your interview.` : toGo === 0 ? 'Your interview is today. You have done the work.' : null),
    st > 1 ? `You've practised ${st} days in a row.` : null,
  ].filter(Boolean).join(' ')

  return (
    <>
      <PageHeader title={title} intro={sub || 'Tick off what you do today, and log every case you practise.'}
        action={<LinkButton to="/cases?new=1">Log a case</LinkButton>} />

      <div className="grid gap-5 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-5">
          {cases.length === 0 && <FirstSteps />}
          <Section title="Today's habits" aside={<span className={`text-[14px] font-semibold tabular-nums ${score >= 5 ? 'text-good' : score >= 3 ? 'text-[#8A6A00]' : 'text-muted'}`}>{score} of 8{score >= 5 ? ', a real prep day' : ''}</span>}>
            <HabitChecklist date={t} />
            <p className="mt-4 text-[13.5px] text-muted">Five or more is a real prep day. Not every day has to be.</p>
          </Section>

          {weak && (
            <section className="rounded-xl border border-signal bg-signal-l p-5">
              <h2 className="text-[19px] font-semibold text-signal-d">Next focus: {weak.label.toLowerCase()}</h2>
              <p className="mt-1 text-ink-2">It's your weakest stage so far, averaging {weak.avg?.toFixed(1)} out of 5. {weak.great}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <LinkButton to={`/learn/${LESSON_FOR[weak.key].slug}`} variant="secondary">Re-read the lesson: {LESSON_FOR[weak.key].title}</LinkButton>
                <LinkButton to={SPRINT_FOR[weak.key].to} variant="secondary">{SPRINT_FOR[weak.key].label}</LinkButton>
              </div>
            </section>
          )}

          {cases.length > 0 && <Section title="Stage scores" aside={<span className="text-[13.5px] text-muted">Average across {cases.length} case{cases.length === 1 ? '' : 's'}</span>}>
            <ul className="space-y-3">
              {stages.map((s) => (
                <li key={s.key} className="grid grid-cols-[150px_1fr_36px] items-center gap-3 sm:grid-cols-[190px_1fr_40px]">
                  <span className={`text-[14px] ${weak?.key === s.key ? 'font-semibold text-signal-d' : 'text-ink'}`}>{s.label}</span>
                  <Meter value={s.avg} color={weak?.key === s.key ? 'bg-signal' : 'bg-teal'} />
                  <span className="text-right text-[14px] font-semibold tabular-nums text-ink">{s.avg?.toFixed(1) ?? '–'}</span>
                </li>
              ))}
            </ul>
          </Section>}

          {weeks.some((w) => w.total > 0) && <Section title="Week by week" aside={<Link to="/tracker" className="text-[13.5px] font-medium text-violet-d hover:underline">Open tracker</Link>}>
            <div className="flex h-40 items-end gap-2" role="img" aria-label="Tracker score by week">
              {weeks.slice(0, 8).map((w) => (
                <div key={w.week} className="flex flex-1 flex-col items-center gap-1">
                  <span className="text-[12px] tabular-nums text-muted">{w.total || ''}</span>
                  <div className="w-full rounded-t bg-violet/85" style={{ height: `${(w.total / maxWeek) * 110}px` }} />
                  <span className="text-[12px] text-muted">W{w.week}</span>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[13.5px] text-muted">A strong week scores 35 or more: five-plus habits on most days.</p>
          </Section>}
        </div>

        <div className="space-y-5">
          <Section title="Before your next case">
            {fixes.length ? (
              <>
                <p className="mb-3 text-[13.5px] text-muted">Read these out loud. Pick one to focus on.</p>
                <ul className="space-y-2">
                  {fixes.map((c) => (
                    <li key={c.id} className="rounded-lg bg-marker-l px-3 py-2">
                      <span className="block text-[14.5px] font-medium text-ink">{c.fix}</span>
                      <span className="block text-[12.5px] text-muted">{c.name}, {fmtShort(c.date)}</span>
                    </li>
                  ))}
                </ul>
              </>
            ) : <p className="text-muted">The fixes you write in your case log appear here, so you see them right before you practise.</p>}
          </Section>

          {cases.length > 0 && <Section title="Are you improving?">
            <dl className="grid grid-cols-2 gap-4">
              <div><dt className="text-[13px] text-muted">First 5 cases</dt><dd className="font-serif text-[26px] font-semibold text-ink">{imp.first?.toFixed(1) ?? '–'}</dd></div>
              <div><dt className="text-[13px] text-muted">Last 5 cases</dt><dd className="font-serif text-[26px] font-semibold text-ink">{imp.last?.toFixed(1) ?? '–'}</dd></div>
              <div><dt className="text-[13px] text-muted">Change</dt><dd className={`font-serif text-[26px] font-semibold ${imp.change && imp.change > 0 ? 'text-good' : imp.change && imp.change < 0 ? 'text-signal-d' : 'text-ink'}`}>{imp.change === null ? '–' : `${imp.change > 0 ? '+' : ''}${imp.change.toFixed(1)}`}</dd></div>
              <div><dt className="text-[13px] text-muted">Fixes that stuck</dt><dd className="font-serif text-[26px] font-semibold text-ink">{imp.stuck === null ? '–' : `${Math.round(imp.stuck * 100)}%`}</dd></div>
            </dl>
            {imp.last === null && <p className="mt-3 text-[13.5px] text-muted">Log five cases to see your trend.</p>}
          </Section>}

          {cases.length > 0 && <Section title="Case types covered">
            <ul className="flex flex-wrap gap-1.5">
              {CASE_TYPES.filter((ty) => ty !== 'Other').map((ty) => (
                <li key={ty} className={`rounded-full px-2.5 py-1 text-[12.5px] ${typeCount[ty] ? 'bg-teal-l font-medium text-teal-d' : 'bg-canvas text-faint'}`}>
                  {ty}{typeCount[ty] ? ` ${typeCount[ty]}` : ''}
                </li>
              ))}
            </ul>
          </Section>}

          {cases.length > 0 && (
            <Section title="Latest case" aside={<Link to="/cases" className="text-[13.5px] font-medium text-violet-d hover:underline">Case log</Link>}>
              {(() => { const c = byDate(cases).at(-1)!; return (
                <div className="flex items-center justify-between gap-3">
                  <div><div className="font-medium text-ink">{c.name}</div><div className="text-[13px] text-muted">{c.type}, with {c.with.toLowerCase()}</div></div>
                  <ScoreChip v={caseOverall(c)} />
                </div>) })()}
            </Section>
          )}
        </div>
      </div>
    </>
  )
}
