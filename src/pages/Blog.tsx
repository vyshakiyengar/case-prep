import { useEffect, useMemo } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import blog from '../content/blogIndex.json'

export type BlogMeta = (typeof blog.posts)[number]
export const TOPICS = blog.topics
export const POSTS = blog.posts
const LEAD = 'case-interview-guide'
const FEATURED = ['case-interview-mistakes', 'which-case-framework', 'case-maths-cheat-sheet']
// Four more starters under the lead story, so the front column reads like a front page
const UNDER_LEAD = POSTS.filter((p) => p.topic === 'start' && p.slug !== LEAD && !FEATURED.includes(p.slug)).sort((a, b) => a.order - b.order).slice(0, 4).map((p) => p.slug)
const ON_FRONT = new Set([LEAD, ...FEATURED, ...UNDER_LEAD])

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[^a-z0-9 ]/g, ' ')
/** Every word typed has to appear somewhere; title matches rank first. */
function search(q: string) {
  const words = norm(q).split(/\s+/).filter(Boolean)
  if (!words.length) return null
  return POSTS.map((p) => {
    const t = norm(p.title), all = `${t} ${norm(p.description)} ${norm(p.k)} ${norm(p.kind)}`
    if (!words.every((w) => all.includes(w))) return null
    return { p, score: words.filter((w) => t.includes(w)).length * 3 + (p.kind === 'Guide' ? 1 : 0) }
  }).filter((x): x is { p: BlogMeta; score: number } => !!x).sort((a, b) => b.score - a.score).map((x) => x.p)
}

const byTopic = (id: string) => POSTS.filter((p) => p.topic === id)
  .sort((a, b) => (a.kind === 'Guide' ? 0 : 1) - (b.kind === 'Guide' ? 0 : 1) || a.order - b.order)
const post = (slug: string) => POSTS.find((p) => p.slug === slug)!

/* ---------- Newspaper pieces ---------- */
const Meta = ({ p }: { p: BlogMeta }) => (
  <p className="mt-2 text-[11.5px] font-medium tracking-[0.06em] text-[#727272] uppercase">{p.minutes} min read</p>
)

/** A story: headline (size set by the slot), optional summary, reading time. */
function Story({ p, size = 'md', summary = true, className = '' }: { p: BlogMeta; size?: 'xl' | 'lg' | 'md' | 'sm'; summary?: boolean; className?: string }) {
  const h = { xl: 'text-[30px] sm:text-[38px] leading-[1.08] font-semibold', lg: 'text-[22px] leading-[1.18] font-semibold', md: 'text-[18px] leading-[1.25] font-semibold', sm: 'text-[16px] leading-[1.3] font-semibold' }[size]
  return (
    <Link to={`/blog/${p.slug}`} className={`group block focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-teal ${className}`}>
      <h3 className={`font-serif tracking-[-0.01em] text-[#121212] group-hover:text-[#4d4d4d] ${h}`}>{p.title}</h3>
      {summary && <p className={`mt-2 font-serif text-[#5a5a5a] ${size === 'xl' ? 'text-[18px] leading-[1.45]' : 'text-[15px] leading-[1.45]'}`}>{p.description}</p>}
      <Meta p={p} />
    </Link>
  )
}

/** Section front: thick rule, section name, then a lead story beside columns of headlines. */
function Section({ t }: { t: (typeof TOPICS)[number] }) {
  const list = byTopic(t.id).filter((p) => !ON_FRONT.has(p.slug))
  if (!list.length) return null
  const [lead, second, ...rest] = list
  const mid = rest.slice(0, 3), side = rest.slice(3, 8)
  return (
    <section id={t.id} className="scroll-mt-24 border-t-2 border-[#121212] pt-3 pb-10">
      <h2 className="mb-5"><Link to={`/blog/topic/${t.id}`} className="font-serif text-[22px] font-bold text-[#121212] hover:underline">{t.name} <span aria-hidden>›</span></Link></h2>
      <div className="grid gap-6 md:grid-cols-[1.35fr_1fr] lg:grid-cols-[1.35fr_1fr_0.9fr] lg:gap-0">
        <div className="lg:pr-6">
          <Story p={lead} size="lg" />
          {second && <Story p={second} size="sm" className="mt-5 border-t border-[#dfdfdf] pt-4" />}
        </div>
        <div className="divide-y divide-[#dfdfdf] border-[#dfdfdf] md:border-l md:pl-6 lg:pr-6 [&>*]:py-4 [&>*:first-child]:pt-0">
          {mid.map((p) => <Story key={p.slug} p={p} size="sm" summary={false} />)}
        </div>
        {side.length > 0 && <div className="border-[#dfdfdf] md:col-span-2 lg:col-span-1 lg:border-l lg:pl-6">
          <ul className="divide-y divide-[#dfdfdf] [&>li]:py-2.5 [&>li:first-child]:pt-0">
            {side.map((p) => <li key={p.slug}><Link to={`/blog/${p.slug}`} className="font-serif text-[15px] leading-[1.35] text-[#121212] hover:underline">{p.title}</Link></li>)}
          </ul>
          {list.length > 10 && <Link to={`/blog/topic/${t.id}`} className="mt-3 inline-block text-[13px] font-semibold text-[#121212] hover:underline">All {list.length} in {t.name.toLowerCase()} ›</Link>}
        </div>}
      </div>
    </section>
  )
}

