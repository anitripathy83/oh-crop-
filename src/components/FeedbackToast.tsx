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

export function FeedbackToast({ kind, message }: FeedbackToastProps) {
  if (!kind) return null

  if (kind === 'perfect') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="animate-pop text-center">
          <p className="font-display text-xl sm:text-3xl text-[var(--color-xp)] drop-shadow-[0_0_12px_rgba(255,201,60,0.6)]">
            ✨ PERFECT CROP ✨
          </p>
        </div>
      </div>
    )
  }

  if (kind === 'correct') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <p className="animate-pop font-display text-lg sm:text-2xl text-[var(--color-grass)]">
          NICE EYE.
        </p>
      </div>
    )
  }

  if (kind === 'wrong' || kind === 'timeout') {
    return (
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
        <div className="animate-shake text-center bg-[var(--color-ink)]/90 px-6 py-4 border-2 border-[var(--color-crime)]">
          <p className="font-display text-sm sm:text-lg text-[var(--color-crime)]">
            🚨 {kind === 'timeout' ? 'OH CROP! TIME\'S UP' : 'DESIGN CRIME DETECTED'}
          </p>
          <p className="font-mono-ui text-xs sm:text-sm mt-2 text-[var(--color-paper)]/80">{message}</p>
        </div>
      </div>
    )
  }

  return null
}
