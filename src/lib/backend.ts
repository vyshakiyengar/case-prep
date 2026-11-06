import type { CaseEntry, DayEntry, DrillEntry, Invite, Perk, Profile, StudentRecord, Story, Summary } from './types'
import { addDays, todayIso, uid as newId } from './dates'

export interface AuthUser { uid: string; name: string; email?: string; photoURL?: string }
export interface UserData { profile: Profile | null; days: Record<string, DayEntry>; cases: CaseEntry[]; drills: DrillEntry[]; stories: Story[] }

export interface Backend {
  mode: 'firebase' | 'demo'
  onAuth(cb: (u: AuthUser | null) => void): () => void
  signIn(): Promise<void>
  signOut(): Promise<void>
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
}

export class SchoolLinkError extends Error {}

const env = import.meta.env
export const firebaseConfigured = Boolean(env.VITE_FIREBASE_API_KEY && env.VITE_FIREBASE_PROJECT_ID)

/* ------------------------------------------------------------------ Firebase */
async function makeFirebase(): Promise<Backend> {
  const { initializeApp } = await import('firebase/app')
  const authMod = await import('firebase/auth')
  const fs = await import('firebase/firestore')
  const app = initializeApp({
    apiKey: env.VITE_FIREBASE_API_KEY,
    authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: env.VITE_FIREBASE_PROJECT_ID,
    appId: env.VITE_FIREBASE_APP_ID,
  })
  const auth = authMod.getAuth(app)
  const db = fs.getFirestore(app)
  const col = (uid: string, name: string) => fs.collection(db, 'users', uid, name)
  const clean = <T extends object>(o: T) => JSON.parse(JSON.stringify(o)) as T // drop undefined fields

  return {
    mode: 'firebase',
    onAuth(cb) {
      return authMod.onAuthStateChanged(auth, (u) =>
        cb(u ? { uid: u.uid, name: u.displayName || 'You', email: u.email || undefined, photoURL: u.photoURL || undefined } : null))
    },
    async signIn() {
      const provider = new authMod.GoogleAuthProvider()
      try { await authMod.signInWithPopup(auth, provider) }
      catch (e: unknown) {
        const code = (e as { code?: string }).code
        if (code === 'auth/popup-blocked' || code === 'auth/operation-not-supported-in-this-environment') await authMod.signInWithRedirect(auth, provider)
        else if (code !== 'auth/popup-closed-by-user' && code !== 'auth/cancelled-popup-request') throw e
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
  }
}

/* ------------------------------------------------------------------ Demo (localStorage) */
const DEMO_PERKS: Perk[] = [
  { id: 'tracker', title: 'The Case Prep OS spreadsheet', description: 'The full tracker as an Excel / Google Sheets file, free for verified students.', kind: 'download', url: '#', order: 1 },
  { id: 'casebook', title: '40% off the Casebook Vol. 1', description: '15 original cases with full solutions, as a printable PDF.', kind: 'code', code: 'STUDENT40', url: '#', order: 2 },
  { id: 'early', title: 'Early access to new cases', description: 'New cases appear here a week before anyone else gets them.', kind: 'link', url: '#', order: 3 },
]
const DEMO_STUDENTS: StudentRecord[] = [
  { uid: 'd1', name: 'Arjun Mehta', schoolEmail: 'amehta.mba2027@london.edu', domain: 'london.edu', school: 'London Business School', knownSchool: true, program: 'MBA', gradYear: '2027', marketing: true, consentAt: Date.now() - 864e5 * 3, verifiedAt: Date.now() - 864e5 * 3 },
  { uid: 'd2', name: 'Sofia Rossi', schoolEmail: 'sofia.rossi@insead.edu', domain: 'insead.edu', school: 'INSEAD', knownSchool: true, program: 'MBA', gradYear: '2026', marketing: false, consentAt: Date.now() - 864e5, verifiedAt: Date.now() - 864e5 },
  { uid: 'd3', name: 'James Park', schoolEmail: 'jpark@mba2027.hbs.edu', domain: 'mba2027.hbs.edu', school: 'Harvard Business School', knownSchool: true, program: 'MBA', gradYear: '2027', marketing: true, consentAt: Date.now() - 864e5 * 6, verifiedAt: Date.now() - 864e5 * 6 },
]
const KEY = 'cpos-demo-v1'
type DemoState = { signedIn: boolean; data: UserData; summaries: Record<string, Summary>; invites: Record<string, Invite>; student?: StudentRecord | null; perks?: Perk[] }

function seed(): DemoState {
  const start = addDays(todayIso(), -9)
  const days: Record<string, DayEntry> = {}
  const pattern = [[1,1,1,1,1,1,0,0],[1,1,1,1,1,1,1,0],[0,0,0,1,1,1,0,0],[0,1,1,1,1,1,1,1],[0,0,1,1,0,1,0,0],[1,1,1,1,1,1,0,1],[1,1,1,1,1,1,0,1],[1,1,1,1,1,0,1,0],[0,1,1,1,0,1,1,1]]
  const keys = ['live', 'self', 'drill', 'review', 'mind', 'voice', 'reading', 'fit'] as const
  pattern.forEach((row, i) => {
    const date = addDays(start, i)
    days[date] = { date, habits: Object.fromEntries(keys.map((k, j) => [k, !!row[j]])) }
  })
  const mk = (i: number, name: string, source: string, type: string, w: CaseEntry['with'], s: number[], mistake: string, fix: string, fixed: CaseEntry['fixed']): CaseEntry => ({
    id: `seed${i}`, date: addDays(start, i + Math.floor(i / 2)), name, source, type, with: w, mistake, fix, fixed, createdAt: i,
    scores: { clarify: s[0], structure: s[1], maths: s[2], leadership: s[3], reco: s[4], comms: s[5] },
  })
  const cases = [
    mk(0, 'Coastal Brew', 'Casebook #1', 'Profitability', 'Self', [3, 2, 3, 2, 2, 3], 'Gave a generic structure with no hypothesis', 'State a hypothesis after every structure', 'Partly'),
    mk(1, 'Nordwind E-Bikes', 'Casebook #2', 'Market entry', 'Partner', [3, 3, 2, 2, 3, 3], 'Did the breakeven maths silently and lost the interviewer', 'Say the approach before calculating', 'Yes'),
    mk(2, 'Meridian Hospitals', 'Casebook #3', 'Growth strategy', 'Expert', [4, 3, 3, 2, 3, 3], 'Waited for the interviewer to give me the next step', 'End every answer with where I want to go next', 'Yes'),
    mk(3, 'Plugged In', 'Casebook #11', 'Market sizing', 'Self', [4, 3, 4, 3, 3, 4], 'No sanity check on the final number', 'Cross-check with a second method', 'Yes'),
    mk(4, 'FreshMart', 'Casebook #7', 'Competitive response', 'Partner', [4, 4, 3, 3, 4, 3], 'Forgot to compare with doing nothing', 'Always size the do-nothing option first', ''),
  ]
  const partner: Summary = { uid: 'demo-partner', name: 'Arjun (demo partner)', partners: ['demo'], casesLogged: 8, avgScore: 3.4, weakestStage: 'Maths & charts', weekScore: 34, realPrepDays7: 5, lastFix: 'Write the formula before touching numbers', updatedAt: Date.now() }
  return { signedIn: false, data: { profile: null, days, cases, drills: [], stories: [] }, summaries: { 'demo-partner': partner }, invites: {} }
}

function makeDemo(): Backend {
  const read = (): DemoState => {
    try { const s = localStorage.getItem(KEY); if (s) return JSON.parse(s) } catch { /* storage unavailable */ }
    return seed()
  }
  let state = read()
  const listeners = new Set<(u: AuthUser | null) => void>()
  const user: AuthUser = { uid: 'demo', name: 'Demo candidate', email: 'demo@example.com' }
  const write = () => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* ignore */ } }
  const emit = () => listeners.forEach((l) => l(state.signedIn ? user : null))
  const upd = (f: (s: DemoState) => void) => { f(state); write(); return Promise.resolve() }
  return {
    mode: 'demo',
    onAuth(cb) { listeners.add(cb); setTimeout(() => cb(state.signedIn ? user : null), 0); return () => { listeners.delete(cb) } },
    async signIn() { state.signedIn = true; write(); emit() },
    async signOut() { state.signedIn = false; write(); emit() },
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
    async acceptedInvites() {
      return [{ code: 'demo', from: 'demo', fromName: 'Demo candidate', createdAt: 0, acceptedBy: 'demo-partner', acceptedName: 'Arjun (demo partner)' }]
    },
    async sendSchoolLink() { /* demo: no email is sent */ },
    isSchoolLink: (href) => href.includes('demoLink=1'),
    async completeSchoolLink() { /* demo: treated as verified */ },
    saveStudent: (st) => upd((s) => { s.student = st }),
    async getStudent() { return state.student || null },
    async listPerks() { return state.perks ?? DEMO_PERKS },
    async listStudents() {
      const mine = state.student ? [state.student] : []
      return [...mine, ...DEMO_STUDENTS]
    },
    savePerk: (p) => upd((s) => { s.perks = [...(s.perks ?? DEMO_PERKS).filter((x) => x.id !== p.id), p] }),
    deletePerk: (id) => upd((s) => { s.perks = (s.perks ?? DEMO_PERKS).filter((x) => x.id !== id) }),
  }
}

let backendPromise: Promise<Backend> | null = null
export const getBackend = () => (backendPromise ??= firebaseConfigured ? makeFirebase() : Promise.resolve(makeDemo()))
export const resetDemo = () => { try { localStorage.removeItem(KEY) } catch { /* ignore */ } }
