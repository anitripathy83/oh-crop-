import type { LeaderboardEntry } from '../types'

const STORAGE_KEY = 'ohcrop_leaderboard_v1'
const MAX_ENTRIES = 200
const MAX_NAME_LENGTH = 18

/**
 * Prototype persistence: localStorage, scoped to this device/browser.
 *
 * PRODUCTION NOTE (see handover section 17-18): before the live stall, replace this
 * module's storage calls with a shared backend (Supabase/Firebase/a small API) so all
 * stations share one leaderboard, and move score validation server-side — a client-only
 * leaderboard should never be trusted for a public/competitive display as-is.
 */

export function sanitizeName(raw: string): string {
  const stripped = raw.replace(/<[^>]*>/g, '').replace(/[^\w\s.'-]/g, '')
  const trimmed = stripped.trim().slice(0, MAX_NAME_LENGTH)
  return trimmed.length > 0 ? trimmed : 'DESIGNER'
}

function readAll(): LeaderboardEntry[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

function writeAll(entries: LeaderboardEntry[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)))
  } catch {
    // storage unavailable (private mode / full) — fail silently, gameplay still works
  }
}

export function submitScore(entry: Omit<LeaderboardEntry, 'id' | 'timestamp'>): LeaderboardEntry {
  const all = readAll()
  const record: LeaderboardEntry = {
    ...entry,
    name: sanitizeName(entry.name),
    xp: Math.max(0, Math.round(entry.xp)),
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    timestamp: Date.now(),
  }
  const next = [...all, record].sort((a, b) => b.xp - a.xp)
  writeAll(next)
  return record
}

export function getLeaderboard(): LeaderboardEntry[] {
  return readAll().sort((a, b) => b.xp - a.xp)
}

export function getRank(entryId: string): number {
  const all = getLeaderboard()
  const idx = all.findIndex((e) => e.id === entryId)
  return idx === -1 ? -1 : idx + 1
}

export function resetLeaderboard() {
  writeAll([])
}
