import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../lib/store'
import { inputCls } from './ui'

/** Personal notes for one page. Saves itself a moment after you stop typing. */
export function NotesBox({ pageId, title, compact = false }: { pageId: string; title?: string; compact?: boolean }) {
  const { data, saveNote } = useStore()
  const saved = data?.profile?.notes?.[pageId]?.text ?? ''
  const [text, setText] = useState(saved)
  const [state, setState] = useState<'idle' | 'typing' | 'saved'>('idle')
  const [open, setOpen] = useState(compact || !!saved)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useRef(text); latest.current = text

  // switching pages loads that page's note
  useEffect(() => { const t = data?.profile?.notes?.[pageId]?.text ?? ''; setText(t); setState('idle'); setOpen(compact || !!t) }, [pageId]) // eslint-disable-line react-hooks/exhaustive-deps

  const save = (value: string) => saveNote(pageId, value).then(() => setState('saved'))
  const onChange = (v: string) => {
    setText(v); setState('typing')
    clearTimeout(timer.current)
    timer.current = setTimeout(() => { timer.current = undefined; save(v) }, 800)
  }
  // don't lose the last few keystrokes when leaving the page
  useEffect(() => () => {
    if (timer.current) { clearTimeout(timer.current); timer.current = undefined; if (latest.current !== saved) saveNote(pageId, latest.current) }
  }, [pageId]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!open) return (
    <div className="mt-8 border-t border-line pt-4">
      <button onClick={() => setOpen(true)} className="inline-flex items-center gap-2 text-[14px] text-muted transition-colors hover:text-ink">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden><path d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        Add a note to this page
      </button>
    </div>
  )
  return (
    <section aria-labelledby={`notes-${pageId}`} className={`${compact ? 'rounded-xl border border-line bg-white p-4 sm:p-5' : 'mt-8 border-t border-line pt-4'}`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={`notes-${pageId}`} className="font-sans text-[14px] font-medium text-ink-2">My notes{title && !compact ? <span className="font-normal text-muted"> · {title}</span> : null}</h3>
        <span className="text-[13px] text-muted" role="status">
          {state === 'typing' ? 'Saving…' : state === 'saved' ? 'Saved' : ''}
          {!compact && <Link to="/notes" className="ml-3 font-medium text-violet-d hover:underline">All my notes</Link>}
        </span>
      </div>
      <textarea value={text} onChange={(e) => onChange(e.target.value)} rows={compact ? 4 : 3} autoFocus={!compact && !saved}
        placeholder="What clicked, what to practise, phrases to remember…"
        className={`${inputCls} mt-2 resize-y bg-white text-[14.5px] leading-relaxed`} aria-labelledby={`notes-${pageId}`} />
    </section>
  )
}
