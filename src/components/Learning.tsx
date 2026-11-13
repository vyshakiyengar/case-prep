import { useEffect, useMemo, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button, inputCls } from './ui'
import { Countdown } from './Timer'
import { useStore } from '../lib/store'
import { SignInPanel } from './SignInPanel'
import type { Lesson } from '../content/course'
import { useLocation, Link } from 'react-router-dom'
import { claimPage, FREE_CASES, FREE_PAGES, type Taste } from '../lib/taste'
import { track } from '../lib/funnel'

/** Card shown over locked content. Signing in is free; nothing else is needed. */
export function SignInCard({ id, what, lead }: { id?: string; what?: string; lead?: string }) {
  return (
    <section aria-labelledby={id ? `${id}-t` : undefined} className="relative mx-auto w-full max-w-[420px] rounded-xl border border-line bg-white p-5 text-center shadow-[0_30px_60px_-30px_rgba(15,27,51,.55)] sm:p-7">
      <span aria-hidden className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-canvas text-ink">
        <svg width="18" height="18" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M6 11h12v9H6zM8.5 11V8a3.5 3.5 0 0 1 7 0v3" /></svg>
      </span>
      <h2 id={id ? `${id}-t` : undefined} className="mt-3 text-[22px] leading-tight">Sign in to see it all, free</h2>
      <p className="mt-1.5 mb-5 text-[14.5px] text-muted">{lead ? `${lead} ` : ''}Only a sign-in is needed. No payment, no trial.{what ? ` You'll get ${what}.` : ''}</p>
      <SignInPanel />
    </section>
  )
}

/** A quiet line telling a signed-out visitor that this page or case is one of their free ones. */
export function FreeNote({ t, kind }: { t: Taste; kind: 'page' | 'case' }) {
  const max = kind === 'case' ? FREE_CASES : FREE_PAGES
  return (
    <p className="mb-4 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-teal-l px-3.5 py-2 text-[13.5px] text-teal-d">
      <span>{kind === 'case' ? `Free full case ${t.n} of ${max}: every step is open.` : `Free page ${t.n} of ${max}: everything here is open.`}</span>
      <Link to="/signin" className="font-medium underline">Sign in free to open everything</Link>
    </p>
  )
}

/** Shows content blurred and locked behind a sign-in card. */
export function Locked({ children, id, what, lead, kind = 'gate' }: { children: ReactNode; id?: string; what?: string; lead?: string; kind?: 'gate' | 'case' }) {
  useEffect(() => { track('lock_any'); track(`lock_${kind}`) }, [kind])
  return (
    <div id={id} className="relative min-h-[520px]">
      <div aria-hidden inert className="pointer-events-none max-h-[640px] select-none overflow-hidden blur-[5px] [mask-image:linear-gradient(to_bottom,#000_55%,transparent)]">{children}</div>
      <div className="absolute inset-x-0 top-6 flex justify-center px-1 sm:top-10"><SignInCard id={id} what={what} lead={lead} /></div>
    </div>
  )
}

/**
 * Marks where the members-only part of an open page begins. Signed-out visitors (and search
 * engines) read everything above it; what's inside shows blurred behind a sign-in card.
 */
/** Whether this page is one of a signed-out visitor's free, fully open pages (claims a slot if one is left). */
export function useFreePage(): boolean {
  const { user, ready } = useStore()
  const { pathname } = useLocation()
  return useMemo(() => !user && ready && claimPage(pathname).free, [user, ready, pathname])
}

export function Gate({ children, id, what }: { children: ReactNode; id?: string; what?: string }) {
  const { user, ready } = useStore()
  const { pathname } = useLocation()
  const taste = useMemo(() => (!user && ready ? claimPage(pathname) : null), [user, ready, pathname])
  if (taste?.free) return <div id={id}><FreeNote t={taste} kind="page" />{children}</div>
  if (!user && ready) return <Locked id={id} what={what} lead={taste && taste.used >= FREE_PAGES ? `You've seen your ${FREE_PAGES} free pages.` : undefined}>{children}</Locked>
  return id ? <div id={id}>{children}</div> : <>{children}</>
}

export type NavItem = { id: string; label: string; locked?: boolean }

/** Sticky, horizontally scrolling contents bar with scroll-spy. One page, many sections. */
export function StickyNav({ items, gateId }: { items: NavItem[]; gateId?: string }) {
  const [active, setActive] = useState(items[0]?.id)
  const bar = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive(vis[0].target.id)
    }, { rootMargin: '-130px 0px -65% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [items])
  useEffect(() => {
    const el = bar.current?.querySelector<HTMLElement>(`[data-id="${active}"]`)
    if (el && bar.current) bar.current.scrollTo({ left: el.offsetLeft - bar.current.offsetLeft - 16, behavior: "smooth" })
  }, [active])
  const go = (i: NavItem) => {
    const target = document.getElementById(i.locked && gateId ? gateId : i.id)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    history.replaceState(null, '', `${location.pathname}#${i.id}`)
  }
  return (
    <nav aria-label="On this page" className="sticky top-[57px] z-10 -mx-4 mb-6 border-b border-line bg-canvas/95 px-4 py-2.5 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
      <div ref={bar} className="flex gap-1.5 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {items.map((i) => (
          <a key={i.id} data-id={i.id} href={`#${i.id}`} onClick={(e) => { e.preventDefault(); go(i) }} aria-current={active === i.id ? 'true' : undefined}
            className={`flex shrink-0 items-center gap-1 whitespace-nowrap rounded-full border px-3 py-1.5 text-[13.5px] font-medium transition-colors ${active === i.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink-2 hover:border-faint'}`}>
            {i.label}{i.locked && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-label="sign-in needed"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>}
          </a>
        ))}
      </div>
    </nav>
  )
}

