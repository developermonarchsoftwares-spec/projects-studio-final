import { lazy, Suspense, useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSectionProgress from '../hooks/useSectionProgress.js'
import SectionInView from '../components/SectionInView.jsx'
import { useVideoAudio } from '../lib/videoAudioManager.js'
import '../pages/portfolio.css'

const PortfolioScene = lazy(() => import('../three/PortfolioScene.jsx'))

const PROJECTS = [
  { title: 'Process Reel', cat: 'Production', metric: 'Featured', size: '6 MB', year: '2026', video: '/assets/VID-20260714-WA0007.mp4', img: '/assets/VID-20260714-WA0007-poster.jpg', gridOnly: true },
  { title: 'Moments Reel', cat: 'Production', metric: 'Featured', size: '6.7 MB', year: '2026', video: '/assets/VID-20260714-WA0008.mp4', img: '/assets/VID-20260714-WA0008-poster.jpg', gridOnly: true },
  { title: 'Story Reel', cat: 'Production', metric: 'Featured', size: '7.3 MB', year: '2026', video: '/assets/VID-20260714-WA0009.mp4', img: '/assets/VID-20260714-WA0009-poster.jpg', gridOnly: true },
  { title: 'Spotlight Reel', cat: 'Production', metric: 'Featured', size: '6.3 MB', year: '2026', video: '/assets/VID-20260714-WA0010.mp4', img: '/assets/VID-20260714-WA0010-poster.jpg', gridOnly: true },
  { title: 'Highlight Reel', cat: 'Production', metric: 'Featured', size: '6.7 MB', year: '2026', video: '/assets/VID-20260714-WA0011.mp4', img: '/assets/VID-20260714-WA0011-poster.jpg', gridOnly: true },
  { title: 'Signature Reel', cat: 'Production', metric: 'Featured', size: '7.5 MB', year: '2026', video: '/assets/VID-20260714-WA0012.mp4', img: '/assets/VID-20260714-WA0012-poster.jpg', gridOnly: true },
  { title: 'Featured Reel', cat: 'Production', metric: 'Featured', size: '7.1 MB', year: '2026', video: '/assets/VID-20260714-WA0013.mp4', img: '/assets/VID-20260714-WA0013-poster.jpg', gridOnly: true },
  { title: 'Project Spotlight', cat: 'Production', metric: 'Featured', size: '9.3 MB', year: '2026', video: '/assets/VID-20260714-WA0015.mp4', img: '/assets/VID-20260714-WA0015-poster.jpg', gridOnly: true },
  { title: 'Client Spotlight', cat: 'Production', metric: 'Featured', size: '9.1 MB', year: '2026', video: '/assets/VID-20260714-WA0016.mp4', img: '/assets/VID-20260714-WA0016-poster.jpg', gridOnly: true },
  { title: 'Studio Highlights', cat: 'Production', metric: 'Featured', size: '9.3 MB', year: '2026', video: '/assets/VID-20260714-WA0017.mp4', img: '/assets/VID-20260714-WA0017-poster.jpg', gridOnly: true },
  { title: 'Behind The Scenes', cat: 'Production', metric: 'Featured', size: '11.7 MB', year: '2026', video: '/assets/VID-20260714-WA0018.mp4', img: '/assets/VID-20260714-WA0018-poster.jpg', gridOnly: true },
  { title: 'Creative Showreel', cat: 'Production', metric: 'Featured', size: '12.7 MB', year: '2026', video: '/assets/VID-20260714-WA0019.mp4', img: '/assets/VID-20260714-WA0019-poster.jpg', gridOnly: true },
  { title: 'Origin Reel', cat: 'Production', metric: 'Featured', size: '5.1 MB', year: '2026', video: '/assets/VID-20260714-WA0005.mp4', img: '/assets/VID-20260714-WA0005-poster.jpg', gridOnly: true },
  { title: 'Vision Reel', cat: 'Production', metric: 'Featured', size: '7.6 MB', year: '2026', video: '/assets/VID-20260714-WA0014.mp4', img: '/assets/VID-20260714-WA0014-poster.jpg', gridOnly: true },
  { title: 'Journey Reel', cat: 'Production', metric: 'Featured', size: '5.8 MB', year: '2026', video: '/assets/VID-20260714-WA0006.mp4', img: '/assets/VID-20260714-WA0006-poster.jpg', gridOnly: true },
  { title: 'Motion Reel', cat: 'Production', metric: 'Featured', size: '6 MB', year: '2026', video: '/assets/VID-20260714-WA0007.mp4', img: '/assets/VID-20260714-WA0007-poster.jpg', gridOnly: true },
  { title: 'Brand Design', cat: 'Daddy Popcorn Campaign', metric: '+184% Ctr', year: '2026', img: '/assets/1.jpg.jpeg' },
  { title: 'Product Design ', cat: 'Eveglow Skincare Product', metric: '2.1M Views', year: '2025', img: '/assets/4.jpg.jpeg' },
  { title: 'Visual Design ', cat: 'Glass Effect Experiment', metric: '4.6x Roas', year: '2025', img: '/assets/glass-effect.jpg' },
  { title: 'Logo Design', cat: 'Unnai Arindhal Identity', metric: '+92% Aov', year: '2025', img: '/assets/C.jpg.jpeg' },
  { title: 'Creative Design', cat: 'Fog Blur Effect Artwork', metric: '3.8M Reach', year: '2024', img: '/assets/3.jpg.jpeg' },
  { title: 'Packaging Design', cat: 'Eveglow Karisalankanni Shampoo', metric: '-61% Cpi', year: '2024', img: '/assets/5.jpg.jpeg' },
  { title: 'Graphic Experiment', cat: 'Stretch Effect Study', metric: '12M Impressions', year: '2024', img: '/assets/stretch-effect-banner.jpg' },
  { title: 'Monarch Brand Identity', cat: 'Design', metric: '5.2x Roas', year: '2024', img: 'https://picsum.photos/seed/monarch-brand/800/600' },
]

const FILTERS = ['All!', ...Array.from(new Set(PROJECTS.map((p) => p.cat))).filter((c) => c !== 'Partnerships')]
const ANIMATION_PROJECTS = PROJECTS.filter((p) => !p.gridOnly).map((p, i) =>
  i === 0
    ? { ...p, img: '/assets/daddys-popcorn-banner.jpg' }
    : i === 1
      ? { ...p, img: '/assets/eveglow-charcoal-banner.jpg' }
      : i === 2
        ? { ...p, img: '/assets/glass-effect-banner.jpg' }
        : i === 3
          ? { ...p, img: '/assets/UNNAI ARINDHAL logo.jpg' }
          : i === 4
            ? { ...p, img: '/assets/fog-blur-banner.jpg' }
            : i === 5
              ? { ...p, img: '/assets/eveglow-shampoo-banner.jpg' }
              : i === 6
                ? { ...p, img: '/assets/stretch-effect-banner.jpg' }
                : p.title === 'Product Design'
                  ? { ...p, img: '/assets/D.jpg.jpeg' }
                  : p.title === 'Creative Design'
                    ? { ...p, img: '/assets/F.jpg.jpeg' }
                    : p.title === 'Visual Design'
                      ? { ...p, img: '/assets/E.jpg.jpeg' }
                      : p.title === 'Brand Design'
                        ? { ...p, img: '/assets/B.jpg.jpeg' }
            : p
)

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const projectCard = {
  hidden: (i) => ({
    opacity: 0,
    scale: 0.92,
    y: 40,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  show: (i) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.78,
      delay: i * 0.07,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  exit: {
    opacity: 0,
    scale: 0.94,
    transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
  },
}

/* video card is narrower than the grid track, so it skips the large
   sideways travel distance used by projectCard - at that width the
   offset carries it too far out for the viewport check to ever see it
   as visible, leaving it stuck hidden */
const videoProjectCard = {
  hidden: { opacity: 0, scale: 0.92 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.78, ease: [0.16, 1, 0.3, 1] } },
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] } },
}

