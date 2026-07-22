import { lazy, Suspense, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import useScrollProgress from '../hooks/useScrollProgress.js'
import '../pages/contact.css'

const ContactScene = lazy(() => import('../three/ContactScene.jsx'))

const FAQ = [
  ['How Fast Can We Start?', 'Most Engagements Kick Off Within Two Weeks Of Signing - Strategy And Account Audits Start Immediately!'],
  ['Do You Work With In-House Teams?', 'Often! We Slot In As The Creative And Paid Media Arm Alongside An Internal Brand Or Product Team!'],
  ["What's The Minimum Commitment?", 'Three Months, So We Have Room To Test And Let Creatives Actually Optimise!'],
]

const socialIcons = {
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" />
    </>
  ),
  linkedin: (
    <>
      <path d="M6.5 10v8" />
      <path d="M6.5 7v.01" />
      <path d="M11 18v-8" />
      <path d="M11 13.5c0-2.1 1.2-3.5 3.1-3.5 1.8 0 2.9 1.2 2.9 3.5V18" />
    </>
  ),
  youtube: (
    <>
      <path d="M4 8.5c.2-1.4 1.1-2.3 2.5-2.5 1.4-.2 3.3-.3 5.5-.3s4.1.1 5.5.3c1.4.2 2.3 1.1 2.5 2.5.1.9.2 2 .2 3.5s-.1 2.6-.2 3.5c-.2 1.4-1.1 2.3-2.5 2.5-1.4.2-3.3.3-5.5.3s-4.1-.1-5.5-.3c-1.4-.2-2.3-1.1-2.5-2.5-.1-.9-.2-2-.2-3.5s.1-2.6.2-3.5Z" />
      <path d="m10.5 9.2 4.4 2.8-4.4 2.8V9.2Z" />
    </>
  ),
  whatsapp: (
    <>
      <path d="m4.8 19.2 1.1-3.3a7.3 7.3 0 1 1 2.9 2.7l-4 .6Z" />
      <path d="M9.1 8.8c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.6 1.4c.1.2.1.4 0 .6l-.4.5c-.1.1-.2.3-.1.5.4.8 1.2 1.6 2.1 2 .2.1.4.1.5-.1l.6-.7c.1-.2.4-.2.6-.1l1.4.7c.2.1.4.3.4.5 0 .5-.2 1-.6 1.4-.4.3-.9.5-1.4.5-1.2 0-2.8-.8-4.1-2.1-1.3-1.3-2.1-2.9-2.1-4.1 0-.4.1-.9.3-1.2Z" />
    </>
  ),
}

function SocialIcon({ name }) {
  return (
    <svg className="contact__social-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      {socialIcons[name]}
    </svg>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } },
}

const faqGrid = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
}

const faqItem = {
  hidden: { opacity: 0, y: 26, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] },
  },
}

export default function Contact() {
  const { progress } = useScrollProgress()
  const [status, setStatus] = useState('idle')
  const [openFaq, setOpenFaq] = useState(null)
  const formRef = useRef(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    const formData = new FormData(e.currentTarget)
    const payload = {
      name: formData.get('name') || '',
      email: formData.get('email') || '',
      subject: formData.get('subject') || 'New Website Enquiry',
      message: formData.get('message') || '',
    }

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) throw new Error('Email request failed')

      setStatus('sent')
      formRef.current?.reset()
    } catch (error) {
      setStatus('idle')
      window.alert('Message could not be sent right now. Please try again later.')
    }
  }

  return (
    <div className="page contact">
      <div className="canvas-fixed">
        <Suspense fallback={null}>
          <ContactScene progressRef={progress} dotOpacity={0.4} />
        </Suspense>
      </div>

      <section className="contact__hero container">
        <span className="eyebrow">Connect!</span>
        <h1>
          Every Great Creation <span className="grad-text">Begins With <span style={{whiteSpace: 'nowrap'}}>A Conversation!</span></span>
        </h1>
        <p className="contact__lede">
          Tell Us About Your Idea, Brand Or Business. Together, We'll Bring It To Life
          Through Creativity And Purpose!
        </p>
      </section>

      <section className="contact__body container">
        <motion.div className="contact__panel" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
          {status === 'sent' ? (
            <div className="contact__success">
              <span className="eyebrow">Message Received</span>
              <h2>We're On It!</h2>
              <p>Thanks - A Strategist From Graphician Studios Will Reply Within One Business Day!</p>
            </div>
          ) : (
            <form ref={formRef} onSubmit={handleSubmit} className="contact__form">
              <div className="field-row">
                <label>
                  <span>Name</span>
                  <input type="text" name="name" required placeholder="Your Name!" />
                </label>
                <label>
                  <span>Email</span>
                  <input type="email" name="email" required placeholder="Your Email!" />
                </label>
              </div>

              <label>
                <span>Subject</span>
                  <input type="text" name="subject" required placeholder="What's This About!" />
              </label>

              <label>
                <span>Tell Us Your Story!</span>
                <textarea name="message" rows={4} required placeholder="Share Your Vision, Goals And What You'd Love To Create Together!" />
              </label>

              <button type="submit" className="btn solid contact__submit" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending!!!' : "Let's Create!"}
              </button>
            </form>
          )}
        </motion.div>

        <motion.div className="contact__info" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} transition={{ delay: 0.1 }}>
          <div className="contact__info-block">
            <span className="section-label">Our Studio!</span>
            <p>Trichy Main Road, Gugai, Salem - 636006</p>
          </div>
          <div className="contact__info-block">
            <span className="section-label">Reach Us!</span>
            <a href="mailto:Graphicianstudios@gmail.com">Graphicianstudios@gmail.com</a>
            <a href="tel:+919600996880">+91 96009 96880</a>
          </div>
          <div className="contact__info-block">
            <span className="section-label">Our Journey!</span>
            <a className="contact__social-link" href="https://www.instagram.com/graphician_studios/" target="_blank" rel="noopener noreferrer"><SocialIcon name="instagram" />Instagram</a>
            <a className="contact__social-link" href="https://in.linkedin.com/company/graphician-studios" target="_blank" rel="noopener noreferrer"><SocialIcon name="linkedin" />LinkedIn</a>
            <a className="contact__social-link" href="https://www.youtube.com/@GraphicianStudio" target="_blank" rel="noopener noreferrer"><SocialIcon name="youtube" />YouTube</a>
            <a className="contact__social-link" href="https://wa.me/919600996880" target="_blank" rel="noopener noreferrer"><SocialIcon name="whatsapp" />WhatsApp</a>
          </div>  
        </motion.div>
      </section>

      <section className="container contact__faq">
        <motion.div className="section-head" initial="hidden" whileInView="show" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
          <span className="section-label">Before We Connect!</span>
          <h2>A Few Things Worth Knowing Before We Create Together!</h2>
        </motion.div>

        <motion.div className="contact__faq-list" initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.28, margin: '0px 0px -10% 0px' }} variants={faqGrid}>
          {FAQ.map(([q, a], i) => (
            <motion.div key={q} className={`contact__faq-row ${openFaq === i ? 'is-open' : ''}`} variants={faqItem}>
              <button
                type="button"
                className="contact__faq-question"
                aria-expanded={openFaq === i}
                onClick={() => setOpenFaq((current) => (current === i ? null : i))}
              >
                <h3>{q}</h3>
              </button>
              <div className="contact__faq-answer" aria-hidden={openFaq !== i}>
                <p>{a}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>
    </div>
  )
}
