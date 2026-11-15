/**
 * Anonymous page views: a daily counter per page, plus a total. No names, IDs or cookies.
 * Views are batched and written every few seconds (or when the tab is hidden).
 */
type Sink = (day: string, counts: Record<string, number>) => Promise<void>
let sink: Sink | null = null
let pending: Record<string, number> = {}
let timer: ReturnType<typeof setTimeout> | null = null
const day = () => new Date().toISOString().slice(0, 10)

/** '/blog/mece-explained' -> 'p~blog~mece-explained'; '/' -> 'p~' */
export const pageKey = (path: string) => ('p~' + path.replace(/^\/+|\/+$/g, '').toLowerCase().replace(/\//g, '~').replace(/[^a-z0-9~-]/g, '')).slice(0, 90)
export const keyPath = (k: string) => '/' + k.slice(2).replace(/~/g, '/')

function flush() {
  timer = null
  if (!sink) return
  const keys = Object.keys(pending)
  if (!keys.length) return
  const batch: Record<string, number> = {}
  for (const k of keys.slice(0, 20)) { batch[k] = pending[k]; delete pending[k] }
  sink(day(), batch).catch(() => {})
  if (Object.keys(pending).length) timer = setTimeout(flush, 1500)
}

/** Count one view of this page. */
export function trackView(path: string) {
  if (path.startsWith('/admin')) return
  for (const k of ['all', path.startsWith('/blog/') ? 'blog' : '', pageKey(path)].filter(Boolean)) pending[k] = (pending[k] || 0) + 1
  if (!timer) timer = setTimeout(flush, 2500)
}

export function setViewsSink(s: Sink | null) {
  sink = s
  if (s && Object.keys(pending).length && !timer) timer = setTimeout(flush, 500)
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush() })
