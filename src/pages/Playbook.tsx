import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { playbook } from '../content'
import { useStore } from '../lib/store'
import type { Story } from '../lib/types'
import { uid } from '../lib/dates'
import { Button, Field, inputCls, PageHeader, Section, Tabs } from '../components/ui'

type Tab = 'plan' | 'stages' | 'frameworks' | 'formulas' | 'skills'

function Formulas() {
  const [hide, setHide] = useState(false)
  const [open, setOpen] = useState<Record<number, boolean>>({})
  return (
    <>
      <div className="mb-3 flex items-center justify-between">
        <p className="text-muted">Test yourself: hide the formulas, say each one out loud, then check.</p>
        <Button variant="secondary" onClick={() => { setHide((h) => !h); setOpen({}) }}>{hide ? 'Show all formulas' : 'Hide formulas'}</Button>
      </div>
      <div className="overflow-hidden rounded-xl border border-line bg-white">
        {playbook.formulas.map((f, i) => (
          <div key={f.term} className="grid gap-1 border-b border-line px-5 py-3 last:border-0 sm:grid-cols-[180px_1fr_1fr] sm:gap-4">
            <div className="font-medium text-ink">{f.term}</div>
            <div>{hide && !open[i]
              ? <button onClick={() => setOpen((o) => ({ ...o, [i]: true }))} className="text-[14px] font-medium text-violet-d hover:underline">Show formula</button>
              : <span className="font-serif text-[16px] font-semibold text-ink">{f.formula}</span>}</div>
            <div className="text-[14px] text-muted">{f.note}</div>
          </div>
        ))}
      </div>
    </>
  )
}

function StoryBuilder() {
  const { data, saveStory, deleteStory } = useStore()
  const blank = (): Story => ({ id: uid(), title: '', situation: '', task: '', action: '', result: '', learning: '', answers: '', createdAt: Date.now() })
  const [edit, setEdit] = useState<Story | null>(null)
  const stories = [...data!.stories].sort((a, b) => a.createdAt - b.createdAt)
  const F = (k: keyof Story, label: string, hint: string, rows = 2) => (
    <Field label={label} hint={hint}><textarea rows={rows} className={inputCls} value={edit![k] as string} onChange={(e) => setEdit({ ...edit!, [k]: e.target.value })} /></Field>
  )
  return (
    <Section title="Your FIT stories" aside={<Button variant="secondary" onClick={() => setEdit(blank())}>Add a story</Button>}>
      <p className="mb-4 text-[14px] text-muted">Build 6-8 stories using STAR-L. One good story can answer three or four questions. Rehearse each out loud in 90-120 seconds.</p>
      {edit && (
        <form className="mb-5 space-y-3 rounded-lg border border-violet bg-violet-l/40 p-4" onSubmit={async (e) => { e.preventDefault(); await saveStory(edit); setEdit(null) }}>
          <Field label="Story name"><input className={inputCls} required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} placeholder="e.g. Rescuing the pricing project" /></Field>
          <div className="grid gap-3 sm:grid-cols-2">
            {F('situation', 'Situation', 'Context in 1-2 lines')}
            {F('task', 'Task', 'What you were responsible for')}
          </div>
          {F('action', 'Action', 'What YOU did. This is the heart of the story.', 3)}
          <div className="grid gap-3 sm:grid-cols-2">
            {F('result', 'Result', 'Quantified if possible')}
            {F('learning', 'Learning', 'What you would do differently')}
          </div>
          <Field label="Questions it answers" hint="e.g. leadership, failure, persuasion"><input className={inputCls} value={edit.answers} onChange={(e) => setEdit({ ...edit, answers: e.target.value })} /></Field>
          <div className="flex gap-2"><Button type="submit">Save story</Button><Button type="button" variant="secondary" onClick={() => setEdit(null)}>Cancel</Button>
            {data!.stories.some((s) => s.id === edit.id) && <Button type="button" variant="danger" className="ml-auto" onClick={async () => { await deleteStory(edit.id); setEdit(null) }}>Delete</Button>}</div>
        </form>
      )}
      {stories.length === 0 && !edit && <p className="text-muted">No stories yet. Start with your biggest impact and a real failure.</p>}
      <ul className="divide-y divide-line">
        {stories.map((s) => (
          <li key={s.id} className="py-3">
            <button className="text-left" onClick={() => setEdit(s)}>
              <span className="font-medium text-ink hover:underline">{s.title}</span>
              {s.answers && <span className="ml-2 text-[13px] text-muted">{s.answers}</span>}
              {s.result && <span className="block text-[14px] text-ink-2">{s.result}</span>}
            </button>
          </li>
        ))}
      </ul>
    </Section>
  )
}

