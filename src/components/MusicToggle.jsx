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
          <path d="M4 9.25v5.5h4.15L13.5 19V5L8.15 9.25H4Z" fill="currentColor" />
          <path d="M16.5 9.5 21 14M21 9.5l-4.5 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
          <path d="M4 9.25v5.5h4.15L13.5 19V5L8.15 9.25H4Z" fill="currentColor" />
          <path d="M16.25 8.35a5.15 5.15 0 0 1 0 7.3M18.9 5.7a8.9 8.9 0 0 1 0 12.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )}
    </button>
  )
}
