/**
 * videoAudioManager
 * ─────────────────────────────────────────────────────────────
 * Centralized singleton audio manager for all video components.
 * Guarantees that only ONE video can have audio unmuted at any
 * given moment.
 *
 * • Default: all videos muted.
 * • When a video is unmuted: automatically mutes any previously
 *   unmuted video before activating the new audio stream.
 * • Direct DOM property synchronization ensures zero playback hitch
 *   or buffering interruption during audio switching.
 * • React state subscription provides instant visual UI updates.
 * ─────────────────────────────────────────────────────────────
 */

import { useSyncExternalStore, useEffect } from 'react'

let activeVideoId = null
const registeredVideos = new Map() // id -> HTMLVideoElement
const listeners = new Set()

function notify() {
  listeners.forEach((fn) => {
    try {
      fn(activeVideoId)
    } catch (e) {
      console.error('[videoAudioManager] listener error:', e)
    }
  })
}

export const videoAudioManager = {
  /**
   * Get the current active unmuted video ID (or null if all are muted).
   */
  getActiveId() {
    return activeVideoId
  },

  /**
   * Subscribe to active unmuted video changes.
   */
  subscribe(listener) {
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },

  /**
   * Register a video element with a unique ID.
   */
  register(id, element) {
    if (!id || !element) return
    registeredVideos.set(id, element)
    // Synchronize initial DOM muted attribute
    element.muted = id !== activeVideoId
  },

  /**
   * Unregister a video element when component unmounts.
   */
  unregister(id) {
    if (!id) return
    registeredVideos.delete(id)
    if (activeVideoId === id) {
      activeVideoId = null
      notify()
    }
  },

  /**
   * Set a specific video as the single unmuted video, or pass null to mute all.
   */
  setActive(id) {
    if (id === activeVideoId) return

    // 1. Mute all currently registered video elements directly
    registeredVideos.forEach((videoEl, registeredId) => {
      if (registeredId !== id && videoEl) {
        videoEl.muted = true
      }
    })

    // 2. Unmute target video element if specified
    if (id && registeredVideos.has(id)) {
      const targetVideo = registeredVideos.get(id)
      if (targetVideo) {
        targetVideo.muted = false
      }
    }

    // 3. Update state and notify all reactive subscribers
    activeVideoId = id || null
    notify()
  },

  /**
   * Toggle the mute/unmute state of a given video.
   */
  toggle(id) {
    if (!id) return
    if (activeVideoId === id) {
      // Already active -> mute it
      this.setActive(null)
    } else {
      // Mute previous active and unmute this one
      this.setActive(id)
    }
  },

  /**
   * Mute all videos.
   */
  muteAll() {
    this.setActive(null)
  },
}

/**
 * Custom hook to bind a video element to the centralized audio manager.
 * Returns { isMuted, toggleMute }
 */
export function useVideoAudio(id, videoRef) {
  const activeId = useSyncExternalStore(
    videoAudioManager.subscribe,
    videoAudioManager.getActiveId,
    () => null
  )

  useEffect(() => {
    const video = videoRef?.current
    if (!video || !id) return

    videoAudioManager.register(id, video)
    return () => {
      videoAudioManager.unregister(id)
    }
  }, [id, videoRef])

  const isMuted = activeId !== id

  const toggleMute = () => {
    videoAudioManager.toggle(id)
  }

  return {
    isMuted,
    toggleMute,
  }
}
