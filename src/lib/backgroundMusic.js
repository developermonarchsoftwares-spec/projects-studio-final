/**
 * backgroundMusic
 * ─────────────────────────────────────────────────────────────
 * Single persistent <audio> instance for site-wide background
 * music. Lives at module scope (outside React's render tree) so
 * it survives route changes untouched — no remounting, and only
 * ever one Audio() instance.
 *
 * "Mute" fully pauses playback (no silent background audio);
 * "Unmute" resumes from the exact position it was paused at,
 * since audio.pause() never resets currentTime.
 *
 * Browsers block autoplay-with-sound until a user gesture, so we
 * mirror the same "unlock on first interaction" pattern already
 * used by AudioManager for the ambient soundscape.
 * ─────────────────────────────────────────────────────────────
 */

const STORAGE_KEY = 'gs_music_muted'

let _audio = null
let _muted = typeof window !== 'undefined' && localStorage.getItem(STORAGE_KEY) === 'true'
let _unlocked = false
const _listeners = new Set()

function notify() {
  _listeners.forEach((fn) => fn(_muted))
}

function getAudio() {
  if (!_audio && typeof window !== 'undefined') {
    _audio = new Audio('/assets/background-music.mp3')
    _audio.loop = true
    _audio.preload = 'auto'
    _audio.volume = 0.35
  }
  return _audio
}

/** Attempt to start/resume playback; safe to call repeatedly. */
function tryPlay() {
  if (_muted) return
  const audio = getAudio()
  if (!audio) return
  audio.play().then(() => {
    _unlocked = true
  }).catch(() => {
    // Still blocked — will retry on the next user gesture.
  })
}

/** Call once on app start. Begins playback immediately if allowed
 *  (and not muted), otherwise waits for the first click/touch/keydown. */
export function initBackgroundMusic() {
  if (typeof window === 'undefined') return
  getAudio()

  if (_muted) return // stays paused until the user unmutes

  tryPlay()
  if (_unlocked) return

  const onGesture = () => {
    if (_unlocked || _muted) return
    tryPlay()
    if (_unlocked) {
      window.removeEventListener('click', onGesture)
      window.removeEventListener('touchstart', onGesture)
      window.removeEventListener('keydown', onGesture)
    }
  }

  window.addEventListener('click', onGesture)
  window.addEventListener('touchstart', onGesture)
  window.addEventListener('keydown', onGesture)
}

export function isMusicMuted() {
  return _muted
}

export function subscribeMusicState(fn) {
  _listeners.add(fn)
  return () => _listeners.delete(fn)
}

/** Mute = fully pause (no silent background playback).
 *  Unmute = resume from the exact paused position, never restart. */
export function toggleMusicMute() {
  _muted = !_muted
  localStorage.setItem(STORAGE_KEY, String(_muted))

  const audio = getAudio()
  if (_muted) {
    audio.pause()
  } else {
    _unlocked = true
    audio.play().catch(() => {
      // Blocked (rare, since this runs from a real click) — will
      // retry on the next click/touch/keydown just in case.
      _unlocked = false
    })
  }

  notify()
}
