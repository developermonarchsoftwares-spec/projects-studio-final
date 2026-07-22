import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { motion, useAnimation, useInView } from 'framer-motion'
import HeroParticles from '../components/HeroParticles.jsx'
import SectionInView from '../components/SectionInView.jsx'
import useScrollProgress from '../hooks/useScrollProgress.js'
import '../pages/home.css'

import CapabilitiesCanvas from '../components/CapabilitiesCanvas.jsx'
import { MuteOnlyVideo } from './Portfolio.jsx'

const ContactScene = lazy(() => import('../three/ContactScene.jsx'))

const CAPABILITIES = [
  ['01', 'Discover', 'Understanding Your Brand, Audience And Purpose Before A Single Pixel Is Created!'],
  ['02', 'Strategize', 'Building The Creative Direction, Story And Visual Language That Shapes Every Decision!'],
  ['03', 'Produce', 'Designing, Filming, Editing And Producing Meaningful Visual Experiences!'],
  ['04', 'Amplify', 'Publishing, Amplifying And Refining Every Creation To Maximize Its Reach And Impact!'],
]

const FEATURED = [
  {
    tag: 'Production',
    title: 'Process Reel',
    metric: 'Featured',
    video: '/assets/VID-20260714-WA0007.mp4',
    img: '/assets/VID-20260714-WA0007-poster.jpg',
  },
  {
    tag: 'Production',
    title: 'Moments Reel',
    metric: 'Featured',
    video: '/assets/VID-20260714-WA0008.mp4',
    img: '/assets/VID-20260714-WA0008-poster.jpg',
  },
  {
    tag: 'Production',
    title: 'Story Reel',
    metric: 'Featured',
    video: '/assets/VID-20260714-WA0009.mp4',
    img: '/assets/VID-20260714-WA0009-poster.jpg',
  },
  {
    tag: 'Production',
    title: 'Highlight Reel',
    metric: 'Featured',
    video: '/assets/VID-20260714-WA0011.mp4',
    img: '/assets/VID-20260714-WA0011-poster.jpg',
  },
]

const TESTIMONIALS = [
  {
    quote:
      "I've been working with this digital Creations  team for the past three months, and I'm genuinely impressed with their work. Their editing quality is outstanding, and ever since they started managing my Instagram profile, I've seen a significant increase in my followers, views, and overall engagement. Many people have asked me who manages my page because the content looks so professional. Most importantly, I've received a lot of new customer inquiries and bookings through my Instagram, thanks to their efforts. I highly recommend their digital Creations  services to anyone looking to grow their social media presence. In fact, I've already recommended them to many people who have asked me about my page. Thank you so much for your excellent work and continuous support!",
    name: '– Mrs. Merlin, Kanchipuram',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=32',
    expandable: true,
  },
  {
    quote:
      "My experience from our project Hema Mahal convention centre with graphician studios was an incredible journey. From the initial concept provided by the content editor to the shoots with Sidhique to be specifically mentioned, every step was handled with professionalism and care, ensuring I felt comfortable throughout. The editing team then transformed the raw footage into a refined final product, showcasing their technical expertise and creative vision. What impressed me most was the seamless coordination, dedication, and hard work of every individual involved. The final output truly reflects the collective effort and commitment of the entire team.\nWould highy recommend to all as they are very reasonable priced along with young raw talents and vibe",
    name: '– Mrs.Vivitha, Salem',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=12',
    expandable: true,
  },
  {
    quote: 'Hi team,\nYour hard work, dedication, and commitment to excellence inspired. Thank you for consistently delivering videos on time while maintaining the highest quality standards.',
    name: '– Mr.Suresh, Salem',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=47',
    expandable: true,
  },
  {
    quote:
      "We've been working with Graphics Studio for our video editing projects, and it's been a really good experience. Hari and the team understand our requirements well and are always open to feedback, which makes the entire process smooth. What I appreciate the most is that they don't just edit videos—they genuinely try to understand the idea and bring it to life. Whenever we ask for changes, they're patient, responsive, and make sure we're satisfied with the final output. It's always easy to work with a team that values quality and communication. We're happy with their work and look forward to collaborating with Graphics Studio on many more projects.",
    name: '– Mr.Nimlesh John, Neyveli',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=68',
    expandable: true,
  },
  {
    quote:
      "Working with Graphician Studios has been an excellent experience. The team is highly creative, professional, and always takes the time to understand our requirements. They consistently deliver quality designs and effective marketing support on time, with great attention to detail.\nTheir dedication, quick response, and innovative ideas have played a key role in growing my tuition business. I truly appreciate the team's commitment, creativity, and hard work. Thank you for being a valuable part of our journey. Wishing Graphician Studios continued success and many more milestones ahead. Highly recommended!",
    name: '– Mrs.Geetharani, Salem',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=51',
    expandable: true,
  },
  {
    quote:
      "Graphicans Studio has an excellent team of creative professionals and talented editors. A special mention to Hari for his exceptional understanding of the business, its requirements, and the vision behind every project. He consistently delivers exactly what is needed with great attention to detail. It has been a wonderful experience working with the entire team",
    name: '– Ms.Gayathri, Chennai ',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=59',
    expandable: true,
  },
  {
    quote:
      "We had a wonderful experience working with Graphician Studios. Their team is extremely friendly, approachable, and professional, making the entire shoot comfortable and enjoyable. They understood our vision well, guided us throughout the shoot, and captured everything beautifully.\n\nThe quality of their videography and editing is excellent, and the final videos turned out exactly the way we wanted. Their creativity, attention to detail, and timely delivery made the whole process smooth and stress-free.\n\nWe truly appreciate their dedication and would highly recommend Graphician Studios to anyone looking for high-quality promotional videos, Marketing and photography. Thank you for helping bring our vision to life!",
    name: '– Ms.Keerthana, Chennai',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=25',
    expandable: true,
  },
  {
    quote:
      'Dear Graphicians Team,\n\nFor the past one year you people have been creating all my videos\n\nFrom scratch to wonderful output you people are the reason for magic\n\nThe output is unique and incredible\n\nThe new way of Editing styles is much appreciated\n\nThanks to all the editors for growing my page and business organically',
    name: '– Dr.Rahul Srinivasan, Avinashi',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=33',
    expandable: true,
  },
  {
    quote:
      "I have been working with Graphicians from the past 10 months now and they are the best in town. I have outsourced most of my Dubai client's videos to be edited by them and a lot of them have gone super viral.\n\nIf you need any kind of digital marketing services from an experienced agency in Salem, Graphicians are the solution.\n\nAlso a big shoutout to Mr. Sidheque for always coordinating and helping with any kind of last minute changes that i need even if it meant working afterhours sometimes.",
    name: '– Mr. Haleem, Dubai',
    role: '',
    avatar: 'https://i.pravatar.cc/120?img=11',
    expandable: true,
  },
]

