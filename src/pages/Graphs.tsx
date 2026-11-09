import { ArtGraphs } from '../components/Art'
import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Button, PageHeader, inputCls } from '../components/ui'

type Family = 'Marimekko' | 'Bar Mekko' | 'Waterfall' | 'Bubble' | 'Bar' | 'Bar + Line' | 'Line' | 'Scatter'
type Exercise = { id: string; family: Family; title: string; context: string; difficulty: string; question: string; answer: string; followUp: string; index: number; values: number[]; second?: number[]; third?: number[]; fourth?: number[]; fifth?: number[]; labels: string[] }
const FAMILIES: Family[] = ['Marimekko', 'Bar Mekko', 'Waterfall', 'Bubble', 'Bar', 'Bar + Line', 'Line', 'Scatter']
const BUSINESSES = [
  ['Orion Clinics', 'outpatient healthcare'], ['Coastal Retail', 'home goods'],
  ['Nexa Cloud', 'business software'], ['BrightGrid', 'renewable energy'],
  ['MetroMove', 'urban transport'], ['Pine Foods', 'packaged food'],
  ['Harbor Hotels', 'hospitality'], ['Atlas Learning', 'education technology'],
]
const fmt = (x: number) => Math.round(x * 10) / 10
const maxIndex = (values: number[]) => values.indexOf(Math.max(...values))
const SERIES = ['Core', 'Premium', 'New ventures']
const FAMILY_GUIDES: Record<Family, { meaning: string; caution: string }> = {
  'Marimekko': { meaning: 'The width of each column shows the size of a customer group. The coloured height shows the percentage split. The area of a coloured block shows its absolute value.', caution: 'A high percentage in a small group may be worth less than a modest percentage in a large group.' },
  'Bar Mekko': { meaning: 'A bar has two dimensions: width is revenue and height is operating margin. Its area represents total operating profit.', caution: 'The tallest bar is not necessarily the most profitable overall. Multiply revenue by margin.' },
  'Waterfall': { meaning: 'Start with an opening value, add positive changes, subtract negative changes, and finish at the closing value.', caution: 'Check whether movements are amounts or percentages, and make sure the steps reconcile to the ending value.' },
  'Bubble': { meaning: 'The left-to-right position is one measure, the up-and-down position is a second, and each bubble’s area represents a third.', caution: 'Bubble area, not radius, represents size. A visually large bubble can hide weak economics.' },
  'Bar': { meaning: 'The length of each bar shows the value for one category. Compare the highest, lowest and differences between them.', caution: 'Check the units and whether the vertical axis starts at zero before making comparisons.' },
  'Bar + Line': { meaning: 'Bars show one measure and the line shows another, often on a separate scale. Use both values to calculate a useful business outcome.', caution: 'Do not compare the line height directly with bar height when the chart has two different axes.' },
  'Line': { meaning: 'Lines show how a measure changes over time. Compare the direction, speed of change and any turning points.', caution: 'Indexed growth does not reveal the largest business in absolute currency terms.' },
  'Scatter': { meaning: 'Each dot shows one observation on two measurements. Look for a relationship, clusters, exceptions and outliers.', caution: 'Correlation is not proof that one variable caused the other.' },
}
const QUARTERS = ['Q1 Y1', 'Q2 Y1', 'Q3 Y1', 'Q4 Y1', 'Q1 Y2', 'Q2 Y2']
function makeExercises(): Exercise[] {
  const out: Exercise[] = []
  BUSINESSES.forEach(([company, sector], i) => {
    FAMILIES.forEach((family, f) => {
      const base = { id: family.toLowerCase().replace(/[^a-z]+/g, '-') + '-' + (i + 1), family, title: company + ' · ' + family + ' interpretation', context: 'A fictional ' + sector + ' business. All figures are synthetic and created for practice.', difficulty: i < 3 ? 'Beginner' : i < 6 ? 'Intermediate' : 'Advanced', index: i }
      if (f === 0) {
        const values = [90 + 12 * i, 135 + 9 * i, 210 + 8 * i, 165 + 11 * i]
        const second = [25 + i, 41 - i, 32 + i % 3, 30 + i]
        const third = [35, 25, 40, 30]
        const calc = values.map((v, j) => v * second[j] / 100), win = maxIndex(calc), tall = maxIndex(second)
        const labels = ['Individuals', 'Families', 'Corporate clients', 'Public sector']
        out.push({ ...base, values, second, third, labels, question: 'Which customer group produces the most direct-channel revenue? Is it the group with the highest direct share?', answer: labels[win] + ' leads: ' + values[win] + ' × ' + second[win] + '% ≈ $' + fmt(calc[win]) + 'M. ' + (tall !== win ? labels[tall] + ' has the highest direct share (' + second[tall] + '%) but is a smaller group, so it produces only $' + fmt(calc[tall]) + 'M. ' : 'It also has the highest direct share, so here height and area agree. ') + 'In a Marimekko chart, the area of each rectangle shows the amount, not its height alone.', followUp: 'Check profit margin by customer group before choosing where to invest.' })
      } else if (f === 1) {
        const values = [2.1 + .1 * i, 1.2 + .15 * i, 1.6 + .09 * i, 2.3 + .05 * i, 1.1 + .12 * i].map((x) => Math.round(x * 100) / 100)
        const second = [12 + i, 26 + i % 3, 20 + i % 4, 18 + i % 4, 32 - i]
        const calc = values.map((v, j) => v * second[j] / 100), win = maxIndex(calc)
        const labels = ['Core', 'Premium', 'Digital', 'Managed', 'Custom']
        out.push({ ...base, values, second, labels, question: 'Which service line creates the largest operating profit, considering both its size and margin?', answer: labels[win] + ' creates about $' + Math.round(calc[win] * 1000) + 'M in operating profit ($' + values[win] + 'B revenue × ' + second[win] + '% margin). Width measures revenue; height measures margin.', followUp: 'Ask how reliably each service line can sustain its margin and growth.' })
      } else if (f === 2) {
        const start = 80 + i * 11, changes = [14 + i, -10 - i * 3, 7 + i % 3, -15 - i, 9 + i]
        const end = start + changes.reduce((a, b) => a + b, 0)
        const labels = ['Start', 'New clients', 'Discounts', 'Efficiency', 'Staff', 'Cross-sell', 'End']
        const negatives = changes.map((v, k) => ({ v, k })).filter((x) => x.v < 0).sort((a, b) => a.v - b.v)
        out.push({ ...base, values: [start, ...changes, end], labels, question: 'What is the largest cause of profit erosion, and what is the net change in EBITDA?', answer: labels[negatives[0].k + 1] + ' is the largest drag ($' + Math.abs(negatives[0].v) + 'M). EBITDA ' + (end >= start ? 'rises' : 'falls') + ' by $' + Math.abs(end - start) + 'M, from $' + start + 'M to $' + end + 'M. Positive bars add profit and negative bars remove it.', followUp: 'Investigate which negative drivers can be reversed without hurting customers.' })
      } else if (f === 3) {
        const values = [25 + i, 55 - i, 43 + i, 31 + i, 65 - i]
        const second = [15, 12 + i, 22, 28 - i, 16 + i]
        const third = [65 + 2 * i, 45 + 5 * i, 80 - 3 * i, 30 + i, 70]
        const calc = second.map((v, j) => v * third[j]), win = maxIndex(calc)
        const labels = ['Market A', 'Market B', 'Market C', 'Market D', 'Market E']
        out.push({ ...base, values, second, third, labels, question: 'Which market looks like the biggest profit opportunity if you combine margin (height) and demand (bubble size)?', answer: labels[win] + ' scores highest: ' + second[win] + '% margin × ' + third[win] + ' demand = ' + calc[win] + '. Bubble area, not radius, shows demand, so compare areas, not widths.', followUp: 'Test whether high margins can actually be captured after acquisition costs and competition.' })
      } else if (f === 4) {
        const values = [42 + i * 5, 67 + i * 3, 54 + i * 7, 78 - i * 2, 60 + i * 4]
        const labels = ['North', 'South', 'East', 'West', 'Central'], hi = maxIndex(values), lo = values.indexOf(Math.min(...values))
        out.push({ ...base, values, labels, question: 'Which region has the highest gross profit per sale and how much higher is it than the lowest?', answer: labels[hi] + ' leads at $' + values[hi] + ' per sale; ' + labels[lo] + ' is lowest at $' + values[lo] + '. The difference is $' + (values[hi] - values[lo]) + ' per sale.', followUp: 'Separate changes in pricing, customer mix, and cost-to-serve before copying the top performer.' })
      } else if (f === 5) {
        const values = [80 + i * 8, 95 + i * 6, 110 + i * 5, 125 + i * 7, 100 + i * 9, 150 + i * 5]
        const second = [5 + i * .15, 6.2, 4.5 + i * .1, 5.9, 6.0, 4.2 + i * .1].map((x) => Math.round(x * 100) / 100)
        const calc = values.map((v, j) => v * second[j] / 100), win = maxIndex(calc)
        out.push({ ...base, values, second, labels: QUARTERS, question: 'Which quarter created the most conversions? Do not judge by lead volume or conversion rate alone.', answer: QUARTERS[win] + ' created about ' + fmt(calc[win]) + ' thousand conversions (' + values[win] + 'k leads × ' + fmt(second[win]) + '% conversion). Check both axes before comparing periods.', followUp: 'Explore lead quality and customer acquisition cost alongside converted volumes.' })
      } else if (f === 6) {
        const values = [100, 108 + i, 122 + i, 130 + i * 2, 143 + i, 145 + i * 2]
        const second = [100, 112 + i, 118 + i * 2, 135 + i * 2, 155 + i * 3, 165 + i * 4]
        const third = [100, 94, 105, 103 + i, 99 + i, 110 + i]
        const calc = [values, second, third].map((s) => s[s.length - 1] - s[0]), win = maxIndex(calc)
        out.push({ ...base, values, second, third, labels: QUARTERS, question: 'Which business line grew the most relative to its starting point?', answer: SERIES[win] + ' grew by ' + fmt(calc[win]) + '% from the indexed starting level of 100. An index compares growth rates, but it does not tell us which line is biggest in dollars.', followUp: 'Request absolute revenue by business line before prioritising investment.' })
      } else {
        const values = [12, 21, 29, 38, 47, 56, 67, 76]
        const second = values.map((v, j) => fmt(42 + i + v * .45 + [-3, 4, -1, 2, -4, 5, -2, 7][j]))
        out.push({ ...base, values, second, labels: values.map((_, j) => 'Site ' + (j + 1)), question: 'What is the apparent relationship between training hours and customer satisfaction? Can this prove causation?', answer: 'There is a strong positive association (correlation about 0.95): roughly every 10 extra training hours goes with about 5 more satisfaction points. But the dots alone cannot show that training caused the difference: better-run sites may both train more and serve customers better.', followUp: 'Control for customer mix, tenure and location; test additional training with an experiment.' })
      }
    })
  })
  return out
}
const EXERCISES = makeExercises()
// Validated categorical palette (teal, burnt orange, blue, amber, ink), shared with case exhibits
const COLORS = ['#0A8F9C', '#C2410C', '#3B5BDB', '#B7791F', '#0F1B33']
const txt = { fontFamily: 'IBM Plex Sans, sans-serif', fill: '#5F6B7D', fontSize: 12 }
function Graph({ e }: { e: Exercise }) {
  const bottom = 270, top = 34, left = 57, right = 682, height = bottom - top, width = right - left
  const chartMax = e.family === 'Bar' ? Math.ceil(Math.max(...e.values) * 1.17 / 20) * 20 : e.family === 'Line' ? 200 : e.family === 'Scatter' ? 95 : e.family === 'Bubble' ? 40 : e.family === 'Bar + Line' ? 240 : e.family === 'Waterfall' ? Math.max(e.values[0], e.values[e.values.length - 1], e.values[0] + e.values.slice(1, -1).filter((v) => v > 0).reduce((a,b) => a+b,0)) * 1.17 : e.family === 'Bar Mekko' ? 40 : 100
  const grid = [0, 1, 2, 3, 4].map((i) => <g key={i}><line x1={left} x2={right} y1={bottom - i * height / 4} y2={bottom - i * height / 4} stroke="#E3EAF3" /><text x={left - 8} y={bottom - i * height / 4 + 4} textAnchor="end" style={{ fontSize: 11, fill: '#718096' }}>{e.family === 'Marimekko' || e.family === 'Bar Mekko' ? Math.round(i * chartMax / 4) + '%' : Math.round(i * chartMax / 4)}</text>{e.family === 'Bar + Line' && <text x={right + 8} y={bottom - i * height / 4 + 4} textAnchor="start" style={{ fontSize: 11, fill: '#C2410C' }}>{fmt(i * 8 / 4)}%</text>}</g>)
  const scale = (v: number, max: number) => bottom - v / max * height
  const label = (name: string, x: number, y = 292) => <text x={x} y={y} textAnchor="middle" style={txt}>{name}</text>
  let marks: ReactNode
  let note = ''
  if (e.family === 'Bar') {
    const max = Math.ceil(Math.max(...e.values) * 1.17 / 20) * 20
    marks = e.values.map((v, i) => { const x = left + 38 + i * (width - 48) / e.values.length; const bw = 66; return <g key={i}><rect x={x} y={scale(v, max)} width={bw} height={bottom - scale(v, max)} rx={3} fill={COLORS[i % COLORS.length]} />{label(e.labels[i], x + bw / 2)}<text x={x + bw / 2} y={scale(v, max) - 9} textAnchor="middle" style={txt}>${v}</text></g> })
    note = 'Gross profit ($) per sale'
  } else if (e.family === 'Line') {
    const series = [e.values, e.second || [], e.third || []]
    const X = (j: number) => left + 20 + j * (width - 40) / 5
    const Y = (v: number) => scale(v, 200)
    marks = <g>{series.map((vals, k) => <g key={k}><polyline points={vals.map((v, j) => X(j) + ',' + Y(v)).join(' ')} fill="none" stroke={COLORS[k]} strokeWidth={3} strokeLinejoin="round" />{vals.map((v, j) => <circle key={j} cx={X(j)} cy={Y(v)} r={4} fill={COLORS[k]} />)}</g>)}{e.labels.map((x, j) => <g key={j}>{label(x, X(j))}</g>)}{SERIES.map((s, k) => <g key={s}><rect x={left + k * 150} y={309} width={10} height={10} fill={COLORS[k]} /><text x={left + 15 + k * 150} y={319} style={txt}>{s}</text></g>)}</g>
    note = 'Revenue index (base period = 100)'
  } else if (e.family === 'Scatter' || e.family === 'Bubble') {
    const xMax = e.family === 'Bubble' ? 75 : 85, yMax = e.family === 'Bubble' ? 40 : 95
    marks = e.values.map((v, i) => { const cx = left + 15 + v / xMax * (width - 30); const cy = scale((e.second || [])[i], yMax); const radius = e.family === 'Bubble' ? Math.sqrt((e.third || [])[i]) * 2.1 : 6; return <g key={i}><circle cx={cx} cy={cy} r={radius} fill={COLORS[i % COLORS.length]} opacity={e.family === 'Bubble' ? .56 : .85} stroke={COLORS[i % COLORS.length]} strokeWidth={1.5} /><title>{e.labels[i] + ': x ' + v + ', y ' + (e.second || [])[i] + (e.family === 'Bubble' ? ', demand ' + (e.third || [])[i] : '')}</title></g> })
    note = e.family === 'Bubble' ? 'X: adoption index · Y: margin (%) · bubble area: demand' : 'X: training hours · Y: satisfaction index'
  } else if (e.family === 'Bar + Line') {
    const rates = e.second || []
    const X = (i: number) => left + 45 + i * (width - 80) / 6
    const P = (i: number) => X(i) + 22
    marks = <g>{e.values.map((v, i) => <g key={i}><rect x={X(i)} y={scale(v, 240)} width={44} height={bottom - scale(v, 240)} fill="#0A8F9C" opacity={.72} rx={3} />{label(e.labels[i], P(i))}</g>)}<polyline points={rates.map((v, i) => P(i) + ',' + scale(v, 8)).join(' ')} fill="none" stroke="#C2410C" strokeWidth={3} />{rates.map((v, i) => <circle key={i} cx={P(i)} cy={scale(v, 8)} r={4} fill="#C2410C" />)}<rect x={left + 3} y={308} width={10} height={10} fill="#0A8F9C" /><text x={left + 19} y={318} style={txt}>Leads (thousand), left scale</text><rect x={left + 255} y={308} width={10} height={10} fill="#C2410C" /><text x={left + 270} y={318} style={txt}>Conversion (%), right scale</text></g>
    note = 'Two axes: lead volume (bars) and conversion rate (line)'
  } else if (e.family === 'Waterfall') {
    const max = Math.max(e.values[0], e.values[e.values.length - 1], e.values[0] + e.values.slice(1, -1).filter((x) => x > 0).reduce((a, b) => a + b, 0)) * 1.17
    const X = (i: number) => left + 18 + i * (width - 40) / 7
    let current = e.values[0]
    marks = e.values.map((v, i) => {
      const x = X(i), bw = 52
      let low, high, color
      if (i === 0 || i === e.values.length - 1) { low = 0; high = v; color = '#0F1B33' }
      else { const next = current + v; low = Math.min(current, next); high = Math.max(current, next); color = v >= 0 ? '#0A8F9C' : '#C2410C'; current = next }
      return <g key={i}><rect x={x} y={scale(high, max)} width={bw} height={Math.max(2, scale(low, max) - scale(high, max))} fill={color} rx={2} /><text x={x + bw / 2} y={scale(high, max) - 8} textAnchor="middle" style={txt}>{i === 0 || i === e.values.length - 1 ? '$' + v : (v >= 0 ? '+' : '') + v}</text><text x={x + bw / 2} y={290} textAnchor="middle" style={{ ...txt, fontSize: 10.5 }}>{e.labels[i]}</text></g>
    })
    note = 'EBITDA bridge ($M): teal adds, orange subtracts'
  } else if (e.family === 'Bar Mekko') {
    const maxWidth = e.values.reduce((a, b) => a + b, 0)
    let offset = left
    marks = e.values.map((v, i) => { const w = width * v / maxWidth; const h = (e.second || [])[i] / 40 * height; const x = offset; offset += w; return <g key={i}><rect x={x} y={bottom - h} width={w - 2} height={h} fill={COLORS[i]} rx={2} /><text x={x + w / 2} y={bottom - h - 9} textAnchor="middle" style={txt}>{(e.second || [])[i]}%</text><text x={x + w / 2} y={291} textAnchor="middle" style={{ ...txt, fontSize: 11 }}>{e.labels[i]}</text></g> })
    note = 'Width: revenue ($bn) · Height: operating margin (%) · Area: operating profit'
  } else {
    const total = e.values.reduce((a, b) => a + b, 0)
    let offset = left
    marks = e.values.map((v, i) => { const w = width * v / total; const s1 = (e.second || [])[i]; const s2 = (e.third || [])[i]; const s3 = 100 - s1 - s2; const x = offset; offset += w; const vals = [s1, s2, s3]; let y = bottom; return <g key={i}>{vals.map((s, j) => { const h = s / 100 * height; y -= h; return <g key={j}><rect x={x + 1} y={y} width={w - 2} height={h - 1} fill={COLORS[j]} /><text x={x + w / 2} y={y + h / 2 + 4} textAnchor="middle" style={{ ...txt, fill: '#fff', fontSize: 11 }}>{s}%</text></g> })}<text x={x + w / 2} y={290} textAnchor="middle" style={{ ...txt, fontSize: 11 }}>{e.labels[i]}</text></g> })
    marks = <g>{marks}{[['Direct',COLORS[0]], ['Partner',COLORS[1]], ['Other',COLORS[2]]].map(([name,color],k) => <g key={name}><rect x={left + 160*k} y={308} width={10} height={10} fill={color} /><text x={left + 15 + 160*k} y={318} style={txt}>{name}</text></g>)}</g>
    note = 'Width: group revenue ($M) · Height: channel share (%) · Area: revenue'
  }
  return <div className="overflow-x-auto rounded-lg border border-line bg-white p-2 sm:p-4"><svg viewBox="0 0 720 345" className="w-full min-w-[560px]" role="img" aria-label={e.family + ' chart for ' + e.title}><rect x={0} y={0} width={720} height={345} fill="white" />{grid}<line x1={left} y1={top} x2={left} y2={bottom} stroke="#94A0B2" /><line x1={left} y1={bottom} x2={right} y2={bottom} stroke="#94A0B2" />{marks}<text x={left} y={16} style={{ ...txt, fontSize: 12, fill: '#0F1B33' }}>{note}</text></svg><p className="mt-1 text-[12.5px] text-muted">Fictional practice data.</p></div>
}

