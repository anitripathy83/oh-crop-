import type { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-[var(--color-xp)] text-[var(--color-ink)]',
  secondary: 'bg-[var(--color-grass)] text-[var(--color-ink)]',
  ghost: 'bg-transparent text-[var(--color-paper)] border-2 border-[var(--color-line)]',
  danger: 'bg-[var(--color-crime)] text-[var(--color-ink)]',
}

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  fullWidth?: boolean
}

export function PixelButton({
  variant = 'primary',
  fullWidth = false,
  className = '',
  children,
  ...rest
}: PixelButtonProps) {
  return (
    <button
      className={`pixel-btn font-display text-[11px] sm:text-xs tracking-wide px-6 py-4 uppercase disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
