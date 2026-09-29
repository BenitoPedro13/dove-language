import "server-only"

import { readFile } from "node:fs/promises"
import path from "node:path"

/**
 * /brand reads the palette straight out of app/globals.css so the documentation can never drift
 * from the tokens the slides use. Server-only (build time).
 */
export async function readPalette(): Promise<Record<string, string>> {
  const css = await readFile(path.join(process.cwd(), "app/globals.css"), "utf8")
  const palette: Record<string, string> = {}
  for (const match of css.matchAll(/--dove-([a-z-]+):\s*(#[0-9a-f]{6})\b/gi)) {
    palette[match[1]] = match[2].toUpperCase()
  }
  return palette
}
