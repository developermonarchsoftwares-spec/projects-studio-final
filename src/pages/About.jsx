import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useSectionProgress from '../hooks/useSectionProgress.js'
import useIsVisible from '../hooks/useIsVisible.js'
import SectionInView from '../components/SectionInView.jsx'
import '../pages/about.css'

const AboutScene = lazy(() => import('../three/AboutScene.jsx'))

const MILESTONES = [
  { year: '2018!', title: 'The Dream Took Its First Real Step!', copy: 'Hari Vikraman PV Immersed Himself In The World Of Adobe After Effects And Premiere Pro. Every Mistake Became A Lesson, And Every Sleepless Night Brought Him One Step Closer To Mastering The Art Of Visual Storytelling! ' },
  { year: '2019!', title: 'An Idea Between School Friends!', copy: 'A Casual Conversation Between Hari Vikraman PV And Sidheque S Sparked The Idea That Would One Day Become Graphician Studios!' },
  { year: '2020!', title: 'Mentorship Shaped The Journey!', copy: ' Under The Mentorship Of Photokaaran Dhas (Mr. Dhas Thanikachalam), Learning Final Cut Pro Became A Journey Of Confidence, Creativity And Purpose!' },
  { year: '2022!', title: 'Hari Graphics Began!', copy: ' On 24 April 2022, Hari Vikraman PV Launched Hari Graphics, A Freelance Venture Where Every Client, Every Deadline And Every Creative Challenge Shaped The Vision For What Would Become Graphician Studios!' },
  { year: '2025!', title: 'Graphician Studios Came To Life!', copy: 'On 15th July 2025, Graphician Studios Officially Came To Life.What Started With Three Enthusiastic Creators And Two Clients Soon Grew Into A Creative Studio Driven By Purpose, Passion And Storytelling!' },
  { year: 'Today!', title: 'Trust Built The Growth!', copy: 'Today, Graphician Studios Proudly Partners With 60+ Businesses Across Tamil Nadu, Supported By A Growing Team Of 10+ Creative Professionals. Every Milestone Has Been Built Through Trust, Referrals And The Confidence Of Clients Who Believed In Our Work!' },
]

const MILESTONE_T = [0.06, 0.23, 0.4, 0.57, 0.74, 0.92]

const VALUES = [
  ['Purpose Before Pixels!', " Great Creativity Starts With Clear Direction!"],
  ['Stories Before Screens!', 'Every Visual Should Have A Purpose!'],
  [' Quality Without Compromise!', 'Every Detail Defines Great Creative Work!'],
  ['Partnership Over Projects!', ' The Best Creative Partnerships Are Built On Trust!'],
]

const STATS = [
  ['60+', 'Businesses Served!'],
  ['2,000+', 'Visual Productions!'],
  ['1,000+', 'Creative Designs!'],
  ['10+', 'Creative Professionals!'],
]

const PEOPLE_COPY = [
  'Every Great Creation Begins With An Idea!',
  'At Graphician Studios, We Believe Great Ideas Deserve Great People. Our Team Of Designers, Editors, Writers And Strategists Works Together To Transform Ideas Into Meaningful Visual Experiences!',
  'Different Minds. Different Talents. One Shared Vision!',
]

const TEAM_MEMBERS = [
  {
    name: 'Hari Vikraman P V!',
    role: 'Founder & Director!',
    desc: 'It started at age 12, watching Marvel Studios and wondering about the people behind the screen. That curiosity became a craft — self-taught in After Effects and Premiere Pro from 2018, sharpened under mentor Photokaran Dhas in 2020, and tested through Hari Graphics from 2022. On 15th July 2025, that journey became Graphician Studios. Hari leads the team with the same purpose that started it all: turning imagination into stories that connect.',
    photo: '/assets/Vikraman.jpg.jpeg',
  },
  {
    name: 'Mohanadev G!',
    role: 'Mentor!',
    desc: 'Guiding Our Journey With Experience, Wisdom And A Vision That Inspires Continuous Growth!',
    photo: '/assets/mohanadev.jpg',
    photoPosition: 'center 35%',
  },
  {
    name: 'Dr. Rahul Srinivasan!',
    role: 'Director!',
    desc: 'Leading Our Vision Through Strategy, Innovation And Creative Leadership!',
    photo: '/assets/dr-rahul-srinivasan.jpg',
    photoPosition: 'center 99%',
  },
  {
    name: 'Ramya P!',
    role: 'Administration Head!',
    desc: 'Keeping Every Project Organised Through Seamless Coordination And Professional Execution!',
    photo: '/assets/ramya-p.png',
    photoPosition: 'center 99%',
  },
  {
    name: 'Sidheque S!',
    role: 'Operational Manager & Showreel Editor!',
    desc: 'Bridging Creative Operations And Execution To Deliver Seamless Visual Experiences!',
    photo: '/assets/sidheque-s.png',
    photoPosition: 'center 40%',
  },
  {
    name: 'Sugavanam A!',
    role: 'Social Media Executive!',
    desc: 'Building Meaningful Digital Connections Through Engaging Content And Consistent Brand Communication!',
    photo: '/assets/sugavanam-a.png',
    photoPosition: 'center 59%',
  },
  {
    name: 'Kirubakar B!',
    role: 'Retention Editor!',
    desc: ' Crafting Engaging Edits That Capture Attention And Keep Audiences Watching!',
    photo: '/assets/kirubakar.png',
    photoPosition: 'center 50%',
  },
  {
    name: 'Raghul P!',
    role: 'Generative Editor!',
    desc: 'Blending Human Creativity And AI To Craft Innovative Visual Experiences!',
    photo: '/assets/raghul-p.png',
    photoPosition: 'center 47%',
  },
  {
    name: 'Logeswari R V!',
    role: 'Visual Designer!',
    desc: 'Transforming Ideas Into Visually Compelling Designs That Communicate With Clarity!',
    photo: '/assets/logeswari-rv.png',
    photoPosition: 'center 79%',
  },
  {
    name: 'Pragathi M!',
    role: 'Content Writer!',
    desc: 'Crafting Stories, Scripts And Content That Give Every Brand A Meaningful Voice!',
    photo: '/assets/pragathi.png',
    photoPosition: 'center 40%',
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const sectionText = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.16,
    },
  },
}

