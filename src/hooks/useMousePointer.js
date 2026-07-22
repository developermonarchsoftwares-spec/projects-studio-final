import { useEffect, useRef } from 'react'

/**
 * Tracks normalized mouse position (-1 -> 1 on each axis) in a ref.
 * Uses a window-level listener rather than canvas hover events so it still
 * works behind elements with pointer-events: none (e.g. decorative bg scenes).
 */
export default function useMousePointer() {
  const pointer = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return pointer
}
