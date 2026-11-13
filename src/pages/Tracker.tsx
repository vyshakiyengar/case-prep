import { useState } from 'react'
import { ArtTracker } from '../components/Art'
import { useStore } from '../lib/store'
import { HABITS } from '../lib/types'
import { fmtDow, fmtShort, todayIso } from '../lib/dates'
import { dayScore, habitConsistency, programDates } from '../lib/stats'
import { Meter, PageHeader, Section } from '../components/ui'

export default function Tracker() {
  const { data, toggleHabit } = useStore()
  const dates = programDates(data!.profile)
  const t = todayIso()
  const cons = habitConsistency(data!.profile, data!.days)
  // Up to today plus the coming week; the rest of the plan opens on request
  const [all, setAll] = useState(false)
  const firstFuture = dates.findIndex((d) => d > t)
  const upto = firstFuture < 0 ? dates.length : Math.max(firstFuture + 6, 7)
  const shown = all ? dates : dates.slice(0, upto)
  return (
    <>
      <PageHeader title="Tracker" art={<ArtTracker />} intro="Tap a habit when you do it. Five in a day makes a real prep day." />
      
      <div className="overflow-x-auto rounded-lg border border-line bg-white">
        <table className="w-full min-w-[760px] border-collapse text-[14px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-white" />
              <th colSpan={4} className="bg-teal py-1.5 text-[13px] font-semibold text-white">Solve the case</th>
              <th colSpan={4} className="bg-violet py-1.5 text-[13px] font-semibold text-white">Come across well</th>
              <th className="bg-white" />
            </tr>
            <tr className="border-b border-line">
              <th className="sticky left-0 z-10 bg-white px-4 py-2 text-left font-medium text-muted">Day</th>
              {HABITS.map((h) => <th key={h.key} className="px-1 py-2 text-[12.5px] leading-tight font-medium text-ink">{h.label}</th>)}
              <th className="px-3 py-2 text-[12.5px] font-medium text-ink">Score</th>
            </tr>
          </thead>
          <tbody>
            {shown.map((d, i) => {
              const s = dayScore(data!.days[d]), isToday = d === t, future = d > t
              return (
                <tr key={d} className={`${i % 7 === 6 ? 'border-b-2 border-ink/70' : 'border-b border-line'} ${isToday ? 'bg-marker-l' : ''}`}>
                  <td className={`sticky left-0 z-10 whitespace-nowrap px-4 py-1.5 ${isToday ? 'bg-marker-l font-semibold text-ink' : 'bg-white text-muted'}`}>
                    <span className="inline-block w-7 tabular-nums">{i + 1}</span>{fmtDow(d)} {fmtShort(d)}
                  </td>
                  {HABITS.map((h) => {
                    const on = !!data!.days[d]?.habits[h.key]
                    return (
                      <td key={h.key} className="px-1 py-1 text-center">
                        <button disabled={future} onClick={() => toggleHabit(d, h.key)} aria-pressed={on} aria-label={`${h.label}, ${fmtShort(d)}`}
                          className={`h-8 w-full max-w-16 rounded-md border transition-colors ${on ? (h.track === 'A' ? 'border-teal bg-teal' : 'border-violet bg-violet') : future ? 'border-transparent bg-canvas/60' : 'border-line bg-white hover:border-faint'}`}>
                          {on && <svg className="mx-auto" width="14" height="14" viewBox="0 0 12 12" aria-hidden><path d="M2.5 6.2 5 8.5l4.5-5" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" /></svg>}
                        </button>
                      </td>
                    )
                  })}
                  <td className="px-3 py-1 text-center">
                    {!future && <span className={`inline-flex h-7 w-9 items-center justify-center rounded-md text-[13px] font-semibold tabular-nums ${s >= 5 ? 'bg-good-l text-good' : s >= 3 ? 'bg-marker-l text-[#8A6A00]' : d < t ? 'bg-signal-l text-signal-d' : 'text-muted'}`}>{s}</span>}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      {dates.length > shown.length && <button type="button" onClick={() => setAll(true)} className="mt-3 text-[14px] font-medium text-violet-d hover:underline">Show all {dates.length} days</button>}

      <Section title="Habit consistency" className="mt-5" aside={<span className="text-[13.5px] text-muted">Share of days since you started</span>}>
        <ul className="grid gap-x-10 gap-y-3 sm:grid-cols-2">
          {cons.map((h) => (
            <li key={h.key} className="grid grid-cols-[150px_1fr_44px] items-center gap-3">
              <span className="text-[14px] text-ink">{h.label}</span>
              <Meter value={h.pct} max={1} color={h.track === 'A' ? 'bg-teal' : 'bg-violet'} />
              <span className="text-right text-[13.5px] tabular-nums text-muted">{Math.round(h.pct * 100)}%</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  )
}
