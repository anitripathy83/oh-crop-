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

// Fixed 8-round structure: rounds 1-3 easy, 4-6 medium, 7-8 hard.
const ROUND_DIFFICULTY_PLAN: Difficulty[] = ['easy', 'easy', 'easy', 'medium', 'medium', 'medium', 'hard', 'hard']

export function buildSession(rounds = ROUND_DIFFICULTY_PLAN.length): Challenge[] {
  const plan = ROUND_DIFFICULTY_PLAN.slice(0, rounds)

  const chosen: Brand[] = []
  for (const difficulty of plan) {
    const pool = BRANDS.filter((b) => b.difficulty === difficulty && !chosen.some((c) => c.id === b.id))
    const fallbackPool = BRANDS.filter((b) => !chosen.some((c) => c.id === b.id))
    const picked = shuffle(pool.length > 0 ? pool : fallbackPool)[0]
    chosen.push(picked)
  }

  return chosen.map((brand) => {
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
      return { revealMs: 9000, label: 'MEDIUM' }
    case 'hard':
      return { revealMs: 10000, label: 'HARD' }
    case 'legendary':
      return { revealMs: 10000, label: 'LEGENDARY' }
  }
}
