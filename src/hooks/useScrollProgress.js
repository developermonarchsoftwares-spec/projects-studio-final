import { useEffect, useRef } from 'react'

/**
 * Tracks overall document scroll progress (0 -> 1) in a mutable ref.
 * Using a ref (rather than state) avoids re-rendering React on every
 * scroll tick — the value is meant to be read inside an r3f useFrame loop,
 * which already runs on its own animation frame.
 */
export default function useScrollProgress() {
  const progress = useRef(0)
  const velocity = useRef(0)

  useEffect(() => {
    let ticking = false
    let lastY = window.scrollY
    let lastT = performance.now()

    const update = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const now = performance.now()
      const dt = Math.max(1, now - lastT)

      progress.current = docHeight > 0 ? Math.min(1, Math.max(0, scrollTop / docHeight)) : 0
      velocity.current = (scrollTop - lastY) / dt

      lastY = scrollTop
      lastT = now
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(update)
        ticking = true
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return { progress, velocity }
}
