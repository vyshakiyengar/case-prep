/** Study plans for however long someone has until their interview. Used on the front page, Home and the course. */
export type Plan = { id: 'week' | 'three' | 'six'; days: number; t: string; who: string; steps: string[] }

export const PLANS: Plan[] = [
  { id: 'week', days: 7, t: 'One week to go', who: 'Interview next week', steps: [
    'Day 1: lessons 1 to 3, about 27 minutes, then the perfect-casing phrases',
    'Days 2 to 6: one case a day, plus a ten-minute drill',
    'Day 7: read your case-log fixes, rehearse two fit stories, rest',
  ] },
  { id: 'three', days: 21, t: 'Three weeks', who: 'The usual run-up', steps: [
    'Week 1: the whole course and the 11 frameworks; an easy case every other day',
    'Week 2: a case a day, a drill a day, your first case with a friend',
    'Week 3: hard cases against the clock, two cases with a friend, fit stories',
  ] },
  { id: 'six', days: 42, t: 'Six weeks or more', who: 'Starting from zero', steps: [
    'Weeks 1 and 2: course, frameworks and glossary; easy cases',
    'Weeks 3 and 4: four or five cases a week, every drill, the case types',
    'Weeks 5 and 6: hard cases, friends twice a week, fit stories, rest the day before',
  ] },
]


/** The plan that fits the days left, and which step of it you're on (null without a date). */
export function planFor(daysToGo: number | null): { plan: Plan; step: number | null } {
  if (daysToGo === null || daysToGo < 0) return { plan: PLANS[1], step: null }
  const plan = daysToGo <= 8 ? PLANS[0] : daysToGo <= 24 ? PLANS[1] : PLANS[2]
  const elapsed = Math.max(0, plan.days - daysToGo)
  const step = plan.id === 'week' ? (elapsed < 1 ? 0 : elapsed < 6 ? 1 : 2) : Math.min(2, Math.floor(elapsed / (plan.days / 3)))
  return { plan, step }
}
