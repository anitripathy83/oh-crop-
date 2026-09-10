const COLORS = ['#FFC93C', '#FF4F64', '#6FCB4A', '#F2EFE6']

export function PixelConfetti({ activeKey }: { activeKey: number }) {
  const pieces = Array.from({ length: 24 }).map((_, i) => {
    const left = Math.random() * 100
    const delay = Math.random() * 0.15
    const color = COLORS[i % COLORS.length]
    const size = 4 + Math.round(Math.random() * 4)
    return { id: `${activeKey}-${i}`, left, delay, color, size }
  })

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-30">
      {pieces.map((p) => (
        <span
          key={p.id}
          className="absolute top-1/3"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            background: p.color,
            animation: `confetti-fall 700ms ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  )
}
