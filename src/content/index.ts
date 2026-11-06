import drillsJson from './drills.json'
import playbookJson from './playbook.json'

export interface TableExhibit { kind: 'table'; headers: string[]; rows: string[][]; title?: string | null; note?: string | null; align: string[]; boldLast: boolean }
export interface ChartExhibit { kind: 'chart'; svg: string; title?: string | null; note?: string | null }
export type Exhibit = TableExhibit | ChartExhibit
export interface CaseQuestion { q: string; exhibit: Exhibit | null; answer: string; note?: string }
export interface CaseDef {
  id: number; slug: string; title: string; sub: string; type: string; industry: string; geo: string; diff: 1 | 2 | 3
  fmt: string; time: string; skills: string; prompt: string; clarify: { q: string; a: string }[]
  structure: { root: string; branches: { head: string; items: string[] }[] }
  hypothesis: string; questions: CaseQuestion[]; reco: string; great: string[]
}

let cache: Promise<CaseDef[]> | null = null
export const loadCases = () => (cache ??= import('./cases.json').then((m) => m.default as unknown as CaseDef[]))

export const drills = drillsJson as { structure: { prompt: string; buckets: string }[]; maths: { q: string; a: string }[] }
export const playbook = playbookJson as {
  stages: { stage: string; do: string; say: string; mistake: string }[]
  sprints: { stage: string; sprint: string; how: string }[]
  plan: { week: string; focus: string; volume: string }[]
  frameworks: { type: string; ask: string; build: string; trap: string }[]
  formulas: { term: string; formula: string; note: string }[]
  skills: { name: string; how: string; dose: string; trains: string }[]
  fitQuestions: { q: string; why: string }[]
}

// lightweight case index for lists (no exhibits), kept in sync with cases.json by the content export
export const DIFF_LABEL = { 1: 'Easy', 2: 'Medium', 3: 'Hard' } as const
