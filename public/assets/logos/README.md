# Brand logos

`BrandMark.tsx` now renders real brand marks using individually mapped Simple Icons
SVG URLs from the pinned `16.30.0` CDN release.

The URLs are intentionally mapped per brand in `src/data/brands.ts`, rather than
constructed from the display name, because Simple Icons slugs do not always match the
game's internal brand IDs.

For production/event use, review the Simple Icons disclaimer and each brand's own
trademark/brand-guideline requirements. If a cleared local asset is preferred, replace
the corresponding `asset` URL with `/assets/logos/<id>.svg`; the component supports
local paths as well.

If an asset fails to load, the component falls back to the original wordmark treatment.