export function TryIt({ t }: { t: NonNullable<Lesson['tryIt']> }) {
  const [shown, setShown] = useState(false)
  const [mine, setMine] = useState('')
  return (
    <section className="rounded-lg border-2 border-violet bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-[17.5px] font-semibold">Try it now</h3>
        <Countdown seconds={t.seconds} label="Suggested time" />
      </div>
      <p className="mt-2 text-[15px] leading-relaxed text-ink">{t.prompt}</p>
      <textarea className={`${inputCls} mt-3`} rows={4} value={mine} onChange={(e) => setMine(e.target.value)} placeholder="Say or write your answer before you look. Typing is optional." />
      {shown ? (
        <div className="mt-3 rounded-lg bg-good-l/60 p-4">
          <div className="text-[13px] font-semibold text-good">One strong answer</div>
          <p className="mt-1 text-[14.5px] leading-relaxed text-ink">{t.model}</p>
          <p className="mt-2 text-[13.5px] text-muted">Yours doesn't need to match. Check it has the same shape.</p>
        </div>
      ) : <Button className="mt-3" variant="secondary" onClick={() => setShown(true)}>Compare with a strong answer</Button>}
    </section>
  )
}

export function Quiz({ items }: { items: Lesson['quiz'] }) {
  const [picked, setPicked] = useState<Record<number, number>>({})
  return (
    <ol className="space-y-5">
      {items.map((it, qi) => {
        const p = picked[qi]
        return (
          <li key={qi}>
            <p className="font-medium text-ink">{qi + 1}. {it.q}</p>
            <div className="mt-2 grid gap-2">
              {it.options.map((o, oi) => {
                const chosen = p === oi, correct = oi === it.answer, revealed = p !== undefined
                const tone = !revealed ? 'border-line bg-white hover:border-faint' : correct ? 'border-good bg-good-l' : chosen ? 'border-signal bg-signal-l' : 'border-line bg-white opacity-70'
                return (
                  <button key={oi} disabled={revealed} onClick={() => setPicked((x) => ({ ...x, [qi]: oi }))}
                    className={`rounded-lg border px-3 py-2.5 text-left text-[14.5px] text-ink ${tone}`}>
                    {o}{revealed && correct && <span className="ml-2 text-[13px] font-medium text-good">Correct</span>}
                  </button>
                )
              })}
            </div>
            {p !== undefined && <p className={`mt-2 text-[14px] ${p === it.answer ? 'text-good' : 'text-signal-d'}`}>{p === it.answer ? 'Right. ' : 'Not quite. '}<span className="text-ink-2">{it.why}</span></p>}
          </li>
        )
      })}
    </ol>
  )
}

/** Scroll to the element named in the URL (slug param or #hash) once the page has rendered. */
export function useScrollToTarget(id?: string) {
  useEffect(() => {
    const target = location.hash ? decodeURIComponent(location.hash.slice(1)) : id
    if (!target) return
    const t = setTimeout(() => document.getElementById(target)?.scrollIntoView({ block: 'start' }), 80)
    return () => clearTimeout(t)
  }, [id])
}

/** One quiet sticky bar: a "jump to" menu that follows your scroll, plus optional progress text. */
export function JumpBar({ items, label = 'Jump to', right }: { items: NavItem[]; label?: string; right?: ReactNode }) {
  const [active, setActive] = useState(items[0]?.id ?? '')
  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e)
    const io = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
      if (vis[0]) setActive(vis[0].target.id)
    }, { rootMargin: '-120px 0px -70% 0px' })
    els.forEach((e) => io.observe(e))
    return () => io.disconnect()
  }, [items])
  return (
    <nav aria-label="On this page" className="sticky top-[57px] z-10 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-line bg-canvas/95 px-4 py-2 backdrop-blur sm:-mx-6 sm:px-6 lg:top-0 lg:-mx-10 lg:px-10">
      <label className="flex min-w-0 items-center gap-2 text-[14px] text-muted">
        <span className="shrink-0">{label}</span>
        <select value={active} onChange={(e) => { const id = e.target.value; document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' }); history.replaceState(null, '', `${location.pathname}#${id}`) }}
          className="min-w-0 max-w-[16rem] truncate rounded-lg border border-line bg-white px-2.5 py-1.5 text-[14px] font-medium text-ink sm:max-w-sm">
          {items.map((i) => <option key={i.id} value={i.id}>{i.label}</option>)}
        </select>
      </label>
      {right && <span className="shrink-0 text-[13.5px] text-muted">{right}</span>}
    </nav>
  )
}
