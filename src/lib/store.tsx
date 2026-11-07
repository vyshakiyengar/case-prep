import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { AuthError, getBackend } from './backend'
import { lookupSchool } from './schools'
import type { AuthUser, Backend, UserData } from './backend'
import type { CaseEntry, DayEntry, DrillEntry, Profile, Story, Summary, UserStats } from './types'
import { caseOverall, last7, weakestStage } from './stats'
import { todayIso } from './dates'

interface Store {
  ready: boolean
  backend: Backend | null
  user: AuthUser | null
  data: UserData | null
  signIn(): Promise<void>
  signOut(): Promise<void>
  /** School email + password. These reject with an AuthError whose message can be shown as-is. */
  signUpEmail(name: string, email: string, password: string): Promise<void>
  signInEmail(email: string, password: string): Promise<void>
  resetPassword(email: string): Promise<void>
  resendVerification(): Promise<void>
  refreshUser(): Promise<void>
  saveProfile(p: Partial<Profile>): Promise<void>
  markLesson(slug: string, done: boolean): Promise<void>
  saveNote(pageId: string, text: string): Promise<void>
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

/** A verified school email + password account counts as a verified student (unlocks perks). */
async function ensureStudent(b: Backend, u: AuthUser, name: string) {
  if (u.provider !== 'password' || !u.emailVerified || !u.email) return
  const look = lookupSchool(u.email)
  if (look.personal || (await b.getStudent(u.uid))) return
  await b.saveStudent({
    uid: u.uid, name, schoolEmail: u.email.toLowerCase(), domain: look.domain, school: look.school || look.domain, knownSchool: !!look.school,
    program: '', gradYear: '', marketing: false, consentAt: Date.now(), verifiedAt: Date.now(),
  })
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [backend, setBackend] = useState<Backend | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [data, setData] = useState<UserData | null>(null)
  const [ready, setReady] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const dataRef = useRef<UserData | null>(null)
  dataRef.current = data
  const pendingName = useRef<string | null>(null)

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
              d.profile = { name: pendingName.current || u.name, email: u.email, photoURL: u.photoURL, createdAt: Date.now() }
              await b.saveProfile(u.uid, d.profile)
            }
            setData(d)
            ensureStudent(b, u, d.profile.name).catch(() => {})
          } catch {
            setError("Couldn't load your data. Check your connection and refresh the page.")
          }
        } else setData(null)
        setReady(true)
      })
    }).catch(() => { setError("Couldn't start the app. Refresh the page to try again."); setReady(true) })
    return () => unsub()
  }, [])

  // after someone clicks the verification link in their inbox, pick up the change when they come back
  useEffect(() => {
    if (!backend || !user || user.provider !== 'password' || user.emailVerified) return
    const onFocus = () => { backend.refreshUser().then((u) => { if (u?.emailVerified) { setUser(u); ensureStudent(backend, u, dataRef.current?.profile?.name || u.name).catch(() => {}) } }).catch(() => {}) }
    window.addEventListener('focus', onFocus)
    const t = setInterval(onFocus, 15000)
    return () => { window.removeEventListener('focus', onFocus); clearInterval(t) }
  }, [backend, user])

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

  // activity stats for the admin dashboard (aggregates only, no case notes)
  useEffect(() => {
    if (!backend || !user || !data?.profile) return
    const t = setTimeout(() => {
      const p = data.profile!
      const boxes = Object.values(p.trainer || {})
      const stats: UserStats = {
        uid: user.uid, name: p.name || user.name, email: user.email, createdAt: p.createdAt || Date.now(),
        lastActive: Date.now(), activeDays: [todayIso()], learned: p.learned || [], lessons: (p.learned || []).length,
        cases: data.cases.length, drills: data.drills.length, stories: data.stories.length,
        trainerCards: boxes.length, trainerMastered: boxes.filter((b) => b.box >= 3).length,
        habitDays: Object.values(data.days).filter((d) => Object.values(d.habits).some(Boolean)).length,
        interviewDate: p.interviewDate, updatedAt: Date.now(),
        provider: user.provider, emailVerified: user.emailVerified,
        notes: Object.values(p.notes || {}).filter((n) => n.text.trim()).length,
        ...(user.provider === 'password' && user.email ? { schoolDomain: user.email.split('@')[1]?.toLowerCase() } : {}),
      }
      backend.saveStats(stats).catch(() => {})
    }, 3000)
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
      signIn: async () => {
        if (!backend) return
        try { await backend.signIn() } catch (e) { setError(e instanceof AuthError ? e.message : "Couldn't sign you in. Try again.") }
      },
      signUpEmail: async (name, email, password) => {
        if (!backend) return
        pendingName.current = name.trim()
        await backend.signUpEmail(name, email, password)
        const u = await backend.refreshUser()
        if (u) { setUser(u); if (dataRef.current?.profile) await backend.saveProfile(u.uid, { ...dataRef.current.profile, name: name.trim() }) }
      },
      signInEmail: async (email, password) => { if (backend) await backend.signInEmail(email, password) },
      resetPassword: async (email) => { if (backend) await backend.resetPassword(email) },
      resendVerification: async () => { if (backend) await backend.resendVerification() },
      refreshUser: async () => {
        if (!backend) return
        const u = await backend.refreshUser()
        if (u) { setUser(u); await ensureStudent(backend, u, dataRef.current?.profile?.name || u.name).catch(() => {}) }
      },
      signOut: async () => { if (backend) await backend.signOut() },
      markLesson: async (slug, done) => {
        if (!user) return
        const cur = dataRef.current?.profile?.learned || []
        const learned = done ? Array.from(new Set([...cur, slug])) : cur.filter((x) => x !== slug)
        const next = { ...(dataRef.current?.profile || { name: user.name }), learned } as Profile
        patch((d) => ({ ...d, profile: next }))
        await guard(() => backend!.saveProfile(uid, next))
      },
      saveNote: (pageId, text) => {
        if (!user) return Promise.resolve()
        const cur = dataRef.current?.profile || ({ name: user.name } as Profile)
        const next = { ...cur, notes: { ...(cur.notes || {}), [pageId]: { text, updatedAt: Date.now() } } }
        patch((d) => ({ ...d, profile: next }))
        dataRef.current = dataRef.current ? { ...dataRef.current, profile: next } : dataRef.current
        return guard(() => backend!.saveProfile(uid, next))
      },
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
        if (!user) return Promise.resolve()
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
