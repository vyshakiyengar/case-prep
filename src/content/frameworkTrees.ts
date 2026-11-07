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
    id: 'improve-profits', title: 'How to improve profits?',
    when: 'Profits are falling, or the client wants them higher.',
    ask: 'Is the drop driven by revenue, by costs, or both? Is the whole industry affected?',
    branches: [
      { t: 'Revenue', c: [{ t: 'Volume' }, { t: 'Price' }] },
      { t: 'Costs', c: [{ t: 'Fixed costs' }, { t: 'Variable costs' }] },
    ],
    tip: 'Go one level deeper for the client: volume = number of customers × how often they buy; split costs into the three or four biggest lines.',
    practice: [{ label: 'Coastal Brew', to: '/casebook/coastal-brew' }, { label: 'Vertex Mobile', to: '/casebook/vertex-mobile' }],
  },
  {
    id: 'grow-business', title: 'How to grow the business?',
    when: 'The client wants more revenue and is open to options.',
    ask: 'How much growth, by when, and is anything off the table?',
    example: 'Example: a coffee chain',
    branches: [
      { t: 'Grow the core business', c: [
        { t: 'Grow within current segments', note: 'new drinks · loyalty app · sharper prices' },
        { t: 'Focus on the fastest-growing segments', note: 'cold drinks · drive-throughs · travel hubs' },
      ] },
      { t: 'Grow outside the core business', c: [
        { t: 'Sell new products to existing customers', note: 'beans and pods for home · subscriptions · catering' },
        { t: 'Use our capabilities to enter new businesses', note: 'bottled drinks in supermarkets · franchising abroad' },
      ] },
    ],
    tip: 'Start with the core: it is cheaper and less risky. Then size each option before recommending one.',
    practice: [{ label: 'Meridian Hospitals', to: '/casebook/meridian-hospitals' }],
  },
  {
    id: 'reduce-costs', title: 'How to reduce costs?',
    when: 'The client needs to cut costs, often by a target percentage.',
    ask: 'Which costs are in scope, and what must not suffer (quality, safety, service)?',
    branches: [
      { t: 'Reduce the need', c: [
        { t: 'Eliminate the need entirely', note: 'close a branch · move to self-service' },
        { t: 'Reduce the service level', note: 'drop a free extra, like free delivery' },
      ] },
      { t: 'Meet the need with fewer resources', c: [{ t: 'Eliminate waste' }, { t: 'Improve productivity' }] },
      { t: 'Reduce the cost of resources', c: [
        { t: 'Find cheaper alternatives', note: 'rail instead of air freight' },
        { t: 'Renegotiate costs' },
      ] },
    ],
    tip: 'Before using the tree, find where the money goes: the biggest cost lines deserve the most attention.',
    practice: [{ label: 'SkyLine MRO', to: '/casebook/skyline-mro' }],
  },
  {
    id: 'enter-market', title: 'Whether to enter a new market?',
    when: 'A new country, customer segment or product category.',
    ask: 'Why this market, and what would success look like, by when?',
    branches: [
      { t: 'Market opportunity', c: [{ t: 'Market size' }, { t: 'Market growth' }] },
      { t: 'Potential share', c: [{ t: 'Competitors' }, { t: 'Customer needs' }, { t: 'Our offering' }] },
      { t: 'Potential profit', c: [{ t: 'Investment' }, { t: 'Running costs' }, { t: 'Revenue' }] },
      { t: 'Capabilities and risks' },
    ],
    tip: 'Market size × the share you can win × margin gives the prize. Compare it with the investment.',
    practice: [{ label: 'Nordwind E-Bikes', to: '/casebook/nordwind-e-bikes' }, { label: 'SnackCo Protein Bar', to: '/casebook/snackco-protein-bar' }],
  },
  {
    id: 'launch-product', title: 'How to launch a new product?',
    when: 'The decision to launch is made; the question is how.',
    ask: 'Who is it for, and what does the launch need to achieve?',
    branches: [
      { t: 'Choose target segments', c: [{ t: 'Size and growth' }, { t: 'Competition' }, { t: 'Customer needs' }] },
      { t: 'Define our strategy', c: [{ t: 'Product' }, { t: 'Price' }, { t: 'Distribution' }, { t: 'Brand and advertising' }] },
      { t: 'Implementation' },
    ],
    tip: 'Pick the segment first: product, price, channel and message all follow from who you are selling to.',
    practice: [{ label: 'SnackCo Protein Bar', to: '/casebook/snackco-protein-bar' }, { label: 'LinguaLeap', to: '/casebook/lingualeap' }],
  },
  {
    id: 'price-product', title: 'How to price a new product?',
    when: 'Setting or changing a price.',
    ask: 'What is the goal: profit, market share, or getting in fast?',
    branches: [
      { t: 'Costs', c: [{ t: 'Variable costs' }, { t: 'Investment costs' }, { t: 'Fixed costs' }], note: 'the price needs enough margin to cover investment and fixed costs' },
      { t: 'Customers\' willingness to pay' },
      { t: 'Competitors or substitutes', note: 'price above or below them?' },
    ],
    tip: 'Cost sets the floor, value to the customer sets the ceiling, competitors tell you where to land in between.',
    practice: [{ label: 'CloudLedger', to: '/casebook/cloudledger' }],
  },
  {
    id: 'acquire-business', title: 'Whether to acquire a new business?',
    when: 'Mergers, acquisitions and private equity deals.',
    ask: 'Why buy: growth, capabilities, cost savings, or a financial return?',
    branches: [
      { t: 'Standalone value', c: [{ t: 'Future revenue' }, { t: 'Future costs' }, { t: 'Valuation multiples' }], note: 'value = today\'s worth of future cash flows (NPV)' },
      { t: 'Synergies', c: [{ t: 'Revenue growth' }, { t: 'Cost reduction' }] },
      { t: 'Capabilities and risks' },
    ],
    tip: 'Buy only if standalone value + synergies is more than the price. A fund cares most about standalone value and the exit.',
    practice: [{ label: 'PackRight', to: '/casebook/packright' }, { label: 'FitHub Gyms', to: '/casebook/fithub-gyms' }],
  },
  {
    id: 'make-investment', title: 'Whether to make an investment?',
    when: 'A new plant, system, store or piece of equipment.',
    ask: 'What does it cost upfront, and what does it change: revenue, costs, or both?',
    branches: [
      { t: 'Impact on costs' },
      { t: 'Impact on revenue', note: 'how long until it breaks even?' },
      { t: 'Implementation' },
    ],
    tip: 'Payback = upfront cost ÷ yearly gain. Compare it with how long the asset lasts and with cheaper alternatives.',
    practice: [{ label: 'Desert Dairy', to: '/casebook/desert-dairy' }],
  },
  {
    id: 'competitive-threat', title: 'How to respond to a competitive threat?',
    when: 'A rival cuts prices, launches a product or enters the market.',
    ask: 'What exactly did they do, and which of our customers does it touch?',
    branches: [
      { t: 'Potential impact on us', c: [{ t: 'Segment affected' }, { t: 'Estimated loss' }], note: 'how much could we lose?' },
      { t: 'Opportunity the rival is chasing', c: [{ t: 'Size' }, { t: 'Profitability' }], note: 'is it worth them pursuing?' },
      { t: 'Possible responses', c: [
        { t: 'Do nothing' }, { t: 'Mitigate', note: 'keep our customers' }, { t: 'Align', note: 'lower our prices' },
        { t: 'Replicate', note: 'launch a competing offer' }, { t: 'Collaborate' },
      ] },
    ],
    tip: 'Size the threat before choosing a response. Doing nothing is a real option when little revenue is at risk.',
    practice: [{ label: 'FreshMart', to: '/casebook/freshmart' }],
  },
  {
    id: 'optimise-process', title: 'How to optimise a process?',
    when: 'Operations cases: something is slow, costly or error-prone.',
    ask: 'Which outcome matters most: cost, speed or quality?',
    branches: [
      { t: 'Map out the current process', note: 'capacity? utilisation? bottleneck?' },
      { t: 'Look into each step', c: [{ t: 'Eliminate' }, { t: 'Reduce cost' }, { t: 'Increase speed' }, { t: 'Increase quality' }, { t: 'Anticipate' }] },
      { t: 'Estimate the gains' },
    ],
    tip: 'The slowest step (the bottleneck) sets the speed of the whole process. Fix it first.',
    practice: [{ label: 'SkyLine MRO', to: '/casebook/skyline-mro' }, { label: 'RideNow Drivers', to: '/casebook/ridenow-drivers' }],
  },
]

