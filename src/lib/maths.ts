// Generates mental-maths questions of the kind that come up in cases, with clean answers.
const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]

export const fmtNum = (n: number): string => {
  const abs = Math.abs(n)
  const trim = (x: number) => (Math.round(x * 100) / 100).toString()
  if (abs >= 1e9) return `${trim(n / 1e9)}B`
  if (abs >= 1e6) return `${trim(n / 1e6)}M`
  if (abs >= 1e4) return `${trim(n / 1e3)}k`
  return (Math.round(n * 100) / 100).toLocaleString('en-GB')
}

export interface MathQ { q: string; a: string; hint?: string }

const gens: (() => MathQ)[] = [
  () => {
    const p = pick([5, 12, 15, 17, 25, 35, 45, 8, 18]); const b = pick([240, 340, 480, 620, 1200, 4500, 860])
    return { q: `What is ${p}% of ${b.toLocaleString('en-GB')}?`, a: fmtNum((p * b) / 100), hint: 'Split it: 10% + 5% + …' }
  },
  () => {
    const a = pick([1.5, 2.5, 3.5, 4, 6, 7.5]); const b = pick([120, 240, 360, 450, 800])
    return { q: `${a}M × ${b} = ?`, a: fmtNum(a * 1e6 * b), hint: 'Multiply the digits, then count the zeros.' }
  },
  () => {
    const per = pick([1500, 2500, 3000, 4000, 7500]); const users = pick([1.2, 1.6, 2, 2.4, 3.2])
    return { q: `$${fmtNum(per * users * 1e6)} ÷ ${users}M customers = ? per customer`, a: `$${per.toLocaleString('en-GB')}`, hint: 'Cancel the millions first.' }
  },
  () => {
    const p = pick([20, 25, 40, 50, 80]); const v = pick([0.4, 0.5, 0.6, 0.75]) * p; const units = pick([100, 150, 200, 250, 400]) * 1000
    const f = (p - v) * units
    return { q: `Fixed costs $${fmtNum(f)}, price $${p}, variable cost $${v} per unit. Breakeven volume?`, a: `${fmtNum(units)} units`, hint: 'Fixed costs ÷ contribution per unit.' }
  },
  () => {
    const cost = pick([40, 60, 75, 80, 120]); const markup = pick([0.25, 0.5, 0.2, 0.6]); const price = cost * (1 + markup)
    const margin = Math.round(((price - cost) / price) * 1000) / 10
    return { q: `Cost $${cost}, price $${price}. Margin and markup?`, a: `Margin ${margin}%, markup ${markup * 100}%`, hint: 'Margin is on price, markup is on cost.' }
  },
  () => {
    const save = pick([150, 200, 250, 300, 400, 500]) * 1000; const yrs = pick([2, 2.5, 3, 4, 5])
    return { q: `An investment of $${fmtNum(save * yrs)} saves $${fmtNum(save)} a year. Payback?`, a: `${yrs} years` }
  },
  () => {
    const a = pick([40, 50, 80, 120, 200, 250]); const ch = pick([-25, -20, -10, 10, 15, 20, 25, 30, 50])
    return { q: `Sales go from ${a}M to ${fmtNum(a * (1 + ch / 100) * 1e6)}. Percentage change?`, a: `${ch > 0 ? '+' : ''}${ch}%` }
  },
  () => {
    const cf = pick([2, 3, 4, 5, 6, 8]); const r = pick([5, 8, 10, 12.5])
    return { q: `A steady cash flow of $${cf}M a year, discount rate ${r}%. Value as a perpetuity?`, a: `$${fmtNum((cf * 1e6) / (r / 100))}`, hint: 'Cash flow ÷ rate.' }
  },
  () => {
    const p = pick([1.1, 1.2, 0.9, 1.15]); const v = pick([0.95, 0.9, 1.05, 0.85])
    const ch = Math.round((p * v - 1) * 1000) / 10
    return { q: `Price changes ${Math.round((p - 1) * 100) > 0 ? '+' : ''}${Math.round((p - 1) * 100)}% and volume ${Math.round((v - 1) * 100) > 0 ? '+' : ''}${Math.round((v - 1) * 100)}%. Revenue change?`, a: `${ch > 0 ? '+' : ''}${ch}%`, hint: 'Multiply the factors: 1.1 × 0.95 …' }
  },
  () => {
    const c = pick([1, 2, 2.5, 4, 5]); return { q: `Monthly churn is ${c}%. Average customer lifetime?`, a: `${100 / c} months` }
  },
]

export const nextMathQ = (): MathQ => pick(gens)()
