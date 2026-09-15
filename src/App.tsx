import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import type { Challenge, LeaderboardEntry, RoundResult, Screen } from './types'
import { buildSession } from './lib/session'
import { getLeaderboard, submitScore, getRank, downloadContactsCsv } from './lib/leaderboard'
import { setMuted, isMuted, unlockAudio, playSfx } from './lib/audio'
import { useSoundtrack } from './hooks/useSoundtrack'
import { unlockSoundtrack } from './lib/soundtrack'

import { Landing } from './components/Landing'
import { NameEntry } from './components/NameEntry'
import { PreGame } from './components/PreGame'
import { HowToPlay } from './components/HowToPlay'
import { GameScreen } from './components/GameScreen'
import { Results } from './components/Results'
import { Leaderboard } from './components/Leaderboard'
import { JoinScreen } from './components/JoinScreen'
import { AttractMode } from './components/AttractMode'
import { SoundToggle } from './components/SoundToggle'

const ROUNDS = 10
const IDLE_TO_ATTRACT_MS = 45000
// Set this once the club has a sign-up link/form ready.
const MEMBERSHIP_URL: string | undefined = 'https://tr.ee/Yhk9yIxqgG'

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(() => {
    if (typeof window === 'undefined') return false
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  })
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const handler = () => setReduced(mq.matches)
    mq.addEventListener('change', handler)
    return () => mq.removeEventListener('change', handler)
  }, [])
  return reduced
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('landing')
  const [playerName, setPlayerName] = useState('')
  const [playerBitsId, setPlayerBitsId] = useState('')
  const [playerPhone, setPlayerPhone] = useState('')
  const [session, setSession] = useState<Challenge[]>(() => buildSession(ROUNDS))
  const [results, setResults] = useState<RoundResult[]>([])
  const [lastEntryId, setLastEntryId] = useState<string | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => getLeaderboard())
  const [muted, setMutedState] = useState(() => isMuted())
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [leaderboardOrigin, setLeaderboardOrigin] = useState<Screen>('landing')
  const reducedMotion = usePrefersReducedMotion()
  const idleTimerRef = useRef<number | null>(null)

  useSoundtrack(screen, muted, results)

  const refreshLeaderboard = useCallback(() => setLeaderboard(getLeaderboard()), [])

  // Idle -> attract mode, only while resting on the landing screen.
  useEffect(() => {
    function resetIdle() {
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current)
      if (screen !== 'landing') return
      idleTimerRef.current = window.setTimeout(() => setScreen('attract'), IDLE_TO_ATTRACT_MS)
    }
    resetIdle()
    window.addEventListener('pointerdown', resetIdle)
    window.addEventListener('keydown', resetIdle)
    return () => {
      window.removeEventListener('pointerdown', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      if (idleTimerRef.current) window.clearTimeout(idleTimerRef.current)
    }
  }, [screen])

  const totalXp = useMemo(() => results.reduce((sum, r) => sum + r.xp, 0), [results])
  
  // Hidden admin shortcut: Ctrl+Shift+E downloads a CSV of every recorded entry
  // (name, BITS ID, phone, score). Deliberately not a visible button — this data
  // includes phone numbers and shouldn't be one tap away for stall visitors.
  useEffect(() => {
    function handleExportShortcut(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'e') {
        e.preventDefault()
        downloadContactsCsv()
      }
    }
    window.addEventListener('keydown', handleExportShortcut)
    return () => window.removeEventListener('keydown', handleExportShortcut)
  }, [])

  function goPlay() {
    unlockAudio()
    unlockSoundtrack()
    setSession(buildSession(ROUNDS))
    setScreen('name')
  }

  function onNameSubmit(name: string, bitsId: string, phone: string) {
    unlockAudio()
    unlockSoundtrack()
    setPlayerName(name)
    setPlayerBitsId(bitsId)
    setPlayerPhone(phone)
    playSfx('select')
    setScreen('pregame')
  }

  function onStartGame() {
    unlockAudio()
    unlockSoundtrack()
    playSfx('start')
    setScreen('game')
  }

  function onGameFinish(roundResults: RoundResult[]) {
    setResults(roundResults)
    const xp = roundResults.reduce((sum, r) => sum + r.xp, 0)
    const correct = roundResults.filter((r) => r.correct).length
    const accuracy = roundResults.length ? Math.round((correct / roundResults.length) * 100) : 0
    const perfectCrops = roundResults.filter((r) => r.perfectCrop).length

    let bestStreak = 0
    let running = 0
    for (const r of roundResults) {
      running = r.correct ? running + 1 : 0
      bestStreak = Math.max(bestStreak, running)
    }

    const entry = submitScore({ name: playerName, bitsId: playerBitsId, phone: playerPhone, xp, accuracy, perfectCrops, bestStreak })
    setLastEntryId(entry.id)
    refreshLeaderboard()
    playSfx('gameover')
    setScreen('results')
  }

  function toggleMute() {
    const next = !isMuted()
    setMuted(next)
    setMutedState(next)
  }

  async function toggleFullscreen() {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen().catch(() => {})
      setIsFullscreen(true)
    } else {
      await document.exitFullscreen().catch(() => {})
      setIsFullscreen(false)
    }
  }

  const rank = lastEntryId ? getRank(lastEntryId) : -1

  return (
    <div className="relative">
      <div className="fixed top-3 right-3 z-40 flex gap-2">
        <SoundToggle muted={muted} onToggle={toggleMute} />
        <button
          onClick={toggleFullscreen}
          className="font-mono-ui text-[11px] px-3 py-2 border-2 border-[var(--color-line)] bg-[var(--color-ink-2)] text-[var(--color-paper)] hover:border-[var(--color-xp)] transition-colors"
        >
          {isFullscreen ? '⤢ EXIT' : '⤢ FULLSCREEN'}
        </button>
      </div>

      {screen === 'attract' && (
        <AttractMode leaderboard={leaderboard} onDismiss={() => setScreen('landing')} />
      )}

      {screen === 'landing' && (
        <Landing
          onPlay={goPlay}
          onLeaderboard={() => { refreshLeaderboard(); setScreen('leaderboard') }}
          onHowTo={() => setScreen('howto')}
        />
      )}

      {screen === 'howto' && <HowToPlay onBack={() => setScreen('landing')} />}

      {screen === 'name' && (
        <NameEntry
          onSubmit={onNameSubmit}
          onLeaderboard={() => { refreshLeaderboard(); setLeaderboardOrigin('name'); setScreen('leaderboard') }}
        />
      )}

      {screen === 'pregame' && (
        <PreGame name={playerName} rounds={session.length} onStart={onStartGame} />
      )}

      {screen === 'game' && (
        <GameScreen
          playerName={playerName}
          challenges={session}
          reducedMotion={reducedMotion}
          onFinish={onGameFinish}
        />
      )}

      {screen === 'results' && (
        <Results
          playerName={playerName}
          results={results}
          totalXp={totalXp}
          rank={rank}
          onPlayAgain={goPlay}
          onLeaderboard={() => { refreshLeaderboard(); setLeaderboardOrigin('results'); setScreen('leaderboard') }}
          onJoin={() => setScreen('join')}
        />
      )}

      {screen === 'leaderboard' && (
        <Leaderboard
          entries={leaderboard}
          highlightId={lastEntryId}
          onBack={() => setScreen(leaderboardOrigin)}
        />
      )}

      {screen === 'join' && <JoinScreen joinUrl={MEMBERSHIP_URL} onBack={() => setScreen('results')} />}
    </div>
  )
}
