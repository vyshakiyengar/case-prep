import type { CaseEntry, DayEntry, DrillEntry, Invite, Perk, Profile, StatsBump, StudentRecord, Story, Summary, UserStats } from './types'
import { FIREBASE_CONFIG } from './firebaseConfig'
import { uid as newId } from './dates'

export interface AuthUser { uid: string; name: string; email?: string; photoURL?: string; emailVerified?: boolean; provider?: 'google' | 'password' | 'other' }
export interface UserData { profile: Profile | null; days: Record<string, DayEntry>; cases: CaseEntry[]; drills: DrillEntry[]; stories: Story[] }

export interface Backend {
  mode: 'firebase' | 'demo'
  onAuth(cb: (u: AuthUser | null) => void): () => void
  signIn(): Promise<void>
  signOut(): Promise<void>
  // business school accounts: school email + password
  signUpEmail(name: string, email: string, password: string): Promise<void>
  signInEmail(email: string, password: string): Promise<void>
  resetPassword(email: string): Promise<void>
  resendVerification(): Promise<void>
  refreshUser(): Promise<AuthUser | null>
  /** Removes everything stored about this person, then the account itself. */
  deleteAccount(): Promise<void>
  loadAll(uid: string): Promise<UserData>
  saveProfile(uid: string, p: Profile): Promise<void>
  saveDay(uid: string, d: DayEntry): Promise<void>
  saveCase(uid: string, c: CaseEntry): Promise<void>
  deleteCase(uid: string, id: string): Promise<void>
  saveDrill(uid: string, d: DrillEntry): Promise<void>
  saveStory(uid: string, s: Story): Promise<void>
  deleteStory(uid: string, id: string): Promise<void>
  saveSummary(s: Summary): Promise<void>
  getSummary(uid: string): Promise<Summary | null>
  createInvite(from: string, fromName: string): Promise<string>
  getInvite(code: string): Promise<Invite | null>
  acceptInvite(code: string, me: string, myName: string): Promise<void>
  acceptedInvites(from: string): Promise<Invite[]>
  // business school verification
  sendSchoolLink(email: string): Promise<void>
  isSchoolLink(href: string): boolean
  completeSchoolLink(email: string, href: string): Promise<void>
  saveStudent(s: StudentRecord): Promise<void>
  getStudent(uid: string): Promise<StudentRecord | null>
  listPerks(): Promise<Perk[]>
  // admin
  listStudents(): Promise<StudentRecord[]>
  savePerk(p: Perk): Promise<void>
  deletePerk(id: string): Promise<void>
  saveStats(s: UserStats): Promise<void>
  bumpStats(b: StatsBump): Promise<void>
  listStats(): Promise<UserStats[]>
  /** Live feed of everyone's stats for the admin dashboard. Returns an unsubscribe function. */
  watchStats(cb: (rows: UserStats[]) => void, onError: () => void): () => void
}

export class SchoolLinkError extends Error {}
/** A sign-in problem with a message that is safe and useful to show the person. */
export class AuthError extends Error {}

function authMessage(code: string): string {
  if (code.includes('email-already-in-use')) return 'There is already an account with this email. Sign in instead, or reset your password.'
  if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found') || code.includes('invalid-login')) return 'That email and password don\'t match. Try again or reset your password.'
  if (code.includes('weak-password')) return 'Use a password of at least 8 characters.'
  if (code.includes('invalid-email')) return 'That doesn\'t look like an email address.'
  if (code.includes('too-many-requests')) return 'Too many attempts. Wait a few minutes, then try again.'
  if (code.includes('network-request-failed')) return 'No connection. Check your internet and try again.'
  if (code.includes('unauthorized-domain')) return 'Sign-in isn\'t enabled on this web address yet.'
  return 'Sign-in didn\'t work. Try again.'
}
const authFail = (e: unknown): never => { throw new AuthError(authMessage((e as { code?: string }).code || '')) }

