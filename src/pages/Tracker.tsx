import { Link } from 'react-router-dom'
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
  return (
    <>
      <PageHeader title="Tracker" intro="Tap a square when you complete a habit. Five or more in a day is a real prep day. Past days can be filled in if you forgot." />
      <section className="mb-5 rounded-xl border border-line bg-white p-5">
        <h2 className="text-[20px] font-semibold">Why you are tracking two kinds of practice</h2>
        <p className="mt-1 text-[14.5px] text-muted">A strong interview needs two things. First, you must know how to solve a case. Second, you must be able to think, speak and make business decisions clearly while someone is watching. Your tracker keeps both visible.</p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-teal-l/60 p-4"><h3 className="font-sans font-semibold text-teal-d">Case mechanics (first 4 columns)</h3><p className="mt-1 text-[14px] text-ink-2">Live case: practise with another person. Self case: solve one alone, out loud. Drill: focus on structures, graphs or maths. Review: read the mistake you want to fix before your next case.</p><Link to="/graphs" className="mt-2 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Practise graph interpretation →</Link></div>
          <div className="rounded-lg bg-violet-l/60 p-4"><h3 className="font-sans font-semibold text-violet-d">Interview skills (last 4 columns)</h3><p className="mt-1 text-[14px] text-ink-2">Mind: practise recall or mental maths, optionally with Elevate or Peak. Voice: warm up with SpeechOn and speak a conclusion aloud. Reading: learn business ideas from books, Shark Tank or CEO interviews. FIT: practise personal stories.</p><Link to="/interview-skills" className="mt-2 inline-block text-[13.5px] font-medium text-violet-d hover:underline">Read the full routine →</Link></div>
        </div>
        <p className="mt-3 text-[13.5px] text-muted">Start with a realistic routine. It is better to complete a few habits consistently and reflect on mistakes than to tick every box without learning.</p>
      </section>
      <div className="overflow-x-auto rounded-xl border border-line bg-white">
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
            {dates.map((d, i) => {
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