const capabilityText = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
    },
  },
}

const capabilityTextLine = {
  hidden: { opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const capabilityCard = {
  hidden: { opacity: 0, x: '-110vw' },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const capabilityGrid = {
  hidden: {
    transition: {
      staggerChildren: 0.08,
      staggerDirection: -1,
    },
  },
  show: {
    transition: {
      staggerChildren: 0.18,
    },
  },
}

const marqueeReveal = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
}

function TestimonialCard({ t, hidden = false }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = Boolean(t.expandable)

  return (
    <div className="testimonial-card" aria-hidden={hidden || undefined}>
      <p className={`testimonial-card__quote${expanded ? ' is-expanded' : ''}`}>"{t.quote}"</p>
      {isLong && (
        <button
          type="button"
          className="testimonial-card__toggle"
          tabIndex={hidden ? -1 : undefined}
          onClick={() => setExpanded((v) => !v)}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      )}
      <div className="testimonial-card__person">
        <div className="testimonial-card__rating" aria-label="Rated 5 out of 5 stars">
          {'★★★★★'}
        </div>
        <div>
          <strong>{t.name}</strong>
          <span>{t.role}</span>
        </div>
      </div>
    </div>
  )
}

const AUTO_SCROLL_SPEED = 40 // px per second
const NAV_RESUME_DELAY = 3000 // ms of stillness after a manual click before auto-scroll resumes
const NAV_JUMP_DURATION = 480 // ms

function TestimonialCarousel({ testimonials }) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const offsetRef = useRef(0)
  const halfWidthRef = useRef(0)
  const isHoveredRef = useRef(false)
  const isNavPausedRef = useRef(false)
  const resumeTimerRef = useRef(null)
  const jumpTimerRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    const measure = () => {
      halfWidthRef.current = track.scrollWidth / 2
    }
    measure()

    const resizeObserver = new ResizeObserver(measure)
    resizeObserver.observe(track)
    return () => resizeObserver.disconnect()
  }, [testimonials])

  useEffect(() => {
    let rafId
    let lastTime = null

    const step = (time) => {
      if (lastTime == null) lastTime = time
      const dt = (time - lastTime) / 1000
      lastTime = time

      const track = trackRef.current
      const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches

      if (track && !isHoveredRef.current && !isNavPausedRef.current && !reduceMotion) {
        // Skip DOM transforms when carousel is off-screen
        const rect = track.getBoundingClientRect()
        const isOffscreen = rect.bottom < -100 || rect.top > window.innerHeight + 100

        if (!isOffscreen) {
          const half = halfWidthRef.current
          let next = offsetRef.current - AUTO_SCROLL_SPEED * dt
          if (half > 0) {
            if (next <= -half) next += half
            if (next > 0) next -= half
          }
          offsetRef.current = next
          track.style.transform = `translateX(${next}px)`
        }
      }

      rafId = requestAnimationFrame(step)
    }

    rafId = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafId)
  }, [])

  useEffect(() => () => {
    clearTimeout(resumeTimerRef.current)
    clearTimeout(jumpTimerRef.current)
  }, [])

  const getStep = () => {
    const track = trackRef.current
    if (!track || !track.firstElementChild) return 384
    const card = track.firstElementChild
    const gap = parseFloat(getComputedStyle(track).columnGap || '24')
    return card.getBoundingClientRect().width + gap
  }

  const jumpBy = (delta) => {
    const track = trackRef.current
    if (!track) return

    const half = halfWidthRef.current
    let next = offsetRef.current + delta
    if (half > 0) {
      if (next <= -half) next += half
      if (next > 0) next -= half
    }
    offsetRef.current = next

    track.classList.add('is-jumping')
    track.style.transform = `translateX(${next}px)`

    clearTimeout(jumpTimerRef.current)
    jumpTimerRef.current = setTimeout(() => {
      track.classList.remove('is-jumping')
    }, NAV_JUMP_DURATION)

    isNavPausedRef.current = true
    clearTimeout(resumeTimerRef.current)
    resumeTimerRef.current = setTimeout(() => {
      isNavPausedRef.current = false
    }, NAV_RESUME_DELAY)
  }

  return (
    <div
      className="testimonial-carousel"
      onMouseEnter={() => {
        isHoveredRef.current = true
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false
      }}
    >
      <button
        type="button"
        className="testimonial-arrow testimonial-arrow--prev"
        aria-label="Previous review"
        onClick={() => jumpBy(getStep())}
      >
        ‹
      </button>

      <div className="testimonial-viewport" ref={viewportRef}>
        <div className="testimonial-track" ref={trackRef}>
          {testimonials.map((t, i) => (
            <TestimonialCard t={t} key={`a-${i}`} />
          ))}
          {testimonials.map((t, i) => (
            <TestimonialCard t={t} key={`b-${i}`} hidden />
          ))}
        </div>
      </div>

      <button
        type="button"
        className="testimonial-arrow testimonial-arrow--next"
        aria-label="Next review"
        onClick={() => jumpBy(-getStep())}
      >
        ›
      </button>
    </div>
  )
}

