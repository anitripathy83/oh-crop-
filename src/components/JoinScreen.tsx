import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'

export function JoinScreen({ onBack, joinUrl }: { onBack: () => void; joinUrl?: string }) {
  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12 text-center">
      <CropFrame colorClass="text-[var(--color-crime)]">
        <div className="w-full max-w-sm bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] px-6 py-10">
          <p className="font-display text-sm sm:text-lg text-[var(--color-paper)]">THINK YOU CAN DO BETTER?</p>
          <p className="font-display text-lg sm:text-2xl mt-4 text-[var(--color-crime)]">COME BUILD WITH US.</p>

          <div className="mt-8 border-2 border-dashed border-[var(--color-line)] py-8 flex flex-col items-center gap-2">
            <div className="w-28 h-28 bg-[var(--color-paper)] flex items-center justify-center">
              <span className="font-mono-ui text-[10px] text-[var(--color-ink)]">QR CODE</span>
            </div>
            <p className="font-mono-ui text-[10px] text-[var(--color-paper)]/50">SCAN TO JOIN</p>
          </div>

          <p className="font-display text-xs mt-8 text-[var(--color-xp)]">OH CROP!</p>
          <p className="font-mono-ui text-xs mt-1 text-[var(--color-paper)]/70">
            The Graphic Design Club — BITS Pilani Dubai Campus
          </p>

          <div className="mt-8 flex flex-col gap-3">
            {joinUrl && (
              <a href={joinUrl} target="_blank" rel="noreferrer">
                <PixelButton variant="danger" fullWidth>Join Oh Crop!</PixelButton>
              </a>
            )}
            <PixelButton onClick={onBack} variant="ghost" fullWidth>Back</PixelButton>
          </div>
        </div>
      </CropFrame>
    </div>
  )
}
