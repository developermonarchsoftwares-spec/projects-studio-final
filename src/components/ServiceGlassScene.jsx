import { useEffect, useRef } from 'react'
import useIsVisible from '../hooks/useIsVisible.js'

export default function ServiceGlassScene({ progressRef, services }) {
  const containerRef = useRef(null)
  const cardRefs = useRef([])
  const lastProgressRef = useRef(-1)
  const isVisible = useIsVisible(containerRef, '200px')

  useEffect(() => {
    let raf

    const step = () => {
      if (isVisible) {
        const p = Math.min(1, Math.max(0, progressRef.current))
        if (Math.abs(p - lastProgressRef.current) > 0.0002) {
          lastProgressRef.current = p
          const count = services.length
          const focus = p * (count - 1)

          cardRefs.current.forEach((el, i) => {
            if (!el) return
            const d = i - focus
            const abs = Math.abs(d)
            const scale = Math.max(0.6, 1 - abs * 0.22)
            const opacity = Math.max(0, 1 - abs * 0.55)
            const translateX = d * 62
            const translateZ = -abs * 140
            const blur = Math.min(10, abs * 6)
            const rotateY = Math.max(-26, Math.min(26, -d * 20))

            el.style.transform = `translate3d(${translateX}%, 0, ${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`
            el.style.opacity = opacity.toFixed(3)
            el.style.filter = `blur(${blur.toFixed(1)}px)`
            el.style.zIndex = String(1000 - Math.round(abs * 10))
          })
        }
      }

      raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [progressRef, services, isVisible])

  return (
    <div ref={containerRef} className="service-glass">
      <div className="service-glass__blob service-glass__blob--a" />
      <div className="service-glass__blob service-glass__blob--b" />
      <div className="service-glass__track">
        {services.map((s, i) => (
          <div
            className="service-glass__card"
            key={s.title}
            ref={(el) => {
              cardRefs.current[i] = el
            }}
          >
            <span className="service-glass__sheen" aria-hidden="true" />
            <div className="service-glass__thumb">
              <img src={s.img} alt="" loading="lazy" />
            </div>
            <span className="service-glass__tag">{s.tag}</span>
            <h3 className="service-glass__title">{s.title}</h3>
          </div>
        ))}
      </div>
    </div>
  )
}
