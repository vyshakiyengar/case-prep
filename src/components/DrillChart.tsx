import { useEffect, useRef, useState } from 'react'
import type { ChartSpec } from '../lib/chartDrills'
import { n } from '../lib/speedMaths'

// Validated categorical order (teal, burnt orange, blue, amber), fixed, never cycled.
const C = ['#0A8F9C', '#C2410C', '#3B5BDB', '#B7791F']
const INK = '#0F1B33', MUTED = '#5F6B7D', GRID = '#E6EAF0', AXIS = '#A7B0BF', NEG = '#C2410C', POS = '#0A8F9C'
let W = 640, H = 300, L = 44, R = 16, T = 20, B = 40, K = 1
let PW = W - L - R, PH = H - T - B
const f = (x: number) => String(x * K)
const font = 'IBM Plex Sans, system-ui, sans-serif'

function niceMax(v: number) {
  const p = 10 ** Math.floor(Math.log10(v)), f = v / p
  const step = [1, 1.2, 1.6, 2, 2.4, 3, 4, 5, 6, 8, 10].find((s) => f <= s) ?? 10
  return step * p
}
function Label({ x, y, text, size }: { x: number; y: number; text: string; size: number }) {
  const words = K > 1 && text.includes(' ') ? text.split(' ') : [text]
  return <text x={x} y={y} textAnchor="middle" fontSize={f(size)} fill={MUTED}>{words.map((w, i) => <tspan key={i} x={x} dy={i ? size * K * 1.1 : 0}>{w}</tspan>)}</text>
}
function Grid({ max, min = 0, fmt = (v: number) => n(v) }: { max: number; min?: number; fmt?: (v: number) => string }) {
  const ticks = [0, 1, 2, 3, 4].map((i) => min + ((max - min) * i) / 4)
  const y = (v: number) => T + PH - ((v - min) / (max - min)) * PH
  return <g>{ticks.map((t) => <g key={t}><line x1={L} x2={W - R} y1={y(t)} y2={y(t)} stroke={t === 0 ? AXIS : GRID} /><text x={L - 8} y={y(t) + 4} textAnchor="end" fontSize={f(11)} fill={MUTED}>{fmt(t)}</text></g>)}</g>
}
/** Bar with a 4px rounded data end and a square base on the baseline. */
function Bar({ x, y, w, h, fill, title }: { x: number; y: number; w: number; h: number; fill: string; title: string }) {
  const r = Math.min(4, Math.abs(h) / 2, w / 2)
  if (h <= 0) return null
  const d = `M${x},${y + h} V${y + r} Q${x},${y} ${x + r},${y} H${x + w - r} Q${x + w},${y} ${x + w},${y + r} V${y + h} Z`
  return <path d={d} fill={fill}><title>{title}</title></path>
}

