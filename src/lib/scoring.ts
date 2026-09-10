const BASE_XP = 100
const MAX_TIME_BONUS = 100
const PERFECT_CROP_THRESHOLD_MS = 3000 // answering within this window = Perfect Crop
const PERFECT_CROP_BONUS = 100
const STREAK_MULTIPLIER = 20

export interface ScoreInput {
  correct: boolean
  answerMs: number
  revealMs: number
  streakBeforeThisRound: number
}

export interface ScoreOutput {
  xp: number
  perfectCrop: boolean
  timeBonus: number
  streakBonus: number
}

export function computeScore({ correct, answerMs, revealMs, streakBeforeThisRound }: ScoreInput): ScoreOutput {
  if (!correct) {
    return { xp: 0, perfectCrop: false, timeBonus: 0, streakBonus: 0 }
  }

  const timeFraction = Math.max(0, 1 - answerMs / revealMs)
  const timeBonus = Math.round(timeFraction * MAX_TIME_BONUS)
  const streakBonus = streakBeforeThisRound * STREAK_MULTIPLIER
  const perfectCrop = answerMs <= PERFECT_CROP_THRESHOLD_MS
  const perfectBonus = perfectCrop ? PERFECT_CROP_BONUS : 0

  const xp = BASE_XP + timeBonus + streakBonus + perfectBonus
  return { xp, perfectCrop, timeBonus, streakBonus }
}
