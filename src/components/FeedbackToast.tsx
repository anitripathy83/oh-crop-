interface FeedbackToastProps {
  kind: 'perfect' | 'correct' | 'wrong' | 'timeout' | null
  message?: string
}

const CRIME_LINES = [
  'BRO WHAT DID YOU DO 💀',
  'THAT LOGO DID NOT DESERVE THIS.',
  'YOU STRETCHED IT.',
  'PLEASE NEVER TOUCH A DESIGN TOOL AGAIN.',
  'THIS IS WHY WE HAVE BRAND GUIDELINES.',
]

export function pickCrimeLine(): string {
  return CRIME_LINES[Math.floor(Math.random() * CRIME_LINES.length)]
}

/**
 * Renders as a bottom banner that slides/fades in over the LOWER edge of the reveal
 * box, rather than a centered overlay — so it never sits directly on top of the logo
 * mark itself (which is centered in the same box). Kept out of the flow with
 * `pointer-events-none` so it never blocks a click on the reveal area.
 */
export function FeedbackToast({ kind, message }: FeedbackToastProps) {
  if (!kind) return null

  if (kind === 'perfect') {
    return (
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-20 p-2">
        <div className="animate-pop text-center bg-[var(--color-ink)]/85 border-2 border-[var(--color-xp)] px-5 py-2 shadow-[0_0_18px_rgba(255,201,60,0.55)]">
          <p className="font-display text-sm sm:text-lg text-[var(--color-xp)]">✨ PERFECT CROP ✨</p>
        </div>
      </div>
    )
  }

  if (kind === 'correct') {
    return (
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-20 p-2">
        <div className="animate-pop bg-[var(--color-ink)]/85 border-2 border-[var(--color-grass)] px-5 py-2">
          <p className="font-display text-sm sm:text-lg text-[var(--color-grass)]">NICE EYE.</p>
        </div>
      </div>
    )
  }

  if (kind === 'wrong' || kind === 'timeout') {
    return (
      <div className="absolute inset-x-0 bottom-0 flex justify-center pointer-events-none z-20 p-2">
        <div className="animate-shake text-center bg-[var(--color-ink)]/90 px-5 py-3 border-2 border-[var(--color-crime)] max-w-[92%]">
          <p className="font-display text-xs sm:text-base text-[var(--color-crime)]">
            🚨 {kind === 'timeout' ? "OH CROP! TIME'S UP" : 'DESIGN CRIME DETECTED'}
          </p>
          {message && <p className="font-mono-ui text-[10px] sm:text-sm mt-1 text-[var(--color-paper)]/80">{message}</p>}
        </div>
      </div>
    )
  }

  return null
}
