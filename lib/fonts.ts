import {
  Atkinson_Hyperlegible_Mono,
  Atkinson_Hyperlegible_Next,
  Bricolage_Grotesque,
} from "next/font/google"

/*
 * DS §5. Brand faces come from next/font (small, preloaded). Script fallbacks (Noto per script)
 * come from Fontsource in app/globals.css instead: next/font/google downloads every CJK slice at
 * build time (hundreds of files), which is slow and fails the build on one bad fetch. Fontsource
 * ships them with unicode-range, so a browser only downloads e.g. the Japanese slices when a
 * lesson actually contains Japanese.
 */

export const bricolage = Bricolage_Grotesque({
  subsets: ["latin", "latin-ext", "vietnamese"],
  axes: ["opsz"],
  variable: "--font-bricolage",
})

export const atkinson = Atkinson_Hyperlegible_Next({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  // next/font has no fallback metrics for Atkinson yet; skip the generated fallback face.
  adjustFontFallback: false,
  variable: "--font-atkinson",
})

export const atkinsonMono = Atkinson_Hyperlegible_Mono({
  subsets: ["latin", "latin-ext"],
  adjustFontFallback: false,
  variable: "--font-atkinson-mono",
})

export const fontVariables = [bricolage, atkinson, atkinsonMono].map((font) => font.variable).join(" ")
