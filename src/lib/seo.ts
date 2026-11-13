// Titles, descriptions and preview images for each public page. Used in the browser (to set the
// tab title as you move around) and at build time (tools/seo) to write a separate HTML head for
// every page, so link previews on WhatsApp, LinkedIn and others show the right title and image.
export const SITE = 'https://prepforcase.com'
export interface Meta { title: string; description: string; image: string; type?: 'website' | 'article' }

const IMG = (name: string) => `${SITE}/og/${name}.jpg`

export const PAGES: Record<string, Meta> = {
  '/': { title: 'PrepForCase · Free case interview prep', description: 'Learn the case interview, then practise it 102 times. A free course, 11 core frameworks, 102 cases with worked answers, and drills for maths, structuring, charts and market sizing.', image: IMG('home') },
  '/casebook': { title: 'Casebook: 102 free practice cases with worked answers · PrepForCase', description: '102 original consulting case interviews across every industry, each with clarifying facts, a structure, exhibits, maths and a model recommendation. Free.', image: IMG('casebook') },
  '/learn': { title: 'The case interview course · PrepForCase', description: 'Eleven short lessons on how consultants solve cases: the opening, structuring, case maths, charts, market sizing, brainstorming and the recommendation.', image: IMG('learn') },
  '/frameworks': { title: 'Case interview frameworks: 11 core issue trees · PrepForCase', description: 'Eleven core frameworks that cover most consulting cases, drawn as issue trees, with when to use each and what to ask first.', image: IMG('frameworks') },
  '/perfect-casing': { title: 'Perfect casing: what to say at every stage of a case · PrepForCase', description: 'The moves and phrases of a strong case interview, stage by stage, with a phrase trainer.', image: IMG('perfect-casing') },
  '/glossary': { title: 'Consulting glossary in plain English · PrepForCase', description: 'Business terms you meet in case interviews, explained in plain English with an example each.', image: IMG('glossary') },
  '/formulas': { title: 'Case interview formulas · PrepForCase', description: 'The formulas that come up again and again in case maths: profit, margin, break-even, CAGR, payback and more.', image: IMG('formulas') },
  '/case-types': { title: 'The 17 types of case interview · PrepForCase', description: 'Every kind of case you can get, with the question to ask first, the skeleton structure and the usual trap.', image: IMG('case-types') },
  '/drills': { title: 'Case interview drills: maths, structuring, charts, market sizing · PrepForCase', description: 'Short daily drills for the skills every case uses. Marked as you go, with the quickest method when you miss.', image: IMG('drills') },
  '/drills/maths': { title: 'Case maths drill · PrepForCase', description: 'Quick sums like the ones in a case interview: percentages, margins, growth and break-even, marked as you go.', image: IMG('drills-maths') },
  '/drills/structure': { title: 'Structuring drill · PrepForCase', description: 'Spot the flaw in a structure, or write your own against the clock and compare with a model answer.', image: IMG('drills-structure') },
  '/drills/charts': { title: 'Chart reading drill · PrepForCase', description: 'One chart, one question, sixty seconds. Practise reading case exhibits quickly.', image: IMG('drills-charts') },
  '/drills/sizing': { title: 'Market sizing drill · PrepForCase', description: 'Practise market sizing questions: build the estimate, then compare your number and your logic with a model answer.', image: IMG('drills-sizing') },
  '/interview-formats': { title: 'Case interview formats by firm · PrepForCase', description: 'Interviewer-led and candidate-led cases, written cases, group cases and online assessments: what each looks like and how to prepare.', image: IMG('interview-formats') },
  '/interview-skills': { title: 'Interview skills: thinking and speaking · PrepForCase', description: 'Practical exercises for thinking clearly, speaking calmly and sounding commercial in a case interview.', image: IMG('interview-skills') },
  '/graphs': { title: 'Graph library: 64 case interview charts · PrepForCase', description: 'The chart types you meet in case exhibits, each with practice data and the insight to look for.', image: IMG('graphs') },
  '/interviewer': { title: 'Interviewer mode: give a case to a friend · PrepForCase', description: 'Run a case for a friend with the script, the facts to give when asked, and what a strong answer looks like.', image: IMG('interviewer') },
  '/about': { title: 'About PrepForCase · Vyshak K Iyengar', description: 'Why PrepForCase exists, who made it, and how the content is checked.', image: IMG('home') },
}

export interface CaseLike { id: number; slug: string; title: string; sub: string; type: string; industry: string; diff: 1 | 2 | 3; prompt: string }
const DIFF = { 1: 'easy', 2: 'medium', 3: 'hard' } as const
const clip = (s: string, n = 155) => (s.length <= n ? s : `${s.slice(0, s.lastIndexOf(' ', n - 1))}…`)

export const caseMeta = (c: CaseLike): Meta => ({
  title: `${c.title}: ${c.sub} · Case interview practice`,
  description: clip(`A free ${DIFF[c.diff]} ${c.type.toLowerCase()} case (${c.industry}). ${c.prompt}`),
  image: IMG(`case-${c.slug}`), type: 'article',
})

export interface LessonLike { slug: string; title: string; summary: string; minutes: number }
export const lessonMeta = (l: LessonLike, n: number): Meta => ({
  title: `${l.title} · Case interview course, lesson ${n}`,
  description: clip(`${l.summary} A ${l.minutes}-minute lesson from the free PrepForCase course.`),
  image: IMG(`lesson-${l.slug}`), type: 'article',
})
