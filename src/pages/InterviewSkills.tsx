import { ArtSkills, ArtThink, ArtVoice, ArtBusiness } from '../components/Art'
import { PageHeader, Section } from '../components/ui'

const ROUTINES = [
  { number: '01', name: 'Thinking and cognitive practice', time: '10 minutes a day', examples: [
    ['Mental recap', 'Listen to two minutes of a business interview, pause, and explain the three most important points in 60 seconds. Keep the message short and organised.'],
    ['Mental arithmetic', 'Practise percentages, growth rates, margins, large-number division and break-even maths. Explain your approach before calculating.'],
    ['Working-memory challenge', 'Read a short business problem, put it away, then recall the objective, key figures and possible drivers. Do not rely only on a score from a brain-training game.'],
  ], why: 'A case asks you to remember an objective, interpret information and speak at the same time. The most useful practice looks like those real tasks. Brain-training games can be enjoyable extras, but improving at the game does not guarantee better interview performance.' },
  { number: '02', name: 'Speech and clear communication', time: '5–10 minutes a day', examples: [
    ['Warm up your speech', 'Use SpeechOn.app (free) for a short guided warm-up. Relax your jaw, practise articulation and read a few business sentences aloud.'],
    ['Give a 60-second recommendation', 'Answer first, explain two reasons, mention a risk and finish with a next step. Record yourself and listen for confusing sentences.'],
    ['Replace rush with pauses', 'Practise saying a sentence, pausing briefly, and continuing. It is fine to take thinking time. Aim for clarity rather than sounding unusually formal.'],
  ], why: 'The interviewer needs to follow your reasoning. Calm, understandable explanations are more valuable than impressive-sounding language.' },
  { number: '03', name: 'Business judgement and language', time: '15–20 minutes a day', examples: [
    ['Watch a business discussion', 'Try Shark Tank or a founder/CEO interview. Pause to ask: What is the business model? How does it make money? What would I recommend? Watch how the speaker uses a measured tone, posture, pauses and simple words. Practise these techniques, but keep your own natural style.'],
    ['Learn one useful business idea', 'For example: unit economics, customer acquisition cost, churn, pricing power, contribution margin, switching costs or operating leverage.'],
    ['Explain it in your own words', 'Give a 60-second explanation using a real or fictional company. Record one useful phrase in your vocabulary notes.'],
  ], why: 'Consultants connect numbers to business decisions. You want to recognise familiar patterns, not copy an executive’s personality or body language.' },
]
type Tool = { title: string; url?: string; desc: string; tag?: string }
// Resources sit with the routine they support.
const TOOLS: Record<string, { heading: string; items: Tool[] }> = {
  '01': { heading: 'Optional apps', items: [
    { title: 'Elevate', url: 'https://www.elevateapp.com/', desc: 'Short exercises for reading, communication and numeracy. Follow each session with a real case recap or calculation.' },
    { title: 'Peak', url: 'https://www.peak.net/', desc: 'Games for attention and memory. Treat them as practice, not proof that your general intelligence has improved.' },
  ] },
  '02': { heading: 'Free speech practice', items: [
    { title: 'SpeechOn.app', url: 'https://speechon.app/', tag: 'Free', desc: 'Use this for free speech practice: guided warm-ups for breathing, articulation and pace, right in your browser. Do one before every mock case, then deliver a real recommendation aloud. Made by the creator of PrepForCase.' },
  ] },
  '03': { heading: 'Watch and read', items: [
    { title: 'Shark Tank', url: 'https://www.youtube.com/results?search_query=shark+tank+official+business+pitches', desc: 'Pause after each pitch. Estimate revenue, margins, competition and what you would ask the founder.' },
    { title: 'Founder and CEO interviews', url: 'https://www.youtube.com/results?search_query=ceo+interview+business+strategy', desc: 'Notice the sequence: main point first, evidence second, consequence third. Practise your own explanation.' },
    { title: 'Blitzscaling, by Reid Hoffman and Chris Yeh', desc: 'Scaling, distribution, network effects and business models. A familiar section 30 to 60 minutes before an interview can bring business language back. Don\'t memorise words you don\'t understand.' },
    { title: 'Good Strategy/Bad Strategy, by Richard Rumelt', desc: 'Diagnosing the real challenge, choosing a focused response and explaining why it might work.' },
    { title: 'The Personal MBA, by Josh Kaufman', desc: 'A broad introduction to business models, marketing, finance, operations and value creation.' },
  ] },
}