/**
 * MuteOnlyVideo — plays only when visible (IntersectionObserver).
 * Pauses when scrolled off-screen to save CPU / network bandwidth.
 * Centrally controlled so only ONE video plays audio at any time.
 */
export function MuteOnlyVideo({ id, src, poster, title }) {
  const videoRef = useRef(null)
  const videoId = id || src || title
  const { isMuted, toggleMute } = useVideoAudio(videoId, videoRef)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {})
        } else {
          video.pause()
        }
      },
      { threshold: 0.2 }
    )
    observer.observe(video)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <video
        ref={videoRef}
        src={src}
        loop
        playsInline
        muted={isMuted}
        preload="none"
        poster={poster}
        aria-label={title}
        disablePictureInPicture
        controlsList="nodownload nofullscreen noplaybackrate noremoteplayback"
      />
      <button
        type="button"
        className="portfolio__mute-btn"
        onClick={toggleMute}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
      >
        {isMuted ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
            <path d="M16 9l5 5M21 9l-5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
            <path d="M16 8a5 5 0 0 1 0 8M19 5a9 9 0 0 1 0 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        )}
      </button>
    </>
  )
}

export default function Portfolio() {
  const sectionRef = useRef(null)
  const sectionProgress = useSectionProgress(sectionRef, { mode: 'sticky' })
  const [filter, setFilter] = useState('All!')

  const visible = filter === 'All!' ? PROJECTS : PROJECTS.filter((p) => p.cat === filter)

  return (
    <div className="page portfolio">
      <section className="portfolio__hero container">
        <span className="eyebrow">Our Creations!</span>
        <h1>
          A Showcase Of <span className="grad-text">Ideas Brought To Life!</span>
        </h1>
        <p className="portfolio__lede">Explore The Stories, Strategies And Creativity Behind Every Project!</p>
      </section>

      <section className="portfolio__flythrough" ref={sectionRef}>
        <div className="portfolio__scene-pin">
          <SectionInView rootMargin="200px">
            <Suspense fallback={null}>
              <PortfolioScene progressRef={sectionProgress} projects={ANIMATION_PROJECTS} />
            </Suspense>
          </SectionInView>
        </div>
      </section>

      <section className="portfolio__grid-section container">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
          <span className="section-label">Explore!</span>
          <h2>Browse Every Creation By Creative Discipline!</h2>
        </motion.div>

        <div className="portfolio__filters">
          {FILTERS.map((f) => (
            <button key={f} className={`chip ${filter === f ? 'is-active' : ''}`} onClick={() => setFilter(f)}>
              {f.endsWith('!') ? f : `${f}!`}
            </button>
          ))}
        </div>

        <div className="portfolio__cards">
          <AnimatePresence>
            {visible.map((p, i) => (
              <motion.div
                key={p.title}
                custom={i}
                initial="hidden"
                whileInView="show"
                exit="exit"
                whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
                viewport={{ once: true, amount: 0 }}
                variants={p.video ? videoProjectCard : projectCard}
                className={`portfolio__card${p.video ? ' portfolio__card--video' : ''}`}
              >
                <div className={`portfolio__card-art${p.video ? ' portfolio__card-art--portrait' : ''}`}>
                  {p.video ? (
                    <MuteOnlyVideo id={`portfolio-${p.title}`} src={p.video} poster={p.img} title={p.title} />
                  ) : (
                    <img src={p.img} alt={p.title} width="600" height="400" loading="lazy" decoding="async" />
                  )}
                </div>
                <span className="eyebrow">{p.cat}</span>
                {!p.video && <h3>{p.title}</h3>}
                <div className="portfolio__card-foot">
                  <span>{p.metric}</span>
                  <span>{p.size || p.year}</span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>
    </div>
  )
}
