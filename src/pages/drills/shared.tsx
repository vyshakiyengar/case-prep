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
