import { useEffect, useRef } from 'react'
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
    <figure className={`overflow-hidden rounded-xl border border-line bg-ink shadow-[0_30px_60px_-34px_rgba(18,18,18,.5)] ${className}`}>
      <video ref={ref} src={`/video/${name}.mp4`} poster={`/video/${name}.jpg`} controls playsInline preload="none"
        muted={autoPlayInView} aria-label={title} className="block aspect-video w-full">
        <track kind="captions" src={`/video/${name}.vtt`} srcLang="en" label="English" />
      </video>
    </figure>
  )
}

/** A full video card for a library video: the player is always on the page, ready to play, with its title and length underneath. */
export function VideoToggle({ id, label = 'Watch', className = '' }: { id: string; label?: string; className?: string }) {
  const v = videoById(id)
  if (!v) return null
  return (
    <div className={`max-w-2xl ${className}`}>
      <VideoPlayer name={`lib/${v.id}`} title={v.title} />
      <p className="mt-2 text-[14px] text-muted"><span className="font-medium text-ink">{label}</span>, {fmtSecs(v.secs)}, with subtitles</p>
    </div>
  )
}
