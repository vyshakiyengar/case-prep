// Chart-reading drill engine: random but realistic case exhibits, each with one
// auto-marked question (numeric or multiple choice) and a worked explanation.
import { n } from './speedMaths'

export type ChartSpec =
  | { kind: 'bar'; title: string; unit: string; labels: string[]; values: number[] }
  | { kind: 'line'; title: string; unit: string; labels: string[]; values: number[] }
  | { kind: 'stack'; title: string; unit: string; labels: string[]; series: { name: string; values: number[] }[] }
  | { kind: 'waterfall'; title: string; unit: string; start: [string, number]; steps: [string, number][]; end: [string, number]; hidden?: number }
  | { kind: 'mekko'; title: string; labels: string[]; revenue: number[]; margin: number[] }

export interface ChartQ {
  id: string
  family: 'Bar' | 'Line' | 'Stacked bar' | 'Waterfall' | 'Bar Mekko'
  context: string
  chart: ChartSpec
  q: string
  // numeric
  answer?: number
  unit?: string
  tol?: number // absolute tolerance in the answer's unit
  // multiple choice
  options?: string[]
  correct?: number
  show: string
  why: string
}

const rnd = () => Math.random()
const pick = <T,>(a: readonly T[]): T => a[Math.floor(rnd() * a.length)]
const int = (a: number, b: number) => Math.floor(a + rnd() * (b - a + 1))
const shuffle = <T,>(a: T[]) => [...a].sort(() => rnd() - 0.5)
const r1 = (x: number) => Math.round(x * 10) / 10
let seq = 0
const id = (k: string) => `${k}-${Date.now()}-${seq++}`
const sum = (a: number[]) => a.reduce((x, y) => x + y, 0)
const m = (x: number) => (x < 0 ? '−' : '') + n(Math.abs(x), 2)
const signedM = (x: number) => (x >= 0 ? '+' : '−') + '$' + n(Math.abs(x), 1) + 'M'

const COMPANIES = ['Harbor Foods', 'Nexa Cloud', 'Pinecrest Hotels', 'Orbit Telecom', 'Kestrel Logistics', 'Larkspur Pharma', 'Cobalt Retail', 'Meridian Banking', 'Tidewater Energy', 'Summit Fitness']
const REGIONS = ['North', 'South', 'East', 'West', 'Central']
const PRODUCTS = ['Core', 'Premium', 'Online', 'Wholesale', 'Services']
const YEARS = ['2020', '2021', '2022', '2023', '2024', '2025']

/** Mix one random question; pass a family to focus. */
export function makeChartQ(family?: ChartQ['family']): ChartQ {
  const fams: ChartQ['family'][] = ['Bar', 'Line', 'Stacked bar', 'Waterfall', 'Bar Mekko']
  const f = family ?? pick(fams)
  for (let tries = 0; tries < 50; tries++) {
    const q = GEN[f]()
    if (q) return q
  }
  return GEN.Bar()!
}

