import { useEffect, useRef, useState } from 'react'
import { PixelButton } from './PixelButton'

export function GuessInput({
  disabled,
  shakeKey,
  onSubmit,
}: {
  disabled: boolean
  shakeKey: number
  onSubmit: (value: string) => void
}) {
  const [value, setValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!disabled) inputRef.current?.focus()
  }, [disabled])

  function submit() {
    if (disabled || value.trim().length === 0) return
    onSubmit(value)
    setValue('')
  }

  return (
    <div key={shakeKey} className={`flex gap-2 w-full ${shakeKey > 0 ? 'animate-shake' : ''}`}>
      <input
        ref={inputRef}
        value={value}
        disabled={disabled}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') submit()
        }}
        placeholder="TYPE THE BRAND NAME"
        autoComplete="off"
        autoCapitalize="characters"
        className="flex-1 min-w-0 bg-[var(--color-ink-2)] border-2 border-[var(--color-line)] focus:border-[var(--color-xp)] outline-none px-4 py-3 font-mono-ui text-sm text-[var(--color-paper)] placeholder:text-[var(--color-paper)]/30 uppercase disabled:opacity-50"
      />
      <PixelButton onClick={submit} disabled={disabled || value.trim().length === 0}>
        Guess
      </PixelButton>
    </div>
  )
}
