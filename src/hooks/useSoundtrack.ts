import { useEffect } from 'react'
import type { RoundResult, Screen, SoundtrackTrackId } from '../types'
import {
  playSoundtrack,
  setSoundtrackMuted,
  preloadSoundtrackAvailability,
  unlockSoundtrack,
} from '../lib/soundtrack'

/**
 * Hook to coordinate soundtrack playback based on the active screen and game results.
 */
export function useSoundtrack(screen: Screen, muted: boolean, results: RoundResult[] = []) {
  // Preload file presence on initial mount
  useEffect(() => {
    preloadSoundtrackAvailability()
  }, [])

  // Sync mute state
  useEffect(() => {
    setSoundtrackMuted(muted)
  }, [muted])

  // Attach global unlock listeners for browser autoplay policies
  useEffect(() => {
    function handleGesture() {
      unlockSoundtrack()
    }
    window.addEventListener('pointerdown', handleGesture, { passive: true })
    window.addEventListener('keydown', handleGesture, { passive: true })
    return () => {
      window.removeEventListener('pointerdown', handleGesture)
      window.removeEventListener('keydown', handleGesture)
    }
  }, [])

  // Switch soundtrack based on screen and results
  useEffect(() => {
    let targetTrack: SoundtrackTrackId

    switch (screen) {
      case 'game':
        targetTrack = 'gameplay'
        break

      case 'results': {
        const correctCount = results.filter((r) => r.correct).length
        const accuracy = results.length ? Math.round((correctCount / results.length) * 100) : 0
        const isVictory = accuracy >= 50 || results.some((r) => r.perfectCrop)
        targetTrack = isVictory ? 'victory' : 'gameover'
        break
      }

      case 'attract':
      case 'landing':
      case 'name':
      case 'pregame':
      case 'howto':
      case 'leaderboard':
      case 'join':
      default:
        targetTrack = 'menu'
        break
    }

    playSoundtrack(targetTrack)
  }, [screen, results])
}
