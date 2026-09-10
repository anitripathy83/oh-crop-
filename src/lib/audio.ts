/**
 * Tiny Web Audio SFX engine. Ships with synthesized 8-bit-style blips so the game
 * has real audio feedback out of the box with zero binary assets to license.
 *
 * Drop a final track in /public/audio/theme.mp3 and it will be picked up automatically
 * by useBackgroundMusic() — see handover section 25-26 for the audio brief.
 */

type SfxName =
  | 'start'
  | 'tick'
  | 'correct'
  | 'perfect'
  | 'wrong'
  | 'crime'
  | 'xp'
  | 'streak'
  | 'gameover'
  | 'select'

let ctx: AudioContext | null = null

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return null
    ctx = new Ctx()
  }
  return ctx
}

function tone(freq: number, startOffset: number, duration: number, type: OscillatorType, gainPeak: number, out: AudioContext) {
  const osc = out.createOscillator()
  const gain = out.createGain()
  osc.type = type
  osc.frequency.setValueAtTime(freq, out.currentTime + startOffset)
  gain.gain.setValueAtTime(0.0001, out.currentTime + startOffset)
  gain.gain.exponentialRampToValueAtTime(gainPeak, out.currentTime + startOffset + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.0001, out.currentTime + startOffset + duration)
  osc.connect(gain)
  gain.connect(out.destination)
  osc.start(out.currentTime + startOffset)
  osc.stop(out.currentTime + startOffset + duration + 0.02)
}

const patterns: Record<SfxName, (out: AudioContext) => void> = {
  start: (out) => {
    tone(392, 0, 0.09, 'square', 0.15, out)
    tone(523, 0.09, 0.09, 'square', 0.15, out)
    tone(659, 0.18, 0.16, 'square', 0.15, out)
  },
  tick: (out) => tone(880, 0, 0.045, 'square', 0.06, out),
  select: (out) => tone(660, 0, 0.05, 'square', 0.08, out),
  correct: (out) => {
    tone(659, 0, 0.08, 'square', 0.15, out)
    tone(880, 0.08, 0.12, 'square', 0.15, out)
  },
  perfect: (out) => {
    tone(659, 0, 0.07, 'square', 0.16, out)
    tone(880, 0.07, 0.07, 'square', 0.16, out)
    tone(1046, 0.14, 0.07, 'square', 0.16, out)
    tone(1318, 0.21, 0.18, 'square', 0.18, out)
  },
  wrong: (out) => {
    tone(220, 0, 0.14, 'sawtooth', 0.14, out)
    tone(160, 0.1, 0.22, 'sawtooth', 0.14, out)
  },
  crime: (out) => {
    tone(196, 0, 0.12, 'sawtooth', 0.16, out)
    tone(147, 0.12, 0.12, 'sawtooth', 0.16, out)
    tone(110, 0.24, 0.24, 'sawtooth', 0.16, out)
  },
  xp: (out) => tone(1046, 0, 0.06, 'square', 0.1, out),
  streak: (out) => {
    tone(784, 0, 0.06, 'square', 0.12, out)
    tone(988, 0.06, 0.1, 'square', 0.12, out)
  },
  gameover: (out) => {
    tone(523, 0, 0.12, 'triangle', 0.16, out)
    tone(440, 0.12, 0.12, 'triangle', 0.16, out)
    tone(349, 0.24, 0.28, 'triangle', 0.16, out)
  },
}

let muted = false

export function setMuted(next: boolean) {
  muted = next
}

export function isMuted() {
  return muted
}

export function playSfx(name: SfxName) {
  if (muted) return
  const out = getCtx()
  if (!out) return
  if (out.state === 'suspended') out.resume()
  patterns[name]?.(out)
}

export function unlockAudio() {
  const out = getCtx()
  if (out?.state === 'suspended') out.resume()
}
