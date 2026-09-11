const BASE_XP = 100
const MAX_TIME_BONUS = 100
const MAX_HINT_BONUS = 100 // scaled by the fraction of letters still hidden when guessed
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

export interface HintScoreInput {
  correct: boolean
  hiddenLettersAtGuess: number
  totalGuessableLetters: number
  streakBeforeThisRound: number
}

export interface HintScoreOutput {
  xp: number
  perfectCrop: boolean
  hintBonus: number
  streakBonus: number
}

/**
 * Scores a Scribbl-style round: the fewer letters revealed when you guess correctly,
 * the bigger the bonus. Guessing before any letter is auto-revealed is a Perfect Crop.
 */
export function computeHintScore({
  correct,
  hiddenLettersAtGuess,
  totalGuessableLetters,
  streakBeforeThisRound,
}: HintScoreInput): HintScoreOutput {
  if (!correct) {
    return { xp: 0, perfectCrop: false, hintBonus: 0, streakBonus: 0 }
  }

  const hiddenFraction = totalGuessableLetters > 0 ? hiddenLettersAtGuess / totalGuessableLetters : 0
  const hintBonus = Math.round(hiddenFraction * MAX_HINT_BONUS)
  const streakBonus = streakBeforeThisRound * STREAK_MULTIPLIER
  const perfectCrop = hiddenLettersAtGuess >= totalGuessableLetters // guessed before any hint revealed
  const perfectBonus = perfectCrop ? PERFECT_CROP_BONUS : 0

  const xp = BASE_XP + hintBonus + streakBonus + perfectBonus
  return { xp, perfectCrop, hintBonus, streakBonus }
}
