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

const TRACK_FILES: Record<SoundtrackTrackId, string> = {
  menu: `${BASE_PATH}audio/menu.mp3`,
  gameplay: `${BASE_PATH}audio/gameplay.mp3`,
  victory: `${BASE_PATH}audio/victory.mp3`,
  gameover: `${BASE_PATH}audio/gameover.mp3`,
  theme: `${BASE_PATH}audio/theme.mp3`,
}

const TRACK_CONFIG: Record<SoundtrackTrackId, { loop: boolean; volume: number }> = {
  menu: { loop: true, volume: 0.35 },
  gameplay: { loop: true, volume: 0.35 },
  victory: { loop: false, volume: 0.4 },
  gameover: { loop: false, volume: 0.4 },
  theme: { loop: true, volume: 0.35 },
}

// Cache of probed availability for each track
const availabilityCache = new Map<SoundtrackTrackId, boolean>()
let availabilityCheckPending = false

// Active audio playback state
let currentTrackId: SoundtrackTrackId | null = null
let currentAudio: HTMLAudioElement | null = null
let isMuted = false
let isUnlocked = false
let fadeTimer: number | null = null

/**
 * Checks if a specific soundtrack file exists via HEAD request.
 */
async function checkAvailability(trackId: SoundtrackTrackId): Promise<boolean> {
  if (availabilityCache.has(trackId)) {
    return availabilityCache.get(trackId)!
  }

  const url = TRACK_FILES[trackId]
  try {
    const res = await fetch(url, { method: 'HEAD' })
    const ok = res.ok
    availabilityCache.set(trackId, ok)
    return ok
  } catch {
    availabilityCache.set(trackId, false)
    return false
  }
}

/**
 * Probes all potential soundtrack files in the background once on startup.
 */
export async function preloadSoundtrackAvailability(): Promise<void> {
  if (availabilityCheckPending) return
  availabilityCheckPending = true

  const trackIds: SoundtrackTrackId[] = ['menu', 'gameplay', 'victory', 'gameover', 'theme']
  await Promise.all(trackIds.map((id) => checkAvailability(id)))
}

/**
 * Resolves the best available audio URL for a requested track ID.
 * Falls back to theme.mp3 if the specific track isn't present.
 */
async function resolveTrack(requestedId: SoundtrackTrackId): Promise<SoundtrackTrackId | null> {
  // Check if requested track is available
  const requestedAvailable = await checkAvailability(requestedId)
  if (requestedAvailable) return requestedId

  // If specific track not found, try falling back to generic theme
  if (requestedId !== 'theme') {
    const themeAvailable = await checkAvailability('theme')
    if (themeAvailable) return 'theme'
  }

  return null
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
  // If already playing this track, don't restart it
  if (currentTrackId === trackId && currentAudio && !currentAudio.paused) {
    return
  }

  const resolvedTrackId = await resolveTrack(trackId)
  if (!resolvedTrackId) {
    // Neither this track nor theme.mp3 exists; stop current audio cleanly
    stopSoundtrack()
    return
  }

  // If the resolved track is already playing (e.g. fallback theme.mp3 is continuing across screens)
  if (currentTrackId === resolvedTrackId && currentAudio && !currentAudio.paused) {
    return
  }

  // Stop previous track cleanly
  stopSoundtrack()

  const config = TRACK_CONFIG[resolvedTrackId]
  const audio = new Audio(TRACK_FILES[resolvedTrackId])
  audio.loop = config.loop
  audio.volume = 0
  audio.muted = isMuted

  currentTrackId = resolvedTrackId
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
