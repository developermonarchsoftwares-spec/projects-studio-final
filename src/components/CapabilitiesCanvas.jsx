import { useEffect, useRef } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'
import useIsVisible from '../hooks/useIsVisible.js'

/* ─── Frame list — 299 JPEGs, zero-padded 001..299 ──────────────────────── */
const TOTAL  = 299
const FRAMES = Array.from({ length: TOTAL }, (_, i) =>
  `/assets/frames/ezgif-frame-${String(i + 1).padStart(3, '0')}.jpg`
)

/* ─── Preload cache — populated lazily after first user interaction ──────── */
const IMAGE_CACHE = Array(TOTAL).fill(null)
const LOADED_SET  = new Set()
let   _preloadStarted = false

/**
 * Start loading frames in small batches.
 */
function startPreload(onFrameLoaded) {
  if (_preloadStarted) return
  _preloadStarted = true

  const BATCH = 10
  let   head  = 0

  function loadBatch() {
    const end = Math.min(head + BATCH, TOTAL)
    for (let i = head; i < end; i++) {
      if (IMAGE_CACHE[i]) continue
      const img    = new Image()
      img.decoding = 'async'
      img.onload   = () => {
        IMAGE_CACHE[i] = img
        LOADED_SET.add(i)
        onFrameLoaded?.()
      }
      img.onerror  = () => {
        LOADED_SET.add(i)
      }
      img.src      = FRAMES[i]
      IMAGE_CACHE[i] = img
    }
    head = end
    if (head < TOTAL) {
      if (typeof requestIdleCallback !== 'undefined') {
        requestIdleCallback(() => loadBatch(), { timeout: 2000 })
      } else {
        setTimeout(loadBatch, 120)
      }
    }
  }

  requestAnimationFrame(() => setTimeout(loadBatch, 0))
}

/* ─── CapabilitiesCanvas ─────────────────────────────────────────────────── */
export default function CapabilitiesCanvas({ sectionRef }) {
  const canvasRef   = useRef(null)
  const ctxRef      = useRef(null)   // cached 2-D context
  const rafRef      = useRef(null)
  const curIdxRef   = useRef(0)
  const drawnIdxRef = useRef(-1)
  const isVisible   = useIsVisible(canvasRef, '300px')

  const requestDraw = () => {
    if (!isVisible) return
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      drawFrame(curIdxRef.current)
    })
  }

  /* ── Trigger preload on mount ─────────────────────────────────────────── */
  useEffect(() => {
    startPreload(() => {
      // Draw if the newly loaded frame is closer/better for curIdx
      requestDraw()
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Raw scroll progress ─────────────────────────────────────────────── */
  const { scrollYProgress } = useScroll({
    target:       sectionRef,
    offset:       ['start start', 'end end'],
    layoutEffect: false,
  })

  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const clamped = Math.max(0, Math.min(1, v))
    const newIdx  = Math.min(TOTAL - 1, Math.round(clamped * (TOTAL - 1)))
    if (curIdxRef.current !== newIdx) {
      curIdxRef.current = newIdx
      requestDraw()
    }
  })

  /* ── Resolve nearest loaded frame to prevent blank flashes ──────────── */
  const resolveFrame = (idx) => {
    if (LOADED_SET.has(idx) && IMAGE_CACHE[idx]) return idx
    for (let d = 1; d < TOTAL; d++) {
      const lo = idx - d
      const hi = idx + d
      if (lo >= 0    && LOADED_SET.has(lo) && IMAGE_CACHE[lo]) return lo
      if (hi < TOTAL && LOADED_SET.has(hi) && IMAGE_CACHE[hi]) return hi
    }
    return -1
  }

  /* ── Draw one frame (cover-fit, crisp) ──────────────────────────────── */
  const drawFrame = (idx) => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (!ctxRef.current) {
      ctxRef.current = canvas.getContext('2d', { alpha: false, willReadFrequently: false })
      if (!ctxRef.current) return
      ctxRef.current.imageSmoothingEnabled = true
      ctxRef.current.imageSmoothingQuality = 'high'
    }
    const ctx = ctxRef.current

    const resolved = resolveFrame(idx)
    if (resolved === -1)                         return   // nothing loaded yet
    if (drawnIdxRef.current === resolved)        return   // same frame, skip

    const img = IMAGE_CACHE[resolved]
    const cw  = canvas.width
    const ch  = canvas.height
    const iw  = img.naturalWidth
    const ih  = img.naturalHeight
    if (!iw || !ih) return

    /* object-fit: cover on every device — fills the frame with no letterboxing, matches desktop */
    const isMobile = window.innerWidth <= 768 || cw < ch
    const scale = Math.max(cw / iw, ch / ih)

    const dw    = iw * scale
    const dh    = ih * scale
    const dx    = (cw - dw) / 2
    const dy    = (ch - dh) / 2

    ctx.drawImage(img, dx, dy, dw, dh)

    /* Feather top and bottom edges on mobile so no sharp border or box lines appear */
    if (isMobile) {
      const topH = Math.max(60, dy + 40)
      const topGrad = ctx.createLinearGradient(0, 0, 0, topH)
      topGrad.addColorStop(0, '#000000')
      topGrad.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = topGrad
      ctx.fillRect(0, 0, cw, topH)

      const botY = Math.min(ch - 60, dy + dh - 40)
      const botGrad = ctx.createLinearGradient(0, botY, 0, ch)
      botGrad.addColorStop(0, 'rgba(0,0,0,0)')
      botGrad.addColorStop(1, '#000000')
      ctx.fillStyle = botGrad
      ctx.fillRect(0, botY, cw, ch - botY)
    }

    drawnIdxRef.current = resolved
  }

  // Draw initial frame once mounted & visible
  useEffect(() => {
    if (isVisible) {
      requestDraw()
    }
  }, [isVisible]) // eslint-disable-line react-hooks/exhaustive-deps

  /* ── DPR-aware canvas resize — invalidate cached ctx on resize ──────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const resize = () => {
      const dpr  = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      if (!rect.width || !rect.height) return
      const newW = Math.round(rect.width  * dpr)
      const newH = Math.round(rect.height * dpr)
      if (canvas.width === newW && canvas.height === newH) return
      canvas.width  = newW
      canvas.height = newH
      ctxRef.current      = null
      drawnIdxRef.current = -1
      requestDraw()
    }

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    resize()
    return () => ro.disconnect()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}
