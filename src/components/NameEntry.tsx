import { useState } from 'react'
import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'
import { sanitizeName } from '../lib/leaderboard'

const MAX_LENGTH = 18

export function NameEntry({
  onSubmit,
  onLeaderboard,
}: {
  onSubmit: (name: string) => void
  onLeaderboard: () => void
}) {
  const [name, setName] = useState('')

  function submit() {
    const clean = sanitizeName(name)
    onSubmit(clean)
  }

  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col items-center justify-center px-6 py-12">
      <CropFrame colorClass="text-[var(--color-xp)]">
        <div className="w-full max-w-sm bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] px-6 py-10 flex flex-col items-center">
          <h2 className="font-display text-lg sm:text-2xl text-center text-[var(--color-paper)]">
            WHO ARE YOU?
          </h2>
          <p className="font-mono-ui text-xs text-center mt-3 text-[var(--color-paper)]/70">
            Your design crimes will be recorded.
          </p>

          <label htmlFor="player-name" className="font-mono-ui text-[10px] tracking-[0.2em] mt-8 self-start text-[var(--color-xp)]">
            ENTER YOUR NAME
          </label>
          <input
            id="player-name"
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, MAX_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && name.trim().length > 0) submit()
            }}
            placeholder="YOUR NAME"
            maxLength={MAX_LENGTH}
            className="w-full mt-2 bg-[var(--color-ink)] border-2 border-[var(--color-line)] focus:border-[var(--color-xp)] outline-none px-4 py-3 font-mono-ui text-base text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/30 uppercase"
          />
          <p className="font-mono-ui text-[10px] mt-2 self-end text-[var(--color-paper)]/40">
            {name.length}/{MAX_LENGTH}
          </p>

          <div className="w-full flex flex-col gap-3 mt-8">
            <PixelButton onClick={submit} disabled={name.trim().length === 0} fullWidth>
              ▶ Enter the Design Village
            </PixelButton>
            <PixelButton onClick={onLeaderboard} variant="ghost" fullWidth>
              ★ View Leaderboard
            </PixelButton>
          </div>
        </div>
      </CropFrame>
    </div>
  )
}
