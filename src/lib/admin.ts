import { useStore } from './store'

const ADMINS = (import.meta.env.VITE_ADMIN_EMAILS || '').split(',').map((s: string) => s.trim().toLowerCase()).filter(Boolean)
export const useIsAdmin = () => {
  const { user, backend } = useStore()
  return backend?.mode === 'demo' || (!!user?.email && ADMINS.includes(user.email.toLowerCase()))
}