/** A plain river of stories, two columns, hairlines between: topic pages and search results. */
function River({ items }: { items: BlogMeta[] }) {
  return (
    <div className="grid border-t border-[#dfdfdf] sm:grid-cols-2 sm:gap-x-10">
      {items.map((p) => <Story key={p.slug} p={p} size="md" className="border-b border-[#dfdfdf] py-5" />)}
    </div>
  )
}

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const { topic: hub } = useParams()
  const q = params.get('q') ?? ''
  const topic = hub ?? params.get('topic') ?? ''
  const hubTopic = TOPICS.find((t) => t.id === topic)
  useEffect(() => { document.title = hubTopic ? `${hubTopic.head} · PrepForCase blog` : 'The PrepForCase blog · PrepForCase' }, [hubTopic])
  useEffect(() => { document.body.classList.add('bg-white'); return () => document.body.classList.remove('bg-white') }, [])
  const results = useMemo(() => search(q), [q])
  const setQ = (v: string) => { const n = new URLSearchParams(params); if (v) n.set('q', v); else n.delete('q'); setParams(n, { replace: true }) }
  const today = new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })

  return (
    // A white sheet of newsprint inside the app's grey canvas
    <div className="pt-1 pb-10">
      <div className="mx-auto max-w-6xl">
        {/* Masthead */}
        <header className="text-center">
          <div className="flex items-center justify-between gap-4 text-[12px] text-[#333]">
            <span className="hidden text-left sm:block"><b className="font-semibold">{today}</b><br />{POSTS.length} free articles · No sign-in, no paywall</span>
            <div className="relative w-full sm:w-60">
              <label htmlFor="blog-q" className="sr-only">Search the blog</label>
              <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-2.5 h-4 w-4 -translate-y-1/2 text-[#727272]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
              <input id="blog-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder={`Search ${POSTS.length} articles`}
                className="w-full border border-[#ccc] bg-white py-1.5 pr-2 pl-8 text-[14px] text-[#121212] outline-none placeholder:text-[#8a8a8a] focus:border-[#121212]" />
            </div>
          </div>
          {hubTopic ? (
            <>
              <nav aria-label="Breadcrumb" className="mt-2 text-[12px] font-semibold tracking-[0.08em] uppercase"><Link to="/blog" className="text-[#121212] hover:underline">The PrepForCase Blog</Link></nav>
              <h1 className="mt-1 font-serif text-[34px] leading-[1.05] font-bold tracking-[-0.015em] text-[#121212] sm:text-[48px]">{hubTopic.name}</h1>
              <p className="mx-auto mt-2 max-w-2xl font-serif text-[17px] text-[#5a5a5a]">{hubTopic.head} {byTopic(hubTopic.id).length} free articles.</p>
            </>
          ) : (
            <>
              <h1 className="mt-1 font-serif text-[40px] leading-none font-bold tracking-[-0.02em] text-[#121212] sm:mt-0 sm:text-[64px]">The PrepForCase Blog</h1>
              <p className="mt-2 font-serif text-[15px] text-[#5a5a5a] italic">Case interviews and consulting careers, explained plainly</p>
            </>
          )}
        </header>

        {/* Section bar: double rule above, hairline below, like a front page */}
        <div className="sticky top-0 z-10 mt-5 border-t-[3px] border-double border-[#121212] bg-white">
          <nav aria-label="Blog sections" className="flex gap-x-5 gap-y-1 overflow-x-auto border-b border-[#121212] py-2 text-[13px] whitespace-nowrap lg:flex-wrap lg:justify-center lg:overflow-visible">
            <Link to="/blog" aria-current={!topic ? 'page' : undefined} className={`py-1 ${!topic ? 'font-bold text-[#121212] underline underline-offset-[6px]' : 'text-[#333] hover:underline'}`}>Front page</Link>
            {TOPICS.map((t) => (
              <Link key={t.id} to={`/blog/topic/${t.id}`} aria-current={topic === t.id ? 'page' : undefined}
                className={`py-1 ${topic === t.id ? 'font-bold text-[#121212] underline underline-offset-[6px]' : 'text-[#333] hover:underline'}`}>{t.name}</Link>
            ))}
          </nav>
        </div>

        <div className="mt-6">
          {results ? (
            <section aria-live="polite">
              <p className="mb-3 font-serif text-[17px] text-[#121212]">{results.length ? <>{results.length} result{results.length > 1 ? 's' : ''} for <b>“{q}”</b></> : <>Nothing matches “{q}”. Try a shorter word, like “maths” or “fit”.</>}</p>
              {results.length > 0 && <River items={results.slice(0, 60)} />}
            </section>
          ) : hubTopic ? (
            <River items={byTopic(hubTopic.id)} />
          ) : (
            <>
              {/* Above the fold: the lead story, then the three other starter guides */}
              <section aria-label="Start here" className="grid gap-6 pb-10 lg:grid-cols-[2fr_1fr] lg:gap-0">
                <div className="lg:border-r lg:border-[#dfdfdf] lg:pr-8">
                  <p className="mb-2 text-[11.5px] font-bold tracking-[0.08em] text-[#121212] uppercase">Start here</p>
                  <Story p={post(LEAD)} size="xl" />
                  <div className="mt-6 grid gap-x-8 border-t border-[#dfdfdf] sm:grid-cols-2">
                    {UNDER_LEAD.map((s) => <Story key={s} p={post(s)} size="sm" className="border-b border-[#dfdfdf] py-4 sm:[&:nth-last-child(-n+2)]:border-b-0" />)}
                  </div>
                </div>
                <div className="divide-y divide-[#dfdfdf] border-t border-[#dfdfdf] pt-4 lg:border-t-0 lg:pt-0 lg:pl-8 [&>*]:py-4 [&>*:first-child]:pt-0">
                  {FEATURED.map((s) => <Story key={s} p={post(s)} size="md" />)}
                </div>
              </section>
              {TOPICS.map((t) => <Section key={t.id} t={t} />)}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
