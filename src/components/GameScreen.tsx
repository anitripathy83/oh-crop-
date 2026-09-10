import { useEffect, useMemo, useRef, useState } from 'react'
import type { Brand, Challenge, RoundResult } from '../types'
import { GameHUD } from './GameHUD'
import { LogoReveal } from './LogoReveal'
import { FeedbackToast, pickCrimeLine } from './FeedbackToast'
import { PixelConfetti } from './PixelConfetti'
import { difficultyTiming } from '../lib/session'
import { computeScore } from '../lib/scoring'
import { playSfx } from '../lib/audio'

type AnswerState = 'idle' | 'correct' | 'wrong' | 'timeout'

export function GameScreen({
  playerName,
  challenges,
  reducedMotion,
  onFinish,
}: {
  playerName: string
  challenges: Challenge[]
  reducedMotion: boolean
  onFinish: (results: RoundResult[]) => void
}) {
  const [roundIdx, setRoundIdx] = useState(0)
  const [xp, setXp] = useState(0)
  const [streak, setStreak] = useState(0)
  const [answerState, setAnswerState] = useState<AnswerState>('idle')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [timeFraction, setTimeFraction] = useState(1)
  const [running, setRunning] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const [crimeLine, setCrimeLine] = useState('')

  const resultsRef = useRef<RoundResult[]>([])
  const roundStartRef = useRef<number>(performance.now())
  const timeoutHandleRef = useRef<number | null>(null)

  const challenge = challenges[roundIdx]
  const { revealMs, label: difficultyLabel } = difficultyTiming(challenge.brand.difficulty)

  useEffect(() => {
    // reset per-round state
    setAnswerState('idle')
    setSelectedId(null)
    setRevealed(false)
    setRunning(true)
    setTimeFraction(1)
    roundStartRef.current = performance.now()
    playSfx(roundIdx === 0 ? 'start' : 'tick')

    if (timeoutHandleRef.current) window.clearTimeout(timeoutHandleRef.current)
    timeoutHandleRef.current = window.setTimeout(() => {
      handleTimeout()
    }, revealMs)

    return () => {
      if (timeoutHandleRef.current) window.clearTimeout(timeoutHandleRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundIdx])

  function handleProgress(p: number) {
    setTimeFraction(1 - p)
  }

  function commitResult(result: RoundResult) {
    resultsRef.current = [...resultsRef.current, result]
  }

  function advance() {
    if (roundIdx + 1 >= challenges.length) {
      onFinish(resultsRef.current)
    } else {
      setRoundIdx((i) => i + 1)
    }
  }

  function handleTimeout() {
    setRunning(false)
    setRevealed(true)
    setAnswerState('timeout')
    setStreak(0)
    playSfx('crime')
    setCrimeLine('TOO SLOW. THE DEADLINE PASSED.')
    commitResult({
      brandId: challenge.brand.id,
      brandName: challenge.brand.name,
      correct: false,
      timedOut: true,
      answerMs: revealMs,
      xp: 0,
      perfectCrop: false,
    })
    window.setTimeout(advance, 1800)
  }

  function handleAnswer(brand: Brand) {
    if (answerState !== 'idle') return
    if (timeoutHandleRef.current) window.clearTimeout(timeoutHandleRef.current)

    const answerMs = performance.now() - roundStartRef.current
    const correct = brand.id === challenge.brand.id
    setSelectedId(brand.id)
    setRunning(false)
    setRevealed(true)

    if (correct) {
      const { xp: gained, perfectCrop } = computeScore({
        correct: true,
        answerMs,
        revealMs,
        streakBeforeThisRound: streak,
      })
      setXp((x) => x + gained)
      setStreak((s) => s + 1)
      setAnswerState('correct')
      if (perfectCrop) {
        playSfx('perfect')
        setConfettiKey((k) => k + 1)
      } else {
        playSfx('correct')
      }
      if (streak > 0 && streak % 3 === 0) playSfx('streak')
      commitResult({
        brandId: challenge.brand.id,
        brandName: challenge.brand.name,
        correct: true,
        timedOut: false,
        answerMs,
        xp: gained,
        perfectCrop,
      })
    } else {
      setStreak(0)
      setAnswerState('wrong')
      setCrimeLine(pickCrimeLine())
      playSfx('crime')
      commitResult({
        brandId: challenge.brand.id,
        brandName: challenge.brand.name,
        correct: false,
        timedOut: false,
        answerMs,
        xp: 0,
        perfectCrop: false,
      })
    }

    window.setTimeout(advance, 1800)
  }

  const feedbackKind = useMemo(() => {
    if (answerState === 'idle') return null
    if (answerState === 'correct') {
      const last = resultsRef.current[resultsRef.current.length - 1]
      return last?.perfectCrop ? 'perfect' : 'correct'
    }
    return answerState
  }, [answerState])

  return (
    <div className="min-h-dvh bg-cutting-mat flex flex-col">
      <GameHUD
        playerName={playerName}
        round={roundIdx + 1}
        totalRounds={challenges.length}
        xp={xp}
        streak={streak}
        timeFraction={timeFraction}
        difficultyLabel={difficultyLabel}
      />

      <div className="flex-1 flex flex-col items-center justify-center px-4 py-4 gap-6">
        <div className="relative w-full max-w-sm aspect-[4/3] border-2 border-[var(--color-line)]">
          <LogoReveal
            brand={challenge.brand}
            revealMs={revealMs}
            running={running}
            revealed={revealed}
            onProgress={handleProgress}
            reducedMotion={reducedMotion}
          />
          <FeedbackToast kind={feedbackKind} message={feedbackKind === 'wrong' || feedbackKind === 'timeout' ? crimeLine : undefined} />
          {feedbackKind === 'perfect' && <PixelConfetti activeKey={confettiKey} />}
        </div>

        <div className="w-full max-w-sm">
          <p className="font-mono-ui text-[10px] tracking-[0.2em] text-center text-[var(--color-paper)]/50 mb-3">
            WHAT BRAND IS THIS?
          </p>
          <div className="grid grid-cols-2 gap-3">
            {challenge.options.map((opt) => {
              const isSelected = selectedId === opt.id
              const isCorrectOpt = revealed && opt.id === challenge.brand.id
              const isWrongSelected = revealed && isSelected && opt.id !== challenge.brand.id
              return (
                <button
                  key={opt.id}
                  onClick={() => handleAnswer(opt)}
                  disabled={answerState !== 'idle'}
                  className={`font-display text-[10px] sm:text-xs px-3 py-4 border-2 uppercase transition-colors
                    ${isCorrectOpt ? 'bg-[var(--color-grass)] border-[var(--color-grass)] text-[var(--color-ink)]' : ''}
                    ${isWrongSelected ? 'bg-[var(--color-crime)] border-[var(--color-crime)] text-[var(--color-ink)]' : ''}
                    ${!isCorrectOpt && !isWrongSelected ? 'bg-[var(--color-ink-2)] border-[var(--color-line)] text-[var(--color-paper)] hover:border-[var(--color-xp)]' : ''}
                    disabled:cursor-default`}
                >
                  {opt.name}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
