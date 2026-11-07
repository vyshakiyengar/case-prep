// Framework content. Standard consulting structures, drawn in our own design with our own examples.

/** A node in a left-to-right issue tree. `note` is a side comment or example. */
export interface CNode { t: string; c?: CNode[]; note?: string }

export interface CoreFramework {
  id: string
  title: string // the question the tree answers
  when: string
  ask: string
  branches: CNode[]
  tip: string
  example?: string
  practice: { label: string; to: string }[]
}

export const CORE: CoreFramework[] = [
  {
    id: 'improve-profits', title: "How can the client make more profit?",
    when: 'Profits are falling, or the client wants them higher.',
    ask: 'Is the drop driven by revenue, by costs, or both? Is the whole industry affected?',
    branches: [
      { t: 'Revenue', c: [{ t: 'Units sold' }, { t: 'Price per unit' }], note: 'revenue = units × price' },
      { t: 'Costs', c: [{ t: 'Fixed costs', note: 'rent · salaried staff · overheads' }, { t: 'Variable costs', note: 'materials · delivery · commissions' }] },
    ],
    tip: 'Go one level deeper for the client: units = customers × purchases each. If the client sells several products, run the tree for each one, because a shift in mix can move profit too.',
    practice: [{ label: 'Coastal Brew', to: '/casebook/coastal-brew' }, { label: 'Vertex Mobile', to: '/casebook/vertex-mobile' }],
  },
  {
    id: 'grow-business', title: "How can the client grow?",
    when: 'The client wants more revenue and is open to options.',
    ask: 'How much growth, by when, and is anything off the table?',
    example: 'Example: a coffee chain',
    branches: [
      { t: 'With our existing products', c: [
        { t: 'Sell more to current customers', note: 'more visits · bigger orders · loyalty app' },
        { t: 'Reach new customers or markets', note: 'new cities · drive-throughs · travel hubs' },
      ] },
      { t: 'With new products', c: [
        { t: 'For current customers', note: 'beans and pods for home · subscriptions' },
        { t: 'For new customers (diversify)', note: 'bottled drinks in supermarkets' },
      ] },
    ],
    tip: 'Risk rises as you move away from what the client already sells to whom. Size each option, and say whether you would build it, partner or buy.',
    practice: [{ label: 'Meridian Hospitals', to: '/casebook/meridian-hospitals' }],
  },
  {
    id: 'reduce-costs', title: "How can the client cut costs?",
    when: 'The client needs to cut costs, often by a target percentage.',
    ask: 'Which costs are in scope, and what must not suffer (quality, safety, service)?',
    branches: [
      { t: 'Need less', c: [
        { t: 'Stop the activity', note: 'close a branch · move to self-service' },
        { t: 'Do less of it', note: 'lower a service level, like free delivery' },
      ] },
      { t: 'Use less per unit', c: [{ t: 'Cut waste and rework' }, { t: 'Get more output per person or machine' }] },
      { t: 'Pay less per unit', c: [
        { t: 'Switch to cheaper inputs', note: 'rail instead of air freight' },
        { t: 'Negotiate better prices' },
      ] },
    ],
    tip: 'Cost = how much we do × resources per unit × price per resource. Each branch cuts one factor. Start with the biggest cost lines.',
    practice: [{ label: 'SkyLine MRO', to: '/casebook/skyline-mro' }],
  },
  {
    id: 'enter-market', title: "Should the client enter this market?",
    when: 'A new country, customer segment or product category.',
    ask: 'Why this market, and what would success look like, by when?',
    branches: [
      { t: 'Is the market attractive?', c: [{ t: 'Size' }, { t: 'Growth' }, { t: 'Typical margins' }] },
      { t: 'Can we win enough share?', c: [{ t: 'Competitors and their strength' }, { t: 'What customers need' }, { t: 'How our offer compares' }] },
      { t: 'Will it pay for us?', c: [{ t: 'Revenue we can expect' }, { t: 'Costs to run it' }, { t: 'Upfront investment' }], note: 'compare with payback target' },
      { t: 'How to enter, and the risks', c: [{ t: 'Build, partner or buy' }, { t: 'Capabilities we lack' }, { t: 'Key risks' }] },
    ],
    tip: 'The prize = market size × the share you can win × margin. Compare it with the upfront investment.',
    practice: [{ label: 'Nordwind E-Bikes', to: '/casebook/nordwind-e-bikes' }, { label: 'SnackCo Protein Bar', to: '/casebook/snackco-protein-bar' }],
  },
  {
    id: 'launch-product', title: "How should the client launch the product?",
    when: 'The decision to launch is made; the question is how.',
    ask: 'Who is it for, and what does the launch need to achieve?',
    branches: [
      { t: 'Who to target', c: [{ t: 'Segment size and growth' }, { t: 'Competitors in the segment' }, { t: 'Unmet needs' }] },
      { t: 'How to win them', c: [{ t: 'Product' }, { t: 'Price' }, { t: 'Place (channels)' }, { t: 'Promotion (message and brand)' }] },
      { t: 'How to roll it out', c: [{ t: 'Pilot, then scale' }, { t: 'People, partners and budget' }] },
    ],
    tip: 'Pick the segment first: the 4Ps (product, price, place, promotion) all follow from who you are selling to.',
    practice: [{ label: 'SnackCo Protein Bar', to: '/casebook/snackco-protein-bar' }, { label: 'LinguaLeap', to: '/casebook/lingualeap' }],
  },
  {
    id: 'price-product', title: "What price should the client charge?",
    when: 'Setting or changing a price.',
    ask: 'What is the goal: profit, market share, or getting in fast?',
    branches: [
      { t: 'Floor: our costs', c: [{ t: 'Variable cost per unit', note: 'never price below this' }, { t: 'Fixed costs and investment', note: 'must be recovered over expected volume' }] },
      { t: 'Ceiling: value to the customer', c: [{ t: 'Value delivered' }, { t: 'Willingness to pay' }] },
      { t: 'Reference: the alternatives', c: [{ t: 'Competitor prices' }, { t: 'Substitutes' }], note: 'sit above or below them?' },
    ],
    tip: 'Cost sets the floor, value to the customer sets the ceiling, and the alternatives tell you where to land in between.',
    practice: [{ label: 'CloudLedger', to: '/casebook/cloudledger' }],
  },
  {
    id: 'acquire-business', title: "Should the client buy this company?",
    when: 'Mergers, acquisitions and private equity deals.',
    ask: 'Why buy: growth, capabilities, cost savings, or a financial return?',
    branches: [
      { t: 'What is it worth on its own?', c: [{ t: 'Future cash flows (DCF)' }, { t: 'Multiples of similar deals' }] },
      { t: 'What extra is it worth to us?', c: [{ t: 'Revenue synergies' }, { t: 'Cost synergies' }, { t: 'Minus integration costs' }] },
      { t: 'Can we make it work?', c: [{ t: 'Integration and culture' }, { t: 'Regulation (competition law)' }] },
    ],
    tip: 'Buy only if standalone value + synergies − integration costs is more than the price. A private equity fund cares most about standalone value and the exit.',
    practice: [{ label: 'PackRight', to: '/casebook/packright' }, { label: 'FitHub Gyms', to: '/casebook/fithub-gyms' }],
  },
  {
    id: 'make-investment', title: "Should the client make this investment?",
    when: 'A new plant, system, store or piece of equipment.',
    ask: 'What does it cost upfront, and what does it change: revenue, costs, or both?',
    branches: [
      { t: 'What does it cost?', c: [{ t: 'Upfront spend' }, { t: 'Running costs' }] },
      { t: 'What does it return?', c: [{ t: 'Extra revenue' }, { t: 'Cost savings' }], note: 'how long until it pays back?' },
      { t: 'Is there a cheaper alternative?' },
      { t: 'Can we deliver it, and what could go wrong?' },
    ],
    tip: 'Payback = upfront cost ÷ yearly net gain. Compare it with the client\'s target and the asset\'s life, and with cheaper alternatives.',
    practice: [{ label: 'Desert Dairy', to: '/casebook/desert-dairy' }],
  },
  {
    id: 'competitive-threat', title: "How should the client respond to a rival's move?",
    when: 'A rival cuts prices, launches a product or enters the market.',
    ask: 'What exactly did they do, and which of our customers does it touch?',
    branches: [
      { t: 'How exposed are we?', c: [{ t: 'Customers at risk' }, { t: 'Revenue and profit at risk' }] },
      { t: 'Why are they doing it?', c: [{ t: 'Size of the prize for them' }, { t: 'Their economics' }], note: 'can they keep it up?' },
      { t: 'Our options', c: [
        { t: 'Do nothing' }, { t: 'Defend our customers', note: 'loyalty, service, contracts' }, { t: 'Match on price' },
        { t: 'Counter with our own offer' }, { t: 'Partner or acquire' },
      ] },
    ],
    tip: 'Size the threat before choosing a response. Doing nothing is a real option when little profit is at risk.',
    practice: [{ label: 'FreshMart', to: '/casebook/freshmart' }],
  },
  {
    id: 'optimise-process', title: "How can the client improve this process?",
    when: 'Operations cases: something is slow, costly or error-prone.',
    ask: 'Which outcome matters most: cost, speed or quality?',
    branches: [
      { t: 'Map it', c: [{ t: 'Steps and hand-offs' }, { t: 'Time, cost and errors at each step' }, { t: 'The bottleneck' }] },
      { t: 'Improve each step', c: [{ t: 'Eliminate' }, { t: 'Combine' }, { t: 'Re-order' }, { t: 'Simplify or automate' }], note: 'known as ECRS' },
      { t: 'Size the gain' },
    ],
    tip: 'The slowest step (the bottleneck) sets the output of the whole process. Fix it first.',
    practice: [{ label: 'SkyLine MRO', to: '/casebook/skyline-mro' }, { label: 'RideNow Drivers', to: '/casebook/ridenow-drivers' }],
  },
]

