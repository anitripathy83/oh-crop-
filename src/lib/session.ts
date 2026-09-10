import { BRANDS } from '../data/brands'
import type { Brand, Challenge, Difficulty } from '../types'

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

const DIFFICULTY_ORDER: Difficulty[] = ['easy', 'easy', 'medium', 'medium', 'medium', 'medium', 'hard', 'hard', 'hard', 'legendary']

/** Builds distractor options from the same category first, falling back to the full pool. */
function pickDistractors(target: Brand, pool: Brand[], count: number): Brand[] {
  const sameCategory = pool.filter((b) => b.id !== target.id && b.category === target.category)
  const rest = pool.filter((b) => b.id !== target.id && b.category !== target.category)
  const picked = shuffle(sameCategory).slice(0, count)
  if (picked.length < count) {
    picked.push(...shuffle(rest).slice(0, count - picked.length))
  }
  return picked
}

export function buildSession(rounds = 10): Challenge[] {
  const pool = shuffle(BRANDS)
  const chosen = pool.slice(0, Math.min(rounds, pool.length))

  // Loosely align chosen brands to a difficulty curve (easy -> legendary) by re-sorting
  // within what's available, without forcing exact matches (keeps things unpredictable).
  const curved = [...chosen].sort((a, b) => {
    const order: Record<Difficulty, number> = { easy: 0, medium: 1, hard: 2, legendary: 3 }
    const target = DIFFICULTY_ORDER
    const ai = target.indexOf(a.difficulty)
    const bi = target.indexOf(b.difficulty)
    return order[a.difficulty] - order[b.difficulty] || ai - bi
  })

  return curved.map((brand) => {
    const distractors = pickDistractors(brand, BRANDS, 3)
    const options = shuffle([brand, ...distractors])
    return { brand, options }
  })
}

export function difficultyTiming(difficulty: Difficulty): { revealMs: number; label: string } {
  switch (difficulty) {
    case 'easy':
      return { revealMs: 7000, label: 'EASY' }
    case 'medium':
      return { revealMs: 8500, label: 'MEDIUM' }
    case 'hard':
      return { revealMs: 9500, label: 'HARD' }
    case 'legendary':
      return { revealMs: 11000, label: 'LEGENDARY' }
  }
}
