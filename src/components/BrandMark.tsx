import { useState } from 'react'
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

/**
 * Real-logo mode.
 *
 * The game uses individually mapped SVG marks from Simple Icons' public CDN.
 * We keep the URL on the brand rather than bundling the whole icon library.
 * If a mark is unavailable, the component falls back to the original wordmark
 * so a missing third-party asset can never break a round.
 */
export function BrandMark({ brand }: { brand: Brand }) {
  const [logoFailed, setLogoFailed] = useState(false)

  const showLogo = Boolean(brand.asset) && !logoFailed

  return (
    <div
      className="w-full h-full flex items-center justify-center p-6"
      style={{ background: brand.bg }}
    >
      {showLogo ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={brand.asset}
            alt=""
            draggable={false}
            onError={() => setLogoFailed(true)}
            className="max-w-[72%] max-h-[72%] w-auto h-auto object-contain select-none"
            style={{
              color: brand.color,
              filter: 'none',
            }}
          />
        </div>
      ) : (
        <div
          className="flex items-center justify-center px-8 py-6"
          style={{
            color: brand.color,
            minWidth: '55%',
          }}
        >
          <span
            className={`${FONT_CLASS[brand.fontFamily]} ${TRACKING[brand.letterSpacing]} text-center leading-none select-none`}
            style={{
              color: brand.color,
              fontSize: brand.name.length > 12 ? '1.35rem' : '2rem',
              textTransform: brand.uppercase ? 'uppercase' : 'none',
              fontWeight: brand.fontFamily === 'sans' || brand.fontFamily === 'display' ? 700 : 500,
            }}
          >
            {brand.name}
          </span>
        </div>
      )}
    </div>
  )
}
