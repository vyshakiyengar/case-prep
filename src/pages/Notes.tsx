import { ArtNotes } from '../components/Art'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { PAGES, pageTitle } from '../content/coursePages'
import { NotesBox } from '../components/NotesBox'
import { Button, LinkButton, PageHeader } from '../components/ui'

const fmt = (t: number) => new Date(t).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })

/** Every course note in one place, in course order, plus a free page for anything else. */
export default function Notes() {
  const { data } = useStore()
  const notes = data?.profile?.notes || {}
  const [copied, setCopied] = useState(false)
  const filled = PAGES.map((p, i) => ({ ...p, i, note: notes[p.id] })).filter((p) => p.note?.text.trim())

  const asText = () => [
    'My PrepForCase notes', '',
    ...filled.flatMap((p) => [pageTitle(p.id, p.i), p.note!.text.trim(), '']),
    ...(notes.general?.text.trim() ? ['Other notes', notes.general.text.trim(), ''] : []),
  ].join('\n')
  const copy = async () => { try { await navigator.clipboard.writeText(asText()); setCopied(true); setTimeout(() => setCopied(false), 1800) } catch { /* clipboard blocked */ } }
  const download = () => {
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([asText()], { type: 'text/plain' })); a.download = 'prepforcase-notes.txt'; a.click()
  }

  return (
    <>
      <PageHeader title="My notes" art={<ArtNotes />} intro="Your notes from the course, in course order."
        action={(filled.length > 0 || notes.general?.text.trim()) ? <div className="flex gap-2"><Button variant="secondary" onClick={copy}>{copied ? 'Copied' : 'Copy all'}</Button><Button variant="secondary" onClick={download}>Download</Button></div> : undefined} />

      {filled.length === 0 ? (
        <div className="rounded-xl border border-line bg-white p-5">
          <p className="text-ink-2">No course notes yet. Every page of the course has a notes box at the bottom. What you write there appears here.</p>
          <LinkButton to="/learn" className="mt-4">Open the course</LinkButton>
        </div>
      ) : (
        <ol className="space-y-3">
          {filled.map((p) => (
            <li key={p.id} className="rounded-xl border border-line bg-white p-4 sm:p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="text-[17.5px]">{pageTitle(p.id, p.i)}</h2>
                <span className="text-[13px] text-muted">{fmt(p.note!.updatedAt)} · <Link to={p.to} className="font-medium text-violet-d hover:underline">Open page to edit</Link></span>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-[14.5px] leading-relaxed text-ink">{p.note!.text.trim()}</p>
            </li>
          ))}
        </ol>
      )}

      <div className="mt-6"><NotesBox pageId="general" title="anything else" compact /></div>
    </>
  )
}
