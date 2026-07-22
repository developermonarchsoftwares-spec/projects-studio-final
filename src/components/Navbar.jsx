import { useState, useEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import './navbar.css'

const LINKS = [
  { to: '/', label: 'Studio' },
  { to: '/service', label: 'Solutions' },
  { to: '/portfolio', label: 'Our Creations' },
  { to: '/about', label: 'Story' },
  { to: '/contact', label: ' Let’s Create ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const scrolledRef = useRef(false)
  const tickingRef = useRef(false)
  const location = useLocation()

  useEffect(() => {
    const updateScrolled = () => {
      const y = window.scrollY
      const next = scrolledRef.current ? y > 24 : y > 56

      if (next !== scrolledRef.current) {
        scrolledRef.current = next
        setScrolled(next)
      }

      tickingRef.current = false
    }

    const onScroll = () => {
      if (tickingRef.current) return
      tickingRef.current = true
      window.requestAnimationFrame(updateScrolled)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <>
      <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <NavLink to="/" className="nav__logo" onClick={() => setOpen(false)}>
            <img
              src="/assets/graphician-studios-logo.png"
              alt="Graphician Studios"
              width="278"
              height="46"
              loading="eager"
              fetchpriority="high"
            />
          </NavLink>

          <nav className="nav__links">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <button
            className={`nav__burger ${open ? 'is-open' : ''}`}
            aria-label="Toggle Menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
          </button>
        </div>

        <AnimatePresence>
          {open && (
            <motion.div
              className="nav__mobile"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {LINKS.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 + 0.1 }}
                >
                  <NavLink to={l.to} end={l.to === '/'} onClick={() => setOpen(false)}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
