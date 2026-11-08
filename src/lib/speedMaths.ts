// Speed maths engine: generates case-style mental maths questions with exact answers,
// a unit to answer in, a marking tolerance and the quickest method.

export type Skill =
  | 'percent' | 'change' | 'multiply' | 'divide' | 'fractions' | 'margin'
  | 'breakeven' | 'growth' | 'mix' | 'sizing' | 'value' | 'payback'
export type Level = 1 | 2 | 3

export const SKILLS: { key: Skill; label: string; blurb: string }[] = [
  { key: 'percent', label: 'Percentages', blurb: '35% of 1,240' },
  { key: 'change', label: 'Percentage change', blurb: 'From 80 to 92' },
  { key: 'multiply', label: 'Big multiplication', blurb: '2.5M × 40' },
  { key: 'divide', label: 'Big division', blurb: '$96M ÷ 1.2M' },
  { key: 'fractions', label: 'Fractions to %', blurb: '3/8 = ?' },
  { key: 'margin', label: 'Margin and markup', blurb: 'Cost 60, price 80' },
  { key: 'breakeven', label: 'Breakeven', blurb: 'Fixed ÷ contribution' },
  { key: 'growth', label: 'Growth and CAGR', blurb: 'Compounding, doubling' },
  { key: 'mix', label: 'Weighted averages', blurb: 'Blended margins' },
  { key: 'sizing', label: 'Market sizing chains', blurb: 'People × % × $' },
  { key: 'value', label: 'Valuation', blurb: 'Perpetuities, PV' },
  { key: 'payback', label: 'Payback', blurb: 'Years to earn it back' },
]
export const LEVELS: { key: Level; label: string; blurb: string }[] = [
  { key: 1, label: 'Easy', blurb: 'Round numbers' },
  { key: 2, label: 'Medium', blurb: 'Typical case numbers' },
  { key: 3, label: 'Hard', blurb: 'Decimals and longer chains' },
]

export interface Unit { label: string; scale: number; pct?: boolean }
const U = {
  none: { label: '', scale: 1 },
  pct: { label: '%', scale: 1, pct: true },
  usd: { label: '$', scale: 1 },
  usdK: { label: '$k', scale: 1e3 },
  usdM: { label: '$M', scale: 1e6 },
  usdB: { label: '$B', scale: 1e9 },
  k: { label: 'thousand', scale: 1e3 },
  M: { label: 'million', scale: 1e6 },
  B: { label: 'billion', scale: 1e9 },
  units: { label: 'units', scale: 1 },
  years: { label: 'years', scale: 1 },
  months: { label: 'months', scale: 1 },
} satisfies Record<string, Unit>

export interface SpeedQ {
  id: string
  skill: Skill
  level: Level
  q: string
  answer: number // in the question's unit
  unit: Unit
  tol: { rel?: number; abs?: number }
  show: string // the answer, formatted for display
  method: string
}

// ---------- helpers
const rnd = () => Math.random()
const pick = <T,>(a: readonly T[]): T => a[Math.floor(rnd() * a.length)]
const round = (x: number, dp = 2) => Math.round(x * 10 ** dp) / 10 ** dp
/** Plain number with thousands separators and up to `dp` decimals. */
export const n = (x: number, dp = 2) => round(x, dp).toLocaleString('en-US', { maximumFractionDigits: dp })
/** Short form: 1.2M, 450k, 3.5B. */
export const short = (x: number, dp = 2): string => {
  const a = Math.abs(x)
  if (a >= 1e9) return `${n(x / 1e9, dp)}B`
  if (a >= 1e6) return `${n(x / 1e6, dp)}M`
  if (a >= 1e4) return `${n(x / 1e3, dp)}k`
  return n(x, dp)
}
const money = (x: number, dp = 2) => (x < 0 ? '−$' : '$') + short(Math.abs(x), dp)
const pctS = (x: number, dp = 1) => `${x > 0 ? '' : x < 0 ? '−' : ''}${n(Math.abs(x), dp)}%`
const signed = (x: number, dp = 1) => (x > 0 ? '+' : x < 0 ? '−' : '') + n(Math.abs(x), dp) + '%'
let seq = 0
const mk = (skill: Skill, level: Level, q: string, answer: number, unit: Unit, show: string, method: string, tol: SpeedQ['tol'] = { rel: 0.005 }): SpeedQ =>
  ({ id: `${skill}-${Date.now()}-${seq++}`, skill, level, q, answer, unit, tol, show, method })

