import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'

const H = ({ children }: { children: string }) => <h2 className="pt-2 text-[22px] text-ink">{children}</h2>

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/" aria-label="PrepForCase home"><Logo /></Link>
        <h1 className="mt-8 text-[34px]">Privacy notice</h1>
        <p className="mt-1 text-muted">Last updated 7 November 2026</p>
        <div className="mt-6 space-y-4 text-[16px] leading-[1.7] text-ink-2">
          <p>PrepForCase is a free, personal project run by Vyshak K Iyengar in London, United Kingdom. This notice explains, in plain words, what is collected when you use prepforcase.com, why, and what you can do about it. For any privacy question or request, get in touch through <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d underline">vyshak.me</a>.</p>

          <H>What is collected</H>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><b className="font-medium text-ink">Your account.</b> If you sign in with Google: your name, email address and profile photo. If you sign in with a business school email: your name, that email address, and whether you have confirmed it. Your password is handled by Google Firebase and is never visible to us.</li>
            <li><b className="font-medium text-ink">What you save.</b> Your tracker, case log, drill scores, stories, notes, course progress and dates you enter.</li>
            <li><b className="font-medium text-ink">Activity totals.</b> Counts such as lessons done, cases logged and days active, used to see which parts of the site help people. Your case notes and stories are not included.</li>
            <li><b className="font-medium text-ink">Student details.</b> If you confirm a school email: the address, school, and (if you give them) your programme and graduation year.</li>
            <li><b className="font-medium text-ink">Anonymous page statistics.</b> Vercel Web Analytics counts page views without cookies and without identifying you.</li>
          </ul>

          <H>Why, and on what legal basis</H>
          <p>To run the service you signed up for: saving your progress and showing it back to you (contract). To understand which parts of the site are useful and improve them, using totals only (legitimate interests). To confirm student status for student perks (legitimate interests). Nothing is used for advertising.</p>

          <H>Who can see it</H>
          <p>Only you can read your saved data. If you add a practice partner, they see a short weekly summary: your name, tracker score, cases logged, average score and latest fix. The site owner can see the activity totals and student list described above, and nothing else of yours. Your data is not sold or shared with anyone for marketing.</p>

          <H>Where it is stored</H>
          <p>Saved data is stored in Google Cloud Firestore in London (europe-west2). Sign-in is provided by Google Firebase Authentication, and the website is served by Vercel. These providers may process data outside the UK under their standard data protection terms.</p>

          <H>Cookies and storage</H>
          <p>The site uses your browser's storage only to keep you signed in and remember small settings. There are no advertising or tracking cookies, so there is no cookie banner.</p>

          <H>How long it is kept</H>
          <p>For as long as you have an account. You can delete your account and everything saved with it at any time from <Link to="/settings" className="font-medium text-violet-d underline">Settings</Link>, and you can download a copy of your data there too.</p>

          <H>Your rights</H>
          <p>Under UK data protection law you can ask for a copy of your data, ask for it to be corrected or deleted, or object to how it is used. If you are unhappy with how your data is handled, you can complain to the Information Commissioner's Office at ico.org.uk.</p>

          <H>Changes</H>
          <p>If this notice changes in a way that matters, the date at the top will change and signed-in users will be told on the site.</p>
        </div>
      </div>
    </div>
  )
}
