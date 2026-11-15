import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import '@fontsource-variable/newsreader/opsz.css'
import '@fontsource-variable/newsreader/opsz-italic.css'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/400-italic.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import './index.css'
import App from './App'
import { StoreProvider } from './lib/store'
import { Analytics } from '@vercel/analytics/react'

// After a new release, an open tab can ask for page code that no longer exists, which would
// leave a blank page. Reload once to pick up the new version (at most once a minute).
window.addEventListener('vite:preloadError', (e) => {
  try {
    const last = Number(sessionStorage.getItem('pfc-reloaded') || 0)
    if (Date.now() - last < 60_000) return
    sessionStorage.setItem('pfc-reloaded', String(Date.now()))
  } catch { /* storage blocked: still reload */ }
  e.preventDefault()
  window.location.reload()
})

// Preview builds (VITE_MEMORY_ROUTER=1) keep navigation inside the page for hosts without URL rewrites
const Router = import.meta.env.VITE_MEMORY_ROUTER ? MemoryRouter : BrowserRouter

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Router>
      <StoreProvider>
        <App />
        <Analytics />
      </StoreProvider>
    </Router>
  </StrictMode>,
)
