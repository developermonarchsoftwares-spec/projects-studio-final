import { useEffect, useState } from 'react'
import { initBackgroundMusic, isMusicMuted, subscribeMusicState, toggleMusicMute } from '../lib/backgroundMusic.js'

export default function MusicToggle() {
  const [muted, setMuted] = useState(isMusicMuted)

  useEffect(() => {
    initBackgroundMusic()
    return subscribeMusicState(setMuted)
  }, [])

  return (
    <button
      type="button"
      className="nav__music"
      aria-label={muted ? 'Unmute background music' : 'Mute background music'}
      aria-pressed={!muted}
      onClick={toggleMusicMute}
    >
      {muted ? (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
          <path d="M16.5 9.5 21 14M21 9.5l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M4 9v6h4l5 5V4L8 9H4Z" fill="currentColor" />
          <path d="M16.2 8.2a5 5 0 0 1 0 7.6M18.8 5.6a9 9 0 0 1 0 12.8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
