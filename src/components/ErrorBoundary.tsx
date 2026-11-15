import { Component, type ReactNode } from 'react'

/** Shows a friendly reload message instead of a blank page if something fails to load or crashes. */
export class ErrorBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch(err: unknown) {
    // A stale tab after a new release: reload once to get the latest version
    const msg = String((err as Error)?.message || err)
    if (/dynamically imported module|Importing a module script failed|Loading chunk|error loading dynamically/i.test(msg)) {
      try {
        const last = Number(sessionStorage.getItem('pfc-reloaded') || 0)
        if (Date.now() - last > 60_000) { sessionStorage.setItem('pfc-reloaded', String(Date.now())); window.location.reload() }
      } catch { /* ignore */ }
    }
  }
  render() {
    if (!this.state.failed) return this.props.children
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="font-serif text-[28px] text-ink">This page didn't load</h1>
        <p className="mt-3 text-[16px] text-ink-2">PrepForCase was probably updated while this tab was open. Reloading gets you the latest version.</p>
        <button type="button" onClick={() => window.location.reload()} className="mt-6 rounded-full bg-ink px-6 py-2.5 text-[15px] font-medium text-white hover:bg-ink/90">Reload</button>
      </div>
    )
  }
}
