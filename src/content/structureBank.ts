// The full structuring bank: every written problem, plus a "pick the best structure"
// question built from each one. The three wrong options each carry one real flaw:
// a missing bucket, two buckets that overlap, or a generic list that fits any case.
import { STRUCTURE_PICKS, STRUCTURE_PROMPTS } from './structureDrills'
import type { StructPick, StructPrompt } from './structureDrills'
import { MORE_PROMPTS } from './structureDrills2'

export const ALL_PROMPTS: StructPrompt[] = [...STRUCTURE_PROMPTS, ...MORE_PROMPTS]

const GENERIC: Record<StructPrompt['family'], string[][]> = {
  diagnose: [['Internal factors', 'External factors', 'Other factors'], ['Market', 'Company', 'Competitors', 'Customers']],
  decide: [['Pros', 'Cons', 'Risks'], ['Strategy', 'Operations', 'Finance', 'People']],
  generate: [['Short-term ideas', 'Medium-term ideas', 'Long-term ideas'], ['People', 'Process', 'Technology']],
}
const hash = (s: string) => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7)
/** "Rates and fees vs rivals" -> "Rates and fees vs rivals"; "Volume: x" -> "Volume" */
const asBucket = (item: string) => { const t = item.split(/:|, | \(/)[0].trim(); return /^[a-z][A-Z]/.test(t) ? t : t.charAt(0).toUpperCase() + t.slice(1) }

function derive(p: StructPrompt): StructPick {
  const heads = p.tree.map((b) => b.head), n = heads.length, h = hash(p.id)
  const gapAt = h % n
  const overlapFrom = (gapAt + 1) % n            // the bucket whose sub-item gets promoted
  const overlapDrop = (gapAt + 2) % n            // the bucket it pushes out
  const sub = asBucket(p.tree[overlapFrom].items[0])
  const overlap = heads.map((x, i) => (i === overlapDrop ? sub : x))
  const generic = GENERIC[p.family][h % 2]
  return {
    id: `d-${p.id}`,
    prompt: p.prompt,
    options: [
      { buckets: heads, flaw: 'good', why: `Covers the problem without overlaps, and is specific to it. ${p.start}` },
      { buckets: heads.filter((_, i) => i !== gapAt), flaw: 'gap', why: `Leaves out "${heads[gapAt]}" (${p.tree[gapAt].items.join('; ').toLowerCase()}), which matters here.` },
      { buckets: overlap, flaw: 'overlap', why: `"${sub}" is part of "${heads[overlapFrom]}", so two buckets cover the same ground, and "${heads[overlapDrop]}" drops out.` },
      { buckets: generic, flaw: 'generic', why: 'Could open any case. It doesn\'t follow how this problem works, so it won\'t show you where to look.' },
    ],
  }
}

export const ALL_PICKS: StructPick[] = [...STRUCTURE_PICKS, ...ALL_PROMPTS.map(derive)]
