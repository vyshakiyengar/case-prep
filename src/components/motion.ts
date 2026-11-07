import { useEffect, useRef } from 'react'

const reduced = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

/**
 * Plays an element's entrance once, when it first scrolls into view.
 * Sets data-reveal="wait" then "in"; the CSS in index.css does the rest.
 * With reduced motion (or no IntersectionObserver) nothing is hidden or animated.
 */
export function useReveal<T extends HTMLElement>(threshold = 0.2) {
  const ref = useRef<T>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reduced() || !('IntersectionObserver' in window)) return
    el.dataset.reveal = 'wait'
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { requestAnimationFrame(() => { el.dataset.reveal = 'in' }); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [threshold])
  return ref
}

export const prefersReducedMotion = reduced