const env = import.meta.env
// Firebase web config. These values are public by design (they ship to every browser).
// Fill src/lib/firebaseConfig.ts, or set VITE_FIREBASE_* environment variables.
const fb = {
  apiKey: env.VITE_FIREBASE_API_KEY || FIREBASE_CONFIG.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || FIREBASE_CONFIG.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || FIREBASE_CONFIG.projectId,
  appId: env.VITE_FIREBASE_APP_ID || FIREBASE_CONFIG.appId,
}
// VITE_FORCE_DEMO=1 runs the app on browser storage only (used for local tests).
export const firebaseConfigured = Boolean(fb.apiKey && fb.projectId) && env.VITE_FORCE_DEMO !== '1'

/* ------------------------------------------------------------------ Firebase */
async function makeFirebase(): Promise<Backend> {
  const { initializeApp } = await import('firebase/app')
  const authMod = await import('firebase/auth')
  const fs = await import('firebase/firestore')
  const app = initializeApp(fb)
  const auth = authMod.getAuth(app)
  const db = fs.getFirestore(app)
  const col = (uid: string, name: string) => fs.collection(db, 'users', uid, name)
  const clean = <T extends object>(o: T) => JSON.parse(JSON.stringify(o)) as T // drop undefined fields

  const toUser = (u: import('firebase/auth').User | null): AuthUser | null => {
    if (!u) return null
    const ids = u.providerData.map((p) => p.providerId)
    return {
      uid: u.uid, name: u.displayName || u.email?.split('@')[0] || 'You', email: u.email || undefined, photoURL: u.photoURL || undefined,
      emailVerified: u.emailVerified, provider: ids.includes('google.com') ? 'google' : ids.includes('password') ? 'password' : 'other',
    }
  }
  const verifyUrl = () => ({ url: `${window.location.origin}/home?verified=1` })

  return {
    mode: 'firebase',
    onAuth(cb) {
      return authMod.onAuthStateChanged(auth, (u) => cb(toUser(u)))
    },
    async signUpEmail(name, email, password) {
      try {
        const { user } = await authMod.createUserWithEmailAndPassword(auth, email.trim(), password)
        await authMod.updateProfile(user, { displayName: name.trim() })
        await authMod.sendEmailVerification(user, verifyUrl()).catch(() => {})
      } catch (e) { authFail(e) }
    },
    async signInEmail(email, password) {
      try { await authMod.signInWithEmailAndPassword(auth, email.trim(), password) } catch (e) { authFail(e) }
    },
    async resetPassword(email) {
      try { await authMod.sendPasswordResetEmail(auth, email.trim(), { url: `${window.location.origin}/signin` }) }
      catch (e) { const code = (e as { code?: string }).code || ''; if (!code.includes('user-not-found')) authFail(e) } // don't reveal whether an account exists
    },
    async resendVerification() {
      if (!auth.currentUser) return
      try { await authMod.sendEmailVerification(auth.currentUser, verifyUrl()) } catch (e) { authFail(e) }
    },
    async deleteAccount() {
      const u = auth.currentUser
      if (!u) return
      const uid = u.uid
      for (const name of ['days', 'cases', 'drills', 'stories']) {
        const snap = await fs.getDocs(col(uid, name))
        await Promise.all(snap.docs.map((d) => fs.deleteDoc(d.ref)))
      }
      const invites = await fs.getDocs(fs.query(fs.collection(db, 'invites'), fs.where('from', '==', uid)))
      await Promise.all(invites.docs.map((d) => fs.deleteDoc(d.ref)))
      await Promise.all(['users', 'summaries', 'stats', 'students'].map((c) => fs.deleteDoc(fs.doc(db, c, uid)).catch(() => {})))
      try { await authMod.deleteUser(u) } catch (e) {
        if (((e as { code?: string }).code || '').includes('requires-recent-login')) {
          throw new AuthError('Your saved data has been deleted. To remove the sign-in itself, sign out, sign back in, and press delete again.')
        }
        authFail(e)
      }
    },
    async refreshUser() {
      if (!auth.currentUser) return null
      await auth.currentUser.reload()
      if (auth.currentUser.emailVerified) await auth.currentUser.getIdToken(true) // database rules see the new state
      return toUser(auth.currentUser)
    },
    async signIn() {
      const provider = new authMod.GoogleAuthProvider()
      provider.setCustomParameters({ prompt: 'select_account' })
      try { await authMod.signInWithPopup(auth, provider) }
      catch (e: unknown) {
        const code = (e as { code?: string }).code
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') await authMod.signInWithRedirect(auth, provider)
        else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') authFail(e)
      }
    },
    signOut: () => authMod.signOut(auth),
    async loadAll(uid) {
      const [p, days, cases, drills, stories] = await Promise.all([
        fs.getDoc(fs.doc(db, 'users', uid)),
        fs.getDocs(col(uid, 'days')), fs.getDocs(col(uid, 'cases')), fs.getDocs(col(uid, 'drills')), fs.getDocs(col(uid, 'stories')),
      ])
      const dayMap: Record<string, DayEntry> = {}
      days.forEach((d) => { dayMap[d.id] = d.data() as DayEntry })
      return {
        profile: p.exists() ? (p.data() as Profile) : null,
        days: dayMap,
        cases: cases.docs.map((d) => d.data() as CaseEntry),
        drills: drills.docs.map((d) => d.data() as DrillEntry),
        stories: stories.docs.map((d) => d.data() as Story),
      }
    },
    saveProfile: (uid, p) => fs.setDoc(fs.doc(db, 'users', uid), clean(p), { merge: true }),
    saveDay: (uid, d) => fs.setDoc(fs.doc(col(uid, 'days'), d.date), clean(d)),
    saveCase: (uid, c) => fs.setDoc(fs.doc(col(uid, 'cases'), c.id), clean(c)),
    deleteCase: (uid, id) => fs.deleteDoc(fs.doc(col(uid, 'cases'), id)),
    saveDrill: (uid, d) => fs.setDoc(fs.doc(col(uid, 'drills'), d.id), clean(d)),
    saveStory: (uid, s) => fs.setDoc(fs.doc(col(uid, 'stories'), s.id), clean(s)),
    deleteStory: (uid, id) => fs.deleteDoc(fs.doc(col(uid, 'stories'), id)),
    saveSummary: (s) => fs.setDoc(fs.doc(db, 'summaries', s.uid), clean(s)),
    async getSummary(uid) {
      try { const d = await fs.getDoc(fs.doc(db, 'summaries', uid)); return d.exists() ? (d.data() as Summary) : null }
      catch { return null } // not shared with us (yet)
    },
    async createInvite(from, fromName) {
      const code = newId()
      await fs.setDoc(fs.doc(db, 'invites', code), { code, from, fromName, createdAt: Date.now(), acceptedBy: null, acceptedName: null })
      return code
    },
    async getInvite(code) {
      const d = await fs.getDoc(fs.doc(db, 'invites', code)); return d.exists() ? (d.data() as Invite) : null
    },
    async acceptInvite(code, me, myName) {
      await fs.updateDoc(fs.doc(db, 'invites', code), { acceptedBy: me, acceptedName: myName })
    },
    async acceptedInvites(from) {
      const q = fs.query(fs.collection(db, 'invites'), fs.where('from', '==', from))
      const snap = await fs.getDocs(q)
      return snap.docs.map((d) => d.data() as Invite).filter((i) => i.acceptedBy)
    },
    async sendSchoolLink(email) {
      await authMod.sendSignInLinkToEmail(auth, email, { url: `${window.location.origin}/verify-school`, handleCodeInApp: true })
    },
    isSchoolLink: (href) => authMod.isSignInWithEmailLink(auth, href),
    async completeSchoolLink(email, href) {
      const u = auth.currentUser
      if (!u) throw new SchoolLinkError('Sign in first, then open the link again.')
      const cred = authMod.EmailAuthProvider.credentialWithLink(email, href)
      try {
        const already = u.providerData.find((p) => p.providerId === 'password')
        if (already && already.email?.toLowerCase() !== email.toLowerCase()) await authMod.unlink(u, 'password')
        if (!already || already.email?.toLowerCase() !== email.toLowerCase()) await authMod.linkWithCredential(u, cred)
      } catch (e: unknown) {
        const code = (e as { code?: string }).code || ''
        if (code.includes('already-in-use')) throw new SchoolLinkError('That school email is already verified on another account.')
        if (code.includes('invalid-action-code') || code.includes('expired')) throw new SchoolLinkError('This link has expired or was already used. Send yourself a new one.')
        if (code.includes('invalid-email')) throw new SchoolLinkError('The email doesn\'t match the one the link was sent to.')
        throw e
      }
      await u.getIdToken(true) // refresh so the database sees the verified school email
    },
    saveStudent: (s) => fs.setDoc(fs.doc(db, 'students', s.uid), clean(s)),
    async getStudent(uid) {
      try { const d = await fs.getDoc(fs.doc(db, 'students', uid)); return d.exists() ? (d.data() as StudentRecord) : null } catch { return null }
    },
    async listPerks() {
      try { const s = await fs.getDocs(fs.collection(db, 'perks')); return s.docs.map((d) => ({ ...(d.data() as Perk), id: d.id })) } catch { return [] }
    },
    async listStudents() {
      const s = await fs.getDocs(fs.collection(db, 'students')); return s.docs.map((d) => d.data() as StudentRecord)
    },
    savePerk: (p) => fs.setDoc(fs.doc(db, 'perks', p.id), clean(p)),
    deletePerk: (id) => fs.deleteDoc(fs.doc(db, 'perks', id)),
    saveStats: (st) => fs.setDoc(fs.doc(db, 'stats', st.uid), { ...clean(st), activeDays: fs.arrayUnion(...st.activeDays) }, { merge: true }),
    async bumpStats(b) {
      const inc: Record<string, unknown> = { uid: b.uid, lastActive: Date.now(), activeDays: fs.arrayUnion(b.day) }
      if (b.sessions) inc.sessions = fs.increment(b.sessions)
      if (b.minutes) inc.minutes = fs.increment(b.minutes)
      if (b.views && Object.keys(b.views).length) inc.views = Object.fromEntries(Object.entries(b.views).map(([k, v]) => [k, fs.increment(v)]))
      for (const k of ['lastPath', 'device', 'tz', 'source'] as const) if (b[k]) inc[k] = b[k]
      await fs.setDoc(fs.doc(db, 'stats', b.uid), inc, { merge: true })
    },
    async listStats() {
      const s = await fs.getDocs(fs.collection(db, 'stats')); return s.docs.map((d) => d.data() as UserStats)
    },
    watchStats(cb, onError) {
      return fs.onSnapshot(fs.collection(db, 'stats'), (snap) => cb(snap.docs.map((d) => d.data() as UserStats)), onError)
    },
  }
}