export default function Playbook() {
  const [params, setParams] = useSearchParams()
  const tab = (params.get('tab') as Tab) || 'plan'
  return (
    <>
      <PageHeader title="Playbook" intro="The reference material: your 6-week plan, how to run a case stage by stage, frameworks, formulas, and the interview-skills menu." />
      <Tabs value={tab} onChange={(v) => setParams({ tab: v })} items={[
        { value: 'plan', label: '6-week plan' }, { value: 'stages', label: 'Running a case' }, { value: 'frameworks', label: 'Frameworks' },
        { value: 'formulas', label: 'Formulas' }, { value: 'skills', label: 'Interview skills' }]} />

      {tab === 'plan' && (
        <ol className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {playbook.plan.map((p, i) => (
            <li key={p.week} className="rounded-xl border border-line bg-white p-5">
              <div className={`font-serif text-[15px] font-semibold ${i < 2 ? 'text-teal-d' : i < 4 ? 'text-violet-d' : 'text-signal-d'}`}>{p.week}</div>
              <p className="mt-1 text-ink">{p.focus}</p>
              <p className="mt-2 text-[14px] text-muted">Target: {p.volume}</p>
            </li>
          ))}
        </ol>
      )}

      {tab === 'stages' && (
        <>
          <ol className="space-y-3">
            {playbook.stages.map((s) => (
              <li key={s.stage} className="rounded-xl border border-line bg-white p-5">
                <h2 className="text-[19px] font-semibold">{s.stage}</h2>
                <p className="mt-1 text-ink-2">{s.do}</p>
                <p className="mt-2 border-l-2 border-teal pl-3 font-serif text-[16px] text-ink italic">{s.say}</p>
                <p className="mt-2 text-[14px] text-signal-d">Common mistake: {s.mistake}</p>
              </li>
            ))}
          </ol>
          <Section title="Drill sprints for each weak stage" className="mt-5">
            <ul className="divide-y divide-line">
              {playbook.sprints.map((s) => <li key={s.stage} className="grid gap-1 py-3 sm:grid-cols-[190px_1fr]"><span className="font-medium text-ink">{s.stage}</span><span className="text-ink-2">{s.sprint}. <span className="text-muted">{s.how}</span></span></li>)}
            </ul>
          </Section>
        </>
      )}

      {tab === 'frameworks' && (
        <>
          <p className="mb-4 text-muted">Never name a framework in an interview. Use these as raw material for a structure that fits the client in front of you.</p>
          <div className="grid gap-3 md:grid-cols-2">
            {playbook.frameworks.map((f) => (
              <div key={f.type} className="rounded-xl border border-line bg-white p-5">
                <h2 className="text-[19px] font-semibold">{f.type}</h2>
                <p className="mt-1 text-[14.5px]"><span className="text-muted">Ask first:</span> <span className="text-ink">{f.ask}</span></p>
                <p className="mt-1 text-[14.5px] text-ink-2">{f.build}</p>
                <p className="mt-2 text-[13.5px] text-signal-d">Trap: {f.trap}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'formulas' && <Formulas />}

      {tab === 'skills' && (
        <div className="space-y-5">
          <Section title="The daily menu" aside={<span className="text-[13.5px] text-muted">Pick 2-3 a day</span>}>
            <ul className="divide-y divide-line">
              {playbook.skills.map((s) => (
                <li key={s.name} className="grid gap-1 py-3 sm:grid-cols-[210px_1fr_110px] sm:gap-4">
                  <span className={`font-medium ${s.name.startsWith('VOICE') ? 'text-violet-d' : s.name.startsWith('MIND') ? 'text-teal-d' : 'text-ink'}`}>{s.name.replace(/^(\w+) · /, (_, k: string) => `${k[0]}${k.slice(1).toLowerCase()}: `)}</span>
                  <span className="text-ink-2">{s.how} <span className="text-muted">Trains: {s.trains.charAt(0).toLowerCase() + s.trains.slice(1)}</span></span>
                  <span className="text-[14px] text-muted">{s.dose}</span>
                </li>
              ))}
            </ul>
          </Section>
          <StoryBuilder />
          <Section title="The FIT questions you'll be asked">
            <ul className="divide-y divide-line">
              {playbook.fitQuestions.map((q) => <li key={q.q} className="grid gap-1 py-3 sm:grid-cols-[240px_1fr]"><span className="font-medium text-ink">{q.q}</span><span className="text-ink-2">{q.why}</span></li>)}
            </ul>
          </Section>
        </div>
      )}
    </>
  )
}
