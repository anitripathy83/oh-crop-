import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'
import type { LeaderboardEntry } from '../types'

export function Leaderboard({
  entries,
  highlightId,
  onBack,
}: {
  entries: LeaderboardEntry[]
  highlightId?: string | null
  onBack: () => void
}) {
  const top = entries.slice(0, 10)
  const highlighted = highlightId ? entries.find((e) => e.id === highlightId) : null
  const highlightedRank = highlighted ? entries.findIndex((e) => e.id === highlightId) + 1 : null
  const highlightedInTop = highlightedRank !== null && highlightedRank <= 10

  const medal = (rank: number) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : String(rank))

  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12">
      <CropFrame colorClass="text-[var(--color-xp)]">
        <div className="w-full max-w-md bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] px-5 py-8">
          <h2 className="font-display text-lg text-center text-[var(--color-paper)] mb-6">TOP CROPPERS</h2>

          {top.length === 0 ? (
            <p className="font-mono-ui text-sm text-center text-[var(--color-paper)]/60 py-8">
              No design survivors yet. Be the first.
            </p>
          ) : (
            <div className="flex flex-col gap-2 font-mono-ui text-xs sm:text-sm">
              {top.map((e, i) => {
                const rank = i + 1
                const isMe = e.id === highlightId
                return (
                  <div
                    key={e.id}
                    className={`flex items-center justify-between px-3 py-2 border-2 ${
                      isMe ? 'border-[var(--color-xp)] bg-[var(--color-xp)]/10' : 'border-[var(--color-line)]'
                    }`}
                  >
                    <span className="w-8 text-[var(--color-paper)]/70">{medal(rank)}</span>
                    <span className="flex-1 truncate text-[var(--color-paper)]">{e.name}</span>
                    <span className="text-[var(--color-xp)] w-20 text-right">{e.xp.toLocaleString()} XP</span>
                    <span className="text-[var(--color-grass)] w-14 text-right">{e.accuracy}%</span>
                  </div>
                )
              })}
            </div>
          )}

          {highlighted && !highlightedInTop && (
            <div className="mt-4 flex items-center justify-between px-3 py-2 border-2 border-[var(--color-xp)] bg-[var(--color-xp)]/10 font-mono-ui text-xs sm:text-sm">
              <span className="text-[var(--color-paper)]/70">YOUR POSITION: #{highlightedRank}</span>
              <span className="text-[var(--color-paper)]">{highlighted.name}</span>
              <span className="text-[var(--color-xp)]">{highlighted.xp.toLocaleString()} XP</span>
            </div>
          )}

          <div className="mt-8">
            <PixelButton onClick={onBack} fullWidth>Back</PixelButton>
          </div>
        </div>
      </CropFrame>
    </div>
  )
}
