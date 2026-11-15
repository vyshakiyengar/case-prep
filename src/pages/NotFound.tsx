import { useEffect } from 'react'
import { Link } from 'react-router-dom'

/** Unknown addresses: say so clearly (and tell search engines not to index it), then offer the main places to go. */
export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found · PrepForCase'
    const m = document.createElement('meta'); m.name = 'robots'; m.content = 'noindex'; document.head.appendChild(m)
    return () => { m.remove() }
  }, [])
  return (
    <div className="mx-auto max-w-lg py-16 text-center">
      <h1 className="text-[28px] leading-[1.1] sm:text-[34px]">We couldn't find that page</h1>
      <p className="mt-3 text-[16px] text-ink-2">The link may be old or mistyped. These are good places to pick up from:</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <Link to="/" className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white hover:bg-ink/90">Home</Link>
        <Link to="/learn" className="rounded-full border border-line px-5 py-2.5 text-[15px] font-medium text-ink hover:border-ink/40">The course</Link>
        <Link to="/casebook" className="rounded-full border border-line px-5 py-2.5 text-[15px] font-medium text-ink hover:border-ink/40">Casebook</Link>
        <Link to="/blog" className="rounded-full border border-line px-5 py-2.5 text-[15px] font-medium text-ink hover:border-ink/40">Blog</Link>
      </div>
    </div>
  )
}
