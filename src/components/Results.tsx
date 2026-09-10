import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'
import type { RoundResult } from '../types'

export function Results({
  playerName,
  results,
  totalXp,
  rank,
  onPlayAgain,
  onLeaderboard,
  onJoin,
}: {
  playerName: string
  results: RoundResult[]
  totalXp: number
  rank: number
  onPlayAgain: () => void
  onLeaderboard: () => void
  onJoin: () => void
}) {
  const correctCount = results.filter((r) => r.correct).length
  const accuracy = results.length ? Math.round((correctCount / results.length) * 100) : 0
  const perfectCrops = results.filter((r) => r.perfectCrop).length

  let bestStreak = 0
  let running = 0
  for (const r of results) {
    running = r.correct ? running + 1 : 0
    bestStreak = Math.max(bestStreak, running)
  }

  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12">
      <CropFrame colorClass="text-[var(--color-xp)]">
        <div className="w-full max-w-sm bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] px-6 py-8 text-center">
          <p className="font-display text-[11px] text-[var(--color-crime)]">DESIGN SURVIVOR</p>
          <h2 className="font-display text-lg sm:text-2xl mt-3 text-[var(--color-paper)]">{playerName.toUpperCase()}</h2>
          <p className="font-display text-2xl sm:text-4xl mt-4 text-[var(--color-xp)]">{totalXp.toLocaleString()} XP</p>

          <div className="grid grid-cols-3 gap-2 mt-8 font-mono-ui text-xs">
            <div className="border-2 border-[var(--color-line)] py-3">
              <p className="text-[var(--color-paper)]/50 text-[10px]">ACCURACY</p>
              <p className="text-[var(--color-grass)] text-base mt-1">{accuracy}%</p>
            </div>
            <div className="border-2 border-[var(--color-line)] py-3">
              <p className="text-[var(--color-paper)]/50 text-[10px]">PERFECT</p>
              <p className="text-[var(--color-xp)] text-base mt-1">{perfectCrops}</p>
            </div>
            <div className="border-2 border-[var(--color-line)] py-3">
              <p className="text-[var(--color-paper)]/50 text-[10px]">STREAK</p>
              <p className="text-[var(--color-crime)] text-base mt-1">{bestStreak}</p>
            </div>
          </div>

          {rank > 0 && (
            <p className="font-mono-ui text-sm mt-6 text-[var(--color-paper)]/80">
              YOU PLACED <span className="text-[var(--color-xp)]">#{rank}</span>
            </p>
          )}

          <div className="mt-8 flex flex-col gap-3">
            <PixelButton onClick={onPlayAgain} fullWidth>↻ Play Again</PixelButton>
            <PixelButton onClick={onLeaderboard} variant="secondary" fullWidth>★ Leaderboard</PixelButton>
            <PixelButton onClick={onJoin} variant="danger" fullWidth>✦ Join Oh Crop!</PixelButton>
          </div>
        </div>
      </CropFrame>
    </div>
  )
}
