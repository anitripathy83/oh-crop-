import { useSoundtrack } from './useSoundtrack'

/**
 * Legacy compatibility hook for background music.
 * Delegates to the unified useSoundtrack hook.
 */
export function useBackgroundMusic(enabled: boolean, muted: boolean) {
  useSoundtrack(enabled ? 'landing' : 'game', muted)
}
