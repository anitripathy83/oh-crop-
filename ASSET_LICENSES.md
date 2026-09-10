# Brand Asset & Trademark Provenance

## Overview
*OH CROP! — Design Crime* includes vector representations of 68 globally recognized brand logos, wordmarks, and visual identities. All assets are located locally in `/public/assets/logos/<id>.svg`.

## Trademark Ownership & Fair Use Notice
- All brand names, logos, wordmarks, emblems, and visual trademarks depicted within this educational game remain the intellectual property and registered trademarks of their respective copyright and trademark owners.
- The use of these trademarks within *OH CROP!* is strictly for non-commercial educational, parody, identification, and design-literacy gaming purposes (such as interactive design exhibitions and student showcase events at BITS Pilani Dubai Campus).
- No affiliation, sponsorship, endorsement, or commercial association with any of the trademark owners is claimed or implied.

## Local Vector Assets (`/public/assets/logos/`)
In previous revisions, external third-party CDN links suffered from frequent HTTP 404 broken links, strict CORS restrictions, and flat monochrome rendering that degraded visual recognition.

All 68 brand marks are now bundled locally as high-fidelity SVG vectors adhering to the authentic geometry, multi-color palettes, and aspect ratios of each official mark:
1. **Automotive**: Ferrari (Prancing horse shield & tricolor), Porsche (Stuttgart crest & antlers), Lamborghini (Taurus bull shield & gold script), BMW (Bavarian quad-roundel & silver bezel), Mercedes-Benz (Three-pointed chrome star ring), Tesla (Stylized T-shield), Audi (Four interlocking rings).
2. **Design & Creative Tools**: Adobe (Signature red A cut-out badge), Figma (5-piece iconic color segments), Canva (Signature teal script mark), Behance (Official blue geometric logotype), Dribbble (Ballerina pink basketball monogram), Blender (Iconic blue/orange kinetic mark), Autodesk (Current folded ribbon mark), Pantone (Two-tone swatch frame).
3. **Luxury / Fashion**: Gucci (Interlocking GG monogram), Chanel (Opposing interlocked CC), Louis Vuitton (LV monogram & quatrefoil), Prada (Iconic Savoy coat of arms & rope badge), Dior (Classic typography), Balenciaga, Versace (Medusa head emblem), Burberry (Equestrian Knight), Saint Laurent (Cassandre YSL vertical monogram), Fendi (Inverted FF Zucca mark), Bottega Veneta, Valentino (V-ring logo), Givenchy (4G quad-symmetric emblem), Loewe (Anagram quadruple-L), Moncler (Cockerel & mountain shield), Jacquemus.
4. **Streetwear**: Supreme (Futura Heavy Oblique red box logo), Stüssy (Hand-drawn Shawn Stussy tag mark), Palace (Penrose Tri-Ferg triangle), BAPE (Ape Head silhouette), Fear of God, Carhartt WIP (Iconic golden wave/C-logo), Stone Island (Compass rose badge), New Balance (Running N speed stripes), Vans ("Off the Wall" skateboard crest), Converse (Chuck Taylor All Star circle & chevron).
5. **Tech Giants & Audio/Music**: Apple (Signature bitten apple), Google (4-color G mark), Microsoft (4-tile color window), Meta (Infinity loop), Spotify (Streaming sound waves badge), Marshall (Script amplifier logo), Fender (Classic spaghetti script), Roland, Moog (Modular synth waveform logotype), SoundCloud (Cloud audio bars).
6. **Consumer Brands & Global Giants**: Nike (The iconic Swoosh), Adidas (Three Stripes mountain mark), Red Bull (Charging bulls against the golden sun), Coca-Cola (Spencerian script wave ribbon), Starbucks (Two-tailed Siren roundel), McDonald's (Golden Arches), Pepsi (Globe emblem with red/white/blue wave), Lego (Bubbled red toy logo), Rolex (Five-point coronet), NASA (Classic Insignia "Meatball").

## Runtime Resiliency
Each `<BrandMark>` component retains an automatic fallback to synthesized CSS wordmarks if an asset fails to load, ensuring gameplay rounds and reveal sequences never fail.
