import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './loader.css'

const VIDEO_SRC = '/assets/Opening page.mp4'
const MAX_WAIT = 8000 // hard cap in ms — dismiss even if video hasn't ended

export default function Loader() {
  const [done, setDone] = useState(false)
  const videoRef = useRef(null)
  const timerRef = useRef(null)

  const dismiss = () => {
    clearTimeout(timerRef.current)
    setDone(true)
  }

  useEffect(() => {
    // Hard cap — never block user longer than MAX_WAIT
    timerRef.current = setTimeout(dismiss, MAX_WAIT)

    const video = videoRef.current
    if (video) {
      // Skip first 0.2 s to avoid the flicker frame at the very start
      video.currentTime = 0
      video.play().catch(() => {})
      video.addEventListener('ended', dismiss)
    }

    return () => {
      clearTimeout(timerRef.current)
      if (video) video.removeEventListener('ended', dismiss)
    }
  }, [])

  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          className="loader"
          exit={{ opacity: 0, scale: 1.04 }}
          transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
        >
          {/* 16:9 Aspect-ratio Video Container */}
          <div className="loader__video-container">
            <video
              ref={videoRef}
              className="loader__video"
              src={VIDEO_SRC}
              muted
              playsInline
              preload="auto"
              disablePictureInPicture
              controlsList="nodownload nofullscreen noplaybackrate"
            />
            {/* Edge blending gradients */}
            <div className="loader__video-blend" />
          </div>

          {/* Subtle vignette overlay for cinematic feel */}
          <div className="loader__vignette" />

          {/* Skip prompt — appears after 2 s */}
          <motion.button
            className="loader__skip"
            onClick={dismiss}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 0.6 }}
            aria-label="Skip intro"
          >
            Skip&nbsp;›
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
