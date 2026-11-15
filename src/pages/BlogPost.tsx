import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { POSTS, TOPICS } from './Blog'
import { AuthorPhoto } from './Author'
import { AUTHOR } from '../content/author'

/** Where to practise what each topic teaches: the article leads into the tools. */
const PRACTICE: Record<string, { to: string; t: string; d: string }> = {
  start: { to: '/learn', t: 'Start the free course', d: 'Eleven short lessons, each with an exercise and a quiz.' },
  stages: { to: '/perfect-casing', t: 'Practise each stage with flashcards', d: 'What to do and say at every stage of a case.' },
  frameworks: { to: '/drills/structure', t: 'Practise structuring against the clock', d: 'Over 100 prompts with model structures and a two-minute timer.' },
  concepts: { to: '/casebook', t: 'Use it in a real case', d: '102 practice cases with worked answers.' },
  industries: { to: '/casebook', t: 'Try a case in this industry', d: 'The casebook covers every major industry, with worked answers.' },
  careers: { to: '/casebook', t: 'Start practising cases today', d: '102 free cases, each with an interviewer script so a friend can run it.' },
  resources: { to: '/casebook', t: 'Practise with free cases', d: '102 cases with worked answers. No sign-up needed to start.' },
  practice: { to: '/drills/structure', t: 'Keep going in the structuring drill', d: 'Timed prompts and model answers.' },
  maths: { to: '/drills/maths', t: 'Drill case maths', d: 'Ten-minute sets of percentages, growth, break-even and big numbers.' },
  sizing: { to: '/drills/sizing', t: 'Try a sizing question yourself', d: 'Build an estimate step by step and compare with a model answer.' },
  fit: { to: '/stories', t: 'Build your fit stories', d: 'Write and save six to eight stories you can reuse.' },
}

type Full = { slug: string; title: string; description: string; topic: string; kind: string; minutes: number; hook: string; body: string; outro: string; related: string[] }

/** Share on phones (the system share sheet), copy the link elsewhere. */
function ShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)
  const share = async () => {
    const url = location.href.split('#')[0]
    try {
      if (navigator.share) { await navigator.share({ title, url }); return }
      await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 2000)
    } catch { /* closed the share sheet */ }
  }
  return (
    <button type="button" onClick={share} className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-[13.5px] font-medium text-ink hover:border-ink/40" aria-live="polite">
      <svg aria-hidden viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v7a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-7M16 6l-4-4-4 4M12 2v13" /></svg>
      {copied ? 'Link copied' : 'Share'}
    </button>
  )
}

/** A thin bar across the top that fills as you read. */
function ReadingProgress() {
  const [p, setP] = useState(0)
  useEffect(() => {
    const on = () => { const h = document.documentElement; const max = h.scrollHeight - h.clientHeight; setP(max > 0 ? Math.min(1, h.scrollTop / max) : 0) }
    on(); window.addEventListener('scroll', on, { passive: true }); window.addEventListener('resize', on)
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on) }
  }, [])
  return <div aria-hidden className="fixed inset-x-0 top-0 z-40 h-[3px]"><div className="h-full origin-left bg-teal transition-transform duration-150 motion-reduce:transition-none" style={{ transform: `scaleX(${p})` }} /></div>
}

