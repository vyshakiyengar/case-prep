import type React from 'react'
import { Button } from '../../components/ui'
import { Link } from 'react-router-dom'

export function DrillCrumbs({ here }: { here: string }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-2 text-[13.5px] text-muted">
      <Link to="/drills" className="hover:text-ink hover:underline">Drills</Link>
      <span aria-hidden className="mx-1.5">/</span>
      <span className="text-ink-2">{here}</span>
    </nav>
  )
}

export function ModeCard({ active, onClick, title, body }: { active: boolean; onClick: () => void; title: string; body: string }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active}
      className={`rounded-xl border p-4 text-left transition-[border-color,box-shadow] duration-200 ${active ? 'border-ink bg-white shadow-[0_0_0_1px_#0F1B33]' : 'border-line bg-white hover:border-faint'}`}>
      <span className="block font-medium text-ink">{title}</span>
      <span className="mt-0.5 block text-[13.5px] text-muted">{body}</span>
    </button>
  )
}

export function Seg<T extends string | number>({ value, onChange, items, label }: { value: T; onChange: (v: T) => void; items: { value: T; label: string; sub?: string }[]; label?: string }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-xl border border-line bg-canvas p-1" role="group" aria-label={label}>
      {items.map((it) => (
        <button key={String(it.value)} type="button" onClick={() => onChange(it.value)} aria-pressed={value === it.value}
          className={`rounded-lg px-3.5 py-1.5 text-left text-[14px] transition-colors ${value === it.value ? 'bg-white font-medium text-ink shadow-sm' : 'text-muted hover:text-ink'}`}>
          {it.label}{it.sub && <span className="ml-1.5 hidden text-[12.5px] font-normal text-muted sm:inline">{it.sub}</span>}
        </button>
      ))}
    </div>
  )
}

const KEY = 'prepforcase-drill-bests-v1'
export function readBest(kind: string, key: string): number | null {
  try { const v = JSON.parse(localStorage.getItem(KEY) || '{}')[`${kind}:${key}`]; return typeof v === 'number' ? v : null } catch { return null }
}
export function writeBest(kind: string, key: string, v: number) {
  try { const all = JSON.parse(localStorage.getItem(KEY) || '{}'); all[`${kind}:${key}`] = v; localStorage.setItem(KEY, JSON.stringify(all)) } catch { /* storage is optional */ }
}

export function HowItWorks({ steps }: { steps: string[] }) {
  return (
    <section className="mt-5" aria-label="How it works">
      <h2 className="font-sans text-[15px] font-semibold text-ink">How it works</h2>
      <ol className="mt-2 grid gap-2 sm:grid-cols-3">
        {steps.map((s, i) => (
          <li key={s} className="flex gap-3 rounded-lg border border-line bg-white p-3 text-[14px] text-ink-2">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-l text-[13px] font-semibold text-teal-d">{i + 1}</span>{s}
          </li>
        ))}
      </ol>
    </section>
  )
}

/** A big, self-explaining choice: what it is, what happens, and one Start button. */
export function StartCard({ title, tag, body, example, meta, onStart, cta = 'Start' }: { title: string; tag?: string; body: string; example?: React.ReactNode; meta: string; onStart: () => void; cta?: string }) {
  return (
    <div className="flex flex-col rounded-xl border border-line bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <h2 className="text-[22px]">{title}</h2>
        {tag && <span className="rounded-full bg-teal-l px-2 py-0.5 text-[12px] font-medium text-teal-d">{tag}</span>}
      </div>
      <p className="mt-2 text-[15px] text-ink-2">{body}</p>
      {example && <div className="mt-3 rounded-lg bg-canvas px-3.5 py-2.5 text-[14px] text-ink-2">{example}</div>}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5">
        <Button className="px-6 py-2.5" onClick={onStart}>{cta}</Button>
        <span className="text-[13.5px] text-muted">{meta}</span>
      </div>
    </div>
  )
}
