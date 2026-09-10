import type { Brand } from '../types'

const FONT_CLASS: Record<Brand['fontFamily'], string> = {
  serif: 'font-serif',
  sans: 'font-sans',
  mono: 'font-mono-ui',
  display: 'font-display',
  script: 'italic font-serif',
}

const TRACKING: Record<Brand['letterSpacing'], string> = {
  tight: 'tracking-tight',
  normal: 'tracking-normal',
  wide: 'tracking-wide',
  wider: 'tracking-[0.2em]',
}

function shapeClass(shape: Brand['shape']): string {
  switch (shape) {
    case 'roundel':
      return 'rounded-full aspect-square'
    case 'box':
      return 'rounded-none'
    case 'diamond':
      return 'rotate-45'
    case 'shield':
      return '[clip-path:polygon(50%_0%,100%_15%,100%_60%,50%_100%,0%_60%,0%_15%)]'
    case 'ribbon':
      return 'skew-x-[-8deg]'
    default:
      return 'rounded-md'
  }
}

/**
 * Renders an ORIGINAL wordmark treatment (not the brand's real trademarked logo art) —
 * see the licensing note at the top of src/data/brands.ts. If `asset` is set on the
 * brand data in a future revision, swap this for an <img> pointing at a licensed file.
 */
export function BrandMark({ brand }: { brand: Brand }) {
  const isDiamond = brand.shape === 'diamond'
  return (
    <div
      className="w-full h-full flex items-center justify-center p-6"
      style={{ background: brand.bg }}
    >
      <div
        className={`flex items-center justify-center px-8 py-6 ${shapeClass(brand.shape)}`}
        style={{
          background: brand.shape === 'plain' ? 'transparent' : `color-mix(in srgb, ${brand.color} 10%, transparent)`,
          border: brand.shape === 'plain' ? 'none' : `3px solid ${brand.color}`,
          minWidth: brand.shape === 'roundel' || brand.shape === 'diamond' ? '55%' : undefined,
        }}
      >
        <span
          className={`${FONT_CLASS[brand.fontFamily]} ${TRACKING[brand.letterSpacing]} text-center leading-none select-none`}
          style={{
            color: brand.color,
            fontSize: brand.name.length > 12 ? '1.35rem' : '2rem',
            textTransform: brand.uppercase ? 'uppercase' : 'none',
            transform: isDiamond ? 'rotate(-45deg)' : undefined,
            fontWeight: brand.fontFamily === 'sans' || brand.fontFamily === 'display' ? 700 : 500,
          }}
        >
          {brand.name}
        </span>
      </div>
    </div>
  )
}
