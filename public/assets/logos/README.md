Drop licensed brand logo files here (e.g. gucci.svg, prada.svg) once usage rights are
confirmed for the stall build. Then in src/data/brands.ts add an `asset` path to that
brand's entry and update src/components/BrandMark.tsx to render an <img> when `asset`
is present, falling back to the wordmark otherwise. See ASSET_LICENSES.md at the repo
root for how to track source/license per file.
