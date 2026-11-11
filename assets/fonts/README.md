Fonts for the Open Graph images (src/lib/og.tsx), not served to browsers.

- Manrope 500 and 800 (SIL Open Font License 1.1), from @fontsource/manrope
- Geist Mono 400 (SIL Open Font License 1.1), from @fontsource/geist-mono

Each was subset to Latin with its GSUB/GPOS/GDEF tables removed, because next/og
cannot read some of their substitution lookups.
