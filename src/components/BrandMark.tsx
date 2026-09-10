import { useState, useEffect } from 'react'
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
 * Authentic brand logo renderer with graceful typography fallback.
 *
 * Vector SVGs are bundled locally under /assets/logos/<id>.svg for complete offline
 * reliability and 100% trademark fidelity. If an asset fails to load, the component
 * falls back to the custom-styled wordmark so gameplay is never interrupted.
 */
export function BrandMark({ brand }: { brand: Brand }) {
  const [logoFailed, setLogoFailed] = useState(false)

  useEffect(() => {
    setLogoFailed(false)
  }, [brand.id, brand.asset])

  const assetUrl = brand.asset
    ? brand.asset.startsWith('http')
      ? brand.asset
      : `${import.meta.env.BASE_URL.replace(/\/$/, '')}/${brand.asset.replace(/^\.?\//, '')}`
    : undefined

  const showLogo = Boolean(assetUrl) && !logoFailed

  return (
    <div
      className="w-full h-full flex items-center justify-center p-6"
      style={{ background: brand.bg }}
    >
      {showLogo ? (
        <div className="w-full h-full flex items-center justify-center">
          <img
            src={assetUrl}
            alt={`${brand.name} logo`}
            draggable={false}
            onError={() => setLogoFailed(true)}
            className="max-w-[76%] max-h-[76%] w-auto h-auto object-contain select-none"
            style={{
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
