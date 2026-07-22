import { useEffect, useState } from 'react'

export default function useIsVisible(ref, rootMargin = '200px') {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { rootMargin }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [ref, rootMargin])

  return isVisible
}
