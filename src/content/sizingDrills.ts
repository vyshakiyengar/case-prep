// Market-sizing drill. Each answer is one reasonable estimate, built step by step from rounded,
// stated assumptions. The final number is worked out from the steps (see sizingAnswer), so the
// arithmetic always matches what is shown. Population and household figures are rounded.
export interface SizingStep { t: string; v: number; op?: '×' | '÷'; f?: 'pct' | 'money' | 'n' }
export interface SizingQ {
  id: string
  q: string
  unit: string          // what the answer counts, e.g. "cups a day"
  cur?: '£' | '$'       // set when the answer is money
  approach: string      // the structure in one line
  steps: SizingStep[]
  check: string         // a quick sanity check
  level: 1 | 2 | 3
}

export const SIZING: SizingQ[] = [
  { id: 'london-coffee', level: 1, q: 'How many cups of coffee do London cafés sell on a weekday?', unit: 'cups a day',
    approach: 'Demand side: people × share who buy café coffee that day × cups each',
    steps: [{ t: 'People in London', v: 9e6 }, { t: 'buy coffee from a café on a weekday', v: 0.25, op: '×', f: 'pct' }, { t: 'cups each', v: 1.5, op: '×' }],
    check: 'About 20,000 cafés and coffee counters would each sell around 170 cups a day, which sounds right for a busy city.' },
  { id: 'uk-umbrellas', level: 1, q: 'What do people in the UK spend on umbrellas each year?', unit: 'a year', cur: '£',
    approach: 'People × umbrellas bought per year × average price',
    steps: [{ t: 'People in the UK', v: 68e6 }, { t: 'umbrellas each per year (one every 3 years)', v: 1 / 3, op: '×' }, { t: 'average price', v: 10, op: '×', f: 'money' }],
    check: 'Around £3 per person per year: small, which fits an item people rarely think about.' },
  { id: 'london-hairdressers', level: 2, q: 'How many hairdressers work in London?', unit: 'hairdressers',
    approach: 'Haircuts needed per year ÷ haircuts one hairdresser can do per year',
    steps: [{ t: 'People in London', v: 9e6 }, { t: 'haircuts each per year', v: 6, op: '×' }, { t: 'haircuts per hairdresser per year (8 a day, 5.5 days, 48 weeks)', v: 8 * 5.5 * 48, op: '÷' }],
    check: 'Roughly one hairdresser per 350 Londoners, about one salon chair per few streets.' },
  { id: 'us-dog-food', level: 2, q: 'How big is the US market for dog food each year?', unit: 'a year', cur: '$',
    approach: 'Households × share with dogs × dogs per household × spend per dog',
    steps: [{ t: 'US households', v: 130e6 }, { t: 'own a dog', v: 0.38, op: '×', f: 'pct' }, { t: 'dogs per dog-owning household', v: 1.5, op: '×' }, { t: 'food spend per dog per year', v: 500, op: '×', f: 'money' }],
    check: 'About $40 a month per dog, which is in line with a mid-priced bag of dry food.' },
  { id: 'india-phones', level: 2, q: 'How many smartphones are sold in India each year?', unit: 'phones a year',
    approach: 'People × share with a smartphone ÷ years between replacements',
    steps: [{ t: 'People in India', v: 1.4e9 }, { t: 'own a smartphone', v: 0.5, op: '×', f: 'pct' }, { t: 'years before they replace it', v: 4, op: '÷' }],
    check: 'Close to half a million phones a day across the country, plausible for one of the largest phone markets.' },
  { id: 'uk-wedding-photographers', level: 1, q: 'How many full-time wedding photographers does the UK need?', unit: 'photographers',
    approach: 'Weddings per year ÷ weddings one photographer can shoot per year',
    steps: [{ t: 'Weddings in the UK per year', v: 250e3 }, { t: 'weddings one photographer can do per year (mostly summer weekends)', v: 25, op: '÷' }],
    check: 'Plenty of photographers also work part time, so the real number of people doing some weddings will be higher.' },
  { id: 'coffee-shop-revenue', level: 1, q: 'What is the yearly revenue of one busy London coffee shop?', unit: 'a year', cur: '£',
    approach: 'Cups per day × average spend per cup × days open',
    steps: [{ t: 'cups sold per day', v: 500 }, { t: 'average spend per cup, including food add-ons', v: 3.5, op: '×', f: 'money' }, { t: 'days open per year', v: 360, op: '×' }],
    check: 'About £1,750 a day: one person at the till serving one customer every minute or so for eight hours.' },
  { id: 'uk-gyms', level: 2, q: 'How big is the UK gym membership market each year?', unit: 'a year', cur: '£',
    approach: 'People × share with a membership × monthly fee × 12',
    steps: [{ t: 'People in the UK', v: 68e6 }, { t: 'have a gym membership', v: 0.15, op: '×', f: 'pct' }, { t: 'average monthly fee', v: 35, op: '×', f: 'money' }, { t: 'months', v: 12, op: '×' }],
    check: 'About 10 million members at budget-to-mid prices; budget chains pull the average fee down.' },
  { id: 'uk-tyres', level: 1, q: 'How many car tyres are sold in the UK each year?', unit: 'tyres a year',
    approach: 'Cars × tyres per car ÷ years a tyre lasts',
    steps: [{ t: 'Cars on UK roads', v: 33e6 }, { t: 'tyres per car', v: 4, op: '×' }, { t: 'years a tyre lasts', v: 4, op: '÷' }],
    check: 'Roughly one tyre per car per year, which matches changing a set every few years.' },
  { id: 'us-toothbrushes', level: 1, q: 'How many toothbrushes and brush heads are bought in the US each year?', unit: 'a year',
    approach: 'People × replacements per year',
    steps: [{ t: 'People in the US', v: 335e6 }, { t: 'replacements per person per year (dentists say every 3 months)', v: 4, op: '×' }],
    check: 'Many people replace less often than advised, so this is closer to a ceiling than a floor.' },
  { id: 'uk-cinema', level: 1, q: 'What do UK cinemas take at the box office each year?', unit: 'a year', cur: '£',
    approach: 'People × cinema visits per year × average ticket price',
    steps: [{ t: 'People in the UK', v: 68e6 }, { t: 'cinema visits per person per year', v: 1.8, op: '×' }, { t: 'average ticket price', v: 8, op: '×', f: 'money' }],
    check: 'About 120 million tickets a year, or around 2.3 million a week across the country.' },
  { id: 'chicago-pianos', level: 2, q: 'How many piano tuners work in Chicago?', unit: 'piano tuners',
    approach: 'Pianos × tunings per year ÷ tunings one tuner can do per year',
    steps: [{ t: 'People in Chicago', v: 2.7e6 }, { t: 'people per household', v: 2.5, op: '÷' }, { t: 'households with a piano', v: 0.05, op: '×', f: 'pct' }, { t: 'tunings per piano per year', v: 1, op: '×' }, { t: 'tunings one tuner does per year (4 a day, 250 days)', v: 1000, op: '÷' }],
    check: 'Schools, churches and concert halls add some pianos, so the true number might be a little higher.' },
  { id: 'uk-bottled-water', level: 1, q: 'How many litres of bottled water does the UK drink each year?', unit: 'litres a year',
    approach: 'People × litres each per year',
    steps: [{ t: 'People in the UK', v: 68e6 }, { t: 'litres each per year (under a litre a week)', v: 40, op: '×' }],
    check: 'Southern European countries drink several times more per person, which fits UK tap-water habits.' },
  { id: 'uk-parcels', level: 2, q: 'How many parcels are delivered to UK homes each year?', unit: 'parcels a year',
    approach: 'Households × parcels per week × weeks',
    steps: [{ t: 'UK households', v: 28e6 }, { t: 'parcels per household per week', v: 2, op: '×' }, { t: 'weeks', v: 52, op: '×' }],
    check: 'Deliveries to businesses come on top, so total parcel volumes will be noticeably higher than this.' },
  { id: 'uk-student-laptops', level: 1, q: 'How many laptops do UK university students buy each year?', unit: 'laptops a year',
    approach: 'Students ÷ years between laptop purchases',
    steps: [{ t: 'University students in the UK', v: 2.9e6 }, { t: 'years between laptop purchases', v: 3, op: '÷' }],
    check: 'Roughly one laptop per student per degree, which is what most students would say.' },
  { id: 'uk-dentists', level: 3, q: 'How many dentists does the UK need?', unit: 'dentists',
    approach: 'Check-ups needed per year ÷ check-ups one dentist can do per year',
    steps: [{ t: 'People in the UK', v: 68e6 }, { t: 'go to the dentist', v: 0.7, op: '×', f: 'pct' }, { t: 'visits each per year', v: 2, op: '×' }, { t: 'visits one dentist handles per year (12 a day, 220 days)', v: 12 * 220, op: '÷' }],
    check: 'About one dentist per 1,900 people. Treatments beyond check-ups would push the number needed up.' },
  { id: 'uk-office-chairs', level: 2, q: 'How many office chairs do UK employers buy each year?', unit: 'chairs a year',
    approach: 'Desk workers ÷ years a chair lasts',
    steps: [{ t: 'People working at a desk in the UK', v: 15e6 }, { t: 'years an office chair lasts', v: 7, op: '÷' }],
    check: 'New offices and hybrid work move this up or down; replacement alone gives the base.' },
  { id: 'us-car-washes', level: 2, q: 'What is the yearly revenue of all car washes in the US?', unit: 'a year', cur: '$',
    approach: 'Vehicles × professional washes per year × average price',
    steps: [{ t: 'Vehicles in the US', v: 290e6 }, { t: 'professional washes per vehicle per year', v: 3, op: '×' }, { t: 'average price', v: 15, op: '×', f: 'money' }],
    check: 'About $45 per vehicle per year: one wash every four months.' },
  { id: 'heathrow-passengers', level: 3, q: 'How many passengers fly from or to Heathrow on an average day?', unit: 'passengers a day',
    approach: 'Supply side: flights per day × seats per flight × share of seats filled',
    steps: [{ t: 'Take-offs and landings per day', v: 1300 }, { t: 'seats per flight', v: 180, op: '×' }, { t: 'seats filled', v: 0.8, op: '×', f: 'pct' }],
    check: 'Long-haul jets carry far more than 180 people, so the true figure is likely higher. Say so as a caveat.' },
  { id: 'uk-pizza', level: 1, q: 'How many delivery pizzas are ordered in the UK each week?', unit: 'pizzas a week',
    approach: 'Households × share ordering this week × pizzas per order',
    steps: [{ t: 'UK households', v: 28e6 }, { t: 'order a delivery pizza in a typical week', v: 0.15, op: '×', f: 'pct' }, { t: 'pizzas per order', v: 1.7, op: '×' }],
    check: 'About 1 million a day, spread over a few thousand pizza takeaways.' },
  { id: 'uk-school-uniform', level: 1, q: 'What do UK families spend on school uniforms each year?', unit: 'a year', cur: '£',
    approach: 'Pupils × spend per pupil per year',
    steps: [{ t: 'School pupils in the UK', v: 10e6 }, { t: 'uniform spend per pupil per year', v: 200, op: '×', f: 'money' }],
    check: 'Secondary uniforms with logos cost more than primary ones, so the average sits between the two.' },
  { id: 'london-ride-hailing', level: 2, q: 'How many ride-hailing trips are taken in London each day?', unit: 'trips a day',
    approach: 'People × share taking a trip today × trips each',
    steps: [{ t: 'People in London', v: 9e6 }, { t: 'take a ride-hailing trip on a given day', v: 0.03, op: '×', f: 'pct' }, { t: 'trips each (often there and back)', v: 1.5, op: '×' }],
    check: 'Visitors and commuters from outside London would add to this.' },
  { id: 'paris-hotel-rooms', level: 3, q: 'How many hotel rooms are there in Paris?', unit: 'rooms',
    approach: 'Guest nights per year ÷ 365 ÷ share of rooms filled ÷ guests per room',
    steps: [{ t: 'Hotel guest nights in Paris per year', v: 50e6 }, { t: 'days in a year', v: 365, op: '÷' }, { t: 'rooms filled on an average night', v: 0.75, op: '÷', f: 'pct' }, { t: 'guests per room', v: 1.6, op: '÷' }],
    check: 'Around 115,000 rooms. Short-term rentals take some visitors who would otherwise stay in hotels.' },
  { id: 'uk-ev-chargers', level: 2, q: 'How many home EV chargers are installed in the UK each year?', unit: 'chargers a year',
    approach: 'New electric cars × share bought by people with a driveway × share who install a charger',
    steps: [{ t: 'New fully electric cars sold in the UK per year', v: 400e3 }, { t: 'buyers with off-street parking', v: 0.6, op: '×', f: 'pct' }, { t: 'of those who install a home charger', v: 0.8, op: '×', f: 'pct' }],
    check: 'Second-hand electric car buyers add more installs each year.' },
]

