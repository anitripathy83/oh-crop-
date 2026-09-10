import { useEffect, useRef } from 'react'

/**
 * Plays /audio/theme.mp3 on loop if that file exists (drop the final soundtrack there —
 * see handover section 25-26). If it's missing, this silently does nothing, so the game
 * never ships with a broken <audio> tag or console noise.
 */
export function useBackgroundMusic(enabled: boolean, muted: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const checkedRef = useRef(false)
  const availableRef = useRef(false)

  useEffect(() => {
    if (checkedRef.current) return
    checkedRef.current = true
    fetch(`${import.meta.env.BASE_URL}audio/theme.mp3`, { method: 'HEAD' })
      .then((res) => {
        if (res.ok) {
          availableRef.current = true
          const audio = new Audio(`${import.meta.env.BASE_URL}audio/theme.mp3`)
          audio.loop = true
          audio.volume = 0.35
          audioRef.current = audio
        }
      })
      .catch(() => {
        /* no track dropped in yet — that's fine */
      })
  }, [])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio || !availableRef.current) return
    audio.muted = muted
    if (enabled && !muted) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [enabled, muted])
}
