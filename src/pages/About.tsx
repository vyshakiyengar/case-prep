import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { LinkButton } from '../components/ui'

/** Photo if /vyshak.jpg is present, otherwise initials. */
function Portrait() {
  const [ok, setOk] = useState(true)
  return ok
    ? <img src="/vyshak.jpg" alt="Vyshak K Iyengar" width={64} height={64} onError={() => setOk(false)} className="h-16 w-16 rounded-full object-cover ring-2 ring-teal/30 ring-offset-2 ring-offset-canvas" />
    : <span aria-hidden className="flex h-16 w-16 items-center justify-center rounded-full bg-ink font-serif text-[19px] text-white ring-2 ring-teal/30 ring-offset-2 ring-offset-canvas">VI</span>
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
      <h1 className="mt-2 text-[36px] leading-[1.1] sm:text-[44px]">Built from what helped me, so it can help you</h1>
      <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer me" className="group mt-6 flex w-fit items-center gap-3">
        <Portrait />
        <span>
          <span className="block text-[15px] font-medium text-ink group-hover:underline">Vyshak K Iyengar</span>
          <span className="block text-[13.5px] text-muted">London · vyshak.me</span>
        </span>
      </a>

      <div className="mt-7 space-y-5 font-serif text-[19px] leading-[1.65] text-ink">
        <p>
          Hi, I'm Vyshak. I'm an alum of London Business School and BCG, and I recently led product strategy for a multi-billion-dollar ads product at Meta.
         
        </p>
        <p>
          Very little here is mine alone. It was gathered from a lot of kind people: classmates who cased with me late into the evening,
          consultants who gave up their time to interview me and tell me honestly what wasn't working, alumni who replied to cold messages,
          and the many casebooks, books and guides that others have generously put together.
        </p>
        <p>
          I wrote down what actually made a difference, cut what didn't, and tried to make it calm and simple to start.
          This is my way of giving back. If it moves you one step closer to an offer, it has done its job.
          And when you get there, pass it on: case with someone who is just starting out.
        </p>
      </div>

      <section className="mt-10 rounded-2xl border border-line bg-white p-6">
        <h2 className="text-[21px]">How the content is checked</h2>
        <ul className="mt-3 space-y-2 text-[15.5px] text-ink-2">
          <li>Every number in the cases, charts and drills is recalculated before it goes live.</li>
          <li>The frameworks are checked so each split is complete and doesn't overlap.</li>
          <li>The cases, wording and examples are written for this site. They are not copied from any firm or casebook.</li>
        </ul>
        <p className="mt-4 text-[14px] text-muted">
          Spotted a mistake or have an idea? I'd really like to hear it. You can reach me through <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d hover:underline">vyshak.me</a>.
        </p>
      </section>

      <p className="mt-6 text-[13.5px] leading-relaxed text-muted">
        PrepForCase is an independent, personal project. It is not affiliated with or endorsed by BCG, Meta, London Business School or any other firm or school. See the <Link to="/privacy" className="underline hover:text-ink">privacy policy</Link> for how your data is handled.
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
        <LinkButton to="/learn" className="px-5 py-2.5 text-[14.5px]">Start the course <span aria-hidden>→</span></LinkButton>
        <p className="text-[14px] text-muted">Made by <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer me" className="font-medium text-ink hover:underline">Vyshak K Iyengar</a>, London</p>
      </div>
    </article>
  )
}
