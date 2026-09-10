import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'

export function HowToPlay({ onBack }: { onBack: () => void }) {
  const steps = [
    { title: '1. A LOGO APPEARS', body: 'Heavily distorted, cropped, and blurred. Almost unrecognizable.' },
    { title: '2. IT SLOWLY REVEALS', body: 'Over ~8-10 seconds the logo sharpens, uncrops, and settles into place.' },
    { title: '3. PICK THE BRAND', body: 'Four options appear. Tap the right one before it fully reveals.' },
    { title: '4. EARLIER = MORE XP', body: 'Answer fast for a big time bonus. Chain correct answers for a streak bonus.' },
    { title: '5. AVOID DESIGN CRIMES', body: "Wrong answers (or running out of time) score 0 XP and break your streak." },
  ]
  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12">
      <CropFrame colorClass="text-[var(--color-xp)]">
        <div className="w-full max-w-md bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] px-6 py-8">
          <h2 className="font-display text-lg text-center text-[var(--color-paper)] mb-6">HOW TO PLAY</h2>
          <div className="flex flex-col gap-4">
            {steps.map((s) => (
              <div key={s.title} className="border-l-4 border-[var(--color-crime)] pl-4">
                <p className="font-display text-[10px] text-[var(--color-xp)]">{s.title}</p>
                <p className="font-mono-ui text-sm mt-1 text-[var(--color-paper)]/80">{s.body}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <PixelButton onClick={onBack} fullWidth>
              Got it
            </PixelButton>
          </div>
        </div>
      </CropFrame>
    </div>
  )
}
