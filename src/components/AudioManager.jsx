import { useEffect, useRef, useState } from 'react'

/**
 * AudioManager
 * ─────────────────────────────────────────────────────────────
 * • Ambient pad    — warm A-major triangle-wave chord
 * • Scroll tick    — soft crystal "ting" (sine pluck)
 * • UI chime       — airy bell with dual harmonics
 * • Transition     — smooth rising shimmer
 * • User-interaction gated — browsers block autoplay until a
 *   gesture is detected; we start after the first click/touch.
 * ─────────────────────────────────────────────────────────────
 */

// ─── Shared singleton context ──────────────────────────────────
let _ctx = null
let _ambientNode = null
let _ambientGain = null
let _started = false
let _scrollTickBuffer = null
let _loadingScrollTick = false
let _scrollSource = null
let _scrollTimeout = null
let _isScrollPlaying = false

function getCtx() {
  if (!_ctx) _ctx = new (window.AudioContext || window.webkitAudioContext)()
  return _ctx
}

async function loadScrollTickBuffer(ctx) {
  if (_scrollTickBuffer || _loadingScrollTick) return
  _loadingScrollTick = true
  try {
    const response = await fetch('/assets/WhatsApp Video 2026-07-16 at 12.58.13 PM.mp3')
    const arrayBuffer = await response.arrayBuffer()
    _scrollTickBuffer = await ctx.decodeAudioData(arrayBuffer)
  } catch (e) {
    console.error('[AudioManager] Failed to load scroll tick audio:', e)
  } finally {
    _loadingScrollTick = false
  }
}

// ─── Build ambient pad (warm A-major chord, triangle waves) ────
function buildAmbient(ctx) {
  const master = ctx.createGain()
  master.gain.value = 0.045  // gentle — pleasant, not intrusive
  master.connect(ctx.destination)

  // A-major chord: A3, C#4, E4, A4 — musical, airy, premium feel
  const voices = [
    { freq: 220.00, gain: 0.30 },  // A3  — warm bass root
    { freq: 277.18, gain: 0.20 },  // C#4 — major third
    { freq: 329.63, gain: 0.25 },  // E4  — perfect fifth
    { freq: 440.00, gain: 0.15 },  // A4  — octave shimmer
    { freq: 220.60, gain: 0.10 },  // A3 +1¢ — subtle warmth/chorus
  ]

  const nodes = voices.map(({ freq, gain }) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'  // warmer & softer than sine
    osc.frequency.value = freq
    const g = ctx.createGain()
    g.gain.value = gain
    osc.connect(g)
    g.connect(master)
    osc.start()
    return osc
  })

  // Breath-like slow swell (0.07 Hz — one breath every ~14 s)
  const lfo = ctx.createOscillator()
  lfo.frequency.value = 0.07
  const lfoGain = ctx.createGain()
  lfoGain.gain.value = 0.012
  lfo.connect(lfoGain)
  lfoGain.connect(master.gain)
  lfo.start()

  _ambientNode = nodes
  _ambientGain = master
  return master
}

// ─── Scroll tick — Play continuously while scrolling ─────────────
export function playScrollTick(intensity = 1) {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {})
      return
    }

    if (!_scrollTickBuffer) {
      loadScrollTickBuffer(ctx).catch(() => {})
      return
    }

    // Reset scroll inactivity timer
    if (_scrollTimeout) clearTimeout(_scrollTimeout)
    _scrollTimeout = setTimeout(() => {
      if (_scrollSource) {
        try {
          _scrollSource.stop()
          _scrollSource.disconnect()
        } catch (_) {}
        _scrollSource = null
      }
      _isScrollPlaying = false
    }, 280) // Stop playing 280ms after scrolling stops

    // If already playing, just let it loop continuously
    if (_isScrollPlaying) return
    _isScrollPlaying = true

    _scrollSource = ctx.createBufferSource()
    _scrollSource.buffer = _scrollTickBuffer
    _scrollSource.loop = true

    const gainNode = ctx.createGain()
    // Smooth transition gain
    gainNode.gain.setValueAtTime(0.4 * intensity, ctx.currentTime)

    _scrollSource.connect(gainNode)
    gainNode.connect(ctx.destination)
    _scrollSource.start(0)
  } catch (_) {}
}

