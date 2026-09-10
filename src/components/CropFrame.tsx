import type { PropsWithChildren } from 'react'

export function CropFrame({
  children,
  className = '',
  colorClass = 'text-[var(--color-xp)]',
}: PropsWithChildren<{ className?: string; colorClass?: string }>) {
  return (
    <div className={`crop-frame ${colorClass} ${className}`}>
      <span className="crop-bl" />
      <span className="crop-br" />
      {children}
    </div>
  )
}
