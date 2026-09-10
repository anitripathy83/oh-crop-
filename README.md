# OH CROP! — Design Crime

A logo-reveal game for the Graphic Design Club's membership stall at BITS Pilani Dubai
Campus. Players watch a heavily distorted brand mark sharpen over ~8–10 seconds and
race to name it before it fully resolves.

## Run it locally

```bash
npm install
npm run dev
```

## Deploy

Push this folder to a GitHub repo, then import it on **Vercel** or **Netlify** — both
config files (`vercel.json`, `netlify.toml`) are already set up to run `npm run build`
and serve `dist/`. No environment variables are required for the prototype.

## What's built

- Full flow: landing → name entry → pre-game hype → 10-round game → results →
  leaderboard → membership CTA, plus an attract-mode idle screen for the stall.
- Signature reveal mechanic: blur, crop, scale, rotation and skew all animate
  together (see `src/components/LogoReveal.tsx`), tuned per difficulty tier
  (easy/medium/hard/legendary).
- Scoring: base XP + time bonus + streak bonus + a Perfect Crop bonus for very fast
  correct answers, with confetti and a distinct SFX.
- 58 curated brands across 7 categories, with same-category distractors so answer
  choices are never a giveaway (`src/lib/session.ts`).
- Local leaderboard (`src/lib/leaderboard.ts`), name sanitization, and a "your rank"
  fallback when you're outside the top 10.
- Sound toggle, fullscreen toggle, `prefers-reduced-motion` support, visible focus
  states, and large touch targets throughout.
- Zero-asset audio: built-in synthesized SFX (`src/lib/audio.ts`) so the game has real
  feedback even before a final soundtrack exists.

## Before the stall — read this

**Logos are placeholders, on purpose.** Real brand logos are trademarked/copyrighted
assets, and the handover brief itself says not to ship a brand mark until its usage
rights are confirmed. Rather than scrape logos, every brand renders through an
*original* wordmark treatment (`src/components/BrandMark.tsx`) — brand-accurate color
and typography, but not a reproduction of the real logo artwork. This keeps the game
fully playable and demoable right now.

To swap in real, licensed logos for the live stall:
1. Get permission/press-kit assets for each brand you want to use.
2. Drop the files in `public/assets/logos/`.
3. Add an `asset` field to that brand's entry in `src/data/brands.ts`.
4. Update `BrandMark.tsx` to render an `<img>` when `asset` is set (falls back to the
   wordmark otherwise).
5. Log the source and license for each file in `ASSET_LICENSES.md`.

**Leaderboard is local for now.** It's stored in the browser via `localStorage`, which
is fine for one laptop but won't sync across multiple stall stations, and isn't
validated server-side. For the live event, swap `src/lib/leaderboard.ts` for a small
Supabase or Firebase table (a few functions — `submitScore` / `getLeaderboard` — so the
swap is contained to one file) and move score validation server-side.

**Soundtrack is pluggable.** Drop the final track at `public/audio/theme.mp3` — the
game auto-detects it and plays it on loop, muted-safe and starting only after the first
tap (autoplay policy compliant). No code changes needed.

**Set the membership link.** `MEMBERSHIP_URL` in `src/App.tsx` is currently empty —
add the sign-up URL there once it exists, and it'll appear as a button on the join
screen. A QR-code placeholder is already on that screen.

## Soundtrack direction ideas

The brief asks for "8-bit arcade × meme culture × chaotic college energy," calm intro
building into a ridiculous peak, then looping cleanly. A few directions worth trying
with a composer or a royalty-free library (avoid anything that mimics an existing
copyrighted meme song note-for-note):

1. **"Crunch Mode"** — chiptune square-wave lead over a four-on-the-floor kick, tempo
   creeps up every 15 seconds like a countdown getting more panicked. Fits the
   deadline/crop-mark theme literally.
2. **"Cutting Room Floor"** — lo-fi 8-bit boom-bap with a vinyl-crackle layer and a
   glitchy vocal chop shouting "OH CROP!" as a recurring stab, closer to a meme
   soundboard than a song.
3. **"CMYK Rave"** — four short motifs, one per print color (Cyan/Magenta/Yellow/Key),
   each introduced as a new instrument layer through the reveal, so the mix visually
   maps to the CMYK/registration-mark art direction.
4. **"Design Deadline"** — starts as calm elevator-music (the "waiting room" of a
   design crit), then at 30s a distorted air-horn drop flips it into a fast chiptune
   chase — mirrors the distorted → clear gameplay arc in the music itself.
5. **"Perfect Crop Anthem"** — built around a short call-and-response hook ("Oh Crop!"
   / "Design Crime!") so it's easy for people at the stall to shout along with, the
   way a stadium chant works.

Any of these can loop cleanly by looping only the "escalation" section once the intro
has played once, so repeat plays don't feel like they're restarting from a slow intro
every time.

## Known trade-offs (given the timeline)

- Difficulty curve is a light re-sort by tier, not a strict per-round difficulty
  schedule — tune `DIFFICULTY_ORDER` in `src/lib/session.ts` if you want it stricter.
- No backend yet — see "Leaderboard is local for now" above.
- No admin reset UI yet for the leaderboard; for now, clear the browser's
  `localStorage` key `ohcrop_leaderboard_v1`.
