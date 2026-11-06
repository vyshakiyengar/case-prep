import { lazy, Suspense } from 'react'
import type { ReactNode } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { useStore } from './lib/store'
import AppShell from './components/AppShell'
import Landing from './pages/Landing'
import Welcome from './pages/Welcome'
import Today from './pages/Today'
import Tracker from './pages/Tracker'
import CaseLog from './pages/CaseLog'
import Partners from './pages/Partners'
import Invite from './pages/Invite'
import Settings from './pages/Settings'
import Perks from './pages/Perks'
import VerifySchool from './pages/VerifySchool'
import Privacy from './pages/Privacy'

const Admin = lazy(() => import('./pages/Admin'))

const Casebook = lazy(() => import('./pages/Casebook'))
const CasePlayer = lazy(() => import('./pages/CasePlayer'))
const Drills = lazy(() => import('./pages/Drills'))
const Playbook = lazy(() => import('./pages/Playbook'))

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return <div className="flex min-h-[40vh] items-center justify-center text-muted" role="status">{label}</div>
}

function RequireUser({ children }: { children: ReactNode }) {
  const { ready, user, data } = useStore()
  const loc = useLocation()
  if (!ready || (user && !data)) return <Loading />
  if (!user) return <Navigate to={`/?next=${encodeURIComponent(loc.pathname + loc.search)}`} replace />
  if (!data?.profile?.startDate && loc.pathname !== '/welcome' && !loc.pathname.startsWith('/invite') && !loc.pathname.startsWith('/verify-school')) return <Navigate to="/welcome" replace />
  return <>{children}</>
}

function Home() {
  const { ready, user, data } = useStore()
  const loc = useLocation()
  if (!ready || (user && !data)) return <Loading />
  if (user) {
    const next = new URLSearchParams(loc.search).get('next')
    return <Navigate to={next && next.startsWith('/') ? next : '/today'} replace />
  }
  return <Landing />
}

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/welcome" element={<RequireUser><Welcome /></RequireUser>} />
        <Route path="/invite/:code" element={<RequireUser><Invite /></RequireUser>} />
        <Route path="/verify-school" element={<RequireUser><VerifySchool /></RequireUser>} />
        <Route path="/privacy" element={<Privacy />} />
        <Route element={<RequireUser><AppShell /></RequireUser>}>
          <Route path="/today" element={<Today />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/cases" element={<CaseLog />} />
          <Route path="/casebook" element={<Casebook />} />
          <Route path="/casebook/:slug" element={<CasePlayer />} />
          <Route path="/drills" element={<Drills />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/playbook" element={<Playbook />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/perks" element={<Perks />} />
          <Route path="/admin" element={<Admin />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
