import { useState } from 'react'
import { PixelButton } from './PixelButton'
import { CropFrame } from './CropFrame'
import { sanitizeName, sanitizeBitsId, sanitizePhone } from '../lib/leaderboard'

const MAX_LENGTH = 18
const MAX_BITS_ID_LENGTH = 20
const MAX_PHONE_LENGTH = 15

export function NameEntry({
  onSubmit,
  onLeaderboard,
}: {
  onSubmit: (name: string, bitsId: string, phone: string) => void
  onLeaderboard: () => void
}) {
  const [name, setName] = useState('')
  const [bitsId, setBitsId] = useState('')
  const [phone, setPhone] = useState('')

  const canSubmit = name.trim().length > 0 && bitsId.trim().length > 0 && phone.trim().length > 0

  function submit() {
    if (!canSubmit) return
    onSubmit(sanitizeName(name), sanitizeBitsId(bitsId), sanitizePhone(phone))
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
            placeholder="YOUR NAME"
            maxLength={MAX_LENGTH}
            className="w-full mt-2 bg-[var(--color-ink)] border-2 border-[var(--color-line)] focus:border-[var(--color-xp)] outline-none px-4 py-3 font-mono-ui text-base text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/30 uppercase"
          />

          <label htmlFor="bits-id" className="font-mono-ui text-[10px] tracking-[0.2em] mt-5 self-start text-[var(--color-xp)]">
            BITS ID NUMBER
          </label>
          <input
            id="bits-id"
            value={bitsId}
            onChange={(e) => setBitsId(e.target.value.slice(0, MAX_BITS_ID_LENGTH))}
            placeholder="2024A7PS0000U"
            maxLength={MAX_BITS_ID_LENGTH}
            className="w-full mt-2 bg-[var(--color-ink)] border-2 border-[var(--color-line)] focus:border-[var(--color-xp)] outline-none px-4 py-3 font-mono-ui text-base text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/30 uppercase"
          />

          <label htmlFor="phone" className="font-mono-ui text-[10px] tracking-[0.2em] mt-5 self-start text-[var(--color-xp)]">
            PHONE NUMBER
          </label>
          <input
            id="phone"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value.slice(0, MAX_PHONE_LENGTH))}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && canSubmit) submit()
            }}
            placeholder="+91 90000 00000"
            maxLength={MAX_PHONE_LENGTH}
            className="w-full mt-2 bg-[var(--color-ink)] border-2 border-[var(--color-line)] focus:border-[var(--color-xp)] outline-none px-4 py-3 font-mono-ui text-base text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/30"
          />

          <p className="font-mono-ui text-[9px] mt-3 text-[var(--color-paper)]/40 text-center">
            Used only for the club's own membership follow-up — never shown on the leaderboard.
          </p>

          <div className="w-full flex flex-col gap-3 mt-6">
            <PixelButton onClick={submit} disabled={!canSubmit} fullWidth>
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