/* ------------------------------------------------------------------ Demo (localStorage) */
const DEMO_PERKS: Perk[] = [
  { id: 'tracker', title: 'The PrepForCase spreadsheet', description: 'The full tracker as an Excel / Google Sheets file, free for verified students.', kind: 'download', url: '#', order: 1 },
  { id: 'casebook', title: '40% off the Casebook Vol. 1', description: '15 original cases with full solutions, as a printable PDF.', kind: 'code', code: 'STUDENT40', url: '#', order: 2 },
  { id: 'early', title: 'Early access to new cases', description: 'New cases appear here a week before anyone else gets them.', kind: 'link', url: '#', order: 3 },
]

const KEY = 'cpos-device-v2'
type DemoState = { signedIn: boolean; data: UserData; summaries: Record<string, Summary>; invites: Record<string, Invite>; student?: StudentRecord | null; perks?: Perk[]; stats?: UserStats }

function seed(): DemoState {
  return { signedIn: false, data: { profile: null, days: {}, cases: [], drills: [], stories: [] }, summaries: {}, invites: {} }
}

function makeDemo(): Backend {
  const read = (): DemoState => {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* storage unavailable */ }
    return seed()
  }
  let state = read()
  const listeners = new Set<(u: AuthUser | null) => void>()
  const user: AuthUser = { uid: 'device', name: 'You' }
  const write = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ } }
  const emit = () => listeners.forEach((l) => l(state.signedIn ? user : null))
  const upd = (f: (s: DemoState) => void) => { f(state); write(); return Promise.resolve() }
  return {
    mode: 'demo',
    onAuth(cb) { listeners.add(cb); setTimeout(() => cb(state.signedIn ? user : null), 0); return () => { listeners.delete(cb) } },
    async signIn() { state.signedIn = true; write(); emit() },
    async signOut() { state.signedIn = false; write(); emit() },
    async signUpEmail(name, email) { state.signedIn = true; user.name = name || 'You'; user.email = email; write(); emit() },
    async signInEmail(email) { state.signedIn = true; user.email = email; write(); emit() },
    async resetPassword() { /* demo: no email is sent */ },
    async resendVerification() { /* demo: no email is sent */ },
    async refreshUser() { return state.signedIn ? user : null },
    async deleteAccount() { state = seed(); write(); emit() },
    async loadAll() { return JSON.parse(JSON.stringify(state.data)) },
    saveProfile: (_u, p) => upd((s) => { s.data.profile = { ...(s.data.profile || {}), ...p } }),
    saveDay: (_u, d) => upd((s) => { s.data.days[d.date] = d }),
    saveCase: (_u, c) => upd((s) => { s.data.cases = [...s.data.cases.filter((x) => x.id !== c.id), c] }),
    deleteCase: (_u, id) => upd((s) => { s.data.cases = s.data.cases.filter((x) => x.id !== id) }),
    saveDrill: (_u, d) => upd((s) => { s.data.drills = [...s.data.drills, d] }),
    saveStory: (_u, st) => upd((s) => { s.data.stories = [...s.data.stories.filter((x) => x.id !== st.id), st] }),
    deleteStory: (_u, id) => upd((s) => { s.data.stories = s.data.stories.filter((x) => x.id !== id) }),
    saveSummary: (sum) => upd((s) => { s.summaries[sum.uid] = sum }),
    async getSummary(uid) { return state.summaries[uid] || null },
    async createInvite(from, fromName) { const code = newId(); await upd((s) => { s.invites[code] = { code, from, fromName, createdAt: Date.now() } }); return code },
    async getInvite(code) { return state.invites[code] || null },
    acceptInvite: (code, me, name) => upd((s) => { if (s.invites[code]) { s.invites[code].acceptedBy = me; s.invites[code].acceptedName = name } }),
    async acceptedInvites() { return [] },
    async sendSchoolLink() { /* demo: no email is sent */ },
    isSchoolLink: (href) => href.includes('demoLink=1'),
    async completeSchoolLink() { /* demo: treated as verified */ },
    saveStudent: (st) => upd((s) => { s.student = st }),
    async getStudent() { return state.student || null },
    async listPerks() { return state.perks ?? DEMO_PERKS },
    async listStudents() { return state.student ? [state.student] : [] },
    savePerk: (p) => upd((s) => { s.perks = [...(s.perks ?? DEMO_PERKS).filter((x) => x.id !== p.id), p] }),
    deletePerk: (id) => upd((s) => { s.perks = (s.perks ?? DEMO_PERKS).filter((x) => x.id !== id) }),
    saveStats: (st) => upd((s) => { s.stats = { ...(s.stats || {}), ...JSON.parse(JSON.stringify(st)), activeDays: Array.from(new Set([...(s.stats?.activeDays || []), ...st.activeDays])).sort() } }),
    async listStats() { return state.stats ? [state.stats] : [] },
    bumpStats: (b) => upd((s) => {
      const cur = (s.stats || { uid: b.uid, name: 'You', createdAt: Date.now(), activeDays: [], learned: [], lessons: 0, cases: 0, drills: 0, stories: 0, trainerCards: 0, trainerMastered: 0, habitDays: 0, updatedAt: Date.now(), lastActive: Date.now() }) as UserStats
      const views = { ...(cur.views || {}) }
      Object.entries(b.views || {}).forEach(([k, v]) => { views[k] = (views[k] || 0) + v })
      s.stats = { ...cur, lastActive: Date.now(), sessions: (cur.sessions || 0) + (b.sessions || 0), minutes: (cur.minutes || 0) + (b.minutes || 0), views,
        activeDays: Array.from(new Set([...(cur.activeDays || []), b.day])).sort(), lastPath: b.lastPath || cur.lastPath, device: b.device || cur.device, tz: b.tz || cur.tz, source: cur.source || b.source }
    }),
    watchStats(cb) { cb(state.stats ? [state.stats] : []); const t = setInterval(() => cb(state.stats ? [state.stats] : []), 5000); return () => clearInterval(t) },
  }
}

let backendPromise: Promise<Backend> | null = null
export const getBackend = () => (backendPromise ??= firebaseConfigured ? makeFirebase() : Promise.resolve(makeDemo()))
export const resetDemo = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } }
