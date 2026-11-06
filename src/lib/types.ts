export type HabitKey = 'live' | 'self' | 'drill' | 'review' | 'mind' | 'voice' | 'reading' | 'fit'
export type StageKey = 'clarify' | 'structure' | 'maths' | 'leadership' | 'reco' | 'comms'

export interface Profile {
  name: string
  email?: string
  photoURL?: string
  startDate?: string // YYYY-MM-DD
  interviewDate?: string
  createdAt?: number
  partners?: string[]
  learned?: string[]
  trainer?: Record<string, { box: number; due: string }>
}

export interface DayEntry {
  date: string
  habits: Partial<Record<HabitKey, boolean>>
  note?: string
}

export interface CaseEntry {
  id: string
  date: string
  name: string
  source: string
  type: string
  with: 'Self' | 'Partner' | 'Expert'
  scores: Partial<Record<StageKey, number>>
  mistake: string
  fix: string
  fixed?: 'Yes' | 'Partly' | 'No' | ''
  createdAt: number
}

export interface DrillEntry {
  id: string
  kind: 'structure' | 'maths' | 'charts'
  prompt: string
  seconds: number
  score?: number // structure: self score 1-5
  correct?: boolean // maths
  date: string
  createdAt: number
}

export interface Story {
  id: string
  title: string
  situation: string
  task: string
  action: string
  result: string
  learning: string
  answers: string
  createdAt: number
}

export interface Summary {
  uid: string
  name: string
  photoURL?: string
  partners: string[]
  casesLogged: number
  avgScore: number | null
  weakestStage: string | null
  weekScore: number
  realPrepDays7: number
  lastFix: string | null
  updatedAt: number
}

export interface Invite {
  code: string
  from: string
  fromName: string
  createdAt: number
  acceptedBy?: string | null
  acceptedName?: string | null
}

export const HABITS: { key: HabitKey; label: string; hint: string; track: 'A' | 'B' }[] = [
  { key: 'live', label: 'Live case', hint: 'With a partner or an expert', track: 'A' },
  { key: 'self', label: 'Self case', hint: 'Alone, out loud', track: 'A' },
  { key: 'drill', label: 'Drill', hint: 'Structure, charts or maths', track: 'A' },
  { key: 'review', label: 'Re-read your fixes', hint: 'Before each case', track: 'A' },
  { key: 'mind', label: 'Mind exercise', hint: '10 minutes', track: 'B' },
  { key: 'voice', label: 'Voice exercise', hint: '10 minutes', track: 'B' },
  { key: 'reading', label: 'Business reading', hint: 'Book, press or CEO interview', track: 'B' },
  { key: 'fit', label: 'FIT story practice', hint: '3 times a week', track: 'B' },
]

export const STAGES: { key: StageKey; label: string; great: string }[] = [
  { key: 'clarify', label: 'Clarify & recap', great: 'Key points only, never the whole prompt. At most 3 sharp questions.' },
  { key: 'structure', label: 'Structure & hypothesis', great: '3-4 MECE buckets tailored to this case, with a hypothesis.' },
  { key: 'maths', label: 'Maths & charts', great: 'Approach before arithmetic. Talk while you calculate. Sanity-check.' },
  { key: 'leadership', label: 'Case leadership', great: 'You drive: end every answer with the next step and why.' },
  { key: 'reco', label: 'Recommendation', great: 'Answer first: recommendation, 2-3 reasons with numbers, risks, next steps. 60 seconds.' },
  { key: 'comms', label: 'Communication', great: 'Calm, paced, no filler words, linked back to the objective.' },
]

export const CASE_TYPES = ['Profitability', 'Market entry', 'Growth strategy', 'M&A', 'Private equity', 'Pricing',
  'Competitive response', 'Investment / capacity', 'Cost & operations', 'Market sizing', 'Public sector', 'Product case', 'Other']

export interface StudentRecord {
  uid: string
  name: string
  googleEmail?: string
  schoolEmail: string
  domain: string
  school: string
  knownSchool: boolean
  program: string
  gradYear: string
  marketing: boolean
  consentAt: number
  verifiedAt: number
}

export interface Perk {
  id: string
  title: string
  description: string
  kind: 'download' | 'code' | 'link'
  url?: string
  code?: string
  order?: number
}