function DataTable({ e }: { e: Exercise }) {
  const columns: [string, number[]][] = e.family === 'Marimekko' ? [['Group revenue ($M)',e.values], ['Direct (%)',e.second || []], ['Partner (%)',e.third || []], ['Other (%)', e.values.map((_, j) => 100 - (e.second || [])[j] - (e.third || [])[j])]]
    : e.family === 'Bar Mekko' ? [['Revenue ($B)',e.values], ['Operating margin (%)',e.second || []]]
    : e.family === 'Waterfall' ? [['EBITDA ($M): start, movements, end',e.values]]
    : e.family === 'Bubble' ? [['Adoption index',e.values], ['Operating margin (%)',e.second || []], ['Demand index (bubble area)',e.third || []]]
    : e.family === 'Bar' ? [['Gross profit ($/sale)',e.values]]
    : e.family === 'Bar + Line' ? [['Leads (thousands)',e.values], ['Conversion rate (%)',e.second || []]]
    : e.family === 'Line' ? [['Core (indexed)',e.values], ['Premium (indexed)',e.second || []], ['New ventures (indexed)',e.third || []]]
    : [['Training hours',e.values], ['Satisfaction index',e.second || []]]
  return <details className="mt-3 rounded-lg border border-line bg-canvas/50"><summary className="cursor-pointer px-4 py-3 text-[13.5px] font-medium text-violet-d">See the exact numbers</summary><div className="overflow-x-auto px-4 pb-4"><table className="w-full min-w-[420px] border-collapse text-left text-[13px]"><thead><tr className="border-b border-line"><th className="py-2 pr-3 font-semibold text-ink">{e.family === 'Waterfall' ? 'Step' : e.family === 'Bar + Line' || e.family === 'Line' ? 'Quarter' : 'Group'}</th>{columns.map(([title])=><th key={title} className="py-2 pr-3 font-semibold text-ink">{title}</th>)}</tr></thead><tbody>{e.labels.map((label,i)=><tr key={label} className="border-b border-line/70 last:border-0"><td className="py-2 pr-3 font-medium">{label}</td>{columns.map(([title,values])=><td key={title} className="py-2 pr-3 tabular-nums">{values[i]}</td>)}</tr>)}</tbody></table></div></details>
}

