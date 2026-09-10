import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'

export function PreGame({
  name,
  rounds,
  onStart,
}: {
  name: string
  rounds: number
  onStart: () => void
}) {
  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12">
      <CropFrame colorClass="text-[var(--color-grass)]">
        <div className="w-full max-w-sm bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] px-6 py-10 flex flex-col items-center text-center">
          <h2 className="font-display text-base sm:text-xl leading-relaxed text-[var(--color-paper)]">
            READY, <span className="text-[var(--color-xp)]">{name.toUpperCase()}</span>?
          </h2>
          <p className="font-display text-[11px] mt-4 text-[var(--color-crime)]">
            {rounds} DESIGN CRIMES AWAIT
          </p>
          <p className="font-mono-ui text-sm mt-6 text-[var(--color-paper)]/80">
            Identify the logo before it reveals itself.
          </p>

          <div className="grid grid-cols-1 gap-2 w-full mt-8 font-mono-ui text-xs">
            <div className="border-2 border-[var(--color-line)] px-4 py-3 flex items-center justify-between">
              <span className="text-[var(--color-paper)]/70">ROUNDS</span>
              <span className="text-[var(--color-xp)]">{rounds}</span>
            </div>
            <div className="border-2 border-[var(--color-line)] px-4 py-3 flex items-center justify-between">
              <span className="text-[var(--color-paper)]/70">FAST ANSWERS</span>
              <span className="text-[var(--color-grass)]">MORE XP</span>
            </div>
            <div className="border-2 border-[var(--color-line)] px-4 py-3 flex items-center justify-between">
              <span className="text-[var(--color-paper)]/70">GOAL</span>
              <span className="text-[var(--color-crime)]">DON'T COMMIT A CRIME</span>
            </div>
          </div>

          <div className="mt-10 w-full">
            <PixelButton onClick={onStart} fullWidth>
              ▶ Start
            </PixelButton>
          </div>
        </div>
      </CropFrame>
    </div>
  )
}
