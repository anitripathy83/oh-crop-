export interface LetterSlot {
  char: string
  guessable: boolean // letters/digits get blanked; spaces & punctuation always show
}

export function buildSlots(name: string): LetterSlot[] {
  return name.split('').map((char) => ({ char, guessable: /[a-zA-Z0-9]/.test(char) }))
}

/**
 * Returns the guessable slot indices in the order they'll be auto-revealed as hints,
 * capped so at least one letter (two, for longer names) stays hidden until either a
 * correct guess or the round times out — keeps the round from solving itself.
 */
export function buildHintOrder(slots: LetterSlot[]): number[] {
  const guessableIndices = slots.map((s, i) => (s.guessable ? i : -1)).filter((i) => i >= 0)

  for (let i = guessableIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[guessableIndices[i], guessableIndices[j]] = [guessableIndices[j], guessableIndices[i]]
  }

  const keepHidden = guessableIndices.length <= 3 ? 0 : guessableIndices.length >= 8 ? 2 : 1
  return guessableIndices.slice(0, guessableIndices.length - keepHidden)
}

/** Spreads hint reveal times across the round: first hint a bit in, last hint before the final stretch. */
export function hintDelayMs(hintIndex: number, totalHints: number, revealMs: number): number {
  if (totalHints <= 0) return revealMs
  const start = revealMs * 0.18
  const end = revealMs * 0.88
  const span = end - start
  return Math.round(start + (span * hintIndex) / Math.max(1, totalHints))
}

export function normalizeGuess(value: string): string {
  return value.trim().toLowerCase().replace(/[^a-z0-9]/g, '')
}

export function isCorrectGuess(guess: string, brandName: string): boolean {
  const g = normalizeGuess(guess)
  return g.length > 0 && g === normalizeGuess(brandName)
}