const GUIDE = [
  ['1 · Orient yourself', 'Read the title, axis labels, units, legend, time period and footnotes. For an unfamiliar chart, ask what the size, width, height or colour represents.'],
  ['2 · Notice what matters', 'Find the biggest number, a sharp change, an outlier or a surprising relationship. Do not describe every bar or dot.'],
  ['3 · Put a number on it', 'Work out a percentage change, contribution, profit pool or difference. Compare absolute values as well as percentages.'],
  ['4 · Explain the business meaning', 'Connect the observation to the client’s goal. Ask what might explain it and which extra fact could confirm your hypothesis.'],
  ['5 · Say it clearly', 'State the main finding aloud in 20–30 seconds: “The key insight is X, supported by Y, so I would investigate Z.”'],
]
const STORAGE = 'case-prep-graph-library-v1'
function ModeCard({ active, onClick, title, body, icon }: { active: boolean; onClick: () => void; title: string; body: string; icon: ReactNode }) {
  return (
    <button onClick={onClick} aria-pressed={active}
      className={`flex flex-1 items-start gap-3 rounded-lg border p-4 text-left transition-[border-color,box-shadow] duration-200 ${active ? 'border-ink bg-white shadow-[0_0_0_1px_#0F1B33]' : 'border-line bg-white hover:border-faint'}`}>
      <span className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-ink text-white' : 'bg-canvas text-ink-2'}`}>{icon}</span>
      <span><span className="block font-medium text-ink">{title}</span><span className="mt-0.5 block text-[14px] text-muted">{body}</span></span>
    </button>
  )
}