export function DrillChart({ spec }: { spec: ChartSpec }) {
  const box = useRef<HTMLElement>(null)
  const [compact, setCompact] = useState(false)
  useEffect(() => {
    const el = box.current; if (!el) return
    const ro = new ResizeObserver(([e]) => setCompact(e.contentRect.width < 560)); ro.observe(el)
    return () => ro.disconnect()
  }, [])
  // Narrow screens: a narrower canvas with larger type, so labels stay readable
  if (compact) { W = 420; H = 300; L = 40; R = 8; T = 22; B = spec.kind === 'mekko' ? 52 : 46; K = 1.3 } else { W = 640; H = 300; L = 44; R = 16; T = 20; B = spec.kind === 'mekko' ? 44 : 40; K = 1 }
  PW = W - L - R; PH = H - T - B
  let body: JSX.Element
  let legend: { name: string; color: string }[] = []
  if (spec.kind === 'bar') {
    const max = niceMax(Math.max(...spec.values) * 1.12), k = spec.values.length, slot = PW / k, bw = Math.min(64, slot * 0.6)
    const y = (v: number) => T + PH - (v / max) * PH
    body = <g><Grid max={max} />{spec.values.map((v, i) => { const x = L + i * slot + (slot - bw) / 2; return <g key={i}>
      <Bar x={x} y={y(v)} w={bw} h={T + PH - y(v)} fill={C[0]} title={`${spec.labels[i]}: ${n(v)}`} />
      <text x={x + bw / 2} y={y(v) - 6} textAnchor="middle" fontSize={f(12.5)} fontWeight="500" fill={INK}>{n(v)}</text>
      <text x={x + bw / 2} y={H - B + 18} textAnchor="middle" fontSize={f(12)} fill={MUTED}>{spec.labels[i]}</text></g> })}</g>
  } else if (spec.kind === 'line') {
    const max = niceMax(Math.max(...spec.values) * 1.12), k = spec.values.length, X = (i: number) => L + 24 + (i * (PW - 48)) / (k - 1)
    const y = (v: number) => T + PH - (v / max) * PH
    body = <g><Grid max={max} />
      <polyline points={spec.values.map((v, i) => `${X(i)},${y(v)}`).join(' ')} fill="none" stroke={C[0]} strokeWidth="2" strokeLinejoin="round" />
      {spec.values.map((v, i) => <g key={i}><circle cx={X(i)} cy={y(v)} r="4.5" fill={C[0]} stroke="#fff" strokeWidth="2"><title>{`${spec.labels[i]}: ${n(v)}`}</title></circle>
        <text x={X(i)} y={y(v) - 10} textAnchor="middle" fontSize={f(12.5)} fontWeight="500" fill={INK}>{n(v)}</text>
        <text x={X(i)} y={H - B + 18} textAnchor="middle" fontSize={f(12)} fill={MUTED}>{spec.labels[i]}</text></g>)}</g>
  } else if (spec.kind === 'stack') {
    const totals = spec.labels.map((_, j) => spec.series.reduce((t, s) => t + s.values[j], 0))
    const max = niceMax(Math.max(...totals) * 1.12), slot = PW / spec.labels.length, bw = 120
    const sc = (v: number) => (v / max) * PH
    legend = spec.series.map((s, i) => ({ name: s.name, color: C[i] }))
    body = <g><Grid max={max} />{spec.labels.map((lab, j) => {
      const x = L + j * slot + (slot - bw) / 2; let acc = 0
      return <g key={j}>{spec.series.map((s, i) => { const h = sc(s.values[j]); const y0 = T + PH - acc - h; acc += h; return <g key={i}>
        <rect x={x} y={y0 + (i === spec.series.length - 1 ? 0 : 1)} width={bw} height={Math.max(0, h - 2)} rx={i === spec.series.length - 1 ? 4 : 0} fill={C[i]}><title>{`${s.name}, ${lab}: ${n(s.values[j])}`}</title></rect>
        {h > 16 && <text x={x + bw / 2} y={y0 + h / 2 + 4} textAnchor="middle" fontSize={f(12)} fontWeight="500" fill="#fff">{n(s.values[j])}</text>}
        {h <= 16 && <text x={x + bw + 6} y={y0 + h / 2 + 4} fontSize={f(11.5)} fill={INK}>{n(s.values[j])}</text>}</g> })}
        <text x={x + bw / 2} y={T + PH - acc - 7} textAnchor="middle" fontSize={f(12.5)} fontWeight="600" fill={INK}>{n(totals[j])}</text>
        <text x={x + bw / 2} y={H - B + 18} textAnchor="middle" fontSize={f(12)} fill={MUTED}>{lab}</text></g>
    })}</g>
  } else if (spec.kind === 'waterfall') {
    const pts = [spec.start, ...spec.steps, spec.end]
    let run = spec.start[1], peak = run
    spec.steps.forEach(([, v]) => { run += v; peak = Math.max(peak, run) })
    const max = niceMax(Math.max(peak, spec.end[1]) * 1.15), slot = PW / pts.length, bw = Math.min(58, slot * 0.62)
    const y = (v: number) => T + PH - (v / max) * PH
    let cur = spec.start[1]
    legend = [{ name: 'Adds to profit', color: POS }, { name: 'Reduces profit', color: NEG }]
    body = <g><Grid max={max} />{pts.map(([lab, v], i) => {
      const x = L + i * slot + (slot - bw) / 2
      const total = i === 0 || i === pts.length - 1
      let top: number, bot: number, fill: string
      if (total) { top = v; bot = 0; fill = INK } else { const nx = cur + v; top = Math.max(cur, nx); bot = Math.min(cur, nx); fill = v >= 0 ? POS : NEG; cur = nx }
      const hidden = !total && spec.hidden === i - 1
      const label = total ? n(v) : hidden ? '?' : (v >= 0 ? '+' : '−') + n(Math.abs(v))
      return <g key={i}>
        {hidden
          ? <rect x={x} y={y(top)} width={bw} height={Math.max(2, y(bot) - y(top))} fill="#fff" stroke={MUTED} strokeDasharray="4 3" strokeWidth="1.5" rx="2" />
          : <rect x={x} y={y(top)} width={bw} height={Math.max(2, y(bot) - y(top))} fill={fill} rx="2"><title>{`${lab}: ${label}`}</title></rect>}
        {i < pts.length - 1 && <line x1={x + bw} x2={x + slot} y1={y(i === 0 ? v : cur)} y2={y(i === 0 ? v : cur)} stroke={AXIS} strokeDasharray="2 2" />}
        <text x={x + bw / 2} y={y(top) - 6} textAnchor="middle" fontSize={f(12.5)} fontWeight={hidden ? 700 : 500} fill={INK}>{label}</text>
        <Label x={x + bw / 2} y={H - B + 16} text={lab} size={11.5} /></g>
    })}</g>
  } else {
    const totalRev = spec.revenue.reduce((a, b) => a + b, 0), max = niceMax(Math.max(...spec.margin) * 1.15)
    const y = (v: number) => T + PH - (v / max) * PH
    let off = L
    legend = spec.labels.map((l, i) => ({ name: `${l}: $${n(spec.revenue[i])}M revenue`, color: C[i] }))
    const fits = (txt: string, w: number) => txt.length * 6.4 * K < w - 4
    body = <g><Grid max={max} fmt={(v) => `${n(v)}%`} />{spec.labels.map((lab, i) => {
      const w = (spec.revenue[i] / totalRev) * PW, x = off; off += w
      return <g key={i}>
        <Bar x={x + 1} y={y(spec.margin[i])} w={w - 2} h={T + PH - y(spec.margin[i])} fill={C[i]} title={`${lab}: revenue $${n(spec.revenue[i])}M, margin ${n(spec.margin[i])}%`} />
        <text x={x + w / 2} y={y(spec.margin[i]) - 6} textAnchor="middle" fontSize={f(12.5)} fontWeight="500" fill={INK}>{n(spec.margin[i])}%</text>
        {fits(lab, w) && <text x={x + w / 2} y={H - B + 16 * K} textAnchor="middle" fontSize={f(12)} fill={INK}>{lab}</text>}
        {fits(`$${n(spec.revenue[i])}M`, w) && <text x={x + w / 2} y={H - B + 31 * K} textAnchor="middle" fontSize={f(11)} fill={MUTED}>${n(spec.revenue[i])}M</text>}</g>
    })}</g>
  }
  return (
    <figure ref={box} className="m-0">
      <figcaption className="mb-2 text-[14px] font-semibold text-ink">{spec.title}</figcaption>
      {legend.length > 0 && <div className="mb-1 flex flex-wrap gap-x-4 gap-y-1 text-[12.5px] text-ink-2">{legend.map((l) => <span key={l.name} className="inline-flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ background: l.color }} />{l.name}</span>)}</div>}
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full" role="img" aria-label={spec.title} style={{ fontFamily: font }} key={compact ? 'c' : 'w'}>{body}</svg>
    </figure>
  )
}
