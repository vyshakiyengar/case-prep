import { useEffect, useRef, useState } from 'react'

export const mmss = (s: number) => `${Math.floor(Math.abs(s) / 60)}:${`${Math.floor(Math.abs(s) % 60)}`.padStart(2, '0')}`

/** Elapsed stopwatch that keeps running across steps. */
export function useStopwatch(autoStart = true) {
  const [secs, setSecs] = useState(0)
  const [running, setRunning] = useState(autoStart)
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setSecs((s) => s + 1), 1000)
    return () => clearInterval(id)
  }, [running])
  return { secs, running, toggle: () => setRunning((r) => !r), reset: () => setSecs(0) }
}

/** Countdown with start / reset. Calls onEnd once when it hits zero. */
export function Countdown({ seconds, label, onEnd, autoStart = false, onTick }: { seconds: number; label: string; onEnd?: () => void; autoStart?: boolean; onTick?: (left: number) => void }) {
  const [left, setLeft] = useState(seconds)
  const [running, setRunning] = useState(autoStart)
  const ended = useRef(false)
  useEffect(() => { setLeft(seconds); ended.current = false; setRunning(autoStart) }, [seconds, autoStart])
  useEffect(() => {
    if (!running) return
    const id = setInterval(() => setLeft((l) => l - 1), 1000)
    return () => clearInterval(id)
  }, [running])
  useEffect(() => {
    onTick?.(left)
    if (left <= 0 && !ended.current) { ended.current = true; setRunning(false); onEnd?.() }
  }, [left, onEnd, onTick])
  const pct = Math.max(0, left / seconds)
  const urgent = left <= 10
  return (
    <div className="inline-flex items-center gap-3 rounded-lg border border-line bg-white px-3 py-2">
      <svg width="34" height="34" viewBox="0 0 36 36" aria-hidden>
        <circle cx="18" cy="18" r="15" stroke="#E3EAF3" strokeWidth="4" fill="none" />
        <circle cx="18" cy="18" r="15" stroke={urgent ? '#E8505B' : '#6C5CE7'} strokeWidth="4" fill="none" strokeLinecap="round"
          strokeDasharray={`${pct * 94.2} 94.2`} transform="rotate(-90 18 18)" />
      </svg>
      <div>
        <div className="text-[12px] text-muted">{label}</div>
        <div className={`font-serif text-[19px] leading-none font-semibold tabular-nums ${urgent ? 'text-signal-d' : 'text-ink'}`} aria-live="off">{left <= 0 ? 'Time' : mmss(left)}</div>
      </div>
      <div className="flex gap-1">
        {left > 0 && <button onClick={() => setRunning((r) => !r)} className="rounded-md px-2 py-1 text-[13px] font-medium text-violet-d hover:bg-violet-l">{running ? 'Pause' : left === seconds ? 'Start' : 'Resume'}</button>}
        {left !== seconds && <button onClick={() => { setLeft(seconds); ended.current = false; setRunning(false) }} className="rounded-md px-2 py-1 text-[13px] text-muted hover:bg-canvas">Reset</button>}
      </div>
    </div>
  )
}