const GEN: Record<ChartQ['family'], () => ChartQ | null> = {
  Bar: () => {
    const co = pick(COMPANIES), labels = pick([REGIONS, PRODUCTS])
    const values = labels.map(() => int(6, 48) * 5)
    const total = sum(values)
    const title = `${co}: revenue by ${labels === REGIONS ? 'region' : 'product line'}, $M`
    const chart: ChartSpec = { kind: 'bar', title, unit: '$M', labels, values }
    const tb = rnd()
    if (tb < 0.25) {
      const avg = total / labels.length
      return { id: id('bar'), family: 'Bar', context: `${co} wants a simple benchmark for each ${labels === REGIONS ? 'region' : 'product line'}.`, chart,
        q: `What is the average revenue per ${labels === REGIONS ? 'region' : 'product line'}, in $M?`, answer: avg, unit: '$M', tol: 0.5, show: `$${n(avg, 1)}M`,
        why: `Total ÷ count = $${n(total)}M ÷ ${labels.length} = $${n(avg, 1)}M. Shortcut: ÷ 5 is × 2 ÷ 10.` }
    }
    if (tb < 0.6) {
      const i = int(0, labels.length - 1), share = (values[i] / total) * 100
      return { id: id('bar'), family: 'Bar', context: `${co} wants to know how dependent it is on one ${labels === REGIONS ? 'region' : 'product line'}.`, chart,
        q: `What share of total revenue comes from ${labels[i]}?`, answer: share, unit: '%', tol: 1, show: `${n(share, 1)}%`,
        why: `Total = ${values.map((v) => n(v)).join(' + ')} = $${n(total)}M. ${labels[i]}: ${n(values[i])} ÷ ${n(total)} = ${n(share, 1)}%.` }
    }
    const order = values.map((_, i) => i).sort((a, b) => values[b] - values[a])
    const [a, b] = [order[0], order[int(2, 4)]]
    if (values[a] === values[b]) return null
    const gap = (values[a] / values[b] - 1) * 100
    return { id: id('bar'), family: 'Bar', context: `${co} is comparing its biggest and a smaller ${labels === REGIONS ? 'region' : 'product line'}.`, chart,
      q: `By what percentage is ${labels[a]}'s revenue higher than ${labels[b]}'s?`, answer: gap, unit: '%', tol: Math.max(1.5, gap * 0.01), show: `${n(gap, 0)}%`,
      why: `Divide by the smaller one: ${n(values[a])} ÷ ${n(values[b])} = ${n(values[a] / values[b], 2)}, so ${n(gap, 0)}% higher.${values[b] !== 100 ? ` (Not ${n(values[a] - values[b])}%: that's the gap in $M.)` : ''}` }
  },
  Line: () => {
    const co = pick(COMPANIES)
    const start = int(8, 30) * 5
    const growth = YEARS.slice(1).map(() => pick([-6, -3, 2, 4, 6, 8, 10, 12, 15, 20, 25]))
    const values = [start]
    growth.forEach((g) => values.push(Math.round(values[values.length - 1] * (1 + g / 100))))
    const chart: ChartSpec = { kind: 'line', title: `${co}: revenue, $M`, unit: '$M', labels: YEARS, values }
    const t = rnd()
    if (t < 0.2) {
      const a = int(0, 2), b = a + int(2, 3), g = (values[b] / values[a] - 1) * 100
      return { id: id('line'), family: 'Line', context: `${co} is comparing two years for its annual report.`, chart,
        q: `By what percentage did revenue change from ${YEARS[a]} to ${YEARS[b]}?`, answer: g, unit: '%', tol: 1, show: `${g >= 0 ? '+' : '−'}${n(Math.abs(g), 1)}%`,
        why: `(${n(values[b])} − ${n(values[a])}) ÷ ${n(values[a])} = ${g >= 0 ? '' : '−'}${n(Math.abs(values[b] - values[a]))} ÷ ${n(values[a])} = ${g >= 0 ? '+' : '−'}${n(Math.abs(g), 1)}%. Always divide by the earlier year.` }
    }
    if (t < 0.5) {
      const yrs = YEARS.length - 1, c = ((values[yrs] / values[0]) ** (1 / yrs) - 1) * 100
      // Skip charts where dividing total growth by the years lands within the tolerance
      if (Math.abs(((values[yrs] / values[0] - 1) * 100) / yrs - c) <= 1) return null
      return { id: id('line'), family: 'Line', context: `The CEO says ${co} has "grown fast for five years".`, chart,
        q: `What is the compound annual growth rate (CAGR) from ${YEARS[0]} to ${YEARS[yrs]}?`, answer: c, unit: '%', tol: 1, show: `${c < 0 ? '−' : ''}${n(Math.abs(c), 1)}%`,
        why: `(${n(values[yrs])} ÷ ${n(values[0])})^(1/${yrs}) − 1 = ${n(values[yrs] / values[0], 3)}^(0.2) − 1 = ${c < 0 ? '−' : ''}${n(Math.abs(c), 1)}%. Quick check: ${yrs} years at ${n(r1(c), 1)}% compounds to about ×${n((1 + r1(c) / 100) ** yrs, 2)}, close to the ×${n(values[yrs] / values[0], 2)} on the chart.` }
    }
    const yoy = values.slice(1).map((v, i) => (v / values[i] - 1) * 100)
    const sorted = [...yoy].sort((a, b) => b - a)
    if (sorted[0] - sorted[1] < 3) return null
    const best = yoy.indexOf(sorted[0])
    // trap: the biggest $ jump is often a different year
    const jumps = values.slice(1).map((v, i) => v - values[i])
    const options = YEARS.slice(1)
    return { id: id('line'), family: 'Line', context: `${co}'s board asks which year was the strongest.`, chart,
      q: 'In which year was revenue growth (in %) the highest?', options, correct: best, show: YEARS[best + 1],
      why: `Year-on-year growth: ${options.map((y, i) => `${y} ${yoy[i] >= 0 ? '+' : '−'}${n(Math.abs(yoy[i]), 0)}%`).join(', ')}. ${jumps.indexOf(Math.max(...jumps)) !== best ? `The biggest jump in dollars was ${options[jumps.indexOf(Math.max(...jumps))]}, but on a bigger base, so a smaller %.` : 'Steepest line segment relative to its starting height.'}` }
  },
  'Stacked bar': () => {
    const co = pick(COMPANIES)
    const names = pick([['Stores', 'Online', 'Wholesale'], ['Consumer', 'Business', 'Public sector'], ['Europe', 'Americas', 'Asia']])
    const y1 = names.map(() => int(4, 20) * 5)
    const g = names.map(() => pick([-20, -10, 10, 20, 30, 50, 80, 100]))
    const y2 = y1.map((v, i) => Math.round(v * (1 + g[i] / 100)))
    const chart: ChartSpec = { kind: 'stack', title: `${co}: revenue by segment, $M`, unit: '$M', labels: ['2023', '2025'], series: names.map((s, i) => ({ name: s, values: [y1[i], y2[i]] })) }
    const add = y2.map((v, i) => v - y1[i]), pctG = y2.map((v, i) => (v / y1[i] - 1) * 100)
    const t = rnd()
    if (t < 0.2) {
      const g = (sum(y2) / sum(y1) - 1) * 100
      return { id: id('stack'), family: 'Stacked bar', context: `${co}'s CEO wants one number for growth.`, chart,
        q: 'By what percentage did total revenue change from 2023 to 2025?', answer: g, unit: '%', tol: 1, show: `${g >= 0 ? '+' : '−'}${n(Math.abs(g), 1)}%`,
        why: `Use the totals on top of the bars: ${sum(y2)} ÷ ${sum(y1)} − 1 = ${g >= 0 ? '+' : '−'}${n(Math.abs(g), 1)}%. Don't average the segments' growth rates: bigger segments count for more.` }
    }
    if (t < 0.45) {
      const i = int(0, 2), share = (y2[i] / sum(y2)) * 100
      return { id: id('stack'), family: 'Stacked bar', context: `${co} is updating its investor slide.`, chart,
        q: `What share of 2025 revenue comes from ${names[i]}?`, answer: share, unit: '%', tol: 1, show: `${n(share, 1)}%`,
        why: `2025 total = ${y2.join(' + ')} = $${sum(y2)}M. ${names[i]}: ${y2[i]} ÷ ${sum(y2)} = ${n(share, 1)}%.` }
    }
    const absMax = add.indexOf(Math.max(...add)), pctMax = pctG.indexOf(Math.max(...pctG))
    const s1 = [...add].sort((a, b) => b - a), s2 = [...pctG].sort((a, b) => b - a)
    if (t < 0.7) {
      if (s1[0] - s1[1] < 3 || s1[0] <= 0) return null
      return { id: id('stack'), family: 'Stacked bar', context: `${co} wants to know where its growth came from.`, chart,
        q: 'Which segment added the most revenue in dollars between 2023 and 2025?', options: names, correct: absMax, show: names[absMax],
        why: `Change in $M: ${names.map((s, i) => `${s} ${signedM(add[i])}`).join(', ')}.${absMax !== pctMax && s2[0] !== s2[1] ? ` ${names[pctMax]} grew fastest in %, but from a smaller base.` : ''}` }
    }
    if (s2[0] - s2[1] < 8 || s2[0] <= 0) return null
    return { id: id('stack'), family: 'Stacked bar', context: `${co} wants to know which segment is gaining momentum.`, chart,
      q: 'Which segment grew fastest in percentage terms?', options: names, correct: pctMax, show: names[pctMax],
      why: `Growth: ${names.map((s, i) => `${s} ${pctG[i] >= 0 ? '+' : '−'}${n(Math.abs(pctG[i]), 0)}%`).join(', ')}.${absMax !== pctMax && s1[0] !== s1[1] ? ` ${names[absMax]} added the most dollars, but that's a different question.` : ''}` }
  },
  Waterfall: () => {
    const co = pick(COMPANIES)
    const start = int(30, 90)
    const labels = shuffle(['Price', 'Volume', 'Mix', 'Input costs', 'Wages', 'FX', 'Efficiency']).slice(0, 4)
    const steps: [string, number][] = labels.map((l) => [l, pick([-14, -11, -9, -7, -5, -3, 3, 4, 6, 8, 10, 12])])
    const end = start + sum(steps.map((s) => s[1]))
    if (end <= 5) return null
    let run = start
    if (steps.some(([, v]) => (run += v) < 0)) return null
    const base: Omit<Extract<ChartSpec, { kind: 'waterfall' }>, 'hidden'> = { kind: 'waterfall', title: `${co}: operating profit bridge, 2024 to 2025, $M`, unit: '$M', start: ['2024', start], steps, end: ['2025', end] }
    const tw = rnd()
    if (tw < 0.25) {
      const g = (end / start - 1) * 100
      return { id: id('wf'), family: 'Waterfall', context: `${co}'s board wants the headline change in profit.`, chart: base,
        q: 'By what percentage did operating profit change from 2024 to 2025?', answer: g, unit: '%', tol: 1, show: `${g >= 0 ? '+' : '−'}${n(Math.abs(g), 1)}%`,
        why: `Only the first and last bars matter: (${end} − ${start}) ÷ ${start} = ${g >= 0 ? '+' : '−'}${n(Math.abs(g), 1)}%.` }
    }
    if (tw < 0.65) {
      const h = int(0, 3)
      return { id: id('wf'), family: 'Waterfall', context: `One bar of ${co}'s profit bridge was left blank in the draft.`, chart: { ...base, hidden: h },
        q: `What is the missing "${steps[h][0]}" bar, in $M?`, answer: steps[h][1], unit: '$M', tol: 0.01, show: signedM(steps[h][1]),
        why: `The bars must reconcile: ${end} − ${start} = ${m(end - start)} in total. The other bars add up to ${m(sum(steps.filter((_, i) => i !== h).map((s) => s[1])))}, so ${steps[h][0]} = ${m(end - start)} − (${m(sum(steps.filter((_, i) => i !== h).map((s) => s[1])))}) = ${signedM(steps[h][1])}.` }
    }
    const neg = steps.map((s, i) => ({ v: s[1], i })).filter((x) => x.v < 0).sort((a, b) => a.v - b.v)
    if (neg.length < 2 || neg[0].v === neg[1].v) return null
    return { id: id('wf'), family: 'Waterfall', context: `${co}'s CFO wants to focus on the biggest problem first.`, chart: base,
      q: 'Which driver reduced profit the most?', options: steps.map((s) => s[0]), correct: neg[0].i, show: steps[neg[0].i][0],
      why: `Orange bars take profit away: ${neg.map((x) => `${steps[x.i][0]} ${signedM(x.v)}`).join(', ')}. The biggest drag is ${steps[neg[0].i][0]}; net change ${signedM(end - start)}.` }
  },
  'Bar Mekko': () => {
    const co = pick(COMPANIES)
    const labels = shuffle([...PRODUCTS]).slice(0, 4)
    const revenue = labels.map(() => int(8, 30) * 10)
    const margin = labels.map(() => int(2, 14) * 2.5)
    const profit = revenue.map((r, i) => (r * margin[i]) / 100)
    const chart: ChartSpec = { kind: 'mekko', title: `${co}: revenue (width, $M) and operating margin (height, %) by business`, labels, revenue, margin }
    const sorted = [...profit].sort((a, b) => b - a)
    const tm = rnd()
    if (tm < 0.3) {
      const i = int(0, 3), sh = (profit[i] / sum(profit)) * 100
      return { id: id('mekko'), family: 'Bar Mekko', context: `${co} is checking how much it relies on one business for profit.`, chart,
        q: `What share of total operating profit comes from ${labels[i]}?`, answer: sh, unit: '%', tol: 1, show: `${n(sh, 1)}%`,
        why: `${labels[i]}: ${revenue[i]} × ${margin[i]}% = $${n(profit[i], 2)}M, out of $${n(sum(profit), 2)}M in total (${labels.map((_, k) => `$${n(profit[k], 2)}M`).join(' + ')}) = ${n(sh, 1)}%. Compare with its ${n((revenue[i] / sum(revenue)) * 100, 0)}% share of revenue.` }
    }
    if (tm < 0.65) {
      if (sorted[0] - sorted[1] < 2) return null
      const best = profit.indexOf(sorted[0])
      return { id: id('mekko'), family: 'Bar Mekko', context: `${co} is deciding which business to protect first.`, chart,
        q: 'Which business makes the most operating profit?', options: labels, correct: best, show: labels[best],
        why: `Profit = width × height: ${labels.map((l, i) => `${l} ${revenue[i]} × ${margin[i]}% = $${n(profit[i], 2)}M`).join('; ')}. The tallest bar is not always the biggest profit pool.` }
    }
    const tot = sum(profit)
    return { id: id('mekko'), family: 'Bar Mekko', context: `${co}'s CFO wants the group's total operating profit.`, chart,
      q: 'What is total operating profit across the four businesses, in $M?', answer: tot, unit: '$M', tol: Math.max(0.5, tot * 0.015), show: `$${n(tot, 2)}M`,
      why: `Sum of revenue × margin: ${labels.map((_, i) => `$${n(profit[i], 2)}M`).join(' + ')} = $${n(tot, 2)}M (a blended margin of ${n((tot / sum(revenue)) * 100, 1)}%).` }
  },
}

export const FAMILIES: ChartQ['family'][] = ['Bar', 'Line', 'Stacked bar', 'Waterfall', 'Bar Mekko']
export const roundForCheck = r1
