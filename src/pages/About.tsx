import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LinkButton } from '../components/ui'

const LINKEDIN = 'https://www.linkedin.com/in/vyshakiyengar/'

/** Small photo for the sign-off; initials if /vyshak.jpg is missing. */
function Portrait() {
  const [ok, setOk] = useState(true)
  return ok
    ? <img src="/vyshak.jpg" alt="" width={80} height={80} onError={() => setOk(false)} className="h-20 w-20 shrink-0 rounded-[6px] object-cover" />
    : <span aria-hidden className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[6px] bg-ink font-serif text-[20px] text-white">VI</span>
}

function LinkedInIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden className="shrink-0">
      <rect width="24" height="24" rx="4" fill="currentColor" />
      <path fill="#fff" d="M7.1 9.6h2.6V18H7.1zM8.4 5.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zM11.2 9.6h2.5v1.2c.4-.7 1.3-1.4 2.6-1.4 2.7 0 3.2 1.8 3.2 4.1V18h-2.6v-4c0-1 0-2.2-1.3-2.2s-1.6 1-1.6 2.1V18h-2.6z" />
    </svg>
  )
}

export default function About() {
  useEffect(() => {
    const prev = document.title
    document.title = 'About PrepForCase · Vyshak K Iyengar'
    return () => { document.title = prev }
  }, [])
  return (
    <article className="rise mx-auto max-w-[640px] pt-2 pb-8">
      <p className="text-[14px] font-medium text-teal-d">About PrepForCase</p>
      <h1 className="mt-2 text-[30px] leading-[1.1] sm:text-[38px]">Built from what helped me, so it can help you</h1>
      <div className="mt-7 space-y-5 font-serif text-[17px] leading-[1.65] text-ink">
        <p>
          Hi, I'm Vyshak. I'm an alum of London Business School and BCG, and I recently led product strategy for a multi-billion-dollar ads product at Meta.
         
        </p>
        <p>
          Very little here is mine alone. It was gathered from a lot of kind people: classmates who practised cases with me late into the evening,
          consultants who gave up their time to interview me and tell me honestly what wasn't working, alumni who replied to cold messages,
          and the lessons I learned from many casebooks, books and guides that others have generously put together.
        </p>
        <p>
          I wrote down what actually made a difference, cut what didn't, and tried to make it calm and simple to start.
          This is my way of giving back. If it moves you one step closer to an offer, it has done its job.
          And when you get there, pass it on: case with someone who is just starting out.
        </p>
      </div>

      <section className="mt-8 rounded-xl border border-line bg-white p-5">
        <h2 className="text-[18px]">How the content is checked</h2>
        <ul className="mt-3 space-y-2 text-[14.5px] text-ink-2">
          <li>Every number in the cases, charts and drills is recalculated before it goes live.</li>
          <li>The frameworks are checked so each split is complete and doesn't overlap.</li>
          <li>The cases, wording and examples are written for this site. They are not copied from any firm or casebook.</li>
        </ul>
        <p className="mt-4 text-[14px] text-muted">
          Spotted a mistake or have an idea? I'd really like to hear it. You can reach me on <a href={LINKEDIN} target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d hover:underline">LinkedIn</a> or through <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d hover:underline">vyshak.me</a>.
        </p>
      </section>

      <p className="mt-6 text-[13.5px] leading-relaxed text-muted">
        PrepForCase is an independent, personal project. It is not affiliated with or endorsed by BCG, Meta, London Business School or any other firm or school. See the <Link to="/privacy" className="underline hover:text-ink">privacy policy</Link> for how your data is handled.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-6">
        <div className="flex items-center gap-4">
          <Portrait />
          <div className="text-[14.5px] leading-snug">
            <p className="text-ink">Made by <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer me" className="font-medium hover:underline">Vyshak K Iyengar</a>, London</p>
            <a href={LINKEDIN} target="_blank" rel="noopener noreferrer me" className="mt-0.5 inline-flex items-center gap-1.5 text-muted hover:text-[#0A66C2]"><LinkedInIcon />Connect on LinkedIn</a>
          </div>
        </div>
        <LinkButton to="/learn" className="px-5 py-2.5 text-[14.5px]">Start the course</LinkButton>
      </div>
    </article>
  )
}
