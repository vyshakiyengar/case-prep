import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useStore } from '../lib/store'
import { todayIso } from '../lib/dates'
import type { StatsBump } from '../lib/types'

/**
 * Counts how signed-in people use the site, for the admin dashboard:
 * visits, page views by section, engaged minutes, device type, time zone and
 * where they first came from. Totals only, sent at most every 30 seconds.
 * Nothing is recorded for signed-out visitors.
 */

// Where this visit came from. Held in memory only until the person signs in, so nothing
// is written to the browser for visitors who never create an account.
const SRC_KEY = 'pfc-source'
const landingSource = (() => {
  try {
    const utm = new URLSearchParams(location.search).get('utm_source')
    if (utm) return utm.slice(0, 60)
    if (document.referrer) {
      const host = new URL(document.referrer).hostname.replace(/^www\./, '')
      if (host && host !== location.hostname) return host.slice(0, 60)
    }
  } catch { /* ignore */ }
  return 'direct'
})()
/** Called only for signed-in users: keeps the first source seen on this device. */
function firstSource(): string {
  try {
    const saved = localStorage.getItem(SRC_KEY)
    if (saved) return saved
    localStorage.setItem(SRC_KEY, landingSource)
  } catch { /* storage blocked */ }
  return landingSource
}

const section = (path: string) => path.split('/')[1] || 'landing'

export function ActivityTracker() {
  const { backend, user } = useStore()
  const { pathname } = useLocation()
  const pending = useRef<{ sessions: number; minutes: number; views: Record<string, number>; lastPath?: string }>({ sessions: 0, minutes: 0, views: {} })
  const lastInput = useRef(Date.now())

  const flush = () => {
    const p = pending.current
    if (!backend || !user || (!p.sessions && !p.minutes && !Object.keys(p.views).length)) return
    const bump: StatsBump = {
      uid: user.uid, day: todayIso(), sessions: p.sessions, minutes: p.minutes, views: p.views, lastPath: p.lastPath,
      device: window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop',
      tz: Intl.DateTimeFormat().resolvedOptions().timeZone, source: firstSource(),
    }
    pending.current = { sessions: 0, minutes: 0, views: {} }
    backend.bumpStats(bump).catch(() => {})
  }
  const flushRef = useRef(flush); flushRef.current = flush

  // one visit per browser tab
  useEffect(() => {
    if (!user) return
    try {
      if (!sessionStorage.getItem('pfc-visit')) { sessionStorage.setItem('pfc-visit', '1'); pending.current.sessions += 1 }
    } catch { pending.current.sessions += 1 }
  }, [user])

  // page views by section
  useEffect(() => {
    if (!user) return
    const s = section(pathname)
    pending.current.views[s] = (pending.current.views[s] || 0) + 1
    pending.current.lastPath = pathname
  }, [pathname, user])

  // engaged minutes, and regular small writes
  useEffect(() => {
    if (!user) return
    const touch = () => { lastInput.current = Date.now() }
    const events = ['pointerdown', 'keydown', 'scroll', 'touchstart'] as const
    events.forEach((e) => window.addEventListener(e, touch, { passive: true }))
    const minute = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInput.current < 60000) pending.current.minutes += 1
    }, 60000)
    const send = setInterval(() => flushRef.current(), 30000)
    const hide = () => { if (document.visibilityState === 'hidden') flushRef.current() }
    document.addEventListener('visibilitychange', hide)
    const leave = () => flushRef.current()
    window.addEventListener('pagehide', leave)
    const first = setTimeout(() => flushRef.current(), 4000)
    return () => {
      events.forEach((e) => window.removeEventListener(e, touch))
      clearInterval(minute); clearInterval(send); clearTimeout(first)
      document.removeEventListener('visibilitychange', hide)
      window.removeEventListener('pagehide', leave)
      flushRef.current()
    }
  }, [user])

  return null
}
