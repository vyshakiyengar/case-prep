// Bundled by build-seo.mjs: gathers every public page's meta from the site's own content.
import { PAGES, caseMeta, lessonMeta, SITE } from '../../src/lib/seo'
import { LESSONS } from '../../src/content/course'
import cases from '../../src/content/cases.json'
import caseIndex from '../../src/content/caseIndex.json'
import blog from '../../src/content/blogIndex.json'
type C = Parameters<typeof caseMeta>[0]
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
const li = (href: string, t: string, d = '') => `<li><a href="${href}">${esc(t)}</a>${d ? ` ${esc(d)}` : ''}</li>`
const byTopic = (id: string) => blog.posts.filter((p) => p.topic === id).sort((a, b) => a.order - b.order)
const HOME_BODY = `<h1>PrepForCase: free case interview prep</h1><p>${esc(PAGES['/'].description)}</p>
<h2>Start here</h2><ul>${li('/learn', 'The free case interview course', 'Eleven short lessons on how consultants solve cases.')}${li('/casebook', 'The casebook', '102 practice cases with worked answers and interviewer scripts.')}${li('/drills', 'Drills', 'Case maths, structuring, chart reading and market sizing.')}${li('/frameworks', 'Frameworks', 'The 11 core frameworks, drawn step by step.')}${li('/blog', 'The blog', `${blog.posts.length} free articles on case interviews and consulting careers.`)}</ul>
<h2>Popular guides</h2><ul>${['case-interview-guide', 'complete-guide-profitability-cases', 'which-case-framework', 'case-interview-mistakes', 'market-sizing-examples', 'mckinsey-interview-process'].map((s) => blog.posts.find((p) => p.slug === s)).filter((p) => !!p).map((p) => li(`/blog/${p!.slug}`, p!.title)).join('')}</ul>
<h2>The course</h2><ol>${LESSONS.map((l) => li(`/learn/${l.slug}`, l.title, l.summary)).join('')}</ol>`
const BLOG_BODY = `<h1>The PrepForCase blog</h1><p>${blog.posts.length} free articles on case interviews and consulting careers.</p>` +
  blog.topics.map((t) => `<h2><a href="/blog/topic/${t.id}">${esc(t.head)}</a></h2><ul>${byTopic(t.id).map((p) => li(`/blog/${p.slug}`, p.title)).join('')}</ul>`).join('')
export const routes = [
  ...Object.entries(PAGES).map(([path, m]) => ({ path, ...m, body: path === '/' ? HOME_BODY : path === '/blog' ? BLOG_BODY : undefined })),
  ...blog.topics.map((t) => ({ path: `/blog/topic/${t.id}`, title: `${t.head} · PrepForCase blog`, description: `${byTopic(t.id).length} free articles: ${byTopic(t.id).slice(0, 3).map((p) => p.title.replace(/\?$/, '')).join('; ')}.`.slice(0, 158), image: `${SITE}/og/home.jpg`,
    body: `<p><a href="/blog">PrepForCase blog</a></p><h1>${esc(t.head)}</h1><ul>${byTopic(t.id).map((p) => li(`/blog/${p.slug}`, p.title, p.description)).join('')}</ul>` })),
  ...(cases as unknown as C[]).map((c) => ({ path: `/casebook/${c.slug}`, ...caseMeta(c), caseId: c.id })),
  ...LESSONS.map((l, i) => ({ path: `/learn/${l.slug}`, ...lessonMeta(l, i + 1), body: `<h1>${esc(l.title)}</h1><p>${esc(l.summary)}</p>${l.sections.map((s) => `<h2>${esc(s.h)}</h2>${s.body}`).join('')}` })),
  ...blog.posts.map((p) => ({ path: `/blog/${p.slug}`, title: `${p.title} · PrepForCase`, description: p.description, image: `${SITE}/og/home.jpg`, type: 'article', blog: p.slug })),
]
export { SITE }
export const indexInSync = caseIndex.length === cases.length && caseIndex.every((c, i) => c.slug === (cases as unknown as C[])[i].slug && c.title === (cases as unknown as C[])[i].title)
