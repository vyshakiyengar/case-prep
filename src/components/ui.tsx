import { ICON_P, WORDMARK } from './brand'
import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router-dom'

type BtnVariant = 'primary' | 'secondary' | 'quiet' | 'danger'
const btnBase = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-[14px] font-medium transition-colors disabled:opacity-50'
const btnVar: Record<BtnVariant, string> = {
  primary: 'bg-ink text-white hover:bg-[#1C2B4A] shadow-[0_1px_0_rgba(15,27,51,.08)]',
  secondary: 'bg-white text-ink border border-[#D3DAE3] hover:border-ink/40',
  quiet: 'text-ink hover:bg-white/70 px-3',
  danger: 'text-signal-d hover:bg-signal-l px-3',
}
export function Button({ variant = 'primary', className = '', ...p }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return <button className={`${btnBase} ${btnVar[variant]} ${className}`} {...p} />
}
export function LinkButton({ to, variant = 'primary', children, className = '' }: { to: string; variant?: BtnVariant; children: ReactNode; className?: string }) {
  return <Link to={to} className={`${btnBase} ${btnVar[variant]} ${className}`}>{children}</Link>
}

export function PageHeader({ title, intro, action }: { title: string; intro?: ReactNode; action?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div className="max-w-2xl">
        <h1 className="text-[32px] leading-[1.1] sm:text-[40px]">{title}</h1>
        <span aria-hidden className="mt-3 block h-[2px] w-10 bg-teal" />
        {intro && <p className="mt-3 text-[16px] leading-relaxed text-muted">{intro}</p>}
      </div>
      {action}
    </header>
  )
}

export function Section({ title, aside, children, className = '' }: { title?: string; aside?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`rounded-xl border border-line bg-white p-5 sm:p-6 ${className}`}>
      {(title || aside) && (
        <div className="mb-3 flex items-baseline justify-between gap-3">
          {title && <h2 className="text-[21px]">{title}</h2>}
          {aside}
        </div>
      )}
      {children}
    </section>
  )
}

export const trackColor = (t: 'A' | 'B') => (t === 'A' ? 'teal' : 'violet')

export function Meter({ value, max = 5, color = 'bg-teal' }: { value: number | null; max?: number; color?: string }) {
  const pct = value === null ? 0 : Math.max(0, Math.min(1, value / max)) * 100
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-canvas" aria-hidden>
      <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export const scoreTone = (v?: number | null) =>
  v == null ? 'bg-canvas text-faint' : v >= 4 ? 'bg-good-l text-good' : v >= 3 ? 'bg-marker-l text-[#8A6A00]' : 'bg-signal-l text-signal-d'

export function ScoreChip({ v }: { v?: number | null }) {
  return <span className={`inline-flex h-7 min-w-7 items-center justify-center rounded-md px-1.5 text-[13px] font-semibold tabular-nums ${scoreTone(v)}`}>{v ?? '–'}</span>
}

export function ScorePicker({ value, onChange, label }: { value?: number; onChange: (v: number) => void; label: string }) {
  return (
    <div role="radiogroup" aria-label={label} className="inline-flex overflow-hidden rounded-lg border border-line">
      {[1, 2, 3, 4, 5].map((n) => (
        <button key={n} type="button" role="radio" aria-checked={value === n} onClick={() => onChange(n)}
          className={`h-9 w-9 border-r border-line text-[14px] font-semibold last:border-r-0 ${value === n ? scoreTone(n) : 'bg-white text-muted hover:bg-canvas'}`}>
          {n}
        </button>
      ))}
    </div>
  )
}

export function Empty({ title, children, action }: { title: string; children?: ReactNode; action?: ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-line bg-white/60 px-6 py-10 text-center">
      <h3 className="text-[18px] font-semibold">{title}</h3>
      {children && <p className="mx-auto mt-1 max-w-md text-muted">{children}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  )
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="block text-[13.5px] font-medium text-ink">{label}</span>
      {hint && <span className="block text-[12.5px] text-muted">{hint}</span>}
      <div className="mt-1.5">{children}</div>
    </label>
  )
}
export const inputCls = 'w-full rounded-lg border border-line bg-white px-3 py-2 text-[14.5px] text-ink placeholder:text-faint focus:border-teal focus:outline-none focus:ring-2 focus:ring-teal/15'

export function Tabs<T extends string>({ value, onChange, items }: { value: T; onChange: (v: T) => void; items: { value: T; label: string }[] }) {
  return (
    <div role="tablist" className="mb-5 flex flex-wrap gap-1 border-b border-line">
      {items.map((it) => (
        <button key={it.value} role="tab" aria-selected={value === it.value} onClick={() => onChange(it.value)}
          className={`-mb-px border-b-2 px-3 py-2 text-[14.5px] font-medium ${value === it.value ? 'border-ink text-ink' : 'border-transparent text-muted hover:text-ink'}`}>
          {it.label}
        </button>
      ))}
    </div>
  )
}

export function Avatar({ name, photo, size = 32 }: { name: string; photo?: string; size?: number }) {
  const initials = name.split(/\s+/).map((p) => p[0]).filter((c) => c && /\p{L}/u.test(c)).slice(0, 2).join('').toUpperCase()
  return photo
    ? <img src={photo} alt="" width={size} height={size} referrerPolicy="no-referrer" className="rounded-full" style={{ width: size, height: size }} />
    : <span className="inline-flex items-center justify-center rounded-full bg-teal-l font-semibold text-teal-d" style={{ width: size, height: size, fontSize: size * 0.38 }}>{initials}</span>
}

/** The PrepForCase app icon: a serif P with a teal rule. */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" aria-hidden>
      <rect width="48" height="48" rx="10" fill="#14213D" />
      <path d={ICON_P.d} transform={ICON_P.transform} fill="#FBFCFE" />
      <rect x="14" y="37" width="20" height="2" fill="#5ED3DC" />
    </svg>
  )
}

/** The PrepForCase wordmark: Prep *for* Case with a teal underline. */
export function Logo({ light = false, height = 30 }: { light?: boolean; height?: number }) {
  const [, , w, h] = WORDMARK.viewBox.split(' ').map(Number)
  const u = WORDMARK.underline
  return (
    <svg role="img" aria-label="PrepForCase" height={height} width={(height * w) / h} viewBox={WORDMARK.viewBox} className="block">
      <path d={WORDMARK.d} fill={light ? '#FFFFFF' : '#14213D'} />
      <rect x={u.x} y={u.y} width={u.w} height={u.h} fill={light ? '#5ED3DC' : '#0E9AA7'} />
    </svg>
  )
}

export function GoogleMark() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden>
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.7 29.2 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.4-.4-3.5z" />
      <path fill="#FF3D00" d="m6.3 14.7 6.6 4.8C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.2 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C37 39.2 44 34 44 24c0-1.3-.1-2.4-.4-3.5z" />
    </svg>
  )
}
