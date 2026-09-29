"use client"

import { useEffect, useState } from "react"

/**
 * Opens the print dialog once fonts and every image have loaded (architecture §4), so the PDF
 * never catches a fallback font or a half-decoded picture. Also sets document.title, which
 * browsers use as the PDF's default file name.
 */
export function usePrintWhenReady(ready: boolean, title: string) {
  const [printed, setPrinted] = useState(false)

  useEffect(() => {
    if (!ready || printed) return
    document.title = title
    let cancelled = false

    async function waitAndPrint() {
      await document.fonts.ready
      const images = Array.from(document.images)
      await Promise.all(images.map((img) => (img.complete ? Promise.resolve() : img.decode().catch(() => {}))))
      if (cancelled) return
      setPrinted(true)
      window.print()
    }
    void waitAndPrint()
    return () => {
      cancelled = true
    }
  }, [ready, printed, title])

  return { print: () => window.print() }
}
