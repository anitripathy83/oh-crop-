import { useEffect, useRef, useState } from 'react'
import type { Brand } from '../types'
import { BrandMark } from './BrandMark'

interface Keyframe {
  t: number // 0..1
  blur: number
  crop: number // % inset on each side
  scale: number
  rotate: number
  skew: number
  opacity: number
}

const KEYFRAMES: Keyframe[] = [
  { t: 0.0, blur: 18, crop: 30, scale: 1.3, rotate: 7, skew: 10, opacity: 0.4 },
  { t: 0.3, blur: 12, crop: 20, scale: 1.2, rotate: 5, skew: 7, opacity: 0.65 },
  { t: 0.6, blur: 5, crop: 10, scale: 1.08, rotate: 2, skew: 3, opacity: 0.85 },
  { t: 1.0, blur: 0, crop: 0, scale: 1, rotate: 0, skew: 0, opacity: 1 },
]

function lerp(a: number, b: number, f: number) {
  return a + (b - a) * f
}

function sampleAt(progress: number): Keyframe {
  const p = Math.min(1, Math.max(0, progress))
  for (let i = 0; i < KEYFRAMES.length - 1; i++) {
    const a = KEYFRAMES[i]
    const b = KEYFRAMES[i + 1]
    if (p >= a.t && p <= b.t) {
      const f = (p - a.t) / (b.t - a.t || 1)
      return {
        t: p,
        blur: lerp(a.blur, b.blur, f),
        crop: lerp(a.crop, b.crop, f),
        scale: lerp(a.scale, b.scale, f),
        rotate: lerp(a.rotate, b.rotate, f),
        skew: lerp(a.skew, b.skew, f),
        opacity: lerp(a.opacity, b.opacity, f),
      }
    }
  }
  return KEYFRAMES[KEYFRAMES.length - 1]
}

interface LogoRevealProps {
  brand: Brand
  revealMs: number
  running: boolean
  revealed: boolean // force full clarity (round resolved)
  onProgress?: (progress: number) => void
  reducedMotion?: boolean
}

export function LogoReveal({ brand, revealMs, running, revealed, onProgress, reducedMotion = false }: LogoRevealProps) {
  const [progress, setProgress] = useState(0)
  const startRef = useRef<number | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    setProgress(0)
    startRef.current = null
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.id])

  useEffect(() => {
    if (!running) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      return
    }
    const step = (now: number) => {
      if (startRef.current === null) startRef.current = now - progress * revealMs
      const elapsed = now - startRef.current
      const p = Math.min(1, elapsed / revealMs)
      setProgress(p)
      onProgress?.(p)
      if (p < 1) {
        rafRef.current = requestAnimationFrame(step)
      }
    }
    rafRef.current = requestAnimationFrame(step)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running, revealMs, brand.id])

  const kf = revealed ? KEYFRAMES[3] : sampleAt(progress)
  const noiseVisible = !revealed && progress < 0.4

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{ background: brand.bg }}
    >
      <div
        className="absolute inset-0 transition-none"
        style={{
          filter: reducedMotion ? 'none' : `blur(${kf.blur}px)`,
          transform: reducedMotion
            ? 'none'
            : `scale(${kf.scale}) rotate(${kf.rotate}deg) skewX(${kf.skew}deg)`,
          clipPath: reducedMotion
            ? 'none'
            : `inset(${kf.crop}% ${kf.crop * 0.6}% ${kf.crop}% ${kf.crop * 0.6}%)`,
          opacity: reducedMotion ? 1 : kf.opacity,
        }}
      >
        <BrandMark brand={brand} />
      </div>
      {noiseVisible && !reducedMotion && (
        <div
          className="absolute inset-0 animate-noise pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage:
              'repeating-conic-gradient(#000 0% 25%, #fff 0% 50%)',
            backgroundSize: '3px 3px',
            opacity: 0.12,
          }}
        />
      )}
    </div>
  )
}
