import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { caseOfDay, dailyStreak } from '../lib/daily'
import { readiness } from '../lib/readiness'
import { todayIso } from '../lib/dates'
import { ArtSector } from './Art'

const DIFF = { 1: 'Easy', 2: 'Medium', 3: 'Hard' } as Record<number, string>

/** The same case for everyone today, with the person's daily streak. */
export function CaseOfTheDay({ compact = false }: { compact?: boolean }) {
  const { data, user } = useStore()
  const today = todayIso(), c = caseOfDay(today)
  const days = data?.profile?.daily || []
  const doneToday = days.includes(today), streak = dailyStreak(days, today)
  return (
    <section aria-labelledby="cotd" className="grid overflow-hidden rounded-xl border border-line bg-white sm:grid-cols-[minmax(0,1fr)_220px]">
      <div className="flex flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <h2 id="cotd" className="font-sans text-[13px] font-semibold text-teal-d">Case of the day</h2>
          {user && streak > 0 && <span className="rounded-full bg-[#FFF3E6] px-2.5 py-0.5 text-[12.5px] font-semibold text-[#9A4A0B]">{streak}-day streak</span>}
        </div>
        <p className="mt-1.5 font-serif text-[21px] leading-tight font-semibold text-ink">{c.title}</p>
        <p className="mt-1 text-[14.5px] text-ink-2">{c.sub}</p>
        <p className="mt-2 text-[13px] text-muted">{c.type}, {c.industry}. {DIFF[c.diff]}, {c.time}.</p>
        {!compact && <p className="mt-2 text-[13.5px] text-muted">Everyone on PrepForCase gets the same case today. Do it for your streak; a new one comes tomorrow.</p>}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {doneToday
            ? <span className="rounded-lg bg-good-l px-3.5 py-2 text-[14px] font-medium text-good">Done today. See you tomorrow.</span>
            : <Link to={`/casebook/${c.slug}`} className="btn-primary rounded-lg px-4 py-2.5 text-[14.5px] font-medium text-white">Start today's case</Link>}
          {user && !doneToday && <span className="text-[13px] text-muted">Counts when you open the recommendation.</span>}
        </div>
      </div>
      <div aria-hidden className="hidden border-l border-line bg-canvas px-4 pt-6 sm:block"><ArtSector industry={c.industry} /></div>
    </section>
  )
}

function Ring({ value }: { value: number }) {
  const r = 46, c = 2 * Math.PI * r
  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28 shrink-0" role="img" aria-label={`Readiness ${value} out of 100`}>
      <circle cx="60" cy="60" r={r} fill="none" stroke="#E6EBF1" strokeWidth="11" />
      {value > 0 && <circle cx="60" cy="60" r={r} fill="none" stroke="#0E8C96" strokeWidth="11" strokeLinecap="round" strokeDasharray={`${(c * value) / 100} ${c}`} transform="rotate(-90 60 60)" />}
      <text x="60" y="66" textAnchor="middle" fontFamily="'Newsreader Variable', Georgia, serif" fontSize="30" fontWeight="600" fill="#0F1B33">{value}</text>
      <text x="60" y="84" textAnchor="middle" fontFamily="'IBM Plex Sans', sans-serif" fontSize="10.5" fill="#5B6880">of 100</text>
    </svg>
  )
}

/** Readiness score: course, cases, drills and habit, with the biggest next gain and a share button. */
export function Readiness({ hideWhenEmpty = false }: { hideWhenEmpty?: boolean }) {
  const { data } = useStore()
  const { score, parts, next } = readiness(data)
  if (hideWhenEmpty && score === 0) return null
  const [msg, setMsg] = useState('')
  const share = async () => {
    const text = `My case interview readiness on PrepForCase is ${score}/100. Free case prep: 102 cases, a course and daily drills.`
    const url = 'https://prepforcase.com'
    try {
      if (navigator.share) { await navigator.share({ title: 'PrepForCase', text, url }); return }
      await navigator.clipboard.writeText(`${text} ${url}`); setMsg('Copied. Paste it anywhere.')
    } catch { /* cancelled */ }
  }
  return (
    <section aria-labelledby="ready" className="rounded-xl border border-line bg-white p-5">
      <div className="flex flex-wrap items-center gap-5">
        <Ring value={score} />
        <div className="min-w-[200px] flex-1">
          <h2 id="ready" className="font-sans text-[13px] font-semibold text-teal-d">Readiness score</h2>
          <p className="mt-1 text-[14.5px] text-ink-2">A guide to how prepared you are, from the course, your cases, your drills and how often you prepare. It's a nudge, not a prediction.</p>
          <p className="mt-2 text-[14px]"><span className="text-muted">Biggest gain next: </span><Link to={next.to} className="font-medium text-violet-d hover:underline">{next.tip}</Link></p>
        </div>
      </div>
      <ul className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
        {parts.map((p) => (
          <li key={p.key}>
            <div className="flex items-baseline justify-between gap-2 text-[13.5px]"><span className="font-medium text-ink">{p.label}</span><span className="text-muted">{Math.round(p.weight * p.value)} of {p.weight}</span></div>
            <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#EEF1F5]"><div className="h-full rounded-full bg-teal" style={{ width: `${Math.round(p.value * 100)}%` }} /></div>
            <p className="mt-1 text-[12.5px] text-muted">{p.note}</p>
          </li>
        ))}
      </ul>
      <div className="mt-4 flex items-center gap-3 border-t border-line pt-3">
        <button type="button" onClick={share} className="rounded-lg border border-line px-3.5 py-2 text-[14px] font-medium text-ink hover:border-ink/40">Share my score</button>
        <span role="status" className="text-[13px] text-muted">{msg}</span>
      </div>
    </section>
  )
}
