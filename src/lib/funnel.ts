/**
 * Anonymous sign-up funnel: daily totals only, so we can see where visitors drop off
 * (where they came from, whether they hit a lock, whether they tried to sign in, and
 * whether it worked). No names, IDs or cookies: each event adds 1 to a counter for the
 * day. A per-tab flag in sessionStorage stops one visit counting the same step twice.
 */
import { inAppName } from './inapp'

type Sink = (day: string, keys: string[]) => Promise<void>
let sink: Sink | null = null
// Unsent events wait in this tab's sessionStorage, so a quick page change doesn't lose them
const Q = 'pfc-funnel-q'
let queue: string[] = (() => { try { return JSON.parse(sessionStorage.getItem(Q) || '[]') } catch { return [] } })()
const saveQueue = () => { try { sessionStorage.setItem(Q, JSON.stringify(queue)) } catch { /* ignore */ } }
let timer: ReturnType<typeof setTimeout> | null = null

const day = () => new Date().toISOString().slice(0, 10)
const clean = (k: string) => k.toLowerCase().replace(/[^a-z0-9_]+/g, '_').slice(0, 40)

function flush() {
  timer = null
  if (!sink || !queue.length) return
  const keys = Array.from(new Set(queue)).slice(0, 20)
  queue = queue.filter((k) => !keys.includes(k)); saveQueue()
  sink(day(), keys).catch(() => {})
  if (queue.length) timer = setTimeout(flush, 1500)
}

/** Count an event. `once: true` counts it at most once per browser tab. */
export function track(event: string, once = true) {
  const k = clean(event)
  if (once) {
    try {
      const seen = JSON.parse(sessionStorage.getItem('pfc-funnel') || '[]') as string[]
      if (seen.includes(k)) return
      sessionStorage.setItem('pfc-funnel', JSON.stringify([...seen, k]))
    } catch { /* storage blocked: count anyway */ }
  }
  queue.push(k); saveQueue()
  if (!timer) timer = setTimeout(flush, 800)
}

/** Whether this tab has already counted an event. */
export function seenInTab(event: string): boolean {
  try { return (JSON.parse(sessionStorage.getItem('pfc-funnel') || '[]') as string[]).includes(clean(event)) } catch { return false }
}

/** Connected once the database is ready; events before that wait in memory. */
export function setFunnelSink(s: Sink | null) {
  sink = s
  if (s && queue.length && !timer) timer = setTimeout(flush, 300)
}
if (typeof document !== 'undefined') document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') flush() })

function sourceBucket(): string {
  try {
    const utm = new URLSearchParams(location.search).get('utm_source')
    const ref = document.referrer ? new URL(document.referrer).hostname.replace(/^www\./, '') : ''
    const s = (utm || ref || '').toLowerCase()
    if (!s || ref === location.hostname) return inAppName && inAppName !== 'this app' ? clean(inAppName) : 'direct'
    for (const [name, re] of [['instagram', /instagram|^ig$/], ['linkedin', /linkedin|lnkd/], ['facebook', /facebook|fb\.|^fb$/], ['google', /google/],
      ['x', /^t\.co$|twitter|^x\.com$/], ['whatsapp', /whatsapp/], ['reddit', /reddit/], ['youtube', /youtube|youtu\.be/], ['bing', /bing/], ['chatgpt', /chatgpt|openai/]] as const) {
      if (re.test(s)) return name
    }
    return 'other'
  } catch { return 'other' }
}

/** First page of a visit: where they came from, device, built-in browser, entry page. */
export function trackVisit(path: string, signedIn: boolean) {
  if (seenInTab('visit')) return
  track('visit')
  track(signedIn ? 'visit_member' : 'visit_anon')
  if (signedIn) return
  track(`src_${sourceBucket()}`)
  track(window.matchMedia('(max-width: 767px)').matches ? 'dev_phone' : 'dev_computer')
  if (inAppName) track('inapp')
  const sec = path.split('/')[1] || 'landing'
  track(`entry_${path.startsWith('/casebook/') ? 'case' : sec}`)
}
