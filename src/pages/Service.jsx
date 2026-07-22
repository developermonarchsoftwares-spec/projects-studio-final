import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useSectionProgress from '../hooks/useSectionProgress.js'
import useIsVisible from '../hooks/useIsVisible.js'
import SectionInView from '../components/SectionInView.jsx'
import '../pages/service.css'

const ServiceGlassScene = lazy(() => import('../components/ServiceGlassScene.jsx'))

const SERVICES = [
  {
    tag: 'Stories That Inform, Inspire And Influence!',
    title: 'Content Creation!',
    desc: 'From Ideas To Stories, We Create Purposeful Content That Educates, Engages And Inspires Every Audience Across Instagram, Facebook, LinkedIn & YouTube!',
    img: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&q=80&fit=crop',
  },
  {
    tag: 'Turning Vision Into Visuals!',
    title: 'Creative Production!',
    desc: 'From Vision To Screen, We Craft Cinematic Visual Experiences Across Commercials, Brand Films, Reels, Podcasts And Digital Platforms!',
    img: 'https://images.unsplash.com/photo-1601506521937-0121a7fc2a6b?w=800&q=80&fit=crop',
  },
  {
    tag: 'Creating Brands That Stand Apart!',
    title: 'Brand Design!',
    desc: 'From Identity To Experience, We Design Memorable Brands Through Logos, Visual Identity, Marketing Creatives, Websites And Landing Pages!',
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80&fit=crop',
  },
  {
    tag: 'Building Meaningful Connections!',
    title: 'Social Media Management!',
    desc: 'From Publishing To Performance, We Manage Instagram, Facebook, LinkedIn, YouTube And Google Business Profiles To Build Consistent Brand Presence And Meaningful Connections!',
    img: 'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&q=80&fit=crop',
  },
  {
    tag: 'Taking Great Ideas To The Right People!',
    title: 'Digital Advertising!',
    desc: 'From Strategy To Scale, We Amplify Brands Through Meta, Google, LinkedIn And YouTube Advertising That Reaches The Audiences That Matter Most!',
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&q=80&fit=crop',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

export default function Service() {
  const sectionRef = useRef(null)
  const sectionProgress = useSectionProgress(sectionRef, { mode: 'sticky' })
  const [active, setActive] = useState(0)

  const isCarouselVisible = useIsVisible(sectionRef, '300px')

  useEffect(() => {
    if (!isCarouselVisible) return
    let raf
    const loop = () => {
      const normalizedProgress = Math.min(1, Math.max(0, sectionProgress.current))
      const idx = Math.min(
        SERVICES.length - 1,
        Math.round(normalizedProgress * (SERVICES.length - 1))
      )
      setActive((prev) => (prev !== idx ? idx : prev))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sectionProgress, isCarouselVisible])

  const isTransitioningRef = useRef(false)
  const targetIndexRef = useRef(0)
  const lastTransitionTimeRef = useRef(0)
  const touchTriggeredRef = useRef(false)

  // Synchronize targetIndexRef with current active index if not mid-transition
  useEffect(() => {
    if (!isTransitioningRef.current && Date.now() > lastTransitionTimeRef.current) {
      targetIndexRef.current = active
    }
  }, [active])

  const snapToCard = (nextIndex) => {
    const carousel = sectionRef.current
    if (!carousel) return
    const rect = carousel.getBoundingClientRect()
    const offsetTop = rect.top + window.scrollY
    const viewportHeight = window.innerHeight

    const clampedIndex = Math.max(0, Math.min(SERVICES.length - 1, nextIndex))
    targetIndexRef.current = clampedIndex
    isTransitioningRef.current = true
    lastTransitionTimeRef.current = Date.now() + 850

    setTimeout(() => {
      isTransitioningRef.current = false
    }, 850)

    const targetY = offsetTop + clampedIndex * viewportHeight
    window.scrollTo({
      top: targetY,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    let touchStartY = 0
    let transitionTimeout = null

    const handleWheel = (e) => {
      const carousel = sectionRef.current
      if (!carousel) return

      const rect = carousel.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY
      const viewportHeight = window.innerHeight
      const currentScroll = window.scrollY

      const minScroll = offsetTop - 10
      const maxScroll = offsetTop + (SERVICES.length - 1) * viewportHeight + 10

      if (currentScroll < minScroll || currentScroll > maxScroll) {
        return
      }

      const activeIdx = targetIndexRef.current
      const isScrollingDown = e.deltaY > 0 && activeIdx < SERVICES.length - 1
      const isScrollingUp = e.deltaY < 0 && activeIdx > 0

      if (!isScrollingDown && !isScrollingUp) {
        return
      }

      e.preventDefault()

      // Block all wheel triggers during active transition / cooldown
      if (isTransitioningRef.current || Date.now() < lastTransitionTimeRef.current) {
        return
      }

      if (isScrollingDown) {
        snapToCard(activeIdx + 1)
      } else if (isScrollingUp) {
        snapToCard(activeIdx - 1)
      }
    }

    const handleTouchStart = (e) => {
      touchStartY = e.touches[0].clientY
      touchTriggeredRef.current = false
    }

    const handleTouchMove = (e) => {
      const carousel = sectionRef.current
      if (!carousel) return

      const rect = carousel.getBoundingClientRect()
      const offsetTop = rect.top + window.scrollY
      const viewportHeight = window.innerHeight
      const currentScroll = window.scrollY

      const minScroll = offsetTop - 10
      const maxScroll = offsetTop + (SERVICES.length - 1) * viewportHeight + 10

      if (currentScroll < minScroll || currentScroll > maxScroll) {
        return
      }

      const activeIdx = targetIndexRef.current
      const touchEndY = e.touches[0].clientY
      const diffY = touchStartY - touchEndY

      const isSwipingDown = diffY > 0 && activeIdx < SERVICES.length - 1
      const isSwipingUp = diffY < 0 && activeIdx > 0

      if (!isSwipingDown && !isSwipingUp) {
        return
      }

      e.preventDefault()

      if (isTransitioningRef.current || touchTriggeredRef.current || Date.now() < lastTransitionTimeRef.current) {
        return
      }

      if (Math.abs(diffY) > 25) {
        touchTriggeredRef.current = true
        if (isSwipingDown) {
          snapToCard(activeIdx + 1)
        } else if (isSwipingUp) {
          snapToCard(activeIdx - 1)
        }
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    window.addEventListener('touchstart', handleTouchStart, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })

    return () => {
      if (transitionTimeout) clearTimeout(transitionTimeout)
      window.removeEventListener('wheel', handleWheel)
      window.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [])

  return (
    <div className="page service">
      <section className="service__hero container">
        <span className="eyebrow">Capabilities!</span>
        <h1>
          Five Creative <span className="grad-text">Capabilities, One Studio!</span>
        </h1>
        <p className="service__lede">
          Working Together To Bring Ideas To Life!
        </p>
      </section>

      <section className="service__carousel" ref={sectionRef}>
        <div className="service__scene-pin">
          <div className="service__scene-canvas">
            <SectionInView rootMargin="200px">
              <Suspense fallback={null}>
                <ServiceGlassScene progressRef={sectionProgress} services={SERVICES} />
              </Suspense>
            </SectionInView>
          </div>

          <div className="service__overlay">
            <div className="service__dots" style={{ pointerEvents: 'auto' }}>
              {SERVICES.map((_, i) => (
                <span
                  key={i}
                  className={i === active ? 'is-active' : ''}
                  style={{ cursor: 'pointer' }}
                  onClick={() => snapToCard(i)}
                  title={`Go to card ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="service__list container">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
          <span className="section-label">Behind The Creation!</span>
          <h2> A Closer Look At How We Create And Bring Ideas To Life!</h2>
        </motion.div>

        <div className="service__grid">
          {SERVICES.map((s, i) => (
            <motion.div
              className="service__row"
              key={s.title}
              initial="hidden"
              whileInView="show"
              whileHover={{ y: -8, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              viewport={{ once: true, margin: '-60px' }}
              variants={fadeUp}
              transition={{ delay: (i % 3) * 0.06 }}
            >
              <span className="service__row-num">{String(i + 1).padStart(2, '0')}</span>
              <div className="service__row-thumb">
                <img src={s.img} alt={s.title} width="400" height="250" loading="lazy" decoding="async" />
              </div>
              <div>
                <h3>{s.title}</h3>
                <p>{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
