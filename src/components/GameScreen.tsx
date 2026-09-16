import { useEffect, useMemo, useRef, useState } from 'react'
import type { Challenge, RoundResult } from '../types'
import { GameHUD } from './GameHUD'
import { LogoReveal } from './LogoReveal'
import { FeedbackToast, pickCrimeLine } from './FeedbackToast'
import { PixelConfetti } from './PixelConfetti'
import { GuessBlanks } from './GuessBlanks'
import { GuessInput } from './GuessInput'
import { difficultyTiming } from '../lib/session'
import { computeHintScore } from '../lib/scoring'
import { buildSlots, buildHintOrder, hintDelayMs, isCorrectGuess } from '../lib/hints'
import { playSfx } from '../lib/audio'

type AnswerState = 'idle' | 'correct' | 'timeout'

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
  const [timeFraction, setTimeFraction] = useState(1)
  const [running, setRunning] = useState(true)
  const [revealed, setRevealed] = useState(false)
  const [confettiKey, setConfettiKey] = useState(0)
  const [crimeLine, setCrimeLine] = useState('')
  const [revealedIndices, setRevealedIndices] = useState<Set<number>>(new Set())
  const [wrongPulse, setWrongPulse] = useState(0)
  const [wrongLine, setWrongLine] = useState('')

  const resultsRef = useRef<RoundResult[]>([])
  const roundStartRef = useRef<number>(performance.now())
  const timeoutHandleRef = useRef<number | null>(null)
  const hintHandlesRef = useRef<number[]>([])

  const challenge = challenges[roundIdx]
  const { revealMs, label: difficultyLabel } = difficultyTiming(challenge.brand.difficulty)

  const slots = useMemo(() => buildSlots(challenge.brand.name), [challenge.brand.id])
  const totalGuessable = useMemo(() => slots.filter((s) => s.guessable).length, [slots])

  function clearAllTimers() {
    if (timeoutHandleRef.current) window.clearTimeout(timeoutHandleRef.current)
    hintHandlesRef.current.forEach((h) => window.clearTimeout(h))
    hintHandlesRef.current = []
  }

  useEffect(() => {
    // reset per-round state
    setAnswerState('idle')
    setRevealed(false)
    setRunning(true)
    setTimeFraction(1)
    setRevealedIndices(new Set())
    roundStartRef.current = performance.now()
    playSfx(roundIdx === 0 ? 'start' : 'tick')

    clearAllTimers()

    const hintOrder = buildHintOrder(slots)
    hintOrder.forEach((slotIndex, hintIdx) => {
      const delay = hintDelayMs(hintIdx, hintOrder.length, revealMs)
      const handle = window.setTimeout(() => {
        setRevealedIndices((prev) => {
          const next = new Set(prev)
          next.add(slotIndex)
          return next
        })
        playSfx('tick')
      }, delay)
      hintHandlesRef.current.push(handle)
    })

    timeoutHandleRef.current = window.setTimeout(() => {
      handleTimeout()
    }, revealMs)

    return clearAllTimers
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
    clearAllTimers()
    setRunning(false)
    setRevealed(true)
    setRevealedIndices(new Set(slots.map((_, i) => i)))
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

  function handleGuess(value: string) {
    if (answerState !== 'idle') return

    if (!isCorrectGuess(value, challenge.brand.name)) {
      setWrongPulse((k) => k + 1)
      setWrongLine(pickCrimeLine())
      playSfx('wrong')
      return
    }

    clearAllTimers()
    const answerMs = performance.now() - roundStartRef.current
    const hiddenLettersAtGuess = totalGuessable - revealedIndices.size
    setRunning(false)
    setRevealed(true)
    setRevealedIndices(new Set(slots.map((_, i) => i)))

    const { xp: gained, perfectCrop } = computeHintScore({
      correct: true,
      hiddenLettersAtGuess,
      totalGuessableLetters: totalGuessable,
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
          <FeedbackToast kind={feedbackKind} message={feedbackKind === 'timeout' ? crimeLine : undefined} />
          {feedbackKind === 'perfect' && <PixelConfetti activeKey={confettiKey} />}
        </div>

        <div className="w-full max-w-sm flex flex-col items-center gap-4">
          <p className="font-mono-ui text-[10px] tracking-[0.2em] text-center text-[var(--color-paper)]/50">
            WHAT BRAND IS THIS?
          </p>
          <GuessBlanks slots={slots} revealedIndices={revealedIndices} />
          <GuessInput disabled={answerState !== 'idle'} shakeKey={wrongPulse} onSubmit={handleGuess} />
          {wrongPulse > 0 && answerState === 'idle' && (
            <p key={wrongPulse} className="animate-pop font-mono-ui text-[10px] text-[var(--color-crime)]/80 -mt-2">
              ❌ {wrongLine}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