/** Second-order drivers: what to dig into once you are inside a branch. */
export const DRIVERS: { head: string; c: string[] }[] = [
  { head: 'Market', c: ['Size and growth', 'Segments and geographies', 'Distribution channels'] },
  { head: 'Customers', c: ['Needs and preferences', 'How they decide to buy', 'Willingness to pay'] },
  { head: 'Competition', c: ['Players and market shares', 'New entrants', 'Substitutes'] },
  { head: 'Industry economics', c: ['Typical margins', 'Key success factors', 'Barriers to entry', 'Supplier power'] },
  { head: 'Our company', c: ['Skills and capabilities', 'Capital', 'Brand', 'Partners'] },
  { head: 'Macro', c: ['Regulation', 'Economy', 'Technology', 'Politics', 'Labour and unions'] },
]

export type OtherFramework =
  | { id: string; title: string; when: string; kind: 'groups'; groups: { head: string; c: string[] }[] }
  | { id: string; title: string; when: string; kind: 'matrix'; x: [string, string]; y: [string, string]; cells: { tag: string; title: string; c: string[] }[]; note: string }
  | { id: string; title: string; when: string; kind: 'table'; cols: string[]; rows: string[][] }
  | { id: string; title: string; when: string; kind: 'chips'; c: string[] }

