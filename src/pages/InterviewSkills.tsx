import { PageHeader, Section } from '../components/ui'

const ROUTINES = [
  { number: '01', name: 'Thinking and cognitive practice', time: '10 minutes a day', examples: [
    ['Mental recap', 'Listen to two minutes of a business interview, pause, and explain the three most important points in 60 seconds. Keep the message short and organised.'],
    ['Mental arithmetic', 'Practise percentages, growth rates, margins, large-number division and break-even maths. Explain your approach before calculating.'],
    ['Working-memory challenge', 'Read a short business problem, put it away, then recall the objective, key figures and possible drivers. Do not rely only on a score from a brain-training game.'],
  ], why: 'A case asks you to remember an objective, interpret information and speak at the same time. The most useful practice looks like those real tasks. Brain-training games can be enjoyable extras, but improving at the game does not guarantee better interview performance.' },
  { number: '02', name: 'Speech and clear communication', time: '5–10 minutes a day', examples: [
    ['Warm up your speech', 'Use SpeechOn for a short guided warm-up. Relax your jaw, practise articulation and read a few business sentences aloud.'],
    ['Give a 30-second recommendation', 'Answer first, explain two reasons, mention a risk and finish with a next step. Record yourself and listen for confusing sentences.'],
    ['Replace rush with pauses', 'Practise saying a sentence, pausing briefly, and continuing. It is fine to take thinking time. Aim for clarity rather than sounding unusually formal.'],
  ], why: 'The interviewer needs to follow your reasoning. Calm, understandable explanations are more valuable than impressive-sounding language.' },
  { number: '03', name: 'Business judgement and language', time: '15–20 minutes a day', examples: [
    ['Watch a business discussion', 'Try Shark Tank or a founder/CEO interview. Pause to ask: What is the business model? How does it make money? What would I recommend? Watch how the speaker uses a measured tone, posture, pauses and simple words. Practise these techniques, but keep your own natural style.'],
    ['Learn one useful business idea', 'For example: unit economics, customer acquisition cost, churn, pricing power, contribution margin, switching costs or operating leverage.'],
    ['Explain it in your own words', 'Give a 60-second explanation using a real or fictional company. Record one useful phrase in your vocabulary notes.'],
  ], why: 'Consultants connect numbers to business decisions. You want to recognise familiar patterns, not copy an executive’s personality or body language.' },
]
const SOURCES = [
  { title: 'Elevate', url: 'https://www.elevateapp.com/', desc: 'Optional short exercises for reading, communication and numeracy. Follow with a real case-related recap or calculation.' },
  { title: 'Peak', url: 'https://www.peak.net/', desc: 'Optional games for attention and memory. Treat them as practice activities, not proof that your general intelligence has improved.' },
  { title: 'SpeechOn.app', url: 'https://speechon.app/', desc: 'A brief speech warm-up before mock interviews. Then practise delivering an actual recommendation aloud.' },
  { title: 'Shark Tank', url: 'https://www.youtube.com/results?search_query=shark+tank+official+business+pitches', desc: 'Pause after each pitch. Estimate revenue, margins, competition and what you would ask the founder.' },
  { title: 'Founder and CEO interviews', url: 'https://www.youtube.com/results?search_query=ceo+interview+business+strategy', desc: 'Notice the sequence: main point first, evidence second, consequence third. Practise your own explanation.' },
]
const BOOKS = [
  ['Blitzscaling — Reid Hoffman and Chris Yeh', 'Scaling a business quickly, distribution, network effects, business models and trade-offs. Read a short familiar section or your highlighted notes 30–60 minutes before an interview if it helps you recall business language. Do not memorise complex words you do not understand.'],
  ['Good Strategy/Bad Strategy — Richard Rumelt', 'Diagnosing the real challenge, choosing a focused response and explaining why it might work.'],
  ['The Personal MBA — Josh Kaufman', 'A broad introduction to business models, marketing, finance, operations and value creation.'],
]
export default function InterviewSkills() {
  return <>
    <PageHeader title="Interview skills" intro="The case is only half the interview. The other half is thinking clearly, speaking calmly and sounding commercial. Pick one exercise from each of the three parts below, most days." />
    {ROUTINES.map((r) => <div id={r.number} key={r.number} className="scroll-mt-24"><Section title={`${r.number} · ${r.name} (${r.time})`} className="mb-5">
      <p className="text-[14.5px] text-muted">{r.why}</p><ol className="mt-4 space-y-3">{r.examples.map(([name, detail], i) => <li key={name} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-l text-[12px] font-semibold text-violet-d">{i + 1}</span><div><h3 className="font-sans text-[15px] font-semibold text-ink">{name}</h3><p className="mt-0.5 text-[14.5px] text-ink-2">{detail}</p></div></li>)}</ol>
    </Section></div>)}
    <details className="mb-5 rounded-xl border border-line bg-white px-5 py-3"><summary className="cursor-pointer text-[15px] font-medium text-ink">Optional: apps, videos and books</summary><div className="mt-2">
    <div className="mb-4"><h3 className="mb-1 text-[16px] font-semibold">Apps and videos</h3><div className="divide-y divide-line">{SOURCES.map((s) => <div key={s.title} className="grid gap-1 py-3 sm:grid-cols-[190px_1fr]"><a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d hover:underline">{s.title} ↗</a><p className="text-[14.5px] text-muted">{s.desc}</p></div>)}</div></div>
    <div><h3 className="mb-1 text-[16px] font-semibold">Books</h3><p className="mb-3 text-[14.5px] text-muted">You do not need to read all these books before starting cases. Read a little, understand the idea and use it in a spoken explanation.</p><div className="space-y-3">{BOOKS.map(([name, why]) => <div key={name} className="border-l-2 border-teal pl-4"><h3 className="font-sans text-[15px] font-semibold">{name}</h3><p className="mt-0.5 text-[14.5px] text-muted">{why}</p></div>)}</div></div>
    </div></details>
    <Section title="The 30-minute pre-interview warm-up" className="mb-5"><p className="text-[14.5px] text-muted">This follows the idea of refreshing your business vocabulary just before an interview, without trying to learn a whole new topic at the last minute.</p><ol className="mt-4 grid gap-3 sm:grid-cols-2">{[
      ['10 minutes: familiar reading', 'Skim a book such as Blitzscaling or your own vocabulary notes. Look for ideas you already understand, not new jargon.'],
      ['5 minutes: speech warm-up', 'Use a short SpeechOn routine or read one paragraph aloud. Practise clear articulation and a natural pace.'],
      ['10 minutes: one short mock', 'Recap a prompt, outline three useful branches and deliver a 30-second recommendation. Focus on one improvement.'],
      ['5 minutes: settle in', 'Check your materials, breathe normally and avoid introducing a new framework. Being rested matters more than cramming.'],
    ].map(([title, detail]) => <li key={title} className="rounded-lg bg-canvas p-4"><h3 className="font-sans text-[14px] font-semibold text-ink">{title}</h3><p className="mt-1 text-[14px] text-muted">{detail}</p></li>)}</ol></Section>
  </>
}