export default function BlogPost() {
  const { slug = '' } = useParams()
  const nav = useNavigate()
  const meta = POSTS.find((p) => p.slug === slug)
  const [post, setPost] = useState<Full | null>(null)
  const [failed, setFailed] = useState(false)
  useEffect(() => {
    setPost(null); setFailed(false)
    if (!meta) return
    document.title = `${meta.title} · PrepForCase`
    fetch(`/blog-data/${slug}.json`).then((r) => (r.ok ? r.json() : Promise.reject())).then(setPost).catch(() => setFailed(true))
    window.scrollTo(0, 0)
  }, [slug, meta])
  // Glossary links like #ebitda: scroll to the entry once the article has loaded
  useEffect(() => {
    if (!post || !location.hash) return
    const el = document.getElementById(decodeURIComponent(location.hash.slice(1)))
    if (el) { el.scrollIntoView({ block: 'start' }); el.classList.add('bg-teal-l') }
  }, [post])
  // Links inside the article move around the site without a full page load
  const onClick = (e: MouseEvent) => {
    const a = (e.target as HTMLElement).closest('a')
    const href = a?.getAttribute('href')
    if (!a || !href?.startsWith('/') || e.metaKey || e.ctrlKey || e.shiftKey) return
    e.preventDefault()
    if (href.startsWith(`/blog/${slug}#`)) { const el = document.getElementById(href.split('#')[1]); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); return }
    nav(href)
  }
  if (!meta) return <div className="mx-auto max-w-2xl py-10"><h1 className="font-serif text-[30px]">This article doesn't exist</h1><p className="mt-2 text-ink-2">It may have moved. <Link to="/blog" className="text-violet-d underline">See all articles</Link>.</p></div>
  const topic = TOPICS.find((t) => t.id === meta.topic)!
  return (
    <article className="mx-auto max-w-[680px] pb-12">
      <ReadingProgress />
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted"><Link to="/blog" className="hover:text-ink">Blog</Link> <span aria-hidden>/</span> <Link to={`/blog/topic/${topic.id}`} className="font-medium text-teal-d hover:text-ink">{topic.name}</Link></nav>
      <h1 className="mt-4 font-serif text-[30px] leading-[1.15] font-semibold tracking-[-0.02em] text-balance text-ink sm:text-[42px]">{meta.title}</h1>
      <p className="mt-3 font-serif text-[19px] leading-snug text-muted sm:text-[21px]">{meta.description}</p>
      <div className="mt-6 flex items-center gap-3 border-y border-line py-4">
        <Link to={AUTHOR.path} aria-label={`About ${AUTHOR.name}`} className="shrink-0"><AuthorPhoto size={44} /></Link>
        <div className="text-[14px] leading-snug">
          <p><Link to={AUTHOR.path} className="font-medium text-ink hover:underline">{AUTHOR.name}</Link> <span className="text-muted">· {AUTHOR.role}</span></p>
          <p className="text-muted">{meta.minutes} min read · Free, no sign-in</p>
        </div>
        <ShareButton title={meta.title} />
      </div>
      {failed && <p className="mt-8 rounded-lg bg-white p-4 text-ink-2">This article didn't load. Check your connection and <button type="button" onClick={() => location.reload()} className="text-violet-d underline">try again</button>.</p>}
      {!post && !failed && <div className="mt-10 space-y-3" aria-busy><div className="h-5 w-full animate-pulse rounded bg-line" /><div className="h-5 w-5/6 animate-pulse rounded bg-line" /><div className="h-5 w-4/6 animate-pulse rounded bg-line" /></div>}
      {post && <>
        <p className="lede mt-9">{post.hook}</p>
        <div className="post mt-[1.15em]" onClick={onClick} dangerouslySetInnerHTML={{ __html: post.body }} />
        {PRACTICE[meta.topic] && <Link to={PRACTICE[meta.topic].to} className="group mt-14 flex items-center justify-between gap-4 rounded-2xl bg-ink p-6 text-white hover:bg-ink/90">
          <span><span className="block text-[13px] text-white/70">Practise what you just read</span><span className="mt-0.5 block text-[18px] font-semibold">{PRACTICE[meta.topic].t}</span><span className="mt-1 block text-[14.5px] text-white/80">{PRACTICE[meta.topic].d}</span></span>
          <span aria-hidden className="shrink-0 rounded-full bg-white px-4 py-2 text-[14px] font-medium text-ink group-hover:bg-teal-l">Start</span>
        </Link>}
        <div className="post mt-8 border-t border-line pt-6 text-[17px]" onClick={onClick}><p><span dangerouslySetInnerHTML={{ __html: post.outro }} /></p></div>
        <aside className="mt-12 flex gap-4 rounded-2xl bg-canvas p-5 sm:p-6">
          <Link to={AUTHOR.path} aria-label={`About ${AUTHOR.name}`} className="shrink-0"><AuthorPhoto size={56} /></Link>
          <div>
            <p className="text-[13px] text-muted">About the founder</p>
            <p className="mt-0.5 text-[17px] font-semibold text-ink"><Link to={AUTHOR.path} className="hover:underline">{AUTHOR.name}</Link></p>
            <p className="text-[14px] text-muted">{AUTHOR.creds}</p>
            <p className="mt-2 font-serif text-[16.5px] leading-snug text-ink-2">{AUTHOR.bio}</p>
          </div>
        </aside>
        <section className="mt-14 border-t border-ink pt-6">
          <h2 className="font-sans text-[15px] font-semibold text-ink">Read next</h2>
          <ul className="mt-2 divide-y divide-line">{post.related.map((s) => POSTS.find((p) => p.slug === s)).filter((p) => !!p).map((p) => (
            <li key={p!.slug}><Link to={`/blog/${p!.slug}`} className="group block py-5">
              <span className="block font-serif text-[20px] leading-snug font-semibold text-ink group-hover:underline">{p!.title}</span>
              <span className="mt-1.5 line-clamp-2 block font-serif text-[16.5px] leading-snug text-muted">{p!.description}</span>
              <span className="mt-2 block text-[13px] text-muted">{p!.kind} · {p!.minutes} min read</span>
            </Link></li>
          ))}</ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/learn" className="rounded-full bg-ink px-5 py-2.5 text-[15px] font-medium text-white hover:bg-ink/90">Back to the course</Link>
            <Link to="/blog" className="rounded-full border border-line px-5 py-2.5 text-[15px] font-medium text-ink hover:border-ink/40">All articles</Link>
          </div>
          <p className="mt-4 text-[15px] text-ink-2">See every article in <Link to={`/blog/topic/${topic.id}`} className="font-medium text-ink underline underline-offset-4">{topic.name}</Link>.</p>
        </section>
      </>}
    </article>
  )
}
