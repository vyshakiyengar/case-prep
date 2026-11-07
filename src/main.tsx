import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, MemoryRouter } from 'react-router-dom'
import '@fontsource-variable/source-serif-4'
import '@fontsource/ibm-plex-sans/400.css'
import '@fontsource/ibm-plex-sans/400-italic.css'
import '@fontsource/ibm-plex-sans/500.css'
import '@fontsource/ibm-plex-sans/600.css'
import './index.css'
import App from './App'
import { StoreProvider } from './lib/store'
import { Analytics } from '@vercel/analytics/react'

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
