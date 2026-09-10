export type Category =
  | 'Luxury / Fashion'
  | 'Streetwear'
  | 'Design & Creative Tools'
  | 'Automotive'
  | 'Food & Lifestyle'
  | 'Tech & Culture'
  | 'Culture & Icons'

export type Difficulty = 'easy' | 'medium' | 'hard' | 'legendary'

export type WordmarkShape = 'plain' | 'roundel' | 'shield' | 'box' | 'ribbon' | 'diamond'

export interface Brand {
  id: string
  name: string
  category: Category
  difficulty: Difficulty
  color: string
  bg: string
  fontFamily: 'serif' | 'sans' | 'script' | 'mono' | 'display'
  letterSpacing: 'tight' | 'normal' | 'wide' | 'wider'
  shape: WordmarkShape
  uppercase: boolean
  /** Optional real brand mark asset. */
  asset?: string
}

export interface Challenge {
  brand: Brand
  options: Brand[]
}

export interface RoundResult {
  brandId: string
  brandName: string
  correct: boolean
  timedOut: boolean
  answerMs: number
  xp: number
  perfectCrop: boolean
}

export interface LeaderboardEntry {
  id: string
  name: string
  xp: number
  accuracy: number
  perfectCrops: number
  bestStreak: number
  timestamp: number
}

export type Screen =
  | 'attract'
  | 'landing'
  | 'name'
  | 'pregame'
  | 'howto'
  | 'game'
  | 'results'
  | 'leaderboard'
  | 'join'

export type SoundtrackTrackId = 'menu' | 'gameplay' | 'victory' | 'gameover' | 'theme'
