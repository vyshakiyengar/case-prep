import { Link } from 'react-router-dom'
import { Logo } from '../components/ui'

// TEMPLATE: replace everything in [square brackets] and have it reviewed before launch.
export default function Privacy() {
  return (
    <div className="bg-white">
      <div className="mx-auto max-w-2xl px-5 py-10">
        <Link to="/"><Logo /></Link>
        <h1 className="mt-8 text-[34px] font-semibold">Privacy notice</h1>
        <p className="mt-1 text-muted">Last updated [date]</p>
        <div className="mt-6 space-y-5 font-serif text-[17px] leading-[1.7] text-ink-2">
          <p>Case Prep OS is run by [your name or company], [address], ("we"). Contact: [email]. This notice explains what we collect and why.</p>
          <h2 className="font-serif text-[22px] font-semibold">What we collect</h2>
          <p>When you sign in with Google: your name, email address and profile photo. When you use the app: the practice data you enter (tracker, case log, drills, stories). If you verify as a student: your school email, school, programme and graduation year, and whether you agreed to receive marketing emails.</p>
          <h2 className="font-serif text-[22px] font-semibold">Why, and on what basis</h2>
          <p>To provide the service you signed up for (contract). To confirm student status and give student offers (legitimate interests). To send you offers and new materials, only if you ticked the box (consent, which you can withdraw at any time by emailing [email] or using the unsubscribe link).</p>
          <h2 className="font-serif text-[22px] font-semibold">Who can see it</h2>
          <p>Your practice partners see only your weekly summary (name, tracker score, cases logged, average score, latest fix). We use Google Firebase to host the app and store data [region]. We don't sell your data.</p>
          <h2 className="font-serif text-[22px] font-semibold">How long we keep it</h2>
          <p>While your account is active, and [period] after your last sign-in. You can ask us to delete your account and data at any time.</p>
          <h2 className="font-serif text-[22px] font-semibold">Your rights</h2>
          <p>You can ask for a copy of your data, ask us to correct or delete it, or object to how we use it. You can also complain to the Information Commissioner's Office (ico.org.uk).</p>
        </div>
      </div>
    </div>
  )
}
