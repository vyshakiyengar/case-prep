import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

/** Three blog articles that go deeper on what this page covers. Kept small and at the bottom so pages stay calm. */
const READ: Record<string, string[]> = {
  '/learn': ['case-interview-guide', 'how-businesses-make-money', 'coming-from-a-non-business-background'],
  '/learn/case-map': ['what-to-say-in-a-case-interview', 'note-taking-in-case-interviews', 'case-interview-mistakes'],
  '/learn/whats-next': ['practise-case-interviews-alone', 'practising-with-a-partner', 'three-week-case-interview-plan'],
  '/learn/how-case-interviews-work': ['case-interview-guide', 'case-interview-mistakes', 'online-tests-and-digital-cases'],
  '/learn/the-opening': ['note-taking-in-case-interviews', 'case-stage-clarify', 'case-interview-nerves'],
  '/learn/structuring': ['mece-explained', 'hypothesis-driven-thinking', 'which-case-framework'],
  '/learn/driving-the-case': ['80-20-rule-in-cases', 'so-what-thinking', 'hypothesis-driven-thinking'],
  '/learn/case-maths': ['case-maths-cheat-sheet', 'mental-maths-practice-questions', 'fixed-variable-costs-operating-leverage'],
  '/learn/charts-and-exhibits': ['so-what-thinking', 'reading-a-profit-and-loss-statement', 'maths-percentages'],
  '/learn/market-sizing': ['numbers-worth-knowing', 'market-sizing-examples', 'market-sizing-london-coffee'],
  '/learn/brainstorming': ['simple-splits-framework', 'mece-explained', 'cost-levers-framework'],
  '/learn/recommendation': ['pyramid-principle', 'risks-framework', 'case-stage-recommend'],
  '/learn/how-you-come-across': ['case-interview-nerves', 'speaking-clearly-in-case-interviews', 'pyramid-principle'],
  '/learn/fit-interview': ['fit-interview-questions', 'coming-from-a-non-business-background', 'after-a-consulting-rejection'],
  '/perfect-casing': ['what-to-say-in-a-case-interview', 'case-interview-mistakes', 'note-taking-in-case-interviews'],
  '/frameworks': ['which-case-framework', 'mece-explained', 'how-businesses-make-money'],
  '/case-types': ['which-case-framework', 'network-effects-and-platforms', 'unit-economics-explained'],
  '/formulas': ['time-value-of-money', 'unit-economics-explained', 'fixed-variable-costs-operating-leverage'],
  '/glossary': ['how-businesses-make-money', 'unit-economics-explained', 'reading-a-profit-and-loss-statement'],
  '/graphs': ['so-what-thinking', 'charts-and-exhibits', 'reading-a-profit-and-loss-statement'],
  '/casebook': ['practising-with-a-partner', 'practise-case-interviews-alone', 'case-interview-mistakes'],
  '/drills': ['practise-case-interviews-alone', 'daily-exercises-for-case-interviews', 'three-week-case-interview-plan'],
  '/drills/structure': ['mece-explained', 'quick-structuring-prompts', 'which-case-framework'],
  '/drills/maths': ['case-maths-cheat-sheet', 'maths-percentages', 'maths-breakeven'],
  '/drills/charts': ['so-what-thinking', 'charts-and-exhibits', 'reading-a-profit-and-loss-statement'],
  '/drills/sizing': ['numbers-worth-knowing', 'market-sizing-examples', 'market-sizing-framework'],
  '/interviewer': ['practising-with-a-partner', 'what-to-say-in-a-case-interview', 'case-interview-mistakes'],
  '/interview-skills': ['case-interview-nerves', 'pre-interview-warm-up', 'pyramid-principle'],
  '/stories': ['fit-interview-questions', 'coming-from-a-non-business-background', 'after-a-consulting-rejection'],
}
const CASE = ['what-to-say-in-a-case-interview', 'so-what-thinking', 'case-interview-mistakes']

type Meta = { slug: string; title: string; kind: string; minutes: number }

export function FurtherReading() {
  const { pathname } = useLocation()
  const slugs = READ[pathname] ?? (pathname.startsWith('/casebook/') ? CASE : null)
  const [posts, setPosts] = useState<Meta[] | null>(null)
  useEffect(() => {
    if (!slugs || posts) return
    import('../content/blogIndex.json').then((m) => setPosts(m.default.posts as Meta[])).catch(() => {})
  }, [slugs, posts])
  if (!slugs || !posts) return null
  const list = slugs.map((s) => posts.find((p) => p.slug === s)).filter((p): p is Meta => !!p)
  return (
    <aside aria-labelledby="further-reading" className="mt-12 border-t border-line pt-6">
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h2 id="further-reading" className="font-sans text-[15px] font-semibold text-ink">Want to go deeper? Read these on the blog</h2>
        <Link to="/blog" className="shrink-0 text-[13.5px] font-medium text-violet-d hover:underline">All articles</Link>
      </div>
      <ul className="-mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1 sm:mx-0 sm:grid sm:grid-cols-3 sm:overflow-visible sm:px-0">
        {list.map((p) => (
          <li key={p.slug} className="w-[78%] shrink-0 snap-start sm:w-auto">
            <Link to={`/blog/${p.slug}`} className="group flex h-full flex-col rounded-lg border border-line bg-white p-3.5 hover:border-ink/40">
              <span className="text-[12px] text-muted">{p.kind}, {p.minutes} min read</span>
              <span className="mt-1 line-clamp-3 text-[14px] leading-snug font-medium text-ink group-hover:text-violet-d">{p.title}</span>
              <span className="mt-auto pt-2 text-[13px] font-medium text-teal-d">Read the article <span aria-hidden>›</span></span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
