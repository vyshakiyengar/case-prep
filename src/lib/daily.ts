import idx from '../content/caseIndex.json'
import { addDays } from './dates'

export type CaseRef = (typeof idx)[number]

const dayNumber = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return Math.floor(Date.UTC(y, m - 1, d) / 86400000) }
function rng(seed: number) { // mulberry32
  return () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296 }
}
const cyclePerm = (cycle: number) => {
  const r = rng(cycle + 2026), order = idx.map((_, i) => i)
  for (let i = order.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [order[i], order[j]] = [order[j], order[i]] }
  return order
}

/** The same case for everyone on a given date. No case repeats until all 102 have come up. */
export function caseOfDay(iso: string): CaseRef {
  const n = dayNumber(iso), L = idx.length
  return idx[cyclePerm(Math.floor(n / L))[n % L]]
}

/** Days in a row the case of the day was done, counting today if done, otherwise up to yesterday. */
export function dailyStreak(done: string[], today: string): number {
  const set = new Set(done)
  let d = set.has(today) ? today : addDays(today, -1), n = 0
  while (set.has(d)) { n++; d = addDays(d, -1) }
  return n
}
