import { playbook } from './index'

export interface Framework {
  slug: string
  type: string
  ask: string
  trap: string
  mode: 'branches' | 'steps'
  branches: { head: string; items: string[] }[]
  steps: string[]
  cases: string[] // casebook slugs that use this case type
  when: string
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const CASES: Record<string, string[]> = {
  'Profitability': ['coastal-brew', 'vertex-mobile'], 'Revenue drop': ['vertex-mobile'], 'Market entry': ['nordwind-e-bikes', 'snackco-protein-bar'],
  'Growth strategy': ['meridian-hospitals'], 'M&A': ['packright'], 'Private equity': ['fithub-gyms'], 'Pricing': ['cloudledger'],
  'Competitive response': ['freshmart'], 'Capacity / investment': ['desert-dairy'], 'Cost & operations': ['skyline-mro'], 'Market sizing': ['plugged-in'],
  'Valuation': ['packright', 'fithub-gyms'], 'Public sector': ['visit-al-noor'], 'Product: design': ['ridenow-drivers'],
  'Product: improve / grow': ['ridenow-drivers'], 'Product: metric drop': ['lingualeap'],
}
const WHEN: Record<string, string> = {
  'Profitability': '"Profits are down. Why, and what should we do?" The most common case of all.',
  'Revenue drop': '"Sales fell 10% this year. Find out why."',
  'Market entry': '"Should we launch in a new country, segment or product?"',
  'Growth strategy': '"How can we double revenue in five years?"',
  'M&A': '"Should we buy this company, and at what price?"',
  'Private equity': '"Should our fund invest in this business?"',
  'Pricing': '"What should we charge for our new product?"',
  'Competitive response': '"A rival just launched something. How should we react?"',
  'Capacity / investment': '"Should we build a new plant or add capacity?"',
  'Cost & operations': '"Cut costs by 15%" or "Why is this process so slow?"',
  'Market sizing': '"How big is the market for X?" Often a mini-case inside a bigger case.',
  'Valuation': '"What is this business, asset or contract worth?"',
  'Public sector': '"How can the government reach a policy goal?" Common in the Middle East and Europe.',
  'Product: design': '"Design a product or feature for these users."',
  'Product: improve / grow': '"How would you improve our product?"',
  'Product: metric drop': '"Daily users fell 10%. Investigate."',
}

function parse(build: string): Pick<Framework, 'mode' | 'branches' | 'steps'> {
  if (!build.includes(' · ') && build.includes('→')) return { mode: 'steps', branches: [], steps: build.split('→').map((s) => s.trim()).filter(Boolean).map((s) => s.charAt(0).toUpperCase() + s.slice(1)) }
  const branches = build.split(' · ').map((part) => {
    const p = part.trim()
    const paren = p.match(/^(.+?)\s*\((.+)\)$/)
    if (paren) return { head: paren[1].trim(), items: paren[2].split(/,\s*/) }
    const colon = p.match(/^(.+?):\s*(.+)$/)
    if (colon) return { head: colon[1].trim(), items: colon[2].split(/,\s*/) }
    const arrow = p.split('→')
    if (arrow.length > 1) return { head: arrow[0].trim(), items: arrow.slice(1).map((x) => x.trim()) }
    return { head: p, items: [] }
  })
  return { mode: 'branches', branches, steps: [] }
}

export const FRAMEWORKS: Framework[] = playbook.frameworks.map((f) => ({
  slug: slugify(f.type), type: f.type, ask: f.ask, trap: f.trap, ...parse(f.build), cases: CASES[f.type] || [], when: WHEN[f.type] || '',
}))
export const frameworkBySlug = (s: string) => FRAMEWORKS.find((f) => f.slug === s)
