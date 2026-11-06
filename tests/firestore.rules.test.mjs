// Run with: npm run test:rules   (needs Java; downloads the Firestore emulator on first run)
import { test, before, after } from 'node:test'
import { readFileSync } from 'node:fs'
import { initializeTestEnvironment, assertSucceeds, assertFails } from '@firebase/rules-unit-testing'
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore'

const ADMIN = 'you@example.com' // keep in sync with firestore.rules
let env
before(async () => {
  env = await initializeTestEnvironment({ projectId: 'demo-case-prep-os', firestore: { rules: readFileSync('firestore.rules', 'utf8') } })
})
after(async () => { await env.cleanup() })

const user = (uid, extra = {}) => env.authenticatedContext(uid, { email: `${uid}@gmail.com`, email_verified: true, firebase: { identities: { 'google.com': ['1'] }, sign_in_provider: 'google.com' }, ...extra }).firestore()
const student = (uid, schoolEmail) => env.authenticatedContext(uid, { email: `${uid}@gmail.com`, email_verified: true, firebase: { identities: { 'google.com': ['1'], email: [schoolEmail] }, sign_in_provider: 'google.com' } }).firestore()
const rec = (uid, schoolEmail) => ({ uid, name: uid, schoolEmail, domain: schoolEmail.split('@')[1], school: 'LBS', knownSchool: true, program: 'MBA', gradYear: '2027', marketing: false, consentAt: 1, verifiedAt: 1 })

test('users can only read and write their own prep data', async () => {
  await assertSucceeds(setDoc(doc(user('alice'), 'users/alice/cases/c1'), { name: 'x' }))
  await assertFails(getDoc(doc(user('bob'), 'users/alice/cases/c1')))
  await assertFails(setDoc(doc(user('bob'), 'users/alice'), { name: 'hijack' }))
})

test('a student record needs a verified school email on the account', async () => {
  await assertFails(setDoc(doc(user('carol'), 'students/carol'), rec('carol', 'carol@london.edu')))
  await assertFails(setDoc(doc(student('dave', 'dave@london.edu'), 'students/dave'), rec('dave', 'someone.else@london.edu')))
  await assertSucceeds(setDoc(doc(student('erin', 'erin@london.edu'), 'students/erin'), rec('erin', 'erin@london.edu')))
  await assertFails(setDoc(doc(student('erin', 'erin@london.edu'), 'students/frank'), rec('frank', 'erin@london.edu')))
})

test('only the admin can list students and manage perks', async () => {
  await assertFails(getDocs(collection(user('alice'), 'students')))
  const admin = env.authenticatedContext('admin', { email: ADMIN, email_verified: true }).firestore()
  await assertSucceeds(getDocs(collection(admin, 'students')))
  await assertSucceeds(setDoc(doc(admin, 'perks/p1'), { title: 'Free tracker' }))
  await assertFails(setDoc(doc(user('alice'), 'perks/p2'), { title: 'nope' }))
})

test('perks are visible to verified students only', async () => {
  await env.withSecurityRulesDisabled(async (ctx) => {
    await setDoc(doc(ctx.firestore(), 'perks/p1'), { title: 'Free tracker' })
    await setDoc(doc(ctx.firestore(), 'students/gina'), rec('gina', 'gina@insead.edu'))
  })
  await assertFails(getDoc(doc(user('harry'), 'perks/p1')))
  await assertSucceeds(getDoc(doc(student('gina', 'gina@insead.edu'), 'perks/p1')))
})

test('partner summaries are shared only with listed partners', async () => {
  await assertSucceeds(setDoc(doc(user('ivy'), 'summaries/ivy'), { uid: 'ivy', partners: ['jack'] }))
  await assertSucceeds(getDoc(doc(user('jack'), 'summaries/ivy')))
  await assertFails(getDoc(doc(user('kate'), 'summaries/ivy')))
})

test('an invite can be accepted once, by someone other than its creator', async () => {
  await assertSucceeds(setDoc(doc(user('lee'), 'invites/abc'), { code: 'abc', from: 'lee', fromName: 'Lee', createdAt: 1, acceptedBy: null, acceptedName: null }))
  await assertFails(updateDoc(doc(user('lee'), 'invites/abc'), { acceptedBy: 'lee', acceptedName: 'Lee' }))
  await assertSucceeds(updateDoc(doc(user('mia'), 'invites/abc'), { acceptedBy: 'mia', acceptedName: 'Mia' }))
  await assertFails(updateDoc(doc(user('ned'), 'invites/abc'), { acceptedBy: 'ned', acceptedName: 'Ned' }))
  await assertSucceeds(getDocs(query(collection(user('lee'), 'invites'), where('from', '==', 'lee'))))
})
