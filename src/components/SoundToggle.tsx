export function SoundToggle({ muted, onToggle }: { muted: boolean; onToggle: () => void }) {
  return (
    <button
      onClick={onToggle}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      aria-pressed={muted}
      className="font-mono-ui text-[11px] px-3 py-2 border-2 border-[var(--color-line)] bg-[var(--color-ink-2)] text-[var(--color-paper)] hover:border-[var(--color-xp)] transition-colors"
    >
      {muted ? '🔇 SOUND OFF' : '🔊 SOUND ON'}
    </button>
  )
}
