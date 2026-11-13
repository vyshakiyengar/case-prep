import type { UserData } from './backend'
import { LESSONS } from '../content/course'
import { caseOverall, dayScore, drillStats, byDate } from './stats'
import { addDays, todayIso } from './dates'

export interface Part { key: string; label: string; weight: number; value: number; note: string; to: string; tip: string }

/**
 * A rough guide to how prepared someone is, from 0 to 100. Four parts, each scored 0-1:
 * the course, case practice (how many cases and how well they went), drills (how many and how
 * accurate) and the habit of preparing most days. It is a nudge, not a prediction.
 */
export function readiness(d: UserData | null): { score: number; parts: Part[]; next: Part } {
  const learned = d?.profile?.learned?.length || 0
  const cases = byDate(d?.cases || [])
  const recent = cases.slice(-5).map(caseOverall).filter((x): x is number => x !== null)
  const quality = recent.length ? (recent.reduce((a, b) => a + b, 0) / recent.length - 1) / 4 : 0 // 1-5 scale to 0-1
  const s = drillStats(d?.drills || [])
  const drillCount = (d?.drills || []).length
  const acc = [s.mathsAccuracy, s.chartAccuracy].filter((x): x is number => x !== null)
  const accuracy = acc.length ? acc.reduce((a, b) => a + b, 0) / acc.length : 0
  const today = todayIso()
  let realDays = 0
  for (let i = 0; i < 14; i++) if (dayScore(d?.days?.[addDays(today, -i)]) >= 5) realDays++
  const parts: Part[] = [
    { key: 'course', label: 'Course', weight: 20, value: Math.min(1, learned / LESSONS.length), note: `${learned} of ${LESSONS.length} lessons`, to: '/learn', tip: 'Finish the next lesson' },
    { key: 'cases', label: 'Cases', weight: 40, value: Math.min(1, cases.length / 20) * 0.5 + quality * Math.min(1, cases.length / 5) * 0.5,
      note: cases.length ? `${cases.length} logged${recent.length ? `, recent average ${(recent.reduce((a, b) => a + b, 0) / recent.length).toFixed(1)} of 5` : ''}` : 'None logged yet', to: '/casebook', tip: 'Practise a case and log it' },
    { key: 'drills', label: 'Drills', weight: 25, value: Math.min(1, drillCount / 30) * 0.5 + accuracy * Math.min(1, drillCount / 5) * 0.5,
      note: drillCount ? `${drillCount} done${acc.length ? `, ${Math.round(accuracy * 100)}% right` : ''}` : 'None yet', to: '/drills', tip: 'Do a ten-minute drill' },
    { key: 'habit', label: 'Habit', weight: 15, value: realDays / 14, note: `${realDays} real prep days in the last 14`, to: '/tracker', tip: 'Tick off five habits today' },
  ]
  const score = Math.round(parts.reduce((a, p) => a + p.weight * p.value, 0))
  const next = [...parts].sort((a, b) => b.weight * (1 - b.value) - a.weight * (1 - a.value))[0]
  return { score, parts, next }
}
