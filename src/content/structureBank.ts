// The full structuring bank: every written problem, the hand-written "pick the best
// structure" questions, and a "find the overlap" question built from each problem:
// the strong structure with one sub-item promoted to a bucket of its own. The student
// has to name the bucket that really belongs inside another one.
import { STRUCTURE_PICKS, STRUCTURE_PROMPTS } from './structureDrills'
import type { StructPick, StructPrompt } from './structureDrills'
import { MORE_PROMPTS } from './structureDrills2'

export const ALL_PROMPTS: StructPrompt[] = [...STRUCTURE_PROMPTS, ...MORE_PROMPTS]

export interface OverlapQ {
  id: string
  kind: 'overlap'
  prompt: string
  buckets: string[]
  answer: number // index of the bucket that belongs inside another
  parent: string
  why: string
}
export type SpotQ = (StructPick & { kind: 'pick' }) | OverlapQ

const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
/** "Cost synergies: shared bakeries" -> "Cost synergies" */
const asBucket = (item: string) => { const t = item.split(/:|, | \(|; /)[0].trim(); return /^[a-z][A-Z]/.test(t) ? t : t.charAt(0).toUpperCase() + t.slice(1) }

function overlap(p: StructPrompt): OverlapQ {
  const heads = p.tree.map((b) => b.head), h = hash(p.id)
  // Every sub-item that reads as a bucket name: short, not a question, not a copy of a head.
  const cands = p.tree.flatMap((b, bi) => b.items.map((it) => ({ bi, sub: asBucket(it) })))
    .filter(({ sub }) => !sub.includes('?') && sub.length >= 4 && sub.length <= 40 && !heads.some((x) => x.toLowerCase() === sub.toLowerCase()))
  const pick = cands.length ? cands[h % cands.length] : { bi: 0, sub: asBucket(p.tree[0].items[0]) }
  const from = pick.bi, sub = pick.sub
  const at = (h >>> 5) % (heads.length + 1)
  const buckets = [...heads.slice(0, at), sub, ...heads.slice(at)]
  return {
    id: `o-${p.id}`, kind: 'overlap', prompt: p.prompt, buckets, answer: at, parent: heads[from],
    why: `"${sub}" is part of "${heads[from]}", so those two buckets cover the same ground. Fold it back in and the structure is clean: ${heads.join(' / ')}.`,
  }
}

export const ALL_OVERLAPS: OverlapQ[] = ALL_PROMPTS.map(overlap)
export const ALL_SPOT: SpotQ[] = [...STRUCTURE_PICKS.map((p) => ({ ...p, kind: 'pick' as const })), ...ALL_OVERLAPS]
