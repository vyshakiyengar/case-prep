import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store'
import AppShell from './components/AppShell'
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'
import SignIn from './pages/SignIn'
import Today from './pages/Today'
import Tracker from './pages/Tracker'
import CaseLog from './pages/CaseLog'
import Partners from './pages/Partners'
import Invite from './pages/Invite'
import Settings from './pages/Settings'
import Perks from './pages/Perks'
import VerifySchool from './pages/VerifySchool'
import Privacy from './pages/Privacy'
import Learn from './pages/Learn'

const Admin = lazy(() => import('./pages/Admin'))
const Casebook = lazy(() => import('./pages/Casebook'))
const CasePlayer = lazy(() => import('./pages/CasePlayer'))
const Drills = lazy(() => import('./pages/Drills'))
const Graphs = lazy(() => import('./pages/Graphs'))
const InterviewSkills = lazy(() => import('./pages/InterviewSkills'))
const Stories = lazy(() => import('./pages/Stories'))
const PerfectCasing = lazy(() => import('./pages/PerfectCasing'))
const FrameworksIndex = lazy(() => import('./pages/Frameworks').then((m) => ({ default: m.FrameworksIndex })))
const Framework = lazy(() => import('./pages/Frameworks'))
const CaseTypes = lazy(() => import('./pages/Reference').then((m) => ({ default: m.CaseTypes })))
const Formulas = lazy(() => import('./pages/Reference').then((m) => ({ default: m.Formulas })))
const Glossary = lazy(() => import('./pages/Reference').then((m) => ({ default: m.Glossary })))
const Interviewer = lazy(() => import('./pages/Interviewer'))
const SiteHome = lazy(() => import('./pages/Home'))

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="flex min-h-[40vh] items-center justify-center text-muted" role="status">{label}</div>
}

function RequireUser({ children }: { children: ReactNode }) {
  const { ready, user, data } = useStore()
  const loc = useLocation()
  if (!ready || (user && !data)) return <Loading />
  if (!user) return <Navigate to={`/signin?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  if (!data?.profile?.startDate && loc.pathname !== '/welcome' && !loc.pathname.startsWith('/invite') && !loc.pathname.startsWith('/verify-school')) return <Navigate to={`/welcome?next=${encodeURIComponent(loc.pathname)}`} replace />
  return <>{children}</>
}

function Home() {
  const { ready, user, data } = useStore()
  if (!ready || (user && !data)) return <Loading />
  if (user) return <Navigate to="/home" replace />
  return <Landing />
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/welcome" element={<RequireUser><Welcome /></RequireUser>} />
        <Route path="/invite/:code" element={<RequireUser><Invite /></RequireUser>} />
        <Route path="/verify-school" element={<RequireUser><VerifySchool /></RequireUser>} />
        <Route element={<AppShell />}>
          {/* open to everyone */}
          <Route path="/learn" element={<Learn />} />
          <Route path="/learn/:slug" element={<Learn />} />
          <Route path="/perfect-casing" element={<PerfectCasing />} />
          <Route path="/frameworks" element={<FrameworksIndex />} />
          <Route path="/frameworks/:slug" element={<Framework />} />
          <Route path="/graphs" element={<Graphs />} />
          <Route path="/home" element={<SiteHome />} />
          <Route path="/case-types" element={<CaseTypes />} />
          <Route path="/formulas" element={<Formulas />} />
          <Route path="/glossary" element={<Glossary />} />
          <Route path="/interviewer" element={<Interviewer />} />
          <Route path="/interview-skills" element={<InterviewSkills />} />
          <Route path="/casebook" element={<Casebook />} />
          <Route path="/casebook/:slug" element={<CasePlayer />} />
          <Route path="/drills" element={<Drills />} />
          {/* my prep: signed in */}
          <Route path="/today" element={<RequireUser><Today /></RequireUser>} />
          <Route path="/tracker" element={<RequireUser><Tracker /></RequireUser>} />
          <Route path="/cases" element={<RequireUser><CaseLog /></RequireUser>} />
          <Route path="/stories" element={<RequireUser><Stories /></RequireUser>} />
          <Route path="/partners" element={<RequireUser><Partners /></RequireUser>} />
          <Route path="/perks" element={<RequireUser><Perks /></RequireUser>} />
          <Route path="/settings" element={<RequireUser><Settings /></RequireUser>} />
          <Route path="/admin" element={<RequireUser><Admin /></RequireUser>} />
        </Route>
        <Route path="/playbook" element={<Navigate to="/learn" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
