import { useEffect, useRef, useState } from 'react'
import type { ReactNode } from 'react'
import { Button, inputCls } from './ui'
import { Countdown } from './Timer'
import type { Lesson } from '../content/course'

/**
 * Section-level gate. Gating now happens once per page in SignInWall (after the first
 * screen), so this simply renders its children. Kept so pages can mark where the
 * members-only part begins.
 */
export function Gate({ children, id }: { children: ReactNode; title?: string; body?: string; id?: string }) {
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
    <section className="rounded-xl border-2 border-violet bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <h3 className="text-[20px] font-semibold">Try it now</h3>
        <Countdown seconds={t.seconds} label="Suggested time" />
      </div>
      <p className="mt-2 text-[16px] leading-relaxed text-ink">{t.prompt}</p>
      <textarea className={`${inputCls} mt-3`} rows={4} value={mine} onChange={(e) => setMine(e.target.value)} placeholder="Say or write your answer before you look. Typing is optional." />
      {shown ? (
        <div className="mt-3 rounded-lg bg-good-l/60 p-4">
          <div className="text-[13px] font-semibold text-good">One strong answer</div>
          <p className="mt-1 text-[15.5px] leading-relaxed text-ink">{t.model}</p>
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
