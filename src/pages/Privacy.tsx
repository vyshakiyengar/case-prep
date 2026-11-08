import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'

const H = ({ children }: { children: string }) => <h2 className="pt-2 text-[19px] text-ink">{children}</h2>

export default function Privacy() {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-2xl px-5 py-8">
        <Link to="/" aria-label="PrepForCase home"><Logo /></Link>
        <h1 className="mt-8 text-[28px]">Privacy notice</h1>
        <p className="mt-1 text-muted">Last updated 8 November 2026</p>
        <div className="mt-6 space-y-4 text-[15px] leading-[1.7] text-ink-2">
          <p>PrepForCase is a free, personal project run by Vyshak K Iyengar in London, United Kingdom. This notice explains, in plain words, what is collected when you use prepforcase.com, why, and what you can do about it. For any privacy question or request, get in touch through <a href="https://vyshak.me" target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d underline">vyshak.me</a>.</p>

          <H>What is collected</H>
          <ul className="list-disc space-y-1.5 pl-5">
            <li><b className="font-medium text-ink">Your account.</b> If you sign in with Google: your name, email address and profile photo. If you sign in with a business school email: your name, that email address, and whether you have confirmed it. Your password is handled by Google Firebase and is never visible to us.</li>
            <li><b className="font-medium text-ink">What you save.</b> Your tracker, case log, drill scores, stories, notes, course progress and dates you enter.</li>
            <li><b className="font-medium text-ink">Usage records, once you're signed in.</b> A record linked to your account: your name and sign-in email, how you signed in, your school email domain (if you use one), the date you joined, the days you were active, number of visits, minutes of active use, how often you open each section, the last page you viewed, lessons done, your interview date (if you enter one), and how many cases, drills, stories, notes, practised casebook cases, phrase-trainer cards and tracker days you have. Also whether you used a phone or computer, your time zone, and the site that sent you here on your first visit (for example a search engine or LinkedIn). These are used to see which parts of the site help people. The text of your notes, cases and stories is never included.</li>
            <li><b className="font-medium text-ink">Student details.</b> If you confirm a school email: the address, school, and (if you give them) your programme and graduation year.</li>
            <li><b className="font-medium text-ink">Anonymous page statistics.</b> Vercel Web Analytics counts page views without cookies and without identifying you.</li>
          </ul>

          <H>Why, and on what legal basis</H>
          <p>To run the service you signed up for: saving your progress and showing it back to you (contract). To understand which parts of the site are useful and improve them, using the usage records above (legitimate interests). To confirm student status for student perks (legitimate interests). To email you about new materials and student offers, only if you tick the box asking for them (consent); you can unsubscribe at any time using the link in any email, or by getting in touch through vyshak.me. Nothing is used for advertising.</p>

          <H>Who can see it</H>
          <p>Only you can read your saved data. If you add a practice partner, they see a short weekly summary: your name and profile photo, your tracker score for the last 7 days, how many of those were real prep days, cases logged, average score, the stage you are working on, and your latest fix. The site owner can see the usage records and the student list described above, and nothing else of yours. Your data is not sold or shared with anyone for marketing.</p>

          <H>Where it is stored</H>
          <p>Saved data is stored in Google Cloud Firestore in London (europe-west2). Sign-in is provided by Google Firebase Authentication, and the website is served by Vercel. These providers may process data outside the UK under their standard data protection terms.</p>

          <H>Cookies and storage</H>
          <p>The site uses your browser's storage to keep you signed in, remember small settings, and save some progress on this device: graph library progress, best drill scores, phrase-trainer progress before you sign in, and your school email details while a confirmation link is pending. Once you're signed in it also remembers which site first sent you here, for the usage record above. There are no advertising or tracking cookies.</p>

          <H>How long it is kept</H>
          <p>For as long as you have an account. You can delete your account and everything saved with it at any time from <Link to="/settings" className="font-medium text-violet-d underline">Settings</Link>. Progress kept only in this browser is removed when you clear your browser's site data. In Settings you can also download a copy of your data: your prep data (profile, tracker, case log, drills and stories), your student record and your usage record.</p>

          <H>Your rights</H>
          <p>Under UK data protection law you can ask for a copy of your data, ask for it to be corrected or deleted, or object to how it is used. If you are unhappy with how your data is handled, you can complain to the Information Commissioner's Office at ico.org.uk.</p>

          <H>Who it's for</H>
          <p>PrepForCase is meant for university students and working adults. It isn't designed for children, and if you're under 16 you shouldn't create an account.</p>

          <H>Changes</H>
          <p>If this notice changes in a way that matters, the date at the top will change.</p>
        </div>
      </div>
    </div>
  )
}