// ---------- generators, one per skill; each handles three levels
type Gen = (l: Level) => SpeedQ
const G: Record<Skill, Gen> = {
  percent: (l) => {
    const p = l === 1 ? pick([5, 10, 20, 25, 50, 15]) : l === 2 ? pick([12, 15, 35, 45, 8, 18, 65, 85]) : pick([2.5, 7.5, 12.5, 17.5, 37.5, 62.5, 0.5])
    const base = l === 1 ? pick([40, 60, 80, 120, 240, 360, 480, 800]) : l === 2 ? pick([240, 340, 480, 620, 1200, 1240, 4500, 860]) : pick([1.2e6, 3.6e6, 840e3, 4.8e6, 16e6, 2.4e9])
    const a = (p * base) / 100
    const unit = l === 3 ? (base >= 1e9 ? U.M : U.k) : U.none
    const tens = p >= 10 ? `10% is ${short(base / 10)}` : `1% is ${short(base / 100)}`
    return mk('percent', l, `What is ${p}% of ${l === 3 ? short(base) : n(base)}?`, a / unit.scale, unit, short(a),
      `Build it from easy pieces: ${tens}, then scale to ${p}%.`)
  },
  change: (l) => {
    if (l >= 2 && rnd() < 0.4) {
      // reverse: find the base
      const c = pick(l === 2 ? [20, 25, 50, -20, -25, 10] : [12.5, 15, 60, -12.5, -40, 30])
      const before = pick([80, 120, 160, 240, 320, 400, 480, 640])
      const after = before * (1 + c / 100)
      return mk('change', l, `After a ${n(Math.abs(c), 1)}% ${c > 0 ? 'rise' : 'fall'}, sales are ${n(after)}. What were they before?`, before, U.none, n(before),
        `Divide by the growth factor: ${n(after)} ÷ ${n(1 + c / 100, 3)} = ${n(before)}.`)
    }
    const c = l === 1 ? pick([10, 20, 25, 50, -10, -20, -50, 100]) : l === 2 ? pick([15, 30, 40, 60, -15, -30, -40, 75]) : pick([12.5, 37.5, -12.5, -37.5, 62.5, 6.25, 87.5])
    const a = pick([40, 80, 120, 160, 200, 240, 320, 400, 480, 640, 800])
    const b = a * (1 + c / 100)
    return mk('change', l, `Sales go from ${n(a)} to ${n(b)}. What's the percentage change?`, c, U.pct, signed(c),
      `(new − old) ÷ old = ${b < a ? "−" : ""}${n(Math.abs(b - a))} ÷ ${n(a)} = ${signed(c)}.`, { abs: 0.1 })
  },
  multiply: (l) => {
    let a: number, b: number
    if (l === 1) { a = pick([3, 4, 6, 8, 12, 25]) * pick([10, 100, 1000]); b = pick([20, 30, 40, 50, 200, 300]) }
    else if (l === 2) { a = pick([1.2, 1.5, 2.5, 3.2, 4.5, 0.8]) * 1e6; b = pick([40, 60, 120, 250, 350, 15]) }
    else { a = pick([1.8, 2.4, 3.6, 4.2, 0.35, 6.4]) * 1e6; b = pick([0.15, 0.25, 1.25, 12, 45, 0.075]) * pick([1, 10]) }
    const r = a * b
    const unit = r >= 1e9 ? U.B : r >= 1e6 ? U.M : r >= 1e4 ? U.k : U.none
    return mk('multiply', l, `${short(a)} × ${short(b)} = ?`, r / unit.scale, unit, short(r),
      `Multiply the digits, then count the zeros: write both as a number × a power of ten.`)
  },
  divide: (l) => {
    let per: number, count: number
    if (l === 1) { per = pick([20, 40, 50, 60, 80, 120]); count = pick([2, 4, 5, 8]) * 1000 }
    else if (l === 2) { per = pick([80, 150, 250, 400, 1200, 75]); count = pick([1.2, 1.6, 2, 2.4, 3.2, 0.8]) * 1e6 }
    else { per = pick([12000, 2400, 350, 4500, 65]); count = pick([350e3, 1.4e6, 28e6, 72e3, 4.5e6]) }
    const total = per * count
    return mk('divide', l, `${money(total)} of revenue from ${short(count)} customers. Revenue per customer?`, per, U.usd, money(per),
      `Cancel the zeros first: ${short(total)} ÷ ${short(count)}.`)
  },
  fractions: (l) => {
    const pool: [number, number][] = l === 1 ? [[1, 4], [3, 4], [1, 5], [2, 5], [1, 8], [3, 8], [5, 8], [7, 8], [1, 20]]
      : l === 2 ? [[1, 3], [2, 3], [1, 6], [5, 6], [1, 9], [2, 9], [1, 12], [3, 16], [1, 40]]
        : [[1, 7], [2, 7], [3, 7], [1, 11], [2, 11], [5, 12], [7, 12], [1, 15], [4, 9]]
    const [a, b] = pick(pool)
    const v = (a / b) * 100
    const anchor = b % 7 === 0 ? '1/7 ≈ 14.3%' : b % 11 === 0 ? '1/11 ≈ 9.1%' : b % 9 === 0 ? '1/9 ≈ 11.1%' : b % 3 === 0 ? '1/3 ≈ 33.3%, 1/6 ≈ 16.7%' : '1/8 = 12.5%'
    return mk('fractions', l, `${a}/${b} as a percentage?`, v, U.pct, pctS(v, 1), `Know the anchors (${anchor}) and multiply up.`, { abs: 0.15 })
  },
  margin: (l) => {
    if (l === 1) {
      const price = pick([20, 40, 50, 80, 100, 200]); const m = pick([10, 20, 25, 40, 50, 60]); const cost = price * (1 - m / 100)
      return mk('margin', l, `Price $${n(price)}, cost $${n(cost)}. Gross margin?`, m, U.pct, `${m}%`, `Margin = (price − cost) ÷ price = ${n(price - cost)} ÷ ${n(price)}.`, { abs: 0.1 })
    }
    if (l === 2) {
      const mk2 = pick([25, 50, 100, 20, 60, 150]); const m = (mk2 / (100 + mk2)) * 100
      return mk('margin', l, `A ${mk2}% markup on cost is what margin on price?`, m, U.pct, pctS(m, 1),
        `Margin = markup ÷ (1 + markup) = ${mk2 / 100} ÷ ${n(1 + mk2 / 100)}.`, { abs: 0.2 })
    }
    const cost = pick([30, 42, 60, 72, 90, 120]); const m = pick([25, 40, 60, 70, 20]); const price = cost / (1 - m / 100)
    return mk('margin', l, `Unit cost is $${cost}. What price gives a ${m}% gross margin?`, price, U.usd, `$${n(price)}`,
      `Price = cost ÷ (1 − margin) = ${cost} ÷ ${n(1 - m / 100)}.`)
  },
  breakeven: (l) => {
    const p = pick([20, 25, 40, 50, 80, 120]); const v = pick([0.4, 0.5, 0.6, 0.75]) * p; const c = p - v
    if (l === 3) {
      const units = pick([100, 150, 200, 250, 400]) * 1000; const market = units / pick([0.05, 0.08, 0.1, 0.125, 0.2, 0.25])
      const fixed = c * units; const share = (units / market) * 100
      return mk('breakeven', l, `Fixed costs ${money(fixed)}, price $${p}, variable cost $${n(v)}. The market is ${short(market)} units a year. What market share is needed to break even?`,
        share, U.pct, pctS(share, 1), `Breakeven units = ${money(fixed)} ÷ $${n(c)} = ${short(units)}; ÷ ${short(market)} market.`, { abs: 0.2 })
    }
    const units = (l === 1 ? pick([10, 20, 40, 50]) : pick([120, 150, 240, 360, 450])) * 1000
    const fixed = c * units
    return mk('breakeven', l, `Fixed costs ${money(fixed)}, price $${p}, variable cost $${n(v)} per unit. Breakeven volume?`, units / 1e3, U.k, `${short(units)} units`,
      `Fixed costs ÷ contribution per unit = ${money(fixed)} ÷ $${n(c)}.`)
  },
  growth: (l) => {
    if (l === 1) {
      const r = pick([4, 6, 8, 9, 12, 18]); const exact = Math.log(2) / Math.log(1 + r / 100)
      return mk('growth', l, `Revenue grows ${r}% a year. Roughly how many years to double?`, exact, U.years, `about ${n(72 / r, 1)} years`,
        `Rule of 72: 72 ÷ ${r} ≈ ${n(72 / r, 1)}. (Exact: ${n(exact, 1)}.)`, { abs: 0.6 })
    }
    if (l === 2) {
      const base = pick([100, 200, 400, 50]); const r = pick([10, 20, 5, 15]); const y = pick([2, 3]); const v = base * (1 + r / 100) ** y
      return mk('growth', l, `${n(base)} grows ${r}% a year for ${y} years. Value at the end?`, v, U.none, n(v, 1),
        `Compound, don't add: ${n(base)} × ${n(1 + r / 100)}^${y}.`, { rel: 0.01 })
    }
    const [a, b, y] = pick([[50, 80, 4], [100, 150, 3], [40, 100, 5], [200, 300, 4], [60, 90, 2], [100, 200, 6]] as [number, number, number][])
    const cagr = ((b / a) ** (1 / y) - 1) * 100
    return mk('growth', l, `Sales grew from $${a}M to $${b}M over ${y} years. CAGR?`, cagr, U.pct, pctS(cagr, 1),
      `CAGR = (end ÷ start)^(1/years) − 1 = ${n(b / a, 2)}^(1/${y}) − 1. Check by compounding back.`, { abs: 0.5 })
  },
  mix: (l) => {
    if (l === 1) {
      const s = pick([60, 70, 75, 80, 50]); const a = pick([20, 30, 40]); const b = pick([10, 5, 15, 50])
      const v = (s * a + (100 - s) * b) / 100
      return mk('mix', l, `${s}% of sales earn a ${a}% margin, the rest earn ${b}%. Blended margin?`, v, U.pct, pctS(v, 1),
        `Weight each margin by its share: ${s / 100} × ${a} + ${n(1 - s / 100)} × ${b}.`, { abs: 0.1 })
    }
    if (l === 2) {
      const sh = pick([[50, 30, 20], [40, 40, 20], [60, 25, 15], [30, 50, 20]]); const m = pick([[10, 20, 40], [30, 15, 5], [25, 40, 10]])
      const v = sh.reduce((t, s, i) => t + (s * m[i]) / 100, 0)
      return mk('mix', l, `Three products: shares ${sh.join('% / ')}%, margins ${m.join('% / ')}%. Blended margin?`, v, U.pct, pctS(v, 1),
        `Sum of share × margin: ${sh.map((s, i) => `${s / 100}×${m[i]}`).join(' + ')}.`, { abs: 0.1 })
    }
    const a = pick([10, 15, 20]); const b = pick([35, 40, 50]); const t = pick([20, 25, 30].filter((x) => x > a && x < b))
    const s = ((t - a) / (b - a)) * 100
    return mk('mix', l, `Core products earn ${a}% margin, new products ${b}%. What share of sales must be new products to reach a ${t}% blended margin?`, s, U.pct, pctS(s, 1),
      `Share = (target − core) ÷ (new − core) = ${t - a} ÷ ${b - a}.`, { abs: 0.5 })
  },
  sizing: (l) => {
    if (l === 1) {
      const pop = pick([20, 40, 60, 80]) * 1e6; const pen = pick([10, 20, 25, 50]); const spend = pick([20, 40, 50, 100, 120])
      const v = (pop * pen) / 100 * spend
      return mk('sizing', l, `${short(pop)} people, ${pen}% buy, each spends $${spend} a year. Market size?`, v / 1e6, U.usdM, money(v),
        `${short(pop)} × ${pen}% = ${short((pop * pen) / 100)} buyers × $${spend}.`)
    }
    const hh = pick([25, 30, 40, 50, 120]) * 1e6; const pen = pick([20, 30, 40, 60]); const freq = pick([2, 4, 6, 12]); const price = pick([15, 25, 30, 50, 8])
    let v = hh * (pen / 100) * freq * price
    let q = `${short(hh)} households, ${pen}% use the product, ${freq} purchases a year at $${price}. Market size?`
    let method = `${short(hh)} × ${pen}% × ${freq} × $${price}: do the easy multiplications first.`
    if (l === 3) {
      const share = pick([5, 10, 15, 20, 25]); v = v * share / 100
      q = `${short(hh)} households, ${pen}% use the product, ${freq} purchases a year at $${price}. Our share is ${share}%. Our revenue?`
      method = `Market = ${money(hh * (pen / 100) * freq * price)}, × ${share}% share.`
    }
    const unit = v >= 1e9 ? U.usdB : U.usdM
    return mk('sizing', l, q, v / unit.scale, unit, money(v), method)
  },
  value: (l) => {
    if (l === 1) {
      const cf = pick([2, 3, 4, 5, 6, 8]); const r = pick([5, 8, 10, 20])
      return mk('value', l, `$${cf}M a year forever, discount rate ${r}%. Present value?`, cf / (r / 100), U.usdM, money((cf * 1e6) / (r / 100)), `Perpetuity = cash flow ÷ rate = ${cf} ÷ ${r / 100}.`)
    }
    if (l === 2) {
      const cf = pick([3, 4, 5, 6, 9]); const [r, g] = pick([[10, 2], [10, 4], [8, 3], [12, 2], [9, 3]])
      return mk('value', l, `Cash flow next year $${cf}M, growing ${g}% a year forever. Discount rate ${r}%. Value?`, cf / ((r - g) / 100), U.usdM, money((cf * 1e6) / ((r - g) / 100)),
        `Growing perpetuity = cash flow ÷ (rate − growth) = ${cf} ÷ ${n((r - g) / 100)}.`)
    }
    const amt = pick([1, 2, 5, 10]); const r = pick([5, 10, 20]); const y = pick([1, 2, 3]); const v = amt / (1 + r / 100) ** y
    return mk('value', l, `What is $${amt}M received in ${y} year${y > 1 ? 's' : ''} worth today at ${r}%?`, v, U.usdM, `$${n(v, 2)}M`,
      `Divide by (1 + rate)^years: ${amt} ÷ ${n(1 + r / 100)}^${y}.`, { rel: 0.01 })
  },
  payback: (l) => {
    if (l === 1) {
      const save = pick([100, 200, 250, 400, 500]) * 1e3; const y = pick([2, 3, 4, 5])
      return mk('payback', l, `An investment of ${money(save * y)} saves ${money(save)} a year. Payback?`, y, U.years, `${y} years`, `Investment ÷ annual saving.`, { abs: 0.05 })
    }
    if (l === 2) {
      const per = pick([20, 25, 40, 50]) * 1e3; const m = pick([8, 10, 12, 15, 18, 24])
      return mk('payback', l, `A ${money(per * m)} system saves ${money(per)} a month. Payback in months?`, m, U.months, `${m} months`, `${money(per * m)} ÷ ${money(per)}.`, { abs: 0.05 })
    }
    const gross = pick([1.1, 1.5, 0.9, 2.2]); const run = pick([0.3, 0.5, 0.1, 0.2]); const y = pick([2, 3, 4, 2.5])
    const inv = (gross - run) * y
    return mk('payback', l, `Invest $${n(inv, 2)}M. It saves $${gross}M a year but costs $${run}M a year to run. Payback?`, y, U.years, `${n(y, 1)} years`,
      `Use the net saving: $${gross}M − $${run}M = $${n(gross - run, 2)}M; $${n(inv, 2)}M ÷ that.`, { abs: 0.05 })
  },
}

