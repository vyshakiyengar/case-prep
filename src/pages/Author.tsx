import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AUTHOR } from '../content/author'
import { POSTS } from './Blog'

const FEATURED = ['case-interview-guide', 'complete-guide-profitability-cases', 'which-case-framework', 'case-interview-mistakes', 'mckinsey-interview-process', 'big-four-consulting', 'market-sizing-examples', 'pyramid-principle']

export function AuthorPhoto({ size = 40 }: { size?: number }) {
  const [ok, setOk] = useState(true)
  return ok
    ? <img src={AUTHOR.photo} alt="" width={size} height={size} onError={() => setOk(false)} style={{ width: size, height: size }} className="shrink-0 rounded-full object-cover" />
    : <span aria-hidden style={{ width: size, height: size }} className="grid shrink-0 place-items-center rounded-full bg-ink font-serif text-white">V</span>
}

export default function Author() {
  useEffect(() => { document.title = `${AUTHOR.name}, ${AUTHOR.role} · PrepForCase` }, [])
  const list = FEATURED.map((s) => POSTS.find((p) => p.slug === s)).filter((p) => !!p)
  return (
    <article className="mx-auto max-w-[680px] pt-2 pb-12">
      <div className="flex items-center gap-5">
        <AuthorPhoto size={88} />
        <div>
          <h1 className="font-serif text-[32px] leading-tight font-semibold text-ink sm:text-[38px]">{AUTHOR.name}</h1>
          <p className="mt-1 text-[16px] font-medium text-ink">{AUTHOR.role}</p>
          <p className="mt-0.5 text-[14.5px] text-muted">{AUTHOR.creds}</p>
        </div>
      </div>
      <p className="mt-7 font-serif text-[19px] leading-[1.65] text-ink">{AUTHOR.bio}</p>
      <p className="mt-4 font-serif text-[19px] leading-[1.65] text-ink">Everything on PrepForCase is free: the course, 102 practice cases, the drills and {POSTS.length} articles. <Link to="/about" className="underline underline-offset-4">Read why it exists</Link>.</p>
      <div className="mt-6 flex flex-wrap gap-3 text-[14.5px]">
        <a href={AUTHOR.site} rel="me noopener" target="_blank" className="rounded-full border border-line px-4 py-1.5 font-medium text-ink hover:border-ink/40">vyshak.me</a>
        <a href={AUTHOR.linkedin} rel="me noopener noreferrer" target="_blank" className="rounded-full border border-line px-4 py-1.5 font-medium text-ink hover:border-ink/40">LinkedIn</a>
        <a href={AUTHOR.x} rel="me noopener noreferrer" target="_blank" className="rounded-full border border-line px-4 py-1.5 font-medium text-ink hover:border-ink/40">X</a>
      </div>
      <section className="mt-12 border-t border-ink pt-6">
        <h2 className="font-sans text-[15px] font-semibold text-ink">Start with these articles</h2>
        <ul className="mt-2 divide-y divide-line">{list.map((p) => (
          <li key={p!.slug}><Link to={`/blog/${p!.slug}`} className="group block py-5">
            <span className="block font-serif text-[20px] leading-snug font-semibold text-ink group-hover:underline">{p!.title}</span>
            <span className="mt-1.5 line-clamp-2 block font-serif text-[16.5px] leading-snug text-muted">{p!.description}</span>
          </Link></li>
        ))}</ul>
        <p className="mt-4 text-[15px]"><Link to="/blog" className="font-medium text-ink underline underline-offset-4">See all {POSTS.length} articles</Link></p>
      </section>
    </article>
  )
}
