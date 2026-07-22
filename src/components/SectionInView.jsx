import { useRef } from 'react'
import useIsVisible from '../hooks/useIsVisible.js'

export default function SectionInView({ children, rootMargin = '300px', fallback = null, className = '' }) {
  const containerRef = useRef(null)
  const isVisible = useIsVisible(containerRef, rootMargin)

  return (
    <div ref={containerRef} className={className} style={{ width: '100%', height: '100%' }}>
      {isVisible ? children : fallback}
    </div>
  )
}