function Tools({ n }: { n: string }) {
  const t = TOOLS[n]
  if (!t) return null
  return (
    <div className="mt-5 border-t border-line pt-4">
      <h3 className="mb-2 font-sans text-[13.5px] font-semibold text-muted">{t.heading}</h3>
      <ul className="divide-y divide-line">
        {t.items.map((s) => (
          <li key={s.title} className="grid gap-1 py-2.5 sm:grid-cols-[220px_1fr]">
            <span>
              {s.url ? <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-medium text-violet-d hover:underline">{s.title} ↗</a> : <span className="font-medium text-ink">{s.title}</span>}
              {s.tag && <span className="ml-2 rounded-full bg-teal-l px-2 py-0.5 text-[11.5px] font-medium text-teal-d">{s.tag}</span>}
            </span>
            <p className="text-[14.5px] text-ink-2">{s.desc}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function InterviewSkills() {
  return <>
    <PageHeader title="Interview skills" art={<ArtSkills />} intro="Think clearly, speak calmly, sound commercial. Do one exercise from each part, most days." />
    {ROUTINES.map((r) => <div id={r.number} key={r.number} className="scroll-mt-24"><Section title={`${r.number} · ${r.name} (${r.time})`} className="mb-5">
      <div className="sm:flex sm:items-start sm:gap-6"><p className="flex-1 text-[14.5px] text-muted">{r.why}</p><div aria-hidden className="mx-auto mt-2 w-40 shrink-0 sm:mx-0 sm:-mt-10 sm:w-44">{(() => { const A = [ArtThink, ArtVoice, ArtBusiness][ROUTINES.indexOf(r)] ?? ArtThink; return <A /> })()}</div></div><ol className="mt-4 space-y-3">{r.examples.map(([name, detail], i) => <li key={name} className="flex gap-3"><span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-violet-l text-[12px] font-semibold text-violet-d">{i + 1}</span><div><h3 className="font-sans text-[14.5px] font-semibold text-ink">{name}</h3><p className="mt-0.5 text-[14.5px] text-ink-2">{detail}</p></div></li>)}</ol>
      <Tools n={r.number} />
    </Section></div>)}
    <Section title="The 30-minute pre-interview warm-up" className="mb-5"><p className="text-[14.5px] text-muted">This follows the idea of refreshing your business vocabulary just before an interview, without trying to learn a whole new topic at the last minute.</p><ol className="mt-4 grid gap-3 sm:grid-cols-2">{[
      ['10 minutes: familiar reading', 'Skim a book such as Blitzscaling or your own vocabulary notes. Look for ideas you already understand, not new jargon.'],
      ['5 minutes: speech warm-up', 'Do a short routine on SpeechOn.app (free) or read one paragraph aloud. Practise clear articulation and a natural pace.'],
      ['10 minutes: one short mock', 'Recap a prompt, outline three useful branches and deliver a 60-second recommendation. Focus on one improvement.'],
      ['5 minutes: settle in', 'Check your materials, breathe normally and avoid introducing a new framework. Being rested matters more than cramming.'],
    ].map(([title, detail]) => <li key={title} className="rounded-lg bg-canvas p-4"><h3 className="font-sans text-[14px] font-semibold text-ink">{title}</h3><p className="mt-1 text-[14px] text-muted">{detail}</p></li>)}</ol></Section>
  </>
}
