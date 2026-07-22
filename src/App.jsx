import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import FloatingWhatsApp from './components/FloatingWhatsApp.jsx'
import Loader from './components/Loader.jsx'
import ScrollToTop from './components/ScrollToTop.jsx'
import SEO from './components/SEO.jsx'
import AudioManager from './components/AudioManager.jsx'

/* ── Lazy-load every page so only the current route's JS is fetched ── */
const Home      = lazy(() => import('./pages/Home.jsx'))
const Service   = lazy(() => import('./pages/Service.jsx'))
const Portfolio = lazy(() => import('./pages/Portfolio.jsx'))
const About     = lazy(() => import('./pages/About.jsx'))
const Contact   = lazy(() => import('./pages/Contact.jsx'))

function PageFade({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(6px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0, ease: [0.16, 1, 0.3, 1] } }}
      exit={{ opacity: 0, y: -16, filter: 'blur(4px)', transition: { duration: 0.5, ease: [0.4, 0, 0.6, 1] } }}
    >
      {children}
    </motion.div>
  )
}

/* Minimal inline fallback — avoids importing a heavy Loader just for Suspense */
function PageShell() {
  return <div style={{ minHeight: '100vh' }} />
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <Loader />
      <ScrollToTop />
      <SEO />
      <Navbar />
      <AnimatePresence mode="wait" initial={false}>
        <Routes location={location} key={location.pathname}>
          <Route path="/"         element={<Suspense fallback={<PageShell />}><PageFade><Home      /></PageFade></Suspense>} />
          <Route path="/service"  element={<Suspense fallback={<PageShell />}><PageFade><Service   /></PageFade></Suspense>} />
          <Route path="/portfolio"element={<Suspense fallback={<PageShell />}><PageFade><Portfolio /></PageFade></Suspense>} />
          <Route path="/about"    element={<Suspense fallback={<PageShell />}><PageFade><About     /></PageFade></Suspense>} />
          <Route path="/contact"  element={<Suspense fallback={<PageShell />}><PageFade><Contact   /></PageFade></Suspense>} />
          <Route path="*"         element={<Suspense fallback={<PageShell />}><PageFade><Home      /></PageFade></Suspense>} />
        </Routes>
      </AnimatePresence>
      <Footer />
      <FloatingWhatsApp />
      <AudioManager />
    </>
  )
}
