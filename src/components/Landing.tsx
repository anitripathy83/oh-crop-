import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'

export function Landing({
  onPlay,
  onLeaderboard,
  onHowTo,
}: {
  onPlay: () => void
  onLeaderboard: () => void
  onHowTo: () => void
}) {
  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* ruler tick strip */}
      <div className="absolute top-0 left-0 right-0 h-6 flex items-end opacity-40">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="flex-1 border-l border-[var(--color-line)]"
            style={{ height: i % 5 === 0 ? '16px' : '8px' }}
          />
        ))}
      </div>

      <div className="animate-float mb-6">
        <CropFrame colorClass="text-[var(--color-crime)]">
          <div className="px-8 py-4 bg-[var(--color-ink-2)] border-2 border-[var(--color-crime)]">
            <p className="font-mono-ui text-[10px] tracking-[0.3em] text-[var(--color-crime)]">
              THE GRAPHIC DESIGN CLUB
            </p>
          </div>
        </CropFrame>
      </div>

      <h1 className="font-display text-[2.1rem] sm:text-6xl text-center leading-[1.3] text-[var(--color-paper)]">
        OH CROP<span className="text-[var(--color-crime)]">!</span>
      </h1>
      <p className="font-display text-xs sm:text-lg mt-4 text-[var(--color-xp)] tracking-widest">
        DESIGN CRIME
      </p>

      <p className="font-mono-ui text-sm sm:text-base text-center max-w-sm mt-6 text-[var(--color-paper)]/80">
        Can you identify the design before it gets revealed?
      </p>

      <div className="mt-10 flex flex-col gap-4 w-full max-w-xs">
        <PixelButton onClick={onPlay} variant="primary" fullWidth>
          ▶ Play Design Crime
        </PixelButton>
        <PixelButton onClick={onLeaderboard} variant="secondary" fullWidth>
          ★ Leaderboard
        </PixelButton>
        <PixelButton onClick={onHowTo} variant="ghost" fullWidth>
          ? How To Play
        </PixelButton>
      </div>

      <p className="font-mono-ui text-[10px] mt-12 text-[var(--color-paper)]/40 tracking-wide">
        BITS PILANI DUBAI CAMPUS
      </p>
    </div>
  )
}
