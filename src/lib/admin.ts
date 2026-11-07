import { useStore } from './store'

// The site owner. Must match the email list in firestore.rules.
const DEFAULT_ADMINS = 'vyshakiyengar@gmail.com'
export const ADMINS = (import.meta.env.VITE_ADMIN_EMAILS || DEFAULT_ADMINS).split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean)

export const useIsAdmin = () => {
  const { user, backend } = useStore()
  if (backend?.mode === 'demo') return !!import.meta.env.VITE_DEVICE_ADMIN // local testing only
  return backend?.mode === 'firebase' && !!user?.email && ADMINS.includes(user.email.toLowerCase())
}
