import { useEffect, useState } from 'react'
import { BRANDS } from '../data/brands'
import { LogoReveal } from './LogoReveal'
import type { LeaderboardEntry } from '../types'

const DEMO_REVEAL_MS = 4500

export function AttractMode({
  onDismiss,
  leaderboard,
}: {
  onDismiss: () => void
  leaderboard: LeaderboardEntry[]
}) {
  const [brandIdx, setBrandIdx] = useState(0)
  const [cycleKey, setCycleKey] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setBrandIdx((i) => (i + 1) % BRANDS.length)
      setCycleKey((k) => k + 1)
    }, DEMO_REVEAL_MS + 800)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const handler = () => onDismiss()
    window.addEventListener('pointerdown', handler)
    window.addEventListener('keydown', handler)
    return () => {
      window.removeEventListener('pointerdown', handler)
      window.removeEventListener('keydown', handler)
    }
  }, [onDismiss])

  const top3 = leaderboard.slice(0, 3)

  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12 cursor-pointer">
      <h1 className="font-display text-3xl sm:text-5xl text-[var(--color-paper)] text-center">
        OH CROP<span className="text-[var(--color-crime)]">!</span>
      </h1>
      <p className="font-display text-[10px] sm:text-sm mt-3 text-[var(--color-xp)] tracking-widest">
        CAN YOU GET #1?
      </p>

      <div className="relative w-full max-w-xs aspect-[4/3] border-2 border-[var(--color-line)] mt-8">
        <LogoReveal
          key={cycleKey}
          brand={BRANDS[brandIdx]}
          revealMs={DEMO_REVEAL_MS}
          running={true}
          revealed={false}
        />
      </div>

      {top3.length > 0 && (
        <div className="mt-8 w-full max-w-xs font-mono-ui text-xs flex flex-col gap-1">
          {top3.map((e, i) => (
            <div key={e.id} className="flex justify-between border-b border-[var(--color-line)] pb-1">
              <span className="text-[var(--color-paper)]/70">{i + 1}. {e.name}</span>
              <span className="text-[var(--color-xp)]">{e.xp.toLocaleString()} XP</span>
            </div>
          ))}
        </div>
      )}

      <p className="font-display text-xs mt-10 text-[var(--color-paper)] animate-pulse">
        ▶ PRESS START
      </p>
    </div>
  )
}
