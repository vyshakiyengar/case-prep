import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { LESSONS } from '../content/course'
import { CASE_PICKS } from '../content/casePicks'
import { CASE_COUNT } from '../content/caseCount'
import { SPRINT_FOR, weakestStage } from '../lib/stats'
import { todayIso } from '../lib/dates'
import { LinkButton, PageHeader } from '../components/ui'

type NextStep = { tag: string; title: string; detail: string; reason: string; to: string; action: string; time: string }

function PathCard({ number, title, detail, to, action }: { number: string; title: string; detail: string; to: string; action: string }) {
  return (
    <Link to={to} className="group flex min-h-[160px] flex-col rounded-xl border border-line bg-white p-4 transition-colors hover:border-ink/40 sm:p-5">
      <span className="text-[12.5px] font-medium text-teal-d">{number}</span>
      <h3 className="mt-2 font-sans text-[15px] font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 text-[13.5px] leading-relaxed text-muted">{detail}</p>
      <span className="mt-auto inline-flex items-center gap-2 pt-4 text-[13.5px] font-medium text-violet-d">{action} <span aria-hidden>→</span></span>
    </Link>
  )
}

/** Home guides a signed-in user to one useful action instead of displaying the whole product. */
export default function Home() {
  const { user, data } = useStore()
  const rawName = data?.profile?.name && data.profile.name !== 'You' ? data.profile.name : user?.name || ''
  const name = rawName.trim().split(/\s+/)[0]
  const learned = new Set(data?.profile?.learned || [])
  const lessonsDone = LESSONS.filter((lesson) => learned.has(lesson.slug)).length
  const nextLesson = LESSONS.find((lesson) => !learned.has(lesson.slug))
  const cases = data?.cases || []
  const practised = new Set(data?.profile?.practised || [])
  const caseCount = Math.max(cases.length, practised.size)
  const drillCount = data?.drills?.length || 0
  const nextCase = CASE_PICKS.find((c) => !practised.has(c.slug) &&
    !cases.some((entry) => entry.name.toLowerCase() === c.title.toLowerCase())) || CASE_PICKS[0]
  const weak = cases.length >= 2 ? weakestStage(cases) : null
  const needsPractice = !!weak && weak.avg !== null && weak.avg < 3.5
  const interviewDate = data?.profile?.interviewDate
  const daysLeft = interviewDate ? Math.ceil((Date.parse(interviewDate) - Date.parse(todayIso())) / 86400000) : null

  let next: NextStep
  if (lessonsDone === 0 && caseCount === 0) {
    next = {
      tag: 'Your starting point', title: 'Learn how a case interview works',
      detail: 'Understand the format and what interviewers are actually looking for.',
      reason: 'Start with the basics so that your first practice case makes sense.',
      to: '/learn/how-case-interviews-work', action: 'Start lesson one', time: LESSONS[0].minutes + ' min',
    }
  } else if (lessonsDone < 2 && nextLesson && caseCount === 0) {
    next = {
      tag: 'Continue where you left off', title: nextLesson.title,
      detail: nextLesson.summary, reason: 'Build the fundamentals, then try a case of your own.',
      to: '/learn/' + nextLesson.slug, action: 'Continue learning', time: nextLesson.minutes + ' min',
    }
  } else if (caseCount === 0) {
    next = {
      tag: 'Put your learning to work', title: 'Try your first case: Coastal Brew',
      detail: 'Solve a realistic profitability problem step by step.',
      reason: 'You have started learning the method. Now practise applying it.',
      to: '/casebook/coastal-brew', action: 'Start the case', time: '25 min',
    }
  } else if (needsPractice && weak) {
    next = {
      tag: 'Based on your case scores', title: 'Improve your ' + weak.label.toLowerCase(),
      detail: 'Spend a short session on a skill that has been difficult in your logged cases.',
      reason: 'Focused practice could be more useful than another hour of reading.',
      to: SPRINT_FOR[weak.key].to, action: 'Practise this skill', time: 'Focused practice',
    }
  } else if (nextLesson) {
    next = {
      tag: 'Continue where you left off', title: nextLesson.title, detail: nextLesson.summary,
      reason: 'Build your technique, then apply it to another case.',
      to: '/learn/' + nextLesson.slug, action: 'Continue the course', time: nextLesson.minutes + ' min',
    }
  } else {
    next = {
      tag: 'Your next practice case', title: nextCase.title, detail: nextCase.sub,
      reason: 'You know the fundamentals. Keep practising with unfamiliar problems.',
      to: '/casebook/' + nextCase.slug, action: 'Start a new case', time: 'Case practice',
    }
  }

  const pct = Math.round((lessonsDone / LESSONS.length) * 100)
  return (
    <div className="pb-5">
      <PageHeader
        title={name ? 'Welcome back, ' + name : 'Welcome back'}
        intro="You do not have to do everything today. Pick one useful step and make progress."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.65fr)_minmax(270px,.9fr)]">
        <section aria-labelledby="next-step" className="flex min-h-[290px] flex-col rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-[13px] font-medium text-teal-d">{next.tag}</span>
              <span className="rounded-md bg-canvas px-2.5 py-1 text-[12.5px] text-muted">{next.time}</span>
            </div>
            <h2 id="next-step" className="mt-4 max-w-lg text-[22px] leading-snug text-ink sm:text-[25px]">{next.title}</h2>
            <p className="mt-2 max-w-lg text-[14.5px] leading-relaxed text-ink-2">{next.detail}</p>
            <p className="mt-3 max-w-lg text-[13.5px] leading-relaxed text-muted">{next.reason}</p>
          </div>
          <div className="mt-auto pt-5">
            <LinkButton to={next.to}>{next.action} <span aria-hidden>→</span></LinkButton>
          </div>
        </section>

        <section aria-labelledby="progress-heading" className="rounded-xl border border-line bg-white p-4 sm:p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 id="progress-heading" className="text-[19px] text-ink">Your progress</h2>
            <Link to="/today" className="text-[13px] font-medium text-violet-d hover:underline">Full details</Link>
          </div>
          <p className="mt-1 text-[13.5px] text-muted">The essentials, at a glance.</p>
          <div className="mt-5">
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-[14px] font-medium text-ink">Course</span>
              <span className="text-[13px] tabular-nums text-muted">{lessonsDone} of {LESSONS.length} lessons</span>
            </div>
            <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#E3E9EF]" role="progressbar" aria-label="Course progress" aria-valuenow={lessonsDone} aria-valuemin={0} aria-valuemax={LESSONS.length}>
              <div className="h-full rounded-full bg-teal transition-[width] duration-300" style={{ width: pct + '%' }} />
            </div>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-line pt-5">
            <div>
              <p className="font-serif text-[25px] leading-none text-ink tabular-nums">{caseCount}</p>
              <p className="mt-2 text-[13px] leading-snug text-muted">Cases practised</p>
            </div>
            <div>
              <p className="font-serif text-[25px] leading-none text-ink tabular-nums">{drillCount}</p>
              <p className="mt-2 text-[13px] leading-snug text-muted">Drill sessions</p>
            </div>
          </div>
          {daysLeft !== null && daysLeft >= 0 && (
            <p className="mt-6 border-t border-line pt-4 text-[13.5px] text-ink-2">
              <span className="font-semibold">{daysLeft === 0 ? 'Interview today' : daysLeft + ' days until your interview'}</span>
              <Link to="/settings" className="ml-2 text-violet-d hover:underline">Edit date</Link>
            </p>
          )}
          <Link to="/tracker" className="mt-6 inline-flex items-center gap-2 text-[13.5px] font-medium text-violet-d hover:underline">Open practice tracker <span aria-hidden>→</span></Link>
        </section>
      </div>

      <section aria-labelledby="practice-heading" className="mt-8">
        <h2 id="practice-heading" className="text-[19px] text-ink">Or choose how to practise</h2>
        <p className="mt-1 mb-4 text-[14px] text-muted">Three paths. Everything else is in the sidebar.</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <PathCard number="01 · LEARN" title="Build the foundations"
            detail={nextLesson ? 'Pick up the next lesson in the core course.' : 'Review techniques and worked examples.'}
            to={nextLesson ? '/learn/' + nextLesson.slug : '/learn'} action="Open the course" />
          <PathCard number="02 · APPLY" title="Solve a real case"
            detail={nextCase.sub} to={'/casebook/' + nextCase.slug} action="Practise a case" />
          <PathCard number="03 · IMPROVE" title="Sharpen one skill"
            detail="Short drills in maths, structuring and interpreting charts."
            to="/drills" action="Choose a drill" />
        </div>
      </section>

      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line pt-5 text-[13.5px]">
        <span className="text-muted">Looking for something specific?</span>
        <Link to="/frameworks" className="font-medium text-violet-d hover:underline">Frameworks</Link>
        <Link to="/graphs" className="font-medium text-violet-d hover:underline">Graph library</Link>
        <Link to="/blog" className="font-medium text-violet-d hover:underline">Articles</Link>
        <Link to="/cases" className="font-medium text-violet-d hover:underline">Case log</Link>
        <span className="ml-auto text-[12px] text-muted">{CASE_COUNT} cases available</span>
      </div>
    </div>
  )
}
