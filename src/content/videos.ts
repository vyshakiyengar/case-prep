/** Every short video on the site. Files live in /public/video (made with the PrepForCase video templates). */
export type Video = { id: string; key: string; title: string; group: string; secs: number }
export const VIDEOS: Video[] = [
 {
  "id": "lesson-how-case-interviews-work",
  "key": "how-case-interviews-work",
  "title": "Lesson 1: How case interviews work",
  "group": "Course lessons",
  "secs": 30
 },
 {
  "id": "lesson-the-opening",
  "key": "the-opening",
  "title": "Lesson 2: The opening",
  "group": "Course lessons",
  "secs": 29
 },
 {
  "id": "lesson-structuring",
  "key": "structuring",
  "title": "Lesson 3: Structuring",
  "group": "Course lessons",
  "secs": 29
 },
 {
  "id": "lesson-driving-the-case",
  "key": "driving-the-case",
  "title": "Lesson 4: Driving the case",
  "group": "Course lessons",
  "secs": 32
 },
 {
  "id": "lesson-case-maths",
  "key": "case-maths",
  "title": "Lesson 5: Case maths without the panic",
  "group": "Course lessons",
  "secs": 31
 },
 {
  "id": "lesson-charts-and-exhibits",
  "key": "charts-and-exhibits",
  "title": "Lesson 6: Reading charts and exhibits",
  "group": "Course lessons",
  "secs": 28
 },
 {
  "id": "lesson-market-sizing",
  "key": "market-sizing",
  "title": "Lesson 7: Market sizing",
  "group": "Course lessons",
  "secs": 27
 },
 {
  "id": "lesson-brainstorming",
  "key": "brainstorming",
  "title": "Lesson 8: Brainstorming with structure",
  "group": "Course lessons",
  "secs": 23
 },
 {
  "id": "lesson-recommendation",
  "key": "recommendation",
  "title": "Lesson 9: The recommendation",
  "group": "Course lessons",
  "secs": 26
 },
 {
  "id": "lesson-how-you-come-across",
  "key": "how-you-come-across",
  "title": "Lesson 10: How you come across",
  "group": "Course lessons",
  "secs": 27
 },
 {
  "id": "lesson-fit-interview",
  "key": "fit-interview",
  "title": "Lesson 11: The fit interview",
  "group": "Course lessons",
  "secs": 29
 },
 {
  "id": "framework-acquire-business",
  "key": "acquire-business",
  "title": "Should the client buy this company?",
  "group": "Core frameworks",
  "secs": 46
 },
 {
  "id": "framework-competitive-threat",
  "key": "competitive-threat",
  "title": "How should the client respond to a rival's move?",
  "group": "Core frameworks",
  "secs": 39
 },
 {
  "id": "framework-enter-market",
  "key": "enter-market",
  "title": "Should the client enter this market?",
  "group": "Core frameworks",
  "secs": 42
 },
 {
  "id": "framework-grow-business",
  "key": "grow-business",
  "title": "How can the client grow?",
  "group": "Core frameworks",
  "secs": 34
 },
 {
  "id": "framework-improve-profits",
  "key": "improve-profits",
  "title": "How can the client make more profit?",
  "group": "Core frameworks",
  "secs": 32
 },
 {
  "id": "framework-launch-product",
  "key": "launch-product",
  "title": "How should the client launch the product?",
  "group": "Core frameworks",
  "secs": 41
 },
 {
  "id": "framework-make-investment",
  "key": "make-investment",
  "title": "Should the client make this investment?",
  "group": "Core frameworks",
  "secs": 43
 },
 {
  "id": "framework-optimise-process",
  "key": "optimise-process",
  "title": "How can the client improve this process?",
  "group": "Core frameworks",
  "secs": 40
 },
 {
  "id": "framework-pe-invest",
  "key": "pe-invest",
  "title": "Should the fund invest in this company?",
  "group": "Core frameworks",
  "secs": 48
 },
 {
  "id": "framework-price-product",
  "key": "price-product",
  "title": "What price should the client charge?",
  "group": "Core frameworks",
  "secs": 37
 },
 {
  "id": "framework-reduce-costs",
  "key": "reduce-costs",
  "title": "How can the client cut costs?",
  "group": "Core frameworks",
  "secs": 36
 },
 {
  "id": "maths-big-numbers",
  "key": "maths-big-numbers",
  "title": "Big numbers without losing the zeros",
  "group": "Case maths",
  "secs": 35
 },
 {
  "id": "maths-breakeven",
  "key": "maths-breakeven",
  "title": "Break-even in one line",
  "group": "Case maths",
  "secs": 32
 },
 {
  "id": "maths-growth",
  "key": "maths-growth",
  "title": "Growth rates over several years",
  "group": "Case maths",
  "secs": 31
 },
 {
  "id": "maths-percentages",
  "key": "maths-percentages",
  "title": "Percentages in your head",
  "group": "Case maths",
  "secs": 28
 },
 {
  "id": "maths-rule-of-72",
  "key": "maths-rule-of-72",
  "title": "The rule of 72",
  "group": "Case maths",
  "secs": 21
 },
 {
  "id": "charts-how-to-read",
  "key": "charts-how-to-read",
  "title": "How to read any chart",
  "group": "Skills",
  "secs": 37
 },
 {
  "id": "fit-weak-vs-strong",
  "key": "fit-weak-vs-strong",
  "title": "A weak answer vs a strong one",
  "group": "Skills",
  "secs": 57
 },
 {
  "id": "interviewer-how-to",
  "key": "interviewer-how-to",
  "title": "How to run a case for a friend",
  "group": "Skills",
  "secs": 31
 },
 {
  "id": "sizing-coffee",
  "key": "sizing-coffee",
  "title": "How many cups of coffee do London caf\u00e9s sell on a weekday?",
  "group": "Skills",
  "secs": 36
 }
]
export const videoById = (id: string) => VIDEOS.find((v) => v.id === id)
export const VIDEO_GROUPS = ['Course lessons', 'Core frameworks', 'Case maths', 'Skills'] as const
export const fmtSecs = (s: number) => (s < 60 ? `${s} sec` : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`)
