import type { CaseEntry, DayEntry, DrillEntry, HabitKey, Profile, StageKey } from './types'
import { HABITS, STAGES } from './types'
import { addDays, diffDays, todayIso } from './dates'

export const PROGRAM_DAYS = 42

export const dayScore = (d?: DayEntry) => (d ? HABITS.filter((h) => d.habits[h.key]).length : 0)

export function caseOverall(c: CaseEntry): number | null {
  const v = STAGES.map((s) => c.scores[s.key]).filter((x): x is number => typeof x === 'number')
  return v.length ? Math.round((v.reduce((a, b) => a + b, 0) / v.length) * 10) / 10 : null
}

export const avg = (xs: number[]) => (xs.length ? Math.round((xs.reduce((a, b) => a + b, 0) / xs.length) * 10) / 10 : null)

export function programDates(p: Profile | null): string[] {
  const start = p?.startDate || todayIso()
  const n = Math.max(PROGRAM_DAYS, Math.min(365, diffDays(start, todayIso()) + 8))
  return Array.from({ length: n }, (_, i) => addDays(start, i))
}

export function stageAverages(cases: CaseEntry[]) {
  return STAGES.map((s) => ({ ...s, avg: avg(cases.map((c) => c.scores[s.key]).filter((x): x is number => typeof x === 'number')) }))
}

export function weakestStage(cases: CaseEntry[]) {
  const st = stageAverages(cases).filter((s) => s.avg !== null)
  if (!st.length) return null
  return st.reduce((a, b) => ((b.avg as number) < (a.avg as number) ? b : a))
}

export const byDate = (cases: CaseEntry[]) => [...cases].sort((a, b) => (a.date === b.date ? a.createdAt - b.createdAt : a.date < b.date ? -1 : 1))

export function improvement(cases: CaseEntry[]) {
  const o = byDate(cases).map(caseOverall).filter((x): x is number => x !== null)
  const first = avg(o.slice(0, 5)), last = o.length >= 5 ? avg(o.slice(-5)) : null
  const fixedRated = cases.filter((c) => c.fixed)
  const stuck = fixedRated.length ? fixedRated.filter((c) => c.fixed === 'Yes').length / fixedRated.length : null
  return { first, last, change: first !== null && last !== null ? Math.round((last - first) * 10) / 10 : null, stuck, best: o.length ? Math.max(...o) : null }
}

export function weekly(p: Profile | null, days: Record<string, DayEntry>, cases: CaseEntry[]) {
  const dates = programDates(p)
  const weeks = Math.ceil(dates.length / 7)
  return Array.from({ length: weeks }, (_, w) => {
    const ds = dates.slice(w * 7, w * 7 + 7)
    const scores = ds.map((d) => dayScore(days[d]))
    return {
      week: w + 1,
      total: scores.reduce((a, b) => a + b, 0),
      realDays: scores.filter((s) => s >= 5).length,
      cases: cases.filter((c) => ds.includes(c.date)).length,
    }
  })
}

export function habitConsistency(p: Profile | null, days: Record<string, DayEntry>) {
  const start = p?.startDate || todayIso()
  const elapsed = Math.max(1, Math.min(diffDays(start, todayIso()) + 1, 365))
  return HABITS.map((h) => {
    const done = Object.values(days).filter((d) => d.habits[h.key as HabitKey] && d.date >= start && d.date <= todayIso()).length
    return { ...h, done, pct: Math.min(1, done / elapsed) }
  })
}

export function last7(days: Record<string, DayEntry>) {
  const t = todayIso()
  const ds = Array.from({ length: 7 }, (_, i) => addDays(t, -i))
  const scores = ds.map((d) => dayScore(days[d]))
  return { total: scores.reduce((a, b) => a + b, 0), realDays: scores.filter((s) => s >= 5).length }
}

export function streak(days: Record<string, DayEntry>) {
  let n = 0, d = todayIso()
  if (dayScore(days[d]) === 0) d = addDays(d, -1) // today not filled yet doesn't break the streak
  while (dayScore(days[d]) > 0) { n++; d = addDays(d, -1) }
  return n
}

export function drillStats(drills: DrillEntry[]) {
  const s = drills.filter((d) => d.kind === 'structure' || d.kind === 'charts'), m = drills.filter((d) => d.kind === 'maths')
  const weekAgo = addDays(todayIso(), -6)
  return {
    structureCount: s.length,
    structureAvg: avg(s.map((d) => d.score).filter((x): x is number => typeof x === 'number')),
    mathsCount: m.length,
    mathsAccuracy: m.length ? m.filter((d) => d.correct).length / m.length : null,
    thisWeek: drills.filter((d) => d.date >= weekAgo).length,
  }
}

export const LESSON_FOR: Record<StageKey, { slug: string; title: string }> = {
  clarify: { slug: 'the-opening', title: 'The opening' }, structure: { slug: 'structuring', title: 'Structuring' }, maths: { slug: 'case-maths', title: 'Case maths' },
  leadership: { slug: 'driving-the-case', title: 'Driving the case' }, reco: { slug: 'recommendation', title: 'The recommendation' }, comms: { slug: 'how-you-come-across', title: 'How you come across' },
}

export const SPRINT_FOR: Record<StageKey, { label: string; to: string }> = {
  clarify: { label: 'Practise case openings: recap + 3 questions', to: '/casebook' },
  structure: { label: 'Run structure drills: 2 minutes each', to: '/drills?tab=structure' },
  maths: { label: 'Run maths drills: 30 seconds each', to: '/drills?tab=maths' },
  leadership: { label: 'Do a live case and announce the next step after every answer', to: '/casebook' },
  reco: { label: 'Record yourself giving 60-second recommendations', to: '/casebook' },
  comms: { label: 'Daily voice exercises for a week', to: '/learn/how-you-come-across#exercises' },
}