export default function Home() {
  const [isMounted, setIsMounted] = useState(false)
  const { progress } = useScrollProgress()
  const capabilitiesRef = useRef(null)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])
  const featuredRef = useRef(null)
  const testimonialsRef = useRef(null)
  const capabilityControls = useAnimation()
  const featuredControls = useAnimation()
  const testimonialControls = useAnimation()
  const capabilitiesInView = useInView(capabilitiesRef, {
    amount: 0.28,
    margin: '0px 0px -12% 0px',
  })
  const featuredInView = useInView(featuredRef, {
    amount: 0.05,
    margin: '0px 0px 0px 0px',
  })
  const testimonialsInView = useInView(testimonialsRef, {
    amount: 0.28,
    margin: '0px 0px -12% 0px',
  })

  useEffect(() => {
    capabilityControls.start(capabilitiesInView ? 'show' : 'hidden')
  }, [capabilitiesInView, capabilityControls])

  useEffect(() => {
    featuredControls.start(featuredInView ? 'show' : 'hidden')
  }, [featuredInView, featuredControls])

  useEffect(() => {
    testimonialControls.start(testimonialsInView ? 'show' : 'hidden')
  }, [testimonialsInView, testimonialControls])

  const heroVideoRef = useRef(null)

  useEffect(() => {
    const video = heroVideoRef.current
    if (!video) return

    video.playbackRate = 0.5

    // Use timeupdate (~4×/s) instead of a permanent rAF loop for a simple time check
    const onTimeUpdate = () => {
      if (video.currentTime >= 2) video.currentTime = 0
    }
    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [])

  return (
    <div className="page home">
      <section className="home__hero">
        {/* ── Hero background video ── */}
        <video
          ref={heroVideoRef}
          className="home__hero-video"
          src="/assets/hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          disablePictureInPicture
          aria-hidden="true"
        />
        <div className="home__hero-contact-scene" aria-hidden="true">
          <HeroParticles />
        </div>
        <div className="container">
          <span className="eyebrow">Creative Production Studio!</span>
          <h1 className="home__headline">
            From Vision
            <br />
            To <span className="grad-text">Visuals!</span>
          </h1>
          <p className="home__lede">
            We Transform Ideas Into Stories Through Design, Motion, Production And Purposeful Creativity!
          </p>
          <div className="home__cta-row">
            <NavLink to="/contact" className="btn solid">Let's Create!</NavLink>
            <NavLink to="/portfolio" className="btn">Explore Our Work!</NavLink>
          </div>
        </div>
        <div className="home__scroll-cue">
          <span>Scroll</span>
          <div className="home__scroll-line" />
        </div>
      </section>

      {/* ── Capabilities — 500vh pinned scroll section ── */}
      <section ref={capabilitiesRef} className="home__capabilities">
        <div className="capabilities-pin">
          {/* Full-bleed canvas animation */}
          <div className="capabilities-bg" aria-hidden="true">
            {isMounted && (
              <CapabilitiesCanvas sectionRef={capabilitiesRef} />
            )}
          </div>

          {/* Cinematic gradient overlay for legibility */}
          <div className="capabilities-overlay" aria-hidden="true" />

          {/* Overlay content */}
          <div className="capabilities-content container">
            <motion.div
              className="section-head"
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.45 }}
              variants={capabilityText}
            >
              <motion.span className="section-label" variants={capabilityTextLine}>
                How We Create!
              </motion.span>
              <motion.h2 variants={capabilityTextLine}>
                Every Great Creation Is Shaped Through Four Purposeful Stages!
              </motion.h2>
            </motion.div>

            <motion.div
              className="cap-list"
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.15 }}
              variants={capabilityGrid}
            >
              {CAPABILITIES.map(([num, title, desc]) => (
                <motion.div
                  className="cap-card"
                  key={num}
                  variants={capabilityCard}
                  whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                >
                  <span className="cap-card__num">{num}</span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section ref={featuredRef} className="home__featured container">
        <div className="home__section-contact-scene" aria-hidden="true">
          <SectionInView rootMargin="200px">
            <Suspense fallback={null}>
              <ContactScene progressRef={progress} showBeacon={false} convergeParticles={false} />
            </Suspense>
          </SectionInView>
        </div>
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.45 }} variants={capabilityText}>
          <motion.span className="section-label" variants={capabilityTextLine}>Featured Creations!</motion.span>
          <motion.h2 variants={capabilityTextLine}>A Showcase Of Visions Brought To Life!</motion.h2>
          <NavLink to="/portfolio" className="btn">Explore Our Work!</NavLink>
        </motion.div>

        <motion.div className="featured-grid" initial="hidden" animate={featuredControls} variants={capabilityGrid}>
          {FEATURED.map((f, i) => (
            <motion.div
              className={`featured-card${f.video ? ' featured-card--video' : ''}`}
              key={f.title}
              variants={capabilityCard}
              whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
            >
              <div className={`featured-card__art${f.video ? ' featured-card__art--portrait' : ''}`} style={{ '--i': i }}>
                {f.video ? (
                  <MuteOnlyVideo src={f.video} poster={f.img} title={f.title} />
                ) : (
                  <img src={f.img} alt={f.title} width="600" height="400" loading="lazy" decoding="async" />
                )}
              </div>
              <span className="eyebrow">{f.tag}</span>
              {!f.video && <h3>{f.title}</h3>}
              <span className="featured-card__metric">{f.metric}</span>
            </motion.div>
          ))}
        </motion.div>
      </section>

      <section className="home__testimonials container">
        <div className="home__section-contact-scene" aria-hidden="true">
          <SectionInView rootMargin="200px">
            <Suspense fallback={null}>
              <ContactScene progressRef={progress} showBeacon={false} convergeParticles={false} />
            </Suspense>
          </SectionInView>
        </div>
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.45 }} variants={capabilityText}>
          <motion.span className="section-label" variants={capabilityTextLine}>Client Voices!</motion.span>
          <motion.h2 variants={capabilityTextLine}>
            The Best Stories About Our Work Are Told By Our Clients!
            <br />
            <br />
            <span className="testimonial-heading-regular">Every Project Is A Collaboration, And Every Collaboration Leaves A Story! Here's What Our Clients Have To Say About Working With Graphician Studios!</span>
          </motion.h2>
        </motion.div>

        <motion.div ref={testimonialsRef} initial="hidden" animate={testimonialControls} variants={marqueeReveal}>
          <TestimonialCarousel testimonials={TESTIMONIALS} />
        </motion.div>
      </section>

    </div>
  )
}
