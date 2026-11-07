// Visual framework trees. Standard consulting structures, written in our own words.
export type TreeNode = string | { t: string; c: string[] }
export interface Branch { head: string; c: TreeNode[] }
export interface FrameworkTree {
  id: string
  title: string
  question: string
  ask: string
  formula?: string
  steps?: string[]
  branches: Branch[]
  matrix?: { x: [string, string]; y: [string, string]; cells: { tag: string; title: string; c: string[] }[]; note: string }
  tip: string
  trap: string
  practice: { label: string; to: string }[]
}

export const TREES: FrameworkTree[] = [
  {
    id: 'profitability', title: 'Profitability', question: 'Profits are falling. Why, and what should the client do?',
    ask: 'Is the whole industry suffering, or just our client?', formula: 'Profit = Revenue − Costs',
    branches: [
      { head: 'Revenue', c: [
        { t: 'Price', c: ['vs competitors', 'discounting', 'willingness to pay'] },
        { t: 'Volume', c: ['customers × how often they buy', 'market share trend'] },
        { t: 'Mix', c: ['by product', 'by customer segment', 'by channel'] },
      ] },
      { head: 'Costs', c: [
        { t: 'Variable', c: ['materials and inputs', 'direct labour', 'delivery and commissions'] },
        { t: 'Fixed', c: ['rent and depreciation', 'overheads (SG&A)', 'R&D'] },
        { t: 'Compare', c: ['vs last year', 'vs competitors', 'vs other business units'] },
      ] },
      { head: 'Market', c: [
        { t: 'Industry', c: ['size and growth', 'shifting customer needs'] },
        { t: 'Competitors', c: ['share gains and losses', 'new entrants', 'price moves'] },
        { t: 'Outside forces', c: ['regulation', 'technology', 'input prices'] },
      ] },
    ],
    tip: 'Split revenue by product, region or channel before you diagnose anything. The problem usually sits in one slice.',
    trap: 'Saying "revenue and costs" with nothing specific to this client.',
    practice: [{ label: 'Case 1: Coastal Brew', to: '/casebook/coastal-brew' }, { label: 'Case: Vertex Mobile', to: '/casebook/vertex-mobile' }],
  },
  {
    id: 'growth', title: 'Growth strategy', question: 'How can the client grow revenue?',
    ask: 'How much growth, by when, and does profit matter as much as revenue?',
    branches: [],
    matrix: {
      x: ['Existing products', 'New products'], y: ['Existing markets', 'New markets'],
      cells: [
        { tag: 'A', title: 'Sell more of what we have', c: ['change or restructure prices', 'win share with sales and marketing', 'bundles, loyalty, upselling'] },
        { tag: 'C', title: 'New products for current customers', c: ['line extensions or R&D', 'cross-sell to the base', 'watch for cannibalisation'] },
        { tag: 'B', title: 'Take products to new places', c: ['new regions', 'new customer segments', 'new channels (online, partners)'] },
        { tag: 'D', title: 'Diversify', c: ['new products in new markets', 'highest risk', 'usually via acquisition or joint venture'] },
      ],
      note: 'Work from A to D: start where risk is lowest. For each option, ask how to get there (build, partner or buy) and what it would earn.',
    },
    tip: 'Size each box before you recommend one. "How much revenue could this add, and how fast?"',
    trap: 'Jumping to diversification before you have exhausted the core business.',
    practice: [{ label: 'Case: Meridian Hospitals', to: '/casebook/meridian-hospitals' }],
  },
  {
    id: 'market-entry', title: 'Market entry', question: 'Should the client enter this market?',
    ask: 'Why this market, and what would success look like, by when?',
    branches: [
      { head: 'The market', c: ['size and growth', 'profit pool and margins', 'customer segments and needs', 'regulation'] },
      { head: 'Competition', c: ['number of players and concentration', 'their share and strengths', 'barriers to entry', 'how they will react to us'] },
      { head: 'Can we win?', c: ['capabilities and brand fit', 'cost position vs rivals', 'access to channels'] },
      { head: 'Economics', c: ['investment needed', 'revenue ramp-up', 'breakeven point', 'return vs other uses of the money'] },
      { head: 'How to enter', c: ['build, partner or buy', 'pilot small or go big', 'timing and key risks'] },
    ],
    tip: 'End with a clear yes or no, the entry mode, and the first step (often a pilot).',
    trap: 'Saying yes without the economics, or forgetting how the client would actually enter.',
    practice: [{ label: 'Case: Nordwind e-bikes', to: '/casebook/nordwind-e-bikes' }, { label: 'Case: SnackCo protein bar', to: '/casebook/snackco-protein-bar' }],
  },
  {
    id: 'new-product', title: 'New product launch', question: 'Should the client launch this product?',
    ask: 'What is the launch meant to achieve: revenue, market share, or defending against a rival?',
    branches: [
      { head: 'Customers and market', c: ['who needs it, and how badly', 'market size and growth', 'how fast people will adopt it'] },
      { head: 'The product', c: ['what makes it different', 'substitutes', 'patents and protection'] },
      { head: 'Economics', c: [
        { t: 'Revenue', c: ['price', 'units', 'cannibalised current sales'] },
        { t: 'Costs', c: ['variable and fixed', 'upfront investment', 'payback period'] },
      ] },
      { head: 'Can we deliver?', c: ['make it: capacity, make or buy', 'sell it: channels, sales force', 'brand fit'] },
      { head: 'Risks', c: ['competitor response', 'execution', 'regulation'] },
    ],
    tip: 'Net out cannibalisation: the real gain is new revenue minus the sales the product takes from the client\'s own range.',
    trap: 'Valuing the launch on its own revenue without subtracting what it steals from existing products.',
    practice: [{ label: 'Case: SnackCo protein bar', to: '/casebook/snackco-protein-bar' }],
  },
  {
    id: 'acquisition', title: 'Acquisition (M&A and private equity)', question: 'Should the client buy this company?',
    ask: 'Why buy: growth, new capabilities, cost savings, or a financial return?',
    branches: [
      { head: 'Target\'s market', c: ['size and growth', 'trends', 'competition'] },
      { head: 'The target itself', c: ['revenue and profit trend', 'customers and products', 'management and capabilities'] },
      { head: 'Synergies', c: [
        { t: 'Revenue', c: ['cross-selling', 'new customers or regions'] },
        { t: 'Cost', c: ['shared overheads', 'buying power and scale'] },
        'overlap and cannibalisation',
      ] },
      { head: 'Deal economics', c: ['value of target + synergies vs price', 'financing', 'return vs hurdle rate', 'exit route (for funds)'] },
      { head: 'Risks and integration', c: ['culture fit', 'integration cost and time', 'antitrust and regulation'] },
    ],
    tip: 'A company buying a company cares about synergies. A private equity fund cares about standalone returns and the exit.',
    trap: 'Saying "buy" without comparing the price to what the target is worth to this buyer.',
    practice: [{ label: 'Case: PackRight', to: '/casebook/packright' }, { label: 'Case: FitHub gyms', to: '/casebook/fithub-gyms' }],
  },
  {
    id: 'competitive-response', title: 'Competitive response', question: 'A rival has just made a move. How should the client react?',
    ask: 'What exactly did the rival do, and how much of our revenue is at risk?',
    branches: [
      { head: 'Understand the move', c: ['what changed: price, product, channel', 'why they did it', 'which customers it targets'] },
      { head: 'Size the threat', c: ['revenue and share at risk', 'short term vs long term', 'effect on the whole industry'] },
      { head: 'Options', c: [
        { t: 'Match', c: ['protects share', 'costs margin'] },
        { t: 'Don\'t match', c: ['protects margin', 'risks share'] },
        { t: 'Differentiate', c: ['service, quality, bundles, loyalty'] },
        { t: 'Change the game', c: ['partner, acquire, lock up channels'] },
      ] },
      { head: 'Choose', c: ['profit impact of each option', 'our strengths vs theirs', 'how long they can keep it up'] },
    ],
    tip: 'Quantify before reacting. A loud move that touches 3% of revenue may not deserve a price war.',
    trap: 'Matching the rival by reflex without working out what it costs.',
    practice: [{ label: 'Case: FreshMart', to: '/casebook/freshmart' }],
  },
  {
    id: 'cost-reduction', title: 'Cost reduction', question: 'The client needs to cut costs by 15%.',
    ask: 'Which costs are in scope, and what must not suffer (quality, service, safety)?',
    steps: ['Map the costs: fixed vs variable, and how big each bucket is', 'Benchmark: vs the past, competitors and other units', 'Work on the biggest gaps using the levers below'],
    branches: [
      { head: 'Inputs', c: ['renegotiate or switch suppliers', 'buy in bulk or jointly', 'redesign the input', 'hedge commodity prices'] },
      { head: 'Operations', c: ['automate', 'cut waste and rework', 'fix bottlenecks', 'make vs outsource'] },
      { head: 'People', c: ['flexible staffing', 'less overtime', 'cross-training', 'fewer management layers'] },
      { head: 'Sales and marketing', c: ['cut low-return spend', 'shift channel mix', 'rethink incentives'] },
      { head: 'Distribution', c: ['optimise routes and network', 'renegotiate logistics', 'move sales online'] },
      { head: 'Overheads', c: ['centralise shared services', 'travel and policies', 'property'] },
    ],
    tip: 'Split quick wins (next three months) from structural changes, and show how each adds up towards the 15%.',
    trap: 'A long list of levers with no sense of which costs are actually big.',
    practice: [{ label: 'Case: Skyline MRO', to: '/casebook/skyline-mro' }],
  },
  {
    id: 'pricing', title: 'Pricing', question: 'What should the client charge?',
    ask: 'What is the goal: profit, market share, or getting in fast?',
    branches: [
      { head: 'Cost (the floor)', c: ['unit cost + target margin', 'breakeven volume'] },
      { head: 'Competitors (the reference)', c: ['rival prices', 'substitutes', 'our position vs theirs'] },
      { head: 'Customer value (the ceiling)', c: ['value delivered: savings or gains', 'willingness to pay (surveys, tests)', 'price sensitivity'] },
      { head: 'Strategy', c: ['skim high or penetrate low', 'tiers and bundles', 'different prices by segment'] },
      { head: 'Constraints', c: ['buyer power', 'brand', 'regulation', 'rival reaction'] },
    ],
    tip: 'Price sits between the floor (cost) and the ceiling (value to the customer). Competitors tell you where in that range.',
    trap: 'Pricing on cost alone when the product saves the customer far more than it costs to make.',
    practice: [{ label: 'Case: CloudLedger', to: '/casebook/cloudledger' }],
  },
  {
    id: 'investment', title: 'Investment and capacity', question: 'Should the client build a new plant or add capacity?',
    ask: 'Is the demand real, and could existing capacity be used better first?',
    branches: [
      { head: 'Demand', c: ['current utilisation', 'forecast growth', 'how certain it is'] },
      { head: 'Alternatives', c: ['squeeze existing capacity', 'outsource or rent', 'buy a competitor'] },
      { head: 'Economics', c: ['upfront cost', 'extra profit per year', 'payback and NPV'] },
      { head: 'Risks', c: ['demand falls short', 'build delays', 'rivals add capacity too'] },
    ],
    tip: 'Always compare against the cheapest alternative, not against doing nothing.',
    trap: 'Approving the build before checking whether existing capacity is fully used.',
    practice: [{ label: 'Case: Desert Dairy', to: '/casebook/desert-dairy' }],
  },
  {
    id: 'market-sizing', title: 'Market sizing', question: 'How big is the market for this?',
    ask: 'Units or value? Which geography, and which year?',
    branches: [
      { head: 'Top-down (start from people)', c: ['population', '× share in the target segment', '× share who buy', '× units a year', '× price'] },
      { head: 'Bottom-up (start from supply)', c: ['number of sellers or locations', '× sales or capacity each', '× price'] },
      { head: 'Sanity check', c: ['compare with a number you know', 'does the per-person figure feel right?'] },
    ],
    tip: 'Say your approach before any maths, round hard, and state each assumption out loud.',
    trap: 'Diving into numbers without first saying how you will build the estimate.',
    practice: [{ label: 'Case: Plugged In', to: '/casebook/plugged-in' }, { label: 'Market sizing lesson', to: '/learn/market-sizing' }],
  },
]

export const SPLITS = ['Internal vs external', 'Short term vs long term', 'Revenue vs costs', 'Supply vs demand', 'Customers, company, competitors', 'Quantitative vs qualitative', 'Pros vs cons', 'Organic vs inorganic', 'Direct vs indirect', 'Financial vs non-financial']

export const FIND_OUT = [
  { head: 'Ask customers', c: ['surveys', 'focus groups', 'pilots and test markets', 'A/B tests'] },
  { head: 'Ask experts', c: ['internal specialists', 'industry experts', 'academics'] },
  { head: 'Use data', c: ['industry reports', 'historical trends', 'the client\'s own data'] },
]

export const BUILD_PARTNER_BUY = [
  { way: 'Build (organic)', pros: 'Full control; no integration or culture clash', cons: 'Slow; needs skills the client may not have; strains capital' },
  { way: 'Partner (JV, alliance)', pros: 'Shared risk and cost; fast access to skills or markets', cons: 'Shared control and profit; partners can fall out' },
  { way: 'Buy (acquire)', pros: 'Fastest; brings customers, skills and brand', cons: 'Expensive; integration cost; culture and antitrust risk' },
]
