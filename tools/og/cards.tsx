// Builds the HTML for every link-preview image (1200 x 630). Run with tools/og/make-og.mjs.
import { renderToStaticMarkup } from 'react-dom/server'
import * as Art from '../../src/components/Art'
import { LESSONS } from '../../src/content/course'
import cases from '../../src/content/cases.json'
import { PAGES } from '../../src/lib/seo'
import { WORDMARK } from '../../src/components/brand'

const DIFF = { 1: 'Easy', 2: 'Medium', 3: 'Hard' } as Record<number, string>
const LESSON_ART: Record<string, keyof typeof Art> = {
  'how-case-interviews-work': 'ArtMap', 'the-opening': 'ArtInterviewer', structuring: 'ArtStructure', 'case-maths': 'ArtMaths',
  'charts-and-exhibits': 'ArtCharts', 'driving-the-case': 'ArtPractise', 'market-sizing': 'ArtSizing', brainstorming: 'ArtThink',
  recommendation: 'ArtImprove', 'how-you-come-across': 'ArtVoice', 'fit-interview': 'ArtStories',
}
const PAGE_ART: Record<string, keyof typeof Art> = {
  home: 'ArtCourse', casebook: 'ArtCasebook', learn: 'ArtCourse', frameworks: 'ArtFrameworks', 'perfect-casing': 'ArtInterviewer', glossary: 'ArtGlossary',
  formulas: 'ArtReference', 'case-types': 'ArtFrameworks', drills: 'ArtPractise', 'drills-maths': 'ArtMaths', 'drills-structure': 'ArtStructure',
  'drills-charts': 'ArtCharts', 'drills-sizing': 'ArtSizing', 'interview-formats': 'ArtInterviewer', 'interview-skills': 'ArtSkills', graphs: 'ArtGraphs', interviewer: 'ArtInterviewer',
}
const logo = () => { const u = WORDMARK.underline; return `<svg viewBox="${WORDMARK.viewBox}" height="34" width="173" style="align-self:flex-start"><path d="${WORDMARK.d}" fill="#14213D"/><rect x="${u.x}" y="${u.y}" width="${u.w}" height="${u.h}" fill="#0E9AA7"/></svg>` }
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;')

function card(chips: string[], title: string, sub: string, art: string) {
  const size = title.length > 34 ? 58 : title.length > 22 ? 66 : 76
  return `<div class="og"><div class="l">${logo()}<div class="chips">${chips.map((c) => `<span>${esc(c)}</span>`).join('')}</div>
    <h1 style="font-size:${size}px">${esc(title)}</h1><p>${esc(sub)}</p><div class="foot">Free at <b>prepforcase.com</b></div></div>
    <div class="r">${art}</div></div>`
}
const A = (k: keyof typeof Art, props: Record<string, unknown> = {}) => { const C = Art[k] as (p: Record<string, unknown>) => JSX.Element; return renderToStaticMarkup(<C {...props} />) }

type C = { id: number; slug: string; title: string; sub: string; type: string; industry: string; diff: number }
export const cards: { name: string; html: string }[] = [
  ...(cases as unknown as C[]).map((c) => ({ name: `case-${c.slug}`, html: card([`Case ${c.id}`, c.type, DIFF[c.diff]], c.title, c.sub, A('ArtSector', { industry: c.industry })) })),
  ...LESSONS.map((l, i) => ({ name: `lesson-${l.slug}`, html: card([`Lesson ${i + 1} of ${LESSONS.length}`, `${l.minutes} min`], l.title, l.summary.length > 120 ? `${l.summary.slice(0, l.summary.lastIndexOf(' ', 118))}…` : l.summary, A(LESSON_ART[l.slug] ?? 'ArtCourse')) })),
  ...Object.entries(PAGES).filter(([p]) => p !== '/' && p !== '/home' && p !== '/about').map(([p, m]) => {
    const name = p.slice(1).replace(/\//g, '-')
    const t = m.title.split(' · ')[0].split(':')[0]
    return { name, html: card(['Free case interview prep'], t, m.description.length > 120 ? `${m.description.slice(0, m.description.lastIndexOf(' ', 118))}…` : m.description, A(PAGE_ART[name] ?? 'ArtCourse')) }
  }),
  { name: 'home', html: card(['Free case interview prep'], 'Learn the case interview. Then practise it 102 times.', 'A course, 11 frameworks, 102 cases with worked answers, and daily drills.', A('ArtCourse')) },
]
