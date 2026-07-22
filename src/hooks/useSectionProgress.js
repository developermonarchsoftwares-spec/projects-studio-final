import { useEffect, useRef } from 'react'

/**
 * Tracks how far a given element has travelled through the viewport, as a
 * ref value from 0 (element just entering at the bottom) to 1 (element has
 * fully exited at the top). Good for syncing a specific DOM section with a
 * 3D scene state (e.g. which "face" should be active).
 */
export default function useSectionProgress(elementRef, options = {}) {
  const progress = useRef(0)

  useEffect(() => {
    let ticking = false

    const update = () => {
      const el = elementRef.current
      if (el) {
        const rect = el.getBoundingClientRect()
        const vh = window.innerHeight
        const isSticky = options.mode === 'sticky'
        const total = isSticky ? Math.max(1, rect.height - vh) : rect.height + vh
        const traveled = isSticky ? -rect.top : vh - rect.top
        progress.current = Math.min(1, Math.max(0, traveled / total))
      }
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
  }, [elementRef, options.mode])

  return progress
}
