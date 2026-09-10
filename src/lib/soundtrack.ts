import type { SoundtrackTrackId } from '../types'

/**
 * Soundtrack audio controller for OH CROP!
 *
 * Supports multi-track soundtracks (menu, gameplay, victory, gameover) with automatic
 * fallback to the single-file /audio/theme.mp3 drop-in, or zero-audio graceful degradation
 * if no MP3 files are present.
 *
 * Enforces track exclusivity (no overlapping music tracks), handles smooth volume fading,
 * browser autoplay unlocking, and global mute coordination.
 */

const BASE_PATH = import.meta.env.BASE_URL.endsWith('/')
  ? import.meta.env.BASE_URL
  : `${import.meta.env.BASE_URL}/`

const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg'] as const

const TRACK_CONFIG: Record<SoundtrackTrackId, { loop: boolean; volume: number }> = {
  menu: { loop: true, volume: 0.35 },
  gameplay: { loop: true, volume: 0.35 },
  victory: { loop: false, volume: 0.4 },
  gameover: { loop: false, volume: 0.4 },
  theme: { loop: true, volume: 0.35 },
}

// Cache of resolved URL for each track ID
const resolvedUrlCache = new Map<SoundtrackTrackId, string | null>()
let availabilityCheckPending = false

// Active audio playback state
let currentTrackId: SoundtrackTrackId | null = null
let currentAudioUrl: string | null = null
let currentAudio: HTMLAudioElement | null = null
let isMuted = false
let isUnlocked = false
let fadeTimer: number | null = null

/**
 * Resolves the best available audio URL for a requested track ID.
 * Searches across .mp3, .wav, .ogg and falls back to theme if not found.
 */
async function resolveTrackUrl(requestedId: SoundtrackTrackId): Promise<string | null> {
  if (resolvedUrlCache.has(requestedId)) {
    return resolvedUrlCache.get(requestedId)!
  }

  // 1. Check requested track across supported extensions
  for (const ext of AUDIO_EXTENSIONS) {
    const url = `${BASE_PATH}audio/${requestedId}.${ext}`
    try {
      const res = await fetch(url, { method: 'HEAD' })
      if (res.ok) {
        resolvedUrlCache.set(requestedId, url)
        return url
      }
    } catch {}
  }

  // 2. If specific track not found, try fallback theme
  if (requestedId !== 'theme') {
    for (const ext of AUDIO_EXTENSIONS) {
      const url = `${BASE_PATH}audio/theme.${ext}`
      try {
        const res = await fetch(url, { method: 'HEAD' })
        if (res.ok) {
          resolvedUrlCache.set(requestedId, url)
          return url
        }
      } catch {}
    }
  }

  resolvedUrlCache.set(requestedId, null)
  return null
}

/**
 * Probes all potential soundtrack files in the background once on startup.
 */
export async function preloadSoundtrackAvailability(): Promise<void> {
  if (availabilityCheckPending) return
  availabilityCheckPending = true

  const trackIds: SoundtrackTrackId[] = ['menu', 'gameplay', 'victory', 'gameover', 'theme']
  await Promise.all(trackIds.map((id) => resolveTrackUrl(id)))
}

/**
 * Smoothly ramps volume to target level over durationMs.
 */
export function fadeSoundtrackVolume(
  targetVolume: number,
  durationMs: number = 300,
  onComplete?: () => void
) {
  if (!currentAudio) return
  rampVolume(currentAudio, targetVolume, durationMs, onComplete)
}

function rampVolume(
  audio: HTMLAudioElement,
  targetVolume: number,
  durationMs: number,
  onComplete?: () => void
) {
  if (fadeTimer) {
    window.clearInterval(fadeTimer)
    fadeTimer = null
  }

  const steps = 10
  const stepInterval = Math.max(10, durationMs / steps)
  const startVolume = audio.volume
  const delta = (targetVolume - startVolume) / steps
  let step = 0

  fadeTimer = window.setInterval(() => {
    step++
    const newVol = Math.max(0, Math.min(1, startVolume + delta * step))
    audio.volume = newVol

    if (step >= steps) {
      if (fadeTimer) {
        window.clearInterval(fadeTimer)
        fadeTimer = null
      }
      audio.volume = targetVolume
      onComplete?.()
    }
  }, stepInterval)
}

/**
 * Play a specific soundtrack track. Ensures single track exclusivity and handles fallbacks.
 */
export async function playSoundtrack(trackId: SoundtrackTrackId): Promise<void> {
  const resolvedUrl = await resolveTrackUrl(trackId)
  if (!resolvedUrl) {
    // Neither this track nor fallback exists; stop current audio cleanly
    stopSoundtrack()
    return
  }

  // If the resolved track is already playing (e.g. fallback theme or continuing menu music)
  if (currentAudioUrl === resolvedUrl && currentAudio && !currentAudio.paused) {
    return
  }

  // Stop previous track cleanly
  stopSoundtrack()

  const config = TRACK_CONFIG[trackId]
  const audio = new Audio(resolvedUrl)
  audio.loop = config.loop
  audio.volume = 0
  audio.muted = isMuted

  currentTrackId = trackId
  currentAudioUrl = resolvedUrl
  currentAudio = audio

  if (!isMuted) {
    const playPromise = audio.play()
    if (playPromise) {
      playPromise
        .then(() => {
          isUnlocked = true
          rampVolume(audio, config.volume, 200)
        })
        .catch(() => {
          // Autoplay blocked: wait for user interaction to unlock
          isUnlocked = false
        })
    }
  }
}

/**
 * Stops the active soundtrack immediately and cleans up listeners.
 */
export function stopSoundtrack(): void {
  if (fadeTimer) {
    window.clearInterval(fadeTimer)
    fadeTimer = null
  }

  if (currentAudio) {
    currentAudio.pause()
    currentAudio.currentTime = 0
    currentAudio.removeAttribute('src')
    currentAudio.load()
    currentAudio = null
  }
  currentAudioUrl = null
  currentTrackId = null
}

/**
 * Sets global mute state for soundtracks.
 */
export function setSoundtrackMuted(muted: boolean): void {
  isMuted = muted
  if (currentAudio) {
    currentAudio.muted = muted
    if (muted) {
      currentAudio.pause()
    } else {
      currentAudio.volume = currentTrackId ? TRACK_CONFIG[currentTrackId].volume : 0.35
      currentAudio.play().catch(() => {})
    }
  }
}

/**
 * Unlocks audio playback on user gesture (click/tap/keypress) if autoplay was blocked.
 */
export function unlockSoundtrack(): void {
  if (isUnlocked) return
  isUnlocked = true

  if (currentAudio && !isMuted && currentAudio.paused) {
    currentAudio.play().catch(() => {})
  }
}

/**
 * Returns current playing track ID or null.
 */
export function getCurrentTrackId(): SoundtrackTrackId | null {
  return currentTrackId
}