// ─── UI hover — airy bell chime (fundamental + perfect 5th) ────
export function playUiChime(freq = 660, volume = 0.045) {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') return

    const t = ctx.currentTime

    // Fundamental
    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.setValueAtTime(freq, t)

    // Perfect 5th overtone — creates a pleasant bell quality
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(freq * 1.5, t)

    // High shimmer
    const osc3 = ctx.createOscillator()
    osc3.type = 'sine'
    osc3.frequency.setValueAtTime(freq * 4, t)

    const env1 = ctx.createGain()
    env1.gain.setValueAtTime(volume, t)
    env1.gain.exponentialRampToValueAtTime(0.0001, t + 0.35)

    const env2 = ctx.createGain()
    env2.gain.setValueAtTime(volume * 0.45, t)
    env2.gain.exponentialRampToValueAtTime(0.0001, t + 0.2)

    const env3 = ctx.createGain()
    env3.gain.setValueAtTime(volume * 0.15, t)
    env3.gain.exponentialRampToValueAtTime(0.0001, t + 0.1)

    osc1.connect(env1); env1.connect(ctx.destination)
    osc2.connect(env2); env2.connect(ctx.destination)
    osc3.connect(env3); env3.connect(ctx.destination)

    osc1.start(t); osc1.stop(t + 0.4)
    osc2.start(t); osc2.stop(t + 0.25)
    osc3.start(t); osc3.stop(t + 0.12)
  } catch (_) {}
}

// ─── Page-transition — smooth rising shimmer ────────────────────
export function playTransitionWhoosh() {
  try {
    const ctx = getCtx()
    if (ctx.state === 'suspended') return
    const t = ctx.currentTime

    // Rising sine sweep — elegant, not harsh
    const osc = ctx.createOscillator()
    osc.type = 'sine'
    osc.frequency.setValueAtTime(220, t)
    osc.frequency.exponentialRampToValueAtTime(660, t + 0.4)

    // Soft overtone for shimmer
    const osc2 = ctx.createOscillator()
    osc2.type = 'sine'
    osc2.frequency.setValueAtTime(440, t)
    osc2.frequency.exponentialRampToValueAtTime(1320, t + 0.35)

    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.linearRampToValueAtTime(0.05, t + 0.15)
    env.gain.exponentialRampToValueAtTime(0.0001, t + 0.5)

    const env2 = ctx.createGain()
    env2.gain.setValueAtTime(0.0001, t)
    env2.gain.linearRampToValueAtTime(0.02, t + 0.1)
    env2.gain.exponentialRampToValueAtTime(0.0001, t + 0.4)

    osc.connect(env);   env.connect(ctx.destination)
    osc2.connect(env2); env2.connect(ctx.destination)
    osc.start(t);  osc.stop(t + 0.55)
    osc2.start(t); osc2.stop(t + 0.45)
  } catch (_) {}
}

// ─── React component ────────────────────────────────────────────
export default function AudioManager() {
  const [muted, setMuted] = useState(false)
  const [ready, setReady] = useState(false)
  const [showHint, setShowHint] = useState(true)
  const mutedRef = useRef(false)

  useEffect(() => {
    // ── Start audio after first user gesture ──────────────────
    const unlock = async () => {
      setShowHint(false)
      if (_started) return
      _started = true

      try {
        const ctx = getCtx()
        if (ctx.state === 'suspended') await ctx.resume()
        buildAmbient(ctx)
        loadScrollTickBuffer(ctx).catch(() => {})
        setReady(true)
      } catch (e) {
        console.warn('[AudioManager] failed to start:', e)
      }
    }

    window.addEventListener('click',     unlock, { once: true })
    window.addEventListener('touchstart', unlock, { once: true })
    window.addEventListener('keydown',   unlock, { once: true })
    window.addEventListener('scroll',    unlock, { once: true })

    return () => {
      window.removeEventListener('click',     unlock)
      window.removeEventListener('touchstart', unlock)
      window.removeEventListener('keydown',   unlock)
      window.removeEventListener('scroll',    unlock)
    }
  }, [])

  // ── Attach micro-sounds to interactive elements site-wide ────
  useEffect(() => {
    if (!ready) return

    let isScrolling = false
    let scrollTimer = null

    const handleScroll = () => {
      isScrolling = true
      if (scrollTimer) clearTimeout(scrollTimer)
      scrollTimer = setTimeout(() => {
        isScrolling = false
      }, 150)
    }

    const onMouseEnter = (e) => {
      if (isScrolling) return // Suppress chime when scrolling past buttons

      const el = e.target
      if (
        el.tagName === 'BUTTON' ||
        el.tagName === 'A' ||
        el.getAttribute('role') === 'button' ||
        el.classList.contains('nav-link') ||
        el.classList.contains('btn') ||
        el.classList.contains('service-card') ||
        el.classList.contains('portfolio-card') ||
        el.classList.contains('capability-card') ||
        el.closest('nav')
      ) {
        if (!mutedRef.current) playUiChime(660, 0.025)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    document.addEventListener('mouseover', onMouseEnter)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      document.removeEventListener('mouseover', onMouseEnter)
      if (scrollTimer) clearTimeout(scrollTimer)
    }
  }, [ready])

  // ── Toggle mute ──────────────────────────────────────────────
  const toggleMute = () => {
    const next = !muted
    setMuted(next)
    mutedRef.current = next

    if (_ambientGain) {
      const ctx = getCtx()
      _ambientGain.gain.setTargetAtTime(
        next ? 0 : 0.08,
        ctx.currentTime,
        0.3
      )
    }
  }

  return null
}
