/**
 * The free taste for signed-out visitors: two pages with nothing locked, and two cases
 * open start to finish. The paths and case names used are kept in this browser only.
 */
import { track } from './funnel'

export const FREE_PAGES = 2
export const FREE_CASES = 2
const PAGES = 'pfc-free-pages'
const CASES = 'pfc-free-cases'

function read(key: string): string[] | null {
  try { const v = JSON.parse(localStorage.getItem(key) || '[]'); return Array.isArray(v) ? v : [] } catch { return null }
}

export type Taste = { free: boolean; n: number; isNew: boolean; used: number }

/** Is this item free? If there's still room, it takes a free slot. */
function claim(key: string, id: string, max: number, take: boolean): Taste {
  const list = read(key)
  if (!list) return { free: false, n: 0, isNew: false, used: max }
  const at = list.indexOf(id)
  if (at >= 0) return { free: true, n: at + 1, isNew: false, used: list.length }
  if (list.length >= max) return { free: false, n: 0, isNew: false, used: list.length }
  if (!take) return { free: true, n: list.length + 1, isNew: false, used: list.length }
  try { localStorage.setItem(key, JSON.stringify([...list, id])) } catch { return { free: false, n: 0, isNew: false, used: max } }
  track(key === PAGES ? 'free_page' : 'free_case', false)
  return { free: true, n: list.length + 1, isNew: true, used: list.length + 1 }
}

export const claimPage = (path: string) => claim(PAGES, path.replace(/\/+$/, '') || '/', FREE_PAGES, true)
/** Peek without using a slot (a case only uses one when the visitor goes past the free steps). */
export const peekCase = (slug: string) => claim(CASES, slug, FREE_CASES, false)
export const claimCase = (slug: string) => claim(CASES, slug, FREE_CASES, true)
export const pagesUsed = () => read(PAGES)?.length ?? FREE_PAGES
