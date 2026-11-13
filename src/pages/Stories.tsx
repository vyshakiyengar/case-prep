import { ArtStories } from '../components/Art'
import { useState } from 'react'
import { playbook } from '../content'
import { useStore } from '../lib/store'
import type { Story } from '../lib/types'
import { uid } from '../lib/dates'
import { Button, Field, inputCls, LinkButton, PageHeader, Section } from '../components/ui'

function StoryBuilder() {
  const { data, saveStory, deleteStory } = useStore()
  const blank = (): Story => ({ id: uid(), title: '', situation: '', task: '', action: '', result: '', learning: '', answers: '', createdAt: Date.now() })
  const [edit, setEdit] = useState<Story | null>(null)
  const stories = [...data!.stories].sort((a, b) => a.createdAt - b.createdAt)
  const F = (k: keyof Story, label: string, hint: string, rows = 2) => (
    <Field label={label} hint={hint}><textarea rows={rows} className={inputCls} value={edit![k] as string} onChange={(e) => setEdit({ ...edit!, [k]: e.target.value })} /></Field>
  )
  return (
    <Section title="Your fit stories" aside={<Button variant="secondary" onClick={() => setEdit(blank())}>Add a story</Button>}>
      <p className="mb-4 text-[14px] text-muted">Use STAR-L: Situation, Task, Action, Result, Learning. Aim for 90 to 120 seconds each.</p>
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

export default function Stories() {
  return (
    <>
      <PageHeader title="Fit stories" art={<ArtStories />} intro="Build 6 to 8 stories once and reuse them. Rehearse out loud each week."
        action={<LinkButton to="/learn/fit-interview" variant="secondary">Lesson: the fit interview</LinkButton>} />
      <div className="space-y-5">
        <StoryBuilder />
        <Section title="The questions you'll be asked">
          <ul className="divide-y divide-line">
            {playbook.fitQuestions.map((q) => <li key={q.q} className="grid gap-1 py-3 sm:grid-cols-[240px_1fr]"><span className="font-medium text-ink">{q.q}</span><span className="text-ink-2">{q.why}</span></li>)}
          </ul>
        </Section>
      </div>
    </>
  )
}