const short = (x: number) => {
  const a = Math.abs(x), f = (v: number) => (v >= 100 ? Math.round(v).toLocaleString('en-GB') : v >= 10 ? (Math.round(v * 10) / 10).toString() : (Math.round(v * 100) / 100).toString())
  if (a >= 1e9) return `${f(x / 1e9)}B`
  if (a >= 1e6) return `${f(x / 1e6)}M`
  if (a >= 1e4) return `${f(x / 1e3)}k`
  return f(x)
}
export const sizingAnswer = (q: SizingQ) => q.steps.reduce((acc, s, i) => (i === 0 ? s.v : s.op === '÷' ? (s.f === 'pct' ? acc / s.v : acc / s.v) : acc * s.v), 0)
export const fmtStep = (s: SizingStep, cur?: string) => (s.f === 'pct' ? `${Math.round(s.v * 1000) / 10}%` : s.f === 'money' ? `${cur ?? ''}${short(s.v)}` : short(s.v))
export const fmtAnswer = (q: SizingQ, v = sizingAnswer(q)) => `${q.cur ?? ''}${short(v)}`

/** Read "3.4M", "£1.2bn", "450,000", "2.5 billion". Returns null if no number is found. */
export function parseEstimate(raw: string): number | null {
  const m = raw.toLowerCase().replace(/,/g, '').match(/(\d+(?:\.\d+)?)\s*(bn|billion|b|mn|million|m|thousand|k)?/)
  if (!m) return null
  const mult = { bn: 1e9, billion: 1e9, b: 1e9, mn: 1e6, million: 1e6, m: 1e6, thousand: 1e3, k: 1e3 }[m[2] as string] ?? 1
  return parseFloat(m[1]) * mult
}
