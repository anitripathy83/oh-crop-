import type { Brand } from '../types'

/**
 * IMPORTANT — READ BEFORE PRODUCTION USE
 * --------------------------------------
 * Per the handover's own asset rule (section 7 & 27), real brand logos may only ship
 * in production once their usage rights are confirmed — scraped or unlicensed marks
 * are not allowed. This file therefore defines an ORIGINAL wordmark treatment per
 * brand (name + category-true color + typography + badge shape) instead of
 * reproducing any brand's actual trademarked logo artwork.
 *
 * To swap in a real, licensed logo for the stall build: drop the file at
 * `/public/assets/logos/<id>.svg` and set `asset: '/assets/logos/<id>.svg'` below —
 * the <LogoReveal> component will render that image instead of the wordmark
 * automatically. Track source/license per asset in ASSET_LICENSES.md.
 */

export const BRANDS: Brand[] = [
  // Luxury / Fashion
  { id: 'gucci', name: 'Gucci', category: 'Luxury / Fashion', difficulty: 'medium', color: '#0B3B24', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wider', shape: 'roundel', uppercase: true },
  { id: 'prada', name: 'Prada', category: 'Luxury / Fashion', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'plain', uppercase: true },
  { id: 'dolce-gabbana', name: 'Dolce & Gabbana', category: 'Luxury / Fashion', difficulty: 'hard', color: '#8A1538', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'normal', shape: 'plain', uppercase: true },
  { id: 'louis-vuitton', name: 'Louis Vuitton', category: 'Luxury / Fashion', difficulty: 'medium', color: '#5B4630', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'diamond', uppercase: true },
  { id: 'chanel', name: 'Chanel', category: 'Luxury / Fashion', difficulty: 'easy', color: '#111111', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wider', shape: 'plain', uppercase: true },
  { id: 'dior', name: 'Dior', category: 'Luxury / Fashion', difficulty: 'easy', color: '#111111', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wider', shape: 'plain', uppercase: true , asset: '/assets/logos/dior.svg' },
  { id: 'balenciaga', name: 'Balenciaga', category: 'Luxury / Fashion', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: true },
  { id: 'versace', name: 'Versace', category: 'Luxury / Fashion', difficulty: 'medium', color: '#B8860B', bg: '#111111', fontFamily: 'serif', letterSpacing: 'wide', shape: 'roundel', uppercase: true },
  { id: 'burberry', name: 'Burberry', category: 'Luxury / Fashion', difficulty: 'medium', color: '#2B2118', bg: '#D8C7A1', fontFamily: 'serif', letterSpacing: 'wider', shape: 'shield', uppercase: true },
  { id: 'saint-laurent', name: 'Saint Laurent', category: 'Luxury / Fashion', difficulty: 'hard', color: '#111111', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'tight', shape: 'plain', uppercase: true },
  { id: 'fendi', name: 'Fendi', category: 'Luxury / Fashion', difficulty: 'medium', color: '#5B3A29', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'plain', uppercase: true },
  { id: 'bottega-veneta', name: 'Bottega Veneta', category: 'Luxury / Fashion', difficulty: 'hard', color: '#2E5E3A', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'wide', shape: 'plain', uppercase: true },
  { id: 'valentino', name: 'Valentino', category: 'Luxury / Fashion', difficulty: 'medium', color: '#A6192E', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'plain', uppercase: true },
  { id: 'givenchy', name: 'Givenchy', category: 'Luxury / Fashion', difficulty: 'hard', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'wider', shape: 'plain', uppercase: true },
  { id: 'loewe', name: 'Loewe', category: 'Luxury / Fashion', difficulty: 'hard', color: '#B45A2A', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'tight', shape: 'diamond', uppercase: true },
  { id: 'off-white', name: 'Off-White', category: 'Streetwear', difficulty: 'medium', color: '#111111', bg: '#FFFFFF', fontFamily: 'mono', letterSpacing: 'wide', shape: 'box', uppercase: true },
  { id: 'moncler', name: 'Moncler', category: 'Luxury / Fashion', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'roundel', uppercase: true },
  { id: 'jacquemus', name: 'Jacquemus', category: 'Luxury / Fashion', difficulty: 'hard', color: '#C9A66B', bg: '#111111', fontFamily: 'serif', letterSpacing: 'wide', shape: 'plain', uppercase: false },

  // Streetwear
  { id: 'supreme', name: 'Supreme', category: 'Streetwear', difficulty: 'easy', color: '#FFFFFF', bg: '#DA291C', fontFamily: 'sans', letterSpacing: 'tight', shape: 'box', uppercase: false },
  { id: 'stussy', name: 'Stüssy', category: 'Streetwear', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'script', letterSpacing: 'normal', shape: 'plain', uppercase: false },
  { id: 'palace', name: 'Palace', category: 'Streetwear', difficulty: 'hard', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'diamond', uppercase: false },
  { id: 'bape', name: 'A Bathing Ape', category: 'Streetwear', difficulty: 'medium', color: '#2E7D32', bg: '#111111', fontFamily: 'display', letterSpacing: 'tight', shape: 'box', uppercase: true },
  { id: 'fear-of-god', name: 'Fear of God', category: 'Streetwear', difficulty: 'hard', color: '#111111', bg: '#DCD5C6', fontFamily: 'serif', letterSpacing: 'wider', shape: 'plain', uppercase: true },
  { id: 'carhartt-wip', name: 'Carhartt WIP', category: 'Streetwear', difficulty: 'medium', color: '#5B3A29', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: false },
  { id: 'stone-island', name: 'Stone Island', category: 'Streetwear', difficulty: 'hard', color: '#111111', bg: '#B7C4C2', fontFamily: 'mono', letterSpacing: 'normal', shape: 'roundel', uppercase: false },
  { id: 'new-balance', name: 'New Balance', category: 'Streetwear', difficulty: 'easy', color: '#8A1538', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: true , asset: '/assets/logos/new-balance.svg' },
  { id: 'vans', name: 'Vans', category: 'Streetwear', difficulty: 'easy', color: '#111111', bg: '#F2EFE6', fontFamily: 'script', letterSpacing: 'tight', shape: 'plain', uppercase: true },
  { id: 'converse', name: 'Converse', category: 'Streetwear', difficulty: 'easy', color: '#111111', bg: '#F2EFE6', fontFamily: 'script', letterSpacing: 'normal', shape: 'roundel', uppercase: false },

  // Design & Creative Tools
  { id: 'adobe', name: 'Adobe', category: 'Design & Creative Tools', difficulty: 'easy', color: '#FFFFFF', bg: '#DA1F26', fontFamily: 'sans', letterSpacing: 'tight', shape: 'diamond', uppercase: true },
  { id: 'figma', name: 'Figma', category: 'Design & Creative Tools', difficulty: 'easy', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'normal', shape: 'plain', uppercase: false , asset: '/assets/logos/figma.svg' },
  { id: 'canva', name: 'Canva', category: 'Design & Creative Tools', difficulty: 'easy', color: '#00C4CC', bg: '#111111', fontFamily: 'sans', letterSpacing: 'normal', shape: 'plain', uppercase: false },
  { id: 'behance', name: 'Behance', category: 'Design & Creative Tools', difficulty: 'medium', color: '#0057FF', bg: '#111111', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: false , asset: '/assets/logos/behance.svg' },
  { id: 'dribbble', name: 'Dribbble', category: 'Design & Creative Tools', difficulty: 'medium', color: '#EA4C89', bg: '#111111', fontFamily: 'sans', letterSpacing: 'normal', shape: 'roundel', uppercase: false , asset: '/assets/logos/dribbble.svg' },
  { id: 'autodesk', name: 'Autodesk', category: 'Design & Creative Tools', difficulty: 'hard', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'wide', shape: 'plain', uppercase: false , asset: '/assets/logos/autodesk.svg' },
  { id: 'blender', name: 'Blender', category: 'Design & Creative Tools', difficulty: 'medium', color: '#EA7600', bg: '#111111', fontFamily: 'sans', letterSpacing: 'normal', shape: 'roundel', uppercase: false , asset: '/assets/logos/blender.svg' },
  { id: 'pantone', name: 'Pantone', category: 'Design & Creative Tools', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'mono', letterSpacing: 'wide', shape: 'box', uppercase: true },

  // Automotive
  { id: 'porsche', name: 'Porsche', category: 'Automotive', difficulty: 'medium', color: '#B8860B', bg: '#111111', fontFamily: 'serif', letterSpacing: 'wider', shape: 'shield', uppercase: true , asset: '/assets/logos/porsche.svg' },
  { id: 'ferrari', name: 'Ferrari', category: 'Automotive', difficulty: 'easy', color: '#FFC72C', bg: '#8A1538', fontFamily: 'serif', letterSpacing: 'wide', shape: 'shield', uppercase: true , asset: '/assets/logos/ferrari.svg' },
  { id: 'lamborghini', name: 'Lamborghini', category: 'Automotive', difficulty: 'medium', color: '#B8860B', bg: '#111111', fontFamily: 'serif', letterSpacing: 'wide', shape: 'shield', uppercase: true , asset: '/assets/logos/lamborghini.svg' },
  { id: 'bmw', name: 'BMW', category: 'Automotive', difficulty: 'easy', color: '#0B3B8C', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'wider', shape: 'roundel', uppercase: true , asset: '/assets/logos/bmw.svg' },
  { id: 'mercedes', name: 'Mercedes-Benz', category: 'Automotive', difficulty: 'easy', color: '#111111', bg: '#C7CACB', fontFamily: 'sans', letterSpacing: 'wide', shape: 'roundel', uppercase: true },
  { id: 'audi', name: 'Audi', category: 'Automotive', difficulty: 'medium', color: '#B8860B', bg: '#111111', fontFamily: 'sans', letterSpacing: 'wider', shape: 'plain', uppercase: true , asset: '/assets/logos/audi.svg' },
  { id: 'rolls-royce', name: 'Rolls-Royce', category: 'Automotive', difficulty: 'hard', color: '#111111', bg: '#C7CACB', fontFamily: 'serif', letterSpacing: 'wider', shape: 'plain', uppercase: true , asset: '/assets/logos/rolls-royce.svg' },
  { id: 'bentley', name: 'Bentley', category: 'Automotive', difficulty: 'hard', color: '#0B3B24', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'shield', uppercase: true , asset: '/assets/logos/bentley.svg' },
  { id: 'aston-martin', name: 'Aston Martin', category: 'Automotive', difficulty: 'hard', color: '#0B6B4F', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'shield', uppercase: true , asset: '/assets/logos/aston-martin.svg' },
  { id: 'maserati', name: 'Maserati', category: 'Automotive', difficulty: 'hard', color: '#111111', bg: '#0B3B8C', fontFamily: 'serif', letterSpacing: 'wide', shape: 'shield', uppercase: true , asset: '/assets/logos/maserati.svg' },

  // Food & Lifestyle
  { id: 'starbucks', name: 'Starbucks', category: 'Food & Lifestyle', difficulty: 'easy', color: '#FFFFFF', bg: '#00704A', fontFamily: 'sans', letterSpacing: 'wide', shape: 'roundel', uppercase: false , asset: '/assets/logos/starbucks.svg' },
  { id: 'toblerone', name: 'Toblerone', category: 'Food & Lifestyle', difficulty: 'medium', color: '#FFC72C', bg: '#8A1538', fontFamily: 'serif', letterSpacing: 'wide', shape: 'plain', uppercase: true },
  { id: 'haagen-dazs', name: 'Häagen-Dazs', category: 'Food & Lifestyle', difficulty: 'hard', color: '#8A1538', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wide', shape: 'plain', uppercase: true },
  { id: 'oreo', name: 'Oreo', category: 'Food & Lifestyle', difficulty: 'easy', color: '#F2EFE6', bg: '#0B3B8C', fontFamily: 'sans', letterSpacing: 'wide', shape: 'roundel', uppercase: true },
  { id: 'kitkat', name: 'KitKat', category: 'Food & Lifestyle', difficulty: 'easy', color: '#F2EFE6', bg: '#B8171F', fontFamily: 'sans', letterSpacing: 'tight', shape: 'box', uppercase: true },
  { id: 'pringles', name: 'Pringles', category: 'Food & Lifestyle', difficulty: 'medium', color: '#B8171F', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: false },
  { id: 'heinz', name: 'Heinz', category: 'Food & Lifestyle', difficulty: 'medium', color: '#F2EFE6', bg: '#8A1538', fontFamily: 'script', letterSpacing: 'normal', shape: 'ribbon', uppercase: false },

  // Tech & Culture
  { id: 'sony', name: 'Sony', category: 'Tech & Culture', difficulty: 'easy', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'wide', shape: 'plain', uppercase: true , asset: '/assets/logos/sony.svg' },
  { id: 'nintendo', name: 'Nintendo', category: 'Tech & Culture', difficulty: 'easy', color: '#F2EFE6', bg: '#B8171F', fontFamily: 'script', letterSpacing: 'normal', shape: 'plain', uppercase: false },
  { id: 'playstation', name: 'PlayStation', category: 'Tech & Culture', difficulty: 'medium', color: '#F2EFE6', bg: '#0B3B8C', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: false , asset: '/assets/logos/playstation.svg' },
  { id: 'spotify', name: 'Spotify', category: 'Tech & Culture', difficulty: 'easy', color: '#111111', bg: '#1DB954', fontFamily: 'sans', letterSpacing: 'tight', shape: 'roundel', uppercase: false , asset: '/assets/logos/spotify.svg' },
  { id: 'polaroid', name: 'Polaroid', category: 'Tech & Culture', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'wide', shape: 'box', uppercase: false },
  { id: 'kodak', name: 'Kodak', category: 'Tech & Culture', difficulty: 'medium', color: '#F2EFE6', bg: '#B8171F', fontFamily: 'sans', letterSpacing: 'tight', shape: 'box', uppercase: true , asset: '/assets/logos/kodak.svg' },
  { id: 'gopro', name: 'GoPro', category: 'Tech & Culture', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: false },
  { id: 'jbl', name: 'JBL', category: 'Tech & Culture', difficulty: 'hard', color: '#F2EFE6', bg: '#F58220', fontFamily: 'sans', letterSpacing: 'tight', shape: 'box', uppercase: true , asset: '/assets/logos/jbl.svg' },

  // Culture & Icons
  { id: 'the-north-face', name: 'The North Face', category: 'Culture & Icons', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'sans', letterSpacing: 'tight', shape: 'plain', uppercase: false , asset: '/assets/logos/the-north-face.svg' },
  { id: 'nasa', name: 'NASA', category: 'Culture & Icons', difficulty: 'medium', color: '#F2EFE6', bg: '#0B3B8C', fontFamily: 'sans', letterSpacing: 'wider', shape: 'roundel', uppercase: true , asset: '/assets/logos/nasa.svg' },
  { id: 'lego', name: 'LEGO', category: 'Culture & Icons', difficulty: 'easy', color: '#F2EFE6', bg: '#B8171F', fontFamily: 'display', letterSpacing: 'tight', shape: 'box', uppercase: true },
  { id: 'nat-geo', name: 'National Geographic', category: 'Culture & Icons', difficulty: 'hard', color: '#111111', bg: '#FFC72C', fontFamily: 'serif', letterSpacing: 'tight', shape: 'box', uppercase: true },
  { id: 'mtv', name: 'MTV', category: 'Culture & Icons', difficulty: 'medium', color: '#F2EFE6', bg: '#111111', fontFamily: 'display', letterSpacing: 'tight', shape: 'box', uppercase: true },
  { id: 'rolling-stone', name: 'Rolling Stone', category: 'Culture & Icons', difficulty: 'hard', color: '#111111', bg: '#F2EFE6', fontFamily: 'display', letterSpacing: 'tight', shape: 'plain', uppercase: true },
  { id: 'vogue', name: 'Vogue', category: 'Culture & Icons', difficulty: 'medium', color: '#111111', bg: '#F2EFE6', fontFamily: 'serif', letterSpacing: 'wider', shape: 'plain', uppercase: true },
]

export const BRANDS_BY_ID: Record<string, Brand> = Object.fromEntries(
  BRANDS.map((b) => [b.id, b])
)