export function makeQuestion(skills: Skill[], level: Level, weights?: Partial<Record<Skill, number>>): SpeedQ {
  const pool = skills.length ? skills : SKILLS.map((s) => s.key)
  const w = pool.map((s) => Math.max(0.2, weights?.[s] ?? 1))
  let t = rnd() * w.reduce((a, b) => a + b, 0)
  let skill = pool[0]
  for (let i = 0; i < pool.length; i++) { t -= w[i]; if (t <= 0) { skill = pool[i]; break } }
  return G[skill](level)
}

// ---------- marking
const SUFFIX: [RegExp, number][] = [
  [/(bn|billion|b)$/, 1e9], [/(mn|million|mm|m)$/, 1e6], [/(thousand|k)$/, 1e3],
]
/** Parse "1.2M", "$1,200,000", "37.5%", "2.5x", "4 years". Returns the value in the question's unit. */
export function parseAnswer(raw: string, unit: Unit): number | null {
  let s = raw.trim().toLowerCase().replace(/[,\s$£€]/g, '').replace(/[−–]/g, '-')
  s = s.replace(/(years?|yrs?|months?|mths?|units?|x|×|times)$/, '')
  const isPct = s.endsWith('%')
  if (isPct) s = s.slice(0, -1)
  let mult = 0
  for (const [re, m] of SUFFIX) { if (re.test(s)) { s = s.replace(re, ''); mult = m; break } }
  if (!/^-?\d*\.?\d+$/.test(s) && !/^-?\d+\.$/.test(s)) return null
  const v = parseFloat(s)
  if (!Number.isFinite(v)) return null
  if (mult) return (v * mult) / unit.scale
  return v
}

export function isCorrect(q: SpeedQ, raw: string): boolean {
  const v = parseAnswer(raw, q.unit)
  if (v === null) return false
  const ok = (x: number) => {
    const d = Math.abs(x - q.answer)
    if (q.tol.abs !== undefined && d <= q.tol.abs + 1e-9) return true
    if (q.tol.rel !== undefined && d <= Math.abs(q.answer) * q.tol.rel + 1e-9) return true
    return d < 1e-9
  }
  if (ok(v)) return true
  // "0.375" for 37.5% is fine too
  if (q.unit.pct && Math.abs(v) <= 1.5 && !raw.includes('%') && ok(v * 100)) return true
  return false
}

/** What to show next to the input, e.g. "$M" or "%". */
export const unitHint = (u: Unit) => u.label
