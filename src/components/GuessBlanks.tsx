import type { LetterSlot } from '../lib/hints'

export function GuessBlanks({ slots, revealedIndices }: { slots: LetterSlot[]; revealedIndices: Set<number> }) {
  return (
    <div className="flex flex-wrap items-center justify-center gap-1.5">
      {slots.map((slot, i) => {
        if (!slot.guessable) {
          // spaces and punctuation always show, as thin visual separators
          return (
            <span key={i} className="font-display text-sm text-[var(--color-paper)]/40 px-0.5">
              {slot.char === ' ' ? '\u00A0' : slot.char}
            </span>
          )
        }
        const shown = revealedIndices.has(i)
        return (
          <span
            key={i}
            className={`w-6 h-8 sm:w-7 sm:h-9 flex items-center justify-center font-display text-sm sm:text-base border-b-4 transition-colors ${
              shown ? 'text-[var(--color-xp)] border-[var(--color-xp)]' : 'text-transparent border-[var(--color-line)]'
            }`}
          >
            {shown ? slot.char.toUpperCase() : '_'}
          </span>
        )
      })}
    </div>
  )
}
