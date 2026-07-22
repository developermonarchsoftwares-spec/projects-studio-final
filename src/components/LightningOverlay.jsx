import { useEffect, useRef } from 'react'
import { useScroll, useMotionValueEvent } from 'framer-motion'

const BOLT_TTL   = 600   // Lingering duration for strokes
const BOLT_DEPTH = 6     // Jaggedness depth

/* ── Midpoint-displacement lightning path ─────────────────────── */
function lightningPts(x1, y1, x2, y2, disp, depth) {
  if (depth === 0) return [[x2, y2]]
  const mx = (x1 + x2) / 2 + (Math.random() - 0.5) * disp
  const my = (y1 + y2) / 2 + (Math.random() - 0.5) * disp
  return [
    ...lightningPts(x1, y1, mx, my, disp * 0.55, depth - 1),
    ...lightningPts(mx, my, x2, y2, disp * 0.55, depth - 1),
  ]
}

function spawnBolt(ox, oy, tx, ty) {
  const disp = Math.max(12, Math.hypot(tx - ox, ty - oy) * 0.26)
  return {
    pts: [[ox, oy], ...lightningPts(ox, oy, tx, ty, disp, BOLT_DEPTH)],
    born: performance.now(),
  }
}

/* ── Spawn 1 small, short stroke striking down towards targetX, targetY ── */
function spawnShortStrike(targetX, targetY, isScroll = false) {
  const strokeLen = isScroll ? 140 + Math.random() * 40 : 70 + Math.random() * 30
  
  const startY = Math.max(0, targetY - strokeLen)
  const startX = targetX + (Math.random() - 0.5) * 35
  
  const endX = targetX + (Math.random() - 0.5) * 10
  const endY = targetY

  const mainBolt = spawnBolt(startX, startY, endX, endY)
  const bolts = [mainBolt]

  // 25% chance to branch out a secondary smaller stroke
  if (Math.random() < 0.25) {
    const splitIdx = Math.floor(mainBolt.pts.length * (0.4 + Math.random() * 0.3))
    const [bx, by] = mainBolt.pts[splitIdx] ?? [endX, endY]
    
    const branchLength = (endY - by) * 0.5
    const branchEndX = bx + (Math.random() - 0.5) * 80
    const branchEndY = by + branchLength

    bolts.push(spawnBolt(bx, by, branchEndX, branchEndY))
  }

  return bolts
}

/* ── Draw one bolt with vibrant 3-pass electric blue glow ───── */
function drawBolt(ctx, pts, alpha) {
  if (pts.length < 2) return
  ctx.save()
  ctx.lineCap  = 'round'
  ctx.lineJoin = 'round'

  const draw = (width, color, blur, ga) => {
    ctx.globalAlpha  = alpha * ga
    ctx.shadowBlur   = blur
    ctx.shadowColor  = '#00f0ff' // Radiant neon cyan-blue
    ctx.strokeStyle  = color
    ctx.lineWidth    = width
    ctx.beginPath()
    ctx.moveTo(pts[0][0], pts[0][1])
    for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1])
    ctx.stroke()
  }

  // White strokes with vibrant electric blue neon glow
  draw(12.0, 'rgba(0, 110, 255, 0.45)', 40, 0.45) // Thick electric blue outer glow
  draw(4.5,  'rgba(255, 255, 255, 0.85)', 15, 0.80) // Strong white stroke inside the glow
  draw(1.8,  '#ffffff', 0, 1.00)                    // Solid pure white center core

  ctx.restore()
}

export default function LightningOverlay({ sectionRef }) {
  const canvasRef = useRef(null)
  const ctxRef    = useRef(null)   // cached 2-D context
  const boltsRef  = useRef([])
  const rafRef    = useRef(null)
  const zoneRef   = useRef('mid') // Track state boundaries: 'start' | 'mid' | 'end'

  /* ── Get scroll progress for target capabilities section ── */
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
    layoutEffect: false,
  })

  /* ── Match canvas size to wrapper ─────────────────────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const sync = () => {
      canvas.width   = canvas.offsetWidth
      canvas.height  = canvas.offsetHeight
      ctxRef.current = null   // invalidate cached context after resize
    }
    const ro = new ResizeObserver(sync)
    ro.observe(canvas)
    sync()
    return () => ro.disconnect()
  }, [])

  /* ── rAF render loop with max concurrent cap of 4 ─────────── */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const loop = () => {
      if (!ctxRef.current) {
        ctxRef.current = canvas.getContext('2d')
      }
      const ctx = ctxRef.current
      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Filter out expired bolts
      boltsRef.current = boltsRef.current.filter(b => now - b.born < BOLT_TTL)
      
      // Enforce hard limit of 4 active bolts on screen
      if (boltsRef.current.length > 4) {
        boltsRef.current = boltsRef.current.slice(0, 4)
      }

      for (const bolt of boltsRef.current) {
        const t     = (now - bolt.born) / BOLT_TTL
        const alpha = Math.pow(1 - t, 1.6)
        drawBolt(ctx, bolt.pts, alpha)
      }
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [])

  /* ── Scroll progress state triggers (start and end only) ── */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    // Only trigger if we are under the active cap
    if (boltsRef.current.length >= 4) return

    // 1. Starting Boundary trigger (progress near 0)
    if (v <= 0.03) {
      if (zoneRef.current !== 'start') {
        zoneRef.current = 'start'
        
        // Spawn 1 or 2 strokes striking from top
        const tx = canvas.width * (0.2 + Math.random() * 0.6)
        const ty = canvas.height * 0.4
        boltsRef.current.push(...spawnShortStrike(tx, ty, true))
      }
    } 
    // 2. Ending Boundary trigger (progress near 1)
    else if (v >= 0.97) {
      if (zoneRef.current !== 'end') {
        zoneRef.current = 'end'
        
        // Spawn 1 or 2 strokes striking from top
        const tx = canvas.width * (0.2 + Math.random() * 0.6)
        const ty = canvas.height * 0.6
        boltsRef.current.push(...spawnShortStrike(tx, ty, true))
      }
    } 
    // 3. Middle range resets the zone states so it can trigger again on transition
    else {
      zoneRef.current = 'mid'
    }
  })

  /* ── Mouse → hover triggers are allowed (capped & throttled) ── */
  useEffect(() => {
    let timer = null
    const onMove = (e) => {
      if (timer) return
      
      // Only spawn if we currently have fewer than 4 bolts active
      if (boltsRef.current.length >= 4) return

      timer = setTimeout(() => { timer = null }, 350)
      
      const canvas = canvasRef.current
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      if (rect.width === 0) return
      const cx = e.clientX - rect.left
      const cy = e.clientY - rect.top
      if (cx < -10 || cy < -10 || cx > rect.width + 10 || cy > rect.height + 10) return
      
      const newBolts = spawnShortStrike(cx, cy, false)
      boltsRef.current.push(...newBolts)
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 3,
      }}
    />
  )
}
