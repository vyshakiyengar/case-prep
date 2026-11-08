export interface Lesson {
  slug: string
  title: string
  minutes: number
  summary: string
  sections: { h: string; body: string }[]
  example?: { title: string; body: string; tree?: { root: string; branches: { head: string; items: string[] }[] } }
  takeaways: string[]
  quiz: { q: string; options: string[]; answer: number; why: string }[]
  practice: { label: string; to: string }
  tryIt?: { prompt: string; seconds: number; model: string }
}

import { LESSONS_1 } from './course1'
import { LESSONS_2 } from './course2'

const TRY: Record<string, Lesson['tryIt']> = {
  'how-case-interviews-work': { seconds: 60,
    prompt: 'Your interviewer says: "Our client, a cinema chain, has seen ticket sales fall 15% in two years. What\u2019s going on?" Write the ONE clarifying question that would split this problem in two.',
    model: '"Is the whole cinema industry seeing this decline, or just our client?" If it\u2019s industry-wide, look at streaming, release schedules and habits. If it\u2019s only our client, look at our locations, prices, film choice and experience.' },
  'the-opening': { seconds: 90,
    prompt: 'Prompt: "Our client is a UK gym chain with 50 sites. Membership revenue is up 5%, but profit has halved in a year. The CEO wants to understand why and fix it by next year." Recap it in three sentences or fewer, then write two clarifying questions.',
    model: 'Recap: "A 50-site UK gym chain has growing revenue but profit has halved in a year. We need to find out why and fix it within a year. Is that right?" Questions: (1) "Is there a specific profit target for next year?" (2) "Are other gym chains seeing the same squeeze, or is it just us?" Optional third: "Has anything changed in the last year, such as new sites or a price change?"' },
  'structuring': { seconds: 120,
    prompt: 'A national railway\u2019s passenger complaints have doubled in a year. Draw a structure with 3-4 buckets, then write one sentence saying where you\u2019d start and why.',
    model: 'Buckets: (1) More passengers or easier ways to complain: has volume or the complaints channel changed? (2) Service: punctuality, cancellations, crowding. (3) Experience: stations, staff, ticketing, information. (4) Expectations: fares or promises that changed. Hypothesis: "Complaints doubling in one year suggests a sudden change, so I\u2019d first check whether a new app made complaining easier, then look at punctuality."' },
  'driving-the-case': { seconds: 45,
    prompt: 'You\u2019ve just found that delivery-app commissions explain most of Coastal Brew\u2019s profit fall. Say your next step out loud, in two sentences, the way you would to the interviewer.',
    model: '"So the profit drop is mostly delivery commissions, which matters because they now eat 7.6% of revenue. Next, I\u2019d like to compare the profit on a delivery order with an in-store order, to see whether delivery adds any profit at all. Do we have the economics per order?"' },
  'case-maths': { seconds: 60,
    prompt: 'A factory makes 2.4M units a year running at 75% of capacity. How many extra units could it make at 90%, and what are they worth at $3 contribution each?',
    model: 'Full capacity = 2.4M ÷ 0.75 = 3.2M. At 90% = 2.88M. Extra = 0.48M units × $3 = $1.44M a year. Sanity check: 15 percentage points of 3.2M is 0.48M. ✓' },
  'charts-and-exhibits': { seconds: 60,
    prompt: 'Sales by region, year 1 → year 2 ($M): North 40 → 28, South 35 → 36, West 25 → 26. Give one insight, with a number, and say where you\u2019d look next.',
    model: '"Total sales fell from 100 to 90, a 10% drop, but the North alone fell by 12, more than the entire decline, while the other regions grew slightly. So this is a North problem, not a company-wide one. Next I\u2019d look at what changed in the North: a competitor, store closures or a key customer."' },
  'market-sizing': { seconds: 120,
    prompt: 'Estimate how many coffees are bought in London on a weekday. Say your guess first, then build it up.',
    model: 'Guess: a few million. Build: ~9M residents; about half drink coffee → 4.5M; ~1.5 cups each → ~6.75M cups; ~40% bought out of home → ~2.7M; add commuters and tourists, roughly +0.5M → about 3M bought coffees a day. (Illustrative assumptions for practice.)' },
  'brainstorming': { seconds: 90,
    prompt: 'A UK university wants to attract more international students. Give your ideas in 2-3 buckets, then pick one to start with.',
    model: 'Attract: scholarships in priority countries, partnerships with schools abroad, better rankings visibility. Convert: faster offers, visa and accommodation support, alumni calls with applicants. Access: joint programmes and online pathway courses. Start with conversion: it\u2019s fast and works on students who already applied.' },
  'recommendation': { seconds: 60,
    prompt: 'You found: the bakery chain\u2019s target cities are growing 8% a year; a new site pays back its investment in about 2 years; but opening five cities at once would mean moving three of your best managers. Give a 60-second recommendation out loud.',
    model: '"I recommend expanding, but in two phases rather than all five cities at once. The market grows 8% a year and a site pays back in about two years, so the opportunity is real. The main risk is management: moving three top managers could hurt existing shops. So start with two cities, hire and train managers in parallel, and open the other three once those sites hit their numbers."' },
  'how-you-come-across': { seconds: 60,
    prompt: 'Record yourself answering "Why consulting?" for 60 seconds. Play it back and count your filler words (um, like, sort of). Then record it again with a silent pause wherever a filler was.',
    model: 'Aim for fewer than 3 fillers a minute. A clean shape: one-sentence answer, two reasons each backed by a moment from your own experience, and a close that links to the firm you\u2019re speaking to.' },
  'fit-interview': { seconds: 120,
    prompt: 'Write the Action part of a story about persuading someone you had no authority over. Three sentences, each starting with "I".',
    model: '"I asked the regional head for 20 minutes to understand what worried her about the change. I rebuilt the proposal around her two concerns and ran a two-week pilot in one team so she could see the results. I shared the numbers with her first, before anyone else, so the decision to roll it out was hers."' },
}

const ALL = [...LESSONS_1, ...LESSONS_2]
export const MODULES: { title: string; blurb: string; slugs: string[] }[] = [
  { title: 'Foundations', blurb: 'What interviewers test, and how the case starts.', slugs: ['how-case-interviews-work', 'the-opening'] },
  { title: 'Solving the case', blurb: 'The core skills: structure, driving, maths, charts, sizing, ideas, and the answer.', slugs: ['structuring', 'driving-the-case', 'case-maths', 'charts-and-exhibits', 'market-sizing', 'brainstorming', 'recommendation'] },
  { title: 'Coming across well', blurb: 'Voice, composure and your stories.', slugs: ['how-you-come-across', 'fit-interview'] },
]
export const LESSONS: Lesson[] = MODULES.flatMap((m) => m.slugs).map((s) => ALL.find((l) => l.slug === s)!).map((l) => ({ ...l, tryIt: l.tryIt ?? TRY[l.slug] }))


export const lessonBySlug = (s: string) => LESSONS.find((l) => l.slug === s)
export const totalMinutes = LESSONS.reduce((a, l) => a + l.minutes, 0)