/** Every chart in one scroll, to get familiar with the formats. */
function Gallery({ items }: { items: Exercise[] }) {
  return (
    <div className="space-y-10">
      {items.map((e, i) => (
        <article key={e.id} className="max-w-4xl">
          <p className="text-[13px] text-muted">{i + 1} of {items.length} · {e.family} chart</p>
          <h2 className="text-[18px]">{e.title.split(' · ')[0]}</h2>
          <p className="mt-1 mb-3 text-[14px] text-ink-2"><b className="font-medium text-ink">How to read it:</b> {FAMILY_GUIDES[e.family].meaning}</p>
          <Graph e={e} />
          <DataTable e={e} />
          <details className="mt-3 rounded-lg border border-line bg-white px-4 py-3">
            <summary className="cursor-pointer text-[14px] font-medium text-violet-d">The question and the insight</summary>
            <p className="mt-2 text-[14.5px] font-medium text-ink">{e.question}</p>
            <p className="mt-2 text-[14.5px] text-ink-2">{e.answer}</p>
          </details>
        </article>
      ))}
    </div>
  )
}

export default function Graphs() {
  const all = useMemo(() => EXERCISES, [])
  const [family, setFamily] = useState<string>('All')
  const [active, setActive] = useState<string>(all[0].id)
  const [done, setDone] = useState<string[]>([])
  const [show, setShow] = useState(false)
  const [notes, setNotes] = useState('')
  const [params, setParams] = useSearchParams()
  const browse = params.get('view') === 'all'
  const setBrowse = (b: boolean) => { const p = new URLSearchParams(params); if (b) p.set('view', 'all'); else p.delete('view'); setParams(p, { replace: true }) }
  useEffect(() => { try { const saved = JSON.parse(window.localStorage.getItem(STORAGE) || '[]'); if (Array.isArray(saved)) setDone(saved.filter((s): s is string => typeof s === 'string')) } catch { /* browser storage is optional */ } }, [])
  const visible = family === 'All' ? all : all.filter((e) => e.family === family)
  const current = all.find((e) => e.id === active) || all[0]
  const selectedIndex = visible.findIndex((e) => e.id === current.id)
  function pick(e: Exercise) { setActive(e.id); setShow(false); setNotes('') }
  function chooseFamily(f: string) { setFamily(f); const next = f === 'All' ? all[0] : all.find((e) => e.family === f); if (next) pick(next) }
  function toggleDone() {
    const next = done.includes(current.id) ? done.filter((id) => id !== current.id) : [...done, current.id]
    setDone(next); try { window.localStorage.setItem(STORAGE, JSON.stringify(next)) } catch { /* optional */ }
  }
  return <>
    <PageHeader title="Graph library" art={<ArtGraphs />} intro={`${FAMILIES.length} chart types you'll meet in case exhibits, each with ${BUSINESSES.length} sets of practice data. Practise them one at a time, or browse them all first to get familiar. For new questions every time, use the chart drills.`}
      action={<span className="rounded-lg bg-teal-l px-3 py-2 text-[14px] font-medium text-teal-d">{done.length} of {all.length} practised</span>} />
    <div className="mb-6 flex flex-col gap-3 sm:flex-row" role="group" aria-label="How do you want to use the library?">
      <ModeCard active={!browse} onClick={() => setBrowse(false)} title="Practise one at a time"
        body="Read a chart, say the insight in 90 seconds, then check the answer."
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><circle cx="12" cy="12" r="8" /><path d="M12 8v4l3 2" /></svg>} />
      <ModeCard active={browse} onClick={() => setBrowse(true)} title="View all graphs"
        body="Every chart in one scroll, with the insight a tap away. Good for a first look."
        icon={<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><rect x="4" y="4" width="7" height="7" rx="1" /><rect x="13" y="4" width="7" height="7" rx="1" /><rect x="4" y="13" width="7" height="7" rx="1" /><rect x="13" y="13" width="7" height="7" rx="1" /></svg>} />
    </div>
    <details className="mb-5 rounded-lg border border-line bg-white px-5 py-3">
      <summary className="cursor-pointer text-[14.5px] font-medium text-ink">How to read any chart (5 steps)</summary>
      <ol className="mt-3 space-y-1.5 pb-2 text-[14.5px] text-ink-2">{GUIDE.map(([title, desc]) => <li key={title}><b className="font-semibold text-ink">{title.replace(/^\d · /, '')}:</b> {desc}</li>)}</ol>
    </details>
    <div className="mb-5 flex flex-wrap gap-2" role="group" aria-label="Chart type">{['All', ...FAMILIES].map((f) => <button key={f} onClick={() => chooseFamily(f)} aria-pressed={family === f} className={'rounded-full border px-3.5 py-1.5 text-[13.5px] font-medium transition-colors ' + (family === f ? 'border-ink bg-ink text-white' : 'border-line bg-white text-muted hover:border-faint hover:text-ink')}>{f}</button>)}</div>
    {browse ? <Gallery items={visible} /> : <article className="min-w-0 max-w-4xl">
      <p className="text-[13.5px] text-muted">Chart {selectedIndex + 1} of {visible.length}{done.includes(current.id) ? ' · done ✓' : ''}</p>
      <h2 className="text-[21px] font-semibold">{current.title.split(' · ')[0]} <span className="font-sans text-[15px] font-normal text-muted">{current.family} chart</span></h2>
      <p className="mt-1 mb-3 text-[14.5px] text-ink-2"><b className="font-semibold text-ink">How to read it:</b> {FAMILY_GUIDES[current.family].meaning}</p>
      <Graph e={current} />
      <DataTable e={current} />
      <section className="mt-5 rounded-lg border-2 border-violet bg-white p-5"><h3 className="font-sans text-[14.5px] font-semibold text-violet-d">Your turn · 90 seconds</h3><p className="mt-1 text-[16px] font-medium text-ink">{current.question}</p><textarea aria-label="Your answer" className={inputCls + ' mt-3'} rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Say it out loud first. Typing is optional." />
        <div className="mt-3 flex flex-wrap gap-2"><Button onClick={() => setShow((s) => !s)}>{show ? 'Hide the answer' : 'Show the answer'}</Button><Button variant="secondary" onClick={toggleDone}>{done.includes(current.id) ? 'Done ✓' : 'Mark as done'}</Button></div>
        {show && <div className="mt-4 rounded-lg bg-good-l/60 p-4"><p className="text-[14.5px] text-ink">{current.answer}</p><p className="mt-2 text-[14.5px] text-ink-2"><b className="font-semibold">Next, I would:</b> {current.followUp.charAt(0).toLowerCase() + current.followUp.slice(1)}</p><p className="mt-2 text-[13.5px] text-muted"><b className="font-semibold text-ink">Watch out:</b> {FAMILY_GUIDES[current.family].caution}</p></div>}
      </section>
      <div className="mt-4 flex flex-wrap justify-between gap-3"><Button variant="secondary" disabled={selectedIndex <= 0} onClick={() => pick(visible[selectedIndex - 1])}>Previous chart</Button><Button disabled={selectedIndex >= visible.length - 1} onClick={() => pick(visible[selectedIndex + 1])}>Next chart</Button></div>
    </article>}
  </>
}
