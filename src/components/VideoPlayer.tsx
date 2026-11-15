import { useEffect, useRef } from 'react'

/**
 * A site video with burnt-in subtitles. With `autoPlayInView` it plays silently while on
 * screen (never for people who ask their device for reduced motion); controls let anyone
 * turn the sound on.
 */
export function VideoPlayer({ name, title, autoPlayInView = false, className = '' }: { name: string; title: string; autoPlayInView?: boolean; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || !autoPlayInView || !('IntersectionObserver' in window)) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) v.play().catch(() => {})
      else v.pause()
    }, { threshold: 0.5 })
    io.observe(v)
    return () => io.disconnect()
  }, [autoPlayInView])
  return (
    <figure className={`overflow-hidden rounded-xl border border-line bg-ink shadow-[0_30px_60px_-34px_rgba(15,27,51,.5)] ${className}`}>
      <video ref={ref} src={`/video/${name}.mp4`} poster={`/video/${name}.jpg`} controls playsInline preload="metadata"
        muted={autoPlayInView} aria-label={title} className="block aspect-video w-full">
        <track kind="captions" src={`/video/${name}.vtt`} srcLang="en" label="English" />
      </video>
    </figure>
  )
}
