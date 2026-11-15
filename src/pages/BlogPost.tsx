import { useEffect, useState, type MouseEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { POSTS, TOPICS, PostCard } from './Blog'

type Full = { slug: string; title: string; description: string; topic: string; kind: string; minutes: number; hook: string; body: string; outro: string; related: string[] }

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
  const inTopic = POSTS.filter((p) => p.topic === meta.topic).sort((a, b) => a.order - b.order)
  const i = inTopic.findIndex((p) => p.slug === slug)
  const next = inTopic[i + 1] ?? inTopic[0]
  return (
    <article className="mx-auto max-w-[44rem] pb-10">
      <nav aria-label="Breadcrumb" className="text-[14px] text-muted"><Link to="/blog" className="hover:text-ink">Blog</Link> <span aria-hidden>/</span> <Link to={`/blog?topic=${topic.id}`} className="hover:text-ink">{topic.name}</Link></nav>
      <h1 className="mt-3 font-serif text-[26px] leading-[1.2] text-balance text-ink sm:text-[34px]">{meta.title}</h1>
      <p className="mt-3 text-[14px] text-muted">{meta.kind}, {meta.minutes} min read. Free, no sign-in.</p>
      {failed && <p className="mt-8 rounded-lg bg-white p-4 text-ink-2">This article didn't load. Check your connection and <button type="button" onClick={() => location.reload()} className="text-violet-d underline">try again</button>.</p>}
      {!post && !failed && <div className="mt-8 space-y-3" aria-busy><div className="h-5 w-full animate-pulse rounded bg-line" /><div className="h-5 w-5/6 animate-pulse rounded bg-line" /><div className="h-5 w-4/6 animate-pulse rounded bg-line" /></div>}
      {post && <>
        <p className="mt-7 text-[19px] leading-relaxed text-ink">{post.hook}</p>
        <div className="post mt-6" onClick={onClick} dangerouslySetInnerHTML={{ __html: post.body }} />
        <div className="post mt-10 rounded-xl border border-line bg-white p-5" onClick={onClick}><p><b>One last thing.</b> <span dangerouslySetInnerHTML={{ __html: post.outro }} /></p></div>
        <section className="mt-12">
          <h2 className="mb-3 text-[20px] font-semibold">Read next</h2>
          <div className="grid gap-4 sm:grid-cols-2">{post.related.map((s) => POSTS.find((p) => p.slug === s)).filter((p) => !!p).map((p) => <PostCard key={p!.slug} p={p!} />)}</div>
          <p className="mt-6 text-[15px] text-ink-2">More in <Link to={`/blog?topic=${topic.id}`} className="font-medium text-violet-d underline">{topic.name}</Link>{next && next.slug !== slug && <>, or carry on with <Link to={`/blog/${next.slug}`} className="font-medium text-violet-d underline">{next.title}</Link></>}.</p>
        </section>
      </>}
    </article>
  )
}
