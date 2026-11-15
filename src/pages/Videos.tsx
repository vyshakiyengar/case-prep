import { useEffect, useRef, useState } from 'react'
import { PageHeader } from '../components/ui'
import { VideoPlayer } from '../components/VideoPlayer'
import { VIDEOS, VIDEO_GROUPS, fmtSecs } from '../content/videos'

type Item = { name: string; title: string; secs: number }
const START: Item[] = [
  { name: 'getting-started-v2', title: 'Getting started: the course in 80 seconds', secs: 80 },
  { name: 'prepforcase-tour-v2', title: 'PrepForCase in 30 seconds', secs: 31 },
]
const GROUPS: { t: string; items: Item[] }[] = [
  { t: 'Start here', items: START },
  ...VIDEO_GROUPS.map((g) => ({ t: g, items: VIDEOS.filter((v) => v.group === g).map((v) => ({ name: `lib/${v.id}`, title: v.title, secs: v.secs })) })),
]

/** A tile that plays its video silently on a loop while it is on screen (a still picture for reduced motion). */
function TileVideo({ name }: { name: string }) {
  const ref = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    const v = ref.current
    if (!v || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!('IntersectionObserver' in window)) { v.play().catch(() => {}); return }
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { v.preload = 'auto'; v.play().catch(() => {}) } else v.pause()
    }, { rootMargin: '200px 0px' })
    io.observe(v)
    return () => io.disconnect()
  }, [])
  return <video ref={ref} src={`/video/${name}.mp4`} poster={`/video/${name}.jpg`} muted loop playsInline preload="none" aria-hidden tabIndex={-1} className="pointer-events-none h-full w-full object-cover" />
}

export default function Videos() {
  const [cur, setCur] = useState<Item>(START[0])
  const [play, setPlay] = useState(false)
  const total = Math.round((VIDEOS.reduce((a, v) => a + v.secs, 0) + 111) / 60)
  return (
    <>
      <PageHeader title="Videos" intro={`${VIDEOS.length + START.length} short videos, about ${total} minutes in all. Each one has subtitles.`} />
      <section className="mb-8 grid gap-6 lg:grid-cols-[1.6fr_1fr] lg:items-center">
        <VideoPlayer key={cur.name} name={cur.name} title={cur.title} playNow={play} />
        <div>
          <p className="text-[13px] font-medium text-teal-d">Now showing, {fmtSecs(cur.secs)}</p>
          <h2 className="mt-1 text-[22px] leading-snug">{cur.title}</h2>
        </div>
      </section>
      {GROUPS.map((g) => (
        <section key={g.t} className="mb-8">
          <h2 className="mb-3 text-[19px] font-semibold">{g.t}</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {g.items.map((v) => (
              <button key={v.name} type="button" onClick={() => { setCur(v); setPlay(true); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
                className={`group overflow-hidden rounded-xl border bg-white text-left transition-[border-color,transform] hover:-translate-y-0.5 hover:border-ink/40 motion-reduce:hover:translate-y-0 ${cur.name === v.name ? 'border-teal' : 'border-line'}`}>
                <span className="relative block aspect-video bg-ink">
                  <TileVideo name={v.name} />
                  <span className="absolute right-2 bottom-2 rounded bg-ink/85 px-1.5 py-0.5 text-[12px] font-medium text-white">{fmtSecs(v.secs)}</span>
                </span>
                <span className="block px-3.5 py-3 text-[14.5px] leading-snug font-medium text-ink group-hover:text-violet-d">{v.title}</span>
              </button>
            ))}
          </div>
        </section>
      ))}
    </>
  )
}