const sectionTextLine = {
  hidden: { opacity: 0, y: 24, scale: 0.98, filter: 'blur(10px)' },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] },
  },
}

const valueDirections = [
  { x: 'clamp(-180px, -14vw, -96px)', y: 0 },
  { x: 0, y: 'clamp(-150px, -12vw, -84px)' },
  { x: 0, y: 'clamp(84px, 12vw, 150px)' },
  { x: 'clamp(96px, 14vw, 180px)', y: 0 },
]

const valueCard = {
  hidden: (i) => ({
    opacity: 0,
    scale: 0.96,
    x: valueDirections[i % valueDirections.length].x,
    y: valueDirections[i % valueDirections.length].y,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
  show: (i) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: {
      duration: 0.68,
      delay: i * 0.05,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

const statCard = {
  hidden: {
    opacity: 0,
    y: 34,
    rotateX: -18,
    scale: 0.94,
    filter: 'blur(10px)',
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.72,
      delay: i * 0.09,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

const teamCard = {
  hidden: {
    opacity: 0,
    y: 54,
    scale: 0.94,
    filter: 'blur(12px)',
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.78,
      delay: (i % 3) * 0.08,
      ease: [0.16, 1, 0.3, 1],
    },
  }),
}

function parseStatValue(raw) {
  const match = String(raw).match(/^(\d+(?:\.\d+)?)(.*)$/)
  if (!match) return { target: 0, decimals: 0, suffix: String(raw) }
  const [, numStr, suffix] = match
  const decimals = numStr.includes('.') ? numStr.split('.')[1].length : 0
  return { target: parseFloat(numStr), decimals, suffix }
}

function StatCard({ num, label, index }) {
  const { target, decimals, suffix } = useMemo(() => parseStatValue(num), [num])
  const [display, setDisplay] = useState(target.toFixed(decimals))
  const [labelVisible, setLabelVisible] = useState(false)
  const rafRef = useRef(null)

  useEffect(() => () => cancelAnimationFrame(rafRef.current), [])

  const runCount = () => {
    cancelAnimationFrame(rafRef.current)
    setLabelVisible(false)

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    if (reduceMotion) {
      setDisplay(target.toFixed(decimals))
      setLabelVisible(true)
      return
    }

    const duration = 1100
    const start = performance.now()
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3)

    const step = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = easeOutCubic(t)
      setDisplay((target * eased).toFixed(decimals))
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setDisplay(target.toFixed(decimals))
        setLabelVisible(true)
      }
    }
    rafRef.current = requestAnimationFrame(step)
  }

  const resetCount = () => {
    cancelAnimationFrame(rafRef.current)
    setDisplay((0).toFixed(decimals))
    setLabelVisible(false)
  }

  return (
    <motion.div
      className="about__stat-card"
      custom={index}
      initial="hidden"
      whileInView="show"
      whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
      viewport={{ once: false, amount: 0.36, margin: '-60px' }}
      variants={statCard}
      onViewportEnter={runCount}
      onViewportLeave={resetCount}
    >
      <strong>
        {display}
        {suffix}
      </strong>
      <motion.span
        animate={{ opacity: labelVisible ? 1 : 0, y: labelVisible ? 0 : 8 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        {label}
      </motion.span>
    </motion.div>
  )
}

export default function About() {
  const sectionRef = useRef(null)
  const sectionProgress = useSectionProgress(sectionRef, { mode: 'sticky' })
  const [active, setActive] = useState(0)

  const isTimelineVisible = useIsVisible(sectionRef, '300px')

  useEffect(() => {
    if (!isTimelineVisible) return
    let raf
    const loop = () => {
      const p = sectionProgress.current
      let idx = 0
      MILESTONE_T.forEach((t, i) => {
        if (p >= t - 0.06) idx = i
      })
      setActive((prev) => (prev !== idx ? idx : prev))
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(raf)
  }, [sectionProgress, isTimelineVisible])

  return (
    <div className="page about">
      <section className="about__hero container">
        <div className="about__hero-grid">
          <div className="about__hero-text">
            <span className="eyebrow">About Us!</span>
            <h1>
              Where It All <span className="grad-text">Began!</span>
            </h1>
            <p className="about__lede">
              For Graphician Studios, That First Frame Took Shape In The Imagination Of A 12-Year-Old Boy Who Sat In Awe Of Marvel Studios. While Others Watched Superheroes On The Screen, He Was Fascinated By The People Behind The Screen - The Creators Who Transformed Imagination Into Reality!
            </p>
          </div>

          <div className="about__hero-media">
            <div className="about__hero-video-wrapper">
              <span className="about__hero-video-sheen" aria-hidden="true" />
              <video
                className="about__hero-video"
                src="/assets/WhatsApp Video 2026-07-16 at 1.54.05 PM.mp4"
                autoPlay
                loop
                muted
                playsInline
                preload="none"
                disablePictureInPicture
                aria-hidden="true"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="about__timeline" ref={sectionRef}>
        <div className="about__scene-pin">
          <div className="about__scene-grid">

            {/* Left: 3D animation + milestone card */}
            <div className="about__scene-left">
              <div className="about__scene-canvas">
                <SectionInView rootMargin="200px">
                  <Suspense fallback={null}>
                    <AboutScene progressRef={sectionProgress} milestones={MILESTONES} />
                  </Suspense>
                </SectionInView>
              </div>
              <div className="about__timeline-overlay">
                <AnimatePresence mode="wait">
                  <motion.div key={active} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -24 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }} className="about__timeline-card">
                    <span className="section-label">{MILESTONES[active].year}</span>
                    <h2>{MILESTONES[active].title}</h2>
                    <p>{MILESTONES[active].copy}</p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>



          </div>
        </div>
      </section>

      <section className="about__values container">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.45 }} variants={sectionText}>
          <motion.span className="section-label" variants={sectionTextLine}>Our Approach!</motion.span>
          <motion.h2 variants={sectionTextLine}> The Principles Behind Every Creation!</motion.h2>
        </motion.div>

        <div className="about__values-grid">
          {VALUES.map(([title, copy], i) => (
            <motion.div
              key={title}
              className="about__value-card"
              custom={i}
              initial="hidden"
              whileInView="show"
              whileHover={{ y: -10, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              viewport={{ once: true, amount: 0.28, margin: '0px 0px -8% 0px' }}
              variants={valueCard}
            >
              <span className="about__value-mark" />
              <h3>{title}</h3>
              <p>{copy}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="about__team container">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.45 }} variants={sectionText}>
          <motion.h2 variants={sectionTextLine}> The Creative Minds! </motion.h2>
          <motion.p className="about__team-kicker" variants={sectionTextLine}>The People Behind Every Great Story! </motion.p>
        </motion.div>

        <motion.div className="about__people-intro" initial="hidden" whileInView="show" viewport={{ once: false, amount: 0.32, margin: '0px 0px -8% 0px' }} variants={sectionText}>
          {PEOPLE_COPY.map((copy, i) => (
            <motion.p key={copy} className={i === PEOPLE_COPY.length - 1 ? 'is-emphasis' : ''} variants={sectionTextLine}>
              {copy}
            </motion.p>
          ))}
        </motion.div>

        <div className="about__team-grid">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.article
              className="about__team-card"
              key={member.name}
              custom={i}
              initial="hidden"
              whileInView="show"
              whileHover={{ y: -13, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } }}
              viewport={{ once: false, amount: 0.24, margin: '0px 0px -8% 0px' }}
              variants={teamCard}
            >
              <div className="about__team-photo">
                <img
                  src={member.photo}
                  alt={member.name}
                  width="400"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  style={member.photoPosition ? { objectPosition: member.photoPosition } : undefined}
                />
              </div>
              <div className="about__team-details">
                <h3>{member.name}</h3>
                <span className="about__team-role">{member.role}</span>
                <p>{member.desc}</p>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="about__stats">
        <div className="about__stats-motion" aria-hidden="true" />
        <div className="container about__stats-grid">
          {STATS.map(([num, label], i) => (
            <StatCard key={label} num={num} label={label} index={i} />
          ))}
        </div>
      </section>
    </div>
  )
}