/** Second-order drivers: what to dig into once you are inside a branch. */
export const DRIVERS: { head: string; c: string[] }[] = [
  { head: 'Market', c: ['Size and growth', 'Geographies', 'Customer segments', 'Distribution channels'] },
  { head: 'Customers', c: ['Segments', 'Preferences', 'How they decide to buy'] },
  { head: 'Competition', c: ['Market shares', 'New entrants', 'Substitutes'] },
  { head: 'Industry', c: ['Competitors', 'Profitability', 'Key success factors', 'Barriers to entry'] },
  { head: 'Execution', c: ['Skills', 'Capital', 'Brand', 'Partners'] },
  { head: 'Macro', c: ['Regulation', 'Unions', 'Technology', 'Economy', 'Politics'] },
]

export type OtherFramework =
  | { id: string; title: string; when: string; kind: 'groups'; groups: { head: string; c: string[] }[] }
  | { id: string; title: string; when: string; kind: 'matrix'; x: [string, string]; y: [string, string]; cells: { tag: string; title: string; c: string[] }[]; note: string }
  | { id: string; title: string; when: string; kind: 'table'; cols: string[]; rows: string[][] }
  | { id: string; title: string; when: string; kind: 'chips'; c: string[] }

export const OTHER: OtherFramework[] = [
  {
    id: 'growth-matrix', title: 'Growth matrix (Ansoff)', kind: 'matrix', when: 'A second way to lay out growth options, by product and by market.',
    x: ['Existing products', 'New products'], y: ['Existing markets', 'New markets'],
    cells: [
      { tag: 'A', title: 'Sell more of what we have', c: ['prices, marketing, bundles, loyalty'] },
      { tag: 'C', title: 'New products, same customers', c: ['line extensions, cross-selling'] },
      { tag: 'B', title: 'Same products, new markets', c: ['new regions, segments, channels'] },
      { tag: 'D', title: 'Diversify', c: ['highest risk; often via acquisition'] },
    ],
    note: 'Risk rises from A to D. Most answers start in A.',
  },
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