export const OTHER: OtherFramework[] = [
  {
    id: 'market-sizing', title: 'Market sizing', kind: 'groups', when: '"How big is the market for X?" Say your approach before any maths.',
    groups: [
      { head: 'Top-down (start from people)', c: ['population', '× share in target segment', '× share who buy', '× units a year', '× price'] },
      { head: 'Bottom-up (start from supply)', c: ['number of sellers or sites', '× sales or capacity each', '× price'] },
      { head: 'Sanity check', c: ['compare with a number you know', 'does the per-person figure feel right?'] },
    ],
  },
  {
    id: 'cost-levers', title: 'Where costs hide (value chain)', kind: 'groups', when: 'Use with "How to reduce costs?" to find specific levers in each part of the business.',
    groups: [
      { head: 'Inputs', c: ['renegotiate or switch suppliers', 'buy in bulk or jointly', 'redesign the input'] },
      { head: 'Operations', c: ['automate', 'cut waste and rework', 'make vs outsource'] },
      { head: 'People', c: ['flexible staffing', 'less overtime', 'fewer management layers'] },
      { head: 'Sales and marketing', c: ['cut low-return spend', 'shift channel mix'] },
      { head: 'Distribution', c: ['optimise routes', 'renegotiate logistics'] },
      { head: 'Overheads', c: ['centralise shared services', 'property, travel'] },
    ],
  },
  {
    id: 'three-cs', title: 'The 3Cs', kind: 'groups', when: 'A quick strategic scan when you need a starting structure for an open question.',
    groups: [
      { head: 'Customers', c: ['who they are', 'what they need', 'how they buy'] },
      { head: 'Company', c: ['strengths and gaps', 'costs and capacity', 'brand'] },
      { head: 'Competitors', c: ['who they are', 'their share and moves', 'their advantages'] },
    ],
  },
  {
    id: 'five-forces', title: 'Five forces (Porter)', kind: 'groups', when: 'How attractive is this industry? Useful inside market entry and acquisitions.',
    groups: [
      { head: 'Rivalry', c: ['number and size of competitors', 'price wars'] },
      { head: 'New entrants', c: ['barriers to entry', 'capital needed'] },
      { head: 'Substitutes', c: ['other ways to meet the need'] },
      { head: 'Buyer power', c: ['few big customers?', 'switching costs'] },
      { head: 'Supplier power', c: ['few suppliers?', 'unique inputs'] },
    ],
  },
  {
    id: 'four-ps', title: 'The 4Ps (marketing mix)', kind: 'groups', when: 'The "Define our strategy" branch of a product launch.',
    groups: [
      { head: 'Product', c: ['features', 'range', 'quality'] },
      { head: 'Price', c: ['level', 'discounts', 'tiers'] },
      { head: 'Place', c: ['channels', 'coverage'] },
      { head: 'Promotion', c: ['advertising', 'sales force', 'offers'] },
    ],
  },
  {
    id: 'pricing-methods', title: 'Pricing methods', kind: 'groups', when: 'Ways to set a price once you know the floor and the ceiling.',
    groups: [
      { head: 'Cost-plus', c: ['unit cost + target margin'] },
      { head: 'Competitor-based', c: ['match, undercut or charge a premium'] },
      { head: 'Value-based', c: ['share of the value the customer gets'] },
      { head: 'Launch strategy', c: ['skim: start high', 'penetrate: start low'] },
    ],
  },
  {
    id: 'build-partner-buy', title: 'Build, partner or buy?', kind: 'table', when: 'How to get into a new market or capability.',
    cols: ['Route', 'Good because', 'Watch out for'],
    rows: [
      ['Build (organic)', 'Full control; no integration or culture clash', 'Slow; needs skills the client may not have'],
      ['Partner (JV, alliance)', 'Shared risk and cost; fast access', 'Shared control and profit'],
      ['Buy (acquire)', 'Fastest; brings customers and skills', 'Expensive; integration and culture risk'],
    ],
  },
  {
    id: 'outsourcing', title: 'Outsource or keep in-house?', kind: 'table', when: 'Make-or-buy questions in operations and cost cases.',
    cols: ['', 'For', 'Against'],
    rows: [
      ['Outsource', 'Lower cost; focus on the core; less risk if volumes fall', 'Less control over quality; reliance on others; brand risk'],
      ['Keep in-house', 'Control over process and quality; keeps know-how', 'Higher fixed costs; capacity tied up'],
    ],
  },
  {
    id: 'find-out', title: '"How would you find that out?"', kind: 'groups', when: 'When the interviewer asks how you would get data.',
    groups: [
      { head: 'Ask customers', c: ['surveys', 'focus groups', 'pilots and A/B tests'] },
      { head: 'Ask experts', c: ['internal specialists', 'industry experts'] },
      { head: 'Use data', c: ['industry reports', 'historical trends', 'the client\'s own data'] },
    ],
  },
  {
    id: 'simple-splits', title: 'Simple splits for brainstorming', kind: 'chips', when: 'When you need buckets fast for "What else could they do?"',
    c: ['Internal vs external', 'Short term vs long term', 'Revenue vs costs', 'Supply vs demand', 'Quantitative vs qualitative', 'Pros vs cons', 'Organic vs inorganic', 'Direct vs indirect', 'Financial vs non-financial'],
  },
]
