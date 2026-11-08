import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'

const H = ({ children }: { children: string }) => <h2 className="pt-2 text-[22px] text-ink">{children}</h2>

export default function Terms() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/" aria-label="PrepForCase home"><Logo /></Link>
        <h1 className="mt-8 text-[34px]">Terms of use</h1>
        <p className="mt-1 text-muted">Last updated 7 November 2026</p>
        <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-ink-2">
          <p>PrepForCase is a free, personal project run by Vyshak K Iyengar in London, United Kingdom. By using prepforcase.com you agree to these terms. They're short and in plain words.</p>

          <H>What PrepForCase is</H>
          <p>A free course, practice cases and drills to help you prepare for consulting case interviews. It is for learning only. It doesn't guarantee an interview, an offer or any result, and it isn't professional, financial or careers advice.</p>

          <H>The cases are made up</H>
          <p>Every company, person and number in the cases and drills is invented for practice. Any resemblance to a real business is a coincidence. Industry facts are simplified so the maths is workable in an interview.</p>

          <H>No affiliation</H>
          <p>PrepForCase isn't connected to, or endorsed by, any consulting firm, business school or employer. Names of firms and schools are mentioned only to describe the author's background or common interview formats.</p>

          <H>Using the content</H>
          <p>You're welcome to use everything here for your own preparation, and to practise cases with friends using the interviewer mode. Please don't copy the course, cases or drills into another product, website, book or paid service, or scrape the site. The content is © Vyshak K Iyengar.</p>

          <H>Your account</H>
          <p>Keep your sign-in details to yourself. What you save (notes, logs, stories) stays yours; you can download it or delete your account at any time from <Link to="/settings" className="font-medium text-violet-d underline">Settings</Link>. Accounts used to abuse the site, other users or the service may be removed.</p>

          <H>Accuracy and availability</H>
          <p>The content is checked carefully, but mistakes can slip through. If you spot one, please say so. The site is provided as it is, may change, and may sometimes be unavailable. Nothing in these terms limits liability that can't be limited by law; otherwise, PrepForCase isn't liable for losses from using the site.</p>

          <H>Privacy</H>
          <p>How your data is handled is explained in the <Link to="/privacy" className="font-medium text-violet-d underline">privacy notice</Link>.</p>

          <H>Changes and law</H>
          <p>These terms may change; the date at the top will show when. They are governed by the law of England and Wales. Questions: get in touch through <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d underline">vyshak.me</a>.</p>
        </div>
      </div>
    </div>
  )
}
