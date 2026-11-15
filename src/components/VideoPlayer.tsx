import { useEffect, useRef, useState } from 'react'
import { fmtSecs, videoById } from '../content/videos'

/**
 * A site video with burnt-in subtitles. With `autoPlayInView` it plays silently while on
 * screen (never for people who ask their device for reduced motion); `playNow` starts it
 * with sound because the person just asked for it.
 */
export function VideoPlayer({ name, title, autoPlayInView = false, playNow = false, className = '' }: { name: string; title: string; autoPlayInView?: boolean; playNow?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v) return
    if (playNow) { v.play().catch(() => {}); return }
    if (!autoPlayInView || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.5 })
    io.observe(v)
    return () => io.disconnect()
  }, [autoPlayInView, playNow])
  return (
    <figure className={`overflow-hidden rounded-xl border border-line bg-ink shadow-[0_30px_60px_-34px_rgba(15,27,51,.5)] ${className}`}>
      <video ref={ref} src={`/video/${name}.mp4`} poster={`/video/${name}.jpg`} controls playsInline preload="metadata"
        muted={autoPlayInView} aria-label={title} className="block aspect-video w-full">
        <track kind="captions" src={`/video/${name}.vtt`} srcLang="en" label="English" />
      </video>
    </figure>
  )
}

/** A small "Watch" button that opens a library video in place, so pages stay uncluttered until someone wants it. */
export function VideoToggle({ id, label = 'Watch', className = '' }: { id: string; label?: string; className?: string }) {
  const v = videoById(id)
  const [open, setOpen] = useState(false)
  if (!v) return null
  return (
    <div className={className}>
      {open
        ? <div className="max-w-2xl"><VideoPlayer name={`lib/${v.id}`} title={v.title} playNow /><button type="button" onClick={() => setOpen(false)} className="mt-2 text-[13.5px] font-medium text-muted hover:text-ink">Close video</button></div>
        : <button type="button" onClick={() => setOpen(true)} className="inline-flex items-center gap-2 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13.5px] font-medium text-ink hover:border-teal hover:text-teal-d">
            <span aria-hidden className="grid h-5 w-5 place-items-center rounded-full bg-ink text-white"><svg viewBox="0 0 16 16" className="ml-px h-2.5 w-2.5 fill-current"><path d="M4 2.5v11l9-5.5z" /></svg></span>
            {label}<span className="text-muted">{fmtSecs(v.secs)}</span>
          </button>}
    </div>
  )
}
