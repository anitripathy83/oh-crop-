export function GameHUD({
  playerName,
  round,
  totalRounds,
  xp,
  streak,
  timeFraction,
  difficultyLabel,
}: {
  playerName: string
  round: number
  totalRounds: number
  xp: number
  streak: number
  timeFraction: number // 1 -> 0 as time runs out
  difficultyLabel: string
}) {
  return (
    <div className="w-full px-4 sm:px-6 pt-4 pb-2 font-mono-ui">
      <div className="flex items-center justify-between text-[10px] sm:text-xs">
        <span className="text-[var(--color-paper)]">
          <span className="text-[var(--color-paper)]/50">PLAYER </span>
          <span className="text-[var(--color-xp)]">{playerName}</span>
        </span>
        <span className="text-[var(--color-paper)]/70">
          ROUND {String(round).padStart(2, '0')}/{String(totalRounds).padStart(2, '0')} · {difficultyLabel}
        </span>
        <span className="text-[var(--color-xp)]">XP {xp.toLocaleString()}</span>
      </div>

      <div className="mt-3 h-3 w-full bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] overflow-hidden">
        <div
          className="h-full transition-[width] duration-100 ease-linear"
          style={{
            width: `${Math.max(0, timeFraction) * 100}%`,
            background:
              timeFraction > 0.5 ? 'var(--color-grass)' : timeFraction > 0.2 ? 'var(--color-xp)' : 'var(--color-crime)',
          }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[10px] sm:text-xs">
        <span className="text-[var(--color-crime)]">
          {streak > 0 ? `STREAK ×${streak}` : ''}
        </span>
        <div className="flex gap-1">
          {Array.from({ length: totalRounds }).map((_, i) => (
            <span
              key={i}
              className="block w-1.5 h-1.5"
              style={{ background: i < round - 1 ? 'var(--color-xp)' : i === round - 1 ? 'var(--color-crime)' : 'var(--color-line)' }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
