import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import blog from '../content/blogIndex.json'

export type BlogMeta = (typeof blog.posts)[number]
export const TOPICS = blog.topics
export const POSTS = blog.posts
const FEATURED = ['case-interview-guide', 'case-interview-mistakes', 'which-case-framework', 'case-maths-cheat-sheet']

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

export function PostCard({ p, big = false }: { p: BlogMeta; big?: boolean }) {
  return (
    <Link to={`/blog/${p.slug}`} className="group block rounded-xl border border-line bg-white p-5 transition-colors hover:border-ink/40 focus-visible:outline-2 focus-visible:outline-teal">
      <p className="text-[13px] text-muted">{p.kind}, {p.minutes} min read</p>
      <h3 className={`mt-1 leading-snug font-semibold text-ink group-hover:text-violet-d ${big ? 'font-serif text-[21px]' : 'text-[16px]'}`}>{p.title}</h3>
      <p className="mt-1.5 line-clamp-2 text-[14.5px] text-ink-2">{p.description}</p>
    </Link>
  )
}

export default function Blog() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const topic = params.get('topic') ?? ''
  const [shown, setShown] = useState<Record<string, number>>({})
  const results = useMemo(() => search(q), [q])
  const set = (k: string, v: string) => { const n = new URLSearchParams(params); if (v) n.set(k, v); else n.delete(k); setParams(n, { replace: true }) }
  const topics = TOPICS.filter((t) => !topic || t.id === topic)
  return (
    <div className="mx-auto max-w-5xl">
      <header className="mb-6">
        <h1 className="font-serif text-[34px] leading-tight sm:text-[42px]">The PrepForCase blog</h1>
        <p className="mt-2 max-w-2xl text-[17px] text-ink-2">{POSTS.length} free articles on case interviews: how cases work, frameworks, maths, market sizing, practice questions and the fit interview. No sign-in, no paywall.</p>
      </header>

      <div className="sticky top-0 z-10 -mx-4 mb-6 bg-canvas/95 px-4 py-3 backdrop-blur sm:mx-0 sm:px-0">
        <label htmlFor="blog-q" className="sr-only">Search the blog</label>
        <div className="relative">
          <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 text-muted" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></svg>
          <input id="blog-q" type="search" value={q} onChange={(e) => set('q', e.target.value)} placeholder="Search, e.g. profitability, break-even, recap, tell me about yourself"
            className="w-full rounded-xl border border-line bg-white py-3.5 pr-4 pl-12 text-[16px] shadow-[0_8px_24px_-18px_rgba(15,27,51,.5)] outline-none focus:border-teal focus:ring-2 focus:ring-teal/30" />
        </div>
        {!q && <div className="mt-3 flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by topic">
          {[{ id: '', name: 'All topics' }, ...TOPICS].map((t) => {
            const n = t.id ? POSTS.filter((p) => p.topic === t.id).length : POSTS.length
            return <button key={t.id} type="button" aria-pressed={topic === t.id} onClick={() => set('topic', t.id)}
              className={`shrink-0 rounded-full border px-3.5 py-1.5 text-[14px] font-medium ${topic === t.id ? 'border-ink bg-ink text-white' : 'border-line bg-white text-ink hover:border-ink/40'}`}>{t.name} <span className={topic === t.id ? 'text-white/70' : 'text-muted'}>{n}</span></button>
          })}
        </div>}
      </div>

      {results ? (
        <section aria-live="polite">
          <p className="mb-4 text-[15px] text-muted">{results.length ? `${results.length} article${results.length > 1 ? 's' : ''} for "${q}"` : `Nothing matches "${q}". Try a shorter word, like "maths" or "fit".`}</p>
          <div className="grid gap-4 sm:grid-cols-2">{results.slice(0, 60).map((p) => <PostCard key={p.slug} p={p} />)}</div>
        </section>
      ) : (
        <>
          {!topic && <section className="mb-10">
            <h2 className="mb-3 text-[20px] font-semibold">New to case interviews? Read these four guides first</h2>
            <div className="grid gap-4 sm:grid-cols-2">{FEATURED.map((s) => POSTS.find((p) => p.slug === s)!).map((p) => <PostCard key={p.slug} p={p} big />)}</div>
          </section>}
          {topics.map((t) => {
            const list = POSTS.filter((p) => p.topic === t.id && (topic || !FEATURED.includes(p.slug))).sort((a, b) => (a.kind === 'Guide' ? 0 : 1) - (b.kind === 'Guide' ? 0 : 1) || a.order - b.order)
            const n = topic ? list.length : shown[t.id] ?? 6
            return (
              <section key={t.id} id={t.id} className="mb-10 scroll-mt-32">
                <div className="mb-3 flex items-baseline justify-between gap-3">
                  <h2 className="text-[20px] font-semibold">{t.head} <span className="text-[15px] font-normal text-muted">{list.length}</span></h2>
                  {!topic && <button type="button" onClick={() => set('topic', t.id)} className="shrink-0 text-[14px] font-medium text-violet-d hover:underline">See all {list.length}</button>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{list.slice(0, n).map((p) => <PostCard key={p.slug} p={p} />)}</div>
                {n < list.length && <button type="button" onClick={() => setShown((s) => ({ ...s, [t.id]: list.length }))} className="mt-4 rounded-full border border-line bg-white px-4 py-2 text-[14px] font-medium hover:border-ink/40">Show {list.length - n} more</button>}
              </section>
            )
          })}
        </>
      )}
    </div>
  )
}
