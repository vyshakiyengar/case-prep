// Framework content. Standard consulting structures, drawn in our own design with our own examples.

/** A node in a left-to-right issue tree. `note` is a side comment or example. */
export interface CNode { t: string; c?: CNode[]; note?: string }

export interface CoreFramework {
  id: string
  family: Family
  title: string // the question the tree answers
  when: string
  ask: string
  branches: CNode[]
  tip: string
  example?: string
  practice: { label: string; to: string }[]
}

export type Family = 'diagnose' | 'decide' | 'generate'

/** The three kinds of case question. Name the kind first; it tells you the shape of the answer. */
export const FAMILIES: { id: Family; name: string; question: string; shape: string }[] = [
  { id: 'diagnose', name: 'Diagnose', question: '"Why is this happening, and how do we fix it?"', shape: 'Break the problem into parts that add up, find which part moved, then fix that part.' },
  { id: 'decide', name: 'Decide', question: '"Should we do this?"', shape: 'Test it against a few yes/no questions, put a number on it, and end with a clear yes or no.' },
  { id: 'generate', name: 'Generate', question: '"How can we do this?"', shape: 'Lay out every option in buckets that don\'t overlap, size them, then pick the best few.' },
]

export const CORE: CoreFramework[] = [
  // ------------------------------------------------------------ Diagnose
  {
    id: 'improve-profits', family: 'diagnose', title: "How can the client make more profit?",
    when: 'Profits are falling, or the client wants them higher.',
    ask: 'Is it revenue, costs or both? Is the whole industry hit, or just us?',
    branches: [
      { t: 'Revenue', c: [{ t: 'Units sold', note: 'customers × purchases each' }, { t: 'Price per unit' }], note: 'revenue = units × price' },
      { t: 'Costs', c: [{ t: 'Fixed costs', note: 'rent · salaried staff · overheads' }, { t: 'Variable costs', note: 'materials · delivery · commissions' }] },
    ],
    tip: 'Split every line by product, customer segment and channel: a shift in mix often hides inside the averages. Compare each line with competitors to tell a company problem from a market problem.',
    practice: [{ label: 'Coastal Brew', to: '/casebook/coastal-brew' }, { label: 'Vertex Mobile', to: '/casebook/vertex-mobile' }],
  },
  {
    id: 'reduce-costs', family: 'diagnose', title: "How can the client cut costs?",
    when: 'The client needs to cut costs, often by a target percentage.',
    ask: 'Which costs are in scope, and what must not suffer (quality, safety, service)?',
    branches: [
      { t: 'Need less', c: [
        { t: 'Stop the activity', note: 'close a branch · move to self-service' },
        { t: 'Do less of it', note: 'lower a service level, like free delivery' },
      ] },
      { t: 'Use less per unit', c: [{ t: 'Cut waste and rework' }, { t: 'Get more output per person or machine' }] },
      { t: 'Pay less per unit', c: [
        { t: 'Switch to cheaper inputs or outsource', note: 'rail instead of air freight' },
        { t: 'Negotiate better prices' },
      ] },
    ],
    tip: 'Cost = how much we do × resources per unit × price per resource. Each branch cuts one factor. Start with the biggest cost lines, and protect the costs that bring in revenue.',
    practice: [{ label: 'SkyLine MRO', to: '/casebook/skyline-mro' }],
  },
  {
    id: 'optimise-process', family: 'diagnose', title: "How can the client improve this process?",
    when: 'Operations cases: something is slow, costly or error-prone.',
    ask: 'Which outcome matters most: cost, speed, capacity or quality?',
    branches: [
      { t: 'Map it', c: [{ t: 'Steps and hand-offs' }, { t: 'Time, cost and errors at each step' }, { t: 'The bottleneck' }] },
      { t: 'Fix the steps', c: [{ t: 'Eliminate' }, { t: 'Combine' }, { t: 'Re-order' }, { t: 'Simplify' }], note: 'known as ECRS; technology often does the simplifying' },
      { t: 'Fix what supports them', c: [{ t: 'People', note: 'skills · incentives · staffing' }, { t: 'Technology and systems' }] },
    ],
    tip: 'The slowest step (the bottleneck) sets the output of the whole process. Speeding up any other step adds nothing, so fix the bottleneck first, then check which step becomes the new one.',
    practice: [{ label: 'Riverbend Bottling', to: '/casebook/riverbend-bottling' }, { label: 'SkyLine MRO', to: '/casebook/skyline-mro' }],
  },
  {
    id: 'competitive-threat', family: 'decide', title: "How should the client respond to a rival's move?",
    when: 'A rival cuts prices, launches a product or enters the market.',
    ask: 'What exactly did they do, and which of our customers does it touch?',
    branches: [
      { t: 'How exposed are we?', c: [{ t: 'Customers at risk' }, { t: 'Revenue and margin at risk' }] },
      { t: 'Why are they doing it?', c: [{ t: 'Which segments they want' }, { t: 'Their economics' }], note: 'can they keep it up?' },
      { t: 'Our options', c: [
        { t: 'Do nothing' }, { t: 'Defend our customers', note: 'loyalty · contracts · promotions' }, { t: 'Match them', note: 'adjust price · upgrade product' },
        { t: 'Copy their offer' }, { t: 'Partner or buy' },
      ] },
    ],
    tip: 'Size the threat before choosing a response, and compare every option with doing nothing. Doing nothing is right when little profit is at risk.',
    practice: [{ label: 'FreshMart', to: '/casebook/freshmart' }],
  },
  // ------------------------------------------------------------ Decide
  {
    id: 'enter-market', family: 'decide', title: "Should the client enter this market?",
    when: 'A new country, customer segment or product category.',
    ask: 'Why this market, and what would success look like, by when?',
    branches: [
      { t: 'Is the market attractive?', c: [{ t: 'Size and growth' }, { t: 'Typical margins' }, { t: 'Barriers to entry' }] },
      { t: 'Can we win?', c: [{ t: 'Competitors and their strength' }, { t: 'What customers need' }, { t: 'Our edge' }] },
      { t: 'Will it pay?', c: [{ t: 'Revenue we can expect' }, { t: 'Running costs' }, { t: 'Upfront investment' }], note: 'compare with payback target' },
      { t: 'Can we pull it off?', c: [{ t: 'Capabilities we lack', note: 'decides build, partner or buy' }, { t: 'Timing and pilot' }, { t: 'Key risks' }] },
    ],
    tip: 'The prize = market size × the share you can win × margin. Compare it with the upfront investment, then say how you would enter.',
    practice: [{ label: 'Nordwind E-Bikes', to: '/casebook/nordwind-e-bikes' }, { label: 'SnackCo Protein Bar', to: '/casebook/snackco-protein-bar' }],
  },
  {
    id: 'make-investment', family: 'decide', title: "Should the client make this investment?",
    when: 'A new plant, more capacity, a system, a store or a piece of equipment.',
    ask: 'What does it cost upfront, and what does it change: revenue, costs, or both?',
    branches: [
      { t: 'Do we need it?', c: [{ t: 'Is demand real and lasting?' }, { t: 'Can we get more from what we have?', note: 'fix bottlenecks · extra shifts' }] },
      { t: 'Will it pay?', c: [{ t: 'Upfront and running costs' }, { t: 'Extra revenue or savings' }], note: 'if rivals add capacity too, prices may fall' },
      { t: 'Is there a better alternative?', c: [{ t: 'Outsource or subcontract' }, { t: 'Lease or rent' }] },
      { t: 'Can we deliver it?', c: [{ t: 'Time to build' }, { t: 'Skills and risks' }] },
    ],
    tip: 'Payback = upfront cost ÷ yearly net gain. Break-even volume = upfront cost ÷ extra margin per unit. Compare both with the client\'s target and the asset\'s life.',
    practice: [{ label: 'Desert Dairy', to: '/casebook/desert-dairy' }],
  },
  {
    id: 'acquire-business', family: 'decide', title: "Should the client buy this company?",
    when: 'A company buying another company (mergers and acquisitions).',
    ask: 'Why buy: growth, capabilities, cost savings or a new market?',
    branches: [
      { t: 'Is the target good on its own?', c: [{ t: 'Its market' }, { t: 'Its performance vs peers' }, { t: 'Standalone value', note: 'cash flows (DCF) · multiples' }] },
      { t: 'What extra is it worth to us?', c: [{ t: 'Revenue synergies' }, { t: 'Cost synergies' }, { t: 'Minus integration costs' }] },
      { t: 'Can we make it work?', c: [{ t: 'Funding the deal' }, { t: 'Integration and culture' }, { t: 'Regulation (competition law)' }] },
      { t: 'Is the price right?', c: [{ t: 'Price vs value to us' }, { t: 'Alternatives', note: 'other targets · build or partner' }] },
    ],
    tip: 'Buy only if standalone value + synergies − integration costs is more than the price, and buying beats building it yourself.',
    practice: [{ label: 'PackRight', to: '/casebook/packright' }],
  },
  {
    id: 'pe-invest', family: 'decide', title: "Should the fund invest in this company?",
    when: 'Private equity: a fund buys a company to improve it and sell it in 3 to 7 years.',
    ask: 'What return does the fund need, over how many years?',
    branches: [
      { t: 'Is the market attractive?', c: [{ t: 'Size and growth' }, { t: 'Margins' }, { t: 'Barriers to entry' }] },
      { t: 'Is the company strong?', c: [{ t: 'Position vs competitors' }, { t: 'Performance and outlook' }, { t: 'Management team' }] },
      { t: 'How can we add value?', c: [{ t: 'Grow revenue' }, { t: 'Raise margins' }, { t: 'Buy add-on companies' }] },
      { t: 'Can we exit well?', c: [{ t: 'Who would buy it' }, { t: 'Exit multiple' }, { t: 'Timing' }], note: 'gives the return' },
    ],
    tip: 'Return = equity at exit ÷ equity at entry. A fund that triples its money (a 3× multiple, or MOIC) in 6 years earns about 20% a year. No credible buyer at exit means no deal.',
    practice: [{ label: 'FitHub Gyms', to: '/casebook/fithub-gyms' }],
  },
  // ------------------------------------------------------------ Generate
  {
    id: 'grow-business', family: 'generate', title: "How can the client grow?",
    when: 'The client wants more revenue and is open to options.',
    ask: 'How much growth, by when? Which business units grow today, and is anything off the table?',
    example: 'Example: a coffee chain',
    branches: [
      { t: 'With our existing products', c: [
        { t: 'Sell more to current customers', note: 'more visits · bigger orders · loyalty app' },
        { t: 'Reach new customers or markets', note: 'new cities · segments · channels' },
      ] },
      { t: 'With new products', c: [
        { t: 'For current customers', note: 'beans and pods for home · subscriptions' },
        { t: 'For new customers (diversify)', note: 'bottled drinks in supermarkets' },
      ] },
    ],
    tip: 'Risk rises as you move away from what the client already sells to whom. Size each option, then say how: build it, partner or buy.',
    practice: [{ label: 'Meridian Hospitals', to: '/casebook/meridian-hospitals' }],
  },
  {
    id: 'launch-product', family: 'generate', title: "How should the client launch the product?",
    when: 'The client wants a plan to launch a product. If the question is whether to launch at all, use market entry.',
    ask: 'Who is it for, and what does the launch need to achieve?',
    branches: [
      { t: 'Who to target', c: [{ t: 'Segment size and growth' }, { t: 'Competitors in the segment' }, { t: 'Unmet needs' }] },
      { t: 'What to offer', c: [{ t: 'Product' }, { t: 'Price' }, { t: 'Place (channels)' }, { t: 'Promotion (message and brand)' }] },
      { t: 'How to roll it out', c: [{ t: 'Capabilities', note: 'production · distribution · cash' }, { t: 'Pilot, then scale' }] },
      { t: 'Does it pay?', c: [{ t: 'Expected sales' }, { t: 'Costs and break-even' }] },
    ],
    tip: 'Pick the segment first: the 4Ps (product, price, place, promotion) all follow from who you are selling to.',
    practice: [{ label: 'SnackCo Protein Bar', to: '/casebook/snackco-protein-bar' }, { label: 'Elm Home Security', to: '/casebook/elm-home-security' }],
  },
  {
    id: 'price-product', family: 'generate', title: "What price should the client charge?",
    when: 'Setting or changing a price.',
    ask: 'What is the goal: profit, market share, or getting in fast?',
    branches: [
      { t: 'Floor: our costs', c: [{ t: 'Variable cost per unit', note: 'stay above it, unless it is a deliberate loss leader' }, { t: 'Fixed costs and investment', note: 'recovered over expected volume' }] },
      { t: 'Ceiling: value to the customer', c: [{ t: 'Price of their next best option' }, { t: 'Extra value we add', note: 'savings · more revenue for them' }] },
      { t: 'Reference: the alternatives', c: [{ t: 'Competitor prices' }, { t: 'Substitutes' }], note: 'sit above or below them?' },
    ],
    tip: 'Cost sets the floor, value to the customer sets the ceiling, and the alternatives tell you where to land in between. Then check the effect on your other products.',
    practice: [{ label: 'CloudLedger', to: '/casebook/cloudledger' }],
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
      { head: 'Demand side (start from buyers)', c: ['population', '× share in target segment', '× share who buy', '× units a year', '× price'] },
      { head: 'Supply side (start from sellers)', c: ['number of sellers or sites', '× sales or capacity each', '× price'] },
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
    id: 'four-ps', title: 'The 4Ps (marketing mix)', kind: 'groups', when: 'The "What to offer" branch of a product launch.',
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
      { head: 'Cost-plus', c: ['unit cost × (1 + target markup)'] },
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
    id: 'risks', title: 'Risk checklist', kind: 'groups', when: 'When you are asked "What are the risks?" or need to close a recommendation.',
    groups: [
      { head: 'Business', c: ['demand lower than planned', 'competitors react', 'prices fall'] },
      { head: 'Operations', c: ['delays and cost overruns', 'quality or supply problems', 'skills we lack'] },
      { head: 'Strategy', c: ['distracts from the core business', 'hurts the brand', 'locks us in'] },
      { head: 'Regulation and macro', c: ['laws and approvals', 'politics', 'exchange rates and the economy'] },
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
