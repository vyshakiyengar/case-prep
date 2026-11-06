import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { getBackend } from './backend'
import type { AuthUser, Backend, UserData } from './backend'
import type { CaseEntry, DayEntry, DrillEntry, Profile, Story, Summary } from './types'
import { caseOverall, last7, weakestStage } from './stats'
import { todayIso } from './dates'

interface Store {
  ready: boolean
  backend: Backend | null
  user: AuthUser | null
  data: UserData | null
  signIn(): Promise<void>
  signOut(): Promise<void>
  saveProfile(p: Partial<Profile>): Promise<void>
  toggleHabit(date: string, key: keyof DayEntry['habits']): Promise<void>
  setDayNote(date: string, note: string): Promise<void>
  saveCase(c: CaseEntry): Promise<void>
  deleteCase(id: string): Promise<void>
  addDrill(d: DrillEntry): Promise<void>
  saveStory(s: Story): Promise<void>
  deleteStory(id: string): Promise<void>
  error: string | null
  setError(e: string | null): void
}

const Ctx = createContext<Store | null>(null)
export const useStore = () => {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore outside provider')
  return s
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [data, setData] = useState<UserData | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dataRef = useRef<UserData | null>(null)
  dataRef.current = data

  useEffect(() => {
    let unsub = () => {}
    getBackend().then((b) => {
      setBackend(b)
      unsub = b.onAuth(async (u) => {
        setUser(u)
        if (u) {
          try {
            const d = await b.loadAll(u.uid)
            if (!d.profile) {
              d.profile = { name: u.name, email: u.email, photoURL: u.photoURL, createdAt: Date.now() }
              await b.saveProfile(u.uid, d.profile)
            }
            setData(d)
          } catch {
            setError("Couldn't load your data. Check your connection and refresh the page.")
          }
        } else setData(null)
        setReady(true)
      })
    }).catch(() => { setError("Couldn't start the app. Refresh the page to try again."); setReady(true) })
    return () => unsub()
  }, [])

  // keep a small shareable summary for practice partners
  useEffect(() => {
    if (!backend || !user || !data) return
    const t = setTimeout(() => {
      const overall = data.cases.map(caseOverall).filter((x): x is number => x !== null)
      const w = weakestStage(data.cases)
      const l7 = last7(data.days)
      const latest = [...data.cases].sort((a, b) => b.createdAt - a.createdAt)[0]
      const summary: Summary = {
        uid: user.uid, name: data.profile?.name || user.name, photoURL: user.photoURL, partners: data.profile?.partners || [],
        casesLogged: data.cases.length, avgScore: overall.length ? Math.round((overall.reduce((a, b) => a + b, 0) / overall.length) * 10) / 10 : null,
        weakestStage: w?.label || null, weekScore: l7.total, realPrepDays7: l7.realDays, lastFix: latest?.fix || null, updatedAt: Date.now(),
      }
      backend.saveSummary(summary).catch(() => {})
    }, 1500)
    return () => clearTimeout(t)
  }, [backend, user, data])

  const guard = useCallback(async (fn: () => Promise<void>) => {
    try { await fn() } catch { setError("Couldn't save that change. Check your connection and try again.") }
  }, [])

  const store = useMemo<Store>(() => {
    const uid = user?.uid || ''
    const patch = (f: (d: UserData) => UserData) => setData((d) => (d ? f(d) : d))
    return {
      ready, backend, user, data, error, setError,
      signIn: async () => { if (backend) await guard(() => backend.signIn()) },
      signOut: async () => { if (backend) await backend.signOut() },
      saveProfile: (p) => {
        const next = { ...(dataRef.current?.profile || { name: user?.name || '' }), ...p } as Profile
        patch((d) => ({ ...d, profile: next }))
        return guard(() => backend!.saveProfile(uid, next))
      },
      toggleHabit: (date, key) => {
        const cur = dataRef.current?.days[date] || { date, habits: {} }
        const next: DayEntry = { ...cur, habits: { ...cur.habits, [key]: !cur.habits[key] } }
        patch((d) => ({ ...d, days: { ...d.days, [date]: next } }))
        return guard(() => backend!.saveDay(uid, next))
      },
      setDayNote: (date, note) => {
        const cur = dataRef.current?.days[date] || { date, habits: {} }
        const next: DayEntry = { ...cur, note }
        patch((d) => ({ ...d, days: { ...d.days, [date]: next } }))
        return guard(() => backend!.saveDay(uid, next))
      },
      saveCase: (c) => {
        const isNew = !dataRef.current?.cases.some((x) => x.id === c.id)
        patch((d) => ({ ...d, cases: [...d.cases.filter((x) => x.id !== c.id), c] }))
        return guard(async () => {
          await backend!.saveCase(uid, c)
          // logging a case ticks the matching habit for that day
          const habit = c.with === 'Self' ? 'self' : 'live'
          const day = dataRef.current?.days[c.date] || { date: c.date, habits: {} }
          if (isNew && !day.habits[habit]) {
            const next: DayEntry = { ...day, habits: { ...day.habits, [habit]: true } }
            patch((d) => ({ ...d, days: { ...d.days, [c.date]: next } }))
            await backend!.saveDay(uid, next)
          }
        })
      },
      deleteCase: (id) => {
        patch((d) => ({ ...d, cases: d.cases.filter((x) => x.id !== id) }))
        return guard(() => backend!.deleteCase(uid, id))
      },
      addDrill: (dr) => {
        patch((d) => ({ ...d, drills: [...d.drills, dr] }))
        return guard(async () => {
          await backend!.saveDrill(uid, dr)
          const day = dataRef.current?.days[dr.date] || { date: dr.date, habits: {} }
          if (!day.habits.drill) {
            const next: DayEntry = { ...day, habits: { ...day.habits, drill: true } }
            patch((d) => ({ ...d, days: { ...d.days, [dr.date]: next } }))
            await backend!.saveDay(uid, next)
          }
        })
      },
      saveStory: (s) => {
        patch((d) => ({ ...d, stories: [...d.stories.filter((x) => x.id !== s.id), s] }))
        return guard(() => backend!.saveStory(uid, s))
      },
      deleteStory: (id) => {
        patch((d) => ({ ...d, stories: d.stories.filter((x) => x.id !== id) }))
        return guard(() => backend!.deleteStory(uid, id))
      },
    }
  }, [ready, backend, user, data, error, guard])

  return <Ctx.Provider value={store}>{children}</Ctx.Provider>
}

export const today = todayIso
