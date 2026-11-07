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
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const latest = useRef(text); latest.current = text

  // switching pages loads that page's note
  useEffect(() => { setText(data?.profile?.notes?.[pageId]?.text ?? ''); setState('idle') }, [pageId]) // eslint-disable-line react-hooks/exhaustive-deps

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

  return (
    <section aria-labelledby={`notes-${pageId}`} className={`${compact ? '' : 'mt-8'} rounded-2xl border border-marker/70 bg-marker-l/70 p-5 sm:p-6`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={`notes-${pageId}`} className="text-[19px]">My notes{title && !compact ? <span className="font-sans text-[14px] font-normal text-muted"> on {title}</span> : null}</h3>
        <span className="text-[13px] text-muted" role="status">
          {state === 'typing' ? 'Saving…' : state === 'saved' ? 'Saved' : ''}
          {!compact && <Link to="/notes" className="ml-3 font-medium text-violet-d hover:underline">All my notes</Link>}
        </span>
      </div>
      <textarea value={text} onChange={(e) => onChange(e.target.value)} rows={compact ? 4 : 5}
        placeholder="What clicked, what to practise, phrases to remember…"
        className={`${inputCls} mt-3 resize-y bg-white text-[15px] leading-relaxed`} aria-labelledby={`notes-${pageId}`} />
    </section>
  )
}
