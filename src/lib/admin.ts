import { useEffect, useState } from 'react'
import { useStore } from './store'

// The site owner, stored as a SHA-256 fingerprint of the email so the address isn't readable in the public code.
// The database rules (firestore.rules) are what actually protect admin data; this only decides whether to show admin pages.
const ADMIN_HASHES = ['fdc81093ea59258d048e7a6769c858a612a1eb00516162b19ce86ef221d22ac3']

async function sha256(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/** true = admin, false = not admin, undefined = still checking */
export const useIsAdminState = (): boolean | undefined => {
  const { user, backend } = useStore()
  const demo = backend?.mode === 'demo'
  const email = backend?.mode === 'firebase' ? user?.email?.toLowerCase() : undefined
  const [state, setState] = useState<{ email?: string; ok: boolean } | null>(null)
  useEffect(() => {
    if (!email) return
    let live = true
    sha256(email).then((h) => { if (live) setState({ email, ok: ADMIN_HASHES.includes(h) }) })
    return () => { live = false }
  }, [email])
  if (demo) return !!import.meta.env.VITE_DEVICE_ADMIN // local testing only
  if (!email) return backend ? false : undefined
  return state && state.email === email ? state.ok : undefined
}

export const useIsAdmin = () => useIsAdminState() === true
