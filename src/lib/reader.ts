// Reading preferences (text size, light / sepia / dark) and what this browser has read.
// Both live in this browser only (localStorage), so they work without signing in.
import { useSyncExternalStore } from 'react'

/* ---------- Reader settings ---------- */
export type Theme = 'light' | 'sepia' | 'dark'
export type ReaderPrefs = { size: number; theme: Theme }
export const SIZES = [0.9, 1, 1.1, 1.2, 1.32] // multipliers on the article text size
const PREFS_KEY = 'pfc-reader'
const DEFAULT_PREFS: ReaderPrefs = { size: 1, theme: 'light' }

const listeners = new Set<() => void>()
const emit = () => listeners.forEach((l) => l())
const subscribe = (l: () => void) => { listeners.add(l); return () => { listeners.delete(l) } }

let prefsCache: ReaderPrefs | null = null
function readPrefs(): ReaderPrefs {
  if (prefsCache) return prefsCache
  try {
    const v = JSON.parse(localStorage.getItem(PREFS_KEY) || 'null')
    prefsCache = v && typeof v.size === 'number' && ['light', 'sepia', 'dark'].includes(v.theme)
      ? { size: Math.max(0, Math.min(SIZES.length - 1, v.size)), theme: v.theme } : DEFAULT_PREFS
  } catch { prefsCache = DEFAULT_PREFS }
  return prefsCache
}
export function setPrefs(p: Partial<ReaderPrefs>) {
  prefsCache = { ...readPrefs(), ...p }
  try { localStorage.setItem(PREFS_KEY, JSON.stringify(prefsCache)) } catch { /* storage blocked: still applies for this visit */ }
  emit()
}
export const useReaderPrefs = () => useSyncExternalStore(subscribe, readPrefs, () => DEFAULT_PREFS)

/* ---------- What you've read ---------- */
// slug -> { p: furthest point reached in the article (0 to 1), y: where you were on the page (0 to 1), t: when, done }
export type ReadMark = { p: number; y: number; t: number; done?: boolean }
const READ_KEY = 'pfc-read'
let readCache: Record<string, ReadMark> | null = null
function readAll(): Record<string, ReadMark> {
  if (readCache) return readCache
  try { readCache = JSON.parse(localStorage.getItem(READ_KEY) || '{}') || {} } catch { readCache = {} }
  return readCache!
}
export function markRead(slug: string, m: Omit<ReadMark, 't' | 'done'>) {
  const all = { ...readAll() }
  const prev = all[slug]
  const p = Math.max(prev?.p ?? 0, m.p)
  all[slug] = { p, y: m.y, t: Date.now(), done: prev?.done || p >= 0.92 }
  readCache = all
  try { localStorage.setItem(READ_KEY, JSON.stringify(all)) } catch { /* storage blocked */ }
  emit()
}
const NO_MARKS: Record<string, ReadMark> = {}
export const useReadMarks = () => useSyncExternalStore(subscribe, readAll, () => NO_MARKS)
/** The article you most recently left part-way through, if any. */
export function lastUnfinished(marks: Record<string, ReadMark>) {
  return Object.entries(marks).filter(([, m]) => !m.done && m.p >= 0.08)
    .sort((a, b) => b[1].t - a[1].t)[0]
}
